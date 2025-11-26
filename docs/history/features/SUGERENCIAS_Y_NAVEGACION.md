# 🌊 Sistema de Sugerencias Dinámicas y Navegación

## ✅ Implementado

### 1. **Sistema de Sugerencias Contextuales**

Las sugerencias cambian dinámicamente en dos niveles:

#### A. Sugerencias Iniciales por Tipo de Ola

Cada ola tiene sugerencias personalizadas según su propósito:

| Ola | Icono | Tipo de Sugerencias |
|-----|-------|---------------------|
| **Ola Tranquila** | 🌊 | Autoconocimiento, reflexión pausada |
| **Ola Profunda** | 🌀 | Emociones complejas, patrones internos |
| **Ola Energética** | ⚡ | Decisiones, resolución de conflictos |
| **Ola Sanadora** | 💙 | Procesamiento emocional, sanación |

**Ejemplos:**
- **Ola Tranquila**: "Quiero conocerme mejor", "¿Qué me hace realmente feliz?"
- **Ola Profunda**: "Tengo emociones que no entiendo", "¿Por qué reacciono así?"
- **Ola Energética**: "Tengo que tomar una decisión importante", "¿Cuál es la mejor opción?"
- **Ola Sanadora**: "Estoy pasando por un momento difícil", "¿Cómo puedo sanar esto?"

#### B. Sugerencias Dinámicas por Estado del Océano

Durante la conversación, las sugerencias cambian según el estado emocional:

#### Estados del Océano → Sugerencias

| Estado | Emoji | Tipo de Sugerencias |
|--------|-------|---------------------|
| **Confusion** | 😕 | Exploración inicial, dudas generales |
| **Anxiety** | 😰 | Miedos, preocupaciones, presiones |
| **Processing** | 🤔 | Reflexión profunda, valores, propósito |
| **Clarity** | 💡 | Comprensión emergente, insights |
| **Resolution** | ✨ | Pasos de acción, próximos movimientos |

#### Ejemplos de Sugerencias por Estado

**Confusion (Rojo):**
- "No sé qué hacer con mi vida"
- "Me siento perdido"
- "Tengo muchas dudas sobre mi futuro"

**Anxiety (Naranja):**
- "Me da miedo equivocarme"
- "Siento presión por tomar la decisión correcta"
- "Me preocupa decepcionar a otros"

**Processing (Azul):**
- "¿Qué es lo que realmente me importa?"
- "¿Cuáles son mis valores principales?"
- "¿Qué me hace sentir realizado?"

**Clarity (Celeste):**
- "Creo que estoy empezando a entender"
- "Esto tiene más sentido ahora"
- "Veo algunas opciones más claras"

**Resolution (Pastel):**
- "¿Qué puedo hacer esta semana?"
- "¿Cuál sería un primer paso pequeño?"
- "¿Con quién podría hablar sobre esto?"

### 2. **Botón "Cambiar de Ola"** 🔄

#### Ubicación
- **Posición**: Esquina superior izquierda del mode indicator
- **Icono**: 🔄 (símbolo de cambio)
- **Estilo**: Botón circular con efecto hover

#### Funcionalidad
Al hacer click:
1. **Confirmación**: "¿Quieres cambiar de ola? Se perderá la conversación actual."
2. **Limpieza completa**:
   - Borra conversación actual
   - Resetea métricas de expresión
   - Limpia logros desbloqueados
   - Reinicia estado del océano
3. **Selección de olas**: Muestra directamente la pantalla de selección de olas (sin el splash intro)
4. **Nueva conversación**: Al seleccionar una ola, inicia conversación fresca

#### Código
```javascript
function handleBackToStart() {
    const confirmed = confirm('¿Quieres cambiar de ola? Se perderá la conversación actual.');
    
    if (confirmed) {
        // Clear conversation state
        localStorage.removeItem('whispers-selected-wave');
        localStorage.removeItem('whispers-conversation-history');
        localStorage.removeItem('whispers-state');
        
        // Clear systems
        ExpressionAnalyzer.clearHistory();
        AchievementSystem.reset();
        OceanDynamics.reset();
        
        // Hide main container
        document.querySelector('.container').style.display = 'none';
        
        // Show wave selection directly
        SplashScreen.init();
        SplashScreen.showWaveSelection();
    }
}
```

### 3. **Integración con Ocean Dynamics**

Las sugerencias se actualizan automáticamente después de cada mensaje:

```javascript
// En handleUserMessage()
const oceanState = OceanDynamics.getCurrentState();
if (oceanState && typeof SuggestionsModule !== 'undefined') {
    SuggestionsModule.displayContextual(oceanState, container);
}
```

## 🎯 Flujo de Usuario

