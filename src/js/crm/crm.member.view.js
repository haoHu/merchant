(function ($, window) {
	IX.ns("Hualala.CRM");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	
	var MemberSchemaView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			this.$well =null;
			// 数据表容器
			this.$tableBox = null;
			// 图标容器
			this.$chartBox = null;
			
			this.$emptyBar = null;
			this.chartsCfg = Hualala.CRM.MemberSchemaChartConfigs;
			this.loadingModal = new LoadingModal({start : 100});
			this.loadTemplates();
		}
	});
	MemberSchemaView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("CRM Member Schema View Init Failed!");
				return;
			}
			this.initLayout();
		},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_schema_layout')),
				tableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_cmpx_datagrid'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			this.set({
				layoutTpl : layoutTpl,
				tableTpl : tableTpl
			});
		},
		initLayout : function () {
			var self = this, layoutTpl = self.get('layoutTpl');
			self.$container.html(layoutTpl({charts : self.chartsCfg}));
			self.$well = self.$container.find('.well');
			self.$tableBox = self.$container.find('.crm-schema-table');
			self.$chartBox = self.$container.find('.crm-schema-chart');
		},
		mapTableRenderData : function () {
			var self = this, memberData = self.model.getMemberByLevelNames(),
				summary = self.model.get('memberSummarize'),
				tableHeader = Hualala.CRM.MemberSchemaTableHeaderConfigs,
				colNames = "cardLevelName,cardCount,levelCardCountRate,sexMaleRate,sexFemaleRate,sexUnknownRate,onLineRate,inShopRate," +
                    "moneyBalanceSum,giveBalanceSum,pointBalanceSum,consumptionPerOrder";
			var math = Hualala.Common.Math;
			var mapColData = function (member) {
				var cols = _.map(colNames.split(','), function (k) {
					var v = $XP(member, k, ''),
						text = '', title = '', clz = '';
					var mapCardLevelTip = function (m) {
						var cardLevelName = $XP(m, 'cardLevelName'),
							// 0:不享受会员价，1：享受会员价
							isVipPrice = $XP(m, 'isVipPrice', 0) == 0 ? false : true,
							discountRate = $XP(m, 'discountRate', 1) == 1 ? "不打折" : ('打' + math.multi($XP(m, 'discountRate', 1), 10) + '折'),
							// 0：部分菜品打折，1：全部菜品打折
							discountRange = $XP(m, 'discountRange', 0) == 0 ? "(部分不打折)，" : "",
							// 折扣描述
							discountDescription = $XP(m, 'discountDescription', ''),
							switchLevelUpPoint = $XP(m, 'switchLevelUpPoint', null);
						var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_card_level_info'));
						return tpl({
							cardLevelName : cardLevelName,
							isVipPrice : isVipPrice,
							discountRate : discountRate,
							discountRange : discountRange,
							discountDescription : IX.isEmpty(discountDescription) ? '' : (discountDescription + '，'),
							switchLevelUpPoint : switchLevelUpPoint
						});
					};
					switch (k) {
						case 'cardCount':
							text = parseInt(v);
							clz = 'number';
							break;
						case 'levelCardCountRate':
						case 'sexMaleRate':
						case 'sexFemaleRate':
						case 'sexUnknownRate':
						case 'onLineRate':
						case 'inShopRate':
							text = v + '%';
							clz = 'number';
							break;
						case 'moneyBalanceSum':
						case 'pointBalanceSum':
						case 'consumptionPerOrder':
							text = math.prettyNumeric(math.standardPrice(v));
							clz = 'number';
							break;
						default : 
							text = v;
							clz = 'text';
					}
					return {
						clz : clz,
						type : 'text',
						value : v,
						text : text,
						title : k == "cardLevelName" ? mapCardLevelTip(member) : ''
					};
				});
				return cols;
			};
			var rows = _.map(memberData, function (m) {
				return {
					clz : '',
					cols : mapColData(m)
				}
			});
			var tfoot = _.map(summary, function (r) {
				var cols = mapColData(r);
				cols.shift();
				cols.unshift({
					clz : 'title',
					value : '',
					text : '总计：'
				});
				return {
					clz : '',
					cols : cols
				}
			});
			return {
				tblClz : 'table table-bordered table-striped table-hover ix-data-report',
				thead : tableHeader,
				rows : rows,
				tfoot : tfoot
			}
		},
		render : function () {
			var self = this,
				model = self.model;
			var tableRenderData = self.mapTableRenderData();

			var tblTpl = self.get('tableTpl'),
				html = tblTpl(tableRenderData);
			self.$tableBox.html(html);
			self.bindEvent();
			IX.Net.loadJsFiles([Hualala.Global.ECHART_PATH], function () {
				self.emit('loaded');
				_.map(Hualala.CRM.MemberSchemaChartConfigs, function (el) {
					var id = $XP(el, 'id'), $box = $('#' + id);
					$box.css({height : '500px'});
					var oChart = echarts.init($box[0]);
					$box.data('oChart', oChart);
					oChart.showLoading({
						text : "加载中...",
						x : 'center',
						y : 'center',
						effect : 'spin'
					});
				});
				self.renderChart();
			});
			
			
		},
		renderChart : function () {
			var self = this, model = self.model;
			var cfgs = Hualala.CRM.MemberSchemaChartConfigs,
				legendCfg = Hualala.CRM.BaseChartLegend,
				toolboxCfg = Hualala.CRM.BaseChartToolBox,
				tooltipCfg = Hualala.CRM.BaseChartTooltip,
				titleCfg = Hualala.CRM.BaseChartTitle,
				tipTitle = '';
			var chartOptions = _.map(cfgs, function (cfg) {
				var id = $XP(cfg, 'id'), title = $XP(cfg, 'label');
				var opt = {}, levels = null;
					title = IX.inherit(titleCfg, {text : title}),
					series = null, legend = null;
				switch (id) {
					case "member_level_chart":
						tipTitle = "会员等级";
						series = self.model.getLevelChartData();
						levels = _.map(self.model.getMemberByLevelNames(), function (m) {
							return $XP(m, 'cardLevelName', '');
						});
						legend = IX.inherit(legendCfg, {data : levels});
						break;
					case "member_gender_chart":
						tipTitle = "会员性别";
						series = self.model.getGenderChartData();
						legend = IX.inherit(legendCfg, {data : ['男', '女', '未知']});
						break;
					case "member_source_chart":
						tipTitle = "会员来源";
						series = self.model.getSourceChartData();
						legend = IX.inherit(legendCfg, {data : ['线上', '线下']});
						break;
				}
				opt = IX.inherit(opt, {
					title : title,
					tooltip : tooltipCfg,
					toolbox : toolboxCfg,
					legend : legend,
					calculable : false,
					series : [{
						name : tipTitle,
						type : 'pie',
						radius : '55%',
						center : ['50%', '52%'],
						data : series
					}]
				});
				return {
					id : id,
					option : opt
				};
			});
			_.each(chartOptions, function (el) {
				var id = $XP(el, 'id'), opt = $XP(el, 'option', {});
				var $chart = $('#' + id);
				var oChart = $chart.data('oChart');
				oChart.hideLoading();
				oChart.setOption(opt);
			});
		},
		hideLoadingModal : function () {
			this.loadingModal.hide();
		},
		showLoadingModal : function () {
			this.loadingModal.show();
		},
		bindEvent : function () {
			var self = this;
			self.$tableBox.tooltip({
				selector : 'p[title]'
			});
			self.$well.on('click', '.btn.btn-warning', function (e) {
				var serviceName,templateName,ExcelfilePath;
				var	group = $XP(Hualala.getSessionData(),'site',''),
					groupName = $XP(group,'groupName','');
					currentNav = Hualala.PageRoute.getPageContextByPath(),
					currentLabel = $XP(currentNav,'label',''),
					fileName =groupName+currentLabel+".xls";
					serviceName = "pay_crmCustomerCardOverViewService";
					templateName ="crmCustomerCardOverViewReport.xml";
				var params ={serviceName:serviceName,templateName:templateName,fileName:fileName};
					Hualala.Global.OrderExport(params, function (rsp) {
	                    if(rsp.resultcode != '000'){
	                        rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
	                        return;
	                    }
	                	ExcelfilePath =rsp.data.filePath || [];
						var dowloadhref=ExcelfilePath;
						window.open(dowloadhref); 
	                })
			});
		}
	});
	Hualala.CRM.MemberSchemaView = MemberSchemaView;
})(jQuery, window);