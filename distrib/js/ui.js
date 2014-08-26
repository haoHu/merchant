/** 
 * -------------------------------------------------
 * Copyright (c) 2014, All rights reserved. 
 * Hualala-Merchant-Management
 * 
 * @version : 0.1.0
 * @author : HuHao
 * @description : Hualala Merchant Management System.  
 * -------------------------------------------------
 */ 

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
    Hualala.UI.uploadImg = uploadImg;
})(jQuery, window);;(function ($, window) {
	/**
	 * bootstrap样式的分页插件
	 * @param {Object} options 配置参数
	 *     @param {Int} total total pges count
	 *     @param {Int} page start page number
	 *     @param {Int} maxVisible 最大可视页码数量(每次显示多少个页码按钮)
	 *     @param {Boolean} leaps 是否支持跳页
	 *     @param {String Template} href 链接模板
	 *     @param {String} hrefVar href模板替换的标志
	 *     @param {Html} next Next Btn 填充
	 *     @param {Html} prev Prev Btn 填充
	 *     
	 */
	$.fn.IXPager = function (options) {
		var $self = this,
			settings = $.extend({
				total : 0,
				page : 1,
				maxVisible : null,
				leaps : true,
				href : '#page_{{number}}',
				hrefVar : '{{number}}',
				next : '&raquo;',
				prev : '&laquo;'
			}, 
			$self.data('settings') || {}, 
			options || {});

		if (settings.total <= 0 ) {
			return this;
		}
		// 所有页码全部显示
		if (!$.isNumeric(settings.maxVisible) && !settings.maxVisible) {
			settings.maxVisible = settings.total;
		}
		// 保存当前设置
		$self.data('settings', settings);

		var genHref = function (n) {
			return settings.href.replace(settings.hrefVar, n);
		};

		var renderPager = function ($IXPager, page) {
			var pg, maxV = settings.maxVisible == 0 ? 1 : settings.maxVisible,
				step = settings.maxVisible == 1 ? 0 : 1,
				vis = Math.floor((page - 1) / maxV) * maxV,
				$pages = $IXPager.find('li');
			settings.page = page = page < 0 ? 0 : page > settings.total ? settings.total : page;
			$pages.removeClass('disabled');
			pg = page - 1 < 1 ? 1 
				: (settings.leaps && page - 1 >= settings.maxVisible) 
				? (Math.floor((page - 1) / maxV) * maxV) : (page - 1);
			$pages.first().toggleClass('disabled', page === 1)
				.attr('data-pg', pg).find('a').attr('href', genHref(pg));

			pg = (page + 1) > settings.total ? settings.total : 
				(settings.leaps && page + 1 < settings.total - settings.maxVisible) ?
				(vis + settings.maxVisible + step) : (page + 1);
			$pages.last().toggleClass('disabled', page === settings.total).attr('data-pg', pg)
				.find('a').attr('href', genHref(pg));

			var $curPage = $pages.filter('[data-pg=' + page + ']');
			if (!$curPage.not('.next, .prev').length) {
				var d = page <= vis ? -settings.maxVisible : 0;
				$pages.not('.next, .prev').each(function (index) {
					pg = index + 1 + vis + d;
					$(this).attr('data-pg', pg).toogle(pg <= settings.total)
						.find('a').html(pg).attr('href', genHref(pg));
				});
				$curPage = $pages.filter('[data-pg=' + page + ']');
			}
			$curPage.addClass('disabled');
			$self.data('settings', settings);
		};

		return this.each(function () {
			var $IXPager, pg, $this = $(this),
				htm = ['<ul class="pagination ix-pager">'];
			if (settings.prev) {
				htm.push('<li data-pg="1" class="ix-pager-prev"><a href="' + genHref(1) + '">' + settings.prev + '</a></li>');
			}
			for (var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++) {
				htm.push('<li data-pg="' + c + '"><a href="' + genHref(c) + '">' + c + '</a></li>');
			}
			if (settings.next) {
				pg = settings.leaps && settings.total > settings.maxVisible 
					? Math.min(settings.maxVisible + 1, settings.total) : 2;
				htm.push('<li data-pg="' + pg + '" class="ix-pager-next"><a href="' + genHref(pg) + '">' + settings.next + '</a></li>');
			}
			htm.push('</ul>');
			$this.find('ul.ix-pager').remove();
			$this.append(htm.join(''));
			$IXPager = $this.find('ul.ix-pager');
			$IXPager.delegate('li', 'click', function paginationClickFn() {
				var $this = $(this),
					page = parseInt($this.attr('data-pg'), 10);
				if ($this.hasClass('disabled')) {
					return ;
				}
				renderPager($IXPager, page);
				$self.trigger('page', page)
			});
			renderPager($IXPager, settings.page);
		});
	};
})(jQuery, window);
;/* ========================================================================
 * bootstrap-switch - v3.0.2
 * http://www.bootstrap-switch.org
 * ========================================================================
 * Copyright 2012-2013 Mattia Larentis
 *
 * ========================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================
 */

