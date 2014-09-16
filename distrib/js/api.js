/** 
 * -------------------------------------------------
 * Copyright (c) 2014, All rights reserved. 
 * Hualala-Merchant-Management
 * 
 * @version : 0.1.0
 * @author : HuHao
 * @description : Hualala Merchant Management System.  
 * -------------------------------------------------
 */ 

(function () {
	IX.ns("Hualala.Global");

	Hualala.Global.HOME = "";
	Hualala.Global.CommonSite = "";

	Hualala.Global.HualalaWebSite = "http://www.hualala.com";
	
	Hualala.Global.IMAGE_ROOT = "./asset/img";

	Hualala.Global.SCRIPT_ROOT = "./asset/js";

	Hualala.Global.IMAGE_RESOURCE_DOMAIN = "http://res.hualala.com";
	Hualala.Global.IMAGE_RESOURCE_WATERMARK_DOMAIN = "http://img.hualala.com";

	Hualala.Global.CSS_ROOT = "./asset/css";

	Hualala.Global.SWF_ROOT = "./asset/swf";
	
	Hualala.Global.workMode = "pesudo";
})();;(function () {
	IX.ns("Hualala.Global");
	var urlEngine = Hualala.urlEngine;
	urlEngine.reset({imgUrl : Hualala.Global.IMAGE_ROOT});
	Hualala.ajaxEngine.reset({
		siteUrl : Hualala.Global.HOME
	});
	urlEngine.mappingUrls([
		["img_logo", "/logo.png", "img"],
		["img_gozap", "/gozap.png", "img"],
		["img_loginBanner", "/banner.jpg", "img"],
		["img_photo", "/common_photo.png", "img"],
		["img_blank", "/blank.png", "img"],
		["img_thumb", "/thumbnails/unknown.png", "img"],
		["img_docThumb", "/thumbnails/unknown.png", "img"],
		["common_fileThumbnail", "/files/{id}/thumbnail", "common"],

		// Common File URL (May be not this format)
		["fileUpload", "/api/disk_files"],
		["fileDownload", "/files/{id}/download"],

		["logout", "/logout"]

	]);

	// Socket URL (not using now)
	// Hualala.Global.socketUrl = Hualala.Global.HOME + '/pub';
	
	// get file upload api url
	Hualala.Global.getFileUploaderUrl = function () {
		return urlEngine.genUrl("fileUpload");
	};

	Hualala.Global.getLogoutJumpToUrl = function () {
		return urlEngine.genUrl("logout");
	};

	// get common default image url
	Hualala.Global.getDefaultImage = function (type) {return urlEngine.genUrl("img_" + type); };

	// check is current page
	Hualala.Global.isCurrentPage = function (pageType, params) {
		// var curPath = document.location.pathname,
		// 	path = urlEngine.genUrl(pageType, params);
		// return curPath.indexOf(path) >= 0;
		var curHref = document.location.href,
			link = Hualala.PageRoute.createPath(pageType, params);
		return curHref.indexOf(link.replace(Hualala.Global.HOME, '')) >= 0;
	};
})();;(function () {
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
		["queryAccountFsmCustomerDetail", "/fsm/queryFsmCustomerDetail.ajax", "", "GET"]

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