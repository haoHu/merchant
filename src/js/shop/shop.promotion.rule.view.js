(function ($, window) {
	IX.ns("Hualala.Shop");
	var HSP = Hualala.Shop;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var PromotionRulesSetHT = new IX.IListManager();
	var PromotionRulesSetFormKeys = "discountScope,discountScale,discountRange,remark,chkFreeAmount,freeAmount,chkPresentInfo,presentInfo,chkVoucher,voucherItemID,voucherValue,voucherDesc,voucherNum,validityDays,voucherType".split(',');
	var PromotionLevelCount = 3;
	var PromotionLevelNames = ["", "档次一","档次二","档次三"];
	HSP.PromotionLevelNames = PromotionLevelNames;
	var PromotionRulesSetFormElsCfg = {
		//是否打折
		discountScope :{
			type : "checkboxgrp",
			label : "",
			defaultVal : "0",
			options : [{
				value : 1, label : '折扣'
			}],
			validCfg : {
				validators : {}
			}
		},
		//折扣率
		discountScale:{
			type : "text",
			label : "折扣率",
			defaultVal : "0",
			surfix : '折',
			help : "如：9折为九折、8.8折为八八折",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入折扣率"
					}
				}
			}
		},
		//折扣范围
		discountRange : {
			type : 'radiogrp',
			label : '折扣范围',
			defaultVal : '0',
			options : [{value:"1",label:"全单"},{value:"0",label:"部分"},],
			validCfg : {}
		},
		remark : {
			type : 'textarea',
			label : "打折备注",
			defaultVal : "",
			validCfg : {
				validators : {
				}
			}
		},
		//减免freeAmount
		chkFreeAmount :{
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '减免'
			}],
			validCfg : {
				validators : {}
			}
		},
		freeAmount: {
			type : "text",
			label : "减免金额",
			prefix : '￥',
  			surfix : '元',
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "减免金额不能为空"
					}
				}
			}
		},
		//赠送
		chkPresentInfo:{
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '赠送'
			}],
			validCfg : {
				validators : {}
			}
		},
		presentInfo: {
			type : "text",
			label : "赠送备注",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入赠送备注"
					}
				}
			}
		},
		//代金券id
		voucherItemID : {
			type : 'hidden',
			defaultVal : ''
		},
		//代金券价值
		voucherValue  : {
			type : 'hidden',
			defaultVal : ''
		},
		//代金券名称
		voucherDesc : {
			type : 'pickgift',
			defaultVal : '',
			label : '代金券名称',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择代金券"
					}
				}
			}
		},
		//赠券张数
		voucherNum  : {
			type : "text",
			label : "赠券张数",
			defaultVal : "1",
			surfix : '张',
			validCfg : {
				validators : {
					notEmpty : {
						message : "赠券张数不能为空"
					},
                    integer: {message: '赠券张数必须是整数'},
                    between: {
                    	min: 1, 
                    	max: 10,
                    	message: '必须是1-10的值'
                    }
				}
			}
		},
		//券有效期
		validUntilDate : {
			type : "text",
			label : "代金券有效期",
			defaultVal : "60",
			surfix : '天',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入券有效期"
					},
					numeric : {
						message : "券有效期必须为数字"
					},
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "券有效期必须大于0"
					}
				}
			}
		},
		//返券
		chkVoucher :{
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '返券'
			}],
			validCfg : {
				validators : {}
			}
		},
		//返券规则
		voucherType  : {
			type : 'combo',
			label : "返券规则",
			defaultVal : "0",
			options : Hualala.TypeDef.ShopPromotionDataSet.returnVoucherTypes,
			validCfg : {
				validators : {
					notEmpty : {
						message : "返券规则不能为空"
					}
				}
			}
		},
		//赠送备注
		presentInfo :{
			type : "text",
			label : "赠送备注",
			defaultVal : "0",
			validCfg : {
				validators : {
					notEmpty : {
						message : "赠送备注不能为空"
					}
				}
			}
		}

	};
	for (var i = 1; i <= PromotionLevelCount; i++) {
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		_.each(PromotionRulesSetFormElsCfg, function (el, k) {
			var key = k + '_' + i,
				type = $XP(el, 'type');
			if (type == 'radiogrp' || type == 'checkboxgrp') {
				var ops = _.map($XP(el, 'options'), function (op) {
					return IX.inherit(op, {
						id : key,
						name : k,
						clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
					});
				});
				PromotionRulesSetHT.register(key, IX.inherit(el, {
					id : key,
					name : k,
					options : ops,
					labelClz : labelClz,
					clz : 'col-sm-7'
				}));
			}
			else{ 
				PromotionRulesSetHT.register(key, IX.inherit(el, {
					id : key,
					name : k,
					labelClz : labelClz,
					clz : 'col-sm-6'
				}));
			}
		});
	}
	/**
	 * 整理促销规则表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapPromotionRulesFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var rulesJson=self.model.get('rules');
			rulesJson = !rulesJson ? {} : JSON.parse(rulesJson);
		var updatestageType=$("#promotion_way").find('input[name="stageType"]:checked').val(),
			equalFlag = (rulesJson.stageType==updatestageType),
			stageType = equalFlag?rulesJson.stageType:updatestageType,
			promotionLevelNames = PromotionLevelNames;
			ret = [];
		//当stageType为2的时候,即有档次的选择的时候
		if(stageType==2){
			for (var i = 1; i <= PromotionLevelCount; i++) {
				var promotionLevelName = promotionLevelNames[i],
					panelClz = 'mcm-evtgift-panel ';
				var stage = rulesJson.stage;
				if ((stage != undefined && !IX.isEmpty(stage)) || i == 1) {
					panelClz += ' isActive ';
				}
				var addbtn = {clz : 'btn-warning btn-add', name : 'addGift', label : '添加新档'},
					delbtn = {clz : 'btn-default btn-del', name : 'deleteGift', label : '删除' + promotionLevelName};
				var giftSet = {
					promotionLevelName : promotionLevelName,
					clz : panelClz,
					btns : i == 1 ? [addbtn] : (i == PromotionLevelCount ? [delbtn] : [delbtn,addbtn])
				};
				var form = _.map(formKeys, function (k) {
					var key = k + '_' + i,
						elCfg = PromotionRulesSetHT.get(key),
						type = $XP(elCfg, 'type');
					var v = null;
					if (type == 'checkboxgrp') {
						switch(k) {
							//折扣勾选项
	                        case "discountScope":
	                        	var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1][k]:0,
	                        		options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
	                        //减免金额勾选项
	                        case "chkFreeAmount" :
	                        	var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1].freeAmount:0,
								options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
	                        //赠送备注勾选
	                        case "chkPresentInfo":
	                        	var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1].presentInfo:0,
								options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
	                        //返券勾选
	                        case "chkVoucher" :
	                        	var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1].voucherDesc:0,
								options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
                    	}
					} else if(type == 'textarea') {
						var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1].remark:0;
						return IX.inherit(elCfg, {
			                value : Hualala.Common.decodeTextEnter(v || '') || $XP(elCfg, 'dafaultVal')
			            });
					} else if(type=='radiogrp') {
						if(k=='discountRange'){
							var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1].remark:0,
								options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ?'' :'checked'
									});
								});
							return IX.inherit(elCfg, {
								options : options
							});
						}
					} else if(type=='text'){
						switch(k) {
	                        case "discountScale":
	                       	var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1][k]:0,
	                       		label = parseFloat(v.toString().movePoint(1)).toString();
	                        	return IX.inherit(elCfg, {
									value : label || $XP(elCfg, 'defaultVal'),
									hidden: v==0 ? "hidden": ""
								});
	                            break;
	                        case "freeAmount" :
	                        case "presentInfo":
	                        case "voucherNum" :
	                        case "voucherDesc" :
	                        	var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1][k]:0;
	                        	return IX.inherit(elCfg, {
									value : v || $XP(elCfg, 'defaultVal'),
									hidden: v==0 ? "hidden": ""
								});
	                            break;
                    	}
					} else {
						var v = (rulesJson.stage!=undefined)?rulesJson.stage[i-1][k]:0;
						return IX.inherit(elCfg, {
							value : v || $XP(elCfg, 'defaultVal')
						});
					}
				});
				ret.push(IX.inherit(giftSet, {
					isDivForm : true,
					formClz : 'mcm-evtgift-form',
					items : form
				}));
			}
			return {
				hideTip :'hidden',
				giftSetTitle :stageType == 2 ? '档次设置' :'促销规则设置',
				hidden : "",
				gifts : ret
			};	
		}
		//当只有stageType为0和1的时候。没有档次选择
		else{
			if (stageType == 0 || stageType == 1) {
				panelClz += ' singlegift ';
			}
		}

	};
	var PromotionRuleStepView = Stapes.subclass({
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
	PromotionRuleStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_event_giftset')),
				formTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_base_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("baseform", Hualala.TplLib.get('tpl_promotion_base_form'));
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
			this.formKeys = PromotionRulesSetFormKeys;
		},
		initUIComponents : function () {
			var self = this;
			self.container.find('.isActive:last').addClass('isCurrent');
			self.setSwitcherLayout(self.container.find(':input[name^=discountScope]'));
		},
		setSwitcherLayout : function ($chk) {
			var checked = $chk.is(':checked');
			var $nextFormGroup = $chk.parents('.form-group').next('.form-group');
			$nextFormGroup[checked ? 'removeClass' : 'addClass']('hidden');
			$nextFormGroup.find(':text').attr('disabled', checked ? false : true);
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
				IX.Debug.info("DEBUG: 促销规则 Form Params:");
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
			self.container.on('change', ':text[name^=EGiftName]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name');
				self.container.find('form').bootstrapValidator('revalidateField', name);
			});
			self.container.on('change', 'input[name^=discountScope]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=discountScale]'),
					$fmgrps = $els.parents('.form-group');
				if (checkedFlag) {
					$els.attr('disabled', false);
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('change', 'input[name^=chkPresentInfo]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=presentInfo]'),
					$fmgrps = $els.parents('.form-group');
				if (checkedFlag) {
					$els.attr('disabled', false);
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('change', ':hidden[name^=EGiftType]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					val = $txt.val();
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=EGfitValidUntilDayCount]'),
					$fmgrps = $els.parents('.form-group');
				if (val == 10) {
					$els.attr('disabled', false);
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('click', '.btn[name=pickgift]', function (e) {
				var $btn = $(this);
				var modal = new Hualala.MCM.PickGiftModal({
					trigger : $btn,
					selectedFn : function (gift, $triggerEl) {
						var giftID = $XP(gift, 'giftItemID', ''),
							giftName = $XP(gift, 'giftName', ''),
							giftType = "10";
						var panel = $triggerEl.parents('.mcm-evtgift-panel'),
							idx = parseInt(panel.attr('data-index')) + 1;
						$('#voucherItemID_' + idx, panel).val(giftID);
						$('#voucherDesc_' + idx, panel).val(giftName).trigger('change');
						//$('[name=EGiftType_' + idx + ']', panel).val(giftType).trigger('change');
					}
				});
			});
		},
		resetGiftSet : function ($panel) {
			var self = this;
			var idx = parseInt($panel.attr('data-index')) + 1;
			var formKeys = self.formKeys;
			_.each(formKeys, function (k) {
				var id = k + '_' + idx,
					$el = $('#' + id + '', $panel);
				switch (k) {
					case "voucherItemID":
					case "voucherDesc":
					case "voucherValue":
						$el.val('');
						break;
					case "voucherNum":
						$el.val(1);
						break;
					case "validUntilDate":
						$el.val(30);
						break;
				}
			});
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl(renderData);
			self.container.html(htm);
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'voucherItemID' || k == 'EGiftType'}),
				ret = {};
			for (var i = 1; i <= PromotionLevelCount; i++) {
				_.each(formKeys, function (k) {
					var key = k,
						elCfg = PromotionRulesSetHT.get(key),
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
			for (var i = 1; i <= PromotionLevelCount; i++) {
				_.each(formKeys, function (k) {
					var key = k + '_' + i;
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			}
			return ret;
		},
		refresh : function () {
			var self = this;
			self.renderForm();
			/*this.formParams = this.model.getAll();
			self.initUIComponents();*/
		},
		delete : function (successFn, faildFn) {
			var self = this;
			self.model.emit('deleteItem', {
				itemID : self.model.get('itemID'),
				successFn : function (res) {
					successFn(res);
				},
				faildFn : function (res) {
					faildFn(res);
				}
			})
		}
	});

	HSP.PromotionRuleStepView = PromotionRuleStepView;

	/**
	 * 创建向导中活动奖品步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HSP.initPromotionRuleStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HSP.PromotionRuleStepView({
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
				mapFormElsData : mapPromotionRulesFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};


})(jQuery, window);