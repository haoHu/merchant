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
        ["resetMemberPassword", "/saas/base/empResetPWD.ajax", "POST"],
        ["switchMember", "/saas/base/empUpdateAccountStatus.ajax", "POST"],
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
        ["shopTableSortTop", "/shop/topTableSort.ajax", "POST"],
        ["shopTableSortUpOrDown", "/shop/shiftTableSort.ajax", "POST"],
        ["shopTableSortBottom", "/shop/lowTableSort.ajax", "POST"],
        ["tableAreaSortTop", "/shop/topAreaSort.ajax", "POST"],
        ["tableAreaSortUpOrDown", "/shop/shiftAreaSort.ajax", "POST"],
        ["tableAreaSortBottom", "/shop/lowAreaSort.ajax", "POST"],
        /*shop printer setting*/
        ["addShopPrinter","/saas/base/printerInsert.ajax", "","POST"],
        ["deleteShopPrinter","/saas/base/printerDelete.ajax","","POST"],
        ["updateShopPrinter", "/saas/base/printerUpdate.ajax","","POST"],
        ["getShopPrinter","/saas/base/printerQuery.ajax", "","POST"],
        ["checkPrinterNameExist","/saas/base/printerNameExist.ajax","","POST"],
        /*shop promotion*/
        ["getShopPromotion", "/shop/queryShopPromotionAndRef.ajax", "", "POST"],
        ["createShopPromotion","/shop/addShopPromotionRules.ajax", "", "POST"],
        ["updateShopPromotion","/shop/updateShopPromotionRules.ajax", "", "POST"],
        ["deleteShopPromotion", "/shop/deleteShopPromotion.ajax", "", "POST"],
        ["promotionTimeCheck","/shop/setShopPromotionTimeCheck.ajax", "", "POST"],
        ["queryGiftDetail","/shop/querySysEventGiftDetailList.ajax", "", "POST"],
        ["promotionRulesToString","/shop/promotionRulesJsonToString.ajax", "", "POST"],
        ["getAllowRefPromotionShop", "/shop/queryAllowRefPromotionShopIds.ajax", "", "POST"],
        ["updatePromotShop", "/shop/updatePromotShopID.ajax", "", "POST"],
        ["cancelRefPromotionRules", "/shop/cancleRefPromotionRules.ajax", "", "POST"],
        ["switchShopPromotion","/shop/shopPromotionIsActive.ajax", "", "POST"],

        /*shop printerArea setting*/
        /*["queryPrinterArea", "/saas/base/printerAreaSetQuery.ajax", "", "POST"],
        ["checkprinterAreaName", "/saas/base/printerAreaSetNameIsExist.ajax", "", "POST"],
        ["updatePrinterArea","/saas/base/printerAreaSetUpdate.ajax", "", "POST"],
        ["updatePrinterSet","/saas/base/printerSetUpdate.ajax", "", "POST"],
        ["deletePrinterSet","/saas/base/printerSetDelete.ajax","","POST"],
        ["addPrintSet","/saas/base/printerSetInsert.ajax", "", "POST"],
        ["queryPrintDepartment","/saas/base/deptNotInPrintSetQuery.ajax","", "POST"],*/
        ["queryPrinterArea","/saas/base/kitchenPrinterQuery.ajax", "", "POST"],
        ["setAreaPrinter","/saas/base/dispatchBillPrinterSet.ajax", "", "POST"],
        ["setDepartmentPrinter","/saas/base/printerSet.ajax", "", "POST"],

        /*shop discountmange Module*/
        ["addDiscount","/saas/base/discountRoleInsert.ajax", "", "POST"],
        ["deleteDiscount","/saas/base/discountRoleDelete.ajax", "", "POST"],
        ["editDiscount","/saas/base/discountRoleUpdate.ajax","","POST"],
        ["queryDiscount","/saas/base/discountRoleQuery.ajax", "", "POST"],
        ["checkDiscountNameExist","/saas/base/discountRoleNameExist.ajax","","POST"],
        ["switchDiscount","/saas/base/discountRoleIsActive.ajax","","POST"],

        /*shop Timemange Module*/
        ["queryShopTime", "/shop/queryShopTimeAndRef.ajax",  "", "POST"],
        ["updateShopTime"," /shop/updateShopTime.ajax", "", "POST"],
        ["getRefTimeShops", "/shop/queryAllowRefTimeShopIds.ajax",  "", "POST"],
        ["bindRefShopTime", "/shop/updateTimeShopID.ajax",  "",  "POST"],
        ["cancleRefShopTime", "/shop/cancleRefShopTime.ajax", "", "POST"],
        ["switchShopTime", "/shop/shopTimeSetIsActive.ajax", "", "POST"],
        ["initShopTime","/shop/initShopTime.ajax","", "POST"],

        //shop SaasParams Module
        ["getSaasShopParams","/saas/base/getShopParams.ajax","", "POST"],
        ["getSaasDeviceParams","/saas/base/getDeviceInfoLst.ajax","", "POST"],
        ["updateSaasShopParams","/saas/base/updateShopParams.ajax","", "POST"],
        ["updateSaasDeviceParams","/saas/base/updateDeviceInfo.ajax","", "POST"],

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
        ["queryOrderInfoByKey","/order/queryOrderInfoByKey.ajax", "", "POST"],
	["queryAccountOrderPayDetail", "/order/queryOrderPayDetail.ajax", "", "POST"],
	["queryAccountFsmCustomerDetail", "/fsm/queryFsmCustomerDetail.ajax", "", "POST"],
        ["queryAccountDailyReport", "/report/settle/settleDayReport.ajax", "","POST"],
        ["rechargeCreateOrder", " /fsm/settleOrderCreate.ajax", "","POST"],
        ["queryAccountOrder","/fsm/settleOrderQuery.ajax", "","POST"],

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
        ["queryRoleRight", "/shop/queryShopPageRights.ajax", "", "POST"],
        ["queryAccountRight", "/shop/queryShopGroupChildAccountPageRight.ajax", "", "POST"],
        ["updateAccountRight", "/shop/updateShopGroupChildAccountPageRight.ajax", "", "POST"],

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
        ["updateCrmBasicInfo", "/shop/dianpuUpdateCardMessage.ajax", "", "POST"],
        ["getCrmTransDetail", "/crm/crmTransDetailQuery.ajax", "", "POST"],
        ["getCrmUserEvents", "/crm/crmEventUserQuery.ajax", "", "POST"],
        ["getCrmUserGifts", "/crm/crmEGiftDetailQuery.ajax", "", "POST"],
        ["getCrmCardLogs", "/crm/crmCustomerCardLogQuery.ajax", "", "POST"],
        ["getCrmPreferential", "/crm/crmShopParamsQuery.ajax", "", "POST"],
        ["getCrmShopPreferential", "/crm/shopParamsQuery.ajax", "", "POST"],
        ["updateCrmPreferential", "/crm/crmShopParamsUpdate.ajax", "", "POST"],
        ["updateCrmShopPreferential", "/crm/shopParamsUpdate.ajax", "", "POST"],
        ["switchPreferential", "/crm/shopParamsIsActive.ajax", "", "POST"],
        ["getCrmTransSum", "/crm/crmTransDetailSummrizing.ajax", "", "POST"],
        ["getCrmCardSum", "/crm/crmCustomerCardCreateSummarize.ajax", "", "POST"],
        ["getCrmRechargeSum", "/crm/crmTransDetailSaveMoneyReconcile.ajax", "", "POST"],
        ["getCrmMemberDailyreport", "/report/customer/customerDayReport.ajax", "", "POST"],
        ["crmAccountChange", "/saas/crm/manualAdjustBalance.ajax", "", "POST"],
        ["crmSendGift", "/shop/crm/cardGiftCharge.ajax", "", "POST"],
        ["getFeedBack","/crm/customerFeedbackQuery.ajax", "", "POST"],
        ["AddFeedBackContent","/crm/customerFeedbackAddResponseContent.ajax", "", "POST"],
        ["updateFeedBackContent","/crm/customerFeedbackUpdate.ajax", "", "POST"],

        ["getAssessment", "/crm/queryShopAssessmentDetail.ajax", "", "POST"],
        ["AddAssessmentReturn", "/crm/addShopAssessmentReturn.ajax", "", "POST"],
        ["updateAssessmentReturn", "/crm/updateShopAssessmentReturn.ajax", "", "POST"],
        ["SetAssessmentTop", "/crm/updateSetTopAssessMent.ajax", "", "POST"],
        ["deleteAssessmentReturn", "/crm/deleteShopAssessmentReturn.ajax", "", "POST"],

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
        ["getWeChatPreauthCode","/wechat/createPreauthCode.ajax", "", "POST"],

        /*MCM Module*/
	["getMCMGifts", "/sysbase/sysEventGiftDetailList.ajax", "", "POST"],
	["deleteMCMGift", "/sysbase/deleteSysGift.ajax", "", "POST"],
	["createMCMGift", "/sysbase/insertSysEventGiftDetail.ajax", "", "POST"],
	["editMCMGift", "/sysbase/updateSysEventGiftDetail.ajax", "", "POST"],
        ["getMCMGiftShopUsed","/pay/queryPayUserGiftDetailShop.ajax", "", "POST"],
	["getMCMEvents", "/crm/queryCrmCustomerEvent.ajax", "", "POST"],
	["deleteMCMEvent", "/crm/deleteCrmEvent.ajax", "", "POST"],
	["switchMCMEvent", "/crm/switchCrmEvent.ajax", "", "POST"],
	["getMCMEventByID", "/crm/crmCustomerEventById.ajax", "", "POST"],
	["checkBirthdayEventExist", "/saas/isCheckBirthdayEvent.ajax", "", "POST"],
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
	["applyEventSendSMS", "/crm/crm_baomingEventSendSms.ajax", "", "POST"],
	["switchMCMTrackItem", "/crm/crmRegisterPartin.ajax", "", "POST"],
        /*sms event module*/
	["editSMSTemplate", "/crm/setSmsTemplate.ajax", "", "POST"],
	["getSMSShops", "shop/queryShopByRoleType.ajax", "", "POST"],

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
        ["deleteShopFood", "/saas/shop/delShopFood.ajax", "", "POST"],
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
        ["querySaasRemark", "/saas/base/orderNotesQuery.ajax ", "", "POST"],
        ["checckRemarkNameIsExist", "/saas/base/orderNotesNameIsExist.ajax", "", "POST"],

        /*version Update*/
        ["getVersionUpdate","/saas/querySysClientAppVersionInfo.ajax", "", "POST"]
        


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
        'resetMemberPassword', 'switchMember',
        'getShopTable', 'addShopTable', 'updateShopTable', 'deleteShopTable', 'switchShopTable', 'checkTableExist', 'getTableArea',
        'switchTableArea', 'checkAreaNameExist', 'deleteTableArea', 'updateTableArea', 'addTableArea', 'setAreaCategory',
        "shopTableSortTop", "shopTableSortUpOrDown", "shopTableSortBottom", "tableAreaSortTop", "tableAreaSortUpOrDown", "tableAreaSortBottom",
        'getSaasShopParams', 'getSaasDeviceParams', 'updateSaasShopParams', 'updateSaasDeviceParams',
		{
			name : "loadAppData", 
			onfail : function (data, cbFn, params) {
				cbFn();
			}
		},
                'addShopPrinter', 'deleteShopPrinter','updateShopPrinter','getShopPrinter','checkPrinterNameExist',
                'getShopPromotion','createShopPromotion','updateShopPromotion','deleteShopPromotion','getAllowRefPromotionShop','updatePromotShop',
                'promotionTimeCheck','queryGiftDetail','promotionRulesToString','cancelRefPromotionRules','switchShopPromotion',
                //'queryPrinterArea', 'checkprinterAreaName', 'updatePrinterArea', 'updatePrinterSet',
                //'deletePrinterSet',"addPrintSet","queryPrintDepartment",
                'queryPrinterArea','setAreaPrinter','setDepartmentPrinter',

                'addDiscount','deleteDiscount','editDiscount','queryDiscount','checkDiscountNameExist','switchDiscount',
                'queryShopTime','updateShopTime','getRefTimeShops','bindRefShopTime','cancleRefShopTime','switchShopTime','initShopTime',

		"queryAccount", "withdrawCash", "deleteAccount", "editAccount",
		"addAccount", "getAccountQueryShop", "queryAccountTransDetail","queryOrderInfoByKey",
		"queryAccountOrderPayDetail", "queryAccountFsmCustomerDetail","queryAccountDailyReport", "rechargeCreateOrder",
                "queryAccountOrder",
		"queryOrderDetail", "queryOrderDayDetail", "queryOrderDuringDetail",
		"queryOrderDishesHot", "queryUserOrderStatistic","OrderExport",

		"queryShopGroupChildAccount", "removeShopGroupChildAccount", 
		"unbindMobileInShopGroupChildAccount", "resetPWDInShopGroupChildAccount", 
		"updateShopGroupChildAccount", "addShopGroupChildAccount",
		"updateRoleBinding", "queryRoleBinding", "bindMobileInShopGroupChildAccount",
        "queryRoleRight", "queryAccountRight", "updateAccountRight",
		"queryCrmMemberSchema",

        "getCrmParams", "setCrmParams", "getCrmRechargeSets", "switchCrmRechargeSetState", "addCrmRechargeSet", "updateCrmRechargeSet", "getVipLevels",
        "queryCrm", "getCrmDetail", "updateCrmBasicInfo", "getCrmTransDetail",
        "getCrmUserEvents", "getCrmUserGifts", "getCrmCardLogs",
        "getCrmPreferential", "updateCrmPreferential", "getCrmShopPreferential", "updateCrmShopPreferential", "switchPreferential",
        "getCrmTransSum", "getCrmCardSum", "getCrmRechargeSum","getCrmMemberDailyreport", "crmAccountChange", "crmSendGift",
        "getFeedBack", "AddFeedBackContent","updateFeedBackContent",
        "getAssessment", "AddAssessmentReturn", "updateAssessmentReturn","SetAssessmentTop","deleteAssessmentReturn",

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
        
        "getUserEvents","getWeChatPreauthCode",

        "getMCMGifts", "deleteMCMGift", "createMCMGift", "editMCMGift","getMCMGiftShopUsed","getMCMEvents", "deleteMCMEvent", "switchMCMEvent",
		"getMCMEventByID", "checkBirthdayEventExist", "createEvent", "editEvent", "getMCMGiftDetail", "queryMCMGiftDetailGetWayInfo", "queryMCMGiftDetailUsedInfo",
		"queryUserBaseInfoByMobile", "sendSMS",
		"giftDetailDonateGift", "giftDetailPayGiftOnline", "getMCMEventTrack", "applyEventSendSMS", "switchMCMTrackItem",

        "editSMSTemplate", "getSMSShops",
        
        "getGroupInfo", "queryGroupStyle", "setBrandLogo", "getAgentInfo", "resetAgentSecret",
        "getFoodDescription", "setFoodDescription",
        "getSaasCategories", "queryCategories", "getSaasDepartments", "deleteSaasCategory", "updateSaasCategory", "createSaasCategory",
        "switchSaasCategory", "sortSaasCategoryTop", "sortSaasCategoryUpOrDown","sortSaasCategoryBottom", 'checkSaasCategoryNameExist',

        "querySaasGoods", "createSaasGood", 'queryGoodByID', 'checkFoodNameExist', 'deleteShopFood',

        "addSaasChannel","deleteSaasChannel", "updateSaasChannel", "getSaasChannel", "switchChannelState", "checkChannelName",
        
        "addSaasDepartment", "deleteSaasDepartment", "updateSaasDepartment","checkDepartmentlName", "querySaasDepartmentType", "querySaasDepartmentPrintType",

        "addSaasSubject", "deleteSaasSubject", "updateSaasSubject", "querySaasSubject", "queryTreeSubject", "checkSubjectlName", "switchSaasSubjectstate",

        "addSaasRemark", "deleteSaasRemark", "editSaasRemark", "querySaasRemark","checckRemarkNameIsExist",
	
        "getVersionUpdate",
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
    Hualala.Global.resetMemberPassword = function(params, cbFn) {
        Hualala.Global.commonCallServer('resetMemberPassword', params, cbFn);
    };
    Hualala.Global.switchMember = function(params, cbFn) {
        Hualala.Global.commonCallServer('switchMember', params, cbFn);
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
    Hualala.Global.shopTableSortTop = function(params, cbFn) {
        Hualala.Global.commonCallServer("shopTableSortTop", params, cbFn);
    };
    Hualala.Global.shopTableSortUpOrDown = function(params, cbFn) {
        Hualala.Global.commonCallServer("shopTableSortUpOrDown", params, cbFn);
    };
    Hualala.Global.shopTableSortBottom = function(params, cbFn) {
        Hualala.Global.commonCallServer("shopTableSortBottom", params, cbFn);
    };
    Hualala.Global.tableAreaSortTop = function(params, cbFn) {
        Hualala.Global.commonCallServer("tableAreaSortTop", params, cbFn);
    };
    Hualala.Global.tableAreaSortUpOrDown = function(params, cbFn) {
        Hualala.Global.commonCallServer("tableAreaSortUpOrDown", params, cbFn);
    };
    Hualala.Global.tableAreaSortBottom = function(params, cbFn) {
        Hualala.Global.commonCallServer("tableAreaSortBottom", params, cbFn);
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
    Hualala.Global.setAreaPrinter =function (params, cbFn){
        Hualala.Global.commonCallServer("setAreaPrinter", params,cbFn);
    };
    Hualala.Global.setDepartmentPrinter = function(params,cbFn){
        Hualala.Global.commonCallServer("setDepartmentPrinter", params,cbFn);
    };

    Hualala.Global.getSaasShopParams = function(params,cbFn){
        Hualala.Global.commonCallServer("getSaasShopParams", params,cbFn);
    };

    Hualala.Global.getSaasDeviceParams = function(params,cbFn){
        Hualala.Global.commonCallServer("getSaasDeviceParams", params,cbFn);
    };

    Hualala.Global.updateSaasShopParams = function(params,cbFn){
        Hualala.Global.commonCallServer("updateSaasShopParams", params,cbFn);
    };

    Hualala.Global.updateSaasDeviceParams = function(params,cbFn){
        Hualala.Global.commonCallServer("updateSaasDeviceParams", params,cbFn);
    };
/*    Hualala.Global.updatePrinterSet = function(params,cbFn){
        Hualala.Global.commonCallServer("updatePrinterSet",params,cbFn);
    };
    Hualala.Global.deletePrinterSet = function(params, cbFn){
        Hualala.Global.commonCallServer("deletePrinterSet", params,cbFn);
    };
    Hualala.Global.addPrintSet =function(params, cbFn){
        Hualala.Global.commonCallServer("addPrintSet", params, cbFn);
    };
    Hualala.Global.queryPrintDepartment =function(params, cbFn){
        Hualala.Global.commonCallServer("queryPrintDepartment",params,cbFn);
    };*/
    Hualala.Global.addDiscount =function(params, cbFn){
        Hualala.Global.commonCallServer("addDiscount",params,cbFn);
    };
    Hualala.Global.deleteDiscount =function(params, cbFn){
        Hualala.Global.commonCallServer("deleteDiscount",params,cbFn);
    };
    Hualala.Global.editDiscount =function(params, cbFn){
        Hualala.Global.commonCallServer("editDiscount",params,cbFn);
    };
    Hualala.Global.queryDiscount =function(params, cbFn){
        Hualala.Global.commonCallServer("queryDiscount",params,cbFn);
    };
    Hualala.Global.checkDiscountNameExist =function(params, cbFn){
        Hualala.Global.commonCallServer("checkDiscountNameExist",params,cbFn);
    };
    Hualala.Global.switchDiscount =function(params, cbFn){
        Hualala.Global.commonCallServer("switchDiscount",params,cbFn);
    };
    Hualala.Global.queryShopTime =function(params, cbFn){
        Hualala.Global.commonCallServer("queryShopTime", params, cbFn);
    };
    Hualala.Global.updateShopTime =function(params, cbFn){
        Hualala.Global.commonCallServer("updateShopTime", params, cbFn);
    };
    Hualala.Global.getRefTimeShops =function(params, cbFn){
        Hualala.Global.commonCallServer("getRefTimeShops", params, cbFn);
    };
    Hualala.Global.bindRefShopTime =function(params, cbFn){
        Hualala.Global.commonCallServer("bindRefShopTime", params, cbFn);
    };
    Hualala.Global.cancleRefShopTime =function(params, cbFn){
        Hualala.Global.commonCallServer("cancleRefShopTime", params, cbFn);
    };
    Hualala.Global.switchShopTime =function(params, cbFn){
        Hualala.Global.commonCallServer("switchShopTime", params, cbFn);
    };
    Hualala.Global.initShopTime = function(params, cbFn){
        Hualala.Global.commonCallServer("initShopTime", params, cbFn);
    };

    Hualala.Global.getShopPromotion = function (params, cbFn) {
        Hualala.Global.commonCallServer("getShopPromotion", params, cbFn);
    };
    Hualala.Global.updateShopPromotion =function (params, cbFn) {
        Hualala.Global.commonCallServer("updateShopPromotion", params,cbFn);
    };
    Hualala.Global.createShopPromotion = function (params, cbFn){
        Hualala.Global.commonCallServer("createShopPromotion", params ,cbFn);
    };
    Hualala.Global.deleteShopPromotion= function (params, cbFn) {
        Hualala.Global.commonCallServer("deleteShopPromotion", params, cbFn);
    };
    Hualala.Global.promotionTimeCheck = function (params,cbFn){
        Hualala.Global.commonCallServer("promotionTimeCheck",params,cbFn);
    };
    Hualala.Global.queryGiftDetail =function(params, cbFn){
        Hualala.Global.commonCallServer("queryGiftDetail",params,cbFn);
    };
    Hualala.Global.promotionRulesToString =function (params, cbFn) {
        Hualala.Global.commonCallServer("promotionRulesToString", params,cbFn);
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
    Hualala.Global.switchShopPromotion = function (params, cbFn){
        Hualala.Global.commonCallServer("switchShopPromotion", params, cbFn);
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
        Hualala.Global.queryOrderInfoByKey = function(params, cbFn){
                Hualala.Global.commonCallServer("queryOrderInfoByKey", params, cbFn);
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
        Hualala.Global.rechargeCreateOrder = function(params, cbFn) {
                Hualala.Global.commonCallServer("rechargeCreateOrder", params, cbFn);
        };
        Hualala.Global.queryAccountOrder = function (params, cbFn) {
                Hualala.Global.commonCallServer("queryAccountOrder", params, cbFn);
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
    Hualala.Global.queryRoleRight = function (params, cbFn) {
        Hualala.Global.commonCallServer("queryRoleRight", params, cbFn);
    };
    Hualala.Global.queryAccountRight = function (params, cbFn) {
        Hualala.Global.commonCallServer("queryAccountRight", params, cbFn);
    };
    Hualala.Global.updateAccountRight = function (params, cbFn) {
        Hualala.Global.commonCallServer("updateAccountRight", params, cbFn);
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

    Hualala.Global.updateCrmBasicInfo =  function(params, cbFn) {
        Hualala.Global.commonCallServer("updateCrmBasicInfo", params, cbFn);
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

    Hualala.Global.getCrmShopPreferential = function(params, cbFn) {
        Hualala.Global.commonCallServer("getCrmShopPreferential", params, cbFn);
    };
	
	Hualala.Global.updateCrmPreferential = function (params, cbFn) {
		Hualala.Global.commonCallServer("updateCrmPreferential", params, cbFn);
	};

    Hualala.Global.updateCrmShopPreferential = function (params, cbFn) {
        Hualala.Global.commonCallServer("updateCrmShopPreferential", params, cbFn);
    };

    Hualala.Global.switchPreferential = function(params, cbFn) {
        Hualala.Global.commonCallServer('switchPreferential', params, cbFn);
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

    Hualala.Global.crmAccountChange = function(params, cbFn) {
        Hualala.Global.commonCallServer('crmAccountChange', params, cbFn);
    };

    Hualala.Global.crmSendGift = function(params, cbFn) {
        Hualala.Global.commonCallServer('crmSendGift', params, cbFn);
    };
    Hualala.Global.getFeedBack = function(params, cbFn){
        Hualala.Global.commonCallServer("getFeedBack",params, cbFn);
    };
    Hualala.Global.AddFeedBackContent = function(params, cbFn){
        Hualala.Global.commonCallServer("AddFeedBackContent", params, cbFn);
    };
    Hualala.Global.updateFeedBackContent = function (params, cbFn){
        Hualala.Global.commonCallServer("updateFeedBackContent", params,cbFn);
    };
    Hualala.Global.getAssessment = function (params, cbFn){
        Hualala.Global.commonCallServer("getAssessment", params, cbFn);
    };
    Hualala.Global.AddAssessmentReturn = function(params, cbFn){
        Hualala.Global.commonCallServer("AddAssessmentReturn", params, cbFn);
    };
    Hualala.Global.updateAssessmentReturn = function(params, cbFn){
        Hualala.Global.commonCallServer("updateAssessmentReturn", params, cbFn);
    };
    Hualala.Global.SetAssessmentTop = function(params, cbFn){
        Hualala.Global.commonCallServer("SetAssessmentTop", params, cbFn);
    };
    Hualala.Global.deleteAssessmentReturn = function(params, cbFn){
        Hualala.Global.commonCallServer("deleteAssessmentReturn", params, cbFn);
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
        Hualala.Global.getWeChatPreauthCode = function(params,cbFn){
                Hualala.Global.commonCallServer("getWeChatPreauthCode", params, cbFn);
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
        Hualala.Global.getMCMGiftShopUsed = function(params, cbFn){
                Hualala.Global.commonCallServer("getMCMGiftShopUsed",params, cbFn);
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
    Hualala.Global.checkBirthdayEventExist = function (params, cbFn) {
        Hualala.Global.commonCallServer("checkBirthdayEventExist", params, cbFn);
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

    Hualala.Global.applyEventSendSMS = function (params, cbFn) {
        Hualala.Global.commonCallServer("applyEventSendSMS", params, cbFn);
    };

    Hualala.Global.switchMCMTrackItem = function (params, cbFn) {
        Hualala.Global.commonCallServer("switchMCMTrackItem", params, cbFn);
    };

    Hualala.Global.editSMSTemplate = function(params, cbFn) {
        Hualala.Global.commonCallServer('editSMSTemplate', params, cbFn);
    };

    Hualala.Global.getSMSShops = function(params, cbFn) {
        Hualala.Global.commonCallServer('getSMSShops', params, cbFn);
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

    Hualala.Global.deleteShopFood = function(params, cbFn) {
        Hualala.Global.commonCallServer('deleteShopFood', params, cbFn);
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
    Hualala.Global.checckRemarkNameIsExist =function(params ,cbFn){
        Hualala.Global.commonCallServer("checckRemarkNameIsExist",params,cbFn);
    },
    Hualala.Global.querySaasRemark = function(params, cbFn) {
    	Hualala.Global.commonCallServer("querySaasRemark", params, cbFn);
    },
    Hualala.Global.getVersionUpdate =function(params,cbFn){
        Hualala.Global.commonCallServer("getVersionUpdate",params,cbFn);
    }

})();












