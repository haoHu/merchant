(function ($, window) {
	IX.ns("Hualala.MCM");
	var currentDate = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyy/MM/dd');
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var EventSetFormElsHT = HMCM.EventSetFormElsHT;

	var EventRuleFormKeys = 'chkDeductPoints,deductPoints,chkSendPoints,sendPoints,radioCountCycleDays,partInTimes,maxPartInPerson'.split(','),
		EventCustomerRangeKeys = 'cardLevelID,isVipBirthdayMonth'.split(','),
        EventSMSTemplateKeys = 'eventID,smsTemplate'.split(','),
        smsDefaultAttr = {
			receiverName: 'XXX', receiverSex: '先生', cardName: '金卡', cardLastFourNumber: '8888',
			giftName: '50元代金券', cardCount: 1,
			cardValidDate: currentDate
		};

	/**
	 * 整理活动规则表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventRuleFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = EventSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'section') {
				var eventStartDate = self.model.get('eventStartDate') || '',
					eventEndDate = self.model.get('eventEndDate') || '';
				eventStartDate = (IX.isEmpty(eventStartDate) || eventStartDate == 0) ? '' : eventStartDate;
				eventEndDate = (IX.isEmpty(eventEndDate) || eventEndDate == 0) ? '' : eventEndDate;
				return IX.inherit(elCfg, {
					min : IX.inherit($XP(elCfg, 'min'), {
						value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(eventStartDate), 'yyyy/MM/dd')
					}),
					max : IX.inherit($XP(elCfg, 'max'), {
						value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(eventEndDate), 'yyyy/MM/dd')
					})
				});
			} else if (type == 'checkboxgrp' && key == 'chkDeductPoints') {
				var v = self.model.get('deductPoints') || 0,
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							checked : v > 0 ? 'checked' : ''
						});
					});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'checkboxgrp' && key == 'chkSendPoints') {
				var v = self.model.get('sendPoints') || 0,
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							checked : v > 0 ? 'checked' : ''
						});
					});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'radiogrp' && key == 'radioCountCycleDays') {
				var countCycleDays = self.model.get('countCycleDays') || 0,
					partInTimes = self.model.get('partInTimes') || 0,
					v = 0;
				if (countCycleDays == 0 && partInTimes == 0) {
					v = 0;
				} else if (countCycleDays != 0 && partInTimes != 0) {
					v = 2;
				} else {
					v = 1;
				}
				var options = _.map($XP(elCfg, 'options'), function (op) {
					return IX.inherit(op, {
						checked : v == $XP(op, 'value') ? 'checked' : ''
					});
				});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'inputCountCycleDays') {
				var countCycleDays = self.model.get('countCycleDays') || 0,
					partInTimes = self.model.get('partInTimes') || 0;
				return IX.inherit(elCfg, {
					countCycleDays : IX.inherit($XP(elCfg, 'countCycleDays'), {
						options : _.map($XP(elCfg, 'countCycleDays.options'), function (el) {
							return IX.inherit(el, {
								selected : $XP(el, 'value') == countCycleDays ? 'selected' : ''
							});
						})
					}),
					partInTimes : IX.inherit($XP(elCfg, 'partInTimes'), {
						value : partInTimes
					})
				});
			} else if (type == 'combo') {
				var v = self.model.get(key) || $XP(elCfg, 'defaultVal'),
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							selected : $XP(op, 'value') == v ? 'selected' : ''
						});
					});
				return IX.inherit(elCfg, {
					disabled : (self.mode == 'edit' && key == 'giftType') ? 'disabled' : '',
					value : v,
					options : options
				});
			} else if (type == 'radiogrp' || type == 'checkboxgrp') {
				var v = self.model.get(key) || $XP(elCfg, 'defaultVal');
				if (type == 'checkboxgrp') {
					v = v.split(',');
				}
				var options = _.map($XP(elCfg, 'options'), function (op) {
						
						var checked = type == 'checkboxgrp' ? (_.contains(v, $XP(op, 'value') + '') ? true : false) : ($XP(op, 'value') == v);
						return IX.inherit(op, {
							checked : checked ? 'checked' : ''
						});
					});
				return IX.inherit(elCfg, {
					options : options
				});
			} else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'defaultVal')
				});
			}
		});
		return ret;
	};

	var EventRuleStepView = HMCM.EventBaseInfoStepView.subclass({
		constructor : HMCM.EventBaseInfoStepView.prototype.constructor
	});
	EventRuleStepView.proto({
		initBaseCfg : function () {
			this.formKeys = EventRuleFormKeys;
		},
		initUIComponents : function () {
			var self = this;
			var eventWay = self.model.get('eventWay');
			self.initDatePicker();
			self.setSwitcherLayout(self.container.find(':checkbox[name=chkDeductPoints]'));
			self.setSwitcherLayout(self.container.find(':checkbox[name=chkSendPoints]'));
			self.setRadioCountCycleDaysLayout(self.container.find(':radio[name=radioCountCycleDays]'));
			if (eventWay != 22) {
				self.container.find(':text[name=maxPartInPerson]').parents('.form-group').hide();
			} else {
				self.container.find(':text[name=maxPartInPerson]').parents('.form-group').show();
			}
			if(eventWay== 30){
				self.container.find(':checkbox[name=chkSendPoints],:text[name=sendPoints]').parents('.form-group').hide();
			}
			if (eventWay == 40 || eventWay == 41) {
				if(eventWay ==41){
					self.container.find(':radio[name=radioCountCycleDays]').parents('.form-group').hide();
				}
				self.container.find(':checkbox[name=chkDeductPoints],:text[name=deductPoints]').parents('.form-group').hide();
				// self.container.find(':text[name=deductPoints]').parents('.form-group').hide();
				var $el = self.container.find(':checkbox[name=chkSendPoints]').clone(true),
					$box = self.container.find(':checkbox[name=chkSendPoints]').parent();
				$box.empty().append($el).append('分享人获得积分');
			} else {
				self.container.find(':checkbox[name=chkDeductPoints],:text[name=deductPoints]').parents('.form-group').show();
				var $el = self.container.find(':checkbox[name=chkSendPoints]').clone(true),
					$box = self.container.find(':checkbox[name=chkSendPoints]').parent();
				$box.empty().append($el).append('参与活动赠送积分');
			}
		},
		initDatePicker : function () {
			var self = this;
			self.container.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
		},
		bindEvent : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts();
			self.container.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				self.failFn(self.model);
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				var act = self.mode + 'Event';
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: Event Wizard Form Params:");
				IX.Debug.info(formParams);
				// self.model.emit(act, {
				// 	params : formParams,
				// 	failFn : function () {
				// 		self.failFn.call(self);
				// 	},
				// 	successFn : function () {
				// 		self.successFn.call(self);
				// 		self.switchViewMode('edit');
				// 		// self.parentView.modal.hide();
				// 	}
				// });
				self.model.emit('editEvent', {
					params : formParams,
					faildFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.successFn.call(self);
						self.switchViewMode('edit');
						// self.parentView.modal.hide();
					}
				});
			});
			self.container.find(':checkbox[name=chkDeductPoints]').on('change', function (e) {
				self.setSwitcherLayout($(this));
				
			});
			self.container.find(':checkbox[name=chkSendPoints]').on('change', function (e) {
				self.setSwitcherLayout($(this));
			});
			self.container.find(':radio[name=radioCountCycleDays]').on('change', function (e) {
				self.setRadioCountCycleDaysLayout($(this));
			});
			self.container.find('form [data-type=datetimepicker]').on('change', function (e) {
				var $this = $(this),
					name = $this.attr('name');
				self.container.find('form').bootstrapValidator('revalidateField', name);
			});
		},
		setSwitcherLayout : function ($chk) {
			var checked = $chk.is(':checked');
			var $nextFormGroup = $chk.parents('.form-group').next('.form-group');
			$nextFormGroup[checked ? 'removeClass' : 'addClass']('hidden');
			$nextFormGroup.find(':text').attr('disabled', checked ? false : true);
		},
		setRadioCountCycleDaysLayout : function ($radio) {
			var self = this;
			var val = self.getRadiboxVal($radio.attr('name'));
			var $nextFormGroup = $radio.parents('.form-group').next('.form-group'),
				$els = $nextFormGroup.find('.cycle-label, select[name=countCycleDays]'),
				$text = $nextFormGroup.find(':text[name=partInTimes]');
			if (val == 0) {
				$nextFormGroup.hide();
				$text.attr('disabled', true);
			} else if (val == 1) {
				$nextFormGroup.show();
				$els.addClass('hidden');
				$text.attr('disabled', false);
			} else {
				$nextFormGroup.show();
				$els.removeClass('hidden');
				$text.attr('disabled', false);
			}
		},
		getCheckboxVal : function (name) {
			var self = this;
			var checkbox = $(':checkbox[name=' + name + ']:checked');
			var ret = [];
			checkbox.each(function (el) {
				var $this = $(this);
				ret.push($this.val());
			});
			return ret.join(',');
		},
		getRadiboxVal : function (name) {
			var self = this;
			var radiobox = $(':radio[name=' + name + ']:checked');
			return radiobox.val();
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (key == 'dateRange') {
					ret['eventStartDate'] = $XP(elCfg, 'min.validCfg', {});
					ret['eventEndDate'] = $XP(elCfg, 'max.validCfg', {});
				} else if (key == 'partInTimes') {
					ret['partInTimes'] = $XP(elCfg, 'partInTimes.validCfg', {});
				} else {
					ret[key] = $XP(elCfg, 'validCfg', {});	
				}
				
			});
			return ret;
		},
		serializeForm : function () {
			// 	var EventRuleFormKeys = 'dateRange,chkDeductPoints,deductPoints,chkSendPoints,sendPoints,radioCountCycleDays,partInTimes,isVipBirthdayMonth,maxPartInPerson'.split(',');
			var self = this,
				formKeys = self.formKeys,
				ret = {};

			var getDateRange = function () {
				var start = IX.Date.getDateByFormat($(':text[name=eventStartDate]', self.container).val(), 'yyyyMMdd'),
					end = IX.Date.getDateByFormat($(':text[name=eventEndDate]', self.container).val(), 'yyyyMMdd');
				return {eventStartDate : start, eventEndDate : end};
			};
			var getDeductPoints = function () {
				var eventWay = self.model.get('eventWay');
				if (eventWay == 40 || eventWay == 41) {
					return 0;
				} else if (!$(':checkbox[name=chkDeductPoints]', self.container).is(':checked')) {
					return 0;
				} else {
					return $(':text[name=deductPoints]', self.container).val();
				}
			};
			var getSendPoints = function () {
				var eventWay = self.model.get('eventWay');
				if (!$(':checkbox[name=chkSendPoints]', self.container).is(':checked')) {
					return 0;
				} else {
					return $(':text[name=sendPoints]', self.container).val();
				}
			};
			var getPartinTimesSet = function () {
				var radioVal = self.getRadiboxVal('radioCountCycleDays');
				var countCycleDays = 0, partInTimes = 0;
				countCycleDays = radioVal < 2 ? 0 : $('[name=countCycleDays]', self.container).val();
				partInTimes = radioVal == 0 ? 0 : $(':text[name=partInTimes]', self.container).val();
				return {
					countCycleDays : countCycleDays,
					partInTimes : partInTimes
				};
			};

			var formEls = _.map(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				var v = null;
				switch (key) {
					case 'dateRange':
							v = getDateRange();
							ret = IX.inherit(ret, v);
						break;
					case 'chkDeductPoints':
					case 'chkSendPoints':
					case 'radioCountCycleDays':
						break;
					case 'deductPoints':
						v = getDeductPoints();
						ret['deductPoints'] = v;
						break;
					case 'sendPoints':
						v = getSendPoints();
						ret['sendPoints'] = v;
						break;
					case 'partInTimes':
						v = getPartinTimesSet();
						ret = IX.inherit(ret, v);
						break;
					case 'isVipBirthdayMonth':
						v = self.getRadiboxVal(key);
						ret[key] = v;
						break;
					case 'maxPartInPerson':
						v = self.model.get('eventWay') == 22 ? $(':text[name=maxPartInPerson]', self.container).val() : 0;
						ret[key] = v;
						break;
				}
				return key;
			});
			return ret;
		},
		refresh : function () {
			var self = this;
			this.formParams = this.model.getAll();
			self.initUIComponents();
		},
		delete : function (successFn, faildFn) {
			var self = this;
			self.model.emit('deleteItem', {
				itemID : self.model.get('eventID'),
				successFn : function (res) {
					successFn(res);
				},
				faildFn : function (res) {
					faildFn(res);
				}
			});
		}
	});

	HMCM.EventRuleStepView = EventRuleStepView;

	/**
	 * 创建向导中活动规则步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initEventRuleStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventRuleStepView({
				mode : wizardMode,
				container : $cnt,
				parentView : wizardModalView,
				model : wizardModalView.model,
				successFn : function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
					self.parentView.getNextStep();
				},
				failFn : function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
				},
				mapFormElsData : mapEventRuleFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};


	var SMSCustomerRangeView = HMCM.GiftBaseInfoStepView.subclass({
		constructor: function (cfg) {
			var self = this;
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView', '');
			this.model = $XP(cfg, 'model', '');
			this.successFn = $XF(cfg, 'successFn');
			this.faildFn = $XF(cfg, 'faildFn');
			this.mapFormElsData = $XP(cfg, 'maoFormElsData');
			this.initBaseCfg();
			this.loadTemplate();
			this.renderForm(function() {
                self.initUIComponents();
				self.bindEvent();
			});
		}
	});
	SMSCustomerRangeView.proto({
		initBaseCfg: function() {
			var self = this,
                eventWay = self.model.get('eventWay'),
				formKeys = IX.clone(EventCustomerRangeKeys);
            if(eventWay == 50) {
                formKeys.push('smsCustomerShopID');
                formKeys.push('lastTransShopID');
                formKeys.push('lastTransTimeFilter');
                formKeys.push('lastTransTime');
            }
			self.formKeys = formKeys;
		},
        initUIComponents: function() {
            var self = this,
                currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() - 5, 0, 1);//最早的日期设在五年前
            self.container.find('form [data-type=datetimepicker]').datetimepicker({
                format: 'yyyy/mm/dd',
                startDate: IX.Date.getDateByFormat(currentDate, 'yyyy/MM/dd'),
                autoclose: true,
                minView: 'month',
                todayBtn: true,
                todayHighlight: true,
                language: 'zh-CN'
            });
        },
		loadTemplate: function () {
			var self = this,
				layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_customer_range'));
            Handlebars.registerPartial('customSelect', Hualala.TplLib.get('tpl_select'));
			self.set({layoutTpl: layoutTpl});
		},
		renderForm: function (cbFn) {
			var renderSelect = function ($select, selectRecords, optionName, optionVal, selectName, selectedVal, defaultOption) {
				var options = _.map(IX.clone(selectRecords), function(record) {
                        var label = $XP(record, optionName, ''),
                            value = $XP(record, optionVal, ''),
                            selectedItem = selectedVal ? {selected: selectedVal == value ? 'selected' : ''} : {};
						return IX.inherit({ name: label, value: value }, selectedItem);
					}),
					selectData = {
						defaultOption: defaultOption,
						options: options,
						name: selectName
					},
					customSelectTpl = Handlebars.compile(Hualala.TplLib.get('tpl_select'));
				$select.append($(customSelectTpl(selectData)));
			};
			var self = this,
				isSMSEvent = self.model.get('eventWay') == 50,
                consumeTimeFilter = isSMSEvent ? {
                    consumeTimeFilterData: {
                        options: Hualala.TypeDef.MCMDataSet.TransTimeFilter,
                        name: 'lastTransTimeFilter'
                    }
                } : {},
                lastTransTime = self.model.get('lastTransTime'),
                timeFormat = Hualala.Common.formatDateTimeValue((lastTransTime == 0 || !lastTransTime) ? '' : lastTransTime + '');
			self.container.html(self.get('layoutTpl')(IX.inherit({isSMSEvent: isSMSEvent},
                consumeTimeFilter,
                {lastTransTime: IX.Date.getDateByFormat(timeFormat, 'yyyy/MM/dd')})));
            self.container.find('form input[name="isVipBirthdayMonth"]')
                .eq(self.model.get('isVipBirthdayMonth') || '0')
                .prop('checked', true);
			cbFn();

			var $form = self.container.find('form'),
				$cardLevelSelect = $form.find('[name="vip_list"]'),
				$shopSelect1 = $form.find('[name="card_shop"]'),
				$shopSelect2 = $form.find('[name="consume_shop"]');
			self.model.emit("loadCardLevelIDs", {
				successFn : function (res) {
                    var cardLevels = $XP(res, 'data.records', []),
                        defaultOption = {value : "0", name : "全部会员"},
                        selectedCardLevelID = $XP(self.model.getAll(), 'cardLevelID', '0');
					renderSelect($cardLevelSelect, cardLevels, 'cardLevelName', 'cardLevelID', 'cardLevelID', selectedCardLevelID, defaultOption);
				},
				faildFn : function () {
					renderSelect([]);
				}
			});
			if(isSMSEvent) {
                self.container.find('form select[name="lastTransTimeFilter"]').val(self.model.get('lastTransTimeFilter') || '0').trigger('change');
				self.model.emit('loadSMSShops', {
					successFn: function (res) {
						var shops = $XP(res, 'data.records', []),
							selectedCardShopID = self.model.get('smsCustomerShopID') || 0,
                            selectedTransShopID = self.model.get('lastTransShopID') || 0,
                            defaultShop = {name: '不限', value: '0'};
						renderSelect($shopSelect1, shops, 'shopName', 'shopID', 'smsCustomerShopID', selectedCardShopID,defaultShop );
						renderSelect($shopSelect2, shops, 'shopName', 'shopID', 'lastTransShopID', selectedTransShopID, defaultShop);
					},
					faildFn: function () {
						renderSelect([]);
					}
				});
			}
		},
		bindEvent: function () {
			var self = this,
				fvOpts = self.initValidFieldOpts(),
				$form = self.container.find('form');
            $form.on('change', '[data-type="datetimepicker"]', function (e) {
                var $this = $(this),
                    name = $this.attr('name');
                $form.bootstrapValidator('revalidateField', name);
            }).on('change', 'select[name="lastTransTimeFilter"]', function(e) {
                var $this = $(e.target),
                    $datetimepicker = $this.parents('.time-filter').next();
                if($this.val() == 0) {
                    $datetimepicker.addClass('hidden');
                } else {
                    $datetimepicker.removeClass('hidden');
                }
            });
			$form.bootstrapValidator({
				trigger: 'blur',
				fields: fvOpts
			}).on('error.field.bv', function(e) {
                var $form = $(e.target),
                    bv = $form.data('bootstrapValidator');
                self.faildFn(self.model);
			}).on('success.form.bv', function(e) {
				var formParams = self.serializeForm();
				self.model.emit(self.mode + 'Event', {
					params: formParams,
					successFn: function() {
                        self.successFn.call(self);
					},
					faildFn: function() {
                        self.faildFn.call(self);
					}
				});
			});
		},
		initValidFieldOpts: function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				ret[key] = $XP(elCfg, 'validCfg', {});
			});
			return ret;
		},
		serializeForm: function() {
			var self = this,
				$form = self.container,
				formKeys = self.formKeys,
				ret = {};
			_.each(formKeys, function(key) {
                if(key == 'isVipBirthdayMonth') {
                    ret[key] = $form.find('[name="' + key + '"]:checked').val();
                } else if(key == 'lastTransTime') {
                    ret[key] = IX.Date.getDateByFormat($form.find('[name="' + key + '"]').val(), 'yyyyMMdd') || 0;
                } else {
                    ret[key] = $form.find('[name="' + key + '"]').val();
                    if(key == 'smsCustomerShopID' || key == 'lastTransShopID') {
                        var shopMap = {smsCustomerShopID: 'smsCustomerShopName', lastTransShopID: 'lastTransShopName'};
                        ret[shopMap[key]]= $form.find('[name="' + key + '"]').find('option:selected').text();
                    }
                }
			});
			return ret;
		},

        delete : function (successFn, faildFn) {
            var self = this;
            self.model.emit('deleteItem', {
                itemID : self.model.get('eventID'),
                successFn : function (res) {
                    successFn(res);
                },
                faildFn : function (res) {
                    faildFn(res);
                }
            });
        },
        switchViewMode : function (mode) {
            this.mode = mode;
            this.parentView.switchViewMode(mode);
        }
	});
	HMCM.SMSCustomerRangeView = SMSCustomerRangeView;
	/*
	* 创建短信群发活动
	* 第二步：初始化顾客范围表单
	*
	* */
	HMCM.initSMSCustomerRange = function ($cnt, cntID, wizardMode) {
		var wizardView = this,
			stepView = new HMCM.SMSCustomerRangeView({
				mode: wizardMode,
				container: $cnt,
				parentView: wizardView,
				model: wizardView.model,
				successFn: function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
					self.parentView.getNextStep();
				},
				faildFn: function() {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
				}
			});
		wizardView.registerStepView(cntID, stepView);
	};


	var SMSTemplateStepView = HMCM.GiftBaseInfoStepView.subclass({
		constructor: function(cfg) {
			var self = this;
			this.mode = $XP(cfg, 'mode');
			this.container = $XP(cfg, 'container');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.faildFn = $XF(cfg, 'faildFn');
			this.loadTemplate();
			this.initBaseCfg();
			this.renderForm(function(){
				self.bindEvent();
			});
		}
	});
	SMSTemplateStepView.proto({
		loadTemplate: function() {
			var self = this,
				layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_sms_template'));
			self.set({layoutTpl: layoutTpl});
		},
		initBaseCfg: function() {
			var self = this;
			self.formKeys = EventSMSTemplateKeys;
		},
		renderForm: function (cbFn) {
			var self = this,
				eventWay = self.model.get('eventWay'),
				smsBaseAttr = [{label: '会员姓名'}, {label: '先生/女士'}, {label: '卡名称'}, {label: '卡号后四位'}],
                smsExtendAttrLabels = ['奖品名称', '奖品数量', '有效期'],
				smsExtendAttr = eventWay == 51 ? _.times(9, function(idx) {
                    var index1 = idx % 3,
                        index2 = idx < 3 ? 0 : (idx < 6 ? 1 : 2);
                    return {label: smsExtendAttrLabels[index2] + (index1 + 1)};
                }) : [],
				smsGate = self.model.get('smsGate'),
				tplData = IX.inherit(self.model.getAll(), {
					smsAttr: smsBaseAttr.concat(smsExtendAttr),
					hideSMS: smsGate == 1 ? '' : 'hidden',
					hideSMSTip: smsGate == 1 ? 'hidden' : '',
                    smsTextCount: (self.model.get('smsTemplate') || '').length
				}),
				$smsTemplate = $(self.get('layoutTpl')(tplData));
			self.container.append($smsTemplate);
			if(IX.isFn(cbFn)) cbFn();
		},
		bindEvent: function () {
			var self = this,
				$form = self.container.find('form'),
				fvOpts = self.initValidFieldOpts();
			$form.bootstrapValidator({
				trigger: 'blur',
				fields: fvOpts
			}).on('error.field.bv', function(e) {
				self.faildFn();
			}).on('success.form.bv', function(e) {
				e.preventDefault();
				var formParams = self.serializeForm(),
					smsGate = self.model.get('smsGate');
				if(smsGate == 1) {
					self.model.emit('editSMS', {
						params: formParams,
						successFn: function () {
							self.successFn.call(self);
						},
						faildFn: function() {
							self.faildFn.call(self);
						}
					});
				} else {
					self.successFn.call(self);
				}
			});
			$form.off('click', '[name="smsAttr"] a').on('click', '[name="smsAttr"] a', function() {
                var $textArea = $('textarea[name="smsTemplate"]');
                $textArea.insertAtCaret('[' + $(this).text() + ']');
                $textArea.trigger('keydown');
			});
            self.container.off('click', 'a[name="preview"]').on('click', 'a[name="preview"]', function(){
                var $this = $(this),
                    $preview = $this.next('p'),
                    $textarea = $form.find('textarea'),
                    textareaVal = $textarea.val(),
                    previewText = textareaVal.replace(/[\[【]会员姓名[\]】]/g, smsDefaultAttr.receiverName)
                    .replace(/[\[【]先生\/女士[\]】]/g, smsDefaultAttr.receiverSex)
                    .replace(/[\[【]卡名称[\]】]/g, smsDefaultAttr.cardName)
                    .replace(/[\[【]卡号后四位[\]】]/g, smsDefaultAttr.cardLastFourNumber)
                    .replace(/[\[【]奖品名称\d*[\]】]/g, smsDefaultAttr.giftName)
                    .replace(/[\[【]奖品数量\d*[\]】]/g, smsDefaultAttr.cardCount)
                    .replace(/[\[【]有效期\d*[\]】]/g, smsDefaultAttr.cardValidDate);
                $preview.text(previewText);
                $textarea.trigger('keydown');
			}).on('keydown', 'textarea[name="smsTemplate"]', function(e) {
                var $estimateSMSCount = self.container.find('span[name="estimateSMSCount"]');
                    $estimateSMSCount.text($(this).val().length);
            });
		},
		initValidFieldOpts: function() {
            var self = this,
                formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
                ret = {};
            _.each(formKeys, function (key) {
                var elCfg = EventSetFormElsHT.get(key),
                    type = $XP(elCfg, 'type');
                ret[key] = $XP(elCfg, 'validCfg', {});
            });
            return ret;
		},
		serializeForm: function() {
            var self = this,
                formKeys = self.formKeys,
                ret = {};
            _.each(formKeys, function (key) {
                if(key == 'eventID') {
                    ret[key] = self.model.get('eventID');
                } else{
                    ret[key] = self.container.find('form [name="' + key + '"]').val() || '';
                }
            });
			ret.smsTemplate = ret.smsTemplate.replace(/\n/g, '');
            return ret;
		},
        delete : function (successFn, faildFn) {
            var self = this;
            self.model.emit('deleteItem', {
                itemID : self.model.get('eventID'),
                successFn : function (res) {
                    successFn(res);
                },
                faildFn : function (res) {
                    faildFn(res);
                }
            });
        },
		refresh : function () {
			var self = this;
			self.container.empty();
			self.renderForm(function() {
				self.bindEvent();
			});
		}
	});
	HMCM.SMSTemplateStepView = SMSTemplateStepView;
	/*
	* 创建短信群发活动
	* 初始化短信模板
	* */
    HMCM.initSMSTemplate = function ($cnt, cntID, wizardMode) {
		var wizardView = this,
			stepView = new HMCM.SMSTemplateStepView({
				mode: wizardMode,
				container: $cnt,
				parentView: wizardView,
				model: wizardView.model,
				successFn: function () {
					var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                    self.parentView.getNextStep();
				},
				faildFn: function() {
                    var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
				}
			});
		wizardView.registerStepView(cntID, stepView);
    };
})(jQuery, window);