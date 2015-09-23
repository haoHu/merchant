(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip,
		LoadingModal = Hualala.UI.LoadingModal,
		G = Hualala.Global;
    function encodeTextareaItem(data, textareaName) {
        if (data[textareaName]) {
            data[textareaName] = Hualala.Common.encodeTextEnter(data[textareaName]);
        }
        return data;
    }
	var PromotionModel = Stapes.subclass({
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
			//没有分页
			this.hasPager = $XP(cfg, 'hasPager', false);
			this.recordModel = $XP(cfg, 'recordModel', BasePromotionModel);
		}
	});
	PromotionModel.proto({
		init : function (params) {
			this.set(IX.inherit({
				shopID : $XP(params, 'shopID', ''),
				ds_promotion : new IX.IListManager(),
				ds_page : new IX.IListManager()
			}, this.hasPager ? {
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15)
			} : {}));
		},
		load : function (params, cbFn) {
			var self = this;
			self.callServer(params, function (res) {
				if (res.resultcode == '000') {
					promotions = res.data;
                    if(promotions!=undefined&&promotions.records){                   	
                		self.updateDataStore($XP(res, 'data.records', {}), $XP(res, 'data.page.pageNo')); 
                    }
                    else{
                    	var existrefPromotShopID = res.data.refPromotShopID;
                    	if(existrefPromotShopID!=0){
                    		var applyPromotionData = $XP(res, 'data', {});
                    		self.set(applyPromotionData);
                		}
                		else{
                    		self.updateDataStore($XP(res, 'data.records', {}), $XP(res, 'data.page.pageNo'));
                    	}
                    }  
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn.apply(self);
			});
		},
		updateDataStore : function (data,pageNo) {
			var self = this,
				promotionHT = self.get('ds_promotion'),
				pageHT = self.get('ds_page');
			pageNo = self.hasPager ? pageNo : 1;
			var recordIDs = _.map(data, function (r, i, l) {
				var itemID = $XP(r, 'itemID'),
					mRecord = new self.recordModel(IX.inherit(r, {
						'itemID' : itemID
					}));
				promotionHT.register(itemID, mRecord);
				return itemID;
			});
			pageHT.register(pageNo, recordIDs);
			/*var self = this,
				promotionHT = self.get('ds_promotion');
			var recordIDs = _.map(data, function (r, i, l) {
				var itemID = $XP(r, 'itemID'),
					mPromotion = new self.recordModel(r);
				promotionHT.register(itemID, mPromotion);
				return itemID;
			});*/
		},
		getPagerParams : function () {
			var self = this;
			var ret = {};
			_.each(self.getAll(), function (k) {
				ret[k] = self.get(k);
			});
			return ret;
		},
		getRecordsByPageNo : function (pageNo) {
			var self = this,
				promotionHT = self.get('ds_promotion'),
				pageHT = self.get('ds_page');
			pageNo = !self.hasPager ? 1 : pageNo;
			var ret = _.map(promotionHT.getByKeys(pageHT.get(pageNo)), function (mRecord, i, l) {
				return mRecord.getAll();
			});
			IX.Debug.info(ret);
			return ret;
		},
		getRecordModelByID : function (id) {
			var self = this,
				promotionHT = self.get('ds_promotion');
			return promotionHT.get(id);
		},
		updateRefBind : function (items) {
			var self =this;
			var post ={promotShopID:items,shopID:shopID};
			G.updatePromotShop(post, function (res) {
				if ($XP(res, 'resultcode') == '000') {
					self.set({
						action : $XP(post, 'action')
					});
					IX.Debug.info("套用的店铺");
					// successFn(res);
				} else {
					// faildFn(res);
				}
			});
		},
		resetDataStore : function () {
			this.promotionHT.clear();
		}
	});
	Hualala.Shop.PromotionModel = PromotionModel;
	
	var BasePromotionModel = Stapes.subclass({
		constructor : function (promotion) {
			this.set(promotion);
			this.bindEvent();
		}
	});
	BasePromotionModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({
				deleteItem : function (params) {
					var itemID = $XP(params, 'itemID'),
						shopID = $XP(params, 'shopID');
					var successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					G.deleteShopPromotion({
						itemID : itemID,
						shopID :shopID
					}, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							faildFn(res);
						}
					});
				},
				createPromotion : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					IX.Debug.info(self.getAll());
                    var postData = IX.inherit({}, self.getAll());
					G.createShopPromotion(encodeTextareaItem(postData, 'remark'), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res.data);
						} else {
							failFn(res);
						}
					});
				},
				editPromotion : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					IX.Debug.info(self.getAll());
                    var postData = IX.inherit({}, self.getAll());
					G.updateShopPromotion(encodeTextareaItem(postData, 'remark'), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res);
						} else {
							failFn(res);
						}
					});
				},
				promotionTimeCheck : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.set(post);
					IX.Debug.info(self.getAll());
                    var postData = IX.inherit({}, self.getAll());
					G.promotionTimeCheck(encodeTextareaItem(postData, 'remark'), function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn(res.data);
						} else {
							failFn(res);
						}
					});
				},
				promotionRulesToString : function (params) {
					var post = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					G.promotionRulesToString(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							var promotionDesc =res.data.records[0];
							self.set(promotionDesc);
							successFn(res);
						} else {
							failFn(res);
						}
					});
				},
				switchPromotion : function (params) {
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					G.switchShopPromotion(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							self.set({
								action : $XP(post, 'action')
							});
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
				}
			}, this);
		}
	});
	Hualala.Shop.BasePromotionModel = BasePromotionModel;
	

})(jQuery, window);
(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var QueryShopResultModel =Hualala.Shop.CardListModel.subclass({
		constructor : function () {
			this.origData = null;
			this.dataStore = new IX.IListManager();
		}
	});
	QueryShopResultModel.proto({
		initDataStore : function (data) {
			var self = this;
			self.origData = data;
			_.each(self.origData, function (shop) {
				self.dataStore.register($XP(shop, 'shopID'), shop);
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			var pageNo = self.get('pageNo'),
				pageSize = self.get('pageSize'),
				cityID = self.get('cityID'),
				areaID = self.get('areaID'),
				keywordLst = self.get('keywordLst'),
				totalSize = 0,
				start = (pageNo - 1) * pageSize,
				end = pageSize * pageNo,
				pageCount = 0;
			var shops = [];
			shops = areaID.length > 0 ? _.filter(self.origData, function (_shop) {
				return $XP(_shop, 'areaID') == areaID;
			}) : self.origData;
			shops = cityID.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'cityID') == cityID;
			}) : shops;
			shops = keywordLst.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'shopName') == keywordLst;
			}) : shops;
			totalSize = shops.length;
			pageCount = Math.ceil(totalSize / pageSize);
			shops = _.filter(shops, function (_shop, idx) {
				return idx >= start && idx < end;
			});
			self.updateDataStore(shops, pageNo);
			self.updatePagerParams({
				pageCount : pageCount,
				totalSize : totalSize,
				pageNo : pageNo,
				pageSize : pageSize
			});
			cbFn(self);
		}
	});

	Hualala.Shop.QueryShopResultModel = QueryShopResultModel;
})(jQuery, window);