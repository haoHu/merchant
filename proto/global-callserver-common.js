(function () {
	IX.ns("Hualala.Global");
	/**
	 * 加载站点Session Data
	 * @param  {Object} params 请求参数{Empty}
	 * @param  {Function} cbFn   Response数据回调
	 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {site, user, roles}}
	 *           @param {String} resultcode Response结果码
	 *           @param {String} resultmsg Response结果描述
	 *           @param {Object|Array} data Response结果数据
	 *           @param {Object} data.site 商户基本信息($$Group)
	 *           @param {Object} data.user 登陆用户信息($$User)
	 *           @param {Array} data.roles 角色信息($$Roles)
	 * @return {NULL}        
	 */
	Hualala.Global.loadAppData = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		setTimeout(function () {
			fn({
				resultcode : '000',
				// resultcode : '111',
				resultmsg : '',
				data : {
					pcClient : Test.PCClient,
					site : Test.SiteData,
					user : Test.LoginUser,
					userRight : Test.UserRight,
					roles : Test.Roles
                    }
			});
		}, 200);
	};

	/**
	 * 获取手机动态密码
	 * @param  {Object} params {groupName, userMobile}
	 * @param  {Function} cbFn   回调参数
	 *           {
	 *           	resultcode, resultmsg
	 *           }
	 * @return {NULL}        
	 */
	Hualala.Global.getMobileDynamicPWD = function (params, cbFn) {
		IX.Debug.info("DEBUG: Get Dynamic Password Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : '短信发送成功'};
		setTimeout(function () {
			fn(res);
		}, 1000);	
	};

	/**
	 * 动态密码登录请求
	 * @param  {Object} params  {groupName, userMobile, dynamicPwd}
	 * @param  {Function} cbFn   Response数据回调
	 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {}}
	 *           @param {String} resultcode Response结果码
	 *           @param {String} resultmsg Response结果描述
	 * @return {NULL}        
	 */
	Hualala.Global.dynamicLoginCallServer = function (params, cbFn) {
		IX.Debug.info("DEBUG: Dynamic Password Login Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		if (random < 5) {
			fn(IX.inherit(res, {
				resultcode : random * 1000,
				resultmsg : '登录失败！'
			}));
		} else {
			fn(res);
		}
	};

	/**
	 * 获取动态验证码
	 * @param  {Object} params {}
	 * @param  {Function} cbFn   Response数据回调
	 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {code}}
	 *           @param {String} resultcode Response结果码
	 *           @param {String} resultmsg Response结果描述
	 *           @param {Object} data Response结果数据
	 *           @param {String} data.code 验证码图片地址
	 * @return {NULL}        
	 */
	Hualala.Global.genAuthCode = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({
			resultcode : '000',
			resultmsg : '',
			data : {
				code : 'http://mu.shop.hualala.com/randomImage.jsp?Rand=' + (Math.random() * 10000)
			}
		});
	};

	/**
	 * 登录请求
	 * @param  {Object} params 登录表单数据
	 * @param  {Function} cbFn   Response数据回调
	 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {}}
	 *           @param {String} resultcode Response结果码
	 *           @param {String} resultmsg Response结果描述
	 * @return {NULL}        
	 */
	Hualala.Global.loginCallServer = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		if (random < 5) {
			fn(IX.inherit(res, {
				resultcode : random * 1000,
				resultmsg : '登录失败！'
			}));
		} else {
			fn(res);
		}
	};

	/**
	 * 获取店铺搜索过滤的概要数据
	 * @param  {Object} params 请求参数
	 * @param  {Function} cbFn Response数据回调
	 *            @param {Object} response cbFn回调参数 {resultcode, resultmsg, data}
	 *            @param {String} resultcode Response结果码
	 *            @param {String} resultmsg Response结果描述
	 *            @param {Object} data Response数据
	 *            @param {Array} data.cities 城市概要数据
	 *            @param {Array} data.areas 区域概要数据
	 *            @param {Array} data.shops 店铺概要数据
	 * @return {NULL}        
	 */
	Hualala.Global.getShopQuerySchema = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		var testData = Test.querySchema;
		// if (random < 5) {
		// 	fn(IX.inherit(res, {
		// 		resultcode : random * 1000,
		// 		resultmsg : '系统错误'
		// 	}));
		// } else {
		// 	fn(IX.inherit(res, {
		// 		data : testData
		// 	}));
		// }
		fn(IX.inherit(res, {
			data : testData
		}));
	};

	/**
	 * 搜索店铺
	 * @param  {Object} params 搜索参数{cityID, areaID, keywordLst, Page : {pageSize, pageNo}}
	 * @param  {Function} cbFn   response cbFn回调参数{resultcode, resultmsg, data : {pageCount, pageNo, pageSize, records : $$ShopList, totalSize}}
	 *             @param {Int} data.pageCount 页码总数
	 *             @param {Int} data.pageNo 当前页码
	 *             @param {Int} data.pageSize 每页结果数量
	 *             @param {Int} totalSize 结果总数
	 *             @param {Array} records 结果数据
	 * @return {NULL}        
	 */
	Hualala.Global.queryShop = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		var results = Test.queryResult(params);
		fn(IX.inherit(res, {
			data : results
		}));
	};

	/**
	 * 切换店铺状态
	 * @param  {Object} params 参数{shopID, status}
	 * @param  {Function} cbFn   回调参数{resultcode, resultmsg}
	 * @return {NULL}    
     * 服务调用 URL: /shop/status.ajax
	 */
	Hualala.Global.switchShopStatus = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random*100 : '000',
			resultmsg : "状态切换失败"
		}));
	};

	/**
	 * 切换店铺业务状态
	 * @param  {Object} params 参数{shopID, operation, serviceFeature}
	 * @param  {Function} cbFn   回调函数
	 * @return {NULL}        
	 */
	Hualala.Global.switchShopServiceFeatureStatus = function (params, cbFn) {
	 	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random * 100 : '000',
			resultmsg : "状态切换失败"
		}));	
	};
	/**
	 * 获取桌台码
	 * @param  {Object} params {shopID, size}
	 * @param  {Function} cbFn   回调参数
	 *           {
	 *           	resultcode, resultmsg
	 *           }
	 * @return {NULL}        
	 */
	Hualala.Global.getQRcode = function (params, cbFn) {
		IX.Debug.info("DEBUG: Get QRcode Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : '获取成功'};
	};
	/**
	 * 常规订座点菜业务配置参数
	 * @param {Object} params 参数{shopID, orderType, strType, advanceTime, noticeTime, reserveTableTime,reserveTableDesc,minAmount,payMethod}
	 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	 */
	Hualala.Global.setCommonReserveParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random * 100 : '000',
			resultmsg : "参数配置失败"
		}));
	};

	/**
	 * 设置闪吃业务配置参数
	 * @param {Object} params 参数 {shopID, orderType, strType, advanceTime,noticeTime,minAmount,serviceAmount,freeServiceAmount,holidayFlag,openDays,servicePeriods,reserveTableTime,reserveTableDesc,submitSMSTemplateID,checkSMSTemplateID,payMethod,supportInvoice}
	 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.setJustEatParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random * 100 : '000',
			resultmsg : "参数配置失败"
		}));
	};
	/**
	  * 设置店内自助业务配置参数
	  * @param {Object} params 参数{needInputTableName,supportInvoice,supportCommitToSoftware,payBeforeCommit,fetchFoodMode}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
	  */
	Hualala.Global.setSpotOrderParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random * 100 : '000',
			resultmsg : "参数配置失败"
		}));
	};

	/**
	 * 设置外送业务配置参数
	 * @param {Object} params {servicePeriods,holidayFlag,noticeTime,takeawayDeliveryTime,minAmount,serviceAmount,freeServiceAmount,takeawayScope,payMethod}
	 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.setTakeAwayParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random * 100 : '000',
			resultmsg : "参数配置失败"
		}));
	};

	/**
	 * 设置自提业务配置参数
	 * @param {Object} params {servicePeriods,holidayFlag,advanceTime,noticeTime,minAmount,payMethod}
	 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.setTakeOutParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			// resultcode : random > 5 ? random * 100 : '000',
			resultmsg : "参数配置失败"
		}));
	};

	/**
	 * 为店铺绑定结算账户
	 * @param  {Object} params 参数{settleID,shopID}
	 * @param  {Function} cbFn   回调{resultcode, resultmsg}
	 * @return {NULL}       
	 */
	Hualala.Global.bindSettleUnitByShopID = function (params, cbFn) {
		IX.Debug.info("DEBUG: Bind Settle Unit By ShopID Form Elements :");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 获取结算账户信息
	 * @param  {Object} params 参数{transCreateBeginTime,transCreateEndTime,settleUnitID,transStatus,transType,groupID,minTransAmount,maxTransAmount}
	 * @param  {Function} cbFn   回调函数{resultcode, resultmsg, data}
	 *               data : {pageCount, pageNo, pageSize, totalSize, records: $$AccountList}
	 * @return {NULL}
	 */
	Hualala.Global.queryAccount = function (params, cbFn) {
		var settleUnitID = $XP(params, 'settleUnitID', null);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var accountList = Test.AccountList;
		var match = null;
		if (!IX.isEmpty(settleUnitID)) {
			match = _.filter(accountList, function (el) {
				return $XP(el, 'settleUnitID') == settleUnitID;
			});
			match = match.length == 0 ? IX.inherit(accountList[0], {settleUnitID : settleUnitID}) : match;
		} else {
			match = accountList;
		}
		fn(IX.inherit(res, {
			data : {
				page : {
					pageCount : 1,
					pageNo : 1,
					pageSize : accountList.length,
					totalSize : accountList.length
				},
				records : match
			}
		}));
	};

	/**
	 * 提现操作
	 * @param  {Object} params 参数{settleUnitID,transAmount,poundageAmount,poundageMinAmount}
	 * @param  {Function} cbFn   回调函数{resultcode, resultmsg, data}
	 * @return {NULL}
	 */
	Hualala.Global.withdrawCash = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 删除结算账户
	 * @param  {Object} params 参数{settleUnitID,groupID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.deleteAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 修改结算账户
	 * @param  {Object} params 参数{settleUnitID, groupID, receiverType,receiverName,settleUnitName,bankAccount,bankCode,bankName,remark,defaultAccount,receiverLinkman,receiverMobile,receiverEmail}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.editAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 添加结算账户
	 * @param  {Object} params 参数{groupID, receiverType,receiverName,settleUnitName,bankAccount,bankCode,bankName,remark,defaultAccount,receiverLinkman,receiverMobile,receiverEmail}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.addAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 获取结算账户关联店铺
	 * @param  {Object} params {settleUnitID, settleName, shopCount}
	 * @param  {Function} cbFn response cbFn回调参数{resultcode, resultmsg, data : {pageCount, pageNo, pageSize, records : $$ShopList, totalSize}}
	 * 				@param {Object} response cbFn回调参数 {resultcode, resultmsg, data}
	 *            	@param {String} resultcode Response结果码
	 *            	@param {String} resultmsg Response结果描述
	 *            	@param {Object} data Response数据
	 *            	@param {Array} data.cities 城市概要数据
	 *            	@param {Array} data.areas 区域概要数据
	 *            	@param {Array} data.shops 店铺概要数据
	 * @return {NULL}
	 */
	Hualala.Global.getAccountQueryShop = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var random = Test.getRandom(1, 10);
		var res = {resultcode : '000', resultmsg : ''};
		var testData = Test.querySchema;
		
		fn(IX.inherit(res, {
			data : testData
		}));
	};

	/**
	 * 结算账户交易明细查询
	 * @param  {Object} params {transCreateBeginTime, transCreateEndTime, settleUnitID, 
	 * 			transStatus, transType, groupID, minTransAmount, maxTransAmount}
	 * @param  {Function} cbFn
	 * @return {NULL}
	 */
	Hualala.Global.queryAccountTransDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var accountTransList = Test.queryAccountTransDetail(params);
		fn(IX.inherit(res, {
			data : accountTransList
		}));
	};

	/**
	 * 查询结算交易明细
	 * @param  {[type]} params
	 * @param  {[type]} cbFn
	 * @return {[type]}
	 */
	Hualala.Global.queryAccountOrderPayDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var data = Test.queryOrderPayDetail;
		// fn(IX.inherit(res, {
		// 	data : data
		// }));
		fn(IX.inherit(res, data));
	};
	/**
	 * 结算账户交易明细(含套餐)
	 * @param  {Object} params {orderKey, hisData}
	 * @param  {Function} cbFn
	 * @return {NULL}
	 */
	Hualala.Global.queryOrderInfoByKey = function(params, cbFn){
       	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.PackageDetail;
        fn(rsp);
    };

	/**
	 * 查询结算会员充值明细
	 * @param  {[type]} params
	 * @param  {[type]} cbFn
	 * @return {[type]}
	 */
	Hualala.Global.queryAccountFsmCustomerDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var data = Test.queryFsnCustomerDetail;
		fn(IX.inherit(res, {
			data : data
		}));
	};
	/**
	 *查询结算日报表
	 * /report/settle/settleDayReport.ajax
	 */
	Hualala.Global.queryAccountDailyReport = function (params, cbFn) {
		IX.Debug.info("DEBUG: Query settleDayReport  Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, Test.AccountDailyReportData));
	};

     /**
	  * 获取已启用城市
	  * @param {Object} params 参数{isActive: 1}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [
        {cityID , cityName}, ...]}}
	  * @return {NULL} 
      * 服务调用URL: /shop/queryCity.ajax
	  */
	Hualala.Global.getCities = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {
                    records: [
                        {cityID: '1010', cityName: '北京'}, 
                        {cityID: '1021', cityName: '上海'}
                    ]
                }
            };
		fn(rsp);
	};
     /**
	  * 获取给定城市地标信息
	  * @param {Object} params 参数{cityID: 1010}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [
        {areaID , areaName}, ...]}}
	  * @return {NULL} 
      * 服务调用 URL: /shop/queryArea.ajax
	  */
	Hualala.Global.getAreas = function (params, cbFn) {
		var cityID = params.cityID,
            fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            records1 = [
                {areaID: '1010030000', areaName: '--国贸'}, 
                {areaID: '1010030300', areaName: '--西直门'}
            ],
            records2 = [
                {areaID: '1021030000', areaName: '--同济'}, 
                {areaID: '1021030300', areaName: '--复旦'}
            ],
            rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: { records: cityID == '1010' ? records1: records2 }
            };
		fn(rsp);
	};
     /**
	  * 获取给定城市菜系信息
	  * @param {Object} params 参数{cityID: 1010}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [
        {cuisineID , cuisineName}, ...]}}
	  * @return {NULL} 
      * 服务调用 URL: /shop/queryCuisine.ajax
	  */
	Hualala.Global.getCuisines = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {
                    records: [
                        {cuisineID: '10100300', cuisineName: '北京菜'}, 
                        {cuisineID: '10100303', cuisineName: '---家常菜'}
                    ]
                }
            };
		fn(rsp);
	};
    
     /**
	  * 提交创建店铺基本信息
	  * @param {Object} params 参数{imagePath, shopName, operationMode, cityID, openingHoursStart, openingHoursEnd, PCCL, tel, address, areaID, areaName, cuisineID1, cuisineID2, cuisineName1, cuisineName2, keywordLst, openingHours}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [
        {shopID , shopName, ...}]}}
	  * @return {NULL} 
      * 服务调用 URL: /shop/create.ajax
	  */
	Hualala.Global.createShop = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {
                    records: [{
                        shopID: '83830',
                        shopName: params.shopName,
                        groupID: '5',
                        groupName: '豆捞坊'
                    }]
                }
            };
		fn(rsp);
	};
    
    /**
	  * 修改店铺基本信息
	  * @param {Object} params 参数{shopID, imagePath, shopName, operationMode, cityID, openingHoursStart, openingHoursEnd, PCCL, tel, address, areaID, areaName, cuisineID1, cuisineID2, cuisineName1, cuisineName2, keywordLst, openingHours}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /shop/updateShopBaseInfo.ajax
	  */
	Hualala.Global.updateShopBaseInfo = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {resultcode: '000', resultmsg: ''};
		fn(rsp);
	};
    
     /**
	  * 标注店铺地图信息
	  * @param {Object} params 参数{shopID, mapLongitudeValue, mapLatitudeValue, mapLongitudeValueBaiDu, mapLatitudeValueBaiDu}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /shop/updateMap.ajax
	  */
	Hualala.Global.setShopMap = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {resultcode: '000', resultmsg: ''};
		fn(rsp);
	};
    
    /**
	  * 修改PC客户端密码
	  * @param {Object} params 参数{shopID, hLLAgentLoginPWD}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /shop/resetPWDforClient.ajax
	  */
	Hualala.Global.setShopClientPwd = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {resultcode: '000', resultmsg: ''};
		fn(rsp);
	};
    
    /**
	  * 获取店铺详情信息
      * @param {Object} params 参数{shopID: 83830}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [
        {imagePath, shopName, operationMode, cityID, PCCL, tel, address, areaID, areaName, cuisineID1, cuisineID2, cuisineName1, cuisineName2, keywordLst, openingHours}]}}
	  * @return {NULL} 
      * 服务调用 URL: shop/queryShopInfo.ajax
	  */
	Hualala.Global.getShopInfo = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {
                    records: [{
                        PCCL: "80",
                        address: "西城区 西单北大街131号大悦城7F-02",
                        areaID: "1010030300",
                        areaName: "西直门",
                        cityID: "1010",
                        cityName: "北京",
                        cuisineID1: "10100300",
                        cuisineID2: "10100303",
                        cuisineName1: "北京菜",
                        cuisineName2: "家常菜",
                        imagePath: "group1/M00/00/F7/wKgCIVPu-kWbqysWAAEvq1pYSJc436.jpg",
                        mapLatitudeValueBaiDu: "39.917527",
                        mapLongitudeValueBaiDu: "116.378948",
                        openingHours: "08:30-21:30",
                        operationMode: "0",
                        shopID: "83830",
                        shopName: "豆捞坊(西单店)2",
                        status: "1",
                        tel: "010-59716881"
                    }]
                }
            };
		fn(rsp);
	};
    
    /**
	  * 获取某个店铺的菜品数据
	  * @param {Object} params 参数{shopID, foodCategoryID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, page, records}
	  * @return {NULL} 
      * 服务调用URL: /shop/queryShopFoodMenu.ajax
	  */
	Hualala.Global.getShopMenu = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.foodsData;
		fn(rsp);
	};

    /**
	  * 修改菜品
	  * @param {Object} params 参数{shopID, foodID, isNew, isRecommend, isSpecialty, isActive, isDiscount, takeawayTag, hotTag, minOrderCount, tasteList, imagePath, imageHWP}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用URL: /shop/updateFoodNetAttribute.ajax
	  */
	Hualala.Global.updateFood = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn(Test.goodResult);
	};

    /**
     * 未打通saas的修改菜品的服务
     * @param {Object} params 参数{shopID, foodID, isNew, isRecommend, isSpecialty, isActive, isDiscount, takeawayTag, hotTag, minOrderCount, tasteList, imagePath, imageHWP}
     * @param {Function} cbFn   回调函数{resultcode, resultmsg}
     * @return {NULL}
     * 服务调用URL: /shop/updateFoodDetail.ajax
     */
    Hualala.Global.updateFoodBasic = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn(Test.goodResult);
    };

    /*
    * 设置套餐信息
    * @params {object} {setFoodDetail}
    * @params {function} cbFn 回调函数 {resultcode, resultmsg}
    * @return {NULL}
    * 服务调用：/shop/setFoodDetailList.ajax
    * */


    Hualala.Global.updateSetFoodDetail = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({ resultcode: '000', resultmsg: '' });
    };

    /*
    * 商品排序，移到顶部
    * @params {object} {shopID, foodID, foodCategoryID, sortIndex}
    * @params {function} cbFn 回调参数 response
    * @return {NULL}
    * 服务：/shop/topFoodSort.ajax
    * */
    Hualala.Global.sortFoodTop = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({ resultcode: '000', resultmsg: '' });
    };

    /*
     * 商品排序，移到底部
     * @params {object} {shopID, foodID, foodCategoryID, sortIndex}
     * @params {function} cbFn 回调参数 response
     * @return {NULL}
     * 服务：/shop/topFoodSort.ajax
     * */
    Hualala.Global.sortFoodBottom = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({ resultcode: '000', resultmsg: '' });
    };

    /*
     * 商品排序，向上或向下移动
     * @params {object} {shopID, foodID, foodCategoryID,sortIndex, foodID2, sortIndex2}
     * @params {function} cbFn 回调参数 response
     * @return {NULL}
     * 服务：/shop/topFoodSort.ajax
     * */
    Hualala.Global.sortFoodPrevOrNext = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({ resultcode: '000', resultmsg: '' });
    };


    /*
    * 判断店铺是否打通收银软件
    * @params {object} {shopID}
    * @param {function} cbFn
    * @return {NULL}
    * 服务：/saas/shop/canBeSaas.ajax
    * */
    Hualala.Global.checkSaasOpen = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({resultcode: '000', resultmsg: '', data: { can: '1' , CSP_softName: '饮食通软件'} });
    };

 	// 订单报表模块
	/**
	 * 订单查询
	 * @param  {Object} params 		{Page : {pageNo, pageSize}, startDate,endDate,shopID,cityID,orderStatus,orderID,userMobile,s_orderTotal,e_orderTotal}
	 * @param  {Function} cbFn 		回调参数
	 * 			{
	 * 				resultcode, resultmsg, 
	 * 				data : {
	 * 					page : {pageCount,pageNo,pageSize,totalSize}
	 * 					properties : {count, foodAmount, giftAmountTotal, orderRefundAmount, orderRegAmount, orderTotal, orederAmount, shouldSettlementTotal, total},
	 * 					records : [
	 * 						{cardDiscountAmount,cityID,discountAmount,foodAmount,freeAmount,giftAmount,isAlreadyPaid,moneyBalance,pointBalance,serviceAmount,shopName,shouldSettlementTotal,takeoutPackagingAmount,total,userMobile,userName,userSex,orderKey,orderPrnStr,orderRefundAmount,orderStatus,orderSubtype,orderTime,orderTotal,orederAmount,}
	 * 					]
	 * 				},
	 * 				
	 * 				
	 * 			}
	 * @return {NULL}
	 */
	Hualala.Global.queryOrderDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var orders = Test.queryOrders(params);
		fn(IX.inherit(res, {
			data : orders
		}));
	};

	/**
	 * 查询订单日汇总
	 * @param  {Object} params 		{Page:{pageNo, pageSize}, startDate,endDate,shopID,cityID,orderStatus}
	 * @param  {Function} cbFn		回调参数 	
	 * 			{
	 * 				resultcode, resultmsg,
	 * 				data : {
	 * 					page : {pageCount,pageNo,pageSize,totalSize},
	 * 					properties : {count, foodAmount,giftAmountTotal,orderRefundAmount,orderRegAmount,orderTotal,orderWaitTotal,orederAmount,total},
	 * 					records : [
	 * 						{billDate,cityID,count,foodAmount,giftAmountTotal,orderRefundAmount,orderRegAmount,orderTotal,orderWaitTotal,orderAmount,shopName,total}
	 * 					]
	 * 				}
	 * 			}
	 * @return {NULL}
	 */
	Hualala.Global.queryOrderDayDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var orders = Test.queryDayOrders(params);
		fn(IX.inherit(res, {
			data : orders
		}));
	};

	/**
	 * 查询订单区间汇总
	 * @param  {Object} params 		{Page:{pageNo, pageSize}, startDate,endDate,shopID,cityID,orderStatus}
	 * @param  {Function} cbFn 		回调参数 	
	 * 			{
	 * 				resultcode, resultmsg,
	 * 				data : {
	 * 					page : {pageCount,pageNo,pageSize,totalSize},
	 * 					properties : {count, foodAmount,giftAmountTotal,orderRefundAmount,orderRegAmount,orderTotal,orderWaitTotal,orederAmount,total},
	 * 					records : [
	 * 						{cityID,count,foodAmount,giftAmountTotal,groupID,orderRefundAmount,orderTotal,orderWaitTotal,orederAmount,shopID,shopName,total}
	 * 					]
	 * 				}
	 * 			}
	 * @return {NULL}
	 */
	Hualala.Global.queryOrderDuringDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var orders = Test.queryDuringOrders(params);
		fn(IX.inherit(res, {
			data : orders
		}));
	};

	/**
	 * 查询订单菜品排行榜
	 * @param  {Object} params 		{Page:{pageNo, pageSize}, startDate,endDate,shopID,cityID,foodCategoryName}
	 * @param  {Function} cbFn 		回调参数
	 * 			{
	 * 				resultcode, resultmsg,
	 * 				data : {
	 * 					page : {pageCount, pageNo, pageSize, totalSize},
	 * 					records : [
	 * 						{foodCategoryName, foodName, foodUnit, sumFoodAmount, sumMaster, sumPrice}
	 * 					]
	 * 				}
	 * 			}
	 * @return {NULL}
	 */
	Hualala.Global.queryOrderDishesHot = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var dishes = Test.queryDishesHot(params);
		fn(IX.inherit(res, {
			data : dishes
		}));
	};

	/**
	 * 顾客统计
	 * @param  {Object} params 		{Page:{pageNo, pageSize}, startDate,endDate,shopID,cityID,userName,userLoginMobile}
	 * @param  {Function} cbFn 		回调参数
	 * 			{
	 * 				resultcode, resultmsg,
	 * 				data : {
	 * 					page : {pageCount, pageNo, pageSize, totalSize},
	 * 					records : [
	 * 						{foodAmount, maxOrderTime, minOrderTime, sumRecord, userID, userLoginMobile, userName, userSex}
	 * 					]
	 * 				}
	 * 			}
	 * @return {NULL}
	 */
	Hualala.Global.queryUserOrderStatistic = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var users = Test.queryOrderUsers(params);
		fn(IX.inherit(res, {
			data : users
		}));
	};

	/**
	 * 商户中心账号管理查询
	 * @param  {Object} params {accountID}
	 * @param  {Function} cbFn   回调参数
	 *          {
	 *          	resultcode, resultmsg,
	 *          	data : {
	 *          		page : {pageCount, pageNo, pageSize, totalSize},
	 *          		records : [
	 *          			{accountID, accountStatus, action, actionTime, createTime,
	 *          			groupID, lastLoginTime, loginCount, groupLoginName, loginName,
	 *          			userEmail, userMobile, userName, userRemark, py},...
	 *          		]
	 *          	}
	 *          }
	 * @return {NULL}       
	 */
	Hualala.Global.queryShopGroupChildAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		var users = Test.UserList;
		fn(IX.inherit(res, {
			data : {
				page : {
					pageCount : 1,
					pageNo : 1,
					pageSize : users.length,
					totalSize : users.length
				},
				records : users
			}
		}));
	};

	/**
	 * 删除商户中心集团子账号
	 * @param  {Object} params {accountID}
	 * @param  {Function} cbFn   回调参数
	 *          {
	 *          	resultcode, resultmsg,
	 *          }
	 * @return {NULL}
	 */
	Hualala.Global.removeShopGroupChildAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 解除绑定商户中心集团子账号绑定的手机
	 * @param  {Object} params {accountID, userMobile}
	 * @param  {Function} cbFn   回调参数
	 *           {
	 *           	resultcode, resultmsg
	 *           }
	 * @return {NULL}
	 */
	Hualala.Global.unbindMobileInShopGroupChildAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

	/**
	 * 为商户中心子账号绑定手机号
	 * @param  {Object} params {accountID, userMobile, authCode}
	 * @param  {Function} cbFn   回调参数
	 *           {
	 *           	resultcode, resultmsg
	 *           }
	 * @return {NULL}
	 */
	Hualala.Global.bindMobileInShopGroupChildAccount = function (params, cbFn) {
		IX.Debug.info("DEBUG: Bind Mobile Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		setTimeout(function () {
			fn(res);
		}, 1000);	
	};

	/**
	 * 重置商户中心集团子账号的密码
	 * @param  {Object} params {accountID, loginPWD}
	 * @param  {Function} cbFn   回调参数
	 *          {
	 *          	resultcode, resultmsg
	 *          }
	 * @return {NULL}
	 */
	Hualala.Global.resetPWDInShopGroupChildAccount = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		setTimeout(function () {
			fn(res);
		}, 1000);
		
	};

	/**
	 * 更新商户中心集团子账号的基本信息
	 * @param  {Object} params {accountID, userName, userRemark, userEmail, accountStatus}
	 * @param  {Function} cbFn   回调参数
	 *          {
	 *          	resultcode, resultmsg
	 *          }
	 * @return {NULL}
	 */
	Hualala.Global.updateShopGroupChildAccount = function (params, cbFn) {
		IX.Debug.info("DEBUG: Update User Base Info Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		setTimeout(function () {
			fn(res);
		}, 1000);	
	};

	/**
	 * 创建商户中心集团自账号的基本信息
	 * @param {[type]} params [description]
	 * @param {[type]} cbFn   [description]
	 */
	Hualala.Global.addShopGroupChildAccount = function (params, cbFn) {
		IX.Debug.info("DEBUG: Add User Base Info Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		setTimeout(function () {
			fn(IX.inherit(res, {
				data : {
					records : [IX.inherit(params, {accountID : IX.id()})]
				}
			}));
		}, 1000);
	}

	/**
	 * 设置账号角色绑定配置
	 * @param  {Object} params {accountID,roles}
	 *         {
	 *         		accountID : "账号ID",
	 *         		roles : [
	 *         			{
	 *         				type : "[RoleType]", items : ["[shopID|settleUnitID]",.....]
	 *         			},
	 *         			...
	 *         		]
	 *         }
	 * @param  {Function} cbFn   回调参数
	 *          {
	 *          	resultcode, resultmsg
	 *          }
	 * @return {NULL}
	 */
	Hualala.Global.updateRoleBinding = function (params, cbFn) {
		IX.Debug.info("DEBUG: User Role Binding Form Elements :");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		setTimeout(function () {
			fn(res);
		}, 1000);	
	};

	/**
	 * 查询账号绑定角色配置
	 * @param  {Object} params {accountID}
	 * @param  {Function} cbFn   回调参数
	 *          {
	 *          	resultcode, resultmsg,
	 *          	data : {
	 *          		roles : $$RoleBinding
	 *          	}
	 *          }
	 * @return {NULL}
	 */
	Hualala.Global.queryRoleBinding = function (params, cbFn) {
		IX.Debug.info("DEBUG: Query User Role Binding Info Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, {
			data : {
				roles : Test.getUserRolesBinding($XP(params, 'accountID'))
			}
		}));
	};

    /*
    * 查询账号对应的权限
    * @params  {object} params {roleTypes}、
    * @params {function} params {cbFn}
    * return {NULL}
    *  服务 “/shop/queryShopPageRights.ajax”
    * */
    Hualala.Global.queryRoleRight = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            roleRights = Test.roleRights;
        fn(roleRights);
    };

    /*
    * 查询账号设置的权限
    * @params {object} params {accountID, roleTypes}
    * @params {function} cbFn
     * @return {NULL}
     * 服务：“/shop/queryShopGroupChildAccountPageRight.ajax”
    * */
    Hualala.Global.queryAccountRight = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            accountRights = Test.accountRights;
        fn(accountRights)
    };

    /*
    * @param params {object} {accountID, pageRight, disabled}
    * @params cbFn {function}
    * @return null
    * 服务：/shop/updateShopGroupChildAccountPageRight.ajax
    * */
    Hualala.Global.updateAccountRight = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({resultmsg: '', resultcode: '000'});
    };


	/**
	 * 获取会员概览统计报表数据
	 * @param  {Object} params {}
	 * @param  {Function} cbFn   回调参数
	 *           {
	 *           	resultcode, resultmsg,
	 *           	data : {
	 *           		datasets : {
	 *           			cardOverViewSummerrizingDs : {
	 *           				data : {
	 *           					page : {pageCount,pageNo,pageSize,totalSize},
	 *           					records : [{
	 *           						cardCount, cardLevelName, consumptionCountSum, consumptionPerOrder,
	 *           						consumptionTotalSum, description, discountDescription, discountRange,
	 *           						discountRate, inShopCount, inShopRate, isDefaultLevel, isVipPrice, levelCardCountRate,
	 *           						levelSort, isActive, moneyBalanceSum, onLineCount, onLineRate, operator, pointBalanceSum,
	 *           						pointRate, sexFemaleCount, sexFemaleRate, sexMaleCount, secMaleRate, sexUnkonownRate,
	 *           						secUnknownCount, switchLevelDownPoint, switchLevelUpPoint
	 *           					}]
	 *           				}
	 *           			}
	 *           		}
	 *           		records : [{
	 *           			cardCount,cardLevelName,consumptionCountSum,consumptionPerOrder,consumptionTotalSum,
	 *           		 description,discountDescription,discountRange,discountRate,inShopCount,inShopRate,isDefaultLevel,
	 *           		 isVipPrice,levelCardCountRate,levelSort,isActive,moneyBalanceSum,onLineCount,onLineRate,operator,pointBalanceSum,
	 *           		 pointRate,secFemaleCount,sexFemaleRate,sexMaleCount,sexMaleRate,sexUnknownRate,sexUnknownRate,switchLevelDownPoint,switchLevelUpPoint
	 *           	  	}]
	 *           	},
	 *           	
	 *           }
	 * @return {NULL}
	 */
	Hualala.Global.queryCrmMemberSchema = function (params, cbFn) {
		IX.Debug.info("DEBUG: Query CRM Member Schema Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, Test.MemberSchemaData));
	};


    
    /**
	  * 获取CRM系统参数
      * @param {Object} params 参数{groupID} 可选
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [itemID, serviceStartTime, serviceEndTime, isPointCanPay, pointExchangeRate, pointClearDate, vipServiceTel, vipServiceRemark}]}}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmGroupParamsQuery.ajax
	  */
	Hualala.Global.getCrmParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {
                    itemID: 63,
                    logoImage: "group1/M00/00/C6/wKgCIVM5PJ2w9TcpAABu3oLN9LY618.png",
                    cardBackgroundImage: "",
                    cardBackgroundColor: "#990000",
                    cardForegroundColor: "#ffcc00",
                    onlineSaveMoneyRate: "0.0100",
                    onlineSaveMoneySettleUnitID: "6",
                    serviceStartTime: "20140810",
                    serviceEndTime: "20150810",
                    isPointCanPay: "1",
                    pointExchangeRate: "1",
                    pointClearDate: "0521",
                    vipServiceTel: "010-68502174",
                    vipServiceRemark: "这是会员服务说明",
                    openCardGiftID: '132',
                    openCardGiftName: '50元充值卡',
                    openCardGiftNum: '0',
                    openCardGiftValidDays: '0',
                    openCardGiftEffectHours: '0',
                    birthdayGiftID: '0',
                    birthdayGiftName: '',
                    birthdayGiftNum: '',
                    birthdayGiftAdvanceDays: '',
                    birthdayGiftValidDays: '',
                    birthdayGiftSMS: ''
                }
            };
		fn(rsp);
	};
    
    /**
      * 设置CRM系统参数
      * @param {Object} params 参数{itemID, vipServiceTel, vipServiceRemark} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmGroupParamsUPdateOrAdd.ajax
	  */
	Hualala.Global.setCrmParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
	  * 获取CRM充值套餐列表
      * @param {Object} params 参数{} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg...}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmSaveMoneySetQuery.ajax
	  */
	Hualala.Global.getCrmRechargeSets = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_recharge_sets.js'], function(){
            fn(Test.crmRechargeSets);
        });
	};
	
    /**
      * 切换会员充值套餐启用/禁用状态
      * @param {Object} params 参数{saveMoneySetID, isActive} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmSaveMoneyIsActive.ajax
	  */
	Hualala.Global.switchCrmRechargeSetState = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 添加会员充值套餐
      * @param {Object} params 参数{setName, setSaveMoney, returnMoney, returnPoint, switchCardLevelID} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmSaveMoneySetAdd.ajax
	  */
	Hualala.Global.addCrmRechargeSet = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 修改会员充值套餐
      * @param {Object} params 参数{saveMoneySetID, setName, setSaveMoney, returnMoney, returnPoint, switchCardLevelID} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmSaveMoneySetUpdate.ajax
	  */
	Hualala.Global.updateCrmRechargeSet = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000',
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 获取会员等级列表
      * @param {Object} params 参数{isActive}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{isActive, cardLevelID, cardLevelName, ...}, ...]}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmLevelQuery.ajax
	  */
	Hualala.Global.getVipLevels = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_vip_levels.js'], function(){
            fn(Test.crmVipLevels);
        });
	};
    
    /**
      * 获取会员信息集合
      * @param {Object} params 参数{createTimeStart, createTimeEnd, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{cardNO, customerName, ...}, ...]}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmCustomerCardComplexQuery.ajax
	  */
	Hualala.Global.queryCrm = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_query_items.js'], function(){
            var srcRecords = Test.crmQueryItems.data.records;
            var startIndex = (params.pageNo - 1) * params.pageSize;
            Test.crmQueryItems.data.page.pageNo = params.pageNo;
            Test.crmQueryItems.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            if(params.cardID)
                Test.crmQueryItems.data.records = [srcRecords[Hualala.Common.inArray(srcRecords, {cardID: params.cardID}, 'cardID')]];
            fn(Test.crmQueryItems);
        });
	};
    
    /**
      * 获取会员详情
      * @param {Object} params 参数{cardID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {cardNO, customerName, ...}, ...}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmCustomerCardDetailInfo.ajax
	  */
	Hualala.Global.getCrmDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_query_items.js'], function(){
            var rsp = { resultcode: '000', resultmsg: '' },
                srcRecords = Test.crmQueryItems.data.records;
            
            rsp.data = srcRecords[Hualala.Common.inArray(srcRecords, {cardID: params.cardID}, 'cardID')];
            $.extend(rsp.data, {
                saveMoneyTotal: '52445.00', deductMoneyTotal: '2568.00', moneyBalance: '2552.00',
                consumptionTotal: '200.00', consumptionCount: '12', lastConsumptionTime: '20141106160227',
                pointGetTotal: '3000.00', pointBalance: '500.00', lastYearPointBalance: '200.00',
                cardLevelName: 'VIP3', lastSwitchLevelTime: '20141025160056', switchUpNeedConsumption: '1000.00'
            });
            fn(rsp);
        });
	};

	/*
	* 修改会员基本信息
	* @params {object} params  参数{cardID, customerName, customerSex, customerBirthday}
	* @params {function} cbFn
	 * @return {NULL}
	 * 服务调用：/shop/dianpuUpdateCardMessage.ajax
	* */
	Hualala.Global.updateCrmBasicInfo = function (params, cbFn){
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({resultcode: '000', msg: ''});
	};
    
    /**
      * 获取会员交易明细
      * @param {Object} params 参数{cardID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{transTime, transShopName, ...}, ...]}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmTransDetailQuery.ajax
	  */
	Hualala.Global.getCrmTransDetail = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_trans_detail.js'], function(){
            if(params.pageNo)
            {
                var srcRecords = Test.crmTransDetail.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                Test.crmTransDetail.data.page.pageNo = params.pageNo;
                Test.crmTransDetail.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(Test.crmTransDetail);
        });
	};
    
    /**
      * 获取会员参与活动
      * @param {Object} params 参数{cardID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{customerName, eventName, ...}, ...]}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmEventUserQuery.ajax
	  */
	Hualala.Global.getCrmUserEvents = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_user_events.js'], function(){
            fn(Test.crmUserEvents);
        });
	};
    
    /**
      * 获取会员优惠券
      * @param {Object} params 参数{cardID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{giftName, getWay, ...}, ...]}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmEGiftDetailQuery.ajax
	  */
	Hualala.Global.getCrmUserGifts = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_user_gifts.js'], function(){
            fn(Test.crmUserGifts);
        });
	};
    
    /**
      * 获取会员卡日志
      * @param {Object} params 参数{cardID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{createTime, shopName, ...}, ...]}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmCustomerCardLogQuery.ajax
	  */
	Hualala.Global.getCrmCardLogs = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_card_logs.js'], function(){
            fn(Test.crmCardLogs);
        });
	};

    /**
      * 获取CRM店铺特惠
      * @param {Object} params 参数{groupID 可选}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{shopName, shopPointRate, ...}, ...]}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmShopParamsQuery.ajax
	  */
	Hualala.Global.getCrmPreferential = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_preferential.js'], function(){
            var srcRecords = Test.crmPreferential.data.records;
            var startIndex = (params.pageNo - 1) * params.pageSize;
            Test.crmPreferential.data.page.pageNo = params.pageNo;
            Test.crmPreferential.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            if(params.itemID)
                Test.crmPreferential.data.records = [srcRecords[Hualala.Common.inArray(srcRecords, {itemID: params.itemID}, 'itemID')]];
            fn(Test.crmPreferential);
        });
	};


    /**
      * 修改会员店铺优惠
      * @param {Object} params 参数{itemID, isActive, ...} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmShopParamsUpdate.ajax
	  */
	Hualala.Global.updateCrmPreferential = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};

	/**
	 * 获取CRM店铺特惠（新）
	 * @param {Object} params 参数{pageNo, pageSize}
	 * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{shopName, shopPointRate, ...}, ...]}
	 * @return {NULL}
	 * 服务调用 URL: /crm/shopParamsQuery.ajax
	 */
	Hualala.Global.getCrmShopPreferential = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		IX.Net.loadJsFiles(['/test/data/crm_preferential.js'], function(){
			var srcRecords = Test.crmShopPreferential.data.records;
			var startIndex = (params.pageNo - 1) * params.pageSize;
			Test.crmShopPreferential.data.page.pageNo = params.pageNo;
			Test.crmShopPreferential.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
			if(params.itemID)
				Test.crmShopPreferential.data.records = [srcRecords[Hualala.Common.inArray(srcRecords, {itemID: params.itemID}, 'itemID')]];
			fn(Test.crmShopPreferential);
		});
	};

	/**
	 * 修改会员店铺优惠(新)
	 * @param {Object} params 参数{shopID, itemID, pointType, discountType, pointRate, discountRate...}
	 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用 URL: /crm/crmShopParamsUpdate.ajax
	 */
	Hualala.Global.updateCrmShopPreferential = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp = {
			resultcode: '000',
			resultmsg: ''
		};
		fn(rsp);
	};

	/*
	* 修改店铺的优惠的状态
	* @params {object} params 参数 {shopID, itemID, isActive/memberDayIsActive}
	* @params {Function} cbFn 回调函数{resultcode, resultmsg}
	* @return {NULL}
	* 服务调用 URL: /crm/shopParamsIsActive.ajax
	* */
	Hualala.Global.switchPreferential = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
			rsp = {resultcode: '000', resultmsg: ''};
		fn(rsp);
	};
    
    /**
      * 获取会员交易汇总信息
      * @param {Object} params 参数{queryStartTime, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmTransDetailSummrizing.ajax
	  */
	Hualala.Global.getCrmTransSum = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_trans_sum.js'], function(){
            var rsp = Test.crmTransSum;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    
    /**
      * 获取会员办卡统计信息
      * @param {Object} params 参数{queryStartTime, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmCustomerCardCreateSummarize.ajax
	  */
	Hualala.Global.getCrmCardSum = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_card_sum.js'], function(){
            var rsp = Test.crmCardSum;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    
    /**
      * 获取会员储值对账信息
      * @param {Object} params 参数{queryStartTime, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /crm/crmTransDetailSaveMoneyReconcile.ajax
	  */
	Hualala.Global.getCrmRechargeSum = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_recharge_sum.js'], function(){
            var rsp = Test.crmRechargeSum;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    /**
      * 获取会员日报表信息
      * @param {Object} params 参数{queryStartTime, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: 
	  */
	Hualala.Global.getCrmMemberDailyreport = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/crm_member_daily.js'], function(){
            var rsp = Test.crmMemberDaily;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};

	/*
	* 会员手工调账
	* @params {object} params 参数{cardID, adjustMoneyBalance, adjustGiveBalance, adjustPointBalance, visible, smsContent}
	* @params {function} cbFn 回调函数{resultcode resultmsg}
	* @return {NULL}
	* 服务调用 ：/saas/crm/manualAdjustBalance.ajax
	* */

	Hualala.Global.crmAccountChange = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({resultcode: '000', resultmsg: ''});
	};


	/*
	* 给会员赠送礼品
	* @params {object} params {cardID,giftItemID,giftNum,giftValidDays,giftEffectHours,giftMsg}
	* @params{function} cbFn 回调函数
	* @return {NULL}
	* 服务调用：/shop/crm/cardGiftCharge.ajax
	* */
	Hualala.Global.crmSendGift = function(param, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({resultcode: '000', resultmsg: ''});
	};

    /**
      * 获取微信公共账号
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatListMp.ajax
	  */
	Hualala.Global.getWeixinAccounts = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/weixin/accounts.js'], function(){
            var rsp = Test.wxAccounts;
                srcRecords = rsp.data.records;
            if(params.mpID)
                rsp.data.records = [_.findWhere(srcRecords, {mpID: params.mpID})];
            fn(rsp);
        });
	};
    
    /**
      * 获取微信自动回复信息列表
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatGetShopAutoReply.ajax
	  */
	Hualala.Global.getWeixinAutoReplyList = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/weixin/replies.js', '/test/data/weixin/resources.js'], function(){
            var rsp = Test.wxReplies,
                replies = Test.wxReplies.data.records,
                resources = Test.wxResources.data.records,
                l = resources.length;
            _.each(replies, function(reply)
            {
                reply.resourceID = resources[_.random(l - 1)].itemID;
                reply.pushContentType = _.random(1) + '';
            });
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    
    /**
      * 删除一条微信自动回复信息规则
      * @param {Object} params 参数{itemID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatDelAutoReplyRule.ajax
	  */
	Hualala.Global.deleteWeixinAutoReplyRole = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 获取微信图文文本资源集合
      * @param {Object} params 参数{isActive, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceAll.ajax
	  */
	Hualala.Global.getWeixinResources = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/weixin/resources.js'], function(){
            fn(Test.wxResources);
        });
	};
    
    /**
      * 修改一条微信自动回复信息规则
      * @param {Object} params 参数{itemID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatUpdateAutoReplyRule.ajax
	  */
	Hualala.Global.updateWeixinAutoReplyRole = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 添加一条微信自动回复信息规则
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatAddAutoReplyRule.ajax
	  */
	Hualala.Global.addWeixinAutoReplyRole = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        params.itemID = _.random(10000, 20000) + '';
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {records: [params]}
            };
		fn(rsp);
	};
    
    /**
      * 通过itemID获取微信一条自动回复规则
      * @param {Object} params 参数{itemID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatGetAutoReplyById.ajax
	  */
	Hualala.Global.getWeixinReply = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/weixin/resources.js', '/test/data/weixin/replies.js'], function(){
            var replies = Test.wxReplies.data.records,
                resources = Test.wxResources.data.records, 
                resource = resources[_.random(resources.length - 1)],
                reply = _.findWhere(replies, {itemID: params.itemID});
            reply.resourceID = resource.itemID;
            reply.resourceVaule = _.random(1);
            fn({
                resultcode: '000', 
                resultmsg: '',
                data: { records: [reply] }
            });
        });
	};
    
    /**
      * 查询微信订阅消息
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{data, resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatEventByMpid.ajax
	  */
	Hualala.Global.getWeixinSubscribe = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "data" :
            {
                "records" : [
                    {
                        "action" : "0",
                        "actionTime" : "20141224170601",
                        "createTime" : "20141224170601",
                        "isActive" : "1",
                        "itemID" : "133",
                        "mpID" : "hualala_com",
                        "pushContent" : "",
                        "pushContentType" : "0",
                        "pushEvent" : "subscribe",
                        "pushEventKey" : "",
                        "pushMsgType" : "event",
                        "replyContent" : "布丁",
                        "replyMsgType" : "news",
                        "resourceID" : "78",
                        "resourceVaule" : "1",
                        "serviceName" : ""
                    }
                ]
            },
            "resultcode" : "000",
            "resultmsg" : ""
        };
		fn(rsp);
	};
    
    /**
      * 添加微信订阅消息规则
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatCreateAutoReplyRule.ajax
	  */
	Hualala.Global.addWeixinSubscribe = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                data: {records: [{ itemID: _.random(10000, 20000) }]},
                resultcode: '000', 
                resultmsg: 'itemID=' + _.random(10000, 20000)
            };
		fn(rsp);
	};
    
    /**
      * 修改微信订阅消息规则
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatUpdateAutoReplyRule.ajax
	  */
	Hualala.Global.updateWeixinSubscribe = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 保存微信自定义菜单
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatUpdateMp.ajax
	  */
	Hualala.Global.saveWinxinMenu = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 导入微信自定义菜单
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatGetMenu.ajax
	  */
	Hualala.Global.importWinxinMenu = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        IX.Net.loadJsFiles(['/test/data/weixin/accounts.js'], function(){
            var rsp = Test.wxAccounts;
                srcRecords = rsp.data.records;
            if(params.mpID)
                rsp.data.records = [_.findWhere(srcRecords, {mpID: params.mpID})];
            fn(rsp);
        });
	};
    
    /**
      * 发布微信自定义菜单
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatCreatMenu.ajax
	  */
	Hualala.Global.publishWinxinMenu = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 菜单动作为发送消息时的确认动作
      * @param {Object} params 参数{mpID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatAutoReplyForClick.ajax
	  */
	Hualala.Global.WeixinMenuClick = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 获取微信软文列表
      * @param {Object} params 参数{}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /sysbase/sysbaseQuerySysMobileAds.ajax
	  */
	Hualala.Global.getAdvertorials = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        $.ajax('/test/data/weixin/advertorial.js')
        .done(function()
        {
            var rsp = Test.wxAdvertorials;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    
    /**
      * 删除软文
      * @param {Object} params 参数{itemID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /sysbase/sysbaseDeleteSysMobileAds.ajax
	  */
	Hualala.Global.deleteAdvertorial = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 修改软文
      * @param {Object} params 参数{itemID, title, groupName, body}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /sysbase/sysbaseUpdateSysMobileAds.ajax
	  */
	Hualala.Global.updateAdvertorial = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 添加软文
      * @param {Object} params 参数{title, groupName, body}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /sysbase/sysbaseAddSysMobileAds.ajax
	  */
	Hualala.Global.createAdvertorial = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        params.actionTime = '20150129',
        params.itemID = _.random(10000, 20000) + '';
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {records: [params]}
            };
		fn(rsp);
	};
    
    /**
      * 获取图文列表
      * @param {Object} params 参数{itemID?, pageNo?, pageSize?}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceFind.ajax
	  */
	Hualala.Global.getWeixinContents = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        $.ajax('/test/data/weixin/contents.js')
        .done(function()
        {
            var rsp = Test.wxContents;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    
    /**
      * 删除图文
      * @param {Object} params 参数{itemID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceDelete.ajax
	  */
	Hualala.Global.deleteWeixinContent = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 修改图文
      * @param {Object} params 参数{...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceUpdate.ajax
	  */
	Hualala.Global.updateWeixinContent = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 创建图文
      * @param {Object} params 参数{resType, resTitle, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceInsert.ajax
	  */
	Hualala.Global.createWeixinContent = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        params.itemID = _.random(10000, 20000) + '';
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {records: [params]}
            };
		fn(rsp);
	};
    
    /**
      * 获取微信文本消息列表
      * @param {Object} params 参数{itemID?, pageNo?, pageSize?}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceTextFind.ajax
	  */
	Hualala.Global.getWeixinTexts = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        $.ajax('/test/data/weixin/text.js')
        .done(function()
        {
            var rsp = Test.wxTexts;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            fn(rsp);
        });
	};
    
    /**
      * 删除一条微信文本消息
      * @param {Object} params 参数{itemID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /wechat/wechatResourceTextDel.ajax
	  */
	Hualala.Global.deleteWeixinText = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 获取会员活动列表
      * @param {Object} params 参数{}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /pay/queryCrmCustomerEvent.ajax
	  */
	Hualala.Global.getCrmEvents = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        $.ajax('/test/data/weixin/crm_events.js')
        .done(function()
        {
            fn(Test.crmEvents);
        });
	};
    
    /**
      * 获取用户活动列表
      * @param {Object} params 参数{eventStatus}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /sysbase/querySysEventItemList.ajax
	  */
	Hualala.Global.getUserEvents = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        $.ajax('/test/data/weixin/user_events.js')
        .done(function()
        {
            fn(Test.userEvents);
        });
	};
    
    /**
     * 获取营销活动礼品列表数据
     * @param  {[Obj]} params 参数 {giftName, giftType, pageNo, pageSize}
     *        
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.getMCMGifts = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var data = Test.getGiftList(params);
    	setTimeout(function () {
			fn(IX.inherit(res, {
				data : data
			}));
		}, 1000);	
    };

    /**
     * 删除礼品
     * @param  {Obj} params {giftItemID}
     * @param  {[type]} cbFn   
     * @return {[type]}        
     */
    Hualala.Global.deleteMCMGift = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };

    /**
     * 添加礼品
     * @param  {[type]} params {}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.createMCMGift = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };

    /**
     * 编辑礼品
     * @param  {[type]} params {}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
	Hualala.Global.editMCMGift = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };   

    /**
     * 获取活动列表数据
     * @param  {[Obj]} params {eventName, eventWay, isActive, pageNo, pageSize, eventStartDate, eventEndDate}
     * @param  {[type]} cbFn   
     * @return {[type]}        [description]
     */
    Hualala.Global.getMCMEvents = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var data = Test.getEventList(params);
    	setTimeout(function () {
			fn(IX.inherit(res, {
				data : data
			}));
		}, 1000);
    };

    /**
     * 删除活动
     * @param  {Obj} params {eventID}
     * @param  {[type]} cbFn   
     * @return {[type]}        [description]
     */
    Hualala.Global.deleteMCMEvent = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };


    /**
     * 活动开关操作
     * @param  {[type]} params {eventID, isActive}
     * @param  {[type]} cbFn   
     * @return {[type]}        [description]
     */
    Hualala.Global.switchMCMEvent = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };

    /**
     * 根据ID获取活动信息
     * @param  {Object} params {eventID}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.getMCMEventByID = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var data = Test.getEventDataByID(params);
    	setTimeout(function () {
			fn(IX.inherit(res, {
				data : {
					records : [data]
				}
			}));
		}, 1000);
    };


    /**
     * 创建活动
     * @param  {Object} params {}
     * @param  {Function} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.createEvent = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var data = Test.getEventDataByID(params);
    	setTimeout(function () {
			fn(IX.inherit(res, {
				data : data
			}));
		}, 1000);
    };

    /**
     * 编辑活动信息
     * @param  {[type]} params {}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.editEvent = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var data = Test.getEventDataByID(params);
    	setTimeout(function () {
			fn(IX.inherit(res, {
				data : data
			}));
		}, 1000);
    };

    /**
     * 获取礼品详情信息
     * @param  {[type]} params {giftItemID}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.getMCMGiftDetail = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var data = Test.getGiftDataByID(params);
    	var myGiftDataset = Test.getGiftDataset();
    	setTimeout(function () {
    		fn(IX.inherit(res, {
				data : IX.inherit({
					records : [data]
				}, myGiftDataset)
			}));
    	}, 200);
    };

    /**
     * 获取礼品详情->礼品发送数统计信息
     * @param  {[type]} params [description]
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.queryMCMGiftDetailGetWayInfo = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var items = Test.getGiftGetWayData(params);
    	setTimeout(function () {
    		fn(IX.inherit(res, {
				data : {
					records : items,
					pageNo : 1,
					pageSize : 15,
					totalSize : 15
				}
			}));
    	}, 200);

    };

    /**
     * 获取礼品详情->礼品使用数的统计数据信息
     * @param  {[type]} params [description]
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.queryMCMGiftDetailUsedInfo = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var items = Test.getGiftUsedData(params);
    	setTimeout(function () {
    		fn(IX.inherit(res, {
				data : {
					records : items,
					pageNo : 1,
					pageSize : 15,
					totalSize : 15
				}
			}));
    	}, 200);
    };

	/*
	* 保存编辑的短信模板
	* @params {object} params {eventID, smsTemplate}
	* @params {function} cbFn
	* return null
	* 服务：/crm/setSmsTemplate.ajax
	* */
	Hualala.Global.editSMSTemplate = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn(Test.smsEventInfo);
	};

	/*
	* 获取开卡店铺
	* @params params {roleType, accountID}
	* @params cbFn
	* 服务：shop/queryShopByRoleType.ajax
	* */
	Hualala.Global.getSMSShops = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn(Test.smsCardShops);
	};

    /**
     * 通过手机号获取注册用户基本信息
     * @param  {Object} params {regMobileStatus : 1, regMobile : [Cellphone Number]}
     * @param  {Function} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.queryUserBaseInfoByMobile = function (params, cbFn) {
    	
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var items = [Test.userBaseInfo];
    	setTimeout(function () {
    		fn(IX.inherit(res, {
				data : {
					records : items
				}
			}));
    	}, 200);
    };

    /**
     * 发送短信
     * @param  {Object} params {userID,userMobile,content,giftItemID}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.sendSMS = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };

    /**
     * 礼品详情->赠送|支付礼品操作
     * @param {[type]} params [description]
     * @param {[type]} cbFn   [description]
     */
    Hualala.Global.giftDetailDonateGift = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };

    /**
     * 礼品详情->网上出售礼品操作
     * @param {[type]} params [description]
     * @param {[type]} cbFn   [description]
     */
    Hualala.Global.giftDetailPayGiftOnline = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	setTimeout(function () {
    		fn(res);
    	}, 200);
    };

    /**
     * 获取活动跟踪数据
     * @param  {[type]} params {eventID}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.getMCMEventTrack = function (params, cbFn) {
    	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
    	var res = {resultcode : '000', resultmsg : ''};
    	var items = Test.getEventTrackData(params);
    	setTimeout(function () {
    		fn(IX.inherit(res, {
				data : items
			}));
    	}, 200);
   
    };

    /**
     * 更新活动跟踪的某条数据的入围状态
     * @param  {[type]} params {itemID, winFlag}
     * @param  {[type]} cbFn   [description]
     * @return {[type]}        [description]
     */
    Hualala.Global.switchMCMTrackItem = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var res = {resultcode : '000', resultmsg : ''};
        fn(res);

    };


    /**
      * 查询集团信息
      * @param {Object} params 参数{groupID?}
	  * @param {Function} cbFn   回调函数{data, resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /shop/queryGroupInfoByID.ajax
	  */
	Hualala.Global.getGroupInfo = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "data" :
            {
                "records" : [
                    {
                        "action": "1",
                        "actionTime": "20141210110037",
                        "address": "",
                        "brandLogoHWP": "0.0",
                        "brandLogoImg": "group1/M00/00/99/wKgCH1J7CQ3Qgx5HAAFkZr-puE0934.jpg",
                        "createTime": "20120321115954",
                        "developerID": "0",
                        "email": "",
                        "emailStatus": "0",
                        "fax": "",
                        "groupID": "5",
                        "groupLoginName": "doulaofang",
                        "groupLoginPWD": "",
                        "groupName": "豆捞坊",
                        "groupSecret": "",
                        "groupShortName": "豆捞坊有限公司",
                        "isTestGroup": "0",
                        "linkman": "",
                        "mobile": "13671268301",
                        "mobileStatus": "0",
                        "netAddress": "",
                        "postCode": "",
                        "tel": "" 
                    }
                ]
            },
            "resultcode" : "000",
            "resultmsg" : ""
        };
		fn(rsp);
	};

    /**
     * 查询集团首页信息
     * @param {Object} params 参数{groupID?}
     * @param {Function} cbFn   回调函数{data, resultcode, resultmsg}
     * @return {NULL}
     * 服务调用 URL: /shop/queryShopGroupStyleInfo.ajax
     */
    Hualala.Global.queryGroupStyle = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "data" :
            {
                "records" : [
                    {

                        "action": "1",
                        "actionTime": "20130702165208",
                        "createTime": "1",
                        "custCss": "2",
                        "domainNameEN": "wangwang",
                        "domainNamePY": "doulaofnag",
                        "footerWidgetId": "",
                        "footerWidgetParam": "",
                        "groupID": "2",
                        "headerWidgetId": "image",
                        "headerWidgetParam": "http://res.hualala.com/group1/M00/00/52/wKgCIVGIbNDKy09xAAA1whhimoo884.png",
                        "itemID": "2",
                        "naviWidgetId": "sitenav",
                        "naviWidgetParam": "",
                        "themeId": "basic"
                    }
                ]
            },
            "resultcode" : "000",
            "resultmsg" : ""
        };
        fn(rsp);
    };
    
    /**
      * 设置品牌logo
      * @param {Object} params 参数{brandLogoImg, brandLogoHWP}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /shop/setGroupLOGO.ajax
	  */
	Hualala.Global.setBrandLogo = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * h获取代理程序信息
      * @param {Object} params 参数{}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /pos/queryAgentCspService.ajax
	  */
	Hualala.Global.getAgentInfo = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        $.ajax('/test/data/agent/agent.js')
        .done(function()
        {
            var rsp = Test.agentInfo;
            if(params.pageNo)
            {
                var srcRecords = rsp.data.records;
                var startIndex = (params.pageNo - 1) * params.pageSize;
                rsp.data.page.pageNo = params.pageNo;
                rsp.data.records = srcRecords.slice(startIndex, startIndex + params.pageSize);
            }
            
            if(params.shopID)
            {
                rsp = {
                    "data": {
                        "records": [
                            {
                                shopSecret: ('' + Math.random()).substr(2, 6)
                            }
                        ]
                    },
                    "resultcode" : "000",
                    "resultmsg" : ""
                };
            }
            
            fn(rsp);
        });
	};

    /**
      * 重置代理程序通讯密钥
      * @param {Object} params 参数{}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /pos/resetShopSecret.ajax
	  */
	Hualala.Global.resetAgentSecret = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                data: { shopSecret: ('' + Math.random()).substr(2, 6) },
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    
    /**
      * 获取菜品说明信息
      * @param {Object} params 参数{shopID, adsID}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /shop/queryFoodAdsdetail.ajax
	  */
	Hualala.Global.getFoodDescription = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rn = _.random(1000);
        rsp = {
            data: {
                records: [
                    {
                        "body": "菜品说明内容" + rn,
                        "groupName": Hualala.getSessionSite().groupName,
                        "title": "标题" + rn
                    }
                ]
            },
            "resultcode" : "000",
            "resultmsg" : ""
        };
        fn(rsp);
	};
    
    /**
      * 设置菜品说明信息
      * @param {Object} params 参数{shopID, foodID, adsID, body}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL}
      * 服务调用 URL: /shop/resetFoodAdsdetail.ajax
	  */
	Hualala.Global.setFoodDescription = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rn = _.random(1000);
        var rsp = {
                data: {adsID: +params.adsID ? params.adsID : '' + rn },
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};

    /*
    获取收银软件的商品分类
    @param {object} params 参数{shopID}
    @param {function} cnFn 回调函数参数{resultcode, resultmsg, data}
    @return {NULL}
    服务调用url：/saas/shop/getFoodCategory.ajax
    * */
    Hualala.Global.getSaasCategories = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.saasCategories;
        fn(rsp);
    };

    /*
     店铺信息页面获取商品分类
     @param {object} params 参数{shopID}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg, data}
     @return {NULL}
     服务调用url：/shop/queryShopFoodClass.ajax
     * */
    Hualala.Global.queryCategories = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.saasCategories;
        fn(rsp);
    };


    /*
     获取收银软件所有部门
     @param {object} params 参数{}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/base/departmentQuery.ajax
     * */

     Hualala.Global.getSaasDepartments = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.saasDepartments;
        fn(rsp);
    };

    /*
     收银软件商品分类判断分类名称重复
     @param {object} params 参数{groupID, foodCategoryName}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/checkFoodClassName.ajax
     * */

    Hualala.Global.checkSaasCategoryNameExist = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "processTime": "20141111112531495",
            "resultcode": "001",
            "resultmsg": ""
        };
        fn(rsp);
    };

    /*
     收银软件商品分类删除商品类
     @param {object} params 参数{foodCategoryID}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/base/departmentQuery.ajax
     * */

     Hualala.Global.deleteSaasCategory = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                "processTime": "20141111112531495",
                "resultcode": "000",
                "resultmsg": ""
        };
        fn(rsp);
    };

    /*
     收银软件商品分类更新某个分类
     @param {object} params 参数{foodCategoryID, foodCategoryName, departmentKey, description}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/updateShopFoodClass.ajax
     * */
    Hualala.Global.updateSaasCategory = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "processTime": "20141111112531495",
            "resultcode": "000",
            "resultmsg": ""
        };
        fn(rsp);
    };

    /*
     收银软件商品分类增加一个商品分类
     @param {object} params 参数{foodCategoryID, foodCategoryName, departmentKey, description}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/addShopFoodClass.ajax
     * */
    Hualala.Global.createSaasCategory = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            data: {records: [{
                "groupID": "0",
                "action": "0",
                "actionTime": "0",
                "createTime": "0",
                "departmentKey": "894568453223",
                "departmentName": "麻辣部",
                "description": "324242",
                "foodCategoryCode": "",
                "foodCategoryEnName": "",
                "foodCategoryID": "6726",
                "foodCategoryKey": "",
                "foodCategoryName": "ä¸»é£",
                "foodSubjectKey": "0",
                "groupID": "5",
                "isActive": "1",
                "settlementProportion": "1.0",
                "shopID": "0",
                "sortIndex": "15",
                "sourceFoodCategoryID": "0",
                "timeActiveTag": "62"
            }]},
            "processTime": "20141111112531495",
            "resultcode": "000",
            "resultmsg": ""
        };
        fn(rsp);
    };

    /*
     收银软件商品分类开启/关掉某个分类
     @param {object} params 参数{foodCategoryID, isActive}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/setFoodClassIsActive.ajax
     * */
    Hualala.Global.switchSaasCategory = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "processTime": "20141111112531495",
            "resultcode": "000",
            "resultmsg": ""
        };
        fn(rsp);
    };


    /*
     收银软件商品分类排序：将当前分类移到顶部
     @param {object} params 参数{foodCategoryID}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/topFoodClassSort.ajax
     * */
    Hualala.Global.sortSaasCategoryTop = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "processTime": "20141111112531495",
            "resultcode": "000",
            "resultmsg": ""
        };
        fn(rsp);
    };

    /*
     收银软件商品分类排序：将当前分类移到底部
     @param {object} params 参数{foodCategoryID}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/lowFoodClassSort.ajax
     * */
    Hualala.Global.sortSaasCategoryBottom = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "processTime": "20141111112531495",
            "resultcode": "000",
            "resultmsg": ""
        };
        fn(rsp);
    };

    /*
     收银软件商品分类排序：将当前分类向上/向下移动
     @param {object} params 参数{foodCategoryID, foodCategoryID2, sortIndex, sortIndex2}
     @param {function} cnFn 回调函数参数{resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/shiftFoodClassSort.ajax
     * */
    Hualala.Global.sortSaasCategoryUpOrDown = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "processTime": "20141111112531495",
            "resultcode": "000",
            "resultmsg": ""
        };
        fn(rsp);
    };


    /*
     收银软件查询商品：
     @param {object} params 参数{groupID}
     @param {function} cnFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/queryShopFood.ajax
     * */
    Hualala.Global.querySaasGoods = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn(Test.goodsResult);
    };

    /*
     店铺添加商品：
     @param {object} params 参数{groupID, shopID}
     @param {function} cnFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/queryShopFood.ajax
     * */
    Hualala.Global.createSaasGood = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn(Test.goodResult);
    };


    /*
     通过foodID查询指定food的信息：
     @param {object} params 参数{groupID, foodCategoryID, foodID}
     @param {function} cbFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/queryShopFood.ajax
     * */
    Hualala.Global.queryGoodByID = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn(Test.goodResult);
    };

	/*
	* 通过foodID和shopID删除未打通任何餐饮软件的店铺的菜品
	* @params {object} params 参数 {shopID  foodID}
	* @params {function} cbFn 回调参数 {data, resultcode, resultmsg}
	* @return {NULL}
	* 服务调用url：*/
	Hualala.Global.deleteShopFood = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({resultcode: '000', resultmsg: ''});
	};

    /*
     检查商品名称是否重复：
     @param {object} params 参数{groupID, shopID, foodName}
     @param {function} cnFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/shop/queryShopFood.ajax
     * */
    Hualala.Global.checkFoodNameExist = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({resultcode: '000', resultmsg: ''});
    };

    /*
    * 菜品》套餐设置》查询菜品
    * @params {object} params  参数{shopID, keyword}
    * @params {function} cbFn 回调函数 参数 {data, resultcode, resultmsg}
    * @return {NULL}
    * 调用服务：
    * */

    Hualala.Global.searchFood = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn(Test.setFoodSearchResult);
    };

    /**
	  * 获取某个集团的全部渠道数据
	  * @param {Object} params 参数{groupID, itemID, ...}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, page, records}
	  * @return {NULL} 
      * 服务调用URL: /saas/base/channelQuery.ajax 	
	  */
	Hualala.Global.getSaasChannel = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.channelData;
		fn(rsp);
	};
	/**
      * 切换渠道启用/禁用状态
      * @param {Object} params 参数{itemID, isActive} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: 
	  */
	Hualala.Global.switchChannelState = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    /**
      * 添加渠道
      * @param {Object} params 参数{chanelName, itemID, channelRemark} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: 
	  */
	Hualala.Global.addSaasChannel = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
      * 渠道名称重复检查
      * @param {Object} params 参数{chanelName} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: 
	  */
	Hualala.Global.checkChannelName = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
    /**
      * 修改渠道
      * @param {Object} params 参数{resultcode, resultmsg} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: 
	  */
	Hualala.Global.updateSaasChannel = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 删除渠道
	 * @param  {Object} params 参数{itemID,groupID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.deleteSaasChannel = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};
	/**
	 * 新增部门
	 * @param  {Object} params 参数{groupID,departmentName,departmentType,createBy}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.addSaasDepartment = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
      * 部门名称重复检查
      * @param {Object} params 参数{chanelName} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: 
	  */
	Hualala.Global.checkDepartmentlName = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 编辑部门
	 * @param  {Object} params 参数{itemID,groupID,departmentName}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.updateSaasDepartment = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 删除部门
	 * @param  {Object} params 参数{groupID,itemID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.deleteSaasDepartment = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};
	/**
	 * 部门类型
	 * @param  {Object} params 参数{itemID,groupID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.querySaasDepartmentType = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.departmentTypeData;
		fn(rsp);
	};
	/**
	 * 打印方式
	 * @param  {Object} params 参数{itemID,groupID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.querySaasDepartmentPrintType = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.printTypeData;
		fn(rsp);
	};
	/**
	 * 新增收款项目
	 * @param  {Object} params 参数{groupID,subjectName,subjectGroupName,isPay,isMoneyWipeZero,createBy}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.addSaasSubject = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 删除收款项目
	 * @param  {Object} params 参数{groupID,itemID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.deleteSaasSubject = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};
	/**
	 * 编辑收款项目
	 * @param  {Object} params 参数{itemID,groupID,subjectName}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.updateSaasSubject = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 收款项目查询
	 * @param  {Object} params 参数{itemID,groupID,subjectGroupName}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.querySaasSubject = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.subjectData;
		fn(rsp);
	};
	/**
	 *收款项目分组查询
	 * @param {object} params 参数{groupID，subjectGroupName}
	 * 
	 */
	Hualala.Global.queryTreeSubject = function (params,cbFn) {
		var fn = IX.isFn(cbFn) ?cbFn : IX.emptyFn();
		var rsp = Test.subjectTreeData;
		fn(rsp);
	};
	/**
      * 收款项目名称重复检查
      * @param {Object} params 参数{groupID,itemID,subjectName} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
	  * @return {NULL} 
      * 服务调用 URL: 
	  */
	Hualala.Global.checkSubjectlName = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};

	/**
	 * 收款项目启停用
	 * @param  {Object} params 参数{itemID,groupID,isActive}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.switchSaasSubjectstate = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.departmentTypeData;
		fn(rsp);
	};
	/**
	 * 新增备注
	 * @param  {Object} params 参数{groupID,notesType,notesName,addPriceType}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.addSaasRemark = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 删除备注
	 * @param  {Object} params 参数{groupID,itemID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.deleteSaasRemark = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};
	/**
	 * 编辑备注
	 * @param  {Object} params 参数{groupID,notesType,notesName,addPriceType}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.editSaasRemark = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 备注查询
	 * @param  {Object} params 参数{itemID,groupID,notesType,notesName}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.querySaasRemark = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.remarksData;
		fn(rsp);
	};
	/**
	 *备注同一分类名称重复判断
	 * @param  {Object} params 参数{itemID,shopID,notesType,notesName}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.checckRemarkNameIsExist =function(params ,cbFn){
		IX.Debug.info(params);
       	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    },


    /**
     * 查询店铺人员信息
     * @param  {Object} params 参数{shopID,groupID,keywordLst}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */

    Hualala.Global.getShopMembers = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.ShopMembersData;
        fn(rsp);
    };

    /**
     * 新增店铺人员
     * @param  {Object} params 参数{shopID,groupID，填写的人员信息}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.addShopMember = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.AddShopMemberData;
        Test.ShopMembersData.data.records.push(_.omit(rsp.data, 'page', 'pageNo'));
        fn(rsp);
    };

    /**
     * 更新店铺人员信息
     * @param  {Object} params 参数{shopID,groupID,empKey, 填写的人员信息}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.updateShopMember = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.UpdateShopMemberData;
        fn(rsp);
    };

	/*
	* 更改店员账号状态
	* @params {object} {shopID, empKey, accountStatus}
	*@params {Function} cbFn 回调函数
	*@return {NULL}
	* */
	Hualala.Global.switchMember = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
			rsp = {resultcode : '000', resultmsg: ''};
		fn(rsp);
	};

    /**
     * 删除店铺人员
     * @param  {Object} params 参数{shopID,empKey}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.deleteShopMember = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
            "data": {
                "empKey": "e5fc6c37-8338-4c7e-9e76-62e15c58922e",
                "groupID": "5",
                "page": {
                    "pageCount": 0,
                    "pageNo": 0,
                    "pageSize": 0,
                    "totalSize": 0
                },
                "shopID": "77875"
            },
            "resultcode": "000",
            "resultmsg": "服务执行成功！"
        };
        fn(rsp);
    };

    /**
     * 查询角色
     * @param  {Object} params 参数 无
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */

    Hualala.Global.queryRoles = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.MemberRoles;
        fn(rsp);
    };

    /**
     * 查询权限: 获取所有权限
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     * 服务： /saas/base/rightQuery.ajax
     */

    Hualala.Global.queryRights = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.MemberRights;
        fn(rsp);
    };

    /*
    * 设置权限
    * @params {object} params 参数 {empKey, roleIDs, roleIDLst, roleNameLst, }
    * @params {Function} cbFn 回调函数{resultcode, resultmsg}
    * @return {null}
    * @服务 /saas/base/empSetRight.ajax
    * */
    Hualala.Global.setRoleRight = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {resultcode: '000', resultmsg: ''};
        fn(rsp);
    };

    /*
     * 重置店员的登录密码
     * @params {object} params 参数 {empKey, empPWD, }
     * @params {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {null}
     * @服务 /saas/base/empResetPWD.ajax
     * */
    Hualala.Global.resetMemberPassword = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {resultcode: '000', resultmsg: ''};
        fn(rsp);
    };
    /**
     * 查询店铺桌台信息
     * @param  {Object} params 参数{shopID,groupID, areaID,isRoom, tableName}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     * 服务：/saas/base/queryTable.ajax
     */
    Hualala.Global.getShopTable = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.ShopTableData;
        fn(rsp);
    };

    /*
    * 开启或关闭桌台使用状态
    * @params {object} params 参数{shopID, tableID, isActive}
    * @params {Function} cbFn 回调函参数数 {rsp}
    * @return {null}
    */
    Hualala.Global.switchShopTable = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {resultcode: '000', resultmsg: ''};
        cbFn(rsp);
    };

    /*
     * 查询区域信息
     * @params {object} params 参数{shopID}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.getTableArea = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = Test.tableAreas;
        fn(rsp);
    };

    /*
     * 添加桌台
     * @params {object} params 参数{shopID, tableName, tableCode, areaID, isTrueTable, isRoom, isActive, tableTagStr, person}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.addShopTable = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     *修改桌台信息
     * @params {object} params 参数{shopID, tableID, tableName, tableCode, areaID, isTrueTable, isRoom, isActive, tableTagStr, person}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.updateShopTable = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 删除桌台
     * @params {object} params 参数{shopID, tableID}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.deleteShopTable = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 检查桌台名称是否重复
     * @params {object} params 参数{shopID, tableID, tableName}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.checkTableExist = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 开启/关闭区域状态
     * @params {object} params 参数{shopID, areaID, isActive}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.switchTableArea = function(params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: ''};
        fn(rsp);
    };

    /*
     * 检查区域名称是否重复
     * @params {object} params 参数{shopID, areaID, areaName}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.checkAreaNameExist = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 添加区域
     * @params {object} params 参数{shopID, areaID, areaName, areaNote}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.addTableArea = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 更新区域
     * @params {object} params 参数{shopID, areaID, areaName, areaNote}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.updateTableArea = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 删除区域
     * @params {object} params 参数{shopID, areaID}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.deleteTableArea = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /*
     * 设置区域的菜品分类
     * @params {object} params 参数{shopID, areaID, foodCategoryCodeLst}
     * @params {Function} cbFn 回调函参数数 {rsp}
     * @return {null}
     */
    Hualala.Global.setAreaCategory = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn(),
            rsp = {resultcode: '000', resultmsg: '', data: {}};
        fn(rsp);
    };

    /**
     * 查询店铺促销信息
     * @param  {Object} params 参数{shopID}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.getShopPromotion = function (params, cbFn) {
        IX.Debug.info("DEBUG: 店铺促销");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, Test.PromotionData));
    };
    /**
     * 添加更新店铺促销信息
     * @param  {Object} params 参数{shopID,startDate,endDate,holidayFlag,supportOrderType,time1Start,time1End,time2Start,time2End,wholeDay,rules,remark}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.updateShopPromotion =function (params, cbFn) {
        IX.Debug.info("DEBUG: 添加和更新促销信息");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /*
     *删除促销信息
     * @param  {Object} params 参数{shopID,itemID}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.deleteShopPromotion = function (params, cbFn) {
        IX.Debug.info("DEBUG: 删除促销");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /*
     *促销优惠时间确认
     * @param  {Object} params 参数{shopID,startDate,endDate,holidayFlag,supportOrderType,time1Start,time1End,time2Start,time2End,wholeDay,rules,remark}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.promotionTimeCheck = function (params,cbFn){
        IX.Debug.info("DEBUG: 促销优惠时间确认");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };

	/*
	* 站点及参数设置 获取店铺参数
	* @params {object}  params 参数{shopID}
	* @params {cbFn} cbFn  回调函数 {resultcode, resultmsg}
	* @return {NULL}
	* 服务：/saas/base/getShopParams.ajax
	* */
	Hualala.Global.getSaasShopParams = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn(Test.SaasShopParams);
	};

	/*
	* 站点及参数设置  获取站点参数
	* @params {object} params  参数 {shopID}
	* @params  {cbFn} cbFn  回调函数  {resultcode, resultmsg}
	* @return  {NULL}
	* 服务：/saas/base/getDeviceInfoLst.ajax
	* */
	Hualala.Global.getSaasDeviceParams = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn(Test.SaasDeviceParams);
	};

	/*
	* 修改店铺参数
	* @params {object} params 参数 {[shopID, "moneyWipeZeroType", "CheckoutBillPrintCopies", "CheckoutBillDetailPrintWay", "CheckoutBillDetailAmountType", "printerKey", "CheckoutBillTopAddStr", "CheckoutBillBottomAddStr", "IsPrintCustomerTransCer", "RevOrderAfterPlayVoiceType", "TTSVoiceSpeed", "TTSVoiceName"]}
	* @params {function} cbFn
	* 服务：/saas/base/updateShopParams.ajax
	* */
	Hualala.Global.updateSaasShopParams = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({resultcode: '000', resultmsg: ''});
	};

	/*
	 * 修改站点参数
	 * @params {object} params 参数 {[shopID, deviceKey, deviceCode, deviceRemark ……]}
	 * @params {function} cbFn
	 * 服务：/saas/base/updateDeviceInfo.ajax
	 * */
	Hualala.Global.updateSaasDeviceParams = function(params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		fn({resultcode: '000', resultmsg: ''});
	};

    /*
     *选择优惠券c
     * @param  {Object} params 参数
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.queryGiftDetail =function(params, cbFn){
        IX.Debug.info("DEBUG: 选择优惠券");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /*
     *预览完成
     * @param  {Object} params 参数{rules}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */

    Hualala.Global.promotionRulesToString =function (params, cbFn) {
        IX.Debug.info("DEBUG: 促销信息预览");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /** 查询可套用店铺
     * @param  {Object} params 参数{shopID}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.getAllowRefPromotionShop =function(params, cbFn){
    	IX.Debug.info("DEBUG: 查询可套用店铺");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, Test.AllowRefPromotionShopData));
    };
    /** 更新套用店铺
     * @param  {Object} params 参数{shopID}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.updatePromotShop =function(params, cbFn){
    	IX.Debug.info("DEBUG: 修改套用店铺");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /** 取消套用店铺促销规则
     * @param  {Object} params 参数{shopID}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
    Hualala.Global.cancelRefPromotionRules =function(params, cbFn){
    	IX.Debug.info("DEBUG: 取消套用店铺促销规则");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /** 店铺促销规则开关控制
     * @param  {Object} params 参数{shopID,itemID,action}
     * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
     * @return {NULL}
     */
     Hualala.Global.switchShopPromotion =function(params, cbFn){
     	IX.Debug.info("DEBUG: 店铺促销规则开关控制");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
     };
    /**
	 * 订单的导出
	 * @param  {Object} params {serviceName, templateName,fileName}
	 * @param  {Function} cbFn   回调参数
	 *           {
	 *           	resultcode, resultmsg
	 *           }
	 * @return {NULL}        
	 */
	Hualala.Global.OrderExport = function (params, cbFn) {
		IX.Debug.info("DEBUG: OrderExport Post Params:");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : '获取成功'};
	};
	/**
	 * 新增打印机
	 * @param  {Object} params 参数{shopID,currPrinterStatus,printerName,printerPort,printerPortType}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerInsert.ajax
	 */
	Hualala.Global.addShopPrinter = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 删除打印机
	 * @param  {Object} params 参数{shopID,itemID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerDelete.ajax
	 */
	Hualala.Global.deleteShopPrinter = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};
	/**
	 * 编辑打印机
	 * @param  {Object} params 参数{shopID,itemID,currPrinterStatus,printerName,printerPort,printerPortType}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerUpdate.ajax
	 */
	Hualala.Global.updateShopPrinter = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
	};
	/**
	 * 打印机查询
	 * @param  {Object} params 参数{shopID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 */
	Hualala.Global.getShopPrinter = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.PrinterQueryData;
		fn(rsp);
	};
	/*
     检查打印机名称是否重复：
     @param {object} params 参数{itemID, shopID, printerName}
     @param {function} cnFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/base/printerNameExist.ajax
     * */
    Hualala.Global.checkPrinterNameExist = function (params, cbFn) {
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({resultcode: '000', resultmsg: ''});
    };
    /*
     查询厨房分单打印设置列表：
     @param {object} params 参数{shopID,areaKey,departmentKey,printerKey}
     @param {function} cnFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/base/kitchenPrinterQuery.ajax
     * */
    Hualala.Global.queryPrinterArea = function(params,cbFn){
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.PrinterAreaData;
		fn(rsp);
    };
    /*
     打印区域名称重复判断：
     @param {object} params 参数{itemID, shopID, printAreaName}
     @param {function} cnFn 回调函数参数{data, resultcode, resultmsg}
     @return {NULL}
     服务调用url：/saas/base/printerAreaSetNameIsExist.ajax
    Hualala.Global.checkprinterAreaName =function (params, cbFn){
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        fn({resultcode: '000', resultmsg: ''});
    };
    * */
    /**
	 * 编辑打印区域
	 * @param  {Object} params 参数{shopID,itemID,printAreaName,dispatchBillPrinterKey,dispatchBillPrintCopies}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerAreaSetUpdate.ajax
	 
    Hualala.Global.updatePrinterArea = function(params,cbFn){
       	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };*/
    /**
	 * 修改厨房分单区域打印
	 * @param  {Object} params 参数{shopID,itemID,printerKey,printCopies,printWay,isPrintToDispatchBill}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerSetUpdate.ajax
    Hualala.Global.updatePrinterSet = function(params,cbFn){
    	IX.Debug.info(params);
       	var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };*/
    /**
	 * 删除厨房分单打印区域
	 * @param  {Object} params 参数{shopID,itemID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerSetDelete.ajax
	Hualala.Global.deletePrinterSet = function(params, cbFn){
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };*/
    /**
	 * 增加厨房分单打印区域
	 * @param  {Object} params 参数{shopID,printAreaKey,departmentKeys}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerSetInsert.ajax
    Hualala.Global.addPrintSet =function(params, cbFn){
    	IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    }; */   
    /**
	 * 查询厨房分单区域未添加过的部门
	 * @param  {Object} params 参数{shopID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/deptNotInPrintSetQuery.ajax
    Hualala.Global.queryPrintDepartment =function(params, cbFn){
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.PrintSetQueryData;
		fn(rsp);
    };	 */
    /**
	 * 厨房分单打印传菜单打印机设置
	 * @param  {Object} params 参数{shopID,areaKeys,dispatchBillPrinterKey,dispatchBillPrintCopies}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/dispatchBillPrinterSet.ajax
    */
    Hualala.Global.setAreaPrinter =function (params, cbFn){
    	IX.Debug.info("--------传菜单打印设置-------------");
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 *  厨房分单打印制作单打印机设置
	 * @param  {Object} params 参数{shopID,areaKeys,departmentKeys,printerKey,printCopies,printWay,isPrintToDispatchBill}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/printerSet.ajax
    */
    Hualala.Global.setDepartmentPrinter = function(params,cbFn){
    	IX.Debug.info("--------制作单打印设置-------------");
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 新增打折方案
	 * @param  {Object} params 参数{shopID,discountWayName,discountRate,discountRange,isVipPrice,isActive}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/discountRoleInsert.ajax
	 */
    Hualala.Global.addDiscount =function(params, cbFn){
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 删除打折方案
	 * @param  {Object} params 参数{shopID,itemID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/discountRoleDelete.ajax
	 */
    Hualala.Global.deleteDiscount =function(params, cbFn){
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 修改打折方案
	 * @param  {Object} params 参数{shopID,itemID,discountWayName,discountRate,discountRange,isVipPrice,isActive}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/discountRoleUpdate.ajax
	 */
    Hualala.Global.editDiscount =function(params, cbFn){
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 查询打折方案
	 * @param  {Object} params 参数{shopID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/discountRoleQuery.ajax
	 */
    Hualala.Global.queryDiscount =function(params, cbFn){
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var rsp =Test.DiscountData;
		fn(rsp);
    };
    /**
	 * 打折方案名称重复判断
	 * @param  {Object} params 参数{shopID,itemID,discountWayName}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/discountRoleNameExist.ajax
	 */
    Hualala.Global.checkDiscountNameExist =function(params, cbFn){
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 打折方案是否启用
	 * @param  {Object} params 参数{shopID,itemID,isActive}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/saas/base/discountRoleIsActive.ajax
	 */
    Hualala.Global.switchDiscount =function(params, cbFn){
    	IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
     /**
	 * 时段的查询或者套用时段的查询
	 * @param  {Object} params 参数{shopID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/shop/queryShopTimeAndRef.ajax
	 */
    Hualala.Global.queryShopTime =function(params, cbFn){
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, Test.ShopTimeData));
    };
    /**
	 * 修改时段
	 * @param  {Object} params 参数{shopID,startTime,endTime,timeID,timeName,isActive}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/shop/updateTimeShopID.ajax
	 */
    Hualala.Global.updateShopTime =function(params, cbFn){
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 查询可套用店铺的时段
	 * @param  {Object} params 参数{shopID,startTime,endTime,timeID,timeName,isActive}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/shop/queryAllowRefTimeShopIds.ajax
	 */
    Hualala.Global.getRefTimeShops =function(params, cbFn){
        IX.Debug.info("DEBUG: 查询可套用店铺");
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(IX.inherit(res, Test.refTimeShoData));
    };
    /**
	 * 套用时段
	 * @param  {Object} params 参数{shopID,timeShopID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/shop/updateTimeShopID.ajax
	 */
    Hualala.Global.bindRefShopTime =function(params, cbFn){
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 取消时段的套用
	 * @param  {Object} params 参数{shopID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/shop/cancleRefShopTime.ajax
	 */
    Hualala.Global.cancleRefShopTime =function(params, cbFn){
        IX.Debug.info(params);
        var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: ''
            };
		fn(rsp);
    };
    /**
	 * 是否启用时段
	 * @param  {Object} params 参数{shopID,timeID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用url:/shop/shopTimeSetIsActive.ajax
	 */
    Hualala.Global.switchShopTime =function(params, cbFn){
		IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
    /**
	 * 初始化时段
	 * @param  {Object} params 参数{shopID,cityID}
	 * @param  {Function} cbFn 回调函数{resultcode, resultmsg}
	 * @return {NULL}
	 * 服务调用/shop/initShopTime.ajax
	 */
    Hualala.Global.initShopTime = function(params, cbFn){
       	IX.Debug.info(params);
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
    };
})();









