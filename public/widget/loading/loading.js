define("ZSYWEB.Widget.Loading!CSS", ['ZSYWEB.NativeAPI'], function (){
	var api=ZSYWEB.NativeAPI;

	var Loading = {
		show : function(){
			var _html = "";
			_html += '<div id="loading_con" class="mask">' +
					 '<div class="loading">' +
					 '<image src="../../images/loading.gif"/>' +
					 '</div>' +
					 '</div>';
			$("body").append(_html);

		},
		hide : function(){
			$("#loading_con").remove();
		}
	};

	NameSpace.Register("ZSYWEB.Widget.Loading", Loading);
	return Loading;
});