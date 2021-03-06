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
})();