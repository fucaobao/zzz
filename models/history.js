//相关API：http://mongoosejs.com/docs/api.html
var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var HistorySchema = new Schema({
	url: String,
    image: String,
    cName: String,
    eName: String,
    other: String,
    playable: String,
    person: String,
    ratingNum: Number,
    ratingStar: Number,
    remarkNum: Number,
    quote: String,
    create_date: {
        'type': Date,
        'default': Date.now
    }
});
var History = mongodb.mongoose.model("History", HistorySchema);
var HistoryDAO = function() {};
//增加
HistoryDAO.prototype.save = function(obj, callback) {
    var instance = new History(obj);
    instance.save(function(err) {
        callback(err);
    });
};
//删除
HistoryDAO.prototype.remove = function(obj, callback) {

};
//更新
HistoryDAO.prototype.update = function(obj, callback) {

};
//查找
HistoryDAO.prototype.find = function(obj, callback) {

};
//分页查询
HistoryDAO.prototype.findByPage = function(obj, callback) {

};
module.exports = new HistoryDAO();