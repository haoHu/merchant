	(function () {
	IX.ns("Test");

	var GiftItemTpl = {
		action : 1,
		actionTime : '20140711154151',
		auditAdvice : '111',
		auditBy : "",
		auditStatus : 2,
		auditTIme : "20140711154151",
		createBy : '{"userID":"5", "loginName" : "doulaofang", "userName" : "doulaofang", "userEmail" : "", "userMobile" : "19500002222"}',
		createTime : "20140711154151",
		egiftEffectTimeHours : 0,
		foodScope : 0,
		giftImagePath : "",
		giftItemID : 160,
		giftName : "豆捞坊50元电子代金券",
		giftRemark : "支持线下，满120元可使用1张",
		giftTotalCount : 0,
		giftType : 10,
		giftValue : 50,
		groupID : 5,
		groupName : "豆捞坊",
		"isHolidaysUsing": "0",
        "isOfflineCanUsing": "0",
        "isPointsChange": "0",
        "isSameTimeUsing": "0",
        "moenyLimitValue": "100",
        "moneyLimitType": "0",
        "needPoints": "0",
        "sendTotalCount": "0",
        "supportOrderType": "2",
        "transName": "【多城市通用】",
        "usingCityIDs": "1010;1021;1022",
        "usingTimeType": "1,2,3,4,5",
        "validityDays": "30",
        "giftRules" : ""
	};

	var EventItemTpl = {
		"EGfitValidUntilDayCount_1":"30",
		"EGfitValidUntilDayCount_2":"30",
		"EGfitValidUntilDayCount_3":"30",
		"EGiftEffectTimeHours_1":"0",
		"EGiftEffectTimeHours_2":"0",
		"EGiftEffectTimeHours_3":"0",
		"EGiftID_1":"0",
		"EGiftID_2":"0",
		"EGiftID_3":"0",
		"EGiftName_1":"",
		"EGiftName_2":"",
		"EGiftName_3":"",
		"EGiftOdds_1":"0.0000",
		"EGiftOdds_2":"0.0000",
		"EGiftOdds_3":"0.0000",
		"EGiftSendCount_1":"0",
		"EGiftSendCount_2":"0",
		"EGiftSendCount_3":"0",
		"EGiftSingleCount_1":"1",
		"EGiftSingleCount_2":"1",
		"EGiftSingleCount_3":"1",
		"EGiftTotalCount_1":"0",
		"EGiftTotalCount_2":"0",
		"EGiftTotalCount_3":"0",
		"action":"0",
		"actionTime":"20150121175201",
		"cardLevelID":"-1",
		"countCycleDays":"0",
		"createTime":"20150121175201",
		"deductPoints":"0.00",
		"eventEndDate":"20150121",
		"eventID":"235",
		"eventImagePath":"",
		"eventName":"3333",
		"eventRemark":"2344",
		"eventStartDate":"20150121",
		"eventWay":"20",
		"groupID":"5",
		"isActive":"0",
		"isVipBirthdayMonth":"0",
		"maxPartInPerson":"0",
		"operator":"",
		"partInTimes":"0",
		"sendPoints":"0.00",
		"userCount":"0",
		"viewCount":"0",
		"winType":"0"
	};

	var totalCount = 100;

	var giftRecords = (function (total) {
		var giftTypes = _.filter(Hualala.TypeDef.MCMDataSet.GiftTypes, function (el) {return !IX.isEmpty(el.value);});
		var ret = [];
		for (var i = 0; i < total; i++) {
			var gift = IX.inherit(GiftItemTpl, {
				giftItemID : IX.id().replaceAll('ix', ''),
				giftType : $XP(giftTypes[i % 3], 'value', 10),
				giftName : $XP(GiftItemTpl, 'groupName') + $XP(GiftItemTpl, 'giftValue', 0) + $XP(giftTypes[i % 3], 'label', '')
			});
			ret[i] = gift;
		}
		return ret;
	})(totalCount);

	var eventRecords = (function (total) {
		var eventTypes = _.filter(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {return !IX.isEmpty(el.value);});
		var ret = [];
		for (var i = 0; i < total; i++) {
			var evt = IX.inherit(EventItemTpl, {
				eventID : IX.id().replaceAll('ix', ''),
				eventWay : $XP(eventTypes[i % 6], 'value', 20),
				eventName : '集团' + $XP(EventItemTpl, 'groupID', '') + $XP(eventTypes[i % 6], 'label', '')
			});
			ret[i] = evt;
		}
		return ret;
	})(totalCount);

	var getGiftList = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15);
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		var gifts = _.filter(giftRecords, function (el, idx) {
			return idx >= start && idx <= end;
		});
		return {
			pageCount : Math.ceil(totalCount / pageSize),
			pageNo : pageNo,
			pageSize : pageSize,
			totalSize : totalCount,
			records : gifts	
		};
	};

	var getEventList = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 15);
		var start = (pageNo - 1) * pageSize,
			end = pageNo * pageSize - 1;
		var events = _.filter(eventRecords, function (el, idx) {
			return idx >= start && idx <= end;
		});
		return {
			pageCount : Math.ceil(totalCount / pageSize),
			pageNo : pageNo,
			pageSize : pageSize,
			totalSize : totalCount,
			records : events	
		};
	};

	var getEventDataByID = function (params) {
		var eventID = $XP(params, 'eventID');
		if (IX.isEmpty(eventID)) {
			var d = _.find(eventRecords, function (el, idx) {
				return $XP(el, 'eventWay') == $XP(params, 'eventWay');
			});
			return IX.inherit(d, params, {
				eventID : IX.id().replaceAll('ix', '')
			});
		}
		var eventData = _.find(eventRecords, function (el, idx) {
			return $XP(el, 'eventID') == eventID;
		});
		return eventData;
	};

	var  getGiftDataByID = function (params) {
		var giftItemID = $XP(params, 'giftItemID');
		var giftData = _.find(giftRecords, function (el, idx) {
			return $XP(el, 'giftItemID') == giftItemID;
		});
		return giftData;
	};

	var getGiftDataset = function () {
		var getways = _.reject(Hualala.TypeDef.MCMDataSet.GiftDistributeTypes, function (el) {
			return IX.isEmpty(el.value) || !el.include;
		});
		var giftStatus = _.reject(Hualala.TypeDef.MCMDataSet.GiftStatus, function (el) {
			return IX.isEmpty(el.value);
		});
		var records = _.map(giftStatus, function (el) {
			var giftstatus = $XP(el, 'value');
			var totalCount = 0;
			var ret = {
				giftstatus : giftstatus
			};
			_.each(getways , function (item) {
				var key = 'sum_' + $XP(item, 'value'),
					count = Test.getRandom(1, 100);
				ret[key] = count;
				totalCount += count;
			});
			return IX.inherit(ret, {
				totalCount : totalCount
			});
		});
		var total = {};
		var totalval = 0;
		_.each(getways, function (item) {
			var key = 'count_' + $XP(item, 'value'),
				count = 0;
			_.each(records, function (el) {
				var v = $XP(el, 'sum_' + $XP(item, 'value'));
				count += v;
			});
			total[key] = count;
			totalval += count;
		});
		total = IX.inherit(total, {
			totalCount : totalval
		});
		return {
			myGiftDataset : {
				data : {
					records : records,
					total : total
				}
			}
		};
	};

	var getGiftGetWayData = function (params) {
		var giftTpl = {
			createTime: "20141105143232",
			eventItemID: "0",
			foodScope: "0",
			getRemark: "",
			getWay: "70",
			giftGroupTempPWD: "",
			giftItemID: "277",
			giftName: "豆捞坊10元电子代金券",
			giftPWD: "042100274965",
			giftStatus: "3",
			giftTransStatus: "0",
			giftType: "10",
			giftValue: "10.00",
			groupID: "5",
			groupName: "豆捞坊",
			isHolidaysUsing: "0",
			isOfflineCanUsing: "1",
			isSameTimeUsing: "0",
			itemID: "203720",
			moenyLimitValue: "100",
			moneyLimitType: "0",
			recirculable: "0",
			recirculeTimes: "0",
			supportOrderType: "2",
			sysItemID: "0",
			timeMillis: "1415169108038",
			transID: "0",
			transName: "【6店通用】",
			userID: "3573345",
			userInfo : {"userLoginName" : "abc","userName" : "abc", "userSex" : "1", "userMobile" : "133222222222", "userEmail" : ""},
			usingCityIDs: "1021",
			usingOrderKey: "",
			usingRemark: "",
			usingShopID: "0",
			usingShopName: "",
			usingTime: "0",
			usingTimeType: "1,2,3,4,5",
			validUntilDate: "20141205",
			voucherOrderkey: "",
			voucherPrice: "0.00",
		};
		var count = 15;
		var ret = [];
		for (var i = 0; i < count; i++) {
			var item = IX.inherit(giftTpl, {
				giftItemID : $XP(params, 'giftItemID')
			});
			ret.push(item);
		}
		return ret;
	};

	var getGiftUsedData = function (params) {
		var giftTpl = {
			createTime: "20141105143232",
			eventItemID: "0",
			foodScope: "0",
			getRemark: "",
			getWay: "70",
			giftGroupTempPWD: "",
			giftItemID: "277",
			giftName: "豆捞坊10元电子代金券",
			giftPWD: "042100274965",
			giftStatus: "3",
			giftTransStatus: "0",
			giftType: "10",
			giftValue: "10.00",
			groupID: "5",
			groupName: "豆捞坊",
			isHolidaysUsing: "0",
			isOfflineCanUsing: "1",
			isSameTimeUsing: "0",
			itemID: "203720",
			moenyLimitValue: "100",
			moneyLimitType: "0",
			recirculable: "0",
			recirculeTimes: "0",
			supportOrderType: "2",
			sysItemID: "0",
			timeMillis: "1415169108038",
			transID: "0",
			transName: "【6店通用】",
			userID: "3573345",
			userInfo : {"userLoginName" : "abc","userName" : "abc", "userSex" : "1", "userMobile" : "133222222222", "userEmail" : ""},
			usingCityIDs: "1021",
			usingOrderKey: "",
			usingRemark: "",
			usingShopID: "0",
			usingShopName: "",
			usingTime: "0",
			usingTimeType: "1,2,3,4,5",
			validUntilDate: "20141205",
			voucherOrderkey: "",
			voucherPrice: "0.00",
		};
		var count = 15;
		var ret = [];
		for (var i = 0; i < count; i++) {
			var item = IX.inherit(giftTpl, {
				giftItemID : $XP(params, 'giftItemID')
			});
			ret.push(item);
		}
		return ret;
	};

	var getEventTrackData = function (params) {
		var pageSize = $XP(params, 'pageSize', 15),
			pageNo = $XP(params, 'pageNo', 1);
		var evtTrackTpl = {
			itemID : IX.id().replaceAll('ix_', ''),
			customerName : "会员姓名",
			customerSex : "女",
			cardID : '1',
			cardNO : "10000",
			customerMobile : "13322222222",
			cardLevelName : "VIP1",
			consumptionTotal : "100",
			consumptionCount : "12",
			createTime : "20150122112020"
		};
		var count = 30;
		var ret = [];
		for (var i = 0; i < count; i++) {
			ret.push(evtTrackTpl);
		}
		return {
			pageSize : pageSize,
			pageNo : pageNo,
			records : ret
		};
	};

	Test.getGiftList = getGiftList;
	Test.getEventList = getEventList;
	Test.getEventDataByID = getEventDataByID;
	Test.getGiftDataByID = getGiftDataByID;
	Test.getGiftDataset = getGiftDataset;
	Test.getGiftGetWayData = getGiftGetWayData;
	Test.getGiftUsedData = getGiftUsedData;
	Test.getEventTrackData = getEventTrackData;



})();