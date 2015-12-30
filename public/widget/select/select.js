define("ZSYWEB.Widget.Select!CSS", ['ZSYWEB.Event'], function (){
	var evt = ZSYWEB.Event;
	var Select = function(){
	};
	Select.prototype = {
		constructor : Select,
		setOption : function(obj){
			this.render(obj);
		},
		bindEvent : function(obj){
			evt.bind($('body'), '.zsy-u-select-section', 'click', function(dom){
				$('.zsy-u-select-section').css('z-index',9999999);
				dom.css('z-index',99999999).toggleClass('active').siblings().removeClass('active');
			});
			evt.bind($('#'+obj.id), '.zsy-m-selectId-list>li', 'click', function(dom){
				var selectIdTitle = dom.parent().prev()
					, val = dom.html() || ''
					, key = dom.attr('data-key') || ''
					;
				selectIdTitle.attr('data-key', key).html(val).removeClass('col-default');
				if($.isFunction(obj.callback)){
					var o = {
						key: key,
						val: val
					}
					obj.callback(o);
				}
			});
			evt.bind($(document), '', 'click', function(dom, event){
				var eo = $(event.evt.target)
					, _parent = eo.parent('.zsy-u-select-section')
					;
				if(_parent.attr("class")!="rel zsy-u-select-section active"){
					$('.zsy-u-select-section').removeClass('active');
				}
			});
		},
		creatHtml : function(obj) {
			var _html = ''
				, render = obj.render ? obj.render : 'body'
				, maxHeight = obj.maxHeight ? obj.maxHeight +'px' : 'auto'
				, defaultClass = obj.value ? ' ' : 'col-default '
				, defaultValue = obj.defaultValue ? obj.defaultValue : '请选择...'
				, value = obj.value ? obj.value : defaultValue
				, defaultKey = obj.key ? ('data-key="' + obj.key + '"') : ''
				, data = obj.data ? obj.data : {}
				, len = data.length
				, i = 0
				;
			if($.isFunction(obj.callback)){
				obj.callback({
					key: (obj.key || ''),
					val: value
				});
			}
			_html += '<section class="rel zsy-u-select-section" id="' + obj.id + '" onselectstart="return false;">\
						<h3 class="zsy-m-selectId-title textOverflow ' + defaultClass + '" '+ defaultKey + '>' + value + '</h3>\
						<ul class="zsy-m-selectId-list abs" style="max-height:' + maxHeight + '">';
			for(; i < len; i++){
				var dataF = data[i]
					, dataValue = dataF.value || ''
					, dataKey = dataF.key ? 'data-key="' + dataF.key + '"' : ''
					;
				if(dataF.value) _html += '<li ' + dataKey + '>' + dataValue + '</li>';
			}		
			_html += '</ul></section>';
			$(render).append(_html);
		},
		render : function(obj){
			this.creatHtml(obj)
			this.bindEvent(obj);
		}
	};
	NameSpace.Register("ZSYWEB.Widget.Select", Select);
	return Select;
});