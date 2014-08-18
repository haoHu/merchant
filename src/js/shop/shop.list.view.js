(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 结果容器
			this.$resultBox = null;
			// 结果列表
			this.$list = null;
			// 分页容器
			this.$pager = null;
			this.loadTemplates();
		}
	});
	CardListView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("CardList View Init Failed!");
				return ;
			}
			this.initLayout();
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$list = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
		},
		initPager : function (params) {
			var baseCfg = {
				total : 0,
				page : 1,
				maxVisible : 10,
				leaps : true
			};
			this.$pager.IXPager(IX.inherit(baseCfg, params));
		},
		bindEvent : function () {
			var self = this;
			self.$list.tooltip({
				selector : '[title]'
			});
			self.$list.on('click', '.btn[data-href]', function (e) {
				var $btn = $(this),
					path = $btn.attr('data-href');
				document.location.href = path;
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['Page']['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'Page.pageNo', 1),
					pageSize : $XP(params, 'Page.pageSize', 15)
				}));
			});
			
		},
		// 加载View层所需模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				cardTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_card')),
				tagTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_tags'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTag", Hualala.TplLib.get('tpl_shop_tags'));
			Handlebars.registerPartial("shopCard", Hualala.TplLib.get('tpl_shop_card'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				cardTpl : cardTpl,
				tagTpl : tagTpl
			});
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var getTags = function (tags) {
				return _.map(tags, function (t, i, l) {
					return {
						clz : 'label-info',
						tag : t
					};
				});
			};
			var ret = _.map(data, function (shop, i, l) {
				var address = $XP(shop, 'address', ''),
					byteLen = Hualala.Common.strByteLength(address),
					slugAddr = '';
				slugAddr = byteLen < 72 ? address : (Hualala.Common.substrByte(address, 70) + '...');
				return {
					clz : '',
					id : $XP(shop, 'shopID', ''),
					name : $XP(shop, 'shopName', ''),
					img : Hualala.Common.getSourceImage($XP(shop, 'imagePath', ''), {
						width : 100,
						height : 100,
						quality : 50
					}),
					tags : getTags($XP(shop, 'tags', [])),
					address : address,
					slugAddr : slugAddr,
					tel : $XP(shop, 'tel', ''),
					infoHref : Hualala.PageRoute.createPath('shopInfo', [$XP(shop, 'shopID', '')]),
					menuHref : Hualala.PageRoute.createPath('shopMenu', [$XP(shop, 'shopID', '')]),
					checked : $XP(shop, 'status') == 1 ? 'checked' : ''
				};
			});
			return {
				shopCard : {
					list : ret
				}
			};
		},
		// 渲染开关
		initSwitcher : function (selector) {
			var self = this;
			self.$list.find(selector).bootstrapSwitch({
				// baseClass : 'ix-bs-switch',
				// wrapperClass : 'ix-bs-switch-wrapper',
				size : 'normal',
				onColor : 'success',
				offColor : 'default',
				onText : '已开通',
				offText : '未开通'
			});
			// 绑定开关事件
			self.$list.find(selector).on('switchChange.bootstrapSwitch', function (e, state) {
				var $chkbox = $(this),
					shopID = $chkbox.attr('data-shop'),
					state = !state ? 0 : 1;
				self.model.updateShopStatus(shopID, state, function (_shopID) {
					self.$list.find(selector).filter('[data-shop=' + _shopID + ']').bootstrapSwitch('toggleState', true);
				});
			});
		},
		// 渲染view
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'Page.pageNo');
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.$list.empty();
			self.$list.html(html);
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
			// self.$list.find(':checkbox[name*=switcher_]').bootstrapSwitch();
			self.initSwitcher(':checkbox[name=switcher]');
		}
	});

	Hualala.Shop.CardListView = CardListView;
})(jQuery, window);