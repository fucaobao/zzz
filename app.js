/**
 * 
 * @authors wangjiping (wangjiping@myhome.163.com)
 * @date    2016-01-14 09:54:28
 * @version 0.1
 */
var express = require('express');
var path = require('path');             
var favicon = require('serve-favicon');                 //网站icon(favicon.ico)
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');                               //ejs引擎
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/users');                  //处理用户信息(暂时没有处理)
var handler = require('./routes/handler');              //处理上传文件和下载文件
var env = require('./routes/env');                      //获取环境配置信息
var settings = require('./config/config').db;
var util = require('./tools/util');                     //工具对象
var app = express();

app.use(session({
    secret: settings.cookieSecret,
    resave: false,
    saveUninitialized: false,
    genid: function(req) {
        return util.genUUID(); // use UUIDs for session IDs
    },
    key: settings,
    cookie: {
        maxAge: settings.maxAge
    },
    store: new MongoStore({
        url:'mongodb://' + settings.host + ':'+ (settings.port || 27017) + '/' + settings.db
    })
}));

// view engine setup
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'public'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// favicon.ico位置
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
//外部公共文件路径
app.use(express.static(path.join(__dirname, 'public')));

//处理请求
app.use('/', routes);
app.use('/users', users);
app.get('/getEnv', env.getEnv);
app.get('/getModules', handler.getModules);
// app.get('/getFiles', handler.listFiles);
app.get('/download/:id', handler.download);
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
            title: '404',
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
// 处理404请求
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('page/404/404', {
        title: '404',
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});