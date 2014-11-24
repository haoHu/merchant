(function ($, window) {
	IX.ns("Hualala.CRM");
	/*会员管理模块子页面整体页面布局*/
	function initCRMPageLayout (subNavCfg) {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.empty();
		$body.html('<div class="crm-subnav clearfix" /><div class="crm-body" ><div class="crm-query-box"></div><div class="crm-result-box"></div></div>');
		var mapNavRenderData = function () {
			var navs = _.map(subNavCfg, function (v) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					return '';
				});
				return {
					active : $XP(ctx, 'name') == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name || '',
					label : v.label || ''
				};
			});
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var $navbar = $body.find('.crm-subnav'),
			$pageBody = $body.find('.crm-body');
		$navbar.html(navTpl(mapNavRenderData()));
	};

	/*CRM首页*/
	function initCRMHomePage () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		// Note: 暂时屏蔽概览页面，第二版将开启
		var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
		var pageCfg = _.find(Hualala.TypeDef.CRMMemberSubNavType, function (el) {return el.name == 'crmMemberSchema'}),
			pkeys = $XP(pageCfg, 'pkeys', []);
		pkeys = _.map(pkeys, function (v) {
			if (v == 'startDate' || v == 'endDate') {
				return curDateStamp;
			}
			return '';
		});
		document.location.href = Hualala.PageRoute.createPath('crmMemberSchema', pkeys);
	};

	/*会员概览页面*/
	function initMemberSchema () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>会员概览页面</h1>');
	};

	/*会员查询页面*/
	function initQueryMember () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>会员查询页面</h1>');
	};

	/*会员详情*/
	function initMemberDetail () {
		// TODO 会员详情页面
	};



	/*会员办卡统计*/
	function initCardStatistic () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>会员办卡统计</h1>');
	};

	/*交易汇总*/
	function initDealSummary () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>交易汇总</h1>');
	};

	/*交易详情*/
	function initDealDetail () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>交易详情</h1>');
	};

	/*充值对账*/
	function initRechargeReconciliation () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>充值对账</h1>');
	};

	/*会员系统参数设置*/
	function initCRMSettingsParams () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>会员系统参数设置</h1>');
	};

	/*充值套餐*/
	function initRechargePackageBusiness () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>充值套餐</h1>');
	};

	/*店铺特惠*/
	function initShopSpecialPrice () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>店铺特惠</h1>');
	};

	Hualala.CRM.CRMPageLayoutInit = initCRMPageLayout;
	Hualala.CRM.CRMHomePageInit = initCRMHomePage;
	Hualala.CRM.MemberSchemaInit = initMemberSchema;
	Hualala.CRM.QueryMemberInit = initQueryMember;
	Hualala.CRM.MemberDetailInit = initMemberDetail;
	Hualala.CRM.CardStatisticInit = initCardStatistic;
	Hualala.CRM.DealSummaryInit = initDealSummary;
	Hualala.CRM.DealDetailInit = initDealDetail;
	Hualala.CRM.RechargeReconciliationInit = initRechargeReconciliation;
	Hualala.CRM.CRMSettingsParamsInit = initCRMSettingsParams;
	Hualala.CRM.RechargePackageBusinessInit = initRechargePackageBusiness;
	Hualala.CRM.ShopSpecialPriceInit = initShopSpecialPrice;

})(jQuery, window);
// (function ($, window) {
// 	IX.ns("Hualala.Order");
// 	/*订单模块子页面布局*/
// 	var initOrderPageLayout = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		$body.empty();
// 		var mapNavRenderData = function () {
// 			var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
// 			var navs = _.map(Hualala.TypeDef.OrderSubNavType, function (v, i, list) {
// 				var params = _.map($XP(v, 'pkeys', []), function (v) {
// 					if (v == 'startDate' || v == 'endDate') {
// 						return curDateStamp;
// 					}
// 					return '';
// 				});

