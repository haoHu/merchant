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
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15),
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
			// return {
			// 	Page : {
			// 		pageNo : this.get('pageNo'),
			// 		pageSize : this.get('pageSize')
			// 	},
			// 	cityID : this.get('cityID'),
			// 	areaID : this.get('areaID'),
			// 	keywordLst : this.get('keywordLst')
			// };
			return {
				pageNo : this.get('pageNo'),
				pageSize : this.get('pageSize'),
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
		getShops : function (pageNo) {
			var self = this,
				shopHT = self.get('ds_shop'),
				pageHT = self.get('ds_page');
			var ret = _.map(shopHT.getByKeys(pageHT.get(pageNo)), function (mShop, i, l) {
				return mShop.getAll();
			});
			IX.Debug.info("DEBUG: Shop Card List Model PageData : ");
			IX.Debug.info(ret);
			return ret;
		},
		getShopModelByShopID : function (shopID) {
			var self = this,
				shopHT = self.get('ds_shop');
			return shopHT.get(shopID);
		},
		// 更新店铺状态
		updateShopStatus : function (shopID, status, failFn, successFn) {
			var self = this,
				shopHT = self.get('ds_shop');
			var shop = shopHT.get(shopID);
			// shop = IX.inherit(shop, {
			// 	status : status
			// });
			// shopHT.register(shopID, shop);
			// shop.set('status', status);
			shop.emit('switchShopStatus', {
				status : status,
				failFn : failFn,
				successFn : successFn
			});
		},
		// 更新店铺业务状态
		updateShopBusinessStatus : function (params, failFn, successFn) {
			var self = this,
				shopHT = self.get('ds_shop'),
				shopID = $XP(params, 'shopID'),
				shop = shopHT.get(shopID);
			shop.emit('switchBusinessStatus', {
				name : $XP(params, 'name'),
				id : $XP(params, 'id'),
				status : $XP(params, 'status', 0),
				failFn : failFn,
				successFn : successFn
			});

		}
	});


	Hualala.Shop.CardListModel = CardListModel;

	var BaseShopModel = Stapes.subclass({
		constructor : function (shop) {
			this.switchShopStatusCallServer = Hualala.Global.switchShopStatus;
			this.switchShopBusinessStatusCallServer = Hualala.Global.switchShopServiceFeatureStatus;
			this.set(shop);
			this.bindEvent();
		}
	});
	BaseShopModel.proto({
		switchShopStatus : function (status, failFn, successFn) {
			var self = this,
				shopID = self.get('shopID');
			self.set('status', status);
			IX.Debug.info("DEBUG: Base Shop Model [" + self.get('shopID') + "] Status :" + status);
			this.switchShopStatusCallServer({
				shopID : shopID,
				status : status
			}, function (res) {
				if (res.resultcode !== '000') {
					
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					self.set('status', !status ? 1 : 0);
					failFn(shopID);
					
				} else {
					toptip({
						msg : !status ? '关闭成功！' : '开启成功！',
						type : 'success'
					});
					successFn(shopID);
				}
			});
		},
		switchShopBusinessStatus : function (params) {
			var self = this,
				shopID = self.get('shopID');
			var failFn = $XF(params, 'failFn'),
				successFn = $XF(params, 'successFn'),
				name = $XP(params, 'name'),
				id = $XP(params, 'id'),
				status = $XP(params, 'status');
			var setServiceFeature = function (sName, s) {
				var serviceFeatures = self.get('serviceFeatures').split(',');
				// 更新serviceFeature
				if (s == 1) {
					serviceFeatures.push(sName);
				} else {
					serviceFeatures = _.filter(serviceFeatures, function (el) {
						return el !== sName;
					});
				}
				self.set('serviceFeatures', serviceFeatures.join(','));
			};
			setServiceFeature(name, status);
			IX.Debug.info("DEBUG: Switch Shop [" + self.get('shopID') + "] ServiceFeature: " + self.get('serviceFeatures'));
			this.switchShopBusinessStatusCallServer({
				shopID : shopID,
				serviceFeatures : name,
				operation : status
			}, function (res) {
				if (res.resultcode !== '000') {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					setServiceFeature(name, !status ? 1 : 0);
					failFn({
						shopID : shopID,
						id : id
					});
				} else {
					toptip({
						msg : !status ? '关闭成功！' : '开启成功！',
						type : 'success'
					});
					successFn({
						mShop : self,
						id : id,
						name : name
					});
				}
			});
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"switchShopStatus" : function (params) {
					var status = $XP(params, 'status'),
						failFn = $XF(params, 'failFn'),
						successFn = $XF(params, 'successFn');
					this.switchShopStatus(status, failFn, successFn);
				},
				"switchBusinessStatus" : function (params) {
					this.switchShopBusinessStatus(params);
				},
				"setServiceParams" : function (cfg) {
					var callServer = $XF(cfg, 'callServer'),
						params = $XP(cfg, 'params', {}),
						serviceID = $XP(cfg, 'serviceID'),
						shopID = self.get('shopID'),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit(params, {
						shopID : shopID,
						strType : serviceID
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							var newData = {};
							newData[serviceID] = params;
							// var revParamJson = JSON.parse(self.get('revParamJson'));
							var revParamJson = self.get('revParamJson') || null,
								takeawayParamJson = self.get('takeawayParamJson') || null;
							var serviceFeatures = self.get('serviceFeatures');
							revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
							takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
							if (serviceID == 20 || serviceID == 21) {
								takeawayParamJson = IX.inherit(takeawayParamJson, newData);
								// self.set('revParamJson', JSON.stringify(takeawayParamJson));
								self.set('takeawayParamJson', JSON.stringify(takeawayParamJson));

							} else {
								revParamJson = IX.inherit(revParamJson, newData);
								self.set('revParamJson', JSON.stringify(revParamJson));
							}
							
							
							if (serviceID == 41) {
								var checkSpotOrder = $XP(params, 'checkSpotOrder', 0);
								if (checkSpotOrder == 0) {
									serviceFeatures = serviceFeatures.replace('spot_pay,', '');
								} else {
									serviceFeatures = serviceFeatures.concat('spot_pay,');
								}
								self.set('serviceFeatures', serviceFeatures);
							}
							successFn();
							toptip({
								msg : '配置成功!',
								type : 'success'
							});
						}
					});
				}
			});
		}
	});
})(jQuery, window);