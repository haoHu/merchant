(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        C = Hualala.Common,
        M = C.Math,
        dF = IX.Date,
        tplLib = Hualala.TplLib,
        parseForm = Hualala.Common.parseForm,
        topTip = Hualala.UI.TopTip;
        
    var staticData = {
        sourceType: {
            '10': 'WEB网站',
            '12': 'APP客户端',
            '14': '触屏版',
            '20': '店内',
            '22': '原会员导入',
            '30': '微信',
            '40': '淘宝',
            '50': '百度'
        },
        cardStatus: {
            '10': '正常',
            '20': '挂失中',
            '30': '冻结',
            '40': '注销'
        },
        customerSex: { '0': '女', '1': '男', '2': '未知' },
        sourceWay: { '0': '店内', '1': '网上' },
        
        today: dF.getDateByFormat(dF.formatDate(new Date), 'yyyy/MM/dd'),
        crmQueryTableHeads: ['来源', '姓名', '性别', '手机号', '生日', '卡号', '储值累计', '储值余额', '消费累计', '积分余额', '等级', '入会日期', '状态', '查看'],
        crmQueryTableKeys: ['sourceWay', 'customerName', 'customerSex', 'customerMobile', 'customerBirthday', 'cardNO', 'saveMoneyTotal', 'moneyBalance', 'consumptionTotal', 'pointBalance', 'cardLevelName', 'createTime', 'cardStatus', 'cardID']
    };
    
    var levels = null, pageSize = 15,
        $tbody = null, $pager = null,
        vipLevelTpl = Handlebars.compile(tplLib.get('tpl_crm_recharge_set_vip_level'));
    
	Hualala.CRM.initQuery = function($crm)
    {
        var params = {pageNo: 1, pageSize: pageSize}, $form = null;
        
        $(Handlebars.compile(tplLib.get('tpl_crm_query'))(staticData)).appendTo($crm);
        
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
        $pager = $crm.find('tfoot th').eq(0);
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
            createPath = Hualala.PageRoute.createPath;
        for(var i = 0, item; item = items[i++];)
        {
            var $tr = $('<tr>');
            for(var j = 0, key; key = keys[j++];)
            {
                var $td = $('<td>'), val = item[key];
                if(/customerSex|sourceWay|cardStatus/.test(key))
                    $td.text(staticData[key][val]);
                else if(/saveMoneyTotal|moneyBalance|consumptionTotal|pointBalance/.test(key))
                    $td.text(M.prettyNumeric(val));
                else if(key == 'createTime')
                    $td.text(formatDateStr(val));
                else if(key == 'customerBirthday')
                    $td.text(val.replace(/-/g, '/'));
                else if(key == 'cardID')
                    $('<a>查看</a>').attr('href', createPath('crmMemberDetail', [val])).appendTo($td);
                else
                    $td.text(val);
                    
                $tr.append($td);
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
    
    function formatDateStr(str)
    {
        return [str.substr(0, 4), str.substr(4, 2), str.substr(6, 2)].join('/');
    }
    
    function filterVipLevels(levels)
    {
        var ret = [];
        for(var i = 0, level; level = levels[i]; i++)
            if(+level.isActive) ret.push(level);
        
        return ret;
    }
})(jQuery, window);