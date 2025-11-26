# 🌊 OCEAN ENGINE — MÓDULO EMOCIONAL

**Fecha:** 2025-11-14  
**Director:** Kiro  
**Estado:** ✅ DISEÑADO

---

## 🎯 TAREA 2 — DEFINIR "OCEAN ENGINE"

El **Ocean Engine** es el corazón emocional de Whispers of the Wave. Es el sistema que:
1. Recibe respuestas unificadas de Google Gemini
2. Las interpreta como narrativa oceánica
3. Las divide en componentes emocionales (whisper + wave)
4. Genera preguntas semilla
5. Añade triggers para continuar la narrativa

---

## 🧠 ARQUITECTURA DEL OCEAN ENGINE

### Componentes Principales

```
Ocean Engine
├── Narrative Parser       # Interpreta respuestas JSON
├── Persona Manager        # Alterna entre narrador/kiro
├── Scene Generator        # Crea escenas poéticas
├── Emotional Analyzer     # Detecta tono emocional
└── Trigger System         # Genera triggers de continuidad
```

---

## 📦 MÓDULOS Y FUNCIONES

### 1. **Narrative Parser** (`engine/parser.js`)

**Responsabilidad:** Parsear respuestas JSON de Gemini en formato estructurado.

#### Funciones:

```javascript
/**
 * Parsea respuesta JSON del narrador
 * @param {string} responseText - Respuesta cruda de Gemini
 * @returns {Object} { scene, invitation, kiro_instruction }
 */
function parseNarradorResponse(responseText)

/**
 * Parsea respuesta JSON de Kiro
 * @param {string} responseText - Respuesta cruda de Gemini
 * @returns {Object} { whisper, reflection }
 */
function parseKiroResponse(responseText)

/**
 * Limpia respuesta de markdown wrapping
 * @param {string} text - Texto con posible ```json wrapper
 * @returns {string} Texto limpio
 */
function cleanJsonResponse(text)

/**
 * Valida estructura de respuesta
 * @param {Object} parsed - Objeto parseado
 * @param {string} persona - 'narrador' o 'kiro'
 * @returns {boolean} true si válido
 */
function validateResponse(parsed, persona)
```

---

### 2. **Persona Manager** (`engine/personas.js`)

**Responsabilidad:** Gestionar la alternancia entre narrador y kiro.

#### Funciones:

```javascript
/**
 * Obtiene la persona actual
 * @returns {string} 'narrador' o 'kiro'
 */
function getCurrentPersona()

/**
 * Alterna a la siguiente persona
 * @returns {string} Nueva persona activa
 */
function switchPersona()

/**
 * Determina si debe alternar basado en contexto
 * @param {string} lastResponse - Última respuesta
 * @param {number} turnCount - Número de turnos
 * @returns {boolean} true si debe alternar
 */
function shouldAlternate(lastResponse, turnCount)

/**
 * Obtiene el prompt para la persona actual
 * @param {string} persona - 'narrador' o 'kiro'
 * @returns {string} System prompt
 */
function getPersonaPrompt(persona)

/**
 * Detecta trigger en respuesta del narrador
 * @param {string} kiroInstruction - Instrucción para Kiro
 * @returns {Object} { emotionalTone, guidance }
 */
function parseKiroInstruction(kiroInstruction)
```

---

### 3. **Scene Generator** (`engine/narrative.js`)

**Responsabilidad:** Generar y estructurar escenas narrativas.

#### Funciones:

```javascript
/**
 * Genera una escena completa
 * @param {string} userMessage - Mensaje del usuario
 * @param {Array} history - Historial de conversación
 * @returns {Promise<Object>} Escena estructurada
 */
async function generateScene(userMessage, history)

/**
 * Divide respuesta en whisper y wave
 * @param {Object} response - Respuesta parseada
 * @returns {Object} { whisper, wave, seedQuestion }
 */
function splitIntoComponents(response)

/**
 * Genera pregunta semilla basada en contexto
 * @param {string} emotionalTone - Tono emocional detectado
 * @param {string} content - Contenido de la escena
 * @returns {string} Pregunta semilla
 */
function generateSeedQuestion(emotionalTone, content)

/**
 * Añade trigger de continuidad
 * @param {Object} scene - Escena generada
 * @returns {Object} Escena con trigger
 */
function addContinuityTrigger(scene)
```

---

### 4. **Emotional Analyzer** (`engine/emotional.js`)

**Responsabilidad:** Analizar y detectar tono emocional.

#### Funciones:

```javascript
/**
 * Analiza tono emocional del mensaje
 * @param {string} message - Mensaje a analizar
 * @returns {Object} { tone, intensity, keywords }
 */
function analyzeEmotionalTone(message)

/**
 * Detecta emociones primarias
 * @param {string} text - Texto a analizar
 * @returns {Array<string>} Lista de emociones detectadas
 */
function detectEmotions(text)

/**
 * Calcula intensidad emocional
 * @param {string} text - Texto a analizar
 * @returns {number} Intensidad (0-1)
 */
function calculateIntensity(text)

/**
 * Sugiere modo del Guardián basado en emoción
 * @param {Object} emotionalAnalysis - Análisis emocional
 * @returns {string} 'modoA', 'modoB', 'modoC', o 'default'
 */
