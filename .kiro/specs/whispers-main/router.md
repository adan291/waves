# Feature Router

## Propósito

El Feature Router es un sistema de enrutamiento inteligente que analiza la entrada del usuario y determina qué spec (feature) debe manejar la solicitud. Actúa como un dispatcher central que conecta las intenciones del usuario con las capacidades especializadas del sistema.

## Flujo de Decisión

```
User Input
    ↓
[Tokenización y Análisis]
    ↓
[Carga de Registry + Rules]
    ↓
[Cálculo de Puntuación por Spec]
    ├─→ Keywords Match (40%)
    ├─→ Intent Detection (40%)
    └─→ Context Signals (20%)
    ↓
[Selección de Spec con Mayor Confianza]
    ↓
[Generación de Context Blueprint]
    ↓
Output: { spec, confidence, reason, context_blueprint }
```

## Formato de Entrada

```javascript
// Entrada simple
router.route("Me siento perdido en la vida");

// Entrada con contexto adicional
router.route("¿Qué debería hacer?", {
  previousSpec: "whispers-of-the-wave",
  conversationLength: 5,
  emotionalState: "confused"
});
```

## Formato de Salida

```javascript
{
  spec: "whispers-of-the-wave",           // ID de la spec seleccionada
  confidence: 0.85,                        // Confianza (0-1)
  reason: "Detected emotional introspection keywords", // Explicación
  context_blueprint: {                     // Contexto para la spec
    detected_intent: "emotional_support",
    keywords_matched: ["perdido", "vida"],
    suggested_pattern: "life_questioning",
    tone: "empathetic"
  },
  alternatives: [                          // Otras opciones consideradas
    {
      spec: "kiro-adaptive-assistance",
      confidence: 0.45,
      reason: "Decision-making keywords present"
    }
  ]
}
```

## Reglas Base de Routing

### 1. Threshold de Confianza
- **Alta confianza** (>0.7): Routing directo
- **Media confianza** (0.4-0.7): Sugerir spec pero permitir override
- **Baja confianza** (<0.4): Usar spec por defecto o preguntar al usuario

### 2. Priorización
- Keywords explícitos tienen mayor peso
- Intents detectados complementan la decisión
- Contexto previo influye en casos ambiguos

### 3. Fallback
- Si ninguna spec alcanza threshold mínimo → usar spec por defecto
- Spec por defecto: `whispers-of-the-wave` (experiencia base)

### 4. Continuidad Conversacional
- Si confianza es baja pero hay `previousSpec` → mantener continuidad
- Cambio de spec solo si nueva confianza supera la anterior por >0.3

## Ejemplos de Uso

### Ejemplo 1: Routing Emocional
```javascript
const result = router.route("Me siento solo y no sé qué hacer con mi vida");

// Output:
{
  spec: "whispers-of-the-wave",
  confidence: 0.92,
  reason: "Strong emotional keywords: solo, no sé, vida",
  context_blueprint: {
    detected_intent: "emotional_support",
    keywords_matched: ["solo", "vida", "no sé"],
    suggested_pattern: "life_questioning",
    tone: "empathetic",
    response_style: "poetic"
  }
}
```

### Ejemplo 2: Routing de Decisión
```javascript
const result = router.route("Tengo que elegir entre dos trabajos, ¿cómo decido?");

// Output:
{
  spec: "kiro-adaptive-assistance",
  confidence: 0.88,
  reason: "Decision-making intent with clear options",
  context_blueprint: {
    detected_intent: "decision_support",
    keywords_matched: ["elegir", "decidir", "trabajos"],
    suggested_pattern: "decision_matrix",
    tone: "analytical",
    response_style: "structured"
  }
}
```

### Ejemplo 3: Routing Ambiguo
```javascript
const result = router.route("¿Qué hago?");

// Output:
{
  spec: "whispers-of-the-wave",
  confidence: 0.35,
  reason: "Low confidence - using default spec",
  context_blueprint: {
    detected_intent: "unclear",
    keywords_matched: [],
    suggested_pattern: "clarification",
    tone: "gentle",
    needs_clarification: true
  },
  alternatives: [
    {
      spec: "kiro-adaptive-assistance",
      confidence: 0.30,
      reason: "Could be action-oriented"
    }
  ]
}
```

## Integración con Registry

El router se integra con `registry.json` de las siguientes formas:

### 1. Carga Dinámica de Specs
```javascript
// Lee registry.json para conocer specs disponibles
const specs = loadRegistry();
// Solo enruta a specs con status: "active"
const activeSpecs = specs.filter(s => s.status === "active");
```

### 2. Validación de Specs
```javascript
// Verifica que la spec seleccionada existe en el registry
if (!registry.find(s => s.id === selectedSpec)) {
  throw new Error(`Spec ${selectedSpec} not found in registry`);
}
```

### 3. Metadata Enriquecida
```javascript
// Usa información del registry para enriquecer el routing
const specInfo = registry.find(s => s.id === selectedSpec);
context_blueprint.spec_title = specInfo.title;
context_blueprint.spec_description = specInfo.description;
```

### 4. Extensibilidad
```javascript
// Nuevas specs se añaden al registry y automáticamente
// están disponibles para routing (si tienen rules definidas)
// No requiere cambios en el código del router
```

## Cómo Extender el Router

### Añadir Nueva Spec

1. **Registrar en registry.json**
```json
{
  "id": "nueva-spec",
  "title": "Nueva Feature",
  "status": "active",
  ...
}
```

2. **Definir reglas en rules.json**
```json
{
  "nueva-spec": {
    "keywords": ["palabra1", "palabra2"],
    "intents": ["intent_type"],
    "weight": 1.0
  }
}
```

3. **El router automáticamente la incluye**

### Añadir Nuevos Intents

Edita `rules.json` y añade nuevos intents a las specs existentes:

```json
{
  "whispers-of-the-wave": {
    "intents": [
      "emotional_support",
      "life_questioning",
      "nuevo_intent"  // ← Añadir aquí
    ]
  }
}
```

### Personalizar Scoring

Modifica los pesos en `router.js`:

```javascript
const WEIGHTS = {
  keywords: 0.40,    // 40% peso a keywords
  intents: 0.40,     // 40% peso a intents
  context: 0.20      // 20% peso a contexto
};
```

## Arquitectura

```
.kiro/specs/whispers-main/
├── registry.json          # Specs disponibles
├── rules.json             # Reglas de routing
├── router.js              # Lógica del router
└── router.md              # Esta documentación
```

## Consideraciones de Diseño

### Performance
- Carga lazy de rules solo cuando se necesita
- Cache de regex compilados para keywords
- Scoring optimizado para < 10ms

### Mantenibilidad
- Reglas separadas del código (rules.json)
- Fácil añadir nuevas specs sin tocar código
- Logging detallado para debugging

### Escalabilidad
- Soporta N specs sin cambios arquitectónicos
- Reglas pueden crecer sin impacto en performance
- Context blueprint extensible por spec

## Testing

```javascript
// Test básico
const router = new FeatureRouter();
const result = router.route("texto de prueba");
assert(result.spec !== null);
assert(result.confidence >= 0 && result.confidence <= 1);

// Test con contexto
const result2 = router.route("texto", { previousSpec: "spec-id" });
assert(result2.context_blueprint !== null);
```

## Futuras Mejoras

- [ ] Machine Learning para mejorar scoring
- [ ] A/B testing de reglas
- [ ] Analytics de routing decisions
- [ ] Multi-spec routing (combinar múltiples specs)
- [ ] User feedback loop para ajustar reglas
- [ ] Soporte para regex avanzado en keywords
- [ ] Intent detection con NLP
