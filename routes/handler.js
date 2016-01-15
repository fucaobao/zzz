//用来处理"上传文件"和"下载文件"
var fs = require('fs'); //node.js核心的文件处理模块
var url = require('url');
var path = require('path');
var JSFtp = require('jsftp');
var formidable = require('formidable');
var info = require('../models/file');
var util = require('../tools/util');
var app = require('../app');
var settings = require('../config/config');
var handlerConfig = require('../tools/handlerConfig');
// var config = require('../config/appConfig');
exports.upload = function(req, res, next) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = settings.upload.encoding; //设置编码
    form.uploadDir = settings.upload.uploadDir; //设置上传目录
    form.keepExtensions = settings.upload.keepExtensions; //保留后缀
    form.maxFieldsSize = settings.upload.maxFieldsSize; //文件大小
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send({
                'code': 1,
                'message': err || '系统繁忙，请稍后再试'
            });
        }
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
        var env = fields.env; //环境
        var fileid = fields.id; //文件ID
        var platform = fields.platform;
        console.log(platform)
        //配置文件名
        var appConfig = path.join(path.resolve('./'), 'config', 'appConfig_' + env + '.json');
        var filename = files.file.name;
        var name = filename.substring(0, filename.lastIndexOf('.'));
        var size = files.file.size; //文件大小
        // 对文件名进行处理，以应对上传同名文件的情况
        var type = util.getFileType(filename);
        var targetName = name + '-' + util.getTimestamp() + '.' + type;
        if (settings.upload.fileType.indexOf(type) === -1) {
            res.send({
                'code': 1,
                'message': '不支持的格式'
            });
        }
        var oldPath = files.file.path;
        var uploadObj = {
            res: res,
            oldPath: oldPath,
            env: env,
            filename: filename,
            fileid: fileid,
            type: type,
            platform: platform,
            appConfig: appConfig,
            size: size,
            targetName: targetName
        };
        handlerUpload(uploadObj);
    });
};
//获取appConfig中的配置信息
exports.getModules = function(req, res, next) {
    var env = req.query.env;
    var filename = path.join(path.resolve('./'), 'config', 'appConfig_' + env + '.json');
    fs.readFile(filename, {
        encoding: 'utf8'
    }, function(err, data) {
        if (err) {
            res.send({
                'code': 1,
                'message': '获取配置信息失败'
            });
        }
        //data是字符串对象
        var config = JSON.parse(data);
        var modules = handlerConfig.getModules(config.module);
        res.send({
            'code': 0,
            'data': modules,
            'message': '成功'
        });
    });
};
//获取FTP中的文件列表
exports.listFiles = function(req, resp, next) {
    var files = [];
    var env = req.query.env;
    //根据环境建立ftp连接
    var ftp = new JSFtp(settings.ftp[env]);
    ftp.ls('.', function(err, res) {
        res.forEach(function(file) {
            // file格式
            // {
            //     name: '中文测试-20160106145734535.rar',
            //     type: 0,//0:文件 1:文件夹
            //     time: 1452063420000,
            //     size: '17031255',
            //     owner: 'ftp',
            //     group: 'ftp',
            //     userPermissions: {
            //         read: true,
            //         write: true,
            //         exec: false
            //     },
            //     groupPermissions: {
            //         read: true,
            //         write: false,
            //         exec: false
            //     },
            //     otherPermissions: {
            //         read: true,
            //         write: false,
            //         exec: false
            //     }
            // }
            if (file.type === 0) { //如果是文件
                files.push({
                    name: file.name,
                    size: util.formatSize(file.size)
                });
            }
        });
        resp.send({
            'code': 0,
            'data': files,
            'message': '成功'
        });
    });
};
//下载文件
//1、post请求，参数在req.body之中
//2、get请求，参数在req.query之中
exports.download = function(req, res, next) {
    var queryObj = url.parse(req.url, true, true);
    var env = queryObj.query.env;
    //解决中文乱码
    var filename = decodeURIComponent(util.getFileName(queryObj.pathname));
    var downloadObj = {
        env: env,
        res: res,
        filename: filename
    };
    //根据环境建立ftp连接
    handlerDownload(downloadObj);
};
//处理上传
function handlerUpload(obj) {
    var res = obj.res;
    var oldPath = obj.oldPath;
    var env = obj.env;
    var filename = obj.filename;
    var targetName = obj.targetName;
    var appConfig = obj.appConfig;
    var ftp = new JSFtp(settings.ftp[env]);
    fs.readFile(oldPath, function(err, buffer) {
        if (err) {
            res.send({
                'code': 1,
                'message': '失败'
            });
        }
        ftp.put(buffer, targetName, function(err) {
            if (err) {
                info.save({
                    'env': env,
                    'envDesc': settings.envDesc[env],
                    'operatetime': util.getTimestamp(1),
                    'username': 'admin',
                    'filename': filename,
                    'filetype': util.getFileType(filename),
                    'operatetype': 'download',
                    'filepath': filename,
                    'status': 1 //0：成功 1：失败
                }, function(err) {
                    res.send({
                        'code': 1,
                        'message': err
                    });
                });
            }
            util.getMD5(oldPath, function(md5) {
                fs.unlink(oldPath); //删除文件
                obj.md5 = md5;
                console.log(obj);
                handlerConfig.updateModule(obj);
            });
        });
    });
}
//处理下载
function handlerDownload(obj) {
    var res = obj.res;
    var env = obj.env;
    var filename = obj.filename;
    var ftp = new JSFtp(settings.ftp[env]);
    var filepath = path.join(settings.upload.uploadDir, filename);
    ftp.get(filename, filepath, function(err) {
        if (err) {
            info.save({
                'env': env,
                'envDesc': settings.envDesc[env],
                'operatetime': util.getTimestamp(1),
                'username': 'admin',
                'filename': filename,
                'filetype': util.getFileType(filename),
                'operatetype': 'download',
                'filepath': filename,
                'status': 1 //0：成功 1：失败
            });
            res.render('page/index/index', {
                title: '404',
                show: '',
                env: env,
                message: '下载文件' + filename + '失败',
                error: err
            });
        } else {
            res.download(filepath, filename, function(err) {
                fs.unlink(filepath); //删除文件
                info.save({
                    'env': env,
                    'envDesc': settings.envDesc[env],
                    'operatetime': util.getTimestamp(1),
                    'username': 'admin',
                    'filename': filename,
                    'filetype': util.getFileType(filename),
                    'operatetype': 'download',
                    'filepath': filepath,
                    'status': 0 //0：成功 1：失败
                });
            });
        }
    });
}