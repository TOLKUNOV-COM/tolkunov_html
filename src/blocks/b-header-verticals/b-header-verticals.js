$(document).ready(function() {
    // Инициализируем каждый header verticals swiper отдельно
    $('.header-verticals-swiper').each(function() {
        const $container = $(this);
        let headerVerticalsSwiper = null;
        let isInitialized = false; // флаг однократной инициализации
        
        function initHeaderVerticalsSwiper() {
            if ($(window).width() < 1024 && (!headerVerticalsSwiper || headerVerticalsSwiper.destroyed)) {
                headerVerticalsSwiper = new Swiper($container.find('.swiper-container')[0], {
                    slidesPerView: 'auto',
                    freeMode: {
                        enabled: true,
                        momentum: true,
                        momentumRatio: 0.6,
                        momentumBounce: false,
                        sticky: false
                    },
                    spaceBetween: 0,
                    grabCursor: true,
                    resistanceRatio: 0.85,
                    // Отключаем все навигационные элементы для чистого free mode
                    navigation: false,
                    pagination: false,
                    scrollbar: false,
                    // Настройки для оптимизации производительности
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    // Настройки для корректной работы touch-событий
                    allowTouchMove: true,
                    preventClicks: false,
                    preventClicksPropagation: false,
                    simulateTouch: true,
                    touchStartPreventDefault: false,
                    touchMoveStopPropagation: true,
                    // Настройки для активных состояний на touch устройствах
                    touchEventsTarget: 'wrapper'
                });
                
                isInitialized = true;
            }
        }
        
        function destroyHeaderVerticalsSwiper() {
            if (headerVerticalsSwiper && !headerVerticalsSwiper.destroyed) {
                headerVerticalsSwiper.destroy(true, true);
                headerVerticalsSwiper = null;
            }
        }
        
        // Слушаем глобальное событие первого открытия header для инициализации
        $(document).on('header:open:end', function() {
            if (!isInitialized && $(window).width() < 1024) {
                initHeaderVerticalsSwiper();
            }
        });
        
        // Обработка изменения размера окна (только после первой инициализации)
        $(window).on('resize', function() {
            if (isInitialized) {
                if ($(window).width() < 1024) {
                    initHeaderVerticalsSwiper();
                } else {
                    destroyHeaderVerticalsSwiper();
                }
            }
        });
    });
});
