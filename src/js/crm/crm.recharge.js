(function ($, window) {
	IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip,
        parseForm = Hualala.Common.parseForm;
        
	Hualala.CRM.initRecharge = function($crm)
    {
        var $alert = $('<div class="alert alert-warning t-c">暂无任何会员充值套餐。</div>'),
            crmRechargeSetsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_sets')),
            editSetTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_add_update')),
            vipLevelTpl = Handlebars.compile(Hualala.TplLib.get('tpl_crm_recharge_set_vip_level')),
            $table = null, sets = [], levels = null,
            set = null, setId = null, isAdd = null, 
            $editSet = null, modal = null, bv = null;
            
        renderSets();
        $crm.on('click', '.well .btn, td .btn', renderDialog);
        
        function renderSets()
        {
            G.getCrmRechargeSets({}, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                
                sets = rsp.data.records || [];
                preProcessSets(sets);
                $(crmRechargeSetsTpl({sets: sets})).appendTo($crm.empty());
                $table = $crm.find('table');
                if(!sets.length)
                {
                    $table.addClass('hidden');
                    $crm.append($alert);
                    return;
                }
                createSwitch($crm.find('table input'));
            });
        }
        
        function renderDialog(e)
        {
            var id = $(e.target).data('setid');
            setId = id;
            isAdd = id === undefined;
            set = getSetById(sets, id) || {};
            var dTitle = (isAdd ? '添加' : '修改') + '会员充值套餐',
                levelID = set.switchCardLevelID || 0;
            $editSet = $(editSetTpl(set));
            modal = new U.ModalDialog({
                title: dTitle,
                html: $editSet
            }).show();
            var $select = $editSet.find('select');
            
            if(levels)
                $select.append(vipLevelTpl({levels: levels})).val(levelID);
            else
            {
                G.getVipLevels({}, function(rsp)
                {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    
                    levels = filterVipLevels(sets, rsp.data.records);
                    $select.append(vipLevelTpl({levels: levels})).val(levelID);
                });
            }
            $editSet.bootstrapValidator({
                fields: {
                    setName: {
                        validators: {
                            notEmpty: { message: '套餐名不能为空' }
                        }
                    },
                    setSaveMoney: {
                        validators: {
                            notEmpty: { message: '充值金额不能为空' },
                            numeric: { message: '充值金额必须是金额数字' }
                        }
                    },
                    returnMoney: {
                        validators: {
                            numeric: { message: '返金额数必须是金额数字' }
                        }
                    },
                    returnPoint: {
                        validators: {
                            numeric: { message: '返积分数必须是数字' }
                        }
                    }
                }
            });
            bv = $editSet.data('bootstrapValidator');
            modal._.footer.find('.btn-ok').on('click', submitSet);
        }
        
        function submitSet()
        {
            if(!bv.validate().isValid()) return;
            var data = parseForm($editSet);
            if(!isAdd) data.saveMoneySetID = setId;
            G[isAdd ? 'addCrmRechargeSet' : 'updateCrmRechargeSet'](data, function(rsp)
            {
                if(rsp.resultcode != '000')
                {
                    rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'});
                renderSets();
                modal.hide();
            });
            
        }
    };
    
    function filterVipLevels(sets, levels)
    {
        var ret = [];
        for(var i = 0, level; level = levels[i]; i++)
            if(+level.isActive) ret.push(level);
        
        return ret;
    }
    
    function getSetById(sets, id)
    {
        for(var i = sets.length - 1, set; set = sets[i--];)
            if(set.saveMoneySetID == id) return set;
    }
    
    function preProcessSets(sets)
    {
        for(var i = sets.length - 1, set; set = sets[i--];)
            set.checked = +set.isActive ? 'checked' : '';
    }
    
    function getSelectText($select)
    {
        return $select.find('option:selected').text();
    }
    
    function createSwitch($checkbox)
    {
        $checkbox.bootstrapSwitch({
            onColor : 'success',
            onText : '已开启',
            offText : '已禁用'
        }).on('switchChange.bootstrapSwitch', function (e, state)
        {
            var $this = $(this), setID = $this.data('setid'),
                stateText = state ? '开启' : '禁用';
            G.switchCrmRechargeSetState({saveMoneySetID: setID, isActive: +state}, function (rs)
            {
                if(rs.resultcode != '000')
                {
                    $this.bootstrapSwitch('toggleState', true);
                    topTip({msg: stateText + '失败' + (rs.resultmsg ? '：' + rs.resultmsg : ''), type: 'danger'});
                    return;
                }
                topTip({msg: stateText + '成功！', type: 'success'})
            });
        });
    }
    
})(jQuery, window);












