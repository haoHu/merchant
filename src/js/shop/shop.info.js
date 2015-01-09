(function ($, window) {
IX.ns('Hualala.Shop');
var G = Hualala.Global,
    U = Hualala.UI,
    S = Hualala.Shop,
    topTip = U.TopTip,
    parseForm = Hualala.Common.parseForm;
// 初始化店铺店铺详情页面
S.initInfo = function ($container, pageType, params)
{
    if(!params) return;
    // 渲染店铺功能导航
    var $shopFuncNav = S.createShopFuncNav(pageType, params, $container);
    
    var shopID = params, shopInfo = null,
        $form = null, $city = null, $area = null, 
        $cuisine1 = null, $cuisine2 = null,
        imagePath = '', $img = null,
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        bv = null, map = null;
    
    G.getShopInfo({shopID : shopID}, function (rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        shopInfo = rsp.data.records[0];
        
        // 渲染店铺详情头部
        S.createShopInfoHead(shopInfo, $container, function($shopInfoHead)
        {
            $shopFuncNav.before($shopInfoHead);
        });
        
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
            disableFocus : true,
            showInputs : false
        });
        // 初始化表单验证
        $form.bootstrapValidator({
            excluded: ':disabled',
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
        }).on('submit', function(){ return false });
        bv = $form.data('bootstrapValidator');
        
        var $uploadImg = $form.find('#uploadImg');
        $img = $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
        imagePath = shopInfo.imagePath;
        imagePath && $img.attr('src', imgHost + imagePath + '?quality=70');

        map = S.map({data: {
            isSearchMap: false,
            shopName: shopInfo.shopName,
            tel: shopInfo.tel,
            address: shopInfo.address,
            area: shopInfo.areaName,
            city: shopInfo.cityName,
            lng: shopInfo.mapLongitudeValueBaiDu,
            lat: shopInfo.mapLatitudeValueBaiDu
        }});
        
    });
    // click 事件 delegate
    $container.on('click', function(e)
    {
        var $target = $(e.target);
        // 修改门头图
        if($target.is('.edit-mode #uploadImg img, .edit-mode #uploadImg a'))
        {
            U.uploadImg({
                onSuccess: function (imgPath, $dlg)
                {
                    imagePath = imgPath;
                    $img.attr('src', imgHost + imgPath);
                    $dlg.modal('hide');
                }
            });
        }
        // 重新标记地图
        if($target.is('#remarkMap'))
        {
            if(bv.isValidField('shopName') && bv.isValidField('tel') && bv.isValidField('address'))
            {
                var coords = map.mapPoint,
                    formData = parseForm($form); console.log(formData);
                map = S.map({data: {
                    isSearchMap: false,
                    shopName: formData.shopName,
                    tel: formData.tel,
                    address: formData.address,
                    area: getSelectText($area),
                    city: getSelectText($city),
                    lng: coords.lng,
                    lat: coords.lat
                }});
                
                var mapInfo = {
                        shopID: shopID,
                        mapLongitudeValue: coords.lng,
                        mapLatitudeValue: coords.lat,
                        mapLongitudeValueBaiDu: coords.lng,
                        mapLatitudeValueBaiDu: coords.lat
                    };
                // 标注店铺地图callServer调用
                G.setShopMap(mapInfo, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    topTip({msg: '重新标记地图成功！', type: 'success'});
                    
                });
                
            }
            else
            {
                topTip({msg: '店铺相关信息填写有误！', type: 'danger'});
            }
            
        }
        // 切换为编辑模式
        if($target.is('#editBtn'))
        {
            $form.removeClass('read-mode').addClass('edit-mode');
        }
        // 保存店铺基本信息修改
        if($target.is('#saveBtn'))
        {
            if(!bv.validate().isValid()) return;
            // 数据提交前预处理
            var shopData = parseForm($form);
            shopData.shopID = shopID;
            shopData.shopName = shopData.shopName.replace('（', '(').replace('）', ')');
            shopData.areaName = getSelectText($area);
            shopData.cuisineName1 = getSelectText($cuisine1);
            shopData.cuisineName2 = shopData.cuisineID2 ? getSelectText($cuisine2) : '';
            shopData.imagePath = imagePath;
            shopData.openingHours = shopData.openingHoursStart + '-' + shopData.openingHoursEnd;
            var keywords = [shopData.shopName, shopData.address, shopData.cuisineName1];
            shopData.cuisineName2 && keywords.push(shopData.cuisineName2);
            keywords.push(shopData.areaName);
            shopData.keywordLst = keywords.join(' | ');
            // 保存店铺基本信息callServer调用
            G.updateShopBaseInfo(shopData, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                $form.removeClass('edit-mode').addClass('read-mode');
                topTip({msg: '保存成功！', type: 'success'});
                updateReadMode($form, shopData);
            });
        }
    });
    
}
// 保存提交后更新店铺信息只读模式
function updateReadMode($form, data)
{
    $form.find('input, select').not('.map-keyword, #openingHoursEnd').each(function ()
    {
        var $this = $(this),
            $p = $this.siblings('p');
        if($this.is('#openingHoursStart'))
            $p.text(data.openingHours);
        else if($this.is('select'))
            $p.text(getSelectText($this));
        else
            $p.text($this.val());
    });
}
// 初始化菜系下拉列表
function initCuisines($cuisine1, $cuisine2, cityID, cuisineID1, cuisineID2)
{
    var callServer = G.getCuisines;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        $cuisine1.siblings('.chosen-container').remove();
        U.createChosen($cuisine1.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%', placeholder_text : '请选择或输入菜系1' }, false, cuisineID1 || '')
        .blur().change(function(){ $(this).blur() });
        
        $cuisine2.siblings('.chosen-container').remove();
        U.createChosen($cuisine2.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%', placeholder_text : '请选择或输入菜系2' }, { cuisineID: '', cuisineName: '--不限--' }, cuisineID2 || '')
        .blur().change(function(){ $(this).blur() });
    });
    
}
// 初始化地标下拉列表
function initAreas($area, cityID, areaID)
{
    G.getAreas({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        $area.siblings('.chosen-container').remove();
        U.createChosen($area.show().data('chosen', null), rsp.data.records || [], 'areaID', 'areaName', { width: '100%', placeholder_text : '请选择或输入地标' }, false, areaID || '')
        .blur().change(function(){ $(this).blur() });
    });
    
}

// 初始化城市下拉列表
function initCities($city, shopInfo)
{
    G.getCities({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        U.createChosen($city, rsp.data.records || [], 'cityID', 'cityName', { width: '100%', placeholder_text : '请选择或输入所在城市' }, false, shopInfo.cityID)
        .trigger('change', [shopInfo.areaID, shopInfo.cuisineID1, shopInfo.cuisineID2])
        .change(function(){ $(this).blur() });
    });
    
}

// 处理并获取下拉列表当前选择项的文本
function getSelectText($select)
{
    return $select.find('option:selected').text().replace(/-/g, '');
}

})(jQuery, window);










