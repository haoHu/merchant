(function () {
	IX.ns("Hualala.Global");
	var urlEngine = Hualala.urlEngine;
	urlEngine.reset({imgUrl : Hualala.Global.IMAGE_ROOT});
	Hualala.ajaxEngine.reset({
		siteUrl : Hualala.Global.HOME
	});
	urlEngine.mappingUrls([
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
		["fileDownload", "/files/{id}/download"],

		["logout", "/logout"]
		// ["about", "/about"],
		// ["contact", "/contact"]

	]);

	// Socket URL (not using now)
	// Hualala.Global.socketUrl = Hualala.Global.HOME + '/pub';
	
	// get file upload api url
	Hualala.Global.getFileUploaderUrl = function () {
		return urlEngine.genUrl("fileUpload");
	};

	Hualala.Global.getLogoutJumpToUrl = function () {
		return urlEngine.genUrl("logout");
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