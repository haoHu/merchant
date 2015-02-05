(function ($, window) {
	IX.ns("Hualala");
	var TemplateList = new IX.IListManager();
	// 顶部提示框模板
	var tpl_site_toptip = [
		'<div id="site_toptip_{{id}}" class="site-toptip alert alert-{{type}} fade in">',
			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">',
				'<span aria-hidden="true">&times;</span>',
				'<span class="sr-only">关闭</span>',
			'</button>',
			'<p>{{msg}}</p>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_toptip', tpl_site_toptip);

	// 模态窗口模板
	var tpl_modal_dialog = [
		'<div class="modal fade {{clz}}" id="{{id}}" data-backdrop="{{backdrop}}">',
			'<div class="modal-dialog">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h4 class="modal-title">{{title}}</h4>',
					'</div>',
					'<div class="modal-body"></div>',
					'<div class="modal-footer">',
                        '<button class="btn btn-default btn-close" data-dismiss="modal">取消</button>',
                        '<button class="btn btn-warning btn-ok">保存</button>',
                    '</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_modal_dialog', tpl_modal_dialog);

	var tpl_empty_placeholder = [
		'<div class="alert alert-warning {{clz}}" role="alert">',
			'<strong>{{{msg}}}</strong>',
		'</div>'
	].join('');
	TemplateList.register('tpl_empty_placeholder', tpl_empty_placeholder);

	// 页面整体Layout模板
	var tpl_site_layout = [
		'<div id="ix_wrapper">',
			// Header 
            // @NOTE: 
			'<div class="navbar navbar-default navbar-fixed-top ix-header" role="navigation">',
				'<div class="header-line clearfix">',
					'<div class="container">',
						// @NOTE: for 1.1 delete top bar link and add site logo
						// '<div class="hidden-xs pull-left">',
						// 	// '<a href="{{header.pcClientPath}}" target="_blank"><span class="icon-pcclient"></span>哗啦啦PC客户端</a>',
						// 	'<a href="{{header.hualalaUrl}}" target="_blank"><span class="icon-jumpsite"></span>访问哗啦啦网站</a>',
						// '</div>',
						'<div class=" pull-left">',
							'<a class="logo" href="{{header.merchantRoot}}" title="哗啦啦商户中心">',
								'<img alt="哗啦啦商户中心" src="{{header.logo}}" />',
							'</a>',
							'<h1 class="ix-group-brand ">{{header.groupName}}</h1>',
						'</div>',
						'{{#if header.isLogin}}',
						'<div class="pull-right hidden">',
							'<span class="hello">Hi</span><span class="user">{{header.loginName}},</span>',
							'<a class="logout" href="{{header.logoutPath}}">退出</a>',
						'</div>',
						'<div class="nav navbar-nav navbar-right user-mgr">',
							'<div class="dropdown">',
								'<a id="user_mgr" class="btn btn-link user" href="javascript:void(0);"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
									'{{header.loginName}}',
									'<span class="caret"></span>',
								'</a>',
								'<ul class="dropdown-menu" role="menu" aria-labelledby="user_mgr">',
									'{{#if header.isSuperAdmin}}',
									'{{else}}',
										'<li>',
											'<a class="btn btn-link btn-block" href="javascript:void(0);" data-target="bind_mobile">绑定手机</a>',
										'</li>',
									'{{/if}}',
									'<li>',
										'<a class="btn btn-link btn-block" href="javascript:void(0);" data-target="reset_pwd">重置密码</a>',
									'</li>',
									'<li class="divider"></li>',
									'<li>',
										'<a class="btn btn-link btn-block logout" href="{{header.logoutPath}}">退出</a>',
									'</li>',
								'</ul>',
							'</div>',
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
						// @NOTE for 1.1 delete site logo in navbar and move to topbar
						// '<a class="navbar-brand logo" href="{{header.merchantRoot}}" title="哗啦啦商户中心"><img alt="哗啦啦商户中心" src="{{header.logo}}" /></a>',
						// '<h1 class="ix-group-brand">{{header.groupName}}</h1>',
					'</div>',
				'</div>',
			'</div>',
			// Body
			'<div class="ix-body">',
				'<div class="container">',
				'</div>',
			'</div>',
			// Footer
             // @NOTE: For 1.1 hidden site footer (#4105)
			'<div class="ix-footer navbar-fixed-bottom in hidden">',
				'<div class="btn-toggle">',
					'<div class="toggle-icon"><span></span></div>',
				'</div>',
				'<div class="container footer-cnt">',
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
					'{{#if isSubNav}}',
						'<li class="dropdown {{active}} {{disabled}}">',
							'{{#if disabled}}',
								'<a class="" href="javascript:void(0);" data-page-type="{{name}}">{{label}}',
									'<span class="caret"></span>',
								'</a>',
							'{{else}}',
								'<a class="dropdown-toggle " data-toggle="dropdown" data-page-type="{{name}}" href="javascript:void(0);">',
									'{{label}}',
									'<span class="caret"></span>',
								'</a>',
								'<ul class="dropdown-menu" role="menu">',
								'{{#each subnavs}}',
									'<li class="">',
										'<a href="{{path}}" data-page-type="{{name}}" >{{label}}</a>',
									'</li>',
								'{{/each}}',
								'</ul>',
							'{{/if}}',
						'</li>',
					'{{else}}',
						'<li class="{{active}} {{disabled}}">',
							'{{#if noPath}}',
								'<a href="javascript:void(0);" data-page-type="{{name}}" >{{label}}</a>',
							'{{else}}',
								'<a href="{{path}}" data-page-type="{{name}}" >{{label}}</a>',
							'{{/if}}',
						'</li>',
					'{{/if}}',
					
				// <li class="active"><a href="#">店铺管理</a></li>',
				// <li class=""><a href="#about">结算</a></li>',
				// <li><a href="#contact">订单</a></li>',
				// <li><a href="#contact">业务设置</a></li>',
				// <li><a href="#contact">帐号管理</a></li>',
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
					'<h1 class="mb-12">让管理店铺变得更加高大上',
                        '<a class="btn btn-primary btn-lg pull-right" role="button">跳过提示，继续访问</a>',
                    '</h1>',
					'<p>{{{msg}}}</p>',
					'<p>',
						'<ul class="media-list">',
						'{{#each items}}',
							'<li class="media">',
								'<a class="media-left " href="{{href}}" target="_blank">',
									// '<img src="{{icon}}" alt="{{name}}" width="64" height="64" />',
									'<span class="{{icon}}" alt="{{name}}" ></span>',
								'</a>',
								'<div class="media-body">',
									'<h3 class="media-heading">',
										'<a href="{{href}}"><strong>{{name}}</strong></a>',
									'</h3>',
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
										'<input id="group_name" name="group_name" type="text" placeholder="请输入主账号" class="form-control input-md" tabIndex="1">',
									'</div>',
								'</div>',
								'<!-- Text input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="group_subname" name="group_subname" type="text" placeholder="请输入子账号" class="form-control input-md" tabIndex="2" >',
									'</div>',
								'</div>',
								'<!-- Password input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="login_pwd" name="login_pwd" type="password" placeholder="请输入登录密码" class="form-control input-md" tabIndex="3" >',
									'</div>',
								'</div>',
								'<!-- Auth code input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-xs-8 col-sm-8 col-md-7 col-lg-7">',
										'<input id="login_auth" name="login_auth" type="text" placeholder="请输入验证码" class="form-control input-md" tabIndex="4" >',
									'</div>',
									'<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">',
										'<div class="ix-authcode">',
											'<img alt="动态验证码" class="auth-img pull-right hidden" src=""/>',
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
										'<button type="submit" id="login_sub" name="login_sub" class="btn btn-warning btn-lg btn-block " tabIndex="5">登录</button>',
										'<div class="progress hidden">',
											'<div class="progress-bar progress-bar-warning progress-bar-striped active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">',
												// '<span class="sr-only">45% Complete</span>',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<a class="btn btn-link pull-left btn-change-mode" data-mode="mobile" href="javascript:void(0);">忘记密码？</a>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="panel panel-warning panel-forget-pwd hidden">',
						'<div class="panel-heading">',
							'<h3 class="panel-title">手机动态密码登录</h3>',
						'</div>',
						'<div class="panel-body">',
							'<div class="form-horizontal">',
								'<!-- Text input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="group_name" name="group_name" type="text" placeholder="请输入主账号" class="form-control input-md" tabIndex="1">',
									'</div>',
								'</div>',
								'<!-- Text input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<input id="group_mobile" name="group_mobile" type="text" placeholder="请输入子账号绑定的手机号" class="form-control input-md" tabIndex="2" >',
									'</div>',
								'</div>',
								'<!-- Text input-->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-xs-7 col-md-6 col-lg-6">',
										'<input id="mobile_pwd" name="mobile_pwd" type="text" placeholder="请输入短信动态密码" class="form-control input-md" tabIndex="2" >',
									'</div>',
									'<div class="col-xs-4 col-md-4 col-lg-4">',
										'<button class="btn btn-warning  btn-mobile-pwd" data-loading-text="发送中...">获取动态密码</button>',
									'</div>',
								'</div>',
								'<!-- Button -->',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<button type="submit" id="login_mobile" name="login_mobile" class="btn btn-warning btn-lg btn-block " tabIndex="5">登录</button>',
										'<div class="progress hidden">',
											'<div class="progress-bar progress-bar-warning progress-bar-striped active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">',
												// '<span class="sr-only">45% Complete</span>',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="form-group">',
									'<div class="col-md-offset-1 col-md-10">',
										'<a class="btn btn-link pull-right btn-change-mode" data-mode="common" href="javascript:void(0);">返回登录</a>',
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

	// 面包屑
	var tpl_site_breadcrumb = [
		'<ol class="breadcrumb x-bread-crumb {{clz}}">',
			'{{#each items}}',
				'{{#if isLastNode}}',
					'<li class="{{clz}} active">',
						'{{{label}}}',
					'</li>',
				'{{else}}',
					'<li class="{{clz}}">',
						'<a href="javascript:void(0);" data-name="{{name}}" data-href="{{path}}">{{label}}</a>',
					'</li>',
				'{{/if}}',
			'{{/each}}',
		'</ol>'
	].join('');
	TemplateList.register('tpl_site_breadcrumb', tpl_site_breadcrumb);

    // 上传图片对话框模板
    var tpl_site_uploadimg = [
        '<div class="modal fade" id="swfUploadImgDialog" tabindex="-1">',
        '<div class="modal-dialog">',
        '<div class="modal-content">',
            '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal">&times;</button>',
                '<h4 class="modal-title">上传图片</h4>',
            '</div>',
            '<div class="modal-body">',
                '<object type="application/x-shockwave-flash" ',
                    'id="hualalaImageUpload" name="hualalaImageUpload" ',
                    'data="{{swfSrc}}" ',
                    'width="500" height="375">',
                    '<param name="quality" value="high">',
                    '<param name="allowscriptaccess" value="always">',
                    '<param name="wmode" value="transparent">',
                    '<param name="flashvars" value="{{args}}">',
                '</object>',
            '</div>',
        '</div>',
        '</div>',
        '</div>'].join('');
    TemplateList.register('tpl_site_uploadimg', tpl_site_uploadimg);

    var tpl_site_modal_btns = [
		'{{#each btns}}',
			'<button type="button" class="btn {{clz}}" name="{{name}}">{{label}}</button>',
		'{{/each}}'
	].join('');
	TemplateList.register('tpl_site_modal_btns', tpl_site_modal_btns);


	// 复杂数据表格模板
	var tpl_cmpx_datagrid = [
		'<div class="table-responsive {{clz}}">',
			'<table class="table {{tblClz}}">',
				'<thead>',
					'{{#each thead}}',
						'<tr class="{{clz}}">',
							'{{#each cols}}',
								'<th class="{{clz}}" colspan="{{colspan}}" rowspan="{{rowspan}}">{{{label}}}</th>',
							'{{/each}}',
						'</tr>',
					'{{/each}}',
				'</thead>',
				'{{#if isEmpty}}',
					'<tbody>',
						'<tr>',
							'<td colspan="{{colCount}}"><p class="text-center">无结果</p></td>',
						'</tr>',
					'</tbody>',
				'{{else}}',
					'<tbody>',
						'{{#each rows}}',
							'<tr class="{{clz}}">',
								'{{#each cols}}',
									'<td class="{{clz}}">',
										'{{#chkColType type type="button"}}',
											'{{> colBtns}}',
										'{{/chkColType}}',
										'{{#chkColType type type="text"}}',
											'<p data-value="{{value}}" title="{{title}}">{{{text}}}</p>',
										'{{/chkColType}}',
									'</td>',
								'{{/each}}',
							'</tr>',
						'{{/each}}',
					'</tbody>',
					'<tfoot>',
						'{{#each tfoot}}',
							'<tr class="{{clz}}">',
								'{{#each cols}}',
									'<th class="{{clz}}" colspan="{{colspan}}" rowspan="{{rowspan}}">',
										'<p data-value="{{value}}" >{{{text}}}</p>',
									'</th>',
								'{{/each}}',
							'</tr>',
						'{{/each}}',
					'</tfoot>',
				'{{/if}}',
			'</table>',
		'</div>'
	].join('');
	TemplateList.register('tpl_cmpx_datagrid', tpl_cmpx_datagrid);

	// 基础数据表格模版
	var tpl_base_datagrid = [
		'<div class="table-responsive {{clz}}">',
			'<table class="table {{tblClz}}">',
				'<thead>',
					'<tr>',
						'{{#each thead}}',
							'<th class="{{clz}}">{{{label}}}</th>',
						'{{/each}}',
					'</tr>',
				'</thead>',
				'{{#if isEmpty}}',
					'<tbody>',
						'<tr>',
							'<td colspan="{{colCount}}"><p class="text-center">无结果</p></td>',
						'</tr>',
					'</tbody>',
				'{{else}}',
					'<tbody>',
						'{{#each rows}}',
							'<tr class="{{clz}}">',
								'{{#each cols}}',
									'<td class="{{clz}}" colspan="{{colspan}}" rowspan="{{rowspan}}">',
										'{{#chkColType type type="button"}}',
											'{{> colBtns}}',
										'{{/chkColType}}',
										'{{#chkColType type type="text"}}',
											'<p data-value="{{value}}">{{{text}}}</p>',
										'{{/chkColType}}',
									'</td>',
								'{{/each}}',
							'</tr>',
							'{{#if subRows}}',
								'{{#each subRows}}',
									'<tr class="{{clz}}">',
										'{{#each cols}}',
											'<td class="{{clz}}" colspan="{{colspan}}" rowspan="{{rowspan}}">',
												'{{{html}}}',
											'</td>',
										'{{/each}}',
									'</tr>',
								'{{/each}}',
							'{{/if}}',
						'{{/each}}',
					'</tbody>',
					'<tfoot>',
						'<tr>',
							'{{#each tfoot}}',
								'<tr class="{{clz}}">',
									'{{#each cols}}',
										'<th class="{{clz}}" colspan="{{colspan}}" rowspan="{{rowspan}}">',
											'<p data-value="{{value}}" >{{{text}}}</p>',
										'</th>',
									'{{/each}}',
								'</tr>',
							'{{/each}}',
						'</tr>',
					'</tfoot>',
				'{{/if}}',
			'</table>',
		'</div>'
	].join('');
	TemplateList.register('tpl_base_datagrid', tpl_base_datagrid);
	// 基础数据表格操作列
	var tpl_base_grid_colbtns = [
		'<div class="{{clz}}">',
			'{{#each btns}}',
				'<a href="{{link}}" class="{{clz}}" data-id="{{id}}" data-key="{{key}}" data-type="{{type}}">',
					'{{{label}}}',
				'</a>',
			'{{/each}}',
		'</div>'
	].join('');
	TemplateList.register('tpl_base_grid_colbtns', tpl_base_grid_colbtns);

	// 进度条
	var tpl_site_progress = [
		'<div class="progress">',
			'<div class="progress-bar {{progressClz}}" role="progressbar" aria-valuenow="{{start}}" aria-valuemin="{{min}}" aria-valuemax="{{max}}" style="width:{{percent}}" >',
				'<span class="sr-only">{{percent}}</span>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_progress', tpl_site_progress);

	// 关于我们
	var tpl_site_about = [
		'<div class="ix-body about-us">',
			'<div class="banner">',
				'<div class="jumbotron ">',
					'<div class="container">',
						'<p>随时随地管门店<br/>品牌扩张更方便</p>',
						'<div class="ad-pic animation"></div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="container desc">',
				'<h3>关于哗啦啦商户中心</h3>',
				'<p>北京多来点信息技术有限公司是GOZAP集团旗下的一家专注于餐饮O2O领域的移动互联网公司。公司产品“哗啦啦”是一款以改善消费者用餐体验及提升餐饮商户经营效率为目标的移动互联网产品，它可以为消费者提供点菜、闪吃、买单等功能。<br/>',
					'公司创始人及管理团队有着餐饮信息化及互联网行业近10年从业经验，致力于将哗啦啦打造成为国内餐饮O2O第一品牌。',
				'</p>',
			'</div>',
		'</div>',
	].join('');
	TemplateList.register('tpl_site_about', tpl_site_about);

	// 联系我们
	var tpl_site_contact = [
		'<div class="ix-body contact-us">',
			'<div class="banner">',
				'<div class="jumbotron">',
					'<div class="container">',
						'<h1>成长·共赢</h1>',
						'<p>加入我们见证成功</p>',
						'<div class="ad-pic animation"></div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="container desc">',
				'<h3>联系我们</h3>',
				'<address>',
					'北京多来点信息技术有限公司（北京总部）<br/>',
					'服务热线:4006-527-557<br/>',
					'地址：北京市西城区西直门西环广场（凯德Mall）T1-22层<br/>',
					'邮编：100044<br/>',
					'电话：(86)010-58302536，38<br/>',
					'传真：(86)010-58302583<br/>',
					'mail: info@hualala.com<br/>',
				'</address>',
				'<address>',
					'北京多来点信息技术有限公司（上海分公司）<br/>',
					'地址：上海市徐汇区凯旋路3500号华苑大厦1幢27E<br/>',
					'邮编：200030<br/>',
					'电话：(86)021-64148077，78，79<br/>',
					'传真：(86)021-64148079转803<br/>',
					'mail: info@hualala.com<br/>',
				'</address>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_contact', tpl_site_contact);

	// 下载客户端
	var tpl_client_download = [
		'<div class="ix-body download">',
			'<div class="banner">',
				'<div class="jumbotron ">',
					'<div class="container">',
						'<h1>连接云端与餐饮软件</h1>',
						'<p>下载哗啦啦代理程序构建通道...</p>',
						'<div class="ad-pic animation"></div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="container desc">',
				'<h3>下载哗啦啦代理程序</h3>',
				'<p>',
					'哗啦啦代理程序用于建立哗啦啦云端与餐饮软件之间的连接，能够将店铺的菜单及桌台状态实时同步到哗啦啦云端，也可将顾客手机提交的订单下单到餐饮软件。<br/>',
					'<a title="{{title}}" class="btn btn-success btn-lg" href="{{href}}">立即下载</a>',
				'</p>',
			'</div>',
		'</div>'
	].join('');
	TemplateList.register('tpl_client_download', tpl_client_download);
	



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