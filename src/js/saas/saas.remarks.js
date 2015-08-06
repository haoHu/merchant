$( function ($, window) {
    IX.ns('Hualala.Saas.remarks');
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip,
        parseForm = Hualala.Common.parseForm,
        nTypes = Hualala.TypeDef.SaasNotesType,
        addPriceTypes = Hualala.TypeDef.SaasaddPriceType;
    Hualala.Saas.remarks.initRemark = function($remark,shopID){
        var RemarkQueryForm,RemarklistTpl,editRemarkTpl,remarks = null,newRecord=null,
            modal = null, bv = null, isAdd = null,newRecord=null,
            $editSet = null,$form=null;
        var groupID =$XP(Hualala.getSessionSite(),'groupID','');
        //模版，数据，绑定事件  
        initTemplate();
        renderCards({groupID:groupID,shopID:shopID});
        bindEvent();
        function initTemplate() {
            RemarkQueryForm = Handlebars.compile(Hualala.TplLib.get('tpl_remark_query'));
            RemarklistTpl = Handlebars.compile(Hualala.TplLib.get('tpl_remark_card'));
            editRemarkTpl = Handlebars.compile(Hualala.TplLib.get('tpl_remark_modal'));
            $(RemarkQueryForm({nTypes:nTypes})).appendTo($remark);
            $remarklist=$remark.find('.remark-list');
        }
        function renderCards(params){
            G.querySaasRemark(params, function(rsp){
                if(rsp.resultcode != '000'){
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                else{
                    remarks = $.extend(true, {records:[]}, rsp.data).records || [];
                    newRecord= IX.clone(nTypes);
                    if(params.notesType){
                        var searchRecords = {},searchData={};
                            searchRecords = _.findWhere(nTypes, {value:params.notesType});
                            searchData[0]=IX.clone(searchRecords);
                            searchData[0].records=[];
                        for(var j=0;j<remarks.length;j++){
                            searchData[0].records.push(remarks[j]);
                            }
                        renderRemarkList($remarklist, searchData);
                    }
                    else{
                        for(var i=0;i<newRecord.length;i++){
                            newRecord[i].records=[];
                            for(var j=0;j<remarks.length;j++){
                                if(newRecord[i].value==remarks[j].notesType){
                                    newRecord[i].records.push(remarks[j]);
                                }
                            }
                        } 
                        renderRemarkList($remarklist, newRecord);
                    }  
                }     
            });
        }
        //数据渲染
        function renderRemarkList($remarklist, items){
            $(RemarklistTpl({items: items})).appendTo($remarklist.empty());
        }
        function bindEvent(){
            $remark.on('click', '.operate', function (e) {
                var act = $(this).attr('data-type');
                    itemID =$(this).attr('data-id')||undefined;
                    GroupName=$(this).attr('data-typevalue');
                var params ={itemID:itemID,shopID:shopID};
                switch(act) {
                        //添加修改
                        case "addRemark":
                        case "editRemark" :
                            renderDialog(itemID,shopID,GroupName);
                            break;
                        //删除
                        case "deleteRemark":
                            Hualala.UI.Confirm({
                                title: '刪除字典',
                                msg: '您确定要删除此字典信息',
                                okFn: function () {
                                    G.deleteSaasRemark(params, function (rsp) {
                                        if(rsp.resultcode != '000')
                                        {
                                            rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                                            return;
                                        }
                                        topTip({msg:'删除成功',type: 'success'});
                                        searchRemark();             
                                    })
                                }
                            });
                            break;
                    }
            });
            $remark.on('change','.query-form #notesTypeTag',searchRemark);
        }
        //搜索
        function searchRemark(){
            $form=$remark.find('.query-form');
            $select = $form.find('#notesTypeTag');
            var noteTypeVal = $.trim($select.val()),
                notesType={},
                params={groupID:groupID,shopID:shopID};
            if(noteTypeVal!=""){
                notesType={notesType:noteTypeVal};
                $.extend(params, notesType);
            }
            else{
                notesType={}
            }
            renderCards(params);
        } 
        //添加和修改模态框
        function renderDialog(itemID,shopID,GroupName){
            var remarkData = {};
                remarkData = _.findWhere(remarks, {itemID: itemID});
                nTypes=_.map(nTypes,function (nTypes){
                    return _.extend(nTypes,{selected:nTypes.value==GroupName ? 'selected' : ''});
                })
            if(remarkData){
                //select下拉框的内容填充，扩充数据
                addPriceTypes=_.map(addPriceTypes,function (addPriceTypes) {
                    return _.extend(addPriceTypes,{selected:addPriceTypes.value==remarkData.addPriceType ? 'selected' :''});
                });
            }
            else{
                addPriceTypes=_.map(addPriceTypes,function (addPriceTypes) {
                    return _.extend(addPriceTypes,{selected:''});
                });  
            }
            isAdd = itemID === undefined;
            var dTitle = (isAdd ? '添加' : '修改') + '字典';
            var modalVals = {remarkData: remarkData, nTypes: nTypes,addPriceTypes:addPriceTypes};
            $editSet = $(editRemarkTpl(modalVals));
            if(GroupName!=20){
                $editSet.find("select[name=addPriceType]").parent().parent().addClass('hidden');
                $editSet.find(":text[name=addPriceValue]").parent().parent().addClass('hidden');
            }
            var $addPriceValue = $editSet.find('input[name=addPriceValue]'),
                $inputGrp = $addPriceValue.parents('.form-group');
                $inputGrp[$editSet.find('select[name=addPriceType]').val() == 0 ? 'addClass' : 'removeClass']('hidden');
            modal = new U.ModalDialog({
                title: dTitle,
                backdrop : 'static',
                html: $editSet
            }).show();
            $editSet.bootstrapValidator({
                fields: {
                    notesType: {
                        validators: {
                            notEmpty: { message: '字典类型不能为空' }
                        }
                    },
                    notesName: {
                        validators: {
                            notEmpty: { message: '字典名不能为空' },
                            stringLength : {
                                min : 1,
                                max : 50,
                                message : "字典名称长度在1-50个字符之间"
                            },
                            ajaxValid :{
                                api: "checckRemarkNameIsExist",
                                name:'notesName',
                                data:{
                                    shopID : shopID,
                                    notesType: GroupName,
                                    itemID: itemID ? itemID : ''
                                }
                            }
                        }
                    },
                    addPriceType:{
                        validators: {
                            notEmpty: { message: '加价方式不能为空' }
                        }
                    },
                    addPriceValue: {
                        validators :{
                            numeric : {message : "加价金额必须为数字"},
                            greaterThan : {
                                inclusive : true,
                                value : 0,
                                message : "加价金额必须大于或等于0"
                            }
                        }
                    }
                }
            });
            bv = $editSet.data('bootstrapValidator');
            bindModalevent(itemID,shopID)
            //modal._.footer.find('.btn-ok').on('click', submitSet);
        }
        //添加和更新列表
        function bindModalevent(itemID,shopID){
            modal._.dialog.find('form').on('change', 'select[name=addPriceType]', function (e) {
                var $select = $(this),
                    val = $select.val(),
                    $addPriceValue = $('input[name=addPriceValue]'),
                    $inputGrp = $addPriceValue.parents('.form-group');
                    $inputGrp[val == 0 ? 'addClass' : 'removeClass']('hidden');
            });
            modal._.footer.find('.btn-ok').on('click',function (e){
            if(!bv.validate().isValid()) return;
            var data = parseForm($editSet);
            $.extend(data,{ shopID:shopID,groupID:groupID,itemID:itemID});
            //parseForm对于无效的表单元素是不能序列化的。
            data.notesType =$editSet.find('[name=notesType] option:selected').val()||0;
            data.addPriceType= data.addPriceType || 0;
            data.addPriceValue= data.addPriceValue || 0;
            G[isAdd ? 'addSaasRemark' : 'editSaasRemark'](data, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'});
                searchRemark();
                modal.hide();
            }); 
            })
        }
    }
}(jQuery , window ));