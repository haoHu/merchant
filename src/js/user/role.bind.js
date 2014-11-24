(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindShopModal = Stapes.subclass({
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$queryBox = null;
			this.$resultBox = null;
			this.queryCtrl = null;
			this.set({
				accountID : this.model.get('accountID'),
				roleType : $XP(cfg, 'roleType'),
				mutiSelect : $XP(cfg, 'mutiSelect', false)
			});
			this.loadTemplates();
			this.initModal();
			this.render();
			this.bindEvent();
			this.initQueryBox();
			this.emit('show');
		}
		
	});
	BindShopModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_shop',
				clz : 'account-modal',
				title : "选择所管辖的店铺",
				backdrop : "static"
			});
		},
		render : function () {
			var self = this, layoutTpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl');
			var roleInfo = self.model.getRoleInfoByType(self.get('roleType')),
				name = $XP(roleInfo, 'name', ''),
				btns = [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'save', label : '确定'}
				];
				htm = layoutTpl({
					clz : '',
					title : "选择" + name + "所管辖的店铺"
				});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : btns
			}));
			self.$queryBox = self.modal._.body.find('.query-box');
			self.$resultBox = self.modal._.body.find('.result-box');
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				}
			});
			self.modal._.dialog.find('.btn').on('click', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
					self.parentView.updateRoleBindStatus(self.get('roleType'));
				} else {
					// 设置角色绑定店铺数据
					self.queryCtrl.emit('bindItems');
					var mUser = self.model, roleType = self.get('roleType'),
						roleInfo = mUser.getRoleInfoByType(roleType),
						items = !$XP(roleInfo, 'binded') ? [] : $XP(roleInfo, 'items');
					if (items.length > 0) {
						self.emit('hide');
					} else {
						toptip({
							msg : "请选择要绑定的店铺",
							type : 'danger'
						});
					}
				}
			});
		},
		initQueryBox : function () {
			var self = this;
			self.queryCtrl = new Hualala.User.QueryShopController({
				container : self.$queryBox,
				resultContainer : self.$resultBox,
				accountID : this.model.get('accountID'),
				roleType : self.get('roleType'),
				mutiSelect : self.get('mutiSelect'),
				userModel : self.model
			});
		}
	});

	Hualala.User.BindShopModal = BindShopModal;

	
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindSettleAccountModal = Stapes.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$resultBox = null;
			this.set({
				accountID : this.model.get('accountID'),
				roleType : $XP(cfg, 'roleType'),
				mutiSelect : $XP(cfg, 'mutiSelect', false),
				itemsCache : null
			});
			this.origSettleData = null;
			this.querySettleCallServer = Hualala.Global.queryAccount;
			this.$body = null;
			this.$footer = null;
			this.$resultBox = null;
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load');
			this.emit('show');
		}
	});
	BindSettleAccountModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerPartial("settleItem", Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_settle',
				clz : 'account-modal',
				title : "选择所管辖的结算账户",
				backdrop : "static"
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			var layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl({
					clz : '',
					title : '选择财务所管辖的结算账户'
				});
			self.$body.html(htm);
			self.$resultBox = self.$body.find('.result-box');
		},
		mapRenderData : function (data) {
			var self = this,
				roleType = self.get('roleType'),
				mutiSelect = self.get('mutiSelect'),
				itemsCache = self.get('itemsCache'),
				mUser = self.model;
			var roleInfo = mUser.getRoleInfoByType(roleType),
				items = $XP(roleInfo, 'items', []);
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			var ret = _.map(data, function (settle, i, l) {
				var id = $XP(settle, 'settleUnitID'),
					checked = !_.find(itemsCache, function (el) {return el == id}) ? '' : 'checked';
				return IX.inherit(settle, {
					type : !mutiSelect ? 'radio' : 'checkbox',
					clz : 'bind-item',
					settleUnitNameLabel : $XP(settle, 'settleUnitName', ''),
					checked : checked
				});
			});
			
			return ret;
		},
		render : function (data) {
			var self = this,
				listTpl = self.get('listTpl');
			var renderData = self.mapRenderData(data);
			var htm = listTpl({
				settleList : {
					list : renderData
				}
			});
			self.$resultBox.html(htm);
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				},
				"load" : function () {
					if (!self.origSettleData) {
						self.querySettleCallServer({}, function (res) {
							if (res.resultcode != '000') {
								toptip({
									msg : $XP(res, 'resultmsg', ''),
									type : 'danger'
								});
							} else {
								self.render($XP(res, 'data.records', []));
							}
						});
					} else {
						self.render(self.origSettleData);
					}
				}
			});
			self.$resultBox.tooltip({
				selector : '[title]'
			});
			self.$resultBox.delegate(':radio,:checkbox', 'change', function (e) {
				var $el = $(this),
					checked = !this.checked ? false : true,
					itemID = $el.val(),
					mutiSelect = self.get('mutiSelect'),
					roleType = self.get('roleType');
				var mUser = self.model;
				// mUser.updateRoleBind(roleType, itemID, mutiSelect, checked);
				self.updateItemsCache(roleType, itemID, mutiSelect, checked);
			});
			self.$footer.delegate('.btn', 'click', function (e) {
				var $btn = $(this),
					act = $btn.hasClass('btn-close') ? 'cancel' : 'ok';
				var cache = self.get('itemsCache');
				if (act == 'cancel') {
					self.emit('hide');
					self.parentView.updateRoleBindStatus(self.get('roleType'));
				} else {
					// 设置角色绑定店铺数据
					if (!cache || cache.length == 0) {
						toptip({
							msg : "请选择要绑定的结算账户",
							type : 'danger'
						});
						return ;
					}
					self.bindItems();
					self.emit('hide');
				}
			});
			
		},
		updateItemsCache : function (roleType, itemID, mutiSelect, checked) {
			var self = this;
			var itemsCache = self.get('itemsCache');
			if (mutiSelect) {
				if (!checked) {
					itemsCache = _.without(itemsCache, itemID);
				} else {
					itemsCache.push(itemID);
				}
			} else {
				itemsCache = [itemID];
			}
			self.set('itemsCache', itemsCache);
		},
		bindItems : function () {
			var self = this;
			var mUser = self.model,
				roleType = self.get('roleType');
			mUser.updateRoleItemsBind(roleType, self.get('itemsCache'));
		}
	});

	Hualala.User.BindSettleAccountModal = BindSettleAccountModal;
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var BindShopMultiModal = Stapes.subclass({
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.$trigger = $XP(cfg, 'trigger', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			this.$resultBox = null;
			this.set({
				accountID : this.model.get('accountID'),
				roleType : $XP(cfg, 'roleType'),
				itemsCache : null
			});
			this.queryModel = new Hualala.Shop.QueryModel();
			this.$body = null;
			this.$footer = null;
			this.$resultBox = null;
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load');

		}
	});
	BindShopMultiModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shops_tree')),
				collapseBtnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_collapse_btn')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_checkbox'));
			Handlebars.registerPartial("collapseBtn", Hualala.TplLib.get('tpl_collapse_btn'));
			Handlebars.registerPartial("item", Hualala.TplLib.get('tpl_shop_checkbox'));
			
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				collapseBtnTpl : collapseBtnTpl,
				itemTpl : itemTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_query_shop',
				clz : 'account-modal',
				title : "选择所管辖的店铺",
				backdrop : "static"
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			var layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl({
					clz : '', 
					title : "选择区域经理所管辖的店铺"
				});
			self.$body.html(htm);
			self.$resultBox = self.$body.find('.result-box');
		},
		chkShopBinded : function (shopID) {
			var self = this, itemsCache = self.get('itemsCache');
			return !_.find(itemsCache, function (el) {return el == shopID}) ? false : true;
		},
		mapShopTree : function () {
			var self = this,
				queryModel = self.queryModel;
			var cities = queryModel.getCities(),
				areas = queryModel.getAreas();
			var mapShopData = function (list) {
				var curShopLst = queryModel.getShops(list);
				var checkedCount = 0;
				var shops = _.map(curShopLst, function (shop) {
					var shopID = $XP(shop, 'shopID'),
						shopName = $XP(shop, 'shopName'),
						checked = self.chkShopBinded(shopID);
					checked && checkedCount++;
					return {
						nodeClz : 'col-sm-4',
						nodeType : 'shop',
						id : shopID,
						name : shopName,
						parentID : $XP(shop, 'areaID'),
						hideCollapse : 'hidden',
						checked : checked ? 'checked' : ''
					}
				});
				var unBinded = _.reject(shops, function (el) {return el.checked == 'checked';});
				return {
					shops : shops,
					checked : unBinded.length > 0 ? '' : 'checked',
					expanded : checkedCount > 0 ? 'in' : ''
				};
			};
			var mapAreaData = function (list) {
				var curAreaLst = queryModel.getAreas(list);
				var areas = _.map(curAreaLst, function (area) {
						var areaID = $XP(area, 'areaID'),
							areaName = $XP(area, 'areaName'),
							shopLst = $XP(area, 'shopLst', []);
						
						return IX.inherit({
							nodeClz : '',
							nodeType : 'area',
							id : areaID,
							name : areaName,
							parentID : $XP(area, 'cityID'),
							hideCollapse : ''
						}, mapShopData(shopLst));
					});
				var unBinded = _.reject(areas, function (el) {return el.checked == 'checked';});
				return {
					areas : areas,
					checked : unBinded.length > 0 ? '' : 'checked'
				};
			};
			return _.map(cities, function (city) {
				var cityID = $XP(city, 'cityID', ''),
					cityName = $XP(city, 'cityName', ''),
					areaLst = $XP(city, 'areaLst', []);
				
				return IX.inherit({
					nodeClz : '',
					nodeType : 'city',
					id : cityID,
					name : cityName,
					parentID : 'root',
					hideCollapse : ''
				}, mapAreaData(areaLst));
			});
		},
		mapRenderData : function () {
			var self = this,
				roleType = self.get('roleType'),
				itemsCache = self.get('itemsCache'),
				mUser = self.model;
			var roleInfo = mUser.getRoleInfoByType(roleType),
				items = $XP(roleInfo, 'items', []);
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			return self.mapShopTree();

		},
		render : function () {
			var self = this,
				listTpl = self.get('listTpl');
			var renderData = self.mapRenderData();
			var htm = listTpl({
				cities : renderData
			});
			self.$resultBox.html(htm);
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
				},
				"hide" : function () {
					self.modal.hide();
				},
				"load" : function () {
					self.queryModel.init($XP(self.get('sessionData'), 'user'), function (_queryModel) {
						self.queryModel = _queryModel;
						self.render();
						self.emit('show');
					});
				}
			});
			
			var bindParentNode = function (pID) {
				if (pID == 'root') return;
				var $pEl = $(':checkbox[value=' + pID + ']'),
					parentID = $pEl.attr('data-parent'),
					val = $pEl.val(), name = $pEl.attr('name');
				var $childEls = $('#' + name + '_' + val).find(':checkbox');
				var unCheckEls = _.reject($childEls, function (el) {
					return !!el.checked;
				});
				if (unCheckEls.length == 0) {
					$pEl[0].checked = true;
				} else {
					$pEl[0].checked = false;
				}
				bindParentNode(parentID);
			};
			self.$body.delegate(':checkbox', 'change', function (e) {
				var $chkBox = $(this), type = $chkBox.attr('name'),
					checked = !this.checked ? false : true,
					val = $chkBox.val(), parentID = $chkBox.attr('data-parent');
				if (type == "shop") {
					
				} else if (type == "area") {
					
				} else if (type == "city") {
					
				}
				if (type == "area" || type == "city") {
					$('#' + type + '_' + val).find(':checkbox').each(function () {
						this.checked = checked;
					});
				}
				bindParentNode(parentID);
				
			});
			self.$body.delegate('.btn-link[data-toggle="collapse"]', 'click', function(event) {
				var $btn = $(this), $icon = $btn.find('.glyphicon'),
					collapsed = $icon.hasClass('glyphicon-chevron-down');
				$icon.removeClass().addClass(collapsed ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down');
			});
			self.$footer.delegate('.btn', 'click', function (e) {
				var $btn = $(this),
					act = $btn.hasClass('btn-close') ? 'cancel' : 'ok';
				var cache = self.getBindItems();
				if (act == 'cancel') {
					self.emit('hide');
					self.parentView.updateRoleBindStatus(self.get('roleType'));
				} else {
					// 设置角色绑定店铺数据
					if (!cache || cache.length == 0) {
						toptip({
							msg : "请选择要绑定的店铺",
							type : 'danger'
						});
						return ;
					}
					self.bindItems();
					self.emit('hide');
				}
			});
		},
		getBindItems : function () {
			var self = this, $els = self.$body.find(':checked[name=shop]');
			var ids = _.map($els, function (el) {
				return $(el).val();
			});
			return ids;
		},
		bindItems : function () {
			var self = this, mUser = self.model,
				roleType = self.get('roleType');
			var ids = self.getBindItems();
			mUser.updateRoleItemsBind(roleType, ids);
		}
	});

	Hualala.User.BindShopMultiModal = BindShopMultiModal;
})(jQuery, window);