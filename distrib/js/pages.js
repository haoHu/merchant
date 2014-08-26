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
		// {
		// 	name : 'group_subname', type : 'text', palceholder : '请输入集团子账号', clz : 'form-control input-md',
		// 	key : 'childName',
		// 	field : {
		// 		validators : {
		// 			notEmpty : {
		// 				message : "集团子账号不能为空"
		// 			}
		// 		}
		// 	}
		// },
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
		},
		// 绑定View层操作
		bindEvent : function () {
			var self = this;
			this.$filter.on('click', '.btn-link[data-city]', function (e) {
				var $btn = $(this);
				var cityID = $btn.attr('data-city');
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
				$btn.addClass('disabled');
				self.emit('filter', self.getFilterParams());
			});
			this.$filter.on('click', '.btn-link[data-area]', function (e) {
				var $btn = $(this);
				var areaID = $btn.attr('data-area');
				self.$filter.find('.btn-link[data-area]').removeClass('disabled');
				$btn.addClass('disabled');
				self.emit('filter', self.getFilterParams());
			});
			this.$query.on('click', '.create-shop', function (e) {
				var $btn = $(this);
				document.location.href = Hualala.PageRoute.createPath('shopCreate');
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
			return {}
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
				pageNo : $XP(params, 'Page.pageNo', 1),
				pageSize : $XP(params, 'Page.pageSize', 15),
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
			return {
				Page : {
					pageNo : this.get('pageNo'),
					pageSize : this.get('pageSize')
				},
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
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.pageNo'));
					self.updatePagerParams($XP(res, 'data', {}));
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
				status : $XP(params, 'state'),
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
				serviceFeature : name,
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
							newData[serviceID] = params;
							self.set('revParamJson', IX.inherit(self.get('revParamJson'), newData));
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
				document.location.href = path;
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['Page']['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'Page.pageNo', 1),
					pageSize : $XP(params, 'Page.pageSize', 15)
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
					tags : getTags($XP(shop, 'tags', [])),
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
				pageNo = $XP(pagerParams, 'Page.pageNo');
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
				params['Page']['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'Page.pageNo', 1),
					pageSize : $XP(params, 'Page.pageSize', 15)
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
		// 获取店铺业务信息数据
		getShopBusiness : function (shop) {
			var business = Hualala.TypeDef.ShopBusiness,
				businessHT = new IX.IListManager(),
				serviceFeatures = $XP(shop, 'serviceFeatures', ''),
				businessCfg = $XP(shop, 'revParamJson', {});
			var ret = null;
			_.each(business, function (item, i, l) {
				var id = $XP(item, 'id'), name = $XP(item, 'name')
					switcherStatus = serviceFeatures.indexOf(name) >= 0 ? 1 : 0;
				var ret = IX.inherit(item, $XP(businessCfg, 'id'), {
					switcherStatus : switcherStatus,
					shopID : $XP(shop, 'shopID')
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
					icon = 'pic-' + name,
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
					desc : ''
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
				pageNo = $XP(pagerParams, 'Page.pageNo');
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
					};
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
	IX.ns("Hualala.Shop");
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
		$body.html(
			'<div class="jumbotron">'+
				'<h1>这里是店铺详情管理页面</h1>' +
				'<p>提供查看店铺信息，编辑店铺信息</p>' +
				
			'</div>'
			);
		// TODO 店铺详情页面，编辑店铺基本信息
	};
	Hualala.Shop.BaseInfoMgrInit = initShopBaseInfoMgr;

	var initFoodMenuMgr = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html(
			'<div class="jumbotron">'+
				'<h1>这里是店铺菜谱管理页面</h1>' +
				'<p>提供查看店铺菜谱信息，编辑店铺菜谱信息</p>' +
				
			'</div>'
			);
		// TODO 查看店铺菜谱信息，编辑店铺菜谱信息
	};
	Hualala.Shop.FoodMenuMgrInit = initFoodMenuMgr;

	var initCreateShop = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html(
			'<div class="jumbotron">'+
				'<h1>这里是创建店铺页面</h1>' +
				'<p>创建店铺向导功能在这个入口实现</p>' +
				
			'</div>'
			);
		// TODO 创建店铺向导功
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
	IX.ns("Hualala.Common");
	var pageBrickConfigs = [
		{name : 'account', title : '结算', label : '提现.账户设置.结算报表', brickClz : 'home-brick-md-2', itemClz : 'brick-item brick-item-2', icon : 'ficon-pay'},
		{name : 'order', title : '订单', label : '报表.菜品排行', brickClz : 'home-brick-md-3', itemClz : 'brick-item', icon : 'ficon-order'},
		{name : 'shop', title : '店铺管理', label : '开店.信息.菜谱', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'ficon-home'},
		{name : 'pcclient', title : '下载哗啦啦', label : '', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'ficon-download'},
		{name : 'user', title : '账号管理', label : '账号.权限', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'ficon-lock'},
		{name : 'setting', title : '业务设置', label : '开通业务.业务参数', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'ficon-setting'}
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
			Hualala.PageRoute.start(function (pageName) {
				var hasNoNavPages = 'main,pcclient,about,contact,login';
				var commonPages = _.filter(hasNoNavPages.split(','), function (v) {return v != 'main'}).join(',');
				if (commonPages.indexOf(pageName) >= 0) {
					Hualala.Common.initPageLayout({}, pageName);
					if (hasNoNavPages.indexOf(pageName) < 0) {
						Hualala.Common.initSiteNavBar(pageName);
					}
					return ;
				}
				initMainPage(function () {
					Hualala.Common.initPageLayout({}, pageName);
					if (hasNoNavPages.indexOf(pageName) < 0) {
						Hualala.Common.initSiteNavBar(pageName);
					}
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
			PageInitiator : "Hualala.Common.LoginInit"
		},
		// home page主页
		{
			name : "main", path : "/#home", reg : /home$/, bodyClz : "",
			PageInitiator : "Hualala.Common.HomePageInit"
		},

		// 店铺管理主页		
		{
			name : "shop", path : "/#shop", reg : /shop$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.HomePageInit"
		},
		// 创建店铺
		{
			name : "shopCreate", path : "/#shop/create", reg : /shop\/create$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.CreateShopInit"
		},
		// 店铺信息管理
		{
			name : "shopInfo", path : "/#shop/{id}/info", reg : /shop\/(.*)\/info$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.BaseInfoMgrInit"
		},
		// 店铺菜单管理
		{
			name : "shopMenu", path : "/#shop/{id}/menu", reg : /shop\/(.*)\/menu$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.FoodMenuMgrInit"
		},

		// 店铺功能设置页面
		{
			name : "setting", path : "/#setting", reg : /setting$/, bodyClz : "",
			PageInitiator : "Hualala.Setting.ShopMgrInit"
		},

		// 结算账户页面
		{
			name : "account", path : "/#account", reg : /account$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountListInit"
		},
		// 结算账户详情设置页面
		{
			name : "accountDetail", path : "/#account/{id}/detail", reg : /account\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountMgrInit"
		},

		// 账号管理页面
		{
			name : "user", path : "/#user", reg : /user$/, bodyClz : "",
			PageInitiator : "Hualala.User.UserListInit"
		},

		// 订单报表页面
		{
			name : "order", path : "/#order", reg : /order$/, bodyClz : "",
			PageInitiator : "Hualala.Order.OrderChartInit"
		},

		// PC客户端下载页面
		{
			name : "pcclient", path : "/#download", reg : /download$/, bodyClz : "",
			PageInitiator : "Hualala.Common.PCClientDownloadInit"
		},

		// 关于商户中心
		{
			name : "about", path : "/#about", reg : /about$/, bodyClz : "",
			PageInitiator : "Hualala.Common.AboutInit"
		},

		// 联系我们
		{
			name : "contact", path : "/#contact", reg : /contact$/, bodyClz : "",
			PageInitiator : "Hualala.Common.ContactInit"
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
			name : _name, bodyClz : $XP(_cfg, 'bodyClz', ''), path : _path, reg : $XP(_cfg, 'reg', null)
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
				IX.isFn(cbFn) && cbFn(name);
				console.info("Load Page :" + name);
				console.info("arguments is :" + params);
				initFn && initFn.apply(null, [name, params]);
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

})(jQuery, window);