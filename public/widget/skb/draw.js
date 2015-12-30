define("ZSYWEB.ShapeGallery", [], function(require){
	var ShapeGallery = function( container, css ) {
		var id = container.attr("id")+"-canvas";
		var canvas = '<canvas id="'+id+'" width="'+container.width()+'" height="'+container.height()+'"></canvas>';
		var __createCanvas = function() {
			var _css = $.extend(true, {}, {
				width : container.width(),
				height : container.height()
			}, css);
			$(canvas).css(_css).appendTo(container);
		};
		__createCanvas();
		var canvasDom = document.getElementById(id);
		var ctx = canvasDom.getContext('2d');
		this.ctx = ctx;
	};
	ShapeGallery.prototype = {
		constructor : ShapeGallery,
		setStyle : function( obj ) {
			/*
			*fillStyle	设置或返回用于填充绘画的颜色、渐变或模式
			*strokeStyle
			*lineWidth 
			*/
			var ctx = this.ctx;
			if( obj == undefined ) {
				ctx.lineWidth = 1;
			}else{
				if( obj.fillStyle != undefined ) {
					ctx.fillStyle = obj.fillStyle;
				}
				if( obj.strokeStyle != undefined ) {
					ctx.strokeStyle = obj.strokeStyle;
				}
				if( obj.lineWidth == undefined ){
					obj.lineWidth = 1;
				}
				ctx.lineWidth = obj.lineWidth;
			}
			this.adjust = ctx.lineWidth % 2 == 1 ? 0.5 : 0;
		},
		begin : function() {
			var ctx = this.ctx;
			ctx.save();
			ctx.beginPath();
		},
		end : function() {
			var ctx = this.ctx;
			ctx.restore();
		},
		clear : function( x, y, w, h ) {
			var ctx = this.ctx;
			ctx.clearRect(x, y, w, h);
		},
		drawLine : function( x1, y1, x2, y2 ) {
			var ctx = this.ctx;
			var adjust = this.adjust;
			var ptStartX = parseInt(x1) + adjust;
			var ptStartY = parseInt(y1) + adjust;
			var ptEndX = parseInt(x2) + adjust;
			var ptEndY = parseInt(y2) + adjust;
			this.begin();
			ctx.moveTo( ptStartX, ptStartY );
			ctx.lineTo( ptEndX, ptEndY );
			ctx.stroke();
			this.end();
		},
		drawLines : function( pts ) {
			var ctx = this.ctx;
			if( pts == undefined || pts.length == 0 ) {
				return;
			}
			for( var i = 0; i < pts.length; i++ ) {
				var pt = pts[i];
				this.drawLine(pt[0], pt[1], pt[2], pt[3]);
			}
		},
		drawCircle : function( pt ) {
			var ctx = this.ctx;
			ctx.beginPath();
			ctx.arc(pt.cx, pt.cy,pt.r, 0 , Math.PI*2, false);
			ctx.fill();
			ctx.closePath();
		},
		drawCircles : function( cPts ) {
			var ctx = this.ctx;
			if( cPts == undefined || cPts.length == 0 ) {
				return;
			}
			for( var i = 0; i < cPts.length; i++ ) {
				var pt = cPts[i];
				this.drawCircle(pt);
			}
		},
		drawText : function( text, x, y, font ) {
			var ctx = this.ctx;
			ctx.font=font;
			ctx.textAlign="center";
			ctx.textBaseline="middle";
			ctx.fillText(text,x,y);
		},
		drawRect : function( x, y, w, h ) {
			var ctx = this.ctx;
			this.begin();
			var adjust = this.adjust;
			ctx.strokeRect(x+adjust, y+adjust, w, h);
			this.end();
		},
		drawRects : function( pts ) {
			if( pts == undefined || pts.length == 0 ) {
				return;
			}
			for( var i = 0; i < pts.length; i++ ) {
				var pt = pts[i];
				this.drawRect(pt[0], pt[1], pt[2], pt[3]);
			}
		}
	}
	NameSpace.Register("ZSYWEB.ShapeGallery", ShapeGallery);
	return ShapeGallery;
});