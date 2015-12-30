require(['juicer', 'ZSYWEB.Services','ZSYWEB.Event','ZSYWEB.Filter', 'ZSYWEB.Comm', 'ZSYWEB.Widget.Validator'], function(data) {
	var validator = ZSYWEB.Widget.Validator;
	validator.setOption({
		rules: [
			{
				type: 'email',  // 必须
				name: 'xsemail',  // 必须
				messages: {   // 必须
					id: '#emailLabel', // 必须
					errorMsg: 'email验证失败',
					successMsg: 'email验证成功',
					// callback : function(flg, evt){
					// 	console.log(flg)
					// 	// false为error   true为success evt:this
					// }
				}
			},
			{
				type: 'password',  // 必须 
				name: 'xsnumber',  // 必须
				maxlength: 10,		// 最大长度
				minlength: 5,   // 最小长度
				messages: {   // 必须
					id: '#xsnumberLabel', // 必须
					errorMsg: '数字验证失败',
					successMsg: '数字验证成功',
					minLengthMsg: '数字长度不能小于6且不能大于10位数',
					callback : function(flg, evt){
						console.log(flg)
						// false为error   true为success evt:this
					}
				}
			},
			{
				type: 'phone',  // 必须  
				name: 'xsphone',  // 必须
				maxlength: 11,
				minlength: 5,
				tofixed: 5,
				messages: {   // 必须
					id: '#xsphoneLabel', // 必须
					errorMsg: '手机号码验证失败',
					successMsg: '手机号码验证成功',
					// callback : function(flg, evt){
					// 	console.log(flg)
					// 	// false为error   true为success evt:this
					// }
				}
			},
			{
				type: 'bankCardOwner',  // 必须  
				name: 'xsname',  // 必须
				messages: {   // 必须
					id: '#xsnameLabel', // 必须
					errorMsg: '至少2位以上汉字',
					successMsg: '姓名验证成功',
					// callback : function(flg, evt){
					// 	console.log(flg)
					// 	// false为error   true为success evt:this
					// }
				}
			}
		],
		callback : function(obj){
			console.log(obj)
			// 返回全部验证的val值以及是否验证通过
		}
	});
});