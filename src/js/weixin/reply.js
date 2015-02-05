(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initReply = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            parseForm = C.parseForm,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        if(!mpID) return;
        
        var $queryReply = $(tplLib.get('tpl_wx_reply_query')).appendTo($pageBody),
            $queryForm = $queryReply.find('form'),
            $tbody = $queryReply.find('tbody'),
            $pager = $('<div>').addClass('pull-right').appendTo($pageBody),
            emptyAlert = U.EmptyPlaceholder({msg: '无相关结果!', container: $pageBody}),
            tplTr = Handlebars.compile(tplLib.get('tpl_wx_reply_query_item')),
            tplReplyForm = Handlebars.compile(tplLib.get('tpl_wx_reply_add_update'));
            
        var queryParams = { mpID: mpID, pageNo: 1, pageSize: 15 },
            replies, resources = [];
        
        getReplies();
        
        $queryReply.on('click', '.btn-warning', function()
        {
            $.extend(queryParams, parseForm($queryForm));
            queryParams.pageNo = 1;
            getReplies();
        });
        
        $pager.on('page', function(e, pageNo)
        {
            queryParams.pageNo = pageNo;
            getReplies();
        });
        
        $tbody.on('click', '.delete-reply', function()
        {
            var itemID = $(this).data('itemid');
            U.Confirm({msg: '确定删除？', okFn: function(){ deleteReply(itemID) }});
        });
        
        function deleteReply(itemID)
        {
            G.deleteWeixinAutoReplyRole({itemID: itemID}, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '删除成功！', type: 'success'});
                replies.splice(findReply(itemID, true), 1);
                if(replies.length) renderReplies();
                else getReplies();
                
            });
        }
        
        $queryReply.on('click', '.update-reply, .btn-success', function()
        {
            var itemID = $(this).data('itemid'),
                reply = itemID ? findReply(itemID) : {},
                $replyForm = $(tplReplyForm(reply)),
                $select = $replyForm.find('select'),
                $resView = $replyForm.find('.form-control-static');
                
            $replyForm.find('[name=pushContentType]').eq(reply.pushContentType || 0).prop('checked', true);
            
            W.createResourceChosen($select, $resView, resources, reply.resourceID || '')
            .done(function(res)
            {
                resources = res;
                var modal = new U.ModalDialog({
                        title: (itemID ? '修改' : '添加') + '微信自动回复规则', 
                        html: $replyForm
                    }).show();
                
                modal._.footer.find('.btn-ok').on('click', function()
                {
                    submitReply(itemID, reply, $replyForm, $select, modal);
                });
            });
        });
        
        function submitReply(itemID, reply, $replyForm, $select, modal)
        {
            var resourceID = $select.val(),
                res = _.findWhere(resources, {itemID: resourceID});
            $.extend(reply, parseForm($replyForm));
            reply.replyContent = res.resTitle;
            reply.mpID = mpID;
            reply.itemID = reply.itemID || '';
            reply.pushMsgType = 'text';
            reply.replyMsgType = res.resType == '2' ? 'text' : 'news';
            reply.resourceVaule = 1;
            
            var pReply = _.pick(reply, 'itemID', 'mpID', 'pushContentType', 'replyContent', 'resourceID', 'resourceVaule', 'replyMsgType', 'pushMsgType', 'pushContent');
            
            G[itemID ? 'updateWeixinAutoReplyRole' : 'addWeixinAutoReplyRole'](pReply, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                /*reply.pushMsg = reply.pushContentType == 0 ?
                '消息为“<b>' + reply.pushContent + '</b>”' :
                '消息中含“<b>' + reply.pushContent + '</b>”';*/
                topTip({msg: (itemID ? '修改' : '添加') + '成功！', type: 'success'});
                queryParams = { mpID: mpID, pageNo: 1, pageSize: 15 };
                getReplies();
                modal.hide();
            });
        }
        
        function getReplies()
        {
            G.getWeixinAutoReplyList(queryParams, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                var records = rsp.data.records || [],
                    page = rsp.data.page;
                replies = records;
                _.each(replies, function(reply)
                {
                    reply.pushMsg = reply.pushContentType == 0 ?
                    '消息为“<b>' + reply.pushContent + '</b>”' :
                    '消息中含“<b>' + reply.pushContent + '</b>”';
                });
                renderReplies();
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            });
        }
        
        function renderReplies()
        {
            emptyAlert[replies.length ? 'hide' : 'show']();
            var trs = [];
            for(var i = 0, reply; reply = replies[i++];)
                trs.push(tplTr(reply));
            
            $tbody.html(trs.join(''));
        }
        
        function findReply(itemID, flag)
        {
            for(var i = 0, reply; reply = replies[i++];)
                if(reply.itemID == itemID) return flag ? i - 1 : reply;
                
            return flag ? -1 : null;
        }
        
    }
    
    
})(jQuery, window);











