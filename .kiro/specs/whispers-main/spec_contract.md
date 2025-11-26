# Spec Contract & Integration

## Propósito

Este documento define el contrato estándar que todas las specs deben cumplir para integrarse con el Feature Router. Establece formatos de entrada/salida, campos obligatorios, reglas de transición y manejo de errores.

## Formato de Entrada (Request)

Todas las specs reciben un objeto `SpecRequest` con la siguiente estructura:

```javascript
{
  // === CAMPOS OBLIGATORIOS ===
  
  id: "unique-request-id",              // UUID generado por el router
  timestamp: 1700000000000,             // Unix timestamp en ms
  text: "user input text",              // Texto original del usuario
  spec: "spec-id",                      // ID de la spec seleccionada
  
  // === ROUTING CONTEXT (obligatorio) ===
  
  routing: {
    confidence: 0.85,                   // Confianza del routing (0-1)
    reason: "explanation",              // Por qué se eligió esta spec
    alternatives: [                     // Otras specs consideradas
      {
        spec: "other-spec-id",
        confidence: 0.45
      }
    ]
  },
  
  // === CONTEXT BLUEPRINT (obligatorio) ===
  
  context: {
    detected_intent: "intent_name",     // Intent detectado
    keywords_matched: ["word1", "word2"], // Keywords que coincidieron
    patterns_matched: ["pattern1"],     // Patrones detectados
    suggested_pattern: "pattern_name",  // Patrón sugerido para usar
    tone: "empathetic",                 // Tono sugerido
    response_style: "poetic",           // Estilo de respuesta
    spec_title: "Spec Title",           // Título de la spec
    spec_description: "Description",    // Descripción de la spec
    confidence_breakdown: {             // Desglose de confianza
      keyword: 0.6,
      intent: 1.0,
      context: 0.2
    }
  },
  
  // === CAMPOS OPCIONALES ===
  
  conversation: {                       // Historial conversacional
    previous_spec: "spec-id",           // Spec usada anteriormente
    message_count: 5,                   // Número de mensajes
    history: [                          // Últimos N mensajes
      {
        role: "user",
        text: "previous message",
        timestamp: 1699999000000
      },
      {
        role: "assistant",
        text: "previous response",
        spec: "spec-id",
        timestamp: 1699999500000
      }
    ]
  },
  
  user: {                               // Estado del usuario
    emotional_state: "confused",        // Estado emocional detectado
    engagement_level: "high",           // Nivel de engagement
    preferences: {                      // Preferencias del usuario
      verbosity: "concise",
      language: "es"
    }
  },
  
  metadata: {                           // Metadata adicional
    source: "web",                      // Origen de la request
    session_id: "session-uuid",         // ID de sesión
    device: "mobile",                   // Tipo de dispositivo
    custom: {}                          // Campos custom por spec
  }
}
```

## Formato de Salida (Response)

Todas las specs deben retornar un objeto `SpecResponse`:

```javascript
{
  // === CAMPOS OBLIGATORIOS ===
  
  success: true,                        // Si el procesamiento fue exitoso
  spec: "spec-id",                      // ID de la spec que procesó
  request_id: "unique-request-id",      // ID de la request original
  timestamp: 1700000000000,             // Unix timestamp de la respuesta
  
  // === RESPONSE DATA (obligatorio si success=true) ===
  
  response: {
    text: "response text",              // Respuesta principal
    format: "markdown",                 // Formato: text, markdown, html
    
    // Estructura específica por spec (opcional)
    structured: {
      whisper: "italic text",           // Para whispers-of-the-wave
      wave: "reflection text",          // Para whispers-of-the-wave
      
      sections: [                       // Para kiro-adaptive-assistance
        {
          title: "Section Title",
          content: "Section content",
          type: "analysis"
        }
      ],
      
      actions: [                        // Acciones sugeridas
        {
          label: "Action label",
          description: "What it does",
          priority: "high"
        }
      ]
    }
  },
  
  // === METADATA (obligatorio) ===
  
  metadata: {
    processing_time_ms: 150,            // Tiempo de procesamiento
    pattern_used: "pattern_name",       // Patrón usado
    confidence: 0.9,                    // Confianza en la respuesta
    tokens_used: 500,                   // Tokens consumidos (si aplica)
  },
  
  // === TRANSITION (opcional) ===
  
  transition: {
    suggest_spec: "other-spec-id",      // Sugerir cambio de spec
    reason: "explanation",              // Por qué sugerir cambio
    confidence: 0.7,                    // Confianza en la sugerencia
    auto_transition: false              // Si debe ser automático
  },
  
  // === ERROR (obligatorio si success=false) ===
  
  error: {
    code: "ERROR_CODE",                 // Código de error
    message: "Human readable message",  // Mensaje para el usuario
    details: "Technical details",       // Detalles técnicos
    recoverable: true,                  // Si es recuperable
    fallback_spec: "spec-id"            // Spec alternativa
  },
  
  // === CONTEXT UPDATE (opcional) ===
  
  context_update: {                     // Actualizar contexto para siguiente mensaje
    emotional_state: "calm",
    engagement_level: "medium",
    custom: {}
  }
}
```

