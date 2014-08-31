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
				pageNo : $XP(params, 'Page.pageNo', 1),
				pageSize : $XP(params, 'Page.pageSize', 15),
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
			return {
				Page : {
					pageNo : this.get('pageNo'),
					pageSize : this.get('pageSize')
				},
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
		getAccounts : function (pageNo) {
			var self = this,
				accountHT = self.get('ds_account'),
				pageHT = self.get('ds_page');
			var ret = _.map(accountHT.getByKeys(pageHT.get(pageNo)), function (mAccount) {
				return mAccount.getAll();
			});
			console.info("pageData :");
			console.info(ret);
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
				"withdrawCash" : function (cfg) {
					var callServer = Hualala.Global.withdrawCash,
						params = $XP(cfg, 'params', {}),
						settleUnitID = self.get('settleUnitID'),
						failFn = $XF(cfg, 'failFn'),
						successFn = $XF(cfg, 'successFn');
					callServer(IX.inherit(params, {
						settleUnitID : settleUnitID
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
								newSettleBalance = window.numeric.sub(settleBalance - transAmount);
							self.set('settleBalance', newSettleBalance);
							// TODO update View
							successFn();
							toptip({
								msg : '提现成功!',
								type : 'success'
							});
						}
					});
				}
			});
		}
	});

	Hualala.Account.BaseAccountModel = BaseAccountModel;
})(jQuery, window);