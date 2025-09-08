$(document).ready(function() {
    // Инициализируем каждый header отдельно
    $('.header').each(function() {
        const $header = $(this);
        const $toggle = $header.find('.header__toggle');
        const $container = $header.find('.header__container');
        
        // Локальное состояние для каждого экземпляра header
        let hoverTimeout = null;
        let closeTimeout = null;
        let isManuallyOpened = false;
        let isOpening = false;
        let openingTimeout = null;
        
        function openExtra() {
            $header.attr('data-open', 'true');
            setOpeningState(true);
        }
        
        function closeExtra() {
            $header.attr('data-open', 'false');
            isManuallyOpened = false;
            setOpeningState(false);
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
        
        function clearHoverTimeout() {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
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
            clearHoverTimeout();
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
        
        // Обработчик наведения на container
        $container.on('mouseenter', function() {
            // Очищаем таймер закрытия если он был установлен
            clearCloseTimeout();
            
            // Если секция уже открыта или находится в процессе opening, не делаем ничего
            if ($header.attr('data-open') === 'true' || isOpening) {
                return;
            }
            
            // Очищаем предыдущий таймер если есть
            clearHoverTimeout();
            
            // Устанавливаем задержку 500ms
            hoverTimeout = setTimeout(function() {
                // Дополнительная проверка перед открытием (на случай если состояние изменилось)
                if (!isOpening && $header.attr('data-open') !== 'true') {
                    openExtra();
                }
                hoverTimeout = null;
            }, 500);
        });
        
        // Обработчик ухода курсора из container
        $container.on('mouseleave', function() {
            // Очищаем таймер если курсор ушел до срабатывания
            clearHoverTimeout();
            
            // Автоматически закрываем только если секция не была открыта вручную
            // Устанавливаем задержку 600ms перед закрытием
            if (!isManuallyOpened && $header.attr('data-open') === 'true') {
                closeTimeout = setTimeout(function() {
                    // Дополнительная проверка что меню все еще открыто и не открыто вручную
                    if (!isManuallyOpened && $header.attr('data-open') === 'true') {
                        closeExtra();
                    }
                    closeTimeout = null;
                }, 600);
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
