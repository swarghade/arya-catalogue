const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})
require('ajv-keywords')(ajv)

const extras = require('../utilities/extras')



// per route config

const route = {
    table : 'subcategory',
    primaryKey: 'id'
}


//const validateGet = ajv.compile(schemas[route.table].GET)

Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))


Router.get('/', Handler.Bless(async (req,res,next) => {

    let sql = `SELECT s.id,s.name,s.image,s.sequence, c.name as category,(SELECT COUNT(*) FROM product p WHERE p.s_id = s.id ) AS count FROM ${route.table} s 
        INNER JOIN 
        category c ON s.c_id = c.id 
	
    
        
        GROUP BY s.id,c.name
        ORDER BY s.sequence
        
        
        ;`

    res.status(200).json({results:  (await Db.query(sql)).rows })
    
}))


module.exports = Router
