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
        isOutcomeAcount : "1",
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
		createTime : " 20120806190323",
		py : "dou;lao;fang;bei;jing;fen;gong;si"
	};
	var accountHT = new IX.IListManager();
	var genAccountList = function (total) {
		var ret = [];
		var banks = Hualala.TypeDef.BankOptions;
		for (var i = 0; i < total; i++) {
			var bank = banks[Test.getRandom(0, banks.length - 1)];
			var settleBalance = Test.getRandom(0, 10000) / 100;
			var nameSurfix = Test.getRandom(0, 1000);
			var account = IX.inherit(accountTpl, {
					defaultAccount : Test.getRandom(0, 10) > 5 ? 1 : 0,
					shopCount : Test.getRandom(0, 100),
					settleUnitID : IX.UUID.generate(),
					settleUnitName : $XP(accountTpl, 'settleUnitName') + nameSurfix,
					settleIncomTotal : Test.getRandom(0, 10000000) / 100,
					settleBalance : Test.getRandom(0, 10) < 5 ? (-1 * settleBalance) : settleBalance,
					bankCode : bank['value'],
					bankAccount : $XP(accountTpl, 'bankAccount').slice(0, -4) + Test.getRandom(0, 9000),
					bankName : bank['label'] + $XP(accountTpl, 'bankName'),
					receiverType : Test.getRandom(1, 2),
					py : $XP(accountTpl, 'py') + ";" + nameSurfix
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
		var sec = parseInt((date.getTime() - randomMiliSeconds) / 1000);
		var d = Hualala.Date(sec).toText();
		// IX.Date.getDateByFormat(Hualala.Date(new Date().getTime() / 1000).toText(), 'yyyymmddHHMMss')
		return IX.Date.getDateByFormat(d, 'yyyyMMddHHmmss');

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
		var pageNo = parseInt($XP(params, 'pageNo', 1)),
			pageSize = parseInt($XP(params, 'pageSize', 10)),
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
				var s1 = $XP(el, 'transCreateTime').replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
				s1 = IX.Date.getTimeTickInSec(s1);
				return s1 >= s;
			});
		}
		if (transCreateEndTime.length > 0) {
			var s = transCreateEndTime.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
			s = IX.Date.getTimeTickInSec(s);
			result = _.filter(result, function (el) {
				var s1 = $XP(el, 'transCreateTime').replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
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
		// return {
		// 	pageCount : pageCount,
		// 	pageNo : pageNo,
		// 	pageSize : pageSize,
		// 	totalSize : totalSize,
		// 	records : _.map(result, function (el) {
		// 		return IX.inherit(el, {
		// 			settleUnitID : settleUnitID,
		// 			groupID : groupID
		// 		});
		// 	})
		// };
		return {
			page : {
				pageCount : pageCount,
				pageNo : pageNo,
				pageSize : pageSize,
				totalSize : totalSize
			},
			records : _.map(result, function (el) {
				return IX.inherit(el, {
					settleUnitID : settleUnitID,
					groupID : groupID
				});
			})
		};
	};

	Test.queryFsnCustomerDetail = {
		settleUnitDetail : [
			{
				settleUnitName : "北京财务部",
				settleUnitID : "123",
				transAfterBalance : 30,
				transAmount : 300,
				transSalesCommission : 5,
				transSalesCommissionRemark : "",
				transStatus : 1,
				transSuccessTime : "201407141830",
				transType : 105
			}
		],
		customerCard : [
			{
				saveCashTotal : 500,
				saveMoneyTotal : 500,
				moneyBalance : 600,
				cardNO : 1111100000111110000,
				customerMobile : 13311112222,
				customerName : "懂酒博"
			}
		]
	};

	Test.queryOrderPayDetail = {
		"data": {
			"SMSContent": "",
			"SMSSendCount": "0",
			"acceptTime": "20140910110609",
			"action": "1",
			"actionTime": "20140910115419",
			"assessmentItemID": "0",
			"assessmentTime": "0",
			"assessmentTotalValue": "4.00",
			"batchNo": "0",
			"cancelOrderCause": "",
			"cancelOrderTime": "0",
			"cardDiscountAmount": "0.00",
			"cardKey": "",
			"cardNO": "",
			"checkEndTime": "201409101456",
			"checkPWDCount": "1",
			"checkPWDTime": "20140910115418",
			"checkRemark": "",
			"checkStartTime": "201409100856",
			"chooseEndTime": "20140910110558",
			"chooseStartTime": "0",
			"cityID": "1010",
			"clientIP": "10.10.0.78",
			"clientType": "0",
			"companyName": "",
			"consumptionTypeName": "",
			"createTime": "20140910110540",
			"discountAmount": "0.00",
			"discountFoodAmount": "0.00",
			"discountScale": "1.00",
			"discountScope": "1",
			"foodAmount": "128.00",
			"foodCount": "1",
			"freeAmount": "0.00",
			"giftAmount": "0.00",
			"giftCount": "0",
			"giftName": "",
			"groupID": "5",
			"groupName": "",
			"inviteCode": "",
			"invoiceTitle": "",
			"isAlreadyPaid": "1",
			"isLock": "1",
			"isSettle": "0",
			"isVIPPrice": "0",
			"minAmount": "50.00",
			"moneyBalance": "0.00",
			"msgID": "0",
			"orderCheckPWD": "668726,3219",
			"orderCount": "21",
			"orderCreateTime": "20140910110540",
			"orderID": "1027433",
			"orderKey": "2afb924b-b2ed-4927-8334-018a575808a4",
			"orderParamsJson": "{\"20\":{\"advanceTime\":\"50\",\"freeServiceAmount\":\"100\",\"holidayFlag\":\"0\",\"minAmount\":\"50\",\"noticeTime\":\"0\",\"openDays\":\"30\",\"payMethod\":\"0\",\"serviceAmount\":\"10\",\"servicePeriods\":\"1000,0100\",\"takeawayDeliveryAgent\":\"自主配送\",\"takeawayDeliveryTime\":\"50\",\"takeawayScope\":\"3\",\"takeawayScopeDesc\":\"西直门内不给送\"},\"21\":{\"advanceTime\":\"1440\",\"checkOrderSMSTemplate\":\"您在${shopName}的到店自提订单${orderID}已备餐，请${orderTime}准时到店提取。餐厅电话：${shopTel}  【哗啦啦】\",\"freeServiceAmount\":\"0\",\"hasPackageFee\":\"1\",\"holidayFlag\":\"0\",\"minAmount\":\"40\",\"noticeTime\":\"0\",\"openDates\":\"20140122-20140128\",\"openDays\":90,\"passwordCheckTime\":\"120\",\"passwordValidTime\":\"120\",\"payMethod\":\"0\",\"paySuccessSMSTemplate\":\"您在${shopName}的${orderTime}年预订的到店自提订单${orderID}已提交。餐厅电话：${shopTel} ${orderWapURL} 【哗啦啦】\",\"serviceAmount\":\"0\",\"servicePeriods\":\"1100,0000\"},\"serviceFeatures\":\"commonreserve_order,takeaway_order,takeout_order,spot_pay,spot_order,justeat_order,\"}",
			"orderPrnStr": "★※※※※※※※※※※※※※※★\n※　１１：５６　外送－已付款　※\n※　验证密码：　６６８７２６　※\n★※※※※※※※※※※※※※※★\n#订单号:【1027433】\n客户姓名:zm(先生)\n手机号码:18513403219\n送餐地址:五道口\n预计送达时间:2014.9.10  11:56\n订单备注:\n…………………………………………\n数量	价格	 品名\n…………………………………………\n※茶水类(1)\n 1 x   128.0  明前碧螺春（壶）/壶\n…………………………………………\n条目数:1\n菜品金额合计:128.0\n打包费合计:0.0\n送餐费:0.0\n…………………………………………\n网上实付金额:128.0(开票金额)\n…………………………………………\n提交时间:2014.9.10 11:06\n店名:豆捞坊(东直门店)\n",
			"orderRefundAmount": "0.00",
			"orderRemark": "",
			"orderSettlementTotal": "115.20",
			"orderStatus": "40",
			"statusName" : "已消费",
			"orderSubmitTime": "0",
			"orderSubtype": "20",
			"orderTime": "201409101156",
			"orderTotal": "128.00",
			"orderType": "1",
			"pageCount": 0,
			"pageNo": 0,
			"pageSize": 0,
			"paidAmount": "0.00",
			"participantPerson": "1",
			"payEndTime": "201409101106",
			"payInterfaceAmount": "0.0",
			"payMethod": "0",
			"payStartTime": "0",
			"payVoucherRate": "30.000",
			"person": "2",
			"pointBalance": "0.00",
			"posCode": "",
			"posMsgAdvanceSendMinutes": "0",
			"posType": "2",
			"presentInfo": "",
			"promotionDesc": "",
			"promotionFlag": "0",
			"promotionRules": "",
			"promotionTotalAmount": "0.00",
			"records": [
				{
	                "IsWaitConfirmFoodNumber": "0",
	                "SFMUnitCode": "999999",
	                "action": "1",
	                "actionTime": "20150610154210",
	                "batchNo": "0",
	                "clientIP": "",
	                "createTime": "20150610154201",
	                "foodAmount": "1.00",
	                "foodCategoryID": "6539",
	                "foodCategoryName": "主食",
	                "foodCategorySortIndex": "2570",
	                "foodCode": "2010003",
	                "foodID": "122390",
	                "foodName": "天妇罗乌冬面",
	                "foodOrigPrice": "38.00",
	                "foodPFCategoryID": "6539",
	                "foodPFCategoryName": "主食",
	                "foodPrice": "38.00",
	                "foodRemark": "",
	                "foodSettlementPrice": "-1.00",
	                "foodSortIndex": "999999",
	                "foodUnit": "例",
	                "foodUnitID": "200380",
	                "foodUnitId": "200380",
	                "imagePath": "",
	                "isAutoAdd": "0",
	                "isCanRefund": "1",
	                "isComments": "1",
	                "isDiscount": "0",
	                "isSFDetail": "0",
	                "isSetFood": "0",
	                "itemID": "129510",
	                "minOrderCount": "1",
	                "orderID": "1253178",
	                "orderKey": "d5971c37-e3e9-43ea-bd78-80f52154d269",
	                "parentFoodID": "0",
	                "setFoodDetailJson": "",
	                "setFoodDetailLst": "",
	                "takeoutPackagingFee": "0.00",
	                "userName": "",
	                "vipPrice": "38.00"
	            },
				{
					"action": "0",
					"actionTime": "20140910110540",
					"batchNo": "0",
					"clientIP": "",
					"createTime": "20140910110540",
					"foodAmount": "1.00",
					"foodCategoryID": "3004",
					"foodCategoryName": "茶水类",
					"foodCategorySortIndex": "100",
					"foodCode": "102028",
					"foodID": "62330",
					"foodName": "明前碧螺春（壶）",
					"foodOrigPrice": "128.00",
					"foodPFCategoryID": "3004",
					"foodPFCategoryName": "茶水类",
					"foodPrice": "128.00",
					"foodRemark": "",
					"foodSettlementPrice": "-1.00",
					"foodSortIndex": "999999",
					"foodUnit": "壶",
					"foodUnitId": "132553",
					"imagePath": "",
					"isAutoAdd": "0",
					"isCanRefund": "1",
					"isComments": "1",
					"isDiscount": "0",
					"isSetFood": "0",
					"itemID": "106580",
					"minOrderCount": "1",
					"orderID": "1027433",
					"orderKey": "2afb924b-b2ed-4927-8334-018a575808a4",
					"parentFoodID": "0",
					"setFoodDetailJson": "",
					"setFoodDetailLst": "",
					"takeoutPackagingFee": "0.00",
					"userName": "",
					"vipPrice": "128.00"
				}
			],
			"returnPointRatio": "1.000",
			"returnRebate": "0.000",
			"returnVisitStatus": "0",
			"returnVoucher": "0",
			"revBeforTime": "0",
			"seoCode": "",
			"serviceAmount": "0.00",
			"settleID": "6",
			"shareImageUrl": "",
			"shopID": "77877",
			"shopName": "豆捞坊(东直门店)",
			"shopOrderFlowNo": "20140910-0001",
			"shopOrderKey": "137924",
			"shopPreType": "2",
			"shopPromotionInfo": "",
			"shopRefundAmount": "0.00",
			"shopServiceOptions": "",
			"shopTel": "010-84098371",
			"tableCount": "1",
			"tableID": "0",
			"tableName": "36",
			"takeoutAddress": "五道口",
			"takeoutDeliveryRemark": "",
			"takeoutDeliveryTime": "0",
			"takeoutDescribe": "",
			"takeoutPackagingAmount": "0.00",
			"timeID": "0",
			"timeName": "",
			"totalSize": 0,
			"userEmail": "",
			"userID": "3573205",
			"userKey": "2C18799058F5B545B00D45FABC498329",
			"userLoginMobile": "18513403219",
			"userMobile": "18513403219",
			"userName": "zm",
			"userSex": "1",
			"userTel": "",
			"vipDiscountFoodAmount": "0.00",
			"vipDiscountRange": "0",
			"vipDiscountRate": "1.00",
			"vipFoodAmount": "128.00"
		},
		"dataset0": {
			"pageCount": 0,
			"pageNo": 0,
			"pageSize": 0,
			"records": [
				{
					"action": "1",
					"actionTime": "20140910145619",
					"cardDiscountAmount": "0.0",
					"cardID": "0",
					"cardMoneyBalancePayAmount": "0.0",
					"cardPointBalancePayAmount": "0.0",
					"createTime": "20140910110604",
					"discountAmount": "0.0",
					"discountFoodAmount": "0.0",
					"foodAmount": "128.0",
					"freeAmount": "0.0",
					"giftAmount": "0.0",
					"giftsTime": "20140910145613",
					"insideCouponAmount": "0.0",
					"insideCreditBalanceAmount": "0.0",
					"insideFreeAmount": "0.0",
					"insideUserCashBalanceAmount": "128.0",
					"insideUserPointsAmount": "0.0",
					"insideUserReturnCashBalanceAmount": "0.0",
					"insideUserVoucherAmount": "0.0",
					"isGifts": "1",
					"itemID": "5392",
					"orderCount": "21",
					"orderID": "1027433",
					"orderKey": "2afb924b-b2ed-4927-8334-018a575808a4",
					"orderSettlementTotal": "0.0",
					"orderStatus": "40.0",
					"orderTime": "201409101156",
					"orderTotal": "128.0",
					"paidAmount": "0.0",
					"payInterfaceAmount": "0.0",
					"payStatus": "1",
					"promotionTotalAmount": "0.0",
					"refundAmount": "0.0",
					"refundCardMoneyBalancePayAmount": "0.0",
					"refundCardPointBalancePayAmount": "0.0",
					"refundCashBalanceAmount": "0.0",
					"refundCreditBalanceAmount": "0.0",
					"refundGiftAmount": "0.0",
					"refundPayInterfaceAmount": "0.0",
					"refundReturnCashBalanceAmount": "0.0",
					"refundVoucherAmount": "0.0",
					"returnPointRatio": "1.0",
					"returnRebate": "0.0",
					"returnVoucher": "0",
					"serviceAmount": "0.0",
					"shopCouponAmount": "0.0",
					"shopID": "77877",
					"shopName": "豆捞坊(东直门店)",
					"shopPreRules": "",
					"shopPreType": "2",
					"takeoutPackagingAmount": "0.0",
					"userID": "3573205",
					"userLoginMobile": "18513403219"
				}
			],
			"totalSize": 1
		},
		"processTime": "20140912091300243",
		"resultcode": "000",
		"resultmsg": ""
	};
	Test.AccountDailyReportData={
	    "data": {
	        "datasets": {
	            "sumData": {
	                "data": {
	                    "page": {
	                        "pageCount": 0,
	                        "pageNo": 0,
	                        "pageSize": 0,
	                        "totalSize": 0
	                    },
	                    "records": [
	                        {
	                            "cashAmtSum": "1111111.11",
	                            "orderAmtSum": "22222.00",
	                            "orderCancelAmtSum": "3330.03",
	                            "orderCntSum": "1111",
	                            "orderSettleAmtFinalSum": "55555.50",
	                            "orderSettleAmtSum": "444444.00",
	                            "saveMoneyAmtSum": "777.00",
	                            "saveMoneyCntSum": "666",
	                            "saveMoneyComAmtSum": "8.88",
	                            "saveMoneySettleAmtSum": "9999.09"
	                        }
	                    ]
	                }
	            }
	        },
	        "page": {
	            "pageCount": 23,
	            "pageNo": 1,
	            "pageSize": 15,
	            "totalSize": 339
	        },
	        "records": [
	              {
	                "cashAmt": "10.01",
	                "dt": "20121010",
	                "orderAmt": "222.00",
	                "orderCancelAmt": "333.00",
	                "orderCnt": "11",
	                "orderSettleAmt": "444.44",
	                "orderSettleAmtFinal": "555.50",
	                "saveMoneyAmt": "77.00",
	                "saveMoneyCnt": "66",
	                "saveMoneyComAmt": "0.88",
	                "saveMoneySettleAmt": "9.99"
	            }
	        ]
	    },
	    "resultcode": "000",
	    "resultmsg": ""
	};

    Test.PackageDetail = {
        "data": {
            "SMSContent": "",
            "SMSSendCount": "0",
            "acceptTime": "0",
            "action": "1",
            "actionTime": "20150804111903",
            "assessmentItemID": "0",
            "assessmentTime": "0",
            "assessmentTotalValue": "4.00",
            "bOrderStatusName": "待消费",
            "bShopRefundAmount": "0.00",
            "batchNo": "0",
            "cancelOrderCause": "",
            "cancelOrderTime": "0",
            "cardDiscountAmount": "4.00",
            "cardGiveMoneyAmount": "0.00",
            "cardKey": "62511",
            "cardNO": "15110274389",
            "cardSaveMoneyAmount": "0.00",
            "checkEndTime": "201508041459",
            "checkPWDCount": "0",
            "checkPWDTime": "0",
            "checkRemark": "",
            "checkStartTime": "201508040859",
            "chooseEndTime": "20150804111857",
            "chooseStartTime": "0",
            "cityID": "1010",
            "clientIP": "10.10.2.163",
            "clientType": "6",
            "companyName": "",
            "consumptionTypeName": "",
            "createTime": "20150804111843",
            "discountAmount": "0.00",
            "discountFoodAmount": "80.00",
            "discountScale": "1.00",
            "discountScope": "1",
            "foodAmount": "80.00",
            "foodCount": "4",
            "freeAmount": "0.00",
            "giftAmount": "0.00",
            "giftCount": "0",
            "giftName": "",
            "groupID": "6",
            "groupName": "",
            "inviteCode": "",
            "invoiceTitle": "",
            "isAlreadyPaid": "1",
            "isAlreadyPaidName": "线上付款",
            "isAutoRefundAmount": "0",
            "isLock": "1",
            "isSettle": "0",
            "isVIPPrice": "0",
            "mapLatitudeValue": "0.0",
            "mapLongitudeValue": "0.0",
            "minAmount": "0.00",
            "moneyBalance": "0.00",
            "msgID": "0",
            "orderCheckPWD": "278249,4389",
            "orderCount": "18",
            "orderCreateTime": "20150804111843",
            "orderID": "1254118",
            "orderKey": "02de5076-f9e8-4d42-a816-c7475c3242c9",
            "orderParamsJson": "{\"21\":{\"minAmount\":\"0\",\"advanceTime\":\"0\",\"adsID\":\"0\",\"serviceAmount\":\"\",\"freeServiceAmount\":\"\",\"holidayFlag\":\"0\",\"servicePeriods\":\"1030,2130\",\"noticeTime\":\"0\",\"foodUITemplate\":\"1\",\"payMethod\":\"2\"},\"20\":{\"minAmount\":\"0\",\"adsID\":\"0\",\"advanceTime\":\"0\",\"serviceAmount\":\"0\",\"freeServiceAmount\":\"0\",\"holidayFlag\":\"0\",\"servicePeriods\":\"1030,2130\",\"noticeTime\":\"0\",\"takeawayDeliveryTime\":\"40\",\"takeawayScope\":\"5\",\"foodUITemplate\":\"1\",\"payMethod\":\"2\"},\"serviceFeatures\":\",spot_order,commonreserve_order,justeat_order,takeaway_order,takeout_order,crm,bi,spot_pay,\",\"closeDates\":\"\"}",
            "orderPrnStr": "★※※※※※※※※※※※※※※★\n※　１１：５９　外送－已付款　※\n※　验证密码：　２７８２４９　※\n★※※※※※※※※※※※※※※★\n#订单号:【1254118】\n客户姓名:薛(先生)\n手机号码:15110274389\n送餐地址:地址\n预计送达时间:2015.8.4 11:59\n订单备注:\n…………………………………………\n数量 价格 品名\n…………………………………………\n※套餐(4)\n80.0 x 0.0 玉晶藕片\n\n \n 1 x 0.0 糖醋排骨\n\n \n 1 x 0.0 桂圆红枣汁\n\n \n 1 x 80.0 绿萝丸\n\n \n…………………………………………\n条目数:4\n菜品金额合计:80.0\n打包费合计:0.0\n送餐费:0.0\n…………………………………………\n会员卡优惠:-4.0\n会员积分抵扣:76.0\n网上实付金额:0.00(开票金额)\n…………………………………………\n本店促销说明:享受会员价,9.5折 (全部打折)\n…………………………………………\n提交时间:2015.8.4 11:19\n店名:云上仙歌\n",
            "orderRefundAmount": "0.00",
            "orderRemark": "",
            "orderSettlementTotal": "0.00",
            "orderStatus": "20",
            "orderStatusName": "待消费",
            "orderStatusType": "1",
            "orderSubmitTime": "0",
            "orderSubtype": "20",
            "orderTime": "201508041159",
            "orderTotal": "76.00",
            "orderType": "1",
            "page": {
                "pageCount": 0,
                "pageNo": 0,
                "pageSize": 0,
                "totalSize": 0
            },
            "paidAmount": "0.00",
            "participantPerson": "1",
            "payEndTime": "201508041119",
            "payMethod": "0",
            "payStartTime": "0",
            "payVoucherRate": "30.000",
            "person": "2",
            "pointBalance": "76.00",
            "posCode": "",
            "posMsgAdvanceSendMinutes": "0",
            "posType": "2",
            "presentInfo": "",
            "promotionDesc": "享受会员价,9.5折 (全部打折)",
            "promotionFlag": "0",
            "promotionRules": "",
            "promotionTotalAmount": "0.00",
            "records": [
                {
                    "IsWaitConfirmFoodNumber": "0",
                    "SFMUnitCode": "a6f0289a-22c9-4e2a-9943-cf58ea4e5a04",
                    "action": "0",
                    "actionTime": "20150804111857",
                    "batchNo": "0",
                    "clientIP": "",
                    "createTime": "20150804111857",
                    "foodAmount": "1.00",
                    "foodCategoryID": "8136",
                    "foodCategoryName": "套餐",
                    "foodCategorySortIndex": "6",
                    "foodCode": "",
                    "foodID": "143806",
                    "foodName": "绿萝丸",
                    "foodOrigPrice": "80.00",
                    "foodPFCategoryID": "8136",
                    "foodPFCategoryName": "套餐",
                    "foodPrice": "80.00",
                    "foodRemark": "",
                    "foodSettlementPrice": "-1.00",
                    "foodSortIndex": "999999",
                    "foodUnit": "套",
                    "foodUnitID": "224104",
                    "foodUnitId": "224104",
                    "imagePath": "",
                    "isAutoAdd": "0",
                    "isCanRefund": "1",
                    "isComments": "1",
                    "isDiscount": "1",
                    "isSFDetail": "0",
                    "isSetFood": "1",
                    "itemID": "135400",
                    "minOrderCount": "1",
                    "orderID": "1254118",
                    "orderKey": "02de5076-f9e8-4d42-a816-c7475c3242c9",
                    "parentFoodID": "0",
                    "setFoodDetailJson": "{\"foodLst\":[{\"foodCategoryName\":\"凉菜\",\"chooseCount\":\"1\",\"canSwitch\":\"0\",\"items\":[{\"foodKey\":\"f60fb2ef-d54e-4954-945e-2b33fce7cea5\",\"unitKey\":224096,\"foodName\":\"玉晶藕片\",\"price\":\"12\",\"unit\":\"份\",\"number\":\"1\",\"addPrice\":\"0\",\"selected\":1}]},{\"foodCategoryName\":\"热菜\",\"chooseCount\":\"1\",\"canSwitch\":\"0\",\"items\":[{\"foodKey\":\"475e16f0-da6a-42d2-8abb-ee3a685df1da\",\"unitKey\":224097,\"foodName\":\"糖醋排骨\",\"price\":\"50\",\"unit\":\"份\",\"number\":\"1\",\"addPrice\":\"0\",\"selected\":1}]},{\"foodCategoryName\":\"饮料\",\"chooseCount\":\"1\",\"canSwitch\":\"1\",\"items\":[{\"foodKey\":\"721db035-3ff4-4611-b025-d19a8fe1257e\",\"unitKey\":224100,\"foodName\":\"桂圆红枣汁\",\"price\":\"10\",\"unit\":\"杯\",\"number\":\"1\",\"addPrice\":\"0\",\"selected\":1},{\"foodKey\":\"9828d94a-90df-4136-a3b9-98d7f1ca2f57\",\"unitKey\":224105,\"foodName\":\"红豆煨酥皮\",\"price\":\"15\",\"unit\":\"盅\",\"number\":\"1\",\"addPrice\":\"0\",\"selected\":0}]}]}",
                    "setFoodDetailLst": "",
                    "takeoutPackagingFee": "0.00",
                    "userName": "",
                    "vipPrice": "76.00"
                },
                {
                    "IsWaitConfirmFoodNumber": "0",
                    "SFMUnitCode": "a6f0289a-22c9-4e2a-9943-cf58ea4e5a04",
                    "action": "0",
                    "actionTime": "20150804111857",
                    "batchNo": "0",
                    "clientIP": "",
                    "createTime": "20150804111857",
                    "foodAmount": "1.00",
                    "foodCategoryID": "8136",
                    "foodCategoryName": "套餐",
                    "foodCategorySortIndex": "6",
                    "foodCode": "",
                    "foodID": "143799",
                    "foodName": "玉晶藕片",
                    "foodOrigPrice": "0.00",
                    "foodPFCategoryID": "8136",
                    "foodPFCategoryName": "套餐",
                    "foodPrice": "0.00",
                    "foodRemark": "",
                    "foodSettlementPrice": "-1.00",
                    "foodSortIndex": "999999",
                    "foodUnit": "份",
                    "foodUnitID": "224096",
                    "foodUnitId": "224096",
                    "imagePath": "",
                    "isAutoAdd": "0",
                    "isCanRefund": "1",
                    "isComments": "1",
                    "isDiscount": "0",
                    "isSFDetail": "1",
                    "isSetFood": "1",
                    "itemID": "135401",
                    "minOrderCount": "1",
                    "orderID": "1254118",
                    "orderKey": "02de5076-f9e8-4d42-a816-c7475c3242c9",
                    "parentFoodID": "0",
                    "setFoodDetailJson": "",
                    "setFoodDetailLst": "",
                    "takeoutPackagingFee": "0.00",
                    "userName": "",
                    "vipPrice": "0.00"
                },
                {
                    "IsWaitConfirmFoodNumber": "0",
                    "SFMUnitCode": "a6f0289a-22c9-4e2a-9943-cf58ea4e5a04",
                    "action": "0",
                    "actionTime": "20150804111857",
                    "batchNo": "0",
                    "clientIP": "",
                    "createTime": "20150804111857",
                    "foodAmount": "1.00",
                    "foodCategoryID": "8136",
                    "foodCategoryName": "套餐",
                    "foodCategorySortIndex": "6",
                    "foodCode": "",
                    "foodID": "143800",
                    "foodName": "糖醋排骨",
                    "foodOrigPrice": "0.00",
                    "foodPFCategoryID": "8136",
                    "foodPFCategoryName": "套餐",
                    "foodPrice": "0.00",
                    "foodRemark": "",
                    "foodSettlementPrice": "-1.00",
                    "foodSortIndex": "999999",
                    "foodUnit": "份",
                    "foodUnitID": "224097",
                    "foodUnitId": "224097",
                    "imagePath": "",
                    "isAutoAdd": "0",
                    "isCanRefund": "1",
                    "isComments": "1",
                    "isDiscount": "0",
                    "isSFDetail": "1",
                    "isSetFood": "1",
                    "itemID": "135402",
                    "minOrderCount": "1",
                    "orderID": "1254118",
                    "orderKey": "02de5076-f9e8-4d42-a816-c7475c3242c9",
                    "parentFoodID": "0",
                    "setFoodDetailJson": "",
                    "setFoodDetailLst": "",
                    "takeoutPackagingFee": "0.00",
                    "userName": "",
                    "vipPrice": "0.00"
                },
                {
                    "IsWaitConfirmFoodNumber": "0",
                    "SFMUnitCode": "a6f0289a-22c9-4e2a-9943-cf58ea4e5a04",
                    "action": "0",
                    "actionTime": "20150804111857",
                    "batchNo": "0",
                    "clientIP": "",
                    "createTime": "20150804111857",
                    "foodAmount": "1.00",
                    "foodCategoryID": "8136",
                    "foodCategoryName": "套餐",
                    "foodCategorySortIndex": "6",
                    "foodCode": "",
                    "foodID": "143803",
                    "foodName": "桂圆红枣汁",
                    "foodOrigPrice": "0.00",
                    "foodPFCategoryID": "8136",
                    "foodPFCategoryName": "套餐",
                    "foodPrice": "0.00",
                    "foodRemark": "",
                    "foodSettlementPrice": "-1.00",
                    "foodSortIndex": "999999",
                    "foodUnit": "杯",
                    "foodUnitID": "224100",
                    "foodUnitId": "224100",
                    "imagePath": "",
                    "isAutoAdd": "0",
                    "isCanRefund": "1",
                    "isComments": "1",
                    "isDiscount": "0",
                    "isSFDetail": "1",
                    "isSetFood": "1",
                    "itemID": "135403",
                    "minOrderCount": "1",
                    "orderID": "1254118",
                    "orderKey": "02de5076-f9e8-4d42-a816-c7475c3242c9",
                    "parentFoodID": "0",
                    "setFoodDetailJson": "",
                    "setFoodDetailLst": "",
                    "takeoutPackagingFee": "0.00",
                    "userName": "",
                    "vipPrice": "0.00"
                }
            ],
            "returnPointRatio": "0.000",
            "returnRebate": "0.000",
            "returnVisitStatus": "0",
            "returnVoucher": "0",
            "revBeforTime": "0",
            "seoCode": "",
            "serviceAmount": "0.00",
            "settleID": "3",
            "shareImageUrl": "",
            "shopID": "76022750",
            "shopName": "云上仙歌",
            "shopOrderFlowNo": "",
            "shopOrderKey": "",
            "shopPreType": "3",
            "shopPromotionInfo": "",
            "shopRefundAmount": "0.00",
            "shopServiceOptions": "",
            "shopTel": "010-61111111",
            "tableCount": "1",
            "tableID": "0",
            "tableName": "",
            "takeoutAddress": "地址",
            "takeoutConfirmRemark": "",
            "takeoutConfirmTime": "0",
            "takeoutConfirmType": "0",
            "takeoutDeliveryRemark": "",
            "takeoutDeliveryTime": "0",
            "takeoutDescribe": "",
            "takeoutPackagingAmount": "0.00",
            "timeID": "2",
            "timeName": "午餐",
            "userEmail": "",
            "userID": "3573639",
            "userKey": "50:o5-aSuH_TeL0-NxE5pg8tFYmofyM",
            "userLoginMobile": "15110274389",
            "userMobile": "15110274389",
            "userName": "薛",
            "userSex": "1",
            "userTel": "",
            "vipDiscountFoodAmount": "76.00",
            "vipDiscountRange": "1",
            "vipDiscountRate": "0.95",
            "vipFoodAmount": "76.00"
        },
        "resultcode": "000",
        "resultmsg": ""
    };

    Test.RechargeOrder = {
        "data":{
            "action":"0",
            "actionTime":"0",
            "createTime":"20150820173820",
            "groupID":"1",
            "groupName":"你好",
            "interfaceTransWay":"51",
            "orderKey":"11a91e7c-ac12-471e-a216-c96de28c497f",
            "orderStatus":"10",
            "orderTime":"20150820173820",
            "orderTotal":"0.01",
            "orderType":"1",
            "page":{
                "pageCount":0,
                "pageNo":0,
                "pageSize":0,
                "totalSize":0
            },
            "paySuccessTime":"0",
            "qrCodeUrl":"http://www.baidu.com",
            "refundAmount":"0.00",
            "settleOrderID":"5",
            "settleUnitID":"12",
            "sourceSettleUnitID":"0"
        },
        "resultcode":"000",
        "resultmsg":"生成订单成功"
    };
    Test.AccountOrderData =	{
    "data": {
        "groupID": "1",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "action": "1",
                "actionTime": "20150821141058",
                "createTime": "20150821111729",
                "groupID": "1",
                "groupName": "你好要",
                "interfaceTransNo": "SH891335960821111729",
                "interfaceTransWay": "50",
                "orderKey": "493c3c0f-270b-4e94-b465-2c850177f51a",
                "orderStatus": "20",
                "orderTime": "20150821111729",
                "orderTotal": "999.00",
                "orderType": "1",
                "paySuccessTime": "0",
                "refundAmount": "0.00",
                "settleOrderID": "8",
                "settleUnitID": "1",
                "sourceSettleUnitID": "0"
            },
            {
                "action": "0",
                "actionTime": "0",
                "createTime": "20150820180132",
                "groupID": "1",
                "groupName": "你好",
                "interfaceTransWay": "0",
                "orderKey": "bd5b548b-bd47-4441-89a7-8a4ff99679e0",
                "orderStatus": "10",
                "orderTime": "20150820180132",
                "orderTotal": "0.00",
                "orderType": "1",
                "paySuccessTime": "0",
                "refundAmount": "0.00",
                "settleOrderID": "7",
                "settleUnitID": "12",
                "sourceSettleUnitID": "0"
            },
            {
                "action": "0",
                "actionTime": "0",
                "createTime": "20150820175246",
                "groupID": "1",
                "groupName": "你好",
                "interfaceTransWay": "0",
                "orderKey": "7f895737-7f7a-43df-8260-b6d5f02b6ba7",
                "orderStatus": "10",
                "orderTime": "20150820175246",
                "orderTotal": "0.00",
                "orderType": "1",
                "paySuccessTime": "0",
                "refundAmount": "0.00",
                "settleOrderID": "6",
                "settleUnitID": "12",
                "sourceSettleUnitID": "0"
            },
            {
                "action": "0",
                "actionTime": "0",
                "createTime": "20150820173820",
                "groupID": "1",
                "groupName": "你好",
                "interfaceTransWay": "0",
                "orderKey": "11a91e7c-ac12-471e-a216-c96de28c497f",
                "orderStatus": "10",
                "orderTime": "20150820173820",
                "orderTotal": "0.00",
                "orderType": "1",
                "paySuccessTime": "0",
                "refundAmount": "0.00",
                "settleOrderID": "5",
                "settleUnitID": "12",
                "sourceSettleUnitID": "0"
            },
            {
                "action": "1",
                "actionTime": "20150821111304",
                "createTime": "20150820165732",
                "groupID": "1",
                "groupName": "你好",
                "interfaceTransWay": "0",
                "orderKey": "a7f496e4-ed6d-4b19-8a01-c892d7663d93",
                "orderStatus": "40",
                "orderTime": "20150820165732",
                "orderTotal": "0.00",
                "orderType": "1",
                "paySuccessTime": "0",
                "refundAmount": "0.00",
                "settleOrderID": "1",
                "settleUnitID": "12",
                "sourceSettleUnitID": "0"
            }
        ],
        "serviceName": "fsm_settleOrderQuery"
    },
    "resultcode": "000",
    "resultmsg": ""
};
	
































})();