# Implementation Plan

- [x] 1. Подготовка конфигурационных файлов





  - Создать `.env.example` с новыми переменными `APP_BASE_URL` и `CONTRACTS_API_URL`
  - Создать документацию `CONFIG.md` с описанием всех конфигурационных параметров
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 2. Обновить фронтенд JavaScript модули





  - [x] 2.1 Обновить `site/api.js`


    - Заменить захардкоженные `SUPABASE_URL` и `SUPABASE_ANON_KEY` на `window.APP_CONFIG.SUPABASE_URL` и `window.APP_CONFIG.SUPABASE_ANON_KEY`
    - Добавить проверку наличия `window.APP_CONFIG`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2_

  - [x] 2.2 Обновить `site/admin_support.js`


    - Заменить захардкоженные Supabase константы на `window.APP_CONFIG`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2_

  - [x] 2.3 Обновить `site/stats.js`


    - Заменить захардкоженные Supabase константы на `window.APP_CONFIG`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2_

  - [x] 2.4 Обновить `site/support-chat.js`


    - Изменить чтение из `global.SUPABASE_URL` на `window.APP_CONFIG.SUPABASE_URL`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2_

- [x] 3. Обновить фронтенд HTML файлы





  - [x] 3.1 Обновить `site/stats.html`


    - Заменить встроенные константы Supabase на `window.APP_CONFIG`
    - Убедиться, что `config.js` загружается перед этим скриптом
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_

  - [x] 3.2 Обновить `site/profile.html`


    - Заменить встроенные константы Supabase на `window.APP_CONFIG`
    - Заменить 5 использований `CONTRACTS_API_URL` на `window.APP_CONFIG.CONTRACTS_API_URL`
    - Добавить `<script src="config.js"></script>` если отсутствует
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_

  - [x] 3.3 Обновить `site/recover.html`


    - Заменить встроенные константы Supabase на `window.APP_CONFIG`
    - Добавить `<script src="config.js"></script>` если отсутствует
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_


  - [x] 3.4 Обновить `site/admin.html`

    - Заменить захардкоженный Yandex Maps API ключ в `<script src>` на динамическую загрузку через JavaScript с использованием `window.APP_CONFIG.YANDEX_MAPS_API_KEY`
    - Заменить захардкоженный `pdfServerUrl` в `admin.js` на `window.APP_CONFIG.CONTRACTS_API_URL`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_


  - [x] 3.5 Обновить `site/investor_map.html`

    - Заменить захардкоженный Yandex Maps API ключ в `<script src>` на динамическую загрузку через JavaScript с использованием `window.APP_CONFIG.YANDEX_MAPS_API_KEY`
    - Добавить `<script src="config.js"></script>` если отсутствует
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_

  - [x] 3.6 Обновить `site/index.html`


    - Заменить захардкоженный Supabase URL в `<link rel="preconnect">` на динамическое добавление через JavaScript с использованием `window.APP_CONFIG.SUPABASE_URL`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_

- [x] 4. Обновить бэкенд API файлы




  - [x] 4.1 Добавить переменные окружения в `.env`


    - Добавить `APP_BASE_URL=https://go-go-b-ike.vercel.app`
    - Добавить `CONTRACTS_API_URL=https://gogobikedogovor.onrender.com`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1, 6.2, 6.3, 6.4_

  - [x] 4.2 Обновить `api/payments.js`


    - Заменить 4 захардкоженных Vercel URL на `process.env.APP_BASE_URL`
    - Добавить проверку наличия `process.env.APP_BASE_URL` с понятным сообщением об ошибке
    - Добавить fallback значение для обратной совместимости
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_


  - [x] 4.3 Обновить `api/admin.js`

    - Заменить 1 захардкоженный Vercel URL на `process.env.APP_BASE_URL`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_

- [x] 5. Обновить Python бота




  - [x] 5.1 Добавить переменную окружения в `.env`


    - Добавить `APP_BASE_URL=https://go-go-b-ike.vercel.app`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 6.4_

  - [x] 5.2 Обновить `bot.py`


    - Добавить чтение `APP_BASE_URL` из переменных окружения
    - Заменить 3 захардкоженных URL на использование `APP_BASE_URL`
    - Добавить проверку наличия переменной с критической ошибкой при отсутствии
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.2_

- [x] 6. Обновить документацию







  - [x] 6.1 Создать `CONFIG.md`

    - Описать все конфигурационные параметры фронтенда
    - Описать все переменные окружения бэкенда
    - Описать все переменные окружения Python бота
    - Указать обязательные и опциональные параметры
    - Добавить примеры для разных окружений (dev, staging, production)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Обновить `ocr-worker/LOCAL_SETUP.md`


    - Заменить примеры URL на переменные окружения
    - _Requirements: 4.1, 4.2_

  - [x] 6.3 Обновить `ocr-worker/README.md`


    - Заменить примеры URL на переменные окружения
    - _Requirements: 4.1, 4.2_

  - [x] 6.4 Обновить `USER_WORKER_GUIDE.md`


    - Заменить примеры URL на переменные окружения
    - _Requirements: 4.1, 4.2_


  - [x] 6.5 Обновить `BIKE-RETURN-PROCESS.md`

    - Заменить примеры URL на переменные окружения
    - _Requirements: 4.1, 4.2_

- [ ] 7. Тестирование
  - [ ] 7.1 Протестировать фронтенд
    - Открыть каждую обновленную страницу и проверить отсутствие ошибок в консоли
    - Проверить работу всех API запросов
    - Проверить работу Yandex Maps на всех страницах
    - Изменить URL в `config.js` и убедиться, что изменения применяются везде
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 7.2 Протестировать бэкенд
    - Запустить API локально с тестовыми переменными окружения
    - Проверить редиректы после оплаты
    - Проверить формирование всех URL
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 7.3 Протестировать Python бота
    - Запустить бота с тестовыми переменными окружения
    - Проверить все API запросы
    - Проверить регистрацию пользователя
    - Проверить обработку отсутствия переменной окружения
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 7.4 Интеграционное тестирование
    - Протестировать полный flow регистрации пользователя
    - Протестировать полный flow аренды велосипеда
    - Протестировать полный flow оплаты
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
