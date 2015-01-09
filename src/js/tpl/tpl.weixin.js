(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
    
	var tpl_wx_reply_query = [
    '<div class="well well-sm query-panel clearfix">',
        '<form class="d-i">',
            '<label>',
                '关键词',
                '<input type="text" name="pushContent" class="form-control" />',
            '</label> ',
            '<label>',
                '匹配类型',
                '<select name="pushContentType" class="form-control">',
                    '<option value="0">全匹配</option>',
                    '<option value="1">包含</option>',
                '</select>',
            '</label>',
        '</form> ',
        '<button class="btn btn-warning">添加</button>',
        '<button class="btn btn-info">查询</button>',
    '</div>',
    '<table class="table table-bordered table-striped table-hover">',
        '<thead><tr><th>关键词</th><th>匹配类型</th><th>操作</th></tr></thead>',
        '<tbody></tbody>',
    '</table>'].join('');
    TplLib.register('tpl_wx_reply_query', tpl_wx_reply_query);
    
    var tpl_wx_reply_query_item = [
    '<tr>',
        '<td>{{pushContent}}</td>',
        '<td>{{pushContentTypeName}}</td>',
        '<td>',
            '<a href="javascript:;" class="update-reply" data-itemid={{itemID}}>修改</a>',
            '<a href="javascript:;" class="delete-reply" data-itemid={{itemID}}>删除</a>',
        '</td>',
    '</tr>'].join('');
    TplLib.register('tpl_wx_reply_query_item', tpl_wx_reply_query_item);
    
    var tpl_wx_reply_add_update = [
	'<form class="form-horizontal">',
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">关键词</label>',
			'<div class="col-sm-7">',
				'<input type="text" name="pushContent" class="form-control" value="{{pushContent}}" />',
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
			'<label class="col-sm-3 control-label">回复信息</label>',
			'<div class="col-sm-7">',
				'<select name="resourceID" class="form-control" />',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">内容信息</label>',
			'<div class="col-sm-7 form-control-static"></div>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_wx_reply_add_update', tpl_wx_reply_add_update);

    var tpl_wx_subscribe = [
    '<div class="well well-sm query-panel clearfix">',
        '请选择回复信息，并点击右侧“保存”按钮以添加或修改订阅消息。',
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
                '<button class="btn btn-default navbar-btn" title="从微信导入菜单数据" data-action="importMenu">导入</button>',
                '<button class="btn btn-default navbar-btn" title="保存菜单" data-action="saveMenu">保存</button>',
                '<button class="btn btn-warning navbar-btn" title="将菜单发布到微信" data-action="publishMenu">发布</button>',
            '</span>',
        '</nav>',
        '<div id="menuWrap"></div>',
    '</div>',
    '<div id="actionPanel" class="col-sm-8">',
        '<h4>动作设置</h4>',
        '<div id="menuActions">',
            '<p>请选择订阅者点击菜单后，公众号做出的相应动作</p>',
            '<div class="t-c">',
                '<span class="send-msg" data-action="toAction" data-target="sendMsg"><i></i>发送信息</span>',
                '<span class="to-page" data-action="toAction" data-target="toPage"><i></i>跳转到网页</span><br>',
                '<span class="scan-code" data-action="toAction" data-target="scanCode"><i></i>扫码</span>',
            '</div>',
        '</div>',
        '<div id="sendMsg">',
            '<div class="form form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-sm-3 col-lg-4 control-label">事件回复内容</label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5">',
                        '<select name="resourceID" class="form-control"></select>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-3 col-lg-4 control-label">内容信息</label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5 form-control-static res-preview">',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<div class="col-sm-offset-3 col-lg-offset-4 col-sm-8 col-md-7 col-lg-5 form-control-static t-c">',
                        '<button class="btn btn-warning">确定</button>',
                        '<button class="btn btn-default">取消</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '<div id="toPage">',
            '<div class="form form-horizontal link-res">',
                '<div class="form-group">',
                    '<label class="col-sm-3 col-lg-4 control-label">链接类型</label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5">',
                        '<select name="linkType" class="form-control link-type"></select>',
                    '</div>',
                '</div>',
                '<div class="form-group link-wrap hidden">',
                    '<label class="col-sm-3 col-lg-4 control-label link-name"></label>',
                    '<div class="col-sm-8 col-md-7 col-lg-5 form-control-static link-content">',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<div class="col-sm-offset-3 col-lg-offset-4 col-sm-8 col-md-7 col-lg-5 form-control-static t-c">',
                        '<button class="btn btn-warning">确定</button>',
                        '<button class="btn btn-default">取消</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '<div id="scanCode" class="t-c">',
            '当前菜单为扫码菜单，如须更改请点击“取消”按钮。<br>',
            '<button class="btn btn-warning">取消</button>',
        '</div>',
        '<div id="alert" class="alert alert-warning t-c"></div>',
    '</div>'].join('');
	TplLib.register('tpl_wx_menu', tpl_wx_menu);
    
    var tpl_wx_menu_ops = [
    '<span>',
        '<i class="glyphicon glyphicon-plus" data-action="addSubMenu"></i>',
        '<i class="glyphicon glyphicon-pencil" data-action="editMenu"></i>',
        '<i class="glyphicon glyphicon-trash" data-action="deleteMenu"></i>',
        '<i class="glyphicon glyphicon-arrow-up" data-action="moveMenuUp"></i>',
        '<i class="glyphicon glyphicon-arrow-down" data-action="moveMenuDown"></i>',
    '</span>'].join('');
	TplLib.register('tpl_wx_menu_ops', tpl_wx_menu_ops);
	
	
})(jQuery, window);











