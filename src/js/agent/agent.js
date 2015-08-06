(function ($, window) {
	IX.ns("Hualala.Agent");
    
    Hualala.Agent.AgentInfoInit = function()
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        
        var keys = {
            shopName: '店铺名称',
            shopID: '店铺账号',
            shopTel: '店铺电话',
            HLL_AgentLastRequestTime: '最后请求时间',
            HLL_AgentRunStatus: '运行状态',
            foodLastUpdateTimeAndSign: '菜品更新时间',
            CSP_softName: '餐饮软件',
            CSP_IFCurrVersionNo: '接口版本号',
            HLL_AgentCurrVersionNo: '代理程序版本',
            shopSecret: '通讯密钥',
            pwd: '登录密码'
        };
        
        var params = { pageNo: 1, pageSize: 15 }, 
            items = [], page = null;
            
        var agentPath = Hualala.PageRoute.createPath('pcclient');
        var tplAgent = Handlebars.compile(tplLib.get('tpl_agent'));
        var $container = $('#ix_wrapper > .ix-body > .container');
        $container.html(tplAgent({agentPath: agentPath}));
        var $form = $container.find('form'),
            $city = $form.find('[name=shopID]'),
            $table = $container.find('table'),
            $thead = $table.find('thead'),
            $tbody = $table.find('tbody'),
            $loading = $container.find('#loading'),
            $pager = $container.find('#pager'),
            $noTip = $container.find('#noTip');
        
        U.createSchemaChosen($city);
        
        var $theadTr = $('<tr>');
        for(var key in keys)
        {
            $theadTr.append($('<th>').html(keys[key]));
        }
        $thead.append($theadTr);
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getAgentInfo();
        });
        
        $city.on('change', function()
        {
            params.pageNo = 1;
            params.shopID = this.value;
            getAgentInfo();
        });
        
        $tbody.on('click', '.j-viewSecret', function()
        {
            var $me = $(this),
                $secret = $me.siblings('div'),
                shopID = $me.data('shopID');
            C.loadData('getAgentInfo', {shopID: shopID}).done(function(records)
            {
                var secret = records[0].shopSecret;
                $secret.text(secret);
                if(!secret) topTip({msg: '通讯密钥为空!'});
            });
        });
        
        $tbody.on('click', '.j-resetSecret', function()
        {
            var $me = $(this);
            U.Confirm({msg: '确定重置通讯密钥？', okFn: function()
            {
                var $secret = $me.siblings('div'),
                    shopID = $me.data('shopID');
                C.loadData('resetAgentSecret', {shopID: shopID}, null, 'data')
                .done(function(data)
                {
                    topTip({msg: '重置成功!', type: 'success'});
                    $secret.text(data.shopSecret);
                });
            }});
        });
        
        $tbody.on('click', '.j-changePwd', function()
        {
            Hualala.Shop.resetAngentPwd($(this).data('shopID'));
        });
        
        getAgentInfo();
        
        function getAgentInfo()
        {
            $table.hide();
            $pager.hide();
            $noTip.hide();
            $loading.show();
            C.loadData('getAgentInfo', params, null, 'data')
            .done(function(data)
            {
                page = data.page;
                items = data.records || [];
                renderData();
            }).always(function(){ $loading.hide(); });
        }
        
        function renderData()
        {
            if(!items.length)
            {
                $noTip.show();
                return;
            }
            
            $table.show();
            var trs = [];
            for(var i = 0, item; item = items[i++];)
            {
                var $tr = $('<tr>');
                for(var key in keys)
                {
                    var val = item[key] || '', cellCont = val, $cell = $('<td>');
                    if(key == 'HLL_AgentRunStatus')
                    {
                        var t = item.delayTime;
                        cellCont = val == 1 && t <= 2 ? '在线' :
                        '离线' + (val == 0 ? '' : '<br>' + t + '分钟');
                        $cell.addClass('t-c');
                    }
                    else if(key == 'shopSecret')
                    {
                        cellCont = $('<a href="javascript:;" class="j-viewSecret">查看</a><a href="javascript:;" class="j-resetSecret ml-8">重置</a><div></div>');
                        cellCont.filter('a').data('shopID', item.shopID);
                        $cell.addClass('t-c');
                    }
                    else if(key == 'pwd')
                    {
                        cellCont = $('<a href="javascript:;" class="j-changePwd">设置</a>')
                        .data('shopID', item.shopID)
                        $cell.addClass('t-c');
                    }
                    else if(key == 'CSP_softName')
                    {
                        cellCont = val.replace('餐饮软件', '');
                    }
                    else if(key == 'HLL_AgentLastRequestTime' || key == 'foodLastUpdateTimeAndSign')
                    {
                        cellCont = C.formatDateStr(val, 12).replace(' ', '<br>');
                        $cell.addClass('t-c');
                    }
                    
                    $cell.html(cellCont).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.html(trs);
            
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        }
        
    }
    
    
})(jQuery, window);











