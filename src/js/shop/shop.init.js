(function ($, window) {
	IX.ns("Hualala.Shop");
    Hualala.Shop.createShopInfoHead = function(shopInfo, container, callback)
    {
        var $container = container || $('#ix_wrapper > .ix-body > .container'),
            $shopInfoHead = $('<div class="bs-callout shop-info-head"></div>');
        !callback && $shopInfoHead.appendTo($container);
        
        var fn = function (shopInfo)
        {
            var tplData = {
                    shopName: shopInfo.shopName,
                    shopUrl: Hualala.Common.getShopUrl(shopInfo.shopID),
                    shopListLink: Hualala.PageRoute.createPath('shop'),
                    checked: shopInfo.status == 1 ? 'checked' : ''
                };
            
            var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_info_head'));
            
            $shopInfoHead.append($(tpl(tplData))).find('input').bootstrapSwitch({
                onColor : 'success',
                onText : '已开通',
                offText : '未开通'
            }).on('switchChange.bootstrapSwitch', function (e, state)
            {
                var $chkbox = $(this);
                Hualala.Global.switchShopStatus({shopID: shopInfo.shopID, status: state}, function (rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        $chkbox.bootstrapSwitch('toggleState', true);
                        rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                });
			});;
            
            $shopInfoHead.find('#resetPwd').on('click', function ()
            {
                var resetPwdTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_shop_client_pwd'));
                var $resetPwdForm = $(resetPwdTpl(shopInfo));
                new Hualala.UI.ModalDialog({
                    id: 'resetCltPwdDlg',
                    title: '重置客户端密码',
                    html: $resetPwdForm,
                    sizeCls: 'modal-sm',
                    hideCloseBtn: false
                }).show();
                var $pwd = $resetPwdForm.find('#shopClinetPwd');
                $resetPwdForm.find('#showPwd').change(function()
                { 
                    $pwd.attr('type', this.checked ? 'text' : 'password');
                });
                
            });
            
            callback && callback($shopInfoHead);
        };
        
        if($.isPlainObject(shopInfo))
        {
            fn(shopInfo);
            return;
        }
        
        Hualala.Global.getShopInfo({shopID: shopInfo}, function (rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var shopInfo = rsp.data.records[0];
            fn(shopInfo);
        });
        
    };
    
    // 店铺详情页功能导航
    Hualala.Shop.createShopFuncNav = function (currentPageName, shopID, container)
    {
        var shopFuncs = ['shopInfo', 'shopMenu'],
            R = Hualala.PageRoute,
            $ul = $('<ul class="nav navbar-nav"></ul>'),
            $container = container || $('#ix_wrapper > .ix-body > .container');
        
        for(i = 0, l = shopFuncs.length; i < l; i++)
        {
            var shopFunc = shopFuncs[i],
                isActive = shopFunc == currentPageName,
                path = isActive ? 'javascript:;' : R.createPath(shopFunc, [shopID]),
                label = R.getPageLabelByName(shopFunc);
            
            $('<li></li>').toggleClass('active', isActive).append($('<a></a>').attr('href', path).text(label)).appendTo($ul);
        }
        
        return $('<div class="navbar navbar-default shop-func-nav"></div>').append($ul).appendTo($container);
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