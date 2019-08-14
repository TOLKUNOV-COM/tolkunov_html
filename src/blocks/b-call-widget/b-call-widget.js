$(function () {
    $('.b-call-widget__button').on('click', function () {
        if (!$('.b-call-widget').hasClass('b-call-widget__collapsed')) {
            setTimeout(function () {
                $('.b-call-widget__content').css('display', 'none');
            }, 500);
        } else {
            $('.b-call-widget__content').css('display', 'block');
        }

        setTimeout(function () {
            $('.b-call-widget').toggleClass('b-call-widget__collapsed');
        }, 1);
    });
});
