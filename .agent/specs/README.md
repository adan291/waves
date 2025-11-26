# Índice de Documentación - Whispers of the Wave

## 📋 Resumen

Esta carpeta contiene las especificaciones y agentes de comprensión del proyecto Whispers of the Wave, creados para facilitar el entendimiento de la arquitectura y funcionamiento del sistema.

## 📚 Documentos Disponibles

### 1. [ARQUITECTURA_DETALLADA.md](./ARQUITECTURA_DETALLADA.md)

**Especificación completa de arquitectura**

Contenido:
- Diagrama de arquitectura con Mermaid
- Flujo de datos principal
- Patrones de diseño utilizados (Singleton, Observer, Strategy, Facade, Module, Lazy Loading)
- Componentes clave detallados
- Dependencias entre módulos
- Tecnologías utilizadas
- Métricas del proyecto
- Guías de extensibilidad

**Cuándo usar:** Para entender la estructura general del proyecto y cómo se relacionan los componentes.

### 2. [AGENTE_SISTEMA_IA.md](./AGENTE_SISTEMA_IA.md)

**Agente: Sistema de IA Adaptativa**

Contenido:
- Funcionamiento de AdaptiveAssistance
- StateClassifier y los 6 estados emocionales
- ResponsePatterns y prompts del sistema
- ResponseValidator y reparación de respuestas
- ConversationEnhancer y análisis de contexto
- Transiciones de estado y validaciones
- Integración con Gemini API
- Manejo de errores
- Ejemplos completos de flujo

**Cuándo usar:** Para entender cómo funciona el sistema de IA, cómo clasifica estados y genera respuestas.

### 3. [AGENTE_SISTEMA_OCEANICO.md](./AGENTE_SISTEMA_OCEANICO.md)

**Agente: Sistema de Dinámica del Océano**

Contenido:
- Los 6 estados del océano (confused, anxious, processing, clarity, resolved, neutral)
- Paletas de colores para cada estado (dark/light)
- Análisis emocional de mensajes
- Detección de progresión
- Aplicación visual y animaciones
- Soporte de temas claro/oscuro
- Eventos personalizados
- Sincronización con sistema de IA
- Debugging y testing

**Cuándo usar:** Para entender cómo el océano refleja el estado emocional y se sincroniza con la conversación.

### 4. [AGENTE_PERFORMANCE.md](./AGENTE_PERFORMANCE.md)

**Agente: Sistema de Performance**

Contenido:
- Logger centralizado
- Sistema de caché
- PerformanceMonitor
- StorageOptimizer
- LazyLoader
- Mejores prácticas de optimización

**Cuándo usar:** Para entender las optimizaciones aplicadas y cómo monitorear el rendimiento.

### 5. [FLUJO_DATOS.md](./FLUJO_DATOS.md)

**Guía de Flujo de Datos**

Contenido:
- Flujo principal: Usuario → IA → UI
- Diagrama de secuencia completo
- Procesamiento paso a paso de mensajes
- Flujos secundarios (STT, TTS, logros, sugerencias)
- Gestión de estado global
- Persistencia en localStorage
- Eventos del sistema
- Optimizaciones aplicadas

**Cuándo usar:** Para seguir el recorrido completo de un mensaje desde la entrada del usuario hasta la respuesta en pantalla.

## 🎯 Guía de Uso

### Para Desarrolladores Nuevos

1. Comienza con [ARQUITECTURA_DETALLADA.md](./ARQUITECTURA_DETALLADA.md) para obtener una visión general
2. Lee [FLUJO_DATOS.md](./FLUJO_DATOS.md) para entender el flujo principal
3. Profundiza en [AGENTE_SISTEMA_IA.md](./AGENTE_SISTEMA_IA.md) para entender el cerebro de la app
4. Explora [AGENTE_SISTEMA_OCEANICO.md](./AGENTE_SISTEMA_OCEANICO.md) para entender la parte visual

### Para Modificar el Sistema de IA

