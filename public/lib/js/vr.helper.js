var vrHelper = (function() {
    //全局静态变量
    var constants = {
        maxValue: 2147483647,
        weeksZhArr: ['一', '二', '三', '四', '五', '六', '日'],
        staticPer: '/public/page/js',
        qnDomain: 'http://oomrprje8.bkt.clouddn.com/'
    };

    /**
     * 界面等待
     */
    var block = {
        blockUI: function(id) {
            id && App.blockUI({ target: $(id)[0], animate: true, overlayColor: 'none', isLoading: true });
        },
        unblockUI: function(id) {
            id && App.unblockUI($(id)[0]);
        }
    };
    /**
     *公共方法
     */
    var methods = {
        debug: function(key, obj) {
            isDebug = true;
            if (isDebug) {
                if (obj) {
                    console.group(key + "  -  日志");
                    console.log(obj);
                    console.groupEnd();
                } else {
                    console.info(key + "  -  日志");
                }
            }
        },
        /**
         * [jqAjax]
         * @param  {[type]} url     [请求地址]
         * @param  {[type]} data    [传递参数]
         * @param  {[type]} success [成功的回调]
         * @param  {[type]} error   [错误的回调用]
         * @param  {[type]} type    [POST OR GET]
         * @param  {[type]} flage   [true:原样传递参数,false: json-->string,other-->原样传递]
         * @param  {[type]} loadId  [页面等待时的element的ID]
         * @return {[type]}         
         */
        jqAjax: function(url, data, success, error, type, flage, loadId) {
            if (!url) {
                message.error("ajax请求未发现请求地址.");
                if (error) {
                    error();
                }
            } else {
                var obj = {
                    type: (type || 'POST'),
                    url: url,
                    dataType: 'json',
                    async: true,
                    timeout: 0,
                    beforeSend: function() {
                        if (loadId) {
                            loadId = loadId.indexOf('#') >= 0 ? loadId : '#' + loadId;
                            block.blockUI(loadId);
                        }
                        methods.debug("ajax[" + url + "] request param:", {
                            request: { url: url, data: data, type: (type || 'POST'), flage: (flage || false), loadId: loadId, }
                        });
                    },
                    complete: function() {
                        if (loadId) {
                            loadId = loadId.indexOf('#') >= 0 ? loadId : '#' + loadId;
                            block.unblockUI(loadId);
                        }
                    },
                    success: function(json) {
                        if (json.result) {
                            if (success) {
                                methods.debug("ajax[" + url + "] response result:", {
                                    request: { url: url, data: data, type: (type || 'POST'), flage: (flage || false), loadId: loadId, },
                                    response: { res: json }
                                });
                                success(json);
                            }
                        } else {
                            message.error(json.msg);
                            error && error(json);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if (error) {
                            error(jqXHR);
                        }
                        try {
                            if (jqXHR.responseText && jqXHR.responseText.indexOf('请登录系统') >= 0) {
                                window.location.href = '/v_login';
                            }
                        } catch (ex) {
                            message.error("后端错误.");
                        }
                    }
                };
                if (flage) {
                    if (data) {
                        obj.data = data;
                    }
                } else {
                    if ((typeof data) == 'object') {
                        obj.contentType = "application/json;charset=utf-8";
                        if (data) {
                            obj.data = JSON.stringify(data);
                        }
                    } else if ((typeof data) == 'string') {
                        if (data) {
                            obj.data = data;
                        }
                    }
                }
                $.ajax(obj);
            }
        },
        getDateTimeByType: function(key) {
            var t = {
                st: null,
                et: null
            };
            switch (key) {
                case 'today':
                    {
                        t.st = moment().format('YYYY-MM-DD');
                        t.et = t.st;
                    }
                    break; //今日
                case 'yestoday':
                    {
                        t.st = moment().subtract(1, 'days').format('YYYY-MM-DD');
                        t.et = t.st;
                    }
                    break; //昨日
                case 'curmonth':
                    {
                        t.st = moment().startOf('month').format('YYYY-MM-DD');
                        t.et = moment().format('YYYY-MM-DD');
                    }
                    break; //本月
                case 'prevmonth':
                    {
                        var _lastMonth = moment().subtract(1, 'month');
                        t.st = moment(_lastMonth).startOf('month').format('YYYY-MM-DD');
                        t.et = moment(_lastMonth).endOf('month').format('YYYY-MM-DD');
                    }
                    break; //上月
            };
            return t;
        }
    };
    /**
     * cookie 的操作
     */
    var cookie = {
        /**
         * cookie 的设定
         * @param  {String} c_name  cookie的名称
         * @param  {String} value   cookie的值
         * @param  {String} expiredays 过期天数
         */
        set: function(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
        }, //set end
        /**
         *
         * @param {string} c_name cookie的名称
         * @returns {string}
         */
        get: function(c_name) {
                if (document.cookie.length > 0) {
                    c_start = document.cookie.indexOf(c_name + "=");
                    if (c_start != -1) {
                        c_start = c_start + c_name.length + 1;
                        c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) c_end = document.cookie.length;
                        return decodeURIComponent(document.cookie.substring(c_start, c_end));
                    }
                }
                return "";
            } //get end
    };

    var regex = {
        mobile: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
        pwd: /^[a-zA-Z0-9]{8,20}$/,
        number: /^[0-9]*$/,
    };

    var validate = {
        mobile: function(v) { return regex.mobile.test(v); },
        pwd: function(v) { return regex.pwd.test(v); },
        number: function(v) { return regex.number.test(v); },
    };


    return {
        maxValue: constants.maxValue,
        weeksZhArr: constants.weeksZhArr,
        qnDomain: constants.qnDomain,

        debug: methods.debug,
        jqAjax: methods.jqAjax,
        getDateTimeByType: methods.getDateTimeByType,

        block: block,

        cookie: {
            get: cookie.get,
            set: cookie.set
        },

        staticPer: constants.staticPer,

        validate: {
            mobile: validate.mobile,
            pwd: validate.pwd,
            number: validate.number,
        }

    };


    $.fn.datetimepicker.dates['zh'] = {
        days: ['日', '一', '二', '三', '四', '五', '六', '日'],
        daysShort: ['日', '一', '二', '三', '四', '五', '六', '日'],
        daysMin: ['日', '一', '二', '三', '四', '五', '六', '日'],
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        today: "今天",
        meridiem: []
    };

})();