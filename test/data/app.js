(function () {
	IX.ns("Test");
	var getRandom = function (n, m) {
		var c = m - n + 1;
		return Math.floor(Math.random() * c + n);
	};
	Test.SiteData = {
		groupName : "豆捞坊",
		groupID : "5"
	};
	Test.LoginUser = {
		role : ['admin'],
		groupID : "5",
		accountID : '12',
		groupLoginName : 'doulaofang',
		loginName : "temp_007",
		userEmail: "dongjiubo@11.com",
		userMobile: "13122222222",
		mobileBinded : 1,
		userName: "董九博",
		userRemark: "董九博店小二",
		lastLoginTime : "0",
		loginCount : 2
	};
	Test.Roles = [
		// {id : 1, name : "店长", sortIndex : 5, roleType : 'oneshop'},
		// {id : 2, name : "财务", sortIndex : 4, roleType : 'account'},
		// {id : 3, name : "区域经理", sortIndex : 3, roleType : 'multishop'},
		// {id : 4, name : "集团经理", sortIndex : 2, roleType : 'all'},
		// {id : 5, name : "系统管理员", sortIndex : 1, roleType : 'all'}
		{id : 1, name : "店长", sortIndex : 5, roleType : 'manager', "operationScope" : "single-shop"},
		{id : 2, name : "财务", sortIndex : 4, roleType : 'finance', "operationScope" : "settle"},
		{id : 3, name : "区域经理", sortIndex : 3, roleType : 'area-manager', "operationScope" : "multi-shop"},
		{id : 4, name : "集团经理", sortIndex : 2, roleType : 'general'},
		{id : 5, name : "系统管理员", sortIndex : 1, roleType : 'admin'}
	];
	Test.UserRight = [
		// manager
		// {name : 'shop', url : '/#shop', disabled : ['createShop']},
		// {name : 'setting', url : '/#setting', disabled : ['bindSettle']},
		// {name : 'order', url : '/#order'},
		// {name : 'pcclient', url : '/#download'},
		// {name : 'about', url : '/#about'},
		// {name : 'contact', url : '/#contact'}
		// finance
		// {name : 'account', url : '/#account', disabled : ['createAccount']},
		// {name : 'order', url : '/#order'},
		// {name : 'pcclient', url : '/#download'},
		// {name : 'about', url : '/#about'},
		// {name : 'contact', url : '/#contact'}
		// area-manager
		// {name : 'shop', url : '/#shop'},
		// {name : 'setting', url : '/#setting'},
		// {name : 'order', url : '/#order'},
		// {name : 'pcclient', url : '/#download'},
		// {name : 'about', url : '/#about'},
		// {name : 'contact', url : '/#contact'}
		// general
		// {name : 'shop', url : '/#shop'},
		// {name : 'setting', url : '/#setting'},
		// {name : 'account', url : '/#account'},
		// {name : 'order', url : '/#order'},
		// {name : 'user', url : '/#user'},
		// {name : 'pcclient', url : '/#download'},
		// {name : 'about', url : '/#about'},
		// {name : 'contact', url : '/#contact'}
		// admin
		{name : 'shop', url : '/#shop'},
		{name : 'setting', url : '/#setting'},
		{name : 'account', url : '/#account'},
		{name : 'order', url : '/#order'},
		{name : 'user', url : '/#user'},
		{name : 'pcclient', url : '/#download'},
		{name : 'about', url : '/#about'},
		{name : 'contact', url : '/#contact'}

	];
	Test.PCClient = {
		downloadClientAddress : '/pcclient/download/1.0.1-release.zip',
		version : '1.0.1'
	};
	Test.getRandom = getRandom;
})();