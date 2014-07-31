(function () {
	IX.ns("Test");
	Test.SiteData = {
		groupName : "豆捞坊",
		groupID : "5"
	};
	Test.LoginUser = {
		role : [1, 2],
		groupID : "5",
		groupLoginName : 'doulaofang',
		loginName : "temp1",
		userEmail: "dongjiubo@11.com",
		userMobile: "13122222222",
		userName: "董九博",
		userRemark: "董九博店小二",
		lastLoginTime : "0"
	};
	Test.Roles = [
		{id : 1, name : "店长", sortIndex : 5, roleType : 'oneshop'},
		{id : 2, name : "财务", sortIndex : 4, roleType : 'account'},
		{id : 3, name : "区域经理", sortIndex : 3, roleType : 'multishop'},
		{id : 4, name : "集团经理", sortIndex : 2, roleType : 'all'},
		{id : 5, name : "系统管理员", sortIndex : 1, roleType : 'all'}
	];
	Test.UserRight = [
		{name : '', url : '/shop'},
		{name : '', url : '/shop/create'},
		{name : '', url : '/shop/delete'}
	];
	Test.PCClient = {
		downloadClientAddress : '/pcclient/download/1.0.1-release.zip',
		version : '1.0.1'
	};
})();