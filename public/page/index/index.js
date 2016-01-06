require(['ZSYWEB.Services', 'ZSYWEB.Comm', 'ZSYWEB.Util'], function() {
    var $core = ZSYWEB.Core,
        $http = ZSYWEB.Services,
        $comm = ZSYWEB.Comm,
        $util = ZSYWEB.Util;
    var file, map;
    var getFiles = function() {
        $http.get({
            url: 'getFiles',
            data: {
                env: $('#select').val()
            },
            success: function(data) {
                if (data.code === 0) {
                    // $('#alert').hide();
                    var item, result = [],
                        tpl = '<tr><td class="filename width40" data-filename="{#filename#}">{#filename#}</td><td class="width40">{#filesize#}</td><td><a class="btn btn-success download width20" href="javascript:void(0);">下载</a></td></tr>';
                    for (var i = 0; i < data.data.length; i++) {
                        item = data.data[i];
                        result.push($util.strReplace(tpl, {
                            '{#filesize#}': item.size,
                            '{#filename#}': item.name
                        }));
                    }
                    $('#files').html(result.join(''));
                } else {
                    $('#alert').attr('class', 'alert alert-warning').text('获取文件列表失败！').show();
                }
            }
        });
    };
    var getEnv = function() {
        $http.get({
            url: 'getEnv',
            success: function(data) {
                if (data.code === 0) {
                    // $('#alert').hide();
                    var result = [],
                        tpl = '<option value="{#key#}" data-url="{#value#}" {#selected#}>{#name#}-{#key#}</option>';
                    map = data.data.envDesc;
                    for (var key in data.data.env) {
                        result.push($util.strReplace(tpl, {
                            '{#key#}': key,
                            '{#selected#}': key == 'sit' ? 'selected="selected"' : '',
                            '{#name#}': map[key] || '',
                            '{#value#}': data.data.env[key]
                        }));
                    }
                    $('#select').html(result.join(''));
                    getFiles();
                } else {
                    $('#alert').attr('class', 'alert alert-danger').text('获取环境配置信息失败！').show();
                }
            }
        });
    };
    var upload = function(formData) {
        $.ajax({
            url: 'upload',
            data: formData,
            type: 'POST',
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            success: function(data) {
                if (data.code === 0) {
                    getFiles();
                    $('#alert').attr('class', 'alert alert-success').text('上传成功！').show();
                } else {
                    $('#alert').attr('class', 'alert alert-danger').text('上传失败！').show();
                }
            }
        });
    };
    $(document).on('click', '#alert', function() {
        $(this).hide();
    }).on('change', '#select', function() {
        getFiles();
    }).on('change', '#resource', function() {
        file = this.files[0];
    }).on('click', '#upload', function() {
        if (!file) {
            $('#alert').attr('class', 'alert alert-info').text('请先选择文件！').show();
            return;
        }
        $('#alert').hide();
        var filename = file.name;
        var fileType = filename.substring(filename.lastIndexOf('.') + 1);
        if ($.inArray(fileType, $comm.CONSTS.FILETYPES) === -1) {
            $('#alert').attr('class', 'alert alert-warning').text('只支持' + $comm.CONSTS.FILETYPES.join(',') + '格式的文件！').show();
            return;
        }
        var formData = new FormData();
        var value = $('#select').val();
        formData.append('env', value);
        formData.append('', map[value]);
        formData.append('file', file);
        upload(formData);
    }).on('click', '.download', function() {
        //解决中文乱码
        var env = $('#select').val();
        var filename = encodeURIComponent($(this).closest('tr').find('.filename').attr('data-filename'));
        $('<a href="download/' + filename + '?env=' + env + '"></a>')[0].click(); //触发下载事件
    });
    $core.Ready(function() {
        getEnv();
    });
});