// 				return {
// 					active : $XP(ctx, 'name') == v.name ? 'active' : '',
// 					disabled : '',
// 					path : Hualala.PageRoute.createPath(v.name, params) || '#',
// 					name : v.name,
// 					label : v.label,
// 				};
// 			});
// 			return {
// 				toggle : {
// 					target : '#order_navbar'
// 				},
// 				items : navs
// 			};
// 		};
// 		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
// 		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
// 		$body.html('<div class="order-subnav clearfix" /><div class="order-body" ><div class="order-query-box"></div><div class="order-result-box"></div></div>');
// 		var $navbar = $body.find('.order-subnav'),
// 			$pageBody = $body.find('.order-body');
// 		$navbar.html(navTpl(mapNavRenderData()));
// 	};
// 	/*订单报表概览页面*/
// 	var initOrderChartPage = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		initOrderPageLayout();
// 		// Note: 暂时屏蔽概览页面，第二版将开启
// 		var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
// 		var pageCfg = _.find(Hualala.TypeDef.OrderSubNavType, function (el) {return el.name == 'orderQuery'}),
// 			pkeys = $XP(pageCfg, 'pkeys', []);
// 		pkeys = _.map(pkeys, function (v) {
// 			if (v == 'startDate' || v == 'endDate') {
// 				return curDateStamp;
// 			}
// 			return '';
// 		});
// 		document.location.href = Hualala.PageRoute.createPath('orderQuery', pkeys);
// 	};
// 	/*订单查询页面*/
// 	var initQueryOrderPage = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		initOrderPageLayout();
// 		var $pageBody = $body.find('.order-body');
// 		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
// 		var queryPanel = new Hualala.Order.QueryController({
// 			container : $pageBody,
// 			resultController : new Hualala.Order.OrderListController({
// 				container : $pageBody,
// 				model : new Hualala.Order.OrderQueryResultModel({
// 					callServer : Hualala.Global.queryOrderDetail,
// 					queryKeys : queryKeys,
// 					initQueryParams : Hualala.Order.initQueryParams
// 				}),
// 				view : new Hualala.Order.OrderQueryResultView({
// 					mapResultRenderData : Hualala.Order.mapQueryOrderResultRenderData,
// 					renderResult : Hualala.Order.renderQueryOrderResult
// 				})
// 			}),
// 			model : new Hualala.Order.QueryModel({
// 				queryKeys : queryKeys,
// 				initQueryParams : Hualala.Order.initQueryParams
// 			}),
// 			view : new Hualala.Order.QueryView({
// 				mapRenderDataFn : Hualala.Order.mapOrderQueryFormRenderData
// 			})
// 		});
// 	};
// 	/*订单日汇总页面*/
// 	var initQueryOrderDayDetailPage = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		initOrderPageLayout();
// 		var $pageBody = $body.find('.order-body');
// 		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
// 		var queryPanel = new Hualala.Order.QueryController({
// 			container : $pageBody,
// 			resultController : new Hualala.Order.OrderListController({
// 				container : $pageBody,
// 				model : new Hualala.Order.OrderQueryResultModel({
// 					callServer : Hualala.Global.queryOrderDayDetail,
// 					queryKeys : queryKeys,
// 					initQueryParams : Hualala.Order.initQueryParams
// 				}),
// 				view : new Hualala.Order.OrderQueryResultView({
// 					mapResultRenderData : Hualala.Order.mapQueryOrderDuringRenderData,
// 					renderResult : Hualala.Order.renderQueryOrderResult
// 				})
// 			}),
// 			model : new Hualala.Order.QueryModel({
// 				queryKeys : queryKeys,
// 				initQueryParams : Hualala.Order.initQueryParams
// 			}),
// 			view : new Hualala.Order.QueryView({
// 				mapRenderDataFn : Hualala.Order.mapOrderQueryBaseFormRenderData
// 			})
// 		});
// 	};
// 	/*订单期间汇总页面*/
// 	var initQueryOrderDuringDetailPage = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		initOrderPageLayout();
// 		var $pageBody = $body.find('.order-body');
// 		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
// 		var queryPanel = new Hualala.Order.QueryController({
// 			container : $pageBody,
// 			resultController : new Hualala.Order.OrderListController({
// 				container : $pageBody,
// 				model : new Hualala.Order.OrderQueryResultModel({
// 					callServer : Hualala.Global.queryOrderDuringDetail,
// 					queryKeys : queryKeys,
// 					initQueryParams : Hualala.Order.initQueryParams
// 				}),
// 				view : new Hualala.Order.OrderQueryResultView({
// 					mapResultRenderData : Hualala.Order.mapQueryOrderDuringRenderData,
// 					renderResult : Hualala.Order.renderQueryOrderResult
// 				})
// 			}),
// 			model : new Hualala.Order.QueryModel({
// 				queryKeys : queryKeys,
// 				initQueryParams : Hualala.Order.initQueryParams
// 			}),
// 			view : new Hualala.Order.QueryView({
// 				mapRenderDataFn : Hualala.Order.mapOrderQueryBaseFormRenderData
// 			})
// 		});
// 	};
// 	/*菜品销售排行页面*/
// 	var initQueryOrderDishesHotPage = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		initOrderPageLayout();
// 		var $pageBody = $body.find('.order-body');
// 		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
// 		var queryPanel = new Hualala.Order.QueryController({
// 			container : $pageBody,
// 			resultController : new Hualala.Order.OrderListController({
// 				container : $pageBody,
// 				model : new Hualala.Order.OrderQueryResultModel({
// 					hasPager : false,
// 					callServer : Hualala.Global.queryOrderDishesHot,
// 					queryKeys : queryKeys,
// 					initQueryParams : Hualala.Order.initQueryParams
// 				}),
// 				view : new Hualala.Order.OrderQueryResultView({
// 					mapResultRenderData : Hualala.Order.mapQueryDishesHotRenderData,
// 					renderResult : Hualala.Order.renderQueryOrderResult
// 				})
// 			}),
// 			model : new Hualala.Order.QueryModel({
// 				queryKeys : queryKeys,
// 				initQueryParams : Hualala.Order.initQueryParams
// 			}),
// 			view : new Hualala.Order.QueryView({
// 				mapRenderDataFn : Hualala.Order.mapDishesHotQueryFormRenderData
// 			})
// 		});
// 	};
// 	/*顾客统计页面*/
// 	var initQueryOrderCustomerPage = function () {
// 		var ctx = Hualala.PageRoute.getPageContextByPath();
// 		var $body = $('#ix_wrapper > .ix-body > .container');
// 		initOrderPageLayout();
// 		var $pageBody = $body.find('.order-body');
// 		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
// 		var queryPanel = new Hualala.Order.QueryController({
// 			container : $pageBody,
// 			resultController : new Hualala.Order.OrderListController({
// 				container : $pageBody,
// 				model : new Hualala.Order.OrderQueryResultModel({
// 					hasPager : false,
// 					callServer : Hualala.Global.queryUserOrderStatistic,
// 					queryKeys : queryKeys,
// 					initQueryParams : Hualala.Order.initQueryParams
// 				}),
// 				view : new Hualala.Order.OrderQueryResultView({
// 					mapResultRenderData : Hualala.Order.mapQueryUserRenderData,
// 					renderResult : Hualala.Order.renderQueryOrderResult
// 				}) 
// 			}),
// 			model : new Hualala.Order.QueryModel({
// 				queryKeys : queryKeys,
// 				initQueryParams : Hualala.Order.initQueryParams
// 			}),
// 			view : new Hualala.Order.QueryView({
// 				mapRenderDataFn : Hualala.Order.mapUsersQueryFormRenderData
// 			})
// 		});
// 	};


// 	Hualala.Order.OrderPageLayoutInit = initOrderPageLayout;
// 	Hualala.Order.OrderChartInit = initOrderChartPage;
// 	Hualala.Order.QueryOrderInit = initQueryOrderPage;
// 	Hualala.Order.QueryOrderByDayDetailInit = initQueryOrderDayDetailPage;
// 	Hualala.Order.QueryOrderByDuringDetailInit = initQueryOrderDuringDetailPage;
// 	Hualala.Order.QueryOrderDishesHotInit = initQueryOrderDishesHotPage;
// 	Hualala.Order.QueryOrderCustomerInit = initQueryOrderCustomerPage;

// })(jQuery, window);