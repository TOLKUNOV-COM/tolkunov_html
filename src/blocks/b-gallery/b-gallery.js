$(function () {
    $(".b-gallery__item").fancybox({
        type: 'image',
        nextMethod: 'myIn',
        prevMethod: 'myOut',
        padding: 0,
        margin: [74, 0, 0, 0],
        //fitToView: false,
        nextClick: true,
        //helpers: {
        //    thumbs: {
        //        width: 50,
        //        height: 50
        //    }
        //}
    });
});
