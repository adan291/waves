# Specs Registry

Este directorio contiene el registro central de todas las especificaciones del proyecto.

## ¿Qué es registry.json?

`registry.json` es el índice maestro de todas las specs activas en el proyecto. Cada entrada define:

- **id**: Identificador único de la spec
- **title**: Nombre descriptivo
- **path**: Ruta relativa al directorio de la spec
- **status**: Estado actual (active, draft, archived, completed)
- **owner**: Responsable o equipo
- **created_at**: Fecha de creación
- **files**: Archivos clave de la spec (requirements, design, tasks, etc.)
- **description**: Breve descripción del propósito

## Cómo añadir nuevas specs

1. Crea un nuevo directorio bajo `.kiro/specs/[nombre-spec]/`
2. Añade los archivos mínimos requeridos:
   - `requirements.md` - Requisitos y objetivos
   - `design.md` - Decisiones de diseño
   - `tasks.md` - Tareas e implementación
3. Añade una entrada en `registry.json`:

```json
{
  "id": "mi-nueva-spec",
  "title": "Mi Nueva Spec",
  "path": "../mi-nueva-spec",
  "status": "draft",
  "owner": "team",
  "created_at": "2025-11-15",
  "files": {
    "requirements": "requirements.md",
    "design": "design.md",
    "tasks": "tasks.md"
  },
  "description": "Descripción breve de la spec."
}
```

## Cómo leer y usar el registry

El registry sirve como punto de entrada para:

- **Descubrimiento**: Ver todas las specs disponibles
- **Navegación**: Encontrar rápidamente archivos de una spec
- **Estado**: Conocer qué specs están activas, en borrador o archivadas
- **Documentación**: Entender el propósito de cada spec

Puedes leer el registry programáticamente o manualmente para orientarte en el proyecto.

## Comando para validar

Para verificar que todas las specs registradas tienen sus archivos requeridos:

```bash
node .kiro/specs/whispers-main/scripts/validate_specs.js
```

Este script:
- Lee `registry.json`
- Verifica la existencia de cada archivo declarado
- Reporta qué falta (si algo)
- Retorna exit code 0 si todo está OK, 1 si hay problemas

Ejecuta este comando antes de commits importantes para asegurar la integridad del registry.

## Feature Router

El Feature Router es un sistema de enrutamiento inteligente que analiza la entrada del usuario y determina qué spec debe manejar la solicitud.

### Ubicación de archivos

```
.kiro/specs/whispers-main/
├── router.md          # Documentación completa del router
├── router.js          # Implementación del router
└── rules.json         # Reglas de routing por spec
```

### Cómo funciona

1. **Análisis de entrada**: El router recibe texto del usuario
2. **Cálculo de puntuación**: Evalúa cada spec activa usando:
   - Keywords (40%): Palabras clave que coinciden
   - Intents (40%): Patrones de intención detectados
   - Context (20%): Señales contextuales (estado emocional, conversación previa)
3. **Selección**: Elige la spec con mayor confianza
4. **Context Blueprint**: Genera contexto enriquecido para la spec seleccionada

### Uso básico

```javascript
const FeatureRouter = require('./router.js');
const router = new FeatureRouter();

const result = router.route("Me siento perdido en la vida");
// Returns: { spec, confidence, reason, context_blueprint, alternatives }
```

### Uso desde CLI

```bash
node .kiro/specs/whispers-main/router.js "Me siento perdido"
```

### Cómo extenderlo con nuevas specs

1. **Añade la spec al registry.json** (como se explicó arriba)

2. **Define reglas en rules.json**:
```json
{
  "mi-nueva-spec": {
    "keywords": ["palabra1", "palabra2", "palabra3"],
    "intents": ["intent_type_1", "intent_type_2"],
    "patterns": {
      "intent_type_1": ["patrón 1", "patrón 2"]
    },
    "weight": 1.0,
    "tone": "neutral",
    "response_style": "conversational"
  }
}
```

3. **El router automáticamente la incluye** en el routing

### Configuración avanzada

Edita `_meta` en `rules.json` para ajustar:
- `default_spec`: Spec por defecto cuando confianza es baja
- `confidence_thresholds`: Umbrales de confianza (high, medium, low)
- `scoring_weights`: Pesos de keywords, intents y context

Ver `router.md` para documentación completa, ejemplos y casos de uso.

## Spec Contract & Integration

El sistema define un contrato estándar que todas las specs deben cumplir para integrarse con el Feature Router.

### Ubicación de archivos

