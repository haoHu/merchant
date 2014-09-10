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
		'<div class="panel panel-default ix-card bank-card {{clz}}" data-id="{{settleUnitID}}">',
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
				'{{# if isDetail }}',
					'<div class="btn-group pull-right visible-xs-inline-block">',
						'{{#each acts}}',
							'{{#if isFirst}}',
								'<button type="button" class="btn btn-info" data-act="{{act}}">{{label}}</button>',
								'<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">',
									'<span class="caret"></span>',
									'<span class="sr-only">Toggle Dropdown</span>',
								'</button>',
								'<ul class="dropdown-menu" role="menu">',
							'{{else}}',
								'<li><a href="javascript:void(0);" data-act="{{act}}">{{label}}</a></li>',
							'{{/if}}',
						'{{/each}}',
						'</ul>',
						
					'</div>',
				'{{else}}',
					'<a class="btn btn-link pull-right" data-href="{{path}}">详情&gt;</a>',
				'{{/if}}',
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

	var tpl_accountMgr_layout = [
		'<nav class="account-nav">',
		'</nav>',
		'<section class="account-schema-box">',
		'</section>',
		'<section class="account-detail-box">',
		'</section>'
	].join('');
	TplLib.register('tpl_accountMgr_layout', tpl_accountMgr_layout);

	var tpl_account_schema = [
		'<div class="account-schema clearfix">',
			'{{#with accountCard}}',
				'{{> accountCard}}',
			'{{/with}}',
			'<div class="account-btns hidden-xs">',
				'<ul class="nav nav-pills pull-right" role="tablist">',
					'{{#each acts}}',
						'<li role="presentation"><a href="javascript:void(0);" class="btn {{clz}}" data-act="{{act}}">{{label}}</a></li>',
					'{{/each}}',
				'</ul>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_account_schema', tpl_account_schema);

	var tpl_account_detail = [
		'<div class="account-detail">',
			'<h4>查看交易明细</h4>',
			'<div class="well well-sm query-form">',
				'{{#with query}}',
					'{{> transaQueryForm}}',
				'{{/with}}',
			'</div>',
			'<div class="query-result">',
				'{{#with result}}',
					'{{> transaQueryResult}}',
				'{{/with}}',
			'</div>',
			'<div class="page-selection pull-right"></div>',
		'</div>'
	].join('');
	TplLib.register('tpl_account_detail', tpl_account_detail);


	var tpl_transaQuery_form = [
		'<form class="form-horizontal" role="">',
			'<div class="row">',
				'{{#each cols}}',
					'<div class="{{colClz}}">',
						'{{#each items}}',
							'{{#checkFormElementType type type="combo"}}',
								'<div class="form-group">',
									'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
									'<div class="{{clz}}">',
										'<select id="{{id}}" name="{{name}}" class="form-control"  data-type="{{type}}">',
											'{{#each options}}',
												'<option value="{{value}}" {{selected}}>{{label}}</option>',
											'{{/each}}',
										'</select>',
									'</div>',
								'</div>',
							'{{/checkFormElementType}}',
							'{{#checkFormElementType type type="section"}}',
								'<div class="form-group section">',
									'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
									'{{#with min}}',
										'<div class="min-input {{clz}}">',
											'<div class="input-group">',
												'{{#if prefix}}',
													'<span class="input-group-addon">',
														'{{{prefix}}}',
													'</span>',
												'{{/if}}',
												'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
												'{{#if surfix}}',
													'<span class="input-group-addon">',
														'{{{surfix}}}',
													'</span>',
												'{{/if}}',
											'</div>',
										'</div>',
									'{{/with}}',
									'{{#with max}}',
										// '<div class="col-sm-1 hidden-xs hidden-sm"><span class="to-label">到</span></div>',
										'<div class="max-input {{clz}}">',
											'<span class="to-label">到</span>',
											'<div class="input-group">',
												'{{#if prefix}}',
													'<span class="input-group-addon">',
														'{{{prefix}}}',
													'</span>',
												'{{/if}}',
												'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
												'{{#if surfix}}',
													'<span class="input-group-addon">',
														'{{{surfix}}}',
													'</span>',
												'{{/if}}',
											'</div>',
										'</div>',
									'{{/with}}',
								'</div>',
							'{{/checkFormElementType}}',
							'{{#checkFormElementType type type="button"}}',
								'<button type="button" class="btn {{clz}}">{{{label}}}</button>',
							'{{/checkFormElementType}}',
						'{{/each}}',
					'</div>',
				'{{/each}}',
			'</div>',
		'</form>'
	].join('');
	TplLib.register('tpl_transaQuery_form', tpl_transaQuery_form);

	var tpl_transaQuery_result = [
		'<div class="table-responsive">',
			'<table class="table {{clz}}">',
				'<thead>',
					'<tr>',
						'{{#each thead}}',
							'<th class="{{clz}}">{{label}}</th>',
						'{{/each}}',
					'</tr>',
				'</thead>',
				'<tbody>',
					'{{#each rows}}',
						'<tr class="{{clz}}">',
							'{{#each cols}}',
								'<td class="{{clz}}">',
									'{{#chkColType type type="button"}}',
										'<a href="javascript:void(0);" class="{{btnClz}}" data-id="{{SUATransItemID}}" data-type="{{transType}}" data-orderid="{{orderID}}" data-orderkey="{{orderKey}}" >{{label}}</a>',
									'{{/chkColType}}',
									'{{#chkColType type type="text"}}',
										'<p data-value="{{value}}">{{{text}}}</p>',
									'{{/chkColType}}',
								'</td>',
							'{{/each}}',
						'</tr>',
					'{{/each}}',
				'</tbody>',
			'</table>',
		'</div>'
	].join('');
	TplLib.register('tpl_transaQuery_result', tpl_transaQuery_result);

	var tpl_account_edit = [
		'<form class="form-horizontal {{formClz}}" role="form">',
			'{{#each items}}',
				'{{#checkFormElementType type type="combo"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<select id="{{id}}" name="{{name}}" class="form-control"  data-type="{{type}}">',
								'{{#each options}}',
									'<option value="{{value}}" {{selected}}>{{label}}</option>',
								'{{/each}}',
							'</select>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="text"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'{{#isInputGroup prefix surfix}}',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon">',
											'{{{prefix}}}',
										'</span>',
									'{{/if}}',
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'{{else}}',
								'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}"  data-type="{{type}}">',
							'{{/isInputGroup}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="switcher"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'<input type="checkbox" id="{{id}}" name="{{name}}" value="{{defaultVal}}" data-type="{{type}}" data-onLabel="{{onLabel}}" data-offLabel="{{offLabel}}" {{checked}} />',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="radiogrp"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'{{#each options}}',
								'<label class="{{clz}}">',
									'<input type="radio" name="{{name}}" id="{{id}}" value="{{value}}" {{checked}} />',
									'{{label}}',
								'</label>',
							'{{/each}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
			'{{/each}}',
		'</form>'
	].join('');
	TplLib.register('tpl_account_edit', tpl_account_edit);

	var tpl_account_query_shop = [
		'<div class="query-shop {{clz}}">',
			'<p class="title">',
				'{{label}}:<strong>{{title}}</strong>',
			'</p>',
			'<div class="query-box"></div>',
			'<div class="result-box"></div>',
		'</div>'
	].join('');
	TplLib.register('tpl_account_query_shop', tpl_account_query_shop);

	var tpl_orderpay_detail = [

	].join('');
	TplLib.register('tpl_orderpay_detail', tpl_orderpay_detail);

	var tpl_fsmcustomer_detail = [
		'{{#with settleUnitDetail}}',
			'<div class="{{clz}} row settle-detail">',
				'<div class="col-xs-4">',
					'<dl class="dl-horizontal">',
						'<dt>账户名称：</dt>',
						'<dd class="">{{settleUnitName}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-4">',
					'<dl class="dl-horizontal">',
						'<dt>结算时间：</dt>',
						'<dd>{{transSuccessTime}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-4">',
					'<dl class="dl-horizontal">',
						'<dt>交易类型：</dt>',
						'<dd>{{transTypeLabel}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-4">',
					'<dl class="dl-horizontal">',
						'<dt>交易金额：</dt>',
						'<dd>{{transAmount}}元</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-4">',
					'<dl class="dl-horizontal">',
						'<dt>扣除佣金：</dt>',
						'<dd>{{transSalesCommission}}元</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-4">',
					'<dl class="dl-horizontal">',
						'<dt>结算金额：</dt>',
						'<dd>{{transAfterBalance}}元</dd>',
					'</dl>',
				'</div>',
			'</div>',
		'{{/with}}',
		'{{#with customerCard}}',
			'<div class="{{clz}} row customer-detail">',
				'<div class="col-xs-6">',
					'<dl class="dl-horizontal">',
						'<dt>充值金额：</dt>',
						'<dd class="">{{saveMoneyTotal}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-6">',
					'<dl class="dl-horizontal">',
						'<dt>会员账户余额：</dt>',
						'<dd class="">{{moneyBalance}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-6">',
					'<dl class="dl-horizontal">',
						'<dt>会员卡号：</dt>',
						'<dd class="">{{cardNO}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-6">',
					'<dl class="dl-horizontal">',
						'<dt>会员手机号：</dt>',
						'<dd class="">{{customerMobile}}</dd>',
					'</dl>',
				'</div>',
				'<div class="col-xs-6">',
					'<dl class="dl-horizontal">',
						'<dt>会员姓名：</dt>',
						'<dd class="">{{customerName}}</dd>',
					'</dl>',
				'</div>',
			'</div>',
		'{{/with}}'
	].join('');
	TplLib.register('tpl_fsmcustomer_detail', tpl_fsmcustomer_detail);

})(jQuery, window);