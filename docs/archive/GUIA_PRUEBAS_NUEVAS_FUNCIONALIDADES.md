# 🧪 Guía de Pruebas - Nuevas Funcionalidades

**Fecha**: Noviembre 21, 2025  
**Objetivo**: Validar que todas las nuevas funcionalidades funcionan correctamente

---

## 🚀 Inicio Rápido

1. Abre `index.html` en tu navegador
2. Abre la consola del navegador (F12)
3. Sigue las pruebas a continuación

---

## 🔒 Pruebas de Seguridad

### 1. Validación de Entrada

**En la consola del navegador:**

```javascript
// Validar texto
const result = InputValidator.validate('Hola mundo', 'text');
console.log(result);  // { valid: true, sanitized: 'Hola mundo' }

// Validar email
const emailResult = InputValidator.validateEmail('test@example.com');
console.log(emailResult);  // true

// Validar URL
const urlResult = InputValidator.validateURL('https://example.com');
console.log(urlResult);  // true

// Validar JSON
const jsonResult = InputValidator.validateJSON('{"key": "value"}');
console.log(jsonResult);  // true

// Sanitizar texto
const sanitized = InputValidator.sanitizeText('<script>alert("XSS")</script>');
console.log(sanitized);  // &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

**Resultado esperado**: ✅ Todos los validadores funcionan correctamente

### 2. Sanitización de HTML

**En la consola:**

```javascript
// Sanitizar HTML peligroso
const dangerous = '<p>Safe</p><script>alert("XSS")</script>';
const safe = HTMLSanitizer.sanitize(dangerous);
console.log(safe);  // <p>Safe</p>

// Sanitizar respuesta de IA
const response = 'Hola <strong>mundo</strong><script>alert("XSS")</script>';
const sanitized = HTMLSanitizer.sanitizeResponse(response);
console.log(sanitized);  // Hola <strong>mundo</strong>

// Crear elemento seguro
const element = HTMLSanitizer.createElement('a', { href: 'https://example.com' }, 'Link');
console.log(element);  // <a href="https://example.com">Link</a>
```

**Resultado esperado**: ✅ HTML sanitizado correctamente, scripts removidos

---

## 🎨 Pruebas de Funcionalidad

### 1. Exportar Historial

**En la consola:**

```javascript
// Obtener historial
const history = HistoryExport.getHistory();
console.log('Historial:', history);

// Exportar a JSON
const json = HistoryExport.exportToJSON(history);
console.log('JSON:', json);

// Exportar a CSV
const csv = HistoryExport.exportToCSV(history);
console.log('CSV:', csv);

// Exportar a Markdown
const md = HistoryExport.exportToMarkdown(history);
console.log('Markdown:', md);

// Obtener estadísticas
const stats = HistoryExport.getStatistics(history);
console.log('Estadísticas:', stats);

// Descargar JSON
HistoryExport.exportJSON();  // Descarga archivo

// Copiar al portapapeles
HistoryExport.copyJSON().then(() => {
    console.log('Copiado al portapapeles');
});
```

**Resultado esperado**: ✅ Historial exportado en múltiples formatos

### 2. Etiquetas para Conversaciones

**En la consola:**

```javascript
// Obtener etiquetas disponibles
const tags = ConversationTags.getTags();
console.log('Etiquetas:', tags);

// Crear nueva etiqueta
const newTag = ConversationTags.createTag('Urgente', '#FF0000', '🔴');
console.log('Nueva etiqueta:', newTag);

// Agregar etiqueta a conversación
ConversationTags.addTag('conv-123', 'work');
console.log('Etiqueta agregada');

// Obtener etiquetas de conversación
const convTags = ConversationTags.getConversationTags('conv-123');
console.log('Etiquetas de conversación:', convTags);

// Obtener conversaciones por etiqueta
const workConvs = ConversationTags.getConversationsByTag('work');
console.log('Conversaciones de trabajo:', workConvs);

