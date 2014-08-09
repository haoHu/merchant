// Route Engine
(function () {
	var RouteAttrDefValue = {name :"", url : "", urlType : "site", type : "GET"};
	function urlItemFn(columns, urlDef){
		return IX.loop(columns, {}, function(acc, name, idx){
			var _value = urlDef.length>idx?urlDef[idx]:null;
			if (IX.isEmpty(_value))
				_value = RouteAttrDefValue[name];
			acc[name] = _value;
			return acc;
		});
	}
	// columns : ["name", "url", "urlType"] , // or  ["name", "url", "urlType", "type"]
	function UrlStore(columns){
		var _routes = new IX.IListManager();
		var _urlItemFn = function(urlDef){
			var routeName = urlDef[0];
			if (!IX.isEmpty(routeName))
				_routes.register(routeName, urlItemFn(columns, urlDef));
		};
		return {
			map : function(urlList){IX.iterate(urlList, _urlItemFn);},
			getAll : _routes.getAll,
			get :  _routes.get
		};
	}

	var urlEngine = IX.urlEngine, ajaxEngine = IX.ajaxEngine;
	var urlStore = new UrlStore(["name", "url", "urlType"]),
		ajaxStore = new UrlStore(["name", "url", "urlType", "type"]);
	var urlGenerator = null; //function(name, params){return "";};
	function _urlGenerator(name, params){
		return  IX.isFn(urlGenerator)?urlGenerator(name, params):"";
	}

	/** routeDef : "routeName" or  {
	 * 		name:  "routeName",
	 * 		channel: "",
	 * 		url : function(params){},
	 * 		preAjax : function(name, params){return paramsl;}, // default null;
	 * 		postAjax : function(name, params, cbFn){}, //default null;
	 * 		onsuccess : function(data,cbFn, params), 
	 * 		onfail : function(data, failFn, params) // default null;
	 *  }
	 */
	function createEntries(routes, isCaller){
		return ajaxEngine[isCaller?"createCaller": "createRouter"](IX.map(routes, function(routeDef){
			var isRef = IX.isString(routeDef);
			return IX.inherit(ajaxStore.get(isRef?routeDef:routeDef.name), isRef?{}:routeDef);
		}));
	}
	function initEngine (cfg){
		urlEngine.init(cfg);
		ajaxEngine.init(cfg);
	}

	IX.ns("Hualala");

	Hualala.urlEngine = {
		init : initEngine,
		reset :initEngine,
		/**  urlList : [ [name, url, urlType], ...]  */
		mappingUrls : function(urlList){
			urlStore.map(urlList);
			urlGenerator = urlEngine.createRouter(urlStore.getAll());
		},
		genUrls : function(names){return IX.map(names, _urlGenerator);},
		genUrl : function(name, params){return _urlGenerator(name, params);}
	};
	Hualala.ajaxEngine = {
		init : initEngine,
		reset :initEngine,
		/**  urlList : [ [name, url, urlType, type], ...]  */
		mappingUrls : ajaxStore.map, //function(urlList)
		
		createCaller :  function(routes){return createEntries(routes, true);},
		createRoute : createEntries
	};
})();


// CommonFn
(function ($) {
	IX.ns("Hualala.Common");
	// Image Oprater
	var CacheTypes = {
		logo : "logo",
		photo : "user",
		docThumb : "thumb"
	};
	Hualala.Common.loadImageErr = function (imgEl, type) {
		if (!imgEl || !imgEl.parentNode)
			return ;
	};
	var defaultPhotoImg = null;
	Hualala.Common.avatarFn = function (src, type, clz) {
		if (IX.isEmpty(src)) {
			if (!defaultPhotoImg) {
				defaultPhotoImg = Hualala.Global.getDefaultImage("photo");
			}
			src = defaultPhotoImg;
		}
		return '<img src="' + src + '" class="' + (clz || "avatar-32") +
			'" onerror="Hualala.Common.loadImageErr(this, ' + "'" + (type || "photo") + "'" + ');"/>';
	};

	// Date
	Hualala.Date = IX.Util.Date;

	/**
	 * 设置垂直居中位置
	 * offset : {top : [int], left : [int]}
	 */
	Hualala.Common.setCenter = function (el, parentEl, offset) {
		!parentEl && (parentEl = document.documentElement || document.body);
		!offset && (offset = {});
		el.style.top = (((parentEl.clientHeight - el.clientHeight) / 2) + (offset.top || 0)) + 'px';
		el.style.left = (((parentEl.clientWidth - el.clientWidth) / 2) + (offset.left || 0)) + 'px';
	};

	/**
	 * 获取字符串的字节长度
	 * str : [String]
	 */
	Hualala.Common.strByteLength = function (str) {
		var i, sum = 0;
		for (i = 0; i < str.length; i++) {
			var charCode = str.charCodeAt(i);
			if ((charCode >= 0) & (charCode <= 255)) {
				sum += 1;
			} else {
				sum += 2;
			}
		}
		return sum;
	};

	/**
	 * 按字节数截取字符串
	 * str : [String], n : [int]
	 */
	Hualala.Common.substrByte = function (str, n) {
		var s2 = str.slice(0, n),
			i = s2.replace(/[^\x00-\xff]/g, "**").length;
		if (i <= n) return s2;
		i -= s2.length;
		switch (i) {
			case 0 : return s2;
			case n : return str.slice(0, n >> 1);
			default :
				var k = n - i,
					s3 = str.slice(k, n),
					j = s3.replace(/[\x00-\xff]/g, "").length;
				return j ? str.slice(0, k) + Hualala.Common.substrByte(s3, j) : str.slice(0, k);
		}
	};

	/**
	 * 获取浏览器品牌及版本号信息
	 * @return {Object} {browserName:version}
	 */
	Hualala.Common.Browser = (function () {
		var browser = {},
			ua = navigator.userAgent.toLowerCase(),
			match = null;
		(match = ua.match(/rv:([\d.]+)\) like gecko/)) ? browser['ie'] = match[1] :
		(match = ua.match(/msie ([\d.]+)/)) ? browser['ie'] = match[1] :
		(match = ua.match(/chrome\/([\d.]+)/)) ? browser['chrome'] = match[1] : 
		(match = ua.match(/firefox\/([\d.]+)/)) ? browser['firefox'] = match[1] :
		(match = ua.match(/opera.([\d.]+)/)) ? browser['opera'] = match[1] : 
		(match = ua.match(/version\/([\d.]+).*safari/)) ? browser['safari'] = match[1] : 0;
		return browser;
	})();


})(jQuery);






















































