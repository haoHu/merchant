(function ($, window) {
	IX.ns("Hualala.Shop");
	var HSP = Hualala.Shop;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	/**
	 * 整理活动配置渲染数据
	 * @return {[type]} [description]
	 */
	var mapPromotionDetailData = function () {
		var self = this,
			model = self.model;
		var keys = 'startDate,endDate,supportOrderType,holidayFlag,timeID,promotionDesc'.split(','),
			ret = {};
		_.each(keys, function (k) {
			var v = model.get(k);
			switch (k) {
				case 'startDate':
				case 'endDate':
					ret[k] =IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy-MM-dd')
					break;
				case "timeID" :
					var timeIDs = Hualala.TypeDef.ShopPromotionDataSet.timeIDTypes,
						timeIDFlag = _.find(timeIDs, function (el) {return $XP(el, 'value') == v;});
						ret[k] = $XP(timeIDFlag, 'label', '');
					break;
				case "holidayFlag":
					var holidayFlags = Hualala.TypeDef.MCMDataSet.GiftIsHolidayUsing,
						holidayFlag = _.find(holidayFlags, function (el) {return $XP(el, 'value') == v;});
						ret[k] = $XP(holidayFlag, 'label', '');
					break;
				case "supportOrderType":
					var supportOrderTypes = Hualala.TypeDef.ShopPromotionDataSet.supportOrderTypes,
						supportOrderType = _.find(supportOrderTypes, function (el) {return $XP(el, 'value') == v;});
						ret[k] = $XP(supportOrderType, 'label', '');
					break;
				default :
					ret[k] = model.get(k);
					break;
			}
		});
		return IX.inherit(ret, {
				infoLabelClz : 'col-xs-3 col-sm-3',
				infoTextClz : 'col-xs-8 col-sm-8',
		})
		
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
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_preview')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		renderForm : function () {
			var self = this;
			var renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl(renderData);
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
			var self =this,
				act = self.mode + 'Promotion';
			var formParams = self.model.getAll();
			
			IX.Debug.info(formParams);
			self.model.emit(act, {
				params : formParams,
				failFn : function () {
					self.failFn.call(self);
				},
				successFn : function (rsp) {
					var itemID = self.model.get('itemID')==0 ? rsp.records[0].itemID : self.model.get('itemID'),
						shopID = self.model.get('shopID');
						self.model.emit('switchPromotion', {
							post : {
								shopID : shopID,
								itemID : itemID,
								action : 1
							},
						failFn : function () {
							self.failFn.call(self);
						},
						successFn : function () {
							self.successFn.call(self);
							var resultController = self.parentView.parentView.$container.data('resultController');
							if (resultController) {
								resultController.emit('load');
							}
							
							self.parentView.modal.hide();
						}
					});
					
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
				mapFormElsData : mapPromotionDetailData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
	
})(jQuery, window);