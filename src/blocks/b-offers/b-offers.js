$(function () {
    function initMasonry() {
        $('.b-offers__list').masonry({
            itemSelector: '.b-offers__item',
            columnWidth: 356
        });
    }

    initMasonry();
    
    $(".b-offers__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).load();
    });
});
