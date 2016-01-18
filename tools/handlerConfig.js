var fs = require('fs');
var util = require('./util');
var handlerConfig = {
    modules: [],
    targetModule: {},
    getModules: function(module) {
        this.modules = [];
        this.getElments(module); //从第一层开始
        return this.modules;
    },
    getElments: function(obj) {
        if (util.isObject(obj)) {
            this.modules.push(obj);
            if (obj.hasOwnProperty('children')) {
                this.getElments(obj.children);
            }
        } else if (util.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                this.getElments(obj[i]);
            }
        }
    },
    //获取module
    getModule: function(modules, fileid, index) {
        if (util.isObject(modules)) {
            modules.index = index;
            if (modules.id == fileid) {
                this.targetModule = modules;
                return;
            }
            if (modules.hasOwnProperty('children')) {
                this.getModule(modules.children, fileid, index);
            }
        } else if (util.isArray(modules)) {
            for (var i = 0; i < modules.length; i++) {
                modules.index = index + '-' + i; //记住在父元素和自己在数组中的位置
                this.getModule(modules[i], fileid, modules.index);
            }
        }
    },
    //更新module
    updateModule: function(obj, cb) {
        var self = this;
        var appConfig = obj.appConfig;
        var fileid = obj.fileid;
        var targetName = obj.targetName;
        fs.readFile(appConfig, {
            encoding: 'utf8' //不指定编码，则会返回原始的buffer数据
        }, function(err, data) {
            if (err) {
                return;
            }
            var config = JSON.parse(data);
            self.getModule(config.module, fileid, '#');
            var targetModule = self.targetModule;
            //获取文件路径
            var pathArray = targetModule.index.split('-').slice(1);
            var tmpModule = config.module; //浅拷贝
            for (var i = 0, len = pathArray.length; i < len; i++) {
                var index = parseInt(pathArray[i]);
                if (i < len - 1) {
                    tmpModule = tmpModule[index].children;
                } else {
                    tmpModule = tmpModule[index];
                }
            }
            //更新版本号
            obj.ver = tmpModule.ver = (+tmpModule.ver + 0.1).toFixed(1);
            //更新路径
            var platform = obj.platform;
            if (platform === 'ios') {
                obj.downIOS = tmpModule.downIOS = util.changePathname(tmpModule.downIOS, targetName);
            } else if (platform === 'android') {
                obj.downAndroid = tmpModule.downAndroid = util.changePathname(tmpModule.downAndroid, targetName);
            }
            fs.writeFile(appConfig, JSON.stringify(config, function(key, value) {
                //忽略index属性
                if (key == 'index') {
                    return undefined;
                }
                return value;
            }, 4), {
                encoding: 'utf8' //该参数可以不写，encoding的默认值就是utf8
            }, function() {
                typeof cb === 'function' && cb(obj);
            });
        });
    }
};
module.exports = handlerConfig;