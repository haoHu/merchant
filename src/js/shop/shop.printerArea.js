(function ($, window) {
	IX.ns("Hualala.Shop");
    var G = Hualala.Global,
		U = Hualala.UI,
		topTip = U.TopTip,
		parseForm = Hualala.Common.parseForm,
		//打印类型
		PrintTypeData = Hualala.TypeDef.SaasPrintType;
	Hualala.Shop.initPrinterAreaSetting = function ($container, shopID){
		//打印区域设置表头
		var ShopPrinterHeaderCfg = [
			{
				clz : '',
				cols : [
					{clz : 'rowControl',label : '全选', colspan : '', rowspan : '2'},
					{clz : '', label : '区域名称', colspan : '', rowspan : '2'},
					{clz : '', label : '部门名称', colspan : '', rowspan : '2'},
					{clz : '', label : '制作单打印机', colspan : '4', rowspan : ''},
					{clz : '', label : '传菜单打印机', colspan : '2', rowspan : ''}
					
				]
			},
			{
				clz : '',
				cols : [
					{clz : '', label : '名称', colspan : '', rowspan : ''},
					{clz : '', label : '打印份数', colspan : '', rowspan : ''},
					{clz : '', label : '打印方式', colspan : '', rowspan : ''},
					{clz : '', label : '是否打印传菜单上', colspan : '', rowspan : ''},
					{clz : '', label : '名称', colspan : '', rowspan : ''},
					{clz : '', label : '打印份数', colspan : '', rowspan : ''}

				]
			}
		],
		queryBoxTpl,comboOptsTpl,resultTpl,printerAreaTpl,printerAreaMakeTpl,printers=null,
		Areas = null,departments=null,printerSingleArea =null;
		var initParams = {shopID: shopID};
		initTemplate();
		renderTable(initParams);
		bindEvent();
		getAreasTotal(shopID)
		getPrinterTotal(shopID);
		getDepartmentTotal();
		function initTemplate() {
			queryBoxTpl = Handlebars.compile(Hualala.TplLib.get('tpl_printerArea_queryBox'));
			comboOptsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_order_comboOpts'));
            printerAreaTpl= Handlebars.compile(Hualala.TplLib.get('tpl_edit_printerArea'));
            printerAreaMakeTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_printerAreaSet'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_cmpx_datagrid'));
           	Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $container.append($(queryBoxTpl({areaLink: '#shop/'+ shopID + '/prtAreaSet/printer'})));
        }
        //获取打印区域的数据
        function renderTable(params) {
            Hualala.Global.queryPrinterArea(params, function(rsp) {
                if (rsp.resultcode == '000') {
                	printerAreas = rsp.data.records;
        			renderRecords(printerAreas);  
                }else{
                    topTip({type: 'danger', msg: rsp.resultmsg});
                    return;
                }
            });
        } 
        //select内容填充
        function createSelectChosen() {
            var $areaKey = $container.find('.query-form form select[name=areaKey]'),
            	$departmentKey = $container.find('.query-form form select[name=departmentKey]');
            	$printerKey =  $container.find('.query-form form select[name=printerKey]');
            $areaKey.html(comboOptsTpl(areaChosenData()));
            $departmentKey.html(comboOptsTpl(departmentChosenData()));
            $printerKey.html(comboOptsTpl(printersChosenData()));
            if($areaKey.data('chosen')) $areaKey.chosen('destroy');
            /*Hualala.UI.createChosen($areaKey, Areas, 'areakey', 'areaName',
                {
                    noFill: true, noCurrent: true, width: '200px',
                    placeholder_text: '选择或输入区域',
                    no_result_text: '抱歉，没有相关区域'
                }, false);*/
		}
		//select内容处理
        function areaChosenData() {
	        var opts = _.map(IX.clone(Areas), function (area) {
	                return {value: area.areaKey, label: area.areaName}
	            });
	        return {opts: opts}
        }
        function printersChosenData() {
	        var opts = _.map(IX.clone(printers), function (printer) {
	                return {value: printer.printerKey, label: printer.printerName}
	            });
	       	opts.unshift({
				value : '',
				label : '全部'
			});
	        return {opts: opts}
        }
        function departmentChosenData() {
	        var opts = _.map(IX.clone(departments), function (department) {
	                return {value: department.departmentKey, label: department.departmentName}
	            });
	       	opts.unshift({
				value : '',
				label : '全部'
			});
	        return {opts: opts}
        }
        //获取打印机   	
        function getPrinterTotal(shopID) {
        	Hualala.Global.getShopPrinter({shopID: shopID},function (rsp){
	            if(rsp.resultcode != '000'){
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
	            }else{
	                printers = rsp.data.records||[];
	             	return printers;
	            }        
        	}); 
    	}
    	//获取区域
    	function getAreasTotal(shopID) {
        	Hualala.Global.getTableArea({shopID: shopID},function (rsp){
	            if(rsp.resultcode != '000'){
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
	            }else{
	                Areas = rsp.data.records||[];
	                createSelectChosen();
	             return Areas;
	            }        
        	}); 
    	}
    	//获取部门
    	function getDepartmentTotal () {
    		Hualala.Global.getSaasDepartments({},function (rsp){
	            if(rsp.resultcode != '000'){
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
	            }else{
	                departments = rsp.data.records||[];
	                createSelectChosen()
	             	return departments;
	            }        
        	}); 
    	}
        //数据渲染
        function renderRecords(records) {
        	var $resultBox = $container.find('.shop-list');
        	$resultBox.empty();
            $resultBox.html($(resultTpl(mapRenderData(records))));
            var $inputAll = $container.find('.printer-grid  tr th.rowControl');
            	$inputAll.before().append('<input type="checkbox" name="checkAll" class="checkAll"/>');
		}
		function mapColItemRenderData(row, rowIdx, colKey) {
			var self = this,
				r = {value : "", text : ""}, v = $XP(row, colKey, '');
			switch(colKey) {
				// 各列参数
				//打印方式
				case "printWay":
					var printWays = PrintTypeData,
						printWay = _.find(printWays, function (el) {return $XP(el, 'value') == v;}),
						label = $XP(printWay, 'title', '');
						r.value = v;
						r.text =label;
					break;
				case "isPrintToDispatchBill" :
					// var label =v=="1"?"是":"否";
					// 	r.value = label;
					// 	r.text = label;
					// break;
					r.value = v;
                    var statusClass = v == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
                    r.text = '<span class="glyphicon ' + statusClass + '"></span>';
                    break;
                case "dispatchBillPrinterName" :
                case "dispatchBillPrintCopies" :
                	var isDisplay = $XP(row,'isPrintToDispatchBill')=="1"? true:false;
                		r.value = v;
						r.text = isDisplay ? v:"";
						break;
				case "rowControl":
					r = {
						type : 'checkbox',
						btns : [
							{
								
								link : 'javascript:void(0);',
								clz : 'operate btn-link edit-printerArea',
								name : 'operate',
								id : $XP(row, 'itemID', ''),
								value :$XP(row, 'areaKey', ''),
								key : $XP(row, 'departmentKey', ''),
								type : 'chose'
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
                tblHeaders = IX.clone(ShopPrinterHeaderCfg),
                colNames = "rowControl,areaName,departmentName,printerName,printCopies,printWay,isPrintToDispatchBill,dispatchBillPrinterName,dispatchBillPrintCopies";
            var tdSum = 0;	
			for(i=0;i<tblHeaders.length;i++){
					tdSum = tdSum+tblHeaders[i].cols.length;
				};
            var mapColsRenderData = function (row, idx) {
                var col = {clz: '', type: 'text'};
                var cols = _.map(colNames.split(','), function (k, i) {
                    var r = mapColItemRenderData(row, idx, k);
                    return IX.inherit(col, r, {clz: k});
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
                colCount: tdSum,
                thead: tblHeaders,
                rows: rows
            };
        }
        //页面绑定事件的处理
        function bindEvent(){
			$container.on('click', '.operate', function (e) {
				var act = $(this).attr('data-type');
				var checkedCount = $container.find('input[name="operate"]:checked').length;
				switch(act) {
					//搜索
					case "search":
						searchChoice();
						break;
					//传菜单
					case "areaSet" :
						IX.Debug.info("DEBUG:传菜单打印设置");
						if(checkedCount!=0){
							renderMenuDailog(shopID)
						}
						else{
							topTip({msg: '请先选择区域', type: 'danger'});
						}
						break;
					//制作单打印
					case "departSet" :
						IX.Debug.info("DEBUG:2. 制作单打印设置");
						if(checkedCount!=0){
							renderDailog(shopID);
						}
						else{
							topTip({msg: '请先选择部门', type: 'danger'});
						}
						break;
				}
			});
			$container.on('change', 'input[name="checkAll"]', function () {
                var $el = $(this);
                $container.find('input[name="operate"]').prop('checked', $el.prop('checked'));
            }).on('change', 'input[name="operate"]', function () {
                var checkedCount = $container.find('input[name="operate"]:checked').length;
                $container.find('input[name="checkAll"]').prop('checked', checkedCount == printerAreas.length);
            });
        }
        //搜索结果
        function searchChoice(){
        	var $form =$container.find('.query-form form'),
        	    els = $form.serializeArray();
        	    els = _.object(_.pluck(els, 'name'), _.pluck(els, 'value'));
        	    els = _.extend(els,{shopID:shopID});
        	    renderTable(els);
        }
        //传菜单打印机模态框
        function renderMenuDailog(shopID){
	        var areaprinters=_.map(IX.clone(printers),function (areaprinters) {
	            return _.extend(areaprinters,{selected:''});
	        });
	        var dTitle ='传菜单打印机设置',
	        	modalVals = {areaprinters:areaprinters},
		        $editSet = $(printerAreaTpl(modalVals));
		        modalDialog = new U.ModalDialog({
		            title: dTitle,
		            backdrop : 'static',
		            html: $editSet
		        }).show(); 
		        PrinterAreaFormValidate($editSet);
		        bindModalPrinter(modalDialog,$editSet,shopID);
        }
        //制作单打印模态框
        function renderDailog(shopID){
	        PrintTypeData=_.map(PrintTypeData,function (PrintTypeData){
	            return _.extend(PrintTypeData,{selected:''});
	        });
	        var areaprinters=_.map(IX.clone(printers),function (areaprinters) {
	            return _.extend(areaprinters,{selected:''});
	        });
	        var dTitle ='制作单打印机设置',
	        	modalVals = {PrintTypeData:PrintTypeData,areaprinters:areaprinters},
		        $editSet = $(printerAreaMakeTpl(modalVals));
		        modalDialog = new U.ModalDialog({
		            title: dTitle,
		            backdrop : 'static',
		            html: $editSet
		        }).show(); 
		        PrinterAreaFormValidate($editSet);
		        bindModalPrinter(modalDialog,$editSet,shopID);
        }
        //validator的验证
        function PrinterAreaFormValidate($form){
        	$form.bootstrapValidator({
	            fields: {
	                dispatchBillPrinterKey: {
	                    validators: {
	                        notEmpty: { message: '传菜单打印机必须选择' }
	                    }
	                },
	               	dispatchBillPrintCopies: {
	                    validators: {
	                    	notEmpty: { message: '传菜单打印份数不能为空' },
	                    	numeric : {message : "传菜单打印份数必须为数字"},
	                    	integer: { message:'传菜单打印份数必须为正整数' },
	                        between : {
	                            min : 0,
	                            max : 100,
	                            message : "传菜单打印份数取值为0~100之间的正整数"
	                        }
	                    }
	                },

	                printerKey: {
	                    validators: {
	                        notEmpty: { message: '制作单打印机必须选择' }
	                    }
	                },
	                printWay: {
	                    validators: {
	                        notEmpty: { message: '制作单打印方式必须选择' }
	                    }
	                },
	                printCopies: {
	                    validators: {
	                    	notEmpty: { message: '制作单打印份数不能为空' },
	                    	numeric : {message : "制作单打印份数必须为数字"},
	                    	integer: { message:'制作单打印份数必须为正整数' },
	                        between : {
	                            min : 0,
	                            max : 100,
	                            message : "制作单打印份数取值为0~100之间的正整数"
	                        }
	                    }
	                }  
	            }
	        });
        }
        //模态框的提交事件
        function bindModalPrinter(modalDialog,$form,shopID){
        	modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
	            var areaKeys = _.map($container.find('input[name="operate"]:checked'), function (input) {
	                        return $(input).data('value');
	                    }).join(',');
	            var departmentKeys = _.map($container.find('input[name="operate"]:checked'), function (input) {
	                        return $(input).data('key');
	                    }).join(',');
                var data = parseForm($form),
                    postParams = IX.inherit(data);
                if(postParams.dispatchBillPrintCopies){
                	postParams = IX.inherit({areaKeys:areaKeys},data);
                }
                else{
                	postParams = IX.inherit({areaKeys:areaKeys,departmentKeys:departmentKeys},data);
                	postParams.isPrintToDispatchBill=postParams.isPrintToDispatchBill==undefined?0:postParams.isPrintToDispatchBill;
                }
                postParams = IX.inherit({shopID:shopID},postParams);
                Hualala.Global[postParams.dispatchBillPrinterKey ? 'setAreaPrinter' : 'setDepartmentPrinter'](postParams, function (rsp) {
                    if (rsp.resultcode != '000') {
                       topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    topTip({msg: '保存成功', type: 'success'});
                    modalDialog.hide();
                    searchChoice();
                });
            });
        }
	}
})(jQuery, window);