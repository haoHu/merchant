(function ($) {
	IX.ns("Hualala.TypeDef");

	// 站点导航数据
	Hualala.TypeDef.SiteNavType = [
		{name : 'order', label : '订单'},
		{name : 'account', label : '结算'},
		{name : 'shop', label : '店铺管理'},
		{name : 'setting', label : '业务设置'},
		{name : 'user', label : '账号管理'}
	];

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

	/**
	 * 店铺业务类型
	 * 10：常规预订，11：闪吃，20：外送，21：到店自提，41：店内点菜，42：店内买单
	 * 业务表单参数：
	 * advanceTime:提前预订时间 int 分钟 0：无需提前
	 * noticeTime:POS提前通知时间 int 分钟 0|null 立即通知
	 * minAmount:最低消费金额 int 0
	 * serviceAmount:服务费 int 0
	 * freeServiceAmount:免服务费菜品金额
	 * holidayFlag:节假日开放 0:包含节假日（默认），1:只能在节假日，2:不包含节假日
	 * openDays: 开放服务天数 int
	 * servicePeriods: 开放时段 string hhmm,hhmm; 支持结束日期小于终止日期，时段最小间隔不应小于2个小时
	 * reserveTableTime: 留位时间 int 分钟
	 * reserveTableDesc: 留位说明40字
	 * takeawayDeliveryAgent: 配送单位，默认"自助配送"
	 * takeawayDeliveryTime: 送达时间 int 分钟
	 * takeawayScope: floor 公里
	 * takeawayScopeDesc: 外卖送餐范围说明200字
	 * submitSMSTemplateID: 下单后短信模板ID
	 * checkSMSTemplateID: 验单后短信模板ID
	 * payMethod: 支付方式 int 0：仅支持在线支付（默认）；1：仅支持线下支付；2：都支持
	 * needInputTableName: 下单时需要输入桌号 int 0：不需要；1：需要
	 * supportInvoice: 提供发票 int 0：不需要;1:需要（默认）
	 * supportCommitToSoftware: 支持下单到餐饮软件 0：不支持（默认）；1：支持
	 * payMethodAtShop: 店内支付方式 int 0：均不支持（默认）；1：直接输入金额付款；2：扫码付款；3：均支持
	 * payBeforeCommit: 支付完成后才能下单 int 0：不支持（不支持）；1：支持
	 * fetchFoodMode : 取餐模式 int 0：流水号模式（默认）；1：牌号模式；2：收银台直接取餐
	 * 
	 */
	Hualala.TypeDef.ShopBusiness = [
		{
			id : 10, label : "常规预订", name : "commonreserve_order", businessIsSupported : false, 
			callServer : null,
			formKeys : 'advanceTime,noticeTime,minAmount,holidayFlag,servicePeriods,reserveTableTime,reserveTableDesc,payMethod'
		},
		{id : 11, label : "闪吃", name : "justeat_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setJustEatParams',
			formKeys : 'advanceTime,noticeTime,minAmount,holidayFlag,servicePeriods,reserveTableTime,reserveTableDesc,payMethod'
		},
		{id : 20, label : "外送", name : "takeaway_order", businessIsSupported : false,
			callServer : null,
			formKeys : 'advanceTime,noticeTime,minAmount,serviceAmount,freeServiceAmount,holidayFlag,servicePeriods,takeawayDeliveryAgent,takeawayDeliveryTime,takeawayScope,takeawayScopeDesc,payMethod'
		},
		{id : 21, label : "到店自提", name : "takeout_order", businessIsSupported : false,
			callServer : null,
			formKeys : 'advanceTime,freeServiceAmount,holidayFlag,minAmount,serviceAmount,servicePeriods,noticeTime,payMethod'
		},
		{id : 41, label : "店内自助", name : "spot_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setSpotOrderParams',
			formKeys : 'fetchFoodMode,payMethodAtShop,payBeforeCommit,supportCommitToSoftware'
		}
		// {id : 42, label : "店内买单", name : "spot_pay"}
	];

	Hualala.TypeDef.PayMethodOptions = [
		{value : 0, label : "仅支持在线支付"},
		{value : 1, label : "仅支持线下支付"},
		{value : 2, label : "均支持"},
	];

	Hualala.TypeDef.PayMethodAtShopOptions = [
		{value : 0, label : "均不支持"},
		{value : 1, label : "直接输入金额付款"},
		{value : 2, label : "扫码付款"},
		{value : 3, label : "均支持"}
	];

	Hualala.TypeDef.FetchFoodModeOptions = [
		{value : 0, label : "流水号模式"},
		{value : 1, label : "牌号模式"},
		{value : 2, label : "收银台直接取餐"}
	];

	Hualala.TypeDef.HolidayFlagOptions = [
		{value : 0, label : "包含节假日"},
		{value : 1, label : "只能在节假日"},
		{value : 2, label : "不包含节假日"}
	];

	/**
	 * 获取一天(默认)的时间间隔选项数据
	 * 1小时内，时间间隔15分钟
	 * 1-3小时内，时间间隔30分钟
	 * 3-12小时内，时间间隔3小时
	 * 24小时以上，时间间隔24小时
	 * @param {NULL | int} endMin 结束的分钟数
	 * @return {Array} 时间间隔选项数据[{value : minutes, label : 'time format string'}]
	 */
	Hualala.TypeDef.MinuteIntervalOptions = function (endMin) {
		var start = 0, end = endMin || Hualala.Constants.SecondsOfDay / 60, gap = 15, i = 1;
		var list = [], cur = 0, minsOfHour = Hualala.Constants.SecondsOfHour / 60,
			minsOfDay = minsOfHour * 24;
		var formatTime = function (m) {
			if (m == 0) return '不限';
			var day = m % minsOfDay == 0 ? m / minsOfDay : 0;
				hour = (m < minsOfHour || m % minsOfDay == 0) ? 0 : (m == minsOfHour) ? 1 : parseInt(m / minsOfHour),
				min = m % minsOfHour;
			return (day == 0 ? '' : day + '天') + (hour == 0 ? '' : hour + '小时') + (min == 0 ? '' : (min + '分钟'));
		};
		while(cur <= end) {
			list.push({
				value : cur,
				label : formatTime(cur)
			});
			if (cur < minsOfHour) {
				cur += gap * i;
			} else if (cur < minsOfHour * 3) {
				i = 2;
				cur += gap * i;
			} else if (cur < minsOfHour * 12) {
				i = 4 * 3;
				cur += gap * i;
			} else if (cur <= minsOfHour * 24) {
				i = 4 * 12;
				cur += gap * i;
			}
		}
		return list;
	};


})(jQuery);