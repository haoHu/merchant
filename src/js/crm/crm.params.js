(function ($, window) {
	IX.ns("Hualala.CRM");
	Hualala.CRM.initParams = function($crm)
    {
        var $form = null;
        
        Hualala.Global.getCrmParams(Hualala.getSessionData().site.groupID, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var crmParams = rsp.data.records[0];
            crmParams.serviceStartTime = formatDate(crmParams.serviceStartTime);
            crmParams.serviceEndTime = formatDate(crmParams.serviceEndTime);
            crmParams.pointClearDate = formatDate(crmParams.pointClearDate);
            crmParams.isPointCanPay = crmParams.isPointCanPay == 0 ? 'minus' : 'ok';
            
            $form = $(Handlebars.compile(Hualala.TplLib.get('tpl_crm_params'))(crmParams)).appendTo($crm);
        });
        
        
        $form.on('click', function(e)
        {
            var $target = $(e.target);
            e.preventDefault();
            if($target.is('.btn-edit'))
            {
                $form.removeClass('read-mode').addClass('edit-mode');
            }
            
            if($target.is('.btn-save'))
            {
                $form.removeClass('edit-mode').addClass('read-mode');
            }
        });
    };
    
    function formatDate(dateStr)
    {
        return dateStr.length == 8 ? dateStr.substr(0, 4) + '年' + parseInt(dateStr.substr(4, 2)) + '月' + parseInt(dateStr.substr(6)) + '日' : parseInt(dateStr.substr(0, 2)) + '月' + parseInt(dateStr.substr(2)) + '日';
    }
})(jQuery, window);












