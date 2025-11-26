# 🏗️ Architecture - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025  
**Tipo**: Vanilla JavaScript - No Framework

---

## 📋 Resumen Ejecutivo

Whispers of the Wave utiliza una arquitectura modular de 4 capas basada en **Vanilla JavaScript puro**, sin frameworks ni build process. El sistema está diseñado para ser ligero (< 700 KB), performante (< 1s carga) y fácil de mantener.

---

## 🎯 Principios Arquitectónicos

### 1. Simplicidad
- **Vanilla JavaScript**: Sin React, Vue, Angular
- **No Build Process**: Funciona directamente en navegador
- **Zero Dependencies**: Sin npm packages externos

### 2. Modularidad
- **40 módulos independientes**
- **Separación clara de responsabilidades**
- **Bajo acoplamiento, alta cohesión**

### 3. Performance
- **Bundle < 700 KB** (actual: 668.85 KB)
- **Lazy Loading** de módulos no críticos
- **Caché inteligente** en memoria y localStorage

---

## 🏛️ Arquitectura de 4 Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    WHISPERS OF THE WAVE                     │
├─────────────────────────────────────────────────────────────┤
│                      UI LAYER (8 módulos)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Modal     │ │ Suggestions │ │   Themes    │           │
│  │   System    │ │   System    │ │   System    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                  FEATURES LAYER (10 módulos)                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │Achievements │ │     i18n    │ │ Adaptive    │           │
│  │   System    │ │   System    │ │ Assistance  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                    CORE LAYER (16 módulos)                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Event Bus  │ │   Logger    │ │Performance  │           │
│  │             │ │             │ │  Monitor    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                  SERVICES LAYER (6 módulos)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Storage   │ │    Cache    │ │ Lazy Loader │           │
│  │ Optimizer   │ │   Manager   │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Detalle de Capas

### Layer 1: UI Layer (Interfaz de Usuario)

**Responsabilidad**: Componentes visuales e interacción con usuario

**Módulos** (8):
- `modal.js` - Sistema de modales
- `suggestions.js` - Sugerencias contextuales
- `themeSystem.js` - Gestión de temas
- `expressionMetrics.js` - Métricas de expresión
- `security.js` - Validaciones UI
- `splashScreen.js` - Pantalla de carga
- `navigation.js` - Navegación
- `layout.js` - Gestión de layout

**Características**:
- Componentes reutilizables
- Eventos DOM
- Animaciones CSS
- Responsive design

---

### Layer 2: Features Layer (Características)

**Responsabilidad**: Funcionalidades específicas de la aplicación

**Módulos** (10):
- `achievementSystem.js` - Sistema de logros
- `i18n.js` - Internacionalización
- `adaptiveAssistance.js` - Asistencia adaptativa
- `responsePatterns.js` - Patrones de respuesta
- `stateClassifier.js` - Clasificación de estados
- `conversationEnhancer.js` - Mejora de conversaciones
- `journeyCompletion.js` - Detección de cierre
- `emotionalAnalysis.js` - Análisis emocional
- `contextManager.js` - Gestión de contexto
- `feedbackSystem.js` - Sistema de feedback

**Características**:
- Lógica de negocio
- Algoritmos específicos
- Integración con IA
- Análisis de contexto

---

### Layer 3: Core Layer (Núcleo)

**Responsabilidad**: Funcionalidades fundamentales del sistema

**Módulos** (16):
- `eventBus.js` - Sistema de eventos central
- `logger.js` - Sistema de logging
- `performance.js` - Monitor de performance
- `inputValidator.js` - Validación de entrada
- `htmlSanitizer.js` - Sanitización HTML
- `errorHandler.js` - Manejo de errores
- `responseValidator.js` - Validación de respuestas
- `cache.js` - Sistema de caché
- `storageOptimizer.js` - Optimización de storage
- `lazyLoader.js` - Carga diferida
- `appFacade.js` - Fachada de aplicación
- `lazyLoadManager.js` - Gestión de carga
- `events.js` - Definiciones de eventos
- `state.js` - Gestión de estado
- `utils.js` - Utilidades
- `constants.js` - Constantes

**Características**:
- Servicios fundamentales
- Comunicación entre módulos
- Validación y seguridad
- Monitoreo del sistema

---

### Layer 4: Services Layer (Servicios)

**Responsabilidad**: Servicios de infraestructura

**Módulos** (6):
- `apiService.js` - Servicio de API
- `dataService.js` - Servicio de datos
- `configService.js` - Configuración
- `utilsService.js` - Utilidades
- `validationService.js` - Validaciones
- `storageService.js` - Almacenamiento

