var express = require('express'),
    url = require("url"),
    bodyParser = require('body-parser'),
    mongo_url = 'mongodb://localhost:27017/LKStrong',
    mongoose = require('mongoose'),
    db = mongoose.connection,
    app = express(),
    swaggerJSDoc = require('swagger-jsdoc'),
    swaggerUi = require('swagger-ui-express')

var swaggerDefinition = {
    host: 'localhost:8000',
    basePath: '/api'
}

var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./controllers/*.js']
}

var swaggerSpec = swaggerJSDoc(options)

app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

app.use(bodyParser.json())
app.use(require('./controllers'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

mongoose.connect(mongo_url, { useMongoClient: true })
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.listen(8000, function () {
    console.log('Express server listening on port 8000')
})