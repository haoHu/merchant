(function ($, window) {
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
	
})(jQuery, window);