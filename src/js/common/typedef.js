(function ($) {
	IX.ns("Hualala.TypeDef");

	// 商户中心角色配置
	// DongBo 要求角色数据并不是保存在后台数据库中，而是将角色常量维护在后台代码中，所以
	// 前端也维护一份配置信息，与后台保持一致
	Hualala.TypeDef.SiteRoleType = [
		{id : 1, name : "店长", "sortIndex" : 5, "roleType" : "manager", "operationScope" : "single-shop", "desc" : "可以管理单店的信息和功能"},
		{id : 2, name : "财务", "sortIndex" : 4, "roleType" : "finance", "operationScope" : "settle", "desc" : "可以管理多个结算账户"},
		{id : 3, name : "区域经理", "sortIndex" : 3, "roleType" : "area-manager", "operationScope" : "multi-shop", "desc" : "可以开店，并管理多个店铺的基本信息和功能"},
		{id : 4, name : "集团经理", "sortIndex" : 2, "roleType" : "general", "desc" : "管理所有店铺信息和功能及结算数据"},
		{id : 5, name : "系统管理员", "sortIndex" : 1, "roleType" : "admin", "desc" : "超级管理员，全部权限"}
	];

	// 站点导航数据
	Hualala.TypeDef.SiteNavType = [
		{name : 'shop', label : '店铺', type:"link"},
		{name : 'setting', label : '业务', type:"link"},
		{name : 'order', label : '订单', type:"link"},
		{name : 'account', label : '结算', type:"link"},
		{name : 'crm', label : '会员', type:"subnav",
			subnavs : [
				{name : "crmMemberSchema", label : "会员概况", type : "link", src : "CRMMemberSubNavType"},
				{name : "crmDealSummary", label : "交易报表", type : "link", src : "CRMDealSubNavType"},
				{name : "crmParameter", label : "参数设置", type : "link", src : "CRMParamsSubNavType"},
				{name : "FeedBack", label : "顾客反馈", type : "link", src : "CustomerFeedbackSubNavType"}
			]
		},
		{name : 'mcm', label : '营销', type : "subnav",
			subnavs : [
				{name : "mcmGiftsMgr", label : "礼品管理", type : "link", src : ""},
				{name : "mcmEventMgr", label : "活动管理", type : "link", src : ""}
			]
		},
		{name : 'weixin', label : '微信', type: "subnav",
			subnavs : [
				{name : "wxAccounts", label : "微信管理", type : "link", src : "WeixinAdminSubNavType"},
				{name : "wxAdvertorial", label : "素材管理", type : "link", src : "WeixinMaterialSubNavType"}
			]
		},
        {name : 'more', label : '更多', type: "subnav",
			subnavs : [
				//saas
				{name : 'saas', label : '云餐厅管理', type:"link"},
				{name : "agent", label : "代理程序", type : "link"},
				{name : "user", label : "权限", type : "link"},
				{name : "versionInfo", label : "版本更新", type : "link"}
			]
		}
        
	];
    
    Hualala.TypeDef.WeixinAdminSubNavType = [
		{name : "wxAccounts", label : "公众账号"},
        {name : "wxReply", label : "自动回复"},
		{name : "wxSubscribe", label : "关注自动回复"},
		{name : "wxMenu", label : "自定义菜单"}//,
        //{name : "wxQrCode", label : "二维码管理"}
	];
    Hualala.TypeDef.WeixinMaterialSubNavType = [
        {name : "wxAdvertorial", label : "软文管理"},
		{name : "wxContent", label : "图文管理"},
		{name : "wxText", label : "文本管理"}
	];

	Hualala.TypeDef.CRMMemberSubNavType = [
		{name : "crmMemberSchema", label : "会员概览", pkeys : []},
		{name : "crmQueryMember", label : "会员查询", pkeys : []},
		{name : "crmCardStats", label : "入会统计", pkeys : []}
	];
	Hualala.TypeDef.CRMDealSubNavType = [
		{name : "crmDealSummary", label : "储值消费汇总", pkeys : []},
		{name : "crmDealDetail", label : "交易明细", pkeys : []},
		{name : "crmRechargeReconciliation", label : "储值对账", pkeys : []},
		{name : "memberQueryDay", label : "会员日报表", pkeys : []}
	];
	Hualala.TypeDef.CRMParamsSubNavType = [
		{name : "crmParameter", label : "会员系统参数", pkeys : []},
        {name : "crmCardLevels", label : "会员等级", pkeys : []},
		{name : "crmRechargePackageBusiness", label : "充值套餐", pkeys : []},
		{name : "crmShopSpecialPrice", label : "店铺特惠", pkeys : []}
	];
	Hualala.TypeDef.CustomerFeedbackSubNavType = [
		{name : "FeedBack", label : "反馈管理", pkeys : []},
        {name : "Assessment", label : "点评管理", pkeys : []}
	];
    

	Hualala.TypeDef.OrderSubNavType = [
		// Note：先屏蔽，第二版本开放
		// {name : 'order', label : '概览', pkeys : []},
		{name : 'orderQuery', label : '订单查询', pkeys : ['startDate','endDate','cityID','shopID','queryStatus','userMobile','orderID','s_orderTotal','e_orderTotal','vipOrder']},
		{name : 'orderQueryDay', label : '订单日汇总', pkeys : ['startDate','endDate','cityID','shopID','queryStatus']},
		{name : 'orderQueryDuring', label : '订单期间汇总', pkeys : ['startDate','endDate','cityID','shopID','queryStatus']},
		{name : 'orderDishesHot', label : '菜品销量排行', pkeys : ['startDate','endDate','cityID','shopID','foodCategoryName','grouping']},
		{name : 'orderQueryCustomer', label : '顾客统计', pkeys : ['startDate','endDate','cityID','shopID','userLoginMobile','userName']}
	];

	/*saas*/
	Hualala.TypeDef.SaasSubNavType = [
		{name : 'saasReceivables', label : '收款科目', pkeys : []},
		{name : 'saasDepartment', label : '部门', pkeys : []},
		//{name : 'saasRemarks', label : '字典', pkeys : []},
		// {name : 'saasCategories', label : '商品分类', pkeys : []},
		// {name : 'saasCommodity', label : '商品', pkeys : []},
		{name : 'saasChannel', label : '渠道', pkeys : []}
		
	];

	Hualala.TypeDef.GENDER = [
		{value : '0', valueStr : 'female', label : '女士'},
		{value : '1', valueStr : 'male', label : '先生'},
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
	 *查询订单的状态
	 *BUG #5570 【Dohko-dianpu】订单查询不能显示待消费订单且导出订单也无此数据
	 */
	Hualala.TypeDef.queryStatus = [
		{value : '2', label : "已消费"},
		{value : '1', label : "待消费"},			
		{value : '3', label : "已退款"}
	];
	/** 
	 *菜品的筛选统计类型（按分类，按菜品）
	 */
	Hualala.TypeDef.foodCountStatus = [
		{value : '1', label : "按菜品"},
		{value : '2', label : "按分类"}
	];
	/**
	 * 订单状态
	 * @type {Array}
	 */
	Hualala.TypeDef.OrderStatus = [
		// {value : '0', label : "已取消"},
		// {value : '10', label : "未完成"},
		// {value : '15', label : "已确认"},
		{value : '20', label : "待消费"},
		{value : '30', label : "已退单"},
		{value : '40', label : "已消费"}
		// {value : '50', label : "已完成 "},
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

    Hualala.TypeDef.FoodAttrSelect = {
        TakeawayType: [{name: '堂食外送均可', value: '1'}, {name: '仅堂食', value: '0'}, {name: '仅外送', value: '2'}],
        HotTag: [{name: '不辣', value: '0'}, {name: '微辣', value: '1'}, {name: '中辣', value: '2'}, {name: '重辣', value: '3'}]
    };
    Hualala.TypeDef.FoodSettings = [
        {name: 'IsNeedConfirmFoodNumber', text: '需要确定数量'},
        {name: 'isAutoAdd', text: '默认自动加入'}
        //{name: 'isComments', text: '允许点评'}暂时屏蔽掉
    ];
    Hualala.TypeDef.FoodAttrSNewR = [
        {name: 'isSpecialty', text: '招牌菜'},
        {name: 'isNew', text: '新菜'},
        {name: 'isRecommend', text: '推荐菜'}
    ];
	/**
	 * 交易类型 
	 * 101：网上订餐消费（卖出）+ 102：账户充值+ 199：账户资金调加+ 201：订餐消费后退款（退款）- 202：平台预付款- 203：提现- 204：支付平台服务费- 205：支付平台广告费- 206：支付平台信息费- 299：账户资金调减-
	 */
	Hualala.TypeDef.FSMTransType = [
		{value : '', label : "全部"},
		{value :511,label : "用户自助订餐/结帐", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 101, label : "网上订餐", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		{value : 102, label : "账户充值", tpl : "tpl_fsmcustomer_detail", queryCall : "Hualala.Global.queryAccountFsmCustomerDetail", queryKeys : "SUA_TransItemID,transType"},
		//{value : 103, label : "网上订餐用券", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 104, label : "到店消费验券", tpl : "tpl_chktick_detail", queryCall : null, queryKeys : null},
		{value : 105, label : "会员在线储值", tpl : "tpl_fsmcustomer_detail", queryCall : "Hualala.Global.queryAccountFsmCustomerDetail", queryKeys : "SUA_TransItemID,transType"},
		//{value : 199, label : "账户资金调加"},
		{value : 201, label : "订单退款", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 202, label : "平台预付款"},
		{value : 203, label : "提现", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		// {value : 204, label : "支付平台服务费"},
		// {value : 205, label : "支付平台广告费"},
		// {value : 206, label : "支付平台信息费"},
		//{value : 207, label : "订餐消费后退券", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 299, label : "账户资金调减"},
		//{value : 410, label : "店内自助点菜结账", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"}
		{value : 208, label : "短信结算", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"}
	];
	/**
	 * 交易状态
	 * 0：等待交易完成 1：交易成功 2：交易关闭
	 * 
	 */
	Hualala.TypeDef.FSMTransStatus = [
		{value : '', label : "全部"},
		{value : 0, label : "等待交易完成"},
		{value : 1, label : "交易成功"},
		{value : 2, label : "交易关闭"}
	];
	/**
	 *充值订单交易状态
	 *交易状态：10-待付款，20-已付款,30-已退款,40-已完成,50-结算失败,
	 */
	Hualala.TypeDef.FSMOrderStatus = [
		{value : '', label : "全部"},
		{value : 10, label : "待付款"},
		{value : 20, label : "已付款"},
		{value : 30, label : "已退款"},
		{value : 40, label : "已完成"},
		{value : 50, label : "结算失败"}
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
	 * 结算账户收款方方式
	 * @type {Array} 1:个人;2:单位
	 */
	Hualala.TypeDef.AccountReceiverTypes = [
		{value : 2, label : "单位"},
		{value : 1, label : "个人"}
	];

	Hualala.TypeDef.ShopOperationMode = [
		{value : 0, label : "正餐"},
		{value : 1, label : "快餐"},
		{value : 2, label : "美食广场"}
	];
	Hualala.TypeDef.ShopPrinterDataSet = {
		/* 打印机状态
		 * 0：未知 1：正常 2:打印机出错 3:打印机无法连接 4:打印机脱机 
		 * 5:上盖打开 6:切刀出错 7:纸将尽 8:缺纸
		 */
		currPrinterStatusData : [
			{value : "0", label : "未知"},
			{value : "1", label : "正常"},
			{value : "2", label : "打印机出错"},
			{value : "3", label : "打印机无法连接"},
			{value : "4", label : "打印机脱机"},
			{value : "5", label : "上盖打开"},
			{value : "6", label : "切刀出错"},
			{value : "7", label : "纸将尽"},
			{value : "8", label : "缺纸"}
		],
		/*打印机端口类型 : 0：串口 1：网口 2：并口 3：驱动 4：USB 5：蓝牙 */
		printerPortTypes : [
			{value : "0", label : "串口"},
			{value : "1", label : "网口"},
			{value : "2", label : "并口"},
			{value : "3", label : "驱动"},
			{value : "4", label : "USB"},
			{value : "5", label : "蓝牙"}
		],
		/*打印机品牌类型 新北洋、爱普生、佳博、滢普通、中崎、公达、其它*/
		printerBrandTypes :[
			{value : "新北洋"},
			{value : "爱普生"},
			{value : "佳博"},
			{value : "滢普通"},
			{value : "中崎"},
			{value : "公达"},
			{value : "其它"}
		],
		//打印机纸张宽度 80,58
		printerPaperSizeTypes :[
			{value: "58", label:"58毫米"},
			//{value: "76", label:"76毫米"},
			{value: "80", label:"80毫米"}
		],
		AreaprintCopies :[
			{value : "1", label : "一份"},
			{value : "2", label : "两份"},
			{value : "3", label : "三份"},
		]
	};
	Hualala.TypeDef.ShopPromotionDataSet = {
		/* 促销或送适用的业务类型
		 * 0:预订（常规预订+闪吃预订） 1：外送/自提 2：全部 3:店内自助
		 */
		supportOrderTypes : [
			{value : 2, label : "全部"},
			{value : 0, label : "预订(常规+闪吃)"},
			{value : 1, label : "外送/自提"},
			{value : 3, label : "店内自助"}
		],
		//时段限制早餐1午餐2下午茶3晚餐4夜宵5
		timeIDTypes :[
			{value : "0", label : "不限制"},
			{value : "1", label : "早餐"},
			{value : "2", label : "午餐"},
			{value : "3", label : "下午茶"},
			{value : "4", label : "晚餐"},
			{value : "5", label : "夜宵"}
		],

		/*tag : 标签（0无，1券，2减，3送，4折，5惠）*/
		tagTypes : [
			{value : "0", label : "无"},
			{value : "1", label : "券"},
			{value : "2", label : "减"},
			{value : "3", label : "送"},
			{value : "4", label : "折"},
		],
		//促销规则
		stageTypes :[
			{value: "0", label:"下单就有优惠", help:"如：全场8折,消费就送招财猫"},
			{value: "1", label:"消费每满一定金额就有优惠", help:"如：每满100返20优惠券"},
			{value: "2", label:"消费一定金额就有优惠", help:"如：消费满100减30，满200减70"}
		],
		//返券规则 1：不限制 2：用券不返券 3现金部分返券
		returnVoucherTypes:[
			{value:"1",label:"不限制"},
			{value:"2",label:"用券不返券"},
			{value:"3",label:"现金部分返券"}
		]
	};

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
	 * checkSpotOrder: 顾客可通过手机结账 int 0: 不支持；1:支持
	 * payBeforeCommit: 支付完成后才能下单 int 0：不支持（不支持）；1：支持
	 * fetchFoodMode : 取餐模式 int 0：流水号模式（默认）；1：牌号模式；2：收银台直接出餐
	 * commitSafeLevel：下单验证 int  1：不验证（默认） ； 2：在餐厅一定范围外需验证 ；3:必须验证
     * foodUITemplate ：菜品展示模式 int 1：列表模式（默认）；2：大图模式 ； 3：瀑布流模式
     * adsID ：软文介绍  int 0 未设置（默认）
     *
	 */
	Hualala.TypeDef.ShopBusiness = [
		{id : 41, label : "店内自助", name : "spot_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setSpotOrderParams',
			// formKeys : 'fetchFoodMode,payMethodAtShop,payBeforeCommit,supportCommitToSoftware',
			//formKeys : 'foodUITemplate,checkSpotOrder,commitSafeLevel,payBeforeCommit,supportCommitToSoftware',
			operationMode : {
				// 正餐
				// 0 : 'payMethodAtShop,payBeforeCommit,supportCommitToSoftware',
				// @Note for 1.1 delete supportCommitToSoftware(#4105)
				0 : 'foodUITemplate,payBeforeCommit,commitSafeLevel,adsID',
				// 快餐
				// @Note for 1.1 delete supportCommitToSoftware(#4105)
				1 : 'foodUITemplate,fetchFoodMode',
				2 : 'foodUITemplate,payBeforeCommit,commitSafeLevel,adsID'
			}
		},
		{
			id : 10, label : "订座点菜", name : "commonreserve_order", businessIsSupported : true, 
			callServer : 'Hualala.Global.setCommonReserveParams',
			formKeys : 'foodUITemplate,advanceTime,noticeTime,minAmount,reserveTableTime,reserveTableDesc,payMethod,promotionScope,adsID'
		},
		{id : 11, label : "闪吃", name : "justeat_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setJustEatParams',
			formKeys : 'foodUITemplate,advanceTime,noticeTime,minAmount,holidayFlag,servicePeriods,reserveTableTime,reserveTableDesc,payMethod,promotionScope,adsID'
		},
		{id : 20, label : "外送", name : "takeaway_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setTakeAwayParams',
			// formKeys : 'advanceTime,noticeTime,minAmount,serviceAmount,freeServiceAmount,holidayFlag,servicePeriods,takeawayDeliveryAgent,takeawayDeliveryTime,takeawayScope,takeawayScopeDesc,payMethod'
			formKeys : 'foodUITemplate,holidayFlag,servicePeriods,servicePeriods2,takeawayDeliveryTime,advanceTime,noticeTime,minAmount,serviceAmount,freeServiceAmount,takeawayScope,payMethod,promotionScope,adsID'
		},
		{id : 21, label : "自提", name : "takeout_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setTakeOutParams',
			// formKeys : 'advanceTime,freeServiceAmount,holidayFlag,minAmount,serviceAmount,servicePeriods,noticeTime,payMethod'
			formKeys : 'foodUITemplate,holidayFlag,servicePeriods,servicePeriods2,noticeTime,advanceTime,minAmount,payMethod,promotionScope,adsID'
		},
		{id : 1000, label : "会员卡", name : "crm", businessIsSupported : true, callServer : null, formKeys : null},
		{id : 2000, label : "老板通", name : "bi", businessIsSupported : true, callServer : null, formKeys : null},
		{id : 3000, label : "云餐厅", name : "saas", businessIsSupported : true, callServer : null, formKeys : null}

		// {id : 42, label : "店内买单", name : "spot_pay"}
	];

	/**
	 * 店铺业务状态切换的相关提示消息
	 * @type {Array}
	 * 10：常规预订，11：闪吃，20：外送，21：到店自提，41：店内点菜，42：店内买单，1000: 会员卡，2000: 老板通
	 * title : 业务名称
	 * id : 业务ID
	 * desc : 业务说明信息
	 * switchOn : 开启操作的确认文字
	 * switchOff : 关闭操作的确认文字
	 */
	Hualala.TypeDef.ShopBusinessSwitcherTips = [
		{
			id : 41, name : "spot_order", title : "店内自助", 
			desc : "开启此功能后顾客到店即可通过手机扫描二维码进行自助点菜、自助结账，此项功能将有效的缓解服务人员少、服务量大的问题，提升顾客体验、提升点菜、结账效率", 
			switchOn : "开启此功能请确保店内餐饮软件与哗啦啦接口打通，并已在店内安装了哗啦啦代理程序否则顾客将无法使用此功能！", 
			switchOff : "关闭此功能将导致顾客无法通过手机进行自助点菜结账！"
		},
		{
			id : 10, name : "commonreserve_order", title : "订座点菜", 
			desc : "开启此功能后顾客可通过手机或网上随时预订本店桌台、提前点菜、提前支付", 
			switchOn : "开启此功能请确保店内已安装了哗啦啦代理程序，否则将无法接收到顾客预订订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下预订订单！"
		},
		{
			id : 11, name : "justeat_order", title : "闪吃", 
			desc : "开启此功能后顾客可通过手机提前点菜、支付并填写到店就餐时间，店内收到订单通知后提前备餐，顾客到店就能就餐，吃完就闪。这项服务大大节省了顾客的就餐时间，服务体验明显提升", 
			switchOn : "开启此功能请确保店内已经安装了哗啦啦代理程序，否则将无法接受顾客闪吃订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下闪吃订单，将丢失需要快速就餐的顾客！"
		},
		{
			id : 20, name : "takeaway_order", title : "外送", 
			desc : "开启此功能后顾客可通过手机下外卖订单，避免了订餐电话占线、接线口音、手写记录错误等诸多问题，让店内外卖业务不堵塞更顺畅高效", 
			switchOn : "开启此功能请确保店内已安装了哗啦啦代理程序，否则将无法接收到顾客外卖订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下外卖订单！"
		},
		{
			id : 21, name : "takeout_order", title : "自提", 
			desc : "开启此功能后顾客可通过手机提前点菜支付下单，并告知到店自取时间，店内收到订单通知后提前备餐，顾客到店即可提取", 
			switchOn : "开启此功能请确保店内已经安装了哗啦啦代理程序，否则将无法接受顾客自提订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下自提订单！"
		},
		
		{
			id : 1000, name : "crm", title : "会员卡", 
			desc : "开启此功能后，顾客即可随时随地自助注册成为会员，在线储值、卡余额核销、查询卡信息等全自助操作，结合有效的运营策略您将看到会员数、消费粘性及储值快速增长。", 
			switchOn : "开启此功能请确保店内已经安装了哗啦啦代理程序，否则顾客将无法使用会员功能！", 
			switchOff : "关闭此功能将导致本店已有会员无法在本店享受会员服务（会员优惠、积分、卡余额支付等）！"
		},
		{
			id : 2000, name : "bi", title : "老板通", 
			desc : "开启此功能后餐厅老板即可通过《哗啦啦-饮食老板通》APP随时随地掌握本店营业实况、运营趋势等重要经营数据", 
			switchOn : "开启此功能需要店内餐饮软件与哗啦啦接口打通，并已在店内安装了哗啦啦代理程序否则将无法使用此功能！", 
			switchOff : "关闭此功能将导致老板在《哗啦啦-饮食老板通》APP中无法查到本店数据信息！"
		},
		{
			id : 3000, name : "saas", title : "收银系统", 
			desc : "开启此功能，将可以使用线上线下一体化的餐饮O2O系统", 
			switchOn : "开启此功能，将可以使用线上线下一体化的餐饮O2O系统", 
			switchOff : "关闭此功能后，门店将不能在进行点单收银接单操作"
		}
	];

	Hualala.TypeDef.PayMethodOptions = [
		{value : 0, label : "仅支持在线支付"},
		{value : 1, label : "仅支持线下支付"},
		{value : 2, label : "线上及线下支付均支持"},
	];
	/*店铺促销优惠支持0,只支持网上支付促销;1,只支持到店付款;2,网上及到店付均支持
	 *BUG #6102 【Dohko-dianpu】店铺优惠支付业务取消只对到付的支持*/
	Hualala.TypeDef.PromotionScopeOptions = [
		{value : 0, label : "只支持网上促销"},
		{value : 2, label : "网上及到店付促销均支持"},
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
		{value : 2, label : "收银台直接出餐"}
	];

	Hualala.TypeDef.HolidayFlagOptions = [
		{value : 0, label : "工作日及节假日均开放"},
		{value : 1, label : "仅节假日开放"},
		{value : 2, label : "仅工作日开放"}
	];

	Hualala.TypeDef.PayBeforeCommitOptions = [
		{value : 0, label : "餐后结账"},
		{value : 1, label : "餐前结账"}
		
	];
	//菜品展示模式
	Hualala.TypeDef.foodUITemplateOptions = [
		{value : 1, label : "列表模式"},
		{value : 2, label : "大图模式"},
		{value : 3, label : "瀑布流模式"}
	];
    //下单安全级别设置
    Hualala.TypeDef.CommitSafeLevelOptions = [
    	{value : 1, label : "不验证"},
    	{value : 2, label : "在餐厅一定范围外需验证"},
    	{value : 3, label : "必须验证"}
    ];
    //软文设置
    Hualala.TypeDef.adsIDOptions = [
    	{value : 0, label : "未设置" }
    	
    	
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
	/*银行代码列表*/
	Hualala.TypeDef.BankOptions = [
		{
			value: "CBC",
			label: "中国建设银行"
		},
		{
			value: "BC",
			label: "中国银行"
		},
		{
			value: "ABC",
			label: "中国农业银行"
		},
		{
			value: "ICBC",
			label: "中国工商银行"
		},
		{
			value: "PSBC",
			label: "中国邮政储蓄"
		},
		{
			value: "CEB",
			label: "中国光大银行"
		},
		{
			value: "GDB",
			label: "广发银行"
		},
		{
			value: "CMB",
			label: "招商银行"
		},
		{
			value: "CMSB",
			label: "民生银行"
		},
		{
			value: "CDB",
			label: "国家开发银行"
		},
		{
			value: "CIB",
			label: "兴业银行"
		},
		{
			value: "BCM",
			label: "交通银行"
		},
		{
			value: "HXB",
			label: "华夏银行"
		},
		{
			value: "SPDB",
			label: "浦发银行"
		},
		{
			value: "HSBC",
			label: "汇丰银行"
		},
		{
			value: "CCB",
			label: "中信银行"
		},
		{
			value: "Other",
			label: "其它"
		}
	];

	/*用户账号状态*/
	Hualala.TypeDef.UserStatus = [
		{value : 0, label : "停用"},
		{value : 1, label : "正常"}
	];
	Hualala.TypeDef.MCMDataSet = {
		/*礼品类型*/
		GiftTypes : [
			{value : '', label : "全部"},
			{value : 10, label : "电子代金券", type : 'voucher', unit : '元', bgColor : "#ff6600",
				 navs : [
				 	{label : "发送数", value : "tab_send"},
				 	{label : "使用数", value : "tab_used"},
				 	{label : "赠送", value : "tab_give"}
				 	//{label : "支付", value : "tab_pay"},Todo 电子代金券屏蔽掉支付和网上出售的入口
				 	//{label : "网上出售", value : "tab_onlinesale"}
				 ]
			},
			// {value : 20, label : "菜品优惠券"},
			// {value : 30, label : "实物礼品"},
			{value : 40, label : "会员充值", type : 'card', unit : '元', bgColor : "#cc0000",
				navs : [
					{label : "发送数", value : "tab_send"},
				 	{label : "使用数", value : "tab_used"}
				]
			},
			{value : 42, label : "会员积分", type : 'point', unit : '点', bgColor : "#009999",
				navs : [
					{label : "发送数", value : "tab_send"},
				 	{label : "使用数", value : "tab_used"}
				]
			},
			{value: 20, label: '菜品优惠券', type: 'preferential', unit: '元', bgColor: '#669900'},
			{value: 30, label: '实物礼品', type: 'physical', unit: '元', bgColor: '#0033FF'}
		],
		/*礼品发出方式*/
		GiftDistributeTypes : [
			{value : "", label : "全部"},
			{value : "10", label : "消费返券", include : true},
			{value : "20", label : "摇奖活动", include : true},
			{value : "30", label : "积分摇奖", include : true},
			{value : "40", label : "积分兑换", include : true},
			{value : "50", label : "订单摇奖"},
			{value : "60", label : "免费领取", include : true},
			{value : "61", label : "消费红包"},
			{value : "70", label : "商家赠送", include : true},
			{value : "80", label : "商家支付", include : true},
			{value : "90", label : "商家卖出", include : true},
			{value : "91", label : "会员摇奖"},
			{value : "92", label : "免费领取"},
			{value : "93", label : "积分兑换"},
			{value : "94", label : "参与活动"},
			{value : "95", label : "有奖竞猜"},
			{value : "96", label : "套餐充值"},
            {value : "97", label : "会员开卡送礼品"},
            {value : "98", label : "会员生日赠送"}
		],
		/*礼品使用状态*/
		GiftStatus : [
			{value : "", label : "全部"},
			{value : "1", label : "可使用"},
			{value : "2", label : "已使用"},
			{value : "3", label : "已过期"},
			{value : "4", label : "已退订"}
		],
		/*礼品业务支持*/
		GiftSupportOrderTypes : [
			{value : 2, label : "全部支持"},
			{value : 0, label : "堂食"},
			{value : 1, label : "外送"}
		],
		/*礼品使用时段限制*/
		GiftUsingTimeTypes : [
			{value : "1", label : "早餐"},
			{value : "2", label : "午餐"},
			{value : "3", label : "下午茶"},
			{value : "4", label : "晚餐"},
			{value : "5", label : "夜宵"}
		],
		/*实物礼品派发状态*/
		GiftIsSended : [
			{value : "0", label : "待发送"},
			{value : "1", label : "已发送"}
		],
		/*消费金额限制类型*/
		GiftMonetaryLimitTypes : [
			{value : "0", label : "不限"},
			{value : "1", label : "每满"},
			{value : "2", label : "满"}
		],
		/*电子礼品类，是否支持线下使用*/
		GiftIsOfflineUsing : [
			{value : "0", label : "不支持"},
			{value : "1", label : "支持"}
		],
		/*电子礼品类，节假日使用限制*/
		GiftIsHolidayUsing : [
			{value : "0", label : "不限制"},
			{value : "1", label : "不含节假日"},
			{value : "2", label : "仅节假日"}
		],
		/*电子礼品类，菜品范围限制*/
		GiftFoodScope : [
			{value : "0", label : "不限"},
			{value : "1", label : "仅可打折菜品"}
		],
		/*礼品审核状态*/
		GiftAuditStatus : [
			{value : "0", label : "未提交审核"},
			{value : "1", label : "审核未通过"},
			{value : "2", label : "审核通过"},
			{value : "3", label : "审核中"}
		],
		/*营销活动类型定义*/
		EventTypes : [
			{value : "", label : "全部"},
			{value : "20", label : "摇奖活动", type : "lucky-joy", bgColor : "rgb(204, 0, 0)"},
			{value : "21", label : "免费领取", type : "free-get", bgColor : "rgb(102, 153, 0)"},
			{value : "22", label : "报名活动", type : "apply-evt", bgColor : "rgb(102, 51, 102)"},
			{value : "30", label : "积分兑换", type : "credit-exchange", bgColor : "rgb(0, 153, 204)"},
			{value : "40", label : "营销红包", type : "marketing-redenvelope", bgColor : "rgb(156, 111, 109)"},
			{value : "41", label : "消费红包", type : "consume-redenvelope", bgColor : "rgb(199, 148, 148)"},
			{value : "50", label : "群发短信", type : "mass-texting", bgColor : "rgb(0, 153, 204)"},
			{value : "51", label : "生日赠送", type : "birthday-gift", bgColor : "rgb(51, 0, 204)"}
		],
		/*群发短信状态定义*0，定义中，1，待开始，2，进行中，3，发送完毕，4，失败*/
		SmsSendStatus :[
			{value : "0", label : "定义中"},
			{value : "1", label : "待开始"},
			{value : "2", label : "进行中"},
			{value : "3", label : "发送完毕"},
			{value : "4", label : "失败"}
		],
		/*settleStatus 结算状态:0不需要结算，1、待结算、2、结算完成、3、结算失败'*/
		SmsSettleStatus :[
			{value : "0", label : "不需要结算"},
			{value : "1", label : "待结算"},
			{value : "2", label : "结算完成"},
			{value : "3", label : "结算失败"}
		],
		/*营销活动摇奖方式*/
		EventLuckJoyTypes : [
			{value : "0", label : "大转盘"},
			{value : "1", label : "老虎机"},
			{value : "2", label : "刮刮卡"}
		],
		/*营销活动用户参与终端限制*/
		EventJoinClientTypes : [
			{value : "0", label : "不限制"},
			{value : "1", label : "仅限PC客户端"},
			{value : "2", label : "仅限手机客户端"},
			{value : "3", label : "仅限Pad客户端"},
			{value : "4", label : "仅限手机和Pad客户端"}
		],
		/*营销活动用户参与范围*/
		EventJoinUserRange : [
			{value : "0", label : "不限制"},
			{value : "1", label : "仅限绑定手机号码的用户"},
			{value : "2", label : "仅限在本集团订过餐的用户"}
		],
		/*营销活动开关*/
		EventIsActive : [
			{value : "", label : "不限"},
			{value : "0", label : "未启用"},
			{value : "1", label : "已启用"}
		],
		/*营销活动状态定义*/
		EventStatus : [

		],
		EventCardLevels : [
			// {value : "-1", label : "所有顾客参与（含非会员）"},
			{value : "0", label : "全部会员"}
		],
		EventCountCycleDays : [
			{value : 0, label : "不限次数"},
			{value : 1, label : "限制次数"},
			{value : 2, label : "限制参与次数的周期"}
		],
		IsVIPBirthdayMonth : [
			{value : 0, label : "不限制"},
			{value : 1, label : "仅本月生日的会员可参与"}
		],
		WinTypes : [
			{value : '', label : "不限"},
			{value : '0', label : "未中奖"}
		],
		JoinTypes : [
			{value : '', label : "不限"},
			{value : '0', label : "未入围"},
			{value : '1', label : "已入围"}
		],
        TransTimeFilter: [
            { name: '不限', value: '0'},
            { name: '早于', value: '5'},
            { name: '晚于', value: '3'}
        ]

	};

	

    Hualala.TypeDef.CRM = {
        //会员来源类型
        sourceType: {
            '10': 'WEB网站',
            '12': 'APP客户端',
            '14': '触屏版',
            '20': '店内',
            '22': '原会员导入',
            '30': '微信',
            '40': '淘宝',
            '50': '百度'
        },
        //会员来源途径
        sourceWay: { '0': '线下', '1': '线上' },
        transWay: { '0': '线下', '1': '线上' },
        //会员卡状态类型
        cardStatus: {
            '10': '正常',
            '20': '挂失中',
            '30': '冻结',
            '40': '注销'
        },
        //会员性别类型
        customerSex: { '0': '女', '1': '男', '2': '未知' },
        //会员交易类型
        transType: {
            '10': '初始转入', 
            '20': '储值', 
            '30': '消费', 
            '40': '调账',
            '50': '活动赠积分', 
            '60': '积分兑换', 
            '70': '积分清零', 
            '80': '活动赠余额', 
            '90': '消费撤销'
        },
        //会员活动类型
        eventWay: {
            '20': '摇奖', 
            '21': '领取', 
            '22': '报名', 
            '24': '有奖竞答', 
            '30': '积分兑换',
            '40': '营销红包',
            '41': '消费红包',
            '50': '群发短信',
            '51': '生日赠送',
        },
        //会员优惠券获取方式
        getWay: {
            '10': '消费返券',
            '20': '摇奖活动', 
            '30': '积分摇奖', 
            '40': '积分兑换', 
            '50': '订单摇奖',
            '60': '免费领取',
            '70': '商家赠送',
            '80': '商家支付',
            '90': '换卡转入 ',
            '91': '会员摇奖',
            '92': '免费领取',
            '93': '积分兑换',
            '94': '参与活动',
            '95': '有奖竞猜',
            '96': '套餐充值',
			'97': '会员开卡送礼品',
            '98': '会员生日赠送',
            '100': '批量导入'
        },
        //会员优惠券状态
        giftStatus: { '1': '未使用', '2': '已使用', '3': '已过期', '4': '已退订' },
        //会员卡日志类型
        logType: {
            '0': '其它', 
            '10': '挂失', 
            '11': '解除挂失', 
            '20': '冻结', 
            '21': '解冻', 
            '30': '注销', 
            '31': '激活', 
            '40': '卡遗损补办', 
            '41': '换手机号', 
            '42': '补办实体卡', 
            '50': '转让', 
            '60': '升级', 
            '61': '降级',
            '100':'线下开卡'
        }
    };
    /**
	 * 是否内置渠道
	 * 0：内置渠道 1：不是内置渠道
	 * 
	 */
	Hualala.TypeDef.ChannelStatus = [
		{value : 0, label : "是"},
		{value : 1, label : "否"}
	];
	/**
	 * 部门类型
	 * 0：未知 1：出品部门 2：领料部门 3：出品及领料部门
	 * 
	 */
	Hualala.TypeDef.SaasDepartmentType = [
		{value : 0, label : "未知"},
		{value : 1, label : "出品部门"},
		{value : 2, label : "领料部门"},
		{value : 3, label : "出品及领料部门"}
	];
	/**
	 * 打印类型
	 * 0：不打印 1：一菜一单 2：多菜一单
	 * 
	 */
	Hualala.TypeDef.SaasPrintType = [
		{value : 0, title : "不打印"},
		{value : 1, title : "一菜一单"},
		{value : 2, title : "多菜一单"}
	];
	/**
	 *saas备注类型
	 *10：点单备注 20：作法 30：口味 40：退菜原因 50：赠菜原因
	 *60：改价原因 70：改单原因  80：预订退订原因  90：外卖退单原因,100退款原因 110：账单作废原因
	 */
	Hualala.TypeDef.SaasNotesType =[
		{value : "10",  label: "点单备注" },
		{value : "20",  label: "作法" },
		{value : "30",  label: "口味" },
		{value : "40",  label: "退菜原因" },
		{value : "50",  label: "赠菜原因" },
		{value : "60",  label: "改价原因" },
		{value : "70",  label: "改单原因" },
		{value : "80",  label: "预订退订原因" },
		{value : "90",  label: "外卖退单原因" },
		{value : "100",  label: "退款原因" },
		{value : "110", label :"账单作废原因" }

	];
	/**
	 *saas备注加价方式
	 *0：不加价 1：固定加价 2：按数量加价 3：按人数加价 
	 *
	 */
	Hualala.TypeDef.SaasaddPriceType =[
		{value : "0",  label: "不加价" },
		{value : "1",  label: "固定加价" },
		{value : "2",  label: "按数量加价" },
		{value : "3",  label: "按人数加价" }
	];

	Hualala.TypeDef.ShopDiscountDataSet = {
		/*折扣范围* 0：部分打折 1：全部打折 */
		DiscountRangeTypes : [
			{value : "0",  label: "部分打折" },
			{value : "1",  label: "全部打折" }
		],
		/*是否启用*/
		DiscountIsActive : [
			{value : "1", label : "已启用"},
			{value : "0", label : "未启用"}
		],
		//是否享受会员价
		DiscountIsVipPrice :[
			{value : "0", label : "不享受"},
			{value : "1", label : "享受"}
		]
	};

	/*
	* 店铺》站点及参数设置的一些常量
	* */
	Hualala.TypeDef.ShopSaasParams = {
		//账单抹零方式
		moneyWipeZeroTypes: [
			{value: '0', label: '不抹零'},
			{value: '1', label: '四舍五入到角'},
			{value: '2', label: '向上抹零到角'},
			{value: '3', label: '向下抹零到角'},
			{value: '4', label: '四舍五入到元'},
			{value: '5', label: '向上抹零到元'},
			{value: '6', label: '向下抹零到元'},
		],
		//结账清单打印份数
		checkoutBillPrintCopies: [
			{value: '0', label: '不打印'},
			{value: '1', label: '打印1份'},
			{value: '2', label: '打印2份'},
			{value: '3', label: '打印3份'},
			{value: '4', label: '打印4份'}
		],
		//明细打印方式
		checkoutBillDetailPrintWays: [
			{value: '0', label: '不打印明细项目'},
			{value: '1', label: '打印明细项目'},
			{value: '2', label: '相同项目合并打印'}
		],
		//明细金额类型
		checkoutBillDetailAmountTypes: [
			{value: '0', label: '优惠前金额小计'},
			{value: '1', label: '优惠后金额小计'}
		],
		//收到网上订单语音提醒方式
		revOrderAfterPlayVoiceTypes: [
			{value: '0', label: '不提醒'},
			{value: '1', label: '每订单提醒一次'},
			{value: '9', label: '语音重复提醒'}
		],
		//语音播报速度
		TTSVoiceSpeedTypes: [
			{value: '0', label: '慢'},
			{value: '1', label: '略快'},
			{value: '2', label: '快'},
			{value: '3', label: '很快'}
		],
		//厨房打印凭证类型
		kitchenPrintBillTypeLst: [
			{value: 'LTD', label: '留台单'},
			{value: 'ZZD', label: '制作单'},
			{value: 'CCD', label: '传菜单'},
			{value: 'CJD', label: '催叫单'},
			{value: 'TCD', label: '退菜单'},
			{value: 'HTD', label: '换台单'},
			{value: 'CHT', label: '转菜单'}
		],
		//站点业态模式
		siteBizModelTypes: [
			{ value: '0', label: '快餐'},
			{ value: '1', label: '正餐'},
			{ value: '9', label: '零售'}
		],
		//厨房小票桌台号使用字体0：常规字体 1：大字体 （默认为0：常规字体）
		KitchenTableNameBigFontTypes:[
			{ value: '0', label: '常规字体'},
			{ value: '1', label: '大字体'}
		],
		//副屏广告轮播图片播放间隔[2-8秒]
		PCScreen2AdImageIntervalTimeTypes:[
			{value: '3', label: '默认3秒'},
			{value: '4', label: '4秒'},
			{value: '5', label: '5秒'},
			{value: '6', label: '6秒'},
			{value: '7', label: '7秒'},
			{value: '8', label: '8秒'}
		]

	};
	/*顾客反馈*/
	Hualala.TypeDef.FeedbackDataSet = {
		/* 反馈类型 0：默认，未知 10：投诉 20：建议  30：表扬  40：询问  50：纠错*/
		feedbackTypeData : [
			{value : 0, label : "全部",  color:"color:black"},
			{value : 10, label : "投诉", color:"color:#9900ff"},
			{value : 20, label : "建议", color:"color:#009933"},
			{value : 30, label : "表扬", color:"color:#ff0000"},
			{value : 40, label : "询问", color:"color:#ff9900"},
			{value : 50, label : "纠错", color:"color:#0033ff"},
		],
		/*客户端类型 0：PC_WEB 5：触屏  10：userIPhone，用户iPhone客户端 
			20：userAndroid，用户安卓客户端 30：userWinPhone，用户WinPhone客户端 
			40：userIPad，用户iPad客户端 50：shopPC，商家PC客户端 90：shopPOS，POS设备客户端*/
		clientTypeData : [
			{value : "0", label : "PC_WEB端"},
			{value : "5", label : "触屏端"},
			{value : "10", label : "iPhone客户端"},
			{value : "20", label : "android客户端"},
			{value : "30", label : "WinPhone客户端"},
			{value : "40", label : "iPad客户端"},
			{value : "50", label : "商家PC客户端"},
			{value : "90", label : "POS设备客户端"}
		],
		/*"responseStatus":反馈响应状态 0：待处理 1：处理中 2：处理完成*/
		responseStatusData :[
			{value: "10", label:"全部"},
			{value: "0", label:"待处理"},
			{value: "1", label:"处理中"},
			{value: "2", label:"处理完成"}
		]
	};

})(jQuery);











