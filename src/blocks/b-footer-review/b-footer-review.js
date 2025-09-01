$(document).ready(function() {
    const $container = $('.footer-review-container');
    const $refreshButton = $('.footer-review__refresh');
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
    
    function loadNewReview(url) {
        if (isLoading) return;
        
        setLoadingState(true);
        
        // Получаем ID текущего отзыва
        const $currentReview = $container.find('.footer-review').first();
        const currentId = $currentReview.attr('data-id');
        
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
            // Получаем все текущие отзывы
            const $oldReviews = $container.find('.footer-review');
            
            // Парсим новый HTML и добавляем необходимые классы
            const $newReview = $(html).attr('data-active', 'false');
            
            // Вставляем новый отзыв в контейнер (пока скрытый)
            $container.append($newReview);

            // Шаг 1: Скрываем старые отзывы
            $oldReviews.attr('data-active', 'false');
            
            // Шаг 2: Через 150ms (половина анимации) показываем новый отзыв
            setTimeout(() => {
                $newReview.attr('data-active', 'true');
            }, 150);
            
            // Шаг 3: Удаляем старые отзывы через полное время анимации (300ms)
            setTimeout(() => {
                $oldReviews.remove();
            }, 300);
        })
        .fail(function(xhr, status, error) {
            console.error('Ошибка загрузки нового отзыва:', error);
        })
        .always(function() {
            setLoadingState(false);
        });
    }
    
    // Обработчик кнопки обновления
    $refreshButton.on('click', function() {
        const refreshUrl = $(this).data('refresh-url');
        
        if (!refreshUrl) {
            console.error('Не указан URL для загрузки нового отзыва');
            return;
        }
        
        loadNewReview(refreshUrl);
    });
});