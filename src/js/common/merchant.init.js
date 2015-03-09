(function ($, window) {
	IX.ns("Hualala");
	var sessionData = null;
	// 获取SessionData
	Hualala.getSessionData = function () {return sessionData;};
	Hualala.getSessionSite = function () {return $XP(sessionData, 'site', null); };
	Hualala.getSessionUser = function () {return $XP(sessionData, 'user', null); };
	Hualala.getSessionRoles = function () {return $XP(sessionData, 'roles', []); };
	Hualala.getSessionPCClient = function () {return $XP(sessionData, 'pcClient', null); };
	Hualala.getSessionUserRight = function () {return $XP(sessionData, 'userRight', [])};
	// 判断指定用户是否为当前登录用户
	Hualala.isSessionUser = function (groupLoginName, loginName) {
		var _name = $XP(sessionData, 'user.groupLoginName') + $XP(sessionData, 'user.loginName');
		return sessionData && _name == (groupLoginName + loginName);
	};

	function loadSession(appData, cbFn) {
		if (!$XP(appData, 'user', null)) {
			throw("Permission Deny!!");
			return;
		}
		sessionData = appData;
		cbFn();
	}

	function initMainPage(cbFn) {
		var tick = IX.getTimeInMS();
		log("Merchant Sys INIT : " + tick);
		Hualala.Global.loadAppData({}, function (appData) {
			log("Load Merchant APP Data in (ms): " + (IX.getTimeInMS() - tick));
			if ($XP(appData, 'resultcode') != '000') {
				sessionData = null;
				document.location.href = Hualala.PageRoute.createPath('login');
				throw("Session Data Load Faild!! resultcode = " + $XP(appData, 'resultcode', '') + "; resultMsg = " + $XP(appData, 'resultmsg', ''));
				return;	
			}
			loadSession($XP(appData, 'data', {}), function () {
				//log("Merchant Sys INIT DONE in (ms): " + (IX.getTimeInMS() - tick));
				cbFn();
			});
		}, function () {
			document.location.href = Hualala.PageRoute.createPath('login');
			return ;
		});
	}

	function initRouteEngine () {
		if (!IX.nsExisted("Hualala.ajaxEngine.init")) return;
		$.ajaxSetup({
			beforeSend : function (xhr) {
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		});
		Hualala.ajaxEngine.init({
			ajaxFn : jQuery.ajax,
			baseUrl : Hualala.Global.HOME,
			commonUrl : Hualala.Global.CommonSite,
			imgUrl : Hualala.Global.IMAGE_ROOT
		});
		// Hualala.urlEngine would be initialized as ajaxEngine was initialized! ignore urlEngine's initializing.
	};

	
	/**
	 * 商户系统整体加载
	 * @param  {Object} cfg {config:{}, type : "页面类型login|main|shop|setting|account|user..."}
	 * @return {NULL}     
	 */
	var APPInitialized = false, currentType;
	
	Hualala.init = function () {
		if (!APPInitialized) {
			initRouteEngine();
			
			// initMainPage(function () {
			// 	Hualala.PageRoute.start(function (pageName) {
			// 		var hasNoNavPages = 'main,pcclient,about,contact';
			// 		Hualala.Common.initPageLayout({}, pageName);
			// 		if (hasNoNavPages.indexOf(pageName) < 0) {
			// 			Hualala.Common.initSiteNavBar(pageName);
			// 		}
			// 	});
			// });

			Hualala.PageRoute.start(function (pageName, pageParams, pageInitFn) {
				var hasNoNavPages = 'main,pcclient,about,contact,login,boss';
				var commonPages = _.filter(hasNoNavPages.split(','), function (v) {return v != 'main'}).join(',');
				if (commonPages.indexOf(pageName) >= 0) {
					Hualala.Common.initPageLayout({}, pageName);
					if (hasNoNavPages.indexOf(pageName) < 0) {
						Hualala.Common.initSiteNavBar(pageName);
					}
					pageInitFn && pageInitFn.apply(null, [pageName, pageParams]);
					return ;
				}
				initMainPage(function () {
					Hualala.Common.initPageLayout({}, pageName);
					if (hasNoNavPages.indexOf(pageName) < 0) {
						Hualala.Common.initSiteNavBar(pageName);
					}

					pageInitFn && pageInitFn.apply(null, [pageName, pageParams]);
				});
			});
			
			APPInitialized = true;
		}
	};

})(jQuery, window);