$(function () {
    $('.b-blog-menu__item_search>.b-blog-menu__link').on('click', function (e) {
        e.preventDefault();

        $(this).next('.b-search-form').removeClass('hidden');
    });

    $('.b-search-form__close').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.b-search-form').addClass('hidden');
    });
});
