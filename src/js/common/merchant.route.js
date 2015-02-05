(function ($, window) {
	IX.ns("Hualala.PageRoute");
	var Router = Hualala.Router,
		routes = Hualala.Global.Route;
	var isInitialized = false,
		PageConfigurations = {},
		Path2NameMapping = {};

	function mappingRoute (_path, _name, _reg) {
		var match = _path.match(_reg);
		if (!match) return;
		var s = match.shift(),
			arr = s.split('/');
		arr = _.map(arr, function (v, i, l) {
			var bingo = _.indexOf(s, v);
			if (bingo > -1) {
				return '_';
			}
			return v;
		});
		arr.push(""); arr.unshift("");
		var _pattern = arr.join("_");
		Path2NameMapping[_pattern] = _name;
	}

	var detectPageInitializor = (function () {
		var ht = new IX.I1ToNManager();
		var fnames = [];
		function _checkItem(fname) {
			if (!IX.isFn(IX.getNS(fname)))
				return false;
			var _list = ht.get(fname),
				_fn = IX.getNS(fname);
			for (var j = 0; j < _list.length; j++)
				PageConfigurations[_list[j]].init = _fn;
			ht.remove(fname);
			return true;
		}

		function _checking() {
			fnames = IX.loop(fnames, [], function (acc, fname) {
				if (!_checkItem(fname))
					acc.push(fname);
				return acc;
			});
			return fnames.length == 0;
		}

		function _check () {
			fnames = IX.Array.toSet(fnames);
			IX.checkReady(_checking, IX.emptyFn, 40, {
				maxAge : 15000,
				expire : function () {
					//alert("Can't find page inializor : \n" + fnames.join("\n"));
				}
			});
		}
		
		function _detect(name, fname) {
			var _fn = null;
			if (IX.isFn(fname)) {
				_fn = fname;
			} else if (!IX.isString(fname)) {
				throw("Configuration failed : Invalid Page Initialized for " + name);
				return false;
			} else if (IX.nsExisted(fname)) {
				_fn = IX.getNS(fname);
			}
			if (IX.isFn(_fn)) {
				return PageConfigurations[name].init = _fn;
			}
			ht.put(fname, name);
			fnames.push(fname);
		}
		return {
			start : function () {setTimeout(_check, 1);},
			detect : _detect
		}
	})();

	/**
	 * 获取路由路径
	 * @param  {String} name   路由配置的名称
	 * @param  {Array|NULL} params 组装路由需要的参数，按照路由规则按顺序给出参数
	 * @return {String}        返回生成的路由
	 */
	function getPathByName (name, params) {
		var cfg = PageConfigurations[name];
		if (!cfg) 
			return console.err("Can't find route : " + name);
		var path = $XP(cfg, 'path'), reg = $XP(cfg, 'reg'),
			match = path.match(reg);
		var genPath = function (p) {
			return Hualala.Global.HOME + p;
		};
		if (!match || match.length < 1) {
			return console.err("The Path of Route (" + name + ") is wrong!!");
		} else if (match.length == 1) {
			return genPath(path);
		} else if (match.length > 1 && IX.isArray(params) && (match.length - 1) == params.length) {
			match.shift();
			_.each(match, function (v, i, m) {
				path = path.replace(v, params[i]);
			});
			return genPath(path);
		}
	}
	/**
	 * pageConfig : {
	 * 		name : "",
	 * 		path : "",
	 * 		reg : RegExp,
	 * 		bodyClz : "", default ""
	 * 		PageInitiator : "Hualala.User.init" or function (cfg) {}
	 * }
	 * @param  {[type]} cbFn [description]
	 * @return {[type]}      [description]
	 */
	var pageConfigs = [
		// home page 主页
		// 登录
		{
			name : "login", path : "/#login", reg : /login$/, bodyClz : "",
			PageInitiator : "Hualala.Common.LoginInit", label : "登录"
		},
		// home page主页
		{
			name : "main", path : "/#home", reg : /home$/, bodyClz : "",
			PageInitiator : "Hualala.Common.HomePageInit", label : "首页"
		},

		// 店铺管理主页		
		{
			name : "shop", path : "/#shop", reg : /shop$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.HomePageInit", parentName : "main", label : "店铺管理"
		},
		// 创建店铺
		{
			name : "shopCreate", path : "/#shop/create", reg : /shop\/create$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.CreateShopInit", parentName : "shop", label : "创建店铺"
		},
		// 店铺信息管理
		{
			name : "shopInfo", path : "/#shop/{id}/info", reg : /shop\/(.*)\/info$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.BaseInfoMgrInit", parentName : "shop", label : "店铺信息"
		},
		// 店铺菜单管理
		{
			name : "shopMenu", path : "/#shop/{id}/menu", reg : /shop\/(.*)\/menu$/, bodyClz : "",
			PageInitiator : "Hualala.Shop.FoodMenuMgrInit", parentName : "shop", label : "菜单管理"
		},

		// 店铺功能设置页面
		{
			name : "setting", path : "/#setting", reg : /setting$/, bodyClz : "",
			PageInitiator : "Hualala.Setting.ShopMgrInit", parentName : "main", label : "业务设置"
		},

		// 结算账户页面
		{
			name : "account", path : "/#account", reg : /account$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountListInit", parentName : "main", label : "资金结算"
		},
		// 结算账户详情设置页面
		{
			name : "accountDetail", path : "/#account/{id}/detail", reg : /account\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.Account.AccountMgrInit", parentName : "account", label : "账户明细"
		},

		// 用户管理页面
		{
			name : "user", path : "/#user", reg : /user$/, bodyClz : "",
			PageInitiator : "Hualala.User.UserListInit", parentName : "main", label : "用户管理"
		},

		// 订单报表页面
		{
			name : "order", path : "/#order", reg : /order$/, bodyClz : "",
			PageInitiator : "Hualala.Order.OrderChartInit", parentName : "main", label : "订单报表"
		},

		// 订单查询页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			s : order status ID
			n : shop ID
			m : mobile number
			o : order key
			i : min amount
			a : max amount

		 */
		{
			name : "orderQuery", path : "/#order/query/b{begin}/e{end}/c{cityID}/n{shopID}/s{status}/m{mobile}/o{orderKey}/i{minAmount}/a{maxAmount}", 
			reg : /order\/query\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)\/m(.*)\/o(.*)\/i(.*)\/a(.*)$/,
			bodyClz : "", PageInitiator : "Hualala.Order.QueryOrderInit", parentName : "main", label : "订单查询"
		},

		// 订单日汇总页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			s : order status ID
			n : shop ID
		 */
		{
			name : "orderQueryDay", path : "/#order/query/day/b{begin}/e{end}/c{cityID}/n{shopID}/s{status}",
			reg : /order\/query\/day\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)/, bodyClz : "",
			PageInitiator : "Hualala.Order.QueryOrderByDayDetailInit", parentName : "main", label : "订单日汇总"
		},

		// 订单期间汇总页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			s : order status ID
			n : shop ID
		 */
		{
			name : "orderQueryDuring", path : "/#order/query/during/b{begin}/e{end}/c{cityID}/n{shopID}/s{status}",
			reg : /order\/query\/during\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)/, bodyClz : "", 
			PageInitiator : "Hualala.Order.QueryOrderByDuringDetailInit", parentName : "main", label : "订单期间汇总"
		},

		// 菜品销售排行页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			n : shopID
			s : foodCategoryName
		 */
		{
			name : "orderDishesHot", path : "/#order/dishes/hot/b{begin}/e{end}/c{cityID}/n{shopID}/s{foodCategoryName}",
			reg : /order\/dishes\/hot\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/s(.*)/, bodyClz : "",
			PageInitiator : "Hualala.Order.QueryOrderDishesHotInit", parentName : "main", label : "菜品销量排行"
		},

		// 订餐客户查询页面
		/*
			b : begin date(SecondTick)
			e : end date(SecondTick)
			c : city ID
			n : shopID
			u : customerName
			m : mobile
		 */
		{
			name : "orderQueryCustomer", path : "/#order/customer/b{begin}/e{end}/c{cityID}/n{shopID}/m{mobile}/u{customerName}",
			reg : /order\/customer\/b(.*)\/e(.*)\/c(.*)\/n(.*)\/m(.*)\/u(.*)/, bodyClz : "",
			PageInitiator : "Hualala.Order.QueryOrderCustomerInit", parentName : "main", label : "顾客统计"
		},

		// 营销活动管理模块(MCM)
		{
			name : "mcm", path : "/#mcm",
			reg : /mcm$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMHomePageInit", parentName : "main", label : "营销"
		},
		{
			name : "mcmGiftsMgr", path : "/#mcm/gifts",
			reg : /mcm\/gifts$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMGiftsMgrInit", parentName : "mcm", label : "礼品管理"
		},
		{
			name : "mcmGiftDetail", path : "/#mcm/gift/{giftItemID}/detail",
			reg : /mcm\/gift\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMGiftDetailInit", parentName : "mcmGiftsMgr", label : "礼品使用详情"
		},
		{
			name : "mcmEventMgr", path : "/#mcm/evts",
			reg : /mcm\/evts$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMEventMgrInit", parentName : "mcm", label : "营销活动管理"
		},
		{
			name : "mcmEventTrack", path : "/#mcm/evt/{eventID}/track",
			reg : /mcm\/evt\/{eventID}\/track$/, bodyClz : "",
			PageInitiator : "Hualala.MCM.MCMEventTrackInit", parentName : "mcmEventMgr", label : "活动跟踪"
		},

		// 会员系统管理
		/*
			
		 */
		{
			name : "crm", path : "/#crm",
			reg : /crm$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CRMHomePageInit", parentName : "main", label : "会员管理"
		},
		{
			name : "crmMemberSchema", path : "/#crm/member/schema",
			reg : /crm\/member\/schema$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.MemberSchemaInit", parentName : "crm", label : "会员概览"
		},
		{
			name : "crmQueryMember", path : "/#crm/member/query",
			reg : /crm\/member\/query/, bodyClz : "",
			PageInitiator : "Hualala.CRM.QueryMemberInit", parentName : "crm", label : "会员查询"
		},
		{
			name : "crmMemberDetail", path : "/#crm/member/{id}/detail",
			reg : /crm\/member\/(.*)\/detail$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.MemberDetailInit", parentName : "crmQueryMember", label : "会员详情"
		},
		{
			name : "crmCardStats", path : "/#crm/member/cardstat",
			reg : /crm\/member\/cardstat$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CardStatisticInit", parentName : "crm", label : "入会统计"
		},
		{
			name : "crmDealSummary", path : "/#crm/deal/sum",
			reg : /crm\/deal\/sum/, bodyClz : "",
			PageInitiator : "Hualala.CRM.DealSummaryInit", parentName : "crm", label : "储值消费汇总"
		},
		{
			name : "crmDealDetail", path : "/#crm/deal/detail",
			reg : /crm\/deal\/detail/, bodyClz : "",
			PageInitiator : "Hualala.CRM.DealDetailInit", parentName : "crm", label : "交易明细"
		},
		{
			name : "crmRechargeReconciliation", path : "/#crm/deal/recharge",
			reg : /crm\/deal\/recharge/, bodyClz : "",
			PageInitiator : "Hualala.CRM.RechargeReconciliationInit", parentName : "crm", label : "储值对账"
		},
		{
			name : "crmParameter", path : "/#crm/settings/params",
			reg : /crm\/settings\/params$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CRMSettingsParamsInit", parentName : "crm", label : "会员系统参数"
		},
        {
			name : "crmCardLevels", path : "/#crm/settings/levels",
			reg : /crm\/settings\/levels$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.CRMSettingsLevelsInit", parentName : "crm", label : "会员等级"
		},
		{
			name : "crmRechargePackageBusiness", path : "/#crm/settings/recharge",
			reg : /crm\/settings\/recharge$/, bodyClz : "",
			PageInitiator : "Hualala.CRM.RechargePackageBusinessInit", parentName : "crm", label : "充值套餐"
		},
		{
			name : "crmShopSpecialPrice", path : "/#crm/settings/ssp",
			reg : /crm\/settings\/ssp/, bodyClz : "",
			PageInitiator : "Hualala.CRM.ShopSpecialPriceInit", parentName : "crm", label : "店铺特惠"
		},
        
        // 微信系统管理
		{
			name : "weixin", path : "/#weixin",
			reg : /weixin$/, bodyClz : "",
			PageInitiator : "Hualala.Weixin.homeInit", parentName : "main", label : "微信管理"
		},
		{
			name : "wxReply", path : "/#weixin/admin/reply",
			reg : /weixin\/admin\/reply$/, bodyClz : "wx-reply",
			PageInitiator : "Hualala.Weixin.replyInit", parentName : "weixin", label : "自动回复"
		},
		{
			name : "wxSubscribe", path : "/#weixin/admin/subscribe",
			reg : /weixin\/admin\/subscribe$/, bodyClz : "wx-subscribe",
			PageInitiator : "Hualala.Weixin.subscribeInit", parentName : "weixin", label : "关注自动回复"
		},
		{
			name : "wxMenu", path : "/#weixin/admin/menu",
			reg : /weixin\/admin\/menu$/, bodyClz : "wx-menu",
			PageInitiator : "Hualala.Weixin.menuInit", parentName : "weixin", label : "自定义菜单"
		},
        {
			name : "wxQrCode", path : "/#weixin/admin/qrcode",
			reg : /weixin\/admin\/qrcode$/, bodyClz : "wx-qrcode",
			PageInitiator : "Hualala.Weixin.qrCodeInit", parentName : "weixin", label : "二维码维护"
		},
		{
			name : "wxAdvertorial", path : "/#weixin/material/advertorial",
			reg : /weixin\/material\/advertorial$/, bodyClz : "wx-advertorial",
			PageInitiator : "Hualala.Weixin.advertorialInit", parentName : "weixin", label : "软文管理"
		},
        {
			name : "wxContent", path : "/#weixin/material/content",
			reg : /weixin\/material\/content$/, bodyClz : "wx-content",
			PageInitiator : "Hualala.Weixin.contentInit", parentName : "weixin", label : "图文管理"
		},
        {
			name : "wxText", path : "/#weixin/material/text",
			reg : /weixin\/material\/text$/, bodyClz : "wx-text",
			PageInitiator : "Hualala.Weixin.textInit", parentName : "weixin", label : "文本管理"
		},

		// PC客户端下载页面
		{
			name : "pcclient", path : "/#download", reg : /download$/, bodyClz : "",
			PageInitiator : "Hualala.Common.PCClientDownloadInit", parentName : "main", label : "客户端下载"
		},

		// 关于商户中心
		{
			name : "about", path : "/#about", reg : /about$/, bodyClz : "",
			PageInitiator : "Hualala.Common.AboutInit", parentName : "main", label : "关于"
		},

		// 联系我们
		{
			name : "contact", path : "/#contact", reg : /contact$/, bodyClz : "",
			PageInitiator : "Hualala.Common.ContactInit", parentName : "main", label : "联系我们"
		},
		// 上面的path都匹配不到，需要自动跳转home
		{
			name : "index", path : "", reg : /(.*)$/, bodyClz : "",
			PageInitiator : "Hualala.Common.IndexInit"
		}
	];
	IX.iterate(pageConfigs, function (cfg) {
		var _cfg = IX.inherit({
			bodyClz : "ix-minor",
			path : ""
		}, cfg);
		var _name = $XP(cfg, 'name'), _path = $XP(cfg, 'path'), _reg = $XP(cfg, 'reg');
		mappingRoute(_path, _name, _reg);
		PageConfigurations[_name] = {
			name : _name, bodyClz : $XP(_cfg, 'bodyClz', ''), path : _path, reg : $XP(_cfg, 'reg', null),
			parentName : $XP(cfg, 'parentName', null), label : $XP(cfg, 'label', '')
		};
		var _pageInit = "PageInitiator" in _cfg ? _cfg.PageInitiator : null;
		if (!IX.isString(_pageInit) && !IX.isFn(_pageInit))
			_pageInit = IX.emptyFn;
		detectPageInitializor.detect(_name, _pageInit);
	});
	detectPageInitializor.start();

    var $body = $('body');
	Hualala.PageRoute.start = function (cbFn) {
		isInitialized = true;
		Router.flush().config({mode : 'history', root : Hualala.Global.HOME});
		// Router.flush().config({mode : 'history'});
		// IE Browser can not support this method ??
		_.each(PageConfigurations, function (route, name, l) {
			var re = $XP(route, 'reg'), initFn = $XF(route, 'init'), handler = null;
			
			handler = function (params) {
				IX.Debug.info("INFO: Init Page : [" + name + "]");
				IX.Debug.info("INFO: Page Arguments : [" + params + "]");
                $body.removeClass().addClass(route.bodyClz);
				IX.isFn(cbFn) && cbFn(name, params, initFn);
				
				// initFn && initFn.apply(null, [name, params]);
			};
			
			Router.add(re, handler);
		});
		Router.listen().check();
	};

	Hualala.PageRoute.createPath = getPathByName;

	Hualala.PageRoute.getCurrentPath = function () {
		return location.hash;
	};

	Hualala.PageRoute.getPageContextByPath = function (path) {
		var fragment = path || Hualala.Router.getFragment();
		var match = _.filter(PageConfigurations, function (el, k, l) {
			return !!fragment.match(el.reg);
		});
		var params = null;
		if (match.length == 0) return null;
		if (match.length == 1) {
			params = fragment.match(match[0]['reg']);
			params.shift();
			return IX.inherit({params : params}, match[0]);
		}
		match = _.filter(match, function (el, k, l) {
			return el.name != 'index';
		});
		params = fragment.match(match[match.length - 1]['reg']);
		params.shift();
		return IX.inherit({params : params}, match[match.length - 1]);
	};

	Hualala.PageRoute.getParentNamesByPath = function (path) {
		var curContext = Hualala.PageRoute.getPageContextByPath(path);
		var curName = $XP(curContext, 'name', null);
		var ret = [];
		while(!IX.isEmpty(curName)) {
			ret.unshift({
				name : curName,
				label : $XP(curContext, 'label', ''),
                path: Hualala.PageRoute.createPath(curName, curContext.params)
			});
			var parentName = $XP(curContext, 'parentName', null);
			curContext = IX.isEmpty(parentName) ? null : $XP(PageConfigurations, parentName, null);
			curName = $XP(curContext, 'name', null);
		}
        ret[ret.length - 1].isLastNode = true;
		return ret;
	};
    
    Hualala.PageRoute.getPageLabelByName = function (name) {
        if(!name) return null;
        var cfg = PageConfigurations[name];
        if(!cfg) return null;
        return cfg.label;
    };
    
    Hualala.PageRoute.jumpPage = function (path) {
    	document.location.href = path;
    };

})(jQuery, window);