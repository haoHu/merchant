(function ($, window) {
    IX.ns('Hualala.Shop');
var G = Hualala.Global,
    U = Hualala.UI,
    C = Hualala.Common,
    topTip = U.TopTip;
// 初始化创建店铺页面
Hualala.Shop.initCreate = function ($wizard)
{
    
    //初始化向导控件
    $wizard.bootstrapWizard();
    var bsWizard = $wizard.data('bootstrapWizard'),
        $step1 = $wizard.find('#tab1'),
        $step2 = $wizard.find('#tab2'),
        $step3 = $wizard.find('#tab3'),
        $city = $step1.find('#cityID'),
        $area = $step1.find('#areaID'),
        $cuisine1 = $step1.find('#cuisineID1'),
        $cuisine2 = $step1.find('#cuisineID2'),
        bv = null,
        operationModeType = Hualala.Shop.Typedef.operationMode;
    
    U.fillSelect($step1.find('#operationMode'), operationModeType);
    // 初始化城市列表下拉框
    initCities($city);
    U.createChosen($area, [], 1, 1, { width: '100%', placeholder_text : "请先选择或输入所在城市", }, false);
    U.createChosen($cuisine1, [], 1, 1, { width: '100%', placeholder_text : "请先选择或输入所在城市", }, false);
    U.createChosen($cuisine2, [], 1, 1, { width: '100%', placeholder_text : "请先选择或输入所在城市", }, false);
    
    // 根据所选择的城市设置地标、菜系下拉列表
    $city.on('change', function ()
    {
        var cityID = $(this).val();
        if(!cityID) return;
        
        initAreas($area, cityID);
        initCuisines($cuisine1, $cuisine2, cityID);
        
    });
    // 初始化timepicker
    $step1.find('#openingHoursStart, #openingHoursEnd').timepicker({
        minuteStep: 1,
        showMeridian: false,
        disableFocus : true,
        showInputs : false
    });
    // 初始化表单验证
    $step1.bootstrapValidator(Hualala.Shop.validators);
    bv = $step1.data('bootstrapValidator');
    
    var $uploadImg = $step1.find('#uploadImg'),
        imagePath = ''; // 门头图图片路径
    $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
    // 上传门头图
    $uploadImg.find('button, img').on('click', function()
    {
        U.uploadImg({
            onSuccess: function (imgPath, $dlg)
            {
                var src = C.getSourceImage(imgPath, {width: 200, height: 200});
                imagePath = imgPath;
                $uploadImg.find('img').attr('src', src);
                $dlg.modal('hide');
            }
        });
    });
    //bsWizard.show(1);
    var dataStep1 = null, // 第一步店铺基本信息数据
        map = null, // 地图组件实例
        shopID = '',
        $searchBox = $step2.find('.map-search-box'),
        $shopSettingLink = $step3.find('#shopSettingLink');
    // 向导组件的下一步行为控制
    $wizard.find('#nextStep').on('click', function()
    {
        var $curStep = bsWizard.activePane();
        // 第一步
        if($curStep.is('#tab1'))
        {
            //$select.blur();
            if(!bv.validate().isValid()) return;
            // 数据提交前预处理
            dataStep1 = C.parseForm($step1);
            dataStep1.shopID = shopID;
            dataStep1.shopName = dataStep1.shopName.replace('（', '(').replace('）', ')');
            dataStep1.areaName = getSelectText($area);
            dataStep1.cuisineName1 = getSelectText($cuisine1);
            dataStep1.cuisineName2 = dataStep1.cuisineID2 ? getSelectText($cuisine2) : '';
            dataStep1.imagePath = imagePath;
            dataStep1.openingHours = dataStep1.openingHoursStart + '-' + dataStep1.openingHoursEnd;
            var keywords = [dataStep1.shopName, dataStep1.address, dataStep1.cuisineName1];
            dataStep1.cuisineName2 && keywords.push(dataStep1.cuisineName2);
            keywords.push(dataStep1.areaName);
            dataStep1.keywordLst = keywords.join(' | ');
            // 根据店铺是否已经产生调用不同的服务
            var callServer = shopID ? G.updateShopBaseInfo : G.createShop;
            callServer(dataStep1, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                shopID = shopID || rsp.data.records[0].shopID;
                $step3.find('h4 span').eq(1).text(dataStep1.shopName);
                $shopSettingLink.attr('href', Hualala.PageRoute.createPath('setting'));
                // 进入第二步标注地图
                bsWizard.next();
                // 地图对象必须在第二步面板显示出来后初始化
                map = Hualala.Shop.map({data: {
                    isSearchMap: true,
                    shopName: dataStep1.shopName,
                    tel: dataStep1.tel,
                    address: dataStep1.address,
                    area: dataStep1.areaName,
                    city: getSelectText($city)
                }, searchBox: $searchBox});
                
            });
            
            return;
        }
        // 第二步
        if($curStep.is('#tab2'))
        {
            var lng = map.mapPoint.lng, lat = map.mapPoint.lat,
                mapInfo = {
                    shopID: shopID,
                    mapLongitudeValue: lng,
                    mapLatitudeValue: lat,
                    mapLongitudeValueBaiDu: lng,
                    mapLatitudeValueBaiDu: lat
                };
            var callServer = G.setShopMap;
            callServer(mapInfo, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
            });
        }
        bsWizard.next();
    });
    
}
// 初始化菜系下拉列表
function initCuisines($cuisine1, $cuisine2, cityID)
{
    G.getCuisines({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        $cuisine1.siblings('.chosen-container').remove();
        U.createChosen($cuisine1.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%' }, { cuisineID: '', cuisineName: '--请选择--' }).blur().change(function(){ $(this).blur() });
        $cuisine2.siblings('.chosen-container').remove();
        U.createChosen($cuisine2.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%' }, { cuisineID: '', cuisineName: '--不限--' }).blur().change(function(){ $(this).blur() });
    });
    
}
// 初始化地标下拉列表
function initAreas($selectBox, cityID)
{
    G.getAreas({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        $selectBox.siblings('.chosen-container').remove();
        U.createChosen($selectBox.show().data('chosen', null), rsp.data.records || [], 'areaID', 'areaName', { width: '100%' }, { areaID: '', areaName: '--请选择--' })
        .blur().change(function(){ $(this).blur() });
    });
    
}
// 初始化城市下拉列表
function initCities($selectBox)
{
    G.getCities({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        U.createChosen($selectBox, rsp.data.records || [], 'cityID', 'cityName', { width: '100%' }, { cityID: '', cityName: '--请选择--' })
        .change(function(){ $(this).blur() });
    });
    
}

// 处理并获取下拉列表当前选择项的文本
function getSelectText($select)
{
    return $select.find('option:selected').text().replace(/-/g, '');
}

})(jQuery, window);










