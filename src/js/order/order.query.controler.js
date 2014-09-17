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
	Hualala.Order.QueryController = QueryController;
})(jQuery, window);