(function ($, window) {
	IX.ns("Hualala.Shop");
	var HSP = Hualala.Shop;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;

	var PromotionRulesSetHT = new IX.IListManager(),
		PromotionRulesOtherHT = new IX.IListManager();
	var PromotionRulesFirsFormKeys = "discountScope,discountScale,discountRange,remark,chkPresentInfo,presentInfo,chkVoucher,voucherItemID,voucherValue,voucherDesc,voucherNum,validUntilDate,voucherType".split(',');
	var PromotionRulesLastFormKeys = "minAmount,discountScope,discountScale,discountRange,remark,chkFreeAmount,freeAmount,chkPresentInfo,presentInfo,chkVoucher,voucherItemID,voucherValue,voucherDesc,voucherNum,validUntilDate,voucherType".split(',');
	var PromotionRulesSecondFormKeys = "discountScope,discountScale,discountRange,remark,stageAmount,chkFreeAmount,freeAmount,chkPresentInfo,presentInfo,chkVoucher,voucherItemID,voucherValue,voucherDesc,voucherNum,validUntilDate,voucherType".split(',');
	var PromotionLevelCount = 3,
		PromotionLevelNames = ["", "档次一","档次二","档次三"];
	HSP.PromotionLevelNames = PromotionLevelNames;
	var PromotionRulesSetFormElsCfg = {
		//是否打折
		discountScope :{
			type : "checkboxgrp",
			label : "",
			defaultVal : "0",
			options : [{
				value : 1, label : '折扣'
			}],
			validCfg : {
				validators : {}
			}
		},
		//折扣率
		discountScale:{
			type : "text",
			label : "折扣率",
			defaultVal : "",
			help : "如：0.9为九折、0.88为八八折",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入折扣率"
					},
					regexp: {
						regexp: /^[0](\.(?:0[1-9]|[1-9][0-9]?))$/, 
						message: '输入数字为0到1之间的小数且小数点后最多为两位'
					}
				}
			}
		},
		//折扣范围
		discountRange : {
			type : 'radiogrp',
			label : '折扣范围',
			defaultVal : '1',
			options : [{value:"1",label:"全单"},{value:"0",label:"部分"},],
			validCfg : {}
		},
		remark : {
			type : 'textarea',
			label : "打折备注",
			defaultVal : "",
			validCfg : {
				validators : {
				}
			}
		},
		stageAmount :{
			type : "text",
			label : "(折后)每满",
			prefix : '￥',
  			surfix : '元',
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "金额不能为空"
					}
				}
			}
		},
		minAmount :{
			type : "text",
			label : "消费满",
			prefix : '￥',
  			surfix : '元（含）以上',
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "金额不能为空"
					}
				}
			}

		},
		//减免freeAmount
		chkFreeAmount :{
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '减免'
			}],
			validCfg : {
				validators : {}
			}
		},
		freeAmount: {
			type : "text",
			label : "减免金额",
			prefix : '￥',
  			surfix : '元',
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "减免金额不能为空"
					}
				}
			}
		},
		//赠送
		chkPresentInfo:{
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '赠送'
			}],
			validCfg : {
				validators : {}
			}
		},
		presentInfo: {
			type : "text",
			label : "赠送备注",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入赠送备注"
					}
				}
			}
		},
		//代金券id
		voucherItemID : {
			type : 'hidden',
			defaultVal : ''
		},
		//代金券价值
		voucherValue  : {
			type : 'hidden',
			defaultVal : ''
		},
		//代金券名称
		voucherDesc : {
			type : 'pickgift',
			defaultVal : '',
			label : '代金券名称',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择代金券"
					}
				}
			}
		},
		//赠券张数
		voucherNum  : {
			type : "text",
			label : "赠券张数",
			defaultVal : "",
			surfix : '张',
			validCfg : {
				validators : {
					notEmpty : {
						message : "赠券张数不能为空"
					},
                    integer: {message: '赠券张数必须是整数'},
                    between: {
                    	min: 1, 
                    	max: 10,
                    	message: '必须是1-10之间的整数'
                    }
				}
			}
		},
		//券有效期
		validUntilDate : {
			type : "text",
			label : "代金券有效期",
			defaultVal : "60",
			surfix : '天',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入券有效期"
					},
					numeric : {
						message : "券有效期必须为数字"
					},
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "券有效期必须大于0"
					}
				}
			}
		},
		//返券
		chkVoucher :{
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '返券'
			}],
			validCfg : {
				validators : {}
			}
		},
		//返券规则
		voucherType  : {
			type : 'combo',
			label : "返券规则",
			defaultVal : "0",
			help : "返券规则适用于所有的促销档次，设置一个均可。取最后一个为准",
			options : Hualala.TypeDef.ShopPromotionDataSet.returnVoucherTypes,
			validCfg : {
				validators : {
					notEmpty : {
						message : "返券规则不能为空"
					}
				}
			}
		},
		//赠送备注
		presentInfo :{
			type : "text",
			label : "赠送备注",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "赠送备注不能为空"
					}
				}
			}
		}

	};
	for (var i = 1; i <= PromotionLevelCount; i++) {
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		_.each(PromotionRulesSetFormElsCfg, function (el, k) {
			var key = k + '_' + i,
				type = $XP(el, 'type');
			if (type == 'radiogrp' || type == 'checkboxgrp') {
				var ops = _.map($XP(el, 'options'), function (op) {
					return IX.inherit(op, {
						id : key,
						name : key,
						origname: k,
						clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
					});
				});
				PromotionRulesSetHT.register(key, IX.inherit(el, {
					id : key,
					name : key,
					origname: k,
					options : ops,
					labelClz : labelClz,
					clz : 'col-sm-7'
				}));
			} else { 
				PromotionRulesSetHT.register(key, IX.inherit(el, {
					id : key,
					name : key,
					origname: k,
					labelClz : labelClz,
					clz : 'col-sm-6'
				}));
			}
		});
	}

	var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
	_.each(PromotionRulesSetFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		if (type == 'radiogrp' || type == 'checkboxgrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k,
					name : k,
					origname: k,
					clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
				});
			});
			PromotionRulesOtherHT.register(k, IX.inherit(el, {
				id : k,
				name : k,
				origname: k,
				options : ops,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		}
		else{ 
			PromotionRulesOtherHT.register(k, IX.inherit(el, {
				id : k,
				name : k,
				origname: k,
				labelClz : labelClz,
				clz : 'col-sm-6'
			}));
		}
	});
	
	/**
	 * 整理促销规则表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapPromotionRulesFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var rulesJson=self.model.get('rules');
			rulesJson = !rulesJson ? {} : JSON.parse(rulesJson);
		var updatestageType=$("#promotion_way").find('input[name="stageType"]:checked').val(),
			equalFlag = (rulesJson.stageType==updatestageType),
			stageType = equalFlag?rulesJson.stageType:updatestageType,
			promotionLevelNames = PromotionLevelNames;
			ret = [];
		//当stageType为2的时候,即有档次的选择的时候
		if(stageType==2){
			for (var i = 1; i <= PromotionLevelCount; i++) {
				var promotionLevelName = promotionLevelNames[i],
					panelClz = 'mcm-evtgift-panel ';
				var stage = rulesJson.stage;
				if(stage!=undefined){
					panelClz += (stage[i-1] != undefined && !IX.isEmpty(stage[i-1])) || i == 1?' isActive ':'';
				}else{
					panelClz += i == 1?' isActive ':'';
				}
				// if ((stage[i-1] != undefined && !IX.isEmpty(stage[i-1])) || i == 1) {
				// 	panelClz += ' isActive ';
				// }
				var addbtn = {clz : 'btn-warning btn-add', name : 'addGift', label : '添加新档'},
					delbtn = {clz : 'btn-default btn-del', name : 'deleteGift', label : '删除' + promotionLevelName};
				var giftSet = {
					promotionLevelName : promotionLevelName,
					clz : panelClz,
					btns : i == 1 ? [addbtn] : (i == PromotionLevelCount ? [delbtn] : [delbtn,addbtn])
				};
				var form = _.map(formKeys, function (k) {
					var key = k + '_' + i,
						elCfg = PromotionRulesSetHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'checkboxgrp') {
						switch(k) {
							//折扣勾选项
	                        case "discountScope":
	                        	var v;
	                      		if(stage!=undefined){
		                        	if(rulesJson.stage[i-1]!=undefined){
		                        		if(rulesJson.stage[i-1][k]){
		                        			v = rulesJson.stage[i-1][k];
		                        		}
		                        	}
	                        	}
	                        	var	options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
	                        //减免金额勾选项
	                        case "chkFreeAmount" :
	                        	var v;
	                        	if(stage!=undefined){
		                        	if(rulesJson.stage[i-1]!=undefined){
		                        		if(rulesJson.stage[i-1].freeAmount){
		                        			v = 1;
		                        		}
		                        	}
		                        }
								var options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
	                        //赠送备注勾选
	                        case "chkPresentInfo":
	                        	var v;
	                        	if(stage!=undefined){
		                        	if(rulesJson.stage[i-1]!=undefined){
		                        		if(rulesJson.stage[i-1].presentInfo){
		                        			v = 1;
		                        		}
		                        	}
		                        }
								options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
	                        //返券勾选
	                        case "chkVoucher" :
	                        	var v
	                        	if(stage!=undefined){
		                        	if(rulesJson.stage[i-1]!=undefined){
		                        		if(rulesJson.stage[i-1].voucherDesc){
		                        			v = 1;
		                        		}
		                        	}
		                        }
								var options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										checked : v > 0 ? 'checked' : ''
									});
								});
								return IX.inherit(elCfg, {
									options : options
								});
	                            break;
                    	}
					} else if(type=='combo'){
						if(k=='voucherType'){
							var v = 0;
							if(stage!=undefined){
		                    	if(rulesJson!=undefined){
		                    		if(rulesJson[k]){
		                    			v = rulesJson[k];
		                    		}
		                    	}
		                    }
							var	options = _.map($XP(elCfg, 'options'), function (op) {
									return IX.inherit(op, {
										selected : $XP(op, 'value') == v ? 'selected' : ''
									});
								});
							return IX.inherit(elCfg, {
								value : v,
								hidden: v==0 ? "hidden" : "",
								options : options
							});
						}
					} else if(type == 'textarea') {
					    var v;
					    if(stage!=undefined){
	                    	if(rulesJson.stage[i-1]!=undefined){
	                    		if(rulesJson.stage[i-1].remark){
	                    			v = 1;
	                    		}
	                    	}
	                    }
						return IX.inherit(elCfg, {
			                value : equalFlag ? Hualala.Common.decodeTextEnter(v || ''):$XP(elCfg, 'dafaultVal'),
			                hidden: v==undefined ? "hidden": ""
			            });
					} else if(type=='radiogrp') {
						if(k=='discountRange'){
							var v,operate;
							if(stage!=undefined){
		                    	if(rulesJson.stage[i-1]!=undefined){
		                    		if(rulesJson.stage[i-1].remark){
		                    			v = 1;
		                    		}
		                    		if(rulesJson.stage[i-1].discountScope){
                    					operate = rulesJson.stage[i-1].discountScope==1?1:0;
                    				}
		                    	}
		                    }
							var	options = _.map($XP(elCfg, 'options'), function (op) {
								var flag =((v==1)&&(op.value==0))||((v!=1)&&(op.value==1));
									return IX.inherit(op, {
										checked :flag?'checked':'',
										disabled : operate==1?'':'disabled'
									});
								});
							return IX.inherit(elCfg, {
								options : options,
							});
						}
					} else if(type=='text'){
						switch(k) {
	                        case "discountScale":
		                        var v,label;
		                        if(stage!=undefined){
			                    	if(rulesJson.stage[i-1]!=undefined){
			                    		if(rulesJson.stage[i-1][k]){
			                    			v = rulesJson.stage[i-1][k];
			                    			//label = parseFloat(v.toString().movePoint(1)).toString()
			                    		}
			                    	}
			                    }
	                        	return IX.inherit(elCfg, {
									value : equalFlag ? v : $XP(elCfg, 'defaultVal'),
									hidden: v==undefined ? "hidden": ""
								});
	                            break;
	                        case "freeAmount" :
	                        case "presentInfo":
	                        case "voucherNum" :
	                        case "voucherDesc" :
	                        case "validUntilDate":
		                        var v;
		                        if(stage!=undefined){
			                    	if(rulesJson.stage[i-1]!=undefined){
			                    		if(rulesJson.stage[i-1][k]){
			                    			v = rulesJson.stage[i-1][k];
			                    		}
			                    	}
			                    }
	                        	return IX.inherit(elCfg, {
									value : equalFlag ? v: $XP(elCfg, 'defaultVal'),
									hidden: v==undefined ? "hidden": ""
								});
	                            break;
	                        case "minAmount":
	                        	var v;
	                        	if(stage!=undefined){
			                    	if(rulesJson.stage[i-1]!=undefined){
			                    		if(rulesJson.stage[i-1][k]){
			                    			v = rulesJson.stage[i-1][k];
			                    		}
			                    	}
			                    }
	                        	return IX.inherit(elCfg, {
									value : equalFlag ? v: $XP(elCfg, 'defaultVal')
								});
	                            break;
                    	}
					} else if(type=='pickgift'){
						if(k=='voucherDesc'){
                        	var v;
                        	if(stage!=undefined){
	                        	if(rulesJson.stage[i-1]!=undefined){
	                        		if(rulesJson.stage[i-1].voucherDesc){
	                        			v = rulesJson.stage[i-1].voucherDesc;
	                        		}
	                        	}
	                        }
                        	return IX.inherit(elCfg, {
								value : v || $XP(elCfg, 'defaultVal'),
								hidden: v==undefined ? "hidden": ""
							});
						}
					}
					else {
						var v;
						if(stage!=undefined){
	                    	if(rulesJson.stage[i-1]!=undefined){
	                    		if(rulesJson.stage[i-1][k]){
	                    			v = rulesJson.stage[i-1][k];
	                    		}
	                    	}
	                    }
						return IX.inherit(elCfg, {
							value : v || $XP(elCfg, 'defaultVal')
						});
					}
				});
				ret.push(IX.inherit(giftSet, {
					isDivForm : true,
					formClz : 'mcm-evtgift-form',
					items : form
				}));
			}
		}
		//当只有stageType为0和1的时候。没有档次选择
		else{
			var stageTypeformKeys = stageType==0? PromotionRulesFirsFormKeys:PromotionRulesSecondFormKeys,
				panelClz = 'mcm-evtgift-panel isActive',
				giftSet = {
				clz : panelClz,
			};
			var form = _.map(stageTypeformKeys, function (k) {
				var elCfg = PromotionRulesOtherHT.get(k),
					type = $XP(elCfg, 'type');
				if (type == 'checkboxgrp') {
					switch(k) {
						//折扣勾选项
                        case "discountScope":
                        	var v;
                        		if(rulesJson[k]){
                        			v = rulesJson[k];
                        		}
                        	var	options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									checked : (equalFlag&&(v > 0)) ? 'checked' : ''
								});
							});
							return IX.inherit(elCfg, {
								options : options
							});
                            break;
                        //减免金额勾选项
                        case "chkFreeAmount" :
                            var v;
	                    		if(rulesJson.freeAmount){
	                    			v = 1;
	                    		}
							var options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									checked : (equalFlag&&(v > 0)) > 0 ? 'checked' : ''
								});
							});
							return IX.inherit(elCfg, {
								options : options
							});
                            break;
                        //赠送备注勾选
                        case "chkPresentInfo":
                        	var v;
	                    		if(rulesJson.presentInfo){
	                    			v = 1;
	                    		}
							var options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									checked : (equalFlag&&(v > 0)) > 0 ? 'checked' : ''
								});
							});
							return IX.inherit(elCfg, {
								options : options
							});
                            break;
                        //返券勾选
                        case "chkVoucher" :
                            var v;
	                    		if(rulesJson.voucherDesc){
	                    			v = 1;
	                    		}
							var options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									checked : (equalFlag&&(v > 0))? 'checked' : ''
								});
							});
							return IX.inherit(elCfg, {
								options : options
							});
                            break;
                	}
				}  else if(type=='radiogrp') {
					if(k=='discountRange'){
						var v,operate;
                    	if(rulesJson.remark){
                    		v = 1;
                    	}
                    	if(rulesJson.discountScope){
                    		operate = rulesJson.discountScope==1?1:0;
                    	}
						var	options = _.map($XP(elCfg, 'options'), function (op) {
							var flag = ((v==1)&&(op.value==0))||((v!=1)&&(op.value==1));
								return IX.inherit(op, {
									checked : flag?'checked':'',
									disabled : operate==1?'':'disabled'
								});
							});
						return IX.inherit(elCfg, {
							options : options
						});
					}
				} else if(type=='text'){
					switch(k) {
                        case "discountScale":
                        	var v,label;
	                    	if(rulesJson[k]){
	                    		v = rulesJson[k];
	                    		//label = parseFloat(v.toString().movePoint(1)).toString()	
	                    	}
                        	return IX.inherit(elCfg, {
								value : equalFlag ? v : $XP(elCfg, 'defaultVal'),
								hidden: v==undefined ? "hidden": ""
							});
                            break;
                        case "freeAmount" :
                        case "presentInfo":
                        case "voucherNum" :
                        case "voucherDesc" :
                        case "validUntilDate":
                            var v;
	                    	if(rulesJson[k]){
	                    		v = rulesJson[k];
	                    	}
                        	return IX.inherit(elCfg, {
								value : equalFlag? v : $XP(elCfg, 'defaultVal'),
								hidden: v==undefined ? "hidden": ""
							});
                            break;
                        case "stageAmount" :
                            var v;
	                    	if(rulesJson[k]){
	                    		v = rulesJson[k];
	                    	}
                        	return IX.inherit(elCfg, {
								value : equalFlag ? v :$XP(elCfg, 'defaultVal'),
							});
                            break;
                	}
				} else if(type == 'textarea') {
					if(k=='remark'){
						var v;
	                	if(rulesJson[k]){
	                		v = rulesJson[k];
	                	}
						return IX.inherit(elCfg, {
			                value : equalFlag ? Hualala.Common.decodeTextEnter(v || ''):$XP(elCfg, 'dafaultVal'),
			                hidden: v==undefined ? "hidden": ""
			            });
					}
				} else if(type == 'combo') {
					if(k=='voucherType'){
						var v;
		                	if(rulesJson[k]){
		                		v = rulesJson[k];
		                	}
                		var	options = _.map($XP(elCfg, 'options'), function (op) {
							return IX.inherit(op, {
								selected : $XP(op, 'value') == v ? 'selected' : ''
							});
						});
						return IX.inherit(elCfg, {
							value : v,
							options : options,
							hidden : v==undefined? "hidden" :"",
							hiddenHelp : stageType!=2?"hidden":""
						});
					}
				}else {
					var v;
                	if(rulesJson[k]){
                		v = rulesJson[k];
                	}
					return IX.inherit(elCfg, {
						value : equalFlag ? v : $XP(elCfg, 'defaultVal'),
						hidden : v==undefined? "hidden" :""
					});
				}
			});
			ret.push(IX.inherit(giftSet, {
				isDivForm : true,
				formClz : 'mcm-evtgift-form',
				items : form
			}));
		}
		return {
			hideTip :'hidden',
			giftSetTitle :stageType == 2 ? '档次设置' :'促销规则设置',
			hidden : "",
			gifts : ret
		};	

	};
	var PromotionRuleStepView = Stapes.subclass({
		constructor : function (cfg) {
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');
			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("promition Base Info View init faild!");
			}
			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm();
			this.initUIComponents();
			this.bindEvent();
		}
	});
	PromotionRuleStepView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_levelset')),
				formTpl = Handlebars.compile(Hualala.TplLib.get('tpl_promotion_base_form')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerPartial("baseform", Hualala.TplLib.get('tpl_promotion_base_form'));
			Handlebars.registerPartial("ctrlbtns", Hualala.TplLib.get('tpl_shop_modal_btns'));

			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				formTpl : formTpl,
				btnTpl : btnTpl
			});
		},
		initBaseCfg : function () {
			this.formKeys = PromotionRulesLastFormKeys;
		},
		initUIComponents : function () {
			var self = this;
			self.container.find('.isActive:last').addClass('isCurrent');
			var rulesJson = self.model.get('rules');
				rulesJson = !rulesJson ? {} : JSON.parse(rulesJson);
			self.setSwitcherLayout(self.container.find(':input[name^=discountScope]'));
		},
		setSwitcherLayout : function ($chk) {
			var checked = $chk.is(':checked');
			var $nextFormGroup = $chk.parents('.form-group').next('.form-group');
			$nextFormGroup[checked ? 'removeClass' : 'addClass']('hidden');
			$nextFormGroup.find(':text').attr('disabled', checked ? false : true);
		},
		//促销规则绑定事件。包括根据不同的规则元素的显示和隐藏。
		bindEvent : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts();
			self.container.on('click', '.panel-footer .btn', function (e) {
				var $btn = $(this), act = $btn.attr('name');
				self.container.find('.mcm-evtgift-panel').removeClass('isCurrent');
				if (act == 'addGift') {
					$btn.parents('.mcm-evtgift-panel').next('.mcm-evtgift-panel').addClass('isActive isCurrent');
				} else {
					$btn.parents('.mcm-evtgift-panel').removeClass('isActive');
					$btn.parents('.mcm-evtgift-panel').prev('.mcm-evtgift-panel').addClass('isActive isCurrent');
					self.resetGiftSet($btn.parents('.mcm-evtgift-panel'));
				}
			});
			self.container.on('change', ':text[name^=voucherDesc]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name');
				self.container.find('form').bootstrapValidator('revalidateField', name);
			});
			self.container.on('change', ':checkbox[name^=discountScope]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=discountScale]'),
					$fmgrps = $els.parents('.form-group'),
					$discountRange = $txt.parents('.mcm-evtgift-form').find('[name^=discountRange]');
				if (checkedFlag) {
					$els.attr('disabled', false);
					$els.removeClass('hidden');
					$fmgrps.removeClass('hidden');
					$discountRange.prop("disabled",false);
				} else {
					$els.attr('disabled', true);
					$els.removeClass('hidden');
					$fmgrps.addClass('hidden');
					$discountRange.prop("disabled",true);
				}
			});
			self.container.on('change',':checkbox[name^=chkFreeAmount]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=freeAmount]'),
					$fmgrps = $els.parents('.form-group');
				if (checkedFlag) {
					$els.attr('disabled', false);
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('change', ':checkbox[name^=chkPresentInfo]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=presentInfo]'),
					$fmgrps = $els.parents('.form-group');
				if (checkedFlag) {
					$els.attr('disabled', false);
					$els.removeClass('hidden');
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$els.addClass('hidden');
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('change', ':checkbox[name^=chkVoucher]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=voucherDesc]'),
					$voucherNum = $txt.parents('.mcm-evtgift-form').find('[name^=voucherNum]'),
					$voucherType = $txt.parents('.mcm-evtgift-form').find('[name^=voucherType]'),
					$validUntilDate = $txt.parents('.mcm-evtgift-form').find('[name^=validUntilDate]'), 
					$fmgrps = $els.parents('.form-group'),
					$voucherNumgrps = $voucherNum.parents('.form-group');
					$voucherTypegrps =$voucherType.parents('.form-group');
					$validUntilDategrps = $validUntilDate.parents('.form-group');
				if (checkedFlag) {
					$els.attr('disabled', false);
					$els.removeClass('hidden');
					$fmgrps.removeClass('hidden');
					$voucherNumgrps.removeClass('hidden');
					$validUntilDategrps.removeClass('hidden');
					$voucherTypegrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$els.addClass('hidden');
					$fmgrps.addClass('hidden');
					$voucherNumgrps.addClass('hidden');
					$validUntilDategrps.addClass('hidden');
					$voucherTypegrps.addClass('hidden');
				}
			});
			self.container.on('change',':radio[origname="discountRange"]',function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					checkedFlag = $txt.is(':checked');
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=remark]'),
					$fmgrps = $els.parents('.form-group');
				if ($txt.val()==0) {
					$els.attr('disabled', false);
					$els.removeClass('hidden');
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$els.addClass('hidden');
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('change', ':hidden[name^=EGiftType]', function (e) {
				var $txt = $(this),
					name = $txt.attr('name'),
					val = $txt.val();
				var $els = $txt.parents('.mcm-evtgift-form').find('[name^=EGfitValidUntilDayCount]'),
					$fmgrps = $els.parents('.form-group');
				if (val == 10) {
					$els.attr('disabled', false);
					$fmgrps.removeClass('hidden');
				} else {
					$els.attr('disabled', true);
					$fmgrps.addClass('hidden');
				}
			});
			self.container.on('click', '.btn[name=pickgift]', function (e) {
				var $btn = $(this),
					ticketType = 10;//电子代金券对应的giftType的值
				var modal = new Hualala.MCM.PickGiftModal({
					trigger : $btn,
					selectedFn : function (gift, $triggerEl) {
						var giftID = $XP(gift, 'giftItemID', ''),
							giftName = $XP(gift, 'giftName', ''),
							giftValue = $XP(gift, 'giftValue', ''),
							
							giftType = "10";
						var panel = $triggerEl.parents('.mcm-evtgift-panel'),
							indexNum = self.container.find(".mcm-evtgift-panel");
							if(indexNum.length>1){
								idx = parseInt(panel.attr('data-index')) + 1;
								$('#voucherItemID_' + idx, panel).val(giftID);
								$('#voucherValue_' + idx, panel).val(giftValue);
								$('#voucherDesc_' + idx, panel).val(giftName).trigger('change');
						       
							}
							else{
								$('#voucherItemID', panel).val(giftID);
								$('#voucherValue', panel).val(giftValue);
								$('#voucherDesc', panel).val(giftName).trigger('change');
							}
					},
					selectGiftType: [ticketType]
				});
			});
			//表单的验证
			self.container.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				self.failFn(self.model);
			}).on('success.form.bv', function (e, data) {
				//验证成功的时候，判断是否勾选促销方式。
					formCount = self.container.find(".mcm-gift-set .mcm-evtgift-panel"),
					formContainer = self.container.find(".mcm-gift-set .mcm-evtgift-panel.isActive");
				if(formCount.length>1){
					for (var i = 1; i <= formContainer.length; i++) {
						var checkedNum =$(formContainer[i-1]).find("input[type='checkbox']:checked")
						if(checkedNum.length==0){
							var promotionLevelName = HSP.PromotionLevelNames[i];
							self.parentView.switchWizardCtrlStatus('reset');
							toptip({msg: promotionLevelName+'必须勾选一种促销方式', type: 'danger'});
							return;
						}
					}
				} else{
					var	checkedNum=self.container.find(".mcm-gift-set .mcm-evtgift-panel input[type='checkbox']:checked");
					if(checkedNum.length==0){
						self.parentView.switchWizardCtrlStatus('reset');
						toptip({msg: '必须勾选一种促销方式', type: 'danger'});
						return;
					}	
				}
				e.preventDefault();
				var formParams = self.serializeForm();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				IX.Debug.info("DEBUG: 促销规则 Form Params:");
				IX.Debug.info(formParams);
				//把数据存到缓存中
				self.model.emit('saveCache', {
					params : formParams,
					failFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.successFn.call(self);
					}
				})
			});

		},
		//添加新档的时候，表单元素的初始化。
		resetGiftSet : function ($panel) {
			var self = this;
			var idx = parseInt($panel.attr('data-index')) + 1;
			var formKeys = self.formKeys;
			_.each(formKeys, function (k) {
				var id = k + '_' + idx,
					$el = $('#' + id + '', $panel);
				switch (k) {
					case "minAmount":
					case "discountScale":
					case "freeAmount" :
					case "presentInfo":
					case "voucherItemID":
					case "voucherDesc":
					case "voucherValue":
						$el.val('');
						break;
					case "voucherNum":
						$el.val(1);
						break;
					case "validUntilDate":
						$el.val(60);
						break;
				}
			});
		},
		renderForm : function () {
			var self = this,
				renderData = self.mapFormElsData.call(self),
				tpl = self.get('layoutTpl'),
				htm = tpl(renderData);
			self.container.html(htm);
		},
		//表单元素的验证
		initValidFieldOpts : function () {
			var self = this,
				stageType = self.model.get("stageType"),
				FirsFormKeys = "discountScope,discountScale,remark,presentInfo,voucherDesc,voucherNum,validUntilDate,voucherType".split(','),
				SecondFormKeys = "discountScope,discountScale,remark,stageAmount,freeAmount,presentInfo,voucherDesc,voucherNum,validUntilDate,voucherType".split(',');
                LastFormKeys = "minAmount,discountScope,discountScale,discountRange,remark,freeAmount,presentInfo,voucherDesc,voucherNum,validUntilDate,voucherType".split(',');
			var ValidformKeys = stageType==0 ? FirsFormKeys:SecondFormKeys,
				ret = {};
			switch(stageType){
				case "0":
				case "1":
					_.each(ValidformKeys, function (key) {
						var elCfg = PromotionRulesOtherHT.get(key),
							type = $XP(elCfg, 'type');
						ret[key] = $XP(elCfg, 'validCfg', {});
					});
					return ret;
				break;
				case "2":
					for (var i = 1; i <= PromotionLevelCount; i++) {
						_.each(LastFormKeys, function (k) {
							var key = k+"_"+i,
								elCfg = PromotionRulesSetHT.get(key),
								type = $XP(elCfg, 'type');
							ret[key] = $XP(elCfg, 'validCfg', {});
						});
					}
					return ret;
				break;
			}	
		},
		//序列化表单元素。整理促销规则
		serializeForm : function () {
			var self = this,formKeys;
				ret = {};
			var stageType=self.model.get('stageType'),
				rules={};
			if(stageType==2) {
				formKeys = "stageType,minAmount,discountScope,discountScale,remark,freeAmount,presentInfo,voucherItemID,voucherValue,voucherDesc,voucherNum,validUntilDate,voucherType".split(',');
				rules.stage = [];
				var formContainer = self.container.find(".mcm-gift-set .mcm-evtgift-panel.isActive");
				for (var i = 1; i <= formContainer.length; i++) {
					rules.stage[i-1] ={};
					_.each(formKeys, function (k) {
						switch(k){
							case "stageType" :
								rules[k]=self.model.get(k);
								break;
							case "discountScope":
								if($('[origname="discountScale"]', formContainer[i-1]).val()){
									rules.stage[i-1][k]=$('[origname=' + k + ']', formContainer[i-1]).val();
								}
								break;
							case "remark" :
								if($('[origname=' + k + ']',formContainer[i-1]).val()){
									rules.stage[i-1][k]=Hualala.Common.encodeTextEnter($('[origname=' + k + ']', formContainer[i-1]).val());
								}
								ret["remark"] = Hualala.Common.encodeTextEnter($('[origname=' + k + ']', self.container).val());
								break;
							case "voucherType":
								if($('[origname=' + k + ']',formContainer[i-1]).val()){
									if(!$('[origname=' + k + ']',formContainer[i-1]).parent().parent().hasClass("hidden")){
										rules["voucherType"] =  $('[origname=' + k + ']',formContainer[i-1]).val();
									}
								}
								break;
							case "validUntilDate":
							case "presentInfo" :
							case "voucherDesc" :
							case "voucherNum" :
							case "freeAmount":
								if($('[origname=' + k + ']',formContainer[i-1]).val()){
									if(!$('[origname=' + k + ']',formContainer[i-1]).parent().parent().parent().hasClass("hidden")){
										rules.stage[i-1][k] =  $('[origname=' + k + ']',formContainer[i-1]).val();
									}
								}
								break;
							case "voucherItemID":
							case "voucherValue" :
								if($('[origname="chkVoucher"]',formContainer[i-1]).is(':checked')){
									rules.stage[i-1][k]=$('[origname=' + k + ']',formContainer[i-1]).val()
								}
								break;
							default:
								if($('[origname=' + k + ']',formContainer[i-1]).val()){
									rules.stage[i-1][k]=$('[origname=' + k + ']',formContainer[i-1]).val()
								}
						}
						ret["rules"]=JSON.stringify(rules);
					});
				}
				return ret;
			} else{
				var formFirstKeys ="stageType,discountScope,discountScale,remark,presentInfo,voucherItemID,voucherValue,voucherNum,voucherDesc,validUntilDate,voucherType".split(','),
				    formSecondKeys = "stageType,discountScope,discountScale,remark,presentInfo,freeAmount,stageAmount,voucherItemID,voucherValue,voucherNum,voucherDesc,validUntilDate,voucherType".split(',');
					formKeys =stageType==0 ?formFirstKeys:formSecondKeys;
				_.each(formKeys, function (k) {
					switch(k){
						case "stageType":
							rules[k]=self.model.get(k);
							break;
						case  "discountScope":
							if($('[name="discountScale"]', self.container).val()){
								rules[k]=$('[name=' + k + ']', self.container).val();
							}
							break;
						case "remark":
							if($('[origname=' + k + ']', self.container).val()){
								rules[k]=Hualala.Common.encodeTextEnter($('[origname=' + k + ']', self.container).val());
							}
							ret["remark"] = Hualala.Common.encodeTextEnter($('[origname=' + k + ']', self.container).val());
							break;
						case "voucherType":
						case "validUntilDate":
						case "presentInfo" :
						case "voucherDesc" :
						case "voucherNum" :
						case "freeAmount":
							if($('[origname=' + k + ']',self.container).val()){
								if(!$('[origname=' + k + ']',self.container).parent().parent().hasClass("hidden")){
									rules[k] =  $('[origname=' + k + ']',self.container).val();
								}
							}
							break;
						case "voucherItemID":
						case "voucherValue" :
							if($('[origname="chkVoucher"]',self.container).is(':checked')){
								rules[k]=$('[origname=' + k + ']',self.container).val()
							}
							break;
						default:
							if($('[origname=' + k + ']',self.container).val()){
								rules[k]=$('[name=' + k + ']', self.container).val();
							}
					}
					ret["rules"]=JSON.stringify(rules);
				});
				return ret;
			}
		},
		refresh : function () {
			var self = this;
			self.renderForm();
			self.initUIComponents();
			self.bindEvent();
			/*this.formParams = this.model.getAll();
			self.initUIComponents();*/
		},
		delete : function (successFn, faildFn) {
			var self = this;
			self.model.emit('deleteItem', {
				itemID : self.model.get('itemID'),
				successFn : function (res) {
					successFn(res);
				},
				faildFn : function (res) {
					faildFn(res);
				}
			})
		}
	});
	HSP.PromotionRuleStepView = PromotionRuleStepView;

	/**
	 * 创建向导中促销规则设置步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	HSP.initPromotionRuleStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HSP.PromotionRuleStepView({
				mode : wizardMode,
				container : $cnt,
				parentView : wizardModalView,
				model : wizardModalView.model,
				successFn : function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
					self.parentView.getNextStep();
				},
				failFn : function () {
					var self = this;
					self.parentView.switchWizardCtrlStatus('reset');
				},
				mapFormElsData : mapPromotionRulesFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};
})(jQuery, window);