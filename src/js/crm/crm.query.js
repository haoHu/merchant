(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        C = Hualala.Common,
        M = C.Math,
        CrmTypeDef = Hualala.TypeDef.CRM,
        dF = IX.Date,
        tplLib = Hualala.TplLib,
        parseForm = Hualala.Common.parseForm,
        topTip = Hualala.UI.TopTip;
        
    var staticData = {
        cardStatus: CrmTypeDef.cardStatus,
        customerSex: CrmTypeDef.customerSex,
        sourceWay: CrmTypeDef.sourceWay,
        
        crmQueryTableHeads: ['姓名', '性别', '手机号(卡号)', '生日', '等级', '入会日期', '储值余额', '积分余额', '累计储值总额', '累计消费总额', '状态', '查看'],
        crmQueryTableKeys: ['customerName', 'customerSex', 'customerMobile', 'customerBirthday', 'cardLevelName', 'createTime', 'moneyBalance', 'pointBalance', 'saveMoneyTotal', 'consumptionTotal', 'cardStatus', 'cardID']
    };
    
    var levels = null, pageSize = 15,
        $tbody = null, $pager = $('<div>').addClass('pull-right'),
        vipLevelTpl = Handlebars.compile(tplLib.get('tpl_crm_recharge_set_vip_level'));
    
	Hualala.CRM.initQuery = function($crm)
    {
        var params = {pageNo: 1, pageSize: pageSize}, $form = null;
        
        $(Handlebars.compile(tplLib.get('tpl_crm_query'))(staticData)).appendTo($crm);
        $crm.append($pager);
        
        $crm.find('[data-type=datetimepicker]').datetimepicker({
            format : 'yyyy/mm/dd',
            startDate : '2010/01/01',
            autoclose : true,
            minView : 'month',
            todayBtn : true,
            todayHighlight : true,
            language : 'zh-CN'
        });
        
        $form = $crm.find('form');
        $tbody = $crm.find('tbody');
        $levels = $crm.find('[name=cardLevelID]');
        
        if(levels)
            $levels.append(vipLevelTpl({levels: levels}));
        else
        {
            G.getVipLevels({}, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                levels = filterVipLevels(rsp.data.records);
                $levels.append(vipLevelTpl({levels: levels}));
            });
        }
        
        queryCrm(params);
        
        $crm.find('.well a').on('click', function()
        {
            $crm.find('.more-crm-query').slideToggle();
            this.text = this.text == '收起' ? '更多查询条件' : '收起';
        });
        
        $crm.find('.well .btn').on('click', function()
        {
            var args = parseForm($form);
            args.createTimeStart = formatPostDate(args.createTimeStart);
            args.createTimeEnd = formatPostDate(args.createTimeEnd);
            $.extend(params, args);
            params.pageNo = 1;
            queryCrm(params);
        });
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            queryCrm(params);
        });
    };
    
    function renderCrmQueryTable($tbody, items)
    {
        var trs = [], keys = staticData.crmQueryTableKeys,
            icoOk = '<i class="glyphicon glyphicon-ok ok" title="手机号已绑定"></i>',
            createPath = Hualala.PageRoute.createPath;
        for(var i = 0, item; item = items[i++];)
        {
            var $tr = $('<tr>');
            for(var j = 0, key; key = keys[j++];)
            {
                var $td = $('<td>'), val = item[key] || '';
                
                if(key == 'customerMobile' && item.cardNO)
                {
                    val += '(卡号)';
                    $td.attr('title', '卡号：' + item.cardNO).attr('data-toggle', 'tooltip')
                    .tooltip({ trigger: 'click | hover', container: 'body' })
                }
                
                if(/customerSex|cardStatus/.test(key))
                    val = staticData[key][val];
                else if(/saveMoneyTotal|moneyBalance|giveBalance|consumptionTotal|pointBalance/.test(key))
                    val = M.prettyNumeric(val);
                else if(/createTime|customerBirthday/.test(key))
                    val = C.formatDateStr(val.replace(/-/g, ''));
                else if(key == 'customerMobile' && +item.isMobileChecked)
                    val += icoOk;
                else if(key == 'cardID')
                    val = $('<a>查看</a>').attr('href', createPath('crmMemberDetail', [val]));
                
                $td.html(val).appendTo($tr);
            }
            trs.push($tr);
        }
        $tbody.empty().append(trs);
    }
    
    function queryCrm(params, cbFn)
    {
        G.queryCrm(params, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var records = rsp.data.records || [],
                page = rsp.data.page;
            renderCrmQueryTable($tbody, records);
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        });
    }
    
    function formatPostDate(str)
    {
        return /\d{4}\/\d{2}\/\d{2}/.test(str) ? str.split('/').join('') : '';
    }
    
    function filterVipLevels(levels)
    {
        var ret = [];
        for(var i = 0, level; level = levels[i]; i++)
            if(+level.isActive) ret.push(level);
        
        return ret;
    }
})(jQuery, window);