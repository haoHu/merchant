module.exports = function (grunt) {
	// 任务配置
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		// 预编译Less文件
		less : {
			options : {
				report : 'min'
			},
			compile : {
				files : {
					"<%= pkg.destPath.cssPath %>/core.css" : "<%= pkg.srcPath.cssPath %>/core.less"
				}
			}
		},
		// 压缩CSS文件
		cssmin : {
			options : {
				report : "gzip",
				banner : "/*Hualala Merchant Style File*/"
			},
			minify : {
				expand : true,
				cwd : "<%= pkg.destPath.cssPath %>/",
				src : ["*.css", "!*.min.css"],
				dest : "<%= pkg.destPath.cssPath %>/",
				ext : ".min.css"
			},
			combine : {
				files : {
					"<%= pkg.destPath.cssPath %>/bootstrap.min.css" : ["<%= pkg.srcPath.jsPath %>/dep/bootstrap/css/bootstrap.css"],
					"<%= pkg.destPath.cssPath %>/deplib.min.css" : ["<%= pkg.srcPath.jsPath %>/datepicker/css/datetimepicker.css", "<%= pkg.srcPath.jsPath %>/timepicker/css/timepicker.css", "<%= pkg.srcPath.jsPath %>/validator/css/validator.css"]
				}
			}
		},
		// JS语法校验
		jshint : {
			files : ["Gruntfile.js", "<%= pkg.srcPath.jsPath %>/**/*.js", "<%= pkg.protoPath.distribPath %>/api/*.js"],
			options : {
				jshintrc : "jshint.jshintrc",
				globals : {
					jQuery : true,
					console : true,
					module : true,
					document : true
				}
			}
		},
		// 合并脚本文件
		concat : {
			options : {
				separator : ";",
				banner : "/** \n"
					+ " * -------------------------------------------------\n"
					+ " * Copyright (c) 2014, All rights reserved. \n" 
					+ " * <%= pkg.name %>\n"
					+ " * \n"
					+ " * @version : <%= pkg.version %>\n"
					+ " * @author : <%= pkg.author %>\n"
					+ " * @description : <%= pkg.description %> \n"
					+ " * -------------------------------------------------\n"
					+ " */ \n\n"
			},
			respond : {
				src : ["<%= pkg.srcPath.jsPath %>/dep/Respond/respond.matchmedia.addListener.src.js"],
				dest : "<%= pkg.destPath.jsPath %>/dep/respond.matchmedia.addListener.js",
				nonull : true
			},
			jquery : {
				src : ["<%= pkg.srcPath.jsPath %>/dep/jquery/jquery-1.11.1.js"],
				dest : "<%= pkg.destPath.jsPath %>/dep/jquery.js",
				nonull : true
			},
			bootstrap : {
				src : ["<%= pkg.srcPath.jsPath %>/dep/bootstrap/js/bootstrap.js"],
				dest : "<%= pkg.destPath.jsPath %>/dep/bootstrap.js",
				nonull : true
			},
			deplib : {
				src : [
					"<%= pkg.srcPath.jsPath %>/dep/underscore/underscore.js",
					"<%= pkg.srcPath.jsPath %>/dep/handlebars/handlebars-v1.3.0.js",
					"<%= pkg.srcPath.jsPath %>/datepicker/datetimepicker.js",
					"<%= pkg.srcPath.jsPath %>/datepicker/local/datetimepicker.zh-CN.js",
					"<%= pkg.srcPath.jsPath %>/timepicker/timepicker.js",
					"<%= pkg.srcPath.jsPath %>/validator/validator.js",
					"<%= pkg.srcPath.jsPath %>/validator/local/validator.zh-CN.js"
				],
				dest : "<%= pkg.destPath.jsPath %>/dep/deplib.js",
				nonull : true
			},
			common : {
				src : [
					"<%= pkg.srcPath.jsPath %>/common/stapes.js",
					"<%= pkg.srcPath.jsPath %>/common/ixutils.js",
					"<%= pkg.srcPath.jsPath %>/common/commonFn.js",
					"<%= pkg.srcPath.jsPath %>/common/typedef.js",
					"<%= pkg.srcPath.jsPath %>/common/datatype.js",
					"<%= pkg.srcPath.jsPath %>/common/router.js",
					"<%= pkg.srcPath.jsPath %>/pymatch/pymatch.js",
					"<%= pkg.srcPath.jsPath %>/common/matcher.js"
				],
				dest : "<%= pkg.destPath.jsPath %>/common.js",
				nonull : true
			},
			api : {
				src : [
					"<%= pkg.protoPath.distribPath %>/api/global-const.js",
					"<%= pkg.protoPath.distribPath %>/api/global-url.js",
					"<%= pkg.protoPath.distribPath %>/api/global-callserver-common.js",
				],
				dest : "<%= pkg.destPath.jsPath %>/api.js",
				nonull : true
			},
			tpl : {
				src : [
					"<%= pkg.srcPath.jsPath %>/tpl/tpl.lib.js",
					"<%= pkg.srcPath.jsPath %>/tpl/tpl.shop.js",
					"<%= pkg.srcPath.jsPath %>/tpl/tpl.account.js",
					"<%= pkg.srcPath.jsPath %>/tpl/tpl.order.js",
				],
				dest : "<%= pkg.destPath.jsPath %>/tpl.js",
				nonull : true
			},
			ui : {
				src : [
					"<%= pkg.srcPath.jsPath %>/ui/ixui.js",
					// "<%= pkg.srcPath.jsPath %>/ui/modal.js",
					"<%= pkg.srcPath.jsPath %>/ui/pager.js",
					"<%= pkg.srcPath.jsPath %>/ui/switch.js",
					"<%= pkg.srcPath.jsPath %>/ui/wizard.js",
					"<%= pkg.srcPath.jsPath %>/ui/chosen.jquery.js",
					"<%= pkg.srcPath.jsPath %>/ui/wizard.js"
				],
				dest : "<%= pkg.destPath.jsPath %>/ui.js",
				nonull : true
			},
			pages : {
				src : [
					// Shop Moudle
					"<%= pkg.srcPath.jsPath %>/entry/entry.init.js",

					"<%= pkg.srcPath.jsPath %>/shop/shop.query.model.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.query.view.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.query.controler.js",

					"<%= pkg.srcPath.jsPath %>/shop/shop.list.model.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.list.view.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.list.controler.js",

					"<%= pkg.srcPath.jsPath %>/shop/shop.create.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.info.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.menu.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.map.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.mgr.js",

					"<%= pkg.srcPath.jsPath %>/shop/shop.init.js",

					// Setting Moudle
					"<%= pkg.srcPath.jsPath %>/setting/setting.mgr.js",
					"<%= pkg.srcPath.jsPath %>/setting/setting.init.js",

					// Account Moudle
					"<%= pkg.srcPath.jsPath %>/account/account.list.model.js",
					"<%= pkg.srcPath.jsPath %>/account/account.list.view.js",
					"<%= pkg.srcPath.jsPath %>/account/account.list.controler.js",

					"<%= pkg.srcPath.jsPath %>/account/account.mgr.controler.js",
					"<%= pkg.srcPath.jsPath %>/account/account.mgr.view.js",

					"<%= pkg.srcPath.jsPath %>/account/account.init.js",

					// Order Moudle
					"<%= pkg.srcPath.jsPath %>/order/order.list.model.js",
					"<%= pkg.srcPath.jsPath %>/order/order.list.view.js",
					"<%= pkg.srcPath.jsPath %>/order/order.list.controler.js",
					"<%= pkg.srcPath.jsPath %>/order/order.query.model.js",
					"<%= pkg.srcPath.jsPath %>/order/order.query.view.js",
					"<%= pkg.srcPath.jsPath %>/order/order.query.controler.js",
					"<%= pkg.srcPath.jsPath %>/order/order.init.js",

					// Merchant init
					"<%= pkg.srcPath.jsPath %>/common/merchant.layout.js",
					"<%= pkg.srcPath.jsPath %>/common/merchant.init.js",
					"<%= pkg.srcPath.jsPath %>/common/merchant.route.js",
				],
				dest : "<%= pkg.destPath.jsPath %>/pages.js",
				nonull : true
			}
		},
		// 压缩脚本文件
		uglify : {
			options : {
				banner : '/*! <%=pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n',
				report : 'gzip'
			},
			development : {
				options : {
					sourceMap : true,
					sourceMapIncludeSources : true
				},
				files : {
					// "<%= pkg.destPath.jsPath %>/dep/html5shiv.min.js" : [
					// 	"<%= pkg.destPath.jsPath %>/dep/html5shiv.js"
					// ],
					"<%= pkg.destPath.jsPath %>/dep/respond.matchmedia.addListener.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/respond.matchmedia.addListener.js"
					],
					"<%= pkg.destPath.jsPath %>/dep/jquery.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/jquery.js"
					],
					"<%= pkg.destPath.jsPath %>/dep/bootstrap.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/bootstrap.js"
					],
					"<%= pkg.destPath.jsPath %>/dep/deplib.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/deplib.js"
					],
					"<%= pkg.destPath.jsPath %>/common.min.js" : [
						"<%= pkg.destPath.jsPath %>/common.js"
					],
					"<%= pkg.destPath.jsPath %>/api.min.js" : [
						"<%= pkg.destPath.jsPath %>/api.js"
					],
					"<%= pkg.destPath.jsPath %>/tpl.min.js" : [
						"<%= pkg.destPath.jsPath %>/tpl.js"
					],
					"<%= pkg.destPath.jsPath %>/ui.min.js" : [
						"<%= pkg.destPath.jsPath %>/ui.js"
					],
					"<%= pkg.destPath.jsPath %>/pages.min.js" : [
						"<%= pkg.destPath.jsPath %>/pages.js"
					],
				}
			},
			production : {
				options : {
					beautify : {
						width : 80,
						beautify : true
					}
				},
				files : {
					// "<%= pkg.destPath.jsPath %>/dep/html5shiv.min.js" : [
					// 	"<%= pkg.srcPath.jsPath %>/dep/html5shiv.js"
					// ],
					"<%= pkg.destPath.jsPath %>/dep/respond.matchmedia.addListener.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/respond.matchmedia.addListener.js"
					],
					"<%= pkg.destPath.jsPath %>/dep/jquery.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/jquery.js"
					],
					"<%= pkg.destPath.jsPath %>/dep/bootstrap.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/bootstrap.js"
					],
					"<%= pkg.destPath.jsPath %>/dep/deplib.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/deplib.js"
					],
					"<%= pkg.destPath.jsPath %>/common.min.js" : [
						"<%= pkg.destPath.jsPath %>/common.js"
					],
					"<%= pkg.destPath.jsPath %>/api.min.js" : [
						"<%= pkg.destPath.jsPath %>/api.js"
					],
					"<%= pkg.destPath.jsPath %>/tpl.min.js" : [
						"<%= pkg.destPath.jsPath %>/tpl.js"
					],
					"<%= pkg.destPath.jsPath %>/ui.min.js" : [
						"<%= pkg.destPath.jsPath %>/ui.js"
					],
					"<%= pkg.destPath.jsPath %>/pages.min.js" : [
						"<%= pkg.destPath.jsPath %>/pages.js"
					],
				}
			}
		},
		// 拷贝文件
		copy : {
			// 拷贝图片资源，字体文件资源, html文件以及测试用文件到destrib目录下
			test : {
				files : [
					{
						expand : true,
						cwd : "<%= pkg.srcPath.imgPath %>/",
						src : ["**"],
						dest : "<%= pkg.destPath.imgPath %>/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.fontPath %>/",
						src : ["*.*"],
						dest : "<%= pkg.destPath.fontPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.jsPath %>/dep/bootstrap/fonts/",
						src : ["*.*"],
						dest : "<%= pkg.destPath.path %>/fonts/",
						filter : "isFile"
					},
					// {
					// 	expand : true,
					// 	cwd : "<%= pkg.protoPath.distribPath %>/",
					// 	src : ['*.*'],
					// 	dest : "<%= pkg.destPath.protoPath %>/",
					// 	filter : 'isFile'
					// },
					{
						expand : true,
						cwd : "<%= pkg.srcPath.swfPath %>/",
						src : ["**"],
						dest : "<%= pkg.destPath.swfPath %>/",
						filter : 'isFile'
					}
				]
			},
			// 将合并和压缩的css，js文件，图片，字体文件拷贝到后端工程的asset下,供开发调试使用
			development : {
				files : [
					{
						expand : true,
						cwd : "<%= pkg.destPath.jsPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.jsPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.destPath.cssPath %>/",
						src : ["*.css"],
						dest : "<%= pkg.distribPath.cssPath %>/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.fontPath %>/",
						src : ["*.*"],
						dest : "<%= pkg.distribPath.fontPath %>/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.jsPath %>/dep/bootstrap/fonts/",
						src : ["*.*"],
						dest : "<%= pkg.distribPath.path %>/fonts/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.swfPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.swfPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.imgPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.imgPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.protoPath.distribPath %>",
						src : ["*.htm"],
						dest : "<%= pkg.distribPath.pagePath %>/",
						filter : 'isFile'
					}
				]
			},
			// 将合并和压缩的css，js文件，图片，字体文件拷贝到后端工程的asset下,供发布线上使用
			production : {
				files : [
					{
						expand : true,
						cwd : "<%= pkg.destPath.jsPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.jsPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.destPath.cssPath %>/",
						src : ["*.css"],
						dest : "<%= pkg.distribPath.cssPath %>/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.fontsPath %>/",
						src : ["*.*"],
						dest : "<%= pkg.distribPath.fontsPath %>/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.jsPath %>/dep/bootstrap/fonts/",
						src : ["*.*"],
						dest : "<%= pkg.distribPath.path %>/fonts/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.swfPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.swfPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.imgPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.imgPath %>/",
						filter : 'isFile'
					}
				]
			}
		}
	});

	// 插件加载声明
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");

	// 定义任务组合
	grunt.registerTask("test", ["less", "cssmin", "jshint", "concat", "copy:test"]);
	grunt.registerTask("deploy.development", ["less", "cssmin", "jshint", "concat", "uglify:development", "copy:development"]);
	grunt.registerTask("deploy.production", ["less", "cssmin", "jshint", "concat", "uglify:production", "copy:production"]);



};