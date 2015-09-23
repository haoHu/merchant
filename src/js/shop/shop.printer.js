(function ($, window) {
	IX.ns("Hualala.Shop");
    var G = Hualala.Global,
    	C = Hualala.Common,
		U = Hualala.UI,
		topTip = U.TopTip,
		parseForm = C.parseForm,
		printerBrandData = Hualala.TypeDef.ShopPrinterDataSet.printerBrandTypes,
		PaperSizesData = Hualala.TypeDef.ShopPrinterDataSet.printerPaperSizeTypes,
		printerPortData = Hualala.TypeDef.ShopPrinterDataSet.printerPortTypes,
		PrinterStatusData = Hualala.TypeDef.ShopPrinterDataSet.currPrinterStatusData;
	Hualala.Shop.initShopPrintMgr = function ($container, shopID){
		//打印机设置表头：名称|纸张宽度|端口类型|端口|品牌|型号|打印机说明|状态|操作
		var ShopPrinterHeaderCfg = [
			{key : "printerName", clz : "printerName", label : "名称"},
			{key : "printerPaperSize", clz : "printerPaperSize", label : "纸张宽度"},
			{key : "printerPortType", clz : "printerPortType", label : "端口类型"},
			{key : "printerPort", clz : "text", label : "端口"},
			{key : "printerBrand", clz : "text", label : "打印机品牌"},
			{key : "printerModel", clz : "text", label : "打印机型号"},
			//{key : "printerRemark", clz : "text", label : "打印机说明"},
			{key : "currPrinterStatus", clz : "status", label : "状态"},
			{key : "rowControl", clz : "rowControl", label : "操作"}
		],
		printerTpl,layoutTpl,resultTpl,printerModalTpl,printers = null;
		initTemplate();
		renderTable();
		bindEvent();
		function initTemplate() {
			printerTpl = Handlebars.compile(Hualala.TplLib.get('tpl_printer_add'));
			printerModalTpl =Handlebars.compile(Hualala.TplLib.get('tpl_edit_printer'));
            layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_list_layout'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
           	Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $container.append($(layoutTpl()));
        }
        //获取数据
        function renderTable() {
            var initParams = {shopID: shopID};
            var Refflag = false;
            G.getShopPrinter(initParams, function(rsp) {
                if (rsp.resultcode == '000') {
                    printers = rsp.data.records;              	
                	renderRecords(printers); 
                }else{
                    topTip({type: 'danger', msg: rsp.resultmsg});
                    return;
                }
            });
        }
        //数据渲染
        function renderRecords(records) {
        	var $resultBox = $container.find('.shop-list');
        	$container.find('.promotion_add').remove();
        	$resultBox.before($(printerTpl()));
        	var $result = $container.find('.shop-list-body');
        	$result.removeClass("row");
        	$result.empty();
            $result.html($(resultTpl(mapRenderData(records))));
		}
		function mapColItemRenderData(row, rowIdx, colKey) {
			var self = this,
				r = {value : "", text : ""}, v = $XP(row, colKey, '');
			switch(colKey) {
				// 各列参数
				case "printerPaperSize":
					var printerPaperSize = PaperSizesData,
						printerPaperSize = _.find(printerPaperSize, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(printerPaperSize, 'label', '');
						r.value = v;
						r.text =label;
					break;
				case "printerPortType":
					var printerPortTypes = printerPortData,
						printerPortType = _.find(printerPortTypes, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(printerPortType, 'label', '');
						r.value = v;
						r.text =label;
					break;
				case "currPrinterStatus":
					var currPrinterStatusData = PrinterStatusData,
						currPrinterStatus = _.find(currPrinterStatusData, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(currPrinterStatus, 'label', '');
						r.value = v;
						r.text =label;
					break;
				case "printerRemark" :
					var label = C.decodeTextEnter(v)|| "";
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
								clz : 'operate btn-link edit-printer',
								id : $XP(row, 'itemID', ''),
								key : $XP(row, '__id__', ''),
								type : 'edit'
							},
							{
								label : '删除',
								link : 'javascript:void(0);',
								clz : 'operate btn-link delete-printer',
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
                tblHeaders = IX.clone(ShopPrinterHeaderCfg);
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
					case "addPrinter":
					case "edit" :
						IX.Debug.info("DEBUG: 添加和修改打印机");
						renderDailog(itemID,shopID);
						break;
					//删除
					case "delete":
						Hualala.UI.Confirm({
			                title: '删除打印机',
			                msg: '您确定删除此打印机么',
			                okFn: function () {
			                    G.deleteShopPrinter({shopID: shopID, itemID: itemID}, function (rsp) {
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
         	var printerData = {};
         	    printerData=_.findWhere(printers, {itemID: itemID});
            if(printerData){
            	printerData.printerRemark = C.decodeTextEnter(printerData.printerRemark);
		        printerPortData=_.map(printerPortData,function (printerPortData){
		            return _.extend(printerPortData,{selected:printerPortData.value==printerData.printerPortType ? 'selected' : ''});
		        });
		       	PrinterStatusData=_.map(PrinterStatusData,function (PrinterStatusData) {
		            return _.extend(PrinterStatusData,{selected:PrinterStatusData.value==printerData.currPrinterStatus ? 'selected' :''});
		        });
		        PaperSizesData =_.map(PaperSizesData,function (PaperSizesData) {
		            return _.extend(PaperSizesData,{selected:PaperSizesData.value==printerData.printerPaperSize ? 'selected' :''});
		        });
		        printerBrandData = _.map(printerBrandData,function (printerBrandData) {
		            return _.extend(printerBrandData,{selected:printerBrandData.value==printerData.printerBrand ? 'selected' :''});
		        });
	        }
	        else{
	        	printerPortData=_.map(printerPortData,function (printerPortData){
		            return _.extend(printerPortData,{selected:''});
		        });
		       	PrinterStatusData=_.map(PrinterStatusData,function (PrinterStatusData) {
		            return _.extend(PrinterStatusData,{selected:''});
		        });
		        PaperSizesData =_.map(PaperSizesData,function (PaperSizesData) {
		            return _.extend(PaperSizesData,{selected:''});
		        });
		        printerBrandData =_.map(printerBrandData,function (printerBrandData) {
		            return _.extend(printerBrandData,{selected:''});
		        });
	        }
	     	var isAdd = itemID === undefined;
	        var dTitle = (isAdd ? '添加' : '修改') + '打印机',
	        	// modalVals = IX.inherit({}, printerData,{printerPortData},{PrinterStatusData},{PaperSizesData}),
	        	modalVals = {printerData:printerData,printerPortData:printerPortData,PrinterStatusData:PrinterStatusData,PaperSizesData:PaperSizesData,printerBrandData:printerBrandData},
		        $editSet = $(printerModalTpl(modalVals));
		        modalDialog = new U.ModalDialog({
		            title: dTitle,
		            backdrop : 'static',
		            html: $editSet
		        }).show(); 
		        PrinterFormValidate($editSet);
		        bindModalPrinter(modalDialog,$editSet,itemID,shopID);
        }
        function PrinterFormValidate($form){
        	$form.bootstrapValidator({
	            fields: {
	                printerName: {
	                    validators: {
	                        notEmpty: { message: '打印机名不能为空' },
	                        stringLength : {
	                            min : 1,
	                            max : 50,
	                            message : "打印机名称长度在1-50个字符之间"
	                        }
	                    }
	                },
	                /*BUG #5694 【Dohko-dianpu】添加打印机时，状态默认为未知
	                currPrinterStatus: {
	                    validators: {
	                        notEmpty: { message: '打印机状态必须选择' }
	                    }
	                },*/
	                printerPort: {
	                    validators: {
	                        notEmpty: { message: '打印机端口不能为空' }
	                    }
	                },
	                printerBrand:{
	                	validators: {
	                        notEmpty: { message: '打印机品牌不能为空' }
	                    }
	                },
	                printerPortType: {
	                    validators: {
	                        notEmpty: { message: '打印机端口类型必须选择' }
	                    }
	                },
	                printOffsetX :{
	                	validators: {
	                        notEmpty: { message: '水平方向打印缩进不能为空' },
	                        integer: {message: '必须是正整数'},
	                        between: {message: '必须是0-100的值', min: 0, max: 100}
	                    }
	                },
	                printerRemark: {
	                    validators : {
	                        stringLength : {
	                            max : 250,
	                            message : '备注不能超过250个字'}
	                    }
	                }   
	            }
	        });
        }
        function bindModalPrinter(modalDialog,$form, itemID,shopID){
        	modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
                var data = parseForm($form),
                    postParams = IX.inherit({shopID: shopID, itemID: itemID},data);
                postParams.printerRemark = C.encodeTextEnter(postParams.printerRemark);
                postParams.printerPaperSize = postParams.printerPaperSize==""?0:postParams.printerPaperSize;
	           	postParams.printerName = $.trim(postParams.printerName);
	            var nameCheckData = {shopID:shopID, printerName:postParams.printerName, itemID: itemID};
	            function callbackFn(res){
	            	topTip({msg: (!itemID ? '添加' : '修改') + '成功！', type: 'success'});
	                //topTip({msg: '保存成功', type: 'success'});
	                modalDialog.hide();
	                renderTable();
	            }
	            if(!itemID){
	                C.NestedAjaxCall("checkPrinterNameExist","addShopPrinter",nameCheckData,postParams,callbackFn);
	            }else{
	                C.NestedAjaxCall("checkPrinterNameExist","updateShopPrinter",nameCheckData,postParams,callbackFn);  
	            }
            });
        }
	}

})(jQuery, window);