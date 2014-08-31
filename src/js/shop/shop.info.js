(function ($, window) {
IX.ns('Hualala.Shop');
var G = Hualala.Global,
    U = Hualala.UI,
    topTip = U.TopTip; 
// 初始化店铺店铺详情页面
Hualala.Shop.initInfo = function ($container, pageType, params)
{
    if(!params) return;
    
    var shopID = params,
        shopInfo = null,
        $form = null,
        $city = null,
        $area = null,
        $cuisine1 = null,
        $cuisine2 = null;
    
    G.getShopInfo({shopID : shopID}, function (rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip(rsp.resultmsg, 'danger');
            return;
        }
        shopInfo = rsp.data.records[0];
        var openTime = shopInfo.openingHours.split('-');
        shopInfo.openingHoursStart = openTime[0];
        shopInfo.openingHoursEnd = openTime[1];
        shopInfo.operationModeName = shopInfo.operationMode == '1' ? '快餐' : '正餐';
        
        var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_info'));
        $form = $(tpl(shopInfo)).appendTo($container);
        $city = $form.find('#cityID'),
        $area = $form.find('#areaID'),
        $cuisine1 = $form.find('#cuisineID1'),
        $cuisine2 = $form.find('#cuisineID2');
        
        // 初始化城市列表下拉框
        $city.on('change', function (e, areaID, cuisineID1, cuisineID2)
        {
            var cityID = $(this).val();
            if(!cityID) return;
            
            initAreas($area, cityID, areaID);
            initCuisines($cuisine1, $cuisine2, cityID, cuisineID1, cuisineID2);
            
        });
        initCities($city, shopInfo);
        // 根据所选择的城市设置地标、菜系下拉列表
        
        // 初始化timepicker
        $form.find('#openingHoursStart, #openingHoursEnd').timepicker({
            minuteStep: 1,
            showMeridian: false,
            //disableFocus : true,
            showInputs : false
        });
        // 初始化表单验证
        $form.bootstrapValidator({
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
                            min: 6,
                            max: 100,
                            message: '地址长度必须在6到100个字符之间'
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
        
        var $uploadImg = $form.find('#uploadImg'),
            imagePath = ''; // 门头图图片路径
        // 上传门头图
        $uploadImg.find('button, img').on('click', function()
        {
            U.uploadImg({
                onSuccess: function (imgPath, $dlg)
                {
                    var src = 'http://res.hualala.com/' + imgPath;
                    imagePath = imgPath;
                    $uploadImg.find('img').attr('src', src);
                    $dlg.modal('hide');
                }
            });
        });
    });
        
    $container.on('click', function(e)
    {
        var $target = $(e.target);
        if($target.is('#editBtn'))
        {
            $form.removeClass('read-mode').addClass('edit-mode');
        }
        
        if($target.is('#saveBtn'))
        {
            $form.removeClass('edit-mode').addClass('read-mode');
        }
    });
    
    /*  
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
                    rsp.resultmsg && topTip(rsp.resultmsg, 'danger');
                    return;
                }
                shopID = shopID || rsp.data.records[0].shopID;
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
                    rsp.resultmsg && topTip(rsp.resultmsg, 'danger');
                    return;
                }
            });
        }
        bsWizard.next();
    });*/
    
}
// 初始化菜系下拉列表
function initCuisines($cuisine1, $cuisine2, cityID, cuisineID1, cuisineID2)
{
    var callServer = G.getCuisines;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip(rsp.resultmsg, 'danger');
            return;
        }
        
        fillSelectBox($cuisine1, rsp.data.records, 'cuisineID', 'cuisineName');
        fillSelectBox($cuisine2, rsp.data.records, 'cuisineID', 'cuisineName', '--不限--');
        cuisineID1 && $cuisine1.val(cuisineID1);
        cuisineID2 && $cuisine2.val(cuisineID2);
    });
    
}
// 初始化地标下拉列表
function initAreas($area, cityID, areaID)
{
    var callServer = G.getAreas;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip(rsp.resultmsg, 'danger');
            return;
        }
        
        fillSelectBox($area, rsp.data.records, 'areaID', 'areaName');
        areaID && $area.val(areaID);
    });
    
}
// 初始化城市下拉列表
function initCities($city, shopInfo)
{
    var callServer = G.getCities;
    callServer({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip(rsp.resultmsg, 'danger');
            return;
        }
        
        fillSelectBox($city, rsp.data.records, 'cityID', 'cityName');
        $city.val(shopInfo.cityID).trigger('change', [shopInfo.areaID, shopInfo.cuisineID1, shopInfo.cuisineID2]);
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










