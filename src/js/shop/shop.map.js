
;(function($) 
{
	var defaults = {
            data : {
                isSearchMap: false,
                keyword: '',
                shopName: '',
                tel: '',
                address: '',
                city: '',
                area: '',
                lng: '',
                lat: ''
            },
            searchBox: '.search-box',
            mapResult: '.map-result',
            //mapContainer: '#shopMap',
            mapCanvasId: 'mapCanvas',
            load: function() { },
            serach: function() { }
        };
	function ShopMap(options)
    {
        this.cfg = $.extend({}, defaults, options);
        //this.$shopMap = $(mapContainer);
        this.sContent = '';
        this.$searchBox = $(this.cfg.searchBox);
        this.$mapResult = $(this.cfg.mapResult);
        this.map = '';
        this.mapPoint = {};
        this.isAreaSearched = false;
    }
	ShopMap.prototype = 
    {
        init: function()
        {
            var self = this,
                markerTrick = false,
                mapParams = self.cfg.data;
            self.map = new BMap.Map(self.cfg.mapCanvasId);
            //添加默认缩放平移控件
            self.map.addControl(new BMap.NavigationControl());
            self.map.enableScrollWheelZoom();
            self.sContent = [
                '<dl class="map-shop-info">',
                    '<dt>' + mapParams.shopName + '</dt>',
                    '<dd>',
                        '<p><span>电话：</span>' + mapParams.tel + '</p>',
                        '<p><span>地址：</span>' + mapParams.address + '</p>',
                    '</dd>',
                '</dl>'
            ].join('');
            
            self[(mapParams.isSearchMap || !mapParams.lng || !mapParams.lat ? 'search' : 'load') + 'Map'](mapParams);
            
            if(self.$searchBox[0])
            {
                var $keyword = self.$searchBox.find('.map-keyword'),
                    $searchBtn = self.$searchBox.find('.map-search-btn'),
                    searchParams = $.extend({}, self.cfg.data);
                $searchBtn.on('click', function ()
                {
                    searchParams.keyword = $.trim($keyword.val());
                    self.searchMap(searchParams);
                });
            }
            
            
            return this;
        },
        loadMap: function(data)
        {
            var self = this;
            data = data || self.cfg.data;
            self.map.centerAndZoom(new BMap.Point(data.lng, data.lat), 14);
            self.map.enableScrollWheelZoom();

            var marker = new BMap.Marker(new BMap.Point(data.lng, data.lat), 
                {
                    enableMassClear: true,
                    raiseOnDrag: true
                });
            marker.enableDragging();
            self.map.addOverlay(marker);
            marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
           /* map.addEventListener("click", function(e){
                if(!(e.overlay)){
                    map.clearOverlays();
                    marker.show();
                    map.addOverlay(marker);
                    marker.setPosition(e.point);
                    setResult(e.point.lng, e.point.lat);
                }
            });*/
            marker.addEventListener("click", function(e)
            {
                 marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
            });
            marker.addEventListener("dragend", function(e)
            {
                self.setResult(e.point.lng, e.point.lat);
            });
            self.setResult(data.lng, data.lat);
        },
        searchMap : function (data)
        {
            var self = this;
            data = data || self.cfg.data;
            //self.map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
            //self.map.enableScrollWheelZoom();
                
            var local = new BMap.LocalSearch(self.map, {
                renderOptions: {map: self.map},
                pageCapacity: 1,
                onInfoHtmlSet : function (poi) {
                    poi.marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
                    //target.openInfoWindow(infoWindow);
                },
                onMarkersSet : function (poi) {
                    //console.info(poi.marker.infoWindow);
                }
            });
            
            local.search(data.keyword || data.address || data.area || data.city);
            
            local.setSearchCompleteCallback(function(results)
            {
                if(local.getStatus() !== BMAP_STATUS_SUCCESS)
                {
                    Hualala.UI.Alert({msg: '抱歉，百度地图未搜到您要查询的精确位置，现为您显示该位置所在的城市或区域，您可以通过移动地图上的标记来精确定位要查询的位置。'});
                    if(!self.isAreaSearched)
                    {
                        self.isAreaSearched = true;
                        local.search(data.area);
                    }
                    else
                    {
                        local.search(data.city);
                    }
                }
            });
            local.setMarkersSetCallback(function(pois)
            {
                for(var i = pois.length; i--;)
                {
                    var marker = pois[i].marker;
                    marker.enableDragging();
                    self.setResult(marker.point.lng, marker.point.lat);
                    //var mapParams = {
                    //  width : 250,     // 信息窗口宽度
                    //  height: 100,     // 信息窗口高度
                    //  title : "Hello"  // 信息窗口标题
                    //}
                    //var infoWindow = new BMap.InfoWindow("World", mapParams);  // 创建信息窗口对象
                    //map.openInfoWindow(infoWindow,point); //开启信息窗口
                    marker.openInfoWindow(new BMap.InfoWindow(self.sContent));
                    marker.addEventListener("click", function(e)
                    {
                       // markerTrick = true;
                        var pos = this.getPosition();
                        self.setResult(pos.lng, pos.lat);
                    });
                    marker.addEventListener("dragend", function(e)
                    {
                        self.setResult(e.point.lng, e.point.lat);
                    });
                }
            });
            
        },
         /*
         * setResult : 定义得到标注经纬度后的操作
         * 请修改此函数以满足您的需求
         * lng: 标注的经度
         * lat: 标注的纬度
         */
        setResult: function (lng, lat)
        {
            var self = this;
            self.mapPoint = { lng: lng, lat: lat };
            self.$mapResult[0] && self.$mapResult.html('您店铺的经度：' + lng + '    纬度： ' + lat);
        }
	}
    IX.ns("Hualala.Shop");
    Hualala.Shop.map = function(options) 
    { 
        return new ShopMap(options).init(); 
    };
}(jQuery));






