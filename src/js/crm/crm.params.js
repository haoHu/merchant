(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        topTip = Hualala.UI.TopTip;
	Hualala.CRM.initParams = function($crm)
    {
        var $form = null, bv = null, itemID = null,
            $vipServiceTel = null, $vipServiceRemark = null,
            $p1 = null, $p2 = null;
        
        G.getCrmParams({groupID: Hualala.getSessionData().site.groupID}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var crmParams = rsp.data;
            itemID = crmParams.itemID;
            crmParams.serviceStartTime = formatDate(crmParams.serviceStartTime);
            crmParams.serviceEndTime = formatDate(crmParams.serviceEndTime);
            crmParams.pointClearDate = +crmParams.pointClearDate == 0 ? '不清零' : formatDate(crmParams.pointClearDate);
            crmParams.isPointCanPay = crmParams.isPointCanPay == 0 ? 'minus' : 'ok';
            
            $form = $(Handlebars.compile(Hualala.TplLib.get('tpl_crm_params'))(crmParams)).appendTo($crm);
            
            $vipServiceTel = $form.find('input[name=vipServiceTel]');
            $vipServiceRemark = $form.find('textarea[name=vipServiceRemark]');
            $p1 = $vipServiceTel.siblings('p');
            $p2 = $vipServiceRemark.siblings('p');
            
            $form.bootstrapValidator({
                fields: {
                    vipServiceTel: {
                        validators: {
                            notEmpty: { message: '会员服务电话不能为空' },
                            telOrMobile: { message: '' }
                        }
                    }
                }
            });
            bv = $form.data('bootstrapValidator');
        });
        
        
        $crm.on('click', function(e)
        {
            var $target = $(e.target);
            
            if($target.is('.btn-edit, .btn-save')) e.preventDefault();
            
            if($target.is('.btn-edit'))
            {
                $form.removeClass('read-mode').addClass('edit-mode');
            }
            
            if($target.is('.btn-save'))
            {
                if(!bv.validate().isValid()) return;
                
                var vipServiceTel = $vipServiceTel.val(),
                    vipServiceRemark = $vipServiceRemark.val(),
                    data = {
                        itemID: itemID,
                        vipServiceTel: vipServiceTel,
                        vipServiceRemark: vipServiceRemark
                    };
                
                G.setCrmParams(data, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    $p1.text(vipServiceTel);
                    $p2.text(vipServiceRemark);
                    $form.removeClass('edit-mode').addClass('read-mode');
                    topTip({msg: '保存成功！', type: 'success'});
                });
            }
        });
    };
    
    function formatDate(dateStr)
    {
        return dateStr.length == 8 ? dateStr.substr(0, 4) + '年' + parseInt(dateStr.substr(4, 2)) + '月' + parseInt(dateStr.substr(6)) + '日' : parseInt(dateStr.substr(0, 2)) + '月' + parseInt(dateStr.substr(2)) + '日';
    }
})(jQuery, window);












