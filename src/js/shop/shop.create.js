(function ($, window) {
IX.ns('Hualala.Shop');
var G = Hualala.Global,
    U = Hualala.UI,
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
        $cuisine2 = $step1.find('#cuisineID2');
    // 初始化城市列表下拉框
    initCities($city);
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
    $step1.bootstrapValidator({
        fields: {
            shopName: {
                message: '店铺名无效',
                validators: {
                    notEmpty: {
                        message: '店铺名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 100,
                        message: '店铺名长度必须在2到100个字符之间'
                    }
                }
            },
            cityID: {
                validators: { notEmpty: { message: '请选择店铺所在城市' } }
            },
            tel: {
                validators: {
                    notEmpty: { message: '店铺电话不能为空' },
                    telOrMobile: { message: '' }
                }
            },
            address: {
                validators: {
                    notEmpty: { message: '店铺地址不能为空' },
                    stringLength: {
                        min: 1,
                        max: 80,
                        message: '店铺地址不能超过80个字符'
                    }
                }
            },
            PCCL: {
                validators: {
                    notEmpty: { message: '人均消费不能为空' },
                    numeric: { message: '人均消费必须是金额数字' }
                }
            },
            operationMode: {
                validators: {
                    notEmpty: { message: '请选择店铺运营模式' }
                }
            },
            openingHoursStart: {
                validators: {
                    notEmpty: { message: '每天营业开始时间不能空' },
                    time: { message: '' }
                }
            },
            openingHoursEnd: {
                validators: {
                    notEmpty: { message: '每天营业结束时间不能空' },
                    time: {
                        message: '',
                        startTimeField: 'openingHoursStart'
                    }
                }
            },
            areaID: {
                validators: {
                    notEmpty: { message: '请选择店铺所在地标' }
                }
            },
            cuisineID1: {
                validators: {
                    notEmpty: { message: '请选择菜系1' }
                }
            }
        }
    });
    
    var $uploadImg = $step1.find('#uploadImg'),
        imagePath = ''; // 门头图图片路径
    $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
    // 上传门头图
    $uploadImg.find('button, img').on('click', function()
    {
        U.uploadImg({
            onSuccess: function (imgPath, $dlg)
            {
                var src = G.IMAGE_RESOURCE_DOMAIN + '/' + imgPath;
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
            if(!$step1.data('bootstrapValidator').validate().isValid()) return;
            // 数据提交前预处理
            dataStep1 = Hualala.Common.parseForm($step1);
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
                    address: dataStep1.address
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
    var callServer = G.getCuisines;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($cuisine1, rsp.data.records, 'cuisineID', 'cuisineName');
        fillSelectBox($cuisine2, rsp.data.records, 'cuisineID', 'cuisineName', '--不限--');
        $cuisine1.blur(); $cuisine2.blur();
    });
    
}
// 初始化地标下拉列表
function initAreas($selectBox, cityID)
{
    var callServer = G.getAreas;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($selectBox, rsp.data.records, 'areaID', 'areaName');
        $selectBox.blur();
    });
    
}
// 初始化城市下拉列表
function initCities($selectBox)
{
    var callServer = G.getCities;
    callServer({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($selectBox, rsp.data.records, 'cityID', 'cityName');
    });
    
}
// 设置下拉列表的项
function fillSelectBox($selectBox, data, key, value, initialValue)
{
    var optionsHtml = '<option value="">' + 
                      (initialValue || '--请选择--') + 
                      '</option>';
    $.each(data, function (i, o)
    {
        optionsHtml += '<option value="' + 
                       o[key] + '">' + 
                       o[value] + 
                       '</option>';
    });
        
    $selectBox.empty().html(optionsHtml);
}
// 处理并获取下拉列表当前选择项的文本
function getSelectText($select)
{
    return $select.find('option:selected').text().replace(/-/g, '');
}

})(jQuery, window);










