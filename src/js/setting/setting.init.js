(function ($, window) {
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
})(jQuery, window);