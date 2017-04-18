/***
GLobal Directives
***/
vrApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                    // auto scorll to page top
                    setTimeout(function() {
                        App.scrollTop(); // scroll to the top on content load
                    }, 800);
                });
                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });
                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
vrApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
vrApp.directive('dropdownMenuHover', function() {
    return {
        link: function(scope, elem) {
            elem.dropdownHover();
        }
    };
});

/**
 * name: tm.pagination
 * Version: 0.0.2
 */
vrApp.directive('tmPagination', [function() {
    return {
        restrict: 'EA',
        template: '<div class="page-list">' +
            '<ul class="pagination" ng-show="conf.totalItems > 0">' +
            '<li style="cursor: pointer;" ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
            '<li style="cursor: pointer;" ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
            'ng-click="changeCurrentPage(item)">' +
            '<span>{{ item }}</span>' +
            '</li>' +
            '<li style="cursor: pointer;" ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
            '</ul>' +
            '<div class="page-total" ng-show="conf.totalItems > 0">' +
            //'第<input type="text" ng-model="jumpPageNum"  ng-keyup="jumpToPage($event)"/>页 ' +
            '每页<select ng-model="conf.itemsPerPage" ng-options="option for option in conf.perPageOptions " ng-change="changeItemsPerPage()"></select>' +
            '/共<strong>{{ conf.totalItems }}</strong>条' +
            '</div>' +
            '<div class="no-items" ng-show="conf.totalItems <= 0"><div class="empty"><div class="img"></div>' +
            '<div class="empty-info font-grey-salt">暂无数据</div></div>' + '</div>' +
            '</div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs) {
            if (!scope.conf || scope.totalItems === 0) {
                return false;
            }
            // 变更当前页
            scope.changeCurrentPage = function(item) {
                if (item == '...') {
                    return;
                } else {
                    if (scope.conf.currentPage != item) {
                        scope.conf.currentPage = item;
                        if (scope.conf.onChange) { scope.conf.onChange(); }
                    }
                }
            };

            // 定义分页的长度必须为奇数 (default:9)
            scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9;
            if (scope.conf.pagesLength % 2 === 0) {
                // 如果不是奇数的时候处理一下
                scope.conf.pagesLength = scope.conf.pagesLength - 1;
            }

            // conf.erPageOptions
            if (!scope.conf.perPageOptions) {
                scope.conf.perPageOptions = [10, 15, 20, 30, 50];
            }

            // pageList数组
            function getPagination() {
                // conf.currentPage
                scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;
                // conf.totalItems
                scope.conf.totalItems = parseInt(scope.conf.totalItems);

                // conf.itemsPerPage (default:15)
                // 先判断一下本地存储中有没有这个值
                if (scope.conf.rememberPerPage) {
                    if (!parseInt(localStorage[scope.conf.rememberPerPage])) {
                        localStorage[scope.conf.rememberPerPage] = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                    }

                    scope.conf.itemsPerPage = parseInt(localStorage[scope.conf.rememberPerPage]);


                } else {
                    scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                }

                // numberOfPages
                scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.itemsPerPage);

                // judge currentPage > scope.numberOfPages
                if (scope.conf.currentPage < 1) {
                    scope.conf.currentPage = 1;
                }

                if (scope.conf.totalItems > 0) {
                    if (scope.conf.currentPage > scope.conf.numberOfPages) {
                        scope.conf.currentPage = scope.conf.numberOfPages;
                    }
                }

                // jumpPageNum
                scope.jumpPageNum = scope.conf.currentPage;

                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                var perPageOptionsLength = scope.conf.perPageOptions.length;
                // 定义状态
                var perPageOptionsStatus;
                for (var i = 0; i < perPageOptionsLength; i++) {
                    if (scope.conf.perPageOptions[i] == scope.conf.itemsPerPage) {
                        perPageOptionsStatus = true;
                    }
                }
                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                if (!perPageOptionsStatus) {
                    scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
                }

                // 对选项进行sort
                scope.conf.perPageOptions.sort(function(a, b) { return a - b; });

                scope.pageList = [];
                if (scope.conf.numberOfPages <= scope.conf.pagesLength) {
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for (i = 1; i <= scope.conf.numberOfPages; i++) {
                        scope.pageList.push(i);
                    }
                } else {
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (scope.conf.pagesLength - 1) / 2;
                    if (scope.conf.currentPage <= offset) {
                        // 左边没有...
                        for (i = 1; i <= offset + 1; i++) {
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    } else if (scope.conf.currentPage > scope.conf.numberOfPages - offset) {
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for (i = offset + 1; i >= 1; i--) {
                            scope.pageList.push(scope.conf.numberOfPages - i);
                        }
                        scope.pageList.push(scope.conf.numberOfPages);
                    } else {
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for (i = Math.ceil(offset / 2); i >= 1; i--) {
                            scope.pageList.push(scope.conf.currentPage - i);
                        }
                        scope.pageList.push(scope.conf.currentPage);
                        for (i = 1; i <= offset / 2; i++) {
                            scope.pageList.push(scope.conf.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }
                }


                scope.$parent.conf = scope.conf;

                if (scope.conf.onInit && !scope.conf.isInit) {
                    scope.conf.isInit = true;
                    scope.conf.onInit();
                }
            }

            // prevPage
            scope.prevPage = function() {
                if (scope.conf.currentPage > 1) {
                    scope.conf.currentPage -= 1;
                    if (scope.conf.onChange) { scope.conf.onChange(); }
                }
            };
            // nextPage
            scope.nextPage = function() {
                if (scope.conf.currentPage < scope.conf.numberOfPages) {
                    scope.conf.currentPage += 1;
                    if (scope.conf.onChange) { scope.conf.onChange(); }
                }
            };

            // 跳转页
            scope.jumpToPage = function() {
                scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g, '');
                if (scope.jumpPageNum !== '') {
                    scope.conf.currentPage = scope.jumpPageNum;
                }
            };

            // 修改每页显示的条数
            scope.changeItemsPerPage = function() {
                // 清除本地存储的值方便重新设置
                if (scope.conf.rememberPerPage) {
                    localStorage.removeItem(scope.conf.rememberPerPage);
                }
                scope.conf.currentPage = 1;
                if (scope.conf.onChange) { scope.conf.onChange(); }
            };

            scope.$watch(function() {
                var newValue = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';
                // 如果直接watch perPage变化的时候，因为记住功能的原因，所以一开始可能调用两次。
                //所以用了如下方式处理
                if (scope.conf.rememberPerPage) {
                    // 由于记住的时候需要特别处理一下，不然可能造成反复请求
                    // 之所以不监控localStorage[scope.conf.rememberPerPage]是因为在删除的时候会undefind
                    // 然后又一次请求
                    if (localStorage[scope.conf.rememberPerPage]) {
                        newValue += localStorage[scope.conf.rememberPerPage];
                    } else {
                        newValue += scope.conf.itemsPerPage;
                    }
                } else {
                    newValue += scope.conf.itemsPerPage;
                }
                return newValue;

            }, getPagination);

        }
    };
}]);

