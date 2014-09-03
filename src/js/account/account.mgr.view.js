(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var AccountActs = [
		{clz : 'btn-success withdraw', act : 'withdraw', label : '提现'},
		{clz : 'btn-link', act : 'edit', label : '修改银行卡'},
		{clz : 'btn-link', act : 'queryShops', label : '查看全部店铺'},
		{clz : 'btn-link', act : 'delete', label : '删除此帐户'}
	];

	var AccountMgrView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 面包屑导航条
			this.$nav = null;
			this.breadCrumbs = null;
			// schema容器
			this.$schema = null;
			// 交易详情
			this.$detail = null;

			this.model = null;

			this.loadTemplates();
		}
	});

	AccountMgrView.proto({
		/**
		 * 初始化View层
		 * 
		 * @param  {Object} cfg {model, container}
		 * @return {[type]}
		 */
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("Account Detail View Init Failed!");
				return ;
			}
			this.initLayout();
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.html(htm);
			this.$nav = this.$container.find('.account-nav');
			this.$schema = this.$container.find('.account-schema-box');
			this.$detail = this.$container.find('.account-detail-box');
			this.bindEvent();
		},
		initBreadCrumbs : function () {
			var self = this,
				$nav = self.$nav,
				parentNames = Hualala.PageRoute.getParentNamesByPath();
			self.breadCrumbs = new Hualala.UI.BreadCrumb({
				container : $nav,
				hideRoot : true,
				nodes : parentNames,
				clz : 'account-crumbs',
				clickFn : function () {
					var $this = $(this);
					document.location.href = $this.attr('data-href');
				},
				mapRenderData : function (data, hideRoot, clz) {
					var list = _.map(data, function (el, idx, l) {
						var label = $XP(el, 'label', ''),
							name = $XP(el, 'name', ''),
							path = Hualala.PageRoute.createPath(name, [self.model.get('settleUnitID')]);
						return {
							clz : 'crumb',
							label : label,
							path : path,
							name : name,
							isLastNode : (data.length - 1 == idx) ? true : false
						};
					});
					hideRoot === true && list.shift();
					return {
						clz : clz,
						items : list
					};
				}

			});

		},
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_accountMgr_layout')),
				schemaTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_schema')),
				withDrawTpl = Handlebars.compile(Hualala.TplLib.get('tpl_withdraw_form'));
			// 注册子模版
			Handlebars.registerPartial("accountCard", Hualala.TplLib.get('tpl_account_card'));
			this.set({
				layoutTpl : layoutTpl,
				schemaTpl : schemaTpl,
				withDrawTpl : withDrawTpl
			});
		},
		bindEvent : function () {

		},
		mapRenderData : function () {
			var self = this,
				model = self.model,
				acts = AccountActs,
				acts1 = _.filter(IX.clone(acts), function (el) {
					return $XP(el, 'act') != 'withdraw';
				}),
				accountCard = null;
			var settleUnitID = model.get('settleUnitID') || '',
				hasDefault = model.get('defaultAccount') == 0 ? false : true,
				bankInfo = Hualala.Common.mapBankInfo(model.get('bankCode')),
				bankAccountStr = Hualala.Common.codeMask((model.get('bankAccount') || ''), 0, -4);

			accountCard = {
				clz : 'pull-left',
				settleUnitID : settleUnitID,
				hasDefault : hasDefault,
				settleUnitName : model.get('settleUnitName') || '',
				settleBalance : parseFloat(model.get('settleBalance') || 0),
				bankIcon : $XP(bankInfo, 'icon_16', ''),
				bankComName : $XP(bankInfo, 'name', ''),
				bankAccountStr : $XP(bankAccountStr, 'val', '').replace(/([\w|*]{4})/g, '$1 ').replace(/([*])/g, '<span>$1</span>'),
				shopCount : parseInt(model.get('shopCount') || 0),
				path : Hualala.PageRoute.createPath('accountDetail', [settleUnitID]),
				isDetail : true,
				acts : IX.map(acts1, function (el, i) {
					return IX.inherit(el, {
						isFirst : i == 0 ? true : false
					});
				})
			};
			return {
				accountCard : accountCard,
				acts : _.map(acts, function (el) {
					if ($XP(el, 'act') == 'queryShops') {
						return IX.inherit(el, {
							label : $XP(el, 'label', '') + '(' + parseInt(model.get('shopCount') || 0) + ')'
						});
					}
					return el;
				})
			};
		},
		render : function () {
			var self = this,
				model = self.model,
				renderData = self.mapRenderData(),
				tpl = self.get('schemaTpl');
			var htm = tpl(renderData);
			self.initBreadCrumbs();
			self.$schema.html(htm);


		}
	});
	
	Hualala.Account.AccountMgrView = AccountMgrView; 
})(jQuery, window);