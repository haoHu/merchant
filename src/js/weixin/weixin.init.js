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
            {
                if(eTitle.indexOf(em.title) == 0) 
                    return eTitle.replace(em.title, imgTpl({url: imgHost + em.url, title: em.title}));
            }
                
            return match;
        });
    }
    
    function createResourceView(res, emotions, editing)
    {
        var resType = res.resType;
        if(resType == 2)
        {
            emotions = emotions || WX.getEmotions();
            return parseEmotions(res.resContent, emotions)
        };
        
        var itemID = res.itemID,
            resContent = $.parseJSON(res.resContent),
            $resWiew = $('<div>').attr('resid', itemID).addClass('res-view ' + (resType == 1 ? 'multi' : '')),
            resArr = resContent.resources || [],
            imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/';
        
        for(var i = 0, r; r = resArr[i]; i++)
        {
            var $resItem = $('<div>'),
                imgUrl = imgHost + r.imgPath + '?quality=70';
            if(resType == 0)
            {
                $resItem.addClass('res-single')
                .append($('<h4>').text(r.resTitle))
                .append(itemID ? $('<img>').attr('src', imgUrl) : '<div class="img">封面图片</div>')
                .append($('<p>').text(r.digest));
            }
            else if(i == 0)
            {
                $resItem.addClass('res-cover')
                .append(itemID ? $('<img>').attr('src', imgUrl) : '<div class="img">封面图片</div>')
                .append($('<h4>').text(r.resTitle));
                if(editing)
                    $resItem.addClass('active').append('<div class="res-mask"><i class="glyphicon glyphicon-pencil"></i></div>');
            }
            else
            {
                $resItem.addClass('res-sub')
                .append(itemID ? $('<img>').attr('src', imgUrl) : '<div class="img">缩略图</div>')
                .append($('<h6>').text(r.resTitle));
                if(editing)
                    $resItem.append('<div class="res-mask"><i class="glyphicon glyphicon-pencil" title="编辑"></i></div>');
            }
            $resWiew.append($resItem);
        }
        if(resType == 1 && editing)
            $resWiew.append('<div class="add-sub-res"><div><i class="glyphicon glyphicon-plus"></i></div></div>');
            
        return $resWiew;
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
                            eventName: record.eventName,
                            py: record.py
                        } : _.pick(record, keys.concat(['py']));
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
    
    function createQQEmotionPanel(emotions)
    {
        emotions = emotions || WX.getEmotions();
        var $ret = $('<ul></ul><div></div>'),
            $ul = $ret.filter('ul');
        for(var i = 0, em; em = emotions[i]; i++)
        {
            $('<li>').attr('title', em.title).data('url', em.url)
            .append($('<i>').css('background-position', -i * 24 +'px 0'))
            .appendTo($ul);
        }
        
        return $ret;
    }
    
    function createWeixinUrl(linkType, param)
    {
        var groupID = Hualala.getSessionSite().groupID,
            chref = location.href,
            env = chref.indexOf('mu.dianpu') > -1 ? 'mu.' :
                  chref.indexOf('dohko.dianpu') > -1 ? 'dohko.' : '',
            urlHost = 'http://' + env + 'm.hualala.com/',
            linkTypes = createLinkSelector.linkTypes || WX.getLinkTypes(),
            urlTpl = Handlebars.compile(linkTypes[linkType - 1].urlTpl),
            args = { arg1: param, g: groupID };
            
        if(linkType == 3 || linkType == 5) 
            args.arg2 = param == 0 ? 't=near' : 'c=' + param;
        else if(linkType == 16) 
        {
            var _args = param.split('-'),
                eventID = _args[0],
                eventWay = _args[1];
            args.arg1 = eventID;
            args.arg3 = eventWay == 20 ? '_turntable' : '';
        }
        
        var urlPart = urlTpl(args);
        
        return linkType == 22 ? urlPart : urlHost + urlPart;
    }
    
    function extendUM(emotions, dataHolder)
    {
        emotions && UM.registerUI( 'qqemotion', function(name)
        {
            var me = this;
            var $btn = $.eduibutton({ icon: 'emotion', title: '表情' });
            var edui = $.eduipopup().css('zIndex',me.options.zIndex + 1)
                .addClass('edui-popup-' + name).edui();
            var $popupBody = edui.getBodyContainer()
                    .html(createQQEmotionPanel(emotions))
                    .on('click', function(){ return false; }),
                $preview = $popupBody.find('div'),
                imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/group1/M00/00/';
            $popupBody.on('mouseenter', 'li', function()
            {
                var $li = $(this), url = $li.data('url');
                $preview.show().html($('<img>').attr('src', imgHost + url));
            })
            $popupBody.on('mouseleave', 'li', function()
            {
                $preview.hide();
            })
            .on('click', 'li', function()
            {
                var $li = $(this), url = $li.data('url'), title = $li.attr('title');
                me.execCommand( 'insertimage', { src: imgHost + url, alt: title });
                edui.hide();
            });
            
            edui.on('beforeshow',function()
            {
                var $root = this.root();
                if(!$root.parent().length)
                    me.$container.find('.edui-dialog-container').append($root);
                    
                $preview.empty();
                UM.setTopEditor(me);
            })
            .attachTo($btn, {offsetTop: -5, offsetLeft: 10, caretLeft: 11, caretTop: -8});
            
            me.addListener('selectionchange', function ()
            {
                var state = this.queryCommandState(name);
                $btn.edui().disabled(state == -1).active(state == 1);
            });
            
            return $btn;
        });
        
        dataHolder && UM.registerUI( 'wxlink', function(name)
        {
            var me = this;
                $btn = $.eduibutton({ icon: 'link', title: '链接' });
            var U = Hualala.UI,
                linkTpl = Hualala.TplLib.get('tpl_wx_txt_link');
            $btn.on('click', function()
            {
                var $link = $(linkTpl),
                    $selectWrap = $link.find('.link-select-wrap'),
                    $contentWrap = $link.find('.link-content-wrap'),
                    modal = new U.ModalDialog({title: '添加链接', html: $link}).show();
                
                createLinkSelector($selectWrap, $contentWrap, dataHolder);
                modal._.footer.find('.btn-ok').text('确定').on('click', function()
                {
                    var linkType = $selectWrap.find('select').val(),
                        linkCont = $contentWrap.find('select, input').val();
                    if(!linkType)
                    {
                        U.TopTip({msg: '请选择链接类型！', type: 'warning'});
                        return;
                    }
                    if(linkCont !== undefined && !linkCont)
                    {
                        U.TopTip({msg: '请选择或输入链接！', type: 'warning'});
                        return;
                    }
                    var url = createWeixinUrl(linkType, linkCont).replace(/^\s+|\s+$/g, '');
                    if(url) me.execCommand('link', {'href': url, '_href': url});
                    modal.hide();
                });
            });
            
            me.addListener('selectionchange', function ()
            {
                var state = this.queryCommandState(name);
                $btn.edui().disabled(state == -1).active(state == 1);
            });
            
            return $btn;
        });
        
        var toolbar = UMEDITOR_CONFIG.toolbar.slice();
        toolbar[3] = toolbar[3].replace('link', 'wxlink');
        return toolbar;
    }
    
    $.extend(WX, {
        createResourceChosen: createResourceChosen,
        parseEmotions: parseEmotions,
        createResourceView: createResourceView,
        createLinkSelector: createLinkSelector,
        extendUM: extendUM,
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
        },
        //软文管理
        contentInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $container = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $container, Hualala.TypeDef.WeixinMaterialSubNavType);
            WX.initContent($container.find('.page-body'));
        },
        //文本管理
        textInit: function()
        {
            var pageName = Hualala.PageRoute.getPageContextByPath().name;
            var $container = $('#ix_wrapper > .ix-body > .container');
            initWeixinPageLayout(pageName, $container, Hualala.TypeDef.WeixinMaterialSubNavType);
            WX.initText($container.find('.page-body'));
        }
        
    });

	

})(jQuery, window);






