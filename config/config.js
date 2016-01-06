var config = {
    need: true, //是否需要db
    envDesc: {
        release: '生产环境',
        sit: '测试环境',
        dev: '开发环境',
        uat: '联调环境',
        yfb: '预发布环境',
        drill: '演练环境'
    },
    env: {
        release: 'http://nos.126.net/zsyapp/', //生产环境
        sit: 'http://223.252.223.120/', //测试环境
        dev: 'http://nos.126.net/app/', //开发环境
        uat: 'http://nos.126.net/ct-integration/', //联调环境
        yfb: 'http://nos.126.net/ctpub-yfb/', //预发布环境
        drill: 'http://nos.126.net/zsyapp/' //演练环境
    },
    ftp: {
        release: {
            host: 'localhost',
            port: 21,
            user: 'release',
            pass: 'release'
        },
        sit: {
            host: 'localhost',
            port: 21,
            user: 'sit',
            pass: 'sit'
        },
        dev: {
            host: 'localhost',
            port: 21,
            user: 'dev',
            pass: 'dev'
        },
        uat: {
            host: 'localhost',
            port: 21,
            user: 'uat',
            pass: 'uat'
        },
        yfb: {
            host: 'localhost',
            port: 21,
            user: 'yfb',
            pass: 'yfb'
        },
        drill: {
            host: 'localhost',
            port: 21,
            user: 'drill',
            pass: 'drill'
        }
    },
    //数据库配置
    db: {
        cookieSecret: 'PIRATE',
        host: 'localhost',
        port: 27017,
        db: 'fileinfo',
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    //上传配置
    upload: {
        encoding: 'utf-8', //编码格式
        fileType: ['zip', 'rar'], //支持的文件格式
        uploadDir: 'files/', //上传的目录
        keepExtensions: true, //保留后缀
        maxFieldsSize: 500 * 1024 * 1024 //文件大小
    }
};
module.exports = config;