$(function () {
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

    $.fancybox.transitions.myIn = function () {

        // Для того, чтобы не отображался горизонтальный скрол во время анимации. Нельзя задавать через css, т.к. на маленьких экранах не будет скрола, когда он нужен (ширина всплывающего окна ~1000px)
        $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'hidden');

        var current = F.current,
            effect = current.nextEffect,
            startPos = current.pos,
            endPos = {opacity: 1},
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
    }


    $.fancybox.transitions.myOut = function () {

        // Для того, чтобы не отображался горизонтальный скрол во время анимации. Нельзя задавать через css, т.к. на маленьких экранах не будет скрола, когда он нужен (ширина всплывающего окна ~1000px)
        $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'hidden');

        var previous = F.previous,
            effect = previous.prevEffect,
            endPos = {opacity: 1},
            direction = F.direction,
            distance = $(window).width();

        if (effect === 'elastic') {
            endPos[direction === 'down' || direction === 'up' ? 'top' : 'left'] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
        }

        previous.wrap.animate(endPos, {
            duration: effect === 'none' ? 0 : previous.prevSpeed,
            easing: previous.prevEasing,
            complete: function () {
                $('.fancybox-lock .fancybox-overlay').css('overflow-x', 'auto');
                $(this).trigger('onReset').remove();
            }
        });
    }

    $('.b-portfolio__item').fancybox({
        type: 'inline',
        //openEffect: 'fade',
        //closeEffect: 'none',
        //nextEffect: 'none',
        //prevEffect: 'none',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: [50, 0, 0, 0],
        margin: [74, 0, 100, 0],
        fitToView: false,
        //width: 1082
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
});
