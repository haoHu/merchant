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
})();