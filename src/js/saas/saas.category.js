$( function ($, window) {
    IX.ns('Hualala.Saas.Category');
    var G = Hualala.Global,
        C = Hualala.Common,
    /** staticData 表格需要显示的数据
        *categories 从后台查询的分类信息
        *categoryTableHead 表格的表头
        * departments 从后台查询的部门信息
     *  */
        staticData = {
            categories: [],
            tableHeads: [' 分类名称 ', '菜品数量', '分类说明', ' 出品部门 ', '收入科目', '排序 ', '启用状态 ', ' 操作 '],
            tableClass: 'saas-category-table',
            departments:null,
            subjects: null
        },
        topTip = Hualala.UI.TopTip,
        $tbody, $container,
        categoryTableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_category')),
        categoryTrTpl = Handlebars.compile(Hualala.TplLib.get('tpl_category_tr')),
        noDataTipTpl = Handlebars.compile(Hualala.TplLib.get(('tpl_no_records'))),
        selectTpl = Handlebars.compile(Hualala.TplLib.get(('tpl_select'))),
        shopID = '';

    function renderSelect($select, selectName, data, key, name, selectedItemVal) {
        var selectData = _.map(IX.clone(data), function (record) {
            var selected;
            if(selectedItemVal) selected = {selected: selectedItemVal == $XP(record, key, '') ? 'selected' : ''}
            return IX.inherit({value: $XP(record, key, ''), name:  $XP(record, name, '')}, selected);
        });
        $select.append(selectTpl({options: selectData, name: selectName}));
    }

    function initCategory($category, routeParam) {
        if(routeParam) shopID = routeParam;
        var btn = '<div class="t-r"><button class="btn btn-warning add-category">新增分类</button></div>';
        $category.before($(btn));
        //初始化表格
        initCategoryTable();
        //从后台请求分类信息
        queryCategories();
        //绑定对分类数据的操作的事件
        bindCategoryOperate();
    };

    function initCategoryTable() {
        $container = $('.page-body');
        $(categoryTableTpl(staticData)).appendTo($container);
        $tbody = $container.find('tbody');
    }

    function renderCategories() {
        if (staticData.categories && staticData.categories.length > 0) {
            if($container.find('.saas-category-table').length == 0){
                $container.empty();
                initCategoryTable();
            }
            $tbody.empty();
            $(categoryTrTpl(staticData)).appendTo($tbody);
            //生成一个bootstrap的开关
            createSwitch($tbody.find('input.status'));
        } else {
            $container.empty();
            $(noDataTipTpl({title: '分类'})).appendTo($container);
        }
    }

    function queryCategories() {
        var params = {shopID: shopID};
        G.getSaasCategories(extendGroupIDTo(params), function(rsp)
        {
            //用extend方法深度拷貝一份records
            staticData.categories = IX.clone(rsp.data.records);
            renderCategories();
        });
    }

    function queryDepartments(modal, selectedItemVal) {
        var params = {departmentType: '1,3'};
        C.loadData('getSaasDepartments', params, staticData.departments).done(function (records) {
            if(!records || records.length == 0) {
                Hualala.UI.TopTip({msg: '请先添加部门', type: 'danger'});
                return;
            }
            staticData.departments = records;
            renderSelect(modal._.body.find('.department-select'), 'departmentKey', records, 'departmentKey', 'departmentName', selectedItemVal);
        });
    }

    function querySubjects(modal, selectedItemVal) {
        var params = {sellSubject: '1'};
        C.loadData('querySaasSubject', params, staticData.subjects).done(function (records) {
            if(!records || records.length == 0) {
                Hualala.UI.TopTip({msg: '请先添加科目', type: 'danger'});
                return;
            }
            staticData.subjects = records;
            renderSelect(modal._.body.find('.subject-select'), 'foodSubjectKey', staticData.subjects, 'subjectKey', 'subjectName', selectedItemVal);
        });
    }

    function createSwitch($checkbox)
    {
        _.each($checkbox, function (el) {
            var $el = $(el);
            $el.bootstrapSwitch({
                state: !!$el.data('status'),
                onColor : 'success',
                onText : '已启用',
                offText : '未启用'
            });
        });
        $checkbox.on('switchChange.bootstrapSwitch', function (el, state)
        {
            var $this = $(this),
                stateText = state ? '开启' : '关闭';
            var categoryId = $this.parents('tr').data('foodid');
            var params = {foodCategoryID: categoryId, isActive: state ? 1 : 0};
            Hualala.UI.Confirm({
                title : stateText + "分类",
                msg : "你确定要" + stateText + "此分类吗？",
                okFn : function () {
                    G.switchSaasCategory(extendGroupIDTo(params, categoryId), function(rsp) {
                        responseResult(rsp, function (data) {
                            staticData.categories[findCategoryIndex(categoryId)].isActive = state;
                        }, {msg: stateText + '成功', type: 'success'});
                    });
                },
                cancelFn : function () {
                    $this.bootstrapSwitch('toggleState', true);
                }
            });
        });
    }

    function extendGroupIDTo(self, categoryID) {
        var groupID = !categoryID ? $XP(Hualala.getSessionSite(), 'groupID', -1) : $XP(findCategoryBy(categoryID), 'groupID', '');
        _.extend(self, {groupID: groupID});
        return self;
    }
    function findCategoryBy(categoryID) {
        return _.find(staticData.categories, function (category) {
            return category.foodCategoryID == categoryID;
        });
    }

    function findLastCategoryBy(currentID) {
        return staticData.categories[findCategoryIndex(currentID) - 1];
    }

    function findNextCategoryBy(currentID) {
        return staticData.categories[findCategoryIndex(currentID) + 1];
    }

    function findCategoryIndex(categoryID) {
        var categoryIds = _.pluck(staticData.categories, 'foodCategoryID');
        return _.indexOf(categoryIds, categoryID + '');
    }

    function bindDeleteCategory() {
        $container.on('click', 'tbody tr td a.delete-category', function () {
            var $this = $(this);
            var foodCategoryID = $this.parents('tr').data('foodid');
            var params = {foodCategoryID: foodCategoryID};
            params = extendGroupIDTo(params, foodCategoryID);
            Hualala.UI.Confirm({
                title: '刪除分类',
                msg: '删除后该菜品分类信息以及该菜品分类下的菜品都将被清空，无法再进行任何操作!!!<br/>你确定要删除此分类吗？',
                okFn: function () {
                    G.deleteSaasCategory(IX.inherit({}, params, {shopID: shopID}), function (rsp) {
                        var successMsg = {msg: '刪除成功', type: 'success'};
                        responseResult(rsp, function (data) {
                            staticData.categories.splice(findCategoryIndex(foodCategoryID), 1);
                            renderCategories();
                        },successMsg);
                    });
                }
            });
        });
    }

    function bindAddCategory(categoryModal) {
        $container.parents('.container').on('click', '.add-category', function () {
            var updateModal = new Hualala.UI.ModalDialog({
                title: '新增分类',
                id: 'categoryInfoModal',
                html: $(categoryModal()),
                backdrop: 'static'

            }).show();
            queryDepartments(updateModal);
            querySubjects(updateModal);
            updateModal._.footer.find('.btn-ok').text('提交');
            updateModal._.footer.find('.btn-close').text('关闭');
            //使用bootstrapValidator监听表单输入的数据是否符合要求
            formValidateRegister();
            //绑定添加或修改分类信息的提交表单事件
            bindSubmit(updateModal);
        });
    }

    function bindUpdateCategory(categoryModal) {
        $container.on('click', 'tbody tr td a.update-category', function () {
            var $current_tr = $(this).parents('tr'),
                current_category = findCategoryBy($current_tr.data('foodid'));
            //当前正在修改的分类的信息
            var categoryInfo = {
                foodCategoryID: current_category.foodCategoryID,
                foodCategoryName: current_category.foodCategoryName,
                description: Hualala.Common.decodeTextEnter(current_category.description)
            };
            var updateModal = new Hualala.UI.ModalDialog({
                title: '修改分类',
                id: 'categoryInfoModal',
                html: $(categoryModal(categoryInfo)),
                backdrop: 'static'
            }).show();
            queryDepartments(updateModal, current_category.departmentKey);
            querySubjects(updateModal, current_category.foodSubjectKey);
            updateModal._.footer.find('.btn-ok').text('提交');
            updateModal._.footer.find('.btn-close').text('关闭');
            formValidateRegister();
            bindSubmit(updateModal);
        });
    }

    function bindSubmit(modalDialog) {
        modalDialog._.footer.on('click', '.btn-ok', function () {
            var $form = $(this).parents('.modal-footer').siblings('.modal-body').find('form');
            $form.data('bootstrapValidator').validate();
            if (!$form.data('bootstrapValidator').validate().isValid()) return;
            var data = Hualala.Common.parseForm($form);
            data.description = Hualala.Common.encodeTextEnter(data.description);
            var $foodCategoryID = $form.find('[name="foodCategoryID"]');
            var isAdd = $foodCategoryID.length == 0,
                foodCategoryID = '', groupID = Hualala.getSessionSite().groupID;
            var selectedDepartment = {departmentName: $XP(_.findWhere(staticData.departments, {departmentKey: data.departmentKey}), 'departmentName', '')},
                selectedSubject = {foodSubjectName: $XP(_.findWhere(staticData.subjects, {subjectKey: data.foodSubjectKey}), 'subjectName', '')};
            if (!isAdd) {
                foodCategoryID = $foodCategoryID.val();
                groupID = findCategoryBy(foodCategoryID).groupID;
            }
            _.extend(data, {foodCategoryID: foodCategoryID, groupID: groupID, shopID: shopID});
            G[isAdd ? 'createSaasCategory' : 'updateSaasCategory'](data, function (rsp) {
                var successMsg = {msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'};
                responseResult(rsp, function (result) {
                    if (isAdd) {
                        var category = result.data.records[0];
                        staticData.categories = staticData.categories || [];
                        staticData.categories.push(IX.inherit({}, category,
                            {subjectKey: data.foodSubjectKey},
                            {departmentKey: data.departmentKey},
                            selectedDepartment, selectedSubject));
                    } else {
                        staticData.categories[findCategoryIndex(foodCategoryID)] = IX.inherit(staticData.categories[findCategoryIndex(foodCategoryID)],
                            data, selectedDepartment, selectedSubject);
                    }
                    renderCategories();
                }, successMsg, modalDialog);
            });
        });
    }

    function bindCategorySort() {
        //绑定“移到顶部”事件
        $container.on('click', 'tbody tr td a.sort-top', function () {
            var foodid = $(this).parents('tr').data('foodid');
            if (!findLastCategoryBy(foodid)) return;
            var params = {foodCategoryID: foodid};
            G.sortSaasCategoryTop(extendGroupIDTo(params, foodid), function (rsp) {
                responseResult(rsp, queryCategories);
            });
        });

        //绑定“向上/向下移动”事件
        $container.on('click', 'tbody tr td a.sort-up, tbody tr td a.sort-down', function () {
            var foodid = $(this).parents('tr').data('foodid');
            var isMoveUp = $(this).hasClass('sort-up');
            var currentCategory = findCategoryBy(foodid),
                otherCategory = isMoveUp ? findLastCategoryBy(foodid) : findNextCategoryBy(foodid);
            if (!otherCategory) return;
            var params = {foodCategoryID: foodid, sortIndex: currentCategory.sortIndex,
                foodCategoryID2: otherCategory.foodCategoryID, sortIndex2: otherCategory.sortIndex};
            G.sortSaasCategoryUpOrDown(extendGroupIDTo(params, foodid), function (rsp) {
                responseResult(rsp, queryCategories)
            });
        });

        //绑定“移到底部”事件
        $container.on('click', 'tbody tr td a.sort-bottom', function () {
            var foodid = $(this).parents('tr').data('foodid');
            if (!findNextCategoryBy(foodid)) return;
            var params = {foodCategoryID: foodid};
            G.sortSaasCategoryBottom(extendGroupIDTo(params, foodid), function (rsp) {
                responseResult(rsp, queryCategories)
            });
        });
    }

    function bindCategoryOperate() {
        //editModalTpl为添加或修改分类信息弹出的模态框
        var editModalTpl = Handlebars.compile(Hualala.TplLib.get('tpl_category_modal'));
        //绑定删除一条分类的事件
        bindDeleteCategory();
        //绑顶分类数据的排序事件
        bindCategorySort();
        //绑顶添加分类的事件
        bindAddCategory(editModalTpl);
        //绑顶修改分类的事件
        bindUpdateCategory(editModalTpl);
    }

    function formValidateRegister() {
        var $form = $('.modal-body').find('form');
        var foodCategoryID = $form.find('input[name="foodCategoryID"]').val();
        $form.bootstrapValidator({
            fields: {
                foodCategoryName: {
                    validators: {
                        notEmpty: {message: '分类名称不能为空'},
                        stringLength: {
                            min: 1,
                            max: 80,
                            message: '分类名称必须在1-80个字符之间'
                        },
                        ajaxValid : {
                            api : "checkSaasCategoryNameExist",
                            data : {
                                shopID: shopID,
                                groupID: $XP(Hualala.getSessionSite(), 'groupID', ''),
                                foodCategoryID: foodCategoryID ? foodCategoryID : ''
                            }
                        }
                    }
                },
                departmentKey: {
                    validators: {
                        notEmpty: { message: '部门不能为空' }
                    }
                }
            }
        });
    }

    //请求后台数据的success回调
    function responseResult(rsp, successCbFn, successMsg, modal) {
        if (rsp.resultcode != '000') {
            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
            return;
        }
        if (modal != undefined) modal.hide();
        if(IX.isFn(successCbFn)) successCbFn(rsp);
        if(!!successMsg) topTip(successMsg);
    }

    Hualala.Saas.Category.initCategory = initCategory;

}(jQuery , window ));
