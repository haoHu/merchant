/*
	数据结构的定义文档
*/
// 商户中心的Session Data
var $$APPData = {
	site : $$Site,
	user : $$LoginUser,
	roles : $$Roles,
	pcClient : $$PCClient,
	userRight : $$UserRight
};

// 商户中心角色定义
// name:角色名称，id:角色ID,sortIndex:角色顺序，roleType : 角色类型
var $$Role = {name, id, sortIndex, roleType};
var $$Roles = [$$Role, $$Role,...];
// 商户基本信息定义
var $$Site = {groupName, groupID};
// 登录用户信息
var $$LoginUser = {
	role : ['roleID', 'roleID',...],
	groupID : "集团ID",
	groupLoginName : '集团主账号',
	loginName : "集团子账号",
	userEmail: "登录用户电子邮箱",
	userMobile: "登录用户手机号",
	userName: "登录用户姓名",
	userRemark: "登录用户备注",
	lastLoginTime : "登录用户上次登录时间"
};
// pcClient
var $$PCClient = {
	downloadClientAddress : 'pc客户端下载地址',
	version : 'pc客户端版本号'
};
// 用户权限
var $$UserRight = [
	{name : '权限名称', url : '允许使用的路由（/shop）'},...
];