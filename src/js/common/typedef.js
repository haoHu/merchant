(function ($) {
	IX.ns("Hualala.TypeDef");
	Hualala.TypeDef.GENDER = [
		{value : '0', valueStr : 'female', label : '女'},
		{value : '1', valueStr : 'male', label : '男'},
		{value : '2', valueStr : 'unkonwn', label : '未知'}
	];
	/**
	 * 店铺备注类型
	 * 备注类型10:口味，20：作法，30：品注，40：单注，45：赠菜原因，50：退菜原因，60：退单原因
	 */
	Hualala.TypeDef.ShopNoteType = {
		TASTE : 10,
		COOKING : 20,
		FOOD_COMMENT : 30,
		ORDER_COMMENT : 40,
		FREE_REASON : 45,
		RETURN_REASON : 50,
		CHARGE_BACK : 60
	};
	/**
	 * 订单子类型
	 * 10：预订 11：闪吃  12：店内自助点菜 15：排队取号 20：外送 21：自提 
	 */
	Hualala.TypeDef.OrderSubType = {
		EATIN : 0,
		RESERVE : 10,
		Flash : 11,
		DIY : 12,
		QUEUE : 15,
		TAKEOUT : 20,
		PICKUP : 21
	};
	/**
	 * 时段类型定义
	 */
	Hualala.TypeDef.TimeID = {
		allday : {value : 0, label : "全天"},
		breakfast : {value : 1, label : "早餐"},
		lunch : {value : 2, label : "午餐"},
		afternoon : {value : 3, label : "下午茶"},
		dinner : {value : 4, label : "晚餐"},
		supper : {value : 5, label : "夜宵"}
	};
	/**
	 * 店铺状态
	 */
	Hualala.TypeDef.ShopStatus = [
		{value : 0, label : "待开放"},
		{value : 1, label : "正常"},
		{value : 2, label : "装修暂停营业"},
		{value : 3, label : "菜单更新暂停服务"},
		{value : 4, label : "信息更新暂停服务"},
		{value : 5, label : "店内放假暂停服务"},
		{value : 8, label : "信息完善中"},
		{value : 9, label : "已关闭"}
	];
	/**
	 * 菜品属性
	 */
	Hualala.TypeDef.FoodAttr = {
		// 是否必点
		AUTOADD : 1,
		// 是否店家招牌菜
		SPECIALTY : 1,
		// 推荐菜
		RECOMMEND : 1,
		// 新菜
		NEW : 1,
		// 打折菜
		DISCOUNT : 1,
		// 允许点评
		COMMENTS : 1,
		// 能退订退款
		CANREFUND : 1,
		// 是套餐
		SETFOOD : 1,
		// 外送标记
		TakeawayTag : {
			NOTAKEAWAY : 0,
			TAKEAWAY : 1,
			ONLYTAKEAWAY : 2
		},
		HASIMAGE : 1
	};
	/**
	 * 交易类型 
	 * 101：网上订餐消费（卖出）+ 102：账户充值+ 199：账户资金调加+ 201：订餐消费后退款（退款）- 202：平台预付款- 203：提现- 204：支付平台服务费- 205：支付平台广告费- 206：支付平台信息费- 299：账户资金调减-
	 */
	Hualala.TypeDef.FSMTransType = [
		{value : 101, label : "网上订餐消费（卖出）"},
		{value : 102, label : "账户充值"},
		{value : 199, label : "账户资金调加"},
		{value : 201, label : "订餐消费后退款（退款）"},
		{value : 202, label : "平台预付款"},
		{value : 203, label : "提现"},
		{value : 204, label : "支付平台服务费"},
		{value : 205, label : "支付平台广告费"},
		{value : 206, label : "支付平台信息费"},
		{value : 299, label : "账户资金调减"}
	];
	/**
	 * 交易状态
	 * 0：等待交易完成 1：交易成功 2：交易关闭
	 * 
	 */
	Hualala.TypeDef.FSMTransStatus = [
		{value : 0, label : "等待交易完成"},
		{value : 1, label : "交易成功"},
		{value : 2, label : "交易关闭"}
	];
	/**
	 * 支付类型
	 *  10：预付款.现金 11：预付款.支票 12：预付款.银行转账 13：预付款.刷银行卡 18：预付款.商户让利 20：帐户充值.现金 21：帐户充值.支票 22：帐户充值.银行转账 23：帐户充值.刷银行卡 24：帐户充值.在线支付 30：帐户提现.现金 31：帐户提现.支票 32：帐户提现.银行转账 33：帐户提现.刷银行卡 
	 */
	Hualala.TypeDef.FSMTransDetail = [
		{value : 10, label : "预付款.现金"},
		{value : 11, label : "预付款.支票"},
		{value : 12, label : "预付款.银行转账"},
		{value : 13, label : "预付款.刷银行卡"},
		{value : 18, label : "预付款.商户让利"},
		{value : 20, label : "帐户充值.现金"},
		{value : 21, label : "帐户充值.支票"},
		{value : 22, label : "帐户充值.银行转账"},
		{value : 23, label : "帐户充值.刷银行卡"},
		{value : 24, label : "帐户充值.在线支付"},
		{value : 30, label : "帐户提现.现金"},
		{value : 31, label : "帐户提现.支票"},
		{value : 32, label : "帐户提现.银行转账"},
		{value : 33, label : "帐户提现.刷银行卡"}
	];
})(jQuery);