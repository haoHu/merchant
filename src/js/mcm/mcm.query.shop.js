(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var ShopQueryModel = new Hualala.Shop.QueryModel();
	ShopQueryModel.extend({
		chosenShops : [],
		chosenCitys : [],
		initChosenData : function (shopIDs) {
			var self = this;
			if (IX.isEmpty(shopIDs) || shopIDs.length == 0) {
				return;
			}
			var shops = self.getShops(shopIDs);
			var cities = _.map(shops, function (el) {return $XP(el, 'cityID')});
			cities = self.getCities(_.uniq(cities));
			self.chosenShops = shops;
			self.chosenCitys = cities;
		},
		clearChosenData : function () {
			this.chosenShops = [];
			this.chosenCitys = [];
		},
		getChosenData : function () {
			return {
				cities : this.chosenCitys,
				shops : this.chosenShops
			};
		},
		mapComboOptions : function () {
			var self = this,
				chosenShops = self.chosenShops,
				shops = self.getShops();
			shops = _.reject(shops, function (el) {
				var shopID = $XP(el, 'shopID');
				var matched = _.find(chosenShops, function (_shop) {return $XP(_shop, 'shopID') == shopID});
				return shopID == $XP(matched, 'shopID');
			});
			
			shops = _.groupBy(shops, 'cityID');
			var ret = [];
			_.each(shops, function (_shops, cityID) {
				var city = self.getCities(cityID)[0];
				ret.push({
					cityID : cityID,
					cityName : $XP(city, 'cityName'),
					options : _shops
				});
			});
			IX.Debug.info('DEBUG: Combo Shop Options:');
			IX.Debug.info(ret);
			return ret;
		},
		mapChosenDataOptions : function () {
			var self = this,
				chosenShops = self.chosenShops;
				chosenShops = _.filter(chosenShops, function(chosenShop){ return chosenShop != null;});
			var _chosneShops = _.groupBy(chosenShops, 'cityID');
			var ret = [];
			_.each(_chosneShops, function (_shops, cityID) {
				var city = self.getCities(cityID)[0];
				ret.push({
					cityID : cityID,
					cityName : $XP(city, 'cityName'),
					options : _shops
				})
			});
			IX.Debug.info('DEBUG: Combo Chosen Shop Options:');
			IX.Debug.info(ret);
			return ret;
		}
	});

	HMCM.ShopQueryModel = ShopQueryModel;

	var ChooseShopModal = Stapes.subclass({
		constructor : function (cfg) {
			this.parentView = $XP(cfg, 'parentView');
			this.trigger = $XP(cfg, 'trigger');
			this.modal = null;
			this.$body = null;
			this.model = ShopQueryModel;
			this.model.clearChosenData();
			this.modalTitle = $XP(cfg, 'modalTitle', '');
			this.modalClz = $XP(cfg, 'modalClz', '');
			this.chosenShopIDs = $XP(cfg, 'chosenShopIDs', []);
			this.chosenShopNames = $XP(cfg, 'chosenShopNames', []);

			this.loadTemplates();
			this.initInput();
			this.initModal();
			// this.renderLayout();
		}
	});

	ChooseShopModal.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_mcm_queryshops')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				optGrpTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_optgroup')),
				inputTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_choose'));
			Handlebars.registerPartial("ctrlbtns", Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("optgroup", Hualala.TplLib.get('tpl_shop_optgroup'));
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				optGrpTpl : optGrpTpl,
				inputTpl : inputTpl
			});
		},
		initInput : function () {
			var self = this,
				inputTpl = self.get('inputTpl');
			self.trigger.html(inputTpl({
				shopNames : self.chosenShopNames
			}));
			self.trigger.on('click', '.btn-choose', function (e) {
				self.modal.show();
				self.renderLayout();
				return false;
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : "mcm_choose_shop_modal",
				clz : self.modalClz,
				title : self.modalTitle,
				hideCloseBtn : true,
				backdrop : 'static',
				showFooter : true,
				afterHide : function () {

				}
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			// self.modal.show();
		},
		renderLayout : function () {
			var self = this;
			self.model.init({}, function () {
				self.model.initChosenData(self.chosenShopIDs);
				var chooseShopOptions = self.model.mapComboOptions(),
					chosenShopOptions = self.model.mapChosenDataOptions();
				var layoutTpl = self.get('layoutTpl');
				var renderData = {
					chooseShopOpts : {
						comboName : 'choose_shops',
						items : chooseShopOptions
					},
					chosenShopOpts : {
						comboName : 'chosen_shops',
						items : chosenShopOptions	
					},
					btns : [
						{clz : 'btn-warning btn-block', name : 'add_all', label : '全部添加>>'},
						{clz : 'btn-warning btn-block', name : 'add_items', label : '添加>'},
						{clz : 'btn-warning btn-block', name : 'delete_items', label : '<删除'},
						{clz : 'btn-warning btn-block', name : 'delete_all', label : '<<全部删除>'}
					]
				};
				var htm = layoutTpl(renderData);
				self.$body.html(htm);
				self.bindEvent();
			});
		},
		refreshCombo : function () {
			var self = this;
			var chooseShopOptions = self.model.mapComboOptions(),
				chosenShopOptions = self.model.mapChosenDataOptions();
			var optGrpTpl = self.get('optGrpTpl');
			var comboLeftOpts = optGrpTpl({
					items : chooseShopOptions
				}),
				comboRightOpts = optGrpTpl({
					items : chosenShopOptions
				});
			$('select[name=choose_shops]').html(comboLeftOpts);
			$('select[name=chosen_shops]').html(comboRightOpts);
		},
		bindEvent : function () {
			var self = this;
			self.$body.on('mouseup', 'select.form-control > optgroup', function (e) {
				var $grp = $(this);
				if ($grp.hasClass('open')) {
					$grp.removeClass('open').find('> option').hide();
				} else {
					$grp.addClass('open').find('> option').show();
				}
			});
			self.$body.on('mouseup', 'select.form-control option', function (e) {
				e.stopPropagation();
			});
			self.$body.on('click', '.select-center .btn', function (e) {
				var $btn = $(this), act = $btn.attr('name');
				var $comboLeft = $('select[name=choose_shops]', self.$body),
					$comboRight = $('select[name=chosen_shops]', self.$body);
				var shopIDs = [];
				switch(act) {
					case 'add_all':
						shopIDs = self.model.getShops();
						shopIDs = _.map(shopIDs, function (el) {return $XP(el, 'shopID')});
						self.model.clearChosenData();
						break;
					case 'add_items':
						$comboLeft.find('option:selected').each(function (i, el) {
							shopIDs.push($(el).attr('value'));
						});
						$comboRight.find('option').each(function (i, el) {
							shopIDs.push($(el).attr('value'));
						});
						break;
					case 'delete_all':
						self.model.clearChosenData();
						break;
					case 'delete_items':
						var $unchosenOpts = $comboRight.find('option:not(:selected)');
						if ($unchosenOpts.length == 0) {
							self.model.clearChosenData();
						} else {
							$unchosenOpts.each(function (i, el) {
								shopIDs.push($(el).attr('value'));
							});
						}
						break;
				}
				self.model.initChosenData(shopIDs);
				self.refreshCombo();
			});
			self.$footer.on('click', '.btn-ok', function (e) {
				var $btn = $(this);
				var chosenData = self.model.getChosenData();
				var shopNames = _.pluck($XP(chosenData, 'shops'), 'shopName');
				self.parentView.model.emit('bindShops', chosenData);
				self.trigger.find('.choose-shop-val').html(shopNames.length == 0 ? '不限店铺' : shopNames.join(';'));
				self.modal.hide();
			});
		}
	});

	HMCM.ChooseShopModal = ChooseShopModal;
})(jQuery, window);