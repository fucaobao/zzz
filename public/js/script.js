(function() {
    var result = [],
        dependents = ['/jslib/jquery.min.js',
                      '/jslib/require.js',
                      '/js/core.js',
                      '/js/binder.js',
                      '/jslib/juicer.js',
                      '/config/config.js'];
    for (var i = 0, len = dependents.length; i < len; i++) {
        result.push('<script src="' + dependents[i] + '"></script>');
    }
    document.write(result.join(''));
})();