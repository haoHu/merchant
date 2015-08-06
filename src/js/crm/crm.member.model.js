(function ($, window) {
	IX.ns("Hualala.CRM");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	/*图标相关配置信息*/
	var BaseChartTitle = {
		text : '', subtext : '', x : 'center', y : 'top', textAlign : 'center'
	};
	var BaseChartTooltip = {
		trigger : 'item',
		formatter : "{a} <br/>{b} : {c} (约{d}%)"
	};
	var BaseChartToolBox = {
		show : true,
		feature : {
			mark : {show : false},
			dataView : {show : false, readOnly : true},
			restore : {show : true},
			saveAsImage : {show : true}
		}
	};
	var BaseChartLegend = {
		orient : 'vertical',
		x : 'left',
		y : '50px',
		data : null
	};

	var MemberSchemaChartConfigs = [
		{id : "member_level_chart", clz : "col-xs-12 col-sm-6 ", chartClz : "ix-chart-canvas", label : "会员等级占比图"},
		{id : "member_gender_chart", clz : "col-xs-12 col-sm-6 ", chartClz : "ix-chart-canvas", label : "会员性别占比图"},
		{id : "member_source_chart", clz : "col-xs-12 col-sm-12 ", chartClz : "ix-chart-canvas", label : "会员来源占比图"}
	];
	Hualala.CRM.BaseChartTitle = BaseChartTitle;
	Hualala.CRM.BaseChartTooltip = BaseChartTooltip;
	Hualala.CRM.BaseChartToolBox = BaseChartToolBox;
	Hualala.CRM.BaseChartLegend = BaseChartLegend;
	Hualala.CRM.MemberSchemaChartConfigs = MemberSchemaChartConfigs;

	var MemberSchemaTableHeaderConfigs = [
		{
			clz : '',
			cols : [
				{clz : '', label : '会员等级', colspan : '', rowspan : '2'},
				{clz : '', label : '会员数', colspan : '', rowspan : '2'},
				{clz : '', label : '所占比率', colspan : '', rowspan : '2'},
				{clz : '', label : '性别比率', colspan : '3', rowspan : ''},
				{clz : '', label : '来源比率', colspan : '2', rowspan : ''},
				{clz : '', label : '现金卡值', colspan : '', rowspan : '2'},
				{clz : '', label : '赠送卡值', colspan : '', rowspan : '2'},
				{clz : '', label : '积分余额', colspan : '', rowspan : '2'},
				{clz : '', label : '客单价<br/>(平均每单消费金额)', colspan : '', rowspan : '2'}
			]
		},
		{
			clz : '',
			cols : [
				{clz : '', label : '男', colspan : '', rowspan : ''},
				{clz : '', label : '女', colspan : '', rowspan : ''},
				{clz : '', label : '未知', colspan : '', rowspan : ''},
				{clz : '', label : '线上', colspan : '', rowspan : ''},
				{clz : '', label : '线下', colspan : '', rowspan : ''}
			]
		}
	];
	Hualala.CRM.MemberSchemaTableHeaderConfigs = MemberSchemaTableHeaderConfigs;

	var MemberSchemaModel = Stapes.subclass({
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', Hualala.Global.queryCrmMemberSchema);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
		}
	});
	MemberSchemaModel.proto({
		init : function (params) {
			this.set({
				ds_member : new IX.IListManager(),
				memberSummarize : null
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.callServer(params, function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn.apply(self);
			});
		},
		updateDataStore : function (data) {
			var self = this,
				memberHT = self.get('ds_member');
			var summarize = $XP(data, 'datasets.cardOverViewSummerrizingDs.data.records', []),
				members = $XP(data, 'records', []);
			_.each(members, function (m) {
				var cardLevelName = $XP(m, 'cardLevelName');
				memberHT.register(cardLevelName, m);
			});
			self.set('memberSummarize', summarize);
		},
		getMemberByLevelNames : function (names) {
			var self = this,
				memberHT = self.get('ds_member');
			names = IX.isString(names) ? [names] : names;
			if (IX.isEmpty(names)) {
				return memberHT.getAll();
			}
			return memberHT.getByKeys(names);
		},
		getLevelChartData : function () {
			var self = this,
				members = self.getMemberByLevelNames();
			return _.map(members, function (m) {
				return {
					name : $XP(m, 'cardLevelName', ''),
					value : parseInt($XP(m, 'cardCount', 0))
				};
			});
		},
		getGenderChartData : function () {
			var self = this,
				summary = self.get('memberSummarize')[0] || {};
			var genders = _.map(Hualala.TypeDef.GENDER, function (el) {
				var v = parseInt($XP(el, 'value', 0)), name = null, value = null;
				switch (v) {
					case 0:
						name = "女";
						value = parseInt($XP(summary, 'sexFemaleCount', 0));
						break;
					case 1:
						name = "男";
						value = parseInt($XP(summary, 'sexMaleCount', 0));
						break;
					case 2:
						name = "未知"
						value = parseInt($XP(summary, 'sexUnknownCount', 0));
						break;
				}
				return {
					name : name,
					value : value
				};
			});
			return genders;
		},
		getSourceChartData : function () {
			var self = this,
				summary = self.get('memberSummarize')[0] || {};
			var sources = [{key : "onLineCount", name : "线上"}, {key : "inShopCount", name : "线下"}];
			return _.map(sources, function (o) {
				return {
					name : $XP(o, 'name', ''),
					value : parseInt($XP(summary, $XP(o, 'key'), 0))
				};
			});
		}
	});
	Hualala.CRM.MemberSchemaModel = MemberSchemaModel;

})(jQuery, window);