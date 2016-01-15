//相关API：http://mongoosejs.com/docs/api.html
var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var util = require('../tools/util');
var FileSchema = new Schema({
    status: Number, //0:成功，1:失败
    filesize: String, //文件大小，单位Byte
    filetype: String, //文件类型
    operatetype: String, //操作类型(上传upload或者download)
    filename: String, //文件名
    filepath: String, //文件路径
    filemd5: String, //文件md5值
    username: String, //用户名
    operatetime: String, //上传/下载时间
    env: String, //环境
    envDesc: String, //环境描述
    downIOS: String, //iOS下载链接
    downAndroid: String, //Android下载链接
    ver: String, //版本号
    createtime: {
        'type': Date,
        'default': util.getTimestamp(2)
    }
});
var File = mongodb.mongoose.model('Info', FileSchema);
var FileDAO = function() {};
//增加
FileDAO.prototype.save = function(obj, callback) {
    var instance = new File(obj);
    instance.save(function(err) {
        typeof callback === 'function' && callback(err);
    });
};
//删除
FileDAO.prototype.remove = function(obj, callback) {
    //
};
//修改
FileDAO.prototype.update = function(obj, callback) {
    //
};
//查找
FileDAO.prototype.find = function(obj, callback) {
    File.find(obj, function(err, obj) {
        typeof callback === 'function' && callback(err, obj);
    });
};
//分页查询
FileDAO.prototype.findByPage = function(obj, callback) {};
module.exports = new FileDAO();