// AJAX формы заявок
$(function () {
    // Функция для управления состоянием кнопок
    function setButtonState(form, state) {
        const buttons = form.find('button[type="submit"]');

        buttons.each(function () {
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
    $('#request-order-form, #request-pr-form, #request-hr-form').on('submit', function (e) {
        e.preventDefault();

        const form = $(this);
        const formId = form.attr('id');

        // Очищаем предыдущие ошибки
        form.find('.error').removeClass('error');

        // Показываем состояние загрузки
        setButtonState(form, 'loading');

        // Выбрасываем событие начала отправки формы
        form.trigger('form:submit', { formId: formId });

        // Получаем URL действия из формы
        const actionUrl = form.attr('action');

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Успех - показываем состояние завершено
                    setButtonState(form, 'success');

                    // Выбрасываем событие успешной отправки формы
                    form.trigger('form:success', { formId: formId, response: response });

                    // Очищаем форму и возвращаем к исходному состоянию через некоторое время
                    setTimeout(function () {
                        form[0].reset();
                        setButtonState(form, 'default');
                        
                        // Выбрасываем событие сброса формы
                        form.trigger('form:reset', { formId: formId });
                    }, 5000);
                } else {
                    // Ошибки валидации
                    if (response.errors) {
                        // Проверяем наличие ошибки reCAPTCHA и показываем через alert
                        if (response.errors.recaptchaToken) {
                            const recaptchaError = response.errors.recaptchaToken[0] || 'Проверка безопасности не пройдена';
                            alert(recaptchaError);
                        }

                        // Получаем название модели из formId
                        let modelName = '';
                        switch (formId) {
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

                        $.each(response.errors, function (fieldName, messages) {
                            let fieldSelector = '';
                            let field = null;

                            // Стандартная обработка для всех форм (теперь все поля используют одинаковую конвенцию)
                            if (fieldName === 'tags') {
                                // Для массива tags
                                fieldSelector = `input[name="${modelName}[${fieldName}][]"]`;
                                field = form.find(fieldSelector).first(); // Берем первый чекбокс для подсвечивания группы
                            } else {
                                // Для обычных полей
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
                            setTimeout(function () {
                                firstErrorField.focus();
                            }, 100);
                        }
                    }

                    // Выбрасываем событие ошибки валидации
                    form.trigger('form:validation-error', { formId: formId, errors: response.errors });

                    // Возвращаем кнопку в исходное состояние
                    setButtonState(form, 'default');
                }
            },
            error: function (xhr, status, error) {
                // Ошибка сети или сервера
                alert('Произошла ошибка при отправке формы. Попробуйте еще раз.');
                
                // Выбрасываем событие ошибки сети
                form.trigger('form:network-error', { formId: formId, xhr: xhr, status: status, error: error });
                
                setButtonState(form, 'default');
            }
        });
    });
});
