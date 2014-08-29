(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var AccountListModel = Hualala.Account.AccountListModel;
	var AccountListView = Hualala.Account.AccountListView;
	var ShopListController = Hualala.Shop.ShopListController;
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
	
})(jQuery, window);