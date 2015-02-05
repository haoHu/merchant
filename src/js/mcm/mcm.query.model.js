(function ($, window) {
	IX.ns("Hualala.MCM");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip; 

	var QueryModel = Hualala.Shop.QueryModel.subclass({
		constructor : function (cfg) {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			// 数据是否已经加载完毕
			this.isReady = false;
			this.callServer = Hualala.Global.getShopQuerySchema;
		}
	});
	QueryModel.proto({
		getQueryParams : function () {
			var self = this;
			var vals = _.map(self.queryKeys, function (k) {
				return self.get(k);
			});
			var params = _.object(self.queryKeys, vals);
			IX.Debug.info("DEBUG: Order Query Model Query Params:");
			IX.Debug.info(params);
			return params;
		}
	});
	Hualala.MCM.QueryModel = QueryModel;
})(jQuery, window);