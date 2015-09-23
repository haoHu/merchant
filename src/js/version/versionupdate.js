(function ($, window) {
	IX.ns("Hualala.Version");
        var G = Hualala.Global,
            C = Hualala.Common,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
        var listTpl,itemTpl,versions = null,params;
    Hualala.Version.versionInfoInit = function(){
        var $container = $('#ix_wrapper > .ix-body > .container');
        var groupID =$XP(Hualala.getSessionSite(),'groupID','');
        params ={clientType:410};
	    initTemplate($container);
	    renderTable($container,params);
    }
    function initTemplate($container){
    	listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_version_list'));
    	itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_version_card'));
        Handlebars.registerPartial("versionCard", Hualala.TplLib.get('tpl_version_card'));
    }
    function renderTable($container,params){
    	G.getVersionUpdate(params, function(rsp) {
            if (rsp.resultcode == '000') {
                versions = rsp.data.records;
                renderRecords(versions,$container); 
            }else{
                topTip({type: 'danger', msg: rsp.resultmsg});
                return;
            }
        });
    }
   //数据渲染
    function renderRecords(records,$container) {
        $container.empty();
        if (records == undefined) {
            emptyBar = new Hualala.UI.EmptyPlaceholder({
                container : $container
            });
            emptyBar.show();
        } else {
           $container.html($(listTpl(mapRenderData(records))));
        } 
    }
    //时间的处理
    function mapTimeData(s) {
		var r = {value : '', text : '', clz : 'date'};
		var s1 = '';
		if (IX.isString(s) && s.length > 0) {
			s1 = s.replace(/([\d]{4})([\d]{2})([\d]{2})/g, '$1/$2/$3');
			s1 = IX.Date.getDateByFormat(s1, 'yyyy-MM-dd ');
			r = IX.inherit({value : s, text : s1});
		}
		return r;
    }
    //组装表格
    function mapRenderData(records) {
        var ret = _.map(records, function (record, i, l) {
            var releaseDateVal = $XP(record,'releaseDate');
                releaseDateVal = mapTimeData(releaseDateVal);
            return {
                clz : 'feedbackCard',
                itemID : $XP(record,'itemID'),
                updateRemark : Hualala.Common.encodeTextEnter($XP(record, 'updateRemark', '')),
                versionNo : $XP(record, 'versionNo', ''),
                releaseDate :releaseDateVal
            };
        });
        return {
            versionCard : {
                list : ret
            }
        };
    }
})(jQuery, window);