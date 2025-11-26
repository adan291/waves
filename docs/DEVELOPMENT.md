# 🛠️ Development Guide - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025  
**Nivel**: Intermedio/Avanzado

---

## 🚀 Setup de Desarrollo

### Requisitos

```
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Editor de código (VS Code recomendado)
- Git
- Python 3 o Node.js (para servidor local)
```

### Clonar el Repositorio

```bash
git clone https://github.com/usuario/whispers-of-the-wave.git
cd whispers-of-the-wave
```

### Configurar API Key

```bash
# Crear archivo de configuración local
cp js/geminiService.js js/geminiService.local.js

# Editar y agregar tu API key
# js/geminiService.local.js
```

### Iniciar Servidor de Desarrollo

**Opción 1: Python**
```bash
python -m http.server 8000
# Abre: http://localhost:8000
```

**Opción 2: Node.js**
```bash
npx http-server -p 8000
# Abre: http://localhost:8000
```

**Opción 3: VS Code Live Server**
- Instala extensión "Live Server"
- Click derecho en index.html → "Open with Live Server"

---

## 📁 Estructura del Proyecto

```
whispers-of-the-wave/
├── index.html              # Punto de entrada
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
│
├── css/
│   └── style.css          # Todos los estilos
│
├── js/
│   ├── geminiService.js   # Integración con Gemini API
│   ├── ui.js              # Manipulación del DOM
│   ├── main.js            # Lógica principal
│   │
│   ├── core/              # Módulos core
│   │   ├── eventBus.js
│   │   ├── logger.js
│   │   ├── performance.js
│   │   ├── inputValidator.js
│   │   ├── htmlSanitizer.js
│   │   ├── cache.js
│   │   ├── storageOptimizer.js
│   │   ├── lazyLoader.js
│   │   └── journeyCompletion.js
│   │
│   ├── features/          # Características
│   │   ├── achievementSystem.js
│   │   ├── i18n.js
│   │   ├── adaptiveAssistance.js
│   │   ├── responsePatterns.js
│   │   ├── stateClassifier.js
│   │   └── conversationEnhancer.js
│   │
│   └── ui/                # Componentes UI
│       ├── modal.js
│       ├── suggestions.js
│       ├── themeSystem.js
│       └── expressionMetrics.js
│
├── tests/                 # Tests
│   ├── unit/             # Tests unitarios
│   ├── integration/      # Tests de integración
│   ├── run-all-tests.html
│   └── coverage-report.html
│
├── docs/                  # Documentación
│   ├── ARCHITECTURE.md
│   ├── MODULES.md
│   ├── API_REFERENCE.md
│   ├── QUICKSTART.md
│   ├── DEPLOYMENT.md
│   ├── CONFIGURATION.md
│   ├── CONTRIBUTING.md
│   └── DEVELOPMENT.md
│
└── assets/               # Assets estáticos
    └── icons/
```

---

## 🔧 Flujo de Desarrollo

### 1. Crear Nueva Feature

```bash
# Crear rama
git checkout -b feature/nombre-feature

# Desarrollar
# ... hacer cambios ...

# Testear
# Abrir tests/run-all-tests.html

# Commit
git add .
git commit -m "feat: descripción de la feature"

# Push
git push origin feature/nombre-feature
```

### 2. Corregir Bug

```bash
# Crear rama
git checkout -b fix/descripcion-bug

# Reproducir bug
# Escribir test que falle
# Corregir bug
# Verificar que test pase

# Commit
git commit -m "fix: descripción del fix"

# Push
git push origin fix/descripcion-bug
```

---

## 🏗️ Arquitectura

### Capas del Sistema

```
┌─────────────────────────────────────┐
│          UI Layer                   │
│  (modal, suggestions, themes)       │
├─────────────────────────────────────┤
│       Features Layer                │
│  (achievements, i18n, adaptive)     │
├─────────────────────────────────────┤
│         Core Layer                  │
│  (eventBus, logger, performance)    │
├─────────────────────────────────────┤
│       Services Layer                │
│  (storage, cache, lazyLoader)       │
└─────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario → UI → Features → Core → Services
   ↑                                  ↓
   └──────────── Respuesta ←──────────┘
```

### Comunicación entre Módulos

```javascript
// Usar EventBus para comunicación desacoplada
EventBus.emit('user.message', { message: 'Hola' });

EventBus.on('user.message', (data) => {
    console.log('Mensaje recibido:', data.message);
});
```

