# Ejemplos de Uso - Sistemas de Optimización

## 🎯 Casos de Uso Prácticos

### 1. Logging en Módulos

#### Antes:
```javascript
function sendMessage(text) {
    console.log('Sending message:', text);
    // ... código ...
    console.log('Message sent successfully');
}
```

#### Después:
```javascript
function sendMessage(text) {
    Logger.info('MessageHandler', 'Sending message', { length: text.length });
    // ... código ...
    Logger.info('MessageHandler', 'Message sent successfully');
}
```

**Beneficios:**
- Logs estructurados y buscables
- Categorización automática
- Filtrado por nivel
- Persistencia opcional

---

### 2. Caché de Respuestas API

#### Antes:
```javascript
async function getAIResponse(message) {
    // Siempre llama a la API
    const response = await geminiService.sendMessage(message);
    return response;
}
```

#### Después:
```javascript
async function getAIResponse(message) {
    // Verifica caché primero
    const cacheKey = { message, context: getCurrentContext() };
    
    const cached = CacheManager.get('ai_response', cacheKey);
    if (cached) {
        Logger.info('AI', 'Using cached response');
        return cached;
    }
    
    // Si no está en caché, llama a la API
    const response = await geminiService.sendMessage(message);
    
    // Guarda en caché por 5 minutos
    CacheManager.set('ai_response', cacheKey, response, 5 * 60 * 1000);
    
    return response;
}
```

**Beneficios:**
- Reduce llamadas API duplicadas
- Respuestas instantáneas para mensajes similares
- Ahorro de costos de API
- Mejor experiencia de usuario

---

### 3. Medición de Performance

#### Antes:
```javascript
async function processMessage(message) {
    const start = Date.now();
    // ... procesamiento ...
    console.log('Took:', Date.now() - start, 'ms');
}
```

#### Después:
```javascript
async function processMessage(message) {
    const end = PerformanceMonitor.time('message_processing');
    
    try {
        // ... procesamiento ...
        end({ success: true, messageLength: message.length });
    } catch (error) {
        end({ success: false, error: error.message });
        throw error;
    }
}
```

**Beneficios:**
- Estadísticas automáticas (avg, median, p95)
- Tracking de memoria
- Alertas de operaciones lentas
- Reportes detallados

---

### 4. Optimización de Storage

#### Antes:
```javascript
function saveConversation(data) {
    localStorage.setItem('conversation', JSON.stringify(data));
}

function loadConversation() {
    const data = localStorage.getItem('conversation');
    return data ? JSON.parse(data) : null;
}
```

#### Después:
```javascript
function saveConversation(data) {
    // Guarda con compresión automática
    StorageOptimizer.setItem('conversation', data, true);
}

function loadConversation() {
    // Descomprime automáticamente
    return StorageOptimizer.getItem('conversation');
}
```

**Beneficios:**
- Compresión automática (~50% reducción)
- Gestión de capacidad
- Limpieza automática
- Evita errores de cuota

---

### 5. Lazy Loading de Features

#### Antes:
```javascript
// Todos los módulos se cargan al inicio
<script src="js/features/quickReactions.js"></script>
<script src="js/features/historySearch.js"></script>
<script src="js/features/speechToText.js"></script>
```

#### Después:
```javascript
// Solo cargar cuando se necesita
async function enableSpeechToText() {
    if (!LazyLoader.isLoaded('js/features/speechToText.js')) {
        await LazyLoader.load('js/features/speechToText.js');
        Logger.info('Features', 'Speech-to-text loaded');
    }
    
    // Ahora usar la feature
    startSpeechRecognition();
}
```

**Beneficios:**
- Carga inicial más rápida (~30%)
- Menor uso de memoria
- Carga progresiva
- Mejor experiencia móvil

---

### 6. Debouncing de Búsqueda

#### Antes:
```javascript
searchInput.addEventListener('input', (e) => {
    // Se ejecuta en cada tecla
    performSearch(e.target.value);
});
```

#### Después:
```javascript
const debouncedSearch = debounce((query) => {
    performSearch(query);
}, 300);

searchInput.addEventListener('input', (e) => {
    // Solo se ejecuta 300ms después de dejar de escribir
    debouncedSearch(e.target.value);
});
```

