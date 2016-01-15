require(['ZSYWEB.Services', 'ZSYWEB.Comm', 'ZSYWEB.Util'], function() {
    var $core = ZSYWEB.Core,
        $http = ZSYWEB.Services,
        $comm = ZSYWEB.Comm,
        $util = ZSYWEB.Util;
    var getFiles = function() {
        $http.get({
            url: 'getModules',
            data: {
                env: $('#select').val()
            },
            success: function(data) {
                if (data.code === 0) {
                    var item, result = [],
                        tpl = ['<tr>', '<td title="{#id#}">{#id#}</td>', '<td title="{#ver#}">{#ver#}</td>', '<td title="{#name#}">{#name#}</td>', '<td title="{#type#}">{#type#}</td>', '<td title="{#url#}">{#url#}</td>', '<td title="{#downIOSTitle#}">{#downIOS#}</td>', '<td title="{#downAndroidTitle#}">{#downAndroid#}</td>', '<td title="{#signIOS#}">{#signIOS#}</td>', '<td title="{#signAndroid#}">{#signAndroid#}</td>', '<td data-id="{#id#}" data-downandroid="{#downAndroidTitle#}" data-downios="{#downIOSTitle#}">', '<a class="btn btn-success download ios" href="javascript:void(0);">下载iOS</a>', '<a class="btn btn-primary download android" href="javascript:void(0);">下载Android</a>', '<br/>', '<a class="btn btn-warning upload" href="javascript:void(0);">', '<input type="file" name="resource" class="file ios"/>', '<span>上传iOS</span>', '</a>', '<a class="btn btn-info upload" href="javascript:void(0);">', '<input type="file" name="resource" class="file android"/>', '<span>上传Android</span>', '</a>', '</td>', '</tr>'];
                    for (var i = 0; i < data.data.length; i++) {
                        item = data.data[i];
                        result.push($util.strReplace(tpl.join(''), {
                            '{#id#}': item.id || '',
                            '{#ver#}': item.ver || '',
                            '{#name#}': item.name || '',
                            '{#type#}': item.type || '',
                            '{#url#}': item.url || '',
                            '{#downIOS#}': (function(downIOS) {
                                if (downIOS) {
                                    return downIOS;
                                    // return '<a href="' + downIOS + '">' + downIOS + '</a>';
                                }
                                return '';
                            })(item.downIOS),
                            '{#downIOSTitle#}': item.downIOS || '',
                            '{#downAndroid#}': (function(downAndroid) {
                                if (downAndroid) {
                                    return downAndroid;
                                    // return '<a href="' + downAndroid + '">' + downAndroid + '</a>';
                                }
                                return '';
                            })(item.downAndroid),
                            '{#downAndroidTitle#}': item.downAndroid || '',
                            '{#signIOS#}': item.signIOS || '',
                            '{#signAndroid#}': item.signAndroid || ''
                        }));
                    }
                    $('#tbody').html(result.join(''));
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
                    var env = $('#env').val();
                    if (data.data.env[env]) {
                        $('#select').val(env); //保留上次下载时候的环境
                    }
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
    }).on('change', '.file.ios,.file.android', function() {
        $('#alert').hide();
        var platform = '',
            $this = $(this);
        if ($this.hasClass('android')) {
            platform = 'android';
        } else if ($this.hasClass('ios')) {
            platform = 'ios';
        }
        var file = this.files[0];
        var filename = file.name;
        var fileType = filename.substring(filename.lastIndexOf('.') + 1);
        if ($.inArray(fileType, $comm.CONSTS.FILETYPES) === -1) {
            $('#alert').attr('class', 'alert alert-warning').text('只支持' + $comm.CONSTS.FILETYPES.join(',') + '格式的文件！').show();
            return;
        }
        var formData = new FormData();
        var id = $this.closest('td').attr('data-id');
        var env = $('#select').val();
        formData.append('env', env);
        formData.append('id', id);
        formData.append('platform', platform);
        formData.append('file', file);
        upload(formData);
    }).on('click', '.download.ios,.download.android', function() {
        var filename, env = $('#select').val();
        var $this = $(this);
        var $closest = $this.closest('td');
        if ($this.hasClass('android')) {
            filename = $closest.attr('data-downandroid');
        } else if ($this.hasClass('ios')) {
            filename = $closest.attr('data-downios');
        }
        //文件为空就不下载
        if (!filename) {
            $('#alert').attr('class', 'alert alert-danger').text('文件不存在！').show();
            return;
        }
        //解决中文乱码
        $('<a href="' + window.location.origin + '/download/' + encodeURIComponent(filename) + '?env=' + env + '"></a>')[0].click(); //触发下载事件
    });
    $core.Ready(function() {
        getEnv();
    });
});