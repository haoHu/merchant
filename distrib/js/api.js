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
})();;(function () {
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
		"genAuthCode", "loginCallServer", "loadAppData", "getShopQuerySchema", 
		"queryShop", "switchShopStatus", "switchShopServiceFeatureStatus", 
		"setJustEatParams", "setSpotOrderParams"
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