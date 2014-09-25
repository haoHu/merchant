(function ($, window) {
	IX.ns("Hualala.Order");
	/*订单模块子页面布局*/
	var initOrderPageLayout = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.empty();
		var mapNavRenderData = function () {
			var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
			var navs = _.map(Hualala.TypeDef.OrderSubNavType, function (v, i, list) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					if (v == 'startDate' || v == 'endDate') {
						return curDateStamp;
					}
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
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.html('<div class="order-subnav clearfix" /><div class="order-body" ><div class="order-query-box"></div><div class="order-result-box"></div></div>');
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
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					callServer : Hualala.Global.queryOrderDetail,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryOrderResultRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapOrderQueryFormRenderData
			})
		});
	};
	/*订单日汇总页面*/
	var initQueryOrderDayDetailPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					callServer : Hualala.Global.queryOrderDayDetail,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryOrderDuringRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapOrderQueryBaseFormRenderData
			})
		});
	};
	/*订单期间汇总页面*/
	var initQueryOrderDuringDetailPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					callServer : Hualala.Global.queryOrderDuringDetail,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryOrderDuringRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapOrderQueryBaseFormRenderData
			})
		});
	};
	/*菜品销售排行页面*/
	var initQueryOrderDishesHotPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					hasPager : false,
					callServer : Hualala.Global.queryOrderDishesHot,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryDishesHotRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				})
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapDishesHotQueryFormRenderData
			})
		});
	};
	/*顾客统计页面*/
	var initQueryOrderCustomerPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initOrderPageLayout();
		var $pageBody = $body.find('.order-body');
		var queryKeys = $XP(_.findWhere(Hualala.TypeDef.OrderSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		var queryPanel = new Hualala.Order.QueryController({
			container : $pageBody,
			resultController : new Hualala.Order.OrderListController({
				container : $pageBody,
				model : new Hualala.Order.OrderQueryResultModel({
					hasPager : false,
					callServer : Hualala.Global.queryUserOrderStatistic,
					queryKeys : queryKeys,
					initQueryParams : Hualala.Order.initQueryParams
				}),
				view : new Hualala.Order.OrderQueryResultView({
					mapResultRenderData : Hualala.Order.mapQueryUserRenderData,
					renderResult : Hualala.Order.renderQueryOrderResult
				}) 
			}),
			model : new Hualala.Order.QueryModel({
				queryKeys : queryKeys,
				initQueryParams : Hualala.Order.initQueryParams
			}),
			view : new Hualala.Order.QueryView({
				mapRenderDataFn : Hualala.Order.mapUsersQueryFormRenderData
			})
		});
	};


	Hualala.Order.OrderPageLayoutInit = initOrderPageLayout;
	Hualala.Order.OrderChartInit = initOrderChartPage;
	Hualala.Order.QueryOrderInit = initQueryOrderPage;
	Hualala.Order.QueryOrderByDayDetailInit = initQueryOrderDayDetailPage;
	Hualala.Order.QueryOrderByDuringDetailInit = initQueryOrderDuringDetailPage;
	Hualala.Order.QueryOrderDishesHotInit = initQueryOrderDishesHotPage;
	Hualala.Order.QueryOrderCustomerInit = initQueryOrderCustomerPage;

})(jQuery, window);