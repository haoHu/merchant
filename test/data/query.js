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
			operationMode : 0,
			promotShopID : 0,
			promotShopName : '',
			promotionInfo : '',
			settleID : '6',
			settleName : '豆捞坊北京公司',
			shopID : '',
			shopName : '',
			status : 1,
			tags : ['日本料理', '自助餐', '白石桥'],
			address : '黄浦区南京东路819号百联世茂8楼',
			tel : '010-67172156',
			timeShopID : '77867',
			timeShopName : ''

		};
	var cityIDs = [1010,1021,1031,1041],
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
						py : shopTpl.py + sidx,
						cityID : cid,
						cityName : shopTpl.cityName + cidx,
						areaID : aid,
						areaName : shopTpl.areaName + aidx
					}));
				});
			});
		});
	};
	mapData();

	// params : {Page : {pageNo, pageSize}, cityID, areaID, keywordLst}
	var getQueryShopData = function (params) {
		var pageNo = $XP(params, 'Page.pageNo', 1),
			pageSize = $XP(params, 'Page.pageSize', 10),
			cityID = $XP(params, 'cityID', null),
			areaID = $XP(params, 'areaID', null);
		var _shops = _.filter(shops, function (s, i, l) {
			if (!cityID && !areaID) {
				return s;
			}
			if (!areaID) {
				return $XP(s, 'areaID') == areaID;
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
				cityID : s.cityID,
				cityName : s.cityName,
				shopID : s.shopID,
				shopName : s.shopName
			});
		});
		return {
			pageCount : pageCount,
			pageNo : pageNo,
			pageSize : pageSize,
			records : _shops,
			totalSize : totalSize
		};
	};


	Test.querySchema = {
		cities : cities,
		areas : areas,
		shops : shops
	};
	Test.queryResult = getQueryShopData;
})();