define("ZSYWEB.NativeAPI", function(require){
	var core = ZSYWEB.Core
		, env = core.getEnv()
		, api = null
		;
	if( env.runev == "PC" ) {
		api = require("ZSYWEB.NativeAPI.PC");
	}else{
		api = require("ZSYWEB.NativeAPI.Mobile");
	}
	console.info(api);
	var NativeAPI = {
		/**
		* 调用支付
		* @param null
		* @return null
		*/
		pay : function ( obj ) {
			api.pay(obj);
		},
		/**
		* 获取登录token
		* @param cb function
		* @return null
		*/
		getToken : function( cb ) {
			api.getToken(cb);
		},
		/**
		* 判断是否绑卡
		* @param cb function
		* @return null
		*/
		isOrderCreatable : function( cb ) {
			api.isOrderCreatable(cb);
		},
		/**
		* 跳转到下一个页面
		* @param URL string
		* @return null
		*/
		go : function( url ) {
			api.go(url);
		},
		/**
		* 返回上一个页面
		* @param flg boolean  true 返回需要刷新, false 返回不需要刷新
		* @return null
		*/
		back : function( flg ) {
			api.back(flg);
		},
		/**
		* 返回到原生态
		* @param null
		* @return null
		*/
		pop : function() {
			api.pop();
		},
		/**
		* 图片预览
		* @param imgArr Array 图片数组
		* @return null
		*/
		photoBrowser : function( imgArr ) {
			api.photoBrowser(imgArr);
		},
		/**
		* 打电话
		* @param telNo String 电话号码
		* @return null
		*/
		gotoCall : function( telNo ) {
			api.gotoCall(telNo);
		}
	};
	NameSpace.Register("ZSYWEB.NativeAPI", NativeAPI);
});