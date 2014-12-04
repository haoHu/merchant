(function ($, window) {
	IX.ns("Hualala.CRM");
	/*会员管理模块子页面整体页面布局*/
	function initCRMPageLayout (subNavCfg) {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.empty();
		$body.html('<div class="crm-subnav clearfix" /><div class="crm-body" ><div class="crm-query-box"></div><div class="crm-result-box"></div></div>');
		var mapNavRenderData = function () {
			var navs = _.map(subNavCfg, function (v) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					return '';
				});
				return {
					active : $XP(ctx, 'name') == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name || '',
					label : v.label || ''
				};
			});
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var $navbar = $body.find('.crm-subnav'),
			$pageBody = $body.find('.crm-body');
		$navbar.html(navTpl(mapNavRenderData()));
	};

	/*CRM首页*/
	function initCRMHomePage () {
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var $body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		// Note: 暂时屏蔽概览页面，第二版将开启
		var curDateStamp = IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd');
		var pageCfg = _.find(Hualala.TypeDef.CRMMemberSubNavType, function (el) {return el.name == 'crmMemberSchema'}),
			pkeys = $XP(pageCfg, 'pkeys', []);
		pkeys = _.map(pkeys, function (v) {
			if (v == 'startDate' || v == 'endDate') {
				return curDateStamp;
			}
			return '';
		});
		document.location.href = Hualala.PageRoute.createPath('crmMemberSchema', pkeys);
	};

	/*会员概览页面*/
	function initMemberSchema () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		// $pageBody.html('<h1>会员概览页面</h1>');
		var controller = new Hualala.CRM.MemberSchemaController({
			container : $pageBody,
			view : new Hualala.CRM.MemberSchemaView(),
			model : new Hualala.CRM.MemberSchemaModel()
		});
	};

	/*会员查询页面*/
	function initQueryMember () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>会员查询页面</h1>');
        Hualala.CRM.initQuery($pageBody);
	};

	/*会员详情*/
	function initMemberDetail () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        Hualala.CRM.initDetail($body, ctx.params[0]);
	};



	/*会员办卡统计*/
	function initCardStatistic () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMMemberSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMMemberSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>会员办卡统计</h1>');
	};

	/*交易汇总*/
	function initDealSummary () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>交易汇总</h1>');
	};

	/*交易详情*/
	function initDealDetail () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>交易详情</h1>');
	};

	/*充值对账*/
	function initRechargeReconciliation () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMDealSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMDealSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>充值对账</h1>');
	};

	/*会员系统参数设置*/
	function initCRMSettingsParams () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>会员系统参数设置</h1>');
        Hualala.CRM.initParams($pageBody);
	};

	/*充值套餐*/
	function initRechargePackageBusiness () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		//$pageBody.html('<h1>充值套餐</h1>');
        Hualala.CRM.initRecharge($pageBody);
	};

	/*店铺特惠*/
	function initShopSpecialPrice () {
		var ctx = Hualala.PageRoute.getPageContextByPath(),
			$body = $('#ix_wrapper > .ix-body > .container');
		initCRMPageLayout(Hualala.TypeDef.CRMParamsSubNavType);
		var $pageBody = $body.find('.crm-body'),
			queryKeys = $XP(_.findWhere(Hualala.TypeDef.CRMParamsSubNavType, {name : $XP(ctx, 'name')}), 'pkeys');
		$pageBody.html('<h1>店铺特惠</h1>');
	};

	Hualala.CRM.CRMPageLayoutInit = initCRMPageLayout;
	Hualala.CRM.CRMHomePageInit = initCRMHomePage;
	Hualala.CRM.MemberSchemaInit = initMemberSchema;
	Hualala.CRM.QueryMemberInit = initQueryMember;
	Hualala.CRM.MemberDetailInit = initMemberDetail;
	Hualala.CRM.CardStatisticInit = initCardStatistic;
	Hualala.CRM.DealSummaryInit = initDealSummary;
	Hualala.CRM.DealDetailInit = initDealDetail;
	Hualala.CRM.RechargeReconciliationInit = initRechargeReconciliation;
	Hualala.CRM.CRMSettingsParamsInit = initCRMSettingsParams;
	Hualala.CRM.RechargePackageBusinessInit = initRechargePackageBusiness;
	Hualala.CRM.ShopSpecialPriceInit = initShopSpecialPrice;

})(jQuery, window);
