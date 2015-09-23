(function ($, window) {
	IX.ns("Hualala.CRM");
    IX.ns("Hualala.MCM");
    var HMCM = Hualala.MCM,
        G = Hualala.Global,
        C = Hualala.Common,
        U = Hualala.UI,
        topTip = U.TopTip,
        giftSetTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_gift_set'));

	Hualala.CRM.initParams = function($crm)
    {
        var $form = null, bv = null, itemID = '',
            $card = null, $cardCont = null, 
            $logo, $cardLogo,
            $labelBtn = null, $giftSetSwitch = null, $noBg = null,
            $crmAccount = null, $crmAccountName = null,
            logo = '', bgImg = '', settleID = '', accounts = [];
            
        $crm.removeClass('table-responsive');
        var dfCrmParams = C.loadData('getCrmParams', {groupID: Hualala.getSessionData().site.groupID}, null, 'data')
        .done(function(data)
        {
            var crmParams = data;
            
            itemID = crmParams.itemID;
            settleID = crmParams.onlineSaveMoneySettleUnitID;
            logo = crmParams.logoImage;
            //crmParams.cardBackgroundImage = 'group1/M00/00/B9/wKgCIVL684HYKSoEAAEaVR07W8Q443.png';
            bgImg = crmParams.cardBackgroundImage;
            crmParams.logoImage = crmParams.logoImage ? 
                C.getSourceImage(crmParams.logoImage, {width: 300, height: 188})
                : G.IMAGE_ROOT + '/vip_card.png';
            crmParams.cardForegroundColor = crmParams.cardForegroundColor || '#ffcc00';
            crmParams.cardBackgroundColor = crmParams.cardBackgroundColor || '#990000';
            crmParams.serviceStartTime = formatDate(crmParams.serviceStartTime);
            crmParams.serviceEndTime = formatDate(crmParams.serviceEndTime);
            crmParams.pointClearDate = +crmParams.pointClearDate == 0 ? '不清零' : formatDate(crmParams.pointClearDate);
            crmParams.onlineSaveMoneyRate = +crmParams.onlineSaveMoneyRate * 100 + '%';
            crmParams.isPointCanPay = crmParams.isPointCanPay == 0 ? 'minus' : 'ok';
            crmParams.vipServiceRemark = C.decodeTextEnter(crmParams.vipServiceRemark);
            listCrmGiftData(crmParams);
            $form = $(Handlebars.compile(Hualala.TplLib.get('tpl_crm_params'))(crmParams)).appendTo($crm);
            if(crmParams.openCardGiftEffectHours == 0) $('.form-group [name="effect_hour"] p').text('立即生效');
            createGiftSetSwitch();
            bindGiftEvent();
            //bgImg = 'group1/M00/05/26/wKgCIVUrlhDEfwtbAAF3gPwkcMQ451.jpg';
            $card = $form.find('.vip-card');
            $cardCont = $form.find('.vip-card, .vip-card-wrap div');
            $logo = $cardCont.find('img');
            $cardLogo = $card.find('img').toggleClass('dn', !!bgImg);
            $labelBtn = $form.find('label.btn');
            $noBg = $labelBtn.filter('.btn-bg-no');
            $crmAccount = $form.find('[name=onlineSaveMoneySettleUnitID]');
            $crmAccountName = $crmAccount.siblings('p');
            
            if(bgImg) setCardBgImg();
            
            U.fileUpload($labelBtn.filter('.btn-logo'), function(rsp)
            {
                logo = rsp.url;
                $logo.attr('src', C.getSourceImage(logo, {width: 300, height: 188}));
                $cardLogo.toggleClass('dn', !!bgImg)
            }, {
                accept: 'image/png'
            });
            
            U.fileUpload($labelBtn.filter('.btn-bg'), function(rsp)
            {
                bgImg = rsp.url;
                setCardBgImg();
                $cardLogo.addClass('dn');
                $noBg.removeAttr('disabled');
            },{
                accept: 'image/jpg,image/jpeg,image/png'
            });
            
            $form.find('.card-color').colorpicker()
            .on('changeColor.colorpicker', function(event)
            {
                $(this).find('input').value = event.color.toHex();
                $cardCont.css('color', event.color.toHex());
            });
            
            $form.find('.card-bg').colorpicker()
            .on('changeColor.colorpicker', function(event)
            {
                $(this).find('input').value = event.color.toHex();
                $cardCont.css('background-color', event.color.toHex());
            });

            $form.bootstrapValidator({
                excluded: ':hidden',
                fields: {
                    vipServiceTel: {
                        validators: {
                            notEmpty: { message: '会员服务电话不能为空' },
                            telOrMobile: { message: '' }
                        }
                    },
                    openCardGiftName: {
                        validators: {notEmpty: {message: '请选择礼品'}}
                    },
                    birthdayGiftName: {
                        validators: {notEmpty: {message: '请选择礼品'}}
                    },
                    openCardGiftNum: {
                        validators: {
                            notEmpty: {message: '数量不能为空'},
                            integer: {message: '必须是整数'},
                            between: {message: '必须是1-10的值', min: 1, max: 10}
                        }
                    },
                    birthdayGiftNum: {
                        validators: {
                            notEmpty: {message: '数量不能为空'},
                            integer: {message: '必须是整数'},
                            between: {message: '必须是1-10的值', min: 1, max: 10}
                        }
                    },
                    openCardGiftValidDays: {
                        validators: {
                            notEmpty: {message: '有效期不能为空'},
                            integer: {message: '必须是整数'},
                            between: {message: '必须是1-999的值', min: 1, max: 999}
                        }
                    },
                    birthdayGiftValidDays: {
                        validators: {
                            notEmpty: {message: '有效期不能为空'},
                            integer: {message: '必须是整数'},
                            between: {message: '必须是1-999的值', min: 1, max: 999}
                        }
                    },
                    birthdayGiftAdvanceDays: {
                        validators: {
                            notEmpty: {message: '提前天数不能为空'},
                            integer: {message: '必须是整数'},
                            between: {message: '必须是1-31的值', min: 1, max: 31}
                        }
                    },
                    birthdayGiftSMS: {
                        validators: {
                            notEmpty: {message: '消息模板不能为空'}
                        }
                    }
                }
            });
            bv = $form.data('bootstrapValidator');
        });
        
        C.loadData('queryAccount').done(function(records)
        {
            accounts = _.map(records, function(record){ return {settleUnitID: record.settleUnitID, settleUnitName: record.settleUnitName, py: record.py }; });
            
            dfCrmParams.done(function()
            {
                var currentAccount = _.findWhere(accounts, {settleUnitID: settleID}) || {};
                $crmAccountName.text(currentAccount.settleUnitName);
                U.createChosen($crmAccount, accounts, 'settleUnitID', 'settleUnitName', {width: '100%'}, false, settleID);
            });
        });
        
        $crm.on('click', function(e)
        {
            var $target = $(e.target);
            
            if($target.is('button')) e.preventDefault();
            
            if($target.is('.btn-edit'))
            {
                $form.removeClass('read-mode').addClass('edit-mode');
                $labelBtn.removeAttr('disabled');
                $giftSetSwitch.bootstrapSwitch('toggleDisabled');
                if(!bgImg) $noBg.attr('disabled', 'disabled');
            }
            
            if($target.is('.btn-bg-no'))
            {
                bgImg = '';
                setCardBgImg('');
                $cardLogo.removeClass('dn');
                $noBg.attr('disabled', 'disabled');
            }
            
            if($target.is('.btn-save'))
            {
                if(!bv.validate().isValid()) return;

                var data = C.parseForm($form),
                    omitKeys = ['birthdayGift', 'openCardGift', 'birthdayGiftType', 'openCardGiftType'];
                //if(data.birthdayGiftID != 0 && parseFloat(data.birthdayGiftAdvanceDays) > parseInt(data.birthdayGiftValidDays)){
                //    topTip({msg: '生日返券有效天数不能小于提前返券天数', type: 'danger'});
                //    return;
                //} 生日赠送已移到活动管理
                data.itemID = itemID;
                data.logoImage = logo;
                data.cardBackgroundImage = bgImg;
                data.birthdayGiftName = $form.find('input[name="birthdayGiftName"]').val();
                data.openCardGiftName = $form.find('input[name="openCardGiftName"]').val();
                data.vipServiceRemark = Hualala.Common.encodeTextEnter(data.vipServiceRemark);
                data.birthdayGiftSMS = Hualala.Common.encodeTextEnter(data.birthdayGiftSMS);
                var defaultZeroItems = ['openCardGiftNum', 'openCardGiftValidDays', 'birthdayGiftAdvanceDays', 'birthdayGiftNum', 'birthdayGiftValidDays'];
                _.each(defaultZeroItems, function (key) {
                    data[key] = data[key] || '0';//todo 默认礼品个数和有效天数都是不能为零的，需要优化
                });
                
                G.setCrmParams(_.omit(data, omitKeys), function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    $form.find('.form-control').each(function()
                    {
                        var $this = $(this),
                            $textUnit = $this.next('span.input-group-addon'),
                            text = !$this.is('select') ? this.value :
                                $this.find('option:checked').text(),

                            textUnit = $textUnit.length != 0 ? $textUnit.text() : '';
                        
                        $(this).closest('.form-group').find('p').text(text + ' ' + textUnit);
                    });
                    
                    $form.removeClass('edit-mode').addClass('read-mode');
                    $labelBtn.attr('disabled', 'disabled');
                    $giftSetSwitch.bootstrapSwitch('toggleDisabled');
                    topTip({msg: '保存成功！', type: 'success'});
                });
            }
            if($target.parent().is('.input-group-btn')) {
                var $input = $target.parent().prev(),
                    $giftTypeInput = $input.prevAll('[name$=GiftType]'),
                    $giftIDInput = $input.prevAll('[name$=GiftID]'),
                    selectGiftType = $input.attr('name') == 'birthdayGiftName' ? [10] : null;
                var modal = new HMCM.PickGiftModal({
                    trigger : $target,
                    selectedFn : function (gift, $triggerEl) {
                        var giftID = $XP(gift, 'giftItemID', ''),
                            giftName = $XP(gift, 'giftName', ''),
                            giftType = $XP(gift, 'giftType', '');
                        $giftIDInput.val(giftID);
                        $giftTypeInput.val(giftType);
                        $input.val(giftName).trigger('change');
                    },
                    selectGiftType: selectGiftType
                });
            }
        });

        function setCardBgImg(imgPath)
        {
            var imgUrl = imgPath === '' ? 'about:blank' : C.getSourceImage((imgPath || bgImg), {width: 300, height: 188});
            $card.css('background-image', 'url(' + imgUrl + ')');
        }
        
        function formatDate(dateStr)
        {
            return dateStr.length == 8 ? dateStr.substr(0, 4) + '年' + parseInt(dateStr.substr(4, 2)) + '月' + parseInt(dateStr.substr(6)) + '日' : parseInt(dateStr.substr(0, 2)) + '月' + parseInt(dateStr.substr(2)) + '日';
        }

        function listCrmGiftData(data) {
            Handlebars.registerPartial('giftTpl', Hualala.TplLib.get('tpl_crm_gift_set'));
            Handlebars.registerPartial('customSelect', Hualala.TplLib.get('tpl_select'));
            var cardItems = packageSetData('openCardGift', data),
                birthdayItems = packageSetData('birthdayGift', data);
            data.cardGift = {
                items: cardItems, openCardGiftEffectHours: $XP(data, 'openCardGiftEffectHours', ''),
                effectHoursOptions: effectHoursOptions($XP(data, 'effectHoursOptions', '0'))
            };
            data.birthdayGift = {items: birthdayItems, birthdayGiftSMS: Hualala.Common.decodeTextEnter($XP(data, 'birthdayGiftSMS', ''))};
            data.cardGiftChecked = $XP(data, 'openCardGiftID', '0') != 0 ? 'checked' : '';
            data.birthdayGiftChecked = $XP(data, 'birthdayGiftID', '0') != 0 ? 'checked' : '';
        }

        function effectHoursOptions(GiftEffectTimeHours){
            var options = [
                    {value: '0', name: '立即生效'},
                    {value: '3', name: '3小时'},
                    {value: '6', name: '6小时'},
                    {value: '9', name: '9小时'},
                    {value: '12', name: '12小时'},
                    {value: '18', name: '18小时'},
                    {value: '24', name: '1天'}];
            var option = _.findWhere(options, {value: GiftEffectTimeHours});
            if(option) option['selected'] = 'selected';
            return {options: options, name: 'openCardGiftEffectHours'};
        }

        function packageSetData(setType, data) {
            var itemKeys = {
                    openCardGift: ['openCardGiftName', 'openCardGiftNum', 'openCardGiftValidDays'],
                    birthdayGift: ['birthdayGiftAdvanceDays', 'birthdayGiftName', 'birthdayGiftNum', 'birthdayGiftValidDays']
                },
                openCardGiftID = $XP(data, 'openCardGiftID', '0'),
                birthdayGiftID = $XP(data, 'birthdayGiftID', '0');
            var items = _.map(itemKeys[setType], function (key) {
                var title, addon, hiddenItems, editable, itemHidden;
                switch (key) {
                    case 'openCardGiftName':
                        title = '开卡赠送礼品';
                        addon = {btnText: '选择'};
                        hiddenItems = {
                            hiddenItems: [{name: 'openCardGiftID', value: $XP(data, 'openCardGiftID', '0')},
                                {name: 'openCardGiftType', value: ''}
                            ]
                        };
                        editable = {disabled: 'disabled'};
                        break;
                    case 'openCardGiftNum':
                        title = '开卡赠券张数';
                        addon = {addonText: '张'};
                        itemHidden = {hiddenClass: openCardGiftID != 0 && $XP(data, key, '0') == 0 ? 'hidden' : ''};
                        break;
                    case 'openCardGiftValidDays':
                        title = '开卡赠券有效期';
                        addon = {addonText: '天'};
                        itemHidden = {hiddenClass: openCardGiftID != 0 && $XP(data, key, '0') == 0 ? 'hidden' : ''};
                        break;
                    case 'birthdayGiftName':
                        title = '生日返券';
                        addon = {btnText: '选择'};
                        hiddenItems = {hiddenItems: [{name: 'birthdayGiftID', value: $XP(data, 'birthdayGiftID', '')},
                            {name: 'birthdayGiftType', value: ''}]};
                        editable = {disabled: 'disabled'};
                        break;
                    case 'birthdayGiftNum':
                        title = '生日返券张数';
                        addon = {addonText: '张'};
                        break;
                    case 'birthdayGiftValidDays':
                        title = '生日返券有效天数';
                        addon = {addonText: '天'};
                        break;
                    case 'birthdayGiftAdvanceDays':
                        title = '提前返券天数';
                        addon = {addonText: '天'};
                        break;
                }
                return IX.inherit({title: title, name: key, value: $XP(data, key, '0')}, addon, hiddenItems, editable, itemHidden);
            });
            return items;
        }

        function createGiftSetSwitch() {
            $giftSetSwitch = $form.find('input[name$="Gift"]');
            _.each($giftSetSwitch, function (input) {
                var $input = $(input);
                $input.bootstrapSwitch({
                    state: $input.attr('data-status') == 'checked',
                    onColor: 'success',
                    onText: '已启用',
                    offText: '未启用'
                });
            });
            $giftSetSwitch.on('switchChange.bootstrapSwitch', function (el, state) {
                var $this = $(el.target),
                    setType = $this.attr('name'),
                    $giftSet = $this.parents('.form-group').nextAll('[class*=gift]'),
                    setItems = packageSetData(setType);
                if (state) {
                    $giftSet.removeClass('hidden');
                    $giftSet.find('.form-group').removeClass('hidden');
                } else {
                    _.each(setItems, function (item) {
                        $form.bootstrapValidator('resetField', item.name, true);
                    });
                    if (setType == 'birthdayGift') $form.bootstrapValidator('resetField', 'birthdayGiftSMS', true);
                    $giftSet.find('input[name$=GiftID]').val('0');
                    $giftSet.find('input[name$=GiftType]').val('');
                    setType.indexOf('openCard') != -1 ? $form.find('select[name="openCardGiftEffectHours"]').val('0') : $form.find('textarea[name="birthdayGiftSMS"]').val('');
                    $giftSet.addClass('hidden');
                }
            });
        }

        function bindGiftEvent() {
            $form.on('change', '.input-group input[name$="GiftName"]', function () {
                var $this = $(this),
                    giftType = $this.siblings('input[name$="GiftType"]').val(),
                    cardTypes = ['40', '42'], //cardTypes:礼品类型为会员充值和会员积分，这两类礼品没有有效期
                    $giftValidDays = $this.parents('.form-group').nextAll().find('input[name$="GiftValidDays"]'),
                    $giftNum = $this.parents('.form-group').nextAll().find('input[name$="GiftNum"]'),
                    $validDayGroup = $giftValidDays.parents('.form-group'),
                    $giftNumGroup = $giftNum.parents('.form-group');
                if(_.contains(cardTypes, giftType)) {
                    $form.bootstrapValidator('resetField', $giftNum.attr('name'), true);
                    $form.bootstrapValidator('resetField', $giftValidDays.attr('name'), true);
                    $validDayGroup.addClass('hidden');
                    $giftNumGroup.addClass('hidden');
                    $giftValidDays.val('');
                    $giftNum.val('');
                } else {
                    $validDayGroup.removeClass('hidden');
                    $giftNumGroup.removeClass('hidden');
                }
                $form.bootstrapValidator('revalidateField', $(this).attr('name'));
            });
        }
    };
    
    
})(jQuery, window);