## Campos Obligatorios

### Request (Entrada)
- ✅ `id` - Identificador único
- ✅ `timestamp` - Marca temporal
- ✅ `text` - Texto del usuario
- ✅ `spec` - ID de la spec
- ✅ `routing` - Contexto de routing
- ✅ `context` - Context blueprint

### Response (Salida)
- ✅ `success` - Estado del procesamiento
- ✅ `spec` - ID de la spec
- ✅ `request_id` - ID de la request
- ✅ `timestamp` - Marca temporal
- ✅ `response` (si success=true) - Datos de respuesta
- ✅ `error` (si success=false) - Información de error
- ✅ `metadata` - Metadata de procesamiento

## Campos Opcionales

### Request
- `conversation` - Historial conversacional
- `user` - Estado y preferencias del usuario
- `metadata` - Metadata adicional

### Response
- `response.structured` - Estructura específica por spec
- `transition` - Sugerencia de transición
- `context_update` - Actualización de contexto

## Reglas de Transición entre Specs

### 1. Transición Sugerida (Soft)

Una spec puede sugerir cambiar a otra spec sin forzar el cambio:

```javascript
{
  transition: {
    suggest_spec: "kiro-adaptive-assistance",
    reason: "User needs structured decision support",
    confidence: 0.75,
    auto_transition: false  // Usuario debe confirmar
  }
}
```

**Cuándo usar:**
- La spec actual no es óptima para la necesidad
- Confianza media-alta (>0.6) en la alternativa
- No es crítico cambiar inmediatamente

### 2. Transición Automática (Hard)

Una spec puede forzar el cambio a otra spec:

```javascript
{
  transition: {
    suggest_spec: "kiro-adaptive-assistance",
    reason: "Clear decision-making request detected",
    confidence: 0.9,
    auto_transition: true  // Cambio automático
  }
}
```

**Cuándo usar:**
- La spec actual definitivamente no puede manejar la request
- Confianza muy alta (>0.8) en la alternativa
- Es crítico para la experiencia del usuario

### 3. Continuidad (Default)

Si no hay `transition`, se mantiene la spec actual:

```javascript
{
  // No transition object = mantener spec actual
}
```

### 4. Reglas de Prioridad

1. **Auto-transition** tiene máxima prioridad
2. **Suggest con alta confianza** (>0.8) se muestra prominentemente
3. **Suggest con media confianza** (0.6-0.8) se muestra sutilmente
4. **Suggest con baja confianza** (<0.6) se ignora

### 5. Prevención de Ping-Pong

Para evitar cambios constantes entre specs:

```javascript
// El router debe trackear transiciones recientes
if (lastTransition.from === currentSpec && 
    lastTransition.to === suggestedSpec &&
    timeSinceLastTransition < 60000) {  // 1 minuto
  // Ignorar sugerencia de transición
}
```

## Manejo de Errores

### Tipos de Errores

#### 1. Errores Recuperables

```javascript
{
  success: false,
  error: {
    code: "PROCESSING_TIMEOUT",
    message: "La respuesta está tardando más de lo esperado. ¿Quieres esperar?",
    details: "API timeout after 30s",
    recoverable: true,
    fallback_spec: null  // Reintentar con misma spec
  }
}
```

