(function ($, window) {
	IX.ns("Hualala.Weixin");
    var WX = Hualala.Weixin;
    
	/*微信管理模块子页面整体页面布局*/
	function initWeixinPageLayout (pageName, $body, subNavCfg) {
		var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
		Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
		$body.empty();
		$body.html('<div class="page-subnav clearfix" /><div class="page-body clearfix"></div>');
		var mapNavRenderData = function () {
			var navs = _.map(subNavCfg, function (v) {
				var params = _.map($XP(v, 'pkeys', []), function (v) {
					return '';
				});
				return {
					active : pageName == v.name ? 'active' : '',
					disabled : '',
					path : Hualala.PageRoute.createPath(v.name, params) || '#',
					name : v.name || '',
					label : v.label || ''
				};
			});
			return {
				toggle : {
					target : '#order_navbar'
				},
				items : navs
			};
		};
		var $navbar = $body.find('.page-subnav');
		$navbar.html(navTpl(mapNavRenderData()));
	}
    
    var groupID, mpID, accounts;
    function renderWxAcountInfo($container, callback)
    {
        var sessionGroupID = Hualala.getSessionSite().groupID,
            U = Hualala.UI,
            $pageBody = $container.find('.page-body');
        if(groupID == sessionGroupID)
        {
            renderData(); return;
        }

        Hualala.Global.getWeixinAccounts({}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && U.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            
            accounts = _.map(rsp.data.records || [], function(record) {
                return { mpID: record.mpID, mpName: record.mpName };
            });
            groupID = sessionGroupID;
            if(accounts.length) mpID = accounts[0].mpID;
            
            renderData();
        });
        
        function renderData()
        {
            var $select = $('<div class="bs-callout weixin-brand"><select class="form-control" />微信公共账号</div>').insertAfter('.page-subnav').find('select');
            U.fillSelect($select, accounts, 'mpID', 'mpName', false).val(mpID).on('change', function()
            { 
                mpID = $(this).val();
                mpID && callback && callback($pageBody.empty(), mpID);
            });
            
            mpID && callback && callback($pageBody.empty(), mpID);
        }
    }
    
    function createResourceChosen($select, $resView, resources, cv, width)
    {
        var U = Hualala.UI, R = Hualala.PageRoute, 
            emotions = WX.getEmotions(),
            cfg = {width: '100%'}, df = $.Deferred();
        
        function fn()
        {
            U.createChosen($select, resources, 'itemID', 'resName', cfg, false, cv || '')
            .on('change', function()
            {
                $resView.html(WX.createResourceView(_.findWhere(resources, { itemID: this.value }), emotions));
            }).change();
            df.resolve(resources);
        }
        
        if(width) cfg.width = width;
        if(resources && resources.length) fn();
        else Hualala.Global.getWeixinResources({isActive: 1, resType: '(0,1,2)'}, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && U.TopTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            resources = rsp.data.records || [];
            _.each(resources, function(item){ item.resName = (item.resType == '2' ? '(文本)' : '(图文)') + item.resTitle });
            if(!resources.length)
            {
                var $msg = $('<div>尚无可用素材资源，无法进行此操作！您可以先在<a href="" data-page="wxContent" />或者<a href="" data-page="wxText" />下添加一些素材资源。</div>');
                    $a = $msg.find('a').each(function()
                    {
                        var $this = $(this),
                            path = R.createPath($this.data('page')),
                            label = R.getPageContextByPath(path).label;
                        $this.attr('href', path).text(label);
                    }),
                    modal = U.Alert({msg: $msg});
                $a.on('click', function(){ modal.hide() });
                return;
            }
            fn();
        });
        return df.promise();
    }
    
    function parseEmotions(text, emotions)
    {
        var emotions = emotions || WX.getEmotions(),
            imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/group1/M00/00/',
            imgTpl = Handlebars.compile('<img src="{{url}}" alt="{{title}}" />');
        
        return text.replace(/\/[\u4E00-\u9FA5]+/g, function(match)
        {
            var eTitle = match.slice(1);
            for(var i = 0, em; em = emotions[i++];)
                if(eTitle = em.title) return imgTpl({url: imgHost + em.url, title: em.title});
                
            return match;
        });
    }
    
    function createResourceView(res, emotions)
    {
        var emotions = emotions || WX.getEmotions(),
            resType = res.resType;
        if(resType == 2)  return parseEmotions(res.resContent, emotions);
        
        var resContent = $.parseJSON(res.resContent),
            $resWiew = $('<div>').data('resid', res.itemID).addClass('res-view ' + (resType == 1 ? 'multi' : '')),
            retView = resContent,
            resArr = resContent.resources || [],
            imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/',
            singleView = Handlebars.compile('<h4>{{resTitle}}</h4><img src="{{imgUrl}}"><p>{{digest}}</p>'),
            cover = Handlebars.compile('<div class="res-cover"><img src="{{imgUrl}}"><h4>{{resTitle}}</h4></div>'),
            subView = Handlebars.compile('<div class="res-sub"><img src="{{imgUrl}}"><h6>{{resTitle}}</h6></div>');
        
        for(var i = 0, r; r = resArr[i]; i++)
        {
            r.imgUrl = imgHost + r.imgPath + '?quality=70';
            if(resType == 0) retView = singleView(r);
            else if(resType == 1) retView = i == 0 ? cover(r) : retView + subView(r);
        }
        
        return $resWiew.html(retView);

    }
    
    function createLinkSelector($selectWrap, $contentWrap, dataHolder, linkID, linkCont)
    {
        var that = createLinkSelector,
            linkTypes = that.linkTypes || WX.getLinkTypes();
            
        dataHolder = dataHolder || {};
        that.linkTypes = linkTypes;
        linkID = linkID || 1;
        linkCont = linkCont || '';
        
        that.renderLinkContent = that.renderLinkContent ||
        function(linkInfo, $contentWrap, dataHolder, linkCont)
        {
            var U = Hualala.UI,
                $linkName = $contentWrap.find('.link-name'),
                $linkContent = $contentWrap.find('.link-content'),
                subTitle = linkInfo.subTitle,
                type = linkInfo.type;
                
            $contentWrap.toggleClass('hidden', !type);
            $linkName.text('链接' + subTitle);
            $linkContent.html(type ? type == 'select' ? 
            '<select class="form-control">' 
            : '<input class="form-control" placeholder="完整URL，如：http://m.hualala.com">'
            : '');
            
            if(type == 'input') $linkContent.find('input').val(linkCont);
            if(type != 'select') return;
            
            var api = linkInfo.api, data = dataHolder[api]
                keys = linkInfo.keys;
            Hualala.Common.loadData(api, linkInfo.params, data)
            .done(function(records)
            {
                records = records || [];
                if(!records.length)
                {
                    U.TopTip({msg: '获取' + subTitle + '信息为空！', type: 'warning'});
                    return;
                }
                if(!dataHolder[api])
                {
                    dataHolder[api] = _.map(records, function(record)
                    {
                        return api == 'getCrmEvents' ? {
                            eventIdWay: record.eventID + '-' + record.eventWay,
                            eventName: record.eventName
                        } : _.pick(record, keys);
                    });
                }
                
                var firstItem = linkInfo.firstItem || false;
                U.createChosen($linkContent.find('select'), 
                dataHolder[api], keys[0], keys[1], { width: '100%' }, firstItem, linkCont);
                
            });
        }
        
        Hualala.UI.fillSelect($selectWrap.html('<select class="form-control"></select>').find('select'), 
        linkTypes, 'value', 'title', false).val(linkID)
        .on('change', function()
        {
            that.renderLinkContent(linkTypes[this.value - 1], $contentWrap, dataHolder, linkCont);
            linkCont = '';
        }).change();
    }
    
    $.extend(WX, {
        createResourceChosen: createResourceChosen,
        parseEmotions: parseEmotions,
        createResourceView: createResourceView,
        createLinkSelector: createLinkSelector,
        //微信首页
        homeInit: function() { location.href = Hualala.PageRoute.createPath('wxReply')},
        //自动回复页面
        replyInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $body = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $body, Hualala.TypeDef.WeixinAdminSubNavType);
            renderWxAcountInfo($body, WX.initReply);
        },
        //订阅消息页面
        subscribeInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $body = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $body, Hualala.TypeDef.WeixinAdminSubNavType);
            renderWxAcountInfo($body, WX.initSubscribe);
        },
        //自定义微信菜单页面
        menuInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $body = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $body, Hualala.TypeDef.WeixinAdminSubNavType);
            renderWxAcountInfo($body, WX.initMenu);
        },
        //软文管理
        advertorialInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $container = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $container, Hualala.TypeDef.WeixinMaterialSubNavType);
            WX.initAdvertorial($container.find('.page-body'));
        }
        
    });

	

})(jQuery, window);






