(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initSubscribe = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        if(!mpID) return;
        
        var $subscribe = $(tplLib.get('tpl_wx_subscribe')).appendTo($pageBody),
            $select = $subscribe.find('select'),
            $resWiew = $subscribe.find('.form-control-static'),
            $save = $subscribe.find('#saveBtn');
            
        var subscribe = { mpID: mpID, pushMsgType: 'event', pushEvent: 'subscribe' },
            resources = [], emotions = emotions || W.getEmotions();
        
        $select.on('change', function()
        {
            $resWiew.html(W.createResourceView(_.findWhere(resources, { itemID: this.value }), emotions));
        });
        
        G.getWeixinSubscribe({mpID: mpID, pushEvent: "('subscribe')"}, function(rsp)
        {
            $save.prop('disabled', false);
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            var records = rsp.data.records || [],
                subsc = records[0];
            subscribe = subsc || subscribe;
            W.createResourceChosen($select, resources, subscribe.resourceID)
            .done(function(res)
            {
                resources = res;
                $select.change();
            });
        });
        
        $save.on('click', function()
        {
            var resourceID = $select.val(),
                res = _.findWhere(resources, {itemID: resourceID});
            subscribe.resourceID = resourceID;
            subscribe.resourceVaule = 1;
            subscribe.replyContent = res.resTitle;
            subscribe.replyMsgType = res.resType == '2' ? 'text' : 'news';
            
            G[subscribe.itemID ? 'updateWeixinSubscribe' : 'addWeixinSubscribe'](subscribe, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '保存成功！', type: 'success'});
                if(!subscribe.itemID)
                    subscribe.itemID = rsp.data.records[0].itemID;
            });
        });
        
    }
    
    
})(jQuery, window);











