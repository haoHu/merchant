(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var GiftSetFormElsHT = HMCM.GiftSetFormElsHT;

	var GiftRuleFormKeys = 'giftItemID,validityDays,egiftEffectTimeHours,isHolidaysUsing,usingTimeType,foodScope,supportOrderType,isOfflineCanUsing,moneyLimitType,moenyLimitValue,shopNames'.split(',');

	/**
	 * 整理礼品规则表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapGiftRuleFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = GiftSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'combo') {
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

	var GiftRuleStepView = HMCM.GiftBaseInfoStepView.subclass({
		constructor : HMCM.GiftBaseInfoStepView.prototype.constructor
	});
	GiftRuleStepView.proto({
		initBaseCfg : function () {
			if (this.model.get('giftType') == 10) {
				this.formKeys = GiftRuleFormKeys;
			} else {
				this.formKeys = [];
			}
			
		},
		initUIComponents : function () {
			var self = this,
				moneyLimitType = self.model.get('moneyLimitType') || 0,
				$moenyLimitValue = $(':text[name=moenyLimitValue]'),
				$inputGrp = $moenyLimitValue.parents('.form-group');
			var shopNames = self.model.get('shopNames') || '',
				shopIDs = self.model.get('shopIDs') || '';
			$inputGrp[moneyLimitType == 0 ? 'addClass' : 'removeClass']('hidden');
			self.chooseShop = new HMCM.ChooseShopModal({
				parentView : self,
				trigger : self.container.find('div[name=shopNames]'),
				modalTitle : "选择店铺",
				modalClz : "choose-shop-modal",
				chosenShopNames : shopNames || '不限店铺',
				chosenShopIDs : IX.isEmpty(shopIDs) ? null : shopIDs.split(';')
			});
		},
		renderForm : function () {
			var self = this,
				giftType = self.model.get('giftType'),
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'wizard-step-form form-feedback-out',
					items : renderData
				});
			self.container.html(htm);
			if (giftType == 40) {
				self.container.append('<p class="alert alert-warning">顾客在获取会员充值类礼品后，将直接充入其会员储值余额账户中！</p>');
			} else if (giftType == 42) {
				self.container.append('<p class="alert alert-warning">顾客在获取会员积分类礼品后，将直接充入其会员积分余额账户中！</p>');
			}
			
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
				self.model.emit(act, {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						var resultController = self.parentView.parentView.$container.data('resultController');
						self.successFn.call(self);
						if (resultController) {
							resultController.emit('load');
						}
						self.parentView.modal.hide();
					}
				});
			});
			self.container.on('change', 'select[name=moneyLimitType]', function (e) {
				var $select = $(this),
					val = $select.val(),
					$moenyLimitValue = $(':text[name=moenyLimitValue]'),
					$inputGrp = $moenyLimitValue.parents('.form-group');
				$inputGrp[val == 0 ? 'addClass' : 'removeClass']('hidden');

			});
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
		serializeForm : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = GiftSetFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'checkboxgrp') {
						ret[key] = self.getCheckboxVal(key);
					} else if (type == 'radiogrp') {
						ret[key] = self.getRadiboxVal(key);
					} else if (type == 'selectShops') {
						ret[key] = $('[name=shopNames] .choose-shop-val', self.container).text();
					} else {
						ret[key] = $('[name=' + key + ']', self.container).val() || '';	
					}
					
				});
			return ret;
		}
	});

	HMCM.GiftRuleStepView = GiftRuleStepView;

	/**
	 * 创建向导中礼品规则步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initGiftRuleStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.GiftRuleStepView({
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
				mapFormElsData : mapGiftRuleFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
})(jQuery, window);