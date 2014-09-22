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
			this.emptyBar = null;
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
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
		},
		// 加载View层所需模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_card')),
				tagTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_tags'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTag", Hualala.TplLib.get('tpl_shop_tags'));
			Handlebars.registerPartial("shopCard", Hualala.TplLib.get('tpl_shop_card'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl,
				tagTpl : tagTpl
			});
		},
		// 组装标签
		mapTags : function (d) {
			var self = this,
				tagKeys = 'areaName,cuisineName1,cuisineName2'.split(',');
			var tags = _.map(tagKeys, function (k) {
				return $XP(d, k, null);
			});
			return _.filter(tags, function (t) {
				return !IX.isEmpty(t);
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
					// tags : getTags($XP(shop, 'tags', [])),
					tags : getTags(self.mapTags(shop)),
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
				pageNo = $XP(pagerParams, 'pageNo');
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.emptyBar && self.emptyBar.destroy();
			self.$list.empty();
			if (shops.length == 0) {
				self.emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.emptyBar.show();
			} else {
				self.$list.html(html);
			}
			
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

	var ShopListView = CardListView.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 结果容器
			this.$resultBox = null;
			// 结果列表
			this.$list = null;
			// 分页容器
			this.$pager = null;
			this.emptyBar = null;
			this.loadTemplates();
		}
	});
	ShopListView.proto({
		bindEvent : function () {
			var self = this;
			self.$list.tooltip({
				selector : '[title]'
			});
			self.$pager.on('page', function (e, pageNo) {
				var params = self.model.getPagerParams();
				params['pageNo'] = pageNo;
				self.model.emit('load', IX.inherit(params, {
					pageNo : $XP(params, 'pageNo', 1),
					pageSize : $XP(params, 'pageSize', 15)
				}));
			});
			// 弹出修改业务窗口
			self.$list.on('click', '.btn[data-business]', function (e) {
				var $btn = $(this),
					shopID = $btn.attr('data-shop'),
					businessName = $btn.attr('data-business'),
					businessID = $btn.attr('data-business-id');
				self.initBusinessModal($btn, shopID, businessName, businessID);
			});
		},
		// 加载View层所需模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_item')),
				tagTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_tags'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTag", Hualala.TplLib.get('tpl_shop_tags'));
			Handlebars.registerPartial("shopItem", Hualala.TplLib.get('tpl_shop_list_item'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl,
				tagTpl : tagTpl
			});
		},
		/**
		 * 获取店铺业务描述信息
		 * @param  {Int} businessID    业务ID(10:常规预订,11:闪吃,20:外送,21:到店自提,41:店内自助)
		 * @param  {Int} operationMode 餐厅运营模式 0：正餐；1：正餐
		 * @param  {Object} businessInfo  业务配置信息
		 * @return {String}               业务配置描述
		 */
		getBusinessDesc : function (businessID, operationMode, businessInfo) {
			var self = this;
			var tpl = null, renderKeys = null, params = null, htm = '';
			switch(businessID) {
				// 闪吃描述
				case 11:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_justeat_desc'));
					renderKeys = 'servicePeriods,holidayFlag,minAmount,advanceTime,noticeTime,reserveTableTime,reserveTableDesc'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "servicePeriods" :
								r = '营业时间：' + r.replace(',', '-').replace(/([\d]{2})([\d]{2})/g, '$1:$2') + ', ';
								break;
							case "holidayFlag" : 
								r = (r == 0 ? '工作日及节假日开放' : (r == 1 ? '只在节假日开放' : '只在工作日开放')) + ', ';
								break;
							case "minAmount" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('最低消费' + r + '元, ');
								break;
							case "advanceTime" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('顾客需提前' + r + '分钟预订, ');
								break;
							case "noticeTime" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('订单提前' + r + '分钟通知餐厅, ');
								break;
							case "reserveTableTime" : 
								r = IX.isEmpty(r) || r == 0 ? '' : ('留位' + r + '分钟, ');
								break;
							case "reserveTableDesc" : 
								r = IX.isEmpty(r) ? '' : r;
								break;
						}
						return r;
					});
					break;
				// 店内自助描述
				case 41:
					tpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_spotorder_desc'));
					renderKeys = operationMode == 0 ?
						'isDinner,supportCommitToSoftware,payMethodAtShop,payBeforeCommit'.split(',') :
						'isDinner,supportCommitToSoftware,fetchFoodMode'.split(',');
					params = _.map(renderKeys, function (k) {
						var r = $XP(businessInfo, k, '');
						switch(k) {
							case "isDinner":
								r = operationMode == 0 ? true : false;
								break;
							case "supportCommitToSoftware":
								r = (r == 1 ? '支持' : '不支持') + '下单到餐饮软件, ';
								break;
							case "fetchFoodMode":
								r = '下单后' + (r == 1 ? '凭牌号' : (r == 2 ? '直接' : '凭流水号')) + '在收银台取餐, ';
								break;
							case "payMethodAtShop":
								r = (r == 1 ? '餐前先通过手机结账' : (r == 2 ? '餐后可通过手机结账' : '不能用手机结账')) + ', ';
								break;
							case "payBeforeCommit":
								r = r == 1 ? '支付完成后才能下单, ' : '';
								break;
						}
						return r;
					});
					break;
			}
			if (businessID == 11 || businessID == 41) {
				htm = tpl(_.object(renderKeys, params));
			}
			return htm;
		},
		// 获取店铺业务信息数据
		getShopBusiness : function (shop) {
			var self = this;
			var business = Hualala.TypeDef.ShopBusiness,
				businessHT = new IX.IListManager(),
				serviceFeatures = $XP(shop, 'serviceFeatures', ''),
				businessCfg = JSON.parse($XP(shop, 'revParamJson', {}));
			var ret = null;
			_.each(business, function (item, i, l) {
				var id = $XP(item, 'id'), name = $XP(item, 'name')
					switcherStatus = serviceFeatures.indexOf(name) >= 0 ? 1 : 0,
					businessInfo = $XP(businessCfg, id.toString(), {}),
					operationMode = $XP(shop, 'operationMode', null);
				var ret = IX.inherit(item, businessInfo, {
					switcherStatus : switcherStatus,
					shopID : $XP(shop, 'shopID'),
					desc : self.getBusinessDesc(id, operationMode, businessInfo)
				});
				businessHT.register(name, ret);
			});
			ret = _.filter(businessHT.getAll(), function (el) {
				return $XP(el, 'businessIsSupported', false) == true;
			});
			return ret;
		},
		// 获取店铺业务信息渲染数据
		mapBusinessRenderData : function (shop) {
			var self = this,
				data = self.getShopBusiness(shop);
			return _.map(data, function (el) {
				var name = $XP(el, 'name'),
					icon = 'icon-' + name,
					switcherName = 'switcher_business',
					open = $XP(el, 'switcherStatus') == 1 ? 'checked' : '';
				return {
					icon : icon,
					label : $XP(el, 'label'),
					switcherName : switcherName,
					shopID : $XP(el, 'shopID'),
					type : name,
					id : $XP(el, 'id'),
					open : open,
					desc : $XP(el, 'desc', '')
				};
			});
		},
		// 校验是否有财务或更高权限
		chkHasAccountRole : function () {
			var loginUsr = Hualala.getSessionUser(),
				usrRoles = $XP(loginUsr, 'role');
				roles = Hualala.getSessionRoles();
			var ret = _.find(roles, function (role) {
				var roleType = $XP(role, 'roleType');
				var matchedID = _.find(usrRoles, function (v) {
					return $XP(role, 'id') == v;
				});
				return !!matchedID && (roleType == 'account' || roleType == 'all');
			});
			return !!ret;
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (shop, i, l) {
				return {
					clz : '',
					shopID : $XP(shop, 'shopID', ''),
					shopName : $XP(shop, 'shopName', ''),
					hideAccount : !self.chkHasAccountRole() ? 'hidden' : '',
					settleName : $XP(shop, 'settleName', ''),
					switcherName : 'switcher_status',
					shopOpen : $XP(shop, 'status') == 1 ? 'checked' : '',
					business : self.mapBusinessRenderData(shop)
				}
			});
			return {
				shopItem : {
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
				onColor : selector == ':checkbox[name=switcher_business]' ? 'primary' : 'success',
				offColor : 'default',
				onText : '已开通',
				offText : '未开通'
			});
			// 绑定开关事件
			self.$list.find(selector).on('switchChange.bootstrapSwitch', function (e, state) {
				var $chkbox = $(this),
					name = $chkbox.attr('name'),
					shopID = $chkbox.attr('data-shop'),
					state = !state ? 0 : 1,
					business = $chkbox.attr('data-business'),
					businessID = $chkbox.attr('data-business-id');
				if (name == 'switcher_status') {
					self.model.updateShopStatus(shopID, state, function (_shopID) {
						self.$list.find(selector).filter('[data-shop=' + _shopID + ']').bootstrapSwitch('toggleState', true);
					});
				} else {
					self.model.updateShopBusinessStatus({
						shopID : shopID,
						name : business,
						id : businessID,
						status : state
					}, function (params) {
						self.$list.find(selector).filter('[data-shop=' + $XP(params, 'shopID') + '][data-business-id=' + $XP(params, 'id') + ']')
							.bootstrapSwitch('toggleState', true);
					});
				}
				
			});
		},
		// 渲染view
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var shops = model.getShops(pageNo);
			var renderData = self.mapRenderData(shops);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.emptyBar && self.emptyBar.destroy();
			self.$list.empty();
			if (shops.length == 0) {
				self.emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.emptyBar.show();
			} else {
				self.$list.html(html);
			}
			
			
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
			// self.$list.find(':checkbox[name*=switcher_]').bootstrapSwitch();
			self.initSwitcher(':checkbox[name=switcher_business]');
			self.initSwitcher(':checkbox[name=switcher_status]');
		},
		// 生成业务编辑窗口
		initBusinessModal : function (trigger, shopID, name, id) {
			var self = this;
			var editView = new Hualala.Setting.editServiceView({
				triggerEl : trigger,
				serviceID : id,
				serviceName : name,
				model : self.model.getShopModelByShopID(shopID)
			});
		}
	});
	Hualala.Shop.ShopListView = ShopListView;
})(jQuery, window);