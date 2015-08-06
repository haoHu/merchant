(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;


	var OrderQueryTableHeaderCfg = [
		{key : "cityID", clz : "text", label : "城市"},
		{key : "shopName", clz : "text", label : "店铺名称"},
		{key : "orderID", clz : "number", label : "订单号"},
		{key : "userName", clz : "text", label : "客户姓名"},
		{key : "orderTime", clz : "date", label : "就餐时间"},
		{key : "orderStatus", clz : "status", label : "订单状态"},
		{key : "needPayAmount", clz : "number", label : "应付金额"},
		{key : "moneyBalance", clz : "number", label : "会员卡支付"},
		{key : "pointBalance", clz : "number", label : "会员卡积分支付"},
		{key : "shopRefundAmount", clz : "number", label : "退订/退款"},
		{key : "total", clz : "number", label : "应结金额"},
		{key : "shouldSettlementTotal", clz : "number", label : "结算金额"},
		{key : "rowControl", clz : "", label : "操作"}
	];
	var OrderQueryDuringTableHeaderCfg = [
		{key : "cityID", clz : "text", label : "城市"},
		{key : "billDate", clz : "date", label : "日期"},
		{key : "count", clz : "number", label : "订单数"},
		{key : "giftAmountTotal", clz : "number", label : "代金券总金额"},
		{key : "orderTotal", clz : "number", label : "订单支付金额"},
		{key : "orderWaitTotal", clz : "number", label : "待消费订单金额"},
		{key : "orderRegAmount", clz : "number", label : "退款金额"},
		{key : "orderRefundAmount", clz : "number", label : "退订金额"},
		{key : "total", clz : "number", label : "成交金额"},
		{key : "orderAmount", clz : "number", label : "线下金额"},
		{key : "rowControl", clz : "", label : "操作"}
	];

	var OrderQueryDishHotTableHeaderCfg = [
		{key : "index", clz : "number", label : "序号"},
		{key : "foodName", clz : "text", label : "菜品名称"},
		{key : "foodCategoryName", clz : "text", label : "分类名称"},
		{key : "sumAvgPrice", clz : "number", label : "平均价格"},
		{key : "sumMaster", clz : "number", label : "销售份数"},
		{key : "sumPrice", clz : "number", label : "销售总额"},
	];
	var OrderQueryDishHotCategoryTableHeaderCfg = [
		{key : "index", clz : "number", label : "序号"},
		{key : "foodCategoryName", clz : "text", label : "分类名称"},
		{key : "sumAvgPrice", clz : "number", label : "平均价格"},
		{key : "sumMaster", clz : "number", label : "销售份数"},
		{key : "sumPrice", clz : "number", label : "销售总额"},
	];

	var OrderQueryUserTableHeaderCfg = [
		{key : "userName", clz : "text", label : "姓名"},
		{key : "userSex", clz : "text", label : "性别"},
		{key : "userLoginMobile", clz : "text", label : "手机号"},
		{key : "sumRecord", clz : "number", label : "订餐次数"},
		{key : "foodAmount", clz : "number", label : "订餐金额"},
		{key : "minOrderTime", clz : "date", label : "首次订餐时间"},
		{key : "maxOrderTime", clz : "date", label : "最近订餐时间"}
	];

	var QueryOrderDuringStatisticKeys = 'count,giftAmountTotal,orderTotal,orderWaitTotal,orderRegAmount,orderRefundAmount,total,orderAmount';

	var mapColItemRenderData = function (row, rowIdx, colKey) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
			pagerParams = self.model.getPagerParams(), queryKeys = self.model.queryKeys;
		var r = {value : "", text : ""}, v = $XP(row, colKey, '');
		switch(colKey) {
			case "cityID":
				v = self.getCityByCityID(v);
				r.value = $XP(v, 'cityID', '');
				r.text = $XP(v, 'cityName', '');
				break;
			case "userName":
				var m = $XP(row, 'userMobile', ''),
					s = Hualala.Common.getGender($XP(row, 'userSex', ''));
				var _shortName = Hualala.Common.substrByte(v, 10) + '...';
				s = IX.isEmpty(s) ? '' : '(' + $XP(s, 'label', '') + ')';
				m = IX.isEmpty(m) ? '' : '(' + m + ')';
				r.value = $XP(row, 'userID', '');
				r.text = _shortName + s + m;
				break;
			case "orderTime":
			case "minOrderTime":
			case "maxOrderTime":
				r.value = v;
				r.text = IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy/MM/dd HH:mm');
				break;
			case "orderStatus":
				v = Hualala.Common.getOrderStatus(v);
				r.value = $XP(v, 'value', '');
				r.text = $XP(v, 'label', '');
				break;
			case "billDate":
				r.value = v;
				r.text = IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy/MM/dd');
				break;
			case "index" :
				r.value = rowIdx;
				r.text = rowIdx + 1;
				break;
			case "sumMaster":
				r.value = v;
				r.text = v + "&nbsp;" + $XP(row, 'foodUnit', '');
				break;
			case "sumAvgPrice":
				r.value = v || 0;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(Hualala.Common.Math.div($XP(row, 'sumPrice', ''), $XP(row, 'sumMaster', 1))));
				break;
			case "sumPrice":
				r.value = v || 0;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v));
				break;
			case "userSex":
				r.value = v;
				r.text = $XP(Hualala.Common.getGender($XP(row, 'userSex', '')), 'label', '');
				break;
			case "total" : 
			case "orderTotal":
			case "moneyBalance":
			case "pointBalance":
			case "orderRefundAmount":
			case "shouldSettlementTotal":
				r.value = v;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v));
				break;
			case "foodAmount" :
				r.value = v;
				r.text = Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v));
			case "rowControl" :
				if (pageName == 'orderQuery') {
					r = {
						type : 'button',
						btns : [
							{
								label : '查看详情', 
								link : 'javascript:void(0);', 
								clz : 'query-order-detail', 
								id : $XP(row, 'orderID', ''),
								key : $XP(row, 'orderKey', ''), 
								type : ''
							}
						]
					};
				} else if (pageName == 'orderQueryDay' || pageName == 'orderQueryDuring' ) {
					if(pageName == "orderQueryDuring") {
						pagerParams = IX.inherit(pagerParams, {
							shopID : $XP(row, 'shopID', '')
						});
					}
					else{
						pagerParams = IX.inherit(pagerParams, {
							cityID : $XP(row, 'cityID', ''),
							startDate : $XP(row, 'billDate', ''),
							endDate : $XP(row, 'billDate', '')
						});
					}
					var n = pageName == "orderQueryDuring" ? "orderQueryDay" : "orderQuery",
						params = _.map(queryKeys, function (k) {
							return $XP(pagerParams, k, '');
						}),
						link = '';
						if (n == 'orderQuery') {
							params = params.concat(['','','','','']);
						}
						link = Hualala.PageRoute.createPath(n, params);
					r = {
						type : 'button',
						btns : [
							{
								label : '查看详情', 
								link : link, 
								clz : '', 
								id : '', 
								type : ''
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
	 * 格式化需要渲染的结果数据
	 * @param {Array|Object} records 搜索结果数据 
	 * @return {Array|Obejct}	格式化后的渲染数据
	 */
	Hualala.Order.mapQueryOrderResultRenderData = function (records) {
		var self = this;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = OrderQueryTableHeaderCfg,
			statisticData = self.model.getStatisticData();
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return {key : $XP(el, 'key', ''), clz : $XP(el, 'clz', '')};
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});
		var statisticKeys = 'count,needPayAmount,shopRefundAmount,total,shouldSettlementTotal';
		var ftCols = _.map(statisticKeys.split(','), function (k) {
			var v = $XP(statisticData, k, 0), rowspan = 1, clz = '', 
				colspan = k == "needPayAmount" ? 3 : 1;
			if(k=="count"){
				return {
					clz : 'title', 
					colspan : '6', 
					rowspan : '1', 
					value : '', 
					text : '共计 '+v+' 个订单'
				};
			}
			else{
				return {
					clz : clz,
					colspan : colspan,
					rowspan : rowspan,
					text : Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v)),
					value : v
				};
			}
		});
		//去掉共计的字段，改为统计订单的数量
		// ftCols.unshift({
		// 	clz : 'title', colspan : '6', rowspan : '1', value : '', text : '共计：'
		// });
		ftCols.push({clz : '', colspan : '', rowspan : '', value : '', text : ''});
		var tfoot = [{
			clz : '',
			cols : ftCols
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
	 * 格式化需要渲染的结果数据（区间汇总，日汇总 ）
	 * @param  {[type]} records
	 * @return {[type]}
	 */
	Hualala.Order.mapQueryOrderDuringRenderData = function (records) {
		var self = this;
		var ctx = Hualala.PageRoute.getPageContextByPath();
		var pageName = $XP(ctx, 'name');
		var pagerParams = self.model.getPagerParams();
		var queryKeys = self.model.queryKeys;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = IX.clone(OrderQueryDuringTableHeaderCfg),
			statisticData = self.model.getStatisticData();;
		if (pageName == 'orderQueryDuring') {
			tblHeaders = _.map(tblHeaders, function (el) {
				var key = $XP(el, 'key', '');
				if (key == 'billDate') {
					el = IX.inherit(el, {
						key : 'shopName', label : "店铺名称"
					});
				}
				return el;
			});
		}
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return _.pick(el, 'key', 'clz');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});
		var statisticKeys = QueryOrderDuringStatisticKeys;
		var ftCols = _.map(statisticKeys.split(','), function (k) {
			var v = $XP(statisticData, k, 0), rowspan = 1, clz = '', 
				colspan = 1;

			return {
				clz : clz,
				colspan : colspan,
				rowspan : rowspan,
				text : (k == 'count' ? Hualala.Common.Math.prettyNumeric(v) : Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(v))),
				value : v
			};
		});
		ftCols.unshift({
			clz : 'title', colspan : '2', rowspan : '1', value : '', text : '共计：'
		});
		ftCols.push({clz : '', colspan : '', rowspan : '', value : '', text : ''});
		var tfoot = [{
			clz : '',
			cols : ftCols
		}];
		return {
			clz : clz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			tblClz : tblClz,
			thead : tblHeaders,
			rows : rows,
			tfoot : tfoot
		};
	};
	/**
	 * 格式化菜品排行榜渲染数据
	 * @param  {[type]} records
	 * @return {[type]}
	 */
	Hualala.Order.mapQueryDishesHotRenderData = function (records) {
		var self = this;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report";
		var	$body = $('#ix_wrapper > .ix-body > .container'),
			$pageBody = $body.find('.order-body'),
			$well = $pageBody.find('.well'),
			group=$well.find('select[name="grouping"] option:selected').val();
		var	tblHeaders =group=="2"? OrderQueryDishHotCategoryTableHeaderCfg:OrderQueryDishHotTableHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return _.pick(el, 'key', 'clz');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});
		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows
		};
	};

	/**
	 * 格式化用户统计排行榜渲染数据
	 * @param  {[type]} records
	 * @return {[type]}
	 */
	Hualala.Order.mapQueryUserRenderData = function (records) {
		var self = this;
		var clz = "col-md-12",
			tblClz = "table-bordered table-striped table-hover ix-data-report",
			tblHeaders = OrderQueryUserTableHeaderCfg;
		var mapColsRenderData = function (row, idx) {
			var colKeys = _.map(tblHeaders, function (el) {
				// return $XP(el, 'key', '');
				return _.pick(el, 'key', 'clz');
			});
			// colKeys.push('rowControl');
			var col = {clz : '', type : 'text'};
			var cols = _.map(colKeys, function (k, i) {
				var r = mapColItemRenderData.apply(self, [row, idx, $XP(k, 'key', '')]);
				return IX.inherit(col, r, {clz : $XP(k, 'clz', '')});
			});
			return cols;
		};
		var rows = _.map(records, function (row, idx) {
			return {
				clz : '',
				cols : mapColsRenderData(row, idx)
			};
		});

		return {
			clz : clz,
			tblClz : tblClz,
			isEmpty : !records || records.length == 0 ? true : false,
			colCount : tblHeaders.length,
			thead : tblHeaders,
			rows : rows
		};
	};

	/**
	 * 渲染结果页面
	 * @param  {Array|Object} data 	需要渲染成页面的数据
	 * @return {NULL}
	 */
	Hualala.Order.renderQueryOrderResult = function (data) {
		var self = this;
		self.$result.empty();
		self.$result.html(self.get('resultTpl')(data));
	};

	var OrderQueryResultView = Stapes.subclass({
		/**
		 * 构造View层
		 * @param  {Object} cfg
		 * 			@param {Function} mapResultRenderData 格式化渲染数据
		 * 			@param {Function} renderResult 渲染方法
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.$container = null;
			this.$resultBox = null;
			this.$result = null;
			this.$pager = null;
			this.set('mapResultRenderData', $XF(cfg, 'mapResultRenderData'));
			this.set('renderResult', $XF(cfg, 'renderResult'));
			this.loadTemplate();
		}
	});
	OrderQueryResultView.proto({
		/**
		 * 初始化View层
		 * @param  {Object} cfg
		 * 			@param {jQueryObj} container 容器
		 * 			@param {Object} model 搜索结果数据模型
		 * @return 
		 */
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
				resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				resultTpl : resultTpl
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
		bindEvent : function () {
			var self = this;
			self.model.hasPager && self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
			self.$resultBox.on('click', 'a.query-order-detail', function (e) {
				var $btn = $(this),
					orderKey = $btn.attr('data-key'),
					orderID = $btn.attr('data-id'),
					transType = '101';
				var detail = new Hualala.Account.AccountTransDetailModal({
					triggerEl : $btn,
					orderKey : orderKey,
					orderID : orderID,
					transType : transType,
					transID : ''
				});

			});
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
		getCityByCityID : function (cityID) {
			var self = this;
			var c = self.model.getCityByCityID(cityID);
			return c;
		}
	});

	Hualala.Order.OrderQueryResultView = OrderQueryResultView;
	Hualala.Order.QueryOrderDuringStatisticKeys = QueryOrderDuringStatisticKeys;
})(jQuery, window);
































