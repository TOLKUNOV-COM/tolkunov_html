/**
 * Embed Video Component
 * Transforms <embed-video src="..."/> tags into video players and initializes them
 * Requires b-video.js (window.initPlayers) to be loaded
 */
$(function () {

    var embedCounter = 0;

    /**
     * Get video MIME type by file extension
     * @param {string} url - Video URL
     * @returns {string} MIME type
     */
    function getVideoType(url) {
        var extension = url.split('.').pop().toLowerCase().split('?')[0];
        var types = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo'
        };
        return types[extension] || 'video/mp4';
    }

    /**
     * Generate video player HTML
     * @param {string} videoSrc - Video source URL
     * @param {string} poster - Poster image URL (optional)
     * @param {string} playerId - Unique player ID
     * @returns {string} HTML string
     */
    function generatePlayerHTML(videoSrc, poster, playerId) {
        var posterAttr = poster ? ' data-poster="' + poster + '"' : '';
        var videoType = getVideoType(videoSrc);

        return '<div class="player">' +
            '<video id="' + playerId + '" playsinline controls' + posterAttr + ' preload="auto" class="plyr-js">' +
            '<source src="' + videoSrc + '" type="' + videoType + '"/>' +
            '</video>' +
            '</div>';
    }

    /**
     * Load and initialize embedded video players
     */
    function loadEmbedVideos() {
        $('embed-video').each(function () {
            var $embedTag = $(this);
            var src = $embedTag.attr('src') || $embedTag.data('src');
            var poster = $embedTag.attr('poster') || $embedTag.data('poster');
            var id = $embedTag.attr('id') || $embedTag.data('id');

            if (!src) {
                console.error('Missing src attribute for embed-video:', this);
                return;
            }

            // Генерируем уникальный ID, если не указан
            if (!id) {
                id = 'embed-player-' + (++embedCounter);
            }

            console.log('Creating embed video player:', id, src);

            // Генерируем HTML плеера
            var playerHTML = generatePlayerHTML(src, poster, id);

            // Заменяем embed-video тег на плеер
            $embedTag.replaceWith(playerHTML);
        });

        // Инициализируем Plyr для новых плееров
        setTimeout(function () {
            if (typeof window.initPlayers === 'function') {
                window.initPlayers();
            } else {
                console.error('window.initPlayers is not available. Make sure b-video.js is loaded.');
            }
        }, 1);
    }

    // Инициализируем при загрузке DOM
    loadEmbedVideos();

    // Экспортируем функцию в window для возможности повторного вызова
    window.loadEmbedVideos = loadEmbedVideos;

    console.log('Embed video component initialized');
});
