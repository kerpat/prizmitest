# GoGoBike Configuration Guide

This document describes all configuration parameters used across the GoGoBike project, including frontend, backend API, and Python bot components.

## Table of Contents

- [Overview](#overview)
- [Frontend Configuration](#frontend-configuration)
- [Backend Configuration](#backend-configuration)
- [Python Bot Configuration](#python-bot-configuration)
- [Environment Setup](#environment-setup)
- [Configuration by Environment](#configuration-by-environment)

---

## Overview

The GoGoBike project uses a centralized configuration approach:

- **Frontend**: Configuration is centralized in `site/config.js` and exposed via `window.APP_CONFIG`
- **Backend**: Configuration uses environment variables loaded from `.env` file via `process.env`
- **Python Bot**: Configuration uses environment variables loaded from `.env` file via `os.getenv()`

---

## Frontend Configuration

Frontend configuration is defined in `site/config.js` and is loaded globally as `window.APP_CONFIG`.

### Configuration File Location

```
site/config.js
```

### Configuration Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `SUPABASE_URL` | string | ✅ Yes | Supabase project URL | `https://briulxpnjxlsgfgkqvfh.supabase.co` |
| `SUPABASE_ANON_KEY` | string | ✅ Yes | Supabase anonymous/public key (safe to expose in frontend) | `eyJhbGci...` |
| `YANDEX_MAPS_API_KEY` | string | ✅ Yes | Yandex Maps JavaScript API key | `a32fae3e-06f9-4231-87a0-f225b5d7a04a` |
| `APP_BASE_URL` | string | ✅ Yes | Base URL of the main application (Vercel deployment) | `https://go-go-b-ike.vercel.app` |
| `CONTRACTS_API_URL` | string | ✅ Yes | URL of the PDF/contracts generation service (Render) | `https://gogobikedogovor.onrender.com` |

### Usage Example

```javascript
// In any frontend JavaScript file
const supabaseUrl = window.APP_CONFIG.SUPABASE_URL;
const apiKey = window.APP_CONFIG.YANDEX_MAPS_API_KEY;

// Always check if config is loaded
if (!window.APP_CONFIG) {
  console.error('Configuration not loaded! Ensure config.js is included.');
  throw new Error('Configuration not loaded');
}
```

### Files Using Frontend Config

- `site/api.js` - Supabase client initialization
- `site/admin.js` - Admin panel, PDF generation
- `site/admin_support.js` - Support chat admin interface
- `site/stats.js` - Statistics dashboard
- `site/support-chat.js` - User support chat
- `site/map.html` - Bike map with Yandex Maps
- `site/admin.html` - Admin panel with Yandex Maps
- `site/investor_map.html` - Investor map view
- `site/profile.html` - User profile, contract generation
- `site/stats.html` - Statistics page
- `site/recover.html` - Password recovery
- `site/index.html` - Main page (preconnect optimization)

---

## Backend Configuration

Backend API functions use environment variables from the `.env` file.

### Configuration File Location

```
.env (root directory)
```

### Configuration Parameters

| Parameter | Type | Required | Description | Used In |
|-----------|------|----------|-------------|---------|
| `SUPABASE_URL` | string | ✅ Yes | Supabase project URL | All API functions |
| `SUPABASE_SERVICE_ROLE_KEY` | string | ✅ Yes | Supabase service role key (server-side only, keep secret!) | All API functions |
| `TELEGRAM_BOT_TOKEN` | string | ✅ Yes | Telegram bot token from @BotFather | `api/auth.js`, `api/notify.js` |
| `GOOGLE_API_KEY` | string | ✅ Yes | Google API key for Vision API (OCR) | `api/gemini-ocr.js` |
| `INTERNAL_SECRET` | string | ✅ Yes | Secret key for internal service authentication | `api/gemini-ocr.js` |
| `API_GATEWAY_URL` | string | ✅ Yes | URL of the OCR processing service | `api/gemini-ocr.js` |
| `APP_BASE_URL` | string | ✅ Yes | Base URL of the main application (for redirects, webhooks) | `api/payments.js`, `api/admin.js` |
| `CONTRACTS_API_URL` | string | ✅ Yes | URL of the PDF/contracts generation service | `api/admin.js` |
| `YOOKASSA_SHOP_ID` | string | ✅ Yes | YooKassa shop ID for payment processing | `api/payments.js` |
| `YOOKASSA_SECRET_KEY` | string | ✅ Yes | YooKassa secret key for payment processing | `api/payments.js` |
| `MAIN_BACKEND_URL` | string | ⚠️ Deprecated | Legacy variable, use `APP_BASE_URL` instead | - |

### Usage Example

```javascript
// In any backend API file
const supabaseUrl = process.env.SUPABASE_URL;
const appBaseUrl = process.env.APP_BASE_URL;

// Always validate critical environment variables
if (!process.env.APP_BASE_URL) {
  console.error('CRITICAL: APP_BASE_URL environment variable is not set');
  throw new Error('APP_BASE_URL is required');
}

// Use fallback for non-critical variables
const baseUrl = process.env.APP_BASE_URL || 'https://go-go-b-ike.vercel.app';
```

### API Files Using Backend Config

- `api/admin.js` - Admin operations, contract generation
- `api/auth.js` - User authentication, Telegram integration
- `api/gemini-ocr.js` - OCR processing with Google Vision API
- `api/generate-contract.js` - Contract generation
- `api/getTariffByBike.js` - Tariff information
- `api/notify.js` - Telegram notifications
- `api/payment-webhook.js` - Payment webhook handler
- `api/payments.js` - Payment processing, redirects
- `api/process-renewals.js` - Subscription renewals
- `api/storage.js` - File storage operations
- `api/upload-support-attachment.js` - Support file uploads
- `api/user.js` - User management

---

## Python Bot Configuration

The Python Telegram bot (`bot.py`) uses environment variables from the `.env` file.

### Configuration File Location

```
.env (root directory)
```

### Configuration Parameters

| Parameter | Type | Required | Description | Usage |
|-----------|------|----------|-------------|-------|
| `TELEGRAM_BOT_TOKEN` | string | ✅ Yes | Telegram bot token from @BotFather | Bot authentication |
| `SUPABASE_URL` | string | ✅ Yes | Supabase project URL | Database operations |
| `SUPABASE_SERVICE_ROLE_KEY` | string | ✅ Yes | Supabase service role key | Database operations |
| `GOOGLE_API_KEY` | string | ✅ Yes | Google API key for services | OCR processing |
| `APP_BASE_URL` | string | ✅ Yes | Base URL of the main application | API calls, web app links |

### Usage Example

```python
import os
import sys

# Load configuration
APP_BASE_URL = os.getenv('APP_BASE_URL')

# Validate critical variables
if not APP_BASE_URL:
    logger.critical("APP_BASE_URL environment variable is not set!")
    sys.exit(1)

# Build API endpoints
WEBAPP_REGISTER_API = f'{APP_BASE_URL}/api/telegram-register'
BOT_REGISTER_API = f'{APP_BASE_URL}/api/auth'
WEB_APP_URL = APP_BASE_URL
```

---

## Environment Setup

### Initial Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your values:**
   Edit `.env` and replace all placeholder values with your actual credentials.

3. **Frontend configuration:**
   - Copy `site/config.example.js` to `site/config.js` (if not already present)
   - Update values in `site/config.js` to match your environment

4. **Verify configuration:**
   - Ensure all required variables are set
   - Check that URLs don't have trailing slashes (except where noted)
   - Verify API keys are valid

### Security Best Practices

⚠️ **IMPORTANT:**

- **Never commit `.env` files to version control** - they contain sensitive credentials
- The `.env` file should be in `.gitignore`
- Use `.env.example` to document required variables without exposing secrets
- `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed in frontend code
- `SUPABASE_ANON_KEY` is safe to use in frontend (it's public by design)
- Rotate keys regularly, especially if they may have been compromised

---

## Configuration by Environment

### Development (Local)

```env
# .env (development)
APP_BASE_URL=http://localhost:3000
CONTRACTS_API_URL=http://localhost:8080
SUPABASE_URL=https://your-dev-project.supabase.co
# ... other dev credentials
```

```javascript
// site/config.js (development)
window.APP_CONFIG = {
  APP_BASE_URL: 'http://localhost:3000',
  CONTRACTS_API_URL: 'http://localhost:8080',
  SUPABASE_URL: 'https://your-dev-project.supabase.co',
  // ... other dev config
};
```

### Staging

```env
# .env (staging)
APP_BASE_URL=https://gogobike-staging.vercel.app
CONTRACTS_API_URL=https://gogobike-contracts-staging.onrender.com
SUPABASE_URL=https://your-staging-project.supabase.co
# ... other staging credentials
```

```javascript
// site/config.js (staging)
window.APP_CONFIG = {
  APP_BASE_URL: 'https://gogobike-staging.vercel.app',
  CONTRACTS_API_URL: 'https://gogobike-contracts-staging.onrender.com',
  SUPABASE_URL: 'https://your-staging-project.supabase.co',
  // ... other staging config
};
```

### Production

```env
# .env (production)
APP_BASE_URL=https://go-go-b-ike.vercel.app
CONTRACTS_API_URL=https://gogobikedogovor.onrender.com
SUPABASE_URL=https://briulxpnjxlsgfgkqvfh.supabase.co
# ... other production credentials
```

```javascript
// site/config.js (production)
window.APP_CONFIG = {
  APP_BASE_URL: 'https://go-go-b-ike.vercel.app',
  CONTRACTS_API_URL: 'https://gogobikedogovor.onrender.com',
  SUPABASE_URL: 'https://briulxpnjxlsgfgkqvfh.supabase.co',
  // ... other production config
};
```

---

## Troubleshooting

### Frontend Issues

**Problem:** `window.APP_CONFIG is undefined`

**Solution:**
- Ensure `<script src="config.js"></script>` is included in your HTML
- Check that `config.js` is loaded before other scripts that use it
- Verify the file path is correct

**Problem:** API calls failing with CORS errors

**Solution:**
- Check that `SUPABASE_URL` matches your actual Supabase project
- Verify `APP_BASE_URL` is correctly set for your environment

### Backend Issues

**Problem:** `process.env.APP_BASE_URL is undefined`

**Solution:**
- Ensure `.env` file exists in the root directory
- Check that the variable is defined in `.env`
- Restart your development server after changing `.env`
- On Vercel, set environment variables in project settings

**Problem:** Payment redirects going to wrong URL

**Solution:**
- Verify `APP_BASE_URL` in `.env` matches your deployment URL
- Check for trailing slashes (should not have them)
- Ensure the variable is deployed to your hosting platform

### Python Bot Issues

**Problem:** Bot fails to start with "APP_BASE_URL not set"

**Solution:**
- Add `APP_BASE_URL` to your `.env` file
- Restart the bot after updating `.env`
- Check that `python-dotenv` is installed: `pip install python-dotenv`

**Problem:** Bot API calls failing

**Solution:**
- Verify `APP_BASE_URL` points to your deployed application
- Check that the API endpoints are accessible
- Ensure Telegram bot token is valid

---

## Migration Notes

### Migrating from Hardcoded Values

If you're updating from an older version with hardcoded values:

1. **Identify hardcoded values** in your code
2. **Add corresponding variables** to `.env` or `config.js`
3. **Replace hardcoded values** with configuration references
4. **Test thoroughly** in development before deploying
5. **Update deployment configurations** (Vercel, Render, etc.)

### Deprecated Variables

- `MAIN_BACKEND_URL` → Use `APP_BASE_URL` instead

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [YooKassa API Documentation](https://yookassa.ru/developers)

---

## Support

For questions or issues with configuration:
1. Check this documentation first
2. Review `.env.example` for required variables
3. Verify all values are correctly set for your environment
4. Check application logs for specific error messages
