(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip,
		LoadingModal = Hualala.UI.LoadingModal;

	/**
	 * 创建礼品向导步骤设置
	 * @type {Array}
	 */
	HMCM.GiftWizardCfg = [
		{id : "gift_base_info", label : "基本信息"},
		{id : "gift_rule", label : "使用规则"}
	];

	/**
	 * 创建活动向导步骤设置
	 * @type {Array}
	 */
	HMCM.EventWizardCfg = [
		{id : "event_base_info", label : "基本信息"},
		{id : "event_rule", label : "活动规则"},
		{id : "event_gift", label : "设置礼品、奖品"},
		{id : "event_on", label : "预览并启用"}
	];

	/**
	 * 向导步骤按钮设置
	 * @type {Array}
	 */
	HMCM.WizardCtrls = [
		{clz : 'btn-default btn-prev', name : 'prev', label : '上一步', loadingText : '请稍候...'},
		{clz : 'btn-default btn-cancel', name : 'cancel', label : '取消', loadingText : '取消'},
		{clz : 'btn-default btn-next', name : 'next', label : '下一步', loadingText : '请稍候...'},
		{clz : 'btn-default btn-finish', name : 'finish', label : '启用', loadingText : '提交中...'}
	];

	var MCMWizardModal = Stapes.subclass({
		/**
		 * 构造向导
		 * @param  {Object} cfg 配置信息
		 *         @param {obj} parentView 父级View层
		 *         @param {String} mode 新建(create)|编辑(edit)模式
		 *         @param {Function} successFn 成功回调 
		 *         @param {Function} failFn 失败回调
		 *         @param {Object} model 数据模型
		 *         @param {String} modalClz 窗口样式类
		 *         @param {String} wizardClz 向导控件样式类
		 *         @param {String} modalTitle 窗口标题
		 *         
		 *         @param {Array} wizardStepsCfg 向导各个步骤的配置
		 *         @param {Array} wizardCtrls 向导控制按钮配置
		 *
		 *         
		 *         @param {Function} onWizardInit 当wizard init时，触发的事件
		 *         @param {Function} onStepCommit 当wizard 步骤切换到下一步时，触发的事件
		 *         @param {Function} onStepChange 当wizard 步骤变换时，触发的事件
		 *         @param {Function} bundleWizardEvent 为向导绑定事件
		 * @return {[type]}     [description]
		 */
		constructor : function (cfg) {
			this.parentView = $XP(cfg, 'parentView');
			this.mode = $XP(cfg, 'mode', 'create');
			this.successFn = $XF(cfg, 'successFn');
			this.faildFn = $XF(cfg, 'faildFn');
			this.modal = null;
			this.$body = null;
			this.$wizard = null;
			this.wizardID = "mcm_wizard";
			this.wizardClz = $XP(cfg, 'wizardClz', '');
			this.wizardStepsCfg = $XP(cfg, 'wizardStepsCfg', []);
			this.wizardCtrls = $XP(cfg, 'wizardCtrls', []);
			this.model = $XP(cfg, 'model', null);
			this.modalClz = $XP(cfg, 'modalClz', '');
			this.modalTitle = $XP(cfg, 'modalTitle', '');
			this.stepViewHT = new IX.IListManager();

			this.onWizardInit = $XF(cfg, 'onWizardInit');
			this.onStepCommit = $XF(cfg, 'onStepCommit');
			this.onStepChange = $XF(cfg, 'onStepChange');

			this.bundleWizardEvent = $XF(cfg, 'bundleWizardEvent');

			this.loadTemplates();
			this.initModal();
			this.renderWizardLayout();
			this.initWizard();
			this.enableGoToNextStep = false;

			this.bundleWizardEvent.call(this);

		}
	});

	MCMWizardModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_wizard_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("stepAction", Hualala.TplLib.get('tpl_shop_modal_btns'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "mcm_wizard_modal",
				clz : self.modalClz,
				title : self.modalTitle,
				hideCloseBtn : true,
				backdrop : 'static',
				showFooter : false,
				afterHide : function () {

				}
			});
			self.$body = self.modal._.body;
			self.modal.show();
		},
		mapWizardLayoutData : function () {
			var self = this,
				stepNavs = [],
				steps = [];
			stepNavs = _.map(self.wizardStepsCfg, function (step, i) {
				steps.push({
					id : $XP(step, 'id')
				});
				return IX.inherit(step, {
					idx : (i + 1)
				});
			});
			return {
				id : self.wizardID,
				clz : self.wizardClz,
				stepNavs : stepNavs,
				steps : steps,
				btns : self.wizardCtrls
			}
		},
		renderWizardLayout : function () {
			var self = this;
			var renderData = self.mapWizardLayoutData(),
				layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl(renderData);
			self.$body.html(htm);
			self.modal.show();
		},
		initWizard : function () {
			var self = this;
			self.$wizard = self.$body.find('#' + self.wizardID);
			self.$wizard.bsWizard({
				tabClass : 'tabClass',
				nextSelector : '.btn[name=next]',
				previousSelector : '.btn[name=prev]',
				finishSelector : '.btn[name=finish]',
				onTabClick : function () {return false;},
				onInit : function ($wizard, $navBar, nIdx) {
					// 加载向导第一步的View层
					var $tab = $('li:eq(' + nIdx + ')', self.$wizard),
						cntID = self.getTabContentIDByIndex($navBar, nIdx),
						$cnt = $('#' + cntID, self.$wizard);
					self.onWizardInit.call(self, $cnt, cntID, self.mode);
				},
				/**
				 * fired next step button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param  {Number} nIdx    下一步的索引值
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 *         
				 */
				onNext : function ($curNav, $navBar, nIdx) {
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					if (self.enableGoToNextStep == false) {
						self.onStepCommit.call(self, curID);
					}
					var ret = self.enableGoToNextStep;
					self.enableGoToNextStep = false;
					return ret;
				},
				/**
				 * fired previous step button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param  {Number} nIdx    下一步的索引值
				 * @return {Boolean}         false:不移动到下一步，true:移动到下一步
				 */
				onPrevious : function ($curNav, $navBar, nIdx) {
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					return true;
				},
				/**
				 * fired when a tab is changed
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param  {Number} nIdx    下一步的索引值
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onTabChange : function ($curNav, $navBar, cIdx, nIdx) {
					self.onStepChange.apply(self, arguments);
				},
				/**
				 * fired when a tab is shown
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onTabShow : function ($curNav, $navBar, cIdx) {

				},
				/**
				 * fired when finish button is clicked
				 * @param  {jQueryObj} $curNav 当前步骤的导航标签
				 * @param  {jQueryObj} $navBar 导航栏
				 * @param {Number} cIdx 当前步骤的索引
				 * @return {Boolean} false:不移动到下一步，true:移动到下一步
				 */
				onFinish : function ($curNav, $navBar, cIdx) {
					// console.info('onFinish');
					var $curTab = $($curNav.find('a[data-toggle]').attr('href')),
						curID = $curTab.attr('id');
					self.onStepCommit.call(self, curID);
				}

			});
		},
		switchWizardCtrlStatus : function (status) {
			var self = this;
			self.$wizard.find('.wizard-ctrl .btn').button(status);
		},
		getNextStep : function () {
			var self = this;
			self.enableGoToNextStep = true;
			self.$wizard.bsWizard('next');
		},
		getPrevieousStep : function () {
			var self = this;
			self.enableGoToNextStep = true;
			self.$wizard.bsWizard('previeous');
		},
		getTabContentIDByIndex : function ($navBar, idx) {
			var $tab = $('li:eq(' + idx + ')', $navBar),
				id = $tab.find('a[data-toggle]').attr('href').replace('#', '');
			return id;
		},
		registerStepView : function (cntID, stepView) {
			var self = this;
			self.stepViewHT.register(cntID, stepView);
		},
		getStepView : function (cntID) {
			return this.stepViewHT.get(cntID);
		},
		switchViewMode : function (mode) {
			this.mode = mode;
		}
	});

	HMCM.MCMWizardModal = MCMWizardModal;
	

})(jQuery, window);