define("ZSYWEB.Util", [], function (){
	var Util = {
        /**
         * flag:
         * 0:默认时间戳20150806101841065
         * 1:2015-10-16 17:35:32
         * 2:2015-10-16 17:35
         * 3:2015年10月16日
         * 4:2015-10-16
         * time:
         * 时间戳，毫秒数
         */
        cTimestamp: function(flag, time) {
            flag = parseInt(flag);
            var dt,str;
            if (!time) {
                dt = new Date();
            } else {
                dt = new Date(time);
            }
            var y = dt.getFullYear(),
                M = dt.getMonth() + 1,
                d = dt.getDate(),
                h = dt.getHours(),
                m = dt.getMinutes(),
                sec = dt.getSeconds(),
                minsec = dt.getMilliseconds();
            if (flag === 1) {
                str = String(y) + '-' + _addPrefix(M) + '-' + _addPrefix(d) + ' ' + _addPrefix(h) + ':' + _addPrefix(m) + ':' + _addPrefix(sec);
            } else if (flag === 2) {
                str = String(y) + '-' + _addPrefix(M) + '-' + _addPrefix(d) + ' ' + _addPrefix(h) + ':' + _addPrefix(m);
            } else if (flag === 3) {
                str = String(y) + '年' + _addPrefix(M) + '月' + _addPrefix(d) + '日';
            } else if (flag === 4) {
                str = String(y) + '-' + _addPrefix(M) + '-' + _addPrefix(d);
            } else {
                while (String(minsec).length < 3) {
                    minsec = "0" + minsec;
                }
                str = String(y) + _addPrefix(M) + _addPrefix(d) + _addPrefix(h) + _addPrefix(m) + _addPrefix(sec) + minsec;
            }
            return str;

            function _addPrefix(num) {
                return num < 10 ? '0' + num : num;
            }
        },
		generateUUID : function(){
		    var d = new Date().getTime();
		    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = (d + Math.random()*16)%16 | 0;
		        d = Math.floor(d/16);
		        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		    });
		    return uuid;
		},
		inputChange : function( ele, cb ) {
			var dom = $("#"+ele)[0];
			if( "\v" == "v" ) {
				dom.onpropertychange = cb;
			}else{
				dom.addEventListener("input", cb, false);
			}
			return cb;
		},
		inputBlur : function(ele, cb){
			$("#"+ele).blur(cb);
		},
		isInt : function( val ) {
			var patrn = /^[1-9]\d*$/;
			if (!patrn.exec(val)) return false; 
			return true; 
		},
		isIDCard : function( val ) {
			var patrn = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
			if (!patrn.exec(val)) return false; 
			return true; 
		},
		isPhone : function( val ) {
			var patrn = /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/;
			if (!patrn.exec(val)) return false; 
			return true; 
		},
		isMobile : function( val ) {
			var patrn = /^0?1[2|3|4|5|8][0-9]\d{8}$/;
			if (!patrn.exec(val)) return false; 
			return true; 
		},
		numberFormat : function( value ) {
    		value = value.replace(/[^\d.]/g, "");
        	value = value.replace(/^\./g, "").replace(/\.{2,}/g, ".");
        	value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d)*$/, '$1$2');
			return value;
		},
		floatFormat : function( value ) {
    		value = value.replace(/[^\d.]/g, "");
        	value = value.replace(/^\./g, "").replace(/\.{2,}/g, ".");
        	value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        	return value;
		},
		/*检查是否合法持卡人名字：只能纯中文或者英文 */
		isValidName : function( value ){
			var patrn = /[^\u4e00-\u9fa5a-zA-Z]/gm;
			return !patrn.exec(value);
		},
		/*动态加载文件
		 * file: Object {type, container, filePath}*/
		loadFile : function(file){
			if(file.type.toLowerCase() === 'css'){
				var link = document.createElement('link');
			    link.type = 'text/css';
			    link.rel = 'stylesheet';
			    link.href = baseUrl + file.filePath;
			    document.getElementsByTagName("head")[0].appendChild(link);
			} else if(file.type.toLowerCase() === 'js'){
				var link = document.createElement('script');
			    link.type = 'text/script';
			    link.src = baseUrl + file.filePath;
			    document.getElementsByTagName("head")[0].appendChild(link);
			} else if(file.type.toLowerCase() === 'html'){
				$(file.container).load(baseUrl+file.filePath);
			}
		},
		getUrl : function(u){
		    var url = u.substring(0,u.indexOf('?')+1);
			url+="appId=";
			url+=$('#hiddenDiv > input[name="appId"]').val(),
			url+="&urlKey=",
			url+=$('#hiddenDiv > input[name="urlKey"]').val(),
			url+="&loginName=",
			url+=$('#hiddenDiv > input[name="loginName"]').val(),
			url+="&sourceNo=",
			url+=$('#hiddenDiv > input[name="sourceNo"]').val(),
			url+="&customerId=",
			url+=$('#hiddenDiv > input[name="customerId"]').val(),
			url+="&accessToken=",
			url+=$('#hiddenDiv > input[name="accessToken"]').val(),
			url+="&token=",
			url+=$('#hiddenDiv > input[name="token"]').val(),
			url+="&randomNum=",
			url+=$('#hiddenDiv > input[name="randomNum"]').val();
			return url;
		},
		getHiddenVal : function( id ) {
			var doms = $("#"+id).find("input[type='hidden']");
			var obj = {};
			for( var i = 0; i < doms.length; i++ ) {
				var dom = $(doms[i]);
				var key = dom.attr("name");
				var val = dom.val();
				obj[key] = val;
			}
			return obj;
		},
		//获取url中值
		getQuery: function(name, url) {
            var u = url || window.location.search,
                reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                r = u.substr(u.indexOf("\?") + 1).match(reg);
            return r != null ? r[2] : "";
        },
        		//获取按键的键码
        getCharCode: function(event) {
            if (typeof event.charCode == 'number') { //IE9以上和其他版本
                return event.charCode;
            } else { //IE8以及之前版本和Opera
                return event.keyCode;
            }
        },
        //同时支持json格式的批量替换和原始的全部替换
        strReplace: function(str, re, rt) {
            if (rt != undefined) {
                _replace(re, rt);
            } else {
                for (var key in re) {
                    _replace(key, re[key]);
                }
            }
            return str;

            function _replace(a, b) {
                str = str.split(a).join(b || '');
            }
        }
	};
	NameSpace.Register("ZSYWEB.Util", Util);
	return Util;
});