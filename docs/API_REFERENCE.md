# 📚 API Reference - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025  
**Módulos Documentados**: 40

---

## 📋 Índice de APIs

### Core APIs
- [EventBus API](#eventbus-api)
- [Logger API](#logger-api)
- [PerformanceMonitor API](#performancemonitor-api)
- [InputValidator API](#inputvalidator-api)
- [HtmlSanitizer API](#htmlsanitizer-api)
- [Cache API](#cache-api)
- [StorageOptimizer API](#storageoptimizer-api)
- [LazyLoader API](#lazyloader-api)

### Features APIs
- [ConversationEnhancer API](#conversationenhancer-api)
- [JourneyCompletion API](#journeycompletion-api)

---

## 🔧 Core APIs

### EventBus API

Sistema de eventos central para comunicación desacoplada.

#### `EventBus.on(eventName, callback)`

Suscribe un callback a un evento.

**Parámetros**:
- `eventName` (string): Nombre del evento
- `callback` (function): Función a ejecutar cuando se emita el evento

**Retorna**: `void`

**Ejemplo**:
```javascript
EventBus.on('user.message', (data) => {
    console.log('Mensaje recibido:', data.message);
});
```

---

#### `EventBus.emit(eventName, data)`

Emite un evento con datos opcionales.

**Parámetros**:
- `eventName` (string): Nombre del evento
- `data` (any, opcional): Datos a enviar con el evento

**Retorna**: `void`

**Ejemplo**:
```javascript
EventBus.emit('user.message', {
    message: 'Hola mundo',
    timestamp: Date.now()
});
```

---

#### `EventBus.off(eventName, callback)`

Desuscribe un callback de un evento.

**Parámetros**:
- `eventName` (string): Nombre del evento
- `callback` (function): Función a desuscribir

**Retorna**: `void`

**Ejemplo**:
```javascript
const handler = (data) => console.log(data);
EventBus.on('test', handler);
EventBus.off('test', handler);
```

---

#### `EventBus.clear()`

Limpia todos los listeners de eventos.

**Parámetros**: Ninguno

**Retorna**: `void`

**Ejemplo**:
```javascript
EventBus.clear(); // Limpia todos los eventos
```

---

### Logger API

Sistema de logging con diferentes niveles.

#### `Logger.debug(message, data?)`

Log de nivel debug (solo en desarrollo).

**Parámetros**:
- `message` (string): Mensaje a logear
- `data` (any, opcional): Datos adicionales

**Retorna**: `void`

**Ejemplo**:
```javascript
Logger.debug('Procesando mensaje', { userId: 123 });
```

---

#### `Logger.info(message, data?)`

Log de nivel info (información general).

**Parámetros**:
- `message` (string): Mensaje a logear
- `data` (any, opcional): Datos adicionales

**Retorna**: `void`

**Ejemplo**:
```javascript
Logger.info('Usuario conectado', { sessionId: 'abc123' });
```

---

#### `Logger.warn(message, data?)`

Log de nivel warning (advertencias).

**Parámetros**:
- `message` (string): Mensaje a logear
- `data` (any, opcional): Datos adicionales

**Retorna**: `void`

**Ejemplo**:
```javascript
Logger.warn('API lenta', { responseTime: 5000 });
```

---

#### `Logger.error(message, data?)`

Log de nivel error (errores críticos).

**Parámetros**:
- `message` (string): Mensaje a logear
- `data` (any, opcional): Datos adicionales

**Retorna**: `void`

**Ejemplo**:
```javascript
Logger.error('Error de validación', { input: 'invalid' });
```

---

#### `Logger.setLevel(level)`

Configura el nivel mínimo de logging.

**Parámetros**:
- `level` (string): 'debug' | 'info' | 'warn' | 'error'

**Retorna**: `void`

**Ejemplo**:
```javascript
Logger.setLevel('debug'); // Mostrar todos los logs
Logger.setLevel('error'); // Solo errores
```

---

### PerformanceMonitor API

Monitor de performance y métricas.

#### `PerformanceMonitor.time(operationName)`

Inicia el timing de una operación.

**Parámetros**:
- `operationName` (string): Nombre de la operación

**Retorna**: `function` - Función para terminar el timing

**Ejemplo**:
```javascript
const end = PerformanceMonitor.time('database-query');
// ... operación ...
const metric = end();
console.log('Duration:', metric.duration, 'ms');
```

---

#### `PerformanceMonitor.timeAsync(operationName, asyncFunction)`

Mide el tiempo de una función asíncrona.

**Parámetros**:
- `operationName` (string): Nombre de la operación
- `asyncFunction` (function): Función asíncrona a medir

**Retorna**: `Promise<any>` - Resultado de la función

**Ejemplo**:
```javascript
const result = await PerformanceMonitor.timeAsync('api-call', async () => {
    return await fetch('/api/data');
});
```

---

#### `PerformanceMonitor.getReport()`

Obtiene reporte de performance con estadísticas.

**Parámetros**: Ninguno

**Retorna**: `Object` - Reporte con estadísticas por categoría

**Ejemplo**:
```javascript
const report = PerformanceMonitor.getReport();
// {
//   apiCalls: { count: 5, avg: 200, median: 180, p95: 350 },
//   renders: { count: 10, avg: 16, median: 15, p95: 25 }
// }
console.table(report);
```

---

#### `PerformanceMonitor.clear()`

Limpia todas las métricas almacenadas.

**Parámetros**: Ninguno

**Retorna**: `void`

**Ejemplo**:
```javascript
PerformanceMonitor.clear();
```

---

### InputValidator API

Validación de entradas de usuario.

#### `InputValidator.validateMessage(message)`

Valida un mensaje de usuario completo.

**Parámetros**:
- `message` (string): Mensaje a validar

**Retorna**: `Object` - Resultado de validación
```javascript
{
    isValid: boolean,
    errors: string[],
    sanitized: string,
    warnings?: string[]
}
```

**Ejemplo**:
```javascript
const result = InputValidator.validateMessage('Hola mundo');
if (result.isValid) {
    processMessage(result.sanitized);
} else {
    console.error('Errores:', result.errors);
}
```

---

#### `InputValidator.validateLength(text, maxLength)`

Valida la longitud de un texto.

**Parámetros**:
- `text` (string): Texto a validar
- `maxLength` (number): Longitud máxima permitida

**Retorna**: `boolean` - True si es válido

**Ejemplo**:
```javascript
const isValid = InputValidator.validateLength('Hola', 10); // true
const isInvalid = InputValidator.validateLength('Texto muy largo...', 5); // false
```

---

#### `InputValidator.sanitizeInput(input)`

Sanitiza un input removiendo caracteres peligrosos.

**Parámetros**:
- `input` (string): Input a sanitizar

**Retorna**: `string` - Input sanitizado

**Ejemplo**:
```javascript
const safe = InputValidator.sanitizeInput('<script>alert(1)</script>');
// Retorna: 'scriptalert1script'
```

---

### HtmlSanitizer API

Sanitización HTML para prevenir XSS.

#### `HtmlSanitizer.sanitize(html)`

Sanitiza HTML removiendo elementos peligrosos.

**Parámetros**:
- `html` (string): HTML a sanitizar

**Retorna**: `string` - HTML sanitizado

**Ejemplo**:
```javascript
const userInput = '<p>Hola <script>alert(1)</script></p>';
const safe = HtmlSanitizer.sanitize(userInput);
// Retorna: '<p>Hola </p>'
element.innerHTML = safe; // Seguro
```

---

#### `HtmlSanitizer.escapeHtml(html)`

Escapa caracteres HTML especiales.

**Parámetros**:
- `html` (string): HTML a escapar

**Retorna**: `string` - HTML escapado

**Ejemplo**:
```javascript
const escaped = HtmlSanitizer.escapeHtml('<div>Test</div>');
// Retorna: '&lt;div&gt;Test&lt;/div&gt;'
```

---

#### `HtmlSanitizer.stripTags(html)`

Remueve todas las etiquetas HTML.

**Parámetros**:
- `html` (string): HTML del cual remover tags

**Retorna**: `string` - Texto sin tags

**Ejemplo**:
```javascript
const text = HtmlSanitizer.stripTags('<p>Hola <b>mundo</b></p>');
// Retorna: 'Hola mundo'
```

---

### Cache API

Sistema de caché en memoria.

#### `Cache.set(key, value, ttl?)`

Almacena un valor en caché.

**Parámetros**:
- `key` (string): Clave del caché
- `value` (any): Valor a almacenar
- `ttl` (number, opcional): Tiempo de vida en ms

**Retorna**: `void`

**Ejemplo**:
```javascript
// Sin TTL (permanente hasta clear)
Cache.set('user:123', { name: 'Juan' });

// Con TTL de 1 minuto
Cache.set('session:abc', sessionData, 60000);
```

---

#### `Cache.get(key)`

Obtiene un valor del caché.

**Parámetros**:
- `key` (string): Clave del caché

**Retorna**: `any | null` - Valor o null si no existe o expiró

**Ejemplo**:
```javascript
const user = Cache.get('user:123');
if (user) {
    console.log('Usuario:', user.name);
} else {
    console.log('No encontrado o expirado');
}
```

---

#### `Cache.has(key)`

Verifica si existe una clave en caché.

**Parámetros**:
- `key` (string): Clave a verificar

**Retorna**: `boolean` - True si existe y no ha expirado

**Ejemplo**:
```javascript
if (Cache.has('user:123')) {
    const user = Cache.get('user:123');
}
```

---

#### `Cache.delete(key)`

Elimina una entrada del caché.

**Parámetros**:
- `key` (string): Clave a eliminar

**Retorna**: `boolean` - True si se eliminó

**Ejemplo**:
```javascript
Cache.delete('user:123');
```

---

#### `Cache.clear()`

Limpia todo el caché.

**Parámetros**: Ninguno

**Retorna**: `void`

**Ejemplo**:
```javascript
Cache.clear(); // Limpia todo
```

---

#### `Cache.getStats()`

Obtiene estadísticas del caché.

**Parámetros**: Ninguno

**Retorna**: `Object` - Estadísticas
```javascript
{
    size: number,
    hits: number,
    misses: number,
    hitRate: number
}
```

**Ejemplo**:
```javascript
const stats = Cache.getStats();
console.log('Hit rate:', stats.hitRate);
```

---

### StorageOptimizer API

Optimización de localStorage.

#### `StorageOptimizer.set(key, value)`

Almacena un valor optimizado en localStorage.

**Parámetros**:
- `key` (string): Clave de almacenamiento
- `value` (any): Valor a almacenar (será serializado)

**Retorna**: `boolean` - True si se almacenó correctamente

**Ejemplo**:
```javascript
const success = StorageOptimizer.set('preferences', {
    theme: 'dark',
    language: 'es'
});
```

---

#### `StorageOptimizer.get(key)`

Obtiene un valor del localStorage optimizado.

**Parámetros**:
- `key` (string): Clave a obtener

**Retorna**: `any | null` - Valor deserializado o null

**Ejemplo**:
```javascript
const preferences = StorageOptimizer.get('preferences');
if (preferences) {
    console.log('Tema:', preferences.theme);
}
```

---

#### `StorageOptimizer.remove(key)`

Elimina una entrada del localStorage.

**Parámetros**:
- `key` (string): Clave a eliminar

**Retorna**: `void`

**Ejemplo**:
```javascript
StorageOptimizer.remove('old-data');
```

---

#### `StorageOptimizer.clear()`

Limpia todo el localStorage.

**Parámetros**: Ninguno

**Retorna**: `void`

**Ejemplo**:
```javascript
StorageOptimizer.clear();
```

---

#### `StorageOptimizer.optimize()`

Optimiza el localStorage removiendo datos expirados.

**Parámetros**: Ninguno

**Retorna**: `Object` - Resultado de optimización
```javascript
{
    removed: number,
    freed: number // bytes
}
```

**Ejemplo**:
```javascript
const result = StorageOptimizer.optimize();
console.log('Liberados:', result.freed, 'bytes');
```

---

#### `StorageOptimizer.getUsage()`

Obtiene información de uso del localStorage.

**Parámetros**: Ninguno

**Retorna**: `Object` - Información de uso
```javascript
{
    used: number,      // bytes usados
    available: number, // bytes disponibles
    percentage: number // porcentaje usado
}
```

**Ejemplo**:
```javascript
const usage = StorageOptimizer.getUsage();
console.log('Uso:', usage.percentage, '%');
```

---

### LazyLoader API

Carga diferida de módulos.

#### `LazyLoader.load(modulePath)`

Carga un módulo de forma diferida.

**Parámetros**:
- `modulePath` (string): Ruta del módulo a cargar

**Retorna**: `Promise<void>` - Promise que se resuelve cuando se carga

**Ejemplo**:
```javascript
try {
    await LazyLoader.load('js/features/achievements.js');
    console.log('Módulo cargado');
    // Ahora puedes usar AchievementSystem
} catch (error) {
    console.error('Error cargando módulo:', error);
}
```

---

#### `LazyLoader.loadGroup(groupName)`

Carga un grupo de módulos relacionados.

**Parámetros**:
- `groupName` (string): Nombre del grupo ('features', 'ui', etc.)

**Retorna**: `Promise<void>` - Promise que se resuelve cuando todos se cargan

**Ejemplo**:
```javascript
await LazyLoader.loadGroup('features');
// Todos los módulos de features están cargados
```

---

#### `LazyLoader.isLoaded(modulePath)`

Verifica si un módulo está cargado.

**Parámetros**:
- `modulePath` (string): Ruta del módulo

**Retorna**: `boolean` - True si está cargado

**Ejemplo**:
```javascript
if (LazyLoader.isLoaded('js/features/achievements.js')) {
    // Usar el módulo
} else {
    await LazyLoader.load('js/features/achievements.js');
}
```

---

#### `LazyLoader.getLoadedModules()`

Obtiene lista de módulos cargados.

**Parámetros**: Ninguno

**Retorna**: `string[]` - Array de rutas de módulos cargados

**Ejemplo**:
```javascript
const loaded = LazyLoader.getLoadedModules();
console.log('Módulos cargados:', loaded.length);
```

---

## 🎨 Features APIs

### ConversationEnhancer API

Mejora de conversaciones mediante análisis.

#### `ConversationEnhancer.analyzeContext(message, history?)`

Analiza el contexto de una conversación.

**Parámetros**:
- `message` (string): Mensaje actual
- `history` (Array, opcional): Historial de mensajes

**Retorna**: `Object` - Análisis de contexto
```javascript
{
    messageLength: number,
    hasQuestion: boolean,
    emotionalIntensity: number,
    hasEmotionalWords: {
        positive: string[],
        negative: string[],
        intense: string[]
    },
    topicContinuity: number,
    conversationDepth: number
}
```

**Ejemplo**:
```javascript
const context = ConversationEnhancer.analyzeContext(
    '¿Qué debo hacer?',
    [{ content: 'Tengo un problema' }]
);

console.log('Intensidad emocional:', context.emotionalIntensity);
console.log('Tiene pregunta:', context.hasQuestion);
```

---

#### `ConversationEnhancer.improveResponse(response, context)`

Mejora una respuesta basada en el contexto.

**Parámetros**:
- `response` (Object): Respuesta original
- `context` (Object): Contexto de la conversación

**Retorna**: `Object` - Respuesta mejorada

**Ejemplo**:
```javascript
const improved = ConversationEnhancer.improveResponse(
    { whisper: 'Entiendo', reflection: '¿Qué piensas?' },
    { emotionalIntensity: 0.8 }
);
// Retorna respuesta más empática
```

---

#### `ConversationEnhancer.assessSupportNeeds(message)`

Evalúa las necesidades de soporte del usuario.

**Parámetros**:
- `message` (string): Mensaje a evaluar

**Retorna**: `Object` - Evaluación de necesidades
```javascript
{
    needsSupport: boolean,
    supportLevel: 'low' | 'medium' | 'high',
    indicators: string[]
}
```

**Ejemplo**:
```javascript
const needs = ConversationEnhancer.assessSupportNeeds(
    'Me siento muy perdido y no sé qué hacer'
);

if (needs.needsSupport && needs.supportLevel === 'high') {
    // Proporcionar soporte adicional
}
```

---

### JourneyCompletion API

Detección de cierre de conversación.

#### `JourneyCompletion.analyzeCompletion(message, context?)`

Analiza si un mensaje indica cierre de conversación.

**Parámetros**:
- `message` (string): Mensaje a analizar
- `context` (Object, opcional): Contexto adicional

**Retorna**: `Object` - Análisis de completitud
```javascript
{
    completionScore: number,      // 0-100
    indicators: string[],         // Indicadores detectados
    closureType: string,          // Tipo de cierre
    shouldClose: boolean          // Recomendación
}
```

**Ejemplo**:
```javascript
const analysis = JourneyCompletion.analyzeCompletion(
    'Gracias, ahora entiendo todo',
    { oceanState: 'resolved' }
);

if (analysis.shouldClose) {
    const prompt = JourneyCompletion.getClosurePrompt(analysis.closureType);
}
```

---

#### `JourneyCompletion.getClosurePrompt(type)`

Obtiene un prompt de cierre apropiado.

**Parámetros**:
- `type` (string): Tipo de cierre

**Retorna**: `string` - Prompt de cierre

**Ejemplo**:
```javascript
const prompt = JourneyCompletion.getClosurePrompt('clarity_celebration');
// Retorna mensaje de celebración de claridad alcanzada
```

---

## 📊 Tipos de Datos

### EventData
```typescript
interface EventData {
    type: string;
    timestamp: number;
    data: any;
    source?: string;
}
```

### PerformanceMetric
```typescript
interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: number;
    category: 'api' | 'render' | 'interaction';
}
```

### ValidationResult
```typescript
interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitized?: string;
    warnings?: string[];
}
```

### CacheEntry
```typescript
interface CacheEntry {
    value: any;
    timestamp: number;
    ttl?: number;
    hits: number;
}
```

---

## 🔧 Códigos de Error

### Validación
```javascript
VALIDATION_ERROR = 'VALIDATION_ERROR'
INVALID_INPUT = 'INVALID_INPUT'
INPUT_TOO_LONG = 'INPUT_TOO_LONG'
```

### API
```javascript
API_ERROR = 'API_ERROR'
API_TIMEOUT = 'API_TIMEOUT'
API_RATE_LIMIT = 'API_RATE_LIMIT'
```

### Storage
```javascript
STORAGE_FULL = 'STORAGE_FULL'
STORAGE_ERROR = 'STORAGE_ERROR'
```

---

## 📚 Recursos

### Documentación Relacionada
- [Architecture](./ARCHITECTURE.md)
- [Modules](./MODULES.md)
- [Development](./DEVELOPMENT.md)

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

📚 **API Reference completa para desarrollo eficiente**
