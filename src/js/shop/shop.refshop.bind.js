(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindShopModal = Stapes.subclass({
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$queryBox = null;
			this.$resultBox = null;
			this.queryCtrl = null;
			this.set({
				shopID : $XP(cfg, 'shopID')
			});
			this.loadTemplates();
			this.initModal();
			this.render();
			this.bindEvent();
			this.initQueryBox();
			this.emit('show');
		}
		
	});
	BindShopModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_shop',
				clz : 'account-modal refPromotShop-modal',
				title : "选择所套用的店铺",
				backdrop : "static"
			});
		},
		render : function () {
			var self = this, layoutTpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl');
				btns = [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'save', label : '确定'}
				];
				htm = layoutTpl({
					clz : '',
					title : "请选择套用的店铺"
				});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : btns
			}));
			self.$queryBox = self.modal._.body.find('.query-box');
			self.$resultBox = self.modal._.body.find('.result-box');
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				}
			});
			self.modal._.dialog.find('.btn').on('click', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
				} else {
					// 设置套用店铺数据
					var items = $(':radio[name=bindShop]:checked')||[];
					var shopID = $XP(Hualala.PageRoute.getPageContextByPath(), 'params', [])[0];
					if (items.length > 0) {
						promotShopID=items.val();
						Hualala.Global.updatePromotShop({shopID: shopID,promotShopID:promotShopID}, function (rsp) {
	                       if (rsp.resultcode != '000') {
	                            toptip({msg: rsp.resultmsg, type: 'danger'});
	                            return;
	                        }
	                        else{
		                      	var cbFn = function () {
									self.parentView.emit('render');
								};
									self.parentView.emit('loading');
									self.model.load({shopID : shopID}, cbFn);
									toptip({msg : '套用成功',type : 'success'});
								} 
		           		});
		           		self.emit('hide');
					} else {
						toptip({
							msg : "请选择要套用的店铺",
							type : 'danger'
						});
					}
				}
			});
		},
		initQueryBox : function () {
			var self = this;
			self.queryCtrl = new Hualala.Shop.QueryShopController({
				container : self.$queryBox,
				resultContainer : self.$resultBox,
				shopID : self.get('shopID'),
				promotionModel :self.model
			});
		}
	});

	Hualala.Shop.BindShopModal = BindShopModal;
})(jQuery, window);