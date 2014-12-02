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
        var rsp = {resultcode: '000', resultmsg: ''};
		fn(rsp);
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
                    serviceStartTime: "20140810",
                    serviceEndTime: "20150810",
                    isPointCanPay: "1",
                    pointExchangeRate: "1",
                    pointClearDate: "0521",
                    vipServiceTel: "010-68502174",
                    vipServiceRemark: "这是会员服务说明"
                    
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
      * @param {Object} params 参数{} 
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data.records: [{isActive, cardLevelID, cardLevelName, ...}, ...]}
	  * @return {NULL} 
      * 服务调用 URL: /crm/crmLevelQuery.ajax
	  */
	Hualala.Global.getVipLevels = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
        var rsp = {
                resultcode: '000', 
                resultmsg: '',
                data: {
                    records: [
                        {cardLevelID: '201', cardLevelName: 'VIP1', isActive: 1},
                        {cardLevelID: '202', cardLevelName: 'VIP2', isActive: 1},
                        {cardLevelID: '203', cardLevelName: 'VIP3', isActive: 1},
                        {cardLevelID: '204', cardLevelName: 'VIP4', isActive: 1}
                    ]
                }
            };
		fn(rsp);
	};
    
})();