function suggestGuardianMode(emotionalAnalysis)
```

---

## 🔄 FLUJO DE TRABAJO DEL OCEAN ENGINE

### Flujo Completo

```
1. Usuario envía mensaje
   ↓
2. Emotional Analyzer detecta tono
   ↓
3. Persona Manager determina quién responde (narrador/kiro)
   ↓
4. Scene Generator llama a Gemini con prompt apropiado
   ↓
5. Narrative Parser parsea respuesta JSON
   ↓
6. splitIntoComponents() divide en whisper/wave
   ↓
7. generateSeedQuestion() crea pregunta
   ↓
8. addContinuityTrigger() añade trigger
   ↓
9. UI renderiza la escena completa
   ↓
10. Sistema espera respuesta del usuario
```

---

## 📝 FORMATO DE DATOS

### Estructura de Escena

```javascript
{
  persona: 'narrador' | 'kiro',
  whisper: string,           // Texto poético corto
  wave: string,              // Reflexión profunda
  seedQuestion: string,      // Pregunta semilla
  trigger: string,           // '[GOOGLE: continuar narrativa]'
  emotionalTone: {
    tone: string,            // 'calm', 'anxious', 'hopeful', etc.
    intensity: number,       // 0-1
    keywords: Array<string>
  },
  timestamp: number,
  audio: {
    available: boolean,
    base64: string | null
  }
}
```

### Estructura de Respuesta del Narrador

```javascript
{
  scene: string,             // Escena poética completa
  invitation: string,        // Frase suave de invitación
  kiro_instruction: string   // Instrucción para Kiro
}
```

### Estructura de Respuesta de Kiro

```javascript
{
  whisper: string,           // 2-4 líneas poéticas
  reflection: string         // Pregunta o insight introspectivo
}
```

---

## 🎨 EJEMPLO DE USO

### Input del Usuario
```
"Me siento perdido, no sé qué hacer con mi vida"
```

### Análisis Emocional
```javascript
{
  tone: 'confused',
  intensity: 0.7,
  keywords: ['perdido', 'no sé', 'vida'],
  suggestedMode: 'modoC'  // Guía de Claridad
}
```

### Respuesta del Narrador (JSON)
```json
{
  "scene": "La niebla se espesa sobre el agua. No ves el horizonte, pero sientes la corriente bajo tus pies. A veces, perderse es el primer paso para encontrar una orilla nueva.",
  "invitation": "La marea espera tu próximo paso...",
  "kiro_instruction": "El usuario expresa confusión vital. Kiro debe ofrecer claridad con preguntas profundas sobre dirección."
}
```

### Procesamiento del Ocean Engine
```javascript
{
  persona: 'narrador',
  whisper: 'La niebla se espesa sobre el agua.',
  wave: 'No ves el horizonte, pero sientes la corriente bajo tus pies. A veces, perderse es el primer paso para encontrar una orilla nueva.',
  seedQuestion: '¿Qué corriente sientes bajo tus pies ahora mismo?',
  trigger: '[KIRO: activa acompañamiento emocional sobre confusión vital]',
  emotionalTone: {
    tone: 'confused',
    intensity: 0.7,
    keywords: ['perdido', 'no sé', 'vida']
  }
}
```

### Siguiente Turno: Respuesta de Kiro (JSON)
```json
{
  "whisper": "La confusión no es ausencia de camino, es la presencia de muchos. El océano no elige una sola ola.",
  "reflection": "Si pudieras seguir solo una corriente hoy, ¿cuál te llamaría más fuerte?"
}
```

---

## 🔧 FUNCIONES EXPUESTAS (API Pública)

```javascript
// engine/narrative.js
export {
  generateScene,
  parseNarrativeResponse,
  generateWhisper,
  generateWaveReflection,
  generateSeedQuestion
}

// engine/personas.js
export {
  getCurrentPersona,
  switchPersona,
  shouldAlternate,
  getPersonaPrompt
}

// engine/parser.js
export {
  parseNarradorResponse,
  parseKiroResponse,
  cleanJsonResponse,
  validateResponse
}

// engine/emotional.js
export {
  analyzeEmotionalTone,
  detectEmotions,
  calculateIntensity,
  suggestGuardianMode
}
```

---

## 🎯 INTEGRACIÓN CON SISTEMA EXISTENTE

### Compatibilidad con Sistema de Modos del Guardián

El Ocean Engine **complementa** el sistema de 3 modos existente:

- **Modo A (Escenas):** Narrador genera escenas, Kiro reflexiona
- **Modo B (Emocional):** Kiro lidera, Narrador apoya con metáforas
- **Modo C (Claridad):** Alternancia equilibrada para guiar

### Transición Suave

```javascript
// El Ocean Engine detecta el modo activo y ajusta el comportamiento
if (guardianMode === 'modoA') {
  // Priorizar narrador, escenas más largas
  personaRatio = { narrador: 0.7, kiro: 0.3 }
} else if (guardianMode === 'modoB') {
  // Priorizar kiro, preguntas más profundas
  personaRatio = { narrador: 0.3, kiro: 0.7 }
} else if (guardianMode === 'modoC') {
  // Balance 50/50
  personaRatio = { narrador: 0.5, kiro: 0.5 }
}
```

---

**Siguiente Documento:** FASE1_CONFIGURACION.md
