var Test = Test || {};
Test.ShopTimeData ={
    "data": {
        "records": [
            {
                "action": "0",
                "actionTime": "20130106141956",
                "createTime": "20130106141956",
                "endTime": "1100",
                "isActive": "0",
                "shopID": "75816",
                "startTime": "0600",
                "timeID": "1",
                "timeName": "早餐",
                "timeUnit": "30"
            },
            {
                "action": "1",
                "actionTime": "20130119154131",
                "createTime": "20130106141956",
                "endTime": "1400",
                "isActive": "1",
                "shopID": "75816",
                "startTime": "1130",
                "timeID": "2",
                "timeName": "午餐",
                "timeUnit": "30"
            },
            {
                "action": "0",
                "actionTime": "20130106141956",
                "createTime": "20130106141956",
                "endTime": "1700",
                "isActive": "0",
                "shopID": "75816",
                "startTime": "1500",
                "timeID": "3",
                "timeName": "下午茶",
                "timeUnit": "30"
            },
            {
                "action": "1",
                "actionTime": "20130119152711",
                "createTime": "20130106141956",
                "endTime": "2100",
                "isActive": "1",
                "shopID": "75816",
                "startTime": "1730",
                "timeID": "4",
                "timeName": "晚餐",
                "timeUnit": "30"
            },
            {
                "action": "0",
                "actionTime": "20130106141956",
                "createTime": "20130106141956",
                "endTime": "0600",
                "isActive": "1",
                "shopID": "75816",
                "startTime": "2200",
                "timeID": "5",
                "timeName": "夜宵",
                "timeUnit": "60"
            }
        ],
        "refTimeShopID": "0"
    },
    "processTime": "20141215110913672",
    "resultcode": "000",
    "resultmsg": ""
}
//------------引用其他店铺时段------------------
/*{
    "data": {
        "records": [
            {
                "action": "0",
                "actionTime": "20130329153404",
                "createTime": "20130329153404",
                "endTime": "1100",
                "isActive": "0",
                "shopID": "759926",
                "startTime": "0600",
                "timeID": "1",
                "timeName": "早餐",
                "timeUnit": "30"
            },
            {
                "action": "0",
                "actionTime": "20130329153404",
                "createTime": "20130329153404",
                "endTime": "1500",
                "isActive": "1",
                "shopID": "759926",
                "startTime": "1100",
                "timeID": "2",
                "timeName": "午餐",
                "timeUnit": "30"
            },
            {
                "action": "0",
                "actionTime": "20130329153404",
                "createTime": "20130329153404",
                "endTime": "1700",
                "isActive": "0",
                "shopID": "759926",
                "startTime": "1500",
                "timeID": "3",
                "timeName": "下午茶",
                "timeUnit": "30"
            },
            {
                "action": "1",
                "actionTime": "20130329153431",
                "createTime": "20130329153404",
                "endTime": "2200",
                "isActive": "1",
                "shopID": "759926",
                "startTime": "1700",
                "timeID": "4",
                "timeName": "晚餐",
                "timeUnit": "30"
            },
            {
                "action": "0",
                "actionTime": "20130329153404",
                "createTime": "20130329153404",
                "endTime": "0600",
                "isActive": "0",
                "shopID": "759926",
                "startTime": "2200",
                "timeID": "5",
                "timeName": "夜宵",
                "timeUnit": "60"
            }
        ],
        "refTimeShopID": "759926",
        "refTimeShopName": "黑松白鹿(海淀万柳店)"
    },
    "processTime": "20141215112008929",
    "resultcode": "000",
    "resultmsg": ""
};*/
Test.refTimeShoData = {
    "data": {
        "datasets": {
            "areaCountDs": {
                "data": {
                    "page": {
                        "pageCount": 0,
                        "pageNo": 0,
                        "pageSize": 0,
                        "totalSize": 0
                    },
                    "records": [
                        {
                            "areaCount": "2",
                            "areaID": "1021420000",
                            "areaName": "嘉定区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1021180000",
                            "areaName": "浦东新区"
                        },
                        {
                            "areaCount": "2",
                            "areaID": "1022030000",
                            "areaName": "和平区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1021270000",
                            "areaName": "闸北区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1021150000",
                            "areaName": "闵行区"
                        },
                        {
                            "areaCount": "2",
                            "areaID": "1021210000",
                            "areaName": "黄浦区"
                        },
                        {
                            "areaCount": "2",
                            "areaID": "1021120000",
                            "areaName": "长宁区"
                        },
                        {
                            "areaCount": "31",
                            "areaID": "1010030000",
                            "areaName": "朝阳区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1021060000",
                            "areaName": "徐汇区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1010120000",
                            "areaName": "海淀区"
                        },
                        {
                            "areaCount": "2",
                            "areaID": "1010060000",
                            "areaName": "西城区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1010090000",
                            "areaName": "东城区"
                        },
                        {
                            "areaCount": "2",
                            "areaID": "1021090000",
                            "areaName": "静安区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "1021240000",
                            "areaName": "普陀区"
                        },
                        {
                            "areaCount": "3",
                            "areaID": "1021030000",
                            "areaName": "卢湾区"
                        },
                        {
                            "areaCount": "1",
                            "areaID": "13160000",
                            "areaName": "固安县"
                        }
                    ]
                }
            },
            "cityCountDs": {
                "data": {
                    "page": {
                        "pageCount": 0,
                        "pageNo": 0,
                        "pageSize": 0,
                        "totalSize": 0
                    },
                    "records": [
                        {
                            "cityCount": "16",
                            "cityID": "1021",
                            "cityName": "上海"
                        },
                        {
                            "cityCount": "2",
                            "cityID": "1022",
                            "cityName": "天津"
                        },
                        {
                            "cityCount": "1",
                            "cityID": "1316",
                            "cityName": "廊坊"
                        },
                        {
                            "cityCount": "35",
                            "cityID": "1010",
                            "cityName": "北京"
                        }
                    ]
                }
            }
        },
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "77875",
                "shopName": "豆捞坊(西单店)1"
            },
            {
                "areaID": "1010090000",
                "areaName": "东城区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "77876",
                "shopName": "豆捞坊(崇文门店)"
            },
            {
                "areaID": "1010120000",
                "areaName": "海淀区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "77878",
                "shopName": "豆捞坊(中关村店)"
            },
            {
                "areaID": "1010060000",
                "areaName": "西城区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "1",
                "shopID": "77880",
                "shopName": "豆捞坊(君太店)"
            },
            {
                "areaID": "1021150000",
                "areaName": "闵行区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759818",
                "shopName": "豆捞坊(莘庄店)"
            },
            {
                "areaID": "1021060000",
                "areaName": "徐汇区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759820",
                "shopName": "豆捞坊(徐汇店)"
            },
            {
                "areaID": "1021090000",
                "areaName": "静安区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759821",
                "shopName": "豆捞坊(南京西路店)"
            },
            {
                "areaID": "1021210000",
                "areaName": "黄浦区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759822",
                "shopName": "豆捞坊(南京东路店)"
            },
            {
                "areaID": "1021210000",
                "areaName": "黄浦区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759823",
                "shopName": "豆捞坊(金陵东路店)"
            },
            {
                "areaID": "1021090000",
                "areaName": "静安区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759825",
                "shopName": "豆捞坊(百乐门店)"
            },
            {
                "areaID": "1021240000",
                "areaName": "普陀区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759826",
                "shopName": "豆捞坊(长寿店)"
            },
            {
                "areaID": "1021120000",
                "areaName": "长宁区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759827",
                "shopName": "豆捞坊(百联西郊店)"
            },
            {
                "areaID": "1021120000",
                "areaName": "长宁区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759828",
                "shopName": "豆捞坊(中山公园店)"
            },
            {
                "areaID": "1021420000",
                "areaName": "嘉定区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759830",
                "shopName": "豆捞坊(江桥万达店)"
            },
            {
                "areaID": "1021180000",
                "areaName": "浦东新区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759831",
                "shopName": "豆捞坊(金桥店)"
            },
            {
                "areaID": "1021420000",
                "areaName": "嘉定区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759834",
                "shopName": "豆捞坊(安亭店)"
            },
            {
                "areaID": "1021270000",
                "areaName": "闸北区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "759835",
                "shopName": "豆捞坊(大宁店)"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022522",
                "shopName": "测试001"
            },
            {
                "areaID": "1022030000",
                "areaName": "和平区",
                "cityID": "1022",
                "cityName": "天津",
                "operationMode": "0",
                "shopID": "76022523",
                "shopName": "测试002"
            },
            {
                "areaID": "1021030000",
                "areaName": "卢湾区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "76022530",
                "shopName": "测试003"
            },
            {
                "areaID": "1021030000",
                "areaName": "卢湾区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "76022531",
                "shopName": "测试004"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022532",
                "shopName": "测试005"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "2",
                "shopID": "76022637",
                "shopName": "豆捞坊测试店铺"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022638",
                "shopName": "测试店铺哗啦啦（豆捞坊）"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022639",
                "shopName": "豆捞坊（哗啦啦测试店铺）"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022650",
                "shopName": "豆捞坊(豆捞坊测试店铺)"
            },
            {
                "areaID": "1022030000",
                "areaName": "和平区",
                "cityID": "1022",
                "cityName": "天津",
                "operationMode": "0",
                "shopID": "76022651",
                "shopName": "豆捞坊（测试店铺xd）"
            },
            {
                "areaID": "1010060000",
                "areaName": "西城区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022652",
                "shopName": "测试店铺004"
            },
            {
                "areaID": "1021030000",
                "areaName": "卢湾区",
                "cityID": "1021",
                "cityName": "上海",
                "operationMode": "0",
                "shopID": "76022655",
                "shopName": "哗啦啦测试店铺"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022656",
                "shopName": "555"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022657",
                "shopName": "哗啦啦测试的店铺"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022660",
                "shopName": "哗啦啦(测试店铺)"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022662",
                "shopName": "测试"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022670",
                "shopName": "fdsafdsafdsafdsa"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022671",
                "shopName": "232432134qefdeqf"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022673",
                "shopName": "2323"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022675",
                "shopName": " space test"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "1",
                "shopID": "76022676",
                "shopName": " space test"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022677",
                "shopName": "cesshidianpu"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022685",
                "shopName": "23323332"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022698",
                "shopName": "332324324"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022699",
                "shopName": "测试店铺90"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022700",
                "shopName": "测试店铺1990"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022702",
                "shopName": "21873971"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022703",
                "shopName": "test1.0"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022705",
                "shopName": "test.0.7839691548142582"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022706",
                "shopName": "w2323"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022707",
                "shopName": "test.0.2602394223213196"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022708",
                "shopName": "test.0.7870728366542608"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022709",
                "shopName": "3ew"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022710",
                "shopName": "test.0.7925971748773009"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022711",
                "shopName": "test.0.16092796344310045"
            },
            {
                "areaID": "1010030000",
                "areaName": "朝阳区",
                "cityID": "1010",
                "cityName": "北京",
                "operationMode": "0",
                "shopID": "76022712",
                "shopName": "眉州东坡小吃(测试)"
            },
            {
                "areaID": "13160000",
                "areaName": "固安县",
                "cityID": "1316",
                "cityName": "廊坊",
                "operationMode": "0",
                "shopID": "76022713",
                "shopName": "324"
            }
        ]
    },
    "resultcode": "000",
    "resultmsg": ""
};
Test.smsCardShops = {
    "data": {
        "page": {
            "pageCount": 0,
            "pageNo": 0,
            "pageSize": 0,
            "totalSize": 0
        },
        "records": [
            {
                "accountID": "247",
                "roleType": "manager",
                "shopID": "77875",
                "shopName": "豆捞坊(西单店)1"
            }
        ]
    },
    "resultcode": "000",
    "resultmsg": ""
};