---

## 📝 Convenciones de Código

### JavaScript

#### Módulos

```javascript
/**
 * Módulo para [descripción]
 * @module ModuleName
 */

class ModuleName {
    constructor() {
        this._init();
    }
    
    /**
     * Inicializa el módulo
     * @private
     */
    _init() {
        // Inicialización
    }
    
    /**
     * Método público
     * @param {string} param - Descripción
     * @returns {Object} Resultado
     */
    publicMethod(param) {
        return this._privateMethod(param);
    }
    
    /**
     * Método privado
     * @private
     */
    _privateMethod(param) {
        // Implementación
    }
}

// Exportar
window.ModuleName = ModuleName;
```

#### Async/Await

```javascript
// ✅ Bueno: Manejo de errores
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        Logger.error('Error fetching data', error);
        throw error;
    }
}

// ❌ Malo: Sin manejo de errores
async function fetchData() {
    const response = await fetch(url);
    return await response.json();
}
```

#### Validación

```javascript
// Siempre validar inputs
function processMessage(message) {
    // Validar
    const validation = InputValidator.validateMessage(message);
    if (!validation.isValid) {
        throw new Error('Invalid message');
    }
    
    // Sanitizar
    const sanitized = HtmlSanitizer.sanitize(validation.sanitized);
    
    // Procesar
    return doSomething(sanitized);
}
```

### CSS

#### Variables CSS

```css
/* Definir variables en :root */
:root {
    --ocean-blue: #1a4d6d;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
}

/* Usar variables */
.container {
    background: var(--ocean-blue);
    padding: var(--spacing-md);
}
```

#### Responsive

```css
/* Mobile first */
.container {
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        padding: 30px;
    }
}
```

---

## 🧪 Testing

### Estructura de Tests

```javascript
describe('ModuleName', () => {
    // Setup
    beforeEach(() => {
        // Preparar estado
    });
    
    // Teardown
    afterEach(() => {
        // Limpiar estado
    });
    
    describe('methodName', () => {
        it('should do something', () => {
            // Arrange
            const input = 'test';
            
            // Act
            const result = ModuleName.methodName(input);
            
            // Assert
            assert.strictEqual(result, expected);
        });
        
        it('should handle edge cases', () => {
            // Test edge cases
        });
        
        it('should throw error for invalid input', () => {
            assert.throws(() => {
                ModuleName.methodName(null);
            }, Error);
        });
    });
});
```

### Ejecutar Tests

```bash
# Abrir en navegador
open tests/run-all-tests.html

# Ver cobertura
open tests/coverage-report.html
```

### Escribir Nuevos Tests

```bash
# Crear archivo de test
touch tests/unit/myModule.test.html

# Usar template
cp tests/unit/template.test.html tests/unit/myModule.test.html

# Editar y agregar tests
```

---

## 🐛 Debugging

### Console Logging

```javascript
// Usar Logger en lugar de console.log
Logger.debug('Debug info', { data: value });
Logger.info('Info message', { data: value });
Logger.warn('Warning', { data: value });
Logger.error('Error', { data: value });
```

### Performance Monitoring

```javascript
// Medir performance de operaciones
const end = PerformanceMonitor.time('operation-name');
// ... operación ...
const metric = end();
console.log('Duration:', metric.duration);

// Ver reporte completo
const report = PerformanceMonitor.getReport();
console.table(report);
```

### Event Debugging

```javascript
// Escuchar todos los eventos
EventBus.on('*', (eventName, data) => {
    console.log('Event:', eventName, data);
});
```

### Browser DevTools

```javascript
// Breakpoints
debugger;  // Pausa ejecución aquí

// Network tab
// - Ver llamadas a API
// - Verificar tiempos de respuesta
// - Inspeccionar headers

// Console tab
// - Ver logs
// - Ejecutar código
// - Inspeccionar objetos

// Performance tab
// - Grabar performance
// - Identificar cuellos de botella
// - Analizar FPS
```

---

## 🔄 Workflow de Git

### Branches

```
main          - Producción
develop       - Desarrollo
feature/*     - Nuevas features
fix/*         - Bug fixes
hotfix/*      - Fixes urgentes
release/*     - Preparación de release
```

### Commits

```bash
# Commits atómicos y descriptivos
git commit -m "feat(ui): agregar botón de reset"
git commit -m "fix(api): corregir timeout"
git commit -m "docs: actualizar README"
git commit -m "test: agregar tests para modal"
git commit -m "refactor: simplificar validación"
```

