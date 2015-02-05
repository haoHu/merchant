(function () {
	IX.ns("Hualala.Global");
	var ajaxEngine = Hualala.ajaxEngine;
	ajaxEngine.mappingUrls([
		/*Login Moudle*/
		["genAuthCode", "/getCheckCode.ajax", "", "POST"],
		["loginCallServer", "/login.ajax", "", "POST"],
		/*Dynamic Login*/
		["getMobileDynamicPWD", "/getDynamicCode.action", "", "POST"],
		["dynamicLoginCallServer", "/dynamicLogin.ajax", "", "POST"],
		/*Session Data*/
		["loadAppData", "/getUserInfo.ajax", "", "POST"],
		/*Shop Moudle and Shop Setting Moudle*/
		["getCities", "/shop/queryCity.ajax", "", "POST"],
		["getAreas", "/shop/queryArea.ajax", "", "POST"],
		["getCuisines", "/shop/queryCuisine.ajax", "", "POST"],
		["createShop", "/shop/create.ajax", "", "POST"],
		["updateShopBaseInfo", "/shop/updateShopBaseInfo.ajax", "", "POST"],
		["setShopMap", "/shop/updateMap.ajax", "", "POST"],
		["setShopClientPwd", "/shop/resetPWDforClient.ajax", "", "POST"],
		["getShopInfo", "/shop/queryShopInfo.ajax", "", "POST"],
		["getShopMenu", "/shop/queryShopFoodMenu.ajax", "", "POST"],
		["updateFood", "/shop/updateFoodNetAttribute.ajax", "", "POST"],
		["getShopQuerySchema", "/shop/schema.ajax", "", "POST"],
		["queryShop", "/shop/query.ajax", "", "POST"],
		["switchShopStatus", "/shop/status.ajax", "", "POST"],
		["switchShopServiceFeatureStatus", "/shop/controlServiceFeatures.ajax", "", "POST"],
		["setJustEatParams", "/shop/justEatParam.ajax", "", "POST"],
		["setSpotOrderParams", "/shop/spotParam.ajax", "", "POST"],
		["setTakeAwayParams", "/shop/takeawayParam.ajax", "", "POST"],
		["setTakeOutParams", "/shop/takeoutParam.ajax", "", "POST"],
		["setCommonReserveParams", "/shop/commonreserveParam.ajax", "", "POST"],
		["bindSettleUnitByShopID", "/shop/updateSettleUnitByshopID.ajax", "", "POST"],

		// ["setJustEatParams", "/shop/shopParam.ajax", "", "POST"],
		// ["setSpotOrderParams", "/shop/shopParam.ajax", "", "POST"],

		/*Account Moudle*/
		["queryAccount", "/fsm/queryFsmSettleUnit.ajax", "", "POST"],
		["withdrawCash", "/fsm/Withdraw.ajax", "", "POST"],
		["deleteAccount", "/fsm/deleteFsmSettleUnit.ajax", "", "POST"],
		["editAccount", "/fsm/updateSettleUnit.ajax", "", "POST"],
		["addAccount", "/fsm/addSettleUnit.ajax", "", "POST"],
		["getAccountQueryShop", "/fsm/settlementShopDetail.ajax", "", "POST"],
		["queryAccountTransDetail", "/fsm/queryFsmAccountTransDetail.ajax", "", "POST"],
		["queryAccountOrderPayDetail", "/order/queryOrderPayDetail.ajax", "", "POST"],
		["queryAccountFsmCustomerDetail", "/fsm/queryFsmCustomerDetail.ajax", "", "POST"],
		/*Order Moudle*/
		["queryOrderDetail", "/shop/queryOrderDetail.ajax", "", "POST"],
		["queryOrderDayDetail", "/shop/queryDayOfReconciliation.ajax", "", "POST"],
		["queryOrderDuringDetail", "/shop/queryDuringTheBill.ajax", "", "POST"],
		["queryOrderDishesHot", "/shop/foodStatistic.ajax", "", "POST"],
		["queryUserOrderStatistic", "/shop/UserOrderStatistic.ajax", "", "POST"],
		/*User Moudle*/
		["queryShopGroupChildAccount", "/shop/queryShopAccount.ajax", "", "POST"],
		["removeShopGroupChildAccount", "/shop/removeShopAccount.ajax", "", "POST"],
		["unbindMobileInShopGroupChildAccount", "/shop/unboundMobile.ajax", "", "POST"],
		["resetPWDInShopGroupChildAccount", "/shop/groupChildAccountResetPwd.ajax", "", "POST"],
		["updateShopGroupChildAccount", "/shop/updateShopAccount.ajax", "", "POST"],
		["addShopGroupChildAccount", "/shop/addShopAccount.ajax", "", "POST"],
		["updateRoleBinding", "/shop/addOrUpdateChildAccount.ajax", "", "POST"],
		["queryRoleBinding", "/shop/queryChildAccount.ajax", "", "POST"],
		["bindMobileInShopGroupChildAccount", "/shop/boundMobile.ajax", "", "POST"],

		
		/*CRM Module*/
		["queryCrmMemberSchema", "/crm/cardOverView.ajax", "", "POST"],
		["getCrmParams", "/crm/crmGroupParamsQuery.ajax", "", "POST"],
		["setCrmParams", "/crm/crmGroupParamsUPdateOrAdd.ajax", "", "POST"],
		["getCrmRechargeSets", "/crm/crmSaveMoneySetQuery.ajax", "", "POST"],
		["switchCrmRechargeSetState", "/crm/crmSaveMoneyIsActive.ajax", "", "POST"],
		["addCrmRechargeSet", "/crm/crmSaveMoneySetAdd.ajax", "", "POST"],
		["updateCrmRechargeSet", "/crm/crmSaveMoneySetUpdate.ajax", "", "POST"],
		["getVipLevels", "/crm/crmLevelQuery.ajax", "", "POST"],
		
		["queryCrm", "/crm/crmCustomerCardComplexQuery.ajax", "", "POST"],
		["getCrmDetail", "/crm/crmCustomerCardDetailInfo.ajax", "", "POST"],
		["getCrmTransDetail", "/crm/crmTransDetailQuery.ajax", "", "POST"],
		["getCrmUserEvents", "/crm/crmEventUserQuery.ajax", "", "POST"],
		["getCrmUserGifts", "/crm/crmEGiftDetailQuery.ajax", "", "POST"],
		["getCrmCardLogs", "/crm/crmCustomerCardLogQuery.ajax", "", "POST"],
		["getCrmPreferential", "/crm/crmShopParamsQuery.ajax", "", "POST"],
		["updateCrmPreferential", "/crm/crmShopParamsUpdate.ajax", "", "POST"],
		["getCrmTransSum", "/crm/crmTransDetailSummrizing.ajax", "", "POST"],
		["getCrmCardSum", "/crm/crmCustomerCardCreateSummarize.ajax", "", "POST"],
		["getCrmRechargeSum", "/crm/crmTransDetailSaveMoneyReconcile.ajax", "", "POST"],
		
		
		["getWeixinAccounts", "/wechat/wechatListMp.ajax", "", "POST"],
		["getWeixinAutoReplyList", "/wechat/wechatGetShopAutoReply.ajax", "", "POST"],
		["deleteWeixinAutoReplyRole", "/wechat/wechatDelAutoReplyRule.ajax", "", "POST"],
		["getWeixinResources", "/wechat/wechatResourceAll.ajax", "", "POST"],
		["updateWeixinAutoReplyRole", "/wechat/wechatUpdateAutoReplyRuleShop.ajax", "", "POST"],
		["addWeixinAutoReplyRole", "/wechat/wechatAddAutoReplyRule.ajax", "", "POST"],
		["getWeixinReply", "/wechat/wechatGetAutoReplyById.ajax", "", "POST"],
		
		["getWeixinSubscribe", "/wechat/wechatEventByMpid.ajax", "", "POST"],
		["addWeixinSubscribe", "/wechat/wechatCreateAutoReplyRule.ajax", "", "POST"],
		["updateWeixinSubscribe", "/wechat/wechatUpdateAutoReplyRule.ajax", "", "POST"],
		
		["saveWinxinMenu", "/wechat/wechatUpdateMp.ajax", "", "POST"],
		["importWinxinMenu", "/wechat/wechatGetMenu.ajax", "", "POST"],
		["publishWinxinMenu", "/wechat/wechatCreatMenu.ajax", "", "POST"],
		
		["getAdvertorials", "/sysbase/sysbaseQuerySysMobileAds.ajax", "", "POST"],
		
		["getCrmEvents", "/pay/queryCrmCustomerEvent.ajax", "", "POST"],
		
		["getUserEvents", "/sysbase/querySysEventItemList.ajax", "", "POST"],

		/*MCM Module*/
		["getMCMGifts", "/sysbase/sysEventGiftDetailList.ajax", "", "POST"],
		["deleteMCMGift", "/sysbase/deleteSysGift.ajax", "", "POST"],
		["createMCMGift", "/sysbase/insertSysEventGiftDetail.ajax", "", "POST"],
		["editMCMGift", "/sysbase/updateSysEventGiftDetail.ajax", "", "POST"],
		["getMCMEvents", "/crm/queryCrmCustomerEvent.ajax", "", "POST"],
		["deleteMCMEvent", "/crm/deleteCrmEvent.ajax", "", "POST"],
		["switchMCMEvent", "/crm/switchCrmEvent.ajax", "", "POST"],
		["getMCMEventByID", "/crm/crmCustomerEventById.ajax", "", "POST"],
		["createEvent", "/crm/insertCrmEvent.ajax", "", "POST"],
		["editEvent", "/crm/updateCrmEvent.ajax", "", "POST"],

	]);
	Hualala.Global.commonCallServer = ajaxEngine.createCaller([
		"genAuthCode", "loginCallServer", 
		"getMobileDynamicPWD", "dynamicLoginCallServer",
		"getShopQuerySchema", 
		"queryShop", "switchShopStatus", "switchShopServiceFeatureStatus", 
		"setJustEatParams", "setSpotOrderParams", "setTakeAwayParams", "setTakeOutParams", "setCommonReserveParams", "bindSettleUnitByShopID",
		'getCities', 'getAreas', 'getCuisines',
		'createShop', 'updateShopBaseInfo', 'setShopMap',
		'setShopClientPwd', 'getShopInfo', 'getShopMenu',
		'updateFood',
		{
			name : "loadAppData", 
			onfail : function (data, cbFn, params) {
				cbFn();
			}
		},
		"queryAccount", "withdrawCash", "deleteAccount", "editAccount",
		"addAccount", "getAccountQueryShop", "queryAccountTransDetail",
		"queryAccountOrderPayDetail", "queryAccountFsmCustomerDetail",

		"queryOrderDetail", "queryOrderDayDetail", "queryOrderDuringDetail",
		"queryOrderDishesHot", "queryUserOrderStatistic",

		"queryShopGroupChildAccount", "removeShopGroupChildAccount", 
		"unbindMobileInShopGroupChildAccount", "resetPWDInShopGroupChildAccount", 
		"updateShopGroupChildAccount", "addShopGroupChildAccount",
		"updateRoleBinding", "queryRoleBinding", "bindMobileInShopGroupChildAccount",
		"queryCrmMemberSchema",
		"getCrmParams", "setCrmParams", "getCrmRechargeSets", "switchCrmRechargeSetState", "addCrmRechargeSet", "updateCrmRechargeSet", "getVipLevels",
		"queryCrm", "getCrmDetail", "getCrmTransDetail",
		"getCrmUserEvents", "getCrmUserGifts", "getCrmCardLogs",
		"getCrmPreferential", "updateCrmPreferential",
		"getCrmTransSum", "getCrmCardSum", "getCrmRechargeSum",
		
		"getWeixinAccounts", "getWeixinAutoReplyList", 
		"deleteWeixinAutoReplyRole", "getWeixinResources",
		"updateWeixinAutoReplyRole", "addWeixinAutoReplyRole",
		"getWeixinReply", 
		
		"getWeixinSubscribe", "addWeixinSubscribe",
		"updateWeixinSubscribe",
		
		"saveWinxinMenu", "importWinxinMenu",
		"publishWinxinMenu",
		
		"getAdvertorials",
		
		"getCrmEvents",
		
		"getUserEvents",

		"getMCMGifts", "deleteMCMGift", "createMCMGift", "editMCMGift", "getMCMEvents", "deleteMCMEvent", "switchMCMEvent",
		"getMCMEventByID", "createEvent", "editEvent"
	]);

	/*Login CallServer*/
	Hualala.Global.genAuthCode = function (params, cbFn) {
		Hualala.Global.commonCallServer("genAuthCode", params, cbFn);
	};

	Hualala.Global.loginCallServer = function (params, cbFn) {
		Hualala.Global.commonCallServer("loginCallServer", params, cbFn);
	};

	/*Dynamic Login CallServer*/
	Hualala.Global.getMobileDynamicPWD = function (params, cbFn) {
		Hualala.Global.commonCallServer("getMobileDynamicPWD", params, cbFn);
	};
	Hualala.Global.dynamicLoginCallServer = function (params, cbFn) {
		Hualala.Global.commonCallServer("dynamicLoginCallServer", params, cbFn);
	};

	/*Session Data CallServer*/
	Hualala.Global.loadAppData = function (params, cbFn) {
		Hualala.Global.commonCallServer("loadAppData", params, cbFn);
	};
	
	/*Shop Moudle and Shop Setting Moulde CallServer*/
	Hualala.Global.getCities = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCities", params, cbFn);
	};
	Hualala.Global.getAreas = function (params, cbFn) {
		Hualala.Global.commonCallServer("getAreas", params, cbFn);
	};
	Hualala.Global.getCuisines = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCuisines", params, cbFn);
	};
	Hualala.Global.createShop = function (params, cbFn) {
		Hualala.Global.commonCallServer("createShop", params, cbFn);
	};
	Hualala.Global.updateShopBaseInfo = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateShopBaseInfo", params, cbFn);
	};
	Hualala.Global.setShopMap = function (params, cbFn) {
		Hualala.Global.commonCallServer("setShopMap", params, cbFn);
	};
	Hualala.Global.setShopClientPwd = function (params, cbFn) {
		Hualala.Global.commonCallServer("setShopClientPwd", params, cbFn);
	};
	Hualala.Global.getShopInfo = function (params, cbFn) {
		Hualala.Global.commonCallServer("getShopInfo", params, cbFn);
	};
	Hualala.Global.getShopMenu = function (params, cbFn) {
		Hualala.Global.commonCallServer("getShopMenu", params, cbFn);
	};
	Hualala.Global.updateFood = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateFood", params, cbFn);
	};
	
	Hualala.Global.getShopQuerySchema = function (params, cbFn) {
		Hualala.Global.commonCallServer("getShopQuerySchema", params, cbFn);
	};
	Hualala.Global.queryShop = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryShop", params, cbFn);
	};
	Hualala.Global.switchShopStatus = function (params, cbFn) {
		Hualala.Global.commonCallServer("switchShopStatus", params, cbFn);
	};
	Hualala.Global.switchShopServiceFeatureStatus = function (params, cbFn) {
		Hualala.Global.commonCallServer("switchShopServiceFeatureStatus", params, cbFn);
	};
	Hualala.Global.setJustEatParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("setJustEatParams", params, cbFn);
	};
	Hualala.Global.setSpotOrderParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("setSpotOrderParams", params, cbFn);
	};
	Hualala.Global.setTakeAwayParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("setTakeAwayParams", params, cbFn);
	};
	Hualala.Global.setTakeOutParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("setTakeOutParams", params, cbFn);
	};
	Hualala.Global.setCommonReserveParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("setCommonReserveParams", params, cbFn);
	};
	Hualala.Global.bindSettleUnitByShopID = function (params, cbFn) {
		Hualala.Global.commonCallServer("bindSettleUnitByShopID", params, cbFn);
	};
	

	/*Account Moudle CallServer*/
	Hualala.Global.queryAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryAccount", params, cbFn);
	};
	Hualala.Global.withdrawCash = function (params, cbFn) {
		Hualala.Global.commonCallServer("withdrawCash", params, cbFn);
	};
	Hualala.Global.deleteAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteAccount", params, cbFn);
	};
	Hualala.Global.addAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("addAccount", params, cbFn);
	};
	Hualala.Global.editAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("editAccount", params, cbFn);
	};
	Hualala.Global.getAccountQueryShop = function (params, cbFn) {
		Hualala.Global.commonCallServer("getAccountQueryShop", params, cbFn);
	};
	Hualala.Global.queryAccountTransDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryAccountTransDetail", params, cbFn);
	};
	Hualala.Global.queryAccountOrderPayDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryAccountOrderPayDetail", params, cbFn);
	};
	Hualala.Global.queryAccountFsmCustomerDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryAccountFsmCustomerDetail", params, cbFn);
	};

	/*Order Moudle CallServer*/
	Hualala.Global.queryOrderDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryOrderDetail", params, cbFn);
	};
	Hualala.Global.queryOrderDayDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryOrderDayDetail", params, cbFn);
	};
	Hualala.Global.queryOrderDuringDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryOrderDuringDetail", params, cbFn);
	};
	Hualala.Global.queryOrderDishesHot = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryOrderDishesHot", params, cbFn);
	};
	Hualala.Global.queryUserOrderStatistic = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryUserOrderStatistic", params, cbFn);
	};

	/*User Moudle CallServer*/
	Hualala.Global.queryShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryShopGroupChildAccount", params, cbFn);
	};
	Hualala.Global.removeShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("removeShopGroupChildAccount", params, cbFn);
	};
	Hualala.Global.unbindMobileInShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("unbindMobileInShopGroupChildAccount", params, cbFn);
	};
	Hualala.Global.resetPWDInShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("resetPWDInShopGroupChildAccount", params, cbFn);
	};
	Hualala.Global.updateShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateShopGroupChildAccount", params, cbFn);
	};
	Hualala.Global.addShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("addShopGroupChildAccount", params, cbFn);
	};
	Hualala.Global.updateRoleBinding = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateRoleBinding", params, cbFn);
	};
	Hualala.Global.queryRoleBinding = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryRoleBinding", params, cbFn);
	};
	Hualala.Global.bindMobileInShopGroupChildAccount = function (params, cbFn) {
		Hualala.Global.commonCallServer("bindMobileInShopGroupChildAccount", params, cbFn);
	};
	
	/*CRM module*/
	Hualala.Global.queryCrmMemberSchema = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryCrmMemberSchema", params, cbFn);
	};
	Hualala.Global.getCrmParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmParams", params, cbFn);
	};
	Hualala.Global.setCrmParams = function (params, cbFn) {
		Hualala.Global.commonCallServer("setCrmParams", params, cbFn);
	};
	
	Hualala.Global.getCrmRechargeSets = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmRechargeSets", params, cbFn);
	};
	
	Hualala.Global.switchCrmRechargeSetState = function (params, cbFn) {
		Hualala.Global.commonCallServer("switchCrmRechargeSetState", params, cbFn);
	};
	
	Hualala.Global.addCrmRechargeSet = function (params, cbFn) {
		Hualala.Global.commonCallServer("addCrmRechargeSet", params, cbFn);
	};
	
	Hualala.Global.updateCrmRechargeSet = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateCrmRechargeSet", params, cbFn);
	};
	
	Hualala.Global.getVipLevels = function (params, cbFn) {
		Hualala.Global.commonCallServer("getVipLevels", params, cbFn);
	};
	
	Hualala.Global.queryCrm = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryCrm", params, cbFn);
	};
	
	Hualala.Global.getCrmDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmDetail", params, cbFn);
	};
	
	Hualala.Global.getCrmTransDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmTransDetail", params, cbFn);
	};

	Hualala.Global.getCrmUserEvents = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmUserEvents", params, cbFn);
	};
	
	Hualala.Global.getCrmUserGifts = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmUserGifts", params, cbFn);
	};
	
	Hualala.Global.getCrmCardLogs = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmCardLogs", params, cbFn);
	};
	
	Hualala.Global.getCrmPreferential = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmPreferential", params, cbFn);
	};
	
	Hualala.Global.updateCrmPreferential = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateCrmPreferential", params, cbFn);
	};
	
	Hualala.Global.getCrmTransSum = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmTransSum", params, cbFn);
	};
	
	Hualala.Global.getCrmCardSum = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmCardSum", params, cbFn);
	};
	
	Hualala.Global.getCrmRechargeSum = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmRechargeSum", params, cbFn);
	};
	
	//微信模块
	Hualala.Global.getWeixinAccounts = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinAccounts", params, cbFn);
	};
	
	Hualala.Global.getWeixinAutoReplyList = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinAutoReplyList", params, cbFn);
	};
	
	Hualala.Global.deleteWeixinAutoReplyRole = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteWeixinAutoReplyRole", params, cbFn);
	};
	
	Hualala.Global.getWeixinResources = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinResources", params, cbFn);
	};
	
	Hualala.Global.updateWeixinAutoReplyRole = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateWeixinAutoReplyRole", params, cbFn);
	};
	
	Hualala.Global.addWeixinAutoReplyRole = function (params, cbFn) {
		Hualala.Global.commonCallServer("addWeixinAutoReplyRole", params, cbFn);
	};
	
	Hualala.Global.getWeixinReply = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinReply", params, cbFn);
	};
	
	Hualala.Global.getWeixinSubscribe = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinSubscribe", params, cbFn);
	};
	Hualala.Global.addWeixinSubscribe = function (params, cbFn) {
		Hualala.Global.commonCallServer("addWeixinSubscribe", params, cbFn);
	};
	
	Hualala.Global.updateWeixinSubscribe = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateWeixinSubscribe", params, cbFn);
	};
	
	Hualala.Global.saveWinxinMenu = function (params, cbFn) {
		Hualala.Global.commonCallServer("saveWinxinMenu", params, cbFn);
	};
	
	Hualala.Global.importWinxinMenu = function (params, cbFn) {
		Hualala.Global.commonCallServer("importWinxinMenu", params, cbFn);
	};
	
	Hualala.Global.publishWinxinMenu = function (params, cbFn) {
		Hualala.Global.commonCallServer("publishWinxinMenu", params, cbFn);
	};
	
	Hualala.Global.getAdvertorials = function (params, cbFn) {
		Hualala.Global.commonCallServer("getAdvertorials", params, cbFn);
	};
	
	//会员营销活动
	Hualala.Global.getCrmEvents = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmEvents", params, cbFn);
	};
	//哗啦啦营销活动
	Hualala.Global.getUserEvents = function (params, cbFn) {
		Hualala.Global.commonCallServer("getUserEvents", params, cbFn);
	};
	

	/*MCM Module*/
	Hualala.Global.getMCMGifts = function (params, cbFn) {
		Hualala.Global.commonCallServer("getMCMGifts", params, cbFn);
	};

	Hualala.Global.deleteMCMGift = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteMCMGift", params, cbFn);
	};

	Hualala.Global.createMCMGift = function (params, cbFn) {
		Hualala.Global.commonCallServer("createMCMGift", params, cbFn);
	};

	Hualala.Global.editMCMGift = function (params, cbFn) {
		Hualala.Global.commonCallServer("editMCMGift", params, cbFn);
	};	

	Hualala.Global.getMCMEvents = function (params, cbFn) {
		Hualala.Global.commonCallServer("getMCMEvents", params, cbFn);
	};

	Hualala.Global.deleteMCMEvent = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteMCMEvent", params, cbFn);
	};

	Hualala.Global.switchMCMEvent = function (params, cbFn) {
		Hualala.Global.commonCallServer("switchMCMEvent", params, cbFn);
	};

	Hualala.Global.getMCMEventByID = function (params, cbFn) {
		Hualala.Global.commonCallServer("getMCMEventByID", params, cbFn);
	};

	Hualala.Global.createEvent = function (params, cbFn) {
		Hualala.Global.commonCallServer("createEvent", params, cbFn);
	};

	Hualala.Global.editEvent = function (params, cbFn) {
		Hualala.Global.commonCallServer("editEvent", params, cbFn);
	};


})();












