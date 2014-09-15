(function () {
	IX.ns("Hualala.Global");
	var ajaxEngine = Hualala.ajaxEngine;
	ajaxEngine.mappingUrls([
		/*Login Moudle*/
		["genAuthCode", "/getCheckCode.ajax", "", "GET"],
		["loginCallServer", "/login.ajax", "", "POST"],
		/*Session Data*/
		["loadAppData", "/getUserInfo.ajax", "", "GET"],
		/*Shop Moudle and Shop Setting Moudle*/
		["getShopQuerySchema", "/shop/schema.ajax", "", "GET"],
		["queryShop", "/shop/query.ajax", "", "GET"],
		["switchShopStatus", "/shop/status.ajax", "", "POST"],
		["switchShopServiceFeatureStatus", "/shop/controlServiceFeatures.ajax", "", "POST"],
		["setJustEatParams", "/shop/justEatParam.ajax", "", "POST"],
		["setSpotOrderParams", "/shop/spotParam.ajax", "", "POST"],
		/*Account Moudle*/
		["queryAccount", "/fsm/queryFsmSettleUnit.ajax", "", "GET"],
		["withdrawCash", "/fsm/Withdraw.ajax", "", "POST"],
		["deleteAccount", "/fsm/deleteFsmSettleUnit.ajax", "", "POST"],
		["editAccount", "/fsm/updateSettleUnit.ajax", "", "POST"],
		["addAccount", "/fsm/addSettleUnit.ajax", "", "POST"],
		["getAccountQueryShop", "/fsm/settlementShopDetail.ajax", "", "GET"],
		["queryAccountTransDetail", "/fsm/queryFsmAccountTransDetail.ajax", "", "GET"],
		["queryAccountOrderPayDetail", "/order/queryOrderPayDetail.ajax", "", "GET"],
		["queryAccountFsmCustomerDetail", "/fsm/queryFsmCustomerDetail.ajax", "", "GET"],

	]);
	Hualala.Global.commonCallServer = ajaxEngine.createCaller([
		"genAuthCode", "loginCallServer", "getShopQuerySchema", 
		"queryShop", "switchShopStatus", "switchShopServiceFeatureStatus", 
		"setJustEatParams", "setSpotOrderParams", 
		{
			name : "loadAppData", 
			onfail : function (data, cbFn, params) {
				cbFn();
			}
		},
		"queryAccount", "withdrawCash", "deleteAccount", "editAccount",
		"addAccount", "getAccountQueryShop", "queryAccountTransDetail",
		"queryAccountOrderPayDetail", "queryAccountFsmCustomerDetail"
	]);

	/*Login CallServer*/
	Hualala.Global.genAuthCode = function (params, cbFn) {
		Hualala.Global.commonCallServer("genAuthCode", params, cbFn);
	};

	Hualala.Global.loginCallServer = function (params, cbFn) {
		Hualala.Global.commonCallServer("loginCallServer", params, cbFn);
	};

	/*Session Data CallServer*/
	Hualala.Global.loadAppData = function (params, cbFn) {
		Hualala.Global.commonCallServer("loadAppData", params, cbFn);
	};
	
	/*Shop Moudle and Shop Setting Moulde CallServer*/
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






})();