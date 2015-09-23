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

    var tpl_version_list = [
        '<div class="versionList">',
            '{{#with versionCard}}',
                '{{#each list}}',
                    '{{> versionCard}}',
                '{{/each}}',
            '{{/with}}',
        '</div>'
    ].join('');
    TplLib.register('tpl_version_list', tpl_version_list);


    var tpl_version_card =[
        '<div class="panel panel-default ix-card shop-card version_card {{clz}}" >',
            '<div class="panel-heading ix-card-header">',
                '<ul class="clearfix">',
                    '<li class="versionNo">版本号：{{versionNo}}&nbsp;&nbsp;[{{releaseDate.text}}]</li>',
                '</ul>',
            '</div>',
            '<div class="panel-body ix-card-body">',
                '<div class="media">',
                    '<div class="media-body">',
                        '<div class="updateRemark">{{{updateRemark}}}</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');
    TplLib.register('tpl_version_card', tpl_version_card);

    
})(jQuery, window);