// Obtener estadísticas
const tagStats = ConversationTags.getTagStatistics('work');
console.log('Estadísticas de etiqueta:', tagStats);

// Obtener todas las estadísticas
const allStats = ConversationTags.getAllStatistics();
console.log('Todas las estadísticas:', allStats);
```

**Resultado esperado**: ✅ Etiquetas creadas, asignadas y filtradas correctamente

### 3. Notificaciones Toast

**En la consola:**

```javascript
// Mostrar notificación info
ToastNotifications.info('Este es un mensaje informativo');

// Mostrar notificación success
ToastNotifications.success('Operación completada exitosamente');

// Mostrar notificación warning
ToastNotifications.warning('Esto es una advertencia');

// Mostrar notificación error
ToastNotifications.error('Ocurrió un error');

// Obtener cantidad de notificaciones
console.log('Notificaciones activas:', ToastNotifications.getCount());

// Limpiar todas las notificaciones
ToastNotifications.clearAll();
console.log('Notificaciones limpiadas');
```

**Resultado esperado**: ✅ Notificaciones aparecen en la esquina superior derecha con animaciones

### 4. Dashboard de Estadísticas

**En la consola:**

```javascript
// Mostrar modal de estadísticas
StatsUI.show();

// Obtener estadísticas
const stats = StatsUI.getStats();
console.log('Estadísticas:', stats);

// Exportar estadísticas como JSON
const statsJson = StatsUI.exportStats();
console.log('JSON de estadísticas:', statsJson);

// Exportar estadísticas como CSV
const statsCSV = StatsUI.exportStatsCSV();
console.log('CSV de estadísticas:', statsCSV);
```

**Resultado esperado**: ✅ Modal de estadísticas muestra datos correctamente

---

## 🏗️ Pruebas de Arquitectura

### 1. Bus de Eventos

**En la consola:**

```javascript
// Suscribirse a evento
EventBus.on('test:event', (data) => {
    console.log('Evento recibido:', data);
});

// Emitir evento
EventBus.emit('test:event', { message: 'Hola' });

// Suscribirse una sola vez
EventBus.once('test:once', (data) => {
    console.log('Evento único:', data);
});

EventBus.emit('test:once', { message: 'Primera vez' });
EventBus.emit('test:once', { message: 'Segunda vez' });  // No se ejecuta

// Obtener información de debug
const debugInfo = EventBus.getDebugInfo();
console.log('Debug info:', debugInfo);

// Obtener nombres de eventos
const eventNames = EventBus.getEventNames();
console.log('Eventos registrados:', eventNames);

// Obtener cantidad de listeners
const count = EventBus.getListenerCount('test:event');
console.log('Listeners para test:event:', count);
```

**Resultado esperado**: ✅ Bus de eventos funciona correctamente

---

## 📱 Pruebas de Responsividad

### Desktop (1920px+)
- [ ] Todos los elementos visibles
- [ ] Notificaciones en esquina superior derecha
- [ ] Modal de estadísticas centrado
- [ ] Botones accesibles

### Tablet (768px-1366px)
- [ ] Interfaz adaptada
- [ ] Notificaciones visibles
- [ ] Modal responsive
- [ ] Texto legible

### Mobile (320px-768px)
- [ ] Interfaz optimizada
- [ ] Notificaciones adaptadas
- [ ] Modal en pantalla completa
- [ ] Botones táctiles

---

## 🌐 Pruebas Cross-Browser

### Chrome/Edge
- [ ] Todos los módulos cargan
- [ ] Notificaciones funcionan
- [ ] Exportación funciona
- [ ] Etiquetas funcionan

### Firefox
- [ ] Todos los módulos cargan
- [ ] Notificaciones funcionan
- [ ] Exportación funciona
- [ ] Etiquetas funcionan

### Safari
- [ ] Todos los módulos cargan
- [ ] Notificaciones funcionan
- [ ] Exportación funciona
- [ ] Etiquetas funcionan

---

## 🔍 Pruebas de Integración

### 1. Flujo Completo de Mensaje

```javascript
// 1. Validar entrada
const input = 'Hola, ¿cómo estás?';
const validation = InputValidator.validate(input, 'text');