(function() {
	var __slice = [].slice;

	(function($, window) {
		"use strict";
		var BootstrapSwitch;
		BootstrapSwitch = (function() {
			function BootstrapSwitch(element, options) {
				if (options == null) {
					options = {};
				}
				this.$element = $(element);
				this.options = $.extend({}, $.fn.bootstrapSwitch.defaults, {
					state: this.$element.is(":checked"),
					size: this.$element.data("size"),
					animate: this.$element.data("animate"),
					disabled: this.$element.is(":disabled"),
					readonly: this.$element.is("[readonly]"),
					indeterminate: this.$element.data("indeterminate"),
					onColor: this.$element.data("on-color"),
					offColor: this.$element.data("off-color"),
					onText: this.$element.data("on-text"),
					offText: this.$element.data("off-text"),
					labelText: this.$element.data("label-text"),
					baseClass: this.$element.data("base-class"),
					wrapperClass: this.$element.data("wrapper-class"),
					radioAllOff: this.$element.data("radio-all-off")
				}, options);
				this.$wrapper = $("<div>", {
					"class": (function(_this) {
						return function() {
							var classes;
							classes = ["" + _this.options.baseClass].concat(_this._getClasses(_this.options.wrapperClass));
							classes.push(_this.options.state ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
							if (_this.options.size != null) {
								classes.push("" + _this.options.baseClass + "-" + _this.options.size);
							}
							if (_this.options.animate) {
								classes.push("" + _this.options.baseClass + "-animate");
							}
							if (_this.options.disabled) {
								classes.push("" + _this.options.baseClass + "-disabled");
							}
							if (_this.options.readonly) {
								classes.push("" + _this.options.baseClass + "-readonly");
							}
							if (_this.options.indeterminate) {
								classes.push("" + _this.options.baseClass + "-indeterminate");
							}
							if (_this.$element.attr("id")) {
								classes.push("" + _this.options.baseClass + "-id-" + (_this.$element.attr("id")));
							}
							return classes.join(" ");
						};
					})(this)()
				});
				this.$container = $("<div>", {
					"class": "" + this.options.baseClass + "-container"
				});
				this.$on = $("<span>", {
					html: this.options.onText,
					"class": "" + this.options.baseClass + "-handle-on " + this.options.baseClass + "-" + this.options.onColor
				});
				this.$off = $("<span>", {
					html: this.options.offText,
					"class": "" + this.options.baseClass + "-handle-off " + this.options.baseClass + "-" + this.options.offColor
				});
				this.$label = $("<label>", {
					html: this.options.labelText,
					"class": "" + this.options.baseClass + "-label"
				});
				if (this.options.indeterminate) {
					this.$element.prop("indeterminate", true);
				}
				this.$element.on("init.bootstrapSwitch", (function(_this) {
					return function() {
						return _this.options.onInit.apply(element, arguments);
					};
				})(this));
				this.$element.on("switchChange.bootstrapSwitch", (function(_this) {
					return function() {
						return _this.options.onSwitchChange.apply(element, arguments);
					};
				})(this));
				this.$container = this.$element.wrap(this.$container).parent();
				this.$wrapper = this.$container.wrap(this.$wrapper).parent();
				this.$element.before(this.$on).before(this.$label).before(this.$off).trigger("init.bootstrapSwitch");
				this._elementHandlers();
				this._handleHandlers();
				this._labelHandlers();
				this._formHandler();
			}

			BootstrapSwitch.prototype._constructor = BootstrapSwitch;

			BootstrapSwitch.prototype.state = function(value, skip) {
				if (typeof value === "undefined") {
					return this.options.state;
				}
				if (this.options.disabled || this.options.readonly || this.options.indeterminate) {
					return this.$element;
				}
				if (this.options.state && !this.options.radioAllOff && this.$element.is(':radio')) {
					return this.$element;
				}
				value = !!value;
				this.$element.prop("checked", value).trigger("change.bootstrapSwitch", skip);
				return this.$element;
			};

			BootstrapSwitch.prototype.toggleState = function(skip) {
				if (this.options.disabled || this.options.readonly || this.options.indeterminate) {
					return this.$element;
				}
				return this.$element.prop("checked", !this.options.state).trigger("change.bootstrapSwitch", skip);
			};

			BootstrapSwitch.prototype.size = function(value) {
				if (typeof value === "undefined") {
					return this.options.size;
				}
				if (this.options.size != null) {
					this.$wrapper.removeClass("" + this.options.baseClass + "-" + this.options.size);
				}
				if (value) {
					this.$wrapper.addClass("" + this.options.baseClass + "-" + value);
				}
				this.options.size = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.animate = function(value) {
				if (typeof value === "undefined") {
					return this.options.animate;
				}
				value = !!value;
				this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-animate");
				this.options.animate = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.disabled = function(value) {
				if (typeof value === "undefined") {
					return this.options.disabled;
				}
				value = !!value;
				this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-disabled");
				this.$element.prop("disabled", value);
				this.options.disabled = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.toggleDisabled = function() {
				this.$element.prop("disabled", !this.options.disabled);
				this.$wrapper.toggleClass("" + this.options.baseClass + "-disabled");
				this.options.disabled = !this.options.disabled;
				return this.$element;
			};

			BootstrapSwitch.prototype.readonly = function(value) {
				if (typeof value === "undefined") {
					return this.options.readonly;
				}
				value = !!value;
				this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-readonly");
				this.$element.prop("readonly", value);
				this.options.readonly = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.toggleReadonly = function() {
				this.$element.prop("readonly", !this.options.readonly);
				this.$wrapper.toggleClass("" + this.options.baseClass + "-readonly");
				this.options.readonly = !this.options.readonly;
				return this.$element;
			};

			BootstrapSwitch.prototype.indeterminate = function(value) {
				if (typeof value === "undefined") {
					return this.options.indeterminate;
				}
				value = !!value;
				this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-indeterminate");
				this.$element.prop("indeterminate", value);
				this.options.indeterminate = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.toggleIndeterminate = function() {
				this.$element.prop("indeterminate", !this.options.indeterminate);
				this.$wrapper.toggleClass("" + this.options.baseClass + "-indeterminate");
				this.options.indeterminate = !this.options.indeterminate;
				return this.$element;
			};

			BootstrapSwitch.prototype.onColor = function(value) {
				var color;
				color = this.options.onColor;
				if (typeof value === "undefined") {
					return color;
				}
				if (color != null) {
					this.$on.removeClass("" + this.options.baseClass + "-" + color);
				}
				this.$on.addClass("" + this.options.baseClass + "-" + value);
				this.options.onColor = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.offColor = function(value) {
				var color;
				color = this.options.offColor;
				if (typeof value === "undefined") {
					return color;
				}
				if (color != null) {
					this.$off.removeClass("" + this.options.baseClass + "-" + color);
				}
				this.$off.addClass("" + this.options.baseClass + "-" + value);
				this.options.offColor = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.onText = function(value) {
				if (typeof value === "undefined") {
					return this.options.onText;
				}
				this.$on.html(value);
				this.options.onText = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.offText = function(value) {
				if (typeof value === "undefined") {
					return this.options.offText;
				}
				this.$off.html(value);
				this.options.offText = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.labelText = function(value) {
				if (typeof value === "undefined") {
					return this.options.labelText;
				}
				this.$label.html(value);
				this.options.labelText = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.baseClass = function(value) {
				return this.options.baseClass;
			};

			BootstrapSwitch.prototype.wrapperClass = function(value) {
				if (typeof value === "undefined") {
					return this.options.wrapperClass;
				}
				if (!value) {
					value = $.fn.bootstrapSwitch.defaults.wrapperClass;
				}
				this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(" "));
				this.$wrapper.addClass(this._getClasses(value).join(" "));
				this.options.wrapperClass = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.radioAllOff = function(value) {
				if (typeof value === "undefined") {
					return this.options.radioAllOff;
				}
				this.options.radioAllOff = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.onInit = function(value) {
				if (typeof value === "undefined") {
					return this.options.onInit;
				}
				if (!value) {
					value = $.fn.bootstrapSwitch.defaults.onInit;
				}
				this.options.onInit = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.onSwitchChange = function(value) {
				if (typeof value === "undefined") {
					return this.options.onSwitchChange;
				}
				if (!value) {
					value = $.fn.bootstrapSwitch.defaults.onSwitchChange;
				}
				this.options.onSwitchChange = value;
				return this.$element;
			};

			BootstrapSwitch.prototype.destroy = function() {
				var $form;
				$form = this.$element.closest("form");
				if ($form.length) {
					$form.off("reset.bootstrapSwitch").removeData("bootstrap-switch");
				}
				this.$container.children().not(this.$element).remove();
				this.$element.unwrap().unwrap().off(".bootstrapSwitch").removeData("bootstrap-switch");
				return this.$element;
			};

			BootstrapSwitch.prototype._elementHandlers = function() {
				return this.$element.on({
					"change.bootstrapSwitch": (function(_this) {
						return function(e, skip) {
							var checked;
							e.preventDefault();
							e.stopImmediatePropagation();
							checked = _this.$element.is(":checked");
							if (checked === _this.options.state) {
								return;
							}
							_this.options.state = checked;
							_this.$wrapper.removeClass(checked ? "" + _this.options.baseClass + "-off" : "" + _this.options.baseClass + "-on").addClass(checked ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
							if (!skip) {
								if (_this.$element.is(":radio")) {
									$("[name='" + (_this.$element.attr('name')) + "']").not(_this.$element).prop("checked", false).trigger("change.bootstrapSwitch", true);
								}
								return _this.$element.trigger("switchChange.bootstrapSwitch", [checked]);
							}
						};
					})(this),
					"focus.bootstrapSwitch": (function(_this) {
						return function(e) {
							e.preventDefault();
							return _this.$wrapper.addClass("" + _this.options.baseClass + "-focused");
						};
					})(this),
					"blur.bootstrapSwitch": (function(_this) {
						return function(e) {
							e.preventDefault();
							return _this.$wrapper.removeClass("" + _this.options.baseClass + "-focused");
						};
					})(this),
					"keydown.bootstrapSwitch": (function(_this) {
						return function(e) {
							if (!e.which || _this.options.disabled || _this.options.readonly || _this.options.indeterminate) {
								return;
							}
							switch (e.which) {
								case 37:
									e.preventDefault();
									e.stopImmediatePropagation();
									return _this.state(false);
								case 39:
									e.preventDefault();
									e.stopImmediatePropagation();
									return _this.state(true);
							}
						};
					})(this)
				});
			};

			BootstrapSwitch.prototype._handleHandlers = function() {
				this.$on.on("click.bootstrapSwitch", (function(_this) {
					return function(e) {
						_this.state(false);
						return _this.$element.trigger("focus.bootstrapSwitch");
					};
				})(this));
				return this.$off.on("click.bootstrapSwitch", (function(_this) {
					return function(e) {
						_this.state(true);
						return _this.$element.trigger("focus.bootstrapSwitch");
					};
				})(this));
			};

			BootstrapSwitch.prototype._labelHandlers = function() {
				return this.$label.on({
					"mousemove.bootstrapSwitch touchmove.bootstrapSwitch": (function(_this) {
						return function(e) {
							var left, pageX, percent, right;
							if (!_this.isLabelDragging) {
								return;
							}
							e.preventDefault();
							_this.isLabelDragged = true;
							pageX = e.pageX || e.originalEvent.touches[0].pageX;
							percent = ((pageX - _this.$wrapper.offset().left) / _this.$wrapper.width()) * 100;
							left = 25;
							right = 75;
							if (_this.options.animate) {
								_this.$wrapper.removeClass("" + _this.options.baseClass + "-animate");
							}
							if (percent < left) {
								percent = left;
							} else if (percent > right) {
								percent = right;
							}
							_this.$container.css("margin-left", "" + (percent - right) + "%");
							return _this.$element.trigger("focus.bootstrapSwitch");
						};
					})(this),
					"mousedown.bootstrapSwitch touchstart.bootstrapSwitch": (function(_this) {
						return function(e) {
							if (_this.isLabelDragging || _this.options.disabled || _this.options.readonly || _this.options.indeterminate) {
								return;
							}
							e.preventDefault();
							_this.isLabelDragging = true;
							return _this.$element.trigger("focus.bootstrapSwitch");
						};
					})(this),
					"mouseup.bootstrapSwitch touchend.bootstrapSwitch": (function(_this) {
						return function(e) {
							if (!_this.isLabelDragging) {
								return;
							}
							e.preventDefault();
							if (_this.isLabelDragged) {
								_this.isLabelDragged = false;
								_this.state(parseInt(_this.$container.css("margin-left"), 10) > -(_this.$container.width() / 6));
								if (_this.options.animate) {
									_this.$wrapper.addClass("" + _this.options.baseClass + "-animate");
								}
								_this.$container.css("margin-left", "");
							} else {
								_this.state(!_this.options.state);
							}
							return _this.isLabelDragging = false;
						};
					})(this),
					"mouseleave.bootstrapSwitch": (function(_this) {
						return function(e) {
							return _this.$label.trigger("mouseup.bootstrapSwitch");
						};
					})(this)
				});
			};

			BootstrapSwitch.prototype._formHandler = function() {
				var $form;
				$form = this.$element.closest("form");
				if ($form.data("bootstrap-switch")) {
					return;
				}
				return $form.on("reset.bootstrapSwitch", function() {
					return window.setTimeout(function() {
						return $form.find("input").filter(function() {
							return $(this).data("bootstrap-switch");
						}).each(function() {
							return $(this).bootstrapSwitch("state", this.checked);
						});
					}, 1);
				}).data("bootstrap-switch", true);
			};

			BootstrapSwitch.prototype._getClasses = function(classes) {
				var c, cls, _i, _len;
				if (!$.isArray(classes)) {
					return ["" + this.options.baseClass + "-" + classes];
				}
				cls = [];
				for (_i = 0, _len = classes.length; _i < _len; _i++) {
					c = classes[_i];
					cls.push("" + this.options.baseClass + "-" + c);
				}
				return cls;
			};

			return BootstrapSwitch;

		})();
		$.fn.bootstrapSwitch = function() {
			var args, option, ret;
			option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
			ret = this;
			this.each(function() {
				var $this, data;
				$this = $(this);
				data = $this.data("bootstrap-switch");
				if (!data) {
					$this.data("bootstrap-switch", data = new BootstrapSwitch(this, option));
				}
				if (typeof option === "string") {
					return ret = data[option].apply(data, args);
				}
			});
			return ret;
		};
		$.fn.bootstrapSwitch.Constructor = BootstrapSwitch;
		return $.fn.bootstrapSwitch.defaults = {
			state: true,
			size: null,
			animate: true,
			disabled: false,
			readonly: false,
			indeterminate: false,
			onColor: "primary",
			offColor: "default",
			onText: "ON",
			offText: "OFF",
			labelText: "&nbsp;",
			baseClass: "bootstrap-switch",
			wrapperClass: "wrapper",
			radioAllOff: false,
			onInit: function() {},
			onSwitchChange: function() {}
		};
	})(window.jQuery, window);

}).call(this);
;/*!
 * @NOTE ���򵼿ؼ�����ԭ�����ϵ��޸İ汾
 * ����Ҫ������bootstrap��tab����ǩҳ/ѡ�������
 * HTML��������ѭbootstrap��tab���������ṹ
 * jQuery twitter bootstrap wizard plugin
 * Examples and documentation at: http://github.com/VinceG/twitter-bootstrap-wizard
 * version 1.0
 * Requires jQuery v1.3.2 or later
 * Supports Bootstrap 2.2.x, 2.3.x, 3.0
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Authors: Vadim Vincent Gabriel (http://vadimg.com), Jason Gill (www.gilluminate.com)
 */
;(function($) {
var bootstrapWizardCreate = function(element, options) {
	var element = $(element);
	var obj = this;
	
	// selector skips any 'li' elements that do not contain a child with a tab data-toggle
	var baseItemSelector = 'li:has([data-toggle="tab"])';

	// Merge options with defaults
	var $settings = $.extend({}, $.fn.bootstrapWizard.defaults, options),
	    $activeTab = null,
        $navigation = null,
        $stepAction = null;
	
	this.rebindClick = function(selector, fn)
	{
		selector.unbind('click', fn).bind('click', fn);
	}

	this.fixNavigationButtons = function() {
		// Get the current active tab
		if(!$activeTab.length) {
			// Select first one
			$navigation.find('a:first').tab('show');
			$activeTab = $navigation.find(baseItemSelector + ':first');
		}

		// See if we're currently in the first/last then disable the previous and last buttons
		$($settings.previousSelector, element).toggleClass($settings.unusableClass, (obj.firstIndex() >= obj.currentIndex()));
		$($settings.nextSelector, element).toggleClass($settings.unusableClass, (obj.currentIndex() >= obj.navigationLength()));
        
        if(obj.currentIndex() >= obj.navigationLength())
        {
            var lastAction = $settings.lastAction;
            if(lastAction == 'remove' || !lastAction)
                $stepAction.remove();
            else if(lastAction == 'hide')
                $stepAction.addClass('hidden');
        }

		// We are unbinding and rebinding to ensure single firing and no double-click errors
		obj.rebindClick($($settings.nextSelector, element), obj.next);
		obj.rebindClick($($settings.previousSelector, element), obj.previous);
		obj.rebindClick($($settings.lastSelector, element), obj.last);
		obj.rebindClick($($settings.firstSelector, element), obj.first);
        
        //@NOTE: �����¼��� BUG, ע�͵������� onTabChange �¼�
		/*if($settings.onTabShow && typeof $settings.onTabShow === 'function' && $settings.onTabShow(obj.activePane(), $activeTab, $navigation, obj.currentIndex())===false){
			return false;
		}*/
	};

	this.next = function(e) {

		// If we clicked the last then dont activate this
		if(element.hasClass('last')) {
			return false;
		}

		if($settings.onNext && typeof $settings.onNext === 'function' && $settings.onNext(obj.activePane(), $activeTab, $navigation, obj.nextIndex())===false){
			return false;
		}

		// Did we click the last button
		$index = obj.nextIndex();
		if($index > obj.navigationLength()) {
		} else {
			$navigation.find(baseItemSelector + ':eq('+$index+') a').tab('show');
		}
        return this;
	};

	this.previous = function(e) {

		// If we clicked the first then dont activate this
		if(element.hasClass('first')) {
			return false;
		}

		if($settings.onPrevious && typeof $settings.onPrevious === 'function' && $settings.onPrevious(obj.activePane(), $activeTab, $navigation, obj.previousIndex())===false){
			return false;
		}

		$index = obj.previousIndex();
		if($index < 0) {
		} else {
			$navigation.find(baseItemSelector + ':eq('+$index+') a').tab('show');
		}
        return this;
	};

	this.first = function(e) {
		if($settings.onFirst && typeof $settings.onFirst === 'function' && $settings.onFirst(obj.activePane(), $activeTab, $navigation, obj.firstIndex())===false){
			return false;
		}

		// If the element is disabled then we won't do anything
		if(element.hasClass('disabled')) {
			return false;
		}
		$navigation.find(baseItemSelector + ':eq(0) a').tab('show');
        return this;
	};
	this.last = function(e) {
		if($settings.onLast && typeof $settings.onLast === 'function' && $settings.onLast(obj.activePane(), $activeTab, $navigation, obj.lastIndex())===false){
			return false;
		}

		// If the element is disabled then we won't do anything
		if(element.hasClass('disabled')) {
			return false;
		}
		$navigation.find(baseItemSelector + ':eq('+obj.navigationLength()+') a').tab('show');
        return this;
	};
	this.currentIndex = function() {
		return $navigation.find(baseItemSelector).index($activeTab);
	};
	this.firstIndex = function() {
		return 0;
	};
	this.lastIndex = function() {
		return obj.navigationLength();
	};
	this.getIndex = function(e) {
		return $navigation.find(baseItemSelector).index(e);
	};
	this.nextIndex = function() {
		return $navigation.find(baseItemSelector).index($activeTab) + 1;
	};
	this.previousIndex = function() {
		return $navigation.find(baseItemSelector).index($activeTab) - 1;
	};
	this.navigationLength = function() {
		return $navigation.find(baseItemSelector).length - 1;
	};
	this.activeTab = function() {
		return $activeTab;
	};
    this.activePane = function ()
    {
        return element.find('.tab-pane.active');
    };
	this.nextTab = function() {
		return $navigation.find(baseItemSelector + ':eq('+(obj.currentIndex()+1)+')').length ? $navigation.find(baseItemSelector + ':eq('+(obj.currentIndex()+1)+')') : null;
	};
	this.previousTab = function() {
		if(obj.currentIndex() <= 0) {
			return null;
		}
		return $navigation.find(baseItemSelector + ':eq('+parseInt(obj.currentIndex()-1)+')');
	};
	this.show = function(index) {
		if (isNaN(index)) {
			return element.find(baseItemSelector + ' a[href=#' + index + ']').tab('show');
		}
		else {
			return element.find(baseItemSelector + ':eq(' + index + ') a').tab('show');
		}
	};
	this.disable = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').addClass('disabled');
	};
	this.enable = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').removeClass('disabled');
	};
	this.hide = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').hide();
	};
	this.display = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').show();
	};
	this.remove = function(args) {
		var $index = args[0];
		var $removeTabPane = typeof args[1] != 'undefined' ? args[1] : false;
		var $item = $navigation.find(baseItemSelector + ':eq('+$index+')');

		// Remove the tab pane first if needed
		if($removeTabPane) {
			var $href = $item.find('a').attr('href');
			$($href).remove();
		}

		// Remove menu item
		$item.remove();
	};
	
	var innerTabClick = function (e) {
		// Get the index of the clicked tab
		var clickedIndex = $navigation.find(baseItemSelector).index($(e.currentTarget).parent(baseItemSelector));
		if($settings.onTabClick && typeof $settings.onTabClick === 'function' && $settings.onTabClick(obj.activePane(), $activeTab, $navigation, obj.currentIndex(), clickedIndex)===false){
			return false;
		}
	};
	
	var innerTabShown = function (e) {  
        // use shown instead of show to help prevent double firing
        // @NOTE: double firing ������ onTabShow�¼��ϣ��Ѿ�ע�͵�
		$element = $(e.target).parent();
		var nextTab = $navigation.find(baseItemSelector).index($element);

		// If it's disabled then do not change
		if($element.hasClass('disabled')) {
			return false;
		}
        var $panes = element.find('.tab-pane'),
            curIdx = obj.currentIndex(),
            $currentPane = curIdx == -1 ? null : $panes.eq(curIdx),
            $nextPane = $panes.eq(nextTab)
		if($settings.onTabChange && typeof $settings.onTabChange === 'function' && $settings.onTabChange($currentPane, $nextPane, curIdx, nextTab, $activeTab, $navigation)===false){
			return false;
		}

		$activeTab = $element; // activated tab
		obj.fixNavigationButtons();
	};
	
	this.resetWizard = function() {
		
		// remove the existing handlers
		$('a[data-toggle="tab"]', $navigation).off('click', innerTabClick);
        //@NOTE: ���� shown �¼���Ϊ show �¼�
		$('a[data-toggle="tab"]', $navigation).off('show show.bs.tab', innerTabShown);
		
		// reset elements based on current state of the DOM
		$navigation = element.find('ul:first', element);
		$activeTab = $navigation.find(baseItemSelector + '.active', element);
		
		// re-add handlers
		$('a[data-toggle="tab"]', $navigation).on('click', innerTabClick);
        //@NOTE: ���� shown �¼���Ϊ show �¼�
		$('a[data-toggle="tab"]', $navigation).on('show show.bs.tab', innerTabShown);
		
		obj.fixNavigationButtons();
	};

	$navigation = element.find('ul:first', element);
	$activeTab = $navigation.find(baseItemSelector + '.active', element);
    $stepAction = element.find($settings.actionSelector);

	if(!$navigation.hasClass($settings.tabClass)) {
		$navigation.addClass($settings.tabClass);
	}
    var $firstPane = element.find('.tab-pane').eq(0);
	// Load onInit
	if($settings.onInit && typeof $settings.onInit === 'function'){
		$settings.onInit($firstPane, $activeTab, $navigation, 0);
	}

	// Load onShow
	if($settings.onShow && typeof $settings.onShow === 'function'){
		$settings.onShow($firstPane, $activeTab, $navigation, obj.nextIndex());
	}

	$('a[data-toggle="tab"]', $navigation).on('click', innerTabClick);

	// attach to both shown and shown.bs.tab to support Bootstrap versions 2.3.2 and 3.0.0
    //@NOTE: ���� shown �¼���Ϊ show �¼�
	$('a[data-toggle="tab"]', $navigation).on('show show.bs.tab', innerTabShown);
};
$.fn.bootstrapWizard = function(options) {
	//expose methods
	if (typeof options == 'string') {
		var args = Array.prototype.slice.call(arguments, 1)
		if(args.length === 1) {
			args.toString();
		}
		return this.data('bootstrapWizard')[options](args);
	}
	return this.each(function(index){
		var element = $(this);
		// Return early if this element already has a plugin instance
		if (element.data('bootstrapWizard')) return;
		// pass options to plugin constructor
		var wizard = new bootstrapWizardCreate(element, options);
		// Store plugin object in this element's data
		element.data('bootstrapWizard', wizard);
		// and then trigger initial change
		wizard.fixNavigationButtons();
	});
};

// expose options
$.fn.bootstrapWizard.defaults = {
	tabClass:         'step-nav',
    //��������һ����������һ�����Ȱ�ť����������
    actionSelector:   '.step-action',
	nextSelector:     '.next-step',
	previousSelector: '.prev-step',
	firstSelector:    '.first-step',
	lastSelector:     '.last-step',
    //��������һ��ʱ����������һ����������һ�����Ȱ�ť��������Ϊ
    // 'remove' || 'hide' || 'keep'
    lastAction:       'remove', 
    //�����ð�ť������: 'hidden' || 'disabled' || ��������
    unusableClass:    'hidden', 
	onShow:           null,
	onInit:           null,
	onNext:           null,
	onPrevious:       null,
	onLast:           null,
	onFirst:          null,
	onTabChange:      null, 
    //onTabShow:      null, // @NOTE: ���¼��� BUG��ע�͵�
	onTabClick:       function () { return false; },
};

})(jQuery);
;/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.1.0
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
	var $, AbstractChosen, Chosen, SelectParser, _ref,
		__hasProp = {}.hasOwnProperty,
		__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	SelectParser = (function() {
		function SelectParser() {
			this.options_index = 0;
			this.parsed = [];
		}

		SelectParser.prototype.add_node = function(child) {
			if (child.nodeName.toUpperCase() === "OPTGROUP") {
				return this.add_group(child);
			} else {
				return this.add_option(child);
			}
		};

		SelectParser.prototype.add_group = function(group) {
			var group_position, option, _i, _len, _ref, _results;
			group_position = this.parsed.length;
			this.parsed.push({
				array_index: group_position,
				group: true,
				label: this.escapeExpression(group.label),
				children: 0,
				disabled: group.disabled
			});
			_ref = group.childNodes;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				option = _ref[_i];
				_results.push(this.add_option(option, group_position, group.disabled));
			}
			return _results;
		};

		SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
			if (option.nodeName.toUpperCase() === "OPTION") {
				if (option.text !== "") {
					if (group_position != null) {
						this.parsed[group_position].children += 1;
					}
					this.parsed.push({
						array_index: this.parsed.length,
						options_index: this.options_index,
						value: option.value,
						text: option.text,
						html: option.innerHTML,
						selected: option.selected,
						disabled: group_disabled === true ? group_disabled : option.disabled,
						group_array_index: group_position,
						classes: option.className,
						style: option.style.cssText
					});
				} else {
					this.parsed.push({
						array_index: this.parsed.length,
						options_index: this.options_index,
						empty: true
					});
				}
				return this.options_index += 1;
			}
		};

		SelectParser.prototype.escapeExpression = function(text) {
			var map, unsafe_chars;
			if ((text == null) || text === false) {
				return "";
			}
			if (!/[\&\<\>\"\'\`]/.test(text)) {
				return text;
			}
			map = {
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;",
				"`": "&#x60;"
			};
			unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
			return text.replace(unsafe_chars, function(chr) {
				return map[chr] || "&amp;";
			});
		};

		return SelectParser;

	})();

	SelectParser.select_to_array = function(select) {
		var child, parser, _i, _len, _ref;
		parser = new SelectParser();
		_ref = select.childNodes;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			child = _ref[_i];
			parser.add_node(child);
		}
		return parser.parsed;
	};

	AbstractChosen = (function() {
		function AbstractChosen(form_field, options) {
			this.form_field = form_field;
			this.options = options != null ? options : {};
			if (!AbstractChosen.browser_is_supported()) {
				return;
			}
			this.is_multiple = this.form_field.multiple;
			this.set_default_text();
			this.set_default_values();
			this.setup();
			this.set_up_html();
			this.register_observers();
		}

		AbstractChosen.prototype.set_default_values = function() {
			var _this = this;
			this.click_test_action = function(evt) {
				return _this.test_active_click(evt);
			};
			this.activate_action = function(evt) {
				return _this.activate_field(evt);
			};
			this.active_field = false;
			this.mouse_on_container = false;
			this.results_showing = false;
			this.result_highlighted = null;
			this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
			this.disable_search_threshold = this.options.disable_search_threshold || 0;
			this.disable_search = this.options.disable_search || false;
			this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
			this.group_search = this.options.group_search != null ? this.options.group_search : true;
			this.search_contains = this.options.search_contains || false;
			this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
			this.max_selected_options = this.options.max_selected_options || Infinity;
			this.inherit_select_classes = this.options.inherit_select_classes || false;
			this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
			return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
		};

		AbstractChosen.prototype.set_default_text = function() {
			if (this.form_field.getAttribute("data-placeholder")) {
				this.default_text = this.form_field.getAttribute("data-placeholder");
			} else if (this.is_multiple) {
				this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
			} else {
				this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
			}
			return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
		};

		AbstractChosen.prototype.mouse_enter = function() {
			return this.mouse_on_container = true;
		};

		AbstractChosen.prototype.mouse_leave = function() {
			return this.mouse_on_container = false;
		};

		AbstractChosen.prototype.input_focus = function(evt) {
			var _this = this;
			if (this.is_multiple) {
				if (!this.active_field) {
					return setTimeout((function() {
						return _this.container_mousedown();
					}), 50);
				}
			} else {
				if (!this.active_field) {
					return this.activate_field();
				}
			}
		};

		AbstractChosen.prototype.input_blur = function(evt) {
			var _this = this;
			if (!this.mouse_on_container) {
				this.active_field = false;
				return setTimeout((function() {
					return _this.blur_test();
				}), 100);
			}
		};

		AbstractChosen.prototype.results_option_build = function(options) {
			var content, data, _i, _len, _ref;
			content = '';
			_ref = this.results_data;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				data = _ref[_i];
				if (data.group) {
					content += this.result_add_group(data);
				} else {
					content += this.result_add_option(data);
				}
				if (options != null ? options.first : void 0) {
					if (data.selected && this.is_multiple) {
						this.choice_build(data);
					} else if (data.selected && !this.is_multiple) {
						this.single_set_selected_text(data.text);
					}
				}
			}
			return content;
		};

		AbstractChosen.prototype.result_add_option = function(option) {
			var classes, option_el;
			if (!option.search_match) {
				return '';
			}
			if (!this.include_option_in_results(option)) {
				return '';
			}
			classes = [];
			if (!option.disabled && !(option.selected && this.is_multiple)) {
				classes.push("active-result");
			}
			if (option.disabled && !(option.selected && this.is_multiple)) {
				classes.push("disabled-result");
			}
			if (option.selected) {
				classes.push("result-selected");
			}
			if (option.group_array_index != null) {
				classes.push("group-option");
			}
			if (option.classes !== "") {
				classes.push(option.classes);
			}
			option_el = document.createElement("li");
			option_el.className = classes.join(" ");
			option_el.style.cssText = option.style;
			option_el.setAttribute("data-option-array-index", option.array_index);
			option_el.innerHTML = option.search_text;
			return this.outerHTML(option_el);
		};

		AbstractChosen.prototype.result_add_group = function(group) {
			var group_el;
			if (!(group.search_match || group.group_match)) {
				return '';
			}
			if (!(group.active_options > 0)) {
				return '';
			}
			group_el = document.createElement("li");
			group_el.className = "group-result";
			group_el.innerHTML = group.search_text;
			return this.outerHTML(group_el);
		};

		AbstractChosen.prototype.results_update_field = function() {
			this.set_default_text();
			if (!this.is_multiple) {
				this.results_reset_cleanup();
			}
			this.result_clear_highlight();
			this.results_build();
			if (this.results_showing) {
				return this.winnow_results();
			}
		};

		AbstractChosen.prototype.reset_single_select_options = function() {
			var result, _i, _len, _ref, _results;
			_ref = this.results_data;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				result = _ref[_i];
				if (result.selected) {
					_results.push(result.selected = false);
				} else {
					_results.push(void 0);
				}
			}
			return _results;
		};

		AbstractChosen.prototype.results_toggle = function() {
			if (this.results_showing) {
				return this.results_hide();
			} else {
				return this.results_show();
			}
		};

		AbstractChosen.prototype.results_search = function(evt) {
			if (this.results_showing) {
				return this.winnow_results();
			} else {
				return this.results_show();
			}
		};

		AbstractChosen.prototype.winnow_results = function() {
			var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
			this.no_results_clear();
			results = 0;
			searchText = this.get_search_text();
			escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			regexAnchor = this.search_contains ? "" : "^";
			regex = new RegExp(regexAnchor + escapedSearchText, 'i');
			zregex = new RegExp(escapedSearchText, 'i');
			_ref = this.results_data;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				option = _ref[_i];
				option.search_match = false;
				results_group = null;
				if (this.include_option_in_results(option)) {
					if (option.group) {
						option.group_match = false;
						option.active_options = 0;
					}
					if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
						results_group = this.results_data[option.group_array_index];
						if (results_group.active_options === 0 && results_group.search_match) {
							results += 1;
						}
						results_group.active_options += 1;
					}
					if (!(option.group && !this.group_search)) {
						option.search_text = option.group ? option.label : option.html;
						option.search_match = this.search_string_match(option.search_text, regex);
						if (option.search_match && !option.group) {
							results += 1;
						}
						if (option.search_match) {
							if (searchText.length) {
								startpos = option.search_text.search(zregex);
								text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
								option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
							}
							if (results_group != null) {
								results_group.group_match = true;
							}
						} else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
							option.search_match = true;
						}
					}
				}
			}
			this.result_clear_highlight();
			if (results < 1 && searchText.length) {
				this.update_results_content("");
				return this.no_results(searchText);
			} else {
				this.update_results_content(this.results_option_build());
				return this.winnow_results_set_highlight();
			}
		};

		AbstractChosen.prototype.search_string_match = function(search_string, regex) {
			var part, parts, _i, _len;
			if (regex.test(search_string)) {
				return true;
			} else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
				parts = search_string.replace(/\[|\]/g, "").split(" ");
				if (parts.length) {
					for (_i = 0, _len = parts.length; _i < _len; _i++) {
						part = parts[_i];
						if (regex.test(part)) {
							return true;
						}
					}
				}
			}
		};

		AbstractChosen.prototype.choices_count = function() {
			var option, _i, _len, _ref;
			if (this.selected_option_count != null) {
				return this.selected_option_count;
			}
			this.selected_option_count = 0;
			_ref = this.form_field.options;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				option = _ref[_i];
				if (option.selected) {
					this.selected_option_count += 1;
				}
			}
			return this.selected_option_count;
		};

		AbstractChosen.prototype.choices_click = function(evt) {
			evt.preventDefault();
			if (!(this.results_showing || this.is_disabled)) {
				return this.results_show();
			}
		};

		AbstractChosen.prototype.keyup_checker = function(evt) {
			var stroke, _ref;
			stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
			this.search_field_scale();
			switch (stroke) {
				case 8:
					if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
						return this.keydown_backstroke();
					} else if (!this.pending_backstroke) {
						this.result_clear_highlight();
						return this.results_search();
					}
					break;
				case 13:
					evt.preventDefault();
					if (this.results_showing) {
						return this.result_select(evt);
					}
					break;
				case 27:
					if (this.results_showing) {
						this.results_hide();
					}
					return true;
				case 9:
				case 38:
				case 40:
				case 16:
				case 91:
				case 17:
					break;
				default:
					return this.results_search();
			}
		};

		AbstractChosen.prototype.clipboard_event_checker = function(evt) {
			var _this = this;
			return setTimeout((function() {
				return _this.results_search();
			}), 50);
		};

		AbstractChosen.prototype.container_width = function() {
			if (this.options.width != null) {
				return this.options.width;
			} else {
				return "" + this.form_field.offsetWidth + "px";
			}
		};

		AbstractChosen.prototype.include_option_in_results = function(option) {
			if (this.is_multiple && (!this.display_selected_options && option.selected)) {
				return false;
			}
			if (!this.display_disabled_options && option.disabled) {
				return false;
			}
			if (option.empty) {
				return false;
			}
			return true;
		};

		AbstractChosen.prototype.search_results_touchstart = function(evt) {
			this.touch_started = true;
			return this.search_results_mouseover(evt);
		};

		AbstractChosen.prototype.search_results_touchmove = function(evt) {
			this.touch_started = false;
			return this.search_results_mouseout(evt);
		};

		AbstractChosen.prototype.search_results_touchend = function(evt) {
			if (this.touch_started) {
				return this.search_results_mouseup(evt);
			}
		};

		AbstractChosen.prototype.outerHTML = function(element) {
			var tmp;
			if (element.outerHTML) {
				return element.outerHTML;
			}
			tmp = document.createElement("div");
			tmp.appendChild(element);
			return tmp.innerHTML;
		};

		AbstractChosen.browser_is_supported = function() {
			if (window.navigator.appName === "Microsoft Internet Explorer") {
				return document.documentMode >= 8;
			}
			if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
				return false;
			}
			if (/Android/i.test(window.navigator.userAgent)) {
				if (/Mobile/i.test(window.navigator.userAgent)) {
					return false;
				}
			}
			return true;
		};

		AbstractChosen.default_multiple_text = "Select Some Options";

		AbstractChosen.default_single_text = "Select an Option";

		AbstractChosen.default_no_result_text = "No results match";

		return AbstractChosen;

	})();

	$ = jQuery;

	$.fn.extend({
		chosen: function(options) {
			if (!AbstractChosen.browser_is_supported()) {
				return this;
			}
			return this.each(function(input_field) {
				var $this, chosen;
				$this = $(this);
				chosen = $this.data('chosen');
				if (options === 'destroy' && chosen) {
					chosen.destroy();
				} else if (!chosen) {
					$this.data('chosen', new Chosen(this, options));
				}
			});
		}
	});

	Chosen = (function(_super) {
		__extends(Chosen, _super);

		function Chosen() {
			_ref = Chosen.__super__.constructor.apply(this, arguments);
			return _ref;
		}

		Chosen.prototype.setup = function() {
			this.form_field_jq = $(this.form_field);
			this.current_selectedIndex = this.form_field.selectedIndex;
			return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
		};

		Chosen.prototype.set_up_html = function() {
			var container_classes, container_props;
			container_classes = ["chosen-container"];
			container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
			if (this.inherit_select_classes && this.form_field.className) {
				container_classes.push(this.form_field.className);
			}
			if (this.is_rtl) {
				container_classes.push("chosen-rtl");
			}
			container_props = {
				'class': container_classes.join(' '),
				'style': "width: " + (this.container_width()) + ";",
				'title': this.form_field.title
			};
			if (this.form_field.id.length) {
				container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
			}
			this.container = $("<div />", container_props);
			if (this.is_multiple) {
				this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
			} else {
				this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
			}
			this.form_field_jq.hide().after(this.container);
			this.dropdown = this.container.find('div.chosen-drop').first();
			this.search_field = this.container.find('input').first();
			this.search_results = this.container.find('ul.chosen-results').first();
			this.search_field_scale();
			this.search_no_results = this.container.find('li.no-results').first();
			if (this.is_multiple) {
				this.search_choices = this.container.find('ul.chosen-choices').first();
				this.search_container = this.container.find('li.search-field').first();
			} else {
				this.search_container = this.container.find('div.chosen-search').first();
				this.selected_item = this.container.find('.chosen-single').first();
			}
			this.results_build();
			this.set_tab_index();
			this.set_label_behavior();
			return this.form_field_jq.trigger("chosen:ready", {
				chosen: this
			});
		};

		Chosen.prototype.register_observers = function() {
			var _this = this;
			this.container.bind('mousedown.chosen', function(evt) {
				_this.container_mousedown(evt);
			});
			this.container.bind('mouseup.chosen', function(evt) {
				_this.container_mouseup(evt);
			});
			this.container.bind('mouseenter.chosen', function(evt) {
				_this.mouse_enter(evt);
			});
			this.container.bind('mouseleave.chosen', function(evt) {
				_this.mouse_leave(evt);
			});
			this.search_results.bind('mouseup.chosen', function(evt) {
				_this.search_results_mouseup(evt);
			});
			this.search_results.bind('mouseover.chosen', function(evt) {
				_this.search_results_mouseover(evt);
			});
			this.search_results.bind('mouseout.chosen', function(evt) {
				_this.search_results_mouseout(evt);
			});
			this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
				_this.search_results_mousewheel(evt);
			});
			this.search_results.bind('touchstart.chosen', function(evt) {
				_this.search_results_touchstart(evt);
			});
			this.search_results.bind('touchmove.chosen', function(evt) {
				_this.search_results_touchmove(evt);
			});
			this.search_results.bind('touchend.chosen', function(evt) {
				_this.search_results_touchend(evt);
			});
			this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
				_this.results_update_field(evt);
			});
			this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
				_this.activate_field(evt);
			});
			this.form_field_jq.bind("chosen:open.chosen", function(evt) {
				_this.container_mousedown(evt);
			});
			this.form_field_jq.bind("chosen:close.chosen", function(evt) {
				_this.input_blur(evt);
			});
			this.search_field.bind('blur.chosen', function(evt) {
				_this.input_blur(evt);
			});
			this.search_field.bind('keyup.chosen', function(evt) {
				_this.keyup_checker(evt);
			});
			this.search_field.bind('keydown.chosen', function(evt) {
				_this.keydown_checker(evt);
			});
			this.search_field.bind('focus.chosen', function(evt) {
				_this.input_focus(evt);
			});
			this.search_field.bind('cut.chosen', function(evt) {
				_this.clipboard_event_checker(evt);
			});
			this.search_field.bind('paste.chosen', function(evt) {
				_this.clipboard_event_checker(evt);
			});
			if (this.is_multiple) {
				return this.search_choices.bind('click.chosen', function(evt) {
					_this.choices_click(evt);
				});
			} else {
				return this.container.bind('click.chosen', function(evt) {
					evt.preventDefault();
				});
			}
		};

		Chosen.prototype.destroy = function() {
			$(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
			if (this.search_field[0].tabIndex) {
				this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
			}
			this.container.remove();
			this.form_field_jq.removeData('chosen');
			return this.form_field_jq.show();
		};

		Chosen.prototype.search_field_disabled = function() {
			this.is_disabled = this.form_field_jq[0].disabled;
			if (this.is_disabled) {
				this.container.addClass('chosen-disabled');
				this.search_field[0].disabled = true;
				if (!this.is_multiple) {
					this.selected_item.unbind("focus.chosen", this.activate_action);
				}
				return this.close_field();
			} else {
				this.container.removeClass('chosen-disabled');
				this.search_field[0].disabled = false;
				if (!this.is_multiple) {
					return this.selected_item.bind("focus.chosen", this.activate_action);
				}
			}
		};

		Chosen.prototype.container_mousedown = function(evt) {
			if (!this.is_disabled) {
				if (evt && evt.type === "mousedown" && !this.results_showing) {
					evt.preventDefault();
				}
				if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
					if (!this.active_field) {
						if (this.is_multiple) {
							this.search_field.val("");
						}
						$(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
						this.results_show();
					} else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
						evt.preventDefault();
						this.results_toggle();
					}
					return this.activate_field();
				}
			}
		};

		Chosen.prototype.container_mouseup = function(evt) {
			if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
				return this.results_reset(evt);
			}
		};

		Chosen.prototype.search_results_mousewheel = function(evt) {
			var delta;
			if (evt.originalEvent) {
				delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
			}
			if (delta != null) {
				evt.preventDefault();
				if (evt.type === 'DOMMouseScroll') {
					delta = delta * 40;
				}
				return this.search_results.scrollTop(delta + this.search_results.scrollTop());
			}
		};

		Chosen.prototype.blur_test = function(evt) {
			if (!this.active_field && this.container.hasClass("chosen-container-active")) {
				return this.close_field();
			}
		};

		Chosen.prototype.close_field = function() {
			$(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
			this.active_field = false;
			this.results_hide();
			this.container.removeClass("chosen-container-active");
			this.clear_backstroke();
			this.show_search_field_default();
			return this.search_field_scale();
		};

		Chosen.prototype.activate_field = function() {
			this.container.addClass("chosen-container-active");
			this.active_field = true;
			this.search_field.val(this.search_field.val());
			return this.search_field.focus();
		};

		Chosen.prototype.test_active_click = function(evt) {
			var active_container;
			active_container = $(evt.target).closest('.chosen-container');
			if (active_container.length && this.container[0] === active_container[0]) {
				return this.active_field = true;
			} else {
				return this.close_field();
			}
		};

		Chosen.prototype.results_build = function() {
			this.parsing = true;
			this.selected_option_count = null;
			this.results_data = SelectParser.select_to_array(this.form_field);
			if (this.is_multiple) {
				this.search_choices.find("li.search-choice").remove();
			} else if (!this.is_multiple) {
				this.single_set_selected_text();
				if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
					this.search_field[0].readOnly = true;
					this.container.addClass("chosen-container-single-nosearch");
				} else {
					this.search_field[0].readOnly = false;
					this.container.removeClass("chosen-container-single-nosearch");
				}
			}
			this.update_results_content(this.results_option_build({
				first: true
			}));
			this.search_field_disabled();
			this.show_search_field_default();
			this.search_field_scale();
			return this.parsing = false;
		};

		Chosen.prototype.result_do_highlight = function(el) {
			var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
			if (el.length) {
				this.result_clear_highlight();
				this.result_highlight = el;
				this.result_highlight.addClass("highlighted");
				maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
				visible_top = this.search_results.scrollTop();
				visible_bottom = maxHeight + visible_top;
				high_top = this.result_highlight.position().top + this.search_results.scrollTop();
				high_bottom = high_top + this.result_highlight.outerHeight();
				if (high_bottom >= visible_bottom) {
					return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
				} else if (high_top < visible_top) {
					return this.search_results.scrollTop(high_top);
				}
			}
		};

		Chosen.prototype.result_clear_highlight = function() {
			if (this.result_highlight) {
				this.result_highlight.removeClass("highlighted");
			}
			return this.result_highlight = null;
		};

		Chosen.prototype.results_show = function() {
			if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
				this.form_field_jq.trigger("chosen:maxselected", {
					chosen: this
				});
				return false;
			}
			this.container.addClass("chosen-with-drop");
			this.results_showing = true;
			this.search_field.focus();
			this.search_field.val(this.search_field.val());
			this.winnow_results();
			return this.form_field_jq.trigger("chosen:showing_dropdown", {
				chosen: this
			});
		};

		Chosen.prototype.update_results_content = function(content) {
			return this.search_results.html(content);
		};

		Chosen.prototype.results_hide = function() {
			if (this.results_showing) {
				this.result_clear_highlight();
				this.container.removeClass("chosen-with-drop");
				this.form_field_jq.trigger("chosen:hiding_dropdown", {
					chosen: this
				});
			}
			return this.results_showing = false;
		};

		Chosen.prototype.set_tab_index = function(el) {
			var ti;
			if (this.form_field.tabIndex) {
				ti = this.form_field.tabIndex;
				this.form_field.tabIndex = -1;
				return this.search_field[0].tabIndex = ti;
			}
		};

		Chosen.prototype.set_label_behavior = function() {
			var _this = this;
			this.form_field_label = this.form_field_jq.parents("label");
			if (!this.form_field_label.length && this.form_field.id.length) {
				this.form_field_label = $("label[for='" + this.form_field.id + "']");
			}
			if (this.form_field_label.length > 0) {
				return this.form_field_label.bind('click.chosen', function(evt) {
					if (_this.is_multiple) {
						return _this.container_mousedown(evt);
					} else {
						return _this.activate_field();
					}
				});
			}
		};

		Chosen.prototype.show_search_field_default = function() {
			if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
				this.search_field.val(this.default_text);
				return this.search_field.addClass("default");
			} else {
				this.search_field.val("");
				return this.search_field.removeClass("default");
			}
		};

		Chosen.prototype.search_results_mouseup = function(evt) {
			var target;
			target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
			if (target.length) {
				this.result_highlight = target;
				this.result_select(evt);
				return this.search_field.focus();
			}
		};

		Chosen.prototype.search_results_mouseover = function(evt) {
			var target;
			target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
			if (target) {
				return this.result_do_highlight(target);
			}
		};

		Chosen.prototype.search_results_mouseout = function(evt) {
			if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
				return this.result_clear_highlight();
			}
		};

		Chosen.prototype.choice_build = function(item) {
			var choice, close_link,
				_this = this;
			choice = $('<li />', {
				"class": "search-choice"
			}).html("<span>" + item.html + "</span>");
			if (item.disabled) {
				choice.addClass('search-choice-disabled');
			} else {
				close_link = $('<a />', {
					"class": 'search-choice-close',
					'data-option-array-index': item.array_index
				});
				close_link.bind('click.chosen', function(evt) {
					return _this.choice_destroy_link_click(evt);
				});
				choice.append(close_link);
			}
			return this.search_container.before(choice);
		};

		Chosen.prototype.choice_destroy_link_click = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			if (!this.is_disabled) {
				return this.choice_destroy($(evt.target));
			}
		};

		Chosen.prototype.choice_destroy = function(link) {
			if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
				this.show_search_field_default();
				if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
					this.results_hide();
				}
				link.parents('li').first().remove();
				return this.search_field_scale();
			}
		};

		Chosen.prototype.results_reset = function() {
			this.reset_single_select_options();
			this.form_field.options[0].selected = true;
			this.single_set_selected_text();
			this.show_search_field_default();
			this.results_reset_cleanup();
			this.form_field_jq.trigger("change");
			if (this.active_field) {
				return this.results_hide();
			}
		};

		Chosen.prototype.results_reset_cleanup = function() {
			this.current_selectedIndex = this.form_field.selectedIndex;
			return this.selected_item.find("abbr").remove();
		};

		Chosen.prototype.result_select = function(evt) {
			var high, item;
			if (this.result_highlight) {
				high = this.result_highlight;
				this.result_clear_highlight();
				if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
					this.form_field_jq.trigger("chosen:maxselected", {
						chosen: this
					});
					return false;
				}
				if (this.is_multiple) {
					high.removeClass("active-result");
				} else {
					this.reset_single_select_options();
				}
				item = this.results_data[high[0].getAttribute("data-option-array-index")];
				item.selected = true;
				this.form_field.options[item.options_index].selected = true;
				this.selected_option_count = null;
				if (this.is_multiple) {
					this.choice_build(item);
				} else {
					this.single_set_selected_text(item.text);
				}
				if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
					this.results_hide();
				}
				this.search_field.val("");
				if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
					this.form_field_jq.trigger("change", {
						'selected': this.form_field.options[item.options_index].value
					});
				}
				this.current_selectedIndex = this.form_field.selectedIndex;
				return this.search_field_scale();
			}
		};

		Chosen.prototype.single_set_selected_text = function(text) {
			if (text == null) {
				text = this.default_text;
			}
			if (text === this.default_text) {
				this.selected_item.addClass("chosen-default");
			} else {
				this.single_deselect_control_build();
				this.selected_item.removeClass("chosen-default");
			}
			return this.selected_item.find("span").text(text);
		};

		Chosen.prototype.result_deselect = function(pos) {
			var result_data;
			result_data = this.results_data[pos];
			if (!this.form_field.options[result_data.options_index].disabled) {
				result_data.selected = false;
				this.form_field.options[result_data.options_index].selected = false;
				this.selected_option_count = null;
				this.result_clear_highlight();
				if (this.results_showing) {
					this.winnow_results();
				}
				this.form_field_jq.trigger("change", {
					deselected: this.form_field.options[result_data.options_index].value
				});
				this.search_field_scale();
				return true;
			} else {
				return false;
			}
		};

		Chosen.prototype.single_deselect_control_build = function() {
			if (!this.allow_single_deselect) {
				return;
			}
			if (!this.selected_item.find("abbr").length) {
				this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
			}
			return this.selected_item.addClass("chosen-single-with-deselect");
		};

		Chosen.prototype.get_search_text = function() {
			if (this.search_field.val() === this.default_text) {
				return "";
			} else {
				return $('<div/>').text($.trim(this.search_field.val())).html();
			}
		};

		Chosen.prototype.winnow_results_set_highlight = function() {
			var do_high, selected_results;
			selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
			do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
			if (do_high != null) {
				return this.result_do_highlight(do_high);
			}
		};

		Chosen.prototype.no_results = function(terms) {
			var no_results_html;
			no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
			no_results_html.find("span").first().html(terms);
			this.search_results.append(no_results_html);
			return this.form_field_jq.trigger("chosen:no_results", {
				chosen: this
			});
		};

		Chosen.prototype.no_results_clear = function() {
			return this.search_results.find(".no-results").remove();
		};

		Chosen.prototype.keydown_arrow = function() {
			var next_sib;
			if (this.results_showing && this.result_highlight) {
				next_sib = this.result_highlight.nextAll("li.active-result").first();
				if (next_sib) {
					return this.result_do_highlight(next_sib);
				}
			} else {
				return this.results_show();
			}
		};

		Chosen.prototype.keyup_arrow = function() {
			var prev_sibs;
			if (!this.results_showing && !this.is_multiple) {
				return this.results_show();
			} else if (this.result_highlight) {
				prev_sibs = this.result_highlight.prevAll("li.active-result");
				if (prev_sibs.length) {
					return this.result_do_highlight(prev_sibs.first());
				} else {
					if (this.choices_count() > 0) {
						this.results_hide();
					}
					return this.result_clear_highlight();
				}
			}
		};

		Chosen.prototype.keydown_backstroke = function() {
			var next_available_destroy;
			if (this.pending_backstroke) {
				this.choice_destroy(this.pending_backstroke.find("a").first());
				return this.clear_backstroke();
			} else {
				next_available_destroy = this.search_container.siblings("li.search-choice").last();
				if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
					this.pending_backstroke = next_available_destroy;
					if (this.single_backstroke_delete) {
						return this.keydown_backstroke();
					} else {
						return this.pending_backstroke.addClass("search-choice-focus");
					}
				}
			}
		};

		Chosen.prototype.clear_backstroke = function() {
			if (this.pending_backstroke) {
				this.pending_backstroke.removeClass("search-choice-focus");
			}
			return this.pending_backstroke = null;
		};

		Chosen.prototype.keydown_checker = function(evt) {
			var stroke, _ref1;
			stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
			this.search_field_scale();
			if (stroke !== 8 && this.pending_backstroke) {
				this.clear_backstroke();
			}
			switch (stroke) {
				case 8:
					this.backstroke_length = this.search_field.val().length;
					break;
				case 9:
					if (this.results_showing && !this.is_multiple) {
						this.result_select(evt);
					}
					this.mouse_on_container = false;
					break;
				case 13:
					evt.preventDefault();
					break;
				case 38:
					evt.preventDefault();
					this.keyup_arrow();
					break;
				case 40:
					evt.preventDefault();
					this.keydown_arrow();
					break;
			}
		};

		Chosen.prototype.search_field_scale = function() {
			var div, f_width, h, style, style_block, styles, w, _i, _len;
			if (this.is_multiple) {
				h = 0;
				w = 0;
				style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
				styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
				for (_i = 0, _len = styles.length; _i < _len; _i++) {
					style = styles[_i];
					style_block += style + ":" + this.search_field.css(style) + ";";
				}
				div = $('<div />', {
					'style': style_block
				});
				div.text(this.search_field.val());
				$('body').append(div);
				w = div.width() + 25;
				div.remove();
				f_width = this.container.outerWidth();
				if (w > f_width - 10) {
					w = f_width - 10;
				}
				return this.search_field.css({
					'width': w + 'px'
				});
			}
		};

		return Chosen;

	})(AbstractChosen);

}).call(this);
