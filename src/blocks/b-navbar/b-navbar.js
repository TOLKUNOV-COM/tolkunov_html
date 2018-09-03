$(function () {
    $(document).on('click', '.b-navbar .b-navbar__burger.b-navbar__burger_expanded', function () {
        $(this).removeClass('b-navbar__burger_expanded');
        $('body').removeClass('modal-open');
        $($(this).data('target-selector')).removeClass('b-navbar__outer_expanded');
    }).on('click', '.b-navbar .b-navbar__burger:not(.b-navbar__burger_expanded)', function () {
        $(this).addClass('b-navbar__burger_expanded');
        $('body').addClass('modal-open');
        $($(this).data('target-selector')).addClass('b-navbar__outer_expanded');
    });
});
