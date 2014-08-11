(function ($, window) {
	IX.ns("Hualala.Common");
	function isSupportedBrowser () {
		var bd = Hualala.Common.Browser;
		var isIE = !$XP(bd, 'ie', null) ? false : true,
			version = parseInt($XP(bd, 'ie', 0));
		var allowOldVersion = IX.Cookie.get('allowOldVersion') == 1 ? true : false;
		if (!isIE || allowOldVersion) return true;
		if (version > 8) return true;
		var msg = version == 8 ? 
			'您使用的IE浏览器版本过于陈旧，可能无法获得我们为您提供的良好的用户体验。<br/>我们建议您使用以下的浏览器或插件进行访问！' : 
			'您使用的IE浏览器版本过于陈旧，无法使用我们为您提供的管理功能。<br/>请您使用以下提供的浏览器进行访问！';
		var browserLib = [
			{
				href : '',
				icon : '',
				name : 'IE10',
				desc : 'IE10浏览器是微软公司出品的现代浏览器，已经支持大部分HTML5，CSS3特性'
			},
			{
				href : '',
				icon : '',
				name : 'IE11',
				desc : 'IE11浏览器是微软公司出品的现代浏览器，已经支持绝大部分HTML5，CSS3特性'
			},
			{
				href : '',
				icon : '',
				name : 'Chrome',
				desc : 'Chrome浏览器是谷歌公司退出的现代浏览器，完全支持HTML5，CSS3标准的特性，具有更快的浏览网页速度。'
			},
			{
				href : '',
				icon : '',
				name : 'Firefox',
				desc : 'FireFox是Mozilla推出的现代浏览器，完全支持HTML5，CSS3标准的特性。'
			}
		];
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_browserSupport'));
		var $jumbotron = $(tpl({msg : msg, items : browserLib}));
		$('body > #ix_wrapper').remove();
		$jumbotron.appendTo($('body'));
		$jumbotron.find('.btn').click(function (e) {
			IX.Cookie.set('allowOldVersion', 1);
			Hualala.Router.check();
		});
		return false;
	}
	function initPageLayout (pageCfg, pageType) {
		var session = Hualala.getSessionData(),
			layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_layout'));
		var isLogin = !$XP(Hualala.getSessionUser(), 'loginName', null) ? false : true,
			loginName = $XP(session, 'user.loginName', ''),
			groupName = $XP(session, 'site.groupName', '');
		var mapRanderData = function () {
			var header = {
				pcClientPath : Hualala.PageRoute.createPath('pcclient'),
				hualalaUrl : Hualala.Global.HualalaWebSite,
				loginName : loginName,
				merchantRoot : Hualala.PageRoute.createPath('main'),
				groupName : groupName,
				// isLogin : !isLogin ? 'hidden' : '',
				isLogin : isLogin,
				logoutPath : Hualala.Global.getLogoutJumpToUrl(),
				logo : Hualala.Global.getDefaultImage('logo'),
			},
			footer = {
				aboutPath : Hualala.PageRoute.createPath("about") || '#',
				contactPath : Hualala.PageRoute.createPath("contact") || '#',
				gozapLogo : Hualala.Global.getDefaultImage('gozap')
			};
			return {
				header : header,
				footer : footer
			};
		};
		var $wrapper = $(layoutTpl(mapRanderData()));
		$('body > #ix_wrapper').remove();
		if (isSupportedBrowser()) {
			$wrapper.appendTo($('body'));
		}
		if ($.fn.bootstrapValidator) {
			$.fn.bootstrapValidator.DEFAULT_OPTIONS = $.extend({}, $.fn.bootstrapValidator.DEFAULT_OPTIONS, {
				message: '您输入的数据有误，请核对后再次输入',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				}
			});
		}
	}

	function initSiteNavBar (pageType) {
		var session = Hualala.getSessionData(),
			navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbar')),
			navToggleTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbarToggle'));
		var mapRanderData = function () {
			var navs = _.map(Hualala.TypeDef.SiteNavType, function (v, i, list) {
				return {
					active : !Hualala.Global.isCurrentPage(v.name) ? '' : 'active',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name) || '#',
					name : v.name,
					label : v.label,
				};
			});
			return {items : navs};
		};
		var $navbar = $(navTpl(mapRanderData())),
			$navToggle = $(navToggleTpl()),
			$header = $('#ix_wrapper .ix-header');
		$header.find('> .container .navbar-collapse').remove();
		$header.find('> .container').append($navbar);
		$header.find('> .container > .navbar-header .navbar-toggle').remove();
		$header.find('> .container > .navbar-header').prepend($navToggle);

	}

	function initHomePage (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html(
			'<div class="jumbotron">'+
				'<h1>这里是首页</h1>' +
				'<p>提供各个功能模块的入口按钮</p>' +
				
			'</div>'
			);
		// TODO Home Page 
	}

	function initLoginPage (pageType, params) {
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_login'));
		var $loginBox = $(tpl({
			bannerImg : Hualala.Global.getDefaultImage('loginBanner')
		}));
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html($loginBox);
		Hualala.Entry.initLogin($loginBox);
	}


	Hualala.Common.LoginInit = initLoginPage;
	Hualala.Common.initPageLayout = initPageLayout;
	Hualala.Common.initSiteNavBar = initSiteNavBar;
	Hualala.Common.HomePageInit = initHomePage;
	
})(jQuery, window);