### Pull Requests

```bash
# Actualizar branch antes de PR
git checkout main
git pull origin main
git checkout feature/mi-feature
git rebase main

# Resolver conflictos si hay
git add .
git rebase --continue

# Push
git push origin feature/mi-feature --force-with-lease
```

---

## 🚀 Build y Deploy

### No Build Process

Este proyecto **NO requiere build process**:
- Vanilla JavaScript (sin transpilación)
- CSS puro (sin preprocessadores)
- Sin bundling necesario

### Deploy

```bash
# Simplemente sube los archivos
git push origin main

# GitHub Pages, Netlify, Vercel detectarán automáticamente
```

### Optimización (Opcional)

```bash
# Minificar JS
terser js/main.js -o js/main.min.js

# Minificar CSS
csso css/style.css -o css/style.min.css

# Actualizar referencias en index.html
```

---

## 📊 Métricas de Calidad

### Objetivos

```
Cobertura de tests:    > 50%
Performance:           < 1s carga inicial
Bundle size:           < 700 KB
Accesibilidad:         WCAG 2.1 AA
Compatibilidad:        Chrome 90+, Firefox 88+, Safari 14+
```

### Verificar Métricas

```bash
# Tests
open tests/coverage-report.html

# Performance
# Chrome DevTools → Lighthouse

# Bundle size
du -sh js/ css/

# Accesibilidad
# Chrome DevTools → Lighthouse → Accessibility
```

---

## 🔧 Herramientas Recomendadas

### VS Code Extensions

```
- Live Server
- ESLint
- Prettier
- GitLens
- Path Intellisense
- Auto Rename Tag
- CSS Peek
```

### Browser Extensions

```
- React Developer Tools (para debugging)
- Redux DevTools (para state management)
- Lighthouse (para auditorías)
- WAVE (para accesibilidad)
```

---

## 📚 Recursos

### Documentación Interna
- [Architecture](./ARCHITECTURE.md)
- [Modules](./MODULES.md)
- [API Reference](./API_REFERENCE.md)
- [Contributing](./CONTRIBUTING.md)

### Referencias Externas
- [MDN Web Docs](https://developer.mozilla.org/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Web.dev](https://web.dev/)
- [JavaScript.info](https://javascript.info/)

---

## 💡 Tips y Trucos

### Performance

```javascript
// Usar requestAnimationFrame para animaciones
function smoothScroll() {
    requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
    });
}

// Debounce de inputs
const debouncedSearch = debounce(search, 300);
input.addEventListener('input', debouncedSearch);

// Lazy load de módulos
await LazyLoader.load('js/features/achievements.js');
```

### Debugging

```javascript
// Logs condicionales
if (DEBUG) {
    console.log('Debug info:', data);
}

// Performance marks
performance.mark('start');
// ... operación ...
performance.mark('end');
performance.measure('operation', 'start', 'end');
```

### Testing

```javascript
// Mocks
const mockFetch = (data) => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(data)
        })
    );
};

// Spies
const spy = sinon.spy(console, 'log');
// ... código que llama console.log ...
assert(spy.calledOnce);
```

---

## 🎯 Checklist de Desarrollo

### Antes de Commit
- [ ] Código sigue convenciones
- [ ] Tests pasan
- [ ] No hay console.logs olvidados
- [ ] Documentación actualizada
- [ ] Sin warnings en consola

### Antes de PR
- [ ] Branch actualizado con main
- [ ] Todos los tests pasan
- [ ] Cobertura > 50%
- [ ] Documentación completa
- [ ] PR description completa

### Antes de Release
- [ ] Todos los tests pasan
- [ ] Performance verificada
- [ ] Accesibilidad verificada
- [ ] CHANGELOG actualizado
- [ ] Versión actualizada

---

## 🆘 Troubleshooting

### Problema: Tests no pasan

**Solución**:
1. Verificar que todos los módulos estén cargados
2. Revisar consola para errores
3. Verificar que el orden de carga sea correcto

### Problema: Performance lenta

**Solución**:
1. Usar PerformanceMonitor para identificar cuellos de botella
2. Verificar tamaño de bundle
3. Optimizar operaciones costosas

### Problema: CORS errors

**Solución**:
1. Usar servidor local (no file://)
2. Verificar configuración de API
3. Revisar headers de respuesta

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

🛠️ **Guía completa para desarrollo eficiente**
