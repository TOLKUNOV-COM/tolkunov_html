$(function () {
    $('.contact-switcher__item').on('click', function () {
        $('.contact-switcher__item').attr('data-active', 'false');

        $(this).attr('data-active', 'true');
    })
});
