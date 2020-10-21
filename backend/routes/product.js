const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})
require('ajv-keywords')(ajv)

const extras = require('../utilities/extras')

const schema = {
    type: 'object',
    properties: {
        s_id: {
            type: 'integer'
        }
    },
    required:['s_id']
}

const validatePost = ajv.compile(schema)

// per route config

const route = {
    table : 'product',
    primaryKey: 'id'
}


//const validateGet = ajv.compile(schemas[route.table].GET)

Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))


Router.post('/', Handler.Bless(async (req,res,next) => {

    console.log(req.body)

    if(validatePost(req.body))
    {
        /*
        let sql = `
        
        SELECT (to_jsonb(p.*)) AS dataList, s.name as sub_name FROM ${route.table} p INNER JOIN subcategory s ON s.id = $1
        WHERE s_id = $1 `*/

        let sql = `
        SELECT s.name AS sub_name,
                s.image AS main_img, 
            (SELECT json_agg(p) FROM product p WHERE s_id = $1)::jsonb AS dataList
        FROM subcategory s WHERE id = $1
        
        `

        let r = (await Db.query(sql,[req.body.s_id])).rows 

        //r[0]

        res.status(200).json({results: r  })
    }
    else
    {
        res.status(500).json(validatePost.errors)
        console.log(`Error ${JSON.stringify(validatePost,'',2)}`)
    }
        

    
    
}))


module.exports = Router
