module.exports = function (app, express) {
    var path = require('path'),
        config = require('../config'),
        url = require("url"),
        mongoose = require('mongoose'),
        db = mongoose.connection,
        cors = require('cors'),
        bodyParser = require('body-parser'),
        swaggerJSDoc = require('swagger-jsdoc'),
        swaggerUi = require('swagger-ui-express'),
        // swagger options
        swaggerDefinition = {
            host: 'lk-strong.bizaccount-dev.os-n3.hw:8000',
            basePath: '/api'
        },
        options = {
            swaggerDefinition: swaggerDefinition,
            apis: ['./controllers/*.js']
        },
        swaggerSpec = swaggerJSDoc(options)

    app.get('/swagger.json', function (req, res) {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }

    app.use(allowCrossDomain);
    app.use(bodyParser.json());
    app.use(require('../controllers'))
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.use(cors({origin: '*'}))
    mongoose.connect(config.get('db:url'), { useMongoClient: true })
    db.on('error', console.error.bind(console, 'MongoDB connection error: '))
};
