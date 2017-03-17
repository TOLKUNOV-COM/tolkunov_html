$(function () {
    function getSize(nBytes) {
        var sOutput = nBytes + " байт";
        // optional code for multiples approximation
        for (var aMultiples = ["кб", "мб", "гб", "Тб", "Пб", "Еб"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            sOutput = nApprox.toFixed(2) + " " + aMultiples[nMultiple];
        }
        // end of optional code
        return sOutput;
    }

    $(document).on('change', '.b-form-upload input[type=file]', function () {
        $list = $(this).closest('.b-form-upload').prev();

        if (this.files.length) {
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];

                var e = $('<div>').addClass('b-form-files__item');

                $('<div>').addClass('b-form-files__name').text(file.name).appendTo(e);
                $('<div>').addClass('b-form-files__size').text(getSize(file.size)).appendTo(e);
                $('<div>').addClass('b-form-files__delete').appendTo(e);

                e.appendTo($list);
            }
        }

        var baseId = $(this).data('id');
        var i = 0;
        var id = baseId + '_' + i;

        while ($('#' + id).length) {
            i++;
            id = baseId + '_' + i;
        }

        $('<input type="file"/>')
            .attr('multiple', 'multiple')
            .attr('name', $(this).attr('name'))
            .attr('id', id)
            .attr('data-id', baseId)
            .insertAfter($(this));
    });

    $(document).on('click', '.b-form-files__delete', function () {
        $(this).closest('.b-form-files__item').addClass('hidden');
    });
});
