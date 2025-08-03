$(function () {
    $('.contact-switcher__item').on('click', function () {
        // Проверяем, не активен ли уже этот таб
        if ($(this).attr('data-active') === 'true') {
            return; // Выходим, если таб уже активен
        }

        // Снимаем активность со всех переключателей
        $('.contact-switcher__item').attr('data-active', 'false');

        // Активируем выбранный переключатель
        $(this).attr('data-active', 'true');

        // Получаем целевой контакт
        const targetContact = $(this).data('target');

        // Скрываем все блоки контактов
        $('.contact-block').attr('data-active', 'false');

        $(`[data-contact="${targetContact}"]`).attr('data-active', 'true');
    });
});
