const reviewToggler = function () {
    const reviewTextMaxHeight = 400;

    $('.b-review__collapse:not(.b-review__collapse__collapsed)').each(function () {
        if ($(this).height() > reviewTextMaxHeight) {
            $(this).addClass('b-review__collapse__collapsed');
            $(this).next('.b-review__toggle').removeClass('hidden');
        }
    });

    $('.b-review__button').on('click', function (e) {
        e.preventDefault();

        var collapser = $(this).closest('.b-review').find('.b-review__collapse');
        var contentHeight = $(this).closest('.b-review').find('.b-review__text').height();

        if (collapser.hasClass('b-review__collapse__collapsed')) {
            collapser.css('max-height', contentHeight);

            setTimeout(function () {
                collapser.css('max-height', 'none');
            }, 200);
        } else {
            collapser.css('max-height', collapser.find('.b-review__text').height());
        }

        setTimeout(function () {
            collapser.toggleClass('b-review__collapse__collapsed');
        }, 1);

        // Toggle buttons after container slideDown.
        setTimeout(function () {
            collapser.next('.b-review__toggle').find('.b-review__button').toggleClass('hidden');
        }, 200);
    });
};

window.reviewToggler = reviewToggler;

$(function () {
    $('.b-review_video .b-review__link').fancybox({
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

    $('.b-review_image .b-review__link').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [45, 0, 100, 0],
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
