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

	Hualala.Global.ECHART_PATH = "./asset/js/dep/echarts-plain.min.js";
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
		// ["about", "/about"],
		// ["contact", "/contact"]

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
		["genAuthCode", "/getCheckCode.ajax", "", "POST"],
		["loginCallServer", "/login.ajax", "", "POST"],
		/*Dynamic Login*/
		["getMobileDynamicPWD", "/getDynamicCode.action", "", "POST"],
		["dynamicLoginCallServer", "/dynamicLogin.ajax", "", "POST"],
		/*Session Data*/
		["loadAppData", "/getUserInfo.ajax", "", "POST"],
		/*Shop Moudle and Shop Setting Moudle*/
		["checkSaasOpen", "/saas/shop/canBeSaas.ajax", "", "POST"],
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
		["updateFoodBasic", "/shop/updateFoodDetail.ajax", "", "POST"],
		["getQRcode",  "/zipTblQrCode.action", "", "POST"],
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
		["updateSetFoodDetail", "/shop/setFoodDetailList.ajax", "", "POST"],
		["searchFood", "/shop/queryFoodUnitList.ajax", "", "POST"],
        //shop menu food sort
        ["sortFoodTop", "/shop/topFoodSort.ajax", "", "POST"],
        ["sortFoodPrevOrNext", "/shop/shiftFoodSort.ajax", "", "POST"],
        ["sortFoodBottom", "/shop/lowFoodSort.ajax", "", "POST"],

        /*shop member module*/
        ["getShopMembers", "/saas/base/empQuery.ajax", "", "POST"],
        ["addShopMember", "/saas/base/empInsert.ajax", "POST"],
        ["updateShopMember", "/saas/base/empUpdate.ajax", "POST"],
        ["deleteShopMember", "/saas/base/empDelete.ajax", "POST"],
        ["queryRights", "/saas/base/rightQuery.ajax", "POST"],
        ["queryRoles", "/saas/base/roleQuery.ajax", "POST"],
        ["setRoleRight", "/saas/base/empSetRight.ajax", "POST"],
        /*shop table module*/
        ["getShopTable", "/saas/base/queryTable.ajax", "POST"],
        ["switchShopTable", "/saas/base/updateTableIsActive.ajax", "POST"],
        ["addShopTable", "/saas/base/addTable.ajax", "POST"],
        ["updateShopTable", "/saas/base/updateTable.ajax", "POST"],
        ["deleteShopTable", "/saas/base/deleteTable.ajax", "POST"],
        ["checkTableExist", "/saas/base/tableIsExist.ajax", "POST"],
        ["getTableArea", "/saas/base/queryArea.ajax", "POST"],
        ["switchTableArea", "/saas/base/updateAreaIsActive.ajax", "POST"],
        ["checkAreaNameExist", "/saas/base/areaIsExist.ajax", "POST"],
        ["deleteTableArea", "/saas/base/deleteArea.ajax", "POST"],
        ["addTableArea", "/saas/base/addArea.ajax", "POST"],
        ["updateTableArea", "/saas/base/updateArea.ajax", "POST"],
        ["setAreaCategory", "/saas/base/setAreaFoodCategoryCodeLst.ajax", "POST"],
        /*shop printer setting*/
        ["addShopPrinter","/saas/base/printerInsert.ajax", "","POST"],
        ["deleteShopPrinter","/saas/base/printerDelete.ajax","","POST"],
        ["updateShopPrinter", "/saas/base/printerUpdate.ajax","","POST"],
        ["getShopPrinter","/saas/base/printerQuery.ajax", "","POST"],
        ["checkPrinterNameExist","/saas/base/printerNameExist.ajax","","POST"],
        /*shop promotion*/
        ["getShopPromotion", "/shop/queryShopPromotionAndRef.ajax", "", "POST"],
        ["deleteShopPromotion", "/shop/deleteShopPromotion.ajax", "", "POST"],
        ["getAllowRefPromotionShop", "/shop/queryAllowRefPromotionShopIds.ajax", "", "POST"],
        ["updatePromotShop", "/shop/updatePromotShopID.ajax", "", "POST"],
        ["cancelRefPromotionRules", "/shop/cancleRefPromotionRules.ajax", "", "POST"],

        /*shop printerArea setting*/
        ["queryPrinterArea", "/saas/base/printerAreaSetQuery.ajax", "", "POST"],
        ["checkprinterAreaName", "/saas/base/printerAreaSetNameIsExist.ajax", "", "POST"],
        ["updatePrinterArea","/saas/base/printerAreaSetUpdate.ajax", "", "POST"],
        ["updatePrinterSet","/saas/base/printerSetUpdate.ajax", "", "POST"],

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
                ["queryAccountDailyReport", "/report/settle/settleDayReport.ajax", "","POST"],
		/*Order Moudle*/
		["queryOrderDetail", "/shop/queryOrderDetail.ajax", "", "POST"],
                ["OrderExport", "/report/export/xls.ajax", "", "POST"],
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
        ["getCrmMemberDailyreport", "/report/customer/customerDayReport.ajax", "", "POST"],
        
        /*Weixin Module*/
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
        ["WeixinMenuClick", "/wechat/wechatAutoReplyForClick.ajax", "", "POST"],
        
        ["getAdvertorials", "/sysbase/sysbaseQuerySysMobileAds.ajax", "", "POST"],
        ["deleteAdvertorial", "/sysbase/sysbaseDeleteSysMobileAds.ajax", "", "POST"],
        ["updateAdvertorial", "/sysbase/sysbaseUpdateSysMobileAds.ajax", "", "POST"],
        ["createAdvertorial", "/sysbase/sysbaseAddSysMobileAds.ajax", "", "POST"],
        
        ["getWeixinContents", "/wechat/wechatResourceFind.ajax", "", "POST"],
        ["deleteWeixinContent", "/wechat/wechatResourceDelete.ajax", "", "POST"],
        ["updateWeixinContent", "/wechat/wechatResourceUpdate.ajax", "", "POST"],
        ["createWeixinContent", "/wechat/wechatResourceInsert.ajax", "", "POST"],
        
        ["getWeixinTexts", "/wechat/wechatResourceTextFind.ajax", "", "POST"],
        ["deleteWeixinText", "/wechat/wechatResourceTextDel.ajax", "", "POST"],
        
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
		["getMCMGiftDetail", "/sysbase/sysEventGiftDetailInfoById.ajax", "", "POST"],
		["queryMCMGiftDetailGetWayInfo", "/sysbase/queryPayUderGiftDetailGetWayInfo.ajax", "", "POST"],
		["queryMCMGiftDetailUsedInfo", "/sysbase/queryPayUderGiftDetailUsingInfo.ajax", "", "POST"],
		["queryUserBaseInfoByMobile", "/sysbase/queryUserBaseInfoByRegMobile.ajax", "", "POST"],
		["sendSMS", "/shop/sendSms.ajax", "", "POST"],
		["giftDetailDonateGift", "/shop/donateGift.ajax", "", "POST"],
		["giftDetailPayGiftOnline", "/sysbase/insertPayShopVoucherTrans.ajax", "", "POST"],
		["getMCMEventTrack", "/crm/crmUserQuery.ajax", "", "POST"],
		["switchMCMTrackItem", "/crm/crmRegisterPartin.ajax", "", "POST"],

        ["getGroupInfo", "/shop/queryGroupInfoByID.ajax", "", "POST"],
        ["queryGroupStyle", "/shop/queryShopGroupStyleInfo.ajax", "", "POST"],
        ["setBrandLogo", "/shop/setGroupLOGO.ajax", "", "POST"],
        
        ["getAgentInfo", "/pos/queryAgentCspService.ajax", "", "POST"],
        ["resetAgentSecret", "/pos/resetShopSecret.ajax", "", "POST"],
        
        ["getFoodDescription", "/shop/queryFoodAdsdetail.ajax", "", "POST"],
        ["setFoodDescription", "/shop/resetFoodAdsdetail.ajax", "", "POST"],

        /*Saas module*/
        ["getSaasCategories", "/saas/shop/getFoodCategory.ajax", "", "POST"],
        ["queryCategories", "/shop/queryShopFoodClass.ajax", "", "POST"],
        ["getSaasDepartments", "/saas/base/departmentQuery.ajax", "", "POST"],
        ["deleteSaasCategory", "/saas/shop/deleteShopFoodClassByShopID.ajax", "", "POST"],
        ["updateSaasCategory", "/saas/shop/updateShopFoodClass.ajax", "", "POST"],
        ["createSaasCategory", "/saas/shop/addShopFoodClass.ajax", "", "POST"],
        ["switchSaasCategory", "/saas/shop/setFoodClassIsActive.ajax", "", "POST"],
        ["sortSaasCategoryTop", "/saas/shop/topFoodClassSort.ajax", "", "POST"],
        ["sortSaasCategoryUpOrDown", "/saas/shop/shiftFoodClassSort.ajax", "", "POST"],
        ["sortSaasCategoryBottom", "/saas/shop/lowFoodClassSort.ajax", "", "POST"],
        ["checkSaasCategoryNameExist", "/saas/shop/checkFoodClassName.ajax", "", "POST"],
        /*Saas goods module*/
        ["querySaasGoods", "/saas/shop/queryShopFood.ajax", "", "POST"],
        ["createSaasGood", "/shop/addFoodNetAttribute.ajax", "", "POST"],
        ["queryGoodByID", "/shop/getFoodLstByCategoryID.ajax", "", "POST"],
        ["checkFoodNameExist", "/saas/shop/checkFoodName.ajax", "", "POST"],
        /*Saas channel module*/
        ["addSaasChannel", "/saas/base/channelInsert.ajax", "", "POST"],
        ["deleteSaasChannel", "/saas/base/channelDelete.ajax", "", "POST"],
        ["updateSaasChannel", "/saas/base/channelUpdate.ajax", "", "POST"],
        ["getSaasChannel",  "/saas/base/channelQuery.ajax", "", "POST"],
        ["switchChannelState", "/saas/base/channelActive.ajax", "", "POST"],
        ["checkChannelName","/saas/base/channelNameExist.ajax", "", "POST"],
        /*Saas department module*/
        ["addSaasDepartment", "/saas/base/departmentInsert.ajax", "", "POST"],
        ["deleteSaasDepartment", "/saas/base/departmentDelete.ajax", "", "POST"],
        ["updateSaasDepartment", "/saas/base/departmentUpdate.ajax", "", "POST"],
        ["querySaasDepartmentType", "/saas/base/departmentTypeComments.ajax", "", "POST"],
        ["checkDepartmentlName",  "/saas/base/departmentNameExist.ajax", "", "POST"],
        ["querySaasDepartmentPrintType", "/saas/base/departmentPrintTypeComments.ajax", "", "POST"],
        /*Saas subject module*/
        ["addSaasSubject", "/saas/base/subjectInsert.ajax ", "", "POST"],
        ["deleteSaasSubject", "/saas/base/subjectDelete.ajax", "", "POST"],
        ["updateSaasSubject", "/saas/base/subjectUpdate.ajax", "", "POST"],
        ["querySaasSubject", "/saas/base/subjectQuery.ajax", "", "POST"],
        ["queryTreeSubject", "/saas/base/subjectQueryTree.ajax", "", "POST"],
        ["checkSubjectlName", "/saas/base/subjectNameExist.ajax", "", "POST" ],
        ["switchSaasSubjectstate", "/saas/base/subjectActive.ajax", "", "POST"],
        /*Saas remarks module*/
        ["addSaasRemark", "/saas/base/orderNotesInsert.ajax ", "", "POST" ],
        ["deleteSaasRemark", "/saas/base/orderNotesDelete.ajax ", "", "POST"],
        ["editSaasRemark", "/saas/base/orderNotesUpdate.ajax ", "", "POST"],
        ["querySaasRemark", "/saas/base/orderNotesQuery.ajax ", "", "POST"]
        


	]);
	Hualala.Global.commonCallServer = ajaxEngine.createCaller([
		"genAuthCode", "loginCallServer", 
		"getMobileDynamicPWD", "dynamicLoginCallServer",
		"getShopQuerySchema", 
		"queryShop", "switchShopStatus", "switchShopServiceFeatureStatus", 
		"setJustEatParams", "setSpotOrderParams", "setTakeAwayParams", "setTakeOutParams", "setCommonReserveParams", "bindSettleUnitByShopID",
		'getCities', 'getAreas', 'getCuisines',
		'createShop', 'updateShopBaseInfo', 'setShopMap',"getQRcode",
		'setShopClientPwd', 'getShopInfo', 'getShopMenu', 'updateFood', 'updateSetFoodDetail', 'searchFood', 'checkSaasOpen',
        'sortFoodTop', 'sortFoodPrevOrNext', 'sortFoodBottom', 'updateFoodBasic',
        'getShopMembers', 'addShopMember', 'updateShopMember', 'deleteShopMember', 'queryRights', 'queryRoles', 'setRoleRight',
        'getShopTable', 'addShopTable', 'updateShopTable', 'deleteShopTable', 'switchShopTable', 'checkTableExist', 'getTableArea',
        'switchTableArea', 'checkAreaNameExist', 'deleteTableArea', 'updateTableArea', 'addTableArea', 'setAreaCategory',
		{
			name : "loadAppData", 
			onfail : function (data, cbFn, params) {
				cbFn();
			}
		},
                'addShopPrinter', 'deleteShopPrinter','updateShopPrinter','getShopPrinter','checkPrinterNameExist',
                'getShopPromotion','deleteShopPromotion','getAllowRefPromotionShop','updatePromotShop',
                'cancelRefPromotionRules',
                'queryPrinterArea', 'checkprinterAreaName', 'updatePrinterArea', 'updatePrinterSet',

		"queryAccount", "withdrawCash", "deleteAccount", "editAccount",
		"addAccount", "getAccountQueryShop", "queryAccountTransDetail",
		"queryAccountOrderPayDetail", "queryAccountFsmCustomerDetail","queryAccountDailyReport",

		"queryOrderDetail", "queryOrderDayDetail", "queryOrderDuringDetail",
		"queryOrderDishesHot", "queryUserOrderStatistic","OrderExport",

		"queryShopGroupChildAccount", "removeShopGroupChildAccount", 
		"unbindMobileInShopGroupChildAccount", "resetPWDInShopGroupChildAccount", 
		"updateShopGroupChildAccount", "addShopGroupChildAccount",
		"updateRoleBinding", "queryRoleBinding", "bindMobileInShopGroupChildAccount",
		"queryCrmMemberSchema",

        "getCrmParams", "setCrmParams", "getCrmRechargeSets", "switchCrmRechargeSetState", "addCrmRechargeSet", "updateCrmRechargeSet", "getVipLevels",
        "queryCrm", "getCrmDetail", "getCrmTransDetail",
        "getCrmUserEvents", "getCrmUserGifts", "getCrmCardLogs",
        "getCrmPreferential", "updateCrmPreferential",
        "getCrmTransSum", "getCrmCardSum", "getCrmRechargeSum","getCrmMemberDailyreport",
        
        "getWeixinAccounts", "getWeixinAutoReplyList", 
        "deleteWeixinAutoReplyRole", "getWeixinResources",
        "updateWeixinAutoReplyRole", "addWeixinAutoReplyRole",
        "getWeixinReply", 
        
        "getWeixinSubscribe", "addWeixinSubscribe",
        "updateWeixinSubscribe",
        
        "saveWinxinMenu", "importWinxinMenu",
        "publishWinxinMenu", "WeixinMenuClick",
        
        "getAdvertorials", "deleteAdvertorial", "updateAdvertorial", "createAdvertorial",
        
        "getWeixinContents", "deleteWeixinContent", "updateWeixinContent", "createWeixinContent",
        "getWeixinTexts", "deleteWeixinText",
        
        "getCrmEvents",
        
        "getUserEvents",

        "getMCMGifts", "deleteMCMGift", "createMCMGift", "editMCMGift", "getMCMEvents", "deleteMCMEvent", "switchMCMEvent",
		"getMCMEventByID", "createEvent", "editEvent", "getMCMGiftDetail", "queryMCMGiftDetailGetWayInfo", "queryMCMGiftDetailUsedInfo",
		"queryUserBaseInfoByMobile", "sendSMS",
		"giftDetailDonateGift", "giftDetailPayGiftOnline", "getMCMEventTrack", "switchMCMTrackItem",
        
        "getGroupInfo", "queryGroupStyle", "setBrandLogo", "getAgentInfo", "resetAgentSecret",
        "getFoodDescription", "setFoodDescription",
        "getSaasCategories", "queryCategories", "getSaasDepartments", "deleteSaasCategory", "updateSaasCategory", "createSaasCategory",
        "switchSaasCategory", "sortSaasCategoryTop", "sortSaasCategoryUpOrDown","sortSaasCategoryBottom", 'checkSaasCategoryNameExist',

        "querySaasGoods", "createSaasGood", 'queryGoodByID', 'checkFoodNameExist',

        "addSaasChannel","deleteSaasChannel", "updateSaasChannel", "getSaasChannel", "switchChannelState", "checkChannelName",
        
        "addSaasDepartment", "deleteSaasDepartment", "updateSaasDepartment","checkDepartmentlName", "querySaasDepartmentType", "querySaasDepartmentPrintType",

        "addSaasSubject", "deleteSaasSubject", "updateSaasSubject", "querySaasSubject", "queryTreeSubject", "checkSubjectlName", "switchSaasSubjectstate",

        "addSaasRemark", "deleteSaasRemark", "editSaasRemark", "querySaasRemark",
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
    Hualala.Global.checkSaasOpen = function (params, cbFn) {
        Hualala.Global.commonCallServer("checkSaasOpen", params, cbFn);
    };
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
    Hualala.Global.updateFoodBasic = function (params, cbFn) {
        Hualala.Global.commonCallServer("updateFoodBasic", params, cbFn);
    };
    Hualala.Global.updateSetFoodDetail = function(params, cbFn) {
        Hualala.Global.commonCallServer("updateSetFoodDetail", params, cbFn);
    };
    Hualala.Global.searchFood = function(params, cbFn) {
        Hualala.Global.commonCallServer("searchFood", params, cbFn);
    };
    Hualala.Global.sortFoodTop = function(params, cbFn) {
        Hualala.Global.commonCallServer("sortFoodTop", params, cbFn);
    };
    Hualala.Global.sortFoodPrevOrNext = function(params, cbFn) {
        Hualala.Global.commonCallServer("sortFoodPrevOrNext", params, cbFn);
    };
    Hualala.Global.sortFoodBottom = function(params, cbFn) {
        Hualala.Global.commonCallServer("sortFoodBottom", params, cbFn);
    };
    Hualala.Global.getShopMembers = function (params, cbFn) {
        Hualala.Global.commonCallServer("getShopMembers", params, cbFn);
    };
    Hualala.Global.addShopMember = function(params, cbFn) {
        Hualala.Global.commonCallServer('addShopMember', params, cbFn);
    };
    Hualala.Global.updateShopMember = function(params, cbFn) {
        Hualala.Global.commonCallServer('updateShopMember', params, cbFn);
    };
    Hualala.Global.deleteShopMember = function(params, cbFn) {
        Hualala.Global.commonCallServer('deleteShopMember', params, cbFn);
    };
    Hualala.Global.queryRights = function(params, cbFn) {
        Hualala.Global.commonCallServer('queryRights', params, cbFn);
    };
    Hualala.Global.queryRoles = function(params, cbFn) {
        Hualala.Global.commonCallServer('queryRoles', params, cbFn);
    };
    Hualala.Global.setRoleRight = function(params, cbFn) {
        Hualala.Global.commonCallServer('setRoleRight', params, cbFn);
    };
    Hualala.Global.getShopTable = function (params, cbFn) {
        Hualala.Global.commonCallServer("getShopTable", params, cbFn);
    };
    Hualala.Global.addShopTable = function (params, cbFn) {
        Hualala.Global.commonCallServer("addShopTable", params, cbFn);
    };
    Hualala.Global.updateShopTable = function (params, cbFn) {
        Hualala.Global.commonCallServer("updateShopTable", params, cbFn);
    };
    Hualala.Global.deleteShopTable = function(params, cbFn) {
        Hualala.Global.commonCallServer('deleteShopTable', params, cbFn);
    };
    Hualala.Global.checkTableExist = function(params, cbFn) {
        Hualala.Global.commonCallServer('checkTableExist', params, cbFn);
    };
    Hualala.Global.switchShopTable = function(params, cbFn) {
        Hualala.Global.commonCallServer('switchShopTable', params, cbFn);
    };
    Hualala.Global.getTableArea = function(params, cbFn) {
        Hualala.Global.commonCallServer('getTableArea', params, cbFn)
    };
    Hualala.Global.deleteTableArea = function(params, cbFn) {
        Hualala.Global.commonCallServer('deleteTableArea', params, cbFn);
    };
    Hualala.Global.switchTableArea = function(params, cbFn) {
        Hualala.Global.commonCallServer('switchTableArea', params, cbFn);
    };
    Hualala.Global.checkAreaNameExist = function(params, cbFn) {
        Hualala.Global.commonCallServer('checkAreaNameExist', params, cbFn);
    };
    Hualala.Global.addTableArea = function (params, cbFn) {
        Hualala.Global.commonCallServer("addTableArea", params, cbFn);
    };
    Hualala.Global.updateTableArea = function (params, cbFn) {
        Hualala.Global.commonCallServer("updateTableArea", params, cbFn);
    };
    Hualala.Global.setAreaCategory = function (params, cbFn) {
        Hualala.Global.commonCallServer("setAreaCategory", params, cbFn);
    };
    Hualala.Global.addShopPrinter = function (params, cbFn){
        Hualala.Global.commonCallServer("addShopPrinter", params, cbFn);
    };
    Hualala.Global.deleteShopPrinter = function(params, cbFn){
        Hualala.Global.commonCallServer("deleteShopPrinter",params,cbFn);
    };
    Hualala.Global.updateShopPrinter = function(params, cbFn){
        Hualala.Global.commonCallServer("updateShopPrinter",params,cbFn);
    };
    Hualala.Global.getShopPrinter = function(params, cbFn){
        Hualala.Global.commonCallServer("getShopPrinter", params,cbFn);
    };
    Hualala.Global.checkPrinterNameExist =function(params,cbFn){
        Hualala.Global.commonCallServer("checkPrinterNameExist",params,cbFn);
    };
    Hualala.Global.queryPrinterArea = function(params,cbFn){
        Hualala.Global.commonCallServer("queryPrinterArea",params,cbFn);
    };
    Hualala.Global.checkprinterAreaName =function (params, cbFn){
        Hualala.Global.commonCallServer("checkprinterAreaName", params,cbFn);
    };
    Hualala.Global.updatePrinterArea = function(params,cbFn){
        Hualala.Global.commonCallServer("updatePrinterArea", params,cbFn);
    };
    Hualala.Global.updatePrinterSet = function(params,cbFn){
        Hualala.Global.commonCallServer("updatePrinterSet",params,cbFn);
    };
    Hualala.Global.getShopPromotion = function (params, cbFn) {
        Hualala.Global.commonCallServer("getShopPromotion",params, cbFn);
    };
    Hualala.Global.deleteShopPromotion= function (params, cbFn) {
        Hualala.Global.commonCallServer("deleteShopPromotion",params, cbFn);
    };
    Hualala.Global.getAllowRefPromotionShop = function(params, cbFn){
        Hualala.Global.commonCallServer("getAllowRefPromotionShop", params,cbFn);
    };
    Hualala.Global.updatePromotShop = function(params, cbFn){
        Hualala.Global.commonCallServer("updatePromotShop", params, cbFn);
    };
    Hualala.Global.cancelRefPromotionRules = function(params,cbFn){
        Hualala.Global.commonCallServer("cancelRefPromotionRules", params, cbFn);
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
	Hualala.Global.getQRcode = function (params, cbFn) {
		Hualala.Global.commonCallServer("getQRcode", params, cbFn);
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
        Hualala.Global.queryAccountDailyReport = function (params, cbFn) {
                Hualala.Global.commonCallServer("queryAccountDailyReport", params, cbFn);
        };

	/*Order Moudle CallServer*/
	Hualala.Global.queryOrderDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryOrderDetail", params, cbFn);
	};
        Hualala.Global.OrderExport =function (params, cbFn) {
                Hualala.Global.commonCallServer("OrderExport", params, cbFn);
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
        Hualala.Global.getCrmMemberDailyreport = function (params, cbFn) {
                Hualala.Global.commonCallServer("getCrmMemberDailyreport", params, cbFn);
        };
	
	//΢��ģ��
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
    
    Hualala.Global.WeixinMenuClick = function (params, cbFn) {
		Hualala.Global.commonCallServer("WeixinMenuClick", params, cbFn);
	};
	
	Hualala.Global.getAdvertorials = function (params, cbFn) {
		Hualala.Global.commonCallServer("getAdvertorials", params, cbFn);
	};
    
    Hualala.Global.deleteAdvertorial = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteAdvertorial", params, cbFn);
	};
    
    Hualala.Global.updateAdvertorial = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateAdvertorial", params, cbFn);
	};
    
    Hualala.Global.createAdvertorial = function (params, cbFn) {
		Hualala.Global.commonCallServer("createAdvertorial", params, cbFn);
	};
    
    Hualala.Global.getWeixinContents = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinContents", params, cbFn);
	};
    
    Hualala.Global.deleteWeixinContent = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteWeixinContent", params, cbFn);
	};
    
    Hualala.Global.updateWeixinContent = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateWeixinContent", params, cbFn);
	};
    
    Hualala.Global.createWeixinContent = function (params, cbFn) {
		Hualala.Global.commonCallServer("createWeixinContent", params, cbFn);
	};
    
    Hualala.Global.getWeixinTexts = function (params, cbFn) {
		Hualala.Global.commonCallServer("getWeixinTexts", params, cbFn);
	};
    
    Hualala.Global.deleteWeixinText = function (params, cbFn) {
		Hualala.Global.commonCallServer("deleteWeixinText", params, cbFn);
	};
    
    //��ԱӪ��
    Hualala.Global.getCrmEvents = function (params, cbFn) {
		Hualala.Global.commonCallServer("getCrmEvents", params, cbFn);
	};
	//������Ӫ��
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

	Hualala.Global.getMCMGiftDetail = function (params, cbFn) {
		Hualala.Global.commonCallServer("getMCMGiftDetail", params, cbFn);
	};

	Hualala.Global.queryMCMGiftDetailGetWayInfo = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryMCMGiftDetailGetWayInfo", params, cbFn);
	};

	Hualala.Global.queryMCMGiftDetailUsedInfo = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryMCMGiftDetailUsedInfo", params, cbFn);
	};

	
	Hualala.Global.queryUserBaseInfoByMobile = function (params, cbFn) {
		Hualala.Global.commonCallServer("queryUserBaseInfoByMobile", params, cbFn);
	};

	Hualala.Global.sendSMS = function (params, cbFn) {
		Hualala.Global.commonCallServer("sendSMS", params, cbFn);
	};

	Hualala.Global.giftDetailDonateGift = function (params, cbFn) {
		Hualala.Global.commonCallServer("giftDetailDonateGift", params, cbFn);
	};

	Hualala.Global.giftDetailPayGiftOnline = function (params, cbFn) {
		Hualala.Global.commonCallServer("giftDetailPayGiftOnline", params, cbFn);
	};

	Hualala.Global.getMCMEventTrack = function (params, cbFn) {
		Hualala.Global.commonCallServer("getMCMEventTrack", params, cbFn);
	};

    Hualala.Global.switchMCMTrackItem = function (params, cbFn) {
        Hualala.Global.commonCallServer("switchMCMTrackItem", params, cbFn);
    };

    Hualala.Global.getGroupInfo = function (params, cbFn) {
		Hualala.Global.commonCallServer("getGroupInfo", params, cbFn);
	};

    Hualala.Global.queryGroupStyle = function (params, cbFn) {
        Hualala.Global.commonCallServer("queryGroupStyle", params, cbFn);
    };

    Hualala.Global.setBrandLogo = function (params, cbFn) {
		Hualala.Global.commonCallServer("setBrandLogo", params, cbFn);
	};
    
    Hualala.Global.getAgentInfo = function (params, cbFn) {
		Hualala.Global.commonCallServer("getAgentInfo", params, cbFn);
	};

	Hualala.Global.resetAgentSecret = function (params, cbFn) {
		Hualala.Global.commonCallServer("resetAgentSecret", params, cbFn);
	};
    
    Hualala.Global.getFoodDescription = function (params, cbFn) {
		Hualala.Global.commonCallServer("getFoodDescription", params, cbFn);
	};

	Hualala.Global.setFoodDescription = function (params, cbFn) {
		Hualala.Global.commonCallServer("setFoodDescription", params, cbFn);
	};

    Hualala.Global.checkSaasCategoryNameExist = function (params, cbFn) {
        Hualala.Global.commonCallServer("checkSaasCategoryNameExist", params, cbFn);
    };

    Hualala.Global.getSaasCategories = function (params, cbFn) {
        Hualala.Global.commonCallServer("getSaasCategories", params, cbFn);
    };

    Hualala.Global.queryCategories = function (params, cbFn) {
        Hualala.Global.commonCallServer("queryCategories", params, cbFn);
    };

    Hualala.Global.getSaasDepartments =function (params, cbFn) {
        Hualala.Global.commonCallServer("getSaasDepartments", params, cbFn);
    };

    Hualala.Global.deleteSaasCategory = function (params, cbFn) {
        Hualala.Global.commonCallServer("deleteSaasCategory", params, cbFn);
    };

    Hualala.Global.updateSaasCategory = function (params, cbFn) {
        Hualala.Global.commonCallServer("updateSaasCategory", params, cbFn);
    };

    Hualala.Global.createSaasCategory = function (params, cbFn) {
        Hualala.Global.commonCallServer("createSaasCategory", params, cbFn);
    };

    Hualala.Global.switchSaasCategory = function (params, cbFn) {
        Hualala.Global.commonCallServer("switchSaasCategory", params, cbFn);
    };

    Hualala.Global.sortSaasCategoryTop = function (params, cbFn) {
        Hualala.Global.commonCallServer("sortSaasCategoryTop", params, cbFn);
    };

    Hualala.Global.sortSaasCategoryUpOrDown = function (params, cbFn) {
        Hualala.Global.commonCallServer("sortSaasCategoryUpOrDown", params, cbFn);
    };

    Hualala.Global.sortSaasCategoryBottom = function (params, cbFn) {
        Hualala.Global.commonCallServer("sortSaasCategoryBottom", params, cbFn);
    };
    Hualala.Global.addSaasChannel = function (params, cbFn) {
    	Hualala.Global.commonCallServer("addSaasChannel", params, cbFn);
    };
    Hualala.Global.checkChannelName = function (params, cbFn) {
    	Hualala.Global.commonCallServer("checkChannelName", params ,cbFn);
    };
    Hualala.Global.updateSaasChannel = function(params, cbFn) {
    	Hualala.Global.commonCallServer("updateSaasChannel", params, cbFn);
    };
    Hualala.Global.getSaasChannel = function(params, cbFn) {
    	Hualala.Global.commonCallServer("getSaasChannel", params, cbFn);
    };
    Hualala.Global.switchChannelState = function(params, cbFn) {
    	Hualala.Global.commonCallServer("switchChannelState", params, cbFn);
    };
    Hualala.Global.deleteSaasChannel = function(params, cbFn) {
    	Hualala.Global.commonCallServer("deleteSaasChannel",params, cbFn);
    };
    Hualala.Global.addSaasDepartment = function (params, cbFn) {
    	Hualala.Global.commonCallServer("addSaasDepartment", params, cbFn);
    };    
    Hualala.Global.updateSaasDepartment = function (params, cbFn) {
    	Hualala.Global.commonCallServer("updateSaasDepartment", params, cbFn);
    };
    Hualala.Global.deleteSaasDepartment = function (params, cbFn) {
    	Hualala.Global.commonCallServer("deleteSaasDepartment", params, cbFn);
    };
    Hualala.Global.checkDepartmentlName = function (params, cbFn) {
    	Hualala.Global.commonCallServer("checkDepartmentlName",params, cbFn);
    };
    Hualala.Global.querySaasDepartmentType = function (params, cbFn) {
    	Hualala.Global.commonCallServer("querySaasDepartmentType", params, cbFn);
    };
    Hualala.Global.querySaasDepartmentPrintType = function (params, cbFn) {
    	Hualala.Global.commonCallServer("querySaasDepartmentPrintType", params, cbFn);
    };

    //Saas goods module
    Hualala.Global.querySaasGoods = function (params, cbFn) {
        Hualala.Global.commonCallServer("querySaasGoods", params, cbFn);
    };

    Hualala.Global.createSaasGood = function (params, cbFn) {
        Hualala.Global.commonCallServer("createSaasGood", params, cbFn);
    };

    Hualala.Global.checkFoodNameExist = function (params, cbFn) {
        Hualala.Global.commonCallServer("checkFoodNameExist", params, cbFn);
    };

    Hualala.Global.queryGoodByID = function (params, cbFn) {
        Hualala.Global.commonCallServer("queryGoodByID", params, cbFn);
    };

    /*Saas subject*/
    Hualala.Global.addSaasSubject = function (params, cbFn) {
    	Hualala.Global.commonCallServer("addSaasSubject", params, cbFn);
    },
    Hualala.Global.deleteSaasSubject = function (params, cbFn) {
    	Hualala.Global.commonCallServer("deleteSaasSubject", params, cbFn);
    },
    Hualala.Global.updateSaasSubject = function (params, cbFn) {
    	Hualala.Global.commonCallServer("updateSaasSubject", params, cbFn);
    },
    Hualala.Global.querySaasSubject = function (params, cbFn) {
    	Hualala.Global.commonCallServer("querySaasSubject", params, cbFn);
    },
    Hualala.Global.queryTreeSubject = function (params, cbFn) {
    	Hualala.Global.commonCallServer("queryTreeSubject", params, cbFn);
    },
    Hualala.Global.switchSaasSubjectstate = function (params, cbFn) {
    	Hualala.Global.commonCallServer("switchSaasSubjectstate", params, cbFn);
    },
    Hualala.Global.checkSubjectlName = function (params, cbFn) {
    	Hualala.Global.commonCallServer("checkSubjectlName", params, cbFn);
    },
    /*Saas remarks*/
    Hualala.Global.addSaasRemark = function (params, cbFn) {
    	Hualala.Global.commonCallServer("addSaasRemark", params, cbFn);
    },
    Hualala.Global.deleteSaasRemark = function(params, cbFn) {
    	Hualala.Global.commonCallServer("deleteSaasRemark", params, cbFn);
    },
    Hualala.Global.editSaasRemark = function(params, cbFn) {
    	Hualala.Global.commonCallServer("editSaasRemark", params, cbFn);
    },
    Hualala.Global.querySaasRemark = function(params, cbFn) {
    	Hualala.Global.commonCallServer("querySaasRemark", params, cbFn);
    }

})();












