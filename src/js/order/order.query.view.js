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
			label : '店铺名称',
			defaultVal : '',
			options : [],
			validCfg : {
				validators : {}
			}
		},
		orderStatus : {
			type : 'combo',
			label : '订单状态',
			defaultVal : '',
			options : Hualala.TypeDef.OrderStatus,
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
			label : '手机号码',
			defaultVal : '',
			validCfg : {
				validators : {
					numeric : {
						message: "手机号码必须为数字"
					}
				}
			}
		},
		userLoginMobile : {
			type : 'text',
			label : '手机号码',
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
		userName : {
			type : 'text',
			label : '订餐人姓名',
			defaultVal : '',
			validCfg : {
				validators : {}
			}
		},
		button : {
			type : 'button',
			clz : 'btn btn-block btn-warning',
			label : '查询'
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
		var query = {cols : [
			{
				colClz : 'col-md-4',
				items : QueryFormElsHT.getByKeys(['orderTime', 'orderTotal'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['cityID', 'shopID'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['orderID', 'orderStatus'])
			},
			{
				colClz : 'col-md-2',
				items : QueryFormElsHT.getByKeys(['userMobile'])
			},
			{
				colClz : 'col-md-1',
				items : QueryFormElsHT.getByKeys(['button'])
			}
		]};
		return {
			query : query
		};
	}

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
			// this.emit('filter', this.getFilterParams());
		},
		// 判断是否View初始化完毕
		hasReady : function () {return this.isReady;},
		loadTemplates : function () {
			var self = this;
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_queryLayout'));
			Handlebars.registerPartial("orderQueryForm", Hualala.TplLib.get('tpl_order_queryForm'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl
			});
		},
		mapRenderLayoutData : function () {
			var mapFn = this.get('mapRenderDataFn');
			return mapFn.apply(this);
		},
		renderLayout : function () {
			var self = this,
				layoutTpl = self.get('layoutTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = layoutTpl(renderData);
			self.$queryBox = $(html);
			self.$container.html(self.$queryBox);
		},
		bindEvent : function () {

		}

	});

	Hualala.Order.QueryView = QueryView;
})(jQuery, window);