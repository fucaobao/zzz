define("ZSYWEB.Services", ["ZSYWEB.NativeAPI", "ZSYWEB.Util"], function(){
	var core = ZSYWEB.Core
		, env = core.getEnv()
		, util = ZSYWEB.Util
		, serve = core.getService()
		, napi = ZSYWEB.NativeAPI
		, apiConfig = core.getApiConfig()
		, defaultHeaders = $.extend(true, {}, {
		    'ihome-timestamp': util.cTimestamp(),
		    'uid' : util.cTimestamp()+"-"+util.generateUUID(),
		    'ihome-version': core.getAPIVersion(),
		    'appversion' : core.getAPIVersion()
		}, core.getHeaders());
	var ajax = function( obj ) {
		var url = obj.url;
		if( apiConfig != undefined && apiConfig[url] != undefined ) {
			obj.url = apiConfig[url];
		}else{
			var sev = env.sever.toLocaleLowerCase();
			if( serve[sev] == '' ) {
				serve[sev] = window.location.origin + "/";
			}
			obj.url = serve[sev] + url;
		}
		$.ajax(obj);
	}, 
	getLogin = function(cb) {
		napi.getToken(cb);
	},
	formatHeader = function( obj, type, loginFlg ){
		if( loginFlg ) {
			napi.getToken(function( token ){
				var _h = $.extend(true, {}, defaultHeaders, {"ihome-token" : token});
				var _o = $.extend(true, {}, obj, {headers:_h, dataType : 'json', type : type});
				ajax(_o);
			});
		}else{
			var _o = $.extend(true, {}, obj, {headers : defaultHeaders, dataType : 'json', type : type});
			console.info(_o);
			ajax(_o);
		}
	};
	var $http = {
		get : function( obj, loginFlg ) {
			var dc = core.getDataControl();
            if( dc != undefined ) {
                dc.ajax(obj);
            }else{
                formatHeader(obj, "GET", loginFlg);
            }
		},
		post : function( obj, loginFlg ) {
			var dc = core.getDataControl();
            if( dc != undefined ) {
                dc.ajax(obj);
            }else{
                formatHeader(obj, "POST", loginFlg);
            }
		},
		put : function() {

		}
	};
	NameSpace.Register("ZSYWEB.Services", $http);
	return $http;
});