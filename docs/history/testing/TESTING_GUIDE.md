# 🧪 Guía de Testing - Whispers of the Wave

## Test Completo de la Aplicación

### Archivo de Test
`tests/full_app_test.html`

### Cómo Ejecutar

1. **Abrir el archivo de test:**
   ```bash
   start tests/full_app_test.html
   ```

2. **Panel de Control:**
   - Verás un panel negro en la esquina superior derecha
   - Contiene todos los tests organizados por categorías

### Tests Disponibles

#### 🌐 Internacionalización
- **Test Cambio de Idiomas**: Prueba cambiar entre ES, EN, FR, DE
- **Verificar Traducciones**: Comprueba que todas las claves estén traducidas

#### 🎨 Temas
- **Test Cambio de Tema**: Alterna entre tema claro y oscuro
- **Detectar Flash Visual**: Cambia rápidamente de tema para detectar flashes

#### 🌊 Olas y Sugerencias
- **Test Selección de Olas**: Prueba seleccionar cada tipo de ola
- **Test Sugerencias**: Verifica que las sugerencias se generen correctamente

#### 🎯 Funcionalidades
- **Test Logros**: Verifica el sistema de achievements
- **Test Dinámica Oceánica**: Prueba los cambios de estado del océano
- **Test Modal**: Comprueba que los modales personalizados funcionen

#### 📱 Responsive
- **Test Responsive**: Información sobre breakpoints actuales

#### 🚀 Test Completo
- **Ejecutar Todos**: Corre todos los tests en secuencia

### Interpretación de Resultados

#### Colores
- 🟢 **Verde (test-pass)**: Test exitoso
- 🔴 **Rojo (test-fail)**: Test fallido
- 🔵 **Cyan (test-info)**: Información adicional

#### Detector de Flash
- Si ves una alerta roja en la esquina inferior derecha durante el test de temas
- Significa que se detectó un flash visual (cambio brusco de color)
- Esto indica que hay que mejorar las transiciones

### Tests Manuales Recomendados

Además de los tests automáticos, prueba manualmente:

1. **Navegación entre pantallas:**
   - Splash → Main
   - Main → Achievements
   - Main → Report
   - Botón de volver en cada pantalla

2. **Cambio de idioma en cada pantalla:**
   - Verifica que no haya flash visual
   - Comprueba que todos los textos cambien
   - Asegúrate de que los botones mantengan su tamaño

3. **Cambio de tema en cada pantalla:**
   - Alterna entre claro y oscuro
   - Verifica transiciones suaves
   - Comprueba legibilidad en ambos temas

4. **Selección de olas:**
   - Selecciona cada tipo de ola
   - Verifica que las sugerencias cambien
   - Comprueba que el botón de navegación funcione

5. **Responsive:**
   - Redimensiona la ventana del navegador
   - Prueba en diferentes tamaños:
     - Desktop (>1200px)
     - Tablet (768px-1200px)
     - Mobile (<768px)
   - Verifica que todos los elementos sean accesibles

6. **Interacciones:**
   - Hover sobre botones
   - Click en todos los botones
   - Scroll en conversaciones largas
   - Modales de confirmación

### Checklist de Calidad

- [ ] Todos los idiomas funcionan sin errores
- [ ] No hay flashes visuales al cambiar tema/idioma
- [ ] Todas las olas se pueden seleccionar
- [ ] Las sugerencias cambian según contexto
- [ ] Los logros se desbloquean correctamente
- [ ] El océano cambia de estado dinámicamente
- [ ] Los modales se muestran correctamente
- [ ] La aplicación es responsive en todos los tamaños
- [ ] No hay errores en la consola del navegador
- [ ] Todas las animaciones son suaves
- [ ] Los botones tienen feedback visual
- [ ] El texto es legible en ambos temas

### Problemas Comunes

#### Si un test falla:
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que todos los archivos JS estén cargados
4. Comprueba que las rutas de los scripts sean correctas

#### Si hay flashes visuales:
1. Verifica que las transiciones CSS estén aplicadas
2. Comprueba que `data-theme` se cambie correctamente
3. Asegúrate de que no haya re-renders innecesarios

#### Si las traducciones fallan:
1. Verifica que `translations.js` esté cargado
2. Comprueba que todas las claves existan en todos los idiomas
3. Asegúrate de que `i18n-ui.js` esté funcionando

### Notas Importantes

- Los tests automáticos no pueden simular todas las interacciones de usuario
- Es importante hacer pruebas manuales además de las automáticas
- Presta atención a la experiencia de usuario, no solo a que funcione
- Verifica en diferentes navegadores si es posible (Chrome, Firefox, Safari)

### Reportar Problemas

Si encuentras problemas, anota:
1. Qué test falló
2. Mensaje de error (si hay)
3. Pasos para reproducir
4. Navegador y versión
5. Tamaño de pantalla (si es relevante)
