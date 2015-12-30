ZSYWEB.Core.config({
	env : {
		runev : "PC",
		sever : "test"
	},
	services : {
		dev : '',
		test : '',
		release : '',
		devlogin : '',//'http://10.166.224.73:8182/login',
		testlogin : ''
	},
	loadconfig : {
		baseUrl : "../../",
	    paths: {
	        'juicer' : 'jslib/juicer', 
	        'ZSYWEB.Util' : 'js/util',
	        'ZSYWEB.Services' : 'services/service',
	        'ZSYWEB.NativeAPI' : 'native/nativeapi',
	        'ZSYWEB.NativeAPI.Mobile' : 'native/mobile',
	        'ZSYWEB.NativeAPI.PC' : 'native/pc',
	        'ZSYWEB.Filter' : 'filter/filter',
	        'ZSYWEB.Pub' : 'js/pub',
	        'ZSYWEB.Control' : 'js/control',
	        'ZSYWEB.Binder' : 'js/binder',
	        'ZSYWEB.Event' : 'js/event',
	        'ZSYWEB.Comm' : 'js/comm',
	        'ZSYWEB.Menu' : 'platform/das/menu',
	        'ZSYWEB.Header' : 'platform/das/header',
	        'ZSYWEB.CommonData' : 'js/commonData',
	        'ZSYWEB.ShapeGallery' : 'widget/skb/draw',
	        'ZSYWEB.Widget.PassWord': 'widget/skb/password',
	        'ZSYWEB.Widget.KeyBoard': 'widget/skb/keyboard'
	    }
	},
	apiversion : 'h5zip_1.2.33',
	headers : {
		'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, zh-Hans;q=0.7, zh-Hant;q=0.6, ja;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'ihome-imei': '1C52632E36DF49D4B79D070828BEA515',
        'ihome-os': 3
	},
	apiConfig : {
		// "login" : "../../data/login.json"
	},
	route : {
	}
});