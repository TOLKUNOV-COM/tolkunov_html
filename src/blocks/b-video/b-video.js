/**
 * Universal Video Player Component
 * Handles Plyr video player initialization and destruction
 * Provides global methods: window.initPlayers(selector) and window.destroyPlayers(selector)
 */
$(function () {

    // Store Plyr instances by unique IDs
    var plyrInstances = {};
    var instanceCounter = 0;

    /**
     * Initialize Plyr players
     * @param {string} selector - CSS selector for video elements (default: '.plyr-js')
     */
    function initPlayers(selector) {
        selector = selector || '.plyr-js';

        // Берём значение, если оно есть, или дефолт для дев-среды
        var mainAssets = (window.mainAssets || '');

        $(selector).each(function () {
            var videoElement = this;
            var $video = $(videoElement);

            // Пропускаем уже инициализированные плееры
            if ($video.data('plyr-instance-id')) {
                console.log('Plyr already initialized for element:', videoElement);
                return;
            }

            // Создаем уникальный ID для инстанса
            var instanceId = 'plyr-instance-' + (++instanceCounter);

            // Инициализируем Plyr
            var player = new Plyr(videoElement, {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                invertTime: true,
                keyboard: { focused: true, global: false },
                tooltips: false,
                autoplay: false,
                hideControls: false,
                iconUrl: mainAssets + '/assets/vendor/plyr/dist/plyr.svg',
            });

            // Сохраняем инстанс
            plyrInstances[instanceId] = player;
            $video.data('plyr-instance-id', instanceId);

            player.on('ready', function () {
                console.log('Plyr ready:', instanceId);
            });

            player.on('error', function (event) {
                console.error('Plyr error:', event.detail);
            });
        });

        console.log('Plyr players initialized for selector:', selector);
    }

    /**
     * Destroy Plyr players
     * @param {string} selector - CSS selector for video elements (default: '.plyr-js')
     */
    function destroyPlayers(selector) {
        selector = selector || '.plyr-js';

        $(selector).each(function () {
            var $video = $(this);
            var instanceId = $video.data('plyr-instance-id');

            if (instanceId && plyrInstances[instanceId]) {
                // Уничтожаем Plyr инстанс
                plyrInstances[instanceId].destroy();
                delete plyrInstances[instanceId];
                $video.removeData('plyr-instance-id');

                console.log('Plyr destroyed:', instanceId);
            }
        });

        console.log('Plyr players destroyed for selector:', selector);
    }

    // Экспортируем методы в window для глобального доступа
    window.initPlayers = initPlayers;
    window.destroyPlayers = destroyPlayers;

    // Инициализируем плееры при загрузке страницы
    initPlayers();

    console.log('Video player component initialized');
});
