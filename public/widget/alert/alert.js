define("ZSYWEB.Widget.Alert!CSS", ['ZSYWEB.Comm', 'ZSYWEB.Event', 'ZSYWEB.NativeAPI'], function() {
    var xs = ZSYWEB.Comm,
        evt = ZSYWEB.EventCollector,
        api = ZSYWEB.NativeAPI;
    var Alert = {
        setOption: function(obj) {
            if (obj == undefined) return;
            var title = obj.title ? obj.title : '',
                txt = obj.txt ? obj.txt : '',
                arr = obj.arr ? obj.arr : [],
                len = arr.length,
                i = 0,
                htm = '';
            htm += '\
				<section id="Alert">\
					<div id="Alert-cont">\
						<h3>' + title + '</h3>';
            htm += txt ? '<p>' + txt + '</p>' : '';
            htm += '<p class="Alert-last-p">';
            for (; i < len; i++) {
                htm += '<a href="javascript:void(0);" class="' + (arr[i].cls ? arr[i].cls : '') + '">' + (arr[i].txt ? arr[i].txt : (arr[i] ? arr[i] : '')) + '</a>';
            }
            htm += '</p>\
					</div>\
				</section>\
			';
            $('html,body').attr('style', 'width:100%;height:100%;overflow:hidden;');
            $('body').append(htm);
            // api.showOverlay();
            $("#Alert").width(document.body.clientWidth);
            $("#Alert").height(document.body.clientHeight);
            var cont = $('#Alert-cont');
            cont.removeClass("top");
            cont.removeClass("leftbot");
            cont.removeClass("rightbot");
            cont.removeClass("center");
            if (obj.width && obj.width != 'auto') {
                cont.css("width", parseInt(obj.width));
            }
            var hei = cont.height() / 2,
                wid = cont.width() / 2,
                lastA_wid = 1 / len * 100 + '%';
            switch (obj.position.toLowerCase()) {
                case 'top':
                    cont.addClass("top");
                    cont.css({
                        'margin-left': -wid
                    });
                    break;
                case 'leftbot':
                    cont.addClass("leftBot");
                    break;
                case 'rightbot':
                    cont.addClass("rightBot");
                    break;
                case 'center':
                    cont.addClass("center");
                    cont.css({
                        'margin-top': -hei,
                        'margin-left': -wid
                    });
                    break;
            }
            $('.Alert-last-p a').width(lastA_wid);
        },
        msgAlert: function(obj) {
            console.info(obj);
            var me = this;
            me.cb = obj.cb;
            this.setOption({
                'title': obj.title || '',
                'txt': obj.txt || '',
                'position': obj.position,
                'width': obj.width,
                'arr': [{
                    'cls': 'alert-btn-ok',
                    'txt': '确定'
                }]
            });
            var evts = {
                id: 'msgAlert',
                el: '#Alert',
                evt: {
                    "click .alert-btn-ok": "okClick"
                },
                handle: {
                    okClick: function() {
                        $("#Alert").remove();
                        $('html,body').removeAttr('style');
                        if ($.isFunction(me.cb)) {
                            me.cb();
                        }
                    }
                }
            };
            evt.initEvents(evts);
        },
        yesNoAlert: function(obj) {
            var me = this;
            me.cb = {
                'okCb': obj.yesBtn.cb,
                'cancelCb': obj.noBtn.cb
            };
            this.setOption({
                'title': obj.title || '',
                'txt': obj.txt || '',
                'position': obj.position,
                'width': obj.width,
                'arr': [{
                    'cls': obj.yesBtn.cls,
                    'txt': obj.yesBtn.value || '确定',
                    cb: obj.yesBtn.cb || function() {}
                }, {
                    'cls': obj.noBtn.cls,
                    'txt': obj.noBtn.value || '取消',
                    cb: obj.noBtn.cb || function() {}
                }]
            });
            var evts = {
                id: 'yesNoAlert',
                el: '#Alert',
                evt: {
                    "click .Alert-last-p>a:nth-child(1)": "okClick",
                    "click .Alert-last-p>a:nth-child(2)": "cancelClick",
                },
                handle: {
                    okClick: function() {
                        $('html,body').removeAttr('style');
                        $("#Alert").remove();
                        if ($.isFunction(me.cb.okCb)) {
                            me.cb.okCb();
                        }
                    },
                    cancelClick: function() {
                        $('html,body').removeAttr('style');
                        $("#Alert").remove();
                        if ($.isFunction(me.cb.cancelCb)) {
                            me.cb.cancelCb();
                        }
                    }
                }
            };
            evt.initEvents(evts);
        }
    };
    NameSpace.Register("ZSYWEB.Widget.Alert", Alert);
    return Alert;
});