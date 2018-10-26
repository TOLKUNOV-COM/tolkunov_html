$(function () {
    $('.b-review_video .b-review__link').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [168, 0, 100, 0],
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

    $('.b-review_image .b-review__link').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [168, 0, 100, 0],
        fitToView: false,
        beforeLoad: function () {
            if ($(window).width() < 900) {
                var url = $(this.element).data('url');

                window.open(url, '_self');

                return false;
            }

            return true;
        }
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
});
