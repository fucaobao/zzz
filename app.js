var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var history = require('./models/history');
var routes = require('./routes/index');
var users = require('./routes/users');
var handler = require('./routes/file');
var settings = require('./config/settings');
var app = express();

app.use(session({
    secret: settings.db.cookieSecret,
    resave: false,
    saveUninitialized: false,
    genid: function(req) {
        return genUUID(); // use UUIDs for session IDs
    },
    key: settings.db,
    cookie: {
        maxAge: settings.db.maxAge
    },
    store: new MongoStore({
        url:'mongodb://' + settings.db.host + ':'+ (settings.db.port || 27017) + '/' + settings.db.db
    })
}));

// view engine setup
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'public'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.post('/upload', handler.upload);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('page/404/404', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('page/404/404', {
        title: '404',
        message: err.message,
        error: {}
    });
});

function genUUID() {
    return Math.random().toString(36).substring(2);
}
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});