(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BaseUserFormElsCfg = {
		loginName : {
			type : "text",
			label : "账号名称",
			mode : "readonly",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-user"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入账号名称"
					},
					stringLength : {
						min : 6,
						max : 50,
						message : "账号名称长度在6-50个字符之间"
					}
				}
			}
		},
		// loginName : {
		// 	type : "static",
		// 	label : "账号名称",
		// 	defaultVal : "",
		// 	validCfg : {}
		// },
		accountID : {
			type : "hidden",
			defaultVal : ""
		},
		loginPWD : {
			type : "password",
			label : "登录密码",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-lock"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请设置密码"
					},
					stringLength : {
						min : 6,
						max : 16,
						message : "请设置密码长度在6-16位之间"
					}
				}
			}
		},
		plainPWD : {
			type : "checkbox",
			label : "显示明文",
			defaultVal : 1,
			onLabel : "开启",
			offLabel : "关闭",
			validCfg : {}

		},
		userName : {
			type : "text",
			label : "用户姓名",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-user"></span>',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入用户名称"
					},
					stringLength : {
						max : 30,
						message : "用户姓名最多可以输入30个字符"
					}
				}
			}
		},
		userRemark : {
			type : "text",
			label : "用户备注",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-bookmark"></span>',
			validCfg : {
				validators : {
					stringLength : {
						max : 30,
						message : "用户备注最多可以输入30个字符"
					}
				}
			}
		},
		userEmail : {
			type : "text",
			label : "邮箱地址",
			defaultVal : "",
			prefix : '<span class="glyphicon glyphicon-envelope"></span>',
			validCfg : {
				validators : {
					emailAddress : {
						message : "请输入正确的电子邮箱地址"
					}
				}
			}
		},
		accountStatus : {
			type : "switcher",
			label : "账号状态",
			defaultVal : 1,
			onLabel : "正常",
			offLabel : "停用",
			validCfg : {
				validators : {}
			}
		},
		roleBinding : {
			type : "roleBindGrp",
			label : "请选择角色权限",
			defaultVal : '',
			validCfg : {

			}
		}
	};

	var BaseUserFormElsHT = new IX.IListManager();
	_.each(BaseUserFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == "checkbox") {
			BaseUserFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz + ' invisible',
				clz : 'col-sm-5 checkbox'
			}));
		} else if (type == "roleBindGrp") {
			BaseUserFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-offset-3 col-sm-8'
			}));
		} else {
			BaseUserFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
		
	});

	var ResetPWDFormKeys = 'loginName,loginPWD,plainPWD,accountID'.split(','),
		BaseUserFormKeys = 'loginName,accountID,userName,userRemark,userEmail,accountStatus'.split(','),
		RoleBindingFormKeys = 'loginName,accountID,roleBinding'.split(',');

	var ResetPWDView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', 'add');
			this.$container = $XP(cfg, 'container', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.model = $XP(cfg, 'model', null);
			this.evtType = $XP(cfg, 'evtType');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');
			if (!this.model || !this.parentView) {
				throw("ResetPWDView init faild!");
				return;
			}
			
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.loadTemplates();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});

	ResetPWDView.proto({
		getViewMode : function () {return this.mode;},
		initBaseCfg : function () {
			this.formKeys = ResetPWDFormKeys;
			if (this.mode == 'edit') {
				this.modal = this.parentView.resetPWDModal;
				this.$body = this.modal._.body;
				this.$footer = this.modal._.footer;
			} else {
				this.$body = this.$container;
				this.modal = null;
				this.$footer = null;
			}
		},
		closeModal : function () {
			this.modal && this.modal.hide();
		},
		initUIComponents : function () {},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_user_form')),
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
		mapFormElsData : function () {
			var self = this,
				formKeys = self.formKeys;
			var ret = _.map(formKeys, function (key) {
				var elCfg = BaseUserFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (type == 'checkbox') {
					return IX.inherit(elCfg, {
						checked : $XP(self.formParams, key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
					});
				} else if (type == 'switcher') {
					return IX.inherit(elCfg, {
						checked : $XP(self.formParams, key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
					});
				} else {
					return IX.inherit(elCfg, {
						value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal', ''))
					}, (type == 'text' && self.mode == 'wizard_add' && key == 'loginName') ? {
						mode : ''
					} : {});
				}
			});
			IX.Debug.info("DEBUG: User ResetPWD Form Elements :");
			IX.Debug.info(ret);
			return ret;
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'user-form form-feedback-out',
					items : renderData
				});
			self.$body.html(htm);
			if (self.mode == 'edit') {
				self.$footer.html(btnTpl({
					btns : [
						{clz : 'btn-default', name : 'cancel', label : '取消'},
						{clz : 'btn-warning', name : 'submit', label : '保存', loadingText : "提交中..."}
					]
				}));
			}
			
		},
		bindEvent : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts();
			self.$body.delegate('form :checkbox', 'change', function(evt) {
				self.$body.find('.form-control[name=loginPWD]').attr('type', this.checked ? 'text' : 'password');
			});
			self.$footer && self.$footer.delegate('.btn', 'click', function (evt) {
				var $btn = $(this), act = $btn.attr('name');
				if (act == 'cancel') {
					self.closeModal();
				} else {
					var bv = self.$body.find('form').data('bootstrapValidator');
					// $btn.button('提交中...');
					$btn.button('loading');
					bv.validate();
					
				}
			});
			self.$body.find('form').bootstrapValidator({
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
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: User ResetPWD Form Params:");
				IX.Debug.info(formParams);
				self.model.emit(self.evtType, {
					params : formParams,
					failFn : function () {
						self.$footer && self.$footer.find('.btn[name=submit]').button('reset');
						self.failFn(self.model);
					},
					successFn : function () {
						self.successFn(self.model);
						self.$footer && self.$footer.find('.btn[name=submit]').button('reset');
						self.closeModal();
					}
				});
			});
			
		},
		serializeForm : function () {
			var self = this,
				formKeys = _.filter(self.formKeys, function (k) {
					// return k != 'loginName' && k != 'plainPWD';
					return k != 'plainPWD';
				}),
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = BaseUserFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'switcher') {
						ret[key] = !$('[name=' + key + ']').data('bootstrapSwitch').options.state ? 0 : 1;
					} else {
						ret[key] = $('[name=' + key + ']').val();
					}
				});
			return ret;
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.filter(self.formKeys, function (k) {
					return k != 'plainPWD' && k != 'accountID';
				}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = BaseUserFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				ret[key] = $XP(elCfg, 'validCfg', {});
			});
			return ret;
		}
	});

	Hualala.User.ResetPWDView = ResetPWDView;

	var UserBaseInfoView = ResetPWDView.subclass({
		constructor : ResetPWDView.prototype.constructor
	});
	UserBaseInfoView.proto({
		initBaseCfg : function () {
			this.formKeys = BaseUserFormKeys;
			if (this.mode == 'edit') {
				this.modal = this.parentView.userBaseInfoModal;
				this.$body = this.modal._.body;
				this.$footer = this.modal._.footer;
			} else {
				this.$body = this.$container;
				this.modal = null;
				this.$footer = null;
			}
		},
		initSwitcher : function (selector) {
			var self = this;
			self.$body.find(selector).each(function () {
				var $el = $(this), onLabel = $el.attr('data-onLabel'), offLabel = $el.attr('data-offLabel');
				$el.bootstrapSwitch({
					size : 'normal',
					onColor : 'primary',
					offColor : 'default',
					onText : onLabel,
					offText : offLabel
				})
			});
		},
		initUIComponents : function () {
			var self = this;
			self.initSwitcher(':checkbox[data-type=switcher]');
		}
	});
	Hualala.User.UserBaseInfoView = UserBaseInfoView;

	var UserRoleView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', 'add');
			this.$container = $XP(cfg, 'container', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.model = $XP(cfg, 'model', null);
			this.evtType = $XP(cfg, 'evtType');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');
			if (!this.model || !this.parentView) {
				throw("UserRoleView init faild!");
				return;
			}
			this.loadTemplates();
			this.formParams = this.model.getAll();
			this.initBaseCfg();
			
			
		}
	});

	UserRoleView.proto({
		getViewMode : function () {return this.mode;},
		closeModal : function () {
			this.modal && this.modal.hide();
		},
		initBaseCfg : function () {
			var self = this;
			self.formKeys = RoleBindingFormKeys;
			if (this.mode == 'edit') {
				this.modal = this.parentView.userRoleModal;
				this.$body = this.modal._.body;
				this.$footer = this.modal._.footer;
			} else {
				this.modal = null;
				this.$body = this.$container;
				this.$footer = null;
			}
			
			self.model.emit('queryRoleBinding', {
				successFn : function () {
					self.renderForm();
					self.initUIComponents();
					self.bindEvent();
				},
				failFn : function () {
					self.closeModal();
				}
			});
		},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_user_form')),
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
		mapRoleBindingElsData : function () {
			var self = this,
				roles = self.model.get('roles');
			var items = _.map(roles, function (role) {
				var binded = $XP(role, 'binded', false),
					id = $XP(role, 'id', ''),
					name = $XP(role, 'name', ''),
					type = $XP(role, 'roleType', ''),
					roleDesc = $XP(role, 'desc', '');
				return IX.inherit(role, {
					type : type,
					roleDesc : roleDesc,
					btnLabel : type == 'finance' ? '绑定账号' : '绑定店铺',
					hideBtn : type == 'general' || type == 'admin' ? 'hidden' : '',
					disabledBtn : binded ? '' : 'disabled',
					checked : binded ? 'checked' : ''
				});

			});
			return {items : items};
		},
		mapFormElsData : function () {
			var self = this,
				formKeys = self.formKeys;
			var ret = _.map(formKeys, function (key) {
				var elCfg = BaseUserFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (type == 'roleBindGrp') {
					return IX.inherit(elCfg, self.mapRoleBindingElsData());
				} else {
					return IX.inherit(elCfg, {
						value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal', ''))
					});
				}
			});
			IX.Debug.info("DEBUG: User ResetPWD Form Elements :");
			IX.Debug.info(ret);
			return ret;
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'role-form form-feedback-out',
					items : renderData
				});
			self.$body.html(htm);
			if (self.mode == 'edit') {
				self.$footer.html(btnTpl({
					btns : [
						{clz : 'btn-default', name : 'cancel', label : '取消'},
						{clz : 'btn-warning', name : 'submit', label : '保存', loadingText : "提交中..."}
					]
				}));
			}
			
		},
		initUIComponents : function () {

		},
		bindEvent : function () {
			var self = this;
			self.$body.delegate('input:checkbox', 'change', function (e) {
				var checked = !this.checked ? false : true,
					$chk = $(this), roleType = $chk.attr('name');
				var $btn = $chk.parents('.checkbox').find('.btn[data-role=' + roleType + ']');
				$btn[!checked ? 'addClass' : 'removeClass']('disabled');
				if (checked) {
					self.model.updateRoleBind(roleType, checked);
					$btn.trigger('click');
				} else {
					self.model.updateRoleBind(roleType, checked);
				}
			});
			self.$body.delegate('.btn[data-role]', 'click', function (e) {
				var $btn = $(this), roleType = $btn.attr('data-role');
				switch(roleType) {
					case "manager":
						self.bindModal = new Hualala.User.BindShopModal({
							trigger : $btn,
							model : self.model,
							parentView : self,
							roleType : roleType,
							mutiSelect : false
						});
						break;
					case "finance":
						self.bindModal = new Hualala.User.BindSettleAccountModal({
							model : self.model,
							parentView : self,
							roleType : roleType,
							mutiSelect : true
						});
						break;
					case "area-manager":
						self.bindModal = new Hualala.User.BindShopMultiModal({
							model : self.model,
							roleType : roleType,
							parentView : self
						});
						break;
				}
			});
			if (self.mode == 'edit') {
				self.$footer.delegate('.btn', 'click', function (e) {
					var $btn = $(this), act = $btn.attr('name');
					if (act == 'cancel') {
						self.closeModal();
					} else {
						$btn.button('loading');
						self.model.emit('editRole', {
							successFn : function () {
								self.$footer.find('.btn[name=submit]').button('reset');
								self.closeModal();
								self.successFn(self.model);
							},
							failFn : function () {
								self.$footer.find('.btn[name=submit]').button('reset');
								self.closeModal();
								self.failFn(self.model);
							}
						});
					}
				});
			}
			
		}
	});

	Hualala.User.UserRoleView = UserRoleView;
})(jQuery, window);
(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var WizardCfg = [
		{id : "user_base_info", label : "基本信息"},
		{id : "user_login_pwd", label : "登录密码"},
		{id : "user_role_binding", label : "角色绑定"}
	];
	var WizardCtrls = [
		{clz : 'btn-default btn-prev', name : 'prev', label : '上一步', loadingText : '请稍候...'},
		{clz : 'btn-default btn-cancel', name : 'cancel', label : '取消', loadingText : '取消'},
		{clz : 'btn-warning btn-next', name : 'next', label : '下一步', loadingText : '请稍候...'},
		{clz : 'btn-success btn-finish ', name : 'finish', label : '完成', loadingText : '提交中...'}
	];

	var CreateUserModal = Stapes.subclass({
		constructor : function (cfg) {
			this.parentView = $XP(cfg, 'parentView');
			this.evtType = $XP(cfg, 'evtType', 'create');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');
			this.modal = null;
			this.$body = null;
			this.$wizard = null;
			this.wizardID = "create_user_wizard";
			this.model = new Hualala.User.BaseUserModel();
			this.stepViewHT = new IX.IListManager();
			this.loadTemplates();
			this.initModal();
			this.renderWizardLayout();
			this.initWizard();
			// 是否允许进入下一步
			this.enableGoToNextStep = false;
			this.bindEvent();
		}
	});
	CreateUserModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_wizard_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("stepAction", Hualala.TplLib.get('tpl_shop_modal_btns'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "create_user_modal",
				clz : 'account-modal',
				title : "添加用户账号",
				backdrop : 'static',
				showFooter : false,
				afterHide : function () {
					
				}
			});
			self.$body = self.modal._.body;
			self.modal.show();
		},
		mapWizardLayoutData : function () {
			var self = this,
				stepNavs = [],
				steps = [];
			stepNavs = _.map(WizardCfg, function (step, i) {
				steps.push({
					id : $XP(step, 'id')
				});
				return IX.inherit(step, {
					idx : (i + 1)
				});
			});
			return {
				id : self.wizardID,
				clz : 'wizard-create-user',
				stepNavs : stepNavs,
				steps : steps,
				btns : WizardCtrls
			};
		},
		renderWizardLayout : function () {
			var self = this;
			var renderData = self.mapWizardLayoutData(),
				layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl(renderData);
			
			self.$body.html(htm);

			self.modal.show();
		},
		getTabContentIDByIndex : function ($navBar, idx) {
			var $tab = $('li:eq(' + idx + ')', $navBar),
				id = $tab.find('a[data-toggle]').attr('href').replace('#', '');
			return id;
		},
		// 账号基本信息View层
		initUserBaseInfoView : function ($container, cntID, viewMode) {
			var self = this,
				stepView = new Hualala.User.UserBaseInfoView({
					mode : viewMode,
					container : $container,
					parentView : self,
					model : self.model,
					evtType : viewMode == 'wizard_add' ? 'addUser' : 'editUser',
					successFn : function (mUser) {
						self.switchWizardCtrlStatus('reset');
						self.getNextStep();
					},
					failFn : function (mUser) {
						self.switchWizardCtrlStatus('reset');
					}
				});
			self.stepViewHT.register(cntID, stepView);
		},
		// 充值密码View层
		initResetPWDView : function ($container, cntID, viewMode) {
			var self = this,
				stepView = new Hualala.User.ResetPWDView({
					mode : viewMode,
					container : $container,
					parentView : self,
					model : self.model,
					evtType : 'resetPWD',
					successFn : function (mUser) {
						self.switchWizardCtrlStatus('reset');
						self.getNextStep();
					},
					failFn : function (mUser) {
						self.switchWizardCtrlStatus('reset');
					}
				});
			self.stepViewHT.register(cntID, stepView);
		},
		// 绑定角色View层
		initUserRoleView : function ($container, cntID, viewMode) {
			var self = this,
				stepView = new Hualala.User.UserRoleView({
					mode : viewMode,
					container : $container,
					parentView : self,
					model : self.model,
					evtType : 'editRole',
					successFn : function (mUser) {
						
					},
					failFn : function (mUser) {

					}
				});
			self.stepViewHT.register(cntID, stepView);
		},
		// 账号信息提交(基本信息，账号登录密码)
		commitUserInfo : function (stepView) {
			var self = this,
				$cnt = stepView.$body,
				$form = $cnt.find('form'),
				bv = $form.data('bootstrapValidator');
			self.switchWizardCtrlStatus('loading');
			bv.validate();
		},
		// 提交每个步骤的数据
		commitStep : function (cntID) {
			var self = this,
				stepView = self.stepViewHT.get(cntID);
			switch(cntID) {
				case "user_base_info":
				case "user_login_pwd":
					self.commitUserInfo(stepView);
					break;
				case "user_role_binding":
					self.model.emit('editRole', {
						successFn : function () {
							self.successFn(self.model);
							self.modal.hide();
						},
						failFn : function () {
							self.failFn(self.model);
						}
					});
					break;
			}
		},
		initWizard : function () {
			var self = this;
			self.$wizard = self.$body.find('#' + self.wizardID);
			
			self.$wizard.bsWizard({
				'tabClass' : 'tabClass',
				'nextSelector' : '.btn[name=next]',
				'previousSelector' : '.btn[name=prev]',
				'finishSelector' : '.btn[name=finish]',
				onTabClick : function () {return false;},
				onInit : function ($wizard, $navBar, nIdx) {
					console.info('onInit');console.info(arguments);
					// 加载新建账号基本信息View层
					var $tab = $('li:eq(' + nIdx + ')', self.$wizard),
						cntID = self.getTabContentIDByIndex($navBar, nIdx),
						$cnt = $('#' + cntID, self.$wizard);
					self.initUserBaseInfoView($cnt, cntID, 'wizard_add');
				},
				/**
				 * fired next step button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param  {Number} nIdx    下一步的索引值
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 *         
				 */
				onNext : function ($curNav, $navBar, nIdx) {
					console.info('onNext');
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					if (self.enableGoToNextStep == false) {
						self.commitStep(curID);
						
					}
					var ret = self.enableGoToNextStep;
					self.enableGoToNextStep = false;
					return ret;
				},
				/**
				 * fired previous step button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param  {Number} nIdx    下一步的索引值
				 * @return {Boolean}         false:不移动到下一步，true:移动到下一步
				 */
				onPrevious : function ($curNav, $navBar, nIdx) {
					console.info('onPrevious');
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					// if (self.enableGoToNextStep == false) {
					// 	self.commitStep(curID, function () {
					// 		self.enableGoToNextStep = true;
					// 		self.$wizard.bsWizard('previous');
					// 	});
						
					// }
					// var ret = self.enableGoToNextStep;
					// self.enableGoToNextStep = false;
					// return ret;
					return true;
				},
				/**
				 * fired when a tab is changed
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param  {Number} nIdx    下一步的索引值
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onTabChange : function ($curNav, $navBar, cIdx, nIdx) {
					console.info('onTabChange'); console.info(cIdx + '--->' + nIdx);
					var curID = self.getTabContentIDByIndex($navBar, cIdx),
						nextID = self.getTabContentIDByIndex($navBar, nIdx),
						$nextCnt = $('#' + nextID, self.$wizard),
						nextView = self.stepViewHT.get(nextID);

					var	viewMode = !IX.isEmpty(nextView) ? nextView.getViewMode() : null;
						
					if (cIdx == -1 && nIdx == 0) return true;
					if (nIdx == 0 && nextView && viewMode == 'wizard_add') {
						self.initUserBaseInfoView($nextCnt, nextID, 'wizard_edit');
						return true;
					} 
					if (nIdx == 1) {
						IX.isEmpty(viewMode) && self.initResetPWDView($nextCnt, nextID, 'wizard_edit');
					} else if (nIdx == 2) {
						IX.isEmpty(viewMode) && self.initUserRoleView($nextCnt, nextID, 'wizard_edit');
					}
				},
				/**
				 * fired when a tab is shown
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onTabShow : function ($curNav, $navBar, cIdx) {
					console.info('onTabShow');
					
				},
				/**
				 * fired when finish button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onFinish : function ($curNav, $navBar, cIdx) {
					console.info('onFinish');
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					self.commitStep(curID);
				}
			});
		},
		switchWizardCtrlStatus : function (status) {
			var self = this;
			self.$wizard.find('.wizard-ctrl .btn').button(status);
		},
		getNextStep : function () {
			var self = this;
			self.enableGoToNextStep = true;
			self.$wizard.bsWizard('next');
		},
		getPrevieousStep : function () {
			var self = this;
			self.enableGoToNextStep = true;
			self.$wizard.bsWizard('previeous');
		},
		bindEvent : function () {
			var self = this;
			self.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function (e) {
				var $btn = $(this);
				var curIdx = self.$wizard.bsWizard('currentIndex'), 
					cntID = self.getTabContentIDByIndex(self.$wizard.find('.wizard-nav'), curIdx),
					stepView = self.stepViewHT.get(cntID),
					mode = stepView.getViewMode();
				var accountID = self.model.get('accountID');
				if (!accountID && curIdx == 0) {
					self.modal.hide();
				} else {
					Hualala.UI.Confirm({
						title : '取消创建账号',
						msg : '是否取消创建新账户的操作？',
						okLabel : '确定',
						okFn : function () {
							self.model.emit('remove', {
								successFn : function () {
									self.modal.hide();
								}
							});
						}
					});
				}

			})
		}
	});
	Hualala.User.CreateUserModal = CreateUserModal;
})(jQuery, window);