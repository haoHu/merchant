/** 
 * -------------------------------------------------
 * Copyright (c) 2014, All rights reserved. 
 * Hualala-Merchant-Management
 * 
 * @version : 0.1.0
 * @author : HuHao
 * @description : Hualala Merchant Management System.  
 * -------------------------------------------------
 */ 

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

	// 模态窗口模板
	var tpl_modal_dialog = [
		'<div class="modal fade {{clz}}" id="{{id}}">',
			'<div class="modal-dialog">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h4 class="modal-title">{{title}}</h4>',
					'</div>',
					'<div class="modal-body"></div>',
					'<div class="modal-footer"></div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_modal_dialog', tpl_modal_dialog);

	// 页面整体Layout模板
	var tpl_site_layout = [
		'<div id="ix_wrapper">',
			// Header 
            // @NOTE: 
			'<div class="navbar navbar-default navbar-fixed-top ix-header" role="navigation">',
				'<div class="header-line clearfix">',
					'<div class="container">',
						'<div class="hidden-xs pull-left">',
							'<a href="{{header.pcClientPath}}" target="_blank"><span class="icon-pcclient"></span>哗啦啦PC客户端</a>',
							'<a href="{{header.hualalaUrl}}" target="_blank"><span class="icon-jumpsite"></span>访问哗啦啦网站</a>',
						'</div>',
						'{{#if header.isLogin}}',
						'<div class="pull-right">',
							'<span class="hello">Hi</span><span class="user">{{header.loginName}},</span>',
							'<a class="logout" href="{{header.logoutPath}}">退出</a>',
						'</div>',
						'{{else}}',
						'<div class="pull-right">',
							'<span class="hello">Hi,</span><span class="">欢迎来到哗啦啦商户中心</span>',
						'</div>',
						'{{/if}}',
					'</div>',
				'</div>',
				'<div class="container">',
					'<div class="navbar-header">',
						'<a class="navbar-brand logo" href="{{header.merchantRoot}}" title="哗啦啦商户中心"><img alt="哗啦啦商户中心" src="{{header.logo}}" /></a>',
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
             // @NOTE: 开发阶段隐藏页脚
			'<div class="ix-footer navbar-fixed-bottom hidden">',
				'<div class="container">',
					'<p class="links">',
						'<a href="{{footer.aboutPath}}">关于哗啦啦商户中心</a>',
						'<a href="{{footer.contactPath}}">联系我们</a>',
					'</p>',
					'<p class="copyright">',
						'<img alt="Gozap" src="{{footer.gozapLogo}}"/>',
						'<span class="">&nbsp;旗下网站&nbsp;&copy;&nbsp;2014&nbsp;hualala.com&nbsp;京IPC备14019284号-3</span>',
					'</p>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_layout', tpl_site_layout);

	// 站点导航栏
	var tpl_site_navbar = [
		'<div class="navbar-collapse collapse" id="site_navbar">',
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
		// '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">',
		'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="{{target}}">',
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
					'<p class="clearfix"><a class="btn btn-primary btn-lg pull-right" role="button">跳过提示，继续访问</a></p>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_browserSupport', tpl_site_browserSupport);

	// 登录页面
	var tpl_site_login = [
		'<div class="jumbotron login-box">',
			'<div class="row">',
				'<div class="hidden-xs col-sm-7 col-md-7 col-lg-7 login-pic">',
					'<img alt="pic" src="{{bannerImg}}" />',
				'</div>',
				'<div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">',
					'<div class="panel panel-warning panel-login">',
						'<div class="panel-heading">',
							'<h3 class="panel-title">立即登录</h3>',
						'</div>',
						'<div class="panel-body">',

							'<div class="form-horizontal">',
								'<!-- Text input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="group_name" name="group_name" type="text" placeholder="请输入集团主账号" class="form-control input-md" >',
									'</div>',
								'</div>',
								'<!-- Text input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="group_subname" name="group_subname" type="text" placeholder="请输入集团子账号" class="form-control input-md" >',
									'</div>',
								'</div>',
								'<!-- Password input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="login_pwd" name="login_pwd" type="password" placeholder="请输入登录密码" class="form-control input-md" >',
									'</div>',
								'</div>',
								'<!-- Auth code input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-xs-8 col-md-7 col-lg-7">',
										'<input id="login_auth" name="login_auth" type="text" placeholder="请输入验证码" class="form-control input-md" >',
									'</div>',
									'<div class="col-xs-2 col-md-2 col-lg-2">',
										'<div class="ix-authcode">',
											'<img alt="动态验证码" class="auth-img hidden" src=""/>',
											// '<input type="hidden" name="auth_code" id="auth_code" />',
											'<div class="progress ">',
												'<div class="progress-bar progress-bar-warning progress-bar-striped active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">',
													// '<span class="sr-only">45% Complete</span>',
												'</div>',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
								'<!-- Button -->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<button type="submit" id="login_sub" name="login_sub" class="btn btn-warning btn-lg form-control ">登录</button>',
										'<div class="progress hidden">',
											'<div class="progress-bar progress-bar-warning progress-bar-striped active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">',
												// '<span class="sr-only">45% Complete</span>',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_login', tpl_site_login);

	// 首页
	var tpl_site_homepage = [
		'<div class="home-page home-brick">',
			'{{#each bricks}}',
				'<div class="{{brickClz}}">',
					'<div class="{{itemClz}} x-mul-vertical-middle"  data-pagename="{{name}}">',
						'<div class="item  x-v-m-out">',
							'<div class="x-v-m-in">',
								'<div class="format">',
									'<span class="{{icon}}"></span>',
									'<h3>{{title}}</h3>',
									'<p class="hidden-xs">{{label}}</p>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'{{/each}}',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_homepage', tpl_site_homepage);

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
})(jQuery, window);;(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;

	var tpl_shop_filter = [
		'<div class="{{type}}">',
			'<span class="label">{{name}}</span>',
			'{{#each items}}',
				'<a class="btn btn-link {{focusClz}}" href="javascript:void(0);" data-{{type}}="{{code}}">',
					'{{name}}',
					'{{#if count}}',
						'<i class="num">({{count}})</i>',
					'{{/if}}',
				'</a>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_filter', tpl_shop_filter);

	var tpl_shop_query = [
		'<div class="shop-query {{clz}}">',
			'<div class="filter">',
				'{{#with shopCity}}',
				'{{> shopCity}}',
				'{{/with}}',
				// '{{> shopArea}}',
			'</div>',
			'<nav class="navbar navbar-default query" role="query">',
				'<div class="container-fluid">',
					'<div class="navbar-header">',
						'{{#with toggle}}',
						'{{> toggle}}',
						'{{/with}}',
						'<a class="navbar-brand" href="javascript:void(0);">查询店铺</a>',
					'</div>',
					'<div class="collapse navbar-collapse" id="shop_query">',
						'<div class="navbar-form navbar-left" role="search">',
							'<select class="hidden">',
								'{{#each optGrp}}',
									'<optgroup label="{{name}}">',
										'{{#each items}}',
											'<option value="{{code}}">{{name}}</option>',
										'{{/each}}',
									'</optgroup>',
								'{{/each}}',
							'</select>',
							'<div class="input-group">',
								'<input type="text" class="form-control" autocomplete="off" />',
								'<span class="input-group-btn">',
									'<button class="btn btn-default">查询</button>',
								'</span>',
							'</div>',
						'</div>',
						'{{#if needShopCreate}}',
							'<button class="btn btn-warning create-shop pull-right" style="margin-top:8px;">创建店铺</button>',
						'{{/if}}',
					'</div>',
				'</div>',
			'<nav>',
		'</div>',

		/*<div class="shop-query">',
			'<div class="filter">',
				'<div class="city">',
					'<span class="label">城市：</span>',
					'<a class="btn btn-link disabled">全部</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
				'</div>',
				'<div class="area">',
					'<span class="label">区域：</span>',
					'<a class="btn btn-link disabled">全部</a>',
					'<a class="btn btn-link">海淀</a>',
					'<a class="btn btn-link">朝阳</a>',
					'<a class="btn btn-link">大兴</a>',
					'<a class="btn btn-link">回龙观</a>',
					'<a class="btn btn-link">昌平</a>',
					'<a class="btn btn-link">龙泽</a>',
					'<a class="btn btn-link">顺义</a>',
				'</div>',
			'</div>',
			'<nav class="navbar navbar-default query" role="navigation">',
				'<div class="container-fluid">',
					'<div class="navbar-header">',
						'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#shop_query">',
							'<span class="sr-only">Toggle navigation</span>',
							'<span class="icon-bar"></span>',
							'<span class="icon-bar"></span>',
							'<span class="icon-bar"></span>',
						'</button>',
						'<a class="navbar-brand" href="javascript:void(0);">查询店铺</a>',
					'</div>',
					'<div class="collapse navbar-collapse" id="shop_query">',
						'<div class="navbar-form navbar-left" role="search">',
							'<div class="input-group">',
								'<input type="text" class="form-control" autocomplete="off" />',
								'<span class="input-group-btn">',
									'<button class="btn btn-default">查询</button>',
								'</span>',
							'</div>',
						'</div>',
						'<button class="btn btn-warning create-shop pull-right" style="margin-top:8px;">创建店铺</button>',
					'</div>',
				'</div>',
			'</nav>',
		'</div>*/
	].join('');
	TplLib.register('tpl_shop_query', tpl_shop_query);

	var tpl_shop_tags = [
		'<div class="tags">',
			'{{#each tags}}',
				'<span class="label {{clz}}" title="{{tag}}">{{tag}}</span>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_tags', tpl_shop_tags);

	var tpl_shop_list_item = [
		'<div class="shop-list-item col-xs-12 {{clz}} ">',
			'<div class="row shop-base-info">',
				'<div class="col-xs-6 col-sm-3 col-md-2">',
					'<h4>{{shopName}}</h4>',
				'</div>',
				'<div class="hidden-xs col-sm-4 col-md-7 ">',
					'<div class="account {{hideAccount}}">',
						'<label class="account-label">结算账户：</label>',
						'<span class="account-name">{{settleName}}</span>',
					'</div>',
				'</div>',
				'<div class="col-xs-6 col-sm-5 col-md-3">',
					'<div class="switcher-wrapper pull-right">',
						'<label class="">店铺当前状态：</label>',
						'<input type="checkbox" name="{{switcherName}}" data-shop="{{shopID}}" {{shopOpen}} />',
					'</div>',
				'</div>',
			'</div>',
			'{{#each business}}',
			'<div class="row shop-business">',
				'<div class="col-xs-6 col-sm-3 col-md-2">',
					'<h4>',
						'<span class="{{icon}}"></span>',
						'{{label}}',
					'</h4>',
				'</div>',
				'<div class="col-xs-6 col-sm-2 col-md-2">',
					'<div class="switcher-wrapper">',
						'<input type="checkbox" name="{{switcherName}}" data-shop="{{shopID}}" data-business="{{type}}" data-business-id="{{id}}" {{open}} />',
					'</div>',
				'</div>',
				'<div class="col-xs-12 col-sm-6 col-md-7">',
					'<p>{{desc}}</p>',
				'</div>',
				'<div class="col-xs-12 col-sm-1 col-md-1">',
					'<button type="button" class="btn btn-default pull-right" name="business_edit" data-shop="{{shopID}}" data-business="{{type}}"  data-business-id="{{id}}">修改</button>',
				'</div>',
			'</div>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_list_item', tpl_shop_list_item);

	var tpl_shop_card = [
		'<div class="panel panel-default ix-card shop-card {{clz}}" >',
			'<div class="panel-heading ix-card-header">',
				'<h4 class="panel-title">{{name}}</h4>',
			'</div>',
			'<div class="panel-body ix-card-body">',
				'<div class="media">',
					'<a class="pull-left" href="javascript:void(0);">',
						'<img class="media-object" alt="{{name}}" src="{{img}}" />',
					'</a>',
					'<div class="media-body">',
						'{{> shopTag}}',
						'<address title="{{address}}">{{slugAddr}}</address>',
						'<div class="phone">{{tel}}</div>',
					'</div>',
					'<div class="btns pull-right">',
						'<a href="javascript:void(0);" class="btn btn-default shop-info" data-href="{{infoHref}}">',
							'修改店铺信息',
						'</a>',
						'<a href="javascript:void(0);" class="btn btn-default shop-menu" data-href="{{menuHref}}">',
							'菜谱管理',
						'</a>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="panel-footer ix-card-footer">',
				'<label>店铺当前状态：</label>',
				'<input type="checkbox" name="switcher" data-shop="{{id}}" class="shop-switch" {{checked}} />',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_card', tpl_shop_card);

	var tpl_shop_list = [
		'{{#with shopCard}}',
			'{{#each list}}',
			'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">',
				'{{> shopCard}}',
			'</div>',
			'{{/each}}',
		'{{/with}}',
		'{{#with shopItem}}',
			'{{#each list}}',
				'{{> shopItem}}',
			'{{/each}}',
		'{{/with}}'
	].join('');
	TplLib.register('tpl_shop_list', tpl_shop_list);

	var tpl_shop_list_layout = [
		'<div class="shop-list">',
			'<div class="row shop-list-body">',
			'</div>',
			'<div class="shop-list-footer">',
				'<div class="page-selection pull-right"></div>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_list_layout', tpl_shop_list_layout);

	var tpl_shop_service_form_layout = [
		'<form class="form-horizontal {{formClz}}" role="form">',
			'{{#each items}}',
				'{{#checkFormElementType type type="combo"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<select id="{{id}}" name="{{name}}" class="form-control"  data-type="{{type}}">',
								'{{#each options}}',
									'<option value="{{value}}" {{selected}}>{{label}}</option>',
								'{{/each}}',
							'</select>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="text"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'{{#isInputGroup prefix surfix}}',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon">',
											'{{{prefix}}}',
										'</span>',
									'{{/if}}',
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'{{else}}',
								'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
							'{{/isInputGroup}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="switcher"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'<input type="checkbox" id="{{id}}" name="{{name}}" value="{{defaultVal}}" data-type="{{type}}" data-onLabel="{{onLabel}}" data-offLabel="{{offLabel}}" {{checked}} />',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="section"}}',
					'<div class="form-group section">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'{{#with min}}',
							'<div class="min-input {{clz}}">',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon">',
											'{{{prefix}}}',
										'</span>',
									'{{/if}}',
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'</div>',
						'{{/with}}',
						'{{#with max}}',
							// '<div class="col-sm-1 hidden-xs hidden-sm"><span class="to-label">到</span></div>',
							'<div class="max-input {{clz}}">',
								'<span class="to-label hidden-xs hidden-sm">到</span>',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon">',
											'{{{prefix}}}',
										'</span>',
									'{{/if}}',
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'</div>',
						'{{/with}}',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="hidden"}}',
					'<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" />',
				'{{/checkFormElementType}}',
			'{{/each}}',
		'</form>'
	].join('');
	TplLib.register('tpl_shop_service_form_layout', tpl_shop_service_form_layout);

	var tpl_shop_modal_btns = [
		'{{#each btns}}',
			'<button type="button" class="btn {{clz}}" name="{{name}}">{{label}}</button>',
		'{{/each}}'
	].join('');
	TplLib.register('tpl_shop_modal_btns', tpl_shop_modal_btns);
})(jQuery, window);