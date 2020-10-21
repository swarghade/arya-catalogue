const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})
require('ajv-keywords')(ajv)

const schemas = require('../config/schemas')
const extras = require('../utilities/extras')


const bcrypt = require('bcrypt')



// per route config

const route = {
    table : 'users',
    primaryKey: 'user_id',
    columns : ['user_id',
                'email',
                'password',
                'roles',
                'name'
                ]
    
}





const validatePost = ajv.compile(schemas[route.table].POST)
const validateGet = ajv.compile(schemas[route.table].GET)
const validatePatch = ajv.compile(schemas[route.table].PATCH)
const validateDelete = ajv.compile(schemas[route.table].DELETE)



//overall




Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))



Router.get('/', Handler.Bless(async (req,res,next) => {

   let sql = 
        `SELECT 
            user_id, email, roles, name
        FROM ${route.table}
       
        `
    
   /*if(req.body[route.primaryKey])
   {  
       if(validateGet(req.body))
       {
           sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
           let dbRes = await Db.query(sql,[req.body[route.primaryKey]])
           res.status(dbRes.rows == 0 ? 404 : 200)
           res.json({result: dbRes.rows})
           return;
       }
       else
       {
           res.status(400)
           res.json({errors: validateGet.errors})
           return;
       }
   }*/

    let limit = 99999
    let offset = 0
    sql += `LIMIT $1 OFFSET $2`

    if(req.body.limit)
        limit =  req.body.limit
    
    if(req.body.offset)
        offset = req.body.offset

    console.log(sql)
    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))





Router.post('/', Handler.Bless(async (req,res,next) => {

    if(req.body.roles)
        req.body.roles = JSON.parse(req.body.roles)

    if(validatePost(req.body))
    {
      
        //let { products_headings, ...jc_items } = req.body

        let queryRes = await Db.query(`
        INSERT INTO ${route.table}
        (
            email,
            password,
            roles,
            name

        )
        VALUES(
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *
        `,[

            req.body.email,
            await bcrypt.hash(req.body.password,8),
            JSON.stringify(req.body.roles),
            req.body.name
        ])


    

        res.json({
            results: queryRes.rows,
            rowsAffected: queryRes.rowCount

        })

        
        }
        else
            res.status(400).json({  
                result: false,
                errors: validatePost.errors
            })

}))


Router.patch('/', Handler.Bless(async (req,res,next) => { 

    if(req.body.roles)
        req.body.roles = JSON.parse(req.body.roles)

    if(validatePatch(req.body) )
    {
        
        let queryObj = await generatePatchQuery(req.body)
        let queryRes = await Db.query(queryObj.sql,queryObj.params)

        
    
        let temp = {}

        if(queryRes.rowCount <= 0) {
            res.status(404)
            temp.rowsAffected = false
            temp.message = 'Nothing was changed.'
        }
        else
        {
            temp.rowsAffected = queryRes.rowCount
            temp.message = `Successfully updated ${queryRes.rowCount} row with ${route.primaryKey} ${queryRes.rows[0][route.primaryKey]}`
            res.status(200)
        }
            
        res.json(temp)
    }
    else

    {

        res.status(400).json({
            result: false,  
            errors: validatePatch.errors,
        })

    }

}))



Router.delete('/', Handler.Bless(async (req,res,next) => {
    if(validateDelete(req.body))
    {
        let queryRes = await Db.query(`DELETE FROM ${route.table} WHERE ${route.primaryKey} = $1 RETURNING *`,[req.body[route.primaryKey]])
        let temp = {}

        if(queryRes.rowCount <= 0) {
            res.status(404)
            temp.rowsAffected = false
            temp.message = 'Nothing was changed.'
        }
        else
        {
            temp.rowsAffected = queryRes.rowCount
            temp.message = `Successfully deleted ${queryRes.rowCount} row with ${route.primaryKey} ${queryRes.rows[0][route.primaryKey]}`
            res.status(200)
        }

        res.json(temp)

    }
    else
        res.status(400).json({
            result: false,  
            errors: validateDelete.errors,
        })
    

}))

async function  generatePatchQuery(input){

    let sql = `UPDATE ${route.table} SET`
    let tempArr = []
    let cleanObj =  extras.filterSchema(route.columns,input,[route.primaryKey])

    console.log('c ->'+JSON.stringify(cleanObj
        ))
   
    
    /*
    Object.keys(cleanObj).forEach( async (k,i,a) => { 

            if(k == 'password')
            {
                console.log('in')
                let h = await bcrypt.hash(cleanObj[k],8)
                tempArr.push( h )
                console.log(h)

            }
               
            else
                tempArr.push(cleanObj[k])
            sql += ` ${k} =  $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
    } )
    */

    let i  = 0
    let a =  Object.keys(cleanObj)
    for( k in cleanObj )
    {
        console.log(k)

        if(k == 'password')
            {
                console.log('in')
                let h = await bcrypt.hash(cleanObj[k],8)
                tempArr.push( h )
               // console.log(h)

            }
               
            else
                tempArr.push(cleanObj[k])
            sql += ` ${k} =  $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
        
        i++
    }

    tempArr.push(input[route.primaryKey])
    sql += ` WHERE ${route.primaryKey} = $${tempArr.length} RETURNING *`
   // console.log(sql,tempArr)

    return {sql: sql, params: tempArr}
}




module.exports = Router