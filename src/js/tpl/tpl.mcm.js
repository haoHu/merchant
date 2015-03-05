(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;

	var tpl_gift_card = [
		'<span class="mcm-card-box gift-card {{clz}}">',
			'<span class="card">',
				'<span class="card-left"></span>',
				'<span class="card-right"></span>',
				'<span class="card-label" title="{{{label}}} {{unit}}">',
					'<span class="val">{{{label}}}</span>',
					'<span class="unit">{{unit}}</span>',
				'</span>',
			'</span>',
		'</span>'
	].join('');
	TplLib.register('tpl_gift_card', tpl_gift_card);

	var tpl_event_card = [
		'<span class="mcm-card-box event-card {{clz}}">',
			'<span class="card">',
				'<span class="label">',
					'{{{label}}}',
				'</span>',
			'</span>',
		'</span>'
	].join('');
	TplLib.register('tpl_event_card', tpl_event_card);

	var tpl_gift_detail = [
		'<h4>基本信息</h4>',
		'<div class="media mcm-gift-info">',
			'<div class="media-left">',
				'{{#with card}}',
					'{{> card}}',
				'{{/with}}',
			'</div>',
			'<div class="media-body">',
				'<div class="form-horizontal">',
					'<div class="form-group">',
						'<label class="{{infoLabelClz}} control-label">名称:</label>',
						'<div class="{{infoTextClz}}">',
							'<p class="form-control-static">{{{giftName}}}</p>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="{{infoLabelClz}} control-label">类型:</label>',
						'<div class="{{infoTextClz}}">',
							'<p class="form-control-static">{{{giftTypeLabel}}}</p>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="{{infoLabelClz}} control-label">价值:</label>',
						'<div class="{{infoTextClz}}">',
							'<p class="form-control-static">{{{giftValue}}} {{{giftTypeUnit}}}</p>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="{{infoLabelClz}} control-label">创建时间:</label>',
						'<div class="{{infoTextClz}}">',
							'<p class="form-control-static">{{{createTime}}}</p>',
						'</div>',
					'</div>',
					
				'</div>',
			'</div>',
		'</div>',
		'<div class="media mcm-gift-info">',
			'<div class="media-body">',
				'<div class="form-horizontal">',
					'<div class="form-group">',
						'<label class="col-sm-2 control-label">使用说明:</label>',
						'<div class="col-sm-9">',
							'<p class="form-control-static">{{{giftRemark}}}</p>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-2 control-label">使用规则:</label>',
						'<div class="col-sm-9">',
							'<p class="form-control-static">{{{giftRules}}}</p>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
	].join('');
	TplLib.register('tpl_gift_detail', tpl_gift_detail);

	var tpl_event_detail = [
		'<div class="clearfix">',
			'<div class="mcm-event-info {{evtBaseClz}}">',
				'<h4>',
					'基本信息',
				'</h4>',
				'<div class="media ">',
					'<div class="media-left">',
						'{{#with card}}',
							'{{> card}}',
						'{{/with}}',
					'</div>',
					'<div class="media-body">',
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">活动名称:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{eventName}}}</p>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">会员等级最低要求:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{cardLevelLabel}}}</p>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">活动说明:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{eventRemark}}}</p>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="mcm-event-info {{evtRulesClz}}">',
				'<h4>',
					'活动规则',
				'</h4>',
				'<div class="media  ">',
					'<div class="media-body">',
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">参与活动扣减积分:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{deductPoints}}}</p>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">参与活动赠送积分:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{sendPoints}}}</p>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">活动规则:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{eventRules}}}</p>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="{{evtGiftsClz}}">',
			// '{{#if hasGifts}}',
			'<h4>',
				'奖品信息',
				'{{#if isApplyEvent}}',
					'<small>',
					'&nbsp;(<span>',
						'活动人气',
						'<strong>',
						'{{viewCount}}',
						'</strong>，',
					'</span>',
					'<span>',
						'报名人数',
						'<strong>',
						'{{userCount}}',
						'</strong>人，',
					'</span>',
					'<span>',
						'入围人数',
						'<strong>',
						'{{winCount}}',
						'</strong>人，',
					'</span>',
					'<span>',
						'还剩',
						'<strong>',
						'{{surplusCount}}',
						'</strong>人入围名额。)',
					'</span>',
					'</small>',
				'{{else}}',
					'<small>',
					'&nbsp;(<span>',
						'活动人气',
						'<strong>',
						'{{viewCount}}',
						'</strong>，',
					'</span>',
					'<span>',
						'参与人数',
						'<strong>',
						"{{userCount}}",
						'</strong>人',
					'</span>)',
					'</small>',
				'{{/if}}',
			'</h4>',
			'<div class="mcm-event-gifts">',
				'<table class="table table-bordered table-striped table-hover">',
					'<thead>',
						'<tr>',
							'<th>中奖等级</th>',
							'<th>奖品名称</th>',
							'<th>总数</th>',
							'<th>发出数</th>',
							'<th>剩余数</th>',
							'<th>中奖概率(%)</th>',
							'<th>有效天数</th>',
						'</tr>',
					'</thead>',
					'{{#if hasGifts}}',
						'<tbody>',
							'{{#each giftItems}}',
								'<tr>',
									'<td class="text">',
										'{{{level}}}',
									'</td>',
									'<td class="text">',
										'{{{EGiftName}}}',
									'</td>',
									'<td class="number">',
										'{{{EGiftTotalCount}}}',
									'</td>',
									'<td class="number">',
										'{{{EGiftSendCount}}}',
									'</td>',
									'<td class="number">',
										'{{{surplusCount}}}',
									'</td>',
									'<td class="number">',
										'{{{EGiftOdds}}}',
									'</td>',
									'<td class="number">',
										'{{{EGfitValidUntilDayCount}}}',
									'</td>',
								'</tr>',
							'{{/each}}',
						'</tbody>',
					'{{else}}',
						'<tbody>',
							'<tr>',
								'<td colspan="{{colCount}}"><p class="text-center">无结果</p></td>',
							'</tr>',
						'</tbody>',
					'{{/if}}',
				'</table>',
			'</div>',
			// '{{else}}',
			
			// '{{/if}}',
		'</div>'
	].join('');
	TplLib.register('tpl_event_detail', tpl_event_detail);

	var tpl_mcm_base_form = [
		'{{#if isDivForm}}',
		'<div class="form-horizontal {{formClz}}" role="form">',
		'{{else}}',
		'<form class="form-horizontal {{formClz}}" role="form">',
		'{{/if}}',
			'{{#each items}}',
				'{{#checkFormElementType type type="static"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<p class="form-control-static">{{value}}</p>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="textarea"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
								'<textarea id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" {{mode}}>{{{value}}}</textarea>',
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
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" {{disabled}} {{readonly}} {{mode}} />',
									'{{#if surfix}}',
										'<span class="input-group-addon">',
											'{{{surfix}}}',
										'</span>',
									'{{/if}}',
								'</div>',
							'{{else}}',
								'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" {{disabled}} {{readonly}} {{mode}}/>',
							'{{/isInputGroup}}',
							'{{#if help}}',
								'<span class="help-block">{{{help}}}</span>',
							'{{/if}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="combo"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<select id="{{id}}" name="{{name}}" class="form-control" {{disabled}}  data-type="{{type}}">',
								'{{#each options}}',
									'<option value="{{value}}" {{selected}}>{{label}}</option>',
								'{{/each}}',
							'</select>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="radiogrp"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'{{#each options}}',
								'<label class="radio-inline {{clz}}">',
									'<input type="radio" name="{{name}}" {{disabled}} id="{{id}}" value="{{value}}" {{checked}} />',
									'{{label}}',
								'</label>',
							'{{/each}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="checkboxgrp"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{label}}</label>',
						'<div class="{{clz}}">',
							'{{#each options}}',
								'<label class="checkbox-inline {{clz}}">',
									'<input type="checkbox" name="{{name}}" {{disabled}} id="{{id}}" value="{{value}}" {{checked}} />',
									'{{label}}',
								'</label>',
							'{{/each}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="selectShops"}}',
					'<div class="form-group">',
						'<label for="" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<div class="combo-shop" name="{{name}}"></div>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="hidden"}}',
					'<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" />',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="inputCountCycleDays"}}',
					'<div class="form-group">',
						'<label for="" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<div class="cycle-box">',
								'{{#with countCycleDays}}',
									'<span class="cycle-label">',
										'同一用户',
									'</span>',
									'<select id="{{id}}" name="{{name}}" class="form-control">',
										'{{#each options}}',
											'<option value="{{value}}" {{selected}}>{{label}}</option>',
										'{{/each}}',
									'</select>',
								'{{/with}}',
								'{{#with partInTimes}}',
									'<span class="partin-label">',
										'总共可参与',
									'</span>',
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" value="{{value}}" />',
									'<span class="partin-label">',
										'次',
									'</span>',
								'{{/with}}',
							'</div>',
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
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" {{readonly}}  data-type="{{type}}">',
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
									'<input type="text" id="{{id}}" name="{{name}}" class="form-control" placeholder="{{placeholder}}" value="{{value}}" {{readonly}}  data-type="{{type}}">',
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
				
				'{{#checkFormElementType type type="pickgift"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<div class="input-group">',
								'<input type="text" readonly id="{{id}}" name="{{name}}" value="{{value}}" class="form-control" />',
								'<span class="input-group-btn">',
									'<button class="btn btn-default" name="pickgift" type="button">选择</button>',
								'</span>',
							'</div>',
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
				// '{{#checkFormElementType type type="pickaccount"}}',
				// 	'<div class="form-group">',
				// 		'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
				// 		'<div class="{{clz}}">',
				// 			'<div class="input-group">',
				// 				'<input type="text" readonly id="{{id}}" name="{{name}}" value="{{value}}" class="form-control" />',
				// 				'<span class="input-group-btn">',
				// 					'<button class="btn btn-default" name="pickgift" type="button">选择</button>',
				// 				'</span>',
				// 			'</div>',
				// 		'</div>',
				// 	'</div>',
				// '{{/checkFormElementType}}',
				'{{#checkFormElementType type type="pickaccount"}}',
					'<div class="form-group">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<select class="form-control chosen-select chosen-select-no-results" id="{{id}}" name="{{name}}"  style="width:200px;">',
								'<option value=""></option>',
								'{{#each optGrp}}',
									'<optgroup label="{{name}}">',
										'{{#each items}}',
											'<option value="{{code}}">{{name}}</option>',
										'{{/each}}',
									'</optgroup>',
								'{{/each}}',
							'</select>',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
			'{{/each}}',
		'{{#if isDivForm}}',
		'</div>',
		'{{else}}',
		'</form>',
		'{{/if}}'
	].join('');
	TplLib.register('tpl_mcm_base_form', tpl_mcm_base_form);

	var tpl_mcm_queryshops = [
		'<div class="row mcm-chose-shops">',
			'<div class="col-sm-offset-1 col-sm-4">',
				'<h4>待选择店铺</h4>',
				'<div class="select-left">',
					'{{#with chooseShopOpts}}',
					'<select name="{{comboName}}" multiple class="form-control">',
						'{{> optgroup}}',
					'</select>',
					'{{/with}}',
				'</div>',
			'</div>',
			'<div class="col-sm-3">',
				'<div class="select-center">',
				'{{> ctrlbtns}}',
				'</div>',
				// '<button class="btn btn-block {{clz}}" id="{{id}}" >{{{label}}}</button>',
			'</div>',
			'<div class="col-sm-4">',
				'<h4>已选择店铺</h4>',
				'<div class="select-right">',
					'{{#with chosenShopOpts}}',
					'<select name="{{comboName}}" multiple class="form-control">',
						'{{> optgroup}}',
					'</select>',
					'{{/with}}',
				'</div>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_mcm_queryshops', tpl_mcm_queryshops);

	var tpl_shop_optgroup = [
		'{{#each items}}',
		'<optgroup id="{{cityID}}" label="{{cityName}}" class="open">',
			'{{#each options}}',
				'<option class="{{clz}}" value="{{shopID}}">{{shopName}}</option>',
			'{{/each}}',
		'</optgroup>',
		'{{/each}}'
	].join('');
	TplLib.register('tpl_shop_optgroup', tpl_shop_optgroup);

	var tpl_account_opt = [
		'{{#each items}}',
			'<option value="{{value}}">{{name}}</option>',
		'{{/each}}',
	].join('');
	TplLib.register('tpl_account_opt', tpl_account_opt);

	var tpl_shop_choose = [
		'<div class="choose-shop-box">',
			'<p class="choose-shop-val">{{{shopNames}}}</p>',
			'<button class="btn btn-default btn-choose">选择店铺</button>',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_choose', tpl_shop_choose);

	var tpl_mcm_event_giftset = [
		'<form class="mcm-gift-set">',
			'<p class="alert alert-warning">活动所有奖品的中奖概率合计不能大于100%！</p>',
			'{{#each gifts}}',
			'<div class="panel panel-default {{clz}}" data-index="{{@index}}">',
				'<div class="panel-heading">',
					'<h3 class="panel-title">',
						'中奖等级设置',
						'<span class="label label-info">{{giftLevelName}}</span>',
					'<h3>',
				'</div>',
				'<div class="panel-body">',
					// '{{#with form}}',
					'{{> baseform}}',
					// '{{/with}}',
				'</div>',
				'<div class="panel-footer">',
					'{{> ctrlbtns}}',
				'</div>',
			'</div>',
			'{{/each}}',
		'</form>'
	].join('');
	TplLib.register('tpl_mcm_event_giftset', tpl_mcm_event_giftset);

	var tpl_event_openstep = [
		'<div class="mcm-event-detail">',
			'{{> evtdetail}}',
		'</div>',
		'<p class="alert alert-warning">请仔细核对活动信息后，启用此活动</p>'
	].join('');
	TplLib.register('tpl_event_openstep', tpl_event_openstep);



	var tpl_giftdetail_layout = [
		'<div class="detail-layout">',
			'<nav class="nav-bar"></nav>',
			'<section class="row mcm-detail-info">',
				'<div class="col-sm-5">',
					'<div class="panel panel-info">',
						'<div class="panel-heading">',
							'<h3 class="panel-title">礼品信息</h3>',
						'</div>',
						'<div class="panel-body">',
							'{{> baseinfo}}',
						'</div>',
					'</div>',
				'</div>',
				'<div class="col-sm-7">',
					'<div class="panel panel-info">',
						'<div class="panel-heading">',
							'<h3 class="panel-title">礼品统计</h3>',
						'</div>',
						'<div class="panel-body">',
							'{{#with grid}}',
								'{{> grid}}',
							'{{/with}}',
						'</div>',
					'</div>',
				'</div>',
			'</section>',
			'<section class="detail-tabs">',
				'<ul class="nav nav-tabs" role="tablist">',
					'{{#each navs}}',
						'<li role="presentation" class="{{clz}} {{active}}">',
							'<a href="#{{value}}" id="{{id}}" role="tab" data-toggle="tab" aria-controls="profile">',
								'{{label}}',
							'</a>',
						'</li>',
					'{{/each}}',
				'</ul>',
				'<div class="tab-content">',
					'{{#each navs}}',
						'<div role="tabpanel" class="tab-pane fade " id="{{value}}" >',
						'</div>',
					'{{/each}}',
				'</div>',
			'</section>',
		'</div>'
	].join('');
	TplLib.register('tpl_giftdetail_layout', tpl_giftdetail_layout);

	var tpl_eventtrack_layout = [
		'<div class="detail-layout">',
			'<nav class="nav-bar"></nav>',
			'<section class="row mcm-detail-info">',
				
				'{{> baseinfo}}',
				
			'</section>',
			'<section class="event-track">',
			'</section>',
		'</div>'
	].join('');
	TplLib.register('tpl_eventtrack_layout', tpl_eventtrack_layout);

	var tpl_giftdetail_formpanel = [
		'<div class=" col-md-offset-3 col-md-6">',
			'<div class="panel panel-default">',
				'<div class="panel-heading">',
					'<h3 class="panel-title">{{panelTitle}}</h3>',
				'</div>',
				'<div class="panel-body">',
					// '{{> baseform}}',
				'</div>',
				'<div class="panel-footer clearfix"></div>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_giftdetail_formpanel', tpl_giftdetail_formpanel);

	var tpl_gift_sms = [
		'{{groupName}}赠送了您{{giftCount}}张{{giftName}}，您可以登录{{site}}，我的账户-代金券查看。'
	].join('');
	TplLib.register('tpl_gift_sms', tpl_gift_sms);
})(jQuery, window);