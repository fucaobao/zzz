var fs = require('fs'); //node.js核心的文件处理模块
var formidable = require('formidable');
var util = require('../tools/util');
var app = require('../app');
var settings = require('../config/settings').upload;
exports.upload = function(req, res, next) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = settings.encoding; //设置编码
    form.uploadDir = settings.uploadDir; //设置上传目录
    form.keepExtensions = settings.keepExtensions; //保留后缀
    form.maxFieldsSize = settings.maxFieldsSize; //文件大小
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send({
                'code': 1,
                'err': err || '系统繁忙，请稍后再试'
            });
            return;
        }
        var filename = files.file.name;
        // 对文件名进行处理，以应对上传同名文件的情况
        var dotIndex = filename.lastIndexOf('.');
        var type = filename.substring(dotIndex + 1);
        if (settings.fileType.indexOf(type) === -1) {
            res.send({
                'code': 1,
                'err': '不支持的格式'
            });
        }
        var name = filename.substring(0, dotIndex);
        var targetName = name + '-' + util.getTimestamp() + '.' + type;
        var newPath = form.uploadDir + targetName;
        fs.rename(files.file.path, newPath, function() {
            res.send({
                'code': 0,
                'err': '成功'
            });
        }); //重命名
    });
};