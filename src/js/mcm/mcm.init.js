(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;

	var MCMHomePageInit = function () {
		Hualala.PageRoute.jumpPage(Hualala.PageRoute.createPath('mcmGiftsMgr'));
	};

	var MCMGiftsMgrInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var queryKeys = Hualala.MCM.QueryFormKeys.GiftMgrQueryKeys;
		// $body.html('<h1>礼品管理页</h1>');
		var panel = new HMCM.QueryController({
			container : $body,
			resultController : new HMCM.QueryResultControler({
				container : $body,
				model : new HMCM.GiftMgrResultModel({
					callServer : Hualala.Global.getMCMGifts,
					queryKeys : queryKeys,
					gridType : 'giftlist',
					recordModel : HMCM.BaseGiftModel
				}),
				view : new HMCM.QueryResultView({
					mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
					renderResult : HMCM.renderQueryResult,
					bundleEvent : HMCM.bundleGiftsQueryResultEvent
				})
			}),
			model : new HMCM.QueryModel({
				queryKeys : queryKeys
			}),
			view : new HMCM.QueryView({
				mapRenderDataFn : HMCM.mapGiftQueryFormRenderData,
				bundleQueryEvent : HMCM.bundleGiftsQueryEvent
			})

		});
		
	};

	var MCMGiftDetailInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		// $body.html('<h1>礼品详情页</h1>');
		var panel = new HMCM.GiftDetailPage({
			container : $body
		});

	};

	var MCMEventMgrInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var queryKeys = Hualala.MCM.QueryFormKeys.EventMgrQueryKeys;
		// $body.html('<h1>活动管理页</h1>');
		var panel = new HMCM.QueryController({
			container : $body,
			resultController : new HMCM.QueryResultControler({
				container : $body,
				model : new HMCM.GiftMgrResultModel({
					callServer : Hualala.Global.getMCMEvents,
					queryKeys : queryKeys,
					gridType : 'eventlsit',
					recordModel : HMCM.BaseEventModel
				}),
				view : new HMCM.QueryResultView({
					mapResultRenderData : HMCM.mapEventsQueryResultRenderData,
					renderResult : HMCM.renderQueryResult,
					bundleEvent : HMCM.bundleEventsQueryResultEvent
				}),
				// view : new HMCM.QueryResultView({
				// 	mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
				// 	renderResult : HMCM.renderQueryResult,
				// 	bundleEvent : HMCM.bundleGiftsQueryResultEvent
				// })
			}),
			model : new HMCM.QueryModel({
				queryKeys : queryKeys
			}),
			view : new HMCM.QueryView({
				mapRenderDataFn : HMCM.mapEventQueryFormRenderData,
				bundleQueryEvent : HMCM.bundleEventsQueryEvent
			})
		});
	};

	var MCMEventTrackInit = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		// $body.html('<h1>活动跟踪页</h1>');
		var panel = new HMCM.EventTrackPage({
			container : $body
		});
	};

	HMCM.MCMHomePageInit = MCMHomePageInit;
	HMCM.MCMGiftsMgrInit = MCMGiftsMgrInit;
	HMCM.MCMGiftDetailInit = MCMGiftDetailInit;
	HMCM.MCMEventMgrInit = MCMEventMgrInit;
	HMCM.MCMEventTrackInit = MCMEventTrackInit;
})(jQuery, window);