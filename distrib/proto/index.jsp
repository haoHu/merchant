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
		

		<link href="./asset/css/bootstrap.min.css?t=66a4cda9" rel="stylesheet" />
		<!-- datetimepicker.css, timepicker.css, validator.css -->
		<link href="./asset/css/deplib.min.css?t=0bd5b796" rel="stylesheet" />
		
		<link href="./asset/css/core.min.css?t=cf3c9dac" rel="stylesheet" />
		<!--[if lt IE 9]>
			<script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="./asset/js/dep/respond.matchmedia.addListener.min.js?t=047b456d"></script>
		<![endif]-->
	</head>
	<body >
		<s:if test='@com.dld.platform.base.common.AppEnv@getInstance().getSystemProp("ENV_JSMIN").equals("true")'>
			<script src="./asset/js/dep/jquery.min.js?t=7cbd71fe"></script>
			<script src="./asset/js/dep/bootstrap.min.js?t=f05b5235"></script>
	
			<!-- Include dependance file :underscore.js, handlebars.js datetimepicker.js, datetimepicker.zh-Cn.js, timepicker.js, validator.js, validator.zh-CN.js -->
			<script src="./asset/js/dep/deplib.min.js?t=adb72ca9"></script>
			<!-- Include Common Lib Files for Hualala Shop Site -->
			<script src="./asset/js/common.min.js?t=09f5b5ec"></script>
			<!-- 百度地图API -->
			<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
			<!-- Include Global Const and call server api -->
			<script src="./asset/js/api.min.js?t=c2c84a83"></script>
			<!-- Include Template File -->
			<script src="./asset/js/tpl.min.js?t=83711207"></script>
			<!-- Include UI Lib -->
			<script src="./asset/js/ui.min.js?t=b546b489"></script>
			<!-- Include Page : entry.init.js, shop.query.model.js, shop.query.view.js, shop.query.controler.js, shop.list.model.js, shop.list.view.js, shop.list.controler.js, shop.init.js, setting.mgr.js, setting.init.js, merchant.layout.js, merchant.init.js, merchant.route.js -->
			<script src="./asset/js/pages.min.js?t=ce6e2997"></script>
		</s:if>
		<s:else>
			<script src="./asset/js/dep/jquery.js?t=0180778f"></script>
			<script src="./asset/js/dep/bootstrap.js?t=28f230bc"></script>
	
			<!-- Include dependance file :underscore.js, handlebars.js datetimepicker.js, datetimepicker.zh-Cn.js, timepicker.js, validator.js, validator.zh-CN.js -->
			<script src="./asset/js/dep/deplib.js?t=70f5b63c"></script>
			<!-- Include Common Lib Files for Hualala Shop Site -->
			<script src="./asset/js/common.js?t=094c1598"></script>
			<!-- 百度地图API -->
			<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
			<!-- Include Global Const and call server api -->
			<script src="./asset/js/api.js?t=37819515"></script>
			<!-- Include Template File -->
			<script src="./asset/js/tpl.js?t=9658eed0"></script>
			<!-- Include UI Lib -->
			<script src="./asset/js/ui.js?t=7f4b1bed"></script>
			<!-- Include Page : entry.init.js, shop.query.model.js, shop.query.view.js, shop.query.controler.js, shop.list.model.js, shop.list.view.js, shop.list.controler.js, shop.init.js, setting.mgr.js, setting.init.js, merchant.layout.js, merchant.init.js, merchant.route.js -->
			<script src="./asset/js/pages.js?t=387f9a17"></script>
		</s:else>
		
		<script type="text/javascript">
			$(document).ready(function () {
				Hualala.init();
			});
		</script>
	</body>
</html>