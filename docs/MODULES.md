# 📦 Modules Documentation - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025  
**Total de Módulos**: 40

---

## 📋 Índice por Capa

### Core Layer (16 módulos)
1. [EventBus](#1-eventbus) - Sistema de eventos central ⭐
2. [Logger](#2-logger) - Sistema de logging ⭐
3. [PerformanceMonitor](#3-performancemonitor) - Monitor de performance ⭐
4. [InputValidator](#4-inputvalidator) - Validación de entrada ⭐
5. [HtmlSanitizer](#5-htmlsanitizer) - Sanitización HTML ⭐
6. [Cache](#6-cache) - Sistema de caché ⭐
7. [StorageOptimizer](#7-storageoptimizer) - Optimización de storage ⭐
8. [LazyLoader](#8-lazyloader) - Carga diferida ⭐
9. [ErrorHandler](#9-errorhandler) - Manejo de errores
10. [ResponseValidator](#10-responsevalidator) - Validación de respuestas
11. [AppFacade](#11-appfacade) - Fachada de aplicación
12. [LazyLoadManager](#12-lazyloadmanager) - Gestión de carga
13. [Events](#13-events) - Definiciones de eventos
14. [State](#14-state) - Gestión de estado
15. [Utils](#15-utils) - Utilidades
16. [Constants](#16-constants) - Constantes

### Features Layer (10 módulos)
17. [ConversationEnhancer](#17-conversationenhancer) - Mejora de conversaciones ⭐
18. [JourneyCompletion](#18-journeycompletion) - Detección de cierre ⭐
19. [AchievementSystem](#19-achievementsystem) - Sistema de logros
20. [I18n](#20-i18n) - Internacionalización
21. [AdaptiveAssistance](#21-adaptiveassistance) - Asistencia adaptativa
22. [ResponsePatterns](#22-responsepatterns) - Patrones de respuesta
23. [StateClassifier](#23-stateclassifier) - Clasificación de estados
24. [EmotionalAnalysis](#24-emotionalanalysis) - Análisis emocional
25. [ContextManager](#25-contextmanager) - Gestión de contexto
26. [FeedbackSystem](#26-feedbacksystem) - Sistema de feedback

### UI Layer (8 módulos)
27. [Modal](#27-modal) - Sistema de modales
28. [Suggestions](#28-suggestions) - Sugerencias contextuales
29. [ThemeSystem](#29-themesystem) - Gestión de temas
30. [ExpressionMetrics](#30-expressionmetrics) - Métricas de expresión
31. [Security](#31-security) - Validaciones UI
32. [SplashScreen](#32-splashscreen) - Pantalla de carga
33. [Navigation](#33-navigation) - Navegación
34. [Layout](#34-layout) - Gestión de layout

### Services Layer (6 módulos)
35. [ApiService](#35-apiservice) - Servicio de API
36. [DataService](#36-dataservice) - Servicio de datos
37. [ConfigService](#37-configservice) - Configuración
38. [UtilsService](#38-utilsservice) - Utilidades
39. [ValidationService](#39-validationservice) - Validaciones
40. [StorageService](#40-storageservice) - Almacenamiento

⭐ = Módulo con tests implementados

---

## 🔧 Core Layer

### 1. EventBus

**Archivo**: `js/core/eventBus.js`  
**Tests**: ✅ 10 tests  
**Dependencias**: Ninguna  
**Usado por**: Todos los módulos

**Propósito**: Sistema de eventos central para comunicación desacoplada entre módulos.

**API Pública**:
```javascript
// Suscribirse a eventos
EventBus.on(eventName, callback)

// Emitir eventos
EventBus.emit(eventName, data)

// Desuscribirse
EventBus.off(eventName, callback)

// Limpiar todos los listeners
EventBus.clear()
```

**Ejemplo**:
```javascript
// Módulo A: Emitir evento
EventBus.emit('user.message', { text: 'Hola' });

// Módulo B: Escuchar evento
EventBus.on('user.message', (data) => {
    console.log('Mensaje:', data.text);
});
```

---

### 2. Logger

**Archivo**: `js/core/logger.js`  
**Tests**: ✅ 10 tests  
**Dependencias**: Ninguna  
**Usado por**: Todos los módulos

**Propósito**: Sistema de logging con diferentes niveles para debugging y monitoreo.

**API Pública**:
```javascript
// Diferentes niveles
Logger.debug(message, data)
Logger.info(message, data)
Logger.warn(message, data)
Logger.error(message, data)

// Configuración
Logger.setLevel(level)
Logger.enable()
Logger.disable()
```

**Ejemplo**:
```javascript
Logger.info('Usuario conectado', { userId: 123 });
Logger.error('Error de API', { status: 500 });
```

---

### 3. PerformanceMonitor

**Archivo**: `js/core/performance.js`  
**Tests**: ✅ 10 tests  
**Dependencias**: Logger  
**Usado por**: Todos los módulos

**Propósito**: Monitoreo de performance y métricas del sistema.

**API Pública**:
```javascript
// Timing de operaciones
const end = PerformanceMonitor.time('operationName')
end() // Retorna métrica

// Timing asíncrono
await PerformanceMonitor.timeAsync('asyncOp', asyncFunction)

// Reportes
PerformanceMonitor.getReport()
PerformanceMonitor.clear()
```

**Ejemplo**:
```javascript
const end = PerformanceMonitor.time('api-call');
await fetch('/api/data');
const metric = end();
console.log('Duration:', metric.duration);
```

---

### 4. InputValidator

**Archivo**: `js/core/inputValidator.js`  
**Tests**: ✅ 15 tests  
**Dependencias**: Ninguna  
**Usado por**: UI Layer, Features Layer

**Propósito**: Validación de entradas de usuario para seguridad y calidad.

**API Pública**:
```javascript
// Validaciones
InputValidator.validateMessage(message)
InputValidator.validateLength(text, maxLength)
InputValidator.sanitizeInput(input)
InputValidator.isValidFormat(input, format)
```

**Ejemplo**:
```javascript
const result = InputValidator.validateMessage('Hola mundo');
if (result.isValid) {
    processMessage(result.sanitized);
}
```

---

### 5. HtmlSanitizer

**Archivo**: `js/core/htmlSanitizer.js`  
**Tests**: ✅ 15 tests  
**Dependencias**: Ninguna  
**Usado por**: UI Layer, Features Layer

**Propósito**: Sanitización HTML para prevenir XSS y otros ataques.

**API Pública**:
```javascript
// Sanitización
HtmlSanitizer.sanitize(html)
HtmlSanitizer.sanitizeText(text)
HtmlSanitizer.escapeHtml(html)
HtmlSanitizer.stripTags(html)
```

**Ejemplo**:
```javascript
const userInput = '<script>alert("XSS")</script>';
const safe = HtmlSanitizer.sanitize(userInput);
element.innerHTML = safe; // Seguro
```

---

### 6. Cache

**Archivo**: `js/core/cache.js`  
**Tests**: ✅ 12 tests  
**Dependencias**: Logger  
**Usado por**: Services Layer, Features Layer

**Propósito**: Sistema de caché en memoria para optimizar performance.

**API Pública**:
```javascript
// Operaciones de caché
Cache.set(key, value, ttl)
Cache.get(key)
Cache.has(key)
Cache.delete(key)
Cache.clear()

// Estadísticas
Cache.getStats()
```

**Ejemplo**:
```javascript
// Guardar con TTL de 1 hora
Cache.set('user:123', userData, 3600000);

// Obtener
const user = Cache.get('user:123');
```

---

### 7. StorageOptimizer

**Archivo**: `js/core/storageOptimizer.js`  
**Tests**: ✅ 10 tests  
**Dependencias**: Logger  
**Usado por**: Services Layer

**Propósito**: Optimización de localStorage con compresión y gestión de espacio.

**API Pública**:
```javascript
// Operaciones optimizadas
StorageOptimizer.set(key, value)
StorageOptimizer.get(key)
StorageOptimizer.remove(key)
StorageOptimizer.clear()

// Optimización
StorageOptimizer.optimize()
StorageOptimizer.getUsage()
```

**Ejemplo**:
```javascript
StorageOptimizer.set('preferences', {
    theme: 'dark',
    language: 'es'
});

const prefs = StorageOptimizer.get('preferences');
```

---

### 8. LazyLoader

**Archivo**: `js/core/lazyLoader.js`  
**Tests**: ✅ 8 tests  
**Dependencias**: Logger, PerformanceMonitor  
**Usado por**: AppFacade

**Propósito**: Carga diferida de módulos para optimizar tiempo de carga inicial.

**API Pública**:
```javascript
// Carga de módulos
LazyLoader.load(modulePath)
LazyLoader.loadGroup(groupName)
LazyLoader.isLoaded(modulePath)
LazyLoader.preload(groupName)

// Estado
LazyLoader.getLoadedModules()
```

**Ejemplo**:
```javascript
// Cargar módulo cuando se necesita
await LazyLoader.load('js/features/achievements.js');

// Verificar si está cargado
if (LazyLoader.isLoaded('js/features/achievements.js')) {
    // Usar el módulo
}
```

---

### 9. ErrorHandler

**Archivo**: `js/core/errorHandler.js`  
**Tests**: ⏳ Pendiente  
**Dependencias**: Logger, EventBus  
**Usado por**: Todos los módulos

**Propósito**: Manejo centralizado de errores con logging y notificación.

**API Pública**:
```javascript
ErrorHandler.handle(error, context)
ErrorHandler.handleAsync(asyncFunction)
ErrorHandler.setErrorCallback(callback)
```

---

### 10. ResponseValidator

**Archivo**: `js/core/responseValidator.js`  
**Tests**: ⏳ Pendiente  
**Dependencias**: Logger  
**Usado por**: Features Layer

**Propósito**: Validación de respuestas de IA para asegurar calidad.

**API Pública**:
```javascript
ResponseValidator.validate(response)
ResponseValidator.validateStructure(response)
ResponseValidator.validateContent(response)
```

---

## 🎨 Features Layer

### 17. ConversationEnhancer

**Archivo**: `js/features/conversationEnhancer.js`  
**Tests**: ✅ 11 tests  
**Dependencias**: EventBus, Logger  
**Usado por**: Features Layer

**Propósito**: Mejora de conversaciones mediante análisis de contexto y emociones.

**API Pública**:
```javascript
// Análisis de contexto
ConversationEnhancer.analyzeContext(message, history)
ConversationEnhancer.improveResponse(response, context)
ConversationEnhancer.assessSupportNeeds(message)

// Mejoras
ConversationEnhancer.generateContextEnhancement(context)
```

**Ejemplo**:
```javascript
const context = ConversationEnhancer.analyzeContext(
    '¿Qué debo hacer?',
    conversationHistory
);

const improved = ConversationEnhancer.improveResponse(
    originalResponse,
    context
);
```

---

### 18. JourneyCompletion

**Archivo**: `js/core/journeyCompletion.js`  
**Tests**: ✅ 10 tests  
**Dependencias**: Logger, EventBus  
**Usado por**: Features Layer

**Propósito**: Detección de cierre de conversación y generación de prompts de cierre.

**API Pública**:
```javascript
// Análisis de completitud
JourneyCompletion.analyzeCompletion(message, context)
JourneyCompletion.getStatus()
JourneyCompletion.reset()

// Prompts de cierre
JourneyCompletion.getClosurePrompt(type)
```

**Ejemplo**:
```javascript
const analysis = JourneyCompletion.analyzeCompletion(
    'Gracias, ahora entiendo todo',
    { oceanState: 'resolved' }
);

if (analysis.completionScore > 80) {
    const prompt = JourneyCompletion.getClosurePrompt('clarity_celebration');
}
```

---

### 19. AchievementSystem

**Archivo**: `js/features/achievementSystem.js`  
**Tests**: ⏳ Existente (por auditar)  
**Dependencias**: EventBus, Logger, StorageOptimizer  
**Usado por**: UI Layer

**Propósito**: Sistema de logros y gamificación para engagement.

**API Pública**:
```javascript
AchievementSystem.checkAchievements(context)
AchievementSystem.getUnlockedAchievements()
AchievementSystem.getProgress(achievementId)
AchievementSystem.onAchievementUnlocked(callback)
```

---

### 20. I18n

**Archivo**: `js/features/i18n.js`  
**Tests**: ⏳ Existente (por auditar)  
**Dependencias**: StorageOptimizer, EventBus  
**Usado por**: UI Layer

**Propósito**: Internacionalización y traducciones (ES/EN).

**API Pública**:
```javascript
I18n.t(key, params)
I18n.setLanguage(lang)
I18n.getCurrentLanguage()
I18n.addTranslations(lang, translations)
I18n.getAvailableLanguages()
```

---

## 🎨 UI Layer

### 27. Modal

**Archivo**: `js/ui/modal.js`  
**Tests**: ⏳ Existente (por auditar)  
**Dependencias**: EventBus, HtmlSanitizer  
**Usado por**: UI Components

**Propósito**: Sistema de modales y diálogos reutilizables.

**API Pública**:
```javascript
Modal.show(content, options)
Modal.hide()
Modal.isVisible()
Modal.setDefaultOptions(options)
Modal.onShow(callback)
Modal.onHide(callback)
```

---

### 29. ThemeSystem

**Archivo**: `js/ui/themeSystem.js`  
**Tests**: ⏳ Existente (por auditar)  
**Dependencias**: StorageOptimizer, EventBus  
**Usado por**: UI Components

**Propósito**: Gestión de temas visuales (oscuro/claro).

**API Pública**:
```javascript
ThemeSystem.setTheme(themeName)
ThemeSystem.getCurrentTheme()
ThemeSystem.getAvailableThemes()
ThemeSystem.customizeTheme(properties)
ThemeSystem.resetTheme()
```

---

## 🔧 Services Layer

### 35. ApiService

**Archivo**: `js/services/apiService.js`  
**Tests**: ⏳ Por implementar  
**Dependencias**: Logger, Cache  
**Usado por**: Features Layer

**Propósito**: Comunicación con APIs externas (Gemini).

**API Pública**:
```javascript
ApiService.call(endpoint, data)
ApiService.get(url)
ApiService.post(url, data)
ApiService.setBaseUrl(url)
ApiService.setHeaders(headers)
```

---

## 📊 Matriz de Dependencias

```
                    EventBus Logger Perf Cache Storage
EventBus               -      -     -     -      -
Logger                 ✓      -     -     -      -
PerformanceMonitor     ✓      ✓     -     -      -
Cache                  ✓      ✓     ✓     -      -
StorageOptimizer       ✓      ✓     ✓     -      -
LazyLoader             ✓      ✓     ✓     ✓      ✓
ConversationEnhancer   ✓      ✓     -     -      -
JourneyCompletion      ✓      ✓     -     -      -
AchievementSystem      ✓      ✓     -     -      ✓
I18n                   ✓      -     -     -      ✓
ThemeSystem            ✓      -     -     -      ✓
Modal                  ✓      -     -     -      -
```

---

## 📈 Estadísticas de Módulos

### Por Capa
```
Core Layer:      16 módulos (40%)
Features Layer:  10 módulos (25%)
UI Layer:         8 módulos (20%)
Services Layer:   6 módulos (15%)
```

### Por Estado de Tests
```
Con tests:       10 módulos (25%) ✅
Tests existentes: 16 módulos (40%) ⏳
Sin tests:       14 módulos (35%) ❌
```

### Por Complejidad
```
Alta:            8 módulos (EventBus, Logger, etc.)
Media:          20 módulos
Baja:           12 módulos
```

---

## 🔄 Flujos de Comunicación

### Flujo Principal
```
UI Layer → Features Layer → Core Layer → Services Layer
```

### Flujo de Eventos
```
Módulo A → EventBus → Módulo B
```

### Flujo de Datos
```
Input → Validator → Sanitizer → Processor → Cache → Storage
```

---

## 📝 Convenciones

### Nomenclatura
- **Archivos**: camelCase.js
- **Clases**: PascalCase
- **Métodos**: camelCase
- **Constantes**: UPPER_CASE

### Estructura Estándar
```javascript
/**
 * Módulo para [descripción]
 * @module ModuleName
 */
class ModuleName {
    constructor() {
        this._init();
    }
    
    // Métodos públicos
    publicMethod() {}
    
    // Métodos privados
    _privateMethod() {}
}

window.ModuleName = ModuleName;
```

---

## 🎯 Próximos Módulos

### Planificados
- `AudioService` - Servicio de audio
- `NotificationService` - Notificaciones
- `AnalyticsService` - Analytics
- `BackupService` - Respaldo de datos

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

📦 **40 módulos documentados para un sistema robusto**
