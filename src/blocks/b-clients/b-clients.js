var loadClients = function (cb) {
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

    $('.b-clients__list img').each(function () {
        loaders.push(loadSprite($(this).attr('src')));
    });

    $.when.apply(null, loaders).done(function () {
        $('.b-clients__item').addClass('b-clients__item_loaded');

        cb && cb();
    });

    $(".b-clients__list img").one("load", function () {
        $(this).closest('.b-clients__item').addClass('b-clients__item_loaded');
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });

    window.lazyLoadingImages();
};

$(function () {
    loadClients();
});
