(function ($, window) {
	IX.ns("Hualala.Shop");
    /**
	  * 渲染店铺详情页头部
	  * @param {Object | String} shopInfo 店铺ID或者店铺详情信息对象
	  * @param {jQuery Object} container  容器
      * @param {function} callback  回调函数，参数是店铺详情头部的jQuery对象
	  * @return {NULL} 
	  */
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
            {//店铺状态切换
                var $chkbox = $(this);
                Hualala.Global.switchShopStatus({shopID: shopInfo.shopID, status: +state}, function (rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        $chkbox.bootstrapSwitch('toggleState', true);
                        rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    Hualala.UI.TopTip({msg: '切换成功', type: 'success'})
                });
			});;
            //重置客户端密码
            $shopInfoHead.find('#resetPwd').on('click', function ()
            {
                var resetPwdTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_shop_client_pwd'));
                var $resetPwdForm = $(resetPwdTpl(shopInfo));
                //弹出重置客户端密码模态框
                var modal = new Hualala.UI.ModalDialog({
                    id: 'resetCltPwdDlg',
                    title: '重置客户端密码',
                    html: $resetPwdForm,
                    sizeCls: 'modal-sm',
                    hideCloseBtn: false
                }).show();
                var $feedback = $resetPwdForm.find('.has-feedback'),
                    $feedbackIcon = $feedback.find('.form-control-feedback'),
                    $errMsg = $feedback.find('small');
                var $pwd = $resetPwdForm.find('#shopClinetPwd').data('validate', false).on('blur', function ()
                {//验证密码输入
                    var $this = $(this),
                        l = $.trim($this.val()).length;
                    $this.data('validate', false);
                    if(!l)
                        $errMsg.text('密码不能为空');
                    else if(l < 6 || l > 16)
                        $errMsg.text('密码长度必须在6到16个字符之间');
                    else
                    {
                        $errMsg.text('');
                        $this.data('validate', true);
                    }
                        
                    var isValid = $this.data('validate');
                    $feedback.toggleClass('has-success', isValid).toggleClass('has-error', !isValid);
                    $feedbackIcon.toggleClass('glyphicon-ok', isValid).toggleClass('glyphicon-remove', !isValid);
                });
                //密码/明文切换
                $resetPwdForm.find('#showPwd').change(function()
                {
                    $pwd.attr('type', this.checked ? 'text' : 'password');
                });
                //提交密码重设请求
                modal._.footer.find('.btn-ok').on('click', function ()
                {
                    if(!$pwd.trigger('blur').data('validate')) return;
                    
                    Hualala.Global.setShopClientPwd({shopID: shopInfo.shopID, hLLAgentLoginPWD: $pwd.val()}, function (rsp)
                    {
                        if(rsp.resultcode != '000')
                        {
                            rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        modal.hide();
                        Hualala.UI.TopTip({msg: '重置客户端密码成功！', type: 'success'});
                    });
                    
                });
                
            });
            //执行回调函数
            callback && callback($shopInfoHead);
        };
        //如果是参数shopInfo是店铺详情对象
        if($.isPlainObject(shopInfo))
        {
            fn(shopInfo);
            return;
        }
        //如果参数shopInfo是shopID，发送ajax获取店铺详情信息
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
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
		Hualala.Shop.initInfo($body, pageType, params);
	};
	Hualala.Shop.BaseInfoMgrInit = initShopBaseInfoMgr;

	var initFoodMenuMgr = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        Hualala.Shop.createShopInfoHead(params, $body);
        Hualala.Shop.createShopFuncNav(pageType, params, $body);
        Hualala.Shop.initMenu($body, pageType, params);
	};
	Hualala.Shop.FoodMenuMgrInit = initFoodMenuMgr;

	var initCreateShop = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_create')),
            $shopCreateWizard = $(tpl({
                pcClientPath: Hualala.PageRoute.createPath('pcclient')
            }));
		$body.append($shopCreateWizard);
        Hualala.Shop.initCreate($shopCreateWizard);
		
	};
	Hualala.Shop.CreateShopInit = initCreateShop;

	
})(jQuery, window);