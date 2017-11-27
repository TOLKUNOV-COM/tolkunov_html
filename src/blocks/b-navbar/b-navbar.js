$(function () {
    $(document).on('click', '.b-navbar .navbar-toggle.collapsed', function () {
        $('body').addClass('modal-open');
        $($(this).data('target')).addClass('in');
    });
    $(document).on('click', '.b-navbar .navbar-toggle:not(.collapsed)', function () {
        $('body').removeClass('modal-open');
        $($(this).data('target')).removeClass('in');
    });
});
