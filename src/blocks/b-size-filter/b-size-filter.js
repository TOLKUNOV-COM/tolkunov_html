$(function () {
    $('.b-size-filter__list').each(function () {
        if ($(this).height() > 92) {
            $(this).css('max-height', $('.b-size-filter').height());
            $(this).addClass('b-size-filter__list_collapsed');
            $(this).next('.b-size-filter__toggle').removeClass('hidden');
        }
    });

    $('.b-size-filter__toggle').on('click', function (e) {
        e.preventDefault();

        $(this).prev('.b-size-filter__list').toggleClass('b-size-filter__list_collapsed');
        $(this).find('.b-size-filter__toggle-text').toggleClass('hidden');
        $(this).blur(); // Leave focus from toggle link

        $('html, body').animate({
            scrollTop: $(".b-size-filter__list").offset().top
        }, 200);
    });
});
