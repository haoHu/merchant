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
					"<%= pkg.destPath.cssPath %>/deplib.min.css" : ["<%= pkg.srcPath.jsPath %>/datepicker/css/datetimepicker.css", "<%= pkg.srcPath.jsPath %>/timepicker/css/timepicker.css", "<%= pkg.srcPath.jsPath %>/validator/css/validator.css","<%= pkg.srcPath.jsPath %>/dep/umeditor/themes/default/css/umeditor.css"]
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
			echarts : {
				src : ["<%= pkg.srcPath.jsPath %>/dep/echarts/echarts-plain.js"],
				dest : "<%= pkg.destPath.jsPath %>/dep/echarts-plain.js",
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
					"<%= pkg.srcPath.jsPath %>/validator/local/validator.zh-CN.js",
                    "<%= pkg.srcPath.jsPath %>/dep/jquery/jquery.form.js",
                    "<%= pkg.srcPath.jsPath %>/dep/umeditor/umeditor.config.js",
                    "<%= pkg.srcPath.jsPath %>/dep/umeditor/umeditor.js",
                    "<%= pkg.srcPath.jsPath %>/dep/umeditor/lang/zh-cn/zh-cn.js"
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
					"<%= pkg.srcPath.jsPath %>/tpl/tpl.user.js",
					"<%= pkg.srcPath.jsPath %>/tpl/tpl.crm.js",
                    "<%= pkg.srcPath.jsPath %>/tpl/tpl.weixin.js"
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

					"<%= pkg.srcPath.jsPath %>/shop/shop.map.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.create.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.info.js",
					"<%= pkg.srcPath.jsPath %>/shop/shop.menu.js",
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

					// User Moudle
					
					"<%= pkg.srcPath.jsPath %>/user/user.mgr.view.js",
					"<%= pkg.srcPath.jsPath %>/user/role.bind.js",
					"<%= pkg.srcPath.jsPath %>/user/user.list.model.js",
					"<%= pkg.srcPath.jsPath %>/user/user.list.view.js",
					"<%= pkg.srcPath.jsPath %>/user/user.list.controler.js",
					"<%= pkg.srcPath.jsPath %>/user/user.init.js",

					// CRM Moudle
					"<%= pkg.srcPath.jsPath %>/crm/crm.member.model.js",
					"<%= pkg.srcPath.jsPath %>/crm/crm.member.view.js",
					"<%= pkg.srcPath.jsPath %>/crm/crm.member.controler.js",

					"<%= pkg.srcPath.jsPath %>/crm/crm.params.js",
                    "<%= pkg.srcPath.jsPath %>/crm/crm.card.levels.js",
					"<%= pkg.srcPath.jsPath %>/crm/crm.recharge.js",
					"<%= pkg.srcPath.jsPath %>/crm/crm.query.js",
					"<%= pkg.srcPath.jsPath %>/crm/crm.detail.js",
                    "<%= pkg.srcPath.jsPath %>/crm/crm.preferential.js",
                    "<%= pkg.srcPath.jsPath %>/crm/crm.report.js",

					"<%= pkg.srcPath.jsPath %>/crm/crm.init.js",
                    
                    
                    "<%= pkg.srcPath.jsPath %>/weixin/reply.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/subscribe.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/menu.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/qrcode.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/advertorial.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/content.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/text.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/typedef.js",
                    "<%= pkg.srcPath.jsPath %>/weixin/weixin.init.js",

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
					"<%= pkg.destPath.jsPath %>/dep/echarts-plain.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/echarts-plain.js"
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
					sourceMap : false,
					sourceMapIncludeSources : false
					// beautify : {
					// 	width : 80,
					// 	beautify : true
					// }
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
					"<%= pkg.destPath.jsPath %>/dep/echarts-plain.min.js" : [
						"<%= pkg.destPath.jsPath %>/dep/echarts-plain.js"
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
		// 将合并压缩好的js文件拷贝到后端工程asset目录下
		// 将压缩好的css文件拷贝到后端工程asset目录下
		// 将所有图片等静态资源拷贝到后端工程asset目录下
		copy : {
			material2MD5 : {
				// font,swf,img
				files : [
					{
						expand : true,
						cwd : "<%= pkg.srcPath.fontPath %>/",
						src : ["*.*"],
						dest : "<%= pkg.destPath.fontPath %>/",
						filter : "isFile"

					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.swfPath %>/",
						src : ["**"],
						dest : "<%= pkg.destPath.swfPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.imgPath %>/",
						src : ["**"],
						dest : "<%= pkg.destPath.imgPath %>/",
						filter : 'isFile'
					},
					{
						expand : true,
						cwd : "<%= pkg.srcPath.jsPath %>/dep/bootstrap/fonts/",
						src : ["*.*"],
						dest : "<%= pkg.destPath.path %>/fonts/",
						filter : "isFile"
					},
					{
						expand : true,
						cwd : "<%= pkg.protoPath.distribPath %>/",
						src : ["*.jsp"],
						dest : "<%= pkg.destPath.protoPath %>/",
						filter : "isFile"
					}
				]
			},
			material : {
				// font,swf,img
				files : [
					{
						expand : true,
						cwd : "<%= pkg.srcPath.fontPath %>/",
						src : ["*.*"],
						dest : "<%= pkg.distribPath.fontPath %>/",
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
						cwd : "<%= pkg.srcPath.jsPath %>/dep/bootstrap/fonts/",
						src : ["*.*"],
						dest : "<%= pkg.distribPath.path %>/fonts/",
						filter : "isFile"
					}
				]
			},
			js : {
				// js
				files : [
					{
						expand : true,
						cwd : "<%= pkg.destPath.jsPath %>/",
						src : ["**"],
						dest : "<%= pkg.distribPath.jsPath %>/",
						filter : 'isFile'
					}
				]
			},
			css : {
				// css
				files : [
					{
						expand : true,
						cwd : "<%= pkg.destPath.cssPath %>/",
						src : ["*.css"],
						dest : "<%= pkg.distribPath.cssPath %>/",
						filter : "isFile"
					}
				]
			},
			htm : {
				expand : true,
				cwd : "<%= pkg.protoPath.distribPath %>",
				src : ["*.htm"],
				dest : "<%= pkg.distribPath.pagePath %>/",
				filter : 'isFile'
			},
			jsp : {
				expand : true,
				cwd : "<%= pkg.destPath.protoPath %>",
				src : ["*.jsp"],
				dest : "<%= pkg.distribPath.path %>/../",
				filter : 'isFile'
			}
		}
	});

	// 插件加载
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");

	// 定义任务
	grunt.registerTask("compileLess", ["less", "copy:material2MD5"]);

	grunt.registerTask("addMaterialMD5", "Add material MD5 tag", function () {
		var done = this.async(),
			exec = require('child_process').exec,
			child;
		child = exec('python material_timestamp.py', {
			cwd : './'
		}, function (error, stdout, stderr) {
			if (error !== null) {
				grunt.log.error('exec error:' + error);
				done(false);
				return;
			}
			grunt.log.ok("Material MD5 tag has been added!");
			grunt.log.ok(stdout);
			done(true);


		});
	});
	grunt.registerTask("addReferenceMD5", "Add reference file MD5 tag", function () {
		var done = this.async(),
			exec = require('child_process').exec,
			child;
		child = exec('python reference_timestamp.py', {
			cwd : './'
		}, function (error, stdout, stderr) {
			if (error !== null) {
				grunt.log.error('exec error:' + error);
				done(false);
				return;
			}
			grunt.log.ok("Reference file MD5 tag has been added!");
			grunt.log.ok(stdout);
			done(true);
		});
	});

	grunt.registerTask("build", "build source code ", function (ver) {
		this.requires(["compileLess", "addMaterialMD5"]);
		if (ver == 'development') {
			// grunt.task.run(["cssmin", "jshint", "concat", "uglify:development", "copy:material", "copy:js", "copy:css", "copy:htm"]);
			grunt.task.run(["cssmin", "jshint", "concat", "uglify:development"]);
			grunt.task.run("addReferenceMD5");
			grunt.task.run(["copy:material", "copy:js", "copy:css", "copy:htm", "copy:jsp"]);
		} else if (ver == 'production') {
			grunt.task.run(["cssmin", "jshint", "concat", "uglify:production"]);
			grunt.task.run("addReferenceMD5");
			grunt.task.run(["copy:material", "copy:js", "copy:css", "copy:htm", "copy:jsp"]);
		}
	});

	grunt.registerTask("deploy.development", "Build Frontend Project for develop", function () {
		// 编译Less文件生成css文件，
		// 将静态资源文件拷贝到指定目录，用于生成静态资源引用的hash特征戳
		grunt.log.writeln("Begin compile Less files, and copy material files!");
		grunt.task.run("compileLess");
		// 为静态资源引用生成MD5特征戳
		grunt.task.run("addMaterialMD5");
		grunt.task.run("build:development");
	});

	grunt.registerTask("deploy.production", "Build Frontend Project for production", function () {
		// 编译Less文件生成css文件，
		// 将静态资源文件拷贝到指定目录，用于生成静态资源引用的hash特征戳
		grunt.log.writeln("Begin compile Less files, and copy material files!");
		grunt.task.run("compileLess");
		// 为静态资源引用生成MD5特征戳
		grunt.task.run("addMaterialMD5");
		grunt.task.run("build:production");
	});
};