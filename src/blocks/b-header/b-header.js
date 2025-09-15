$(document).ready(function() {
    // Инициализируем каждый header отдельно
    $('.header').each(function() {
        const $header = $(this);
        const $toggle = $header.find('.header__toggle');
        const $container = $header.find('.header__container');
        
        // Локальное состояние для каждого экземпляра header
        let closeTimeout = null;
        let isManuallyOpened = false;
        let isOpening = false;
        let openingTimeout = null;
        
        function getScrollbarWidth() {
            // Вычисляем ширину скроллбара
            return window.innerWidth - document.documentElement.clientWidth;
        }
        
        function openExtra() {
            // Событие начала открытия
            $(document).trigger('header:open:start', { $header: $header });
            
            $header.attr('data-open', 'true');
            // Вычисляем ширину скроллбара и компенсируем её
            const scrollbarWidth = getScrollbarWidth();
            if (scrollbarWidth > 0) {
                $('body').css('padding-right', scrollbarWidth + 'px');
            }
            // Блокируем прокрутку страницы
            $('body').addClass('overflow-hidden');
            setOpeningState(true);
            
            // Событие завершения открытия (после небольшой задержки для CSS анимации)
            setTimeout(() => {
                $(document).trigger('header:open:end', { $header: $header });
            }, 300);
        }
        
        function closeExtra() {
            // Событие начала закрытия
            $(document).trigger('header:close:start', { $header: $header });
            
            $header.attr('data-open', 'false');
            // Разблокируем прокрутку страницы и убираем компенсацию
            $('body').removeClass('overflow-hidden').css('padding-right', '');
            isManuallyOpened = false;
            setOpeningState(false);
            
            // Событие завершения закрытия
            setTimeout(() => {
                $(document).trigger('header:close:end', { $header: $header });
            }, 300);
        }
        
        function setOpeningState(opening) {
            isOpening = opening;
            
            if (opening) {
                // Устанавливаем таймер завершения процесса opening
                if (openingTimeout) {
                    clearTimeout(openingTimeout);
                }
                openingTimeout = setTimeout(() => {
                    isOpening = false;
                    openingTimeout = null;
                }, 500);
            } else {
                // Сразу завершаем процесс opening при закрытии
                if (openingTimeout) {
                    clearTimeout(openingTimeout);
                    openingTimeout = null;
                }
                isOpening = false;
            }
        }
        
        function clearCloseTimeout() {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        }
        
        // Обработчик клика на кнопку toggle
        $toggle.on('click', function() {
            clearCloseTimeout();
            
            const isOpen = $header.attr('data-open') === 'true';
            
            if (isOpening && isOpen) {
                // Если меню в процессе автоматического открытия - подтверждаем как ручное открытие
                isManuallyOpened = true;
                return;
            }
            
            if (isOpen) {
                closeExtra();
            } else {
                openExtra();
                isManuallyOpened = true;
            }
        });
        
        // Обработчик клика на свободное место в header__main
        $header.find('.header__main').on('click', function(event) {
            const $target = $(event.target);
            
            // Исключаем клики по активным элементам (упрощенная проверка)
            if (
                $target.closest('.header__link, .header__logo, .header__button_main, .header__button_float, .header__toggle').length
            ) {
                return; // Не открываем/закрываем меню при клике на активные элементы
            }
            
            // Очищаем таймеры
            clearCloseTimeout();
            
            const isOpen = $header.attr('data-open') === 'true';
            
            // Toggle логика - открываем/закрываем при клике на свободное место
            if (isOpen) {
                closeExtra();
            } else {
                openExtra();
                isManuallyOpened = true;
            }
        });
        
        // Обработчик клика на overlay - закрываем меню
        $header.find('.header__overlay').on('click', function() {
            clearCloseTimeout();
            if ($header.attr('data-open') === 'true') {
                closeExtra();
            }
        });
    });
});
