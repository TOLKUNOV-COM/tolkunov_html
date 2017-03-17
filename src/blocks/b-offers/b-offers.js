var loadOffers = function () {
    function initMasonry() {
        $('.b-offers__list').masonry({
            itemSelector: '.b-offers__item',
            columnWidth: 320,
            gutter: 20,
            fitWidth: true,
            // no transitions
            transitionDuration: 0
        });
    }

    $(".b-offers__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });

    initMasonry();
};

$(function () {
    loadOffers();
});
