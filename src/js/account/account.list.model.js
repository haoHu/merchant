(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListModel = Hualala.Shop.CardListModel;
	var AccountListModel = CardListModel.subclass({
		constructor : CardListModel.prototype.constructor
	});
	AccountListModel.proto({
		init : function (params) {
			this.set({
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15),
				transCreateBeginTime : $XP(params, 'transCreateBeginTime', ''),
				transCreateEndTime : $XP(params, 'transCreateEndTime', ''),
				settleUnitID : $XP(params, 'settleUnitID', ''),
				transStatus : $XP(params, 'transStatus', ''),
				transType : $XP(params, 'transType', ''),
				groupID : $XP(params, 'groupID', ''),
				minTransAmount : $XP(params, 'minTransAmount', ''),
				maxTransAmount : $XP(params, 'maxTransAmount', ''),
				ds_account : new IX.IListManager(),
				ds_page : new IX.IListManager()
			});
		},
		updatePagerParams : function (params) {
			var self = this;
			var pagerParamkeys = 'pageCount,totalSize,pageNo,pageSize,transCreateBeginTime,transCreateEndTime,settleUnitID,transStatus,transType,groupID,minTransAmount,maxTransAmount';
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
			// 	settleUnitID : this.get('settleUnitID'),
			// 	transCreateBeginTime : this.get('transCreateBeginTime'),
			// 	transCreateEndTime : this.get('transCreateEndTime'),
			// 	transStatus : this.get('transStatus'),
			// 	transType : this.get('transType'),
			// 	groupID : this.get('groupID'),
			// 	minTransAmount : this.get('minTransAmount'),
			// 	maxTransAmount : this.get('maxTransAmount')
			// };
			return {
				pageNo : this.get('pageNo'),
				pageSize : this.get('pageSize'),
				settleUnitID : this.get('settleUnitID'),
				transCreateBeginTime : this.get('transCreateBeginTime'),
				transCreateEndTime : this.get('transCreateEndTime'),
				transStatus : this.get('transStatus'),
				transType : this.get('transType'),
				groupID : this.get('groupID'),
				minTransAmount : this.get('minTransAmount'),
				maxTransAmount : this.get('maxTransAmount')
			};
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			var accountIDs = _.map(data, function (account, i, l) {
				var settleUnitID = $XP(account, 'settleUnitID'),
					mAccount = new BaseAccountModel(account);
				accountHT.register(settleUnitID, mAccount);
				return settleUnitID;
			});
			pageHT.register(pageNo, accountIDs);
		},
		resetDataStore : function () {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			accountHT.clear();
			pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams(IX.inherit($XP(res, 'data', {}), $XP(res, 'data.page', {})));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getAccounts : function (pageNo) {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			var ret = _.map(accountHT.getByKeys(pageHT.get(pageNo)), function (mAccount) {
				return mAccount.getAll();
			});
			IX.Debug.info("DEBUG: Account List Model PageData :");
			IX.Debug.info(ret);
			return ret;
		},
		getAccountModelByID : function (accountID) {
			var self = this,	
				accountHT = self.get('ds_account');
			return accountHT.get(accountID);
		}
	});


	Hualala.Account.AccountListModel = AccountListModel;

	var BaseAccountModel = Stapes.subclass({
		constructor : function (account) {
			!IX.isEmpty(account) && this.set(account);
			this.bindEvent();
		}
	});
	BaseAccountModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({
				"load" : function (params) {
					var settleUnitID = $XP(params, 'settleUnitID'),
						cbFn = $XF(params, 'cbFn');
					var callServer = Hualala.Global.queryAccount,
						groupID = $XP(Hualala.getSessionSite(), 'groupID', '');
					callServer({
						settleUnitID : settleUnitID,
						groupID : groupID
					}, function (res) {
						var records = $XP(res, "data.records", []);
						if (records.length == 0) {
							throw("get Account Data (" + settleUnitID + ") Failed!");
							return ;
						}
						self.set(records[0]);
						cbFn();
					});
				},
				// 提现
				"withdrawCash" : function (cfg) {
					var callServer = Hualala.Global.withdrawCash,
						params = $XP(cfg, 'params', {}),
						settleUnitID = self.get('settleUnitID'),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn'),
						poundageAmount = self.get('poundageAmount') || 0,
						poundageMinAmount = self.get('poundageMinAmount') || 0;
					callServer(IX.inherit(params, {
						settleUnitID : settleUnitID,
						poundageAmount : poundageAmount,
						poundageMinAmount : poundageMinAmount
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							var transAmount = $XP(params, 'transAmount', 0),
								settleBalance = self.get('settleBalance') || 0,
								newSettleBalance = Hualala.Common.Math.sub(settleBalance - transAmount);
							self.set('settleBalance', newSettleBalance);
							// TODO update View
							successFn();
							toptip({
								msg : '提现成功!',
								type : 'success'
							});
						}
					});
				},
				// 删除结算账户
				"delete" : function (cfg) {
					var callServer = Hualala.Global.deleteAccount,
						settleUnitID = self.get('settleUnitID'),
						groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer({
						settleUnitID : settleUnitID,
						groupID : groupID
					}, function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn(settleUnitID);
						} else {
							toptip({
								msg : '删除成功!',
								type : 'success'
							});
							// TODO update View
							successFn(settleUnitID);
						}
					});
				},
				// 编辑结算账户
				"edit" : function (cfg) {
					var callServer = Hualala.Global.editAccount,
						settleUnitID = self.get('settleUnitID'),
						groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit($XP(cfg, 'params', {}), {
						groupID : groupID,
						settleUnitID : settleUnitID
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn(settleUnitID);
						} else {
							toptip({
								msg : '修改成功!',
								type : 'success'
							});
							// TODO update View
							self.set($XP(cfg, 'params', {}));
							successFn(settleUnitID);
						}
					});
				},
				// 添加结算账户
				"add" : function (cfg) {
					var callServer = Hualala.Global.addAccount,
						groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit($XP(cfg, 'params', {}), {
						groupID : groupID
					}), function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : '添加成功!',
								type : 'success'
							});
							// TODO update View
							self.set($XP(cfg, 'params', {}));
							successFn();
						}
					});
				}
			});
		}
	});

	Hualala.Account.BaseAccountModel = BaseAccountModel;

	var AccountTransListModel = AccountListModel.subclass({
		constructor : function () {
			this.callServer = Hualala.Global.queryAccountTransDetail;
		}
	});
	AccountTransListModel.proto({
		init : function (params) {
			this.set({
				pageCount : 0,
				totalSize : 0,
				pageNo : $XP(params, 'pageNo', 1),
				pageSize : $XP(params, 'pageSize', 15),
				transCreateBeginTime : $XP(params, 'transCreateBeginTime', ''),
				transCreateEndTime : $XP(params, 'transCreateEndTime', ''),
				settleUnitID : $XP(params, 'settleUnitID', ''),
				transStatus : $XP(params, 'transStatus', ''),
				transType : $XP(params, 'transType', ''),
				groupID : $XP(params, 'groupID', ''),
				minTransAmount : $XP(params, 'minTransAmount', ''),
				maxTransAmount : $XP(params, 'maxTransAmount', ''),
				ds_trans : new IX.IListManager(),
				ds_page : new IX.IListManager()
			});
		},
		updateDataStore : function (data, pageNo) {
			var self = this,
				transHT = self.get('ds_trans'),
				pageHT = self.get('ds_page');
			var transIDs = _.map(data, function (trans, i, l) {
				var transID = $XP(trans, 'SUATransItemID'),
					mTrans = new BaseTransactionModel(trans);
				transHT.register(transID, mTrans);
				return transID;
			});
			pageHT.register(pageNo, transIDs);
		},
		resetDataStore : function () {
			var self = this,
				transHT = self.get('ds_trans'),
				pageHT = self.get('ds_page');
			transHT.clear();
			pageHT.clear();
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []), $XP(res, 'data.page.pageNo'));
					self.updatePagerParams(IX.inherit($XP(res, 'data', {}), $XP(res, 'data.page', {})));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getDataByPageNo : function (pageNo) {
			var self = this,
				transHT = self.get('ds_trans'),
				pageHT = self.get('ds_page');
			var ret = _.map(transHT.getByKeys(pageHT.get(pageNo)), function (mTrans) {
				return mTrans.getAll();
			});
			IX.Debug.info("DEBUG: Account TransList Model PageData :");
			IX.Debug.info(ret);
			return ret;
		},
		getModelByID : function (transID) {
			var self = this,	
				transHT = self.get('ds_trans');
			return transHT.get(transID);
		}
	});

	Hualala.Account.AccountTransListModel = AccountTransListModel;

	var BaseTransactionModel = BaseAccountModel.subclass({
		constructor : BaseAccountModel.prototype.constructor
	});
	BaseTransactionModel.proto({
		bindEvent : function () {
			var self = this;
			
		}
	});

	Hualala.Account.BaseTransactionModel = BaseTransactionModel;

	var AccountQueryShopModel = Hualala.Shop.QueryModel.subclass({
		constructor : function () {
			// 原始数据
			this.origCities = [];
			this.origAreas = [];
			this.origShops = [];
			// 数据是否已经加载完毕
			this.isReady = false;
			// this.callServer = Hualala.Global.getShopQuerySchema;
			this.callServer = Hualala.Global.getAccountQueryShop;
		}
	});

	Hualala.Account.AccountQueryShopModel = AccountQueryShopModel;

	var AccountQueryShopResultModel = Hualala.Shop.CardListModel.subclass({
		constructor : function () {
			this.origData = null;
			
			this.dataStore = new IX.IListManager();
		}
	});
	AccountQueryShopResultModel.proto({
		initDataStore : function (data) {
			var self = this;
			self.origData = data;
			_.each(self.origData, function (shop) {
				self.dataStore.register($XP(shop, 'shipID'), shop);
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

	Hualala.Account.AccountQueryShopResultModel = AccountQueryShopResultModel;












})(jQuery, window);