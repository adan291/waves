# FASE 2 — Life Questioning Engine

## ✅ IMPLEMENTACIÓN COMPLETA

El **Life Questioning Engine** ha sido creado e integrado exitosamente en Whispers of the Wave.

---

## 📦 MÓDULOS CREADOS

### 1. `js/engine/life_questions.js`
**Módulo principal del Life Questioning Engine**

#### Características:
- **20 preguntas maestras** divididas en 4 niveles:
  - **Nivel 1: Exploration** (5 preguntas de superficie)
  - **Nivel 2: Depth** (5 preguntas emocionales)
  - **Nivel 3: Identity** (5 preguntas de identidad)
  - **Nivel 4: Action** (5 preguntas prácticas)

#### Funciones principales:
- `detectLifeQuestioningTrigger(message)` - Detecta si el mensaje activa el modo
- `startLifeQuestioningSession(theme)` - Inicia una sesión
- `getNextQuestion()` - Obtiene la siguiente pregunta
- `processLifeQuestioningResponse(response)` - Procesa respuesta y avanza
- `endLifeQuestioningSession()` - Finaliza y genera resumen
- `getLifeQuestioningState()` - Obtiene estado actual
- `resetLifeQuestioningState()` - Resetea el estado

#### Triggers de activación:
```javascript
- "no sé qué hacer"
- "qué estudiar"
- "qué carrera"
- "duda personal"
- "no tengo claro"
- "estoy perdido"
- "confundido con mi vida"
- "qué camino"
- "dirección"
- "propósito"
- "sentido de vida"
- "qué hacer con mi vida"
```

#### Flujo de sesión:
1. Usuario dice trigger → Sesión inicia
2. Sistema hace 2 preguntas por nivel
3. Avanza automáticamente entre niveles
4. Después de 7 preguntas → Genera resumen
5. Resumen incluye:
   - Resumen emocional
   - Acción sugerida
   - Pregunta de continuación
   - Trigger interno: `{ google_action: 'continue_scene' }`

---

## 🔧 MÓDULOS ACTUALIZADOS

### 2. `js/prompts_master.js`
**Añadidos prompts para Life Questioning**

#### Nuevos prompts:
- `LIFE_QUESTIONING_PROMPTS.base` - Prompt para preguntas
- `LIFE_QUESTIONING_PROMPTS.session_end` - Prompt para resumen final

#### Nuevas funciones:
- `getLifeQuestioningPrompt(stage)` - Obtiene prompt según etapa
- `detectSessionPattern(message)` - Detecta patrones de sesión

#### Patrones de sesión:
```javascript
SESSION_PATTERNS = {
    life_questioning: [...],
    emotional_exploration: [...],
    scene_continuation: [...]
}
```

### 3. `js/engine/parser.js`
**Soporte para Life Questioning**

#### Cambios:
- `validateResponse()` ahora acepta `'life_questioning'` como persona
- Mismo formato JSON que Kiro (whisper + reflection)

### 4. `js/main.js`
**Integración del Life Questioning Engine**

#### Cambios en `handleUserMessage()`:
1. Detecta trigger de Life Questioning
2. Inicia sesión si se detecta
3. Usa prompt especial si sesión activa
4. Procesa respuestas y avanza niveles
5. Genera resumen al finalizar
6. No cambia de persona durante sesión

#### Flujo actualizado:
```
Usuario envía mensaje
  ↓
¿Trigger de Life Questioning?
  ↓ Sí
Inicia sesión → Usa prompt LQ → Procesa respuesta → Avanza nivel
  ↓
¿Sesión terminada?
  ↓ Sí
Genera resumen → Resetea estado → Vuelve a modo normal
```

### 5. `index.html` y `test_integration.html`
**Carga del nuevo módulo**

```html
<script src="js/engine/life_questions.js"></script>
```

---

## 🎯 CÓMO FUNCIONA

### Ejemplo de conversación:

**Usuario:** "No sé qué estudiar"

**Sistema:** 
- Detecta trigger ✅
- Inicia sesión de Life Questioning
- Nivel: Exploration

