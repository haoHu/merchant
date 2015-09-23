(function ($, window) {
	IX.ns("Hualala.Weixin");

    Hualala.Weixin.initAdvertorial = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            C = Hualala.Common,
            G = Hualala.Global,
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
            $adPreview = $adCont.find('.ad-preview'),
            $subTitleinput = $adCont.find('.ad-secondTitle-input'),
            $adsecondTitle = $adCont.find('.ad-secondTitle-title'),
            $adtitleImg = $adCont.find('.ad-titleImg'),
            $pretitleImg = $adCont.find('.pre-titleImg'),
            $adimgoperate = $adCont.find('.adimg-operate');

        var adEditor = U.createEditor('adEditor');
            U.EditorList.push(adEditor);

        var adTpl = Handlebars.compile([
        '{{#each records}}',
        '<li data-id="{{itemID}}">',
            '<h3>{{title}}</h3>',
            '<p class="list-img clearfix"><img width="40" heigth="40" src="{{imgSrc}}"/><span>{{subTitle}}</span></p>',
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
            //副标题和图片
            $adsecondTitle.text(ad.subTitle);
            $subTitleinput.val(ad.subTitle);
            var ImgUrl = ad.titleImg ?G.IMAGE_RESOURCE_DOMAIN + '/' + ad.titleImg : "";
            $adtitleImg.attr('src', ImgUrl);
            $adtitleImg.attr('orignsrc',ad.titleImg);
            ad.titleImg.length==0?$adtitleImg.addClass("hidden"):$adtitleImg.removeClass("hidden");
            var $pretitleImg = $adCont.find('.pre-titleImg');
            if(ad.titleImg.length==0){
                var imgSrc = G.IMAGE_ROOT + '/' + 'wechat.png';
                $pretitleImg.attr('src', imgSrc);
                $pretitleImg.attr('orignsrc',ad.titleImg);    
            }else{
                $pretitleImg.attr('src', ImgUrl);
                $pretitleImg.attr('orignsrc',ad.titleImg);  
            }

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
            bindFileUpload();
        });
        //上传图片
        function bindFileUpload(){
            $adCont.on('click', '.btn-link',function(){
                var $titleImg = $adCont.find('.second-title'),
                    $ImgDiv = $titleImg.find('adimg-operate'),
                    $uploadLabel = $titleImg.find('.btn-link'),
                    $pretitleImg = $titleImg.find('.pre-titleImg'),
                    $img = $adCont.find('.ad-titleImg'),
                    preImgSrc = $pretitleImg.attr('src'),
                    imgSrc = $img.attr('src');
                U.fileUpload($uploadLabel, function(rsp) {
                    var path = rsp.url;
                        logoImgUrl = G.IMAGE_RESOURCE_DOMAIN + '/' + path;
                        $img.attr('src', logoImgUrl);
                        $img.attr('orignsrc',path);
                        $pretitleImg.attr('src',logoImgUrl);
                        $pretitleImg.attr('orignsrc',path);
                    },
                    {
                        onBefore: function ($elem, $file) {
                            imgSrc = $img.attr('src');
                            $ImgDiv.addClass('loading');
                             if(window.FileReader) previewImg($file[0], $img);
                        },
                        onFail: function () {
                            if (window.FileReader) $img.attr('src', imgSrc);
                        },
                        onAlways: function () {
                            $ImgDiv.removeClass('loading');
                        },
                        accept: 'image/png,image/jpeg,image/jpg'
                    }
                );            
            });
        }
        function previewImg(fileInput, $img) {
            if (fileInput.files && fileInput.files[0])
            {
                var reader = new FileReader();
                reader.onload = function(e){
                    $img.attr('src', e.target.result);
                }
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
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
            _.map(data.records,function (record){
                if(record.titleImg.length==0){
                    var imgSrc = G.IMAGE_ROOT + '/' + 'wechat.png';
                    record.imgSrc =  imgSrc;
                }else{
                    var ImgUrl = G.IMAGE_RESOURCE_DOMAIN + '/' + record.titleImg;
                    record.imgSrc =  ImgUrl;
                }

            });
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
            $subTitleinput.val('');
            $adtitleImg.attr("src","");
            $adtitleImg.attr("orignsrc","");
            $pretitleImg.attr("src","");
            $pretitleImg.attr("orignsrc","");
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
            var title = $.trim($input.val()),
                subTitle = $.trim($subTitleinput.val());
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
                titleImg = $adtitleImg.attr('orignsrc');
            saveAction($btn, {title: title,subTitle: subTitle,titleImg:titleImg,body: body, groupName: sGroupName});

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
                if(ad.titleImg.length==0){
                    var imgSrc = G.IMAGE_ROOT + '/' + 'wechat.png',
                        $addimg = $($pageCont.find('.list-img img')[0]);
                        $addimg.attr('src',imgSrc);
                        
                }else{
                    var ImgUrl = G.IMAGE_RESOURCE_DOMAIN + '/' + ad.titleImg,
                        $addimg = $pageCont.find('.list-img img')[0];
                        $addimg.attr('src',ImgUrl);
                }
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
            $subTitleinput.val(ad.subTitle);
            ad.titleImg.length==0?$adtitleImg.addClass("hidden"):$adtitleImg.removeClass("hidden");
            var ImgUrl = ad.titleImg ?G.IMAGE_RESOURCE_DOMAIN + '/' + ad.titleImg : "";
            $adtitleImg.attr('src', ImgUrl);
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