Test.getversionInfo = {
    "processTime": "20150902095545935",
    "data": {
        "pageCount": 1,
        "pageNo": 1,
        "pageSize": 20,
        "records": [
            {
                "createTime": "20140630100806",
                "isMustUpdate": "0",
                "updateRemark": "PC客户端升级说明：\n1、增加了验券功能\n2、增加了CRM的办卡、储值、刷卡、挂失等功能\n3、增加了收到订单通知消息后的声音提醒功能\n4、完善了“管理网上菜单”功能",
                "itemID": "46",
                "remark": "",
                "imagePathLst": "",
                "downloadUrl": "http://res.hualala.com/group1/M00/00/EB/wKgCIVOwxnXigEuhACl2AH-ibdA620.exe",
                "QCodeImagePath": "",
                "actionTime": "20140630100806",
                "adaptOSRemark": "",
                "groupID": "5",
                "releaseDate": "20140612",
                "clientName": "商户系统版本更新",
                "action": "0",
                "versionNo": "V3.0(20140612)",
                "clientType": "410",
                "adaptScreenSizeLst": "all"
            },
            {
                "createTime": "20140630100806",
                "isMustUpdate": "0",
                "updateRemark": "PC客户端升级说明：\n1、增加了验券功能\n2、增加了CRM的办卡、储值、刷卡、挂失等功能\n3、增加了收到订单通知消息后的声音提醒功能\n4、完善了“管理网上菜单”功能",
                "itemID": "46",
                "remark": "",
                "imagePathLst": "",
                "downloadUrl": "http://res.hualala.com/group1/M00/00/EB/wKgCIVOwxnXigEuhACl2AH-ibdA620.exe",
                "QCodeImagePath": "",
                "actionTime": "20140630100806",
                "adaptOSRemark": "",
                "groupID": "5",
                "releaseDate": "20140612",
                "clientName": "商户系统版本更新",
                "action": "0",
                "versionNo": "V3.0(20140612)",
                "clientType": "410",
                "adaptScreenSizeLst": "all"
            }
        ],
        "totalSize": 1
    },
    "resultmsg": "",
    "resultcode": "000"
};
