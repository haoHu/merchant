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
		GiftSendStatisticQueryKeys : ['startTime', 'endTime', 'getWay', 'giftStatus', 'giftItemID'],
		GiftUsedStatisticQueryKeys : ['startTime', 'endTime', 'usingShopID', 'giftItemID'],
		EventMgrQueryKeys : ['eventName', 'eventWay', 'isActive', 'eventStartDate', 'eventEndDate'],
		EventTrackBaseQueryKeys : ['eventID', 'keyword', 'cardLevelID']
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

		// 礼品详情->发送数统计
		giftItemID : {
			type : 'hidden',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		timeRange : {
			type : 'section',
			label : '发出时间',
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
		getWay : {
			type : 'combo',
			label : '发出方式',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		giftStatus : {
			type : 'combo',
			label : '状态',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		usingShopID : {
			type : 'combo',
			label : '适用店铺',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
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
		},
		winFlag : {
			type : 'combo',
			label : "中奖情况",
			defaultVal : "",
			validCfg : {
				validators : {}
			}
		},
		eventID : {
			type : 'hidden',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		keyword : {
			type : 'text',
			label : '关键字',
			defaultVal : "",
			validCfg : {
				validators : {}
			}
		},
		cardLevelID : {
			type : 'combo',
			label : '会员等级',
			defaultVal : "-1",
			validCfg : {
				validators : {}
			}
		},
        sendSMS: {
            type: 'button',
            label: '发送短信',
            clz: 'btn-warning'

        }
	};
	var QueryFormElsHT = new IX.IListManager();
	_.each(Hualala.MCM.QueryFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-4 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k == 'eventTime' ? 'eventStartDate' : 'startTime',
				maxName = k == 'eventTime' ? 'eventEndDate' : 'endTime',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-4'
				}),
				max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-4'
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
					wizardType : 'create',
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
			} else if(act == 'sendSMS') {
                Handlebars.registerPartial('customSelect', Hualala.TplLib.get('tpl_select'));
                var modalBodyTpl = Handlebars.compile(Hualala.TplLib.get('tpl_sms_template')),
                    smsCustomerOptNames = ['不限', '未入围', '已入围'],
                    smsBaseAttr = [{label: '会员姓名'}, {label: '先生/女士'}, {label: '卡名称'}, {label: '卡号后四位'}],
                    modal = new Hualala.UI.ModalDialog({
                        id: 'apply-event-sms',
                        title: '群发短信',
                        backdrop: 'static',
                        hideCloseBtn: false,
                        html: $(modalBodyTpl({
                            hideSMSTip: 'hidden',
                            smsCustomer: true,
                            selectData: {
                                name: 'winFlag',
                                options: _.map(Hualala.TypeDef.MCMDataSet.JoinTypes, function(type, idx) {
                                    return IX.inherit(type, {name: smsCustomerOptNames[idx]});
                                })
                            },
                            smsAttr: smsBaseAttr,
                            smsTextCount: 0
                        }))
                    }).show();
                ;
                bindApplySendSMSEvent(modal);
            }
        });
	};
    function bindApplySendSMSEvent(modal){
        modal._.body.find('form').bootstrapValidator({
            fields: {
                smsTemplate: {
                    validators: {
                        notEmpty: { message: '短信内容不能为空' }
                    }
                }
            }
        });
        modal._.footer.find('.btn-ok').text('发送');
        modal._.footer.on('click', '.btn-ok', function (e) {
            var $form = $(e.target).parents('.modal').find('.modal-body form'),
                eventID = Hualala.PageRoute.getCurrentPath().match(/\d/g).join(''),
                params = IX.inherit(Hualala.Common.parseForm($form), {eventID: eventID});
            params.smsTemplate = Hualala.Common.encodeTextEnter(params.smsTemplate);
            if(!$form.data('bootstrapValidator').validate().isValid()) return;
            Hualala.Global.applyEventSendSMS(params, function(rsp) {
                if(rsp.resultcode != '000'){
                    Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                Hualala.UI.TopTip({msg: '已经开始发送短信', type: 'success'});
                modal.hide();
            });
        });
        modal._.body.on('click', 'a[name="preview"]', function (e) {
            var smsDefaultAttr = {
                    receiverName: 'XXX', receiverSex: '先生', cardName: '金卡', cardLastFourNumber: '8888',
                },
                $this = $(this),
                $preview = $this.next('p'),
                $textarea = $this.parents('.form-group').find('textarea'),
                textareaVal = $textarea.val(),
                previewText = textareaVal.replace(/[\[【]会员姓名[\]】]/g, smsDefaultAttr.receiverName)
                    .replace(/[\[【]先生\/女士[\]】]/g, smsDefaultAttr.receiverSex)
                    .replace(/[\[【]卡名称[\]】]/g, smsDefaultAttr.cardName)
                    .replace(/[\[【]卡号后四位[\]】]/g, smsDefaultAttr.cardLastFourNumber)
                    .replace(/[\[【]奖品名称\d*[\]】]/g, smsDefaultAttr.giftName)
                    .replace(/[\[【]奖品数量\d*[\]】]/g, smsDefaultAttr.cardCount)
                    .replace(/[\[【]有效期\d*[\]】]/g, smsDefaultAttr.cardValidDate);
            $preview.text(previewText);
            $textarea.trigger('keydown');
        }).on('click', '[name="smsAttr"] a', function() {
            var $textArea = $(this).parents('form').find('.form-group textarea[name="smsTemplate"]');
            $textArea.insertAtCaret('[' + $(this).text() + ']');
            $textArea.trigger('keydown');
        }).on('keydown', 'textarea', function (e) {
            var $this = $(e.target),
                $smsTextCount = $this.parents('form').find('.form-group span[name="estimateSMSCount"]');
            $smsTextCount.text($this.val().length);
        });
    }

	Hualala.MCM.bundleEventsQueryEvent = function () {
		var self = this;
		self.$queryBox.on('click', '.btn', function (e) {
			var act = $(this).attr('name');
			if (act == 'addEvent') {
				// TODO Add Event
				initSetRoleModal(self);
			} else if (act == 'search') {
				self.emit('query', self.getQueryParams());
			}
		});
		// 活动类型设置窗口
		function initSetRoleModal(queryController) {
			var EventTypeModal = new Hualala.UI.ModalDialog({
				id : "Event_Type_Modal",
				clz : "Event-modal",
				title : "选择创建活动类型"
			});
			EventTypeModal.show();
			self.EventTypeModal = EventTypeModal;
			EventTypeModal._.footer.find('.btn-ok').remove();
			EventTypeModal._.footer.find('.btn-close').text('关闭');
			loadingModal(EventTypeModal, queryController);
		}
		function loadingModal(modalContainer, queryController){
			var curPageRight = Hualala.Common.getCurPageUserRight();
			var disabled = $XP(curPageRight, 'right.disabled', []),
				enabled = $XP(curPageRight, 'right.enabled', []);

			var listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_gift_card_list')),
				$modalbody = modalContainer._.body;
				$modalbody.addClass("clearfix");
			var eventTypes=_.reject(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {
				return IX.isEmpty($XP(el, 'value'));
			});
			var ret = _.map(eventTypes, function (eventType, i, l) {
				return IX.inherit(eventType, {
					clz : $XP(eventType, 'type', ''),
					label : $XP(eventType, 'label', ''),
					value : $XP(eventType, 'value', ''),
					unit : $XP(eventType, 'unit', '')
				});
			});
			$(listTpl({option: ret})).appendTo($modalbody.empty());
			_.each(disabled, function (n) {
				$modalbody.find('[data-btn-name=' + n + ']').attr('disabled', true).addClass('hidden');
			});
            _.each(enabled, function (n) {
				$modalbody.find('[data-btn-name=' + n + ']').attr('disabled', false).removeClass('hidden');
			});
            bindmodalEvent(modalContainer, queryController);
        }

        function createEvent(container, eventWay, queryController) {
            var eventType= _.find(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {
                    return $XP(el, 'value')== eventWay;
                }),
                isSendEvent = eventWay == 50 || eventWay == 51,
                wizardStepChangeMap = {
                    '50': Hualala.MCM.SMSOnStepChange,
                    '51': Hualala.MCM.BirthdayEventStepChange
                },
                stepChange = wizardStepChangeMap[eventWay + ''] || Hualala.MCM.onEventWizardStepChange,
                stepCfg = Hualala.MCM.EventWizardCfgBy(eventWay);
            var baseEventModel = new Hualala.MCM.BaseEventModel(),
                sessionUser = Hualala.getSessionUser(),
                createRoleType = $XP(sessionUser, 'role', ['']).join(','),
                loginName = $XP(sessionUser, 'loginName', '');
            baseEventModel.set({eventWay: eventWay, createRoleType: createRoleType, loginName: loginName, smsGate: isSendEvent ? '1' : '0'});
            container.hide();
            var wizardPanel = new Hualala.MCM.MCMWizardModal({
                wizardType : 'create',
                parentView : queryController,
                mode : 'create',
                successFn : function () {

                },
                failFn : function () {

                },
                model : baseEventModel,
                modalClz : 'mcm-event-modal',
                wizardClz : 'mcm-event-wizard',
                modalTitle : '创建' + $XP(eventType, 'label', '') + '活动',
                onWizardInit : function ($cnt, cntID, wizardMode) {
                    Hualala.MCM.initEventBaseInfo.call(this, $cnt, cntID, wizardMode);
                },
                onStepCommit : function (curID) {
                    Hualala.MCM.onEventWizardStepCommit.call(this, curID);
                },
                onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
                    stepChange.call(this, $curNav, $navBar, cIdx, nIdx);
                },
                bundleWizardEvent : function () {
                    Hualala.MCM.bundleEventWizardEvent.call(this);
                },
                wizardStepsCfg : stepCfg,
                wizardCtrls : Hualala.MCM.WizardCtrls

            });
        }
        function bindmodalEvent(container, queryController){
			container._.body.find('.choice-eventWay').on('click', function (e) {
                var eventWay = $(this).attr('data-value');
                if(eventWay == '51') {
                    Hualala.Global.checkBirthdayEventExist({}, function(rsp) {
                        if(rsp.resultcode != '000' || rsp.data.birthdayGiftFlag == 1) {
                            var msg = rsp.resultcode != '000' ? rsp.resultmsg : '你已添加过生日赠送活动，不能重复添加！'
                            Hualala.UI.TopTip({msg: msg, type: 'danger'});
                            return;
                        }
                        createEvent(container, eventWay, queryController);
                    });
                } else {
                    createEvent(container, eventWay, queryController);
                }
            });
        }
	};
	/**
	 * 格式化礼品管理页,搜索栏表单元素
	 * @return {Object} 渲染表单的数据
	 */
	Hualala.MCM.mapGiftQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var queryElsClz = self.hasAddBtn ? 'col-md-4' : 'col-md-5',
			queryBtnClz = 'col-md-2';
		var cols = [
			{
				colClz : queryElsClz,
				items : QueryFormElsHT.getByKeys(['giftName'])
			},
			{
				colClz : queryElsClz,
				items : QueryFormElsHT.getByKeys(['giftType'])
			},
			{
				colClz : queryBtnClz,
				items : QueryFormElsHT.getByKeys(['search'])
			}
		];
		if (self.hasAddBtn) {
			cols.push({
				colClz : queryBtnClz,
				items : QueryFormElsHT.getByKeys(['addGift'])
			});
		}
		
		return {
			query : {
				cols : cols
			}
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

	Hualala.MCM.mapGiftDetailGetWayQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-5',
					items : QueryFormElsHT.getByKeys(['timeRange'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['getWay'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['giftStatus'])
				},
				{
					colClz : 'col-md-1',
					items : QueryFormElsHT.getByKeys(['search', 'giftItemID'])
				}
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapGiftDetailUsedQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {
			cols : [
				{
					colClz : 'col-md-5',
					items : QueryFormElsHT.getByKeys(['timeRange'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['usingShopID'])
				},
				{
					colClz : 'col-md-offset-1 col-md-1',
					items : QueryFormElsHT.getByKeys(['search', 'giftItemID'])
				}
			]
		};
		return {
			query : query
		};
	};

	Hualala.MCM.mapEventTrackQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var eventDetail = self.$container.data('eventDetail'),
			eventWay = $XP(eventDetail, 'eventWay');
		var searchBtnCol = _.map(QueryFormElsHT.getByKeys(['search', 'eventID']), function (el, i) {
			if (i == 0) return el;
			return IX.inherit(el, {
				value : $XP(eventDetail, 'eventID')
			});
		});
		var query = {
			cols : [
				{
					colClz : 'col-md-4',
					items : QueryFormElsHT.getByKeys(['keyword'])
				},
				{
					colClz : 'col-md-3',
					items : QueryFormElsHT.getByKeys(['cardLevelID'])
				},
				{
					colClz : 'col-md-2',
					items : searchBtnCol
				}
			]
		};
		if (eventWay == '20' || eventWay == '22') {
            var winFlagItem = {
                    colClz: 'col-md-2',
                    items: QueryFormElsHT.getByKeys(['winFlag'])
                },
                sendSMSItem = {
                    colClz: 'col-md-1',
                    items: QueryFormElsHT.getByKeys(['sendSMS'])
                };
            query.cols.splice(2, 0, winFlagItem);
            if(eventWay == 22) {
                query.cols.push(sendSMSItem);
                query.cols[0].colClz = 'col-md-3';
                query.cols[4].colClz = 'col-md-1';
            }
		}
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
			if (pageName == 'mcmGiftDetail') {
				var tabCntID = self.$container.attr('id');
				var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
				self.initEventTimePicker($XP(els, 'startTime', ''), $XP(els, 'endTime', ''));
				self.$queryBox.find(':hidden[name=giftItemID]').val($XP(ctx, 'params', [])[0]);
				console.info(self.container);
				if (tabCntID == 'tab_send') {
					self.initGiftDetailGetWayComboOpts($XP(els, 'getWay', ''));
					self.initGiftDetailGiftStatusComboOpts($XP(els, 'giftStatus', ''));
				} else {
					self.initShopChosenPanel($XP(els, 'usingShopID', ''));
				}
			}
			if (pageName == 'mcmEventTrack') {
				self.initCardLevelComboOpts();
				self.initWinTypeComboOpts();
			}
			// _.each(els, function (v, k) {
			// 	if (k == 'giftType') {
			// 		self.initGiftTypeComboOpts(v);
			// 	}
			// });
		},
		// 加载礼品发出方式下拉列表选项
		initGiftDetailGetWayComboOpts : function (curGetWay) {
			var self = this,
				getWayTypes = Hualala.TypeDef.MCMDataSet.GiftDistributeTypes;
			if (IX.isEmpty(getWayTypes)) return;
			getWayTypes = _.map(getWayTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curGetWay ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : getWayTypes
				}),
				$combo = self.$queryBox.find('select[name=getWay]');
			$combo.html(htm);
		},
		// 加载礼品状态下拉列表选项
		initGiftDetailGiftStatusComboOpts : function (curVal) {
			var self = this,
				options = Hualala.TypeDef.MCMDataSet.GiftStatus;
			if (IX.isEmpty(options)) return;
			options = _.map(options, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label,
					selected : value == curVal ? 'selected' : ''
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : options
				}),
				$combo = self.$queryBox.find('select[name=giftStatus]');
			$combo.html(htm);
		},
		// 加载礼品类型下拉列表选项
		initGiftTypeComboOpts : function (curGiftType, selectedGiftTypes) {
			var self = this,
                allGiftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes,//去掉菜品优惠券
				giftTypes = selectedGiftTypes ? _.select(allGiftTypes, function (giftType) {return _.contains(selectedGiftTypes, giftType.value);}) : allGiftTypes;
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
		},
		renderShopChosenRenderOptions : function (sections) {
			var self = this;
			var optTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_optgroup'));
			var shops = _.groupBy(sections, function (el) {
				return $XP(el, 'cityID');
			});
			var renderData = [];
			_.each(shops, function (els, cityID) {
				var cityName = $XP(els[0], 'cityName', '');
				var options = _.map(els, function (el) {
					return IX.inherit(el, {
						clz : ''
					});
				});
				renderData.push({
					cityName : cityName,
					cityID : cityID,
					options : options
				})
			});
			
			self.$queryBox.find('select[name=usingShopID]').html(optTpl({
				items : renderData
			}));
			self.$queryBox.find('select[name=usingShopID]').prepend('<option value="" selected></option>');
		},
		// 加载选择店铺控件
		initShopChosenPanel : function (curUsingShopID) {
			var self = this;
			var matcher = (new Pymatch([]));
			var sections = [];
			Hualala.Global.getShopQuerySchema({}, function (res) {
				if ($XP(res, 'resultcode') == '000') {
					sections = $XP(res, 'data.shops', []);
					self.renderShopChosenRenderOptions(sections);
					var getMatchedFn = function (searchText) {
						matcher.setNames(_.map(sections, function(el) {
							return IX.inherit(el, {
								name : $XP(el, 'shopName'),
								value : $XP(el, 'shopID')
							});
						}));
						var matchedSections = matcher.match(searchText);
						var matchedOptions = {};
						_.each(matchedSections, function (el, i) {
							matchedOptions[el[0].shopID] = true;
						});
						return matchedOptions;
					};

					self.$queryBox.find('select[name=usingShopID]').chosen({
						width : '200px',
						placeholder_text : "请选择店铺",
						no_results_text : "抱歉，没有找到！",
						allow_single_deselect : false,
						getMatchedFn : getMatchedFn
					});
				}
			});
		},
		// 加载会员等级选择控件
		initCardLevelComboOpts : function () {
			var self = this,
				cardLevels = Hualala.TypeDef.MCMDataSet.EventCardLevels;
			var renderCombo = function () {
				var optTpl = self.get('comboOptsTpl'),
					htm = optTpl({
						opts : cardLevels
					}),
					$combo = self.$queryBox.find('select[name=cardLevelID]');
				$combo.html(htm);
			};
			Hualala.Global.getVipLevels({}, function (res) {
				if ($XP(res, 'resultcode') == '000') {
					var _cardLevels = _.filter($XP(res, 'data.records', []), function (el) {
						return $XP(el, 'isActive') == 1;
					});
					cardLevels = cardLevels.concat(_.map(_cardLevels, function (el) {
						return {
							value : $XP(el, 'cardLevelID'),
							label : $XP(el, 'cardLevelName')
						};
					}));
					renderCombo();
				} else {
					renderCombo();
				}
			});
		},
		// 加载中奖情况选择控件
		initWinTypeComboOpts : function () {
			var self = this,
				winTypes = null,
				label = '';
			var eventDetail = self.$container.data('eventDetail');
			var eventWay = $XP(eventDetail, 'eventWay');
			if (eventWay == '20') {
				winTypes = Hualala.TypeDef.MCMDataSet.WinTypes;
				label = "中奖情况";
			} else if (eventWay == '22') {
				winTypes = Hualala.TypeDef.MCMDataSet.JoinTypes;
				label = "参与状态";
			}
			if (IX.isEmpty(winTypes)) return;
			winTypes = _.map(winTypes, function (item) {
				var value = $XP(item, 'value'), label = $XP(item, 'label');
				return {
					value : value,
					label : label
				};
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : winTypes
				}),
				$combo = self.$queryBox.find('select[name=winFlag]');
			$combo.html(htm);
			$combo.parents('.form-group').find('label').html(label);
		}

	});


	Hualala.MCM.QueryView = QueryView;














})(jQuery, window);