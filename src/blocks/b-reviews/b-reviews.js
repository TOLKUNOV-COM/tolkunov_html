var reviewsBaseUrl = location.href;
var reviewsBaseState = null;

$(function () {
    $('.b-reviews__item').fancybox({
        type: 'ajax',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: [0, 0, 0, 0],
        margin: [45, 0, 100, 0],
        fitToView: false,
        beforeLoad: function () {
            if ($(window).width() < 1080) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        },
        beforeShow: function () {
            var path = $.fancybox.current.href;

            var state = {action: 'reviewItem', path: path};
            var currentState = history.state;

            // Change URL in browser
            if (window.needChangeState) {
                if ($($.fancybox.current.element).closest('.fancybox-inner').length) {
                    history.replaceState(state, document.title, path);
                } else {
                    history.pushState(state, document.title, path);
                }
            }

            window.needChangeState = true;
        },
        afterShow: function () {
            $('.fancybox-close').appendTo('.fancybox-overlay');
            loadPortfolio();
        },
        beforeClose: function () {
            var currentstate = history.state;

            console.log('beforeClose', currentstate, history);

            if (window.previousTitle) {
                document.title = window.previousTitle;
                window.previousTitle = null;
            }

            if (currentstate && currentstate.action == 'reviewItem' && needChangeState) {
                history.pushState(reviewsBaseState, document.title, reviewsBaseUrl);
            }
        }
        //width: 1082
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
});

var loadReviews = function (cb) {
    function initMasonry(cb) {
        var $grid = $('.b-reviews__list').packery({
            itemSelector: '.b-reviews__item',
            columnWidth: '.b-reviews__item',
            gutter: '.b-reviews__gutter',
            // no transitions
            transitionDuration: 0,
            initLayout: false
        });

        // bind event
        $grid.packery('on', 'layoutComplete', function () {
            cb && cb();
        });

        // trigger initial layout
        $grid.packery();
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
        // loaders.push(loadSprite($(this).attr('src')));
        loadSprite($(this).attr('src')).done(function () {
            //$(this).closest('.b-reviews__item').fadeIn();
            $('.b-reviews__item').addClass('b-reviews__item_loaded');

            initMasonry(cb);
        });
    });

    // $.when.apply(null, loaders);

    $(".b-reviews__list img").one("load", function () {
        //$(this).closest('.b-reviews__item').fadeIn();
        $('.b-reviews__item').addClass('b-reviews__item_loaded');

        initMasonry();
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });

    // if (!$('.b-reviews__list img').length) {
        $('.b-reviews__item').addClass('b-reviews__item_loaded');
        initMasonry(cb);
    // }
};

$(function () {
    loadReviews();
});
