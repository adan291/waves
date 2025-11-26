# 🧪 GUÍA DE TESTING - Whispers of the Wave

**Fecha:** 2025-11-14  
**Estado:** ✅ LISTO PARA PROBAR

---

## 🎯 OPCIONES DE TESTING

### Opción 1: Test de Integración (Sin API) ⭐ RECOMENDADO

**Archivo:** `test_integration.html`

**Qué hace:**
- Verifica que todos los módulos se carguen correctamente
- Prueba cada módulo individualmente
- Simula el flujo completo sin llamar a la API
- Muestra resultados en tiempo real

**Cómo usar:**
```bash
# Abrir el archivo de test
start test_integration.html
```

**Tests disponibles:**
1. ✅ Test Carga de Módulos
2. ✅ Test Estado
3. ✅ Test Análisis Emocional
4. ✅ Test Alternancia Personas
5. ✅ Test Parser JSON
6. ✅ Test Prompts
7. ✅ Test Flujo Completo (Sin API)

**Resultado esperado:**
```
✅ 11/11 módulos cargados
✅ Todos los tests pasan
✅ Flujo completo funciona
```

---

### Opción 2: Aplicación Real (Con API)

**Archivo:** `index.html`

**Requisitos:**
1. Configurar API key de Gemini
2. Conexión a internet

**Pasos:**

#### 1. Configurar API Key

Editar `js/services/geminiService.js`:
```javascript
const geminiConfig = {
    apiKey: 'TU_API_KEY_AQUI', // ← Reemplazar
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
    model: 'gemini-pro',
    ttsModel: 'gemini-2.5-flash-preview-tts',
    ttsVoice: 'Kore'
};
```

Obtener API key: https://makersuite.google.com/app/apikey

#### 2. Abrir Aplicación

```bash
# Opción A: Directamente
start index.html

# Opción B: Servidor local
python -m http.server 8000
# Luego visitar: http://localhost:8000
```

#### 3. Abrir DevTools Console (F12)

Verificar que aparezcan estos mensajes:
```
🌊 State module loaded
🌊 Event module loaded
🌊 Gemini service loaded
🌊 Audio service loaded
🌊 Parser module loaded
🌊 Personas module loaded
🌊 Emotional module loaded
🌊 Narrative module loaded
🌊 Prompts master loaded
🌊 Renderer module loaded
🌊 Controls module loaded
🌊 Whispers of the Wave - Initializing...
✅ Application ready
🎭 Current persona: narrador
```

#### 4. Probar Conversación

**Mensaje 1:**
```
Me siento perdido
```

**Verificar en consola:**
```
👤 User message displayed
⏳ Typing indicator shown
🎭 Emotional analysis: { tone: 'confused', intensity: 0.6, ... }
🎭 Current persona: narrador
📨 Response received from Gemini
✅ Response parsed
🌊 Whisper displayed
🌙 Wave displayed
🔊 Audio controls created
🔄 Persona switched: narrador → kiro
✅ Message handled successfully
```

**Verificar en UI:**
- ✅ Tu mensaje aparece
- ✅ Respuesta del narrador aparece (whisper + wave)
- ✅ Botón 🔊 Escuchar aparece
- ✅ Indicador muestra "Kiro - Susurro de la Ola"

**Mensaje 2:**
```
¿Qué debo hacer?
```

**Verificar:**
- ✅ Respuesta de Kiro (más reflexiva)
- ✅ Indicador cambia a "El Narrador del Mar"
- ✅ Alternancia funciona

#### 5. Probar Audio

**Click en botón 🔊 Escuchar:**

**Verificar estados:**
1. Inicial: 🔊 Escuchar
2. Loading: ⏳ Generando...
3. Playing: ⏸️ Detener
4. Final: 🔊 Escuchar

**Verificar en consola:**
```
🎤 Generating TTS audio...
🔊 TTS audio generated successfully
▶️ Audio playback started
[Audio plays...]
🔇 Audio playback ended
```

---

## 🐛 TROUBLESHOOTING

### Problema: Módulos no cargan

**Síntomas:**
- Consola muestra errores
- Aplicación no responde

**Solución:**
1. Verificar que todos los archivos existen
2. Verificar orden de scripts en index.html
3. Limpiar caché del navegador (Ctrl+Shift+R)
4. Probar en modo incógnito

---

### Problema: API no responde

