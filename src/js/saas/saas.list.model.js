(function(window, $) {
    IX.ns('Hualala.Saas');
    var ListModel = Stapes.subclass({
        constructor: function () {
            this.set({sessionData: Hualala.getSessionData()});
            this.set({sessionSite: Hualala.getSessionSite()});
            this.init();
        }
    });
    var G = Hualala.Global;
    ListModel.proto({
        init: function (view) {
            var self = this,
                params = {groupID: $XP(self.get('sessionSite'), 'groupID', '')};

            G.getSaasCategories(params, function (rsp) {
                if (rsp.resultcode == '000') {
                    self.set({categories: $.extend(true, {data: []}, {data: rsp.data.records}).data});
                    if(view) view.emit('renderCategories', self.get('categories'));
                }
            });

            G.querySaasGoods(params, function (rsp) {
                if (rsp.resultcode == '000') {
                    self.set({goods:  $.extend(true, {data: []}, {data: rsp.data.records}).data});
                    if(view) view.emit('renderGoods', self.get('goods'));
                }
            });

            G.getSaasDepartments($.extend(true, {departmentType: '1,3'}, params), function (rsp) {
                if (rsp.resultcode == '000') {
                    self.set({departments:  $.extend(true, {data: []}, {data: rsp.data.records}).data});
                    if(view) view.emit('renderDepartments', self.get('departments'));
                }
            });
        },
        bindEvent: function () {
        }
    });
    Hualala.Saas.ListModel = ListModel;
})(window, jQuery);