(function ($, window) {
IX.ns('Hualala.Shop');

// 初始化店铺店铺菜品页面
Hualala.Shop.initMenu = function ($container, pageType, params)
{
    if(!params) return;
    
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip,
        parseForm = Hualala.Common.parseForm;
    
    var shopID = params;
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        imgRoot = G.IMAGE_ROOT + '/';

    var classifiedFoods = null, //已分类菜品
        foodClass = '', //当菜菜品类别的 foodCategoryID
        foods = null, //当前表格显示的菜品数组
        searchParams = null, //菜品搜索过滤参数
        //修改菜品弹出框里几个 radio 的名称
        foodParams = ['hotTag', 'takeawayTag', 'isDiscount'],
        food = null, // 当前菜品
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
        $menu.appendTo($container);
    });
    
    $(document).on('change', function(e)
    {
        var $target = $(e.target);
        //自定义按钮组相关
        if($target.is('.form-food input[type=radio]'))
        {
            $target.closest('div').find('label').removeClass('active')
            .find('input:checked').parent().addClass('active');
        }
        //修改菜品图片
        if($target.is('.food-pic input'))
        {
            var $foodPic = $('.food-pic');
            if($target.val())
            {
                $foodPic.addClass('loading');
                previewImg($target[0], $foodPic.find('img'));
                $foodPic.submit();
                setTimeout(function()
                {
                    $foodPic.removeClass('loading');
                }, 5000);
            }
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
                food.foodIsActive = food.isActive;
                updateFood(food);
                renderFoods();
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
            renderFoods();
        }
        //搜索过滤菜品
        if($target.is('#btnSearchFood'))
        {
            var $checked = $chekbox.filter(':checked'),
                takeawayTag = $.trim($takeawayTag.val()),
                foodName = $.trim($foodName.val());
            if(takeawayTag || foodName || $checked.length)
            {
                searchParams = {};
                if(takeawayTag) searchParams.takeawayTag = takeawayTag;
                if(foodName) searchParams.foodName = foodName;
                $checked.each(function ()
                {
                    if(this.id == 'isHasImage')
                        searchParams.isHasImage = '0';
                    else
                        searchParams[this.id] = '1';
                });
                renderFoods();
            }
        }
        
    });
    //渲染菜品
    function renderFoods()
    {
        foods = filterFoods();
        $foodCount.text(foods.length);
        $foods.html(foodTpl({foods: foods}));
        $foods.find('img').lazyload();
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
                return p == 'foodName' ? food[p].indexOf(searchParams[p]) > -1 : food[p] == searchParams[p];
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
            food.imgSrc = imgHost + path.replace(/\.\w+$/, '=' + h + 'x' + w + '$&' + '?quality=70');
        }
        else
            food.imgSrc = imgRoot + 'dino80.png';
        
        food.discountIco = food.isDiscount == 1 ? 'ico-ok' : 'ico-no';
        food.takeawayIco = food.takeawayTag > 0 ? 'ico-ok' : 'ico-no';
        food.activeIco = food.foodIsActive == 1 ? 'ico-ok' : 'ico-no';
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

})(jQuery, window);










