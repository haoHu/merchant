(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	Hualala.Order.initQueryParams = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var self = this;
		var queryVals = $XP(ctx, 'params', []);
		var queryKeys = self.queryKeys;
		var params = _.object(queryKeys, queryVals);
		self.set(params);
	};

	var QueryModel = Hualala.Shop.QueryModel.subclass({
		/**
		 * 构造订单搜索数据模型
		 * @param  {Object} cfg
		 * 			@param {Array} queryKeys 搜索字段
		 * 			@param {Function} initQueryParams 初始化搜索字段方法
		 * 			
		 * @return {Object}
		 */
		constructor : function (cfg) {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			// 数据是否已经加载完毕
			this.isReady = false;
			this.callServer = Hualala.Global.getShopQuerySchema;
			var initQueryParams = $XF(cfg, 'initQueryParams');
			initQueryParams.apply(this);
		}
	});
	QueryModel.proto({
		getQueryParams : function () {
			var self = this;
			var vals = _.map(self.queryKeys, function (k) {
				return self.get(k);
			});
			var params = _.object(self.queryKeys, vals);
			console.info("Order Query Params is :");
			console.info(params);
			return params;
		}
	});

	Hualala.Order.QueryModel = QueryModel;
})(jQuery, window);