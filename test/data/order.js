(function () {
	IX.ns("Test");
	var orderResultTpl = {
		"page" : {
			"pageCount": 1,
			"pageNo": 1,
			"pageSize": 10,
			"totalSize": 1
		},
		"count": "1",
		"foodAmount": "128.0",
		"giftAmountTotal": "0.00",
		"orderRefundAmount": "0.00",
		"orderRegAmount": "0.0",
		"orderTotal": "128.00",
		"orderAmount": "0.0",
		"shouldSettlementTotal": "0.0",
		"total": "0.00",
		"records" : []
	};
	var dishesHotResultTpl = {
		"page" : {
			"pageCount": 1,
			"pageNo": 1,
			"pageSize": 10,
			"totalSize": 1
		},
		"records" : []
	};
	var usersResultTpl = {
		"page" : {
			"pageCount": 1,
			"pageNo": 1,
			"pageSize": 10,
			"totalSize": 1
		},
		"records" : []
	};
	var orderDetailTpl = {
		"cardDiscountAmount": "0.00",
		"cityID": "1010",
		"discountAmount": "0.00",
		"foodAmount": "128.00",
		"freeAmount": "0.00",
		"giftAmount": "0.00",
		"isAlreadyPaid": "1",
		"moneyBalance": "0.00",
		"orderID": "1027482",
		"orderKey": "0272beaf-ef93-41ee-926a-0b5c92410f19",
		"orderPrnStr": "★※※※※※※※※※※※※※※★\n※　１４：４８　外送－已付款　※\n※　验证密码：　２９２３０７　※\n★※※※※※※※※※※※※※※★\n#订单号:【1027482】\n客户姓名:zm(先生)\n手机号码:18513403219\n送餐地址:五道口\n预计送达时间:2014.9.16  14:48\n订单备注:\n…………………………………………\n数量	价格	 品名\n…………………………………………\n※茶水类(1)\n 1 x   128.0  明前碧螺春（壶）/壶\n	   \n…………………………………………\n条目数:1\n菜品金额合计:128.0\n打包费合计:0.0\n送餐费:0.0\n…………………………………………\n网上实付金额:128.0(开票金额)\n…………………………………………\n提交时间:2014.9.16 13:58\n店名:豆捞坊(东直门店)\n",
		"orderRefundAmount": "0.00",
		"orderStatus": "20",
		"orderSubtype": "20",
		"orderTime": "201409161448",
		"orderTotal": "128.00",
		"orederAmount": "0",
		"pointBalance": "0.00",
		"serviceAmount": "0.00",
		"shopName": "豆捞坊(东直门店)",
		"shouldSettlementTotal": "0.00",
		"takeoutPackagingAmount": "0.00",
		"total": "0",
		"userMobile": "18513403219",
		"userName": "zm",
		"userSex": "1"
	};
	var orderDayDetailTpl = {
		"billDate": "20130912",
		"cityID": "1010",
		"count": "1",
		"foodAmount": "567.00",
		"giftAmountTotal": "360.00",
		"orderRefundAmount": "207.00",
		"orderRegAmount": "0.00",
		"orderTotal": "207.00",
		"orderWaitTotal": "0.00",
		"orderAmount": "0.00",
		"shopName": "豆捞坊(中关村店)",
		"total": "0.00"
	};
	var orderDuringDetailTpl = {
		"cityID": "1010",
		"count": "20",
		"foodAmount": "2302.38",
		"giftAmountTotal": "0.00",
		"groupID": "5",
		"orderRefundAmount": "1212.00",
		"orderRegAmount": "116.00",
		"orderTotal": "2110.38",
		"orderWaitTotal": "62.38",
		"orederAmount": "1094.38",
		"shopID": "77880",
		"shopName": "豆捞坊(君太店)",
		"total": "720.00"
	};
	var dishDetailTpl = {
		"foodCategoryName": "蒸锅档",
		"foodName": "五谷丰登",
		"foodRemark": "",
		"foodUnit": "份",
		"sumFoodAmount": "7.00",
		"sumMaster": "7",
		"sumPrice": "266.0000"
	};
	var userDetailTpl = {
		"foodAmount": "3176.00",
        "maxOrderTime": "201408141430",
		"minOrderTime": "201408011750",
		"sumRecord": "20",
		"userID": "3567703",
		"userLoginMobile": "18616653216",
		"userName": "test",
		"userSex": "1"
	};
	var genDate = function () {
		var date = new Date(),
			randomMiliSeconds = Test.getRandom(0, Hualala.Constants.SecondsOfWeek * 1000);
		var sec = parseInt((date.getTime() - randomMiliSeconds) / 1000);
		var d = Hualala.Date(sec).toText();
		// IX.Date.getDateByFormat(Hualala.Date(new Date().getTime() / 1000).toText(), 'yyyymmddHHMMss')
		return IX.Date.getDateByFormat(d, 'yyyyMMddHHmmss');

	};
	var orderHT = new IX.IListManager();
	var orderDayHT = new IX.IListManager();
	var orderDuringHT = new IX.IListManager();
	var dishHT = new IX.IListManager();
	var userHT = new IX.IListManager();
	var genOrderList = function (total) {
		var ret = [];
		
		for (var i = 0; i < total; i++) {
			var orderKey = IX.UUID.generate(),
				orderID = 1000000 + parseInt(Test.getRandom(0, 10000));
			var d = IX.inherit(orderDetailTpl, {
				orderID : orderID,
				orderKey : orderKey,
				orderTime : genDate()
			});
			orderHT.register(orderID, d);
			ret.push(d);
		}
		return ret;
	};
	var genOrderDayList = function (total) {
		var ret = [];
		var cityIDs = [1010,1021,1031,1041];
		for (var i = 0; i < total; i ++) {
			var billDate = genDate();
			var cityID = cityIDs[Test.getRandom(0, cityIDs.length - 1)];
			var d= IX.inherit(orderDayDetailTpl, {
				billDate : billDate,
				cityID : cityID
			});
			orderDayHT.register(billDate, d);
			ret.push(d);
		}
		return ret;
	};
	var genOrderDuringList = function (total) {
		var ret = [];
		var cityIDs = [1010,1021,1031,1041];
		for (var i = 0; i < total; i ++) {
			var cityID = cityIDs[Test.getRandom(0, cityIDs.length - 1)];
			var shopID = 70000 + parseInt(Test.getRandom(0, 9999));
			var shopName = "豆捞坊分店" + Test.getRandom(0, total);
			var d= IX.inherit(orderDuringDetailTpl, {
				shopID : shopID,
				shopName : shopName,
				cityID : cityID
			});
			orderDuringHT.register(shopID, d);
			ret.push(d);
		}
		return ret;
	};
	var genDishesHotList = function (total) {
		var ret = [];
		for (var i = 0; i < total; i ++) {
			var foodID = IX.UUID.generate();
			var foodCategoryName = "菜品分类(" + IX.id() + ")";
			var foodName = "菜品名称-"+IX.id();
			var d = IX.inherit(dishDetailTpl, {
				foodCategoryName : foodCategoryName,
				foodName : foodName
			});
			dishHT.register(foodID, d);
			ret.push(d);
		}
		return ret;
	};
	var genUsersList = function (total) {
		var ret = [];
		for (var i = 0; i < total; i ++) {
			var userID = IX.UUID.generate();
			var userName = "用户" + IX.id();
			var userSex = Test.getRandom(0,2);
			var d = IX.inherit(userDetailTpl, {
				userID : userID,
				userName : userName,
				userSex : userSex
			});
			userHT.register(userID, d);
			ret.push(d);
		}
		return ret;
	};
	genOrderList(Test.getRandom(0, 100));
	genOrderDayList(Test.getRandom(0, 20));
	genOrderDuringList(Test.getRandom(0, 20));
	genDishesHotList(Test.getRandom(0, 200));
	genUsersList(Test.getRandom(0, 200));
	Test.queryOrders = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15),
			pageCount = 0, totalSize = 0;
		var result = orderHT.getAll();
		var orderTotal = 0, count = result.length, foodAmount = 0;
		_.each(result, function (el) {
			orderTotal = Hualala.Common.Math.add(orderTotal, parseFloat($XP(el, 'orderTotal', 0)));
			foodAmount = Hualala.Common.Math.add(foodAmount, parseFloat($XP(el, 'foodAmount', 0)));
		});
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		totalSize = result.length;
		result = _.filter(result, function (el, idx) {
			return idx <= end && idx >= start
		});
		
		pageCount = Math.ceil(totalSize / pageSize);
		var res = IX.inherit(orderResultTpl, {
			page : {
				pageNo : pageNo,
				pageSize : pageSize,
				pageCount : pageCount,
				totalSize : totalSize
			},
			records : result,
			orderTotal : orderTotal,
			count : count,
			foodAmount : foodAmount
		});
		return res;
	};
	Test.queryDayOrders = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15),
			pageCount = 0, totalSize = 0;
		var result = orderDayHT.getAll();
		var orderTotal = 0, count = result.length, foodAmount = 0;
		_.each(result, function (el) {
			orderTotal = Hualala.Common.Math.add(orderTotal, parseFloat($XP(el, 'orderTotal', 0)));
			foodAmount = Hualala.Common.Math.add(foodAmount, parseFloat($XP(el, 'foodAmount', 0)));
		});
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		totalSize = result.length;
		pageCount = Math.ceil(totalSize / pageSize);
		result = _.filter(result, function (el, idx) {
			return idx <= end && idx >= start
		});
		
		var res = IX.inherit(orderResultTpl, {
			page : {
				pageNo : pageNo,
				pageSize : pageSize,
				pageCount : pageCount,
				totalSize : totalSize
			},
			records : result,
			orderTotal : orderTotal,
			count : count,
			foodAmount : foodAmount
		});
		return res;
	};
	Test.queryDuringOrders = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15),
			pageCount = 0, totalSize = 0;
		var result = orderDuringHT.getAll();
		var orderTotal = 0, count = result.length, foodAmount = 0;
		_.each(result, function (el) {
			orderTotal = Hualala.Common.Math.add(orderTotal, parseFloat($XP(el, 'orderTotal', 0)));
			foodAmount = Hualala.Common.Math.add(foodAmount, parseFloat($XP(el, 'foodAmount', 0)));
		});
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		totalSize = result.length;
		pageCount = Math.ceil(totalSize / pageSize);
		result = _.filter(result, function (el, idx) {
			return idx <= end && idx >= start
		});
		
		var res = IX.inherit(orderResultTpl, {
			page : {
				pageNo : pageNo,
				pageSize : pageSize,
				pageCount : pageCount,
				totalSize : totalSize
			},
			records : result,
			orderTotal : orderTotal,
			count : count,
			foodAmount : foodAmount
		});
		return res;
	};
	Test.queryDishesHot = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15),
			pageCount = 0, totalSize = 0;
		var result = dishHT.getAll();
		
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		totalSize = result.length;
		pageCount = Math.ceil(totalSize / pageSize);
		result = _.filter(result, function (el, idx) {
			return idx <= end && idx >= start
		});
		
		var res = IX.inherit(dishesHotResultTpl, {
			page : {
				pageNo : pageNo,
				pageSize : pageSize,
				pageCount : pageCount,
				totalSize : totalSize
			},
			records : result
		});
		return res;
	};
	Test.queryOrderUsers = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15),
			pageCount = 0, totalSize = 0;
		var result = userHT.getAll();
		
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		totalSize = result.length;
		pageCount = Math.ceil(totalSize / pageSize);
		result = _.filter(result, function (el, idx) {
			return idx <= end && idx >= start
		});
		
		var res = IX.inherit(usersResultTpl, {
			page : {
				pageNo : pageNo,
				pageSize : pageSize,
				pageCount : pageCount,
				totalSize : totalSize
			},
			records : result
		});
		return res;
	};
})();