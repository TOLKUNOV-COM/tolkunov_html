var portfolioBaseUrl = location.href;
var portfolioBaseState = null;
var needChangeState = true;

const checkPortfolioBackground = function () {
    // Find not loaded video in Portfolio item.
    var video = $('.b-portfolio-item__container:not(.b-portfolio-item_ready) .b-portfolio-item__bg');

    if (video.length) {
        console.log('There is a video in Portfolio header. Show it when ready.');

        let startPlaying = function () {
            $('.b-portfolio-item__container').addClass('b-portfolio-item_ready');

            $('.b-portfolio-item__background').fadeIn(300, function () {
                video[0].play();
            });
        };

        if (video[0].readyState === 4) {
            startPlaying();
        } else {
            video[0].addEventListener('canplaythrough', startPlaying);
        }
    } else {
        console.log('There is no video in Portfolio header.');
    }
};

const initPortfolioFancybox = function () {
    $('.b-portfolio__item').fancybox({
        type: 'ajax',
        openEasing: 'easeOutExpo',
        closeEasing: 'easeOutExpo',
        nextEasing: 'easeInOutQuint',
        prevEasing: 'easeInOutQuint',
        openSpeed: 250,
        closeSpeed: 250,
        nextSpeed: 200,
        prevSpeed: 200,
        //closeEffect: 'none',
        //nextEffect: 'none',
        //prevEffect: 'none',
        openMethod: 'myOpen',
        closeMethod: 'myClose',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: [0, 0, 0, 0],
        margin: [0, 0, 0, 0],
        // margin: [45, 0, 100, 0],
        fitToView: false,
        helpers: {
            overlay: {
                locked: true // Заблокировать фон за оверлеем
            }
        },
        beforeLoad: function () {
            function isMobileDevice() {
                return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
            }

            if ($(window).width() < 1080 || isMobileDevice()) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        },
        beforeShow: function () {
            var path = $.fancybox.current.href;

            var state = { action: 'portfolioItem', path: path };
            var currentState = history.state;

            console.log('beforeShow', state, history);

            // Change URL in browser
            if (needChangeState) {
                if ($($.fancybox.current.element).closest('.fancybox-inner').length) {
                    history.replaceState(state, document.title, path);
                } else {
                    history.pushState(state, document.title, path);
                }
            }
            needChangeState = true;

            checkPortfolioBackground();

            // Add custom overlay
            if (!$('.b-fancybox-overlay').length) {
                $('<div>')
                    .addClass('b-fancybox-overlay')
                    .hide()
                    .appendTo('body')
                    .fadeIn('fast')
                    .click(() => {
                        $.fancybox.close();
                    });
            }

            $('html').addClass('fancybox-margin').addClass('fancybox-lock');

            if ($('.fancybox-wrap').length && $('.fancybox-overlay').length) {
                $('.fancybox-overlay').append($('.fancybox-wrap'));
            }
        },
        afterShow: function () {
            if (typeof window.showIframe == "function") {
                setTimeout(showIframe, 1);
            }

            $('.fancybox-close').appendTo('.b-fancybox-overlay');
            $('.fancybox-close:eq(1)').remove();
        },
        beforeClose: function () {
            var currentstate = history.state;

            console.log('beforeClose', currentstate, history);

            if (window.previousTitle) {
                document.title = window.previousTitle;
                window.previousTitle = null;
            }

            if (currentstate && currentstate.action === 'portfolioItem' && needChangeState) {
                history.pushState(portfolioBaseState, document.title, portfolioBaseUrl);
            }

            $('html').removeClass('fancybox-margin').removeClass('fancybox-lock');
        },
        //width: 1082
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
}

const initPortfolioSlider = function () {
    var F = $.fancybox;
    var getScalar = function (orig, dim) {
            var value = parseInt(orig, 10) || 0;

            if (dim && isPercentage(orig)) {
                value = F.getViewport()[dim] / 100 * value;
            }

            return Math.ceil(value);
        },
        getValue = function (value, dim) {
            return getScalar(value, dim) + 'px';
        };

    $.fancybox.transitions.myOpen = function () {

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).height() * 0.8,
            field;

        startPos.opacity = 1;

        if (effect === 'elastic') {
            field = 'top';

            startPos[field] = getValue(getScalar(startPos[field]) + distance);
            endPos[field] = '-=' + distance + 'px';
        }

        // Workaround for http://bugs.jquery.com/ticket/12273
        if (effect === 'none') {
            F._afterZoomIn();
        } else {
            F.wrap.css(startPos).animate(endPos, {
                duration: current.openSpeed,
                easing: current.openEasing,
                complete: function () {
                    $('.fancybox-overlay').addClass('fancybox-overlay_bg_white');
                    F._afterZoomIn();
                }
            });
        }
    };

    $.fancybox.transitions.myClose = function () {

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).height(),
            field;

        startPos.opacity = 1;

        if (effect === 'elastic') {
            field = 'top';

            startPos[field] = getValue(getScalar(startPos[field]));
            endPos[field] = '+=' + distance + 'px';
        }

        // Workaround for http://bugs.jquery.com/ticket/12273
        if (effect === 'none') {
            F._afterZoomOut();
        } else {
            $('.fancybox-overlay').removeClass('fancybox-overlay_bg_white');

            // Remove custom overlay
            $('.b-fancybox-overlay').fadeOut({
                duration: 50,
                complete: function () {
                    $(this).remove();
                },
                easing: 'easeOutExpo'
            });

            F.wrap.css(startPos).animate(endPos, {
                duration: current.closeSpeed,
                easing: current.closeEasing,
                complete: function () {
                    F._afterZoomOut();
                }
            });
        }
    };

    $.fancybox.transitions.myIn = function () {

        // Для того, чтобы не отображался горизонтальный скрол во время анимации. Нельзя задавать через css, т.к. на маленьких экранах не будет скрола, когда он нужен (ширина всплывающего окна ~1000px)
        $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'hidden');

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).width(),
            field;

        startPos.opacity = 1;

        if (effect === 'elastic') {
            field = direction === 'down' || direction === 'up' ? 'top' : 'left';

            if (direction === 'down' || direction === 'right') {
                startPos[field] = getValue(getScalar(startPos[field]) - distance);
                endPos[field] = '+=' + distance + 'px';

            } else {
                startPos[field] = getValue(getScalar(startPos[field]) + distance);
                endPos[field] = '-=' + distance + 'px';
            }
        }

        // Workaround for http://bugs.jquery.com/ticket/12273
        if (effect === 'none') {
            F._afterZoomIn();

        } else {
            F.wrap.css(startPos).animate(endPos, {
                duration: current.nextSpeed,
                easing: current.nextEasing,
                complete: function () {
                    $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'auto');
                    F._afterZoomIn();
                }
            });
        }
    };

    $.fancybox.transitions.myOut = function () {

        // Для того, чтобы не отображался горизонтальный скрол во время анимации. Нельзя задавать через css, т.к. на маленьких экранах не будет скрола, когда он нужен (ширина всплывающего окна ~1000px)
        $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'hidden');

        var previous = F.previous,
            effect = previous.prevEffect,
            endPos = { opacity: 1 },
            direction = F.direction,
            distance = $(window).width();

        if (effect === 'elastic') {
            endPos[direction === 'down' || direction === 'up' ? 'top' : 'left'] = (direction === 'up' || direction === 'left' ? '-' : '+') + '=' + distance + 'px';
        }

        previous.wrap.animate(endPos, {
            duration: effect === 'none' ? 0 : previous.prevSpeed,
            easing: previous.prevEasing,
            complete: function () {
                $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'auto');
                $(this).trigger('onReset').remove();
            }
        });
    };

    initPortfolioFancybox();
};

