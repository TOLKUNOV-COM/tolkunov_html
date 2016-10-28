$(function () {
    $('.b-vacancies__title').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.b-vacancies__item').toggleClass('b-vacancies__item_collapsed');
    });
});
