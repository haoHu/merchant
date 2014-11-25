(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
	
	var tpl_crm_params = [
    '<form class="crm-params form-horizontal feed-back-out read-mode">',
        '<div class="form-group">',
            '<label class="col-sm-6 control-label no-require">服务有效期</label>',
            '<div class="col-sm-4">',
                '<p class="form-control-static no-hidden">从 {{serviceStartTime}} 至 {{serviceEndTime}}</p>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-6 control-label no-require">积分可抵扣消费</label>',
            '<div class="col-sm-4">',
                '<p class="form-control-static no-hidden"><span class="glyphicon glyphicon-{{isPointCanPay}}"></span></p>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-6 control-label no-require">积分抵现系数</label>',
            '<div class="col-sm-4">',
                '<p class="form-control-static no-hidden">1积分可抵现{{pointExchangeRate}}(元)</p>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-6 control-label no-require">积分清零日期</label>',
            '<div class="col-sm-4">',
                '<p class="form-control-static no-hidden">{{pointClearDate}}</p>',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-6 control-label" for="vipServiceTel">会员服务电话</label>',
            '<div class="col-sm-4">',
                '<p class="form-control-static">{{vipServiceTel}}</p>',
                '<input type="text" name="vipServiceTel" class="form-control" value="{{vipServiceTel}}" />',
            '</div>',
        '</div>',
        '<div class="form-group">',
            '<label class="col-sm-6 control-label no-require" for="vipServiceRemark">会员服务说明</label>',
            '<div class="col-sm-4">',
                '<p class="form-control-static">{{vipServiceRemark}}</p>',
                '<textarea class="form-control" name="vipServiceRemark" rows="4" maxlength="5000">{{vipServiceRemark}}</textarea>',
            '</div>',
        '</div>',
        '<div class="step-action">',
            '<button id="editBtn" class="btn btn-warning btn-edit">编辑</button>',
            '<button id="saveBtn" class="btn btn-warning btn-save">保存</button>',
        '</div>',
    '</form>'].join('');
	TplLib.register('tpl_crm_params', tpl_crm_params);

	
})(jQuery, window);