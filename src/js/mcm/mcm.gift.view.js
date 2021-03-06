(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var MCMGiftListHeaderCfg = [
		{key : "giftType", clz : "", label : "礼品类型"},
		{key : "giftName", clz : "text", label : "礼品名称"},
		{key : "createTime", clz : "date", label : "创建时间"},
		{key : "createBy", clz : "text", label : "创建人"},
		{key : "rowControl", clz : "", label : "操作"}
	];

	var MCMEventListHeaderCfg = [
		// 活动类型|活动名称|人气|活动日期|创建人|活动开关|操作
		{key : "eventWay", clz : "eventWay", label : "活动类型"},
		{key : "eventName", clz : "text", label : "活动名称"},
		{key : "userCount", clz : "num", label : "人气"},
		{key : "eventStartDate", clz : "date", label : "活动日期"},
		{key : "operator", clz : "text", label : "创建人"},
		{key : "isActive", clz : "", label : "活动开关"},
		{key : "rowControl", clz : "ctrlrow", label : "操作"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
			queryKeys = self.model.queryKeys;
		var r = {value : "", text : ""}, v = $XP(row, colKey, '');
		var userInfo = $XP(row, 'createBy', {});
		var operator = $XP(row,'operator',{});
			try {
			  //createBy有可能不是合法的JSON字符串，便会产生异常
			  userInfo = !IX.isEmpty(userInfo) && IX.isString(userInfo) ? JSON.parse(userInfo) : {};
			  operator = !IX.isEmpty(operator) && IX.isString(operator) ? JSON.parse(operator) : {};
			} catch (e) {
			  userInfo = {};
			  operator ={};
			}
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			// 礼品列表各列参数
			case "giftType":
				var giftCardTpl = self.get('giftCardTpl'),
					giftValue = Hualala.Common.Math.prettyPrice($XP(row, 'giftValue', 0)),
					giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes,
					giftType = _.find(giftTypes, function (el) {return $XP(el, 'value') == v;});
				// if (pageName == 'mcmGiftsMgr') {
					var card = giftCardTpl({
						clz : $XP(giftType, 'type', ''),
						label : giftValue,
						unit : $XP(giftType, 'unit', '')
					});
					r.value = v;
					r.text = card;
					r.colspan = 1;
					r.rowspan = 2;
				// }
				

				break;
			// case "giftName":
			// 	r.value = v;
			// 	r.text = v;
			// 	break;
			case "createTime":
				r.value = v;
				r.text = (IX.isEmpty(v) || v == 0) ? '' : IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "createBy":
				// var userInfo = !IX.isEmpty(v) && IX.isString(v) ? JSON.parse(v) : {};
				r.value = $XP(userInfo, 'userID', '');
				r.text = $XP(userInfo, 'userName', '') + '<br/>' + $XP(userInfo, 'userMobile', '');
				break;
			// 活动列表各列参数
			case "eventWay":
				var eventCardTpl = self.get('eventCardTpl'),
					eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes,
					eventType = _.find(eventTypes, function (el) {return $XP(el, 'value') == v;}),
					label = $XP(eventType, 'label', '');
				if (pageName == 'mcmEventMgr') {
					var card = eventCardTpl({
						clz : $XP(row, 'isActive') != 0 ? $XP(eventType, 'type', '') : 'disable',
						label : label
					});
					r.value = v;
					r.text = card;
					r.colspan = 1;
					r.rowspan = 1;
				}
				break;
			case "eventName":
				var eventWay = $XP(row, 'eventWay', ''),
					status = $XP(row, 'status', ''),
					settleStatus = $XP(row, 'settleStatus', ''),
					smsGate = $XP(row, 'smsGate', ''),
					SmsSendStatusTypes = Hualala.TypeDef.MCMDataSet.SmsSendStatus,
					SmsSettleStatusTypes = Hualala.TypeDef.MCMDataSet.SmsSettleStatus;
				if(eventWay==50){
					var statusLabel,settleStatusLabel,
						statusObject =_.find(SmsSendStatusTypes,function(SmsSendStatus){ return SmsSendStatus.value==status; });
						seetleObject =_.find(SmsSettleStatusTypes,function(SmsSettleStatus){ return SmsSettleStatus.value==settleStatus; });
					if(statusObject){
						statusLabel = statusObject.label;
					}else{
						statusLabel =SmsSendStatusTypes[3].label;
					}
					settleStatusLabel = seetleObject.label;
					//r.text = v+'<br/><br/>'+'结算状态：'+settleStatusLabel+'<br/>'+'发送状态：'+statusLabel;
					r.text = v+'<br/><br/>'+'发送状态：'+statusLabel+'<br/>'+'结算状态：'+settleStatusLabel;
				}else{
					r.value = v;
					r.text = v;
				}
				break;
			case "eventStartDate":
				r.value = v;
				var start = v, end = $XP(row, 'eventEndDate', '');
				var eventWay = $XP(row, 'eventWay', '');
				if(eventWay==50){
					start = (IX.isEmpty(start) || start == 0) ? '' : IX.Date.getDateByFormat(formatDateTimeValue(start), 'yyyy/MM/dd HH:mm');
					r.text = IX.isEmpty(start) || IX.isEmpty(end) ? '' : start
				}
				else{
					start = (IX.isEmpty(start) || start == 0) ? '' : IX.Date.getDateByFormat(formatDateTimeValue(start), 'yyyy/MM/dd');
					end = (IX.isEmpty(end) || end == 0) ? '' : IX.Date.getDateByFormat(formatDateTimeValue(end), 'yyyy/MM/dd');
					r.text = IX.isEmpty(start) || IX.isEmpty(end) ? '' : (start + '至' + end);
				}
				break;
			case "operator":
				// var userInfo = !IX.isEmpty(v) && IX.isString(v) ? JSON.parse(v) : {};
				r.value = $XP(operator, 'userID', '');
				r.text = $XP(operator, 'userName', '') + '<br/>' + $XP(operator, 'userMobile', '');
				break;
			case "isActive":
				var eventID = $XP(row, 'eventID', ''),
					eventWay = $XP(row,'eventWay',''),
					status = $XP(row,'status','');
				r.value = v;
				if(eventWay==50){
					if(status==1){
						r.text = '<input type="checkbox" name="switch_event" data-event-id="' + eventID + '" ' 
						+ (v != 0 ? 'checked ' : '') + ' data-key="' + $XP(row, '__id__', '') + '" ' + ' />';
					} else{
						r.text = '<input type="checkbox" disabled  name="switch_event" data-event-id="' + eventID + '" ' 
						+ (v != 0 ? 'checked ' : '') + ' data-key="' + $XP(row, '__id__', '') + '" ' + ' />';
					}
				}
				else{
					r.text = '<input type="checkbox" name="switch_event" data-event-id="' + eventID + '" ' 
						+ (v != 0 ? 'checked ' : '') + ' data-key="' + $XP(row, '__id__', '') + '" ' + ' />';
				}
				break;
			case "rowControl":
				if (pageName == 'mcmGiftsMgr') {
					r = {
						type : 'button',
						rowspan : 2,
						colspan : 1,
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link edit-gift',
								id : $XP(row, 'giftItemID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link delete-gift',
								id : $XP(row, 'giftItemID', ''),
								key : $XP(row, '__id__'),
								type : 'delete'
							},
							{
								label : '使用详情',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link detail-gift',
								id : $XP(row, 'giftItemID', ''),
								key : $XP(row, '__id__'),
								type : 'detail'
							}
						]
					};
				}
				if (pageName == 'mcmEventMgr') {
					var isActive = $XP(row, 'isActive', 0);
					r = {
						type : 'button',
						rowspan : 1,
						colspan : 1,
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link edit-event ' + (isActive != 0 ? 'hidden' : ''),
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link delete-event ' + (isActive != 0 ? 'hidden' : ''),
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__'),
								type : 'delete'
							},
							{
								label : '查看',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link detail-event',
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__'),
								type : 'detail'
							},
							{
								label : '活动跟踪',
								link : 'javascript:void(0);',
								clz : 'btn-block btn-link track-event ' + (isActive != 0 ? '' : 'hidden'),
								id : $XP(row, 'eventID', ''),
								key : $XP(row, '__id__'),
								type : 'track'
							}
						]
					};
				}
				break; 
			default :
				r.value = r.text = $XP(row, colKey, '');
				break;
		}
		return r;
	};

	/**
	 * 格式化礼品列表渲染结果数据
	 * @param  {[Array|Object]} records 搜索结果数据
	 * @return {[Array|Object]}         格式化后的渲染数据
	 */
	HMCM.mapGiftsQueryResultRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		var clz = "col-md-12",
			tblClz = "  table-hover mcm-grid",
			tblHeaders = MCMGiftListHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var giftRules = $XP(row, 'giftRules', '');
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			if (pageName == 'mcmGiftsMgr') {
				var giftRule = {
					subRows : [{
						clz : 'gift-rule',
						cols : [{
							clz : '',
							colspan : 3,
							rowspan : 1,
							html : IX.isEmpty(giftRules) ? '' : '礼品规则：<br/>' + $XP(row, 'giftRules', '')
						}]
					}]
				};
				rowSet = IX.inherit(rowSet, giftRule);
			}
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

	/**
	 * 格式化活动列表渲染结果数据
	 * @param  {[type]} records [description]
	 * @return {[type]}         [description]
	 */
	HMCM.mapEventsQueryResultRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		var clz = "col-md-12",
			tblClz = "  table-hover mcm-grid",
			tblHeaders = MCMEventListHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			var rowSet = {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
			return rowSet;
		});
		var tfoot = [{
			clz : 'hidden',
			cols : []
		}];
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};

	/**
	 * 为礼品列表搜索结果数据表绑定事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleGiftsQueryResultEvent = function () {
		var self = this;
		self.$result.on('click', '.btn-link', function (e) {
			var $btn = $(this),
				act = $btn.attr('data-type'),
				giftItemID = $btn.attr('data-id'),
				id = $btn.attr('data-key');
			var giftModel = self.model.getRecordModelByID(id);
			switch (act) {
				case 'edit':
				// TODO edit gift set
					var wizardPanel = new Hualala.MCM.MCMWizardModal({
						wizardType : 'edit',
						parentView : self,
						mode : 'edit',
						successFn : function () {

						},
						failFn : function () {

						},
						model : giftModel,
						modalClz : 'mcm-gift-modal',
						wizardClz : 'mcm-gift-wizard',
						modalTitle : '编辑礼品',
						onWizardInit : function ($cnt, cntID, wizardMode) {
							HMCM.initGiftBaseInfoStep.call(this, $cnt, cntID, wizardMode);
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
					break;
				case 'delete':
				// TODO delete gift set
					Hualala.UI.Confirm({
						title : '删除礼品',
						msg : '是否要删除该礼品？',
						okLabel : '删除',
						okFn : function () {
							self.emit('deleteItem', {
								id : id,
								key : giftItemID,
								successFn : function (res) {
									toptip({
										msg : '删除成功',
										type : 'success'
									});
									var $tr = $btn.parents('tr'),
										$ruleRow = $tr.next('.gift-rule');
									$tr.remove();
									$ruleRow.remove();
								},
								faildFn : function (res) {
									toptip({
										msg : $XP(res, 'resultmsg', ''),
										type : 'danger'
									});
								}
							});
						}
					});
					
					break;
				case 'detail':
				// TODO preview gift detail
					var path = Hualala.PageRoute.createPath('mcmGiftDetail', [giftItemID]);
					// Hualala.PageRoute.jumpPage(path);
					window.open(document.location.protocol + '//' + document.location.host + '/' + path);
					break;
			}
		});
		self.$result.on('mouseover', 'tr.gift-rule', function (e) {
			var $row = $(this);
			$row.prev('tr').addClass('hover');
		}).on('mouseout', 'tr.gift-rule', function (e) {
			var $row = $(this);
			$row.prev('tr').removeClass('hover');
		});
	};

	/**
	 * 为活动列表搜索结果数据表绑定事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleEventsQueryResultEvent = function () {
		var self = this;
		self.$result.on('click', '.btn-link', function (e) {
			var $btn = $(this),
				act = $btn.attr('data-type'),
				eventID = $btn.attr('data-id'),
				id = $btn.attr('data-key');
			var eventModel = self.model.getRecordModelByID(id),
				eventWay = eventModel.getAll().eventWay;
			var eventType=_.find(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {
					return $XP(el, 'value')==eventWay;
			});
			switch(act) {
				case 'edit' :
				// TODO edit event config set
                    var wizardStepChangeMap = {
                            '50': Hualala.MCM.SMSOnStepChange,
                            '51': Hualala.MCM.BirthdayEventStepChange
                        },
                        wizardStepsCfg = HMCM.EventWizardCfgBy(eventWay),
						stepChange = wizardStepChangeMap[eventWay + ''] || HMCM.onEventWizardStepChange;
					var wizardPanel = new Hualala.MCM.MCMWizardModal({
						wizardType : 'edit',
						parentView : self,
						mode : 'edit',
						successFn : function () {

						},
						failFn : function () {

						},
						model : eventModel,
						modalClz : 'mcm-event-modal',
						wizardClz : 'mcm-event-wizard',
						modalTitle : '修改'+eventType.label + '活动',
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
						wizardStepsCfg : wizardStepsCfg,
						wizardCtrls : Hualala.MCM.WizardCtrls
					});
					break;
				case 'delete' :
				// delete event
					Hualala.UI.Confirm({
						title : '删除活动',
						msg : '是否要删除该活动？',
						okLabel : '删除',
						okFn : function () {
							self.emit('deleteItem', {
								id : id,
								key : eventID,
								successFn : function (res) {
									toptip({
										msg : '删除成功',
										type : 'success'
									});
									var $tr = $btn.parents('tr');
									$tr.remove();
								},
								faildFn : function (res) {
									toptip({
										msg : $XP(res, 'resultmsg', ''),
										type : 'danger'
									});
								}
							});
						}
					});
					break;
				case 'detail' :
				// TODO show event detail 
					initEventDetailModal.call(self, $btn);
					break;
				case 'track':
				// TODO track event info
					var path = Hualala.PageRoute.createPath('mcmEventTrack', [eventID]);
					// Hualala.PageRoute.jumpPage(path);
					window.open(document.location.protocol + '//' + document.location.host + '/' + path);
					break;
			}
		});
	};


	/**
	 * 渲染搜索结果方法
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	HMCM.renderQueryResult = function (data) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		self.$result.empty();
		self.$result.html(self.get('resultTpl')(data));
		if (pageName == 'mcmEventMgr') {
			var $checkbox = self.$result.find(':checkbox[name=switch_event]');
			initEventSwitcher.call(self, $checkbox);
		}

        if (pageName == 'mcmEventTrack') {
            var $checkbox = self.$result.find(':checkbox[name=switch_win_status]');
            initWinSwitcher.call(self, $checkbox);
        }
	};

	/**
	 * 切换活动卡片状态
	 * @param  {[jQueryObj]}  $chkbox  开关
	 * @param  {Boolean} isActive 开关状态
	 * @return {[type]}           [description]
	 */
	var switchEventCardLayout = function ($chkbox, isActive) {
		var self = this;
		var key = $chkbox.attr('data-key');
		var itemModel = self.model.getRecordModelByID(key);
		var clz = itemModel.getEventCardClz();
		var $tr = $chkbox.parents('tr'),
			$col = $tr.find('.eventWay');
		$col.find('.event-card').removeClass(isActive != 0 ? 'disable' : clz).addClass(isActive != 0 ? clz : 'disable');
	};

	/**
	 * 切换活动列表控制按钮列状态
	 * @param  {[jQueryOBj]}  $chkbox  开关
	 * @param  {Boolean} isActive 开关状态
	 * @return {[type]}           [description]
	 */
	var switchEventCtrlRow = function ($chkbox, isActive) {
		var self = this;
		var $tr = $chkbox.parents('tr'),
			$col = $tr.find('.ctrlrow');
		$col.find('.edit-event, .delete-event')[isActive == 0 ? 'removeClass' : 'addClass']('hidden');
		$col.find('.track-event')[isActive == 0 ? 'addClass' : 'removeClass']('hidden');
	};

	/**
	 * 组装活动详渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventDetailRenderData = function (model) {
		var self = this;
		var eventWay = model.get('eventWay'),
			smsGate = model.get('smsGate');
		var cardLevels = Hualala.TypeDef.MCMDataSet.EventCardLevels;
		var cardLevels1 = _.filter(model.CardLevelIDSet, function (el) {
			return $XP(el, 'isActive') == 1;
		});
		cardLevels1 = _.map(cardLevels1, function (el) {
			return {
				value : $XP(el, 'cardLevelID'),
				label : $XP(el, 'cardLevelName', '')
			};
		});
		cardLevels = cardLevels.concat(cardLevels1);
		var mapCardData = function () {
			var eventCardSet = model.getEventCardSet();
			var eventCardClz = model.get('isActive') == 1 ? model.getEventCardClz() : 'disable';
			return {
				card : {
					clz : eventCardClz,
					label : $XP(eventCardSet, 'label', '')
				}
			};
		};
		var mapBaseInfoData = function () {
			var keys = 'eventName,cardLevelLabel,eventRemark,deductPoints,sendPoints,eventRules,viewCount,userCount,smsCustomerShopName,lastTransShopName,smsTemplate,smsPersonNum,smsCount'.split(',');
			var ret = {};
			_.each(keys, function (k) {
				switch (k) {
					case 'cardLevelLabel':
						ret[k] = _.find(cardLevels, function (el) {
							return $XP(el, 'value') == model.get('cardLevelID');
						});
						ret[k] = $XP(ret[k], 'label');
						break;
					case 'deductPoints':
					case 'sendPoints':
						ret[k] = parseInt(model.get(k));
						break;
					default :
						ret[k] = model.get(k);
						break;
				}
			});
			if (eventWay == 22) {
				// 报名活动，列出参与人数
				var winCount = model.get('registerEventPartinPersion') || 0,
					maxPartInPerson = model.get('maxPartInPerson') || 0,
					surplusCount = parseInt(maxPartInPerson) - parseInt(winCount);
				ret = IX.inherit(ret, {
					'isApplyEvent' : true,
					'winCount' : parseInt(model.get('registerEventPartinPersion') || 0),
					'surplusCount' : surplusCount
				});
			} else if(eventWay == 50){
				ret = IX.inherit(ret, {
					'isSmsEvent' : true,
					'smsPersonNum' : parseInt(model.get('smsPersonNum') || 0),
					'smsCount' : parseInt(model.get('smsCount') || 0)
				});
			}
			var smsSendTime = model.get('startTime') || 0,
				startTimeLabel = '';
			if(eventWay == 50 || smsGate == 1) {
                startTimeLabel = eventWay == 51 ? (model.get('giftAdvanceDays') || 0) + '天' : ((IX.isEmpty(smsSendTime) || smsSendTime == 0) ? '任意时间' :
                    IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(smsSendTime), 'yyyy/MM/dd HH:mm'));
			}
            var data = model.getAll(),
                lastTransTimeFilter = $XP(data, 'lastTransTimeFilter', '0') || '0',
                lastTransTimeFilterLabel = $XP(_.findWhere(Hualala.TypeDef.MCMDataSet.TransTimeFilter, {value: lastTransTimeFilter + ''}), 'name', '不限'),
                lastTransTime = $XP(data, 'lastTransTime', '') || '',
                lastTransTimeFormat = IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(lastTransTime), 'yyyy/MM/dd');

			return IX.inherit(ret, {
				customerRange: eventWay == 50 ? '顾客范围' : '会员等级最低要求',
				infoLabelClz : 'col-xs-3 col-sm-3',
				infoTextClz : 'col-xs-8 col-sm-8',
                smsStartLabel: eventWay == 51 ? '提前返券天数' : '短信开始发送时间',
				startTimeLabel: startTimeLabel,
                hiddenShop: eventWay == 50 ? '' : 'hidden',
                lastTransTime: lastTransTimeFilterLabel + (lastTransTimeFilter == 0 ? '' : ' ' + lastTransTimeFormat),
                smsAlert: eventWay == 50 ? '短信活动一旦开始不得停止' : ''
			});
		};
		var mapGiftsData = function () {
			var giftKeys = 'EGiftID,EGiftName,EGiftOdds,EGiftSendCount,EGiftSingleCount,EGiftTotalCount,EGiftEffectTimeHours,EGfitValidUntilDayCount'.split(',');
			var mainKey = 'EGiftID';
			var giftLevelCount = 0;
			var data = model.getAll();
			var gifts = [];
			_.each(data, function (v, k) {
				if (k.indexOf(mainKey) == 0) {
					giftLevelCount++;
				}
			});
            var giftLevelNames = eventWay == 20 ? HMCM.GiftLevelNames : HMCM.GiftNames;
			for (var i = 1; i <= giftLevelCount; i++) {
				var gift = {};
				var vals = _.map(giftKeys, function (_k) {
					var v = model.get(_k + '_' + i);
					switch(_k) {
						case 'EGiftOdds' :
							v = parseFloat(v);
							break;
						case 'EGiftSendCount':
						case 'EGiftTotalCount':
							v = IX.isEmpty(v) ? 0 : parseFloat(v);
							break;
						case 'EGfitValidUntilDayCount':
							v = parseFloat(v)==0 ?"无限制":parseFloat(v);
							break;
						default :
							break;
					}
					return v;
				});
				var r = _.object(giftKeys, vals);
				r = IX.inherit(r, {
					level : giftLevelNames[i],
					surplusCount : parseInt($XP(r, 'EGiftTotalCount', 0)) - parseInt($XP(r, 'EGiftSendCount', 0))
				});
				gifts.push(r);
			}
			gifts = _.filter(gifts, function (el) {return $XP(el, mainKey) != 0;});
            var isDisplayGiftLevel = eventWay == 20 || eventWay == 40 || eventWay == 41;
			return {
				colCount : giftKeys.length,
				hideEGiftOdds : eventWay == 20 ? '' : 'hidden',
                hideEGiftLevel: isDisplayGiftLevel ? '' : 'hidden',
                EGiftLevelTh: eventWay == 20 ? '中奖等级' : '礼品',
                EGiftNameTh: eventWay == 20 ? '奖品名称' : '礼品名称',
                EGiftTotalCountTh: eventWay == 51 ? '礼品个数' : '总数',
                hideSurplusCount: eventWay == 51 ? 'hidden' : '',
				hideEGfitValidUntilDayCount : '',
				hiddenGift: (eventWay==50||eventWay==22) ? 'hidden' : '',
				hiddenSms: (eventWay==50 || eventWay == 51) ? '' :'hidden',
                hiddenCustomerRange: eventWay == 51 ? 'hidden' : '',
				hiddenEvtRules : (eventWay == 50 || eventWay == 51) ? 'hidden' :'',
				hiddenTitle : eventWay!=50 ? true : false,
				giftItems : gifts,
				hasGifts : gifts.length > 0 ? true : false,
                //暂时屏蔽短信发送情况 fixbug#6035
                isSmsEvent : false,
			};
		};
		return IX.inherit(mapBaseInfoData(), mapCardData(), mapGiftsData());
	};

	HMCM.mapEventDetailRenderData = mapEventDetailRenderData;

	/**
	 * 查看活动详情窗口
	 * @param  {[type]} $btn [description]
	 * @return {[type]}      [description]
	 */
	var initEventDetailModal = function ($btn) {
		var self = this;
		var eventID = $btn.attr('data-id'),
			key = $btn.attr('data-key');
		var itemModel = self.model.getRecordModelByID(key);
		var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_event_detail')),
			btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
		Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_event_card'));
		var modal = new Hualala.UI.ModalDialog({
			id : 'event_detail',
			clz : 'evtdetail-modal',
			title : '活动详情',
			afterRemove : function () {

			}
		});
		modal._.footer.html(btnTpl({
			btns : [
				{clz : 'btn-default', name : 'cancel', label : '关闭'}
			]
		}));
		modal._.footer.find('.btn-default').attr('data-dismiss', 'modal');

		var loadCardLevels = function () {
			itemModel.emit('loadCardLevelIDs', {
				successFn : function (res) {
					var renderData = mapEventDetailRenderData.call(self, itemModel);
					var $detail = $(layoutTpl(renderData));
					modal._.body.append($detail);
					modal.show();
				},
				faildFn : function (res) {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
					modal.hide();
				}
			});
		};
		itemModel.emit('update', {
			successFn : function (res) {
				loadCardLevels();
			},
			faildFn : function (res) {
				toptip({
					msg : $XP(res, 'resultmsg', ''),
					type : 'danger'
				});
			}
		});
	};

	var initEventSwitcher = function ($checkbox) {
		var self = this;
		$checkbox.each(function () {
			var $el = $(this),
				onLabel = '已启用',
				offLabel = '未启用';
			$el.bootstrapSwitch({
				size : 'normal',
				onColor : 'primary',
				offColor : 'default',
				onText : onLabel,
				offText : offLabel
			}).on('switchChange.bootstrapSwitch', function (e, state) {
				var $el = $(this);
				var eventID = $el.attr('data-event-id'),
					key = $el.attr('data-key');
				var actStr = (state == 1 ? "开启" : "关闭");
				Hualala.UI.Confirm({
					title : actStr + "活动",
					msg : "你确定要" + actStr + "此活动？",
					okFn : function () {
						self.emit('switchEvent', {
							eventID : eventID,
							isActive : +state,
							key : key,
							successFn : function (res) {
								toptip({
									msg : actStr + '活动成功',
									type : 'success'
								});
								switchEventCardLayout.call(self, $el, +state);
								switchEventCtrlRow.call(self, $el, +state);
							},
							faildFn : function (res) {
								$el.bootstrapSwitch('toggleState', true);
								toptip({
									msg : $XP(res, 'resultmsg', ''),
									type : 'danger'
								});
							}
						});
					},
					cancelFn : function () {
						$el.bootstrapSwitch('toggleState', true);
					}
				});

			});
		});
	};

    var initWinSwitcher = function ($checkbox) {
        var self = this;
        $checkbox.each(function () {
            var $el = $(this),
                onLabel = '已入围',
                offLabel = '未入围';
            $el.bootstrapSwitch({
                state: !!$el.data('status'),
                size : 'normal',
                onColor : 'primary',
                offColor : 'default',
                onText : onLabel,
                offText : offLabel
            }).on('switchChange.bootstrapSwitch', function (e, state) {
                var $el = $(this),
                    key = $el.attr('data-key'),
                    actStr = (state == 1 ? "入围" : "取消入围");
                Hualala.UI.Confirm({
                    title : "修改用户入围状态",
                    msg : "你确定要将用户" + actStr + "吗？",
                    okFn : function () {
                        self.model.get('ds_record').get(key).emit('switchWin', {
                            itemID : $(e.target).data('itemid'),
                            winFlag: state ? 1 : 0,
                            successFn : function (res) {
                                toptip({
                                    msg : '操作成功',
                                    type : 'success'
                                });
                                var $winCount = $('.mcm-detail-info small span').eq(2).find('strong'),
                                    $failCount = $('.mcm-detail-info small span').eq(3).find('strong'),
                                    winCount = parseInt($winCount.text()),
                                    failCount = parseInt($failCount.text());
                                $winCount.text(state ? (winCount + 1) : (winCount - 1));
                                $failCount.text(state ? (failCount - 1) : (failCount + 1));
                            },
                            faildFn : function (res) {
                                $el.bootstrapSwitch('toggleState', true);
                                toptip({
                                    msg : $XP(res, 'resultmsg', ''),
                                    type : 'danger'
                                });
                            }
                        });

                    },
                    cancelFn : function () {
                        $el.bootstrapSwitch('toggleState', true);
                    }
                });

            });
        });
    };

    var QueryResultView = Stapes.subclass({
		/**
		 * 构造礼品管理列表View层
		 * 
		 * 
		 * @param  {[Object]} cfg 
		 *         @param {Function} mapResultRenderData 格式化渲染数据
		 *         @param {Function} renderResult 渲染方法
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.$container = null;
			this.$resultBox = null;
			this.$result = null;
			this.$pager = null;
			this.set('mapResultRenderData', $XF(cfg, 'mapResultRenderData'));
			this.set('renderResult', $XF(cfg, 'renderResult'));
			this.set('bundleEvent', $XF(cfg, 'bundleEvent'));
			this.loadTemplate();
		}
	});

	QueryResultView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("Query Result View Init Faild!");
				return;
			}
			this.initLayout();
		},
		loadTemplate : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid')),
				giftCardTpl = Handlebars.compile(Hualala.TplLib.get('tpl_gift_card')),
				eventCardTpl = Handlebars.compile(Hualala.TplLib.get('tpl_event_card'));
			Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				resultTpl : resultTpl,
				giftCardTpl : giftCardTpl,
				eventCardTpl : eventCardTpl
			});
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$result = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
		},
		initPager : function (params) {
			var self = this;
			if (!self.model.hasPager) return;
			var baseCfg = {total : 0, page : 1, maxVisible : 10, leaps : true};
			this.$pager.IXPager(IX.inherit(baseCfg, params));
		},
		mapRenderData : function (records) {
			var mapFn = this.get('mapResultRenderData');
			var ret = IX.isFn(mapFn) ? mapFn.apply(this, arguments) : null;
			return ret;
		},
		renderRecords : function (data) {
			var renderFn = this.get('renderResult');
			IX.isFn(renderFn) && renderFn.apply(this, arguments);
		},
		render : function () {
			var self = this,
				model = self.model,
				hasPager = model.hasPager,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo', 1);
			var records = model.getRecordsByPageNo(pageNo);
			var renderData = self.mapRenderData(records);
			self.renderRecords(renderData);
			hasPager && self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		},
		bindEvent : function () {
			var self = this;
			var bundleEvent = this.get('bundleEvent');
			IX.isFn(bundleEvent) && bundleEvent.apply(this, arguments);
			self.model.hasPager && self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
		}
	});

	HMCM.QueryResultView = QueryResultView;
})(jQuery, window);