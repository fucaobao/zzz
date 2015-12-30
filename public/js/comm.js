define("ZSYWEB.Comm", ["ZSYWEB.Event"], function(require){
	var $core = ZSYWEB.Core
		, $evt = ZSYWEB.Event
		;
	// 发布订阅
	var publishEvents = (function(){
		var listen,log,obj, one, remove, trigger, __this;
		obj = {};
		__this = this;
		listen = function( key, eventfn ) {  // 订阅
			var stack, _ref;  
			stack = ( _ref = obj[key] ) != null ? _ref : obj[ key ] = [];
			return stack.push( eventfn );
		};
		one = function( key, eventfn ) {
			remove( key );
			return listen( key, eventfn );
		};
		remove = function( key ) {  // 解除
			var _ref;
			return ( _ref = obj[key] ) != null ? _ref.length = 0 : void 0;
		};
		trigger = function() {   // 发布
			var fn, stack, _i, _len, _ref, key;
			key = Array.prototype.shift.call( arguments );
			stack = ( _ref = obj[ key ] ) != null ? _ref : obj[ key ] = [];
			for ( _i = 0, _len = stack.length; _i < _len; _i++ ) {
				fn = stack[ _i ];
				if( fn == undefined ) return false;
				if ( fn.apply( __this,  arguments ) === false) {
					return false;
				}
			}
		}
		return {
			listen: listen,
			one: one,
			remove: remove,
			trigger: trigger
		}
	})();
	$.fn.cusbind = function() {
		$(this).bind.apply($(this), arguments);
		return $(this);
	};
	$.fn.send = function( type, data ) {
		$(this).trigger(type, data);
		return $(this);
	};
	$.fn.uncusbind = function( type, inst ) {
		$(this).unbind(type);
		return $(this);
	};
	var Comm = {
		initEvent : function() {
			$evt.bind($("body"), ".go-back", "click", function(){
				$core.back();
			});
			$evt.bind($("body"), ".back", "click", function(){
				$core.pop();
			});
		},
		publishEvents : publishEvents
	};
	NameSpace.Register("ZSYWEB.Comm", Comm);
	return Comm;
});