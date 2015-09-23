(function ($, window) {
	IX.ns("Hualala.Shop");

    Hualala.Shop.Typedef = {
        operationMode: { '0': '正餐', '1': '快餐', '2': '美食广场' }
    };
    var cityID =null;
    
    Hualala.Shop.resetAngentPwd = function(shopID)
    {
        var resetPwdTpl = Handlebars.compile(Hualala.TplLib.get('tpl_set_shop_client_pwd'));
        var $resetPwdForm = $(resetPwdTpl({shopID: shopID}));
        //弹出重置代理程序密码模态框
        var modal = new Hualala.UI.ModalDialog({
            id: 'resetCltPwdDlg',
            title: '重置代理程序密码',
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
            
            Hualala.Global.setShopClientPwd({shopID: shopID, hLLAgentLoginPWD: $pwd.val()}, function (rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                modal.hide();
                Hualala.UI.TopTip({msg: '设置代理程序密码成功！', type: 'success'});
            });
            
        });
    }
    
    /**
	  * 渲染店铺详情页头部
	  * @param {Object | String} shopInfo 店铺ID或者店铺详情信息对象
	  * @param {jQuery Object} container  容器
      * @param {function} callback  回调函数，参数是店铺详情头部的jQuery对象
	  * @return {NULL} 
	  */
    Hualala.Shop.createShopInfoHead = function(shopInfo, container, saasStatus, callback)
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
                    checked: shopInfo.status == 1 ? 'checked' : '',
                    isSaasOpen: saasStatus.can == 1,
                    softName: saasStatus.CSP_softName
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
                    Hualala.UI.TopTip({
                        msg: !+state ? '关闭成功' : '开启成功', 
                        type: 'success'
                    })
                });
			});;
            //重置代理程序密码
            $shopInfoHead.find('#resetPwd').on('click', function ()
            {
                Hualala.Shop.resetAngentPwd(shopInfo.shopID);
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
                cityID=shopInfo.cityID;
            fn(shopInfo);
        });
        
    };
    
    // 店铺详情页功能导航
    Hualala.Shop.createShopFuncNav = function (currentPageName, shopID, container, isSaasOpen){  
        //线上屏蔽掉促销
        var is3W = window.location.host == 'dianpu.hualala.com';
        //var shopFuncs = ['shopInfo', 'shopCategory', 'shopMenu', 'shopTable', 'shopMember','shopPromotion','shopPrinterSetting','shopPrinterAreaSetting']
        var shopFuncs = ['shopInfo', 'shopCategory','shopMenu','ShopTimeManage' ],
            promotion =['shopPromotion'];
            shopFuncs = is3W ? shopFuncs: shopFuncs.concat(promotion);
        if(!is3W){
                var promotion=shopFuncs[4];
                shopFuncs[4] = shopFuncs[3];
                shopFuncs[3] = promotion;
        }
        //针对店铺打通方式设置导航
        if (isSaasOpen) {
            var saasNavs = ['shopDiscountManage','shopTable', 'shopMember', 'shopPrinterAreaSetting','shopRemarks', 'shopSaasParams'];
            shopFuncs = shopFuncs.concat(saasNavs);
           /*打通第三方餐饮软件，菜品分类，，促销，时段都有
            //导航顺序：菜品分类在菜谱关联之前
            var menu = shopFuncs[2];
            shopFuncs[1] = shopFuncs[2];
            shopFuncs[2] = menu;
            //促销在菜谱后
            if(!is3W){
                var promotion=shopFuncs[1];
                shopFuncs[1] = shopFuncs[3];
                shopFuncs[3] = promotion;
            }*/
        }
        var R = Hualala.PageRoute,
            $ul = $('<ul class="nav navbar-nav"></ul>'),
            $container = container || $('#ix_wrapper > .ix-body > .container');
        
        for(i = 0, l = shopFuncs.length; i < l; i++){
            var shopFunc = shopFuncs[i],
                isActive = shopFunc == currentPageName,
                path = isActive ? 'javascript:;' : R.createPath(shopFunc, [shopID]),
                label = R.getPageLabelByName(shopFunc);
            
            $('<li></li>').toggleClass('active', isActive).append($('<a></a>').attr('href', path).text(label)).appendTo($ul);
        }
        return $('<div class="navbar navbar-default shop-func-nav"></div>').append($ul).appendTo($container);
    };
    
    Hualala.Shop.validators = {
        excluded: ':disabled',
        fields: {
            shopName: {
                message: '店铺名无效',
                validators: {
                    notEmpty: {
                        message: '店铺名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 100,
                        message: '店铺名长度必须在2到100个字符之间'
                    }
                }
            },
            cityID: {
                validators: { notEmpty: { message: '请选择店铺所在城市' } }
            },
            tel: {
                validators: {
                    notEmpty: { message: '店铺电话不能为空' },
                    regexp: {
                        regexp: /^\d[\d\-,]+\d$/,
                        message: '店铺电话格式不正确' 
                    }
                }
            },
            address: {
                validators: {
                    notEmpty: { message: '店铺地址不能为空' },
                    stringLength: {
                        min: 1,
                        max: 80,
                        message: '店铺地址不能超过80个字符'
                    }
                }
            },
            PCCL: {
                validators: {
                    notEmpty: { message: '人均消费不能为空' },
                    numeric: { message: '人均消费必须是金额数字' },
                    integer: { message:'人均消费必须是正整数' },
                    greaterThan: { 
                        inclusive : false,
                        value : 0,
                        message : "人均消费必须大于0"
                    }
                }
            },
            operationMode: {
                validators: {
                    notEmpty: { message: '请选择店铺运营模式' }
                }
            },
            openingHoursStart: {
                validators: {
                    notEmpty: { message: '每天营业开始时间不能空' },
                    time: { 
                        message: ''
                        // startTimeField: 'openingHoursStart'
                    }
                }
            },
            openingHoursEnd: {
                validators: {
                    notEmpty: { message: '每天营业结束时间不能空' },
                    time: {
                        message: ''
                        //验证营业时间结束前需要验证营业开始时间
                        //startTimeField: 'openingHoursStart'
                    },
                    callback : {
                        message : '',
                        callback : function (value, validator, $field) {
                            var $fields = validator.$form.find(':text[name^=openingHoursStart]');
                            var value = $fields.val();
                            if (value === '') {
                                return false;
                            }
                            //正则验证时间是否合法
                            //\uff1a 为中文冒号的unicode码
                            var rst = /^((0?\d)|1\d|2[0-3])\s*[\uff1a\:]\s*([0-5]\d)$/.test(value);
                            if(!rst) return { valid: false, message: '请输入有效的开始时间' };
                            var times = value.replace('\uff1a', ':').split(':'),
                                h = parseInt($.trim(times[0]), 10),  // hours
                                m = $.trim(times[1]);  // minutes
                            h = h < 10 ? 0 + '' + h : h;
                            $fields.val(h + ':' + m);
                            if (!validator.isValidField($fields)) {
                                validator.updateStatus($fields, validator.STATUS_VALID, 'openingHoursStart');
                                return true;
                            }
                            return true;
                        }
                    }
                }
            },
            areaID: {
                validators: {
                    notEmpty: { message: '请选择店铺所在地标' }
                }
            },
            cuisineID1: {
                validators: {
                    notEmpty: { message: '请选择菜系1' }
                }
            }
        }
    };

    function checkSaasOpen(shopID, cbFn) {
        Hualala.Global.checkSaasOpen({shopID: shopID}, function (rsp) {
            if (rsp.resultcode != '000') {
                Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            if (IX.isFn(cbFn)) cbFn(rsp.data);
        });
    }
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
        checkSaasOpen(params, function (data) {
            Hualala.Shop.initInfo($body, pageType, params, data);
        });
	};
	Hualala.Shop.BaseInfoMgrInit = initShopBaseInfoMgr;

    var initFoodCategory = function(pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            var isSaasOpen = data.can == 1;
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, isSaasOpen);
            $body.append('<div class="page-body clearfix"></div>');
            Hualala.Saas.Category.initCategory($body.find('.page-body'), params,isSaasOpen);
        });
    };
    Hualala.Shop.CategoryInit = initFoodCategory;

	var initFoodMenuMgr = function (pageType, params) {
		var $body = $('#ix_wrapper > .ix-body > .container');
		Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function(data) {
            var isSaasOpen = data.can == 1;
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, isSaasOpen);
            Hualala.Shop.initMenu($body, pageType, params, isSaasOpen);
            Hualala.Shop.initCreateFood(params, isSaasOpen);
        });
	};
	Hualala.Shop.FoodMenuMgrInit = initFoodMenuMgr;

    var initShopMemberMgr = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            $body.append($('<div class="shop-member"></div>'));
            Hualala.Shop.initMember($body.find('.shop-member'), params);
        });
    };

    Hualala.Shop.MemberMgrInit = initShopMemberMgr;

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

    var initShopTableMgr = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });

        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            $body.append($('<div class="shop-table">'));
            Hualala.Shop.initTableMgr($body.find('.shop-table'), params);
        });
    };

    Hualala.Shop.TableMgrInit = initShopTableMgr;

    var initTableAreaMgr = function (pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container'),
            currentPathParents = Hualala.PageRoute.getParentNamesByPath();
        //去掉当前桌台区域的节点
        currentPathParents.pop();
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: currentPathParents
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            $body.append($('<div class="table-bread"></div><div class="table-area"></div>'));
            var $tableAreaBread = $body.find('.table-bread'),
                $tableArea = $body.find('.table-area'),
                tableAreaParentPath = Hualala.PageRoute.getParentNamesByPath().slice(1),
                areaPath = Hualala.PageRoute.getCurrentPath();
            //桌台管理的path
            tableAreaParentPath[1].path = areaPath.substr(0, areaPath.indexOf('/area'));
            //生成桌台区域的导航
            Hualala.UI.BreadCrumb({
                container: $tableAreaBread,
                hideRoot: true,
                nodes: tableAreaParentPath
            });
            Hualala.Shop.initTableAreaMgr($tableArea, params);
        });
    };
    Hualala.Shop.TableAreaMgrInit = initTableAreaMgr;
    //促销
    function initShopPromotionMgr(pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
        var ctx = Hualala.PageRoute.getPageContextByPath();
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            //Hualala.Shop.initPromotionMgr($body, params);
            $body.append($('<div class="promotion-list">'));
            var $pageBody = $('#ix_wrapper > .ix-body > .container>.promotion-list');
            var controller = new Hualala.Shop.PromotionController({
                container : $pageBody,
                shopID : $XP(ctx, 'params', [])[0],
                model : new Hualala.Shop.PromotionModel({
                    callServer : Hualala.Global.getShopPromotion,
                    recordModel : Hualala.Shop.BasePromotionModel
                }),
                view :new Hualala.Shop.PromotionView()
            });
        });
    }
    Hualala.Shop.PromotionInit = initShopPromotionMgr;

    //打印区域设置
    function initPrinterAreaMgr(pageType,params){
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            $body.append('<div class="page-body printerArea-menu shop-table clearfix"></div>');
            Hualala.Shop.initPrinterAreaSetting($body.find('.page-body'), params);
        });
    }
    Hualala.Shop.PrinterAreaInit =initPrinterAreaMgr;
    //打印机设置
    function initShopPrinterMgr(pageType,params){
        var $body = $('#ix_wrapper > .ix-body > .container'),
            currentPathParents = Hualala.PageRoute.getParentNamesByPath();
        //去掉当前的节点
        currentPathParents.pop();
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: currentPathParents
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav('shopPrinterAreaSetting', params, $body, data.can == 1);
            $body.append($('<div class="printer-bread"></div><div class="printer-content"></div>'));
            var $printerBread = $body.find('.printer-bread'),
                $printerContent = $body.find('.printer-content'),
                printerParentPath = Hualala.PageRoute.getParentNamesByPath().slice(1),
                printerPath = Hualala.PageRoute.getCurrentPath();
            //打印设置的path
            printerParentPath[1].path = printerPath.substr(0, printerPath.indexOf('/printer'));
            //生成打印机的面包屑导航
            Hualala.UI.BreadCrumb({
                container: $printerBread,
                hideRoot: true,
                nodes: printerParentPath
            });
            Hualala.Shop.initShopPrintMgr($printerContent, params);
        });
    }
    Hualala.Shop.PrinterInit = initShopPrinterMgr;

    function remarksInitMgr(pageType,params){
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            $body.append('<div class="page-body"></div>');
            Hualala.Saas.remarks.initRemark($body.find('.page-body'), params);
        });
    }
    Hualala.Shop.remarksInit =remarksInitMgr;
    //折扣方案
    function DiscountManageInitMgr(pageType,params){
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            Hualala.Shop.initShopDiscountMgr($body, params);
        });
    }
	Hualala.Shop.DiscountManageInit=DiscountManageInitMgr;
    //时段管理
    function TimeManageInitMgr(pageType,params){
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data) {
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            Hualala.Shop.initTimeMgr($body, params,cityID);
        });
    }
    Hualala.Shop.TimeManageInit=TimeManageInitMgr;

    //参数及站点
    function saasParamsInit(pageType, params) {
        var $body = $('#ix_wrapper > .ix-body > .container');
        Hualala.UI.BreadCrumb({
            container: $body,
            hideRoot: true,
            nodes: Hualala.PageRoute.getParentNamesByPath()
        });
        checkSaasOpen(params, function (data){
            Hualala.Shop.createShopInfoHead(params, $body, data);
            Hualala.Shop.createShopFuncNav(pageType, params, $body, data.can == 1);
            Hualala.Shop.initSaasParams($body, params);
        });
    }
    Hualala.Shop.SaasParamsInit = saasParamsInit;

})(jQuery, window);