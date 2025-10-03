# Telegram Bot Configuration Update

## Изменения

Добавлены новые переменные окружения для управления Telegram ботом и каналом поддержки.

## Новые переменные

### В .env и .env.example:
```env
# Bot username (without @)
BOT_USERNAME=gogobikebot

# Support channel/group username (without @)
SUPPORT_TELEGRAM=GoGoBike_support
```

### В site/config.js:
```javascript
// Telegram Bot Configuration
BOT_USERNAME: 'gogobikebot',
SUPPORT_TELEGRAM: 'GoGoBike_support'
```

## Обновленные файлы

### Frontend:
- ✅ `site/config.js` - добавлены BOT_USERNAME и SUPPORT_TELEGRAM
- ✅ `site/profile.html` - ссылка на поддержку теперь использует config
- ✅ `site/index.html` - все ссылки на бота используют config

### Backend:
- ✅ `bot.py` - добавлены переменные BOT_USERNAME и SUPPORT_TELEGRAM

### Configuration:
- ✅ `.env` - добавлены новые переменные
- ✅ `.env.example` - добавлены новые переменные
- ✅ `CONFIG.md` - обновлена документация

## Как использовать

### Изменить имя бота:
1. Обновите `BOT_USERNAME` в `.env`
2. Обновите `BOT_USERNAME` в `site/config.js`
3. Перезапустите бота и передеплойте фронтенд

### Изменить канал поддержки:
1. Обновите `SUPPORT_TELEGRAM` в `.env`
2. Обновите `SUPPORT_TELEGRAM` в `site/config.js`
3. Передеплойте фронтенд

## Примеры использования

### В JavaScript (frontend):
```javascript
// Ссылка на бота
const botLink = `https://t.me/${window.APP_CONFIG.BOT_USERNAME}`;

// Ссылка на поддержку
const supportLink = `https://t.me/${window.APP_CONFIG.SUPPORT_TELEGRAM}`;

// Реферальная ссылка
const referralLink = `https://t.me/${window.APP_CONFIG.BOT_USERNAME}?start=${userId}`;
```

### В Python (bot.py):
```python
# Использование в боте
bot_username = BOT_USERNAME  # из переменных окружения
support_channel = SUPPORT_TELEGRAM  # из переменных окружения
```

## Преимущества

✅ Легко менять имя бота без правки кода
✅ Легко менять канал поддержки
✅ Централизованная конфигурация
✅ Одно место для изменений
✅ Документировано в CONFIG.md

## Deployment

При деплое на Vercel/Render не забудьте добавить новые переменные окружения:
- `BOT_USERNAME=gogobikebot`
- `SUPPORT_TELEGRAM=GoGoBike_support`
