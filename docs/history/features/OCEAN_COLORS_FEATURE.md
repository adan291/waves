# 🌊 Sistema de Colores Dinámicos del Océano

## Descripción

El fondo oceánico de la aplicación cambia de color dinámicamente según el estado emocional de la conversación. Esta funcionalidad está completamente implementada en `js/engine/oceanDynamics.js`.

## Estados Emocionales y Colores

### 1. 😕 Confusión (Confused)
- **Velocidad:** 8s por ciclo (rápido)
- **Colores Oscuros:** Rojos/Rosas intensos
- **Colores Claros:** Rosas suaves
- **Descripción:** Pensamientos dispersos, necesita claridad

### 2. 😰 Ansiedad (Anxious)
- **Velocidad:** 6s por ciclo (muy rápido)
- **Colores Oscuros:** Naranjas/Rojos cálidos
- **Colores Claros:** Naranjas suaves
- **Descripción:** Preocupación, necesita calma

### 3. 🤔 Procesando (Processing)
- **Velocidad:** 12s por ciclo (medio)
- **Colores Oscuros:** Azules vibrantes
- **Colores Claros:** Azules cielo
- **Descripción:** Explorando ideas, en progreso

### 4. 💡 Claridad (Clarity)
- **Velocidad:** 18s por ciclo (lento)
- **Colores Oscuros:** Azules claros/Cyan
- **Colores Claros:** Azules muy claros
- **Descripción:** Entendimiento emergente

### 5. ✨ Resolución (Resolved)
- **Velocidad:** 25s por ciclo (muy lento)
- **Colores Oscuros:** Verdes/Pasteles suaves
- **Colores Claros:** Verdes/Amarillos muy claros
- **Descripción:** Paz y comprensión alcanzadas

### 6. 🌊 Neutral (Neutral)
- **Velocidad:** 15s por ciclo (medio)
- **Colores Oscuros:** Azules profundos/Cyan
- **Colores Claros:** Azules cielo
- **Descripción:** Estado inicial, exploratorio

## Cómo Funciona

### Actualización Automática
El sistema analiza la conversación y actualiza el estado del océano basándose en:
- **Sentimiento:** Análisis del tono emocional (0.0 - 1.0)
- **Profundidad:** Nivel de introspección (0.0 - 1.0)

### Transiciones Suaves
- Duración: 2000ms (2 segundos)
- Efecto: ease-in-out
- Sin interrupciones durante transiciones activas

### Adaptación al Tema
Cada estado tiene dos paletas de colores:
- **Tema Oscuro:** Colores más intensos y profundos
- **Tema Claro:** Colores más suaves y luminosos

## Test Visual

### Archivo: `tests/ocean_colors_test.html`

Test interactivo que permite:
- ✅ Ver todos los estados emocionales
- ✅ Cambiar entre estados con un click
- ✅ Alternar entre tema claro/oscuro
- ✅ Ver preview de colores de cada estado
- ✅ Observar transiciones suaves en tiempo real

### Cómo Usar el Test

```bash
start tests/ocean_colors_test.html
```

1. Click en cualquier estado emocional
2. Observa cómo cambia el fondo suavemente
3. Usa el botón de tema para ver ambas paletas
4. Los colores se muestran en el preview

## Integración en la Aplicación

### En `js/main.js`
```javascript
// Inicializar
OceanDynamics.init();

// Actualizar según conversación
OceanDynamics.updateState({
    sentiment: 0.8,  // 0.0 = negativo, 1.0 = positivo
    depth: 0.6       // 0.0 = superficial, 1.0 = profundo
});
```

### Forzar Estado Específico
```javascript
OceanDynamics.updateState({
    sentiment: 0.5,
    depth: 0.5,
    forceState: 'clarity'  // Forzar estado específico
});
```

## API del Sistema

### `OceanDynamics.init()`
Inicializa el sistema y aplica el estado neutral.

### `OceanDynamics.updateState(options)`
Actualiza el estado del océano.
- `sentiment` (number): 0.0 - 1.0
- `depth` (number): 0.0 - 1.0
- `forceState` (string): ID del estado a forzar

### `OceanDynamics.getCurrentState()`
Retorna el estado actual con toda su configuración.

### `OceanDynamics.applyState(stateId, animate)`
Aplica un estado específico.
- `stateId` (string): ID del estado
- `animate` (boolean): Si debe animar la transición

## Verificación

El test completo (`tests/full_app_test.html`) incluye:
- ✅ Verificación de que todos los estados tienen colores
- ✅ Verificación de paletas para tema claro y oscuro
- ✅ Test de actualización de estado
- ✅ Test de obtención de estado actual

## Notas Técnicas

- Los colores se aplican como gradientes lineales
- La animación usa `background-size: 400% 400%` para efecto de movimiento
- La velocidad de animación varía según el estado emocional
- Las transiciones previenen cambios simultáneos
- El estado se guarda en `data-ocean-state` del elemento

## Ejemplo Visual

```
Confusión:    🔴🔴🔴 (Rápido, intenso)
Ansiedad:     🟠🟠🟠 (Muy rápido, cálido)
Procesando:   🔵🔵🔵 (Medio, exploratorio)
Claridad:     🔷🔷🔷 (Lento, tranquilo)
Resolución:   🟢🟢🟢 (Muy lento, pacífico)
Neutral:      🌊🌊🌊 (Medio, equilibrado)
```
