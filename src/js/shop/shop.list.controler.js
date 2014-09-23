(function ($, window) {
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
})(jQuery, window);