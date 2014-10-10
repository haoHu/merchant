(function ($, window) {
	IX.ns('Hualala.Entry');
	var formFields = [
		{
			name : 'group_name', type : 'text', palceholder : '请输入集团主账号', clz : 'form-control input-md',
			key : 'groupName',
			field : {
				validators : {
					notEmpty : {
						message : "请输入集团主账号"
					}
				}
			}
		},
		{
			name : 'group_subname', type : 'text', palceholder : '请输入集团子账号', clz : 'form-control input-md',
			key : 'childName',
			field : {
				validators : {
					// notEmpty : {
					// 	message : "集团子账号不能为空"
					// }
				}
			}
		},
		{
			name : 'login_pwd', type : 'passowrd', palceholder : '请输入登陆密码', clz : 'form-control input-md',
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
								}
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
		}
	];

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
			$img.attr('src', code);
			// FOR TEST
			setTimeout(function () {
				toggleProgress();
			}, 500);
		};
		var bindEvent = function () {
			container.delegate('.auth-img', 'click', function (e) {
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

	Hualala.Entry.initLogin = function ($container) {
		if (!$container || $container.length == 0) {
			console.err("Login Form init failed!");
			return ;
		}
		var callServer = Hualala.Global.loginCallServer;
		var fvOpts = {},
			$subBtn = $container.find('#login_sub'),
			$progress = $subBtn.parent().find('.progress'),
			$authCode = $container.find('.ix-authcode'),
			authCode = new AuthCode({
				container : $authCode
			});
		var toggleProgress = function (isShow) {
			$progress[isShow ? 'removeClass' : 'addClass']('hidden');
			$subBtn[isShow ? 'addClass' : 'removeClass']('hidden');
		};
		var initValidFieldOpts = function () {
			var ret = {};
			_.each(formFields, function (f, i, l) {
				var key = $XP(f, 'name'), field = $XP(f, 'field');
				ret[key] = field;
			});
			return ret;
		};
		var getFormData = function () {
			var params = {};
			_.each(formFields, function (f, i, l) {
				var name = $XP(f, 'name'), key = $XP(f, 'key'), 
					val = $('[name=' + name + ']', $container).val();
				params[key] = val;
			});
			return params;
		};
		var initLoginForm = function () {
			fvOpts = initValidFieldOpts();
			$container.bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				toggleProgress();
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator'),
					params = getFormData();
				// TODO AJAX Submit Login Form
				IX.Debug.info('INFO: Login Params : ');
				IX.Debug.info(params);
				
				callServer(params, function (res) {
					if (res.resultcode == 000) {
						document.location.href = Hualala.PageRoute.createPath('main'); 
					} else {
						Hualala.UI.TopTip({
							type : 'danger',
							msg : $XP(res, 'resultmsg')
						});
					}
					toggleProgress();
				});
			});
			$container.delegate('#login_sub', 'click', function (e) {
				toggleProgress(true);
				var bv = $container.data('bootstrapValidator');
				bv.validate();
			});
			$container.delegate('.form-control[tabIndex]', 'keyup', function (e) {
				if (e.keyCode != 13) return;
				var $this = $(this),
					el = $('.form-control[tabIndex=' + (parseInt($this.attr('tabIndex')) + 1) + ']');
				$this.blur();
				(el.length > 0 && !el.is(".btn")) ? el.focus() : $container.find('#login_sub').trigger('click');
			});
		};

		initLoginForm();
	};
})(jQuery, window);