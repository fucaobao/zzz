(function() {
    var result = [],
        dependents = ['/jslib/jquery-1.11.3.js',
                      '/jslib/bootstrap.min.js',
                      '/jslib/require.js',
                      '/js/core.js',
                      '/js/binder.js',
                      '/config/config.js'];
    for (var i = 0, len = dependents.length; i < len; i++) {
        result.push('<script src="' + dependents[i] + '"></script>');
    }
    document.write(result.join(''));
})();