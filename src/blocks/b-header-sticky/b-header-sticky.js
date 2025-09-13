$(document).ready(function() {
    // Инициализируем каждый header отдельно для sticky логики
    $('.header').each(function() {
        const $header = $(this);
        const $container = $header.find('.header__container');
        
        // Переменные для отслеживания скролла
        let lastScrollTop = 0;
        let isHidden = false;
        let currentDirection = null; // 'up' или 'down'
        let accumulatedScroll = 0; // накопленные пиксели в текущем направлении
        const scrollThreshold = 5; // минимальный порог для регистрации скролла
        const actionThreshold = 150; // 2 прокрутки по 100px = 200px для действия
        
        // Переменные для отслеживания мыши (только десктоп)
        let mouseY = 0;
        let showReason = null; // 'scroll' или 'mouse' - причина показа шапки
        const mouseThreshold = 100; // граница для показа шапки при наведении мыши
        const isDesktop = () => !('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        // Показываем header
        function showHeader(reason = 'scroll') {
            if (isHidden) {
                $container.removeClass('header_hidden');
                isHidden = false;
                showReason = reason; // запоминаем причину показа
            }
        }
        
        // Скрываем header
        function hideHeader(reason = 'scroll') {
            if (!isHidden) {
                $container.addClass('header_hidden');
                isHidden = true;
                showReason = null;
            }
        }
        
        // Обработчик скролла
        function handleScroll() {
            // Не обрабатываем скролл если меню открыто
            if ($header.attr('data-open') === 'true') {
                return;
            }
            
            const scrollTop = $(window).scrollTop();
            const scrollDelta = Math.abs(scrollTop - lastScrollTop);
            
            // Пропускаем если изменение меньше порога
            if (scrollDelta < scrollThreshold) {
                return;
            }
            
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            
            // Если направление изменилось - сбрасываем накопитель
            if (currentDirection !== scrollDirection) {
                currentDirection = scrollDirection;
                accumulatedScroll = 0;
            }
            
            // Накапливаем прокрутку в текущем направлении
            accumulatedScroll += scrollDelta;
            
            // Проверяем, достигли ли порога в 150px (2 прокрутки)
            if (accumulatedScroll >= actionThreshold) {
                if (scrollDirection === 'down') {
                    // 2 прокрутки вниз - скрываем header
                    hideHeader('scroll');
                } else if (scrollDirection === 'up') {
                    // 2 прокрутки вверх - показываем header
                    showHeader('scroll');
                }
                
                // Сбрасываем накопитель после действия
                accumulatedScroll = 0;
            }
            
            lastScrollTop = scrollTop;
        }
        
        // Обработчик движения мыши (только для десктопа)
        function handleMouseMove(event) {
            if (!isDesktop() || $header.attr('data-open') === 'true') {
                return;
            }
            
            mouseY = event.clientY;
            
            if (mouseY <= mouseThreshold) {
                // Курсор в верхних 150px - показываем шапку
                if (isHidden) {
                    showHeader('mouse');
                }
            } else {
                // Курсор ушел дальше 150px - скрываем только если показано от мыши
                if (!isHidden && showReason === 'mouse') {
                    hideHeader('mouse');
                }
            }
        }
        
        // Слушаем изменения data-open атрибута
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-open') {
                    const isOpen = $header.attr('data-open') === 'true';
                    
                    if (isOpen) {
                        // Меню открыто - показываем header
                        showHeader('menu');
                    } else {
                        // Меню закрыто - восстанавливаем логику
                        setTimeout(() => {
                            handleScroll();
                        }, 100); // Небольшая задержка для корректной работы
                    }
                }
            });
        });
        
        observer.observe($header[0], {
            attributes: true,
            attributeFilter: ['data-open']
        });
        
        // Инициализация
        // Добавляем класс header_sticky постоянно для применения стилей
        $container.addClass('header_sticky');
        
        // Обработчик скролла с throttling
        let isScrolling = false;
        $(window).on('scroll', function() {
            if (!isScrolling) {
                requestAnimationFrame(function() {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        // Обработчик движения мыши для десктопа
        if (isDesktop()) {
            $(document).on('mousemove', handleMouseMove);
        }
        
        // Сбрасываем накопитель при изменении размера окна
        $(window).on('resize', function() {
            accumulatedScroll = 0;
            currentDirection = null;
            
            // Переключаем обработчик мыши в зависимости от размера экрана
            if (isDesktop()) {
                $(document).off('mousemove', handleMouseMove);
                $(document).on('mousemove', handleMouseMove);
            } else {
                $(document).off('mousemove', handleMouseMove);
            }
        });
        
        // Начальная проверка при загрузке
        handleScroll();
    });
});
