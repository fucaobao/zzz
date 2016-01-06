var settings = require('../config/config');
exports.getEnv = function(req, res) {
    res.send({
        'code': 0,
        'data': {
            envDesc: settings.envDesc,
            env: settings.env
        },
        'message': '成功'
    });
};