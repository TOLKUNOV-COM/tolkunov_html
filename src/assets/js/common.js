$.fn.preload = function () {
    this.each(function () {
        $('<img/>')[0].src = this;
    });
}

$(function () {
    $('.js-fancybox-video').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        helpers: {
            media: {}
        },
        beforeLoad: function () {
            if ($(window).width() < 768) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        }
    });

    $('.js-fancybox-inline').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        fitToView: false
    });
});
