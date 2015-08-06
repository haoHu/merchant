(function ($, window) {
	IX.ns("Hualala.Weixin");

    Hualala.Weixin.initAdvertorial = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;

        var $pageCont = $(tplLib.get('tpl_wx_advertorial')).appendTo($pageBody),
            $ul = $pageBody.find('#adList ul'),
            $loading = $pageBody.find('.ad-loading'),
            $pager = $pageBody.find('.ad-pager'),
            $alert = $pageBody.find('#adList .alert'),
            $adCont = $pageBody.find('#adCont'),
            $headBtn = $adCont.find('.panel-head .btn'),
            $article = $adCont.find('article'),
            $adTitle = $adCont.find('.ad-title'),
            $input = $adCont.find('.ad-title-input'),
            $adSubTitle = $adCont.find('.ad-sub-title'),
            $adPreview = $adCont.find('.ad-preview');

        var adEditor = U.createEditor('adEditor');
        Hualala.UI.EditorList.push(adEditor);

        var adTpl = Handlebars.compile([
        '{{#each records}}',
        '<li data-id="{{itemID}}">',
            '<h3>{{title}}</h3>',
            '<h6>{{time}}  {{groupName}}</h6>',
        '</li>',
        '{{/each}}'].join(''));
        
        var params = { pageNo: 1, pageSize: 10 }, 
            ads = [], ad, sGroupName = Hualala.getSessionSite().groupName;
        
        var methods = {
                addAd: addAd,
                editAd: editAd,
                delAd: delAd,
                saveAd: saveAd,
                concelEdit: concelEdit
            };
        
        $ul.on('click', 'li', function()
        {
            if($adCont.is('.editing'))
            {
                topTip({msg: '请先保存或者取消当前正在编辑的软文！', type: 'warning'});
                return;
            }
            var $this = $(this);
            $ul.find('li').removeClass('current');
            $this.addClass('current');
            ad = _.findWhere(ads, {itemID: $this.data('id')+''});
            $adTitle.text(ad.title);
            $input.val(ad.title);
            $adSubTitle.text(ad.time + '  ' + ad.groupName);
            $adPreview.html(ad.body);
            adEditor.setContent(ad.body);
            $article.removeClass('dn');
            $headBtn.removeClass('dn');
            $(window).scrollTop(0);
        });
        
        $pageCont.on('click', '.btn', function()
        {
            var $this = $(this),
                methodName = $this.data('action');
            if(methodName && methods[methodName])
                methods[methodName]($this);
        });
        
        $pager.on('page', function(e, pageNo)
        {
            params.pageNo = pageNo;
            getAds();
        });
        
        getAds();
        function getAds()
        {
            ads = [];
            $ul.hide();
            $headBtn.addClass('dn');
            $article.addClass('dn');
            $loading.show();
            C.loadData('getAdvertorials', params, null, 'data')
            .done(function(data)
            {
                data.records = data.records || [];
                _.each(data.records, function(record){ record.time = C.formatDateStr(record.actionTime, 8); });
                ads = data.records;
                renderAds(data);
            })
            .always(function(){ $loading.hide(); });
        }
        
        function renderAds(data)
        {
            $ul.show().html(adTpl(data));
            var page = data.page;
            $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            $headBtn.toggleClass('dn', !ads.length);
            $article.toggleClass('dn', !ads.length);
            $alert.toggleClass('dn', !!ads.length);
            if(ads.length) $ul.find('li').eq(0).click();
            
        }
        
        function addAd()
        {
            if($adCont.is('.editing'))
            {
                topTip({msg: '请先保存当前正在编辑的软文！', type: 'warning'});
                return;
            }
            $ul.find('.current').removeClass('current');
            ad = null;
            $input.val('');
            $adSubTitle.text(sGroupName);
            adEditor.setContent('');
            $adCont.addClass('editing');
            $article.removeClass('dn');
            $headBtn.addClass('dn');
        }
        
        function editAd()
        {
            $adCont.addClass('editing');
            $headBtn.attr('disabled', 'disabled');
        }
        
        function delAd($btn)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            { 
                disBtn($btn, 'deleting');
                C.loadData('deleteAdvertorial', {itemID: ad.itemID}, null, false)
                .done(function()
                {
                    var i = C.inArray(ads, ad, 'itemID');
                    $ul.find('[data-id='+ ad.itemID + ']').remove();
                    ads.splice(i, 1);
                    ad = null;
                    $ul.find('li').eq(0).click();
                    if(!ads.length)
                    {
                        params.pageNo = 1;
                        getAds();
                    }
                    topTip({msg: '删除成功!', type: 'success'});
                })
                .always(function(){ resetBtn($btn) });
            }});
        }
        
        function saveAd($btn)
        {
            var title = $.trim($input.val());
            if(!title)
            {
                topTip({msg: '请输入软文标题！', type: 'warning'});
                $input.focus();
                return;
            }
            disBtn($btn, 'saving');
            var body = adEditor.getContent(),
                groupName = ad ? ad.groupName : groupName,
                saveAction = ad ? updateAd : createAd;
            saveAction($btn, {title: title, body: body, groupName: sGroupName});
        }

        function updateAd($btn, _ad)
        {
            _ad.itemID = ad.itemID;
            C.loadData('updateAdvertorial', _ad, null, false)
            .done(function()
            {
                /*ad.title = _ad.title;
                ad.body = _ad.body;
                $(window).scrollTop(0);
                $ul.find('.current h3').text(ad.title);
                $adTitle.text(ad.title);
                $adPreview.html(ad.body);*/
                params.pageNo = 1;
                getAds();
                $adCont.removeClass('editing');
                $headBtn.removeAttr('disabled', 'disabled');
                topTip({msg: '保存成功!', type: 'success'});
            })
            .always(function(){ resetBtn($btn) });
        }
        
        function createAd($btn, _ad)
        {
            C.loadData('createAdvertorial', _ad)
            .done(function(records)
            {
                ad = records[0];
                ad.time = C.formatDateStr(ad.actionTime, 8);
                ads.unshift(ad);
                $adCont.removeClass('editing');
                $alert.addClass('dn');
                $(adTpl({records: records})).prependTo($ul.show()).click();
                topTip({msg: '保存成功!', type: 'success'});
            })
            .always(function(){ resetBtn($btn) });
        }
        
        function concelEdit()
        {
            $adCont.removeClass('editing');
            if(!ads.length)
            {
                $headBtn.addClass('dn');
                $article.addClass('dn');
                $alert.removeClass('dn');
                return;
            }
            if(!ad)
            {
                $ul.find('li').eq(0).click();
                return;
            }
            $headBtn.removeAttr('disabled');
            $input.val(ad.title);
            adEditor.setContent(ad.body);
            $(window).scrollTop(0);
        }
        
        function disBtn($btn, state)
        {
            if(!$btn) return;
            $btn.button(state);
            $btn.attr('disabled', 'disabled');
        }
        
        function resetBtn($btn)
        {
            if(!$btn) return;
            setTimeout(function()
            {
                $btn.button('reset').removeAttr('disabled');
            }, 300)
        }
        
    }
    
})(jQuery, window);











