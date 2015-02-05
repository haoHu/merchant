(function()
{
    Test.wxContents = {"data":{"page":{"pageCount":1,"pageNo":1,"pageSize":50,"totalSize":3},"records":[{"action":"1","actionTime":"20150105150130","createTime":"20140624164336","groupID":"12","isActive":"1","itemID":"80","mpID":"heisongbailu2","py":"huan;ying;guan;zhu;hei;song;bai;lu;2;hygzhsbl2;","resContent":"{\"isMul\":\"0\",\"resources\":[{\"digest\":\"欢迎关注黑松白鹿2 (摘要)\",\"imgPath\":\"group1/M00/00/EA/wKgCH1OpOe6dHbkjAADE-dxnYls777.jpg\",\"resTitle\":\"欢迎关注黑松白鹿2\",\"resType\":\"3\",\"resTypeContent\":{\"resType\":\"3\",\"urlOrCity\":\"1010\"}}]}","resTitle":"欢迎关注黑松白鹿2","resType":"0"},{"action":"1","actionTime":"20140829100926","createTime":"20140619184104","groupID":"12","isActive":"1","itemID":"78","mpID":"heisongbailu_002","py":"bu;ding;bd;","resContent":"{\"isMul\":\"1\",\"resources\":[{\"imgPath\":\"group1/M00/00/E4/wKgCIVOivezR4NhGAAAwe5zS5oI223.jpg\",\"resTitle\":\"布丁\",\"resType\":\"1\",\"resTypeContent\":{\"resType\":\"1\",\"urlOrCity\":\"65\"}},{\"imgPath\":\"group1/M00/00/E4/wKgCH1OivhrsHt8dAABD656UOsM229.jpg\",\"resTitle\":\"我的会员卡\",\"resType\":\"8\",\"resTypeContent\":{\"resType\":\"8\"}}]}","resTitle":"布丁","resType":"1"},{"action":"0","actionTime":"20140714144441","createTime":"20140714144441","groupID":"12","isActive":"1","itemID":"89","mpID":"heisongbailu_002","py":"dai;jin;quan;jiao;yi;djqjy;","resContent":"{\"isMul\":\"0\",\"resources\":[{\"digest\":\"代金券交易\",\"imgPath\":\"group1/M00/00/F1/wKgCH1PDfB_Ikt8LAADP0dXqwz0696.png\",\"resTitle\":\"代金券交易\",\"resType\":\"17\",\"resTypeContent\":{\"resType\":\"17\",\"urlOrCity\":\"1010\"}}]}","resTitle":"代金券交易","resType":"0"}]},"resultcode":"000","resultmsg":""};
    
    var records = Test.wxContents.data.records,
        copy = JSON.stringify(records),
        page = Test.wxContents.data.page;
    for(var i = 0; i < 100; i++)
        records.push.apply(records, JSON.parse(copy));
    for(var i = 0, record; record = records[i++];)
        record.itemID = i + '';
        
    page.totalSize = records.length;
    page.pageCount = Math.ceil(page.totalSize / page.pageSize);
    
    /*records.length = 50;
    page.pageCount = 1;
    page.totalSize = records.length;*/
    
})();











