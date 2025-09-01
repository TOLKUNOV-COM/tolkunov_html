// AJAX формы заявок
$(function () {
    // Функция для управления состоянием кнопок
    function setButtonState(form, state) {
        const buttons = form.find('button[type="submit"]');

        buttons.each(function() {
            const button = $(this);
            const buttonState = button.data('state');

            if (buttonState === state) {
                button.show();
            } else {
                button.hide();
            }
        });
    }

    // Обработчик для всех форм заявок
    $('#request-order-form, #request-pr-form, #request-hr-form').on('submit', function(e) {
        e.preventDefault();

        const form = $(this);
        const formId = form.attr('id');

        // Очищаем предыдущие ошибки
        form.find('.error').removeClass('error');

        // Показываем состояние загрузки
        setButtonState(form, 'loading');

        // Получаем URL действия из формы
        const actionUrl = form.attr('action');

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Успех - показываем состояние завершено
                    setButtonState(form, 'success');

                    // Очищаем форму и возвращаем к исходному состоянию через некоторое время
                    setTimeout(function() {
                        form[0].reset();
                        setButtonState(form, 'default');
                    }, 5000);
                } else {
                    // Ошибки валидации
                    if (response.errors) {
                        // Получаем название модели из formId
                        let modelName = '';
                        switch(formId) {
                            case 'request-order-form':
                                modelName = 'RequestOrderForm';
                                break;
                            case 'request-pr-form':
                                modelName = 'RequestPrForm';
                                break;
                            case 'request-hr-form':
                                modelName = 'RequestHrForm';
                                break;
                        }

                        // Показываем ошибки для каждого поля
                        let firstErrorField = null;

                        $.each(response.errors, function(fieldName, messages) {
                            let fieldSelector = '';
                            let field = null;

                            // Специальная обработка для полей формы заказа
                            if (formId === 'request-order-form') {
                                if (fieldName === 'tags') {
                                    fieldSelector = 'input[name="tags[]"]';
                                    field = form.find(fieldSelector).first(); // Берем первый чекбокс для подсвечивания группы
                                } else if (fieldName === 'budget') {
                                    fieldSelector = 'input[name="budget"]';
                                    field = form.find(fieldSelector).first(); // Берем первую радиокнопку для подсвечивания группы
                                } else {
                                    fieldSelector = `input[name="${modelName}[${fieldName}]"], textarea[name="${modelName}[${fieldName}]"], select[name="${modelName}[${fieldName}]"]`;
                                    field = form.find(fieldSelector);
                                }
                            } else {
                                // Стандартная обработка для остальных форм
                                fieldSelector = `input[name="${modelName}[${fieldName}]"], textarea[name="${modelName}[${fieldName}]"], select[name="${modelName}[${fieldName}]"]`;
                                field = form.find(fieldSelector);
                            }

                            if (field && field.length > 0) {
                                // Добавляем класс error к полю
                                field.addClass('error');

                                // Добавляем класс error к родительскому .form-row если есть
                                const formRow = field.closest('.form-row');
                                if (formRow.length > 0) {
                                    formRow.addClass('error');
                                }

                                // Запоминаем первое поле с ошибкой для фокуса
                                if (!firstErrorField) {
                                    // Для фокуса берем поле, которое можно сфокусировать
                                    if (field.is('input[type="text"], input[type="email"], textarea')) {
                                        firstErrorField = field;
                                    } else if (fieldName === 'tags' || fieldName === 'budget') {
                                        // Для чекбоксов и радиокнопок берем первый элемент
                                        firstErrorField = field.first();
                                    }
                                }
                            }
                        });

                        // Устанавливаем фокус на первое поле с ошибкой
                        if (firstErrorField && firstErrorField.length > 0) {
                            setTimeout(function() {
                                firstErrorField.focus();
                            }, 100);
                        }
                    }

                    // Возвращаем кнопку в исходное состояние
                    setButtonState(form, 'default');
                }
            },
            error: function() {
                // Ошибка сети или сервера
                alert('Произошла ошибка при отправке формы. Попробуйте еще раз.');
                setButtonState(form, 'default');
            }
        });
    });
});
