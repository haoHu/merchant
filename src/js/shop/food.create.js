(function ($, window) {
    IX.ns('Hualala.Shop');
// 初始化店铺菜品页面
    Hualala.Shop.initCreateFood = function (params)
    {
        if(!params) return;

        var G = Hualala.Global,
            U = Hualala.UI,
            C = Hualala.Common,
            topTip = U.TopTip;

        var shopID = params,
            groupID = $XP(Hualala.getSessionSite(), 'groupID', '');
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
            imgRoot = G.IMAGE_ROOT + '/';

        var categories = null, //菜品分类
            departments = null, //部门
            subjects = null, //科目
            foodParams = {},//添加菜品后用于向服务器发送的数据
            delUnitItemIDs = [],
            searchFoods = []; //修改菜品时删除的规格的itemID

        //为添加菜品的form表单做验证
        var registerValidateFoodInfo = function (modalDialog, foodID) {
            var $foodBasic = modalDialog._.body.find('form.form-food'),
                $foodDetail = modalDialog._.body.find('form.form-food-detail'),
                $foodTaste = modalDialog._.body.find('form.form-taste');
            $foodBasic.bootstrapValidator({
                excluded: ':disabled',
                fields: {
                    foodCategoryID: {
                        validators: {
                            notEmpty: {message: '分类不能为空'}
                        }
                    },
                    foodCode: {
                        validators: {
                            stringLength: {
                                message: '商品编号不能超过50个字符',
                                min: 0,
                                max: 50
                            }
                        }
                    },
                    foodName: {
                        validators: {
                            notEmpty: {message: '商品名称不能为空'},
                            stringLength: {
                                message: '商品名称不能超过150个字符',
                                max: 150
                            }
                            //ajaxValid: {
                            //    api: 'checkFoodNameExist',
                            //    data: {shopID: shopID, groupID: groupID, foodID: foodID}
                            //}
                        }
                    }
                }
            });
            $foodDetail.bootstrapValidator({
                excluded: ':disabled',
                fields: {
                    minOrderCount: {
                        validators: {
                            notEmpty: {message: '起售份数不能为空'},
                            integer: {message: '起售份数必须是整数'},
                            between: {min: 1, max: 99, message: '起售份数必须在1到99之间'}
                        }
                    },
                    takeoutPackagingFee: {
                        validators: {
                            regexp: {
                                regexp: /^\d*\.?\d{0,2}$/,
                                message: '必须是最多保留两位小数的值'
                            }
                        }
                    }
                }
            });
            $foodTaste.bootstrapValidator({
                excluded: ':disabled',
                fields: {
                    makingMethodList: {
                        validators: {
                            stringLength: {
                                trim: true,
                                max: 500,
                                message: '作法最多500个字符'
                            }
                        }
                    },
                    tasteList: {
                        validators: {
                            stringLength: {
                                trim: true,
                                max: 300,
                                message: '口味最多300个字符'
                            }
                        }
                    }
                }
            });
        };
        Hualala.Shop.RegisterValidateFoodInfo = registerValidateFoodInfo;

        //对菜品添加modal的不同操作需要渲染不同的footer
        var compileModalFooter = function (isModalFooter) {
            var modalFooter = Handlebars.compile(Hualala.TplLib.get('tpl_modal_footer'));
            return modalFooter({isModalFooter: isModalFooter});
        };
        Hualala.Shop.CompileModalFooter = compileModalFooter;


        var renderSelect = function (createFoodModal, food) {
            var customSelect = Handlebars.compile(Hualala.TplLib.get('tpl_select')),
                loadParams = {shopID: shopID},
                selectCategory = [];
            //加载菜品分类
            C.loadData('queryCategories', loadParams, categories).done(function (records) {
                if (!records || records.length == 0) {
                    topTip({msg: '请先添加菜品分类！', type: 'danger'});
                    return;
                }
                categories = records;
                selectCategory = {
                    options: _.map(IX.clone(categories), function (category) {
                        return {
                            name: category.foodCategoryName,
                            value: category.foodCategoryID,
                            selected: (food && (food.foodCategoryID == category.foodCategoryID)) ? 'selected' : ''
                        };
                    }),
                    name: 'foodCategoryID'
                };
                var $select = createFoodModal._.body.find('form.form-food').find('div[name="categoriesSelect"]');
                $select.append($(customSelect(selectCategory)));
                if(food && food.isSetFood == 1) {
                    //初始化套餐的搜索商品按钮
                    var $searchBtn = createFoodModal._.body.find('#setFoodDetail').find('.search-btn'),
                        searchBtnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_input_group'));
                    $searchBtn.append($(searchBtnTpl(selectCategory)));
                }
            });

            //添加菜品暂时先不设置部门
            C.loadData('getSaasDepartments', IX.inherit({departmentType: '1,3'}, loadParams), departments).done(function (records) {
                if(!records || records.length == 0) records = [];
                departments = records;
                var selectData = {
                    defaultOption: {name: '商品分类的部门', value: ''},
                    options: _.map(IX.clone(records), function (d) {
                        return {
                            name: d.departmentName, value: d.departmentKey,
                            selected: (food && food.departmentKey == d.departmentKey) ? 'selected' : ''
                        };
                    }), name: 'departmentKey'
                };
                var $select = createFoodModal._.body.find('form.form-food').find('div[name="departmentsSelect"]');
                $select.append($(customSelect(selectData)));
            });
            //加载科目
            C.loadData('querySaasSubject', {sellSubject:1}, subjects).done(function (records) {
                if(!records || records.length == 0) records = [];
                subjects = records;
                var selectData = {
                    defaultOption: {name: '商品分类的科目', value: ''},
                    options: _.map(IX.clone(records), function (d) {
                        return {
                            name: d.subjectName, value: d.subjectKey,
                            selected: (food && food.foodSubjectKey == d.subjectKey) ? 'selected' : ''
                        };
                    }), name: 'foodSubjectKey'
                };
                var $select = createFoodModal._.body.find('form.form-food').find('div[name="subjectsSelect"]');
                $select.append($(customSelect(selectData)));
            });
        };
        Hualala.Shop.RenderSelect = renderSelect;

        //添加菜品相关属性的开关
        var createFoodAttrSwitch = function(modal) {
            var $switchCheckbox = modal._.body.find('.form-food input.status');
            _.each($switchCheckbox, function (input) {
                $(input).bootstrapSwitch({
                    state: !!$(input).data('status'),
                    onColor : 'success',
                    onText : '已启用',
                    offText : '未启用'
                });
            });
            $switchCheckbox.on('switchChange.bootstrapSwitch', function (el, state) {
                foodParams[$(el.target).attr('name')] = state ? 1 : 0;
            });
        };
        Hualala.Shop.CreateFoodAttrSwitch = createFoodAttrSwitch;

        var registerEditFoodPartial = function () {
            Handlebars.registerPartial('customSelect', Hualala.TplLib.get('tpl_select'));
            Handlebars.registerPartial('goodUnit', Hualala.TplLib.get('tpl_good_unit'));
            Handlebars.registerPartial('goodUnitTr', Hualala.TplLib.get('tpl_good_unit_tr'));
            Handlebars.registerPartial('addUnitBtn', Hualala.TplLib.get('tpl_good_unit_add_btn'));
            Handlebars.registerPartial('delUnitBtn', Hualala.TplLib.get('tpl_good_unit_del_btn'));
        };

        Hualala.Shop.RegisterEditFoodPartial = registerEditFoodPartial;

        //绑定规格操作
        function bindUnitOperate(modalDialog) {
            modalDialog._.body.off('click', '.good-unit td a.glyphicon')
                .on('click', '.good-unit td a.glyphicon-plus-sign', function () {
                    addGoodUnit(modalDialog._.body.find('.good-unit'));
                }).on('click', '.good-unit td a.glyphicon-minus-sign', function () {
                    delGoodUnit(modalDialog._.body.find('.good-unit'));
                });
        }

        var renderInputGroup = function (modalDialog) {
            var selectCategory = [];
            C.loadData('queryCategories', {shopID: shopID}, categories).done(function (records) {
                categories = records;
                selectCategory = {
                    options: _.map(IX.clone(categories), function (category) {
                        return {
                            name: category.foodCategoryName,
                            value: category.foodCategoryID
                        };
                    })
                };
                var $searchBtn = modalDialog._.body.find('#setFoodDetail').find('.search-btn'),
                    searchBtnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_input_group'));
                $searchBtn.append($(searchBtnTpl(selectCategory)));
            });
        };
        Hualala.Shop.RenderInputGroup = renderInputGroup;

        //编译模态框的body
        function createModalCompile() {
            var createFoodData = {
                    detailDisplay: 'hidden',
                    setFoodDisplay: 'hidden',
                    goodUnits: {tableHeads: ['', '规格名称*', '售价(￥)*', '会员价(￥)', '原价(￥)', ''], lessThanFourUnits: true},
                    takeawayTypes: {options: Hualala.TypeDef.FoodAttrSelect.TakeawayType, name: 'takeawayTag'},
                    hotTags: {options: Hualala.TypeDef.FoodAttrSelect.HotTag, name: 'hotTag'},
                    foodSettings: Hualala.TypeDef.FoodSettings,
                    foodAttrSNewR: Hualala.TypeDef.FoodAttrSNewR,
                    food: {units: [{unit: '', price: '', vipPrice: '', prePrice: '', index: '1*', lessThanFourUnits: true}], isActive: '1', isOpen: '1', isDiscount: '1'},
                },
                createFoodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_good'));
            return createFoodTpl(createFoodData);
        }
        //创建菜品
        var createFood = function () {
            registerEditFoodPartial();
            var modalBody = createModalCompile(),
                createFoodModal = new U.ModalDialog({
                    id: 'createFood',
                    title: '添加菜品',
                    hideCloseBtn: false,
                    backdrop: 'static',
                    html: modalBody,
                    afterHide: function () {
                        U.clearEditors();
                    }
                }).show();
            initFoodParams();
            renderSelect(createFoodModal);
            displayUnits(createFoodModal._.body.find('.good-unit'));
            createFoodAttrSwitch(createFoodModal);
            registerValidateFoodInfo(createFoodModal);
            var foodDescEditor = U.createEditor('goodDescEditor');
            bindOperatorEvent(createFoodModal, {foodDescEditor: foodDescEditor});
            createFoodModal._.footer.empty().append($(compileModalFooter(false)));
        };

        //图片上传本地预览
        function previewImg(fileInput, $img)
        {
            if (fileInput.files && fileInput.files[0])
            {
                var reader = new FileReader();
                reader.onload = function(e){
                    $img.attr('src', e.target.result);
                }
                reader.readAsDataURL(fileInput.files[0]);
            }
        }


        //上传图片绑定事件
        function bindFileUpload($foodPic) {
            var $img = $foodPic.find('img'),
                imgSrc = $img.attr('src'),
                $elem = $foodPic.find('label');

            U.fileUpload($elem, function(rsp)
                {
                    var path = rsp.url, hwp = rsp.imgHWP || '';
                    foodParams.imgePath = path;
                    foodParams.imageHWP = hwp;
                    if(!window.FileReader)
                        $foodPic.find('img').attr('src', getFoodPicUrl(path, hwp));
                },
                {
                    onBefore: function($elem, $file)
                    {
                        imgSrc = $img.attr('src');
                        $foodPic.addClass('loading');
                        if(window.FileReader) previewImg($file[0], $img);
                    },
                    onFail: function() { if(window.FileReader) $img.attr('src', imgSrc); },
                    onAlways: function() { $foodPic.removeClass('loading'); },
                    accept: 'image/png,image/jpeg,image/jpg'
                });
        }


        //添加菜品规格
        function addGoodUnit($goodUnits) {
            var goodUnit = Handlebars.compile(Hualala.TplLib.get('tpl_good_unit_tr')),
                $unitsBody = $goodUnits.find('table tbody');
            $unitsBody.find('tr').last().find('td').last().empty();
            var unitsCount = $unitsBody.find('tr').length;
            $unitsBody.append($(goodUnit({customLast: true, index: unitsCount + 1 , lessThanFourUnits: unitsCount < 3})));
        }

        //删除菜品规格
        function delGoodUnit($goodUnits) {
            var addGoodBtn = Handlebars.compile(Hualala.TplLib.get('tpl_good_unit_add_btn')),
                delGoodBtn = Handlebars.compile(Hualala.TplLib.get('tpl_good_unit_del_btn')),
                $unitsBody = $goodUnits.find('table tbody');
            var $delTr = $unitsBody.find('tr').last();
            if($delTr.data('itemid')) delUnitItemIDs.push($delTr.data('itemid'));
            $delTr.remove();
            var unitsCount = $unitsBody.find('tr').length;
            $unitsBody.find('tr').last().find('td').last().append(addGoodBtn({lessThanFourUnits: true}));
            if(unitsCount > 1) $unitsBody.find('tr').last().find('td').last().append(delGoodBtn({customLast: unitsCount > 0}));

        }

        //初始化菜品的参数
        function initFoodParams() {
            foodParams = {};
            foodParams.isActive = 1;
            foodParams.isOpen = 1;
            foodParams.isDiscount = 1;
            foodParams.minOrderCount = 1;
            foodParams.takeoutPackagingFee = 0;
            foodParams.adsID = 0;
            foodParams.foodID = 0;
        }

        function clearUnits() {
            //清空所有的units
            var unitKeys = [];
            _.each(foodParams, function (value, key) {
                var unitKey = /^(unit|price|prePrice|vipPrice)\d$/i.test(key);
                if(unitKey) unitKeys.push(key);
            });
            foodParams = _.omit(foodParams, unitKeys);
            return foodParams;
        }

        var parseUnit = function (modalDialog) {
            //重新组装units
            var units = {},
                $unitTrs = modalDialog._.body.find('.good-unit table tbody tr');
            _.each($unitTrs, function (tr, index) {
                units['itemID' + (index + 1)] = $(tr).data('itemid') || '';
                _.each($(tr).find('td input'), function (input) {
                    units[$(input).attr('name') + (index + 1)] = $(input).val();
                });
            });
            if (delUnitItemIDs.length > 0) {
                _.each(delUnitItemIDs, function (itemID, index) {
                    units['itemID' + (index + 1 + $unitTrs.length)] = itemID;
                });
            }
            return units;
        };
        Hualala.Shop.ParseUnit = parseUnit;


        function bindTabEvent(modalDialog) {
            modalDialog._.body.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                if ($(e.target).attr('href')  == '#goodDesc') {
                    modalDialog._.footer.find('.btn.btn-ok').text('保存图文详情');
                } else if($(e.target).attr('href') == '#setFoodDetail') {
                    modalDialog._.footer.find('.btn.btn-ok').text('保存套餐');
                }else{
                    modalDialog._.footer.find('.btn.btn-ok').text('保存');
                }
            });

        }

        //组装表格显示的col
        function mapColItemRenderData(row, rowIdx, colKey) {
            var r = {value : "", text : ""}, v = $XP(row, colKey, '');
            switch(colKey) {
                case "rowControl" :
                    r = {
                        type : 'button',
                        btns : [
                            {
                                label : '添加',
                                link : 'javascript:void(0);',
                                id : $XP(row, 'foodID', ''),
                                key : $XP(row, 'itemID', ''),
                                type : 'addSetFood'
                            }
                        ]
                    };
                    break;
                case "unit":
                    r.value = v;
                    r.text = C.Math.prettyPrice($XP(row, 'price')) + '/' + v;
                    break;
                default :
                    r.value = r.text = $XP(row, colKey, '');
                    break;
            }
            return r;
        }

        //组装表格显示的rows
        function mapRenderFoods(records, tableHeaderCfg) {
            var self = this;
            var tblClz = "table-bordered table-striped table-hover ix-data-report",
                tblHeaders = IX.clone(tableHeaderCfg);
            var mapColsRenderData = function (row, idx) {
                var colKeys = _.map(tblHeaders, function (el) {
                    return {key: $XP(el, 'key', ''), clz: $XP(el, 'clz', '')};
                });
                var col = {clz: '', type: 'text'};
                var cols = _.map(colKeys, function (k, i) {
                    var r = mapColItemRenderData(row, idx, $XP(k, 'key', ''));
                    return IX.inherit(col, r, {clz: $XP(k, 'clz', '')});
                });
                return cols;
            };
            var rows = _.map(records, function (row, idx) {
                return {
                    clz: '',
                    cols: mapColsRenderData(row, idx)
                };
            });
            return {
                tblClz: tblClz,
                isEmpty: !records || records.length == 0 ? true : false,
                colCount: tableHeaderCfg.length,
                thead: tableHeaderCfg,
                rows: rows
            };

        }

        function bindSetFoodEvent(modalDialog) {
            var categoryTableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_category')),
                categoryTrTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_food_category')),
                foodTrTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_food_tr'));
            Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            var scrollTo = function($current, $scroll) {
                var currentTrIndex = $current.index(),
                    setListScrollHeight = $current[0].scrollHeight * (currentTrIndex + 2),
                    setListHeight = $scroll.height();
                if(setListHeight < setListScrollHeight) {
                    $scroll.scrollTop(setListScrollHeight - setListHeight);
                }
            };
            var modalBody = modalDialog._.body;
            modalBody.on('click', '#setFoodDetail button[name="addCategory"]', function () {
                var categoryTH = { tableHeads: ['商品名称', '售价(￥)/规格', '数量', '加价(￥)', '选择', '操作'], tableClass: 'set-food' };
                var $setFood = $('#setFoodDetail'),
                    $categoryForm = $setFood.find('.set-foods'),
                    $categoryTbody = $categoryForm.find('table tbody');
                //在套餐中添加分类
                if ($categoryTbody.length == 0) {
                    var $table = $(categoryTableTpl(categoryTH));
                    $categoryForm.append($table);
                    $categoryTbody = $categoryForm.find('table tbody');
                }
                $categoryTbody.find('tr.category').removeClass('success');
                $categoryTbody.append($(categoryTrTpl({selectedClass: 'success', foodItemsLength: 0})));
                scrollTo($categoryTbody.find('tr:last'), $categoryForm);
            }).on('click', '#setFoodDetail .good-list .search-btn .input-group ul.dropdown-menu li a', function () {
                //下拉菜单选择商品分类事件
                var $el = $(this),
                    categoryName = $el.text(),
                    categoryID = $el.attr('data-id') || '',
                    $dropDownBtn = $el.parents('ul').prev();
                $dropDownBtn.find('span.selected').attr('data-id', categoryID).text(categoryName);
            }).on('click', '#setFoodDetail button[name="search"]', function () {
                //搜索商品
                renderSearchFood(modalDialog, 1);
            }).on('click', '#setFoodDetail .search-foods table tr td a[data-type="addSetFood"]', function () {
                //从查询的菜品中添加菜品到套餐中
                var categoryTH = { tableHeads: ['商品名称', '售价(￥)/规格', '数量', '加价(￥)', '选择', '操作'], tableClass: 'set-food' };
                var $setFood = $('#setFoodDetail'),
                    $categoryForm = $setFood.find('.set-foods'),
                    $categoryTbody = $categoryForm.find('table tbody'),
                    $selCategory = $categoryTbody.find('tr.category.success');
                if ($selCategory.length == 0) return;
                var foodID = $(this).data('id'),
                    itemID = $(this).data('key'),
                    food = _.findWhere(searchFoods, {foodID: foodID + '', itemID: itemID + ''}),
                    tplData = IX.inherit(food, {number: 1, price: C.Math.prettyPrice(food.price), unitKey: itemID}),
                    $nextCategory = $selCategory.nextAll('.category').first(),
                    foodTr = foodTrTpl(tplData);
                //在套餐指定的分类里添加一条商品
                $nextCategory.length == 0 ? $categoryTbody.append(foodTr) : $nextCategory.before(foodTr);
                //修改分类的数量
                var $categoryNum = $selCategory.find('span.categoryNum');
                $categoryNum.text(parseInt($categoryNum.text()) + 1);
                scrollTo($nextCategory.length == 0 ? $categoryTbody.find('tr:last') : $nextCategory.prev(), $categoryForm);
            }).on('click', '#setFoodDetail .set-foods table tr.category', function () {
                var $this = $(this);
                $this.siblings('.category').removeClass('success');
                $this.addClass('success');
            }).on('click', '#setFoodDetail .set-foods table tr td a', function () {
                //删除套餐里的分类或某个菜品
                var $this = $(this),
                    $tr = $this.parents('tr'),
                    isCategory = $tr.hasClass('category');
                if (isCategory) {
                    //删除分类
                    $tr.nextUntil('tr.category').remove();
                    $tr.remove();
                } else {
                    //修改分类的数量
                    var $selCategory = $tr.prevAll('.category').first(),
                        $categoryNum = $selCategory.find('span.categoryNum'),
                        $selectedNum = $selCategory.find('td input[name="chooseCount"]');
                    if($tr.find('td input[name="selected"]').prop('checked')) $selectedNum.val($selectedNum.val() - 1)
                    $categoryNum.text(parseInt($categoryNum.text()) - 1);
                    //删除菜品
                    $tr.remove();
                }
            }).on('change', '#setFoodDetail .set-foods table tr td input[name="selected"]', function () {
                //设置套餐，选择套餐菜品
                var $el = $(this),
                    $currentTr = $el.parents('tr'),
                    $currentCategory = $currentTr.prevAll('.category').first(),
                    $selectedNum = $currentCategory.find('td input[name="chooseCount"]'),
                    selNum = _.select($currentCategory.nextUntil('.category'), function(tr) {return $(tr).find('td input[name="selected"]').prop('checked');}).length;
                $selectedNum.val(selNum)
            }).on('click', '#setFoodDetail .search-foods .page-selection ul li a', function () {
                //搜索的商品翻页
                var pageNo = $(this).parents('li').attr('data-pg');
                renderSearchFood(modalDialog, pageNo);
            });
        }

        //渲染搜索的商品
        function renderSearchFood(modalDialog, pageNo) {
            var foodsResultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid')),
                foodsTH = [
                    {key: 'foodName', clz: 'col-md-5 text', label: '商品名称'},
                    {key: 'unit', clz: 'col-md-4 text', label: '原价(￥)/规格'},
                    {key: 'rowControl', label: '操作'}
                ];
            var $setFood = modalDialog._.body.find('#setFoodDetail'),
                $searchFoods = $setFood.find('.search-foods'),
                $foodsForm = $searchFoods.find('.foods'),
                $foodsPager = $searchFoods.find('.page-selection'),
                $searchBtn = $searchFoods.prev(),
                $searchName = $searchBtn.find('.input-group input[name="foodCategoryName"]'),
                $addArrow = $setFood.find('.glyphicon-arrow-left'),
                searchParams = {
                    shopID: shopID,
                    foodCategoryID: $searchBtn.find('span.selected').attr('data-id'),
                    keyword: $searchName.val(),
                    pageNo: pageNo, pageSize: 15
                };
            Hualala.Global.searchFood(searchParams, function (rsp) {
                if (rsp.resultcode != '000') {
                    Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                searchFoods = rsp.data.records || [];
                if(searchFoods.length == 0) {
                    $addArrow.addClass('hidden');
                } else {
                    $addArrow.removeClass('hidden');
                }
                $foodsForm.empty().append(foodsResultTpl(mapRenderFoods(rsp.data.records, foodsTH)));
                var page = rsp.data.page;
                if(page.pageNo == 1) $foodsPager.IXPager({total: $XP(page, 'pageCount', 0), page: pageNo, maxVisible : 5, href: 'javascript:void(0)'});
            });
        }

        //绑定模态框的操作
        var bindOperatorEvent = function (modalDialog, food) {
            var modalBody = modalDialog._.body;
            foodParams.foodID = food.foodID;
            foodParams.adsID = food.adsID;
            foodParams.imgePath = food.imgePath;
            foodParams.imageHWP = food.imageHWP;

            //绑定切换标签页的操作
            bindTabEvent(modalDialog);
            //绑定套餐设置标签页的操作
            bindSetFoodEvent(modalDialog);

            //绑定modalDialog的form表单的事件
            bindFormChange(modalDialog);
            //绑定modalDialog的footer的保存事件
            bindSave(modalDialog, food);
            //绑定规格的操作事件
            bindUnitOperate(modalDialog);
            //绑定图片上传事件
            bindFileUpload(modalBody.find('.food-pic'));
        };

        Hualala.Shop.BindOperatorEvent = bindOperatorEvent;

        function bindFormChange(modalDialog) {
            var unitTrTpl = Handlebars.compile(Hualala.TplLib.get('tpl_good_unit_tr')),
                modalBody = modalDialog._.body;
            //“套餐”和“规格”两个属性是互斥的
            modalBody.on('change', '#goodBasicInfo form input[name="isSetFood"]', function () {
                //套餐的规格限制一个并且规格名称必须是“套”不可修改
                var $isTempFood = modalBody.find('input[name="isTempFood"]'),
                    $unitTable = modalBody.find('#goodBasicInfo .good-unit table'),
                    isSet = $(this).prop('checked'),
                    unitData = {},
                    $isOpen = modalBody.find('input[name="isOpen"]');
                if(isSet) {
                    unitData = {disabled: 'disabled', unit: '套'};
                    $isTempFood.prop('checked', false);
                    $isOpen.bootstrapSwitch('disabled', false);
                } else {
                    unitData = {index: '1*', lessThanFourUnits: true};
                }
                $unitTable.find('tbody').empty().append(unitTrTpl(unitData));
            }).on('change', '#goodBasicInfo form input[name="isTempFood"]', function() {
                //临时菜的规格限制一个并且规格名称必须是“份”不可修改
                var $isSetFood = modalBody.find('input[name="isSetFood"]'),
                    $unitTable = modalBody.find('#goodBasicInfo .good-unit table'),
                    $this = $(this),
                    isTemp = $this.prop('checked'),
                    unitData = {},
                    $isOpen = modalBody.find('input[name="isOpen"]');
                if(isTemp) {
                    unitData = {disabled: 'disabled', unit: '份', price: '0'};
                    $isSetFood.prop('checked', false);
                    $isOpen.bootstrapSwitch('state', false);
                    $isOpen.bootstrapSwitch('disabled', true);
                    $this.next('span').removeClass('hidden');
                } else {
                    unitData = {index: '1*', lessThanFourUnits: true};
                    $isOpen.bootstrapSwitch('disabled', false);
                    $isOpen.bootstrapSwitch('state', true);
                    $this.next('span').addClass('hidden');
                }
                $unitTable.find('tbody').empty().append(unitTrTpl(unitData));
            }).on('change', '#goodDetailInfo form select[name="takeawayTag"]', function () {
                var $el = $(this),
                    $package = $el.parents('.form-group').next('.form-group.package'),
                    $packageVal = $package.find('input[name="takeoutPackagingFee"]');
                if($el.val() == 0) {
                    $packageVal.val('');
                    $package.addClass('hidden');
                } else {
                    $packageVal.val('');
                    $package.removeClass('hidden');
                }
            });
        }

        function bindSave(modalDialog, food) {
            var modalBody = modalDialog._.body;
            modalDialog._.footer.on('click', 'button[name="save-food"]', function () {
                if (!isFoodBasicInfoValid(modalDialog)) return;
                saveFood(modalDialog, function (records) {
                    var $isSetFood = modalBody.find('input[name="isSetFood"]'),
                        $isTempFood = modalBody.find('input[name="isTempFood"]'),
                        $IsNeedConfirmFoodNumberLabel = modalBody.find('input[name="IsNeedConfirmFoodNumber"]').parents('label');
                    //显示其它标签页
                    var setFood = foodParams.isSetFood ? '' : '.setFood';
                    modalBody.find('ul.nav-tabs li:not('+setFood+')').removeClass('hidden');
                    //套餐和临时菜的属性不可修改
                    $isSetFood.prop('disabled', true);
                    $isTempFood.prop('disabled', true);
                    var $goodUnit = modalBody.find('.good-unit table tbody');
                    if (records && records.length > 0) {
                        var updateFood = records[0];
                        modalBody.find('#goodBasicInfo form input[name="foodCode"]').val(updateFood.foodCode);
                        $goodUnit.empty().append($(Hualala.Shop.GetUnitsTpl(updateFood.units)));
                        modalBody.find('#goodDetailInfo .form-group input[name="minOrderCount"]').val(foodParams.minOrderCount);
                        modalDialog._.footer.empty().append($(compileModalFooter(true)));
                        //如果是套餐或临时菜，需要处理规格
                        if(updateFood.isSetFood == 1 || updateFood.isTempFood == 1) {
                            $IsNeedConfirmFoodNumberLabel.addClass('hidden');
                            $goodUnit.find('tr td input[name="unit"]').attr('disabled', true);
                            $goodUnit.find('tr td span').text('规格');
                            $goodUnit.find('tr td:last').empty();
                            //如果是套餐需要在套餐标签页显示商品名称,刷新商品，绑定套餐事件
                            if(updateFood.isSetFood == 1) {
                                modalBody.find('#setFoodDetail .set-list span[name="foodName"]').text(foodParams.foodName);
                                renderInputGroup(modalDialog);
                            }
                        }
                    }
                });
            }).on('click', 'button[name="save-create-food"]', function () {
                if (!isFoodBasicInfoValid(modalDialog)) return;
                saveFood(modalDialog, function (records) {
                    //清空modal的数据
                    foodParams = {};
                    modalBody.empty().append($(createModalCompile()));
                    initFoodParams();
                    //渲染菜品分类  科目  部门的下拉菜单
                    renderSelect(modalDialog);
                    //初始化规格
                    displayUnits(modalDialog._.body.find('.good-unit'));
                    //渲染菜品网上开放、是否在售、参与打折的属性的开关
                    createFoodAttrSwitch(modalDialog);
                    //form表单的校验绑定
                    registerValidateFoodInfo(modalDialog);
                    //重新绑定上传图片事件
                    bindFileUpload(modalBody.find('.food-pic'));
                    //重新绑定标签切换事件
                    bindTabEvent(modalDialog);
                    U.clearEditors();
                    food.foodDescEditor = U.createEditor('goodDescEditor');
                });
            }).on('click', 'button[name="save-close"]', function () {
                if (!isFoodBasicInfoValid(modalDialog)) return;
                saveFood(modalDialog, modalDialog.hide);
            }).on('click', 'button.btn-ok', function () {
                var btnText = $(this).text();
                if (btnText == '保存') {
                    var isAllInfoValid = isFoodBasicInfoValid(modalDialog)
                        && isFoodDetailInfoValid(modalDialog)
                        && isFoodTasteInfoValid(modalDialog);
                    if (!isAllInfoValid) return;
                    saveFood(modalDialog, function (records) {
                        var $goodUnit = modalBody.find('.good-unit table tbody');
                        if (records && records.length > 0) {
                            $goodUnit.empty().append($(Hualala.Shop.GetUnitsTpl(records[0].units)));
                            if(records[0].isSetFood == 1) {
                                $goodUnit.find('tr td input[name="unit"]').attr('disabled', true);
                                $goodUnit.find('tr td span').text('规格');
                                $goodUnit.find('tr td:last').empty();
                                modalBody.find('#setFoodDetail .set-list span[name="foodName"]').text(foodParams.foodName);
                            }
                        }
                    });
                } else if(btnText == '保存图文详情') {
                    var params = _.pick(foodParams, 'groupID', 'foodID', 'adsID');
                    params.body = food.foodDescEditor.getContent();
                    params.shopID = shopID;
                    C.loadData('setFoodDescription', params, null, 'data').done(function(data)
                    {
                        topTip({msg: '菜品说明信息保存成功！', type: 'success'});
                        foodParams.adsID = data.adsID;
                    });
                } else if(btnText == '保存套餐') {
                    var $setFoodTable = modalBody.find('#setFoodDetail .set-foods table.set-food');
                    if (checkSetFoodValid($setFoodTable)) {
                        var foodLst = parseSetFoodDetail($setFoodTable),
                            params = IX.inherit(
                                {shopID: shopID, foodID: foodParams.foodID},
                                {setFoodDetailJson: JSON.stringify(foodLst || {})},
                                {setFoodDetailLst: _.map($setFoodTable.find('tbody tr.food td.foodName'), function(td) { return $(td).text();}).join(',')}
                            );
                        Hualala.Global.updateSetFoodDetail(params, function (rsp) {
                            if(rsp.resultcode != '000') {
                                Hualala.UI.TopTip({msg: rsp.resultcode, type: 'danger'});
                                return;
                            }
                            Hualala.UI.TopTip({msg: '保存成功', type: 'success'});
                        });
                    }
                }
            });
        }

        function checkSetFoodValid($table) {
            var categoryTrs = $table.find('tr.category'),
                foodTrs = $table.find('tr.food'),
                isValid = true;
            _.each(categoryTrs, function (tr) {
                var chooseCount = parseInt($(tr).find('td input[name="chooseCount"]').val()),
                    allCount = parseInt($(tr).find('td span.categoryNum').text());
                if (!$(tr).find('td input[name="categoryName"]').val()) {
                    isValid = false;
                    Hualala.UI.TopTip({msg: '分类名称不能为空', type: 'danger'});
                    return;
                }
            });
            if(isValid) {
                var itemIDS = _.map(foodTrs, function (tr) {
                    return $(tr).data('unitkey');
                });
                isValid = _.uniq(itemIDS).length == itemIDS.length;
                if(!isValid) Hualala.UI.TopTip({msg: '菜品不能重复添加', type: 'danger'});
            }
            return isValid;
        }

        function parseSetFoodDetail($setFoodTable) {
            return { foodLst: _.map($setFoodTable.find('tbody tr.category'), function (tr) {
                return {
                    foodCategoryName: $(tr).find('td input[name="categoryName"]').val(),
                    chooseCount: $(tr).find('td input[name="chooseCount"]').val() || '0',
                    canSwitch: $(tr).find('td input[name="canSwitch"]').prop('checked') ? '1' : '0',
                    items: _.map($(tr).nextUntil('.category'), function(food){
                        var priceUnit = $(food).find('td.unit').text().split('/');
                        return {
                            foodKey: $(food).data('foodkey'),
                            unitKey: $(food).data('unitkey'),
                            foodName: $(food).find('td.foodName').text(),
                            price: priceUnit[0],
                            unit: priceUnit[1],
                            number: $(food).find('td input[name="number"]').val() || '0',
                            addPrice: $(food).find('td input[name="addPrice"]').val() || '0',
                            selected: +$(food).find('td input[name="selected"]').prop('checked')
                        };
                    })
                };
            })};
        }

        function parseSwitchStatus($form) {
            var $checkbox = $form.find('input[name="isSetFood"], input[name="isTempFood"]');
            _.each($checkbox, function (input) {
                foodParams[$(input).attr('name')] = $(input).prop('checked') ? 1 : 0;
            });
            _.each($form.find('input.status'), function (input) {
                foodParams[$(input).attr('name')] = $(input).bootstrapSwitch('state') ? 1 : 0;
            });
        }

        //组合往后台传的参数的值
        function parseFoodParams(modalDialog) {
            var $formFood = modalDialog._.body.find('form.form-food'),
                $formFoodDetail = modalDialog._.body.find('form.form-food-detail'),
                $formTaste = modalDialog._.body.find('form.form-taste');
            _.extend(foodParams, C.parseForm($formFood));
            parseSwitchStatus($formFood);
            foodParams = IX.inherit(foodParams, parseUnit(modalDialog));
            if (foodParams.foodID) {
                //解析详细信息的数据
                _.extend(foodParams, C.parseForm($formFoodDetail));
                //解析口味作法的数据
                _.extend(foodParams, C.parseForm($formTaste));
                //把详细信息的checkbox获取的数据转化成成字符串
                _.each($formFoodDetail.find('.setting-label label input'), function (input) {
                    foodParams[$(input).attr('name')] = $(input).prop('checked') ? 1 : 0;
                });
                _.each($formFoodDetail.find('.setting-snewr label input'), function (input) {
                    foodParams[$(input).val()] = $(input).prop('checked') ? 1 : 0;
                });
                foodParams = _.omit(foodParams, 'foodIco');
            }
        }

        function displayError($input) {
            var $formGroup = $input.parents('.form-group'),
                $status_i = $formGroup.find('i.form-control-feedback'),
                $inputParent = $input.parent(),
                $smallMessage = $inputParent.find('small[name="foodNameExist"]');
            $formGroup.removeClass('has-success').addClass('has-error');
            $status_i.removeClass('glyphicon-ok').addClass('glyphicon-remove');
            if ($smallMessage.length == 0) {
                $inputParent.append($('<small class="help-block" name="foodNameExist" style="display: block;">商品名称重复</small>'));
            } else{
                $smallMessage.css('display', 'block');
            }

        }

        function displaySuccess($input) {
            var $formGroup = $input.parents('.form-group'),
                $status_i = $formGroup.find('i.form-control-feedback'),
                $smallMessage = $formGroup.find('small[name="foodNameExist"]');
            $formGroup.removeClass('has-error').addClass('has-success');
            $status_i.removeClass('glyphicon-remove').addClass('glyphicon-ok');
            if ($smallMessage) $smallMessage.css('display', 'none');
        }
        //保存菜品信息
        function saveFood(modalDialog, cbFn) {
            parseFoodParams(modalDialog);
            var checkFoodNameParams = {shopID: shopID, groupID: groupID, foodName: foodParams.foodName},
                $foodNameInput = $('input[name="foodName"]');
            if(foodParams.foodID) checkFoodNameParams = IX.inherit({}, checkFoodNameParams, {foodID: foodParams.foodID});
            G.checkFoodNameExist(checkFoodNameParams, function (rsp) {
                if(rsp.resultcode != '000') {
                    Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                    displayError($foodNameInput);
                    return;
                }
                var $foodNameMsg = $foodNameInput.siblings('small[name="foodNameExist"]');
                if($foodNameMsg.length != 0 && $foodNameMsg.css('display') == 'block') $foodNameMsg.css('display', 'none');
                foodParams.shopID = shopID;
                foodParams.groupID = groupID;
                foodParams.takeoutPackagingFee = foodParams.takeoutPackagingFee || 0;
                foodParams.minOrderCount = foodParams.minOrderCount || 1;
                foodParams.description = C.encodeTextEnter(foodParams.description);
                var api = foodParams.foodID ? 'updateFood' : 'createSaasGood';
                G[api](foodParams, function (rsp) {
                    if (rsp.resultcode != '000') {
                        topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    foodParams.foodID = foodParams.foodID || rsp.data.records[0].foodID;
                    topTip({msg : '保存成功', type: 'success'});
                    foodParams = clearUnits();
                    delUnitItemIDs = [];
                    if(IX.isFn(cbFn)) cbFn(rsp.data.records);
                    Hualala.Shop.LoadFoods(true);
                });
            });
        }


        var checkUnitValid = function(modal) {
            var units = modal._.body.find('.good-unit table tbody tr'),
                isValid = true;
            _.each(units, function (unit, index) {
                var unitName = $.trim($(unit).find('td input[name="unit"]').val()),
                    unitPrice = $(unit).find('td input[name="price"]').val(),
                    unitVipPrice = $(unit).find('td input[name="vipPrice"]').val(),
                    unitPrePrice = $(unit).find('td input[name="prePrice"]').val();
                if (!unitName) {
                    topTip({msg: '规格'+(index+1)+'的名称不能为空', type: 'danger'});
                    isValid = false;
                    return;
                } else if(!$.isNumeric(unitPrice || 0) || parseFloat(unitPrice) < 0 ||
                    !$.isNumeric(unitVipPrice || 0) || parseFloat(unitVipPrice) < 0 ||
                    !$.isNumeric(unitPrePrice || 0) || parseFloat(unitPrePrice) < 0) {
                    topTip({msg: '价格必须为不小于0的数字', type: 'danger'});
                    isValid = false;
                    return;
                } else if (!unitPrice) {
                    topTip({msg: '规格'+(index+1)+'的售价不能为空', type: 'danger'});
                    isValid = false;
                    return;
                } else if (unitVipPrice && parseFloat(unitPrice) < parseFloat(unitVipPrice)) {
                    topTip({msg: '规格'+(index+1)+'会员价不能大于售价', type: 'danger'});
                    isValid = false;
                    return;
                } else if (unitPrePrice && parseFloat(unitPrice) > parseFloat(unitPrePrice)) {
                    topTip({msg: '规格'+(index+1)+'会售价不能大于原价', type: 'danger'});
                    isValid = false;
                    return;
                }
            });
            return isValid;
        };

        Hualala.Shop.CheckUnitValid = checkUnitValid;

        //检测form validator是否符合要求
        function isFormBootstrapValid(form) {
            var isFormValid = form.data('bootstrapValidator').validate().isValid();
            if(!isFormValid) {
                topTip({msg: '请仔细检查填写的信息', type: 'danger'});
            }
            return isFormValid;
        }

        //检测基本信息是否符合要求
        function isFoodBasicInfoValid(modal) {
            var $form = modal._.body.find('form.form-food');
            return $form.data('bootstrapValidator').validate().isValid() && checkUnitValid(modal);
        }

        //检测详细信息是否符合条件
        function isFoodDetailInfoValid(modal) {
            return isFormBootstrapValid(modal._.body.find('form.form-food-detail'));
        }

        //检查作法口味是否符合要求
        function isFoodTasteInfoValid(modal){
            return isFormBootstrapValid(modal._.body.find('form.form-taste'));
        }


        //添加规格的html
        function displayUnits($goodUnits) {
            var unitsCount = $goodUnits.find('table tbody tr').length;
            _.each($goodUnits.find('table tbody tr'), function (tr, index) {
                var $tds = $(tr).find('td');
                if (index == 0) {
                    $tds.eq(1).find('input').attr('placeholder', '例：份、锅');
                    $tds.eq(2).find('input').attr('placeholder', '10.00');
                }
                if(index != unitsCount - 1) $tds.last().empty();
            });
        }

        function getFoodPicUrl(path, hwp)
        {
            var h = hwp ? parseInt(200 * hwp) : '',
                cfg = hwp ? {width: 200, height: h} : {};

            return path ? C.getSourceImage(path, cfg) : imgRoot + 'food_bg.png';
        }

        Hualala.Shop.CreateFood = createFood;

    };

})(jQuery, window);