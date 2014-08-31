(function ($, window) {
	IX.ns("Hualala.Account");
	var initAccountListPage = function () {
		var $body = $('#ix_wrapper > .ix-body > .container');
		var accountListPanel = new Hualala.Account.AccountListController({
			container : $body,
			view : new Hualala.Account.AccountListView(),
			model : new Hualala.Account.AccountListModel({
				callServer : Hualala.Global.queryAccount
			})
		});
		accountListPanel.emit('load', {
			pageNo : 1,
			pageSize : 15
		});
	};

	var initAccountMgrPage = function () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		var accountMgrCtrl = new Hualala.Account.AccountMgrController({
			container : $body,
			settleUnitID : $XP(ctx, 'params', [])[0],
			accountModel : new Hualala.Account.BaseAccountModel(),
			mgrView : new Hualala.Account.AccountMgrView(),
			transaDetailCtrl : new Hualala.Account.TransactionDetailController()
		});
		$body.html("<h1>结算账户管理页面</h1>");
	};

	Hualala.Account.AccountMgrInit = initAccountMgrPage;
	
	Hualala.Account.AccountListInit = initAccountListPage;
})(jQuery, window);