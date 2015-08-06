(function ($, window) {
	IX.ns("Hualala.Shop");
    var G = Hualala.Global,
		U = Hualala.UI,
		topTip = U.TopTip,
		parseForm = Hualala.Common.parseForm,
		isActiveData = Hualala.TypeDef.ShopDiscountDataSet.DiscountIsActive,
		isVipPriceData = Hualala.TypeDef.ShopDiscountDataSet.DiscountIsVipPrice,
		discountRangeData = Hualala.TypeDef.ShopDiscountDataSet.DiscountRangeTypes;
	Hualala.Shop.initShopDiscountMgr = function ($container, shopID){
		//折扣方案设置表头：折扣方案名|折扣范围|折扣率|是否享受会员价|创建人|是否启用|描述|操作
		var ShopDiscountHeaderCfg = [
			{key : "discountWayName", clz : "discountWayName", label : "折扣名称"},
			{key : "discountRate", clz : "discountRate", label : "折扣率"},
			{key : "discountRange", clz : "discountRange", label : "折扣范围"},
			{key : "isVipPrice", clz : "isVipPrice", label : "是否享受会员价"},
			{key : "discountWayRemark", clz : "text", label : "描述"},
			{key : "createBy", clz : "createBy", label : "创建人"},
			{key : "isActive", clz : "status", label : "是否启用"},
			{key : "rowControl", clz : "rowControl", label : "操作"}
		],
		layoutTpl,resultTpl,discountModalTpl,discounts = null;
		initTemplate();
		renderTable();
		bindEvent();
		function initTemplate() {
			discountModalTpl =Handlebars.compile(Hualala.TplLib.get('tpl_edit_discount'));
            layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
           	Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $container.append($(layoutTpl()));
            var btn = '<div class="well well-sm t-r discount_add"><button data-type="Add" class="btn operate btn-warning add-discount">新增折扣</button></div>';
        	var $resultBox = $container.find('.shop-list');
        	$resultBox.before($(btn));
        }
        //获取数据
        function renderTable() {
            var initParams = {shopID: shopID};
            var Refflag = false;
            Hualala.Global.queryDiscount(initParams, function(rsp) {
                if (rsp.resultcode == '000') {
                    discounts = rsp.data.records;              	
                	renderRecords(discounts); 
                }else{
                    topTip({type: 'danger', msg: rsp.resultmsg});
                    return;
                }
            });
        }
        //数据渲染
        function renderRecords(records) {
        	var $resultBox = $container.find('.shop-list');
        	var $result = $container.find('.shop-list-body');
        	$result.removeClass("row");
        	$result.empty();
            $result.html($(resultTpl(mapRenderData(records))));
            initDiscountSwitcher($result.find('table tr td input[type="checkbox"]'));
		}
		//开关渲染
        function initDiscountSwitcher($checkbox) {
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
                        title : actStr + "折扣方案",
                        msg : "您确定要" + actStr + "该折扣方案吗？",
                        okFn : function () {
                            switchDiscount(itemID, +state)
                        },
                        cancelFn : function () {
                            $el.bootstrapSwitch('toggleState', true);
                        }
                    });

                });
            });
        }
         //开启或关闭促销规则
        function switchDiscount(itemID, state) {  
            Hualala.Global.switchDiscount({shopID: shopID, itemID: itemID, isActive: state}, function (rsp) {
                if (rsp.resultcode != '000') {
                    Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                Hualala.UI.TopTip({msg: '操作成功！', type: 'success'});
                renderTable();
            });
        }
		function mapColItemRenderData(row, rowIdx, colKey) {
			var self = this,
				r = {value : "", text : ""}, v = $XP(row, colKey, '');
			switch(colKey) {
				// 各列参数
                case 'isVipPrice': 
                    r.value = v;
                    var statusClass = v == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
                    r.text = '<span class="glyphicon ' + statusClass + '"></span>';
                    break;
				case "isActive":
				    r.value = v;
                    r.text = '<input type="checkbox" name="isActive" data-status="' + v + '" data-id="' + $XP(row, 'itemID') + '"/>';
                    break;
				case "discountRate":
					var label;
					if(v=="1.00"||v=="0.00"){
						label = v=="1.00"?"不打折":"免单";
						r.text = label;
					}
					else{
						label= parseFloat(v.toString().movePoint(1)).toString()+"折";
						r.text =label;
					}
						r.value = v;	
					break;
				case "discountRange":
					var discountRanges = discountRangeData,
						discountRange = _.find(discountRanges, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(discountRange, 'label', '');
						r.value = v;
						r.text =label;
					break;
				case "discountWayRemark" :
					var label = Hualala.Common.decodeTextEnter(v)|| "";
						r.value = label;
						r.text = label;
					break;
				case "rowControl":
					r = {
						type : 'button',
						btns : [
							{
								label : '修改',
								link : 'javascript:void(0);',
								clz : 'operate btn-link edit-discount',
								id : $XP(row, 'itemID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'operate btn-link delete-discount',
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
		}
		//组装表格
        function mapRenderData(records) {
            var self = this;
            var tblClz = "table table-bordered table-striped table-hover ix-data-report printer-grid",
                tblHeaders = IX.clone(ShopDiscountHeaderCfg);
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
            return {
                tblClz: tblClz,
                isEmpty: !records || records.length == 0 ? true : false,
                colCount: tblHeaders.length,
                thead: tblHeaders,
                rows: rows
            };
        }
        //页面绑定事件的处理
        function bindEvent(){
			$container.on('click', '.operate', function (e) {
				var act = $(this).attr('data-type');
					itemID =$(this).attr('data-id')||undefined;
				switch(act) {
					//添加
					case "Add":
					case "edit" :
						renderDailog(itemID,shopID);
						break;
					//删除
					case "delete":
						Hualala.UI.Confirm({
			                title: '删除店内促销',
			                msg: '您确定删除此条店内促销方案么',
			                okFn: function () {
			                    Hualala.Global.deleteDiscount({shopID: shopID, itemID: itemID}, function (rsp) {
			                        if (rsp.resultcode != '000') {
			                            topTip({msg: rsp.resultmsg, type: 'danger'});
			                            return;
			                        }
			                        topTip({msg: '操作成功', type: 'success'});
			                        renderTable();
			                    });
			                }
		            	});
		            	break;
				}
			});

        }

        function renderDailog(itemID,shopID){
        	var discountData ={};
         	    discountData=_.findWhere(discounts, {itemID: itemID});
            if(discountData){
            	discountData.discountWayRemark = Hualala.Common.decodeTextEnter(discountData.discountWayRemark);
		        discountRangeData=_.map(discountRangeData,function (discountRangeData){
		            return _.extend(discountRangeData,{selected:discountRangeData.value==discountData.discountRange ? 'selected' : ''});
		        });
		        isActiveData=_.map(isActiveData,function (isActiveData){
		            return _.extend(isActiveData,{selected:isActiveData.value==discountData.isActive ? 'selected' : ''});
		        });
		      	isVipPriceData=_.map(isVipPriceData,function (isVipPriceData){
		            return _.extend(isVipPriceData,{selected:isVipPriceData.value==discountData.isVipPrice ? 'selected' : ''});
		        });

	        }
	        else{
	        	discountRangeData=_.map(discountRangeData,function (discountRangeData){
		            return _.extend(discountRangeData,{selected:''});
		        });
		       	isActiveData=_.map(isActiveData,function (isActiveData){
		            return _.extend(isActiveData,{selected:''});
		        });
		      	isVipPriceData=_.map(isVipPriceData,function (isVipPriceData){
		            return _.extend(isVipPriceData,{selected:''});
		        });
	        }
	     	var isAdd = itemID === undefined;
	        var dTitle = (isAdd ? '添加' : '修改') + '折扣方案',
	        	modalVals = {discountData:discountData,discountRangeData:discountRangeData,isActiveData:isActiveData,isVipPriceData:isVipPriceData},
		        $editSet = $(discountModalTpl(modalVals));
		        modalDialog = new U.ModalDialog({
		            title: dTitle,
		            backdrop : 'static',
		            html: $editSet
		        }).show(); 
		        DiscountFormValidate($editSet);
		        bindModalDiscount(modalDialog,$editSet,itemID,shopID);
        }
        function DiscountFormValidate($form){
        	$form.bootstrapValidator({
	            fields: {
	                discountWayName: {
	                    validators: {
	                        notEmpty: { message: '折扣名称不能为空' },
	                        stringLength : {
	                            min : 1,
	                            max : 50,
	                            message : "折扣名称长度在1-50个字符之间"},
	                        ajaxValid :{
	                            api: "checkDiscountNameExist",
	                            data:{
	                                shopID: shopID,
	                                itemID: itemID ? itemID : ''
	                            }
	                        }
	                    }
	                },
	                discountRate: {
	                    validators: {
	                    	notEmpty: { message: '折扣率不能为空' },
	                        //regexp: {regexp: /^[0](\.(?:0[1-9]|[1-9][0-9]?))$/, message: '请输入有效的数字'}
	                        regexp: {regexp: /^([0]|[1]|[0](\.(?:[0-9]\d?))|[1](\.[0][0]?))$/, message: '请输入有效的数字'}
	                    }	                	
	                },
	               	discountRange: {
	                    validators: {
	                        notEmpty: { message: '折扣范围必须选择' }
	                    }
	                },
	               	isVipPrice: {
	                    validators: {
	                        notEmpty: { message: '是否享受会员价必须选择' }
	                    }
	                },
	                discountWayRemark: {
	                    validators : {
	                        stringLength : {
	                            max : 250,
	                            message : '折扣描述不能超过250个字'}
	                    }
	                }   
	            }
	        });
        }
        function bindModalDiscount(modalDialog,$form, itemID,shopID){
        	modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
                var data = parseForm($form),
                    postParams = IX.inherit({shopID: shopID, itemID: itemID},data);
                    IX.Debug.info(postParams);
                postParams.discountWayRemark = Hualala.Common.encodeTextEnter(postParams.discountWayRemark);
                Hualala.Global[itemID ? 'editDiscount' : 'addDiscount'](postParams, function (rsp) {
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
	}

})(jQuery, window);