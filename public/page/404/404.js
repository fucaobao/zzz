require(['ZSYWEB.Event', 'ZSYWEB.Binder', 'ZSYWEB.Util'], function() {
    var $core = ZSYWEB.Core,
        $binder = ZSYWEB.Binder,
        $util = ZSYWEB.Util;
    $core.Ready(function() {
        $binder.init();
        console.log('test 404');
    });
});