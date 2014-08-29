(function () {
	IX.ns("Hualala.Global");
	var ajaxEngine = Hualala.ajaxEngine;
	ajaxEngine.mappingUrls([
		["genAuthCode", "/getCheckCode.ajax", "", "GET"],
		["loginCallServer", "/login.ajax", "", "POST"],
		["loadAppData", "/getUserInfo.ajax", "", "GET"],
		["getShopQuerySchema", "/shop/schema.ajax", "", "GET"],
		["queryShop", "/shop/query.ajax", "", "GET"],
		["switchShopStatus", "/shop/status.ajax", "", "POST"],
		["switchShopServiceFeatureStatus", "/shop/controlServiceFeatures.ajax", "", "POST"],
		["setJustEatParams", "/shop/justEatParam.ajax", "", "POST"],
		["setSpotOrderParams", "/shop/spotParam.ajax", "", "POST"]
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
		}
	]);

	Hualala.Global.genAuthCode = function (params, cbFn) {
		Hualala.Global.commonCallServer("genAuthCode", params, cbFn);
	};

	Hualala.Global.loginCallServer = function (params, cbFn) {
		Hualala.Global.commonCallServer("loginCallServer", params, cbFn);
	};

	Hualala.Global.loadAppData = function (params, cbFn) {
		Hualala.Global.commonCallServer("loadAppData", params, cbFn);
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
})();