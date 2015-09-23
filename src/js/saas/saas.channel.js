(function ($, window) {
    IX.ns("Hualala.Saas.channel");
    var G = Hualala.Global,
        U = Hualala.UI,
        C = Hualala.Common,
        topTip = U.TopTip,
        parseForm = C.parseForm;
    var $alert = $('<div class="alert alert-warning t-c">暂无任何渠道内容。</div>'),
        ChannnelSetsTpl = Handlebars.compile(Hualala.TplLib.get('tpl_channnel_sets')),
        editChannelTpl = Handlebars.compile(Hualala.TplLib.get('tpl_channel_add_update')),
        $table = null, channels = [], channel = null, setId = null, isAdd = null, isDelete = null,
        $editSet = null, modal = null, bv = null, $c;         
    Hualala.Saas.channel.initChannel = function($channel){
        $c = $channel;
        renderSets($c);
        //增加和修改渠道事件绑定
        $channel.on('click', '.well .btn, td .channel-update', renderDialog);
        $channel.on('click', 'td .channel-delete', deleteChannel);
        //table初始化
    }
    function renderSets($channel){
        G.getSaasChannel({}, function(rsp){
            if(rsp.resultcode != '000'){
                rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                return;
            }
            //json深度复制
            //channels = JSON.parse(JSON.stringify(rsp.data.records));
            channels = rsp.data.records || [];
            preProcessSets(channels);
            $(ChannnelSetsTpl({channels: channels})).appendTo($channel.empty());
            $table = $channel.find('table');
            if(!channels.length){
                $table.addClass('hidden');
                $channel.append($alert);
                return;
            }
            createSwitch($channel.find('table input'));
        });
    }
    //添加和修改渠道模态框
    function renderDialog(e){
        var id = $(e.target).data('setid');
        setId = id;
        isAdd = id === undefined;
        channel = getSetById(channels, id) || {};
        if(id!=undefined){
            channel.channelRemark  = C.decodeTextEnter(channel.channelRemark)
        }
        var dTitle = (isAdd ? '添加' : '修改') + '渠道',
            itemID = channel.itemID || 0;
        $editSet = $(editChannelTpl(channel));
        modal = new U.ModalDialog({
            title: dTitle,
            html: $editSet
        }).show();
        formValid($editSet);
        bv = $editSet.data('bootstrapValidator');
        submitSet(itemID);
    }
    function formValid($form){
        $form.bootstrapValidator({
            fields: {
                channelName: {
                    validators: {
                        notEmpty: { message: '渠道名不能为空' },
                        stringLength : {
                            min : 1,
                            max : 50,
                            message : "渠道名称长度在1-50个字符之间"}
                    }
                },
                channelRemark: {
                    validators : {
                        stringLength : {
                            max : 250,
                            message : '渠道说明不能超过250个字'}
                    }
                }   
            }
        });
    }


    //添加和更新渠道列表
    function submitSet(itemID){
        modal._.footer.find('.btn-ok').on('click',function (e){
            if(!bv.validate().isValid()) return;
            var data = parseForm($editSet);
            data.channelName = data.channelName || 0;
            data.channelRemark = C.encodeTextEnter(data.channelRemark) || 0;
            var user = $XP(Hualala.getSessionData(),'user',''),
                loginName = $XP(user,'loginName',''),
                groupLoginName = $XP(user,'groupLoginName',''),
                groupID = $XP(user,'groupID','');
            var createBy=groupLoginName+'_'+loginName;
            _.extend(data,{createBy:createBy});
            data.channelName = $.trim(data.channelName);
            var nameCheckData = {channelName:data.channelName,groupID: groupID,itemID: itemID}
            function callbackFn(res){
                topTip({msg: (isAdd ? '添加' : '修改') + '成功！', type: 'success'});
                renderSets($c);
                modal.hide();
            }
            if(isAdd){
                C.NestedAjaxCall("checkChannelName","addSaasChannel",nameCheckData,data,callbackFn);
            }else{
                data.itemID = setId;
                C.NestedAjaxCall("checkChannelName","updateSaasChannel",nameCheckData,data,callbackFn);  
            }
        });   
    }
    //删除渠道
    function deleteChannel(e){
        var id = $(e.target).data('setid');
        setId = id;
        isDelete = id === undefined;
        channel = getSetById(channels, id) || {};
        var params ={itemID:id};
        Hualala.UI.Confirm({
            title: '刪除渠道',
            msg: '你确定要删除此渠道吗？',
            okFn: function () {
                G.deleteSaasChannel(params, function (rsp) {
                    if(rsp.resultcode != '000')
                    {
                        rsp.resultmsg && topTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    topTip({msg:'删除成功',type: 'success'});
                    renderSets($c);
                })
            }
        });
    }
    //获取渠道id
    function getSetById(channels, id){
        for(var i = channels.length - 1, channel; channel = channels[i--];)
            if(channel.itemID == id) return channel;
    }
    //渠道的数据处理
    function preProcessSets(channels){
        for(var i = channels.length - 1, channel; channel = channels[i--];){
            channel.checked = +channel.isActive ? 'checked' : '';
            if (channel.isGlobal=="1") {
                channel.nameisGlobal="是";
                channel.channelGlobal=false;
            }
            else{
                 channel.nameisGlobal="否";
                 channel.channelGlobal=true;
            };
          if (channel.createBy=="0") {
                channel.ncreateBy=" ";
            }
          else{
                channel.ncreateBy=channel.createBy;
            };
          if(channel.channelRemark!="0"){
                channel.shortRemarks=channel.channelRemark;
                if(channel.shortRemarks.length<20){
                    //channel.shortRemarks=channel.shortRemarks.substring(0,20)+'...';
                    channel.shortRemarks = C.decodeTextEnter(channel.channelRemark); 
                }
                else{
                    channel.shortRemarks = C.decodeTextEnter(channel.channelRemark);
                    channel.shortRemarks = C.substrByte(channel.shortRemarks, 40) + '...';
                }
            } 
          else{
                channel.channelRemark=" ";
            }
        }
    }
    //渠道开启和关闭操作
    function createSwitch($checkbox){
        $checkbox.bootstrapSwitch({
            onColor : 'success',
            onText : '已开启',
            offText : '未开启'
        }).on('switchChange.bootstrapSwitch', function (e, state){
            var $this = $(this), setID = $this.data('setid'),
                stateText = state ? '开启' : '关闭';
            Hualala.UI.Confirm({
                title : stateText + "渠道",
                msg : "你确定要" + stateText + "此渠道吗？",
                okFn : function () {
                    G.switchChannelState({itemID: setID, isActive: +state}, function (rs)
                    {
                        if(rs.resultcode != '000')
                        {
                            $this.bootstrapSwitch('toggleState', true);
                            topTip({msg: stateText + '失败' + (rs.resultmsg ? '：' + rs.resultmsg : ''), type: 'danger'});
                            return;
                        }
                        topTip({msg: stateText + '成功！', type: 'success'})
                    });
                },
                cancelFn : function () {
                    $this.bootstrapSwitch('toggleState', true);
                }
            });
        });
    }  
})(jQuery, window);
