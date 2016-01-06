var mongoose = require('mongoose');
var settings = require('../config/config').db;
mongoose.connect('mongodb://' + settings.host + ':'+ (settings.port || 27017) + '/' + settings.db);
exports.mongoose = mongoose;