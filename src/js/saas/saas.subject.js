$( function ($, window) {
    IX.ns('Hualala.Saas.Subject');
    var G = Hualala.Global,
        U = Hualala.UI,
        C = Hualala.Common,
        topTip = U.TopTip,
        parseForm = C.parseForm;

    subjectsTableAttr = {
        tableClass: 'saas-subjects-table',
        tableHeads: ["科目名称", "内置科目", "手续费率（%）", /*"是否用于结账",*/"科目说明","创建人", "启用状态", "操作"],
        displayAttr: ["subjectName", "isGlobal", "subjectRate", /*"isPay",*/ "payRemark","createBy", "isActive","rowControl"]
    };
   var $alert = $('<td colspan="7"> <p class="alert t-c">暂无任何收款科目信息。</p></td>'),
        SubjectTab = Handlebars.compile(Hualala.TplLib.get('tpl_subject_tab')),
        SubjectQueryForm =Handlebars.compile(Hualala.TplLib.get('tpl_subject_query')),
   		SubjectTableTpl = Handlebars.compile(Hualala.TplLib.get('tpl_category')),
   		subjectTrTpl =Handlebars.compile(Hualala.TplLib.get('tpl_subject_tbody')),
        editsubjectTpl = Handlebars.compile(Hualala.TplLib.get('tpl_subject_modal')),
        $table = null, $tbody=null,$container=null,$tab=null,$tabul=null,$tabcontent=null,modal = null, bv = null,setId = null, isAdd = null, 
        $editSet = null,$form = null;
               
    Hualala.Saas.Subject.initSubject = function($subject){
        var groupID =$XP(Hualala.getSessionSite(),'groupID','');
        var params={groupID:groupID};
        initTab();
        preSubjectTable();
        renderSets(params);
        $form = $subject.find('form');
        $subject.on('click', '.subject-tabs li a', function(){
            $('.saleSubject').parentsUntil($("ul")).toggleClass('active');
            $('.checkSubject').parentsUntil($("ul")).toggleClass("active");
            $(':text[name=subjectName]').val("");
            renderSets(params);
        });
        $subject.on('click', 'td .subject-add,td .subject-update', renderDialog);
        $subject.on('click', 'td .subject-delete', deleteSubject);
        $subject.on('click','.query-form .btn',searchSubject);
    }
    function initTab(){
        $container = $('.page-body');
        $(SubjectTab()).appendTo($container.empty());
        $tab = $container.find('.detail-tabs');
        var tabFuncs = [
            {key : "checkSubject", label : "结账科目"},
            {key : "saleSubject", label : "收入科目"}
        ],tabFunc;
        $tabul = $tab.find(".navbar-nav");
        $tab = $container.find('.detail-tabs');
        for(var i=0;i<tabFuncs.length;i++){
            var tabFunc =tabFuncs[i].key,
                label = tabFuncs[i].label;
            $('<li></li>').append($('<a></a>').attr({'href':'javascript:;', 'class':tabFunc}).text(label)).appendTo($tabul);
        }
        $('.checkSubject').parentsUntil($("ul")).addClass('active')
        
    }
    function preSubjectTable() {
        $tabcontent = $container.find('.tab-content');
        searchParam = {
            firstItem: {name: 'subjectName', value: '科目关键字'}
        };
        $(SubjectQueryForm(searchParam)).appendTo($tabcontent);
        $(SubjectTableTpl(subjectsTableAttr)).appendTo($tabcontent);
        $tbody = $tabcontent.find('tbody');
    }
    //获取查询数据
    function renderSets(params, cbFn){
        if($('.subject-tabs li.active a')[0].text=="结账科目"){
            params=_.extend(params,{sellSubject:0})
        }
        else{
            params=_.extend(params,{sellSubject:1})
        }
        G.querySaasSubject(params, function(rsp){
            if(rsp.resultcode != '000'){
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            subjects = $.extend(true, {records:[]}, rsp.data).records || [];
            preProcessSets(subjects);
            groupsubjects=_.groupBy(subjects,'subjectGroupName');
            if(!subjects.length){
                //$tbody.addClass('hidden');
                $alert.appendTo($tbody.empty());
                return;
            }
            else{
              renderSubjectTable($tbody, groupsubjects);   
            }
        });
    }
    function renderSubjectTable($tbody, items){
        $(subjectTrTpl({items: items})).appendTo($tbody.empty());
        if($('.subject-tabs li.active a')[0].text=="收入科目"){
            $($('.saas-subjects-table  th')[2]).addClass("hidden");
            $($('.saas-subjects-table tr.group .tdSum')).attr("colspan","5");
            $($('.saas-subjects-table tbody  td.subjectRate')).addClass("hidden");
            for(var i = subjects.length - 1, subject; subject = subjects[i--];){
                if(subject.isGlobal=="1"){
                    $($tbody.find('input[type="checkbox"]')[i+1]).prop("hidden",true);
                }
                else{
                   $($tbody.find('input[type="checkbox"]')[i+1]).prop("disabled",false).addClass("show");  
                }
            }
        }
        else{
            $($('.saas-subjects-table  th')[2]).removeClass("hidden");
            $tbody.find('input[type="checkbox"]').addClass("show");
        }
        createSwitch($container.find('tbody input.show'));
    }
    //数据处理
    function preProcessSets(subjects){
        for(var i = subjects.length - 1, subject; subject = subjects[i--];){
            subject.checked = +subject.isActive ? 'checked' : '';
            if (subject.isGlobal=="1") {
                subject.nameisGlobal="是";
                subject.operateBtn=false;
            }
            else{
                subject.nameisGlobal="否";
                subject.operateBtn=true;
            };
            if(subject.isPay=="1"){
                subject.nameisPay="是";
            }
            else{
               subject.nameisPay="否"; 
            }
            if (subject.createBy=="0") {
                subject.ncreateBy=" ";
            }
            else{
                subject.ncreateBy=subject.createBy;
            };
            if(subject.payRemark!="0"){
                if(subject.payRemark.length>0){
                    subject.payRemark =Hualala.Common.decodeTextEnter(subject.payRemark); }
            } 
            else{
                subject.payRemark=" ";
            }
            if(subject.subjectRate!="0.0000"){
                subject.subjectRate=(subject.subjectRate).substring(0,(subject.subjectRate).indexOf(".") + 3);
            }else{
                subject.subjectRate=" ";
            };
        }
    }
    //获取对应id的记录
    function getSetById(subjects, id){
        for(var i = subjects.length - 1, subject; subject = subjects[i--];)
            if(subject.itemID == id) return subject;
    }
    function searchSubject(){
        var groupID =$XP(Hualala.getSessionSite(),'groupID','');
        var params={groupID:groupID};
        var args = parseForm($form);
        $.extend(params, args);
        renderSets(params);
    }
    //开关操作
    function createSwitch($checkbox){
        $checkbox.bootstrapSwitch({
            onColor : 'success',
            onText : '已开启',
            offText : '未开启'
        }).on('switchChange.bootstrapSwitch', function (e, state){
            var $this = $(this), setID = $this.data('setid'),
                stateText = state ? '开启' : '关闭';
            Hualala.UI.Confirm({
                title : stateText + "科目",
                msg : "您确定要" + stateText + "此科目吗？",
                okFn : function () {
                    G.switchSaasSubjectstate({itemID: setID, isActive: +state}, function (rs)
                    {
                        if(rs.resultcode != '000')
                        {
                            $this.bootstrapSwitch('toggleState', true);
                            topTip({msg: stateText + '失败' + (rs.resultmsg ? '：' + rs.resultmsg : ''), type: 'danger'});
                            return;
                        }
                        topTip({msg: stateText + '成功！', type: 'success'})
                    });
                },
                cancelFn : function () {
                    $this.bootstrapSwitch('toggleState', true);
                }
            });
        });
    }  
    //添加和修改模态框
    function renderDialog(e){
        var id = $(e.target).data('setid');
        var GroupName=$(e.target).data('setgroupname');
        setId = id;
        setgroupname =GroupName;
        isAdd = id === undefined;
        subject = getSetById(subjects, id) || {};
        if(id!=undefined){
            subject.payRemark  = Hualala.Common.decodeTextEnter(subject.payRemark)
        }
        var dTitle = (isAdd ? '添加' : '修改') + '科目',
            itemID =subject.itemID || 0;
            subject.subjectGroupName= GroupName||0;
            subject.display=+subject.isPay ? 'checked' : '';
            subject.selected =+subject.isMoneyWipeZero ? 'checked' : '';
        $editSet = $(editsubjectTpl(subject));
        modal = new U.ModalDialog({
            title: dTitle,
            backdrop : 'static',
            html: $editSet
        }).show();
        if($('.subject-tabs li.active a')[0].text=="收入科目"){
            $editSet.find('input[name="subjectRate"]').parentsUntil("form").addClass("hidden");
            $editSet.find('input[name="isMoneyWipeZero"]').parentsUntil("form").addClass("hidden");  
        }
        else{
            $editSet.find('input[name="subjectRate"]').parentsUntil("form").removeClass("hidden");
            $editSet.find('input[name="isMoneyWipeZero"]').parentsUntil("form").removeClass("hidden");
        }
        formValid($editSet);
        bv = $editSet.data('bootstrapValidator');
        submitSet(itemID);
    }
    function formValid($form){ 
        $form.bootstrapValidator({
            fields: {
                subjectName: {
                    validators: {
                        notEmpty: { message: '科目名不能为空' },
                        stringLength : {
                            min : 1,
                            max : 50,
                            message : "科目名称长度在1-50个字符之间"
                        }
                    }
                },
                subjectRate:{
                    validators: {
                        callback:{
                            message : '',
                            callback : function (value, validator, $field) {
                                value = value.trim();
                                if (value =='') {
                                    return true;
                                }
                                else{
                                    var rst = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/.test(value);
                                    if(!rst) return { valid: false, message: '请输入有效的数字' };
                                }
                                return true;
                            }
                        }
                    }
                }/*,输入长度的判断转化为maxlength属性
                payRemark: {
                    validators : {
                        stringLength : {
                            max : 250,
                            message : '科目说明不能超过250个字'}
                    }
                }   */
            }
        });
    }

    //添加和更新列表
    function submitSet(itemID){
        modal._.footer.find('.btn-ok').on('click', function (e){
            if(!bv.validate().isValid()) return;
            var data = parseForm($editSet);
            data.subjectGroupName = subject.subjectGroupName || 0;
            data.isPay = ($('.subject-tabs li.active a')[0].text=="收入科目")? 0:1;
            data.isMoneyWipeZero = data.isMoneyWipeZero||0;
            data.subjectRate = (data.subjectRate).trim() || 0;
            data.payRemark = C.encodeTextEnter(data.payRemark) || 0;
            var user = $XP(Hualala.getSessionData(),'user',''),
                loginName = $XP(user,'loginName',''),
                groupID = $XP(user,'groupID',''),
                groupLoginName = $XP(user,'groupLoginName','');
            var createBy=groupLoginName+'_'+loginName;
                _.extend(data,{createBy:createBy});
            data.subjectName = $.trim(data.subjectName);
            var nameCheckData = {subjectName:data.subjectName,groupID: groupID,itemID: itemID};
            function callbackFn(res){
                topTip({msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'});
                searchSubject();
                modal.hide();
            }
            if(isAdd){
                C.NestedAjaxCall("checkSubjectlName","addSaasSubject",nameCheckData,data,callbackFn);
            }else{
                data.itemID = setId;
                C.NestedAjaxCall("checkSubjectlName","updateSaasSubject",nameCheckData,data,callbackFn);  
            }
        });
    }
    //删除
    function deleteSubject(e){
        var id = $(e.target).data('setid');
        var subjectName=$(e.target).data('setname');
        setId = id;
        subject = getSetById(subjects, id) || {};
        var params ={itemID:id};
        Hualala.UI.Confirm({
            title: '刪除科目',
            msg: '您确定要删除收款科目:'+subjectName,
            okFn: function () {
                G.deleteSaasSubject(params, function (rsp) {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    topTip({msg:'删除成功',type: 'success'});
                    searchSubject();
                })
            }
        });
    }
}(jQuery , window ));