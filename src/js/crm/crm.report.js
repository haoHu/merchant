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
            RechargeSum: 'summerizingGroupByTransWayDs',
            //会员日报表
            MemberDailyreport: 'sumData'
        };
    var Funcs = {
        date: function(v){ return formatDateStr(v.replace(/-/g, ''), 12); },
        number: function(v, item, keyInfo, $td){ $td.addClass('t-r'); return prettyNumeric(v); },
        mobile: function(v, item, keyInfo, $td)
        {
            if(item.cardNO)
            {
                v += '(卡号)';
                $td.attr('title', '卡号：' + item.cardNO).attr('data-toggle', 'tooltip')
                .tooltip({ trigger: 'click | hover', container: 'body' });
            }
            
            return v; 
        },
        transType: function(v, item) { return CrmTypeDef.transType[v]; },
        viewDetail: function(v, item) { return $('<a href="javascript:;">详情</a>').data('transid', item.transID) },
        sum: function(v, item, keyInfo) { return sumWay[item[keyInfo['sumWay']]] + (keyInfo.count ? ('(共' + v + '笔)') : '') },
        shopName: function(v, item, keyInfo ,c, i, module) { return (keyInfo.count ? i + '. ' : '') + (+item[keyInfo['shopID']] ? v : module == 'CardSum' ? '网上自助入会' : '网上储值') }
    };
    var d = new Date(),year = d.getFullYear(),mon=d.getMonth()+1,day=d.getDate();
        if(day <= 3){
            if(mon>1) {
               mon=mon-1;
            }
           else {
             year = year-1;
             mon = 12;
            }
        }
        d.setDate(d.getDate()-3);
        year = d.getFullYear();
        mon=d.getMonth()+1;
        day=d.getDate();
        Beforeyesterday = year+"/"+(mon<10?('0'+mon):mon)+"/"+(day<10?('0'+day):day);

    var keys, fkeys, module, params, transRecords,
        today = IX.Date.getDateByFormat(IX.Date.formatDate(new Date), 'yyyy/MM/dd'),
        tplWell = Handlebars.compile(tplLib.get('tpl_crm_query_panel'))({Beforeyesterday:Beforeyesterday,today: today}),
        tplTable = tplLib.get('tpl_report_table'),
        $mbody, $queryBox,$resultBox,$well, $form, $thead, $tbody, $pager;
    
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
    
    function renderData($container, items, keys, module)
    {
        var trs = [];
        if (module == 'TransDetail' && items.length == 0) {
            var $tr = $('<tr>'),
                $td = $('<td colspan="'+ Object.keys(keys).length +'"><p class="text-center">无结果</p></td>');
            $tr.append($td);
            trs.push($tr);
        } else {
            if (module == 'TransSum' || module == 'RechargeSum') items = _.reject(items, function (item) { return item.transShopID == 0;});
            for(var i = 0, item; item = items[i++];) {
                var $tr = $('<tr>');
                for(var key in keys)
                {
                    var val = item[key] || '', keyInfo = keys[key],
                        type = keyInfo.type, $cell = $(type == 'sum' ? '<th>' : '<td>');
                    if(keyInfo.ignore) continue;
                    if(type) val = Funcs[type](val, item, keyInfo, $cell, i, module);
                    if(keyInfo.colspan) $cell.attr('colspan', keyInfo.colspan);
                    if(key == 'customerMobile') val = '<a href=/#crm/member/' + item.cardID + '/detail target=_blank>'+ val + '</a>';
                    $cell.html(val).appendTo($tr);
                }
                trs.push($tr);
            }
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
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var records = rsp.data.records || [],
                sumRecords = rsp.data.datasets[sumSets[module]].data.records || [],
                page = rsp.data.page;
            renderData($tbody, records, keys, module);
            if(!_.contains(['TransDetail', 'TransSum', 'RechargeSum'], module)) renderData($tfoot, sumRecords, fkeys);
            if(_.contains(['TransSum', 'RechargeSum'], module)) {
                var $statistics = $('<tbody>');
                renderData($statistics, sumRecords.slice(0, sumRecords.length - 1), fkeys);
                $tbody.prepend($statistics.children());
                renderData($tfoot, sumRecords.slice(sumRecords.length - 1), fkeys);
            }
            if(module == 'TransDetail') transRecords = records;
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        });
    }
    
	function initModule(module, $mbody)
    {
        module = module;
        $mbody = $mbody.addClass(module);
        $queryBox =$mbody.find(".crm-query-box");
        $resultBox =$mbody.find(".crm-result-box")

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
            params = {pageNo: 1, pageSize: 15, queryStartTime: Beforeyesterday, queryEndTime: today};
            $well = $(tplWell).appendTo($queryBox);
            $form = $well.find('form');
            if(module=="MemberDailyreport"){
                params = {pageNo: 1, pageSize: 15, queryStartTime: Beforeyesterday, queryEndTime: today};
                $('.shop').addClass("hidden");
                $('.city').addClass("hidden")
            }
            else{
                U.createSchemaChosen($('[name=transShopID]'), $('[name=cityID]'));
            }
            $form.find('[name=queryStartTime], [name=queryEndTime]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/10/10',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
            });
            
            $well.on('click', '.btn[name="searchbutton"]', function()
            {
                params.pageNo = 1;
                $.extend(params, parseForm($form));
                getData(module, params);
            });

        }
        
        var $table = $(tplTable).appendTo($resultBox);
        $thead = $table.find('thead');
        $tbody = $table.find('tbody');
        $tfoot = $table.find('tfoot');
        $pager = $('<div>').addClass('pull-right').appendTo($resultBox);
        if(module=="MemberDailyreport"){
            var tips = '<p>实收指线下储值时收款方式为现金、银行卡、支票的总计金额</p>';
            $pager.before($(tips));
        }
        if(module=="CardSum"){
            var excelbutton = '<div class="well well-sm t-r"><button class="btn btn-warning" name="excelbutton">报表导出</button></div>';
            $(excelbutton).appendTo($queryBox); 
        }
        $queryBox.on('click', '.btn[name="excelbutton"]', function(){
                var data=parseForm($form);
                if(data!=null){
                    if(data.queryStartTime!=undefined&&data.queryEndTime!=undefined){
                        data.queryStartTime = data.queryStartTime.replace(/\//g, '');
                        data.queryEndTime = data.queryEndTime.replace(/\//g, '');
                    }
                }
                var pagename=Hualala.PageRoute.getPageContextByPath().name;
                var serviceName,templateName,ExcelfilePath,extraparams,globalparams;        
                var group = $XP(Hualala.getSessionData(),'site',''),
                    groupName = $XP(group,'groupName','');
                    currentNav = Hualala.PageRoute.getPageContextByPath(),
                    currentLabel = $XP(currentNav,'label',''),
                    fileName =groupName+currentLabel+".xls";
                switch(pagename) {
                        //入会统计
                        case "crmCardStats":
                            serviceName = "pay_crmCustomerCardCreateSummarizeService";
                            templateName ="crmCustomerCardCreateSummarizeReport.xml";
                            extraparams= {serviceName:serviceName,templateName:templateName};
                            globalparams=_.extend(extraparams,{fileName:fileName});
                            break;
                        //储值消费汇总
                        case "crmDealSummary":
                            serviceName = "pay_crmTransDetailSummrizingService";
                            templateName = "crmTransDetailSummrizingReport.xml";
                            transShopName = $('select[name=transShopID] option:selected').text();
                            extraparams= {serviceName:serviceName,templateName:templateName,transShopName:transShopName};
                            globalparams=_.extend(data,extraparams,{fileName:fileName});
                            break;
                        //交易明细
                        case "crmDealDetail":
                            serviceName = "pay_crmTransDetailQueryService";
                            templateName ="crmTransDetailQueryReport.xml";
                            transShopName = $('select[name=transShopID] option:selected').text();
                            extraparams= {serviceName:serviceName,templateName:templateName,transShopName:transShopName};
                            globalparams=_.extend(data,extraparams,{fileName:fileName});
                            break;
                        //储值对账
                        case "crmRechargeReconciliation":
                            serviceName = "pay_crmTransDetailSaveMoneyReconcileQueryService";
                            templateName ="crmTransDetailSaveMoneyReconcileReport.xml";
                            transShopName = $('select[name=transShopID] option:selected').text();
                            extraparams= {serviceName:serviceName,templateName:templateName,transShopName:transShopName};
                            globalparams=_.extend(data,extraparams,{fileName:fileName});
                            break;
                        //会员日报表
                        case "memberQueryDay":
                            serviceName = "crm_customerDayReport";
                            templateName ="customerDayReport.xml";
                            extraparams= {serviceName:serviceName,templateName:templateName};
                            globalparams=_.extend(data,extraparams,{fileName:fileName});
                            break;
                    }
                    G.OrderExport(globalparams, function (rsp) {
                        if(rsp.resultcode != '000'){
                            rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        ExcelfilePath =rsp.data.filePath || [];
                        var dowloadhref=ExcelfilePath;
                        window.open(dowloadhref); 
                    })
            
            });
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
            transShopName: { title: '店铺', type: 'shopName', shopID: 'transShopID', count: 1, rowspan: 2 },
            
            shopCharge: { title: '储值业务', ignore: 1, colspan: 4 },
            shopConsumption: { title: '消费业务', ignore: 1, colspan: 6 },
            //储值业务
            shopChargeCount: { title: '笔数', type: 'number', sort: 1, newRow: 1 },
            shopChargeSum: { title: '现金卡值', type: 'number', sort: 1 },
            shopChargeGiftSum: { title: '赠送卡值', type: 'number', sort: 1 },
            shopChargeReturnPointSum: { title: '返积分数', type: 'number', sort: 1 },
            //消费业务
            shopConsumptionCount: { title: '笔数', type: 'number', sort: 1 },
            //shopconsumptionAmountSum: { title: '消费金额', type: 'number', sort: 1 },
            deductionMoneyAmountSum : { title: '现金卡值', type: 'number', sort: 1 },
            giveBalancePaySum  : { title: '赠送卡值', type: 'number', sort: 1 },
            shopConsumeDeductPointSum: { title: '积分抵扣', type: 'number', sort: 1 },
            shopConsumptionReturnPointSum: { title: '返积分', type: 'number', sort: 1 }
        };
        initModule('TransSum', $mbody);
    }
    
    Hualala.CRM.initTransDetail = function($mbody)
    {
        keys = {
            transTime: { title: '交易时间', type: 'date', sort: 1 },
            transShopName: { title: '交易店铺', type: 'shopName', shopID: 'transShopID' },
            customerName: { title: '会员姓名' },
            customerMobile: { title: '手机号(卡号)', type: 'mobile' },
            transType: { title: '交易类型', type: 'transType' },
            consumptionAmount: { title: '消费金额', type: 'number', sort: 1 },
            saveMoneyAmountSum: { title: '现金卡值', type: 'number', sort: 1 },
            giveBalancePaySum: { title: '赠送卡值', type: 'number', sort: 1 },
            deductionPointAmount: { title: '扣积分', type: 'number', sort: 1 },
            returnPointAmount: { title: '赠积分', type: 'number', sort: 1 },
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
        
        $form.prepend('<span>关键字<input type="text" name="keyword" placeholder="手机号/卡号" class="form-control"></span>');
        U.fillSelect($('<span>类型<select name="transType" class="form-control"></span>').appendTo($form).find('select'), CrmTypeDef.transType).prepend('<option value="">不限</option>').val('');
        
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
            saveMoneyCount: { title: '笔数', type: 'number', rowspan: '2'  },
            saveMoneyAmountSum: { title: '现金卡值', type: 'number', rowspan: '2' },
            saveReturnMoneyAmountSum: { title: '赠送卡值', type: 'number', rowspan: '2' },
            rechargeWay: { title: '收款方式', ignore: 1, colspan: 5 },
            saveMoneyCashSum: { title: '现金', type: 'number', newRow: 1 },
            saveMoneyCardSum: { title: '银行卡', type: 'number' },
            saveMoneyCheckSum: { title: '支票', type: 'number' },
            saveMoneyOtherSum: { title: '其它', type: 'number' },
            saveMoneyOnlineChargeSum: { title: '哗啦啦付款', type: 'number' }
        };
        initModule('RechargeSum', $mbody);
    }
    //会员日报表
    Hualala.CRM.initMemberDailyreport = function($mbody)
    {
        keys = {
            dt: { title: '日期', type: 'date', rowspan: '2' },
            newCardCnt: { title: '新增会员数', type: 'number', rowspan: '2'  },
            withdrawCardCnt: {title: '注销会员数',type:'number',rowspan: '2'},
            saveMoneyOffline: { title: '线下储值', ignore: 1, colspan: 5 },
            saveMoneyOnline: { title: '线上储值', ignore: 1, colspan: 4 },
            activeRows:{title: '活动', ignore: 1, colspan: 4},
            cardPayCount: { title: '消费', ignore: 1, colspan: 5 },
            cardCount: { title: '当前会员卡', ignore: 1, colspan: 4 },
            //线下储值
            saveMoneyOfflineCnt: { title: '笔数', type: 'number', newRow: 1 },
            saveMoneyOfflineCashAmt:{title:'实收',type: 'number'},
            saveMoneyOfflineAmt: { title: '现金卡值', type: 'number' },
            saveMoneyOfflineGiveAmt: { title: '赠送卡值', type: 'number' },
            saveMoneyOfflineRtnPoint: { title: '积分赠送', type: 'number' },
            //线上储值
            saveMoneyOnlineCnt: { title: '笔数', type: 'number' },
            saveMoneyOnlineAmt: { title: '现金卡值', type: 'number' },
            saveMoneyOnlineGiveAmt: { title: '赠送卡值', type: 'number' },
            saveMoneyOnlineRtnPoint: { title: '积分赠送', type: 'number' },
            //活动
            activeCnt: { title: '参与次数', type: 'number' },
            activePointPayAmt: { title: '积分减少', type: 'number' },
            activeGiveAmt: { title: '赠送卡值增加', type: 'number' },
            activePointAmt: { title: '积分增加', type: 'number' },
            
            //消费
            cardPayCnt: { title: '笔数', type: 'number' },
            cardPayAmt: { title: '现金卡值', type: 'number' },
            cardPayGiveAmt: { title: '赠送卡值', type: 'number' },
            cardPayPointAmt: { title: '积分抵扣', type: 'number' },
            cardPayRtnPoint: { title: '返积分', type: 'number' },
            //会员卡
            cardCnt: { title: '卡数', type: 'number'},
            cardMoneyBal: { title: '现金卡值', type: 'number' },
            cardGiveBal: { title: '赠送卡值', type: 'number' },
            cardPointBal: { title: '积分总数', type: 'number' }
        };
        initModule('MemberDailyreport', $mbody);
        fkeys = {
            transCount: { sumWay: 'transWay', type: 'sum'},
            newCardCntSum : {type: 'number'},
            withdrawCardCntSum :{type: 'number'},
            //线下            
            saveMoneyOfflineCntSum : { type: 'number'},
            saveMoneyOfflineCashAmtSum : { type: 'number'},
            saveMoneyOfflineAmtSum : { type: 'number'},
            saveMoneyOfflineGiveAmtSum : { type: 'number'},
            saveMoneyOfflineRtnPointSum : { type:'number'},
            //线上
            saveMoneyOnlineCntSum :{ type: 'number'},
            saveMoneyOnlineAmtSum :{ type: 'number'},
            saveMoneyOnlineGiveAmtSum : { type: 'number'},
            saveMoneyOnlineRtnPointSum : { type: 'number'},
            //活动
            activeCntSum: { type: 'number' }, 
            activePointPayAmtSum: { type: 'number' },  
            activeGiveAmtSum: {  type: 'number' },
            activePointAmtSum: {  type: 'number' },
            //消费
            cardPayCntSum :{ type: 'number'},
            cardPayAmtSum :{ type: 'number'},
            cardPayGiveAmtSum :{ type: 'number'},
            cardPayPointAmtSum :{ type: 'number'},
            cardPayRtnPointSum :{ type: 'number'},
            empty: { colspan: 4 }
        };
 
    }
    
})(jQuery, window);