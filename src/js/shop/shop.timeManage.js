(function ($, window) {
	IX.ns("Hualala.Shop");
	var G = Hualala.Global,
		U = Hualala.UI,
		topTip = U.TopTip,
		parseForm = Hualala.Common.parseForm,
		isActiveData = Hualala.TypeDef.ShopDiscountDataSet.DiscountIsActive;
	Hualala.Shop.initTimeMgr = function ($container,shopID,cityID) {
		//时段表头
		//餐段名称|开始时间|结束时间|是否启用|是否线上(0.线下（saas）1.线上)|操作
		var ShopTimeHeaderCfg = [
			{key : "timeName", clz : "timeName", label : "餐段名称"},
			{key : "startTime", clz : "startTime", label : "开始时间"},
			{key : "endTime", clz : "endTime", label : "结束时间"},
			{key : "isActive", clz : "status", label : "是否启用"},
			{key : "rowControl", clz : "rowControl", label : "操作"}
		],
		TimeAddTpl,layoutTpl,resultTpl,editModalTpl,queryTpl,filterTpl,listTpl,itemTpl,timePeriods=null,refShop=null,
		cityHT={},areaHT={},shopHT={};
		initTemplate();
		renderTable();
		bindEvent();
		function initTemplate() {
			TimeAddTpl = Handlebars.compile(Hualala.TplLib.get('tpl_Time_add'));
            layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout'));
            editModalTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_shoptime'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
           	Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            refShopTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop'));
            queryTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_query'));
			filterTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_filter'));
			listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_list'));
			itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerPartial("settleItem", Hualala.TplLib.get('tpl_settle_item'));
			// 注册子模板
			Handlebars.registerPartial("shopCity", Hualala.TplLib.get('tpl_shop_filter'));
			Handlebars.registerPartial("toggle", Hualala.TplLib.get('tpl_site_navbarToggle'));
            Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $container.append($(layoutTpl()));
        }
        //获取数据
        function renderTable() {
            var initParams = {shopID: shopID},existRefShopName=null,refTimeShopID=null;
            var Refflag = false;
            G.queryShopTime(initParams, function(rsp) {
                if (rsp.resultcode == '000') {
                    timePeriods = rsp.data.records;
                    refTimeShopID=rsp.data.refTimeShopID;
	                //当没有数据的话，要进行数据的初始化
	                if(timePeriods==undefined&&refTimeShopID=="0"){
	                	firstInitShopTime(shopID,cityID);
	                }
	                else{
                    	existRefShopName = rsp.data.refTimeShopName
	                	if(existRefShopName!=undefined){
	                		Refflag = true;
	            			timePeriods = rsp.data;
	            			refShop = timePeriods;
							renderRecords(timePeriods,Refflag); 
	            		}
	            		else{
	                		renderRecords(timePeriods,Refflag); 
	                	}
	                }   
                }
                else {
                    topTip({type: 'danger', msg: rsp.resultmsg});
                }
            });
        }
       function firstInitShopTime(initParams,cityID){
       	    G.initShopTime({shopID: shopID, cityID: cityID}, function (rsp) {
                if (rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                renderTable();
            });
       }
        //数据渲染
        function renderRecords(records,flag) {
        	$resultBox = $container.find('.shop-list');
        	$container.find('.Time_operate').remove();
        	if(flag==false){
	        	$resultBox.before($(TimeAddTpl(mapRenderData(records))));
	        	$result = $container.find('.shop-list-body');
	        	$result.removeClass("row");
	        	$result.empty();
	            $result.html($(resultTpl(mapRenderData(records))));
	            initPromationSwitcher($result.find('table tr td input[type="checkbox"]'));
            }
            else{
	        	$resultBox.before($(TimeAddTpl(mapRenderData(records))));
	        	$result = $container.find('.shop-list-body');
	        	$result.removeClass("row");
	        	$result.empty();
	        	if(records.records){
	           		$result.html($(resultTpl(mapRenderData(records.records))));
	        	}
	            $result.find("table tr td .rowControl a").addClass("hidden");
	            $result.find("table tr td input[name=isActive]").prop("disabled",true);

            }
		}
		//开关渲染
        function initPromationSwitcher($checkbox) {
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
                    var timeID = $el.attr('data-id');
                    var actStr = (state == 1 ? "开启" : "关闭");
                    U.Confirm({
                        title : actStr + "餐段",
                        msg : "你确定要" + actStr + "该餐段吗？",
                        okFn : function () {
                            switchTime(timeID, +state)
                        },
                        cancelFn : function () {
                            $el.bootstrapSwitch('toggleState', true);
                        }
                    });

                });
            });
        }
         //开启或关闭餐段
        function switchTime(timeID, state) {  
            G.switchShopTime({shopID: shopID, timeID: timeID, isActive: state}, function (rsp) {
                if (rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '操作成功！', type: 'success'});
                renderTable();
            });
        }
		function mapColItemRenderData(row, rowIdx, colKey) {
			var self = this;
			var ctx = Hualala.PageRoute.getPageContextByPath(), pageName = $XP(ctx, 'name'),
				r = {value : "", text : ""}, v = $XP(row, colKey, '');
			var formatDateTimeValue = Hualala.Common.formatDateTimeValue;
			switch(colKey) {
				// 各列参数
				case "startTime":
				case "endTime":
					var label=decodeTimeStr(v);
						r.value = v;
						r.text = label;
					break;
				case "isActive":
				    r.value = v;
                    r.text = '<input type="checkbox" name="isActive" '+ (v != "0" ? 'checked ' : '') +'data-status="' + v + '" data-id="' + $XP(row, 'timeID') + '"/>';
                    break;
				case "rowControl":
					r = {
						type : 'button',
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'operate btn-link edit-time',
								id : $XP(row, 'timeID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							}
						]
					};
					break; 
				default :
					r.value = r.text = $XP(row, colKey, '');
					break;
			}
			return r;
		}
		function decodeTimeStr(t) {
			if (t.length == 0) return '';
			return t.substr(0,2) + ':' + t.substr(2);
		}
		function encodeTimeStr(t) {
			return t.replace(/\:/g, '');
		}
		//组装表格
        function mapRenderData(records) {
            var self = this;
            var tblClz = "table table-hover ix-data-report printer-grid",
                tblHeaders = IX.clone(ShopTimeHeaderCfg);
            var mapColsRenderData = function (row, idx) {
                var colKeys = _.map(tblHeaders, function (el) {
                    return {key: $XP(el, 'key', ''), clz: $XP(el, 'clz', '')};
                });
                var col = {clz: '', type: 'text'};
                var cols = _.map(colKeys, function (k, i) {
                    var r = mapColItemRenderData(row, idx, $XP(k, 'key', ''));
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
            var reftimeshop = G.cancleRefShopTime({shopID: shopID}, function (rsp) {
	                        if (rsp.resultcode != '000') {
	                            return true;
	                        }else{
	                        	return false;	
	                        }
		           		});
            if(records.refTimeShopName){

            	return {
	                tblClz: tblClz,
	                noRef : false,
	                reftimeshop: reftimeshop,
               		refTimeShopName:records.refTimeShopName,
	                isEmpty: !records || records.length == 0 ? true : false,
	                colCount: tblHeaders.length,
	                thead: tblHeaders,
	                rows: rows
	            };

	        }
	        else{
	        	return {
	                tblClz: tblClz,
	                reftimeshop: reftimeshop,
	                noRef : records && records.refTimeShopName? false :true,
	                isEmpty: !records || records.length == 0 ? true : false,
	                colCount: tblHeaders.length,
	                thead: tblHeaders,
	                rows: rows
	            };
	        }

        }
        //促销页面绑定事件的处理
        function bindEvent(){
			$container.on('click', '.operate', function (e) {
				var act = $(this).attr('data-type');
					timeID =$(this).attr('data-id')||undefined;
				switch(act) {
					//修改
					case "edit" :
						renderDailog(timeID,shopID)
						break;
					//套用
					case "refTime":
						initSetRoleModal(shopID);
						break;
					//取消套用
		            case "cancleRefShopTime":
		            	G.cancleRefShopTime({shopID: shopID}, function (rsp) {
	                        if (rsp.resultcode != '000') {
	                            topTip({msg: rsp.resultmsg, type: 'danger'});
	                            return;
	                        }
	                        topTip({msg: '操作成功', type: 'success'});
	                        refShop=null;
	                        renderTable();

		           		});
		           		break;
				}
			});

        }
        function renderDailog(timeID,shopID){
         	var timeData = {};
         	    timeData=_.findWhere(timePeriods, {timeID: timeID});
            if(timeData){
		      	isActiveData =_.map(isActiveData,function (isActiveData) {
		            return _.extend(isActiveData,{selected:isActiveData.value==timeData.isActive ? 'selected' :''});
		        });
	        }
	        else{
		        isActiveData =_.map(isActiveData,function (isActiveData) {
		            return _.extend(isActiveData,{selected:''});
		        });
	        }
	        var dTitle ='修改时段',
	        	modalVals = {timeData:timeData,isActiveData:isActiveData},
		        $editSet = $(editModalTpl(modalVals));
		        modalDialog = new U.ModalDialog({
		            title: dTitle,
		            html: $editSet
		        }).show(); 
		    var minuteStep=timeData.timeUnit;
		        initTimePicker(modalDialog,'[data-type=timepicker]',minuteStep);
		        TimeFormValidate($editSet);
		        submitModalTime(modalDialog,$editSet,timeID,shopID);
        }
        function initTimePicker(modalDialog,selector,minuteStep) {
			modalDialog._.body.find(selector).timepicker({
				minuteStep : parseInt(minuteStep),
				showSeconds : false,
				showMeridian :  false,
				disableFocus : true,
				showInputs : false
			});
		}
        function TimeFormValidate($form){
        	$form.bootstrapValidator({
	            fields: {
	                timeName: {
	                    validators: {
	                        notEmpty: { message: '餐段名称不能为空' },
	                        stringLength : {
	                            min : 1,
	                            max : 50,
	                            message : "餐段名称长度在1-50个字符之间"
	                        }
	                    }
	                },
	                startTime: {
	                    validators: {
	                        notEmpty: { message: '开始时间不能为空' }
	                    }
	                },
	                endTime:{
	                	validators: {
	                        notEmpty: { message: '结束时间不能为空' }
	                    }
	                }  
	            }
	        });
        }
        function submitModalTime(modalDialog,$form, timeID,shopID){
        	modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
                var data = parseForm($form),
                    postParams = IX.inherit({shopID: shopID, timeID: timeID},data);
                    postParams.startTime= encodeTimeStr(postParams.startTime);
                    postParams.endTime =encodeTimeStr(postParams.endTime);
                G.updateShopTime(postParams, function (rsp) {
                    if (rsp.resultcode != '000') {
                       topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    topTip({msg: '保存成功', type: 'success'});
                    modalDialog.hide();
                    renderTable();
                });
            });
        }
		function initSetRoleModal (shopID) {
			var records =null;
        	var RefTimeModal = new U.ModalDialog({
				id : "refTime_modal",
				clz : "RefTime-modal",
				title : "套用时段"
				});
			getRefShops(RefTimeModal,{shopID:shopID});
		}
		//获取套用店铺数据
		function getRefShops(container,postParams){
			var Params;
				Params=IX.clone(postParams);
				if(postParams!=undefined){
					if(postParams.cityID!=undefined||postParams.areaID!=undefined){
						postParams.cityID=postParams.cityID=="-1"?"":postParams.cityID;
						postParams.areaID=postParams.areaID=="-1"?"":postParams.areaID;
					}
				}
			G.getRefTimeShops(postParams, function (rsp) {
	            if (rsp.resultcode != '000') {
	                topTip({msg: rsp.resultmsg, type: 'danger'});
	                        return;
	            }
	            else{
	            	records = rsp.data;
	            	var areas = records.datasets.areaCountDs.data.records,
	            		shops = records.records;
	            	if(Params.shopID==undefined){
	            		if(Params.cityID||Params.shopName){
		            		updateFilterCityLayout(container,cityID,areas,shops);
		            		bindmodalEvent(container);
	            		}
	            		else{
	            			updateFilterAreaLayout(container,areaID,shops)
	            		}
	            	}
	            	else{
	            		loadingModalLayout(container,records);
	            	}
	            	container.show();
	            }
	       	});
		}
    	//套用店铺模态框
        function loadingModalLayout(container,records){
        	var $modalcontainer = container;
				$modalbody = $modalcontainer._.body;
				$footer = $modalcontainer._.footer;
			var layoutTpl =refShopTpl,
				htm = layoutTpl({
					clz : '',
					title : '选择套用的店铺'
				});
			$modalbody.html(htm);
			$queryBox = $modalbody.find('.query-box');
			$resultBox = $modalbody.find('.result-box');
			var cities = records.datasets.cityCountDs.data.records,
				areas = records.datasets.areaCountDs.data.records,
				shops = records.records;
			$queryBox.html($(queryTpl(mapRenderLayoutData(cities,shops))));
			$filter = $queryBox.find('.filter');
			$queryBox.find('.query select').remove();
			$queryBox.find('.query-btn').before('<input name="shopName" class="form-control" type="text" />');
			var renderData = mapShopsRenderData(shops);
			var shophtm = listTpl({
				settleList : {
					list : renderData
				}
			});
			$resultBox.html(shophtm);
			$resultBox.find(".row").addClass("controlScorll");
			bindmodalEvent(container);
        }
        function mapRenderLayoutData (cities,shops) {
			var filterCities = mapFilterData({
					type : 'city',
					name : '城市：',
					focus : 0,
					data : cities
				})
				//queryChosenShops = mapChosenShopData(cities,shops);
			return {
				clz : '',
				shopCity : filterCities,
				toggle : {target : '#shop_query'}
				//optGrp : queryChosenShops
			};
		}
		function mapShopsRenderData (data) {
			var itemsCache = $XP(refShop, 'refTimeShopID');
			var ret = _.map(data, function (settle, i, l) {
				var id = $XP(settle, 'shopID');
					checked = !(itemsCache==id)? '' : 'checked';
				return IX.inherit(settle, {
					type : 'radio',
					clz : 'bind-item',
					settleUnitID :$XP(settle, 'shopID', ''),
					settleUnitNameLabel : $XP(settle, 'shopName', ''),
					checked : checked
				});
			});
			return ret;
		}
		function renderAreaFilter(data) {			
			var renderData = mapFilterData({
				type : 'area',
				name : '区域：',
				focus : 0,
				data : data
			});
			var html = filterTpl(renderData);
			$filter.find('.area').remove();
			$filter.append(html);
		}
		function updateFilterCityLayout (container,cityID,areas,shops){
			if (cityID != -1) {
				renderAreaFilter(areas);
			} else {
				$filter.find('.area').remove();
			}
			var $modalbody = container._.body,
				$resultBox = $modalbody.find('.result-box'),
				renderData = mapShopsRenderData(shops);
			var shophtm = listTpl({
					settleList : {
						list : renderData
					}
				});
			$resultBox.html(shophtm);
			$resultBox.find(".row").addClass("controlScorll");
			$filter.find('.btn-link[data-city]').removeClass('disabled');
			$filter.find('.btn-link[data-city=' + cityID + ']').addClass('disabled');
		}
		function updateFilterAreaLayout (container,areaID,shops){
			if (areaID != -1) {
				var $modalbody = container._.body,
				 	$resultBox = $modalbody.find('.result-box'),
					renderData = mapShopsRenderData(shops);
				var shophtm = listTpl({
					settleList : {
						list : renderData
					}
				});
				$resultBox.html(shophtm);
				$resultBox.find(".row").addClass("controlScorll");
			}
			$filter.find('.btn-link[data-area]').removeClass('disabled');
			$filter.find('.btn-link[data-area=' + areaID + ']').addClass('disabled');
		}
       	function mapFilterData(cfg){
       		var data = $XP(cfg, 'data', []),
				type = $XP(cfg, 'type'),
				name = $XP(cfg, 'name'),
				focus = $XP(cfg, 'focus', 0),
				ret = {
					type : type,
					name : name,
					items : []
				},
				count = 0;
			var btn_all = {
				focusClz : '',
				type : type,
				code : -1,
				name : '全部',
				count : 0
			};
			ret.items = _.map(data, function (o, i, l) {
				var key = type + 'Count';
				var c = parseInt($XP(o, key, 0));
				count += c;
				return {
					focusClz : '',
					type : type,
					code : $XP(o, (type + 'ID'), ''),
					name : $XP(o, (type + 'Name'), ''),
					count : c
				}
			});
			btn_all = IX.inherit(btn_all, {
				count : count,
				focusClz : ''
			});
			ret.items.unshift(btn_all);
			ret.items[focus]['focusClz'] = 'disabled';
			return ret;
       	}
        function bindmodalEvent(container){
        	container._.footer.find('.btn').on('click', function (e) {
        		var $btn = $(this),
					act = $btn.hasClass('btn-close') ? 'cancel' : 'ok';
				if (act == 'cancel') {
					container.hide();
				} else {
					// 套用的店铺数据
					var items = $(':radio[name=bindSettle]:checked')||[];
					if (items.length > 0) {
						timeShopID=items.val();
						G.bindRefShopTime({shopID: shopID,timeShopID:timeShopID}, function (rsp) {
	                       if (rsp.resultcode != '000') {
	                            topTip({msg: rsp.resultmsg, type: 'danger'});
	                            return;
	                        }
	                        else{
	                        	var Refflag = true;
			            			timePeriods = rsp.data;
			            			refShop = timePeriods;
									renderRecords(timePeriods,Refflag);
								} 
		           		});
						container.hide();
					} else {
						topTip({
							msg : "请选择要套用的店铺",
							type : 'danger'
						});
					}
				}
			});
			//城市过滤
			container._.dialog.find('.btn-link[data-city]').on('click', function (e) {
				var $el = $(this);
                cityID = $el.attr('data-city');
                IX.Debug.info("DEBUG: 城市选择");
                getRefShops(container,{cityID:cityID});
			});
			//区域过滤
			container._.dialog.find('.btn-link[data-area]').on('click', function (e) {
				 IX.Debug.info("DEBUG: 区域选择");
				var $el = $(this);
                areaID = $el.attr('data-area');
                if(areaID!="-1"){
	                IX.Debug.info("DEBUG: 区域选择");
	                getRefShops(container,{areaID:areaID});
                }
                else{
                	cityID=$(container._.dialog.find('.disabled.btn-link[data-city]')).data('city');
                	getRefShops(container,{cityID:cityID});
                }
			});
			container._.dialog.find('.query-btn').on('click', function (e) {
				var shopName=$.trim($('input[name=shopName]').val());
                IX.Debug.info("DEBUG: 搜索店铺");
                var cityID=$(container._.dialog.find('.disabled.btn-link[data-city]')).data('city'),
                	areaID=$(container._.dialog.find('.disabled.btn-link[data-area]')).data('area');
                
                getRefShops(container,{shopName:shopName,cityID:cityID,areaID:areaID});
			});

        }


	}

})(jQuery, window);