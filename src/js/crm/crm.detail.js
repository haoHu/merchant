(function ($, window) {
	IX.ns("Hualala.CRM");
	IX.ns("Hualala.MCM");

	Hualala.CRM.initDetail = function($container, cardID)
    {
        if(!cardID) return;
        
        $container.addClass('crm-detail');
        
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            tplLib = Hualala.TplLib,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
            basicInfo: [
                {customerName: '姓名', customerSex: '性别', customerBirthday: '生日', customerMobile: '手机号', cardLevelName: '等级' ,},
                {createTime: '入会时间', createShopName: '入会店铺'},
                {cardNO: '卡号', moneyBalance: '现金卡值', giveBalance: '赠送卡值', pointBalance: '积分余额'},
                {saveMoneyTotal: '储值累计', pointGetTotal: '积分累计', consumptionTotal: '消费累计', consumptionCount: '消费次数', lastConsumptionTime: '最后消费时间'},
            ],
            customerSex: CrmTypeDef.customerSex,
            transDetail: {
                transTime: '交易时间', transShopName: '交易店铺', transType: '交易类型', consumptionAmount: '消费金额',
                saveMoneyAmountSum: '现金卡值', giveBalancePaySum:'赠送卡值', deductionPointAmount:'扣积分', returnPointAmount: '赠积分',
                transAfterMoneyBalance: '交易后现金卡值', transAfterGiveBalance: '交易后赠送卡值', transAfterPointBalance: '交易后积分余额', transRemark: '交易备注'
            },
            transType: CrmTypeDef.transType,
            event: {
                cardLevelName: '等级', eventName: '活动主题', eventWay: '活动类型', createTime: '参与时间',
                //eventNews ~= Meta.eventNews[eventWay][winFlag]
                eventNews: '活动动态'
            },
            eventWay: CrmTypeDef.eventWay,
            gift: {
                giftName: '名称', createTime: '获得时间', getWay: '获得方式', giftStatus: '状态', usingShopName: '使用店铺', usingTime: '使用时间', validUntilDate: '使用截止日期'
            },
            getWay: CrmTypeDef.getWay,
            giftStatus: CrmTypeDef.giftStatus,
            cardLog: {
                createTime: '时间', shopName: '店铺', logType: '类型', operator: '经办人', remark: '备注'
            },
            logType: CrmTypeDef.logType
        };
        
        var imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
            defaultAvatar = G.IMAGE_ROOT + '/dino80.png';
        
        var params = {cardID: cardID},
            customerDetail = {},
            $tpl = $(tplLib.get('tpl_crm_detail')).appendTo($container),
            $basicInfo = $tpl.filter('.basic-info'),
            $trans = $tpl.find('#transDetail'),
            $events = $tpl.find('#activities'),
            $gifts = $tpl.find('#vouchers'),
            $logs = $tpl.find('#cardLog'),
            $accountChange = $tpl.find('#accountChange'),
            $accountForm = $accountChange.find('form'),
            $sendGift = $tpl.find('#sendGift'),
            $giftForm = $sendGift.find('form');

        $tpl.find('.tab-pane:not(#accountChange,#sendGift)').addClass('table-responsive');
        getData(params, 'getCrmDetail', renderCrmDetail);
        getData(params, 'getCrmTransDetail', renderCrmTransDetail);
        getData(params, 'getCrmUserEvents', renderCrmUserEvents);
        getData(params, 'getCrmUserGifts', renderCrmUserGifts);
        getData(params, 'getCrmCardLogs', renderCrmCardLogs);
        renderCrmAccountChange();
        renderCrmSendGift();
        bindBasicUpdate();

        function bindBasicUpdate() {
            var bindSaveBasicInfo = function(modalDialog) {
                modalDialog._.footer.on('click', '.btn.btn-ok', function() {
                    var $this = $(this),
                        $form = $this.parents('.modal-footer').prev('.modal-body').find('form'),
                        formParams = C.parseForm($form),
                        birthday = _.toArray(_.pick(formParams, 'year', 'month', 'day')).join('-'),
                        postParams = IX.inherit(params, {customerBirthday: birthday}, _.omit(formParams, 'year', 'month', 'day'));
                    if(!$form.data('bootstrapValidator').validate().isValid()) return;
                    G.updateCrmBasicInfo(postParams, function(rsp){
                        if(rsp.resultcode != '000') {
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        modalDialog.hide();
                        $basicInfo.empty();
                        getData(params, 'getCrmDetail', renderCrmDetail);
                    });
                });
            };
            $basicInfo.on('click', 'a[name="edit_basic_info"]', function (e) {
                Handlebars.registerPartial('tplRadio', tplLib.get('tpl_radio'));
                Handlebars.registerPartial('tplSelect', tplLib.get('tpl_select'));
                var getDigitalSelectData = function(name, label, start, count) {
                    var optionValues = _.times(count, function(i){return i + start;}),
                        options = _.map(optionValues, function(val) {
                            return {value: val < 10 ? '0' + val : val + '', name: val + label};
                        });
                    return {name: name, options: options};
                };
                var radioData = {
                        name: 'customerSex',
                        label: '性别',
                        inputs: [{value: '1', text: '男'}, {value: '0', text: '女'}, {value: '2', text: '未知'}]
                    },
                    yearSelect = getDigitalSelectData('year', '年', 1949, (new Date()).getFullYear() - 1949 + 1),
                    monthSelect = getDigitalSelectData('month', '月', 1, 12),
                    daySelect = getDigitalSelectData('day', '日', 1, 31),
                    customerBirthday = ($XP(customerDetail, 'customerBirthday', '') || '1990-01-01').split('-');
                _.findWhere(yearSelect.options, {value: customerBirthday[0]}).selected = 'selected';
                _.findWhere(monthSelect.options, {value: customerBirthday[1]}).selected = 'selected';
                _.findWhere(daySelect.options, {value: customerBirthday[2]}).selected = 'selected';
                _.findWhere(radioData.inputs, {value: customerDetail.customerSex || '2'}).checked = 'checked';
                var editBasicInfoTpl = Handlebars.compile(tplLib.get('tpl_crm_basic_info')),
                    modalDialog = new Hualala.UI.ModalDialog({
                        title: '修改会员基本信息',
                        hideCloseButton: false,
                        html: $(editBasicInfoTpl(IX.inherit(customerDetail, {years: yearSelect, months: monthSelect, days: daySelect, sexRadio: radioData}))),
                        backdrop: 'static'
                    }).show(),
                    modalBody = modalDialog._.body;
                registerBasicInfoValidator(modalBody.find('form'));
                bindSaveBasicInfo(modalDialog);
            });
        }

        function registerBasicInfoValidator($form) {
            $form.bootstrapValidator({
                fields: {
                    customerName: {
                        validators: {notEmpty: {message: '会员姓名不能为空'}}
                    }
                }
            });
        }

        function renderCrmDetail(data)
        {
            $('<img alt="会员头像" width="100" height="100">').attr('src', data.photoImage ? imgHost + data.photoImage : defaultAvatar).appendTo($basicInfo);
            
            var $div = $('<div>'),
                icoOk = '<i class="glyphicon glyphicon-ok ok" title="已验证"></i>';
            for(var i = 0, item; item = Meta.basicInfo[i++];)
            {
                var $ul = $('<ul>');
                for(var key in item)
                {
                    var val = data[key] || '';
                    if(val)
                    {
                        if(/createTime|customerBirthday|lastConsumptionTime/.test(key))
                            val = formatDateStr(val.replace(/-/g, ''), 12);
                        else if(/moneyBalance|shopChargeGiftSum|pointBalance|saveMoneyTotal|pointGetTotal|consumptionTotal/.test(key)) 
                            val = prettyNumeric(val);
                        else if(key == 'customerMobile' && +data.isMobileChecked)
                            val += icoOk;
                        else if(key == 'customerSex') 
                            val = Meta[key][val];
                        
                        $ul.append($('<li>').append($('<label>').text(item[key])).append($('<span>').html(val)));
                    }
                }
                if(i == 1) $ul.append($('<li>').append($('<a href="javascript:{}" name="edit_basic_info">修改基本信息</a>')));
                $div.append($ul);
            }
            $basicInfo.append($div);
        }
        
        function renderCrmTransDetail(records)
        {
            var $theadTR = $trans.find('thead tr'), ths = [],
                $tbody = $trans.find('tbody'), trs = [],
                transDetail = Meta.transDetail, transType = Meta.transType;
                
            for(var key in transDetail)
                ths.push($('<th>').text(transDetail[key]));
            $theadTR.append(ths);

            if (records.length == 0) {
                var $tr = $('<tr>'),
                    $td = $('<td colspan="'+ Object.keys(transDetail).length +'"><p class="text-center">无结果</p></td>');
                $tr.append($td);
                trs.push($tr);
            } else {
                for(var i = 0, item; item = records[i++];) {
                    var $tr = $('<tr>');
                    for(var key in transDetail)
                    {
                        var val = item[key] || '';
                        if(key == 'transTime')
                            val = formatDateStr(val, 12);
                        else if(/consumptionAmount|moneyChange|transAfterMoneyBalanceSum/.test(key))
                            val = prettyNumeric(val);
                        else if(key == 'transType')
                            val = transType[val];

                        $('<td>').text(val).appendTo($tr);
                    }
                    trs.push($tr);
                }
            }
            $tbody.append(trs);
        }
        
        function renderCrmUserEvents(records)
        {
            var $theadTR = $events.find('thead tr'), ths = [],
                $tbody = $events.find('tbody'), trs = [],
                event = Meta.event, eventWay = Meta.eventWay;
                
            for(var key in event)
                ths.push($('<th>').text(event[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in event)
                {
                    var val = item[key];
                    if(key == 'createTime') 
                        val = formatDateStr(val, 12);
                    else if(key == 'eventNews')
                        val = getEventNews(item.eventWay, item.winFlag);
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function getEventNews(way, flag)
        {
            var ret = '已兑换';
            if(way == 20) ret = flag == 1 ? '一等奖' : flag == 2 ? '二等奖' : '三等奖';
            else if(way == 21) ret = '已领取';
            else if(ret == 22) ret = flag == 1 ? '已入围' : '未入围';
            return ret;
        }
        
        function renderCrmUserGifts(records)
        {
            var $theadTR = $gifts.find('thead tr'), ths = [],
                $tbody = $gifts.find('tbody'), trs = [],
                gift = Meta.gift;
                
            for(var key in gift)
                ths.push($('<th>').text(gift[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in gift)
                {
                    var val = item[key];
                    if(/createTime|usingTime|validUntilDate/.test(key)) 
                        val = formatDateStr(val, 12);
                    else if(/getWay|giftStatus/.test(key))
                        val = Meta[key][val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function renderCrmCardLogs(records)
        {
            var $theadTR = $logs.find('thead tr'), ths = [],
                $tbody = $logs.find('tbody'), trs = [],
                cardLog = Meta.cardLog, logType = Meta.logType;
                
            for(var key in cardLog)
                ths.push($('<th>').text(cardLog[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in cardLog)
                {
                    var val = item[key];
                    if(key == 'createTime') 
                        val = formatDateStr(val, 12);
                    else if(key == 'logType')
                        val = logType[val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }


        function renderCrmAccountChange() {
            var $isChangeVisible = $accountChange.find('.form-group input[name="visible"]');
            $isChangeVisible.bootstrapSwitch({
                state: false,
                onText: '是',
                offText: '否',
                onColor: 'success'
            }).on('switchChange.bootstrapSwitch', function (el, state) {
                var $this = $(el.target),
                    $smsGroup = $this.parents('.form-group').next(),
                    $smsTextarea = $smsGroup.find('textarea');
                if(!state) $accountForm.bootstrapValidator('resetField', $smsTextarea.attr('name'), true);
                $smsGroup.toggleClass('hidden');
            });
            registerValidateAccount();
            bindSaveChange();
        }

        function bindSaveChange() {
            $accountChange.on('click', '.step-action button.btn-save', function () {
                var notEmptyInput = _.select($accountForm.find('input[type="text"]'), function (input) {
                    return $(input).val() && $(input).val() != 0;
                });
                if(notEmptyInput.length == 0) {
                    topTip({msg: '调整的项目至少有一个非零的值', type: 'danger'});
                    return;
                }
                if($accountForm.data('bootstrapValidator').validate().isValid()) {
                    var $isChangeVisible = $accountChange.find('.form-group input[name="visible"]'),
                        data = C.parseForm($accountForm);
                    _.each(data, function (val, key, obj) {
                        if(key != 'smsContent') data[key] = val || '0';
                    });
                    data.visible = $isChangeVisible.bootstrapSwitch('state') ? 1 : 0;
                    G.crmAccountChange(IX.inherit(data, params), function (rsp) {
                        if(rsp.resultcode != '000'){
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        topTip({msg: '修改成功', type: 'success'});
                        $accountForm.bootstrapValidator('resetForm', true);
                        $basicInfo.empty();
                        getData(params, 'getCrmDetail', renderCrmDetail);
                        $trans.find('table tbody').empty();
                        $trans.find('table thead tr').empty();
                        getData(params, 'getCrmTransDetail', renderCrmTransDetail);
                    });
                }
            });
        }


        function registerValidateAccount() {
            $accountForm.bootstrapValidator({
                fields: {
                    smsContent: {
                        validators: {notEmpty: {message: '短信内容不能为空'}}
                    },
                    adjustMoneyBalance: {
                        validators: {
                            regexp: {
                                regexp: /(^[+-]?\d{0,8}$)|(^[+-]?\d{0,8}\.\d{0,2}$)/,
                                message: '必须是整数部分不超过8位且小数部分不超过2位的数'
                            }
                        }
                    },
                    adjustGiveBalance: {
                        validators: {
                            regexp: {
                                regexp: /(^[+-]?\d{0,8}$)|(^[+-]?\d{0,8}\.\d{0,2}$)/,
                                message: '必须是整数部分不超过8位且小数部分不超过2位的数'
                            }
                        }
                    },
                    adjustPointBalance: {
                        validators: {
                            regexp: {
                                regexp: /(^[+-]?\d{0,8}$)|(^[+-]?\d{0,8}\.\d{0,2}$)/,
                                message: '必须是整数部分不超过8位且小数部分不超过2位的数'
                            }
                        }
                    }
                }
            });
        }

        function renderCrmSendGift() {
            var $timeEffect = $sendGift.find('[name="time_effect"]'),
                $switchSendSms = $sendGift.find('input[name="isSend"]'),
                $sendSms = $switchSendSms.parents('.form-group').next(),
                customSelectTpl = Handlebars.compile(tplLib.get('tpl_select')),
                options = [
                    {value: '0', name: '立即生效'},
                    {value: '3', name: '3小时'},
                    {value: '6', name: '6小时'},
                    {value: '9', name: '9小时'},
                    {value: '12', name: '12小时'},
                    {value: '18', name: '18小时'},
                    {value: '24', name: '1天'}],
                selectData = {options: options, name: 'giftEffectHours'};
            $timeEffect.append($(customSelectTpl(selectData)));
            $switchSendSms.bootstrapSwitch({
                state: false,
                onText: '发送',
                offText: '不发送',
                onColor: 'success'
            }).on('switchChange.bootstrapSwitch', function (el, state) {
                if(!state) $giftForm.bootstrapValidator('resetField', $sendSms.find('textarea').attr('name'), true);
                $sendSms.toggleClass('hidden');
            });
            registerValidateGift();
            bindSendGift();
        }

        function bindSendGift() {
            var $giftCountInput = $giftForm.find('.form-group input[name="giftNum"]'),
                $giftCount = $giftCountInput.parents('.form-group'),
                $giftValidDayInput = $giftForm.find('.form-group input[name="giftValidDays"]'),
                $giftValidDay = $giftValidDayInput.parents('.form-group');
            //选择礼品
            $giftForm.on('click', '.input-group .input-group-btn button', function () {
                var $thisFormGroup = $(this).parents('.form-group'),
                    nonTicketType = ['40', '42'], //礼品类型为会员积分或会员充值
                    giftModal = new Hualala.MCM.PickGiftModal({
                        trigger: $(this),
                        selectedFn: function (gift, $triggerEl) {
                            var giftID = $XP(gift, 'giftItemID'),
                                giftName = $XP(gift, 'giftName'),
                                giftType = $XP(gift, 'giftType');
                            $thisFormGroup.find('input[name="giftItemID"]').val(giftID);
                            $thisFormGroup.find('input[name="giftName"]').val(giftName).trigger('change');
                            if(_.contains(nonTicketType, giftType)) {
                                $giftForm.bootstrapValidator('resetField', 'giftNum', true);
                                $giftForm.bootstrapValidator('resetField', 'giftValidDays', true);
                                $giftCountInput.val('0');
                                $giftValidDayInput.val('30');
                                $giftCount.addClass('hidden');
                                $giftValidDay.addClass('hidden');
                            } else{
                                $giftCount.removeClass('hidden');
                                $giftValidDay.removeClass('hidden');
                            }
                        }
                    });
            }).on('change', 'input[name="giftName"]', function () {
                $giftForm.bootstrapValidator('revalidateField', $(this).attr('name'));
            });
            $sendGift.on('click', 'button.btn-send', function() {
                //params是cardID的参数
                if($giftForm.data('bootstrapValidator').validate().isValid()){
                    var giftData = C.parseForm($giftForm);
                    giftData = _.omit(giftData, 'isSend', 'giftName');
                    G.crmSendGift(IX.inherit(giftData, params), function (rsp) {
                        if(rsp.resultcode != '000') {
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        topTip({msg: '发送成功', type: 'success'});
                        $giftCount.removeClass('hidden');
                        $giftValidDay.removeClass('hidden');
                        $giftForm.bootstrapValidator('resetForm', true);
                    });
                }
            });
        }

        function registerValidateGift() {
            $giftForm.bootstrapValidator({
                excluded: ':hidden',
                fields: {
                    giftName: {
                        validators: {notEmpty: {message: '请选择礼品'}}
                    },
                    giftNum: {
                        validators: {
                            notEmpty: {message: '礼品个数不能为空'},
                            between: {min: 1, max: 10, message: '礼品个数必须是1-10'}
                        }
                    },
                    giftValidDays: {
                        validators: {
                            notEmpty: {message: '有效天数不能为空'},
                            between: {min: 1, max: 999, message: '有效天数必须是1-999'}
                        }
                    },
                    giftMsg: {
                        validators: {
                            notEmpty: {message: '短信内容不能为空'}
                        }
                    }
                }
            });
        }

        function getData(params, callServer, cbFn)
        {
            G[callServer](params, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                var isGetCrmDetail = callServer == 'getCrmDetail',
                    data = isGetCrmDetail ? rsp.data : rsp.data.records || [];
                if(isGetCrmDetail) customerDetail = data;
                cbFn(data);
            });
        }
    };
})(jQuery, window);