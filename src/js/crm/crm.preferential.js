(function ($, window) {
	IX.ns("Hualala.CRM");
    
	Hualala.CRM.initPreferential = function($crm)
    {
        var G = Hualala.Global,
            C = Hualala.Common,
            CrmTypeDef = Hualala.TypeDef.CRM,
            formatDateStr = C.formatDateStr,
            prettyNumeric = C.Math.prettyNumeric,
            parseForm = C.parseForm,
            tplLib = Hualala.TplLib,
            U = Hualala.UI,
            topTip = Hualala.UI.TopTip;
            
        var Meta = {
            pref: {
                shopName: '店铺名称', startDate: '开始日期', endDate: '结束日期', discountType: '折扣促销方式', discountRate: '促销折扣率', pointType: '积分促销方式', pointRate: '促销积分系数', actionTime: '修改时间', isActive: '是否启用', action: '操作'
            },
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
            $pager = $('<div>').addClass('pull-right');
            
        var prefs = null; pref = Meta.pref, stateIco = Meta.stateIco, ths = [];
        
        for(var key in pref)
            ths.push($('<th>').text(pref[key]));
        $headTR.append(ths);
        
        $crm.append($crmPref);
        $crm.append($pager);
        U.createSchemaChosen($('[name=shopID]'), $('[name=cityID]'));
        
        getCrmPreferential(getParams);
        
        $queryForm = $crmPref.find('form');
        $crmPref.on('click', '.btn', function()
        {
            getParams.pageNo = 1;
            $.extend(getParams, parseForm($queryForm));
            getCrmPreferential(getParams);
            return false;
        });
        
        var tplForm = Handlebars.compile(tplLib.get('tpl_crm_pref_update')),
            cpref = null, $ctr = null,
            modal = null, $form = null, bv = null;
        $table.on('click', 'a', function(e)
        {
            var $this = $(this), id = $(this).data('itemid');
            cpref = findPref(id) || {};
            var fpref = $.extend({}, cpref);
            fpref.startDate = formatDateStr(fpref.startDate);
            fpref.endDate = formatDateStr(fpref.endDate);
            $ctr = $this.parent().parent();
            $form = $(tplForm(fpref));
            $form.find('[name=discountType]').eq(+fpref.discountType).prop('checked', true);
            $form.find('[name=pointType]').eq(+fpref.pointType).prop('checked', true);
            $form.find('[name=isActive]').val(fpref.isActive);
            $form.find('[name=startDate],[name=endDate]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/01/01',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
            });
            modal = new U.ModalDialog({title: '会员促销参数设置', html: $form}).show();
            
            $form.find('[type=radio]').on('change', function(e)
            {
                if(this.checked)
                    $(this).parent().parent().find('div').text($(this).data('tip'));
            }).change();
            
            $form.bootstrapValidator({
                fields: {
                    startDate: {
                        validators: {
                            date: {
                                format: 'YYYY/MM/DD',
                                message: '开始日期格式不正确'
                            }
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
                            greaterThan: {
                                message: '促销折扣率大于0且小于或等于1',
                                inclusive: false,
                                value: 0
                            },
                            lessThan: {
                                message: '促销折扣率必须大于0且小于或等于1',
                                inclusive: true,
                                value: 1
                            }
                        }
                    },
                    pointRate: {
                        validators: {
                            notEmpty: { message: '促销积分系数不能为空' },
                            greaterThan: {
                                message: '促销积分系数必须大于或等于1',
                                inclusive: true,
                                value: 1
                            }
                        }
                    }
                }
            });
            bv = $form.data('bootstrapValidator');
            modal._.footer.find('.btn-ok').on('click', submitPref);
        });
        
        function submitPref()
        {
            if(!bv.validate().isValid()) return;
            var data = parseForm($form);
            data.startDate = (data.startDate || '0').replace(/\//g, '');
            data.endDate = (data.endDate || '0').replace(/\//g, '');
            data.itemID = cpref.itemID;
            G.updateCrmPreferential(data, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '修改成功！', type: 'success'});
                $ctr.replaceWith(createPrefTR($.extend(cpref, data)));
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
            for(var i = 0, item; item = records[i++];)
                trs.push(createPrefTR(item));
            $tbody.html(trs);
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
            G.getCrmPreferential(getParams, function(rsp)
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
    };
})(jQuery, window);