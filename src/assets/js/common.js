$.fn.preload = function () {
    this.each(function () {
        $('<img/>')[0].src = this;
    });
}

$(function () {
    $('.js-fancybox-video').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        helpers: {
            media: {}
        }
    });
    $('.js-fancybox-inline').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        fitToView: false
    });
});
