(function ($, window) {
	IX.ns("Hualala.Shop");
	var HSP = Hualala.Shop;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var PromotionSetFormElsHT = HSP.PromotionSetFormElsHT;
	//老店铺需求所需字段
	var PromotionRuleFormKeys = 'dateRange,supportOrderType,holidayFlag,timeID'.split(',');
	//新店铺需求的所需字段
	//var PromotionRuleFormKeys = 'dateRange,wholeDay,supportOrderType,holidayFlag,time1,time2'.split(',');
	/**
	 * 整理表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventRuleFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = PromotionSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'section') {
				switch(key){
					case 'dateRange':
						var startDate = self.model.get('startDate') || '',
							endDate = self.model.get('endDate') || '';
						startDate = (IX.isEmpty(startDate) || startDate == 0) ? '' : startDate;
						endDate = (IX.isEmpty(endDate) || endDate == 0) ? '' : endDate;
						return IX.inherit(elCfg, {
							min : IX.inherit($XP(elCfg, 'min'), {
								value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(startDate), 'yyyy/MM/dd')
							}),
							max : IX.inherit($XP(elCfg, 'max'), {
								value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(endDate), 'yyyy/MM/dd')
							})
						});
					break;
					case 'time1':
					case 'time2':
						var starstr = key+"Start",
							endstr = key+"End";
						var starstr = self.model.get(starstr) || '',
							endstr = self.model.get(endstr) || '';
						starstr = (IX.isEmpty(starstr) || starstr == 0) ? '' : starstr;
						endstr = (IX.isEmpty(endstr) || endstr == 0) ? '' : endstr;
						var	v = _.map(v, function (t) {
								return self.decodeTimeStr(t);
							});
						return IX.inherit(elCfg, {
							min : IX.inherit($XP(elCfg, 'min'), {
								value : starstr || $XP(elCfg, 'min.defaultVal')
							}),
							max : IX.inherit($XP(elCfg, 'max'), {
								value : endstr || $XP(elCfg, 'max.defaultVal')
							})
						});
					break;
				}
			} else if (type == 'radiogrp') {
				switch(key) {
					case 'supportOrderType':
					case 'wholeDay':
					case 'timeID':
						var v = self.model.get(key) || $XP(elCfg, 'defaultVal'),
							options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									checked : v == $XP(op, 'value') ? 'checked' : ''
								});
							});
						return IX.inherit(elCfg, {
							options : options
						});
					break;
					case 'holidayFlag':
						var v = self.model.get('holidayFlag') || 0,
						options = _.map($XP(elCfg, 'options'), function (op) {
							return IX.inherit(op, {
								checked : v == $XP(op, 'value') ? 'checked' : ''
							});
						});
						return IX.inherit(elCfg, {
							options : options
						}); 
					break;
				}
			} /*else if (type == 'radiogrp' || type == 'checkboxgrp') {
				var v = self.model.get(key) || $XP(elCfg, 'defaultVal');
				if (type == 'checkboxgrp') {
					v = v.split(',');
				}
				var options = _.map($XP(elCfg, 'options'), function (op) {
					var checked = type == 'checkboxgrp' ? (_.contains(v, $XP(op, 'value') + '') ? true : false) : ($XP(op, 'value') == v);
					return IX.inherit(op, {
						checked : checked ? 'checked' : ''
					});
				});
				return IX.inherit(elCfg, {
					options : options
				});
			}*/ else {
				return IX.inherit(elCfg, {
					value : self.model.get(key) || $XP(elCfg, 'defaultVal')
				});
			}
		});
		return ret;
	};
	/*促销时间的view层*/
	var PromotionTimeStepView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');
			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Gift Base Info View init faild!");
			}
			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});
	PromotionTimeStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_base_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initBaseCfg : function () {
			this.formKeys = PromotionRuleFormKeys;
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'wizard-step-form form-feedback-out',
					items : renderData
				});
			self.container.html(htm);
		},
		initUIComponents : function () {
			var self = this;
			self.initDatePicker();
			self.initTimePicker();
			self.setRadioWholeDayLayout(self.container.find(':radio[name=wholeDay]'));
		},
		//格式的datetimepicker设置
		initDatePicker : function () {
			var self = this;
			self.container.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
		},
		//时间的timepicker设置
		initTimePicker : function () {
			var self = this;
			self.container.find('[data-type=timepicker]').timepicker({
				minuteStep : 30,
				showSeconds : false,
				showMeridian :  false,
				disableFocus : true,
				showInputs : false
			});
		},
		bindEvent : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts();
			self.container.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				self.failFn(self.model);
			}).on('success.form.bv', function (e, data) {
				var formParams = self.serializeForm(),
					isEventDateValid = parseInt(formParams.startDate) > parseInt(formParams.endDate);
				if(isEventDateValid) {
					self.parentView.switchWizardCtrlStatus('reset');
					toptip({msg: '结束日期不能小于开始日期', type: 'danger'});
					return;
				}
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				IX.Debug.info("DEBUG: Event Wizard Form Params:");
				IX.Debug.info(formParams);
				self.model.emit('saveCache', {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.parentView.switchWizardCtrlStatus('reset');
						self.model.emit('promotionTimeCheck', {
							params : self.model.getAll(),
							failFn : function (res) {
								if(res.resultcode == 'SP00002') {
									toptip({msg: res.resultmsg, type: 'danger'});
								}
								self.failFn.call(self);
							},
							successFn : function (rsp) {
								var promotionTimeCheckModal = new Hualala.UI.ModalDialog({
									id : "Event_Type_Modal",
									clz : "Event-modal",
									title : "设置促销时间确认"
								});
								promotionTimeCheckModal.show();
								self.promotionTimeCheckModal = promotionTimeCheckModal;
								promotionTimeCheckModal._.footer.find('.btn-ok').text('确认');
								var datasets =rsp.datasets;
								var listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_TimeCheck'))
								$modalbody = promotionTimeCheckModal._.body;
								$modalbody.addClass("clearfix");
								var newPromotionDs = rsp.datasets.newPromotionDs.data.records,
									oldPromotionDs = rsp.datasets.oldPromotionDs.data.records,
									ret = {};
									ret.newPromotionDs=[];
									ret.oldPromotionDs =[];
								var supportOrderTypes = Hualala.TypeDef.ShopPromotionDataSet.supportOrderTypes,
									holidayFlags = Hualala.TypeDef.MCMDataSet.GiftIsHolidayUsing,
									timeIDs = Hualala.TypeDef.ShopPromotionDataSet.timeIDTypes,
									formatDateTimeValue = Hualala.Common.formatDateTimeValue;
									if(newPromotionDs){
										ret.newPromotionDs = IX.clone(newPromotionDs);
								        for(var i = newPromotionDs.length - 1, newPromotionD; newPromotionD = ret.newPromotionDs[i--];){
								        	var supportOrderType = _.find(supportOrderTypes, function (el) {return $XP(el, 'value') == newPromotionD.supportOrderType;}),
								        		holidayFlag = _.find(holidayFlags, function (el) {return $XP(el, 'value') == newPromotionD.holidayFlag;}),
								        		timeIDFlag = _.find(timeIDs, function (el) {return $XP(el, 'value') == newPromotionD.timeID;});
								            newPromotionD.startDate = IX.Date.getDateByFormat(formatDateTimeValue(newPromotionD.startDate), 'yyyy-MM-dd');
								            newPromotionD.endDate = IX.Date.getDateByFormat(formatDateTimeValue(newPromotionD.endDate), 'yyyy-MM-dd');
											newPromotionD.supportOrderType = $XP(supportOrderType, 'label', '');
											newPromotionD.holidayFlag =  $XP(holidayFlag, 'label', '');
											newPromotionD.timeID = $XP(timeIDFlag, 'label', '');
								        }
									}
									if(oldPromotionDs){
										ret.oldPromotionDs = IX.clone(oldPromotionDs);
								        for(var i = oldPromotionDs.length - 1, oldPromotionD; oldPromotionD = ret.oldPromotionDs[i--];){
								        	var supportOrderType = _.find(supportOrderTypes, function (el) {return $XP(el, 'value') == oldPromotionD.supportOrderType;}),
								        		holidayFlag = _.find(holidayFlags, function (el) {return $XP(el, 'value') == oldPromotionD.holidayFlag;}),
								        		timeIDFlag = _.find(timeIDs, function (el) {return $XP(el, 'value') == oldPromotionD.timeID;});
								            oldPromotionD.startDate = IX.Date.getDateByFormat(formatDateTimeValue(oldPromotionD.startDate), 'yyyy-MM-dd');
								            oldPromotionD.endDate = IX.Date.getDateByFormat(formatDateTimeValue(oldPromotionD.endDate), 'yyyy-MM-dd');
											oldPromotionD.supportOrderType = $XP(supportOrderType, 'label', '');
											oldPromotionD.holidayFlag =  $XP(holidayFlag, 'label', '');
											oldPromotionD.timeID = $XP(timeIDFlag, 'label', '');
								        }
								    }
								$(listTpl({option: ret})).appendTo($modalbody.empty());
								promotionTimeCheckModal._.footer.find('.btn-ok').on('click', function (e) {
									promotionTimeCheckModal.hide();
									self.model.emit('promotionRulesToString', {
										params : {rules:self.model.get("rules")},
										failFn : function () {
											self.failFn.call(self);
										},
										successFn : function () {
											self.successFn.call(self);
										}
									});
								});
							}
						});
					}
				});
			});
			
			self.container.find(':radio[name=wholeDay]').on('change', function (e) {
				self.setRadioWholeDayLayout($(this));
			});
			self.container.find('form [data-type=datetimepicker],form [data-type=timepicker]').on('change', function (e) {
				var $this = $(this),
					name = $this.attr('name');
				self.container.find('form').bootstrapValidator('revalidateField', name);
			});
		},
		setRadioWholeDayLayout : function ($radio) {
			var self = this;
			var val = self.getRadiboxVal($radio.attr('name'));
			var $time1FormGroup = $(':input[name=time1Start]').parents('.form-group'),
				$time2FormGroup = $(':input[name=time2Start]').parents('.form-group');
			if (val == 1) {
				$time1FormGroup.hide();
				$time2FormGroup.hide();
			}
			else {
				$time1FormGroup.show();
				$time2FormGroup.show();
			}
		},
		getCheckboxVal : function (name) {
			var self = this;
			var checkbox = $(':checkbox[name=' + name + ']:checked');
			var ret = [];
			checkbox.each(function (el) {
				var $this = $(this);
				ret.push($this.val());
			});
			return ret.join(',');
		},
		getRadiboxVal : function (name) {
			var self = this;
			var radiobox = $(':radio[name=' + name + ']:checked');
			return radiobox.val();
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = PromotionSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (key == 'dateRange') {
					ret['startDate'] = $XP(elCfg, 'min.validCfg', {});
					ret['endDate'] = $XP(elCfg, 'max.validCfg', {});
				} else if (key == 'time1'||key == 'time2') {
					var starstr = key+"Start",
					 	endstr = key+"End";
					ret[starstr] = $XP(elCfg, 'min.validCfg', {});
					ret[endstr] = $XP(elCfg, 'max.validCfg', {});
				} else {
					ret[key] = $XP(elCfg, 'validCfg', {});	
				}
			});
			return ret;
		},
		serializeForm : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {};
			var getDateRange = function () {
				var start = IX.Date.getDateByFormat($(':text[name=startDate]', self.container).val(), 'yyyyMMdd'),
					end = IX.Date.getDateByFormat($(':text[name=endDate]', self.container).val(), 'yyyyMMdd');
				return {startDate : start, endDate : end};
			};
			var getTimeRange = function (k) {
				var start =($(':text[name='+k+'Start]', self.container).val()).replace(/:/,""),
					end = ($(':text[name='+k+'End]', self.container).val()).replace(/:/,"");
				if(k=="time1"){
					return {time1Start : start, time1End : end};
				}
				else{
					return {time2Start : start, time2End : end};
				}	
			}
			var formEls = _.map(formKeys, function (key) {
				var elCfg = PromotionSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				var v = null;
				switch (key) {
					case 'dateRange':
						v = getDateRange();
						ret = IX.inherit(ret, v);
						break;
					case 'time1':
					case 'time2':
						v = getTimeRange(key);
						ret = IX.inherit(ret, v);
						break;
					/*//supportOrderType业务类型为多选的状态	
					case 'supportOrderType':
						v=self.getCheckboxVal(key);
						ret[key] = v;
						break;*/
					case 'supportOrderType':
					case 'wholeDay':
					case 'holidayFlag':
					case 'timeID' :
						v = self.getRadiboxVal(key);
						ret[key] = v;
						break;
				}
				return key;
			});
			return ret;
		},
		refresh : function () {
			var self = this;
			this.formParams = this.model.getAll();
			self.initUIComponents();
		},
		delete : function (successFn, faildFn) {
			var self = this;
			self.model.emit('deleteItem', {
				itemID : self.model.get('eventID'),
				successFn : function (res) {
					successFn(res);
				},
				faildFn : function (res) {
					faildFn(res);
				}
			});
		}
	});

	HSP.PromotionTimeStepView = PromotionTimeStepView;

	/**
	 * 创建向导中促销时间步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HSP.initPromotionTimeStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HSP.PromotionTimeStepView({
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
				mapFormElsData : mapEventRuleFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
})(jQuery, window);