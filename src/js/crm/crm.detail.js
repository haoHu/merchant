(function ($, window) {
	IX.ns("Hualala.CRM");
    
	Hualala.CRM.initDetail = function($container, cardID)
    {
        if(!cardID) return;
        
        $container.addClass('crm-detail');
        
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            tplLib = Hualala.TplLib,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
            basicInfo: [
                {customerName: '姓名', customerSex: '性别', customerBirthday: '生日', createTime: '入会时间', createShopName: '入会店铺'},
                {customerMobile: '手机号', cardNO: '卡号', cardLevelName: '等级' , moneyBalance: '储值余额', pointBalance: '积分余额'},
                {saveMoneyTotal: '储值累计', pointGetTotal: '积分累计', consumptionTotal: '消费累计', consumptionCount: '消费次数', lastConsumptionTime: '最后消费时间'}
            ],
            customerSex: CrmTypeDef.customerSex,
            transDetail: {
                transTime: '交易时间', transShopName: '交易店铺', transType: '交易类型', consumptionAmount: '消费金额', moneyChange: '储值余额变动', pointChange:'积分余额变动', transAfterMoneyBalance: '交易后储值余额', transAfterPointBalance: '交易后积分余额', transRemark: '交易备注'
            },
            transType: CrmTypeDef.transType,
            event: {
                customerName: '姓名', cardNO: '会员卡号', cardLevelName: '卡号等级', eventName: '活动主题', eventWay: '活动类型', createTime: '参与时间',
                //eventNews ~= Meta.eventNews[eventWay][winFlag]
                eventNews: '活动动态'
            },
            eventWay: CrmTypeDef.eventWay,
            gift: {
                createTime: '获得时间', giftName: '名称', getWay: '获得方式', giftStatus: '状态', usingShopName: '使用店铺', usingTime: '使用时间', validUntilDate: '有效期至'
            },
            getWay: CrmTypeDef.getWay,
            giftStatus: CrmTypeDef.giftStatus,
            cardLog: {
                createTime: '时间', shopName: '店铺', logType: '类型', operator: '经办人', remark: '备注'
            },
            logType: CrmTypeDef.logType
        };
        
        var imgHost = G.IMAGE_RESOURCE_DOMAIN + '/',
            defaultAvatar = G.IMAGE_ROOT + '/dino80.png';
        
        var params = {cardID: cardID},
            $tpl = $(tplLib.get('tpl_crm_detail')).appendTo($container),
            $basicInfo = $tpl.filter('.basic-info'),
            $trans = $tpl.find('#transDetail'),
            $events = $tpl.find('#activities'),
            $gifts = $tpl.find('#vouchers'),
            $logs = $tpl.find('#cardLog');
        
        $tpl.find('.tab-pane').addClass('table-responsive');
        getData(params, 'getCrmDetail', renderCrmDetail);
        getData(params, 'getCrmTransDetail', renderCrmTransDetail);
        getData(params, 'getCrmUserEvents', renderCrmUserEvents);
        getData(params, 'getCrmUserGifts', renderCrmUserGifts);
        getData(params, 'getCrmCardLogs', renderCrmCardLogs);
        
        function renderCrmDetail(data)
        {
            $('<img alt="会员头像" width="100" height="100">').attr('src', data.photoImage ? imgHost + data.photoImage : defaultAvatar).appendTo($basicInfo);
            
            var $div = $('<div>'),
                icoOk = '<i class="glyphicon glyphicon-ok ok" title="已验证"></i>';
            for(var i = 0, item; item = Meta.basicInfo[i++];)
            {
                var $ul = $('<ul>');
                for(var key in item)
                {
                    var val = data[key];
                    if(val)
                    {
                        if(/createTime|customerBirthday|lastConsumptionTime/.test(key))
                            val = formatDateStr(val.replace(/-/g, ''), 12);
                        else if(/moneyBalance|pointBalance|saveMoneyTotal|pointGetTotal|consumptionTotal/.test(key)) 
                            val = prettyNumeric(val);
                        else if(key == 'customerMobile' && +data.isMobileChecked)
                            val += icoOk;
                        else if(key == 'customerSex') 
                            val = Meta[key][val];
                        
                        $ul.append($('<li>').append($('<label>').text(item[key])).append($('<span>').html(val)));
                    }
                }
                $div.append($ul);
            }
            $basicInfo.append($div);
        }
        
        function renderCrmTransDetail(records)
        {
            var $theadTR = $trans.find('thead tr'), ths = [],
                $tbody = $trans.find('tbody'), trs = [],
                transDetail = Meta.transDetail, transType = Meta.transType;
                
            for(var key in transDetail)
                ths.push($('<th>').text(transDetail[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in transDetail)
                {
                    var val = item[key];
                    if(key == 'transTime') 
                        val = formatDateStr(val, 12);
                    else if(/consumptionAmount|moneyChange|transAfterMoneyBalance/.test(key))
                        val = prettyNumeric(val);
                    else if(key == 'transType')
                        val = transType[val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function renderCrmUserEvents(records)
        {
            var $theadTR = $events.find('thead tr'), ths = [],
                $tbody = $events.find('tbody'), trs = [],
                event = Meta.event, eventWay = Meta.eventWay;
                
            for(var key in event)
                ths.push($('<th>').text(event[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in event)
                {
                    var val = item[key];
                    if(key == 'createTime') 
                        val = formatDateStr(val, 12);
                    else if(key == 'eventNews')
                        val = getEventNews(item.eventWay, item.winFlag);
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function getEventNews(way, flag)
        {
            var ret = '已兑换';
            if(way == 20) ret = flag == 1 ? '一等奖' : flag == 2 ? '二等奖' : '未知';
            else if(way == 21) ret = '已领取';
            else if(ret == 22) ret = flag == 1 ? '已入围' : '未入围';
            
            return ret;
        }
        
        function renderCrmUserGifts(records)
        {
            var $theadTR = $gifts.find('thead tr'), ths = [],
                $tbody = $gifts.find('tbody'), trs = [],
                gift = Meta.gift;
                
            for(var key in gift)
                ths.push($('<th>').text(gift[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in gift)
                {
                    var val = item[key];
                    if(/createTime|usingTime|validUntilDate/.test(key)) 
                        val = formatDateStr(val, 12);
                    else if(/getWay|giftStatus/.test(key))
                        val = Meta[key][val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function renderCrmCardLogs(records)
        {
            var $theadTR = $logs.find('thead tr'), ths = [],
                $tbody = $logs.find('tbody'), trs = [],
                cardLog = Meta.cardLog, logType = Meta.logType;
                
            for(var key in cardLog)
                ths.push($('<th>').text(cardLog[key]));
            $theadTR.append(ths);
            
            for(var i = 0, item; item = records[i++];)
            {
                var $tr = $('<tr>');
                for(var key in cardLog)
                {
                    var val = item[key];
                    if(key == 'createTime') 
                        val = formatDateStr(val, 12);
                    else if(key == 'logType')
                        val = logType[val];
                    
                    $('<td>').text(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.append(trs);
        }
        
        function getData(params, callServer, cbFn)
        {
            G[callServer](params, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                var data = callServer == 'getCrmDetail' ? rsp.data : rsp.data.records || [];
                cbFn(data);
            });
        }
    };
})(jQuery, window);