**Códigos comunes:**
- `PROCESSING_TIMEOUT` - Timeout en procesamiento
- `RATE_LIMIT` - Límite de rate alcanzado
- `TEMPORARY_ERROR` - Error temporal del servicio

#### 2. Errores No Recuperables

```javascript
{
  success: false,
  error: {
    code: "INVALID_REQUEST",
    message: "No pude procesar tu mensaje. ¿Podrías reformularlo?",
    details: "Missing required field: text",
    recoverable: false,
    fallback_spec: "whispers-of-the-wave"  // Usar spec por defecto
  }
}
```

**Códigos comunes:**
- `INVALID_REQUEST` - Request malformada
- `SPEC_NOT_AVAILABLE` - Spec no disponible
- `CAPABILITY_NOT_SUPPORTED` - Capacidad no soportada
- `FATAL_ERROR` - Error fatal interno

#### 3. Errores de Validación

```javascript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Tu mensaje es muy corto. ¿Podrías darme más detalles?",
    details: "Text length < 3 characters",
    recoverable: true,
    fallback_spec: null
  }
}
```

### Estrategia de Fallback

```
Error Detectado
    ↓
¿Es recuperable?
    ├─→ SÍ → Reintentar con misma spec
    │         (máximo 3 intentos)
    │         ↓
    │         ¿Sigue fallando?
    │         ↓
    │         Usar fallback_spec
    │
    └─→ NO → Usar fallback_spec inmediatamente
              ↓
              ¿fallback_spec definida?
              ├─→ SÍ → Usar esa spec
              └─→ NO → Usar default_spec del router
```

## Ejemplos Completos

### Ejemplo 1: Request Emocional Simple

```javascript
// INPUT
{
  id: "req-001",
  timestamp: 1700000000000,
  text: "Me siento perdido",
  spec: "whispers-of-the-wave",
  routing: {
    confidence: 0.85,
    reason: "Emotional keywords detected"
  },
  context: {
    detected_intent: "emotional_support",
    keywords_matched: ["siento", "perdido"],
    suggested_pattern: "emotional_low",
    tone: "empathetic",
    response_style: "poetic"
  }
}

// OUTPUT
{
  success: true,
  spec: "whispers-of-the-wave",
  request_id: "req-001",
  timestamp: 1700000150000,
  response: {
    text: "Como olas que buscan la orilla...",
    format: "markdown",
    structured: {
      whisper: "_Como olas que buscan la orilla_",
      wave: "A veces perderse es el primer paso para encontrarse."
    }
  },
  metadata: {
    processing_time_ms: 150,
    pattern_used: "emotional_low",
    confidence: 0.9
  }
}
```

### Ejemplo 2: Request con Transición Sugerida

```javascript
// INPUT
{
  id: "req-002",
  timestamp: 1700000000000,
  text: "Necesito decidir entre dos opciones",
  spec: "whispers-of-the-wave",
  routing: {
    confidence: 0.45,
    reason: "Low confidence routing"
  },
  context: {
    detected_intent: "unclear",
    keywords_matched: ["decidir", "opciones"],
    suggested_pattern: "clarification",
    tone: "gentle"
  }
}

// OUTPUT
{
  success: true,
  spec: "whispers-of-the-wave",
  request_id: "req-002",
  timestamp: 1700000150000,
  response: {
    text: "Parece que buscas claridad en una decisión...",
    format: "markdown"
  },
  metadata: {
    processing_time_ms: 120,
    pattern_used: "clarification",
    confidence: 0.6
  },
  transition: {
    suggest_spec: "kiro-adaptive-assistance",
    reason: "Decision-making keywords detected - structured approach may help",
    confidence: 0.8,
    auto_transition: false
  }
}
```

### Ejemplo 3: Request con Error Recuperable

```javascript
// INPUT
{
  id: "req-003",
  timestamp: 1700000000000,
  text: "Ayuda",
  spec: "kiro-adaptive-assistance",
  routing: {
    confidence: 0.3,
    reason: "Very low confidence"
  },
  context: {
    detected_intent: "unclear",
    keywords_matched: [],
    suggested_pattern: null,
    tone: "neutral"
  }
}

// OUTPUT
{
  success: false,
  spec: "kiro-adaptive-assistance",
  request_id: "req-003",
  timestamp: 1700000050000,
  error: {
    code: "INSUFFICIENT_CONTEXT",
    message: "Necesito más información para ayudarte. ¿Podrías contarme más sobre lo que necesitas?",
    details: "Text too short and no clear intent detected",
    recoverable: true,
    fallback_spec: "whispers-of-the-wave"
  },
  metadata: {
    processing_time_ms: 50,
    pattern_used: null,
    confidence: 0.0
  }
}
```

