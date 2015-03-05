(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var giftEffectTimeHours = Hualala.Common.getMinuteIntervalOptions({
		startLabel : '立即生效',
		end : Hualala.Constants.SecondsOfDay / 60
	});

	var GiftSetFormElsCfg = {
		giftItemID : {
			type : "hidden",
			defaultVal : ""
		},
		giftType : {
			type : "combo",
			label : "礼品类型",
			defaultVal : "10",
			options : _.reject(Hualala.TypeDef.MCMDataSet.GiftTypes, function (el) {
				return IX.isEmpty($XP(el, 'value'));
			}),
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择礼品类型"
					}
				}
			}
		},
		giftValue : {
			type : "text",
			label : "礼品价值",
			defaultVal : "",
			prefix : '￥',
			surfix : '元',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入礼品价值"
					},
					numeric : {
						message : "礼品价值必须为数字"
					},
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "礼品价值必须大于0"
					}
				}
			}
		},
		giftName : {
			type : "text",
			label : "礼品名称",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "礼品名称不能为空"
					}
				}
			}
		},
		giftRemark : {
			type : "textarea",
			label : "礼品描述",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "礼品描述不能为空"
					}	
				}
			}
		},
		validityDays : {
			type : "text",
			label : "有效天数",
			defaultVal : "30",
			surfix : '天',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入有效天数"
					},
					numeric : {
						message : "有效天数必须为数字"
					},
					integer : {
						message : "有效天数必须是整数"
					},
					between : {
						inclusive : false,
						min : 0,
						max : 10000,
						message : "礼品价值必须在0到10000天之间"
					}
				}
			}
		},
		egiftEffectTimeHours : {
			type : "combo",
			label : "生效时间",
			defaultVal : "0",
			options : _.reduce(giftEffectTimeHours, function (memo, el, i) {
				if (i == 1) {
					memo = [memo];
				}
				return el.value >= 180 ? memo.concat(el) : memo;
			}),
			validCfg : {
				validators : {}
			}
		},
		isHolidaysUsing : {
			type : "radiogrp",
			label : "节假日是否可用",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.GiftIsHolidayUsing,
			validCfg : {
				validators : {}
			}
		},
		usingTimeType : {
			type : "checkboxgrp",
			label : "使用时段",
			defaultVal : "1,2,3,4,5",
			options : Hualala.TypeDef.MCMDataSet.GiftUsingTimeTypes,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择使用时段"
					}
				}
			}
		},
		foodScope : {
			type : "radiogrp",
			label : "菜谱范围",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.GiftFoodScope,
			validCfg : {
			}

		},
		supportOrderType : {
			type : "combo",
			label : "业务支持",
			defaultVal : "2",
			options : Hualala.TypeDef.MCMDataSet.GiftSupportOrderTypes,
			validCfg : {
				validators : {}
			}
		},
		isOfflineCanUsing : {
			type : "radiogrp",
			label : "到店使用",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.GiftIsOfflineUsing,
			validCfg : {
				validators : {}
			}
		},
		moneyLimitType : {
			type : "combo",
			label : "金额限制",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.GiftMonetaryLimitTypes,
			validCfg : {
				validators : {}
			}
		},
		moenyLimitValue : {
			type : "text",
			label : "",
			defaultVal : "100",
			prefix : '￥',
			surfix : '元，使用一张',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入限制金额"
					},
					numeric : {
						message : "限制金额必须为数字"
					},
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "现值金额必须大于0"
					}
				}
			}
		},
		shopNames : {
			type : "selectShops",
			label : "可使用店铺",
			defaultVal : "所有店铺适用"
		}

	};
	var GiftSetFormElsHT = new IX.IListManager();
	_.each(GiftSetFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'radiogrp' || type == 'checkboxgrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
				});
			});
			GiftSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				options : ops,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else if (type == 'selectShops') {
			GiftSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else {
			GiftSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});

	HMCM.GiftSetFormElsHT = GiftSetFormElsHT;

	var getGiftTypeSet = function (giftType) {
		var giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes;
		return _.find(giftTypes, function (el) {
			return $XP(el, 'value') == giftType;
		});
	};
	HMCM.getGiftTypeSet = getGiftTypeSet;

	/**
	 * 整理礼品基本信息表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapGiftBaseInfoFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = GiftSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'combo') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
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
			} if (type == 'text' && key == 'giftName') {
				var groupName = $XP(Hualala.getSessionSite(), 'groupName', ''),
					giftType = self.model.get('giftType') || $XP(GiftSetFormElsHT.get('giftType'), 'defaultVal'),
					giftLabel = $XP(getGiftTypeSet(giftType), 'label');
				return IX.inherit(elCfg, {
					value : groupName + giftLabel,
					disabled : 'disabled'
				});
			} if (type == 'text' && key == 'giftValue') {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					disabled : (self.mode == 'edit') ? 'disabled' : ''
				});
			} else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal')
				});
			}
		});
		return ret;
	};

	var GiftBaseInfoFormKeys = 'giftItemID,giftType,giftValue,giftName,giftRemark'.split(',');

	var GiftBaseInfoStepView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Gift Base Info View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});
	GiftBaseInfoStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_base_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initBaseCfg : function () {
			this.formKeys = GiftBaseInfoFormKeys;
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'wizard-step-form form-feedback-out',
					items : renderData
				});
			self.container.html(htm);
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
				var act = self.mode + 'Gift';
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: Gift Wizard Form Params:");
				IX.Debug.info(formParams);
				// self.model.emit(act, {
				// 	params : formParams,
				// 	failFn : function () {
				// 		self.failFn.call(self);
				// 	},
				// 	successFn : function () {
				// 		self.successFn.call(self);

				// 	}
				// });
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

			self.container.on('change', 'select[name=giftType]', function (e) {
				var $select = $(this),
					giftType = $select.val();
				var $giftValue = $(':text[name=giftValue]', self.container);
				var $giftValueLabel = $giftValue.parents('.form-group').find('> label');
				$giftValueLabel.text(giftType == 42 ? '积分点数' : '礼品价值');
				
				self.container.find(':text[name=giftName]').trigger('change');

			});
			self.container.on('change', ':text[name=giftValue]', function (e) {
				var $txt = $(this),
					val = $txt.val();
				// if (isNaN(val)) $txt.val('');
				
				!isNaN(val) && self.container.find(':text[name=giftName]').trigger('change');				
			});
			self.container.on('change', ':text[name=giftName]', function (e) {
				var $txt = $(this),
					giftValue = $(':text[name=giftValue]', self.container).val(),
					giftType = $('select[name=giftType]', self.container).val(),
					giftTypeSet = getGiftTypeSet(giftType);
					groupName = $XP(Hualala.getSessionSite(), 'groupName', ''),
					val = groupName + giftValue 
						+ (IX.isEmpty(giftValue) ? '' : $XP(giftTypeSet, 'unit'))
						+ $XP(giftTypeSet, 'label', '');
				$txt.val(val);
			});
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'giftItemID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = GiftSetFormElsHT.get(key),
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
					var elCfg = GiftSetFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			return ret;
		}
	});

	HMCM.GiftBaseInfoStepView = GiftBaseInfoStepView;

	/**
	 * 创建向导中礼品基本信息步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initGiftBaseInfoStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.GiftBaseInfoStepView({
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
				mapFormElsData : mapGiftBaseInfoFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};

	/**
	 * 当礼品向导步骤变化时触发的事件
	 * @param  {[type]} $curNav [description]
	 * @param  {[type]} $navBar [description]
	 * @param  {[type]} cIdx    [description]
	 * @param  {[type]} nIdx    [description]
	 * @return {[type]}         [description]
	 */
	HMCM.onGiftWizardStepChange = function ($curNav, $navBar, cIdx, nIdx) {
		var wizardModalView = this;
		var curID = wizardModalView.getTabContentIDByIndex($navBar, cIdx),
			nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
			$nextCnt = $('#' + nextID, wizardModalView.$wizard),
			nextView = wizardModalView.getStepView(nextID);
		if (cIdx == -1 && nIdx == 0) return true;
		if (!nextView) {
			nIdx == 1 && HMCM.initGiftRuleStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			nIdx == 0 && HMCM.initGiftBaseInfoStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
		}
		return true;
	};

	/**
	 * 当礼品向导步骤提交时触发的事件
	 * @param  {[type]} curID [description]
	 * @return {[type]}       [description]
	 */
	HMCM.onGiftWizardStepCommit = function (curID) {
		var wizardModalView = this,
			stepView = wizardModalView.getStepView(curID),
			$cnt = stepView.container,
			$form = $cnt.find('form'),
			bv = $form.data('bootstrapValidator');
		wizardModalView.switchWizardCtrlStatus('loading');
		bv.validate();
	};

	/**
	 * 绑定礼品向导的事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleGiftWizardEvent = function () {
		var wizardModalView = this;
		wizardModalView.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function (e) {
			var $btn = $(this);
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var giftItemID = wizardModalView.model.get('giftItemID');
			if (!giftItemID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else {
				Hualala.UI.Confirm({
					title : '取消创建礼品',
					msg : '是否取消创建礼品的操作？<br/>之前的操作将不生效！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			}
		});
	};
})(jQuery, window);