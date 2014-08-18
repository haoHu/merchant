(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListModel = Stapes.subclass({
		/**
		 * 构造卡片店铺列表的数据模型
		 * @param  {Object} cfg 配置信息
		 *           @param {Function} callServer 获取数据接口
		 * @return {Object}     
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
		}
	});
	CardListModel.proto({
		init : function (params) {
			this.set({
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'Page.pageNo', 1),
				pageSize : $XP(params, 'Page.pageSize', 15),
				cityID : $XP(params, 'cityID', ''),
				areaID : $XP(params, 'areaID', ''),
				keywordLst : $XP(params, 'keywordLst', ''),
				ds_shop : new IX.IListManager(),
				ds_page : new IX.IListManager()
			});
		},
		updatePagerParams : function (params) {
			var self = this;
			var pagerParamkeys = 'pageCount,totalSize,pageNo,pageSize,cityID,areaID,keywordLst';
			// _.each(pagerParamkeys.split(','), function (k, i, l) {
			// 	switch(k) {
			// 		case 'pageCount': 
			// 		case 'totalSize' :
			// 			self.set(k, $XP(params, k, 0));
			// 			break;
			// 		case 'pageNo' : 
			// 			self.set(k, $XP(params, k, 1));
			// 			break;
			// 		case 'pageSize' :
			// 			self.set(k, $XP(params, k, 15));
			// 			break;
			// 		default:
			// 			self.set(k, $XP(params, k, ''));
			// 			break;
			// 	}
			// });
			_.each(params, function (v, k, l) {
				if (pagerParamkeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			return {
				Page : {
					pageNo : this.get('pageNo'),
					pageSize : this.get('pageSize')
				},
				cityID : this.get('cityID'),
				areaID : this.get('areaID'),
				keywordLst : this.get('keywordLst')
			};
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			var shopIDs = _.map(data, function (shop, i, l) {
				// var shopID = $XP(shop, 'shopID');
				// shopHT.register(shopID, shop);
				// return shopID;
				var shopID = $XP(shop, 'shopID'),
					mShop = new BaseShopModel(shop);
				shopHT.register(shopID, mShop);
				return shopID;
			});
			pageHT.register(pageNo, shopIDs);
		},
		resetDataStore : function () {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			shopHT.clear();
			pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.pageNo'));
					self.updatePagerParams($XP(res, 'data', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getShops : function (pageNo) {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			var ret = _.map(shopHT.getByKeys(pageHT.get(pageNo)), function (mShop, i, l) {
				return mShop.getAll();
			});
			console.info("pageData:");
			console.info(ret);
			return ret;
		},
		updateShopStatus : function (shopID, status, failFn) {
			var self = this,
				shopHT = self.get('ds_shop');
			var shop = shopHT.get(shopID);
			// shop = IX.inherit(shop, {
			// 	status : status
			// });
			// shopHT.register(shopID, shop);
			// shop.set('status', status);
			shop.emit('switchStatus', {
				status : status,
				failFn : failFn
			});
		}
	});


	Hualala.Shop.CardListModel = CardListModel;

	var BaseShopModel = Stapes.subclass({
		constructor : function (shop) {
			this.switchStatusCallServer = Hualala.Global.switchShopStatus;
			this.set(shop);
			this.bindEvent();
		}
	});
	BaseShopModel.proto({
		switchStatus : function (status, failFn) {
			var self = this,
				shopID = self.get('shopID');
			self.set('status', status);
			console.info("Switch Shop [" + self.get('shopID') + "] status " + status);
			this.switchStatusCallServer({
				shopID : shopID,
				status : status
			}, function (res) {
				if (res.resultcode == '000') {
					
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					self.set('status', !status ? 1 : 0);
					failFn(shopID);
				}
			});
		},
		bindEvent : function () {
			this.on({
				// "update:status" :  function (status) {
				// 	this.switchStatus(status);
				// },
				"switchStatus" : function (params) {
					var status = $XP(params, 'status'),
						failFn = $XF(params, 'failFn');
					this.switchStatus(status, failFn);
				}
			});
		}
	});
})(jQuery, window);