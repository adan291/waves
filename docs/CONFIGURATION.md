# ⚙️ Configuration Guide - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025  
**Nivel**: Intermedio

---

## 📋 Configuración General

### Archivo Principal: `js/geminiService.js`

```javascript
const geminiConfig = {
    // API Configuration
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'gemini-pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
    
    // Request Configuration
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    topK: 40,
    
    // Timeout Configuration
    timeout: 30000,  // 30 segundos
    retryAttempts: 3,
    retryDelay: 1000
};
```

---

## 🔑 Configuración de API

### Google Gemini API

#### Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la key

#### Configurar API Key

**Opción 1: Directamente en el código (Solo desarrollo)**
```javascript
// js/geminiService.js
const geminiConfig = {
    apiKey: 'AIzaSy...',  // Tu API key aquí
    // ...
};
```

**Opción 2: Variable de entorno (Recomendado)**
```javascript
// js/geminiService.js
const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY || window.GEMINI_API_KEY,
    // ...
};
```

**Opción 3: Archivo de configuración local**
```javascript
// config.local.js (no subir a git)
window.GEMINI_API_KEY = 'tu-api-key';

// index.html
<script src="config.local.js"></script>
<script src="js/geminiService.js"></script>
```

#### Límites de API

```javascript
const API_LIMITS = {
    // Límites de Google Gemini (Free tier)
    requestsPerMinute: 60,
    requestsPerDay: 1500,
    tokensPerMinute: 32000,
    
    // Límites de la aplicación
    maxMessageLength: 5000,
    maxHistorySize: 50,
    maxRetries: 3
};
```

---

## 🎨 Configuración de Tema

### Colores Principales

Edita `css/style.css`:

```css
:root {
    /* Colores del océano */
    --ocean-deep: #0a2540;
    --ocean-blue: #1a4d6d;
    --wave-cyan: #4fb3d4;
    --foam-white: #e8f4f8;
    --sand-beige: #f5e6d3;
    
    /* Colores de texto */
    --text-primary: #2c3e50;
    --text-whisper: #4fb3d4;
    --text-reflection: #1a4d6d;
    
    /* Colores de UI */
    --bg-input: rgba(255, 255, 255, 0.95);
    --border-color: rgba(79, 179, 212, 0.3);
    --shadow-color: rgba(0, 0, 0, 0.1);
}
```

### Temas Predefinidos

#### Tema Oscuro
```css
[data-theme="dark"] {
    --ocean-deep: #000814;
    --ocean-blue: #001d3d;
    --wave-cyan: #00b4d8;
    --foam-white: #caf0f8;
    --text-primary: #e0e0e0;
}
```

#### Tema Claro
```css
[data-theme="light"] {
    --ocean-deep: #e0f2fe;
    --ocean-blue: #bae6fd;
    --wave-cyan: #7dd3fc;
    --foam-white: #ffffff;
    --text-primary: #0c4a6e;
}
```

### Aplicar Tema

```javascript
// js/main.js
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'default';
setTheme(savedTheme);
```

---

## 🎭 Configuración de Animaciones

### Velocidad de Animaciones

```css
/* css/style.css */

/* Animación del fondo */
@keyframes oceanFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.ocean-background {
    animation: oceanFlow 20s ease-in-out infinite;
    /* Cambia 20s para ajustar velocidad:
       - Más rápido: 10s
       - Más lento: 30s
    */
}

/* Fade in de mensajes */
.message {
    animation: fadeIn 0.5s ease-in;
    /* Cambia 0.5s para ajustar velocidad */
}

/* Typing indicator */
.typing-indicator span {
    animation: bounce 1.4s infinite;
    /* Cambia 1.4s para ajustar velocidad */
}
```

### Deshabilitar Animaciones

