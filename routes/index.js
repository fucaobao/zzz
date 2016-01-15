var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('page/index/index', {
        title: 'Express',
        show: 'dn', //隐藏提示栏
        env: 'sit', //默认开发环境
        message: ''
    });
});
module.exports = router;