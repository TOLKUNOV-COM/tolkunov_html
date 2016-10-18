$(function () {

    function initMasonry() {
        $('.b-reviews__list').masonry({
            itemSelector: '.b-reviews__item',
            columnWidth: 340
        });
    }

    $(".b-reviews__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).load();
    });
});
