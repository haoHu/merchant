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
			resultcode : 000,
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
			resultcode : 000,
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
		var res = {resultcode : 000, resultmsg : ''};
		if (random < 5) {
			fn(IX.inherit(res, {
				resultcode : random * 1000,
				resultmsg : '登录失败！'
			}));
		} else {
			fn(res);
		}
	};
})();