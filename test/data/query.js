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
	Test.querySchema = {
		cities : cities,
		areas : areas,
		shops : shops
	};
})();