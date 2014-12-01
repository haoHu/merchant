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
		'<div class="form-group">',
			'<label class="col-sm-6 control-label no-require">服务有效期</label>',
			'<div class="col-sm-4">',
				'<p class="form-control-static no-hidden">从 {{serviceStartTime}} 至 {{serviceEndTime}}</p>',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-6 control-label no-require">积分可抵扣消费</label>',
			'<div class="col-sm-4">',
				'<p class="form-control-static no-hidden"><span class="glyphicon glyphicon-{{isPointCanPay}}"></span></p>',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-6 control-label no-require">积分抵现系数</label>',
			'<div class="col-sm-4">',
				'<p class="form-control-static no-hidden">1积分可抵现{{pointExchangeRate}}(元)</p>',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-6 control-label no-require">积分清零日期</label>',
			'<div class="col-sm-4">',
				'<p class="form-control-static no-hidden">{{pointClearDate}}</p>',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-6 control-label" for="vipServiceTel">会员服务电话</label>',
			'<div class="col-sm-4">',
				'<p class="form-control-static">{{vipServiceTel}}</p>',
				'<input type="text" name="vipServiceTel" class="form-control" value="{{vipServiceTel}}" />',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-6 control-label no-require" for="vipServiceRemark">会员服务说明</label>',
			'<div class="col-sm-4">',
				'<p class="form-control-static">{{vipServiceRemark}}</p>',
				'<textarea class="form-control" name="vipServiceRemark" rows="4" maxlength="5000">{{vipServiceRemark}}</textarea>',
			'</div>',
		'</div>',
		'<div class="step-action">',
			'<button id="editBtn" class="btn btn-warning btn-edit">编辑</button>',
			'<button id="saveBtn" class="btn btn-warning btn-save">保存</button>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_crm_params', tpl_crm_params);

	var tpl_crm_recharge_sets = [
	'<div class="well well-sm t-r">',
		'<button class="btn btn-warning">添加</button>',
	'</div>',
	'<table id="crmRechargeSetsTable" class="table table-striped table-hover">',
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
			'<label class="col-sm-offset-1 col-sm-3 control-label">充值升级等级</label>',
			'<div class="col-sm-5">',
				'<select name="switchCardLevelID" class="form-control" value="{{switchCardLevelID}}">',
					'<option value="0">不变</option>',
				'</select>',
			'</div>',
		'</div>',
		'<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">返积分数</label>',
			'<div class="col-sm-5">',
				'<input type="text" name="returnPoint" class="form-control" value="{{returnPoint}}" />',
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
	
})(jQuery, window);











