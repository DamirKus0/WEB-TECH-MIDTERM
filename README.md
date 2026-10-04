# Micro-Loan Platform — Midterm Project

Учебный адаптивный сайт по `Micro_Loan_Midterm_TZ_Wireframes_v3.pptx`.
Стек: semantic HTML5, CSS3 и Bootstrap 5.3.3 через CDN. JavaScript, SVG,
backend и базы данных не используются.

## Текущий этап

Участник 2: готова страница `loans.html` (Borrower Dashboard).
Следующий этап после commit пользователя — `loan-details.html`.
Страницы `index.html`, `apply.html`, `success.html` относятся к участнику 1.
Ссылки на ещё не созданные страницы сохраняют пути, заданные в ТЗ.

## Запуск

Откройте `loans.html` в браузере. Для загрузки Bootstrap нужен интернет.
Также можно запустить локальный сервер из папки проекта:

```sh
python3 -m http.server 8000
```

Откройте `http://localhost:8000/loans.html`.

## Структура

```text
loans.html       — Borrower Dashboard
css/style.css    — общие стили сайта
README.md        — описание и запуск
```

## Что демонстрирует Dashboard

- Semantic HTML: header, nav, main, section, article, aside, footer.
- Flexbox: шапка, навигация и общий вертикальный layout страницы.
- CSS Grid: три верхние карточки; на планшете две колонки, на телефоне одна.
- Bootstrap Grid: `.row`, `.col-12`, `.col-md-6`, `.col-lg-4` для My Loans.
- Bootstrap: карточки, кнопки, форма, alert, spacing и text utilities.
- Positioning: `position: relative` у блока калькулятора.
- Собственные media queries: `max-width: 768px` и `max-width: 576px`.
- Доступность: связанные label/input, последовательные заголовки,
  обозначение текущей страницы и видимый keyboard focus.

## Демо-данные и переходы

ML001: $1,000, 5% annual simple interest, 12 месяцев, Approved.
Выдача: 2026-01-15; первый платёж: 2026-02-15;
следующий демонстрационный платёж: 2026-05-15, $87.50;
окончание срока: 2027-01-15 (явно заданное в ТЗ исключение для года).
Это фиксированный учебный пример, даты не меняются вместе с текущей датой.

Модель: `monthly = [P × (1 + 0.05 × months / 12)] / months`.
Для $1,000 и 12 месяцев результат $87.50. Калькулятор показывает его
статически: кнопка Calculate не выполняет расчёт.

- View Application / ML001 View Details → `loan-details.html`.
- Make Payment → `loan-details.html#payment-demo`.
- Edit Profile → постоянно видимый `#profile-demo` на Dashboard.
- ML002: $500, Pending; View Details отключена до approval.
- Privacy Policy / Terms of Service → секции `#privacy` / `#terms`
  в `loan-details.html`.

## Работа с Git и публикация

Одна страница — один commit, который выполняет сам участник.
Для Dashboard: `feat: add borrower dashboard`.

После объединения всех пяти страниц можно опубликовать проект через
GitHub Pages: Settings → Pages → Deploy from a branch → выбрать ветку
с готовыми страницами и папку `/ (root)` → Save.
Текущий этап ещё не опубликован.
