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
				if ($btn.hasClass('disabled')) return;
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
				var editAccount = new Hualala.Account.AccountEditView({
					triggerEl : $btn,
					mode : 'add',
					model : null,
					parentView : self
				});
			});
			self.on({
				'updateSettleBalance' : function (mAccount) {
					var settleUnitID = mAccount.get('settleUnitID'),
						settleBalance = mAccount.get('settleBalance');
					self.$container.find('[data-id=' + settleUnitID + '] .cash > strong').html(settleBalance);
				}
			});
		},
		chkCtrlRight : function () {
			var self = this;
			var curPageRight = Hualala.Common.getCurPageUserRight();
			var disabled = $XP(curPageRight, 'right.disabled', []),
				enabled = $XP(curPageRight, 'right.enabled', []);
			_.each(disabled, function (n) {
				self.$list.find('[data-btn-name=' + n + ']').attr('disabled', true).addClass('invisible');
			});
			_.each(enabled, function (n) {
				self.$list.find('[data-btn-name=' + n + ']').attr('disabled', false).removeClass('invisible');
			});
		},
		// 重载格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (account, i, l) {
				var settleUnitID = $XP(account, 'settleUnitID'),
					hasDefault = $XP(account, 'defaultAccount', 0) == 0 ? false : true,
					bankInfo = Hualala.Common.mapBankInfo($XP(account, 'bankCode')),
					bankAccountStr = Hualala.Common.codeMask($XP(account, 'bankAccount', ''), 0, -4),
					settleBalance = parseFloat($XP(account, 'settleBalance', 0));

				return {
					settleUnitID : settleUnitID,
					hasDefault : hasDefault,
					settleUnitName : $XP(account, 'settleUnitName', ''),
					disableWithdraw : settleBalance <= 0 ? 'disabled' : '',
					settleBalance : settleBalance,
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
				pageNo = $XP(pagerParams, 'pageNo');
			var accounts = model.getAccounts(pageNo);
			var renderData = self.mapRenderData(accounts);
			var listTpl = self.get('listTpl');
			var html = listTpl(renderData);
			// self.$list.empty();
			// self.$list.html(html);
			self.emptyBar && self.emptyBar.destroy();
			self.$list.empty();
			if (accounts.length == 0) {
				self.emptyBar = new Hualala.UI.EmptyPlaceholder({
					container : self.$list
				});
				self.emptyBar.show();
			} else {
				self.$list.html(html);
				self.chkCtrlRight();
			}
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		},
		refresh : function () {
			var self = this;
			// self.render();
			document.location.reload(false);
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
		mapPoundageAmountStr : function (n) {
			return (IX.isEmpty(n) || n == 0) ? '无手续费' : '<strong>' + n + '</strong>元';
		},
		mapPoundageMinAmountStr : function (n) {
			return (IX.isEmpty(n) || n == 0) ? '不限' : ('<strong>' + n + '</strong>元');
		},
		mapFormElsData : function () {
			var self = this,
				accountInfoKeys = [
					{key : 'settleUnitName', label : '结算账户名称'},
					{key : 'receiverName', label : '开户名'},
					{key : 'bankName', label : '开户行'},
					{key : 'bankAccount', label : '账号'},
					{key : 'settleBalance', label : '账户余额'},
					{key : 'poundageAmount', label : '提现手续费'},
					{key : 'poundageMinAmount', label : '免费提现最低金额'}
				];
			var poundageAmount = self.model.get('poundageAmount'),
				poundageMinAmount = self.model.get('poundageMinAmount'),
				warningTextTpl = '<p class="alert alert-warning ">'
					+ '由于提现操作需要向银行缴纳交易手续费<strong>{poundageAmount}</strong>元人民币，<br/>' 
					+ '当提现金额高于<strong>{poundageMinAmount}</strong>(包含<strong>{poundageMinAmount}</strong>)元人民币，手续费由<strong>北京多来点信息技术有限公司</strong>支付；<br/>'
					+ '当提现金额低于<strong>{poundageMinAmount}</strong>元人民币，手续费由<strong>{settleUnitName}</strong>支付。<br/>'
					+ '</p>';
			var warningText = '';
			if (!IX.isEmpty(poundageAmount) && poundageAmount != 0) {
				warningText = warningTextTpl.replaceAll('{poundageAmount}', poundageAmount)
					.replaceAll('{poundageMinAmount}', poundageMinAmount)
					.replaceAll('{settleUnitName}', self.model.get('settleUnitName'));
			}
			var accountInfo = _.map(accountInfoKeys, function (el) {
				var k = $XP(el, 'key');
				var valStr = '';
				switch(k) {
					case 'poundageAmount':
						valStr = self.mapPoundageAmountStr(self.model.get(k));
						break;
					case 'poundageMinAmount':
						valStr = self.mapPoundageMinAmountStr(self.model.get(k));
						break;
					case 'settleBalance':
						valStr = ('<strong>' + self.model.get(k) + '</strong>元');
						break;
					default :
						valStr = self.model.get(k);
						break;
				}
				return {
					label : $XP(el, 'label', ''),
					value : valStr
				};
			});

			return {
				accountInfo : accountInfo,
				warningText : warningText,
				formClz : 'account-withdraw-form form-feedback-out',
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
								message : "请输入提现金额"
							},
							numeric : {
								message: "提现金额必须为数字"
							},
							greaterThan : {
								inclusive : false,
								value : self.model.get('poundageAmount') || 0,
								message : "提现金额必须大于" + self.model.get('poundageAmount') || 0
							},
							lessThan : {
								inclusive : true,
								value : self.model.get('settleBalance'),
								message : "提现金额不能超过账户余额"
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

	var QueryTransFormElsCfg = {
		transCreateTime : {
			type : 'section',
			label : '日期',
			min : {
				type : 'datetimepicker',
				surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {}
				}
			},
			max : {
				type : 'datetimepicker',
				surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {}
				}
			}
		},
		transAmount : {
			type : 'section',
			label : '金额',
			min : {
				type : 'text',
				prefix : '￥',
				surfix : '元',
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
				prefix : '￥',
				surfix : '元',
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
		transStatus : {
			type : 'combo',
			label : '状态',
			defaultVal : '',
			options : Hualala.TypeDef.FSMTransStatus,
			validCfg : {
				validators : {
					
				}
			}
		},
		transType : {
			type : 'combo',
			label : '类型',
			defaultVal : '',
			options : Hualala.TypeDef.FSMTransType,
			validCfg : {
				validators : {
					
				}
			}
		},
		button : {
			type : 'button',
			clz : 'btn btn-block btn-warning',
			label : '查询'
		}
	};
	var QueryTransFormElsHT = new IX.IListManager();
	_.each(QueryTransFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-xs-2 col-sm-2 col-md-2 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k == 'transCreateTime' ? 'transCreateBeginTime' : 'minTransAmount',
				maxName = k == 'transCreateTime' ? 'transCreateEndTime' : 'maxTransAmount',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-5 col-sm-5 col-md-5',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-5 col-sm-5 col-md-5',
				});
			QueryTransFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else {
			QueryTransFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
			}, $XP(el, 'type') !== 'button' ? {clz : 'col-xs-5 col-sm-8 col-md-5'} : null));
		}
	});
	var TransResultCols = [
		{clz : '', label : '时间'},
		{clz : '', label : '流水号'},
		{clz : '', label : '交易状态'},
		{clz : '', label : '交易类型'},
		{clz : '', label : '交易金额'},
		// {clz : '', label : '佣金'},
		// {clz : '', label : '手续费'},
		{clz : '', label : '交易费用'},
		{clz : '', label : '余额变动'},
		{clz : '', label : '交易后余额'},
		{clz : '', label : '操作'}
	];

	var AccountTransListView = CardListView.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			// 查询表单
			this.$queryForm = null;
			// 结果容器
			this.$resultBox = null;
			// 分页容器
			this.$pager = null;
			this.loadTemplates();
		}
	});
	AccountTransListView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_account_detail')),
				tableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_transaQuery_result'));
			Handlebars.registerPartial("transaQueryForm", Hualala.TplLib.get('tpl_transaQuery_form'));
			Handlebars.registerPartial("transaQueryResult", Hualala.TplLib.get('tpl_transaQuery_result'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				tableTpl : tableTpl
			});
		},
		initLayout : function () {
			var layoutTpl = this.get('layoutTpl');
			var result = [],
				tblClz = 'table-striped table-hover',
				tblHeaders = TransResultCols,
				query = {cols : [
					{
						colClz : 'col-sm-6',
						items : QueryTransFormElsHT.getByKeys(['transCreateTime', 'transAmount'])
					},
					{
						colClz : 'col-sm-4',
						items : QueryTransFormElsHT.getByKeys(['transType', 'transStatus'])
					},
					{
						colClz : 'col-sm-2',
						items : QueryTransFormElsHT.getByKeys(['button'])
					}
				]};
			var htm = layoutTpl({
				query : query,
				result : {
					clz : tblClz,
					thead : tblHeaders,
					rows : result
				}
			});
			this.$container.html(htm);
			this.$queryForm = this.$container.find('.query-form');
			this.$resultBox = this.$container.find('.query-result');
			this.$pager = this.$container.find('.page-selection');
			this.render();
			// this.initPager();
			this.initQueryEls();
			this.bindEvent();
			this.bindQueryEvent();
		},
		initQueryEls : function () {
			var self = this;
			self.$queryForm.find('[data-type=datetimepicker]').datetimepicker({
				format : 'yyyy/mm/dd',
				startDate : '2010/01/01',
				autoclose : true,
				minView : 'month',
				todayBtn : true,
				todayHighlight : true,
				language : 'zh-CN'
			});
			self.$queryForm.on('click', '.input-group-addon', function (e) {
				var $this = $(this),
					$picker = $this.prev(':text[data-type=datetimepicker]');
				if ($picker.length > 0) {
					$picker.datetimepicker('show');
				}
			});
		},
		bindEvent : function () {
			var self = this;
			self.$resultBox.tooltip({
				selector : '[title]'
			});
			self.$resultBox.on('click', '.btn[data-href]', function (e) {
				var $btn = $(this),
					path = $btn.attr('data-href');
				if (!IX.isEmpty(path)) {
					document.location.href = path;
				}
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
		bindQueryEvent : function () {
			var self = this;
			self.$resultBox.on('click', 'a[data-orderkey]', function (e) {
				var $btn = $(this),
					orderKey = $btn.attr('data-orderkey') || '',
					transType = $btn.attr('data-type') || '',
					transID = $btn.attr('data-id') || '',
					orderID = $btn.attr('data-orderid') || '';
				// TODO show transaction detail modal
				var detail = new Hualala.Account.AccountTransDetailModal({
					triggerEl : $btn,
					orderKey : orderKey,
					orderID : orderID,
					transType : transType,
					transID : transID
				});
			});
			self.$queryForm.on('click', '.btn', function (e) {
				// TODO Update modal params and render query result
				var params = self.getQueryFormParams();
				self.model.emit('load', params);
			});
		},
		getQueryFormParams : function () {
			var self = this;
			// var formKeys = ['transCreateBeginTime', 'transCreateEndTime', 'minTransAmount', 'maxTransAmount', 'transType', 'transStatus'];
			var params = self.$queryForm.find('>form').serializeArray();
			var ret = {};
			_.each(params, function (el, i) {
				var k = $XP(el, 'name'), v = $XP(el, 'value', '');
				switch(k) {
					case 'transCreateBeginTime':
					case 'transCreateEndTime':
						if (IX.isEmpty(v)) {
							v = '';
						} else {
							v = IX.Date.getDateByFormat(v, 'yyyyMMddHHmmss');
						}
						break;
					default :
						v = IX.isEmpty(v) ? '' : v;
						break;
				}
				ret[k] = v;
			});
			IX.Debug.info("DEBUG: Account TransList View Query Form Params : ");
			IX.Debug.info(ret);
			return ret;
		},
		mapTimeData : function (s) {
			var r = {value : '', text : ''};
			var s1 = '';
			if (IX.isString(s) && s.length > 0) {
				s1 = s.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
				s1 = IX.Date.getDateByFormat(s1, 'yyyy/MM/dd HH:mm');
				r = IX.inherit({value : s, text : s1});
			}
			return r;
		},
		mapTransStatus : function (s) {
			s = (s + "") || '';
			var status = Hualala.TypeDef.FSMTransStatus;
			var m = _.filter(status, function (el) {
				return $XP(el, 'value', '') == s;
			});
			if (s.length == 0 || m.length == 0) {
				return {text : '', value : ''};
			}
			return {text : $XP(m[0], 'label', ''), value : $XP(m[0], 'value', '')};
		},
		mapTransType : function (s) {
			s = s || '';
			var types = Hualala.TypeDef.FSMTransType;
			var m = _.filter(types, function (el) {
				return $XP(el, 'value', '') == s;
			});
			if (s.length == 0 || m.length == 0) {
				return {text : '', value : ''};
			}
			return {text : $XP(m[0], 'label', ''), value : $XP(m[0], 'value', '')};
		},
		mapCashData : function (s) {
			return {text : Hualala.Common.Math.prettyNumeric(Hualala.Common.Math.standardPrice(s)), value : s};
		},
		mapTransChanged : function (r) {
			var transAmount = $XP(r, 'transAmount', 0),
				transSalesCommission = $XP(r, 'transSalesCommission', 0),
				transPoundage = $XP(r, 'transPoundage', 0),
				transChanged = Hualala.Common.Math.sub(transAmount, transSalesCommission, transPoundage);
			return {value : transChanged, text : Hualala.Common.Math.prettyNumeric(transChanged)};
		},
		mapColsRenderData : function (row) {
			var self = this;
			var colKeys = 'transCreateTime,SUATransItemID,transStatus,transType,transAmount,transactionCost,transChanged,transAfterBalance,rowControl';
			var col = {clz : '', type : 'text'};

			var cols = _.map(colKeys.split(','), function (k, i) {
				var r = null;
				switch(k) {
					case 'transCreateTime':
						r = self.mapTimeData($XP(row, k, ''));
						break;
					case 'SUATransItemID':
						r = {value : $XP(row, k, ''), text : $XP(row, k, '')};
						break;
					case 'transStatus':
						r = self.mapTransStatus($XP(row, k, ''));
						break;
					case 'transType':
						r = self.mapTransType($XP(row, k, ''));
						break;
					case 'transAmount':
					// case 'transSalesCommission':
					// case 'transPoundage':
					case 'transAfterBalance':
						r = self.mapCashData($XP(row, k, ''));
						break;
					case 'transactionCost':
						var transSalesCommission = $XP(row, 'transSalesCommission', 0), transPoundage = $XP(row, 'transPoundage', 0);
						var transactionCost = Hualala.Common.Math.add(transSalesCommission, transPoundage);
						r = self.mapCashData(transactionCost);
						break;
					case 'transChanged':
						r = self.mapTransChanged(row);
						break;
					case 'rowControl':
						var transType = $XP(row, 'transType', ''),
							transStatus = $XP(row, 'transStatus', '');
						var hideBtnTransType = "104,199,202,203,204,205,206,299";
						r = {
							type : 'button',
							btnClz : (hideBtnTransType.indexOf(transType) >= 0 || (transType == "203" && transStatus < 1)) ? 'hidden' : '',
							label : '查看',
							SUATransItemID : $XP(row, 'SUATransItemID', ''),
							transType : transType,
							orderKey : $XP(row, 'orderKey', ''),
							orderID : $XP(row, 'orderID', '')
						};
						break;
				}
				return IX.inherit(col, r);
			});
			return cols;
		},
		mapRenderData : function (data) {
			var self = this;
			var tblClz = 'table-striped table-hover',
				tblHeaders = TransResultCols;
			var rows = _.map(data, function (row) {
				return {
					clz : '',
					cols : self.mapColsRenderData(row)
				};
			});
			return {
				clz : tblClz,
				isEmpty : data.length == 0 ? true : false,
				colCount : tblHeaders.length,
				thead : tblHeaders,
				rows : rows
			};
		},
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
			var results = model.getDataByPageNo(pageNo);
			var renderData = self.mapRenderData(results);
			var tableTpl = self.get('tableTpl');
			var html = tableTpl(renderData);
			self.$resultBox.empty();
			self.$resultBox.html(html);
			self.initPager({
				total : model.get('pageCount'),
				page : model.get('pageNo'),
				href : 'javascript:void(0);'
			});
		}
	});
	Hualala.Account.AccountTransListView = AccountTransListView;

	var AccountQueryShopView = Hualala.Shop.QueryView.subclass({
		constructor : Hualala.Shop.QueryView.prototype.constructor
	});
	Hualala.Account.AccountQueryShopView = AccountQueryShopView;

	var AccountQueryShopResultView = CardListView.subclass({
		constructor : CardListView.prototype.constructor
	});
	AccountQueryShopResultView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_table'));
			// 注册shopCard子模板
			Handlebars.registerPartial("shopTable", Hualala.TplLib.get('tpl_shop_table'));

			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			
			var ret = _.map(data, function (shop, i, l) {
				return {
					clz : '',
					id : $XP(shop, 'shopID', ''),
					name : $XP(shop, 'shopName', ''),
					city : $XP(shop, 'cityName', '')
				};
			});
			return {
				shopTable : {
					isEmpty : !data || data.length == 0 ? true : false,
					colCount : 3,
					rows : ret
				}
			};
		},
		render : function () {
			var self = this,
				model = self.model,
				pagerParams = model.getPagerParams(),
				pageNo = $XP(pagerParams, 'pageNo');
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
		}
	});
	Hualala.Account.AccountQueryShopResultView = AccountQueryShopResultView;
})(jQuery, window);