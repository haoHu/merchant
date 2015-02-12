(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var getGiftTypeSet = HMCM.getGiftTypeSet;

	var GiftDetailPage = Stapes.subclass({
		constructor : function (cfg) {
			this.container = $XP(cfg, 'container');
			this.callServer = Hualala.Global.getMCMGiftDetail;
			this.pageCtx = Hualala.PageRoute.getPageContextByPath();
			this.giftItemID = $XP(this.pageCtx, 'params')[0];
			this.tabViewHT = new IX.IListManager();
			this.$nav = null;
			this.$tabs = null;
			this.mGiftDetail = null;
			this.breadCrumbs = null;
			this.loadTemplates();
			this.bindEvent();
			this.renderLayout();
		}
	});
	GiftDetailPage.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_giftdetail_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns')),
				gridTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerPartial("baseinfo", Hualala.TplLib.get('tpl_gift_detail'));
			Handlebars.registerPartial("card", Hualala.TplLib.get('tpl_gift_card'));
			Handlebars.registerPartial("grid", Hualala.TplLib.get('tpl_base_datagrid'));
			Handlebars.registerHelper('chkColType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl,
				gridTpl : gridTpl
			});
		},
		bindEvent : function () {
			this.on({
				getDetail : function (params) {
					var self = this;
					var post = $XP(params, 'post', {}),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					self.callServer(post, function (res) {
						if ($XP(res, 'resultcode') == '000') {
							successFn.call(self, res);
						} else {
							faildFn.call(self, res);
						}
					});
				}
			}, this);
		},
		initBreadCrumb : function () {
			var self = this,
				$nav = self.$nav,
				parentNames = Hualala.PageRoute.getParentNamesByPath();
			self.breadCrumbs = new Hualala.UI.BreadCrumb({
				container : $nav,
				hideRoot : true,
				nodes : parentNames,
				clz : 'mcm-crumbs',
				clickFn : function () {
					var $this = $(this);
					document.location.href = $this.attr('data-href');
				},
				mapRenderData : function (data, hideRoot, clz) {
					var list = _.map(data, function (el, idx, l) {
						var label = $XP(el, 'label', ''),
							name = $XP(el, 'name', ''),
							path = Hualala.PageRoute.createPath(name, null);
						return {
							clz : 'crumb',
							label : label,
							path : path,
							name : name,
							isLastNode : (data.length - 1 == idx) ? true : false
						};
					});
					hideRoot === true && list.shift();
					list.shift();
					return {
						clz : clz,
						items : list
					};
				}
			});
		},
		mapTabNavData : function (navs) {
			var self = this;
			return _.map(navs, function (nav) {
				return IX.inherit(nav, {
					clz : 'mcm-detail-tab',
					id : $XP(nav, 'value') + '_' + IX.id()
				});
			});
		},
		mapGiftStatisticGridData : function (data) {
			var self = this;
			var tblClz = 'table-striped table-hover table-condensed';
			var records = $XP(data, 'records', []),
				total = $XP(data, 'total', {});
			var getways = _.reject(Hualala.TypeDef.MCMDataSet.GiftDistributeTypes, function (el) {
				return IX.isEmpty(el.value) || !el.include;
			});
			var giftStatus = _.reject(Hualala.TypeDef.MCMDataSet.GiftStatus, function (el) {
				return IX.isEmpty(el.value);
			});
			var genGridHeader = function () {
				var thead = _.map(getways, function (el) {
					return {
						clz : '',
						label : $XP(el, 'label', '')
					};
				});
				thead.push({
					clz : '',
					label : '总计'
				});
				thead.unshift({
					clz : '',
					label : '状态'
				});
				return {
					thead : thead
				};
			};
			var genRowData = function (rowData) {
				var rows = _.map(rowData, function (row) {
					// var giftStatus = $XP(row, 'giftstatus');
					var rowHeader = _.find(giftStatus, function (gs) {
						return $XP(gs, 'value') == $XP(row, 'giftstatus');
					});
					var colkeys = _.map(getways, function (el) {
						return $XP(el, 'value');
					});
					var cols = _.map(colkeys, function (k) {
						var key = 'sum_' + k;
						var val = $XP(row, key, 0);
						return {
							clz : '',
							type : 'text',
							value : val,
							text : val
						}
					});
					cols.unshift({
						clz : '',
						type : 'text',
						value : $XP(row, 'giftstatus'),
						text : $XP(rowHeader, 'label')
					});
					cols.push({
						clz : '',
						type : 'text',
						value : $XP(row, 'totalCount', 0),
						text : $XP(row, 'totalCount', 0)
					});
					return {
						clz : '',
						cols : cols
					};

				});
				return {
					rows : rows
				};
			};
			var genGridFooter = function (total) {
				var cols = _.map(getways, function (getway) {
					var k = $XP(getway, 'value'),
						key = 'count_' + k;
					return {
						clz : '',
						value : $XP(total, key, 0),
						text : $XP(total, key, 0)
					};
				});
				cols.unshift({
					clz : '',
					value : '',
					text : '总计'
				});
				cols.push({
					clz : '',
					value : $XP(total, 'totalCount', 0),
					text : $XP(total, 'totalCount', 0)
				});
				return {
					tfoot : [
						{
							clz : '',
							cols : cols
						}
					]
				};
			};
			return IX.inherit({
				clz : '',
				tblClz : tblClz
			}, genGridHeader(), genRowData(records), genGridFooter(total));

		},
		mapLayoutRenderData : function (data) {
			var self = this;
			var giftData = $XP(data, 'records', [])[0];
			var giftTypeSet = getGiftTypeSet($XP(giftData, 'giftType')),
				navs = $XP(giftTypeSet, 'navs', []);
			var ret = {};
			var card = {
				clz : $XP(giftTypeSet, 'type', ''),
				label : $XP(giftData, 'giftValue', ''),
				unit : $XP(giftTypeSet, 'unit', '')
			};
			ret = IX.inherit(giftData, {
				card : card,
				giftTypeLabel : $XP(giftTypeSet, 'label', ''),
				giftTypeUnit : $XP(giftTypeSet, 'unit', ''),
				infoLabelClz : 'col-sm-2',
				navs : self.mapTabNavData(navs),
				grid : self.mapGiftStatisticGridData($XP(data, 'myGiftDataset.data', {}))
			});
			return ret;
		},
		renderLayout : function () {
			var self = this;
			var giftItemID = self.giftItemID;
			var renderFn = function (data) {
				var layoutTpl = self.get('layoutTpl'),
					renderData = self.mapLayoutRenderData(data);
				var htm = layoutTpl(renderData);
				self.container.html(htm);
				self.$nav = self.container.find('.detail-layout > .nav-bar');
				self.$tabs = self.container.find('.detail-tabs');
				self.initBreadCrumb();
				self.bindPageEvent();
				self.$tabs.find('.nav-tabs a:first').tab('show');
			};
			self.emit('getDetail', {
				post : {giftItemID : giftItemID},
				successFn : function (res) {
					self.mGiftDetail = new HMCM.BaseGiftModel($XP(res, 'data', {}));
					renderFn($XP(res, 'data', {}));
				},
				faildFn : function (res) {

				}
			});
		},
		bindPageEvent : function () {
			var self = this;
			self.$tabs.find('.nav-tabs a[data-toggle=tab]').on('shown.bs.tab', function (e) {
				var $tab = $(e.target),
					$tabCnt = $($tab.attr('href')),
					tabCntID = $tabCnt.attr('id');
				var activedTabView = self.getTabView(tabCntID);
				if (!activedTabView) {
					switch (tabCntID) {
						case 'tab_send':
							self.initTabSend($tabCnt);
							break;
						case 'tab_used':
							self.initTabUsed($tabCnt);
							break;
						case 'tab_give':
							self.initTabGive($tabCnt);
							break;
						case 'tab_pay':
							self.initTabPay($tabCnt);
							break;
						case 'tab_onlinesale':
							self.initTabOnlineSale($tabCnt);
							break;
					}
				}
			});
		},
		getTabView : function (id) {
			var self = this,
				tabViewHT = self.tabViewHT;
			return tabViewHT.get(id);
		},
		initTabSend : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var queryKeys = Hualala.MCM.QueryFormKeys.GiftSendStatisticQueryKeys;
			var panel = new HMCM.QueryController({
				container : $tabCnt,
				resultController : new HMCM.QueryResultControler({
					container : $tabCnt,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.queryMCMGiftDetailGetWayInfo,
						queryKeys : queryKeys,
						gridType : 'giftsend',
						recordModel : HMCM.BaseGiftSendModel
					}),
					view : new HMCM.QueryResultView({
						// mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
						mapResultRenderData : HMCM.mapGiftDetailQuerySendRenderData,
						renderResult : HMCM.renderQueryResult,
						bundleEvent : HMCM.bundleGiftsQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : queryKeys
				}),
				view : new HMCM.QueryView({
					mapRenderDataFn : HMCM.mapGiftDetailGetWayQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent
				})

			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabUsed : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var queryKeys = Hualala.MCM.QueryFormKeys.GiftUsedStatisticQueryKeys;
			var panel = new HMCM.QueryController({
				container : $tabCnt,
				resultController : new HMCM.QueryResultControler({
					container : $tabCnt,
					model : new HMCM.GiftMgrResultModel({
						callServer : Hualala.Global.queryMCMGiftDetailUsedInfo,
						queryKeys : queryKeys,
						gridType : 'giftsend',
						recordModel : HMCM.BaseGiftUsedModel
					}),
					view : new HMCM.QueryResultView({
						// mapResultRenderData : HMCM.mapGiftsQueryResultRenderData,
						mapResultRenderData : HMCM.mapGiftDetailQueryUsedRenderData,
						renderResult : HMCM.renderQueryResult,
						bundleEvent : HMCM.bundleGiftsQueryResultEvent
					})
				}),
				model : new HMCM.QueryModel({
					queryKeys : queryKeys
				}),
				view : new HMCM.QueryView({
					mapRenderDataFn : HMCM.mapGiftDetailUsedQueryFormRenderData,
					bundleQueryEvent : HMCM.bundleGiftsQueryEvent
				})

			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabGive : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var panel = new HMCM.MCMGiftDetailFormPanel({
				container : $tabCnt,
				parentView : self,
				formKeys : HMCM.GiftDetailDonateGiftCtrlFormKeys,
				callServer : Hualala.Global.giftDetailDonateGift,
				panelTitle : "赠送",
				mapFormElsData : HMCM.mapDonateGiftFormRenderData,
				initUIComponents : HMCM.initDonateGiftFormUIComponent,
				bundleFormEvent : HMCM.bundleDonateGiftFormEvent
			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabPay : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var panel = new HMCM.MCMGiftDetailFormPanel({
				container : $tabCnt,
				parentView : self,
				formKeys : HMCM.GiftDetailPayGiftCtrlFormKeys,
				callServer : Hualala.Global.giftDetailDonateGift,
				panelTitle : "支付",
				mapFormElsData : HMCM.mapPayGiftFormRenderData,
				initUIComponents : HMCM.initPayGiftFormUIComponent,
				bundleFormEvent : HMCM.bundlePayGiftFormEvent
			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		},
		initTabOnlineSale : function ($tabCnt) {
			var self = this,
				tabViewHT = self.tabViewHT;
			var panel = new HMCM.MCMGiftDetailFormPanel({
				container : $tabCnt,
				parentView : self,
				formKeys : HMCM.GiftDetailPayGiftOnlineCtrlFormKeys,
				callServer : Hualala.Global.giftDetailPayGiftOnline,
				panelTitle : "网上出售",
				mapFormElsData : HMCM.mapPayGiftOnlineFormRenderData,
				initUIComponents : HMCM.initPayGiftOnlineFormUIComponent,
				bundleFormEvent : HMCM.bundlePayGiftOnlineFormEvent
			});
			tabViewHT.register($tabCnt.attr('id'), panel);
		}
	});

	HMCM.GiftDetailPage = GiftDetailPage;
})(jQuery, window);