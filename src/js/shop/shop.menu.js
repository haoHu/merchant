(function ($, window) {
IX.ns('Hualala.Shop');
// 初始化店铺菜品页面
Hualala.Shop.initMenu = function ($container, pageType, params, isSaasOpen)
{
    if(!params) return;
    
    var G = Hualala.Global,
        U = Hualala.UI,
        C = Hualala.Common,
        topTip = U.TopTip;
    
    var shopID = params;
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        imgRoot = G.IMAGE_ROOT + '/';

    var classifiedFoods = null, //已分类菜品
        foodClass = '', //当前菜品类别的 foodCategoryID
        foods = null, //当前表格显示的菜品数组
        allFoods = [], //所有菜品数组
        current = 0, //页面滚动时渲染foods所在的索引
        size = 10, // 首次或者滚动加载的food数量
        searchParams = null, //菜品搜索过滤参数
        //修改菜品弹出框里几个 radio 的名称
        foodParams = ['hotTag', 'takeawayTag', 'isDiscount'],
        food = null, //当前菜品
        activeTab = 'foodBasicInfo',
        ef = null; //修改菜品后用于向服务器发送的数据
        
    //单个菜品模板（菜品表格中的一行）
    var foodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food')),
        loadingTpl = Handlebars.compile(Hualala.TplLib.get('tpl_loading')),
        //修改菜品弹出框模板
        editFoodTpl = null;
        //页面主内容
    var $menu = $(Hualala.TplLib.get('tpl_shop_menu')),
        $foodClass = null, //菜品类别 UI 对象集合
        $foodSearch = $menu.find('#foodSearch'),
        $takeawayTag = $foodSearch.find('#takeawayTag'),
        $foodName = $foodSearch.find('#foodName'),
        $chekbox = $foodSearch.find('input[type=checkbox]'),
        $tblHead = $menu.find('.tbl-foods thead'),
        $foodCount = $menu.find('#foodSearchInfo span'),
        $foods = $menu.find('.tbl-foods tbody'),
        $editFood = null,
        $loading = $(loadingTpl()),
        modalEditFood = null, 
        bv = null; //表单验证器
    var foodDescEditor = null;

    //渲染菜品
    function renderFoods(start) {
        foods = filterFoods();
        $foodCount.text(foods.length);
        if(current == 0 || start) $foods.empty();
        $foods.append(foodTpl({foods: foods.slice(start ? 0 : current, current + size), isSaasOpen: isSaasOpen}));
        $container.find('.loading').remove();
        current += size;
    }

    //初始化“添加菜品”按钮
    if(isSaasOpen) $('<div class="well well-sm t-r"><button class="btn btn-default" name="add-food">添加菜品</button></div>').appendTo($container);

    //调用服务，根据 shopID 获取所有分类和菜品信息
    var loadFoods = function(start) {
        C.loadData('getShopMenu', {shopID : shopID}).done(function(records)
        {
            allFoods = [];
            if(!records || records.length == 0)
            {
                var $alert = $('<div class="alert alert-warning t-c">此店铺暂无菜品，您可以通过下载<a target="_blank">哗啦啦代理程序</a>上传菜品数据。</div>');
                $alert.find('a').attr('href', Hualala.PageRoute.createPath('pcclient'));
                $alert.appendTo($container);
                return;
            }
            var $alertDom = $container.find('.alert.alert-warning');
            if($alertDom.length != 0) $alertDom.remove();
            classifiedFoods = classifyFoods(records);
            for(var foodCategoryID in classifiedFoods)
                allFoods.push.apply(allFoods, classifiedFoods[foodCategoryID].foods);
            renderFoods(start); //渲染所有菜品
            //渲染菜品分类
            var $allFoodsSpan = $('<span></span>');
            if (!start) $allFoodsSpan.addClass('current-food-class');
            var $foodClassBox = $menu.find('#foodClassBox').empty().append($allFoodsSpan.text('全部菜品 (' + allFoods.length + ')'));

            for(var id in classifiedFoods)
            {
                var category = classifiedFoods[id],
                    $span = $('<span></span>');
                if (start && foodClass == id) $span.addClass('current-food-class');
                $span.data('id', id).text(category.foodCategoryName + ' (' + category.foods.length + ')').appendTo($foodClassBox);
            }
            $foodClass = $foodClassBox.find('span');

            var foodNameTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food_name'));
            $foodName.html(foodNameTpl({classifiedFoods: classifiedFoods}));
            if($foodName.data('chosen')){ $foodName.chosen('destroy'); }
            U.createChosen($foodName, allFoods, 'foodID', 'foodName', {
                noFill: true, noCurrent: true, width : '200px',
                placeholder_text : "选择或输入菜品名称",
                no_results_text : "抱歉，没有相关菜品！"
            }, false);

            $menu.appendTo($container);
        });
    };

    loadFoods();
    //页面滚动时加载更多菜品
    $(window).off('scroll.food').on('scroll.food', function(e)
    {
        if(foods) throttle(scrollFood);
    });
    
    function scrollFood()
    {
        var viewBottom = $(window).scrollTop() + $(window).height(),
            foodsBottom = $foods.offset().top + $foods.height();
        
        if(foodsBottom < viewBottom && current < foods.length) {
            $container.append($loading);
            setTimeout(renderFoods, 800);
        }
    }
    
    $(document).off('change.foodMenu').on('change.foodMenu', function(e)
    {
        var $target = $(e.target);
        //菜品过滤筛选
        if($target.is('#foodSearch input, #foodSearch select')) searchFood();
        //自定义按钮组相关
        if($target.is('.form-food input[type=radio]'))
        {
            $target.closest('div').find('label').removeClass('active')
            .find('input:checked').parent().addClass('active');
        }
    });
    
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

    var getUnitsTpl = function (units) {
        var prettyPrice = function (price) {
            return price ? C.Math.prettyPrice(price) : '';
        };
        if (units) {
            var unitsTpl = [],
                unitsLength = units.length ;
            _.each(units, function (unit, index) {
                //unit.prePrice为-1时，price是售价，unit.prePrice不为-1时prePrice是售价
                var price = (unit.prePrice == -1 || unit.price == unit.prePrice) ? unit.price : unit.prePrice,//price是售价
                    vipPrice = (unit.vipPrice == -1 || parseFloat(unit.vipPrice) >= parseFloat(price)) ? '' : unit.vipPrice,
                    prePrice = (unit.prePrice == -1 || unit.price == unit.prePrice) ? '' : unit.price,//prePrice原价
                    estimatePrice = !unit.foodEstimateCost ? '' : unit.foodEstimateCost,//prePrice原价
                    tr = ['<tr data-itemid="'+(unit.itemID || '')+'">',
                        '<td><span>规格'+ (index + 1) + (index == 0 ? '*' : '') + '</span></td>',
                        '<td><input type="text" placeholder="'+(index == 0 ? '例：份、锅' : '')+'" name="unit" value="'+unit.unit+'"/></td>',
                        '<td><input type="text" placeholder="'+(index == 0 ? '10.00' : '')+'" name="price" value="'+prettyPrice(price)+'"/></td>',
                        '<td><input type="text" name="vipPrice" value="'+prettyPrice(vipPrice)+'"/></td>',
                        '<td><input type="text" name="prePrice" value="'+prettyPrice(prePrice)+'"/></td>',
                        '<td><input type="text" name="foodEstimateCost" value="'+prettyPrice(estimatePrice)+'"/></td>'
                    ].join(''),
                    operateTd = '<td></td>';
                if(units.length == 1) {
                    operateTd = '<td><a class="glyphicon glyphicon-plus-sign" href="javascript:{}"></a></td>';
                } else if(unitsLength > 1 && unitsLength < 4 && index == unitsLength - 1) {
                    operateTd = '<td>' +
                    '<a class="glyphicon glyphicon-plus-sign" href="javascript:{}"></a>' +
                    '<a class="glyphicon glyphicon-minus-sign" href="javascript:{}"></a>' +
                    '</td>';
                } else if(unitsLength >= 4 && index == unitsLength - 1) {
                    operateTd = '<td><a class="glyphicon glyphicon-minus-sign" href="javascript:{}"></a></td>'
                }
                unitsTpl.push(tr + operateTd + '</tr>');
            });
            return unitsTpl.join('');
        }
    };

    Hualala.Shop.GetUnitsTpl = getUnitsTpl;

    //给某个对象扩展属性
    function extendCustomAttr(object, extendName, cbFn) {
        if (!IX.isFn(cbFn)) return;
        _.each(object, function (obj) {
            if (cbFn(obj)) {
                obj[extendName] = extendName;
            }
        });
        return object;
    }

    //修改菜品 或 删除菜品
    $foods.on('click', 'tr td button', function(){
        var $this = $(this),
            targetText = $this.text(),
            $tr = $this.parents('tr'),
            foodID = $tr.data('id') + '',
            foodCategoryID = $tr.data('cid');
        if(targetText == '修改') {
            var queryFoodParams = {
                shopID: shopID,
                foodID: foodID,
                foodCategoryID: foodCategoryID
            };
            C.loadData('queryGoodByID', queryFoodParams).done(function(records) {
                if (records && records.length > 0) {
                    Hualala.Shop.RegisterEditFoodPartial();
                    food = records[0];
                    //菜品图片地址
                    var path = food.imgePath,
                        hwp = food.imageHWP;
                    food.foodPic = getFoodPicUrl(path, hwp);

                    if(isSaasOpen) {
                        editFoodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_good'));
                        //给food添加字段setFoodListEmpty
                        var setFoodDetail = JSON.parse(food.setFoodDetailJson || '{}');
                        food.setFoodDetail = setFoodDetail;
                        food.hasSetFoodList = food.isSetFood == 1 && setFoodDetail.foodLst && setFoodDetail.foodLst.length > 0;
                        Handlebars.registerPartial('category', Hualala.TplLib.get('tpl_set_food_category'));
                        Handlebars.registerPartial('food', Hualala.TplLib.get('tpl_set_food_tr'));
                        //给setFoodDetailJson.foodLst 添加itemLenth属性 并为items添加checked属性
                        _.each(setFoodDetail.foodLst, function (category) {
                            category.foodItemsLength = category.items.length;
                            category.switchChecked = category.canSwitch == 1 ? 'checked' : '';
                            _.each(category.items, function (item) {
                                item.checked = item.selected == 1 ? 'checked' : '';
                                item.price = C.Math.prettyPrice(item.price);
                            });
                        });

                        //处理菜品规格显示的模板需要的数据格式
                        var unitsLength = food.units.length,
                            extendUnits = _.map(IX.clone(food.units), function (unit, index) {
                                //unit.prePrice为-1时，price是售价，unit.prePrice不为-1时prePrice是售价
                                var price = (unit.prePrice == -1 || unit.prePrice == unit.price) ? unit.price : unit.prePrice,//price是售价
                                    vipPrice = (unit.vipPrice == -1 || parseFloat(unit.vipPrice) >= parseFloat(price)) ? '' : unit.vipPrice,
                                    prePrice = (unit.prePrice == -1 || unit.prePrice == unit.price) ? '' : unit.price,//prePrice原价
                                    foodEstimateCost = unit.foodEstimateCost;

                                return IX.inherit(unit, {
                                    index: (index + 1) + (index == 0 ? '*' : '' ),
                                    lessThanFourUnits: unitsLength < 4 && (index == unitsLength - 1),
                                    customLast: unitsLength > 1 && index == unitsLength - 1,
                                    price: price ? C.Math.prettyPrice(price) : '',
                                    prePrice: prePrice ? C.Math.prettyPrice(prePrice) : '',
                                    vipPrice: vipPrice ? C.Math.prettyPrice(vipPrice) : '',
                                    foodEstimateCost: foodEstimateCost ? C.Math.prettyPrice(foodEstimateCost) : ''
                                });
                            }),
                            setFoodUnits = _.map(IX.clone(extendUnits), function (unit) {
                                //unit.prePrice为-1时，price是售价，unit.prePrice不为-1时prePrice是售价
                                return _.omit(IX.inherit(unit, {
                                    lessThanFourUnits: false,
                                    customLast: false,
                                    disabled: 'disabled'
                                }), 'index');
                            });

                        //处理菜品详细信息显示的模板需要的数据格式
                        var foodAttrSelect = IX.clone(Hualala.TypeDef.FoodAttrSelect),
                            takeawayOptions = extendCustomAttr(foodAttrSelect.TakeawayType, 'selected', function(obj) {return food.takeawayTag == obj.value;}),

                            hotTagOptions = extendCustomAttr(foodAttrSelect.HotTag, 'selected',  function(obj) {return food.hotTag == obj.value;}),
                            foodSettings = extendCustomAttr(IX.clone(Hualala.TypeDef.FoodSettings), 'checked', function(obj){return food[obj.name] == 1;}),
                            foodAttrSNewR = extendCustomAttr(IX.clone(Hualala.TypeDef.FoodAttrSNewR), 'checked', function(obj){return food[obj.name] == 1;});
                        _.each(foodSettings, function (obj) {
                            if(obj.name == 'IsNeedConfirmFoodNumber') {
                                obj.hidden = (food.isSetFood == 1 || food.isTempFood == 1) ? 'hidden' : '';
                            }
                        });

                        //categoryTH: 套餐的商品详情的表头
                        var categoryTH = { tableHeads: ['商品名称', '售价(￥)/规格', '数量', '加价(￥)', '选择', '操作'], tableClass: 'set-food'},
                            editFoodData = {
                                detailDisplay: '',
                                setFoodDisplay: food.isSetFood == 1 ? '' : 'hidden',
                                goodUnits: {tableHeads: ['', '规格名称*', '售价(￥)*', '会员价(￥)', '原价(￥)', '预估成本价(￥)', ''], lessThanFourUnits: true},
                                takeawayTypes: {options: takeawayOptions, name: 'takeawayTag'},
                                packageHidden: food.takeawayTag == 0 ? 'hidden' : '',
                                hotTags: {options: hotTagOptions, name: 'hotTag'},
                                foodSettings: foodSettings,
                                foodAttrSNewR: foodAttrSNewR,
                                food: IX.inherit({}, food,
                                    {
                                        takeoutPackagingFee: C.Math.prettyPrice(food.takeoutPackagingFee),
                                        units: (food.isSetFood == 1 || food.isTempFood == 1) ? setFoodUnits : extendUnits,
                                        description: C.decodeTextEnter(food.description),
                                        isOpenDisabled: food.isTempFood == 1 ? 'disabled' : ''
                                    }),
                                category: categoryTH,
                                typeDisabled: 'disabled',
                                checkedIncrementUnit: food.incrementUnit == 0.1 ? 'checked' : ''
                            },
                            $editFood = $(editFoodTpl(editFoodData));
                        //弹出对话框
                        modalEditFood = new U.ModalDialog({
                            id: 'createFood',
                            title: '修改菜品',
                            backdrop: 'static',
                            html: $editFood,
                            hideCloseBtn: false,
                            afterHide: function() {
                                Hualala.UI.clearEditors();
                            }
                        }).show();
                        //加载商品分类的下拉菜单
                        Hualala.Shop.RenderSelect(modalEditFood, food);
                        //初始化菜品属性的bootstrapSwitch
                        Hualala.Shop.CreateFoodAttrSwitch(modalEditFood);
                        //替换modal的footer为自定义的
                        modalEditFood._.footer.empty().append(Hualala.Shop.CompileModalFooter(true));
                        //初始化表单验证
                        Hualala.Shop.RegisterValidateFoodInfo(modalEditFood, food.foodID);
                        //初始化图文详情页
                        foodDescEditor = U.createEditor('goodDescEditor');
                        food.foodDescEditor = foodDescEditor;
                        //绑定规格操作的事件
                        Hualala.Shop.BindOperatorEvent(modalEditFood, food);
                        var tempOrSetFoodVal = (food.isTempFood || '0') + (food.isSetFood || '0'),
                            $checkedFoodType = $editFood.find('.food-type input[name="foodType"]').eq(parseInt(tempOrSetFoodVal, 2));
                        $checkedFoodType.prop('checked', true).trigger('change');
                    } else {
                        var foodIcos = ['isSpecialty', 'isRecommend', 'isNew'],
                            editFoodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_food'));
                        //辣度
                        food.hotTag1 = imgRoot + 'hottag1.png';
                        food.hotTag2 = imgRoot + 'hottag2.png';
                        food.hotTag3 = imgRoot + 'hottag3.png';

                        $editFood = $(editFoodTpl(food));
                        //弹出对话框
                        modalEditFood = new U.ModalDialog({
                            id: 'editFood',
                            title: '修改菜品',
                            html: $editFood,
                            hideCloseBtn: false
                        }).show();
                        var $btnOK = modalEditFood._.footer.find('.btn-ok').text('保存基本信息');
                        modalEditFood._.footer.find('.btn-close').text('关闭');
                        //初始化表单验证
                        bv = $editFood.find('.form-food').bootstrapValidator({
                            fields: {
                                minOrderCount: {
                                    validators: {
                                        notEmpty: {message: '起售份数不能为空'},
                                        integer: {message: '起售份数必须是整数'},
                                        between: {min: 1, max: 99, message: '起售份数必须在1到99之间'}
                                    }
                                }
                            }
                        }).data('bootstrapValidator');
                        //初始化ef
                        ef = {shopID: shopID, foodID: $tr.data('id'), adsID: food.adsID || '0'};
                        for(var i = foodIcos.length; i--;)
                        {
                            var foodIco = foodIcos[i];
                            ef[foodIco] = '0';
                            if(food[foodIco] == 1)
                            {
                                $editFood.find('input[name=foodIco][value=' + foodIco +']').prop('checked', true).trigger('change');
                            }
                        }

                        for(var i = foodParams.length; i--;)
                        {
                            var param = foodParams[i];
                            $editFood.find('input[name=' + param + '][value=' + food[param] +']').prop('checked', true).trigger('change');
                        }
                        //菜品“可售/停售”
                        $editFood.find('input[name=isActive][value=' + food.isActive + ']').prop('checked', true).trigger('change');

                        var $foodPic = $editFood.find('.food-pic'),
                            $elem = $foodPic.find('label');

                        U.fileUpload($elem, function(rsp)
                            {
                                var path = rsp.url, hwp = rsp.imgHWP || '';
                                ef.imagePath = path;
                                ef.imageHWP = hwp;
                                if(!window.FileReader)
                                    $foodPic.find('img').attr('src', getFoodPicUrl(path, hwp));
                            },
                            {
                                onBefore: function($elem, $file)
                                {
                                    $foodPic.addClass('loading');
                                    previewImg($file[0], $foodPic.find('img'));
                                },
                                onAlways: function() { $foodPic.removeClass('loading'); }
                            });

                        foodDescEditor = U.createEditor('foodDescEditor');
                        $editFood.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                            activeTab = $(e.target).attr('href').slice(1);
                            $btnOK.text(activeTab == 'foodBasicInfo' ? '保存基本信息' : '保存图文详情');
                        });
                    }
                    if(!food.adsID) return;

                    //加载图文详情信息
                    C.loadData('getFoodDescription', {shopID: shopID, adsID: food.adsID})
                        .done(function(records)
                        {
                            if(!records || !records.length) return;
                            foodDescEditor.setContent(records[0].body);
                        });
                }
            });
        } else {
            //删除菜品
            var postParams = {shopID: shopID, foodID: foodID};
            Hualala.UI.Confirm({
                title: '删除菜品',
                msg: '你确定要删除该菜品吗？',
                okFn: function () {
                    G.deleteShopFood(postParams, function (rsp) {
                        if(rsp.resultcode != '000') {
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        topTip({msg: '删除成功', type: 'success'});
                        loadFoods(true);
                    });
                }
            });
        }
    }).on('click', 'tr td a', function () {
        //调用服务排完序后重新请求数据
        var $this = $(this);
        if($this.hasClass('disable')) return;
        var $tr = $this.parents('tr'),
            foodID = $tr.data('id'),
            foodCategoryID = $tr.data('cid'),
            sortIndex = $tr.data('sortindex'),
            sortParams = {shopID: shopID, foodID: foodID, sortIndex: sortIndex, foodCategoryID: foodCategoryID},
            name = $this.hasClass('sort-top') ? 'sortTop' : $this.hasClass('sort-bottom') ? 'sortBottom' : 'sortPrevOrNext',
            isUp = $this.hasClass('sort-up'),
            isDown = $this.hasClass('sort-down'),
            foodID2 = isUp ? $tr.prev().data('id') : isDown ? $tr.next().data('id') : '',
            sortIndex2 = isUp ? $tr.prev().data('sortindex') : isDown ? $tr.next().data('sortindex') : '',
            prevOrNextParams = name == 'sortPrevOrNext' ? {sortIndex2: sortIndex2, foodID2: foodID2} : {},
            serverMap = {
                sortTop: {server: 'sortFoodTop', params: sortParams},
                sortPrevOrNext: {server: 'sortFoodPrevOrNext', params: IX.inherit(prevOrNextParams, sortParams)},
                sortBottom: {server: 'sortFoodBottom', params: sortParams}
            };
        G[serverMap[name].server](serverMap[name].params, function (rsp) {
            if (rsp.resultcode != '000') {
                Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            loadFoods(true);
        });
    });

    function submitFoodBasicInfo()
    {
        if(!bv.validate().isValid()) return;
        
        var $modalBody = modalEditFood._.body,
            $foodIco = $modalBody.find('input[name=foodIco]:checked').not('[value=none]');
        if($foodIco[0]) ef[$foodIco.val()] = '1';
        
        for(var i = foodParams.length; i--;)
        {
            var param = foodParams[i];
            ef[param] = $modalBody.find('input[name=' + param + ']').filter(':checked').val();
        }
        ef.foodName = $modalBody.find('span[name=foodName]').text();
        ef.isActive = $modalBody.find('input[name=isActive]:checked').val();
        ef.minOrderCount = $modalBody.find('input[name=minOrderCount]').val();
        ef.tasteList = $.trim($modalBody.find('input[name=tasteList]').val());
        ef.makingMethodList = $.trim($modalBody.find('input[name=makingMethodList]').val());
        //调用修改菜品相关服务
        C.loadData('updateFoodBasic', ef).done(function(records)
        {
            topTip({msg: '菜品基本信息保存成功！', type: 'success'});
            if (records && records.length > 0) {
                modalEditFood._.body.find('.good-unit table tbody').empty().append($(getUnitsTpl(records[0].units)));
            }
           $.extend(food, ef);
            if(ef.imagePath) food.imgePath = ef.imagePath;
            food.foodIsActive = food.isActive;
            updateFood(food);
            $foods.empty();
            loadFoods(true);
        });
    }
    
    function submitFoodDescription()
    {
        var params = _.pick(food, 'shopID', 'foodID', 'adsID');
        params.adsID = params.adsID || '0';
        params.body = foodDescEditor.getContent();
        params.shopID = shopID;
        C.loadData('setFoodDescription', params, null, 'data').done(function(data)
        {
            topTip({msg: '菜品说明信息保存成功！', type: 'success'});
            food.adsID = data.adsID;
            updateFood(food);
            $foods.empty();
            loadFoods(true);
        });
    }
    
    $(document).off('click.foodMenu').on('click.foodMenu', function(e)
    {
        var $target = $(e.target);
        //修改菜品“保存修改”
        if($target.is('#editFood .btn-ok'))
        {
            if(activeTab == 'foodBasicInfo') submitFoodBasicInfo();
            else submitFoodDescription();
        }
        //点击某个菜品类别渲染对应菜品
        if($target.is('#foodClassBox span'))
        {
            $foodClass.removeClass('current-food-class');
            $target.addClass('current-food-class');
            foodClass = $target.data('id');
            $takeawayTag.val('');
            $foodName.val('');
            $chekbox.prop('checked', false);
            searchParams = null;
            current = 0;
            renderFoods();
        }
        if ($target.is('button[name="add-food"]')) {
            e.preventDefault();
            Hualala.Shop.CreateFood(params);
        }
    });
    //过滤筛选菜品UI
    function searchFood()
    {
        var $checked = $chekbox.filter(':checked'),
            takeawayTag = $.trim($takeawayTag.val()),
            foodID = $.trim($foodName.val());
        if(takeawayTag || foodID || $checked.length)
        {
            searchParams = {};
            if(takeawayTag) searchParams.takeawayTag = takeawayTag;
            if(foodID) searchParams.foodID = foodID;
            $checked.each(function ()
            {
                if(this.id == 'isHasImage')
                    searchParams.isHasImage = '0';
                else
                    searchParams[this.id] = '1';
            });
        }
        else
        {
            searchParams = null;
        }
        current = 0;
        renderFoods();
    }

    //在某个菜品分类下根据foodID查找某个菜品
    function findFood(cid, id)
    {
        var cfs = classifiedFoods[cid].foods; 
        for(var i = cfs.length; i--;)
        {
            if(cfs[i].foodID == id) return cfs[i];
        }
        return null;
    }
    //根据各种条件过滤菜品
    function filterFoods()
    {
        var result = [];
        if (!foodClass) {
            for(var foodCategoryID in classifiedFoods) {
                var cFoods = classifiedFoods[foodCategoryID].foods,
                    cFoodsCount = cFoods.length;
                cFoods[0] = IX.inherit({first: {topBorder: 'first', upDisabled: 'disable'}}, cFoods[0]);
                cFoods[cFoodsCount - 1] = IX.inherit({last: {BottomBorder: 'last', downDisabled: 'disable'}}, cFoods[cFoodsCount - 1]);
                result.push.apply(result, classifiedFoods[foodCategoryID].foods);
            }
        } else{
            var cFoods = classifiedFoods[foodClass].foods,
                cFoodsCount = cFoods.length;
            cFoods[0] = IX.inherit({first: {topBorder: 'first', upDisabled: 'disable'}}, cFoods[0]);
            cFoods[cFoodsCount - 1] = IX.inherit({last: {BottomBorder: 'last', downDisabled: 'disable'}}, cFoods[cFoodsCount - 1]);
            result = cFoods;
        }

        for(p in searchParams)
        {
            result = $.grep(result, function (food)
            {
                return food[p] == searchParams[p];
            });
        }
        
        return result;
    }
    //将菜品分类
    function classifyFoods(foodsData)
    {
        var result = {};
        for(i = 0, l = foodsData.length; i < l; i++)
        {
            var food = foodsData[i], cid = food.foodCategoryID;
            //根据foodCategoryID分类
            result[cid] = result[cid] || {foods: [], foodCategoryName: food.foodCategoryName};
            //某个菜品可能无foodID
            if(!food.foodID) continue;
            
            updateFood(food);
            
            food.takeoutPackagingFee = food.takeoutPackagingFee > 0 ? parseFloat(food.takeoutPackagingFee) : '';
            
            if(food.prePrice == -1 || food.prePrice == food.price)
            {
                food.prePrice = food.price;
                food.price = '';
            }
            
            if(food.vipPrice == -1 || parseFloat(food.vipPrice) >= parseFloat(food.prePrice)) food.vipPrice = '';
            
            food.price = food.price || '';
            food.prePrice = food.prePrice || '';
            food.vipPrice = food.vipPrice || '';
            
            var cfs = result[cid].foods,
                idx = C.inArray(cfs, food, 'foodID'),
                unit = {
                    unit: food.unit ? food.unit + ':' : '',
                    price: food.price ? '￥' + parseFloat(food.price) : '',
                    prePrice: food.prePrice ? '￥' + parseFloat(food.prePrice) : '',
                    vipPrice: food.vipPrice ? '￥' + parseFloat(food.vipPrice) : ''
                };
            //if(unit.prePrice == '￥NaN') console.log(food);
            if(idx == -1)
            {
                food.units = [unit];
                cfs.push(food);
            }
            else
            {//将相同foodID的菜品按照规格合并
                cfs[idx].units.push(unit);
            }
            
        }
        return result;
    }
    //更新某个菜品在表格中显示的相关属性
    function updateFood(food)
    {
        var path = food.imgePath;
        if(path)
        {
            var hwp = food.imageHWP, min = 92,
                w = hwp > 1 ? min : Math.round(min / hwp),
                h = hwp > 1 ? Math.round(min * hwp) : min;
            food.imgSrc = imgHost + path.replace(/\.\w+$/, (hwp ? '=' + w + 'x' + h : '') + '$&?quality=70');
        }
        else
            food.imgSrc = imgRoot + 'dino80.png';
        
        if(food.adsID > 0) food.adsIco = '<img class="f-ad-p" src="' + imgRoot + 'preview.png" />';
        
        food.discountIco = food.isDiscount == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
        food.takeawayIco = food.takeawayTag > 0 ? 'glyphicon-ok' : 'glyphicon-minus';
        food.activeIco = food.foodIsActive == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
    }

    function getFoodPicUrl(path, hwp)
    {
        var h = hwp ? parseInt(200 * hwp) : '',
            cfg = hwp ? {width: 200, height: h} : {};
        
        return path ? C.getSourceImage(path, cfg) : imgRoot + 'food_bg.png';
    }

    Hualala.Shop.LoadFoods = loadFoods;
    
}
//将频繁执行的代码延迟执行以提高性能
function throttle(method, context)
{
    clearTimeout(method.tId);
    method.tId = setTimeout(function()
    {
        method.call(context);
    }, 200);
}

})(jQuery, window);










