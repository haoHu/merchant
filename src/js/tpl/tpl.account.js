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
		'<div class="panel panel-default ix-card bank-card {clz}" data-id="{{settleUnitID}}">',
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
						'<button type="button" class="btn btn-info">修改银行卡</button>',
						'<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">',
							'<span class="caret"></span>',
							'<span class="sr-only">Toggle Dropdown</span>',
						'</button>',
						'<ul class="dropdown-menu" role="menu">',
							'<li><a href="#">查看全部店铺</a></li>',
							'<li><a href="#">删除此账户</a></li>',
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
				'<div class="page-selection pull-right"></div>',
			'</div>',
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
											'<span class="to-label hidden-xs hidden-sm">到</span>',
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
								'<button type="button" class="btn {{clz}}">label</button>',
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
							'<th class="clz">{{label}}</th>',
						'{{/each}}',
					'</tr>',
				'</thead>',
				'<tbody>',
					'{{#each rows}}',
						'<tr class="{{clz}}">',
							'{{#each cols}}',
								'<td class="{{clz}}">',
									'{{#chkColType type type="button"}}',
										'<a href="javascript:void(0);" class="{{btnClz}}">{{label}}</a>',
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

})(jQuery, window);