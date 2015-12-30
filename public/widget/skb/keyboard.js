define("ZSYWEB.Widget.KeyBoard", ['ZSYWEB.Comm', 'ZSYWEB.Event', 'ZSYWEB.Binder', 'ZSYWEB.ShapeGallery'], function (){
	var evt = ZSYWEB.Event;
	var keyBoardPts = [];
	var keyBoardArr = ["1", "4", "7", "隐藏", "2", "5", "8", "0", "3", "6", "9", "删除"];
	var ShapeGallery = ZSYWEB.ShapeGallery;
	var initFlg = false;
	var drawGrid = function( ctx, container ) {
		var width = container.width(), height = container.height();
		var gap = 0;
		var keyBoardw = width - gap*4;
		var keyBoardh = height - gap*5;
		var gw = keyBoardw / 3;
		var gh = keyBoardh / 4;
		var pts = [];
		var centerPoints = [];
		ctx.setStyle({
			strokeStyle : "#666666",
			lineWidth : 1
		});
		for( var i = 0; i < 3; i++ ) {
			for( var j = 0; j < 4; j++ ) {
				var x1 = (gw * i) + gap*i;
				var y1 = (gh * j) + gap*j;
				var x2 = x1 + gw;
				var y2 = y1 + gh;
				pts.push([x1, y1, gw, gh, (x1+gw), (y1+gh)]);
				var cx = (gw * 0.5 + gap) + ((gw+gap)*i);
				var cy = (gh * 0.5 + gap) + ((gh+gap)*j);
				centerPoints.push([cx,cy]);
			}
		}
		keyBoardPts = pts;
		ctx.drawRects(pts);
		console.info(pts);
		drawText(centerPoints, ctx, width, height);
	};
	var drawText = function( pts, ctx, width, height ) {
		//0.046875
		var fontSize = width*0.046875;
		if( width > (height+200) ) {
			fontSize = (height+200)*0.046875;
		}
		console.info(fontSize);
		var str = fontSize+"px Arial";
		for( var i = 0; i < pts.length; i++ ) {
			var text = keyBoardArr[i];
			ctx.drawText( text, pts[i][0], pts[i][1], str );
		}
	};
	var judgeKeyBoard = function( x, y ) {
		var index = -1;
		for( var i = 0; i < keyBoardPts.length; i++ ) {
			var p = keyBoardPts[i];
			if ( x > p[0] && x < p[4] && y > p[1] && y < p[5] ) {
				index = i;
				break;
			}
		}
		return index;
	};
	var KeyBoard = function( container ) {
		this.container = container;
		var self = this;
		this.ctx = new ShapeGallery(container);
		$("body").cusbind("draw", function( evt, data ){
			self.draw();
		});
		$("body").uncusbind("passwordkeyshow").cusbind("passwordkeyshow", function( evt, data ){
			self.show();
		});
		initFlg = true;
	};
	KeyBoard.prototype = {
		constructor : KeyBoard,
		init : function( op ) {
			this.setOption(op);
		},
		setOption : function( op ) {
			this.options = op;
		},
		draw : function() {
			var ctx = this.ctx;
			drawGrid(ctx, this.container);
			this.bindEv();
		},
		bindEv : function() {
			var self = this;
			var container = this.container;
			var op = this.options;
			evt.bind(container, "canvas", "click", function( dom, evt ){
				var offset = container.position();
				var x = evt.pageX - offset.left, y = evt.pageY-offset.top;
				var index = judgeKeyBoard(x , y);
				if( index == -1 ) {
					return;
				}
				var cb = op.callback;
				if( keyBoardArr[index] == "删除" ) {
					cb("delete");
					$("body").send("deletePassword", keyBoardArr[index]);
				}else if( keyBoardArr[index] == "隐藏" ) {
					self.hide();
				}else {
					var value = keyBoardArr[index];
					if( op.map != undefined ) {
						value = op.map[value];
					}
					$("body").send("keyboardkeyup", value);
					if( $.isFunction(cb) ) {
						cb("input", value);
					}
				}
			});
		},
		hide : function() {
			this.container.hide();
		},
		show : function() {
			this.container.show();
		}
	};
	NameSpace.Register("ZSYWEB.Widget.KeyBoard", KeyBoard);
	return KeyBoard;
});