# 🎭 Modal Personalizado - Ocean Theme

## ✅ Implementado

Sistema de modales personalizados con el estilo oceánico de Whispers of the Wave, reemplazando los `confirm()` y `alert()` genéricos del navegador.

## 🎨 Características

### Diseño Ocean-Themed
- **Fondo**: Overlay con blur oceánico
- **Container**: Gradiente azul profundo con bordes turquesa
- **Animaciones**: Entrada suave con scale + translateY
- **Wave effect**: Línea animada en el header
- **Responsive**: Adaptado para mobile y desktop
- **Tema claro/oscuro**: Soporte completo

### Tipos de Modal

#### 1. Modal de Confirmación
Dos botones: Confirmar y Cancelar

```javascript
ModalUI.showConfirm({
    title: '🌊 Cambiar de Ola',
    message: '¿Quieres elegir una nueva ola? Se perderá la conversación actual.',
    confirmText: 'Cambiar de Ola',
    cancelText: 'Continuar Aquí',
    onConfirm: () => {
        // Acción al confirmar
    },
    onCancel: () => {
        // Acción al cancelar (opcional)
    }
});
```

#### 2. Modal Informativo
Un solo botón para cerrar

```javascript
ModalUI.showInfo({
    title: '💡 Información',
    message: 'Este es un mensaje informativo.',
    buttonText: 'Entendido',
    onClose: () => {
        // Acción al cerrar (opcional)
    }
});
```

## 🎯 Uso en la App

### Cambio de Ola
Reemplaza el `confirm()` genérico con modal personalizado:

**Antes:**
```javascript
const confirmed = confirm('¿Quieres cambiar de ola?');
if (confirmed) {
    // cambiar ola
}
```

**Ahora:**
```javascript
ModalUI.showConfirm({
    title: '🌊 Cambiar de Ola',
    message: '¿Quieres elegir una nueva ola? Se perderá la conversación actual y comenzarás de nuevo.',
    confirmText: 'Cambiar de Ola',
    cancelText: 'Continuar Aquí',
    onConfirm: () => {
        performWaveChange();
    }
});
```

## 🎨 Estilos

### Estructura CSS
```
.modal-overlay (fondo con blur)
└── .modal-container (caja principal)
    ├── .modal-header (título)
    ├── .modal-body (mensaje)
    └── .modal-footer (botones)
```

### Colores

**Tema Oscuro:**
- Overlay: `rgba(10, 17, 40, 0.85)` + blur
- Container: Gradiente azul oscuro
- Bordes: Turquesa `rgba(64, 224, 208, 0.4)`
- Botón confirmar: Gradiente turquesa
- Botón cancelar: Gris translúcido

**Tema Claro:**
- Overlay: `rgba(255, 255, 255, 0.85)` + blur
- Container: Gradiente azul claro
- Bordes: Azul `rgba(1, 87, 155, 0.4)`
- Botón confirmar: Gradiente azul
- Botón cancelar: Gris claro

### Animaciones

**Entrada:**
```css
opacity: 0 → 1
transform: scale(0.9) translateY(-20px) → scale(1) translateY(0)
duration: 0.3s
```

**Wave Effect:**
```css
Línea horizontal que se mueve de izquierda a derecha
animation: modalWave 2s infinite
```

**Hover en botones:**
```css
transform: translateY(-2px)
box-shadow aumenta
```

## 🔧 API

### ModalUI.showConfirm(options)

**Parámetros:**
- `title` (string): Título del modal
- `message` (string): Mensaje principal
- `confirmText` (string): Texto del botón confirmar (default: "Confirmar")
- `cancelText` (string): Texto del botón cancelar (default: "Cancelar")
- `onConfirm` (function): Callback al confirmar
- `onCancel` (function): Callback al cancelar (opcional)

### ModalUI.showInfo(options)

**Parámetros:**
- `title` (string): Título del modal
- `message` (string): Mensaje principal
- `buttonText` (string): Texto del botón (default: "Entendido")
- `onClose` (function): Callback al cerrar (opcional)

### ModalUI.closeModal(modal)

Cierra y elimina un modal del DOM.

## 🎮 Interacciones

El modal se puede cerrar de 3 formas:

1. **Click en botón**: Confirmar o Cancelar
2. **Click en overlay**: Click fuera del modal (ejecuta onCancel)
3. **Tecla ESC**: Presionar Escape (ejecuta onCancel)

## 📱 Responsive

### Desktop (> 768px)
- Ancho máximo: 500px
- Botones en fila horizontal
- Padding generoso

### Tablet (768px)
- Ancho: 95%
- Botones en columna
- Padding reducido

### Mobile (< 480px)
- Ancho: 95%
- Fuentes más pequeñas
- Botones full-width
- Padding mínimo

## 🧪 Testing

### Test Automatizado
Abre `tests/modal_test.html` para probar:
- ✅ Modal de confirmación
- ✅ Modal de cambio de ola
- ✅ Modal informativo
- ✅ Interacciones (ESC, overlay, botones)
- ✅ Tema claro/oscuro

### Test en la App
1. Abre la app
2. Inicia conversación
3. Click en 🔄 (cambiar ola)
4. **Verás el modal personalizado** en lugar del confirm() genérico
5. Prueba cerrar de diferentes formas

## 📊 Comparación

| Aspecto | confirm() Genérico | Modal Personalizado |
|---------|-------------------|---------------------|
| **Diseño** | Estilo del navegador | Ocean theme |
| **Animación** | Ninguna | Entrada suave + wave |
| **Responsive** | Básico | Optimizado |
| **Tema** | Sistema | Claro/Oscuro |
| **Personalización** | Limitada | Total |
| **UX** | Abrupto | Fluido |

## 🚀 Ventajas

- ✅ **Consistencia visual** con el resto de la app
- ✅ **Mejor UX** con animaciones suaves
- ✅ **Más flexible** (emojis, textos largos, etc.)
- ✅ **Responsive** optimizado
- ✅ **Accesible** (ESC, overlay click)
- ✅ **Tema adaptable** (claro/oscuro)

## 📁 Archivos

```
css/modal.css           - Estilos del modal
js/ui/modal.js          - Lógica del modal
tests/modal_test.html   - Test automatizado
```

## 🔄 Integración

El modal se carga automáticamente en `index.html`:

```html
<!-- CSS -->
<link rel="stylesheet" href="css/modal.css">

<!-- JS -->
<script src="js/ui/modal.js"></script>
```

Y se usa en `js/main.js`:

```javascript
function handleBackToStart() {
    ModalUI.showConfirm({
        title: '🌊 Cambiar de Ola',
        message: '¿Quieres elegir una nueva ola?...',
        confirmText: 'Cambiar de Ola',
        cancelText: 'Continuar Aquí',
        onConfirm: () => performWaveChange()
    });
}
```

## 🎯 Próximas Mejoras

- [ ] Modal con input (para nombres, etc.)
- [ ] Modal con lista de opciones
- [ ] Animaciones de salida personalizadas
- [ ] Sonidos al abrir/cerrar
- [ ] Soporte para HTML en mensaje
- [ ] Modal con progreso/loading

---

**Estado**: ✅ Completamente implementado y funcional
**Test**: `tests/modal_test.html`
**Archivos**:
- `css/modal.css` - Estilos
- `js/ui/modal.js` - Lógica
- `js/main.js` - Integración
- `index.html` - Carga de archivos
