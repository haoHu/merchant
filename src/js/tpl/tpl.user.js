(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;

	var tpl_user_query = [
		'<div class="shop-query {{clz}}">',
			'<nav class="navbar navbar-default query" role="query">',
				'<div class="container-fluid">',
					'<div class="navbar-header">',
						'{{#with toggle}}',
						'{{> toggle}}',
						'{{/with}}',
						'<a class="navbar-brand" href="javascript:void(0);">用户查询</a>',
					'</div>',
					'<div class="collapse navbar-collapse" id="shop_query">',
						'<div class="navbar-form navbar-left" role="search">',
							'<select class="chosen-select-no-results"  style="width:200px;">',
								'<option value=""></option>',
								'{{#each optGrp}}',
									'<optgroup label="{{name}}">',
										'{{#each items}}',
											'<option value="{{code}}">{{name}}</option>',
										'{{/each}}',
									'</optgroup>',
								'{{/each}}',
							'</select>',
							'<button class="btn btn-default query-btn" data-act="query">查询</button>',
						'</div>',
						'<button class="btn btn-warning create-user pull-right" style="margin-top:8px;" data-act="create">添加账号</button>',
					'</div>',
				'</div>',
			'</nav>',
		'</div>'
	].join('');
	TplLib.register('tpl_user_query', tpl_user_query);

	var tpl_user_list = [
		'<div class="table-responsive col-sm-12 user-list">',
			'<table class="table table-striped table-hover">',
				'<thead>',
					'<tr>',
						'<th>账号</th>',
						'<th>用户姓名</th>',
						'<th>状态</th>',
						'<th>角色/权限</th>',
						'<th>备注</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'{{#with userItem}}',
						'{{#each list}}',
							'{{> userItem}}',
						'{{/each}}',
					'{{/with}}',
				'</tbody>',
			'</table>',
		'</div>'
		
	].join('');
	TplLib.register('tpl_user_list', tpl_user_list);

	var tpl_user_item = [
		'<tr data-id="{{accountID}}" class="user-item">',
			'<td class="user-col">',
				'<div class="x-mul-vertical-middle">',
					'<div class="x-v-m-out">',
						'<div class="x-v-m-in item">',
							'<span class="uname">{{loginName}}</span>',
						'</div>',
					'</div>',
				'</div>',
			'</td>',
			'<td class="user-col">',
				'<div class="x-mul-vertical-middle">',
					'<div class="x-v-m-out">',
						'<div class="x-v-m-in item">',
							'<span class="name">{{userName}}</span>',
							'<span class="cell {{cellClz}}" data-binded="{{mobileBinded}}">',
								'{{#if mobileIsBinded}}',
									'({{userMobile}})',
								'{{else}}',
									'(未绑定手机)',
								'{{/if}}',
							'</span>',
						'</div>',
					'</div>',
				'</div>',
				
			'</td>',
			'<td class="user-col">',
				'<div class="x-mul-vertical-middle">',
					'<div class="x-v-m-out">',
						'<div class="x-v-m-in item">',
							'<span class="label {{accountStatusClz}}" data-status="{{accountStatus}}">',
								'{{accountStatusLabel}}',
							'</span>',
						'</div>',
					'</div>',
				'</div>',
				
			'</td>',
			'<td class="user-col">',
				'<div class="x-mul-vertical-middle">',
					'<div class="x-v-m-out">',
						'<div class="x-v-m-in item">',
							'{{#each roles}}',
								'<div class="role-item ',
								'{{#if binded}}',
									'',
								'{{else}}',
									'hidden',
								'{{/if}}',
								'">',
									'<span class="label label-info " data-roleType="{{roleType}}">{{name}}</span>',
								'</div>',
							'{{/each}}',
						'</div>',
					'</div>',
				'</div>',
				
			'</td>',
			'<td class="user-col">',
				'<div class="x-mul-vertical-middle">',
					'<div class="x-v-m-out">',
						'<div class="x-v-m-in item">',
							'{{{userRemark}}}',
						'</div>',
					'</div>',
				'</div>',
				
			'</td>',
			
		'</tr>'

	].join('');
	TplLib.register('tpl_user_item', tpl_user_item);

	var tpl_user_ctrl = [
		'<div class="user-ctrl" data-id="{{id}}">',
			'<div class="user-ctrl-box">',
				'<div class="x-mul-vertical-middle">',
					'<div class="x-v-m-out">',
						'<div class="x-v-m-in item">',
							'<div class="pull-right">',
								'{{#each btns}}',
									'<button class="btn {{clz}}" data-act="{{act}}">{{{label}}}</button>',
								'{{/each}}',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
	].join('');
	TplLib.register('tpl_user_ctrl', tpl_user_ctrl);

	var tpl_base_user_form = [
		'<form class="form-horizontal {{formClz}}" role="form">',
			'{{#each items}}',
				'{{#checkFormElementType type type="static"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<p class="form-control-static">{{value}}</p>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="text"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'{{#isInputGroup prefix surfix}}',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon">',
											'{{{prefix}}}',
										'</span>',
									'{{/if}}',
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" {{mode}} />',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'{{else}}',
								'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" {{mode}}/>',
							'{{/isInputGroup}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="password"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'{{#isInputGroup prefix surfix}}',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon">',
											'{{{prefix}}}',
										'</span>',
									'{{/if}}',
									'<input type="password" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" />',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'{{else}}',
								'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" />',
							'{{/isInputGroup}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="checkbox"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<label for="{{id}}" class="control-label">',
								'<input type="checkbox" id="{{id}}" name="{{name}}" value="{{defaultVal}}" data-type="{{type}}" data-onLabel="{{onLabel}}" data-offLabel="offLabel" {{checked}} />',
								'{{{label}}}',
							'</label>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="hidden"}}',
					'<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" />',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="switcher"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'<input type="checkbox" id="{{id}}" name="{{name}}" value="{{defaultVal}}" data-type="{{type}}" data-onLabel="{{onLabel}}" data-offLabel="{{offLabel}}" {{checked}} />',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="roleBindGrp"}}',
					'<div class="form-group">',
						'<label for="" class="{{labelClz}}">{{{label}}}</label>',
					'</div>',
					'<div class="form-group role-bind-grp">',
						'<div class="{{clz}}">',
							'<dl>',
								'{{#each items}}',
									'<dt class="checkbox">',
										'<label for="role_{{id}}" class="control-label">',
											'<input id="role_{{id}}" name="{{type}}" type="checkbox" value="1" {{checked}} />',
											'{{name}}',
										'</label>',
										'<a class="btn btn-link btn-bind {{hideBtn}} {{disabledBtn}}" data-role="{{type}}">{{{btnLabel}}}</a>',
									'</dt>',
									'<dd>',
										'{{{roleDesc}}}',
									'</dd>',
								'{{/each}}',
							'</dl>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
			'{{/each}}',
		'</form>'
	].join('');
	TplLib.register('tpl_base_user_form', tpl_base_user_form);

	var tpl_role_bind_shop = [
		'<div class="query-shop {{clz}}">',
			'<p class="title">',
				'{{{title}}}',
			'</p>',
			'<div class="query-box"></div>',
			'<div class="result-box"></div>',
		'</div>'
	].join('');
	TplLib.register('tpl_role_bind_shop', tpl_role_bind_shop);

	var tpl_bind_shop_item = [
		'{{#checkItemType type type="checkbox"}}',
			'<div class="checkbox {{clz}}">',
				'<label for="{{shopID}}" class="control-label" title="{{shopName}}">',
					'<input type="checkbox" id="{{shopID}}" name="bindShop" value="{{shopID}}" data-type="{{type}}" {{checked}} />',
					'{{{shopNameLabel}}}',
				'</label>',
			'</div>',
		'{{/checkItemType}}',
		'{{#checkItemType type type="radio"}}',
			'<div class="radio {{clz}}">',
				'<label for="{{shopID}}" class="control-label" title="{{shopName}}">',
					'<input type="radio" id="{{shopID}}" name="bindShop" value="{{shopID}}" data-type="{{type}}" {{checked}} />',
					'{{{shopNameLabel}}}',
				'</label>',
			'</div>',
		'{{/checkItemType}}',
	].join('');
	TplLib.register('tpl_bind_shop_item', tpl_bind_shop_item);

	var tpl_settle_list = [
		'<div class="row">',
			'{{#with settleList}}',
				'{{#each list}}',
					'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">',
						'{{> settleItem}}',
					'</div>',
				'{{/each}}',
			'{{/with}}',
		'</div>'
	].join('');
	TplLib.register('tpl_settle_list', tpl_settle_list);

	var tpl_settle_item = [
		'{{#checkItemType type type="checkbox"}}',
			'<div class="checkbox {{clz}}">',
				'<label for="{{settleUnitID}}" class="control-label" title="{{settleUnitName}}">',
					'<input type="checkbox" id="{{settleUnitID}}" name="bindSettle" value="{{settleUnitID}}" data-type="{{type}}" {{checked}} />',
					'{{{settleUnitNameLabel}}}',
				'</label>',
			'</div>',
		'{{/checkItemType}}',
		'{{#checkItemType type type="radio"}}',
			'<div class="radio {{clz}}">',
				'<label for="{{settleUnitID}}" class="control-label" title="{{settleUnitName}}">',
					'<input type="radio" id="{{settleUnitID}}" name="bindSettle" value="{{settleUnitID}}" data-type="{{type}}" {{checked}} />',
					'{{{settleUnitNameLabel}}}',
				'</label>',
			'</div>',
		'{{/checkItemType}}',
	].join('');
	TplLib.register('tpl_settle_item', tpl_settle_item);

	var tpl_shops_tree = [
		'<div class="row">',
			'<ul class="shop-tree col-sm-12" >',
				'{{#each cities}}',
					'<li class="node {{nodeClz}}">',
						'<div class="node-head">',
							'{{> collapseBtn}}',
							'{{> item}}',
						'</div>',
						'<div class="node-body collapse in" id="{{nodeType}}_{{id}}">',
							'<ul class="row">',
								'{{#each areas}}',
									'<li class="node  {{nodeClz}}">',
										'<div class="node-head">',
											'{{> collapseBtn}}',
											'{{> item}}',
										'</div>',
										'<div class="node-body collapse " id="{{nodeType}}_{{id}}">',
											'<ul class="row">',
												'{{#each shops}}',
													'<li class="node {{nodeClz}}">',
														'<div class="node-head">',
															'{{> collapseBtn}}',
															'{{> item}}',
														'</div>',
													'</li>',
												'{{/each}}',
											'</ul>',
										'</div>',
									'</li>',
								'{{/each}}',
							'</ul>',
						'</div>',
					'</li>',
				'{{/each}}',
			'</ul>',
		'</div>'
	].join('');
	TplLib.register('tpl_shops_tree', tpl_shops_tree);

	var tpl_collapse_btn = [
		'<a data-toggle="collapse"  href="#{{nodeType}}_{{id}}" aria-expanded="true" aria-controls="{{nodeType}}_{{id}}" class="btn btn-link {{hideCollapse}}">',
            '<span class="glyphicon glyphicon-chevron-down"></span>',
        '</a>'
	].join('');
	TplLib.register('tpl_collapse_btn', tpl_collapse_btn);

	var tpl_shop_checkbox = [
		'<div class="checkbox">',
            '<label class="control-label">',
                '<input type="checkbox" value="{{id}}" name="{{nodeType}}" data-parent="{{parentID}}" {{checked}} />',
                '{{{name}}}',
            '</label>',
        '</div>'
	].join('');
	TplLib.register('tpl_shop_checkbox', tpl_shop_checkbox);

	var tpl_role_binding_info = [
		'<div class="row">',
			'<div class="col-sm-2 text-right">',
				'<label class="control-label ">账号名称</label>',
			'</div>',
			'<div class="col-sm-8">',
				'<p>{{{accountName}}}</p>',
			'</div>',

		
			'<div class="col-sm-12 table-responsive tbl-role-binding">',
				'<table class="table table-hover">',
					'<caption class="text-left">',
						'账号绑定信息',
					'</caption>',
					'<thead>',
						'<tr>',
							'<th>角色名称</th>',
							'<th>绑定店铺/结算账号</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
						'{{#each roles}}',
							'<tr>',
								'<td>',
									'<p>{{name}}</p>',
								'</td>',
								'<td>',
									'{{#each items}}',
										'<span class="label label-default" data-id="{{id}}">',
										'{{name}}',
										'</span>',
									'{{/each}}',
								'</td>',
							'</tr>',
						'{{/each}}',
					'</tbody>',
				'</table>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_role_binding_info', tpl_role_binding_info);

	var tpl_wizard_layout = [
		'<div id="{{id}}" class="wizard {{clz}}">',
			'<ul class="wizard-nav step-nav">',
				'{{#each stepNavs}}',
					'<li>',
						'<a href="#{{id}}" data-toggle="tab"><span class="label">{{idx}}</span>{{label}}</a>',
					'</li>',
				'{{/each}}',
			'</ul>',
			'<div class="wizard-content tab-content">',
				'{{#each steps}}',
					'<div class="tab-pane" id="{{id}}">',
						'第{{id}}步',
					'</div>',
				'{{/each}}',
			'</div>',
			'<div class="wizard-ctrl">',
				'{{> stepAction}}',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_wizard_layout', tpl_wizard_layout);
})(jQuery, window);





