**Beneficios:**
- Reduce operaciones innecesarias
- Mejor rendimiento
- Menos llamadas API
- Experiencia más fluida

---

### 7. Throttling de Scroll

#### Antes:
```javascript
window.addEventListener('scroll', () => {
    // Se ejecuta cientos de veces por segundo
    updateScrollPosition();
});
```

#### Después:
```javascript
const throttledScroll = throttle(() => {
    updateScrollPosition();
}, 100);

window.addEventListener('scroll', throttledScroll);
```

**Beneficios:**
- Limita ejecuciones a 1 cada 100ms
- Reduce carga de CPU
- Scroll más fluido
- Mejor batería en móviles

---

## 🛠️ Debugging en Desarrollo

### Ver todas las estadísticas:
```javascript
// En consola del navegador
showStats();
```

### Ver logs específicos:
```javascript
Logger.getLogs()
    .filter(log => log.category === 'API')
    .forEach(log => console.log(log));
```

### Ver métricas de performance:
```javascript
PerformanceMonitor.printReport();
```

### Limpiar todo:
```javascript
clearAll(); // Solo en desarrollo
```

---

## 📊 Monitoreo en Producción

### Configurar nivel de logging:
```javascript
// En js/config.performance.js
Logger.setLevel('WARN'); // Solo warnings y errors
```

### Exportar logs para análisis:
```javascript
const logs = Logger.export();
// Enviar a servidor de análisis
```

### Verificar uso de storage:
```javascript
const stats = StorageOptimizer.getStats();
if (parseFloat(stats.percentage) > 80) {
    StorageOptimizer.cleanup();
}
```

---

## 🎯 Mejores Prácticas

### 1. Logging:
- ✅ Usa categorías descriptivas
- ✅ Incluye contexto relevante
- ✅ DEBUG para desarrollo, WARN para producción
- ❌ No loguees datos sensibles

### 2. Caché:
- ✅ Define TTL apropiado según el tipo de dato
- ✅ Usa claves descriptivas
- ✅ Limpia caché cuando sea necesario
- ❌ No cachees datos que cambian frecuentemente

### 3. Performance:
- ✅ Mide operaciones críticas
- ✅ Revisa reportes regularmente
- ✅ Optimiza operaciones lentas
- ❌ No midas todo (overhead)

### 4. Storage:
- ✅ Usa compresión para datos grandes
- ✅ Limpia datos antiguos
- ✅ Monitorea uso de espacio
- ❌ No guardes datos innecesarios

### 5. Lazy Loading:
- ✅ Carga features no críticas bajo demanda
- ✅ Precarga features que se usarán pronto
- ✅ Agrupa módulos relacionados
- ❌ No lazy-load módulos críticos

---

## 🚀 Integración en Nuevos Módulos

### Template para nuevo módulo:
```javascript
/**
 * Mi Nuevo Módulo
 */

const MiModulo = (function() {
    'use strict';

    function operacionCritica(data) {
        // Logging
        Logger.info('MiModulo', 'Iniciando operación', { dataSize: data.length });
        
        // Performance tracking
        const end = PerformanceMonitor.time('mimodulo_operacion');
        
        try {
            // Verificar caché
            const cached = CacheManager.get('mimodulo', data.id);
            if (cached) {
                Logger.debug('MiModulo', 'Usando caché');
                end({ success: true, cached: true });
                return cached;
            }
            
            // Procesar
            const result = procesarDatos(data);
            
            // Guardar en caché
            CacheManager.set('mimodulo', data.id, result, 5 * 60 * 1000);
            
            // Guardar en storage si es necesario
            StorageOptimizer.setItem('mimodulo_result', result, true);
            
            end({ success: true, cached: false });
            return result;
            
        } catch (error) {
            Logger.error('MiModulo', 'Error en operación', { error: error.message });
            end({ success: false, error: error.message });
            throw error;
        }
    }
    
    return {
        operacionCritica
    };
})();
```

---

## 📝 Notas Finales

Todos estos sistemas están diseñados para:
- ✅ Ser opcionales (no rompen nada si no se usan)
- ✅ Tener overhead mínimo
- ✅ Ser fáciles de usar
- ✅ Mantener la filosofía vanilla JS

¡Úsalos donde tengan sentido, no en todos lados!
