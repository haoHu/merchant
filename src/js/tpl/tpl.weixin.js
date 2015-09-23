(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
    
    var tpl_wx_accounts = [
        '<div class="well well-sm clearfix">',
            '<button class="btn btn-warning fr">添加微信公众账号</button>',
        '</div>',
        '<div class="table-responsive">',
            '<table class="table table-bordered table-striped table-hover crm-report-table dn wx_accounts">',
                '<thead></thead><tbody></tbody>',
            '</table>',
        '</div>',
        '<div id="pager" class="t-r"></div>',
        '<div id="loading" class="alert t-c">加载中 . . .</div>',
        '<div id="noTip" class="alert alert-warning t-c m-t dn">没有查询到相关结果！~</div>',
    ].join('');
    TplLib.register('tpl_wx_accounts', tpl_wx_accounts);
    
    var tpl_wx_accounts_edit = [
	'<form class="form-horizontal form-feedback-out">',
        '{{#each fields}}',
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">{{title}}</label>',
			'<div class="col-sm-7">',
				'<input type="text" name="{{name}}" class="form-control" {{disabled}} value="{{value}}" />',
			'</div>',
		'</div>',
        '{{/each}}',
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">认证状态</label>',
			'<div class="col-sm-7">',
				'<label class="radio-inline">',
                    '<input type="radio" name="oauth" value="0" checked /> 未认证',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="oauth" value="1" /> 已认证',
                '</label>',
			'</div>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_wx_accounts_edit', tpl_wx_accounts_edit);
    
	var tpl_wx_reply_query = [
    '<div class="well well-sm query-panel clearfix">',
        '<form class="d-i">',
            '<span>',
                '关键词',
                '<input type="text" name="pushContent" class="form-control" />',
            '</span> ',
            /*'<span>',
                '匹配类型',
                '<select name="pushContentType" class="form-control">',
                    '<option value="0">全匹配</option>',
                    '<option value="1">包含</option>',
                '</select>',
            '</span>',*/
        '</form> ',
        '<button class="btn btn-success">添加</button>',
        '<button class="btn btn-warning">查询</button>',
    '</div>',
    '<table class="table table-bordered table-striped table-hover">',
        '<thead><tr><th>用户发送消息</th><th>回复内容</th><th>操作</th></tr></thead>',
        '<tbody></tbody>',
    '</table>'].join('');
    TplLib.register('tpl_wx_reply_query', tpl_wx_reply_query);
    
    var tpl_wx_reply_query_item = [
    '<tr>',
        '<td>{{{pushMsg}}}</td>',
        '<td>{{replyContent}}</td>',
        '<td>',
            '<a href="javascript:;" class="update-reply" data-itemid={{itemID}}>修改</a>',
            '<a href="javascript:;" class="delete-reply" data-itemid={{itemID}}>删除</a>',
        '</td>',
    '</tr>'].join('');
    TplLib.register('tpl_wx_reply_query_item', tpl_wx_reply_query_item);
    
    var tpl_wx_reply_add_update = [
	'<form class="form-horizontal">',
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">用户发送消息</label>',
			'<div class="col-sm-7">',
				'<input type="text" name="pushContent" class="form-control" value="{{pushContent}}" maxlength="64" title="长度须在64个字以内" />',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">关键词类型</label>',
			'<div class="col-sm-7">',
				'<label class="radio-inline">',
                    '<input type="radio" name="pushContentType" value="0" checked /> 完全匹配',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="pushContentType" value="1" /> 包含匹配',
                '</label>',
			'</div>',
		'</div>',
        
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">回复内容标题</label>',
			'<div class="col-sm-7">',
				'<select name="resourceID" class="form-control" />',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">回复内容</label>',
			'<div class="col-sm-7 form-control-static"></div>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_wx_reply_add_update', tpl_wx_reply_add_update);

    var tpl_wx_subscribe = [
    '<div class="well well-sm query-panel clearfix">',
        //'请选择回复信息，并点击右侧“保存”按钮以添加或修改订阅消息。',
        '<button id="saveBtn" disabled class="btn btn-warning">保存</button>',
    '</div>',
    '<form class="form-horizontal">',
        '<div class="form-group">',
            '<label class="col-sm-4 control-label">回复信息</label>',
            '<div class="col-sm-4">',
                '<select name="resourceID" class="form-control" />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-4 control-label">内容信息</label>',
            '<div class="col-sm-4 form-control-static"></div>',
        '</div>',
    '</form>'].join('');
	TplLib.register('tpl_wx_subscribe', tpl_wx_subscribe);
    
    var tpl_wx_menu = [
    '<div id="menuPanel" class="col-sm-4">',
        '<nav class="navbar navbar-default">',
            '<span class="navbar-brand">管理菜单</span>',
            '<span class="navbar-right">',
                '<button class="btn btn-default navbar-btn" title="添加一级菜单" data-action="addMenu">添加</button>',
                '<button class="btn btn-default navbar-btn" title="从微信导入菜单数据" data-action="importMenu" data-importing-text="导入中...">导入</button>',
                '<button class="btn btn-default navbar-btn" title="保存菜单" data-action="saveMenu" data-saving-text="保存中...">保存</button>',
                '<button class="btn btn-warning navbar-btn" title="将菜单发布到微信" data-action="publishMenu" data-publishing-text="发布中...">发布</button>',
            '</span>',
        '</nav>',
        '<div id="menuWrap"></div>',
        '<div id="noMenuTip" class="alert alert-info t-c hidden">还没有菜单，点击“添加”按钮添加一级菜单。</div>',
    '</div>',
    '<div id="actionPanel" class="col-sm-8">',
        '<h4 class="action-panel-title">动作设置</h4>',
        '<div id="chooseAction">',
            '<p>请选择订阅者点击菜单后，公众号做出的相应动作</p>',
            '<div class="t-c">',
                '<span class="send-msg"><i data-action="toAction" data-target="sendMsg"></i>发送信息</span>',
                '<span class="to-page"><i data-action="toAction" data-target="toPage"></i>跳转到网页</span><br>',
                '<span class="scan-code"><i data-action="toAction" data-target="scanCode"></i>扫码</span>',
            '</div>',
        '</div>',
        '<div id="sendMsg">',
            '<div class="form form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-sm-3 col-lg-4 control-label">事件回复内容</label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5 res-wrap"></div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-3 col-lg-4 control-label">内容信息</label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5 form-control-static res-preview"></div>',
                '</div>',
                '<div class="form-group">',
                    '<div class="col-sm-offset-3 col-lg-offset-4 col-sm-8 col-md-7 col-lg-5 form-control-static t-c">',
                        '<button class="btn btn-warning" data-action="saveMsg">确定</button>',
                        '<button class="btn btn-default" data-action="toAction" data-target="chooseAction">取消</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '<div id="toPage">',
            '<div class="form form-horizontal link-res">',
                '<div class="form-group">',
                    '<label class="col-sm-3 col-lg-4 control-label">链接类型</label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5 link-select-wrap"></div>',
                '</div>',
                '<div class="form-group link-content-wrap">',
                    '<label class="col-sm-3 col-lg-4 control-label link-name"></label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5 link-content"></div>',
                '</div>',
                '<div class="form-group">',
                    '<div class="col-sm-offset-3 col-lg-offset-4 col-sm-8 col-md-7 col-lg-5 form-control-static t-c">',
                        '<button class="btn btn-warning" data-action="saveLink">确定</button>',
                        '<button class="btn btn-default" data-action="toAction" data-target="chooseAction">取消</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '<div id="scanCode" class="t-c">',
            '当前菜单已设置为扫码菜单，如须更改请点击“取消”按钮。<br>',
            '<button class="btn btn-warning" data-action="toAction" data-target="chooseAction">取消</button>',
        '</div>',
        '<div id="showTip" class="alert alert-warning t-c">请选择某个菜单项，然后在此选择或者设置相关动作。</div>',
    '</div>'].join('');
	TplLib.register('tpl_wx_menu', tpl_wx_menu);
    
    var tpl_wx_menu_ops = [
    '<span>',
        '<i class="glyphicon glyphicon-plus" data-action="addSubMenu" title="添加二级菜单"></i>',
        '<i class="glyphicon glyphicon-pencil" data-action="editMenu" title="编辑"></i>',
        '<i class="glyphicon glyphicon-trash" data-action="deleteMenu" title="删除"></i>',
        '<i class="glyphicon glyphicon-arrow-up" data-action="moveMenuUp" title="上移"></i>',
        '<i class="glyphicon glyphicon-arrow-down" data-action="moveMenuDown" title="下移"></i>',
    '</span>'].join('');
	TplLib.register('tpl_wx_menu_ops', tpl_wx_menu_ops);
    
    var tpl_wx_menu_edit = [
    '<form class="form-horizontal menu-edit">',
        '<div class="form-group">',
            '<label class="control-label col-sm-3">菜单名称</label>',
            '<div class="col-sm-6">',
                '<input type="text" name="weixinMenu" maxlength="{{max}}" required class="form-control" value="{{name}}" />',
                '<p>注：{{menuType}}级菜单名称不可超过{{max}}个字符。</p>',
            '</div>',
        '</div>',
    '</form>'].join('');
	TplLib.register('tpl_wx_menu_edit', tpl_wx_menu_edit);
    
    var tpl_wx_advertorial = [
    '<aside id="adList" class="col-sm-4">',
        '<h4 class="panel-head clearfix">',
            '<span class="p-title">软文列表</span>',
            '<button class="btn btn-warning pull-right" title="添加软文" data-action="addAd">',
                '<span class="glyphicon glyphicon-plus"></span>',
            '</button>',
        '</h4>',
        '<ul class="ad-ul"></ul>',
        '<div class="ad-loading t-c dn">加载中 . . .</div>',
        '<div class="ad-pager t-r"></div>',
        '<div class="alert alert-warning dn">',
            '还没有软文，点击“+”按钮可添加软文。',
        '</div>',
    '</aside>',
    '<div id="adCont" class="col-sm-8">',
        '<h4 class="panel-head clearfix">',
            '<span class="p-title">软文预览与操作</span>',
            '<button class="btn btn-warning btn-edit pull-right" data-action="editAd">编辑</button>',
            '<button class="btn btn-default btn-del pull-right" data-action="delAd" data-deleting-text="删除中...">删除</button>',
        '</h4>',
        '<article class="dn">',
            '<h3 class="ad-title"></h3>',
            '<input type="text" class="form-control ad-title-input" placeholder="请输入软文标题" maxlength="64" title="软文标题，64个字以内" />',
            '<div class="second-title clearfix">',
                '<div class="adimg-operate ">',
                    '<img  class="pre-titleImg" src="" alt="软文标题图片" width="50px" height="50px" />',
                    //'<i class="glyphicon glyphicon-plus"></i>',
                    '<label class="btn-link" title="编辑标题图片" for="myFile">标题图片</label>',
                    '<p>上传中……</p>',
                    '<label title="图片建议尺寸：300*300像素"class="text-warning">300*300像素</label>',
                '</div>',
                
                '<input type="text" class="form-control ad-secondTitle-input" placeholder="请输入摘要" maxlength="64" title="摘要，64个字以内" />',
            '</div>',
            '<div class="second-title-preview clearfix">',
                '<img  class="ad-titleImg" src="" alt="软文标题图片" width="50px" height="50px"/>',
                '<h5 class="ad-secondTitle-title"></h5>',
            '</div>',
            '<h6 class="ad-sub-title"></h6>',
            '<div class="ad-preview"></div>',
            '<script type="text/plain" id="adEditor"></script>',
            '<div class="btn-wrap">',
                '<button class="btn btn-warning btn-save" data-action="saveAd" data-saving-text="保存中...">保存</button>',
                '<button class="btn btn-default btn-concel" data-action="concelEdit">取消</button>',
            '</div>',
        '</article>',
    '</div>'].join('');
	TplLib.register('tpl_wx_advertorial', tpl_wx_advertorial);
    
    var tpl_wx_content = [
    '<div class="ph has-btn clearfix">',
        '<h4 class="pt">图文列表</h4>',
        '<span class="fr">',
            '<button id="addContOne" class="btn btn-warning">添加单图文</button>',
            '<button id="addContMulti" class="btn btn-warning">添加多图文</button>',
        '</span>',
    '</div>',
    '<div class="fall clearfix"></div>',
    '<div class="alert alert-warning t-c no-cont dn">还没有添加任何图文哦！~</div>',
    '<div class="loading-tip dn">加载中 . . .</div>'].join('');
	TplLib.register('tpl_wx_content', tpl_wx_content);
    
    var tpl_wx_res_action = [
    '<div class="res-action clearfix">',
        '<div class="col-xs-6">',
            '<i class="glyphicon glyphicon-pencil edit-res" title="编辑"></i>',
        '</div>',
        '<div class="col-xs-6">',
            '<i class="glyphicon glyphicon-trash del-res" title="删除"></i>',
        '</div>',
    '</div>'].join('');
	TplLib.register('tpl_wx_res_action', tpl_wx_res_action);
    
    var tpl_wx_res_edit = [
    '<div class="col-sm-5 res-wrap"></div>',
    '<div class="form-horizontal col-sm-7 res-form">',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">标题</label>',
            '<div class="col-sm-9">',
                '<input type="text" maxlength="64" class="form-control res-title" value="{{resTitle}}" />',
            '</div>',
        '</div>',
        '<div class="form-group digest-wrap">',
            '<label class="col-sm-3 control-label">摘要</label>',
            '<div class="col-sm-9">',
                '<textarea class="form-control res-digest">{{digest}}</textarea>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">链接类型</label>',
            '<div class="col-sm-9 link-select-wrap"></div>',
        '</div>',
        '<div class="form-group link-content-wrap">',
            '<label class="col-sm-3 control-label link-name"></label>',
            '<div class="col-sm-9 link-content"></div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">图片</label>',
            '<div class="col-sm-9">',
                '<label class="btn btn-default">上传图片</label>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label"></label>',
                '<div class="col-sm-9">',
                    '<span class="text-warning">',
                        '{{#if isSingle}}',
                        '封面图片建议尺寸：400像素*222像素',
                        '{{else}}',
                        '封面图片建议尺寸：360像素*240像素<br/>小图片建议尺寸：200像素 * 200像素',
                        '{{/if}}',
                    '</span>',
                '</div>',
        '</div>',
    '</div>'].join('');
	TplLib.register('tpl_wx_res_edit', tpl_wx_res_edit);
    
    var tpl_wx_res_sub = [
    '<div class="res-sub">',
        '<div class="img">缩略图</div>',
        '<h6></h6>',
        '<div class="res-mask">',
            '<i class="glyphicon glyphicon-pencil" title="编辑"></i>',
        '</div>',
    '</div>'].join('');
	TplLib.register('tpl_wx_res_sub', tpl_wx_res_sub);
    
	var tpl_wx_text = [
    '<div id="viewing">',
        '<div class="ph has-btn clearfix">',
            '<h4 class="pt">文本列表</h4>',
            '<button class="btn btn-warning fr" title="添加文本消息" data-action="addTxt">',
                '<i class="glyphicon glyphicon-plus"></i>',
            '</button>',
        '</div>',
        '<ul id="txts"></ul>',
        '<div id="loading" class="alert t-c dn">加载中 . . .</div>',
        '<div class="txt-pager t-r"></div>',
        '<div class="alert alert-warning t-c m-t dn">还没有文本消息哦！~</div>',
    '</div>',
    '<div id="editing" class="dn">',
        '<div class="ph has-btn m-b clearfix">',
            '<h4 class="pt">编辑文本消息</h4>',
            '<span class="fr">',
                '<button class="btn btn-default" data-action="concelEdit">取消</button>',
                '<button class="btn btn-warning" data-action="saveTxt" data-saving-text="保存中...">保存</button>',
            '</span>',
        '</div>',
        '<div class="form-horizontal">',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label">标题</label>',
                '<div class="col-sm-7">',
                    '<input id="txtTitle" type="text" maxlength="64" title="标题长度须在64个字以内" class="form-control" />',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label">内容</label>',
                '<div class="col-sm-7">',
                    '<script type="text/plain" id="txtEditor" style="height: 300px"></script>',
                '</div>',
            '</div>',
        '</div>',
    '</div>'
    ].join('');
	TplLib.register('tpl_wx_text', tpl_wx_text);
    
    var tpl_wx_txts = [
    '{{#each this}}',
    '<li itemid={{itemID}}>',
        '<h4 class="txt-title">',
            '<span class="t-icos">',
                '<i data-action="editTxt" class="glyphicon glyphicon-pencil" title="修改"></i>',
                '<i data-action="delTxt" class="glyphicon glyphicon-trash" title="删除"></i>',
            '</span>',
            '<span class="t-txt">{{resTitle}}</span>',
        '</h4>',
        '<p class="txt-cont">{{{txtCont}}}</p>',
    '</li>',
    '{{/each}}'].join('');
    TplLib.register('tpl_wx_txts', tpl_wx_txts);
    
    var tpl_wx_txt_link = [
    '<div class="form-horizontal">',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">链接类型</label>',
            '<div class="col-sm-7 link-select-wrap"></div>',
        '</div>',
        '<div class="form-group link-content-wrap">',
            '<label class="col-sm-3 control-label link-name"></label>',
            '<div class="col-sm-7 link-content"></div>',
        '</div>',
    '</div>',
    ].join('');
    TplLib.register('tpl_wx_txt_link', tpl_wx_txt_link);
    
})(jQuery, window);











