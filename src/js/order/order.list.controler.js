(function ($, window) {
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
})(jQuery, window);