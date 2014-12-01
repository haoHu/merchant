(function ($, window) {
	IX.ns("Hualala.CRM");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	
	var MemberSchemaController = Stapes.subclass({
		/**
		 * 构造会员概览页面控制器
		 * @param  {Object} cfg 配置参数
		 *          @param {jQuery Object} container 
		 *          @param {Object} view 概要显示层实例
		 *          @param {Object} model 概要数据层实例
		 * @return {Object}     控制器实例
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.container || !this.view || !this.model ) {
				throw("CRM Schema Controller init faild!!");
			}
			this.isReady = false;
			this.bindEvent();
			this.init();
		}
	});
	MemberSchemaController.proto({
		init : function () {
			this.model.init();
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.isReady = true;
			this.emit('load', {});
		},
		hasReady : function () { return this.isReady; },
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						self.view.emit('loaded');
					};
					self.view.emit('loading');
					self.model.load(params, cbFn);
				}
			}, this);
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				},
				loaded : function () {
					this.view.hideLoadingModal();
				},
				loading : function () {
					this.view.showLoadingModal();
				}
			}, this);
		}
	});
	Hualala.CRM.MemberSchemaController = MemberSchemaController;
})(jQuery, window);