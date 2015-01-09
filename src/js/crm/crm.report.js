(function ($, window) {
	IX.ns("Hualala.CRM");
    
    var G = Hualala.Global,
        C = Hualala.Common,
        CrmTypeDef = Hualala.TypeDef.CRM,
        formatDateStr = C.formatDateStr,
        prettyNumeric = C.Math.prettyNumeric,
        parseForm = C.parseForm,
        tplLib = Hualala.TplLib,
        U = Hualala.UI,
        topTip = Hualala.UI.TopTip;
    
    var sumWay = { '1': '线上合计', '0': '线下合计', '-1': '总计' };
    var sumSets = {
            TransSum: 'summerizingGroupByTransWayDs',
            TransDetail: 'detailGroupByTransWayDs',
            CardSum: 'cardCreateSumarizeGroupByTransWayDs',
            RechargeSum: 'summerizingGroupByTransWayDs'
        };
    var Funcs = {
        date: function(v){ return formatDateStr(v.replace(/-/g, ''), 12); },
        number: function(v, item, keyInfo, $td){ $td.addClass('t-r'); return prettyNumeric(v); },
        transType: function(v, item) { return CrmTypeDef.transWay[item['transWay']] + v; },
        viewDetail: function(v, item) { return $('<a href="javascript:;">详情</a>').data('transid', item.transID) },
        sum: function(v, item, keyInfo) { return sumWay[item[keyInfo['sumWay']]] + (keyInfo.count ? ('(共' + v + '笔)') : '') },
        shopName: function(v, item, keyInfo ,c, i) { return (keyInfo.count ? i + '. ' : '') + (+item[keyInfo['shopID']] ? v : '线上') }
    };
    
    var keys, fkeys, module, params, transRecords,
        today = IX.Date.getDateByFormat(IX.Date.formatDate(new Date), 'yyyy/MM/dd'),
        tplWell = Handlebars.compile(tplLib.get('tpl_crm_query_panel'))({today: today}),
        tplTable = tplLib.get('tpl_report_table'),
        $mbody, $well, $form, $thead, $tbody, $pager;
    
    function renderThead($thead, keys)
    {
        var $tr = $('<tr>');
        for(var key in keys)
        {
            var keyInfo = keys[key], title = keyInfo.title, $th = $('<th>');
            if(keyInfo.newRow)
            {
                $thead.append($tr);
                $tr = $('<tr>');
            }
            if(keyInfo.rowspan) $th.attr('rowspan', keyInfo.rowspan);
            if(keyInfo.colspan) $th.attr('colspan', keyInfo.colspan);
            if(keyInfo.sort)
            {
                title = '<span></span>' + title;
                $th.addClass('sort').data('key', key);
            }
            
            $tr.append($th.html(title));
        }
        $thead.append($tr);
    }
    
    function renderData($container, items, keys)
    {
        var trs = [];
        for(var i = 0, item; item = items[i++];)
        {
            var $tr = $('<tr>');
            for(var key in keys)
            {
                var val = item[key] || '', keyInfo = keys[key], 
                    type = keyInfo.type, $cell = $(type == 'sum' ? '<th>' : '<td>');
                if(keyInfo.ignore) continue;
                if(type) val = Funcs[type](val, item, keyInfo, $cell, i);
                if(keyInfo.colspan) $cell.attr('colspan', keyInfo.colspan);
                $cell.html(val).appendTo($tr);
            }
            trs.push($tr);
        }
        $container.html(trs);
    }
    
    function getData(module, params)
    {
        if(module != 'CardSum')
        {
            params.queryStartTime = params.queryStartTime.replace(/\//g, '');
            params.queryEndTime = params.queryEndTime.replace(/\//g, '');
        }
        G['getCrm' + module](params, function(rsp)
        {//console.log(JSON.stringify(params))
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }//console.log(JSON.stringify(rsp))
            var records = rsp.data.records || [],
                sumRecords = rsp.data.datasets[sumSets[module]].data.records || [],
                page = rsp.data.page;
            renderData($tbody, records, keys);
            renderData($tfoot, sumRecords, fkeys);
            if(module == 'TransDetail') transRecords = records;
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        });
    }
    
	function initModule(module, $mbody)
    {
        module = module;
        $mbody = $mbody.addClass(module);
        params = {pageNo: 1, pageSize: 15};
        
        if(module != 'TransDetail')
        {
            fkeys = $.extend({}, keys);
            for(var k in fkeys)
            {
                fkeys[k] = { sumWay: 'transWay', type: 'sum' };
                if(module == 'CardSum') fkeys[k].sumWay = 'sourceWay';
                break;
            }
        }
        
        if(module != 'CardSum')
        {
            params = {pageNo: 1, pageSize: 15, queryStartTime: today, queryEndTime: today};
            $well = $(tplWell).appendTo($mbody);
            $form = $well.find('form');
            U.createSchemaChosen($('[name=transShopID]'), $('[name=cityID]'));
            $form.find('[name=queryStartTime], [name=queryEndTime]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/10/10',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
            });
            
            $well.on('click', '.btn', function()
            {
                params.pageNo = 1;
                $.extend(params, parseForm($form));
                getData(module, params);
            });
        }
        
        var $table = $(tplTable).appendTo($mbody);
        $thead = $table.find('thead');
        $tbody = $table.find('tbody');
        $tfoot = $table.find('tfoot');
        $pager = $('<div>').addClass('pull-right').appendTo($mbody);
        
        renderThead($thead, keys);
        var $sort = $thead.find('.sort');
        $thead.on('click', '.sort', function()
        {
            var $this = $(this), sortClass = '';
            $sort.not(this).removeClass('asc desc');
            if($this.hasClass('asc'))
                $this.removeClass('asc').addClass(sortClass = 'desc');
            else if($this.hasClass('desc'))
                $this.removeClass('desc').addClass(sortClass = '');
            else
                $this.addClass(sortClass = 'asc');
            params.orderBy = sortClass ? $this.data('key') + ' ' + sortClass : '';
            getData(module, params);
        });
        
        getData(module, params);
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getData(module, params);
        });
    }
    
    Hualala.CRM.initTransSum = function($mbody)
    {
        keys = {
            transShopName: { title: '店铺', type: 'shopName', shopID: 'transShopID', count: 1 },
            shopChargeSum: { title: '储值金额', type: 'number', sort: 1 },
            shopChargeCount: { title: '储值笔数', type: 'number', sort: 1 },
            shopChargeGiftSum: { title: '储值赠送金额', type: 'number', sort: 1 },
            shopChargeReturnPointSum: { title: '储值返积分数', type: 'number', sort: 1 },
            shopMinusMoneySum: { title: '储值减少金额', type: 'number', sort: 1 },
            shopMinusMoneyCount: { title: '储值减少笔数', type: 'number', sort: 1 },
            shopConsumeDeductPointSum: { title: '消费积分抵扣', type: 'number', sort: 1 },
            shopConsumeDeductPointCount: { title: '积分抵笔数', type: 'number', sort: 1 },
            shopconsumptionAmountSum: { title: '消费金额', type: 'number', sort: 1 },
            shopConsumptionCount: { title: '消费笔数', type: 'number', sort: 1 },
            shopConsumptionReturnPointSum: { title: '消费返积分数', type: 'number', sort: 1 }
        };
        initModule('TransSum', $mbody);
    }
    
    Hualala.CRM.initTransDetail = function($mbody)
    {
        keys = {
            transShopName: { title: '交易店铺', type: 'shopName', shopID: 'transShopID' },
            transTypeName: { title: '交易类型', type: 'transType' },
            cardNO: { title: '卡号' },
            customerMobile: { title: '手机号' },
            customerName: { title: '会员姓名' },
            consumptionAmount: { title: '消费金额', type: 'number', sort: 1 },
            moneyChange: { title: '储值金额变动', type: 'number', sort: 1 },
            pointChange: { title: '积分余额变动', type: 'number', sort: 1 },
            transTime: { title: '交易时间', type: 'date', sort: 1 },
            transRemark: { title: '交易备注' },
            action: { title: '操作', type: 'viewDetail' }
        };
        
        fkeys = {
            transCount: { sumWay: 'transWay', type: 'sum', count: 1, colspan: 5 },
            shopconsumptionAmountSum: { type: 'number' },
            moneyChangeSum: { type: 'number' },
            pointChangeSum: { type: 'number' },
            empty: { colspan: 3 }
        };
        
        initModule('TransDetail', $mbody);
        
        $form.prepend('<label>关键字<input type="text" name="keyword" placeholder="手机号/卡号" class="form-control"></label>');
        U.fillSelect($('<label>类型<select name="transType" class="form-control"></label>').appendTo($form).find('select'), CrmTypeDef.transType).prepend('<option value="">不限</option>').val('');
        
        $tbody.on('click', 'a', function()
        {
            var transReceiptsTxt = transRecords[C.inArray(transRecords, {transID: $(this).data('transid')}, 'transID')].transReceiptsTxt.replace(/\n/g, '<br>'),
                modal = new U.ModalDialog({clz: 'modal-trans-detail', title: '会员交易账单详情', html: transReceiptsTxt}).show();
            modal._.footer.find('.btn-close').remove();
            modal._.footer.find('.btn-ok').text('确定').attr('data-dismiss', 'modal');
        });
    }
    
    Hualala.CRM.initCardSum = function($mbody)
    {
        keys = {
            createShopName: { title: '店铺', type: 'shopName', shopID: 'createShopID' }
        };
        var curMonth = (new Date().getMonth()) + 1;
        for(var i = 5; i > 0; i--)
        {
            var month = curMonth - i;
            month = month < 1 ? month + 12 : month;
            keys['sub' + i + 'MonthCardCount'] = { title: month + '月新增', type: 'number', sort: 1 };
        }
        keys.curMonthCardCount = { title: '本月新增', type: 'number', sort: 1 };
        keys.cardCount = { title: '当前会员总数', type: 'number', sort: 1 };
        keys.useableCardCount = { title: '有效会员总数', type: 'number', sort: 1 };
        
        initModule('CardSum', $mbody);
    }
    
    Hualala.CRM.initRechargeSum = function($mbody)
    {
        keys = {
            transShopName: { title: '店铺', type: 'shopName', shopID: 'transShopID', rowspan: '2' },
            saveMoneyCount: { title: '储值笔数小计', type: 'number', rowspan: '2'  },
            saveMoneyAmountSum: { title: '储值金额小计', type: 'number', rowspan: '2' },
            saveReturnMoneyAmountSum: { title: '储值赠送金额小计', type: 'number', rowspan: '2' },
            rechargeWay: { title: '收款方式', ignore: 1, colspan: 5 },
            saveMoneyCashSum: { title: '现金', type: 'number', newRow: 1 },
            saveMoneyCardSum: { title: '银行卡', type: 'number' },
            saveMoneyCheckSum: { title: '支票', type: 'number' },
            saveMoneyOtherSum: { title: '其他', type: 'number' },
            saveMoneyOnlineChargeSum: { title: '哗啦啦付款', type: 'number' }
        };
        initModule('RechargeSum', $mbody);
    }
    
})(jQuery, window);