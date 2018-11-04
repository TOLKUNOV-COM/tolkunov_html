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
        margin: [45, 0, 100, 0],
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
        margin: [45, 0, 100, 0],
        fitToView: false
    });

    $('.b-portfolio-item__scroll').scrollbar();
});

function fixFancyboxArrows() {
    $(".fancybox-overlay").on('scroll', function () {
        $('.fancybox-nav span').css({top: ($('.fancybox-overlay').scrollTop() + 355) + 'px'});
    });
}
