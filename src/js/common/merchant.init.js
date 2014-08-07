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
			if ($XP(appData, 'resultcode') != 0) {
				throw("Session Data Load Faild!! resultcode = " + $XP(appData, 'resultcode', '') + "; resultMsg = " + $XP(appData, 'resultmsg', ''));
				return;	
			}
			loadSession($XP(appData, 'data', {}), function () {
				log("Merchant Sys INIT DONE in (ms): " + (IX.getTimeInMS() - tick));
				cbFn();
			});
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
	Hualala.init = function (cfg) {
		var config = $XP(cfg, 'config', {});
		if (APPInitialized) return;
		APPInitialized = true;
		currentType = $XP(cfg, 'type', 'main');

		initRouteEngine();
		switch(currentType) {
			case "login":
				// TODO login page
				break;
			case "main":
				// TODO home page
				initMainPage(function () {
					Hualala.Common.initPageLayout(config, currentType);
				});
				break;
			case "shop" :
				// TODO shop page
				initMainPage(function () {
					Hualala.Common.initPageLayout(config, currentType);
					Hualala.Common.initSiteNavBar(currentType);
				});
				break;
			case "setting":
				// TODO setting page
				initMainPage(function () {
					Hualala.Common.initPageLayout(config, currentType);
					Hualala.Common.initSiteNavBar(currentType);
				});
				break;
			case "account":
				// TODO account page
				initMainPage(function () {
					Hualala.Common.initPageLayout(config, currentType);
					Hualala.Common.initSiteNavBar(currentType);
				});
				break;
			case "user" :
				// TODO user manage page
				initMainPage(function () {
					Hualala.Common.initPageLayout(config, currentType);
					Hualala.Common.initSiteNavBar(currentType);
				});
				break;
			case "order":
				// TODO order page
				initMainPage(function () {
					Hualala.Common.initPageLayout(config, currentType);
					Hualala.Common.initSiteNavBar(currentType);
				});
				break;
			default :
				throw("What are u doing man!!");
				break;
		}
	};

})(jQuery, window);