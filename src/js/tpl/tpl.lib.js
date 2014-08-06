(function ($, window) {
	IX.ns("Hualala");
	var TemplateList = new IX.IListManager();
	var tpl_site_toptip = [
		'<div id="site_toptip_{{id}}" class="site-toptip alert alert-{{type}} fade in">',
			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>',
			'<p>{{msg}}</p>',
		'</div>'
	].join('');
	TemplateList.register('tpl_site_toptip', tpl_site_toptip);

	var TplLib = function () {
		return {
			register : function (key, tpl) {
				if (!TemplateList.hasKey(key)) {
					TemplateList.register(key, tpl);
				} else {
					throw("This key has registed!!!");
				}
			},
			get : function (key) {
				if (!TemplateList.hasKey(key)) {
					throw("There are no template that is named " + key);
				} else {
					return TemplateList.getByKeys([key])[0];
				}
			}
		};
	};

	Hualala.TplLib = new TplLib();
})(jQuery, window);