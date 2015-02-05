(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;

	var GiftMgrResultModel = Stapes.subclass({
		/**
		 * 构造礼品查询结果的数据模型
		 * @param  {object} cfg 配置信息
		 *          @param {Function} callServer 获取数据接口
		 *          @param {Array} queryKeys 搜索条件字段序列
		 *          @param {Boolean} hasPager 是否支持分页true：支持；false：不支持。default true
		 *          @param {String} gridType 结果数据表类型
		 *          
		 *          
		 * @return {[type]}     [description]
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
			}
			this.queryKeys = $XP(cfg, 'queryKeys', []);
			this.pagerKeys = 'pageCount,totalSize,pageNo,pageSize'.split(',');
			this.queryParamsKeys = null;
			this.hasPager = $XP(cfg, 'hasPager', true);
			this.recordModel = $XP(cfg, 'recordModel', BaseGiftModel);
			this.gridType = $XP(cfg, 'gridType', '');
		}
	});

	GiftMgrResultModel.proto({
		init : function (params) {
			this.set(IX.inherit({
				ds_record : new IX.IListManager(),
				ds_items : new IX.IListManager(),
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
						'__id__' : id,
						'__gridtype__' : self.gridType
					}));
				recordHT.register(id, mRecord);
				return id;
			});
			pageHT.register(pageNo, recordIDs);
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.pageNo'));
					self.updatePagerParams($XP(res, 'data', {}));
					// self.updateItemDataStore($XP(res, 'data', {}));
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
			IX.Debug.info("DEBUG: Query Result Model PageData");
			IX.Debug.info(ret);
			return ret;
		},
		getRecordModelByID : function (id) {
			var self = this,
				recordHT = self.get('ds_record');
			return recordHT.get(id);
		}

	});

	HMCM.GiftMgrResultModel = GiftMgrResultModel;

	/**
	 * 礼品模型
	 * 
	 * 
	 */
	var BaseGiftModel = Stapes.subclass({
		constructor : function (gift) {
			this.set(gift);
			this.bindEvent();
		}
	});
	BaseGiftModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({
				delete : function (params) {
					var giftItemID = $XP(params, 'itemID');
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.deleteMCMGift({
						giftItemID : giftItemID
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				createGift : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					// save tmp data in model
					self.set(post);
					// Post Model Data Set to Server
					IX.Debug.info("DEBUG: Gift Wizard Form Post Params:");
					IX.Debug.info(self.getAll());
					Hualala.Global.createMCMGift(self.getAll(), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							failFn(res);
						}
					});
				},
				editGift : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					// save tmp data in model
					self.set(post);
					// Post Model Data Set to Server
					IX.Debug.info("DEBUG: Gift Wizard Form Post Params:");
					IX.Debug.info(self.getAll());
					Hualala.Global.editMCMGift(self.getAll(), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							failFn(res);
						}
					});
				},
				saveCache : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					successFn(self);
				},
				bindShops : function (params) {
					var cities = $XP(params, 'cities', []),
						shops = $XP(params, 'shops', []);
					var shopIDs = _.pluck(shops, 'shopID'),
						shopNames = _.pluck(shops, 'shopName'),
						usingCityIDs = _.pluck(cities, 'cityID');
					this.set({
						shopIDs : shopIDs.join(';'),
						shopNames : shopNames.join(';'),
						usingCityIDs : usingCityIDs.join(';')
					});
				}
			}, this);
		}
	});
	HMCM.BaseGiftModel = BaseGiftModel;

	/**
	 * 活动模型
	 * 
	 * 
	 */
	var BaseEventModel = Stapes.subclass({
		constructor : function (evt) {
			self.CardLevelIDSet = null;
			this.set(evt);
			this.bindEvent();
		}
	});
	BaseEventModel.proto({
		getEventCardSet : function () {
			var self = this;
			var eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
			var eventCardSet = _.find(eventTypes, function (el) {
				return $XP(el, 'value') == self.get('eventWay');
			});
			return eventCardSet;
		},
		getEventCardClz : function () {
			var self = this;
			var eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
			var eventTypeSet = _.find(eventTypes, function (el) {
				return $XP(el, 'value') == self.get('eventWay');
			});
			return $XP(eventTypeSet, 'type', '');
		},
		bindEvent : function () {
			var self = this;
			self.on({
				delete : function (params) {
					var eventID = $XP(params, 'itemID');
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.deleteMCMEvent({
						eventID : eventID
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				switchEvent : function (params) {
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.switchMCMEvent(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				update : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.getMCMEventByID({
						eventID : self.get('eventID')
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var d = $XP(res, 'data.records')[0];
							self.set(d);
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				saveCache : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					successFn(self);
				},
				loadCardLevelIDs : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.getVipLevels({}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							self.CardLevelIDSet = $XP(res, 'data.records', []);
							successFn(res);
						} else {
							self.CardLevelIDSet = null;
							faildFn(res);
						}
					});
				},
				createEvent : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					Hualala.Global.createEvent($XP(params, 'params'), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var d = $XP(res, 'data');
							self.set(d);
							successFn(res);
						} else {
							faildFn(res);
						}
					});

				},
				editEvent : function (params) {
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					var setData = self.getAll();
					Hualala.Global.editEvent(IX.inherit(setData, $XP(params, 'params')), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var d = $XP(res, 'data');
							self.set(d);
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				}
			}, this);
		}
	});
	HMCM.BaseEventModel = BaseEventModel;
})(jQuery, window);
































