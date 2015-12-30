define("ZSYWEB.Widget.PassWord", ['ZSYWEB.Comm', 'ZSYWEB.Event', 'ZSYWEB.Binder', 'ZSYWEB.ShapeGallery'], function(require){
	var circleIndex = 0;
	var circlePoints = [];
	var evt = ZSYWEB.Event;
	var binder = ZSYWEB.Binder;
	var ShapeGallery = ZSYWEB.ShapeGallery;
	var arr = [];
	var initFlg = false;
	var calCirclePoint = function( x, y, w, h, num ) {
		var cx = w * 0.5;
		var cy = h * 0.5;
		var r = h/3;
		if( r > (w/3)) {
			r = w/3;
		}
		var pts = [];
		for( var i = 0; i < num; i++ ) {
			pts.push({
				cx : (x + cx)+(w*i),
				cy : y + cy,
				r : r
			});
		}
		return pts;
	};
	var drawInput = function( ctx, container, op ) {
		var width = container.width() - 60, h = container.height();
		var height = 50, firstXPoint = 0, firstYPoint =(h-height)*0.5, num = op.num;
		ctx.setStyle({
			strokeStyle : "#999",
			lineWidth : 1
		});
		ctx.drawRect(firstXPoint,firstYPoint,width,height);
		var gap = width / num;
		var pts = [];
		var i = 1;
		var cPts = [];
		while( i < num ){
			var x1 = i*gap+firstXPoint;
			var y1 = firstYPoint;
			var x2 = x1;
			var y2 = firstYPoint+height;
			pts.push([x1, y1, x2, y2]);
			i++;
		};
		ctx.setStyle({
			strokeStyle : "#ccc",
			lineWidth : 1
		});
		ctx.drawLines( pts );
		circlePoints = calCirclePoint(firstXPoint, firstYPoint, gap, height, num);
	};
	var drawTitle = function() {};
	var drawBtn = function() {};
	var drawCircle = function( ctx ) {
		var pts = [];
		if( circleIndex > circlePoints.length ) {
			return;
		}
		for( var i = 0; i < circleIndex; i++ ) {
			pts.push(circlePoints[i]);
		}
		ctx.drawCircles(pts);
	};
	var PassWord = function( container ) {
		this.container = container;
		var self = this;
		this.ctx = new ShapeGallery(this.container, {
			"margin-left" : "20px"
		});
		$("body").cusbind("draw", function( evt, data ){
			self.draw();
		});
		$("body").uncusbind("keyboardkeyup").cusbind("keyboardkeyup", function( evt, data ){
			self.input( data );
		});
		$("body").uncusbind("deletePassword").cusbind("deletePassword", function( evt ){
			self.deleteData();
		});
		initFlg = true;
	};
	PassWord.prototype = {
		constructor : PassWord,
		init : function( op ) {
			circleIndex = 0;
			circlePoints = [];
			arr = [];
			this.setOption(op);
			binder.init();
		},
		input : function( data ) {
			var ctx = this.ctx;
			var container = this.container;
			var ops = this.options;
			var self = this;
			if( circleIndex >= ops.num ) {
				return;
			}
			arr.push(data);
			binder.setData({
				password : arr
			});
			circleIndex++;
			if( circleIndex == ops.num ) {
				if( $.isFunction(ops.callback) ) {
					ops.callback(arr);
				}
			}
			drawCircle(ctx);
		},
		deleteData : function() {
			var ctx = this.ctx;
			var container = this.container;
			var ops = this.options;
			var self = this;
			arr.splice(circleIndex-1, 1);
			binder.setData({
				password : arr
			});
			self.clear();
		},
		setOption : function( op ) {
			var defaultOp = {
				num : 6
			};
			this.options = $.extend(true, {}, defaultOp, op);
		},
		draw : function() {
			var ctx = this.ctx;
			drawTitle();
			drawInput(ctx,this.container, this.options);
			drawBtn();
			this.bindEv();
		},
		clear : function() {
			var self = this;
			var container = this.container
				, ops = this.ops
				, ctx = this.ctx
				;
			if( circleIndex != 0 ) {
				circleIndex--;
				ctx.clear(0, 0, container.width(), container.height());
				this.draw();
				drawCircle(ctx);
			}
		},
		bindEv : function() {
			var container = this.container;
			evt.bind(container, "canvas", "click", function() {
				$("body").send("passwordkeyshow");
			});
		}
	};
	NameSpace.Register("ZSYWEB.Widget.PassWord", PassWord);
	return PassWord;
});