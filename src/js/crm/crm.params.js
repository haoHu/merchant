(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        C = Hualala.Common,
        U = Hualala.UI,
        topTip = U.TopTip;
	Hualala.CRM.initParams = function($crm)
    {
        var $form = null, bv = null, itemID = '',
            $card = null, $logo = null, $labelBtn = null, $noBg = null,
            $crmAccount = null, $crmAccountName = null,
            logo = '', bgImg = '', settleID = '', accounts = [];
            
        $crm.removeClass('table-responsive');
        var dfCrmParams = C.loadData('getCrmParams', {groupID: Hualala.getSessionData().site.groupID}, null, 'data')
        .done(function(data)
        {
            var crmParams = data;
            
            itemID = crmParams.itemID;
            settleID = crmParams.onlineSaveMoneySettleUnitID;
            logo = crmParams.logoImage;
            //crmParams.cardBackgroundImage = 'group1/M00/00/B9/wKgCIVL684HYKSoEAAEaVR07W8Q443.png';
            bgImg = crmParams.cardBackgroundImage;
            crmParams.logoImage = crmParams.logoImage ? 
                C.getSourceImage(crmParams.logoImage, {width: 300, height: 188})
                : G.IMAGE_ROOT + '/vip_card.png';
            crmParams.cardForegroundColor = crmParams.cardForegroundColor || '#ffcc00';
            crmParams.cardBackgroundColor = crmParams.cardBackgroundColor || '#990000';
            crmParams.serviceStartTime = formatDate(crmParams.serviceStartTime);
            crmParams.serviceEndTime = formatDate(crmParams.serviceEndTime);
            crmParams.pointClearDate = +crmParams.pointClearDate == 0 ? '不清零' : formatDate(crmParams.pointClearDate);
            crmParams.onlineSaveMoneyRate = +crmParams.onlineSaveMoneyRate * 100 + '%';
            crmParams.isPointCanPay = crmParams.isPointCanPay == 0 ? 'minus' : 'ok';
            
            $form = $(Handlebars.compile(Hualala.TplLib.get('tpl_crm_params'))(crmParams)).appendTo($crm);
            
            $card = $form.find('.vip-card');
            $logo = $card.find('img');
            $labelBtn = $form.find('label.btn');
            $noBg = $labelBtn.filter('.btn-bg-no');
            $crmAccount = $form.find('[name=onlineSaveMoneySettleUnitID]');
            $crmAccountName = $crmAccount.siblings('p');
            
            if(bgImg) setCardBgImg();
            
            U.fileUpload($labelBtn.filter('.btn-logo'), function(rsp)
            {
                logo = rsp.url;
                $logo.attr('src', C.getSourceImage(logo, {width: 300, height: 188}));
            });
            
            U.fileUpload($labelBtn.filter('.btn-bg'), function(rsp)
            {
                bgImg = rsp.url;
                setCardBgImg();
                $noBg.removeAttr('disabled');
            });
            
            $form.find('.card-color').colorpicker()
            .on('changeColor.colorpicker', function(event)
            {
                $(this).find('input').value = event.color.toHex();
                $card.css('color', event.color.toHex());
            });
            
            $form.find('.card-bg').colorpicker()
            .on('changeColor.colorpicker', function(event)
            {
                $(this).find('input').value = event.color.toHex();
                $card.css('background-color', event.color.toHex());
            });
            
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
        
        C.loadData('queryAccount').done(function(records)
        {
            accounts = _.map(records, function(record){ return {settleUnitID: record.settleUnitID, settleUnitName: record.settleUnitName, py: record.py }; });
            
            dfCrmParams.done(function()
            {
                var currentAccount = _.findWhere(accounts, {settleUnitID: settleID}) || {};
                $crmAccountName.text(currentAccount.settleUnitName);
                U.createChosen($crmAccount, accounts, 'settleUnitID', 'settleUnitName', {width: '100%'}, false, settleID);
            });
        });
        
        $crm.on('click', function(e)
        {
            var $target = $(e.target);
            
            if($target.is('button')) e.preventDefault();
            
            if($target.is('.btn-edit'))
            {
                $form.removeClass('read-mode').addClass('edit-mode');
                $labelBtn.removeAttr('disabled');
                if(!bgImg) $noBg.attr('disabled', 'disabled');
            }
            
            if($target.is('.btn-bg-no'))
            {
                bgImg = '';
                setCardBgImg('');
                $noBg.attr('disabled', 'disabled');
            }
            
            if($target.is('.btn-save'))
            {
                if(!bv.validate().isValid()) return;
                
                var data = C.parseForm($form);
                data.itemID = itemID;
                data.logoImage = logo;
                data.cardBackgroundImage = bgImg;
                
                G.setCrmParams(data, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    $form.find('.form-control').each(function()
                    {
                        var $this = $(this),
                            text = !$this.is('select') ? this.value :
                                $this.find('option:checked').text();
                        
                        $(this).closest('.form-group').find('p').text(text);
                    });
                    
                    $form.removeClass('edit-mode').addClass('read-mode');
                    $labelBtn.attr('disabled', 'disabled');
                    topTip({msg: '保存成功！', type: 'success'});
                });
            }
        });
        
        function setCardBgImg(imgPath)
        {
            var imgUrl = imgPath === '' ? 'about:blank' : C.getSourceImage((imgPath || bgImg), {width: 300, height: 188});
            $card.css('background-image', 'url(' + imgUrl + ')');
        }
        
        function formatDate(dateStr)
        {
            return dateStr.length == 8 ? dateStr.substr(0, 4) + '年' + parseInt(dateStr.substr(4, 2)) + '月' + parseInt(dateStr.substr(6)) + '日' : parseInt(dateStr.substr(0, 2)) + '月' + parseInt(dateStr.substr(2)) + '日';
        }
    };
    
    
})(jQuery, window);












