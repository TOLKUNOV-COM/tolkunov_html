var loadReviews = function (cb) {
    function initMasonry(cb) {
        var $grid = $('.b-reviews__list').masonry({
            itemSelector: '.b-reviews__item',
            columnWidth: 320,
            gutter: 45,
            fitWidth: true,
            // no transitions
            transitionDuration: 0,
            initLayout: false
        });

        // bind event
        $grid.masonry('on', 'layoutComplete', function () {
            cb && cb();
        });

        // trigger initial layout
        $grid.masonry();
    }

    function loadSprite(src) {
        var deferred = $.Deferred();
        var sprite = new Image();
        sprite.onload = function () {
            deferred.resolve();
        };
        sprite.src = src;
        return deferred.promise();
    }

    var loaders = [];

    $('.b-reviews__list img').each(function () {
        loaders.push(loadSprite($(this).attr('src')));
    });

    $.when.apply(null, loaders).done(function () {
        //$(this).closest('.b-reviews__item').fadeIn();

        initMasonry(cb);
    });

    //$(".b-reviews__list img").one("load", function () {
    //    //$(this).closest('.b-reviews__item').fadeIn();
    //
    //    initMasonry();
    //}).each(function () {
    //    if (this.complete) $(this).trigger('load');
    //});

    if (!$('.b-reviews__list img').length) {
        initMasonry();
    }
};

$(function () {
    loadReviews();
});
