(function ($, window) {
	IX.ns("Hualala.Shop");
	var HSP = Hualala.Shop;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	/**
	 * 整理活动配置渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventDetailData = function () {
		var self = this,
			model = self.model;
		var mapFn = HSP.mapEventDetailRenderData;
		var ret = mapFn.call(self, model);
		return ret;
	};

	var PromotionOpenStepView = Stapes.subclass({
		constructor : function (cfg) {
			var self = this;
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Event Base Info View init faild!");
			}

			this.loadTemplates();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});
	PromotionOpenStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_event_openstep')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial('evtdetail', Hualala.TplLib.get('tpl_event_detail'));
			Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_event_card'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		renderForm : function () {
			var self = this;
			var renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl(IX.inherit({customerRange: '会员等级最低要求'}, renderData));
			self.container.html(htm);
		},
		initUIComponents : function () {

		},
		bindEvent : function () {

		},
        refresh: function() {
            var self = this;
            self.renderForm()
        },
		submit : function () {
			var self = this;
			var itemID = self.model.get('itemID');
			self.model.emit('switchEvent', {
				post : {
					itemID : itemID,
					action : 1
				},
				failFn : function () {
					self.failFn.call(self);
				},
				successFn : function () {
					self.successFn.call(self);
					// self.parentView.parentView.emit('render');
					var resultController = self.parentView.parentView.$container.data('resultController');
					if (resultController) {
						resultController.emit('load');
					}
					self.parentView.modal.hide();
				}
			});
		},
		delete : function (successFn, faildFn) {
			var self = this;
			self.model.emit('deleteItem', {
				itemID : self.model.get('itemID'),
				successFn : function (res) {
					successFn(res);
				},
				faildFn : function (res) {
					faildFn(res);
				}
			});
		}
	});


	HSP.PromotionOpenStepView = PromotionOpenStepView;
	/**
	 * 创建向导中活动开启步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HSP.initPromotionOpenStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HSP.PromotionOpenStepView({
				mode : wizardMode,
				container : $cnt,
				parentView : wizardModalView,
				model : wizardModalView.model,
				successFn : function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
					self.parentView.getNextStep();
				},
				failFn : function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
				},
				mapFormElsData : mapEventDetailData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
	
})(jQuery, window);