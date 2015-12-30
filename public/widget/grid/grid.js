define("ZSYWEB.Widget.Grid!CSS", ['ZSYWEB.Event', 'ZSYWEB.Services'], function () {
    var $core = ZSYWEB.Core
        , $evt = ZSYWEB.Event
        , $http = ZSYWEB.Services
        ;
    //解析Grid头部
    var tHeader = {
        createHeader : function( data ) {
            var htm = '<thead>';
            for( var i = 0; i < data.length; i++ ) {
                var txt = this.createRow(data[i]);
                if( i == 0 ) {
                    txt = this.createRow(data[i], "firstChildTh");
                }else if( i == (data.length -1)) {
                    txt = this.createRow(data[i], "lastChildTh");
                }
                htm += txt;
            }
            htm += "</thead>";
            return htm;
        },
        createRow : function( obj, cls ) {
            var htm = '';
            if( obj.width == undefined ) {
                if( obj.type == "hidden" ) {
                    htm = '<th class="'+cls+'" style="display:none;">'+obj.value+'</th>';
                }else{
                    htm = '<th class="'+cls+'">'+obj.value+'</th>';
                }
            }else {
                if( obj.type == "hidden" ) {
                    htm = '<th width="'+obj.width+'" class="'+cls+'" style="display:none;">'+obj.value+'</th>';
                }else{
                    htm = '<th width="'+obj.width+'" class="'+cls+'">'+obj.value+'</th>';
                }
            }
            return htm;
        }
    };
    //解析body
    var tBody = {
        createBody : function( data, op ) {
            var htm = '<tboby>';
            for( var i = 0; i < data.length; i++ ) {
                var temp = data[i];
                htm += this.createRow(temp, op);
            }
            htm += '</tbody>';
            return htm;
        },
        createRow : function( data, op ) {
            var trHtm = '<tr>';
            trHtm += this.createCell(data, op);
            trHtm += '</tr>';
            return trHtm;
        },
        createCell : function( data , op ) {
            var tdHtm = '';
            var cells = op.headers;
            for( var i = 0; i < cells.length; i++ ) {
                var temp = cells[i];
                var key = temp.key;
                if( key == "" ) {
                    tdHtm += this.createCustomer(data, op);
                }else{
                    var displayType = "";
                    var showTxt = data[key] || "";
                    if( $.isFunction( temp.formatter ) ) {
                        showTxt = temp.formatter(data);
                    }
                    if( temp.type == "hidden" ) {
                        tdHtm += '<td style="display:none;" title="'+showTxt+'">'+showTxt+'</td>';displayType = "node";
                    }else{
                        tdHtm += '<td title="'+showTxt+'">'+showTxt+'</td>';displayType = "node";
                    }
                }
            }
            return tdHtm;
        },
        createCustomer : function ( data, op ) {
            var csHtm = '';
            var cusCells = op.customeCol;
            if( $.isArray(cusCells) ) {
                for( var i = 0; i < cusCells.length; i++ ) {
                    var temp = cusCells[i];
                }
            }
            return csHtm;
        }
    };
    var tGrid = {
        createTable : function(op, data) {
            var htm = '<div class="csn-m-grid-div"><table width="1158" class="csn-m-grid-div-table tc">';
            htm += tHeader.createHeader(op.headers);
            htm += tBody.createBody(data.data, op);
            htm += '</table></div>';
            return htm;
        }
    };
    //解析分页
    var formatterPage = function( op ) {
        
    };
    //获取数据
    var ajaxGetData = function( url, data, cb ) {
        $http.get({
            url : url,
            data : data,
            success : function ( data ) {
                cb(data);
            },
            error : function() {
                console.info("Grid Get Data error!");
            }
        });
    };
    //解析数据
    var formatterData = function( op, data ) {
        var conf = op.dataConfig;
        var rootData = conf.rootData.split(".");
        var page = conf.page;
        var size = conf.size;
        var total = conf.total;
        var rootNode = data;
        var gPage = 0;
        var gSize = 0;
        var gTotal = 0;
        for( var i = 0; i < rootData.length; i++ ) {
            var temp = rootData[i];
            if( i == (rootData.length-1) ) {
                gPage = rootNode[page];
                gSize = rootNode[size];
                gTotal = rootNode[total];
            }
            rootNode = rootNode[temp];
        }
        return {
            data : rootNode,
            page : gPage,
            size : gSize,
            total : gTotal
        }
    };
    //解析Grid
    var Grid = function() {};
    Grid.prototype = {
        constructor : Grid,
        loadData : function() {
            var op = this.options;
            var self = this;
            if( op.localData != null ) {
                self.data = {
                    data : op.localData
                };
                self.getInitialState();
            }else{
                ajaxGetData(op.url, op.postData, function( data ){
                    var rtData = formatterData(op, data);
                    this.data = rtData;
                });
            }
        },
        getInitialState : function() {
            var data = this.data;
            var op = this.options;
            var el = op.gridDivId;
            var htm = tGrid.createTable(op, data);
            $(el).html(htm);
        },
        getFirst : function() {

        },
        getLast : function() {

        },
        getPrev : function() {

        },
        getNext : function() {

        },
        setOption : function( op ) {
            var defaultOp = {
                gridDivId : "body",
                url : "",
                localData : null,
                postData : {
                    page : 0,
                    size : 20
                },
                dataConfig : {
                    rootData : "list",
                    page : "page",
                    size : "size",
                    total : "total"
                }
            };
            this.options = $.extend(true, {}, defaultOp, op);
            this.render();
        },
        render : function() {
            var op = this.op;
            this.loadData();
        }
    };
    var $core = ZSYWEB.Core;
    $core.createPlug({
        type : "csn-grid",
        templateUrl : "grid.htm",
        template : null,
        render : function( obj ) {
            
        }
    });
    NameSpace.Register("ZSYWEB.Widget.Grid", Grid);
    return Grid;
});