### Inicio de Conversación
1. Usuario ve splash screen
2. Selecciona una ola (Guardian, Companion, etc.)
3. Ve sugerencias iniciales de **Confusion**

### Durante la Conversación
1. Usuario escribe mensaje
2. Océano cambia de color según emoción
3. **Sugerencias se actualizan** al nuevo estado
4. Usuario puede:
   - Escribir libremente
   - Click en sugerencia para usarla
   - Ver cómo las sugerencias evolucionan

### Cambio de Ola
1. Click en botón 🔄
2. Confirma cambio
3. Ve directamente a selección de olas (sin intro)
4. Elige otra ola o la misma
5. Inicia conversación fresca

## 📊 Arquitectura

### Módulos Involucrados

```
SuggestionsModule (js/ui/suggestions.js)
├── displayInitial() - Sugerencias de bienvenida
├── displayContextual(state) - Sugerencias por estado
└── clear() - Limpiar sugerencias

OceanDynamics (js/engine/oceanDynamics.js)
├── getCurrentState() - Estado actual del océano
├── updateFromConversation() - Actualizar estado
└── reset() - Reiniciar océano

main.js
├── handleUserMessage() - Procesar mensaje
├── handleBackToStart() - Reiniciar app
└── setupEventListeners() - Conectar botones
```

## 🎨 Estilos

### Botón de Volver
```css
.back-btn {
    background: rgba(125, 211, 192, 0.15);
    border: 1px solid rgba(125, 211, 192, 0.3);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(125, 211, 192, 0.3);
    transform: scale(1.05);
}
```

### Sugerencias
- Títulos dinámicos según estado
- Botones con hover effect
- Fade-in animations
- Responsive en mobile

## 🧪 Testing

### Test Automatizado
Abre `tests/suggestions_test.html` para probar:
- ✅ Sugerencias por tipo de ola (4 tipos)
- ✅ Sugerencias por estado del océano (6 estados)
- ✅ Sugerencias Life Questioning (4 niveles)
- ✅ Eventos de click en sugerencias

### Probar Sugerencias en la App

#### Test 1: Sugerencias por Tipo de Ola
1. Abre la app → Selecciona **Ola Tranquila** 🌊
2. Verás sugerencias de autoconocimiento
3. Click en 🔄 → Selecciona **Ola Profunda** 🌀
4. Verás sugerencias de exploración emocional
5. Repite con **Ola Energética** ⚡ y **Ola Sanadora** 💙

#### Test 2: Sugerencias Dinámicas Durante Conversación
1. Selecciona cualquier ola
2. **Verás sugerencias iniciales** personalizadas
3. Escribe: "No sé qué hacer" → Océano rojo → Sugerencias de **Confused**
4. Escribe: "Me da miedo" → Océano naranja → Sugerencias de **Anxious**
5. Escribe: "¿Qué me importa?" → Océano azul → Sugerencias de **Processing**
6. Escribe: "Ahora entiendo" → Océano celeste → Sugerencias de **Clarity**
7. Escribe: "¿Qué hago ahora?" → Océano pastel → Sugerencias de **Resolved**

### Probar Botón de Cambiar Ola
1. Inicia conversación
2. Escribe varios mensajes
3. Click en 🔄
4. Confirma → Ve a selección de olas
5. Selecciona otra ola → Nueva conversación
6. Verifica que todo se resetea correctamente

## ✅ Verificación

### Checklist de Funcionalidad
- [x] Sugerencias personalizadas por tipo de ola (4 tipos)
- [x] Sugerencias iniciales se muestran al entrar
- [x] Sugerencias cambian según estado del océano
- [x] Click en sugerencia la copia al input
- [x] Botón de cambiar ola funciona correctamente
- [x] Confirmación antes de cambiar
- [x] Limpieza completa de estado
- [x] Va directo a selección de olas (sin intro)
- [x] Nueva conversación inicia correctamente
- [x] Mapeo correcto de IDs de estados
- [x] Títulos dinámicos por estado y ola
- [x] Compatibilidad con Life Questioning
- [x] Test automatizado disponible

## 🚀 Próximas Mejoras

- [ ] Sugerencias personalizadas basadas en historial
- [ ] Animación de transición entre sugerencias
- [ ] Sugerencias multi-idioma
- [ ] Sugerencias basadas en logros desbloqueados
- [ ] Modo "exploración guiada" con sugerencias progresivas

---

**Estado**: ✅ Completamente implementado y funcional
**Test**: `tests/suggestions_test.html`
**Archivos modificados**:
- `index.html` - Botón de volver
- `css/style.css` - Estilos del botón
- `js/main.js` - Lógica de reinicio y sugerencias
- `js/ui/suggestions.js` - Sistema de sugerencias contextuales
- `tests/suggestions_test.html` - Test automatizado
