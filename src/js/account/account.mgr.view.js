(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var AccountActs = [
		{clz : 'btn-success withdraw', act : 'withdraw', label : '提现'},
		{clz : 'btn-link', act : 'edit', label : '修改银行卡'},
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
				self.withdraw($(this));
			});
			self.$schema.on('click', '[data-act]', function (e) {
				var act = $(this).attr('data-act');
				var $btn = $(this);
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
						settleBalance = Hualala.Common.Math.prettyNumeric(mAccount.get('settleBalance'));
					self.$container.find('[data-id=' + settleUnitID + '] .cash > strong').html(settleBalance);
				}
			});
		},
		editAccount : function ($trigger) {
			console.info('editAccount');
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
			// console.info('withdraw');
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
			console.info('queryShops');
		},
		deleteAccount : function () {
			// console.info('deleteAccount');
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
				bankAccountStr = Hualala.Common.codeMask((model.get('bankAccount') || ''), 0, -4);

			accountCard = {
				clz : 'pull-left',
				settleUnitID : settleUnitID,
				hasDefault : hasDefault,
				settleUnitName : model.get('settleUnitName') || '',
				settleBalance : parseFloat(model.get('settleBalance') || 0),
				bankIcon : $XP(bankInfo, 'icon_16', ''),
				bankComName : $XP(bankInfo, 'name', ''),
				bankAccountStr : $XP(bankAccountStr, 'val', '').replace(/([\w|*]{4})/g, '$1 ').replace(/([*])/g, '<span>$1</span>'),
				shopCount : parseInt(model.get('shopCount') || 0),
				path : Hualala.PageRoute.createPath('accountDetail', [settleUnitID]),
				isDetail : true,
				acts : IX.map(acts1, function (el, i) {
					return IX.inherit(el, {
						isFirst : i == 0 ? true : false
					});
				})
			};
			return {
				accountCard : accountCard,
				acts : _.map(acts, function (el) {
					if ($XP(el, 'act') == 'queryShops') {
						return IX.inherit(el, {
							label : $XP(el, 'label', '') + '(' + parseInt(model.get('shopCount') || 0) + ')'
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
						message : "收款单位/姓名不能为空"
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
			label : "结算主体名称",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "结算主体名称不能为空"
					},
					stringLength : {
						max : 50,
						message : "结算主体名称不能超过50个字"
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
						message : "转账账号不能为空"
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
						message : "转账银行不能为空"
					}
				}
			}
		},
		bankName : {
			type : "text",
			label : "转账分行",
			defaultVal : "",
			prefix : '<span class="icon-CMB-16"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "转账分行不能为空"
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
			label : "设为默认账户",
			defaultVal : 1,
			onLabel : "开启",
			offLabel : "关闭",
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
						message : "姓名不能为空"
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
						message : "手机不能为空"
					},
					stringLength : {
						max : 30,
						message : "手机不能超过30个字符"
					}
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
					stringLength : {
						max : 50,
						message : "邮箱不能超过30个字符"
					}
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
					clz : 'col-sm-6'
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
			this.formKeys = 'receiverType,receiverName,settleUnitName,bankAccount,bankCode,bankName,remark,defaultAccount,receiverLinkman,receiverMobile,receiverEmail'.split(',');
			this.loadTemplates();
			this.initModal();
			this.renderForm();
			this.bindEvent();
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
			return (this.mode == 'edit' ?  '修改' : '增加') + '结算账户';
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
						value : v,
						options : options
					});
				} else if (type == 'radiogrp') {
					var v = self.model.get(key) || $XP(elCfg, 'defaultVal'),
						options = _.map($XP(elCfg, 'options'), function (op) {
							return IX.inherit(op, {
								checked : $XP(op, 'value') == v ? 'checked' : ''
							});
						});
					return IX.inherit(elCfg, {
						value : v,
						options : options
					});
				} else if (type == 'switcher') {
					return IX.inherit(elCfg, {
						checked : self.model.get(key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
					});
				} else {
					return IX.inherit(elCfg, {
						value : self.model.get(key) || $XP(elCfg, 'defaultVal')
					});
				}
			});
			return formEls;
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'account-form',
					items : renderData
				});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'submit', label : self.mode == 'edit' ? '保存' : '添加'}
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
				// resultController : new Hualala.Account.AccountQueryShopResultController({
				// 	container : self.$resultBox,
				// 	model : new Hualala.Account.AccountQueryShopResultModel(),
				// 	view : new Hualala.Account.AccountQueryShopResultView()
				// })
			});
		}
	});
	Hualala.Account.AccountQueryShopModal = AccountQueryShopModal;

	
})(jQuery, window);