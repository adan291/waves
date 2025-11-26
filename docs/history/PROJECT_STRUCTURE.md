# 📁 Estructura del Proyecto

**Whispers of the Wave** - Estructura Limpia y Organizada

---

## 🌳 Árbol de Directorios

```
whispers-of-the-wave/
│
├── 📄 index.html                    # Aplicación principal
├── 📖 README.md                     # Documentación principal
├── 📖 FEATURES.md                   # Guía de funcionalidades
├── 📖 CHANGELOG.md                  # Historial de cambios
├── 🔒 SECURITY.md                   # Políticas de seguridad
├── ⚙️  .gitignore                    # Configuración Git
│
├── 🎨 css/
│   └── style.css                    # Estilos y animaciones
│
├── 💻 js/
│   │
│   ├── 🌐 browser/                  # Adaptadores para navegador
│   │   ├── kiro_adapter.browser.js
│   │   ├── whispers_adapter.browser.js
│   │   ├── main_orchestrator.browser.js
│   │   ├── main_demo.js
│   │   ├── router.browser.js
│   │   ├── spec_integration.browser.js
│   │   ├── spec_interface.browser.js
│   │   ├── spec_loader.browser.js
│   │   └── tts_voice_strategy.browser.js
│   │
│   ├── ⚙️  core/                     # Lógica central
│   │   ├── adaptiveAssistance.js
│   │   ├── appFacade.js
│   │   ├── conversationHistory.js
│   │   ├── errorHandler.js
│   │   ├── events.js
│   │   ├── input_validator.js
│   │   ├── messageHandler.js
│   │   ├── responsePatterns.js
│   │   ├── serviceContainer.js
│   │   ├── specIntegration.js
│   │   ├── state.js
│   │   ├── stateClassifier.js
│   │   └── stateManager.js
│   │
│   ├── 🔧 engine/                   # Motor de procesamiento
│   │   ├── emotional.js
│   │   ├── life_questions.js
│   │   ├── narrative.js
│   │   ├── parser.js
│   │   └── personas.js
│   │
│   ├── ✨ features/                 # Funcionalidades
│   │   ├── historySearch.js         # Búsqueda en historial
│   │   ├── integration.js           # Integración de features
│   │   ├── keyboardShortcuts.js     # Atajos de teclado
│   │   ├── quickReactions.js        # Reacciones rápidas
│   │   ├── speechToText.js          # Speech-to-Text
│   │   ├── themeToggle.js           # Modo oscuro/claro
│   │   └── README.md                # Documentación de features
│   │
│   ├── 💬 prompts/                  # Prompts del sistema
│   │   ├── adaptivePrompts.js
│   │   └── system_prompts.js
│   │
│   ├── 🔌 services/                 # Servicios externos
│   │   ├── audioService.js          # Text-to-Speech
│   │   └── geminiService.js         # API de Gemini
│   │
│   ├── 🎨 ui/                       # Componentes UI
│   │   ├── controls.js
│   │   ├── renderer.js
│   │   └── suggestions.js
│   │
│   ├── main.js                      # Punto de entrada principal
│   ├── main_with_specs.js           # Versión con specs
│   ├── prompts_master.js            # Prompts maestros
│   ├── config.local.js              # Configuración local (API keys)
│   └── config.local.example.js      # Ejemplo de configuración
│
├── 🧪 tests/
│   ├── unit/                        # Tests unitarios
│   │   ├── adaptiveAssistance.test.html
│   │   ├── adaptiveAssistance.test.js
│   │   ├── responsePatterns.test.html
│   │   ├── responsePatterns.test.js
│   │   ├── stateClassifier.test.html
│   │   └── stateClassifier.test.js
│   │
│   ├── integration/                 # Tests de integración
│   │   ├── integration.test.html
│   │   ├── integration.test.js
│   │   └── integration_test_runner.js
│   │
│   ├── demos/                       # Demos y mockups
│   │   ├── index_spec_demo.html
│   │   └── PRODUCTION_MOCKUP.html
│   │
│   ├── index.html                   # Índice de tests
│   └── README.md                    # Documentación de tests
│
├── 📚 docs/
│   └── history/                     # Documentación histórica
│       ├── refactoring/             # Reportes de refactoring
│       ├── design-reviews/          # Reviews de diseño
│       └── reports/                 # Reportes varios
│
├── 📝 logs/                         # Logs (en .gitignore)
│   └── errors.log
│
└── ⚙️  .kiro/                        # Configuración de Kiro
    ├── hooks/                       # Agent hooks
    ├── specs/                       # Especificaciones
    └── steering/                    # Reglas de steering
```

---

## 📊 Estadísticas

### Archivos por Tipo

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| HTML | 8 | Raíz + tests |
| JavaScript | 50+ | js/ |
| CSS | 1 | css/ |
| Markdown | 7 | Raíz + docs |
| Config | 3 | Raíz + .kiro |

### Líneas de Código (Aprox.)

| Categoría | Líneas |
|-----------|--------|
| JavaScript | ~5,000 |
| CSS | ~800 |
| HTML | ~500 |
| **Total** | **~6,300** |

---

## 🎯 Archivos Principales

### Raíz (7 archivos)

1. **index.html** - Aplicación web principal
2. **README.md** - Documentación de inicio rápido
3. **FEATURES.md** - Guía completa de funcionalidades
4. **CHANGELOG.md** - Historial de versiones
5. **SECURITY.md** - Políticas de seguridad
6. **CLEANUP_REPORT.md** - Reporte de limpieza
7. **.gitignore** - Configuración de Git

### JavaScript Core (js/)

