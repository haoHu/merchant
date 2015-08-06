(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        C = Hualala.Common,
        CrmTypeDef = Hualala.TypeDef.CRM,
        formatDateStr = C.formatDateStr,
        prettyNumeric = C.Math.prettyNumeric,
        parseForm = C.parseForm,
        tplLib = Hualala.TplLib,
        U = Hualala.UI,
        topTip = Hualala.UI.TopTip;
	Hualala.CRM.initPreferential = function($crm){    
        var Meta = {
            //pref: {
            //    shopName: '店铺名称', startDate: '开始日期', endDate: '结束日期', discountType: '折扣促销方式', discountRate: '促销折扣率', pointType: '积分促销方式', pointRate: '促销积分系数', actionTime: '修改时间', isActive: '是否启用', action: '操作'
            //},
            //pref: { shopName: '店铺名称', shopPref: '默认特惠', crmPref: '会员日特惠'},C端暂时没支持会员日特惠 先屏蔽掉
            pref: { shopName: '店铺名称', shopPref: '默认特惠'},
            discountType: { '0': '会员保底折扣率', '1': '折上折' },
            pointType: { '0': '倍数', '1': '叠加' },
            isActive: { '0': '未启用', '1': '已启用' },
            stateIco: {
                '0': '<i class="glyphicon glyphicon-minus no"></i>',
                '1': '<i class="glyphicon glyphicon-ok ok"></i>'
            }
        };
        var getParams = {pageNo: 1, pageSize: 15},
            $crmPref = $(tplLib.get('tpl_crm_pref')),
            $table = $crmPref.filter('table'),
            $headTR = $table.find('thead tr'),
            $tbody = $table.find('tbody'),
            $switchCheckbox = null;
        $pager = $('<div>').addClass('pull-right');
            
        var prefs = null, pref = Meta.pref, stateIco = Meta.stateIco, ths = [];
        var trTpl = Handlebars.compile(tplLib.get('tpl_crm_pref_tr'));
        Handlebars.registerPartial('cycleTplRadio', tplLib.get('tpl_radio'));
        Handlebars.registerPartial('customSelect', tplLib.get('tpl_select'));

        for(var key in pref) {
            var clz = 'col-md-4';
            if(key == 'shopName') clz = 'col-md-2';
            ths.push($('<th class="' + clz + '">').text(pref[key]));
        }
        $headTR.append(ths);
        $crm.append($crmPref);
        $crm.append($pager);
        
        U.createSchemaChosen($('[name=shopID]'), $('[name=cityID]'));
        getCrmPreferential(getParams);
        $queryForm = $crmPref.find('form');
        //绑定查询事件
        $crmPref.on('click', 'button.btn-warning', function(){
            getParams.pageNo = 1;
            $.extend(getParams, parseForm($queryForm));
            getCrmPreferential(getParams);
            return false;
        });
        
        var tplForm = Handlebars.compile(tplLib.get('tpl_crm_pref_update')),
            cpref = null, $ctr = null,
            modal = null, $form = null, bv = null;
        //修改的绑定事件    
        $table.on('click', 'button', function (e) {
            var $this = $(this),
                $tr = $this.parents('tr'),
                prefType = $this.parents('td').data('type'),
                id = $tr.data('itemid');
            cpref = findPref(id) || {};
            var formData = IX.clone(cpref),
                modalTitle = '默认特惠';
            if (prefType == 'shop') {
                listShopPrefData(formData);
            } else if (prefType == 'pref') {
                modalTitle = '会员特惠';
                listMemberPrefData(formData);
            }
            $ctr = $this.parents('tr');
            modal = new U.ModalDialog({
                id: 'crm_preferential',
                title: modalTitle + '参数设置',
                html: $form,
                backdrop: 'static'
            }).show();

            registerFormValidate();
            bindFormEvent();
            $form.find('[type="radio"][name="discountType"]:checked, [type="radio"][name$="DiscountType"]:checked').trigger('change');
            $form.find('[type="radio"][name="pointType"]:checked, [type="radio"][name$="PointType"]:checked').trigger('change');
            bv = $form.data('bootstrapValidator');
            modal._.footer.find('.btn-ok').on('click', submitPref);
        });

        function listShopPrefData(formData) {
            var startDate = formData.startDate == 0 ? IX.Date.getDateByFormat(new Hualala.Date((new Date()).getTime() / 1000).toText(), 'yyyyMMdd') : formData.startDate,
                endDate = formData.endDate == 0 ? IX.Date.getDateByFormat(new Hualala.Date((new Date('3000/12/31')).getTime() / 1000).toText(), 'yyyyMMdd') : formData.endDate;
            formData.isShopPref = true;
            formData.startDate = formatDateStr(startDate);
            formData.endDate = formatDateStr(endDate);
            $form = $(tplForm(formData));
            $form.find('[name="discountType"]').eq(+formData.discountType).prop('checked', true);
            $form.find('[name="pointType"]').eq(+formData.pointType).prop('checked', true);
            $form.find('[name=startDate],[name=endDate]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/01/01',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
            });
        }

        function listMemberPrefData(formData) {
            var weekMap = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                typeMap = ['年', '月', '周'],
                selectLabelMap = ['月', '日', ''];
            var month = 0, day = 0, week = 0, cycleType = formData.memberDayCycle, cycleDay = formData.memberDay;
            switch (cycleType) {
                case '1':
                    month = parseInt(cycleDay.substr(0, 2));
                    day = parseInt(cycleDay.substr(2));
                    week = 0;
                    break;
                case '2':
                    month = 0;
                    day = parseInt(cycleDay);
                    week = 0;
                    break;
                case '3':
                    month = 0;
                    day = 0;
                    week = parseInt(cycleDay);
                    break;
                default :
                    var currentDay = new Date(),
                        currentDayArr = currentDay.toLocaleDateString().split('/');
                    cycleType = formData.memberDayCycle = 1;
                    month = currentDayArr[1];
                    day = currentDayArr[2];
                    week = 0;
                    break;
            }
            var selectMap = [
                    {name: 'month', times: 12, selVal: month},
                    {name: 'day', times: 31, selVal: day},
                    {name: 'week', times: 7, selVal: week}
                ],
                selectData = _.map(selectMap, function (data) {
                    var selectName = $XP(data, 'name', '');
                    return {
                        options: _.times(data.times, function (idx) {
                            return {
                                name: selectText = selectName == 'week' ? weekMap[idx] : (idx + 1),
                                value: idx + 1,
                                selected: (idx + 1) == $XP(data, 'selVal', '') ? 'selected' : ''
                            };
                        }), name: selectName
                    };
                });
            formData.isCrmPref = true;
            formData.cycleRadioData = {
                label: '周期长度', name: 'memberDayCycle',
                inputs: _.times(3, function(idx) {
                    var type = (idx + 1) + '';
                    return {checked: cycleType == type ? 'checked' : '', value: type, text: typeMap[idx]};
                })
            };
            formData.cycleSelectData = _.map(selectData, function (data, idx) {
                var cycleName = $XP(data, 'name', ''),
                    isHidden = (cycleType == 1 && cycleName == 'week') ||
                        (cycleType == 2 && (cycleName == 'month' || cycleName == 'week')) ||
                        (cycleType == 3 && (cycleName == 'month' || cycleName == 'day'));
                return {selectData: data, hidden: isHidden ? 'hidden' : '', cycleType: cycleName, cycleLabel: selectLabelMap[idx]};
            });
            $form = $(tplForm(formData));
            $form.find('[name=memberDayDiscountType]').eq(+(formData.memberDayDiscountType || 0)).prop('checked', true);
            $form.find('[name="memberDayPointType"]').eq(+(formData.memberDayPointType || 0)).prop('checked', true);
        }

        function bindFormEvent() {
            $form.off('change', '[type=radio]')
                .on('change', '[type=radio]:not([name="memberDayCycle"])', function(e)
                {
                    //促销积分系数的倍率和叠加 设置的范围不一样
                    var $this = $(this),
                        radioName = $this.attr('name'),
                        radioType = $this.val(),
                        validatorFieldName = radioName.replace(/type/i, 'Rate'),
                        message, minVal, maxVal;
                    if(this.checked) {
                        $(this).parent().parent().find('div').text($(this).data('tip'));
                    }
                    if(_.contains(['pointType', 'memberDayPointType'], radioName)) {
                        switch (radioType) {
                            case '1':
                                minVal = 0;
                                maxVal = 1;
                                message = '促销积分系数必须在0-1之间';
                                break;
                            case '0':
                            default :
                                minVal = 1;
                                maxVal = 5;
                                message = '促销积分系数必须在1-5之间';
                                break;
                        }
                        $form.bootstrapValidator('updateOption', validatorFieldName, 'between', 'min', minVal)
                            .bootstrapValidator('updateOption', validatorFieldName, 'between', 'max', maxVal)
                            .bootstrapValidator('revalidateField', validatorFieldName)
                            .bootstrapValidator('updateMessage', validatorFieldName, 'between', message);
                        //修改指定field的error message(updateMessage只修改了error对应的dom元素的text，并没有从本质上修改validator的message)
                        var betweenValidators = $form.data('bootstrapValidator').options.fields[validatorFieldName].validators.between;
                        betweenValidators.message = message;
                    }
                }).on('change', '[type="radio"][name="memberDayCycle"]', function (e) {
                var $this = $(this),
                    $monthSet = $form.find('div[data-type="month"]'),
                    $daySet = $form.find('div[data-type="day"]'),
                    $weekSet = $form.find('div[data-type="week"]'),
                    cycleType = $this.val();
                switch (cycleType) {
                    case '1':
                        $monthSet.removeClass('hidden');
                        $daySet.removeClass('hidden');
                        $weekSet.addClass('hidden');
                        break;
                    case '2':
                        $daySet.removeClass('hidden');
                        $monthSet.addClass('hidden');
                        $weekSet.addClass('hidden');
                        break;
                    case '3':
                        $daySet.addClass('hidden');
                        $monthSet.addClass('hidden');
                        $weekSet.removeClass('hidden');
                        break;
                }
            });
        }

        function registerFormValidate() {
            $form.bootstrapValidator({
                fields: {
                    startDate: {
                        validators: {
                            date: {
                                format: 'YYYY/MM/DD',
                                message: '开始日期格式不正确'
                            },
                            notEmpty: {message: '开始日期不能为空'}
                        }
                    },
                    endDate: {
                        validators: {
                            date: {
                                format: 'YYYY/MM/DD',
                                message: '结束日期格式不正确'
                            }
                        }
                    },
                    discountRate: {
                        validators: {
                            notEmpty: { message: '促销折扣率不能为空' },
                            between: { message: '促销折扣率必须是0-1的值', min: 0, max: 1, inclusive: true },
                            numeric: {message: '促销折扣率必须是数值'},
                            stringLength: {message: '长度不能超过10', min: 1, max: 11}
                        }
                    },
                    pointRate: {
                        validators: {
                            notEmpty: { message: '促销积分系数不能为空' },
                            between: { message: '促销积分系数必须在1-5之间', min: 1, max: 5, inclusive: true },
                            numeric: {message: '促销积分系数必须是数值'},
                            stringLength: {message: '长度不能超过10', min: 1, max: 11}
                        }
                    },
                    memberDayDiscountRate: {
                        validators: {
                            notEmpty: { message: '促销折扣率不能为空' },
                            between: { message: '促销折扣率必须是0-1的值', min: 0, max: 1, inclusive: true },
                            numeric: {message: '促销折扣率必须是数值'},
                            stringLength: {message: '长度不能超过10', min: 1, max: 11}
                        }
                    },
                    memberDayPointRate: {
                        validators: {
                            notEmpty: { message: '促销积分系数不能为空' },
                            between: { message: '促销积分系数必须在1-5之间', min: 1, max: 5, inclusive: true },
                            numeric: {message: '促销积分系数必须是数值'},
                            stringLength: {message: '长度不能超过10', min: 1, max: 11}
                        }
                    }
                }
            });
        }
        function submitPref()
        {
            if(!bv.validate().isValid()) return;
            var data = parseForm($form);
            if(data.startDate) {
                data.startDate = (data.startDate || '0').replace(/\//g, '');
                data.endDate = (data.endDate || '30001231').replace(/\//g, '');
                if(parseInt(data.startDate) - parseInt(data.endDate) > 0) {
                    topTip({msg: '结束日期不能小于开始日期', type: 'danger'});
                    $form.find('input[name="startDate"]').next('i').css('display', 'none');
                    $form.bootstrapValidator('updateStatus', 'endDate', 'INVALID', 'empty');
                    return;
                }
            } else {
                switch (data.memberDayCycle) {
                    case '1':
                        data.memberDay = prefixInteger(data.month, 2) + prefixInteger(data.day, 2);
                        break;
                    case '2':
                        data.memberDay = data.day;
                        break;
                    case '3':
                        data.memberDay = data.week;
                        break;
                }
                data = _.omit(data, 'month', 'day', 'week');
            }
            data.itemID = cpref.itemID;
            data.shopID = cpref.shopID;
            G.updateCrmShopPreferential(data, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '修改成功！', type: 'success'});
                getCrmPreferential(getParams);
                modal.hide();
            });
            
        }
        
        function findPref(id)
        {
            return prefs[C.inArray(prefs, {itemID: id}, 'itemID')];
        }
            
        $pager.on('page', function(e, pageNo)
        {
            getParams.pageNo = pageNo;
            getCrmPreferential(getParams);
        });
        
        function renderCrmPreferential(records)
        {
            var trs = [];
            for(var i = 0, item; item = records[i++];) {
                trs.push($(trTpl(item)));
            }
            $tbody.html(trs);
            $switchCheckbox = $tbody.find('tr td input[type="checkbox"]');
            createPrefSwitch($switchCheckbox);
        }

        function createPrefSwitch() {
            _.each($switchCheckbox, function (input) {
                var state = $(input).data('status') == 1;
                $(input).bootstrapSwitch({
                    state: state,
                    onColor: 'success',
                    onText: '已启用',
                    offText: '未启用'
                });
            });
            $switchCheckbox.on('switchChange.bootstrapSwitch', function (el, state) {
                var $this = $(this),
                    $td = $this.parents('td'),
                    $tr = $td.parents('tr'),
                    stateName = $td.data('type') == 'shop' ? 'isActive' : 'memberDayIsActive',
                    itemID = $tr.data('itemid'),
                    currentPref = findPref(itemID),
                    successMsg = state ? '开启' : '关闭',
                    params = {itemID: itemID, shopID: currentPref.shopID};
                params[stateName] = state ? '1' : '0';
                Hualala.UI.Confirm({
                    title: successMsg + '特惠',
                    msg: '你确定要' + successMsg + '该状态吗？',
                    okFn: function () {
                        G.switchPreferential(params, function (rsp) {
                            if(rsp.resultcode != '000') {
                                topTip({msg: rsp.resultmsg, type: 'danger'});
                                $this.bootstrapSwitch('toggleState', true);
                                return;
                            }
                            topTip({msg: successMsg + '成功', type: 'success'});
                        });
                    },
                    cancelFn: function () {
                        $this.bootstrapSwitch('toggleState', true);
                    }
                });
            });
        }

        function createPrefTR(item)
        {
            var $tr = $('<tr>');
            for(var key in pref)
            {
                var val = item[key];
                if(/startDate|endDate|actionTime/.test(key)) 
                {
                    val = formatDateStr(val, 12);
                    if(/startDate|endDate/.test(key) && !val)
                        val = '不限';
                }
                else if(key == 'action')
                    val = $('<a href="javascript:;">修改</a>').data('itemid', item.itemID);
                else if(/discountType|pointType/.test(key))
                    val = Meta[key][val];
                else if(key == 'isActive')
                    val = $(stateIco[val]).attr('title', Meta[key][val]);
                
                $('<td>').html(val).appendTo($tr);
            }
            return $tr;
        }
        
        function getCrmPreferential(getParams)
        {
            G.getCrmShopPreferential(getParams, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                var records = rsp.data.records || [],
                    page = rsp.data.page;
                prefs = records;
                renderCrmPreferential(records);
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            });
        }

        //给数字前补0
        function prefixInteger(num, length) {
            //num: 被补齐的数字；length: 补齐后数值的长度
            return (Array(length).join('0') + num).substr(-length);
        }
    };
})(jQuery, window);