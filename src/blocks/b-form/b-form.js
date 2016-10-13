$(function () {
    $('.b-form__upload input[type=file]').on('change', function () {
        var input = this;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.b-form__preview-image').removeClass('hidden').css('background-image', 'url(' + e.target.result + ')');
            };

            reader.readAsDataURL(input.files[0]);
        }
    });

    $(document).on('click', '.b-form__preview-delete', function () {
        $(this).parents('.b-form__preview-image').addClass('hidden').css('background-image', '');
        $('.b-form__upload input[type=file]').val('');
    });
});
