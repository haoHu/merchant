(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;


	var EventSetFormElsCfg = {
		eventID : {
			type : "hidden",
			defaultVal : ""
		},
		eventName : {
			type : 'text',
			label : "活动主题",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动主题不能为空"
					}
				}
			}
		},
		cardLevelID : {
			type : 'combo',
			label : "顾客范围",
			defaultVal : "-1",
			options : Hualala.TypeDef.MCMDataSet.EventCardLevels,
			validCfg : {
				validators : {
					notEmpty : {
						message : "顾客范围不能为空"
					}
				}
			}
		},
		eventWay : {
			type : 'combo',
			label : "活动类型",
			defaultVal : "20",
			options : _.reject(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {
				return IX.isEmpty($XP(el, 'value'));
			}),
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动类型不能为空"
					}
				}
			}
		},
		eventRemark : {
			type : 'textarea',
			label : "描述",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动说明不能为空"
					}
				}
			}
		},
		dateRange : {
			type : 'section',
			label : '起止日期',
			min : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {
						notEmpty : {
							message : "请输入起始时间"
						}
					}
				}
			},
			max : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {
						notEmpty : {
							message : "请输入结束时间"
						}
					}
				}
			}
		},
		chkDeductPoints : {
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '参与活动扣减积分'
			}],
			validCfg : {
				validators : {}
			}
		},
		deductPoints : {
			type : "text",
			label : "扣减积分",
			defaultVal : "0",
			// prefix : '￥',
			// surfix : '元',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入扣减积分值"
					},
					numeric : {
						message : "扣减积分必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "扣减积分必须大于或等于0"
					}
				}
			}
		},
		chkSendPoints : {
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '参与活动赠送积分'
			}],
			validCfg : {
				validators : {}
			}
		},
		sendPoints : {
			type : "text",
			label : "赠送积分",
			defaultVal : "0",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入赠送积分值"
					},
					numeric : {
						message : "赠送积分必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "赠送积分必须大于或等于0"
					}
				}
			}
		},
		radioCountCycleDays : {
			type : "radiogrp",
			label : "会员参与次数",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.EventCountCycleDays,
			validCfg : {}
		},
		partInTimes : {
			type : "inputCountCycleDays",
			label : "",
			defaultVal : '1',
			options : _.map([1,2,3,4,5,6,7,15,30,60,90], function (d) {
				return {
					value : d,
					label : d + '天'
				};
			}),
			partInTimes : {
				validCfg : {
					validators : {
						notEmpty : {
							message : "请输入参与次数"
						},
						numeric : {
							message : "参与次数必须为数字"
						},
						greaterThan : {
							inclusive : false,
							value : 0,
							message : "参与次数必须大于0"
						}
					}
				}
			}
		},
		isVipBirthdayMonth : {
			type : "radiogrp",
			label : "仅本月会员生日可参与",
			defaultVal : '0',
			options : Hualala.TypeDef.MCMDataSet.IsVIPBirthdayMonth,
			validCfg : {}
		},
		maxPartInPerson : {
			type : "text",
			label : "最大报名人数",
			defaultVal : '0',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入最大报名人数"
					},
					numeric : {
						message : "最大报名人数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "最大报名人数必须大于或等于0"
					}
				}
			}
		}
	};

	var EventSetFormElsHT = new IX.IListManager();
	_.each(EventSetFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = 'eventStartDate',
				maxName = 'eventEndDate',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-3 col-sm-3 col-md-3',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-3 col-sm-3 col-md-3',
				});
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else if (type == 'inputCountCycleDays') {
			var options = $XP(el, 'options');
			var countCycleDays = {
					id : 'countCycleDays' + '_' + IX.id(),
					name : 'countCycleDays',
					options : options
				},
				partInTimes = {
					id : 'partInTimes_' + IX.id(),
					name : 'partInTimes',
					validCfg : $XP(el, 'partInTimes.validCfg', {})
				};

			EventSetFormElsHT.register(k, IX.inherit(el, {
				labelClz : labelClz,
				clz : 'col-sm-8',
				countCycleDays : countCycleDays,
				partInTimes : partInTimes
			}));

		} else if (type == 'radiogrp' || type == 'checkboxgrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
				});
			});
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				options : ops,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else if (type == 'selectShops') {
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else {
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});

	HMCM.EventSetFormElsHT = EventSetFormElsHT;

	var EventBaseInfoFormKeys = 'eventID,eventName,cardLevelID,eventWay,eventRemark'.split(',');



	/**
	 * 整理礼品基本信息表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventBaseInfoFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = EventSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'combo' && key == 'cardLevelID') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					levels = _.map(self.model.CardLevelIDSet, function (el) {
						return {
							value : $XP(el, 'cardLevelID'),
							label : $XP(el, 'cardLevelName'),
							isActive : $XP(el, 'isActive')
						}
					});
				levels = _.filter(levels, function (el) {return $XP(el, 'isActive') == '1';});
				var options = $XP(elCfg, 'options', []).concat(levels);
				options = _.map(options, function (op) {
					return IX.inherit(op, {
						selected : $XP(op, 'value') == v ? 'selected' : ''
					});
				});
				return IX.inherit(elCfg, {
					value : v,
					options : options
				});
			} else if (type == 'combo') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							selected : $XP(op, 'value') == v ? 'selected' : ''
						});
					});
				return IX.inherit(elCfg, {
					disabled : (self.mode == 'edit' && key == 'eventWay') ? 'disabled' : '',
					value : v,
					options : options
				});
			} else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal')
				});
			}
		});
		return ret;
	};

	var EventBaseInfoStepView = HMCM.GiftBaseInfoStepView.subclass({
		constructor : function (cfg) {
			var self = this;
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Event Base Info View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm(function () {
				self.initUIComponents();
				self.bindEvent();
			});
		}
	});
	EventBaseInfoStepView.proto({
		initBaseCfg : function () {
			this.formKeys = EventBaseInfoFormKeys;
		},
		renderForm : function (cbFn) {
			var self = this;
			var renderFn = function () {
				var renderData = self.mapFormElsData.call(self),
					tpl = self.get('layoutTpl'),
					btnTpl = self.get('btnTpl'),
					htm = tpl({
						formClz : 'wizard-step-form form-feedback-out',
						items : renderData
					});
				self.container.html(htm);
				cbFn();
			};
			self.model.emit("loadCardLevelIDs", {
				successFn : function () {
					renderFn();
				},
				failFn : function () {
					renderFn();
				}
			});
				
			
		},
		initUIComponents : function () {

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
				
				self.model.emit('saveCache', {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.successFn.call(self);

					}
				})
			});
		},
		initValidFieldOpts : function () {
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
		serializeForm : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = EventSetFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			return ret;
		},
		switchViewMode : function (mode) {
			this.mode = mode;
			this.parentView.switchViewMode(mode);
		}
	});
	HMCM.EventBaseInfoStepView = EventBaseInfoStepView;

	/**
	 * 创建向导中活动基本信息步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	var initEventBaseInfoStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventBaseInfoStepView({
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
				mapFormElsData : mapEventBaseInfoFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};

	HMCM.initEventBaseInfoStep = initEventBaseInfoStep;

	/**
	 * 当活动向导步骤变化时触发的事件
	 * @param  {[type]} $curNav [description]
	 * @param  {[type]} $navBar [description]
	 * @param  {[type]} cIdx    [description]
	 * @param  {[type]} nIdx    [description]
	 * @return {[type]}         [description]
	 */
	var onEventWizardStepChange = function ($curNav, $navBar, cIdx, nIdx) {
		var wizardModalView = this;
		var curID = wizardModalView.getTabContentIDByIndex($navBar, cIdx),
			nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
			$nextCnt = $('#' + nextID, wizardModalView.$wizard),
			nextView = wizardModalView.getStepView(nextID);
		var stepFns = [
			'initEventBaseInfoStep',
			'initEventRuleStep',
			'initEventGiftSetStep',
			'initEventOpenStep'
		];
		if (cIdx == -1 && nIdx == 0) return true;
		if (!nextView) {
			HMCM[stepFns[nIdx]].call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 1 && HMCM.initEventRuleStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 0 && HMCM.initEventBaseInfoStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 2 && HMCM.initEventGiftSetStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
		} else {
			nIdx == 1 && nextView.refresh();
		}
		return true;
	};

	HMCM.onEventWizardStepChange = onEventWizardStepChange;

	/**
	 * 当活动向导步骤提交时触发的事件
	 * @param  {[type]} curID [description]
	 * @return {[type]}       [description]
	 */
	HMCM.onEventWizardStepCommit = function (curID) {
		var wizardModalView = this,
			stepView = wizardModalView.getStepView(curID),
			$cnt = stepView.container,
			$form = $cnt.find('form'),
			bv = $form.data('bootstrapValidator');
		wizardModalView.switchWizardCtrlStatus('loading');
		if (curID == 'event_on') {
			stepView.submit();
		} else {
			bv.validate();
		}
		
	};

	/**
	 * 绑定礼活动向导的事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleEventWizardEvent = function () {
		var wizardModalView = this;
		wizardModalView.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function (e) {
			var $btn = $(this);
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var accountID = wizardModalView.model.get('accountID');
			if (!accountID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else {
				Hualala.UI.Confirm({
					title : '取消创建活动',
					msg : '是否取消创建活动的操作？<br/>之前的操作将不生效！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			}
		});
	}

})(jQuery, window);