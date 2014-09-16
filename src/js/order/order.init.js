(function ($, window) {
	IX.ns("Hualala.Order");
	/*订单模块子页面布局*/
	var initOrderPageLayout = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.empty();
		var mapNavRenderData = function () {
			var navs = _.map(Hualala.TypeDef.OrderSubNavType, function (v, i, list) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					return '';
				});

				return {
					active : $XP(ctx, 'name') == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name,
					label : v.label,
				};
			});
			return {items : navs};
		};
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		$body.html('<div class="order-subnav" /><div class="order-body" />');
		var $navbar = $body.find('.order-subnav'),
			$pageBody = $body.find('.order-body');
		$navbar.html(navTpl(mapNavRenderData()));



	};
	/*订单报表概览页面*/
	var initOrderChartPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
	};
	/*订单查询页面*/
	var initQueryOrderPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
	};
	/*订单日汇总页面*/
	var initQueryOrderDayDetailPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
	};
	/*订单期间汇总页面*/
	var initQueryOrderDuringDetailPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
	};
	/*菜品销售排行页面*/
	var initQueryOrderDishesHotPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
	};
	/*顾客统计页面*/
	var initQueryOrderCustomerPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
	};


	Hualala.Order.OrderPageLayoutInit = initOrderPageLayout;
	Hualala.Order.OrderChartInit = initOrderChartPage;
	Hualala.Order.QueryOrderInit = initQueryOrderPage;
	Hualala.Order.QueryOrderByDayDetailInit = initQueryOrderDayDetailPage;
	Hualala.Order.QueryOrderByDuringDetailInit = initQueryOrderDuringDetailPage;
	Hualala.Order.QueryOrderDishesHotInit = initQueryOrderDishesHotPage;
	Hualala.Order.QueryOrderCustomerInit = initQueryOrderCustomerPage;

})(jQuery, window);