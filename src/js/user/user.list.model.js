(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var UserListModel = Stapes.subclass({
		/**
		 * 构造用户列表的数据模型
		 * @param  {Object} cfg 配置信息
		 *         @param {Function} callServer 获取数据接口
		 * @return {Object}     数据模型对象
		 */
		constructor : function (cfg) {
			this.callServer = $XP(cfg, 'callServer', null);
			if (!this.callServer) {
				throw("callServer is empty!");
				return;
			}
		}
	});
	UserListModel.proto({
		init : function (params) {
			this.set({
				queryID : $XP(params, 'queryID', ''),
				ds_user : new IX.IListManager()
			});
		},
		updatePagerParams : function (params) {
			var self = this;
			var pagerParamkeys = 'queryID';
			_.each(params, function (v, k, l) {
				if (pagerParamkeys.indexOf(k) > -1) {
					self.set(k, v);
				}
			});
		},
		getPagerParams : function () {
			return {
				queryID : this.get('queryID')
			};
		},
		updateDataStore : function (data) {
			var self = this,
				userHT = self.get('ds_user');
			var ids = _.map(data, function (user, i, l) {
				var id = $XP(user, 'accountID'),
					mUser = new BaseUserModel(user);
				userHT.register(id, mUser);
				return id;
			});
			return ids;
		},
		resetDataStore : function () {
			var self = this,
				userHT = self.get('ds_user');
			userHT.clear();
		},
		removeUsers : function (ids) {
			var self = this,
				userHT = self.get('ds_user');
			if (!ids) userHT.clear();
			ids = IX.isArray(ids) ? ids : [ids];
			_.each(ids, function (id) {
				userHT.unregister(id);
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			self.callServer(self.getPagerParams(), function (res) {
				if (res.resultcode == '000') {
					self.updateDataStore($XP(res, 'data.records', []));
					self.updatePagerParams($XP(res, 'data.page', {}));
				} else {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				}
				cbFn(self);
			});
		},
		getUsers : function (ids) {
			var self = this,
				userHT = self.get('ds_user');
			var users = !ids || !IX.isArray(ids) ? userHT.getAll() : userHT.get(ids);
			var ret = _.map(users, function (mUser, i, l) {
				return mUser.getAll();
			});
			IX.Debug.info("DEBUG: User List Model Data : ");
			IX.Debug.info(ret);
			return ret;
		},
		getUserModelByUserID : function (userID) {
			var self = this,
				userHT = self.get('ds_user');
			return userHT.get(userID);
		},
		getUserModelByUserLoginName : function (loginName) {
			var self = this,
				userHT = self.get('ds_user'),
				users = userHT.getAll();
			return _.find(users, function (user) {
				return user.get('loginName') == loginName;
			});
		},
		addItem : function (mUser) {
			var self = this,
				userHT = self.get('ds_user'),
				id = mUser.get('accountID');
			userHT.register(id, mUser);
		}
	});
	Hualala.User.UserListModel = UserListModel;

	var BaseUserModel = Stapes.subclass({
		constructor : function (user) {
			this.resetPWDCallServer = Hualala.Global.resetPWDInShopGroupChildAccount;
			this.editUserCallServer = Hualala.Global.updateShopGroupChildAccount;
			this.addUserCallServer = Hualala.Global.addShopGroupChildAccount;
			this.removeCallServer = Hualala.Global.removeShopGroupChildAccount;
			this.unbindMobileCallServer = Hualala.Global.unbindMobileInShopGroupChildAccount;
			this.bindMobileCallServer = Hualala.Global.bindMobileInShopGroupChildAccount;
			this.updateRoleBindingCallServer = Hualala.Global.updateRoleBinding;
			this.queryRoleBindingCallServer = Hualala.Global.queryRoleBinding;
			this.set("ds_role", new IX.IListManager());
			if (!IX.isEmpty(user)) {
				this.updateUserModel(user);
			}
			
			// this.mapUserRoles();
			this.bindEvent();
		}
	});
	BaseUserModel.proto({
		updateUserModel : function (user) {
			this.set(user);
			this.updateRoleStore();
		},
		updateRoleStore : function (roleCfg) {
			var self = this, roleHT = self.get('ds_role'),
				roleTypes = IX.isEmpty(roleCfg) ? (this.get('roleType') + ',') : roleCfg,
				siteRoleType = Hualala.TypeDef.SiteRoleType,
				roleHT = self.get('ds_role');
			roleHT.clear();
			var roles = _.map(siteRoleType, function (role) {
					var roleType = $XP(role, 'roleType');
					var ret = null;
					if (IX.isString(roleTypes)) {
						ret = IX.inherit(role, {
							binded : roleTypes.indexOf(roleType + ',') >= 0 ? true : false
						});
					} else {
						var _r = _.find(roleTypes, function (el) {
							return $XP(el, 'type') == roleType;
						});
						ret = IX.inherit(role, {
							binded : !_r ? false : true,
							items : $XP(_r, 'items', [])
						});
					}
					roleHT.register(roleType, ret);
					return ret;
				});
			
			self.set('roles', roles);
		},
		getRoleInfoByType : function (roleType) {
			var self = this, roleHT = self.get('ds_role');
			return roleHT.get(roleType);
		},
		updateRoleItemsBind : function (roleType, items) {
			var self = this;
			var role = self.getRoleInfoByType(roleType);
			role.items = items || [];

		},
		updateRoleBind : function (roleType, binded) {
			var self = this;
			var role = self.getRoleInfoByType(roleType);
			role.binded = !binded ? false : true;
		},
		// mapUserRoles : function () {
		// 	var roleType = (this.get('roleType') + ',') || '';
		// 	var siteRoleType = Hualala.TypeDef.SiteRoleType;
		// 	var roles = _.reject(siteRoleType, function (role) {
		// 		return roleType.indexOf($XP(role, 'roleType', '') + ',') < 0;
		// 	});
		// 	this.set('roles', roles);
		// },
		getRoleBindings : function () {
			var self = this,
				roleHT = self.get('ds_role'),
				roles = roleHT.getAll();
			var ret = _.reject(roles, function (role) {return !$XP(role, 'binded');});
			ret = _.map(ret, function (role) {
				return {
					type : $XP(role, 'roleType'),
					items : $XP(role, 'items', [])
				};
			});
			return ret;
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"addUser" : function (params) {
					// TODO 新建账号基本信息
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postParams = $XP(params, 'params', {});
					self.addUserCallServer(postParams, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							self.updateUserModel($XP(res, 'data.records')[0]);
							successFn();
						}
					});
				},
				"editUser" : function (params) {
					// TODO 设置用户基本信息
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postParams = $XP(params, 'params', {});
					self.editUserCallServer(postParams, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							self.set(postParams);
							successFn();
						}
					});
						
				},
				"resetPWD" : function (params) {
					// TODO 重置用户密码
					var loginPWD = $XP(params, 'params.loginPWD', ''),
						postParams = $XP(params, 'params', {}),
						successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');

					self.resetPWDCallServer(postParams, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							successFn();
						}
					});
				},
				"remove" : function (params) {
					// 删除用户
					var successFn = $XF(params, 'successFn');
					self.removeCallServer({
						accountID : self.get('accountID')
					}, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						} else {
							toptip({
								msg : "删除成功!",
								type : 'success'
							});
							successFn();
						}
					});
				},
				"editRole" : function (params) {
					// TODO 设置用户角色权限
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postData = {
							accountID : self.get('accountID'),
							roles : JSON.stringify(self.getRoleBindings())
						};
					
					self.updateRoleBindingCallServer(postData, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "保存成功!",
								type : 'success'
							});
							successFn();
						}
					});
				},
				"unbindMobile" : function (params) {
					// 解绑定手机号
					var successFn = $XF(params, 'successFn');
					self.unbindMobileCallServer({
						accountID : self.get('accountID')
					}, function (res) {
						if (res.resultcode !== '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						} else {
							toptip({
								msg : "解绑定成功!",
								type : 'success'
							});
							self.set('mobileBinded', 0);
							successFn();
						}
					});
				},
				"bindMobile" : function (params) {
					// 绑定手机号
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn'),
						postData = $XP(params, 'params', {});
					self.bindMobileCallServer(postData, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							toptip({
								msg : "绑定成功!",
								type : 'success'
							});
							self.set({
								'userMobile' : $XP(postData, 'userMobile'),
								'mobileBinded' : 1
							});
							successFn();
						}
					});
				},
				"queryRoleBinding" : function (params) {
					var successFn = $XF(params, 'successFn'),
						failFn = $XF(params, 'failFn');
					self.queryRoleBindingCallServer({
						accountID : self.get('accountID')
					}, function (res) {
						if (res.resultcode != '000') {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
							failFn();
						} else {
							self.updateRoleStore($XP(res, 'data.roles', null));
							successFn();
						}
					});
				}
			});
		}
	});
	Hualala.User.BaseUserModel = BaseUserModel;
	
})(jQuery, window);
(function ($, window) {
	IX.ns("Hualala.User");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var QueryShopResultModel = Hualala.Shop.CardListModel.subclass({
		constructor : function () {
			this.origData = null;
			this.dataStore = new IX.IListManager();
		}
	});
	QueryShopResultModel.proto({
		initDataStore : function (data) {
			var self = this;
			self.origData = data;
			_.each(self.origData, function (shop) {
				self.dataStore.register($XP(shop, 'shopID'), shop);
			});
		},
		load : function (params, cbFn) {
			var self = this;
			self.updatePagerParams(params);
			var pageNo = self.get('pageNo'),
				pageSize = self.get('pageSize'),
				cityID = self.get('cityID'),
				areaID = self.get('areaID'),
				keywordLst = self.get('keywordLst'),
				totalSize = 0,
				start = (pageNo - 1) * pageSize,
				end = pageSize * pageNo,
				pageCount = 0;
			var shops = [];
			shops = areaID.length > 0 ? _.filter(self.origData, function (_shop) {
				return $XP(_shop, 'areaID') == areaID;
			}) : self.origData;
			shops = cityID.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'cityID') == cityID;
			}) : shops;
			shops = keywordLst.length > 0 ? _.filter(shops, function (_shop) {
				return $XP(_shop, 'shopName') == keywordLst;
			}) : shops;
			totalSize = shops.length;
			pageCount = Math.ceil(totalSize / pageSize);
			shops = _.filter(shops, function (_shop, idx) {
				return idx >= start && idx < end;
			});
			self.updateDataStore(shops, pageNo);
			self.updatePagerParams({
				pageCount : pageCount,
				totalSize : totalSize,
				pageNo : pageNo,
				pageSize : pageSize
			});
			cbFn(self);
		}
	});

	Hualala.User.QueryShopResultModel = QueryShopResultModel;
})(jQuery, window);














