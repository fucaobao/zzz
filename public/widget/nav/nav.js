define("ZSYWEB.Widget.Nav", ['ZSYWEB.Event'], function () {
    var template = '<ol class="csn-m-step" id="{{csn-id}}">'+
				'	</ol>';
    var $core = ZSYWEB.Core;
    $core.createPlug({
        type : "csn-nav",
        templateUrl : null,
        template : template,
        createRow : function( arr, index ) {
        	var htm = '';
        	for( var i = 0; i < arr.length; i++ ) {
        		var cls = "";
        		if( i == 0 ) {
        			cls = "first-li";
        		}else if( i == (arr.length-1)) {
        			cls = "last-li";
        		}
        		if( i == index ) {
        			cls +=" active";
        		}
        		htm += '<li class="'+cls+'" style="width:25%;">'+arr[i]+'</li>';
        	}
        	return htm;
        },
        render : function( dom, obj ) {
            var data = obj.o["csn-array"];
            var arr = data.split(",");
            dom.html(obj.h);
            var htm = this.createRow(arr, obj.o['csn-active'] || 0);
            dom.find("ol").html(htm);
        },
        updatePlug : function( dom, index ) {
        	dom.find("li").removeClass("active");
        	dom.find("li").eq(index).addClass("active");
        }
    });
});