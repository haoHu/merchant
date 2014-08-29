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
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html("<h1>结算账户管理页面</h1>")
	};

	Hualala.Account.AccountMgrInit = initAccountMgrPage;
	
	Hualala.Account.AccountListInit = initAccountListPage;
})(jQuery, window);