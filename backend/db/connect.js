const pg = require('pg');

const {Pool } = pg

const types = pg.types;
const moment = require('moment')

types.setTypeParser(20, function(val) {
    return parseInt(val)
  })



types.setTypeParser(1082, function(stringValue) {
    return stringValue === null ? null : moment(stringValue,moment.ISO_8601).format('YYYY-MM-DD')
});




console.log('Connecting to database')

let myPool =  new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123456789',
    database: 'arya',
    port: 5432,
    max: 30,
    idleTimeoutMillis: 3000,
    
});



myPool.on('connect', ( client ) => {

    console.log('Database connection successful')
})


myPool.on('error', (err, client ) => {

    console.log('Database connection failed. Exiting')

    process.exit(99)
})




/*
( async () => {

    console.log('Attempting to login to database')

    try{
        myPool =  await new Pool({
            host: 'localhost',
            user: 'postgres',
            password: '123456789',
            database: 'postgres',
            port: 5432
        });

        if(myPool)
            console.log('Successfully connected to PostgreSQL')
    }
    catch(e)
    {
        console.log('Database connection failed')
        process.exit(99)

    }
    

} )()

*/



module.exports = myPool
 
    
