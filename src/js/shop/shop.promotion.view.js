(function ($, window) {
	IX.ns("Hualala.Shop");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;
	var LoadingModal = Hualala.UI.LoadingModal;
	var ShopPromotionHeaderCfg = [
			{key : "startDate", clz : "date col-md-2", label : "促销日期"},
			{key : "timeID", clz : "timeID col-md-1", label : "促销时段"},
			{key : "holidayFlag", clz : "holidayFlag col-md-1", label : "节假日"},
			{key : "supportOrderType", clz : "supportOrderType col-md-1", label : "业务类型"},
			{key : "tag", clz : "tag col-md-1", label : "促销方式"},
			{key : "rulesDesc", clz : "text col-md-3", label : "促销描述"},
			{key : "action", clz : "status col-md-2", label : "促销开关"},	
			{key : "rowControl", clz : "rowControl ", label : "操作"}
		];
	var PromotionView = Stapes.subclass({
		constructor : function () {
			// View层容器
			this.$container = null;
			this.$resultBox = null;
			this.$result =null;
			this.loadingModal = new LoadingModal({start : 100});
			this.loadTemplates();
		}
	});
	PromotionView.proto({
		init : function (cfg) {
			this.$container = $XP(cfg, 'container', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.$container || !this.model) {
				throw("promotion View Init Failed!");
				return;
			}
			this.initLayout();
		},
		loadTemplates : function () {
			var promotionTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_add')),
				RefRulesTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_refRules')),
	            layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout')),
	            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
	           	Handlebars.registerHelper('chkColType', function (conditional, options) {
					return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
				});
				Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
			this.set({
				promotionTpl : promotionTpl,
				RefRulesTpl : RefRulesTpl,
				layoutTpl : layoutTpl,
				resultTpl : resultTpl
			});
		},
		initLayout : function () {
			var self = this,layoutTpl = this.get('layoutTpl');
			var htm = layoutTpl();
			self.$container.append(htm);
			self.$resultBox = this.$container.find('.shop-list');
			self.$result = this.$container.find('.shop-list-body')
			self.bindEvent();
		},
		mapColItemRenderData : function(row, rowIdx, colKey) {
			var self = this;
			var r = {value : "", text : ""}, v = $XP(row, colKey, '');
			var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
			switch(colKey) {
				// 各列参数
				case "wholeDay":
					var label = v=="0"?"否":"是";
						r.value = v;
						r.text =label;
					break;
				case "holidayFlag":
					var holidayFlags = Hualala.TypeDef.MCMDataSet.GiftIsHolidayUsing,
						holidayFlag = _.find(holidayFlags, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(holidayFlag, 'label', '');
						r.value = v;
						r.text =label;
					break;
				case "startDate":
					r.value = v;
					var start = v, end = $XP(row, 'endDate', '');
					start = (IX.isEmpty(start) || start == 0) ? '' : IX.Date.getDateByFormat(formatDateTimeValue(start), 'yyyy/MM/dd');
					end = (IX.isEmpty(end) || end == 0) ? '' : IX.Date.getDateByFormat(formatDateTimeValue(end), 'yyyy/MM/dd');
					r.text = IX.isEmpty(start) || IX.isEmpty(end) ? '' : (start + '至' + end);
					break;
				case "supportOrderType":
					var supportOrderTypes = Hualala.TypeDef.ShopPromotionDataSet.supportOrderTypes,
						supportOrderType = _.find(supportOrderTypes, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(supportOrderType, 'label', '');
						r.value = v;
						//r.text = v=="2"?"全部":label;
						r.text =label;
						
					break;
				case "tag":
					var tagTypes = Hualala.TypeDef.ShopPromotionDataSet.tagTypes,
						tagType = _.find(tagTypes, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(tagType, 'label', '');
						r.value = v;
						r.text =label;
					break;
				case "rulesDesc" :
					var label = Hualala.Common.decodeTextEnter(v)|| "";
						r.value = label;
						r.text = label;
					break;
				case "action":
				    r.value = v;
                    r.text = '<input type="checkbox" name="switchpromotion" data-status="' + v + '" data-id="' + $XP(row, 'itemID') + '"/>';
                    break;
				case "rowControl":
					r = {
						type : 'button',
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'operate btn-link edit-promotion',
								id : $XP(row, 'itemID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'operate btn-link delete-promotion',
								id : $XP(row, 'itemID', ''),
								key : $XP(row, '__id__'),
								type : 'delete'
							}
						]
					};

					break; 
				default :
					r.value = r.text = $XP(row, colKey, '');
					break;
			}
			return r;
		},
		//组装表格
        mapRenderData : function(records) {
            var self = this;
            var tblClz = "table table-hover ix-data-report printer-grid promotions-grid",
                tblHeaders = IX.clone(ShopPromotionHeaderCfg);
            var mapColsRenderData = function (row, idx) {
                var colKeys = _.map(tblHeaders, function (el) {
                    return {key: $XP(el, 'key', ''), clz: $XP(el, 'clz', '')};
                });
                var col = {clz: '', type: 'text'};
                var cols = _.map(colKeys, function (k, i) {
                    var r = self.mapColItemRenderData(row, idx, $XP(k, 'key', ''));
                    return IX.inherit(col, r, {clz: $XP(k, 'clz', '')});
                });
                return cols;
            };
            var rows = _.map(records, function (row, idx) {
                return {
                    clz: '',
                    cols: mapColsRenderData(row, idx)
                };
            });
            return {
                tblClz: tblClz,
                noRef : records && records.refPromotionRulesDesc? false :true,
                isEmpty: !records || records.length == 0 ? true : false,
                colCount: tblHeaders.length,
                thead: tblHeaders,
                rows: rows
            };

        },
        mapRenderRefData : function (records) {
        	return {
        		noRef : false,
                refShopName:records.refShopName,
                refPromotionRulesDesc :records.refPromotionRulesDesc
        	}
        },
		render : function () {
			var self = this,
				model = self.model;
				var resultTpl = self.get('resultTpl'),
					RefRulesTpl = self.get('RefRulesTpl');
					promotionTpl = self.get('promotionTpl');
				self.$result.removeClass("row");
				self.$container.find('.promotion_operate').remove();
			//套用状态下显示的数据
			if(promotions.refShopName){
				self.$resultBox.before($(promotionTpl(self.mapRenderRefData(promotions))));
				renderData = self.mapRenderRefData(promotions);
				htm = RefRulesTpl(renderData);
				self.$result.empty();
				self.$result.html(htm);
			}
			//非套用状态下显示的数据
			else{
				self.$resultBox.before($(promotionTpl(self.mapRenderData(promotions.records))));
				var renderData = self.mapRenderData(promotions.records);
				var	htm = resultTpl(renderData);
				self.$result.empty();
				self.$result.html(htm);
				var $checkbox = self.$result.find('table tr td input[type="checkbox"]');
				self.initPromationSwitcher.call(self, $checkbox);
			}
		},
		//开关渲染
        initPromationSwitcher : function ($checkbox) {
        	var shopID = $XP(Hualala.PageRoute.getPageContextByPath(), 'params', [])[0];
        	var self = this;
            $checkbox.each(function () {
                var $el = $(this),
                    onLabel = '已启用',
                    offLabel = '未启用';
                $el.bootstrapSwitch({
                    state: !!$el.data('status'),
                    size : 'normal',
                    onColor : 'success',
                    offColor : 'default',
                    onText : onLabel,
                    offText : offLabel
                }).on('switchChange.bootstrapSwitch', function (e, state) {
                    var itemID = $el.attr('data-id');
                    var actStr = (state == 1 ? "开启" : "关闭");
                    Hualala.UI.Confirm({
                        title : actStr + "促销规则",
                        msg : "你确定要" + actStr + "该促销规则吗？",
					okFn : function () {
						self.emit('switchPromotion', {
							itemID : itemID,
							action : +state,
							shopID : shopID,
							successFn : function (res) {
								toptip({
									msg : actStr + '促销规则成功',
									type : 'success'
								});
							},
							faildFn : function (res) {
								$el.bootstrapSwitch('toggleState', true);
								toptip({
									msg : $XP(res, 'resultmsg', ''),
									type : 'danger'
								});
							}
						});
					},
					cancelFn : function () {
						$el.bootstrapSwitch('toggleState', true);
					}
                    });

                });
            });
        },
        //绑定事件
		bindEvent : function () {
			var self = this;
			self.$container.on('click', '.operate', function (e) {
				var $btn = $(this),
					act = $btn.attr('data-type'),
					itemID = $btn.attr('data-id');
				var shopID = $XP(Hualala.PageRoute.getPageContextByPath(), 'params', [])[0];
				switch (act) {
					// TODO promotion add and edit
					case 'edit':
						// TODO edit promotion set
						var promotionModel = self.model.getRecordModelByID(itemID);
							promotionModel.set({shopID: shopID, itemID: itemID});
						var wizardPanel = new Hualala.Shop.PromotionWizardModal({
							wizardType :'edit',
							parentView : self,
							mode : 'edit',
							successFn : function () {
							},
							failFn : function () {
							},
							model : promotionModel,
							modalClz : 'shop-promotion-modal',
							wizardClz : 'mcm-event-wizard',
							modalTitle :'编辑促销规则',
							onWizardInit : function ($cnt, cntID, wizardMode) {
								Hualala.Shop.initPromotionBaseInfoStep.call(this, $cnt, cntID, wizardMode);
							},
							onStepCommit : function (curID) {
								Hualala.Shop.onPromotionWizardStepCommit.call(this, curID);
							},
							onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
								Hualala.Shop.onPromotionWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
							},
							bundleWizardEvent : function () {
								Hualala.Shop.bundlePromotionWizardEvent.call(this);
							},
							wizardStepsCfg : Hualala.Shop.PromotionWizardCfg,
							wizardCtrls : Hualala.Shop.WizardCtrls

						});
						break;
					case 'addPromotion':
						// TODO edit promotion set
					var BasePromotionModel = new Hualala.Shop.BasePromotionModel();
						BasePromotionModel.set({shopID: shopID, itemID: itemID});
					var wizardPanel = new Hualala.Shop.PromotionWizardModal({
							wizardType :'create',
							parentView : self,
							mode : 'create',
							successFn : function () {
							},
							failFn : function () {
							},
							model : BasePromotionModel,
							modalClz : 'shop-promotion-modal',
							wizardClz : 'mcm-event-wizard',
							modalTitle :'添加促销规则',
							onWizardInit : function ($cnt, cntID, wizardMode) {
								Hualala.Shop.initPromotionBaseInfoStep.call(this, $cnt, cntID, wizardMode);
							},
							onStepCommit : function (curID) {
								Hualala.Shop.onPromotionWizardStepCommit.call(this, curID);
							},
							onStepChange : function ($curNav, $navBar, cIdx, nIdx) {
								Hualala.Shop.onPromotionWizardStepChange.call(this, $curNav, $navBar, cIdx, nIdx);
							},
							bundleWizardEvent : function () {
								Hualala.Shop.bundlePromotionWizardEvent.call(this);
							},
							wizardStepsCfg : Hualala.Shop.PromotionWizardCfg,
							wizardCtrls : Hualala.Shop.WizardCtrls

						});
						break;
					case 'delete':
					// TODO delete promotion set
						Hualala.UI.Confirm({
							title : '删除促销信息',
							msg : '您确定删除么？删除后该促销规则的信息将被清空，无法再进行任何操作。',
							okLabel : '删除',
							okFn : function () {
								self.emit('deleteItem', {
									shopID : shopID,
									itemID : itemID,
									successFn : function (res) {
										toptip({
											msg : '删除成功',
											type : 'success'
										});
										var $tr = $btn.parents('tr'),
											$ruleRow = $tr.next('.gift-rule');
										$tr.remove();
										$ruleRow.remove();
									},
									faildFn : function (res) {
										toptip({
											msg : $XP(res, 'resultmsg', ''),
											type : 'danger'
										});
									}
								});
							}
						});
						break;
					//套用
					case 'refPromotionRules':
						IX.Debug.info("套用其它店铺或修改套用店铺促销信息");
						self.bindModal = new Hualala.Shop.BindShopModal({
							trigger : $btn,
							model : self.model,
							parentView : self,
							shopID :shopID
						});
						break;
					//取消套用
					case 'cancelrefPromotionRules':
			            Hualala.Global.cancelRefPromotionRules({shopID: shopID}, function (rsp) {
	                        if (rsp.resultcode != '000') {
	                            toptip({msg: rsp.resultmsg, type: 'danger'});
	                            return;
	                        }
	                        else{
								//toptip({msg: '操作成功', type: 'success'});
		                        var cbFn = function () {
									self.emit('render');
								};
								self.emit('loading');
								self.model.load({shopID : shopID}, cbFn);
	                        }
		           		});
						break;
				}	
			});
		},
		hideLoadingModal : function () {
			this.loadingModal.hide();
		},
		showLoadingModal : function () {
			this.loadingModal.show();
		}
	});
	Hualala.Shop.PromotionView = PromotionView;
})(jQuery, window);

(function ($, window) {
	IX.ns("Hualala.Shop");
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
		updateItemsCache : function (itemID, checked) {
			var self = this;
			var itemsCache = self.get('itemsCache');
				itemsCache = itemID;
			self.set('itemsCache', itemsCache);
		},
		// 格式化渲染数据
		mapRenderData : function (data) {
			var self = this;
			var mPromotion = self.get('promotionModel'),
				refPromot = promotions.refPromotShopID,
				items = refPromot=="0" ? [] : refPromot;
			var itemsCache = self.get('itemsCache');
			itemsCache = !itemsCache ? items : itemsCache;
			self.set('itemsCache', itemsCache);
			var ret = _.map(data, function (shop, i, l) {
				var shopID = $XP(shop, 'shopID'),
					checked = !(itemsCache==shopID)? '' : 'checked';
				return IX.inherit(shop, {
					type :'radio',
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
					itemID = $el.val();
				self.updateItemsCache(itemID,checked);
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
			var mPromotion = self.get('promotionModel');
			mPromotion.updateRefBind(self.get('itemsCache'));
		}
	});

	Hualala.Shop.QueryShopResultView = QueryShopResultView;
})(jQuery, window);
