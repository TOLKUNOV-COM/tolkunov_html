$(function () {
    $('.b-vacancies__title').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.b-vacancies__item').toggleClass('b-vacancies__item_collapsed');
    });

    $('.b-vacancies__button').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        fitToView: false
    });
});
