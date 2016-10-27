$(function () {
    function initMasonry() {
        $('.b-blog__list').masonry({
            itemSelector: '.b-blog__item',
            columnWidth: 356
        });
    }

    initMasonry();

    $(".b-blog__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).load();
    });
});
