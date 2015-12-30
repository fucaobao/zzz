define("ZSYWEB.Widget.SKB", ['ZSYWEB.Comm', 'ZSYWEB.ShapeGallery', 'ZSYWEB.Event', 'ZSYWEB.Widget.PassWord', "ZSYWEB.Widget.KeyBoard"], function(require){
	var PassWord = ZSYWEB.Widget.PassWord, KeyBoard = ZSYWEB.Widget.KeyBoard;
	var createContainer = function( op ) {
		var pop = op.password;
		var kop = op.keyboard;
		if( pop.show ) {
			var htm = '<div id="password-container" style="width:100%;height:80px;position:relative;"></div><input type="hidden" binder-model="password" />';
			var container = pop.container || $("body");
			var width = $(window).width();
			var height = container.height();
			var h = (height - 80) * 0.5;
			container.find("#password-container").remove();
			$(htm).appendTo(container).css({
				//top : h+"px"
			});
		}
		if( kop.show ) {
			$("body").find("#keyboard-container").remove();
			var htm = '<div id="keyboard-container" style="left: 0px;width:100%;height:216px;position:absolute;bottom:0px;z-index:10000;background:#fff;"></div>';
			$(htm).appendTo($("body"));
		}
	};
	var SKB = function( container ) {
		this.container = container;
	};
	SKB.prototype = {
		constructor : SKB,
		init : function( op ) {
			//初始化输入框
			createContainer(op);
			if(op.password.show) {
				// if( this.pwWidget == undefined ) {
					this.pwWidget = new PassWord($("#password-container"));
				// }
				this.pwWidget.init(op.password);
			}
			if(op.keyboard.show) {
				// if( this.keybWidget == undefined ) {
					this.keybWidget = new KeyBoard($("#keyboard-container"));
				// }
				this.keybWidget.init(op.keyboard);
			}
		},
		draw : function() {
			$("body").send("draw");
		},
		install : function( main ) {
			var inst = this;
			main.bind("draw", function() {
				inst.draw();
			}, this)
		}
	};
	NameSpace.Register("ZSYWEB.Widget.SKB", SKB);
	return PassWord;
});