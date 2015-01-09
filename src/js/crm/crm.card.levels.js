(function ($, window) {
	IX.ns("Hualala.CRM");
    
	Hualala.CRM.initVipLevels = function($crm)
    {
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
                isVipPrice: { '0': '不享受', '1': '享受' },
                discountRange: { '0': '部分打折', '1': '全部打折' },
                isActive: { '0': '未启用', '1': '已启用' },
                icos: {
                    '0': '<i class="glyphicon glyphicon-minus no"></i>',
                    '1': '<i class="glyphicon glyphicon-ok ok"></i>'
                }
            };
        var Funcs = {
                date: function(v){ return formatDateStr(v.replace(/-/g, ''), 12); },
                number: function(v, key, $td){ $td.addClass('t-r'); return prettyNumeric(v); },
                ico: function(v, key){ return $(Meta.icos[v]).attr('title', Meta[key][v]) },
                discountRate: function(v){ return v == 1 ? '不打折' : (v * 10).toFixed(1) + '折' }
            };
        var keys = {
                cardLevelName: { title: '会员等级名' },
                description: { title: '等级说明' },
                isVipPrice: { title: '是否享受会员价', type: 'ico' },
                discountRate: { title: '折扣率', type: 'discountRate' },
                discountRange: { title: '折扣范围' },
                discountDescription: { title: '折扣描述' },
                pointRate: { title: '积分系数', type: 'number' },
                switchLevelUpPoint: { title: '等级所需累计消费金额', type: 'number' },
                isActive: { title: '是否启用', type: 'ico' },
                actionTime: { title: '最后修改时间', type: 'date' }
            }
            
        var $table = $('<table>').addClass('table table-bordered table-striped table-hover'),
            $headTR = $('<thead><tr></tr></thead>').appendTo($table).find('tr'),
            ths = [];
        for(var key in keys)
            ths.push($('<th>').addClass('t-c').text(keys[key].title));
        $headTR.append(ths);
        $crm.append($table);
        
        function renderTbody(items, keys)
        {
            var trs = [];
            for(var i = 0, item; item = items[i++];)
            {
                var $tr = $('<tr>');
                for(var key in keys)
                {
                    var val = item[key], keyInfo = keys[key], meta = Meta[key],
                        type = keyInfo.type, $cell = $('<td>').addClass('t-c');
                    if(meta && !type) val = meta[val];
                    if(type) val = Funcs[type](val, key, $cell);
                    $cell.html(val).appendTo($tr);
                }
                trs.push($tr);
            }
            $('<tbody>').html(trs).appendTo($table);
        }
        
        G.getVipLevels({isActive: 1}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            renderTbody(rsp.data.records || [], keys);
        });
        
        
    };
})(jQuery, window);