**Kiro (LQ Mode):**
```json
{
  "whisper": "El océano escucha tu búsqueda con paciencia infinita.",
  "reflection": "¿Qué es lo que más te inquieta cuando piensas en tu futuro?"
}
```

**Usuario:** "Me da miedo equivocarme"

**Kiro (LQ Mode):**
```json
{
  "whisper": "Hay una corriente de miedo que atraviesa tus palabras...",
  "reflection": "¿Qué miedo se esconde detrás de esa duda?"
}
```

*[Continúa por 5-7 preguntas más]*

**Kiro (Session End):**
```json
{
  "whisper": "Hay una corriente de miedo que atraviesa tus palabras, como olas que dudan antes de romper en la orilla. Pero también hay destellos de luz cuando hablas de lo que amas.",
  "reflection": "Quizás el primer paso no es eliminar el miedo, sino caminar con él. ¿Qué pequeña acción podrías tomar hoy, incluso con miedo?\n\n¿Quieres explorar más profundo, o prefieres que el océano te acompañe en silencio por un momento?"
}
```

---

## 🧪 TESTING

### Test manual en consola:
```javascript
// Test completo del módulo
testLifeQuestionsModule();

// Test individual
detectLifeQuestioningTrigger('No sé qué estudiar'); // true
startLifeQuestioningSession('career');
processLifeQuestioningResponse('Me da miedo...');
getLifeQuestioningState();
```

### Test de integración:
1. Abre `index.html` o `test_integration.html`
2. Escribe: "No sé qué hacer con mi vida"
3. Observa que Kiro entra en modo Life Questioning
4. Responde a las preguntas
5. Verifica que genera resumen al final

---

## 📊 ESTADO DEL SISTEMA

### Estructura de estado:
```javascript
lifeQuestioningState = {
    active: boolean,           // ¿Sesión activa?
    currentLevel: string,      // 'exploration', 'depth', 'identity', 'action'
    questionCount: number,     // Número de preguntas hechas
    userResponses: Array,      // Respuestas del usuario
    startedAt: timestamp,      // Cuándo inició
    theme: string             // 'career', 'purpose', 'identity', 'decision'
}
```

---

## 🎨 CARACTERÍSTICAS ESPECIALES

### 1. Progresión automática
- Avanza de nivel después de 2 preguntas
- Termina después de 7 preguntas total

### 2. Análisis temático
- Extrae temas de las respuestas (miedo, confusión, pasión, presión, identidad)
- Genera resumen personalizado basado en temas

### 3. Tono oceánico
- Todas las preguntas y respuestas mantienen metáforas marinas
- Lenguaje poético y contemplativo

### 4. Trigger interno
- Al finalizar, incluye `{ google_action: 'continue_scene' }`
- Permite continuidad con el sistema narrativo

---

## ✅ PRÓXIMOS PASOS

### PASO 2: Probar con conversación real
Usa esta frase exacta para probar:
```
"No sé qué hacer con mi vida, estoy muy confundido"
```

### PASO 3: Iteración creativa
- Hacer preguntas más humanas
- Ajustar progresión de niveles
- Mejorar análisis temático

### PASO 4: Integración UI
- Botón para activar modo manualmente
- Indicador visual de modo Life Questioning
- Barra de progreso de sesión
- Estilo visual oceánico especial

---

## 📝 NOTAS TÉCNICAS

### Dependencias:
- `js/engine/parser.js` - Para validación
- `js/prompts_master.js` - Para prompts
- `js/core/state.js` - Para estado global
- `js/services/geminiService.js` - Para API

### Compatibilidad:
- ✅ Funciona con sistema Narrador/Kiro existente
- ✅ No interfiere con modo normal
- ✅ Se puede activar/desactivar dinámicamente
- ✅ Mantiene historial de conversación

### Performance:
- Ligero (< 10KB)
- Sin dependencias externas
- Funciones puras y testeables

---

## 🎉 CONCLUSIÓN

El **Life Questioning Engine** está completamente implementado e integrado. Es un módulo independiente que se activa automáticamente cuando el usuario expresa confusión vital, y guía al usuario a través de 4 niveles de introspección profunda con el tono poético oceánico característico de Whispers of the Wave.

**Estado:** ✅ LISTO PARA PROBAR