1. Lee [AGENTE_SISTEMA_IA.md](./AGENTE_SISTEMA_IA.md) completamente
2. Revisa la sección "Extensión del Sistema"
3. Consulta [FLUJO_DATOS.md](./FLUJO_DATOS.md) para ver cómo se integra

### Para Modificar el Océano

1. Lee [AGENTE_SISTEMA_OCEANICO.md](./AGENTE_SISTEMA_OCEANICO.md)
2. Revisa la sección "Agregar un Nuevo Estado"
3. Consulta `css/waves.css` para las animaciones

### Para Optimización

1. Lee [AGENTE_PERFORMANCE.md](./AGENTE_PERFORMANCE.md)
2. Usa PerformanceMonitor para identificar cuellos de botella
3. Aplica las mejores prácticas documentadas

## 🔗 Recursos Adicionales

### Documentación del Proyecto

- [README.md](../../README.md) - Guía de inicio rápido
- [FEATURES.md](../../FEATURES.md) - Lista completa de funcionalidades
- [CHANGELOG.md](../../CHANGELOG.md) - Historial de cambios
- [docs/](../../docs/) - Documentación técnica adicional

### Código Fuente

- [js/core/](../../js/core/) - Módulos centrales
- [js/engine/](../../js/engine/) - Motor de procesamiento
- [js/services/](../../js/services/) - Servicios externos
- [js/features/](../../js/features/) - Funcionalidades
- [js/ui/](../../js/ui/) - Componentes de UI

## 📊 Diagramas Clave

### Arquitectura General
Ver [ARQUITECTURA_DETALLADA.md](./ARQUITECTURA_DETALLADA.md#diagrama-de-arquitectura)

### Flujo de Datos
Ver [FLUJO_DATOS.md](./FLUJO_DATOS.md#flujo-principal-usuario--ia--ui)

### Procesamiento de IA
Ver [AGENTE_SISTEMA_IA.md](./AGENTE_SISTEMA_IA.md#flujo-de-procesamiento)

### Actualización de Océano
Ver [AGENTE_SISTEMA_OCEANICO.md](./AGENTE_SISTEMA_OCEANICO.md#actualización-del-estado)

## 🎨 Estados del Sistema

### Estados de IA (AdaptiveAssistance)
1. LOST_DIRECTION - Usuario perdido
2. EMOTIONAL_LOW - Estado emocional bajo
3. SEEKING_DECISION - Buscando ayuda para decidir
4. NEED_ORIENTATION - Necesita pasos concretos
5. SELF_EXPRESSION - Expresión personal
6. NEUTRAL_CHAT - Conversación casual

### Estados del Océano (OceanDynamics)
1. confused - Confusión (rojo/rosa, rápido)
2. anxious - Ansiedad (naranja, muy rápido)
3. processing - Procesando (azul claro, medio)
4. clarity - Claridad (cyan, lento)
5. resolved - Resolución (verde/pastel, muy lento)
6. neutral - Neutral (azul profundo, medio)

## 🛠️ Herramientas de Debugging

### Consola del Navegador

```javascript
// Ver estado del océano
OceanDynamics.getCurrentState()

// Forzar estado del océano
OceanDynamics.forceState('clarity')

// Ver historial de estados de IA
AdaptiveAssistance.getInstance().getStateHistory()

// Ver estadísticas
showStats()  // Solo en localhost

// Ver logs
Logger.getLogs()

// Ver reporte de performance
PerformanceMonitor.printReport()
```

## 📝 Notas Importantes

- **Vanilla JavaScript**: Sin frameworks, sin build process
- **Zero Breaking Changes**: Todas las optimizaciones son compatibles hacia atrás
- **Progressive Enhancement**: Funciona sin los sistemas avanzados
- **Privacy First**: Todo almacenado localmente, sin tracking

## 🤝 Contribución

Al modificar el código:
1. Mantén la filosofía de Vanilla JS
2. Documenta cambios significativos
3. Actualiza estos agentes si cambias arquitectura
4. Añade tests en `tests/`
5. Actualiza CHANGELOG.md

---

**Creado:** 2025-11-24  
**Versión:** 1.0  
**Proyecto:** Whispers of the Wave
