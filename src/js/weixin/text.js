(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initText = function($pageBody)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;

        $pageBody.html(tplLib.get('tpl_wx_text'));

        var $viewing = $pageBody.find('#viewing'),
            $txts = $viewing.find('#txts'),
            $loading = $viewing.find('#loading'),
            $pager = $viewing.find('.txt-pager'),
            $alert = $viewing.find('.alert-warning'),
            $editing = $pageBody.find('#editing'),
            $editNavTitle = $editing.find('.pt'),
            $txtTitle = $editing.find('#txtTitle');

        var txtsTpl = Handlebars.compile(tplLib.get('tpl_wx_txts'));
        var txts = [], params = { pageNo: 1, pageSize: 10 }, current,
            emotions = W.getEmotions(), isAllLoaded;

        var txtEditor = U.createEditor('txtEditor', ['qqemotion wxlink unlink | undo redo | selectall cleardoc']);
        txtEditor.execCommand('cleardoc');
        Hualala.UI.EditorList.push(txtEditor);
        var actions = {
                editTxt: editTxt,
                delTxt: delTxt,
                addTxt: addTxt,
                saveTxt: saveTxt,
                concelEdit: concelEdit
            }
        
        getTxts();
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getTxts();
        });
        
        $pageBody.on('click', '.btn, #txts > li', function(e)
        {
            var $me = $(this), $tar = $(e.target),
                actionName = $me.data('action') || $tar.data('action'),
                action = actions[actionName];
            if(actionName && action) action($me);
        })
        
        function getTxts()
        {
            $loading.show();
            $txts.empty();
            txts = [];
            C.loadData('getWeixinTexts', params, null, 'data')
            .done(function(data)
            {
                var page = data.page;
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
                isAllLoaded = page.pageNo >= page.pageCount;
                txts = data.records || [];
                $alert.toggleClass('dn', !!txts.length);
                if(!txts.length) return;
                _.each(txts, function(txt){ txt.txtCont = W.parseEmotions(txt.resContent, emotions); });
                $txts.html(txtsTpl(txts));
            })
            .always(function(){ $loading.hide(); });
        }
        
        function editTxt($txt)
        {
            var itemID = $txt ? $txt.attr('itemid') : '',
                txt = $txt ? _.findWhere(txts, {itemID: itemID}) : { resType: '2' };
            current = { txt: txt, $txt: $txt };
            $txtTitle.val(txt.resTitle);
            txtEditor.setContent(txt.txtCont || '');
            $editNavTitle.text(($txt ? '修改' : '添加') + '文本消息');
            $viewing.hide();
            $editing.show();
        }
        
        function delTxt($txt)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            {
                var itemID = $txt.attr('itemid');
                C.loadData('deleteWeixinText', {itemID: itemID}, null, false)
                .done(function()
                {
                    topTip({msg: '删除成功!', type: 'success'});
                    var txt = _.findWhere(txts, {itemID: itemID});
                    var i = C.inArray(txts, txt, 'itemID');
                    
                    txts.splice(i, 1);
                    if(!txts.length && !isAllLoaded)
                    {
                        params.pageNo = 1;
                        getTxts();
                        return;
                    }
                    $txt.remove();
                    $alert.toggleClass('dn', !!txts.length);
                });
            }});
        }
        
        function addTxt()
        {
            editTxt();
        }
        
        function saveTxt($btn)
        {
            if(!current) return;
            var resTitle = $.trim($txtTitle.val()),
                resContent = $.trim(filterTxt(txtEditor.getContent())),
                msg = !resTitle ? '请输入标题' :
                      !resContent ? '请输入内容！' : '';
            if(/<br\/>$/.test(resContent)) resContent = resContent.substr(0, resContent.lastIndexOf('<br/>'));
            if(msg)
            {
                topTip({msg: msg, type: 'warning'});
                return;
            }
            $btn.attr('disabled', 'disabled').button('saving');
            var txt = current.txt, $txt = current.$txt,
                _txt = $.extend({}, txt, { resTitle: resTitle, resContent: resContent }),
                submitFunc = $txt ? updateTxt : createTxt;
            submitFunc(_.pick(_txt, 'itemID', 'resTitle', 'resType', 'resContent'), $btn, txt, $txt);
        }
        
        function updateTxt(_txt, $btn, txt, $txt)
        {
            C.loadData('updateWeixinContent', _txt, null, false)
            .done(function()
            {
                /*txt.resTitle = _txt.resTitle;
                txt.resContent = _txt.resContent;
                txt.txtCont = W.parseEmotions(txt.resContent, emotions);
                $txt.find('.t-txt').text(txt.resTitle);
                $txt.find('.txt-cont').html(txt.txtCont);*/
                params.pageNo = 1;
                getTxts();
                setTimeout(function()
                {
                    topTip({msg: '修改成功!', type: 'success'});
                    concelEdit();
                }, 1000);
            })
            .always(function(){ resetBtn($btn); });
        }
        
        function createTxt(_txt, $btn)
        {
            C.loadData('createWeixinContent', _txt)
            .done(function(records)
            {
                var txt = records[0];
                txt.txtCont = W.parseEmotions(txt.resContent, emotions);
                txts.unshift(txt);
                $alert.hide();
                $(txtsTpl([txt])).prependTo($txts);
                setTimeout(function()
                {
                    topTip({msg: '修改成功!', type: 'success'});
                    concelEdit();
                }, 1000);
            })
            .always(function(){ resetBtn($btn); });
        }
        
        function concelEdit()
        {
            current = null;
            $viewing.show();
            $editing.hide();
        }
        
        function filterTxt(txt)
        {
            var conts = $('<div>').html(txt).contents(),
                ret = '';
            for(var i = 0, cont; cont = conts[i++];)
            {
                if(cont.nodeType == 3)
                    ret += cont.nodeValue;
                else if(cont.nodeName.toLowerCase() == 'img')
                    ret += '/' + cont.alt;
                else if(cont.nodeName.toLowerCase() == 'a')
                    ret += '<a href="' + cont.href + '">' + filterTxt(cont.innerHTML) + '</a>';
                else if(cont.nodeName.toLowerCase() == 'p')
                    ret += filterTxt(cont.innerHTML) + '<br/>';
                else if(cont.nodeName.toLowerCase() == 'br')
                    ret += '<br/>';
                else
                    ret += filterTxt(cont.innerHTML);
            }
            return ret;
        }
        
        function resetBtn($btn)
        {
            setTimeout(function()
            {
                $btn.button('reset').removeAttr('disabled');
            }, 1000);
        }
    }
    
    
})(jQuery, window);











