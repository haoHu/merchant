(function () {
	IX.ns("Hualala.Global");
	var ajaxEngine = Hualala.ajaxEngine;
	ajaxEngine.mappingUrls([
		/*Login Moudle*/
		["genAuthCode", "/getCheckCode.ajax", "", "GET"],
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
		["bindMobileInShopGroupChildAccount", "/shop/boundMobile.ajax", "", "POST"]

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
		"updateRoleBinding", "queryRoleBinding", "bindMobileInShopGroupChildAccount"
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
	






})();