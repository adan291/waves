# 🔧 FASE 1 — CONFIGURACIÓN TÉCNICA

**Fecha:** 2025-11-14  
**Director:** Kiro  
**Estado:** ✅ PLANIFICADO

---

## 🎯 TAREA 3 — CONFIGURACIÓN TÉCNICA INICIAL

Esta tarea define cómo reorganizar el proyecto para la fusión.

---

## 📁 REORGANIZACIÓN DE CARPETAS

### Decisión: Mantener waves/ como base principal

**Razón:** 
- waves/ tiene la estética perfecta
- No requiere build process
- Más fácil de mantener y expandir
- Coherente con la filosofía minimalista

**Estrategia:**
- olas/ se convierte en **referencia técnica** (no se modifica)
- waves/ se **expande** con nueva arquitectura modular
- Extraemos código específico de olas/ e integramos en waves/

---

## 🗂️ NUEVA ESTRUCTURA DE waves/

### Estructura Completa

```
waves/
├── index.html                    # ✅ NO TOCAR (solo pequeños ajustes)
├── css/
│   └── style.css                 # ✅ NO TOCAR (solo añadir estilos de audio)
├── js/
│   ├── core/                     # ➕ CREAR
│   │   ├── state.js              # ➕ CREAR - Estado centralizado
│   │   └── events.js             # ➕ CREAR - Sistema de eventos
│   ├── engine/                   # ➕ CREAR
│   │   ├── narrative.js          # ➕ CREAR - Motor de escenas
│   │   ├── personas.js           # ➕ CREAR - Lógica dual
│   │   ├── parser.js             # ➕ CREAR - Parsing JSON
│   │   └── emotional.js          # ➕ CREAR - Análisis emocional
│   ├── services/                 # ➕ CREAR
│   │   ├── geminiService.js      # 🔄 MOVER Y MEJORAR
│   │   └── audioService.js       # ➕ CREAR - Manejo de audio
│   ├── ui/                       # ➕ CREAR
│   │   ├── renderer.js           # 🔄 REFACTORIZAR desde ui.js
│   │   ├── controls.js           # ➕ CREAR - Controles de audio
│   │   └── animations.js         # ➕ CREAR (opcional)
│   ├── prompts_master.js         # ➕ CREAR - Prompts unificados
│   ├── main.js                   # 🔄 REFACTORIZAR - Orquestador
│   ├── prompts.js                # ⚠️ DEPRECAR (migrar a prompts_master.js)
│   └── ui.js                     # ⚠️ DEPRECAR (migrar a ui/renderer.js)
├── .gitignore                    # ✅ NO TOCAR
└── README.md                     # 🔄 ACTUALIZAR con nueva arquitectura
```

---

## 📋 ARCHIVOS A CREAR

### 1. **js/core/state.js** ➕ CREAR

**Propósito:** Estado centralizado con patrón Observer

**Contenido:**
```javascript
// Estado global de la aplicación
const appState = {
  conversationHistory: [],
  currentPersona: 'narrador',
  currentMode: 'default',
  isProcessing: false,
  audioEnabled: true,
  emotionalContext: null
}

// Patrón Observer
const observers = []

function subscribe(callback) { ... }
function notify(change) { ... }
function getState() { ... }
function setState(updates) { ... }
```

---

### 2. **js/core/events.js** ➕ CREAR

**Propósito:** Sistema de eventos custom

**Contenido:**
```javascript
// Eventos del sistema
const EventTypes = {
  MESSAGE_SENT: 'message:sent',
  RESPONSE_RECEIVED: 'response:received',
  PERSONA_SWITCHED: 'persona:switched',
  MODE_CHANGED: 'mode:changed',
  AUDIO_PLAYED: 'audio:played',
  ERROR_OCCURRED: 'error:occurred'
}

function emit(eventType, data) { ... }
function on(eventType, handler) { ... }
function off(eventType, handler) { ... }
```

---

