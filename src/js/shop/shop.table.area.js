(function(window, $) {
    var G = Hualala.Global,
        U = Hualala.UI,
        C = Hualala.Common,
        topTip = U.TopTip,
        parseForm = C.parseForm;
    Hualala.Shop.initTableAreaMgr = function ($container, shopID) {
        var tableHeaderCfg = [
                {key : "areaName", clz : "text", label : "名称"},
                {key : "areaNote", clz : "text col-md-3", label : "说明"},
                {key : "num", clz : "text", label : "桌台数"},
                {key : "isActive", clz : "text", label : "启用状态"},
                {key : "rowOrder", clz : "", label : "排序"},
                {key : "rowControl", clz : "", label : "操作"},
            ],
            queryBoxTpl, aBtnTpl, resultTpl, editModalTpl, setCategoryTpl;
        var shopID = shopID,
            groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
            categories = null,
            areas = null;

        //加载模板：查询表单；数据表格
        initTemplate();
        //请求数据并渲染表格，renderData
        renderTable();
        //绑定事件：修改  删除  设置
        bindEvent();
        function initTemplate() {
            queryBoxTpl = Handlebars.compile(Hualala.TplLib.get('tpl_create_btn'));
            aBtnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_a_btn'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
            editModalTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_table_area'));
            setCategoryTpl = Handlebars.compile(Hualala.TplLib.get('tpl_checkbox'));
            Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $container.append($(queryBoxTpl({operatorClass: 'add-table-area', title: '新增区域'})));
            $container.find('.add-table-area').before($(aBtnTpl({operatorClass: 'm-r',href: '/#shop/' + shopID + '/table', title: '返回'})));
        }

        function renderTable(postParams) {
            var queryParams = postParams || {shopID: shopID};
            G.getTableArea(queryParams, function(rsp) {
                if (rsp.resultcode == '000') {
                    areas = _.reject(rsp.data.records, function(record) { return !record.areaID;});
                    $container.find('.table-responsive').remove();
                    $container.append($(resultTpl(mapRenderData(areas))));
                    initEventSwitcher($container.find('table tr td input[type="checkbox"]'));
                } else {
                    topTip({type: 'danger', msg: rsp.resultmsg})
                }
            });
        }

        function initEventSwitcher($checkbox) {
            $checkbox.each(function () {
                var $el = $(this),
                    areaID = $el.attr('data-id'),
                    params = {shopID: shopID, areaID: areaID};
                $el.bootstrapSwitch({
                    state: !!$el.data('status'),
                    size: 'normal',
                    onColor: 'primary',
                    offColor: 'default',
                    onText: '已启用',
                    offText: '未启用'
                }).on('switchChange.bootstrapSwitch', function (e, state) {
                    var tip = state ? '开启' : '关闭';
                    U.Confirm({
                        title: tip + '区域',
                        msg: '你确定要' + tip +'该区域吗？',
                        okFn: function () {
                            G.switchTableArea(IX.inherit({isActive: +state}, params), function (rsp) {
                                if (rsp.resultcode != '000') {
                                    topTip({msg: rsp.resultmsg, type: 'danger'});
                                    $el.bootstrapSwitch('toggleState', true);
                                    return;
                                }
                                topTip({msg: '操作成功', type: 'success'});
                            });
                        },
                        cancelFn: function () {
                            $el.bootstrapSwitch('toggleState', true);
                        }
                    });
                });
            });
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
                                id: $XP(row, 'areaID'),
                                key : $XP(row, 'sortindex'),
                                type : 'sortTop'
                            },
                            {
                                link : 'javascript:void(0);',
                                clz: 'ml-6 glyphicon glyphicon-arrow-up sort-up',
                                id: $XP(row, 'areaID'),
                                key : $XP(row, 'sortindex'),
                                type : 'sortUpOrDown'
                            },
                            {
                                link : 'javascript:void(0);',
                                clz : 'ml-6 glyphicon glyphicon-arrow-down sort-down',
                                id: $XP(row, 'areaID'),
                                key : $XP(row, 'sortindex', ''),
                                type : 'sortUpOrDown'
                            },
                            {
                                link : 'javascript:void(0);',
                                clz : 'ml-6 glyphicon glyphicon-arrow-down sort-bottom',
                                id: $XP(row, 'areaID'),
                                key : $XP(row, 'sortindex', ''),
                                type : 'sortBottom'
                            }
                        ]
                    };
                    break;
                case "rowControl" :
                    r = {
                        type : 'button',
                        btns : [
                            {
                                label : '可选菜品分类',
                                link : 'javascript:void(0);',
                                id : $XP(row, 'areaID', ''),
                                type : 'setCategory'
                            },
                            {
                                label : '修改',
                                link : 'javascript:void(0);',
                                clz: 'm-l',
                                id : $XP(row, 'areaID', ''),
                                type : 'editTableArea'
                            },
                            {
                                label : '删除',
                                link : 'javascript:void(0);',
                                clz : 'm-l',
                                id : $XP(row, 'areaID', ''),
                                type : 'delTableArea'
                            }
                        ]
                    };
                    break;
                case "isActive":
                    r.value = v;
                    r.text = '<input type="checkbox" name="switch_event" data-status="'+ v + '" data-id="' + $XP(row, 'areaID', '') + '" '
                    + (v == 1 ? 'checked ' : '') + '/>';
                    break;
                default :
                    r.value = r.text = $XP(row, colKey, '');
                    break;
            }
            return r;
        }

        //组装表格显示的rows
        function mapRenderData(records) {
            var self = this;
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
                return {
                    clz: '',
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
                addTableArea: editTableArea,
                editTableArea: editTableArea,
                delTableArea: delTableArea,
                setCategory: setCategory,
                sortTop: sortArea,
                sortUpOrDown: sortArea,
                sortBottom: sortArea
            };
            $container.on('click', '.btn.add-table-area', function (e) {
                e.preventDefault();
                //新增
                editTableArea();
            }).on('click', 'table tr td a', function (e) {
                e.preventDefault();
                //修改, 删除, 设置
                var $el = $(this),
                    eventName = $el.data('type');
                clickEventMap[eventName]($el);
            });
        }

        function editTableArea($el) {
            //添加或修改区域信息
            var areaInfo = {},
                areaID = $el ? $el.attr('data-id') : '';
            if (areaID) {
                areaInfo = _.findWhere(areas, {areaID: areaID + ''});
                if(areaInfo) areaInfo.areaNote = C.decodeTextEnter(areaInfo.areaNote);
            }
            var status = areaID ? '修改' : '添加',
                modalDialog = U.ModalDialog({
                    id: 'editTableArea',
                    title: status + '区域',
                    hideCloseBtn: 'false',
                    html: editModalTpl(areaInfo),
                    backdrop: 'static'
                }).show();
            modalDialog._.footer.find('.btn.btn-close').text('关闭');
            registerFormValidate(modalDialog._.body.find('.form-area'), areaID);
            bindUpdateArea(modalDialog, areaID);
        }

        function registerFormValidate($form, areaID) {
            $form.bootstrapValidator({
                fields: {
                    areaName: {
                        validators: {
                            notEmpty: {message: '区域名称不能为空'}
                        }
                    }
                }
            });
        }

        function bindUpdateArea(modalDialog, areaID) {
            modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                var $form = modalDialog._.body.find('.form-area');
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
                var data = parseForm($form),
                    postParams = IX.inherit({shopID: shopID, areaID: areaID}, data);
                postParams.areaNote = C.encodeTextEnter(postParams.areaNote);
                postParams.areaName = $.trim(postParams.areaName);
                var nameCheckData = {shopID:shopID, areaName:postParams.areaName, areaID: areaID};
                function callbackFn(res){
                    topTip({msg: (!areaID ? '添加' : '修改') + '成功！', type: 'success'});
                    modalDialog.hide();
                    renderTable();
                }
                if(!areaID){
                    C.NestedAjaxCall("checkAreaNameExist","addTableArea",nameCheckData,postParams,callbackFn);
                }else{
                    C.NestedAjaxCall("checkAreaNameExist","updateTableArea",nameCheckData,postParams,callbackFn);  
                }
            });
        }

        function delTableArea($el) {
            var areaID = $el.attr('data-id'),
                areaTableCount = $XP(_.findWhere(areas, {areaID: areaID + ''}), 'num', 0);
            if (areaTableCount == 0) {
                U.Confirm({
                    title: '删除区域',
                    msg: '你确定要删除该区域吗？',
                    okFn: function () {
                        G.deleteTableArea({shopID: shopID, areaID: areaID}, function (rsp) {
                            if(rsp.resultcode != '000') {
                                topTip({msg: rsp.resultmsg, type: 'danger'});
                                return;
                            }
                            topTip({msg: '删除成功', type: 'success'});
                            renderTable();
                        });
                    }
                });
            } else {
                topTip({msg: '该区域下还有桌台，不能删除', type: 'danger'});
            }
        }

        function setCategory($el) {
            var areaID = $el.attr('data-id'),
                area = _.findWhere(areas, {areaID: areaID + ''}),
                selCategoryCodes = area.foodCategoryCodeLst.split(',');
            var renderCategory = function () {
                var isCustomSelCategory = area.foodCategoryCodeLst && selCategoryCodes.length != 0,
                    checkboxes = {
                        areaName: area.areaName,
                        allChecked: isCustomSelCategory ? '' : 'checked',
                        customChecked: isCustomSelCategory ? 'checked' : '',
                        checkboxes: _.map(IX.clone(categories), function (category) {
                            return {
                                categoryCode: category.foodCategoryCode,
                                text: category.foodCategoryName,
                                checked: _.contains(selCategoryCodes, category.foodCategoryCode) ? 'checked' : '',
                                disabled: isCustomSelCategory ? '' : 'disabled'
                            };
                        })
                    },
                    modalDialog = U.ModalDialog({
                        id: 'setCategory',
                        title: '可选菜品分类',
                        html: setCategoryTpl(checkboxes),
                        backdrop: 'static'
                    }).show();
                modalDialog._.footer.find('.btn.btn-close').text('关闭');
                bindUpdateAreaCategory(modalDialog, areaID)
            };
            if (categories) {
                renderCategory();
            } else {
                G.queryCategories({shopID: shopID}, function (rsp) {
                    if (rsp.resultcode != '000') {
                        topTip({msg: rsp.resultcode, type: 'danger'});
                        return;
                    }
                    categories = rsp.data.records || [];
                    renderCategory();
                });
            }
        }

        function sortArea($el) {
            var isFirst = $el.parents('tr').prev().length == 0,
                isUpOrTop = $el.hasClass('glyphicon-arrow-up'),
                isLast = $el.parents('tr').next().length == 0,
                isDownOrBottom = $el.hasClass('glyphicon-arrow-down');
            if((isFirst && isUpOrTop) || (isLast && isDownOrBottom)) return;
            var areaID = $el.attr('data-id'),
                sortType = $el.attr('data-type'),
                $currentTr = $el.parents('tr'),
                params = {shopID: shopID, areaID: areaID},
                sortOperatorMap = {
                    sortTop: {callServer: G.tableAreaSortTop, swapDom: $currentTr.parents('tbody').find('tr:first')},
                    sortUpOrDown: {callServer: G.tableAreaSortUpOrDown, swapDom: $el.hasClass('sort-up') ? $currentTr.prev() : $currentTr.next()},
                    sortBottom: {callServer: G.tableAreaSortBottom, swapDom: $currentTr.parents('tbody').find('tr:last')}
                },
                $swapStoreData = sortOperatorMap[sortType].swapDom.find('.sort-up'),
                sortIndex2 = sortType == 'sortUpOrDown' ?
                {
                    sortIndex: $el.attr('data-key'),
                    areaID2: $swapStoreData.attr('data-id'),
                    sortIndex2: $swapStoreData.attr('data-key')
                } : {};
            sortOperatorMap[sortType].callServer(IX.inherit(params, sortIndex2), function (rsp) {
                if (rsp.resultcode != '000') {
                    topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                var trSortIndex = $el.attr('data-key'),
                    swapSortIndex = $swapStoreData.attr('data-key');
                if(sortType == 'sortTop' || sortType == 'sortBottom') {
                    var $newTr = $('<tr>'),
                        newSortIndex = $XP($XP(rsp.data, 'records', [])[0], 'sortIndex', '0'),
                        insertDomFn = sortType == 'sortTop' ? 'before' : 'after';
                    _.each($currentTr.find('.glyphicon-arrow-up,.glyphicon-arrow-down'), function(el){
                        $(el).attr('data-key', newSortIndex);
                    });
                    $newTr.append($currentTr.children());
                    sortOperatorMap[sortType].swapDom[insertDomFn]($newTr);
                    $currentTr.remove();
                } else {
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

        function bindUpdateAreaCategory(modalDialog, areaID) {
            var modalBody = modalDialog._.body;
            modalBody.on('change', 'input[name="isCustom"]', function () {
                var $el = $(this),
                    isCustomChecked = $el.parent().text().indexOf('自定义') != -1,
                    $selCategories = modalBody.find('input[name="category"]');
                if(isCustomChecked) {
                    $selCategories.removeAttr('disabled')
                } else {
                    $selCategories.prop('checked', false).attr('disabled', 'disabled');
                }
            });
            modalDialog._.footer.on('click', '.btn.btn-ok', function () {
                var foodCategoryCodeLst = _.map(modalBody.find('input[name="category"]:checked'), function (input) {
                        return $(input).attr('data-key');
                    }).join(',');
                G.setAreaCategory({areaID: areaID,shopID: shopID, foodCategoryCodeLst: foodCategoryCodeLst}, function (rsp) {
                    if (rsp.resultcode != '000') {
                        topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    topTip({msg: '操作成功', type: 'success'});
                    var area = _.findWhere(areas, {areaID: areaID + ''});
                    area.foodCategoryCodeLst = foodCategoryCodeLst;
                    modalDialog.hide();
                });
            });
        }

    };
})(window, jQuery);