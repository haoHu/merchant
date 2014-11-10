(function () {
	IX.ns("Test");
	var BaseUsers = [
		{
			loginName : "lvbu", userEmail : "lvbu@sanguo.com", userName : "吕布", userRemark : "吕布的赤兔马早晚是关羽的", py : "lv;bu;lb"
		},
		{
			loginName : "guanyu", userEmail : "guanyu@sanguo.com", userName : "关羽", userRemark : "关羽的《春秋》永远读不完", py : "guan;yu;gy"
		},
		{
			loginName : "zhangfei", userEmail : "zhangfei@sanguo.com", userName : "张飞", userRemark : "一夫当关，万夫莫开", py : "zhang;fei;zhf"
		},
		{
			loginName : "liubei", userEmail : "liubei@sanguo.com", userName : "刘备", userRemark : "刘备的鳄鱼眼泪，永远掉不完", py : "liu;bei;lb"
		},
		{
			loginName : "zhugeliang", userEmail : "zhugeliang@sanguo.com", userName : "诸葛亮", userRemark : "出师未捷，身先死", py : "zhu;ge;liang;zhgl"
		},
		{
			loginName : "zhouyu", userEmail : "zhouyu@sanguo.com", userName : "周瑜", userRemark : "小肚鸡肠的聪明鬼", py : "zhou;yu;zhy"
		},
		{
			loginName : "sunquan", userEmail : "sunquan@sanguo.com", userName : "孙权", userRemark : "浪荡骚年，富二代", py : "sun;quan;sq"
		},
		{
			loginName : "zhaoyun", userEmail : "zhaoyun@sanguo.com", userName : "赵云", userRemark : "常胜将军，赵子龙", py : "zhao;yun;zhy"
		},
		{
			loginName : "caocao", userEmail : "caocao@sanguo.com", userName : "曹操", userRemark : "喜欢人妻的重口味宰相", py : "cao;cao;cc"
		},
		{
			loginName : "simayi", userEmail : "simayi@sanguo.com", userName : "司马懿", userRemark : "隐忍一辈子，最后也没坐上皇帝", py : "si;ma;yi;smy"
		}
	];
	var userTpl = {
		// 账号ID
		accountID : "1",
		// 账号状态
		accountStatus : 1,
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
		mobileBinded : 1,
		// 账号姓名
		userName : "吕布",
		// 账号备注
		userRemark : "吕布的赤兔马早晚是关羽的",
		// 拼音字段
		py : "lv;bu;lb"
	};
	// 获取账号绑定的配置信息
	Test.getRoles = function (roleType) {
		var shops = Test.querySchema.shops || [],
			accounts = Test.AccountList;
		var c1 = shops.length, c2 = accounts.length;
		var tmp = null, c = 0, ret = null;
		switch(roleType) {
			case "manager":
				c = 1; tmp = shops;
				var t = tmp[Test.getRandom(0, c1 - 1)]; 
				// ret = [{itemID : $XP(t, 'shopID', ''), itemName : $XP(t, 'shopName', '')}];
				ret = [$XP(t, 'shopID', '')];
				break;
			case "finance":
				c = 3;
				tmp = accounts; ret = [];
				var start = Test.getRandom(0, c2 - 1), end = (start + 3) > c2 ? c2 : (start + 3);
				for (var i = start; i < end; i++) {
					// ret.push({
					// 	itemID : $XP(tmp[i], 'settleUnitID', ''),
					// 	itemName : $XP(tmp[i], 'settleUnitName', '')
					// });
					ret.push($XP(tmp[i], 'settleUnitID', ''));
				}
				break;
			case "area-manager":
				c = 3;
				tmp = shops; ret = [];
				var start = Test.getRandom(0, c1 - 1), end = (start + 3) > c1 ? c1 : (start + 3);
				for (var i = start; i < end; i++) {
					// ret.push({
					// 	itemID : $XP(tmp[i], 'shopID', ''),
					// 	itemName : $XP(tmp[i], 'shopName', '')
					// });
					ret.push($XP(tmp[i], 'shopID', ''));
				}
				break;
			case "general":
			case "admin":
				break;
		}
		// return _.filter(ret, function (el) {return el.itemID.length > 0});
		return ret;
	};
	var userHT = new IX.IListManager();
	var genUserList = function (total) {
		var ret = [];
		for (var i = 0; i < total; i++) {
			var t = parseInt(i / 10), d = i % 10, baseUser = BaseUsers[d],
				accountID = IX.id().replace("ix", "");
			
			var roleTypes = Hualala.TypeDef.SiteRoleType;
			var roles = _.map(roleTypes, function (role) {
				var id = $XP(role, 'id'), name = $XP(role, 'name', ''), roleType = $XP(role, 'roleType', '');
				return {
					id : id, name : name, type : roleType,
					params : Test.getRoles(roleType)

				}

			});
			var roles = _.map(roleTypes, function (role) {
				var roleType = $XP(role, 'roleType', '');
				return roleType;
			});
			var u = IX.inherit(userTpl, baseUser, {
				accountID : accountID,
				accountStatus : Test.getRandom(0, 1),
				mobileBinded : Test.getRandom(0, 1),
				loginName : baseUser['loginName'] + '_' + t,
				// roles : roles
				roleType : roles.join(',')
			});
			ret.push(u);
			userHT.register(accountID, u);
		}
		return ret;
	};
	genUserList(30);
	Test.UserList = userHT.getAll();

	Test.getUserRolesBinding = function (accountID) {
		var user = userHT.get(accountID);
		var roleTypes = $XP(user, 'roleType', '').split(',');
		var roles = _.map(roleTypes, function (roleType) {
			return {
				type : roleType,
				items : Test.getRoles(roleType)
			};
		});
		return roles;
	};
	
})();