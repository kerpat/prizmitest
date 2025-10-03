# Design Document

## Overview

Централизация конфигурации проекта GoGoBike будет реализована через три уровня:
1. **Фронтенд** - единый файл `site/config.js` с глобальным объектом `window.APP_CONFIG`
2. **Бэкенд** - переменные окружения через `.env` файл и `process.env`
3. **Python бот** - переменные окружения через `.env` файл

Все захардкоженные значения будут заменены на ссылки на централизованную конфигурацию.

## Architecture

### Фронтенд (site/)

```
site/
├── config.js              # Единый источник конфигурации (уже существует)
├── config.example.js      # Шаблон для разработчиков (уже существует)
├── api.js                 # Обновить: использовать window.APP_CONFIG
├── admin_support.js       # Обновить: использовать window.APP_CONFIG
├── stats.js               # Обновить: использовать window.APP_CONFIG
├── support-chat.js        # Обновить: использовать window.APP_CONFIG
├── stats.html             # Обновить: использовать window.APP_CONFIG
├── profile.html           # Обновить: использовать window.APP_CONFIG
├── recover.html           # Обновить: использовать window.APP_CONFIG
├── map.html               # Уже использует ✅
├── admin.html             # Обновить: Yandex Maps script src
├── investor_map.html      # Обновить: Yandex Maps script src
└── index.html             # Обновить: preconnect link
```

### Бэкенд (api/)

```
.env                       # Добавить APP_BASE_URL
api/
├── payments.js            # Заменить 4 захардкоженных URL на process.env.APP_BASE_URL
└── admin.js               # Заменить 1 захардкоженный URL на process.env.APP_BASE_URL
```

### Python бот

```
.env                       # Добавить APP_BASE_URL
bot.py                     # Заменить 3 захардкоженных URL на os.getenv('APP_BASE_URL')
```

## Components and Interfaces

### 1. Фронтенд конфигурация (window.APP_CONFIG)

**Текущая структура (config.js):**
```javascript
window.APP_CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://briulxpnjxlsgfgkqvfh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGci...',
  
  // Yandex Maps
  YANDEX_MAPS_API_KEY: 'a32fae3e-06f9-4231-87a0-f225b5d7a04a',
  
  // Base URL of the main Vercel deployment
  APP_BASE_URL: 'https://go-go-b-ike.vercel.app',
  
  // URL for the separate server handling contracts (PDF generation)
  CONTRACTS_API_URL: 'https://gogobikedogovor.onrender.com'
};
```

**Использование:**
```javascript
// Вместо:
const SUPABASE_URL = 'https://briulxpnjxlsgfgkqvfh.supabase.co';

// Использовать:
const SUPABASE_URL = window.APP_CONFIG.SUPABASE_URL;
```

### 2. Бэкенд конфигурация (process.env)

**Добавить в .env:**
```env
# Existing variables
SUPABASE_URL=https://briulxpnjxlsgfgkqvfh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
TELEGRAM_BOT_TOKEN=8346957794:AAEkzWSX...
YOOKASSA_SHOP_ID=...
YOOKASSA_SECRET_KEY=...
GOOGLE_API_KEY=AIzaSyAUay...
INTERNAL_SECRET=MySuperSecretKeyForBikeAppOCR123!

# NEW: Add this
APP_BASE_URL=https://go-go-b-ike.vercel.app
CONTRACTS_API_URL=https://gogobikedogovor.onrender.com
```

**Использование в api/payments.js:**
```javascript
// Вместо:
successRedirectUrl = 'https://go-go-b-ike.vercel.app/?renewal_success=true';

// Использовать:
successRedirectUrl = `${process.env.APP_BASE_URL}/?renewal_success=true`;
```

### 3. Python бот конфигурация (os.getenv)

**Добавить в .env:**
```env
# Existing
TELEGRAM_BOT_TOKEN=8346957794:AAEkzWSX...
SUPABASE_URL=https://briulxpnjxlsgfgkqvfh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
GOOGLE_API_KEY=AIzaSyAUay...

# NEW: Add this
APP_BASE_URL=https://go-go-b-ike.vercel.app
```

**Использование в bot.py:**
```python
# Вместо:
WEBAPP_REGISTER_API = 'https://go-go-b-ike.vercel.app/api/telegram-register'
BOT_REGISTER_API = 'https://go-go-b-ike.vercel.app/api/auth'
WEB_APP_URL = 'https://go-go-b-ike.vercel.app'

# Использовать:
APP_BASE_URL = os.getenv('APP_BASE_URL', 'https://go-go-b-ike.vercel.app')
WEBAPP_REGISTER_API = f'{APP_BASE_URL}/api/telegram-register'
BOT_REGISTER_API = f'{APP_BASE_URL}/api/auth'
WEB_APP_URL = APP_BASE_URL
```

## Data Models

### Конфигурационный объект фронтенда

```typescript
interface AppConfig {
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
  // Yandex Maps
  YANDEX_MAPS_API_KEY: string;
  
  // Application URLs
  APP_BASE_URL: string;
  CONTRACTS_API_URL: string;
}
```

### Переменные окружения бэкенда

```typescript
interface BackendEnv {
  // Existing
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  TELEGRAM_BOT_TOKEN: string;
  YOOKASSA_SHOP_ID: string;
  YOOKASSA_SECRET_KEY: string;
  GOOGLE_API_KEY: string;
  INTERNAL_SECRET: string;
  
  // New
  APP_BASE_URL: string;
  CONTRACTS_API_URL: string;
}
```

