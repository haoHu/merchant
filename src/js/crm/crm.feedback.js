(function ($, window) {
    IX.ns("Hualala.CRM");
    var G = Hualala.Global,
        U = Hualala.UI,
        topTip = U.TopTip,
        parseForm = Hualala.Common.parseForm,
        feedbackTypeData = Hualala.TypeDef.FeedbackDataSet.feedbackTypeData,
        clientTypeData = Hualala.TypeDef.FeedbackDataSet.clientTypeData,
        responseStatusData = Hualala.TypeDef.FeedbackDataSet.responseStatusData;
       var queryFormTpl,ModalTpl,listTpl,itemTpl,feedbacks = null,params;
       var $pager = $('<div>').addClass('pull-right');
    Hualala.CRM.initFeedback = function ($container){
        params = {pageNo: 1, pageSize: 5};
        initTemplate($container);
        var formparams = parseForm($container.find('.feedBackQueryForm'));
        var extendParams =_.extend(params,formparams);
            extendParams.startTime = extendParams.startTime.replace(/\//g, '');
            extendParams.endTime = extendParams.endTime.replace(/\//g, '');
        renderTable($container,extendParams);
        bindEvent($container);
    }
    function initTemplate($container) {
        queryFormTpl =  Handlebars.compile(Hualala.TplLib.get('tpl_feedBack_query_panel'));
        listTpl = Handlebars.compile(Hualala.TplLib.get('tpl_feedBack_list'));
        ModalTpl= Handlebars.compile(Hualala.TplLib.get('tpl_feedBack_Modal'));
        itemTpl = Handlebars.compile(Hualala.TplLib.get('tpl_feedBack_card'));
        Handlebars.registerPartial("feedbackCard", Hualala.TplLib.get('tpl_feedBack_card'));
        renderQueryBox($container);
        $container.append($pager);
        bindpagerEvent($container,$pager);

    }
    //queryForm的渲染
    function renderQueryBox($container){
        var $queryBox = $container.find('.crm-query-box');
        var now = new Date(),
            curDateStamp = IX.Date.getDateByFormat(new Hualala.Date(now.getTime() / 1000).toText(), 'yyyy/MM/dd'),
            lastMonth = new Date(now.getFullYear(),now.getMonth()-1,now.getDate()),
            lastMonthDateStamp =IX.Date.getDateByFormat(new Hualala.Date(lastMonth.getTime() / 1000).toText(), 'yyyy/MM/dd');
        var queryParams = {lastDate:lastMonthDateStamp,curDate:curDateStamp,feedbackTypeData:feedbackTypeData,responseStatusData:responseStatusData};
            $queryBox.append($(queryFormTpl(queryParams)));
        $queryForm = $container.find('.feedBackQueryForm');
        $queryForm.find('[name=startTime], [name=endTime]').datetimepicker({
                format : 'yyyy/mm/dd',
                startDate : '2010/10/10',
                autoclose : true,
                minView : 'month',
                todayBtn : true,
                todayHighlight : true,
                language : 'zh-CN'
        });
    }
    //获取数据
    function renderTable($container,params) {
       G.getFeedBack(params, function(rsp) {
            if (rsp.resultcode == '000') {
                feedbacks = rsp.data.records;
                var page = rsp.data.page;              
                renderRecords(feedbacks,$container); 
                $pager.IXPager({total : page.pageCount, page: page.pageNo, maxVisible: 10, href : 'javascript:;'});
            }else{
                topTip({type: 'danger', msg: rsp.resultmsg});
                return;
            }
        });
    }
    //数据渲染
    function renderRecords(records,$container) {
        var $resultBox = $container.find('.crm-result-box');
        $resultBox.empty();
        if (records == undefined) {
            emptyBar = new Hualala.UI.EmptyPlaceholder({
                container : $resultBox
            });
            emptyBar.show();
        } else {
          $resultBox.html($(listTpl(mapRenderData(records))));
        }   
    }
    //时间的处理
    function mapTimeData(s) {
        var r = {value : '', text : '', clz : 'date'};
        var s1 = '';
        if (IX.isString(s) && s.length > 0) {
            s1 = s.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
            s1 = IX.Date.getDateByFormat(s1, 'yyyy-MM-dd HH:mm');
            r = IX.inherit({value : s, text : s1});
        }
        return r;
    }
    //组装表格
    function mapRenderData(records) {
        var ret = _.map(records, function (feedback, i, l) {
            var clientTypeVal = $XP(feedback, 'clientType', ''),
                feedbackVal = $XP(feedback,'feedbackType'),
                responseVal = $XP(feedback,'responseStatus');
                clientTypeVal  = _.filter(clientTypeData, function(clientType){ return clientType.value== clientTypeVal;});
                feedbackVal = _.filter(feedbackTypeData, function(feedbackType){ return feedbackType.value== feedbackVal;});
                responseVal = _.filter(responseStatusData, function(responseStatus){ return responseStatus.value== responseVal;});
            var createTimeVal = $XP(feedback,'createTime'),
                actionTimeval = $XP(feedback,'actionTime');
                createTimeVal = mapTimeData(createTimeVal);
                actionTimeval = mapTimeData(actionTimeval);
            return {
                clz : 'feedbackCard',
                itemID : $XP(feedback,'itemID'),
                clientType : $XP(clientTypeVal[0], 'label', ''),
                feedbackType : $XP(feedbackVal[0], 'label', ''),
                feedbackTypeColor : $XP(feedbackVal[0], 'color', ''),
                responseStatus : $XP(responseVal[0], 'label', ''),
                feedbackContent : $XP(feedback,'feedbackContent'),
                responseContent : $XP(feedback,'responseContent'),
                operator : $XP(feedback,'operator'),
                userName : $XP(feedback,'userName'),
                userMobile : $XP(feedback,'userMobile'),
                createTime : createTimeVal,
                actionTime : actionTimeval,
                hiddenFooter : $XP(feedback,'responseStatus')==0?"hidden" :"",
                hiddenNooperate : $XP(feedback,'responseStatus')==0?"" :"hidden",
                hiddenoperate : $XP(feedback,'responseStatus')==1?true :false,
            };
        });
        return {
            feedbackCard : {
                list : ret
            }
        };
    }
    //页面绑定事件的处理
    function bindEvent($container){
        $container.on('click', '.operate,.btn', function (e) {
            var act = $(this).attr('data-type');
                itemID =$(this).attr('data-id')||undefined;
            switch(act) {
                //添加
                case "Add":
                //修改
                case "edit" :
                    renderDailog(itemID,act,$container);
                    break;
                case "search":
                    var formparams = parseForm($container.find('.feedBackQueryForm'));
                    var extendParams =_.extend(params,formparams);
                    params.pageNo = 1;
                    extendParams.startTime = extendParams.startTime.replace(/\//g, '');
                    extendParams.endTime = extendParams.endTime.replace(/\//g, '');
                    renderTable($container,extendParams);
                    break;
            }
        });
    }
    function  bindpagerEvent($container,$pager){
        $pager.on('page', function(e, pageNo){
            params.pageNo = pageNo;
            renderTable($container,params);
        }); 
    }
    function renderDailog(itemID,act,$container){
        var feedItem ={};
            feedItem=_.findWhere(feedbacks, {itemID: itemID});
        var operateStatus = _.reject(responseStatusData, function(responseStatus){ return responseStatus.value == 10|| responseStatus.value == 0; });
        if(feedItem){
            feedItem.responseContent = Hualala.Common.decodeTextEnter(feedItem.responseContent);
            operateStatus=_.map(operateStatus,function (operateStatus){
                return _.extend(operateStatus,{selected:operateStatus.value==feedItem.discountRange ? 'selected' : ''});
            });
        }
        var dTitle = (act=="Add" ? '填写' : '修改') + '处理描述',
            modalVals = {responseStatusData:operateStatus,responseContent:feedItem.responseContent},
            $editSet = $(ModalTpl(modalVals));
            modalDialog = new U.ModalDialog({
                title: dTitle,
                backdrop : 'static',
                html: $editSet
            }).show(); 
            FormValidate($editSet);
            bindfeedBackModal(modalDialog,$editSet,itemID,$container);
    }
    function FormValidate($form){
        $form.bootstrapValidator({
            fields: {
                responseContent: {
                    validators: {
                        notEmpty: { message: '处理描述不能为空' },
                        stringLength : {
                            min : 1,
                            max : 250,
                            message : "处理描述长度在1-250个字符之间"},
                    }
                }  
            }
        });
    }
    function bindfeedBackModal(modalDialog,$form,itemID,$container){
        modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
            if(!$form.data('bootstrapValidator').validate().isValid()) return;
            var data = parseForm($form),
                postParams = IX.inherit({itemID: itemID},data);
            postParams.responseContent = Hualala.Common.encodeTextEnter(postParams.responseContent);
            Hualala.Global[itemID ? 'AddFeedBackContent' : 'updateFeedBackContent'](postParams, function (rsp) {
                if (rsp.resultcode != '000') {
                   topTip({msg: rsp.resultmsg, type: 'danger'});
                    return;
                }
                topTip({msg: '保存成功', type: 'success'});
                modalDialog.hide();
                renderTable($container,params);
            });
        });
    }
})(jQuery, window);