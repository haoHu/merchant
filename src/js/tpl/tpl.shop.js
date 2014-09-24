(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
	
	var tpl_set_shop_client_pwd = [
	'<form class="form-horizontal">',
		'<div class="form-group">',
			'<label class="col-sm-3 control-label">店铺账号:</label>',
			'<div class="col-sm-9">',
				'<p class="form-control-static">{{shopID}}</p>',
			'</div>',
		'</div>',
		'<div class="form-group has-feedback">',
			'<label for="shopClinetPwd" class="col-sm-3 control-label">登录密码:</label>',
			'<div class="col-sm-9">',
				'<input type="password" id="shopClinetPwd" name="shopClinetPwd"  class="form-control" />',
				'<i class="form-control-feedback glyphicon"></i>',
				'<small class="help-block"></small>',
			'</div>',
		'</div>',
		'<div class="checkbox col-sm-offset-3">',
			'<label for="showPwd" class="control-label">',
				'<input type="checkbox" id="showPwd" name="shopClinetPwd" />',
				'显示明文',
			'</label>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_set_shop_client_pwd', tpl_set_shop_client_pwd);

	var tpl_shop_info_head = [
	/*'<div class="bs-callout shop-info-head">',*/
		'<div class="fl">',
			'<span class="shop-name">{{shopName}}</span>',
			'<a href="{{shopUrl}}" target="_blank">查看网上店铺</a>',
			'<a href="{{shopListLink}}">切换店铺</a>',
			'<a id="resetPwd" href="javascript:;">重置客户端密码</a>',
		'</div>',
		'<div class="shop-state">',
			'<label class="t-label">店铺当前状态：</label>',
			'<input type="checkbox" {{checked}} />',
		'</div>',
	/*'</div>'*/].join('');
	TplLib.register('tpl_shop_info_head', tpl_shop_info_head);

	var tpl_shop_create = [
	'<div id="shopCreateWizard">',
		'<ul class="step-nav">',
			'<li><a href="#tab1" data-toggle="tab"><span class="label">1</span>基本信息</a></li>',
			'<li><a href="#tab2" data-toggle="tab"><span class="label">2</span>标注地图</a></li>',
			'<li><a href="#tab3" data-toggle="tab"><span class="label">3</span>创建成功</a></li>',
		'</ul>',
		'<div class="tab-content">',
			'<!-- 第一步 -->',
			'<form class="row tab-pane feed-back-out" id="tab1">',
				'<div class="col-sm-6 col-md-4 form-horizontal">',
					'<div class="form-group">',
						'<label for="shopName" class="col-sm-3 control-label">* 店铺名称</label>',
						'<div class="col-sm-8">',
							'<input type="text" id="shopName" name="shopName"  class="form-control" />',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="cityID">* 所在城市</label>',
						'<div class="col-sm-8">',
							'<select id="cityID" name="cityID" class="form-control">',
							'</select>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="tel">* 店铺电话</label>',
						'<div class="col-sm-8">',
							'<input type="text" id="tel" name="tel" class="form-control" placeholder="固定电话/手机号" />',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="address">* 店铺地址</label>',
						'<div class="col-sm-8">',
							'<input type="text" id="address" name="address" class="form-control" />',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="PCCL">* 人均消费</label>',
						'<div class="col-sm-8">',
							'<input type="text" id="PCCL" name="PCCL" class="form-control" />',
						'</div>',
					'</div>',
				'</div>',
				'<div class="col-sm-6 col-md-4 form-horizontal">',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="operationMode">* 运营模式</label>',
						'<div class="col-sm-8">',
							'<select id="operationMode" name="operationMode" class="form-control">',
								'<option value="0">正餐</option>',
								'<option value="1">快餐</option>',
							'</select>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-xs-12 col-sm-3 control-label" for="openingHours">* 营业时间</label>',
						'<div class="col-xs-8">',
							'<input type="text" id="openingHoursStart" name="openingHoursStart" class="form-control d-ib mr25"  placeholder="08:30" data-default-time="08:30" />',
							'<input type="text" id="openingHoursEnd" name="openingHoursEnd" class="form-control d-ib"  placeholder="21:30" data-default-time="21:30" />',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="areaID">* 地标</label>',
						'<div class="col-sm-8">',
							'<select id="areaID" name="areaID" class="form-control">',
								'<option value="">--请选择--</option>',
							'</select>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="cuisineID1">* 菜系1</label>',
						'<div class="col-sm-8">',
							'<select id="cuisineID1" name="cuisineID1" class="form-control">',
								'<option value="">--请选择--</option>',
							'</select>',
						'</div>',
					'</div>',
					'<div class="form-group">',
						'<label class="col-sm-3 control-label" for="cuisineID2">菜系2</label>',
						'<div class="col-sm-8">',
							'<select id="cuisineID2" name="cuisineID2" class="form-control">',
								'<option value="">--不限--</option>',
							'</select>',
						'</div>',
					'</div>',
				'</div>',
				'<div id="uploadImg" class="col-sm-6 col-md-4">',
					'<span class="t-label">请上传店铺头图，不能大于10m<br />(根据餐厅特色上传环境图或菜品图)</span>',
					'<button class="btn btn-default v-t">上传图片</button><br />',
					'<img class="m-t" src="" alt="餐厅门头图" width="200" height="200" />',
				'</div>',
			'</form>',
			'<!-- 第二步 -->',
			'<div class="tab-pane map-wrap" id="tab2">',
				'<div class="map-search row">',
					'<div class="col-sm-4">',
						'<div class="input-group search-box map-search-box">',
							'<input class="form-control map-keyword" type="text" placeholder="搜索地图" />',
							'<span class="input-group-addon glyphicon glyphicon-search map-search-btn" title="搜索"></span>',
						'</div>',
					'</div>',
					'<div class="col-sm-3 map-help">您可拖动标注获取坐标</div>',
				'</div>',
				'<div class="map_canvas" id="mapCanvas"></div>',
				'<div class="map-result"></div>',
			'</div>',
			'<!-- 第三步 -->',
			'<div class="tab-pane t-c" id="tab3">',
				'<div class="d-ib t-l">',
					'<h4>',
						'<span class="glyphicon glyphicon-ok x-ico-suc"></span>',
						'恭喜！豆捞坊（西直门店）创建成功！',
					'</h4>',
					'完成以下两个步骤，您的店铺就正式开通啦——',
					'<ul>',
						'<li>',
							'<a class="btn btn-success" href="{{pcClientPath}}" target="_blank">下载PC客户端</a>',
							'上传菜品信息',
						'</li>',
						'<li>',
							'<a id="shopSettingLink" class="btn btn-success" href="">设置店铺功能</a>',
						'</li>',
						'<li>网上餐厅正式开通啦！</li>',
					'</ul>',
				'</div>',
			'</div>',
			'</div>',
		'<div class="step-action">',
			'<button type="button" class="btn btn-default prev-step">上一步</button>',
			'<button id="nextStep" type="button" class="btn btn-warning">下一步</button>',
		'</div>',
	'</div>'].join('');
	TplLib.register('tpl_shop_create', tpl_shop_create);
	
	var tpl_shop_info = [
	'<form class="row shop-info feed-back-out read-mode">',
		'<div class="col-sm-6 col-lg-3 form-horizontal">',
			'<div class="form-group">',
				'<label for="shopName" class="col-sm-3 control-label">店铺名称</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{shopName}}</p>',
					'<input type="text" id="shopName" name="shopName"  class="form-control" value="{{shopName}}" />',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="cityID">所在城市</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{cityName}}</p>',
					'<select id="cityID" name="cityID" class="form-control">',
						'<option value="">--请选择--</option>',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="tel">店铺电话</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{tel}}</p>',
					'<input type="text" id="tel" name="tel" class="form-control" placeholder="固定电话/手机号" value="{{tel}}" />',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="address">店铺地址</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{address}}</p>',
					'<input type="text" id="address" name="address" class="form-control" value="{{address}}" />',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="PCCL">人均消费</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{PCCL}}</p>',
					'<input type="text" id="PCCL" name="PCCL" class="form-control" value="{{PCCL}}" />',
				'</div>',
			'</div>',
		'</div>',
		'<div class="col-sm-6 col-lg-3 form-horizontal">',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="operationMode">运营模式</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{operationModeName}}</p>',
					'<select id="operationMode" name="operationMode" class="form-control">',
						'<option value="0">正餐</option>',
						'<option value="1">快餐</option>',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-xs-12 col-sm-3 control-label" for="openingHours">营业时间</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{openingHours}}</p>',
					'<input type="text" id="openingHoursStart" name="openingHoursStart" class="form-control d-ib mr25"  placeholder="08:30" data-default-time="08:30" value="{{openingHoursStart}}" />',
					'<input type="text" id="openingHoursEnd" name="openingHoursEnd" class="form-control d-ib"  placeholder="21:30" data-default-time="21:30"  value="{{openingHoursEnd}}" />',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="areaID">地标</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{areaName}}</p>',
					'<select id="areaID" name="areaID" class="form-control">',
						'<option value="">--请选择--</option>',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label" for="cuisineID1">菜系1</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{cuisineName1}}</p>',
					'<select id="cuisineID1" name="cuisineID1" class="form-control">',
						'<option value="">--请选择--</option>',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-3 control-label no-require" for="cuisineID2">菜系2</label>',
				'<div class="col-sm-9">',
					'<p class="form-control-static">{{cuisineName2}}</p>',
					'<select id="cuisineID2" name="cuisineID2" class="form-control">',
						'<option value="">--不限--</option>',
						'<option value="1">北京小吃</option>',
					'</select>',
				'</div>',
			'</div>',
		'</div>',
		'<div id="uploadImg" class="col-sm-6 col-lg-3 t-r">',
			'<img class="mb-12" src="/src/img/shop_head_img_default.png" alt="餐厅门头图" width="200" height="200" /><br />',
			'<a href="javascript:;">修改门头图</a>',
		'</div>',
		'<div class="col-sm-6 col-lg-3">',
			'<div class="input-group search-box">',
				'<input class="form-control map-keyword" type="text" placeholder="搜索地图" />',
				'<span class="input-group-addon glyphicon glyphicon-search map-search-btn" title="搜索"></span>',
			'</div>',
			'<div class="map_canvas" id="mapCanvas"></div>',
			'<div class="map-result mb-12"></div>',
			'<p class="t-r mb50"><a id="remarkMap" href="javascript:;">重新标记</a></p>',
		'</div>',
		'<div class="step-action">',
			'<button id="editBtn" class="btn btn-warning">修改</button>',
			'<button id="saveBtn" class="btn btn-warning">保存</button>',
		'</div>',
	'</form>'].join('');
	TplLib.register('tpl_shop_info', tpl_shop_info);
	
	var tpl_shop_menu = [
	'<div class="shop-menu">',
		'<div id="foodClassBox" class="panel panel-default food-class"></div>',
		'<form id="foodSearch" class="panel panel-default form-inline food-search">',
			'<div class="form-group">',
				'<select id="takeawayTag" class="form-control">',
					'<option value="">全部菜品</option>',
					'<option value="0">堂食菜品</option>',
					'<option value="1">外卖菜品</option>',
				'</select>',
				'<label><input type="checkbox" id="isSpecialty" value=""/> 招牌</label>',
				'<label><input type="checkbox" id="isRecommend" /> 推荐</label>',
				'<label><input type="checkbox" id="isNew" /> 新品</label>',
				'<label><input type="checkbox" id="isSetFood" /> 套餐</label>',
				'<label><input type="checkbox" id="isDiscount" /> 打折</label>',
				'<label><input type="checkbox" id="foodIsActive" /> 启用菜品</label>',
				'<label><input type="checkbox" id="isHasImage" /> 无图</label>',
				'<span class="input-group search-box">',
					'<input type="text" id="foodName" placeholder="输入菜品名称" class="form-control" />',
					'<span id="btnSearchFood" class="input-group-addon glyphicon glyphicon-search" title="搜索"></span>',
				'</span>',
			'</div>',
		'</form>',
		'<div id="foodSearchInfo">相关结果 (<span></span>)</div>',
		'<table class="tbl-foods">',
			'<thead>',
				'<tr>',
					'<th width="92px">上传图片</th>',
					'<th width="120px">名称</th>',
					'<th>规格及单价 (<em>会员价</em><b>售价</b><span>原价</span>)</th>',
					'<th width="">打折</th>',
					'<th width="">是否外送</th>',
					'<th width="">打包费(元)</th>',
					'<th width="">是否在售</th>',
					'<th width="200px"></th>',
				'</tr>',
			'</thead>',
			'<tbody></tbody>',
		'</table>',
	'</div>'].join('');
	TplLib.register('tpl_shop_menu', tpl_shop_menu);
	
	var tpl_food = [
	'{{#each foods}}',
		'<tr data-id="{{foodID}}" data-cid="{{foodCategoryID}}">',
			'<td><img data-original="{{imgSrc}}" src="" /></td>',
			'<td>{{foodName}}</td>',
			'<td>',
			'{{#each units}}',
				'<p><span>{{unit}}</span><em>{{vipPrice}}</em><b>{{prePrice}}</b><i>{{price}}</i></p>',
			'{{/each}}',
			'</td>',
			'<td class="{{discountIco}}"></td>',
			'<td class="{{takeawayIco}}"></td>',
			'<td><b>{{takeoutPackagingFee}}</b></td>',
			'<td class="{{activeIco}}"></td>',
			'<td><span class="label label-default">修改</span></td>',
		'</tr>',
	'{{/each}}'].join('');
	TplLib.register('tpl_food', tpl_food);
    
    var tpl_edit_food = [
    '<form class="form-food">',
        '<div>',
            '<span>名称</span>',
            '{{foodName}}',
        '</div>',
        '<div>',
            '<span>图标</span>',
            '<label>',
                '<i class="ico-food ico-zhao">招</i>',
                '<input type="radio" name="foodIco" value="isSpecialty" />',
                '招牌菜',
            '</label>',
            '<label>',
                '<i class="ico-food ico-jian">荐</i>',
                '<input type="radio" name="foodIco" value="isRecommend" />',
                '推荐菜',
            '</label>',
            '<label>',
                '<i class="ico-food ico-xin">新</i>',
                '<input type="radio" name="foodIco" value="isNew" />',
                '新菜 &nbsp;',
            '</label>',
            '<label class="active">',
                '<input type="radio" name="foodIco" value="none" checked />',
                '无',
            '</label>',
        '</div>',
        '<div>',
            '<span>辣度</span>',
            '<label>',
                '<img src="{{hotTag1}}" />',
                '<input type="radio" name="hotTag" value="1" />',
                '微辣',
            '</label>',
            '<label>',
                '<img src="{{hotTag2}}" />',
                '<input type="radio" name="hotTag" value="2" />',
                '中辣',
            '</label>',
            '<label>',
                '<img src="{{hotTag3}}" />',
                '<input type="radio" name="hotTag" value="3" />',
                '重辣',
            '</label>',
            '<label class="active">',
                '<input type="radio" name="hotTag" value="0" checked />',
                '无',
            '</label>',
        '</div>',
        '<div>',
            '<span>是否外送</span>',
            '<label>',
                '<input type="radio" name="takeawayTag" value="0" />',
                '不外送',
            '</label>',
            '<label class="active">',
                '<input type="radio" name="takeawayTag" value="1" checked />',
                '可外送',
            '</label>',
            '<label>',
                '<input type="radio" name="takeawayTag" value="2" />',
                '仅外送',
            '</label>',
        '</div>',
        '<div>',
            '<span>是否打折</span>',
            '<label>',
                '<input type="radio" name="isDiscount" value="1" />',
                '打折',
            '</label>',
            '<label class="active">',
                '<input type="radio" name="isDiscount" value="0" checked />',
                '不打折',
            '</label>',
        '</div>',
        '<div>',
            '<span>是否在售</span>',
            '<label class="active">',
                '<input type="radio" name="isActive" value="1" checked />',
                '可售',
            '</label>',
            '<label>',
                '<input type="radio" name="isActive" value="0" />',
                '停售',
            '</label>',
        '</div>',
        '<div class="form-group">',
            '<span>起售份数</span>',
            '<input type="text" name="minOrderCount" class="form-control" value="{{minOrderCount}}" />',
        '</div>',
        '<div class="taste-list">',
            '<span>口味做法</span>',
            '<div>',
                '<input type="text" name="tasteList" class="form-control" placeholder="口味做法用“，”隔开" value="{{tasteList}}" />',
            '</div>',
        '</div>',
    '</form>',
    '<form class="food-pic" enctype="multipart/form-data" method="post" target="iframe1" action="">',
        '<div>',
            '<img src="{{foodPic}}" alt="菜品图片" width="200px" />',
            '<span>上传中 . . .</span>',
        '</div>',
        '<br /><a href="javascript:;">修改图片</a>',
        '<input type="file" name="foodPicFile" />',
        '<iframe id="iframe1" name="iframe1"></iframe>',
    '</form>'].join('');
    TplLib.register('tpl_edit_food', tpl_edit_food);

	var tpl_shop_filter = [
		'<div class="{{type}}">',
			'<span class="label">{{name}}</span>',
			'{{#each items}}',
				'<a class="btn btn-link {{focusClz}}" href="javascript:void(0);" data-{{type}}="{{code}}">',
					'{{name}}',
					'{{#if count}}',
						'<i class="num">({{count}})</i>',
					'{{/if}}',
				'</a>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_filter', tpl_shop_filter);

	var tpl_shop_query = [
		'<div class="shop-query {{clz}}">',
			'<div class="filter">',
				'{{#with shopCity}}',
				'{{> shopCity}}',
				'{{/with}}',
				// '{{> shopArea}}',
			'</div>',
			'<nav class="navbar navbar-default query" role="query">',
				'<div class="container-fluid">',
					'<div class="navbar-header">',
						'{{#with toggle}}',
						'{{> toggle}}',
						'{{/with}}',
						'<a class="navbar-brand" href="javascript:void(0);">查询店铺</a>',
					'</div>',
					'<div class="collapse navbar-collapse" id="shop_query">',
						'<div class="navbar-form navbar-left" role="search">',
							// '<select class="">',
							// 	'{{#each optGrp}}',
							// 		'<optgroup label="{{name}}">',
							// 			'{{#each items}}',
							// 				'<option value="{{code}}">{{name}}</option>',
							// 			'{{/each}}',
							// 		'</optgroup>',
							// 	'{{/each}}',
							// '</select>',
							// '<div class="input-group">',
							// 	'<input type="text" class="form-control" autocomplete="off" />',
							// 	'<span class="input-group-btn">',
							// 		'<button class="btn btn-default">查询</button>',
							// 	'</span>',
							// '</div>',
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
							'<button class="btn btn-default query-btn">查询</button>',
							
						'</div>',
						'{{#if needShopCreate}}',
							'<button class="btn btn-warning create-shop pull-right" style="margin-top:8px;">创建店铺</button>',
						'{{/if}}',
					'</div>',
				'</div>',
			'<nav>',
		'</div>',

		/*<div class="shop-query">',
			'<div class="filter">',
				'<div class="city">',
					'<span class="label">城市：</span>',
					'<a class="btn btn-link disabled">全部</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
					'<a class="btn btn-link ">北京<i class="num">(10)</i></a>',
					'<a class="btn btn-link">上海</a>',
					'<a class="btn btn-link">广州</a>',
					'<a class="btn btn-link">重庆</a>',
					'<a class="btn btn-link">深圳</a>',
					'<a class="btn btn-link">柳州</a>',
					'<a class="btn btn-link">天津</a>',
				'</div>',
				'<div class="area">',
					'<span class="label">区域：</span>',
					'<a class="btn btn-link disabled">全部</a>',
					'<a class="btn btn-link">海淀</a>',
					'<a class="btn btn-link">朝阳</a>',
					'<a class="btn btn-link">大兴</a>',
					'<a class="btn btn-link">回龙观</a>',
					'<a class="btn btn-link">昌平</a>',
					'<a class="btn btn-link">龙泽</a>',
					'<a class="btn btn-link">顺义</a>',
				'</div>',
			'</div>',
			'<nav class="navbar navbar-default query" role="navigation">',
				'<div class="container-fluid">',
					'<div class="navbar-header">',
						'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#shop_query">',
							'<span class="sr-only">Toggle navigation</span>',
							'<span class="icon-bar"></span>',
							'<span class="icon-bar"></span>',
							'<span class="icon-bar"></span>',
						'</button>',
						'<a class="navbar-brand" href="javascript:void(0);">查询店铺</a>',
					'</div>',
					'<div class="collapse navbar-collapse" id="shop_query">',
						'<div class="navbar-form navbar-left" role="search">',
							'<div class="input-group">',
								'<input type="text" class="form-control" autocomplete="off" />',
								'<span class="input-group-btn">',
									'<button class="btn btn-default">查询</button>',
								'</span>',
							'</div>',
						'</div>',
						'<button class="btn btn-warning create-shop pull-right" style="margin-top:8px;">创建店铺</button>',
					'</div>',
				'</div>',
			'</nav>',
		'</div>*/
	].join('');
	TplLib.register('tpl_shop_query', tpl_shop_query);

	var tpl_shop_tags = [
		'<div class="tags">',
			'{{#each tags}}',
				'<span class="label {{clz}}" title="{{tag}}">{{tag}}</span>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_tags', tpl_shop_tags);

	var tpl_shop_list_item = [
		'<div class="shop-list-item col-xs-12 {{clz}} ">',
			'<div class="row shop-base-info">',
				'<div class="col-xs-6 col-sm-3 col-md-2">',
					'<h4>{{shopName}}</h4>',
				'</div>',
				'<div class="hidden-xs col-sm-4 col-md-7 ">',
					'<div class="account {{hideAccount}}">',
						'<label class="account-label">结算账户：</label>',
						'<span class="account-name">{{settleName}}</span>',
					'</div>',
				'</div>',
				'<div class="col-xs-6 col-sm-5 col-md-3">',
					'<div class="switcher-wrapper pull-right">',
						'<label class="">店铺当前状态：</label>',
						'<input type="checkbox" name="{{switcherName}}" data-shop="{{shopID}}" {{shopOpen}} />',
					'</div>',
				'</div>',
			'</div>',
			'{{#each business}}',
			'<div class="row shop-business">',
				'<div class="col-xs-6 col-sm-3 col-md-2">',
					'<h4>',
						'<span class="{{icon}}"></span>',
						'{{label}}',
					'</h4>',
				'</div>',
				'<div class="col-xs-6 col-sm-2 col-md-2">',
					'<div class="switcher-wrapper">',
						'<input type="checkbox" name="{{switcherName}}" data-shop="{{shopID}}" data-business="{{type}}" data-business-id="{{id}}" {{open}} />',
					'</div>',
				'</div>',
				'<div class="col-xs-12 col-sm-6 col-md-7">',
					'<p>{{desc}}</p>',
				'</div>',
				'<div class="col-xs-12 col-sm-1 col-md-1">',
					'<button type="button" class="btn btn-default pull-right" name="business_edit" data-shop="{{shopID}}" data-business="{{type}}"  data-business-id="{{id}}">修改</button>',
				'</div>',
			'</div>',
			'{{/each}}',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_list_item', tpl_shop_list_item);

	var tpl_shop_card = [
		'<div class="panel panel-default ix-card shop-card {{clz}}" >',
			'<div class="panel-heading ix-card-header">',
				'<h4 class="panel-title">{{name}}</h4>',
			'</div>',
			'<div class="panel-body ix-card-body">',
				'<div class="media">',
					'<a class="pull-left" href="javascript:void(0);">',
						'<img class="media-object" alt="{{name}}" src="{{img}}" />',
					'</a>',
					'<div class="media-body">',
						'{{> shopTag}}',
						'<address title="{{address}}">{{slugAddr}}</address>',
						'<div class="phone">{{tel}}</div>',
					'</div>',
					'<div class="btns pull-right">',
						'<a href="javascript:void(0);" class="btn btn-default shop-info" data-href="{{infoHref}}">',
							'修改店铺信息',
						'</a>',
						'<a href="javascript:void(0);" class="btn btn-default shop-menu" data-href="{{menuHref}}">',
							'菜谱管理',
						'</a>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="panel-footer ix-card-footer">',
				'<label>店铺当前状态：</label>',
				'<input type="checkbox" name="switcher" data-shop="{{id}}" class="shop-switch" {{checked}} />',
				'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_card', tpl_shop_card);

	var tpl_shop_list = [
		'{{#with shopCard}}',
			'{{#each list}}',
			'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">',
				'{{> shopCard}}',
			'</div>',
			'{{/each}}',
		'{{/with}}',
		'{{#with shopItem}}',
			'{{#each list}}',
				'{{> shopItem}}',
			'{{/each}}',
		'{{/with}}',
		'{{#with shopTable}}',
			'{{> shopTable}}',
		'{{/with}}'
	].join('');
	TplLib.register('tpl_shop_list', tpl_shop_list);

	var tpl_shop_table = [
		'<div class="col-xs-12 table-responsive">',
			'<table class="table">',
				'<thead>',
					'<tr>',
						'<th>城市</th>',
						'<th>店铺ID</th>',
						'<th>店铺名称</th>',
					'</tr>',
				'</thead>',
				'{{#if isEmpty}}',
					'<tbody>',
						'<tr>',
							'<td colspan="{{colCount}}"><p class="text-center">无结果</p></td>',
						'</tr>',
					'</tbody>',
				'{{else}}',
					'<tbody>',
						'{{#each rows}}',
							'<tr class="{{clz}}">',
								'<td class="">',
									'{{city}}',
								'</td>',
								'<td class="">',
									'{{id}}',
								'</td>',
								'<td class="">',
									'{{name}}',
								'</td>',
							'</tr>',
						'{{/each}}',
					'</tbody>',
				'{{/if}}',
			'</table>',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_table', tpl_shop_table);

	var tpl_shop_list_layout = [
		'<div class="shop-list">',
			'<div class="row shop-list-body">',
			'</div>',
			'<div class="shop-list-footer clearfix">',
				'<div class="page-selection pull-right"></div>',
			'</div>',
		'</div>'
	].join('');
	TplLib.register('tpl_shop_list_layout', tpl_shop_list_layout);

	var tpl_shop_service_form_layout = [
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
				'{{#checkFormElementType type type="hidden"}}',
					'<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" />',
				'{{/checkFormElementType}}',
			'{{/each}}',
		'</form>'
	].join('');
	TplLib.register('tpl_shop_service_form_layout', tpl_shop_service_form_layout);

	var tpl_shop_modal_btns = [
		'{{#each btns}}',
			'<button type="button" class="btn {{clz}}" name="{{name}}">{{label}}</button>',
		'{{/each}}'
	].join('');
	TplLib.register('tpl_shop_modal_btns', tpl_shop_modal_btns);

	// 闪吃业务描述
	var tpl_shop_justeat_desc = [
		'{{{servicePeriods}}}',
		'{{{holidayFlag}}}',
		'{{{minAmount}}}',
		'{{{advanceTime}}}',
		'{{{noticeTime}}}',
		'{{{reserveTableTime}}}',
		'{{{reserveTableDesc}}}'
	].join('');
	TplLib.register('tpl_shop_justeat_desc', tpl_shop_justeat_desc);

	// 店内自助业务描述
	var tpl_shop_spotorder_desc = [

		'{{#if isDinner}}',
			// 正餐
			'{{{supportCommitToSoftware}}}',
			// '{{{payMethodAtShop}}}',
			'{{{checkSpotOrder}}}',
			'{{{payBeforeCommit}}}',
		'{{else}}',
			// 快餐
			'{{{supportCommitToSoftware}}}',
			'{{{fetchFoodMode}}}',
		'{{/if}}'
	].join('');
	TplLib.register('tpl_shop_spotorder_desc', tpl_shop_spotorder_desc);
})(jQuery, window);