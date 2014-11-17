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

/**
 * 获取手机动态密码
 * @param  {Object} params {groupName, userMobile}
 * @param  {Function} cbFn   回调参数
 *           {
 *           	resultcode, resultmsg
 *           }
 * @return {NULL}        
 */
Hualala.Global.getMobileDynamicPWD = function (params, cbFn) {};

/**
 * 动态密码登录请求
 * @param  {Object} params  {groupName, userMobile, dynamicPwd}
 * @param  {Function} cbFn   Response数据回调
 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {}}
 *           @param {String} resultcode Response结果码
 *           @param {String} resultmsg Response结果描述
 * @return {NULL}        
 */
Hualala.Global.dynamicLoginCallServer = function (params, cbFn) {}

/**
 * 获取动态验证码
 * @param  {Object} params {}
 * @param  {[type]} cbFn   Response数据回调
 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {site, user, roles}}
 *           @param {String} resultcode Response结果码
 *           @param {String} resultmsg Response结果描述
 *           @param {Object} data Response结果数据
 *           @param {String} data.code 验证码图片地址
 * @return {NULL}        
 */
Hualala.Global.genAuthCode = function (params, cbFn) {}

/**
 * 登录请求
 * @param  {Object} params 登录表单数据
 * @param  {Function} cbFn   Response数据回调
 *           @param {Object} response cbFn回调参数 {resultcode, resultmsg, data : {}}
 *           @param {String} resultcode Response结果码
 *           @param {String} resultmsg Response结果描述
 * @return {NULL}        
 */
Hualala.Global.loginCallServer = function (params, cbFn) {}

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
Hualala.Global.getShopQuerySchema = function (params, cbFn) {}

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
Hualala.Global.queryShop = function (params, cbFn) {}

/**
 * 切换店铺状态
 * @param  {Object} params 参数{shopID, status}
 * @param  {Function} cbFn   回调参数{resultcode, resultmsg}
 * @return {NULL}        
 */
Hualala.Global.switchShopStatus = function (params, cbFn) {}

/**
 * 切换店铺业务状态
 * @param  {Object} params 参数{shopID, operation, serviceFeature}
 * @param  {Function} cbFn   回调函数
 * @return {NULL}        
 */
Hualala.Global.switchShopServiceFeatureStatus = function (params, cbFn) {}

/**
 * 设置闪吃业务配置参数
 * @param {Object} params 参数 {shopID, orderType, strType, advanceTime,noticeTime,minAmount,serviceAmount,freeServiceAmount,holidayFlag,openDays,servicePeriods,reserveTableTime,reserveTableDesc,submitSMSTemplateID,checkSMSTemplateID,payMethod,supportInvoice}
 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
 * @return {NULL}
 */
Hualala.Global.setJustEatParams = function (params, cbFn) {}
 /**
  * 设置店内自助业务配置参数
  * @param {Object} params 参数{needInputTableName,supportInvoice,supportCommitToSoftware,payBeforeCommit,fetchFoodMode}
  * @param {Function} cbFn   回调函数{resultcode, resultmsg}
  * @return {NULL} 
  */
Hualala.Global.setSpotOrderParams = function (params, cbFn) {}

/**
 * 常规订座点菜业务配置参数
 * @param {Object} params 参数{shopID, orderType, strType, advanceTime, noticeTime, reserveTableTime,reserveTableDesc,minAmount,payMethod}
 * @param {Function} cbFn   回调函数{resultcode, resultmsg}
 */
Hualala.Global.setCommonReserveParams = function (params, cbFn) {};

/**
 * 为店铺绑定结算账户
 * @param  {Object} params 参数{settleID,shopID}
 * @param  {Function} cbFn   回调{resultcode, resultmsg}
 * @return {NULL}       
 */
Hualala.Global.bindSettleUnitByShopID = function (params, cbFn) {};

/**
 * 获取结算账户信息
 * @param  {Object} params 参数{}
 * @param  {Function} cbFn   回调函数{resultcode, resultmsg, data}
 *               data : {pageCount, pageNo, pageSize, totalSize, records: $$AccountList}
 * @return {NULL}
 */
Hualala.Global.queryAccount = function (params, cbFn) {}

/**
 * 提现操作
 * @param  {Object} params 参数{settleUnitID,transAmount,poundageAmount,poundageMinAmount}
 * @param  {Function} cbFn   回调函数{resultcode, resultmsg, data}
 * @return {NULL}
 */
