var settings = {
    //数据库配置
    db: {
        cookieSecret: 'PIRATE',
        host: 'localhost',
        port: 27017,
        db: 'history',
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    //上传配置
    upload: {
        encoding: 'utf-8', //设置编码
        fileType: ['zip', 'rar'], //支持的文件格式
        uploadDir: 'upload/', //设置上传目录
        keepExtensions: true, //保留后缀
        maxFieldsSize: 100 * 1024 * 1024 //文件大小
    }
};
module.exports = settings;