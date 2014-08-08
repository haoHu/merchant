(function ($, window) {
	IX.ns("Hualala.Shop");
	var initShopList = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html(
			'<div class="jumbotron">'+
				'<h1>这里是店铺管理首页</h1>' +
				'<p>提供查询框和查询结果的展示</p>' +
				
			'</div>'
			);
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

	
})(jQuery, window);