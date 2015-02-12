(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	HMCM.GiftDetailDonateGiftCtrlFormKeys = 'giftItemID,regMobile,giftCount,chkSendSms,smsContent'.split(',');
	HMCM.GiftDetailPayGiftCtrlFormKeys = 'giftItemID,regMobile,giftCount,validUntilDate,recirculable,getRemark,chkSendSms,smsContent'.split(',');
	HMCM.GiftDetailPayGiftOnlineCtrlFormKeys = 'giftItemID,voucherName,voucherValue,voucherTotalCount,voucherPrice,settleUnitID,settleUnitName,transTime,sponsorMobile,sponsorType'.split(',');

	var FormElsCfg = {
		giftItemID : {
			type : 'hidden',
			defaultVal : ''
		},
		regMobile : {
			type : 'text',
			label : "用户手机号码",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入用户手机号"
					},
					mobile : {
						message : "请输入正确的手机号"
					}
				}
			}
		},
		giftCount : {
			type : 'text',
			label : "赠送张数",
			defaultVal : "1",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入赠送张数"
					},
					integer : {
						message : "请输入正确的赠送张数"
					},
					between : {
						inclusive : true,
						min : 1,
						max : 100000,
						message : "请输入大于1到100000之间的整数"
					}
				}
			}
		},
		chkSendSms : {
			type : 'switcher',
			label : '发送短信',
			defaultVal : 1,
			onLabel : '发送',
			offLabel : '不发送',
			validCfg : {
				validators : {
					
				}
			}
		},
		smsContent : {
			type : 'textarea',
			label : "短信内容",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入短信内容"
					}
				}
			}
		},
		validUntilDate : {
			type : 'text',
			label : "券到期日",
			defaultVal : "",
			// readonly : "readonly",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择券到期日"
					},
					date : {
						format : "YYYY/MM/DD",
						message : "请选择正确的日期"
					}
				}
			}
		},
		recirculable : {
			type : 'switcher',
			label : '转售',
			defaultVal : 1,
			onLabel : '可以',
			offLabel : '不可以',
			validCfg : {
				validators : {
					
				}
			}
		},
		getRemark : {
			type : "textarea",
			label : "备注",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入备注信息"
					}
				}
			}

		},
		voucherName : {
			type : 'hidden',
			defaultVal : ''
		},
		voucherValue : {
			type : 'hidden',
			defaultVal : ''
		},
		voucherTotalCount : {
			type : 'text',
			label : "数量",
			defaultVal : "1",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入出售数量"
					},
					integer : {
						message : "请输入正确的出售数量"
					},
					between : {
						inclusive : true,
						min : 1,
						max : 100000,
						message : "请输入大于1到100000之间的整数"
					}
				}
			}
		},
		voucherPrice : {
			type : 'text',
			label : "单价",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入券单价"
					},
					numeric : {
						message : "请输数字"
					},
					callback : {
						message : "请输入正确格式的单价",
						callback : function (val, validator, $field) {
							var s = val.toString().movePoint(2).split('.'),
								f = s[1];
							if (!f) {
								return true;
							} else {
								return false;
							}
						}
					}
				}
			}
		},
		settleUnitID : {
			type : 'hidden',
			defaultVal : ''
		},
		settleUnitName : {
			type : 'pickaccount',
			label : "结算主体",
			disabled : 'disabled',
			validCfg : {
				validators : {
					notEmpty : {
						message : "选择结算主体"
					}
				}
			}
		},
		transTime : {
			type : 'section',
			label : '出售日期',
			min : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				readonly : 'readonly',
				validCfg : {
					group : '.min-input',
					validators : {
						// notEmpty : {
						// 	message : "请输入起始时间"
						// }
					}
				}
			},
			max : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				readonly : 'readonly',
				validCfg : {
					group : '.max-input',
					validators : {
						// notEmpty : {
						// 	message : "请输入结束时间"
						// }
					}
				}
			}
		},
		sponsorMobile : {
			type : 'text',
			label : "联系电话",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入联系电话"
					}
				}
			}
		}

	};

	var FormElsHT = new IX.IListManager();
	_.each(FormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = 'transStartTime',
				maxName = 'transEndTime',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-3 col-sm-3 col-md-3',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-3 col-sm-3 col-md-3',
				});
			FormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else {
			FormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});

	/**
	 * 整理赠送礼品表单元素渲染数据
	 * @return {[type]} [description]
	 */
	HMCM.mapDonateGiftFormRenderData = function () {
		var self = this,
			formKeys = self.formKeys,
			parentView = self.parentView;
		var ret = _.map(formKeys, function (key) {
			var elCfg = FormElsHT.get(key),
				type = $XP(elCfg, 'type');
			
			return IX.inherit(elCfg, {
				id : $XP(elCfg, 'id', '') + '_' + IX.id().replaceAll('ix', ''),
				value : key == 'giftItemID' ? $XP(parentView, 'giftItemID', '') : $XP(elCfg, 'defaultVal', '')
			});
		});
		return ret;
	};

	/**
	 * 整理支付礼品表单元素渲染数据
	 * @return {[type]} [description]
	 */
	HMCM.mapPayGiftFormRenderData = function () {
		var self = this,
			formKeys = self.formKeys,
			parentView = self.parentView;
		var ret = _.map(formKeys, function (key) {
			var elCfg = FormElsHT.get(key),
				type = $XP(elCfg, 'type');
			return IX.inherit(elCfg, {
				id : $XP(elCfg, 'id', '') + '_' + IX.id().replaceAll('ix', ''),
				value : key == 'giftItemID' ? $XP(parentView, 'giftItemID', '') : $XP(elCfg, 'defaultVal', ''),
				label : key == 'giftCount' ? '支付张数' : $XP(elCfg, 'label', '')
			});
		});
		return ret;
	};

	/**
	 * 整理网上出售表单元素渲染数据
	 * @return {[type]} [description]
	 */
	HMCM.mapPayGiftOnlineFormRenderData = function () {
		var self = this,
			formKeys = self.formKeys,
			parentView = self.parentView;
		var ret = _.map(formKeys, function (key) {
			var elCfg = FormElsHT.get(key),
				type = $XP(elCfg, 'type');
			return IX.inherit(elCfg, {
				id : $XP(elCfg, 'id', '') + '_' + IX.id().replaceAll('ix', ''),
				value : key == 'giftItemID' ? $XP(parentView, 'giftItemID', '') : $XP(elCfg, 'defaultVal', '')
			});
		});
		return ret;
	};	

	/**
	 * 创建赠送礼品表单的UI控件
	 * 
	 * @return {[type]} [description]
	 */
	HMCM.initDonateGiftFormUIComponent = function () {
		var self = this;
		var btnTpl = self.get('btnTpl');
		self.$form.find('textarea[name=smsContent]').parents('.form-group').hide();
		self.$form.find(':checkbox[name=chkSendSms]').each(function () {
			var $el = $(this),
				onLabel = $el.attr('data-onLabel'),
				offLabel = $el.attr('data-offLabel');
			$el.bootstrapSwitch({
				size : 'normal',
				onColor : 'primary',
				offColor : 'default',
				onText : onLabel,
				offText : offLabel
			});
		});
		self.$panelFooter.html(btnTpl({
			btns : [
				{clz : 'btn-warning pull-right', name : 'submit', label : '确认赠送'}
			]
		}));

	};

	/**
	 * 创建支付礼品表单UI控件
	 * @return {[type]} [description]
	 */
	HMCM.initPayGiftFormUIComponent = function () {
		var self = this;
		var btnTpl = self.get('btnTpl');
		self.$form.find('textarea[name=smsContent]').parents('.form-group').hide();
		self.$form.find(':checkbox[name=chkSendSms], :checkbox[name=recirculable]').each(function () {
			var $el = $(this),
				onLabel = $el.attr('data-onLabel'),
				offLabel = $el.attr('data-offLabel');
			$el.bootstrapSwitch({
				size : 'normal',
				onColor : 'primary',
				offColor : 'default',
				onText : onLabel,
				offText : offLabel
			});
		});
		self.$form.find(':text[name=validUntilDate]').datetimepicker({
			format : 'yyyy/mm/dd',
			startDate : '2010/01/01',
            autoclose : true,
            minView : 'month',
            todayBtn : true,
            todayHighlight : true,
            language : 'zh-CN'
		});
		self.$panelFooter.html(btnTpl({
			btns : [
				{clz : 'btn-warning pull-right', name : 'submit', label : '确认支付'}
			]
		}));
	};


	/**
	 * 创建网上出售礼品表单UI控件
	 * 
	 * @return {[type]} [description]
	 */
	HMCM.initPayGiftOnlineFormUIComponent = function () {
		var self = this;
		var btnTpl = self.get('btnTpl');
		self.$form.find('[data-type=datetimepicker]').datetimepicker({
			format : 'yyyy/mm/dd',
			startDate : '2010/01/01',
            autoclose : true,
            minView : 'month',
            todayBtn : true,
            todayHighlight : true,
            language : 'zh-CN'
		});
		self.$panelFooter.html(btnTpl({
			btns : [
				{clz : 'btn-warning pull-right', name : 'submit', label : '申请出售'}
			]
		}));
		initAccountChosenPanel.call(self);
	};

	HMCM.bundleDonateGiftFormEvent = function () {
		var self = this;
		var parentView = self.parentView,
			mGiftDetail = parentView.mGiftDetail;
		var $smsContent = self.$form.find('textarea[name=smsContent]');
		var fvOpts = initDonateGiftValidFieldOpts.call(self);
		self.$form.find(':checkbox[name=chkSendSms]').on('switchChange.bootstrapSwitch', function (e, state) {
			var $el = $(this);
			if (state == 1) {
				$smsContent.val(genSMSMessage.call(self));
				$smsContent.parents('.form-group').show();
			} else {
				self.$form.find('textarea[name=smsContent]').parents('.form-group').hide();
			}
		});
		self.$form.on('keyup', ':text[name=giftCount]', function (e) {
			var $input = $(this);
			var msg = genSMSMessage.call(self);
			self.$form.find('textarea[name=smsContent]').val(msg);
		});
		self.$form.bootstrapValidator({
			trigger : 'blur',
			fields : fvOpts
		}).on('error.field.bv', function (e, data) {
			var $form = $(e.target),
				bv = $form.data('bootstrapValidator');
			// self.failFn(self.model);
		}).on('success.form.bv', function (e, data) {
			e.preventDefault();
			var $form = $(e.target),
				bv = $form.data('bootstrapValidator');
			var formParams = serializeDonateGiftForm.call(self);
			IX.Debug.info("DEBUG: Donate Gift Form Params:");
			IX.Debug.info(formParams);
			Hualala.Global.giftDetailDonateGift(formParams, function (res) {
				if ($XP(res, 'resultcode', '000')) {
					toptip({
						msg : "提交成功",
						type : 'success'
					});
					self.initFormPanel();
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
			});
		});
		self.$panelFooter.find('.btn[name=submit]').on('click', function (e) {
			var bv = self.$form.data('bootstrapValidator');
			bv.validate();
		});
	};

	HMCM.bundlePayGiftFormEvent = function () {
		var self = this;
		var parentView = self.parentView,
			mGiftDetail = parentView.mGiftDetail;
		var $smsContent = self.$form.find('textarea[name=smsContent]');
		var fvOpts = initPayGiftValidFieldOpts.call(self);
		self.$form.find(':checkbox[name=chkSendSms]').on('switchChange.bootstrapSwitch', function (e, state) {
			var $el = $(this);
			if (state == 1) {
				$smsContent.val(genSMSMessage.call(self));
				$smsContent.parents('.form-group').show();
			} else {
				self.$form.find('textarea[name=smsContent]').parents('.form-group').hide();
			}
		});
		self.$form.on('keyup', ':text[name=giftCount]', function (e) {
			var $input = $(this);
			var msg = genSMSMessage.call(self);
			self.$form.find('textarea[name=smsContent]').val(msg);
		});
		self.$form.bootstrapValidator({
			trigger : 'blur',
			fields : fvOpts
		}).on('error.field.bv', function (e, data) {
			var $form = $(e.target),
				bv = $form.data('bootstrapValidator');
			// self.failFn(self.model);
		}).on('success.form.bv', function (e, data) {
			e.preventDefault();
			var $form = $(e.target),
				bv = $form.data('bootstrapValidator');
			var formParams = serializePayGiftForm.call(self);
			
			IX.Debug.info("DEBUG: Pay Gift Form Params:");
			IX.Debug.info(formParams);
			Hualala.Global.giftDetailDonateGift(formParams, function (res) {
				if ($XP(res, 'resultcode', '000')) {
					toptip({
						msg : "提交成功",
						type : 'success'
					});
					self.initFormPanel();
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
			});
			
		});
		self.$panelFooter.find('.btn[name=submit]').on('click', function (e) {
			var bv = self.$form.data('bootstrapValidator');
			bv.validate();
		});
		self.$form.find(':text[name=validUntilDate]').on('change', function (e) {
			self.$form.bootstrapValidator('revalidateField', 'validUntilDate');
		});
	};

	HMCM.bundlePayGiftOnlineFormEvent = function () {
		var self = this;
		var parentView = self.parentView,
			mGiftDetail = parentView.mGiftDetail;
		var fvOpts = initPayGiftOnlineValidFieldOpts.call(self);
		self.$form.bootstrapValidator({
			trigger : 'blur',
			fields : fvOpts
		}).on('error.field.bv', function (e, data) {
			var $form = $(e.target),
				bv = $form.data('bootstrapValidator');
			// self.failFn(self.model);
		}).on('success.form.bv', function (e, data) {
			e.preventDefault();
			var $form = $(e.target),
				bv = $form.data('bootstrapValidator');
			var formParams = serializePayGiftOnlineForm.call(self);
			
			IX.Debug.info("DEBUG: Pay Gift Online Form Params:");
			IX.Debug.info(formParams);
			Hualala.Global.giftDetailPayGiftOnline(formParams, function (res) {
				if ($XP(res, 'resultcode', '000')) {
					toptip({
						msg : "提交成功",
						type : 'success'
					});
					self.initFormPanel();
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
			});
			
		});
		self.$panelFooter.find('.btn[name=submit]').on('click', function (e) {
			var bv = self.$form.data('bootstrapValidator');
			bv.validate();
		});
	};


	/**
	 * 生成短信模板
	 * @return {[type]} [description]
	 */
	var genSMSMessage = function () {
		var self = this,
			parentView = self.parentView,
			mGiftDetail = parentView.mGiftDetail,
			giftInfo = mGiftDetail.get('records')[0];
		var siteInfo = Hualala.getSessionSite();
		var groupName = $XP(siteInfo, 'groupName', '');
		var giftCount = self.$form.find(':text[name="giftCount"]').val();
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_gift_sms'));
		var msg = tpl({
			groupName : groupName,
			giftCount : giftCount,
			giftName : $XP(giftInfo, 'giftName', ''),
			site : Hualala.Global.HualalaWebSite
		});
		return msg;
	};

	var renderChosenPanelOptions = function (sections) {
		var self = this;
		var optTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_opt'));
		var renderData = _.map(sections, function (el) {
			return IX.inherit(el, {
				name : el.settleUnitName,
				value : el.settleUnitID
			});
		});
		renderData.unshift({
			name : '',
			value : ''
		});
		self.$form.find('select[name=settleUnitName]').html(optTpl({
			items : renderData
		}));

	};

	var initAccountChosenPanel = function () {
		var self = this;
		var matcher = (new Pymatch([]));
		var sections = [];
		Hualala.Global.queryAccount({}, function (res) {
			if ($XP(res, 'resultcode') == '000') {
				sections = $XP(res, 'data.records', []);
				renderChosenPanelOptions.call(self, sections);

				var getMatchedFn = function (searchText) {
					matcher.setNames(_.map(sections, function (el) {
						return IX.inherit(el, {
							name : el.settleUnitName,
							value : el.settleUnitID
						});
					}));
					var matchedSections = matcher.match(searchText);
					var matchedOptions = {};
					_.each(matchedSections, function (el, i) {
						matchedOptions[el[0].settleUnitID] = true;
					});
					return matchedOptions;
				};
				self.$form.find('select[name=settleUnitName]').chosen({
					width : '200px',
					placeholder_text : "请选择结算主体",
					no_results_text : "抱歉，没有找到！",
					allow_single_deselect : false,
					getMatchedFn : getMatchedFn
				}).change(function (e) {
					var $this = $(this);
					self.$form.find(':hidden[name=settleUnitID]').val($this.val());
				});
			}
		});
	};

	var initDonateGiftValidFieldOpts = function () {
		var self = this,
			formKeys = _.reject(self.formKeys, function (k) {return k == 'giftItemID'}),
			ret = {};
		_.each(formKeys, function (key) {
			var elCfg = FormElsHT.get(key),
				type = $XP(elCfg, 'type');
			ret[key] = $XP(elCfg, 'validCfg', {});
		});
		return ret;
	};

	var initPayGiftValidFieldOpts = function () {
		var self = this,
			formKeys = _.reject(self.formKeys, function (k) {return k == 'giftItemID'}),
			ret = {};
		_.each(formKeys, function (key) {
			var elCfg = FormElsHT.get(key),
				type = $XP(elCfg, 'type');
			ret[key] = $XP(elCfg, 'validCfg', {});
		});
		return ret;
	};

	var initPayGiftOnlineValidFieldOpts = function () {
		var self = this,
			formKeys = _.reject(self.formKeys, function (k) {return k == 'giftItemID' || k == 'voucherName' || k == 'voucherValue' || k == 'settleUnitID';}),
			ret = {};
		_.each(formKeys, function (key) {
			var elCfg = FormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'section') {
				var min = 'transStartTime', max = 'transStartTime';
					ret[min] = $XP(elCfg, 'min.validCfg', {});
					ret[max] = $XP(elCfg, 'max.validCfg', {});
			} else {
				ret[key] = $XP(elCfg, 'validCfg', {});
			}
			
		});
		return ret;

	};

	var serializeDonateGiftForm = function () {
		var self = this,
			formKeys = self.formKeys,
			ret = {},
			formEls = _.map(formKeys, function (key) {
				var elCfg = FormElsHT.get(key),
					type = $XP(elCfg, 'type');
				ret[key] = $('[name=' + key + ']', self.$form).val();
			});
		return ret;
	};

	var serializePayGiftForm = function () {
		var self = this,
			formKeys = self.formKeys,
			ret = {},
			formEls = _.map(formKeys, function (key) {
				var elCfg = FormElsHT.get(key),
					type = $XP(elCfg, 'type');
				ret[key] = $('[name=' + key + ']', self.$form).val();
			});
		return ret;
	};

	var serializePayGiftOnlineForm = function () {
		var self = this,
			formKeys = self.formKeys,
			ret = {},
			formEls = _.map(formKeys, function (key) {
				var elCfg = FormElsHT.get(key),
					type = $XP(elCfg, 'type');
				ret[key] = $('[name=' + key + ']', self.$form).val();
			});
		return ret;
	};






	var MCMGiftDetailFormPanel = Stapes.subclass({
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container');
			this.parentView = $XP(cfg, 'parentView');
			this.formKeys = $XP(cfg, 'formKeys');
			this.callServer = $XF(cfg, 'callServer');
			this.panelTitle = $XP(cfg, 'panelTitle', '');
			this.$panelBody = null;
			this.$panelFooter = null;
			this.$form = null;

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			this.initUIComponents = $XF(cfg, 'initUIComponents');
			this.bundleFormEvent = $XF(cfg, 'bundleFormEvent');
			

			this.loadTemplates();
			this.initLayout();
			this.initFormPanel();
		}
	});

	MCMGiftDetailFormPanel.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_giftdetail_formpanel')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				gridTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid')),
				formTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_base_form'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			// Handlebars.registerPartial("baseform", Hualala.TplLib.get('tpl_mcm_base_form'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				formTpl : formTpl
			});
		},
		initLayout : function () {
			var self = this;
			var layoutTpl = self.get('layoutTpl');
			var htm = layoutTpl({
				panelTitle : self.panelTitle
			});
			self.container.html(htm);
			self.$panelBody = self.container.find('.panel-body');
			self.$panelFooter = self.container.find('.panel-footer');
		},
		initFormPanel : function () {
			var self = this,
				formTpl = self.get('formTpl'),
				renderData = self.mapFormElsData.call(self),
				htm = formTpl({
					formClz : 'form-feedback-out',
					items : renderData
				});
			self.$panelBody.html(htm);
			self.$form = self.$panelBody.find('form');
			self.initUIComponents.call(self);
			self.bundleFormEvent.call(self);
		}
	});

	HMCM.MCMGiftDetailFormPanel = MCMGiftDetailFormPanel;

})(jQuery, window);