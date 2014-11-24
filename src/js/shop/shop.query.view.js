(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var QueryView = Stapes.subclass({
		constructor : function () {
			// View层是否初始化完毕
			this.isReady = false;
			// 是否开放创建店铺功能
			this.needShopCreate = false;
			// View层容器
			this.$container = null;
			this.$queryBox = null;
			// 过滤部分容器
			this.$filter = null;
			// 搜索部分容器
			this.$query = null;
			this.loadTemplates();
		}
	});
	QueryView.proto({
		// 初始化View层
		init : function (cfg) {
			this.model = $XP(cfg, 'model', null);
			this.needShopCreate = $XP(cfg, 'needShopCreate', false);
			this.$container = $XP(cfg, 'container', null);
			if (!this.model || !this.$container || this.$container.length == 0) {
				throw("Init Query View Failed!!");
				return;
			}
			this.keywordLst = null;
			this.renderLayout();
			this.bindEvent();
			this.isReady = true;
			this.emit('filter', this.getFilterParams());

		},
		// 判断是否View初始化完毕
		hasReady : function () {return this.isReady;},
		// 加载View层需要的模板
		loadTemplates : function () {
			var queryTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_query')),
				filterTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_filter'));
			// 注册子模板
			Handlebars.registerPartial("shopCity", Hualala.TplLib.get('tpl_shop_filter'));
			Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
			// Handlebars.registerPartial("shopArea", Hualala.TplLib.get('tpl_shop_filter'));
			this.set({
				queryTpl : queryTpl,
				filterTpl : filterTpl
			});
		},
		// 生成搜索栏店铺选择框组件的渲染数据
		mapChosenShopData : function () {
			var self = this;
			var cities = this.model.getCities();
			var ret = [];
			_.each(cities, function (city, i, l) {
				var cityName = $XP(city, 'cityName', ''),
					cityID = $XP(city, 'cityID', ''),
					shopLst = $XP(city, 'shopLst');
				var shops = self.model.getShops(shopLst);
				ret.push({
					name : cityName,
					items : _.map(shops, function (shop, j, l) {
						return {
							code : $XP(shop, 'shopID'),
							name : $XP(shop, 'shopName')
						};
					})
				});
			});
			return ret;
		},
		// 生成渲染数据
		mapRenderLayoutData : function () {
			var cities = this.model.getCities(),
				shops = this.model.getShops();
			var filterCities = this.mapFilterData({
					type : 'city',
					name : '城市：',
					focus : 0,
					data : cities
				}),
				queryChosenShops = this.mapChosenShopData();
			return {
				clz : '',
				shopCity : filterCities,
				toggle : {target : '#shop_query'},
				needShopCreate : this.needShopCreate,
				optGrp : queryChosenShops
			};
		},
		chkCtrlRight : function () {
			var self = this;
			var curPageRight = Hualala.Common.getCurPageUserRight();
			var disabled = $XP(curPageRight, 'right.disabled', []),
				enabled = $XP(curPageRight, 'right.enabled', []);
			_.each(disabled, function (n) {
				self.$query.find('[data-btn-name=' + n + ']').attr('disabled', true).addClass('invisible');
			});
			_.each(enabled, function (n) {
				self.$query.find('[data-btn-name=' + n + ']').attr('disabled', false).removeClass('invisible');
			});
		},
		// 渲染整体query 框架
		renderLayout : function () {
			var self = this,
				queryTpl = self.get('queryTpl'),
				model = self.model;
			var renderData = self.mapRenderLayoutData();
			var html = queryTpl(renderData);
			this.$queryBox = $(html);
			this.$container.prepend(this.$queryBox);
			this.$filter = this.$queryBox.find('.filter');
			this.$query = this.$queryBox.find('.query');
			this.initShopChosenPanel();
			this.chkCtrlRight();
		},
		// 生成渲染地区的渲染数据
		mapFilterData : function (cfg) {
			var data = $XP(cfg, 'data', []),
				type = $XP(cfg, 'type'),
				name = $XP(cfg, 'name'),
				focus = $XP(cfg, 'focus', 0),
				ret = {
					type : type,
					name : name,
					items : []
				},
				count = 0;
			var btn_all = {
				focusClz : '',
				type : type,
				code : -1,
				name : '全部',
				count : 0
			};
			ret.items = _.map(data, function (o, i, l) {
				var key = type + 'Count';
				var c = parseInt($XP(o, key, 0));
				count += c;
				return {
					focusClz : '',
					type : type,
					code : $XP(o, (type + 'ID'), ''),
					name : $XP(o, (type + 'Name'), ''),
					count : c
				}
			});
			btn_all = IX.inherit(btn_all, {
				count : count,
				focusClz : ''
			});
			ret.items.unshift(btn_all);
			ret.items[focus]['focusClz'] = 'disabled';
			return ret;
		},
		initShopChosenPanel : function () {
			var self = this;
			var matcher = (new Pymatch([]));
			var sections = self.model.getShops();
			var getMatchedFn = function (searchText) {
				matcher.setNames(_.map(sections, function (el) {
					return IX.inherit(el, {
						name : el.shopName
					});
				}));
				var matchedSections = matcher.match(searchText);
				var matchedOptions = {};
				_.each(matchedSections, function (el, i) {
					matchedOptions[el[0].shopID] = true;
				});
				return matchedOptions;
			};
			self.$query.find('.navbar-form[role="search"] select').chosen({
				width : '200px',
				placeholder_text : "请选择店铺名称",
				// max_selected_options: 1,
				no_results_text : "抱歉，没有找到！",
				allow_single_deselect : true,
				getMatchedFn : getMatchedFn
			}).change(function (e) {
				var $this = $(this);
				self.keywordLst = $this.val();
			});
		},
		// 渲染filter
		renderAreaFilter : function (data) {
			var self = this,
				filterTpl = self.get('filterTpl'),
				model = self.model;
			var renderData = self.mapFilterData({
				type : 'area',
				name : '区域：',
				focus : 0,
				data : data
			});
			var html = filterTpl(renderData);
			this.$filter.find('.area').remove();
			this.$filter.append(html);
			this.initShopChosenPanel();
		},
		updateFilterCityLayout : function (cityID) {
			var self = this;
			var data = null;
			if (cityID != -1) {
				data = self.model.getCities(cityID);
				data = $XP(data[0], 'areaLst', null);
				data = self.model.getAreas(data);
				self.renderAreaFilter(data);
			} else {
				self.$filter.find('.area').remove();
			}
			self.$filter.find('.btn-link[data-city]').removeClass('disabled');
			self.$filter.find('.btn-link[data-city=' + cityID + ']').addClass('disabled');
		},
		updateFilterAreaLayout : function (areaID) {
			var self = this;
			self.$filter.find('.btn-link[data-area]').removeClass('disabled');
			self.$filter.find('.btn-link[data-area=' + areaID + ']').addClass('disabled');
		},
		// 绑定View层操作
		bindEvent : function () {
			var self = this;
			this.$filter.on('click', '.btn-link[data-city]', function (e) {
				var $btn = $(this);
				var cityID = $btn.attr('data-city');
				// var data = null;
				// if (cityID != -1) {
				// 	data = self.model.getCities(cityID);
				// 	data = $XP(data[0], 'areaLst', null);
				// 	data = self.model.getAreas(data);
				// 	self.renderAreaFilter(data);
				// } else {
				// 	self.$filter.find('.area').remove();
				// }
				// self.$filter.find('.btn-link[data-city]').removeClass('disabled');
				// $btn.addClass('disabled');
				self.updateFilterCityLayout(cityID);
				self.emit('filter', self.getFilterParams());
			});
			this.$filter.on('click', '.btn-link[data-area]', function (e) {
				var $btn = $(this);
				var areaID = $btn.attr('data-area');
				// self.$filter.find('.btn-link[data-area]').removeClass('disabled');
				// $btn.addClass('disabled');
				self.updateFilterAreaLayout(areaID);
				self.emit('filter', self.getFilterParams());
			});
			this.$query.on('click', '.create-shop', function (e) {
				var $btn = $(this);
				document.location.href = Hualala.PageRoute.createPath('shopCreate');
			});
			this.$query.on('click', '.query-btn', function (e) {
				var $btn = $(this);
				var shopID = self.keywordLst || null,
					shop = null, cityID = -1, areaID = -1;
				if (!IX.isEmpty(shopID)) {
					shop = self.model.getShops(shopID)[0];
					cityID = $XP(shop, 'cityID', -1);
					areaID = $XP(shop, 'areaID', -1);
				}
				self.updateFilterCityLayout(cityID);
				self.updateFilterAreaLayout(areaID);
				self.emit('query', self.getQueryParams());
			});
			this.$query.on('keyup', '.chosen-container', function (e) {
				var $this = $(this);
				if ($this.hasClass('chosen-container-active') && !$this.hasClass('chosen-with-drop')) {
					$this.find('input').first().trigger('blur.chosen');
					self.$query.find('.query-btn').trigger('click');
				}
			});
		},
		destroy : function () {
			this.isReady = false;
			this.needShopCreate = false;
			this.$container.find('.shop-query').remove();
			this.$queryBox = null;
			this.$filter = null;
			this.$query = null;
		},
		// 获取过滤参数
		getFilterParams : function () {
			// TODO
			var self = this;
			var focusedBtn = self.$filter.find('.btn-link.disabled');
			var cityID = focusedBtn.filter('[data-city]').attr('data-city'),
				areaID = focusedBtn.filter('[data-area]').attr('data-area');
			cityID = (!cityID || cityID == -1) ? '' : cityID;
			areaID = (!areaID || areaID == -1) ? '' : areaID;
			return {
				cityID : cityID,
				areaID : areaID,
				keywordLst : ''
			};
		},
		// 获取搜索参数
		getQueryParams : function () {
			// TODO
			var self = this;
			var keywordLst = self.keywordLst || null;
			var params = self.getFilterParams();
			var shops = self.model.getShops();
			if (IX.isEmpty(keywordLst)) {
				keywordLst = '';
			} else {
				keywordLst = $XP(_.find(shops, function (el) {
					return $XP(el, 'shopID') == keywordLst;
				}), 'shopName', '');
			}
			return IX.inherit(params, {
				keywordLst : keywordLst
			});
		}

	});
	Hualala.Shop.QueryView = QueryView;
})(jQuery, window);