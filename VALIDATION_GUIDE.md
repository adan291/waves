# 🔍 Guía de Validación Rápida

**Fecha**: Noviembre 25, 2025  
**Servidor**: http://localhost:8000 ✅ (corriendo)  
**Estado**: Listo para validar

---

## ⚡ Inicio Rápido (5 minutos)

### 1. Abrir Aplicación
```
URL: http://localhost:8000
```

### 2. Abrir Consola del Navegador
- **Windows**: `F12` o `Ctrl + Shift + I`
- **Mac**: `Cmd + Option + I`

### 3. Verificación Rápida de Errores
En la consola, ejecuta:
```javascript
// Verificar que no hay errores críticos
console.log('✅ Consola abierta');

// Verificar que los módulos principales están cargados
console.log('I18n:', typeof I18n !== 'undefined' ? '✅' : '❌');
console.log('AchievementSystem:', typeof AchievementSystem !== 'undefined' ? '✅' : '❌');
console.log('SplashScreen:', typeof SplashScreen !== 'undefined' ? '✅' : '❌');
```

**Resultado esperado**: Todos deben mostrar ✅

---

## 🧪 Tests Funcionales (10 minutos)

### Test 1: Sistema de Traducciones
```javascript
// En la consola del navegador:

// 1. Verificar idioma actual
console.log('Idioma actual:', I18n.currentLanguage);

// 2. Cambiar a inglés
I18n.setLanguage('en');
console.log('Cambiado a:', I18n.currentLanguage);

// 3. Verificar traducción
console.log('Traducción test:', I18n.t('splash.title'));

// 4. Volver a español
I18n.setLanguage('es');
console.log('Vuelto a:', I18n.currentLanguage);
```

**✅ Pasa si**: Los textos en la UI cambian correctamente

---

### Test 2: Splash Screen
```javascript
// En la consola del navegador:

// 1. Limpiar localStorage
localStorage.clear();
console.log('✅ localStorage limpiado');

// 2. Recargar página
location.reload();

// Después de recargar:
// - Debe aparecer el splash screen
// - Debe mostrar "Comenzar Viaje"
// - Al hacer clic, debe mostrar selección de olas
```

**✅ Pasa si**: El splash aparece y funciona correctamente

---

### Test 3: Sistema de Logros
```javascript
// En la consola del navegador:

// 1. Verificar logros desbloqueados
console.log('Logros:', AchievementSystem.getUnlockedAchievements());

// 2. Verificar progreso
console.log('Progreso:', AchievementSystem.getProgress());

// 3. Simular desbloqueo (si quieres probar)
// AchievementSystem.checkAchievements();
```

**✅ Pasa si**: Los logros se muestran correctamente

---

### Test 4: UI Compacta
**Verificación visual**:
- [ ] Botones superiores son compactos (40px altura)
- [ ] Botones de voz/enviar son circulares (48x48px)
- [ ] Mode indicator está arriba del chat (compacto)
- [ ] Ocean state indicator está abajo derecha (pequeño)
- [ ] Todo se ve proporcionado

**✅ Pasa si**: La UI se ve limpia y compacta

---

### Test 5: Funcionalidad Básica
```javascript
// 1. Escribir en el input: "Hola, ¿cómo estás?"
// 2. Presionar Enter o clic en enviar
// 3. Observar:
//    - Input se limpia ✅
//    - Aparece indicador de escritura ✅
//    - Mensaje se muestra en el chat ✅
```

**⚠️ Nota**: Si no tienes API key configurada, verás un mensaje de error (esto es normal)

---

## 📊 Métricas Rápidas

### Tamaño de Archivos
```powershell
# En PowerShell (desde la raíz del proyecto):
Get-ChildItem -Path js -Recurse -File | Measure-Object -Property Length -Sum | Select-Object @{Name="Total KB";Expression={[math]::Round($_.Sum/1KB,2)}}
Get-ChildItem -Path css -Recurse -File | Measure-Object -Property Length -Sum | Select-Object @{Name="Total KB";Expression={[math]::Round($_.Sum/1KB,2)}}
```

### Tiempo de Carga
1. Abrir DevTools → Network
2. Recargar página (`Ctrl + Shift + R`)
3. Ver tiempo total en la parte inferior

**Objetivo**: < 500ms

---

## ✅ Checklist de Validación

### Crítico (Debe funcionar)
- [ ] Aplicación carga sin errores en consola
- [ ] Sistema de traducciones funciona (ES/EN)
- [ ] Splash screen aparece en primera carga
- [ ] UI se ve correcta y compacta
- [ ] Input acepta texto y se limpia al enviar

### Importante (Debería funcionar)
- [ ] Sistema de logros registra acciones
- [ ] Botón de logros muestra galería
- [ ] Animaciones son suaves
- [ ] Responsive funciona en móvil

### Opcional (Nice to have)
- [ ] Funciona en Chrome/Edge
- [ ] Funciona en Firefox
- [ ] Métricas están dentro de objetivos

---

## 🐛 Si Encuentras Errores

### Error en Consola
```javascript
// Copiar el error completo y ejecutar:
console.log('Error encontrado:', {
    mensaje: 'PEGAR_AQUÍ_EL_ERROR',
    archivo: 'nombre_del_archivo.js',
    línea: 'número_de_línea'
});
```

### Funcionalidad No Funciona
1. Describir qué no funciona
2. Describir qué esperabas
3. Verificar en consola si hay errores
4. Anotar pasos para reproducir

---

## 🎯 Resultado Final

Después de completar las validaciones:

**✅ TODO BIEN**: Marca Fase 3 como completada en TODO.md

**⚠️ PROBLEMAS MENORES**: Anota en TASKS_CURRENT.md y continúa

**❌ PROBLEMAS CRÍTICOS**: Reporta los errores para corrección

---

## 💡 Comandos Útiles

```javascript
// Limpiar todo y empezar de nuevo
localStorage.clear();
location.reload();

// Ver estado actual
console.log('Estado:', {
    idioma: I18n.currentLanguage,
    logros: AchievementSystem.getUnlockedAchievements().length,
    tema: localStorage.getItem('whispers-theme')
});

// Forzar splash screen
localStorage.removeItem('whispers-splash-completed');
location.reload();
```

---

**¡Listo para validar!** 🚀

Abre http://localhost:8000 y sigue los tests en orden.
