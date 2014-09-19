(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var OrderQueryResultModel = Stapes.subclass({
		/**
		 * 构造订单查询结果的数据模型 
		 * @param  {Object} cfg	配置信息
		 * 		@param {Function} callServer 获取数据接口
		 * 		@param {Array} queryKeys 搜索条件字段序列
		 * 		@param {Array} cities 城市数据
		 * 		@param {Function} initQueryParams 初始化搜索条件
		 * 		@param {Boolean} hasPager 是否支持分页true:支持；false：不支持.default true
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return ;
			}
			this.cities = $XP(cfg, 'cities', []);
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			this.pagerKeys = 'pageCount,totalSize,pageNo,pageSize'.split(',');
			this.queryParamsKeys = null;
			this.hasPager = $XP(cfg, 'hasPager', true);
			this.recordModel = $XP(cfg, 'recordModel', BaseOrderRecordModel);
			var initQueryParams = $XF(cfg, 'initQueryParams');
			initQueryParams.apply(this);
		}
	});

	OrderQueryResultModel.proto({
		init : function (params, cities) {
			this.cities = cities || this.cities;
			this.set(IX.inherit({
				ds_record : new IX.IListManager(),
				ds_page : new IX.IListManager()
			}, this.hasPager ? {
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15)
			} : {}));
			this.queryParamsKeys = !this.hasPager ? this.queryKeys : this.queryKeys.concat(this.pagerKeys);
		},
		updatePagerParams : function (params) {
			var self = this;
			var queryParamsKeys = self.queryParamsKeys.join(',');
			_.each(params, function (v, k, l) {
				if (queryParamsKeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			var self = this;
			var ret = {};
			_.each(self.queryParamsKeys, function (k) {
				ret[k] = self.get(k);
			});
			return ret;
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				recordHT = self.get('ds_record'),
				pageHT = self.get('ds_page');
			pageNo = self.hasPager ? pageNo : 1;
			var recordIDs = _.map(data, function (r, i, l) {
				var id = pageNo + '_' + IX.id(),
					mRecord = new self.recordModel(IX.inherit(r, {
						'__id__' : id
					}));
				recordHT.register(id, mRecord);
				return id;
			});
			pageHT.register(pageNo, recordIDs);
		},
		resetDataStore : function () {
			this.recordHT.clear();
			this.pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams($XP(res, 'data.page', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getRecordsByPageNo : function (pageNo) {
			var self = this,
				recordHT = self.get('ds_record'),
				pageHT = self.get('ds_page');
			pageNo = !self.hasPager ? 1 : pageNo;
			var ret = _.map(recordHT.getByKeys(pageHT.get(pageNo)), function (mRecord, i, l) {
				return mRecord.getAll();
			});
			console.info("pageData");
			console.info(ret);
			return ret;
		},
		getRecordModelByID : function (id) {
			var self = this,
				recordHT = self.get('ds_record');
			return recordHT.get(id);
		},
		getCityByCityID : function (cityID) {
			if (IX.isEmpty(cityID)) return null;
			var l = this.cities;
			var m = _.find(l, function (el) {
				return $XP(el, 'cityID') == cityID;
			});
			return m;
		}
	});

	Hualala.Order.OrderQueryResultModel = OrderQueryResultModel;

	/*订单查询结果基础数据模型 */
	var BaseOrderRecordModel = Stapes.subclass({
		constructor : function (order) {
			this.set(order);
		}
	});
	BaseOrderRecordModel.proto({

	});
	Hualala.Order.BaseOrderRecordModel = BaseOrderRecordModel;
})(jQuery, window);