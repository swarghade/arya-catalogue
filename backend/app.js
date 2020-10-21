
const Express = require('express')
const App =  new Express()

const path = require('path')

const cHelmet =  require('./utilities/secure')

const compression = require('compression')


//const compression = require('compression')

App.use(compression({ level : 7 }))

const history = require('connect-history-api-fallback')

require('events').defaultMaxListeners = Infinity

// Variables

const api_path = '/api/v1/'


// essential imports

const Handler = require('./utilities/error')
const Db = require('./db/connect')

// config


App.use(Express.json({
    inflate: true,
    limit: "100kb"
}))


App.use(Express.urlencoded({
    extended: true
}))


App.use(history({
    verbose: false,
    rewrites: [{
        from: /\api\/v1\//,
        to: function(context) {
            return context.parsedUrl.path
        }
    }]
}))


App.use(cHelmet)

// middlewares

App.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080','*','https://bitdefender.com','http://bitdefender.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,application/json');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type-Options','nosniff')

    next();
});

App.use(Express.static('./public'))
App.use(Express.static('./dist/'))

const category = require('./routes/category')
const subcategory = require('./routes/subcategory')
const product = require('./routes/product')

App.use(api_path+'category', category )
App.use(api_path+'subcategory',subcategory)
App.use(api_path+'product',product)




// error handler

App.use((err,req,res,next) => {

    console.log('In error handelr')

    if(!err.statusCode)
        err.statusCode = 500

    if(!err.message)
        err.message = 'Internal Server Error'

    console.log(err)
    
    res.status(err.statusCode).json(err.message)

})


App.listen(80,/* {host: '0.0.0.0'},*/ ()=>{
   console.log('Listening at 80')
})
