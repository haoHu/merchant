(function (window, $) {
    IX.ns('Hualala.CRM');
    IX.ns('Hualala.MCM');
    var editSetTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_add_update')),
        giftSetTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_gift')),
        vipLevelTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_vip_level')),
        wizardLayoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_wizard_layout'));

    var wizardNavCfg = [
            {id : "recharge_base_info", label : "基本信息"},
            {id : "recharge_gift", label : "优惠券设置"},
        ],
        wizardBtnCfg = [
            {clz: 'btn btn-default btn-prev', name: 'prev', label: '上一步', loadingText: '请稍后…'},
            {clz: 'btn btn-default btn-cancel', name: 'cancel', label: '取消', loadingText: '取消', dismiss: 'modal'},
            {clz: 'btn btn-default btn-next', name: 'next', label: '下一步', loadingText: '请稍后…'},
            {clz: 'btn btn-default btn-finish', name: 'finish', label: '保存', loadingText: '保存中…'}
        ];
    var levels = null, editData = null, modal = null, baseInfoBv = null, giftInfoBv = null,
        $editSet = null, $giftSet = null, $wizard = null;

    function initModal(setID) {
        var modalTitle = setID ? '修改会员充值套餐' : '添加会员充值套餐';
        modal = Hualala.UI.ModalDialog({
            id : "crm_wizard_modal",
            clz : 'recharge-modal',
            title : modalTitle,
            hideCloseBtn : true,
            backdrop : 'static',
            showFooter : false,
            afterHide: function () {
                $giftSet = null;
            }
        }).show();
    }

    function renderWizardLayout() {
        //modal的footer
        Handlebars.registerPartial("stepAction", Hualala.TplLib.get('tpl_shop_modal_btns'));
        Handlebars.registerPartial("giftTpl", Hualala.TplLib.get('tpl_crm_gift_ticket'));
        modal._.body.html(wizardLayoutTpl(mapWizardLayoutData()));
    }

    function mapWizardLayoutData () {
        var steps = [],
            stepNavs = _.map(wizardNavCfg, function (step, i) {
            steps.push({
                id : $XP(step, 'id')
            });
            return IX.inherit(step, {
                idx : (i + 1)
            });
        });
        return {
            id: 'crm_wizard',
            clz : 'recharge-wizard',
            stepNavs : stepNavs,
            steps : steps,
            btns : wizardBtnCfg
        }
    }

    function initWizard() {
        $wizard = modal._.body.find('#crm_wizard');
        $wizard.bsWizard({
            tabClass: 'tabClass',
            nextSelector: '.btn[name="next"]',
            previousSelector: '.btn[name="prev"]',
            finishSelector: '.btn[name="finish"]',
            onInit: function(wizard, $navBar, nIdx) {
                var $tab = $('li:eq(' + nIdx + ')', $wizard),
                    cntID = getTabContentIDByIndex($navBar, nIdx),
                    $cnt = $('#' + cntID, $wizard);
                initBaseInfoStep($cnt);
            },
            onTabClick: function () { return false; },
            onPrevious: function ($curNav, $navBar, nIdx) {
            //点击上一步，初始化参数设置的基本信息
                return giftInfoBv.validate().isValid();
            },
            onNext: function ($curNav, $navBar, nIdx) {
            //控制进入下一步
                if(nIdx == 1) {
                    var startDate = $editSet.find('[name="startDate"]').val().replace(/\//g, ''),
                        endDate = $editSet.find('[name="endDate"]').val().replace(/\//g, '');
                    if(parseInt(startDate) - parseInt(endDate) > 0) {
                        Hualala.UI.TopTip({msg: '结束日期不能小于开始日期', type: 'danger'});
                        $editSet.find('input[name="startDate"]').next('i').css('display', 'none');
                        $editSet.bootstrapValidator('updateStatus', 'endDate', 'INVALID', 'empty');
                        return false;
                    }
                    return baseInfoBv.validate().isValid();
                }
            },
            onFinish: function ($curNav, $navBar, cIdx) {
            //提交优惠券设置
                wizardStepCommit($curNav, $navBar, cIdx);
            },
            onTabChange: function ($curNav, $navBar, cIdx, nIdx) {
                //初始化tab页的内容
                wizardStepChange($curNav, $navBar, cIdx, nIdx);
            }
        });
    }

    function bindEvent() {
        $wizard.on('click', '.wizard-ctrl .btn-cancel', function () {
            //绑定取消事件
            Hualala.UI.Confirm({
                title: '取消会员参数设置',
                msg: '确定要取消当前编辑的内容吗？',
                okLabel: '确定',
                okFn: function () {
                    modal.hide();
                }
            });
        }).on('click', 'form.gift-set .form-group .input-group .input-group-btn button', function () {
            //绑定选择礼品事件
            var ticketType = 10,//电子代金券对应的giftType的值
                $this = $(this),
                $giftID = $this.parent().prevAll('input[name^=EGiftID]'),
                $giftName = $this.parent().prevAll('input[name^=EGiftName]'),
                pickGiftModal = new Hualala.MCM.PickGiftModal({
                    trigger: $this,
                    selectedFn: function (gift, $triggerEl) {
                        var giftID = $XP(gift, 'giftItemID', ''),
                            giftName = $XP(gift, 'giftName', '');
                        $giftID.val(giftID);
                        $giftName.val(giftName).trigger('change');
                    },
                    selectGiftType: [ticketType]
                });
        }).on('change', 'form.gift-set .input-group input[name^=EGiftName]', function () {
            $giftSet.bootstrapValidator('revalidateField', $(this).attr('name'));
        });
    }

    function renderVipLevelSelect($select, levelID) {
        if (levels)
            $select.append(vipLevelTpl({levels: levels})).val(levelID);
        else {
            Hualala.Global.getVipLevels({}, function (rsp) {
                if (rsp.resultcode != '000') {
                    rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }

                levels = filterVipLevels(rsp.data.records);
                $select.append(vipLevelTpl({levels: levels})).val(levelID);
            });
        }
    }

    function filterVipLevels (levels) {
        var ret = [];
        for (var i = 0, level; level = levels[i]; i++)
            if (+level.isActive) ret.push(level);

        return ret;
    }

    function registerBaseInfoValidate() {
        $editSet.bootstrapValidator({
            fields: {
                startDate: {
                    validators: {
                        date: {
                            format: 'YYYY/MM/DD',
                            message: '开始日期格式不正确'
                        },
                        notEmpty: {message: '开始日期不能为空'}
                    }
                },
                endDate: {
                    validators: {
                        date: {
                            format: 'YYYY/MM/DD',
                            message: '结束日期格式不正确'
                        }
                    }
                },
                setName: {
                    validators: {
                        notEmpty: { message: '套餐名不能为空' }
                    }
                },
                setSaveMoney: {
                    validators: {
                        notEmpty: { message: '充值金额不能为空' },
                        greaterThan: { inclusive: false, value: 0, message: '充值金额必须大于0' },
                        regexp: {
                            regexp: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                            message: '请输入大于0的值，整数不超过8位，小数不超过2位'
                        }

                    }
                },
                returnMoney: {
                    validators: {
                        regexp: {
                            regexp: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                            message: '请输入不小于0的值，整数不超过8位，小数不超过2位'
                        }
                    }
                },
                returnPoint: {
                    validators: {
                        regexp: {
                            regexp: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                            message: '请输入不小于0的值，整数不超过8位，小数不超过2位'
                        }
                    }
                }
            }
        });
    }

    function registerGiftInfoValidate() {
        $giftSet.bootstrapValidator({
            excluded: ':hidden',
            fields: {
                EGiftName_1: {
                    validators: {notEmpty: {message: '名称不能为空'}}
                },
                EGiftName_2: {
                    validators: {notEmpty: {message: '名称不能为空'}}
                },
                EGiftCount_1: {
                    validators: {
                        notEmpty: {message: '数量不能为空'},
                        integer: {message: '必须是整数'},
                        between: {message: '必须是1-10的值', min: 1, max: 10}
                    }
                },
                EGiftCount_2: {
                    validators: {
                        notEmpty: {message: '数量不能为空'},
                        integer: {message: '必须是整数'},
                        between: {message: '必须是1-10的值', min: 1, max: 10}
                    }
                },
                EGfitValidUntilDayCount_1: {
                    validators: {
                        notEmpty: {message: '有效天数不能为空'},
                        integer: {message: '必须是整数'},
                        between: {message: '必须是1-999的值', min: 1, max: 999}
                    }
                },
                EGfitValidUntilDayCount_2: {
                    validators: {
                        notEmpty: {message: '有效天数不能为空'},
                        integer: {message: '必须是整数'},
                        between: {message: '必须是1-999的值', min: 1, max: 999}
                    }
                }
            }
        });
    }

    function initBaseInfoStep($cnt, cntID, wizardMode, setid) {
        $editSet = $(editSetTpl(editData));
        $cnt.html($editSet);
        var $select = $editSet.find('select'),
            $isOpen = $editSet.find('input[name="isOpen"]');
        renderVipLevelSelect($select, editData.switchCardLevelID || 0);
        registerBaseInfoValidate();
        baseInfoBv = $editSet.data('bootstrapValidator');
        $isOpen.bootstrapSwitch({
            state: $isOpen.data('status') == 1,
            onText: '已启用',
            offText: '未启用',
            onColor: 'success'
        });
        $editSet.find('input[name="startDate"],input[name="endDate"]').datetimepicker({
            format: 'yyyy/mm/dd',
            startDate: '2015/01/01',
            autoclose: true,
            minView: 'month',
            todayBtn: true,
            todayHighlight: true,
            language: 'zh-CN'
        });
        $editSet.on('change', '[name="startDate"],[name="endDate"]', function (e) {
            var $this = $(this);
            $editSet.bootstrapValidator('revalidateField', $this.attr('name'));
        });
    }

    function initRechargeGift($navBar, cIdx, nIdx) {
        var gift1_keys = ['EGiftID_1', 'EGiftName_1', 'EGiftCount_1', 'EGfitValidUntilDayCount_1', 'EGiftEffectTimeHours_1'],
            gift2_keys = ['EGiftID_2', 'EGiftName_2', 'EGiftCount_2', 'EGfitValidUntilDayCount_2', 'EGiftEffectTimeHours_2'],
            $cnt = $('#' + getTabContentIDByIndex($navBar, nIdx)),
            gift1 = editData.EGiftID_1 ? _.pick(editData, gift1_keys) : _.object(gift1_keys, ['0', '', '0', '0', '0']),
            gift2 = editData.EGiftID_2 ? _.pick(editData, gift2_keys) : _.object(gift2_keys, ['0', '', '0', '0', '0']),
            gifts = [];
        _.each([gift1, gift2], function (gift, idx, obj) {
            gifts[idx] = {};
            _.each(gift, function (val, key, obj) {
                var strlen = key.length - 2;
                gifts[idx][key.substr(0, strlen)] = val;
            });
            gifts[idx]['checked'] = (!gifts[idx]['EGiftID'] || gifts[idx]['EGiftID'] == 0) ? '' : 'checked';
            gifts[idx]['index'] = idx + 1;
        });
        $giftSet = $(giftSetTpl({gifts: gifts}));
        createGiftSwitch();
        $cnt.append($giftSet);
        renderTimeEffectSelect(gifts);
        registerGiftInfoValidate();
        giftInfoBv = $giftSet.data('bootstrapValidator');
    }

    function renderTimeEffectSelect(gifts){
        var customSelect = Handlebars.compile(Hualala.TplLib.get('tpl_select')),
            options = [
                {value: '0', name: '立即生效'},
                {value: '3', name: '3小时'},
                {value: '6', name: '6小时'},
                {value: '9', name: '9小时'},
                {value: '12', name: '12小时'},
                {value: '18', name: '18小时'},
                {value: '24', name: '1天'}];
        _.each(gifts, function (gift, idx, obj) {
            options = _.map(options, function (option) {
                return _.omit(option, 'selected');
            });
            var option = _.findWhere(options, {value: gift.EGiftEffectTimeHours}),
                $timeEffect = $giftSet.find('.form-group [name="effect_hour"]').eq(idx);
            if(option) option['selected'] = 'selected';
            $timeEffect.append($(customSelect({options: options, name: 'EGiftEffectTimeHours_' + (idx + 1)})));
        });
    }

    function wizardStepChange($curNav, $navBar, cIdx, nIdx) {
        var curID = getTabContentIDByIndex($navBar, cIdx),
            nextID = getTabContentIDByIndex($navBar, nIdx),
            $nextCnt = $('#' + nextID, $wizard);
        if (cIdx == -1 && nIdx == 0) return true;
        if(cIdx == 0 && nIdx == 1 && !$giftSet) initRechargeGift($navBar, cIdx, nIdx);
        return true;
    }
    function wizardStepCommit($curNav, $navBar, cIdx) {
        if(!giftInfoBv.validate().isValid()) return;
        var baseData = Hualala.Common.parseForm($editSet),
            giftData = Hualala.Common.parseForm($giftSet),
            data = IX.inherit({}, baseData, giftData);
        data.returnMoney = data.returnMoney || 0;
        data.returnPoint = data.returnPoint || 0;
        data.startDate = data.startDate.replace(/\//g, '');
        data.endDate = (data.endDate || '30001231').replace(/\//g, '');
        data.isOpen = $editSet.find('input[name="isOpen"]').bootstrapSwitch('state') ? '1' : '0';
        _.each($giftSet.find('.input-group input[name^="EGiftName_"]'), function (input) {
            data[$(input).attr('name')] = $(input).val();
        });
        data = _.omit(data, 'gift');
        var isAdd = editData.saveMoneySetID ? false : true;
        if(!isAdd) data.saveMoneySetID = editData.saveMoneySetID;
        Hualala.Global[isAdd ? 'addCrmRechargeSet' : 'updateCrmRechargeSet'](data, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            Hualala.UI.TopTip({msg: '操作成功', type: 'success'});
            Hualala.CRM.RenderSets();
            modal.hide();
        });
    }

    function getTabContentIDByIndex($navBar, idx) {
        var $tab = $('li:eq(' + idx + ')', $navBar),
            id = $tab.find('a[data-toggle]').attr('href').replace('#', '');
        return id;
    }

    function createGiftSwitch() {
        var $checkbox = $giftSet.find('input[type="checkbox"][name="gift"]');
        _.each($checkbox, function (input) {
            var $input = $(input);
            $input.bootstrapSwitch({
                state: $input.attr('data-status') == 'checked',
                onColor: 'success',
                onText: '已启用',
                offText: '未启用'
            });
        });
        $checkbox.on('switchChange.bootstrapSwitch', function (el, state) {
            //绑定选择优惠券事件
            var $this = $(el.target),
                $giftInfo = $this.parents('.form-group').next('.gift-info');
            if (state) {
                $giftInfo.removeClass('hidden');
            } else {
                _.each($giftInfo.find('select[name^="EGiftEffect"],input[name^="EGift"],input[name^="EGfitValidUntilDayCount"]'), function (input) {
                    var inputName = $(input).attr('name');
                    if(!/^EGift(EffectTimeHours|ID)_\d$/.test(inputName)) $giftSet.bootstrapValidator('resetField', inputName, true);
                    if(!/^EGiftName_\d$/.test(inputName)) $(input).val(0);
                });
                $giftInfo.addClass('hidden');
            }
            modal._.dialog.data('bs.modal').handleUpdate();

        });
    }

    var renderWizard = function(record) {
        //编辑的数据
        editData = IX.clone(record);
        //处理充值日期
        var startDate = record.startDate == 0 ? IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd') : record.startDate,
            endDate = record.endDate == 0 ? IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd') : record.endDate;
        editData.startDate = Hualala.Common.formatDateStr(startDate || '');
        editData.endDate = Hualala.Common.formatDateStr(endDate || '');
        var setid = editData.saveMoneySetID;
        //初始化modal
        initModal(setid);
        //渲染wizard模板的数据
        renderWizardLayout();
        //初始化wizard
        initWizard();
        //绑定事件
        bindEvent();
    };
    Hualala.CRM.RenderWizard = renderWizard;

})(window, jQuery);