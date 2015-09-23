(function(window, $) {
    IX.ns('Hualala.Shop');
    IX.ns('Hualala.TypeDef');
    Hualala.Shop.initSaasParams = function($container, shopID) {
        var G = Hualala.Global,
            C = Hualala.Common,
            U = Hualala.UI,
            tplLib = Hualala.TplLib,
            topTip = U.TopTip;
        var paramsTypeDef = Hualala.TypeDef.ShopSaasParams,
            layoutTpl = Handlebars.compile(tplLib.get('tpl_saas_params_layout')),
            shopParamsTpl = Handlebars.compile(tplLib.get('tpl_saas_params')),
            saasDeviceTpl = Handlebars.compile(tplLib.get('tpl_cmpx_datagrid')),
            saasDeviceEditTpl = Handlebars.compile(tplLib.get('tpl_saas_device_form')),
            customSelectTpl = Handlebars.compile(tplLib.get('tpl_select')),
            checkboxListTpl = Handlebars.compile(tplLib.get('tpl_checkbox_list')),
            screenImageUrls = [],
            logoImgUrl = '';
        Handlebars.registerPartial('customSelect', tplLib.get('tpl_select'));
        Handlebars.registerPartial('colBtns', tplLib.get('tpl_base_grid_colbtns'));
        Handlebars.registerHelper('chkColType', function (conditional, options) {
            return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
        });
        var $shopParams, $deviceParams, $shopForm, $deviceForm, $switches, deviceEditModal,
            deviceFormBv,
            shopParams, deviceParams, printers = null, tableAreas = null, foodCategories = null,
            deviceParamsTableHeads = [
                {
                    clz : '',
                    cols : [
                        {clz : '', label : '设备名称', colspan : '', rowspan : '2'},
                        {clz : '', label : '设备编号', colspan : '', rowspan : '2'},
                        {clz : '', label : '站点说明', colspan : '', rowspan : '2'},
                        {clz : '', label : '账单打印机', colspan : '', rowspan : '2'},
                        {clz : '', label : '当前版本号', colspan : '', rowspan : '3'},
                        {clz : '', label : '运行环境', colspan : '4', rowspan : ''},
                        {clz : '', label : '操作', colspan : '', rowspan : '2'},
                    ]
                },
                {
                    clz : '',
                    cols : [
                        {clz : '', label : '操作系统', colspan : '', rowspan : ''},
                        {clz : '', label : 'cpu频率', colspan : '', rowspan : ''},
                        {clz : '', label : '内存大小', colspan : '', rowspan : ''},
                        {clz : '', label : '屏幕分辨率', colspan : '', rowspan : ''}
                    ]
                }
            ];
        renderSaasParamsLayout();

        loadSaasParams();

        bindParamsSet();

        function renderSaasParamsLayout() {
            $container.append(layoutTpl());
            $shopParams = $container.find('#saas_params');
            $deviceParams = $container.find('#device_params');
        }

        function loadSaasParams() {
            G.getSaasShopParams({shopID: shopID}, function (rsp) {
                if(rsp.resultcode != '000'){
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                shopParams = rsp.data;
                logoImgUrl = shopParams.CheckoutBillPrnLogoPath;
                var PCScreenImageUrls = _.compact((shopParams.PCScreeen2ADImageLst || '').split(','));
                shopParams.PCScreenImageLst = _.map(PCScreenImageUrls, function(url) {
                    var path = url.substr(G.IMAGE_RESOURCE_DOMAIN.length + 1),//只需要图片的相对路径
                        imgHWP = 0.75,//规定web端显示图片的宽高尺寸比例为4:3
                        width = 120,//规定web端显示的图片宽度为120px
                        height = parseInt(width*imgHWP);
                    return C.getSourceImage(path, {width: width, height: height});
                });
                screenImageUrls = IX.clone(PCScreenImageUrls);
                shopParams.hidden = shopParams.PCScreenImageLst.length >= 5 ? 'hidden' : '';
                $shopForm = $(shopParamsTpl(mapShopParamsData(IX.clone(shopParams))));
                $shopParams.append($shopForm);
                renderPrinters($shopParams.find('div[name="printers"]'), $XP(shopParams, 'PrinterKey', ''), 'PrinterKey');
                createSwitch();
                registerShopParams();
                bindLogoUpload();
                bindScreenUpload();
            });
            G.getSaasDeviceParams({shopID: shopID}, function (rsp) {
                if(rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                deviceParams = rsp.data.records;
                $deviceParams.append($(saasDeviceTpl(mapDeviceParamsData(IX.clone(deviceParams)))));
            });
        }

        function renderPrinters($printers, selectPriterKey, selectName) {
            C.loadData('getShopPrinter', {shopID: shopID}, printers).done(function (records) {
                printers = records;
                var printerSelectData = {
                    defaultOption: {name: '不打印', value: ''},
                    options: _.map(IX.clone(printers),
                        function(printer) {
                            var name = $XP(printer, 'printerName',
                                val = $XP(printer, 'printerKey', ''));
                            return {value: val, name: name, selected: val == selectPriterKey ? 'selected' : ''};
                        }),
                    name: selectName
                };
                $printers.append($(customSelectTpl(printerSelectData)));
            });
        }

        function registerShopParams() {
            $shopForm.bootstrapValidator({
                fields: {
                    FoodMakeManageQueueCount: {
                        validators: {
                            notEmpty: {message: '账单数不能为空'},
                            between: {message: '必须是6-18之间的值', min: 6, max: 18},
                            integer: {message: '必须是整数'}
                        }
                    },
                    FoodMakeWarningTimeout: {
                        validators: {
                            notEmpty: {message: '警告时间不能为空'},
                            greaterThan: {message: '必须是大于等于30的值', inclusive: true, value: 30},
                            numeric: {message: '必须是数值'}
                        }
                    },
                    FoodMakeDangerTimeout: {
                        validators: {
                            notEmpty: {message: '严重超时时间不能为空'},
                            numeric: {message: '必须是数值'}
                        }
                    }
                }
            });
        }

        function bindLogoUpload() {
            var $fileUpload = $shopForm.find('.shop-params-logo'),
                $uploadLogo = $fileUpload.find('label.btn-link'),
                $logoImg = $fileUpload.find('img'),
                imgSrc = $logoImg.attr('src');
            U.fileUpload($uploadLogo,
                function(rsp){
                    var path = rsp.url;
                    logoImgUrl = G.IMAGE_RESOURCE_DOMAIN + '/' + path;
                    $logoImg.attr('src', logoImgUrl);
                },
                {
                    container: '.shop-params-logo',
                    accept: 'image/bmp',
                    onBefore: function($elem, $file) {
                        imgSrc = $logoImg.attr('src');
                        var fileSize = $file[0].files[0].size / 1024; //files里保存的图片单位是字节
                        if(fileSize > 8) {
                            topTip({msg: '图片不能超过8K', type: 'danger'});
                            return false;
                        }
                        $fileUpload.addClass('loading');
                    },
                    onFail: function() {
                        if(window.FileReader) $logoImg.attr('src', imgSrc);
                    },
                    onAlways: function() {
                        $fileUpload.removeClass('loading');
                    }
                }
            );
        }

        function bindScreenUpload() {
            var $fileUpload = $shopForm.find('.shop-params-images'),
                $uploadImage = $fileUpload.find('label.btn-link'),
                $uploadRes = $uploadImage.parents('.add-sub-res');
            U.fileUpload($uploadImage,
                function (rsp) {
                    var path = rsp.url,
                        imgUrl = G.IMAGE_RESOURCE_DOMAIN + '/' + path,
                        src = path ? C.getSourceImage(path, {width: 120, height: parseInt(120*0.75)}) : '',//图片显示的宽高比例为4:3
                        $imgDiv = $('<div class="col-md-2 image-list">'+
                            '<img src="' + src+ '" alt=""  width="120px"/>'+
                            '<button class="glyphicon glyphicon-remove"></button>'+
                            '</div>');
                    if(path) {
                        screenImageUrls.push(imgUrl);
                        $uploadRes.before($imgDiv);
                    }
                    if(screenImageUrls.length >= 5) $uploadRes.addClass('hidden');
                },
                {
                    container: '.shop-params-images',
                    accept: 'image/jpeg,image/png,image/jpg',
                    onBefore: function ($elem, $file) {
                        $fileUpload.addClass('loading');
                    },
                    onFail: function () {
                    },
                    onAlways: function () {
                        $fileUpload.removeClass('loading');
                    }
                }
            );
        }

        function registerDeviceForm() {
            $deviceForm.bootstrapValidator({
                fields: {
                    deviceCode: {
                        validators: {
                            notEmpty: {message: '站点编号不能为空'},
                            stringLength: {min: 1, max: 20, message: '站点编号不能超过20个字符'}
                        }
                    }
                }
            });
            deviceFormBv = $deviceForm.data('bootstrapValidator');
        }

        function bindParamsSet() {
            var bindDeviceModal = function(deviceData, $editDevice) {
                deviceEditModal._.footer.on('click', 'button.btn-ok', function () {
                    if(!deviceFormBv.validate().isValid()) return;
                    var deviceFormData = C.parseForm($deviceForm);
                    deviceFormData.deviceRemark = C.encodeTextEnter(deviceFormData.deviceRemark);
                    var postParams = IX.inherit({shopID: shopID, deviceKey: deviceData.deviceKey}, deviceFormData);
                    G.updateSaasDeviceParams(postParams, function (rsp) {
                        if(rsp.resultcode != '000'){
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        topTip({msg: '保存成功', type: 'success'});
                        deviceEditModal.hide();
                        var $editDeviceTds = $editDevice.find('td');
                        //表格的数据需要更新
                        $editDeviceTds.eq(1).find('p').text(postParams.deviceCode);
                        $editDeviceTds.eq(2).find('p').text(C.decodeTextEnter(postParams.deviceRemark));
                        $editDeviceTds.eq(3).find('p').data('value', postParams.printerKey).text($XP(_.findWhere(printers, {printerKey: postParams.printerKey}), 'printerName', ''));
                        //修改的device的数据需要更新
                        deviceData.deviceCode = postParams.deviceCode;
                        deviceData.deviceRemark = postParams.deviceRemark;
                        deviceData.printerKey = postParams.printerKey;
                        deviceData.siteBizModel = postParams.siteBizModel;
                    });
                });
            };

            $shopParams.on('click', 'form .step-action button', function (e) {
                e.preventDefault();
                var $this = $(this),
                    isSave = $this.attr('id').indexOf('save') != -1;
                var $checkedKitchenList = $shopForm.find('div[name="kitchenPrintBillTypeLst"]').find('input:checked');
                if(isSave) {
                    $this.prop('disabled', true);
                    var formParams = C.parseForm($shopForm),
                        kitchenParams = parseKitchenPrintBillLst($checkedKitchenList),
                        switchParams = parseSwitch(),
                        postParams = _.omit(
                            IX.inherit({shopID: shopID}, formParams, kitchenParams, switchParams),
                            _.map($checkedKitchenList, function(input){return $(input).attr('name');})
                        );
                    if(!$shopForm.data('bootstrapValidator').validate().isValid()) {
                        $this.prop('disabled', false);
                        return;
                    }
                    if(parseInt(formParams.FoodMakeDangerTimeout) < parseInt(formParams.FoodMakeWarningTimeout)) {
                        topTip({msg: '严重超时时间不能小于警告超时时间', type: 'danger'});
                        $this.prop('disabled', false);
                        return;
                    }
                    postParams.CheckoutBillBottomAddStr = C.encodeTextEnter(postParams.CheckoutBillBottomAddStr);
                    postParams.CheckoutBillTopAddStr = C.encodeTextEnter(postParams.CheckoutBillTopAddStr);
                    postParams.CheckoutBillPrnLogoPath = logoImgUrl;
                    postParams.PCScreeen2ADImageLst = screenImageUrls.join(',');
                    G.updateSaasShopParams(postParams, function (rsp) {
                        if(rsp.resultcode != '000'){
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            $this.prop('disabled', false);
                            return;
                        }
                        $shopForm.removeClass('edit-mode').addClass('read-mode');
                        $switches.bootstrapSwitch('toggleDisabled', true);
                        _.each($shopForm.find('.form-control-static'), function(p){
                            var $staticText = $(p),
                                staticText = '',
                                $editP = $staticText.next(),
                                editTagName = $editP.prop('tagName').toLowerCase();
                            switch (editTagName) {
                                case 'select':
                                    staticText = $editP.find('option:selected').text();
                                    staticText = staticText == '请选择' ? '无' : staticText;
                                     break;
                                case 'div':
                                    var editPName = $editP.attr('name');
                                    if(editPName == 'printers') {
                                        staticText = $editP.find('select option:selected').text();
                                    } else if(editPName == 'kitchenPrintBillTypeLst') {
                                        staticText = _.map($editP.find('label input:checked'), function (input) {
                                            return $(input).parent().text().replace(/ /g, '');
                                        });
                                    }
                                    break;
                                case 'textarea':
                                    staticText = $editP.val();
                                    break;
                                case 'input' :
                                    var unitMap = {
                                        FoodMakeManageQueueCount: '单',
                                        FoodMakeWarningTimeout: '秒',
                                        FoodMakeDangerTimeout: '秒',
                                        FoodCallTakeTVTitle: ''
                                    };
                                    staticText = $editP.val() + $XP(unitMap, $editP.attr('name'), '');
                                    break;
                            }
                            $staticText.text(staticText);
                        });
                        $this.prop('disabled', false);
                        $this.toggleClass('hidden');
                        $this.prev('button').toggleClass('hidden');
                        topTip({msg: '保存成功', type: 'success'});
                    });
                } else {
                    $this.toggleClass('hidden');
                    $this.next('button').toggleClass('hidden');
                    $shopForm.removeClass('read-mode').addClass('edit-mode');
                    $switches.bootstrapSwitch('toggleDisabled', false);
                }
            }).on('click', '.shop-params-images .image-list .glyphicon-remove', function() {
                //绑定删除副屏广告轮播图事件
                var $this = $(this),
                    $img = $this.prev('img'),
                    $imgDiv = $img.parents('.image-list');
                U.Confirm({
                    title: '删除副屏广告轮播图',
                    msg: '你确定要删除该图片吗？',
                    okFn: function() {
                        screenImageUrls = _.reject(screenImageUrls, function (url) {
                            var path = url.substr(G.IMAGE_RESOURCE_DOMAIN.length + 1);
                            return $img.attr('src').indexOf(path.substr(0, path.length - 4)) > -1;
                        });
                        if(screenImageUrls.length < 5) $imgDiv.next().removeClass('hidden');
                        $imgDiv.remove();
                    }
                });
            });
            $deviceParams.on('click', 'table tr td a[data-type="editShopParams"]', function () {
                var $this = $(this),
                    $editDevice = $this.parents('tr'),
                    deviceKey = $this.data('key') + '',
                    deviceData = _.findWhere(deviceParams, {deviceKey: deviceKey}),
                    siteBizModelSelect = renderSelect(paramsTypeDef.siteBizModelTypes, 'siteBizModel', $XP(deviceData, 'siteBizModel', '0'));

                deviceData.deviceRemark = C.decodeTextEnter(deviceData.deviceRemark);

                $deviceForm = $(saasDeviceEditTpl(IX.inherit(deviceData, {siteBizModelData: siteBizModelSelect})));

                deviceEditModal = U.ModalDialog({
                        title: '修改站点参数',
                        html: $deviceForm,
                        hideCloseBtn: false,
                        backdrop: 'static'
                    }).show();

                //生成电话启用状态的开关 Todo
                //var $telInterfaceActive = $deviceForm.find('input[name="telInterfaceActive"]');
                //$telInterfaceActive.bootstrapSwitch({
                //    state: $telInterfaceActive.data('status') == 1,
                //    onText: '启用',
                //    offText: '不启用',
                //    onColor: 'success'
                //});

                //渲染打印机下拉菜单
                renderPrinters($deviceForm.find('div[name="printers"]'), $XP(deviceData, 'printerKey', ''), 'printerKey');

                //渲染区域选择 Todo
                //renderSiteAreas();
                //渲染菜品分类 Todo
                //renderSiteFoodCategories();

                //验证设备参数的form表单
                registerDeviceForm();

                //绑定模态框的保存事件
                bindDeviceModal(deviceData, $editDevice);
            });
        }

        //Todo
        //function renderSiteAreas() {
        //    var $siteAreaLst = $deviceForm.find('div[name="siteAreaLst"]');
        //    C.loadData('getTableArea', {shopID: shopID}, tableAreas).done(function (records) {
        //        if(!records || records.length == 0) {
        //            tableAreas = [];
        //            return;
        //        }
        //        tableAreas = records;
        //        var siteAreaList = _.map(IX.clone(tableAreas), function (area) {
        //            return {name: '', value: '', checked: ''};
        //        });
        //        $siteAreaLst.append($(checkboxListTpl({checkboxes: siteAreaList})));
        //    });
        //}
        //
        //function renderSiteFoodCategories() {
        //    var $siteFoodCategoryLst = $deviceForm.find('div[name="siteFoodCategoryLst"]');
        //    C.loadData('getSaasCategories', {shopID: shopID}, foodCategories).done(function (records) {
        //        if(!records || records.length == 0) {
        //            foodCategories = [];
        //            return;
        //        }
        //        foodCategories = records;
        //        var siteFoodCategories = _.map(IX.clone(foodCategories), function (category) {
        //            return {name: '', value: '', checked: ''};
        //        });
        //        $siteFoodCategoryLst.append($(checkboxListTpl({checkboxes: siteFoodCategories})));
        //    });
        //}

        function parseKitchenPrintBillLst($checkedKitchenList) {
            var kitchenPrintBillLst = _.map($checkedKitchenList, function(input) {
                return $(input).attr('name');
            }).join('|');
            return {KitchenPrintBillTypeLst: kitchenPrintBillLst}
        }

        function parseSwitch() {
            var switchParams = {};
            _.each($switches, function(input) {
                var $input = $(input),
                    name = $input.attr('name'),
                    val = $input.bootstrapSwitch('state') ? '1' : '0';
                switchParams[name] = val;
            });
            return switchParams;
        }

        function mapDeviceParamsData(records) {
            var colNames = "deviceName,deviceCode,deviceRemark,printerName,shellCurrVersionNo," +
                "runtimeEnvOS,runtimeEnvCPUFre,runtimeEnvMemorySize,runtimeEnvScreenSize,rowControl";
            var mapColsData = function (record) {
                var cols = _.map(colNames.split(','), function (k) {
                    var v = $XP(record, k, ''),
                        r = {};
                    switch (k) {
                        case 'rowControl':
                            r = {
                                type: 'button',
                                btns: [
                                    {
                                        label: '修改',
                                        link: 'javascript:void(0);',
                                        key: $XP(record, 'deviceKey'),
                                        type: 'editShopParams'
                                    }
                                ]
                            };
                            break;
                        case 'printerName' :
                            r.value = $XP(record, 'printerKey', '');
                            r.text = v;
                            r.type = 'text';
                            r.clz = 'text';
                            break;
                        default :
                            r.text = v;
                            r.clz = 'text';
                            r.type = 'text';
                            break;
                    }
                    return r;
                });
                return cols;
            };
            var rows = _.map(records, function (record) {
                return {
                    clz : '',
                    cols : mapColsData(record)
                }
            });
            return {
                isEmpty: !records || records.length == 0,
                tblClz : 'table table-bordered table-striped table-hover ix-data-report',
                thead : deviceParamsTableHeads,
                rows : rows,
                colCount: colNames.split(',').length
            }
        }

        function renderSelect(selectData, selectName, selectedVal, defaultOption) {
            var defaultOptionItem = defaultOption ? {defaultOption: defaultOption} : {};
            return IX.inherit(defaultOptionItem, {
                options: _.map(selectData, function (select) {
                    if(typeof select == 'object') {
                        var val = $XP(select, 'value', ''),
                            name = $XP(select, 'label', '');
                        return {value: val, name: name, selected: selectedVal == val ? 'selected' : ''};
                    }
                }),
                name: selectName
            });
        }

        function mapShopParamsData(record) {
            var checkedNames = $XP(record, 'KitchenPrintBillTypeLst', '').split('|');
            return IX.inherit(record, {
                moneyWipeZeroTypeData: renderSelect(paramsTypeDef.moneyWipeZeroTypes, 'moneyWipeZeroType', $XP(record, 'moneyWipeZeroType', '0')),
                moneyWipeZeroTypeVal: $XP(_.findWhere(paramsTypeDef.moneyWipeZeroTypes, {value: $XP(record, 'moneyWipeZeroType', '') + ''}), 'label'),
                checkoutBillPrintCopiesData: renderSelect(paramsTypeDef.checkoutBillPrintCopies, 'CheckoutBillPrintCopies', $XP(record, 'CheckoutBillPrintCopies', '1')),
                checkoutBillPrintCopiesVal: $XP(_.findWhere(paramsTypeDef.checkoutBillPrintCopies, {value: $XP(record, 'CheckoutBillPrintCopies', '1') + ''}), 'label'),
                checkoutBillDetailPrintWayData: renderSelect(paramsTypeDef.checkoutBillDetailPrintWays, 'CheckoutBillDetailPrintWay', $XP(record, 'CheckoutBillDetailPrintWay', '2')),
                checkoutBillDetailPrintWayVal: $XP(_.findWhere(paramsTypeDef.checkoutBillDetailPrintWays, {value: $XP(record, 'CheckoutBillDetailPrintWay', '2') + ''}), 'label'),
                checkoutBillDetailAmountTypeData: renderSelect(paramsTypeDef.checkoutBillDetailAmountTypes, 'CheckoutBillDetailAmountType', $XP(record, 'CheckoutBillDetailAmountType', '')),
                checkoutBillDetailAmountTypeVal: $XP(_.findWhere(paramsTypeDef.checkoutBillDetailAmountTypes, {value: $XP(record, 'CheckoutBillDetailAmountType', '') + ''}), 'label', ''),
                KitchenTableNameBigFontData : renderSelect(paramsTypeDef.KitchenTableNameBigFontTypes, 'KitchenTableNameBigFont', $XP(record, 'KitchenTableNameBigFont', '')),
                KitchenTableNameBigFontVal : $XP(_.findWhere(paramsTypeDef.KitchenTableNameBigFontTypes, {value: $XP(record, 'KitchenTableNameBigFont', '') + ''}), 'label'),
                PCScreen2AdImageIntervalTimeData : renderSelect(paramsTypeDef.PCScreen2AdImageIntervalTimeTypes,'PCScreen2AdImageIntervalTime',$XP(record,'PCScreen2AdImageIntervalTime')),
                PCScreen2AdImageIntervalTimeVal :$XP(_.findWhere(paramsTypeDef.PCScreen2AdImageIntervalTimeTypes, {value: $XP(record, 'PCScreen2AdImageIntervalTime', '') + ''}), 'label'),
                revOrderAfterPlayVoiceTypeData: renderSelect(paramsTypeDef.revOrderAfterPlayVoiceTypes, 'RevOrderAfterPlayVoiceType', $XP(record, 'RevOrderAfterPlayVoiceType', '')),
                revOrderAfterPlayVoiceTypeVal: $XP(_.findWhere(paramsTypeDef.revOrderAfterPlayVoiceTypes, {value: $XP(record, 'RevOrderAfterPlayVoiceType', '') + ''}), 'label', '0'),
                //TTSVoiceSpeedData: renderSelect(paramsTypeDef.TTSVoiceSpeedTypes, 'TTSVoiceSpeed', $XP(record, 'TTSVoiceSpeed', '2')),
                //TTSVoiceSpeedVal: $XP(_.findWhere(paramsTypeDef.TTSVoiceSpeedTypes, {value: $XP(record, 'TTSVoiceSpeed', '2')}), 'label', ''),
                //TTSVoiceNameList: renderSelect(_.map(_.compact($XP(record, 'TTSVoiceNameLst', '').split(',')), function(name){ return {value: name, label: name}}), 'TTSVoiceName', $XP(record, 'TTSVoiceName', ''), {name: '请选择', value: ''}),
                checkoutBillTopAddStrDecode: C.decodeTextEnter($XP(record, 'CheckoutBillTopAddStr', '')),
                checkoutBillBottomAddStrDecode: C.decodeTextEnter($XP(record, 'CheckoutBillBottomAddStr', '')),
                kitchenPrintBillTypeList: _.map(IX.clone(paramsTypeDef.kitchenPrintBillTypeLst), function(kitchenType) {
                    var kitchenTypeName = $XP(kitchenType, 'value', ''),
                        kitchenTypeLabel = $XP(kitchenType, 'label', '');
                    return {label: kitchenTypeLabel, name: kitchenTypeName, checked: _.contains(checkedNames, kitchenTypeName) ? 'checked' : ''};
                }),
                KitchenPrintBillTypeLstVal: _.pluck(_.select(paramsTypeDef.kitchenPrintBillTypeLst, function(kitchenType) {return _.contains(checkedNames, kitchenType.value);}), 'label').join(',')
            });
        }

        function createSwitch() {
            var labelMap = {
                printer: {onText: '打印', offText: '不打印'},
                push: {onText: '推送', offText: '不推送'},
                merge: {onText: '合并', offText: '不合并'}
            };
            $switches = $shopParams.find('input.status[type="checkbox"]');
            _.each($switches, function(input) {
                var $switch = $(input),
                    state = $switch.data('status') == 1;
                $switch.bootstrapSwitch({
                    state: state,
                    onText: $XP(labelMap[$switch.data('label')], 'onText', '启用'),
                    offText: $XP(labelMap[$switch.data('label')], 'offText', '不启用'),
                    onColor: 'success'
                });
            });
        }
    };
})(window, jQuery);