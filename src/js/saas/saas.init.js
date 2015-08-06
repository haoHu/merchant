(function ($, window) {
    IX.ns("Hualala.Saas");
    /*收银软件模块子页面布局*/
    var initSaasPageLayout = function () {
        var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        $body.empty();
        var mapNavRenderData = function () {
            var navs = _.map(Hualala.TypeDef.SaasSubNavType, function (v, i, list) {
                var params = _.map($XP(v, 'pkeys', []), function (v) {
                    return '';
                });

                return {
                    active : $XP(ctx, 'name') == v.name ? 'active' : '',
                    disabled : '',
                    path : Hualala.PageRoute.createPath(v.name, params) || '#',
                    name : v.name,
                    label : v.label
                };
            });
            return {
                toggle : {
                    target : '#order_navbar'
                },
                items : navs
            };
        };
        var navTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_subnav'));
        Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
        $body.html('<div class="page-subnav clearfix" /><div class="page-body clearfix"></div>');
        var $navbar = $body.find('.page-subnav');
        $navbar.html(navTpl(mapNavRenderData()));
    };


    //收款项目
    var initSubjectPage =function(){
        // var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        initSaasPageLayout();
        var $pageBody = $body.find('.page-body');
        Hualala.Saas.Subject.initSubject($pageBody);
      document.location.href = Hualala.PageRoute.createPath('saasReceivables');

    };
    //部门
    var initQueryDepartmentPage =function(){
        //var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        initSaasPageLayout();
        var $pageBody = $body.find('.page-body');
        Hualala.Saas.department.initDepartment($pageBody);
      document.location.href = Hualala.PageRoute.createPath('saasDepartment');
    };
    //备注
    var initQueryRemarksPage =function(){
        //var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        initSaasPageLayout();
        var $pageBody = $body.find('.page-body');
        Hualala.Saas.remarks.initRemark($pageBody);
        document.location.href = Hualala.PageRoute.createPath('saasRemarks');
    };
    //商品分类
    var initQueryCategoriesPage =function(){
        //var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        initSaasPageLayout();
        var $pageBody = $body.find('.page-body');
        Hualala.Saas.Category.initCategory($pageBody);
        document.location.href = Hualala.PageRoute.createPath('saasCategories');
    };
    //商品
    var initQueryGoodsPage = function(){
        var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        initSaasPageLayout();
        var $container = $body.find('.page-body');
        var queryGoods = new Hualala.Saas.ListController({
            container: $container
        });
        document.location.href = Hualala.PageRoute.createPath('saasCommodity');
    };
    //渠道
    var initQuerychannelPage =function(){
        //var ctx = Hualala.PageRoute.getPageContextByPath();
        var $body = $('#ix_wrapper > .ix-body > .container');
        initSaasPageLayout();
        var $pageBody = $body.find('.page-body');
         Hualala.Saas.channel.initChannel($pageBody);

      document.location.href = Hualala.PageRoute.createPath('saasChannel');
    };


    Hualala.Saas.SaasPageLayoutInit = initSaasPageLayout;
    Hualala.Saas.SaasInit = initSubjectPage;
    Hualala.Saas.receivableInit = initSubjectPage;
    Hualala.Saas.departmentInit = initQueryDepartmentPage;
    Hualala.Saas.remarksInit = initQueryRemarksPage;
    Hualala.Saas.categoriesInit = initQueryCategoriesPage;
    Hualala.Saas.GoodsInit = initQueryGoodsPage;
    Hualala.Saas.channelInit = initQuerychannelPage;

})(jQuery, window);