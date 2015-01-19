(function ($, window) {
	IX.ns("Hualala.Weixin");
    
    Hualala.Weixin.getEmotions = getEmotions;
    Hualala.Weixin.getLinkTypes = getLinkTypes;
    
    function getEmotions()
    {
        return [
            { url : "CD/wKgCIVNWKH6hmHQGAAAHEjWPAZs514.gif", title : "微笑"},
            { url : "CD/wKgCH1NWKH6XWC2eAAAGLnAf7-c591.gif", title : "撇嘴"},
            { url : "CD/wKgCH1NWKH6MDGgnAAAHDLr8VAc015.gif", title : "色"},
            { url : "CD/wKgCIVNWKH6n-9spAAAHPEQTyEQ985.gif", title : "发呆"},
            { url : "CD/wKgCIVNWKH77iHinAAAHuTE4C2A482.gif", title : "得意"},
            { url : "CD/wKgCH1NWKH7Zf7edAAAHSgtCCG8416.gif", title : "流泪"},
            { url : "CD/wKgCH1NWKH6xyGFAAAAN5AitwJQ082.gif", title : "害羞"},
            { url : "CD/wKgCIVNWKH6YRAi2AAAPWXBFl_s040.gif", title : "闭嘴"},
            { url : "CD/wKgCIVNWKH7U4BSWAAASR42ZkF8934.gif", title : "睡"},
            { url : "CD/wKgCH1NWKH6fU-ScAAAM4kuzwSw947.gif", title : "大哭"},
            { url : "CD/wKgCH1NWKH6kRnZ4AAAOhNr-C2A640.gif", title : "尴尬"},
            { url : "CD/wKgCIVNWKH-5Hxl0AAAfYSRbMUk617.gif", title : "发怒"},
            { url : "CD/wKgCIVNWKH-Cy2QiAAAIxwh7gJ8587.gif", title : "调皮"},
            { url : "CD/wKgCH1NWKH_DZSQYAAAGyAJA_uI043.gif", title : "呲牙"},
            { url : "CD/wKgCH1NWKH--YrfCAAAPpiODsBY933.gif", title : "惊讶"},
            { url : "CD/wKgCIVNWKH_RQooVAAAGGnFweWw274.gif", title : "难过"},
            { url : "CD/wKgCIVNWKH_PlZg3AAAFhd405eU255.gif", title : "酷"},
            { url : "CD/wKgCH1NWKH-rvyFaAAANJobRVnA139.gif", title : "冷汗"},
            { url : "CD/wKgCH1NWKH_zy_40AAAfyfLjzW0528.gif", title : "抓狂"},
            { url : "CD/wKgCIVNWKIDmLODOAAAfx7thOIU847.gif", title : "吐"},
            { url : "CD/wKgCIVNWKID4WKyxAAAHEBEwsog704.gif", title : "偷笑"},
            { url : "CD/wKgCH1NWKICsFM_3AAAHSNA129k556.gif", title : "可爱"},
            { url : "CD/wKgCH1NWKIDtm2xhAAALwnkTd8E528.gif", title : "白眼"},
            { url : "CD/wKgCIVNWKIChwcKbAAAHntrRtOU292.gif", title : "傲慢"},
            { url : "CD/wKgCIVNWKIDoIMNzAAAI0YNpmX8518.gif", title : "饥饿"},
            { url : "CD/wKgCH1NWKICzMaRiAAAJjqlzh0s106.gif", title : "困"},
            { url : "CD/wKgCH1NWKIClntTjAAAPrv0u1iE580.gif", title : "惊恐"},
            { url : "CD/wKgCIVNWKIDTeBDAAAALTUiZH1E231.gif", title : "流汗"},
            { url : "CD/wKgCIVNWKICY8xuSAAAMvksAY_c342.gif", title : "憨笑"},
            { url : "CD/wKgCH1NWKIGa3CXNAAAW5RugBIc941.gif", title : "大兵"},
            { url : "CD/wKgCH1NWKIHTKKpZAAAG9OMVt48363.gif", title : "奋斗"},
            { url : "CD/wKgCIVNWKIGw3p30AAAUNliA67o282.gif", title : "咒骂"},
            { url : "CD/wKgCIVNWKIHS-AKHAAAcFXdc82Q472.gif", title : "疑问"},
            { url : "CD/wKgCH1NWKIG5_BNwAAAQ3fqvFkA245.gif", title : "嘘"},
            { url : "CD/wKgCH1NWKIGigs9mAAAIXKFk83E124.gif", title : "晕"},
            { url : "CD/wKgCIVNWKIGptYlqAAA0UDIQLFg977.gif", title : "折磨"},
            { url : "CD/wKgCIVNWKIGYPIIjAAAFiWXFty8768.gif", title : "衰"},
            { url : "CD/wKgCH1NWKIGtyC8hAAAEq48_kyg648.gif", title : "骷髅"},
            { url : "CD/wKgCH1NWKIGOfYHZAAAGisisHhw165.gif", title : "敲打"},
            { url : "CD/wKgCIVNWKIKjx8PKAAAHBpwa4CY851.gif", title : "再见"},
            { url : "CD/wKgCIVNWKIL_MnpUAAAnbBIu5y0245.gif", title : "擦汗"},
            { url : "CD/wKgCH1NWKILZEx53AAANKIT20WQ983.gif", title : "抠鼻"},
            { url : "CD/wKgCH1NWKIKV60t7AAA0N2DE7bc169.gif", title : "鼓掌"},
            { url : "CD/wKgCIVNWKIL59hU5AAAQ54o41Kk036.gif", title : "糗大了"},
            { url : "CD/wKgCIVNWKILEbQCZAAAGI_0O4X8576.gif", title : "坏笑"},
            { url : "CD/wKgCH1NWKIL4kuL3AAASVA6Ifk4545.gif", title : "左哼哼"},
            { url : "CD/wKgCH1NWKILHWREjAAAUKj4EcvQ524.gif", title : "右哼哼"},
            { url : "CD/wKgCIVNWKILQMPcYAAAOZSkc7Jw649.gif", title : "哈欠"},
            { url : "CD/wKgCIVNWKIPuGPqAAAAG25fNuM8445.gif", title : "鄙视"},
            { url : "CD/wKgCH1NWKIKMa-JLAAAY2TnURuo416.gif", title : "委屈"},
            { url : "CD/wKgCH1NWKIPMPmP1AAAMAaVr23I453.gif", title : "快哭了"},
            { url : "CD/wKgCIVNWKIOOgnj1AAAOkx4Bh_Q822.gif", title : "阴险"},
            { url : "CD/wKgCIVNWKIOeUKLLAAAF_GTXs6Q904.gif", title : "亲亲"},
            { url : "CD/wKgCH1NWKIO1xGMuAAAICHoJBFw359.gif", title : "吓"},
            { url : "CD/wKgCH1NWKIPN2fzNAAAJOoITboY253.gif", title : "可怜"},
            { url : "CD/wKgCIVNWKIO0xK32AAAGLs6b_Ro551.gif", title : "菜刀"},
            { url : "CD/wKgCIVNWKIPqGwCbAAAEkqSp4Sw833.gif", title : "西瓜"},
            { url : "CD/wKgCH1NWKIObPGkbAAAT0DNHWAo512.gif", title : "啤酒"},
            { url : "CD/wKgCH1NWKIPa_VUOAAAKJHslunM338.gif", title : "篮球"},
            { url : "CD/wKgCIVNWKIPZZ5N8AAAF_WKxMqw106.gif", title : "乒乓"},
            { url : "CD/wKgCIVNWKISwryuSAAAKa9RcamE946.gif", title : "咖啡"},
            { url : "CD/wKgCH1NWKISyfwdlAAAEcPmAmvc991.gif", title : "饭"},
            { url : "CD/wKgCH1NWKISLlrJrAAAE9SamlGU206.gif", title : "猪头"},
            { url : "CD/wKgCIVNWKISAOssoAAADy2tCJ7o039.gif", title : "玫瑰"},
            { url : "CD/wKgCIVNWKISr6e_dAAAD3L7K5vE917.gif", title : "凋谢"},
            { url : "CD/wKgCH1NWKIT4_u6FAAAUpYIuysE035.gif", title : "示爱"},
            { url : "CD/wKgCH1NWKITgj9d5AAAEh2XzeLs214.gif", title : "爱心"},
            { url : "CD/wKgCIVNWKITxvLsxAAAKujCDjJU510.gif", title : "心碎"},
            { url : "CD/wKgCIVNWKITkdjGzAAAQNAagCHU699.gif", title : "蛋糕"},
            { url : "CD/wKgCH1NWKISIFHmqAAAD91kg-JE423.gif", title : "闪电"},
            { url : "CD/wKgCH1NWKITiVZFvAAAEiniNOl4497.gif", title : "炸弹"},
            { url : "CD/wKgCIVNWKITI_Kz4AAADOMg7F1U036.gif", title : "刀"},
            { url : "CD/wKgCIVNWKIX0UCPGAAAOXyFMKrE161.gif", title : "足球"},
            { url : "CD/wKgCH1NWKITMNY5JAAAIk5fThiw184.gif", title : "瓢虫"},
            { url : "CD/wKgCH1NWKIWI9sApAAAJllKthhY471.gif", title : "便便"},
            { url : "CD/wKgCIVNWKIX4NcPwAAAExrdFHOM457.gif", title : "月亮"},
            { url : "CD/wKgCIVNWKIXj--DBAAAEu_hcC4k274.gif", title : "太阳"},
            { url : "CD/wKgCH1NWKIXq0Gx-AAAEfxCtQPg896.gif", title : "礼物"},
            { url : "CD/wKgCH1NWKIXgdKPvAAAGHeYffaA847.gif", title : "拥抱"},
            { url : "CD/wKgCIVNWKIWyKM5FAAAF7ovU57E277.gif", title : "强"},
            { url : "CD/wKgCIVNWKIWPKrOXAAAGATpp04Q875.gif", title : "弱"},
            { url : "CD/wKgCH1NWKIW7CKJJAAAGN4PjHgk736.gif", title : "握手"},
            { url : "CE/wKgCH1NWKIWII8xPAAAGC-ylE0I030.gif", title : "胜利"},
            { url : "CD/wKgCIVNWKIX9Fcn-AAAGN720qlg404.gif", title : "抱拳"},
            { url : "CD/wKgCIVNWKIWhnWQNAAANYEzopPo145.gif", title : "勾引"},
            { url : "CE/wKgCH1NWKIWRtwPHAAAGLccwr7c365.gif", title : "拳头"},
            { url : "CE/wKgCH1NWKIWyVvLpAAAF73AN-Og539.gif", title : "差劲"},
            { url : "CD/wKgCIVNWKIblO0ySAAAGFsLpii0260.gif", title : "爱你"},
            { url : "CD/wKgCIVNWKIb3ntxnAAAIVqQUcy4531.gif", title : "NO"},
            { url : "CE/wKgCH1NWKIac15IHAAAEw64jKVA529.gif", title : "OK"},
            { url : "CE/wKgCH1NWKIbSXxzGAAAKtzujC9w203.gif", title : "爱情"},
            { url : "CD/wKgCIVNWKIbgjhDrAAACjgWZXP4623.gif", title : "飞吻"},
            { url : "CD/wKgCIVNWKIb9abFsAAAFYZ2yllA765.gif", title : "跳跳"},
            { url : "CE/wKgCH1NWKIaHBEHzAAAEX99eGAg355.gif", title : "发抖"},
            { url : "CE/wKgCH1NWKIepcK-tAAANYvdRETc255.gif", title : "怄火"},
            { url : "CE/wKgCIVNWKIfwhBJGAAALwyRDuF8811.gif", title : "转圈"},
            { url : "CE/wKgCIVNWKIfJFeNwAAAHBGnVicw191.gif", title : "磕头"},
            { url : "CE/wKgCH1NWKIfoDJwQAAAUtOcKYmU453.gif", title : "回头"},
            { url : "CE/wKgCH1NWKIe5FEqLAAAGXUlhmqw064.gif", title : "跳绳"},
            { url : "CE/wKgCIVNWKIeb6F2UAAAI1QqtQ7Y764.gif", title : "挥手"},
            { url : "CE/wKgCIVNWKIe8INuBAAAG9HJo2zM848.gif", title : "激动"},
            { url : "CE/wKgCH1NWKIfndJHDAAAJi-oVE34806.gif", title : "街舞"},
            { url : "CE/wKgCH1NWKIedbP9SAAAFps_xS8w196.gif", title : "献吻"},
            { url : "CE/wKgCIVNWKIizikDBAAAIdrn1ytM011.gif", title : "左太极"},
            { url : "CE/wKgCIVNWKIjSNEstAAAIeX2ucII889.gif", title : "右太极"}
        ];
    }
    
    function getLinkTypes()
    {
        return [
            { value: "1", title: "软文", type: 'select', subTitle: '软文', api: 'getAdvertorials', params: {}, keys: ['itemID', 'title'] },
            { value: "2", title: "集团首页" },
            { value: "3", title: "店铺预定搜索网页", type: 'select', subTitle: '城市', api: 'getCities', params: { isActive: 1 }, keys: ['cityID', 'cityName'], firstItem: {cityID: 0, cityName: '附近' } },
            { value: "4", title: "订座点菜具体店铺", type: 'select', subTitle: '店铺', api: 'queryShop', params: {}, keys: ['shopID', 'shopName']},
            { value: "5", title: "店铺外卖搜索网页" , type: 'select', subTitle: '城市', api: 'getCities', params: { isActive: 1 }, keys: ['cityID', 'cityName'], firstItem: {cityID: 0, cityName: '附近' }},
            { value: "6", title: "外卖自提具体店铺", type: 'select', subTitle: '店铺', api: 'queryShop', params: {}, keys: ['shopID', 'shopName'] },
            { value: "7", title: "附近店铺" },
            { value: "8", title: "(新)成为会员" },
            { value: "9", title: "(新)我的会员卡" },
            { value: "10", title: "成为会员" },
            { value: "11", title: "我的会员卡" },
            { value: "12", title: "我的代金券" },
            { value: "13", title: "我的订单页" },
            { value: "14", title: "我的账户" },
            { value: "15", title: "会员活动列表" },
            { value: "16", title: "会员具体活动", type: 'select', subTitle: '会员活动', api: 'getCrmEvents', params: {}, keys: ['eventIdWay', 'eventName'] },
            { value: "17", title: "用户活动", type: 'select', subTitle: '用户活动', api: 'getUserEvents', params: { eventStatus: 1 }, keys: ['eventItemID', 'eventSubjects'] },
            { value: "18", title: "用户反馈" },
            { value: "19", title: "代金券交易", type: 'select', subTitle: '城市', api: 'getCities', params: { isActive: 1 }, keys: ['cityID', 'cityName'], firstItem: {cityID: 0, cityName: '附近' } },
            { value: "20", title: "排队取号搜索" },
            { value: "21", title: "报名活动", type: 'select', subTitle: '用户活动', api: 'getUserEvents', params: { eventStatus: 1, gameWay: 20 }, keys: ['eventItemID', 'eventSubjects'] },
            { value: "22", title: "自定义链接", type: 'input', subTitle: '内容' }
        ];
    }
    
})(jQuery, window);










