(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	HMCM.giftEffectTimeHours = Hualala.Common.getMinuteIntervalOptions({
		startLabel : '立即生效',
		end : Hualala.Constants.SecondsOfDay / 60
	});

	HMCM.mapEGiftEffectTimeHourOptions = function (data) {
		var opts = _.reduce(data, function (memo, el, i) {
			if (i == 1) {
				memo = [memo];
			}
			return el.value >= 180 ? memo.concat(el) : memo;
		});
		opts = _.map(opts, function (el) {
			return IX.inherit(el, {
				value : parseInt($XP(el, 'value')) / 60
			});
		});
		return opts;
	};

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
				return IX.isEmpty($XP(el, 'value')) || $XP(el, 'value') == 20;
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
		giftImagePath: {
			type: 'uploadImage',
			label: '图片',
			defaultValue: '',
			validCfg: {
				validators: {
					notEmpty: {message: '图片不能为空'}
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
						message : "有效天数必须在1到9999天之间"
					}
				}
			}
		},
		egiftEffectTimeHours : {
			type : "combo",
			label : "生效时间",
			defaultVal : "0",
			options : HMCM.mapEGiftEffectTimeHourOptions(HMCM.giftEffectTimeHours),
			// options : _.reduce(giftEffectTimeHours, function (memo, el, i) {
			// 	if (i == 1) {
			// 		memo = [memo];
			// 	}
			// 	return el.value >= 180 ? memo.concat(el) : memo;
			// }),
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
						message : "请输入金额限制"
					},
					numeric : {
						message : "金额限制必须为数字"
					},
					integer: { message:'金额限制必须为整数' },
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "限制金额必须为大于0的整数"
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
				var v = self.model.get(key) || $XP(elCfg, 'defaultVal', ''),
					groupName = $XP(Hualala.getSessionSite(), 'groupName', ''),
					giftType = self.model.get('giftType') || $XP(GiftSetFormElsHT.get('giftType'), 'defaultVal'),
					giftLabel = $XP(getGiftTypeSet(giftType), 'label');
				return IX.inherit(elCfg, {
					value : v.length == 0 ? (groupName + giftLabel) : v,
					disabled : 'disabled'
				});
			} if (type == 'text' && key == 'giftValue') {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					disabled : (self.mode == 'edit') ? 'disabled' : ''
				});
			} if(type == 'textarea') {
                return IX.inherit(elCfg, {
                    value : Hualala.Common.decodeTextEnter(self.model.get(key) || '') || $XP(elCfg, 'dafaultVal')
                });
            } if(type == 'uploadImage'){
				return IX.inherit(elCfg, {hiddenGiftImage: self.model.get('giftType') == 30 ? '' : 'hidden', giftImagePath: self.getGiftImageUrl()});
			} else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal')
				});
			}
		});
		return ret;
	};

	var GiftBaseInfoFormKeys = 'giftItemID,giftType,giftValue,giftName,giftRemark,giftImagePath'.split(',');

	var GiftBaseInfoStepView = Stapes.subclass({
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
				throw("Gift Base Info View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm(function() {
				self.bindUploadImage();
			});
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
		renderForm : function (cbFn) {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'wizard-step-form form-feedback-out',
					items : renderData
				});
			self.container.html(htm);
			if(IX.isFn(cbFn)) cbFn();
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
				if(formParams.giftType == 30 && !self.model.get('giftImagePath')) {
					toptip({msg: '必须上传实物图片', type: 'danger'});
					self.parentView.switchWizardCtrlStatus('reset');
					return;
				}
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
				var $giftValueLabel = $giftValue.parents('.form-group').find('> label'),
					$giftValueSurfix = $giftValue.parents('.form-group').find('.input-group-addon:last'),
					$giftName = self.container.find(':text[name=giftName]'),
					$giftImage = self.container.find('form .gift-pic');
				if(giftType == 30) {
					$giftImage.removeClass('hidden');
					$giftName.val('')
				} else {
					$giftImage.addClass('hidden');
				}
				$giftValueLabel.text(giftType == 42 ? '积分点数' : '礼品价值');
				$giftValueSurfix.text(giftType == 42 ? '点' : '元');
				$giftName.trigger('change');

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
					giftTypeSet = getGiftTypeSet(giftType),
					groupName = $XP(Hualala.getSessionSite(), 'groupName', ''),
					val = giftType == 30 ? $txt.val() : (groupName + giftValue
						+ (IX.isEmpty(giftValue) ? '' : $XP(giftTypeSet, 'unit'))
						+ $XP(giftTypeSet, 'label', ''));
				if(giftType == 30){
					$txt.removeAttr('disabled');
				} else {
					$txt.prop('disabled', true);
				}
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
			if(ret.giftType != 30) {
				ret = _.omit(ret, 'giftImagePath');
				self.model.remove('giftImagePath');
			} else {
                ret.giftImagePath = self.model.get('giftImagePath');
            }
			return ret;
		},
		getGiftImageUrl: function(hwp) {
			var self = this,
				h = hwp ? parseInt(200 * hwp) : 200,
				cfg = hwp ? {width: 200, height: h} : {},
				giftImagePath = self.model.get('giftImagePath');
			return giftImagePath ? Hualala.Common.getSourceImage(giftImagePath, cfg) : Hualala.Global.IMAGE_ROOT + '/food_bg.png'
		},
		bindUploadImage: function() {
			var self = this,
				$giftPic = self.container.find('form .gift-pic'),
				$giftImgDiv = $giftPic.find('gift-img'),
				$uploadLabel = $giftPic.find('.btn-link'),
				$img = $giftPic.find('img'),
				imgSrc = $img.attr('src');
			Hualala.UI.fileUpload($uploadLabel, function(rsp) {
					var path = rsp.url, hwp = self.imgHWP || '';
					self.model.set({giftImagePath: path});
					if(!window.FileReader) $img.attr('src', self.getGiftImageUrl(hwp));
				},
				{
					onBefore: function ($elem, $file) {
						imgSrc = $img.attr('src');
						$giftImgDiv.addClass('loading');
						if (window.FileReader) self.previewImg($file[0], $img);
					},
					onFail: function () {
						if (window.FileReader) $img.attr('src', imgSrc);
					},
					onAlways: function () {
						$giftImgDiv.removeClass('loading');
					},
					accept: 'image/png,image/jpeg,image/jpg'
				}
			);
		},
		previewImg: function (fileInput, $img) {
			if (fileInput.files && fileInput.files[0])
			{
				var reader = new FileReader();
				reader.onload = function(e){
					$img.attr('src', e.target.result);
				}
				reader.readAsDataURL(fileInput.files[0]);
			}
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
					self.parentView.getNextStep();
					self.parentView.switchWizardCtrlStatus('reset');
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
		} else {
			nIdx == 1 && nextView.emit('reRender');
		}
		wizardModalView.switchWizardCtrlStatus('reset');
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
			var wizardType = wizardModalView.wizardType;
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var giftItemID = wizardModalView.model.get('giftItemID');
			if (!giftItemID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else if (giftItemID && wizardType == 'create') {
				Hualala.UI.Confirm({
					title : '取消创建礼品',
					msg : '是否取消创建礼品的操作？<br/>之前的操作将不生效！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			} else {
				Hualala.UI.Confirm({
					title : '取消编辑礼品',
					msg : '是否取消当前步骤的操作？<br/>当前步骤的修改将不保存！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			}
		});
	};
})(jQuery, window);