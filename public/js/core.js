'use strict';

var NameSpace = {
	Register : function(name, cls) {
		var arg = name;
		var arr = arg.split('.');
		var context = window;
		for( var i = 0; i < arr.length; i++ ) {
			var str = arr[i];
			if( !context[str] ) {
				context[str] = {};
			}
			if( i == (arr.length-1) && cls != undefined ) {
				if( $.isFunction(cls) ) {
					context[str] = cls;
				}else{
					if( context[str] != undefined ) {
						context[str] = $.extend(true, {}, context[str], cls);
					}else{
						context[str] = cls;
					}
				}
			}else{
				context = context[str];
			}
		}
	}
};
(function(){
	var Map = function() {
	    this.elements = [];

	    //获取MAP元素个数
	    this.size = function() {
	        return this.elements.length;
	    };

	    //判断MAP是否为空
	    this.isEmpty = function() {
	        return (this.elements.length < 1);
	    };

	    //删除MAP所有元素
	    this.clear = function() {
	        this.elements = [];
	    };

	    //向MAP中增加元素（key, value) 
	    this.put = function(_key, _value) {
	    	var v = this.get(_key);
	    	if( v == undefined ){
	    		 this.elements.push( {
	                 key : _key,
	                 value : _value
	             });
	    	}else{
	    		this.set(_key, _value);
	    	}
	       
	    };
	    this.set = function( _key, _value ) {
	    	for ( var i = 0; i < this.elements.length; i++) {
	            if (this.elements[i].key == _key) {
	            	this.elements[i].value = _value;
	                break;
	            }
	        }
	    };
	    //删除指定KEY的元素，成功返回True，失败返回False
	    this.removeByKey = function(_key) {
	        var bln = false;
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };
	    
	    //删除指定VALUE的元素，成功返回True，失败返回False
	    this.removeByValue = function(_value) {//removeByValueAndKey
	        var bln = false;
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };
	    
	    //删除指定VALUE的元素，成功返回True，失败返回False
	    this.removeByValueAndKey = function(_key,_value) {
	        var bln = false;
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value && this.elements[i].key == _key) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //获取指定KEY的元素值VALUE，失败返回NULL
	    this.get = function(_key) {
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    return this.elements[i].value;
	                }
	            }
	        } catch (e) {
	            return undefined;
	        }
	        return undefined;
	    };

	    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	    this.element = function(_index) {
	        if (_index < 0 || _index >= this.elements.length) {
	            return null;
	        }
	        return this.elements[_index];
	    };

	    //判断MAP中是否含有指定KEY的元素
	    this.containsKey = function(_key) {
	        var bln = false;
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //判断MAP中是否含有指定VALUE的元素
	    this.containsValue = function(_value) {
	        var bln = false;
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };
	    
	    //判断MAP中是否含有指定VALUE的元素
	    this.containsObj = function(_key,_value) {
	        var bln = false;
	        try {
	            for (var i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value && this.elements[i].key == _key) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //获取MAP中所有VALUE的数组（ARRAY）
	    this.values = function() {
	        var arr = [];
	        for (var i = 0; i < this.elements.length; i++) {
	            arr.push(this.elements[i].value);
	        }
	        return arr;
	    };
	    
	    //获取MAP中所有VALUE的数组（ARRAY）
	    this.valuesByKey = function(_key) {
	        var arr = [];
	        for (var i = 0; i < this.elements.length; i++) {
	            if (this.elements[i].key == _key) {
	                arr.push(this.elements[i].value);
	            }
	        }
	        return arr;
	    };

	    //获取MAP中所有KEY的数组（ARRAY）
	    this.keys = function() {
	        var arr = [];
	        for (var i = 0; i < this.elements.length; i++) {
	            arr.push(this.elements[i].key);
	        }
	        return arr;
	    };
	    
	    //获取key通过value
	    this.keysByValue = function(_value) {
	        var arr = [];
	        for (var i = 0; i < this.elements.length; i++) {
	            if(_value == this.elements[i].value){
	                arr.push(this.elements[i].key);
	            }
	        }
	        return arr;
	    };
	    
	    //获取MAP中所有KEY的数组（ARRAY）
	    this.keysRemoveDuplicate = function() {
	        var arr = [];
	        for (var i = 0; i < this.elements.length; i++) {
	            var flag = true;
	            for(var j=0;j<arr.length;j++){
	                if(arr[j] == this.elements[i].key){
	                    flag = false;
	                    break;
	                } 
	            }
	            if(flag){
	                arr.push(this.elements[i].key);
	            }
	        }
	        return arr;
	    };
	};
	var ev = null, sev = null, configObj = null, time = Date.parse(new Date()), pageId = time, plugsMap = new Map();
	var componentMap = new Map();
	var customerAttr = ["csn-value", "csn-class", "csn-text", "csn-id", "csn-placeholder", "csn-disabled", "csn-maxlength", "csn-error", "csn-onclick"];
	window[time] = {};
	var $scope = window[time];
	var config = function( obj ) {
		require(obj);
	};
	var initPage = function( cb ) {
		var includes = $("include");
		var len = includes.length;
		var index = 0;
		var __loadTemp = function() {
			var pInclude = $(includes[index]).parent();
			var src = $(includes[index]).attr("src");
			if( index < len ) {
				$.ajax({
					url : src,
					dataType : 'html',
					success : function( txt ) {
						$(includes[index]).replaceWith(txt);
						index++;
						__loadTemp();
					},
					error : function() {
						index++;
						__loadTemp();
					}
				});
			}else{
				initComponent(cb);
			}
		};
		__loadTemp();
	};
	var ready = function( cb ) {
		if( !$.isFunction( cb ) ) {
			return;
		}
		if( configObj.env.runev == 'PC' ) {
			$(function(){
				initPage(cb)
			});
		}else{
			document.addEventListener("deviceready", function(){
				initPage(cb);
			}, false);
		}
	};
	var requestParaMap = function() {
		var id = location.search;
		if ( id == null ) {
			id = "";
		}
		var arrayObj = id.match(/([^?=&]+)(=([^&]*))?/g);
		var returnMap = {};
		if (arrayObj == null) return returnMap;
		for (var i = 0; i < arrayObj.length; i++) {
			var conment = arrayObj[i];
			var key = decodeURIComponent(conment.substring(0, conment.indexOf("=")));
			var value = decodeURIComponent(conment.substring(conment.indexOf("=") + 1, conment.length));
			returnMap[key] = value;
		}
		if(id == "undefined") {
			return null;
		}else{
			return returnMap;
		}
	};
	var parseParam = function( str, param ) {
		//../page/detail.html?productCode&issueCode
		var strings = str.split("?");
		var url = strings[0];
		if( strings.length > 1 ) {
			var temp = strings[1];
			var par = temp.split("&");
			url += "?";
			for( var i = 0; i < par.length; i++ ) {
				var key = par[i];
				if( i > 0 ) {
					url += "&" + key + "=" + param[key];
				}else{
					url += key + "=" + param[key];
				}
			}
		}
		return url;
	};
	var createComponent = function( obj ) {
		var type = obj.type;
		var doms = $(type);
		var attr = obj.attr;
		if( $.isArray(attr) ) {
			for( var i = 0; i < attr.length; i++ ) {
				var t = attr[i];
				if( $.inArray(t, customerAttr ) == -1 ) {
					customerAttr.push(t);
				}
			}
		}
		componentMap.put(type, {
			doms : doms,
			op : obj
		});
	};
	var resolveCustomerAttr = function( dom, htm ) {
		var obj = {};
		for( var i = 0; i < customerAttr.length; i++ ) {
			var attrKey = customerAttr[i];
			var attr = $(dom).attr(attrKey);
			if( attr != undefined ) {
				obj[attrKey] = attr;
				var temp = new RegExp("\\{{" + attrKey + "}}", "g");
				console.info(temp);
				htm = htm.replace(temp, attr);
			}
		}
		return {
			o : obj,
			h : htm
		};
	};
	var initComponent = function( cb ) {
		var keys = componentMap.keys();
		var len = keys.length;
		var index = 0;
		var __getTemplate = function( op, _cb ) {
			var template = null;
			if( op.template != null ) {
				template = op.template;
				_cb(template);
			}else{
				$.ajax({
					url : op.templateUrl,
					dataType : 'html',
					success : function( txt ) {
						_cb( txt );
					},
					error : function() {
						_cb()
					}
				});
			}
		};
		var __loadComponent = function() {
			if( index < len ) {
				var key = keys[index];
				var dom = componentMap.get(key).doms;
				var op = componentMap.get(key).op;
				__getTemplate(op, function( txt ){
					for( var i = 0; i < dom.length; i++ ) {
						var obj = resolveCustomerAttr(dom[i], txt);
						$(dom[i]).html(obj.h);
						op.render($(dom[i]), obj);
					}
					index++;
					__loadComponent();
				});
			}else{
				cb();
			}
		};
		__loadComponent();
	};
	var Core = {
		$pointer : pageId,
		Ready : function( cb ) {
			ready(cb);
		},
		config : function( obj ) {
			configObj = obj;
			config(obj.loadconfig);	
		},
		getService : function() {
			return configObj.services;
		},
		getEnv : function() {
			return configObj.env;
		},
		getApiConfig : function() {
			return configObj.apiConfig;
		},
		getAPIVersion : function() {
			return configObj.apiversion;
		},
		getHeaders : function() {
			return configObj.headers;
		},
		getPointer : function() {
			return pageId;
		},
		getPlug : function( cid ) {
			return plugsMap.get(cid);
		},
		updateCSNPlug : function( type, id, value ) {
			var target = $(type).find("#"+id);
			var csnPlug = componentMap.get(type);
			if( $.isFunction(csnPlug.op.updatePlug) ) {
				csnPlug.op.updatePlug(target, value);
			}
			console.info(target);
		},
		nextPage : function( str, param ) {
			var $nativeApi = ZSYWEB.NativeAPI, nextUrl = '';
			var route = configObj.route;
			if( route == undefined || $.isEmptyObject(route)) {
				if( param == "" || param == undefined ) {
					//window.location.href = url;
					nextUrl = str;
				}else{
					var ustr = '?';
					var index = 0;
					for( var key in param ) {
						if( index > 0 ) {
							ustr += "&"+key;
							ustr += "=" + param[key];
						}else{
							ustr += key;
							ustr += "=" + param[key];
						}
						index++;
					}	
					nextUrl += ustr;
					//window.location.href = url;
					// nextUrl = url;
				}
			}else{
				var url = route[str];
				if(url){
					nextUrl = parseParam(url, param);
				} else {
					url = str;
				}
			}
			// var url = parseParam(url, param);
			$nativeApi.go(nextUrl);
		},
		getParam : function() {
			var param = requestParaMap();
			return param;
		},
		installPlugs : function( op ) {
			if( op == undefined ) {
				return;
			}
			var pub = ZSYWEB.Pub;
			for( var key in op ) {
				var _op = op[key];
				var plug = null;
				if( ZSYWEB.Widget[key] != undefined ) {
					plug = new ZSYWEB.Widget[key]();
					plug.$pointer = pageId;
					var cid = _op.cid;
					plug.cid = cid;
					if( plug.init != undefined ) {
						plug.init(_op);
					}else{
						plug.setOption(_op);
					}
					if( plug.install ) {
						plug.install(pub);
					}
					plugsMap.put(cid, plug);
				}
			}
		},
		createPlug : function( obj ) {
			createComponent(obj);
		},
		createScroll : function( id, height ) {
			if( height == undefined ) {
				height = $(window).height() - 50;
			}
			$(id).height(height);
			var is = new IScroll(id);
			return is;
		},
		back : function(flg) {
			var $nativeApi = ZSYWEB.NativeAPI;
			$nativeApi.back(flg);
		},
		pop : function() {
			var $nativeApi = ZSYWEB.NativeAPI;
			$nativeApi.pop();
		},
		setDataControl : function( dc ) {
			this.$dc = dc;
		},
		getDataControl : function() {
			return this.$dc;
		}
	};
	NameSpace.Register("ZSYWEB.Core", Core);
	NameSpace.Register("ZSYWEB.Map", Map);
	NameSpace.Register("ZSYWEB.RootScope", $scope);
}());