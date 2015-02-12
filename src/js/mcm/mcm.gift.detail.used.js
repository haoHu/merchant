(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;
	var BaseGiftUsedModel = Stapes.subclass({
		constructor : function (data) {
			this.set(data);
			this.bindEvent();
		}
	});

	BaseGiftUsedModel.proto({
		bindEvent : function () {
			var self = this;
			self.on({

			}, self);
		}
	});

	HMCM.BaseGiftUsedModel = BaseGiftUsedModel;

	var MCMQueryGiftUsedHeaderCfg = [
		{key : "getWay", clz : "text", label : "获得方式"},
		{key : "createTime", clz : "date", label : "获得时间"},
		{key : "validUntilDate", clz : "date", label : "使用时间"},
		{key : "giftStatus", clz : "text", label : "使用店铺"},
		{key : "userName", clz : "text", label : "姓名"},
		{key : "userSex", clz : "text", label : "性别"},
		{key : "userMobile", clz : "text", label : "手机号"}
	];

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var r = {value : '', text : ''}, v = $XP(row, colKey, '');
		var userInfo = $XP(row, 'userInfo', {});
		var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
		switch(colKey) {
			case "getWay":
				v = HMCM.getGiftGetWayTypeSet(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');

				break;
			case "createTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "validUntilDate":
				r.value = v;
				r.text = IX.Date.getDateByFormat(formatDateTimeValue(v), 'yyyy/MM/dd');
				break;
			case "giftStatus":
				v = HMCM.getGiftStatusTypeSet(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "userName":
				r.value = r.text = $XP(userInfo, 'userName', '');
				break;
			case "userSex":
				v = _.find(Hualala.TypeDef.GENDER, function (el) {
					return $XP(el, 'value') == $XP(userInfo, 'userSex', '');
				});
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "userMobile":
				r.value = r.text = $XP(userInfo, 'userMobile', '');
				break;
		}
		return r;
	};

	/**
	 * 格式化礼品发送统计列表数据
	 * @param  {[type]} records [description]
	 * @return {[type]}         [description]
	 */
	HMCM.mapGiftDetailQueryUsedRenderData = function (records) {
		var self = this;
		var clz = 'col-md-12',
			tblClz = ' table-hover mcm-grid',
			tblHeaders = MCMQueryGiftUsedHeaderCfg;
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

})(jQuery, window);