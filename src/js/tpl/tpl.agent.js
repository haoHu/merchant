(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
    
    var tpl_agent = [
        '<div class="well well-sm query-panel clearfix">',
            '<form class="d-i">',
                //'<span>城市 <select name="cityID" class="form-control"></select></span>',
                '<span>店铺 <select name="shopID" class="form-control"></select></span>',
            '</form> ',
            '<a href="{{agentPath}}" class="fr m-r mt-8 foreward">下载代理程序</a>',
        '</div>',
        '<div class="table-responsive">',
            '<table class="table table-bordered table-striped table-hover crm-report-table dn">',
                '<thead></thead><tbody></tbody>',
            '</table>',
        '</div>',
        '<div id="pager" class="t-r"></div>',
        '<div id="loading" class="alert t-c">加载中 . . .</div>',
        '<div id="noTip" class="alert alert-warning t-c m-t dn">没有查询到相关结果！~</div>',
    ].join('');
    TplLib.register('tpl_agent', tpl_agent);
    
})(jQuery, window);











