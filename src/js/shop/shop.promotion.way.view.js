(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var PromotionSetFormElsCfg = {
		//当前店铺的ID
		shopID :{
			type : 'hidden',
			defaultVal : ''	
		},
		//当前记录id
		itemID : {
			type : 'hidden',
			defaultVal : ''
		},
		//促销方式
		stageType : {
			type : 'radioDiv',
			label : '促销方式',
			defaultVal : '0',
			options : Hualala.TypeDef.ShopPromotionDataSet.stageTypes,
			validCfg : {}
		},
		//促销起止日期
		dateRange : {
			type : 'section',
			label : '促销起止日期',
			min : {
				type : 'datetimepicker',
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
		holidayFlag : {
			type : "radiogrp",
			label : "节假日限制",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.GiftIsHolidayUsing,
			validCfg : {
				validators : {}
			}
		},
		wholeDay : {
			type : "radiogrp",
			label : "是否全天",
			defaultVal : "0",
			options :[{value:"0",label:"否"},{value:"1",label:"是"},],
			validCfg : {
				validators : {}
			}
		},
		//促销适用业务类型
		supportOrderType  : {
			type : 'radiogrp',
			label : '促销的适用业务类型',
			defaultVal : "2",
			options : Hualala.TypeDef.ShopPromotionDataSet.supportOrderTypes,
			validCfg : {
				validators : {
					notEmpty : {
						message : "促销适用的业务类型不能为空"
					}
				}
			}
		},
		//促销的时段
		timeID  : {
			type : 'radiogrp',
			label : '时段限制',
			defaultVal : "0",
			options : Hualala.TypeDef.ShopPromotionDataSet.timeIDTypes,
			validCfg : {
				validators : {
					notEmpty : {
						message : "促销的时段限制不能为空"
					}
				}
			}
		},
		time1: {
			type : 'section',
			label : '时段限制1',
			min : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
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
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
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
		time2 : {
			type : 'section',
			label : '时段限制2',
			min : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
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
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
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
		}
	};

	var PromotionSetFormElsHT = new IX.IListManager();
	_.each(PromotionSetFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section'&& k == 'dateRange') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = 'startDate',
				maxName = 'endDate',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-3 col-sm-3 col-md-3',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-3 col-sm-3 col-md-3',
				});
			PromotionSetFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else if (type == 'section' && (k == 'time1'||k == 'time2')) {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
			minName = k+'Start',
			maxName = k+'End',
			min = IX.inherit($XP(el, 'min', {}), {
				id : minID, name : minName, clz : 'col-xs-3 col-sm-3 col-md-3',
			}), max = IX.inherit($XP(el, 'max', {}), {
				id : maxID, name : maxName, clz : 'col-xs-3 col-sm-3 col-md-3',
			});
		PromotionSetFormElsHT.register(k, IX.inherit(el, {
			id : id,
			labelClz : labelClz,
			min : min,
			max : max
		}));
		} else if (type == 'radiogrp' || type == 'checkboxgrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
				});
			});
			PromotionSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				options : ops,
				labelClz : labelClz,
				clz : k=='supportOrderType'||'timeID'?'col-sm-8':'col-sm-7'
			}));
		} else if (type == 'radioDiv') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz :  'col-sm-7'
				});
			});
			PromotionSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				options : ops,
				//labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else {
			PromotionSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});

	Hualala.Shop.PromotionSetFormElsHT = PromotionSetFormElsHT;

	var PromotionBaseInfoFormKeys = 'stageType,itemID,shopID'.split(',');

	/**
	 * 整理促销方式表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapPromotionBaseInfoFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = PromotionSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'radioDiv'&&key == 'stageType') {
				var rulesJson=self.model.get('rules');
					rulesJson = !rulesJson ? {} : JSON.parse(rulesJson);
				var v = rulesJson.stageType || $XP(elCfg, 'defaultVal');
				var options = _.map($XP(elCfg, 'options'), function (op) {
					var checked =  ($XP(op, 'value') == v);
					return IX.inherit(op, {
						checked : checked ? 'checked' : ''
					});
				});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'textarea') {
                return IX.inherit(elCfg, {
                    value : Hualala.Common.decodeTextEnter(self.model.get(key) || '') || $XP(elCfg, 'dafaultVal')
                });
            }else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal')
				});
			}

		});
		return ret;
	};
    /*促销方式view层*/
	var PromotionBaseInfoStepView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("promotion Base Info View init faild!");
			}
			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});
	PromotionBaseInfoStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_base_form')),
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
			this.formKeys = PromotionBaseInfoFormKeys;
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
				var act = self.mode + 'Promotion';
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG:促销方式 promotion Base Wizard Form Params:");
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
				formKeys = _.reject(self.formKeys, function (k) {return (k == 'itemID'|| k=='shopID')}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = PromotionSetFormElsHT.get(key),
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
					var elCfg = PromotionSetFormElsHT.get(key),
						type = $XP(elCfg, 'type');
						if(key=="stageType"){
							ret[key] = $('[name=' + key + ']:checked').val();
						}
						else{
							ret[key] = $('[name=' + key + ']').val()
						}
				});
			return ret;
		},
		refresh : function () {
			var self = this;
			this.formParams = this.model.getAll();
			self.initUIComponents();
		}
	});
	Hualala.Shop.PromotionBaseInfoStepView = PromotionBaseInfoStepView;
	/**
	 * 创建向导中基本信息步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	var initPromotionBaseInfoStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new Hualala.Shop.PromotionBaseInfoStepView({
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
				mapFormElsData : mapPromotionBaseInfoFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};

	Hualala.Shop.initPromotionBaseInfoStep = initPromotionBaseInfoStep;

	/**
	 * 当向导步骤变化时触发的事件
	 * @param  {[type]} $curNav [description]
	 * @param  {[type]} $navBar [description]
	 * @param  {[type]} cIdx    [description]
	 * @param  {[type]} nIdx    [description]
	 * @return {[type]}         [description]
	 */
	var onPromotionWizardStepChange = function ($curNav, $navBar, cIdx, nIdx) {
		var wizardModalView = this;
		var curID = wizardModalView.getTabContentIDByIndex($navBar, cIdx),
			nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
			$nextCnt = $('#' + nextID, wizardModalView.$wizard),
			nextView = wizardModalView.getStepView(nextID);
		var stepFns = [
			'initPromotionBaseInfoStep',
			'initPromotionRuleStep',
			'initPromotionTimeStep',
			'initPromotionOpenStep'
		];
		if (cIdx == -1 && nIdx == 0) return true;
		if (!nextView) {
			Hualala.Shop[stepFns[nIdx]].call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
		} else {
			nIdx == 1 && nextView.refresh();
			nIdx == 0 && nextView.refresh();
            nIdx == 3 && nextView.refresh();
		}
		return true;
	};

	Hualala.Shop.onPromotionWizardStepChange = onPromotionWizardStepChange;

	/**
	 * 当向导步骤提交时触发的事件
	 * @param  {[type]} curID [description]
	 * @return {[type]}       [description]
	 */
	Hualala.Shop.onPromotionWizardStepCommit = function (curID) {
		var wizardModalView = this,
			stepView = wizardModalView.getStepView(curID),
			$cnt = stepView.container,
			$form = $cnt.find('form'),
			bv = $form.data('bootstrapValidator');
		wizardModalView.switchWizardCtrlStatus('loading');
		if (curID == 'promotion_on') {
			stepView.submit();
		} else {
			bv.validate();
		}
		
	};

	/**
	 * 绑定向导的事件
	 * @return {[type]} [description]
	 */
	Hualala.Shop.bundlePromotionWizardEvent = function () {
		var wizardModalView = this;
		wizardModalView.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function (e) {
			var $btn = $(this);
			var wizardType = wizardModalView.wizardType;
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var itemID = wizardModalView.model.get('itemID');
			if (!itemID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else if (itemID==0 && wizardType == 'create') {
				Hualala.UI.Confirm({
					title : '取消添加促销规则',
					msg : '是否取消添加促销规则的操作？<br/>所有操作步骤都不保存！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			} else {
				Hualala.UI.Confirm({
					title : '取消编辑促销规则',
					msg : '是否取消当前步骤的操作？<br/>当前步骤之前的修改将不保存！',
					okLabel : '确定',
					okFn : function () {
						var pContainer = wizardModalView.parentView.$container;
						var pResultController = pContainer.data('resultController'),
							pResultView = null;
						if (!pResultController) {
							wizardModalView.parentView.model.emit('load');
						} else {
							pResultView = pResultController.model.emit('load');
						}
						wizardModalView.modal.hide();
					}
				});
			}
		});
	}

})(jQuery, window);