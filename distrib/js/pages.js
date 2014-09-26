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
			name : 'group_name', type : 'text', palceholder : '请输入集团主账号', clz : 'form-control input-md',
			key : 'groupName',
			field : {
				validators : {
					notEmpty : {
						message : "集团主账号不能为空"
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
						message : "密码不能为空"
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
						message : "验证码不能为空"
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
				console.info('login params : ');
				console.info(params);
				
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
		};

		initLoginForm();
	};
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
				shopLst = _.pluck(shopLst, 'areaID');
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
					console.info('query params:');
					console.info(params);
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
			console.info("pageData:");
			console.info(ret);
			return ret;
		},
		getShopModelByShopID : function (shopID) {
			var self = this,
				shopHT = self.get('ds_shop');
			return shopHT.get(shopID);
		},
		// 更新店铺状态
		updateShopStatus : function (shopID, status, failFn) {
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
				failFn : failFn
			});
		},
		// 更新店铺业务状态
		updateShopBusinessStatus : function (params, failFn) {
			var self = this,
				shopHT = self.get('ds_shop'),
				shopID = $XP(params, 'shopID'),
				shop = shopHT.get(shopID);
			shop.emit('switchBusinessStatus', {
				name : $XP(params, 'name'),
				id : $XP(params, 'id'),
				status : $XP(params, 'status', 0),
				failFn : failFn
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
		switchShopStatus : function (status, failFn) {
			var self = this,
				shopID = self.get('shopID');
			self.set('status', status);
			console.info("Switch Shop [" + self.get('shopID') + "] status " + status);
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
						msg : '切换成功!',
						type : 'success'
					});
				}
			});
		},
		switchShopBusinessStatus : function (params) {
			var self = this,
				shopID = self.get('shopID');
			var failFn = $XF(params, 'failFn'),
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
			console.info("Switch Shop [" + self.get('shopID') + "] ServiceFeature: " + self.get('serviceFeatures'));
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
						msg : '切换成功!',
						type : 'success'
					});
				}
			});
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"switchShopStatus" : function (params) {
					var status = $XP(params, 'status'),
						failFn = $XF(params, 'failFn');
					this.switchShopStatus(status, failFn);
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
							// var revParamJson = JSON.parse(self.get('revParamJson'));
							var revParamJson = self.get('revParamJson') || null;
							revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
							revParamJson = IX.inherit(revParamJson, newData);
							newData[serviceID] = params;
							self.set('revParamJson', JSON.stringify(revParamJson));
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
				self.model.updateShopStatus(shopID, state, function (_shopID) {
					self.$list.find(selector).filter('[data-shop=' + _shopID + ']').bootstrapSwitch('toggleState', true);
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
			this.loadTemplates();
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
					businessName = $btn.attr('data-business'),
					businessID = $btn.attr('data-business-id');
				self.initBusinessModal($btn, shopID, businessName, businessID);
			});
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
		 * @return {String}               业务配置描述
		 */
		getBusinessDesc : function (businessID, operationMode, businessInfo) {
			var self = this;
			var tpl = null, renderKeys = null, params = null, htm = '';
			var minuteIntervalOpts = Hualala.TypeDef.MinuteIntervalOptions();
			var getMinutIntervalLabel = function (v) {
				var m = _.find(minuteIntervalOpts, function (el, i) {
					return $XP(el, 'value') == v;
				});
				return $XP(m, 'label', '');
			};
			switch(businessID) {
				// 常规预定点菜
				case 10:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_commonreserve_desc'));
					renderKeys = 'advanceTime,noticeTime,minAmount,reserveTableTime,reserveTableDesc,payMethod'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "advanceTime":
								r = IX.isEmpty(r) || r == 0 ? '不限制顾客提前预定时间' : ('顾客需提前' + getMinutIntervalLabel(r) + '预订, ');
								break;
							case "noticeTime":
								r = IX.isEmpty(r) || r == 0 ? '订单立即通知餐厅' : ('订单提前' + getMinutIntervalLabel(r) + '通知餐厅, ');
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
								r = IX.isEmpty(r) || r == 0 ? '不限制顾客提前预定时间' : ('顾客需提前' + getMinutIntervalLabel(r) + '预订, ');
								break;
							case "noticeTime" : 
								r = IX.isEmpty(r) || r == 0 ? '订单立即通知餐厅' : ('订单提前' + getMinutIntervalLabel(r) + '通知餐厅, ');
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
								r = (r == 1 ? '支持' : '不支持') + '下单到餐饮软件, ';
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
			}
			if (businessID == 11 || businessID == 41 || businessID == 10) {
				htm = tpl(_.object(renderKeys, params));
				htm = htm.slice(0, htm.lastIndexOf(','));
			}
			return htm;
		},
		// 获取店铺业务信息数据
		getShopBusiness : function (shop) {
			var self = this;
			var business = Hualala.TypeDef.ShopBusiness,
				businessHT = new IX.IListManager(),
				serviceFeatures = $XP(shop, 'serviceFeatures', ''),
				// businessCfg = JSON.parse($XP(shop, 'revParamJson', {})),
				businessCfg = $XP(shop, 'revParamJson', null);
			businessCfg = !businessCfg ? {} : JSON.parse(businessCfg)
			var ret = null;
			_.each(business, function (item, i, l) {
				var id = $XP(item, 'id'), name = $XP(item, 'name')
					switcherStatus = serviceFeatures.indexOf(name) >= 0 ? 1 : 0,
					businessInfo = $XP(businessCfg, id.toString(), {}),
					operationMode = $XP(shop, 'operationMode', null);
				var ret = IX.inherit(item, businessInfo, {
					switcherStatus : switcherStatus,
					shopID : $XP(shop, 'shopID'),
					desc : self.getBusinessDesc(id, operationMode, businessInfo)
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
					desc : $XP(el, 'desc', '')
				};
			});
		},
		// 校验是否有财务或更高权限
		chkHasAccountRole : function () {
			var loginUsr = Hualala.getSessionUser(),
				usrRoles = $XP(loginUsr, 'role');
				roles = Hualala.getSessionRoles();
			var ret = _.find(roles, function (role) {
				var roleType = $XP(role, 'roleType');
				var matchedID = _.find(usrRoles, function (v) {
					return $XP(role, 'id') == v;
				});
				return !!matchedID && (roleType == 'account' || roleType == 'all');
			});
			return !!ret;
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (shop, i, l) {
				return {
					clz : '',
					shopID : $XP(shop, 'shopID', ''),
					shopName : $XP(shop, 'shopName', ''),
					hideAccount : !self.chkHasAccountRole() ? 'hidden' : '',
					settleName : $XP(shop, 'settleName', ''),
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
		initSwitcher : function (selector) {
			var self = this;
			self.$list.find(selector).bootstrapSwitch({
				// baseClass : 'ix-bs-switch',
				// wrapperClass : 'ix-bs-switch-wrapper',
				size : 'normal',
				onColor : selector == ':checkbox[name=switcher_business]' ? 'primary' : 'success',
				offColor : 'default',
				onText : '已开通',
				offText : '未开通'
			});
			// 绑定开关事件
			self.$list.find(selector).on('switchChange.bootstrapSwitch', function (e, state) {
				var $chkbox = $(this),
					name = $chkbox.attr('name'),
					shopID = $chkbox.attr('data-shop'),
					state = !state ? 0 : 1,
					business = $chkbox.attr('data-business'),
					businessID = $chkbox.attr('data-business-id');
				if (name == 'switcher_status') {
					self.model.updateShopStatus(shopID, state, function (_shopID) {
						self.$list.find(selector).filter('[data-shop=' + _shopID + ']').bootstrapSwitch('toggleState', true);
					});
				} else {
					self.model.updateShopBusinessStatus({
						shopID : shopID,
						name : business,
						id : businessID,
						status : state
					}, function (params) {
						self.$list.find(selector).filter('[data-shop=' + $XP(params, 'shopID') + '][data-business-id=' + $XP(params, 'id') + ']')
							.bootstrapSwitch('toggleState', true);
					});
				}
				
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
			self.initSwitcher(':checkbox[name=switcher_business]');
			self.initSwitcher(':checkbox[name=switcher_status]');
		},
		// 生成业务编辑窗口
		initBusinessModal : function (trigger, shopID, name, id) {
			var self = this;
			var editView = new Hualala.Setting.editServiceView({
				triggerEl : trigger,
				serviceID : id,
				serviceName : name,
				model : self.model.getShopModelByShopID(shopID)
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
})(jQuery, window);;(function ($, window) {
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
        $cuisine2 = $step1.find('#cuisineID2');
    // 初始化城市列表下拉框
    initCities($city);
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
                        min: 6,
                        max: 100,
                        message: '地址长度必须在6到100个字符之间'
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
    
    var $uploadImg = $step1.find('#uploadImg'),
        imagePath = ''; // 门头图图片路径
    $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
    // 上传门头图
    $uploadImg.find('button, img').on('click', function()
    {
        U.uploadImg({
            onSuccess: function (imgPath, $dlg)
            {
                var src = G.IMAGE_RESOURCE_DOMAIN + '/' + imgPath;
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
            if(!$step1.data('bootstrapValidator').validate().isValid()) return;
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
                $shopSettingLink.attr('href', Hualala.PageRoute.createPath('setting'));
                // 进入第二步标注地图
                bsWizard.next();
                // 地图对象必须在第二步面板显示出来后初始化
                map = Hualala.Shop.map({data: {
                    isSearchMap: true,
                    shopName: dataStep1.shopName,
                    tel: dataStep1.tel,
                    address: dataStep1.address
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
    var callServer = G.getCuisines;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($cuisine1, rsp.data.records, 'cuisineID', 'cuisineName');
        fillSelectBox($cuisine2, rsp.data.records, 'cuisineID', 'cuisineName', '--不限--');
    });
    
}
// 初始化地标下拉列表
function initAreas($selectBox, cityID)
{
    var callServer = G.getAreas;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($selectBox, rsp.data.records, 'areaID', 'areaName');
    });
    
}
// 初始化城市下拉列表
function initCities($selectBox)
{
    var callServer = G.getCities;
    callServer({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($selectBox, rsp.data.records, 'cityID', 'cityName');
    });
    
}
// 设置下拉列表的项
function fillSelectBox($selectBox, data, key, value, initialValue)
{
    var optionsHtml = '<option value="">' + 
                      (initialValue || '--请选择--') + 
                      '</option>';
    $.each(data, function (i, o)
    {
        optionsHtml += '<option value="' + 
                       o[key] + '">' + 
                       o[value] + 
                       '</option>';
    });
        
    $selectBox.empty().html(optionsHtml);
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
    parseForm = Hualala.Common.parseForm,
    initMap = Hualala.Shop.map;
// 初始化店铺店铺详情页面
S.initInfo = function ($container, pageType, params)
{
    if(!params) return;
    // 渲染店铺功能导航
    var $shopFuncNav = S.createShopFuncNav(pageType, params, $container);
    
    var shopID = params, shopInfo = null,
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
        shopInfo.operationModeName = shopInfo.operationMode == '1' ? '快餐' : '正餐';
        
        var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_info'));
        $form = $(tpl(shopInfo)).appendTo($container);
        $city = $form.find('#cityID'),
        $area = $form.find('#areaID'),
        $cuisine1 = $form.find('#cuisineID1'),
        $cuisine2 = $form.find('#cuisineID2');
        
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
                            min: 6,
                            max: 100,
                            message: '地址长度必须在6到100个字符之间'
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
        bv = $form.data('bootstrapValidator');
        
        var $uploadImg = $form.find('#uploadImg');
        $img = $uploadImg.find('img').attr('src', G.IMAGE_ROOT + '/shop_head_img_default.png');
        imagePath = shopInfo.imagePath;
        imagePath && $img.attr('src', imgHost + imagePath);
        
        map = initMap({data: {
            isSearchMap: false,
            shopName: shopInfo.shopName,
            tel: shopInfo.tel,
            address: shopInfo.address,
            lng: shopInfo.mapLongitudeValueBaiDu,
            lat: shopInfo.mapLatitudeValueBaiDu
        }});
        
    });
    // click 事件 delegate
    $container.on('click', function(e)
    {
        var $target = $(e.target);
        // 修改门头图
        if($target.is('#uploadImg img, #uploadImg a'))
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
                    formData = parseForm($form);
                map = initMap({data: {
                    isSearchMap: false,
                    shopName: formData.shopName,
                    tel: formData.tel,
                    address: formData.address,
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
        
        fillSelectBox($cuisine1, rsp.data.records, 'cuisineID', 'cuisineName');
        fillSelectBox($cuisine2, rsp.data.records, 'cuisineID', 'cuisineName', '--不限--');
        cuisineID1 && $cuisine1.val(cuisineID1);
        cuisineID2 && $cuisine2.val(cuisineID2);
    });
    
}
// 初始化地标下拉列表
function initAreas($area, cityID, areaID)
{
    var callServer = G.getAreas;
    callServer({cityID: cityID}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($area, rsp.data.records, 'areaID', 'areaName');
        areaID && $area.val(areaID);
    });
    
}
// 初始化城市下拉列表
function initCities($city, shopInfo)
{
    var callServer = G.getCities;
    callServer({isActive: 1}, function(rsp)
    {
        if(rsp.resultcode != '000')
        {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        
        fillSelectBox($city, rsp.data.records, 'cityID', 'cityName');
        $city.val(shopInfo.cityID).trigger('change', [shopInfo.areaID, shopInfo.cuisineID1, shopInfo.cuisineID2]);
    });
    
}
// 设置下拉列表的项
function fillSelectBox($selectBox, data, key, value, initialValue)
{
    var optionsHtml = '<option value="">' + 
                      (initialValue || '--请选择--') + 
                      '</option>';
    $.each(data, function (i, o)
    {
        optionsHtml += '<option value="' + 
                       o[key] + '">' + 
                       o[value] + 
                       '</option>';
    });
        
    $selectBox.empty().html(optionsHtml);
}
// 处理并获取下拉列表当前选择项的文本
function getSelectText($select)
{
    return $select.find('option:selected').text().replace(/-/g, '');
}

})(jQuery, window);










;(function ($, window) {
IX.ns('Hualala.Shop');

// 初始化店铺店铺菜品页面
Hualala.Shop.initMenu = function ($container, pageType, params)
{
    if(!params) return;
    
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip,
        parseForm = Hualala.Common.parseForm;
    
    var shopID = params;
        imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
        imgRoot = G.IMAGE_ROOT + '/';

    var classifiedFoods = null, //已分类菜品
        foodClass = '', //当菜菜品类别的 foodCategoryID
        foods = null, //当前表格显示的菜品数组
        searchParams = null, //菜品搜索过滤参数
        //修改菜品弹出框里几个 radio 的名称
        foodParams = ['hotTag', 'takeawayTag', 'isDiscount'],
        food = null, // 当前菜品
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
        
        classifiedFoods = classifyFoods(rsp.data.records);
        renderFoods(); //渲染所有菜品
        //渲染菜品分类
        var $foodClassBox = $menu.find('#foodClassBox').append($('<span class="current-food-class"></span>').text('全部菜品 (' + foods.length + ')'));
        
        for(var id in classifiedFoods)
        {
            var category = classifiedFoods[id]; 
            $('<span></span>').data('id', id).text(category.foodCategoryName + ' (' + category.foods.length + ')').appendTo($foodClassBox);
        }
        $foodClass = $foodClassBox.find('span');
        $menu.appendTo($container);
    });
    
    $(document).on('change', function(e)
    {
        var $target = $(e.target);
        //自定义按钮组相关
        if($target.is('.form-food input[type=radio]'))
        {
            $target.closest('div').find('label').removeClass('active')
            .find('input:checked').parent().addClass('active');
        }
        //修改菜品图片
        if($target.is('.food-pic input'))
        {
            var $foodPic = $('.food-pic');
            if($target.val())
            {
                $foodPic.addClass('loading');
                previewImg($target[0], $foodPic.find('img'));
                $foodPic.submit();
                setTimeout(function()
                {
                    $foodPic.removeClass('loading');
                }, 5000);
            }
        }
        
    });
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
                food.foodIsActive = food.isActive;
                updateFood(food);
                renderFoods();
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
            renderFoods();
        }
        //搜索过滤菜品
        if($target.is('#btnSearchFood'))
        {
            searchFood();
        }
        
    });
    
    $foodName.on('keypress', function(e)
    {
        e.keyCode == 13 && searchFood();
    });
    
    function searchFood()
    {
        var $checked = $chekbox.filter(':checked'),
            takeawayTag = $.trim($takeawayTag.val()),
            foodName = $.trim($foodName.val());
        if(takeawayTag || foodName || $checked.length)
        {
            searchParams = {};
            if(takeawayTag) searchParams.takeawayTag = takeawayTag;
            if(foodName) searchParams.foodName = foodName;
            $checked.each(function ()
            {
                if(this.id == 'isHasImage')
                    searchParams.isHasImage = '0';
                else
                    searchParams[this.id] = '1';
            });
            renderFoods();
        }
    }
    
    //渲染菜品
    function renderFoods()
    {
        foods = filterFoods();
        $foodCount.text(foods.length);
        $foods.html(foodTpl({foods: foods}));
        $foods.find('img').lazyload();
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
                return p == 'foodName' ? food[p].indexOf(searchParams[p]) > -1 : food[p] == searchParams[p];
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
            food.imgSrc = imgHost + path.replace(/\.\w+$/, '=' + h + 'x' + w + '$&' + '?quality=70');
        }
        else
            food.imgSrc = imgRoot + 'dino80.png';
        
        food.discountIco = food.isDiscount == 1 ? 'ico-ok' : 'ico-no';
        food.takeawayIco = food.takeawayTag > 0 ? 'ico-ok' : 'ico-no';
        food.activeIco = food.foodIsActive == 1 ? 'ico-ok' : 'ico-no';
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

})(jQuery, window);










;
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
        this.searchArea = true;
        this.mapPoint = {};
        
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
            data = data || self.self.cfg.data;
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
                    if(self.searchArea)
                    {
                        local.search(data.area);
                        self.searchArea = false;
                    } else
                    {
                        local.search(data.city);
                    }
                } else 
                {
                    //marker.hide();
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
	
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala.Shop");
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
                Hualala.Global.switchShopStatus({shopID: shopInfo.shopID, status: state}, function (rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        $chkbox.bootstrapSwitch('toggleState', true);
                        rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                });
			});;
            //重置客户端密码
            $shopInfoHead.find('#resetPwd').on('click', function ()
            {
                var resetPwdTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_shop_client_pwd'));
                var $resetPwdForm = $(resetPwdTpl(shopInfo));
                //弹出重置客户端密码模态框
                var modal = new Hualala.UI.ModalDialog({
                    id: 'resetCltPwdDlg',
                    title: '重置客户端密码',
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
                        Hualala.UI.TopTip({msg: '重置客户端密码成功！', type: 'success'});
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
			surfix : Hualala.Constants.CashUnit,
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
						message : "店内支付方式不能为空"
					}
				}
			}
		},
		checkSpotOrder : {
			type : 'switcher',
			label : '支持手机结账',
			defaultVal : 0,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {}
			}
		},
		payBeforeCommit : {
			type : 'switcher',
			label : '支持餐前结账',
			defaultVal : 1,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {}
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
				throw("Configuration failed : Invalid Page Initialized for " + this.callServer);
				return false;
			} else if (IX.nsExisted(this.callServer)) {
				this.callServer = IX.getNS(this.callServer);
			}
			// var revParamJson = JSON.parse(this.model.get('revParamJson'));
			var revParamJson = this.model.get('revParamJson') || null;
			revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
			this.formParams = $XP(revParamJson, this.serviceID);
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
			console.info("pageData :");
			console.info(ret);
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
			console.info("pageData :");
			console.info(ret);
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
			this.callServer = Hualala.Global.getShopQuerySchema;
			// this.callServer = Hualala.Global.getAccountQueryShop;
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
			Handlebars.registerPartial("addAccountCard", Hualala.TplLib.get('tpl_addAccount_Card'));

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
				// 提现操作
				var modal = new WithdrawCashView({
					triggerEl : $btn,
					settleUnitID : settleAccountID,
					model : self.model.getAccountModelByID(settleAccountID),
					parentView : self
				});
			});
			self.$list.on('click', '.create-account', function (e) {
				var $btn = $(this);
				// TODO 创建账户
				var editAccount = new Hualala.Account.AccountEditView({
					triggerEl : $btn,
					mode : 'add',
					model : null,
					parentView : self
				});
			});
			self.on({
				'updateSettleBalance' : function (mAccount) {
					var settleUnitID = mAccount.get('settleUnitID'),
						settleBalance = mAccount.get('settleBalance');
					self.$container.find('[data-id=' + settleUnitID + '] .cash > strong').html(settleBalance);
				}
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
			if (accounts.length == 0) {
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
		mapFormElsData : function () {
			var self = this,
				accountInfoKeys = [
					{key : 'settleUnitName', label : '结算账户名称'},
					{key : 'receiverName', label : '开户名'},
					{key : 'bankName', label : '开户行'},
					{key : 'bankAccount', label : '账号'},
					{key : 'settleBalance', label : '账户余额'}
				],
				accountInfo = _.map(accountInfoKeys, function (el) {
					var k = $XP(el, 'key');
					return {
						label : $XP(el, 'label', ''),
						value : k == 'settleBalance' ? ('<strong>' + self.model.get(k) + '</strong>元') : self.model.get(k)
					};
				});
			return {
				accountInfo : accountInfo,
				formClz : 'account-withdraw-form',
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
								message : "提现金额不能为空"
							},
							numeric : {
								message: "提现金额必须为数字"
							},
							greaterThan : {
								inclusive : false,
								value : 0,
								message : "提现金额必须大于0"
							},
							lessThan : {
								inclusive : true,
								value : self.model.get('settleBalance')
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
		{clz : '', label : '佣金'},
		{clz : '', label : '手续费'},
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
				tblClz = 'table-striped table-hover',
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
			console.info(ret);
			return ret;
		},
		mapTimeData : function (s) {
			var r = {value : '', text : ''};
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
			return {text : $XP(m[0], 'label', ''), value : $XP(m[0], 'value', '')};
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
			return {text : $XP(m[0], 'label', ''), value : $XP(m[0], 'value', '')};
		},
		mapCashData : function (s) {
			return {text : Hualala.Common.Math.prettyNumeric(s), value : s};
		},
		mapTransChanged : function (r) {
			var transAmount = $XP(r, 'transAmount', 0),
				transSalesCommission = $XP(r, 'transSalesCommission', 0),
				transPoundage = $XP(r, 'transPoundage', 0),
				transChanged = transAmount - transSalesCommission - transPoundage;
			return {value : transChanged, text : transChanged};
		},
		mapColsRenderData : function (row) {
			var self = this;
			var colKeys = 'transCreateTime,SUATransItemID,transStatus,transType,transAmount,transSalesCommission,transPoundage,transChanged,transAfterBalance,rowControl';
			var col = {clz : '', type : 'text'};

			var cols = _.map(colKeys.split(','), function (k, i) {
				var r = null;
				switch(k) {
					case 'transCreateTime':
						r = self.mapTimeData($XP(row, k, ''));
						break;
					case 'SUATransItemID':
						r = {value : $XP(row, k, ''), text : $XP(row, k, '')};
						break;
					case 'transStatus':
						r = self.mapTransStatus($XP(row, k, ''));
						break;
					case 'transType':
						r = self.mapTransType($XP(row, k, ''));
						break;
					case 'transAmount':
					case 'transSalesCommission':
					case 'transPoundage':
					case 'transAfterBalance':
						r = self.mapCashData($XP(row, k, ''));
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
			var tblClz = 'table-striped table-hover',
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
					console.info('query params:');
					console.info(params);
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
				bankAccountStr = Hualala.Common.codeMask((model.get('bankAccount') || ''), 0, -4),
				settleBalance = parseFloat(model.get('settleBalance') || 0),
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
					} else if ($XP(el, 'act') == 'withdraw') {
						return IX.inherit(el, {
							disableWithdraw : disableWithdraw
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
			label : "结算账户名称",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "结算账户名称不能为空"
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
			label : "默认账户",
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
			this.formKeys = 'settleUnitName,receiverType,receiverName,bankAccount,bankCode,bankName,remark,defaultAccount,receiverLinkman,receiverMobile,receiverEmail'.split(',');
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
						unit = !IX.isEmpty(OrderPayFieldLabelLib[k]) && !IX.isEmpty(OrderPayFieldLabelLib[k]['unit']) ?
							OrderPayFieldLabelLib[k]['unit'] : '';
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
			console.info(fieldsets);
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
			console.info('queryParams:');
			console.info(params);
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
			console.info("pageData");
			console.info(ret);
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
		{key : "cityID", clz : "", label : "城市"},
		{key : "shopName", clz : "", label : "店铺名称"},
		{key : "orderID", clz : "", label : "订单号"},
		{key : "userName", clz : "", label : "客户姓名"},
		{key : "orderTime", clz : "", label : "就餐时间"},
		{key : "orderStatus", clz : "", label : "订单状态"},
		{key : "orderTotal", clz : "", label : "应付金额"},
		{key : "moneyBalance", clz : "", label : "会员卡支付"},
		{key : "pointBalance", clz : "", label : "会员卡积分支付"},
		{key : "orderRefundAmount", clz : "", label : "退订/退款"},
		{key : "total", clz : "", label : "应结金额"},
		{key : "shouldSettlementTotal", clz : "", label : "结算金额"},
		{key : "rowControl", clz : "", label : "操作"}
	];
	var OrderQueryDuringTableHeaderCfg = [
		{key : "cityID", clz : "", label : "城市"},
		{key : "billDate", clz : "", label : "日期"},
		{key : "count", clz : "", label : "订单数"},
		{key : "giftAmountTotal", clz : "", label : "代金券总金额"},
		{key : "orderTotal", clz : "", label : "订单支付金额"},
		{key : "orderWaitTotal", clz : "", label : "待消费订单金额"},
		{key : "orderRegAmount", clz : "", label : "退款金额"},
		{key : "orderRefundAmount", clz : "", label : "退订金额"},
		{key : "total", clz : "", label : "成交金额"},
		{key : "orderTotal", clz : "", label : "线下金额"},
		{key : "rowControl", clz : "", label : "操作"}
	];

	var OrderQueryDishHotTableHeaderCfg = [
		{key : "index", clz : "", label : "序号"},
		{key : "foodName", clz : "", label : "菜品名称"},
		{key : "foodCategoryName", clz : "", label : "分类名称"},
		{key : "sumPrice", clz : "", label : "平均价格"},
		{key : "sumMaster", clz : "", label : "销售份数"}
	];

	var OrderQueryUserTableHeaderCfg = [
		{key : "userName", clz : "", label : "姓名"},
		{key : "userSex", clz : "", label : "性别"},
		{key : "userLoginMobile", clz : "", label : "手机号"},
		{key : "sumRecord", clz : "", label : "订餐次数"},
		{key : "foodAmount", clz : "", label : "订餐金额"},
		{key : "minOrderTime", clz : "", label : "首次订餐时间"},
		{key : "maxOrderTime", clz : "", label : "最近订餐时间"}
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
				s = IX.isEmpty(s) ? '' : '(' + $XP(s, 'label', '') + ')';
				m = IX.isEmpty(m) ? '' : '(' + m + ')';
				r.value = $XP(row, 'userID', '');
				r.text = v + s + m;
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
				r.text = Hualala.Common.Math.prettyPrice(Hualala.Common.Math.div(r.value, $XP(row, 'sumMaster', 1)));
				break;
			case "userSex":
				r.value = v;
				r.text = $XP(Hualala.Common.getGender($XP(row, 'userSex', '')), 'label', '');
				break;
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
			tblClz = "table-striped table-hover",
			tblHeaders = OrderQueryTableHeaderCfg,
			statisticData = self.model.getStatisticData();
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return $XP(el, 'key', '');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, k]);
				return IX.inherit(col, r);
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
				text : v,
				value : v
			};
		});
		ftCols.unshift({
			clz : 'title', colspan : '6', rowspan : '1', value : '', text : '共计：'
		});
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
			tblClz = "table-striped table-hover",
			tblHeaders = IX.clone(OrderQueryDuringTableHeaderCfg),
			statisticData = self.model.getStatisticData();;
		if (pageName == 'orderQueryDuring') {
			tblHeaders = _.map(tblHeaders, function (el) {
				var key = $XP(el, 'key', '');
				if (key == 'billDate') {
					el = IX.inherit(el, {
						key : 'shopName', clz : "", label : "店铺名称"
					});
				}
				return el;
			});
		}
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return $XP(el, 'key', '');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, k]);
				return IX.inherit(col, r);
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
				text : v,
				value : v
			};
		});
		ftCols.unshift({
			clz : 'title', colspan : '2', rowspan : '1', value : '', text : '共计：'
		});
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
			tblClz = "table-striped table-hover",
			tblHeaders = OrderQueryDishHotTableHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return $XP(el, 'key', '');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, k]);
				return IX.inherit(col, r);
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
			tblClz = "table-striped table-hover",
			tblHeaders = OrderQueryUserTableHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return $XP(el, 'key', '');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, k]);
				return IX.inherit(col, r);
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
			console.info("Order Query Params is :");
			console.info(params);
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
		var query = {cols : [
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime', 'orderTotal'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['cityID', 'shopID'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['orderStatus', 'orderID'])
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
		initCityComboOpts : function (curCityID) {
			var self = this,
				cities = self.model.getCities();
			if (IX.isEmpty(cities)) return ;
			cities = _.map(cities, function (city) {
				var id = $XP(city, 'cityID', ''), name = $XP(city, 'cityName', '');
				return {
					value : id,
					label : name,
					selected : id == curCityID ? 'selected' : ''
				};
			});
			cities.unshift({
				value : '',
				label : '全部',
				selected : IX.isEmpty(curCityID) ? 'selected' : ''
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : cities
				}),
				$select = self.$queryBox.find('select[name=cityID]');
			$select.html(htm);
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
					selected : id == curShopID ? 'selected' : ''
				};
			});
			shops.unshift({
				value : '',
				label : '全部',
				selected : IX.isEmpty(curShopID) ? 'selected' : ''
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : shops
				}),
				$select = self.$queryBox.find('select[name=shopID]');
			$select.html(htm);
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
					console.info('query params:');
					console.info(params);
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
	IX.ns("Hualala.Common");
	var pageBrickConfigs = [
		{name : 'account', title : '结算', label : '提现.账户设置.结算报表', brickClz : 'home-brick-md-2', itemClz : 'brick-item brick-item-2', icon : 'icon-pay'},
		{name : 'order', title : '订单', label : '报表.菜品排行', brickClz : 'home-brick-md-3', itemClz : 'brick-item', icon : 'icon-order'},
		{name : 'shop', title : '店铺管理', label : '开店.信息.菜谱', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-home'},
		{name : 'pcclient', title : '下载哗啦啦', label : '', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-download'},
		{name : 'user', title : '账号管理', label : '账号.权限', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-lock'},
		{name : 'setting', title : '业务设置', label : '开通业务.业务参数', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-setting'}
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
				href : '',
				icon : '',
				name : 'IE10',
				desc : 'IE10浏览器是微软公司出品的现代浏览器，已经支持大部分HTML5，CSS3特性'
			},
			{
				href : '',
				icon : '',
				name : 'IE11',
				desc : 'IE11浏览器是微软公司出品的现代浏览器，已经支持绝大部分HTML5，CSS3特性'
			},
			{
				href : '',
				icon : '',
				name : 'Chrome',
				desc : 'Chrome浏览器是谷歌公司退出的现代浏览器，完全支持HTML5，CSS3标准的特性，具有更快的浏览网页速度。'
			},
			{
				href : '',
				icon : '',
				name : 'Firefox',
				desc : 'FireFox是Mozilla推出的现代浏览器，完全支持HTML5，CSS3标准的特性。'
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
			groupName = $XP(session, 'site.groupName', '');
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
			},
			footer = {
				aboutPath : Hualala.PageRoute.createPath("about") || '#',
				contactPath : Hualala.PageRoute.createPath("contact") || '#',
				gozapLogo : Hualala.Global.getDefaultImage('gozap')
			};
			return {
				header : header,
				footer : footer
			};
		};
		var $wrapper = $(layoutTpl(mapRanderData()));
		$('body > #ix_wrapper').remove();
		if (isSupportedBrowser()) {
			$wrapper.appendTo($('body'));
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
			navToggleTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbarToggle'));
		var mapRanderData = function () {
			var navs = _.map(Hualala.TypeDef.SiteNavType, function (v, i, list) {
				return {
					active : !Hualala.Global.isCurrentPage(v.name) ? '' : 'active',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name) || '#',
					name : v.name,
					label : v.label,
				};
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
		Hualala.Entry.initLogin($loginBox);
	}


	Hualala.Common.LoginInit = initLoginPage;
	Hualala.Common.initPageLayout = initPageLayout;
	Hualala.Common.initSiteNavBar = initSiteNavBar;
	Hualala.Common.HomePageInit = initHomePage;

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
					alert("Can't find page inializor : \n" + fnames.join("\n"));
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
			name : "main", path : "/#home", reg : /home$/, bodyClz : "",
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
			PageInitiator : "Hualala.Account.AccountListInit", parentName : "main", label : "账户结算"
		},
		// 结算账户详情设置页面
		{
			name : "accountDetail", path : "/#account/{id}/detail", reg : /account\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountMgrInit", parentName : "account", label : "账户明细"
		},

		// 账号管理页面
		{
			name : "user", path : "/#user", reg : /user$/, bodyClz : "",
			PageInitiator : "Hualala.User.UserListInit", parentName : "main", label : "账号管理"
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
			PageInitiator : "Hualala.Order.QueryOrderDishesHotInit", parentName : "main", label : "菜品销量排行榜"
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


	Hualala.PageRoute.start = function (cbFn) {
		isInitialized = true;
		Router.flush().config({mode : 'history', root : Hualala.Global.HOME});
		// Router.flush().config({mode : 'history'});
		// IE Browser can not support this method ??
		_.each(PageConfigurations, function (route, name, l) {
			var re = $XP(route, 'reg'), initFn = $XF(route, 'init'), handler = null;
			
			handler = function (params) {
				console.info("INFO: Init Page :" + name);
				console.info("Load Page :" + name);
				console.info("arguments is :" + params);
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
    

})(jQuery, window);