(function ($, window) {
    IX.ns('Hualala.Account');
    IX.ns('Hualala.MCM');
    var SettleCreateOrderFormKeys = ['settleUnitID', 'orderType', 'settleUnitName', 'settleBalance', 'orderTotal', 'interfaceTransWay'];
    var orderDetailCfg = ['settleUnitID', 'orderType', 'settleOrderID', 'orderStatus', 'settleUnitName', 'orderTotal', 'settleBalance'];
    var TransWayOpts = [{label: '支付宝支付', value: '51'}, {label: '微信支付', value: '50'}];
    var SettleRechargeFormCfg = {
        settleUnitID: {
            type: 'hidden',
            defaultVal: ''
        },
        orderType: {
            type: 'hidden',
            defaultVal: '1'
        },
        settleUnitName: {
            type: 'static',
            label: '账户名称',
            defaultVal: ''
        },
        settleBalance: {
            type: 'static',
            label: '当前余额',
            defaultVal: '0'
        },
        orderTotal: {
            type: 'text',
            label: '充值金额',
            defaultVal: '',
            prefix: '￥',
            surfix: '元',
            validCfg: {
                validators: {
                    notEmpty: {message: '充值金额不能为空'},
                    greaterThan: {message: '充值金额必须大于0', value: 0, inclusive: false},
                    regexp: {
                        regexp: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                        message: '充值金额必须是整数不超过8位，小数不超过2位的数字'
                    }
                }
            }
        },
        interfaceTransWay: {
            type: 'radiogrp',
            label: '请选择支付方式',
            defaultVal: '51',
            options: TransWayOpts,
            validCfg: {}
        },
        settleOrderID: {
            type: 'static',
            label: '订单号',
            defaultVal: '',
            validCfg: {}
        },
        orderStatus: {
            type: 'static',
            label: '订单状态',
            defaultVal: '',
            validCfg: {}
        }
    };
    var SettleRechargeFormElsHT = new IX.IListManager();
    _.each(SettleRechargeFormCfg, function(el, k) {
        var type = $XP(el, 'type'),
            labelClz = 'col-sm-offset-1 col-sm-3 control-label',
            ops = [],
            clz = '';
        if(type == 'radiogrp' || type == 'checkboxgrp'){
            ops = _.map($XP(el, 'options'), function (op) {
                return IX.inherit(op, {
                    id: k + '_' + IX.id(),
                    name: k,
                    clz: (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
                });
            });
            clz = 'col-sm-7'
        } else {
            clz = 'col-sm-5';
        }
        var opsObj = ops.length > 0 ? {options: ops} : {};
        SettleRechargeFormElsHT.register(k, IX.inherit(el, opsObj, {
            id: k + '_' + IX.id(),
            name: k,
            clz: clz,
            labelClz: labelClz
        }))
    });
    function mapCreateOrderFormData() {
        var self = this,
            formKeys = self.formKeys;
        return _.map(formKeys, function(key){
            var elCfg = SettleRechargeFormElsHT.get(key),
                value = self.model.get(key) || $XP(elCfg, 'defaultVal', ''),
                type = $XP(elCfg, 'type', 'text'),
                clz = $XP(elCfg, 'clz', '');
            switch (key) {
                case 'settleBalance':
                    value = (self.mode == 'order' ? value : self.parentView.model.get(key)) + '元';
                    break;
                case 'orderTotal':
                    var isOrderView = self.mode == 'order',
                    value = value + (isOrderView ? '' : '元');
                    type = isOrderView ? 'text' : 'static';
                    break;
                case 'interfaceTransWay':
                    _.findWhere(elCfg.options, {value: value}).checked = 'checked';
                    break;
                case 'orderStatus':
                    value = _.contains(['20', '40'], self.model.get(key)) ? '支付成功' : '支付失败';
                    clz = clz + ' order-status'
                    break;
            }
            return IX.inherit(elCfg, {value: value, type: type, clz: clz});
        });
    }
    var settleCreateOrderStep = Stapes.subclass({
        constructor: function(cfg) {
            var self = this;
            this.parentView = $XP(cfg, 'parentView');
            this.$container = $XP(cfg, 'container');
            this.model = $XP(cfg, 'model');
            this.orderModel = $XP(cfg, 'orderModel');
            this.mode = $XP(cfg, 'mode', '');
            this.successFn = $XF(cfg, 'successFn');
            this.failFn = $XF(cfg, 'failFn');
            this.mapFormElsData = $XF(cfg, 'mapFormElsData');
            this.loadTemplate();
            this.initBaseCfg();
            this.renderForm(function() {
                self.bindEvent();
            });
        }
    });
    settleCreateOrderStep.proto({
        loadTemplate: function() {
            var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_base_form')),
                qrcodeTpl = Handlebars.compile(Hualala.TplLib.get('tpl_pay_qrcode')),
                btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
            Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
                return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
            });
            this.set({
                layoutTpl : layoutTpl,
                qrcodeTpl: qrcodeTpl,
                btnTpl : btnTpl
            });
        },
        initBaseCfg: function() {
            this.formKeys = SettleCreateOrderFormKeys;
        },
        renderForm: function (cbFn) {
            var self = this,
                tpl = self.get('layoutTpl'),
                tplData = {
                    formClz: 'form-feedback-out',
                    items: self.mapFormElsData(self)
                };
            self.$container.html(tpl(tplData));
            if(IX.isFn(cbFn)) cbFn();
        },
        bindEvent: function () {
            var self = this,
                fvOpts = self.initValidFieldOpts(),
                $form = self.$container.find('form');
            $form.bootstrapValidator({
                trigger: 'blur',
                fields: fvOpts
            }).on('error.field.bv', function() {
                self.failFn.call(self);
            }).on('success.form.bv', function (e) {
                self.model.emit('createOrder', {
                    params: self.serializeForm(),
                    successFn: function(orderInfo) {
                        self.orderModel.emit('updateOrder',
                            IX.inherit(orderInfo, {settleUnitName: self.model.get('settleUnitName')}));
                        self.successFn.call(self);
                    },
                    failFn: function () {
                        self.failFn.call(self);
                    }
                });
            });
        },
        serializeForm: function() {
            var self = this,
                createOrderParams = ['settleUnitID', 'orderType', 'orderTotal', 'interfaceTransWay'],
                ret = {};
            _.each(createOrderParams, function (key) {
                switch (key) {
                    case 'settleUnitID':
                        ret[key] = self.model.get(key);
                        break;
                    case 'orderType':
                        ret[key] = '1';
                        break;
                    case 'orderTotal':
                        ret[key] = self.$container.find('input[name="' + key + '"]').val();
                        break;
                    case 'interfaceTransWay':
                        ret[key] = self.$container.find('input[name="' + key + '"]:checked').val();
                        break;
                }
            });
            return ret;
        },
        initValidFieldOpts: function() {
            var self = this,
                formKeys = _.select(self.formKeys, function(k) {return k == 'orderTotal';}),
                ret = {};
            _.each(formKeys, function(k) {
                ret[k] = $XP(SettleRechargeFormElsHT.get(k), 'validCfg');
            });
            return ret;
        }
    });
    Hualala.Account.SettleOrderStepView = settleCreateOrderStep;

    Hualala.Account.settleRechargeOrderStep = function($cnt, cntID) {
        var wizardModalView = this,
            stepView = new Hualala.Account.SettleOrderStepView({
                parentView: wizardModalView,
                container: $cnt,
                model: wizardModalView.model,
                orderModel: wizardModalView.orderModel,
                mode: 'order',
                successFn: function () {
                    var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                    self.parentView.getNextStep();
                },
                failFn: function() {
                    var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                },
                mapFormElsData: mapCreateOrderFormData
            });
        wizardModalView.registerStepView(cntID, stepView);
    };

    var SettlePayStepView = Hualala.Account.SettleOrderStepView.subclass({
        constructor: function(cfg) {
            var self = this,
                currentHost = window.location.host.split('.');
            this.$container = $XP(cfg, 'container');
            this.parentView = $XP(cfg, 'parentView');
            this.mode = $XP(cfg, 'mode', '');
            this.model = $XP(cfg, 'model', '');
            this.successFn = $XF(cfg, 'successFn');
            this.failFn = $XF(cfg, 'failFn');
            this.mapFormElsData = $XF(cfg, 'mapFormElsData');
            this.qrcodeHost = currentHost[0] == 'dianpu' ? '' : (currentHost[0] + '.');
            this.intervalCheckOrderTask = null;
            this.intervalCheckOrderCount = 0;
            this.loadTemplate();
            this.initBaseCfg();
            this.bindEvent();
            this.renderTab();
        }
    });
    SettlePayStepView.proto({
        initBaseCfg: function() {
            var self = this,
                orderBaseCfg = IX.clone(SettleCreateOrderFormKeys);
            orderBaseCfg.splice(2, 0, 'settleOrderID');
            orderBaseCfg = _.reject(orderBaseCfg, function(key) {
                return key == 'interfaceTransWay';
            });
            self.formKeys = orderBaseCfg;
        },
        renderTab: function() {
            var self = this;
            self.renderForm(function() {
                var qrcodeContent = self.model.get('qrCodeUrl'),
                    qrcodeImgUrl = qrcodeContent ? ('http://' + self.qrcodeHost + 'api.hualala.com/Qrcode.jsp?chl=' + qrcodeContent) : '';
                self.renderQrcode(qrcodeImgUrl);
            });
        },
        renderQrcode: function(qrcodeImgUrl) {
            var self = this,
                transwayLabel = self.model.get('interfaceTransWay') == 50 ? '微信' : '手机支付宝';
            self.$container.find('form').append(self.get('qrcodeTpl')({transwayLabel: transwayLabel, qrcodeImg: qrcodeImgUrl}));
            if(qrcodeImgUrl) {
                self.emit('disabledButtons');
                self.emit('intervalCheckOrderStatus');
            }
        },
        refresh: function() {
            var self = this;
            self.$container.empty();
            self.renderTab();
        },
        bindEvent: function() {
            var self = this;
            self.on({
                'disabledButtons': function () {
                    self.parentView.switchWizardCtrlStatus('loading');
                },
                'activeButtons': function() {
                    self.parentView.switchWizardCtrlStatus('reset');
                },
                'intervalCheckOrderStatus': function() {
                    self.intervalCheckOrderTask = setInterval(function() {
                        if(self.intervalCheckOrderCount >= 36) {
                            self.emit('stopIntervalCheckOrder');
                            self.failFn();
                            return;
                        } else {
                            self.model.emit('checkOrderStatus', {
                                successFn: function() {
                                    var isPaySuccess = _.contains(['20', '40'], self.model.get('orderStatus'));
                                    if(isPaySuccess) {
                                        var beforePayBalance = self.parentView.model.get('settleBalance'),
                                            afterPayBalance = isPaySuccess ? Hualala.Common.Math.prettyPrice(parseFloat(beforePayBalance)
                                                + parseFloat(self.model.get('orderTotal'))) : beforePayBalance;
                                        self.parentView.model.set({settleBalance: afterPayBalance});
                                        self.parentView.parentView.emit('updateSettleBalance', self.parentView.model);
                                    }
                                    self.emit('stopIntervalCheckOrder');
                                    self.successFn();
                                },
                                failFn: function() {}
                            });
                            self.intervalCheckOrderCount = self.intervalCheckOrderCount + 1;
                        }
                    }, 5000);
                },
                'stopIntervalCheckOrder': function() {
                    clearInterval(self.intervalCheckOrderTask);
                    self.intervalCheckOrderCount = 0;
                }
            });
            self.model.on({
                    'triggerCheckOrder': function () {
                        self.model.emit('checkOrderStatus', {
                            successFn: function() {
                                var isPaySuccess = _.contains(['20', '40'], self.model.get('orderStatus'));
                                if(isPaySuccess) {
                                    var beforePayBalance = self.parentView.model.get('settleBalance'),
                                        afterPayBalance = isPaySuccess ? Hualala.Common.Math.prettyPrice(parseFloat(beforePayBalance)
                                            + parseFloat(self.model.get('orderTotal'))) : beforePayBalance;
                                    self.parentView.model.set({settleBalance: afterPayBalance});
                                    self.parentView.parentView.emit('updateSettleBalance', self.parentView.model);
                                }
                                self.successFn();
                            },
                            failFn: function() {
                                self.successFn();
                            }
                        });
                    }}
            );
        }
    });
    Hualala.Account.SettlePayStepView = SettlePayStepView;

    Hualala.Account.settleRechargePayStep = function($cnt, cntID) {
        var wizardModalView = this,
            stepView = new Hualala.Account.SettlePayStepView({
                container: $cnt,
                parentView: wizardModalView,
                mode: 'pay',
                model: wizardModalView.orderModel,
                successFn: function() {
                    var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                    self.parentView.getNextStep();
                },
                failFn: function() {
                    var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                },
                mapFormElsData: mapCreateOrderFormData
            });
        wizardModalView.registerStepView(cntID, stepView);
    };

    settleRechargePreviewStep = Hualala.Account.SettleOrderStepView.subclass({
        constructor: function(cfg) {
            var self = this;
            this.parentView = $XP(cfg, 'parentView');
            this.$container = $XP(cfg, 'container');
            this.model = $XP(cfg, 'model');
            this.mode = $XP(cfg, 'mode');
            this.mapFormElsData = $XF(cfg, 'mapFormElsData');
            this.loadTemplate();
            this.initBaseCfg();
            this.renderForm(function() {
                self.renderOrderStatus();
            });
        }
    });
    settleRechargePreviewStep.proto({
        initBaseCfg: function() {
            var self = this;
            self.formKeys = orderDetailCfg;
        },
        renderOrderStatus: function() {
            var self = this;
            if(!_.contains(['20', '40'], self.model.get('orderStatus'))){
                var $payWarning = $('<p>若支付遇到问题，请联系客服</p><p>4006-527-557(9:00-21:00)</p>');
                self.$container.find('.order-status').append($payWarning)
            }
        },
        refresh: function() {
            var self = this;
            self.$container.empty();
            self.renderForm();
        }
    });
    Hualala.Account.SettlePreviewStepView = settleRechargePreviewStep;

    Hualala.Account.settleRechargePreviewStep = function($cnt, cntID) {
        var wizardModalView = this,
            stepView = new Hualala.Account.SettlePreviewStepView({
                parentView: wizardModalView,
                container: $cnt,
                model: wizardModalView.orderModel,
                mode: 'preview',
                mapFormElsData: mapCreateOrderFormData
            });
        wizardModalView.registerStepView(cntID, stepView);
    };

    Hualala.Account.settleRechargeOrderCtrl = function() {
        var self = this,
            $footer = self.$body.find('.wizard-ctrl'),
            $btnNext = $footer.find('.btn-next');
        $footer.find('.btn-cancel').removeClass('hidden');
        $footer.find('.btn-prev').addClass('hidden');
        $footer.find('.btn-finish').addClass('hidden');
        $btnNext.data('resetText', '立即充值');
        $footer.find('button').button('reset');
    };

    Hualala.Account.settleRechargePayCtrl = function() {
        var self = this,
            $footer = self.$body.find('.wizard-ctrl'),
            $btnNext = $footer.find('.btn-next');
        $footer.find('.btn-cancel').addClass('hidden');
        $footer.find('.btn-finish').addClass('hidden');
        $footer.find('.btn-prev').removeClass('hidden');
        $btnNext.data('resetText', '支付完成');
    };

    Hualala.Account.settleRechargePreviewCtrl = function() {
        var self = this,
            $footer = self.$body.find('.wizard-ctrl'),
            $btnNext = $footer.find('.btn-next');
        $footer.find('.btn-cancel').addClass('hidden');
        $footer.find('.btn-prev').addClass('hidden');
        $btnNext.addClass('hidden');
        $footer.find('.btn-finish').removeClass('hidden');
        $footer.find('button').button('reset');
    };

    Hualala.Account.settleRechargeStepChange = function($curNav, $navBar, cIdx, nIdx){
        var wizardModalView = this,
            nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
            nextView = wizardModalView.getStepView(nextID),
            $nextCnt = $('#' + nextID, wizardModalView.$wizard),
            stepsFn = [
                'settleRechargeOrderStep',
                'settleRechargePayStep',
                'settleRechargePreviewStep'
            ],
            ctrlsFn = [
                'settleRechargeOrderCtrl',
                'settleRechargePayCtrl',
                'settleRechargePreviewCtrl'
            ];
        if(cIdx == -1 || nIdx == 0) {
            if(cIdx == 1 && nIdx == 0) Hualala.Account[ctrlsFn[nIdx]].call(wizardModalView);
            return true;
        }
        if(!nextView) {
            Hualala.Account[stepsFn[nIdx]].call(wizardModalView, $nextCnt, nextID);
        } else {
            (nIdx == 1 || nIdx == 2) && nextView.refresh();
        }
        Hualala.Account[ctrlsFn[nIdx]].call(wizardModalView);
    };

    Hualala.Account.settleRechargeCommit = function(curID) {
        var wizardModalView = this,
            stepView = wizardModalView.getStepView(curID),
            $cnt = stepView.$container,
            bv = $cnt.find('form').data('bootstrapValidator');
        wizardModalView.switchWizardCtrlStatus('loading');
        if(curID == 'create_order') {
            bv.validate();
        } else if(curID == 'scan_pay'){
            stepView.model.emit('triggerCheckOrder');
        }else if(curID == 'order_detail') {
            wizardModalView.modal.hide();
        }
    };

    Hualala.Account.bundleWizardEvent = function() {
        //绑定每一步的取消事件
        var wizardModalView = this;
        wizardModalView.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function () {
            //第一步取消直接关闭模态框
            //第二步取消 结束轮询 并关闭模态框
            //第三步 取消直接关闭模态框
            var $btn = $(this),
                curIdx = wizardModalView.$wizard.bsWizard('currentIndex'),
                cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
                stepView = wizardModalView.getStepView(cntID);
            if(curIdx == 0 || curIdx == 2) {
                wizardModalView.modal.hide();
            } else {
                //需要结束轮询
                stepView.emit('stopIntervalCheckOrder');
                wizardModalView.modal.hide();
            }
        });
    };
})(jQuery, window);