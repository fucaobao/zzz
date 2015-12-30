/*!
 * 验证表单 Validator V1.0
 * @include jquery或者zepto
 * Copyright (c) 2015-9-17 XISA
 */
 define("ZSYWEB.Widget.Validator", function (){
    // 正则表达式
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/  
      , ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i  
      , base64Regex = /[^a-zA-Z0-9\/\+=]/i
      , numbericDashRegex = /^[\d\-\s]+$/
      , numberRegex = /^\d*$/
      , urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/ 
      , phoneRegex = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/i 
      , floatNumerRegex = /^\d+(\.\d+)?$/
      , nullRegex = /\S/
      , textNameRegex = /^[a-z0-9_$]+$/i
      , chineseNameRegex = /^[\u4e00-\u9fa5a-zA-Z]+$/
      , passwordRegex = /^[\w~#^$@%&!*]+$/
      , idCardNoRegex = /^\d{15}(\d{2}[A-Za-z0-9])?$/
      , bankCardNoRegex = /^\d{16,19}$/
      , bankCardOwnerRegex = /^[\u4e00-\u9fa5a-zA-Z]{2,18}$/
      ;
    // 默认提示
    var defaultsMsg = {
        emailError: 'email地址有错,请重新输入!',
        numberError: '请输入数字!',
        numbericDashError: '请输入数字或横线!',
        floatNumerError: '请输入正确的数字!',
        urlError: 'url地址不正确!',
        phoneError: '手机号码不正确!',
        nullError: '文本不能为空!',
        ipError: 'ip不正确!',
        textNameError: '只能包含字母数字下划线!',
        chineseNameError: '只能输入中文!',
        base64Error: 'base64不正确!',
        passwordError: '密码不正确!',
        idCardNoError: '身份证号码不正确!',
        bankCardNoError: '银行卡号不正确!',
        bankCardOwnerError: '姓名不少于2位汉字!'
    };
    // 保存所有需要验证的dom节点
    var _allDom = {};
    // 私有验证方法
    var $self = {
        // 解析
        _validateField : function(data) {
            var $field = data.rules;
            for (var key in $field) {
                var _field = $field[key]
                , obj = {
                    type: _field.type,
                    messages: _field.messages,
                    fieldName: _field.name,
                    maxlength: _field.maxlength,
                    minlength: _field.minlength,
                    tofixed: _field.tofixed,
                    callback: data.callback
                };
                $self._dom(obj);
            }
            // callback
            if($.isFunction(data.callback)){
                data.callback(_allDom);
            }
        },
        // dom
        _dom: function(obj){
            var domsInput = $('body').find('input')
            , domsTextarea = $('body').find('textarea')
            ;
            $self._validateinputortextarea(obj, domsInput);
            $self._validateinputortextarea(obj, domsTextarea);
        },
        // 遍历dom
        _validateinputortextarea : function(obj, doms) {
            doms.each(function(){
                var that = $(this)
                , type = obj.type
                , fieldName = obj.fieldName
                , self = $self._hooks[type] ? $self._hooks[type] : $self._hooks['text']
                , selfName = that.attr('name')
                ;
                if(selfName == fieldName && self){
                    obj.field = that
                    self(obj);
                }
            });
        },
        // 返回提示和是否验证通过
        _validateinputcallback : function(obj) {
            var regex = obj.regex
            , messages = obj.messages
            , field = obj.field
            , fieldName = obj.fieldName
            , fn = obj.fn
            , dom = $(messages.id)
            , errorMsg = messages.errorMsg || obj.defaultMsg
            , successMsg = messages.successMsg || ''
            , maxlength = obj.maxlength || 0
            , msg = ''
            , privateCallback = messages.callback || null 
            , defaultShowMsg = messages.defaultShowMsg
            , publicCallback = obj.callback || null 
            ;
            if( maxlength > 0 ){
                field.attr('maxlength',maxlength);
            }

            var _changeFn = function(field){
                var val = field.val()
                , flg = false
                ;
                if( val.length > 0 ) defaultShowMsg = true;
                if(regex.test(val)){  // success
                    // 自定义
                    if($.isFunction(fn)){
                        var fnObj = fn(val);
                        flg = fnObj.flg;
                        msg = fnObj.msg;
                    }else{
                        flg = true;
                        msg = successMsg;
                    }
                }else{
                    flg = false;
                    msg = errorMsg;
                }
                _allDom[fieldName] = {
                    val: val,
                    flg: flg
                };
                dom.html(msg)
                if($.isFunction(privateCallback) && defaultShowMsg){
                    privateCallback(flg, dom);
                }
            }
            _changeFn(field);
            $self.inputValChange(field,function(){
                _changeFn(field);
                if($.isFunction(publicCallback)){
                    publicCallback(_allDom);
                }
            });
        },
        // input val change
        inputValChange : function(element,webChange) {
            var element = $(element).get(0);
            if("\v"=="v") {
                element.onpropertychange = webChange;
            }else{
                element.addEventListener("input",webChange,false);
            }
            return webChange
        },
        // TYPE API
        _hooks : {

            chineseName: function(obj) {
                obj.regex = chineseNameRegex;
                obj.defaultMsg = defaultsMsg.chineseNameError;
                $self._validateinputcallback(obj);
            },

            base64: function(obj) {
                obj.regex = base64Regex;
                obj.defaultMsg = defaultsMsg.base64Error;
                $self._validateinputcallback(obj);
            },

            textName: function(obj) {
                obj.regex = textNameRegex;
                obj.defaultMsg = defaultsMsg.textNameError;
                $self._validateinputcallback(obj);
            },

            email: function(obj) {
                obj.regex = emailRegex;
                obj.defaultMsg = defaultsMsg.emailError;

                $self._validateinputcallback(obj);
            },

            text: function(obj) {
                obj.regex = nullRegex;
                obj.defaultMsg = defaultsMsg.nullError;
                
                $self._hooks.MinLengthMsgFn(obj);
            },

            url: function(obj) {
                obj.regex = urlRegex;
                obj.defaultMsg = defaultsMsg.urlError;
                $self._validateinputcallback(obj);
            },

            ip: function(obj) {
                obj.regex = ipRegex;
                obj.defaultMsg = defaultsMsg.ipError;
                $self._validateinputcallback(obj);
            },

            phone: function(obj) {
                obj.regex = phoneRegex;
                obj.defaultMsg = defaultsMsg.phoneError;
                $self._validateinputcallback(obj);
            },
            MinLengthMsgFn: function(obj) {
                var messages = obj.messages
                , minlength = parseInt(obj.minlength) || 0
                ;
                obj.fn = function(val) {
                    var flg = true
                    , len = val.length
                    ;
                    if(minlength > len){
                        flg = false;
                        msg = messages.minLengthMsg || messages.errorMsg ||  obj.defaultMsg;
                    }else{
                        flg = true;
                        msg = messages.successMsg || '';
                    }
                    return {
                        flg: flg,
                        msg: msg
                    };
                }
                $self._validateinputcallback(obj);
            },
            number: function(obj) {
                obj.regex = numberRegex;
                obj.defaultMsg = defaultsMsg.numberError;

                $self._hooks.MinLengthMsgFn(obj);
            },

            numbericDash: function(obj) {
                obj.regex = numbericDashRegex;
                obj.defaultMsg = defaultsMsg.numbericDashError;

                $self._hooks.MinLengthMsgFn(obj);
            },

            floatNumber: function(obj) {
                obj.regex = floatNumerRegex;
                obj.defaultMsg = defaultsMsg.floatNumerError;

                var messages = obj.messages
                , tofixed = parseInt(obj.tofixed) || 2
                , minlength = parseInt(obj.minlength) || 0
                ;
                obj.fn = function(val) {
                    if(val.split('.').length == 2){
                        var point = val.split('.')[1]
                        , len = point.length
                        ;
                        // 限制多少位小数
                        if(len > tofixed){
                            var _val = parseFloat(val).toFixed(tofixed);
                            obj.field.val(_val);
                        }
                    }
                    return {
                        flg: true,
                        msg: messages.successMsg
                    };
                }
                $self.imgMode(obj.field);
                $self._validateinputcallback(obj);
            },

            password: function(obj) {
                obj.regex = passwordRegex;
                obj.defaultMsg = defaultsMsg.passwordError;

                $self._hooks.MinLengthMsgFn(obj); 
            },
            idCardNo: function(obj) {
                obj.regex = idCardNoRegex;
                obj.defaultMsg = defaultsMsg.idCardNoError;

                $self._hooks.MinLengthMsgFn(obj);
            },
            bankCardNo: function(obj) {
                obj.regex = bankCardNoRegex;
                obj.defaultMsg = defaultsMsg.bankCardNoError;

                $self._hooks.MinLengthMsgFn(obj);
            },  
            bankCardOwner: function(obj){
                obj.regex = bankCardOwnerRegex;
                obj.defaultMsg = defaultsMsg.bankCardOwnerError;

                $self._hooks.MinLengthMsgFn(obj);
            }
        }
    };
    // 入口
    var Validator = {
        setOption : function(obj){
            $self._validateField(obj);
        }
    };

    NameSpace.Register("ZSYWEB.Widget.Validator", Validator);
    return Validator;
});