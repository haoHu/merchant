(function ($, window) {
	IX.ns("Hualala.Common");
	function initPageLayout (pageCfg, pageType) {
		var session = Hualala.getSessionData(),
			layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_layout'));
		var isLogin = !$XP(Hualala.getSessionUser(), 'loginName', null) ? false : true,
			loginName = $XP(session, 'user.loginName', ''),
			groupName = $XP(session, 'site.groupName', '');
		var mapRanderData = function () {
			var header = {
				pcClientPath : Hualala.Global.getPCClientDownloadPageUrl(),
				hualalaUrl : Hualala.Global.HualalaWebSite,
				loginName : loginName,
				merchantRoot : Hualala.Global.HOME,
				groupName : groupName,
				isLogin : !isLogin ? 'hidden' : '',
				logoutPath : Hualala.Global.getLogoutJumpToUrl()
			},
			footer = {
				aboutPath : Hualala.urlEngine.genUrl("about") || '#',
				contactPath : Hualala.urlEngine.genUrl("contact") || '#'
			};
			return {
				header : header,
				footer : footer
			};
		};
		var $wrapper = $(layoutTpl(mapRanderData()));
		$('body > #ix_wrapper').remove();
		$wrapper.appendTo($('body'));
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
					path : Hualala.urlEngine.genUrl(v.name) || '#',
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

	Hualala.Common.initPageLayout = initPageLayout;
	Hualala.Common.initSiteNavBar = initSiteNavBar;
	Hualala.Common.HomePageInit = initHomePage;
})(jQuery, window);