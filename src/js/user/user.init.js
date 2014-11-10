(function ($, window) {
	IX.ns("Hualala.User");
	var initUserMgrPage = function () {
		var $body = $('#ix_wrapper > .ix-body > .container');
		var panel = new Hualala.User.UserListController({
			container : $body,
			model : new Hualala.User.UserListModel({callServer : Hualala.Global.queryShopGroupChildAccount}),
			view : new Hualala.User.UserListView()
		});
	};
	Hualala.User.UserListInit = initUserMgrPage;
})($, window);