## Error Handling

### Фронтенд

1. **Отсутствие config.js:**
   - Если `window.APP_CONFIG` не определен, показать понятное сообщение об ошибке
   - Добавить проверку в начало критичных файлов

```javascript
if (!window.APP_CONFIG) {
  console.error('ОШИБКА: config.js не загружен! Убедитесь, что <script src="config.js"></script> добавлен в HTML.');
  throw new Error('Configuration not loaded');
}
```

2. **Отсутствие параметра:**
   - Использовать fallback значения для некритичных параметров
   - Для критичных (Supabase) - выбросить ошибку

```javascript
const SUPABASE_URL = window.APP_CONFIG?.SUPABASE_URL;
if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL не настроен в config.js');
}
```

### Бэкенд

1. **Отсутствие переменной окружения:**
   - Проверять критичные переменные при запуске
   - Выводить понятное сообщение об ошибке

```javascript
if (!process.env.APP_BASE_URL) {
  console.error('КРИТИЧЕСКАЯ ОШИБКА: APP_BASE_URL не установлен в переменных окружения');
  throw new Error('APP_BASE_URL is required');
}
```

2. **Fallback значения:**
   - Для некритичных параметров использовать значения по умолчанию

```javascript
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://go-go-b-ike.vercel.app';
```

### Python бот

1. **Отсутствие переменной:**
   - Проверять при запуске
   - Не запускать бота, если критичные переменные отсутствуют

```python
APP_BASE_URL = os.getenv('APP_BASE_URL')
if not APP_BASE_URL:
    logger.critical("APP_BASE_URL не установлен в .env файле!")
    sys.exit(1)
```

## Testing Strategy

### Фронтенд

1. **Ручное тестирование:**
   - Открыть каждую страницу и проверить, что нет ошибок в консоли
   - Проверить, что все API запросы используют правильные URL
   - Проверить работу Yandex Maps на всех страницах

2. **Тестовые сценарии:**
   - Изменить URL в `config.js` и убедиться, что изменения применяются везде
   - Удалить `config.js` и убедиться, что появляется понятная ошибка

### Бэкенд

1. **Локальное тестирование:**
   - Запустить API локально с тестовыми переменными окружения
   - Проверить, что редиректы после оплаты работают корректно
   - Проверить, что все URL формируются правильно

2. **Staging тестирование:**
   - Развернуть на staging с другими URL
   - Убедиться, что все работает с новыми URL

### Python бот

1. **Локальное тестирование:**
   - Запустить бота с тестовыми переменными окружения
   - Проверить, что все API запросы идут на правильные URL
   - Проверить регистрацию пользователя

2. **Проверка ошибок:**
   - Запустить без APP_BASE_URL и убедиться, что бот не запускается
   - Проверить, что выводится понятное сообщение об ошибке

## Migration Plan

### Этап 1: Подготовка (без изменения кода)

1. Обновить `.env.example` с новыми переменными
2. Создать документацию по конфигурации
3. Обновить `config.example.js` (уже существует)

### Этап 2: Фронтенд (site/)

**Порядок обновления файлов:**

1. **JavaScript модули (высокий приоритет):**
   - `api.js` - используется везде
   - `admin_support.js`
   - `stats.js`
   - `support-chat.js`

2. **HTML файлы со встроенными скриптами:**
   - `stats.html`
   - `profile.html`
   - `recover.html`
   - `admin.html` (Yandex Maps)
   - `investor_map.html` (Yandex Maps)
   - `index.html` (preconnect)

### Этап 3: Бэкенд (api/)

1. Добавить переменные в `.env`
2. Обновить `api/payments.js` (4 места)
3. Обновить `api/admin.js` (1 место)

### Этап 4: Python бот

1. Добавить переменные в `.env`
2. Обновить `bot.py` (3 переменные)

### Этап 5: Документация

1. Обновить README файлы с примерами
2. Создать `CONFIG.md` с описанием всех параметров

### Этап 6: Тестирование

1. Протестировать каждый обновленный файл
2. Провести интеграционное тестирование
3. Проверить на staging окружении

## Rollback Strategy

Если что-то пойдет не так:

1. **Фронтенд:** Откатить изменения в конкретном файле, вернув захардкоженные значения
2. **Бэкенд:** Откатить изменения в API файлах
3. **Python бот:** Откатить изменения в bot.py

Все изменения должны быть обратно совместимы - если переменная окружения не установлена, использовать старое захардкоженное значение как fallback.

## Security Considerations

1. **Не коммитить .env файлы:**
   - Убедиться, что `.env` в `.gitignore`
   - Использовать `.env.example` для документации

2. **Защита ключей:**
   - Supabase ANON_KEY - публичный, можно в config.js
   - SERVICE_ROLE_KEY - только в .env на сервере
   - API ключи - только в .env

3. **Разделение окружений:**
   - Development: локальные URL
   - Staging: тестовые URL
   - Production: продакшн URL

## Performance Considerations

1. **Фронтенд:**
   - `config.js` загружается один раз при загрузке страницы
   - Нет дополнительных HTTP запросов
   - Минимальное влияние на производительность

2. **Бэкенд:**
   - `process.env` читается при запуске функции
   - Нет дополнительных операций I/O
   - Нулевое влияние на производительность

3. **Python бот:**
   - Переменные окружения читаются один раз при запуске
   - Нулевое влияние на производительность
