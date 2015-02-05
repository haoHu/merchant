(function ($, window) {
	IX.ns("Hualala.MCM");
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	/**
	 * MCM搜索标点参数
	 * 
	 * @type {Object}
	 */
	Hualala.MCM.QueryFormKeys = {
		GiftMgrQueryKeys : ['giftName', 'giftType'],
		EventMgrQueryKeys : ['eventName', 'eventWay', 'isActive', 'eventStartDate', 'eventEndDate']
	};

	/**
	 * 查询条件表单元素配置
	 */
	Hualala.MCM.QueryFormElsCfg = {
		// 礼品列表搜索栏
		giftName : {
			type : 'text',
			label : '礼品名称',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		giftType : {
			type : 'combo',
			label : '礼品类型',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		search : {
			type : 'button',
			clz : 'btn btn-warning',
			label : '查询'
		},
		addGift : {
			type : 'button',
			clz : 'btn btn-warning',
			label : '添加礼品'
		},
		// 活动列表搜索栏
		eventName : {
			type : 'text',
			label : '活动名称',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		eventWay : {
			type : 'combo',
			label : '活动类型',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		isActive : {
			type : 'combo',
			label : '活动状态',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		eventTime : {
			type : 'section',
			label : '起止日期',
			min : {
				type : 'datetimepicker',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		addEvent : {
			type : 'button',
			clz : 'btn btn-warning',
			label : '添加活动'
		}

	};
	var QueryFormElsHT = new IX.IListManager();
	_.each(Hualala.MCM.QueryFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-4 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = 'eventStartDate',
				maxName = 'eventEndDate',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-5'
				}),
				max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-5'
				});
			QueryFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : 'col-xs-2 col-sm-2 col-md-2 control-label',
				min : min,
				max : max
			}));
		} else {
			QueryFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz
			}, $XP(el, 'type') != 'button' ? {clz : 'col-xs-8 col-sm-8 col-md-8'} : null));
		}
	});

	Hualala.MCM.bundleGiftsQueryEvent = function () {
		var self = this;
		self.$queryBox.on('click', '.btn', function (e) {
			var act = $(this).attr('name');
			if (act == 'addGift') {
				// TODO Add Gift
				var wizardPanel = new Hualala.MCM.MCMWizardModal({
					parentView : self,
					mode : 'create',
					successFn : function () {

					},
					failFn : function () {

					},
					model : new Hualala.MCM.BaseGiftModel(),
					modalClz : 'mcm-gift-modal',
					wizardClz : 'mcm-gift-wizard',
					modalTitle : '创建礼品',
					onWizardInit : function ($cnt, cntID, wizardMode) {
						Hualala.MCM.initGiftBaseInfoStep.call(this, $cnt, cntID, wizardMode);
					},
					onStepCommit : function (curID) {
						Hualala.MCM.onGiftWizardStepCommit.call(this, curID);
					},
					onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
						Hualala.MCM.onGiftWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
					},
					bundleWizardEvent : function () {
						Hualala.MCM.bundleGiftWizardEvent.call(this);
					},
					wizardStepsCfg : Hualala.MCM.GiftWizardCfg,
					wizardCtrls : Hualala.MCM.WizardCtrls

				});
			} else if (act == 'search') {
				self.emit('query', self.getQueryParams());
			}
		});
	};

	Hualala.MCM.bundleEventsQueryEvent = function () {
		var self = this;
		self.$queryBox.on('click', '.btn', function (e) {
			var act = $(this).attr('name');
			if (act == 'addEvent') {
				// TODO Add Event
				var wizardPanel = new Hualala.MCM.MCMWizardModal({
					parentView : self,
					mode : 'create',
					successFn : function () {

					},
					failFn : function () {

					},
					model : new Hualala.MCM.BaseEventModel(),
					modalClz : 'mcm-event-modal',
					wizardClz : 'mcm-event-wizard',
					modalTitle : '创建活动',
					onWizardInit : function ($cnt, cntID, wizardMode) {
						Hualala.MCM.initEventBaseInfoStep.call(this, $cnt, cntID, wizardMode);
					},
					onStepCommit : function (curID) {
						Hualala.MCM.onEventWizardStepCommit.call(this, curID);
					},
					onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
						Hualala.MCM.onEventWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
					},
					bundleWizardEvent : function () {
						Hualala.MCM.bundleEventWizardEvent.call(this);
					},
					wizardStepsCfg : Hualala.MCM.EventWizardCfg,
					wizardCtrls : Hualala.MCM.WizardCtrls

				});

			} else if (act == 'search') {
				self.emit('query', self.getQueryParams());
			}
		});
	};
	/**
	 * 格式化礼品管理页,搜索栏表单元素
	 * @return {Object} 渲染表单的数据
	 */
	Hualala.MCM.mapGiftQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['giftName'])
				},
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['giftType'])
				},
				{
					colClz : 'col-md-2',
					items : QueryFormElsHT.getByKeys(['search'])
				},
				{
					colClz : 'col-md-2 ' + (self.hasAddBtn ? '' : 'hidden'),
					items : QueryFormElsHT.getByKeys(['addGift'])
				}
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapEventQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['eventName'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['eventWay'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['isActive'])
				},
				{
					colClz : 'col-md-6',
					items : QueryFormElsHT.getByKeys(['eventTime'])
				},
				{
					colClz : 'col-md-offset-2 col-md-2',
					items : QueryFormElsHT.getByKeys(['search'])
				},
				{
					colClz : 'col-md-2',
					items : QueryFormElsHT.getByKeys(['addEvent'])
				},
				
				
				
				
			]
		};
		return {
			query : query
		};
	};

	var QueryView = Hualala.Order.QueryView.subclass({
		/**
		 * 搜索栏View层构造函数
		 * 
		 * @param  {Obj} cfg 
		 *         @param {Function} mapRenderDataFn 渲染搜索栏表单的方法
		 *         @param {Function} bundleQueryEvent 为搜索栏绑定事件
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.isReady = false;
			this.$container = null;
			this.$queryBox = null;
			this.loadTemplates();
			this.hasAddBtn = $XP(cfg, 'hasAddBtn', true);
			this.set('mapRenderDataFn', $XF(cfg, 'mapRenderDataFn'));
			this.set('bundleQueryEvent', $XF(cfg, 'bundleQueryEvent'));
			this.set('initQueryFormEls', $XP(cfg, 'initQueryFormEls', null));
		}
	});

	QueryView.proto({
		renderLayout : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = layoutTpl(renderData);
			self.$queryBox = $(html);
			self.$container.html(self.$queryBox);
			if (!self.get('initQueryFormEls')) {
				self.initQueryFormEls();	
			} else {
				IX.isFn(self.get('initQueryFormEls')) && self.get('initQueryFormEls').call(self);
			}
			
			// self.initQueryEls();
		},
		bindEvent : function () {
			var self = this;
			var bundleQueryEvent = self.get('bundleQueryEvent');
			// self.$queryBox.on('click', '.btn', function (e) {
			// 	var act = $(this).attr('name');
			// 	if (act == 'addGift') {
			// 		// TODO Add Gift
			// 	} else if (act == 'search') {
			// 		self.emit('query', self.getQueryParams());
			// 	}
			// });
			bundleQueryEvent.call(self);
		},
		getQueryParams : function () {
			var self = this,
				keys = self.model.queryKeys,
				$form = self.$queryBox.find('form'),
				els = $form.serializeArray();
			els = _.map(els, function (el) {
				var n = $XP(el, 'name'), v = $XP(el, 'value', '');
				if (n == 'startDate' || n == 'endDate') {
					v = IX.isEmpty(v) ? '' : IX.Date.getDateByFormat(v, 'yyyyMMdd');
					return {
						name : n,
						value : v
					};
				}
				return el;
			});
			els = _.object(_.pluck(els, 'name'), _.pluck(els, 'value'));
			self.model.set(els);
			IX.Debug.info("DEBUG: Order Query Model Query Params:");
			IX.Debug.info(els);
			return els;
		},
		initQueryFormEls : function () {
			var self = this,
				els = self.model.getQueryParams();
			var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
			if (pageName == 'mcmEventMgr') {
				self.initEventTypeComboOpts($XP(els, 'eventWay', ''));
				self.initEventIsActiveComboOpts($XP(els, 'isActive', ''));
				self.initEventTimePicker($XP(els, 'eventStartDate', ''), $XP(els, 'eventEndDate'));
			}
			if (pageName == 'mcmGiftsMgr') {
				self.initGiftTypeComboOpts($XP(els, 'giftType', ''));
			}
			// _.each(els, function (v, k) {
			// 	if (k == 'giftType') {
			// 		self.initGiftTypeComboOpts(v);
			// 	}
			// });
		},
		// 加载礼品类型下拉列表选项
		initGiftTypeComboOpts : function (curGiftType) {
			var self = this,
				giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes;
			if (IX.isEmpty(giftTypes)) return;
			giftTypes = _.map(giftTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curGiftType ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : giftTypes
				}),
				$combo = self.$queryBox.find('select[name=giftType]');
			$combo.html(htm);
		},
		// 加载活动类型下拉列表选项
		initEventTypeComboOpts : function (curEventType) {
			var self = this,
				eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
			if (IX.isEmpty(eventTypes)) return;
			eventTypes = _.map(eventTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curEventType ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : eventTypes
				}),
				$combo = self.$queryBox.find('select[name=eventWay]');
			$combo.html(htm);
		},
		// 加载活动状态下拉列表数据 
		initEventIsActiveComboOpts : function (curIsActive) {
			var self = this,
				eventStatus = Hualala.TypeDef.MCMDataSet.EventIsActive;
			if (IX.isEmpty(eventStatus)) return ;
			eventStatus = _.map(eventStatus, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curIsActive ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : eventStatus
				}),
				$combo = self.$queryBox.find('select[name=isActive]');
			$combo.html(htm);
		},
		// 加载时间选择控件
		initEventTimePicker : function (start, end) {
			var self = this;
			self.$queryBox.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
		}

	});


	Hualala.MCM.QueryView = QueryView;














})(jQuery, window);