(function ($, window) {
	IX.ns("Hualala");
	var TemplateList = new IX.IListManager();
	// 顶部提示框模板
	var tpl_site_toptip = [
		'<div id="site_toptip_{{id}}" class="site-toptip alert alert-{{type}} fade in">',
			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>',
			'<p>{{msg}}</p>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_toptip', tpl_site_toptip);

	// 页面整体Layout模板
	var tpl_site_layout = [
		'<div id="ix_wrapper">',
			// Header
			'<div class="navbar navbar-default navbar-fixed-top ix-header" role="navigation">',
				'<div class="header-line clearfix">',
					'<div class="container">',
						'<div class="hidden-xs pull-left">',
							'<a href="{{header.pcClientPath}}" target="_blank">哗啦啦PC客户端</a>',
							'<a href="{{header.hualalaUrl}}" target="_blank">访问哗啦啦网站</a>',
						'</div>',
						'<div class="pull-right {{header.isLogin}}">',
							'<span class="hello">Hi</span><span class="user">{{header.loginName}},</span>',
							'<a class="logout" href="{{header.logoutPath}}">退出</a>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="container">',
					'<div class="navbar-header">',
						'<a class="navbar-brand logo" href="{{header.merchantRoot}}" title="哗啦啦商户中心"><img alt="哗啦啦商户中心" src="" /></a>',
						'<h1 class="ix-group-brand">{{header.groupName}}</h1>',
					'</div>',
				'</div>',
			'</div>',
			// Body
			'<div class="ix-body">',
				'<div class="container">',
				'</div>',
			'</div>',
			// Footer
			'<div class="ix-footer navbar-fixed-bottom">',
				'<div class="container">',
					'<p class="links">',
						'<a href="{{footer.aboutPath}}">关于哗啦啦商户中心</a>',
						'<a href="{{footer.contactPath}}">联系我们</a>',
					'</p>',
					'<p class="copyright">',
						'<img alt="Gozap" src=""/>',
						'<span class="">&nbsp;旗下网站&nbsp;&copy;&nbsp;2014&nbsp;hualala.com&nbsp;京IPC备14019284号-3</span>',
					'</p>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_layout', tpl_site_layout);

	// 站点导航栏
	var tpl_site_navbar = [
		'<div class="navbar-collapse collapse">',
			'<ul class="nav nav-justified nav-pills navbar-right">',
				'{{#each items}}',
				'<li class="{{active}} {{disabled}}">',
					'<a href="{{path}}" data-page-type="{{name}}">{{label}}</a>',
				'</li>',
				// <li class="active"><a href="#">店铺管理</a></li>
				// <li class=""><a href="#about">结算</a></li>
				// <li><a href="#contact">订单</a></li>
				// <li><a href="#contact">业务设置</a></li>
				// <li><a href="#contact">帐号管理</a></li>
				'{{/each}}',
			'</ul>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_navbar', tpl_site_navbar);

	// 小屏幕下，站点导航栏的触发按钮
	var tpl_site_navbarToggle = [
		'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">',
			'<span class="sr-only">Toggle navigation</span>',
			'<span class="icon-bar"></span>',
			'<span class="icon-bar"></span>',
			'<span class="icon-bar"></span>',
		'</button>'
	].join('');
	TemplateList.register('tpl_site_navbarToggle', tpl_site_navbarToggle);

	// 嗅探到低版本IE浏览器后，给出高级浏览器的下载链接和相关友好提示
	var tpl_site_browserSupport = [
		'<div id="ix_wrapper">',
			'<div class="container">',
				'<div class="jumbotron support-box">',
					'<h1>让管理店铺变得更加高大上</h1>',
					'<p>{{{msg}}}</p>',
					'<p>',
						'<ul class="media-list">',
						'{{#each items}}',
							'<li class="media">',
								'<a class="pull-left" href="{{href}}">',
									'<img src="{{icon}}" alt="{{name}}" width="60" height="60" />',
								'</a>',
								'<div class="media-body">',
									'<h4 class="media-heading">',
										'<a href="{{href}}">{{name}}</a>',
									'</h4>',
									'<p>{{desc}}</p>',
								'</div>',
							'</li>',
						'{{/each}}',
						'</ul>',
					'</p>',
					'<p><a class="btn btn-primary btn-lg pull-right" role="button">跳过提示，继续访问</a></p>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_browserSupport', tpl_site_browserSupport);

	var TplLib = function () {
		return {
			register : function (key, tpl) {
				if (!TemplateList.hasKey(key)) {
					TemplateList.register(key, tpl);
				} else {
					throw("This key has registed!!!");
				}
			},
			get : function (key) {
				if (!TemplateList.hasKey(key)) {
					throw("There are no template that is named " + key);
				} else {
					return TemplateList.getByKeys([key])[0];
				}
			}
		};
	};

	Hualala.TplLib = new TplLib();
})(jQuery, window);