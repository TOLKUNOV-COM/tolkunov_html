var loadCases = function (cb) {
    $('.b-cases__list').each(function () {
        let itemsCount = $(this).find('.b-cases__item').length;

        let mod2 = itemsCount % 2;
        let mod3 = itemsCount % 3;

        $(this).addClass('b-cases__list_mod_2_' + mod2);
        $(this).addClass('b-cases__list_mod_3_' + mod3);
    });

    cb && cb();

    loadCasesListVideo();
};

var loadCasesListVideo = function () {
    $('.js-cases-cover-video').each(function () {
        // Check for already loaded
        if ($(this).next('video').length) {
            return false;
        }

        var src = $(this).data('src');

        var $video = $('<video>')
            .attr('src', src)
            .attr('preload', 'auto')
            .attr('playsinline', 'playsinline')
            .addClass('b-cases__video')
            .hide();

        $video[0].preload = 'auto';
        $video[0].muted = true;
        $video[0].loop = true;
        $video[0].play();

        const onPlayed = function () {
            $video[0].currentTime = 0;
            $video.show();
            $video[0].removeEventListener('canplaythrough', onPlayed);
        };

        $video[0].addEventListener('canplaythrough', onPlayed);

        $($video).insertAfter($(this));
    });
};

window.addEventListener('load', function () {
    loadCases();
});
