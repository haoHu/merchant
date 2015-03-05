(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;

	// 会员概览布局
	var tpl_crm_schema_layout = [
		'<div class="crm-schema-table">',
		'</div>',
		'<div class="crm-schema-chart row">',
			'{{#each charts}}',
				'<div class="{{clz}}">',
					'<div class="{{chartClz}}" id="{{id}}" title="{{label}}">',
					'</div>',
				'</div>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_crm_schema_layout', tpl_crm_schema_layout);

	// 会员等级描述模板
	var tpl_crm_card_level_info = [
		'{{{cardLevelName}}}等级特权：',
		'{{#if isVipPrice}}',
			'享受会员价，',
		'{{else}}',
			'不享受会员价，',
		'{{/if}}',
		'{{{discountRate}}}，',
		'{{{discountRange}}}',
		'{{{discountDescription}}}',
		'累积消费{{{switchLevelUpPoint}}}元可升至该级。'
	].join('');
	TplLib.register('tpl_crm_card_level_info', tpl_crm_card_level_info);
	
	var tpl_crm_params = [
	'<form class="crm-params form-horizontal feed-back-out read-mode">',
        '<div class="col-md-6">',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">会员卡</label>',
                '<div class="col-sm-8">',
                    '<div class="vip-card" style="color: {{cardForegroundColor}}; background-color: {{cardBackgroundColor}}">',
                        '<img src="{{logoImage}}">',
                        '<p><span>会员卡</span></p>',
                        '<div>8888 8888 8888 8888</div>',
                    '</div>',
                    '<p class="vip-card-tip">logo尺寸：640x400以内(图案区域没有留白)，中间为集团logo，四周透明，Png24格式</p>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">会员卡logo</label>',
                '<div class="col-sm-8">',
                    '<label class="btn btn-default btn-logo" disabled>上传</label>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">会员卡背景图</label>',
                '<div class="col-sm-8">',
                    '<label class="btn btn-default btn-bg" disabled>上传</label>',
                    '<label class="btn btn-default btn-bg-no m-l" disabled>置空</label>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">会员卡前景色</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static">{{cardForegroundColor}}</p>',
                    '<div class="input-group card-color">',
                        '<input type="text" name="cardForegroundColor" class="form-control" value="{{cardForegroundColor}}" />',
                        '<span class="input-group-addon"><i></i></span>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">会员卡背景色</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static">{{cardBackgroundColor}}</p>',
                    '<div class="input-group card-bg">',
                        '<input type="text" name="cardBackgroundColor" class="form-control" value="{{cardBackgroundColor}}" />',
                        '<span class="input-group-addon"><i></i></span>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '<div class="col-md-6">',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">服务有效期</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static no-hidden">从 {{serviceStartTime}} 至 {{serviceEndTime}}</p>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">积分可抵扣消费</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static no-hidden"><span class="glyphicon glyphicon-{{isPointCanPay}}"></span></p>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">在线充值财务费率</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static no-hidden">{{onlineSaveMoneyRate}}</p>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">积分抵现系数</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static no-hidden">1积分可抵现{{pointExchangeRate}}(元)</p>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require">积分清零日期</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static no-hidden">{{pointClearDate}}</p>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label">结算账号</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static"></p>',
                    '<select name="onlineSaveMoneySettleUnitID" class="form-control"></select>',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label" for="vipServiceTel">会员服务电话</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static">{{vipServiceTel}}</p>',
                    '<input type="text" name="vipServiceTel" class="form-control" value="{{vipServiceTel}}" />',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-3 control-label no-require" for="vipServiceRemark">会员服务说明</label>',
                '<div class="col-sm-8">',
                    '<p class="form-control-static">{{vipServiceRemark}}</p>',
                    '<textarea class="form-control" name="vipServiceRemark" rows="6" maxlength="5000">{{vipServiceRemark}}</textarea>',
                '</div>',
            '</div>',
        '</div>',
		'<div class="step-action col-md-12">',
			'<button id="editBtn" class="btn btn-warning btn-edit">编辑</button>',
			'<button id="saveBtn" class="btn btn-warning btn-save">保存</button>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_crm_params', tpl_crm_params);

	var tpl_crm_recharge_sets = [
	'<div class="well well-sm t-r">',
		'<button class="btn btn-warning">添加</button>',
	'</div>',
	'<table id="crmRechargeSetsTable" class="table table-bordered table-striped table-hover">',
		'<thead>',
			'<tr>',
				'<th>充值套餐名</th>',
				'<th>充值金额</th>',
				'<th>返金额数</th>',
				'<th>返积分数</th>',
				'<th>充值升级等级</th>',
				'<th>销售份数</th>',
				'<th>状态</th>',
				'<th>操作</th>',
			'</tr>',
		'</thead>',
		'<tbody>',
		'{{#each sets}}',
			'<tr>',
				'<td>{{setName}}</td>',
				'<td>{{setSaveMoney}}</td>',
				'<td>{{returnMoney}}</td>',
				'<td>{{returnPoint}}</td>',
				'<td>{{switchCardLevelName}}</td>',
				'<td>{{salesAmount}}</td>',
				'<td><input type="checkbox" data-setid="{{saveMoneySetID}}" {{checked}} /></td>',
				'<td><button class="btn btn-default" data-setid="{{saveMoneySetID}}">修改</button></td>',
			'</tr>',
		'{{/each}}',
		'</tbody>',
	'</table>'].join('');
	TplLib.register('tpl_crm_recharge_sets', tpl_crm_recharge_sets);
	
	var tpl_crm_recharge_set_add_update = [
	'<form class="form-horizontal form-feedback-out">',
		'<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">* 套餐名</label>',
			'<div class="col-sm-5">',
				'<input type="text" name="setName" class="form-control" value="{{setName}}" />',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">* 充值金额</label>',
			'<div class="col-sm-5">',
				'<div class="input-group">',
                    '<span class="input-group-addon">￥</span>',
                    '<input type="text" name="setSaveMoney" class="form-control" value="{{setSaveMoney}}" />',
                    '<span class="input-group-addon">元</span>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">返金额数</label>',
			'<div class="col-sm-5">',
				'<div class="input-group">',
                    '<span class="input-group-addon">￥</span>',
                    '<input type="text" name="returnMoney" class="form-control" value="{{returnMoney}}" />',
                    '<span class="input-group-addon">元</span>',
				'</div>',
			'</div>',
		'</div>',
        '<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">返积分数</label>',
			'<div class="col-sm-5">',
				'<input type="text" name="returnPoint" class="form-control" value="{{returnPoint}}" />',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">充值升级等级</label>',
			'<div class="col-sm-5">',
				'<select name="switchCardLevelID" class="form-control" value="{{switchCardLevelID}}">',
					'<option value="0">不变</option>',
				'</select>',
			'</div>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_crm_recharge_set_add_update', tpl_crm_recharge_set_add_update);
	
	var tpl_crm_recharge_set_vip_level = [
	'{{#each levels}}',
		'<option value="{{cardLevelID}}">{{cardLevelName}}</option>',
	'{{/each}}'
	].join('');
	TplLib.register('tpl_crm_recharge_set_vip_level', tpl_crm_recharge_set_vip_level);
    
    var tpl_crm_query = [
    '<div class="well well-sm crm-query-panel">',
        '<form>',
            '<div class="t-j">',
                '<span class="date-lbl">',
                    '入会日期',
                    '<input type="text" name="createTimeStart" class="form-control" data-type="datetimepicker" value="" />',
                    '<i>--</i>',
                    '<input type="text" name="createTimeEnd" class="form-control ml-0" data-type="datetimepicker" value="" />',
                '</span> ',
                '<span>',
                    '关键字',
                    '<input type="text" name="keyword" class="form-control" placeholder="姓名、卡号、手机号" />',
                '</span> ',
                '<span>',
                    '会员等级',
                    '<select name="cardLevelID" class="form-control">',
                        '<option value="0">不限</option>',
                    '</select>',
                '</span> ',
                '<span>',
                    '状态',
                    '<select name="cardStatus" class="form-control">',
                        '<option value="">不限</option>',
                    '{{#each cardStatus}}',
                        '<option value="{{@key}}">{{this}}</option>',
                    '{{/each}}',
                    '</select>',
                '</span>',
            '</div>',
            '<div class="more-crm-query t-j dn">',
                '<span>',
                    '储值累计',
                    '<input type="text" name="saveMoneyTotalLowerLimit" class="form-control" />',
                    '<i>--</i>',
                    '<input type="text" name="saveMoneyTotalUpperLimit" class="form-control ml-0" />',
                '</span> ',
                '<span>',
                    '消费累计',
                    '<input type="text" name="consumptionTotalLowerLimit" class="form-control" />',
                    '<i>--</i>',
                    '<input type="text" name="consumptionTotalyUpperLimit" class="form-control ml-0" />',
                '</span> ',
                '<span>',
                    '积分余额',
                    '<input type="text" name="pointBalanceLowerLimit" class="form-control" />',
                    '<i>--</i>',
                    '<input type="text" name="pointBalanceUpperLimit" class="form-control ml-0" />',
                '</span>',
            '</div>',
        '</form>',
        '<div class="t-r">',
            '<a href="javascript:;">更多查询条件</a>',
            '<button class="btn btn-warning">查询</button>',
        '</div>',
    '</div>',
    '<table class="table table-bordered table-striped table-hover crm-query-table">',
        '<thead>',
            '<tr>',
            '{{#each crmQueryTableHeads}}',
                '<th>{{this}}</th>',
            '{{/each}}',
            '</tr>',
        '</thead>',
        '<tbody></tbody>',
    '</table>'].join('');
    TplLib.register('tpl_crm_query', tpl_crm_query);
    
    var tpl_crm_detail = [
    '<div class="basic-info"></div>',
    '<ul class="nav nav-tabs" role="tablist">',
        '<li class="active"><a href="#transDetail" data-toggle="tab">交易明细</a></li>',
        '<li><a href="#activities" data-toggle="tab">参与活动</a></li>',
        '<li><a href="#vouchers" data-toggle="tab">优惠券</a></li>',
        '<li><a href="#cardLog" data-toggle="tab">卡日志</a></li>',
    '</ul>',
    '<div class="tab-content">',
        '<div class="tab-pane active fade in" id="transDetail">',
            '<table class="table table-bordered table-striped table-hover">',
                '<thead><tr></tr></thead><tbody></tbody>',
            '</table>',
        '</div>',
        '<div class="tab-pane fade" id="activities">',
            '<table class="table table-bordered table-striped table-hover">',
                '<thead><tr></tr></thead><tbody></tbody>',
            '</table>',
        '</div>',
        '<div class="tab-pane fade" id="vouchers">',
            '<table class="table table-bordered table-striped table-hover">',
                '<thead><tr></tr></thead><tbody></tbody>',
            '</table>',
        '</div>',
        '<div class="tab-pane fade" id="cardLog">',
            '<table class="table table-bordered table-striped table-hover">',
                '<thead><tr></tr></thead><tbody></tbody>',
            '</table>',
        '</div>',
    '</div>'].join('');
    TplLib.register('tpl_crm_detail', tpl_crm_detail);
    
    var tpl_crm_pref = [
    '<div class="well well-sm query-panel">',
        '<form class="d-i">',
            '<span>',
                '城市 <select name="cityID" class="form-control"></select>',
            '</span>',
            '<span>',
                '店铺 <select name="shopID" class="form-control"></select>',
            '</span>',
        '</form>',
        '<button class="btn btn-warning">查询</button>',
    '</div>',
    '<table class="table table-bordered table-striped table-hover crm-pref-table">',
        '<thead><tr></tr></thead>',
        '<tbody></tbody>',
    '</table>'].join('');
    TplLib.register('tpl_crm_pref', tpl_crm_pref);
    
    var tpl_crm_pref_update = [
	'<form class="form-horizontal form-feedback-out pref-form">',
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">起止日期</label>',
			'<div class="col-sm-8 fwc">',
                '<input type="text" name="startDate" class="form-control" value="{{startDate}}" data-type=datetimepicker />',
                ' <span class="gut">-</span> ',
                '<input type="text" name="endDate" class="form-control" value="{{endDate}}"  data-type=datetimepicker/>',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">折扣促销方式</label>',
			'<div class="col-sm-8">',
				'<label class="radio-inline">',
                    '<input type="radio" name="discountType" value="0" data-tip="会员消费折扣率=会员的等级折扣与店铺促销折扣值小的折扣率" /> 会员保底折扣率',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="discountType" value="1" data-tip="会员消费折扣率=会员等级折扣率*店铺促销折扣率" /> 折上折',
                '</label>',
                '<div></div>',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">* 促销折扣率</label>',
			'<div class="col-sm-8">',
				'<input type="text" name="discountRate" class="form-control" value="{{discountRate}}" />',
                '<div>如：0.9为九折、0.88为八八折</div>',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">积分促销方式</label>',
			'<div class="col-sm-8">',
				'<label class="radio-inline">',
                    '<input type="radio" name="pointType" value="0" data-tip="会员消费积分=可积分金额*等级积分系数*店铺积分系数" /> 倍数',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="pointType" value="1" data-tip="会员消费积分=可积分消费金额*（等级积分系数+店铺积分系数" /> 叠加',
                '</label>',
                '<div></div>',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">* 促销积分系数</label>',
			'<div class="col-sm-8">',
				'<input type="text" name="pointRate" class="form-control" value="{{pointRate}}" />',
			'</div>',
		'</div>',
        
        '<div class="form-group">',
			'<label class="col-sm-3 control-label">是否启用</label>',
			'<div class="col-sm-8">',
				'<select type="text" name="isActive" class="form-control" value="{{isActive}}">',
                    '<option value="0">不启用</option>',
                    '<option value="1">启用</option>',
                '</select>',
			'</div>',
		'</div>',
		
	'</form>'].join('');
	TplLib.register('tpl_crm_pref_update', tpl_crm_pref_update);
    
    var tpl_crm_query_panel = [
    '<div class="well well-sm query-panel clearfix">',
        '<form class="d-i">',
            '<span class="date-lbl">',
                '日期',
                '<input type="text" name="queryStartTime" class="form-control" data-type="datetimepicker" value="{{today}}" />',
                '<i class="gut">--</i>',
                '<input type="text" name="queryEndTime" class="form-control ml-0" data-type="datetimepicker" value="{{today}}" />',
            '</span> ',
            '<span>城市 <select name="cityID" class="form-control"></select></span>',
            '<span>店铺 <select name="transShopID" class="form-control"></select></span>',
        '</form> ',
        '<button class="btn btn-warning">查询</button>',
    '</div>'].join('');
    TplLib.register('tpl_crm_query_panel', tpl_crm_query_panel);
    
    var tpl_report_table = [
    '<table class="table table-bordered table-striped table-hover crm-report-table">',
        '<thead></thead>',
        '<tbody></tbody>',
        '<tfoot></tfoot>',
    '</table>'].join('');
    TplLib.register('tpl_report_table', tpl_report_table);
	
})(jQuery, window);











