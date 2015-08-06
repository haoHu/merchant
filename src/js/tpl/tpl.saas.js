(function($, window) {
    IX.ns('Hualala');
    var TplLib = Hualala.TplLib ;
    var tpl_category = [
        '<table class="table table-bordered table-striped table-hover {{tableClass}}">',
        '<thead>',
        '<tr>',
        '{{#each tableHeads}}',
        '<th class="t-c">{{this}}</th>',
        '{{/each}}',
        '</tr>',
        '</thead>',
        '<tbody>',
        '</tbody>',
        '</table>'].join('');

    TplLib.register('tpl_category', tpl_category);

    var tpl_category_modal = [
        '<form class="form-horizontal form-feedback-out">',
        '{{#if foodCategoryID}}',
            '<div class="form-group hidden">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">* 分类编号</label>',
                '<div class="col-sm-5">',
                    '<input type="text" name="foodCategoryID" class="form-control" value="{{foodCategoryID}}" disabled />',
                '</div>',
            '</div>',
        '{{/if}}',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">分类名称*</label>',
            '<div class="col-sm-5">',
                '<input type="text" name="foodCategoryName" class="form-control" value="{{foodCategoryName}}"/>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">出品部门*</label>',
            '<div class="col-sm-5 department-select">',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">收入科目*</label>',
            '<div class="col-sm-5 subject-select">',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label" for="description">分类说明&nbsp;</label>',
            '<div class="col-sm-5">',
                '<textarea class="form-control" name="description" maxlength="250">{{description}}</textarea>',
            '</div>',
        '</div>',
        '</form>'].join('');
    TplLib.register('tpl_category_modal', tpl_category_modal);

    var tpl_category_tr = [
        '{{#each categories}}',
        '<tr data-foodid="{{foodCategoryID}}">',
        //'<td>{{foodCategoryID}}</td>',
        '<td>{{foodCategoryName}}</td>',
        '<td>{{foodCount}}</td>',
        '<td class="col-md-3">{{{description}}}</td>',
        '<td>{{departmentName}}</td>',
        '<td>{{foodSubjectName}}</td>',
        '<td>',
            '<a href="javascript:{}" title="移到顶部" class="glyphicon glyphicon-arrow-up sort-top"></a>',
            '<a href="javascript:{}" title="上移" class="glyphicon glyphicon-arrow-up ml-6 sort-up"></a>',
            '<a href="javascript:{}" title="下移" class="glyphicon glyphicon-arrow-down ml-6 sort-down"></a>',
            '<a href="javascript:{}" title="移到底部" class="glyphicon glyphicon-arrow-down ml-6 sort-bottom"></a>',
        '</td>',
        '<td><input type="checkbox" class="status" data-status="{{this.isActive}}" data-text="分类" name="isActive"></td>',
        '<td>',
        '<a href="javascript:{}" class="update-category">修改</a>',
        '<a href="javascript:{}" class="ml-8 delete-category">删除</a>',
        '</td>',
        '</tr>',
        '{{/each}}'].join('');
    TplLib.register('tpl_category_tr', tpl_category_tr);

    var tpl_no_records = '<div id="noTip" class="alert alert-warning t-c m-t dn" style="display: block;">暂无{{title}}数据</div>';
    TplLib.register('tpl_no_records', tpl_no_records);

    var tpl_goods_tbody = [
        '{{#each goods}}',
        '<tr data-foodid="{{this.foodID}}">',
        '<td>{{#if imageHWP}}<img src="{{this.imageHWP}}">{{else}}<img src="./asset/img/dino80.png">{{/if}}</td>',
        '<td>',
        '{{#stars starLevel}}',
        '{{/stars}}',
        '</td>',
        '<td>{{this.foodCategoryName}}</td>',
        '<td>{{this.foodCode}}</td>',
        '<td>{{this.foodName}}</td>',
        '<td>{{this.foodEnName}}</td>',
        '<td>{{#if takeawayTag}}<i class="glyphicon glyphicon-ok"></i> {{else}}<i class="glyphicon glyphicon-remove"></i>{{/if}}</td>',
        '<td>{{#if isAutoAdd}}<i class="glyphicon glyphicon-ok"></i> {{else}}<i class="glyphicon glyphicon-remove"></i>{{/if}}</td>',
        '<td><input type="checkbox" name="isActive" class="status" data-status="{{this.isActive}}" data-text="商品"></td>',
        '<td><input type="checkbox" name="isOpen" class="status" data-status="{{this.isOpen}}" data-text="网上开放"></td>',
        '<td><input type="checkbox" name="isDiscount" class="status" data-status="{{this.isDiscount}}" data-text="打折"></td>',
        '<td>',
        '<a href="javascript:{}" class="update-food">修改</a>',
        '<a href="javascript:{}" class="ml-8 delete-food">删除</a>',
        '</td>',
        '</tr>',
        '{{/each}}'].join('');
    TplLib.register('tpl_goods_tbody', tpl_goods_tbody);

    var tpl_create_btn = '<div class="t-r m-b"><button class="btn btn-warning {{operatorClass}}">{{title}}</button></div>';
    TplLib.register('tpl_create_btn', tpl_create_btn);

    var tpl_a_btn = '<a class="btn btn-warning {{operatorClass}}" href="{{href}}">{{title}}</a>';
    TplLib.register('tpl_a_btn', tpl_a_btn);

    var tpl_search_goods = ['<div class="well well-sm query-form">',
        '<form class="form-horizontal">',
        '<div class="row">',
        '<div class="col-md-5">',
        '<div class="form-group">',
        '<label class="col-xs-2 col-sm-2 col-md-4 control-label">{{firstItem.value}}</label>',
        '<div class="col-md-8">',
        '<input type="text" name="{{firstItem.name}}" class="form-control" placeholder="" value="" data-type="text">',
        '</div>',
        '</div>',
        '</div>',
        '<div class="col-md-4">',
        '<div class="form-group">',
        '<label class="col-xs-2 col-sm-2 col-md-4 control-label">{{secondItem.value}}</label>',
        '<div class="col-xs-8 col-sm-8 col-md-8">',
        '{{#with select}}',
        '{{> customSelect}}',
        '{{/with }}',
        '</div>',
        '</div>',
        '</div>',
        '<div class="col-md-1">',
        '<button type="button" class="btn btn btn-warning" name="search">查询</button>',
        '</div>',
        '<div class="col-md-2"><button type="button" class="btn btn btn-warning" name="{{operatorItem.name}}">{{operatorItem.value}}</button></div>',
        '</div>',
        '</form>',
        '</div>'].join('');
    Hualala.TplLib.register('tpl_search_goods', tpl_search_goods);

    var tpl_select = ['<select class="form-control" name="{{name}}">',
        '{{#if defaultOption}}',
        '<option value="" {{defaultOption.selected}}>{{defaultOption.name}}</option>',
        '{{/if}}',
        '{{#each options}}',
        '<option value="{{value}}" {{selected}}>{{name}}</option>',
        '{{/each}}',
        '</select>'].join('');
    Hualala.TplLib.register('tpl_select', tpl_select);

    var tpl_edit_good = [
        '<ul class="nav nav-tabs" role="tablist">',
            '<li class="active"><a href="#goodBasicInfo" data-toggle="tab">基本信息</a></li>',
            '<li class="{{detailDisplay}}"><a href="#goodDetailInfo" data-toggle="tab">详细信息</a></li>',
            '<li class="{{detailDisplay}}"><a href="#goodTaste" data-toggle="tab">作法口味</a></li>',
            '<li class="{{setFoodDisplay}} setFood"><a href="#setFoodDetail" data-toggle="tab">套餐明细</a></li>',
            '<li class="{{detailDisplay}}"><a href="#goodDesc" data-toggle="tab">图文信息</a></li>',
        '</ul>',
        '<div class="tab-content">',
            '<div class="tab-pane active fade in" id="goodBasicInfo">',
                '<div class="clearfix">',
                    '<form class="form-horizontal form-food col-md-6">',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">商品分类*</label>',
                            '<div class="col-md-6" name="categoriesSelect">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">出品部门&nbsp;</label>',
                            '<div class="col-md-6" name="departmentsSelect">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">收入科目&nbsp;</label>',
                            '<div class="col-md-6" name="subjectsSelect">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">商品编号&nbsp;</label>',
                            '<div class="col-md-6">',
                            '<input type="text" name="foodCode" class="form-control" value="{{food.foodCode}}">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">商品名称*</label>',
                            '<div class="col-md-6">',
                            '<input type="text" name="foodName" class="form-control" value="{{food.foodName}}" data-type="text">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">启用状态&nbsp;</label>',
                            '<div class="col-md-6">',
                                '<input type="checkbox" name="isActive" class="status" data-status="{{food.isActive}}">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">网上开放&nbsp;</label>',
                            '<div class="col-md-6">',
                                '<input type="checkbox" name="isOpen" {{food.isOpenDisabled}} class="status" data-status="{{food.isOpen}}">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-2 control-label">参与打折&nbsp;</label>',
                            '<div class="col-md-6">',
                                '<input type="checkbox" name="isDiscount" class="status" data-status="{{food.isDiscount}}">',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-3 control-label">是否是套餐&nbsp;</label>',
                            '<div class="control-label col-sm-1 set-food">',
                                '{{#if food.foodID}}',
                                '<input type="checkbox" {{setFoodChecked}} disabled name="isSetFood" />',
                                '{{else}}',
                                '<input type="checkbox" {{setFoodChecked}} name="isSetFood" />',
                                '{{/if}}',
                            '</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label class="col-sm-3 control-label">是否是临时菜&nbsp;</label>',
                            '<div class="control-label col-sm-6 temp-food">',
                                '{{#if food.foodID}}',
                                    '<input type="checkbox" {{tempChecked}} disabled name="isTempFood" />',
                                '{{else}}',
                                    '<input type="checkbox" {{tempChecked}} name="isTempFood" />',
                                '{{/if}}',
                                '{{#if tempChecked}}',
                                    '<span class="text-warning">&nbsp;收银软件中可修改菜品名称和价格</span>',
                                    '{{else}}',
                                    '<span class="text-warning hidden">&nbsp;收银软件中可修改菜品名称和价格</span>',
                                '{{/if}}',
                            '</div>',
                        '</div>',
                    '</form>',
                    '<div class="food-pic col-md-4">',
                        '<div>',
                        '{{#if food.foodPic}}',
                        '<img src="{{food.foodPic}}" alt="商品图片" width="200px" />',
                        '{{else}}',
                        '<img src="./asset/img/food_bg.png" alt="商品图片" width="200px" />',
                        '{{/if}}',
                        '<span>上传中 . . .</span>',
                        '</div>',
                        '<label class="btn-link m-t">上传图片</label>',
                        '<div class="m-t warning text-warning">图片格式必须为：jpg、png，宽不小于600像素</div>',
                    '</div>',
                '</div>',
                '<div class="good-unit">',
                    '{{> goodUnit}}',
                '</div>',
            '</div>',
            '<div class="tab-pane fade" id="goodDetailInfo">',
                '<form class="form-horizontal form-food-detail">',
                    '<div class="form-group">',
                        '<label class="col-sm-2 control-label">支持业务</label>',
                        '<div class="col-md-3">',
                        '{{#with takeawayTypes}}',
                        '{{> customSelect}}',
                        '{{/with }}',
                        '</div>',
                    '</div>',
                    '<div class="form-group package {{packageHidden}}">',
                        '<label class="col-sm-2 control-label">打包费</label>',
                        '<div class="col-md-3">',
                            '<div class="input-group">',
                                '<span class="input-group-addon">￥</span>',
                                    '<input type="text" name="takeoutPackagingFee" class="form-control" value="{{food.takeoutPackagingFee}}">',
                                '<span class="input-group-addon">元</span>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-2 control-label">辣度标记</label>',
                        '<div class="col-md-3">',
                        '{{#with hotTags}}',
                        '{{> customSelect}}',
                        '{{/with }}',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-2 control-label">起售数量</label>',
                        '<div class="col-md-3">',
                        '<input type="text" name="minOrderCount" class="form-control" value="{{food.minOrderCount}}">',
                        '</div>',
                    '</div>',
                    '<div class="form-group setting-snewr">',
                        '<label class="col-sm-2 control-label">招新荐</label>',
                        '<div class="col-md-9">',
                            '{{#each foodAttrSNewR}}',
                                '<label class="control-label m-r"><input type="radio" {{checked}} name="foodIco" value="{{name}}"/>&nbsp;{{text}}</label>',
                            '{{/each}}',
                        '</div>',
                    '</div>',
                    '<div class="form-group setting-label">',
                        '<label class="col-sm-2 control-label">其它属性</label>',
                        '<div class="col-md-9">',
                            '{{#each foodSettings}}',
                                '<label class="control-label m-r {{hidden}}"><input type="checkbox" {{checked}} name="{{name}}" />&nbsp;{{text}}</label>',
                            '{{/each}}',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-2 control-label" for="clickAlertMess">顾客点菜提醒</label>',
                        '<div class="col-sm-8">',
                            '<textarea class="form-control" name="clickAlertMess" maxlength="500">{{food.clickAlertMess}}</textarea>',
                        '</div>',
                    '</div>',
                '</form>',
            '</div>',
            '<div class="tab-pane fade" id="goodTaste">',
                '<form class="form-horizontal form-taste">',
                    '<div class="form-group">',
                        '<label class="col-sm-1 control-label">口味</label>',
                        '<div class="col-md-9">',
                            '<input type="text" placeholder="多个口味用英文“,”隔开" name="tasteList" class="form-control" value="{{food.tasteList}}">',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-1 control-label">作法</label>',
                        '<div class="col-md-9">',
                            '<input type="text" placeholder="多种作法用英文“,”隔开" name="makingMethodList" class="form-control" value="{{food.makingMethodList}}">',
                        '</div>',
                    '</div>',
                '</form>',
            '</div>',
            '<div class="clearfix tab-pane fade" id="setFoodDetail">',
                '<div class="col-md-7 set-list">',
                    '<div class="clearfix">',
                        '<label>套餐名称：<span name="foodName">{{food.foodName}}</span></label>',
                        '<button class="btn btn-default pull-right" name="addCategory">添加套餐分类</button>',
                    '</div>',
                    '<div class="set-foods m-t table-responsive">',
                        '{{#if food.hasSetFoodList}}',
                            '<table class="table table-bordered table-hover {{category.tableClass}}">',
                                '<thead>',
                                    '<tr>',
                                        '{{#each category.tableHeads}}',
                                            '<th class="t-c">{{this}}</th>',
                                        '{{/each}}',
                                    '</tr>',
                                '</thead>',
                                '<tbody>',
                                    '{{#each food.setFoodDetail.foodLst}}',
                                        '{{#with this}}',
                                            '{{> category}}',
                                        '{{/with}}',
                                        '{{#each items}}',
                                            '{{#with this}}',
                                                '{{> food}}',
                                            '{{/with}}',
                                        '{{/each}}',
                                    '{{/each}}',
                                '</tbody>',
                            '</table>',
                        '{{/if}}',
                    '</div>',
                '</div>',
                '<div class="col-md-1 glyphicon glyphicon-arrow-left hidden"></div>',
                '<div class="col-md-4 good-list">',
                    '<div class="clearfix search-btn">',
                    '</div>',
                    '<div class="search-foods m-t">',
                        '<div class="foods m-t">',
                        '</div>',
                        '<div class="page-selection">',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="tab-pane fade" id="goodDesc">',
                '<script type="text/plain" id="goodDescEditor" style="height: 300px"></script>',
            '</div>',
        '</div>'
    ].join('');
    TplLib.register('tpl_edit_good', tpl_edit_good);

    var tpl_input_group = [
        '<div class="input-group">',
            '<div class="input-group-btn">',
                '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
                    '<span class="selected">全部</span>',
                    '&nbsp;<span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">',
                    '<li><a href="javascript:{}">全部</a></li>',
                    '{{#each options}}',
                        '<li><a href="javascript:{}" data-id="{{value}}">{{name}}</a></li>',
                    '{{/each}}',
                '</ul>',
            '</div>',
            '<input type="text" class="form-control" name="foodCategoryName" placeholder="分类/名称/拼音/简拼">',
            '<span class="input-group-btn">',
                '<button class="btn btn-default" name="search" type="button">查询</button>',
            '</span>',
        '</div>',
    ].join('');
    TplLib.register('tpl_input_group', tpl_input_group);

    var tpl_taste_list = [
            '{{#each list}}',
                '<label><input type="checkbox" data-itemid="{{itemID}}">{{notesName}}</label>',
            '{{/each}}',
    ].join('');
    TplLib.register('tpl_taste_list', tpl_taste_list);

    var tpl_good_unit = [
        '<table>',
            '<thead>',
                '<tr>',
                '{{#each goodUnits.tableHeads}}',
                    '<th>{{this}}</th>',
                '{{/each}}',
                '</tr>',
            '</thead>',
            '<tbody>',
            '{{#each food.units}}',
                '{{#with this}}',
                    '{{> goodUnitTr}}',
                '{{/with}}',
            '{{/each}}',
            '</tbody>',
        '</table>',
    ].join('');

    TplLib.register('tpl_good_unit', tpl_good_unit);

    var tpl_good_unit_tr = [
        '<tr data-itemid="{{itemID}}">',
        '<td><span>规格{{index}}',
        '</span>',
        '</td>',
        '<td><input type="text" name="unit" value="{{unit}}" {{disabled}}/></td>',
        '<td><input type="text" name="price" value="{{price}}"/></td>',
        '<td><input type="text" name="vipPrice" value="{{vipPrice}}"/></td>',
        '<td><input type="text" name="prePrice" value="{{prePrice}}"/></td>',
        '<td>',
        '{{#if lessThanFourUnits}}',
        '{{> addUnitBtn}}',
        '{{/if}}',
        '{{#if customLast}}',
        '{{> delUnitBtn}}',
        '{{/if}}',
        '</td>',
        '</tr>'
    ].join('');

    TplLib.register('tpl_good_unit_tr', tpl_good_unit_tr);

    var tpl_good_unit_add_btn = ['<a class="glyphicon glyphicon-plus-sign" href="javascript:{}"></a>'].join('');
    TplLib.register('tpl_good_unit_add_btn', tpl_good_unit_add_btn);

    var tpl_good_unit_del_btn = ['<a class="glyphicon glyphicon-minus-sign" href="javascript:{}"></a>'].join('');
    TplLib.register('tpl_good_unit_del_btn', tpl_good_unit_del_btn);

    var tpl_create_food_operation = [
        '{{#if isModalFooter}}',
        '<button class="btn btn-default btn-close" data-dismiss="modal">关闭</button>',
        '<button class="btn btn-default btn-ok">保存</button>',
        '{{else}}',
        '<button class="btn btn-default" name="save-food">保存</button>',
        '<button class="btn btn-default" name="save-create-food">保存并新加商品</button>',
        '<button class="btn btn-default" name="save-close">保存并关闭</button>',
        '{{/if}}'
    ].join('');
    TplLib.register('tpl_modal_footer', tpl_create_food_operation);


    var tpl_set_food_category = [
        '<tr class="category active {{selectedClass}}">',
            '<td colspan="5">',
                '<input type="text" name="categoryName" class="form-control" placeholder="输入分类名称" value="{{foodCategoryName}}">',
                '<span class="categoryNum m-l">{{foodItemsLength}}</span>',
                '<span> 选</span>',
                '<input type="text" disabled name="chooseCount" class="form-control m-l" value="{{chooseCount}}">',
                '<label class="control-label m-l">可修改&nbsp;<input type="checkbox" name="canSwitch" class="form-control m-l" {{switchChecked}}></label>',
            '</td>',
            '<td>',
                '<a href="javascript:{}" class="del-category">删除</a>',
            '</td>',
        '</tr>'
    ].join('');
    Hualala.TplLib.register('tpl_set_food_category', tpl_set_food_category);
    var tpl_set_food_tr= [
        '<tr class="food" data-unitkey="{{unitKey}}" data-foodkey="{{foodKey}}">',
            '<td class="foodName">{{foodName}}</td>',
            '<td class="unit">{{price}}/{{unit}}</td>',
            '<td><input type="text" name="number" class="form-control" value="{{number}}"></td>',
            '<td><input type="text" name="addPrice" class="form-control" value="{{addPrice}}"></td>',
            '<td><input name="selected" type="checkbox" {{checked}}></td>',
            '<td><a href="javascript:{}" class="del-food">删除</a></td>',
        '</tr>'
    ].join('');
    Hualala.TplLib.register('tpl_set_food_tr', tpl_set_food_tr);

    var tpl_saas_params_layout = [
        '<div class="clearfix shop-device-params">',
            '<div id="saas_params"></div>',
            '<h4 class="page-header"></h4>',
            '<div id="device_params"></div>',
            '</div>'
    ].join('');
    Hualala.TplLib.register('tpl_saas_params_layout', tpl_saas_params_layout);

    var tpl_saas_params = [
        '<form class="feed-back-out read-mode">',
            '<div class="clearfix">',
                '<h4 class="page-header">结账收银</h4>',
                '<div class="col-lg-6 form-horizontal">',
                    '<div class="form-group">',
                        '<label class="col-sm-3 control-label">账单抹零方式</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{moneyWipeZeroTypeVal}}</p>',
                            '{{> customSelect moneyWipeZeroTypeData}}',
                        '</div>',
                    '</div>',

                    '<div class="form-group">',
                        '<label class="col-sm-3 control-label">结账清单打印份数</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{checkoutBillPrintCopiesVal}}</p>',
                            '{{> customSelect checkoutBillPrintCopiesData}}',
                        '</div>',
                    '</div>',

                    '<div class="form-group">',
                        '<label class="col-sm-3 control-label">明细打印方式</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{checkoutBillDetailPrintWayVal}}</p>',
                            '{{> customSelect checkoutBillDetailPrintWayData}}',
                        '</div>',
                    '</div>',

                    '<div class="form-group">',
                        '<label class="col-sm-3 control-label">明细金额类型</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{checkoutBillDetailAmountTypeVal}}</p>',
                            '{{> customSelect checkoutBillDetailAmountTypeData}}',
                        '</div>',
                    '</div>',

                    '<div class="form-group">',
                        '<label class="col-sm-3 control-label">服务器连接的打印机</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{printerName}}</p>',
                            '<div name="printers"></div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="col-lg-6 form-horizontal">',
                    '<div class="form-group">',
                        '<label class="col-sm-4 control-label">结账单顶部补打内容</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{{CheckoutBillTopAddStr}}}</p>',
                            '<textarea name="CheckoutBillTopAddStr" class="form-control" maxlength="500">{{checkoutBillTopAddStrDecode}}</textarea>',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-4 control-label">结账单底部补打内容</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{{CheckoutBillBottomAddStr}}}</p>',
                            '<textarea name="CheckoutBillBottomAddStr" class="form-control" maxlength="500">{{checkoutBillBottomAddStrDecode}}</textarea>',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-4 control-label">是否打印会员交易顾客联凭证</label>',
                        '<div class="col-md-6">',
                            '<input type="checkbox" name="IsPrintCustomerTransCer" class="status" data-label="printer" data-status="{{IsPrintCustomerTransCer}}" disabled />',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="clearfix form-horizontal">',
                '<h4 class="page-header">厨房打印及出品</h4>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">是否启用厨房打印</label>',
                    '<div class="col-md-6">',
                        '<input type="checkbox" name="KitchenPrintActive" class="status" data-label="printer" data-status="{{KitchenPrintActive}}" disabled />',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">是否启用出品管理</label>',
                    '<div class="col-md-6">',
                        '<input type="checkbox" name="IsFoodMakeStatusActive" class="status" data-status="{{IsFoodMakeStatusActive}}" disabled />',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">厨房打印凭证类型</label>',
                    '<div class="col-md-6">',
                        '<p class="form-control-static">{{KitchenPrintBillTypeLstVal}}</p>',
                        '<div name="kitchenPrintBillTypeLst">',
                            '{{#each kitchenPrintBillTypeList}}',
                            '<label class="m-r">',
                                '<input type="checkbox" name="{{name}}" {{checked}} />&nbsp;{{label}}',
                            '</label>',
                            '{{/each}}',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="clearfix">',
                '<h4 class="page-header">接单</h4>',
                '<div class="col-lg-6 form-horizontal">',
                    '<div class="form-group">',
                        '<label class="col-sm-6 control-label">收到网上订单后是否自动打印</label>',
                        '<div class="col-md-6">',
                            '<input type="checkbox" name="IsRevNetOrderAfterPrn" class="status" data-label="printer" data-status="{{IsRevNetOrderAfterPrn}}" disabled />',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-6 control-label">是否打印自助点菜后结账模式下的加菜菜单</label>',
                        '<div class="col-md-4">',
                            '<input type="checkbox" name="IsPrintLocalOrder" class="status" data-label="printer" data-status="{{IsPrintLocalOrder}}" disabled />',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="col-lg-6 form-horizontal">',
                    '<div class="form-group">',
                        '<label class="col-sm-4 control-label">收到网上订单后语音提醒方式</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{revOrderAfterPlayVoiceTypeVal}}</p>',
                            '{{> customSelect revOrderAfterPlayVoiceTypeData}}',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-4 control-label">语音播报速度</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{TTSVoiceSpeedVal}}</p>',
                            '{{> customSelect TTSVoiceSpeedData}}',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-sm-4 control-label">引擎名称</label>',
                        '<div class="col-md-6">',
                            '<p class="form-control-static">{{TTSVoiceName}}</p>',
                            '{{> customSelect TTSVoiceNameList}}',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="clearfix form-horizontal">',
                '<h4 class="page-header">其它</h4>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">是否启用调试模式</label>',
                    '<div class="col-md-6">',
                        '<input type="checkbox" name="DebugModel" class="status" data-status="{{DebugModel}}" disabled/>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="step-action">',
                '<button id="editBtn" class="btn btn-warning">修改</button>',
                '<button id="saveBtn" class="btn btn-warning hidden">保存</button>',
            '</div>',
        '</form>'
    ].join('');
    Hualala.TplLib.register('tpl_saas_params', tpl_saas_params);

    var tpl_saas_device_form = [
        '<form class="form-horizontal feed-back-out">',
            '<div class="form-group">',
                '<label class="control-label col-sm-3">设备编号*</label>',
                '<div class="col-md-4">',
                    '<input type="text" name="deviceCode" class="form-control" value="{{deviceCode}}">',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="control-label col-sm-3">账单打印机</label>',
                '<div name="printers" class="col-md-4">',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="control-label col-sm-3">店铺运营模式</label>',
                '<div class="col-md-4">',
                    '{{> customSelect siteBizModelData}}',
                '</div>',
            '</div>',
            //'<div class="form-group">',
            //    '<label class="control-label col-sm-3">电话接口启用状态</label>',
            //    '<div class="col-md-4">',
            //        '<input type="checkbox" name="telInterfaceActive" class="status" data-status="{{telInterfaceActive}}">',
            //    '</div>',
            //'</div>',
            '<div class="form-group">',
                '<label class="control-label col-sm-3">站点说明</label>',
                '<div class="col-md-6">',
                    '<textarea name="deviceRemark" class="form-control" maxlength="500">{{deviceRemark}}</textarea>',
                '</div>',
            '</div>',
            //'<div class="form-group">',
            //    '<label class="col-sm-3 control-label">站点区域限定</label>',
            //    '<div class="col-md-6" name="siteAreaLst">',
            //        '{{#each siteAreaLst}}',
            //        '<label class="control-label">',
            //            '<input name="{{name}}" type="checkbox" value="{{key}}" class="m-r" {{checked}}/>&nbsp;{{label}}',
            //        '</label>',
            //        '{{/each}}',
            //    '</div>',
            //'</div>',
            //'<div class="form-group">',
            //    '<label class="col-sm-3 control-label">站点菜品分类限定</label>',
            //    '<div class="col-md-6" name="siteFoodCategoryLst">',
            //        '{{#each siteFoodCategoryLst}}',
            //        '<label class="control-label">',
            //            '<input type="checkbox" name="{{name}}" value="{{key}}" class="m-r" />&nbsp;{{label}}',
            //        '</label>',
            //        '{{/each}}',
            //    '</div>',
            //'</div>',
        '</form>'
    ].join('');
    Hualala.TplLib.register('tpl_saas_device_form', tpl_saas_device_form);

    var tpl_checkbox_list = [
        '{{#each checkboxes}}',
            '<label class="control-label">',
                '<input type="checkbox" name="{{name}}" value="{{key}}" class="m-r" />&nbsp;{{label}}',
            '</label>',
        '{{/each}}',
    ].join('');
    Hualala.TplLib.register('tpl_checkbox_list', tpl_checkbox_list);

})(jQuery, window);