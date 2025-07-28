# Руководство по разработке

## Миграция Gulp 3 → Gulp 4

### Выполненные изменения

**Дата миграции:** Декабрь 2024  
**Причина:** Обновление с устаревшего Gulp 3 на актуальный Gulp 4

### Основные изменения в архитектуре

#### 1. Обновление зависимостей
- `gulp`: `3.*` → `^4.0.2`
- `del`: `^1.1.1` → `^6.1.1` (критически важно для работы с Gulp 4)

#### 2. Изменения в gulpfile.js

**Старый синтаксис Gulp 3:**
```javascript
gulp.task('clean', ['clean:css', 'clean:js'], function() {
  // задача с массивом зависимостей
});
```

**Новый синтаксис Gulp 4:**
```javascript
function cleanTask() {
  return del(['build/**/*']);
}

const clean = gulp.parallel(cleanCss, cleanJs);
gulp.task('clean', clean);
```

#### 3. Управление зависимостями задач

- **Последовательное выполнение:** `gulp.series(task1, task2, task3)`
- **Параллельное выполнение:** `gulp.parallel(task1, task2, task3)`
- **Комбинированное:** `gulp.series(clean, gulp.parallel(css, js, images))`

#### 4. Сигнализация завершения задач

В Gulp 4 все задачи должны явно сигнализировать о завершении:
- Возврат stream (как было)
- Возврат promise (новое)
- Вызов callback функции
- Использование async/await

### Структура build процесса

```
build
├── series(clean)
└── parallel(
    ├── series(cleanCssBootstrap → bootstrap)
    ├── series(cleanCssMy → lessTask)
    ├── series(cleanJs → js)
    ├── img
    ├── fonts
    └── templates
)
```

### Рабочие команды

- `npx gulp clean` - очистка build директории
- `npx gulp build` - полная сборка проекта (включая Tailwind)
- `npx gulp tailwind:main` - компиляция только Tailwind CSS
- `npx gulp` - команда по умолчанию (запускает build)
- `npx gulp watch` - watch режим с live reload
- `npx gulp --tasks` - список всех доступных задач

### Tailwind CSS конфигурация

- **Версия:** Tailwind v3.4.14 (стабильная, даунгрейд с v4)
- **Причина даунгрейда:** В Tailwind v4 нельзя отключить слой `base` (preflight), что конфликтует с существующими стилями
- **Настройки:** `preflight: false` - отключены базовые стили
- **Файлы:** 
  - `src/css/main.css` - исходник Tailwind
  - `build/assets/css/main.min.css` - скомпилированный CSS

### Производительность

- Время сборки: ~20-22 секунды
- Оптимизация изображений: экономия ~617KB (21%)
- Bootstrap CSS: 147KB → 118KB после минификации
- Common CSS: 325KB → 173KB после минификации

### Совместимость

Все основные задачи мигрированы и протестированы:
- ✅ Компиляция LESS
- ✅ Сборка JavaScript
- ✅ Оптимизация изображений
- ✅ Копирование шрифтов
- ✅ Компиляция Jade шаблонов
- ✅ Очистка build директории
- ✅ Bootstrap компиляция
- ✅ Tailwind CSS v3 (с отключенным preflight)

### Особенности проекта

#### Технологический стек
- **Шаблонизатор:** Jade
- **CSS препроцессор:** LESS + Bootstrap
- **Сборщик:** Gulp 4
- **Браузерная синхронизация:** BrowserSync

#### Структура проекта
- `src/blocks/` - BEM блоки (CSS + JS)
- `src/templates/` - Jade шаблоны
- `src/less/` - LESS стили
- `src/assets/` - статические ресурсы
- `build/` - собранный проект

#### Автогенерация блоков
Команда `npx gulp block -b имя-блока` создает:
- Директорию `src/blocks/b-имя-блока/`
- LESS файл с базовой структурой
- При флаге `-js` создает JS файл

### Рекомендации для разработки

1. **Всегда использовать npx:** `npx gulp` вместо глобального `gulp`
2. **Проверять задачи:** `npx gulp --tasks` для просмотра иерархии
3. **Watch режим:** `npx gulp watch` для разработки с live reload
4. **Clean перед релизом:** `npx gulp clean && npx gulp build` 