/**
 * 指令:时间指令
 * 创建时间:2016-12-20
 * *****变更记录*******
 */
vrApp.directive('timeBar', [function() {
    return {
        restrict: 'EA',
        template: '<div class="row"><div class="col-lg-12"><div class="time-bar">{{conf.vm.title}}<div class="btn-group btn-group-devided">' +
            '<label class="btn btn-transparent green btn-outline btn-circle btn-sm" ' +
            ' data-ng-click="timeItemClick(item.key)"' +
            ' data-ng-class="{true:\'active\',false:\'\'}[conf.vm.curTimeType==item.key]"' +
            ' data-ng-repeat="item in timeList track by $index">' +
            '{{item.name}}' +
            '</label>' +
            '<div class="modal fade" id="timeOptionDatePickerModal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">' +
            '<div class="modal-dialog modal-md">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
            '<h4 class="modal-title">其它时间</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<form class="form-horizontal" role="form">' +
            '<div class="form-group">' +
            '<label class="control-label col-md-3">选择时间</label>' +
            '<div class="col-md-9">' +
            '<div id="timeOptionDatePicker" class="input-group input-large date-picker input-daterange " data-date-format="yyyy-mm-dd">' +
            '<input id="timeOptionSt" type="text" class="form-control bg-grey-cararra" readonly  name="from" placeholder="开始时间">' +
            '<span class="input-group-addon"> 至 </span>' +
            '<input id="timeOptionEt"  type="text" class="form-control  bg-grey-cararra" readonly name="to"   placeholder="结束时间"></div>' +
            '</div>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" data-ng-click="otherTimeSumitClick()" class="btn green">&nbsp;&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;&nbsp;</button>' +
            '<button type="button" class="btn default" data-dismiss="modal">&nbsp;&nbsp;&nbsp;&nbsp;关闭&nbsp;&nbsp;&nbsp;&nbsp;</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div></div></div></div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs) {
            if (!scope.conf) { return false; } //没有conf 则返回

            scope.conf.vm.title = scope.conf.vm.title || ' 统计时间: ';
            scope.timeList = []; //默认空
            var _otherIndex = -1;

            scope.timeItemClick = function(key) {
                if (scope.conf.vm.curTimeType == key && key != 'other') {
                    return false;
                }
                opt.setTimeByType(key);
                if (key != 'other') {
                    if (_otherIndex >= 0) {
                        scope.timeList[_otherIndex].name = '其它时间';
                    }
                    if (scope.conf.onChange) {
                        scope.conf.onChange();
                    }
                    scope.conf.vm.curTimeType = key;
                }
            };
            scope.otherTimeSumitClick = function() {
                if (!scope.conf.vm.st && !scope.conf.vm.et) {
                    message.error('时间不可为空.');
                    return false;
                }
                if (scope.conf.onChange) {
                    var curTimeOpt = scope.timeList[_otherIndex];
                    if (curTimeOpt) {
                        curTimeOpt.name = scope.conf.vm.st.substr(0, 10) + ' - ' + scope.conf.vm.et.substr(0, 10);
                    }
                    scope.conf.onChange();
                }
                scope.conf.vm.curTimeType = 'other';
                $("#timeOptionDatePickerModal").modal("hide");
            };

            var opt = {
                setTimeByType: function(key) {
                    switch (key) {
                        case 'today':
                            {
                                scope.conf.vm.st = moment().format('YYYY-MM-DD');
                                scope.conf.vm.et = scope.conf.vm.st;
                            }
                            break; //今日
                        case 'yestoday':
                            {
                                scope.conf.vm.st = moment().subtract(1, 'days').format('YYYY-MM-DD');
                                scope.conf.vm.et = scope.conf.vm.st;
                            }
                            break; //昨日
                        case 'curmonth':
                            {
                                scope.conf.vm.st = moment().startOf('month').format('YYYY-MM-DD');
                                scope.conf.vm.et = moment().format('YYYY-MM-DD');
                            }
                            break; //本月
                        case 'prevmonth':
                            {
                                var _lastMonth = moment().subtract(1, 'month');
                                scope.conf.vm.st = moment(_lastMonth).startOf('month').format('YYYY-MM-DD');
                                scope.conf.vm.et = moment(_lastMonth).endOf('month').format('YYYY-MM-DD');
                            }
                            break; //上月
                        case 'other':
                            {
                                if (scope.conf.vm.curTimeType !== 'other') {
                                    $("#timeOptionSt").val("");
                                    $("#timeOptionEt").val("");
                                    $('#timeOptionSt').datepicker("clearDates");
                                    $('#timeOptionEt').datepicker("clearDates");
                                    scope.conf.vm.st = '';
                                    scope.conf.vm.et = '';
                                } else {
                                    if (scope.conf.vm.st && scope.conf.vm.et) {
                                        $("#timeOptionSt").val(scope.conf.vm.st.substr(0, 10));
                                        $("#timeOptionEt").val(scope.conf.vm.et.substr(0, 10));
                                    } else {
                                        $("#timeOptionSt").val("");
                                        $("#timeOptionEt").val("");
                                        $('#timeOptionSt').datepicker("clearDates");
                                        $('#timeOptionEt').datepicker("clearDates");
                                        scope.conf.vm.st = '';
                                        scope.conf.vm.et = '';
                                    }
                                }
                                $("#timeOptionDatePickerModal").modal("show");
                            }
                            break; //其他
                    }
                },
                getTimeList: function() {
                    scope.timeList = []; //默认空
                    var _arr = []; //临时的数组信息
                    scope.conf.vm.timeArr.forEach(function(key) {
                        switch (key) {
                            case 'today':
                                { _arr.push({ name: '今日', key: key }); }
                                break; //今日
                            case 'yestoday':
                                { _arr.push({ name: '昨日', key: key }); }
                                break; //昨日
                            case 'curmonth':
                                { _arr.push({ name: '本月', key: key }); }
                                break; //本月
                            case 'prevmonth':
                                { _arr.push({ name: '上月', key: key }); }
                                break; //上月
                            case 'other':
                                { _arr.push({ name: '其它时间', key: key }); }
                                break; //其它时间
                        }
                    });
                    scope.timeList = _arr;
                },
                initDateTime: function() {
                    $('#timeOptionDatePicker').datepicker({
                        rtl: App.isRTL(),
                        orientation: "left",
                        autoclose: true,
                        language: 'zh',
                        endDate: moment().format('YYYY-MM-DD'),
                        onSelect: function(dt) {
                            console.log(ev);
                        }
                    }).on("hide", function() {
                        var _this = this;
                        scope.conf.vm.st = _this.getElementsByTagName('input')[0].value;
                        scope.conf.vm.et = _this.getElementsByTagName('input')[1].value;
                    });
                    $('#timeOptionDatePickerModal').on('hidden.bs.modal', function() {
                        if (!scope.conf.vm.st && !scope.conf.vm.et && scope.conf.vm.curTimeType != 'other') {
                            opt.setTimeByType(scope.conf.vm.curTimeType);
                        }
                    });
                },
                uiSet: function() {
                    /**
                     * 处理 url 传递参数 进行初始化设定的处理
                     */
                    if (scope.conf.vm.curTimeType === 'other') {
                        if (scope.conf.vm.st && scope.conf.vm.st) {
                            var _st = scope.conf.vm.st.substr(0, 10);
                            var _et = scope.conf.vm.et.substr(0, 10);
                            $("#timeOptionSt").val(_st);
                            $("#timeOptionEt").val(_et);
                            var curTimeOpt = scope.timeList[_otherIndex];
                            if (curTimeOpt) {
                                curTimeOpt.name = _st + ' - ' + _et;
                            }
                        } else {
                            opt.setTimeByType(scope.conf.vm.curTimeType);
                        }
                    } else {
                        opt.setTimeByType(scope.conf.vm.curTimeType);
                    }
                },
                init: function() {
                    /**
                     *验证是否有自定义设置显示的时间选择
                     */
                    scope.conf.vm.timeArr = scope.conf.vm.timeArr || [];
                    if (scope.conf.vm.timeArr.length === 0) { //没有设定默认设定
                        scope.conf.vm.timeArr = ['today', 'yestoday', 'curmonth', 'prevmonth', 'other'];
                    }
                    /**
                     * 获取时间集合
                     */
                    opt.getTimeList();
                    /**
                     * 设定other时间类型的index
                     */
                    _otherIndex = scope.conf.vm.timeArr.indexOf('other');
                    opt.uiSet();
                    opt.initDateTime();
                }
            };

            opt.init();
        }
    };
}]);

vrApp.directive('comUploadFileChange', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.comUploadFileChange);
            element.bind('change', onChangeFunc);
        }
    };
});