(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	var BaseAccountModel = Hualala.Account.BaseAccountModel;

	/*账户管理控制器*/
	var AccountMgrController = Stapes.subclass({
		/**
		 * 构造控制器
		 * @param  {Object} cfg {container, settleUnitID, accountModel, mgrView, transaDetailCtrl}
		 * @return {Object}     AccountMgrController实例
		 */
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container', null);
			this.settleUnitID = $XP(cfg, 'settleUnitID', null);
			this.model = $XP(cfg, 'accountModel', null);
			this.view = $XP(cfg, 'mgrView', null);
			this.transaDetailCtrl = $XP(cfg, 'transaDetailCtrl', null);
			if (!this.container || !this.model || !this.view || !this.transaDetailCtrl) {
				throw("Account Detail Mgr Init Failed!!");
				return ;
			}
			this.init();
		}
	});
	AccountMgrController.proto({
		// 初始化控制器
		init : function () {
			var self = this;
			self.bindEvent();
			self.model.emit('load', {
				settleUnitID : self.settleUnitID,
				cbFn : function () {
					self.view.emit('init', {
						model : self.model,
						container : self.container
					});
					self.view.emit('render');
				}
			});
		},
		// 控制器绑定事件
		bindEvent : function () {
			this.on({
				// 触发交易明细控制器进行查询
				query : function () {
					var self = this;
					
				}
			}, this);
			
			this.view.on({
				init : function (params) {
					var self = this;
					self.view.init(params);
					self.transaDetailCtrl.init({
						container : self.container.find('.account-detail-box'),
						settleUnitID : self.settleUnitID
					});
				},
				render : function () {
					var self = this;
					self.view.render();
				}
			}, this);
		}
	});

	Hualala.Account.AccountMgrController = AccountMgrController; 

	/*交易明细控制器*/
	var TransactionDetailController = Stapes.subclass({
		constructor: function () {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = null;
			this.settleUnitID = null;
			this.model = new Hualala.Account.AccountTransListModel();
			this.view = new Hualala.Account.AccountTransListView();
			
		}
	});
	TransactionDetailController.proto({
		init : function (cfg) {
			var self = this;
			self.container = $XP(cfg, 'container', null);
			self.settleUnitID = $XP(cfg, 'settleUnitID', '');
			self.loadingModal = new LoadingModal({
				start : 100
			});
			if (!this.container || !this.model || !this.view) {
				throw("Account Transaction Detail Mgr Init Failed!!");
				return ;
			}
			self.bindEvent();
			self.model.init({
				
				groupID : $XP(self.get('sessionData'), 'site.groupID'),
				settleUnitID : self.settleUnitID
			});
			self.model.emit('load', {
				pageNo : 1, pageSize : 15,
				cbFn : function (model) {
					self.view.emit('init', {
						container : self.container,
						model : model
					});
					self.loadingModal.hide();
				}
			});
		},
		bindEvent : function () {
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = $XP(params, 'cbFn', function () {
						self.view.emit('render');
						self.loadingModal.hide();
					});
					self.loadingModal.show();
					this.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				init : function (cfg) {
					this.view.init(cfg);
				},
				render : function () {
					this.view.render();
				}
			}, this);
		}
	});
	Hualala.Account.TransactionDetailController = TransactionDetailController;
})(jQuery, window);
