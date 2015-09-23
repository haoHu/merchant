(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
    
    var tpl_channnel_sets = [
    '<div class="well well-sm t-r">',
        '<button class="btn btn-warning">增加渠道</button>',
    '</div>',
    '<table id="channnelSetsTable" class="table table-bordered table-striped table-hover">',
        '<thead>',
            '<tr>',
                '<th class="t-c hidden">渠道ID</th>',
                '<th class="t-c">渠道名称</th>',
                '<th class="t-c">内置渠道</th>',
                '<th class="t-c">渠道描述</th>',
                '<th class="t-c">创建人</th>',
                '<th class="t-c">启用状态</th>',
                '<th class="t-c">操作</th>',
            '</tr>',
        '</thead>',
        '<tbody>',
        '{{#each channels}}',
            '<tr>',
                '<th class="t-c hidden">{{this.itemID}}</th>',
                '<td class="t-c">{{this.channelName}}</td>',
                '<td class="t-c col-md-1">{{this.nameisGlobal}}</td>',
                '<td>{{this.shortRemarks}}</td>',
                '<td class="t-c col-md-1">{{this.ncreateBy}}</td>',
                '<td class="t-c col-md-2"><input type="checkbox" data-setid="{{itemID}}" {{checked}} /></td>',
                '<td class="t-c col-md-1">{{#if this.channelGlobal}}<a href="javascript:{}" class="channel-update" data-setid="{{itemID}}">修改</a><a href="javascript:{}" class="ml-8 channel-delete" data-setid="{{itemID}}">删除</a>{{/if}}</td>',
            '</tr>',
        '{{/each}}',
        '</tbody>',
    '</table>'].join('');
    TplLib.register('tpl_channnel_sets', tpl_channnel_sets);
    
    var tpl_channel_add_update = [
    '<form class="form-horizontal form-feedback-out">',
        '<div class="form-group hidden">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">* 渠道ID</label>',
            '<div class="col-sm-5">',
                '<input type="text" name="itemID" class="form-control" value="{{itemID}}" disabled />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">* 渠道名称</label>',
            '<div class="col-sm-5">',
                '<input type="text" name="channelName" class="form-control channelName" value="{{channelName}}" />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">渠道说明</label>',
            '<div class="col-sm-5">',
                    '<textarea id="{{id}}" name="channelRemark" class="form-control" placeholder="{{placeholder}}" value="{{channelRemark}}">{{channelRemark}}</textarea>',
            '</div>',
        '</div>',
  
    '</form>'].join('');
    TplLib.register('tpl_channel_add_update', tpl_channel_add_update);

    var tpl_department_sets = [
    '<div class="well well-sm t-r">',
        '<button class="btn btn-warning">增加部门</button>',
    '</div>',
    '<table id="departmentSetsTable" class="table table-bordered table-striped table-hover">',
        '<thead>',
            '<tr>',
                '<th class="t-c">部门名称</th>',
                '<th class="t-c">部门类型</th>',
                '<th class="t-c">描述</th>',
                '<th class="t-c">操作</th>',
            '</tr>',
        '</thead>',
        '<tbody>',
        '{{#each departments}}',
            '<tr>',
                '<td class="t-c">{{this.departmentName}}</td>',
                '<td class="t-c">{{this.departmentTypeText}}</td>',
                '<td>{{this.shortRemarks}}</td>',
                '<td class="t-c col-md-2"><a href="javascript:{}" class="department-update" data-setid="{{itemID}}">修改</a><a href="javascript:{}"  class="ml-8 department-delete" data-setid="{{itemID}}">删除</a></td>',
            '</tr>',
        '{{/each}}',
        '</tbody>',
    '</table>'].join('');
    TplLib.register('tpl_department_sets', tpl_department_sets);

    var tpl_department_add_update = [
    '<form class="form-horizontal form-feedback-out">',
        '<div class="form-group hidden">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">* 部门ID</label>',
            '<div class="col-sm-5">',
                '<input type="text" name="itemID" class="form-control" value="{{department.itemID}}" disabled />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">* 部门名称</label>',
            '<div class="col-sm-5">',
                '<input type="text" name="departmentName" class="form-control" value="{{department.departmentName}}" />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">* 部门类型</label>',
            '<div class="col-sm-5">',
                '<select name="departmentType" class="form-control">',
                    '<option value="">--请选择--</option>',
                    '{{#each dTypes}}',
                    '<option value="{{this.value}}" {{this.selected}}>{{this.label}}</option>',
                    '{{/each}}',
                '</select>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">部门描述</label>',
            '<div class="col-sm-5">',
                    '<textarea id="{{id}}" name="departmentRemark" class="form-control" placeholder="{{placeholder}}" value="{{department.departmentRemark}}">{{department.departmentRemark}}</textarea>',
            '</div>',
        '</div>',
    '</form>'].join('');
    TplLib.register('tpl_department_add_update', tpl_department_add_update);

     var tpl_subject_tab =[
        '<section class="detail-tabs subject-content">',
            '<div class="navbar navbar-default">',
                '<ul class="nav navbar-nav subject-tabs">',
                '</ul>',
            '</div>',
            '<div class="tab-content">',
            '</div>',
        '</section>',
    ].join('');
    TplLib.register('tpl_subject_tab', tpl_subject_tab);

    var tpl_subject_query =[
        '<div class="well well-sm query-form">',
            '<form class="form-horizontal">',
                '<div class="row">',
                    '<div class="col-md-5">',
                        '<div class="form-group">',
                            '<label class="col-xs-2 col-sm-2 col-md-4 control-label">{{firstItem.value}}</label>',
                            '<div class="col-md-8">',
                                '<input type="text" name="{{firstItem.name}}" class="form-control" placeholder="科目名称,分类名称" data-type="text">',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="col-md-offset-1 col-md-2 pull-right">',
                        '<button type="button" class="btn btn btn-block btn-warning subject-search" name="search">查询</button>',
                    '</div>',
                '</div>',
            '</form>',
        '</div>',
    ].join('');
    TplLib.register('tpl_subject_query',tpl_subject_query);
    var tpl_subject_tbody = [
    '{{#each items}}',
    '<tr class="group">',
        '<td class="tdSum" colspan="6">{{@key}}</td>',
        '<td class="t-c"><a class="subject-add"  data-setGroupName="{{@key}}"href="javascript:;">新增科目</a></td>',
    '</tr>',
    '{{#each this}}',
    '<tr>',
        '<td class="t-c">{{this.subjectName}}</td>',
        '<td class="t-c">{{this.nameisGlobal}}</td>',
        '<td class="t-c subjectRate">{{this.subjectRate}}</td>',
        //'<td class="t-c">{{this.nameisPay}}</td>',
        '<td class="t-c">{{this.payRemark}}</td>',
        '<td class="t-c col-md-1">{{this.ncreateBy}}</td>',
        '<td class="t-c col-md-2"><input type="checkbox" data-setid="{{itemID}}"  {{checked}} /></td>',
        '<td class="t-c col-md-1">{{#if operateBtn}}<a data-setid="{{itemID}}" data-setGroupName="{{subjectGroupName}}" class="subject-update" href="javascript:;">修改</a><a data-setid="{{itemID}}" data-setName="{{subjectName}}"class="ml-8 subject-delete"href="javascript:;">删除</a>{{/if}}</td>',
       
    '</tr>',
    '{{/each}}',
    '{{/each}}'
    ].join('');
    TplLib.register('tpl_subject_tbody',tpl_subject_tbody);
    var tpl_subject_modal =[
       '<form class="form-horizontal form-feedback-out">',
        //'{{#if subjectGroupName}}',
        '   <div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">* 分类</label>',
                '<div class="col-sm-5">',
                    '<input type="text" name="subjectGroupName"  class="form-control" value="{{subjectGroupName}}" disabled />',
                '</div>',
            '</div>',
        //'{{/if}}',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">* 科目名称</label>',
            '<div class="col-sm-5">',
                '<input type="text" name="subjectName" class="form-control subjectName" value="{{subjectName}}" />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">手续费率</label>',
            '<div class="col-sm-5">',
                '<div class="input-group">',
                    '<input type="text" name="subjectRate" class="form-control subjectRate" value="{{subjectRate}}" />',
                    '<span class="input-group-addon">%</span>',
                '</div>',
                '<span class="help-block">提醒：手续费为0-100内的数字且小数点后最多为两位</span>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label"></label>',
            '<div class="col-sm-5">',
                //'<label class="checkbox-inline  checkbox-inline"><input type="checkbox" name="isPay" value="1" {{display}}>可用于结账</label>',
                '<label class="checkbox-inline  checkbox-inline"><input type="checkbox" name="isMoneyWipeZero" value="1" {{selected}}>执行抹零规则</label>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">科目描述</label>',
            '<div class="col-sm-5">',
                    '<textarea id="{{id}}" name="payRemark" class="form-control" placeholder="{{placeholder}}" maxlength="250" value="{{payRemark}}">{{payRemark}}</textarea>',
            '</div>',
        '</div>',
  
    '</form>'].join('');
    TplLib.register('tpl_subject_modal',tpl_subject_modal);

    var tpl_remark_query=[
        '<div class="well well-sm query-form">',
            '<form class="form-horizontal">',
                '<div class="row">',
                    '<div class="form-group col-md-8">',
                        '<label class="col-xs-2 col-sm-2 col-md-2 control-label">字典类型</label>',
                        '<div class="col-md-4">',
                            '<select name="notesTypeSearch" id="notesTypeTag"  class="form-control">',
                                '<option value="">全部</option>',
                                '{{#each nTypes}}',
                                '<option value="{{this.value}}" {{selected}}>{{this.label}}</option>',
                                '{{/each}}',
                            '</select>',
                        '</div>',                
                    '</div>',
                '</div>',
            '</form>',
        '</div>',
        '<div class="remark-list">',
        '</div>',
        ].join('');
    TplLib.register('tpl_remark_query',tpl_remark_query);
    var tpl_remark_card =[
        '<ul class="remark-card">',
            '{{#each items}}',
            '<li class="note-item-list">',
                '<div class="type-item">',
                    '<p class="item-card">{{this.label}}</p>',
                '</div>',
                '<div class="type-item-list clearfix">',
                    '{{#each records}}',
                    '<div class="item">',
                        '<span>{{this.notesName}}</span>',
                        '<a data-id="{{itemID}}" data-type="editRemark" data-typevalue="{{notesType}}"  href="javascript:;"><i data-id="{{itemID}}" data-type="editRemark" data-typevalue="{{notesType}}"class="glyphicon glyphicon-pencil operate" title="编辑"></i></a>',
                        '<a data-id="{{itemID}}" data-type="deleteRemark"  href="javascript:;"><i data-id="{{itemID}}" data-type="deleteRemark" class="glyphicon glyphicon-remove operate" title="删除"></i></a>',
                    '</div>',
                    '{{/each}}',,
                    '<div class="item item-add">',
                        '<a  data-typevalue="{{this.value}}" data-type="addRemark" href="javascript:;"><i data-type="addRemark" data-typevalue="{{this.value}}" class="glyphicon  glyphicon-plus operate" title="新增"></i></a>',
                    '</div>',
                '</div>',
            '</li>',
            '{{/each}}',
        '</ul>'

    ].join('');
    TplLib.register('tpl_remark_card',tpl_remark_card);
 
    var tpl_remark_modal=[
        '<form class="form-horizontal form-feedback-out">',
            '<div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">* 字典类型</label>',
                '<div class="col-sm-5">',
                    '<select name="notesType" readonly  disabled class="form-control">',
                        '{{#each nTypes}}',
                        '<option value="{{this.value}}"  {{this.selected}}>{{this.label}}</option>',
                        '{{/each}}',
                    '</select>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">* 字典名称</label>',
                '<div class="col-sm-5">',
                    '<input type="text" name="notesName" class="form-control" value="{{remarkData.notesName}}" />',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">* 加价方式</label>',
                '<div class="col-sm-5">',
                    '<select name="addPriceType"  class="form-control">',
                        '{{#each addPriceTypes}}',
                        '<option value="{{this.value}}" {{this.selected}}>{{this.label}}</option>',
                        '{{/each}}',
                    '</select>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">加价金额</label>',
                '<div class="col-sm-5">',
                    '<input type="text" name="addPriceValue" class="form-control" value="{{remarkData.addPriceValue}}" />',
                '</div>',
            '</div>',
        '</form>'

    ].join('');
    TplLib.register('tpl_remark_modal',tpl_remark_modal);
    
})(jQuery, window);