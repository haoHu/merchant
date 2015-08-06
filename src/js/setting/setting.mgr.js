(function ($, window) {
	IX.ns("Hualala.Setting");
	var popoverMsg = Hualala.UI.PopoverMsgTip;
	var toptip = Hualala.UI.TopTip;

	var ServiceFormElsCfg = {
		advanceTime : {
			type : 'combo',
			label : '用户提前预订时间',
			defaultVal : 0,
			// prefix : '$',
			// surfix : '元',
			options : _.each(Hualala.TypeDef.MinuteIntervalOptions(), function (el){	
				if(($XP(el, 'value'))==1440){ el.label="隔天订"; }
			}),
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入用户提前预订时间"
					},
					callback:{
					    message : '',
                        callback : function (value, validator, $field) {
                        	var takeawayDeliveryTime =$('input[name=takeawayDeliveryTime]').val(),
                        		forVal = parseInt(value),
                        		takeVal =  parseInt(takeawayDeliveryTime);
                        	if(forVal<takeVal){
                        		return { valid: false, message: '用户提前预定时间必须要长于预计送餐时间' }
                        	}
                        	return true;
                        }
	                }
				}
			}
		},
		noticeTime : {
			type : 'combo',
			label : '订单提前通知时间',
			defaultVal : 0,
			// @Note for 1.1 modify MinuteIntervalOptions first option label (#4105)
			// options : Hualala.TypeDef.MinuteIntervalOptions(),
			options : Hualala.Common.getMinuteIntervalOptions({startLabel : "用户下单后立即通知"}),
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入订单提前通知时间"
					}
				}
			}
		},
		minAmount : {
			type : 'text',
			label : '最低消费金额',
			prefix : '￥',
			surfix : Hualala.Constants.CashUnit,
			defaultVal : 0,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入最低消费金额"
					},
					numeric : {
						message: "最低消费金额必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "最低消费金额必须大于或等于0"
					}
				}
			}
		},
		serviceAmount : {
			type : 'text',
			label : '服务费',
			prefix : '￥',
			surfix : Hualala.Constants.CashUnit,
			defaultVal : 0,
			validCfg : {
				validators : {
					numeric : {
						message: "服务费必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "服务费必须大于或等于0"
					}
				}
			}
		},
		freeServiceAmount : {
			type : 'text',
			label : '免服务费菜品金额',
			prefix : '￥',
			surfix : Hualala.Constants.CashUnit,
			defaultVal : 0,
			validCfg : {
				validators : {
					numeric : {
						message: "免服务费菜品金额必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "免服务费菜品金额必须大于或等于0"
					}
				}
			}
		},
		holidayFlag : {
			type : 'combo',
			label : '节假日开放',
			defaultVal : 0,
			options : Hualala.TypeDef.HolidayFlagOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择节假日开放类型"
					}
				}
			}
		},
		openDays : {
			type : 'text',
			label : '开放服务天数',
			surfix : '天',
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入开放服务天数"
					},
					digits : {
						message: "开放服务天数必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "开放服务天数必须大于或等于0"
					}
				}
			}
		},
		servicePeriods : {
			type : 'section',
			label : '开放时段',
			min : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
				defaultVal : '10:30',
				validCfg : {
					group : '.min-input',
					validators : {
						notEmpty : {
							message : "请输入起始时间"
						}
					}
				}
			},
			max : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
				defaultVal : '21:30',
				validCfg : {
					group : '.max-input',
					validators : {
						notEmpty : {
							message : "请输入结束时间"
						},
						callback:{
						    message : '',
	                        callback : function (value, validator, $field) {
	                        	var	$startTimeField = validator.$form.find(':text[name^=servicePeriods_min]'),
	                        		startTime = $startTimeField.val().split(':'),
	                        		endTime = $field.val().split(':'),
				                	startVal = parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10),
				               		endVal = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10);
				            	if(endVal == startVal)
				               		 return { valid: false, message: '结束时间不能等于开始时间' }
				               	if(Math.abs(endVal - startVal)<30)
				               		return { valid: false, message: '结束时间和开始时间间隔要大于30分钟' }
	                            return true;
	                        }
						}
					}
				}
			}
		},
		servicePeriods2 : {
			type : 'section',
			label : '开放时段2',
			choice : '<input type="checkbox" class="servicePeriodsChoice" value="1" data name="servicePeriodsChoice">',
			min : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {
						notEmpty : {
							message : "请输入起始时间"
						}
					}
				}
			},
			max : {
				type : 'timepicker',
				surfix : '<span class="glyphicon glyphicon-time"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {
						notEmpty : {
							message : "请输入结束时间"
						},
						callback:{
						    message : '',
	                        callback : function (value, validator, $field) {
	                        	var	$startTimeField2 = validator.$form.find(':text[name^=servicePeriods2_min]'),
	                        		$startTimeField = validator.$form.find(':text[name^=servicePeriods_min]'),
	                        		$endTimeField = validator.$form.find(':text[name^=servicePeriods_max]'),
	                        		startTime = $startTimeField.val().split(':'),
	                        		startTime2 = $startTimeField2.val().split(':'),
	                        		endTime2 = $field.val().split(':'),
	                        		endTime = $endTimeField.val().split(':'),
	                        		startVal = parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10),
	                        		endVal = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10),
				                	startVal2 = parseInt(startTime2[0], 10) * 60 + parseInt(startTime2[1], 10),
				               		endVal2 = parseInt(endTime2[0], 10) * 60 + parseInt(endTime2[1], 10);
				            	if(endVal2 == startVal2)
				               		 return { valid: false, message: '结束时间不能等于开始时间' }
				               	if(Math.abs(endVal2 - startVal2)<30)
				               		return { valid: false, message: '结束时间和开始时间间隔要大于30分钟' }
	              				//结束时间大于开始时间,正序从大到小
				               	if(endVal>startVal){
			               			//第二时段也是开始时间小于结束时间
			               			if(endVal2>=startVal2){
			               				if(startVal2>=endVal||endVal2<=startVal){
			               					return true;
			               				}
			               				else{
			               					return { valid: false, message: '开放时段和开放时段2有重叠，请重新选择时段' }
			               				}
			               			}
			               			//第二时段开始时间大于结束时间(即第二时段结束时间是跨天的)
			               			else{
			               				if(endVal<=startVal2&&endVal2<=startVal){
			               					return true;
			               				}
			               				else{
			               					return { valid: false, message: '开放时段和开放时段2有重叠，请重新选择时段' }
			               				}

			               			}
			               		}
			               		//结束时间小于开始时间，(开始时段1是跨天的)倒序从小到大
			               		else{
			               			//第二时间段，开始时间小于结束时间
			               			if(endVal2>=startVal2){
			               				if(endVal2>=startVal||startVal2>=endVal){
			               					return true;
			               				}
			               				else{
			               					return { valid: false, message: '开放时段和开放时段2有重叠，请重新选择时段' }
			               				}
			               			}
			               			else{
			               				return { valid: false, message: '开放时段和开放时段2有重叠，请重新选择时段' }
			               			}
			               		}               						            
                            	return true;
	                        }
						}
					}
				}
			}
		},
		reserveTableTime : {
			type : 'combo',
			label : '留位时间',
			defaultVal : 0,
			options : Hualala.TypeDef.MinuteIntervalOptions(60),
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择留位时间"
					},
					numeric : {
						message: "留位时间必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "留位时间必须大于或等于0"
					}
				}
			}
		},
		reserveTableDesc : {
			type : 'text',
			label : '留位特别说明',
			defaultVal : '',
			validCfg : {
				validators : {
					stringLength : {
						max : 40,
						message : '留位特别说明不能超过40个字'
					}
				}
			}
		},
		takeawayDeliveryAgent : {
			type : 'text',
			label : '配送单位',
			defaultVal : '自助配送',
			validCfg : {}
		},
		takeawayDeliveryTime : {
			type : 'text',
			label : '预计送餐所需时间',
			surfix : '分钟',
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入预计送餐所需时间"
					},
					numeric : {
						message: "预计送餐所需时间必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "预计送餐所需时间必须大于或等于0"
					}
				}
			}
		},
		takeawayScope : {
			type : 'text',
			label : '送餐范围',
			surfix : '公里',
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入送餐范围"
					},
					numeric : {
						message: "送餐范围必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "送餐范围必须大于或等于0"
					}
				}
			}
		},
		takeawayScopeDesc : {
			type : 'text',
			label : '送餐范围说明',
			defaultVal : '',
			validCfg : {
				validators : {
					stringLength : {
						max : 200,
						message : '送餐范围说明不能超过200个字'
					}
				}
			}
		},
		submitSMSTemplateID : {
			type : 'hidden',
			defaultVal : ''
		},
		checkSMSTemplateID : {
			type : 'hidden',
			defaultVal : ''
		},
		payMethod : {
			type : 'combo',
			label : '可选支付方式',
			defaultVal : 0,
			options : Hualala.TypeDef.PayMethodOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择可选支付方式"
					}
				}
			}
		},
		promotionScope :{
			type : 'combo',
			label : '店铺促销优惠支持',
			defaultVal : 0,
			options : Hualala.TypeDef.PromotionScopeOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择店铺促销优惠支持方式"
					}
				}
			}
		},
		needInputTableName : {
			type : 'switcher',
			label : '下单时输入桌号',
			defaultVal : 1,
			onLabel : '需要',
			offLabel : '不需要',
			validCfg : {
				validators : {
					
				}
			}
		},
		supportInvoice : {
			type : 'switcher',
			label : '提供发票',
			defaultVal : 1,
			onLabel : '需要',
			offLabel : '不需要',
			validCfg : {
				validators : {
				}
			}
			
		},
		supportCommitToSoftware : {
			type : 'switcher',
			label : '下单到餐饮软件',
			defaultVal : 1,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {
				}
			}
		},
		payMethodAtShop : {
			type : 'combo',
			label : '店内支付方式',
			defaultVal : 0,
			options : Hualala.TypeDef.PayMethodAtShopOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "请选择店内支付方式"
					}
				}
			}
		},
		checkSpotOrder : {
			type : 'switcher',
			label : '支持手机结账',
			defaultVal : 1,
			onLabel : '支持',
			offLabel : '不支持',
			validCfg : {
				validators : {}
			}
		},
		// @NOTE: for 1.1 modify payBeforeCommit to combobox(#4105)
		// payBeforeCommit : {
		// 	type : 'switcher',
		// 	label : '支持餐前结账',
		// 	defaultVal : 1,
		// 	onLabel : '支持',
		// 	offLabel : '不支持',
		// 	validCfg : {
		// 		validators : {}
		// 	}
			
		// },
		payBeforeCommit : {
			type : 'combo',
			label : '结账模式',
			defaultVal : 1,
			options : Hualala.TypeDef.PayBeforeCommitOptions,
			validCfg : {
				validators : {}
			}
		},
		fetchFoodMode : {
			type : 'combo',
			label : '下单后出餐模式',
			defaultVal : 0,
			options : Hualala.TypeDef.FetchFoodModeOptions,
			validCfg : {
				validators : {}
			}
		},
		foodUITemplate : {
			type : 'combo',
			label : '菜品展示模式',
			defaultVal : 1,
			options : Hualala.TypeDef.foodUITemplateOptions,
			validCfg : {
				validators : {
					notEmpty : {
						message : "菜品展示模式不能为空"
					}
				}
				
			}
		},
		commitSafeLevel : {
			type :'combo',
			label :'下单验证',
			defaultVal : 1,
			options :  Hualala.TypeDef.CommitSafeLevelOptions,
			validCfg : {
				validators : {
					notEmpty :{
						message : "下单验证不能为空"
					}
				}
			}
		},
		adsID :{
			type : 'combo',
			label : '软文介绍',
			defaultVal : 0,
			options :"",
			validCfg : {
				validators : {
					notEmpty :{
						message : "软文介绍不能为空"
					}
				}
			}
		}
	};
	var ServiceFormElsHT = new IX.IListManager();
	_.each(ServiceFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section') {
			var id = k + '_' + IX.id(),
				minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = k + '_min', maxName = k + '_max',
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-sm-3',
				}), max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-sm-3',
				});
			ServiceFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else {
			ServiceFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});
	
	var editServiceView = Stapes.subclass({
		/**
		 * 编辑业务详情
		 * @param  {Object} cfg {triggerEl, serviceID, serviceName, model}
		 *              @param {jQueryObj} triggerEl 触发元素 
		 *              @param {String} serviceID 业务ID
		 *              @param {String} serviceName 业务名称
		 *              @param {Object} model 店铺数据模型
		 *              @param {String} serviceFeatures 店铺服务信息
		 *              @param {Function} successFn 编辑成功后的回调
		 * @return {NULL}    
		 */
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl');
			this.serviceID = $XP(cfg, 'serviceID', null);
			this.serviceName = $XP(cfg, 'serviceName', null);
			this.model = $XP(cfg, 'model', null);
			this.serviceFeatures = $XP(cfg, 'serviceFeatures', '');
			this.serviceList = Hualala.TypeDef.ShopBusiness;
			this.modal = null;
			this.successFn = $XF(cfg, 'successFn');
			if (!this.serviceID || !this.serviceName || !this.model) {
				throw("Service View init failed!");
			}
			this.loadTemplates();
			this.serviceInfo = this.getServiceInfo('id', this.serviceID);
			this.callServer = $XP(this.serviceInfo, 'callServer', '');
			if (IX.isFn(this.callServer)) {
				this.callServer = this.callServer;
			} else if (!IX.isString(this.callServer)) {
				throw("Configuration failed : Invalid Page Initialized for " + this.callServer);
				return false;
			} else if (IX.nsExisted(this.callServer)) {
				this.callServer = IX.getNS(this.callServer);
			}
			// var revParamJson = JSON.parse(this.model.get('revParamJson'));
			var revParamJson = this.model.get('revParamJson') || null,
				takeawayParamJson = this.model.get('takeawayParamJson') || null,
				businessCfg = null;
			revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
			takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
			businessCfg = IX.inherit(revParamJson, takeawayParamJson);
			this.formParams = $XP(businessCfg, this.serviceID);
			this.initModal();
			this.renderForm();
			this.bindEvent();
			this.emit('show');
		}
	});
	editServiceView.proto({
		loadTemplates : function () {
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_service_form_layout')),
				btnTpl = Handlebars.compile(Hualala.TplLib.get('tpl_shop_modal_btns'));
			Handlebars.registerHelper('checkFormElementType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			Handlebars.registerHelper('isInputGroup', function (prefix, surfix, options) {
				return (!prefix && !surfix) ? options.inverse(this) : options.fn(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				btnTpl : btnTpl
			});
		},	
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'service_edit',
				clz : 'service-modal',
				title : self.getModalTitle(),
				afterRemove : function () {

				}
				
			});
		},
		initSwitcher : function (selector) {
			var self = this;
			self.modal._.body.find(selector).each(function () {
				var $el = $(this),
					onLabel = $el.attr('data-onLabel'),
					offLabel = $el.attr('data-offLabel');
				$el.bootstrapSwitch({
					size : 'normal',
					onColor : 'primary',
					offColor : 'default',
					onText : onLabel,
					offText : offLabel
				});
			});
		},
		initTimePicker : function (selector) {
			var self = this;
			self.modal._.body.find(selector).timepicker({
				minuteStep : 30,
				showSeconds : false,
				showMeridian :  false,
				disableFocus : true,
				showInputs : false
			});
		},
		initAdsID : function (){
			var self=this;
		    var ads = [],ad,current_group;
		    Hualala.Global.getAdvertorials({},function (rsp){
	   	    	if(rsp.resultcode != '000'){
	                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
	                return;
	            }
            	ads = rsp.data.records || [];
            	_.each(ads, function(record){ record.time = Hualala.Common.formatDateStr(record.actionTime, 8); });
 				groupID = $XP(Hualala.getSessionSite(), 'groupID', '');
 				//获取当前集团的软文id
             	current_group= _.where(ads,{groupID:groupID});
             	self.serviceInfo = self.getServiceInfo('id', self.serviceID);
             	var revParamJson = self.model.get('revParamJson') || null,
					takeawayParamJson = self.model.get('takeawayParamJson') || null,
			        revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
			        takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
             	var adsID='0';
             	if(self.serviceID=='20'||self.serviceID=='21'){
             		if(takeawayParamJson[self.serviceID]!=null&&takeawayParamJson[self.serviceID].adsID!=null){
             				adsID = takeawayParamJson[self.serviceID].adsID
             			}
             			else{
             				adsID ='0';          				
             			}
             	}else{
             		if(revParamJson[self.serviceID]!=null&&revParamJson[self.serviceID].adsID!=null){
             			adsID = revParamJson[self.serviceID].adsID            			
             		}else{
             			adsID ='0';             			
             		}
             	}
             	$adsID=$('select[name=adsID]'),
             	//select填充
				// Hualala.UI.fillSelect($adsID,current_group,'itemID','title', false).prepend('<option value="0">未设置</option>').val('0');
                //拼音匹配的chosen以及选中状态

                Hualala.UI.createChosen($adsID,current_group,'itemID','title',{width : '100%'}, { itemID: '0', title: '未设置' },adsID);
		        // //selected选中的状态
		        // current_group=_.map(current_group,function (current_group){
		        //     return _.extend(current_group,{selected:current_group.value==adsID ? 'selected' : ''});
		        // })
              /*为Select插入一个Option(第一个位置)
              	$adsID.prepend("<option value='0'>未设置</option>");
				$.each(current_group, function(i, value) {
				$adsID.append($("<option/>", {
					value:value.itemID,
					text:value.title
					}));
				})*/
       		});
		},
		initUIComponents : function(){
			var self = this;
			//暂时处理当前model拿到后台数据为店内自助的服务
			self.serviceInfo = self.getServiceInfo('id', self.serviceID);
             	var revParamJson = self.model.get('revParamJson') || null,
					takeawayParamJson = self.model.get('takeawayParamJson') || null,
			        revParamJson = !revParamJson ? {} : JSON.parse(revParamJson);
			        takeawayParamJson = !takeawayParamJson ? {} : JSON.parse(takeawayParamJson);
				$commitSafeLevel = $('select[name=commitSafeLevel]'),
				$inputGrp = $commitSafeLevel.parents('.form-group');
			if(revParamJson[self.serviceID]!=null&&revParamJson[self.serviceID].payBeforeCommit!=null){
				payBeforeCommit = revParamJson[self.serviceID].payBeforeCommit;
				$inputGrp[payBeforeCommit == 1 ? 'addClass' : 'removeClass']('hidden');
			}
			else{
				payBeforeCommit= 1;
				$inputGrp[payBeforeCommit == 1 ? 'addClass' : 'removeClass']('hidden');
			}  
		},
		getServiceInfo : function (key, val) {
			var self = this;
			var operationMode = self.model.get('operationMode');
			var servData = IX.inherit({}, _.find(this.serviceList, function (v) {return v[key] == val}));
			if (!IX.isEmpty($XP(servData, 'operationMode'))) {
				servData = IX.inherit(servData, {
					formKeys : $XP(servData, 'operationMode.' + operationMode)
				});
			}
			return servData;
		},
		getModalTitle : function () {
			return $XP(this.serviceInfo, 'label') + '配置';
		},
		bindEvent : function () {
			var self = this;
			var fvOpts = self.initValidFieldOpts();
			this.on({
				show : function () {
					this.modal.show();
				},
				hide : function () {
					this.modal.hide();
				}
			});
			//判断餐后结账显示下单验证
			self.modal._.dialog.find('form').on('change', 'select[name=payBeforeCommit]', function (e) {
				var $select = $(this),
					val = $select.val(),
					$commitSafeLevel =$('select[name=commitSafeLevel]'),	
					$inputGrp = $commitSafeLevel.parents('.form-group');
				$inputGrp[val == 1 ? 'addClass' : 'removeClass']('hidden');

			});
			self.modal._.dialog.find('form').on('change', ':text[name=servicePeriods_max]',function (e) {
				self.modal._.dialog.find('form').bootstrapValidator('revalidateField', 'servicePeriods_max');
			});
			self.modal._.dialog.find('form').on('change',':text[name=servicePeriods2_max]',function (e) {
				self.modal._.dialog.find('form').bootstrapValidator('revalidateField', 'servicePeriods2_max');
			});
			self.modal._.dialog.find('form').on('change',':text[name=takeawayDeliveryTime]',function (e) {
				self.modal._.dialog.find('form').bootstrapValidator('revalidateField', 'takeawayDeliveryTime');
				self.modal._.dialog.find('form').bootstrapValidator('revalidateField', 'advanceTime');
			});
			//判断勾选第二时段
			self.modal._.dialog.find('form').on('change', ':checkbox[name=servicePeriodsChoice]', function (e) {
				var $input = $(this),
					$servicePeriods2_min = $(':text[name=servicePeriods2_min]'),
					$servicePeriods2_max = $(':text[name=servicePeriods2_max]'),
					val = $('.servicePeriodsChoice:checked').length? 1 : 0;
					if(val==1){
						$servicePeriods2_min.prop("disabled",false);
						$servicePeriods2_max.prop("disabled",false);
					}
					else{
						$servicePeriods2_min.prop("disabled",true);
						$servicePeriods2_max.prop("disabled",true);
					}
			});

			self.modal._.dialog.find('.btn').on('click', function (e) {
				var $btn = $(this),
					act = $btn.attr('name');
				if (act == 'cancel') {
					self.emit('hide');
				} else {
					var bv = self.modal._.body.find('form').data('bootstrapValidator');
					$btn.button('提交中...');
					bv.validate();
				}
			});
			self.modal._.body.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: Shop Business Service Edit View Form Params : ");
				IX.Debug.info(formParams);
				self.model.emit('setServiceParams', {
					callServer : self.callServer,
					params : formParams,
					serviceID : self.serviceID,
					failFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
					},
					successFn : function () {
						self.modal._.footer.find('.btn[name=submit]').button('reset');
						self.emit('hide');
						self.successFn(self.model, self.serviceID, formParams, self.$trigger);
					}
				});
			});;
		},
		decodeTimeStr : function (t) {
			if (t.length == 0) return '';
			return t.substr(0,2) + ':' + t.substr(2);
		},
		encodeTimeStr : function (min, max) {
			return (min + ',' + max).replace(/\:/g, '');
		},
		// 获取表单元素渲染数据
		mapServiceFormElsData : function () {
			var self = this,
				formKeys = $XP(self.serviceInfo, 'formKeys', '').split(','),
				formEls = _.map(formKeys, function (key) {
					var elCfg = ServiceFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'section' && key == 'servicePeriods') {
						var v0 = $XP(self.formParams, key, '').split(';');
						var v = (v0[0]!=undefined && v0[0].length!=0) ? v0[0].split(','):[];
						v = _.map(v, function (t) {
							return self.decodeTimeStr(t);
						});
						return IX.inherit(elCfg, {
							min : IX.inherit($XP(elCfg, 'min'), {
								value : v[0] || $XP(elCfg, 'min.defaultVal')
							}),
							max : IX.inherit($XP(elCfg, 'max'), {
								value : v[1] || $XP(elCfg, 'max.defaultVal')
							})
						});
					} else if (type == 'section' && key == 'servicePeriods2') {
						var v0 = $XP(self.formParams, 'servicePeriods', '').split(';');
						var v;
							if(v0[1]!=undefined && v0[1].length!=0){
								v= v0[1].split(',');
								elCfg.choice=elCfg.choice.replace('data', 'checked')
							}
							else{
								v =[];
								elCfg.choice=elCfg.choice.replace('checked', 'data')	
							}
							v = _.map(v, function (t) {
							return self.decodeTimeStr(t);
						});
						//获取时段1的数据，时段1存在
						var defaultVal,startVal2,endVal2;
							if(v0[0]!=undefined && v0[0].length!=0){
								defaultVal= v0[0].split(',');
								defaultVal = _.map(defaultVal, function (t) {
								return self.decodeTimeStr(t);
							});
								endTime = defaultVal[1].split(':');
								endVal = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10)+120;
								endValb = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10)+180;
								if(endVal>=1440&&endValb>=1440){
									endVal = endVal-1440;
									startVal2 = (parseInt(endVal/60))+":"+(endVal%60);
									endValb=endValb-1440;
									endVal2 = (parseInt(endValb/60))+":"+(endValb%60);
								}
								else if(endVal<1440&&endValb>=1440){
									startVal2 = (parseInt(endVal/60))+":"+(endVal%60);
									endValb=endValb-1440;
									endVal2 = (parseInt(endValb/60))+":"+(endValb%60);
								}
								else if(endVal<1440&&endValb<1440){
									startVal2 = (parseInt(endVal/60))+":"+(endVal%60);
									endVal2 = (parseInt(endValb/60))+":"+(endValb%60);
								}
							}
							//时段1不存在,在默认时间上加两个小时
							else{
								startVal2 = "23:30";
								endVal2 = "0:30";
							}
						return IX.inherit(elCfg, {
							min : IX.inherit($XP(elCfg, 'min'), {
								value : v[0] || startVal2
							}),
							max : IX.inherit($XP(elCfg, 'max'), {
								value : v[1] || endVal2
							})
						});

					} else if (type == 'combo') {
						var v = $XP(self.formParams, key, $XP(elCfg, 'defaultVal')),
							options = _.map($XP(elCfg, 'options'), function (op) {
								return IX.inherit(op, {
									selected : $XP(op, 'value') == v ? 'selected' : ''
								});
							});
						return IX.inherit(elCfg, {
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal')),
							options : options
						});
					} else if (type == 'switcher') {
						if (key == 'checkSpotOrder') {
							return IX.inherit(elCfg, {
								checked : self.serviceFeatures.indexOf('spot_pay') >= 0 ? 'checked' : ''
							});
						} else {
							return IX.inherit(elCfg, {
								checked : $XP(self.formParams, key) == $XP(elCfg, 'defaultVal') ? 'checked' : ''
							});
						}
						
					} else if (type == 'text' && self.serviceID == "20" && key == "minAmount") {
						return IX.inherit(elCfg, {
							label : "起送金额",
							value : $XP(self.formParams, key, 0)
						});
					} else if (type == 'text' && self.serviceID == "20" && key == "serviceAmount") {
						return IX.inherit(elCfg, {
							label : "送餐费",
							value : $XP(self.formParams, key, 0)
						});
					} else if (type == 'text' && self.serviceID == "20" && key == "freeServiceAmount") {
						return IX.inherit(elCfg, {
							label : "免送餐费金额",
							prefix : '满',
							surfix : Hualala.Constants.CashUnit + "，免送餐费",
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal'))
						});
					} else {
						return IX.inherit(elCfg, {
							value : $XP(self.formParams, key, $XP(elCfg, 'defaultVal'))
						});
					}
				});
			IX.Debug.info("DEBUG: Shop Business Service Edit View Form Elements : ");
			IX.Debug.info(formEls);
			return formEls;
		},
		// 渲染表单
		renderForm : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts(),
				renderData = self.mapServiceFormElsData(),
				tpl = self.get('layoutTpl'),
				btnTpl = self.get('btnTpl'),
				htm = tpl({
					formClz : 'shop-service-form form-feedback-out',
					items : renderData
				});
			self.modal._.body.html(htm);
			self.modal._.footer.html(btnTpl({
				btns : [
					{clz : 'btn-default', name : 'cancel', label : '取消'},
					{clz : 'btn-warning', name : 'submit', label : '保存'}
				]
			}));
			//通过是否勾选第二时段来决定是否显示
			if($(':checkbox[name=servicePeriodsChoice]').prop("checked")){
				$(':text[name=servicePeriods2_min]').prop("disabled",false);
				$(':text[name=servicePeriods2_max]').prop("disabled",false);
			}
			else{
				$(':text[name=servicePeriods2_min]').prop("disabled",true);
				$(':text[name=servicePeriods2_max]').prop("disabled",true);
			}
			

			self.initSwitcher(':checkbox[data-type=switcher]');
			self.initTimePicker('[data-type=timepicker]');
			self.initUIComponents();
			self.initAdsID();
		},
		// 获取表单数据
		serializeForm : function () {
			var self = this,
				formKeys = $XP(self.serviceInfo, 'formKeys', '').split(','),
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = ServiceFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					if (type == 'section' && (key == 'servicePeriods' || key == 'servicePeriods2')) {
						var min = $('[name=' + key + '_min]').val(),
							max = $('[name=' + key + '_max]').val();
						ret[key] = self.encodeTimeStr(min, max);
					} else if (type == 'switcher') {
						// ret[key] = $('[name=' + key + ']').attr('checked') ? 1 : 0;
						ret[key] = !$('[name=' + key + ']').data('bootstrapSwitch').options.state ? 0 : 1;
					} else {
						ret[key] = $('[name=' + key + ']').val();
					}
				});
				//根据是否勾选第二时段，来保存是否有第二时段
				servicePeriodsChoice = $('.servicePeriodsChoice:checked').length? 1 : 0;
				ret.servicePeriods2= servicePeriodsChoice?ret.servicePeriods2: [];
				if(ret.servicePeriods2.length!=0){
					ret.servicePeriods=[ret.servicePeriods,ret.servicePeriods2].join(";");	
					delete ret.servicePeriods2;
				}
				//BUG #5443 业务设置，如果为餐前结账，需要把验证设置为不验证
				if(ret.payBeforeCommit!=undefined){
					if(ret.payBeforeCommit.length!=0&&ret.payBeforeCommit=="1"){
						ret.commitSafeLevel="1";
					}
				}
			return ret;
		},
		// 获取表单验证配置
		initValidFieldOpts : function () {
			var self = this,
				formKeys = $XP(self.serviceInfo, 'formKeys', '').split(','),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = ServiceFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if (type == 'section') {
					var min = key + '_min', max = key + '_max';
					ret[min] = $XP(elCfg, 'min.validCfg', {});
					ret[max] = $XP(elCfg, 'max.validCfg', {});
				} else {
					ret[key] = $XP(elCfg, 'validCfg', {});
				}
			});
			return ret;
		}
	});
	Hualala.Setting.editServiceView = editServiceView;


	var bindSettleUnitView = Stapes.subclass({
		constructor : function (cfg) {
			this.$trigger = $XP(cfg, 'triggerEl', null);
			this.settleID = $XP(cfg, 'settleID', '');
			this.model = $XP(cfg, 'model', null);
			this.successFn = $XF(cfg, 'successFn');
			this.getSettleUnitsCallServer = Hualala.Global.queryAccount;
			this.bindSettleUnitCallServer = Hualala.Global.bindSettleUnitByShopID;
			this.modal = null;
			this.$body = null;
			this.$footer = null;
			if (!this.$trigger || !this.settleID || !this.model) {
				throw("Bind Settle Unit View init failed!");
			}
			this.loadTemplates();
			this.initModal();
			this.bindEvent();
			this.emit('load');
		}
	});
	bindSettleUnitView.proto({
		loadTemplates : function () {
			var self = this;
			var layoutTpl = Handlebars.compile(Hualala.TplLib.get('tpl_role_bind_shop')),
				listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_list')),
				itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerPartial("settleItem", Hualala.TplLib.get('tpl_settle_item'));
			Handlebars.registerHelper('checkItemType', function (conditional, options) {
				return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
			});
			this.set({
				layoutTpl : layoutTpl,
				listTpl : listTpl,
				itemTpl : itemTpl
			});
		},
		initModal : function () {
			var self = this;
			self.modal = new Hualala.UI.ModalDialog({
				id : 'bind_settle_modal',
				clz : 'account-modal',
				title : "绑定结算账户"
			});
			self.$body = self.modal._.body;
			self.$footer = self.modal._.footer;
			var layoutTpl = self.get('layoutTpl'),
				htm = layoutTpl({
					clz : '',
					title : '选择店铺要绑定的结算账户'
				});
			self.$body.html(htm);
			self.$resultBox = self.$body.find('.result-box');
		},
		bindEvent : function () {
			var self = this;
			this.on({
				"show" : function () {
					self.modal.show();
					
				},
				"hide" : function () {
					self.modal.hide();
				},
				"load" : function () {
					if (!self.origSettleData) {
						self.getSettleUnitsCallServer({}, function (res) {
							if (res.resultcode != '000') {
								toptip({
									msg : $XP(res, 'resultmsg', ''),
									type : 'danger'
								});
								self.emit('hide');
							} else {
								self.origSettleData = $XP(res, 'data.records', []);
								self.render(self.origSettleData);
								self.emit('show');
							}
						});
					} else {
						self.render(self.origSettleData);
					}
				}
			});
			self.$resultBox.tooltip({
				selector : '[title]'
			});
			self.$resultBox.delegate(':radio', 'change', function (e) {
				var $el = $(this),
					checked = !this.checked ? false : true,
					itemID = $el.val();
				self.curSettleUnit = _.find(self.origSettleData, function (settle) {return $XP(settle, 'settleUnitID', '') == itemID;});
			});
			self.$footer.delegate('.btn', 'click', function (e) {
				var $btn = $(this),
					act = $btn.hasClass('btn-ok') ? 'ok' : 'cancel';
				if (act == 'cancel') {
					self.emit('hide');
				} else {
					// 设置角色绑定店铺数据
					self.bindItems();
					
				}
			});
		},
		bindItems : function () {
			var self = this;
			self.bindSettleUnitCallServer({
				shopID : self.model.get('shopID'),
				settleID : $XP(self.curSettleUnit, 'settleUnitID'),
				settleName : $XP(self.curSettleUnit, 'settleUnitName'),
				oldSettleID : self.settleID
			}, function (res) {
				if (res.resultcode != '000') {
					toptip({
						msg : $XP(res, 'resultmsg', ''),
						type : 'danger'
					});
				} else {
					toptip({
						msg : '绑定成功',
						type : 'success'
					});
					self.emit('hide');
					self.successFn(self.model, self.$trigger, self.curSettleUnit);
				}
			});
		},
		mapRenderData : function (data) {
			var self = this;
			var ret = _.map(data, function (settle, i, l) {
				var id = $XP(settle, 'settleUnitID'),
					checked = id == self.settleID ? 'checked' : '';
				if (checked == 'checked') {
					self.curSettleUnit = settle;
				}
				return IX.inherit(settle, {
					type : 'radio',
					clz : 'bind-item',
					settleUnitNameLabel : $XP(settle, 'settleUnitName', ''),
					checked : checked
				});
			});
			return ret;
		},
		render : function (data) {
			var self = this,	
				listTpl = self.get('listTpl');
			var renderData = self.mapRenderData(data);
			var htm = listTpl({
				settleList : {
					list : renderData
				}
			});
			self.$resultBox.html(htm);
		}
	});
	Hualala.Setting.bindSettleUnitView = bindSettleUnitView;
})(jQuery, window);