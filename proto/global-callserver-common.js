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
				pageCount : 1,
				pageNo : 1,
				pageSize : accountList.length,
				totalSize : accountList.length,
				records : match
			}
		}));
	};

	/**
	 * 提现操作
	 * @param  {Object} params 参数{}
	 * @param  {Function} cbFn   回调函数{resultcode, resultmsg, data}
	 * @return {NULL}
	 */
	Hualala.Global.withdrawCash = function (params, cbFn) {
		var fn = IX.isFn(cbFn) ? cbFn : IX.emptyFn();
		var res = {resultcode : '000', resultmsg : ''};
		fn(res);
	};

     /**
	  * 获取已启用城市
	  * @param {Object} params 参数{isActive: 1}
	  * @param {Function} cbFn   回调函数{resultcode, resultmsg, data: {records: [
        {cityID , cityName}, ...]}}
	  * @return {NULL} 
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
	  */
	Hualala.Global.setShopMap = function (params, cbFn) {
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
                        status: "6",
                        tel: "010-59716881"
                    }]
                }
            };
		fn(rsp);
	};


})();