(function () {
	IX.ns("Test");
	var cities = [], areas = [], shops = [];
	var cityTpl = {
			cityCount : 1,
			cityID : 1010,
			cityName : '城市',
			py : 'cheng;shi'
		},
		areaTpl = {
			areaCount : 1,
			areaID : 101010000,
			areaName : '区域',
			py : 'qu;yu',
			cityID : 1010
		},
		shopTpl = {
			shopID : 1000,
			shopName : '店铺',
			py : 'dian;pu',
			keywordLst : '店铺',
			cityID : 1010,
			cityName : '城市',
			areaID : 101010000,
			areaName : '区域'
		},
		shopResultTpl = {
			cityID : '',
			cityName : '',
			menuShopID : '11111',
			menuShopName : '豆捞坊（西直门店）',
			operationMode : Test.getRandom(0, 1),
			promotShopID : 0,
			promotShopName : '',
			promotionInfo : '',
			settleID : '6',
			settleName : '豆捞坊北京公司',
			shopID : '',
			shopName : '',
			imagePath : 'group1/M00/00/F7/wKgCIVPu-kWbqysWAAEvq1pYSJc436.jpg',
			status : 1,
			// tags : ['日本料理', '自助餐', '白石桥', '白石桥', '白石桥', '白石桥'],
			areaName : "中关村广场购物中心",
			cuisineID1: "10103600",
			cuisineID2 : "10101200",
			cuisineName1 : "火锅",
			cuisineName2 : "湘菜",
			address : '黄浦区南京东路819号百联世茂8楼黄浦区南京东路819号百联世茂8楼黄浦区南京东路819号百联世茂8楼',
			tel : '010-67172156',
			timeShopID : '77867',
			timeShopName : '',
			"serviceFeatures": "commonreserve_order,takeaway_order,takeout_order,spot_order,justeat_order",
			"revParamJson" : JSON.stringify({"10":{"advanceTime":"30","minAmount":"0","noticeTime":"30","reserveTableDesc":"342424242423","reserveTableTime":"15"},"11":{"advanceTime":"30","holidayFlag":"0","minAmount":"","noticeTime":"30","reserveTableDesc":"","reserveTableTime":"15","servicePeriods":"1100,1400"},"41":{"fetchFoodMode":"","payBeforeCommit":"1","payMethodAtShop":"0","supportCommitToSoftware":"1"}}),
			"shopPromotionInfo": "",
			"shopPromotionType": "1",
			"shopServiceOptions": "234214321431",
			"takeawayNotice": "",
			"takeawayParamJson" : {"20":{"advanceTime":"20","freeServiceAmount":"0","holidayFlag":"1","minAmount":"50","noticeTime":"45","payMethod":"","serviceAmount":"0","servicePeriods":"1000,2300","takeawayDeliveryAgent":"3","takeawayDeliveryTime":"20","takeawayScope":"4","takeawayScopeDesc":"仅限"},"21":{"advanceTime":"30","freeServiceAmount":"0","holidayFlag":"0","minAmount":"60","noticeTime":"30","serviceAmount":"0","servicePeriods":"0300,1230"}},
			"cancelRevBeforTime": "0",
			"isCancelRevReturnVoucher": "0",
			"discountNote": "asdfsadf",
			"description": "",
			"reserveTableInfo": ""
		};
	var cityIDs = [1010,1021,1031,1041,1051,1061,1071,1081,1091,1110],
		areaIDs = [10000,20000,30000,40000],
		shopIDs = [75810,75811,75812,75813,75814,75815];
	var mapData = function () {
		var cityCount = cityIDs.length,
			areaCount = areaIDs.length,
			shopCount = shopIDs.length;
		IX.iterate(cityIDs, function (cid, cidx) {
			cities.push(IX.inherit(cityTpl, {
				cityCount : 1 * areaCount * shopCount,
				cityID : cid,
				cityName : cityTpl.cityName + cidx,
				py : cityTpl.py + ';' + cidx
			}));
			IX.iterate(areaIDs, function (aid, aidx) {
				areas.push(IX.inherit(areaTpl, {
					areaCount : 1 * shopCount,
					areaID : '' + cid + aid,
					areaName : areaTpl.areaName + aidx + '_' + Test.getRandom(1, 100),
					py : areaTpl.py + ';' + aidx,
					cityID : cid
				}));
				IX.iterate(shopIDs, function (sid, sidx) {
					shops.push(IX.inherit(shopTpl, {
						shopID : sid + Test.getRandom(100, 10000),
						shopName : shopTpl.shopName + sidx,
						py : shopTpl.py + ';' + sidx,
						cityID : cid,
						cityName : shopTpl.cityName + cidx,
						areaID : '' + cid + aid,
						areaName : shopTpl.areaName + aidx
					}));
				});
			});
		});
	};
	mapData();

	// params : {Page : {pageNo, pageSize}, cityID, areaID, keywordLst}
	var getQueryShopData = function (params) {
		var pageNo = $XP(params, 'pageNo', 1),
			pageSize = $XP(params, 'pageSize', 10),
			cityID = $XP(params, 'cityID', null),
			areaID = $XP(params, 'areaID', null);
		var _shops = _.filter(shops, function (s, i, l) {
			if (!cityID && !areaID) {
				return s;
			}
			if (!areaID) {
				return $XP(s, 'cityID') == cityID;
			}
			return ($XP(s, 'cityID') == cityID && $XP(s, 'areaID') == areaID);
		});
		var totalSize = _shops.length,
			pageCount = Math.ceil(totalSize / pageSize);
		_shops = _.filter(_shops, function (s, i, l) {
			return (i >= (pageNo - 1) * pageSize) && (i < pageNo * pageSize);
		});
		_shops = _.map(_shops, function (s, i, l) {
			return IX.inherit(shopResultTpl, {
				operationMode : Test.getRandom(0, 1),
				cityID : s.cityID,
				cityName : s.cityName,
				shopID : s.shopID,
				shopName : s.shopName
			});
		});
		// return {
		// 	pageCount : pageCount,
		// 	pageNo : pageNo,
		// 	pageSize : pageSize,
		// 	records : _shops,
		// 	totalSize : totalSize
		// };
		return {
			page : {
				pageCount : pageCount,
				pageNo : pageNo,
				pageSize : pageSize,
				totalSize : totalSize
			},
			records : _shops
		}
	};


	Test.querySchema = {
		cities : cities,
		areas : areas,
		shops : shops
	};
	Test.queryResult = getQueryShopData;
})();