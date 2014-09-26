(function ($, window) {
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
})(jQuery, window);