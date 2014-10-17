<%@ page language="java" contentType="text/html; charset=UTF-8"%><%@taglib prefix="s" uri="/struts-tags" %><!DOCTYPE html>
<html lang="zh-cn">
<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="renderer" content="webkit">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>哗啦啦商户中心</title>

		<link rel="shortcut icon" href="./asset/img/logos/favicon.png" type="image/x-icon"/>
		<link rel="apple-touch-icon-precomposed" media="screen and (resolution: 163dpi)" href="./asset/img/logos/ios/57px.png" />
		<link rel="apple-touch-icon-precomposed" media="screen and (resolution: 132dpi)" href="./asset/img/logos/ios/72px.png" />
		<link rel="apple-touch-icon-precomposed" media="screen and (resolution: 326dpi)" href="./asset/img/ios/114px.png" />	
		

		<link href="./asset/css/bootstrap.min.css?t=7bbbaf77" rel="stylesheet" />
		<!-- datetimepicker.css, timepicker.css, validator.css -->
		<link href="./asset/css/deplib.min.css?t=1d9bd7c3" rel="stylesheet" />
		
		<link href="./asset/css/core.min.css?t=8badd652" rel="stylesheet" />
		<!--[if lt IE 9]>
			<script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="./asset/js/dep/respond.matchmedia.addListener.min.js?t=5e00353b"></script>
		<![endif]-->
	</head>
	<body >
		<s:if test='@com.dld.platform.base.common.AppEnv@getInstance().getSystemProp("ENV_JSMIN").equals("true")'>
			<script src="./asset/js/dep/jquery.min.js?t=bdbae44b"></script>
			<script src="./asset/js/dep/bootstrap.min.js?t=eb0d9bb4"></script>
	
			<!-- Include dependance file :underscore.js, handlebars.js datetimepicker.js, datetimepicker.zh-Cn.js, timepicker.js, validator.js, validator.zh-CN.js -->
			<script src="./asset/js/dep/deplib.min.js?t=ae26daaf"></script>
			<!-- Include Common Lib Files for Hualala Shop Site -->
			<script src="./asset/js/common.min.js?t=1ecfb53c"></script>
			<!-- 百度地图API -->
			<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
			<!-- Include Global Const and call server api -->
			<script src="./asset/js/api.min.js?t=62278821"></script>
			<!-- Include Template File -->
			<script src="./asset/js/tpl.min.js?t=9e192bca"></script>
			<!-- Include UI Lib -->
			<script src="./asset/js/ui.min.js?t=b753f65e"></script>
			<!-- Include Page : entry.init.js, shop.query.model.js, shop.query.view.js, shop.query.controler.js, shop.list.model.js, shop.list.view.js, shop.list.controler.js, shop.init.js, setting.mgr.js, setting.init.js, merchant.layout.js, merchant.init.js, merchant.route.js -->
			<script src="./asset/js/pages.min.js?t=442d9f2e"></script>
		</s:if>
		<s:else>
			<script src="./asset/js/dep/jquery.js?t=0180778f"></script>
			<script src="./asset/js/dep/bootstrap.js?t=f89b61a7"></script>
	
			<!-- Include dependance file :underscore.js, handlebars.js datetimepicker.js, datetimepicker.zh-Cn.js, timepicker.js, validator.js, validator.zh-CN.js -->
			<script src="./asset/js/dep/deplib.js?t=aa249f72"></script>
			<!-- Include Common Lib Files for Hualala Shop Site -->
			<script src="./asset/js/common.js?t=8c061ce7"></script>
			<!-- 百度地图API -->
			<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
			<!-- Include Global Const and call server api -->
			<script src="./asset/js/api.js?t=653e5cac"></script>
			<!-- Include Template File -->
			<script src="./asset/js/tpl.js?t=b5fcde74"></script>
			<!-- Include UI Lib -->
			<script src="./asset/js/ui.js?t=2d1d9515"></script>
			<!-- Include Page : entry.init.js, shop.query.model.js, shop.query.view.js, shop.query.controler.js, shop.list.model.js, shop.list.view.js, shop.list.controler.js, shop.init.js, setting.mgr.js, setting.init.js, merchant.layout.js, merchant.init.js, merchant.route.js -->
			<script src="./asset/js/pages.js?t=46828e71"></script>
		</s:else>
		
		<script type="text/javascript">
			$(document).ready(function () {
				Hualala.init();
			});
		</script>
	</body>
</html>