### Ejemplo 4: Request con Historial Conversacional

```javascript
// INPUT
{
  id: "req-004",
  timestamp: 1700000000000,
  text: "¿Y cómo empiezo?",
  spec: "kiro-adaptive-assistance",
  routing: {
    confidence: 0.7,
    reason: "Action planning intent with conversation context"
  },
  context: {
    detected_intent: "action_planning",
    keywords_matched: ["empiezo"],
    suggested_pattern: "action_planning",
    tone: "analytical",
    response_style: "structured"
  },
  conversation: {
    previous_spec: "kiro-adaptive-assistance",
    message_count: 3,
    history: [
      {
        role: "user",
        text: "Quiero cambiar de carrera",
        timestamp: 1699999000000
      },
      {
        role: "assistant",
        text: "Entiendo que quieres hacer un cambio...",
        spec: "kiro-adaptive-assistance",
        timestamp: 1699999500000
      }
    ]
  }
}

// OUTPUT
{
  success: true,
  spec: "kiro-adaptive-assistance",
  request_id: "req-004",
  timestamp: 1700000200000,
  response: {
    text: "Para empezar tu cambio de carrera...",
    format: "markdown",
    structured: {
      sections: [
        {
          title: "Paso 1: Autoevaluación",
          content: "Identifica tus habilidades transferibles...",
          type: "action"
        },
        {
          title: "Paso 2: Investigación",
          content: "Explora opciones de carrera...",
          type: "action"
        }
      ],
      actions: [
        {
          label: "Hacer lista de habilidades",
          description: "Documenta tus habilidades actuales",
          priority: "high"
        }
      ]
    }
  },
  metadata: {
    processing_time_ms: 200,
    pattern_used: "action_planning",
    confidence: 0.95
  },
  context_update: {
    engagement_level: "high",
    custom: {
      topic: "career_change",
      stage: "planning"
    }
  }
}
```

## Validación del Contrato

### Validación de Request

```javascript
function validateRequest(request) {
  const required = ['id', 'timestamp', 'text', 'spec', 'routing', 'context'];
  
  for (const field of required) {
    if (!request[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (typeof request.text !== 'string' || request.text.trim().length === 0) {
    throw new Error('Text must be a non-empty string');
  }
  
  if (request.routing.confidence < 0 || request.routing.confidence > 1) {
    throw new Error('Confidence must be between 0 and 1');
  }
  
  return true;
}
```

### Validación de Response

```javascript
function validateResponse(response) {
  const required = ['success', 'spec', 'request_id', 'timestamp', 'metadata'];
  
  for (const field of required) {
    if (response[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (response.success && !response.response) {
    throw new Error('Response data required when success=true');
  }
  
  if (!response.success && !response.error) {
    throw new Error('Error data required when success=false');
  }
  
  return true;
}
```

## Versionado del Contrato

El contrato usa versionado semántico:

- **Major (X.0.0)**: Cambios incompatibles (breaking changes)
- **Minor (1.X.0)**: Nuevos campos opcionales
- **Patch (1.0.X)**: Clarificaciones y correcciones

**Versión actual:** `1.0.0`

Las specs deben declarar qué versión del contrato soportan:

```javascript
class MySpecAdapter extends SpecInterface {
  getCapabilities() {
    return {
      contract_version: "1.0.0",
      // ...
    };
  }
}
```

## Mejores Prácticas

1. **Siempre validar requests** antes de procesar
2. **Usar códigos de error consistentes** para facilitar debugging
3. **Incluir metadata detallada** para analytics y optimización
4. **Sugerir transiciones solo cuando tenga sentido** (confianza >0.6)
5. **Mantener responses concisas** pero informativas
6. **Actualizar contexto** cuando sea relevante para futuros mensajes
7. **Loggear todas las requests/responses** para debugging
8. **Manejar errores gracefully** con mensajes user-friendly
