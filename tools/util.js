var fs = require('fs'); //node.js核心的文件处理模块
var crypto = require('crypto');
var util = {
    //flag:
    //0:20151231122335123
    //1:2015-12-31 12:23:35
    //2:2015-12-31 12:23:35.123
    getTimestamp: function(flag, time) {
        flag = flag || 0;
        time = time || 0;
        var dt;
        if (time) {
            dt = new Date(time);
        } else {
            dt = new Date();
        }
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
    getMD5: function(filename, callback) {
        var rs = fs.createReadStream(filename);
        var hash = crypto.createHash('md5');
        rs.on('data', hash.update.bind(hash));
        rs.on('end', function() {
            var md5 = hash.digest('hex');
            callback(md5);
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
    //根据文件名获取文件类型
    getFileType: function(filename) {
        var dot = filename.lastIndexOf('.');
        if (dot === -1) {
            return '';
        }
        return filename.substring(dot + 1);
    },
    //获取appConfig中的对象
    elements: [],
    getElments: function(obj) {
        if (this.isObject(obj)) {
            this.elements.push(obj);
            if (obj.hasOwnProperty('children')) {
                for (var i = 0; i < obj.children.length; i++) {
                    this.getElments(obj.children[i]);
                }
                delete obj.children;
            }
        } else if (this.isArray(obj)) {
            for (var j = 0; j < obj.length; j++) {
                this.getElments(obj[j]);
            }
        }
    },
    isArray: function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    isObject: function(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
};
module.exports = util;