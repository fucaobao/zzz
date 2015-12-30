define("ZSYWEB.Widget.Grid!CSS", ['ZSYWEB.Event'], function () {
    var girdControl;
    var formatOptions = function (obj) {
        var op = {};
        var colNames = [];
        var colModel = [];
        for (var key in obj.headers) {
            var header = obj.headers[key];
            var model = {index: header.key, name: header.key, align: 'center'};
            if (header.type === 'hidden') {
                $.extend(model, {hidden: true});
            }
            if (header.formatter) {
                $.extend(model, {formatter: header.formatter});
            }
            if (header.width) {
                $.extend(model, {width: header.width});
            }
            colNames.push(header.value);
            colModel.push(model);
        }
        if (obj.customeCol) {
            for (var key in obj.customeCol) {
                var custome = obj.customeCol[key];
                colNames.push(custome.value);
                colModel.push({index: custome.key, name: custome.key, align: 'center'});
            }
        }
        obj.colNames = colNames;
        obj.colModel = colModel;
        return obj;
    };
    var tdClick = function (dom, inst) {
        var op = inst.options;
        var gridDivId = op.gridDivId;
        var id = dom.attr("grid-id");
        var rowdata = $(gridDivId).jqGrid("getRowData", id);
        return rowdata;
    };
    var formatEvt = function (obj, gridDivId, inst) {
        var callback = inst.callback;
        var evts = {
            id: 'gridPlug',
            el: gridDivId,
            evt: {},
            handle: {}
        };
        var str = '';
        for (var key in obj) {
            var temp = key + "Click",
                str = "click ." + key;
            evts.evt[str] = temp;
            evts.handle[temp] = function (dom, ev) {
                var cls = dom.attr("class");
                var data = tdClick(dom, inst);
                callback[cls](data);
            }
        }
        console.info(evts);
        return evts;
    };
    var Grid = function () {
    };
    Grid.prototype = {
        constructor: Grid,
        setData: function (data) {
            this.data = data;
        },
        setOption: function (obj) {
            if (!obj.headers) {
                return;
            }
            formatOptions(obj);
            var self = this;
            var __loadComplete = function () {
                if (arguments && arguments.length > 0) {

                    var jsonReader = girdControl.options.jsonReader;
                    var rootD = jsonReader.root;
                    var jrecords = jsonReader.records;
                    var arecords = jrecords.split(".");
                    var atotal = jsonReader.total.split(".");
                    var aindex = jsonReader.index.split(".");
                    var records = 0, total = 0, index = 0;
                    var temp = arguments[0];
                    for( var i = 0; i < arecords.length-1; i++ ) {
                        var t = arecords[i];
                        temp = temp[t];
                    }
                    console.info(aindex[aindex.length-1]);
                    records = temp[arecords[arecords.length-1]] || 0;
                    total = temp[atotal[atotal.length-1]] || 0;
                    index = temp[aindex[aindex.length-1]] || 0;
                    

                    $('.total-span').text('共计' + records+ '条');
                    $('#pagerNowPerTotalPage').text(index+ '/' + total);
                    $('#pagerNowPage').val(index);
                    girdControl.options.index = index;
                    girdControl.options.page = index;
                    girdControl.options.total = total;
                }
                var data = $(obj.gridDivId).jqGrid("getRowData");
                self.setData(data);
                if (obj.customeCol) {
                    var ids = $(obj.gridDivId).jqGrid("getDataIDs"),
                        customeCol = obj.customeCol;

                    for (var i = 0; i < ids.length; i++) {
                        var rowdata = $(obj.gridDivId).jqGrid("getRowData", ids[i]);
                        for (var col in customeCol) {
                            var content = '';
                            for (var c in customeCol[col].content) {
                                var optContent = customeCol[col].content[c];
                                if(optContent.dependency && optContent.dependencyValue){
                                    if(rowdata[optContent.dependency] === optContent.dependencyValue){
                                        content += '<a grid-id="' + ids[i] + '" class="' + optContent.cls + '" href="javascript:void(0);" >' + optContent.text + '</a>&nbsp;';    
                                    }
                                } else {
                                    content += '<a grid-id="' + ids[i] + '" class="' + optContent.cls + '" href="javascript:void(0);" >' + optContent.text + '</a>&nbsp;';
                                }
                            }
                            var o = new Object();
                            o[customeCol[col].key] = content;
                            $(obj.gridDivId).jqGrid("setRowData", ids[i], o);
                        }
                    }
                }
                if ($.isFunction(obj.loadCompleteCb)) {
                    obj.loadCompleteCb(arguments[0]);
                }
            };
            var jsonReader = {
                root: "data",
                id: "id",
                records: "totalRecord",
                total: "total",
                index: 'page',
                repeatitems: false
            };
            var defaultOp = {
                url: ""
                , postData: {}
                , datatype: "json"
                , regional: 'cn'
                , autowidth: true
                , rownumbers: false
                , height: 'auto'
                , viewrecords: true
                , rowNum: 20
                , rowList: [20, 50, 100]
                , jsonReader: jsonReader
                , loadComplete: __loadComplete
                , prmNames : {
                    rows : 'pageSize',
                    page : 'pageNo'
                }
            };
            this.options = $.extend(true, {}, defaultOp, obj);
            this.render();
        },
        bindEvent: function () {
            var op = this.options;
            var gridDivId = op.gridDivId;
            var gridPager = op.gridPager;
            var evt = ZSYWEB.EventCollector;
            var customeCol = op.customeCol;
            var arrCls = [], cls = {}, className = [];
            if(customeCol!==undefined){
                for (var i = 0; i < customeCol.length; i++) {
                    var temp = customeCol[i];
                    var content = temp.content;
                    if (content != undefined) {
                        for (var j = 0; j < content.length; j++) {
                            var _temp = content[j];
                            if ($.inArray(_temp.cls, className) == -1) {
                                className.push(_temp.cls);
                                cls[_temp.cls] = _temp.cb;
                            }
                        }
                        arrCls.push(cls);
                    }
                }
            }
            this.callback = cls;
            var evts = formatEvt(cls, gridDivId, this);

            function clearPageColor() {
                $('#pagerNextPage,#pagerPrePage').css('background-color', '');
            }

            evt.initEvents(evts);
            evt.initEvents({
                id: 'gridPager',
                el: gridPager,
                evt: {
                    'click .pages-div-left>a': 'totalPerPage',
                    'click #pagerHomePage': 'pagerHomePage',
                    'click #pagerPrePage': 'pagerPrePage',
                    'click #pagerNextPage': 'pagerNextPage',
                    'click #pagerLastPage': 'pagerLastPage',
                    'keydown #pagerNowPage': 'pagerNowPage'
                },
                handle: {
                    totalPerPage: function (dom) {
                        $('.pages-div-left>a').removeClass('active');
                        $(dom).addClass('active');
                        switch ($(dom).index()) {
                            case 0:
                                girdControl.options.rowNum = 20;
                                break;
                            case 1:
                                girdControl.options.rowNum = 50;
                                break;
                            case 2:
                                girdControl.options.rowNum = 100;
                                break;
                        }
                        girdControl.reload();
                    },
                    pagerHomePage: function () {
                        girdControl.options.page = 1;
                        clearPageColor();
                        $('#pagerPrePage').addClass('active').siblings().removeClass('active');
                        girdControl.refresh();
                    },
                    pagerPrePage: function () {
                        var page = girdControl.options.page,
                            pre = page - 1;

                        clearPageColor();
                        if(page==1){
                            $('#pagerPrePage').addClass('active').siblings().removeClass('active');
                            return;
                        } else {
                            girdControl.options.page = pre;
                            girdControl.refresh();
                        }
                    },
                    pagerNextPage: function () {
                        var page = girdControl.options.page,
                            next = page + 1;

                        clearPageColor();
                        if(page==girdControl.options.total){
                            $('#pagerNextPage').addClass('active').siblings().removeClass('active');
                            return;
                        } else {
                            girdControl.options.page = next;
                            girdControl.refresh();
                        }
                    },
                    pagerLastPage: function () {
                        clearPageColor();
                        $('#pagerNextPage').addClass('active').siblings().removeClass('active');
                        girdControl.options.page = girdControl.options.total;
                        girdControl.refresh();
                    },
                    pagerNowPage: function (dom, evt) {
                        //enter
                        var val = $(dom).val();
                        if (evt.keyCode === 13 && val <= girdControl.options.total) {
                            girdControl.options.page = val;
                            girdControl.refresh();
                        }
                    }
                }
            });
        },
        render: function () {
            girdControl = this;
            var op = this.options;
            var gridDivId = op.gridDivId;
            var gridPager = op.gridPager;

            var pager =
                '<div id="page-div">' +
                '    <div class="pages-div-left l">' +
                '        <a href="javascript:void(0);" class="active">每页20条</a>' +
                '        <a href="javascript:void(0);">每页50条</a>' +
                '        <a href="javascript:void(0);">每页100条</a>' +
                '    </div>' +
                '    <div class="pages-div-right r">' +
                '        <span class="total-span l"></span>' +
                '        <div class="pages-div-right-number r">' +
                '            <a href="javascript:void(0);" id="pagerHomePage">首页</a>' +
                '            <a href="javascript:void(0);" id="pagerPrePage">上一页</a>' +
                '            <span class="pagerNowPage-span"><input type="text" class="txt-input" value="" id="pagerNowPage" /></span>' +
                '            <a href="javascript:void(0);" class="number-a"><i id="pagerNowPerTotalPage"></i></a>' +
                '            <a href="javascript:void(0);" id="pagerNextPage">下一页</a>' +
                '            <a href="javascript:void(0);" id="pagerLastPage">末页</a>' +
                '        </div>' +
                '    </div>' +
                '</div>';
            if ($(gridPager).children().length === 0) {
                $(gridPager).append(pager);
            }

            $(gridDivId).jqGrid(this.options);
            this.bindEvent();
        },
        refresh: function () {
            var op = this.options;
            var gridDivId = op.gridDivId;
            //var page = $(gridDivId).getGridParam('page'); // current page

            $(gridDivId).jqGrid('setGridParam', {
                page: this.options.page,
                rowNum: this.options.rowNum,
                postData: this.options.postData
            }).trigger("reloadGrid");
            console.info("refresh");
            //console.info(page);
        },
        reload: function (obj) {
            this.options.page = 1;
            this.options.postData = obj;
            this.refresh();
        },
        showCol: function(arrCols){
            $(this.options.gridDivId).setGridParam().showCol(arrCols);
        },
        hideCol: function(arrCols){
            $(this.options.gridDivId).setGridParam().hideCol(arrCols);
        },
        install : function( main ) {
            main.bind("nextPage", function(){

            }, this);
            main.bind("prepage", function(){
                
            }, this);
        }
    };
    NameSpace.Register("ZSYWEB.Widget.Grid", Grid);
    return Grid;
});