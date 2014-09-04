(function ($, window) {
	IX.ns("Hualala.Shop");
    Hualala.Shop.createShopInfoHead = function(callback, shopInfo)
    {
        var data = {
                shopName: shopInfo.shopName,
                shopUrl: Hualala.Common.getShopUrl(shopInfo.shopID),
                shopListLink: Hualala.PageRoute.createPath('shop'),
                checked: shopInfo.status == 1 ? 'checked' : ''
            };
        
        var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_info_head')),
            $shopInfoHead = $(tpl(data));
            
        $shopInfoHead.find('input').bootstrapSwitch({
            onColor : 'success',
            onText : '已开通',
            offText : '未开通'
        });
        
        callback($shopInfoHead);
    };
    
    // 店铺详情页功能导航
    var shopFuncs = ['shopInfo', 'shopMenu'];
    Hualala.Shop.createShopFuncNav = function (currentPageName, param)
    {
        var R = Hualala.PageRoute;
        var $ul = $('<ul class="nav navbar-nav"></ul>');
        
        for(i = 0, l = shopFuncs.length; i < l; i++)
        {
            var shopFunc = shopFuncs[i],
                isActive = shopFunc == currentPageName,
                path = isActive ? 'javascript:;' : R.createPath(shopFunc, [param]),
                label = R.getPageLabelByName(shopFunc);
            
            $('<li></li>').toggleClass('active', isActive).append($('<a></a>').attr('href', path).text(label)).appendTo($ul);
        }
        
        return $('<div class="navbar navbar-default shop-func-nav"></div>').append($ul);
    };
    
	var initShopList = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
		var queryPanel = new Hualala.Shop.QueryController({
			needShopCreate : true,
			container : $body,
			resultController : new Hualala.Shop.ShopListController({
				container : $body,
				model : new Hualala.Shop.CardListModel({callServer : Hualala.Global.queryShop}),
				view : new Hualala.Shop.CardListView()
			})
		});
		// TODO 店铺管理首页，店铺查询及列表展示页面
	};
	Hualala.Shop.HomePageInit = initShopList;

	var initShopBaseInfoMgr = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
		Hualala.Shop.initInfo($body, pageType, params);
	};
	Hualala.Shop.BaseInfoMgrInit = initShopBaseInfoMgr;

	var initFoodMenuMgr = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		$body.html(
			'<div class="jumbotron">'+
				'<h1>这里是店铺菜谱管理页面</h1>' +
				'<p>提供查看店铺菜谱信息，编辑店铺菜谱信息</p>' +
				
			'</div>'
			);
		// TODO 查看店铺菜谱信息，编辑店铺菜谱信息
	};
	Hualala.Shop.FoodMenuMgrInit = initFoodMenuMgr;

	var initCreateShop = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container'),
            tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_create')),
            $shopCreateWizard = $(tpl({
                pcClientPath: Hualala.PageRoute.createPath('pcclient')
            }));
		$body.append($shopCreateWizard);
        Hualala.Shop.initCreate($shopCreateWizard);
		
	};
	Hualala.Shop.CreateShopInit = initCreateShop;

	
})(jQuery, window);