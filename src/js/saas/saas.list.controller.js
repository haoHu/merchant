(function(window, $) {
    IX.ns('Hualala.Saas');

    var SaasListController = Stapes.subclass({
            constructor: function (cfg) {
                this.container = $XP(cfg, 'container', null);
                this.model = new Hualala.Saas.ListModel();
                this.view = new Hualala.Saas.ListView({container: this.container});
                if (!this.view || !this.model || !this.container) {
                    throw("init query failed!");
                }
                this.init();
            }
        });
    SaasListController.proto({
        init: function() {
            var self = this;
            self.model.init(self.view);
            self.bindEvent();
        },
        bindEvent: function () {
        }
    });
    Hualala.Saas.ListController = SaasListController;
})(window, jQuery);