**Características**:
- Gestión de datos
- Optimización de recursos
- Carga bajo demanda
- Abstracción de servicios

---

## 🔄 Flujos del Sistema

### 1. Flujo Principal de Datos

```
Usuario → Input
   ↓
UI Layer (validación visual)
   ↓
Features Layer (procesamiento)
   ↓
Core Layer (validación + sanitización)
   ↓
Services Layer (API call)
   ↓
Core Layer (caché + storage)
   ↓
Features Layer (mejora de respuesta)
   ↓
UI Layer (renderizado)
   ↓
Usuario ← Output
```

### 2. Flujo de Eventos

```
Módulo A emite evento
   ↓
EventBus (central)
   ↓
Módulos B, C, D (suscritos)
   ↓
Procesamiento paralelo
   ↓
Respuestas independientes
```

### 3. Flujo de Validación

```
Input del usuario
   ↓
InputValidator (longitud, formato)
   ↓
HtmlSanitizer (XSS prevention)
   ↓
ResponseValidator (estructura)
   ↓
Procesamiento seguro
```

---

## 🎨 Patrones de Diseño

### 1. Singleton Pattern

**Usado en**: EventBus, Logger, PerformanceMonitor

```javascript
class EventBus {
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }
        this.events = {};
        EventBus.instance = this;
    }
}
```

**Beneficios**:
- Una sola instancia global
- Estado consistente
- Fácil acceso desde cualquier módulo

---

### 2. Observer Pattern

**Usado en**: EventBus, AchievementSystem, StateClassifier

```javascript
// Suscribirse
EventBus.on('user.message', (data) => {
    console.log('Mensaje:', data);
});

// Emitir
EventBus.emit('user.message', { text: 'Hola' });
```

**Beneficios**:
- Bajo acoplamiento
- Comunicación asíncrona
- Extensibilidad

---

### 3. Facade Pattern

**Usado en**: AppFacade, LazyLoader

```javascript
class AppFacade {
    async initialize() {
        await this.loadCore();
        await this.loadFeatures();
        await this.loadUI();
    }
}
```

**Beneficios**:
- Simplifica interfaces complejas
- Oculta complejidad interna
- Punto de entrada único

---

### 4. Strategy Pattern

**Usado en**: ResponsePatterns, ThemeSystem

```javascript
const strategies = {
    whisper: (text) => makePoetic(text),
    kiro: (text) => makeAnalytical(text)
};

const response = strategies[mode](text);
```

**Beneficios**:
- Intercambio de algoritmos
- Extensibilidad
- Separación de responsabilidades

---

## 🔧 Decisiones Arquitectónicas

### ¿Por qué Vanilla JavaScript?

**Decisión**: No usar frameworks (React, Vue, Angular)

**Razones**:
- ✅ **Performance**: Menor overhead (668 KB vs 2+ MB)
- ✅ **Simplicidad**: Sin build process
- ✅ **Control**: Control total sobre el código
- ✅ **Compatibilidad**: Funciona en cualquier navegador moderno
- ✅ **Mantenibilidad**: Sin dependencias que actualizar

**Trade-offs**:
- ❌ Más código manual para UI
- ❌ Sin ecosistema de componentes
- ✅ Pero: Mayor control y menor complejidad

---

### ¿Por qué Arquitectura de 4 Capas?

**Decisión**: Separar en UI, Features, Core, Services

**Razones**:
- ✅ **Mantenibilidad**: Fácil encontrar y modificar código
- ✅ **Testabilidad**: Cada capa se testea independientemente
- ✅ **Escalabilidad**: Fácil agregar nuevas features
- ✅ **Reutilización**: Módulos reutilizables

**Reglas**:
- UI puede usar Features, Core, Services
- Features puede usar Core, Services
- Core puede usar Services
- Services no depende de nadie

---

### ¿Por qué EventBus Central?

**Decisión**: Usar un bus de eventos para comunicación

**Razones**:
- ✅ **Desacoplamiento**: Módulos no se conocen directamente
- ✅ **Flexibilidad**: Fácil agregar/quitar listeners
- ✅ **Debugging**: Eventos centralizados y logeables
- ✅ **Extensibilidad**: Nuevos módulos se integran fácilmente

**Ejemplo**:
```javascript
// Módulo A emite
EventBus.emit('achievement.unlocked', { id: 'first_chat' });

// Módulo B escucha
EventBus.on('achievement.unlocked', (data) => {
    showNotification(data.id);
});
```

---

### ¿Por qué Lazy Loading?

