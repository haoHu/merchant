(function(window, $) {

    var G = Hualala.Global,
        U = Hualala.UI,
        C = Hualala.Common,
        topTip = U.TopTip,
        parseForm = C.parseForm;
    Hualala.Shop.initTableMgr = function ($container, shopID) {
        var tableHeaderCfg = [
                {key : "areaName", clz : "text", label : "桌台区域"},
                {key : "tableCode", clz : "text", label : "桌台编号"},
                {key : "tableName", clz : "text", label : "桌台名称"},
                {key : "person", clz : "text", label : "席位数"},
                {key : "tableTagStr", clz : "text", label : "标签"},
                {key : "printerName", clz : "text", label : "留台单打印机"},
                {key : "isTrueTable", clz : "text", label : "真实桌台"},
                {key : "isRoom", clz : "text", label : "包间"},
                {key : "isActive", clz : "status", label : "启用状态"},
                {key : "rowOrder", clz : "", label : "排序"},
                {key : "rowControl", clz : "", label : "操作"},
            ],
            queryBoxTpl, resultTpl, editModalTpl, customSelect;
        var shopID = shopID,
            groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
            tables = null,
            classifyTables = [],
            currentAreaID = 0,
            areas = null,
            printers = null;

        //加载模板：查询表单；数据表格
        initTemplate();
        //请求桌台区域，渲染区域信息
        renderTableArea();
        //请求数据并渲染表格，renderData
        renderTable();
        //绑定事件：修改  删除  设置
        bindEvent();
        function initTemplate() {
            queryBoxTpl = Handlebars.compile(Hualala.TplLib.get('tpl_table_query'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
            editModalTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_table'));
            customSelect = Handlebars.compile(Hualala.TplLib.get('tpl_select'));
            Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerPartial("customRadio", Hualala.TplLib.get('tpl_radio'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $container.append($(queryBoxTpl({areaLink: '#shop/'+ shopID + '/table/area'})));
        }

        function renderTableArea() {
            var renderArea = function() {
                var $tableArea = $container.find('#tableAreaBox'),
                    $areaSpan = $('<span>');
                if (currentAreaID == 0) $areaSpan.addClass('current-food-class');
                $tableArea.empty();
                _.each(areas, function (area) {
                    var $span = $('<span areaid="'+ (area.areaID || 0) +'">');
                    if(currentAreaID == area.areaID) $span.addClass('current-food-class');
                    $tableArea.append($span.text(area.areaName + '(' + area.num + ')'));
                });
            };
            G.getTableArea({shopID: shopID}, function (rsp) {
                if (rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                areas = rsp.data.records;
                renderArea();
            });

        }
        function renderTable(extendParams) {
            var initParams = {shopID: shopID, areaID: '', keywordLst: ''},
                queryParams = IX.inherit(initParams, extendParams);
            G.getShopTable(queryParams, function(rsp) {
                if (rsp.resultcode == '000') {
                    tables = rsp.data.records;
                    classifyTables = sortTableData();
                    renderRecords(tables);
                    createTableNameChosen();
                } else {
                    topTip({type: 'danger', msg: rsp.resultmsg})
                }
            });
        }

        function createTableNameChosen() {
            var customChosen = Handlebars.compile(Hualala.TplLib.get('tpl_chosen')),
                $tableName = $container.find('.query-form form #tableName select');
            $tableName.html(customChosen(tableChosenData()));
            if($tableName.data('chosen')) $tableName.chosen('destroy');
            U.createChosen($tableName, tables, 'tableID', 'tableName',
                {
                    noFill: true, noCurrent: true, width: '200px',
                    placeholder_text: '选择或输入桌台名称',
                    no_result_text: '抱歉，没有相关桌台'
                }, false);
        }

        function tableChosenData() {
            var groupTables = IX.clone(sortTableData()),
                groups = _.map(groupTables, function (classifyTables, areaID) {
                var groupName = $XP(classifyTables[0], 'areaName'),
                    options = _.map(IX.clone(classifyTables), function (table) {
                        return {value: table.tableID, label: table.tableName}
                    });
                return {groupName: groupName, options: options}
            });
            return {groups: groups};
        }

        function sortTableData() {
            var copyTables = IX.clone(tables);
            return _.groupBy(copyTables, 'areaID');
        }

        function renderRecords(records) {
            var recordsCount = records ? records.length : 0;
            $container.find('.table-responsive').remove();
            $container.append($(resultTpl(mapRenderData(records))));
            $container.find('#foodSearchResult span').text(recordsCount);
            if(recordsCount == 0) return;
            initEventSwitcher($container.find('table tr td input[type="checkbox"]'));
        }
        //组装表格显示的col
        function mapColItemRenderData(row, rowIdx, colKey) {
            var r = {value : "", text : ""}, v = $XP(row, colKey, '');
            switch(colKey) {
                case "rowOrder":
                    r = {
                        type : 'button',
                        btns : [
                            {
                                link : 'javascript:void(0);',
                                clz : 'ml-6 glyphicon glyphicon-arrow-up sort-top',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'sortIndex'),
                                type : 'sortTop'
                            },
                            {
                                link : 'javascript:void(0);',
                                clz: 'ml-6 glyphicon glyphicon-arrow-up sort-up',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'sortIndex'),
                                type : 'sortUpOrDown'
                            },
                            {
                                link : 'javascript:void(0);',
                                clz : 'ml-6 glyphicon glyphicon-arrow-down sort-down',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'sortIndex', ''),
                                type : 'sortUpOrDown'
                            },
                            {
                                link : 'javascript:void(0);',
                                clz : 'ml-6 glyphicon glyphicon-arrow-down sort-bottom',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'sortIndex', ''),
                                type : 'sortBottom'
                            }
                        ]
                    };
                    break;
                case "rowControl" :
                    //key 用来存储当前桌台的顺序号
                    r = {
                        type : 'button',
                        btns : [
                            {
                                label : '查看',
                                link : 'javascript:void(0);',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'areaID'),
                                type : 'viewTable'
                            },
                            {
                                label : '修改',
                                link : 'javascript:void(0);',
                                clz: 'm-l',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'areaID'),
                                type : 'editTable'
                            },
                            {
                                label : '删除',
                                link : 'javascript:void(0);',
                                clz : 'm-l',
                                id: $XP(row, 'tableID'),
                                key : $XP(row, 'areaID', ''),
                                type : 'delTable'
                            }
                        ]
                    };
                    break;
                case "isActive" :
                    r.value = v;
                    r.text = '<input type="checkbox" data-status="' + v + '" data-id="' + $XP(row, 'tableID') + '" data-key="' + $XP(row, 'areaID', '') + '"/>';
                    break;
                case 'isTrueTable': case 'isRoom' :
                    r.value = v;
                    var statusClass = v == 1 ? 'glyphicon-ok' : 'glyphicon-minus';
                    r.text = '<span class="glyphicon ' + statusClass + '"></span>';
                    break;
                default :
                    r.value = r.text = $XP(row, colKey, '');
                    break;
            }
            return r;
        }

        //组装表格显示的rows
        function mapRenderData(records) {
            var tblClz = "table-bordered table-striped table-hover ix-data-report",
                tblHeaders = IX.clone(tableHeaderCfg);
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
                var areaID = $XP(row, 'areaID'),
                    tableID = $XP(row, 'tableID'),
                    currentAreaTables = classifyTables[areaID],
                    isAreaFirstTable = $XP(currentAreaTables[0], 'tableID', '') == tableID,
                    isAreaLastTable = $XP(currentAreaTables[currentAreaTables.length - 1], 'tableID', '') == tableID,
                    areaFirstClass = isAreaFirstTable ? 'area-first-record' : '',
                    areaLastClass = isAreaLastTable ? 'area-last-record' : '';
                return {
                    clz: areaFirstClass + ' ' + areaLastClass,
                    cols: mapColsRenderData(row, idx)
                };
            });
            return {
                tblClz: tblClz,
                isEmpty: !records || records.length == 0 ? true : false,
                colCount: tableHeaderCfg.length,
                thead: tableHeaderCfg,
                rows: rows
            };

        }

        function bindEvent() {
            var clickEventMap = {
                viewTable: viewTable,
                addTable: editTable,
                editTable: editTable,
                delTable: delTable,
                sortTop: sortTable,
                sortUpOrDown: sortTable,
                sortBottom: sortTable
            };
            $container.on('click', '#tableAreaBox span', function () {
                var $el = $(this);
                $container.find('.query-form .row #tableName select').val('');
                currentAreaID = $el.attr('areaID');
                var filterTables = currentAreaID == 0 ? tables : classifyTables[currentAreaID],
                    $isRoomCheckBox = $('.query-form form .row input[name="isRoom"]'),
                    records = $isRoomCheckBox.prop('checked') ? _.select(filterTables, function (table) {
                        return table.isRoom == 1;
                    }) : filterTables;
                $el.siblings('span').removeClass('current-food-class');
                $el.addClass('current-food-class');
                renderRecords(records);
            }).on('change', '.query-form form .row #tableName select', function () {
                var tableID = $(this).val(),
                    currentDisplayTables = currentAreaID == 0 ? tables : classifyTables[currentAreaID],
                    records = !tableID ? currentDisplayTables :
                        _.findWhere(currentDisplayTables, {tableID: tableID + ''}) ?
                            [_.findWhere(currentDisplayTables, {tableID: tableID + ''})] : [];
                renderRecords(records);
            }).on('change', '.query-form form .row input[name="isRoom"]', function () {
                $container.find('.query-form .row #tableName select').val('');
                var filterTables = currentAreaID == 0 ? tables : classifyTables[currentAreaID],
                    records = $(this).prop('checked') ? _.select(filterTables, function (table) {
                        return table.isRoom == 1;
                    }) : filterTables;
                renderRecords(records);
            }).on('click', '.query-form .btn', function (e) {
                e.preventDefault();
                //新增
                var $el = $(this),
                    eventName = $el.attr('name');
                clickEventMap[eventName]();
            }).on('click', 'table tr td a', function (e) {
                e.preventDefault();
                //修改, 删除, 设置
                var $el = $(this),
                    eventName = $el.data('type');
                clickEventMap[eventName]($el);
            });
        }

        function findTableBy(tableID) {
            return _.findWhere(tables, {tableID: tableID + ''});
        }

        function viewTable($el) {
            var tableID = $el.attr('data-id'),
                table = findTableBy(tableID),
                basicInfoTitle = {
                    areaName: '所属区域', tableCode: '桌台编号', tableName: '桌台名称', person: '座位数目',
                    isTrueTable: '真实桌台', isRoom: '是否包间', tableTagStr: '标签备注', printerName: '留台单打印机'
                },
                basicInfo = _.map(_.pick(IX.clone(table), 'areaName', 'tableCode', 'tableName', 'person', 'isTrueTable', 'isRoom', 'tableTagStr', 'printerName'),
                    function (value, key) {
                        var val = '';
                        if(key == 'printerName') {
                            val = value || '不打印';
                        } else if(key == 'isTrueTable' || key == 'isRoom') {
                            val = value == 1 ? '是' : '否';
                        } else {
                            val = value;
                        }
                        return {label: basicInfoTitle[key], value: val};
                    }),
                tableInfoModal = Handlebars.compile(Hualala.TplLib.get('tpl_table_info')),
                modalDialog = U.ModalDialog({
                    id: 'viewTable',
                    title: '查看桌台信息',
                    html: tableInfoModal({qrImagePath: table.qrImagePath, basicInfo: basicInfo})
            }).show();
            modalDialog._.footer.find('button.btn.btn-close').text('关闭');
            modalDialog._.footer.find('button.btn.btn-ok').remove();
        }

        function editTable($el) {
            //添加或修改桌台信息
            var tableID = $el ? $el.attr('data-id') : '',
                table = findTableBy(tableID);
            var getRadiosInput = function (radioName) {
                return [
                    {text: '是', value: '1', checked: (!table || table[radioName] == 1) ? 'checked' : ''},
                    {text: '否', value: '0', checked: (table && table[radioName]) == 0 ? 'checked' : ''}
                ];
            };
            var status = tableID ? '修改' : '添加',
                tableRadios = {radios: [
                    {labelOffset: 'col-sm-offset-1', name: 'isTrueTable', label: '真实桌台', inputs: getRadiosInput('isTrueTable')},
                    {labelOffset: 'col-sm-offset-1', name: 'isRoom', label: '是否包间', inputs: getRadiosInput('isRoom')}
                ]},
                modalDialog = U.ModalDialog({
                    id: 'editTable',
                    title: status + '桌台',
                    hideCloseBtn: 'false',
                    backdrop: 'static',
                    html: editModalTpl(IX.inherit(table, tableRadios))
                }).show();
            renderAreaSelect(modalDialog, table);
            renderPrinterSelect(modalDialog, table);

            modalDialog._.footer.find('.btn.btn-close').text('关闭');
            registerFormValidate(modalDialog._.body.find('.form-table'), tableID);
            bindUpdateTable(modalDialog, tableID);
        }

        function renderSelect(items, nameKey, idKey, $select, selItem, defaultOption) {
            var options = _.map(IX.clone(items), function (item) {
                    return {value: item[idKey], name: item[nameKey], selected: (selItem && selItem[idKey] == item[idKey]) ? 'selected' : ''};
                });
            if(defaultOption) options.unshift(defaultOption);
            $select.append(customSelect({options: options, name: idKey}));
        }

        function renderAreaSelect(modalDialog, selItem) {
            var $select = modalDialog._.body.find('div[name="tableArea"]');
            if (areas) {
                renderSelect(_.reject(areas, function(area) {return !area.areaID}), 'areaName', 'areaID', $select, selItem);
            } else {
                G.getTableArea({shopID: shopID}, function (rsp) {
                    if (rsp.resultcode != '000') {
                        topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    areas = rsp.data.records;
                    renderSelect(areas, 'areaName', 'areaID', $select, selItem);
                });
            }
        }

        function renderPrinterSelect(modalDialog, selItem) {
            var $select = modalDialog._.body.find('div[name="printer"]'),
                defaultOption = {value: '', name: '不打印'};
            if (printers) {
                renderSelect(printers, 'printerName', 'printerKey', $select, selItem, defaultOption);
            } else {
                G.getShopPrinter({shopID: shopID}, function (rsp) {
                    if (rsp.resultcode != '000') {
                        topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    printers = rsp.data.records;
                    renderSelect(printers, 'printerName', 'printerKey', $select, selItem, defaultOption);
                });
            }
        }

        function registerFormValidate($form, tableID) {
            $form.bootstrapValidator({
                fields: {
                    areaID: {
                        validators: {
                            notEmpty: {message: "区域不能为空"}
                        }
                    },
                    tableName: {
                        validators: {
                            notEmpty: { message: '桌台名称不能为空' }
                        }
                    },
                    person: {
                        validators: {
                            notEmpty: {message: '席位数不能为空'},
                            between: {min: 1, max: 99, message: '必须是1-99的整数'},
                            integer: {message: '必须是整数'}
                        }
                    }
                }
            });
        }

        function bindUpdateTable(modalDialog, tableID) {
            modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                var $form = modalDialog._.body.find('.form-table');
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
                var data = parseForm($form),
                    defaultParam = tableID ? {tableID: tableID} : {isActive: '1'},
                    postParams = IX.inherit(defaultParam, {shopID: shopID}, data);
                    postParams.tableName = $.trim(postParams.tableName);
                var nameCheckData = {shopID: shopID, tableID: tableID,tableName:postParams.tableName};
                function callbackFn(res){
                    topTip({msg: (!tableID ? '添加' : '修改') + '成功！', type: 'success'});
                    modalDialog.hide();
                    if(!tableID) {
                        //需要处理area区域对应的区域的卓台数
                        currentAreaID = 0;
                    }
                    renderTableArea();
                    renderTable();
                }
                if(!tableID){
                    C.NestedAjaxCall("checkTableExist","addShopTable",nameCheckData,postParams,callbackFn);
                }else{
                    C.NestedAjaxCall("checkTableExist","updateShopTable",nameCheckData,postParams,callbackFn);  
                }
            });
        }
        function delTable($el) {
            //删除桌台
            var tableID = $el.attr('data-id');
            U.Confirm({
                title: '删除桌台',
                msg: '你确定要删除该桌台吗？',
                okFn: function () {
                    G.deleteShopTable({shopID: shopID, tableID: tableID}, function (rsp) {
                        if (rsp.resultcode != '000') {
                            topTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        topTip({msg: '操作成功', type: 'success'});
                        currentAreaID = 0;
                        renderTableArea();
                        renderTable();
                    });
                }
            });
        }

        function switchTable(tableID, state, $el) {
            //开启或关闭桌台
            G.switchShopTable({shopID: shopID, tableID: tableID, isActive: state}, function (rsp) {
                if (rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    $el.bootstrapSwitch('toggleState', true);
                    return;
                }
                topTip({msg: '操作成功！', type: 'success'});
            });
        }

        function sortTable($el) {
            var isFirst = $el.parents('tr').hasClass('area-first-record'),
                isUpOrTop = $el.hasClass('glyphicon-arrow-up'),
                isLast = $el.parents('tr').hasClass('area-last-record'),
                isDownOrBottom = $el.hasClass('glyphicon-arrow-down');
            if((isFirst && isUpOrTop) || (isLast && isDownOrBottom)) return;
            var tableID = $el.attr('data-id'),
                areaID = $el.parents('td').next().find('a:first').attr('data-key'),
                currentAreaTables = classifyTables[areaID],
                sortType = $el.data('type'),
                $currentTr = $el.parents('tr'),
                params = {shopID: shopID, areaID: areaID, tableID: tableID},
                sortOperatorMap = {
                    sortTop: {callServer: G.shopTableSortTop, swapDom: $currentTr.prevAll('.area-first-record:first')},
                    sortUpOrDown: {callServer: G.shopTableSortUpOrDown, swapDom: $el.hasClass('sort-up') ? $currentTr.prev() : $currentTr.next()},
                    sortBottom: {callServer: G.shopTableSortBottom, swapDom: $currentTr.nextAll('.area-last-record:first')}
                },
                $swapDomData = sortOperatorMap[sortType].swapDom.find('.sort-up'),
                trSortIndex = $el.attr('data-key'),
                swapSortIndex = $swapDomData.attr('data-key'),
                sortIndexes = sortType == 'sortUpOrDown' ?
                {
                    sortIndex: trSortIndex,
                    tableID2: $swapDomData.attr('data-id'),
                    sortIndex2: swapSortIndex
                }
                    : {},
                trIndex = _.indexOf(currentAreaTables, _.findWhere(currentAreaTables, {tableID: tableID})),
                swapIndex = _.indexOf(currentAreaTables, _.findWhere(currentAreaTables, {tableID: $swapDomData.attr('data-id')})),
                trData = currentAreaTables[trIndex],
                swapData = currentAreaTables[swapIndex];
            sortOperatorMap[sortType].callServer(IX.inherit(params, sortIndexes), function (rsp) {
                if (rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                if(sortType == 'sortTop' || sortType == 'sortBottom') {
                    var $newTr = $('<tr>'),
                        newSortIndex = $XP($XP(rsp.data, 'records', [])[0], 'sortIndex', '0'),
                        insertDomFn = sortType == 'sortTop' ? 'before' : 'after';
                    _.each($currentTr.find('.glyphicon-arrow-up,.glyphicon-arrow-down'), function(el){
                        $(el).attr('data-key', newSortIndex);
                    });
                    currentAreaTables.splice(trIndex, 1);
                    trData.sortIndex = newSortIndex;
                    if(sortType == 'sortTop' && $currentTr.hasClass('area-last-record')) {
                        currentAreaTables.unshift(trData);
                        $newTr.addClass('area-first-record');
                        $currentTr.prev().addClass('area-last-record');
                        sortOperatorMap[sortType].swapDom.removeClass('area-first-record');
                    } else if(sortType == 'sortBottom' && $currentTr.hasClass('area-first-record')){
                        currentAreaTables.push(trData);
                        $currentTr.next().addClass('area-first-record');
                        sortOperatorMap[sortType].swapDom.removeClass('area-last-record');
                        $newTr.addClass('area-last-record');
                    }
                    $newTr.append($currentTr.children());
                    sortOperatorMap[sortType].swapDom[insertDomFn]($newTr);
                    $currentTr.remove();
                } else {
                    trData.sortIndex = swapSortIndex;
                    swapData.sortIndex = trSortIndex;
                    currentAreaTables[trIndex] = swapData;
                    currentAreaTables[swapIndex] = trData;
                    swapDomSortIndex($currentTr, sortOperatorMap[sortType].swapDom, trSortIndex, swapSortIndex);
                    C.SwapDom($currentTr, sortOperatorMap[sortType].swapDom);
                }
            });
        }
        function swapDomSortIndex($dom1, $dom2, sortIndex1, sortIndex2) {
            _.each($dom1.find('.glyphicon-arrow-up,.glyphicon-arrow-down'), function(el){
                $(el).attr('data-key', sortIndex2);
            });
            _.each($dom2.find('.glyphicon-arrow-up,.glyphicon-arrow-down'), function(el) {
                $(el).attr('data-key', sortIndex1);
            });
        }

        function initEventSwitcher($checkbox) {
            $checkbox.each(function () {
                var $el = $(this),
                    onLabel = '已启用',
                    offLabel = '未启用';
                $el.bootstrapSwitch({
                    state: !!$el.data('status'),
                    size : 'normal',
                    onColor : 'primary',
                    offColor : 'default',
                    onText : onLabel,
                    offText : offLabel
                }).on('switchChange.bootstrapSwitch', function (e, state) {
                    var tableID = $el.attr('data-id'),
                        areaID = $el.attr('data-key');
                    var actStr = (state == 1 ? "开启" : "关闭");
                    U.Confirm({
                        title : actStr + "桌台",
                        msg : "你确定要" + actStr + "该桌台吗？",
                        okFn : function () {
                            switchTable(tableID, +state, $el);
                        },
                        cancelFn : function () {
                            $el.bootstrapSwitch('toggleState', true);
                        }
                    });

                });
            });
        }
    };
})(window, jQuery);