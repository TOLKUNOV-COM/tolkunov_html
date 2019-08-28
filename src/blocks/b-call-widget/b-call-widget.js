function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

$(function () {
    /* When iframe is loaded */
    $('#callbackFrame').ready(function () {
        setTimeout(function () {
            $('.b-call-widget').addClass('b-call-widget_state_ready');
            $('.b-call-widget__content').css('display', 'none');
            $('.b-call-widget__overlay').css('display', 'none');
        }, 1);
    });

    if (!isMobileDevice()) {
        $('.b-call-widget').addClass('b-call-widget_without-overlay');
    }
});

$(function () {
    $('.b-call-widget__button').on('click', function () {
        if (!$('.b-call-widget').hasClass('b-call-widget__collapsed')) {
            setTimeout(function () {
                $('.b-call-widget__content, .b-call-widget__overlay').css('display', 'none');
            }, 500);
        } else {
            $('.b-call-widget__content, .b-call-widget__overlay').css('display', 'block');
        }

        setTimeout(function () {
            $('.b-call-widget').toggleClass('b-call-widget__collapsed');
        }, 1);
    });
});
