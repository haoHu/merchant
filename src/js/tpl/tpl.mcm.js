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

	var tpl_gift_card_list = [
		'{{#each option}}',
		'<div class="event-card-choice" data-btn-name={{clz}}>',
			'<a href="javascript:{};" class="choice-eventWay" data-value={{{value}}}>',
				'<span class="mcm-card-box event-card {{clz}}">',
					'<input type="radio" class="eventWay" name="eventWay" value={{{value}}} >',
					'<span class="card">',
						'<span class="label">',
							'{{{label}}}',
						'</span>',
					'</span>',
				'</span>',
			'</a>',
		'</div>',
		'{{/each}}'
	].join('');
	TplLib.register('tpl_gift_card_list', tpl_gift_card_list);

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
					'<div class="form-group">',
						'<label class="col-sm-2 control-label">使用店铺:</label>',
						'<div class="col-sm-9">',
							'<p class="form-control-static">{{{shopNames}}}</p>',
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
								'<label class="{{infoLabelClz}} control-label">活动说明:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{eventRemark}}}</p>',
								'</div>',
							'</div>',   
							'<div class="form-group" {{hiddenSms}}>',
								'<label class="{{infoLabelClz}} control-label">{{smsStartLabel}}:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{startTimeLabel}}</p>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="mcm-event-info {{evtBaseClz}} {{hiddenCustomerRange}}">',
				'<h4>',
					'群体',
				'</h4>',
				'<div class="media ">',
					'<div class="media-body">',
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="{{infoLabelClz}} control-label">{{customerRange}}:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{{cardLevelLabel}}}</p>',
									'<p class="form-control-static">{{{levelLimitBirthday}}}</p>',
								'</div>',
							'</div>',
							'<div class="form-group {{hiddenShop}}">',
								'<label class="{{infoLabelClz}} control-label">开卡店铺:</label>',
								'<div class="col-sm-9">',
									'<p class="form-control-static">{{smsCustomerShopName}}</p>',
								'</div>',
							'</div>',
                            '<div class="form-group {{hiddenShop}}">',
                                '<label class="{{infoLabelClz}} control-label">最后消费店铺:</label>',
                                '<div class="col-sm-9">',
                                    '<p class="form-control-static">{{lastTransShopName}}</p>',
                                '</div>',
                            '</div>',
                            '<div class="form-group {{hiddenShop}}">',
                                '<label class="{{infoLabelClz}} control-label">最后消费时间:</label>',
                                '<div class="col-sm-9">',
                                    '<p class="form-control-static">{{lastTransTime}}</p>',
                                '</div>',
                            '</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="mcm-event-info {{evtRulesClz}} {{hiddenEvtRules}}">',
				'<h4>',
					'活动规则',
				'</h4>',
				'<div class="media">',
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
			'<div class="mcm-event-info {{SmsTemplateClz}} {{hiddenSms}}">',
	            '<h4>短信模板</h4>',
	            '<div class="media">',
	                '<p class="form-control-static col-sm-offset-1">{{smsTemplate}}</p>',
	            '</div>',
	        '</div>',
		'</div>',
		'<div class="{{evtGiftsClz}}">',
			// '{{#if hasGifts}}',
			'{{#if hiddenTitle}}',
				'<h4 {{hiddenTitle}}>',
					'{{#if isApplyEvent}}',
						'奖品信息',
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
						'奖品信息',
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
					'{{#if isSmsEvent}}',
						'发送总数：',
						'<small>',
						'&nbsp;<span>',
							'',
							'<strong>',
							'{{smsPersonNum}}',
							'</strong>人，',
						'</span>',
						'<span>',
							'合',
							'<strong>',
							'{{smsCount}}',
							'</strong>条',
						'</span>',
						'</small>',
					'{{/if}}',
				'</h4>',
			'{{else}}',
				'<h4>',
					'{{#if isSmsEvent}}',
						'预计发送总数：',
						'<small>',
						'&nbsp;<span>',
							'',
							'<strong>',
							'{{smsPersonNum}}',
							'</strong>人，',
						'</span>',
						'<span>',
							'合',
							'<strong>',
							'{{smsCount}}',
							'</strong>条',
						'</span>',
							'请以真实情况为准',
						'</small>',
					'{{/if}}',
				'</h4>',
			'{{/if}}',
			'<div class="mcm-event-gifts" {{hiddenGift}}>',
				'<table class="table table-bordered table-striped table-hover">',
					'<thead>',
						'<tr>',
							'<th class="{{hideEGiftLevel}}">{{EGiftLevelTh}}</th>',
							'<th>{{EGiftNameTh}}</th>',
							'<th>{{EGiftTotalCountTh}}</th>',
							'<th>发出数</th>',
							'<th class="{{hideSurplusCount}}">剩余数</th>',
							'<th class="{{hideEGiftOdds}}">中奖概率(%)</th>',
							'<th class="{{hideEGfitValidUntilDayCount}}">有效天数</th>',
						'</tr>',
					'</thead>',
					'{{#if hasGifts}}',
						'<tbody>',
							'{{#each giftItems}}',
								'<tr>',
									'<td class="text {{../hideEGiftLevel}}">',
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
									'<td class="number {{../hideSurplusCount}}">',
										'{{{surplusCount}}}',
									'</td>',
									'<td class="number {{../hideEGiftOdds}}">',
										'{{{EGiftOdds}}}',
									'</td>',
									'<td class="number {{../hideEGfitValidUntilDayCount}}">',
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
					'<div class="form-group  {{hidden}}">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'{{#isInputGroup prefix surfix}}',
								'<div class="input-group">',
									'{{#if prefix}}',
										'<span class="input-group-addon {{prefixHidden}}">',
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
								'<input type="text" id="{{id}}" name="{{name}}" class="form-control {{hidden}}" placeholder="{{placeholder}}" value="{{value}}" data-type="{{type}}" {{disabled}} {{readonly}} {{mode}}/>',
							'{{/isInputGroup}}',
							'{{#if help}}',
								'<span class="help-block">{{{help}}}</span>',
							'{{/if}}',
						'</div>',
					'</div>',
				'{{/checkFormElementType}}',
				'{{#checkFormElementType type type="combo"}}',
					'<div class="form-group {{hidden}}">',
						'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
						'<div class="{{clz}}">',
							'<select id="{{id}}" name="{{name}}" class="form-control" {{disabled}}  data-type="{{type}}">',
								'{{#each options}}',
									'<option value="{{value}}" {{selected}}>{{label}}</option>',
								'{{/each}}',
							'</select>',
							'{{#if help}}',
								'<span class="help-block">{{{help}}}</span>',
							'{{/if}}',
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
								'<span class="to-label {{hiddenBetween}}">到</span>',
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
				'{{#checkFormElementType type type="uploadImage"}}',
					'<div class="gift-pic {{hiddenGiftImage}}">',
						'<div class="form-group">',
							'<label for="{{id}}" class="{{labelClz}}">{{{label}}}</label>',
							'<div class="gift-img col-md-5">',
								'<div class="clearfix">',
									'<img src="{{giftImagePath}}" alt="实物图片" width="200px" />',
									'<span>上传中 . . .</span>',
								'</div>',
								'<label class="btn-link m-t">上传图片</label>',
								//'<div class="m-t warning text-warning">图片格式必须为：jpg、png，宽不小于600像素</div>',
							'</div>',
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
				'<option class="{{clz}}" title="{{shopName}}" value="{{shopID}}">{{shopName}}</option>',
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
		'<p class="alert alert-warning {{hideTip}}">{{tip}}</p>',
		'<form class="mcm-gift-set {{hidden}}">',
			'{{#each gifts}}',
			'<div class="panel panel-default {{clz}}" data-index="{{@index}}">',
				'<div class="panel-heading">',
					'<h3 class="panel-title">',
						'{{../giftSetTitle}}',
						// '中奖等级设置',
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
		'<p class="alert alert-warning m-t">请仔细核对活动信息后，启用此活动&nbsp;&nbsp;<strong>{{smsAlert}}</strong></p>'
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

	var tpl_event_base_info = [
		'<form class="form-horizontal form-feedback-out">',
			'<div class="form-group">',
				'<label class="col-sm-offset-1 col-sm-3 control-label">活动主题</label>',
				'<div class="col-md-5">',
					'<input type="text" name="eventName" class="form-control" value="{{eventName}}"/>',
				'</div>',
			'</div>',
			//'{{#if isSMSEvent}}',
			//'{{else}}',
			//	'<div class="form-group">',
			//		'<label class="col-sm-offset-1 col-sm-3 control-label">是否发送短信</label>',
			//		'<div class="col-md-7">',
			//			'<input type="checkbox" name="smsGate" data-status="{{smsGate}}">',
			//		'</div>',
			//	'</div>',
			//'{{/if}}',
			'{{#if isSMSEvent}}',
				'<div class="form-group fwc">',
					'<label class="col-sm-offset-1 col-sm-3 control-label">短信发送时间</label>',
					'<div class="col-md-7">',
						'<input type="text" name="SMSStartDate" class="form-control m-r" data-type="datetimepicker" value="{{SMSStartDate}}"/>',
						'<div class="input-group clearfix">',
							'<input type="text" name="SMSStartTime" class="form-control" data-type="timepicker" value="{{SMSStartTime}}">',
							'<span class="input-group-addon">',
								'<span class="glyphicon glyphicon-time"></span>',
							'</span>',
						'</div>',
					'</div>',
				'</div>',
			'{{else}}',
				'<div class="form-group fwc">',
					'<label class="col-sm-offset-1 col-sm-3 control-label">活动起止日期</label>',
					'<div class="col-md-7">',
						'<input type="text" name="eventStartDate" class="form-control" value="{{eventStartDate}}"  data-type="datetimepicker">',
						'<span class="gut">到</span>',
						'<input type="text" name="eventEndDate" class="form-control" value="{{eventEndDate}}" data-type="datetimepicker">',
					'</div>',
				'</div>',
			'{{/if}}',
			'</div>',
		'<div class="form-group">',
			'<label class="col-sm-offset-1 col-sm-3 control-label">活动描述</label>',
			'<div class="col-md-5">',
				'<textarea type="text" name="eventRemark" class="form-control" value="{{eventRemark}}">{{eventRemark}}</textarea>',
			'</div>',
		'</div>',
		'</form>'
	].join('');
	TplLib.register('tpl_event_base_info', tpl_event_base_info);

	var tpl_customer_range = [
		'<form class="form-horizontal form-feedback-out">',
			'<div class="form-group">',
				'<label class="col-sm-offset-1 col-sm-3 control-label">顾客范围</label>',
				'<div class="col-md-4" name="vip_list"></div>',
			'</div>',
			'{{#if isSMSEvent}}',
			'<div class="form-group">',
				'<label class="col-sm-offset-1 col-sm-3 control-label">开卡店铺</label>',
				'<div class="col-md-4" name="card_shop"></div>',
			'</div>',
            '<div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">最后消费店铺</label>',
                '<div class="col-md-4" name="consume_shop"></div>',
            '</div>',
            '<div class="form-group">',
                '<label class="col-sm-offset-1 col-sm-3 control-label">最后消费日期</label>',
                '<div class="col-md-2 time-filter">{{> customSelect consumeTimeFilterData}}</div>',
                '<div class="col-md-3">',
                    '<input type="text" name="lastTransTime" data-type="datetimepicker" class="form-control" value="{{lastTransTime}}">',
                '</div>',
            '</div>',
			'{{/if}}',
			'<div class="form-group">',
				'<label class="col-sm-offset-1 col-sm-3 control-label">仅本月会员生日可参与</label>',
				'<div class="col-sm-7">',
					'<label class="radio-inline"><input type="radio" name="isVipBirthdayMonth" value="0">不限制</label>',
					'<label class="radio-inline"><input type="radio" name="isVipBirthdayMonth" value="1">仅本月生日的会员可参与</label>',
				'</div>',
			'</div>',
		'</form>'
	].join('');
	TplLib.register('tpl_customer_range', tpl_customer_range);

	var tpl_sms_template = [
		'<p class="alert alert-warning {{hideSMSTip}}">您没有开启发送短信功能，可以直接跳过该步骤</p>',
		'<div class="clearfix {{hideSMS}}">',
            '<form class="form-horizontal form-feedback-out">',
                '{{#if smsCustomer}}',
                    '<div class="form-group">',
                        '<label class="control-label col-sm-2">短信发送对象</label>',
                        '<div class="col-md-5">',
                            '{{> customSelect selectData}}',
                        '</div>',
                    '</div>',
                '{{/if}}',
                '<div class="form-group">',
                    '<label class="control-label col-sm-2">短信模板</label>',
                    '<div class="col-md-5">',
                        '<textarea name="smsTemplate" class="form-control" value="{{smsTemplate}}">{{smsTemplate}}</textarea>',
                    '</div>',
                    '<div class="col-md-5">',
                        '<a href="javascript:{}" name="preview">预览</a>',
                        '<p name="viewSMSTempLate" class="m-t"></p>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="control-label col-sm-2"></label>',
                    '<div class="col-md-5">',
                        '请不要输入"【】" "[]"符号',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="control-label col-sm-2"></label>',
                    '<div class="col-md-6" name="smsAttr">',
                        '{{#each smsAttr}}',
                        '<a class="m-r" href="javascript:{}">{{label}}</a>',
                        '{{/each}}',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="control-label col-sm-2"></label>',
                    '<label class="col-sm-6">预计字数：<span name="estimateSMSCount">{{smsTextCount}}</span>字,67字为一条</label>',
                '</div>',
            '</form>',
		'</div>'
	].join('');
	TplLib.register('tpl_sms_template', tpl_sms_template);
})(jQuery, window);