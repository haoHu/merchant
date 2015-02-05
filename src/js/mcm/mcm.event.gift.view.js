(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var giftEffectTimeHours = Hualala.Common.getMinuteIntervalOptions({
		startLabel : '立即生效',
		end : Hualala.Constants.SecondsOfDay / 60
	});

	var EventGiftsSetHT = new IX.IListManager();
	var EventGiftSetFormKeys = "EGiftID,EGiftName,EGiftTotalCount,EGiftValidUntilDayCount,EGiftOdds,EGiftEffectTimeHours".split(',');
	var EventGiftLevelCount = 3;
	var GiftLevelNames = ["", "一等奖","二等奖","三等奖"];
	var EventGiftSetFormElsCfg = {
		EGiftID : {
			type : 'hidden',
			defaultVal : ''
		},
		EGiftName : {
			type : 'pickgift',
			defaultVal : '',
			label : '奖品名称',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择奖品"
					}
				}
			}
		},
		EGiftTotalCount : {
			type : "text",
			label : "奖品总数",
			defaultVal : "0",
			// prefix : '￥',
			surfix : '个',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入奖品总数"
					},
					numeric : {
						message : "奖品总数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "奖品总数必须大于或等于0"
					}
				}
			}
		},
		EGiftValidUntilDayCount : {
			type : "text",
			label : "有效天数",
			defaultVal : "30",
			// prefix : '￥',
			surfix : '天',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入有效天数"
					},
					numeric : {
						message : "有效天数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "有效天数必须大于或等于0"
					}
				}
			}
		},
		EGiftOdds : {
			type : "text",
			label : "中奖概率百分比",
			defaultVal : "0",
			surfix : '%',
			help : "输入值在0.0001~100之间。如：0.01%表示万分之一的几率。",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入中奖概率"
					},
					between : {
						min : 0.0001,
						max : 100,
						message : "中奖概率百分比值在0.0001~100之间"
					}
				}
			}
		},
		EGiftEffectTimeHours : {
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
		}
	};

	for (var i = 1; i <= EventGiftLevelCount; i++) {
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		_.each(EventGiftSetFormElsCfg, function (el, k) {
			var key = k + '_' + i,
				type = $XP(el, 'type');

			EventGiftsSetHT.register(key, IX.inherit(el, {
				id : key + '_' + IX.id(),
				name : key,
				labelClz : labelClz,
				clz : 'col-sm-6'
			}));
		});
	}

	/**
	 * 整理活动奖品表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventGiftFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var eventWay = self.model.get('eventWay');
		var ret = [];
		for (var i = 1; i <= EventGiftLevelCount; i++) {
			var giftLevelName = GiftLevelNames[i],
				panelClz = 'mcm-evtgift-panel ';
			var EGiftID = self.model.get('EGiftID_' + i);
			if ((EGiftID != 0 && !IX.isEmpty(EGiftID)) || i == 1) {
				panelClz += ' isActive ';
			}
			if (eventWay == 21 || eventWay == 30) {
				panelClz += ' singlegift ';
			}
			var addbtn = {clz : 'btn-warning btn-add', name : 'addGift', label : '添加中奖等级'},
				delbtn = {clz : 'btn-default btn-del', name : 'deleteGift', label : '删除' + giftLevelName};
			var giftSet = {
				giftLevelName : giftLevelName,
				clz : panelClz,
				btns : i == 1 ? [addbtn] : (i == EventGiftLevelCount ? [delbtn] : [delbtn,addbtn])
			};
			var form = _.map(formKeys, function (k) {
				var key = k + '_' + i,
					elCfg = EventGiftsSetHT.get(key),
					type = $XP(elCfg, 'type');
				var v = null;
				if (type == 'combo') {
					var v = self.model.get(key) || $XP(elCfg, 'defaultVal'),
						options = _.map($XP(elCfg, 'options'), function (op) {
							return IX.inherit(op, {
								selected : $XP(op, 'value') == v ? 'selected' : ''
							});
						});
					return IX.inherit(elCfg, {
						value : v,
						options : options
					});
				} else {
					return IX.inherit(elCfg, {
						value : self.model.get(key) || $XP(elCfg, 'defaultVal')
					});
				}
			});
			ret.push(IX.inherit(giftSet, {
				isDivForm : true,
				formClz : 'mcm-evtgift-form',
				items : form
				// form : {
				// 	formClz : 'mcm-evtgift-form',
				// 	items : form
				// }
			}));
		}
		return ret;
	};


	var EventGiftSetStepView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Event Gift Set View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			// this.formParams = this.model.getAll();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
			
		}
	});
	EventGiftSetStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_event_giftset')),
				formTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_base_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("baseform", Hualala.TplLib.get('tpl_mcm_base_form'));
			Handlebars.registerPartial("ctrlbtns", Hualala.TplLib.get('tpl_shop_modal_btns'));

			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				formTpl : formTpl,
				btnTpl : btnTpl
			});
		},
		initBaseCfg : function () {
			this.formKeys = EventGiftSetFormKeys;
		},
		initUIComponents : function () {
			var self = this;
			self.container.find('.isActive:last').addClass('isCurrent');
		},
		bindEvent : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts();
			self.container.on('click', '.panel-footer .btn', function (e) {
				var $btn = $(this), act = $btn.attr('name');
				self.container.find('.mcm-evtgift-panel').removeClass('isCurrent');
				if (act == 'addGift') {
					$btn.parents('.mcm-evtgift-panel').next('.mcm-evtgift-panel').addClass('isActive isCurrent');
				} else {
					$btn.parents('.mcm-evtgift-panel').removeClass('isActive');
					$btn.parents('.mcm-evtgift-panel').prev('.mcm-evtgift-panel').addClass('isActive isCurrent');
					self.resetGiftSet($btn.parents('.mcm-evtgift-panel'));
				}
			});
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
				
				self.model.emit('editEvent', {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.successFn.call(self);

					}
				});
			});

			self.container.on('click', '.btn[name=pickgift]', function (e) {
				var $btn = $(this);
				var modal = new HMCM.PickGiftModal({
					trigger : $btn,
					selectedFn : function (gift, $triggerEl) {
						var giftID = $XP(gift, 'giftItemID', ''),
							giftName = $XP(gift, 'giftName', '');
						var panel = $triggerEl.parents('.mcm-evtgift-panel'),
							idx = parseInt(panel.attr('data-index')) + 1;
						$('[name=EGiftID_' + idx + ']', panel).val(giftID);
						$('[name=EGiftName_' + idx + ']', panel).val(giftName);
					}
				});
			});
		},
		resetGiftSet : function ($panel) {
			var self = this;
			var idx = parseInt($panel.attr('data-index')) + 1;
			var formKeys = self.formKeys;
			_.each(formKeys, function (k) {
				var key = k + '_' + idx,
					$el = $('[name=' + key + ']', $panel);
				switch (k) {
					case "EGiftID":
					case "EGiftName":
						$el.val('');
						break;
					case "EGiftEffectTimeHours":
					case "EGiftTotalCount":
					case "EGiftOdds":
						$el.val(0);
						break;
					case "EGiftValidUntilDayCount":
						$el.val(30);
						break;
				}
			});
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl({
					gifts : renderData
				});
			self.container.html(htm);
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'EGiftID'}),
				ret = {};
			for (var i = 1; i <= EventGiftLevelCount; i++) {
				_.each(formKeys, function (k) {
					var key = k + '_' + i,
						elCfg = EventGiftsSetHT.get(key),
						type = $XP(elCfg, 'type');
					ret[key] = $XP(elCfg, 'validCfg', {});
				});
			}
			return ret;
			
		},
		serializeForm : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {};
			for (var i = 1; i <= EventGiftLevelCount; i++) {
				_.each(formKeys, function (k) {
					var key = k + '_' + i;
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			}
			return ret;
		}
	});

	HMCM.EventGiftSetStepView = EventGiftSetStepView;


	/**
	 * 创建向导中活动奖品步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initEventGiftSetStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventGiftSetStepView({
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
				mapFormElsData : mapEventGiftFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};


})(jQuery, window);