**Síntomas:**
- Error en consola: "API Error"
- Mensaje: "The tide encountered an unexpected current"

**Solución:**
1. Verificar API key está configurada correctamente
2. Verificar conexión a internet
3. Verificar límites de API de Gemini
4. Probar con otro mensaje

---

### Problema: Audio no funciona

**Síntomas:**
- Botón muestra "❌ Error"
- No se reproduce audio

**Solución:**
1. Verificar API key está configurada
2. Verificar permisos de audio en navegador
3. Probar en otro navegador
4. Verificar que TTS está habilitado en tu cuenta de Gemini

---

### Problema: Alternancia no funciona

**Síntomas:**
- Siempre responde la misma persona
- Indicador no cambia

**Solución:**
1. Verificar en consola que switchPersona() se llama
2. Verificar que personas.js está cargado
3. Resetear estado: `resetPersonaState()` en consola

---

## 📊 CHECKLIST DE TESTING

### Test Básico (Sin API)
- [ ] Abrir test_integration.html
- [ ] Verificar 11/11 módulos cargados
- [ ] Ejecutar todos los tests
- [ ] Verificar que todos pasan

### Test Completo (Con API)
- [ ] Configurar API key
- [ ] Abrir index.html
- [ ] Verificar carga de módulos en consola
- [ ] Enviar primer mensaje
- [ ] Verificar respuesta del narrador
- [ ] Verificar whisper + wave
- [ ] Verificar botón de audio
- [ ] Enviar segundo mensaje
- [ ] Verificar respuesta de kiro
- [ ] Verificar alternancia
- [ ] Click en botón de audio
- [ ] Verificar reproducción
- [ ] Enviar tercer mensaje
- [ ] Verificar que vuelve al narrador

### Test de Audio
- [ ] Click en 🔊 Escuchar
- [ ] Verificar estado "Generando..."
- [ ] Verificar estado "Detener"
- [ ] Escuchar audio completo
- [ ] Verificar vuelve a "Escuchar"
- [ ] Probar con otro mensaje

---

## 🎯 CASOS DE PRUEBA SUGERIDOS

### Caso 1: Conversación Emocional
```
Usuario: Me siento muy solo
Narrador: [Escena poética sobre soledad]
Usuario: ¿Por qué me siento así?
Kiro: [Reflexión profunda con pregunta]
Usuario: Gracias, eso ayuda
Narrador: [Escena de esperanza]
```

### Caso 2: Búsqueda de Claridad
```
Usuario: No sé qué estudiar
Narrador: [Escena sobre caminos]
Usuario: Tengo muchas opciones
Kiro: [Pregunta clarificadora]
Usuario: Me gusta la tecnología
Narrador: [Escena sobre exploración]
```

### Caso 3: Conversación Tranquila
```
Usuario: Hola océano
Narrador: [Escena de bienvenida]
Usuario: Cuéntame algo
Kiro: [Reflexión suave]
Usuario: Interesante
Narrador: [Escena contemplativa]
```

---

## 📝 REPORTAR PROBLEMAS

Si encuentras problemas:

1. **Capturar información:**
   - Screenshot de la consola
   - Mensaje que causó el error
   - Navegador y versión

2. **Verificar:**
   - ¿Todos los módulos cargaron?
   - ¿API key está configurada?
   - ¿Hay errores en consola?

3. **Intentar:**
   - Limpiar caché
   - Probar en incógnito
   - Probar en otro navegador
   - Ejecutar test_integration.html

---

## 🎉 TESTING EXITOSO

Si todo funciona correctamente, deberías ver:

✅ Todos los módulos cargan  
✅ Conversación fluye naturalmente  
✅ Alternancia narrador/kiro funciona  
✅ Análisis emocional detecta tonos  
✅ Respuestas son poéticas y oceánicas  
✅ Audio se genera y reproduce  
✅ UI es fluida y responsive  
✅ No hay errores en consola  

**¡Whispers of the Wave está funcionando! 🌊✨**

---

## 📞 PRÓXIMOS PASOS

Una vez que el testing sea exitoso:

1. **Experimentar** con diferentes tipos de mensajes
2. **Ajustar prompts** si es necesario
3. **Probar en móvil** para verificar responsive
4. **Compartir** con otros para feedback
5. **Preparar** para Fase 2

---

**Estado:** ✅ GUÍA COMPLETA  
**Listo para:** TESTING COMPLETO
