(function ($, window) {
	/**
	 * 实现前端Javascript的Router功能
	 * 使用一个单体Router进行实现。所以不适用于需要多个router的项目
	 * 优点：不需要在对象与对象之间传递router，也不用担心如何创建router
	 * 功能：
	 * 		1.支持散列输入的URL, 例如http://site.com#shop/list
	 * 		2.能够支持History API，但是要向后兼容，如果不支持History API的老版浏览器，我们需要使用location进行兼容
	 * 		3.提供简单可用的接口
	 * 		4.不会自动运行
	 * 		5.自动监听地址变化
	 * 		6.采用单体模式
	 * @type {Object}
	 */
	var Router = {
		// 用于保存当前已经注册的路由
		routes : [],
		// 使用模式，包含（hash|history）两个选项，用来判断router实现是否使用History API
		mode : null,
		// 应用的根路径。只有当使用pushState时，才有用处
		root : '',
		/**
		 * 配置：用于启动router
		 * @param  {Object} options {mode, root}
		 * @return {Router}         单体自身，用于链式调用
		 */
		config : function (options) {
			// 设定模式，只有支持pushState方法的，才可以使用History API，否则一律使用hash模式
			this.mode = $XP(options, 'mode', 'history') == 'history' && !!(history.pushState) ? 'history' : 'hash';
			// hash模式下，root才有使用，利用clearSlashes，删除掉options.root传入的URL的‘/’
			this.root = options && options.root ? ('/' + this.clearSlashes(options.root) + '/') : '/';
		},
		/**
		 * 获取当前URL，我们有两种模式，使用History API与location hash，所以要使用分支判断
		 * @return {[String]} 返回当前URL
		 */
		getFragment : function () {
			var fragment = '';
			if (this.mode == 'history') {
				fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
				// history模式下，需要删除所有get参数
				fragment = fragment.replace(/\?(.*)$/, '');
				// add hash part by huhao
				fragment = fragment + location.hash;

				// history模式下，需要将root部分删除
				fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
			} else {
				var match = window.location.href.match(/#(.*)$/);
				fragment = match ? match[1] : '';
			}
			return this.clearSlashes(fragment);
		},
		clearSlashes : function (path) {
			return path.toString().replace(/\/$/, '').replace(/^\//, '');
		},
		/**
		 * 添加路由
		 * 如果只传递一个方法，我们把它当做一个默认路由处理器,并把路由当做一个空字符串
		 * @param {String} re      路由匹配的规则（可以是实际的路由，也可以是正则字串）
		 * @param {Function} handler 路由的处理器
		 * @return {Router} 单体自身，用于链式调用
		 */
		add : function (re, handler) {
			if (IX.isFn(re)) {
				handler = re;
				re = '';
			}
			this.routes.push({re : re, handler : handler});
			return this;
		},
		/**
		 * 删除路由
		 * 传递一个合法的正则表达式或者handler处理器就可以删除路由
		 * @param  {regular|function} param 正则表达式|处理方法
		 * @return {Router}       单体自身，用于链式调用
		 */
		remove : function (param) {
			for (var i = 0, r, l = this.routes.length; i < l, r = this.routes[i]; i++) {
				if (r.handler === param || r.re === param) {
					this.routes.splice(i, 1);
					return this;
				}
			}
			return this;
		},
		/**
		 * 重置Router
		 * @return {Router} 
		 */
		flush : function () {
			this.routes = [];
			this.mode = null;
			this.root = '/';
			return this;
		},
		/**
		 * 比对注册的路由
		 * 可以使用传入的路由，也可以使用getFragment方法获取当前的路由，
		 * 然后循环查找进行匹配
		 * @param  {String} f 传入的路由
		 * @return {Router}       单体自身，用于链式调用
		 */
		check : function (f) {
			var fragment = f || this.getFragment();
			for (var i = 0, l = this.routes.length; i < l; i++) {
				var match = fragment.match(this.routes[i].re);
				if (match) {
					match.shift();
					this.routes[i].handler.apply({}, match);
					return this;
				}
			}
			return this;
		},
		/**
		 * 监控变化
		 * 我们不需要手动的不停运行check方法，我们需要一个地址栏发生变化时，通知我们的逻辑。
		 * 这种变化包括触发浏览器的返回、前进按钮。
		 * History API中的popstate事件，他是URL发生变化时执行的回调。但是一些浏览器在页面加载的时候不会触发这个事件。
		 * 同时，在mode被设定为hash的时候，我们也要执行监控，所以可以采用setInterval来轮询监控状态
		 * @return {Router}       单体自身，用于链式调用
		 */
		listen : function () {
			var self = this;
			// 我们需要保存一个当前的URL用于比较
			var current = self.getFragment();
			var fn = function () {
				if (current !== self.getFragment()) {
					current = self.getFragment();
					self.check(current);
				}
			};
			clearInterval(this.interval);
			this.interval = setInterval(fn, 50);
			return this;
		},
		/**
		 * 改变路由（URL）
		 * @param  {String} path 路由路径
		 * @return {Router}       单体自身，用于链式调用
		 */
		navigate : function (path) {
			path = path || '';
			if (this.mode == 'history') {
				// history.pushState(null, null, this.root + this.clearSlashes(path));
				history.pushState(null, null, this.root + "#" + this.clearSlashes(path));
			} else {
				window.location.href.match(/#(.*)$/);
				window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
			}
			return this;
		}
	};
	IX.ns('Hualala');
	Hualala.Router = Router;
})(jQuery, window);