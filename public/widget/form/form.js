/*
  include Validator
*/
define("ZSYWEB.Widget.Form!CSS", ['ZSYWEB.Event', "ZSYWEB.Widget.Validator"], function (){
	var evt = ZSYWEB.Event
		, validator = ZSYWEB.Widget.Validator
		;
	var Form = function(){
	};
	Form.prototype = {
		constructor : Form,
		setOption : function(obj){
			this.render(obj);
		},
		render : function(obj){
			var _html = ''
				, op = obj
				, id = op.id
				, type = op.type == 'pc' ? 'zsy-u-form-pc' : ''
				, render = op.render ? op.render : 'body'
				, labelWidth = op.labelWidth ? op.labelWidth : 70
				, labelCls = op.labelCls || ''
				, data = op.data
				, allRequired = op.allRequired
				, componentData = op.componentData
				, submitData = op.submitData || {}
				, clickCallback = submitData.clickCallback || {}
				, isClick = submitData.isClick ? 'active' : ''
				, len = data.length
				, i = 0
				, n = 0
				, allEdit = op.allEdit
				, validatorArr = []
				;
			_html += '<ul id="' + id + '" class="zsy-u-form ' + type + '">'
			for(; n < len; n++){
				var dataF = data[n]
					, dataFid = dataF.id
					, placeholder = dataF.placeholder || ''
					, edit = allEdit ? dataF.edit ? true : false : false
					, value = dataF.value || ''
					, type = dataF.type == 'password' ? 'password' : 'text' 
					;
				edit = !edit ? 'disabled="disabled"' : '';
				_html += '	<li>'
					  + '		<label class="zsy-u-label ' + labelCls + '" style="' + labelWidth + 'px;">' + dataF.label + '</label>'
					  + '		<span id="' + dataFid + 'Label" class="u-span-msg"></span>'
					  + '		<span class="u-spandb"><input type="' + type + '" name="' + dataF.field + '" value="' + value + '" placeholder="' + placeholder + '" ' + edit + ' /></span>'
					  + '	</li>';
			}
			if(op.submitData){
				_html += '<li class="zsy-u-submit ' + isClick + '"><span><input type="button" value="' + (submitData.value || '提交') + '" class="btn" /></span></li>';
			};
			_html += '</ul>';
			$(render).append(_html);
			if(op.type == 'pc') $('.zsy-u-submit.active').css('padding-left', $('.zsy-u-label').width() + 15);
			for(; i < len; i++){
				var dataF = data[i]
					, dataFid = dataF.id
					, isRequired = dataF.isRequired
					, newObj = {
						type: dataF.type,  // 必须
						name: dataF.field,  // 必须
						messages: {
							id: '#' + dataFid + 'Label', // 必须
						}
					};
				if(dataF.maxlength){
					newObj.maxlength = dataF.maxlength;
				}
				if(dataF.minlength){
					newObj.minlength = dataF.minlength;
				}
				if(dataF.tofixed){
					newObj.tofixed = dataF.tofixed;
				}
				if(dataF.errorMsg){
					newObj.messages.errorMsg = dataF.errorMsg;
				}
				if(dataF.successMsg){
					newObj.messages.successMsg = dataF.successMsg;
				}
				if($.isFunction(dataF.callback)){
					(function(d, isRequired){
						newObj.messages.callback = function(flg, evt) {
							var evtParent = $(evt).parent();
							if(isRequired && allRequired && !flg ){
								evtParent.addClass('error').removeClass('success');
							}else{
								evtParent.removeClass('error');
								if(isRequired) evtParent.addClass('success');
							}
							d.callback(flg, evt);
						};
					})(dataF, isRequired);
				}
				validatorArr.push(newObj);
			};
			var callbackData = {};
			validator.setOption({
				rules: validatorArr,
				callback : function(obj){ // 返回全部验证的val值以及是否验证通过
					callbackData = obj;
					if($.isFunction(op.callback)){
						op.callback(obj);
					}
				}
			});
			// 提交
			evt.bind($('.zsy-u-submit.active input'), '', 'click', function(){
				$('.zsy-u-form>li.error input').focus();
				if($.isFunction(clickCallback)){
					clickCallback(callbackData);
				};
			});
			
			// 解析data
			for(var key in componentData){
				$('input[name='+ key +']').val(componentData[key]);
			};
		}
	};
	NameSpace.Register("ZSYWEB.Widget.Form", Form);
	return Form;
});