(function ($, window) {
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
})(jQuery, window);