# 🐛 Reporte de Errores de Testing

## Errores Comunes y Soluciones

### 1. ❌ "i18n is not defined" o "window.i18n is undefined"

**Causa:** El archivo `js/i18n/i18n-ui.js` no exporta correctamente el objeto `i18n`.

**Solución:** Verificar que el archivo tenga:
```javascript
window.i18n = i18n; // Al final del archivo
```

### 2. ❌ "SuggestionSystem is not defined"

**Causa:** El archivo `js/ui/suggestions.js` no exporta la clase al objeto window.

**Solución:** Verificar que el archivo tenga:
```javascript
window.SuggestionSystem = SuggestionSystem; // Al final del archivo
```

### 3. ❌ "OceanDynamics is not defined"

**Causa:** El archivo `js/engine/oceanDynamics.js` no exporta la clase.

**Solución:** Verificar que el archivo tenga:
```javascript
window.OceanDynamics = OceanDynamics; // Al final del archivo
```

### 4. ❌ "AchievementSystem is not defined"

**Causa:** El archivo `js/engine/achievementSystem.js` no exporta la clase.

**Solución:** Verificar que el archivo tenga:
```javascript
window.AchievementSystem = AchievementSystem; // Al final del archivo
```

### 5. ❌ "showCustomConfirm is not defined"

**Causa:** El archivo `js/ui/modal.js` no exporta la función.

**Solución:** Verificar que el archivo tenga:
```javascript
window.showCustomConfirm = showCustomConfirm; // Al final del archivo
```

### 6. ❌ "translations is not defined"

**Causa:** El archivo `js/i18n/translations.js` no exporta el objeto.

**Solución:** Verificar que el archivo tenga:
```javascript
window.translations = translations; // Al final del archivo
```

## Cómo Verificar Errores

### En la Consola del Navegador (F12):

1. Abre el test: `tests/full_app_test.html`
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Console"
4. Busca mensajes en rojo (errores)

### Errores Típicos:

```
❌ Failed to load resource: net::ERR_FILE_NOT_FOUND
   → El archivo no existe en la ruta especificada

❌ Uncaught ReferenceError: i18n is not defined
   → El objeto no está exportado a window

❌ Uncaught TypeError: Cannot read property 'setLanguage' of undefined
   → El objeto existe pero no tiene el método esperado
```

## Tests que Deberían Pasar

### ✅ Tests Básicos (No requieren archivos externos):
- Test Cambio de Tema
- Test Responsive (solo información)

### ⚠️ Tests que Requieren Archivos:
- Test Cambio de Idiomas → Requiere `i18n-ui.js` y `translations.js`
- Verificar Traducciones → Requiere `translations.js`
- Test Sugerencias → Requiere `suggestions.js`
- Test Logros → Requiere `achievementSystem.js`
- Test Dinámica Oceánica → Requiere `oceanDynamics.js`
- Test Modal → Requiere `modal.js`

## Solución Rápida

Si muchos tests fallan, probablemente los archivos no están exportando correctamente.

### Verificar Exportaciones:

Abre la consola del navegador en el test y ejecuta:

```javascript
console.log({
    translations: typeof window.translations,
    i18n: typeof window.i18n,
    SuggestionSystem: typeof window.SuggestionSystem,
    OceanDynamics: typeof window.OceanDynamics,
    AchievementSystem: typeof window.AchievementSystem,
    showCustomConfirm: typeof window.showCustomConfirm
});
```

Todos deberían mostrar `"object"` o `"function"`, no `"undefined"`.

## Próximos Pasos

1. Identifica qué tests fallan
2. Verifica en la consola qué objetos están undefined
3. Abre el archivo correspondiente
4. Añade la exportación al final del archivo
5. Recarga el test

## Ejemplo de Corrección

Si `SuggestionSystem` no está definido:

1. Abre `js/ui/suggestions.js`
2. Ve al final del archivo
3. Añade:
```javascript
// Export to window for testing
if (typeof window !== 'undefined') {
    window.SuggestionSystem = SuggestionSystem;
}
```
4. Guarda y recarga el test
