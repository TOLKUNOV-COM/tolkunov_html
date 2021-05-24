$(function () {
    $(document).on('click', '.b-copy-button', function () {
        let successText = 'Скопировано';
        let defaultText = 'Скопировать';

        let $self = $(this);

        function copy() {
            let input = $('<input type="text">').val(location.href);

            input.appendTo('body');

            input.show().select();
            document.execCommand("copy");
            input.remove();

            $self.html(successText);

            setTimeout(() => {
                $self.html(defaultText);
            }, 1400);
        }

        copy();
    });
});
