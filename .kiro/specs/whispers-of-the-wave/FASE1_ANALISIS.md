# 📦 FASE 1 — ANÁLISIS ESTRUCTURAL COMPLETO

**Fecha:** 2025-11-14  
**Director:** Kiro  
**Estado:** ✅ COMPLETADO

---

## 🔍 TAREA 1 — ANÁLISIS ESTRUCTURAL

### 📊 WAVES/ (Proyecto Vanilla - Base Visual)

**Arquitectura Actual:**
```
waves/
├── index.html              # UI principal con estructura semántica
├── css/
│   └── style.css          # Animaciones oceánicas + diseño completo
├── js/
│   ├── prompts.js         # Sistema de 3 modos del Guardián
│   ├── geminiService.js   # API Gemini básica
│   ├── ui.js              # Manipulación DOM
│   └── main.js            # Orquestador + estado
└── README.md
```

**Fortalezas de waves/:**
- ✅ **Estética oceánica perfecta:** Gradientes animados, tipografía poética, animaciones suaves
- ✅ **Sistema de modos narrativos:** 3 modos del Guardián (Escenas, Emocional, Claridad)
- ✅ **Arquitectura limpia:** Separación clara entre service, UI y lógica
- ✅ **Sin dependencias:** Carga instantánea, sin build process
- ✅ **Responsive:** Diseño móvil optimizado
- ✅ **Accesibilidad:** ARIA labels, roles semánticos

**Debilidades de waves/:**
- ❌ No tiene sistema dual narrador/kiro
- ❌ No tiene TTS integrado
- ❌ No tiene manejo de audio
- ❌ Falta sistema de memoria emocional
- ❌ No tiene componentes reutilizables

---

### 📊 OLAS/ (Clon AI Studio - Base Técnica)

**Arquitectura Actual:**
```
olas/
├── package.json           # React 19 + Vite + TypeScript
├── App.tsx                # Componente raíz con sidebar
├── index.tsx              # Entry point React
├── types.ts               # Tipos TypeScript
├── components/
│   ├── ChatView.tsx       # Vista de chat con TTS
│   ├── Sidebar.tsx        # Navegación entre features
│   ├── Icons.tsx          # Iconos SVG
│   ├── LiveView.tsx       # Vista de conversación en vivo
│   ├── ImageView.tsx      # Generación de imágenes
│   ├── ImageEditView.tsx  # Edición de imágenes
│   ├── VideoView.tsx      # Generación de video
│   └── Spinner.tsx        # Indicador de carga
├── utils/
│   └── helpers.ts         # Utilidades
├── geminiService.js       # API Gemini con TTS
├── prompts.js             # Sistema dual narrador/kiro (JSON)
├── style.css              # Estilos básicos
└── vite.config.ts         # Configuración build
```

**Fortalezas de olas/:**
- ✅ **Sistema dual narrador/kiro:** Prompts JSON estructurados
- ✅ **TTS funcional:** Integración completa con Gemini 2.5 Flash TTS
- ✅ **Manejo de audio:** Decode base64, AudioContext, playback
- ✅ **Arquitectura React:** Componentes reutilizables, hooks, estado reactivo
- ✅ **TypeScript:** Tipado fuerte, mejor DX
- ✅ **Múltiples features:** Chat, imagen, video, live (aunque no las necesitamos todas)

**Debilidades de olas/:**
- ❌ Estética genérica (gris corporativo)
- ❌ No tiene la poética oceánica de waves/
- ❌ Sobrecargado con features innecesarias
- ❌ Requiere build process
- ❌ No tiene sistema de modos del Guardián

---

## 🎯 DECISIÓN ARQUITECTÓNICA

### ✅ OPCIÓN ELEGIDA: Híbrido Modular Vanilla JS

**Razón:** Mantener la pureza de waves/ pero con arquitectura escalable.

