/**
	定义CallServer函数接口
*/
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
Hualala.Global.loadAppData = function (params, cbFn) {}


