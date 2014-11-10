(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var QueryModel = Stapes.subclass({
		constructor : function () {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			// 数据是否已经加载完毕
			this.isReady = false;
			this.callServer = Hualala.Global.getShopQuerySchema;
		}
	});
	QueryModel.proto({
		// 数据模型初始化，获取查询条件的数据
		init : function (params, cbFn) {
			var self = this;
			self.isReady = false;
			self.callServer(params, function (res) {
				if (res.resultcode == '000') {
					// 装填原始数据
					self.origCities = $XP(res, 'data.cities', []);
					self.origAreas = $XP(res, 'data.areas', []);
					self.origShops = $XP(res, 'data.shops', []);
					self.initDataModel();
					self.isReady = true;
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					self.isReady = false;
				}
				cbFn(self);
			});
		},
		// 初始化整体数据模型
		// ds_city, ds_area, ds_shop
		initDataModel : function () {
			var self = this;
			var cityHT = new IX.IListManager(),
				areaHT = new IX.IListManager(),
				shopHT = new IX.IListManager();
			_.each(this.origCities, function (c, i, l) {
				var cid = $XP(c, 'cityID'), 
					shopLst = _.filter(self.origShops, function (s) {
						return $XP(s, 'cityID') == cid;
					}),
					areaLst = _.filter(self.origAreas, function (a) {
						return $XP(a, 'cityID') == cid;
					});
				shopLst = _.pluck(shopLst, 'shopID');
				areaLst = _.pluck(areaLst, 'areaID');
				cityHT.register(cid, IX.inherit(c, {
					shopLst : shopLst,
					areaLst : areaLst
				}));
			});
			_.each(this.origAreas, function (a, i, l) {
				var aid = $XP(a, 'areaID'),
					shopLst = _.filter(self.origShops, function (s) {
						return $XP(s, 'areaID') == aid;
					});
				shopLst = _.pluck(shopLst, 'shopID');
				areaHT.register(aid, IX.inherit(a, {
					shopLst : shopLst
				}));
			});
			_.each(this.origShops, function (s, i, l) {
				var sid = $XP(s, 'shopID');
				shopHT.register(sid, s);
			});
			self.set({
				ds_city : cityHT,
				ds_area : areaHT,
				ds_shop : shopHT
			});
		},
		// 数据是否准备完成
		hasReady : function () {return this.isReady;},
		/**
		 * 通过cityIDs获取城市数据
		 * @param  {String|Array|NULL} ids cityID，如果参数是一个城市的cityID，获取一个城市的数据；如果参数是cityID的数组，获取多个城市数据；如果不传参数，获取全部城市数据
		 * @return {Array|NULL}	如果没有找到匹配的城市数据返回null，否则返回城市数据的数组数据     
		 */
		getCities : function (ids) {
			ids = IX.isEmpty(ids) ? null : (IX.isString(ids) ? [ids] : ids);
			var ds = this.get('ds_city');
			var ret = null;
			ret = ds[!ids ? 'getAll' : 'getByKeys'](ids);
			return ret;
		},
		/**
		 * 通过shopIDs获取店铺数据
		 * @param  {String|Array|NULL} ids shopID，如果参数是一个店铺的shopID，获取一个店铺的数据；如果参数是shopID的数组，获取多个店铺数据；如果不传参数，获取全部店铺数据
		 * @return {Array|NULL}	如果没有找到匹配的店铺数据返回null，否则返回店铺数据的数组数据     
		 */
		getShops : function (ids) {
			ids = IX.isEmpty(ids) ? null : (IX.isString(ids) ? [ids] : ids);
			var ds = this.get('ds_shop');
			var ret = null;
			ret = ds[!ids ? 'getAll' : 'getByKeys'](ids);
			return ret;
		},
		/**
		 * 获取指定区域下的店铺数据
		 * @param  {String} areaID 指定区域ID
		 * @return {Array|NULL} 如果没有找到匹配的店铺数据返回null，否则返回店铺数据的数组数据
		 */
		getShopsByAreaID : function (areaID) {
			if (!areaID) return null;
			var ds = this.get('ds_shop');
			var ret = _.filter(ds.getAll(), function (s, idx) {
				var aid = $XP(s, 'areaID');
				return areaID == aid;
			});
			return ret.length == 0 ? null : ret;
		},
		/**
		 * 获取指定城市的店铺数据
		 * @param  {String} cityID 指定城市ID
		 * @return {Array|NULL} 如果没有找到匹配的店铺数据返回null，否则返回店铺数据的数组数据
		 */
		getShopsByCityID : function (cityID) {
			if (!cityID) return null;
			var ds = this.get('ds_shop');
			var ret = _.filter(ds.getAll(), function (s, idx) {
				var cid = $XP(s, 'cityID');
				return cityID == cid;
			});
			return ret.length == 0 ? null : ret;
		},
		/**
		 * 通过areaIDs获取区域数据
		 * @param  {String|Array|NULL} ids areaID，如果参数是一个区域的areaID，获取一个区域的数据；如果参数是areaID的数组，获取多个区域数据；如果不传参数，获取全部区域数据
		 * @return {Array|NULL}	如果没有找到匹配的区域数据返回null，否则返回区域数据的数组数据     
		 */
		getAreas : function (ids) {
			ids = IX.isEmpty(ids) ? null : (IX.isString(ids) ? [ids] : ids);
			var ds = this.get('ds_area');
			var ret = null;
			ret = ds[!ids ? 'getAll' : 'getByKeys'](ids);
			return ret;
		},
		destroy : function () {
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			this.isReady = false;
		}
	});
	Hualala.Shop.QueryModel = QueryModel;
})(jQuery, window);