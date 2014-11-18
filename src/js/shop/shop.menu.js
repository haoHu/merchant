(function ($, window) {
IX.ns('Hualala.Shop');

// 初始化店铺菜品页面
Hualala.Shop.initMenu = function ($container, pageType, params)
{
    if(!params) return;
    
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip;
    
    var shopID = params;
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        imgRoot = G.IMAGE_ROOT + '/';

    var classifiedFoods = null, //已分类菜品
        foodClass = '', //当菜菜品类别的 foodCategoryID
        foods = null, //当前表格显示的菜品数组
        current = 0, //页面滚动时渲染foods所在的索引
        size = 10, // 首次或者滚动加载的food数量
        searchParams = null, //菜品搜索过滤参数
        //修改菜品弹出框里几个 radio 的名称
        foodParams = ['hotTag', 'takeawayTag', 'isDiscount'],
        food = null, //当前菜品
        ef = null; //修改菜品后用于向服务器发送的数据
        
    //单个菜品模板（菜品表格中的一行）
    var foodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food')),
        //修改菜品弹出框模板
        editFoodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_food'));
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
        modalEditFood = null, 
        bv = null; //表单验证器
    //调用服务，根据 shopID 获取所有分类和菜品信息
    G.getShopMenu({shopID : shopID}, function (rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        if(!+rsp.data.records)
        {
            $container.append('<div class="alert alert-warning t-c">此店铺暂无菜品，您可以通过下载<a target="_blank">PC客户端</a>上传菜品数据。</div>').find('a').attr('href', Hualala.PageRoute.createPath('pcclient'));
            return;
        }
        classifiedFoods = classifyFoods(rsp.data.records);
        renderFoods(); //渲染所有菜品
        //渲染菜品分类
        var $foodClassBox = $menu.find('#foodClassBox').append($('<span class="current-food-class"></span>').text('全部菜品 (' + foods.length + ')'));
        
        for(var id in classifiedFoods)
        {
            var category = classifiedFoods[id]; 
            $('<span></span>').data('id', id).text(category.foodCategoryName + ' (' + category.foods.length + ')').appendTo($foodClassBox);
        }
        $foodClass = $foodClassBox.find('span');
        
        var foodNameTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food_name'));
        $foodName.html(foodNameTpl({classifiedFoods: classifiedFoods}));
        initFoodChosen();
        $menu.appendTo($container);
    });
    
    function initFoodChosen() 
    {
        var matcher = (new Pymatch([]));
        var sections = foods;
        var getMatchedFn = function (searchText) {
            matcher.setNames(_.map(sections, function (el) {
                return IX.inherit(el, {
                    name : el.foodName
                });
            }));
            var matchedSections = matcher.match(searchText);
            var matchedOptions = {};
            _.each(matchedSections, function (el, i) {
                matchedOptions[el[0].foodID] = true;
            });
            return matchedOptions;
        };
        $foodName.chosen({
            width : '200px',
            placeholder_text : "选择或输入菜品名称",
            // max_selected_options: 1,
            no_results_text : "抱歉，没有相关菜品！",
            allow_single_deselect : true,
            getMatchedFn : getMatchedFn
        }).change(function()
        {
            searchFood();
        });
    }
    
    //页面滚动时加载更多菜品
    $(window).on('scroll', function(e)
    {
        if(foods) throttle(scrollFood);
    });
    
    function scrollFood()
    {
        var viewBottom = $(window).scrollTop() + $(window).height(),
            foodsBottom = $foods.offset().top + $foods.height();
        
        if(foodsBottom < viewBottom && current < foods.length)
        {
            renderFoods();
        }
    }
    
    $(document).on('change', function(e)
    {
        var $target = $(e.target);
        //菜品过滤筛选
        if($target.is('#takeawayTag , #foodSearch input[type=checkbox]'))
        {
            searchFood();
        }
        //自定义按钮组相关
        if($target.is('.form-food input[type=radio]'))
        {
            $target.closest('div').find('label').removeClass('active')
            .find('input:checked').parent().addClass('active');
        }
        //修改菜品图片
        if($target.is('.food-pic input'))
        {
            var $foodPic = $editFood.filter('.food-pic');
            if($target.val())
            {
                $foodPic.addClass('loading');
                previewImg($target[0], $foodPic.find('img'));
                $foodPic.submit();
            }
        }
        
    });
    
    top.imgCallback = function(rsp)
    {
        var $foodPic = $editFood.filter('.food-pic');
        var json = $.parseJSON(rsp),
            status = json.status;
        if(status == 'success')
        {
            var url = json.url,
                imageHWP = json.imageHWP || '';
            ef.imagePath = url;
            if(imageHWP) ef.imageHWP = imageHWP;
            if(!FileReader)
            {
                $foodPic.find('img').attr('src', imgHost + url.replace(/\.\w+$/, (imageHWP ? '=200x' + Math.round(200 * imageHWP) : '') + '$&?quality=70'));
            }
        }
        else
        {
            topTip({msg: status + '：菜品图片上传失败'});
        }
        $foodPic.removeClass('loading');
        $('#imgResponse').remove();
    }
    
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
    
    //修改菜品
    $foods.on('click', 'tr', function()
    {
        var $this = $(this);
        food = findFood($this.data('cid'), $this.data('id'));
        //菜品图标：招、荐、新
        var foodIcos = ['isSpecialty', 'isRecommend', 'isNew'],
            path = food.imgePath;
        
        food.foodPic = path ? imgHost + path + '?quality=70' : imgRoot + 'food_bg.png';
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
        modalEditFood._.footer.find('.btn-ok').text('保存修改');
        modalEditFood._.footer.find('.btn-close').text('返回');
        //初始化表单验证
        bv = $editFood.filter('.form-food').bootstrapValidator({
            fields: {
                minOrderCount: {
                    validators: {
                        notEmpty: {
                            message: '起售份数不能为空'
                        },
                        integer: {
                            message: '起售份数必须是整数'
                        },
                        between: {
                            min: 1,
                            max: 99,
                            message: '起售份数必须在1到99之间'
                        }
                    }
                }
            }
        }).data('bootstrapValidator');
        //初始化ef
        ef = {shopID: shopID, foodID: $this.data('id')};
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
        $editFood.find('input[name=isActive][value=' + food.foodIsActive + ']').prop('checked', true).trigger('change');
    });
    
    $(document).on('click', function(e)
    {
        var $target = $(e.target);
        //修改菜品“保存修改”
        if($target.is('#editFood .btn-ok'))
        {
            if(!bv.validate().isValid()) return;
            
            var $foodIco = $editFood.find('input[name=foodIco]:checked').not('[value=none]');
            if($foodIco[0]) ef[$foodIco.val()] = '1';
            
            for(var i = foodParams.length; i--;)
            {
                var param = foodParams[i];
                ef[param] = $editFood.find('input[name=' + param + ']').filter(':checked').val();
            }
            ef.isActive = $editFood.find('input[name=isActive]:checked').val();
            ef.minOrderCount = $editFood.find('input[name=minOrderCount]').val();
            ef.tasteList = $.trim($editFood.find('input[name=tasteList]').val());
            //调用修改菜品相关服务
            G.updateFood(ef, function (rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                modalEditFood.hide();
                $.extend(food, ef);
                if(ef.imagePath) food.imgePath = ef.imagePath;
                food.foodIsActive = food.isActive;
                updateFood(food);
                $foods.empty();
                renderFoods(true);
            });
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
        //搜索过滤菜品
        /*if($target.is('#btnSearchFood'))
        {
            searchFood();
        }*/
        
    });
    
    /*$foodName.on('keydown', function(e)
    {
        e.keyCode == 13 && searchFood();
    });*/
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
    
    //渲染菜品
    function renderFoods(start)
    {
        foods = filterFoods();
        $foodCount.text(foods.length);
        if(current == 0) $foods.empty();
        $foods.append(foodTpl({foods: foods.slice(start ? 0 : current, current + size)}));
        current += size;
        //$foods.find('img').lazyload();
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
        if(!foodClass)
        {
            for(var foodCategoryID in classifiedFoods)
            {
                result.push.apply(result, classifiedFoods[foodCategoryID].foods);
            }
        }
        else
        {
            result = classifiedFoods[foodClass].foods;
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
            if(food.vipPrice == -1 || food.vipPrice >= food.prePrice)
            {
                food.vipPrice = '';
            }
            food.price = food.price || '';
            food.prePrice = food.prePrice || '';
            food.vipPrice = food.vipPrice || '';
            
            var cfs = result[cid].foods,
                unit = {
                    unit: food.unit ? food.unit + ':' : '',
                    price: food.price ? '￥' + parseFloat(food.price) : '',
                    prePrice: food.prePrice ? '￥' + parseFloat(food.prePrice) : '',
                    vipPrice: food.vipPrice ? '￥' + parseFloat(food.vipPrice) : ''
                },
                idx = inAarry(cfs, food, 'foodID');
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
        
        food.discountIco = food.isDiscount == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
        food.takeawayIco = food.takeawayTag > 0 ? 'glyphicon-ok' : 'glyphicon-minus';
        food.activeIco = food.foodIsActive == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
    }
    
    //根据对象的一个属性检查某个对象是否在一个对象数组中
    function inAarry(arr, obj, key)
    {
        for(var i = 0, l = arr.length; i < l; i++)
        {
            if(arr[i][key] == obj[key]) return i;
        }
        return -1;
    }
    
}
//将频繁执行的代码延迟执行以提高性能
function throttle(method, context)
{
    clearTimeout(method.tId);
    method.tId = setTimeout(function()
    {
        method.call(context);
    }, 100);
}

})(jQuery, window);










