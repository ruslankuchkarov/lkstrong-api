var express = require('express'),
    app = express(),
    config = require('./config'),
    middleware = require('./middleware')(app, express)

app.listen(8000, function () {
    console.log('Express server listening on port ' + config.get('port'))
})