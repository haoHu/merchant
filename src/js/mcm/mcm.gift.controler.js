(function ($, window) {
	IX.ns("Hualala.MCM");
	var LoadingModal = Hualala.UI.LoadingModal;
	var HMCM = Hualala.MCM;
	var QueryResultControler = Stapes.subclass({
		/**
		 * 构造礼品搜索结果控制器
		 * @param  {Object} cfg 
		 *         @param {Object} view View层实例
		 *         @param {Object} model Model层实例
		 *         @param {jQuery Obj} container 容器
		 * @return {[type]}     [description]
		 */
		constructor : function (cfg) {
			this.set({
				sessionData : Hualala.getSessionData()
			});
			this.container = $XP(cfg, 'container', null);
			this.view = $XP(cfg, 'view', null);
			this.model = $XP(cfg, 'model', null);
			if (!this.view || !this.model || !this.container) {
				throw("Query Result init faild!");
			}
			this.isReady = false;
			this.bindEvent();
			this.bindModelEvent();
			this.bindViewEvent();
		}
	});

	QueryResultControler.proto({
		init : function (params) {
			this.model.init(params);
			this.view.init({
				model : this.model,
				container : this.container
			});
			this.loadingModal = new LoadingModal({
				start : 100
			});
			this.isReady = true;
		},
		hasReady : function () {return this.isReady;},
		bindEvent : function () {
			this.on({
				load : function (params) {
					var self = this;
					if (!self.hasReady()) {
						self.init(params);
					}
					// self.model.emit('load', $XP(params, 'params', {}));
					self.model.emit('load', params);
				}
			}, this);
			
			
		},
		bindModelEvent : function () {
			this.model.on({
				load : function (params) {
					var self = this;
					var cbFn = function () {
						self.view.emit('render');
						self.loadingModal.hide();
					};
					self.loadingModal.show();
					self.model.load(params, cbFn);
				}
			}, this);
		},
		bindViewEvent : function () {
			this.view.on({
				render : function () {
					var self = this;
					self.view.render();
				},
				deleteItem : function (params) {
					var self = this;
					var id = $XP(params, 'id'),
						key = $XP(params, 'key'),
						successFn = $XF(params, 'successFn'),
						faildFn = $XF(params, 'faildFn');
					var itemModel = self.model.getRecordModelByID(id);
					itemModel.emit('deleteItem', {
						itemID : key,
						successFn : function (res) {
							successFn(res);
						},
						faildFn : function (res) {
							faildFn(res);
						}
					});
				},
				switchEvent : function (params) {
					var self = this;
					var post = _.pick(params, 'eventID', 'isActive');
					var key = $XP(params, 'key');
					var itemModel = self.model.getRecordModelByID(key);
					itemModel.emit('switchEvent', {
						post : post,
						successFn : $XF(params, 'successFn'),
						faildFn : $XF(params, 'faildFn')
					});
				}
			}, this);
		}

	});

	HMCM.QueryResultControler = QueryResultControler;
})(jQuery, window);