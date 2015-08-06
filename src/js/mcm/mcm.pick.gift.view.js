(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var MCMGiftListHeaderCfg = [
		{key : "giftItemID", clz : "hidden", label : ""},
		{key : "giftType", clz : "", label : "礼品类型"},
		{key : "giftName", clz : "text", label : "礼品名称"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
			queryKeys = self.model.queryKeys;
		var r = {value : "", text : ""}, v = $XP(row, colKey, '');
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			// 礼品列表各列参数
			// case "giftType":
			// 	var giftCardTpl = self.get('giftCardTpl'),
			// 		giftValue = $XP(row, 'giftValue', 0),
			// 		giftItemID = $XP(row, 'giftItemID', ''),
			// 		giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes,
			// 		giftType = _.find(giftTypes, function (el) {return $XP(el, 'value') == v;});

			// 	r.value = giftItemID;
			// 	r.text = $XP(giftType, 'label', '');
			// 	break;
			case "giftType":
				var giftTypes = Hualala.TypeDef.MCMDataSet.GiftTypes,
					giftType = _.find(giftTypes, function (el) {return $XP(el, 'value') == v;});
				r.value = v;
				r.text = $XP(giftType, 'label', '');
				break;
			default :
				r.value = r.text = $XP(row, colKey, '');
				break;
		}
		return r;
	};

	var mapGiftsQueryResultRenderData = function (records) {
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
	 * 渲染搜索结果方法
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	var renderPickGiftQueryResult = function (data) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name');
		self.$result.empty();
		self.$result.html(self.get('resultTpl')(data));
	};

	var initQueryFormEls = function () {
		var self = this,
			els = self.model.getQueryParams(),
            selectGiftType = self.model.getSelectGiftType();
		self.initGiftTypeComboOpts($XP(els, 'giftType', ''), selectGiftType);
	};

	/**
	 * 绑定事件
	 * @return {[type]} [description]
	 */
	var bundleGiftsQueryResultEvent = function () {
		var self = this;
		self.$result.on('dblclick', '.mcm-grid > tbody > tr', function (e) {
			var $tr = $(this);
			var $p = $tr.find('p[data-value]');
			$tr.addClass('selected');
		});
	};

	var PickGiftModal = Stapes.subclass({
		constructor : function (cfg) {
			this.trigger = $XP(cfg, 'trigger');
			this.selectedFn = $XF(cfg, 'selectedFn');
            this.selectGiftType = $XP(cfg, 'selectGiftType');
			this.modal = null;
			this.$body = null;
			this.panel = null;
			this.initModal();
			this.initPanel();
			this.bindEvent();
		}
	});
	PickGiftModal.proto({
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "mcm_pickgift_modal",
				clz : "mcm-pickgift-modal",
				title : "选择礼品、奖品",
				hideCloseBtn : false,
				backdrop : 'static',
				showFooter : false,
				afterHide : function () {

				}
			});
			self.$body = self.modal._.body;
			self.modal.show();
		},
		initPanel : function () {
			var self = this;
			this.panel = new HMCM.QueryController({
				container : self.$body,
				resultController : new HMCM.QueryResultControler({
					container : self.$body,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.getMCMGifts,
						queryKeys : Hualala.MCM.QueryFormKeys.GiftMgrQueryKeys,
						gridType : 'giftlist',
						recordModel : HMCM.BaseGiftModel
					}),
					view : new HMCM.QueryResultView({
						mapResultRenderData : mapGiftsQueryResultRenderData,
						renderResult : renderPickGiftQueryResult,
						bundleEvent : bundleGiftsQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : Hualala.MCM.QueryFormKeys.GiftMgrQueryKeys,
                    selectGiftTypes: self.selectGiftType
				}),
				view : new HMCM.QueryView({
					hasAddBtn : false,
					mapRenderDataFn : HMCM.mapGiftQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent,
					initQueryFormEls : initQueryFormEls
				})

			});
		},
		bindEvent : function () {
			var self = this;
			self.$body.on('dblclick', '.mcm-grid > tbody > tr', function (e){
				var $tr = $(this);
				var $p = $tr.find('p[data-value]');
				self.selectedFn({
					giftItemID : $p.eq(0).attr('data-value'),
					giftType : $p.eq(1).attr('data-value'),
					giftName : $p.eq(2).attr('data-value')
				}, self.trigger);
				self.modal.hide();
			});
		}
	});
	HMCM.PickGiftModal = PickGiftModal;
})(jQuery, window);