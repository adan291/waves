# Agente: Sistema de Performance

## Propósito

Documenta la infraestructura de optimización y monitoreo de rendimiento de Whispers of the Wave.

## Componentes

### 1. Logger (`core/logger.js`)

Sistema centralizado de logging con niveles y categorías.

**Niveles:**
- `debug`: Información detallada de desarrollo
- `info`: Información general
- `warn`: Advertencias
- `error`: Errores

**Uso:**
```javascript
Logger.info('App', 'Initializing');
Logger.error('API', 'Failed to fetch', { error: e.message });
```

### 2. Cache (`core/cache.js`)

Caché de respuestas de Gemini API.

**Características:**
- TTL configurable
- Reducción de llamadas duplicadas
- Limpieza automática

**Uso:**
```javascript
const cached = Cache.get(key);
if (!cached) {
    const response = await GeminiService.sendMessage(...);
    Cache.set(key, response, 3600000); // 1 hora
}
```

### 3. PerformanceMonitor (`core/performance.js`)

Monitor de métricas de rendimiento.

**Métricas:**
- Tiempo de inicialización
- Tiempo de respuesta de IA
- Operaciones de storage
- Renderizado de UI

**Uso:**
```javascript
const endTiming = PerformanceMonitor.time('operation_name');
// ... operación ...
endTiming({ success: true });

// Ver reporte
PerformanceMonitor.printReport();
```

### 4. StorageOptimizer (`core/storageOptimizer.js`)

Optimizador de localStorage con compresión.

**Beneficios:**
- Reducción de ~50% en espacio
- Gestión automática de cuotas
- Compresión transparente

**Uso:**
```javascript
StorageOptimizer.set('key', largeObject);
const data = StorageOptimizer.get('key');
const stats = StorageOptimizer.getStats();
```

### 5. LazyLoader (`core/lazyLoader.js`)

Carga diferida de módulos no críticos.

**Módulos Lazy:**
- conversationTags
- historyExport
- quickReactions
- keyboardShortcuts
- speechToText
- historySearch

**Beneficio:** -30% tiempo de carga inicial

## Mejores Prácticas

1. **Usar Logger en desarrollo**: Facilita debugging
2. **Cachear respuestas**: Evita llamadas API duplicadas
3. **Monitorear operaciones lentas**: Identificar cuellos de botella
4. **Comprimir storage**: Maximizar espacio disponible
5. **Lazy load features**: Priorizar carga crítica

## Recursos

- [ARQUITECTURA_DETALLADA.md](./ARQUITECTURA_DETALLADA.md)