```
.kiro/specs/whispers-main/
├── spec_contract.md       # Documentación completa del contrato
├── spec_interface.js      # Clase base para adapters
└── spec_loader.js         # Cargador de adapters

.kiro/specs/[spec-id]/
└── adapter.js             # Implementación del adapter
```

### Arquitectura

```
User Input
    ↓
[Feature Router] ──→ Routing Decision
    ↓
[SpecRequest] ──→ Formato estándar
    ↓
[Spec Adapter] ──→ Procesamiento
    ↓
[SpecResponse] ──→ Formato estándar
    ↓
User Output
```

### Formato de Request (Entrada)

Todas las specs reciben un objeto `SpecRequest`:

```javascript
{
  id: "req-001",                    // UUID único
  timestamp: 1700000000000,         // Unix timestamp
  text: "user input",               // Texto del usuario
  spec: "spec-id",                  // Spec seleccionada
  routing: {                        // Contexto de routing
    confidence: 0.85,
    reason: "explanation",
    alternatives: [...]
  },
  context: {                        // Context blueprint
    detected_intent: "intent_name",
    keywords_matched: [...],
    suggested_pattern: "pattern",
    tone: "empathetic",
    response_style: "poetic"
  },
  conversation: {...},              // Opcional: historial
  user: {...},                      // Opcional: estado usuario
  metadata: {...}                   // Opcional: metadata
}
```

### Formato de Response (Salida)

Todas las specs retornan un objeto `SpecResponse`:

```javascript
{
  success: true,                    // Estado del procesamiento
  spec: "spec-id",                  // Spec que procesó
  request_id: "req-001",            // ID de request original
  timestamp: 1700000150000,         // Timestamp de respuesta
  response: {                       // Datos de respuesta
    text: "response text",
    format: "markdown",
    structured: {...}               // Estructura específica
  },
  metadata: {                       // Metadata obligatoria
    processing_time_ms: 150,
    pattern_used: "pattern_name",
    confidence: 0.9,
    tokens_used: 500
  },
  transition: {...},                // Opcional: sugerir cambio spec
  context_update: {...}             // Opcional: actualizar contexto
}
```

### Crear un Adapter

1. **Extender SpecInterface**:

```javascript
const SpecInterface = require('../whispers-main/spec_interface.js');

class MySpecAdapter extends SpecInterface {
  constructor() {
    super('my-spec-id');
  }

  canHandle(request) {
    // Verificar si puede manejar la request
    return { canHandle: true, confidence: 0.8, reason: "..." };
  }

  async process(request) {
    // Procesar y retornar response
    return this.createSuccessResponse(request, responseData, metadata);
  }

  getCapabilities() {
    // Retornar capacidades
    return { contract_version: '1.0.0', ... };
  }
}
```

2. **Guardar en `.kiro/specs/[spec-id]/adapter.js`**

3. **El SpecLoader lo carga automáticamente**

### Uso del Sistema

```javascript
const { getSpecLoader, processRequest } = require('./spec_loader.js');
const FeatureRouter = require('./router.js');

// 1. Routing
const router = new FeatureRouter();
const routingResult = router.route("Me siento perdido");

// 2. Crear request
const request = router.createRequest("Me siento perdido", routingResult);

// 3. Procesar con adapter
const response = await processRequest(request);

// 4. Usar response
console.log(response.response.text);
```

### Validación y Testing

```bash
# Ver adapters cargados
node .kiro/specs/whispers-main/spec_loader.js

# Probar routing
node .kiro/specs/whispers-main/router.js "texto de prueba"
```

### Transiciones entre Specs

Los adapters pueden sugerir cambiar a otra spec:

```javascript
{
  transition: {
    suggest_spec: "other-spec-id",
    reason: "explanation",
    confidence: 0.75,
    auto_transition: false  // true = automático, false = sugerencia
  }
}
```

### Manejo de Errores

Los adapters retornan errores estructurados:

```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "User-friendly message",
    details: "Technical details",
    recoverable: true,
    fallback_spec: "alternative-spec-id"
  }
}
```

### Mejores Prácticas

1. **Validar requests** antes de procesar
2. **Usar métodos helper** de SpecInterface (`createSuccessResponse`, `createErrorResponse`)
3. **Incluir metadata detallada** para analytics
4. **Sugerir transiciones** solo con confianza >0.6
5. **Manejar errores gracefully** con mensajes user-friendly
6. **Loggear procesamiento** usando `this.log()`

Ver `spec_contract.md` para documentación completa del contrato, ejemplos y casos de uso.
