$(function () {
    $('.contact-switcher__item').on('click', function () {
        // Снимаем активность со всех переключателей
        $('.contact-switcher__item').attr('data-active', 'false');
        
        // Активируем выбранный переключатель
        $(this).attr('data-active', 'true');
        
        // Получаем целевую форму из data-target
        const targetContact = $(this).data('target');
        
        // Скрываем все формы и отключаем pointer-events
        $('.contact-form')
            .removeClass('opacity-100 pointer-events-auto')
            .addClass('opacity-0 pointer-events-none');
        
        // Показываем нужную форму и включаем pointer-events
        $(`[data-contact="${targetContact}"]`)
            .removeClass('opacity-0 pointer-events-none')
            .addClass('opacity-100 pointer-events-auto');
    });
});
