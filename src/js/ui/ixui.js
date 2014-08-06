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

	Hualala.UI.PopoverMsgTip = PopoverMsgTip;
	Hualala.UI.TopTip = TopTip;
})(jQuery, window);