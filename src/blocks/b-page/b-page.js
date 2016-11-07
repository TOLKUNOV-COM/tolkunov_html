$(function () {
    $('.b-page__anchor').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var hash = this.hash.slice(1);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 800, function () {
                    location.hash = hash;
                });
                return false;
            }
        }
    });
});
