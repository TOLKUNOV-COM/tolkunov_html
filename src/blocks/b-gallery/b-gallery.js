$(function () {
    $(".b-gallery__item").fancybox({
        type: 'image',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: 0,
        margin: [45, 0, 100, 0],
        fitToView: true,
        nextClick: true,
        //helpers: {
        //    thumbs: {
        //        width: 50,
        //        height: 50
        //    }
        //}
        beforeLoad: function () {
            if ($(window).width() < 768) {
                var url = $(this.element).attr('href');

                window.open(url, '_self');

                return false;
            }

            return true;
        }
    });
});
