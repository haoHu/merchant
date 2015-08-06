var Test = Test || {};
Test.ShopMembersData = {
    "data": {
        "groupID": "5",
        "keywordLst": "123",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "IDCard": "6122321768980987652",
                "accountStatus": "1",
                "action": "0",
                "actionTime": "20150420145105",
                "createTime": "20150420145105",
                "empCardNo": "1113100",
                "empCode": "10001",
                "empEmail": "7878765@qq.com2",
                "empKey": "7ec8a700-5d2e-411b-aa49-8ea410afcfba",
                "empMobile": "123",
                "empName": "张三",
                "empRemark": "测试2",
                "groupID": "5",
                "itemID": "5",
                "lastLoginTime": "0",
                "localPosLoginPWD": "10120dcf89de482b2ee67c2dacb60434",
                "loginCount": "0",
                "maxDiscountRate": "1.00",
                "maxFreeAmount": "2.00",
                "notRightLst": "3",
                "padNo": "022",
                "photoImage": "xxxx2",
                "positionName": "HLL2",
                "rightIDLst": "",
                "roleIDLst": "4",
                "roleNameLst": "店长,服务员",
                "shopID": "77875"
            }
        ],
        "shopID": "77875"
    },
    "resultcode": "000",
    "resultmsg": "服务执行成功！"
};

Test.UpdateShopMemberData ={
    "data": {
        "IDCard": "1",
        "accountStatus": "1",
        "action": "1",
        "actionTime": "20150422174344",
        "createTime": "20150422170949",
        "empCardNo": "1",
        "empCode": "1",
        "empEmail": "",
        "empKey": "908fceb8-b810-4544-b35e-03676786077d",
        "empMobile": "1",
        "empName": "1",
        "empRemark": "",
        "groupID": "5",
        "itemID": "8",
        "lastLoginTime": "0",
        "localPosLoginPWD": "c60297122157b6320c9b789fc72d5629",
        "loginCount": "0",
        "maxDiscountRate": "1.00",
        "maxFreeAmount": "0.00",
        "notRightLst": "",
        "padNo": "",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "photoImage": "",
        "positionName": "1",
        "rightIDLst": "",
        "roleIDLst": "",
        "roleNameLst": "",
        "shopID": "77875"
    },
    "resultcode": "000",
    "resultmsg": "服务执行成功！"
};

Test.AddShopMemberData = {
    "data": {
        "IDCard": "1",
        "accountStatus": "2",
        "action": "0",
        "actionTime": "0",
        "createTime": "20150422170949",
        "empCardNo": "3",
        "empCode": "5",
        "empEmail": "",
        "empKey": "908fceb8-b810-4544-b35e-03676786077d",
        "empMobile": "5",
        "empName": "6",
        "empRemark": "",
        "groupID": "5",
        "itemID": "8",
        "lastLoginTime": "0",
        "localPosLoginPWD": "afa2e6eac427b3fc5e4a2fbd18e525b0",
        "loginCount": "0",
        "maxDiscountRate": "1.00",
        "maxFreeAmount": "0.00",
        "notRightLst": "",
        "padNo": "",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "photoImage": "",
        "positionName": "8",
        "rightIDLst": "",
        "roleIDLst": "",
        "roleNameLst": "",
        "shopID": "77875"
    },
    "resultcode": "000",
    "resultmsg": "服务执行成功！"
};

Test.MemberRoles = {
    "data": {
        "groupID": "5",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具有门店系统的最高权限",
                "roleEmpCount": "0",
                "roleID": "100100",
                "roleName": "店长",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具有手机主管及报表的全部权限",
                "roleEmpCount": "0",
                "roleID": "100150",
                "roleName": "财务",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具有门店系统的全部权限",
                "roleEmpCount": "0",
                "roleID": "100200",
                "roleName": "系统网管",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具备收银的最高权限",
                "roleEmpCount": "0",
                "roleID": "100300",
                "roleName": "收银主管",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具备收银基本权限（不能反结账）",
                "roleEmpCount": "0",
                "roleID": "100400",
                "roleName": "收银员",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具备点单权限（可退、赠",
                "roleEmpCount": "0",
                "roleID": "100500",
                "roleName": "前厅主管",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "具备点单基本权限",
                "roleEmpCount": "0",
                "roleID": "100600",
                "roleName": "服务员",
                "roleRightCount": "0"
            },
            {
                "groupID": "0",
                "isActive": "1",
                "roleDescription": "暂不具备系统操作权限",
                "roleEmpCount": "0",
                "roleID": "100900",
                "roleName": "配送员",
                "roleRightCount": "0"
            }
        ]
    },
   "resultcode": "000",
       "resultmsg": "服务执行成功！"
 };

