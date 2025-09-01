$(document).ready(function() {
    const $container = $('.footer-case-container');
    const $refreshButton = $('.footer-case__refresh');
    let isLoading = false;
    
    function setLoadingState(loading) {
        isLoading = loading;
        const $icon = $refreshButton.find('.icon-refresh');
        
        if (loading) {
            $refreshButton.prop('disabled', true);
            $icon.addClass('animate-spin');
        } else {
            $refreshButton.prop('disabled', false);
            $icon.removeClass('animate-spin');
        }
    }
    
    function loadNewCase(url) {
        if (isLoading) return;
        
        setLoadingState(true);
        
        // Получаем ID текущего кейса
        const $currentCase = $container.find('.footer-case').first();
        const currentId = $currentCase.attr('data-id');
        
        // Добавляем ID к URL если он найден
        let requestUrl = url;
        if (currentId) {
            const separator = url.includes('?') ? '&' : '?';
            requestUrl = url + separator + 'id=' + encodeURIComponent(currentId);
        }
        
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'html',
            timeout: 10000
        })
        .done(function(html) {
            // Получаем все текущие кейсы
            const $oldCases = $container.find('.footer-case');
            
            // Парсим новый HTML и устанавливаем data-active
            const $newCase = $(html).attr('data-active', 'false');
            
            // Вставляем новый кейс в контейнер (пока скрытый)
            $container.append($newCase);

            // Шаг 1: Скрываем старые кейсы
            $oldCases.attr('data-active', 'false');
            
            // Шаг 2: Через 150ms (половина анимации) показываем новый кейс
            setTimeout(() => {
                $newCase.attr('data-active', 'true');
            }, 150);
            
            // Шаг 3: Удаляем старые кейсы через полное время анимации (300ms)
            setTimeout(() => {
                $oldCases.remove();
            }, 300);
        })
        .fail(function(xhr, status, error) {
            console.error('Ошибка загрузки нового кейса:', error);
        })
        .always(function() {
            setLoadingState(false);
        });
    }
    
    // Обработчик кнопки обновления
    $refreshButton.on('click', function() {
        const refreshUrl = $(this).data('refresh-url');
        
        if (!refreshUrl) {
            console.error('Не указан URL для загрузки нового кейса');
            return;
        }
        
        loadNewCase(refreshUrl);
    });
});
