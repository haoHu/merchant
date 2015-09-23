(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	
	var PromotionController = Stapes.subclass({
		/**
		 * 构造店铺促销页面控制器
		 * @param  {Object} cfg 配置参数
		 *          @param {jQuery Object} container 
		 *          @param {Object} view 显示层实例
		 *          @param {Object} model 数据层实例
		 * @return {Object}     控制器实例
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.shopID = $XP(cfg, 'shopID', null);
			this.model = $XP(cfg, 'model', null);
			this.view = $XP(cfg, 'view', null);
			if (!this.container || !this.view || !this.model ) {
				throw("Promotion Controller init faild!!");
			}
			this.container.data({
				resultController : this
			})
			this.isReady = false;
			this.bindEvent();
			this.init();
		}
	});
	PromotionController.proto({
		init : function () {
			var self = this;
			self.model.init({
				shopID : self.shopID
			});
			self.view.init({
				model : self.model,
				container : self.container
			});
			self.model.emit('load', {
				shopID : self.shopID,
				cbFn : function () {
					self.view.emit('init', {
						model : self.model,
						container : self.container
					});
					self.view.emit('render');
				}
			});
			self.isReady = true;
			self.emit('load', {});
		},
		hasReady : function () { return this.isReady; },
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this,
					   params ={shopID : self.shopID};
					var cbFn = function () {
						self.view.emit('render');
					};
					self.view.emit('loading');
					self.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
					self.view.hideLoadingModal();
				},
				deleteItem : function (params) {
					var self = this;
					var itemID = $XP(params, 'itemID'),
						shopID = $XP(params, 'shopID'),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					var itemModel = self.model.getRecordModelByID(itemID);
					itemModel.emit('deleteItem', {
						itemID : itemID,
						shopID : shopID,
						successFn : function (res) {
							successFn(res);
						},
						faildFn : function (res) {
							faildFn(res);
						}
					});
				},
				switchPromotion : function (params) {
					var self = this;
					var post = _.pick(params, 'shopID','itemID', 'action');
					var itemID = $XP(params, 'itemID');
					var itemModel = self.model.getRecordModelByID(itemID);
					itemModel.emit('switchPromotion', {
						post : post,
						successFn : $XF(params, 'successFn'),
						faildFn : $XF(params, 'faildFn')
					});
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
	Hualala.Shop.PromotionController = PromotionController;
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.Shop");
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
				shopID : $XP(cfg, 'shopID', ''),
				promotionModel : $XP(cfg,'promotionModel')
			});
			this.model = new Hualala.Shop.QueryPromotionShopModel();
			this.view = new Hualala.Shop.QueryPromotionShopView();
			this.resultController = new Hualala.Shop.QueryShopResultController({
				container : this.resultContainer,
				model : new Hualala.Shop.QueryShopResultModel(),
				view : new Hualala.Shop.QueryShopResultView()
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
					shopID : self.get('shopID'),
					promotionModel :self.get('promotionModel')
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
					IX.Debug.info(params);
					self.resultController && self.resultController.emit('load', IX.inherit(params, {
						pageNo : 1,
						pageSize : 28
					}));
				},
				bindItems : function () {
					var self = this;
					self.resultController && self.resultController.emit('bindItems');
				},
				reset : function () {
					var self = this;
					var mUser = self.get('promotionModel'),
						refPromot = promotions.refPromotShopID
						items = refPromot=="0" ? [] : refPromot;
					if (items.length > 0) {
						self.view.shopName = items[0];
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
							shopID : self.get('shopID')
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
	Hualala.Shop.QueryShopController = QueryShopController;
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.Shop");
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
	Hualala.Shop.QueryShopResultController = QueryShopResultController;
})(jQuery, window);
