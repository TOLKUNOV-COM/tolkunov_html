var loadCases = function (cb) {
    // $('.b-cases__list').each(function () {
    //     let itemsCount = $(this).find('.b-cases__item').length;
    //
    //     let mod2 = itemsCount % 2;
    //     let mod3 = itemsCount % 3;
    //
    //     $(this).addClass('b-cases__list_mod_2_' + mod2);
    //     $(this).addClass('b-cases__list_mod_3_' + mod3);
    // });

    cb && cb();

    loadCasesListVideo();
    window.lazyLoadingImages();
};

var loadCasesListVideo = function () {
    $('.js-cases-cover-video:visible').each(function () {
        // Check for already loaded
        if ($(this).next('video').length) {
            return true;
        }

        let ratio = $(this).data('ratio');

        var $video = $('<video>')
            .attr('preload', 'auto')
            .attr('playsinline', 'playsinline')
            .addClass('b-cases__video')
            .addClass('b-cases__video_' + ratio)
            .hide();

        let src = $(this).data('src');
        let sources = $(this).data('sources');

        if (src) {
            $video.attr('src', src);
        }

        if (sources) {
            for (let source of sources) {
                $('<source>').attr(source).appendTo($video);
            }
        }

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

/**
 * Embed
 */

const loadEmbedCaseCompilation = function () {
    $('embed-case-compilation').each(function () {
        let id = $(this).data('id');

        if (!id) {
            return;
        }

        let url = '/cases-compilations/embed/' + id;
        console.log('URL: ' + url);

        $.get(url, {}, (content) => {
            $(this).after(content);

            setTimeout(() => {
                loadCases();
            }, 1);
        });
    });
}

window.addEventListener('load', function () {
    loadCases();
    loadEmbedCaseCompilation();
});

$(window).on('resize', function () {
    loadCases();
});
