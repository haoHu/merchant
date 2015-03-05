(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CMath = Hualala.Common.Math;

	var AccountActs = [
		{clz : 'btn-success withdraw', act : 'withdraw', label : '提现'},
		{clz : 'btn-link', act : 'edit', label : '修改财务人员信息'},
		{clz : 'btn-link', act : 'queryShops', label : '查看全部店铺'},
		{clz : 'btn-link', act : 'delete', label : '删除此帐户'}
	];

	var AccountMgrView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 面包屑导航条
			this.$nav = null;
			this.breadCrumbs = null;
			// schema容器
			this.$schema = null;
			// 交易详情
			this.$detail = null;

			this.model = null;

			this.loadTemplates();
		}
	});

	AccountMgrView.proto({
		/**
		 * 初始化View层
		 * 
		 * @param  {Object} cfg {model, container}
		 * @return {[type]}
		 */
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("Account Detail View Init Failed!");
				return ;
			}
			this.initLayout();
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.html(htm);
			this.$nav = this.$container.find('.account-nav');
			this.$schema = this.$container.find('.account-schema-box');
			this.$detail = this.$container.find('.account-detail-box');
			this.bindEvent();
		},
		initBreadCrumbs : function () {
			var self = this,
				$nav = self.$nav,
				parentNames = Hualala.PageRoute.getParentNamesByPath();
			self.breadCrumbs = new Hualala.UI.BreadCrumb({
				container : $nav,
				hideRoot : true,
				nodes : parentNames,
				clz : 'account-crumbs',
				clickFn : function () {
					var $this = $(this);
					document.location.href = $this.attr('data-href');
				},
				mapRenderData : function (data, hideRoot, clz) {
					var list = _.map(data, function (el, idx, l) {
						var label = $XP(el, 'label', ''),
							name = $XP(el, 'name', ''),
							path = Hualala.PageRoute.createPath(name, [self.model.get('settleUnitID')]);
						return {
							clz : 'crumb',
							label : label,
							path : path,
							name : name,
							isLastNode : (data.length - 1 == idx) ? true : false
						};
					});
					hideRoot === true && list.shift();
					return {
						clz : clz,
						items : list
					};
				}

			});

		},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_accountMgr_layout')),
				schemaTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_schema')),
				withDrawTpl = Handlebars.compile(Hualala.TplLib.get('tpl_withdraw_form'));
			// 注册子模版
			Handlebars.registerPartial("accountCard", Hualala.TplLib.get('tpl_account_card'));
			this.set({
				layoutTpl : layoutTpl,
				schemaTpl : schemaTpl,
				withDrawTpl : withDrawTpl
			});
		},
		bindEvent : function () {
			var self = this;
			self.$schema.on('click', '.btn.withdraw', function (e) {
				if ($(this).hasClass('disabled')) return;
				self.withdraw($(this));
			});
			self.$schema.on('click', '[data-act]', function (e) {
				var $btn = $(this);
				var act = $btn.attr('data-act');
				if ($btn.hasClass('disabled')) return;
				switch(act) {
					case 'edit':
						self.editAccount($btn);
						break;
					case 'queryShops':
						self.queryShops();
						break;
					case 'delete':
						self.deleteAccount();
						break;
				}
			});
			
			self.on({
				'updateSettleBalance' : function (mAccount) {
					var settleUnitID = mAccount.get('settleUnitID'),
						settleBalance = CMath.prettyNumeric(CMath.standardPrice(mAccount.get('settleBalance')));
					self.$container.find('[data-id=' + settleUnitID + '] .cash > strong').html(settleBalance);
				}
			});
		},
		editAccount : function ($trigger) {
			// triggerEl, mode, model, parentView
			var editAccount = new AccountEditView({
				triggerEl : $trigger,
				mode : 'edit',
				model : this.model,
				parentView : this
			});
		},
		withdraw : function ($trigger) {
			var self = this;
			// 提现操作
			var modal = new Hualala.Account.WithdrawCashView({
				triggerEl : $trigger,
				settleUnitID : self.model.get('settleUnitID'),
				model : self.model,
				parentView : self
			});
		},
		queryShops : function ($trigger) {
			var self = this;
			var modal = new Hualala.Account.AccountQueryShopModal({
				triggerEl : $trigger,
				settleUnitID : self.model.get('settleUnitID'),
				model : self.model,
				parentView : self
			});
		},
		deleteAccount : function () {
			var self = this;
			Hualala.UI.Confirm({
				title : '删除结算账户',
				msg : '是否删除该账户？',
				okLabel : '删除',
				okFn : function () {
					self.model.emit('delete', {
						successFn : function (settleUnitID) {
							document.location.href = Hualala.PageRoute.createPath('account', [settleUnitID]);
						}
					});
				}
			});
			
		},
		mapRenderData : function () {
			var self = this,
				model = self.model,
				acts = AccountActs,
				acts1 = _.filter(IX.clone(acts), function (el) {
					return $XP(el, 'act') != 'withdraw';
				}),
				accountCard = null;
			var settleUnitID = model.get('settleUnitID') || '',
				hasDefault = model.get('defaultAccount') == 0 ? false : true,
				bankInfo = Hualala.Common.mapBankInfo(model.get('bankCode')),
				bankAccountStr = Hualala.Common.codeMask((model.get('bankAccount') || ''), 0, -4),
				settleBalance = parseFloat(model.get('settleBalance') || 0),
				settleBalanceStr =  CMath.prettyNumeric(CMath.standardPrice(settleBalance)),
				shopCount = parseInt(model.get('shopCount') || 0),
				disableWithdraw = settleBalance <= 0 ? 'disabled' : '';

			accountCard = {
				clz : 'pull-left',
				settleUnitID : settleUnitID,
				hasDefault : hasDefault,
				settleUnitName : model.get('settleUnitName') || '',
				disableWithdraw : disableWithdraw,
				settleBalance : settleBalanceStr,
				bankIcon : $XP(bankInfo, 'icon_16', ''),
				bankComName : $XP(bankInfo, 'name', ''),
				bankAccountStr : $XP(bankAccountStr, 'val', '').replace(/([\w|*]{4})/g, '$1 ').replace(/([*])/g, '<span>$1</span>'),
				shopCount : shopCount,
				path : Hualala.PageRoute.createPath('accountDetail', [settleUnitID]),
				isDetail : true,
				acts : IX.map(acts1, function (el, i) {
					var _act = $XP(el, 'act', '');
					return IX.inherit(el, {
						isFirst : i == 0 ? true : false,
						disabled : (_act == 'delete' && (settleBalance != 0 || shopCount != 0)) ? 'disabled' : ''
					});
				})
			};
			return {
				accountCard : accountCard,
				acts : _.map(acts, function (el) {
					var _act = $XP(el, 'act', '');
					if (_act == 'queryShops') {
						return IX.inherit(el, {
							label : $XP(el, 'label', '') + '(' + shopCount + ')'
						});
					} else if (_act == 'withdraw') {
						return IX.inherit(el, {
							disableWithdraw : disableWithdraw
						});
					} else if (_act == 'delete') {
						return IX.inherit(el, {
							disabled : (settleBalance != 0 || shopCount != 0) ? 'disabled' : ''
						});
					}
					return el;
				})
			};
		},
		render : function () {
			var self = this,
				model = self.model,
				renderData = self.mapRenderData(),
				tpl = self.get('schemaTpl');
			var htm = tpl(renderData);
			self.initBreadCrumbs();
			self.$schema.html(htm);
		},
		refresh : function () {
			this.render();
		}
	});
	
	Hualala.Account.AccountMgrView = AccountMgrView; 


	// 结算账户表单配置
	var AccountEditFormElsCfg = {
		receiverType : {
			type : "radiogrp",
			label : "收款方类型",
			defaultVal : 2,
			options : Hualala.TypeDef.AccountReceiverTypes,
			validCfg : {
				validators : {}
			}
		},
		receiverName : {
			type : "text",
			label : "收款单位/姓名",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入收款单位/姓名"
					},
					stringLength : {
						max : 20,
						message : "收款单位/姓名不能超过20个字"
					}
				}
			}
		},
		settleUnitName : {
			type : "text",
			label : "结算账户名称",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入结算账户名称"
					},
					stringLength : {
						max : 50,
						message : "结算账户名称不能超过50个字"
					}
				}
			}
		},
		bankAccount : {
			type : "text",
			label : "转账账号",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入转账账号"
					},
					stringLength : {
						max : 30,
						message : "转账账号不能超过30个字"
					}
				}
			}
		},
		bankCode : {
			type : "combo",
			label : "转账银行",
			defaultVal : "CMB",
			options : Hualala.TypeDef.BankOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择转账银行"
					}
				}
			}
		},
		bankName : {
			type : "text",
			label : "转账分行",
			defaultVal : "",
			prefix : '<span class="bank-name-icon icon-CMB-16"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入转账分行名称"
					},
					stringLength : {
						max : 40,
						message : "转账分行不能超过40个字"
					}
				}
			}
		},
		remark : {
			type : "text",
			label : "备注",
			defaultVal : "",
			validCfg : {
				validators : {
					stringLength : {
						max : 250,
						message : "备注不能超过250个字"
					}
				}
			}
		},
		defaultAccount : {
			type : "switcher",
			label : "默认账户",
			defaultVal : 1,
			onLabel : "开启",
			offLabel : "关闭",
			helpClz : "help-block col-sm-12 text-center form-help-cutoff",
			help : "<span class='cutoff'></span><span class='cutoff-text text-warning'>如需更改请与哗啦啦客服联系。</span>",
			validCfg : {
				validators : {}
			}
		},
		receiverLinkman : {
			type : "text",
			label : "姓名",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-user"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入姓名"
					},
					stringLength : {
						max : 20,
						message : "姓名不能超过20个字"
					}
				}
			}
		},
		receiverMobile : {
			type : "text",
			label : "手机",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-phone"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入手机号"
					},
					mobile : {message : "请输入正确手机号"}
					// stringLength : {
					// 	max : 30,
					// 	message : "手机不能超过30个字"
					// }
				}
			}
		},
		receiverEmail : {
			type : "text",
			label : "邮箱",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-envelope"></span>',
			validCfg : {
				validators : {
					emailAddress : {message : "请输入正确邮箱账号"}
					// stringLength : {
					// 	max : 50,
					// 	message : "邮箱不能超过30个字"
					// }
				}
			}
		}
	};
	var AccountEditFormElsHT = new IX.IListManager();
	_.each(AccountEditFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'radiogrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz : 'col-sm-5 radio-inline'
				});
			});
			AccountEditFormElsHT.register(k, IX.inherit(el, {
				id : '',
				options : ops,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		} else {
			AccountEditFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
		
	});
	
	// 结算账户编辑窗口
	var AccountEditView = Stapes.subclass({
		/**
		 * 结算账户编辑窗口构造器
		 * @param  {Object} cfg {triggerEl, mode, model, parentView}
		 * 				@param {jQueryObj} triggerEl 出发元素
		 * 				@param {String} mode  操作模式add:添加账户模式；edit:编辑模式; read:只读模式
		 * 				@param {Object} model 结算账户数据模型
		 * 				@param {Object} parentView 父级View层
		 * @return {Object}		账户编辑实例
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'trigger', null);
			this.mode = $XP(cfg, 'mode', 'edit');
			this.model = $XP(cfg, 'model', null) || new Hualala.Account.BaseAccountModel();
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.formKeys = 'settleUnitName,receiverType,receiverName,bankAccount,bankCode,bankName,remark,defaultAccount,receiverLinkman,receiverMobile,receiverEmail'.split(',');
			this.loadTemplates();
			this.initModal();
			this.renderForm();
			this.bindEvent();
			this.resetBankCode();
			this.emit('show');
		}
	});
	AccountEditView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_edit')),
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
		getModalTitle : function () {
			return (this.mode == 'edit' ?  '修改' : '增加') + '财务人员信息';
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_edit',
				clz : 'account-modal',
				title : self.getModalTitle(),
				afterRemove : function () {

				}
			});
		},
		mapFormElsData : function () {
			var self = this,
				mode = self.mode,
				formKeys = self.formKeys;
			var formEls = _.map(formKeys, function (key) {
				var elCfg = AccountEditFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (type == 'combo') {
					var v = self.model.get(key) || $XP(elCfg, 'defaultVal'),
						options = _.map($XP(elCfg, 'options'), function (op) {
							return IX.inherit(op, {
								selected : $XP(op, 'value') == v ? 'selected' : ''
							});
						});
					return IX.inherit(elCfg, {
						disabled : mode == 'edit' ? 'disabled' : '',
						value : v,
						options : options
					});
				} else if (type == 'radiogrp') {
					var v = self.model.get(key) || $XP(elCfg, 'defaultVal'),
						options = _.map($XP(elCfg, 'options'), function (op) {
							return IX.inherit(op, {
								disabled : mode == 'edit' ? 'disabled' : '',
								checked : $XP(op, 'value') == v ? 'checked' : ''
							});
						});
					return IX.inherit(elCfg, {
						value : v,
						options : options
					});
				} else if (type == 'switcher') {
					return IX.inherit(elCfg, {
						disabled : mode == 'edit' ? 'disabled' : '',
						checked : self.model.get(key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
					});
				} else {
					return IX.inherit(elCfg, {
						disabled : mode !== 'edit' ? '' : ((key == 'receiverLinkman' || key == 'receiverMobile' || key == 'receiverEmail') ? '' : 'disabled'),
						value : self.model.get(key) || $XP(elCfg, 'defaultVal')
					});
				}
			});
			return formEls;
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData(),
				mode = self.mode,
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'account-form form-feedback-out',
					items : renderData
				});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'submit', label : mode == 'edit' ? '保存' : '添加'}
				]
			}));

			self.initSwitcher(':checkbox[data-type=switcher]');

		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = AccountEditFormElsHT.get(key),
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
			self.modal._.body.find('form [name=bankCode]').on('change', function (e) {
				var $combo = $(this),
					$bankNameIcon = self.modal._.body.find('form .bank-name-icon'),
					val = $combo.val();
				$bankNameIcon.trigger('change', val);
			});
			self.modal._.body.find('form .bank-name-icon').on('change', function (e, v) {
				var $bankNameIcon = $(this);
				var bankInfo = Hualala.Common.mapBankInfo(v);
				IX.Debug.info("DEBUG: Account Bank Info : ");
				IX.Debug.info(bankInfo);
				$bankNameIcon.removeClass().addClass('bank-name-icon ' + $XP(bankInfo, 'icon_16', ''));
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
				IX.Debug.info("DEBUG: Account Edit View Form Params : ");
				IX.Debug.info(formParams);
				self.model.emit(self.mode, {
					params : formParams,
					failFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
					},
					successFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
						self.parentView && IX.isFn(self.parentView.refresh) && self.parentView.refresh();
						self.emit('hide');
					}
				});
			});
		},
		resetBankCode : function () {
			var self = this;
			var bankCode = self.modal._.body.find('form [name=bankCode]').val();
			self.modal._.body.find('form .bank-name-icon').trigger('change', bankCode);
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
		serializeForm : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = AccountEditFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'switcher') {
						// ret[key] = $('[name=' + key + ']').attr('checked') ? 1 : 0;
						ret[key] = !$('[name=' + key + ']').data('bootstrapSwitch').options.state ? 0 : 1;
					} else if (type == 'radiogrp') {
						ret[key] = $('[name=' + key + ']:checked').val();
					} else {
						ret[key] = $('[name=' + key + ']').val();
					}
				});
			return ret;
		}
	});

	Hualala.Account.AccountEditView = AccountEditView;

	var AccountQueryShopModal = Stapes.subclass({
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$queryBox = null;
			this.$resultBox = null;
			this.queryCtrl = null;
			this.set({
				settleUnitID : this.model.get('settleUnitID'),
				settleName : this.model.get('settleUnitName'),
				shopCount : this.model.get('shopCount'),
			});

			this.loadTemplates();
			this.initModal();
			this.render();
			this.bindEvent();
			this.initQueryBox();
			this.emit('show');
		}
	});
	AccountQueryShopModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_query_shop')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_shop',
				clz : 'account-modal',
				title : "结算账户关联店铺",
				afterRemove : function () {

				}
			});
		},
		render : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl');
			var settleUnitName = self.model.get('settleUnitName') || '',
				btns = [{clz : 'btn-default', name : 'cancel', label : '关闭'}];
			var htm = layoutTpl({
				clz : '',
				title : settleUnitName,
				label : "结算账户名称"
			});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : btns
			}));
			self.$queryBox = self.modal._.body.find('.query-box');
			self.$resultBox = self.modal._.body.find('.result-box');
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				}
			});
			self.modal._.dialog.find('.btn').on('click', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
				}
			});
		},
		initQueryBox : function () {
			var self = this;
			self.queryCtrl = new Hualala.Account.AccountQueryShopController({
				container : self.$queryBox,
				resultContainer : self.$resultBox,
				settleUnitID : self.get('settleUnitID'),
				settleName : self.get('settleName'),
				shopCount : self.get('shopCount')
				// resultController : new Hualala.Account.AccountQueryShopResultController({
				// 	container : self.$resultBox,
				// 	model : new Hualala.Account.AccountQueryShopResultModel(),
				// 	view : new Hualala.Account.AccountQueryShopResultView()
				// })
			});
		}
	});
	Hualala.Account.AccountQueryShopModal = AccountQueryShopModal;

	// 结算账户交易明细
	var PersonUnit = Hualala.Constants.PersonUnit,
		CashUnit = Hualala.Constants.CashUnit;
	var getOrderSubTypeLabel = function (orderSubType) {
		if (IX.isEmpty(orderSubType)) return '';
		var l = Hualala.TypeDef.ShopBusiness;
		var m = _.find(l, function (el) {
			var id = $XP(el, 'id');
			return id == orderSubType;
		});
		if (!m) return '';
		return $XP(m, 'label', '');
	};
	var getGenderLabel = function (v) {
		if (IX.isEmpty(v)) return '';
		var l = Hualala.TypeDef.GENDER;
		var m = _.find(l, function (el) {
			var id = $XP(el, 'value');
			return id == v;
		});
		if (!m) return '';
		return $XP(m, 'label', '');
	};
	var mapUserFields = function (cfg, data) {
		var label = $XP(cfg, 'label', ''), fieldType = $XP(cfg, 'fieldType', ''), fields = $XP(cfg, 'fields', []);
		var userSex = $XP(data, 'userSex', '');
		userSex = IX.isEmpty(userSex) ? '' : '(' + getGenderLabel(userSex) + ')';
		var _fields = _.map(fields, function (key) {
			var fieldLabelCfg = OrderPayFieldLabelLib[key], label = $XP(fieldLabelCfg, 'label', ''),
				unit = $XP(fieldLabelCfg, 'unit', ''), clz = $XP(fieldLabelCfg, 'clz', '');
			var value = $XP(data, key, '');
			value += (key == 'userName') ? userSex : '';
			value += unit;
			return {
				key : key,
				clz : clz,
				label : label,
				value : value
			};
		});
		return {
			label : label,
			fieldType : fieldType,
			fields : _fields
		};
	};
	var mapOrderFields = function (cfg, data) {
		var label = $XP(cfg, 'label', ''), fieldType = $XP(cfg, 'fieldType', ''), fields = $XP(cfg, 'fields', []);
		var orderSubType = $XP(data, 'orderSubType', ''),
			orderSubTypeLabel = getOrderSubTypeLabel(orderSubType);
		orderSubTypeLabel = IX.isEmpty(orderSubTypeLabel) ? '' : '(' + orderSubTypeLabel + ')';
		var _fields = _.map(fields, function (key) {
			var fieldLabelCfg = OrderPayFieldLabelLib[key], label = $XP(fieldLabelCfg, 'label', ''),
				unit = $XP(fieldLabelCfg, 'unit', ''), clz = $XP(fieldLabelCfg, 'clz', '');
			var value = $XP(data, key, '');
			switch(key) {
				case 'timeName':
				case 'consumptionTypeName' :
				case 'promotionDesc' :
				case 'orderRemark':
					clz += IX.isEmpty(value) ? ' hidden' : '';
					break;
				case 'orderTime':
				case 'orderCreateTime':
					value = IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(value), 'yyyy/MM/dd HH:mm');
					break;
				case 'statusName':
					var isAlreadyPaid = $XP(data, 'isAlreadyPaid', 0),
						orderStatus = $XP(data, 'orderStatus', '');
					var surfix = '';
					if (orderStatus >= 20 && isAlreadyPaid == 1) {
						surfix = "<span>线上付款</span>";
					} else if (orderStatus >= 20 && isAlreadyPaid == 0) {
						surfix = '<span color="red">' + (orderStatus == 20 ? "餐到付款" : "到店付款") + "</span>";
					} else {
						surfix = "<span>未付款</span>";
					}
					surfix = '(' + surfix + ')';
					value = value + surfix;
					break;
				case 'takeoutAddress' :
					clz += orderSubType == 20 || orderSubType == 21 ? '' : ' hidden';
					break;
			}
			value += unit;
			return {
				key : key,
				clz : clz,
				label : label,
				value : value
			};
		});
		return {
			label : label,
			orderSubTypeLabel : orderSubTypeLabel,
			fieldType : fieldType,
			fields : _fields
		};
	};
	var mapPayFields = function (cfg, data) {
		var label = $XP(cfg, 'label', ''), fieldType = $XP(cfg, 'fieldType', ''), fields = $XP(cfg, 'fields', []);
		var orderSubType = $XP(data, 'orderSubType', '');
		var _fields = _.map(fields, function (key) {
			var fieldLabelCfg = OrderPayFieldLabelLib[key], label = $XP(fieldLabelCfg, 'label', ''),
				unit = $XP(fieldLabelCfg, 'unit', ''), clz = $XP(fieldLabelCfg, 'clz', '');
			var value = $XP(data, key, '');
			switch(key) {
				case 'serviceAmount':
				case 'discountAmount':
				case 'freeAmount':
				case 'giftAmount':
				case 'cardDiscountAmount':
				case 'pointBalance':
				case 'moneyBalance':
				case 'orderRefundAmount':
					clz += value == 0 ? ' hidden' : '';
					break;
				case 'presentInfo':
					clz += IX.isEmpty(value) ? ' hidden' : '';
					break;
				case 'takeoutPackagingAmount':
					clz += orderSubType == 20 || orderSubType == 21 ? '' : ' hidden';
					break;

			}
			value += unit;
			return {
				key : key,
				clz : clz,
				label : label,
				value : value
			};
		});
		return {
			label : label,
			fieldType : fieldType,
			fields : _fields
		};
	};
	var mapFoodsFields = function (cfg, data) {
		var label = $XP(cfg, 'label', ''), fieldType = $XP(cfg, 'fieldType', ''), fields = $XP(cfg, 'fields', []);
		var dishes = $XP(data, 'records', []),
			categories = _.groupBy(dishes, function (dish) {return $XP(dish, 'foodCategoryID');});
		categories = _.map(categories, function (cate, key) {
			var foodCategoryName = '';
			var foodCategorySum = cate.length;
			var _dishes = _.map(cate, function (dish) {
				var _dish = {};
				_.each(fields, function (k) {
					var v = $XP(dish, k, ''),
						unit = !IX.isEmpty(OrderPayFieldLabelLib[k]) && !IX.isEmpty(OrderPayFieldLabelLib[k]['unit']) && k != "foodAmount" ?
							OrderPayFieldLabelLib[k]['unit'] : '';
					if (k == "foodAmount") {
						v = CMath.prettyPrice(v);
					}
					if (k == 'foodCategoryName') {
						foodCategoryName = v;
					}
					
					_dish[k] = v + unit;
				});
				return _dish;
			});
			return {
				foodCategoryName : foodCategoryName,
				foodCategorySum : '(' + foodCategorySum + ')',
				foodCategoryID : key,
				rows : _dishes
			}
		});
		
		return {
			fieldType : fieldType,
			label : label,
			categories : categories
		};
	};
	var OrderPayFieldLabelLib = {
		"userName" : {label : "姓名", clz : "col-xs-6"},
		"userLoginMobile" : {label : "手机", clz : "col-xs-6"},
		"orderID" : {label : "订单号", clz : "col-xs-6"},
		"orderCheckPWD" : {label : "消费密码", clz : "col-xs-6"},
		"person" : {label : "人数", unit : PersonUnit, clz : "col-xs-6"},
		"timeName" : {label : "餐段名称", clz : "col-xs-6"},
		"tableName" : {label : "桌台号", clz : "col-xs-6"},
		"shopOrderKey" : {label : "餐饮软件凭证号", clz : "col-xs-6"},
		"orderTime" : {label : "用餐时间", clz : "col-xs-12"},
		"orderCreateTime" : {label : "下单时间", clz : "col-xs-12"},
		"statusName" : {label : "订餐状态", clz : "col-xs-12"},
		"takeoutAddress" : {label : "外送地址", clz : "col-xs-6"},
		"consumptionTypeName" : {label : "用餐类型", clz : "col-xs-12"},
		"promotionDesc" : {label : "店家促销描述", clz : "col-xs-12"},
		"orderRemark" : {label : "订单备注", clz : "col-xs-12"},
		"foodAmount" : {label : "菜品金额", unit : CashUnit, clz : "col-xs-6"},
		"serviceAmount" : {label : "服务费", unit : CashUnit, clz : "col-xs-6"},
		"paidAmount" : {label : "买单前已付金额", unit : CashUnit, clz : "col-xs-6"},
		"promotionTotalAmount" : {label : "餐饮软件优惠金额", unit : CashUnit, clz : "col-xs-6"},
		"discountAmount" : {label : "商家折免", unit : CashUnit, clz : "col-xs-6"},
		"freeAmount" : {label : "商家减免", unit : CashUnit, clz : "col-xs-6"},
		"giftAmount" : {label : "商家代金券金额", unit : CashUnit, clz : "col-xs-6"},
		"presentInfo" : {label : "赠送", clz : "col-xs-6"},
		"cardDiscountAmount" : {label : "会员卡优惠", unit : CashUnit, clz : "col-xs-6"},
		"pointBalance" : {label : "积分抵扣", unit : CashUnit, clz : "col-xs-6"},
		"moneyBalance" : {label : "会员卡余额支付", unit : CashUnit, clz : "col-xs-6"},
		"takeoutPackagingAmount" : {label : "打包费", unit : CashUnit, clz : "col-xs-6"},
		"orderTotal" : {label : "订单金额", unit : CashUnit, clz : "col-xs-6"},
		"orderRefundAmount" : {label : "退款金额", unit : CashUnit, clz : "col-xs-6"},
		"shopName" : {label : "店铺名称", clz : "col-xs-6"},
		"shopTel" : {label : "电话", clz : "col-xs-6"},
		"foodPrice" : {label : "菜品价格", unit : CashUnit}
	};
	var OrderPayDetailElsCfg = {
		userFields : {
			label : "个人信息",
			fieldType : "list",
			fields : ["userName","userLoginMobile"],
			mapFn : mapUserFields
		},
		orderFields : {
			label : "订单信息",
			fieldType : "list",
			fields : ["orderID","orderCheckPWD","person","timeName","tableName","shopOrderKey","orderTime","orderCreateTime",
			"statusName","takeoutAddress","consumptionTypeName","promotionDesc","orderRemark"],
			mapFn : mapOrderFields
		},
		payFields : {
			label : "支付详情",
			fieldType : "list",
			fields : ["foodAmount","serviceAmount","paidAmount","promotionTotalAmount","discountAmount",
			"freeAmount","giftAmount","presentInfo","cardDiscountAmount","pointBalance","moneyBalance","takeoutPackagingAmount",
			"orderTotal","orderRefundAmount","shopName","shopTel"],
			mapFn : mapPayFields
		},
		foodsFields : {
			label : "菜品信息",
			fieldType : "table",
			fields : ["foodCategoryName","foodCategoryID","foodName","foodUnit","foodPrice","foodAmount"],
			mapFn : mapFoodsFields
		}

	};
	
	var AccountTransDetailModal = Stapes.subclass({
		/**
		 * 构造
		 * @param  {Object} cfg {triggerEl, orderKey, orderID, transType, transID}
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl');
			this.orderKey = $XP(cfg, 'orderKey', '');
			this.orderID = $XP(cfg, 'orderID', '');
			this.transType = $XP(cfg, 'transType', '');
			this.transID = $XP(cfg, 'transID', '');
			this.transTypes = Hualala.TypeDef.FSMTransType;
			this.transTypeHT = new IX.IListManager();
			this.initTransTypeLib();
			this.modal = null;
			this.tplName = $XP(this.transTypeHT.get(this.transType), 'tpl', null);
			this.callServerName = $XP(this.transTypeHT.get(this.transType), 'queryCall', null);
			this.callServer = null;
			if (IX.isFn(this.callServerName)) {
				this.callServer = this.callServerName;
			} else if (!IX.isString(this.callServerName)) {
				throw("Configuration failed : Invalid Page Initialized for " + this.callServerName);
				return false;
			} else if (IX.nsExisted(this.callServerName)) {
				this.callServer = IX.getNS(this.callServerName);
			}
			this.queryKeys = $XP(this.transTypeHT.get(this.transType), 'queryKeys', null);
			if (!this.tplName || !this.callServer) return null;
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load', this.mapQueryParams());
		}
	});
	AccountTransDetailModal.proto({
		initTransTypeLib : function () {
			var self = this;
			_.each(this.transTypes, function (el) {
				var type = $XP(el, 'value', '').toString();
				if (type.length > 0) {
					self.transTypeHT.register(type, el);
				}
			});
		},
		loadTemplates : function () {
			var self = this;
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get(self.tplName)),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerHelper('chkFieldType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_trans_detail',
				clz : 'account-modal',
				sizeCls : 'modal-lg',
				title : "结算账户交易详情",
				afterRemove : function () {

				}
			});
		},
		bindEvent : function () {
			var self = this;
			self.on({
				"load" : function (params) {
					self.callServer(params, function (res) {
						if (res.resultcode == '000') {
							self.render($XP(res, 'data', null));
						} else {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						}
					});
				},
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				}
			}, this);
			self.modal._.dialog.on('click', '.btn', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
				}
			});
		},
		mapOrderPayDetail : function (data) {
			var self = this;
			var fieldsets = "userFields,orderFields,payFields,foodsFields".split(',');
			fieldsets = _.map(fieldsets, function (key, i) {
				var fieldCfg = OrderPayDetailElsCfg[key];
				var mapFn = $XF(fieldCfg, 'mapFn');
				var cfg = _.pick(fieldCfg, 'label', 'fieldType', 'fields');
				// return mapFn(cfg, $XP(data, 'data', {}));
				return mapFn(cfg, data);
			});
			IX.Debug.info("DEBUG: Account TransDetail Modal Order Pay Detail Fieldsets : ");
			IX.Debug.info(fieldsets);
			var orderSubType = $XP(data, 'data.orderSubType', ''),
				orderSubTypeLabel = getOrderSubTypeLabel(orderSubType);
			orderSubTypeLabel = IX.isEmpty(orderSubTypeLabel) ? '' : '(' + orderSubTypeLabel + ')';
			var printDetail = {
				label : "订单打印内容",
				orderSubTypeLabel : orderSubTypeLabel,
				content : $XP(data, 'orderPrnStr', '').replace(/\n/g, '<br/>')
			};

			return {
				fieldsets : fieldsets,
				printDetail : printDetail
			};
		},
		mapFsmCustomerDetail : function (data) {
			var self = this;
			var settleUnitDetail = $XP(data, 'settleUnitDetail', [])[0],
				customerCard = $XP(data, 'customerCard', [])[0];
			var transType = $XP(settleUnitDetail, 'transType'),
				transTypeLabel = $XP(self.transTypeHT.get(transType), 'label', '');
			settleUnitDetail = IX.each(settleUnitDetail, {}, function (acc, el, k) {
				var cashKeys = 'transAfterBalance,transAmount,transSalesCommission';
				if (cashKeys.indexOf(k) >= 0) {
					acc[k] = CMath.prettyNumeric(CMath.prettyPrice(el));
				} else if (k == 'transType') {
					acc = IX.inherit(acc, {
						transType : el,
						transTypeLabel : $XP(self.transTypeHT.get(el), 'label', '')
					});
				} else {
					acc[k] = el;
				}
				return acc;
			});
			customerCard = IX.each(customerCard, {}, function (acc, el, k) {
				var cashKeys = 'saveCashTotal,saveMoneyTotal,moneyBalance';
				if (cashKeys.indexOf(k) >= 0) {
					acc[k] = CMath.prettyNumeric(CMath.prettyPrice(el));
				} else {
					acc[k] = el;
				}
				return acc;
			});
			return {
				settleUnitDetail : IX.inherit(settleUnitDetail, {
					transTypeLabel : transTypeLabel
				}),
				customerCard : customerCard
			};
		},
		mapRenderData : function (data) {
			var self = this;
			var type = _.last(self.callServerName.split('.'));
			var ret = null;
			switch(type) {
				case "queryAccountOrderPayDetail":
					ret = self.mapOrderPayDetail(data);
					break;
				case "queryAccountFsmCustomerDetail":
					ret = self.mapFsmCustomerDetail(data);
					break;
				default : 
					break;
			}
			return ret;
		},
		render : function (data) {
			var self = this;
			var renderData = self.mapRenderData(data),
				layoutTpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl');
			var htm = layoutTpl(renderData);
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '关闭'}
				]
			}));
			self.emit('show');
		},
		mapQueryParams : function () {
			var self = this;
			var params = {};
			_.each(self.queryKeys.split(','), function (k) {
				var _k = k == 'SUA_TransItemID' ? 'transID' : k;
				params[k] = self[_k]; 
			});
			IX.Debug.info('DEBUG: Account TransDetail Modal Query Params:');
			IX.Debug.info(params);
			return params;
		}
	});
	Hualala.Account.AccountTransDetailModal = AccountTransDetailModal;

	
})(jQuery, window);