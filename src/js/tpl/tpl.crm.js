(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;

	// 会员概览布局
	var tpl_crm_schema_layout = [
        '<div class="well well-sm t-r">',
             '<button class="btn btn-warning" name="excelbutton">报表导出</button>',
        '</div>',
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
        '<h4 class="page-header">基本信息</h4>',
        '<div class="clearfix">',
            '<div class="col-md-6">',
                '<div class="form-group">',
                    '<label class="col-sm-3 control-label no-require">会员卡</label>',
                    '<div class="col-sm-8">',
                        '<div class="vip-card-wrap">',
                            '<div style="color: {{cardForegroundColor}}; background-color: {{cardBackgroundColor}}">',
                                '<span>{{groupName}}</span>',
                                '<img src="{{logoImage}}">',
                            '</div>',
                        '</div>',
                        '<div class="vip-card" style="color: {{cardForegroundColor}}; background-color: {{cardBackgroundColor}}">',
                            '<img src="{{logoImage}}">',
                            '<p><span>会员卡</span></p>',
                            '<div>8888 8888 8888 8888</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label no-require">会员卡logo</label>',
                    '<div class="col-sm-10">',
                        '<label class="btn btn-default btn-logo" disabled>上传</label>',
                        '<span class="text-warning"> 图片格式必须为：PNG24格式的背景透明图片，不小于400像素*400像素</span>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label no-require">会员卡背景图</label>',
                    '<div class="col-sm-9">',
                        '<label class="btn btn-default btn-bg" disabled>上传</label>',
                        '<label class="btn btn-default btn-bg-no m-l" disabled>置空</label>',
                        '<span class="text-warning"> 图片格式必须为：jpg、png，600像素*376像素</span>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label no-require card-text-label">会员卡文字颜色</label>',
                    '<div class="col-sm-8">',
                        '<p class="form-control-static">{{cardForegroundColor}}</p>',
                        '<div class="input-group card-color">',
                            '<input type="text" name="cardForegroundColor" class="form-control" value="{{cardForegroundColor}}" />',
                            '<span class="input-group-addon"><i></i></span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label no-require">会员卡背景色</label>',
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
                        '<p class="form-control-static">{{{vipServiceRemark}}}</p>',
                        '<textarea class="form-control" name="vipServiceRemark" rows="6" maxlength="5000">{{vipServiceRemark}}</textarea>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '<div class="clearfix">',
            '<h4 class="page-header">开卡赠送</h4>',
            '<div class="form-group">',
                '<label class="col-sm-2 control-label">启用状态</label>',
                '<div class="col-md-3">',
                    '<input type="checkbox" name="openCardGift" class="status" disabled data-status="{{cardGiftChecked}}">',
                '</div>',
            '</div>',
            '{{#if cardGiftChecked}}',
                '<div class="card-gift">',
                    '{{> giftTpl cardGift}}',
                '</div>',
            '{{else}}',
                '<div class="card-gift hidden">',
                    '{{> giftTpl cardGift}}',
                '</div>',
            '{{/if}}',
        '</div>',
        '<div class="clearfix">',
            '<h4 class="page-header">生日赠送</h4>',
            '<div class="form-group">',
                '<label class="col-sm-2 control-label">启用状态</label>',
                '<div class="col-md-3">',
                    '<input type="checkbox" name="birthdayGift" class="status" disabled data-status="{{birthdayGiftChecked}}">',
                '</div>',
            '</div>',
            '{{#if birthdayGiftChecked}}',
                '<div class="birthday-gift">',
                    '{{> giftTpl birthdayGift}}',
                '</div>',
            '{{else}}',
                '<div class="birthday-gift hidden">',
                    '{{> giftTpl birthdayGift}}',
                '</div>',
            '{{/if}}',
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
	'<table id="crmRechargeSetsTable" class="table table-bordered table-striped table-hover ix-data-report">',
		'<thead>',
			'<tr>',
				'<th>充值套餐名</th>',
				'<th>生效日期</th>',
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
				'<td>{{setDate}}</td>',
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
	'<form class="form-horizontal form-feedback-out base-set">',
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">充值日期</label>',
            '<div class="col-sm-7 fwc">',
                '<input class="form-control" type="text" name="startDate" date-type="datetimepicker" value="{{startDate}}">',
                ' <span class="gut">-</span> ',
                '<input class="form-control" type="text" name="endDate" date-type="datetimepicker" value="{{endDate}}">',
            '</div>',
        '</div>',
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
        '<div class="form-group">',
            '<label class="col-sm-offset-1 col-sm-3 control-label">网上开放</label>',
            '<div class="col-sm-5">',
                '<input type="checkbox" name="isOpen" data-status="{{isOpen}}" />',
            '</div>',
        '</div>',
	'</form>'].join('');
	TplLib.register('tpl_crm_recharge_set_add_update', tpl_crm_recharge_set_add_update);

    var tpl_crm_recharge_set_gift = [
        '<form class="form-horizontal gift-set">',
            '{{#each gifts}}',
                '<div class="form-group">',
                    '<label class="control-label col-sm-4 recharge-gift-switch">优惠券{{index}}启用状态</label>',
                    '<div class="col-md-3">',
                        '<input type="checkbox" name="gift" data-status="{{checked}}">',
                    '</div>',
                '</div>',
                '{{#if checked}}',
                    '<div class="gift-info">',
                        '{{> giftTpl}}',
                    '</div>',
                '{{else}}',
                    '<div class="gift-info hidden">',
                        '{{> giftTpl}}',
                    '</div>',
                '{{/if}}',
            '{{/each}}',
        '</form>'
    ].join('');
    TplLib.register('tpl_crm_recharge_set_gift', tpl_crm_recharge_set_gift);

    var tpl_crm_gift_ticket = [
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">优惠券{{index}}名称</label>',
            '<div class="col-md-5">',
                '<div class="input-group">',
                    '<input type="hidden" name="EGiftID_{{index}}" value="{{EGiftID}}">',
                    '<input type="text" disabled class="form-control" name="EGiftName_{{index}}" value="{{EGiftName}}">',
                    '<span class="input-group-btn">',
                        '<button class="btn btn-default" class="col-md-2">选择</button>',
                    '</span>',
                '</div>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">优惠券{{index}}张数</label>',
            '<div class="col-md-5">',
                '<div class="input-group">',
                    '<input type="text" name="EGiftCount_{{index}}" class="form-control" value="{{EGiftCount}}">',
                    '<span class="input-group-addon">张</span>',
                '</div>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">优惠券{{index}}有效天数</label>',
            '<div class="col-md-5">',
                '<div class="input-group">',
                    '<input type="text" name="EGfitValidUntilDayCount_{{index}}" class="form-control" value="{{EGfitValidUntilDayCount}}">',
                    '<span class="input-group-addon">天</span>',
                '</div>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">优惠券{{index}}生效时间</label>',
                '<div class="col-md-5" name="effect_hour">',
            '</div>',
        '</div>'
    ].join('');
    TplLib.register('tpl_crm_gift_ticket', tpl_crm_gift_ticket);

    var tpl_crm_gift_set = [
        '{{#each items}}',
            '<div class="form-group {{hiddenClass}}">',
                '<label class="col-sm-2 control-label">{{title}}</label>',
                '<div class="col-md-3">',
                    '<p class="form-control-static">{{value}}&nbsp;{{addonText}}</p>',
                    '<div class="input-group">',
                        '{{#if hiddenItems}}',
                            '{{#each hiddenItems}}',
                                '<input type="hidden" name="{{name}}" value="{{value}}">',
                            '{{/each}}',
                        '{{/if}}',
                        '<input type="text" class="form-control" {{disabled}} name="{{name}}" value="{{value}}">',
                        '{{#if btnText}}',
                            '<span class="input-group-btn">',
                                '<button class="btn btn-default" class="col-md-2">{{btnText}}</button>',
                            '</span>',
                        '{{else}}',
                            '<span class="input-group-addon">{{addonText}}</span>',
                        '{{/if}}',
                    '</div>',
                '</div>',
            '</div>',
        '{{/each}}',
        '{{#if openCardGiftEffectHours}}',
            '<div class="form-group">',
                '<label class="col-sm-2 control-label">获得后生效时间</label>',
                '<div class="col-md-3" name="effect_hour">',
                    '<p class="form-control-static">{{openCardGiftEffectHours}}&nbsp;小时</p>',
                    '{{> customSelect effectHoursOptions}}',
                '</div>',
            '</div>',
        '{{else}}',
            '<div class="form-group">',
                '<label class="col-sm-2 control-label">会员生日返券短信模板</label>',
                '<div class="col-md-3">',
                    '<p class="form-control-static">{{birthdayGiftSMS}}</p>',
                    '<textarea class="form-control" name="birthdayGiftSMS" rows="6" maxlength="500">{{birthdayGiftSMS}}</textarea>',
                '</div>',
            '</div>',
        '{{/if}}'
    ].join('');
    TplLib.register('tpl_crm_gift_set', tpl_crm_gift_set);

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
            '<button class="btn btn-warning" name="searchbutton">查询</button>',
             '<button class="btn btn-warning" name="excelbutton">导出</button>',
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
        '<li><a href="#accountChange" data-toggle="tab">手工调账</a></li>',
        '<li><a href="#sendGift" data-toggle="tab">赠送礼品</a></li>',
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
        '<div class="tab-pane fade" id="accountChange">',
            '<form class="form-horizontal feed-back-out">',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label"></label>',
                    '<div class="col-sm-3">',
                        '<span class="text-warning">请在输入框内输入调整的数值，正数为调增，负数为调减</span>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">现金卡值调整</label>',
                    '<div class="col-md-3">',
                        '<div class="input-group">',
                            '<input type="text" class="form-control" name="adjustMoneyBalance">',
                            '<span class="input-group-addon">元</span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">赠送卡值调整</label>',
                    '<div class="col-md-3">',
                        '<div class="input-group">',
                            '<input type="text" class="form-control" name="adjustGiveBalance">',
                            '<span class="input-group-addon">元</span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">积分调整</label>',
                    '<div class="col-sm-3">',
                        '<div class="input-group">',
                            '<input type="text" class="form-control" name="adjustPointBalance">',
                            '<span class="input-group-addon">分</span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">用户是否可见</label>',
                    '<div class="col-sm-3">',
                        '<input name="visible" type="checkbox">',
                    '</div>',
                '</div>',
                '<div class="form-group hidden">',
                    '<label class="col-sm-2 control-label">短信通知用户</label>',
                    '<div class="col-sm-3">',
                        '<textarea name="smsContent" class="form-control" maxlength="500"></textarea>',
                    '</div>',
                '</div>',
            '</form>',
            '<div class="col-md-5 step-action">',
                '<button class="btn btn-warning btn-save">保存</button>',
            '</div>',
        '</div>',
        '<div class="tab-pane fade" id="sendGift">',
            '<form class="form-horizontal feed-back-out">',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">礼品名称</label>',
                    '<div class="col-sm-3">',
                        '<div class="input-group">',
                            '<input type="hidden" class="form-control" name="giftItemID">',
                            '<input type="text" class="form-control" disabled name="giftName">',
                            '<span class="input-group-btn"><button class="btn btn-default">选择</button></span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">礼品数量</label>',
                    '<div class="col-md-3">',
                        '<div class="input-group">',
                            '<input class="form-control" name="giftNum">',
                            '<span class="input-group-addon">个</span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">礼品有效天数</label>',
                    '<div class="col-md-3">',
                        '<div class="input-group">',
                            '<input class="form-control" name="giftValidDays">',
                            '<span class="input-group-addon">天</span>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">礼品生效时间</label>',
                    '<div class="col-sm-3" name="time_effect">',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">是否发送短信</label>',
                    '<div class="col-sm-3">',
                        '<input name="isSend" type="checkbox">',
                    '</div>',
                '</div>',
                '<div class="form-group hidden">',
                    '<label class="col-sm-2 control-label">短信模板</label>',
                    '<div class="col-sm-3">',
                        '<textarea name="giftMsg" class="form-control" maxlength="500"></textarea>',
                    '</div>',
                '</div>',
            '</form>',
            '<div class="col-md-5 step-action">',
                '<button class="btn btn-warning btn-send">确认赠送</button>',
            '</div>',
        '</div>',
    '</div>'].join('');
    TplLib.register('tpl_crm_detail', tpl_crm_detail);

    var tpl_crm_basic_info = [
        '<form class="form-horizontal form-feedback-out crm-basic-modal">',
            '<div class="form-group">',
                '<label class="control-label col-sm-3">会员姓名</label>',
                '<div class="col-md-5">',
                    '<input type="text" name="customerName" class="form-control" value="{{customerName}}" />',
                '</div>',
            '</div>',
            '<div class="form-group">',
                '{{> tplRadio sexRadio}}',
            '</div>',
            '<div class="form-group">',
                '<label class="control-label col-sm-3">出生日期</label>',
                '<div class="col-md-8 clearfix">',
                    '{{> tplSelect years}}',
                    '{{> tplSelect months}}',
                    '{{> tplSelect days}}',
                '</div>',
            '</div>',
        '</form>'
    ].join('');
    TplLib.register('tpl_crm_basic_info', tpl_crm_basic_info);

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
    '<table class="table table-bordered table-striped table-hover crm-pref-table ix-data-report">',
        '<thead><tr></tr></thead>',
        '<tbody></tbody>',
    '</table>'].join('');
    TplLib.register('tpl_crm_pref', tpl_crm_pref);

    var tpl_crm_pref_tr = [
        '<tr data-itemid="{{itemID}}" class="{{clz}}">',
            '<td>{{shopName}}</td>',
            '<td data-type="shop">',
                '<div class="clearfix">{{defaultParams}}</div>',
                '<div class="clearfix">',
                    '<input data-status="{{isActive}}" type="checkbox">',
                    '<button class="btn btn-default m-l">修改</button>',
                '</div>',
            '</td>',
            //'<td data-type="pref">',
            //    '<div class="clearfix">{{memberParams}}</div>',
            //    '<div class="clearfix">',
            //        '<input data-status="{{memberDayIsActive}}" type="checkbox">',
            //        '<button class="btn btn-default m-l">修改</button>',
            //    '</div>',
            //'</td>',
        '</tr>'
    ].join('');
    TplLib.register('tpl_crm_pref_tr', tpl_crm_pref_tr);

    var tpl_crm_pref_update = [
	'<form class="form-horizontal form-feedback-out pref-form">',
        '{{#if isShopPref}}',
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">起止日期</label>',
			'<div class="col-sm-8 fwc">',
                '<input type="text" name="startDate" class="form-control" value="{{startDate}}" data-type=datetimepicker />',
                ' <span class="gut">-</span> ',
                '<input type="text" name="endDate" class="form-control" value="{{endDate}}"  data-type=datetimepicker />',
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
                    '<input type="radio" name="pointType" value="0" data-tip="会员消费积分=可积分金额*等级积分系数*促销积分系数)" /> 倍数',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="pointType" value="1" data-tip="会员消费积分=可积分消费金额*（等级积分系数+促销积分系数)" /> 叠加',
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
        '{{/if}}',
        '{{#if isCrmPref}}',
        '<input type="hidden" name="memberDayFuture" value="0">',
        '<div class="form-group">',
            '{{> cycleTplRadio cycleRadioData}}',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">日期选择</label>',
            '<div class="col-md-8">',
                '{{#each cycleSelectData}}',
                    '<div class="col-md-4 {{hidden}}" data-type={{cycleType}}>',
                        '<label>',
                        '{{> customSelect selectData}}',
                        '&nbsp;&nbsp;&nbsp;{{cycleLabel}}',
                        '</label>',
                    '</div>',
                '{{/each}}',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-3 control-label">折扣促销方式</label>',
            '<div class="col-sm-8">',
                '<label class="radio-inline">',
                    '<input type="radio" name="memberDayDiscountType" value="0" data-tip="会员消费折扣率=会员的等级折扣与店铺促销折扣值小的折扣率" /> 会员保底折扣率',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="memberDayDiscountType" value="1" data-tip="会员消费折扣率=会员等级折扣率*店铺促销折扣率" /> 折上折',
                '</label>',
                '<div></div>',
            '</div>',
        '</div>',

        '<div class="form-group">',
            '<label class="col-sm-3 control-label">* 促销折扣率</label>',
            '<div class="col-sm-8">',
                '<input type="text" name="memberDayDiscountRate" class="form-control" value="{{memberDayDiscountRate}}" />',
                '<div>如：0.9为九折、0.88为八八折</div>',
            '</div>',
        '</div>',

        '<div class="form-group">',
            '<label class="col-sm-3 control-label">积分促销方式</label>',
            '<div class="col-sm-8">',
                '<label class="radio-inline">',
                    '<input type="radio" name="memberDayPointType" value="0" data-tip="会员消费积分=可积分金额*等级积分系数*促销积分系数" /> 倍数',
                '</label>',
                '<label class="radio-inline">',
                    '<input type="radio" name="memberDayPointType" value="1" data-tip="会员消费积分=可积分消费金额*（等级积分系数+促销积分系数)" /> 叠加',
                '</label>',
                '<div></div>',
            '</div>',
        '</div>',

        '<div class="form-group">',
            '<label class="col-sm-3 control-label">* 促销积分系数</label>',
            '<div class="col-sm-8">',
                '<input type="text" name="memberDayPointRate" class="form-control" value="{{memberDayPointRate}}" />',
            '</div>',
        '</div>',
        '{{/if}}',
        
        //'<div class="form-group">',
		//	'<label class="col-sm-3 control-label">是否启用</label>',
		//	'<div class="col-sm-8">',
		//		'<select type="text" name="isActive" class="form-control" value="{{isActive}}">',
         //           '<option value="0">不启用</option>',
         //           '<option value="1">启用</option>',
         //       '</select>',
		//	'</div>',
		//'</div>',
		
	'</form>'].join('');
	TplLib.register('tpl_crm_pref_update', tpl_crm_pref_update);
    
    var tpl_crm_query_panel = [
    '<div class="well well-sm query-panel clearfix">',
        '<form class="d-i">',
            '<span class="date-lbl">',
                '日期',
                '<input type="text" name="queryStartTime" class="form-control" data-type="datetimepicker" value="{{Beforeyesterday}}" />',
                '<i class="gut">--</i>',
                '<input type="text" name="queryEndTime" class="form-control ml-0" data-type="datetimepicker" value="{{today}}" />',
            '</span> ',
            '<span class="city">城市 <select name="cityID" class="form-control"></select></span>',
            '<span class="shop">店铺 <select name="transShopID" class="form-control"></select></span>',
        '</form> ',
        '<button class="btn btn-warning" name="excelbutton">导出</button>',
        '<button class="btn btn-warning" name="searchbutton">查询</button>',
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











