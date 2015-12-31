require(['ZSYWEB.Event', 'ZSYWEB.Services', 'ZSYWEB.Binder', 'ZSYWEB.Util'], function() {
    var $core = ZSYWEB.Core,
        $http = ZSYWEB.Services,
        $binder = ZSYWEB.Binder,
        $util = ZSYWEB.Util;
    var file;
    var upload = function(formData) {
        $.ajax({
            type: "POST",
            url: "upload",
            enctype: 'multipart/form-data',
            contentType : false,
            processData: false,
            cache : false,
            data: formData,
            success: function(data) {
                console.log(data);
            }
        });
    };
    $(document).on('change','#resource',function(){
        file = this.files[0];
    }).on('click','#upload',function(){
        var formData = new FormData();
        formData.append('file', file);
        upload(formData);
    });
    $core.Ready(function() {
        $binder.init();
        console.log('test index');
    });
});