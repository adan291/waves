# Fix: Duplicación de Modales

## Problema
Al hacer clic en los botones de **Logros (🏆)** e **Informe (📊)**, los modales se duplicaban en lugar de reemplazarse.

## Causa
Las funciones `showGallery()` y `show()` añadían nuevos modales al DOM sin verificar si ya existía uno abierto.

## Solución

### 1. Achievement Gallery (Logros)

**Archivo**: `js/ui/achievementUI.js`

**Cambio**: Añadida verificación para eliminar modal existente antes de crear uno nuevo:

```javascript
showGallery() {
    // Remove existing modal if present
    const existingModal = document.querySelector('.achievement-gallery-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = this.createGalleryModal();
    document.body.appendChild(modal);
    
    // Setup controls
    this.setupGalleryControls();
}
```

### 2. Report Modal (Informe)

**Archivo**: `js/ui/reportUI.js`

**Cambio**: Añadida verificación para eliminar modal existente antes de crear uno nuevo:

```javascript
async show() {
    // Remove existing modal if present
    const existingModal = document.querySelector('.report-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // ... resto del código
}
```

## Verificación

### Para verificar Logros:
1. Abrir la aplicación
2. Hacer clic en el botón 🏆 (top-right)
3. Hacer clic varias veces seguidas
4. Solo debe aparecer UN modal
5. Cerrar y volver a abrir - debe funcionar correctamente

### Para verificar Informe:
1. Abrir la aplicación
2. Hacer clic en el botón 📊 (top-right)
3. Hacer clic varias veces seguidas
4. Solo debe aparecer UN modal
5. Cerrar y volver a abrir - debe funcionar correctamente

## Resultado

✅ Los modales ya no se duplican
✅ Se puede abrir y cerrar múltiples veces sin problemas
✅ El comportamiento es consistente y predecible