**Punto de Entrada:**
- `main.js` - Aplicación estándar
- `main_with_specs.js` - Con sistema de specs

**Configuración:**
- `config.local.js` - API keys (no en Git)
- `config.local.example.js` - Plantilla

---

## 📦 Módulos por Categoría

### 🌐 Browser (9 archivos)
Adaptadores específicos para navegador
- Orquestador principal
- Adaptadores de Kiro y Whispers
- Router de features
- Integración de specs
- Estrategia de voces TTS

### ⚙️ Core (13 archivos)
Lógica central de la aplicación
- Gestión de estado
- Manejo de mensajes
- Historial de conversaciones
- Clasificación de estados
- Patrones de respuesta
- Asistencia adaptativa

### 🔧 Engine (5 archivos)
Motor de procesamiento de IA
- Parser de respuestas
- Personas (Whispers/Kiro)
- Motor emocional
- Preguntas de vida
- Narrativa

### ✨ Features (6 archivos)
Funcionalidades de usuario
- Speech-to-Text
- Búsqueda en historial
- Reacciones rápidas
- Atajos de teclado
- Toggle de tema
- Integración

### 💬 Prompts (2 archivos)
Prompts del sistema de IA
- Prompts del sistema
- Prompts adaptativos

### 🔌 Services (2 archivos)
Servicios externos
- Gemini API
- Audio/TTS

### 🎨 UI (3 archivos)
Componentes de interfaz
- Renderer
- Controles
- Sugerencias

---

## 🧪 Tests

### Estructura de Tests

```
tests/
├── unit/           # Tests unitarios (3 suites)
├── integration/    # Tests de integración (1 suite)
├── demos/          # Demos interactivos (2)
├── index.html      # Runner principal
└── README.md       # Documentación
```

### Cobertura

- ✅ Asistencia adaptativa
- ✅ Patrones de respuesta
- ✅ Clasificador de estados
- ✅ Integración completa

---

## 📚 Documentación

### Principal (Raíz)

- **README.md** - Para usuarios finales
- **FEATURES.md** - Para usuarios avanzados
- **CHANGELOG.md** - Para todos

### Histórica (docs/history/)

- **refactoring/** - Reportes de refactoring
- **design-reviews/** - Reviews de diseño
- **reports/** - Reportes varios

---

## 🔒 Archivos Ignorados (.gitignore)

```
js/config.local.js    # API keys
logs/                 # Logs de errores
*.log                 # Archivos de log
.DS_Store             # macOS
Thumbs.db             # Windows
.vscode/              # VS Code
.idea/                # IntelliJ
```

---

## 🚀 Puntos de Entrada

### Para Usuarios

1. **Aplicación:** `index.html`
2. **Documentación:** `README.md`
3. **Features:** `FEATURES.md`

### Para Desarrolladores

1. **Código principal:** `js/main.js`
2. **Tests:** `tests/index.html`
3. **Configuración:** `js/config.local.example.js`

### Para Testing

1. **Tests unitarios:** `tests/unit/`
2. **Tests integración:** `tests/integration/`
3. **Demos:** `tests/demos/`

---

## 📈 Crecimiento del Proyecto

### Agregar Nueva Feature

```
1. Crear: js/features/miFeature.js
2. Integrar: js/features/integration.js
3. Documentar: FEATURES.md
4. Test: tests/unit/miFeature.test.js
5. Actualizar: CHANGELOG.md
```

### Agregar Nuevo Servicio

```
1. Crear: js/services/miServicio.js
2. Registrar: js/core/serviceContainer.js
3. Documentar: README.md
4. Test: tests/integration/
```

### Agregar Nueva Persona

```
1. Definir: js/engine/personas.js
2. Prompts: js/prompts/system_prompts.js
3. Adaptar: js/browser/*_adapter.browser.js
4. Test: tests/integration/
```

---

## 🎨 Convenciones

### Nombres de Archivos

- **Módulos:** `camelCase.js`
- **Browser:** `*.browser.js`
- **Tests:** `*.test.js` / `*.test.html`
- **Config:** `*.config.js`

### Estructura de Módulos

```javascript
// Patrón estándar
const MiModulo = (() => {
    // Privado
    const privado = {};
    
    // Público
    return {
        metodoPublico() {}
    };
})();
```

### Comentarios

```javascript
/**
 * Descripción de la función
 * @param {Type} param - Descripción
 * @returns {Type} Descripción
 */
```

---

## 🔄 Flujo de Datos

```
Usuario
  ↓
index.html
  ↓
js/main.js
  ↓
js/core/messageHandler.js
  ↓
js/services/geminiService.js
  ↓
js/engine/parser.js
  ↓
js/ui/renderer.js
  ↓
Usuario
```

---

## 🎯 Dependencias

### Externas
- **Google Gemini API** - IA conversacional
- **Web Speech API** - Speech-to-Text (nativo)
- **LocalStorage API** - Persistencia (nativo)

### Internas
- **Ninguna** - 100% vanilla JavaScript

---

## 📊 Métricas de Calidad

- ✅ **0 dependencias** npm
- ✅ **100% vanilla** JavaScript
- ✅ **Modular** - Separación clara
- ✅ **Documentado** - Comentarios completos
- ✅ **Testeado** - Suite de tests
- ✅ **Responsive** - Mobile-first
- ✅ **Accesible** - ARIA labels

---

## 🎉 Conclusión

Estructura limpia, organizada y profesional lista para:
- ✅ Desarrollo continuo
- ✅ Colaboración en equipo
- ✅ Mantenimiento a largo plazo
- ✅ Escalabilidad

---

*Estructura actualizada: 16 de Noviembre, 2025*