### 3. **js/engine/narrative.js** ➕ CREAR

**Propósito:** Motor de escenas y generación narrativa

**Contenido:**
```javascript
async function generateScene(userMessage, history) { ... }
function parseNarrativeResponse(responseText) { ... }
function splitIntoComponents(response) { ... }
function generateSeedQuestion(emotionalTone, content) { ... }
function addContinuityTrigger(scene) { ... }
```

---

### 4. **js/engine/personas.js** ➕ CREAR

**Propósito:** Gestión de alternancia narrador/kiro

**Contenido:**
```javascript
function getCurrentPersona() { ... }
function switchPersona() { ... }
function shouldAlternate(lastResponse, turnCount) { ... }
function getPersonaPrompt(persona) { ... }
function parseKiroInstruction(instruction) { ... }
```

---

### 5. **js/engine/parser.js** ➕ CREAR

**Propósito:** Parsing de respuestas JSON

**Contenido:**
```javascript
function parseNarradorResponse(responseText) { ... }
function parseKiroResponse(responseText) { ... }
function cleanJsonResponse(text) { ... }
function validateResponse(parsed, persona) { ... }
```

---

### 6. **js/engine/emotional.js** ➕ CREAR

**Propósito:** Análisis emocional

**Contenido:**
```javascript
function analyzeEmotionalTone(message) { ... }
function detectEmotions(text) { ... }
function calculateIntensity(text) { ... }
function suggestGuardianMode(emotionalAnalysis) { ... }
```

---

### 7. **js/services/audioService.js** ➕ CREAR

**Propósito:** Manejo completo de audio (TTS)

**Contenido extraído de olas/components/ChatView.tsx:**
```javascript
// Funciones de decode
function decode(base64) { ... }
async function decodeAudioData(data, ctx, sampleRate, numChannels) { ... }

// Funciones de reproducción
async function playAudio(text, geminiService) { ... }
function stopAudio() { ... }

// Estado de audio
let currentAudioSource = null
let isPlaying = false
```

---

### 8. **js/prompts_master.js** ➕ CREAR

**Propósito:** Unificar todos los prompts (Guardián + Narrador + Kiro)

**Contenido:**
```javascript
// Prompts del sistema dual (de olas/prompts.js)
const NARRADOR_PROMPT = { ... }
const KIRO_PROMPT = { ... }

// Prompts del Guardián (de waves/prompts.js)
const GUARDIAN_MODES = {
  default: { ... },
  modoA: { ... },
  modoB: { ... },
  modoC: { ... }
}

// Función de selección
function getPrompt(persona, mode) { ... }
```

---

### 9. **js/ui/renderer.js** 🔄 REFACTORIZAR

**Propósito:** Renderizado de mensajes (migrado desde ui.js)

**Contenido:**
```javascript
function displayUserMessage(text) { ... }
function displayAIResponse(response) { ... }
function displayWhisper(text) { ... }
function displayWave(text) { ... }
function displayAudioControls(messageId, text) { ... }
function showTypingIndicator() { ... }
function hideTypingIndicator() { ... }
```

---

### 10. **js/ui/controls.js** ➕ CREAR

**Propósito:** Controles de audio y UI interactiva

**Contenido:**
```javascript
function createAudioButton(messageId, text) { ... }
function handleAudioClick(messageId, text) { ... }
function updateAudioButtonState(messageId, state) { ... }
function createModeSelector() { ... }
function updateModeIndicator(mode) { ... }
```

---

## 🔄 ARCHIVOS A MOVER Y MEJORAR

### 1. **js/geminiService.js** 🔄 MOVER A js/services/

**Cambios:**
- Mover a `js/services/geminiService.js`
- Añadir método `getTTS()` de olas/geminiService.js
- Mantener compatibilidad con sistema existente
- Añadir soporte para prompts JSON

**Código a integrar de olas/:**
```javascript
async getTTS(text) {
  try {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}
```

---

