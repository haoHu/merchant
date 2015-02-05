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

	Test.getGiftList = getGiftList;
	Test.getEventList = getEventList;
	Test.getEventDataByID = getEventDataByID;
})();