(function () {
	IX.ns("Test");
	var accountTpl = {
		defaultAccount : 1,
		settleUnitID : "6",
		settleUnitName : "豆捞坊北京公司",
		groupID : "5",
		shopCount : "13",
		settleIncomTotal : "232938.45",
		settleBalance : "41580.6",
		settleSpendingTotal : "191656.65",
		feeRatio : "0.0",
		isActiveAutoTransfer : "0",
		autoTransferDays : "30",
		timeAmountRship : "0",
		autoTransferMinAmount : "10000.0",
		isRemindAmount : "0",
		remindAmount : "0.0",
		poundageMinAmount : "10000.0",
		poundageAmount : "50.0",
		startDate : "20120810",
		lastTransferTime : "20140813102138",
		bankCode : "ICBC",
		bankAccount : "0200210209200002226",
		bankName : "北京大悦城支行",
		receiverType : "2",
		receiverName : "北京肥得捞餐饮管理有限公司",
		receiverLinkman : "李玲玲",
		receiverPhone : "010-66011760-610",
		receiverMobile : "18600908089",
		receiverEmail : "cw_dolarshop@126.com",
		remark : "",
		action : "1",
		actionTime : "20140822182920",
		createTime : " 20120806190323"
	};
	var accountHT = new IX.IListManager();
	var genAccountList = function (total) {
		var ret = [];
		var banks = Hualala.TypeDef.BankOptions;
		for (var i = 0; i < total; i++) {
			var bank = banks[Test.getRandom(0, banks.length - 1)];
			var account = IX.inherit(accountTpl, {
					defaultAccount : Test.getRandom(0, 10) > 5 ? 1 : 0,
					shopCount : Test.getRandom(0, 100),
					settleUnitID : IX.UUID.generate(),
					settleUnitName : $XP(accountTpl, 'settleUnitName') + Test.getRandom(0, 1000),
					settleIncomTotal : Test.getRandom(0, 10000000) / 100,
					settleBalance : Test.getRandom(0, 10000) / 100,
					bankCode : bank['value'],
					bankAccount : $XP(accountTpl, 'bankAccount').slice(0, -4) + Test.getRandom(0, 9000),
					bankName : bank['label'] + $XP(accountTpl, 'bankName'),
					receiverType : Test.getRandom(1, 2)
				});
			ret.push(account);
			accountHT.register($XP(account, 'settleUnitID'), account);
		}
		return ret;
	};
	genAccountList(15);
	Test.AccountList = accountHT.getAll();
	Test.getAccountBySettleUnitID = function (settleUnitID) {
		return accountHT.get(settleUnitID);
	};

	var accountTransDetailTpl = {
		SUATransItemID: "13980",
		action: "0",
		actionTime: "20140901152505",
		cardID: "0",
		createTime: "20140901152505",
		createType: "0",
		empInfo: "",
		empRemark: "",
		giftDetailItemID: "",
		groupID: "5",
		groupName: "豆捞坊",
		orderID: "1027372",
		orderKey: "5583904a-a5fc-4639-8b88-ffeecabcff5e",
		saveMoneySetID: "0",
		settleUnitID: "6",
		settleUnitName: "豆捞坊北京公司",
		shopID: "77877",
		shopName: "豆捞坊(东直门店)",
		shopOpratorInfo: "",
		transAfterBalance: "41838.15",
		transAmount: "0.5",
		transCloseTime: "0",
		transCreateTime: "20140901152459",
		transPoundage: "0.0",
		transPoundageRemark: "暂且免费",
		transSalesCommission: "0.05",
		transSalesCommissionRemark: "交易佣金比例为:0.10",
		transStatus: "1",
		transSuccessTime: "20140901152459",
		transType: "201"
	};
	var accountTransTotal = 50;
	var accountTransList = [];

	var genTransStatus = function () {
		var transStatus = Hualala.TypeDef.FSMTransStatus,
			len = transStatus.length;
		var r = Test.getRandom(1, len - 1);
		return transStatus[r]['value'];
	};
	var genTransType = function () {
		var transType = Hualala.TypeDef.FSMTransType,
			len = transType.length;
		var r = Test.getRandom(1, len - 1);
		return transType[r]['value'];
	};

	var genSUATransItemID = function (id, idx) {
		return parseInt(id) + idx;
	};

	var genTransCreateDate = function () {
		var date = new Date(),
			randomMiliSeconds = Test.getRandom(0, Hualala.Constants.SecondsOfWeek * 1000);
		var sec = (date.getTime() - randomMiliSeconds) / 1000;
		var d = Hualala.Date(sec).toText();
		// IX.Date.getDateByFormat(Hualala.Date(new Date().getTime() / 1000).toText(), 'yyyymmddHHMMss')
		return IX.Date.getDateByFormat(d, 'yyyymmddHHMMss');

	};

	var initAccountTransList = function () {
		for (var i = 0; i < accountTransTotal; i++) {
			var timeStr = genTransCreateDate();
			var transDetail = IX.inherit(accountTransDetailTpl, {
				SUATransItemID : genSUATransItemID($XP(accountTransDetailTpl, 'SUATransItemID', 0), i),
				actionTime : timeStr,
				createTime : timeStr,
				transCloseTime : "0",
				transCreateTime : timeStr,
				transSuccessTime : timeStr,
				transType : genTransType(),
				transStatus : genTransStatus()
			});
			accountTransList.push(transDetail);
		}
		accountTransList = IX.Array.sort(accountTransList, function (a, b) {
			var s1 = $XP(a, 'transCreateTime').replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6'),
				s2 = $XP(b, 'transCreateTime').replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
			s1 = IX.Date.getTimeTickInSec(s1);
			s2 = IX.Date.getTimeTickInSec(s2);
			return s1 - s1 > 0;
		});
	};
	initAccountTransList();


	Test.queryAccountTransDetail = function (params) {
		var pageNo = parseInt($XP(params, 'Page.pageNo', 1)),
			pageSize = parseInt($XP(params, 'Page.pageSize', 10)),
			transCreateBeginTime = $XP(params, 'transCreateBeginTime', ''),
			transCreateEndTime = $XP(params, 'transCreateEndTime', ''),
			settleUnitID = $XP(params, 'settleUnitID', ''),
			transStatus = $XP(params, 'transStatus', ''),
			transType = $XP(params, 'transType', ''),
			groupID = $XP(params, 'groupID', ''),
			minTransAmount = $XP(params, 'minTransAmount', ''),
			maxTransAmount = $XP(params, 'maxTransAmount', '');
		var result = null;
		var totalSize = accountTransList.length;
		if (!transCreateBeginTime && !transCreateEndTime && !transStatus && !transType && !minTransAmount && !maxTransAmount) {
			result = accountTransList;
		}
		if (transCreateBeginTime.length > 0) {
			var s = transCreateBeginTime.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
			s = IX.Date.getTimeTickInSec(s);
			result = _.filter(accountTransList, function (el) {
				var s1 = $XP(el, 'transCreateBeginTime').replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
				s1 = IX.Date.getTimeTickInSec(s1);
				return s1 >= s;
			});
		}
		if (transCreateEndTime.length > 0) {
			var s = transCreateEndTime.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
			s = IX.Date.getTimeTickInSec(s);
			result = _.filter(result, function (el) {
				var s1 = $XP(el, 'transCreateEndTime').replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
				s1 = IX.Date.getTimeTickInSec(s1);
				return s1 <= s;
			});
		}
		if (transStatus.length > 0) {
			result = _.filter(result, function (el) {
				return $XP(el, 'transStatus') == transStatus;
			});
		}
		if (transType.length > 0) {
			result = _.filter(result, function (el) {
				return $XP(el, 'transType') == transType;
			});
		}
		if (minTransAmount.length > 0) {
			result = _.filter(result, function (el) {
				return parseFloat($XP(el, 'minTransAmount', 0)) >= parseFloat(minTransAmount);
			});
		}
		if (maxTransAmount.length > 0) {
			result = _.filter(result, function (el) {
				return parseFloat($XP(el, 'maxTransAmount', 0)) >= parseFloat(maxTransAmount);
			});
		}
		totalSize = result.length;
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		result = _.filter(result, function (el, idx) {
			return idx <= end && idx >= start;
		});
		var pageCount = Math.ceil(totalSize / pageSize);
		return {
			pageCount : pageCount,
			pageNo : pageNo,
			pageSize : pageSize,
			totalSize : totalSize,
			records : _.map(result, function (el) {
				return IX.inherit(el, {
					settleUnitID : settleUnitID,
					groupID : groupID
				});
			})
		};
	};

































})();