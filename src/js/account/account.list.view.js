(function ($, window) {
	IX.ns("Hualala.Account");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var CardListView = Hualala.Shop.CardListView;
	var AccountListView = CardListView.subclass({
		constructor : CardListView.prototype.constructor
	});
	AccountListView.proto({
		// 重载loadTemplates
		// 加载View层所需要的模板
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_card')),
				addAccountTpl = Handlebars.compile(Hualala.TplLib.get('tpl_addAccount_Card'));
			// 注册accountCard子模板
			Handlebars.registerPartial("accountCard", Hualala.TplLib.get('tpl_account_card'));
			Handlebars.registerPartial("addAccountCard", Hualala.TplLib.get('tpl_addAccount_Card'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		// 重载initLayout
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			this.$container.append(htm);
			this.$resultBox = this.$container.find('.account-list');
			this.$list = this.$container.find('.account-list-body');
			this.$pager = this.$container.find('.page-selection');
			this.initPager();
			this.bindEvent();
			this.bindCardEvent();
		},
		bindCardEvent : function () {
			var self = this;
			self.$list.on('click', '.btn.withdraw', function (e) {
				var $btn = $(this);
				var settleAccountID = $btn.parents('.bank-card').attr('data-id');
				// 提现操作
				var modal = new WithdrawCashView({
					triggerEl : $btn,
					settleUnitID : settleAccountID,
					model : self.model.getAccountModelByID(settleAccountID),
					parentView : self
				});
			});
			self.$list.on('click', '.create-account', function (e) {
				var $btn = $(this);
				// TODO 创建账户
				
			});
			self.on({
				'updateSettleBalance' : function (mAccount) {
					var settleUnitID = mAccount.get('settleUnitID'),
						settleBalance = mAccount.get('settleBalance');
					self.$container.find('[data-id=' + settleUnitID + '] .cash > strong').html(settleBalance);
				}
			});
		},
		// 重载格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (account, i, l) {
				var settleUnitID = $XP(account, 'settleUnitID'),
					hasDefault = $XP(account, 'defaultAccount', 0) == 0 ? false : true,
					bankInfo = Hualala.Common.mapBankInfo($XP(account, 'bankCode')),
					bankAccountStr = Hualala.Common.codeMask($XP(account, 'bankAccount', ''), 0, -4);

				return {
					settleUnitID : settleUnitID,
					hasDefault : hasDefault,
					settleUnitName : $XP(account, 'settleUnitName', ''),
					settleBalance : parseFloat($XP(account, 'settleBalance', 0)),
					bankIcon : $XP(bankInfo, 'icon_16', ''),
					bankComName : $XP(bankInfo, 'name', ''),
					bankAccountStr : $XP(bankAccountStr, 'val', '').replace(/([\w|*]{4})/g, '$1 ').replace(/([*])/g, '<span>$1</span>'),
					shopCount : parseInt($XP(account, 'shopCount', 0)),
					path : Hualala.PageRoute.createPath('accountDetail', [settleUnitID])
				};
			});
			return {
				accountCard : {
					list : ret
				}
			}
		},
		// 重载渲染列表
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'Page.pageNo');
			var accounts = model.getAccounts(pageNo);
			var renderData = self.mapRenderData(accounts);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			self.$list.empty();
			self.$list.html(html);
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		}
		
	});

	Hualala.Account.AccountListView = AccountListView;

	var WithdrawCashView = Stapes.subclass({
		/**
		 * 提现窗口
		 * @param  {Object} cfg {triggerEl, settleUnitID, model}
		 *              @param {jQueryObj} triggerEl 触发元素
		 *              @param {String} settleUnitID 结算账户ID
		 *              @param {Object} model 结算账户数据模型
		 *              @param {Object} parentView 父级View层
		 * @return {Obj}     提现实例
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl');
			this.settleUnitID = $XP(cfg, 'settleUnitID', null);
			this.model = $XP(cfg, 'model', null);
			this.parentView = $XP(cfg, 'parentView', null);
			this.modal = null;
			if (!this.settleUnitID || !this.model) {
				throw("Withdraw Cash View init failed!");
			}
			this.loadTemplates();
			this.initModal();
			this.renderForm();
			this.bindEvent();
			this.emit('show');		
		}
	});

	WithdrawCashView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_withdraw_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'account_withdraw',
				clz : 'service-modal',
				title : '结算账户提现',
				afterRemove : function () {

				}
			});
		},
		mapFormElsData : function () {
			var self = this,
				accountInfoKeys = [
					{key : 'settleUnitName', label : '结算账户名称'},
					{key : 'receiverName', label : '开户名'},
					{key : 'bankName', label : '开户行'},
					{key : 'bankAccount', label : '账号'},
					{key : 'settleBalance', label : '账户余额'}
				],
				accountInfo = _.map(accountInfoKeys, function (el) {
					var k = $XP(el, 'key');
					return {
						label : $XP(el, 'label', ''),
						value : k == 'settleBalance' ? ('<strong>' + self.model.get(k) + '</strong>元') : self.model.get(k)
					};
				});
			return {
				accountInfo : accountInfo,
				formClz : 'account-withdraw-form',
				labelClz : 'col-sm-4 control-label',
				clz : 'col-sm-7',
				id : 'transAmount',
				label : '请输入提现金额',
				name : 'transAmount',
				value : self.model.get('settleBalance')
			};
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl(renderData);
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'submit', label : '立即提现'}
				]
			}));
		},
		bindEvent : function () {
			var self = this;
			this.on({
				show : function () {
					this.modal.show();
				},
				hide : function () {
					this.modal.hide();
					this.parentView.emit('updateSettleBalance', self.model);
				}
			});
			self.modal._.dialog.find('.btn').on('click', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
				} else {
					var bv = self.modal._.body.find('form').data('bootstrapValidator');
					$btn.button('提交中...');
					bv.validate();
				}
			});
			self.modal._.body.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : {
					transAmount : {
						validators : {
							notEmpty : {
								message : "提现金额不能为空"
							},
							numeric : {
								message: "提现金额必须为数字"
							},
							greaterThan : {
								inclusive : false,
								value : 0,
								message : "提现金额必须大于0"
							},
							lessThan : {
								inclusive : true,
								value : self.model.get('settleBalance')
							},
							accuracy : {
								accuracy : 2,
								message : "输入现金只能精确到小数点后2位"
							}
						}
					}
				}
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				var formParams = self.serializeForm();
				self.model.emit('withdrawCash', {
					params : formParams,
					failFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
					},
					successFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
						self.emit('hide');
					}
				})
			});
		},
		serializeForm : function () {
			var self = this,
				$body = self.modal._.body;
			return {
				transAmount : $body.find('#transAmount').val()
			};
		}

	});

	Hualala.Account.WithdrawCashView = WithdrawCashView;
})(jQuery, window);