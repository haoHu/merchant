(function ($, window) {
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