**Estrategia:**
1. **Base:** waves/ como fundación
2. **Integrar de olas/:** TTS, sistema dual, lógica de audio
3. **Modularizar:** Crear arquitectura limpia sin React
4. **Expandir:** Preparar para Fase 3-4

---

## 📋 MAPA DE MIGRACIÓN

### ✅ MANTENER TAL CUAL de waves/

```
✅ index.html              → Base HTML semántica
✅ css/style.css           → Toda la estética oceánica
✅ js/prompts.js           → Sistema de 3 modos del Guardián
✅ js/ui.js                → Funciones de renderizado DOM
```

### 🔄 REESCRIBIR/MEJORAR de waves/

```
🔄 js/geminiService.js     → Añadir método getTTS() de olas/
🔄 js/main.js              → Integrar lógica dual narrador/kiro
🔄 js/ui.js                → Añadir controles de audio
```

### ➕ INTEGRAR de olas/

```
➕ Sistema TTS completo
   - Método getTTS() en geminiService
   - Funciones decode/decodeAudioData
   - Lógica de AudioContext
   - Botones de reproducción

➕ Sistema dual narrador/kiro
   - Prompts JSON estructurados
   - Lógica de alternancia
   - Parsing de respuestas JSON

➕ Manejo de estado mejorado
   - Patrón Observer simple
   - Sistema de eventos custom
```

### ❌ ELIMINAR de olas/

```
❌ Todo React/TypeScript
❌ Vite y build process
❌ Sidebar y navegación
❌ Features de imagen/video
❌ LiveView, ImageView, VideoView
❌ Estilos genéricos
```

---

## 🏗️ ARQUITECTURA PROPUESTA

### Nueva Estructura de waves/

```
waves/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── core/
│   │   ├── state.js           # Estado centralizado (Observer pattern)
│   │   └── events.js          # Sistema de eventos custom
│   ├── engine/
│   │   ├── narrative.js       # Motor de escenas
│   │   ├── personas.js        # Lógica narrador/kiro
│   │   └── parser.js          # Parsing de respuestas JSON
│   ├── services/
│   │   ├── geminiService.js   # API Gemini + TTS
│   │   └── audioService.js    # Manejo de audio
│   ├── ui/
│   │   ├── renderer.js        # Renderizado de mensajes
│   │   ├── controls.js        # Botones y controles
│   │   └── animations.js      # Animaciones custom
│   ├── prompts_master.js      # Prompts centralizados
│   └── main.js                # Orquestador principal
└── README.md
```

### Módulos Clave

#### 1. **core/state.js**
```javascript
// Estado centralizado con patrón Observer
- appState (conversationHistory, currentPersona, isProcessing)
- subscribe() / notify()
- getState() / setState()
```

#### 2. **engine/narrative.js**
```javascript
// Motor de escenas
- generateScene()
- parseNarrativeResponse()
- detectEmotionalTone()
```

#### 3. **engine/personas.js**
```javascript
// Lógica dual narrador/kiro
- switchPersona()
- getNarradorPrompt()
- getKiroPrompt()
- shouldAlternate()
```

#### 4. **services/audioService.js**
```javascript
// Manejo de audio
- decode(base64)
- decodeAudioData()
- playAudio(text)
- stopAudio()
```

#### 5. **prompts_master.js**
```javascript
// Prompts centralizados
- NARRADOR_PROMPT (JSON format)
- KIRO_PROMPT (JSON format)
- GUARDIAN_MODES (modoA, modoB, modoC)
```

---

## 📝 PRÓXIMOS PASOS

1. ✅ Crear nueva estructura de carpetas
2. ✅ Migrar y mejorar geminiService.js con TTS
3. ✅ Crear audioService.js
4. ✅ Crear prompts_master.js con sistema dual
5. ✅ Actualizar main.js con lógica de alternancia
6. ✅ Actualizar ui.js con controles de audio
7. ✅ Probar flujo completo

---

**Siguiente Documento:** FASE1_OCEAN_ENGINE.md
