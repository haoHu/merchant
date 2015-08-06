(function ($, window) {
	IX.ns('Hualala.Entry');
	var formFields = [
		{
			name : 'group_name', type : 'text', palceholder : '请输入主账号', clz : 'form-control input-md',
			key : 'groupName',
			field : {
				validators : {
					notEmpty : {
						message : "请输入主账号"
					}
				}
			}
		},
		{
			name : 'group_subname', type : 'text', palceholder : '请输入子账号', clz : 'form-control input-md',
			key : 'childName',
			field : {
				validators : {
					notEmpty : {
						message : "用户账号不能为空"
					},
					stringLength : {
						min : 3,
						max : 50,
						message : "账号名称长度在3-50个字符之间"
					},
					loginName : {
						message : "账号名称只能包含数字、英文字母和下划线(_)"
					}
				}
			}
		},
		{
			name : 'login_pwd', type : 'password', palceholder : '请输入登陆密码', clz : 'form-control input-md',
			key : 'password',
			field : {
				validators : {
					notEmpty : {
						message : "请输入登陆密码"
					},
					callback : {
						callback : function (val, validator, $field) {
							var min = 6, max = 32;
							if (val.length < 6 || val.length > 32) {
								return {
									valid : false,
									message : '密码长度必须在' + min + '位到' + max + '位之间'
								};
							}
							return {
								valid : true
							}
						}
					}
				}
			}
		},
		{
			name : 'login_auth', type : 'text', palceholder : '请输入验证码', clz : 'form-control input-md',
			key : 'authCode',
			field : {
				validators : {
					notEmpty : {
						message : "请输入验证码"
					}/*,
					callback : function (val, validator, $field) {
						if (val != $('[name=auth_code]').val()) {
							return {
								valid : false,
								message : '验证码错误'
							}
						}
						return {valid : true};
					}*/
				}
			}
		},
		{
			name : 'group_mobile', type : 'text', placeholder : '请输入账号绑定的手机号', clz : 'form-control input-md',
			key : 'userMobile',
			field : {
				validators : {
					notEmpty : {
						message : "请输入账号绑定的手机号"
					},
					mobile : {
						message : "请输入中国地区正确的手机号"
					}
				}
			}
		},
		{
			name : 'mobile_pwd', type : 'password', placeholder : '短信动态密码', clz : 'form-control input-md',
			key : 'dynamicPwd',
			field : {
				validators : {
					notEmpty : {
						message : "请输入短信动态密码"
					}
				}
			}
		}
	];
	var FormFieldHT = new IX.IListManager();
	_.each(formFields, function (el) {
		var name = $XP(el, 'name');
		FormFieldHT.register(name, el);
	});
	var CommonLoginFormEls = 'group_name,group_subname,login_pwd,login_auth'.split(','),
		MobileLoginFormEls = 'group_name,group_mobile,mobile_pwd'.split(',');

	var DynamicPWD = function (cfg) {
		var $btn = $($XP(cfg, '$btn')),
			getParams = $XF(cfg, 'getParams'),
			waitingTime = $XP(cfg, 'waiting', 60),
			timmer = null;
		var callServer = Hualala.Global.getMobileDynamicPWD;
		var getDynamicPWD = function (cbFn) {
			var params = getParams();
			if (!params) {
				$btn.button('reset');
				return ;
			}
			callServer(params, function (res) {
				if ($XP(res, 'resultcode') == "000") {
					Hualala.UI.TopTip({
						type : 'success',
						msg : $XP(res, 'resultmsg', "短信发送成功")
					});
					cbFn();
				} else {
					Hualala.UI.TopTip({
						type : 'danger',
						msg : $XP(res, 'resultmsg', "发送动态密码失败")
					});
					$btn.button('reset');
				}
				
			});
		};
		var waiting = function () {
			var count = waitingTime;
			timmer = setInterval(function () {
				count--;
				if (count == 0) {
					clearInterval(timmer);
					$btn.attr('data-loading-text', '发送中...');
					$btn.button('reset');
					return;
				}
				var tpl = '{time}秒后重试',
					str = tpl.replaceAll('{time}', count);
				$btn.text(str);
			}, 1000);
		};
		var bindEvent = function () {
			$btn.unbind('click').on('click', function (e) {
				if ($btn.hasClass('disabled')) return;
				$btn.button('loading');
				getDynamicPWD(waiting);
			});
		};
		bindEvent();
		return {
			getDynamicPWD : function () {$btn.trigger('click');}
		};
	};
	Hualala.Common.DynamicPWD = DynamicPWD;

	/**
	 * 生成AuthCode实例
	 * @param {Object} cfg {container}
	 */
	var AuthCode = function (cfg) {
		var container = $($XP(cfg, 'container')),
			$img = container.find('.auth-img'),
			$progress = container.find('.progress');
		var callServer = Hualala.Global.genAuthCode;
		var toggleProgress = function (isShow) {
			$progress[isShow ? 'removeClass' : 'addClass']('hidden');
			$img[isShow ? 'addClass' : 'removeClass']('hidden');
		};
		var getAuthCode = function (cbFn) {
			toggleProgress(true);
			callServer({}, function (res) {
				var code = null;
				if ($XP(res, 'resultcode') == "000") {
					code = $XP(res, 'data.code', null);
				} else {
					Hualala.UI.TopTip({
						type : 'warning',
						msg : "获取验证码失败"
					});

					toggleProgress();
				}
				cbFn(code);
			});
		};
		var setAuthCode = function (code) {
			if (!code) {
				setTimeout(function () {
					getAuthCode(setAuthCode);
				}, 1000);
				return;
			}
			$img.attr('src', code + '?' + (new Date()).getTime());
			// FOR TEST
			setTimeout(function () {
				toggleProgress();
			}, 500);
		};
		var bindEvent = function () {
			container.find('.auth-img').unbind('click').on('click', function (e) {
				$img = $(e.target);
				getAuthCode(setAuthCode);
			});
		};
		var init = function () {
			getAuthCode(setAuthCode);
			bindEvent();
		};
		init();
		return {
			genCode : function () {
				getAuthCode(setAuthCode);
			}
		};
	};

	Hualala.Entry.initLogin = Stapes.subclass({
		/**
		 * 构造登录界面
		 * @param  {Object} cfg 
		 *         {
		 *         		$container : jQueryObj
		 *         		mode : 'common' | 'mobile'
		 *         }
		 * @return {Object}     实例
		 */
		constructor : function (cfg) {
			this.$container = $XP(cfg, '$container');
			this.mode = $XP(cfg, 'mode', 'common');
			this.callServer = Hualala.Global.loginCallServer;
			this.formKeys = [];
			this.formFieldHT = FormFieldHT;
			this.formFields = [];
			this.$subBtn = null;
			this.$authCode = null;
			this.authCode = null;
			this.$dinamicPWDBtn = null;
			this.dinamicPWD = null;
			this.progress = null;
			this.fvOpts = null;
			this.$formPanel = null;
			this.switchLoginMode(this.mode);
			this.bindEvent();
		}
	});
	Hualala.Entry.initLogin.proto({
		switchLoginMode : function (mode) {
			var self = this;
			self.mode = mode;
			if (self.mode == 'common') {
				self.callServer = Hualala.Global.loginCallServer;
				self.formKeys = CommonLoginFormEls;
				self.$formPanel = self.$container.find('.panel-login');
				self.$subBtn = self.$container.find('#login_sub');
				self.$progress = self.$subBtn.parent().find('.progress');
				self.$authCode = self.$container.find('.ix-authcode');
				self.authCode = new AuthCode({
					container : self.$authCode
				});
				self.formFields = self.formFieldHT.getByKeys(self.formKeys);
				self.fvOpts = self.initValidFieldOpts();
			} else  if (self.mode == 'mobile') {
				self.callServer = Hualala.Global.dynamicLoginCallServer;
				self.formKeys = MobileLoginFormEls;
				self.$formPanel = self.$container.find('.panel-forget-pwd');
				self.$subBtn = self.$container.find('#login_mobile');
				self.$progress = self.$subBtn.parent().find('.progress');
				self.$dynamicPWDBtn = self.$container.find('.btn-mobile-pwd');
				self.dinamicPWD = new DynamicPWD({
					$btn : self.$dynamicPWDBtn,
					getParams : function () {
						var $groupName = self.$formPanel.find('#group_name'),
							$userMobile = self.$formPanel.find('#group_mobile'),
							bv = self.$formPanel.data('bootstrapValidator');
						if (!bv.validateField($groupName).isValidField($groupName) 
							|| !bv.validateField($userMobile).isValidField($userMobile)) {
							return null;
						}
						var els = self.getFormData();
						var ret = {};
						_.each(els, function (v, k) {
							if (k == 'groupName' || k == 'userMobile') {
								ret[k] = v;
							}
						});
						return ret;
					}
				});
				self.formFields = self.formFieldHT.getByKeys(self.formKeys);
				self.fvOpts = self.initValidFieldOpts();
			}
			self.initLoginForm();
		},
		toggleProgress : function (isShow) {
			var self = this;
			self.$progress[isShow ? 'removeClass' : 'addClass']('hidden');
			self.$subBtn[isShow ? 'addClass' : 'removeClass']('hidden');
		},
		// 表单校验配置项
		initValidFieldOpts : function () {
			var self = this, ret = {};
			_.each(self.formFields, function (f, i, l) {
				var key = $XP(f, 'name'), field = $XP(f, 'field');
				ret[key] = field;
			});
			return ret;
		},
		// 获取表单数据
		getFormData : function () {
			var self = this;
			var params = {};
			_.each(self.formFields, function (f, i, l) {
				var name = $XP(f, 'name'), key = $XP(f, 'key'),
					val = $('[name=' + name + ']', self.$formPanel).val();
				params[key] = val;
			});
			return params;
		},
		initLoginForm : function () {
			var self = this;
			self.$container.find('.panel-warning').addClass('hidden');
			self.$formPanel.removeClass('hidden');
			self.$formPanel.find('#group_name').val(self.groupName);
			if (self.$formPanel.data('bootstrapValidator')) return;
			self.$formPanel.bootstrapValidator({
				trigger : 'blur',
				fields : self.fvOpts
			}).on('success.field.bv', function (e, data) {
				var field = $XP(data, 'field');
				if (field == 'group_mobile') {
					self.$dynamicPWDBtn.removeClass('disabled').attr('disabled', false);
				}
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				self.toggleProgress();
				var field = $XP(data, 'field');
				if (field == 'group_mobile' || field == 'group_name') {
					self.$dynamicPWDBtn.addClass('disabled').attr('disabled', true);
				}
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator'),
					params = self.getFormData();
				IX.Debug.info('INFO: Login Params : ');
				IX.Debug.info(params);
				self.callServer(params, function (res) {
					if (res.resultcode == '000') {
						document.location.href = Hualala.PageRoute.createPath('main'); 
					} else {
						Hualala.UI.TopTip({
							type : 'danger',
							msg : $XP(res, 'resultmsg')
						});
						if (self.mode == 'common') {
							self.authCode.genCode();
						}
					}
					self.toggleProgress();
					self.$subBtn.attr('disabled', false);
				});
				$form.find(name=[login_auth]).val("");
			});
			self.$formPanel.bootstrapValidator('resetForm');
			self.$dynamicPWDBtn && self.$dynamicPWDBtn.removeClass('disabled').attr('disabled', false);
		},
		bindEvent : function () {
			var self = this;
			self.$container.delegate('#login_sub, #login_mobile', 'click', function (e) {
				self.toggleProgress(true);
				var bv = self.$formPanel.data('bootstrapValidator');
				bv.validate();
			});
			self.$container.delegate('.form-control[tabIndex]', 'keyup', function (e) {
				if (e.keyCode != 13) return;
				var $this = $(this), tabIdx = parseInt($this.attr('tabIndex')),
					el = $('.form-control[tabIndex=' + (tabIdx + 1) + ']');

				$this.blur();
				(el.length > 0 && !el.is('.btn')) ? el.focus() : self.$subBtn.trigger('click');
				
			});
			self.$container.delegate('.btn-change-mode', 'click', function (e) {
				var $btn = $(this), mode = $btn.attr('data-mode');
				self.groupName = self.$formPanel.find('#group_name').val();
				self.toggleProgress();
				self.switchLoginMode(mode);
			});
		}
	});
})(jQuery, window);