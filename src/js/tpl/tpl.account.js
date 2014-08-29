(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
	var tpl_account_list_layout = [
		'<div class="account-list">',
			'<div class="row account-list-body">',
			'</div>',
			'<div class="account-list-footer">',
				'<div class="page-selection pull-right"></div>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_account_list_layout', tpl_account_list_layout);

	var tpl_account_card = [
		'<div class="panel panel-default ix-card bank-card" data-id="{{settleUnitID}}">',
			'<div class="panel-heading ix-card-header">',
				'<h4 class="panel-title">',
					'{{#if hasDefault}}',
					'<span class="label label-default">默认</span>',
					'{{/if}}',
					'<span class="account-name" title="{{settleUnitName}}">{{settleUnitName}}</span>',
				'</h4>',
				'<a href="javascript:void(0);" class="btn btn-success withdraw">提现</a>',
			'</div>',
			'<div class="panel-body ix-card-body">',
				'<div class="cash">',
					'<strong>{{settleBalance}}</strong>',
					'<span>元</span>',
				'</div>',
				'<div class="bank">',
					'<span class="{{bankIcon}}"></span>',
					'<span class="name">{{bankComName}}</span>',
					'<span class="num">{{{bankAccountStr}}}</span>',
				'</div>',
			'</div>',
			'<div class="panel-footer ix-card-footer">',
				'<span class="shops pull-left">',
					'{{shopCount}}家店',
				'</span>',
				'<a class="btn btn-link pull-right" data-href="{{path}}">详情&gt;</a>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_account_card', tpl_account_card);

	var tpl_account_list = [
		'{{#with accountCard}}',
			'{{#each list}}',
			'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">',
				'{{> accountCard}}',
			'</div>',
			'{{/each}}',
			'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">',
				'{{> addAccountCard}}',
			'</div>',
		'{{/with}}',
	].join('');
	TplLib.register('tpl_account_list', tpl_account_list);

	var tpl_withdraw_form = [
		'<div class="table-responsive">',
			'<table class="table table-striped table-bordered">',
				'<tbody>',
				'{{#each accountInfo}}',
					'<tr>',
						'<th>{{label}}</th>',
						'<td>{{{value}}}</td>',
					'</tr>',
				'{{/each}}',
				'</tbody>',
			'</table>',
		'</div>',
		'<form class="form-horizontal {{formClz}}" role="form">',
			'<div class="form-group">',
				'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
				'<div class="{{clz}}">',
					'<div class="input-group">',
						'<span class="input-group-addon">￥</span>',
						'<input type="text" id="{{id}}" name="{{name}}" class="form-control" value="{{value}}" />',
						'<span class="input-group-addon">元</span>',
					'</div>',
				'</div>',
			'</div>',
		'</form>'
	].join('');
	TplLib.register('tpl_withdraw_form', tpl_withdraw_form);

	var tpl_addAccount_Card = [
		'<div class="panel panel-default ix-card bank-card create-account">',
			'<div class="panel-heading ix-card-header hidden">',
				'<h4 class="panel-title"></h4>',
			'</div>',
			'<div class="panel-body ix-card-body">',
				'<div class="x-mul-vertical-middle">',
					'<div class="item  x-v-m-out">',
						'<div class="x-v-m-in">',
							'<div class="ix-cross">',
								'<div class="x-cross-inner"></div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="panel-footer ix-card-footer">',
				'<a class="btn btn-link pull-right" href="javascript:void(0);" data-href="{{path}}">添加账户</a>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_addAccount_Card', tpl_addAccount_Card);
})(jQuery, window);