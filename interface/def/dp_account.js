/*结算账户数据定义*/
var $$Account = {
	defaultAccount : "是否默认结算账户0:否;1:是",
	settleUnitID : "结算主体ID",
	settleUnitName : "结算主体名称",
	groupID : "集团ID",
	shopCount : "关联结算账户的店铺数量",
	settleIncomTotal : "收入累计",
	settleBalance : "结算金额（账户余额）",
	settleSpendingTotal : "支出累计",
	feeRatio : "佣金比例",
	isActiveAutoTransfer : "是否自动结现（提现）",
	autoTransferDays : "自动结现天数",
	timeAmountRship : "结算周期和金额的关系 0：或者 1：并且",
	autoTransferMinAmount : " 自动结算需满足最小金额",
	isRemindAmount : "是否金额提醒 0：不提醒 1：提醒",
	remindAmount : "提醒金额",
	poundageMinAmount : "COMMENT 多少结算金额以下收取手续费",
	poundageAmount : "手续费额度",
	startDate : "开始结算时间",
	lastTransferTime : "最后结现时间（YYYYMMDDHHnnSS)",
	bankCode : "银行代码",
	bankAccount : "转账帐号",
	bankName : "转账行名称",
	receiverType : "收款方类型(1、个人，2、企业)",
	receiverName : "受款方名称(单位名或姓名)",
	receiverLinkman : "收款方联系人",
	receiverPhone : "收款方联系电话",
	receiverMobile : " 受款方手机号码",
	receiverEmail : "受款方邮箱",
	remark : "结算主体备注信息",
	action : "记录状态",
	actionTime : "记录修改时间",
	createTime : " 记录创建时间"
};

var $$AccountList = {
	inAmount : '收入总计',
	inCount : '收入交易笔数',
	outAmount : '支出总计',
	outCount : '支出交易笔数',
	transAmount : '交易总金额',
	transCount : '交易总笔数',
	pageCount : '总页数',
	pageNo : '页码',
	pageSize : '每页条目数',
	totalSize : '总条目数',
	records : [$$Account, $$Account,...]
}

/*结算账户交易明细数据定义*/
var $$AccountTransList = [$$AccountTransDetail, $$AccountTransDetail,....];
var $$AccountTransDetail = {
	SUATransItemID : "结算主题账户交易记录ID",
	action : "记录状态",
	actionTime : "记录修改时间",
	cardID : "会员卡ID",
	createTime : "记录创建时间",
	createType : "记录创建类型 10：自动 20：手动",
	empInfo : "平台操作人员信息（登录名|姓名）",
	empRemark : "操作人员备注",
	giftDetailItemID : "订单中使用了具体的代金券ItemID",
	groupID : "集团ID",
	groupName : "集团名称",
	orderID : "订单ID",
	orderKey : "关联订单Key （当网上订餐消费时此值为订单Key）",
	saveMoneySetID : "充值套餐ID",
	settleUnitID : "结算主体ID",
	settleUnitName : "结算主体名称",
	shopID : "店铺ID",
	shopName : "店铺名称",
	shopOpratorInfo : "商户操作人员信息（登录名|姓名）",
	transAfterBalance : "交易后结算主体账户余额",
	transAmount : "交易金额",
	transCloseTime : "交易关闭时间(yyyyMMddhhmmss)",
	transCreateTime : "交易创建时间(yyyyMMddhhmmss)",
	transPoundage : "交易手续费",
	transPoundageRemark : "交易手续费说明",
	transSalesCommission : "交易佣金",
	transSalesCommissionRemark : "交易佣金说明",
	transStatus : "交易状态 0：等待交易完成 1：交易成功 2：交易关闭(Hualala.TypeDef.FSMTransStatus)",
	transSuccessTime : "交易成功时间(yyyyMMddhhmmss)",
	transType : "交易类型(Hualala.TypeDef.FSMTransType)"
};





































