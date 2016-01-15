var fs = require('fs'); //node.js核心的文件处理模块
var crypto = require('crypto');
var util = {
    //flag:
    //0:20151231122335123
    //1:2015-12-31 12:23:35
    //2:2015-12-31 12:23:35.123
    getTimestamp: function(flag, time) {
        flag = flag || 0;
        var dt = new Date(time || new Date());
        var y = dt.getFullYear(),
            M = dt.getMonth() + 1,
            d = dt.getDate(),
            h = dt.getHours(),
            m = dt.getMinutes(),
            sec = dt.getSeconds(),
            minsec = dt.getMilliseconds();
        while (String(minsec).length < 3) {
            minsec = '0' + minsec;
        }
        switch (flag) {
            case 1:
                return String(y) + '-' + _addPrefix(M) + '-' + _addPrefix(d) + ' ' + _addPrefix(h) + ':' + _addPrefix(m) + ':' + _addPrefix(sec);
            case 2:
                return String(y) + '-' + _addPrefix(M) + '-' + _addPrefix(d) + ' ' + _addPrefix(h) + ':' + _addPrefix(m) + ':' + _addPrefix(sec) + '.' + minsec;
            default:
                return String(y) + _addPrefix(M) + _addPrefix(d) + _addPrefix(h) + _addPrefix(m) + _addPrefix(sec) + minsec;
        }

        function _addPrefix(num) {
            return num < 10 ? '0' + num : num;
        }
    },
    //格式化文件大小
    formatSize: function(num) {
        num = parseFloat(num);
        if (num < Math.pow(1024, 1)) {
            return num.toFixed(3) + 'B';
        } else if (num < Math.pow(1024, 2)) {
            return (num / 1024).toFixed(3) + 'KB';
        } else if (num < Math.pow(1024, 3)) {
            return (num / Math.pow(1024, 2)).toFixed(3) + 'MB';
        } else if (num < Math.pow(1024, 4)) {
            return (num / Math.pow(1024, 3)).toFixed(3) + 'GB';
        } else {
            return (num / Math.pow(1024, 4)).toFixed(3) + 'TB';
        }
    },
    //获取文件的md5值
    getMD5: function(filename, cb) {
        var rs = fs.createReadStream(filename);
        var hash = crypto.createHash('md5');
        rs.on('data', hash.update.bind(hash));
        rs.on('end', function() {
            var md5 = hash.digest('hex');
            typeof cb === 'function' && cb(md5);
        });
    },
    //根据url获取filename
    getFileName: function(query) {
        var dot = query.lastIndexOf('/');
        if (dot === -1) {
            return '';
        }
        return query.substring(dot + 1);
    },
    //根据filename修改url路径
    changePathname: function(url, filename) {
        var slash = url.lastIndexOf('/');
        if (slash === -1) {
            return filename;
        }
        return url.substring(0, slash + 1) + filename;
    },
    //根据文件名获取文件类型
    getFileType: function(filename) {
        var dot = filename.lastIndexOf('.');
        if (dot === -1) {
            return '';
        }
        return filename.substring(dot + 1);
    },
    //获取随机数
    genUUID: function() {
        return Math.random().toString(36).substring(2);
    },
    isArray: function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    isObject: function(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
};
module.exports = util;