**Decisión**: Cargar módulos bajo demanda

**Razones**:
- ✅ **Performance**: Carga inicial más rápida (< 1s)
- ✅ **Recursos**: Menor uso de memoria
- ✅ **UX**: Mejor experiencia de usuario
- ✅ **Escalabilidad**: Soporta aplicaciones grandes

**Implementación**:
```javascript
// Cargar módulo cuando se necesita
await LazyLoader.load('js/features/achievements.js');
```

---

## 📊 Métricas de Arquitectura

### Complejidad
```
Módulos totales:      40
Líneas de código:     ~15,000
Archivos JS:          41
Archivos CSS:         1
Dependencias:         0 externas
```

### Performance
```
Bundle size:          668.85 KB
  - JavaScript:       564.83 KB (84%)
  - CSS:              104.02 KB (16%)
Tiempo de carga:      ~400ms
FPS:                  ~60 FPS
```

### Calidad
```
Tests:                111 tests
Cobertura:            50%
Tasa de éxito:        100%
Errores críticos:     0
```

---

## 🔍 Análisis de Dependencias

### Dependencias por Capa

```
Services Layer:
  ← No depende de nadie
  → Provee servicios básicos

Core Layer:
  ← Depende de Services
  → Provee funcionalidades fundamentales

Features Layer:
  ← Depende de Core y Services
  → Implementa lógica de negocio

UI Layer:
  ← Depende de todas las capas
  → Implementa interfaz de usuario
```

### Módulos Críticos

```
1. EventBus       - Centro de comunicación (usado por 35 módulos)
2. Logger         - Debugging y monitoreo (usado por 30 módulos)
3. InputValidator - Seguridad (usado por 15 módulos)
4. HtmlSanitizer  - Seguridad (usado por 12 módulos)
5. Cache          - Performance (usado por 10 módulos)
```

---

## 🚀 Escalabilidad

### Horizontal (Nuevas Features)

```
1. Crear nuevo módulo en Features Layer
2. Usar EventBus para comunicación
3. Seguir convenciones de código
4. Agregar tests
5. Documentar

Ejemplo: Agregar sistema de notificaciones
- Crear js/features/notifications.js
- Escuchar eventos relevantes
- Emitir eventos propios
- Listo!
```

### Vertical (Optimización)

```
1. PerformanceMonitor identifica cuellos de botella
2. Optimizar módulos específicos
3. Agregar caché donde sea necesario
4. Implementar lazy loading
5. Medir mejoras
```

---

## 🔒 Seguridad

### Capas de Validación

```
1. UI Layer:
   - Validación visual
   - Límites de longitud
   - Formato de entrada

2. Core Layer:
   - InputValidator (estructura)
   - HtmlSanitizer (XSS)
   - ResponseValidator (respuestas)

3. Services Layer:
   - API key no expuesta
   - HTTPS only
   - Rate limiting (futuro)
```

### Prevención de XSS

```javascript
// Siempre sanitizar antes de renderizar
const userInput = '<script>alert("XSS")</script>';
const safe = HtmlSanitizer.sanitize(userInput);
element.innerHTML = safe; // Seguro
```

---

## 📈 Roadmap Arquitectónico

### v1.1 (Próximo)
- [ ] Service Worker para offline
- [ ] IndexedDB para storage grande
- [ ] Web Workers para procesamiento pesado
- [ ] Streaming de respuestas

### v2.0 (Futuro)
- [ ] Backend propio (Node.js)
- [ ] WebSockets para real-time
- [ ] Microservicios
- [ ] CDN para assets

---

## 📚 Referencias

### Documentación Relacionada
- [Modules](./MODULES.md) - Detalle de cada módulo
- [API Reference](./API_REFERENCE.md) - APIs públicas
- [Development](./DEVELOPMENT.md) - Guía de desarrollo

### Patrones de Diseño
- [Singleton Pattern](https://refactoring.guru/design-patterns/singleton)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [Facade Pattern](https://refactoring.guru/design-patterns/facade)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)

---

## 📝 Conclusión

La arquitectura de Whispers of the Wave está diseñada para ser:

- ✅ **Simple**: Fácil de entender y mantener
- ✅ **Modular**: Componentes independientes y reutilizables
- ✅ **Performante**: Optimizada para velocidad y eficiencia
- ✅ **Segura**: Múltiples capas de validación
- ✅ **Escalable**: Fácil de extender y modificar

Esta arquitectura ha demostrado ser efectiva con **111 tests pasando al 100%** y un sistema robusto y confiable.

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

🏗️ **Arquitectura sólida para un sistema robusto**
