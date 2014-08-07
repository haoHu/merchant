(function () {
	var urlEngine = Hualala.urlEngine;
	// 为URL引擎重置素材图片根目录
	urlEngine.reset({imgUrl : Test.ImageRoot});
	// 为ajax 引擎重置站点根目录
	Hualala.ajaxEngine.reset({siteUrl : Test.SiteUrl});
	// 设置URL Map
	urlEngine.mappingUrls([
		// Common Image URL
		["img_logo", "/logo.png", "img"],
		["img_photo", "/common_photo.png", "img"],
		["img_blank", "/blank.png", "img"],
		["img_thumb", "/thumbnails/unknown.png", "img"],
		["img_docThumb", "/thumbnails/unknown.png", "img"],
		["common_fileThumbnail", "/files/{id}/thumbnail", "common"],

		// Common File URL (May be not this format)
		["fileUpload", "/api/disk_files"],
		["fileDownload", "/files/{id}/download"],

		// pages URL
		["logout", "/index.htm"],
		["login", "/login.htm"],
		// home page
		["main", "/index.htm"],
		// shop manage page
		["shop", "/shop.htm"],
		// shop setting page
		["setting", "/setting.htm"],
		// account manage page
		["account", "/account.htm"],
		// user manage page
		["user", "/user.htm"],
		// order statement page
		["order", "/order.htm"],
		// pcClient download page
		["pcclient", "/download.htm"],
		// 关于商户中心
		["about", "/about.htm"],
		// 联系我们
		["contact", "/contact.htm"]

		// ajax URL 维护一个表
		
	]);

	IX.ns("Hualala.Global");
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

	// get pcClient Download page url
	Hualala.Global.getPCClientDownloadPageUrl = function () {
		return urlEngine.genUrl("pcclient");
	};

	// get common default image url
	Hualala.Global.getDefaultImage = function (type) {return urlEngine.genUrl("img_" + type); };

	// check is current page
	Hualala.Global.isCurrentPage = function (pageType, params) {
		var curPath = document.location.pathname,
			path = urlEngine.genUrl(pageType, params);
		return curPath.indexOf(path) >= 0;
	};
})();