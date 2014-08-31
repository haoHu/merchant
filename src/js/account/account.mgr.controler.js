(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
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
					self.view.emit('init');
				}
			});
		},
		// 控制器绑定事件
		bindEvent : function () {
			this.on({
				// 触发交易明细控制器进行查询
				query : function () {

				}
			}, this);
		}
	});

	Hualala.Account.AccountMgrController = AccountMgrController; 

	/*交易明细控制器*/
	var TransactionDetailController = Stapes.subclass({
		constructor: function () {

		}
	});
	Hualala.Account.TransactionDetailController = TransactionDetailController;
})(jQuery, window);
