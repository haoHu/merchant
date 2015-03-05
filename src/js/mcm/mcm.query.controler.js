(function ($, window) {
	IX.ns("Hualala.MCM");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var QueryController = Hualala.Shop.QueryController.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.resultController = $XP(cfg, 'resultController', null);
			this.model = $XP(cfg, 'model', null);
			this.view = $XP(cfg, 'view', null);
			if (!this.container || !this.model || !this.view || !this.resultController) {
				throw("QueryController init faild!");
			}
			this.container.data({
				queryController : this,
				resultController : this.resultController
			});
			this.init();
		}
	});

	QueryController.proto({
		
	});

	Hualala.MCM.QueryController = QueryController;

})(jQuery, window);