Test.MemberRights = {
    "data": {
        "groupID": "5",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "调整已结账单科目",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "会员挂失|补办|注销|换卡等",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "人员及权限设置",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已点菜品做改价操作",
                "rightGroupName": "点单收银",
                "rightID": "2010030",
                "rightName": "改菜价",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对新收到的网上订单进行退单操作",
                "rightGroupName": "点单收银",
                "rightID": "2050010",
                "rightName": "网上订单退单",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "赠送菜品给顾客",
                "rightGroupName": "点单收银",
                "rightID": "2010020",
                "rightName": "赠菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已开单进行结账操作",
                "rightGroupName": "点单收银",
                "rightID": "2010050",
                "rightName": "结账收银",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "对已落单菜品退菜",
                "rightGroupName": "点单收银",
                "rightID": "2010010",
                "rightName": "退菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "删除已落单菜品",
                "rightGroupName": "点单收银",
                "rightID": "2010040",
                "rightName": "删菜",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置产品已售完",
                "rightGroupName": "系统配置",
                "rightID": "1010020",
                "rightName": "沽清设置",
                "rightType": "r",
                "rightUrl": ""
            },
            {
                "IsActive": "1",
                "rightDescription": "设置营业模式及可点菜品分类等",
                "rightGroupName": "系统配置",
                "rightID": "1010010",
                "rightName": "站点设置",
                "rightType": "r",
                "rightUrl": ""
            }
        ],
        "roleID": "100500"
    },
    "resultcode": "000",
    "resultmsg": "服务执行成功！"
};
Test.PrinterQueryData ={
    "data": {
        "groupID": "5",
        "shopID":"77875",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "action": "0",
                "actionTime": "20150427163110",
                "createTime": "20150427163110",
                "currPrinterStatus": "1",
                "groupID": "5",
                "itemID": "2",
                "lastStatusUpdateTime": "20150427163110",
                "printerKey": "4e085727-7e6c-44b5-b530-b0198c4f7d05",
                "printerName": "热菜打印机",
                "printerPaperSize": "80",
                "printerPort": "50",
                "printerPortType": "2",
                "printerBrand":"EPSON",
                "printerModel":"22" ,
                "printerRemark": "<br/>",
                "shopID": "0"
            },
            {
                "action": "0",
                "actionTime": "20150427163110",
                "createTime": "20150427163110",
                "currPrinterStatus": "1",
                "groupID": "5",
                "itemID": "3",
                "lastStatusUpdateTime": "20150427163110",
                "printerKey": "4e085756-7e6c-44b5-b530-b0198c4f7d05",
                "printerName": "凉菜打印机",
                "printerPaperSize": "80",
                "printerPort": "50",
                "printerPortType": "2",
                "printerBrand":"EPSON",
                "printerModel":"222" ,
                "printerRemark": "换行，换行<br/>一个换行<br/>两个黄河<br/>三个黄杭",
                "shopID": "0"
            }
        ]
    },
    "resultcode": "000",
    "resultmsg": "服务执行成功！"
};
Test.PrinterAreaData ={
    "data": {
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "action": "0",
                "actionTime": "20150627161223",
                "areaKey": "9b9ce95d-8654-45b6-b210-d5ac77d92cea",
                "areaName": "一楼",
                "createTime": "20150627161223",
                "departmentKey": "dk_5888",
                "departmentName": "凉菜部",
                "dispatchBillPrintCopies": "1",
                "dispatchBillPrinterKey": "",
                "dispatchBillPrinterName": "艾普逊",
                "groupID": "5",
                "isPrintToDispatchBill": "1",
                "itemID": "127",
                "printCopies": "1",
                "printWay": "1",
                "printerKey": "",
                "printerName": "",
                "shopID": "77875"
            },
            {
                "action": "0",
                "actionTime": "20150627161223",
                "areaKey": "8b4ce95d-6584-45b6-b210-d5ac66d02ace",
                "areaName": "一楼",
                "createTime": "20150627161223",
                "departmentKey": "dk_57",
                "departmentName": "热菜部",
                "dispatchBillPrintCopies": "1",
                "dispatchBillPrinterKey": "",
                "dispatchBillPrinterName": "普斯达",
                "groupID": "5",
                "isPrintToDispatchBill": "1",
                "itemID": "128",
                "printCopies": "1",
                "printWay": "1",
                "printerKey": "",
                "printerName": "滴答的",
                "shopID": "77875"
            },
            {
                "action": "0",
                "actionTime": "20150627161223",
                "areaKey": "8b4ce95d-6584-45b6-b210-d5ac66d02ace",
                "areaName": "一楼",
                "createTime": "20150627161223",
                "departmentKey": "dk_57",
                "departmentName": "热菜部",
                "dispatchBillPrintCopies": "1",
                "dispatchBillPrinterKey": "",
                "dispatchBillPrinterName": "普斯达",
                "groupID": "5",
                "isPrintToDispatchBill": "0",
                "itemID": "129",
                "printCopies": "1",
                "printWay": "1",
                "printerKey": "",
                "printerName": "滴答的",
                "shopID": "77875"
            }
        ]
    },
    "resultcode": "000",
    "resultmsg": ""
};
Test.DiscountData ={
    "data": {
        "groupID": "5",
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "action": "0",
                "actionTime": "20150706181443",
                "createBy": "doulaofang",
                "createTime": "20150706181443",
                "discountRange": "1",
                "discountRate": "1.00",
                "discountWayName": "不打折试试",
                "discountWayRemark": "不打折，折扣率为1",
                "groupID": "5",
                "isActive": "1",
                "isVipPrice": "1",
                "itemID": "32",
                "shopID": "77875"
            },
            {
                "action": "0",
                "actionTime": "20150706181409",
                "createBy": "doulaofang",
                "createTime": "20150706181409",
                "discountRange": "1",
                "discountRate": "0.00",
                "discountWayName": "全免试试",
                "discountWayRemark": "全免，折扣率为0",
                "groupID": "5",
                "isActive": "0",
                "isVipPrice": "0",
                "itemID": "31",
                "shopID": "77875"
            },
            {
                "action": "1",
                "actionTime": "20150630103024",
                "createBy": "doulaofang",
                "createTime": "20150630100259",
                "discountRange": "1",
                "discountRate": "0.88",
                "discountWayName": "全场8.8折",
                "discountWayRemark": "0.88",
                "groupID": "5",
                "isActive": "1",
                "isVipPrice": "1",
                "itemID": "21",
                "shopID": "77875"
            }
        ],
        "shopID": "77875"
    },
    "resultcode": "000",
    "resultmsg": "服务执行成功！"
};