### 2. **js/main.js** 🔄 REFACTORIZAR

**Cambios:**
- Simplificar a orquestador puro
- Delegar lógica a módulos especializados
- Integrar Ocean Engine
- Mantener compatibilidad con sistema de modos

**Nueva estructura:**
```javascript
// Imports
import { getState, setState } from './core/state.js'
import { emit, on } from './core/events.js'
import { generateScene } from './engine/narrative.js'
import { GeminiService } from './services/geminiService.js'
import { displayAIResponse } from './ui/renderer.js'

// Inicialización
function init() { ... }

// Orquestación
async function handleUserMessage(message) {
  // 1. Validar
  // 2. Actualizar estado
  // 3. Llamar Ocean Engine
  // 4. Renderizar respuesta
}
```

---

## ⚠️ ARCHIVOS A DEPRECAR (NO ELIMINAR TODAVÍA)

### 1. **js/prompts.js** ⚠️ DEPRECAR

**Acción:**
- Mantener temporalmente para compatibilidad
- Migrar contenido a `prompts_master.js`
- Añadir comentario de deprecación
- Eliminar en Fase 2

---

### 2. **js/ui.js** ⚠️ DEPRECAR

**Acción:**
- Mantener temporalmente para compatibilidad
- Migrar funciones a `ui/renderer.js` y `ui/controls.js`
- Añadir comentario de deprecación
- Eliminar en Fase 2

---

## ✅ ARCHIVOS QUE NO SE TOCAN (POR AHORA)

### 1. **index.html** ✅ NO TOCAR

**Razón:** Estructura HTML perfecta

**Cambios mínimos permitidos:**
- Actualizar imports de JS (cuando migremos a módulos)
- Añadir botones de audio (si es necesario)

---

### 2. **css/style.css** ✅ NO TOCAR

**Razón:** Estética oceánica perfecta

**Cambios mínimos permitidos:**
- Añadir estilos para botones de audio
- Añadir estilos para indicadores de persona (narrador/kiro)

---

### 3. **README.md** 🔄 ACTUALIZAR

**Cambios:**
- Documentar nueva arquitectura
- Añadir instrucciones de uso del sistema dual
- Explicar Ocean Engine

---

## 🚫 ARCHIVOS DE olas/ QUE NO SE TOCAN

**Toda la carpeta olas/ permanece intacta como referencia.**

Solo **extraemos código específico** y lo adaptamos a vanilla JS.

---

## 📦 ORDEN DE CREACIÓN RECOMENDADO

### Fase 1A: Fundación (Core)
1. ✅ Crear `js/core/state.js`
2. ✅ Crear `js/core/events.js`

### Fase 1B: Servicios
3. ✅ Mover y mejorar `js/services/geminiService.js`
4. ✅ Crear `js/services/audioService.js`

### Fase 1C: Engine
5. ✅ Crear `js/engine/parser.js`
6. ✅ Crear `js/engine/personas.js`
7. ✅ Crear `js/engine/emotional.js`
8. ✅ Crear `js/engine/narrative.js`

### Fase 1D: Prompts
9. ✅ Crear `js/prompts_master.js`

### Fase 1E: UI
10. ✅ Crear `js/ui/renderer.js`
11. ✅ Crear `js/ui/controls.js`

### Fase 1F: Integración
12. ✅ Refactorizar `js/main.js`
13. ✅ Actualizar `index.html` (imports)
14. ✅ Actualizar `css/style.css` (estilos de audio)

---

## 🎯 CRITERIOS DE ÉXITO

Al finalizar esta configuración, deberemos tener:

✅ Arquitectura modular clara  
✅ Separación de responsabilidades  
✅ Sistema dual narrador/kiro funcional  
✅ TTS integrado  
✅ Ocean Engine operativo  
✅ Compatibilidad con sistema de modos del Guardián  
✅ Código limpio y documentado  

---

**Siguiente Documento:** FASE1_PROXIMO_PASO.md
