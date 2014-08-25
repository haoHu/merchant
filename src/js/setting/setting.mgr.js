(function ($, window) {
	IX.ns("Hualala.Setting");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var ServiceFormElsCfg = {
		advanceTime : {
			type : 'combo',
			label : '用户提前预订时间',
			defaultVal : 0,
			prefix : '$',
			surfix : '元',
			options : Hualala.TypeDef.MinuteIntervalOptions(),
			validCfg : {
				validators : {
					notEmpty : {
						message : "用户提前预订时间不能为空"
					}
				}
			}
		},
		noticeTime : {
			type : 'combo',
			label : '订单提前通知时间',
			defaultVal : 0,
			options : Hualala.TypeDef.MinuteIntervalOptions(),
			validCfg : {
				validators : {
					notEmpty : {
						message : "订单提前通知时间不能为空"
					}
				}
			}
		},
		minAmount : {
			type : 'text',
			label : '最低消费金额',
			prefix : '￥',
			surfix : '元',
			defaultVal : 0,
			validCfg : {
				validators : {
					notEmpty : {
						message : "最低消费金额不能为空"
					},
					numeric : {
						message: "最低消费金额必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "最低消费金额必须大于或等于0"
					}
				}
			}
		},
		serviceAmount : {
			type : 'text',
			label : '服务费',
			prefix : '￥',
			surfix : '元',
			defaultVal : 0,
			validCfg : {
				validators : {
					numeric : {
						message: "服务费必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "服务费必须大于或等于0"
					}
				}
			}
		},
		freeServiceAmount : {
			type : 'text',
			label : '免服务费菜品金额',
			prefix : '￥',
			surfix : '元',
			defaultVal : 0,
			validCfg : {
				validators : {
					numeric : {
						message: "免服务费菜品金额必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "免服务费菜品金额必须大于或等于0"
					}
				}
			}
		},
		holidayFlag : {
			type : 'combo',
			label : '节假日开放',
			defaultVal : 0,
			options : Hualala.TypeDef.HolidayFlagOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "节假日开放不能为空"
					}
				}
			}
		},
		openDays : {
			type : 'text',
			label : '开放服务天数',
			surfix : '天',
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "开放服务天数不能为空"
					},
					digits : {
						message: "开放服务天数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "开放服务天数必须大于或等于0"
					}
				}
			}
		},
		servicePeriods : {
			type : 'section',
			label : '开放时段',
			min : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {
						notEmpty : {
							message : "起始时间不能为空"
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
							message : "结束时间不能为空"
						}
					}
				}
			}
		},
		reserveTableTime : {
			type : 'combo',
			label : '留位时间',
			defaultVal : 0,
			options : Hualala.TypeDef.MinuteIntervalOptions(60),
			validCfg : {
				validators : {
					notEmpty : {
						message : "留位时间不能为空"
					},
					numeric : {
						message: "留位时间必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "留位时间必须大于或等于0"
					}
				}
			}
		},
		reserveTableDesc : {
			type : 'text',
			label : '留位特别说明',
			defaultVal : '',
			validCfg : {
				validators : {
					stringLength : {
						max : 40,
						message : '留位特别说明不能超过40个字'
					}
				}
			}
		},
		takeawayDeliveryAgent : {
			type : 'text',
			label : '配送单位',
			defaultVal : '自助配送',
			validCfg : {}
		},
		takeawayDeliveryTime : {
			type : 'text',
			label : '预计送餐所需时间',
			surfix : '分钟',
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "预计送餐所需时间不能为空"
					},
					numeric : {
						message: "预计送餐所需时间必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "预计送餐所需时间必须大于或等于0"
					}
				}
			}
		},
		takeawayScope : {
			type : 'text',
			label : '送餐范围',
			surfix : '公里',
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "送餐范围不能为空"
					},
					numeric : {
						message: "送餐范围必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "送餐范围必须大于或等于0"
					}
				}
			}
		},
		takeawayScopeDesc : {
			type : 'text',
			label : '送餐范围说明',
			defaultVal : '',
			validCfg : {
				validators : {
					stringLength : {
						max : 200,
						message : '送餐范围说明不能超过200个字'
					}
				}
			}
		},
		submitSMSTemplateID : {
			type : 'hidden',
			defaultVal : ''
		},
		checkSMSTemplateID : {
			type : 'hidden',
			defaultVal : ''
		},
		payMethod : {
			type : 'combo',
			label : '可选支付方式',
			defaultVal : 0,
			options : Hualala.TypeDef.PayMethodOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "可选支付方式不能为空"
					}
				}
			}
		},
		needInputTableName : {
			type : 'switcher',
			label : '下单时输入桌号',
			defaultVal : 1,
			onLabel : '需要',
			offLabel : '不需要',
			validCfg : {
				validators : {
					notEmpty : {
						message : "下单时输入桌号不能为空"
					}
				}
				
			}
		},
		supportInvoice : {
			type : 'switcher',
			label : '提供发票',
			defaultVal : 1,
			onLabel : '需要',
			offLabel : '不需要',
			validCfg : {
				validators : {
					notEmpty : {
						message : "提供发票不能为空"
					}
				}
			}
			
		},
		supportCommitToSoftware : {
			type : 'switcher',
			label : '下单到餐饮软件',
			defaultVal : 1,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {
					notEmpty : {
						message : "下单到餐饮软件不能为空"
					}
				}
			}
		},
		payMethodAtShop : {
			type : 'combo',
			label : '店内支付方式',
			defaultVal : 0,
			options : Hualala.TypeDef.PayMethodAtShopOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "店内支付方式不能为空"
					}
				}
			}
		},
		payBeforeCommit : {
			type : 'switcher',
			label : '支付完成后能下单',
			defaultVal : 1,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {
					notEmpty : {
						message : "支付完成后能下单不能为空"
					}
				}
			}
			
		},
		fetchFoodMode : {
			type : 'combo',
			label : '取餐模式',
			defaultVal : 0,
			options : Hualala.TypeDef.FetchFoodModeOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "取餐模式不能为空"
					}
				}
				
			}
		}
	};
	var ServiceFormElsHT = new IX.IListManager();
	_.each(ServiceFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k + '_min', maxName = k + '_max',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-sm-3',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-sm-3',
				});
			ServiceFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else {
			ServiceFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});
	
	var editServiceView = Stapes.subclass({
		/**
		 * 编辑业务详情
		 * @param  {Object} cfg {triggerEl, serviceID, serviceName, model}
		 *              @param {jQueryObj} triggerEl 触发元素 
		 *              @param {String} serviceID 业务ID
		 *              @param {String} serviceName 业务名称
		 *              @param {Object} model 店铺数据模型
		 * @return {NULL}    
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl');
			this.serviceID = $XP(cfg, 'serviceID', null);
			this.serviceName = $XP(cfg, 'serviceName', null);
			this.model = $XP(cfg, 'model', null);
			this.serviceList = Hualala.TypeDef.ShopBusiness;
			this.modal = null;
			if (!this.serviceID || !this.serviceName || !this.model) {
				throw("Service View init failed!");
			}
			this.loadTemplates();
			this.serviceInfo = this.getServiceInfo('id', this.serviceID);
			this.callServer = $XP(this.serviceInfo, 'callServer', '');
			if (IX.isFn(this.callServer)) {
				this.callServer = this.callServer;
			} else if (!IX.isString(this.callServer)) {
				throw("Configuration failed : Invalid Page Initialized for " + name);
				return false;
			} else if (IX.nsExisted(this.callServer)) {
				this.callServer = IX.getNS(this.callServer);
			}
			this.formParams = $XP(this.model.get('revParamJson'), this.serviceID);
			this.initModal();
			this.renderForm();
			this.bindEvent();
			this.emit('show');
		}
	});
	editServiceView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_service_form_layout')),
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
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'service_edit',
				clz : 'service-modal',
				title : self.getModalTitle(),
				afterRemove : function () {

				}
			});
		},
		initSwitcher : function (selector) {
			var self = this;
			self.modal._.body.find(selector).each(function () {
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
		},
		initTimePicker : function (selector) {
			var self = this;
			self.modal._.body.find(selector).timepicker({
				minuteStep : 30,
				showSeconds : false,
				showMeridian :  false,
				disableFocus : true,
				showInputs : false
			});
		},
		getServiceInfo : function (key, val) {
			return _.find(this.serviceList, function (v) {return v[key] == val});
		},
		getModalTitle : function () {
			return $XP(this.serviceInfo, 'label') + '配置';
		},
		bindEvent : function () {
			var self = this;
			var fvOpts = self.initValidFieldOpts();
			this.on({
				show : function () {
					this.modal.show();
				},
				hide : function () {
					this.modal.hide();
				}
			});
			self.modal._.dialog.find('.btn').on('click', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
				} else {
					var bv = self.modal._.body.find('form').data('bootstrapValidator');
					$btn.button('提交中...');
					bv.validate();
				}
			});
			self.modal._.body.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				var formParams = self.serializeForm();
				console.info(formParams);
				self.model.emit('setServiceParams', {
					callServer : self.callServer,
					params : formParams,
					serviceID : self.serviceID,
					failFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
					},
					successFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
						self.emit('hide');
					}
				});
			});;
		},
		decodeTimeStr : function (t) {
			if (t.length == 0) return '';
			return t.substr(0,2) + ':' + t.substr(2);
		},
		encodeTimeStr : function (min, max) {
			return (min + ',' + max).replace(/\:/g, '');
		},
		// 获取表单元素渲染数据
		mapServiceFormElsData : function () {
			var self = this,
				formKeys = $XP(self.serviceInfo, 'formKeys', '').split(','),
				formEls = _.map(formKeys, function (key) {
					var elCfg = ServiceFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'section' && key == 'servicePeriods') {
						var v = $XP(self.formParams, key, '').split(',');
						v = _.map(v, function (t) {
							return self.decodeTimeStr(t);
						});
						return IX.inherit(elCfg, {
							min : IX.inherit($XP(elCfg, 'min'), {
								value : v[0] || $XP(elCfg, 'min.defaultVal')
							}),
							max : IX.inherit($XP(elCfg, 'max'), {
								value : v[1] || $XP(elCfg, 'max.defaultVal')
							})
						});
					} else if (type == 'combo') {
						var v = $XP(self.formParams, key, $XP(elCfg, 'defaultVal')),
							options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									selected : $XP(op, 'value') == v ? 'selected' : ''
								});
							});
						return IX.inherit(elCfg, {
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal')),
							options : options
						});
					} else if (type == 'switcher') {
						return IX.inherit(elCfg, {
							checked : $XP(self.formParams, key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
						})
					} else {
						return IX.inherit(elCfg, {
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal'))
						});
					}
				});
			console.info(formEls);
			return formEls;
		},
		// 渲染表单
		renderForm : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts(),
				renderData = self.mapServiceFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'shop-service-form',
					items : renderData
				});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'submit', label : '保存'}
				]
			}));

			self.initSwitcher(':checkbox[data-type=switcher]');
			self.initTimePicker('[data-type=timepicker]');

		},
		// 获取表单数据
		serializeForm : function () {
			var self = this,
				formKeys = $XP(self.serviceInfo, 'formKeys', '').split(','),
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = ServiceFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'section' && key == 'servicePeriods') {
						var min = $('[name=' + key + '_min]').val(),
							max = $('[name=' + key + '_max]').val();
						ret[key] = self.encodeTimeStr(min, max);
					} else if (type == 'switcher') {
						ret[key] = $('[name=' + key + ']').attr('checked') ? 1 : 0;
					} else {
						ret[key] = $('[name=' + key + ']').val();
					}
				});
			return ret;
		},
		// 获取表单验证配置
		initValidFieldOpts : function () {
			var self = this,
				formKeys = $XP(self.serviceInfo, 'formKeys', '').split(','),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = ServiceFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (type == 'section') {
					var min = key + '_min', max = key + '_max';
					ret[min] = $XP(elCfg, 'min.validCfg', {});
					ret[max] = $XP(elCfg, 'max.validCfg', {});
				} else {
					ret[key] = $XP(elCfg, 'validCfg', {});
				}
			});
			return ret;
		}
	});
	Hualala.Setting.editServiceView = editServiceView;
})(jQuery, window);