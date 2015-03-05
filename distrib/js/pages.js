/** 
 * -------------------------------------------------
 * Copyright (c) 2014, All rights reserved. 
 * Hualala-Merchant-Management
 * 
 * @version : 0.1.0
 * @author : HuHao
 * @description : Hualala Merchant Management System.  
 * -------------------------------------------------
 */ 

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
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var QueryModel = Stapes.subclass({
		constructor : function () {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			// 数据是否已经加载完毕
			this.isReady = false;
			this.callServer = Hualala.Global.getShopQuerySchema;
		}
	});
	QueryModel.proto({
		// 数据模型初始化，获取查询条件的数据
		init : function (params, cbFn) {
			var self = this;
			self.isReady = false;
			self.callServer(params, function (res) {
				if (res.resultcode == '000') {
					// 装填原始数据
					self.origCities = $XP(res, 'data.cities', []);
					self.origAreas = $XP(res, 'data.areas', []);
					self.origShops = $XP(res, 'data.shops', []);
					self.initDataModel();
					self.isReady = true;
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					self.isReady = false;
				}
				cbFn(self);
			});
		},
		// 初始化整体数据模型
		// ds_city, ds_area, ds_shop
		initDataModel : function () {
			var self = this;
			var cityHT = new IX.IListManager(),
				areaHT = new IX.IListManager(),
				shopHT = new IX.IListManager();
			_.each(this.origCities, function (c, i, l) {
				var cid = $XP(c, 'cityID'), 
					shopLst = _.filter(self.origShops, function (s) {
						return $XP(s, 'cityID') == cid;
					}),
					areaLst = _.filter(self.origAreas, function (a) {
						return $XP(a, 'cityID') == cid;
					});
				shopLst = _.pluck(shopLst, 'shopID');
				areaLst = _.pluck(areaLst, 'areaID');
				cityHT.register(cid, IX.inherit(c, {
					shopLst : shopLst,
					areaLst : areaLst
				}));
			});
			_.each(this.origAreas, function (a, i, l) {
				var aid = $XP(a, 'areaID'),
					shopLst = _.filter(self.origShops, function (s) {
						return $XP(s, 'areaID') == aid;
					});
				shopLst = _.pluck(shopLst, 'shopID');
				areaHT.register(aid, IX.inherit(a, {
					shopLst : shopLst
				}));
			});
			_.each(this.origShops, function (s, i, l) {
				var sid = $XP(s, 'shopID');
				shopHT.register(sid, s);
			});
			self.set({
				ds_city : cityHT,
				ds_area : areaHT,
				ds_shop : shopHT
			});
		},
		// 数据是否准备完成
		hasReady : function () {return this.isReady;},
		/**
		 * 通过cityIDs获取城市数据
		 * @param  {String|Array|NULL} ids cityID，如果参数是一个城市的cityID，获取一个城市的数据；如果参数是cityID的数组，获取多个城市数据；如果不传参数，获取全部城市数据
		 * @return {Array|NULL}	如果没有找到匹配的城市数据返回null，否则返回城市数据的数组数据     
		 */
		getCities : function (ids) {
			ids = IX.isEmpty(ids) ? null : (IX.isString(ids) ? [ids] : ids);
			var ds = this.get('ds_city');
			var ret = null;
			ret = ds[!ids ? 'getAll' : 'getByKeys'](ids);
			return ret;
		},
		/**
		 * 通过shopIDs获取店铺数据
		 * @param  {String|Array|NULL} ids shopID，如果参数是一个店铺的shopID，获取一个店铺的数据；如果参数是shopID的数组，获取多个店铺数据；如果不传参数，获取全部店铺数据
		 * @return {Array|NULL}	如果没有找到匹配的店铺数据返回null，否则返回店铺数据的数组数据     
		 */
		getShops : function (ids) {
			ids = IX.isEmpty(ids) ? null : (IX.isString(ids) ? [ids] : ids);
			var ds = this.get('ds_shop');
			var ret = null;
			ret = ds[!ids ? 'getAll' : 'getByKeys'](ids);
			return ret;
		},
		/**
		 * 获取指定区域下的店铺数据
		 * @param  {String} areaID 指定区域ID
		 * @return {Array|NULL} 如果没有找到匹配的店铺数据返回null，否则返回店铺数据的数组数据
		 */
		getShopsByAreaID : function (areaID) {
			if (!areaID) return null;
			var ds = this.get('ds_shop');
			var ret = _.filter(ds.getAll(), function (s, idx) {
				var aid = $XP(s, 'areaID');
				return areaID == aid;
			});
			return ret.length == 0 ? null : ret;
		},
		/**
		 * 获取指定城市的店铺数据
		 * @param  {String} cityID 指定城市ID
		 * @return {Array|NULL} 如果没有找到匹配的店铺数据返回null，否则返回店铺数据的数组数据
		 */
		getShopsByCityID : function (cityID) {
			if (!cityID) return null;
			var ds = this.get('ds_shop');
			var ret = _.filter(ds.getAll(), function (s, idx) {
				var cid = $XP(s, 'cityID');
				return cityID == cid;
			});
			return ret.length == 0 ? null : ret;
		},
		/**
		 * 通过areaIDs获取区域数据
		 * @param  {String|Array|NULL} ids areaID，如果参数是一个区域的areaID，获取一个区域的数据；如果参数是areaID的数组，获取多个区域数据；如果不传参数，获取全部区域数据
		 * @return {Array|NULL}	如果没有找到匹配的区域数据返回null，否则返回区域数据的数组数据     
		 */
		getAreas : function (ids) {
			ids = IX.isEmpty(ids) ? null : (IX.isString(ids) ? [ids] : ids);
			var ds = this.get('ds_area');
			var ret = null;
			ret = ds[!ids ? 'getAll' : 'getByKeys'](ids);
			return ret;
		},
		destroy : function () {
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			this.isReady = false;
		}
	});
	Hualala.Shop.QueryModel = QueryModel;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var QueryView = Stapes.subclass({
		constructor : function () {
			// View层是否初始化完毕
			this.isReady = false;
			// 是否开放创建店铺功能
			this.needShopCreate = false;
			// View层容器
			this.$container = null;
			this.$queryBox = null;
			// 过滤部分容器
			this.$filter = null;
			// 搜索部分容器
			this.$query = null;
			this.loadTemplates();
		}
	});
	QueryView.proto({
		// 初始化View层
		init : function (cfg) {
			this.model = $XP(cfg, 'model', null);
			this.needShopCreate = $XP(cfg, 'needShopCreate', false);
			this.$container = $XP(cfg, 'container', null);
			if (!this.model || !this.$container || this.$container.length == 0) {
				throw("Init Query View Failed!!");
				return;
			}
			this.keywordLst = null;
			this.renderLayout();
			this.bindEvent();
			this.isReady = true;
			this.emit('filter', this.getFilterParams());

		},
		// 判断是否View初始化完毕
		hasReady : function () {return this.isReady;},
		// 加载View层需要的模板
		loadTemplates : function () {
			var queryTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_query')),
				filterTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_filter'));
			// 注册子模板
			Handlebars.registerPartial("shopCity", Hualala.TplLib.get('tpl_shop_filter'));
			Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
			// Handlebars.registerPartial("shopArea", Hualala.TplLib.get('tpl_shop_filter'));
			this.set({
				queryTpl : queryTpl,
				filterTpl : filterTpl
			});
		},
		// 生成搜索栏店铺选择框组件的渲染数据
		mapChosenShopData : function () {
			var self = this;
			var cities = this.model.getCities();
			var ret = [];
			_.each(cities, function (city, i, l) {
				var cityName = $XP(city, 'cityName', ''),
					cityID = $XP(city, 'cityID', ''),
					shopLst = $XP(city, 'shopLst');
				var shops = self.model.getShops(shopLst);
				ret.push({
					name : cityName,
					items : _.map(shops, function (shop, j, l) {
						return {
							code : $XP(shop, 'shopID'),
							name : $XP(shop, 'shopName')
						};
					})
				});
			});
			return ret;
		},
		// 生成渲染数据
		mapRenderLayoutData : function () {
			var cities = this.model.getCities(),
				shops = this.model.getShops();
			var filterCities = this.mapFilterData({
					type : 'city',
					name : '城市：',
					focus : 0,
					data : cities
				}),
				queryChosenShops = this.mapChosenShopData();
			return {
				clz : '',
				shopCity : filterCities,
				toggle : {target : '#shop_query'},
				needShopCreate : this.needShopCreate,
				optGrp : queryChosenShops
			};
		},
		chkCtrlRight : function () {
			var self = this;
			var curPageRight = Hualala.Common.getCurPageUserRight();
			var disabled = $XP(curPageRight, 'right.disabled', []),
				enabled = $XP(curPageRight, 'right.enabled', []);
			_.each(disabled, function (n) {
				self.$query.find('[data-btn-name=' + n + ']').attr('disabled', true).addClass('invisible');
			});
			_.each(enabled, function (n) {
				self.$query.find('[data-btn-name=' + n + ']').attr('disabled', false).removeClass('invisible');
			});
		},
		// 渲染整体query 框架
		renderLayout : function () {
			var self = this,
				queryTpl = self.get('queryTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = queryTpl(renderData);
			this.$queryBox = $(html);
			this.$container.prepend(this.$queryBox);
			this.$filter = this.$queryBox.find('.filter');
			this.$query = this.$queryBox.find('.query');
			this.initShopChosenPanel();
			this.chkCtrlRight();
		},
		// 生成渲染地区的渲染数据
		mapFilterData : function (cfg) {
			var data = $XP(cfg, 'data', []),
				type = $XP(cfg, 'type'),
				name = $XP(cfg, 'name'),
				focus = $XP(cfg, 'focus', 0),
				ret = {
					type : type,
					name : name,
					items : []
				},
				count = 0;
			var btn_all = {
				focusClz : '',
				type : type,
				code : -1,
				name : '全部',
				count : 0
			};
			ret.items = _.map(data, function (o, i, l) {
				var key = type + 'Count';
				var c = parseInt($XP(o, key, 0));
				count += c;
				return {
					focusClz : '',
					type : type,
					code : $XP(o, (type + 'ID'), ''),
					name : $XP(o, (type + 'Name'), ''),
					count : c
				}
			});
			btn_all = IX.inherit(btn_all, {
				count : count,
				focusClz : ''
			});
			ret.items.unshift(btn_all);
			ret.items[focus]['focusClz'] = 'disabled';
			return ret;
		},
		initShopChosenPanel : function () {
			var self = this;
			var matcher = (new Pymatch([]));
			var sections = self.model.getShops();
			var getMatchedFn = function (searchText) {
				matcher.setNames(_.map(sections, function (el) {
					return IX.inherit(el, {
						name : el.shopName
					});
				}));
				var matchedSections = matcher.match(searchText);
				var matchedOptions = {};
				_.each(matchedSections, function (el, i) {
					matchedOptions[el[0].shopID] = true;
				});
				return matchedOptions;
			};
			self.$query.find('.navbar-form[role="search"] select').chosen({
				width : '200px',
				placeholder_text : "请选择店铺名称",
				// max_selected_options: 1,
				no_results_text : "抱歉，没有找到！",
				allow_single_deselect : true,
				getMatchedFn : getMatchedFn
			}).change(function (e) {
				var $this = $(this);
				self.keywordLst = $this.val();
			});
		},
		// 渲染filter
		renderAreaFilter : function (data) {
			var self = this,
				filterTpl = self.get('filterTpl'),
				model = self.model;
			var renderData = self.mapFilterData({
				type : 'area',
				name : '区域：',
				focus : 0,
				data : data
			});
			var html = filterTpl(renderData);
			this.$filter.find('.area').remove();
			this.$filter.append(html);
			this.initShopChosenPanel();
		},
		updateFilterCityLayout : function (cityID) {
			var self = this;
			var data = null;
			if (cityID != -1) {
				data = self.model.getCities(cityID);
				data = $XP(data[0], 'areaLst', null);
				data = self.model.getAreas(data);
				self.renderAreaFilter(data);
			} else {
				self.$filter.find('.area').remove();
			}
			self.$filter.find('.btn-link[data-city]').removeClass('disabled');
			self.$filter.find('.btn-link[data-city=' + cityID + ']').addClass('disabled');
		},
		updateFilterAreaLayout : function (areaID) {
			var self = this;
			self.$filter.find('.btn-link[data-area]').removeClass('disabled');
			self.$filter.find('.btn-link[data-area=' + areaID + ']').addClass('disabled');
		},
		// 绑定View层操作
		bindEvent : function () {
			var self = this;
			this.$filter.on('click', '.btn-link[data-city]', function (e) {
				var $btn = $(this);
				var cityID = $btn.attr('data-city');
				// var data = null;
				// if (cityID != -1) {
				// 	data = self.model.getCities(cityID);
				// 	data = $XP(data[0], 'areaLst', null);
				// 	data = self.model.getAreas(data);
				// 	self.renderAreaFilter(data);
				// } else {
				// 	self.$filter.find('.area').remove();
				// }
				// self.$filter.find('.btn-link[data-city]').removeClass('disabled');
				// $btn.addClass('disabled');
				self.updateFilterCityLayout(cityID);
				self.emit('filter', self.getFilterParams());
			});
			this.$filter.on('click', '.btn-link[data-area]', function (e) {
				var $btn = $(this);
				var areaID = $btn.attr('data-area');
				// self.$filter.find('.btn-link[data-area]').removeClass('disabled');
				// $btn.addClass('disabled');
				self.updateFilterAreaLayout(areaID);
				self.emit('filter', self.getFilterParams());
			});
			this.$query.on('click', '.create-shop', function (e) {
				var $btn = $(this);
				document.location.href = Hualala.PageRoute.createPath('shopCreate');
			});
			this.$query.on('click', '.query-btn', function (e) {
				var $btn = $(this);
				var shopID = self.keywordLst || null,
					shop = null, cityID = -1, areaID = -1;
				if (!IX.isEmpty(shopID)) {
					shop = self.model.getShops(shopID)[0];
					cityID = $XP(shop, 'cityID', -1);
					areaID = $XP(shop, 'areaID', -1);
				}
				self.updateFilterCityLayout(cityID);
				self.updateFilterAreaLayout(areaID);
				self.emit('query', self.getQueryParams());
			});
			this.$query.on('keyup', '.chosen-container', function (e) {
				var $this = $(this);
				if ($this.hasClass('chosen-container-active') && !$this.hasClass('chosen-with-drop')) {
					$this.find('input').first().trigger('blur.chosen');
					self.$query.find('.query-btn').trigger('click');
				}
			});
		},
		destroy : function () {
			this.isReady = false;
			this.needShopCreate = false;
			this.$container.find('.shop-query').remove();
			this.$queryBox = null;
			this.$filter = null;
			this.$query = null;
		},
		// 获取过滤参数
		getFilterParams : function () {
			// TODO
			var self = this;
			var focusedBtn = self.$filter.find('.btn-link.disabled');
			var cityID = focusedBtn.filter('[data-city]').attr('data-city'),
				areaID = focusedBtn.filter('[data-area]').attr('data-area');
			cityID = (!cityID || cityID == -1) ? '' : cityID;
			areaID = (!areaID || areaID == -1) ? '' : areaID;
			return {
				cityID : cityID,
				areaID : areaID,
				keywordLst : ''
			};
		},
		// 获取搜索参数
		getQueryParams : function () {
			// TODO
			var self = this;
			var keywordLst = self.keywordLst || null;
			var params = self.getFilterParams();
			var shops = self.model.getShops();
			if (IX.isEmpty(keywordLst)) {
				keywordLst = '';
			} else {
				keywordLst = $XP(_.find(shops, function (el) {
					return $XP(el, 'shopID') == keywordLst;
				}), 'shopName', '');
			}
			return IX.inherit(params, {
				keywordLst : keywordLst
			});
		}

	});
	Hualala.Shop.QueryView = QueryView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var QueryModel = Hualala.Shop.QueryModel;
	var QueryView = Hualala.Shop.QueryView;
	var QueryController = Stapes.subclass({
		/**
		 * 店铺查询控制器
		 * @param  {Object} cfg 配置数据
		 *            @param {Boolean} cfg.needShopCreate 是否开启创建店铺功能
		 *            @param {JQueryObj} container 容器
		 *            @param {Object} resultController 结果输出控制器
		 * @return {Object}     
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.needShopCreate = $XP(cfg, 'needShopCreate', false);
			this.resultController = $XP(cfg, 'resultController', null);
			this.model = new QueryModel();
			this.view = new QueryView();
			this.init();
		}
	});
	QueryController.proto({
		// 初始化控制器
		init : function () {
			var self = this;
			self.bindEvent();
			self.model.emit('load', function () {
				if (!self.model.hasReady()) {
					throw("Shop Query Init Failed!!");
					return;
				}
				// 加载View层
				self.view.emit('init');
			});
		},
		// 绑定事件
		bindEvent : function () {
			// 控制器的事件绑定
			this.on({
				reload : function () {
					var self = this;
					self.model.distory();
					self.view.distory();
					self.init();
				},
				query : function (params) {
					var self = this;
					IX.Debug.info("DEBUG: Shop Query Controller Query Params : ");
					IX.Debug.info(params);
					self.resultController && self.resultController.emit('load', IX.inherit(params, {
						pageNo : 1,
						pageSize : 15
					}));
				}
			}, this);
			// 模型的事件绑定
			this.model.on({
				load : function (cbFn) {
					var self = this,
						params = $XP(self.get('sessionData'), 'user', {});
					self.model.init(params, cbFn);
				}
			}, this);
			// 视图事件绑定
			this.view.on({
				init : function () {
					var self = this;
					self.view.init({
						model : self.model,
						needShopCreate : self.needShopCreate,
						container : self.container
					});
				},
				// 过滤操作，触发显示结果
				filter : function (params) {
					var self = this;
					self.emit('query', params);
					//TODO 重置Query的chosenPanel
				},
				// 搜索操作，触发显示结果
				query : function (params) {
					var self = this;
					self.emit('query', params);
				}
			}, this);
		}
	});
	Hualala.Shop.QueryController = QueryController;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListModel = Stapes.subclass({
		/**
		 * 构造卡片店铺列表的数据模型
		 * @param  {Object} cfg 配置信息
		 *           @param {Function} callServer 获取数据接口
		 * @return {Object}     
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
		}
	});
	CardListModel.proto({
		init : function (params) {
			this.set({
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15),
				cityID : $XP(params, 'cityID', ''),
				areaID : $XP(params, 'areaID', ''),
				keywordLst : $XP(params, 'keywordLst', ''),
				ds_shop : new IX.IListManager(),
				ds_page : new IX.IListManager()
			});
		},
		updatePagerParams : function (params) {
			var self = this;
			var pagerParamkeys = 'pageCount,totalSize,pageNo,pageSize,cityID,areaID,keywordLst';
			// _.each(pagerParamkeys.split(','), function (k, i, l) {
			// 	switch(k) {
			// 		case 'pageCount': 
			// 		case 'totalSize' :
			// 			self.set(k, $XP(params, k, 0));
			// 			break;
			// 		case 'pageNo' : 
			// 			self.set(k, $XP(params, k, 1));
			// 			break;
			// 		case 'pageSize' :
			// 			self.set(k, $XP(params, k, 15));
			// 			break;
			// 		default:
			// 			self.set(k, $XP(params, k, ''));
			// 			break;
			// 	}
			// });
			_.each(params, function (v, k, l) {
				if (pagerParamkeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			// return {
			// 	Page : {
			// 		pageNo : this.get('pageNo'),
			// 		pageSize : this.get('pageSize')
			// 	},
			// 	cityID : this.get('cityID'),
			// 	areaID : this.get('areaID'),
			// 	keywordLst : this.get('keywordLst')
			// };
			return {
				pageNo : this.get('pageNo'),
				pageSize : this.get('pageSize'),
				cityID : this.get('cityID'),
				areaID : this.get('areaID'),
				keywordLst : this.get('keywordLst')
			};
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			var shopIDs = _.map(data, function (shop, i, l) {
				// var shopID = $XP(shop, 'shopID');
				// shopHT.register(shopID, shop);
				// return shopID;
				var shopID = $XP(shop, 'shopID'),
					mShop = new BaseShopModel(shop);
				shopHT.register(shopID, mShop);
				return shopID;
			});
			pageHT.register(pageNo, shopIDs);
		},
		resetDataStore : function () {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			shopHT.clear();
			pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams($XP(res, 'data.page', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getShops : function (pageNo) {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			var ret = _.map(shopHT.getByKeys(pageHT.get(pageNo)), function (mShop, i, l) {
				return mShop.getAll();
			});
			IX.Debug.info("DEBUG: Shop Card List Model PageData : ");
			IX.Debug.info(ret);
			return ret;
		},
		getShopModelByShopID : function (shopID) {
			var self = this,
				shopHT = self.get('ds_shop');
			return shopHT.get(shopID);
		},
		// 更新店铺状态
		updateShopStatus : function (shopID, status, failFn, successFn) {
			var self = this,
				shopHT = self.get('ds_shop');
			var shop = shopHT.get(shopID);
			// shop = IX.inherit(shop, {
			// 	status : status
			// });
			// shopHT.register(shopID, shop);
			// shop.set('status', status);
			shop.emit('switchShopStatus', {
				status : status,
				failFn : failFn,
				successFn : successFn
			});
		},
		// 更新店铺业务状态
		updateShopBusinessStatus : function (params, failFn, successFn) {
			var self = this,
				shopHT = self.get('ds_shop'),
				shopID = $XP(params, 'shopID'),
				shop = shopHT.get(shopID);
			shop.emit('switchBusinessStatus', {
				name : $XP(params, 'name'),
				id : $XP(params, 'id'),
				status : $XP(params, 'status', 0),
				failFn : failFn,
				successFn : successFn
			});

		}
	});


	Hualala.Shop.CardListModel = CardListModel;

	var BaseShopModel = Stapes.subclass({
		constructor : function (shop) {
			this.switchShopStatusCallServer = Hualala.Global.switchShopStatus;
			this.switchShopBusinessStatusCallServer = Hualala.Global.switchShopServiceFeatureStatus;
			this.set(shop);
			this.bindEvent();
		}
	});
	BaseShopModel.proto({
		switchShopStatus : function (status, failFn, successFn) {
			var self = this,
				shopID = self.get('shopID');
			self.set('status', status);
			IX.Debug.info("DEBUG: Base Shop Model [" + self.get('shopID') + "] Status :" + status);
			this.switchShopStatusCallServer({
				shopID : shopID,
				status : status
			}, function (res) {
				if (res.resultcode !== '000') {
					
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					self.set('status', !status ? 1 : 0);
					failFn(shopID);
					
				} else {
					toptip({
						msg : !status ? '关闭成功！' : '开启成功！',
						type : 'success'
					});
					successFn(shopID);
				}
			});
		},
		switchShopBusinessStatus : function (params) {
			var self = this,
				shopID = self.get('shopID');
			var failFn = $XF(params, 'failFn'),
				successFn = $XF(params, 'successFn'),
				name = $XP(params, 'name'),
				id = $XP(params, 'id'),
				status = $XP(params, 'status');
			var setServiceFeature = function (sName, s) {
				var serviceFeatures = self.get('serviceFeatures').split(',');
				// 更新serviceFeature
				if (s == 1) {
					serviceFeatures.push(sName);
				} else {
					serviceFeatures = _.filter(serviceFeatures, function (el) {
						return el !== sName;
					});
				}
				self.set('serviceFeatures', serviceFeatures.join(','));
			};
			setServiceFeature(name, status);
			IX.Debug.info("DEBUG: Switch Shop [" + self.get('shopID') + "] ServiceFeature: " + self.get('serviceFeatures'));
			this.switchShopBusinessStatusCallServer({
				shopID : shopID,
				serviceFeatures : name,
				operation : status
			}, function (res) {
				if (res.resultcode !== '000') {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					setServiceFeature(name, !status ? 1 : 0);
					failFn({
						shopID : shopID,
						id : id
					});
				} else {
					toptip({
						msg : !status ? '关闭成功！' : '开启成功！',
						type : 'success'
					});
					successFn({
						mShop : self,
						id : id,
						name : name
					});
				}
			});
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"switchShopStatus" : function (params) {
					var status = $XP(params, 'status'),
						failFn = $XF(params, 'failFn'),
						successFn = $XF(params, 'successFn');
					this.switchShopStatus(status, failFn, successFn);
				},
				"switchBusinessStatus" : function (params) {
					this.switchShopBusinessStatus(params);
				},
				"setServiceParams" : function (cfg) {
					var callServer = $XF(cfg, 'callServer'),
						params = $XP(cfg, 'params', {}),
						serviceID = $XP(cfg, 'serviceID'),
						shopID = self.get('shopID'),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit(params, {
						shopID : shopID,
						strType : serviceID
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							var newData = {};
							newData[serviceID] = params;
							// var revParamJson = JSON.parse(self.get('revParamJson'));
							var revParamJson = self.get('revParamJson') || null,
								takeawayParamJson = self.get('takeawayParamJson') || null;
							var serviceFeatures = self.get('serviceFeatures');
							revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
							takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
							if (serviceID == 20 || serviceID == 21) {
								takeawayParamJson = IX.inherit(takeawayParamJson, newData);
								// self.set('revParamJson', JSON.stringify(takeawayParamJson));
								self.set('takeawayParamJson', JSON.stringify(takeawayParamJson));

							} else {
								revParamJson = IX.inherit(revParamJson, newData);
								self.set('revParamJson', JSON.stringify(revParamJson));
							}
							
							
							if (serviceID == 41) {
								var checkSpotOrder = $XP(params, 'checkSpotOrder', 0);
								if (checkSpotOrder == 0) {
									serviceFeatures = serviceFeatures.replace('spot_pay,', '');
								} else {
									serviceFeatures = serviceFeatures.concat('spot_pay,');
								}
								self.set('serviceFeatures', serviceFeatures);
							}
							successFn();
							toptip({
								msg : '配置成功!',
								type : 'success'
							});
						}
					});
				}
			});
		}
	});
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 结果容器
			this.$resultBox = null;
			// 结果列表
			this.$list = null;
			// 分页容器
			this.$pager = null;
			this.emptyBar = null;
			this.loadTemplates();
		}
	});
	CardListView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("CardList View Init Failed!");
				return ;
			}
			this.initLayout();
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$list = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
		},
		initPager : function (params) {
			var baseCfg = {
				total : 0,
				page : 1,
				maxVisible : 10,
				leaps : true
			};
			this.$pager.IXPager(IX.inherit(baseCfg, params));
		},
		bindEvent : function () {
			var self = this;
			self.$list.tooltip({
				selector : '[title]'
			});
			self.$list.on('click', '.btn[data-href]', function (e) {
				var $btn = $(this),
					path = $btn.attr('data-href');
				if (!IX.isEmpty(path)) {
					document.location.href = path;
				}
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
		},
		// 加载View层所需模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_card')),
				tagTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_tags'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTag", Hualala.TplLib.get('tpl_shop_tags'));
			Handlebars.registerPartial("shopCard", Hualala.TplLib.get('tpl_shop_card'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl,
				tagTpl : tagTpl
			});
		},
		// 组装标签
		mapTags : function (d) {
			var self = this,
				tagKeys = 'areaName,cuisineName1,cuisineName2'.split(',');
			var tags = _.map(tagKeys, function (k) {
				return $XP(d, k, null);
			});
			return _.filter(tags, function (t) {
				return !IX.isEmpty(t);
			});
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var getTags = function (tags) {
				return _.map(tags, function (t, i, l) {
					return {
						clz : 'label-info',
						tag : t
					};
				});
			};
			var ret = _.map(data, function (shop, i, l) {
				var address = $XP(shop, 'address', ''),
					byteLen = Hualala.Common.strByteLength(address),
					slugAddr = '';
				slugAddr = byteLen < 72 ? address : (Hualala.Common.substrByte(address, 70) + '...');
				return {
					clz : '',
					id : $XP(shop, 'shopID', ''),
					name : $XP(shop, 'shopName', ''),
					img : Hualala.Common.getSourceImage($XP(shop, 'imagePath', ''), {
						width : 100,
						height : 100,
						quality : 50
					}),
					// tags : getTags($XP(shop, 'tags', [])),
					tags : getTags(self.mapTags(shop)),
					address : address,
					slugAddr : slugAddr,
					tel : $XP(shop, 'tel', ''),
					infoHref : Hualala.PageRoute.createPath('shopInfo', [$XP(shop, 'shopID', '')]),
					menuHref : Hualala.PageRoute.createPath('shopMenu', [$XP(shop, 'shopID', '')]),
					checked : $XP(shop, 'status') == 1 ? 'checked' : ''
				};
			});
			return {
				shopCard : {
					list : ret
				}
			};
		},
		// 渲染开关
		initSwitcher : function (selector) {
			var self = this;
			self.$list.find(selector).bootstrapSwitch({
				// baseClass : 'ix-bs-switch',
				// wrapperClass : 'ix-bs-switch-wrapper',
				size : 'normal',
				onColor : 'success',
				offColor : 'default',
				onText : '已开通',
				offText : '未开通'
			});
			// 绑定开关事件
			self.$list.find(selector).on('switchChange.bootstrapSwitch', function (e, state) {
				var $chkbox = $(this),
					shopID = $chkbox.attr('data-shop'),
					state = !state ? 0 : 1;
				Hualala.UI.Confirm({
					title : (state == 1 ? "开启" : "关闭") + "店铺",
					msg : "你确定要" + (state == 1 ? "开启" : "关闭") + "店铺？",
					okFn : function () {
						self.model.updateShopStatus(shopID, state, function (_shopID) {
							self.$list.find(selector).filter('[data-shop=' + _shopID + ']').bootstrapSwitch('toggleState', true);
						}, function (_shopID) {
							
						});
					},
					cancelFn : function () {
						self.$list.find(selector).filter('[data-shop=' + shopID + ']').bootstrapSwitch('toggleState', true);
					}
				});
			});
		},
		// 渲染view
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.emptyBar && self.emptyBar.destroy();
			self.$list.empty();
			if (shops.length == 0) {
				self.emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.emptyBar.show();
			} else {
				self.$list.html(html);
			}
			
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
			// self.$list.find(':checkbox[name*=switcher_]').bootstrapSwitch();
			self.initSwitcher(':checkbox[name=switcher]');
		}
	});

	Hualala.Shop.CardListView = CardListView;

	var ShopListView = CardListView.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 结果容器
			this.$resultBox = null;
			// 结果列表
			this.$list = null;
			// 分页容器
			this.$pager = null;
			this.emptyBar = null;
			// 开关相关提示消息
			this.shopBusinessSwitcherTipHT = new IX.IListManager();
			this.loadTemplates();
			this.initShopBusinessSwitcherTips();
		}
	});
	ShopListView.proto({
		bindEvent : function () {
			var self = this;
			self.$list.tooltip({
				selector : '[title]'
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
			// 弹出修改业务窗口
			self.$list.on('click', '.btn[data-business]', function (e) {
				var $btn = $(this),
					shopID = $btn.attr('data-shop'),
					mShop = self.model.getShopModelByShopID(shopID),
					businessName = $btn.attr('data-business'),
					businessID = $btn.attr('data-business-id'),
					serviceFeatures = mShop.get('serviceFeatures');
				self.initBusinessModal($btn, shopID, businessName, businessID, serviceFeatures);
			});
			self.$list.on('click', '.bind-settle', function (e) {
				var $btn = $(this),
					settleID = $btn.attr('data-id'),
					shopID = $btn.attr('data-shop');
				self.initBindSettleModal($btn, settleID, shopID);
			});
		},
		// 加载店铺业务开关相关的提示消息
		initShopBusinessSwitcherTips : function () {
			var self = this,
				tips = Hualala.TypeDef.ShopBusinessSwitcherTips;
			_.each(tips, function (tip) {
				var name = $XP(tip, 'name');
				self.shopBusinessSwitcherTipHT.register(name, tip);
			});
		},
		// 通过名字获取店铺业务开关相关提示信息
		getBusinessSwitcherTipsByName : function (name) {
			var self = this,
				ht = self.shopBusinessSwitcherTipHT;
			return ht.get(name);
		},
		// 加载View层所需模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_item')),
				tagTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_tags'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTag", Hualala.TplLib.get('tpl_shop_tags'));
			Handlebars.registerPartial("shopItem", Hualala.TplLib.get('tpl_shop_list_item'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl,
				tagTpl : tagTpl
			});
		},
		/**
		 * 获取店铺业务描述信息
		 * @param  {Int} businessID    业务ID(10:常规预订,11:闪吃,20:外送,21:到店自提,41:店内自助)
		 * @param  {Int} operationMode 餐厅运营模式 0：正餐；1：正餐
		 * @param  {Object} businessInfo  业务配置信息
		 * @param {String} businessName 业务名称
		 * @param {String} ShopID 店铺ID
		 * @return {String}               业务配置描述
		 */
		getBusinessDesc : function (businessID, operationMode, businessInfo, businessName, shopID) {
			var self = this;
			var tpl = null, renderKeys = null, params = null, htm = '';
			var minuteIntervalOpts = Hualala.TypeDef.MinuteIntervalOptions();
			var getMinutIntervalLabel = function (v) {
				var m = _.find(minuteIntervalOpts, function (el, i) {
					return $XP(el, 'value') == v;
				});
				return $XP(m, 'label', '');
			};
			var businessStatus = self.getBusinessSwitcherStatus(shopID, businessName),
				businessDesc = $XP(self.getBusinessSwitcherTipsByName(businessName), 'desc', '');
			switch(businessID) {
				// 常规预定点菜
				case 10:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_commonreserve_desc'));
					renderKeys = 'advanceTime,noticeTime,minAmount,reserveTableTime,reserveTableDesc,payMethod'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "advanceTime":
								r = IX.isEmpty(r) || r == 0 ? '不限制顾客提前预定时间, ' : ('顾客需提前' + getMinutIntervalLabel(r) + '预订, ');
								break;
							case "noticeTime":
								r = IX.isEmpty(r) || r == 0 ? '订单立即通知餐厅, ' : ('订单提前' + getMinutIntervalLabel(r) + '通知餐厅, ');
								break;
							case "minAmount":
								r = IX.isEmpty(r) || r == 0 ? '' : ('最低消费' + r + Hualala.Constants.CashUnit + ', ');
								break;
							case "reserveTableTime":
								r = IX.isEmpty(r) || r == 0 ? '' : ('留位' + getMinutIntervalLabel(r) + ', ');
								break;
							case "reserveTableDesc":
								r = IX.isEmpty(r) ? '' : r + ',';
								break;
							case "payMethod":
								r = (r == 0 ? '仅支持在线支付' : (r == 1 ? '仅支持线下支付' : '线上及线下支付均支持')) + ', ';
								break;
						}
						return r;
					});
					break;
				// 闪吃描述
				case 11:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_justeat_desc'));
					renderKeys = 'servicePeriods,holidayFlag,minAmount,advanceTime,noticeTime,reserveTableTime,reserveTableDesc,payMethod'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "servicePeriods" :
								r = '开放时间段：' + r.replace(',', '-').replace(/([\d]{2})([\d]{2})/g, '$1:$2') + ', ';
								break;
							case "holidayFlag" : 
								r = (r == 0 ? '工作日及节假日均开放' : (r == 1 ? '仅节假日开放' : '仅工作日开放')) + ', ';
								break;
							case "minAmount" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('最低消费' + r + Hualala.Constants.CashUnit + ', ');
								break;
							case "advanceTime" : 
								r = IX.isEmpty(r) || r == 0 ? '不限制顾客提前预定时间, ' : ('顾客需提前' + getMinutIntervalLabel(r) + '预订, ');
								break;
							case "noticeTime" : 
								r = IX.isEmpty(r) || r == 0 ? '订单立即通知餐厅, ' : ('订单提前' + getMinutIntervalLabel(r) + '通知餐厅, ');
								break;
							case "reserveTableTime" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('留位' + getMinutIntervalLabel(r) + ', ');
								break;
							case "reserveTableDesc" : 
								r = IX.isEmpty(r) ? '' : r + ',';
								break;
							case "payMethod":
								r = (r == 0 ? '仅支持在线支付' : (r == 1 ? '仅支持线下支付' : '线上及线下支付均支持')) + ', ';
								break;
						}
						return r;
					});
					break;
				// 店内自助描述
				case 41:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_spotorder_desc'));
					renderKeys = operationMode == 0 ?
						// 'isDinner,supportCommitToSoftware,payMethodAtShop,payBeforeCommit'.split(',') :
						'isDinner,supportCommitToSoftware,checkSpotOrder,payBeforeCommit'.split(',') :
						'isDinner,supportCommitToSoftware,fetchFoodMode'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "isDinner":
								r = operationMode == 0 ? true : false;
								break;
							case "supportCommitToSoftware":
								if (IX.isEmpty(r)) {
									r = '支持下单到餐饮软件, ';
								} else {
									r = (r == 1 ? '支持' : '不支持') + '下单到餐饮软件, ';
								}
								break;
							case "fetchFoodMode":
								r = '下单后' + (r == 1 ? '凭牌号' : (r == 2 ? '直接' : '凭流水号')) + '在收银台取餐, ';
								break;
							case "checkSpotOrder":
								r = (r == 1 ? '支持' : '不支持') + '顾客通过手机结账, ';
								break;
							case "payMethodAtShop":
								r = (r == 1 ? '餐前先通过手机结账' : (r == 2 ? '餐后可通过手机结账' : '不能用手机结账')) + ', ';
								break;
							case "payBeforeCommit":
								// r = r == 1 ? '支付完成后才能下单, ' : '';
								r = (r == 1 ? '餐前' : '餐后') + '结账, ';
								break;
						}
						return r;
					});
					break;
				// 外卖
				case 20:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_takeaway_desc'));
					renderKeys = 'servicePeriods,holidayFlag,noticeTime,takeawayDeliveryTime,minAmount,serviceAmount,freeServiceAmount,takeawayScope,payMethod'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "servicePeriods" :
								r = '开放时间段：' + r.replace(',', '-').replace(/([\d]{2})([\d]{2})/g, '$1:$2') + ', ';
								break;
							case "holidayFlag" : 
								r = (r == 0 ? '工作日及节假日均开放' : (r == 1 ? '仅节假日开放' : '仅工作日开放')) + ', ';
								break;
							case "noticeTime" : 
								r = IX.isEmpty(r) || r == 0 ? '订单立即通知餐厅, ' : ('订单提前' + getMinutIntervalLabel(r) + '通知餐厅, ');
								break;
							case "takeawayDeliveryTime" :
								r = IX.isEmpty(r) || r == 0 ? '立即送达, ' : ('预计' + r + '分钟送达, ');
								break;
							case "minAmount":
								r = (IX.isEmpty(r) || r == 0 ? 0 : r) + '元起送, ';
								break;
							case "serviceAmount" :
								r = IX.isEmpty(r) || r == 0 ? '免费送餐, ' : (r + '元送餐费');
								break;
							case "freeServiceAmount" :
								r = IX.isEmpty(r) || r == 0 ? '' : ('(满' + r + '元免送餐费), ');
								break;
							case "takeawayScope" :
								r = IX.isEmpty(r) || r == 0 ? '' : ('送餐范围' + r + '公里, ');
								break;
							case "payMethod":
								r = (r == 0 ? '仅支持在线支付' : (r == 1 ? '仅支持线下支付' : '线上及线下支付均支持')) + ', ';
								break;
						}
						return r;
					});
					break;
				// 自提
				case 21:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_takeout_desc'));
					renderKeys = 'servicePeriods,holidayFlag,advanceTime,noticeTime,minAmount,payMethod'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "servicePeriods" :
								r = '开放时间段：' + r.replace(',', '-').replace(/([\d]{2})([\d]{2})/g, '$1:$2') + ', ';
								break;
							case "holidayFlag" : 
								r = (r == 0 ? '工作日及节假日均开放' : (r == 1 ? '仅节假日开放' : '仅工作日开放')) + ', ';
								break;
							case "advanceTime":
								r = IX.isEmpty(r) || r == 0 ? '不限制顾客提前预定时间, ' : ('顾客需提前' + getMinutIntervalLabel(r) + '预订, ');
								break;
							case "noticeTime" : 
								r = IX.isEmpty(r) || r == 0 ? '订单立即通知餐厅, ' : ('订单提前' + getMinutIntervalLabel(r) + '通知餐厅, ');
								break;
							case "minAmount" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('最低消费' + r + Hualala.Constants.CashUnit + ', ');
								break;
							case "payMethod":
								r = (r == 0 ? '仅支持在线支付' : (r == 1 ? '仅支持线下支付' : '线上及线下支付均支持')) + ', ';
								break;
						}
						return r;
					});
					break;
			}
			if (businessID == 11 || businessID == 41 || businessID == 10 || businessID == 20 || businessID == 21) {
				htm = tpl(_.object(renderKeys, params));
				htm = htm.slice(0, htm.lastIndexOf(','));
				htm = businessStatus == 1 ? htm : businessDesc
			} else {
				htm = businessDesc;
			}

			return htm;
		},
		// 获取店铺业务状态
		// @param name 店铺业务名称
		getBusinessSwitcherStatus : function (shopID, name) {
			var self = this,
				mShop = self.model.getShopModelByShopID(shopID);
			var serviceFeatures = mShop.get('serviceFeatures') || '';
			return serviceFeatures.indexOf(name) >= 0 ? 1 : 0;
		},
		// 获取店铺业务信息数据
		getShopBusiness : function (shop) {
			var self = this;
			var business = Hualala.TypeDef.ShopBusiness,
				businessHT = new IX.IListManager(),
				shopID = $XP(shop, 'shopID'),
				serviceFeatures = $XP(shop, 'serviceFeatures', ''),
				// businessCfg = JSON.parse($XP(shop, 'revParamJson', {})),
				businessCfg = null,
				revParamJson = $XP(shop, 'revParamJson', null),
				takeawayParamJson = $XP(shop, 'takeawayParamJson', null);
			revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
			takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
			businessCfg = IX.inherit(revParamJson, takeawayParamJson);
			var ret = null;
			_.each(business, function (item, i, l) {
				var id = $XP(item, 'id'), name = $XP(item, 'name'),
					switcherStatus = self.getBusinessSwitcherStatus(shopID, name),
					businessInfo = $XP(businessCfg, id.toString(), {}),
					operationMode = $XP(shop, 'operationMode', null);
				if (id == '41') {
					businessInfo = IX.inherit(businessInfo, {
						checkSpotOrder : serviceFeatures.indexOf('spot_pay') >= 0 ? 1 : 0
					});
				}
				var ret = IX.inherit(item, businessInfo, {
					switcherStatus : switcherStatus,
					shopID : shopID,
					desc : self.getBusinessDesc(id, operationMode, businessInfo, name, shopID)
				});
				businessHT.register(name, ret);
			});
			ret = _.filter(businessHT.getAll(), function (el) {
				return $XP(el, 'businessIsSupported', false) == true;
			});
			return ret;
		},
		// 获取店铺业务信息渲染数据
		mapBusinessRenderData : function (shop) {
			var self = this,
				data = self.getShopBusiness(shop);
			return _.map(data, function (el) {
				var name = $XP(el, 'name'),
					icon = 'icon-' + name,
					switcherName = 'switcher_business',
					open = $XP(el, 'switcherStatus') == 1 ? 'checked' : '';
				return {
					icon : icon,
					label : $XP(el, 'label'),
					switcherName : switcherName,
					shopID : $XP(el, 'shopID'),
					type : name,
					id : $XP(el, 'id'),
					open : open,
					desc : $XP(el, 'desc', ''),
					serviceFeatures : $XP(shop, 'serviceFeatures', ''),
					hideBtn : (name == 'bi' || name == 'crm') ? 'disabled hidden' : ''
				};
			});
		},
		// 校验是否有财务或更高权限
		chkHasAccountRole : function () {
			var loginUsr = Hualala.getSessionUser(),
				usrRoles = $XP(loginUsr, 'role');
				roles = Hualala.TypeDef.SiteRoleType;
			var ret = _.find(roles, function (role) {
				var roleType = $XP(role, 'roleType');
				var matchedID = _.find(usrRoles, function (v) {
					return $XP(role, 'roleType') == v;
				});
				return !!matchedID && (roleType != 'manager');
			});
			return !!ret;
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (shop, i, l) {
				var settleUnitID = $XP(shop, 'settleID', '');
				return {
					clz : '',
					shopID : $XP(shop, 'shopID', ''),
					shopName : $XP(shop, 'shopName', ''),
					hideAccount : self.chkHasAccountRole() ? true : false,
					settleID : settleUnitID,
					settleName : $XP(shop, 'settleName', ''),
					btn : {
						clz : 'bind-settle',
						label : (IX.isEmpty(settleUnitID) || settleUnitID == 0) ? '绑定结算账户' : '修改'
					},
					switcherName : 'switcher_status',
					shopOpen : $XP(shop, 'status') == 1 ? 'checked' : '',
					business : self.mapBusinessRenderData(shop)
				}
			});
			return {
				shopItem : {
					list : ret
				}
			};
		},
		// 渲染开关
		initSwitcher : function (switcherName) {
			var self = this;
			var $switchers = self.$list.find(':checkbox[name=' + switcherName + ']');
			var changeSubSwitchersStatus = function () {
				$switchers.each(function (idx, el) {
					var $el = $(el),
						shopID = $el.attr('data-shop'),
						$parentSwitcher = $(':checkbox[name=switcher_status][data-shop=' + shopID + ']'),
						checked = $parentSwitcher[0].checked;
					$el.bootstrapSwitch('disabled', !checked ? true : false);
				});
			};
			$switchers.bootstrapSwitch({
				// baseClass : 'ix-bs-switch',
				// wrapperClass : 'ix-bs-switch-wrapper',
				size : 'normal',
				onColor : switcherName == 'switcher_business' ? 'primary' : 'success',
				offColor : 'default',
				onText : '已开通',
				offText : '未开通'
			});
			if (switcherName == 'switcher_business') {
				changeSubSwitchersStatus();
			}
			$switchers.on('switchChange.bootstrapSwitch', function (e, state) {
				var $chkbox = $(this), name = $chkbox.attr('name'), shopID = $chkbox.attr('data-shop'),
					state = !state ? 0 : 1, business = $chkbox.attr('data-business'), businessID = $chkbox.attr('data-business-id');
				if (name == 'switcher_status') {
					Hualala.UI.Confirm({
						title : (state == 1 ? "开启" : "关闭") + "店铺",
						msg : "你确定要" + (state == 1 ? "开启" : "关闭") + "店铺？",
						okFn : function () {
							self.model.updateShopStatus(shopID, state, function (_shopID) {
								var $switcherEl = self.$list.find(':checkbox[name=' + switcherName + ']').filter('[data-shop=' + _shopID + ']'),
									$subSwitchers = self.$list.find(':checkbox[name=switcher_business]').filter('[data-shop=' + _shopID + ']');
								$switcherEl.bootstrapSwitch('toggleState', true);
								$subSwitchers.bootstrapSwitch('disabled', state == 0 ? false : true);
							}, function (_shopID) {
								var $switcherEl = self.$list.find(':checkbox[name=' + switcherName + ']').filter('[data-shop=' + _shopID + ']'),
									$subSwitchers = self.$list.find(':checkbox[name=switcher_business]').filter('[data-shop=' + _shopID + ']');
								$subSwitchers.bootstrapSwitch('disabled', state == 0 ? true : false);
							});
						},
						cancelFn : function () {
							$chkbox.bootstrapSwitch('toggleState', true);
						}
					});
					
				} else {
					var businessSwitcherTip = self.getBusinessSwitcherTipsByName(business),
						title = (state == 1 ? '开启' : '关闭') + $XP(businessSwitcherTip, 'title', ''),
						msg = $XP(businessSwitcherTip, (state == 1 ? 'switchOn' : 'switchOff'), '');
					Hualala.UI.Confirm({
						title : title,
						msg : msg,
						// okLabel : '',
						okFn : function () {
							self.model.updateShopBusinessStatus({
								shopID : shopID,
								name : business,
								id : businessID,
								status : state
							}, function (params) {
								self.$list.find(':checkbox[name=' + switcherName + ']').filter('[data-shop=' + $XP(params, 'shopID') + '][data-business-id=' + $XP(params, 'id') + ']')
									.bootstrapSwitch('toggleState', true);
							}, function (params) {
								var mShop = $XP(params, 'mShop'), serviceID = $XP(params, 'id'), businessName = $XP(params, 'name'),
									shop = mShop.getAll(), businessData = self.getShopBusiness(shop);
								var curBusinessData = _.find(businessData, function (el) {return el.name == businessName;});
								var desc = $XP(curBusinessData, 'desc', '');

								$chkbox.parents('.shop-business').find('.desc').html(desc);
							});
						},
						cancelFn : function () {
							$chkbox.bootstrapSwitch('toggleState', true);
						}
					});
					
				}
			});

		},
		// 渲染开关
		// initSwitcher : function (selector) {
		// 	var self = this;
		// 	self.$list.find(selector).bootstrapSwitch({
		// 		// baseClass : 'ix-bs-switch',
		// 		// wrapperClass : 'ix-bs-switch-wrapper',
		// 		size : 'normal',
		// 		onColor : selector == ':checkbox[name=switcher_business]' ? 'primary' : 'success',
		// 		offColor : 'default',
		// 		onText : '已开通',
		// 		offText : '未开通'
		// 	});
		// 	// 绑定开关事件
		// 	self.$list.find(selector).on('switchChange.bootstrapSwitch', function (e, state) {
		// 		var $chkbox = $(this),
		// 			name = $chkbox.attr('name'),
		// 			shopID = $chkbox.attr('data-shop'),
		// 			state = !state ? 0 : 1,
		// 			business = $chkbox.attr('data-business'),
		// 			businessID = $chkbox.attr('data-business-id');
		// 		if (name == 'switcher_status') {
		// 			self.model.updateShopStatus(shopID, state, function (_shopID) {
		// 				self.$list.find(selector).filter('[data-shop=' + _shopID + ']').bootstrapSwitch('toggleState', true);
		// 			});
		// 		} else {
		// 			self.model.updateShopBusinessStatus({
		// 				shopID : shopID,
		// 				name : business,
		// 				id : businessID,
		// 				status : state
		// 			}, function (params) {
		// 				self.$list.find(selector).filter('[data-shop=' + $XP(params, 'shopID') + '][data-business-id=' + $XP(params, 'id') + ']')
		// 					.bootstrapSwitch('toggleState', true);
		// 			});
		// 		}
				
		// 	});
		// },
		// 渲染view
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.emptyBar && self.emptyBar.destroy();
			self.$list.empty();
			if (shops.length == 0) {
				self.emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.emptyBar.show();
			} else {
				self.$list.html(html);
			}
			
			
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
			// self.$list.find(':checkbox[name*=switcher_]').bootstrapSwitch();
			// self.initSwitcher(':checkbox[name=switcher_business]');
			// self.initSwitcher(':checkbox[name=switcher_status]');
			self.initSwitcher('switcher_business');
			self.initSwitcher('switcher_status');
		},
		// 生成业务编辑窗口
		initBusinessModal : function (trigger, shopID, name, id, serviceFeatures) {
			var self = this;
			var editView = new Hualala.Setting.editServiceView({
				triggerEl : trigger,
				serviceID : id,
				serviceName : name,
				serviceFeatures : serviceFeatures,
				model : self.model.getShopModelByShopID(shopID),
				successFn : function (mShop, serviceID, businessInfo, $trigger) {
					var operationMode = mShop.get('operationMode'),
						businessName = $trigger.attr('data-business'),
						shopID = $trigger.attr('data-shop'),
						desc = self.getBusinessDesc(parseInt(serviceID), operationMode, businessInfo, businessName, shopID);

					$trigger.parents('.shop-business').find('.desc').html(desc);

				}
			});
		},
		// 生成绑定结算账号窗口
		initBindSettleModal : function (trigger, settleID, shopID) {
			var self = this;
			var view = new Hualala.Setting.bindSettleUnitView({
				triggerEl : trigger,
				settleID : settleID,
				model : self.model.getShopModelByShopID(shopID),
				successFn : function (mShop, $trigger, settleInfo) {
					var settleUnitID = $XP(settleInfo, 'settleUnitID'),
						settleUnitName = $XP(settleInfo, 'settleUnitName', '');
					$trigger.attr('data-id', settleUnitID);
					$trigger.parent().find('.account-name').html(settleUnitName);
					mShop.set({
						settleID : settleUnitID,
						settleName : settleUnitName
					})
				}
			});
		}
	});
	Hualala.Shop.ShopListView = ShopListView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	var ShopListModel = Hualala.Shop.ShopListModel;
	var ShopListView = Hualala.Shop.ShopListView;
	var ShopListController = Stapes.subclass({
		/**
		 * 店铺结果列表控制器
		 * @param  {Object} cfg 配置参数
		 *          @param {JQueryObj} container 容器
		 *          @param {Object} view  店铺结果的View模块实例
		 *          @param {Object} model 店铺结果的数据模块实例
		 * @return {Object}     
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null),
			this.model = $XP(cfg, 'model', null);
			if (!this.view || !this.model || !this.container) {
				throw("Shop List init faild!!");
			}
			this.isReady = false;
			this.bindEvent();
		}
	});
	ShopListController.proto({
		init : function (params) {
			this.model.init(params);
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.loadingModal = new LoadingModal({
				start : 100
			});
			this.isReady = true;
		},
		hasReady : function () {return this.isReady;},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					self.model.emit('load', params);
				}
			}, this);
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						self.loadingModal.hide();
					};
					self.loadingModal.show();
					self.model.load(params, cbFn);
				},
				// "update:totalSize" : function (v) {
				// 	var self = this;
				// 	self.view.initPager({
				// 		total : self.get('totalSize'),
				// 		page : self.get('pageNo')
				// 	});
				// }
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				},
				reloadPager : function (params) {
					var self = this;
					self.view.initPager(params);
				}
			}, this);
		}
	});
	Hualala.Shop.ShopListController = ShopListController;
})(jQuery, window);;
;(function($) 
{
	var defaults = {
            data : {
                isSearchMap: false,
                keyword: '',
                shopName: '',
                tel: '',
                address: '',
                city: '',
                area: '',
                lng: '',
                lat: ''
            },
            searchBox: '.search-box',
            mapResult: '.map-result',
            //mapContainer: '#shopMap',
            mapCanvasId: 'mapCanvas',
            load: function() { },
            serach: function() { }
        };
	function ShopMap(options)
    {
        this.cfg = $.extend({}, defaults, options);
        //this.$shopMap = $(mapContainer);
        this.sContent = '';
        this.$searchBox = $(this.cfg.searchBox);
        this.$mapResult = $(this.cfg.mapResult);
        this.map = '';
        this.mapPoint = {};
        this.isAreaSearched = false;
    }
	ShopMap.prototype = 
    {
        init: function()
        {
            var self = this,
                markerTrick = false,
                mapParams = self.cfg.data;
            self.map = new BMap.Map(self.cfg.mapCanvasId);
            //添加默认缩放平移控件
            self.map.addControl(new BMap.NavigationControl());
            self.map.enableScrollWheelZoom();
            self.sContent = [
                '<dl class="map-shop-info">',
                    '<dt>' + mapParams.shopName + '</dt>',
                    '<dd>',
                        '<p><span>电话：</span>' + mapParams.tel + '</p>',
                        '<p><span>地址：</span>' + mapParams.address + '</p>',
                    '</dd>',
                '</dl>'
            ].join('');
            
            self[(mapParams.isSearchMap || !mapParams.lng || !mapParams.lat ? 'search' : 'load') + 'Map'](mapParams);
            
            if(self.$searchBox[0])
            {
                var $keyword = self.$searchBox.find('.map-keyword'),
                    $searchBtn = self.$searchBox.find('.map-search-btn'),
                    searchParams = $.extend({}, self.cfg.data);
                $searchBtn.on('click', function ()
                {
                    searchParams.keyword = $.trim($keyword.val());
                    self.searchMap(searchParams);
                });
            }
            
            
            return this;
        },
        loadMap: function(data)
        {
            var self = this;
            data = data || self.cfg.data;
            self.map.centerAndZoom(new BMap.Point(data.lng, data.lat), 14);
            self.map.enableScrollWheelZoom();

            var marker = new BMap.Marker(new BMap.Point(data.lng, data.lat), 
                {
                    enableMassClear: true,
                    raiseOnDrag: true
                });
            marker.enableDragging();
            self.map.addOverlay(marker);
            marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
           /* map.addEventListener("click", function(e){
                if(!(e.overlay)){
                    map.clearOverlays();
                    marker.show();
                    map.addOverlay(marker);
                    marker.setPosition(e.point);
                    setResult(e.point.lng, e.point.lat);
                }
            });*/
            marker.addEventListener("click", function(e)
            {
                 marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
            });
            marker.addEventListener("dragend", function(e)
            {
                self.setResult(e.point.lng, e.point.lat);
            });
            self.setResult(data.lng, data.lat);
        },
        searchMap : function (data)
        {
            var self = this;
            data = data || self.cfg.data;
            //self.map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
            //self.map.enableScrollWheelZoom();
                
            var local = new BMap.LocalSearch(self.map, {
                renderOptions: {map: self.map},
                pageCapacity: 1,
                onInfoHtmlSet : function (poi) {
                    poi.marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
                    //target.openInfoWindow(infoWindow);
                },
                onMarkersSet : function (poi) {
                    //console.info(poi.marker.infoWindow);
                }
            });
            
            local.search(data.keyword || data.address || data.area || data.city);
            
            local.setSearchCompleteCallback(function(results)
            {
                if(local.getStatus() !== BMAP_STATUS_SUCCESS)
                {
                    Hualala.UI.Alert({msg: '抱歉，百度地图未搜到您要查询的精确位置，现为您显示该位置所在的城市或区域，您可以通过移动地图上的标记来精确定位要查询的位置。'});
                    if(!self.isAreaSearched)
                    {
                        self.isAreaSearched = true;
                        local.search(data.area);
                    }
                    else
                    {
                        local.search(data.city);
                    }
                }
            });
            local.setMarkersSetCallback(function(pois)
            {
                for(var i = pois.length; i--;)
                {
                    var marker = pois[i].marker;
                    marker.enableDragging();
                    self.setResult(marker.point.lng, marker.point.lat);
                    //var mapParams = {
                    //  width : 250,     // 信息窗口宽度
                    //  height: 100,     // 信息窗口高度
                    //  title : "Hello"  // 信息窗口标题
                    //}
                    //var infoWindow = new BMap.InfoWindow("World", mapParams);  // 创建信息窗口对象
                    //map.openInfoWindow(infoWindow,point); //开启信息窗口
                    marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
                    marker.addEventListener("click", function(e)
                    {
                       // markerTrick = true;
                        var pos = this.getPosition();
                        self.setResult(pos.lng, pos.lat);
                    });
                    marker.addEventListener("dragend", function(e)
                    {
                        self.setResult(e.point.lng, e.point.lat);
                    });
                }
            });
            
        },
         /*
         * setResult : 定义得到标注经纬度后的操作
         * 请修改此函数以满足您的需求
         * lng: 标注的经度
         * lat: 标注的纬度
         */
        setResult: function (lng, lat)
        {
            var self = this;
            self.mapPoint = { lng: lng, lat: lat };
            self.$mapResult[0] && self.$mapResult.html('您店铺的经度：' + lng + '    纬度： ' + lat);
        }
	}
    IX.ns("Hualala.Shop");
    Hualala.Shop.map = function(options) 
    { 
        return new ShopMap(options).init(); 
    };
}(jQuery));






;(function ($, window) {
IX.ns('Hualala.Shop');
var G = Hualala.Global,
    U = Hualala.UI,
    topTip = U.TopTip;
// 初始化创建店铺页面
Hualala.Shop.initCreate = function ($wizard)
{
    
    //初始化向导控件
    $wizard.bootstrapWizard();
    var bsWizard = $wizard.data('bootstrapWizard'),
        $step1 = $wizard.find('#tab1'),
        $step2 = $wizard.find('#tab2'),
        $step3 = $wizard.find('#tab3'),
        $city = $step1.find('#cityID'),
        $area = $step1.find('#areaID'),
        $cuisine1 = $step1.find('#cuisineID1'),
        $cuisine2 = $step1.find('#cuisineID2'),
        bv = null,
        operationModeType = Hualala.Shop.Typedef.operationMode;
    
    U.fillSelect($step1.find('#operationMode'), operationModeType);
    // 初始化城市列表下拉框
    initCities($city);
    U.createChosen($area, [], 1, 1, { width: '100%', placeholder_text : "请先选择或输入所在城市", }, false);
    U.createChosen($cuisine1, [], 1, 1, { width: '100%', placeholder_text : "请先选择或输入所在城市", }, false);
    U.createChosen($cuisine2, [], 1, 1, { width: '100%', placeholder_text : "请先选择或输入所在城市", }, false);
    
    // 根据所选择的城市设置地标、菜系下拉列表
    $city.on('change', function ()
    {
        var cityID = $(this).val();
        if(!cityID) return;
        
        initAreas($area, cityID);
        initCuisines($cuisine1, $cuisine2, cityID);
        
    });
    // 初始化timepicker
    $step1.find('#openingHoursStart, #openingHoursEnd').timepicker({
        minuteStep: 1,
        showMeridian: false,
        disableFocus : true,
        showInputs : false
    });
    // 初始化表单验证
    $step1.bootstrapValidator({
        excluded: ':disabled',
        fields: {
            shopName: {
                message: '店铺名无效',
                validators: {
                    notEmpty: {
                        message: '店铺名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 100,
                        message: '店铺名长度必须在2到100个字符之间'
                    }
                }
            },
            cityID: {
                validators: { notEmpty: { message: '请选择店铺所在城市' } }
            },
            tel: {
                validators: {
                    notEmpty: { message: '店铺电话不能为空' },
                    telOrMobile: { message: '' }
                }
            },
            address: {
                validators: {
                    notEmpty: { message: '店铺地址不能为空' },
                    stringLength: {
                        min: 1,
                        max: 80,
                        message: '店铺地址不能超过80个字符'
                    }
                }
            },
            PCCL: {
                validators: {
                    notEmpty: { message: '人均消费不能为空' },
                    numeric: { message: '人均消费必须是金额数字' }
                }
            },
            operationMode: {
                validators: {
                    notEmpty: { message: '请选择店铺运营模式' }
                }
            },
            openingHoursStart: {
                validators: {
                    notEmpty: { message: '每天营业开始时间不能空' },
                    time: { message: '' }
                }
            },
            openingHoursEnd: {
                validators: {
                    notEmpty: { message: '每天营业结束时间不能空' },
                    time: {
                        message: '',
                        startTimeField: 'openingHoursStart'
                    }
                }
            },
            areaID: {
                validators: {
                    notEmpty: { message: '请选择店铺所在地标' }
                }
            },
            cuisineID1: {
                validators: {
                    notEmpty: { message: '请选择菜系1' }
                }
            }
        }
    });
    bv = $step1.data('bootstrapValidator');
    
    var $uploadImg = $step1.find('#uploadImg'),
        imagePath = ''; // 门头图图片路径
    $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
    // 上传门头图
    $uploadImg.find('button, img').on('click', function()
    {
        U.uploadImg({
            onSuccess: function (imgPath, $dlg)
            {
                var src = G.IMAGE_RESOURCE_DOMAIN + '/' + imgPath + '?quality=70';
                imagePath = imgPath;
                $uploadImg.find('img').attr('src', src);
                $dlg.modal('hide');
            }
        });
    });
    //bsWizard.show(1);
    var dataStep1 = null, // 第一步店铺基本信息数据
        map = null, // 地图组件实例
        shopID = '',
        $searchBox = $step2.find('.map-search-box'),
        $shopSettingLink = $step3.find('#shopSettingLink');
    // 向导组件的下一步行为控制
    $wizard.find('#nextStep').on('click', function()
    {
        var $curStep = bsWizard.activePane();
        // 第一步
        if($curStep.is('#tab1'))
        {
            //$select.blur();
            if(!bv.validate().isValid()) return;
            // 数据提交前预处理
            dataStep1 = Hualala.Common.parseForm($step1);
            dataStep1.shopID = shopID;
            dataStep1.shopName = dataStep1.shopName.replace('（', '(').replace('）', ')');
            dataStep1.areaName = getSelectText($area);
            dataStep1.cuisineName1 = getSelectText($cuisine1);
            dataStep1.cuisineName2 = dataStep1.cuisineID2 ? getSelectText($cuisine2) : '';
            dataStep1.imagePath = imagePath;
            dataStep1.openingHours = dataStep1.openingHoursStart + '-' + dataStep1.openingHoursEnd;
            var keywords = [dataStep1.shopName, dataStep1.address, dataStep1.cuisineName1];
            dataStep1.cuisineName2 && keywords.push(dataStep1.cuisineName2);
            keywords.push(dataStep1.areaName);
            dataStep1.keywordLst = keywords.join(' | ');
            // 根据店铺是否已经产生调用不同的服务
            var callServer = shopID ? G.updateShopBaseInfo : G.createShop;
            callServer(dataStep1, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                shopID = shopID || rsp.data.records[0].shopID;
                $step3.find('h4 span').eq(1).text(dataStep1.shopName);
                $shopSettingLink.attr('href', Hualala.PageRoute.createPath('setting'));
                // 进入第二步标注地图
                bsWizard.next();
                // 地图对象必须在第二步面板显示出来后初始化
                map = Hualala.Shop.map({data: {
                    isSearchMap: true,
                    shopName: dataStep1.shopName,
                    tel: dataStep1.tel,
                    address: dataStep1.address,
                    area: dataStep1.areaName,
                    city: getSelectText($city)
                }, searchBox: $searchBox});
                
            });
            
            return;
        }
        // 第二步
        if($curStep.is('#tab2'))
        {
            var lng = map.mapPoint.lng, lat = map.mapPoint.lat,
                mapInfo = {
                    shopID: shopID,
                    mapLongitudeValue: lng,
                    mapLatitudeValue: lat,
                    mapLongitudeValueBaiDu: lng,
                    mapLatitudeValueBaiDu: lat
                };
            var callServer = G.setShopMap;
            callServer(mapInfo, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
            });
        }
        bsWizard.next();
    });
    
}
// 初始化菜系下拉列表
function initCuisines($cuisine1, $cuisine2, cityID)
{
    G.getCuisines({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        $cuisine1.siblings('.chosen-container').remove();
        U.createChosen($cuisine1.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%' }, { cuisineID: '', cuisineName: '--请选择--' }).blur().change(function(){ $(this).blur() });
        $cuisine2.siblings('.chosen-container').remove();
        U.createChosen($cuisine2.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%' }, { cuisineID: '', cuisineName: '--不限--' }).blur().change(function(){ $(this).blur() });
    });
    
}
// 初始化地标下拉列表
function initAreas($selectBox, cityID)
{
    G.getAreas({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        $selectBox.siblings('.chosen-container').remove();
        U.createChosen($selectBox.show().data('chosen', null), rsp.data.records || [], 'areaID', 'areaName', { width: '100%' }, { areaID: '', areaName: '--请选择--' })
        .blur().change(function(){ $(this).blur() });
    });
    
}
// 初始化城市下拉列表
function initCities($selectBox)
{
    G.getCities({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        U.createChosen($selectBox, rsp.data.records || [], 'cityID', 'cityName', { width: '100%' }, { cityID: '', cityName: '--请选择--' })
        .change(function(){ $(this).blur() });
    });
    
}

// 处理并获取下拉列表当前选择项的文本
function getSelectText($select)
{
    return $select.find('option:selected').text().replace(/-/g, '');
}

})(jQuery, window);










;(function ($, window) {
IX.ns('Hualala.Shop');
var G = Hualala.Global,
    U = Hualala.UI,
    S = Hualala.Shop,
    topTip = U.TopTip,
    parseForm = Hualala.Common.parseForm;
// 初始化店铺店铺详情页面
S.initInfo = function ($container, pageType, params)
{
    if(!params) return;
    // 渲染店铺功能导航
    var $shopFuncNav = S.createShopFuncNav(pageType, params, $container);
    
    var shopID = params, shopInfo = null,
        operationModeType = Hualala.Shop.Typedef.operationMode,
        $form = null, $city = null, $area = null, 
        $cuisine1 = null, $cuisine2 = null,
        imagePath = '', $img = null,
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        bv = null, map = null;
    
    G.getShopInfo({shopID : shopID}, function (rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        shopInfo = rsp.data.records[0];
        
        // 渲染店铺详情头部
        S.createShopInfoHead(shopInfo, $container, function($shopInfoHead)
        {
            $shopFuncNav.before($shopInfoHead);
        });
        
        var openTime = shopInfo.openingHours.split('-');
        shopInfo.openingHoursStart = openTime[0];
        shopInfo.openingHoursEnd = openTime[1];
        shopInfo.operationModeName = operationModeType[shopInfo.operationMode];
        
        var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_info'));
        $form = $(tpl(shopInfo)).appendTo($container);
        $city = $form.find('#cityID'),
        $area = $form.find('#areaID'),
        $cuisine1 = $form.find('#cuisineID1'),
        $cuisine2 = $form.find('#cuisineID2');
        
        U.fillSelect($form.find('#operationMode'), operationModeType).val(shopInfo.operationMode);
        // 初始化城市列表下拉框
        $city.on('change', function (e, areaID, cuisineID1, cuisineID2)
        {
            var cityID = $(this).val();
            if(!cityID) return;
            
            initAreas($area, cityID, areaID);
            initCuisines($cuisine1, $cuisine2, cityID, cuisineID1, cuisineID2);
        });
        initCities($city, shopInfo);
        // 根据所选择的城市设置地标、菜系下拉列表
        
        // 初始化timepicker
        $form.find('#openingHoursStart, #openingHoursEnd').timepicker({
            minuteStep: 1,
            showMeridian: false,
            disableFocus : true,
            showInputs : false
        });
        // 初始化表单验证
        $form.bootstrapValidator({
            excluded: ':disabled',
            fields: {
                shopName: {
                    message: '店铺名无效',
                    validators: {
                        notEmpty: {
                            message: '店铺名不能为空'
                        },
                        stringLength: {
                            min: 2,
                            max: 100,
                            message: '店铺名长度必须在2到100个字符之间'
                        }
                    }
                },
                cityID: {
                    validators: { notEmpty: { message: '请选择店铺所在城市' } }
                },
                tel: {
                    validators: {
                        notEmpty: { message: '店铺电话不能为空' },
                        telOrMobile: { message: '' }
                    }
                },
                address: {
                    validators: {
                        notEmpty: { message: '店铺地址不能为空' },
                        stringLength: {
                            min: 1,
                            max: 80,
                            message: '店铺地址不能超过80个字符'
                        }
                    }
                },
                PCCL: {
                    validators: {
                        notEmpty: { message: '人均消费不能为空' },
                        numeric: { message: '人均消费必须是金额数字' }
                    }
                },
                operationMode: {
                    validators: {
                        notEmpty: { message: '请选择店铺运营模式' }
                    }
                },
                openingHoursStart: {
                    validators: {
                        notEmpty: { message: '每天营业开始时间不能空' },
                        time: { message: '' }
                    }
                },
                openingHoursEnd: {
                    validators: {
                        notEmpty: { message: '每天营业结束时间不能空' },
                        time: {
                            message: '',
                            startTimeField: 'openingHoursStart'
                        }
                    }
                },
                areaID: {
                    validators: {
                        notEmpty: { message: '请选择店铺所在地标' }
                    }
                },
                cuisineID1: {
                    validators: {
                        notEmpty: { message: '请选择菜系1' }
                    }
                }
            }
        }).on('submit', function(){ return false });
        bv = $form.data('bootstrapValidator');
        
        var $uploadImg = $form.find('#uploadImg');
        $img = $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
        imagePath = shopInfo.imagePath;
        imagePath && $img.attr('src', imgHost + imagePath + '?quality=70');

        map = S.map({data: {
            isSearchMap: false,
            shopName: shopInfo.shopName,
            tel: shopInfo.tel,
            address: shopInfo.address,
            area: shopInfo.areaName,
            city: shopInfo.cityName,
            lng: shopInfo.mapLongitudeValueBaiDu,
            lat: shopInfo.mapLatitudeValueBaiDu
        }});
        
    });
    // click 事件 delegate
    $container.on('click', function(e)
    {
        var $target = $(e.target);
        // 修改门头图
        if($target.is('.edit-mode #uploadImg img, .edit-mode #uploadImg a'))
        {
            U.uploadImg({
                onSuccess: function (imgPath, $dlg)
                {
                    imagePath = imgPath;
                    $img.attr('src', imgHost + imgPath);
                    $dlg.modal('hide');
                }
            });
        }
        // 重新标记地图
        if($target.is('#remarkMap'))
        {
            if(bv.isValidField('shopName') && bv.isValidField('tel') && bv.isValidField('address'))
            {
                var coords = map.mapPoint,
                    formData = parseForm($form); console.log(formData);
                map = S.map({data: {
                    isSearchMap: false,
                    shopName: formData.shopName,
                    tel: formData.tel,
                    address: formData.address,
                    area: getSelectText($area),
                    city: getSelectText($city),
                    lng: coords.lng,
                    lat: coords.lat
                }});
                
                var mapInfo = {
                        shopID: shopID,
                        mapLongitudeValue: coords.lng,
                        mapLatitudeValue: coords.lat,
                        mapLongitudeValueBaiDu: coords.lng,
                        mapLatitudeValueBaiDu: coords.lat
                    };
                // 标注店铺地图callServer调用
                G.setShopMap(mapInfo, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    topTip({msg: '重新标记地图成功！', type: 'success'});
                    
                });
                
            }
            else
            {
                topTip({msg: '店铺相关信息填写有误！', type: 'danger'});
            }
            
        }
        // 切换为编辑模式
        if($target.is('#editBtn'))
        {
            $form.removeClass('read-mode').addClass('edit-mode');
        }
        // 保存店铺基本信息修改
        if($target.is('#saveBtn'))
        {
            if(!bv.validate().isValid()) return;
            // 数据提交前预处理
            var shopData = parseForm($form);
            shopData.shopID = shopID;
            shopData.shopName = shopData.shopName.replace('（', '(').replace('）', ')');
            shopData.areaName = getSelectText($area);
            shopData.cuisineName1 = getSelectText($cuisine1);
            shopData.cuisineName2 = shopData.cuisineID2 ? getSelectText($cuisine2) : '';
            shopData.imagePath = imagePath;
            shopData.openingHours = shopData.openingHoursStart + '-' + shopData.openingHoursEnd;
            var keywords = [shopData.shopName, shopData.address, shopData.cuisineName1];
            shopData.cuisineName2 && keywords.push(shopData.cuisineName2);
            keywords.push(shopData.areaName);
            shopData.keywordLst = keywords.join(' | ');
            // 保存店铺基本信息callServer调用
            G.updateShopBaseInfo(shopData, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                $form.removeClass('edit-mode').addClass('read-mode');
                topTip({msg: '保存成功！', type: 'success'});
                updateReadMode($form, shopData);
            });
        }
    });
    
}
// 保存提交后更新店铺信息只读模式
function updateReadMode($form, data)
{
    $form.find('input, select').not('.map-keyword, #openingHoursEnd').each(function ()
    {
        var $this = $(this),
            $p = $this.siblings('p');
        if($this.is('#openingHoursStart'))
            $p.text(data.openingHours);
        else if($this.is('select'))
            $p.text(getSelectText($this));
        else
            $p.text($this.val());
    });
}
// 初始化菜系下拉列表
function initCuisines($cuisine1, $cuisine2, cityID, cuisineID1, cuisineID2)
{
    var callServer = G.getCuisines;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        $cuisine1.siblings('.chosen-container').remove();
        U.createChosen($cuisine1.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%', placeholder_text : '请选择或输入菜系1' }, false, cuisineID1 || '')
        .blur().change(function(){ $(this).blur() });
        
        $cuisine2.siblings('.chosen-container').remove();
        U.createChosen($cuisine2.show().data('chosen', null), rsp.data.records || [], 'cuisineID', 'cuisineName', { width: '100%', placeholder_text : '请选择或输入菜系2' }, { cuisineID: '', cuisineName: '--不限--' }, cuisineID2 || '')
        .blur().change(function(){ $(this).blur() });
    });
    
}
// 初始化地标下拉列表
function initAreas($area, cityID, areaID)
{
    G.getAreas({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        $area.siblings('.chosen-container').remove();
        U.createChosen($area.show().data('chosen', null), rsp.data.records || [], 'areaID', 'areaName', { width: '100%', placeholder_text : '请选择或输入地标' }, false, areaID || '')
        .blur().change(function(){ $(this).blur() });
    });
    
}

// 初始化城市下拉列表
function initCities($city, shopInfo)
{
    G.getCities({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        U.createChosen($city, rsp.data.records || [], 'cityID', 'cityName', { width: '100%', placeholder_text : '请选择或输入所在城市' }, false, shopInfo.cityID)
        .trigger('change', [shopInfo.areaID, shopInfo.cuisineID1, shopInfo.cuisineID2])
        .change(function(){ $(this).blur() });
    });
    
}

// 处理并获取下拉列表当前选择项的文本
function getSelectText($select)
{
    return $select.find('option:selected').text().replace(/-/g, '');
}

})(jQuery, window);










;(function ($, window) {
IX.ns('Hualala.Shop');

// 初始化店铺菜品页面
Hualala.Shop.initMenu = function ($container, pageType, params)
{
    if(!params) return;
    
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip;
    
    var shopID = params;
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        imgRoot = G.IMAGE_ROOT + '/';

    var classifiedFoods = null, //已分类菜品
        foodClass = '', //当菜菜品类别的 foodCategoryID
        foods = null, //当前表格显示的菜品数组
        current = 0, //页面滚动时渲染foods所在的索引
        size = 10, // 首次或者滚动加载的food数量
        searchParams = null, //菜品搜索过滤参数
        //修改菜品弹出框里几个 radio 的名称
        foodParams = ['hotTag', 'takeawayTag', 'isDiscount'],
        food = null, //当前菜品
        ef = null; //修改菜品后用于向服务器发送的数据
        
    //单个菜品模板（菜品表格中的一行）
    var foodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food')),
        //修改菜品弹出框模板
        editFoodTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_food'));
        //页面主内容
    var $menu = $(Hualala.TplLib.get('tpl_shop_menu')),
        $foodClass = null, //菜品类别 UI 对象集合
        $foodSearch = $menu.find('#foodSearch'),
        $takeawayTag = $foodSearch.find('#takeawayTag'),
        $foodName = $foodSearch.find('#foodName'),
        $chekbox = $foodSearch.find('input[type=checkbox]'),
        $tblHead = $menu.find('.tbl-foods thead'),
        $foodCount = $menu.find('#foodSearchInfo span'),
        $foods = $menu.find('.tbl-foods tbody'),
        $editFood = null,
        modalEditFood = null, 
        bv = null; //表单验证器
    //调用服务，根据 shopID 获取所有分类和菜品信息
    G.getShopMenu({shopID : shopID}, function (rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        var records = rsp.data.records;
        if(!records || records.length == 0)
        {
            var $alert = $('<div class="alert alert-warning t-c">此店铺暂无菜品，您可以通过下载<a target="_blank">PC客户端</a>上传菜品数据。</div>');
            $alert.find('a').attr('href', Hualala.PageRoute.createPath('pcclient'));
            $alert.appendTo($container);
            return;
        }
        classifiedFoods = classifyFoods(records);
        renderFoods(); //渲染所有菜品
        //渲染菜品分类
        var $foodClassBox = $menu.find('#foodClassBox').append($('<span class="current-food-class"></span>').text('全部菜品 (' + foods.length + ')'));
        
        for(var id in classifiedFoods)
        {
            var category = classifiedFoods[id]; 
            $('<span></span>').data('id', id).text(category.foodCategoryName + ' (' + category.foods.length + ')').appendTo($foodClassBox);
        }
        $foodClass = $foodClassBox.find('span');
        
        var foodNameTpl = Handlebars.compile(Hualala.TplLib.get('tpl_food_name'));
        $foodName.html(foodNameTpl({classifiedFoods: classifiedFoods}));
        initFoodChosen();
        $menu.appendTo($container);
    });
    
    function initFoodChosen() 
    {
        var matcher = (new Pymatch([]));
        var sections = foods;
        var getMatchedFn = function (searchText) {
            matcher.setNames(_.map(sections, function (el) {
                return IX.inherit(el, {
                    name : el.foodName
                });
            }));
            var matchedSections = matcher.match(searchText);
            var matchedOptions = {};
            _.each(matchedSections, function (el, i) {
                matchedOptions[el[0].foodID] = true;
            });
            return matchedOptions;
        };
        $foodName.chosen({
            width : '200px',
            placeholder_text : "选择或输入菜品名称",
            // max_selected_options: 1,
            no_results_text : "抱歉，没有相关菜品！",
            allow_single_deselect : true,
            getMatchedFn : getMatchedFn
        }).change(function()
        {
            searchFood();
        });
    }
    
    //页面滚动时加载更多菜品
    $(window).on('scroll', function(e)
    {
        if(foods) throttle(scrollFood);
    });
    
    function scrollFood()
    {
        var viewBottom = $(window).scrollTop() + $(window).height(),
            foodsBottom = $foods.offset().top + $foods.height();
        
        if(foodsBottom < viewBottom && current < foods.length)
        {
            renderFoods();
        }
    }
    
    $(document).on('change', function(e)
    {
        var $target = $(e.target);
        //菜品过滤筛选
        if($target.is('#takeawayTag , #foodSearch input[type=checkbox]'))
        {
            searchFood();
        }
        //自定义按钮组相关
        if($target.is('.form-food input[type=radio]'))
        {
            $target.closest('div').find('label').removeClass('active')
            .find('input:checked').parent().addClass('active');
        }
        //修改菜品图片
        if($target.is('.food-pic input'))
        {
            var $foodPic = $editFood.filter('.food-pic');
            if($target.val())
            {
                $foodPic.addClass('loading');
                previewImg($target[0], $foodPic.find('img'));
                $foodPic.submit();
            }
        }
        
    });
    
    top.imgCallback = function(rsp)
    {
        var $foodPic = $editFood.filter('.food-pic');
        var json = $.parseJSON(rsp),
            status = json.status;
        if(status == 'success')
        {
            var url = json.url,
                imageHWP = json.imageHWP || '';
            ef.imagePath = url;
            if(imageHWP) ef.imageHWP = imageHWP;
            if(!window.FileReader)
            {
                $foodPic.find('img').attr('src', imgHost + url.replace(/\.\w+$/, (imageHWP ? '=200x' + Math.round(200 * imageHWP) : '') + '$&?quality=70'));
            }
        }
        else
        {
            topTip({msg: status + '：菜品图片上传失败'});
        }
        $foodPic.removeClass('loading');
        $('#imgResponse').remove();
    }
    
    //图片上传本地预览
    function previewImg(fileInput, $img)
    {
        if (fileInput.files && fileInput.files[0])  
        {
            var reader = new FileReader();  
            reader.onload = function(e){
                $img.attr('src', e.target.result);
            }
            reader.readAsDataURL(fileInput.files[0]);  
        }
    }
    
    //修改菜品
    $foods.on('click', 'tr', function()
    {
        var $this = $(this);
        food = findFood($this.data('cid'), $this.data('id'));
        //菜品图标：招、荐、新
        var foodIcos = ['isSpecialty', 'isRecommend', 'isNew'],
            path = food.imgePath;
        
        food.foodPic = path ? imgHost + path + '?quality=70' : imgRoot + 'food_bg.png';
        //辣度
        food.hotTag1 = imgRoot + 'hottag1.png';
        food.hotTag2 = imgRoot + 'hottag2.png';
        food.hotTag3 = imgRoot + 'hottag3.png';
        
        $editFood = $(editFoodTpl(food));
        //弹出对话框
        modalEditFood = new U.ModalDialog({
            id: 'editFood',
            title: '修改菜品',
            html: $editFood,
            hideCloseBtn: false
        }).show();
        modalEditFood._.footer.find('.btn-ok').text('保存修改');
        modalEditFood._.footer.find('.btn-close').text('返回');
        //初始化表单验证
        bv = $editFood.filter('.form-food').bootstrapValidator({
            fields: {
                minOrderCount: {
                    validators: {
                        notEmpty: {
                            message: '起售份数不能为空'
                        },
                        integer: {
                            message: '起售份数必须是整数'
                        },
                        between: {
                            min: 1,
                            max: 99,
                            message: '起售份数必须在1到99之间'
                        }
                    }
                }
            }
        }).data('bootstrapValidator');
        //初始化ef
        ef = {shopID: shopID, foodID: $this.data('id')};
        for(var i = foodIcos.length; i--;)
        {
            var foodIco = foodIcos[i];
            ef[foodIco] = '0';
            if(food[foodIco] == 1)
            {
                $editFood.find('input[name=foodIco][value=' + foodIco +']').prop('checked', true).trigger('change');
            }
        }
        for(var i = foodParams.length; i--;)
        {
            var param = foodParams[i];
            $editFood.find('input[name=' + param + '][value=' + food[param] +']').prop('checked', true).trigger('change');
        }
        //菜品“可售/停售”
        $editFood.find('input[name=isActive][value=' + food.foodIsActive + ']').prop('checked', true).trigger('change');
    });
    
    $(document).on('click', function(e)
    {
        var $target = $(e.target);
        //修改菜品“保存修改”
        if($target.is('#editFood .btn-ok'))
        {
            if(!bv.validate().isValid()) return;
            
            var $foodIco = $editFood.find('input[name=foodIco]:checked').not('[value=none]');
            if($foodIco[0]) ef[$foodIco.val()] = '1';
            
            for(var i = foodParams.length; i--;)
            {
                var param = foodParams[i];
                ef[param] = $editFood.find('input[name=' + param + ']').filter(':checked').val();
            }
            ef.isActive = $editFood.find('input[name=isActive]:checked').val();
            ef.minOrderCount = $editFood.find('input[name=minOrderCount]').val();
            ef.tasteList = $.trim($editFood.find('input[name=tasteList]').val());
            //调用修改菜品相关服务
            G.updateFood(ef, function (rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                modalEditFood.hide();
                $.extend(food, ef);
                if(ef.imagePath) food.imgePath = ef.imagePath;
                food.foodIsActive = food.isActive;
                updateFood(food);
                $foods.empty();
                renderFoods(true);
            });
        }
        //点击某个菜品类别渲染对应菜品
        if($target.is('#foodClassBox span'))
        {
            $foodClass.removeClass('current-food-class');
            $target.addClass('current-food-class');
            foodClass = $target.data('id');
            $takeawayTag.val('');
            $foodName.val('');
            $chekbox.prop('checked', false);
            searchParams = null;
            current = 0;
            renderFoods();
        }
        //搜索过滤菜品
        /*if($target.is('#btnSearchFood'))
        {
            searchFood();
        }*/
        
    });
    
    /*$foodName.on('keydown', function(e)
    {
        e.keyCode == 13 && searchFood();
    });*/
    //过滤筛选菜品UI
    function searchFood()
    {
        var $checked = $chekbox.filter(':checked'),
            takeawayTag = $.trim($takeawayTag.val()),
            foodID = $.trim($foodName.val());
        if(takeawayTag || foodID || $checked.length)
        {
            searchParams = {};
            if(takeawayTag) searchParams.takeawayTag = takeawayTag;
            if(foodID) searchParams.foodID = foodID;
            $checked.each(function ()
            {
                if(this.id == 'isHasImage')
                    searchParams.isHasImage = '0';
                else
                    searchParams[this.id] = '1';
            });
        }
        else
        {
            searchParams = null;
        }
        current = 0;
        renderFoods();
    }
    
    //渲染菜品
    function renderFoods(start)
    {
        foods = filterFoods();
        $foodCount.text(foods.length);
        if(current == 0) $foods.empty();
        $foods.append(foodTpl({foods: foods.slice(start ? 0 : current, current + size)}));
        current += size;
        //$foods.find('img').lazyload();
    }
    //在某个菜品分类下根据foodID查找某个菜品
    function findFood(cid, id)
    {
        var cfs = classifiedFoods[cid].foods; 
        for(var i = cfs.length; i--;)
        {
            if(cfs[i].foodID == id) return cfs[i];
        }
        return null;
    }
    //根据各种条件过滤菜品
    function filterFoods()
    {
        var result = [];
        if(!foodClass)
        {
            for(var foodCategoryID in classifiedFoods)
            {
                result.push.apply(result, classifiedFoods[foodCategoryID].foods);
            }
        }
        else
        {
            result = classifiedFoods[foodClass].foods;
        }
        
        for(p in searchParams)
        {
            result = $.grep(result, function (food)
            {
                return food[p] == searchParams[p];
            });
        }
        
        return result;
    }
    //将菜品分类
    function classifyFoods(foodsData)
    {
        var result = {};
        for(i = 0, l = foodsData.length; i < l; i++)
        {
            var food = foodsData[i], cid = food.foodCategoryID;
            //根据foodCategoryID分类
            result[cid] = result[cid] || {foods: [], foodCategoryName: food.foodCategoryName};
            //某个菜品可能无foodID
            if(!food.foodID) continue;
            
            updateFood(food);
            
            food.takeoutPackagingFee = food.takeoutPackagingFee > 0 ? parseFloat(food.takeoutPackagingFee) : '';
            
            if(food.prePrice == -1 || food.prePrice == food.price)
            {
                food.prePrice = food.price;
                food.price = '';
            }
            if(food.vipPrice == -1 || food.vipPrice >= food.prePrice)
            {
                food.vipPrice = '';
            }
            food.price = food.price || '';
            food.prePrice = food.prePrice || '';
            food.vipPrice = food.vipPrice || '';
            
            var cfs = result[cid].foods,
                unit = {
                    unit: food.unit ? food.unit + ':' : '',
                    price: food.price ? '￥' + parseFloat(food.price) : '',
                    prePrice: food.prePrice ? '￥' + parseFloat(food.prePrice) : '',
                    vipPrice: food.vipPrice ? '￥' + parseFloat(food.vipPrice) : ''
                },
                idx = inAarry(cfs, food, 'foodID');
            //if(unit.prePrice == '￥NaN') console.log(food);
            if(idx == -1)
            {
                food.units = [unit];
                cfs.push(food);
            }
            else
            {//将相同foodID的菜品按照规格合并
                cfs[idx].units.push(unit);
            }
            
        }
        return result;
    }
    //更新某个菜品在表格中显示的相关属性
    function updateFood(food)
    {
        var path = food.imgePath;
        if(path)
        {
            var hwp = food.imageHWP, min = 92,
                w = hwp > 1 ? min : Math.round(min / hwp),
                h = hwp > 1 ? Math.round(min * hwp) : min;
            food.imgSrc = imgHost + path.replace(/\.\w+$/, (hwp ? '=' + w + 'x' + h : '') + '$&?quality=70');
        }
        else
            food.imgSrc = imgRoot + 'dino80.png';
        
        food.discountIco = food.isDiscount == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
        food.takeawayIco = food.takeawayTag > 0 ? 'glyphicon-ok' : 'glyphicon-minus';
        food.activeIco = food.foodIsActive == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
    }
    
    //根据对象的一个属性检查某个对象是否在一个对象数组中
    function inAarry(arr, obj, key)
    {
        for(var i = 0, l = arr.length; i < l; i++)
        {
            if(arr[i][key] == obj[key]) return i;
        }
        return -1;
    }
    
}
//将频繁执行的代码延迟执行以提高性能
function throttle(method, context)
{
    clearTimeout(method.tId);
    method.tId = setTimeout(function()
    {
        method.call(context);
    }, 100);
}

})(jQuery, window);










;(function ($, window) {
	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
    
    Hualala.Shop.Typedef = {
        operationMode: { '0': '正餐', '1': '快餐', '2': '美食广场' }
    };
    
    /**
	  * 渲染店铺详情页头部
	  * @param {Object | String} shopInfo 店铺ID或者店铺详情信息对象
	  * @param {jQuery Object} container  容器
      * @param {function} callback  回调函数，参数是店铺详情头部的jQuery对象
	  * @return {NULL} 
	  */
    Hualala.Shop.createShopInfoHead = function(shopInfo, container, callback)
    {
        var $container = container || $('#ix_wrapper > .ix-body > .container'),
            $shopInfoHead = $('<div class="bs-callout shop-info-head"></div>');
        !callback && $shopInfoHead.appendTo($container);
        
        var fn = function (shopInfo)
        {
            var tplData = {
                    shopName: shopInfo.shopName,
                    shopUrl: Hualala.Common.getShopUrl(shopInfo.shopID),
                    shopListLink: Hualala.PageRoute.createPath('shop'),
                    checked: shopInfo.status == 1 ? 'checked' : ''
                };
            
            var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_info_head'));
            
            $shopInfoHead.append($(tpl(tplData))).find('input').bootstrapSwitch({
                onColor : 'success',
                onText : '已开通',
                offText : '未开通'
            }).on('switchChange.bootstrapSwitch', function (e, state)
            {//店铺状态切换
                var $chkbox = $(this);
                Hualala.Global.switchShopStatus({shopID: shopInfo.shopID, status: +state}, function (rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        $chkbox.bootstrapSwitch('toggleState', true);
                        rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    Hualala.UI.TopTip({
                        msg: !+state ? '关闭成功' : '开启成功', 
                        type: 'success'
                    })
                });
			});;
            //重置代理程序密码
            $shopInfoHead.find('#resetPwd').on('click', function ()
            {
                var resetPwdTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_shop_client_pwd'));
                var $resetPwdForm = $(resetPwdTpl(shopInfo));
                //弹出重置代理程序密码模态框
                var modal = new Hualala.UI.ModalDialog({
                    id: 'resetCltPwdDlg',
                    title: '重置代理程序密码',
                    html: $resetPwdForm,
                    sizeCls: 'modal-sm',
                    hideCloseBtn: false
                }).show();
                var $feedback = $resetPwdForm.find('.has-feedback'),
                    $feedbackIcon = $feedback.find('.form-control-feedback'),
                    $errMsg = $feedback.find('small');
                var $pwd = $resetPwdForm.find('#shopClinetPwd').data('validate', false).on('blur', function ()
                {//验证密码输入
                    var $this = $(this),
                        l = $.trim($this.val()).length;
                    $this.data('validate', false);
                    if(!l)
                        $errMsg.text('密码不能为空');
                    else if(l < 6 || l > 16)
                        $errMsg.text('密码长度必须在6到16个字符之间');
                    else
                    {
                        $errMsg.text('');
                        $this.data('validate', true);
                    }
                        
                    var isValid = $this.data('validate');
                    $feedback.toggleClass('has-success', isValid).toggleClass('has-error', !isValid);
                    $feedbackIcon.toggleClass('glyphicon-ok', isValid).toggleClass('glyphicon-remove', !isValid);
                });
                //密码/明文切换
                $resetPwdForm.find('#showPwd').change(function()
                {
                    $pwd.attr('type', this.checked ? 'text' : 'password');
                });
                //提交密码重设请求
                modal._.footer.find('.btn-ok').on('click', function ()
                {
                    if(!$pwd.trigger('blur').data('validate')) return;
                    
                    Hualala.Global.setShopClientPwd({shopID: shopInfo.shopID, hLLAgentLoginPWD: $pwd.val()}, function (rsp)
                    {
                        if(rsp.resultcode != '000')
                        {
                            rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        modal.hide();
                        Hualala.UI.TopTip({msg: '重置代理程序密码成功！', type: 'success'});
                    });
                    
                });
                
            });
            //执行回调函数
            callback && callback($shopInfoHead);
        };
        //如果是参数shopInfo是店铺详情对象
        if($.isPlainObject(shopInfo))
        {
            fn(shopInfo);
            return;
        }
        //如果参数shopInfo是shopID，发送ajax获取店铺详情信息
        Hualala.Global.getShopInfo({shopID: shopInfo}, function (rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var shopInfo = rsp.data.records[0];
            fn(shopInfo);
        });
        
    };
    
    // 店铺详情页功能导航
    Hualala.Shop.createShopFuncNav = function (currentPageName, shopID, container)
    {
        var shopFuncs = ['shopInfo', 'shopMenu'],
            R = Hualala.PageRoute,
            $ul = $('<ul class="nav navbar-nav"></ul>'),
            $container = container || $('#ix_wrapper > .ix-body > .container');
        
        for(i = 0, l = shopFuncs.length; i < l; i++)
        {
            var shopFunc = shopFuncs[i],
                isActive = shopFunc == currentPageName,
                path = isActive ? 'javascript:;' : R.createPath(shopFunc, [shopID]),
                label = R.getPageLabelByName(shopFunc);
            
            $('<li></li>').toggleClass('active', isActive).append($('<a></a>').attr('href', path).text(label)).appendTo($ul);
        }
        
        return $('<div class="navbar navbar-default shop-func-nav"></div>').append($ul).appendTo($container);
    };
    
	var initShopList = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
		var queryPanel = new Hualala.Shop.QueryController({
			needShopCreate : true,
			container : $body,
			resultController : new Hualala.Shop.ShopListController({
				container : $body,
				model : new Hualala.Shop.CardListModel({callServer : Hualala.Global.queryShop}),
				view : new Hualala.Shop.CardListView()
			})
		});
		// TODO 店铺管理首页，店铺查询及列表展示页面
	};
	Hualala.Shop.HomePageInit = initShopList;

	var initShopBaseInfoMgr = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
		Hualala.Shop.initInfo($body, pageType, params);
	};
	Hualala.Shop.BaseInfoMgrInit = initShopBaseInfoMgr;

	var initFoodMenuMgr = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        Hualala.Shop.createShopInfoHead(params, $body);
        Hualala.Shop.createShopFuncNav(pageType, params, $body);
        Hualala.Shop.initMenu($body, pageType, params);
	};
	Hualala.Shop.FoodMenuMgrInit = initFoodMenuMgr;

	var initCreateShop = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_create')),
            $shopCreateWizard = $(tpl({
                pcClientPath: Hualala.PageRoute.createPath('pcclient')
            }));
		$body.append($shopCreateWizard);
        Hualala.Shop.initCreate($shopCreateWizard);
		
	};
	Hualala.Shop.CreateShopInit = initCreateShop;

	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Setting");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var ServiceFormElsCfg = {
		advanceTime : {
			type : 'combo',
			label : '用户提前预订时间',
			defaultVal : 0,
			// prefix : '$',
			// surfix : '元',
			options : Hualala.TypeDef.MinuteIntervalOptions(),
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入用户提前预订时间"
					}
				}
			}
		},
		noticeTime : {
			type : 'combo',
			label : '订单提前通知时间',
			defaultVal : 0,
			// @Note for 1.1 modify MinuteIntervalOptions first option label (#4105)
			// options : Hualala.TypeDef.MinuteIntervalOptions(),
			options : Hualala.Common.getMinuteIntervalOptions({startLabel : "用户下单后立即通知"}),
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入订单提前通知时间"
					}
				}
			}
		},
		minAmount : {
			type : 'text',
			label : '最低消费金额',
			prefix : '￥',
			surfix : Hualala.Constants.CashUnit,
			defaultVal : 0,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入最低消费金额"
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
			surfix : Hualala.Constants.CashUnit,
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
			surfix : Hualala.Constants.CashUnit,
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
						message : "请选择节假日开放类型"
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
						message : "请输入开放服务天数"
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
							message : "请输入起始时间"
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
							message : "请输入结束时间"
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
						message : "请选择留位时间"
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
						message : "请输入预计送餐所需时间"
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
						message : "请输入送餐范围"
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
						message : "请选择可选支付方式"
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
						message : "请选择店内支付方式"
					}
				}
			}
		},
		checkSpotOrder : {
			type : 'switcher',
			label : '支持手机结账',
			defaultVal : 1,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {}
			}
		},
		// @NOTE: for 1.1 modify payBeforeCommit to combobox(#4105)
		// payBeforeCommit : {
		// 	type : 'switcher',
		// 	label : '支持餐前结账',
		// 	defaultVal : 1,
		// 	onLabel : '支持',
		// 	offLabel : '不支持',
		// 	validCfg : {
		// 		validators : {}
		// 	}
			
		// },
		payBeforeCommit : {
			type : 'combo',
			label : '结账模式',
			defaultVal : 1,
			options : Hualala.TypeDef.PayBeforeCommitOptions,
			validCfg : {
				validators : {}
			}
		},
		fetchFoodMode : {
			type : 'combo',
			label : '下单后出餐模式',
			defaultVal : 0,
			options : Hualala.TypeDef.FetchFoodModeOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "下单后出餐模式不能为空"
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
		 *              @param {String} serviceFeatures 店铺服务信息
		 *              @param {Function} successFn 编辑成功后的回调
		 * @return {NULL}    
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl');
			this.serviceID = $XP(cfg, 'serviceID', null);
			this.serviceName = $XP(cfg, 'serviceName', null);
			this.model = $XP(cfg, 'model', null);
			this.serviceFeatures = $XP(cfg, 'serviceFeatures', '');
			this.serviceList = Hualala.TypeDef.ShopBusiness;
			this.modal = null;
			this.successFn = $XF(cfg, 'successFn');
			if (!this.serviceID || !this.serviceName || !this.model) {
				throw("Service View init failed!");
			}
			this.loadTemplates();
			this.serviceInfo = this.getServiceInfo('id', this.serviceID);
			this.callServer = $XP(this.serviceInfo, 'callServer', '');
			if (IX.isFn(this.callServer)) {
				this.callServer = this.callServer;
			} else if (!IX.isString(this.callServer)) {
				throw("Configuration failed : Invalid Page Initialized for " + this.callServer);
				return false;
			} else if (IX.nsExisted(this.callServer)) {
				this.callServer = IX.getNS(this.callServer);
			}
			// var revParamJson = JSON.parse(this.model.get('revParamJson'));
			var revParamJson = this.model.get('revParamJson') || null,
				takeawayParamJson = this.model.get('takeawayParamJson') || null,
				businessCfg = null;
			revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
			takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
			businessCfg = IX.inherit(revParamJson, takeawayParamJson);
			this.formParams = $XP(businessCfg, this.serviceID);
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
			var self = this;
			var operationMode = self.model.get('operationMode');
			var servData = IX.inherit({}, _.find(this.serviceList, function (v) {return v[key] == val}));
			if (!IX.isEmpty($XP(servData, 'operationMode'))) {
				servData = IX.inherit(servData, {
					formKeys : $XP(servData, 'operationMode.' + operationMode)
				});
			}
			return servData;
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
				IX.Debug.info("DEBUG: Shop Business Service Edit View Form Params : ");
				IX.Debug.info(formParams);
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
						self.successFn(self.model, self.serviceID, formParams, self.$trigger);
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
						if (key == 'checkSpotOrder') {
							return IX.inherit(elCfg, {
								checked : self.serviceFeatures.indexOf('spot_pay') >= 0 ? 'checked' : ''
							});
						} else {
							return IX.inherit(elCfg, {
								checked : $XP(self.formParams, key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
							});
						}
						
					} else if (type == 'text' && self.serviceID == "20" && key == "minAmount") {
						return IX.inherit(elCfg, {
							label : "起送金额",
							value : $XP(self.formParams, key, 0)
						});
					} else if (type == 'text' && self.serviceID == "20" && key == "serviceAmount") {
						return IX.inherit(elCfg, {
							label : "送餐费",
							value : $XP(self.formParams, key, 0)
						});
					} else if (type == 'text' && self.serviceID == "20" && key == "freeServiceAmount") {
						return IX.inherit(elCfg, {
							label : "免送餐费金额",
							prefix : '满',
							surfix : Hualala.Constants.CashUnit + "，免送餐费",
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal'))
						});
					} else {
						return IX.inherit(elCfg, {
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal'))
						});
					}
				});
			IX.Debug.info("DEBUG: Shop Business Service Edit View Form Elements : ");
			IX.Debug.info(formEls);
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
					formClz : 'shop-service-form form-feedback-out',
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
						// ret[key] = $('[name=' + key + ']').attr('checked') ? 1 : 0;
						ret[key] = !$('[name=' + key + ']').data('bootstrapSwitch').options.state ? 0 : 1;
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


	var bindSettleUnitView = Stapes.subclass({
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl', null);
			this.settleID = $XP(cfg, 'settleID', '');
			this.model = $XP(cfg, 'model', null);
			this.successFn = $XF(cfg, 'successFn');
			this.getSettleUnitsCallServer = Hualala.Global.queryAccount;
			this.bindSettleUnitCallServer = Hualala.Global.bindSettleUnitByShopID;
			this.modal = null;
			this.$body = null;
			this.$footer = null;
			if (!this.$trigger || !this.settleID || !this.model) {
				throw("Bind Settle Unit View init failed!");
			}
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load');
		}
	});
	bindSettleUnitView.proto({
		loadTemplates : function () {
			var self = this;
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerPartial("settleItem", Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'bind_settle_modal',
				clz : 'account-modal',
				title : "绑定结算账户"
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			var layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl({
					clz : '',
					title : '选择店铺要绑定的结算账户'
				});
			self.$body.html(htm);
			self.$resultBox = self.$body.find('.result-box');
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				},
				"load" : function () {
					if (!self.origSettleData) {
						self.getSettleUnitsCallServer({}, function (res) {
							if (res.resultcode != '000') {
								toptip({
									msg : $XP(res, 'resultmsg', ''),
									type : 'danger'
								});
								self.emit('hide');
							} else {
								self.origSettleData = $XP(res, 'data.records', []);
								self.render(self.origSettleData);
								self.emit('show');
							}
						});
					} else {
						self.render(self.origSettleData);
					}
				}
			});
			self.$resultBox.tooltip({
				selector : '[title]'
			});
			self.$resultBox.delegate(':radio', 'change', function (e) {
				var $el = $(this),
					checked = !this.checked ? false : true,
					itemID = $el.val();
				self.curSettleUnit = _.find(self.origSettleData, function (settle) {return $XP(settle, 'settleUnitID', '') == itemID;});
			});
			self.$footer.delegate('.btn', 'click', function (e) {
				var $btn = $(this),
					act = $btn.hasClass('btn-ok') ? 'ok' : 'cancel';
				if (act == 'cancel') {
					self.emit('hide');
				} else {
					// 设置角色绑定店铺数据
					self.bindItems();
					
				}
			});
		},
		bindItems : function () {
			var self = this;
			self.bindSettleUnitCallServer({
				shopID : self.model.get('shopID'),
				settleID : $XP(self.curSettleUnit, 'settleUnitID'),
				settleName : $XP(self.curSettleUnit, 'settleUnitName'),
				oldSettleID : self.settleID
			}, function (res) {
				if (res.resultcode != '000') {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				} else {
					toptip({
						msg : '绑定成功',
						type : 'success'
					});
					self.emit('hide');
					self.successFn(self.model, self.$trigger, self.curSettleUnit);
				}
			});
		},
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (settle, i, l) {
				var id = $XP(settle, 'settleUnitID'),
					checked = id == self.settleID ? 'checked' : '';
				if (checked == 'checked') {
					self.curSettleUnit = settle;
				}
				return IX.inherit(settle, {
					type : 'radio',
					clz : 'bind-item',
					settleUnitNameLabel : $XP(settle, 'settleUnitName', ''),
					checked : checked
				});
			});
			return ret;
		},
		render : function (data) {
			var self = this,	
				listTpl = self.get('listTpl');
			var renderData = self.mapRenderData(data);
			var htm = listTpl({
				settleList : {
					list : renderData
				}
			});
			self.$resultBox.html(htm);
		}
	});
	Hualala.Setting.bindSettleUnitView = bindSettleUnitView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Setting");
	var initShopMgr = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		var queryPanel = new Hualala.Shop.QueryController({
			needShopCreate : false,
			container : $body,
			resultController : new Hualala.Shop.ShopListController({
				container : $body,
				model : new Hualala.Shop.CardListModel({callServer : Hualala.Global.queryShop}),
				view : new Hualala.Shop.ShopListView()
			})
		});
	};
	Hualala.Setting.ShopMgrInit = initShopMgr;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListModel = Hualala.Shop.CardListModel;
	var AccountListModel = CardListModel.subclass({
		constructor : CardListModel.prototype.constructor
	});
	AccountListModel.proto({
		init : function (params) {
			this.set({
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15),
				transCreateBeginTime : $XP(params, 'transCreateBeginTime', ''),
				transCreateEndTime : $XP(params, 'transCreateEndTime', ''),
				settleUnitID : $XP(params, 'settleUnitID', ''),
				transStatus : $XP(params, 'transStatus', ''),
				transType : $XP(params, 'transType', ''),
				groupID : $XP(params, 'groupID', ''),
				minTransAmount : $XP(params, 'minTransAmount', ''),
				maxTransAmount : $XP(params, 'maxTransAmount', ''),
				ds_account : new IX.IListManager(),
				ds_page : new IX.IListManager()
			});
		},
		updatePagerParams : function (params) {
			var self = this;
			var pagerParamkeys = 'pageCount,totalSize,pageNo,pageSize,transCreateBeginTime,transCreateEndTime,settleUnitID,transStatus,transType,groupID,minTransAmount,maxTransAmount';
			_.each(params, function (v, k, l) {
				if (pagerParamkeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			// return {
			// 	Page : {
			// 		pageNo : this.get('pageNo'),
			// 		pageSize : this.get('pageSize')
			// 	},
			// 	settleUnitID : this.get('settleUnitID'),
			// 	transCreateBeginTime : this.get('transCreateBeginTime'),
			// 	transCreateEndTime : this.get('transCreateEndTime'),
			// 	transStatus : this.get('transStatus'),
			// 	transType : this.get('transType'),
			// 	groupID : this.get('groupID'),
			// 	minTransAmount : this.get('minTransAmount'),
			// 	maxTransAmount : this.get('maxTransAmount')
			// };
			return {
				pageNo : this.get('pageNo'),
				pageSize : this.get('pageSize'),
				settleUnitID : this.get('settleUnitID'),
				transCreateBeginTime : this.get('transCreateBeginTime'),
				transCreateEndTime : this.get('transCreateEndTime'),
				transStatus : this.get('transStatus'),
				transType : this.get('transType'),
				groupID : this.get('groupID'),
				minTransAmount : this.get('minTransAmount'),
				maxTransAmount : this.get('maxTransAmount')
			};
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			var accountIDs = _.map(data, function (account, i, l) {
				var settleUnitID = $XP(account, 'settleUnitID'),
					mAccount = new BaseAccountModel(account);
				accountHT.register(settleUnitID, mAccount);
				return settleUnitID;
			});
			pageHT.register(pageNo, accountIDs);
		},
		resetDataStore : function () {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			accountHT.clear();
			pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams(IX.inherit($XP(res, 'data', {}), $XP(res, 'data.page', {})));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getAccounts : function (pageNo) {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			var ret = _.map(accountHT.getByKeys(pageHT.get(pageNo)), function (mAccount) {
				return mAccount.getAll();
			});
			IX.Debug.info("DEBUG: Account List Model PageData :");
			IX.Debug.info(ret);
			return ret;
		},
		getAccountModelByID : function (accountID) {
			var self = this,	
				accountHT = self.get('ds_account');
			return accountHT.get(accountID);
		}
	});


	Hualala.Account.AccountListModel = AccountListModel;

	var BaseAccountModel = Stapes.subclass({
		constructor : function (account) {
			!IX.isEmpty(account) && this.set(account);
			this.bindEvent();
		}
	});
	BaseAccountModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({
				"load" : function (params) {
					var settleUnitID = $XP(params, 'settleUnitID'),
						cbFn = $XF(params, 'cbFn');
					var callServer = Hualala.Global.queryAccount,
						groupID = $XP(Hualala.getSessionSite(), 'groupID', '');
					callServer({
						settleUnitID : settleUnitID,
						groupID : groupID
					}, function (res) {
						var records = $XP(res, "data.records", []);
						if (records.length == 0) {
							throw("get Account Data (" + settleUnitID + ") Failed!");
							return ;
						}
						self.set(records[0]);
						cbFn();
					});
				},
				// 提现
				"withdrawCash" : function (cfg) {
					var callServer = Hualala.Global.withdrawCash,
						params = $XP(cfg, 'params', {}),
						settleUnitID = self.get('settleUnitID'),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn'),
						poundageAmount = self.get('poundageAmount') || 0,
						poundageMinAmount = self.get('poundageMinAmount') || 0;
					callServer(IX.inherit(params, {
						settleUnitID : settleUnitID,
						poundageAmount : poundageAmount,
						poundageMinAmount : poundageMinAmount
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							var transAmount = $XP(params, 'transAmount', 0),
								settleBalance = self.get('settleBalance') || 0,
								newSettleBalance = Hualala.Common.Math.sub(settleBalance - transAmount);
							self.set('settleBalance', newSettleBalance);
							// TODO update View
							successFn();
							toptip({
								msg : '提现成功!',
								type : 'success'
							});
						}
					});
				},
				// 删除结算账户
				"delete" : function (cfg) {
					var callServer = Hualala.Global.deleteAccount,
						settleUnitID = self.get('settleUnitID'),
						groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer({
						settleUnitID : settleUnitID,
						groupID : groupID
					}, function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn(settleUnitID);
						} else {
							toptip({
								msg : '删除成功!',
								type : 'success'
							});
							// TODO update View
							successFn(settleUnitID);
						}
					});
				},
				// 编辑结算账户
				"edit" : function (cfg) {
					var callServer = Hualala.Global.editAccount,
						settleUnitID = self.get('settleUnitID'),
						groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit($XP(cfg, 'params', {}), {
						groupID : groupID,
						settleUnitID : settleUnitID
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn(settleUnitID);
						} else {
							toptip({
								msg : '修改成功!',
								type : 'success'
							});
							// TODO update View
							self.set($XP(cfg, 'params', {}));
							successFn(settleUnitID);
						}
					});
				},
				// 添加结算账户
				"add" : function (cfg) {
					var callServer = Hualala.Global.addAccount,
						groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit($XP(cfg, 'params', {}), {
						groupID : groupID
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : '添加成功!',
								type : 'success'
							});
							// TODO update View
							self.set($XP(cfg, 'params', {}));
							successFn();
						}
					});
				}
			});
		}
	});

	Hualala.Account.BaseAccountModel = BaseAccountModel;

	var AccountTransListModel = AccountListModel.subclass({
		constructor : function () {
			this.callServer = Hualala.Global.queryAccountTransDetail;
		}
	});
	AccountTransListModel.proto({
		init : function (params) {
			this.set({
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15),
				transCreateBeginTime : $XP(params, 'transCreateBeginTime', ''),
				transCreateEndTime : $XP(params, 'transCreateEndTime', ''),
				settleUnitID : $XP(params, 'settleUnitID', ''),
				transStatus : $XP(params, 'transStatus', ''),
				transType : $XP(params, 'transType', ''),
				groupID : $XP(params, 'groupID', ''),
				minTransAmount : $XP(params, 'minTransAmount', ''),
				maxTransAmount : $XP(params, 'maxTransAmount', ''),
				ds_trans : new IX.IListManager(),
				ds_page : new IX.IListManager()
			});
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				transHT = self.get('ds_trans'),
				pageHT = self.get('ds_page');
			var transIDs = _.map(data, function (trans, i, l) {
				var transID = $XP(trans, 'SUATransItemID'),
					mTrans = new BaseTransactionModel(trans);
				transHT.register(transID, mTrans);
				return transID;
			});
			pageHT.register(pageNo, transIDs);
		},
		resetDataStore : function () {
			var self = this,
				transHT = self.get('ds_trans'),
				pageHT = self.get('ds_page');
			transHT.clear();
			pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams(IX.inherit($XP(res, 'data', {}), $XP(res, 'data.page', {})));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getDataByPageNo : function (pageNo) {
			var self = this,
				transHT = self.get('ds_trans'),
				pageHT = self.get('ds_page');
			var ret = _.map(transHT.getByKeys(pageHT.get(pageNo)), function (mTrans) {
				return mTrans.getAll();
			});
			IX.Debug.info("DEBUG: Account TransList Model PageData :");
			IX.Debug.info(ret);
			return ret;
		},
		getModelByID : function (transID) {
			var self = this,	
				transHT = self.get('ds_trans');
			return transHT.get(transID);
		}
	});

	Hualala.Account.AccountTransListModel = AccountTransListModel;

	var BaseTransactionModel = BaseAccountModel.subclass({
		constructor : BaseAccountModel.prototype.constructor
	});
	BaseTransactionModel.proto({
		bindEvent : function () {
			var self = this;
			
		}
	});

	Hualala.Account.BaseTransactionModel = BaseTransactionModel;

	var AccountQueryShopModel = Hualala.Shop.QueryModel.subclass({
		constructor : function () {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			// 数据是否已经加载完毕
			this.isReady = false;
			// this.callServer = Hualala.Global.getShopQuerySchema;
			this.callServer = Hualala.Global.getAccountQueryShop;
		}
	});

	Hualala.Account.AccountQueryShopModel = AccountQueryShopModel;

	var AccountQueryShopResultModel = Hualala.Shop.CardListModel.subclass({
		constructor : function () {
			this.origData = null;
			
			this.dataStore = new IX.IListManager();
		}
	});
	AccountQueryShopResultModel.proto({
		initDataStore : function (data) {
			var self = this;
			self.origData = data;
			_.each(self.origData, function (shop) {
				self.dataStore.register($XP(shop, 'shipID'), shop);
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			var pageNo = self.get('pageNo'),
				pageSize = self.get('pageSize'),
				cityID = self.get('cityID'),
				areaID = self.get('areaID'),
				keywordLst = self.get('keywordLst'),
				totalSize = 0,
				start = (pageNo - 1) * pageSize,
				end = pageSize * pageNo,
				pageCount = 0;
			var shops = [];
			shops = areaID.length > 0 ? _.filter(self.origData, function (_shop) {
				return $XP(_shop, 'areaID') == areaID;
			}) : self.origData;
			shops = cityID.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'cityID') == cityID;
			}) : shops;
			shops = keywordLst.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'shopName') == keywordLst;
			}) : shops;
			totalSize = shops.length;
			pageCount = Math.ceil(totalSize / pageSize);
			shops = _.filter(shops, function (_shop, idx) {
				return idx >= start && idx < end;
			});
			self.updateDataStore(shops, pageNo);
			self.updatePagerParams({
				pageCount : pageCount,
				totalSize : totalSize,
				pageNo : pageNo,
				pageSize : pageSize
			});
			cbFn(self);
		}
	});

	Hualala.Account.AccountQueryShopResultModel = AccountQueryShopResultModel;












})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListView = Hualala.Shop.CardListView;
	var AccountListView = CardListView.subclass({
		constructor : CardListView.prototype.constructor
	});
	AccountListView.proto({
		// 重载loadTemplates
		// 加载View层所需要的模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_card')),
				addAccountTpl = Handlebars.compile(Hualala.TplLib.get('tpl_addAccount_Card'));
			// 注册accountCard子模板
			Handlebars.registerPartial("accountCard", Hualala.TplLib.get('tpl_account_card'));
			// @NOTE: 新需求STORY #1074，任何权限的用户都不允许添加结算账户，所以屏蔽掉添加结算账户的片段
			// Handlebars.registerPartial("addAccountCard", Hualala.TplLib.get('tpl_addAccount_Card'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		// 重载initLayout
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.account-list');
			this.$list = this.$container.find('.account-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
			this.bindCardEvent();
		},
		bindCardEvent : function () {
			var self = this;
			self.$list.on('click', '.btn.withdraw', function (e) {
				var $btn = $(this);
				var settleAccountID = $btn.parents('.bank-card').attr('data-id');
				if ($btn.hasClass('disabled')) return;
				// 提现操作
				var modal = new WithdrawCashView({
					triggerEl : $btn,
					settleUnitID : settleAccountID,
					model : self.model.getAccountModelByID(settleAccountID),
					parentView : self
				});
			});
			// @NOTE: 新需求STORY #1074，任何权限的用户都不允许添加结算账户，所以屏蔽掉添加结算账户的片段
			// self.$list.on('click', '.create-account', function (e) {
			// 	var $btn = $(this);
			// 	// TODO 创建账户
			// 	var editAccount = new Hualala.Account.AccountEditView({
			// 		triggerEl : $btn,
			// 		mode : 'add',
			// 		model : null,
			// 		parentView : self
			// 	});
			// });
			self.on({
				'updateSettleBalance' : function (mAccount) {
					var settleUnitID = mAccount.get('settleUnitID'),
						settleBalance = mAccount.get('settleBalance');
					self.$container.find('[data-id=' + settleUnitID + '] .cash > strong').html(settleBalance);
				}
			});
		},
		chkCtrlRight : function () {
			var self = this;
			var curPageRight = Hualala.Common.getCurPageUserRight();
			var disabled = $XP(curPageRight, 'right.disabled', []),
				enabled = $XP(curPageRight, 'right.enabled', []);
			_.each(disabled, function (n) {
				self.$list.find('[data-btn-name=' + n + ']').attr('disabled', true).addClass('invisible');
			});
			_.each(enabled, function (n) {
				self.$list.find('[data-btn-name=' + n + ']').attr('disabled', false).removeClass('invisible');
			});
		},
		// 重载格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (account, i, l) {
				var settleUnitID = $XP(account, 'settleUnitID'),
					hasDefault = $XP(account, 'defaultAccount', 0) == 0 ? false : true,
					bankInfo = Hualala.Common.mapBankInfo($XP(account, 'bankCode')),
					bankAccountStr = Hualala.Common.codeMask($XP(account, 'bankAccount', ''), 0, -4),
					settleBalance = parseFloat($XP(account, 'settleBalance', 0));

				return {
					settleUnitID : settleUnitID,
					hasDefault : hasDefault,
					settleUnitName : $XP(account, 'settleUnitName', ''),
					disableWithdraw : settleBalance <= 0 ? 'disabled' : '',
					settleBalance : settleBalance,
					bankIcon : $XP(bankInfo, 'icon_16', ''),
					bankComName : $XP(bankInfo, 'name', ''),
					bankAccountStr : $XP(bankAccountStr, 'val', '').replace(/([\w|*]{4})/g, '$1 ').replace(/([*])/g, '<span>$1</span>'),
					shopCount : parseInt($XP(account, 'shopCount', 0)),
					path : Hualala.PageRoute.createPath('accountDetail', [settleUnitID])
				};
			});
			return {
				accountCard : {
					list : ret
				}
			}
		},
		// 重载渲染列表
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var accounts = model.getAccounts(pageNo);
			var renderData = self.mapRenderData(accounts);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			// self.$list.empty();
			// self.$list.html(html);
			self.emptyBar && self.emptyBar.destroy();
			self.$list.empty();
			// if (accounts.length == 0) {
			// 	self.emptyBar = new Hualala.UI.EmptyPlaceholder({
			// 		container : self.$list
			// 	});
			// 	self.emptyBar.show();
			// } else {
			// 	self.$list.html(html);
			// 	self.chkCtrlRight();
			// }
			self.$list.html(html);
			self.chkCtrlRight();
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		},
		refresh : function () {
			var self = this;
			// self.render();
			document.location.reload(false);
		}
		
	});

	Hualala.Account.AccountListView = AccountListView;

	var WithdrawCashView = Stapes.subclass({
		/**
		 * 提现窗口
		 * @param  {Object} cfg {triggerEl, settleUnitID, model}
		 *              @param {jQueryObj} triggerEl 触发元素
		 *              @param {String} settleUnitID 结算账户ID
		 *              @param {Object} model 结算账户数据模型
		 *              @param {Object} parentView 父级View层
		 * @return {Obj}     提现实例
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl');
			this.settleUnitID = $XP(cfg, 'settleUnitID', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			if (!this.settleUnitID || !this.model) {
				throw("Withdraw Cash View init failed!");
			}
			this.loadTemplates();
			this.initModal();
			this.renderForm();
			this.bindEvent();
			this.emit('show');		
		}
	});

	WithdrawCashView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_withdraw_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_withdraw',
				clz : 'service-modal',
				title : '结算账户提现',
				afterRemove : function () {

				}
			});
		},
		mapPoundageAmountStr : function (n) {
			return (IX.isEmpty(n) || n == 0) ? '无手续费' : '<strong>' + n + '</strong>元';
		},
		mapPoundageMinAmountStr : function (n) {
			return (IX.isEmpty(n) || n == 0) ? '不限' : ('<strong>' + n + '</strong>元');
		},
		mapFormElsData : function () {
			var self = this,
				accountInfoKeys = [
					{key : 'settleUnitName', label : '结算账户名称'},
					{key : 'receiverName', label : '开户名'},
					{key : 'bankName', label : '开户行'},
					{key : 'bankAccount', label : '账号'},
					{key : 'settleBalance', label : '账户余额'},
					{key : 'poundageAmount', label : '提现手续费'},
					{key : 'poundageMinAmount', label : '免费提现最低金额'}
				];
			var poundageAmount = self.model.get('poundageAmount'),
				poundageMinAmount = self.model.get('poundageMinAmount'),
				warningTextTpl = '<p class="alert alert-warning ">'
					+ '由于提现操作需要向银行缴纳交易手续费<strong>{poundageAmount}</strong>元人民币，<br/>' 
					+ '当提现金额高于<strong>{poundageMinAmount}</strong>(包含<strong>{poundageMinAmount}</strong>)元人民币，手续费由<strong>北京多来点信息技术有限公司</strong>支付；<br/>'
					+ '当提现金额低于<strong>{poundageMinAmount}</strong>元人民币，手续费由<strong>{settleUnitName}</strong>支付。<br/>'
					+ '</p>';
			var warningText = '';
			if (!IX.isEmpty(poundageAmount) && poundageAmount != 0) {
				warningText = warningTextTpl.replaceAll('{poundageAmount}', poundageAmount)
					.replaceAll('{poundageMinAmount}', poundageMinAmount)
					.replaceAll('{settleUnitName}', self.model.get('settleUnitName'));
			}
			var accountInfo = _.map(accountInfoKeys, function (el) {
				var k = $XP(el, 'key');
				var valStr = '';
				switch(k) {
					case 'poundageAmount':
						valStr = self.mapPoundageAmountStr(self.model.get(k));
						break;
					case 'poundageMinAmount':
						valStr = self.mapPoundageMinAmountStr(self.model.get(k));
						break;
					case 'settleBalance':
						valStr = ('<strong>' + self.model.get(k) + '</strong>元');
						break;
					default :
						valStr = self.model.get(k);
						break;
				}
				return {
					label : $XP(el, 'label', ''),
					value : valStr
				};
			});

			return {
				accountInfo : accountInfo,
				warningText : warningText,
				formClz : 'account-withdraw-form form-feedback-out',
				labelClz : 'col-sm-4 control-label',
				clz : 'col-sm-7',
				id : 'transAmount',
				label : '请输入提现金额',
				name : 'transAmount',
				value : self.model.get('settleBalance')
			};
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl(renderData);
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'submit', label : '立即提现'}
				]
			}));
		},
		bindEvent : function () {
			var self = this;
			this.on({
				show : function () {
					this.modal.show();
				},
				hide : function () {
					this.modal.hide();
					this.parentView.emit('updateSettleBalance', self.model);
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
				fields : {
					transAmount : {
						validators : {
							notEmpty : {
								message : "请输入提现金额"
							},
							numeric : {
								message: "提现金额必须为数字"
							},
							greaterThan : {
								inclusive : false,
								value : self.model.get('poundageAmount') || 0,
								message : "提现金额必须大于" + self.model.get('poundageAmount') || 0
							},
							lessThan : {
								inclusive : true,
								value : self.model.get('settleBalance'),
								message : "提现金额不能超过账户余额"
							},
							accuracy : {
								accuracy : 2,
								message : "输入现金只能精确到小数点后2位"
							}
						}
					}
				}
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				var formParams = self.serializeForm();
				self.model.emit('withdrawCash', {
					params : formParams,
					failFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
					},
					successFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
						self.emit('hide');
					}
				})
			});
		},
		serializeForm : function () {
			var self = this,
				$body = self.modal._.body;
			return {
				transAmount : $body.find('#transAmount').val()
			};
		}

	});

	Hualala.Account.WithdrawCashView = WithdrawCashView;

	var QueryTransFormElsCfg = {
		transCreateTime : {
			type : 'section',
			label : '日期',
			min : {
				type : 'datetimepicker',
				surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		transAmount : {
			type : 'section',
			label : '金额',
			min : {
				type : 'text',
				prefix : '￥',
				surfix : '元',
				defaultVal : '',
				validCfg : {
					validators : {
						numeric : {
							message: "金额必须为数字"
						},
						greaterThan : {
							inclusive : true,
							value : 0,
							message : "金额必须大于或等于0"
						}
					}
				}
			},
			max : {
				type : 'text',
				prefix : '￥',
				surfix : '元',
				defaultVal : '',
				validCfg : {
					validators : {
						numeric : {
							message: "金额必须为数字"
						},
						greaterThan : {
							inclusive : true,
							value : 0,
							message : "金额必须大于或等于0"
						}
					}
				}
			}
		},
		transStatus : {
			type : 'combo',
			label : '状态',
			defaultVal : '',
			options : Hualala.TypeDef.FSMTransStatus,
			validCfg : {
				validators : {
					
				}
			}
		},
		transType : {
			type : 'combo',
			label : '类型',
			defaultVal : '',
			options : Hualala.TypeDef.FSMTransType,
			validCfg : {
				validators : {
					
				}
			}
		},
		button : {
			type : 'button',
			clz : 'btn btn-block btn-warning',
			label : '查询'
		}
	};
	var QueryTransFormElsHT = new IX.IListManager();
	_.each(QueryTransFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-2 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k == 'transCreateTime' ? 'transCreateBeginTime' : 'minTransAmount',
				maxName = k == 'transCreateTime' ? 'transCreateEndTime' : 'maxTransAmount',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-5',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-5',
				});
			QueryTransFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else {
			QueryTransFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
			}, $XP(el, 'type') !== 'button' ? {clz : 'col-xs-5 col-sm-8 col-md-5'} : null));
		}
	});
	var TransResultCols = [
		{clz : '', label : '时间'},
		{clz : '', label : '流水号'},
		{clz : '', label : '交易状态'},
		{clz : '', label : '交易类型'},
		{clz : '', label : '交易金额'},
		// {clz : '', label : '佣金'},
		// {clz : '', label : '手续费'},
		{clz : '', label : '交易费用'},
		{clz : '', label : '余额变动'},
		{clz : '', label : '交易后余额'},
		{clz : '', label : '操作'}
	];

	var AccountTransListView = CardListView.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 查询表单
			this.$queryForm = null;
			// 结果容器
			this.$resultBox = null;
			// 分页容器
			this.$pager = null;
			this.loadTemplates();
		}
	});
	AccountTransListView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_detail')),
				tableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_transaQuery_result'));
			Handlebars.registerPartial("transaQueryForm", Hualala.TplLib.get('tpl_transaQuery_form'));
			Handlebars.registerPartial("transaQueryResult", Hualala.TplLib.get('tpl_transaQuery_result'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				tableTpl : tableTpl
			});
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var result = [],
				tblClz = 'table-bordered table-striped table-hover ix-data-report',
				tblHeaders = TransResultCols,
				query = {cols : [
					{
						colClz : 'col-sm-6',
						items : QueryTransFormElsHT.getByKeys(['transCreateTime', 'transAmount'])
					},
					{
						colClz : 'col-sm-4',
						items : QueryTransFormElsHT.getByKeys(['transType', 'transStatus'])
					},
					{
						colClz : 'col-sm-2',
						items : QueryTransFormElsHT.getByKeys(['button'])
					}
				]};
			var htm = layoutTpl({
				query : query,
				result : {
					clz : tblClz,
					thead : tblHeaders,
					rows : result
				}
			});
			this.$container.html(htm);
			this.$queryForm = this.$container.find('.query-form');
			this.$resultBox = this.$container.find('.query-result');
			this.$pager = this.$container.find('.page-selection');
			this.render();
			// this.initPager();
			this.initQueryEls();
			this.bindEvent();
			this.bindQueryEvent();
		},
		initQueryEls : function () {
			var self = this;
			self.$queryForm.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
			self.$queryForm.on('click', '.input-group-addon', function (e) {
				var $this = $(this),
					$picker = $this.prev(':text[data-type=datetimepicker]');
				if ($picker.length > 0) {
					$picker.datetimepicker('show');
				}
			});
		},
		bindEvent : function () {
			var self = this;
			self.$resultBox.tooltip({
				selector : '[title]'
			});
			self.$resultBox.on('click', '.btn[data-href]', function (e) {
				var $btn = $(this),
					path = $btn.attr('data-href');
				if (!IX.isEmpty(path)) {
					document.location.href = path;
				}
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
		},
		bindQueryEvent : function () {
			var self = this;
			self.$resultBox.on('click', 'a[data-orderkey]', function (e) {
				var $btn = $(this),
					orderKey = $btn.attr('data-orderkey') || '',
					transType = $btn.attr('data-type') || '',
					transID = $btn.attr('data-id') || '',
					orderID = $btn.attr('data-orderid') || '';
				// TODO show transaction detail modal
				var detail = new Hualala.Account.AccountTransDetailModal({
					triggerEl : $btn,
					orderKey : orderKey,
					orderID : orderID,
					transType : transType,
					transID : transID
				});
			});
			self.$queryForm.on('click', '.btn', function (e) {
				// TODO Update modal params and render query result
				var params = self.getQueryFormParams();
				self.model.emit('load', params);
			});
		},
		getQueryFormParams : function () {
			var self = this;
			// var formKeys = ['transCreateBeginTime', 'transCreateEndTime', 'minTransAmount', 'maxTransAmount', 'transType', 'transStatus'];
			var params = self.$queryForm.find('>form').serializeArray();
			var ret = {};
			_.each(params, function (el, i) {
				var k = $XP(el, 'name'), v = $XP(el, 'value', '');
				switch(k) {
					case 'transCreateBeginTime':
					case 'transCreateEndTime':
						if (IX.isEmpty(v)) {
							v = '';
						} else {
							v = IX.Date.getDateByFormat(v, 'yyyyMMddHHmmss');
						}
						break;
					default :
						v = IX.isEmpty(v) ? '' : v;
						break;
				}
				ret[k] = v;
			});
			IX.Debug.info("DEBUG: Account TransList View Query Form Params : ");
			IX.Debug.info(ret);
			return ret;
		},
		mapTimeData : function (s) {
			var r = {value : '', text : '', clz : 'date'};
			var s1 = '';
			if (IX.isString(s) && s.length > 0) {
				s1 = s.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
				s1 = IX.Date.getDateByFormat(s1, 'yyyy/MM/dd HH:mm');
				r = IX.inherit({value : s, text : s1});
			}
			return r;
		},
		mapTransStatus : function (s) {
			s = (s + "") || '';
			var status = Hualala.TypeDef.FSMTransStatus;
			var m = _.filter(status, function (el) {
				return $XP(el, 'value', '') == s;
			});
			if (s.length == 0 || m.length == 0) {
				return {text : '', value : ''};
			}
			return {text : $XP(m[0], 'label', ''), value : $XP(m[0], 'value', ''), clz : 'status'};
		},
		mapTransType : function (s) {
			s = s || '';
			var types = Hualala.TypeDef.FSMTransType;
			var m = _.filter(types, function (el) {
				return $XP(el, 'value', '') == s;
			});
			if (s.length == 0 || m.length == 0) {
				return {text : '', value : ''};
			}
			return {text : $XP(m[0], 'label', ''), value : $XP(m[0], 'value', ''), clz : 'text'};
		},
		mapCashData : function (s) {
			return {text : Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(s)), value : s, clz : 'number'};
		},
		mapTransChanged : function (r) {
			var transAmount = $XP(r, 'transAmount', 0),
				transSalesCommission = $XP(r, 'transSalesCommission', 0),
				transPoundage = $XP(r, 'transPoundage', 0),
				transChanged = Hualala.Common.Math.sub(transAmount, transSalesCommission, transPoundage);
			return {value : transChanged, text : Hualala.Common.Math.prettyNumeric(transChanged), clz : 'number'};
		},
		mapColsRenderData : function (row) {
			var self = this;
			var colKeys = 'transCreateTime,SUATransItemID,transStatus,transType,transAmount,transactionCost,transChanged,transAfterBalance,rowControl';
			var col = {clz : '', type : 'text'};

			var cols = _.map(colKeys.split(','), function (k, i) {
				var r = null;
				switch(k) {
					case 'transCreateTime':
						r = self.mapTimeData($XP(row, k, ''));
						break;
					case 'SUATransItemID':
						r = {value : $XP(row, k, ''), text : $XP(row, k, ''), clz : 'number'};
						break;
					case 'transStatus':
						r = self.mapTransStatus($XP(row, k, ''));
						break;
					case 'transType':
						r = self.mapTransType($XP(row, k, ''));
						break;
					case 'transAmount':
					// case 'transSalesCommission':
					// case 'transPoundage':
					case 'transAfterBalance':
						r = self.mapCashData($XP(row, k, ''));
						break;
					case 'transactionCost':
						var transSalesCommission = $XP(row, 'transSalesCommission', 0), transPoundage = $XP(row, 'transPoundage', 0);
						var transactionCost = Hualala.Common.Math.add(transSalesCommission, transPoundage);
						r = self.mapCashData(transactionCost);
						break;
					case 'transChanged':
						r = self.mapTransChanged(row);
						break;
					case 'rowControl':
						var transType = $XP(row, 'transType', ''),
							transStatus = $XP(row, 'transStatus', '');
						var hideBtnTransType = "104,199,202,203,204,205,206,299";
						r = {
							type : 'button',
							btnClz : (hideBtnTransType.indexOf(transType) >= 0 || (transType == "203" && transStatus < 1)) ? 'hidden' : '',
							label : '查看',
							SUATransItemID : $XP(row, 'SUATransItemID', ''),
							transType : transType,
							orderKey : $XP(row, 'orderKey', ''),
							orderID : $XP(row, 'orderID', '')
						};
						break;
				}
				return IX.inherit(col, r);
			});
			return cols;
		},
		mapRenderData : function (data) {
			var self = this;
			var tblClz = 'table-bordered table-striped table-hover ix-data-report',
				tblHeaders = TransResultCols;
			var rows = _.map(data, function (row) {
				return {
					clz : '',
					cols : self.mapColsRenderData(row)
				};
			});
			return {
				clz : tblClz,
				isEmpty : data.length == 0 ? true : false,
				colCount : tblHeaders.length,
				thead : tblHeaders,
				rows : rows
			};
		},
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var results = model.getDataByPageNo(pageNo);
			var renderData = self.mapRenderData(results);
			var tableTpl = self.get('tableTpl');
			var html = tableTpl(renderData);
			self.$resultBox.empty();
			self.$resultBox.html(html);
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		}
	});
	Hualala.Account.AccountTransListView = AccountTransListView;

	var AccountQueryShopView = Hualala.Shop.QueryView.subclass({
		constructor : Hualala.Shop.QueryView.prototype.constructor
	});
	Hualala.Account.AccountQueryShopView = AccountQueryShopView;

	var AccountQueryShopResultView = CardListView.subclass({
		constructor : CardListView.prototype.constructor
	});
	AccountQueryShopResultView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_table'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTable", Hualala.TplLib.get('tpl_shop_table'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			
			var ret = _.map(data, function (shop, i, l) {
				return {
					clz : '',
					id : $XP(shop, 'shopID', ''),
					name : $XP(shop, 'shopName', ''),
					city : $XP(shop, 'cityName', '')
				};
			});
			return {
				shopTable : {
					isEmpty : !data || data.length == 0 ? true : false,
					colCount : 3,
					rows : ret
				}
			};
		},
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.$list.empty();
			self.$list.html(html);
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		}
	});
	Hualala.Account.AccountQueryShopResultView = AccountQueryShopResultView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var AccountListModel = Hualala.Account.AccountListModel;
	var AccountListView = Hualala.Account.AccountListView;
	var ShopListController = Hualala.Shop.ShopListController;

	var QueryModel = Hualala.Shop.QueryModel;
	var QueryView = Hualala.Shop.QueryView;
	var QueryController = Hualala.Shop.QueryController;

	var AccountListController = ShopListController.subclass({
		/**
		 * 结算账户列表控制器
		 * @param  {Object} cfg 配置参数
		 *          @param {JQueryObj} container 容器
		 *          @param {Object} view  结果的View模块实例
		 *          @param {Object} model 结果的数据模块实例
		 * @return {Object}     
		 */
		constructor : ShopListController.prototype.constructor
	});


	Hualala.Account.AccountListController = AccountListController;

	var AccountQueryShopController = QueryController.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.settleUnitID = $XP(cfg, 'settleUnitID', '');
			this.settleName = $XP(cfg, 'settleName', '');
			this.shopCount = $XP(cfg, 'shopCount', '');
			this.container = $XP(cfg, 'container', null);
			this.needShopCreate = false;
			this.model = new Hualala.Account.AccountQueryShopModel();
			this.view = new Hualala.Account.AccountQueryShopView();
			this.resultContainer = $XP(cfg, 'resultContainer', null);
			this.resultController = new Hualala.Account.AccountQueryShopResultController({
				container : this.resultContainer,
				model : new Hualala.Account.AccountQueryShopResultModel(),
				view : new Hualala.Account.AccountQueryShopResultView()
			})
			this.init();
		}
	});
	AccountQueryShopController.proto({
		init : function () {
			var self = this;
			self.bindEvent();
			self.model.emit('load', function () {
				if (!self.model.hasReady()) {
					throw("Shop Query Init Failed!!");
					return;
				}
				self.resultController.initDataStore(self.model.getShops());
				// 加载View层
				self.view.emit('init');
				
			});
		},
		// 绑定事件
		bindEvent : function () {
			// 控制器的事件绑定
			this.on({
				reload : function () {
					var self = this;
					self.model.distory();
					self.view.distory();
					self.init();
				},
				query : function (params) {
					var self = this;
					IX.Debug.info('DEBUG: Account Query Shops Params:');
					IX.Debug.info(params);
					self.resultController && self.resultController.emit('load', IX.inherit(params, {
						pageNo : 1,
						pageSize : 15
					}));
				}
			}, this);
			// 模型的事件绑定
			this.model.on({
				load : function (cbFn) {
					var self = this,
						params = {
							settleUnitID : self.settleUnitID,
							settleName : self.settleName,
							shopCount : self.shopCount
						};
						// params = $XP(self.get('sessionData'), 'user', {});
					self.model.init(params, cbFn);
				}
			}, this);
			// 视图事件绑定
			this.view.on({
				init : function () {
					var self = this;
					self.view.init({
						model : self.model,
						needShopCreate : self.needShopCreate,
						container : self.container
					});
				},
				// 过滤操作，触发显示结果
				filter : function (params) {
					var self = this;
					self.emit('query', params);
					//TODO 重置Query的chosenPanel
				},
				// 搜索操作，触发显示结果
				query : function (params) {
					var self = this;
					self.emit('query', params);
				}
			}, this);
		}
	});
	Hualala.Account.AccountQueryShopController = AccountQueryShopController;

	var AccountQueryShopResultController = Hualala.Shop.ShopListController.subclass({
		constructor : Hualala.Shop.ShopListController.prototype.constructor
	});
	AccountQueryShopResultController.proto({
		initDataStore : function (data) {
			this.model.initDataStore(data);
		},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					self.model.emit('load', params);
				}
			}, this);
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
					};
					self.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				},
				reloadPager : function () {
					var self = this;
					self.view.initPager(params);
				}
			}, this);
		}
	});
	Hualala.Account.AccountQueryShopResultController = AccountQueryShopResultController;
	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	var BaseAccountModel = Hualala.Account.BaseAccountModel;

	/*账户管理控制器*/
	var AccountMgrController = Stapes.subclass({
		/**
		 * 构造控制器
		 * @param  {Object} cfg {container, settleUnitID, accountModel, mgrView, transaDetailCtrl}
		 * @return {Object}     AccountMgrController实例
		 */
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container', null);
			this.settleUnitID = $XP(cfg, 'settleUnitID', null);
			this.model = $XP(cfg, 'accountModel', null);
			this.view = $XP(cfg, 'mgrView', null);
			this.transaDetailCtrl = $XP(cfg, 'transaDetailCtrl', null);
			if (!this.container || !this.model || !this.view || !this.transaDetailCtrl) {
				throw("Account Detail Mgr Init Failed!!");
				return ;
			}
			this.init();
		}
	});
	AccountMgrController.proto({
		// 初始化控制器
		init : function () {
			var self = this;
			self.bindEvent();
			self.model.emit('load', {
				settleUnitID : self.settleUnitID,
				cbFn : function () {
					self.view.emit('init', {
						model : self.model,
						container : self.container
					});
					self.view.emit('render');
				}
			});
		},
		// 控制器绑定事件
		bindEvent : function () {
			this.on({
				// 触发交易明细控制器进行查询
				query : function () {
					var self = this;
					
				}
			}, this);
			
			this.view.on({
				init : function (params) {
					var self = this;
					self.view.init(params);
					self.transaDetailCtrl.init({
						container : self.container.find('.account-detail-box'),
						settleUnitID : self.settleUnitID
					});
				},
				render : function () {
					var self = this;
					self.view.render();
				}
			}, this);
		}
	});

	Hualala.Account.AccountMgrController = AccountMgrController; 

	/*交易明细控制器*/
	var TransactionDetailController = Stapes.subclass({
		constructor: function () {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = null;
			this.settleUnitID = null;
			this.model = new Hualala.Account.AccountTransListModel();
			this.view = new Hualala.Account.AccountTransListView();
			
		}
	});
	TransactionDetailController.proto({
		init : function (cfg) {
			var self = this;
			self.container = $XP(cfg, 'container', null);
			self.settleUnitID = $XP(cfg, 'settleUnitID', '');
			self.loadingModal = new LoadingModal({
				start : 100
			});
			if (!this.container || !this.model || !this.view) {
				throw("Account Transaction Detail Mgr Init Failed!!");
				return ;
			}
			self.bindEvent();
			self.model.init({
				
				groupID : $XP(self.get('sessionData'), 'site.groupID'),
				settleUnitID : self.settleUnitID
			});
			self.model.emit('load', {
				pageNo : 1, pageSize : 15,
				cbFn : function (model) {
					self.view.emit('init', {
						container : self.container,
						model : model
					});
					self.loadingModal.hide();
				}
			});
		},
		bindEvent : function () {
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = $XP(params, 'cbFn', function () {
						self.view.emit('render');
						self.loadingModal.hide();
					});
					self.loadingModal.show();
					this.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				init : function (cfg) {
					this.view.init(cfg);
				},
				render : function () {
					this.view.render();
				}
			}, this);
		}
	});
	Hualala.Account.TransactionDetailController = TransactionDetailController;
})(jQuery, window);
;(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

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
						settleBalance = Hualala.Common.Math.prettyNumeric(mAccount.get('settleBalance'));
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
				shopCount = parseInt(model.get('shopCount') || 0),
				disableWithdraw = settleBalance <= 0 ? 'disabled' : '';

			accountCard = {
				clz : 'pull-left',
				settleUnitID : settleUnitID,
				hasDefault : hasDefault,
				settleUnitName : model.get('settleUnitName') || '',
				disableWithdraw : disableWithdraw,
				settleBalance : settleBalance,
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
						v = Hualala.Common.Math.prettyPrice(v);
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
					acc[k] = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.prettyPrice(el));
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
					acc[k] = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.prettyPrice(el));
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

	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Account");
	var initAccountListPage = function () {
		var $body = $('#ix_wrapper > .ix-body > .container');
		var accountListPanel = new Hualala.Account.AccountListController({
			container : $body,
			view : new Hualala.Account.AccountListView(),
			model : new Hualala.Account.AccountListModel({
				callServer : Hualala.Global.queryAccount
			})
		});
		accountListPanel.emit('load', {
			pageNo : 1,
			pageSize : 15
		});
	};

	var initAccountMgrPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		var accountMgrCtrl = new Hualala.Account.AccountMgrController({
			container : $body,
			settleUnitID : $XP(ctx, 'params', [])[0],
			accountModel : new Hualala.Account.BaseAccountModel(),
			mgrView : new Hualala.Account.AccountMgrView(),
			transaDetailCtrl : new Hualala.Account.TransactionDetailController()
		});
		// $body.html("<h1>结算账户管理页面</h1>");
	};

	Hualala.Account.AccountMgrInit = initAccountMgrPage;
	
	Hualala.Account.AccountListInit = initAccountListPage;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var OrderQueryResultModel = Stapes.subclass({
		/**
		 * 构造订单查询结果的数据模型 
		 * @param  {Object} cfg	配置信息
		 * 		@param {Function} callServer 获取数据接口
		 * 		@param {Array} queryKeys 搜索条件字段序列
		 * 		@param {Array} cities 城市数据
		 * 		@param {Function} initQueryParams 初始化搜索条件
		 * 		@param {Boolean} hasPager 是否支持分页true:支持；false：不支持.default true
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return ;
			}
			this.cities = $XP(cfg, 'cities', []);
			this.statisticKeys = 'count,foodAmount,giftAmountTotal,orderRefundAmount,orderRegAmount,orderTotal,orderAmount,shouldSettlementTotal,total';
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			this.pagerKeys = 'pageCount,totalSize,pageNo,pageSize'.split(',');
			this.queryParamsKeys = null;
			this.hasPager = $XP(cfg, 'hasPager', true);
			this.recordModel = $XP(cfg, 'recordModel', BaseOrderRecordModel);
			var initQueryParams = $XF(cfg, 'initQueryParams');
			initQueryParams.apply(this);
		}
	});

	OrderQueryResultModel.proto({
		init : function (params, cities) {
			this.cities = cities || this.cities;
			this.set(IX.inherit({
				ds_record : new IX.IListManager(),
				ds_page : new IX.IListManager(),
				ds_statistic : new IX.IListManager(),
			}, this.hasPager ? {
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15)
			} : {}));
			this.queryParamsKeys = !this.hasPager ? this.queryKeys : this.queryKeys.concat(this.pagerKeys);
		},
		updatePagerParams : function (params) {
			var self = this;
			var queryParamsKeys = self.queryParamsKeys.join(',');
			_.each(params, function (v, k, l) {
				if (queryParamsKeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			var self = this;
			var ret = {};
			_.each(self.queryParamsKeys, function (k) {
				ret[k] = self.get(k);
			});
			return ret;
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				recordHT = self.get('ds_record'),
				pageHT = self.get('ds_page');
			pageNo = self.hasPager ? pageNo : 1;
			var recordIDs = _.map(data, function (r, i, l) {
				var id = pageNo + '_' + IX.id(),
					mRecord = new self.recordModel(IX.inherit(r, {
						'__id__' : id
					}));
				recordHT.register(id, mRecord);
				return id;
			});
			pageHT.register(pageNo, recordIDs);
		},
		updateStatisticDataStore : function (data) {
			var self = this,
				statisticHT = self.get('ds_statistic');
			_.each(self.statisticKeys.split(','), function (k) {
				var v = $XP(data, k, '');
				statisticHT.register(k, v);
			});
		},
		resetDataStore : function () {
			this.recordHT.clear();
			this.pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams($XP(res, 'data.page', {}));
					self.updateStatisticDataStore($XP(res, 'data', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getRecordsByPageNo : function (pageNo) {
			var self = this,
				recordHT = self.get('ds_record'),
				pageHT = self.get('ds_page');
			pageNo = !self.hasPager ? 1 : pageNo;
			var ret = _.map(recordHT.getByKeys(pageHT.get(pageNo)), function (mRecord, i, l) {
				return mRecord.getAll();
			});
			IX.Debug.info("DEBUG: Order Query Result Model PageData");
			IX.Debug.info(ret);
			return ret;
		},
		getRecordModelByID : function (id) {
			var self = this,
				recordHT = self.get('ds_record');
			return recordHT.get(id);
		},
		getCityByCityID : function (cityID) {
			if (IX.isEmpty(cityID)) return null;
			var l = this.cities;
			var m = _.find(l, function (el) {
				return $XP(el, 'cityID') == cityID;
			});
			return m;
		},
		getStatisticData : function () {
			var self = this,
				statisticHT = self.get('ds_statistic'),
				ret = {};
			_.each(self.statisticKeys.split(','), function(k) {
				ret[k] = statisticHT.get(k);
			});
			return ret;
		}
	});

	Hualala.Order.OrderQueryResultModel = OrderQueryResultModel;

	/*订单查询结果基础数据模型 */
	var BaseOrderRecordModel = Stapes.subclass({
		constructor : function (order) {
			this.set(order);
		}
	});
	BaseOrderRecordModel.proto({

	});
	Hualala.Order.BaseOrderRecordModel = BaseOrderRecordModel;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;


	var OrderQueryTableHeaderCfg = [
		{key : "cityID", clz : "text", label : "城市"},
		{key : "shopName", clz : "text", label : "店铺名称"},
		{key : "orderID", clz : "number", label : "订单号"},
		{key : "userName", clz : "text", label : "客户姓名"},
		{key : "orderTime", clz : "date", label : "就餐时间"},
		{key : "orderStatus", clz : "status", label : "订单状态"},
		{key : "orderTotal", clz : "number", label : "应付金额"},
		{key : "moneyBalance", clz : "number", label : "会员卡支付"},
		{key : "pointBalance", clz : "number", label : "会员卡积分支付"},
		{key : "orderRefundAmount", clz : "number", label : "退订/退款"},
		{key : "total", clz : "number", label : "应结金额"},
		{key : "shouldSettlementTotal", clz : "number", label : "结算金额"},
		{key : "rowControl", clz : "", label : "操作"}
	];
	var OrderQueryDuringTableHeaderCfg = [
		{key : "cityID", clz : "text", label : "城市"},
		{key : "billDate", clz : "date", label : "日期"},
		{key : "count", clz : "number", label : "订单数"},
		{key : "giftAmountTotal", clz : "number", label : "代金券总金额"},
		{key : "orderTotal", clz : "number", label : "订单支付金额"},
		{key : "orderWaitTotal", clz : "number", label : "待消费订单金额"},
		{key : "orderRegAmount", clz : "number", label : "退款金额"},
		{key : "orderRefundAmount", clz : "number", label : "退订金额"},
		{key : "total", clz : "number", label : "成交金额"},
		{key : "orderTotal", clz : "number", label : "线下金额"},
		{key : "rowControl", clz : "", label : "操作"}
	];

	var OrderQueryDishHotTableHeaderCfg = [
		{key : "index", clz : "number", label : "序号"},
		{key : "foodName", clz : "text", label : "菜品名称"},
		{key : "foodCategoryName", clz : "text", label : "分类名称"},
		{key : "sumPrice", clz : "number", label : "平均价格"},
		{key : "sumMaster", clz : "number", label : "销售份数"}
	];

	var OrderQueryUserTableHeaderCfg = [
		{key : "userName", clz : "text", label : "姓名"},
		{key : "userSex", clz : "text", label : "性别"},
		{key : "userLoginMobile", clz : "text", label : "手机号"},
		{key : "sumRecord", clz : "number", label : "订餐次数"},
		{key : "foodAmount", clz : "number", label : "订餐金额"},
		{key : "minOrderTime", clz : "date", label : "首次订餐时间"},
		{key : "maxOrderTime", clz : "date", label : "最近订餐时间"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
			pagerParams = self.model.getPagerParams(), queryKeys = self.model.queryKeys;
		var r = {value : "", text : ""}, v = $XP(row, colKey, '');
		switch(colKey) {
			case "cityID":
				v = self.getCityByCityID(v);
				r.value = $XP(v, 'cityID', '');
				r.text = $XP(v, 'cityName', '');
				break;
			case "userName":
				var m = $XP(row, 'userMobile', ''),
					s = Hualala.Common.getGender($XP(row, 'userSex', ''));
				var _shortName = Hualala.Common.substrByte(v, 10) + '...';
				s = IX.isEmpty(s) ? '' : '(' + $XP(s, 'label', '') + ')';
				m = IX.isEmpty(m) ? '' : '(' + m + ')';
				r.value = $XP(row, 'userID', '');
				r.text = _shortName + s + m;
				break;
			case "orderTime":
			case "minOrderTime":
			case "maxOrderTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "orderStatus":
				v = Hualala.Common.getOrderStatus(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "billDate":
				r.value = v;
				r.text = IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy/MM/dd');
				break;
			case "index" :
				r.value = rowIdx;
				r.text = rowIdx + 1;
				break;
			case "sumMaster":
				r.value = v;
				r.text = v + "&nbsp;" + $XP(row, 'foodUnit', '');
				break;
			case "sumPrice":
				r.value = v || 0;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(Hualala.Common.Math.div(r.value, $XP(row, 'sumMaster', 1))));
				break;
			case "userSex":
				r.value = v;
				r.text = $XP(Hualala.Common.getGender($XP(row, 'userSex', '')), 'label', '');
				break;
			case "total" : 
			case "orderTotal":
			case "moneyBalance":
			case "pointBalance":
			case "orderRefundAmount":
			case "shouldSettlementTotal":
				r.value = v;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v));
				break;
			case "foodAmount" :
				r.value = v;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v));
			case "rowControl" :
				if (pageName == 'orderQuery') {
					r = {
						type : 'button',
						btns : [
							{
								label : '查看详情', 
								link : 'javascript:void(0);', 
								clz : 'query-order-detail', 
								id : $XP(row, 'orderID', ''),
								key : $XP(row, 'orderKey', ''), 
								type : ''
							}
						]
					};
				} else if (pageName == 'orderQueryDay' || pageName == 'orderQueryDuring' ) {
					pagerParams = IX.inherit(pagerParams, {
						shopID : $XP(row, 'shopID', '')
					});
					if (pageName == "orderQueryDay") {
						pagerParams = IX.inherit(pagerParams, {
							startDate : $XP(row, 'billDate', ''),
							endDate : $XP(row, 'billDate', '')
						});
					}
					var n = pageName == "orderQueryDuring" ? "orderQueryDay" : "orderQuery",
						params = _.map(queryKeys, function (k) {
							return $XP(pagerParams, k, '');
						}),
						link = '';
						if (n == 'orderQuery') {
							params = params.concat(['','','','']);
						}
						link = Hualala.PageRoute.createPath(n, params);
					r = {
						type : 'button',
						btns : [
							{
								label : '查看详情', 
								link : link, 
								clz : '', 
								id : '', 
								type : ''
							}
						]
					};
				}
				break;
			default : 
				r.value = r.text = $XP(row, colKey, '');
				break;
		}
		return r;
	};

	/**
	 * 格式化需要渲染的结果数据
	 * @param {Array|Object} records 搜索结果数据 
	 * @return {Array|Obejct}	格式化后的渲染数据
	 */
	Hualala.Order.mapQueryOrderResultRenderData = function (records) {
		var self = this;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = OrderQueryTableHeaderCfg,
			statisticData = self.model.getStatisticData();
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});
		var statisticKeys = 'orderTotal,orderRefundAmount,total,shouldSettlementTotal';
		var ftCols = _.map(statisticKeys.split(','), function (k) {
			var v = $XP(statisticData, k, 0), rowspan = 1, clz = '', 
				colspan = k == "orderTotal" ? 3 : 1;

			return {
				clz : clz,
				colspan : colspan,
				rowspan : rowspan,
				text : Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v)),
				value : v
			};
		});
		ftCols.unshift({
			clz : 'title', colspan : '6', rowspan : '1', value : '', text : '共计：'
		});
		ftCols.push({clz : '', colspan : '', rowspan : '', value : '', text : ''});
		var tfoot = [{
			clz : '',
			cols : ftCols
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};
	/**
	 * 格式化需要渲染的结果数据（区间汇总，日汇总 ）
	 * @param  {[type]} records
	 * @return {[type]}
	 */
	Hualala.Order.mapQueryOrderDuringRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var pageName = $XP(ctx, 'name');
		var pagerParams = self.model.getPagerParams();
		var queryKeys = self.model.queryKeys;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = IX.clone(OrderQueryDuringTableHeaderCfg),
			statisticData = self.model.getStatisticData();;
		if (pageName == 'orderQueryDuring') {
			tblHeaders = _.map(tblHeaders, function (el) {
				var key = $XP(el, 'key', '');
				if (key == 'billDate') {
					el = IX.inherit(el, {
						key : 'shopName', label : "店铺名称"
					});
				}
				return el;
			});
		}
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return _.pick(el, 'key', 'clz');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});
		var statisticKeys = 'count,giftAmountTotal,orderTotal,orderWaitTotal,orderRegAmount,orderRefundAmount,total,orderAmount';
		var ftCols = _.map(statisticKeys.split(','), function (k) {
			var v = $XP(statisticData, k, 0), rowspan = 1, clz = '', 
				colspan = 1;

			return {
				clz : clz,
				colspan : colspan,
				rowspan : rowspan,
				text : (k == 'count' ? Hualala.Common.Math.prettyNumeric(v) : Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v))),
				value : v
			};
		});
		ftCols.unshift({
			clz : 'title', colspan : '2', rowspan : '1', value : '', text : '共计：'
		});
		ftCols.push({clz : '', colspan : '', rowspan : '', value : '', text : ''});
		var tfoot = [{
			clz : '',
			cols : ftCols
		}];
		return {
			clz : clz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			tblClz : tblClz,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};
	/**
	 * 格式化菜品排行榜渲染数据
	 * @param  {[type]} records
	 * @return {[type]}
	 */
	Hualala.Order.mapQueryDishesHotRenderData = function (records) {
		var self = this;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = OrderQueryDishHotTableHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return _.pick(el, 'key', 'clz');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows
		};
	};

	/**
	 * 格式化用户统计排行榜渲染数据
	 * @param  {[type]} records
	 * @return {[type]}
	 */
	Hualala.Order.mapQueryUserRenderData = function (records) {
		var self = this;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = OrderQueryUserTableHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return _.pick(el, 'key', 'clz');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});

		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows
		};
	};

	/**
	 * 渲染结果页面
	 * @param  {Array|Object} data 	需要渲染成页面的数据
	 * @return {NULL}
	 */
	Hualala.Order.renderQueryOrderResult = function (data) {
		var self = this;
		self.$result.empty();
		self.$result.html(self.get('resultTpl')(data));
	};

	var OrderQueryResultView = Stapes.subclass({
		/**
		 * 构造View层
		 * @param  {Object} cfg
		 * 			@param {Function} mapResultRenderData 格式化渲染数据
		 * 			@param {Function} renderResult 渲染方法
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.$container = null;
			this.$resultBox = null;
			this.$result = null;
			this.$pager = null;
			this.set('mapResultRenderData', $XF(cfg, 'mapResultRenderData'));
			this.set('renderResult', $XF(cfg, 'renderResult'));
			this.loadTemplate();
		}
	});
	OrderQueryResultView.proto({
		/**
		 * 初始化View层
		 * @param  {Object} cfg
		 * 			@param {jQueryObj} container 容器
		 * 			@param {Object} model 搜索结果数据模型
		 * @return 
		 */
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("Query Result View Init Faild!");
				return;
			}
			this.initLayout();
		},
		loadTemplate : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				resultTpl : resultTpl
			});
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$result = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
		},
		initPager : function (params) {
			var self = this;
			if (!self.model.hasPager) return;
			var baseCfg = {total : 0, page : 1, maxVisible : 10, leaps : true};
			this.$pager.IXPager(IX.inherit(baseCfg, params));
		},
		bindEvent : function () {
			var self = this;
			self.model.hasPager && self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
			self.$resultBox.on('click', 'a.query-order-detail', function (e) {
				var $btn = $(this),
					orderKey = $btn.attr('data-key'),
					orderID = $btn.attr('data-id'),
					transType = '101';
				var detail = new Hualala.Account.AccountTransDetailModal({
					triggerEl : $btn,
					orderKey : orderKey,
					orderID : orderID,
					transType : transType,
					transID : ''
				});

			});
		},
		mapRenderData : function (records) {
			var mapFn = this.get('mapResultRenderData');
			var ret = IX.isFn(mapFn) ? mapFn.apply(this, arguments) : null;
			return ret;
		},
		renderRecords : function (data) {
			var renderFn = this.get('renderResult');
			IX.isFn(renderFn) && renderFn.apply(this, arguments);
		},
		render : function () {
			var self = this,
				model = self.model,
				hasPager = model.hasPager,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo', 1);
			var records = model.getRecordsByPageNo(pageNo);
			var renderData = self.mapRenderData(records);
			self.renderRecords(renderData);
			hasPager && self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		},
		getCityByCityID : function (cityID) {
			var self = this;
			var c = self.model.getCityByCityID(cityID);
			return c;
		}
	});

	Hualala.Order.OrderQueryResultView = OrderQueryResultView;
})(jQuery, window);
































;(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var OrderListController = Stapes.subclass({
		/**
		 * 构造搜索结果控制器
		 * @param  {Object} cfg
		 * 			@param {Object} view View层实例
		 * 			@param {Object} model Model层实例
		 * 			@param {JQueryObj} container 容器
		 * @return {[type]}
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.view || !this.model || !this.container) {
				throw("Query Result init faild!");
			}
			this.isReady = false;
			this.bindEvent();
		}
	});
	OrderListController.proto({
		init : function (params) {
			this.model.init($XP(params, 'params', {}), $XP(params, 'cities', null));
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.loadingModal = new LoadingModal({
				start : 100
			});
			this.isReady = true;
		},
		hasReady : function () {return this.isReady;},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					self.model.emit('load', $XP(params, 'params', {}));
				}
			}, this);
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						self.loadingModal.hide();
					};
					self.loadingModal.show();
					self.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				}
			}, this);
		}
	});

	Hualala.Order.OrderListController = OrderListController;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	Hualala.Order.initQueryParams = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var self = this;
		var queryVals = $XP(ctx, 'params', []);
		var queryKeys = self.queryKeys;
		var params = _.object(queryKeys, queryVals);
		self.set(params);
	};

	var QueryModel = Hualala.Shop.QueryModel.subclass({
		/**
		 * 构造订单搜索数据模型
		 * @param  {Object} cfg
		 * 			@param {Array} queryKeys 搜索字段
		 * 			@param {Function} initQueryParams 初始化搜索字段方法
		 * 			
		 * @return {Object}
		 */
		constructor : function (cfg) {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			// 数据是否已经加载完毕
			this.isReady = false;
			this.callServer = Hualala.Global.getShopQuerySchema;
			var initQueryParams = $XF(cfg, 'initQueryParams');
			initQueryParams.apply(this);
		}
	});
	QueryModel.proto({
		getQueryParams : function () {
			var self = this;
			var vals = _.map(self.queryKeys, function (k) {
				return self.get(k);
			});
			var params = _.object(self.queryKeys, vals);
			IX.Debug.info("DEBUG: Order Query Model Query Params :");
			IX.Debug.info(params);
			return params;
		}
	});

	Hualala.Order.QueryModel = QueryModel;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	/**
	 * 查询条件表单元素配置信息 
	 * @type {Object}
	 */
	Hualala.Order.QueryFormElsCfg = {
		orderTime : {
			type : 'section',
			label : '日期',
			min : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		cityID : {
			type : 'combo',
			label : '城市',
			defaultVal : '',
			options : [],
			validCfg : {
				validators : {}
			}
		},
		shopID : {
			type : 'combo',
			label : '店铺',
			defaultVal : '',
			options : [],
			validCfg : {
				validators : {}
			}
		},
		orderStatus : {
			type : 'combo',
			label : '状态',
			defaultVal : '',
			options : Hualala.TypeDef.OrderStatus,
			validCfg : {
				validators : {}
			}
		},
		orderTotal : {
			type : 'section',
			label : '金额',
			min : {
				type : 'text',
				// prefix : '￥',
				// surfix : '元',
				defaultVal : '',
				validCfg : {
					validators : {
						numeric : {
							message: "金额必须为数字"
						},
						greaterThan : {
							inclusive : true,
							value : 0,
							message : "金额必须大于或等于0"
						}
					}
				}
			},
			max : {
				type : 'text',
				// prefix : '￥',
				// surfix : '元',
				defaultVal : '',
				validCfg : {
					validators : {
						numeric : {
							message: "金额必须为数字"
						},
						greaterThan : {
							inclusive : true,
							value : 0,
							message : "金额必须大于或等于0"
						}
					}
				}
			}
		},
		orderID : {
			type : 'text',
			label : '订单号',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "订单号必须为数字"
					}
				}
			}
		},
		userMobile : {
			type : 'text',
			label : '手机号',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "手机号码必须为数字"
					}
				}
			}
		},
		userLoginMobile : {
			type : 'text',
			label : '手机号',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "手机号码必须为数字"
					}
				}
			}
		},
		foodCategoryName : {
			type : 'text',
			label : '分类名称',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		userName : {
			type : 'text',
			label : '订餐人',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		button : {
			type : 'button',
			clz : 'btn btn-block btn-warning',
			label : '查询'
		}
	};
	var QueryFormElsHT = new IX.IListManager();
	_.each(Hualala.Order.QueryFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-4 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k == 'orderTime' ? 'startDate' : 's_orderTotal',
				maxName = k == 'orderTime' ? 'endDate' : 'e_orderTotal',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-5',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-5',
				});
			QueryFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : 'col-xs-2 col-sm-2 col-md-2 control-label',
				min : min,
				max : max
			}));
		} else {
			QueryFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
			}, $XP(el, 'type') !== 'button' ? {clz : 'col-xs-8 col-sm-8 col-md-8'} : null));
		}
	});

	/**
	 * 格式化订单搜索页面，搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapOrderQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		// var query = {cols : [
		// 	{
		// 		colClz : 'col-md-4',
		// 		items : QueryFormElsHT.getByKeys(['orderTime', 'orderTotal'])
		// 	},
		// 	{
		// 		colClz : 'col-md-2',
		// 		items : QueryFormElsHT.getByKeys(['cityID', 'shopID'])
		// 	},
		// 	{
		// 		colClz : 'col-md-3',
		// 		items : QueryFormElsHT.getByKeys(['orderStatus', 'orderID'])
		// 	},
		// 	{
		// 		colClz : 'col-md-3',
		// 		items : QueryFormElsHT.getByKeys(['userMobile'])
		// 	},
		// 	{
		// 		colClz : 'col-md-offset-1 col-md-2',
		// 		items : QueryFormElsHT.getByKeys(['button'])
		// 	}
		// ]};
		var query = {cols : [
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime', 'orderTotal'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['cityID', 'orderStatus'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['shopID', 'orderID'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['userMobile'])
			},
			{
				colClz : 'col-md-offset-1 col-md-2',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	};

	/**
	 * 格式化订单日汇总,期间汇总搜索页面，搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapOrderQueryBaseFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {cols : [
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['cityID'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['shopID'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['orderStatus'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	};

	/**
	 * 格式化菜品排行榜页面搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapDishesHotQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {cols : [
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['cityID'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['shopID'])
			},
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['foodCategoryName'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	};

	/**
	 * 格式化用户统计页面搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapUsersQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {cols : [
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['cityID'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['shopID'])
			},
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime'])
			},
			
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['userLoginMobile'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['userName'])
			},
			{
				colClz : 'col-md-offset-4 col-md-2',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	};

	var QueryView = Stapes.subclass({
		/**
		 * 订单报表搜索View层构造
		 * @param  {Object} cfg
		 * 			@param {Function} mapRenderDataFn 整理渲染搜索表单数据
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.isReady = false;
			this.$container = null;
			this.$queryBox = null;
			this.loadTemplates();
			this.set('mapRenderDataFn', $XF(cfg, 'mapRenderDataFn'));
		}
	});

	QueryView.proto({
		init : function (cfg) {
			this.model = $XP(cfg, 'model', null);
			this.$container = $XP(cfg, 'container', null);
			if (!this.model || !this.$container || this.$container.length == 0) {
				throw("Init Query View Failed!!");
				return;
			}
			this.renderLayout();
			this.bindEvent();
			this.isReady = true;
			this.emit('query', this.getQueryParams());
		},
		// 判断是否View初始化完毕
		hasReady : function () {return this.isReady;},
		loadTemplates : function () {
			var self = this;
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_queryLayout')),
				comboOptsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_comboOpts'));
			Handlebars.registerPartial("orderQueryForm", Hualala.TplLib.get('tpl_order_queryForm'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				comboOptsTpl : comboOptsTpl
			});
		},
		initQueryFormEls : function () {
			var self = this,
				els = self.model.getQueryParams(),
				cityID = $XP(els, 'cityID', ''),
				shopID = $XP(els, 'shopID', '');
			self.initCityComboOpts(cityID);
			self.initShopComboOpts(cityID, shopID);
			_.each(els, function (v, k) {
				if (k == 'startDate' || k == 'endDate') {
					v = IX.isEmpty(v) ? '' : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy/MM/dd');
				}
				self.$queryBox.find('[name=' + k + ']').val(v);
			});
		},
		initChosenPanel : function (_cfg) {
			var self = this,
				matcher = (new Pymatch([])),
				sections = $XP(_cfg, 'sectionsData'),
				$target = $XP(_cfg, '$target'),
				chosenPanelCfg = $XP(_cfg, 'chosenPanelCfg', {}),
				changeFn = $XF(_cfg, 'changeFn');
			var getMatchedFn = function (searchText) {
				matcher.setNames(_.map(sections, function (el) {
					return IX.inherit(el, {
						name : el.label,
						py : el.py
					});
				}));
				var matchedSections = matcher.match(searchText);
				var matchedOptions = {};
				_.each(matchedSections, function (el, i) {
					matchedOptions[el[0].value] = true;
				});
				return matchedOptions;
			};
			var chosen = $target.data('chosen');
			chosen && chosen.destroy();
			$target.chosen(IX.inherit({
				width : '200px',
				placeholder_text : "请选择",
				no_results_text : "抱歉，没有找到！",
				allow_single_deselect : true
			}, chosenPanelCfg, {
				getMatchedFn : getMatchedFn
			})).change(function (e) {
				changeFn.apply(this, e);
			});
		},
		initCityComboOpts : function (curCityID) {
			var self = this,
				cities = self.model.getCities();
			if (IX.isEmpty(cities)) return ;
			cities = _.map(cities, function (city) {
				var id = $XP(city, 'cityID', ''), name = $XP(city, 'cityName', '');
				return {
					value : id,
					label : name,
					selected : id == curCityID ? 'selected' : '',
					py : $XP(city, 'py', '')
				};
			});
			cities.unshift({
				value : '',
				label : '全部',
				selected : IX.isEmpty(curCityID) ? 'selected' : '',
				py : 'quan;bu'
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : cities
				}),
				$select = self.$queryBox.find('select[name=cityID]');
			$select.html(htm);

			self.initChosenPanel({
				chosenPanelCfg : {
					width : $select.parent().width() + 'px',
					placeholder_text : "请选择城市"
				},
				sectionsData : cities,
				$target : $select,
				changeFn : function (e) {
					var $this = $(this);
					self.chosenCityID = $this.val();
				}
			});
		},
		initShopComboOpts : function (curCityID, curShopID) {
			var self = this,
				shops = IX.isEmpty(curCityID) ? self.model.getShops() : self.model.getShopsByCityID(curCityID);
			if (IX.isEmpty(shops)) return;
			shops = _.map(shops, function (shop) {
				var id = $XP(shop, 'shopID', ''), name = $XP(shop, 'shopName', '');
				return {
					value : id,
					label : name,
					selected : id == curShopID ? 'selected' : '',
					py : $XP(shop, 'py', '')
				};
			});
			shops.unshift({
				value : '',
				label : '全部',
				selected : IX.isEmpty(curShopID) ? 'selected' : '',
				py : 'quan;bu'
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : shops
				}),
				$select = self.$queryBox.find('select[name=shopID]');
			$select.html(htm);

			self.initChosenPanel({
				chosenPanelCfg : {
					width : $select.parent().width() + 'px',
					placeholder_text : "请选择店铺"
				},
				sectionsData : shops,
				$target : $select,
				changeFn : function (e) {
					var $this = $(this);
					self.chosenCityID = $this.val();
				}
			});
		},
		initQueryEls : function () {
			var self = this;
			self.$queryBox.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
			self.$queryBox.on('click', '.input-group-addon', function (e) {
				var $this = $(this),
					$picker = $this.prev(':text[data-type=datetimepicker]');
				if ($picker.length > 0) {
					$picker.datetimepicker('show');
				}
			});
		},
		mapRenderLayoutData : function () {
			var mapFn = this.get('mapRenderDataFn');
			return IX.isFn(mapFn) && mapFn.apply(this);
		},
		renderLayout : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = layoutTpl(renderData);
			self.$queryBox = $(html);
			self.$container.html(self.$queryBox);
			self.initQueryFormEls();
			self.initQueryEls();
		},
		bindEvent : function () {
			var self = this;
			self.$queryBox.on('change', 'select', function (e) {
				var $this = $(this),
					v = $this.val();
				self.initShopComboOpts(v, '');
			});
			self.$queryBox.on('click', '.btn.btn-warning', function (e) {
				var $this = $(this);
				self.emit('query', self.getQueryParams());
			});
		},
		getQueryParams : function () {
			var self = this,
				keys = self.model.queryKeys,
				$form = self.$queryBox.find('form'),
				els = $form.serializeArray();
			els = _.map(els, function (el) {
				var n = $XP(el, 'name'), v = $XP(el, 'value', '');
				if (n == 'startDate' || n == 'endDate') {
					v = IX.isEmpty(v) ? '' : IX.Date.getDateByFormat(v, 'yyyyMMdd');
					return {
						name : n,
						value : v
					};
				}
				return el;
			});
			els = _.object(_.pluck(els, 'name'), _.pluck(els, 'value'));
			self.model.set(els);
			return els;
		}

	});

	Hualala.Order.QueryView = QueryView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	
	var QueryController = Hualala.Shop.QueryController.subclass({
		/**
		 * 订单报表查询控制器
		 * @param  {Object} cfg 
		 * 			@param {JQueryObj} container 容器
		 * 			@param {Object} resultController 结果输出控制器
		 * 			@param {Object} model 查询数据模型
		 * 			@param {Object} view 查询界面模型
		 * @return {Object}	查询控制模块实例
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.resultController = $XP(cfg, 'resultController', null);
			this.model = $XP(cfg, 'model', null);
			this.view = $XP(cfg, 'view', null);
			if (!this.container || !this.model || !this.view || !this.resultController) {
				throw("QueryController init faild!");
			}
			this.init();
		}
	});
	QueryController.proto({
		// 绑定事件
		bindEvent : function () {
			// 控制器的事件绑定
			this.on({
				reload : function () {
					var self = this;
					self.model.distory();
					self.view.distory();
					self.init();
				},
				query : function (params) {
					var self = this;
					var cities = self.model.getCities();
					IX.Debug.info('DEBUG: Order Query Controller Query Params:');
					IX.Debug.info(params);
					self.resultController && self.resultController.emit('load', {
						params : IX.inherit(params, {
							pageNo : 1,
							pageSize : 15
						}),
						cities : cities
					});
				}
			}, this);
			// 模型的事件绑定
			this.model.on({
				load : function (cbFn) {
					var self = this,
						params = $XP(self.get('sessionData'), 'user', {});
					self.model.init(params, cbFn);
				}
			}, this);
			// 视图事件绑定
			this.view.on({
				init : function () {
					var self = this;
					self.view.init({
						model : self.model,
						needShopCreate : self.needShopCreate,
						container : self.container
					});
				},
				// 过滤操作，触发显示结果
				filter : function (params) {
					var self = this;
					self.emit('query', params);
					//TODO 重置Query的chosenPanel
				},
				// 搜索操作，触发显示结果
				query : function (params) {
					var self = this;
					self.emit('query', params);
				}
			}, this);
		}
	});
	Hualala.Order.QueryController = QueryController;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Order");
	/*订单模块子页面布局*/
	var initOrderPageLayout = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.empty();
		var mapNavRenderData = function () {
			var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
			var navs = _.map(Hualala.TypeDef.OrderSubNavType, function (v, i, list) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					if (v == 'startDate' || v == 'endDate') {
						return curDateStamp;
					}
					return '';
				});

				return {
					active : $XP(ctx, 'name') == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name,
					label : v.label,
				};
			});
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.html('<div class="order-subnav clearfix" /><div class="order-body" ><div class="order-query-box"></div><div class="order-result-box"></div></div>');
		var $navbar = $body.find('.order-subnav'),
			$pageBody = $body.find('.order-body');
		$navbar.html(navTpl(mapNavRenderData()));
	};
	/*订单报表概览页面*/
	var initOrderChartPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		// Note: 暂时屏蔽概览页面，第二版将开启
		var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
		var pageCfg = _.find(Hualala.TypeDef.OrderSubNavType, function (el) {return el.name == 'orderQuery'}),
			pkeys = $XP(pageCfg, 'pkeys', []);
		pkeys = _.map(pkeys, function (v) {
			if (v == 'startDate' || v == 'endDate') {
				return curDateStamp;
			}
			return '';
		});
		document.location.href = Hualala.PageRoute.createPath('orderQuery', pkeys);
	};
	/*订单查询页面*/
	var initQueryOrderPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					callServer : Hualala.Global.queryOrderDetail,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryOrderResultRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapOrderQueryFormRenderData
			})
		});
	};
	/*订单日汇总页面*/
	var initQueryOrderDayDetailPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					callServer : Hualala.Global.queryOrderDayDetail,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryOrderDuringRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapOrderQueryBaseFormRenderData
			})
		});
	};
	/*订单期间汇总页面*/
	var initQueryOrderDuringDetailPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					callServer : Hualala.Global.queryOrderDuringDetail,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryOrderDuringRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapOrderQueryBaseFormRenderData
			})
		});
	};
	/*菜品销售排行页面*/
	var initQueryOrderDishesHotPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					hasPager : false,
					callServer : Hualala.Global.queryOrderDishesHot,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryDishesHotRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapDishesHotQueryFormRenderData
			})
		});
	};
	/*顾客统计页面*/
	var initQueryOrderCustomerPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					hasPager : false,
					callServer : Hualala.Global.queryUserOrderStatistic,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryUserRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				}) 
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapUsersQueryFormRenderData
			})
		});
	};


	Hualala.Order.OrderPageLayoutInit = initOrderPageLayout;
	Hualala.Order.OrderChartInit = initOrderChartPage;
	Hualala.Order.QueryOrderInit = initQueryOrderPage;
	Hualala.Order.QueryOrderByDayDetailInit = initQueryOrderDayDetailPage;
	Hualala.Order.QueryOrderByDuringDetailInit = initQueryOrderDuringDetailPage;
	Hualala.Order.QueryOrderDishesHotInit = initQueryOrderDishesHotPage;
	Hualala.Order.QueryOrderCustomerInit = initQueryOrderCustomerPage;

})(jQuery, window);;(function ($, window) {
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
					},
					noChinese : {
						message : "密码不能含有中文字符"
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
		},
		bindedMobile : {
			type : "staticwithbtns",
			label : "已绑定手机",
			defaultVal : "",
			btns : [
				{clz : "col-sm-2", btnClz : "btn-link", label : "更改手机号", act : "changeMobile"},
				{clz : "col-sm-2", btnClz : "btn-link", label : "解除绑定", act : "unbindMobile"}
			],
			validCfg : {}
		},
		userMobile : {
			type : "textwithbtns",
			label : "手机号",
			defaultVal : "",
			btns : [
				{clz : "col-sm-2", btnClz : "btn-warning", label : "获取验证码", act : "getCode", loadingText : "发送中..."}
			],
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入要绑定的手机号"
					},
					mobile : {
						message : "请输入中国地区手机号"
					}
				}
			}
		},
		dynamicCode : {
			type : "text",
			label : "验证码",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入短信验证码"
					}
				}
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
		} else if (type == "staticwithbtns") {
			BaseUserFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-3'
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
		RoleBindingFormKeys = 'loginName,accountID,roleBinding'.split(','),
		BindMobileFormKeys = 'accountID,bindedMobile,userMobile,dynamicCode'.split(',');

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
		renderBtns : function () {
			var self = this, btnTpl = self.get('btnTpl');
			if (self.mode == 'edit') {
				self.$footer.html(btnTpl({
					btns : [
						{clz : 'btn-default', name : 'cancel', label : '取消'},
						{clz : 'btn-warning', name : 'submit', label : '保存', loadingText : "提交中..."}
					]
				}));
			} else if (self.mode == 'personal_edit') {
				self.$container.append(btnTpl({
					btns : [
						{clz : 'btn-warning col-sm-offset-5', name : 'submit', label : '确定', loadingText : "提交中..."}
					]
				}));
			}
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
			self.renderBtns();
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
			if (self.getViewMode() == 'personal_edit') {
				self.$body.delegate('.btn', 'click', function (evt) {
					var $btn = $(this), act = $btn.attr('name');
					if (act == 'submit') {
						var bv = self.$body.find('form').data('bootstrapValidator');
						$btn.button('loading');
						bv.validate();
					}
				});
			}
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
						ret[key] = !$('[name=' + key + ']', self.$body).data('bootstrapSwitch').options.state ? 0 : 1;
					} else {
						ret[key] = $('[name=' + key + ']', self.$body).val();
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


	var UserBindMobileView = ResetPWDView.subclass({
		constructor : ResetPWDView.prototype.constructor
	});
	UserBindMobileView.proto({
		initBaseCfg : function () {
			this.formKeys = BindMobileFormKeys;
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
		mapFormElsData : function () {
			var self = this,
				formKeys = self.formKeys;
			var ret = _.map(formKeys, function (key) {
				var elCfg = BaseUserFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (type == 'staticwithbtns') {
					var val = $XP(self.formParams, 'userMobile', '');
					var hidden = $XP(self.formParams, 'mobileBinded') == 1 ? '' : 'hidden';
					return IX.inherit(elCfg, {
						value : val,
						hidden : hidden,
						labelClz : 'col-sm-3 control-label'
					});
				} else if (type == 'textwithbtns') {
					return IX.inherit(elCfg, {
						value : '',
						labelClz : 'col-sm-3 control-label'
					});
				} else {
					return IX.inherit(elCfg, {
						value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal', '')),
						labelClz : 'col-sm-3 control-label'
					}, (type == 'text' && self.mode == 'wizard_add' && key == 'loginName') ? {
						mode : ''
					} : {});
				}
			});
			IX.Debug.info("DEBUG: User ResetPWD Form Elements :");
			IX.Debug.info(ret);
			return ret;
		},
		renderBtns : function () {
			var self = this;
			var self = this, btnTpl = self.get('btnTpl');
			if (self.mode == 'personal_edit') {
				self.$container.append(btnTpl({
					btns : [
						{clz : 'btn-warning col-sm-offset-5', name : 'submit', label : '绑定手机', loadingText : "提交中..."}
					]
				}));
			}
		},
		initUIComponents : function () {
			var self = this;
			var mobileBinded = $XP(self.formParams, 'mobileBinded');
			// TODO init UI Components
			self.dynamicPWD = new Hualala.Common.DynamicPWD({
				$btn : self.$body.find('.btn-warning[data-act=getCode]'),
				waiting : 180,
				getParams : function () {
					var groupLoginName = self.model.get('groupLoginName'),
						$userMobile = self.$body.find(':text[name=userMobile]'),
						bv = self.$body.find('form').data('bootstrapValidator');
					if (!bv.validateField($userMobile).isValidField($userMobile)) {
						return null;
					}
					return {
						groupName : groupLoginName,
						userMobile : $userMobile.val()
					};
				}
			});
			if (mobileBinded == 1) {
				self.$body.find('.form-group').eq(0).show();
				self.$body.find('.form-group:gt(0)').hide();
				self.$body.find('.btn[name=submit]').hide();
			} else {
				self.$body.find('.form-group').eq(0).hide();
				self.$body.find('.form-group:gt(0)').show();
				self.$body.find('.btn[name=submit]').show();
			}
			self.$body.delegate('.btn[data-act]', 'click', function (e) {
				var $btn = $(this), act = $btn.attr('data-act');
				if (act == 'unbindMobile') {
					Hualala.UI.Confirm({
						title : '手机号解除绑定',
						msg : '是否解除绑定账号(' + self.model.get('loginName') + ')的手机号？',
						okLabel : '解除绑定',
						okFn : function () {
							self.model.emit('unbindMobile', {
								accountID : self.model.get('accountID'),
								successFn : function () {
									self.$body.find('.form-group').eq(0).hide();
									self.$body.find('.form-group:gt(0)').show();
									self.$body.find('.btn[name=submit]').show();
								}
							});
						}
					});
				} else if (act == 'changeMobile') {
					self.$body.find('.form-group').eq(0).hide();
					self.$body.find('.form-group:gt(0)').show();
					self.$body.find('.btn[name=submit]').show();
				}
			});
		}
	});
	Hualala.User.UserBindMobileView = UserBindMobileView;


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
		// 用于取消选中的角色
		updateRoleBindStatus : function (roleType) {
			var self = this, mUser = self.model;
			var roleInfo = mUser.getRoleInfoByType(roleType),
				items = !$XP(roleInfo, 'binded') ? [] : $XP(roleInfo, 'items'),
				$chk = self.$body.find(':checkbox[name=' + roleType + ']');
			if (items.length <= 0) {
				$chk[0].checked = false;
				$chk.trigger('change');
			}
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
					// console.info('onInit');console.info(arguments);
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
					// console.info('onNext');
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
					// console.info('onPrevious');
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
					// console.info('onTabChange'); console.info(cIdx + '--->' + nIdx);
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
					// console.info('onTabShow');
					
				},
				/**
				 * fired when finish button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onFinish : function ($curNav, $navBar, cIdx) {
					// console.info('onFinish');
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
(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var PanelGroupCfg = [
		{id : 'bind_mobile', title : "绑定手机", panelClz : 'in', expanded : 'true'},
		{id : 'reset_pwd', title : "重置密码", panelClz : '', expanded : 'false'}
	];

	var UserMgrModal = Stapes.subclass({
		constructor : function (cfg) {
			this.$btnGrp = $XP(cfg, '$btnGrp');
			this.curPanelName = $XP(cfg, 'curPanelName', 'bind_mobile');
			this.userModel = null;
			this.$body = null;
			this.$bindMobilePanel = null;
			this.$resetPWDPanel = null;
			this.panelGrpHT = new IX.IListManager();
			this.initUserModel();
			this.loadTemplates();
			this.bindBtnGrpEvent();
		}
	});
	UserMgrModal.proto({
		initUserModel : function () {
			var self = this,
				userData = Hualala.getSessionUser();
			userData = IX.inherit(userData, {
				roleType : $XP(userData, 'role').join(',')
			});
			self.userModel = new Hualala.User.BaseUserModel(userData);
		},
		updateCurPanelName : function (curTarget) {
			this.curPanelName = curTarget;
		},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_mgr_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		mapLayoutRenderData : function () {
			var self = this;
			var data = _.map(PanelGroupCfg, function (el) {
				var id = $XP(el, 'id');
				return IX.inherit(el, {
					panelClz : id == self.curPanelName ? 'in' : '',
					expanded : id == self.curPanelName ? 'true' : ''
				});
			});
			return {
				panelGrpID : 'user_mgr_panel',
				panels : data
			};
		},
		renderPanelGrpLayout : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl');
			var renderData = self.mapLayoutRenderData();
			var htm = layoutTpl(renderData);
			self.$body.html(htm);
			self.$bindMobilePanel = self.$body.find('#bind_mobile');
			self.$resetPWDPanel = self.$body.find('#reset_pwd');
			self.panelGrpHT.register('reset_pwd', new Hualala.User.ResetPWDView({
				mode : 'personal_edit',
				container : self.$resetPWDPanel.find('.panel-body'),
				parentView : self,
				model : self.userModel,
				evtType : 'resetPWD',
				successFn : function (mUser) {
					var view = self.panelGrpHT.get('reset_pwd');
					view.$body.find('.btn[name="submit"]').button('reset');
				},
				failFn : function (mUser) {
					var view = self.panelGrpHT.get('reset_pwd');
					view.$body.find('.btn[name="submit"]').button('reset');
				}
			}));
			self.panelGrpHT.register('bind_mobile', new Hualala.User.UserBindMobileView({
				mode : 'personal_edit',
				container : self.$bindMobilePanel.find('.panel-body'),
				parentView : self,
				model : self.userModel,
				evtType : 'bindMobile',
				successFn : function (mUser) {
					var view = self.panelGrpHT.get('bind_mobile');
					view.$body.find('.btn[name="submit"]').button('reset');
				},
				failFn : function (mUser) {
					var view = self.panelGrpHT.get('bind_mobile');
					view.$body.find('.btn[name="submit"]').button('reset');
				}
			}));
			self.renderModalBtns();

		},
		renderModalBtns : function () {
			var self = this, btnTpl = self.get('btnTpl');
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '关闭'}
				]
			}));
			self.modal._.footer.find('.btn-default').attr('data-dismiss', 'modal');
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "user_mgr_modal",
				clz : 'account-modal user-mgr-modal',
				title : "个人管理",
				// backdrop : 'static',
				showFooter : true,
				afterHide : function () {
					
				}
			});
			self.$body = self.modal._.body;
			self.renderPanelGrpLayout();

			self.modal.show();
		},
		bindBtnGrpEvent : function () {
			var self = this;
			self.$btnGrp.undelegate('.btn[data-target]', 'click');
			self.$btnGrp.delegate('.btn[data-target]', 'click', function(e) {
				var $btn = $(this), curTarget = $btn.attr('data-target');
				self.updateCurPanelName(curTarget);
				self.initModal();
			});
		}
	});
	Hualala.User.UserMgrModal = UserMgrModal;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindShopModal = Stapes.subclass({
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$queryBox = null;
			this.$resultBox = null;
			this.queryCtrl = null;
			this.set({
				accountID : this.model.get('accountID'),
				roleType : $XP(cfg, 'roleType'),
				mutiSelect : $XP(cfg, 'mutiSelect', false)
			});
			this.loadTemplates();
			this.initModal();
			this.render();
			this.bindEvent();
			this.initQueryBox();
			this.emit('show');
		}
		
	});
	BindShopModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
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
				title : "选择所管辖的店铺",
				backdrop : "static"
			});
		},
		render : function () {
			var self = this, layoutTpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl');
			var roleInfo = self.model.getRoleInfoByType(self.get('roleType')),
				name = $XP(roleInfo, 'name', ''),
				btns = [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'save', label : '确定'}
				];
				htm = layoutTpl({
					clz : '',
					title : "选择" + name + "所管辖的店铺"
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
					self.parentView.updateRoleBindStatus(self.get('roleType'));
				} else {
					// 设置角色绑定店铺数据
					self.queryCtrl.emit('bindItems');
					var mUser = self.model, roleType = self.get('roleType'),
						roleInfo = mUser.getRoleInfoByType(roleType),
						items = !$XP(roleInfo, 'binded') ? [] : $XP(roleInfo, 'items');
					if (items.length > 0) {
						self.emit('hide');
					} else {
						toptip({
							msg : "请选择要绑定的店铺",
							type : 'danger'
						});
					}
				}
			});
		},
		initQueryBox : function () {
			var self = this;
			self.queryCtrl = new Hualala.User.QueryShopController({
				container : self.$queryBox,
				resultContainer : self.$resultBox,
				accountID : this.model.get('accountID'),
				roleType : self.get('roleType'),
				mutiSelect : self.get('mutiSelect'),
				userModel : self.model
			});
		}
	});

	Hualala.User.BindShopModal = BindShopModal;

	
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindSettleAccountModal = Stapes.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$resultBox = null;
			this.set({
				accountID : this.model.get('accountID'),
				roleType : $XP(cfg, 'roleType'),
				mutiSelect : $XP(cfg, 'mutiSelect', false),
				itemsCache : null
			});
			this.origSettleData = null;
			this.querySettleCallServer = Hualala.Global.queryAccount;
			this.$body = null;
			this.$footer = null;
			this.$resultBox = null;
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load');
			this.emit('show');
		}
	});
	BindSettleAccountModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerPartial("settleItem", Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_settle',
				clz : 'account-modal',
				title : "选择所管辖的结算账户",
				backdrop : "static"
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			var layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl({
					clz : '',
					title : '选择财务所管辖的结算账户'
				});
			self.$body.html(htm);
			self.$resultBox = self.$body.find('.result-box');
		},
		mapRenderData : function (data) {
			var self = this,
				roleType = self.get('roleType'),
				mutiSelect = self.get('mutiSelect'),
				itemsCache = self.get('itemsCache'),
				mUser = self.model;
			var roleInfo = mUser.getRoleInfoByType(roleType),
				items = $XP(roleInfo, 'items', []);
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			var ret = _.map(data, function (settle, i, l) {
				var id = $XP(settle, 'settleUnitID'),
					checked = !_.find(itemsCache, function (el) {return el == id}) ? '' : 'checked';
				return IX.inherit(settle, {
					type : !mutiSelect ? 'radio' : 'checkbox',
					clz : 'bind-item',
					settleUnitNameLabel : $XP(settle, 'settleUnitName', ''),
					checked : checked
				});
			});
			
			return ret;
		},
		render : function (data) {
			var self = this,
				listTpl = self.get('listTpl');
			var renderData = self.mapRenderData(data);
			var htm = listTpl({
				settleList : {
					list : renderData
				}
			});
			self.$resultBox.html(htm);
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				},
				"load" : function () {
					if (!self.origSettleData) {
						self.querySettleCallServer({}, function (res) {
							if (res.resultcode != '000') {
								toptip({
									msg : $XP(res, 'resultmsg', ''),
									type : 'danger'
								});
							} else {
								self.render($XP(res, 'data.records', []));
							}
						});
					} else {
						self.render(self.origSettleData);
					}
				}
			});
			self.$resultBox.tooltip({
				selector : '[title]'
			});
			self.$resultBox.delegate(':radio,:checkbox', 'change', function (e) {
				var $el = $(this),
					checked = !this.checked ? false : true,
					itemID = $el.val(),
					mutiSelect = self.get('mutiSelect'),
					roleType = self.get('roleType');
				var mUser = self.model;
				// mUser.updateRoleBind(roleType, itemID, mutiSelect, checked);
				self.updateItemsCache(roleType, itemID, mutiSelect, checked);
			});
			self.$footer.delegate('.btn', 'click', function (e) {
				var $btn = $(this),
					act = $btn.hasClass('btn-close') ? 'cancel' : 'ok';
				var cache = self.get('itemsCache');
				if (act == 'cancel') {
					self.emit('hide');
					self.parentView.updateRoleBindStatus(self.get('roleType'));
				} else {
					// 设置角色绑定店铺数据
					if (!cache || cache.length == 0) {
						toptip({
							msg : "请选择要绑定的结算账户",
							type : 'danger'
						});
						return ;
					}
					self.bindItems();
					self.emit('hide');
				}
			});
			
		},
		updateItemsCache : function (roleType, itemID, mutiSelect, checked) {
			var self = this;
			var itemsCache = self.get('itemsCache');
			if (mutiSelect) {
				if (!checked) {
					itemsCache = _.without(itemsCache, itemID);
				} else {
					itemsCache.push(itemID);
				}
			} else {
				itemsCache = [itemID];
			}
			self.set('itemsCache', itemsCache);
		},
		bindItems : function () {
			var self = this;
			var mUser = self.model,
				roleType = self.get('roleType');
			mUser.updateRoleItemsBind(roleType, self.get('itemsCache'));
		}
	});

	Hualala.User.BindSettleAccountModal = BindSettleAccountModal;
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindShopMultiModal = Stapes.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$resultBox = null;
			this.set({
				accountID : this.model.get('accountID'),
				roleType : $XP(cfg, 'roleType'),
				itemsCache : null
			});
			this.queryModel = new Hualala.Shop.QueryModel();
			this.$body = null;
			this.$footer = null;
			this.$resultBox = null;
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load');

		}
	});
	BindShopMultiModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shops_tree')),
				collapseBtnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_collapse_btn')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_checkbox'));
			Handlebars.registerPartial("collapseBtn", Hualala.TplLib.get('tpl_collapse_btn'));
			Handlebars.registerPartial("item", Hualala.TplLib.get('tpl_shop_checkbox'));
			
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				collapseBtnTpl : collapseBtnTpl,
				itemTpl : itemTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_shop',
				clz : 'account-modal',
				title : "选择所管辖的店铺",
				backdrop : "static"
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			var layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl({
					clz : '', 
					title : "选择区域经理所管辖的店铺"
				});
			self.$body.html(htm);
			self.$resultBox = self.$body.find('.result-box');
		},
		chkShopBinded : function (shopID) {
			var self = this, itemsCache = self.get('itemsCache');
			return !_.find(itemsCache, function (el) {return el == shopID}) ? false : true;
		},
		mapShopTree : function () {
			var self = this,
				queryModel = self.queryModel;
			var cities = queryModel.getCities(),
				areas = queryModel.getAreas();
			var mapShopData = function (list) {
				var curShopLst = queryModel.getShops(list);
				var checkedCount = 0;
				var shops = _.map(curShopLst, function (shop) {
					var shopID = $XP(shop, 'shopID'),
						shopName = $XP(shop, 'shopName'),
						checked = self.chkShopBinded(shopID);
					checked && checkedCount++;
					return {
						nodeClz : 'col-sm-4',
						nodeType : 'shop',
						id : shopID,
						name : shopName,
						parentID : $XP(shop, 'areaID'),
						hideCollapse : 'hidden',
						checked : checked ? 'checked' : ''
					}
				});
				var unBinded = _.reject(shops, function (el) {return el.checked == 'checked';});
				return {
					shops : shops,
					checked : unBinded.length > 0 ? '' : 'checked',
					expanded : checkedCount > 0 ? 'in' : ''
				};
			};
			var mapAreaData = function (list) {
				var curAreaLst = queryModel.getAreas(list);
				var areas = _.map(curAreaLst, function (area) {
						var areaID = $XP(area, 'areaID'),
							areaName = $XP(area, 'areaName'),
							shopLst = $XP(area, 'shopLst', []);
						
						return IX.inherit({
							nodeClz : '',
							nodeType : 'area',
							id : areaID,
							name : areaName,
							parentID : $XP(area, 'cityID'),
							hideCollapse : ''
						}, mapShopData(shopLst));
					});
				var unBinded = _.reject(areas, function (el) {return el.checked == 'checked';});
				return {
					areas : areas,
					checked : unBinded.length > 0 ? '' : 'checked'
				};
			};
			return _.map(cities, function (city) {
				var cityID = $XP(city, 'cityID', ''),
					cityName = $XP(city, 'cityName', ''),
					areaLst = $XP(city, 'areaLst', []);
				
				return IX.inherit({
					nodeClz : '',
					nodeType : 'city',
					id : cityID,
					name : cityName,
					parentID : 'root',
					hideCollapse : ''
				}, mapAreaData(areaLst));
			});
		},
		mapRenderData : function () {
			var self = this,
				roleType = self.get('roleType'),
				itemsCache = self.get('itemsCache'),
				mUser = self.model;
			var roleInfo = mUser.getRoleInfoByType(roleType),
				items = $XP(roleInfo, 'items', []);
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			return self.mapShopTree();

		},
		render : function () {
			var self = this,
				listTpl = self.get('listTpl');
			var renderData = self.mapRenderData();
			var htm = listTpl({
				cities : renderData
			});
			self.$resultBox.html(htm);
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				},
				"load" : function () {
					self.queryModel.init($XP(self.get('sessionData'), 'user'), function (_queryModel) {
						self.queryModel = _queryModel;
						self.render();
						self.emit('show');
					});
				}
			});
			
			var bindParentNode = function (pID) {
				if (pID == 'root') return;
				var $pEl = $(':checkbox[value=' + pID + ']'),
					parentID = $pEl.attr('data-parent'),
					val = $pEl.val(), name = $pEl.attr('name');
				var $childEls = $('#' + name + '_' + val).find(':checkbox');
				var unCheckEls = _.reject($childEls, function (el) {
					return !!el.checked;
				});
				if (unCheckEls.length == 0) {
					$pEl[0].checked = true;
				} else {
					$pEl[0].checked = false;
				}
				bindParentNode(parentID);
			};
			self.$body.delegate(':checkbox', 'change', function (e) {
				var $chkBox = $(this), type = $chkBox.attr('name'),
					checked = !this.checked ? false : true,
					val = $chkBox.val(), parentID = $chkBox.attr('data-parent');
				if (type == "shop") {
					
				} else if (type == "area") {
					
				} else if (type == "city") {
					
				}
				if (type == "area" || type == "city") {
					$('#' + type + '_' + val).find(':checkbox').each(function () {
						this.checked = checked;
					});
				}
				bindParentNode(parentID);
				
			});
			self.$body.delegate('.btn-link[data-toggle="collapse"]', 'click', function(event) {
				var $btn = $(this), $icon = $btn.find('.glyphicon'),
					collapsed = $icon.hasClass('glyphicon-chevron-down');
				$icon.removeClass().addClass(collapsed ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down');
			});
			self.$footer.delegate('.btn', 'click', function (e) {
				var $btn = $(this),
					act = $btn.hasClass('btn-close') ? 'cancel' : 'ok';
				var cache = self.getBindItems();
				if (act == 'cancel') {
					self.emit('hide');
					self.parentView.updateRoleBindStatus(self.get('roleType'));
				} else {
					// 设置角色绑定店铺数据
					if (!cache || cache.length == 0) {
						toptip({
							msg : "请选择要绑定的店铺",
							type : 'danger'
						});
						return ;
					}
					self.bindItems();
					self.emit('hide');
				}
			});
		},
		getBindItems : function () {
			var self = this, $els = self.$body.find(':checked[name=shop]');
			var ids = _.map($els, function (el) {
				return $(el).val();
			});
			return ids;
		},
		bindItems : function () {
			var self = this, mUser = self.model,
				roleType = self.get('roleType');
			var ids = self.getBindItems();
			mUser.updateRoleItemsBind(roleType, ids);
		}
	});

	Hualala.User.BindShopMultiModal = BindShopMultiModal;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var UserListModel = Stapes.subclass({
		/**
		 * 构造用户列表的数据模型
		 * @param  {Object} cfg 配置信息
		 *         @param {Function} callServer 获取数据接口
		 * @return {Object}     数据模型对象
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
		}
	});
	UserListModel.proto({
		init : function (params) {
			this.set({
				queryID : $XP(params, 'queryID', ''),
				ds_user : new IX.IListManager()
			});
		},
		updatePagerParams : function (params) {
			var self = this;
			var pagerParamkeys = 'queryID';
			_.each(params, function (v, k, l) {
				if (pagerParamkeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			return {
				queryID : this.get('queryID')
			};
		},
		updateDataStore : function (data) {
			var self = this,
				userHT = self.get('ds_user');
			var ids = _.map(data, function (user, i, l) {
				var id = $XP(user, 'accountID'),
					mUser = new BaseUserModel(user);
				userHT.register(id, mUser);
				return id;
			});
			return ids;
		},
		resetDataStore : function () {
			var self = this,
				userHT = self.get('ds_user');
			userHT.clear();
		},
		removeUsers : function (ids) {
			var self = this,
				userHT = self.get('ds_user');
			if (!ids) userHT.clear();
			ids = IX.isArray(ids) ? ids : [ids];
			_.each(ids, function (id) {
				userHT.unregister(id);
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []));
					self.updatePagerParams($XP(res, 'data.page', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getUsers : function (ids) {
			var self = this,
				userHT = self.get('ds_user');
			var users = !ids || !IX.isArray(ids) ? userHT.getAll() : userHT.get(ids);
			var ret = _.map(users, function (mUser, i, l) {
				return mUser.getAll();
			});
			IX.Debug.info("DEBUG: User List Model Data : ");
			IX.Debug.info(ret);
			return ret;
		},
		getUserModelByUserID : function (userID) {
			var self = this,
				userHT = self.get('ds_user');
			return userHT.get(userID);
		},
		getUserModelByUserLoginName : function (loginName) {
			var self = this,
				userHT = self.get('ds_user'),
				users = userHT.getAll();
			return _.find(users, function (user) {
				return user.get('loginName') == loginName;
			});
		},
		addItem : function (mUser) {
			var self = this,
				userHT = self.get('ds_user'),
				id = mUser.get('accountID');
			userHT.register(id, mUser);
		}
	});
	Hualala.User.UserListModel = UserListModel;

	var BaseUserModel = Stapes.subclass({
		constructor : function (user) {
			this.resetPWDCallServer = Hualala.Global.resetPWDInShopGroupChildAccount;
			this.editUserCallServer = Hualala.Global.updateShopGroupChildAccount;
			this.addUserCallServer = Hualala.Global.addShopGroupChildAccount;
			this.removeCallServer = Hualala.Global.removeShopGroupChildAccount;
			this.unbindMobileCallServer = Hualala.Global.unbindMobileInShopGroupChildAccount;
			this.bindMobileCallServer = Hualala.Global.bindMobileInShopGroupChildAccount;
			this.updateRoleBindingCallServer = Hualala.Global.updateRoleBinding;
			this.queryRoleBindingCallServer = Hualala.Global.queryRoleBinding;
			this.set("ds_role", new IX.IListManager());
			if (!IX.isEmpty(user)) {
				this.updateUserModel(user);
			}
			
			// this.mapUserRoles();
			this.bindEvent();
		}
	});
	BaseUserModel.proto({
		updateUserModel : function (user) {
			this.set(user);
			this.updateRoleStore();
		},
		updateRoleStore : function (roleCfg) {
			var self = this, roleHT = self.get('ds_role'),
				roleTypes = IX.isEmpty(roleCfg) ? (',' + this.get('roleType') + ',') : roleCfg,
				siteRoleType = Hualala.TypeDef.SiteRoleType,
				roleHT = self.get('ds_role');
			roleHT.clear();
			var roles = _.map(siteRoleType, function (role) {
					var roleType = $XP(role, 'roleType');
					var ret = null;
					if (IX.isString(roleTypes)) {
						ret = IX.inherit(role, {
							binded : roleTypes.indexOf(',' + roleType + ',') >= 0 ? true : false
						});
					} else {
						var _r = _.find(roleTypes, function (el) {
							return $XP(el, 'type') == roleType;
						});
						ret = IX.inherit(role, {
							binded : !_r ? false : true,
							items : $XP(_r, 'items', [])
						});
					}
					roleHT.register(roleType, ret);
					return ret;
				});
			
			self.set('roles', roles);
		},
		getRoleInfoByType : function (roleType) {
			var self = this, roleHT = self.get('ds_role');
			return roleHT.get(roleType);
		},
		updateRoleItemsBind : function (roleType, items) {
			var self = this;
			var role = self.getRoleInfoByType(roleType);
			role.items = items || [];

		},
		updateRoleBind : function (roleType, binded) {
			var self = this;
			var role = self.getRoleInfoByType(roleType);
			role.binded = !binded ? false : true;
		},
		// mapUserRoles : function () {
		// 	var roleType = (this.get('roleType') + ',') || '';
		// 	var siteRoleType = Hualala.TypeDef.SiteRoleType;
		// 	var roles = _.reject(siteRoleType, function (role) {
		// 		return roleType.indexOf($XP(role, 'roleType', '') + ',') < 0;
		// 	});
		// 	this.set('roles', roles);
		// },
		getRoleBindings : function () {
			var self = this,
				roleHT = self.get('ds_role'),
				roles = roleHT.getAll();
			var ret = _.reject(roles, function (role) {return !$XP(role, 'binded');});
			ret = _.map(ret, function (role) {
				return {
					type : $XP(role, 'roleType'),
					items : $XP(role, 'items', [])
				};
			});
			return ret;
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"addUser" : function (params) {
					// TODO 新建账号基本信息
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postParams = $XP(params, 'params', {});
					self.addUserCallServer(postParams, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							self.updateUserModel($XP(res, 'data.records')[0]);
							successFn();
						}
					});
				},
				"editUser" : function (params) {
					// TODO 设置用户基本信息
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postParams = $XP(params, 'params', {});
					self.editUserCallServer(postParams, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							self.set(postParams);
							successFn();
						}
					});
						
				},
				"resetPWD" : function (params) {
					// TODO 重置用户密码
					var self = this;
					var loginPWD = $XP(params, 'params.loginPWD', ''),
						postParams = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					postParams = IX.inherit(postParams, {
						accountID : self.get('accountID')
					});
					self.resetPWDCallServer(postParams, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							successFn();
						}
					});
				},
				"remove" : function (params) {
					// 删除用户
					var successFn = $XF(params, 'successFn');
					self.removeCallServer({
						accountID : self.get('accountID')
					}, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						} else {
							toptip({
								msg : "删除成功!",
								type : 'success'
							});
							successFn();
						}
					});
				},
				"editRole" : function (params) {
					// TODO 设置用户角色权限
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postData = {
							accountID : self.get('accountID'),
							roles : JSON.stringify(self.getRoleBindings())
						};
					
					self.updateRoleBindingCallServer(postData, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							successFn();
						}
					});
				},
				"unbindMobile" : function (params) {
					// 解绑定手机号
					var successFn = $XF(params, 'successFn');
					self.unbindMobileCallServer({
						accountID : self.get('accountID')
					}, function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						} else {
							toptip({
								msg : "解绑定成功!",
								type : 'success'
							});
							self.set('mobileBinded', 0);
							successFn();
						}
					});
				},
				"bindMobile" : function (params) {
					// 绑定手机号
					var self = this;
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postData = IX.inherit($XP(params, 'params', {}), {
							groupName : self.get('groupLoginName')
						});
					self.bindMobileCallServer(postData, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "绑定成功!",
								type : 'success'
							});
							self.set({
								'userMobile' : $XP(postData, 'userMobile'),
								'mobileBinded' : 1
							});
							successFn();
						}
					});
				},
				"queryRoleBinding" : function (params) {
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.queryRoleBindingCallServer({
						accountID : self.get('accountID')
					}, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							self.updateRoleStore($XP(res, 'data.roles', null));
							successFn();
						}
					});
				}
			});
		}
	});
	Hualala.User.BaseUserModel = BaseUserModel;
	
})(jQuery, window);
(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var QueryShopResultModel = Hualala.Shop.CardListModel.subclass({
		constructor : function () {
			this.origData = null;
			this.dataStore = new IX.IListManager();
		}
	});
	QueryShopResultModel.proto({
		initDataStore : function (data) {
			var self = this;
			self.origData = data;
			_.each(self.origData, function (shop) {
				self.dataStore.register($XP(shop, 'shopID'), shop);
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			var pageNo = self.get('pageNo'),
				pageSize = self.get('pageSize'),
				cityID = self.get('cityID'),
				areaID = self.get('areaID'),
				keywordLst = self.get('keywordLst'),
				totalSize = 0,
				start = (pageNo - 1) * pageSize,
				end = pageSize * pageNo,
				pageCount = 0;
			var shops = [];
			shops = areaID.length > 0 ? _.filter(self.origData, function (_shop) {
				return $XP(_shop, 'areaID') == areaID;
			}) : self.origData;
			shops = cityID.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'cityID') == cityID;
			}) : shops;
			shops = keywordLst.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'shopName') == keywordLst;
			}) : shops;
			totalSize = shops.length;
			pageCount = Math.ceil(totalSize / pageSize);
			shops = _.filter(shops, function (_shop, idx) {
				return idx >= start && idx < end;
			});
			self.updateDataStore(shops, pageNo);
			self.updatePagerParams({
				pageCount : pageCount,
				totalSize : totalSize,
				pageNo : pageNo,
				pageSize : pageSize
			});
			cbFn(self);
		}
	});

	Hualala.User.QueryShopResultModel = QueryShopResultModel;
})(jQuery, window);














;(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var UserCtrlBtns = [
		{act : "reviewRole", label : "查看权限", clz : "btn-info"},
		{act : "editRole", label : "修改权限", clz : "btn-warning"},
		{act : "unbindMobile", label : "解绑手机", clz : "btn-warning"},
		{act : "resetPWD", label : "重置密码", clz : "btn-warning"},
		{act : "editUser", label : "修改账号", clz : "btn-warning"},
		{act : "remove", label : "删除账号", clz : "btn-danger"}
	];

	var UserListView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 结果容器
			this.$resultBox = null;
			// 结果列表
			this.$list = null;
			// 分页容器
			this.$pager = null;
			// 搜素栏
			this.$queryBar = null;
			this.$emptyBar = null;
			this.loadTemplates();
		}
	});
	UserListView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("User List View Init Failed!");
				return;
			}
			this.initLayout();
			this.keywordLst = '';
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$list = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			
		},
		// 加载View层模版
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_list')),
				queryTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_query')),
				ctrlTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_ctrl')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_item')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				roleBindingTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_binding_info'));
			Handlebars.registerPartial("userItem", Hualala.TplLib.get('tpl_user_item'));
			this.set({
				layoutTpl : layoutTpl,
				queryTpl : queryTpl,
				ctrlTpl : ctrlTpl,
				listTpl : listTpl,
				btnTpl : btnTpl,
				roleBindingTpl : roleBindingTpl,
				itemTpl : itemTpl
			});
		},
		// 获取账号状态的配置
		mapUserStatusLabel : function (s) {
			var self = this,
				status = Hualala.TypeDef.UserStatus;
			return _.find(status, function (o) {
				return $XP(o, 'value') == s;
			});
		},
		// 格式化列表渲染数据
		mapListRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (user, i, l) {
				return self.mapItemRenderData(user);
			});
			return {
				userItem : {list : ret}
			};
		},
		// 格式化条目渲染数据
		mapItemRenderData : function (user) {
			var self = this;
			var oUserStatus = self.mapUserStatusLabel($XP(user, 'accountStatus'));
			return IX.inherit(user, {
				clz : '',
				accountStatusClz : $XP(oUserStatus, 'value') == 0 ? 'label-danger' : 'label-success',
				mobileIsBinded : $XP(user, 'mobileBinded') == 0 ? false : true,
				accountStatusLabel : $XP(oUserStatus, 'label'),
				cellClz : $XP(user, 'mobileBinded') == 0 ? 'text-danger' : ''
			});
		},
		// 格式化搜索栏数据
		mapChosenUserData : function () {
			var self = this;
			var users = self.model.getUsers();
			var ret = [];
			ret.push({
				name : '账号',
				items : _.map(users, function (user, i, l) {
					return {
						code : $XP(user, 'accountID'),
						name : $XP(user, 'loginName') + '(' + $XP(user, 'userName') + ')'
					};
				})
			});
			return ret;
		},
		// 渲染View层
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				queryID = $XP(pagerParams, 'queryID', null);
			queryID = IX.isString(queryID) && queryID.length > 0 ? [queryID] : null;
			var users = model.getUsers(queryID);
			var renderData = self.mapListRenderData(users);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.$emptyBar && self.$emptyBar.destroy();
			self.$list.empty();
			if (users.length == 0) {
				self.$emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.$emptyBar.show();
			} else {
				self.$list.html(html);
			}
		},
		// 渲染单条用户数据
		rerenderUser : function (accountID) {
			var self = this,
				model = self.model,
				mUser = model.getUserModelByUserID(accountID);
			var renderData = self.mapItemRenderData(mUser.getAll()),
				tpl = self.get('itemTpl'),
				htm = tpl(renderData);
			var $tr = self.$list.find('tr.user-item[data-id=' + accountID + ']');
			if ($tr.length == 0) {
				$(htm).prependTo(self.$list.find('table.table > tbody'));
			} else {
				$tr.after(htm);
				$tr.remove();
			}
		},
		initChosenPanel : function () {
			var self = this;
			var matcher = (new Pymatch([]));
			var sections = self.model.getUsers();
			var getMatchedFn = function (searchText) {
				matcher.setNames(_.map(sections, function (el) {
					return IX.inherit(el, {
						name : el.loginName,
						py : el.py + ';' + el.loginName + (!el.userMobile ? '' : (';' + el.userMobile.split(';')))
					});
				}));
				var matchedSections = matcher.match(searchText);
				var matchedOptions = {};
				_.each(matchedSections, function (el, i) {
					matchedOptions[el[0].accountID] = true;
				});
				return matchedOptions;
			};
			self.$queryBar.find('.navbar-form[role="search"] select').chosen({
				width : '200px',
				placeholder_text : "请选择账号",
				no_results_text : "抱歉，没有找到！",
				allow_single_deselect : true,
				getMatchedFn : getMatchedFn
			}).change(function (e) {
				var $this = $(this);
				// self.model.updatePagerParams({queryID : $this.val()});
				self.keywordLst = $this.val();
			});
		},
		// 渲染搜索栏
		renderQueryPanel : function () {
			var self = this;
			var queryTpl = this.get('queryTpl');
			var queryChosenUsers = this.mapChosenUserData();
			var $oldQueryBar = self.$container.find('.shop-query');
			if ($oldQueryBar.length > 0) {
				$oldQueryBar.remove();
			}
			self.$queryBar = $(queryTpl({
				optGrp : queryChosenUsers
			}));

			self.$container.prepend(self.$queryBar);
			self.initChosenPanel();
		},
		// 格式化用户操作按钮渲染数据
		mapUserBtns : function (mUser) {
			var self = this,
				sessionUser = Hualala.getSessionUser(),
				sessionLoginName = $XP(sessionUser, 'loginName', '');
			var roleType = mUser.get('roleType'),
				roles = mUser.get('roles'),
				mobileBinded = mUser.get('mobileBinded'),
				loginName = mUser.get('loginName');
			roles = _.filter(roles, function (role) {
				return $XP(role, 'binded') == true;
			});
			return _.map(UserCtrlBtns, function (el) {
				var act = $XP(el, 'act');
				if (act == 'reviewRole' && (!roles || roles.length == 0)) {
					return IX.inherit(el, {
						clz : el.clz + ' hidden disabled'
					});
				}
				if (act == 'unbindMobile' && mobileBinded == 0) {
					return IX.inherit(el, {
						clz : el.clz + ' hidden disabled'
					});
				}
				if (act == 'remove' && sessionLoginName == loginName) {
					return IX.inherit(el, {
						clz : el.clz + ' hidden disabled'
					});
				}
				return el;
			});
		},
		// 渲染账号控制按钮
		renderUserCtrl : function (userID) {
			var self = this;
			var ctrlTpl = self.get('ctrlTpl');
			var mUser = self.model.getUserModelByUserID(userID),
				roles = mUser.get('roles'),
				btns = self.mapUserBtns(mUser);
			var $ctrlBar = $(ctrlTpl({
					id : userID,
					btns : btns
				})).hide(),
				$tr = self.$list.find('tr[data-id=' + userID + ']'),
				o = $tr.offset(),
				o1 = self.$list.find('table tbody').offset(),
				h = $tr.height(),
				w = $tr.width();
			// $tr.append($ctrlBar);
			self.$list.find('.table-responsive').append($ctrlBar);
			
			$ctrlBar.css({
				height : h + 'px',
				width : 0,
				display : 'block',
				top : (o.top - o1.top) + 'px',
				right : 0
			});
			$ctrlBar.find('.user-ctrl-box').css({
				width : w + 'px',
				height : h + 'px'
			});
			$ctrlBar.animate({
				width : w + 'px'
			}, 400);
		},
		bindEvent : function () {
			var self = this;
			// 用户操作按钮交互
			self.$list.on('mouseenter', 'tr.user-item', function (e) {
				var $tr = $(this), userID = $tr.attr('data-id');
				self.renderUserCtrl(userID);
				var $otherCtrls = self.$list.find('.user-ctrl[data-id!=' + userID + ']');
				$otherCtrls.length > 0 && $otherCtrls.trigger('mouseleave');

			});
			self.$list.on('mouseleave', '.user-ctrl', function (e) {
				var $tr = $(this), userID = $tr.attr('data-id'),
					$ctrlBar = self.$list.find('.user-ctrl[data-id=' + userID + ']');
				var w = $tr.width();
				$ctrlBar.animate({
					width : 0
				}, 400, function () {
					$ctrlBar.remove();
				});
				
			});
			self.$list.on('click', '.user-ctrl .btn', function (e) {
				var $btn = $(this), act = $btn.attr('data-act');
				var accountID = $btn.parents('.user-ctrl').attr('data-id'),
					mUser = self.model.getUserModelByUserID(accountID),
					loginName = mUser.get('loginName') || '';
				switch(act) {
					case "reviewRole":
						// TODO 查看角色权限配置
						self.initReviewRoleModal(accountID, act);
						break;
					case "editRole":
						// TODO 编辑角色权限配置
						self.initSetRoleModal(accountID, act);
						break;
					case "unbindMobile":
						// TODO 解绑定手机
						Hualala.UI.Confirm({
							title : '手机号解除绑定',
							msg : '是否解除绑定账号(' + loginName + ')的手机号？',
							okLabel : '解除绑定',
							okFn : function () {
								self.model.emit(act, {
									accountID : accountID,
									successFn : function () {
										self.rerenderUser(accountID);
									}
								});
							}
						});
						break;
					case "resetPWD":
						// TODO 重置密码
						self.initResetPWDModal(accountID, act);
						break;
					case "editUser":
						// TODO 编辑用户基本信息
						self.initUserBaseInfoModal(accountID, act);
						break;
					case "remove":
						// TODO 删除用户账号
						Hualala.UI.Confirm({
							title : '删除账号',
							msg : '是否删除账号(' + loginName + ')？',
							okLabel : '删除',
							okFn : function () {
								self.model.emit(act, {
									accountID : accountID,
									successFn : function () {
										var $curTR = self.$list.find('tr.user-item[data-id=' + accountID + ']');
										self.renderQueryPanel();
										$curTR.hide(400, function () {
											$curTR.remove();
										});
									}
								});
							}
						});
						break;
				}
			});
			// 用户查询栏的操作
			self.$queryBar.parent().on('click', '.shop-query .btn', function (e) {
				var $btn = $(this),
					act = $btn.attr('data-act');
				if (act == 'query') {
					self.model.updatePagerParams({queryID : (self.keywordLst || null)});
					self.emit('query', self.model.getPagerParams());
				} else if (act == 'create') {
					// TODO 创建用户向导
					self.initCreateUserModal(act);
				}
			});
			self.$queryBar.parent().on('keyup', '.shop-query .chosen-container', function (e) {
				var $this = $(this);
				if ($this.hasClass('chosen-container-active') && !$this.hasClass('chosen-with-drop')) {
					$this.find('input').first().trigger('blur.chosen');
					self.$queryBar.find('.query-btn').trigger('click');
				}
			});

		},
		// 定位搜索的账号
		moveToTarget : function (params) {
			var self = this;
			var accountID = $XP(params, 'queryID', null);
			if (!accountID) return;
			var $tar = self.$list.find('tr.user-item[data-id=' + accountID + ']');
			$tar.removeClass('shake');
			Hualala.Common.smoothScrollMiddle($tar, 400, function () {
				setTimeout(function () {
					$tar.addClass('shake');

				}, 0);
			});
		},
		// 创建重置密码窗口
		initResetPWDModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			var resetPWDModal = new Hualala.UI.ModalDialog({
				id : "reset_pwd_modal",
				clz : 'account-modal',
				title : "重置密码",
				afterHide : function () {
					self.resetPWDView = null;
					self.resetPWDModal = null;
				}
			});
			resetPWDModal.show();
			self.resetPWDModal = resetPWDModal;
			self.resetPWDView = new Hualala.User.ResetPWDView({
				mode : 'edit',
				parentView : self,
				model : mUser,
				evtType : evtType,
				successFn : function (mUser) {

				},
				failFn : function (mUser) {

				}
			});
		},
		// 用户基本信息编辑窗口
		initUserBaseInfoModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			var userBaseInfoModal = new Hualala.UI.ModalDialog({
				id : "user_base_modal",
				clz : 'account-modal',
				title : "修改账号信息",
				afterHide : function () {
					self.userBaseInfoView = null;
					self.userBaseInfoModal = null;
				}
			});
			userBaseInfoModal.show();
			self.userBaseInfoModal = userBaseInfoModal;
			self.userBaseInfoView = new Hualala.User.UserBaseInfoView({
				mode : 'edit',
				parentView : self,
				model : mUser,
				evtType : evtType,
				successFn : function (mUser) {
					self.rerenderUser(mUser.get('accountID'));
					self.renderQueryPanel();
				},
				failFn : function (mUser) {

				}
			});
		},
		// 角色设置窗口
		initSetRoleModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			var userRoleModal = new Hualala.UI.ModalDialog({
				id : "user_role_modal",
				clz : "account-modal",
				title : "修改角色信息",
				afterHide : function () {
					self.userRoleModal = null;
					self.userRoleView = null;
				}
			});
			userRoleModal.show();
			self.userRoleModal = userRoleModal;
			self.userRoleView = new Hualala.User.UserRoleView({
				mode : 'edit',
				parentView : self,
				model : mUser,
				evtType : evtType,
				successFn : function (mUser) {
					self.rerenderUser(mUser.get('accountID'));
				},
				failFn : function (mUser) {

				}
			});
		},
		renderRoleBinding : function (mUser, modal, shopSchemaModel, settleData, roles) {
			var self = this;
			var $body = modal._.body, $footer = modal._.footer;
			var accountName = mUser.get('loginName');
			var renderData = _.map(roles, function (role) {
				var items = $XP(role, 'items', []),
					roleType = $XP(role, 'roleType', '');
				var _items = [];
				if (roleType == 'finance') {
					_items = _.map(items, function (id) {
						var matched = _.find(settleData, function (unit) {
							return $XP(unit, 'settleUnitID') == id;
						});
						return {
							id : id,
							name : $XP(matched, 'settleUnitName', '')
						};
					});
				} else if (roleType == 'manager' || roleType == 'area-manager') {
					_items = items.length == 0 ? [] : shopSchemaModel.getShops(items);
					_items = _.map(_items, function (item) {
						return {
							id : $XP(item, 'shopID'),
							name : $XP(item, 'shopName')
						};
					});
				}
				return IX.inherit(role, {
					items : _items
				});
			});
			renderData = _.reject(renderData, function (el) {
				return !$XP(el, 'binded');
			});
			var tpl = self.get('roleBindingTpl'),
				btnTpl = self.get('btnTpl'),
				btns = [
					{clz : 'btn-default', name : 'cancel', label : '关闭'}
				];
			var htm = tpl({
				accountName : accountName,
				roles : renderData
			});
			$body.html(htm);
			$footer.html(btnTpl({
				btns : btns
			}));
			$footer.find('.btn').click(function (e) {
				modal.hide();
			});
		},
		// 查看角色设置窗口
		initReviewRoleModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			self.shopSchemaModel = null;
			self.settleData = null;
			var modal = new Hualala.UI.ModalDialog({
				id : "user_role_info_modal",
				clz : "account-modal",
				title : "查看账号权限设置",
				afterHide : function () {

				}
			});
			modal.show();
			var getShopsData = function (cbFn) {
				var shopQueryModel = new Hualala.Shop.QueryModel();
				shopQueryModel.init({}, cbFn);
			};
			var getSettleData = function (cbFn) {
				var callServer = Hualala.Global.queryAccount;
				callServer({}, function (res) {
					if (res.resultcode != '000') {
						toptip({
							msg : $XP(res, 'resultmsg', ''),
							type : 'danger'
						});
						modal.hide();
					} else {
						cbFn($XP(res, 'data.records'));
					}
				});
			};
			getShopsData(function (queryModel) {
				self.shopSchemaModel = queryModel;
				getSettleData(function (data) {
					self.settleData = data;
					mUser.emit('queryRoleBinding', {
						successFn : function () {
							var roles = mUser.get('roles');
							self.renderRoleBinding(mUser, modal, self.shopSchemaModel, self.settleData, roles);
							modal.show();
						},
						failFn : function () {
							modal.hide();
						}
					});
				});
			});
			
		},
		// 创建账号
		initCreateUserModal : function (evtType) {
			var self = this;
			self.createUserView = new Hualala.User.CreateUserModal({
				mode : 'add',
				parentView : self,
				evtType : evtType,
				successFn : function (mUser) {
					// TODO add item to list
					self.model.addItem(mUser);
					self.rerenderUser(mUser.get('accountID'));
					self.renderQueryPanel();
				},
				failFn : function (mUser) {

				}
			});
		}
	});
	Hualala.User.UserListView = UserListView;
	
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var QueryShopResultView = Hualala.Shop.CardListView.subclass({
		constructor : Hualala.Shop.CardListView.prototype.constructor
	});
	QueryShopResultView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_bind_shop_item'));
			Handlebars.registerPartial("shopCard", Hualala.TplLib.get('tpl_bind_shop_item'));
			Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl,
				itemsCache : null
			});
		},
		updateItemsCache : function (roleType, itemID, mutiSelect, checked) {
			var self = this;
			var itemsCache = self.get('itemsCache');
			if (mutiSelect) {
				if (!checked) {
					itemsCache = _.without(itemsCache, itemID);
				} else {
					itemsCache.push(itemID);
				}
			} else {
				itemsCache = [itemID];
			}
			self.set('itemsCache', itemsCache);
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var mutiSelect = self.get('mutiSelect'),
				mUser = self.get('userModel'),
				roleType = self.get('roleType'),
				roleInfo = mUser.getRoleInfoByType(roleType),
				items = !$XP(roleInfo, 'binded') ? [] : $XP(roleInfo, 'items');
			var itemsCache = self.get('itemsCache');
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			var ret = _.map(data, function (shop, i, l) {
				var shopID = $XP(shop, 'shopID'),
					checked = !_.find(itemsCache, function (el) {return el == shopID}) ? '' : 'checked';
				return IX.inherit(shop, {
					type : !mutiSelect ? 'radio' : 'checkbox',
					clz : 'bind-item',
					shopNameLabel : $XP(shop, 'shopName', ''),
					checked : checked
				});
			});
			return {
				shopCard : {
					list : ret
				}
			};
		},
		render : function (viewCfg) {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			this.set(viewCfg);
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.$list.empty();
			self.$list.html(html);
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		},
		bindEvent : function () {
			var self = this;
			self.$list.tooltip({
				selector : '[title]'
			});
			self.$list.delegate(':radio,:checkbox', 'change', function (e) {
				var $el = $(this),
					checked = !this.checked ? false : true,
					itemID = $el.val(),
					mutiSelect = self.get('mutiSelect'),
					roleType = self.get('roleType');
				var mUser = self.get('userModel');
				// mUser.updateRoleBind(roleType, itemID, mutiSelect, checked);
				self.updateItemsCache(roleType, itemID, mutiSelect, checked);
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
		},
		bindItems : function () {
			var self = this;
			var mUser = self.get('userModel'),
				roleType = self.get('roleType');
			mUser.updateRoleItemsBind(roleType, self.get('itemsCache'));
		}
	});

	Hualala.User.QueryShopResultView = QueryShopResultView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var UserListModel = Hualala.User.UserListModel;
	var UserListView = Hualala.User.UserListView;
	var UserListController = Stapes.subclass({
		/**
		 * 店铺用户管理列表控制器
		 * @param  {Object} cfg 配置参数
		 *         @param {jQuery Object} container 容器
		 *         @param {Object} view 用户列表的View层实例
		 *         @param {Object} model 用户列表的数据层实例
		 * @return {Object}     控制器对象
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.container || !this.view || !this.model ) {
				throw("User List init faild!!");
			}
			this.isReady = false;
			this.bindEvent();
			this.init();
		}
	});
	UserListController.proto({
		init : function (params) {
			this.model.init(params);
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.loadingModal = new LoadingModal({start : 100});
			this.isReady = true;
			this.emit('load', {});
		},
		hasReady : function () {return this.isReady;},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					self.model.emit('load', params);
				}
			}, this);
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						self.loadingModal.hide();
					};
					self.loadingModal.show();
					self.model.load(params, cbFn);
				},
				unbindMobile : function (params) {
					var self = this;
					var mUser = self.model.getUserModelByUserID($XP(params, 'accountID'));
					mUser.emit('unbindMobile', {
						successFn : function () {
							$XF(params, 'successFn')();
						}
					});
				},
				remove : function (params) {
					var self = this;
					var accountID = $XP(params, 'accountID'),
						mUser = self.model.getUserModelByUserID(accountID);
					mUser.emit('remove', {
						successFn : function () {
							self.model.removeUsers(accountID);
							$XF(params, 'successFn')();
						}
					});
				},
				resetPWD : function (params) {
					var self = this;
					var mUser = self.model.getUserModelByUserID($XP(params, 'accountID'));
					mUser.emit('resetPWD', params);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
					self.view.renderQueryPanel();
					self.view.bindEvent();
				},
				query : function (params) {
					var self = this;
					self.view.moveToTarget(params);
				}
			}, this);
		}
	});
	Hualala.User.UserListController = UserListController;
	
})(jQuery, window);
(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var QueryShopController = Hualala.Shop.QueryController.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.resultContainer = $XP(cfg, 'resultContainer', null);
			this.set({
				accountID : $XP(cfg, 'accountID', ''),
				roleType : $XP(cfg, 'roleType', ''),
				mutiSelect : $XP(cfg, 'mutiSelect', false),
				userModel : $XP(cfg, 'userModel')
			});
			this.model = new Hualala.Shop.QueryModel();
			this.view = new Hualala.Shop.QueryView();
			this.resultController = new Hualala.User.QueryShopResultController({
				container : this.resultContainer,
				model : new Hualala.User.QueryShopResultModel(),
				view : new Hualala.User.QueryShopResultView()
			});
			this.init();
		}
	});
	QueryShopController.proto({
		init : function () {
			var self = this;
			self.bindEvent();
			self.model.emit('load', function () {
				if (!self.model.hasReady()) {
					throw("Shop Query Init Failed!");
					return;
				}
				self.resultController.initDataStore(self.model.getShops(), {
					accountID : self.get('accountID'),
					roleType : self.get('roleType'),
					mutiSelect : self.get('mutiSelect'),
					userModel : self.get('userModel')
				});
				self.view.emit('init');
				self.emit('reset');
			});
		},
		bindEvent : function () {
			this.on({
				reload : function () {
					var self = this;
					self.model.distory();
					self.view.distory();
					self.init();
				},
				query : function (params) {
					var self = this;
					IX.Debug.info('DEBUG: User Query Shops Params:');
					IX.Debug.info(params);
					self.resultController && self.resultController.emit('load', IX.inherit(params, {
						pageNo : 1,
						pageSize : 50
					}));
				},
				bindItems : function () {
					var self = this;
					self.resultController && self.resultController.emit('bindItems');
				},
				reset : function () {
					var self = this;
					var mUser = self.get('userModel'),
						roleType = self.get('roleType'),
						roleInfo = mUser.getRoleInfoByType(roleType),
						items = !$XP(roleInfo, 'binded') ? [] : $XP(roleInfo, 'items');
					if (items.length > 0) {
						self.view.keywordLst = items[0];
						var shop = self.view.model.getShops(items)[0],
							cityID = $XP(shop, 'cityID', -1),
							areaID = $XP(shop, 'areaID', -1);
						self.view.updateFilterCityLayout(cityID);
						self.view.updateFilterAreaLayout(areaID);
						self.emit('query', self.view.getQueryParams());
					}

				}
			}, this);
			this.model.on({
				load :function (cbFn) {
					var self = this,
						params = {
							accountID : self.get('accountID')
						};
					self.model.init(params, cbFn);
				}
			}, this);
			this.view.on({
				init : function () {
					var self = this;
					self.view.init({
						model : self.model,
						container : self.container
					});
				},
				filter : function (params) {
					var self = this;
					self.emit('query', params);
				},
				query : function (params) {
					var self = this;
					self.emit('query', params);
				}
			}, this);
		}
	});
	Hualala.User.QueryShopController = QueryShopController;
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var QueryShopResultController = Hualala.Shop.ShopListController.subclass({
		constructor : Hualala.Shop.ShopListController.prototype.constructor
	});
	QueryShopResultController.proto({
		initDataStore : function (data, params) {
			this.model.initDataStore(data);
			this.set(params);
		},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					self.model.emit('load', params);
				},
				bindItems : function () {
					var self = this;
					self.view.bindItems();
				}
			}, this);
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
					};
					self.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render(this.getAll());
				},
				reloadPager : function () {
					var self = this;
					self.view.initPager(params);
				}
			}, this);
		}
	});
	Hualala.User.QueryShopResultController = QueryShopResultController;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.User");
	var initUserMgrPage = function () {
		var $body = $('#ix_wrapper > .ix-body > .container');
		var panel = new Hualala.User.UserListController({
			container : $body,
			model : new Hualala.User.UserListModel({callServer : Hualala.Global.queryShopGroupChildAccount}),
			view : new Hualala.User.UserListView()
		});
	};
	Hualala.User.UserListInit = initUserMgrPage;
})($, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	/*图标相关配置信息*/
	var BaseChartTitle = {
		text : '', subtext : '', x : 'center', y : 'top', textAlign : 'center'
	};
	var BaseChartTooltip = {
		trigger : 'item',
		formatter : "{a} <br/>{b} : {c} (约{d}%)"
	};
	var BaseChartToolBox = {
		show : true,
		feature : {
			mark : {show : false},
			dataView : {show : false, readOnly : true},
			restore : {show : true},
			saveAsImage : {show : true}
		}
	};
	var BaseChartLegend = {
		orient : 'vertical',
		x : 'left',
		y : '50px',
		data : null
	};

	var MemberSchemaChartConfigs = [
		{id : "member_level_chart", clz : "col-xs-12 col-sm-6 ", chartClz : "ix-chart-canvas", label : "会员等级占比图"},
		{id : "member_gender_chart", clz : "col-xs-12 col-sm-6 ", chartClz : "ix-chart-canvas", label : "会员性别占比"},
		{id : "member_source_chart", clz : "col-xs-12 col-sm-12 ", chartClz : "ix-chart-canvas", label : "会员来源占比图"}
	];
	Hualala.CRM.BaseChartTitle = BaseChartTitle;
	Hualala.CRM.BaseChartTooltip = BaseChartTooltip;
	Hualala.CRM.BaseChartToolBox = BaseChartToolBox;
	Hualala.CRM.BaseChartLegend = BaseChartLegend;
	Hualala.CRM.MemberSchemaChartConfigs = MemberSchemaChartConfigs;

	var MemberSchemaTableHeaderConfigs = [
		{
			clz : '',
			cols : [
				{clz : '', label : '会员等级', colspan : '', rowspan : '2'},
				{clz : '', label : '会员数', colspan : '', rowspan : '2'},
				{clz : '', label : '所占比率', colspan : '', rowspan : '2'},
				{clz : '', label : '性别比率', colspan : '3', rowspan : ''},
				{clz : '', label : '来源比率', colspan : '2', rowspan : ''},
				{clz : '', label : '储值余额', colspan : '', rowspan : '2'},
				{clz : '', label : '积分余额', colspan : '', rowspan : '2'},
				{clz : '', label : '客单价<br/>(平均每单消费金额)', colspan : '', rowspan : '2'}
			]
		},
		{
			clz : '',
			cols : [
				{clz : '', label : '男', colspan : '', rowspan : ''},
				{clz : '', label : '女', colspan : '', rowspan : ''},
				{clz : '', label : '未知', colspan : '', rowspan : ''},
				{clz : '', label : '线上', colspan : '', rowspan : ''},
				{clz : '', label : '线下', colspan : '', rowspan : ''}
			]
		}
	];
	Hualala.CRM.MemberSchemaTableHeaderConfigs = MemberSchemaTableHeaderConfigs;

	var MemberSchemaModel = Stapes.subclass({
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', Hualala.Global.queryCrmMemberSchema);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
		}
	});
	MemberSchemaModel.proto({
		init : function (params) {
			this.set({
				ds_member : new IX.IListManager(),
				memberSummarize : null
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.callServer(params, function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn.apply(self);
			});
		},
		updateDataStore : function (data) {
			var self = this,
				memberHT = self.get('ds_member');
			var summarize = $XP(data, 'datasets.cardOverViewSummerrizingDs.data.records', []),
				members = $XP(data, 'records', []);
			_.each(members, function (m) {
				var cardLevelName = $XP(m, 'cardLevelName');
				memberHT.register(cardLevelName, m);
			});
			self.set('memberSummarize', summarize);
		},
		getMemberByLevelNames : function (names) {
			var self = this,
				memberHT = self.get('ds_member');
			names = IX.isString(names) ? [names] : names;
			if (IX.isEmpty(names)) {
				return memberHT.getAll();
			}
			return memberHT.getByKeys(names);
		},
		getLevelChartData : function () {
			var self = this,
				members = self.getMemberByLevelNames();
			return _.map(members, function (m) {
				return {
					name : $XP(m, 'cardLevelName', ''),
					value : parseInt($XP(m, 'cardCount', 0))
				};
			});
		},
		getGenderChartData : function () {
			var self = this,
				summary = self.get('memberSummarize')[0] || {};
			var genders = _.map(Hualala.TypeDef.GENDER, function (el) {
				var v = parseInt($XP(el, 'value', 0)), name = null, value = null;
				switch (v) {
					case 0:
						name = "女";
						value = parseInt($XP(summary, 'sexFemaleCount', 0));
						break;
					case 1:
						name = "男";
						value = parseInt($XP(summary, 'sexMaleCount', 0));
						break;
					case 2:
						name = "未知"
						value = parseInt($XP(summary, 'sexUnknownCount', 0));
						break;
				}
				return {
					name : name,
					value : value
				};
			});
			return genders;
		},
		getSourceChartData : function () {
			var self = this,
				summary = self.get('memberSummarize')[0] || {};
			var sources = [{key : "onLineCount", name : "线上"}, {key : "inShopCount", name : "线下"}];
			return _.map(sources, function (o) {
				return {
					name : $XP(o, 'name', ''),
					value : parseInt($XP(summary, $XP(o, 'key'), 0))
				};
			});
		}
	});
	Hualala.CRM.MemberSchemaModel = MemberSchemaModel;

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	
	var MemberSchemaView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 数据表容器
			this.$tableBox = null;
			// 图标容器
			this.$chartBox = null;
			
			this.$emptyBar = null;
			this.chartsCfg = Hualala.CRM.MemberSchemaChartConfigs;
			this.loadingModal = new LoadingModal({start : 100});
			this.loadTemplates();
		}
	});
	MemberSchemaView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("CRM Member Schema View Init Failed!");
				return;
			}
			this.initLayout();
		},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_schema_layout')),
				tableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_cmpx_datagrid'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			this.set({
				layoutTpl : layoutTpl,
				tableTpl : tableTpl
			});
		},
		initLayout : function () {
			var self = this, layoutTpl = self.get('layoutTpl');
			self.$container.html(layoutTpl({charts : self.chartsCfg}));
			self.$tableBox = self.$container.find('.crm-schema-table');
			self.$chartBox = self.$container.find('.crm-schema-chart');
		},
		mapTableRenderData : function () {
			var self = this, memberData = self.model.getMemberByLevelNames(),
				summary = self.model.get('memberSummarize'),
				tableHeader = Hualala.CRM.MemberSchemaTableHeaderConfigs,
				colNames = "cardLevelName,cardCount,levelCardCountRate,sexMaleRate,sexFemaleRate,sexUnknownRate,onLineRate,inShopRate,moneyBalanceSum,pointBalanceSum,consumptionPerOrder";
			var math = Hualala.Common.Math;
			var mapColData = function (member) {
				var cols = _.map(colNames.split(','), function (k) {
					var v = $XP(member, k, ''),
						text = '', title = '', clz = '';
					var mapCardLevelTip = function (m) {
						var cardLevelName = $XP(m, 'cardLevelName'),
							// 0:不享受会员价，1：享受会员价
							isVipPrice = $XP(m, 'isVipPrice', 0) == 0 ? false : true,
							discountRate = $XP(m, 'discountRate', 1) == 1 ? "不打折" : ('打' + math.multi($XP(m, 'discountRate', 1), 10) + '折'),
							// 0：部分菜品打折，1：全部菜品打折
							discountRange = $XP(m, 'discountRange', 0) == 0 ? "(部分不打折)，" : "",
							// 折扣描述
							discountDescription = $XP(m, 'discountDescription', ''),
							switchLevelUpPoint = $XP(m, 'switchLevelUpPoint', null);
						var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_card_level_info'));
						return tpl({
							cardLevelName : cardLevelName,
							isVipPrice : isVipPrice,
							discountRate : discountRate,
							discountRange : discountRange,
							discountDescription : IX.isEmpty(discountDescription) ? '' : (discountDescription + '，'),
							switchLevelUpPoint : switchLevelUpPoint
						});
					};
					switch (k) {
						case 'cardCount':
							text = parseInt(v);
							clz = 'number';
							break;
						case 'levelCardCountRate':
						case 'sexMaleRate':
						case 'sexFemaleRate':
						case 'sexUnknownRate':
						case 'onLineRate':
						case 'inShopRate':
							text = v + '%';
							clz = 'number';
							break;
						case 'moneyBalanceSum':
						case 'pointBalanceSum':
						case 'consumptionPerOrder':
							text = math.prettyNumeric(math.standardPrice(v));
							clz = 'number';
							break;
						default : 
							text = v;
							clz = 'text';
					}
					return {
						clz : clz,
						type : 'text',
						value : v,
						text : text,
						title : k == "cardLevelName" ? mapCardLevelTip(member) : ''
					};
				});
				return cols;
			};
			var rows = _.map(memberData, function (m) {
				return {
					clz : '',
					cols : mapColData(m)
				}
			});
			var tfoot = _.map(summary, function (r) {
				var cols = mapColData(r);
				cols.shift();
				cols.unshift({
					clz : 'title',
					value : '',
					text : '总价：'
				});
				return {
					clz : '',
					cols : cols
				}
			});
			return {
				tblClz : 'table table-bordered table-striped table-hover ix-data-report',
				thead : tableHeader,
				rows : rows,
				tfoot : tfoot
			}
		},
		render : function () {
			var self = this,
				model = self.model;
			var tableRenderData = self.mapTableRenderData();

			var tblTpl = self.get('tableTpl'),
				html = tblTpl(tableRenderData);
			self.$tableBox.html(html);
			self.bindEvent();
			IX.Net.loadJsFiles([Hualala.Global.ECHART_PATH], function () {
				self.emit('loaded');
				_.map(Hualala.CRM.MemberSchemaChartConfigs, function (el) {
					var id = $XP(el, 'id'), $box = $('#' + id);
					$box.css({height : '500px'});
					var oChart = echarts.init($box[0]);
					$box.data('oChart', oChart);
					oChart.showLoading({
						text : "加载中...",
						x : 'center',
						y : 'center',
						effect : 'spin'
					});
				});
				self.renderChart();
			});
			
			
		},
		renderChart : function () {
			var self = this, model = self.model;
			var cfgs = Hualala.CRM.MemberSchemaChartConfigs,
				legendCfg = Hualala.CRM.BaseChartLegend,
				toolboxCfg = Hualala.CRM.BaseChartToolBox,
				tooltipCfg = Hualala.CRM.BaseChartTooltip,
				titleCfg = Hualala.CRM.BaseChartTitle,
				tipTitle = '';
			var chartOptions = _.map(cfgs, function (cfg) {
				var id = $XP(cfg, 'id'), title = $XP(cfg, 'label');
				var opt = {}, levels = null;
					title = IX.inherit(titleCfg, {text : title}),
					series = null, legend = null;
				switch (id) {
					case "member_level_chart":
						tipTitle = "会员等级";
						series = self.model.getLevelChartData();
						levels = _.map(self.model.getMemberByLevelNames(), function (m) {
							return $XP(m, 'cardLevelName', '');
						});
						legend = IX.inherit(legendCfg, {data : levels});
						break;
					case "member_gender_chart":
						tipTitle = "会员性别";
						series = self.model.getGenderChartData();
						legend = IX.inherit(legendCfg, {data : ['男', '女', '未知']});
						break;
					case "member_source_chart":
						tipTitle = "会员来源";
						series = self.model.getSourceChartData();
						legend = IX.inherit(legendCfg, {data : ['线上', '线下']});
						break;
				}
				opt = IX.inherit(opt, {
					title : title,
					tooltip : tooltipCfg,
					toolbox : toolboxCfg,
					legend : legend,
					calculable : false,
					series : [{
						name : tipTitle,
						type : 'pie',
						radius : '55%',
						center : ['50%', '40%'],
						data : series
					}]
				});
				return {
					id : id,
					option : opt
				};
			});
			_.each(chartOptions, function (el) {
				var id = $XP(el, 'id'), opt = $XP(el, 'option', {});
				var $chart = $('#' + id);
				var oChart = $chart.data('oChart');
				oChart.hideLoading();
				oChart.setOption(opt);
			});
		},
		hideLoadingModal : function () {
			this.loadingModal.hide();
		},
		showLoadingModal : function () {
			this.loadingModal.show();
		},
		bindEvent : function () {
			var self = this;
			self.$tableBox.tooltip({
				selector : 'p[title]'
			});
		}
	});
	Hualala.CRM.MemberSchemaView = MemberSchemaView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	
	var MemberSchemaController = Stapes.subclass({
		/**
		 * 构造会员概览页面控制器
		 * @param  {Object} cfg 配置参数
		 *          @param {jQuery Object} container 
		 *          @param {Object} view 概要显示层实例
		 *          @param {Object} model 概要数据层实例
		 * @return {Object}     控制器实例
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.container || !this.view || !this.model ) {
				throw("CRM Schema Controller init faild!!");
			}
			this.isReady = false;
			this.bindEvent();
			this.init();
		}
	});
	MemberSchemaController.proto({
		init : function () {
			this.model.init();
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.isReady = true;
			this.emit('load', {});
		},
		hasReady : function () { return this.isReady; },
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						// self.view.emit('loaded');
					};
					self.view.emit('loading');
					self.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				},
				loaded : function () {
					this.view.hideLoadingModal();
				},
				loading : function () {
					this.view.showLoadingModal();
				}
			}, this);
		}
	});
	Hualala.CRM.MemberSchemaController = MemberSchemaController;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        topTip = Hualala.UI.TopTip;
	Hualala.CRM.initParams = function($crm)
    {
        var $form = null, bv = null, itemID = null,
            $vipServiceTel = null, $vipServiceRemark = null,
            $p1 = null, $p2 = null;
        
        G.getCrmParams({groupID: Hualala.getSessionData().site.groupID}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var crmParams = rsp.data;
            itemID = crmParams.itemID;
            crmParams.serviceStartTime = formatDate(crmParams.serviceStartTime);
            crmParams.serviceEndTime = formatDate(crmParams.serviceEndTime);
            crmParams.pointClearDate = +crmParams.pointClearDate == 0 ? '不清零' : formatDate(crmParams.pointClearDate);
            crmParams.isPointCanPay = crmParams.isPointCanPay == 0 ? 'minus' : 'ok';
            
            $form = $(Handlebars.compile(Hualala.TplLib.get('tpl_crm_params'))(crmParams)).appendTo($crm);
            
            $vipServiceTel = $form.find('input[name=vipServiceTel]');
            $vipServiceRemark = $form.find('textarea[name=vipServiceRemark]');
            $p1 = $vipServiceTel.siblings('p');
            $p2 = $vipServiceRemark.siblings('p');
            
            $form.bootstrapValidator({
                fields: {
                    vipServiceTel: {
                        validators: {
                            notEmpty: { message: '会员服务电话不能为空' },
                            telOrMobile: { message: '' }
                        }
                    }
                }
            });
            bv = $form.data('bootstrapValidator');
        });
        
        
        $crm.on('click', function(e)
        {
            var $target = $(e.target);
            
            if($target.is('.btn-edit, .btn-save')) e.preventDefault();
            
            if($target.is('.btn-edit'))
            {
                $form.removeClass('read-mode').addClass('edit-mode');
            }
            
            if($target.is('.btn-save'))
            {
                if(!bv.validate().isValid()) return;
                
                var vipServiceTel = $vipServiceTel.val(),
                    vipServiceRemark = $vipServiceRemark.val(),
                    data = {
                        itemID: itemID,
                        vipServiceTel: vipServiceTel,
                        vipServiceRemark: vipServiceRemark
                    };
                
                G.setCrmParams(data, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    $p1.text(vipServiceTel);
                    $p2.text(vipServiceRemark);
                    $form.removeClass('edit-mode').addClass('read-mode');
                    topTip({msg: '保存成功！', type: 'success'});
                });
            }
        });
    };
    
    function formatDate(dateStr)
    {
        return dateStr.length == 8 ? dateStr.substr(0, 4) + '年' + parseInt(dateStr.substr(4, 2)) + '月' + parseInt(dateStr.substr(6)) + '日' : parseInt(dateStr.substr(0, 2)) + '月' + parseInt(dateStr.substr(2)) + '日';
    }
})(jQuery, window);












;(function ($, window) {
	IX.ns("Hualala.CRM");
    
	Hualala.CRM.initVipLevels = function($crm)
    {
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
                isVipPrice: { '0': '不享受', '1': '享受' },
                discountRange: { '0': '部分打折', '1': '全部打折' },
                isActive: { '0': '未启用', '1': '已启用' },
                icos: {
                    '0': '<i class="glyphicon glyphicon-minus no"></i>',
                    '1': '<i class="glyphicon glyphicon-ok ok"></i>'
                }
            };
        var Funcs = {
                date: function(v){ return formatDateStr(v.replace(/-/g, ''), 12); },
                number: function(v, key, $td){ $td.addClass('t-r'); return prettyNumeric(v); },
                ico: function(v, key){ return $(Meta.icos[v]).attr('title', Meta[key][v]) },
                discountRate: function(v){ return v == 1 ? '不打折' : (v * 10).toFixed(1) + '折' }
            };
        var keys = {
                cardLevelName: { title: '会员等级名' },
                description: { title: '等级说明' },
                isVipPrice: { title: '是否享受会员价', type: 'ico' },
                discountRate: { title: '折扣率', type: 'discountRate' },
                discountRange: { title: '折扣范围' },
                discountDescription: { title: '折扣描述' },
                pointRate: { title: '积分系数', type: 'number' },
                switchLevelUpPoint: { title: '等级所需累计消费金额', type: 'number' },
                isActive: { title: '是否启用', type: 'ico' },
                actionTime: { title: '最后修改时间', type: 'date' }
            }
            
        var $table = $('<table>').addClass('table table-bordered table-striped table-hover'),
            $headTR = $('<thead><tr></tr></thead>').appendTo($table).find('tr'),
            ths = [];
        for(var key in keys)
            ths.push($('<th>').addClass('t-c').text(keys[key].title));
        $headTR.append(ths);
        $crm.append($table);
        
        function renderTbody(items, keys)
        {
            var trs = [];
            for(var i = 0, item; item = items[i++];)
            {
                var $tr = $('<tr>');
                for(var key in keys)
                {
                    var val = item[key], keyInfo = keys[key], meta = Meta[key],
                        type = keyInfo.type, $cell = $('<td>').addClass('t-c');
                    if(meta && !type) val = meta[val];
                    if(type) val = Funcs[type](val, key, $cell);
                    $cell.html(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $('<tbody>').html(trs).appendTo($table);
        }
        
        G.getVipLevels({isActive: 1}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            renderTbody(rsp.data.records || [], keys);
        });
        
        
    };
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip,
        parseForm = Hualala.Common.parseForm;
        
	Hualala.CRM.initRecharge = function($crm)
    {
        var $alert = $('<div class="alert alert-warning t-c">暂无任何会员充值套餐。</div>'),
            crmRechargeSetsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_sets')),
            editSetTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_add_update')),
            vipLevelTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_vip_level')),
            $table = null, sets = [], levels = null,
            set = null, setId = null, isAdd = null, 
            $editSet = null, modal = null, bv = null;
            
        renderSets();
        $crm.on('click', '.well .btn, td .btn', renderDialog);
        
        function renderSets()
        {
            G.getCrmRechargeSets({}, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                sets = rsp.data.records || [];
                preProcessSets(sets);
                $(crmRechargeSetsTpl({sets: sets})).appendTo($crm.empty());
                $table = $crm.find('table');
                if(!sets.length)
                {
                    $table.addClass('hidden');
                    $crm.append($alert);
                    return;
                }
                createSwitch($crm.find('table input'));
            });
        }
        
        function renderDialog(e)
        {
            var id = $(e.target).data('setid');
            setId = id;
            isAdd = id === undefined;
            set = getSetById(sets, id) || {};
            var dTitle = (isAdd ? '添加' : '修改') + '会员充值套餐',
                levelID = set.switchCardLevelID || 0;
            $editSet = $(editSetTpl(set));
            modal = new U.ModalDialog({
                title: dTitle,
                html: $editSet
            }).show();
            var $select = $editSet.find('select');
            
            if(levels)
                $select.append(vipLevelTpl({levels: levels})).val(levelID);
            else
            {
                G.getVipLevels({}, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    levels = filterVipLevels(rsp.data.records);
                    $select.append(vipLevelTpl({levels: levels})).val(levelID);
                });
            }
            $editSet.bootstrapValidator({
                fields: {
                    setName: {
                        validators: {
                            notEmpty: { message: '套餐名不能为空' }
                        }
                    },
                    setSaveMoney: {
                        validators: {
                            notEmpty: { message: '充值金额不能为空' },
                            numeric: { message: '充值金额必须是金额数字' }
                        }
                    },
                    returnMoney: {
                        validators: {
                            numeric: { message: '返金额数必须是金额数字' }
                        }
                    },
                    returnPoint: {
                        validators: {
                            numeric: { message: '返积分数必须是数字' }
                        }
                    }
                }
            });
            bv = $editSet.data('bootstrapValidator');
            modal._.footer.find('.btn-ok').on('click', submitSet);
        }
        
        function submitSet()
        {
            if(!bv.validate().isValid()) return;
            var data = parseForm($editSet);
            if(!isAdd) data.saveMoneySetID = setId;
            G[isAdd ? 'addCrmRechargeSet' : 'updateCrmRechargeSet'](data, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'});
                renderSets();
                modal.hide();
            });
            
        }
    };
    
    function filterVipLevels(levels)
    {
        var ret = [];
        for(var i = 0, level; level = levels[i]; i++)
            if(+level.isActive) ret.push(level);
        
        return ret;
    }
    
    function getSetById(sets, id)
    {
        for(var i = sets.length - 1, set; set = sets[i--];)
            if(set.saveMoneySetID == id) return set;
    }
    
    function preProcessSets(sets)
    {
        for(var i = sets.length - 1, set; set = sets[i--];)
            set.checked = +set.isActive ? 'checked' : '';
    }
    
    function getSelectText($select)
    {
        return $select.find('option:selected').text();
    }
    
    function createSwitch($checkbox)
    {
        $checkbox.bootstrapSwitch({
            onColor : 'success',
            onText : '已开启',
            offText : '已禁用'
        }).on('switchChange.bootstrapSwitch', function (e, state)
        {
            var $this = $(this), setID = $this.data('setid'),
                stateText = state ? '开启' : '禁用';
            G.switchCrmRechargeSetState({saveMoneySetID: setID, isActive: +state}, function (rs)
            {
                if(rs.resultcode != '000')
                {
                    $this.bootstrapSwitch('toggleState', true);
                    topTip({msg: stateText + '失败' + (rs.resultmsg ? '：' + rs.resultmsg : ''), type: 'danger'});
                    return;
                }
                topTip({msg: stateText + '成功！', type: 'success'})
            });
        });
    }
    
})(jQuery, window);












;(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        C = Hualala.Common,
        M = C.Math,
        CrmTypeDef = Hualala.TypeDef.CRM,
        dF = IX.Date,
        tplLib = Hualala.TplLib,
        parseForm = Hualala.Common.parseForm,
        topTip = Hualala.UI.TopTip;
        
    var staticData = {
        cardStatus: CrmTypeDef.cardStatus,
        customerSex: CrmTypeDef.customerSex,
        sourceWay: CrmTypeDef.sourceWay,
        
        crmQueryTableHeads: ['姓名', '性别', '手机号(卡号)', '生日', '等级', '入会日期', '储值余额', '积分余额', '累计储值总额', '累计消费总额', '状态', '查看'],
        crmQueryTableKeys: ['customerName', 'customerSex', 'customerMobile', 'customerBirthday', 'cardLevelName', 'createTime', 'moneyBalance', 'pointBalance', 'saveMoneyTotal', 'consumptionTotal', 'cardStatus', 'cardID']
    };
    
    var levels = null, pageSize = 15,
        $tbody = null, $pager = $('<div>').addClass('pull-right'),
        vipLevelTpl = Handlebars.compile(tplLib.get('tpl_crm_recharge_set_vip_level'));
    
	Hualala.CRM.initQuery = function($crm)
    {
        var params = {pageNo: 1, pageSize: pageSize}, $form = null;
        
        $(Handlebars.compile(tplLib.get('tpl_crm_query'))(staticData)).appendTo($crm);
        $crm.append($pager);
        
        $crm.find('[data-type=datetimepicker]').datetimepicker({
            format : 'yyyy/mm/dd',
            startDate : '2010/01/01',
            autoclose : true,
            minView : 'month',
            todayBtn : true,
            todayHighlight : true,
            language : 'zh-CN'
        });
        
        $form = $crm.find('form');
        $tbody = $crm.find('tbody');
        $levels = $crm.find('[name=cardLevelID]');
        
        if(levels)
            $levels.append(vipLevelTpl({levels: levels}));
        else
        {
            G.getVipLevels({}, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                levels = filterVipLevels(rsp.data.records);
                $levels.append(vipLevelTpl({levels: levels}));
            });
        }
        
        queryCrm(params);
        
        $crm.find('.well a').on('click', function()
        {
            $crm.find('.more-crm-query').slideToggle();
            this.text = this.text == '收起' ? '更多查询条件' : '收起';
        });
        
        $crm.find('.well .btn').on('click', function()
        {
            var args = parseForm($form);
            args.createTimeStart = formatPostDate(args.createTimeStart);
            args.createTimeEnd = formatPostDate(args.createTimeEnd);
            $.extend(params, args);
            params.pageNo = 1;
            queryCrm(params);
        });
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            queryCrm(params);
        });
    };
    
    function renderCrmQueryTable($tbody, items)
    {
        var trs = [], keys = staticData.crmQueryTableKeys,
            icoOk = '<i class="glyphicon glyphicon-ok ok" title="手机号已绑定"></i>',
            createPath = Hualala.PageRoute.createPath;
        for(var i = 0, item; item = items[i++];)
        {
            var $tr = $('<tr>');
            for(var j = 0, key; key = keys[j++];)
            {
                var $td = $('<td>'), val = item[key] || '';
                
                if(key == 'customerMobile' && item.cardNO)
                {
                    val += '(卡号)';
                    $td.attr('title', '卡号：' + item.cardNO).attr('data-toggle', 'tooltip')
                    .tooltip({ trigger: 'click | hover', container: 'body' })
                }
                
                if(/customerSex|cardStatus/.test(key))
                    val = staticData[key][val];
                else if(/saveMoneyTotal|moneyBalance|giveBalance|consumptionTotal|pointBalance/.test(key))
                    val = M.prettyNumeric(val);
                else if(/createTime|customerBirthday/.test(key))
                    val = C.formatDateStr(val.replace(/-/g, ''));
                else if(key == 'customerMobile' && +item.isMobileChecked)
                    val += icoOk;
                else if(key == 'cardID')
                    val = $('<a>查看</a>').attr('href', createPath('crmMemberDetail', [val]));
                
                $td.html(val).appendTo($tr);
            }
            trs.push($tr);
        }
        $tbody.empty().append(trs);
    }
    
    function queryCrm(params, cbFn)
    {
        G.queryCrm(params, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var records = rsp.data.records || [],
                page = rsp.data.page;
            renderCrmQueryTable($tbody, records);
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        });
    }
    
    function formatPostDate(str)
    {
        return /\d{4}\/\d{2}\/\d{2}/.test(str) ? str.split('/').join('') : '';
    }
    
    function filterVipLevels(levels)
    {
        var ret = [];
        for(var i = 0, level; level = levels[i]; i++)
            if(+level.isActive) ret.push(level);
        
        return ret;
    }
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
    
	Hualala.CRM.initDetail = function($container, cardID)
    {
        if(!cardID) return;
        
        $container.addClass('crm-detail');
        
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            tplLib = Hualala.TplLib,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
            basicInfo: [
                {customerName: '姓名', customerSex: '性别', customerBirthday: '生日', createTime: '入会时间', createShopName: '入会店铺'},
                {customerMobile: '手机号', cardNO: '卡号', cardLevelName: '等级' , moneyBalance: '现金储值余额', giveBalance: '赠送储值余额', pointBalance: '积分余额'},
                {saveMoneyTotal: '储值累计', pointGetTotal: '积分累计', consumptionTotal: '消费累计', consumptionCount: '消费次数', lastConsumptionTime: '最后消费时间'}
            ],
            customerSex: CrmTypeDef.customerSex,
            transDetail: {
                transTime: '交易时间', transShopName: '交易店铺', transType: '交易类型', consumptionAmount: '消费金额', moneyChange: '储值余额变动', pointChange:'积分余额变动', transAfterMoneyBalanceSum: '交易后储值余额', transAfterPointBalance: '交易后积分余额', transRemark: '交易备注'
            },
            transType: CrmTypeDef.transType,
            event: {
                cardLevelName: '等级', eventName: '活动主题', eventWay: '活动类型', createTime: '参与时间',
                //eventNews ~= Meta.eventNews[eventWay][winFlag]
                eventNews: '活动动态'
            },
            eventWay: CrmTypeDef.eventWay,
            gift: {
                giftName: '名称', createTime: '获得时间', getWay: '获得方式', giftStatus: '状态', usingShopName: '使用店铺', usingTime: '使用时间', validUntilDate: '使用截止日期'
            },
            getWay: CrmTypeDef.getWay,
            giftStatus: CrmTypeDef.giftStatus,
            cardLog: {
                createTime: '时间', shopName: '店铺', logType: '类型', operator: '经办人', remark: '备注'
            },
            logType: CrmTypeDef.logType
        };
        
        var imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
            defaultAvatar = G.IMAGE_ROOT + '/dino80.png';
        
        var params = {cardID: cardID},
            $tpl = $(tplLib.get('tpl_crm_detail')).appendTo($container),
            $basicInfo = $tpl.filter('.basic-info'),
            $trans = $tpl.find('#transDetail'),
            $events = $tpl.find('#activities'),
            $gifts = $tpl.find('#vouchers'),
            $logs = $tpl.find('#cardLog');
        
        $tpl.find('.tab-pane').addClass('table-responsive');
        getData(params, 'getCrmDetail', renderCrmDetail);
        getData(params, 'getCrmTransDetail', renderCrmTransDetail);
        getData(params, 'getCrmUserEvents', renderCrmUserEvents);
        getData(params, 'getCrmUserGifts', renderCrmUserGifts);
        getData(params, 'getCrmCardLogs', renderCrmCardLogs);
        
        function renderCrmDetail(data)
        {
            $('<img alt="会员头像" width="100" height="100">').attr('src', data.photoImage ? imgHost + data.photoImage : defaultAvatar).appendTo($basicInfo);
            
            var $div = $('<div>'),
                icoOk = '<i class="glyphicon glyphicon-ok ok" title="已验证"></i>';
            for(var i = 0, item; item = Meta.basicInfo[i++];)
            {
                var $ul = $('<ul>');
                for(var key in item)
                {
                    var val = data[key] || '';
                    if(val)
                    {
                        if(/createTime|customerBirthday|lastConsumptionTime/.test(key))
                            val = formatDateStr(val.replace(/-/g, ''), 12);
                        else if(/moneyBalance|shopChargeGiftSum|pointBalance|saveMoneyTotal|pointGetTotal|consumptionTotal/.test(key)) 
                            val = prettyNumeric(val);
                        else if(key == 'customerMobile' && +data.isMobileChecked)
                            val += icoOk;
                        else if(key == 'customerSex') 
                            val = Meta[key][val];
                        
                        $ul.append($('<li>').append($('<label>').text(item[key])).append($('<span>').html(val)));
                    }
                }
                $div.append($ul);
            }
            $basicInfo.append($div);
        }
        
        function renderCrmTransDetail(records)
        {
            var $theadTR = $trans.find('thead tr'), ths = [],
                $tbody = $trans.find('tbody'), trs = [],
                transDetail = Meta.transDetail, transType = Meta.transType;
                
            for(var key in transDetail)
                ths.push($('<th>').text(transDetail[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in transDetail)
                {
                    var val = item[key] || '';
                    if(key == 'transTime') 
                        val = formatDateStr(val, 12);
                    else if(/consumptionAmount|moneyChange|transAfterMoneyBalanceSum/.test(key))
                        val = prettyNumeric(val);
                    else if(key == 'transType')
                        val = transType[val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function renderCrmUserEvents(records)
        {
            var $theadTR = $events.find('thead tr'), ths = [],
                $tbody = $events.find('tbody'), trs = [],
                event = Meta.event, eventWay = Meta.eventWay;
                
            for(var key in event)
                ths.push($('<th>').text(event[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in event)
                {
                    var val = item[key];
                    if(key == 'createTime') 
                        val = formatDateStr(val, 12);
                    else if(key == 'eventNews')
                        val = getEventNews(item.eventWay, item.winFlag);
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function getEventNews(way, flag)
        {
            var ret = '已兑换';
            if(way == 20) ret = flag == 1 ? '一等奖' : flag == 2 ? '二等奖' : '三等奖';
            else if(way == 21) ret = '已领取';
            else if(ret == 22) ret = flag == 1 ? '已入围' : '未入围';
            
            return ret;
        }
        
        function renderCrmUserGifts(records)
        {
            var $theadTR = $gifts.find('thead tr'), ths = [],
                $tbody = $gifts.find('tbody'), trs = [],
                gift = Meta.gift;
                
            for(var key in gift)
                ths.push($('<th>').text(gift[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in gift)
                {
                    var val = item[key];
                    if(/createTime|usingTime|validUntilDate/.test(key)) 
                        val = formatDateStr(val, 12);
                    else if(/getWay|giftStatus/.test(key))
                        val = Meta[key][val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function renderCrmCardLogs(records)
        {
            var $theadTR = $logs.find('thead tr'), ths = [],
                $tbody = $logs.find('tbody'), trs = [],
                cardLog = Meta.cardLog, logType = Meta.logType;
                
            for(var key in cardLog)
                ths.push($('<th>').text(cardLog[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in cardLog)
                {
                    var val = item[key];
                    if(key == 'createTime') 
                        val = formatDateStr(val, 12);
                    else if(key == 'logType')
                        val = logType[val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function getData(params, callServer, cbFn)
        {
            G[callServer](params, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                var data = callServer == 'getCrmDetail' ? rsp.data : rsp.data.records || [];
                cbFn(data);
            });
        }
    };
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
    
	Hualala.CRM.initPreferential = function($crm)
    {
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            parseForm = C.parseForm,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
            pref: {
                shopName: '店铺名称', startDate: '开始日期', endDate: '结束日期', discountType: '折扣促销方式', discountRate: '促销折扣率', pointType: '积分促销方式', pointRate: '促销积分系数', actionTime: '修改时间', isActive: '是否启用', action: '操作'
            },
            discountType: { '0': '会员保底折扣率', '1': '折上折' },
            pointType: { '0': '倍数', '1': '叠加' },
            isActive: { '0': '未启用', '1': '已启用' },
            stateIco: {
                '0': '<i class="glyphicon glyphicon-minus no"></i>',
                '1': '<i class="glyphicon glyphicon-ok ok"></i>'
            }
        };
        
        var getParams = {pageNo: 1, pageSize: 15},
            $crmPref = $(tplLib.get('tpl_crm_pref')),
            $table = $crmPref.filter('table'),
            $headTR = $table.find('thead tr'),
            $tbody = $table.find('tbody'),
            $pager = $('<div>').addClass('pull-right');
            
        var prefs = null; pref = Meta.pref, stateIco = Meta.stateIco, ths = [];
        
        for(var key in pref)
            ths.push($('<th>').text(pref[key]));
        $headTR.append(ths);
        
        $crm.append($crmPref);
        $crm.append($pager);
        U.createSchemaChosen($('[name=shopID]'), $('[name=cityID]'));
        
        getCrmPreferential(getParams);
        
        $queryForm = $crmPref.find('form');
        $crmPref.on('click', '.btn', function()
        {
            getParams.pageNo = 1;
            $.extend(getParams, parseForm($queryForm));
            getCrmPreferential(getParams);
            return false;
        });
        
        var tplForm = Handlebars.compile(tplLib.get('tpl_crm_pref_update')),
            cpref = null, $ctr = null,
            modal = null, $form = null, bv = null;
        $table.on('click', 'a', function(e)
        {
            var $this = $(this), id = $(this).data('itemid');
            cpref = findPref(id) || {};
            var fpref = $.extend({}, cpref);
            fpref.startDate = formatDateStr(fpref.startDate);
            fpref.endDate = formatDateStr(fpref.endDate);
            $ctr = $this.parent().parent();
            $form = $(tplForm(fpref));
            $form.find('[name=discountType]').eq(+fpref.discountType).prop('checked', true);
            $form.find('[name=pointType]').eq(+fpref.pointType).prop('checked', true);
            $form.find('[name=isActive]').val(fpref.isActive);
            $form.find('[name=startDate],[name=endDate]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/01/01',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
            });
            modal = new U.ModalDialog({title: '会员促销参数设置', html: $form}).show();
            
            $form.bootstrapValidator({
                fields: {
                    startDate: {
                        validators: {
                            date: {
                                format: 'YYYY/MM/DD',
                                message: '开始日期格式不正确'
                            }
                        }
                    },
                    endDate: {
                        validators: {
                            date: {
                                format: 'YYYY/MM/DD',
                                message: '结束日期格式不正确'
                            }
                        }
                    },
                    discountRate: {
                        validators: {
                            notEmpty: { message: '促销折扣率不能为空' },
                            greaterThan: {
                                message: '促销折扣率大于0且小于或等于1',
                                inclusive: false,
                                value: 0
                            },
                            lessThan: {
                                message: '促销折扣率必须大于0且小于或等于1',
                                inclusive: true,
                                value: 1
                            }
                        }
                    },
                    pointRate: {
                        validators: {
                            notEmpty: { message: '促销积分系数不能为空' },
                            greaterThan: {
                                message: '促销积分系数必须大于或等于1',
                                inclusive: true,
                                value: 1
                            }
                        }
                    }
                }
            });
            bv = $form.data('bootstrapValidator');
            modal._.footer.find('.btn-ok').on('click', submitPref);
        });
        
        function submitPref()
        {
            if(!bv.validate().isValid()) return;
            var data = parseForm($form);
            data.startDate = (data.startDate || '0').replace(/\//g, '');
            data.endDate = (data.endDate || '0').replace(/\//g, '');
            data.itemID = cpref.itemID;
            G.updateCrmPreferential(data, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '修改成功！', type: 'success'});
                $ctr.replaceWith(createPrefTR($.extend(cpref, data)));
                modal.hide();
            });
            
        }
        
        function findPref(id)
        {
            return prefs[C.inArray(prefs, {itemID: id}, 'itemID')];
        }
            
        $pager.on('page', function(e, pageNo)
        {
            getParams.pageNo = pageNo;
            getCrmPreferential(getParams);
        });
        
        function renderCrmPreferential(records)
        {
            var trs = [];
            for(var i = 0, item; item = records[i++];)
                trs.push(createPrefTR(item));
            $tbody.html(trs);
        }
        
        function createPrefTR(item)
        {
            var $tr = $('<tr>');
            for(var key in pref)
            {
                var val = item[key];
                if(/startDate|endDate|actionTime/.test(key)) 
                {
                    val = formatDateStr(val, 12);
                    if(/startDate|endDate/.test(key) && !val)
                        val = '不限';
                }
                else if(key == 'action')
                    val = $('<a href="javascript:;">修改</a>').data('itemid', item.itemID);
                else if(/discountType|pointType/.test(key))
                    val = Meta[key][val];
                else if(key == 'isActive')
                    val = $(stateIco[val]).attr('title', Meta[key][val]);
                
                $('<td>').html(val).appendTo($tr);
            }
            return $tr;
        }
        
        function getCrmPreferential(getParams)
        {
            G.getCrmPreferential(getParams, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                var records = rsp.data.records || [],
                    page = rsp.data.page;
                prefs = records;
                renderCrmPreferential(records);
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            });
        }
    };
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
    
    var G = Hualala.Global,
        C = Hualala.Common,
        CrmTypeDef = Hualala.TypeDef.CRM,
        formatDateStr = C.formatDateStr,
        prettyNumeric = C.Math.prettyNumeric,
        parseForm = C.parseForm,
        tplLib = Hualala.TplLib,
        U = Hualala.UI,
        topTip = Hualala.UI.TopTip;
    
    var sumWay = { '1': '线上合计', '0': '线下合计', '-1': '总计' };
    var sumSets = {
            TransSum: 'summerizingGroupByTransWayDs',
            TransDetail: 'detailGroupByTransWayDs',
            CardSum: 'cardCreateSumarizeGroupByTransWayDs',
            RechargeSum: 'summerizingGroupByTransWayDs'
        };
    var Funcs = {
        date: function(v){ return formatDateStr(v.replace(/-/g, ''), 12); },
        number: function(v, item, keyInfo, $td){ $td.addClass('t-r'); return prettyNumeric(v); },
        mobile: function(v, item, keyInfo, $td)
        {
            if(item.cardNO)
            {
                v += '(卡号)';
                $td.attr('title', '卡号：' + item.cardNO).attr('data-toggle', 'tooltip')
                .tooltip({ trigger: 'click | hover', container: 'body' });
            }
            
            return v; 
        },
        transType: function(v, item) { return CrmTypeDef.transType[v]; },
        viewDetail: function(v, item) { return $('<a href="javascript:;">详情</a>').data('transid', item.transID) },
        sum: function(v, item, keyInfo) { return sumWay[item[keyInfo['sumWay']]] + (keyInfo.count ? ('(共' + v + '笔)') : '') },
        shopName: function(v, item, keyInfo ,c, i) { return (keyInfo.count ? i + '. ' : '') + (+item[keyInfo['shopID']] ? v : '网上储值') }
    };
    
    var keys, fkeys, module, params, transRecords,
        today = IX.Date.getDateByFormat(IX.Date.formatDate(new Date), 'yyyy/MM/dd'),
        tplWell = Handlebars.compile(tplLib.get('tpl_crm_query_panel'))({today: today}),
        tplTable = tplLib.get('tpl_report_table'),
        $mbody, $well, $form, $thead, $tbody, $pager;
    
    function renderThead($thead, keys)
    {
        var $tr = $('<tr>');
        for(var key in keys)
        {
            var keyInfo = keys[key], title = keyInfo.title, $th = $('<th>');
            if(keyInfo.newRow)
            {
                $thead.append($tr);
                $tr = $('<tr>');
            }
            if(keyInfo.rowspan) $th.attr('rowspan', keyInfo.rowspan);
            if(keyInfo.colspan) $th.attr('colspan', keyInfo.colspan);
            if(keyInfo.sort)
            {
                title = '<span></span>' + title;
                $th.addClass('sort').data('key', key);
            }
            
            $tr.append($th.html(title));
        }
        $thead.append($tr);
    }
    
    function renderData($container, items, keys)
    {
        var trs = [];
        for(var i = 0, item; item = items[i++];)
        {
            var $tr = $('<tr>');
            for(var key in keys)
            {
                var val = item[key] || '', keyInfo = keys[key], 
                    type = keyInfo.type, $cell = $(type == 'sum' ? '<th>' : '<td>');
                if(keyInfo.ignore) continue;
                if(type) val = Funcs[type](val, item, keyInfo, $cell, i);
                if(keyInfo.colspan) $cell.attr('colspan', keyInfo.colspan);
                $cell.html(val).appendTo($tr);
            }
            trs.push($tr);
        }
        $container.html(trs);
    }
    
    function getData(module, params)
    {
        if(module != 'CardSum')
        {
            params.queryStartTime = params.queryStartTime.replace(/\//g, '');
            params.queryEndTime = params.queryEndTime.replace(/\//g, '');
        }
        G['getCrm' + module](params, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var records = rsp.data.records || [],
                sumRecords = rsp.data.datasets[sumSets[module]].data.records || [],
                page = rsp.data.page;
            renderData($tbody, records, keys);
            renderData($tfoot, sumRecords, fkeys);
            if(module == 'TransDetail') transRecords = records;
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        });
    }
    
	function initModule(module, $mbody)
    {
        module = module;
        $mbody = $mbody.addClass(module);
        params = {pageNo: 1, pageSize: 15};
        
        if(module != 'TransDetail')
        {
            fkeys = $.extend({}, keys);
            for(var k in fkeys)
            {
                fkeys[k] = { sumWay: 'transWay', type: 'sum' };
                if(module == 'CardSum') fkeys[k].sumWay = 'sourceWay';
                break;
            }
        }
        
        if(module != 'CardSum')
        {
            params = {pageNo: 1, pageSize: 15, queryStartTime: today, queryEndTime: today};
            $well = $(tplWell).appendTo($mbody);
            $form = $well.find('form');
            U.createSchemaChosen($('[name=transShopID]'), $('[name=cityID]'));
            $form.find('[name=queryStartTime], [name=queryEndTime]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/10/10',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
            });
            
            $well.on('click', '.btn', function()
            {
                params.pageNo = 1;
                $.extend(params, parseForm($form));
                getData(module, params);
            });
        }
        
        var $table = $(tplTable).appendTo($mbody);
        $thead = $table.find('thead');
        $tbody = $table.find('tbody');
        $tfoot = $table.find('tfoot');
        $pager = $('<div>').addClass('pull-right').appendTo($mbody);
        
        renderThead($thead, keys);
        var $sort = $thead.find('.sort');
        $thead.on('click', '.sort', function()
        {
            var $this = $(this), sortClass = '';
            $sort.not(this).removeClass('asc desc');
            if($this.hasClass('asc'))
                $this.removeClass('asc').addClass(sortClass = 'desc');
            else if($this.hasClass('desc'))
                $this.removeClass('desc').addClass(sortClass = '');
            else
                $this.addClass(sortClass = 'asc');
            params.orderBy = sortClass ? $this.data('key') + ' ' + sortClass : '';
            getData(module, params);
        });
        
        getData(module, params);
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getData(module, params);
        });
    }
    
    Hualala.CRM.initTransSum = function($mbody)
    {
        keys = {
            transShopName: { title: '店铺', type: 'shopName', shopID: 'transShopID', count: 1, rowspan: 2 },
            
            shopCharge: { title: '储值业务', ignore: 1, colspan: 4 },
            shopConsumption: { title: '消费业务', ignore: 1, colspan: 5 },
            //储值业务
            shopChargeCount: { title: '笔数', type: 'number', sort: 1, newRow: 1 },
            shopChargeSum: { title: '现金金额', type: 'number', sort: 1 },
            shopChargeGiftSum: { title: '赠送金额', type: 'number', sort: 1 },
            shopChargeReturnPointSum: { title: '返积分数', type: 'number', sort: 1 },
            //消费业务
            shopConsumptionCount: { title: '笔数', type: 'number', sort: 1 },
            shopconsumptionAmountSum: { title: '消费金额', type: 'number', sort: 1 },
            shopMinusMoneySum: { title: '余额支付', type: 'number', sort: 1 },
            shopConsumeDeductPointSum: { title: '积分抵扣', type: 'number', sort: 1 },
            shopConsumptionReturnPointSum: { title: '返积分', type: 'number', sort: 1 }
        };
        initModule('TransSum', $mbody);
    }
    
    Hualala.CRM.initTransDetail = function($mbody)
    {
        keys = {
            transTime: { title: '交易时间', type: 'date', sort: 1 },
            transShopName: { title: '交易店铺', type: 'shopName', shopID: 'transShopID' },
            customerName: { title: '会员姓名' },
            customerMobile: { title: '手机号(卡号)', type: 'mobile' },
            transType: { title: '交易类型', type: 'transType' },
            consumptionAmount: { title: '消费金额', type: 'number', sort: 1 },
            moneyChange: { title: '储值余额变动', type: 'number', sort: 1 },
            pointChange: { title: '积分余额变动', type: 'number', sort: 1 },
            transRemark: { title: '交易备注' },
            action: { title: '操作', type: 'viewDetail' }
        };
        
        fkeys = {
            transCount: { sumWay: 'transWay', type: 'sum', count: 1, colspan: 5 },
            shopconsumptionAmountSum: { type: 'number' },
            moneyChangeSum: { type: 'number' },
            pointChangeSum: { type: 'number' },
            empty: { colspan: 3 }
        };
        
        initModule('TransDetail', $mbody);
        
        $form.prepend('<span>关键字<input type="text" name="keyword" placeholder="手机号/卡号" class="form-control"></span>');
        U.fillSelect($('<span>类型<select name="transType" class="form-control"></span>').appendTo($form).find('select'), CrmTypeDef.transType).prepend('<option value="">不限</option>').val('');
        
        $tbody.on('click', 'a', function()
        {
            var transReceiptsTxt = transRecords[C.inArray(transRecords, {transID: $(this).data('transid')}, 'transID')].transReceiptsTxt.replace(/\n/g, '<br>'),
                modal = new U.ModalDialog({clz: 'modal-trans-detail', title: '会员交易账单详情', html: transReceiptsTxt}).show();
            modal._.footer.find('.btn-close').remove();
            modal._.footer.find('.btn-ok').text('确定').attr('data-dismiss', 'modal');
        });
    }
    
    Hualala.CRM.initCardSum = function($mbody)
    {
        keys = {
            createShopName: { title: '店铺', type: 'shopName', shopID: 'createShopID' }
        };
        var curMonth = (new Date().getMonth()) + 1;
        for(var i = 5; i > 0; i--)
        {
            var month = curMonth - i;
            month = month < 1 ? month + 12 : month;
            keys['sub' + i + 'MonthCardCount'] = { title: month + '月新增', type: 'number', sort: 1 };
        }
        keys.curMonthCardCount = { title: '本月新增', type: 'number', sort: 1 };
        keys.cardCount = { title: '当前会员总数', type: 'number', sort: 1 };
        keys.useableCardCount = { title: '有效会员总数', type: 'number', sort: 1 };
        
        initModule('CardSum', $mbody);
    }
    
    Hualala.CRM.initRechargeSum = function($mbody)
    {
        keys = {
            transShopName: { title: '店铺', type: 'shopName', shopID: 'transShopID', rowspan: '2' },
            saveMoneyCount: { title: '笔数', type: 'number', rowspan: '2'  },
            saveMoneyAmountSum: { title: '现金储值金额', type: 'number', rowspan: '2' },
            saveReturnMoneyAmountSum: { title: '赠送储值金额', type: 'number', rowspan: '2' },
            rechargeWay: { title: '收款方式', ignore: 1, colspan: 5 },
            saveMoneyCashSum: { title: '现金', type: 'number', newRow: 1 },
            saveMoneyCardSum: { title: '银行卡', type: 'number' },
            saveMoneyCheckSum: { title: '支票', type: 'number' },
            saveMoneyOtherSum: { title: '其他', type: 'number' },
            saveMoneyOnlineChargeSum: { title: '哗啦啦付款', type: 'number' }
        };
        initModule('RechargeSum', $mbody);
    }
    
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.CRM");
	/*会员管理模块子页面整体页面布局*/
	function initCRMPageLayout (subNavCfg) {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.empty();
		$body.html('<div class="crm-subnav clearfix" /><div class="crm-body" ><div class="crm-query-box"></div><div class="crm-result-box"></div></div>');
		var mapNavRenderData = function () {
			var navs = _.map(subNavCfg, function (v) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					return '';
				});
				return {
					active : $XP(ctx, 'name') == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name || '',
					label : v.label || ''
				};
			});
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var $navbar = $body.find('.crm-subnav'),
			$pageBody = $body.find('.crm-body').addClass('table-responsive');
		$navbar.html(navTpl(mapNavRenderData()));
	};

	/*CRM首页*/
	function initCRMHomePage () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		// Note: 暂时屏蔽概览页面，第二版将开启
		var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
		var pageCfg = _.find(Hualala.TypeDef.CRMMemberSubNavType, function (el) {return el.name == 'crmMemberSchema'}),
			pkeys = $XP(pageCfg, 'pkeys', []);
		pkeys = _.map(pkeys, function (v) {
			if (v == 'startDate' || v == 'endDate') {
				return curDateStamp;
			}
			return '';
		});
		document.location.href = Hualala.PageRoute.createPath('crmMemberSchema', pkeys);
	};

	/*会员概览页面*/
	function initMemberSchema () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		// $pageBody.html('<h1>会员概览页面</h1>');
		var controller = new Hualala.CRM.MemberSchemaController({
			container : $pageBody,
			view : new Hualala.CRM.MemberSchemaView(),
			model : new Hualala.CRM.MemberSchemaModel()
		});
	};

	/*会员查询页面*/
	function initQueryMember () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>会员查询页面</h1>');
        Hualala.CRM.initQuery($pageBody);
	};

	/*会员详情*/
	function initMemberDetail () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        Hualala.CRM.initDetail($body, ctx.params[0]);
	};



	/*会员办卡统计*/
	function initCardStatistic () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>会员办卡统计</h1>');
        Hualala.CRM.initCardSum($pageBody);
	};

	/*交易汇总*/
	function initDealSummary () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
        queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>交易汇总</h1>');
        Hualala.CRM.initTransSum($pageBody);
	};

	/*交易详情*/
	function initDealDetail () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>交易详情</h1>');
        Hualala.CRM.initTransDetail($pageBody);
	};

	/*充值对账*/
	function initRechargeReconciliation () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>充值对账</h1>');
        Hualala.CRM.initRechargeSum($pageBody);
	};

	/*会员系统参数设置*/
	function initCRMSettingsParams () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>会员系统参数设置</h1>');
        Hualala.CRM.initParams($pageBody);
	};
    
    /*会员等级*/
	function initCRMSettingsLevels () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>会员系等级</h1>');
        Hualala.CRM.initVipLevels($pageBody);
	};

	/*充值套餐*/
	function initRechargePackageBusiness () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>充值套餐</h1>');
        Hualala.CRM.initRecharge($pageBody);
	};

	/*店铺特惠*/
	function initShopSpecialPrice () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
        Hualala.CRM.initPreferential($pageBody);
	};

	Hualala.CRM.CRMPageLayoutInit = initCRMPageLayout;
	Hualala.CRM.CRMHomePageInit = initCRMHomePage;
	Hualala.CRM.MemberSchemaInit = initMemberSchema;
	Hualala.CRM.QueryMemberInit = initQueryMember;
	Hualala.CRM.MemberDetailInit = initMemberDetail;
	Hualala.CRM.CardStatisticInit = initCardStatistic;
	Hualala.CRM.DealSummaryInit = initDealSummary;
	Hualala.CRM.DealDetailInit = initDealDetail;
	Hualala.CRM.RechargeReconciliationInit = initRechargeReconciliation;
	Hualala.CRM.CRMSettingsParamsInit = initCRMSettingsParams;
    Hualala.CRM.CRMSettingsLevelsInit = initCRMSettingsLevels;
	Hualala.CRM.RechargePackageBusinessInit = initRechargePackageBusiness;
	Hualala.CRM.ShopSpecialPriceInit = initShopSpecialPrice;

})(jQuery, window);
;(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initReply = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            parseForm = C.parseForm,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        if(!mpID) return;
        
        var $queryReply = $(tplLib.get('tpl_wx_reply_query')).appendTo($pageBody),
            $queryForm = $queryReply.find('form'),
            $tbody = $queryReply.find('tbody'),
            $pager = $('<div>').addClass('pull-right').appendTo($pageBody),
            emptyAlert = U.EmptyPlaceholder({msg: '无相关结果!', container: $pageBody}),
            tplTr = Handlebars.compile(tplLib.get('tpl_wx_reply_query_item')),
            tplReplyForm = Handlebars.compile(tplLib.get('tpl_wx_reply_add_update'));
            
        var queryParams = { mpID: mpID, pageNo: 1, pageSize: 15 },
            replies, resources = [];
        
        getReplies();
        
        $queryReply.on('click', '.btn-warning', function()
        {
            $.extend(queryParams, parseForm($queryForm));
            queryParams.pageNo = 1;
            getReplies();
        });
        
        $pager.on('page', function(e, pageNo)
        {
            queryParams.pageNo = pageNo;
            getReplies();
        });
        
        $tbody.on('click', '.delete-reply', function()
        {
            var itemID = $(this).data('itemid');
            U.Confirm({msg: '确定删除？', okFn: function(){ deleteReply(itemID) }});
        });
        
        function deleteReply(itemID)
        {
            G.deleteWeixinAutoReplyRole({itemID: itemID}, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '删除成功！', type: 'success'});
                replies.splice(findReply(itemID, true), 1);
                if(replies.length) renderReplies();
                else getReplies();
                
            });
        }
        
        $queryReply.on('click', '.update-reply, .btn-success', function()
        {
            var itemID = $(this).data('itemid'),
                reply = itemID ? findReply(itemID) : {},
                $replyForm = $(tplReplyForm(reply)),
                $select = $replyForm.find('select'),
                $resView = $replyForm.find('.form-control-static');
                
            $replyForm.find('[name=pushContentType]').eq(reply.pushContentType || 0).prop('checked', true);
            
            W.createResourceChosen($select, $resView, resources, reply.resourceID || '')
            .done(function(res)
            {
                resources = res;
                var modal = new U.ModalDialog({
                        title: (itemID ? '修改' : '添加') + '微信自动回复规则', 
                        html: $replyForm
                    }).show();
                
                modal._.footer.find('.btn-ok').on('click', function()
                {
                    submitReply(itemID, reply, $replyForm, $select, modal);
                });
            });
        });
        
        function submitReply(itemID, reply, $replyForm, $select, modal)
        {
            var resourceID = $select.val(),
                res = _.findWhere(resources, {itemID: resourceID});
            $.extend(reply, parseForm($replyForm));
            reply.replyContent = res.resTitle;
            reply.mpID = mpID;
            reply.itemID = reply.itemID || '';
            reply.pushMsgType = 'text';
            reply.replyMsgType = res.resType == '2' ? 'text' : 'news';
            reply.resourceVaule = 1;
            
            var pReply = _.pick(reply, 'itemID', 'mpID', 'pushContentType', 'replyContent', 'resourceID', 'resourceVaule', 'replyMsgType', 'pushMsgType', 'pushContent');
            
            G[itemID ? 'updateWeixinAutoReplyRole' : 'addWeixinAutoReplyRole'](pReply, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                /*reply.pushMsg = reply.pushContentType == 0 ?
                '消息为“<b>' + reply.pushContent + '</b>”' :
                '消息中含“<b>' + reply.pushContent + '</b>”';*/
                topTip({msg: (itemID ? '修改' : '添加') + '成功！', type: 'success'});
                queryParams = { mpID: mpID, pageNo: 1, pageSize: 15 };
                getReplies();
                modal.hide();
            });
        }
        
        function getReplies()
        {
            G.getWeixinAutoReplyList(queryParams, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                var records = rsp.data.records || [],
                    page = rsp.data.page;
                replies = records;
                _.each(replies, function(reply)
                {
                    reply.pushMsg = reply.pushContentType == 0 ?
                    '消息为“<b>' + reply.pushContent + '</b>”' :
                    '消息中含“<b>' + reply.pushContent + '</b>”';
                });
                renderReplies();
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            });
        }
        
        function renderReplies()
        {
            emptyAlert[replies.length ? 'hide' : 'show']();
            var trs = [];
            for(var i = 0, reply; reply = replies[i++];)
                trs.push(tplTr(reply));
            
            $tbody.html(trs.join(''));
        }
        
        function findReply(itemID, flag)
        {
            for(var i = 0, reply; reply = replies[i++];)
                if(reply.itemID == itemID) return flag ? i - 1 : reply;
                
            return flag ? -1 : null;
        }
        
    }
    
    
})(jQuery, window);











;(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initSubscribe = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        if(!mpID) return;
        
        var $subscribe = $(tplLib.get('tpl_wx_subscribe')).appendTo($pageBody),
            $select = $subscribe.find('select'),
            $resView = $subscribe.find('.form-control-static'),
            $save = $subscribe.find('#saveBtn');
            
        var subscribe = { mpID: mpID, pushMsgType: 'event', pushEvent: 'subscribe' },
            resources = [];
        
        G.getWeixinSubscribe({mpID: mpID, pushEvent: '(\"subscribe\")'}, function(rsp)
        {
            $save.prop('disabled', false);
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var records = rsp.data.records || [],
                subsc = records[0];
            subscribe = subsc || subscribe;
            W.createResourceChosen($select, $resView, resources, subscribe.resourceID)
            .done(function(res){ resources = res; });
        });
        
        $save.on('click', function()
        {
            var resourceID = $select.val(),
                res = _.findWhere(resources, {itemID: resourceID});
            subscribe.resourceID = resourceID;
            subscribe.resourceVaule = 1;
            subscribe.replyContent = res.resTitle;
            subscribe.replyMsgType = res.resType == '2' ? 'text' : 'news';
            
            G[subscribe.itemID ? 'updateWeixinSubscribe' : 'addWeixinSubscribe'](subscribe, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '保存成功！', type: 'success'});
                if(!subscribe.itemID)
                    subscribe.itemID = rsp.data.records[0].itemID;
            });
        });
        
    }
    
    
})(jQuery, window);











;(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initMenu = function($pageBody, mpID)
    {
        if(!mpID) return;
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            U = Hualala.UI,
            tplLib = Hualala.TplLib,
            loadData = C.loadData,
            topTip = U.TopTip;
        
        var $pageCont = $(tplLib.get('tpl_wx_menu')).appendTo($pageBody),
            $buttons = $pageBody.find('#menuPanel button')
            $menuWrap = $pageBody.find('#menuWrap'),
            dt = Handlebars.compile('<dt id="{{id}}"><i class="caret"></i><b>{{name}}</b></dt>'),
            dd = Handlebars.compile('<dd id="{{id}}"><b>{{name}}</b></dd>'),
            editMenuTpl = Handlebars.compile(tplLib.get('tpl_wx_menu_edit')),
            $menuClick = $(tplLib.get('tpl_wx_menu_ops')),
            $menuHover = $menuClick.clone(),
            $noMenuTip = $pageBody.find('#noMenuTip'),
            $actions = $pageBody.find('#actionPanel > div'),
            $showTip = $pageBody.find('#showTip'),
            
            resSelect = '<select class="link-select"></select>',
            $resWrap = $actions.find('.res-wrap'),
            $resView = $actions.find('.res-preview'),
            
            $selectWrap = $actions.find('.link-select-wrap'),
            $contentWrap = $actions.find('.link-content-wrap'),
            
            $save = $pageBody.find('#saveBtn');
            
        var menus = [], selectedMenu = null,
            resources = [], dataHolder = {};
            
        var methods = {
                addMenu: addMenu,
                importMenu: importMenu,
                saveMenu: saveMenu,
                publishMenu: publishMenu,
                toAction: toAction,
                showTip: showTip,
                chooseAction: chooseAction,
                sendMsg: sendMsg,
                saveMsg: saveMsg,
                toPage: toPage,
                saveLink: saveLink,
                scanCode: scanCode,
                addSubMenu: addSubMenu,
                editMenu: editMenu,
                deleteMenu: deleteMenu,
                moveMenuUp: moveMenuUp,
                moveMenuDown: moveMenuDown
            };
        
        //通过Hulala.Global.getWeixinAccounts这个接口来获取菜单数据
        loadData('getWeixinAccounts', {mpID: mpID}).done(getMenus);
        
        function getMenus(rsp)
        {
            var records = rsp || [],
                record = records[0] || {},
                menuJson = $.parseJSON(record.menuJson || '{}'),
                menuObj = menuJson.menu || {};
                
            menus = menuObj.button || [];
            renderMenu();
        }
        
        function renderMenu()
        {
            var dls = [];
            for(var i = 0, menu; menu = menus[i]; i++)
            {
                menu.id = '' + i;
                if(menu.url)
                {
                    menu.softType = '22';
                    menu.softWenChoose = menu.url;
                    delete menu.url;
                }
                var $dl = $('<dl>').append(dt(menu)),
                    subMenus = menu.sub_button || [];
                for(var j = 0, sm; sm = subMenus[j]; j++)
                {
                    sm.id = i + '' + j;
                    if(sm.url)
                    {
                        sm.softType = '22';
                        sm.softWenChoose = sm.url;
                        delete sm.url;
                    }
                    $dl.append(dd(sm));
                }
                
                dls.push($dl);
            }
            $menuWrap.html(dls);
            $noMenuTip.toggleClass('hidden', !!menus.length);
            
            var $menu = selectedMenu ? $menuWrap.find('#' + selectedMenu.id) : null;
            if($menu && $menu[0])
                 resovleMenuClick.call($menu, {target: $menu});
            else
                toAction(null, 'showTip', '请选择某个菜单项，然后在此选择或者设置相关动作。');
        }
        
        $menuWrap.on('mouseenter', 'dt, dd', function()
        {
            var $this = $(this);
            if(!$this.is('.selected')) $this.append($menuHover);
        })
        .on('mouseleave', 'dt, dd', function(){ $menuHover.remove(); })
        .on('click', 'dt, dd', resovleMenuClick);
        
        $pageCont.on('click', function(e)
        {
            var $target = $(e.target),
                methodName = $target.data('action');
            if(!$target.is('dt, dd, .glyphicon') 
            && methodName && methods[methodName])
                methods[methodName]($target);
        });
        
        function addMenu()
        {
            var menuCount = menus.length;
            if(menuCount >= 3){
                U.Alert({msg: '微信一级菜单最多只能创建3个！'});
                return;
            }
            
            var $form = $(editMenuTpl({menuType: '一', max: 5})),
                $input = $form.find('input'),
                modal = new U.ModalDialog({title: '添加一级菜单', html: $form}).show();
            modal._.footer.find('.btn-ok').text('确定').on('click', function()
            {
                var val = $.trim($input.val());
                if(!val) { topTip({msg: '请输入菜单名称！'}); return; }
                var menu = selectedMenu = { name: val};
                menus.push(menu);
                renderMenu();
                modal.hide();
            });
        }
        
        function importMenu($target)
        {
            $target.button('importing');
            $buttons.attr('disabled', 'disabled');
            loadData('importWinxinMenu', {mpID: mpID})
            .done(function(rsp)
            {
                selectedMenu = null, menus = [];
                topTip({msg: '导入成功！', type: 'success'});
                getMenus(rsp);
            })
            .always(function(){ resetButtons($target) });
        }
        
        function saveMenu($target)
        {
            var params = procPostMenuData();
            if(!params) return;
            if($target)
            {
                $target.button('saving');
                $buttons.attr('disabled', 'disabled');
            }
            loadData('saveWinxinMenu', params, null, false)
            .done(function()
            {
                topTip({msg: '保存成功！', type: 'success'}); 
            })
            .always(function(){ resetButtons($target) });
        }
        
        function publishMenu($target)
        {
            var params = procPostMenuData();
            if(!params) return;
            //saveMenu(null, params);
            $target.button('publishing');
            $buttons.attr('disabled', 'disabled');
            loadData('publishWinxinMenu', params, null, false)
            .done(function()
            {
                topTip({msg: '发布成功！', type: 'success'}); 
            })
            .always(function(){ resetButtons($target) });
        }
        
        function resetButtons($target)
        {
            if(!$target) return;
            setTimeout(function()
            {
                $target.button('reset');
                $buttons.removeAttr('disabled');
            }, 300)
        }
        
        function procPostMenuData()
        {
            var _menus = JSON.parse(JSON.stringify(menus));
            for(var i = 0, menu; menu = _menus[i]; i++)
            {
                menu.sub_button = menu.sub_button || [];
                var subMenus = menu.sub_button;
                if(!menu.type && !subMenus.length)
                {
                    topTip({msg: '一级菜单“' + menu.name + '”没有设置动作，也没有添加二级菜单！', type: 'warning'});
                    return false;
                }
                delete menu.id;
                for(var j = 0, sm; sm = subMenus[j]; j++)
                {
                    if(!sm.type)
                    {
                        topTip({msg: '二级菜单“' + sm.name + '”没有设置动作！', type: 'warning'});
                        return false;
                    }
                    sm.sub_button = [];
                    delete sm.id;
                }
            }
            
            return {
                mpID: mpID, 
                menuJson: JSON.stringify({menu: { button: _menus}})
            };
        }
        
        function resovleMenuClick(e)
        {
            var $this = $(this),
                id = $this.attr('id'),
                $target = $(e.target),
                menuInfo = getMenuInfo(id),
                menu = menuInfo.menu,
                methodName = $target.data('action');
            
            if($target.is('span i') && methodName && methods[methodName]) 
                methods[methodName]($this, menuInfo);
            
            if($this.is('.selected') || $target.is('span i')) return;
            
            selectedMenu = menu;
            $menuHover.remove();
            $menuWrap.find('.selected').removeClass('selected');
            $this.addClass('selected').append($menuClick);
            
            var type = menu.type, subMenus = menu.sub_button || [];
            if(!type && !subMenus.length) 
                toAction(null, 'chooseAction');
            else if(!type && subMenus.length) 
                toAction(null, 'showTip', '已有子菜单，无法设置动作！');
            else if(type == 'click')
                toAction(null, 'sendMsg');
            else if(type == 'view')
                toAction(null, 'toPage');
            else if(type == 'scancode_push')
                toAction(null, 'scanCode');
        }
        
        function getMenuInfo(id)
        {
            for(var i = 0, menu; menu = menus[i]; i++)
            {
                if(id == menu.id)
                    return {menu: menu, menus: menus, index: i};
                var subMenus = menu.sub_button || [];
                for(var j = 0, sm; sm = subMenus[j]; j++)
                    if(id == sm.id)
                        return {menu: sm, menus: subMenus, index: j};
            }
        }
        
        function toAction(from, to, msg)
        {
            var actionName = to || from.data('target'),
                method = methods[actionName];
            $actions.hide().filter('#' + actionName).fadeIn();
            if(method) method(msg);
        }
        
        function showTip(msg) { $showTip.text(msg); }
        
        function chooseAction() 
        {
            for(p in selectedMenu)
                if(!/name|id/.test(p)) delete selectedMenu[p];
        }
        
        function sendMsg()
        {
            var key = selectedMenu.key || '',
                match = key.match(/\d+/),
                resID = (match && match[0]) || '',
                $select = $resWrap.html(resSelect).find('select');
            
            W.createResourceChosen($select, $resView, resources, resID)
            .done(function(res){ resources = res; });
        }
        
        function saveMsg()
        {
            var val = $resWrap.find('select').val();
            if(!val)
            {
                topTip({msg: '未选择任何事件回复内容！'});
                return;
            }
            
            var res = _.find(resources, {itemID: val}),
                pres = _.pick(res, 'mpID', 'resTitle');
            pres.resourceID = val;
            pres.resType = res.resType == 2 ? 'text' : 'news';
            pres.pushEvent = "('CLICK')";
            loadData('WeixinMenuClick', pres, null, false)
            .done(function()
            {
                selectedMenu.type = 'click';
                selectedMenu.key = 'Resources:' + val;
                topTip({msg: '菜单设置成功！（保存菜单后生效）', type: 'success'});
            });
        }
        
        function toPage()
        {
            W.createLinkSelector($selectWrap, $contentWrap, dataHolder, selectedMenu.softType, selectedMenu.softWenChoose);
        }
        
        function saveLink()
        {
            var val = $selectWrap.find('select').val();
            if(!val)
            {
                topTip({msg: '未选择任何链接类型！', type: 'warning'});
                return;
            }
            var $cont = $contentWrap.find('select, input'),
                cont = $cont.val();
            if($cont[0] && !cont)
            {
                topTip({msg: '未选择或填写任何链接内容！', type: 'warning'});
                return;
            }
                
            selectedMenu.type = 'view';
            selectedMenu.softType = val;
            selectedMenu.softWenChoose = cont || '';
            topTip({msg: '菜单设置成功！（保存菜单后生效）', type: 'success'});
        }
        
        function scanCode()
        {
            selectedMenu.type = 'scancode_push';
            selectedMenu.key = 'scanMenu';
            //topTip({msg: '菜单设置成功！（保存菜单后生效）', type: 'success'});
        }
        
        function addSubMenu($menu, menuInfo)
        {
            var menu = menuInfo.menu,
                id = menu.id,
                subMenus = menu.sub_button || [],
                subMenuCount = subMenus.length;
            if(menu.type) {
                U.Alert({msg: '该菜单已有动作，要添加子菜单，请先取消此菜单的动作!'});
                return;
            }
            else if(subMenuCount >= 5){
                U.Alert({msg: '微信二级菜单最多只能创建5个！'});
                return;
            }
            
            var $form = $(editMenuTpl({menuType: '二', max: 13})),
                $input = $form.find('input'),
                modal = new U.ModalDialog({title: '添加二级菜单', html: $form}).show();
            modal._.footer.find('.btn-ok').text('确定').on('click', function()
            {
                var val = $.trim($input.val());
                if(!val) { topTip({msg: '请输入菜单名称！'}); return; }
                var subMenu = selectedMenu = { name: val };
                subMenus.push(subMenu);
                menu.sub_button = subMenus;
                renderMenu();
                modal.hide();
            });
        }
        
        function editMenu($menu, menuInfo)
        {
            var menu = menuInfo.menu,
                menuType = menu.id.length == 1 ? '一' : '二',
                max = menu.id.length == 1 ? '5' : '13',
                $form = $(editMenuTpl({name: menu.name, menuType: menuType, max: max})),
                $input = $form.find('input'),
                modal = new U.ModalDialog({title: '编辑菜单名称', html: $form}).show();
            modal._.footer.find('.btn-ok').text('确定').on('click', function()
            {
                var val = $.trim($input.val());
                if(!val) { topTip({msg: '请输入菜单名称！'}); return; }
                menu.name = val;
                $menu.find('b').text(val);
                modal.hide();
            });
        }
        
        function deleteMenu($menu, menuInfo)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            { 
                menuInfo.menus.splice(menuInfo.index, 1);
                if(selectedMenu && !getMenuInfo(selectedMenu.id)) selectedMenu = null;
                
                renderMenu();
            }});
        }
        
        function moveMenuUp($menu, menuInfo)
        {
            if(menuInfo.index == 0) return;
            var index = menuInfo.index,
                menu = menuInfo.menu,
                menus = menuInfo.menus,
                temp = menus[index - 1];
            menus[index - 1] = menu;
            menus[index] = temp;
            
            renderMenu();
        }
        
        function moveMenuDown($menu, menuInfo)
        {
            var index = menuInfo.index,
                menu = menuInfo.menu,
                menus = menuInfo.menus,
                maxIndex = menus.length - 1;
            if(index == maxIndex) return;
            var temp = menus[index + 1];
            menus[index + 1] = menu;
            menus[index] = temp;
            
            renderMenu();
        }
        
    }
    
    
})(jQuery, window);











;;(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initAdvertorial = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        
        var $pageCont = $(tplLib.get('tpl_wx_advertorial')).appendTo($pageBody),
            $ul = $pageBody.find('#adList ul'),
            $loading = $pageBody.find('.ad-loading'),
            $pager = $pageBody.find('.ad-pager'),
            $alert = $pageBody.find('#adList .alert'),
            $adCont = $pageBody.find('#adCont'),
            $headBtn = $adCont.find('.panel-head .btn'),
            $article = $adCont.find('article'),
            $adTitle = $adCont.find('.ad-title'),
            $input = $adCont.find('.ad-title-input'),
            $adSubTitle = $adCont.find('.ad-sub-title'),
            $adPreview = $adCont.find('.ad-preview');
        
        UM.delEditor('adEditor');
        var emotions = W.getEmotions(); dataHolder = {},
            toolbar = W.extendUM(emotions, dataHolder),
            adEditor = UM.getEditor('adEditor', { toolbar: ['source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
            'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize' ,
            '| justifyleft justifycenter justifyright justifyjustify |',
            'wxlink unlink | image video | map',
            '| horizontal print preview', 'drafts'] });
        
        var adTpl = Handlebars.compile([
        '{{#each records}}',
        '<li data-id="{{itemID}}">',
            '<h3>{{title}}</h3>',
            '<h6>{{time}}  {{groupName}}</h6>',
        '</li>',
        '{{/each}}'].join(''));
        
        var params = { pageNo: 1, pageSize: 10 }, 
            ads = [], ad, sGroupName = Hualala.getSessionSite().groupName;
        
        var methods = {
                addAd: addAd,
                editAd: editAd,
                delAd: delAd,
                saveAd: saveAd,
                concelEdit: concelEdit
            };
        
        $ul.on('click', 'li', function()
        {
            if($adCont.is('.editing'))
            {
                topTip({msg: '请先保存或者取消当前正在编辑的软文！', type: 'warning'});
                return;
            }
            var $this = $(this);
            $ul.find('li').removeClass('current');
            $this.addClass('current');
            ad = _.findWhere(ads, {itemID: $this.data('id')+''});
            $adTitle.text(ad.title);
            $input.val(ad.title);
            $adSubTitle.text(ad.time + '  ' + ad.groupName);
            $adPreview.html(ad.body);
            adEditor.setContent(ad.body);
            $article.removeClass('dn');
            $headBtn.removeClass('dn');
            $(window).scrollTop(0);
        });
        
        $pageCont.on('click', '.btn', function()
        {
            var $this = $(this),
                methodName = $this.data('action');
            if(methodName && methods[methodName])
                methods[methodName]($this);
        });
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getAds();
        });
        
        getAds();
        function getAds()
        {
            ads = [];
            $ul.hide();
            $headBtn.addClass('dn');
            $article.addClass('dn');
            $loading.show();
            C.loadData('getAdvertorials', params, null, 'data')
            .done(function(data)
            {
                data.records = data.records || [];
                _.each(data.records, function(record){ record.time = C.formatDateStr(record.actionTime, 8); });
                ads = data.records;
                renderAds(data);
            })
            .always(function(){ $loading.hide(); });
        }
        
        function renderAds(data)
        {
            $ul.show().html(adTpl(data));
            var page = data.page;
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            $headBtn.toggleClass('dn', !ads.length);
            $article.toggleClass('dn', !ads.length);
            $alert.toggleClass('dn', !!ads.length);
            if(ads.length) $ul.find('li').eq(0).click();
            
        }
        
        function addAd()
        {
            if($adCont.is('.editing'))
            {
                topTip({msg: '请先保存当前正在编辑的软文！', type: 'warning'});
                return;
            }
            $ul.find('.current').removeClass('current');
            ad = null;
            $input.val('');
            $adSubTitle.text(sGroupName);
            adEditor.setContent('');
            $adCont.addClass('editing');
            $article.removeClass('dn');
            $headBtn.addClass('dn');
        }
        
        function editAd()
        {
            $adCont.addClass('editing');
            $headBtn.attr('disabled', 'disabled');
        }
        
        function delAd($btn)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            { 
                disBtn($btn, 'deleting');
                C.loadData('deleteAdvertorial', {itemID: ad.itemID}, null, false)
                .done(function()
                {
                    var i = C.inArray(ads, ad, 'itemID');
                    $ul.find('[data-id='+ ad.itemID + ']').remove();
                    ads.splice(i, 1);
                    ad = null;
                    $ul.find('li').eq(0).click();
                    if(!ads.length)
                    {
                        params.pageNo = 1;
                        getAds();
                    }
                    topTip({msg: '删除成功!', type: 'success'});
                })
                .always(function(){ resetBtn($btn) });
            }});
        }
        
        function saveAd($btn)
        {
            var title = $.trim($input.val());
            if(!title)
            {
                topTip({msg: '请输入软文标题！', type: 'warning'});
                $input.focus();
                return;
            }
            disBtn($btn, 'saving');
            var body = adEditor.getContent(),
                groupName = ad ? ad.groupName : groupName,
                saveAction = ad ? updateAd : createAd;
            saveAction($btn, {title: title, body: body, groupName: sGroupName});
        }
        
        function updateAd($btn, _ad)
        {
            _ad.itemID = ad.itemID;
            C.loadData('updateAdvertorial', _ad, null, false)
            .done(function()
            {
                /*ad.title = _ad.title;
                ad.body = _ad.body;
                $(window).scrollTop(0);
                $ul.find('.current h3').text(ad.title);
                $adTitle.text(ad.title);
                $adPreview.html(ad.body);*/
                params.pageNo = 1;
                getAds();
                $adCont.removeClass('editing');
                $headBtn.removeAttr('disabled', 'disabled');
                topTip({msg: '保存成功!', type: 'success'});
            })
            .always(function(){ resetBtn($btn) });
        }
        
        function createAd($btn, _ad)
        {
            C.loadData('createAdvertorial', _ad)
            .done(function(records)
            {
                ad = records[0];
                ad.time = C.formatDateStr(ad.actionTime, 8);
                ads.unshift(ad);
                $adCont.removeClass('editing');
                $alert.addClass('dn');
                $(adTpl({records: records})).prependTo($ul.show()).click();
                topTip({msg: '保存成功!', type: 'success'});
            })
            .always(function(){ resetBtn($btn) });
        }
        
        function concelEdit()
        {
            $adCont.removeClass('editing');
            if(!ads.length)
            {
                $headBtn.addClass('dn');
                $article.addClass('dn');
                $alert.removeClass('dn');
                return;
            }
            if(!ad)
            {
                $ul.find('li').eq(0).click();
                return;
            }
            $headBtn.removeAttr('disabled');
            $input.val(ad.title);
            adEditor.setContent(ad.body);
            $(window).scrollTop(0);
        }
        
        function disBtn($btn, state)
        {
            if(!$btn) return;
            $btn.button(state);
            $btn.attr('disabled', 'disabled');
        }
        
        function resetBtn($btn)
        {
            if(!$btn) return;
            setTimeout(function()
            {
                $btn.button('reset').removeAttr('disabled');
            }, 300)
        }
        
    }
    
})(jQuery, window);











;(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initContent = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        
        $pageBody.html(tplLib.get('tpl_wx_content'));
        
        var resActionTpl = tplLib.get('tpl_wx_res_action'),
            resEditTpl = Handlebars.compile(tplLib.get('tpl_wx_res_edit')),
            imgHost = G.IMAGE_RESOURCE_DOMAIN + '/';
        
        var cols = {
                '1': $('<div></div>').addClass('col-xs-12'),
                '2': $('<div></div><div></div>').addClass('col-xs-6'),
                '3': $('<div></div><div></div><div></div>').addClass('col-xs-4'),
                '4': $('<div></div><div></div><div></div><div></div>').addClass('col-xs-3')
            };
            
        var $win = $(window), $cols, $fall = $pageBody.find('.fall'),
            $noCont = $pageBody.find('.no-cont'),
            $loading = $pageBody.find('.loading-tip');
        
        var params = { pageNo: 0, pageSize: 50 }, 
            allConts = [], index = 0, size = 20,
            isLoading, isLoaded, maxMutilContSize = 8;
        
        layout();
        loadConts(renderConts);
        
        $win.off('.wxCont')
        .on('resize.wxCont', _.throttle(layout, 200))
        .on('scroll.wxCont', _.throttle(scrollConts, 200));
        
        $fall.on('click', '.res-view', function(e)
        {
            var $me = $(this);
            if($me.is('.animating')) return;
            var cont = _.findWhere(allConts, {itemID: $me.attr('resid')}),
                $target = $(e.target);
            if($target.is('.del-res')) deleteCont(cont);
            else if($target.is('.edit-res')) editCont(cont);
        });
        
        $pageBody.on('click', '#addContOne', function()
        {
            var cont = { resTitle: '标题1', resType: '0' },
                resources = [{resTitle: '标题1', resTypeContent: {}}],
                resContent = { isMul: '0', resources: resources };
            
            cont.resContent = JSON.stringify(resContent);
            editCont(cont);
        });
        
        $pageBody.on('click', '#addContMulti', function()
        {
            var cont = { resTitle: '标题1', resType: '1' },
                resources = [{resTitle: '标题1', resTypeContent: {}}];
            resources.push({resTitle: '标题2', resTypeContent: {}});
            var resContent = { isMul: '1', resources: resources };
            cont.resContent = JSON.stringify(resContent);
            editCont(cont);
        });
        
        var dataHolder = {},
            resSubTpl = tplLib.get('tpl_wx_res_sub');
        function checkResItem(resItem, type, $contentWrap)
        {
            var $linkCont = $contentWrap.find('select, input'),
                noLinkCont = !$contentWrap.is('.hidden') && $linkCont[0] && !$linkCont.val();
            var ret = !resItem.resTitle 
                || !resItem.imgPath 
                || (type == 0 && !resItem.digest)
                || !resItem.resType
                || noLinkCont ? false : true;
            var msg = !resItem.resTitle ? '请输入当前图文的标题！' 
                : !resItem.imgPath ? '请上传当前图文的图片！' 
                : type == 0 && !resItem.digest ? '请输入图文摘要！'
                : !resItem.resType ? '请选择当前图文的链接类型！'
                : noLinkCont ? '请选择或输入当前图文的链接内容！' : '';
            
            if(!ret) topTip({msg: msg});
            
            return ret;
        }
        function editCont(cont)
        {
            var itemID = cont.itemID,
                resType = cont.resType,
                resArr = $.parseJSON(cont.resContent).resources,
                activeRes = resArr[0],
                $resEdit = $(resEditTpl(activeRes)),
                $resWrap = $resEdit.filter('.res-wrap'),
                $resForm = $resEdit.filter('.res-form'),
                $resTitle = $resForm.find('.res-title'),
                $resDigest = $resForm.find('.res-digest'),
                $selectWrap = $resForm.find('.link-select-wrap'),
                $contentWrap = $resForm.find('.link-content-wrap'),
                title = (itemID ? '修改' : '添加') +
                        (resType == 1 ? '多' : '单') + '图文消息',
                modal = new U.ModalDialog({title: title, html: $resEdit, sizeCls: 'modal-lg'}).show();
                
            modal._.body.addClass('clearfix');
            W.createResourceView(cont, null, true).appendTo($resWrap);
            
            var $activeRes = $resWrap.find('.res-single, .active');
            $resTitle.on('change', function()
            {
                activeRes.resTitle = this.value;
                $activeRes.find('h4, h6').text(this.value); 
            });
            $resDigest.on('change', function()
            {
                activeRes.digest = this.value;
                $activeRes.find('p').text(this.value); 
            });
            $selectWrap.on('change', 'select', function()
            {
                activeRes.resType = this.value;
                activeRes.resTypeContent.resType = this.value;
                if($contentWrap.is('.hidden')) 
                    delete activeRes.resTypeContent.urlOrCity;
            });
            $contentWrap.on('change', 'select, input', function()
            {
                activeRes.resTypeContent.urlOrCity = this.value;
            });
            
            W.createLinkSelector($selectWrap, $contentWrap, dataHolder, 
                activeRes.resType, activeRes.resTypeContent.urlOrCity);
            
            U.imgUpload($resForm.find('.btn'), function(rsp)
            {
                activeRes.imgPath = rsp.url;
                var i = $activeRes.index(),
                    hwp = parseFloat((+rsp.imgHWP).toFixed(2)),
                    replaceStr = (hwp ? '=' + (i == 0 ? Math.round(160 / hwp) + 'x' + 160 : '75x75' ) : '') + '$&',
                    imgUrl = imgHost + rsp.url.replace(/\.\w+$/, replaceStr) + '?quality=70';
                $activeRes.find('img, .img').replaceWith($('<img>').attr('src', imgUrl));
            });
            
            modal._.footer.find('.btn-ok').on('click', function()
            {
                if(!checkResItem(activeRes, resType, $contentWrap)) return;
                if(!itemID && resType == 1 && activeRes != resArr[1])
                {
                    $resWrap.find('.res-mask').eq(1).click();
                    if(!checkResItem(activeRes, resType, $contentWrap)) return;
                }
                var submitFunc = itemID ? updateCont : createCont,
                    _cont = $.extend({}, cont),
                    resContent = { isMul: cont.resType, resources: resArr };
                
                _cont.resTitle = resArr[0].resTitle;
                _cont.resContent = JSON.stringify(resContent);
                _cont = _.pick(_cont, 'itemID', 'resTitle', 'resType', 'resContent');
                submitFunc(_cont, cont, modal);
                
            });
            
            if(resType != 1) return;
            $resForm.find('.digest-wrap').hide();
            var $icoDel = $('<i class="glyphicon glyphicon-remove" title="删除"></i>');
            
            if(resArr.length > 2)
                $resWrap.find('.res-mask').last().append($icoDel);
            var $addSubRes = $resWrap.find('.add-sub-res');
            if(resArr.length >= maxMutilContSize)
                $addSubRes.addClass('disabled');
            $resWrap.on('click', '.res-mask', function(e)
            {
                var $res = $(this).parent(), i = $res.index(), $target = $(e.target);
                if($target.is('.glyphicon-remove'))
                {
                    $res.remove();
                    resArr.pop();
                    var $lastMask = $resWrap.find('.res-mask').eq(i - 1);
                    if(resArr.length > 2) $lastMask.append($icoDel);
                    if($res.is('.active'))
                    {
                        activeRes = resArr[i - 1];
                        $lastMask.click();
                    }
                    if(resArr.length < maxMutilContSize)
                        $addSubRes.removeClass('disabled');
                    return;
                }
                if($res.is('.active') || !checkResItem(activeRes, resType, $contentWrap)) return;
                activeRes = resArr[i];
                $resWrap.find('.active').removeClass('active');
                $res.addClass('active');
                $activeRes = $res;
                $resTitle.val(activeRes.resTitle);
                W.createLinkSelector($selectWrap, $contentWrap, dataHolder, 
                    activeRes.resType, activeRes.resTypeContent.urlOrCity);
                
            });
            $resWrap.on('click', '.add-sub-res', function(e)
            {
                if(!checkResItem(activeRes, resType, $contentWrap)) return;
                if($addSubRes.is('.disabled'))
                {
                    topTip({msg: '多图文最多只能添加8项！'});
                    return;
                }
                var res = { resType: 1, resTypeContent: {} };
                res.resTitle = '标题' + ($resWrap.find('.res-mask').length + 1);
                resArr.push(res);
                $res = $(resSubTpl);
                $res.find('h6').text(res.resTitle);
                
                $(this).before($res);
                var $mask = $res.find('.res-mask').click();
                if(resArr.length > 2) 
                    $mask.append($icoDel);
                if(resArr.length >= maxMutilContSize)
                    $addSubRes.addClass('disabled');
            })
        }
        
        function updateCont(_cont, cont, modal)
        {
            C.loadData('updateWeixinContent', _cont, null, false)
            .done(function()
            {
                resetConts();
                modal.hide();
                topTip({msg: '修改成功!', type: 'success'});
            });
        }
        
        function createCont(_cont, cont, modal)
        {
            C.loadData('createWeixinContent', _cont)
            .done(function(records)
            {
                topTip({msg: '添加成功!', type: 'success'});
                modal.hide();
                if(!isLoaded) return resetConts();
                
                allConts.unshift(records[0]);
                $cols.empty();
                renderConts();
                $noCont.hide();
            });
        }
        
        function deleteCont(cont, $me)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            { 
                C.loadData('deleteWeixinContent', {itemID: cont.itemID}, null, false)
                .done(function()
                {
                    topTip({msg: '删除成功!', type: 'success'});
                    if(!isLoaded) return resetConts();
                    
                    var i = C.inArray(allConts, cont, 'itemID');
                    allConts.splice(i, 1);
                    $cols.empty();
                    renderConts();
                    if(!allConts.length)
                    {
                        $loading.hide();
                        $noCont.show();
                    }
                });
            }});
        }
        
        function scrollConts()
        {
            if(!isLoaded && !isLoading && allConts.length - index < 50)
                loadConts();
            
            var limitBottom = $win.scrollTop() + $win.height(),
                fallBottom = $fall.offset().top + $fall.height(),
                isAnimated = $fall.find('.res-view:last-child').css('opacity') == 1;
        
            if(fallBottom < limitBottom && index < allConts.length && isAnimated)
            {
                renderConts(allConts.slice(index, index + size));
            }
        }
        
        function renderConts(conts)
        {
            var _conts = conts || allConts.slice(0, index);
            if(!_conts.length) return;
            
            var n = $cols.length, colArr = [];
            for(var i = 0; i < n; i++) colArr.push([]);
            
            for(var i = 0, cont; cont = _conts[i]; i++)
            {
                var $cont = W.createResourceView(cont).append(resActionTpl),
                    mod = i % n;
                if(conts) $cont.addClass('animating').css('opacity', 0);
                colArr[mod].push($cont);
            }
            for(var i = 0, col; col = colArr[i]; i++)
            {
                $cols.eq(i).append(col);
                if(conts) queueAnimation(col);
            }
            
            if(conts) index += size;
        }
        
        function queueAnimation(elems)
        {
            if(!elems.length)
            {
                $win.scroll();
                $loading.hide();
                if(index >= allConts.length && isLoaded)
                    $loading.show().text('全部加载完毕！');
                return;
            }
            $loading.show();
            elems.shift().animate({opacity: 1}, 400, 'linear' , 
            function()
            {
                $(this).removeClass('animating');
                queueAnimation(elems);
            });
        }
        
        function loadConts(callback)
        {
            isLoading = true;
            $loading.show();
            params.pageNo++;
            C.loadData('getWeixinContents', params, null, 'data')
            .done(function(data)
            {
                var records = data.records || [],
                    page = data.page || {};
                allConts.push.apply(allConts, records);
                if(page.pageNo >= page.pageCount) isLoaded = true;
                if(!records.length)
                {
                    $noCont.show();
                    return;
                }
                callback && callback(allConts.slice(index, index + size));
            })
            .always(function()
            {
                isLoading = false;
                $loading.hide();
            });
        }
        
        function layout()
        {
            var $_cols = getCols();
            if($cols == $_cols) return;
            $cols = $_cols;
            $fall.html($cols.empty());
            if(!allConts.length) return;
            renderConts();
        }
        
        function getCols()
        {
            var w = $(window).width() , n;
            if(w > 960) n = 4;
            else if(w > 720 && w <= 960) n = 3;
            else if(w > 480 && w <= 720) n = 2;
            else n = 1;
            
            return cols[n];
        }
        
        function resetConts()
        {
            params.pageNo = 0;
            allConts = [];
            index = 0;
            $cols.empty();
            loadConts(renderConts);
        }
    }
    
})(jQuery, window);











;(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initText = function($pageBody)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        
        $pageBody.html(tplLib.get('tpl_wx_text'));
        
        var $viewing = $pageBody.find('#viewing'),
            $txts = $viewing.find('#txts'),
            $loading = $viewing.find('#loading'),
            $pager = $viewing.find('.txt-pager'),
            $alert = $viewing.find('.alert-warning'),
            $editing = $pageBody.find('#editing'),
            $editNavTitle = $editing.find('.pt'),
            $txtTitle = $editing.find('#txtTitle');
        
        var txtsTpl = Handlebars.compile(tplLib.get('tpl_wx_txts'));
        var txts = [], params = { pageNo: 1, pageSize: 10 }, current,
            emotions = W.getEmotions(), isAllLoaded, dataHolder = {};
        
        UM.delEditor('txtEditor');
        W.extendUM(emotions, dataHolder);
        var txtEditor = UM.getEditor('txtEditor', {toolbar: ['qqemotion wxlink unlink | undo redo | selectall cleardoc'] });
        txtEditor.execCommand('cleardoc');
        var actions = {
                editTxt: editTxt,
                delTxt: delTxt,
                addTxt: addTxt,
                saveTxt: saveTxt,
                concelEdit: concelEdit
            }
        
        getTxts();
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getTxts();
        });
        
        $pageBody.on('click', '.btn, #txts > li', function(e)
        {
            var $me = $(this), $tar = $(e.target),
                actionName = $me.data('action') || $tar.data('action'),
                action = actions[actionName];
            if(actionName && action) action($me);
        })
        
        function getTxts()
        {
            $loading.show();
            $txts.empty();
            txts = [];
            C.loadData('getWeixinTexts', params, null, 'data')
            .done(function(data)
            {
                var page = data.page;
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
                isAllLoaded = page.pageNo >= page.pageCount;
                txts = data.records || [];
                $alert.toggleClass('dn', !!txts.length);
                if(!txts.length) return;
                _.each(txts, function(txt){ txt.txtCont = W.parseEmotions(txt.resContent, emotions); });
                $txts.html(txtsTpl(txts));
            })
            .always(function(){ $loading.hide(); });
        }
        
        function editTxt($txt)
        {
            var itemID = $txt ? $txt.attr('itemid') : '',
                txt = $txt ? _.findWhere(txts, {itemID: itemID}) : { resType: '2' };
            current = { txt: txt, $txt: $txt };
            $txtTitle.val(txt.resTitle);
            txtEditor.setContent(txt.txtCont || '');
            $editNavTitle.text(($txt ? '修改' : '添加') + '文本消息');
            $viewing.hide();
            $editing.show();
        }
        
        function delTxt($txt)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            {
                var itemID = $txt.attr('itemid');
                C.loadData('deleteWeixinText', {itemID: itemID}, null, false)
                .done(function()
                {
                    topTip({msg: '删除成功!', type: 'success'});
                    var txt = _.findWhere(txts, {itemID: itemID});
                    var i = C.inArray(txts, txt, 'itemID');
                    
                    txts.splice(i, 1);
                    if(!txts.length && !isAllLoaded)
                    {
                        params.pageNo = 1;
                        getTxts();
                        return;
                    }
                    $txt.remove();
                    $alert.toggleClass('dn', !!txts.length);
                });
            }});
        }
        
        function addTxt()
        {
            editTxt();
        }
        
        function saveTxt($btn)
        {
            if(!current) return;
            var resTitle = $.trim($txtTitle.val()),
                resContent = $.trim(filterTxt(txtEditor.getContent())),
                msg = !resTitle ? '请输入标题' :
                      !resContent ? '请输入内容！' : '';
            if(msg)
            {
                topTip({msg: msg, type: 'warning'});
                return;
            }
            $btn.attr('disabled', 'disabled').button('saving');
            var txt = current.txt, $txt = current.$txt,
                _txt = $.extend({}, txt, { resTitle: resTitle, resContent: resContent }),
                submitFunc = $txt ? updateTxt : createTxt;
            submitFunc(_.pick(_txt, 'itemID', 'resTitle', 'resType', 'resContent'), $btn, txt, $txt);
        }
        
        function updateTxt(_txt, $btn, txt, $txt)
        {
            C.loadData('updateWeixinContent', _txt, null, false)
            .done(function()
            {
                /*txt.resTitle = _txt.resTitle;
                txt.resContent = _txt.resContent;
                txt.txtCont = W.parseEmotions(txt.resContent, emotions);
                $txt.find('.t-txt').text(txt.resTitle);
                $txt.find('.txt-cont').html(txt.txtCont);*/
                params.pageNo = 1;
                getTxts();
                setTimeout(function()
                {
                    topTip({msg: '修改成功!', type: 'success'});
                    concelEdit();
                }, 1000);
            })
            .always(function(){ resetBtn($btn); });
        }
        
        function createTxt(_txt, $btn)
        {
            C.loadData('createWeixinContent', _txt)
            .done(function(records)
            {
                var txt = records[0];
                txt.txtCont = W.parseEmotions(txt.resContent, emotions);
                txts.unshift(txt);
                $alert.hide();
                $(txtsTpl([txt])).prependTo($txts);
                setTimeout(function()
                {
                    topTip({msg: '修改成功!', type: 'success'});
                    concelEdit();
                }, 1000);
            })
            .always(function(){ resetBtn($btn); });
        }
        
        function concelEdit()
        {
            current = null;
            $viewing.show();
            $editing.hide();
        }
        
        function filterTxt(txt)
        {
            var conts = $('<div>').html(txt).contents(),
                ret = '';
            for(var i = 0, cont; cont = conts[i++];)
            {
                if(cont.nodeType == 3)
                    ret += cont.nodeValue;
                else if(cont.nodeName.toLowerCase() == 'img')
                    ret += '/' + cont.alt;
                else if(cont.nodeName.toLowerCase() == 'a')
                    ret += '<a href="' + cont.href + '">' + filterTxt(cont.innerHTML) + '</a>';
                else
                    ret += filterTxt(cont.innerHTML);
            }
            return ret;
        }
        
        function resetBtn($btn)
        {
            setTimeout(function()
            {
                $btn.button('reset').removeAttr('disabled');
            }, 1000);
        }
    }
    
    
})(jQuery, window);











;(function ($, window) {
	IX.ns('Hualala.Weixin');
    
    Hualala.Weixin.getEmotions = getEmotions;
    Hualala.Weixin.getLinkTypes = getLinkTypes;
    
    function getEmotions()
    {
        return [
            { url : 'CD/wKgCIVNWKH6hmHQGAAAHEjWPAZs514.gif', title : '微笑'},
            { url : 'CD/wKgCH1NWKH6XWC2eAAAGLnAf7-c591.gif', title : '撇嘴'},
            { url : 'CD/wKgCH1NWKH6MDGgnAAAHDLr8VAc015.gif', title : '色'},
            { url : 'CD/wKgCIVNWKH6n-9spAAAHPEQTyEQ985.gif', title : '发呆'},
            { url : 'CD/wKgCIVNWKH77iHinAAAHuTE4C2A482.gif', title : '得意'},
            { url : 'CD/wKgCH1NWKH7Zf7edAAAHSgtCCG8416.gif', title : '流泪'},
            { url : 'CD/wKgCH1NWKH6xyGFAAAAN5AitwJQ082.gif', title : '害羞'},
            { url : 'CD/wKgCIVNWKH6YRAi2AAAPWXBFl_s040.gif', title : '闭嘴'},
            { url : 'CD/wKgCIVNWKH7U4BSWAAASR42ZkF8934.gif', title : '睡'},
            { url : 'CD/wKgCH1NWKH6fU-ScAAAM4kuzwSw947.gif', title : '大哭'},
            { url : 'CD/wKgCH1NWKH6kRnZ4AAAOhNr-C2A640.gif', title : '尴尬'},
            { url : 'CD/wKgCIVNWKH-5Hxl0AAAfYSRbMUk617.gif', title : '发怒'},
            { url : 'CD/wKgCIVNWKH-Cy2QiAAAIxwh7gJ8587.gif', title : '调皮'},
            { url : 'CD/wKgCH1NWKH_DZSQYAAAGyAJA_uI043.gif', title : '呲牙'},
            { url : 'CD/wKgCH1NWKH--YrfCAAAPpiODsBY933.gif', title : '惊讶'},
            { url : 'CD/wKgCIVNWKH_RQooVAAAGGnFweWw274.gif', title : '难过'},
            { url : 'CD/wKgCIVNWKH_PlZg3AAAFhd405eU255.gif', title : '酷'},
            { url : 'CD/wKgCH1NWKH-rvyFaAAANJobRVnA139.gif', title : '冷汗'},
            { url : 'CD/wKgCH1NWKH_zy_40AAAfyfLjzW0528.gif', title : '抓狂'},
            { url : 'CD/wKgCIVNWKIDmLODOAAAfx7thOIU847.gif', title : '吐'},
            { url : 'CD/wKgCIVNWKID4WKyxAAAHEBEwsog704.gif', title : '偷笑'},
            { url : 'CD/wKgCH1NWKICsFM_3AAAHSNA129k556.gif', title : '可爱'},
            { url : 'CD/wKgCH1NWKIDtm2xhAAALwnkTd8E528.gif', title : '白眼'},
            { url : 'CD/wKgCIVNWKIChwcKbAAAHntrRtOU292.gif', title : '傲慢'},
            { url : 'CD/wKgCIVNWKIDoIMNzAAAI0YNpmX8518.gif', title : '饥饿'},
            { url : 'CD/wKgCH1NWKICzMaRiAAAJjqlzh0s106.gif', title : '困'},
            { url : 'CD/wKgCH1NWKIClntTjAAAPrv0u1iE580.gif', title : '惊恐'},
            { url : 'CD/wKgCIVNWKIDTeBDAAAALTUiZH1E231.gif', title : '流汗'},
            { url : 'CD/wKgCIVNWKICY8xuSAAAMvksAY_c342.gif', title : '憨笑'},
            { url : 'CD/wKgCH1NWKIGa3CXNAAAW5RugBIc941.gif', title : '大兵'},
            { url : 'CD/wKgCH1NWKIHTKKpZAAAG9OMVt48363.gif', title : '奋斗'},
            { url : 'CD/wKgCIVNWKIGw3p30AAAUNliA67o282.gif', title : '咒骂'},
            { url : 'CD/wKgCIVNWKIHS-AKHAAAcFXdc82Q472.gif', title : '疑问'},
            { url : 'CD/wKgCH1NWKIG5_BNwAAAQ3fqvFkA245.gif', title : '嘘'},
            { url : 'CD/wKgCH1NWKIGigs9mAAAIXKFk83E124.gif', title : '晕'},
            { url : 'CD/wKgCIVNWKIGptYlqAAA0UDIQLFg977.gif', title : '折磨'},
            { url : 'CD/wKgCIVNWKIGYPIIjAAAFiWXFty8768.gif', title : '衰'},
            { url : 'CD/wKgCH1NWKIGtyC8hAAAEq48_kyg648.gif', title : '骷髅'},
            { url : 'CD/wKgCH1NWKIGOfYHZAAAGisisHhw165.gif', title : '敲打'},
            { url : 'CD/wKgCIVNWKIKjx8PKAAAHBpwa4CY851.gif', title : '再见'},
            { url : 'CD/wKgCIVNWKIL_MnpUAAAnbBIu5y0245.gif', title : '擦汗'},
            { url : 'CD/wKgCH1NWKILZEx53AAANKIT20WQ983.gif', title : '抠鼻'},
            { url : 'CD/wKgCH1NWKIKV60t7AAA0N2DE7bc169.gif', title : '鼓掌'},
            { url : 'CD/wKgCIVNWKIL59hU5AAAQ54o41Kk036.gif', title : '糗大了'},
            { url : 'CD/wKgCIVNWKILEbQCZAAAGI_0O4X8576.gif', title : '坏笑'},
            { url : 'CD/wKgCH1NWKIL4kuL3AAASVA6Ifk4545.gif', title : '左哼哼'},
            { url : 'CD/wKgCH1NWKILHWREjAAAUKj4EcvQ524.gif', title : '右哼哼'},
            { url : 'CD/wKgCIVNWKILQMPcYAAAOZSkc7Jw649.gif', title : '哈欠'},
            { url : 'CD/wKgCIVNWKIPuGPqAAAAG25fNuM8445.gif', title : '鄙视'},
            { url : 'CD/wKgCH1NWKIKMa-JLAAAY2TnURuo416.gif', title : '委屈'},
            { url : 'CD/wKgCH1NWKIPMPmP1AAAMAaVr23I453.gif', title : '快哭了'},
            { url : 'CD/wKgCIVNWKIOOgnj1AAAOkx4Bh_Q822.gif', title : '阴险'},
            { url : 'CD/wKgCIVNWKIOeUKLLAAAF_GTXs6Q904.gif', title : '亲亲'},
            { url : 'CD/wKgCH1NWKIO1xGMuAAAICHoJBFw359.gif', title : '吓'},
            { url : 'CD/wKgCH1NWKIPN2fzNAAAJOoITboY253.gif', title : '可怜'},
            { url : 'CD/wKgCIVNWKIO0xK32AAAGLs6b_Ro551.gif', title : '菜刀'},
            { url : 'CD/wKgCIVNWKIPqGwCbAAAEkqSp4Sw833.gif', title : '西瓜'},
            { url : 'CD/wKgCH1NWKIObPGkbAAAT0DNHWAo512.gif', title : '啤酒'},
            { url : 'CD/wKgCH1NWKIPa_VUOAAAKJHslunM338.gif', title : '篮球'},
            { url : 'CD/wKgCIVNWKIPZZ5N8AAAF_WKxMqw106.gif', title : '乒乓'},
            { url : 'CD/wKgCIVNWKISwryuSAAAKa9RcamE946.gif', title : '咖啡'},
            { url : 'CD/wKgCH1NWKISyfwdlAAAEcPmAmvc991.gif', title : '饭'},
            { url : 'CD/wKgCH1NWKISLlrJrAAAE9SamlGU206.gif', title : '猪头'},
            { url : 'CD/wKgCIVNWKISAOssoAAADy2tCJ7o039.gif', title : '玫瑰'},
            { url : 'CD/wKgCIVNWKISr6e_dAAAD3L7K5vE917.gif', title : '凋谢'},
            { url : 'CD/wKgCH1NWKIT4_u6FAAAUpYIuysE035.gif', title : '示爱'},
            { url : 'CD/wKgCH1NWKITgj9d5AAAEh2XzeLs214.gif', title : '爱心'},
            { url : 'CD/wKgCIVNWKITxvLsxAAAKujCDjJU510.gif', title : '心碎'},
            { url : 'CD/wKgCIVNWKITkdjGzAAAQNAagCHU699.gif', title : '蛋糕'},
            { url : 'CD/wKgCH1NWKISIFHmqAAAD91kg-JE423.gif', title : '闪电'},
            { url : 'CD/wKgCH1NWKITiVZFvAAAEiniNOl4497.gif', title : '炸弹'},
            { url : 'CD/wKgCIVNWKITI_Kz4AAADOMg7F1U036.gif', title : '刀'},
            { url : 'CD/wKgCIVNWKIX0UCPGAAAOXyFMKrE161.gif', title : '足球'},
            { url : 'CD/wKgCH1NWKITMNY5JAAAIk5fThiw184.gif', title : '瓢虫'},
            { url : 'CD/wKgCH1NWKIWI9sApAAAJllKthhY471.gif', title : '便便'},
            { url : 'CD/wKgCIVNWKIX4NcPwAAAExrdFHOM457.gif', title : '月亮'},
            { url : 'CD/wKgCIVNWKIXj--DBAAAEu_hcC4k274.gif', title : '太阳'},
            { url : 'CD/wKgCH1NWKIXq0Gx-AAAEfxCtQPg896.gif', title : '礼物'},
            { url : 'CD/wKgCH1NWKIXgdKPvAAAGHeYffaA847.gif', title : '拥抱'},
            { url : 'CD/wKgCIVNWKIWyKM5FAAAF7ovU57E277.gif', title : '强'},
            { url : 'CD/wKgCIVNWKIWPKrOXAAAGATpp04Q875.gif', title : '弱'},
            { url : 'CD/wKgCH1NWKIW7CKJJAAAGN4PjHgk736.gif', title : '握手'},
            { url : 'CE/wKgCH1NWKIWII8xPAAAGC-ylE0I030.gif', title : '胜利'},
            { url : 'CD/wKgCIVNWKIX9Fcn-AAAGN720qlg404.gif', title : '抱拳'},
            { url : 'CD/wKgCIVNWKIWhnWQNAAANYEzopPo145.gif', title : '勾引'},
            { url : 'CE/wKgCH1NWKIWRtwPHAAAGLccwr7c365.gif', title : '拳头'},
            { url : 'CE/wKgCH1NWKIWyVvLpAAAF73AN-Og539.gif', title : '差劲'},
            { url : 'CD/wKgCIVNWKIblO0ySAAAGFsLpii0260.gif', title : '爱你'},
            { url : 'CD/wKgCIVNWKIb3ntxnAAAIVqQUcy4531.gif', title : 'NO'},
            { url : 'CE/wKgCH1NWKIac15IHAAAEw64jKVA529.gif', title : 'OK'},
            { url : 'CE/wKgCH1NWKIbSXxzGAAAKtzujC9w203.gif', title : '爱情'},
            { url : 'CD/wKgCIVNWKIbgjhDrAAACjgWZXP4623.gif', title : '飞吻'},
            { url : 'CD/wKgCIVNWKIb9abFsAAAFYZ2yllA765.gif', title : '跳跳'},
            { url : 'CE/wKgCH1NWKIaHBEHzAAAEX99eGAg355.gif', title : '发抖'},
            { url : 'CE/wKgCH1NWKIepcK-tAAANYvdRETc255.gif', title : '怄火'},
            { url : 'CE/wKgCIVNWKIfwhBJGAAALwyRDuF8811.gif', title : '转圈'},
            { url : 'CE/wKgCIVNWKIfJFeNwAAAHBGnVicw191.gif', title : '磕头'},
            { url : 'CE/wKgCH1NWKIfoDJwQAAAUtOcKYmU453.gif', title : '回头'},
            { url : 'CE/wKgCH1NWKIe5FEqLAAAGXUlhmqw064.gif', title : '跳绳'},
            { url : 'CE/wKgCIVNWKIeb6F2UAAAI1QqtQ7Y764.gif', title : '挥手'},
            { url : 'CE/wKgCIVNWKIe8INuBAAAG9HJo2zM848.gif', title : '激动'},
            { url : 'CE/wKgCH1NWKIfndJHDAAAJi-oVE34806.gif', title : '街舞'},
            { url : 'CE/wKgCH1NWKIedbP9SAAAFps_xS8w196.gif', title : '献吻'},
            { url : 'CE/wKgCIVNWKIizikDBAAAIdrn1ytM011.gif', title : '左太极'},
            { url : 'CE/wKgCIVNWKIjSNEstAAAIeX2ucII889.gif', title : '右太极'}
        ];
    }
    
    function getLinkTypes()
    {
        return [
            { value: '1', title: '软文', type: 'select', subTitle: '软文', api: 'getAdvertorials', params: {}, keys: ['itemID', 'title'],
            urlTpl: 'share/{{arg1}}' },
            { value: '2', title: '集团首页',
            urlTpl: 'index.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '3', title: '店铺预定搜索网页', type: 'select', subTitle: '城市', api: 'getCities', params: { isActive: 1 }, keys: ['cityID', 'cityName'], firstItem: {cityID: '0', cityName: '附近' },
            urlTpl: 'shop/common.htm?{{arg2}}&sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '4', title: '订座点菜具体店铺', type: 'select', subTitle: '店铺', api: 'queryShop', params: {}, keys: ['shopID', 'shopName'],
            urlTpl: 'shop/shop.htm?t=0&i={{arg1}}&sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '5', title: '店铺外卖搜索网页' , type: 'select', subTitle: '城市', api: 'getCities', params: { isActive: 1 }, keys: ['cityID', 'cityName'], firstItem: {cityID: '0', cityName: '附近' },
            urlTpl: 'shop/takeaway.htm?{{arg2}}&sc=wechat&mpid=${mpID}&g={{g}}&' },
            { value: '6', title: '外卖自提具体店铺', type: 'select', subTitle: '店铺', api: 'queryShop', params: {}, keys: ['shopID', 'shopName'],
            urlTpl: 'shop/shop.htm?t=1&i={{arg1}}&sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '7', title: '附近店铺',
            urlTpl: 'shop/near.htm' },
            { value: '8', title: '(新)成为会员',
            urlTpl: 'crm/vip_details.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '9', title: '(新)我的会员卡',
            urlTpl: 'crm/vip_details.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '10', title: '成为会员',
            urlTpl: 'vip/register.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '11', title: '我的会员卡',
            urlTpl: 'vip/main.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '12', title: '我的代金券',
            urlTpl: 'user/event.htm?sc=wechat&mpid=${mpID}' },
            { value: '13', title: '我的订单页',
            urlTpl: 'user/order.htm?sc=wechat&mpid=${mpID}' },
            { value: '14', title: '我的账户',
            urlTpl: 'user/user.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '15', title: '会员活动列表',
            urlTpl: 'vip/intro.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '16', title: '会员具体活动', type: 'select', subTitle: '会员活动', api: 'getCrmEvents', params: {}, keys: ['eventIdWay', 'eventName'],
            urlTpl: 'vip/event{{arg3}}.htm?e={{arg1}}&sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '17', title: '用户活动', type: 'select', subTitle: '用户活动', api: 'getUserEvents', params: { eventStatus: 1 }, keys: ['eventItemID', 'eventSubjects'],
            urlTpl: 'events/event.htm?i={{arg1}}&sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '18', title: '用户反馈',
            urlTpl: 'user/feedback.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '19', title: '代金券交易', type: 'select', subTitle: '城市', api: 'getCities', params: { isActive: 1 }, keys: ['cityID', 'cityName'], firstItem: {cityID: '0', cityName: '附近' },
            urlTpl: 'voucher/list.htm?sc=wechat&mpid=${mpID}&g={{g}}&c={{arg1}}' },
            { value: '20', title: '排队取号搜索',
            urlTpl: 'table/near.htm?sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '21', title: '报名活动', type: 'select', subTitle: '用户活动', api: 'getUserEvents', params: { eventStatus: 1, gameWay: 20 }, keys: ['eventItemID', 'eventSubjects'],
            urlTpl: 'events/apply.htm?i={{arg1}}&sc=wechat&mpid=${mpID}&g={{g}}' },
            { value: '22', title: '自定义链接', type: 'input', subTitle: '内容',
            urlTpl: '{{arg1}}' }
        ];
    }
    
})(jQuery, window);










;(function ($, window) {
	IX.ns("Hualala.Weixin");
    var WX = Hualala.Weixin;
    
	/*微信管理模块子页面整体页面布局*/
	function initWeixinPageLayout (pageName, $body, subNavCfg) {
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.empty();
		$body.html('<div class="page-subnav clearfix" /><div class="page-body clearfix"></div>');
		var mapNavRenderData = function () {
			var navs = _.map(subNavCfg, function (v) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					return '';
				});
				return {
					active : pageName == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name || '',
					label : v.label || ''
				};
			});
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var $navbar = $body.find('.page-subnav');
		$navbar.html(navTpl(mapNavRenderData()));
	}
    
    var groupID, mpID, accounts;
    function renderWxAcountInfo($container, callback)
    {
        var sessionGroupID = Hualala.getSessionSite().groupID,
            U = Hualala.UI,
            $pageBody = $container.find('.page-body');
        if(groupID == sessionGroupID)
        {
            renderData(); return;
        }

        Hualala.Global.getWeixinAccounts({}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && U.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            
            accounts = _.map(rsp.data.records || [], function(record) {
                return { mpID: record.mpID, mpName: record.mpName };
            });
            groupID = sessionGroupID;
            if(accounts.length) mpID = accounts[0].mpID;
            
            renderData();
        });
        
        function renderData()
        {
            var $select = $('<div class="bs-callout weixin-brand"><select class="form-control" />微信公共账号</div>').insertAfter('.page-subnav').find('select');
            U.fillSelect($select, accounts, 'mpID', 'mpName', false).val(mpID).on('change', function()
            { 
                mpID = $(this).val();
                mpID && callback && callback($pageBody.empty(), mpID);
            });
            
            mpID && callback && callback($pageBody.empty(), mpID);
        }
    }
    
    function createResourceChosen($select, $resView, resources, cv, width)
    {
        var U = Hualala.UI, R = Hualala.PageRoute, 
            emotions = WX.getEmotions(),
            cfg = {width: '100%', matchField: 'resTitle'}, df = $.Deferred();
        
        function fn()
        {
            U.createChosen($select, resources, 'itemID', 'resName', cfg, false, cv || '')
            .on('change', function()
            {
                $resView.html(WX.createResourceView(_.findWhere(resources, { itemID: this.value }), emotions));
            }).change();
            df.resolve(resources);
        }
        
        if(width) cfg.width = width;
        if(resources && resources.length) fn();
        else Hualala.Global.getWeixinResources({isActive: 1, resType: '(0,1,2)'}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && U.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            resources = rsp.data.records || [];
            _.each(resources, function(item){ item.resName = (item.resType == '2' ? '(文本)' : '(图文)') + item.resTitle });
            if(!resources.length)
            {
                var $msg = $('<div>尚无可用素材资源，无法进行此操作！您可以先在<a href="" data-page="wxContent" />或者<a href="" data-page="wxText" />下添加一些素材资源。</div>');
                    $a = $msg.find('a').each(function()
                    {
                        var $this = $(this),
                            path = R.createPath($this.data('page')),
                            label = R.getPageContextByPath(path).label;
                        $this.attr('href', path).text(label);
                    }),
                    modal = U.Alert({msg: $msg});
                $a.on('click', function(){ modal.hide() });
                return;
            }
            fn();
        });
        return df.promise();
    }
    
    function parseEmotions(text, emotions)
    {
        var emotions = emotions || WX.getEmotions(),
            imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/group1/M00/00/',
            imgTpl = Handlebars.compile('<img src="{{url}}" alt="{{title}}" />');
        
        return text.replace(/\/[\u4E00-\u9FA5]+/g, function(match)
        {
            var eTitle = match.slice(1);
            for(var i = 0, em; em = emotions[i++];)
            {
                if(eTitle.indexOf(em.title) == 0) 
                    return eTitle.replace(em.title, imgTpl({url: imgHost + em.url, title: em.title}));
            }
                
            return match;
        });
    }
    
    function createResourceView(res, emotions, editing)
    {
        var resType = res.resType;
        if(resType == 2)
        {
            emotions = emotions || WX.getEmotions();
            return parseEmotions(res.resContent, emotions)
        };
        
        var itemID = res.itemID,
            resContent = $.parseJSON(res.resContent),
            $resWiew = $('<div>').attr('resid', itemID).addClass('res-view ' + (resType == 1 ? 'multi' : '')),
            resArr = resContent.resources || [],
            imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/';
        
        for(var i = 0, r; r = resArr[i]; i++)
        {
            var $resItem = $('<div>'),
                imgUrl = imgHost + r.imgPath + '?quality=70';
            if(resType == 0)
            {
                $resItem.addClass('res-single')
                .append($('<h4>').text(r.resTitle))
                .append(itemID ? $('<img>').attr('src', imgUrl) : '<div class="img">封面图片</div>')
                .append($('<p>').text(r.digest));
            }
            else if(i == 0)
            {
                $resItem.addClass('res-cover')
                .append(itemID ? $('<img>').attr('src', imgUrl) : '<div class="img">封面图片</div>')
                .append($('<h4>').text(r.resTitle));
                if(editing)
                    $resItem.addClass('active').append('<div class="res-mask"><i class="glyphicon glyphicon-pencil"></i></div>');
            }
            else
            {
                $resItem.addClass('res-sub')
                .append(itemID ? $('<img>').attr('src', imgUrl) : '<div class="img">缩略图</div>')
                .append($('<h6>').text(r.resTitle));
                if(editing)
                    $resItem.append('<div class="res-mask"><i class="glyphicon glyphicon-pencil" title="编辑"></i></div>');
            }
            $resWiew.append($resItem);
        }
        if(resType == 1 && editing)
            $resWiew.append('<div class="add-sub-res"><div><i class="glyphicon glyphicon-plus"></i></div></div>');
            
        return $resWiew;
    }
    
    function createLinkSelector($selectWrap, $contentWrap, dataHolder, linkID, linkCont)
    {
        var that = createLinkSelector,
            linkTypes = that.linkTypes || WX.getLinkTypes();
            
        dataHolder = dataHolder || {};
        that.linkTypes = linkTypes;
        linkID = linkID || 1;
        linkCont = linkCont || '';
        
        that.renderLinkContent = that.renderLinkContent ||
        function(linkInfo, $contentWrap, dataHolder, linkCont)
        {
            var U = Hualala.UI,
                $linkName = $contentWrap.find('.link-name'),
                $linkContent = $contentWrap.find('.link-content'),
                subTitle = linkInfo.subTitle,
                type = linkInfo.type;
                
            $contentWrap.toggleClass('hidden', !type);
            $linkName.text('链接' + subTitle);
            $linkContent.html(type ? type == 'select' ? 
            '<select class="form-control">' 
            : '<input class="form-control" placeholder="完整URL，如：http://m.hualala.com">'
            : '');
            
            if(type == 'input') $linkContent.find('input').val(linkCont);
            if(type != 'select') return;
            
            var api = linkInfo.api, data = dataHolder[api]
                keys = linkInfo.keys;
            Hualala.Common.loadData(api, linkInfo.params, data)
            .done(function(records)
            {
                records = records || [];
                if(!records.length)
                {
                    U.TopTip({msg: '获取' + subTitle + '信息为空！', type: 'warning'});
                    return;
                }
                if(!dataHolder[api])
                {
                    dataHolder[api] = _.map(records, function(record)
                    {
                        return api == 'getCrmEvents' ? {
                            eventIdWay: record.eventID + '-' + record.eventWay,
                            eventName: record.eventName,
                            py: record.py
                        } : _.pick(record, keys.concat(['py']));
                    });
                }
                
                var firstItem = linkInfo.firstItem || false;
                U.createChosen($linkContent.find('select'), 
                dataHolder[api], keys[0], keys[1], { width: '100%' }, firstItem, linkCont)
                .change();
                
            });
        }
        
        Hualala.UI.fillSelect($selectWrap.html('<select class="form-control"></select>').find('select'), 
        linkTypes, 'value', 'title', false).val(linkID)
        .on('change', function()
        {
            that.renderLinkContent(linkTypes[this.value - 1], $contentWrap, dataHolder, linkCont);
            linkCont = '';
        }).change();
    }
    
    function createQQEmotionPanel(emotions)
    {
        emotions = emotions || WX.getEmotions();
        var $ret = $('<ul></ul><div></div>'),
            $ul = $ret.filter('ul');
        for(var i = 0, em; em = emotions[i]; i++)
        {
            $('<li>').attr('title', em.title).data('url', em.url)
            .append($('<i>').css('background-position', -i * 24 +'px 0'))
            .appendTo($ul);
        }
        
        return $ret;
    }
    
    function createWeixinUrl(linkType, param)
    {
        var groupID = Hualala.getSessionSite().groupID,
            chref = location.href,
            env = chref.indexOf('mu.dianpu') > -1 ? 'mu.' :
                  chref.indexOf('dohko.dianpu') > -1 ? 'dohko.' : '',
            urlHost = 'http://' + env + 'm.hualala.com/',
            linkTypes = createLinkSelector.linkTypes || WX.getLinkTypes(),
            urlTpl = Handlebars.compile(linkTypes[linkType - 1].urlTpl),
            args = { arg1: param, g: groupID };
            
        if(linkType == 3 || linkType == 5) 
            args.arg2 = param == 0 ? 't=near' : 'c=' + param;
        else if(linkType == 16) 
        {
            var _args = param.split('-'),
                eventID = _args[0],
                eventWay = _args[1];
            args.arg1 = eventID;
            args.arg3 = eventWay == 20 ? '_turntable' : '';
        }
        
        var urlPart = urlTpl(args);
        
        return linkType == 22 ? urlPart : urlHost + urlPart;
    }
    
    function extendUM(emotions, dataHolder)
    {
        emotions && UM.registerUI( 'qqemotion', function(name)
        {
            var me = this;
            var $btn = $.eduibutton({ icon: 'emotion', title: '表情' });
            var edui = $.eduipopup().css('zIndex',me.options.zIndex + 1)
                .addClass('edui-popup-' + name).edui();
            var $popupBody = edui.getBodyContainer()
                    .html(createQQEmotionPanel(emotions))
                    .on('click', function(){ return false; }),
                $preview = $popupBody.find('div'),
                imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/group1/M00/00/';
            $popupBody.on('mouseenter', 'li', function()
            {
                var $li = $(this), url = $li.data('url');
                $preview.show().html($('<img>').attr('src', imgHost + url));
            })
            $popupBody.on('mouseleave', 'li', function()
            {
                $preview.hide();
            })
            .on('click', 'li', function()
            {
                var $li = $(this), url = $li.data('url'), title = $li.attr('title');
                //me.execCommand( 'insertimage', { src: imgHost + url, alt: title, 'class': 'qqemotion' });
                me.execCommand( 'inserthtml', '<img src="' + imgHost + url + '" alt="' + title + '" style="width: 24px; height: 24px" />');
                edui.hide();
            });
            
            edui.on('beforeshow',function()
            {
                var $root = this.root();
                if(!$root.parent().length)
                    me.$container.find('.edui-dialog-container').append($root);
                    
                $preview.empty();
                UM.setTopEditor(me);
            })
            .attachTo($btn, {offsetTop: -5, offsetLeft: 10, caretLeft: 11, caretTop: -8});
            
            me.addListener('selectionchange', function ()
            {
                var state = this.queryCommandState(name);
                $btn.edui().disabled(state == -1).active(state == 1);
            });
            
            return $btn;
        });
        
        dataHolder && UM.registerUI( 'wxlink', function(name)
        {
            var me = this;
                $btn = $.eduibutton({ icon: 'link', title: '链接' });
            var U = Hualala.UI,
                linkTpl = Hualala.TplLib.get('tpl_wx_txt_link');
            $btn.on('click', function()
            {
                var $link = $(linkTpl),
                    $selectWrap = $link.find('.link-select-wrap'),
                    $contentWrap = $link.find('.link-content-wrap'),
                    modal = new U.ModalDialog({title: '添加链接', html: $link}).show();
                
                createLinkSelector($selectWrap, $contentWrap, dataHolder);
                modal._.footer.find('.btn-ok').text('确定').on('click', function()
                {
                    var linkType = $selectWrap.find('select').val(),
                        linkCont = $contentWrap.find('select, input').val();
                    if(!linkType)
                    {
                        U.TopTip({msg: '请选择链接类型！', type: 'warning'});
                        return;
                    }
                    if(linkCont !== undefined && !linkCont)
                    {
                        U.TopTip({msg: '请选择或输入链接！', type: 'warning'});
                        return;
                    }
                    var url = createWeixinUrl(linkType, linkCont).replace(/^\s+|\s+$/g, '');
                    if(url) me.execCommand('link', {'href': url, '_href': url});
                    modal.hide();
                });
            });
            
            me.addListener('selectionchange', function ()
            {
                var state = this.queryCommandState(name);
                $btn.edui().disabled(state == -1).active(state == 1);
            });
            
            return $btn;
        });
        
        return ['source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
            'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize' ,
            '| justifyleft justifycenter justifyright justifyjustify |',
            'wxlink unlink | qqemotion image video  | map',
            '| horizontal print preview', 'drafts']; 
    }
    
    $.extend(WX, {
        createResourceChosen: createResourceChosen,
        parseEmotions: parseEmotions,
        createResourceView: createResourceView,
        createLinkSelector: createLinkSelector,
        extendUM: extendUM,
        //微信首页
        homeInit: function() { location.href = Hualala.PageRoute.createPath('wxReply')},
        //自动回复页面
        replyInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $body = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $body, Hualala.TypeDef.WeixinAdminSubNavType);
            renderWxAcountInfo($body, WX.initReply);
        },
        //订阅消息页面
        subscribeInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $body = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $body, Hualala.TypeDef.WeixinAdminSubNavType);
            renderWxAcountInfo($body, WX.initSubscribe);
        },
        //自定义微信菜单页面
        menuInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $body = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $body, Hualala.TypeDef.WeixinAdminSubNavType);
            renderWxAcountInfo($body, WX.initMenu);
        },
        //软文管理
        advertorialInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $container = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $container, Hualala.TypeDef.WeixinMaterialSubNavType);
            WX.initAdvertorial($container.find('.page-body'));
        },
        //软文管理
        contentInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $container = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $container, Hualala.TypeDef.WeixinMaterialSubNavType);
            WX.initContent($container.find('.page-body'));
        },
        //文本管理
        textInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $container = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $container, Hualala.TypeDef.WeixinMaterialSubNavType);
            WX.initText($container.find('.page-body'));
        }
        
    });

	

})(jQuery, window);






;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;

	var GiftMgrResultModel = Stapes.subclass({
		/**
		 * 构造礼品查询结果的数据模型
		 * @param  {object} cfg 配置信息
		 *          @param {Function} callServer 获取数据接口
		 *          @param {Array} queryKeys 搜索条件字段序列
		 *          @param {Boolean} hasPager 是否支持分页true：支持；false：不支持。default true
		 *          @param {String} gridType 结果数据表类型
		 *          
		 *          
		 * @return {[type]}     [description]
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
			}
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			this.pagerKeys = 'pageCount,totalSize,pageNo,pageSize'.split(',');
			this.queryParamsKeys = null;
			this.hasPager = $XP(cfg, 'hasPager', true);
			this.recordModel = $XP(cfg, 'recordModel', BaseGiftModel);
			this.gridType = $XP(cfg, 'gridType', '');
		}
	});

	GiftMgrResultModel.proto({
		init : function (params) {
			this.set(IX.inherit({
				ds_record : new IX.IListManager(),
				ds_items : new IX.IListManager(),
				ds_page : new IX.IListManager()
			}, this.hasPager ? {
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15)
			} : {}));
			this.queryParamsKeys = !this.hasPager ? this.queryKeys : this.queryKeys.concat(this.pagerKeys);
		},
		updatePagerParams : function (params) {
			var self = this;
			var queryParamsKeys = self.queryParamsKeys.join(',');
			_.each(params, function (v, k, l) {
				if (queryParamsKeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			var self = this;
			var ret = {};
			_.each(self.queryParamsKeys, function (k) {
				ret[k] = self.get(k);
			});
			return ret;
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				recordHT = self.get('ds_record'),
				pageHT = self.get('ds_page');
			pageNo = self.hasPager ? pageNo : 1;
			var recordIDs = _.map(data, function (r, i, l) {
				var id = pageNo + '_' + IX.id(),
					mRecord = new self.recordModel(IX.inherit(r, {
						'__id__' : id,
						'__gridtype__' : self.gridType
					}));
				recordHT.register(id, mRecord);
				return id;
			});
			pageHT.register(pageNo, recordIDs);
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.pageNo'));
					self.updatePagerParams($XP(res, 'data', {}));
					// self.updateItemDataStore($XP(res, 'data', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getRecordsByPageNo : function (pageNo) {
			var self = this,
				recordHT = self.get('ds_record'),
				pageHT = self.get('ds_page');
			pageNo = !self.hasPager ? 1 : pageNo;
			var ret = _.map(recordHT.getByKeys(pageHT.get(pageNo)), function (mRecord, i, l) {
				return mRecord.getAll();
			});
			IX.Debug.info("DEBUG: Query Result Model PageData");
			IX.Debug.info(ret);
			return ret;
		},
		getRecordModelByID : function (id) {
			var self = this,
				recordHT = self.get('ds_record');
			return recordHT.get(id);
		}

	});

	HMCM.GiftMgrResultModel = GiftMgrResultModel;

	/**
	 * 礼品模型
	 * 
	 * 
	 */
	var BaseGiftModel = Stapes.subclass({
		constructor : function (gift) {
			this.set(gift);
			this.bindEvent();
		}
	});
	BaseGiftModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({
				delete : function (params) {
					var giftItemID = $XP(params, 'itemID');
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.deleteMCMGift({
						giftItemID : giftItemID
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				createGift : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					// save tmp data in model
					self.set(post);
					// Post Model Data Set to Server
					IX.Debug.info("DEBUG: Gift Wizard Form Post Params:");
					IX.Debug.info(self.getAll());
					Hualala.Global.createMCMGift(self.getAll(), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							failFn(res);
						}
					});
				},
				editGift : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					// save tmp data in model
					self.set(post);
					// Post Model Data Set to Server
					IX.Debug.info("DEBUG: Gift Wizard Form Post Params:");
					IX.Debug.info(self.getAll());
					Hualala.Global.editMCMGift(self.getAll(), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							failFn(res);
						}
					});
				},
				saveCache : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					successFn(self);
				},
				bindShops : function (params) {
					var cities = $XP(params, 'cities', []),
						shops = $XP(params, 'shops', []);
					var shopIDs = _.pluck(shops, 'shopID'),
						shopNames = _.pluck(shops, 'shopName'),
						usingCityIDs = _.pluck(cities, 'cityID');
					this.set({
						shopIDs : shopIDs.join(';'),
						shopNames : shopNames.join(';'),
						usingCityIDs : usingCityIDs.join(';')
					});
				}
			}, this);
		}
	});
	HMCM.BaseGiftModel = BaseGiftModel;

	/**
	 * 活动模型
	 * 
	 * 
	 */
	var BaseEventModel = Stapes.subclass({
		constructor : function (evt) {
			self.CardLevelIDSet = null;
			this.set(evt);
			this.bindEvent();
		}
	});
	BaseEventModel.proto({
		getEventCardSet : function () {
			var self = this;
			var eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
			var eventCardSet = _.find(eventTypes, function (el) {
				return $XP(el, 'value') == self.get('eventWay');
			});
			return eventCardSet;
		},
		getEventCardClz : function () {
			var self = this;
			var eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
			var eventTypeSet = _.find(eventTypes, function (el) {
				return $XP(el, 'value') == self.get('eventWay');
			});
			return $XP(eventTypeSet, 'type', '');
		},
		bindEvent : function () {
			var self = this;
			self.on({
				delete : function (params) {
					var eventID = $XP(params, 'itemID');
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.deleteMCMEvent({
						eventID : eventID
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				switchEvent : function (params) {
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.switchMCMEvent(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				update : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.getMCMEventByID({
						eventID : self.get('eventID')
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var d = $XP(res, 'data.records')[0];
							self.set(d);
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				saveCache : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					successFn(self);
				},
				loadCardLevelIDs : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.getVipLevels({}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							self.CardLevelIDSet = $XP(res, 'data.records', []);
							successFn(res);
						} else {
							self.CardLevelIDSet = null;
							faildFn(res);
						}
					});
				},
				createEvent : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.createEvent($XP(params, 'params'), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var d = $XP(res, 'data');
							self.set(d);
							successFn(res);
						} else {
							faildFn(res);
						}
					});

				},
				editEvent : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					var setData = self.getAll();
					Hualala.Global.editEvent(IX.inherit(setData, $XP(params, 'params')), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var d = $XP(res, 'data');
							self.set(d);
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				}
			}, this);
		}
	});
	HMCM.BaseEventModel = BaseEventModel;
})(jQuery, window);
































;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var MCMGiftListHeaderCfg = [
		{key : "giftType", clz : "", label : "礼品类型"},
		{key : "giftName", clz : "text", label : "礼品名称"},
		{key : "createTime", clz : "date", label : "创建时间"},
		{key : "createBy", clz : "text", label : "创建人"},
		{key : "rowControl", clz : "", label : "操作"}
	];

	var MCMEventListHeaderCfg = [
		// 活动类型|活动名称|人气|活动日期|创建人|活动开关|操作
		{key : "eventWay", clz : "eventWay", label : "活动类型"},
		{key : "eventName", clz : "text", label : "活动名称"},
		{key : "userCount", clz : "num", label : "人气"},
		{key : "eventStartDate", clz : "date", label : "活动日期"},
		{key : "operator", clz : "text", label : "创建人"},
		{key : "isActive", clz : "", label : "活动开关"},
		{key : "rowControl", clz : "ctrlrow", label : "操作"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
			queryKeys = self.model.queryKeys;
		var r = {value : "", text : ""}, v = $XP(row, colKey, '');
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			// 礼品列表各列参数
			case "giftType":
				var giftCardTpl = self.get('giftCardTpl'),
					giftValue = $XP(row, 'giftValue', 0),
					giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes,
					giftType = _.find(giftTypes, function (el) {return $XP(el, 'value') == v;});
				// if (pageName == 'mcmGiftsMgr') {
					var card = giftCardTpl({
						clz : $XP(giftType, 'type', ''),
						label : giftValue,
						unit : $XP(giftType, 'unit', '')
					});
					r.value = v;
					r.text = card;
					r.colspan = 1;
					r.rowspan = 2;
				// }
				

				break;
			// case "giftName":
			// 	r.value = v;
			// 	r.text = v;
			// 	break;
			case "createTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "createBy":
				var userInfo = !IX.isEmpty(v) && IX.isString(v) ? JSON.parse(v) : {};
				r.value = $XP(userInfo, 'userID', '');
				r.text = $XP(userInfo, 'userName', '') + '<br/>' + $XP(userInfo, 'userMobile', '');
				break;
			// 活动列表各列参数
			case "eventWay":
				var eventCardTpl = self.get('eventCardTpl'),
					eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes,
					eventType = _.find(eventTypes, function (el) {return $XP(el, 'value') == v;}),
					label = $XP(eventType, 'label', '');
				if (pageName == 'mcmEventMgr') {
					var card = eventCardTpl({
						clz : $XP(row, 'isActive') != 0 ? $XP(eventType, 'type', '') : 'disable',
						label : label
					});
					r.value = v;
					r.text = card;
					r.colspan = 1;
					r.rowspan = 1;
				}
				break;
			case "eventStartDate":
				r.value = v;
				var start = v, end = $XP(row, 'eventEndDate', '');
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(start), 'yyyy/MM/dd')
					+ '至'
					+ IX.Date.getDateByFormat(formatDateTimeValue(end), 'yyyy/MM/dd');
				break;
			case "operator":
				var userInfo = !IX.isEmpty(v) && IX.isString(v) ? JSON.parse(v) : {};
				r.value = $XP(userInfo, 'userID', '');
				r.text = $XP(userInfo, 'userName', '') + '<br/>' + $XP(userInfo, 'userMobile', '');
				break;
			case "isActive":
				var eventID = $XP(row, 'isActive', 0);
				r.value = v;
				r.text = '<input type="checkbox" name="switch_event" data-event-id="' + eventID + '" ' 
					+ (v != 0 ? 'checked ' : '') + ' data-key="' + $XP(row, '__id__', '') + '" ' + ' />';
				break;
			case "rowControl":
				if (pageName == 'mcmGiftsMgr') {
					r = {
						type : 'button',
						rowspan : 2,
						colspan : 1,
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link edit-gift',
								id : $XP(row, 'giftItemID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link delete-gift',
								id : $XP(row, 'giftItemID', ''),
								key : $XP(row, '__id__'),
								type : 'delete'
							},
							{
								label : '使用详情',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link detail-gift',
								id : $XP(row, 'giftItemID', ''),
								key : $XP(row, '__id__'),
								type : 'detail'
							}
						]
					};
				}
				if (pageName == 'mcmEventMgr') {
					var isActive = $XP(row, 'isActive', 0);
					r = {
						type : 'button',
						rowspan : 1,
						colspan : 1,
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link edit-event ' + (isActive != 0 ? 'hidden' : ''),
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link delete-event ' + (isActive != 0 ? 'hidden' : ''),
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__'),
								type : 'delete'
							},
							{
								label : '查看',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link detail-event',
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__'),
								type : 'detail'
							},
							{
								label : '活动跟踪',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link track-event ' + (isActive != 0 ? '' : 'hidden'),
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__'),
								type : 'track'
							}
						]
					};
				}
				break; 
			default :
				r.value = r.text = $XP(row, colKey, '');
				break;
		}
		return r;
	};

	/**
	 * 格式化礼品列表渲染结果数据
	 * @param  {[Array|Object]} records 搜索结果数据
	 * @return {[Array|Object]}         格式化后的渲染数据
	 */
	HMCM.mapGiftsQueryResultRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		var clz = "col-md-12",
			tblClz = "  table-hover mcm-grid",
			tblHeaders = MCMGiftListHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			if (pageName == 'mcmGiftsMgr') {
				var giftRule = {
					subRows : [{
						clz : 'gift-rule',
						cols : [{
							clz : '',
							colspan : 3,
							rowspan : 1,
							html : '礼品规则：'
						}]
					}]
				};
				rowSet = IX.inherit(rowSet, giftRule);
			}
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

	/**
	 * 格式化活动列表渲染结果数据
	 * @param  {[type]} records [description]
	 * @return {[type]}         [description]
	 */
	HMCM.mapEventsQueryResultRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		var clz = "col-md-12",
			tblClz = "  table-hover mcm-grid",
			tblHeaders = MCMEventListHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

	/**
	 * 为礼品列表搜索结果数据表绑定事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleGiftsQueryResultEvent = function () {
		var self = this;
		self.$result.on('click', '.btn-link', function (e) {
			var $btn = $(this),
				act = $btn.attr('data-type'),
				giftItemID = $btn.attr('data-id'),
				id = $btn.attr('data-key');
			var giftModel = self.model.getRecordModelByID(id);
			switch (act) {
				case 'edit':
				// TODO edit gift set
					var wizardPanel = new Hualala.MCM.MCMWizardModal({
						parentView : self,
						mode : 'edit',
						successFn : function () {

						},
						failFn : function () {

						},
						model : giftModel,
						modalClz : 'mcm-gift-modal',
						wizardClz : 'mcm-gift-wizard',
						modalTitle : '编辑礼品',
						onWizardInit : function ($cnt, cntID, wizardMode) {
							HMCM.initGiftBaseInfoStep.call(this, $cnt, cntID, wizardMode);
						},
						onStepCommit : function (curID) {
							Hualala.MCM.onGiftWizardStepCommit.call(this, curID);
						},
						onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
							Hualala.MCM.onGiftWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
						},
						bundleWizardEvent : function () {
							Hualala.MCM.bundleGiftWizardEvent.call(this);
						},
						wizardStepsCfg : Hualala.MCM.GiftWizardCfg,
						wizardCtrls : Hualala.MCM.WizardCtrls

					});
					break;
				case 'delete':
				// TODO delete gift set
					self.emit('deleteItem', {
						id : id,
						key : giftItemID,
						successFn : function (res) {
							toptip({
								msg : '删除成功',
								type : 'success'
							});
							var $tr = $btn.parents('tr'),
								$ruleRow = $tr.next('.gift-rule');
							$tr.remove();
							$ruleRow.remove();
						},
						faildFn : function (res) {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						}
					});
					break;
				case 'detail':
				// TODO preview gift detail
					var path = Hualala.PageRoute.createPath('mcmGiftDetail', [giftItemID]);
					Hualala.PageRoute.jumpPage(path);
					break;
			}
		});
		self.$result.on('mouseover', 'tr.gift-rule', function (e) {
			var $row = $(this);
			$row.prev('tr').addClass('hover');
		}).on('mouseout', 'tr.gift-rule', function (e) {
			var $row = $(this);
			$row.prev('tr').removeClass('hover');
		});
	};

	/**
	 * 为活动列表搜索结果数据表绑定事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleEventsQueryResultEvent = function () {
		var self = this;
		self.$result.on('click', '.btn-link', function (e) {
			var $btn = $(this),
				act = $btn.attr('data-type'),
				eventID = $btn.attr('data-id'),
				id = $btn.attr('data-key');
			var eventModel = self.model.getRecordModelByID(id);
			switch(act) {
				case 'edit' :
				// TODO edit event config set
					var wizardPanel = new Hualala.MCM.MCMWizardModal({
						parentView : self,
						mode : 'edit',
						successFn : function () {

						},
						failFn : function () {

						},
						model : eventModel,
						modalClz : 'mcm-event-modal',
						wizardClz : 'mcm-event-wizard',
						modalTitle : '创建活动',
						onWizardInit : function ($cnt, cntID, wizardMode) {
							Hualala.MCM.initEventBaseInfoStep.call(this, $cnt, cntID, wizardMode);
						},
						onStepCommit : function (curID) {
							Hualala.MCM.onEventWizardStepCommit.call(this, curID);
						},
						onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
							Hualala.MCM.onEventWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
						},
						bundleWizardEvent : function () {
							Hualala.MCM.bundleEventWizardEvent.call(this);
						},
						wizardStepsCfg : Hualala.MCM.EventWizardCfg,
						wizardCtrls : Hualala.MCM.WizardCtrls

					});
					break;
				case 'delete' :
				// delete event
					self.emit('deleteItem', {
						id : id,
						key : eventID,
						successFn : function (res) {
							toptip({
								msg : '删除成功',
								type : 'success'
							});
							var $tr = $btn.parents('tr');
							$tr.remove();
						},
						faildFn : function (res) {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						}
					});
					break;
				case 'detail' :
				// TODO show event detail 
					initEventDetailModal.call(self, $btn);
					break;
				case 'track':
				// TODO track event info
					var path = Hualala.PageRoute.createPath('mcmEventTrack', [eventID]);
					Hualala.PageRoute.jumpPage(path);
					break;
			}
		});
	};


	/**
	 * 渲染搜索结果方法
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	HMCM.renderQueryResult = function (data) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		self.$result.empty();
		self.$result.html(self.get('resultTpl')(data));
		if (pageName == 'mcmEventMgr') {
			var $checkbox = self.$result.find(':checkbox[name=switch_event]');
			initEventSwitcher.call(self, $checkbox);
			
		}
	};

	/**
	 * 切换活动卡片状态
	 * @param  {[jQueryObj]}  $chkbox  开关
	 * @param  {Boolean} isActive 开关状态
	 * @return {[type]}           [description]
	 */
	var switchEventCardLayout = function ($chkbox, isActive) {
		var self = this;
		var key = $chkbox.attr('data-key');
		var itemModel = self.model.getRecordModelByID(key);
		var clz = itemModel.getEventCardClz();
		var $tr = $chkbox.parents('tr'),
			$col = $tr.find('.eventWay');
		$col.find('.event-card').removeClass(isActive != 0 ? 'disable' : clz).addClass(isActive != 0 ? clz : 'disable');
	};

	/**
	 * 切换活动列表控制按钮列状态
	 * @param  {[jQueryOBj]}  $chkbox  开关
	 * @param  {Boolean} isActive 开关状态
	 * @return {[type]}           [description]
	 */
	var switchEventCtrlRow = function ($chkbox, isActive) {
		var self = this;
		var $tr = $chkbox.parents('tr'),
			$col = $tr.find('.ctrlrow');
		$col.find('.edit-event, .delete-event').addClass('hidden');
		$col.find('.track-event').removeClass('hidden');
	};

	/**
	 * 组装活动详渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventDetailRenderData = function (model) {
		var self = this;
		
		var mapCardData = function () {
			var eventCardSet = model.getEventCardSet();
			return {
				card : {
					clz : $XP(eventCardSet, 'type', ''),
					label : $XP(eventCardSet, 'label', '')
				}
			};
		};
		var mapBaseInfoData = function () {
			var keys = 'eventName,cardLevelLabel,eventRemark,deductPoints,sendPoints,eventRules'.split(',');
			var ret = {};
			_.each(keys, function (k) {
				switch (k) {
					case 'cardLevelLabel':
						ret[k] = model.get('cardLevelID');
						break;
					case 'deductPoints':
					case 'sendPoints':
						ret[k] = parseInt(model.get(k));
						break;
					default :
						ret[k] = model.get(k);
						break;
				}
			});
			return IX.inherit(ret, {
				infoLabelClz : 'col-sm-3'
			});
		};
		var mapGiftsData = function () {
			var giftKeys = 'EGiftID,EGiftName,EGiftOdds,EgiftSendCount,EGiftSingleCount,EGiftTotalCount,EGiftEffectTimeHours,EGiftValidUnitDayCount'.split(',');
			var mainKey = 'EGiftID';
			var giftLevelCount = 0;
			var data = model.getAll();
			var gifts = [];
			_.each(data, function (v, k) {
				if (k.indexOf(mainKey) == 0) {
					giftLevelCount++;
				}
			});
			for (var i = 1; i <= giftLevelCount; i++) {
				var gift = {};
				var vals = _.map(giftKeys, function (_k) {
					return model.get(_k + '_' + i);
				});
				var r = _.object(giftKeys, vals);
				r = IX.inherit(r, {
					level : i + '等奖',
					surplusCount : parseInt($XP(r, 'EGiftTotalCount', 0)) - parseInt(r, 'EgiftSendCount', 0)
				});
				gifts.push(r);
			}
			gifts = _.reject(gifts, function (el) {return $XP(el, mainKey) != 0;})
			return {
				colCount : giftKeys.length,
				giftItems : gifts,
				hasGifts : gifts.length > 0 ? true : false
			};
		};
		return IX.inherit(mapBaseInfoData(), mapCardData(), mapGiftsData());
	};

	HMCM.mapEventDetailRenderData = mapEventDetailRenderData;

	/**
	 * 查看活动详情窗口
	 * @param  {[type]} $btn [description]
	 * @return {[type]}      [description]
	 */
	var initEventDetailModal = function ($btn) {
		var self = this;
		var eventID = $btn.attr('data-id'),
			key = $btn.attr('data-key');
		var itemModel = self.model.getRecordModelByID(key);
		var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_event_detail')),
			btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
		Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_event_card'));
		var modal = new Hualala.UI.ModalDialog({
			id : 'event_detail',
			clz : 'evtdetail-modal',
			title : '活动详情',
			afterRemove : function () {

			}
		});
		modal._.footer.html(btnTpl({
			btns : [
				{clz : 'btn-default', name : 'cancel', label : '关闭'}
			]
		}));
		modal._.footer.find('.btn-default').attr('data-dismiss', 'modal');

		itemModel.emit('update', {
			successFn : function (res) {
				var renderData = mapEventDetailRenderData.call(self, itemModel);
				var $detail = $(layoutTpl(renderData));
				modal._.body.append($detail);
				modal.show();
			},
			faildFn : function (res) {
				toptip({
					msg : $XP(res, 'resultmsg', ''),
					type : 'danger'
				});
			}
		});
	};

	var initEventSwitcher = function ($checkbox) {
		var self = this;
		$checkbox.each(function () {
			var $el = $(this),
				onLabel = '已启用',
				offLabel = '未启用';
			$el.bootstrapSwitch({
				size : 'normal',
				onColor : 'primary',
				offColor : 'default',
				onText : onLabel,
				offText : offLabel
			}).on('switchChange.bootstrapSwitch', function (e, state) {
				var $el = $(this);
				var eventID = $el.attr('data-event-id'),
					key = $el.attr('data-key');
				self.emit('switchEvent', {
					eventID : eventID,
					isActive : +state,
					key : key,
					successFn : function (res) {
						toptip({
							msg : (!+state ? '关闭' : '开启') + '活动成功',
							type : 'success'
						});
						switchEventCardLayout.call(self, $el, +state);
						switchEventCtrlRow.call(self, $el, +state);
					},
					faildFn : function (res) {
						$el.bootstrapSwitch('toggleState', true);
						toptip({
							msg : $XP(res, 'resultmsg', ''),
							type : 'danger'
						});
					}
				});
			});
		});
	};

	var QueryResultView = Stapes.subclass({
		/**
		 * 构造礼品管理列表View层
		 * 
		 * 
		 * @param  {[Object]} cfg 
		 *         @param {Function} mapResultRenderData 格式化渲染数据
		 *         @param {Function} renderResult 渲染方法
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.$container = null;
			this.$resultBox = null;
			this.$result = null;
			this.$pager = null;
			this.set('mapResultRenderData', $XF(cfg, 'mapResultRenderData'));
			this.set('renderResult', $XF(cfg, 'renderResult'));
			this.set('bundleEvent', $XF(cfg, 'bundleEvent'));
			this.loadTemplate();
		}
	});

	QueryResultView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("Query Result View Init Faild!");
				return;
			}
			this.initLayout();
		},
		loadTemplate : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid')),
				giftCardTpl = Handlebars.compile(Hualala.TplLib.get('tpl_gift_card')),
				eventCardTpl = Handlebars.compile(Hualala.TplLib.get('tpl_event_card'));
			Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				resultTpl : resultTpl,
				giftCardTpl : giftCardTpl,
				eventCardTpl : eventCardTpl
			});
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$result = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
		},
		initPager : function (params) {
			var self = this;
			if (!self.model.hasPager) return;
			var baseCfg = {total : 0, page : 1, maxVisible : 10, leaps : true};
			this.$pager.IXPager(IX.inherit(baseCfg, params));
		},
		mapRenderData : function (records) {
			var mapFn = this.get('mapResultRenderData');
			var ret = IX.isFn(mapFn) ? mapFn.apply(this, arguments) : null;
			return ret;
		},
		renderRecords : function (data) {
			var renderFn = this.get('renderResult');
			IX.isFn(renderFn) && renderFn.apply(this, arguments);
		},
		render : function () {
			var self = this,
				model = self.model,
				hasPager = model.hasPager,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo', 1);
			var records = model.getRecordsByPageNo(pageNo);
			var renderData = self.mapRenderData(records);
			self.renderRecords(renderData);
			hasPager && self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		},
		bindEvent : function () {
			var self = this;
			var bundleEvent = this.get('bundleEvent');
			IX.isFn(bundleEvent) && bundleEvent.apply(this, arguments);
			self.model.hasPager && self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
		}
	});

	HMCM.QueryResultView = QueryResultView;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var LoadingModal = Hualala.UI.LoadingModal;
	var HMCM = Hualala.MCM;
	var QueryResultControler = Stapes.subclass({
		/**
		 * 构造礼品搜索结果控制器
		 * @param  {Object} cfg 
		 *         @param {Object} view View层实例
		 *         @param {Object} model Model层实例
		 *         @param {jQuery Obj} container 容器
		 * @return {[type]}     [description]
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.view || !this.model || !this.container) {
				throw("Query Result init faild!");
			}
			this.isReady = false;
			this.bindEvent();
			this.bindModelEvent();
			this.bindViewEvent();
		}
	});

	QueryResultControler.proto({
		init : function (params) {
			this.model.init(params);
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.loadingModal = new LoadingModal({
				start : 100
			});
			this.isReady = true;
		},
		hasReady : function () {return this.isReady;},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					// self.model.emit('load', $XP(params, 'params', {}));
					self.model.emit('load', params);
				}
			}, this);
			
			
		},
		bindModelEvent : function () {
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						self.loadingModal.hide();
					};
					self.loadingModal.show();
					self.model.load(params, cbFn);
				}
			}, this);
		},
		bindViewEvent : function () {
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				},
				deleteItem : function (params) {
					var self = this;
					var id = $XP(params, 'id'),
						key = $XP(params, 'key'),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					var itemModel = self.model.getRecordModelByID(id);
					itemModel.emit('delete', {
						itemID : key,
						successFn : function (res) {
							successFn(res);
						},
						faildFn : function (res) {
							faildFn(res);
						}
					});
				},
				switchEvent : function (params) {
					var self = this;
					var post = _.pick(params, 'eventID', 'isActive');
					var key = $XP(params, 'key');
					var itemModel = self.model.getRecordModelByID(key);
					itemModel.emit('switchEvent', {
						post : post,
						successFn : $XF(params, 'successFn'),
						faildFn : $XF(params, 'faildFn')
					});
				}
			}, this);
		}

	});

	HMCM.QueryResultControler = QueryResultControler;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip; 

	var QueryModel = Hualala.Shop.QueryModel.subclass({
		constructor : function (cfg) {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			// 数据是否已经加载完毕
			this.isReady = false;
			this.callServer = Hualala.Global.getShopQuerySchema;
		}
	});
	QueryModel.proto({
		getQueryParams : function () {
			var self = this;
			var vals = _.map(self.queryKeys, function (k) {
				return self.get(k);
			});
			var params = _.object(self.queryKeys, vals);
			IX.Debug.info("DEBUG: Order Query Model Query Params:");
			IX.Debug.info(params);
			return params;
		}
	});
	Hualala.MCM.QueryModel = QueryModel;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	/**
	 * MCM搜索标点参数
	 * 
	 * @type {Object}
	 */
	Hualala.MCM.QueryFormKeys = {
		GiftMgrQueryKeys : ['giftName', 'giftType'],
		GiftSendStatisticQueryKeys : ['startTime', 'endTime', 'getWay', 'giftStatus', 'giftItemID'],
		GiftUsedStatisticQueryKeys : ['startTime', 'endTime', 'usingShopID', 'giftItemID'],
		EventMgrQueryKeys : ['eventName', 'eventWay', 'isActive', 'eventStartDate', 'eventEndDate'],
		EventTrackBaseQueryKeys : ['eventID', 'keyword', 'cardLevelID']
	};

	/**
	 * 查询条件表单元素配置
	 */
	Hualala.MCM.QueryFormElsCfg = {
		// 礼品列表搜索栏
		giftName : {
			type : 'text',
			label : '礼品名称',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		giftType : {
			type : 'combo',
			label : '礼品类型',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		search : {
			type : 'button',
			clz : 'btn btn-warning',
			label : '查询'
		},
		addGift : {
			type : 'button',
			clz : 'btn btn-warning',
			label : '添加礼品'
		},

		// 礼品详情->发送数统计
		giftItemID : {
			type : 'hidden',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		timeRange : {
			type : 'section',
			label : '发出时间',
			min : {
				type : 'datetimepicker',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		getWay : {
			type : 'combo',
			label : '发出方式',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		giftStatus : {
			type : 'combo',
			label : '状态',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		usingShopID : {
			type : 'combo',
			label : '适用店铺',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},

		// 活动列表搜索栏
		eventName : {
			type : 'text',
			label : '活动名称',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		eventWay : {
			type : 'combo',
			label : '活动类型',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		isActive : {
			type : 'combo',
			label : '活动状态',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		eventTime : {
			type : 'section',
			label : '起止日期',
			min : {
				type : 'datetimepicker',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		addEvent : {
			type : 'button',
			clz : 'btn btn-warning',
			label : '添加活动'
		},
		winFlag : {
			type : 'combo',
			label : "中奖情况",
			defaultVal : "",
			validCfg : {
				validators : {}
			}
		},
		eventID : {
			type : 'hidden',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		keyword : {
			type : 'text',
			label : '关键字',
			defaultVal : "",
			validCfg : {
				validators : {}
			}
		},
		cardLevelID : {
			type : 'combo',
			label : '会员等级',
			defaultVal : "-1",
			validCfg : {
				validators : {}
			}
		}
	};
	var QueryFormElsHT = new IX.IListManager();
	_.each(Hualala.MCM.QueryFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-4 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k == 'eventTime' ? 'eventStartDate' : 'startTime',
				maxName = k == 'eventTime' ? 'eventEndDate' : 'endTime',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-4'
				}),
				max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-4'
				});
			QueryFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : 'col-xs-2 col-sm-2 col-md-2 control-label',
				min : min,
				max : max
			}));
		} else {
			QueryFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz
			}, $XP(el, 'type') != 'button' ? {clz : 'col-xs-8 col-sm-8 col-md-8'} : null));
		}
	});

	Hualala.MCM.bundleGiftsQueryEvent = function () {
		var self = this;
		self.$queryBox.on('click', '.btn', function (e) {
			var act = $(this).attr('name');
			if (act == 'addGift') {
				// TODO Add Gift
				var wizardPanel = new Hualala.MCM.MCMWizardModal({
					parentView : self,
					mode : 'create',
					successFn : function () {

					},
					failFn : function () {

					},
					model : new Hualala.MCM.BaseGiftModel(),
					modalClz : 'mcm-gift-modal',
					wizardClz : 'mcm-gift-wizard',
					modalTitle : '创建礼品',
					onWizardInit : function ($cnt, cntID, wizardMode) {
						Hualala.MCM.initGiftBaseInfoStep.call(this, $cnt, cntID, wizardMode);
					},
					onStepCommit : function (curID) {
						Hualala.MCM.onGiftWizardStepCommit.call(this, curID);
					},
					onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
						Hualala.MCM.onGiftWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
					},
					bundleWizardEvent : function () {
						Hualala.MCM.bundleGiftWizardEvent.call(this);
					},
					wizardStepsCfg : Hualala.MCM.GiftWizardCfg,
					wizardCtrls : Hualala.MCM.WizardCtrls

				});
			} else if (act == 'search') {
				self.emit('query', self.getQueryParams());
			}
		});
	};

	Hualala.MCM.bundleEventsQueryEvent = function () {
		var self = this;
		self.$queryBox.on('click', '.btn', function (e) {
			var act = $(this).attr('name');
			if (act == 'addEvent') {
				// TODO Add Event
				var wizardPanel = new Hualala.MCM.MCMWizardModal({
					parentView : self,
					mode : 'create',
					successFn : function () {

					},
					failFn : function () {

					},
					model : new Hualala.MCM.BaseEventModel(),
					modalClz : 'mcm-event-modal',
					wizardClz : 'mcm-event-wizard',
					modalTitle : '创建活动',
					onWizardInit : function ($cnt, cntID, wizardMode) {
						Hualala.MCM.initEventBaseInfoStep.call(this, $cnt, cntID, wizardMode);
					},
					onStepCommit : function (curID) {
						Hualala.MCM.onEventWizardStepCommit.call(this, curID);
					},
					onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
						Hualala.MCM.onEventWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
					},
					bundleWizardEvent : function () {
						Hualala.MCM.bundleEventWizardEvent.call(this);
					},
					wizardStepsCfg : Hualala.MCM.EventWizardCfg,
					wizardCtrls : Hualala.MCM.WizardCtrls

				});

			} else if (act == 'search') {
				self.emit('query', self.getQueryParams());
			}
		});
	};
	/**
	 * 格式化礼品管理页,搜索栏表单元素
	 * @return {Object} 渲染表单的数据
	 */
	Hualala.MCM.mapGiftQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['giftName'])
				},
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['giftType'])
				},
				{
					colClz : 'col-md-2',
					items : QueryFormElsHT.getByKeys(['search'])
				},
				{
					colClz : 'col-md-2 ' + (self.hasAddBtn ? '' : 'hidden'),
					items : QueryFormElsHT.getByKeys(['addGift'])
				}
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapEventQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['eventName'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['eventWay'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['isActive'])
				},
				{
					colClz : 'col-md-6',
					items : QueryFormElsHT.getByKeys(['eventTime'])
				},
				{
					colClz : 'col-md-offset-2 col-md-2',
					items : QueryFormElsHT.getByKeys(['search'])
				},
				{
					colClz : 'col-md-2',
					items : QueryFormElsHT.getByKeys(['addEvent'])
				},
				
				
				
				
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapGiftDetailGetWayQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['timeRange'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['getWay'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['giftStatus'])
				},
				{
					colClz : 'col-md-2',
					items : QueryFormElsHT.getByKeys(['search', 'giftItemID'])
				}
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapGiftDetailUsedQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['timeRange'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['usingShopID'])
				},
				{
					colClz : 'col-md-offset-1 col-md-2',
					items : QueryFormElsHT.getByKeys(['search', 'giftItemID'])
				}
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapEventTrackQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var eventDetail = self.$container.data('eventDetail'),
			eventWay = $XP(eventDetail, 'eventWay');
		var query = {
			cols : [
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['keyword'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['cardLevelID'])
				},
				{
					colClz : 'col-md-2',
					items : QueryFormElsHT.getByKeys(['search', 'eventID'])
				}
			]
		};
		if (eventWay == '20' || eventWay == '22') {
			query = {
				cols : [
					{
						colClz : 'col-md-4',
						items : QueryFormElsHT.getByKeys(['keyword'])
					},
					{
						colClz : 'col-md-3',
						items : QueryFormElsHT.getByKeys(['cardLevelID'])
					},
					{
						colClz : 'col-md-3',
						items : QueryFormElsHT.getByKeys(['winFlag'])
					},
					{
						colClz : 'col-md-2',
						items : QueryFormElsHT.getByKeys(['search', 'eventID'])
					}
				]
			}
		}
		return {
			query : query
		};
	};

	var QueryView = Hualala.Order.QueryView.subclass({
		/**
		 * 搜索栏View层构造函数
		 * 
		 * @param  {Obj} cfg 
		 *         @param {Function} mapRenderDataFn 渲染搜索栏表单的方法
		 *         @param {Function} bundleQueryEvent 为搜索栏绑定事件
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.isReady = false;
			this.$container = null;
			this.$queryBox = null;
			this.loadTemplates();
			this.hasAddBtn = $XP(cfg, 'hasAddBtn', true);
			this.set('mapRenderDataFn', $XF(cfg, 'mapRenderDataFn'));
			this.set('bundleQueryEvent', $XF(cfg, 'bundleQueryEvent'));
			this.set('initQueryFormEls', $XP(cfg, 'initQueryFormEls', null));
		}
	});

	QueryView.proto({
		renderLayout : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = layoutTpl(renderData);
			self.$queryBox = $(html);
			self.$container.html(self.$queryBox);
			if (!self.get('initQueryFormEls')) {
				self.initQueryFormEls();	
			} else {
				IX.isFn(self.get('initQueryFormEls')) && self.get('initQueryFormEls').call(self);
			}
			
			// self.initQueryEls();
		},
		bindEvent : function () {
			var self = this;
			var bundleQueryEvent = self.get('bundleQueryEvent');
			// self.$queryBox.on('click', '.btn', function (e) {
			// 	var act = $(this).attr('name');
			// 	if (act == 'addGift') {
			// 		// TODO Add Gift
			// 	} else if (act == 'search') {
			// 		self.emit('query', self.getQueryParams());
			// 	}
			// });
			bundleQueryEvent.call(self);
		},
		getQueryParams : function () {
			var self = this,
				keys = self.model.queryKeys,
				$form = self.$queryBox.find('form'),
				els = $form.serializeArray();
			els = _.map(els, function (el) {
				var n = $XP(el, 'name'), v = $XP(el, 'value', '');
				if (n == 'startDate' || n == 'endDate') {
					v = IX.isEmpty(v) ? '' : IX.Date.getDateByFormat(v, 'yyyyMMdd');
					return {
						name : n,
						value : v
					};
				}
				return el;
			});
			els = _.object(_.pluck(els, 'name'), _.pluck(els, 'value'));
			self.model.set(els);
			IX.Debug.info("DEBUG: Order Query Model Query Params:");
			IX.Debug.info(els);
			return els;
		},
		initQueryFormEls : function () {
			var self = this,
				els = self.model.getQueryParams();
			var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
			if (pageName == 'mcmEventMgr') {
				self.initEventTypeComboOpts($XP(els, 'eventWay', ''));
				self.initEventIsActiveComboOpts($XP(els, 'isActive', ''));
				self.initEventTimePicker($XP(els, 'eventStartDate', ''), $XP(els, 'eventEndDate'));
			}
			if (pageName == 'mcmGiftsMgr') {
				self.initGiftTypeComboOpts($XP(els, 'giftType', ''));
			}
			if (pageName == 'mcmGiftDetail') {
				var tabCntID = self.$container.attr('id');
				var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
				self.initEventTimePicker($XP(els, 'startTime', ''), $XP(els, 'endTime', ''));
				self.$queryBox.find(':hidden[name=giftItemID]').val($XP(ctx, 'params', [])[0]);
				console.info(self.container);
				if (tabCntID == 'tab_send') {
					self.initGiftDetailGetWayComboOpts($XP(els, 'getWay', ''));
					self.initGiftDetailGiftStatusComboOpts($XP(els, 'giftStatus', ''));
				} else {
					self.initShopChosenPanel($XP(els, 'usingShopID', ''));
				}
			}
			if (pageName == 'mcmEventTrack') {
				self.initCardLevelComboOpts();
				self.initWinTypeComboOpts();
			}
			// _.each(els, function (v, k) {
			// 	if (k == 'giftType') {
			// 		self.initGiftTypeComboOpts(v);
			// 	}
			// });
		},
		// 加载礼品发出方式下拉列表选项
		initGiftDetailGetWayComboOpts : function (curGetWay) {
			var self = this,
				getWayTypes = Hualala.TypeDef.MCMDataSet.GiftDistributeTypes;
			if (IX.isEmpty(getWayTypes)) return;
			getWayTypes = _.map(getWayTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curGetWay ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : getWayTypes
				}),
				$combo = self.$queryBox.find('select[name=getWay]');
			$combo.html(htm);
		},
		// 加载礼品状态下拉列表选项
		initGiftDetailGiftStatusComboOpts : function (curVal) {
			var self = this,
				options = Hualala.TypeDef.MCMDataSet.GiftStatus;
			if (IX.isEmpty(options)) return;
			options = _.map(options, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curVal ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : options
				}),
				$combo = self.$queryBox.find('select[name=giftStatus]');
			$combo.html(htm);
		},
		// 加载礼品类型下拉列表选项
		initGiftTypeComboOpts : function (curGiftType) {
			var self = this,
				giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes;
			if (IX.isEmpty(giftTypes)) return;
			giftTypes = _.map(giftTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curGiftType ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : giftTypes
				}),
				$combo = self.$queryBox.find('select[name=giftType]');
			$combo.html(htm);
		},
		// 加载活动类型下拉列表选项
		initEventTypeComboOpts : function (curEventType) {
			var self = this,
				eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
			if (IX.isEmpty(eventTypes)) return;
			eventTypes = _.map(eventTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curEventType ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : eventTypes
				}),
				$combo = self.$queryBox.find('select[name=eventWay]');
			$combo.html(htm);
		},
		// 加载活动状态下拉列表数据 
		initEventIsActiveComboOpts : function (curIsActive) {
			var self = this,
				eventStatus = Hualala.TypeDef.MCMDataSet.EventIsActive;
			if (IX.isEmpty(eventStatus)) return ;
			eventStatus = _.map(eventStatus, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curIsActive ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : eventStatus
				}),
				$combo = self.$queryBox.find('select[name=isActive]');
			$combo.html(htm);
		},
		// 加载时间选择控件
		initEventTimePicker : function (start, end) {
			var self = this;
			self.$queryBox.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
		},
		renderShopChosenRenderOptions : function (sections) {
			var self = this;
			var optTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_optgroup'));
			var shops = _.groupBy(sections, function (el) {
				return $XP(el, 'cityID');
			});
			var renderData = [];
			_.each(shops, function (els, cityID) {
				var cityName = $XP(els[0], 'cityName', '');
				var options = _.map(els, function (el) {
					return IX.inherit(el, {
						clz : ''
					});
				});
				renderData.push({
					cityName : cityName,
					cityID : cityID,
					options : options
				})
			});
			
			self.$queryBox.find('select[name=usingShopID]').html(optTpl({
				items : renderData
			}));
			self.$queryBox.find('select[name=usingShopID]').prepend('<option value="" selected></option>');
		},
		// 加载选择店铺控件
		initShopChosenPanel : function (curUsingShopID) {
			var self = this;
			var matcher = (new Pymatch([]));
			var sections = [];
			Hualala.Global.getShopQuerySchema({}, function (res) {
				if ($XP(res, 'resultcode') == '000') {
					sections = $XP(res, 'data.shops', []);
					self.renderShopChosenRenderOptions(sections);
					var getMatchedFn = function (searchText) {
						matcher.setNames(_.map(sections, function(el) {
							return IX.inherit(el, {
								name : $XP(el, 'shopName'),
								value : $XP(el, 'shopID')
							});
						}));
						var matchedSections = matcher.match(searchText);
						var matchedOptions = {};
						_.each(matchedSections, function (el, i) {
							matchedOptions[el[0].shopID] = true;
						});
						return matchedOptions;
					};

					self.$queryBox.find('select[name=usingShopID]').chosen({
						width : '200px',
						placeholder_text : "请选择店铺",
						no_results_text : "抱歉，没有找到！",
						allow_single_deselect : false,
						getMatchedFn : getMatchedFn
					});
				}
			});
		},
		// 加载会员等级选择控件
		initCardLevelComboOpts : function () {
			var self = this,
				cardLevels = Hualala.TypeDef.MCMDataSet.EventCardLevels;
			var renderCombo = function () {
				var optTpl = self.get('comboOptsTpl'),
					htm = optTpl({
						opts : cardLevels
					}),
					$combo = self.$queryBox.find('select[name=cardLevelID]');
				$combo.html(htm);
			};
			Hualala.Global.getVipLevels({}, function (res) {
				if ($XP(res, 'resultcode') == '000') {
					var _cardLevels = _.filter($XP(res, 'data.records', []), function (el) {
						return $XP(el, 'isActive') == 1;
					});
					cardLevels = cardLevels.concat(_.map(_cardLevels, function (el) {
						return {
							value : $XP(el, 'cardLevelID'),
							label : $XP(el, 'cardLevelName')
						};
					}));
					renderCombo();
				} else {
					renderCombo();
				}
			});
		},
		// 加载中奖情况选择控件
		initWinTypeComboOpts : function () {
			var self = this,
				winTypes = null,
				label = '';
			var eventDetail = self.$container.data('eventDetail');
			var eventWay = $XP(eventDetail, 'eventWay');
			if (eventWay == '20') {
				winTypes = Hualala.TypeDef.MCMDataSet.WinTypes;
				label = "中奖情况";
			} else if (eventWay == '22') {
				winTypes = Hualala.TypeDef.MCMDataSet.JoinTypes;
				label = "参与状态";
			}
			if (IX.isEmpty(winTypes)) return;
			winTypes = _.map(winTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : winTypes
				}),
				$combo = self.$queryBox.find('select[name=winFlag]');
			$combo.html(htm);
			$combo.parents('.form-group').find('label').html(label);
		}

	});


	Hualala.MCM.QueryView = QueryView;














})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var QueryController = Hualala.Shop.QueryController.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.resultController = $XP(cfg, 'resultController', null);
			this.model = $XP(cfg, 'model', null);
			this.view = $XP(cfg, 'view', null);
			if (!this.container || !this.model || !this.view || !this.resultController) {
				throw("QueryController init faild!");
			}
			this.init();
		}
	});

	QueryController.proto({
		
	});

	Hualala.MCM.QueryController = QueryController;

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip,
		LoadingModal = Hualala.UI.LoadingModal;

	/**
	 * 创建礼品向导步骤设置
	 * @type {Array}
	 */
	HMCM.GiftWizardCfg = [
		{id : "gift_base_info", label : "基本信息"},
		{id : "gift_rule", label : "使用规则"}
	];

	/**
	 * 创建活动向导步骤设置
	 * @type {Array}
	 */
	HMCM.EventWizardCfg = [
		{id : "event_base_info", label : "基本信息"},
		{id : "event_rule", label : "活动规则"},
		{id : "event_gift", label : "设置礼品、奖品"},
		{id : "event_on", label : "预览并启用"}
	];

	/**
	 * 向导步骤按钮设置
	 * @type {Array}
	 */
	HMCM.WizardCtrls = [
		{clz : 'btn-default btn-prev', name : 'prev', label : '上一步', loadingText : '请稍候...'},
		{clz : 'btn-default btn-cancel', name : 'cancel', label : '取消', loadingText : '取消'},
		{clz : 'btn-default btn-next', name : 'next', label : '下一步', loadingText : '请稍候...'},
		{clz : 'btn-default btn-finish', name : 'finish', label : '启用', loadingText : '提交中...'}
	];

	var MCMWizardModal = Stapes.subclass({
		/**
		 * 构造向导
		 * @param  {Object} cfg 配置信息
		 *         @param {obj} parentView 父级View层
		 *         @param {String} mode 新建(create)|编辑(edit)模式
		 *         @param {Function} successFn 成功回调 
		 *         @param {Function} failFn 失败回调
		 *         @param {Object} model 数据模型
		 *         @param {String} modalClz 窗口样式类
		 *         @param {String} wizardClz 向导控件样式类
		 *         @param {String} modalTitle 窗口标题
		 *         
		 *         @param {Array} wizardStepsCfg 向导各个步骤的配置
		 *         @param {Array} wizardCtrls 向导控制按钮配置
		 *
		 *         
		 *         @param {Function} onWizardInit 当wizard init时，触发的事件
		 *         @param {Function} onStepCommit 当wizard 步骤切换到下一步时，触发的事件
		 *         @param {Function} onStepChange 当wizard 步骤变换时，触发的事件
		 *         @param {Function} bundleWizardEvent 为向导绑定事件
		 * @return {[type]}     [description]
		 */
		constructor : function (cfg) {
			this.parentView = $XP(cfg, 'parentView');
			this.mode = $XP(cfg, 'mode', 'create');
			this.successFn = $XF(cfg, 'successFn');
			this.faildFn = $XF(cfg, 'faildFn');
			this.modal = null;
			this.$body = null;
			this.$wizard = null;
			this.wizardID = "mcm_wizard";
			this.wizardClz = $XP(cfg, 'wizardClz', '');
			this.wizardStepsCfg = $XP(cfg, 'wizardStepsCfg', []);
			this.wizardCtrls = $XP(cfg, 'wizardCtrls', []);
			this.model = $XP(cfg, 'model', null);
			this.modalClz = $XP(cfg, 'modalClz', '');
			this.modalTitle = $XP(cfg, 'modalTitle', '');
			this.stepViewHT = new IX.IListManager();

			this.onWizardInit = $XF(cfg, 'onWizardInit');
			this.onStepCommit = $XF(cfg, 'onStepCommit');
			this.onStepChange = $XF(cfg, 'onStepChange');

			this.bundleWizardEvent = $XF(cfg, 'bundleWizardEvent');

			this.loadTemplates();
			this.initModal();
			this.renderWizardLayout();
			this.initWizard();
			this.enableGoToNextStep = false;

			this.bundleWizardEvent.call(this);

		}
	});

	MCMWizardModal.proto({
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
				id : "mcm_wizard_modal",
				clz : self.modalClz,
				title : self.modalTitle,
				hideCloseBtn : true,
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
			stepNavs = _.map(self.wizardStepsCfg, function (step, i) {
				steps.push({
					id : $XP(step, 'id')
				});
				return IX.inherit(step, {
					idx : (i + 1)
				});
			});
			return {
				id : self.wizardID,
				clz : self.wizardClz,
				stepNavs : stepNavs,
				steps : steps,
				btns : self.wizardCtrls
			}
		},
		renderWizardLayout : function () {
			var self = this;
			var renderData = self.mapWizardLayoutData(),
				layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl(renderData);
			self.$body.html(htm);
			self.modal.show();
		},
		initWizard : function () {
			var self = this;
			self.$wizard = self.$body.find('#' + self.wizardID);
			self.$wizard.bsWizard({
				tabClass : 'tabClass',
				nextSelector : '.btn[name=next]',
				previousSelector : '.btn[name=prev]',
				finishSelector : '.btn[name=finish]',
				onTabClick : function () {return false;},
				onInit : function ($wizard, $navBar, nIdx) {
					// 加载向导第一步的View层
					var $tab = $('li:eq(' + nIdx + ')', self.$wizard),
						cntID = self.getTabContentIDByIndex($navBar, nIdx),
						$cnt = $('#' + cntID, self.$wizard);
					self.onWizardInit.call(self, $cnt, cntID, self.mode);
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
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					if (self.enableGoToNextStep == false) {
						self.onStepCommit.call(self, curID);
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
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
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
					self.onStepChange.apply(self, arguments);
				},
				/**
				 * fired when a tab is shown
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onTabShow : function ($curNav, $navBar, cIdx) {

				},
				/**
				 * fired when finish button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onFinish : function ($curNav, $navBar, cIdx) {
					// console.info('onFinish');
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					self.onStepCommit.call(self, curID);
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
		getTabContentIDByIndex : function ($navBar, idx) {
			var $tab = $('li:eq(' + idx + ')', $navBar),
				id = $tab.find('a[data-toggle]').attr('href').replace('#', '');
			return id;
		},
		registerStepView : function (cntID, stepView) {
			var self = this;
			self.stepViewHT.register(cntID, stepView);
		},
		getStepView : function (cntID) {
			return this.stepViewHT.get(cntID);
		},
		switchViewMode : function (mode) {
			this.mode = mode;
		}
	});

	HMCM.MCMWizardModal = MCMWizardModal;
	

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var giftEffectTimeHours = Hualala.Common.getMinuteIntervalOptions({
		startLabel : '立即生效',
		end : Hualala.Constants.SecondsOfDay / 60
	});

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
				return IX.isEmpty($XP(el, 'value'));
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
						message : "礼品价值必须在0到10000天之间"
					}
				}
			}
		},
		egiftEffectTimeHours : {
			type : "combo",
			label : "生效时间",
			defaultVal : "0",
			options : _.reduce(giftEffectTimeHours, function (memo, el, i) {
				if (i == 1) {
					memo = [memo];
				}
				return el.value >= 180 ? memo.concat(el) : memo;
			}),
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
						message : "请输入限制金额"
					},
					numeric : {
						message : "限制金额必须为数字"
					},
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "现值金额必须大于0"
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
				var groupName = $XP(Hualala.getSessionSite(), 'groupName', ''),
					giftType = self.model.get('giftType') || $XP(GiftSetFormElsHT.get('giftType'), 'defaultVal'),
					giftLabel = $XP(getGiftTypeSet(giftType), 'label');
				return IX.inherit(elCfg, {
					value : groupName + giftLabel,
					disabled : 'disabled'
				});
			} if (type == 'text' && key == 'giftValue') {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					disabled : (self.mode == 'edit') ? 'disabled' : ''
				});
			} else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal')
				});
			}
		});
		return ret;
	};

	var GiftBaseInfoFormKeys = 'giftItemID,giftType,giftValue,giftName,giftRemark'.split(',');

	var GiftBaseInfoStepView = Stapes.subclass({
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
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'wizard-step-form form-feedback-out',
					items : renderData
				});
			self.container.html(htm);
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
				var $giftValueLabel = $giftValue.parents('.form-group').find('> label');
				$giftValueLabel.text(giftType == 42 ? '积分点数' : '礼品价值');
				
				self.container.find(':text[name=giftName]').trigger('change');

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
					giftTypeSet = getGiftTypeSet(giftType);
					groupName = $XP(Hualala.getSessionSite(), 'groupName', ''),
					val = groupName + giftValue 
						+ (IX.isEmpty(giftValue) ? '' : $XP(giftTypeSet, 'unit'))
						+ $XP(giftTypeSet, 'label', '');
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
			return ret;
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
					self.parentView.switchWizardCtrlStatus('reset');
					self.parentView.getNextStep();
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
		}
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
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var accountID = wizardModalView.model.get('accountID');
			if (!accountID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else {
				Hualala.UI.Confirm({
					title : '取消创建礼品',
					msg : '是否取消创建礼品的操作？<br/>之前的操作将不生效！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			}
		});
	};
})(jQuery, window);;(function ($, window) {
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
				self.container.append('<p>顾客在获取会员充值类礼品后，将直接充入其会员储值余额账户中！');
			} else if (giftType == 42) {
				self.container.append('<p>顾客在获取会员积分类礼品后，将直接充入其会员积分余额账户中！');
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
						self.successFn.call(self);
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
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var ShopQueryModel = new Hualala.Shop.QueryModel();
	ShopQueryModel.extend({
		chosenShops : [],
		chosenCitys : [],
		initChosenData : function (shopIDs) {
			var self = this;
			if (IX.isEmpty(shopIDs) || shopIDs.length == 0) {
				return;
			}
			var shops = self.getShops(shopIDs);
			var cities = _.map(shops, function (el) {return $XP(el, 'cityID')});
			cities = self.getCities(_.uniq(cities));
			self.chosenShops = shops;
			self.chosenCitys = cities;
		},
		clearChosenData : function () {
			this.chosenShops = [];
			this.chosenCitys = [];
		},
		getChosenData : function () {
			return {
				cities : this.chosenCitys,
				shops : this.chosenShops
			};
		},
		mapComboOptions : function () {
			var self = this,
				chosenShops = self.chosenShops,
				shops = self.getShops();
			shops = _.reject(shops, function (el) {
				var shopID = $XP(el, 'shopID');
				var matched = _.find(chosenShops, function (_shop) {return $XP(_shop, 'shopID') == shopID});
				return shopID == $XP(matched, 'shopID');
			});
			
			shops = _.groupBy(shops, 'cityID');
			var ret = [];
			_.each(shops, function (_shops, cityID) {
				var city = self.getCities(cityID)[0];
				ret.push({
					cityID : cityID,
					cityName : $XP(city, 'cityName'),
					options : _shops
				});
			});
			IX.Debug.info('DEBUG: Combo Shop Options:');
			IX.Debug.info(ret);
			return ret;
		},
		mapChosenDataOptions : function () {
			var self = this,
				chosenShops = self.chosenShops;
			var _chosneShops = _.groupBy(chosenShops, 'cityID');
			var ret = [];
			_.each(_chosneShops, function (_shops, cityID) {
				var city = self.getCities(cityID)[0];
				ret.push({
					cityID : cityID,
					cityName : $XP(city, 'cityName'),
					options : _shops
				})
			});
			IX.Debug.info('DEBUG: Combo Chosen Shop Options:');
			IX.Debug.info(ret);
			return ret;
		}
	});

	HMCM.ShopQueryModel = ShopQueryModel;

	var ChooseShopModal = Stapes.subclass({
		constructor : function (cfg) {
			this.parentView = $XP(cfg, 'parentView');
			this.trigger = $XP(cfg, 'trigger');
			this.modal = null;
			this.$body = null;
			this.model = ShopQueryModel;
			this.modalTitle = $XP(cfg, 'modalTitle', '');
			this.modalClz = $XP(cfg, 'modalClz', '');
			this.chosenShopIDs = $XP(cfg, 'chosenShopIDs', []);
			this.chosenShopNames = $XP(cfg, 'chosenShopNames', []);

			this.loadTemplates();
			this.initInput();
			this.initModal();
			// this.renderLayout();
		}
	});

	ChooseShopModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_queryshops')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				optGrpTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_optgroup')),
				inputTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_choose'));
			Handlebars.registerPartial("ctrlbtns", Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("optgroup", Hualala.TplLib.get('tpl_shop_optgroup'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				optGrpTpl : optGrpTpl,
				inputTpl : inputTpl
			});
		},
		initInput : function () {
			var self = this,
				inputTpl = self.get('inputTpl');
			self.trigger.html(inputTpl({
				shopNames : self.chosenShopNames
			}));
			self.trigger.on('click', '.btn-choose', function (e) {
				self.modal.show();
				self.renderLayout();
				return false;
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "mcm_choose_shop_modal",
				clz : self.modalClz,
				title : self.modalTitle,
				hideCloseBtn : true,
				backdrop : 'static',
				showFooter : true,
				afterHide : function () {

				}
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			// self.modal.show();
		},
		renderLayout : function () {
			var self = this;
			self.model.init({}, function () {
				self.model.initChosenData(self.chosenShopIDs);
				var chooseShopOptions = self.model.mapComboOptions(),
					chosenShopOptions = self.model.mapChosenDataOptions();
				var layoutTpl = self.get('layoutTpl');
				var renderData = {
					chooseShopOpts : {
						comboName : 'choose_shops',
						items : chooseShopOptions
					},
					chosenShopOpts : {
						comboName : 'chosen_shops',
						items : chosenShopOptions	
					},
					btns : [
						{clz : 'btn-warning btn-block', name : 'add_all', label : '全部添加>>'},
						{clz : 'btn-warning btn-block', name : 'add_items', label : '添加>'},
						{clz : 'btn-warning btn-block', name : 'delete_items', label : '<删除'},
						{clz : 'btn-warning btn-block', name : 'delete_all', label : '<<全部删除>'}
					]
				};
				var htm = layoutTpl(renderData);
				self.$body.html(htm);
				self.bindEvent();
			});
		},
		refreshCombo : function () {
			var self = this;
			var chooseShopOptions = self.model.mapComboOptions(),
				chosenShopOptions = self.model.mapChosenDataOptions();
			var optGrpTpl = self.get('optGrpTpl');
			var comboLeftOpts = optGrpTpl({
					items : chooseShopOptions
				}),
				comboRightOpts = optGrpTpl({
					items : chosenShopOptions
				});
			$('select[name=choose_shops]').html(comboLeftOpts);
			$('select[name=chosen_shops]').html(comboRightOpts);
		},
		bindEvent : function () {
			var self = this;
			self.$body.on('mouseup', 'select.form-control > optgroup', function (e) {
				var $grp = $(this);
				if ($grp.hasClass('open')) {
					$grp.removeClass('open').find('> option').hide();
				} else {
					$grp.addClass('open').find('> option').show();
				}
			});
			self.$body.on('mouseup', 'select.form-control option', function (e) {
				e.stopPropagation();
			});
			self.$body.on('click', '.select-center .btn', function (e) {
				var $btn = $(this), act = $btn.attr('name');
				var $comboLeft = $('select[name=choose_shops]', self.$body),
					$comboRight = $('select[name=chosen_shops]', self.$body);
				var shopIDs = [];
				switch(act) {
					case 'add_all':
						shopIDs = self.model.getShops();
						shopIDs = _.map(shopIDs, function (el) {return $XP(el, 'shopID')});
						self.model.clearChosenData();
						break;
					case 'add_items':
						$comboLeft.find('option:selected').each(function (i, el) {
							shopIDs.push($(el).attr('value'));
						});
						$comboRight.find('option').each(function (i, el) {
							shopIDs.push($(el).attr('value'));
						});
						break;
					case 'delete_all':
						self.model.clearChosenData();
						break;
					case 'delete_items':
						$comboRight.find('option:not(:selected)').each(function (i, el) {
							shopIDs.push($(el).attr('value'));
						});
						break;
				}
				self.model.initChosenData(shopIDs);
				self.refreshCombo();
			});
			self.$footer.on('click', '.btn-ok', function (e) {
				var $btn = $(this);
				var chosenData = self.model.getChosenData();
				var shopNames = _.pluck($XP(chosenData, 'shops'), 'shopName');
				self.parentView.model.emit('bindShops', chosenData);
				self.trigger.find('.choose-shop-val').html(shopNames.length == 0 ? '不限店铺' : shopNames.join(';'));
				self.modal.hide();
			});
		}
	});

	HMCM.ChooseShopModal = ChooseShopModal;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;


	var EventSetFormElsCfg = {
		eventID : {
			type : "hidden",
			defaultVal : ""
		},
		eventName : {
			type : 'text',
			label : "活动主题",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动主题不能为空"
					}
				}
			}
		},
		cardLevelID : {
			type : 'combo',
			label : "顾客范围",
			defaultVal : "-1",
			options : Hualala.TypeDef.MCMDataSet.EventCardLevels,
			validCfg : {
				validators : {
					notEmpty : {
						message : "顾客范围不能为空"
					}
				}
			}
		},
		eventWay : {
			type : 'combo',
			label : "活动类型",
			defaultVal : "20",
			options : _.reject(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {
				return IX.isEmpty($XP(el, 'value'));
			}),
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动类型不能为空"
					}
				}
			}
		},
		eventRemark : {
			type : 'textarea',
			label : "描述",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动说明不能为空"
					}
				}
			}
		},
		dateRange : {
			type : 'section',
			label : '起止日期',
			min : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {
						notEmpty : {
							message : "请输入起始时间"
						}
					}
				}
			},
			max : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {
						notEmpty : {
							message : "请输入结束时间"
						}
					}
				}
			}
		},
		chkDeductPoints : {
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '参与活动扣减积分'
			}],
			validCfg : {
				validators : {}
			}
		},
		deductPoints : {
			type : "text",
			label : "扣减积分",
			defaultVal : "0",
			// prefix : '￥',
			// surfix : '元',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入扣减积分值"
					},
					numeric : {
						message : "扣减积分必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "扣减积分必须大于或等于0"
					}
				}
			}
		},
		chkSendPoints : {
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '参与活动赠送积分'
			}],
			validCfg : {
				validators : {}
			}
		},
		sendPoints : {
			type : "text",
			label : "赠送积分",
			defaultVal : "0",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入赠送积分值"
					},
					numeric : {
						message : "赠送积分必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "赠送积分必须大于或等于0"
					}
				}
			}
		},
		radioCountCycleDays : {
			type : "radiogrp",
			label : "会员参与次数",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.EventCountCycleDays,
			validCfg : {}
		},
		partInTimes : {
			type : "inputCountCycleDays",
			label : "",
			defaultVal : '1',
			options : _.map([1,2,3,4,5,6,7,15,30,60,90], function (d) {
				return {
					value : d,
					label : d + '天'
				};
			}),
			partInTimes : {
				validCfg : {
					validators : {
						notEmpty : {
							message : "请输入参与次数"
						},
						numeric : {
							message : "参与次数必须为数字"
						},
						greaterThan : {
							inclusive : false,
							value : 0,
							message : "参与次数必须大于0"
						}
					}
				}
			}
		},
		isVipBirthdayMonth : {
			type : "radiogrp",
			label : "仅本月会员生日可参与",
			defaultVal : '0',
			options : Hualala.TypeDef.MCMDataSet.IsVIPBirthdayMonth,
			validCfg : {}
		},
		maxPartInPerson : {
			type : "text",
			label : "最大报名人数",
			defaultVal : '0',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入最大报名人数"
					},
					numeric : {
						message : "最大报名人数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "最大报名人数必须大于或等于0"
					}
				}
			}
		}
	};

	var EventSetFormElsHT = new IX.IListManager();
	_.each(EventSetFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = 'eventStartDate',
				maxName = 'eventEndDate',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-3 col-sm-3 col-md-3',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-3 col-sm-3 col-md-3',
				});
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else if (type == 'inputCountCycleDays') {
			var options = $XP(el, 'options');
			var countCycleDays = {
					id : 'countCycleDays' + '_' + IX.id(),
					name : 'countCycleDays',
					options : options
				},
				partInTimes = {
					id : 'partInTimes_' + IX.id(),
					name : 'partInTimes',
					validCfg : $XP(el, 'partInTimes.validCfg', {})
				};

			EventSetFormElsHT.register(k, IX.inherit(el, {
				labelClz : labelClz,
				clz : 'col-sm-8',
				countCycleDays : countCycleDays,
				partInTimes : partInTimes
			}));

		} else if (type == 'radiogrp' || type == 'checkboxgrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
				});
			});
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				options : ops,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else if (type == 'selectShops') {
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else {
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});

	HMCM.EventSetFormElsHT = EventSetFormElsHT;

	var EventBaseInfoFormKeys = 'eventID,eventName,cardLevelID,eventWay,eventRemark'.split(',');



	/**
	 * 整理礼品基本信息表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventBaseInfoFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = EventSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'combo' && key == 'cardLevelID') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					levels = _.map(self.model.CardLevelIDSet, function (el) {
						return {
							value : $XP(el, 'cardLevelID'),
							label : $XP(el, 'cardLevelName'),
							isActive : $XP(el, 'isActive')
						}
					});
				levels = _.filter(levels, function (el) {return $XP(el, 'isActive') == '1';});
				var options = $XP(elCfg, 'options', []).concat(levels);
				options = _.map(options, function (op) {
					return IX.inherit(op, {
						selected : $XP(op, 'value') == v ? 'selected' : ''
					});
				});
				return IX.inherit(elCfg, {
					value : v,
					options : options
				});
			} else if (type == 'combo') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							selected : $XP(op, 'value') == v ? 'selected' : ''
						});
					});
				return IX.inherit(elCfg, {
					disabled : (self.mode == 'edit' && key == 'eventWay') ? 'disabled' : '',
					value : v,
					options : options
				});
			} else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'dafaultVal')
				});
			}
		});
		return ret;
	};

	var EventBaseInfoStepView = HMCM.GiftBaseInfoStepView.subclass({
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
				throw("Event Base Info View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm(function () {
				self.initUIComponents();
				self.bindEvent();
			});
		}
	});
	EventBaseInfoStepView.proto({
		initBaseCfg : function () {
			this.formKeys = EventBaseInfoFormKeys;
		},
		renderForm : function (cbFn) {
			var self = this;
			var renderFn = function () {
				var renderData = self.mapFormElsData.call(self),
					tpl = self.get('layoutTpl'),
					btnTpl = self.get('btnTpl'),
					htm = tpl({
						formClz : 'wizard-step-form form-feedback-out',
						items : renderData
					});
				self.container.html(htm);
				cbFn();
			};
			self.model.emit("loadCardLevelIDs", {
				successFn : function () {
					renderFn();
				},
				failFn : function () {
					renderFn();
				}
			});
				
			
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
				var act = self.mode + 'Event';
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: Event Wizard Form Params:");
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
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
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
					var elCfg = EventSetFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			return ret;
		},
		switchViewMode : function (mode) {
			this.mode = mode;
			this.parentView.switchViewMode(mode);
		}
	});
	HMCM.EventBaseInfoStepView = EventBaseInfoStepView;

	/**
	 * 创建向导中活动基本信息步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	var initEventBaseInfoStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventBaseInfoStepView({
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
				mapFormElsData : mapEventBaseInfoFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};

	HMCM.initEventBaseInfoStep = initEventBaseInfoStep;

	/**
	 * 当活动向导步骤变化时触发的事件
	 * @param  {[type]} $curNav [description]
	 * @param  {[type]} $navBar [description]
	 * @param  {[type]} cIdx    [description]
	 * @param  {[type]} nIdx    [description]
	 * @return {[type]}         [description]
	 */
	var onEventWizardStepChange = function ($curNav, $navBar, cIdx, nIdx) {
		var wizardModalView = this;
		var curID = wizardModalView.getTabContentIDByIndex($navBar, cIdx),
			nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
			$nextCnt = $('#' + nextID, wizardModalView.$wizard),
			nextView = wizardModalView.getStepView(nextID);
		var stepFns = [
			'initEventBaseInfoStep',
			'initEventRuleStep',
			'initEventGiftSetStep',
			'initEventOpenStep'
		];
		if (cIdx == -1 && nIdx == 0) return true;
		if (!nextView) {
			HMCM[stepFns[nIdx]].call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 1 && HMCM.initEventRuleStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 0 && HMCM.initEventBaseInfoStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 2 && HMCM.initEventGiftSetStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
		} else {
			nIdx == 1 && nextView.refresh();
		}
		return true;
	};

	HMCM.onEventWizardStepChange = onEventWizardStepChange;

	/**
	 * 当活动向导步骤提交时触发的事件
	 * @param  {[type]} curID [description]
	 * @return {[type]}       [description]
	 */
	HMCM.onEventWizardStepCommit = function (curID) {
		var wizardModalView = this,
			stepView = wizardModalView.getStepView(curID),
			$cnt = stepView.container,
			$form = $cnt.find('form'),
			bv = $form.data('bootstrapValidator');
		wizardModalView.switchWizardCtrlStatus('loading');
		if (curID == 'event_on') {
			stepView.submit();
		} else {
			bv.validate();
		}
		
	};

	/**
	 * 绑定礼活动向导的事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleEventWizardEvent = function () {
		var wizardModalView = this;
		wizardModalView.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function (e) {
			var $btn = $(this);
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var accountID = wizardModalView.model.get('accountID');
			if (!accountID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else {
				Hualala.UI.Confirm({
					title : '取消创建活动',
					msg : '是否取消创建活动的操作？<br/>之前的操作将不生效！',
					okLabel : '确定',
					okFn : function () {
						wizardModalView.modal.hide();
					}
				});
			}
		});
	}

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var EventSetFormElsHT = HMCM.EventSetFormElsHT;

	var EventRuleFormKeys = 'dateRange,chkDeductPoints,deductPoints,chkSendPoints,sendPoints,radioCountCycleDays,partInTimes,isVipBirthdayMonth,maxPartInPerson'.split(',');

	/**
	 * 整理活动规则表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventRuleFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = EventSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'section') {
				var eventStartDate = self.model.get('eventStartDate') || '',
					eventEndDate = self.model.get('eventEndDate') || '';
				return IX.inherit(elCfg, {
					min : IX.inherit($XP(elCfg, 'min'), {
						value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(eventStartDate), 'yyyy/MM/dd')
					}),
					max : IX.inherit($XP(elCfg, 'max'), {
						value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(eventEndDate), 'yyyy/MM/dd')
					})
				});
			} else if (type == 'checkboxgrp' && key == 'chkDeductPoints') {
				var v = self.model.get('deductPoints') || 0,
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							checked : v > 0 ? 'checked' : ''
						});
					});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'checkboxgrp' && key == 'chkSendPoints') {
				var v = self.model.get('sendPoints') || 0,
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							checked : v > 0 ? 'checked' : ''
						});
					});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'radiogrp' && key == 'radioCountCycleDays') {
				var countCycleDays = self.model.get('countCycleDays') || 0,
					partInTimes = self.model.get('partInTimes') || 0,
					v = 0;
				if (countCycleDays == 0 && partInTimes == 0) {
					v = 0;
				} else if (countCycleDays !== 0 && partInTimes != 0) {
					v = 2;
				} else {
					v = 1;
				}
				var options = _.map($XP(elCfg, 'options'), function (op) {
					return IX.inherit(op, {
						checked : v == $XP(op, 'value') ? 'checked' : ''
					});
				});
				return IX.inherit(elCfg, {
					options : options
				});
			} else if (type == 'inputCountCycleDays') {
				var countCycleDays = self.model.get('countCycleDays') || 0,
					partInTimes = self.model.get('partInTimes') || 0;
				return IX.inherit(elCfg, {
					countCycleDays : IX.inherit($XP(elCfg, 'countCycleDays'), {
						options : _.map($XP(elCfg, 'countCycleDays.options'), function (el) {
							return IX.inherit(el, {
								selected : $XP(el, 'value') == countCycleDays ? 'selected' : ''
							});
						})
					}),
					partInTimes : IX.inherit($XP(elCfg, 'partInTimes'), {
						value : partInTimes
					})
				});
			} else if (type == 'combo') {
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

	var EventRuleStepView = HMCM.EventBaseInfoStepView.subclass({
		constructor : HMCM.EventBaseInfoStepView.prototype.constructor
	});
	EventRuleStepView.proto({
		initBaseCfg : function () {
			this.formKeys = EventRuleFormKeys;
		},
		initUIComponents : function () {
			var self = this;
			var eventWay = self.model.get('eventWay');
			self.initDatePicker();
			self.setSwitcherLayout(self.container.find(':checkbox[name=chkDeductPoints]'));
			self.setSwitcherLayout(self.container.find(':checkbox[name=chkSendPoints]'));
			self.setRadioCountCycleDaysLayout(self.container.find(':radio[name=radioCountCycleDays]'));
			if (eventWay != 22) {
				self.container.find(':text[name=maxPartInPerson]').parents('.form-group').hide();
			} else {
				self.container.find(':text[name=maxPartInPerson]').parents('.form-group').show();
			}
			if (eventWay == 40 || eventWay == 41) {
				self.container.find(':checkbox[name=chkDeductPoints],:text[name=deductPoints]').parents('.form-group').hide();
				// self.container.find(':text[name=deductPoints]').parents('.form-group').hide();
				var $el = self.container.find(':checkbox[name=chkSendPoints]').clone(true),
					$box = self.container.find(':checkbox[name=chkSendPoints]').parent();
				$box.empty().append($el).append('分享人获得积分');
			} else {
				self.container.find(':checkbox[name=chkDeductPoints],:text[name=deductPoints]').parents('.form-group').show();
				var $el = self.container.find(':checkbox[name=chkSendPoints]').clone(true),
					$box = self.container.find(':checkbox[name=chkSendPoints]').parent();
				$box.empty().append($el).append('参与活动赠送积分');
			}
		},
		initDatePicker : function () {
			var self = this;
			self.container.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
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
				var act = self.mode + 'Event';
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: Event Wizard Form Params:");
				IX.Debug.info(formParams);
				self.model.emit(act, {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.successFn.call(self);
						self.switchViewMode('edit');
						// self.parentView.modal.hide();
					}
				});
			});
			self.container.find(':checkbox[name=chkDeductPoints]').on('change', function (e) {
				self.setSwitcherLayout($(this));
				
			});
			self.container.find(':checkbox[name=chkSendPoints]').on('change', function (e) {
				self.setSwitcherLayout($(this));
			});
			self.container.find(':radio[name=radioCountCycleDays]').on('change', function (e) {
				self.setRadioCountCycleDaysLayout($(this));
			});
			self.container.find('form [data-type=datetimepicker]').on('change', function (e) {
				var $this = $(this),
					name = $this.attr('name');
				self.container.find('form').bootstrapValidator('revalidateField', name);
			});
		},
		setSwitcherLayout : function ($chk) {
			var checked = $chk.is(':checked');
			var $nextFormGroup = $chk.parents('.form-group').next('.form-group');
			$nextFormGroup[checked ? 'removeClass' : 'addClass']('hidden');
			$nextFormGroup.find(':text').attr('disabled', checked ? false : true);
		},
		setRadioCountCycleDaysLayout : function ($radio) {
			var self = this;
			var val = self.getRadiboxVal($radio.attr('name'));
			var $nextFormGroup = $radio.parents('.form-group').next('.form-group'),
				$els = $nextFormGroup.find('.cycle-label, select[name=countCycleDays]'),
				$text = $nextFormGroup.find(':text[name=partInTimes]');
			if (val == 0) {
				$nextFormGroup.hide();
				$text.attr('disabled', true);
			} else if (val == 1) {
				$nextFormGroup.show();
				$els.addClass('hidden');
				$text.attr('disabled', false);
			} else {
				$nextFormGroup.show();
				$els.removeClass('hidden');
				$text.attr('disabled', false);
			}
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
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (key == 'dateRange') {
					ret['eventStartDate'] = $XP(elCfg, 'min.validCfg', {});
					ret['eventEndDate'] = $XP(elCfg, 'max.validCfg', {});
				} else if (key == 'partInTimes') {
					ret['partInTimes'] = $XP(elCfg, 'partInTimes.validCfg', {});
				} else {
					ret[key] = $XP(elCfg, 'validCfg', {});	
				}
				
			});
			return ret;
		},
		serializeForm : function () {
			// 	var EventRuleFormKeys = 'dateRange,chkDeductPoints,deductPoints,chkSendPoints,sendPoints,radioCountCycleDays,partInTimes,isVipBirthdayMonth,maxPartInPerson'.split(',');
			var self = this,
				formKeys = self.formKeys,
				ret = {};

			var getDateRange = function () {
				var start = IX.Date.getDateByFormat($(':text[name=eventStartDate]', self.container).val(), 'yyyyMMdd'),
					end = IX.Date.getDateByFormat($(':text[name=eventEndDate]', self.container).val(), 'yyyyMMdd');
				return {eventStartDate : start, eventEndDate : end};
			};
			var getDeductPoints = function () {
				var eventWay = self.model.get('eventWay');
				if (eventWay == 40 || eventWay == 41) {
					return 0;
				} else if (!$(':checkbox[name=chkDeductPoints]', self.container).is(':checked')) {
					return 0;
				} else {
					return $(':text[name=deductPoints]', self.container).val();
				}
			};
			var getSendPoints = function () {
				var eventWay = self.model.get('eventWay');
				if (!$(':checkbox[name=chkSendPoints]', self.container).is(':checked')) {
					return 0;
				} else {
					return $(':text[name=sendPoints]', self.container).val();
				}
			};
			var getPartinTimesSet = function () {
				var radioVal = self.getRadiboxVal('radioCountCycleDays');
				var countCycleDays = 0, partInTimes = 0;
				countCycleDays = radioVal < 2 ? 0 : $('[name=countCycleDays]', self.container).val();
				partInTimes = radioVal == 0 ? 0 : $(':text[name=partInTimes]', self.container).val();
				return {
					countCycleDays : countCycleDays,
					partInTimes : partInTimes
				};
			};

			var formEls = _.map(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				var v = null;
				switch (key) {
					case 'dateRange':
							v = getDateRange();
							ret = IX.inherit(ret, v);
						break;
					case 'chkDeductPoints':
					case 'chkSendPoints':
					case 'radioCountCycleDays':
						break;
					case 'deductPoints':
						v = getDeductPoints();
						ret['deductPoints'] = v;
						break;
					case 'sendPoints':
						v = getSendPoints();
						ret['sendPoints'] = v;
						break;
					case 'partInTimes':
						v = getPartinTimesSet();
						ret = IX.inherit(ret, v);
						break;
					case 'isVipBirthdayMonth':
						v = self.getRadiboxVal(key);
						ret[key] = v;
						break;
					case 'maxPartInPerson':
						v = self.model.get('eventWay') == 22 ? $(':text[name=maxPartInPerson]', self.container).val() : 0;
						ret[key] = v;
						break;
				}
				return key;
			});
			return ret;
		},
		refresh : function () {
			var self = this;
			this.formParams = this.model.getAll();
			self.initUIComponents();
		}
	});

	HMCM.EventRuleStepView = EventRuleStepView;

	/**
	 * 创建向导中活动规则步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initEventRuleStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventRuleStepView({
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
				mapFormElsData : mapEventRuleFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var giftEffectTimeHours = Hualala.Common.getMinuteIntervalOptions({
		startLabel : '立即生效',
		end : Hualala.Constants.SecondsOfDay / 60
	});

	var EventGiftsSetHT = new IX.IListManager();
	var EventGiftSetFormKeys = "EGiftID,EGiftName,EGiftTotalCount,EGiftValidUntilDayCount,EGiftOdds,EGiftEffectTimeHours".split(',');
	var EventGiftLevelCount = 3;
	var GiftLevelNames = ["", "一等奖","二等奖","三等奖"];
	var EventGiftSetFormElsCfg = {
		EGiftID : {
			type : 'hidden',
			defaultVal : ''
		},
		EGiftName : {
			type : 'pickgift',
			defaultVal : '',
			label : '奖品名称',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择奖品"
					}
				}
			}
		},
		EGiftTotalCount : {
			type : "text",
			label : "奖品总数",
			defaultVal : "0",
			// prefix : '￥',
			surfix : '个',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入奖品总数"
					},
					numeric : {
						message : "奖品总数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "奖品总数必须大于或等于0"
					}
				}
			}
		},
		EGiftValidUntilDayCount : {
			type : "text",
			label : "有效天数",
			defaultVal : "30",
			// prefix : '￥',
			surfix : '天',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入有效天数"
					},
					numeric : {
						message : "有效天数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "有效天数必须大于或等于0"
					}
				}
			}
		},
		EGiftOdds : {
			type : "text",
			label : "中奖概率百分比",
			defaultVal : "0",
			surfix : '%',
			help : "输入值在0.0001~100之间。如：0.01%表示万分之一的几率。",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入中奖概率"
					},
					between : {
						min : 0.0001,
						max : 100,
						message : "中奖概率百分比值在0.0001~100之间"
					}
				}
			}
		},
		EGiftEffectTimeHours : {
			type : "combo",
			label : "生效时间",
			defaultVal : "0",
			options : _.reduce(giftEffectTimeHours, function (memo, el, i) {
				if (i == 1) {
					memo = [memo];
				}
				return el.value >= 180 ? memo.concat(el) : memo;
			}),
			validCfg : {
				validators : {}
			}
		}
	};

	for (var i = 1; i <= EventGiftLevelCount; i++) {
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		_.each(EventGiftSetFormElsCfg, function (el, k) {
			var key = k + '_' + i,
				type = $XP(el, 'type');

			EventGiftsSetHT.register(key, IX.inherit(el, {
				id : key + '_' + IX.id(),
				name : key,
				labelClz : labelClz,
				clz : 'col-sm-6'
			}));
		});
	}

	/**
	 * 整理活动奖品表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventGiftFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var eventWay = self.model.get('eventWay');
		var ret = [];
		for (var i = 1; i <= EventGiftLevelCount; i++) {
			var giftLevelName = GiftLevelNames[i],
				panelClz = 'mcm-evtgift-panel ';
			var EGiftID = self.model.get('EGiftID_' + i);
			if ((EGiftID != 0 && !IX.isEmpty(EGiftID)) || i == 1) {
				panelClz += ' isActive ';
			}
			if (eventWay == 21 || eventWay == 30) {
				panelClz += ' singlegift ';
			}
			var addbtn = {clz : 'btn-warning btn-add', name : 'addGift', label : '添加中奖等级'},
				delbtn = {clz : 'btn-default btn-del', name : 'deleteGift', label : '删除' + giftLevelName};
			var giftSet = {
				giftLevelName : giftLevelName,
				clz : panelClz,
				btns : i == 1 ? [addbtn] : (i == EventGiftLevelCount ? [delbtn] : [delbtn,addbtn])
			};
			var form = _.map(formKeys, function (k) {
				var key = k + '_' + i,
					elCfg = EventGiftsSetHT.get(key),
					type = $XP(elCfg, 'type');
				var v = null;
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
				} else {
					return IX.inherit(elCfg, {
						value : self.model.get(key) || $XP(elCfg, 'defaultVal')
					});
				}
			});
			ret.push(IX.inherit(giftSet, {
				isDivForm : true,
				formClz : 'mcm-evtgift-form',
				items : form
				// form : {
				// 	formClz : 'mcm-evtgift-form',
				// 	items : form
				// }
			}));
		}
		return ret;
	};


	var EventGiftSetStepView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Event Gift Set View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			// this.formParams = this.model.getAll();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
			
		}
	});
	EventGiftSetStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_event_giftset')),
				formTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_base_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("baseform", Hualala.TplLib.get('tpl_mcm_base_form'));
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
			this.formKeys = EventGiftSetFormKeys;
		},
		initUIComponents : function () {
			var self = this;
			self.container.find('.isActive:last').addClass('isCurrent');
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
				IX.Debug.info("DEBUG: Event Wizard Form Params:");
				IX.Debug.info(formParams);
				
				self.model.emit('editEvent', {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.successFn.call(self);

					}
				});
			});

			self.container.on('click', '.btn[name=pickgift]', function (e) {
				var $btn = $(this);
				var modal = new HMCM.PickGiftModal({
					trigger : $btn,
					selectedFn : function (gift, $triggerEl) {
						var giftID = $XP(gift, 'giftItemID', ''),
							giftName = $XP(gift, 'giftName', '');
						var panel = $triggerEl.parents('.mcm-evtgift-panel'),
							idx = parseInt(panel.attr('data-index')) + 1;
						$('[name=EGiftID_' + idx + ']', panel).val(giftID);
						$('[name=EGiftName_' + idx + ']', panel).val(giftName);
					}
				});
			});
		},
		resetGiftSet : function ($panel) {
			var self = this;
			var idx = parseInt($panel.attr('data-index')) + 1;
			var formKeys = self.formKeys;
			_.each(formKeys, function (k) {
				var key = k + '_' + idx,
					$el = $('[name=' + key + ']', $panel);
				switch (k) {
					case "EGiftID":
					case "EGiftName":
						$el.val('');
						break;
					case "EGiftEffectTimeHours":
					case "EGiftTotalCount":
					case "EGiftOdds":
						$el.val(0);
						break;
					case "EGiftValidUntilDayCount":
						$el.val(30);
						break;
				}
			});
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl({
					gifts : renderData
				});
			self.container.html(htm);
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'EGiftID'}),
				ret = {};
			for (var i = 1; i <= EventGiftLevelCount; i++) {
				_.each(formKeys, function (k) {
					var key = k + '_' + i,
						elCfg = EventGiftsSetHT.get(key),
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
			for (var i = 1; i <= EventGiftLevelCount; i++) {
				_.each(formKeys, function (k) {
					var key = k + '_' + i;
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			}
			return ret;
		}
	});

	HMCM.EventGiftSetStepView = EventGiftSetStepView;


	/**
	 * 创建向导中活动奖品步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initEventGiftSetStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventGiftSetStepView({
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
				mapFormElsData : mapEventGiftFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};


})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var MCMGiftListHeaderCfg = [
		{key : "giftType", clz : "", label : "礼品类型"},
		{key : "giftName", clz : "text", label : "礼品名称"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
			queryKeys = self.model.queryKeys;
		var r = {value : "", text : ""}, v = $XP(row, colKey, '');
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			// 礼品列表各列参数
			case "giftType":
				var giftCardTpl = self.get('giftCardTpl'),
					giftValue = $XP(row, 'giftValue', 0),
					giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes,
					giftType = _.find(giftTypes, function (el) {return $XP(el, 'value') == v;});

				r.value = v;
				r.text = $XP(giftType, 'label', '');
				break;
			default :
				r.value = r.text = $XP(row, colKey, '');
				break;
		}
		return r;
	};

	var mapGiftsQueryResultRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		var clz = "col-md-12",
			tblClz = "  table-hover mcm-grid",
			tblHeaders = MCMGiftListHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

	/**
	 * 渲染搜索结果方法
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	var renderPickGiftQueryResult = function (data) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		self.$result.empty();
		self.$result.html(self.get('resultTpl')(data));
	};

	var initQueryFormEls = function () {
		var self = this,
			els = self.model.getQueryParams();
		self.initGiftTypeComboOpts($XP(els, 'giftType', ''));
	};

	/**
	 * 绑定事件
	 * @return {[type]} [description]
	 */
	var bundleGiftsQueryResultEvent = function () {
		var self = this;
		self.$result.on('dblclick', '.mcm-grid > tbody > tr', function (e) {
			var $tr = $(this);
			var $p = $tr.find('p[data-value]');
			$tr.addClass('selected');
		});
	};

	var PickGiftModal = Stapes.subclass({
		constructor : function (cfg) {
			this.trigger = $XP(cfg, 'trigger');
			this.selectedFn = $XF(cfg, 'selectedFn');
			this.modal = null;
			this.$body = null;
			this.panel = null;
			this.initModal();
			this.initPanel();
			this.bindEvent();
		}
	});
	PickGiftModal.proto({
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "mcm_pickgift_modal",
				clz : "mcm-pickgift-modal",
				title : "选择礼品、奖品",
				hideCloseBtn : false,
				backdrop : 'static',
				showFooter : false,
				afterHide : function () {

				}
			});
			self.$body = self.modal._.body;
			self.modal.show();
		},
		initPanel : function () {
			var self = this;
			this.panel = new HMCM.QueryController({
				container : self.$body,
				resultController : new HMCM.QueryResultControler({
					container : self.$body,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.getMCMGifts,
						queryKeys : Hualala.MCM.QueryFormKeys.GiftMgrQueryKeys,
						gridType : 'giftlist',
						recordModel : HMCM.BaseGiftModel
					}),
					view : new HMCM.QueryResultView({
						mapResultRenderData : mapGiftsQueryResultRenderData,
						renderResult : renderPickGiftQueryResult,
						bundleEvent : bundleGiftsQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : Hualala.MCM.QueryFormKeys.GiftMgrQueryKeys
				}),
				view : new HMCM.QueryView({
					hasAddBtn : false,
					mapRenderDataFn : HMCM.mapGiftQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent,
					initQueryFormEls : initQueryFormEls
				})

			});
		},
		bindEvent : function () {
			var self = this;
			self.$body.on('dblclick', '.mcm-grid > tbody > tr', function (e){
				var $tr = $(this);
				var $p = $tr.find('p[data-value]');
				self.selectedFn({
					giftItemID : $p.eq(0).attr('data-value'),
					giftName : $p.eq(1).attr('data-value')
				}, self.trigger);
				self.modal.hide();
			});
		}
	});
	HMCM.PickGiftModal = PickGiftModal;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	/**
	 * 整理活动配置渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventDetailData = function () {
		var self = this,
			model = self.model;
		var mapFn = HMCM.mapEventDetailRenderData;
		var ret = mapFn.call(self, model);

		return ret;
	};

	var EventOpenStepView = Stapes.subclass({
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
				throw("Event Base Info View init faild!");
			}

			this.loadTemplates();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});
	EventOpenStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_event_openstep')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial('evtdetail', Hualala.TplLib.get('tpl_event_detail'));
			Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_event_card'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		renderForm : function () {
			var self = this;
			var renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl(renderData);
			self.container.html(htm);
		},
		initUIComponents : function () {

		},
		bindEvent : function () {

		},
		submit : function () {
			var self = this;
			var eventID = self.model.get('eventID');
			self.model.emit('switchEvent', {
				params : {
					eventID : eventID,
					isActive : 1
				},
				failFn : function () {
					self.failFn.call(self);
				},
				successFn : function () {
					self.successFn.call(self);
					self.parentView.modal.hide();
				}
			});
		}
	});

	HMCM.EventOpenStepView = EventOpenStepView;

	/**
	 * 创建向导中活动开启步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HMCM.initEventOpenStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventOpenStepView({
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
				mapFormElsData : mapEventDetailData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var BaseGiftSendModel = Stapes.subclass({
		constructor : function (data) {
			this.set(data);
			this.bindEvent();
		}
	});

	BaseGiftSendModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({

			}, self);
		}
	});

	HMCM.BaseGiftSendModel = BaseGiftSendModel;

	/**
	 * 获取礼品发出方式配置信息
	 * @param  {[type]} val [description]
	 * @return {[type]}     [description]
	 */
	var getGiftGetWayTypeSet = function (val) {
		var items = Hualala.TypeDef.MCMDataSet.GiftDistributeTypes;
		return _.find(items, function (el) {
			return $XP(el, 'value') == val;
		});
	};
	HMCM.getGiftGetWayTypeSet = getGiftGetWayTypeSet;

	/**
	 * 获取礼品状态配置信息
	 * @param  {[type]} val [description]
	 * @return {[type]}     [description]
	 */
	var getGiftStatusTypeSet = function (val) {
		var items =  Hualala.TypeDef.MCMDataSet.GiftStatus;
		return _.find(items, function (el) {
			return $XP(el, 'value') == val;
		});
	};
	HMCM.getGiftStatusTypeSet = getGiftStatusTypeSet;

	var MCMQueryGiftSendHeaderCfg = [
		{key : "getWay", clz : "text", label : "发出方式"},
		{key : "createTime", clz : "date", label : "发出时间"},
		{key : "validUntilDate", clz : "date", label : "有效日期"},
		{key : "giftStatus", clz : "text", label : "状态"},
		{key : "userName", clz : "text", label : "姓名"},
		{key : "userSex", clz : "text", label : "性别"},
		{key : "userMobile", clz : "text", label : "手机号"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var r = {value : '', text : ''}, v = $XP(row, colKey, '');
		var userInfo = $XP(row, 'userInfo', {});
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			case "getWay":
				v = getGiftGetWayTypeSet(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');

				break;
			case "createTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "validUntilDate":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd');
				break;
			case "giftStatus":
				v = getGiftStatusTypeSet(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "userName":
				r.value = r.text = $XP(userInfo, 'userName', '');
				break;
			case "userSex":
				v = _.find(Hualala.TypeDef.GENDER, function (el) {
					return $XP(el, 'value') == $XP(userInfo, 'userSex', '');
				});
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "userMobile":
				r.value = r.text = $XP(userInfo, 'userMobile', '');
				break;
		}
		return r;
	};

	/**
	 * 格式化礼品发送统计列表数据
	 * @param  {[type]} records [description]
	 * @return {[type]}         [description]
	 */
	HMCM.mapGiftDetailQuerySendRenderData = function (records) {
		var self = this;
		var clz = 'col-md-12',
			tblClz = ' table-hover mcm-grid',
			tblHeaders = MCMQueryGiftSendHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var BaseGiftUsedModel = Stapes.subclass({
		constructor : function (data) {
			this.set(data);
			this.bindEvent();
		}
	});

	BaseGiftUsedModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({

			}, self);
		}
	});

	HMCM.BaseGiftUsedModel = BaseGiftUsedModel;

	var MCMQueryGiftUsedHeaderCfg = [
		{key : "getWay", clz : "text", label : "获得方式"},
		{key : "createTime", clz : "date", label : "获得时间"},
		{key : "validUntilDate", clz : "date", label : "使用时间"},
		{key : "giftStatus", clz : "text", label : "使用店铺"},
		{key : "userName", clz : "text", label : "姓名"},
		{key : "userSex", clz : "text", label : "性别"},
		{key : "userMobile", clz : "text", label : "手机号"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var r = {value : '', text : ''}, v = $XP(row, colKey, '');
		var userInfo = $XP(row, 'userInfo', {});
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			case "getWay":
				v = HMCM.getGiftGetWayTypeSet(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');

				break;
			case "createTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "validUntilDate":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd');
				break;
			case "giftStatus":
				v = HMCM.getGiftStatusTypeSet(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "userName":
				r.value = r.text = $XP(userInfo, 'userName', '');
				break;
			case "userSex":
				v = _.find(Hualala.TypeDef.GENDER, function (el) {
					return $XP(el, 'value') == $XP(userInfo, 'userSex', '');
				});
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "userMobile":
				r.value = r.text = $XP(userInfo, 'userMobile', '');
				break;
		}
		return r;
	};

	/**
	 * 格式化礼品发送统计列表数据
	 * @param  {[type]} records [description]
	 * @return {[type]}         [description]
	 */
	HMCM.mapGiftDetailQueryUsedRenderData = function (records) {
		var self = this;
		var clz = 'col-md-12',
			tblClz = ' table-hover mcm-grid',
			tblHeaders = MCMQueryGiftUsedHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

})(jQuery, window);;(function ($, window) {
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

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var getGiftTypeSet = HMCM.getGiftTypeSet;

	var GiftDetailPage = Stapes.subclass({
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container');
			this.callServer = Hualala.Global.getMCMGiftDetail;
			this.pageCtx = Hualala.PageRoute.getPageContextByPath();
			this.giftItemID = $XP(this.pageCtx, 'params')[0];
			this.tabViewHT = new IX.IListManager();
			this.$nav = null;
			this.$tabs = null;
			this.mGiftDetail = null;
			this.breadCrumbs = null;
			this.loadTemplates();
			this.bindEvent();
			this.renderLayout();
		}
	});
	GiftDetailPage.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_giftdetail_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				gridTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerPartial("baseinfo", Hualala.TplLib.get('tpl_gift_detail'));
			Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_gift_card'));
			Handlebars.registerPartial("grid", Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				gridTpl : gridTpl
			});
		},
		bindEvent : function () {
			this.on({
				getDetail : function (params) {
					var self = this;
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					self.callServer(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn.call(self, res);
						} else {
							faildFn.call(self, res);
						}
					});
				}
			}, this);
		},
		initBreadCrumb : function () {
			var self = this,
				$nav = self.$nav,
				parentNames = Hualala.PageRoute.getParentNamesByPath();
			self.breadCrumbs = new Hualala.UI.BreadCrumb({
				container : $nav,
				hideRoot : true,
				nodes : parentNames,
				clz : 'mcm-crumbs',
				clickFn : function () {
					var $this = $(this);
					document.location.href = $this.attr('data-href');
				},
				mapRenderData : function (data, hideRoot, clz) {
					var list = _.map(data, function (el, idx, l) {
						var label = $XP(el, 'label', ''),
							name = $XP(el, 'name', ''),
							path = Hualala.PageRoute.createPath(name, null);
						return {
							clz : 'crumb',
							label : label,
							path : path,
							name : name,
							isLastNode : (data.length - 1 == idx) ? true : false
						};
					});
					hideRoot === true && list.shift();
					list.shift();
					return {
						clz : clz,
						items : list
					};
				}
			});
		},
		mapTabNavData : function (navs) {
			var self = this;
			return _.map(navs, function (nav) {
				return IX.inherit(nav, {
					clz : 'mcm-detail-tab',
					id : $XP(nav, 'value') + '_' + IX.id()
				});
			});
		},
		mapGiftStatisticGridData : function (data) {
			var self = this;
			var tblClz = 'table-striped table-hover table-condensed';
			var records = $XP(data, 'records', []),
				total = $XP(data, 'total', {});
			var getways = _.reject(Hualala.TypeDef.MCMDataSet.GiftDistributeTypes, function (el) {
				return IX.isEmpty(el.value) || !el.include;
			});
			var giftStatus = _.reject(Hualala.TypeDef.MCMDataSet.GiftStatus, function (el) {
				return IX.isEmpty(el.value);
			});
			var genGridHeader = function () {
				var thead = _.map(getways, function (el) {
					return {
						clz : '',
						label : $XP(el, 'label', '')
					};
				});
				thead.push({
					clz : '',
					label : '总计'
				});
				thead.unshift({
					clz : '',
					label : '状态'
				});
				return {
					thead : thead
				};
			};
			var genRowData = function (rowData) {
				var rows = _.map(rowData, function (row) {
					// var giftStatus = $XP(row, 'giftstatus');
					var rowHeader = _.find(giftStatus, function (gs) {
						return $XP(gs, 'value') == $XP(row, 'giftstatus');
					});
					var colkeys = _.map(getways, function (el) {
						return $XP(el, 'value');
					});
					var cols = _.map(colkeys, function (k) {
						var key = 'sum_' + k;
						var val = $XP(row, key, 0);
						return {
							clz : '',
							type : 'text',
							value : val,
							text : val
						}
					});
					cols.unshift({
						clz : '',
						type : 'text',
						value : $XP(row, 'giftstatus'),
						text : $XP(rowHeader, 'label')
					});
					cols.push({
						clz : '',
						type : 'text',
						value : $XP(row, 'totalCount', 0),
						text : $XP(row, 'totalCount', 0)
					});
					return {
						clz : '',
						cols : cols
					};

				});
				return {
					rows : rows
				};
			};
			var genGridFooter = function (total) {
				var cols = _.map(getways, function (getway) {
					var k = $XP(getway, 'value'),
						key = 'count_' + k;
					return {
						clz : '',
						value : $XP(total, key, 0),
						text : $XP(total, key, 0)
					};
				});
				cols.unshift({
					clz : '',
					value : '',
					text : '总计'
				});
				cols.push({
					clz : '',
					value : $XP(total, 'totalCount', 0),
					text : $XP(total, 'totalCount', 0)
				});
				return {
					tfoot : [
						{
							clz : '',
							cols : cols
						}
					]
				};
			};
			return IX.inherit({
				clz : '',
				tblClz : tblClz
			}, genGridHeader(), genRowData(records), genGridFooter(total));

		},
		mapLayoutRenderData : function (data) {
			var self = this;
			var giftData = $XP(data, 'records', [])[0];
			var giftTypeSet = getGiftTypeSet($XP(giftData, 'giftType')),
				navs = $XP(giftTypeSet, 'navs', []);
			var ret = {};
			var card = {
				clz : $XP(giftTypeSet, 'type', ''),
				label : $XP(giftData, 'giftValue', ''),
				unit : $XP(giftTypeSet, 'unit', '')
			};
			ret = IX.inherit(giftData, {
				card : card,
				giftTypeLabel : $XP(giftTypeSet, 'label', ''),
				giftTypeUnit : $XP(giftTypeSet, 'unit', ''),
				infoLabelClz : 'col-sm-2',
				navs : self.mapTabNavData(navs),
				grid : self.mapGiftStatisticGridData($XP(data, 'myGiftDataset.data', {}))
			});
			return ret;
		},
		renderLayout : function () {
			var self = this;
			var giftItemID = self.giftItemID;
			var renderFn = function (data) {
				var layoutTpl = self.get('layoutTpl'),
					renderData = self.mapLayoutRenderData(data);
				var htm = layoutTpl(renderData);
				self.container.html(htm);
				self.$nav = self.container.find('.detail-layout > .nav-bar');
				self.$tabs = self.container.find('.detail-tabs');
				self.initBreadCrumb();
				self.bindPageEvent();
				self.$tabs.find('.nav-tabs a:first').tab('show');
			};
			self.emit('getDetail', {
				post : {giftItemID : giftItemID},
				successFn : function (res) {
					self.mGiftDetail = new HMCM.BaseGiftModel($XP(res, 'data', {}));
					renderFn($XP(res, 'data', {}));
				},
				faildFn : function (res) {

				}
			});
		},
		bindPageEvent : function () {
			var self = this;
			self.$tabs.find('.nav-tabs a[data-toggle=tab]').on('shown.bs.tab', function (e) {
				var $tab = $(e.target),
					$tabCnt = $($tab.attr('href')),
					tabCntID = $tabCnt.attr('id');
				var activedTabView = self.getTabView(tabCntID);
				if (!activedTabView) {
					switch (tabCntID) {
						case 'tab_send':
							self.initTabSend($tabCnt);
							break;
						case 'tab_used':
							self.initTabUsed($tabCnt);
							break;
						case 'tab_give':
							self.initTabGive($tabCnt);
							break;
						case 'tab_pay':
							self.initTabPay($tabCnt);
							break;
						case 'tab_onlinesale':
							self.initTabOnlineSale($tabCnt);
							break;
					}
				}
			});
		},
		getTabView : function (id) {
			var self = this,
				tabViewHT = self.tabViewHT;
			return tabViewHT.get(id);
		},
		initTabSend : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var queryKeys = Hualala.MCM.QueryFormKeys.GiftSendStatisticQueryKeys;
			var panel = new HMCM.QueryController({
				container : $tabCnt,
				resultController : new HMCM.QueryResultControler({
					container : $tabCnt,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.queryMCMGiftDetailGetWayInfo,
						queryKeys : queryKeys,
						gridType : 'giftsend',
						recordModel : HMCM.BaseGiftSendModel
					}),
					view : new HMCM.QueryResultView({
						// mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
						mapResultRenderData : HMCM.mapGiftDetailQuerySendRenderData,
						renderResult : HMCM.renderQueryResult,
						bundleEvent : HMCM.bundleGiftsQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : queryKeys
				}),
				view : new HMCM.QueryView({
					mapRenderDataFn : HMCM.mapGiftDetailGetWayQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent
				})

			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabUsed : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var queryKeys = Hualala.MCM.QueryFormKeys.GiftUsedStatisticQueryKeys;
			var panel = new HMCM.QueryController({
				container : $tabCnt,
				resultController : new HMCM.QueryResultControler({
					container : $tabCnt,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.queryMCMGiftDetailUsedInfo,
						queryKeys : queryKeys,
						gridType : 'giftsend',
						recordModel : HMCM.BaseGiftUsedModel
					}),
					view : new HMCM.QueryResultView({
						// mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
						mapResultRenderData : HMCM.mapGiftDetailQueryUsedRenderData,
						renderResult : HMCM.renderQueryResult,
						bundleEvent : HMCM.bundleGiftsQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : queryKeys
				}),
				view : new HMCM.QueryView({
					mapRenderDataFn : HMCM.mapGiftDetailUsedQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent
				})

			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabGive : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var panel = new HMCM.MCMGiftDetailFormPanel({
				container : $tabCnt,
				parentView : self,
				formKeys : HMCM.GiftDetailDonateGiftCtrlFormKeys,
				callServer : Hualala.Global.giftDetailDonateGift,
				panelTitle : "赠送",
				mapFormElsData : HMCM.mapDonateGiftFormRenderData,
				initUIComponents : HMCM.initDonateGiftFormUIComponent,
				bundleFormEvent : HMCM.bundleDonateGiftFormEvent
			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabPay : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var panel = new HMCM.MCMGiftDetailFormPanel({
				container : $tabCnt,
				parentView : self,
				formKeys : HMCM.GiftDetailPayGiftCtrlFormKeys,
				callServer : Hualala.Global.giftDetailDonateGift,
				panelTitle : "支付",
				mapFormElsData : HMCM.mapPayGiftFormRenderData,
				initUIComponents : HMCM.initPayGiftFormUIComponent,
				bundleFormEvent : HMCM.bundlePayGiftFormEvent
			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabOnlineSale : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var panel = new HMCM.MCMGiftDetailFormPanel({
				container : $tabCnt,
				parentView : self,
				formKeys : HMCM.GiftDetailPayGiftOnlineCtrlFormKeys,
				callServer : Hualala.Global.giftDetailPayGiftOnline,
				panelTitle : "网上出售",
				mapFormElsData : HMCM.mapPayGiftOnlineFormRenderData,
				initUIComponents : HMCM.initPayGiftOnlineFormUIComponent,
				bundleFormEvent : HMCM.bundlePayGiftOnlineFormEvent
			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		}
	});

	HMCM.GiftDetailPage = GiftDetailPage;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var BaseEventTrackModel = Stapes.subclass({
		constructor : function (data) {
			this.set(data);
			this.bindEvent();
		}
	});
	BaseEventTrackModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({

			}, self);
		}
	});

	HMCM.BaseEventTrackModel = BaseEventTrackModel;

	var MCMQueryEventTrackBaseHeaderCfg = [
		{key : "customerName", clz : "text", label : "姓名"},
		{key : "customerSex", clz : "text", label : "性别"},
		{key : "cardNO", clz : "text", label : "卡号"},
		{key : "customerMobile", clz : "text", label : "手机号"},
		{key : "cardLevelName", clz : "text", label : "等级"},
		{key : "consumptionTotal", clz : "text", label : "消费累计"},
		{key : "consumptionCount", clz : "text", label : "消费次数"},
		{key : "createTime", clz : "text", label : "参与时间"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey, eventWay) {
		var self = this;
		var r = {value : '', text : ''}, v = $XP(row, colKey, '');
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			case "createTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			default:
				r.value = r.text = v;
				break;
		}
		return r;
	};

	HMCM.mapEventTrackQueryResultRenderData = function (records) {
		var self = this;
		var clz = 'col-md-12',
			tblClz = ' table-hover mcm-grid',
			tblHeaders = _.clone(MCMQueryEventTrackBaseHeaderCfg);
		var eventDetail = self.$container.data('eventDetail'),
			eventWay = $XP(eventDetail, 'eventWay');
		if (eventWay == 20) {
			tblHeaders.push({
				key : "winFlag", clz : "text", label : "中奖情况"
			});
		} else if (eventWay == 22) {
			tblHeaders.push({
				key : "winFlag", clz : "text", label : "是否入围"
			});
		}
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', ''), eventWay]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};

	};

	HMCM.bundleEventTrackQueryResultEvent = function () {

	};

	var getEventTypeSet = function (eventID) {
		var eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
		return _.find(eventTypes, function (el) {
			return $XP(el, 'eventID') == eventID;
		});
	};
	HMCM.getEventTypeSet = getEventTypeSet;

	var EventTrackPage = Stapes.subclass({
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container');
			this.callServer = Hualala.Global.getMCMEventByID;
			this.pageCtx = Hualala.PageRoute.getPageContextByPath();
			this.$nav = null;
			this.breadCrumbs = null;
			this.loadTemplates();
			this.bindEvent();
			this.renderLayout();
		}
	});

	EventTrackPage.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_eventtrack_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				gridTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerPartial("baseinfo", Hualala.TplLib.get('tpl_event_detail'));
			Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_event_card'));
			Handlebars.registerPartial("grid", Hualala.TplLib.get('tpl_base_datagrid'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				gridTpl : gridTpl
			});
		},
		bindEvent : function () {
			this.on({
				getDetail : function (params) {
					var self = this;
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					self.callServer(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn.call(self, res);
						} else {
							faildFn.call(self, res);
						}
					});
				}
			}, this);
		},
		initBreadCrumb : function () {
			var self = this,
				$nav = self.$nav,
				parentNames = Hualala.PageRoute.getParentNamesByPath();
			self.breadCrumbs = new Hualala.UI.BreadCrumb({
				container : $nav,
				hideRoot : true,
				nodes : parentNames,
				clz : 'mcm-crumbs',
				clickFn : function () {
					var $this = $(this);
					document.location.href = $this.attr('data-href');
				},
				mapRenderData : function (data, hideRoot, clz) {
					var list = _.map(data, function (el, idx, l) {
						var label = $XP(el, 'label', ''),
							name = $XP(el, 'name', ''),
							path = Hualala.PageRoute.createPath(name, null);
						return {
							clz : 'crumb',
							label : label,
							path : path,
							name : name,
							isLastNode : (data.length - 1 == idx) ? true : false
						};
					});
					hideRoot === true && list.shift();
					list.shift();
					return {
						clz : clz,
						items : list
					};
				}
			});
		},
		mapLayoutRenderData : function (data) {
			var self = this;
			var model = new HMCM.BaseEventModel(data);
			return HMCM.mapEventDetailRenderData(model);
		},
		renderLayout : function () {
			var self = this;
			var eventID = $XP(self.pageCtx, 'params')[0];
			var renderFn = function (res) {
				var layoutTpl = self.get('layoutTpl'),
					renderData = self.mapLayoutRenderData(res);
				var htm = layoutTpl(renderData);
				self.container.html(htm);
				self.$nav = self.container.find('.detail-layout > .nav-bar');
				self.$eventTrack = self.container.find('.event-track');
				self.$eventTrack.data('eventDetail', res);
				self.initBreadCrumb();
				self.initEventTrackData();
			};
			self.emit('getDetail', {
				post : {eventID : eventID},
				successFn : function (res) {
					renderFn($XP(res, 'data.records', [])[0]);
				},
				faildFn : function (res) {

				}
			});
		},
		initEventTrackData : function () {
			var self = this;
			var queryKeys = Hualala.MCM.QueryFormKeys.EventTrackBaseQueryKeys;
			var panel = new HMCM.QueryController({
				container : self.$eventTrack,
				resultController : new HMCM.QueryResultControler({
					container : self.$eventTrack,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.getMCMEventTrack,
						queryKeys : queryKeys,
						gridType : 'eventtrack',
						recordModel : HMCM.BaseEventTrackModel
					}),
					view : new HMCM.QueryResultView({
						mapResultRenderData : HMCM.mapEventTrackQueryResultRenderData,
						renderResult : HMCM.renderQueryResult,
						bundleEvent : HMCM.bundleEventTrackQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : queryKeys
				}),
				view : new HMCM.QueryView({
					// mapRenderDataFn : HMCM.mapGiftDetailGetWayQueryFormRenderData,
					mapRenderDataFn : HMCM.mapEventTrackQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent
				})

			});
		}
	});

	HMCM.EventTrackPage = EventTrackPage;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;

	var MCMHomePageInit = function () {
		Hualala.PageRoute.jumpPage(Hualala.PageRoute.createPath('mcmGiftsMgr'));
	};

	var MCMGiftsMgrInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var queryKeys = Hualala.MCM.QueryFormKeys.GiftMgrQueryKeys;
		$body.html('<h1>礼品管理页</h1>');
		var panel = new HMCM.QueryController({
			container : $body,
			resultController : new HMCM.QueryResultControler({
				container : $body,
				model : new HMCM.GiftMgrResultModel({
					callServer : Hualala.Global.getMCMGifts,
					queryKeys : queryKeys,
					gridType : 'giftlist',
					recordModel : HMCM.BaseGiftModel
				}),
				view : new HMCM.QueryResultView({
					mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
					renderResult : HMCM.renderQueryResult,
					bundleEvent : HMCM.bundleGiftsQueryResultEvent
				})
			}),
			model : new HMCM.QueryModel({
				queryKeys : queryKeys
			}),
			view : new HMCM.QueryView({
				mapRenderDataFn : HMCM.mapGiftQueryFormRenderData,
				bundleQueryEvent : HMCM.bundleGiftsQueryEvent
			})

		});
		
	};

	var MCMGiftDetailInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		$body.html('<h1>礼品详情页</h1>');
		var panel = new HMCM.GiftDetailPage({
			container : $body
		});

	};

	var MCMEventMgrInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var queryKeys = Hualala.MCM.QueryFormKeys.EventMgrQueryKeys;
		$body.html('<h1>活动管理页</h1>');
		var panel = new HMCM.QueryController({
			container : $body,
			resultController : new HMCM.QueryResultControler({
				container : $body,
				model : new HMCM.GiftMgrResultModel({
					callServer : Hualala.Global.getMCMEvents,
					queryKeys : queryKeys,
					gridType : 'eventlsit',
					recordModel : HMCM.BaseEventModel
				}),
				view : new HMCM.QueryResultView({
					mapResultRenderData : HMCM.mapEventsQueryResultRenderData,
					renderResult : HMCM.renderQueryResult,
					bundleEvent : HMCM.bundleEventsQueryResultEvent
				}),
				// view : new HMCM.QueryResultView({
				// 	mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
				// 	renderResult : HMCM.renderQueryResult,
				// 	bundleEvent : HMCM.bundleGiftsQueryResultEvent
				// })
			}),
			model : new HMCM.QueryModel({
				queryKeys : queryKeys
			}),
			view : new HMCM.QueryView({
				mapRenderDataFn : HMCM.mapEventQueryFormRenderData,
				bundleQueryEvent : HMCM.bundleEventsQueryEvent
			})
		});
	};

	var MCMEventTrackInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		$body.html('<h1>活动跟踪页</h1>');
		var panel = new HMCM.EventTrackPage({
			container : $body
		});
	};

	HMCM.MCMHomePageInit = MCMHomePageInit;
	HMCM.MCMGiftsMgrInit = MCMGiftsMgrInit;
	HMCM.MCMGiftDetailInit = MCMGiftDetailInit;
	HMCM.MCMEventMgrInit = MCMEventMgrInit;
	HMCM.MCMEventTrackInit = MCMEventTrackInit;
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Common");
	var pageBrickConfigs = [
		{name : 'setting', title : '业务', label : '开通业务•业务参数', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-setting'},
		{name : 'account', title : '结算', label : '账户设置•提现•结算报表', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-pay'},
		{name : 'order', title : '订单', label : '查询•报表•菜品排行', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-order'},
		{name : 'shop', title : '店铺', label : '开店•信息•菜谱', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-home'},

		{name : 'pcclient', title : '下载', label : '哗啦啦代理程序', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-download'},
		{name : 'user', title : '权限', label : '用户•权限', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-lock'},
        {name : 'weixin', title : '微信', label : '网络餐厅•营销', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-weixin'},
		{name : 'crm', title : '会员', label : '概览•报表•参数•营销', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-crm'},
		{name : 'mcm', title : '营销', label : '礼品•营销活动', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-crm'}
		
		
		
	];
	function isSupportedBrowser () {
		var bd = Hualala.Common.Browser;
		var isIE = !$XP(bd, 'ie', null) ? false : true,
			version = parseInt($XP(bd, 'ie', 0));
		var allowOldVersion = IX.Cookie.get('allowOldVersion') == 1 ? true : false;
		if (!isIE || allowOldVersion) return true;
		if (version > 8) return true;
		var msg = version == 8 ? 
			'您使用的IE浏览器版本过于陈旧，可能无法获得我们为您提供的良好的用户体验。<br/>我们建议您使用以下的浏览器或插件进行访问！' : 
			'您使用的IE浏览器版本过于陈旧，无法使用我们为您提供的管理功能。<br/>请您使用以下提供的浏览器进行访问！';
		var browserLib = [
			{
				href : 'http://www.microsoft.com/zh-cn/download/internet-explorer-9-details.aspx',
				icon : 'icon-ie9',
				name : 'IE9',
				desc : 'IE9浏览器是微软公司在2009年推出的新一代浏览器，比IE8界面更简洁，采用硬件加速功能，使访问页面更稳定，部分支持HTML5，CSS3特性。'
			},
			{
				href : 'http://www.microsoft.com/zh-cn/download/internet-explorer-10-details.aspx',
				icon : 'icon-ie10',
				name : 'IE10',
				desc : 'IE10浏览器是微软公司在2011年推出的IE9的下一代浏览器，在IE9的基础上增强了CSS3解析及硬件加速功能，并支持了HTML5。'
			},
			{
				href : 'http://www.google.cn/intl/zh-CN/chrome/',
				icon : 'icon-chrome',
				name : 'Chrome',
				desc : 'Chrome浏览器是由著名的搜索引擎巨头--谷歌(google)公司推出的现代浏览器，访问网页速度更快，稳定性更强，更具安全性，使用界面更加简洁有效，并完全支持HTML5，CSS3标准的特性。'
			},
			{
				href : 'http://www.firefox.com.cn/download/',
				icon : 'icon-firefox',
				name : 'Firefox',
				desc : 'FireFox是Mozilla推出的现代浏览器，全面支持HTML5，CSS3标准的特性。访问页面速度更快，更具安全性。'
			},
			{
				href : 'http://ie.sogou.com/',
				icon : 'icon-sogou',
				name : '搜狗浏览器',
				desc : '搜狗浏览器是搜狐公司推出的双核告诉浏览器--可以切换为全球最快的Webkit内核(Chrome浏览器)同时也可以切换为使用最普遍的IE内核(IE浏览器)，保证良好的兼容性的同时极大的提升网页的浏览速度。'
			}
		];
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_browserSupport'));
		var $jumbotron = $(tpl({msg : msg, items : browserLib}));
		$('body > #ix_wrapper').remove();
		$jumbotron.appendTo($('body'));
		$jumbotron.find('.btn').click(function (e) {
			IX.Cookie.set('allowOldVersion', 1);
			Hualala.Router.check();
		});
		return false;
	}
	function initPageLayout (pageCfg, pageType) {
		var session = Hualala.getSessionData(),
			layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_layout'));
		var isLogin = !$XP(Hualala.getSessionUser(), 'loginName', null) ? false : true,
			loginName = $XP(session, 'user.loginName', ''),
			isSuperAdmin = false,
			groupName = $XP(session, 'site.groupName', '');
		var bindMobileWizard = IX.Cookie.get('bindMobileWizard') == 1 ? false : true;
		if ($XP(session, 'user.loginName') == 'admin' && _.find($XP(session, 'user.role', []), function (r) {return r == 'admin'})) {
			isSuperAdmin = true;
		}
		var mapRanderData = function () {
			var header = {
				pcClientPath : Hualala.PageRoute.createPath('pcclient'),
				hualalaUrl : Hualala.Global.HualalaWebSite,
				loginName : loginName,
				merchantRoot : Hualala.PageRoute.createPath('main'),
				groupName : groupName,
				// isLogin : !isLogin ? 'hidden' : '',
				isLogin : isLogin,
				logoutPath : Hualala.Global.getLogoutJumpToUrl(),
				logo : Hualala.Global.getDefaultImage('logo'),
				isSuperAdmin : isSuperAdmin
			},
			footer = {
				aboutPath : Hualala.PageRoute.createPath("about") || '#',
				contactPath : Hualala.PageRoute.createPath("contact") || '#',
				// aboutPath : Hualala.Global.getAboutUsUrl() || '#',
				// contactPath : Hualala.Global.getContactUsUrl() || '#',
				gozapLogo : Hualala.Global.getDefaultImage('gozap')
			};
			return {
				header : header,
				footer : footer
			};
		};
		var $wrapper = $(layoutTpl(mapRanderData()));
		var userMgr = null;
		$('body > #ix_wrapper').remove();
		if (isSupportedBrowser()) {
			$wrapper.appendTo($('body'));
            if(/main|pcclient|about|contact|login/.test(pageType))
                $wrapper.addClass('no-nav');
			if (isLogin) {
				userMgr = new Hualala.User.UserMgrModal({
					$btnGrp : $wrapper.find('.user-mgr')
				});
				if (bindMobileWizard && $XP(session, 'user.mobileBinded') == 0 && $XP(session, 'user.loginCount') == 1) {
					$wrapper.find('.user-mgr .btn[data-target=bind_mobile]').trigger('click');
					IX.Cookie.set('bindMobileWizard', 1);
				}
			}
			var footerAnimation = function (expand) {
				var $footer = $('#ix_wrapper .ix-footer');
				var $cnt = $footer.find('.footer-cnt');
				if ($footer.hasClass('in') == expand) return;
				$cnt.animate({
					height : !expand ? '0px' : '100px'
				}, 400, function () {
					$footer[!expand ? 'removeClass' : 'addClass']('in');
				});
			}
			// @NOTE: For 1.1 hidden site footer (#4105)
			// $('#ix_wrapper .ix-footer').on('mouseleave', function (e) {
			// 	footerAnimation(false);
			// });
			// $('#ix_wrapper .btn-toggle').on('mouseenter', function (e) {
			// 	footerAnimation(true);
			// });
			// footerAnimation(false);
		}
		if ($.fn.bootstrapValidator) {
			$.fn.bootstrapValidator.DEFAULT_OPTIONS = $.extend({}, $.fn.bootstrapValidator.DEFAULT_OPTIONS, {
				message: '您输入的数据有误，请核对后再次输入',
                trigger: 'blur',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				}
			});
			$.fn.bootstrapValidator.validators.accuracy = {
				validate : function (validator, $field, options) {
					var accuracy = $XP(options, 'accuracy', null),
						message = $XP(options, 'message', '');
					accuracy = isNaN(accuracy) ? null : accuracy;
					var value = $field.val();
					var regxStr = (IX.isEmpty(accuracy) || accuracy == 0) ? "^\\d+$" : "^\\d+(\\.\\d{1," + accuracy + "})?$",
						regX = null;
					regX = new RegExp(regxStr);
					if (isNaN(value)) {
						return {
							valid : false,
							message : "只能是数字"
						}
					}
					if (!regX.test(value)) {
						return {
							valid : false,
							message : message
						}
					}
					return true;
				}
			};
		}
	}

	function initSiteNavBar (pageType) {
		var session = Hualala.getSessionData(),
			navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbar')),
			navToggleTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbarToggle')),
			rights = Hualala.getSessionUserRight();
		var mapRanderData = function () {
			var rightHT = new IX.IListManager();
			IX.iterate(rights, function (el) {
				rightHT.register(el.name, el);
			});
			// var navs = _.map(Hualala.TypeDef.SiteNavType, function (v, i, list) {
			// 	var hasRight = !rightHT.get(v.name) ? false : true;
			// 	return {
			// 		active : !Hualala.Global.isCurrentPage(v.name) ? '' : 'active',
			// 		disabled : !hasRight ? 'disabled' : '',
			// 		noPath : !hasRight ? true : false,
			// 		path : Hualala.PageRoute.createPath(v.name) || '#',
			// 		name : v.name,
			// 		label : v.label,
			// 	};
			// });
			var navs = _.map(Hualala.TypeDef.SiteNavType, function (v, i, list) {
				var hasRight = !rightHT.get(v.name) ? false : true;
				var subnavs = $XP(v, 'subnavs', []);
				subnavs = _.map(subnavs, function (s) {
					return {
						path : Hualala.PageRoute.createPath(s.name) || '#',
						name : s.name,
						label : s.label
					};
				});
				var list = {
					active : !Hualala.Global.isCurrentPage(v.name) ? '' : 'active',
					disabled : !hasRight ? 'disabled' : '',
					noPath : !hasRight ? true : false,
					path : Hualala.PageRoute.createPath(v.name) || '#',
					name : v.name,
					label : v.label,
					isSubNav : v.type == 'subnav' ? true : false,
					subnavs : subnavs
				};
				return list;
			});
			return {items : navs};
		};
		var $navbar = $(navTpl(mapRanderData())),
			$navToggle = $(navToggleTpl({target : '#site_navbar'})),
			$header = $('#ix_wrapper .ix-header');
		$header.find('> .container .navbar-collapse').remove();
		$header.find('> .container').append($navbar);
		$header.find('> .container > .navbar-header .navbar-toggle').remove();
		$header.find('> .container > .navbar-header').prepend($navToggle);

	}

	function initHomePage (pageType, params) {
		var site = Hualala.getSessionSite(),
			user = Hualala.getSessionUser(),
			roles = Hualala.getSessionRoles(),
			pcclient = Hualala.getSessionPCClient(),
			rights = Hualala.getSessionUserRight();
		var $body = $('#ix_wrapper > .ix-body > .container');
		var mapRanderData = function () {
			var ht = new IX.IListManager();
			var ret = null;
			IX.iterate(rights, function (el) {
				ht.register(el.name, el);
			});
			ret = _.map(pageBrickConfigs, function (el, i, l) {
				var name = $XP(el, 'name');
				var hasRight = !ht.get(name) ? false : true;
				return IX.inherit(el, {
					itemClz : ($XP(el, 'itemClz', '') + ' ' + (!hasRight ? 'disabled' : ''))
				});
			});
			return ret;
		};
		// Home Page 
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_homepage'));
		var $bricks = $(tpl({bricks : mapRanderData()}));
		$body.html($bricks);
		$bricks.on('mouseenter mouseleave click', '.brick-item', function (e) {
			var $this = $(this), pageName = $this.attr('data-pagename'),
				eType = e.type;
			if ($this.hasClass('disabled')) return false;
			if (eType == 'click') {
				// console.info($this.attr('data-pagename'));
				document.location.href = Hualala.PageRoute.createPath(pageName);
			} else {
				$this.toggleClass('hover');
			}
			
		});
	}

	function initLoginPage (pageType, params) {
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_login'));
		var $loginBox = $(tpl({
			bannerImg : Hualala.Global.getDefaultImage('loginBanner')
		}));
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html($loginBox);
		var loginPanel = new Hualala.Entry.initLogin({
			$container : $loginBox
		});
	}

	function initAboutPage (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body');
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_about'));
		var $page = $(tpl());
		$page.replaceAll($body);
	}

	function initContactPage (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body');
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_contact'));
		var $page = $(tpl());
		$page.replaceAll($body);
	}

	function initPCClientDownloadPage () {
		var $body = $('#ix_wrapper > .ix-body');
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_client_download'));
		var sessionData = Hualala.getSessionData();

		var $page = $(tpl({
			href : $XP(sessionData, 'pcClient.downloadClientAddress', '#'),
			title : $XP(sessionData, 'pcClient.version', ''),
		}));
		$page.replaceAll($body);
	}


	Hualala.Common.LoginInit = initLoginPage;
	Hualala.Common.initPageLayout = initPageLayout;
	Hualala.Common.initSiteNavBar = initSiteNavBar;
	Hualala.Common.HomePageInit = initHomePage;
	Hualala.Common.AboutInit = initAboutPage;
	Hualala.Common.ContactInit = initContactPage;
	Hualala.Common.PCClientDownloadInit = initPCClientDownloadPage;
	

	Hualala.Common.IndexInit = function () {
		document.location.href = Hualala.PageRoute.createPath("main");
	}
	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala");
	var sessionData = null;
	// 获取SessionData
	Hualala.getSessionData = function () {return sessionData;};
	Hualala.getSessionSite = function () {return $XP(sessionData, 'site', null); };
	Hualala.getSessionUser = function () {return $XP(sessionData, 'user', null); };
	Hualala.getSessionRoles = function () {return $XP(sessionData, 'roles', []); };
	Hualala.getSessionPCClient = function () {return $XP(sessionData, 'pcClient', null); };
	Hualala.getSessionUserRight = function () {return $XP(sessionData, 'userRight', [])};
	// 判断指定用户是否为当前登录用户
	Hualala.isSessionUser = function (groupLoginName, loginName) {
		var _name = $XP(sessionData, 'user.groupLoginName') + $XP(sessionData, 'user.loginName');
		return sessionData && _name == (groupLoginName + loginName);
	};

	function loadSession(appData, cbFn) {
		if (!$XP(appData, 'user', null)) {
			throw("Permission Deny!!");
			return;
		}
		sessionData = appData;
		cbFn();
	}

	function initMainPage(cbFn) {
		var tick = IX.getTimeInMS();
		log("Merchant Sys INIT : " + tick);
		Hualala.Global.loadAppData({}, function (appData) {
			log("Load Merchant APP Data in (ms): " + (IX.getTimeInMS() - tick));
			if ($XP(appData, 'resultcode') != 0) {
				sessionData = null;
				document.location.href = Hualala.PageRoute.createPath('login');
				throw("Session Data Load Faild!! resultcode = " + $XP(appData, 'resultcode', '') + "; resultMsg = " + $XP(appData, 'resultmsg', ''));
				return;	
			}
			loadSession($XP(appData, 'data', {}), function () {
				log("Merchant Sys INIT DONE in (ms): " + (IX.getTimeInMS() - tick));
				cbFn();
			});
		}, function () {
			document.location.href = Hualala.PageRoute.createPath('login');
			return ;
		});
	}

	function initRouteEngine () {
		if (!IX.nsExisted("Hualala.ajaxEngine.init")) return;
		$.ajaxSetup({
			beforeSend : function (xhr) {
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		});
		Hualala.ajaxEngine.init({
			ajaxFn : jQuery.ajax,
			baseUrl : Hualala.Global.HOME,
			commonUrl : Hualala.Global.CommonSite,
			imgUrl : Hualala.Global.IMAGE_ROOT
		});
		// Hualala.urlEngine would be initialized as ajaxEngine was initialized! ignore urlEngine's initializing.
	};

	
	/**
	 * 商户系统整体加载
	 * @param  {Object} cfg {config:{}, type : "页面类型login|main|shop|setting|account|user..."}
	 * @return {NULL}     
	 */
	var APPInitialized = false, currentType;
	
	Hualala.init = function () {
		if (!APPInitialized) {
			initRouteEngine();
			
			// initMainPage(function () {
			// 	Hualala.PageRoute.start(function (pageName) {
			// 		var hasNoNavPages = 'main,pcclient,about,contact';
			// 		Hualala.Common.initPageLayout({}, pageName);
			// 		if (hasNoNavPages.indexOf(pageName) < 0) {
			// 			Hualala.Common.initSiteNavBar(pageName);
			// 		}
			// 	});
			// });

			Hualala.PageRoute.start(function (pageName, pageParams, pageInitFn) {
				var hasNoNavPages = 'main,pcclient,about,contact,login';
				var commonPages = _.filter(hasNoNavPages.split(','), function (v) {return v != 'main'}).join(',');
				if (commonPages.indexOf(pageName) >= 0) {
					Hualala.Common.initPageLayout({}, pageName);
					if (hasNoNavPages.indexOf(pageName) < 0) {
						Hualala.Common.initSiteNavBar(pageName);
					}
					pageInitFn && pageInitFn.apply(null, [pageName, pageParams]);
					return ;
				}
				initMainPage(function () {
					Hualala.Common.initPageLayout({}, pageName);
					if (hasNoNavPages.indexOf(pageName) < 0) {
						Hualala.Common.initSiteNavBar(pageName);
					}

					pageInitFn && pageInitFn.apply(null, [pageName, pageParams]);
				});
			});
			
			APPInitialized = true;
		}
	};

})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.PageRoute");
	var Router = Hualala.Router,
		routes = Hualala.Global.Route;
	var isInitialized = false,
		PageConfigurations = {},
		Path2NameMapping = {};

	function mappingRoute (_path, _name, _reg) {
		var match = _path.match(_reg);
		if (!match) return;
		var s = match.shift(),
			arr = s.split('/');
		arr = _.map(arr, function (v, i, l) {
			var bingo = _.indexOf(s, v);
			if (bingo > -1) {
				return '_';
			}
			return v;
		});
		arr.push(""); arr.unshift("");
		var _pattern = arr.join("_");
		Path2NameMapping[_pattern] = _name;
	}

	var detectPageInitializor = (function () {
		var ht = new IX.I1ToNManager();
		var fnames = [];
		function _checkItem(fname) {
			if (!IX.isFn(IX.getNS(fname)))
				return false;
			var _list = ht.get(fname),
				_fn = IX.getNS(fname);
			for (var j = 0; j < _list.length; j++)
				PageConfigurations[_list[j]].init = _fn;
			ht.remove(fname);
			return true;
		}

		function _checking() {
			fnames = IX.loop(fnames, [], function (acc, fname) {
				if (!_checkItem(fname))
					acc.push(fname);
				return acc;
			});
			return fnames.length == 0;
		}

		function _check () {
			fnames = IX.Array.toSet(fnames);
			IX.checkReady(_checking, IX.emptyFn, 40, {
				maxAge : 15000,
				expire : function () {
					//alert("Can't find page inializor : \n" + fnames.join("\n"));
				}
			});
		}
		
		function _detect(name, fname) {
			var _fn = null;
			if (IX.isFn(fname)) {
				_fn = fname;
			} else if (!IX.isString(fname)) {
				throw("Configuration failed : Invalid Page Initialized for " + name);
				return false;
			} else if (IX.nsExisted(fname)) {
				_fn = IX.getNS(fname);
			}
			if (IX.isFn(_fn)) {
				return PageConfigurations[name].init = _fn;
			}
			ht.put(fname, name);
			fnames.push(fname);
		}
		return {
			start : function () {setTimeout(_check, 1);},
			detect : _detect
		}
	})();

	/**
	 * 获取路由路径
	 * @param  {String} name   路由配置的名称
	 * @param  {Array|NULL} params 组装路由需要的参数，按照路由规则按顺序给出参数
	 * @return {String}        返回生成的路由
	 */
	function getPathByName (name, params) {
		var cfg = PageConfigurations[name];
		if (!cfg) 
			return console.err("Can't find route : " + name);
		var path = $XP(cfg, 'path'), reg = $XP(cfg, 'reg'),
			match = path.match(reg);
		var genPath = function (p) {
			return Hualala.Global.HOME + p;
		};
		if (!match || match.length < 1) {
			return console.err("The Path of Route (" + name + ") is wrong!!");
		} else if (match.length == 1) {
			return genPath(path);
		} else if (match.length > 1 && IX.isArray(params) && (match.length - 1) == params.length) {
			match.shift();
			_.each(match, function (v, i, m) {
				path = path.replace(v, params[i]);
			});
			return genPath(path);
		}
	}
	/**
	 * pageConfig : {
	 * 		name : "",
	 * 		path : "",
	 * 		reg : RegExp,
	 * 		bodyClz : "", default ""
	 * 		PageInitiator : "Hualala.User.init" or function (cfg) {}
	 * }
	 * @param  {[type]} cbFn [description]
	 * @return {[type]}      [description]
	 */
	var pageConfigs = [
		// home page 主页
		// 登录
		{
			name : "login", path : "/#login", reg : /login$/, bodyClz : "",
			PageInitiator : "Hualala.Common.LoginInit", label : "登录"
		},
		// home page主页
		{
			name : "main", path : "/#home", reg : /home$/, bodyClz : "home",
			PageInitiator : "Hualala.Common.HomePageInit", label : "首页"
		},

		// 店铺管理主页		
		{
			name : "shop", path : "/#shop", reg : /shop$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.HomePageInit", parentName : "main", label : "店铺管理"
		},
		// 创建店铺
		{
			name : "shopCreate", path : "/#shop/create", reg : /shop\/create$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.CreateShopInit", parentName : "shop", label : "创建店铺"
		},
		// 店铺信息管理
		{
			name : "shopInfo", path : "/#shop/{id}/info", reg : /shop\/(.*)\/info$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.BaseInfoMgrInit", parentName : "shop", label : "店铺信息"
		},
		// 店铺菜单管理
		{
			name : "shopMenu", path : "/#shop/{id}/menu", reg : /shop\/(.*)\/menu$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.FoodMenuMgrInit", parentName : "shop", label : "菜单管理"
		},

		// 店铺功能设置页面
		{
			name : "setting", path : "/#setting", reg : /setting$/, bodyClz : "",
			PageInitiator : "Hualala.Setting.ShopMgrInit", parentName : "main", label : "业务设置"
		},

		// 结算账户页面
		{
			name : "account", path : "/#account", reg : /account$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountListInit", parentName : "main", label : "资金结算"
		},
		// 结算账户详情设置页面
		{
			name : "accountDetail", path : "/#account/{id}/detail", reg : /account\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountMgrInit", parentName : "account", label : "账户明细"
		},

		// 用户管理页面
		{
			name : "user", path : "/#user", reg : /user$/, bodyClz : "",
			PageInitiator : "Hualala.User.UserListInit", parentName : "main", label : "用户管理"
		},

		// 订单报表页面
		{
			name : "order", path : "/#order", reg : /order$/, bodyClz : "",
			PageInitiator : "Hualala.Order.OrderChartInit", parentName : "main", label : "订单报表"
		},

		// 订单查询页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			s : order status ID
			n : shop ID
			m : mobile number
			o : order key
			i : min amount
			a : max amount

		 */
		{
			name : "orderQuery", path : "/#order/query/b{begin}/e{end}/c{cityID}/n{shopID}/s{status}/m{mobile}/o{orderKey}/i{minAmount}/a{maxAmount}", 
			reg : /order\/query\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)\/m(.*)\/o(.*)\/i(.*)\/a(.*)$/,
			bodyClz : "", PageInitiator : "Hualala.Order.QueryOrderInit", parentName : "main", label : "订单查询"
		},

		// 订单日汇总页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			s : order status ID
			n : shop ID
		 */
		{
			name : "orderQueryDay", path : "/#order/query/day/b{begin}/e{end}/c{cityID}/n{shopID}/s{status}",
			reg : /order\/query\/day\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)/, bodyClz : "",
			PageInitiator : "Hualala.Order.QueryOrderByDayDetailInit", parentName : "main", label : "订单日汇总"
		},

		// 订单期间汇总页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			s : order status ID
			n : shop ID
		 */
		{
			name : "orderQueryDuring", path : "/#order/query/during/b{begin}/e{end}/c{cityID}/n{shopID}/s{status}",
			reg : /order\/query\/during\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)/, bodyClz : "", 
			PageInitiator : "Hualala.Order.QueryOrderByDuringDetailInit", parentName : "main", label : "订单期间汇总"
		},

		// 菜品销售排行页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			n : shopID
			s : foodCategoryName
		 */
		{
			name : "orderDishesHot", path : "/#order/dishes/hot/b{begin}/e{end}/c{cityID}/n{shopID}/s{foodCategoryName}",
			reg : /order\/dishes\/hot\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)/, bodyClz : "",
			PageInitiator : "Hualala.Order.QueryOrderDishesHotInit", parentName : "main", label : "菜品销量排行"
		},

		// 订餐客户查询页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			n : shopID
			u : customerName
			m : mobile
		 */
		{
			name : "orderQueryCustomer", path : "/#order/customer/b{begin}/e{end}/c{cityID}/n{shopID}/m{mobile}/u{customerName}",
			reg : /order\/customer\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/m(.*)\/u(.*)/, bodyClz : "",
			PageInitiator : "Hualala.Order.QueryOrderCustomerInit", parentName : "main", label : "顾客统计"
		},

		// 营销活动管理模块(MCM)
		{
			name : "mcm", path : "/#mcm",
			reg : /mcm$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMHomePageInit", parentName : "main", label : "营销"
		},
		{
			name : "mcmGiftsMgr", path : "/#mcm/gifts",
			reg : /mcm\/gifts$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMGiftsMgrInit", parentName : "mcm", label : "礼品管理"
		},
		{
			name : "mcmGiftDetail", path : "/#mcm/gift/{giftItemID}/detail",
			reg : /mcm\/gift\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMGiftDetailInit", parentName : "mcmGiftsMgr", label : "礼品使用详情"
		},
		{
			name : "mcmEventMgr", path : "/#mcm/evts",
			reg : /mcm\/evts$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMEventMgrInit", parentName : "mcm", label : "营销活动管理"
		},
		{
			name : "mcmEventTrack", path : "/#mcm/evt/{eventID}/track",
			reg : /mcm\/evt\/(.*)\/track$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMEventTrackInit", parentName : "mcmEventMgr", label : "活动跟踪"
		},

		// 会员系统管理
		/*
			
		 */
		{
			name : "crm", path : "/#crm",
			reg : /crm$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CRMHomePageInit", parentName : "main", label : "会员管理"
		},
		{
			name : "crmMemberSchema", path : "/#crm/member/schema",
			reg : /crm\/member\/schema$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.MemberSchemaInit", parentName : "crm", label : "会员概览"
		},
		{
			name : "crmQueryMember", path : "/#crm/member/query",
			reg : /crm\/member\/query/, bodyClz : "",
			PageInitiator : "Hualala.CRM.QueryMemberInit", parentName : "crm", label : "会员查询"
		},
		{
			name : "crmMemberDetail", path : "/#crm/member/{id}/detail",
			reg : /crm\/member\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.MemberDetailInit", parentName : "crmQueryMember", label : "会员详情"
		},
		{
			name : "crmCardStats", path : "/#crm/member/cardstat",
			reg : /crm\/member\/cardstat$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CardStatisticInit", parentName : "crm", label : "入会统计"
		},
		{
			name : "crmDealSummary", path : "/#crm/deal/sum",
			reg : /crm\/deal\/sum/, bodyClz : "",
			PageInitiator : "Hualala.CRM.DealSummaryInit", parentName : "crm", label : "储值消费汇总"
		},
		{
			name : "crmDealDetail", path : "/#crm/deal/detail",
			reg : /crm\/deal\/detail/, bodyClz : "",
			PageInitiator : "Hualala.CRM.DealDetailInit", parentName : "crm", label : "交易明细"
		},
		{
			name : "crmRechargeReconciliation", path : "/#crm/deal/recharge",
			reg : /crm\/deal\/recharge/, bodyClz : "",
			PageInitiator : "Hualala.CRM.RechargeReconciliationInit", parentName : "crm", label : "储值对账"
		},
		{
			name : "crmParameter", path : "/#crm/settings/params",
			reg : /crm\/settings\/params$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CRMSettingsParamsInit", parentName : "crm", label : "会员系统参数"
		},
        {
			name : "crmCardLevels", path : "/#crm/settings/levels",
			reg : /crm\/settings\/levels$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CRMSettingsLevelsInit", parentName : "crm", label : "会员等级"
		},
		{
			name : "crmRechargePackageBusiness", path : "/#crm/settings/recharge",
			reg : /crm\/settings\/recharge$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.RechargePackageBusinessInit", parentName : "crm", label : "充值套餐"
		},
		{
			name : "crmShopSpecialPrice", path : "/#crm/settings/ssp",
			reg : /crm\/settings\/ssp/, bodyClz : "",
			PageInitiator : "Hualala.CRM.ShopSpecialPriceInit", parentName : "crm", label : "店铺特惠"
		},
        
        // 微信系统管理
		{
			name : "weixin", path : "/#weixin",
			reg : /weixin$/, bodyClz : "",
			PageInitiator : "Hualala.Weixin.homeInit", parentName : "main", label : "微信管理"
		},
		{
			name : "wxReply", path : "/#weixin/admin/reply",
			reg : /weixin\/admin\/reply$/, bodyClz : "wx-reply",
			PageInitiator : "Hualala.Weixin.replyInit", parentName : "weixin", label : "自动回复"
		},
		{
			name : "wxSubscribe", path : "/#weixin/admin/subscribe",
			reg : /weixin\/admin\/subscribe$/, bodyClz : "wx-subscribe",
			PageInitiator : "Hualala.Weixin.subscribeInit", parentName : "weixin", label : "关注自动回复"
		},
		{
			name : "wxMenu", path : "/#weixin/admin/menu",
			reg : /weixin\/admin\/menu$/, bodyClz : "wx-menu",
			PageInitiator : "Hualala.Weixin.menuInit", parentName : "weixin", label : "自定义菜单"
		},
        {
			name : "wxQrCode", path : "/#weixin/admin/qrcode",
			reg : /weixin\/admin\/qrcode$/, bodyClz : "wx-qrcode",
			PageInitiator : "Hualala.Weixin.qrCodeInit", parentName : "weixin", label : "二维码维护"
		},
		{
			name : "wxAdvertorial", path : "/#weixin/material/advertorial",
			reg : /weixin\/material\/advertorial$/, bodyClz : "wx-advertorial",
			PageInitiator : "Hualala.Weixin.advertorialInit", parentName : "weixin", label : "软文管理"
		},
        {
			name : "wxContent", path : "/#weixin/material/content",
			reg : /weixin\/material\/content$/, bodyClz : "wx-content",
			PageInitiator : "Hualala.Weixin.contentInit", parentName : "weixin", label : "图文管理"
		},
        {
			name : "wxText", path : "/#weixin/material/text",
			reg : /weixin\/material\/text$/, bodyClz : "wx-text",
			PageInitiator : "Hualala.Weixin.textInit", parentName : "weixin", label : "文本管理"
		},

		// PC客户端下载页面
		{
			name : "pcclient", path : "/#download", reg : /download$/, bodyClz : "",
			PageInitiator : "Hualala.Common.PCClientDownloadInit", parentName : "main", label : "客户端下载"
		},

		// 关于商户中心
		{
			name : "about", path : "/#about", reg : /about$/, bodyClz : "",
			PageInitiator : "Hualala.Common.AboutInit", parentName : "main", label : "关于"
		},

		// 联系我们
		{
			name : "contact", path : "/#contact", reg : /contact$/, bodyClz : "",
			PageInitiator : "Hualala.Common.ContactInit", parentName : "main", label : "联系我们"
		},
		// 上面的path都匹配不到，需要自动跳转home
		{
			name : "index", path : "", reg : /(.*)$/, bodyClz : "",
			PageInitiator : "Hualala.Common.IndexInit"
		}
	];
	IX.iterate(pageConfigs, function (cfg) {
		var _cfg = IX.inherit({
			bodyClz : "ix-minor",
			path : ""
		}, cfg);
		var _name = $XP(cfg, 'name'), _path = $XP(cfg, 'path'), _reg = $XP(cfg, 'reg');
		mappingRoute(_path, _name, _reg);
		PageConfigurations[_name] = {
			name : _name, bodyClz : $XP(_cfg, 'bodyClz', ''), path : _path, reg : $XP(_cfg, 'reg', null),
			parentName : $XP(cfg, 'parentName', null), label : $XP(cfg, 'label', '')
		};
		var _pageInit = "PageInitiator" in _cfg ? _cfg.PageInitiator : null;
		if (!IX.isString(_pageInit) && !IX.isFn(_pageInit))
			_pageInit = IX.emptyFn;
		detectPageInitializor.detect(_name, _pageInit);
	});
	detectPageInitializor.start();

    var $body = $('body');
	Hualala.PageRoute.start = function (cbFn) {
		isInitialized = true;
		Router.flush().config({mode : 'history', root : Hualala.Global.HOME});
		// Router.flush().config({mode : 'history'});
		// IE Browser can not support this method ??
		_.each(PageConfigurations, function (route, name, l) {
			var re = $XP(route, 'reg'), initFn = $XF(route, 'init'), handler = null;
			
			handler = function (params) {
				IX.Debug.info("INFO: Init Page : [" + name + "]");
				IX.Debug.info("INFO: Page Arguments : [" + params + "]");
                $body.removeClass().addClass(route.bodyClz);
				IX.isFn(cbFn) && cbFn(name, params, initFn);
				
				// initFn && initFn.apply(null, [name, params]);
			};
			
			Router.add(re, handler);
		});
		Router.listen().check();
	};

	Hualala.PageRoute.createPath = getPathByName;

	Hualala.PageRoute.getCurrentPath = function () {
		return location.hash;
	};

	Hualala.PageRoute.getPageContextByPath = function (path) {
		var fragment = path || Hualala.Router.getFragment();
		var match = _.filter(PageConfigurations, function (el, k, l) {
			return !!fragment.match(el.reg);
		});
		var params = null;
		if (match.length == 0) return null;
		if (match.length == 1) {
			params = fragment.match(match[0]['reg']);
			params.shift();
			return IX.inherit({params : params}, match[0]);
		}
		match = _.filter(match, function (el, k, l) {
			return el.name != 'index';
		});
		params = fragment.match(match[match.length - 1]['reg']);
		params.shift();
		return IX.inherit({params : params}, match[match.length - 1]);
	};

	Hualala.PageRoute.getParentNamesByPath = function (path) {
		var curContext = Hualala.PageRoute.getPageContextByPath(path);
		var curName = $XP(curContext, 'name', null);
		var ret = [];
		while(!IX.isEmpty(curName)) {
			ret.unshift({
				name : curName,
				label : $XP(curContext, 'label', ''),
                path: Hualala.PageRoute.createPath(curName, curContext.params)
			});
			var parentName = $XP(curContext, 'parentName', null);
			curContext = IX.isEmpty(parentName) ? null : $XP(PageConfigurations, parentName, null);
			curName = $XP(curContext, 'name', null);
		}
        ret[ret.length - 1].isLastNode = true;
		return ret;
	};
    
    Hualala.PageRoute.getPageLabelByName = function (name) {
        if(!name) return null;
        var cfg = PageConfigurations[name];
        if(!cfg) return null;
        return cfg.label;
    };
    
    Hualala.PageRoute.jumpPage = function (path) {
    	document.location.href = path;
    };

})(jQuery, window);