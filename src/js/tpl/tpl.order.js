(function ($, window) {
	IX.ns("Hualala");
	var TplLib = Hualala.TplLib;
	var tpl_order_subnav = [
		'<div class="navbar-collapse collapse" id="order_navbar">',
			'<ul class="nav nav-justified nav-pills">',
				'{{#each items}}',
				'<li class="{{active}} {{disabled}}">',
					'<a href="{{path}}" data-page-type="{{name}}">{{label}}</a>',
				'</li>',
				'{{/each}}',
			'</ul>',
		'</div>'
	].join('');
	TplLib.register('tpl_order_subnav', tpl_order_subnav);

})(jQuery, window);