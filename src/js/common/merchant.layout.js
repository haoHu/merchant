(function ($, window) {
	IX.ns("Hualala.Common");
	var pageBrickConfigs = [
		{name : 'setting', title : '业务', label : '开通业务•业务参数', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-setting'},
		{name : 'account', title : '结算', label : '账户设置•提现•结算报表', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-pay'},
		{name : 'order', title : '订单', label : '查询•报表•菜品排行', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-order'},
		{name : 'shop', title : '店铺', label : '开店•信息•菜谱', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-home'},

		{name : 'agent', title : '代理程序', label : '下载•监控', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-agent'},
		{name : 'user', title : '权限', label : '用户•权限', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-lock'},
        {name : 'weixin', title : '微信', label : '网络餐厅•营销', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-weixin'},
		{name : 'crm', title : '会员', label : '概览•报表•参数•营销', brickClz : 'home-brick-md-1', itemClz : 'brick-item', icon : 'icon-crm'},
		{name : 'mcm', title : '营销', label : '礼品•营销活动', brickClz : 'home-brick-md-2', itemClz : 'brick-item', icon : 'icon-mcm'}//,
        
        /*{brickClz : 'home-brick-md-3'},
        {brickClz : 'home-brick-md-1'},
		{name : 'boss', title : '老板通', label : '下载', brickClz : 'home-brick-md-2', itemClz : 'brick-item brick-item-low', icon : 'icon-boss'}*/
	];
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
				href : 'http://www.microsoft.com/zh-cn/download/internet-explorer-9-details.aspx',
				icon : 'icon-ie9',
				name : 'IE9',
				desc : 'IE9浏览器是微软公司在2009年推出的新一代浏览器，比IE8界面更简洁，采用硬件加速功能，使访问页面更稳定，部分支持HTML5，CSS3特性。'
			},
			{
				href : 'http://www.microsoft.com/zh-cn/download/internet-explorer-10-details.aspx',
				icon : 'icon-ie10',
				name : 'IE10',
				desc : 'IE10浏览器是微软公司在2011年推出的IE9的下一代浏览器，在IE9的基础上增强了CSS3解析及硬件加速功能，并支持了HTML5。'
			},
			{
				href : 'http://www.google.cn/intl/zh-CN/chrome/',
				icon : 'icon-chrome',
				name : 'Chrome',
				desc : 'Chrome浏览器是由著名的搜索引擎巨头--谷歌(google)公司推出的现代浏览器，访问网页速度更快，稳定性更强，更具安全性，使用界面更加简洁有效，并完全支持HTML5，CSS3标准的特性。'
			},
			{
				href : 'http://www.firefox.com.cn/download/',
				icon : 'icon-firefox',
				name : 'Firefox',
				desc : 'FireFox是Mozilla推出的现代浏览器，全面支持HTML5，CSS3标准的特性。访问页面速度更快，更具安全性。'
			},
			{
				href : 'http://ie.sogou.com/',
				icon : 'icon-sogou',
				name : '搜狗浏览器',
				desc : '搜狗浏览器是搜狐公司推出的双核告诉浏览器--可以切换为全球最快的Webkit内核(Chrome浏览器)同时也可以切换为使用最普遍的IE内核(IE浏览器)，保证良好的兼容性的同时极大的提升网页的浏览速度。'
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
			isSuperAdmin = false,
			groupName = $XP(session, 'site.groupName', '');
		var bindMobileWizard = IX.Cookie.get('bindMobileWizard') == 1 ? false : true;
		if ($XP(session, 'user.loginName') == 'admin' && _.find($XP(session, 'user.role', []), function (r) {return r == 'admin'})) {
			isSuperAdmin = true;
		}
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
				isSuperAdmin : isSuperAdmin
			},
			footer = {
				aboutPath : Hualala.PageRoute.createPath("about") || '#',
				contactPath : Hualala.PageRoute.createPath("contact") || '#',
				// aboutPath : Hualala.Global.getAboutUsUrl() || '#',
				// contactPath : Hualala.Global.getContactUsUrl() || '#',
				gozapLogo : Hualala.Global.getDefaultImage('gozap')
			};
			return {
				header : header,
				footer : footer
			};
		};
		var $wrapper = $(layoutTpl(mapRanderData()));
		var userMgr = null;
		$('body > #ix_wrapper').remove();
		if (isSupportedBrowser()) {
			$wrapper.appendTo($('body'));
            if(/main|pcclient|about|contact|login/.test(pageType))
                $wrapper.addClass('no-nav');
			if (isLogin) {
				userMgr = new Hualala.User.UserMgrModal({
					$btnGrp : $wrapper.find('.user-mgr')
				});
				if (bindMobileWizard && $XP(session, 'user.mobileBinded') == 0 && $XP(session, 'user.loginCount') == 1) {
					$wrapper.find('.user-mgr .btn[data-target=bind_mobile]').trigger('click');
					IX.Cookie.set('bindMobileWizard', 1);
				}
			}
			var footerAnimation = function (expand) {
				var $footer = $('#ix_wrapper .ix-footer');
				var $cnt = $footer.find('.footer-cnt');
				if ($footer.hasClass('in') == expand) return;
				$cnt.animate({
					height : !expand ? '0px' : '100px'
				}, 400, function () {
					$footer[!expand ? 'removeClass' : 'addClass']('in');
				});
			}
			// @NOTE: For 1.1 hidden site footer (#4105)
			// $('#ix_wrapper .ix-footer').on('mouseleave', function (e) {
			// 	footerAnimation(false);
			// });
			// $('#ix_wrapper .btn-toggle').on('mouseenter', function (e) {
			// 	footerAnimation(true);
			// });
			// footerAnimation(false);
		}
		if ($.fn.bootstrapValidator) {
			$.fn.bootstrapValidator.DEFAULT_OPTIONS = $.extend({}, $.fn.bootstrapValidator.DEFAULT_OPTIONS, {
				message: '您输入的数据有误，请核对后再次输入',
                trigger: 'blur',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				}
			});
			$.fn.bootstrapValidator.validators.accuracy = {
				validate : function (validator, $field, options) {
					var accuracy = $XP(options, 'accuracy', null),
						message = $XP(options, 'message', '');
					accuracy = isNaN(accuracy) ? null : accuracy;
					var value = $field.val();
					var regxStr = (IX.isEmpty(accuracy) || accuracy == 0) ? "^\\d+$" : "^\\d+(\\.\\d{1," + accuracy + "})?$",
						regX = null;
					regX = new RegExp(regxStr);
					if (isNaN(value)) {
						return {
							valid : false,
							message : "只能是数字"
						}
					}
					if (!regX.test(value)) {
						return {
							valid : false,
							message : message
						}
					}
					return true;
				}
			};
		}
	}

	function initSiteNavBar (pageType) {
		var session = Hualala.getSessionData(),
			navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbar')),
			navToggleTpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_navbarToggle')),
			rights = Hualala.getSessionUserRight();
		var mapRanderData = function () {
			var rightHT = new IX.IListManager();
			IX.iterate(rights, function (el) {
				rightHT.register(el.name, el);
			});
			// var navs = _.map(Hualala.TypeDef.SiteNavType, function (v, i, list) {
			// 	var hasRight = !rightHT.get(v.name) ? false : true;
			// 	return {
			// 		active : !Hualala.Global.isCurrentPage(v.name) ? '' : 'active',
			// 		disabled : !hasRight ? 'disabled' : '',
			// 		noPath : !hasRight ? true : false,
			// 		path : Hualala.PageRoute.createPath(v.name) || '#',
			// 		name : v.name,
			// 		label : v.label,
			// 	};
			// });
			var navs = _.map(Hualala.TypeDef.SiteNavType, function (v, i, list) {
				var hasRight = !rightHT.get(v.name) ? false : true;
                var currentPageName = Hualala.PageRoute.getPageContextByPath().name;
                var isMore = v.name == 'more';
				var subnavs = $XP(v, 'subnavs', []);
                var isMoreSubNav = false;
                for(var i = 0, subnav; subnav = subnavs[i++];)
                {
                    if(isMoreSubNav = (isMore && subnav.name == currentPageName)) break;
                }
                
				subnavs = _.map(subnavs, function (s) {
                    var hasRight = !rightHT.get(s.name) ? false : true;
                    var disabled = isMore && !hasRight ? 'disabled' : '';
					return {
						path : disabled ? 'javascript:;' : Hualala.PageRoute.createPath(s.name) || '#',
						name : s.name,
                        active: isMore && s.name == currentPageName ? 'active' : '',
                        disabled : disabled,
						label : s.label
					};
				});
                
				var list = {
					active : isMoreSubNav || !isMore && Hualala.Global.isCurrentPage(v.name) ? 'active' : '',
					disabled : isMore || hasRight ? '' : 'disabled',
					noPath : isMore || !hasRight ? true : false,
					path : isMore ? '#' : Hualala.PageRoute.createPath(v.name) || '#',
					name : v.name,
					label : v.label,
					isSubNav : v.type == 'subnav' ? true : false,
					subnavs : subnavs
				};
				return list;
			});
			return {items : navs};
		};
		var $navbar = $(navTpl(mapRanderData())),
			$navToggle = $(navToggleTpl({target : '#site_navbar'})),
			$header = $('#ix_wrapper .ix-header');
		$header.find('> .container .navbar-collapse').remove();
		$header.find('> .container').append($navbar);
		$header.find('> .container > .navbar-header .navbar-toggle').remove();
		$header.find('> .container > .navbar-header').prepend($navToggle);

	}

	function initHomePage (pageType, params) {
		var site = Hualala.getSessionSite(),
			user = Hualala.getSessionUser(),
			roles = Hualala.getSessionRoles(),
			pcclient = Hualala.getSessionPCClient(),
			rights = Hualala.getSessionUserRight();
		var $body = $('#ix_wrapper > .ix-body > .container');
		var mapRanderData = function () {
			var ht = new IX.IListManager();
			var ret = null;
			IX.iterate(rights, function (el) {
				ht.register(el.name, el);
			});
			ret = _.map(pageBrickConfigs, function (el, i, l) {
				var name = $XP(el, 'name');
				var hasRight = !ht.get(name) ? false : true;
				return IX.inherit(el, {
					itemClz : ($XP(el, 'itemClz', '') + ' ' + (!hasRight ? 'disabled' : ''))
				});
			});
			return ret;
		};
		// Home Page 
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_homepage'));
		var $bricks = $(tpl({bricks : mapRanderData()}));
		$body.html($bricks);
		$bricks.on('mouseenter mouseleave click', '.brick-item', function (e) {
			var $this = $(this), pageName = $this.attr('data-pagename'),
				eType = e.type;
			if ($this.hasClass('disabled')) return false;
			if (eType == 'click') {
				// console.info($this.attr('data-pagename'));
				document.location.href = Hualala.PageRoute.createPath(pageName);
			} else {
				$this.toggleClass('hover');
			}
			
		});
        
        var G = Hualala.Global,
            C = Hualala.Common,
            U = Hualala.UI;
        var $brand = $bricks.filter('#brandLogo'),
            $img = $brand.find('img').attr('src', G.IMAGE_ROOT + '/brand_logo.png');
        var brandLogoImg = '';
        C.loadData('getGroupInfo').done(function(records)
        {
            var logoPath = records[0].brandLogoImg;
            if(!logoPath) return;
            brandLogoImg = logoPath;
            var logoUrl = C.getSourceImage(logoPath, {width: 128, height: 128});
            $img.attr('src', logoUrl);
        });
        
        $brand.find('a').on('click', function()
        {
            var logoPath = '';
            var $dialog = U.uploadImg({
                    onSuccess: function (imgPath){ logoPath = imgPath; },
                    minSize: '128',
                    saveSize: '512'
                });
            
            $dialog.find('.modal-content').append('<div class="modal-footer"><button class="btn btn-warning btn-ok">保存</button></div>');
            
            $dialog.on('click', '.btn-ok', function()
            {
                if(!logoPath)
                {
                    U.TopTip({msg: '请先上传logo图片！'});
                    return;
                }
                
                var params = {brandLogoImg: logoPath, brandLogoHWP: 1};
                C.loadData('setBrandLogo', params, null, false)
                .done(function()
                {
                    U.TopTip({msg: '保存成功！', type: 'success'});
                    brandLogoImg = logoPath;
                    var logoUrl = C.getSourceImage(brandLogoImg, {width: 128, height: 128});
                    $img.attr('src', logoUrl);
                    $dialog.modal('hide');
                });
            });
            
        });
	}

	function initLoginPage (pageType, params) {
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_login'));
		var $loginBox = $(tpl({
			bannerImg : Hualala.Global.getDefaultImage('loginBanner')
		}));
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html($loginBox);
		var loginPanel = new Hualala.Entry.initLogin({
			$container : $loginBox
		});
	}

	function initAboutPage (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body');
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_about'));
		var $page = $(tpl());
		$page.replaceAll($body);
	}

	function initContactPage (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body');
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_contact'));
		var $page = $(tpl());
		$page.replaceAll($body);
	}

	function initPCClientDownloadPage () {
		var $body = $('#ix_wrapper > .ix-body');
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_client_download'));
		var sessionData = Hualala.getSessionData();

		var $page = $(tpl({
			href : $XP(sessionData, 'pcClient.downloadClientAddress', '#'),
			title : $XP(sessionData, 'pcClient.version', ''),
		}));
		$page.replaceAll($body);
	}


	Hualala.Common.LoginInit = initLoginPage;
	Hualala.Common.initPageLayout = initPageLayout;
	Hualala.Common.initSiteNavBar = initSiteNavBar;
	Hualala.Common.HomePageInit = initHomePage;
	Hualala.Common.AboutInit = initAboutPage;
	Hualala.Common.ContactInit = initContactPage;
	Hualala.Common.PCClientDownloadInit = initPCClientDownloadPage;
	

	Hualala.Common.IndexInit = function () {
		document.location.href = Hualala.PageRoute.createPath("main");
	}
	
})(jQuery, window);