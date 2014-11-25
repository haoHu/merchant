(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        topTip = Hualala.UI.TopTip;
        
	Hualala.CRM.initRecharge = function($crm)
    {
        var $alert = $('<div class="alert alert-warning t-c">暂无任何会员充值套餐。</div>'),
            $table = null, $sets = null;
        G.getCrmRechargeSets({}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var sets = rsp.data.records || [],
                crmRechargeSetsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_sets'));
            
            preProcessSets(sets);
            $(crmRechargeSetsTpl({sets: sets})).appendTo($crm);
            $table = $crm.find('table');
            $sets = $table.find('tbody');
            if(!sets.length)
            {
                $table.addClass('hidden');
                $crm.append($alert);
                return;
            }
            createSwitch($crm.find('table input'));
        });
    };
    
    function preProcessSets(sets)
    {
        for(var i = sets.length - 1, set; set = sets[i--];)
            set.checked = +set.isActive ? 'checked' : '';
    }
    
    function createSwitch($checkbox)
    {
        $checkbox.bootstrapSwitch({
            onColor : 'success',
            onText : '已开启',
            offText : '已禁用'
        }).on('switchChange.bootstrapSwitch', function (e, state)
        {
            var $this = $(this), setID = $this.data('setid');
            G.switchCrmRechargeSetState({saveMoneySetID: setID, isActive: +state}, function (rs)
            {
                if(rs.resultcode != '000')
                {
                    $this.bootstrapSwitch('toggleState', true);
                    rs.resultmsg && topTip({msg: rs.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '切换成功！', type: 'success'})
            });
        });
    }
    
})(jQuery, window);












