define("ZSYWEB.NativeAPI.Mobile", function(require){
	var callNative = function( obj ) {
		var success = obj["success"] || function(){};
		var fail = obj['fail'] || function(){};
		var param = obj['param'] || [];
		cordova.exec( success, fail, obj['name'], obj['fun'], param );
	};
	var MAPI = {
		pay : function( obj ) {
			var _o = $.extend(true,{},{
				success : function () {
					
				},
				fail : function () {
					
				},
				name : 'CDVPayPlugin',
				fun : 'pay'
			}, obj);
			callNative(_o);
		},
		getToken : function( cb ) {
			callNative({
				success : function ( token ) {
					cb(token);
				},
				fail : function () {
					
				},
				name : 'CDVLoginPlugin',
				fun : 'login'
			});
		},
		isOrderCreatable : function( cb ) {
			callNative({
	            success : function( obj ) {
	               	cb(obj);
	           	},
	            fail : function() {},
	            name : "CDVPayPlugin",
	            fun : 'isOrderCreatable'
	        });
		},
		go : function( url ) {
			callNative({
	            success : function() {
	               	
	           	},
	            fail : function() {},
	            name : "CDVAnimationPlugin",
	            fun : 'nextPage',
	            param : [url]
	        });
		},
		back : function( flg ) {
			if( flg == undefined ) {
				flg = false;
			}
			callNative({
	            success : function() {
	               	
	           	},
	            fail : function() {},
	            name : "CDVAnimationPlugin",
	            fun : 'backPage',
	            param : [flg]
	        });
		},
		pop : function() {
			callNative({
	            success : function() {
	               	
	           	},
	            fail : function() {},
	            name : "CDVAnimationPlugin",
	            fun : 'popHome'
	        });
		},
		photoBrowser : function( imgArr ) {
			callNative({
	            success : function() {
	               	
	           	},
	            fail : function() {},
	            name : "CDVToolPlugin",
	            fun : 'photoBrowser',
	            param : imgArr
	        });
		},
		gotoCall : function( telNo ) {
			callNative({
	            success : function() {
	               	
	           	},
	            fail : function() {},
	            name : "CDVToolPlugin",
	            fun : 'callPhone',
	            param : [telNo]
	        });
		},
		rightsUse: function (obj) {
			callNative({
				success: function () {
				},
				fail: function () {
				},
				name: "CDVUserRights",
				fun: 'rightsUse',
				param: [obj]
			});
		}
	};
	return MAPI;
});