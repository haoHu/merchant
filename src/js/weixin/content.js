(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initContent = function($pageBody, mpID)
    {
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        
        $pageBody.html(tplLib.get('tpl_wx_content'));
        
        var resActionTpl = tplLib.get('tpl_wx_res_action'),
            resEditTpl = Handlebars.compile(tplLib.get('tpl_wx_res_edit')),
            imgHost = G.IMAGE_RESOURCE_DOMAIN + '/';
        
        var cols = {
                '1': $('<div></div>').addClass('col-xs-12'),
                '2': $('<div></div><div></div>').addClass('col-xs-6'),
                '3': $('<div></div><div></div><div></div>').addClass('col-xs-4'),
                '4': $('<div></div><div></div><div></div><div></div>').addClass('col-xs-3')
            };
            
        var $win = $(window), $cols, $fall = $pageBody.find('.fall'),
            $noCont = $pageBody.find('.no-cont'),
            $loading = $pageBody.find('.loading-tip');
        
        var params = { pageNo: 0, pageSize: 50 }, 
            allConts = [], index = 0, size = 20,
            isLoading, isLoaded, maxMutilContSize = 8;
        
        layout();
        loadConts(renderConts);
        
        $win.off('.wxCont')
        .on('resize.wxCont', _.throttle(layout, 200))
        .on('scroll.wxCont', _.throttle(scrollConts, 200));
        
        $fall.on('click', '.res-view', function(e)
        {
            var $me = $(this);
            if($me.is('.animating')) return;
            var cont = _.findWhere(allConts, {itemID: $me.attr('resid')}),
                $target = $(e.target);
            if($target.is('.del-res')) deleteCont(cont);
            else if($target.is('.edit-res')) editCont(cont);
        });
        
        $pageBody.on('click', '#addContOne', function()
        {
            var cont = { resTitle: '标题1', resType: '0' },
                resources = [{resTitle: '标题1', resTypeContent: {}}],
                resContent = { isMul: '0', resources: resources };
            
            cont.resContent = JSON.stringify(resContent);
            editCont(cont);
        });
        
        $pageBody.on('click', '#addContMulti', function()
        {
            var cont = { resTitle: '标题1', resType: '1' },
                resources = [{resTitle: '标题1', resTypeContent: {}}];
            resources.push({resTitle: '标题2', resTypeContent: {}});
            var resContent = { isMul: '1', resources: resources };
            cont.resContent = JSON.stringify(resContent);
            editCont(cont);
        });
        
        var dataHolder = {},
            resSubTpl = tplLib.get('tpl_wx_res_sub');
        function checkResItem(resItem, type, $contentWrap)
        {
            var $linkCont = $contentWrap.find('select, input'),
                noLinkCont = !$contentWrap.is('.hidden') && $linkCont[0] && !$linkCont.val();
            var ret = !resItem.resTitle 
                || !resItem.imgPath 
                || (type == 0 && !resItem.digest)
                || !resItem.resType
                || noLinkCont ? false : true;
            var msg = !resItem.resTitle ? '请输入当前图文的标题！' 
                : !resItem.imgPath ? '请上传当前图文的图片！' 
                : type == 0 && !resItem.digest ? '请输入图文摘要！'
                : !resItem.resType ? '请选择当前图文的链接类型！'
                : noLinkCont ? '请选择或输入当前图文的链接内容！' : '';
            
            if(!ret) topTip({msg: msg});
            
            return ret;
        }
        function editCont(cont)
        {
            var itemID = cont.itemID,
                resType = cont.resType,
                resArr = $.parseJSON(cont.resContent).resources,
                activeRes = resArr[0],
                $resEdit = $(resEditTpl(activeRes)),
                $resWrap = $resEdit.filter('.res-wrap'),
                $resForm = $resEdit.filter('.res-form'),
                $resTitle = $resForm.find('.res-title'),
                $resDigest = $resForm.find('.res-digest'),
                $selectWrap = $resForm.find('.link-select-wrap'),
                $contentWrap = $resForm.find('.link-content-wrap'),
                title = (itemID ? '修改' : '添加') +
                        (resType == 1 ? '多' : '单') + '图文消息',
                modal = new U.ModalDialog({title: title, html: $resEdit, sizeCls: 'modal-lg'}).show();
                
            modal._.body.addClass('clearfix');
            W.createResourceView(cont, null, true).appendTo($resWrap);
            
            var $activeRes = $resWrap.find('.res-single, .active');
            $resTitle.on('change', function()
            {
                activeRes.resTitle = this.value;
                $activeRes.find('h4, h6').text(this.value); 
            });
            $resDigest.on('change', function()
            {
                activeRes.digest = this.value;
                $activeRes.find('p').text(this.value); 
            });
            $selectWrap.on('change', 'select', function()
            {
                activeRes.resType = this.value;
                activeRes.resTypeContent.resType = this.value;
                if($contentWrap.is('.hidden')) 
                    delete activeRes.resTypeContent.urlOrCity;
            });
            $contentWrap.on('change', 'select, input', function()
            {
                activeRes.resTypeContent.urlOrCity = this.value;
            });
            
            W.createLinkSelector($selectWrap, $contentWrap, dataHolder, 
                activeRes.resType, activeRes.resTypeContent.urlOrCity);
            
            U.imgUpload($resForm.find('.btn'), function(rsp)
            {
                activeRes.imgPath = rsp.url;
                var i = $activeRes.index(),
                    hwp = parseFloat((+rsp.imgHWP).toFixed(2)),
                    replaceStr = (hwp ? '=' + (i == 0 ? Math.round(160 / hwp) + 'x' + 160 : '75x75' ) : '') + '$&',
                    imgUrl = imgHost + rsp.url.replace(/\.\w+$/, replaceStr) + '?quality=70';
                $activeRes.find('img, .img').replaceWith($('<img>').attr('src', imgUrl));
            });
            
            modal._.footer.find('.btn-ok').on('click', function()
            {
                if(!checkResItem(activeRes, resType, $contentWrap)) return;
                if(!itemID && resType == 1 && activeRes != resArr[1])
                {
                    $resWrap.find('.res-mask').eq(1).click();
                    if(!checkResItem(activeRes, resType, $contentWrap)) return;
                }
                var submitFunc = itemID ? updateCont : createCont,
                    _cont = $.extend({}, cont),
                    resContent = { isMul: cont.resType, resources: resArr };
                
                _cont.resTitle = resArr[0].resTitle;
                _cont.resContent = JSON.stringify(resContent);
                _cont = _.pick(_cont, 'itemID', 'resTitle', 'resType', 'resContent');
                submitFunc(_cont, cont, modal);
                
            });
            
            if(resType != 1) return;
            $resForm.find('.digest-wrap').hide();
            var $icoDel = $('<i class="glyphicon glyphicon-remove" title="删除"></i>');
            
            if(resArr.length > 2)
                $resWrap.find('.res-mask').last().append($icoDel);
            var $addSubRes = $resWrap.find('.add-sub-res');
            if(resArr.length >= maxMutilContSize)
                $addSubRes.addClass('disabled');
            $resWrap.on('click', '.res-mask', function(e)
            {
                var $res = $(this).parent(), i = $res.index(), $target = $(e.target);
                if($target.is('.glyphicon-remove'))
                {
                    $res.remove();
                    resArr.pop();
                    var $lastMask = $resWrap.find('.res-mask').eq(i - 1);
                    if(resArr.length > 2) $lastMask.append($icoDel);
                    if($res.is('.active'))
                    {
                        activeRes = resArr[i - 1];
                        $lastMask.click();
                    }
                    if(resArr.length < maxMutilContSize)
                        $addSubRes.removeClass('disabled');
                    return;
                }
                if($res.is('.active') || !checkResItem(activeRes, resType, $contentWrap)) return;
                activeRes = resArr[i];
                $resWrap.find('.active').removeClass('active');
                $res.addClass('active');
                $activeRes = $res;
                $resTitle.val(activeRes.resTitle);
                W.createLinkSelector($selectWrap, $contentWrap, dataHolder, 
                    activeRes.resType, activeRes.resTypeContent.urlOrCity);
                
            });
            $resWrap.on('click', '.add-sub-res', function(e)
            {
                if(!checkResItem(activeRes, resType, $contentWrap)) return;
                if($addSubRes.is('.disabled'))
                {
                    topTip({msg: '多图文最多只能添加8项！'});
                    return;
                }
                var res = { resType: 1, resTypeContent: {} };
                res.resTitle = '标题' + ($resWrap.find('.res-mask').length + 1);
                resArr.push(res);
                $res = $(resSubTpl);
                $res.find('h6').text(res.resTitle);
                
                $(this).before($res);
                var $mask = $res.find('.res-mask').click();
                if(resArr.length > 2) 
                    $mask.append($icoDel);
                if(resArr.length >= maxMutilContSize)
                    $addSubRes.addClass('disabled');
            })
        }
        
        function updateCont(_cont, cont, modal)
        {
            C.loadData('updateWeixinContent', _cont, null, false)
            .done(function()
            {
                resetConts();
                modal.hide();
                topTip({msg: '修改成功!', type: 'success'});
            });
        }
        
        function createCont(_cont, cont, modal)
        {
            C.loadData('createWeixinContent', _cont)
            .done(function(records)
            {
                topTip({msg: '添加成功!', type: 'success'});
                modal.hide();
                if(!isLoaded) return resetConts();
                
                allConts.unshift(records[0]);
                $cols.empty();
                renderConts();
                $noCont.hide();
            });
        }
        
        function deleteCont(cont, $me)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            { 
                C.loadData('deleteWeixinContent', {itemID: cont.itemID}, null, false)
                .done(function()
                {
                    topTip({msg: '删除成功!', type: 'success'});
                    if(!isLoaded) return resetConts();
                    
                    var i = C.inArray(allConts, cont, 'itemID');
                    allConts.splice(i, 1);
                    $cols.empty();
                    renderConts();
                    if(!allConts.length)
                    {
                        $loading.hide();
                        $noCont.show();
                    }
                });
            }});
        }
        
        function scrollConts()
        {
            if(!isLoaded && !isLoading && allConts.length - index < 50)
                loadConts();
            
            var limitBottom = $win.scrollTop() + $win.height(),
                fallBottom = $fall.offset().top + $fall.height(),
                isAnimated = $fall.find('.res-view:last-child').css('opacity') == 1;
        
            if(fallBottom < limitBottom && index < allConts.length && isAnimated)
            {
                renderConts(allConts.slice(index, index + size));
            }
        }
        
        function renderConts(conts)
        {
            var _conts = conts || allConts.slice(0, index);
            if(!_conts.length) return;
            
            var n = $cols.length, colArr = [];
            for(var i = 0; i < n; i++) colArr.push([]);
            
            for(var i = 0, cont; cont = _conts[i]; i++)
            {
                var $cont = W.createResourceView(cont).append(resActionTpl),
                    mod = i % n;
                if(conts) $cont.addClass('animating').css('opacity', 0);
                colArr[mod].push($cont);
            }
            for(var i = 0, col; col = colArr[i]; i++)
            {
                $cols.eq(i).append(col);
                if(conts) queueAnimation(col);
            }
            
            if(conts) index += size;
        }
        
        function queueAnimation(elems)
        {
            if(!elems.length)
            {
                $win.scroll();
                $loading.hide();
                if(index >= allConts.length && isLoaded)
                    $loading.show().text('全部加载完毕！');
                return;
            }
            $loading.show();
            elems.shift().animate({opacity: 1}, 400, 'linear' , 
            function()
            {
                $(this).removeClass('animating');
                queueAnimation(elems);
            });
        }
        
        function loadConts(callback)
        {
            isLoading = true;
            $loading.show();
            params.pageNo++;
            C.loadData('getWeixinContents', params, null, 'data')
            .done(function(data)
            {
                var records = data.records || [],
                    page = data.page || {};
                allConts.push.apply(allConts, records);
                if(page.pageNo >= page.pageCount) isLoaded = true;
                if(!records.length)
                {
                    $noCont.show();
                    return;
                }
                callback && callback(allConts.slice(index, index + size));
            })
            .always(function()
            {
                isLoading = false;
                $loading.hide();
            });
        }
        
        function layout()
        {
            var $_cols = getCols();
            if($cols == $_cols) return;
            $cols = $_cols;
            $fall.html($cols.empty());
            if(!allConts.length) return;
            renderConts();
        }
        
        function getCols()
        {
            var w = $(window).width() , n;
            if(w > 960) n = 4;
            else if(w > 720 && w <= 960) n = 3;
            else if(w > 480 && w <= 720) n = 2;
            else n = 1;
            
            return cols[n];
        }
        
        function resetConts()
        {
            params.pageNo = 0;
            allConts = [];
            index = 0;
            $cols.empty();
            loadConts(renderConts);
        }
    }
    
})(jQuery, window);











