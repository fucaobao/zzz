var util = {
    getTimestamp: function(time) {
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
        return String(y) + _addPrefix(M) + _addPrefix(d) + _addPrefix(h) + _addPrefix(m) + _addPrefix(sec) + minsec;

        function _addPrefix(num) {
            return num < 10 ? '0' + num : num;
        }
    }
};
module.exports = util;