(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var EventSetFormElsHT = HMCM.EventSetFormElsHT;

	var EventRuleFormKeys = 'dateRange,chkDeductPoints,deductPoints,chkSendPoints,sendPoints,radioCountCycleDays,partInTimes,isVipBirthdayMonth,maxPartInPerson'.split(',');

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
				} else if (countCycleDays !== 0 && partInTimes != 0) {
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
			if (eventWay == 40 || eventWay == 41) {
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
				self.model.emit(act, {
					params : formParams,
					failFn : function () {
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
})(jQuery, window);