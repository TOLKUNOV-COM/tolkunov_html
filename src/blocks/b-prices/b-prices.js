$(function () {
    $('.b-prices__link').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        fitToView: false
    });
});

$(function () {
    $('[data-toggle="popover"]').popover({
        html: true,
        placement: 'top',
        trigger: 'hover',
    })
})