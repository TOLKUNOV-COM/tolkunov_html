$(function () {
    $('.b-review_video .b-review__link').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        helpers: {
            media: {}
        }
    });
    $('.b-review_image .b-review__link').fancybox({
        type: 'inline',
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        margin: [74, 0, 0, 0],
        fitToView: false,
        //tpl: {
        //    image: '<div class="b-review-image"><div class="b-review-image__container"><img class="" src="{href}" alt="" /></div></div>'
        //}
    });
});
