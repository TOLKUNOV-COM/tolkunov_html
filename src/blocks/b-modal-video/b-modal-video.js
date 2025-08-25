/**
 * Video Modal Component
 * Handles opening/closing video modals and Plyr video playback
 * Also manages intelligent video preloading based on visibility
 */
$(function () {

    // Store Plyr instances
    var plyrInstances = {};

    // Intersection Observer for video preloading
    var videoPreloadObserver;

    // Initialize video modals
    function initVideoModals() {
        // Initialize Plyr for all video players
        initPlyrPlayers();

        // Initialize video preloading observer
        initVideoPreloadObserver();

        // Initialize contact switching observer
        initContactSwitchingObserver();

        // Handle play button clicks
        $(document).on('click', '[data-modal="video"]', function (e) {
            e.preventDefault();

            var $button = $(this);
            var targetSelector = $button.data('target');

            if (!targetSelector) {
                console.error('Missing data-target attribute');
                return;
            }

            var $modal = $(targetSelector);
            if ($modal.length === 0) {
                console.error('Modal not found: ' + targetSelector);
                return;
            }

            openVideoModal($modal);
        });

        // Handle close button clicks
        $(document).on('click', '[data-close]', function (e) {
            e.preventDefault();
            var $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });

        // Handle backdrop clicks
        $(document).on('click', '.video-modal__backdrop', function (e) {
            e.preventDefault();
            var $modal = $(this).closest('.video-modal');
            closeVideoModal($modal);
        });

        // Handle ESC key
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                var $openModal = $('.video-modal[data-open="true"]');
                if ($openModal.length > 0) {
                    closeVideoModal($openModal);
                }
            }
        });
    }

    // Initialize Plyr players
    function initPlyrPlayers() {
        $('.video-modal__player.plyr-js').each(function () {
            var videoElement = this;
            var modalId = $(videoElement).closest('.video-modal').attr('id');

            if (!plyrInstances[modalId]) {
                var player = new Plyr(videoElement, {
                    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                    invertTime: true,
                    keyboard: { focused: true, global: false },
                    tooltips: false,
                    autoplay: false,
                    hideControls: false,
                    iconUrl: 'assets/vendor/plyr/dist/plyr.svg'
                });

                plyrInstances[modalId] = player;

                player.on('ready', function () {
                    console.log('Plyr ready for: ' + modalId);
                });

                player.on('error', function (event) {
                    console.error('Plyr error: ' + event.detail);
                });
            }
        });
    }

    // Open video modal
    function openVideoModal($modal) {
        var modalId = $modal.attr('id');
        var player = plyrInstances[modalId];

        if (!player) {
            console.error('Plyr instance not found for modal: ' + modalId);
            return;
        }

        // Show modal
        $modal.attr('data-open', 'true');

        // Prevent body scroll
        $('body').addClass('overflow-hidden');

        // Focus on modal for accessibility
        $modal.focus();

        // Auto-play video (sources already preloaded in HTML)
        var playPromise = player.play();

        if (playPromise !== undefined) {
            playPromise
                .then(function () {
                    console.log('Plyr autoplay started successfully for: ' + modalId);
                })
                .catch(function (error) {
                    console.log('Plyr autoplay blocked by browser: ' + error);
                    // Fallback: video will be available for manual play
                });
        }

        console.log('Video modal opened: ' + modalId);
    }

    // Close video modal
    function closeVideoModal($modal) {
        var modalId = $modal.attr('id');
        var player = plyrInstances[modalId];

        // Hide modal
        $modal.attr('data-open', 'false');

        // Stop video using Plyr API
        if (player) {
            player.pause();
            player.currentTime = 0;
            // No need to clear source - it stays preloaded
        }

        // Restore body scroll
        $('body').removeClass('overflow-hidden');

        // Убираем фокус с активного элемента
        if (document.activeElement) {
            document.activeElement.blur();
        }

        console.log('Video modal closed: ' + modalId);
    }

    // Initialize video preloading observer  
    function initVideoPreloadObserver() {
        if ('IntersectionObserver' in window) {
            videoPreloadObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var $button = $(entry.target);
                        var $contactBlock = $button.closest('[data-contact]');
                        var dataTarget = $button.data('target');

                        // Проверяем что кнопка в активном контакте
                        if (dataTarget && $contactBlock.attr('data-active') === 'true') {
                            $(dataTarget + ' video')[0].setAttribute('preload', 'metadata');
                            console.log('Preloading video for:', dataTarget);

                            // Отключаем наблюдение за этой кнопкой
                            videoPreloadObserver.unobserve(entry.target);
                        }
                    }
                });
            }, {
                threshold: 0.5 // Запускаем только когда 50% кнопки видно
            });

            // Наблюдаем за всеми кнопками play
            $('.contact-block__play').each(function () {
                videoPreloadObserver.observe(this);
            });
        }
    }

    // Initialize contact switching observer
    function initContactSwitchingObserver() {
        if ('MutationObserver' in window) {
            var contactObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-active') {
                        var target = mutation.target;
                        if (target.getAttribute('data-active') === 'true' && target.hasAttribute('data-contact')) {
                            // Контакт стал активным - сразу делаем preload
                            var $playButton = $(target).find('.contact-block__play');
                            if ($playButton.length > 0) {
                                var dataTarget = $playButton.data('target');
                                if (dataTarget) {
                                    $(dataTarget + ' video')[0].setAttribute('preload', 'metadata');
                                    console.log('Preloading video on contact switch for:', dataTarget);

                                    // Отключаем наблюдение за этой кнопкой в основном observer
                                    if (videoPreloadObserver) {
                                        videoPreloadObserver.unobserve($playButton[0]);
                                    }
                                }
                            }
                        }
                    }
                });
            });

            // Наблюдаем за всеми контакт-блоками
            $('.contact-block[data-contact]').each(function () {
                contactObserver.observe(this, {
                    attributes: true,
                    attributeFilter: ['data-active']
                });
            });
        }
    }

    // Initialize on DOM ready
    initVideoModals();

    console.log('Video modals initialized');
});
