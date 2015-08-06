(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initAccounts = function($pageBody, accounts)
    {
        var G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        
        var keys = {
            mpID: {title: '公众号ID', required: true},
            mpName: {title: '公众号名称', required: true},
            token: {title: '接口token', required: true},
            ghID: {title: '原始ID'},
            appID: {title: 'AppID'},
            appSecret: {title: 'AppSecret'},
            weixinURL: {title: '关注链接'},
            //menuJson: '菜单JSON',
            //groupID: '集团ID',
            //shopID: '店铺ID',
            oauth: {title: '认证状态', ignore: true},
            action: {title: '操作', ignore: true}
        };
        
        var vFields = {
                mpID: { validators: { notEmpty: {message: '公众号ID不能为空'} } },
                mpName: { validators: { notEmpty: {message: '公众号名称不能为空'} } },
                token: { validators: { notEmpty: {message: '接口token不能为空'} } }
            };
        
        var params = { pageNo: 1, pageSize: 15 }, 
            items = [], page = null;
        
        $pageBody.html(tplLib.get('tpl_wx_accounts'));
        var $table = $pageBody.find('table'),
            $thead = $table.find('thead'),
            $tbody = $table.find('tbody'),
            $loading = $pageBody.find('#loading'),
            $pager = $pageBody.find('#pager'),
            $noTip = $pageBody.find('#noTip');
        
        var editTpl = Handlebars.compile(tplLib.get('tpl_wx_accounts_edit'));
        var modal = null, bv = null;
        
        var $theadTr = $('<tr>');
        for(var key in keys)
        {
            $theadTr.append($('<th>').text(keys[key].title));
        }
        $thead.append($theadTr);
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getWeixinAccounts();
        });
        
        $pageBody.on('click', '.well .btn, .btn-link', function()
        {
            var $me = $(this), itemID = $me.data('itemID');
            var title = (itemID ? '修改' : '添加') + '微信公众账号';
            var fields = [];
            var item = itemID ? _.findWhere(items, {itemID: itemID}) : null;
            
            for(var key in keys)
            {
                var keyInfo = keys[key];
                if(keyInfo.ignore) continue;
                var field = {name: key, value: item ? item[key] : key == 'token' ? Math.uuid(24) : ''};
                field.title = keyInfo.required ? '* ' + keyInfo.title : keyInfo.title;
                field.disabled = key == 'token' ? 'disabled' : '';
                fields.push(field);
            }
            
            var $editTpl = $(editTpl({fields: fields}));
            $editTpl.bootstrapValidator({fields: vFields});
            item && $editTpl.find('[name=oauth]').eq(+item.oauth).prop('checked', true);
            bv = $editTpl.data('bootstrapValidator');
            modal = new U.ModalDialog({title: title, html: $editTpl}).show();
            
            modal._.footer.find('.btn-ok').on('click', function()
            {
                submitEdit($editTpl, itemID, item);
            });
            
        });
        
        function submitEdit($form, itemID, item)
        {
            if(!bv.validate().isValid()) return;
            var pdata = C.parseForm($form);
        }
        
        getWeixinAccounts();
        
        function getWeixinAccounts()
        {
            $table.hide();
            $pager.hide();
            $noTip.hide();
            $loading.show();
            C.loadData('getWeixinAccounts', params, null, 'data')
            .done(function(data)
            {
                page = data.page;
                items = data.records || [];
                renderData();
            })
            .always(function(){ $loading.hide(); });
        }
        
        function renderData()
        {
            if(!items.length)
            {
                $noTip.show();
                return;
            }
            
            $table.show();
            var trs = [];
            for(var i = 0, item; item = items[i++];)
            {
                var $tr = $('<tr>');
                for(var key in keys)
                {
                    var val = item[key] || '', cellCont = val, $cell = $('<td>');
                    if(key == 'oauth')
                    {
                        cellCont = val == 1 ? '已认证' : '未认证';
                    } 
                    else if(key == 'action')
                    {
                        cellCont = $('<span class="btn-link">修改</span>')
                        .data('itemID', item.itemID);
                    }
                    
                    $cell.html(cellCont).appendTo($tr);
                }
                trs.push($tr);
            }
            $tbody.html(trs);
            
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
        }
        
    }
    
    
})(jQuery, window);











