// 店铺查询条件数据结构定义
var $$ShopQuery = {
	"cities" : [$$BaseCity, $$BaseCity,....],
	"areas" : [$$BaseArea, $$BaseArea,....],
	"shops" : [$$BaseShop, $$BaseShop,...]
};

var $$BaseCity = {cityCount, cityID, cityName, py : "shang;hai;sh"};
var $$BaseArea = {areaCount, areaID, areaName, cityID, py};
var $$BaseShop = {shopID, shopName, py, keywordLst, cityName, cityID, areaID, areaName};