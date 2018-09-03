;(function(){
	$(function(){
		$(document).on('mouseenter','.js-portfolio-tag', function(){
				var $that = $(this),
				    css = {},
				    data = $that.data();
				
				if(data['tagBackgroundHover'])
				{
					css.background = data['tagBackgroundHover'];
				}
				if(data['tagColorHover'])
				{
					css.color = data['tagColorHover'];
				}
				$that.css(css);
				
				var $img = $that.children('img');
				$img.data('originSrc', $img.attr('src'));
				$img.attr('src',$img.data('hoverSrc'));
			}).on('mouseleave','.js-portfolio-tag', function(){
				var $that = $(this),
				    css = {
					    background:'',
					    color     :''
				    },
				    data  = $that.data();
				
				if(data['tagBackground'])
				{
					css.background = data['tagBackground'];
				}
				if(data['tagColor'])
				{
					css.color = data['tagColor'];
				}
				$that.css(css);
				
				var $img = $that.children('img');
				$img.attr('src', $img.data('originSrc'));
			}
		);
		$('.js-portfolio-tag').each(function(){
			var img = new Image();
			img.style.display = 'none';
			img.src = $(this).children('img').data('hoverSrc');
			$(this).append(img);
		});
	});
})();
