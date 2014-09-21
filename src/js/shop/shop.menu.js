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

    var classifiedFoods = null,
        foodClass = '',
        foods = null,
        searchParams = null;
    
    var foodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food'));
    var $menu = $(Hualala.TplLib.get('tpl_shop_menu')),
        $foodClass = null,
        $foodSearch = $menu.find('#foodSearch'),
        $takeawayTag = $foodSearch.find('#takeawayTag'),
        $foodName = $foodSearch.find('#foodName'),
        $chekbox = $foodSearch.find('input[type=checkbox]'),
        $tblHead = $menu.find('.tbl-foods thead'),
        $foodCount = $menu.find('#foodSearchInfo span'),
        $foods = $menu.find('.tbl-foods tbody');
    
    G.getShopMenu({shopID : shopID}, function (rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        classifiedFoods = classifyFoods(rsp.data.records);
        renderFoods(); console.log(foods);
        var $foodClassBox = $menu.find('#foodClassBox').append($('<span class="current-food-class"></span>').text('全部菜品 (' + foods.length + ')'));
        
        for(var id in classifiedFoods)
        {
            var category = classifiedFoods[id]; 
            $('<span></span>').data('id', id).text(category.foodCategoryName + ' (' + category.foods.length + ')').appendTo($foodClassBox);
        }
        $foodClass = $foodClassBox.find('span');
        $menu.appendTo($container);
    });
    
    $menu.on('click', function(e)
    {
        var $target = $(e.target);
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
                //console.log(searchParams);
                renderFoods();
            }
        }
    });
    
    function renderFoods()
    {
        foods = filterFoods();
        $foodCount.text(foods.length);
        $foods.html(foodTpl({foods: foods}));
        $foods.find('img').lazyload();
    }
    
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










