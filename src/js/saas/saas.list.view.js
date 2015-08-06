(function(window, $) {
    IX.ns('Hualala.Saas');
    var toptip = Hualala.UI.TopTip,
        U = Hualala.UI,
        goodsInfo = {categories: [], departments: [], goods: []};
    var ListView = Stapes.subclass({
        constructor: function (cfg) {
            this.container = $XP(cfg, 'container', null);
            this.bindEvent();
        }
    });

    var swichtOkCbFnMap = {
            isActive: function(params) {console.log('isActive', params)},
            isOpen: function(params) {console.log('isOpen', params)},
            isDiscount: function(params) {console.log('isDiscount', params)}
        },
        goodsTableAttr = {
            tableClass: 'saas-goods-table',
            tableHeads: ["商品图片", "星级", "商品分类", "商品编码", "商品名称", "英文名", "是否外送", "自动加入", "启用状态", "网上开放", "参与打折", "操作"],
            displayAttr: ["imageHWP", "starLevel", "foodCategoryName", "foodCode", "foodName", "foodEnName", "takeawayTag", "isAutoAdd", "isActive", "isOpen", "isDiscount", "rowControl"]
        };

    var initEventSwitch = function($checkbox) {
        var self = this;
        _.each($checkbox, function (el) {
            $(el).bootstrapSwitch({
                state: !!$(el).data('status'),
                onColor: 'success',
                onText: '已启用',
                offText: '未启用'
            });
        });
        $checkbox.on('switchChange.bootstrapSwitch', function (el, state) {
            var $this = $(this),
                stateText = state ? '开启' : '关闭',
                params = {foodID: $this.parents('tr').data('foodid'), groupID: $XP(Hualala.getSessionSite(), 'groupID', '')};
            params[$this.attr('name')] = +state;
            Hualala.UI.Confirm({
                title: stateText + $this.data('text') ,
                msg: '确定' + stateText + $this.data('text') + '吗？',
                okFn: function () {
                    self.emit('switchEvent', _.extend(params, {
                        successFn: function (res) {
                            toptip({msg: stateText + $this.data('text') + '成功', type: 'success'});
                        },
                        faildFn: function () {
                            $this.bootstrapSwitch('toggleState', true);
                            toptip({msg: stateText + $this.data('text') + '失败', type: 'danger'});
                        }
                    }));
                    swichtOkCbFnMap[$this.attr('name')](params);
                },
                cancelFn: function () {
                    $this.bootstrapSwitch('toggleState', true);
                }
            });
        });
    };

    var initFoodStarGrade = function (starCount) {
        Handlebars.registerHelper('stars', function (starLevel, options) {
            var lightStarCount = parseInt(starLevel/10),
                hasHalfStar = starLevel%10 != 0,
                stars = [];
            for (var i = 0; i < starCount; i++) {
                if (i < lightStarCount) {
                    stars[i] = '<i class="glyphicon glyphicon-star"></i>';
                } else {
                    stars[i] = '<i class="glyphicon glyphicon-star star-gray"></i>'
                }
            }
            if (hasHalfStar) {
                stars[lightStarCount] = '<i class="glyphicon glyphicon-star half"></i>';
            }
            return stars.join('')
        });
    };

    function bindViewEvent($container){
        $container.parents('.container').on('click', '.query-form button[name="add-good"]', function () {
            var modalTitle = '添加商品',
                modalTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_good')),
                modalTplData = {
                    categories: {options: _.map($.extend(true, {}, goodsInfo.categories), function (category) {
                    return {name: category.foodCategoryName, value: category.foodCategoryKey};
                    })},
                    departments: {options: _.map($.extend(true, {}, goodsInfo.departments), function (d) {
                        return {name: d.departmentName, value: d.departmentKey};
                    })}
                };
            Handlebars.registerPartial('customSelect', Hualala.TplLib.get('tpl_select'));
            var goodModal = new U.ModalDialog({id: 'editGood', title: modalTitle, html: modalTpl(modalTplData)}).show();
        });
    }

    ListView.proto({
        init: function () {
        },
        bindEvent: function () {
            this.on('renderCategories', function (categories) {
                var self = this,
                    categories = $.extend(true, {data: []}, {data: categories}).data,
                    searchForm = Handlebars.compile(Hualala.TplLib.get('tpl_search_goods')),
                    searchParam = {firstItem: {name: 'foodName', value: '商品编码/名称/英文名'},
                        secondItem: {name: 'foodCategoryKey', value: '商品分类'},
                        operatorItem: {name: 'add-good', value: '增加商品'},
                        select: {options: _.map(categories, function (category) {
                            return {name: category.foodCategoryName, value: category.foodCategoryKey};
                        }), defaultOption: {name: '全部', selected: 'selected'}, name: 'foodCategoryKey'}
                    };
                goodsInfo.categories = $.extend(true, {data: []}, {data: categories}).data;
                Handlebars.registerPartial('customSelect', Hualala.TplLib.get('tpl_select'));
                self.container.before(searchForm(searchParam));
            }, this);
            this.on('renderGoods', function (goods) {
                var self = this,
                    table = Handlebars.compile(Hualala.TplLib.get('tpl_category')),
                    tbody = Handlebars.compile(Hualala.TplLib.get('tpl_goods_tbody')),
                    noResult = Handlebars.compile(Hualala.TplLib.get('tpl_no_records'));
                goodsInfo.goods = $.extend(true, {data: []}, {data: goods}).data;
                initFoodStarGrade(5);
                if(goods.length > 0) {
                    $(table(goodsTableAttr)).appendTo(self.container);
                    self.container.find('tbody').append($(tbody({goods:goods})));
                    initEventSwitch.call(self, $('tbody').find('tr td input.status'));
                } else {
                    self.container.append(noResult({title: '商品'}))
                }
            });
            this.on('renderDepartments', function (departments) {
                goodsInfo.departments = $.extend(true, {data: []}, {data: departments}).data;
            }, this);

            bindViewEvent($(this.container));
        }
    });
    Hualala.Saas.initEventSwitch = initEventSwitch;
    Hualala.Saas.ListView = ListView;
})(window, jQuery);