# Performance & Infrastructure Tests

## 🧪 Suite de Pruebas

Este directorio contiene pruebas para los nuevos sistemas de optimización.

## 📋 Archivos de Prueba

### `performance_test.html`
Suite completa de pruebas para todos los sistemas de infraestructura.

**Sistemas probados:**
- ✅ Logger (logging centralizado)
- ✅ CacheManager (sistema de caché)
- ✅ PerformanceMonitor (monitoreo de rendimiento)
- ✅ StorageOptimizer (optimización de localStorage)
- ✅ LazyLoader (carga bajo demanda)
- ✅ Utilities (debounce, throttle, etc.)

## 🚀 Cómo Ejecutar

### Opción 1: Abrir directamente
```bash
# Windows
start tests/performance_test.html

# Mac/Linux
open tests/performance_test.html
```

### Opción 2: Con servidor local
```bash
# Python 3
python -m http.server 8000

# Luego visita:
# http://localhost:8000/tests/performance_test.html
```

## 📊 Qué Probar

### 1. Logger System
- Click "Test Logger" → Genera logs de prueba
- Click "Show Logs" → Muestra logs estructurados
- Click "Clear Logs" → Limpia logs

**Verificar:**
- ✅ Logs aparecen en consola con formato
- ✅ Logs se muestran estructurados
- ✅ Limpieza funciona

### 2. Cache System
- Click "Test Cache" → Guarda datos en caché
- Click "Show Stats" → Muestra estadísticas
- Espera 2 segundos → Verifica expiración
- Click "Clear Cache" → Limpia caché

**Verificar:**
- ✅ Datos se guardan y recuperan
- ✅ TTL funciona (datos expiran)
- ✅ Estadísticas son correctas

### 3. Performance Monitor
- Click "Test Performance" → Ejecuta operaciones
- Click "Show Report" → Muestra métricas
- Click "Clear Metrics" → Limpia métricas

**Verificar:**
- ✅ Operaciones se miden
- ✅ Operaciones lentas se detectan (>1s)
- ✅ Estadísticas son correctas (avg, median, p95)

### 4. Storage Optimizer
- Click "Test Storage" → Guarda/recupera datos
- Click "Show Stats" → Muestra uso de storage
- Click "Test Compression" → Prueba compresión

**Verificar:**
- ✅ Datos se guardan y recuperan correctamente
- ✅ Compresión reduce tamaño (~40-60%)
- ✅ Descompresión es correcta

### 5. Lazy Loader
- Click "Test Lazy Loading" → Intenta cargar módulos
- Click "Show Loaded" → Muestra módulos cargados

**Verificar:**
- ✅ Sistema funciona (aunque módulos no existan en test)
- ✅ Tracking de módulos funciona

### 6. Utilities
- Click "Test Debounce" → Prueba debouncing
- Click "Test Throttle" → Prueba throttling

**Verificar:**
- ✅ Debounce ejecuta solo 1 vez
- ✅ Throttle limita ejecuciones

## ✅ Resultados Esperados

### Todos los tests deben:
- ✅ Mostrar mensaje de éxito (verde)
- ✅ No generar errores en consola
- ✅ Actualizar estadísticas en tiempo real

### Estadísticas Overall:
- Cached Items: Aumenta con uso
- Storage Used: Muestra porcentaje
- Log Entries: Aumenta con actividad
- Loaded Modules: Muestra módulos cargados

## 🐛 Troubleshooting

### "Module not found" en Lazy Loader
**Normal:** Los módulos no existen en el contexto de test. El sistema funciona correctamente en la app principal.

### Compresión no reduce tamaño
**Verificar:** Texto de prueba debe ser largo y repetitivo para ver compresión efectiva.

### Performance metrics vacías
**Solución:** Ejecuta "Test Performance" primero, luego "Show Report".

## 📝 Notas

- Los tests son independientes entre sí
- Puedes ejecutarlos en cualquier orden
- Las estadísticas se actualizan cada 2 segundos
- Los datos de test no afectan la aplicación principal

## 🎯 Integración con App Principal

Para probar en la aplicación real:

1. Abre `index.html` (aplicación principal)
2. Abre consola del navegador (F12)
3. Ejecuta comandos de verificación:

```javascript
// Ver estadísticas
showStats();

// Ver logs
Logger.getLogs();

// Ver performance
PerformanceMonitor.printReport();

// Ver caché
CacheManager.getStats();

// Ver storage
StorageOptimizer.getStats();
```

## 🚀 Próximos Tests

Ideas para tests adicionales:

- [ ] Test de integración con GeminiService
- [ ] Test de lazy loading en app real
- [ ] Test de caché con datos reales
- [ ] Test de performance bajo carga
- [ ] Test de storage con datos grandes

## 📚 Documentación

Ver documentación completa en:
- `docs/MEJORAS_TECNICAS_2025.md` - Documentación técnica
- `docs/EJEMPLOS_USO.md` - Ejemplos prácticos
- `MEJORAS_RESUMEN.md` - Resumen ejecutivo
