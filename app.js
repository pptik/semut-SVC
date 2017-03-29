var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database = require('./setup/database');

var debug = require('debug')('semut-svc:server');
var http = require('http');




var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




database.connect(function (err, db) {
    if(err){
        console.log(err);
    } else {
        app.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });

        //---- test


        var port = normalizePort(process.env.PORT || '3030');
        app.set('port', port);
        var server = http.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        function normalizePort(val) {
            var port = parseInt(val, 10);
            if (isNaN(port)) {
                return val;
            }
            if (port >= 0) {
                return port;
            }
            return false;
        }

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }

        app.db = db;
        module.exports = app;
        var index = require('./routes/index');
        var users = require('./routes/users');
        var tracker = require('./routes/tracker');
        var friend = require('./routes/friend');
        var location = require('./routes/location');
        var post = require('./routes/post');
        var emergency = require('./routes/emergency');
        app.use('/', index);
        app.use('/api/users', users);
        app.use('/api/tracker', tracker);
        app.use('/api/friend', friend);
        app.use('/api/location', location);
        app.use('/api/post', post);
        app.use('/api/emergency', emergency);
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
});






