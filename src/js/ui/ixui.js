(function ($, window) {
	IX.ns("Hualala.UI");

	/**
	 * show popover tip for target element
	 * @param  {[Object]} cfg [description]
	 *         trigger : 'click|hover|focus|manual'
	 *         targetEl : popover tip apply on this $tar
	 *         msg : tip content
	 *         type : tip message type
	 *         placement : string|function 
	 *         container : selector
	 *         afterShow : function 
	 *         afterHide : function 
	 * @return {[null]}     [description]
	 */
	var PopoverMsgTip = function (cfg) {
		var $tar = $XP(cfg, 'targetEl', null);
		if (!$tar) return ;
		$tar = $($tar);
		var msg = $XP(cfg, 'msg', ''),
			type = $XP(cfg, 'type', 'warning'),
			placement = $XP(cfg, 'placement', 'left'),
			trigger = $XP(cfg, 'trigger', 'click'),
			title = $XP(cfg, 'title', ''),
			container = $XP(cfg, 'container', false),
			afterShow = $XF(cfg, 'afterShow'),
			afterHide = $XF(cfg, 'afterHide');
		$tar.popover({
			html : true,
			placement : function (popoverEl, triggerEl) {
				// console.info(popoverEl);
				// console.info(triggerEl);
				// console.info(this);
				$(popoverEl).addClass(type);
				return placement;
			},
			trigger : trigger,
			// type : type,
			content : msg,
			container : container
		});
		$tar.on('shown.bs.popover', function () {
			afterShow($tar, type);
		});
		$tar.on('hidden.bs.popover', function () {
			afterHide($tar, type);
			$tar.popover('destroy');
		});
		$tar.popover('show');
	};

	/**
	 * show tip message for model window
	 * 
	 * @param {[Object]} cfg [config params]
	 *        msg : "string",
	 *        type : "danger|warning|success",
	 *        afterClosed : function () {},
	 *        afterClose : function () {}
	 * @return {[jQuery Obj] } [tip obj]
	 */
	var TopTip = function (cfg) {
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_toptip'));
		var tipEl = $(tpl({
			id : IX.id(),
			type : $XP(cfg, 'type', 'warning'),
			msg : $XP(cfg, 'msg', '')
		}));
		tipEl.appendTo('body');
		tipEl.bind({
			'close.bs.alert' : function (e) {
				$XF(cfg, 'afterClose')(e);
			},
			'closed.bs.alert' : function (e) {
				$XF(cfg, 'afterClosed')(e);
			}
		});
		tipEl.alert();
		setTimeout(function () {
			tipEl.alert('close');
		}, $XP(cfg, 'interval', 1500));
	};

	/**
	 * cfg :{
	 * 		container : DOM|jQuery Obj //default $('body') 
	 * 		id : '',	//default IX.id()
	 * 		zIndex : null,	//default null
	 * 		dragHandler : null,	//拖动手柄 default null
	 * 		containment : null,	//拖动范围容器 default null
	 * 		overFlow : false,	//default false
	 * 		movable : false	,	//default false
	 * 		showTitle : true ,	//default true
	 * 		showFooter : true,	//default true
	 * 		hideCloseBtn : true,	//default true 默认屏蔽窗口的关闭按钮
	 * 		title : '',			//title string
	 * 		hideWithRemove : true,	//隐藏时是否删除
	 * 		clz : '',			//dialog className
	 * 		afterRemove : function () {},
	 * 		afterHide : function () {},
	 * 		onBeforeDrag : function () {},
	 * 		onDragging : function () {},
	 * 		onAfterDrag : function () {}
	 * }
	 */
	var ModalDialog = function (cfg) {
		var config = IX.inherit({
			container : null,
			id : null,
			html : '',
			ifDrag : false,
			dragHandler : null,
			containment : null,
			overFlow : false,
			zIndex : null,
			showTitle : true,
			showFooter : true,
			hideCloseBtn : true,
			title : '',
			hideWithRemove : true,
			clz : '',
			afterRemove : IX.emptyFn,
			afterHide : IX.emptyFn,
			aftetShow : IX.emptyFn,
			onBeforeDrag : IX.emptyFn,
			onDragging : IX.emptyFn,
			onAfterDrag : IX.emptyFn
		}, cfg);

		var $self = null, $con = null, $modal = null, isFirst = true;
		var $dialogHead = null, $dialogBody = null, $dialogFoot = null, $closeBtn = null;
		var dialogId = $XP(config, 'id', 'modal_dialog_' + IX.id());
		var dialogTpl = Handlebars.compile(Hualala.TplLib.get('tpl_modal_dialog'));
		var dialogCfg = {
			clz : $XP(config, 'clz', ''),
			id : dialogId,
			title : $XP(config, 'title', '')
		};

		var initStyle = function () {
			var _overflow = $XP(config, 'overFlow', false),
				_zIndex = $XP(config, 'zIndex', null);
			// $dialogBody.css({
			// 	"overflow" : !_overflow : 'hidden' : 'auto'
			// });
			if (_zIndex && !isNaN(_zIndex)) {
				$self.css({
					'z-index' : _zIndex
				});
			}
			if (!$XP(config, 'showTitle', false)) {
				$dialogHead.hide();
			}
			if (!$XP(config, 'showFooter', false)) {
				$dialogFoot.hide();
			}
			if (!!$XP(config, 'hideCloseBtn', false)) {
				$closeBtn.hide();
			}
		};

		var bindEvent = function () {
			$self.on('hidden.bs.modal', function (e) {
				$XF(config, 'afterHide')(e);
				if ($XP(config, 'hideWithRemove', false)) {
					$self.remove();
				}
			});
			if (!config.ifDrag || (!config.showTitle && !config.dragHandler)) return;
			var $handler = $(dragHandler, $self);
			if ($handler.length == 0) return;
			if (!self.draggable) return;
			$self.draggable({
				cursor : 'move',
				containment : config.containment || 'document',
				handle : config.showTitle ? dialogHead : $handler,
				start : config.onBeforeDrag,
				drag : config.onDragging,
				stop : config.onAfterDrag
			});	
		};

		var init = function () {
			$con = $XP(cfg, 'container', null);
			$con = !$con ? $('body') : $($con);
			$self = $(dialogTpl(dialogCfg));
			$self.appendTo($con);
			$dialogHead = $self.find('.modal-header');
			$closeBtn = $dialogHead.find('.close');
			$dialogBody = $self.find('.modal-body');
			$dialogFoot = $self.find('.modal-footer');
			_model._ = {
				container : $con,
				dialog : $self,
				header : $dialogHead,
				body : $dialogBody,
				footer : $dialogFoot
			};
			initStyle();
			bindEvent();
		};

		var _hide = function () {
			_model._.dialog.modal('hide');
		};

		var _show = function () {
			_model._.dialog.modal('show');
		};

		var _model = {
			_ : {},
			show : _show,
			hide : _hide,
			setTitle : function (title) {
				$dialogHead.find('.modal-title').html(title);
			}
		};
		init();
		return _model;
	};

	/**
	 * 面包屑控件
	 * 根据当前页面生成页面层级面包屑
	 * @param {Object} cfg {container,hideRoot,nodes, clz, clickFn, mapRenderData}
	 *         @param {jQueryObj} container	容器
	 *         @param {Boolean} hideRoot 是否隐藏根节点
	 *         @param {Array} nodes 节点数据[{name,label,path},...]
	 *         @param {String} clz 面包屑样式类
	 *         @param {Function} clickFn 点击事件处理,
	 *         @param {Function} mapRenderData 处理渲染数据方法
	 * @return {Object} BreadCrumb
	 */
	var BreadCrumb = function (cfg) {
		var settings = {
			container : null,
			hideRoot : false,
			nodes : [],
			clz : '',
			clickFn : function () {
				var $this = $(this);
				document.location.href = $this.attr('data-href');
			},
			mapRenderData : function (data) {
				return {
					clz : $XP(settings, 'clz', ''),
					items : data
				};
			}
		};
		settings = IX.inherit(settings, cfg);
		var tpl = Handlebars.compile(Hualala.TplLib.get('tpl_site_breadcrumb'));
		var mapFn = $XF(settings, 'mapRenderData');
		var $breadCrumb = $(tpl(mapFn($XP(settings, 'nodes'))));
		settings.container.append($breadCrumb);
		$breadCrumb.on('click', 'a', function (e) {
			$XF(settings, 'clickFn')(e);
		});
		return {
			breadCrumb : $breadCrumb,
			show : function () {$breadCrumb.show();},
			hide : function () {$breadCrumb.hide();}
		};
	};





    /*
    options = {
        onSuccess: function () {},
        onTooLarge: function () {},
        onConcel: function () {},
        onStart: function () {}
    }*/
    var uploadImg = function uploadImg(options)
    {
        var tpl = Hualala.TplLib.get('tpl_site_uploadimg');
        var $dialog = $(tpl).appendTo('body')
            .modal({backdrop : 'static', keyboard: false});
        
        var defaults = {
            onSuccess: function () {},
            onTooLarge: function () {},
            onConcel: function () { $dialog.modal('hide'); },
            onStart: function () {}
        };
        var opts = $.extend(defaults, options);
        
        var topTip = Hualala.UI.TopTip;
        window.Head_Pic_Rece_URL = function (imgPath, swfId) 
        {
            if ("IOError" === imgPath)
            {
                topTip({msg: '图片上传失败，请稍候再试'});
                return;
            }
            
            topTip({type: 'success', msg: '图片上传成功！'});
            opts.onSuccess(imgPath, $dialog);
        };
        window.imageTooLarge = function (swfId) 
        {
            topTip({msg: '您上传的图片过大，请换一张'});
            opts.onTooLarge();
        };
        window.Head_Pic_Cancel = function(swfId) { opts.onConcel($dialog); };
        window.uploadStart = function(swfId) { opts.onStart(); };
        
    }

	Hualala.UI.PopoverMsgTip = PopoverMsgTip;
	Hualala.UI.TopTip = TopTip;
	Hualala.UI.ModalDialog = ModalDialog;
	Hualala.UI.BreadCrumb = BreadCrumb;

    Hualala.UI.uploadImg = uploadImg;
})(jQuery, window);