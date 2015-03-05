(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.initMenu = function($pageBody, mpID)
    {
        if(!mpID) return;
        var W = Hualala.Weixin,
            G = Hualala.Global,
            C = Hualala.Common,
            U = Hualala.UI,
            tplLib = Hualala.TplLib,
            loadData = C.loadData,
            topTip = U.TopTip;
        
        var $pageCont = $(tplLib.get('tpl_wx_menu')).appendTo($pageBody),
            $buttons = $pageBody.find('#menuPanel button')
            $menuWrap = $pageBody.find('#menuWrap'),
            dt = Handlebars.compile('<dt id="{{id}}"><i class="caret"></i><b>{{name}}</b></dt>'),
            dd = Handlebars.compile('<dd id="{{id}}"><b>{{name}}</b></dd>'),
            editMenuTpl = Handlebars.compile(tplLib.get('tpl_wx_menu_edit')),
            $menuClick = $(tplLib.get('tpl_wx_menu_ops')),
            $menuHover = $menuClick.clone(),
            $noMenuTip = $pageBody.find('#noMenuTip'),
            $actions = $pageBody.find('#actionPanel > div'),
            $showTip = $pageBody.find('#showTip'),
            
            resSelect = '<select class="link-select"></select>',
            $resWrap = $actions.find('.res-wrap'),
            $resView = $actions.find('.res-preview'),
            
            $selectWrap = $actions.find('.link-select-wrap'),
            $contentWrap = $actions.find('.link-content-wrap'),
            
            $save = $pageBody.find('#saveBtn');
            
        var menus = [], selectedMenu = null,
            resources = [], dataHolder = {};
            
        var methods = {
                addMenu: addMenu,
                importMenu: importMenu,
                saveMenu: saveMenu,
                publishMenu: publishMenu,
                toAction: toAction,
                showTip: showTip,
                chooseAction: chooseAction,
                sendMsg: sendMsg,
                saveMsg: saveMsg,
                toPage: toPage,
                saveLink: saveLink,
                scanCode: scanCode,
                addSubMenu: addSubMenu,
                editMenu: editMenu,
                deleteMenu: deleteMenu,
                moveMenuUp: moveMenuUp,
                moveMenuDown: moveMenuDown
            };
        
        //通过Hulala.Global.getWeixinAccounts这个接口来获取菜单数据
        loadData('getWeixinAccounts', {mpID: mpID}).done(getMenus);
        
        function getMenus(rsp)
        {
            var records = rsp || [],
                record = records[0] || {},
                menuJson = $.parseJSON(record.menuJson || '{}'),
                menuObj = menuJson.menu || {};
                
            menus = menuObj.button || [];
            renderMenu();
        }
        
        function renderMenu()
        {
            var dls = [];
            for(var i = 0, menu; menu = menus[i]; i++)
            {
                menu.id = '' + i;
                if(menu.url)
                {
                    menu.softType = '22';
                    menu.softWenChoose = menu.url;
                    delete menu.url;
                }
                var $dl = $('<dl>').append(dt(menu)),
                    subMenus = menu.sub_button || [];
                for(var j = 0, sm; sm = subMenus[j]; j++)
                {
                    sm.id = i + '' + j;
                    if(sm.url)
                    {
                        sm.softType = '22';
                        sm.softWenChoose = sm.url;
                        delete sm.url;
                    }
                    $dl.append(dd(sm));
                }
                
                dls.push($dl);
            }
            $menuWrap.html(dls);
            $noMenuTip.toggleClass('hidden', !!menus.length);
            
            var $menu = selectedMenu ? $menuWrap.find('#' + selectedMenu.id) : null;
            if($menu && $menu[0])
                 resovleMenuClick.call($menu, {target: $menu});
            else
                toAction(null, 'showTip', '请选择某个菜单项，然后在此选择或者设置相关动作。');
        }
        
        $menuWrap.on('mouseenter', 'dt, dd', function()
        {
            var $this = $(this);
            if(!$this.is('.selected')) $this.append($menuHover);
        })
        .on('mouseleave', 'dt, dd', function(){ $menuHover.remove(); })
        .on('click', 'dt, dd', resovleMenuClick);
        
        $pageCont.on('click', function(e)
        {
            var $target = $(e.target),
                methodName = $target.data('action');
            if(!$target.is('dt, dd, .glyphicon') 
            && methodName && methods[methodName])
                methods[methodName]($target);
        });
        
        function addMenu()
        {
            var menuCount = menus.length;
            if(menuCount >= 3){
                U.Alert({msg: '微信一级菜单最多只能创建3个！'});
                return;
            }
            
            var $form = $(editMenuTpl({menuType: '一', max: 5})),
                $input = $form.find('input'),
                modal = new U.ModalDialog({title: '添加一级菜单', html: $form}).show();
            modal._.footer.find('.btn-ok').text('确定').on('click', function()
            {
                var val = $.trim($input.val());
                if(!val) { topTip({msg: '请输入菜单名称！'}); return; }
                var menu = selectedMenu = { name: val};
                menus.push(menu);
                renderMenu();
                modal.hide();
            });
        }
        
        function importMenu($target)
        {
            $target.button('importing');
            $buttons.attr('disabled', 'disabled');
            loadData('importWinxinMenu', {mpID: mpID})
            .done(function(rsp)
            {
                selectedMenu = null, menus = [];
                topTip({msg: '导入成功！', type: 'success'});
                getMenus(rsp);
            })
            .always(function(){ resetButtons($target) });
        }
        
        function saveMenu($target)
        {
            var params = procPostMenuData();
            if(!params) return;
            if($target)
            {
                $target.button('saving');
                $buttons.attr('disabled', 'disabled');
            }
            loadData('saveWinxinMenu', params, null, false)
            .done(function()
            {
                topTip({msg: '保存成功！', type: 'success'}); 
            })
            .always(function(){ resetButtons($target) });
        }
        
        function publishMenu($target)
        {
            var params = procPostMenuData();
            if(!params) return;
            //saveMenu(null, params);
            $target.button('publishing');
            $buttons.attr('disabled', 'disabled');
            loadData('publishWinxinMenu', params, null, false)
            .done(function()
            {
                topTip({msg: '发布成功！', type: 'success'}); 
            })
            .always(function(){ resetButtons($target) });
        }
        
        function resetButtons($target)
        {
            if(!$target) return;
            setTimeout(function()
            {
                $target.button('reset');
                $buttons.removeAttr('disabled');
            }, 300)
        }
        
        function procPostMenuData()
        {
            if(!menus.length)
            {
                topTip({msg: '还没有添加菜单！'});
                return false;
            }
            var _menus = JSON.parse(JSON.stringify(menus));
            for(var i = 0, menu; menu = _menus[i]; i++)
            {
                menu.sub_button = menu.sub_button || [];
                var subMenus = menu.sub_button;
                if(!menu.type && !subMenus.length)
                {
                    topTip({msg: '一级菜单“' + menu.name + '”没有设置动作，也没有添加二级菜单！'});
                    return false;
                }
                delete menu.id;
                for(var j = 0, sm; sm = subMenus[j]; j++)
                {
                    if(!sm.type)
                    {
                        topTip({msg: '二级菜单“' + sm.name + '”没有设置动作！'});
                        return false;
                    }
                    sm.sub_button = [];
                    delete sm.id;
                }
            }
            
            return {
                mpID: mpID, 
                menuJson: JSON.stringify({menu: { button: _menus}})
            };
        }
        
        function resovleMenuClick(e)
        {
            var $this = $(this),
                id = $this.attr('id'),
                $target = $(e.target),
                menuInfo = getMenuInfo(id),
                menu = menuInfo.menu,
                methodName = $target.data('action');
            
            if($target.is('span i') && methodName && methods[methodName]) 
                methods[methodName]($this, menuInfo);
            
            if($this.is('.selected') || $target.is('span i')) return;
            
            selectedMenu = menu;
            $menuHover.remove();
            $menuWrap.find('.selected').removeClass('selected');
            $this.addClass('selected').append($menuClick);
            
            var type = menu.type, subMenus = menu.sub_button || [];
            if(!type && !subMenus.length) 
                toAction(null, 'chooseAction');
            else if(!type && subMenus.length) 
                toAction(null, 'showTip', '已有子菜单，无法设置动作！');
            else if(type == 'click')
                toAction(null, 'sendMsg');
            else if(type == 'view')
                toAction(null, 'toPage');
            else if(type == 'scancode_push')
                toAction(null, 'scanCode');
        }
        
        function getMenuInfo(id)
        {
            for(var i = 0, menu; menu = menus[i]; i++)
            {
                if(id == menu.id)
                    return {menu: menu, menus: menus, index: i};
                var subMenus = menu.sub_button || [];
                for(var j = 0, sm; sm = subMenus[j]; j++)
                    if(id == sm.id)
                        return {menu: sm, menus: subMenus, index: j};
            }
        }
        
        function toAction(from, to, msg)
        {
            var actionName = to || from.data('target'),
                method = methods[actionName];
            $actions.hide().filter('#' + actionName).fadeIn();
            if(method) method(msg);
        }
        
        function showTip(msg) { $showTip.text(msg); }
        
        function chooseAction() 
        {
            for(p in selectedMenu)
                if(!/name|id/.test(p)) delete selectedMenu[p];
        }
        
        function sendMsg()
        {
            var key = selectedMenu.key || '',
                match = key.match(/\d+/),
                resID = (match && match[0]) || '',
                $select = $resWrap.html(resSelect).find('select');
            
            W.createResourceChosen($select, $resView, resources, resID)
            .done(function(res){ resources = res; });
        }
        
        function saveMsg()
        {
            var val = $resWrap.find('select').val();
            if(!val)
            {
                topTip({msg: '未选择任何事件回复内容！'});
                return;
            }
            
            var res = _.findWhere(resources, {itemID: val}),
                pres = _.pick(res, 'resTitle');
            pres.mpID = mpID;
            pres.resourceID = val;
            pres.resType = res.resType == 2 ? 'text' : 'news';
            pres.pushEvent = '("CLICK")';
            loadData('WeixinMenuClick', pres, null, false)
            .done(function()
            {
                selectedMenu.type = 'click';
                selectedMenu.key = 'Resources:' + val;
                topTip({msg: '菜单设置成功！（保存菜单后生效）', type: 'success'});
            });
        }
        
        function toPage()
        {
            W.createLinkSelector($selectWrap, $contentWrap, dataHolder, selectedMenu.softType, selectedMenu.softWenChoose);
        }
        
        function saveLink()
        {
            var val = $selectWrap.find('select').val();
            if(!val)
            {
                topTip({msg: '未选择任何链接类型！', type: 'warning'});
                return;
            }
            var $cont = $contentWrap.find('select, input'),
                cont = $cont.val();
            if($cont[0] && !cont)
            {
                topTip({msg: '未选择或填写任何链接内容！', type: 'warning'});
                return;
            }
                
            selectedMenu.type = 'view';
            selectedMenu.softType = val;
            selectedMenu.softWenChoose = cont || '';
            topTip({msg: '菜单设置成功！（保存菜单后生效）', type: 'success'});
        }
        
        function scanCode()
        {
            selectedMenu.type = 'scancode_push';
            selectedMenu.key = 'scanMenu';
            //topTip({msg: '菜单设置成功！（保存菜单后生效）', type: 'success'});
        }
        
        function addSubMenu($menu, menuInfo)
        {
            var menu = menuInfo.menu,
                id = menu.id,
                subMenus = menu.sub_button || [],
                subMenuCount = subMenus.length;
            if(menu.type) {
                U.Alert({msg: '该菜单已有动作，要添加子菜单，请先取消此菜单的动作!'});
                return;
            }
            else if(subMenuCount >= 5){
                U.Alert({msg: '微信二级菜单最多只能创建5个！'});
                return;
            }
            
            var $form = $(editMenuTpl({menuType: '二', max: 13})),
                $input = $form.find('input'),
                modal = new U.ModalDialog({title: '添加二级菜单', html: $form}).show();
            modal._.footer.find('.btn-ok').text('确定').on('click', function()
            {
                var val = $.trim($input.val());
                if(!val) { topTip({msg: '请输入菜单名称！'}); return; }
                var subMenu = selectedMenu = { name: val };
                subMenus.push(subMenu);
                menu.sub_button = subMenus;
                renderMenu();
                modal.hide();
            });
        }
        
        function editMenu($menu, menuInfo)
        {
            var menu = menuInfo.menu,
                menuType = menu.id.length == 1 ? '一' : '二',
                max = menu.id.length == 1 ? '5' : '13',
                $form = $(editMenuTpl({name: menu.name, menuType: menuType, max: max})),
                $input = $form.find('input'),
                modal = new U.ModalDialog({title: '编辑菜单名称', html: $form}).show();
            modal._.footer.find('.btn-ok').text('确定').on('click', function()
            {
                var val = $.trim($input.val());
                if(!val) { topTip({msg: '请输入菜单名称！'}); return; }
                menu.name = val;
                $menu.find('b').text(val);
                modal.hide();
            });
        }
        
        function deleteMenu($menu, menuInfo)
        {
            U.Confirm({msg: '确定删除？', okFn: function()
            { 
                menuInfo.menus.splice(menuInfo.index, 1);
                if(selectedMenu && !getMenuInfo(selectedMenu.id)) selectedMenu = null;
                
                renderMenu();
            }});
        }
        
        function moveMenuUp($menu, menuInfo)
        {
            if(menuInfo.index == 0) return;
            var index = menuInfo.index,
                menu = menuInfo.menu,
                menus = menuInfo.menus,
                temp = menus[index - 1];
            menus[index - 1] = menu;
            menus[index] = temp;
            
            renderMenu();
        }
        
        function moveMenuDown($menu, menuInfo)
        {
            var index = menuInfo.index,
                menu = menuInfo.menu,
                menus = menuInfo.menus,
                maxIndex = menus.length - 1;
            if(index == maxIndex) return;
            var temp = menus[index + 1];
            menus[index + 1] = menu;
            menus[index] = temp;
            
            renderMenu();
        }
        
    }
    
    
})(jQuery, window);











