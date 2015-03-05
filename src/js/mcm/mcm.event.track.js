(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var BaseEventTrackModel = Stapes.subclass({
		constructor : function (data) {
			this.set(data);
			this.bindEvent();
		}
	});
	BaseEventTrackModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({

			}, self);
		}
	});

	HMCM.BaseEventTrackModel = BaseEventTrackModel;

	var MCMQueryEventTrackBaseHeaderCfg = [
		{key : "customerName", clz : "text", label : "姓名"},
		{key : "customerSex", clz : "text", label : "性别"},
		{key : "cardNO", clz : "number", label : "卡号"},
		{key : "customerMobile", clz : "text", label : "手机号"},
		{key : "cardLevelName", clz : "text", label : "等级"},
		{key : "consumptionTotal", clz : "number", label : "消费累计"},
		{key : "consumptionCount", clz : "number", label : "消费次数"},
		{key : "createTime", clz : "date", label : "参与时间"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey, eventWay) {
		var self = this;
		var r = {value : '', text : ''}, v = $XP(row, colKey, '');
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		var HCMath = Hualala.Common.Math;
		var mapWinLevel = function (winLevel) {
			var n = winLevel.split('_')[1];
			return HMCM.GiftLevelNames[n];
		};
		switch(colKey) {
			case "createTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "customerSex":
				r.value = v;
				r.text = $XP(Hualala.Common.getGender(v), 'label', '');
				break;
			case "consumptionTotal":
				r.value = v;
				r.text = HCMath.prettyNumeric(HCMath.standardPrice(v));
				break;
			case "winFlag":
				var opts = Hualala.TypeDef.MCMDataSet.JoinTypes;
				if (eventWay == 20) {
					r.value = v;
					r.text = v == 0 ? '未中奖' : mapWinLevel(v);
				} else {
					v = _.find(opts, function (el) {
						return $XP(el, 'value') == v;
					});
					r.value = $XP(v, 'value');
					r.text = IX.isEmpty(v.value) ? '' : $XP(v, 'label');
				}
				break;
			default:
				r.value = r.text = v;
				break;
		}
		return r;
	};

	HMCM.mapEventTrackQueryResultRenderData = function (records) {
		var self = this;
		var clz = 'col-md-12',
			tblClz = ' table-bordered table-striped table-hover ix-data-report mcm-grid',
			tblHeaders = _.clone(MCMQueryEventTrackBaseHeaderCfg);
		var eventDetail = self.$container.data('eventDetail'),
			eventWay = $XP(eventDetail, 'eventWay');
		if (eventWay == 20) {
			tblHeaders.push({
				key : "winFlag", clz : "status", label : "中奖情况"
			});
		} else if (eventWay == 22) {
			tblHeaders.push({
				key : "winFlag", clz : "status", label : "是否入围"
			});
		}
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', ''), eventWay]);
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

	HMCM.bundleEventTrackQueryResultEvent = function () {

	};

	var getEventTypeSet = function (eventID) {
		var eventTypes = Hualala.TypeDef.MCMDataSet.EventTypes;
		return _.find(eventTypes, function (el) {
			return $XP(el, 'eventID') == eventID;
		});
	};
	HMCM.getEventTypeSet = getEventTypeSet;

	var EventTrackPage = Stapes.subclass({
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container');
			this.callServer = Hualala.Global.getMCMEventByID;
			this.pageCtx = Hualala.PageRoute.getPageContextByPath();
			this.$nav = null;
			this.breadCrumbs = null;
			this.loadTemplates();
			this.bindEvent();
			this.renderLayout();
		}
	});

	EventTrackPage.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_eventtrack_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				gridTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerPartial("baseinfo", Hualala.TplLib.get('tpl_event_detail'));
			Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_event_card'));
			Handlebars.registerPartial("grid", Hualala.TplLib.get('tpl_base_datagrid'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				gridTpl : gridTpl
			});
		},
		bindEvent : function () {
			this.on({
				getDetail : function (params) {
					var self = this;
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					self.callServer(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn.call(self, res);
						} else {
							faildFn.call(self, res);
						}
					});
				}
			}, this);
		},
		initBreadCrumb : function () {
			var self = this,
				$nav = self.$nav,
				parentNames = Hualala.PageRoute.getParentNamesByPath();
			self.breadCrumbs = new Hualala.UI.BreadCrumb({
				container : $nav,
				hideRoot : true,
				nodes : parentNames,
				clz : 'mcm-crumbs',
				clickFn : function () {
					var $this = $(this);
					document.location.href = $this.attr('data-href');
				},
				mapRenderData : function (data, hideRoot, clz) {
					var list = _.map(data, function (el, idx, l) {
						var label = $XP(el, 'label', ''),
							name = $XP(el, 'name', ''),
							path = Hualala.PageRoute.createPath(name, null);
						return {
							clz : 'crumb',
							label : label,
							path : path,
							name : name,
							isLastNode : (data.length - 1 == idx) ? true : false
						};
					});
					hideRoot === true && list.shift();
					list.shift();
					return {
						clz : clz,
						items : list
					};
				}
			});
		},
		mapLayoutRenderData : function () {
			var self = this;
			var renderData = HMCM.mapEventDetailRenderData(self.eventModel);
			return IX.inherit(renderData, {
				evtBaseClz : 'col-sm-12 col-md-6',
				evtRulesClz : 'col-sm-12 col-md-6',
				evtGiftsClz : 'col-sm-12 col-md-12'
			})
		},
		renderLayout : function () {
			var self = this;
			var eventID = $XP(self.pageCtx, 'params')[0];
			var renderFn = function () {
				var layoutTpl = self.get('layoutTpl'),
					renderData = self.mapLayoutRenderData();
				var htm = layoutTpl(renderData);
				self.container.html(htm);
				self.$nav = self.container.find('.detail-layout > .nav-bar');
				self.$eventTrack = self.container.find('.event-track');
				self.$eventTrack.data('eventDetail', self.eventModel.getAll());
				self.initBreadCrumb();
				self.initEventTrackData();
			};
			self.emit('getDetail', {
				post : {eventID : eventID},
				successFn : function (res) {
					var _data = $XP(res, 'data.records', [])[0];
					self.eventModel = new HMCM.BaseEventModel(_data);
					self.eventModel.emit('loadCardLevelIDs', {
						successFn : function (res) {
							renderFn();
						},
						faildFn : function (res) {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							renderFn();
						}
					});
				},
				faildFn : function (res) {

				}
			});
		},
		initEventTrackData : function () {
			var self = this;
			var queryKeys = Hualala.MCM.QueryFormKeys.EventTrackBaseQueryKeys;
			var eventDetail = self.$eventTrack.data('eventDetail'),
				eventWay = $XP(eventDetail, 'eventWay');
			if (eventWay == '20' || eventWay == '22') {
				queryKeys.push('winFlag');
			}
			var panel = new HMCM.QueryController({
				container : self.$eventTrack,
				resultController : new HMCM.QueryResultControler({
					container : self.$eventTrack,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.getMCMEventTrack,
						queryKeys : queryKeys,
						gridType : 'eventtrack',
						recordModel : HMCM.BaseEventTrackModel
					}),
					view : new HMCM.QueryResultView({
						mapResultRenderData : HMCM.mapEventTrackQueryResultRenderData,
						renderResult : HMCM.renderQueryResult,
						bundleEvent : HMCM.bundleEventTrackQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : queryKeys
				}),
				view : new HMCM.QueryView({
					// mapRenderDataFn : HMCM.mapGiftDetailGetWayQueryFormRenderData,
					mapRenderDataFn : HMCM.mapEventTrackQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent
				})

			});
		}
	});

	HMCM.EventTrackPage = EventTrackPage;
})(jQuery, window);