(function () {
	IX.ns("Hualala.Global");
	var urlEngine = Hualala.urlEngine;
	// 为URL引擎重置素材图片根目录
	urlEngine.reset({imgUrl : Test.ImageRoot});
	// 为ajax 引擎重置站点根目录
	Hualala.ajaxEngine.reset({siteUrl : Test.SiteUrl});
	/*var route = Hualala.Global.Route = [
		// pages URL
		// 退出
		["logout", "/index.htm"],
		// 登陆
		["login", "/login.htm"],
		// home page主页
		["main", "/index.htm"],

		// 店铺管理主页
		["shop", "/shop.htm"],
		// 创建店铺
		["shopCreate", "/shop.htm#create"],
		// 店铺信息管理
		["shopInfo", "/shop.htm?shopID={id}#info"],
		// 店铺菜单管理
		["shopMenu", "/shop.htm?shopID={id}#menu"],

		// 店铺功能设置页面
		["setting", "/setting.htm"],

		// 结算账户页面
		["account", "/account.htm"],
		// 结算账户设置页面
		["accountSetting", "/account.htm?accountID={id}#setting"],


		// 账号管理页面
		["user", "/user.htm"],
		// 订单报表页面
		["order", "/order.htm"],

		// PC客户端下载页面
		["pcclient", "/download.htm"],

		// 关于商户中心
		["about", "/about.htm"],

		// 联系我们
		["contact", "/contact.htm"]
	];*/
	var route = Hualala.Global.Route = [
		// 退出
		{name : "logout", path : "/logout.htm", reg : null},
		// 登陆
		{name : "login", path : "/login.htm", reg : null},

		// home page主页
		{name : "main", path : "/#home", reg : /home$/},

		// 店铺管理主页		
		{name : "shop", path : "/#shop", reg : /shop$/},
		// 创建店铺
		{name : "shopCreate", path : "/#shop/create", reg : /shop\/create$/},
		// 店铺信息管理
		{name : "shopInfo", path : "/#shop/{id}/info", reg : /shop\/(.*)\/info$/},
		// 店铺菜单管理
		{name : "shopMenu", path : "/#shop/{id}/menu", reg : /shop\/(.*)\/menu$/},

		// 店铺功能设置页面
		{name : "setting", path : "/#setting", reg : /setting$/},

		// 结算账户页面
		{name : "account", path : "/#account", reg : /account$/},
		// 结算账户详情设置页面
		{name : "accountDetail", path : "/#account/{id}/detail", reg : /account\/(.*)\/detail$/},

		// 账号管理页面
		{name : "user", path : "/#user", reg : /user$/},

		// 订单报表页面
		{name : "order", path : "/#order", reg : /order$/},

		// PC客户端下载页面
		{name : "pcclient", path : "/#download", reg : /download$/},

		// 关于商户中心
		{name : "about", path : "/#about", reg : /about$/},

		// 联系我们
		{name : "contact", path : "/#contact", reg : /contact$/}
	];
	// 设置URL Map
	urlEngine.mappingUrls(_.union([
		// Common Image URL
		["img_logo", "/logo.png", "img"],
		["img_gozap", "/gozap.png", "img"],
		["img_loginBanner", "/banner.jpg", "img"],
		["img_photo", "/common_photo.png", "img"],
		["img_blank", "/blank.png", "img"],
		["img_thumb", "/thumbnails/unknown.png", "img"],
		["img_docThumb", "/thumbnails/unknown.png", "img"],
		["common_fileThumbnail", "/files/{id}/thumbnail", "common"],

		// Common File URL (May be not this format)
		["fileUpload", "/api/disk_files"],
		["fileDownload", "/files/{id}/download"]
		// ajax URL 维护一个表
	], _.map(route, function (v, k, list) {
		return [v.name, v.path];
	})));

	
	// Socket URL (not using now)
	// Hualala.Global.socketUrl = Hualala.Global.HOME + '/pub';
	
	// get file upload api url
	Hualala.Global.getFileUploaderUrl = function () {
		return urlEngine.genUrl("fileUpload");
	};

	// get login page url
	Hualala.Global.getLoginJumpToUrl = function () {
		return urlEngine.genUrl("login");
	};

	Hualala.Global.getLogoutJumpToUrl = function () {
		return urlEngine.genUrl("logout");
	};

	// get pcClient Download page url
	Hualala.Global.getPCClientDownloadPageUrl = function () {
		return urlEngine.genUrl("pcclient");
	};

	// get common default image url
	Hualala.Global.getDefaultImage = function (type) {return urlEngine.genUrl("img_" + type); };

	// check is current page
	Hualala.Global.isCurrentPage = function (pageType, params) {
		// var curPath = document.location.pathname,
		// 	path = urlEngine.genUrl(pageType, params);
		// return curPath.indexOf(path) >= 0;
		var curHref = document.location.href,
			link = Hualala.PageRoute.createPath(pageType, params);
		return curHref.indexOf(link.replace(Hualala.Global.HOME, '')) >= 0;
	};
})();