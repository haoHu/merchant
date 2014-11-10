(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var UserCtrlBtns = [
		{act : "reviewRole", label : "查看权限", clz : "btn-info"},
		{act : "editRole", label : "修改权限", clz : "btn-warning"},
		{act : "unbindMobile", label : "解绑手机", clz : "btn-warning"},
		{act : "resetPWD", label : "重置密码", clz : "btn-warning"},
		{act : "editUser", label : "修改账号", clz : "btn-warning"},
		{act : "remove", label : "删除账号", clz : "btn-danger"}
	];

	var UserListView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 结果容器
			this.$resultBox = null;
			// 结果列表
			this.$list = null;
			// 分页容器
			this.$pager = null;
			// 搜素栏
			this.$queryBar = null;
			this.$emptyBar = null;
			this.loadTemplates();
		}
	});
	UserListView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("User List View Init Failed!");
				return;
			}
			this.initLayout();
			this.keywordLst = '';
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.shop-list');
			this.$list = this.$container.find('.shop-list-body');
			this.$pager = this.$container.find('.page-selection');
			
		},
		// 加载View层模版
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_list')),
				queryTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_query')),
				ctrlTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_ctrl')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_user_item')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				roleBindingTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_binding_info'));
			Handlebars.registerPartial("userItem", Hualala.TplLib.get('tpl_user_item'));
			this.set({
				layoutTpl : layoutTpl,
				queryTpl : queryTpl,
				ctrlTpl : ctrlTpl,
				listTpl : listTpl,
				btnTpl : btnTpl,
				roleBindingTpl : roleBindingTpl,
				itemTpl : itemTpl
			});
		},
		// 获取账号状态的配置
		mapUserStatusLabel : function (s) {
			var self = this,
				status = Hualala.TypeDef.UserStatus;
			return _.find(status, function (o) {
				return $XP(o, 'value') == s;
			});
		},
		// 格式化列表渲染数据
		mapListRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (user, i, l) {
				return self.mapItemRenderData(user);
			});
			return {
				userItem : {list : ret}
			};
		},
		// 格式化条目渲染数据
		mapItemRenderData : function (user) {
			var self = this;
			var oUserStatus = self.mapUserStatusLabel($XP(user, 'accountStatus'));
			return IX.inherit(user, {
				clz : '',
				accountStatusClz : $XP(oUserStatus, 'value') == 0 ? 'label-danger' : 'label-success',
				mobileIsBinded : $XP(user, 'mobileBinded') == 0 ? false : true,
				accountStatusLabel : $XP(oUserStatus, 'label'),
				cellClz : $XP(user, 'mobileBinded') == 0 ? 'text-danger' : ''
			});
		},
		// 格式化搜索栏数据
		mapChosenUserData : function () {
			var self = this;
			var users = self.model.getUsers();
			var ret = [];
			ret.push({
				name : '账号',
				items : _.map(users, function (user, i, l) {
					return {
						code : $XP(user, 'accountID'),
						name : $XP(user, 'loginName') + '(' + $XP(user, 'userName') + ')'
					};
				})
			});
			return ret;
		},
		// 渲染View层
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				queryID = $XP(pagerParams, 'queryID', null);
			queryID = IX.isString(queryID) && queryID.length > 0 ? [queryID] : null;
			var users = model.getUsers(queryID);
			var renderData = self.mapListRenderData(users);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.$emptyBar && self.$emptyBar.destroy();
			self.$list.empty();
			if (users.length == 0) {
				self.$emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.$emptyBar.show();
			} else {
				self.$list.html(html);
			}
		},
		// 渲染单条用户数据
		rerenderUser : function (accountID) {
			var self = this,
				model = self.model,
				mUser = model.getUserModelByUserID(accountID);
			var renderData = self.mapItemRenderData(mUser.getAll()),
				tpl = self.get('itemTpl'),
				htm = tpl(renderData);
			var $tr = self.$list.find('tr.user-item[data-id=' + accountID + ']');
			if ($tr.length == 0) {
				$(htm).prependTo(self.$list.find('table.table > tbody'));
			} else {
				$tr.after(htm);
				$tr.remove();
			}
		},
		initChosenPanel : function () {
			var self = this;
			var matcher = (new Pymatch([]));
			var sections = self.model.getUsers();
			var getMatchedFn = function (searchText) {
				matcher.setNames(_.map(sections, function (el) {
					return IX.inherit(el, {
						name : el.loginName,
						py : el.py + ';' + el.loginName + (!el.userMobile ? '' : (';' + el.userMobile.split(';')))
					});
				}));
				var matchedSections = matcher.match(searchText);
				var matchedOptions = {};
				_.each(matchedSections, function (el, i) {
					matchedOptions[el[0].accountID] = true;
				});
				return matchedOptions;
			};
			self.$queryBar.find('.navbar-form[role="search"] select').chosen({
				width : '200px',
				placeholder_text : "请选择账号",
				no_results_text : "抱歉，没有找到！",
				allow_single_deselect : true,
				getMatchedFn : getMatchedFn
			}).change(function (e) {
				var $this = $(this);
				// self.model.updatePagerParams({queryID : $this.val()});
				self.keywordLst = $this.val();
			});
		},
		// 渲染搜索栏
		renderQueryPanel : function () {
			var self = this;
			var queryTpl = this.get('queryTpl');
			var queryChosenUsers = this.mapChosenUserData();
			var $oldQueryBar = self.$container.find('.shop-query');
			if ($oldQueryBar.length > 0) {
				$oldQueryBar.remove();
			}
			self.$queryBar = $(queryTpl({
				optGrp : queryChosenUsers
			}));

			self.$container.prepend(self.$queryBar);
			self.initChosenPanel();
		},
		// 格式化用户操作按钮渲染数据
		mapUserBtns : function (mUser) {
			var roles = mUser.get('roles'),
				mobileBinded = mUser.get('mobileBinded');
			return _.map(UserCtrlBtns, function (el) {
				var act = $XP(el, 'act');
				if (act == 'reviewRole' && (!roles || roles.length == 0)) {
					return IX.inherit(el, {
						clz : el.clz + ' hidden disabled'
					});
				}
				if (act == 'unbindMobile' && !mobileBinded) {
					return IX.inherit(el, {
						clz : el.clz + ' hidden disabled'
					});
				}
				return el;
			});
		},
		// 渲染账号控制按钮
		renderUserCtrl : function (userID) {
			var self = this;
			var ctrlTpl = self.get('ctrlTpl');
			var mUser = self.model.getUserModelByUserID(userID),
				roles = mUser.get('roles'),
				btns = self.mapUserBtns(mUser);
			var $ctrlBar = $(ctrlTpl({
					id : userID,
					btns : btns
				})).hide(),
				$tr = self.$list.find('tr[data-id=' + userID + ']'),
				o = $tr.offset(),
				o1 = self.$list.find('table tbody').offset(),
				h = $tr.height(),
				w = $tr.width();
			// $tr.append($ctrlBar);
			self.$list.find('.table-responsive').append($ctrlBar);
			
			$ctrlBar.css({
				height : h + 'px',
				width : 0,
				display : 'block',
				top : (o.top - o1.top) + 'px',
				right : 0
			});
			$ctrlBar.find('.user-ctrl-box').css({
				width : w + 'px',
				height : h + 'px'
			});
			$ctrlBar.animate({
				width : w + 'px'
			}, 400);
		},
		bindEvent : function () {
			var self = this;
			// 用户操作按钮交互
			self.$list.on('mouseenter', 'tr.user-item', function (e) {
				var $tr = $(this), userID = $tr.attr('data-id');
				self.renderUserCtrl(userID);
				var $otherCtrls = self.$list.find('.user-ctrl[data-id!=' + userID + ']');
				$otherCtrls.length > 0 && $otherCtrls.trigger('mouseleave');

			});
			self.$list.on('mouseleave', '.user-ctrl', function (e) {
				var $tr = $(this), userID = $tr.attr('data-id'),
					$ctrlBar = self.$list.find('.user-ctrl[data-id=' + userID + ']');
				var w = $tr.width();
				$ctrlBar.animate({
					width : 0
				}, 400, function () {
					$ctrlBar.remove();
				});
				
			});
			self.$list.on('click', '.user-ctrl .btn', function (e) {
				var $btn = $(this), act = $btn.attr('data-act');
				var accountID = $btn.parents('.user-ctrl').attr('data-id'),
					mUser = self.model.getUserModelByUserID(accountID),
					loginName = mUser.get('loginName') || '';
				switch(act) {
					case "reviewRole":
						// TODO 查看角色权限配置
						self.initReviewRoleModal(accountID, act);
						break;
					case "editRole":
						// TODO 编辑角色权限配置
						self.initSetRoleModal(accountID, act);
						break;
					case "unbindMobile":
						// TODO 解绑定手机
						Hualala.UI.Confirm({
							title : '手机号解除绑定',
							msg : '是否解除绑定账号(' + loginName + ')的手机号？',
							okLabel : '解除绑定',
							okFn : function () {
								self.model.emit(act, {
									accountID : accountID,
									successFn : function () {
										self.rerenderUser(accountID);
									}
								});
							}
						});
						break;
					case "resetPWD":
						// TODO 重置密码
						self.initResetPWDModal(accountID, act);
						break;
					case "editUser":
						// TODO 编辑用户基本信息
						self.initUserBaseInfoModal(accountID, act);
						break;
					case "remove":
						// TODO 删除用户账号
						Hualala.UI.Confirm({
							title : '删除账号',
							msg : '是否删除账号(' + loginName + ')？',
							okLabel : '删除',
							okFn : function () {
								self.model.emit(act, {
									accountID : accountID,
									successFn : function () {
										var $curTR = self.$list.find('tr.user-item[data-id=' + accountID + ']');
										self.renderQueryPanel();
										$curTR.hide(400, function () {
											$curTR.remove();
										});
									}
								});
							}
						});
						break;
				}
			});
			// 用户查询栏的操作
			self.$queryBar.on('click', '.btn', function (e) {
				var $btn = $(this),
					act = $btn.attr('data-act');
				if (act == 'query') {
					self.model.updatePagerParams({queryID : (self.keywordLst || null)});
					self.emit('query', self.model.getPagerParams());
				} else if (act == 'create') {
					// TODO 创建用户向导
					self.initCreateUserModal(act);
				}
			});
			self.$queryBar.on('keyup', '.chosen-container', function (e) {
				var $this = $(this);
				if ($this.hasClass('chosen-container-active') && !$this.hasClass('chosen-with-drop')) {
					$this.find('input').first().trigger('blur.chosen');
					self.$queryBar.find('.query-btn').trigger('click');
				}
			});

		},
		// 定位搜索的账号
		moveToTarget : function (params) {
			var self = this;
			var accountID = $XP(params, 'queryID', null);
			if (!accountID) return;
			var $tar = self.$list.find('tr.user-item[data-id=' + accountID + ']');
			$tar.removeClass('shake');
			Hualala.Common.smoothScrollMiddle($tar, 400, function () {
				setTimeout(function () {
					$tar.addClass('shake');

				}, 0);
			});
		},
		// 创建重置密码窗口
		initResetPWDModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			var resetPWDModal = new Hualala.UI.ModalDialog({
				id : "reset_pwd_modal",
				clz : 'account-modal',
				title : "重置密码",
				afterHide : function () {
					self.resetPWDView = null;
					self.resetPWDModal = null;
				}
			});
			resetPWDModal.show();
			self.resetPWDModal = resetPWDModal;
			self.resetPWDView = new Hualala.User.ResetPWDView({
				mode : 'edit',
				parentView : self,
				model : mUser,
				evtType : evtType,
				successFn : function (mUser) {

				},
				failFn : function (mUser) {

				}
			});
		},
		// 用户基本信息编辑窗口
		initUserBaseInfoModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			var userBaseInfoModal = new Hualala.UI.ModalDialog({
				id : "user_base_modal",
				clz : 'account-modal',
				title : "修改账号信息",
				afterHide : function () {
					self.userBaseInfoView = null;
					self.userBaseInfoModal = null;
				}
			});
			userBaseInfoModal.show();
			self.userBaseInfoModal = userBaseInfoModal;
			self.userBaseInfoView = new Hualala.User.UserBaseInfoView({
				mode : 'edit',
				parentView : self,
				model : mUser,
				evtType : evtType,
				successFn : function (mUser) {
					self.rerenderUser(mUser.get('accountID'));
					self.renderQueryPanel();
				},
				failFn : function (mUser) {

				}
			});
		},
		// 角色设置窗口
		initSetRoleModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			var userRoleModal = new Hualala.UI.ModalDialog({
				id : "user_role_modal",
				clz : "account-modal",
				title : "修改角色信息",
				afterHide : function () {
					self.userRoleModal = null;
					self.userRoleView = null;
				}
			});
			userRoleModal.show();
			self.userRoleModal = userRoleModal;
			self.userRoleView = new Hualala.User.UserRoleView({
				mode : 'edit',
				parentView : self,
				model : mUser,
				evtType : evtType,
				successFn : function (mUser) {
					self.rerenderUser(mUser.get('accountID'));
				},
				failFn : function (mUser) {

				}
			});
		},
		renderRoleBinding : function (mUser, modal, shopSchemaModel, settleData, roles) {
			var self = this;
			var $body = modal._.body, $footer = modal._.footer;
			var accountName = mUser.get('loginName');
			var renderData = _.map(roles, function (role) {
				var items = $XP(role, 'items', []),
					roleType = $XP(role, 'roleType', '');
				var _items = [];
				if (roleType == 'finance') {
					_items = _.map(items, function (id) {
						var matched = _.find(settleData, function (unit) {
							return $XP(unit, 'settleUnitID') == id;
						});
						return {
							id : id,
							name : $XP(matched, 'settleUnitName', '')
						};
					});
				} else if (roleType == 'manager' || roleType == 'area-manager') {
					_items = items.length == 0 ? [] : shopSchemaModel.getShops(items);
					_items = _.map(_items, function (item) {
						return {
							id : $XP(item, 'shopID'),
							name : $XP(item, 'shopName')
						};
					});
				}
				return IX.inherit(role, {
					items : _items
				});
			});
			renderData = _.reject(renderData, function (el) {
				return !$XP(el, 'binded');
			});
			var tpl = self.get('roleBindingTpl'),
				btnTpl = self.get('btnTpl'),
				btns = [
					{clz : 'btn-default', name : 'cancel', label : '关闭'}
				];
			var htm = tpl({
				accountName : accountName,
				roles : renderData
			});
			$body.html(htm);
			$footer.html(btnTpl({
				btns : btns
			}));
			$footer.find('.btn').click(function (e) {
				modal.hide();
			});
		},
		// 查看角色设置窗口
		initReviewRoleModal : function (accountID, evtType) {
			var self = this, mUser = self.model.getUserModelByUserID(accountID);
			self.shopSchemaModel = null;
			self.settleData = null;
			var modal = new Hualala.UI.ModalDialog({
				id : "user_role_info_modal",
				clz : "account-modal",
				title : "查看账号权限设置",
				afterHide : function () {

				}
			});
			modal.show();
			var getShopsData = function (cbFn) {
				var shopQueryModel = new Hualala.Shop.QueryModel();
				shopQueryModel.init({}, cbFn);
			};
			var getSettleData = function (cbFn) {
				var callServer = Hualala.Global.queryAccount;
				callServer({}, function (res) {
					if (res.resultcode != '000') {
						toptip({
							msg : $XP(res, 'resultmsg', ''),
							type : 'danger'
						});
						modal.hide();
					} else {
						cbFn($XP(res, 'data.records'));
					}
				});
			};
			getShopsData(function (queryModel) {
				self.shopSchemaModel = queryModel;
				getSettleData(function (data) {
					self.settleData = data;
					mUser.emit('queryRoleBinding', {
						successFn : function () {
							var roles = mUser.get('roles');
							self.renderRoleBinding(mUser, modal, self.shopSchemaModel, self.settleData, roles);
							modal.show();
						},
						failFn : function () {
							modal.hide();
						}
					});
				});
			});
			
		},
		// 创建账号
		initCreateUserModal : function (evtType) {
			var self = this;
			self.createUserView = new Hualala.User.CreateUserModal({
				mode : 'add',
				parentView : self,
				evtType : evtType,
				successFn : function (mUser) {
					// TODO add item to list
					self.model.addItem(mUser);
					self.rerenderUser(mUser.get('accountID'));
					self.renderQueryPanel();
				},
				failFn : function (mUser) {

				}
			});
		}
	});
	Hualala.User.UserListView = UserListView;
	
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;

	var QueryShopResultView = Hualala.Shop.CardListView.subclass({
		constructor : Hualala.Shop.CardListView.prototype.constructor
	});
	QueryShopResultView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_bind_shop_item'));
			Handlebars.registerPartial("shopCard", Hualala.TplLib.get('tpl_bind_shop_item'));
			Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl,
				itemsCache : null
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
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var mutiSelect = self.get('mutiSelect'),
				mUser = self.get('userModel'),
				roleType = self.get('roleType'),
				roleInfo = mUser.getRoleInfoByType(roleType),
				items = !$XP(roleInfo, 'binded') ? [] : $XP(roleInfo, 'items');
			var itemsCache = self.get('itemsCache');
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			var ret = _.map(data, function (shop, i, l) {
				var shopID = $XP(shop, 'shopID'),
					checked = !_.find(itemsCache, function (el) {return el == shopID}) ? '' : 'checked';
				return IX.inherit(shop, {
					type : !mutiSelect ? 'radio' : 'checkbox',
					clz : 'bind-item',
					shopNameLabel : $XP(shop, 'shopName', ''),
					checked : checked
				});
			});
			return {
				shopCard : {
					list : ret
				}
			};
		},
		render : function (viewCfg) {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			this.set(viewCfg);
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
		},
		bindEvent : function () {
			var self = this;
			self.$list.tooltip({
				selector : '[title]'
			});
			self.$list.delegate(':radio,:checkbox', 'change', function (e) {
				var $el = $(this),
					checked = !this.checked ? false : true,
					itemID = $el.val(),
					mutiSelect = self.get('mutiSelect'),
					roleType = self.get('roleType');
				var mUser = self.get('userModel');
				// mUser.updateRoleBind(roleType, itemID, mutiSelect, checked);
				self.updateItemsCache(roleType, itemID, mutiSelect, checked);
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
		bindItems : function () {
			var self = this;
			var mUser = self.get('userModel'),
				roleType = self.get('roleType');
			mUser.updateRoleItemsBind(roleType, self.get('itemsCache'));
		}
	});

	Hualala.User.QueryShopResultView = QueryShopResultView;
})(jQuery, window);