(function ($, window) {
	IX.ns("Hualala.MCM");
	var HMCM = Hualala.MCM;
	var popoverMsg = Hualala.UI.PopoverMsgTip,
		toptip = Hualala.UI.TopTip;


	var EventSetFormElsCfg = {
		eventID : {
			type : "hidden",
			defaultVal : ""
		},
		eventName : {
			type : 'text',
			label : "活动主题",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动主题不能为空"
					}
				}
			}
		},
        SMSSendDate: {
            type: 'section',
            label: '短信发送时间',
            min: {
                type: 'datetimepicker',
                defaultVal: '',
                name: 'SMSStartDate',
                validCfg: {
                    validators : {
                        notEmpty : {
                            message: "发送日期不能为空"
                        },
                        date: {
                            format: 'YYYY/MM/DD',
                            message: '日期格式不正确'
                        }
                    }
                }
            },
            max: {
                type: 'timepicker',
                defaultVal: '',
                name: 'SMSStartTime',
                surfix : '<span class="glyphicon glyphicon-time"></span>',
                validCfg: {
                    validators : {
                        notEmpty : {
                            message : "发送时间不能为空"
                        }
                    }
                }
            }
        },
        smsGate: {
            type: 'checkbox',
            label: '是否发送短信',
            defaultVal: '',
            validCfg: {}
        },
        giftAdvanceDays: {
            type: 'text',
            label: '提前赠送天数',
            defaultVal: '',
            surfix: '天',
            validCfg: {
                validators: {
                    notEmpty: {message: '提前赠送天数'},
                    integer: {message: '提前赠送天数天数必须是整数'},
                    greaterThan: {value: 0, message: '提前赠送天数不能小于0'}
                }
            }
        },
		cardLevelID : {
			type : 'combo',
			label : "顾客范围",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.EventCardLevels,
			validCfg : {
				validators : {
					notEmpty : {
						message : "顾客范围不能为空"
					}
				}
			}
		},
		eventWay : {
			type : 'combo',
			label : "活动类型",
			defaultVal : "20",
			options : _.reject(Hualala.TypeDef.MCMDataSet.EventTypes, function (el) {
				return IX.isEmpty($XP(el, 'value')) || $XP(el, 'value') == 50;
			}),
			help : "活动类型选择后，不允许修改，请注意噢！",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动类型不能为空"
					}
				}
			}
		},
		eventRemark : {
			type : 'textarea',
			label : "描述",
			defaultVal : "",
			validCfg : {
				validators : {
					notEmpty : {
						message : "活动说明不能为空"
					}
				}
			}
		},
		dateRange : {
			type : 'section',
			label : '起止日期',
			min : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.min-input',
					validators : {
						notEmpty : {
							message : "请输入起始时间"
						},
						date: {
							format: 'YYYY/MM/DD',
							message: '起始时间格式不正确'
						}
					}
				}
			},
			max : {
				type : 'datetimepicker',
				// surfix : '<span class="glyphicon glyphicon-calendar"></span>',
				defaultVal : '',
				validCfg : {
					group : '.max-input',
					validators : {
						notEmpty : {
							message : "请输入结束时间"
						},
						date: {
							format: 'YYYY/MM/DD',
							message: ' 结束时间格式不正确'
						}
					}
				}
			}
		},
		chkDeductPoints : {
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '参与活动扣减积分'
			}],
			validCfg : {
				validators : {}
			}
		},
		deductPoints : {
			type : "text",
			label : "扣减积分",
			defaultVal : "0",
			// prefix : '￥',
			// surfix : '元',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入扣减积分值"
					},
					numeric : {
						message : "扣减积分必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "扣减积分必须大于或等于0"
					}
				}
			}
		},
		chkSendPoints : {
			type : "checkboxgrp",
			label : "",
			defaultVal : "",
			options : [{
				value : 1, label : '参与活动赠送积分'
			}],
			validCfg : {
				validators : {}
			}
		},
		sendPoints : {
			type : "text",
			label : "赠送积分",
			defaultVal : "0",
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入赠送积分值"
					},
					numeric : {
						message : "赠送积分必须为数字"
					},
					greaterThan : {
						inclusive : true,
						value : 0,
						message : "赠送积分必须大于或等于0"
					}
				}
			}
		},
		radioCountCycleDays : {
			type : "radiogrp",
			label : "会员参与次数",
			defaultVal : "0",
			options : Hualala.TypeDef.MCMDataSet.EventCountCycleDays,
			validCfg : {}
		},
		partInTimes : {
			type : "inputCountCycleDays",
			label : "",
			defaultVal : '1',
			options : _.map([1,2,3,4,5,6,7,15,30,60,90], function (d) {
				return {
					value : d,
					label : d + '天'
				};
			}),
			partInTimes : {
				validCfg : {
					validators : {
						notEmpty : {
							message : "请输入参与次数"
						},
						numeric : {
							message : "参与次数必须为数字"
						},
						greaterThan : {
							inclusive : false,
							value : 0,
							message : "参与次数必须大于0"
						}
					}
				}
			}
		},
        lastTransTime: {
            label: '最后消费时间',
            type : 'datetimepicker',
            defaultVal : '',
            validCfg : {
                validators : {
                    notEmpty : {
                        message : "请输最后消费时间"
                    },
                    date: {
                        format: 'YYYY/MM/DD',
                        message: '时间格式不正确'
                    }
                }
            }
        },
		isVipBirthdayMonth : {
			type : "radiogrp",
			label : "仅本月会员生日可参与",
			defaultVal : '0',
			options : Hualala.TypeDef.MCMDataSet.IsVIPBirthdayMonth,
			validCfg : {}
		},
		maxPartInPerson : {
			type : "text",
			label : "最大报名人数",
			defaultVal : '',
			validCfg : {
				validators : {
					notEmpty : {
						message : "请输入最大报名人数"
					},
					numeric : {
						message : "最大报名人数必须为数字"
					},
					greaterThan : {
						inclusive : false,
						value : 0,
						message : "最大报名人数必须大于0"
					}
				}
			}
		},
		smsTemplate: {
			type: 'text',
			label: '短信模板',
			defaultVal: '',
			validCfg: {
				validators: {
					notEmpty: {message: '短信模板不能为空'}
				}
			}
		}
	};

	var EventSetFormElsHT = new IX.IListManager();
	_.each(EventSetFormElsCfg, function (el, k) {
		var type = $XP(el, 'type');
		var labelClz = 'col-sm-offset-1 col-sm-3 control-label';
		if (type == 'section') {
			var id = minID = k + '_min_' + IX.id(), maxID = k + '_max_' + IX.id(),
				minName = $XP(el, 'min.name', 'eventStartDate'),
				maxName = $XP(el, 'max.name', 'eventEndDate'),
				min = IX.inherit($XP(el, 'min', {}), {
					id : minID, name : minName, clz : 'col-xs-3 col-sm-3 col-md-3',
				}),
				max = IX.inherit($XP(el, 'max', {}), {
					id : maxID, name : maxName, clz : 'col-xs-3 col-sm-3 col-md-3',
				});
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : id,
				labelClz : labelClz,
				min : min,
				max : max
			}));
		} else if (type == 'inputCountCycleDays') {
			var options = $XP(el, 'options');
			var countCycleDays = {
					id : 'countCycleDays' + '_' + IX.id(),
					name : 'countCycleDays',
					options : options
				},
				partInTimes = {
					id : 'partInTimes_' + IX.id(),
					name : 'partInTimes',
					validCfg : $XP(el, 'partInTimes.validCfg', {})
				};

			EventSetFormElsHT.register(k, IX.inherit(el, {
				labelClz : labelClz,
				clz : 'col-sm-8',
				countCycleDays : countCycleDays,
				partInTimes : partInTimes
			}));

		} else if (type == 'radiogrp' || type == 'checkboxgrp') {
			var ops = _.map($XP(el, 'options'), function (op) {
				return IX.inherit(op, {
					id : k + '_' + IX.id(),
					name : k,
					clz : (type == 'radiogrp' ? ' radio-inline' : ' checkbox-inline')
				});
			});
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				options : ops,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else if (type == 'selectShops') {
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-7'
			}));
		} else {
			EventSetFormElsHT.register(k, IX.inherit(el, {
				id : k + '_' + IX.id(),
				name : k,
				labelClz : labelClz,
				clz : 'col-sm-5'
			}));
		}
	});

	HMCM.EventSetFormElsHT = EventSetFormElsHT;

    HMCM.EventBaseFormKeysMap = {
        '20': 'eventName,dateRange,eventRemark'.split(','),
        '21': 'eventName,dateRange,eventRemark'.split(','),
        '22': 'eventName,dateRange,eventRemark'.split(','),
        '30': 'eventName,dateRange,eventRemark'.split(','),
        '40': 'eventName,dateRange,eventRemark'.split(','),
        '41': 'eventName,dateRange,eventRemark'.split(','),
        '50': 'eventName,SMSSendDate,eventRemark'.split(','),
        '51': 'eventName,giftAdvanceDays,eventRemark'.split(',')
    };
	var EventBaseInfoFormKeys = 'eventName,cardLevelID,eventWay,eventRemark'.split(',');


	/**
	 * 整理礼品基本信息表单渲染数据
	 * @return {[type]} [description]
	 */
	var mapEventBaseInfoFormElsData = function () {
		var self = this,
			formKeys = self.formKeys;
		var ret = _.map(formKeys, function (key) {
			var elCfg = EventSetFormElsHT.get(key),
				type = $XP(elCfg, 'type');
			if (type == 'combo' && key == 'cardLevelID') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					levels = _.map(self.model.CardLevelIDSet, function (el) {
						return {
							value : $XP(el, 'cardLevelID'),
							label : $XP(el, 'cardLevelName'),
							isActive : $XP(el, 'isActive')
						}
					});
				levels = _.filter(levels, function (el) {return $XP(el, 'isActive') == '1';});
				var options = $XP(elCfg, 'options', []).concat(levels);
				options = _.map(options, function (op) {
					return IX.inherit(op, {
						selected : $XP(op, 'value') == v ? 'selected' : ''
					});
				});
				return IX.inherit(elCfg, {
					value : v,
					options : options
				});
			} else if (type == 'combo') {
				var v = self.model.get(key) || $XP(elCfg, 'dafaultVal'),
					options = _.map($XP(elCfg, 'options'), function (op) {
						return IX.inherit(op, {
							selected : $XP(op, 'value') == v ? 'selected' : ''
						});
					});
				return IX.inherit(elCfg, {
					disabled : (self.mode == 'edit' && key == 'eventWay') ? 'disabled' : '',
					value : v,
					options : options
				});
			} else if (type == 'textarea') {
                return IX.inherit(elCfg, {
                    value : Hualala.Common.decodeTextEnter(self.model.get(key) || '') || $XP(elCfg, 'dafaultVal')
                });
            } else if (type == 'section') {
                var isSMS = key == 'SMSSendDate',
                    eventStartDate = self.model.get('eventStartDate') || '',
                    eventEndDate = self.model.get('eventEndDate') || '',
                    smsStartDate = (self.model.get('startTime') || '').substr(0, 8),
                    smsStartTimeStr = (self.model.get('startTime') || '').substr(8),
                    smsStartTime = smsStartTimeStr ? (smsStartTimeStr.substr(0,2) + ':' + smsStartTimeStr.substr(2)) : '';
                eventStartDate = (IX.isEmpty(eventStartDate) || eventStartDate == 0) ? '' : eventStartDate;
                eventEndDate = (IX.isEmpty(eventEndDate) || eventEndDate == 0) ? '' : eventEndDate;
                smsStartDate = (IX.isEmpty(smsStartDate) || smsStartDate == 0) ? '' : smsStartDate;
                return IX.inherit(elCfg, {
                    min : IX.inherit($XP(elCfg, 'min'), {
                        value : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(smsStartDate || eventStartDate), 'yyyy/MM/dd')
                    }),
                    max : IX.inherit($XP(elCfg, 'max'), {
                        value : isSMS ? smsStartTime : IX.Date.getDateByFormat(Hualala.Common.formatDateTimeValue(eventEndDate), 'yyyy/MM/dd'),
                        hiddenBetween: isSMS ? 'hidden' : ''
                    })
                });
            } else {
                var eventWay = self.model.get('eventWay'),
                    isBirthdayEvent = key == 'eventName' && eventWay == 51,
                    value = isBirthdayEvent ? '生日赠送' : (self.model.get(key) || $XP(elCfg, 'dafaultVal'));
				return IX.inherit(elCfg, {
					value : value,
                    type: isBirthdayEvent ? 'static' : type
				});
			}
		});
		return ret;
	};

	var EventBaseInfoStepView = HMCM.GiftBaseInfoStepView.subclass({
		constructor : function (cfg) {
			var self = this;
			this.mode = $XP(cfg, 'mode', '');
			this.container = $XP(cfg, 'container', '');
			this.parentView = $XP(cfg, 'parentView');
			this.model = $XP(cfg, 'model');
			this.successFn = $XF(cfg, 'successFn');
			this.failFn = $XF(cfg, 'failFn');

			this.mapFormElsData = $XF(cfg, 'mapFormElsData');
			if (!this.model || !this.parentView) {
				throw("Event Base Info View init faild!");
			}

			this.loadTemplates();
			this.initBaseCfg();
			this.formParams = this.model.getAll();
			this.renderForm(function () {
				self.initUIComponents();
				self.bindEvent();
			});
		}
	});
	EventBaseInfoStepView.proto({
		initBaseCfg : function () {
			this.formKeys = EventBaseInfoFormKeys;
		},
		renderForm : function (cbFn) {
			var self = this;
			var renderFn = function () {
				var renderData = self.mapFormElsData.call(self),
					tpl = self.get('layoutTpl'),
					btnTpl = self.get('btnTpl'),
					htm = tpl({
						formClz : 'wizard-step-form form-feedback-out',
						items : renderData
					});
				self.container.html(htm);
				cbFn();
			};
			self.model.emit("loadCardLevelIDs", {
				successFn : function () {
					renderFn();
				},
				failFn : function () {
					renderFn();
				}
			});
				
			
		},
		initUIComponents : function () {
			var self = this;
			var eventWay = self.model.get('eventWay');
			self.container.find('[name=eventWay]').attr('disabled', (self.mode == 'edit'));
		},
		bindEvent : function () {
			var self = this,
				fvOpts = self.initValidFieldOpts();
			self.container.find('form').bootstrapValidator({
				trigger : 'blur',
				fields : fvOpts
			}).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				self.failFn(self.model);
			}).on('success.form.bv', function (e, data) {
				e.preventDefault();
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				var act = self.mode + 'Event';
				var formParams = self.serializeForm();
				IX.Debug.info("DEBUG: Event Wizard Form Params:");
				IX.Debug.info(formParams);
				self.model.emit(act, {
					params : IX.inherit(self.model.getAll(), formParams),
					faildFn : function () {
						self.failFn.call(self);
					},
					successFn : function () {
						self.switchViewMode('edit');
						self.successFn.call(self);
						
					}
				});
				// self.model.emit('saveCache', {
				// 	params : formParams,
				// 	failFn : function () {
				// 		self.failFn.call(self);
				// 	},
				// 	successFn : function () {
				// 		self.successFn.call(self);

				// 	}
				// })
			});
		},
		initValidFieldOpts : function () {
			var self = this,
				formKeys = _.reject(self.formKeys, function (k) {return k == 'eventID'}),
				ret = {};
			_.each(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				ret[key] = $XP(elCfg, 'validCfg', {});
			});
			return ret;
		},
		serializeForm : function () {
			var self = this,
				formKeys = self.formKeys,
				ret = {},
				formEls = _.map(formKeys, function (key) {
					var elCfg = EventSetFormElsHT.get(key),
						type = $XP(elCfg, 'type');
					ret[key] = $('[name=' + key + ']', self.container).val();
				});
			return ret;
		},
		switchViewMode : function (mode) {
			this.mode = mode;
			this.parentView.switchViewMode(mode);
		},
		refresh : function () {
			var self = this;
			this.formParams = this.model.getAll();
			self.initUIComponents();
		},
		delete : function (successFn, faildFn) {
			var self = this;
			self.model.emit('deleteItem', {
				itemID : self.model.get('eventID'),
				successFn : function (res) {
					successFn(res);
				},
				faildFn : function (res) {
					faildFn(res);
				}
			});
		}
	});
	HMCM.EventBaseInfoStepView = EventBaseInfoStepView;

    var StepEventBaseInfoView = HMCM.GiftBaseInfoStepView.subclass({
        constructor: function(cfg) {
            var self = this;
            this.mode = $XP(cfg, 'mode', '');
            this.container = $XP(cfg, 'container', '');
            this.parentView = $XP(cfg, 'parentView');
            this.model = $XP(cfg, 'model');
            this.successFn = $XF(cfg, 'successFn');
            this.faildFn = $XF(cfg, 'faildFn');
            this.mapFormElsData = $XF(cfg, 'mapFormElsData');
            if(!this.model || !this.parentView) {
                throw('Event Base Info View init failed!');
            }
            this.loadTemplates();
            this.initBaseCfg();
            this.formParams = self.model.getAll();
            this.renderForm(function() {
				self.initUIComponents();
                self.bindEvent();
            });
        }
    });
    StepEventBaseInfoView.proto({
        initBaseCfg: function() {
			var self = this,
				eventWay = self.model.get('eventWay');
            this.formKeys = HMCM.EventBaseFormKeysMap[eventWay];
        },
		initUIComponents: function() {
			var self = this,
				$baseInfoForm = self.container.find('form'),
				$smsSwitch = $baseInfoForm.find('[name="smsGate"]');
			$baseInfoForm.find('[data-type="datetimepicker"]').datetimepicker({
				format: 'yyyy/mm/dd',
				startDate: '2015/01/01',
				autoclose: true,
				minView: 'month',
				todayBtn: true,
				todayHighlight: true,
				language: 'zh-CN'
			});
			$baseInfoForm.find('input[name="SMSStartTime"]').timepicker({
				minuteStep: 30,
				showMeridian: false,
				showInputs: false
			});
			if($smsSwitch.length > 0) {
				$smsSwitch.bootstrapSwitch({
					state: $smsSwitch.attr('data-status') == 1,
					onText: '发送',
					offText: '不发送',
					onColor: 'success'
				});
				$smsSwitch.on('switchChange.bootstrapSwitch', function(e, state){
					var $SMSStartTime = $(e.target).parents('.form-group').next('.form-group');
					$SMSStartTime.toggleClass('hidden');
				});
			}
		},
        renderForm: function(cbFn) {
            var self = this,
                renderData = self.mapFormElsData.call(self),
                tpl = self.get('layoutTpl'),
                btnTpl = self.get('btnTpl'),
                htm = tpl({
                    formClz : 'wizard-step-form form-feedback-out',
                    items : renderData
                });
            self.container.html(htm);
            cbFn();
        },
        bindEvent: function() {
            var self = this,
				eventWay = self.model.get('eventWay'),
                fvOpts = self.initValidFieldOpts(),
				$baseInfoForm = self.container.find('form');
            $baseInfoForm.bootstrapValidator({
                trigger: 'blur',
                fields: fvOpts
            }).on('error.field.bv', function (e, data) {
				var $form = $(e.target),
					bv = $form.data('bootstrapValidator');
				self.faildFn(self);
			}).on('success.form.bv', function(e) {
				var formParams = self.serializeForm(),
					isEventDateValid = parseInt(formParams.eventStartDate || 0) > parseInt(formParams.eventEndDate || 0);
				if(isEventDateValid) {
					self.parentView.switchWizardCtrlStatus('reset');
					toptip({msg: '活动结束日期不能小于开始日期', type: 'danger'});
					return;
				}
                e.preventDefault();
                var $form = $(e.target),
                    bv = $form.data('bootstrapValidator');
                var act = self.mode + 'Event';
                self.model.emit(act, {
                    params : IX.inherit(self.model.getAll(), formParams),
                    faildFn : function (res) {
						if(res.resultcode == 'BP10001') {
							toptip({msg: res.resultmsg, type: 'danger'});
						}
                        self.faildFn.call(self);
                    },
                    successFn : function () {
						self.switchViewMode('edit');
						self.successFn.call(self);
					}
                });
            });
			$baseInfoForm.on('change', '[data-type="datetimepicker"],[date-type="timepicker"]', function (e) {
				var $this = $(this),
					name = $this.attr('name');
                $baseInfoForm.bootstrapValidator('revalidateField', name);
			});
        },
        initValidFieldOpts: function() {
            var self = this,
                formKeys = _.reject(self.formKeys, function (key) { return key == 'eventID'; }),
                ret = {};
            _.each(_.uniq(formKeys), function (key) {
                var elCfg = EventSetFormElsHT.get(key),
                    type = $XP(elCfg, 'type');
				if (key == 'dateRange') {
					ret['eventStartDate'] = _.pick($XP(elCfg, 'min.validCfg', {}), 'validators');
					ret['eventEndDate'] = _.pick($XP(elCfg, 'max.validCfg', {}), 'validators');
				} else if(key == 'SMSSendDate'){
                    ret['SMSStartDate'] = _.pick($XP(elCfg, 'min.validCfg', {}), 'validators');
                    ret['SMSStartTime'] = _.pick($XP(elCfg, 'max.validCfg', {}), 'validators');
                } else {
					ret[key] = $XP(elCfg, 'validCfg', {});
				}
            });
			return ret;
		},
        serializeForm: function() {
            var self = this,
                formKeys = self.formKeys,
                ret = {};
			_.each(formKeys, function (key) {
				var elCfg = EventSetFormElsHT.get(key),
					type = $XP(elCfg, 'type');
				if(key == 'dateRange') {
					ret.eventStartDate = IX.Date.getDateByFormat($('[name="eventStartDate"]', self.container).val(), 'yyyyMMdd');
					ret.eventEndDate = IX.Date.getDateByFormat($('[name="eventEndDate"]', self.container).val(), 'yyyyMMdd');
				} else if(key == 'SMSSendDate'){
                    ret.startTime = IX.Date.getDateByFormat($('[name="SMSStartDate"]', self.container).val(), 'yyyyMMdd')
                        + ($('[name="SMSStartTime"]', self.container).val()).replace(/\:/, '');
                } else if(key == 'smsGate'){
					ret[key] = $('[name="' + key + '"]', self.container).bootstrapSwitch('state') ? '1' : '0';
				}else {
					ret[key] = $('[name="' + key + '"]', self.container).val() || '';
				}
			});
			return self.model.get('eventWay') == 51 ? IX.inherit(ret, {eventName: '生日赠送'}) : ret;
        },
        delete : function (successFn, faildFn) {
            var self = this;
            self.model.emit('deleteItem', {
                itemID : self.model.get('eventID'),
                successFn : function (res) {
                    successFn(res);
                },
                faildFn : function (res) {
                    faildFn(res);
                }
            });
        },
		switchViewMode : function (mode) {
			this.mode = mode;
			this.parentView.switchViewMode(mode);
		}
    });
    HMCM.StepEventBaseInfoView = StepEventBaseInfoView;

	/**
	 * 创建向导中活动基本信息步骤
	 * @param  {[type]} $cnt       [description]
	 * @param  {[type]} cntID      [description]
	 * @param  {[type]} wizardMode [description]
	 * @return {[type]}            [description]
	 */
	var initEventBaseInfoStep = function ($cnt, cntID, wizardMode) {
		var wizardModalView = this,
			stepView = new HMCM.EventBaseInfoStepView({
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
				mapFormElsData : mapEventBaseInfoFormElsData
			});
		wizardModalView.registerStepView(cntID, stepView);
	};

	HMCM.initEventBaseInfoStep = initEventBaseInfoStep;

	/*
	*创建短信群发活动
	*群发短信基本信息
	* */
	function initStepEventBaseInfo($cnt, cntID, wizardMode) {
        var wizardView = this,
            stepView = new HMCM.StepEventBaseInfoView({
                mode: wizardMode,
                container: $cnt,
                parentView: wizardView,
                model: wizardView.model,
                successFn: function() {
                    var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                    self.parentView.getNextStep();
                },
                faildFn: function() {
                    var self = this;
                    self.parentView.switchWizardCtrlStatus('reset');
                },
                mapFormElsData: mapEventBaseInfoFormElsData
            });
        wizardView.registerStepView(cntID, stepView);
	}
	HMCM.initEventBaseInfo = initStepEventBaseInfo;

	/*
	* 创建群发短信
	* 第二步：设置群发客户范围
	* 第三步：设置短信模板
	* 第四步：启用短信活动
	* */
	function SMSStepChange($curNav, $navBar, cIdx, nIdx) {
        var wizardModalView = this,
            curID = wizardModalView.getTabContentIDByIndex($navBar, cIdx),
            nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
            $nextCnt = $('#' + nextID, wizardModalView.$wizard),
            nextView = wizardModalView.getStepView(nextID);
        var stepsFns = [
            'initEventBaseInfo',
            'initSMSCustomerRange',
            'initSMSTemplate',
            'initEventOpenStep'
        ];
        if(cIdx == -1 || nIdx == 0) return true;
        if(!nextView) {
            HMCM[stepsFns[nIdx]].call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
        } else{
			nIdx == 3 && nextView.refresh();
		}
        return true;
	}

	HMCM.SMSOnStepChange = SMSStepChange;

    var birthdayEventStepChange = function($curNav, $navBar, cIdx, nIdx) {
        var wizardViewModal = this,
            nextID = wizardViewModal.getTabContentIDByIndex($navBar, nIdx),
            $nextCnt = $('#' + nextID, wizardViewModal.$wizard),
            nextView = wizardViewModal.getStepView(nextID),
            stepsFns = [
                'initEventBaseInfo',
                'initEventGiftSetStep',
                'initSMSTemplate',
                'initEventOpenStep'
            ];
        if(cIdx == -1 || nIdx == 0) return true;
        if(!nextView) {
            HMCM[stepsFns[nIdx]].call(wizardViewModal, $nextCnt, nextID, wizardViewModal.mode);
        } else {
            nIdx == 3 && nextView.refresh();
        }
        return;
    };
    Hualala.MCM.BirthdayEventStepChange = birthdayEventStepChange;

	/**
	 * 当活动向导步骤变化时触发的事件
	 * @param  {[type]} $curNav [description]
	 * @param  {[type]} $navBar [description]
	 * @param  {[type]} cIdx    [description]
	 * @param  {[type]} nIdx    [description]
	 * @return {[type]}         [description]
	 */
	var onEventWizardStepChange = function ($curNav, $navBar, cIdx, nIdx) {
		var wizardModalView = this;
		var curID = wizardModalView.getTabContentIDByIndex($navBar, cIdx),
			nextID = wizardModalView.getTabContentIDByIndex($navBar, nIdx),
			$nextCnt = $('#' + nextID, wizardModalView.$wizard),
			nextView = wizardModalView.getStepView(nextID);
		var stepFns = [
			'initEventBaseInfo',
			'initSMSCustomerRange',
			'initEventRuleStep',
			'initEventGiftSetStep',
			'initEventOpenStep'
		];
		if (cIdx == -1 && nIdx == 0) return true;
		if (!nextView) {
			HMCM[stepFns[nIdx]].call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 1 && HMCM.initEventRuleStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 0 && HMCM.initEventBaseInfoStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
			// nIdx == 2 && HMCM.initEventGiftSetStep.call(wizardModalView, $nextCnt, nextID, wizardModalView.mode);
		} else {
			//需要刷新的数据的步骤：规则设置，预览启用
			var refreshStep = [2, 4];
			if(_.contains(refreshStep, nIdx)) nextView.refresh();
		}
		return true;
	};

	HMCM.onEventWizardStepChange = onEventWizardStepChange;

	/**
	 * 当活动向导步骤提交时触发的事件
	 * @param  {[type]} curID [description]
	 * @return {[type]}       [description]
	 */
	HMCM.onEventWizardStepCommit = function (curID) {
		var wizardModalView = this,
			stepView = wizardModalView.getStepView(curID),
			$cnt = stepView.container,
			$form = $cnt.find('form'),
			bv = $form.data('bootstrapValidator');
		wizardModalView.switchWizardCtrlStatus('loading');
		if (curID == 'event_on') {
			stepView.submit();
		} else {
			bv.validate();
		}
	};

	/**
	 * 绑定礼活动向导的事件
	 * @return {[type]} [description]
	 */
	HMCM.bundleEventWizardEvent = function () {
		var wizardModalView = this;
		wizardModalView.$wizard.find('.wizard-ctrl .btn-cancel').on('click', function (e) {
			var $btn = $(this);
			var wizardType = wizardModalView.wizardType;
			var curIdx = wizardModalView.$wizard.bsWizard('currentIndex'), 
				cntID = wizardModalView.getTabContentIDByIndex(wizardModalView.$wizard.find('.wizard-nav'), curIdx),
				stepView = wizardModalView.stepViewHT.get(cntID);
			var eventID = wizardModalView.model.get('eventID');
			if (!eventID && curIdx == 0) {
				wizardModalView.modal.hide();
			} else if (eventID && wizardType == 'create') {
				Hualala.UI.Confirm({
					title : '取消创建活动配置',
					msg : '是否取消创建活动的操作？<br/>所有操作步骤都不保存！',
					okLabel : '确定',
					okFn : function () {
						stepView.delete(function (res) {
							var pContainer = wizardModalView.parentView.$container;
							var pResultController = pContainer.data('resultController'),
								pResultView = null;
							if (!pResultController) {
								wizardModalView.parentView.model.emit('load');
							} else {
								pResultView = pResultController.model.emit('load');
							}
							wizardModalView.modal.hide();
						}, function (res) {
							toptip({
								msg : $XP(res, 'resultmsg', ''),
								type : 'danger'
							});
						});
					}
				});
			} else {
				Hualala.UI.Confirm({
					title : '取消编辑活动配置',
					msg : '是否取消当前步骤的操作？<br/>当前步骤的修改将不保存！',
					okLabel : '确定',
					okFn : function () {
						var pContainer = wizardModalView.parentView.$container;
						var pResultController = pContainer.data('resultController'),
							pResultView = null;
						if (!pResultController) {
							wizardModalView.parentView.model.emit('load');
						} else {
							pResultView = pResultController.model.emit('load');
						}
						wizardModalView.modal.hide();
					}
				});
			}
		});
	}

})(jQuery, window);