Hualala.Global.withdrawCash = function (params, cbFn) {};

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
 * 结算账户交易明细查询
 * @param  {Object} params {transCreateBeginTime, transCreateEndTime, settleUnitID, 
 * 			transStatus, transType, groupID, minTransAmount, maxTransAmount}
 * @param  {Function} cbFn
 * @return {NULL}
 */
Hualala.Global.queryAccountTransDetail = function (params, cbFn) {};

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
Hualala.Global.getAccountQueryShop = function (params, cbFn) {};

/**
 * 结算账户交易明细查询
 * @param  {Object} params {transCreateBeginTime, transCreateEndTime, settleUnitID, 
 * 			transStatus, transType, groupID, minTransAmount, maxTransAmount}
 * @param  {Function} cbFn
 * @return {NULL}
 */
Hualala.Global.queryAccountTransDetail = function (params, cbFn) {};

/**
 * 查询结算交易明细
 * @param  {[type]} params
 * @param  {[type]} cbFn
 * @return {[type]}
 */
Hualala.Global.queryAccountOrderPayDetail = function (params, cbFn) {};

/**
 * 查询结算会员充值明细
 * @param  {[type]} params
 * @param  {[type]} cbFn
 * @return {[type]}
 */
Hualala.Global.queryAccountFsmCustomerDetail = function (params, cbFn) {};

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
Hualala.Global.queryOrderDetail = function (params, cbFn) {};

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
Hualala.Global.queryOrderDayDetail = function (params, cbFn) {};

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
Hualala.Global.queryOrderDuringDetail = function (params, cbFn) {};

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
Hualala.Global.queryOrderDishesHot = function (params, cbFn) {};

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
Hualala.Global.queryUserOrderStatistic = function (params, cbFn) {};

// 账号管理模块服务
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
Hualala.Global.queryShopGroupChildAccount = function (params, cbFn) {};

/**
 * 删除商户中心集团子账号
 * @param  {Object} params {accountID}
 * @param  {Function} cbFn   回调参数
 *          {
 *          	resultcode, resultmsg,
 *          }
 * @return {NULL}
 */
Hualala.Global.removeShopGroupChildAccount = function (params, cbFn) {};

/**
 * 解除绑定商户中心集团子账号绑定的手机
 * @param  {Object} params {accountID, userMobile}
 * @param  {Function} cbFn   回调参数
 *           {
 *           	resultcode, resultmsg
 *           }
 * @return {NULL}
 */
Hualala.Global.unbindMobileInShopGroupChildAccount = function (params, cbFn) {};

/**
 * 为商户中心子账号绑定手机号
 * @param  {Object} params {accountID, userMobile, authCode}
 * @param  {Function} cbFn   回调参数
 *           {
 *           	resultcode, resultmsg
 *           }
 * @return {NULL}
 */
Hualala.Global.bindMobileInShopGroupChildAccount = function (params, cbFn) {};

/**
 * 重置商户中心集团子账号的密码
 * @param  {Object} params {accountID, loginPWD}
 * @param  {Function} cbFn   回调参数
 *          {
 *          	resultcode, resultmsg
 *          }
 * @return {NULL}
 */
Hualala.Global.resetPWDInShopGroupChildAccount = function (params, cbFn) {};

/**
 * 更新商户中心集团子账号的基本信息
 * @param  {Object} params {accountID, userName, userRemark, userEmail, accountStatus}
 * @param  {Function} cbFn   回调参数
 *          {
 *          	resultcode, resultmsg
 *          }
 * @return {NULL}
 */
Hualala.Global.updateShopGroupChildAccount = function (params, cbFn) {};

/**
 * 新建商户中心集团子账号的基本信息
 * @param {Object} params {userName, userRemark, userEmail, accountStatus}
 * @param {Function} cbFn   回调参数
 *          {
 *          	resultcode, resultmsg, data : {records : [{accountID, userName, userRemark, userEmail, accountStatus}]}
 *          }
 * @return {NULL}
 */
Hualala.Global.addShopGroupChildAccount = function (params, cbFn) {};

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
Hualala.Global.updateRoleBinding = function (params, cbFn) {};

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
Hualala.Global.queryRoleBinding = function (params, cbFn) {};
