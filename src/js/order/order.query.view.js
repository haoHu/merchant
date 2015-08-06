(function ($, window) {
	IX.ns("Hualala.Order");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	/**
	 * 查询条件表单元素配置信息 
	 * @type {Object}
	 */
	Hualala.Order.QueryFormElsCfg = {
		orderTime : {
			type : 'section',
			label : '日期',
			min : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		cityID : {
			type : 'combo',
			label : '城市',
			defaultVal : '',
			options : [],
			validCfg : {
				validators : {}
			}
		},
		shopID : {
			type : 'combo',
			label : '店铺',
			defaultVal : '',
			options : [],
			validCfg : {
				validators : {}
			}
		},
		queryStatus : {
			type : 'combo',
			label : '状态',
			defaultVal : '',
			options : Hualala.TypeDef.queryStatus,
			validCfg : {
				validators : {}
			}
		},
		orderTotal : {
			type : 'section',
			label : '金额',
			min : {
				type : 'text',
				// prefix : '￥',
				// surfix : '元',
				defaultVal : '',
				validCfg : {
					validators : {
						numeric : {
							message: "金额必须为数字"
						},
						greaterThan : {
							inclusive : true,
							value : 0,
							message : "金额必须大于或等于0"
						}
					}
				}
			},
			max : {
				type : 'text',
				// prefix : '￥',
				// surfix : '元',
				defaultVal : '',
				validCfg : {
					validators : {
						numeric : {
							message: "金额必须为数字"
						},
						greaterThan : {
							inclusive : true,
							value : 0,
							message : "金额必须大于或等于0"
						}
					}
				}
			}
		},
		orderID : {
			type : 'text',
			label : '订单号',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "订单号必须为数字"
					}
				}
			}
		},
		userMobile : {
			type : 'text',
			label : '手机号',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "手机号码必须为数字"
					}
				}
			}
		},
		vipOrder : {
			type : 'checkboxgrp',
			label : '仅会员支付',
			value : '1',
			defaultVal : '1',
			validCfg : {
				validators : {}
			}
		},
		userLoginMobile : {
			type : 'text',
			label : '手机号',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "手机号码必须为数字"
					}
				}
			}
		},
		foodCategoryName : {
			type : 'text',
			label : '分类名称',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		grouping : {
			type : 'combo',
			label : '查询条件',
			defaultVal : '',
			options : Hualala.TypeDef.foodCountStatus,
			validCfg : {
				validators : {}
			}
		},
		userName : {
			type : 'text',
			label : '订餐人',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		button : {
			type : 'button',
			clz : 'btn  btn-warning ordersearch',
			label : '查询'
		},
		excelbutton : {
			type : 'button',
			clz : 'btn  btn-warning orderexport',
			label : '导出'
		}
	};
	var QueryFormElsHT = new IX.IListManager();
	_.each(Hualala.Order.QueryFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-4 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k == 'orderTime' ? 'startDate' : 's_orderTotal',
				maxName = k == 'orderTime' ? 'endDate' : 'e_orderTotal',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-5',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-5',
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
				labelClz : labelClz,
			}, $XP(el, 'type') !== 'button' ? {clz : 'col-xs-8 col-sm-8 col-md-8'} : null));
		}
	});

	/**
	 * 格式化订单搜索页面，搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapOrderQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		// var query = {cols : [
		// 	{
		// 		colClz : 'col-md-4',
		// 		items : QueryFormElsHT.getByKeys(['orderTime', 'orderTotal'])
		// 	},
		// 	{
		// 		colClz : 'col-md-2',
		// 		items : QueryFormElsHT.getByKeys(['cityID', 'shopID'])
		// 	},
		// 	{
		// 		colClz : 'col-md-3',
		// 		items : QueryFormElsHT.getByKeys(['orderStatus', 'orderID'])
		// 	},
		// 	{
		// 		colClz : 'col-md-3',
		// 		items : QueryFormElsHT.getByKeys(['userMobile'])
		// 	},
		// 	{
		// 		colClz : 'col-md-offset-1 col-md-2',
		// 		items : QueryFormElsHT.getByKeys(['button'])
		// 	}
		// ]};
		var query = {cols : [
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime', 'orderTotal'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['cityID', 'queryStatus'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['shopID', 'orderID'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['userMobile','vipOrder'])
			},
			{
				colClz : 'col-md-offset-1 col-md-5 pull-right',
				items : QueryFormElsHT.getByKeys(['excelbutton','button'])
			}
		]};
		return {
			query : query
		};
	};

	/**
	 * 格式化订单日汇总,期间汇总搜索页面，搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapOrderQueryBaseFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {cols : [
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['cityID'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['shopID'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['queryStatus'])
			},
			{
				colClz : 'col-md-offset-1 col-md-5 pull-right',
				items : QueryFormElsHT.getByKeys(['excelbutton','button'])
			}
		]};
		return {
			query : query
		};
	};

	/**
	 * 格式化菜品排行榜页面搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapDishesHotQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {cols : [
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['cityID','shopID'])
			},
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['grouping'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['foodCategoryName'])
			},
			{
				colClz : 'col-md-offset-1 col-md-2 pull-right',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	};

	/**
	 * 格式化用户统计页面搜索表单数据
	 * @return {Object}
	 */
	Hualala.Order.mapUsersQueryFormRenderData = function () {
		var self = this;
		var queryKeys = self.model.queryKeys;
		var query = {cols : [
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['cityID'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['shopID'])
			},
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime'])
			},
			
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['userLoginMobile'])
			},
			{
				colClz : 'col-md-3',
				items : QueryFormElsHT.getByKeys(['userName'])
			},
			{
				colClz : 'col-md-offset-4 col-md-2',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	};

	var QueryView = Stapes.subclass({
		/**
		 * 订单报表搜索View层构造
		 * @param  {Object} cfg
		 * 			@param {Function} mapRenderDataFn 整理渲染搜索表单数据
		 * @return {Object}
		 */
		constructor : function (cfg) {
			this.isReady = false;
			this.$container = null;
			this.$queryBox = null;
			this.loadTemplates();
			this.set('mapRenderDataFn', $XF(cfg, 'mapRenderDataFn'));
		}
	});

	QueryView.proto({
		init : function (cfg) {
			this.model = $XP(cfg, 'model', null);
			this.$container = $XP(cfg, 'container', null);
			if (!this.model || !this.$container || this.$container.length == 0) {
				throw("Init Query View Failed!!");
				return;
			}
			this.renderLayout();
			this.bindEvent();
			this.isReady = true;
			this.emit('query', this.getQueryParams());
		},
		// 判断是否View初始化完毕
		hasReady : function () {return this.isReady;},
		loadTemplates : function () {
			var self = this;
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_queryLayout')),
				comboOptsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_comboOpts'));
			Handlebars.registerPartial("orderQueryForm", Hualala.TplLib.get('tpl_order_queryForm'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				comboOptsTpl : comboOptsTpl
			});
		},
		initQueryFormEls : function () {
			var self = this,
				els = self.model.getQueryParams(),
				cityID = $XP(els, 'cityID', ''),
				shopID = $XP(els, 'shopID', '');
			self.initCityComboOpts(cityID);
			self.initShopComboOpts(cityID, shopID);
			_.each(els, function (v, k) {
				if (k == 'startDate' || k == 'endDate') {
					v = IX.isEmpty(v) ? '' : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(v), 'yyyy/MM/dd');
				}
				if(k=='queryStatus'){
					v = '2';
				}
				if(k=='grouping'){
					v = '1';
				}
				self.$queryBox.find('[name=' + k + ']').val(v);
			});
		},
		initChosenPanel : function (_cfg) {
			var self = this,
				matcher = (new Pymatch([])),
				sections = $XP(_cfg, 'sectionsData'),
				$target = $XP(_cfg, '$target'),
				chosenPanelCfg = $XP(_cfg, 'chosenPanelCfg', {}),
				changeFn = $XF(_cfg, 'changeFn');
			var getMatchedFn = function (searchText) {
				matcher.setNames(_.map(sections, function (el) {
					return IX.inherit(el, {
						name : el.label,
						py : el.py
					});
				}));
				var matchedSections = matcher.match(searchText);
				var matchedOptions = {};
				_.each(matchedSections, function (el, i) {
					matchedOptions[el[0].value] = true;
				});
				return matchedOptions;
			};
			var chosen = $target.data('chosen');
			chosen && chosen.destroy();
			$target.chosen(IX.inherit({
				width : '200px',
				placeholder_text : "请选择",
				no_results_text : "抱歉，没有找到！",
				allow_single_deselect : true
			}, chosenPanelCfg, {
				getMatchedFn : getMatchedFn
			})).change(function (e) {
				changeFn.apply(this, e);
			});
		},
		initCityComboOpts : function (curCityID) {
			var self = this,
				cities = self.model.getCities();
			if (IX.isEmpty(cities)) return ;
			cities = _.map(cities, function (city) {
				var id = $XP(city, 'cityID', ''), name = $XP(city, 'cityName', '');
				return {
					value : id,
					label : name,
					selected : id == curCityID ? 'selected' : '',
					py : $XP(city, 'py', '')
				};
			});
			cities.unshift({
				value : '',
				label : '全部',
				selected : IX.isEmpty(curCityID) ? 'selected' : '',
				py : 'quan;bu'
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : cities
				}),
				$select = self.$queryBox.find('select[name=cityID]');
			$select.html(htm);

			self.initChosenPanel({
				chosenPanelCfg : {
					width : $select.parent().width() + 'px',
					placeholder_text : "请选择城市"
				},
				sectionsData : cities,
				$target : $select,
				changeFn : function (e) {
					var $this = $(this);
					self.chosenCityID = $this.val();
				}
			});
		},
		initShopComboOpts : function (curCityID, curShopID) {
			var self = this,
				shops = IX.isEmpty(curCityID) ? self.model.getShops() : self.model.getShopsByCityID(curCityID);
			if (IX.isEmpty(shops)) return;
			shops = _.map(shops, function (shop) {
				var id = $XP(shop, 'shopID', ''), name = $XP(shop, 'shopName', '');
				return {
					value : id,
					label : name,
					selected : id == curShopID ? 'selected' : '',
					py : $XP(shop, 'py', '')
				};
			});
			shops.unshift({
				value : '',
				label : '全部',
				selected : IX.isEmpty(curShopID) ? 'selected' : '',
				py : 'quan;bu'
			});
			var optTpl = self.get('comboOptsTpl'),
				htm = optTpl({
					opts : shops
				}),
				$select = self.$queryBox.find('select[name=shopID]');
			$select.html(htm);

			self.initChosenPanel({
				chosenPanelCfg : {
					width : $select.parent().width() + 'px',
					placeholder_text : "请选择店铺"
				},
				sectionsData : shops,
				$target : $select,
				changeFn : function (e) {
					var $this = $(this);
					self.chosenCityID = $this.val();
				}
			});
		},
		initQueryEls : function () {
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
			self.$queryBox.on('click', '.input-group-addon', function (e) {
				var $this = $(this),
					$picker = $this.prev(':text[data-type=datetimepicker]');
				if ($picker.length > 0) {
					$picker.datetimepicker('show');
				}
			});
		},
		mapRenderLayoutData : function () {
			var mapFn = this.get('mapRenderDataFn');
			return IX.isFn(mapFn) && mapFn.apply(this);
		},
		renderLayout : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = layoutTpl(renderData);
			self.$queryBox = $(html);
			self.$container.html(self.$queryBox);
			self.initQueryFormEls();
			self.initQueryEls();
		},
		bindEvent : function () {
			var self = this;
			self.$queryBox.on('change', 'select', function (e) {
				var $this = $(this),
					v = $this.val();
				self.initShopComboOpts(v, '');
			});
			self.$queryBox.on('click', '.btn.btn-warning', function (e) {
				if(this.name=="button"){
					var $this = $(this);
					self.emit('query', self.getQueryParams());
				}
				else{
					var pagename=Hualala.PageRoute.getPageContextByPath().name;
					var serviceName,templateName;
					if(pagename=="orderQuery"){
						serviceName = "order_report_orderDetail";
						templateName = "orderDetailReport.xml";
					}
					else if(pagename=="orderQueryDay"){
						serviceName = "order_report_dayofReconciliation";
						templateName ="dayofReconciliationReport.xml";
					}
					else if(pagename=="orderQueryDuring"){
						serviceName = "order_report_DuringTheBill";
						templateName ="duringTheBillReport.xml";
					}
					var	group = $XP(Hualala.getSessionData(),'site',''),
						groupName = $XP(group,'groupName','');
						currentNav = Hualala.PageRoute.getPageContextByPath(),
						currentLabel = $XP(currentNav,'label',''),
						fileName =groupName+currentLabel+".xls";
						shopName = $('[name=shopID]').next().find('span').text()=="全部" ? "": $('[name=shopID]').next().find('span').text();
					var params ={serviceName:serviceName,templateName:templateName,fileName:fileName,shopName:shopName},
						ExcelfilePath;
					var globalparams=_.extend(self.getQueryParams(),params);
					Hualala.Global.OrderExport(globalparams, function (rsp) {
	                    if(rsp.resultcode != '000'){
	                        rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
	                        return;
	                    }
	                	ExcelfilePath =rsp.data.filePath || [];
						var dowloadhref=ExcelfilePath;
						window.open(dowloadhref); 
	                })
				}
			});
		},
		getQueryParams : function () {
			var self = this,
				keys = self.model.queryKeys,
				$form = self.$queryBox.find('form'),
				val = $('[name=vipOrder]:checked').length? '1': '';
				$('[name=vipOrder]').val(val);
			var els = $form.serializeArray();
			//serializeArray方法对于checkbox只有勾选才有效，没有勾选的情况下无效。
			if(els.length!=9){
				els=els;
			}
			else{
				vipOrder=[{name:"vipOrder",value:""}];
				els = els.concat(vipOrder);
			}
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
			return els;
		}

	});

	Hualala.Order.QueryView = QueryView;
})(jQuery, window);