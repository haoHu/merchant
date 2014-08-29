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
	/**
	 * 根据图片服务器上的原始资源图片,按照配置信息，返回缩放、剪裁、水印等效果的图片链接
	 * 图片地址：
	 * [protocol] [domain] [path] [fileName] [extension]
	 * [http://] [res.hualala.com] [/group1/M00/1E/3B/][wKgBZE5Izt6pUY8WAAD2HTq6pjo419][.jpg]
	 * @param {String} path 图片资源的路径(必须)
	 * @param {Object} cfg 对于图片的配置信息
	 *         cfg : {
	 *         		//控制是否加水印
	 *         		watermark : true|false 	(是否需要打水印,默认为false)
	 *         		//控制缩放规则
	 *         		scale : 	'percent'(百分比缩放) | 
	 *         				'lockMin'(锁定比例按照最小值缩放)(默认) | 'lockMax'(锁定比例按照最大值缩放) | 'unlock'(取消锁定比例) |
	 *         				'lockMinZoomOut'(锁定比例，按照固定尺寸取小值缩小*只允许缩小*) | 
	 *         				'lockMinZoomIn'(锁定比例，按照固定尺寸取小值放大*只允许放大*) |
	 *         				'lockMaxZoomOut'(锁定比例，按照固定尺寸取大值缩小*只允许缩小*) |
	 *         				'lockMaxZoomIn'(锁定比例，按照固定尺寸取大值放大*只允许放大*) | 
	 *         				'unlockZoomOut'(取消锁定比例，按照固定尺寸缩小*只允许缩小*) | 
	 *         				'unlockZoomIn'(取消锁定比例，按照固定尺寸放大*只允许放大*) 
	 *         		width : 300,
	 *         		height : 200,
	 *         		//控制截取规则 
	 *         		//NOTE：一旦cut不为空，缩放规则自动取消
	 *         		cut : 	null(不截取) | 'normal'(正常截取图片) | 'max'(最大化截取图片矩形区域)
	 *         		offsetX : 0,
	 *         		offsetY : 0,
	 *         		//控制图片旋转
	 *         		rotate :  degree(顺时针0~360) | null
	 *         		//控制图片的质量
	 *         		quality : (图片质量百分数1-100) | null
	 *         }
	 * @return {String} 返回图片地址
	 */
	Hualala.Common.getSourceImage = function (path, cfg) {
		var settings = IX.inherit({
			watermark : false,
			scale : 'lockMin',
			width : null,
			height : null,
			cut : null,
			offsetX : null,
			offsetY : null,
			rotate : null,
			quality : null
		}, cfg);
		var imgDomain = !$XP(settings, 'watermark', false) ? 
			Hualala.Global.IMAGE_RESOURCE_DOMAIN : Hualala.Global.IMAGE_RESOURCE_WATERMARK_DOMAIN;
		if (!path || IX.isObject(path)) return '';
		var lastSlash = path.lastIndexOf('/');
			fileName = path.slice(lastSlash + 1),
			suffix = '',
			path = path.slice(0, lastSlash);
		suffix = fileName.replace(/^(.*)\.(jpg|jpeg|png|gif|ico)/i, '$2').toLowerCase();
		fileName = fileName.replace(/^(.*)\.(jpg|jpeg|png|gif|ico)/i, '$1');

		var w = $XP(settings, 'width', null), h = $XP(settings, 'height', null),
			x = $XP(settings, 'offsetX', null), y = $XP(settings, 'offsetY', null);

		var scale = $XP(settings, 'scale'), scaleE = '';
		var cut = $XP(settings, 'cut', null), cutE = '';
		var rotate = $XP(settings, 'rotate', null), quality = $XP(settings, 'quality', null),
			paramE = [];
		var scaleRule = {
			// 协议类型< width- >x< height- >
			'percent' : '-',
			// 协议类型< width >x< height >
			'lockMin' : '',
			// 协议类型< width >x< height>_ 例如：300x200_
			'lockMax' : '_',
			// 协议类型 < width >x< height>! 例如：300x200!
			'unlock' : '!',
			// 协议类型 < width >x< height>) 例如：600x200)
			'lockMinZoomOut' : ')',
			// 协议类型 < width >x< height>( 例如：600x200(
			'lockMinZoomIn' : '(',
			// 协议类型 < width >x< height>)_ 例如：600x200)_
			'lockMaxZoomOut' : ')_',
			// 协议类型 < width >x< height>(_ 例如：600x200(_
			'lockMaxZoomIn' : '(_',
			// 协议类型 < width >x< height>)! 例如：600x200)!
			'unlockZoomOut' : ')!',
			// 协议类型 < width >x< height>(! 例如：600x200(!
			'unlockZoomIn' : '(!',
		};
		var cutRule = {
			// 协议类型 c< width >x< height>+< offset_x>+< offset_y>
			'normal' : 'c',
			'max' : 'C'
		};
		// 获取scale表达式
		if (IX.isEmpty(w) && IX.isEmpty(h)) {
			scaleE = '';
		} else if (IX.isEmpty(w) || IX.isEmpty(h)) {
			scaleE = scale == 'percent' ? 
				('=' + (IX.isEmpty(w) ? h : w) + scaleRule[scale]) : '';
		} else {
			scaleE = '=' + w + (scale == 'percent' ? scaleRule[scale] : '') + 'x' + h + scaleRule[scale];
		}

		// 获取截取参数
		// NOTE:一旦截取图片功能开启，缩放功能无效
		if (!IX.isEmpty(cut)) {
			scaleE = '';
			if (IX.isEmpty(w) || IX.isEmpty(h)) {
				cutE = '';
			} else {
				cutE = cutRule[cut] + w + 'x' + h + '+' + (x || 0) + '+' + (y || 0);
			}
		} else {
			cutE = '';
		}

		// 获取旋转图片参数
		if (!IX.isEmpty(rotate) && rotate > 0) {
			paramE.push('rotate=' + rotate);
		}
		// 获取图片的质量参数
		if (!IX.isEmpty(quality) &&  quality > 0) {
			paramE.push('quality=' + quality);
		}
		paramE = paramE.join('&');
		var ret = imgDomain + '/' 
			+ path + '/' 
			+ fileName + scaleE + cutE + '.' + suffix 
			+ (paramE.length > 0 ? ('?' + paramE) : '');
		return ret;
	};
})(jQuery);


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

	/**
	 * 获取事件间隔选项数据
	 * @param  {Object} cfg {startLabel, start, end}
	 *          cfg : {
	 *          	startLabel : value为0的选项的label，
	 *          	start : 开始获取的分钟，
	 *          	end : 结束的分钟
	 *          }
	 * @return {[type]}     [description]
	 */
	Hualala.Common.getMinuteIntervalOptions = function (cfg) {
		var startLabel = $XP(cfg, 'startLabel', '不限'),
			start = $XP(cfg, 'start', 0),
			end = $XP(cfg, 'end', (Hualala.Constants.SecondsOfDay / 60));
		
	};
    /**
	 * 将表单里内容转换为 plainObject
	 * @param  {DOM | jQuery Objuect | selector string} form
	 * @return {Object | null}    { formFiledName1: value1, formFiledName2: value2, ... }
	 */
    Hualala.Common.parseForm = function (form) {
		var $form = $(form);
        if(!$form[0]) return null;
        
        var fields = $form.serializeArray();
        if(!fields.length) return null;
        
        var result = {};
        $.each(fields, function (i, o) { result[o.name] = o.value; });
        
        return result;
		
	};

	/**
	 * 号码遮罩
	 * @param  {String} code  需要进行遮罩的字符串
	 * @param  {Int} start 开始遮盖的字符串位置
	 * @param  {Int} end   遮盖结束位置
	 * @return {Object}		返回遮盖操作后的字符串和原始字符串{orig, val}       
	 */
	Hualala.Common.codeMask = function (code, start, end) {
		code = !code ? '' : code.toString();
		var len = code.length,
			str = '';
		start = IX.isEmpty(start) ? 0 : parseInt(start);
		end = IX.isEmpty(end) ? len : parseInt(end);
		str = code.slice(0, start) + code.slice(start, end).replace(/[\w]/g, '*') + code.slice(end);
		return {
			orig : code,
			val : str
		};
	};

	/**
	 * 根据银行代码获取银行基本信息
	 * @param  {String} bankCode 银行代码
	 * @return {Object}          银行信息{code, name, icon_16, icon_32, icon_48, icon_64}
	 */
	Hualala.Common.mapBankInfo = function (bankCode) {
		var banks = Hualala.TypeDef.BankOptions,
			bankHT = new IX.IListManager(),
			iconSizes = [16, 32, 48, 64];
		_.each(banks, function (el) {
			var c = $XP(el, 'value'),
				n = $XP(el, 'label');
			var icons = {};
			_.each(iconSizes, function (el) {
				icons['icon_' + el] = 'icon-' + c + '-' + el;
			});
			bankHT.register(c, IX.inherit({
				code : c,
				name : n
			}, icons));
		});
		return bankHT.get(bankCode);
	};

})(jQuery);






















































