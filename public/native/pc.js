define("ZSYWEB.NativeAPI.PC", ["ZSYWEB.Util"], function(){
	var $core = ZSYWEB.Core;
	var ev = $core.getEnv();
	var serve = $core.getService();
	var urlEv = ev.sever.toLocaleLowerCase()+'login';
	var loginUrl = serve[urlEv];
	var util = ZSYWEB.Util;
	var PCAPI = {
		pay : function() {},
		getToken : function( cb ) {
			cb('olwqeuf52smg!1440466804899');
			return;
			var username = '18312472311', password = 'qwe123';
	        $.ajax({
	            url : loginUrl,
	            type : "POST",
	            headers : {
	                'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, zh-Hans;q=0.7, zh-Hant;q=0.6, ja;q=0.5',
	                'Content-Type': 'application/x-www-form-urlencoded',
	                'ihome-imei': '1C52632E36DF49D4B79D070828BEA515',
	                'ihome-os': 2,
	                'ihome-timestamp': util.cTimestamp(),
	                'ihome-version': $core.getAPIVersion()
	            },
	            data : {
	            	loginName : username,
	            	password : password
	            },
	            success : function( data, stauts, xhr ) {
	            	console.info(data);
	            }
	        });
		},
		go : function( url ) {
			window.location.href = url;
		},
		back : function() {
			window.history.go(-1);
		},
		pop : function() {

		},
		photoBrowser : function() {

		},
		gotoCall : function( telNo ) {
			alert(telNo);
		}
	};
	return PCAPI;
});