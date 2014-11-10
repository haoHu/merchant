/*商户中心用户数据定义*/

var $$User = {
	// 账号ID
	accountID : "1",
	// 账号状态
	accountStatus : 1, //0:停用；1:正常；2:失效
	action : "1",
	actionTime : "20140116131125",
	createTime : "20120730090027",
	// 集团ID
	groupID : "5",
	// 最近登录时间
	lastLoginTime : "20141026180000",
	// 登录次数
	loginCount : 12,
	// 登录主账号
	groupLoginName : "doulaofang",
	// 登录子账号
	loginName : "lvbu",
	// 账号邮箱
	userEmail : "lvbu@sanguo.com",
	// 账号绑定手机
	userMobile : "13322222222",
	// 手机绑定状态
	mobileBinded : 1,	//0:未绑定；1:已绑定
	// 账号姓名
	userName : "吕布",
	// 账号备注
	userRemark : "吕布的赤兔马早晚是关羽的",
	// 拼音字段
	py : "lv;bu;lb",
	roleType : [$RoleType,....]
};

var $RoleType = "角色类型";

// 角色/权限配置信息
var $$BaseRoleInfo = {
	id,
	name,
	type,
	items : [$$RoleBindInfo,...]
};
// 角色绑定数据内容
var $$RoleBindInfo = {
	itemID : [店铺ID|结算账户ID],
	itemName : [店铺名称|结算账户名称]
};

var $$RoleBinding = [
	{
		type : $RoleType, id : "[roleID]",
		items : [
			{itemID: "[shopID|settleUnitID]", itemName : "[shopName|settleUnitName]"},
			...
		]
	},
	....
 
];