$(initPortfolioSlider);

// Listen for history state changes
window.addEventListener('popstate', function (e) {
    var state = history.state;

    console.log('popstate', state, history);
    // back button pressed. close popup
    if (!state || state.action === 'popup') {
        if ($.fancybox.isOpened) {
            console.log("Fancybox opened. Let's close it.");
            $.fancybox.close();
        } else {
            console.log('There is no fancybox opened. Nothing to close.');

            return false;
        }
    } else {
        // Forward button pressed, reopen popup
        if (state.action === 'portfolioItem') {
            window.needChangeState = false;
            console.log('dont need state change');

            var link = $('a.b-portfolio__item[href=\"' + state.path + '\"]');

            if (link.length) {
                link.trigger('click');
            } else {
                console.error('!!! There is no with href "' + state.path + '". Need to navigate manually.');
            }
        }

        // Forward button pressed, reopen popup
        if (state.action === 'reviewItem') {
            window.needChangeState = false;
            console.log('dont need state change');

            var link = $('a.b-reviews__item[href=\"' + state.path + '\"]');

            if (link.length) {
                link.trigger('click');
            } else {
                console.error('!!! There is no with href "' + state.path + '". Need to navigate manually.');
            }
        }
    }
});

var loadPortfolio = function (cb) {
    $('.b-portfolio__list').each(function () {
        var $grid = $(this).packery({
            itemSelector: '.b-portfolio__item',
            horizontal: $(this).hasClass('b-portfolio__list_horizontal'),
            // use element for option
            //columnWidth: '.grid-sizer',
            //percentPosition: true
            //columnWidth: $(window).width() < 670 ? 160 : 224,
            //columnWidth: 224,
            //gutter: 20,
            //fitWidth: true,
            // no transitions
            stagger: 0,
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

        loadPortfolioListVideo();
        window.lazyLoadingImages();
    });

    $(".b-portfolio__list img").one("load", function () {
        $(this).closest('.b-portfolio__item').addClass('b-portfolio__item_loaded');
    }).each(function () {
        if (this.complete) $(this).trigger('load');
    });
};

var loadPortfolioListVideo = function () {
    $('.js-portfolio-video').each(function () {
        // Check for already loaded
        // if ($(this).parent().find('video').length) {
        //     return false;
        // }

        var $video = $('<video>')
            .attr('preload', 'auto')
            .attr('playsinline', 'playsinline')
            .addClass('b-portfolio__video')
            .hide();

        let src = $(this).data('src');
        let sources = $(this).data('sources');

        if (src) {
            $video.attr('src', src);
        }

        if (sources) {
            for (let source of sources) {
                $('<source>').attr(source).appendTo($video);
            }
        }

        $video[0].preload = 'auto';
        $video[0].muted = true;
        $video[0].loop = true;
        $video[0].play();

        const onPlayed = function () {
            $video[0].currentTime = 0;
            $video.show();
            $video[0].removeEventListener('canplaythrough', onPlayed);
        };

        $video[0].addEventListener('canplaythrough', onPlayed);

        $($video).insertAfter($(this));

        $(this).remove();
    });
};

document.addEventListener('DOMContentLoaded', function () {
    loadPortfolio();
    checkPortfolioBackground();
});
