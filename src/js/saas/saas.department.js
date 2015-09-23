(function ($, window) {
    IX.ns("Hualala.Saas.department");
    var G = Hualala.Global,
        U = Hualala.UI,
        C = Hualala.Common,
        topTip = U.TopTip,
        parseForm = C.parseForm,
        dTypes = Hualala.TypeDef.SaasDepartmentType,
        printTypes=Hualala.TypeDef.SaasPrintType;
    var $alert = $('<div class="alert alert-warning t-c">暂无任何部门。</div>'),
        DepartmentSetsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_department_sets')),
        editdepartmentTpl = Handlebars.compile(Hualala.TplLib.get('tpl_department_add_update')),
        $table = null, departments = [], department = null, dType=null,
        setId = null, isAdd = null, $editSet = null, modal = null, bv = null,$d;
    Hualala.Saas.department.initDepartment = function($department){
        $d = $department;
        renderSets($d);
        //增加和修改事件绑定
        $department.on('click', '.well .btn, td .department-update', renderDialog);
        $department.on('click', 'td .department-delete', deletedepartment);  
    }
    //部门渲染
    function renderSets($department){
        G.getSaasDepartments({}, function(rsp){
            if(rsp.resultcode != '000'){
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            departments = $.extend(true, {records:[]}, rsp.data).records;
            preProcessSets(departments);
            $(DepartmentSetsTpl({departments: departments})).appendTo($department.empty());
            $table = $department.find('table');
            if(!departments.length){
                $table.addClass('hidden');
                $department.append($alert);
                return;
            }
        });
    }
    //获取部门id
    function getSetById(departments, id){
        for(var i = departments.length - 1, department; department = departments[i--];)
            if(department.itemID == id) return department;
    }
    //部门的数据处理
    function preProcessSets(departments){
        _.each(departments,function(department){
            if(department.departmentRemark=="0"){
               department.departmentRemark=" "; 
            }
            else{
                department.shortRemarks=department.departmentRemark;
                if(department.shortRemarks.length<20){
                    department.shortRemarks = C.decodeTextEnter(department.departmentRemark)

                }
                else{
                    department.shortRemarks = C.decodeTextEnter(department.departmentRemark);
                    department.shortRemarks = C.substrByte(department.shortRemarks, 40) + '...';
                }
            }

        })
        // var currentType=_.findWhere(dTypes,{key:department.departmentType});
        //     department.departmentTypeText=currentType.text;
        // var currentPrintType = _.findWhere(printTypes,{key:department.printType});
        // department.printTypeText=currentPrintType.text;
    } 
    //添加和修改部门模态框
    function renderDialog(e){
        var id = $(e.target).data('setid');
        setId = id;
        isAdd = id === undefined;
        //department数组对象
        department = getSetById(departments, id) || {};
        if(id!=undefined){
            department.departmentRemark = C.decodeTextEnter(department.departmentRemark)
        }
        //select下拉框的内容填充，扩充数据
        dTypes=_.map(dTypes,function (dTypes){
            return _.extend(dTypes,{selected:dTypes.value==department.departmentType ? 'selected' : ''});
        })
        printTypes=_.map(printTypes,function (printTypes) {
            return _.extend(printTypes,{selected:printTypes.value==department.printType ? 'selected' :''});
        }) 
        var modalVals = {department: department, dTypes: dTypes,printTypes:printTypes};
        var dTitle = (isAdd ? '添加' : '修改') + '部门',
            itemID =department.itemID || 0 ;
        $editSet = $(editdepartmentTpl(modalVals));
        modal = new U.ModalDialog({
            title: dTitle,
            backdrop : 'static',
            html: $editSet
        }).show();
        formValid($editSet);
        bv = $editSet.data('bootstrapValidator');
        submitSet(itemID);
    }
    function formValid($form){
        $form.bootstrapValidator({
            fields: {
                departmentName: {
                    validators: {
                        notEmpty: { message: '部门名不能为空' },
                        stringLength : {
                            min : 1,
                            max : 50,
                            message : "部门名称长度在1-50个字符之间"
                        }
                    }
                },
                departmentType: {
                    validators: {
                        notEmpty: { message: '部门类型不能为空' }
                    }
                },
                departmentRemark: {
                    validators : {
                        stringLength : {
                            max : 250,
                            message : '部门描述不能超过250个字'}
                    }
                }   
            }
        });
    }
    //添加和更新部门列表
    function submitSet(itemID){
        modal._.footer.find('.btn-ok').on('click', function (e){
            if(!bv.validate().isValid()) return;
            var data = parseForm($editSet);
            data.departmentName = data.departmentName || 0;
            data.departmentRemark = C.encodeTextEnter(data.departmentRemark)|| 0;
            data.departmentType =data.departmentType ||0;
            var user = $XP(Hualala.getSessionData(),'user',''),
                loginName = $XP(user,'loginName',''),
                groupLoginName = $XP(user,'groupLoginName',''),
                groupID = $XP(user,'groupID','');
            var createBy=groupLoginName+'_'+loginName;
                _.extend(data,{createBy:createBy});
                data.departmentName = $.trim(data.departmentName);
            var nameCheckData = {departmentName:data.departmentName,groupID: groupID,itemID: itemID}
            function callbackFn(res){
                topTip({msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'});
                renderSets($d);
                modal.hide();
            }
            if(isAdd){
                C.NestedAjaxCall("checkDepartmentlName","addSaasDepartment",nameCheckData,data,callbackFn);
            }else{
                data.itemID = setId;
                C.NestedAjaxCall("checkDepartmentlName","updateSaasDepartment",nameCheckData,data,callbackFn);  
            }
        });    
    }
    //删除
    function deletedepartment(e){
        var id = $(e.target).data('setid');
        setId = id;
        department = getSetById(departments, id) || {};
        var params ={itemID:id};
        U.Confirm({
            title: '刪除部门',
            msg: '你确定要删除此部门吗？',
            okFn: function () {
                G.deleteSaasDepartment(params, function (rsp) {
                    if(rsp.resultcode != '000'){
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    topTip({msg:'删除成功',type: 'success'});
                    renderSets($d);
                })
            }
        });
    }
})(jQuery, window);