```css
/* Para usuarios que prefieren movimiento reducido */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 💾 Configuración de Storage

### localStorage

```javascript
// js/main.js
const STORAGE_CONFIG = {
    // Keys de storage
    HISTORY_KEY: 'whispers_conversation_history',
    PREFERENCES_KEY: 'whispers_user_preferences',
    THEME_KEY: 'whispers_theme',
    
    // Límites
    MAX_HISTORY_ITEMS: 100,
    MAX_STORAGE_SIZE: 5242880,  // 5MB
    
    // Expiración
    HISTORY_EXPIRY: 7 * 24 * 60 * 60 * 1000,  // 7 días
};
```

### Limpiar Storage

```javascript
// Limpiar historial antiguo
function cleanOldHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_CONFIG.HISTORY_KEY) || '[]');
    const now = Date.now();
    const filtered = history.filter(item => 
        now - item.timestamp < STORAGE_CONFIG.HISTORY_EXPIRY
    );
    localStorage.setItem(STORAGE_CONFIG.HISTORY_KEY, JSON.stringify(filtered));
}
```

---

## 🔊 Configuración de Audio (Futuro)

### Preparación para Speech-to-Text

```javascript
// js/ui.js (placeholder)
const AUDIO_CONFIG = {
    // Speech Recognition
    language: 'es-ES',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
    
    // Speech Synthesis
    voice: 'es-ES-Standard-A',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
};
```

---

## 🌐 Configuración de Idioma

### i18n (Internacionalización)

```javascript
// js/i18n.js (futuro)
const TRANSLATIONS = {
    es: {
        welcome: 'Bienvenido a Whispers of the Wave',
        placeholder: 'Escribe tu mensaje aquí...',
        send: 'Enviar',
        error: 'Ocurrió un error',
        // ...
    },
    en: {
        welcome: 'Welcome to Whispers of the Wave',
        placeholder: 'Type your message here...',
        send: 'Send',
        error: 'An error occurred',
        // ...
    }
};

// Configurar idioma
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updateUIText(lang);
}
```

---

## 📱 Configuración Responsive

### Breakpoints

```css
/* css/style.css */

/* Tablet */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    .message {
        font-size: 16px;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .container {
        padding: 10px;
    }
    
    .message {
        font-size: 14px;
    }
    
    .input-container {
        flex-direction: column;
    }
}
```

### Configurar Viewport

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## ⚡ Configuración de Performance

### Lazy Loading

```javascript
// js/main.js
const PERFORMANCE_CONFIG = {
    // Lazy load de imágenes
    lazyLoadImages: true,
    lazyLoadThreshold: 200,  // px antes de viewport
    
    // Debounce de inputs
    inputDebounce: 300,  // ms
    
    // Throttle de scroll
    scrollThrottle: 100,  // ms
    
    // Cache
    enableCache: true,
    cacheExpiry: 3600000,  // 1 hora
};
```

### Optimización de Renderizado

```javascript
// Usar requestAnimationFrame para animaciones
function smoothScroll() {
    requestAnimationFrame(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

// Debounce de inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
```

---

## 🔒 Configuración de Seguridad

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://generativelanguage.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self';
">
```

### Sanitización de HTML

```javascript
// js/ui.js
function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

// Usar siempre al mostrar contenido de usuario
function displayMessage(message) {
    const sanitized = sanitizeHTML(message);
    messageElement.innerHTML = sanitized;
}
```

---

## 📊 Configuración de Analytics (Opcional)

### Google Analytics

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

### Eventos Personalizados

```javascript
// Trackear eventos
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Ejemplos
trackEvent('User', 'send_message', 'conversation');
trackEvent('UI', 'change_theme', 'dark');
```

---

## 🐛 Configuración de Debugging

### Modo Debug

```javascript
// js/main.js
const DEBUG_CONFIG = {
    enabled: false,  // Cambiar a true para debugging
    logLevel: 'info',  // 'debug', 'info', 'warn', 'error'
    showTimestamps: true,
    showStackTrace: true
};

function debug(message, data) {
    if (DEBUG_CONFIG.enabled) {
        const timestamp = DEBUG_CONFIG.showTimestamps ? new Date().toISOString() : '';
        console.log(`[${timestamp}] ${message}`, data);
    }
}
```

### Console Logging

```javascript
// Habilitar logs detallados
localStorage.setItem('debug', 'true');

// Deshabilitar logs
localStorage.removeItem('debug');

// Verificar en código
const isDebug = localStorage.getItem('debug') === 'true';
```

---

## 🔧 Configuración Avanzada

### Service Worker (PWA)

```javascript
// sw.js
const CACHE_NAME = 'whispers-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/ui.js',
    '/js/geminiService.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
```

### Manifest (PWA)

```json
// manifest.json
{
    "name": "Whispers of the Wave",
    "short_name": "Whispers",
    "description": "AI conversation with ocean vibes",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1a4d6d",
    "theme_color": "#4fb3d4",
    "icons": [
        {
            "src": "/assets/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/assets/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

---

## ✅ Checklist de Configuración

### Básica
- [ ] API key configurada
- [ ] Tema seleccionado
- [ ] Storage configurado
- [ ] Responsive testeado

### Avanzada
- [ ] CSP configurado
- [ ] Analytics configurado (opcional)
- [ ] PWA configurado (opcional)
- [ ] Service Worker configurado (opcional)

### Seguridad
- [ ] API key no expuesta
- [ ] HTML sanitizado
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados

---

## 📚 Recursos

### Documentación Relacionada
- [Quick Start](./QUICKSTART.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture](./ARCHITECTURE.md)

### Referencias Externas
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

⚙️ **Configuración completa para personalización total**