// 2. Si es válido, emitir evento
if (validation.valid) {
    EventBus.emit('message:sent', { text: validation.sanitized });
    
    // 3. Mostrar notificación
    ToastNotifications.success('Mensaje enviado');
}
```

### 2. Flujo de Exportación

```javascript
// 1. Obtener historial
const history = HistoryExport.getHistory();

// 2. Validar que hay datos
if (history.length > 0) {
    // 3. Exportar
    HistoryExport.exportJSON();
    
    // 4. Mostrar notificación
    ToastNotifications.success('Historial exportado');
} else {
    ToastNotifications.warning('No hay historial para exportar');
}
```

### 3. Flujo de Etiquetas

```javascript
// 1. Crear etiqueta
const tag = ConversationTags.createTag('Importante', '#FF0000', '⭐');

// 2. Si se creó, agregar a conversación
if (tag) {
    ConversationTags.addTag('conv-123', tag.id);
    
    // 3. Mostrar notificación
    ToastNotifications.success('Etiqueta agregada');
} else {
    ToastNotifications.error('No se pudo crear la etiqueta');
}
```

---

## 📊 Checklist de Validación

### Seguridad
- [ ] InputValidator valida correctamente
- [ ] HTMLSanitizer sanitiza HTML
- [ ] No hay XSS en respuestas
- [ ] Validación de tipos funciona

### Funcionalidad
- [ ] Exportar historial funciona
- [ ] Etiquetas se crean y asignan
- [ ] Notificaciones aparecen
- [ ] Estadísticas se muestran

### Arquitectura
- [ ] Bus de eventos funciona
- [ ] Módulos se cargan correctamente
- [ ] Sin errores en consola
- [ ] Rendimiento aceptable

### Compatibilidad
- [ ] Funciona en Chrome
- [ ] Funciona en Firefox
- [ ] Funciona en Safari
- [ ] Funciona en Edge

### Responsividad
- [ ] Desktop (1920px+)
- [ ] Tablet (768px-1366px)
- [ ] Mobile (320px-768px)

---

## 🐛 Solución de Problemas

### Módulos no cargan
**Solución**: Verificar que `index.html` incluye todos los scripts

### Notificaciones no aparecen
**Solución**: Verificar que `toastNotifications.js` está cargado

### Exportación no funciona
**Solución**: Verificar que `historyExport.js` está cargado

### Etiquetas no se guardan
**Solución**: Verificar que localStorage está habilitado

### Bus de eventos no funciona
**Solución**: Verificar que `eventBus.js` está cargado

---

## 📝 Reporte de Pruebas

Después de completar todas las pruebas, crear un reporte:

```markdown
# Reporte de Pruebas - [Fecha]

## Resumen
- Pruebas ejecutadas: X
- Pruebas pasadas: X
- Pruebas fallidas: X
- Tasa de éxito: X%

## Detalles
- Seguridad: ✅/❌
- Funcionalidad: ✅/❌
- Arquitectura: ✅/❌
- Compatibilidad: ✅/❌
- Responsividad: ✅/❌

## Problemas encontrados
- [Problema 1]
- [Problema 2]

## Recomendaciones
- [Recomendación 1]
- [Recomendación 2]
```

---

## 🎯 Próximos Pasos

1. ✅ Completar todas las pruebas
2. ✅ Documentar resultados
3. ✅ Reportar problemas
4. ⏳ Ejecutar Fase 3 (Optimización)

---

**Guía de pruebas**: Noviembre 21, 2025  
**Versión**: 1.0

*Valida que todas las nuevas funcionalidades funcionan correctamente*
