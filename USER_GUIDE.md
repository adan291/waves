# Guía de Usuario - Whispers of the Wave 🌊

**Versión**: 1.0  
**Última actualización**: Noviembre 25, 2025

Bienvenido a **Whispers of the Wave**, una experiencia de chat inmersiva diseñada para la calma y la reflexión. Esta guía te ayudará a sacar el máximo provecho de todas las funcionalidades.

---

## 📚 Documentación Completa

### Para Usuarios
- **[🚀 Inicio Rápido](docs/QUICKSTART.md)** - Configura en 5 minutos
- **[📖 Esta Guía](USER_GUIDE.md)** - Guía completa de uso
- **[🎯 Características](FEATURES.md)** - Todas las características

### Para Desarrolladores
- **[🏗️ Arquitectura](docs/ARCHITECTURE.md)** - Arquitectura del sistema
- **[📦 Módulos](docs/MODULES.md)** - 40 módulos documentados
- **[📚 API Reference](docs/API_REFERENCE.md)** - Referencia de APIs
- **[🛠️ Development](docs/DEVELOPMENT.md)** - Guía de desarrollo
- **[🤝 Contributing](docs/CONTRIBUTING.md)** - Cómo contribuir
- **[🚀 Deployment](docs/DEPLOYMENT.md)** - Guía de deployment
- **[⚙️ Configuration](docs/CONFIGURATION.md)** - Configuración avanzada

---

## 🚀 Inicio Rápido

### Requisitos
- Un navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Una API Key de Google Gemini
- Conexión a internet

### Configuración en 3 Pasos

#### Paso 1: Obtén tu API Key
Ve a [Google AI Studio](https://makersuite.google.com/app/apikey) y genera una clave gratuita.

#### Paso 2: Configura la App
Abre el archivo `js/geminiService.js` y reemplaza:
```javascript
const geminiConfig = {
    apiKey: 'YOUR_API_KEY_HERE',  // ← Pega tu API key aquí
    // ...
};
```

#### Paso 3: Abre la App
- **Opción A**: Abre `index.html` directamente en tu navegador
- **Opción B**: Usa un servidor local:
  ```bash
  python -m http.server 8000
  # Luego abre: http://localhost:8000
  ```

**¡Listo!** Empieza a conversar.

> 💡 **Tip**: Para más detalles, consulta la [Guía de Inicio Rápido](docs/QUICKSTART.md)

---

## ✨ Características Principales

### 🌊 Experiencia Oceánica Inmersiva
- **Fondo animado**: Gradiente oceánico con animación suave
- **Tema adaptativo**: Cambia según el estado emocional
- **Responsive**: Funciona en desktop, tablet y móvil

### 🤖 IA Conversacional Dual
- **Whispers**: Respuestas poéticas y empáticas con metáforas del océano
- **Kiro**: Respuestas analíticas y estructuradas (futuro)
- **Formato dual**: Whisper (susurro) + Wave of Reflection (reflexión)

### 💾 Gestión de Conversaciones
- **Auto-guardado**: Tus conversaciones se guardan automáticamente
- **Historial**: Accede a conversaciones anteriores
- **Privacidad**: Todo se guarda localmente en tu navegador

### 🎨 Personalización
- **Temas**: Modo oscuro (océano profundo) y claro (playa)
- **Idiomas**: Español e Inglés
- **Accesibilidad**: Diseño accesible con ARIA labels

### 🔒 Seguridad y Privacidad
- **100% local**: Tus datos nunca salen de tu navegador
- **Sin tracking**: Sin cookies ni rastreadores de terceros
- **Validación**: Múltiples capas de validación de entrada
- **Sanitización**: Protección contra XSS

---

## 🎮 Interfaz y Controles

### La Experiencia Dual
Conversarás con dos entidades que se alternan:
- **Whispers (Susurros)**: Poético, empático, enfocado en las emociones.
- **Kiro**: Analítico, estructurado, enfocado en la claridad.

### El Océano Dinámico
El fondo cambiará sutilmente según el tono emocional de la conversación:
- **Confusión**: Aguas agitadas, tonos oscuros.
- **Ansiedad**: Movimiento rápido, tonos violetas/rojizos.
- **Procesando**: Olas rítmicas, tonos azules profundos.
- **Claridad**: Aguas tranquilas, tonos turquesa brillantes.
- **Resolución**: Calma total, tonos dorados/verdes suaves.

### Controles Principales
- **Campo de Texto**: Escribe tu mensaje y presiona Enter.
- **Micrófono (🎤)**: Activa el reconocimiento de voz (Speech-to-Text).
- **Altavoz (🔊)**: Activa/desactiva la lectura en voz alta de las respuestas (Text-to-Speech).
- **Tema (☀️/🌙)**: Alterna entre modo Claro (Playa) y Oscuro (Océano profundo).
- **Idioma (🌐)**: Cambia el idioma de la interfaz (Español/Inglés).

---

## ⌨️ Atajos de Teclado

| Atajo | Acción | Descripción |
|-------|--------|-------------|
| `Ctrl + K` | Limpiar | Reinicia la conversación actual (mantiene el historial guardado). |
| `Ctrl + H` | Historial | Abre el buscador de conversaciones pasadas. |
| `Ctrl + /` | Ayuda | Muestra la lista de atajos y comandos. |
| `Esc` | Cancelar | Detiene el audio (TTS) o cierra modales abiertos. |

---

## 🛠️ Solución de Problemas

### "Error: Invalid API Key"
**Síntomas**: Mensaje de error al enviar mensaje

**Soluciones**:
1. Verifica que hayas pegado la clave correctamente en `js/geminiService.js`
2. Asegúrate de que no hay espacios extra antes o después de la clave
3. Confirma que la clave está activa en [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Guarda el archivo y recarga la página (`F5` o `Ctrl+R`)

### No aparecen respuestas
**Síntomas**: El mensaje se envía pero no hay respuesta

**Soluciones**:
1. Abre la consola del navegador (`F12` → Console)
2. Busca errores en rojo
3. Verifica tu conexión a internet
4. Confirma que la API key está configurada
5. Revisa los límites de cuota en Google AI Studio

### La página está en blanco
**Síntomas**: Pantalla blanca o vacía

**Soluciones**:
1. Verifica que todos los archivos estén en su lugar:
   - `index.html`
   - `css/style.css`
   - `js/geminiService.js`, `js/ui.js`, `js/main.js`
2. Abre la consola (`F12`) para ver errores
3. Intenta con otro navegador
4. Limpia la caché del navegador

### El micrófono no funciona (Futuro)
**Nota**: Speech-to-Text está planeado para futuras versiones

**Preparación**:
- Asegúrate de dar permiso al navegador para usar el micrófono
- Chrome y Edge tienen mejor soporte que Firefox
- Verifica que tu micrófono esté conectado y activo

### No escucho las respuestas (Futuro)
**Nota**: Text-to-Speech está planeado para futuras versiones

**Preparación**:
- Verifica el volumen de tu dispositivo
- Asegúrate de que las voces del navegador estén instaladas

### Performance lenta
**Síntomas**: La aplicación responde lentamente

**Soluciones**:
1. Cierra otras pestañas del navegador
2. Limpia el historial de conversaciones antiguas
3. Verifica el uso de memoria en el administrador de tareas
4. Actualiza tu navegador a la última versión

### Problemas de visualización en móvil
**Síntomas**: La interfaz no se ve bien en móvil

**Soluciones**:
1. Asegúrate de usar un navegador moderno
2. Rota el dispositivo (vertical/horizontal)
3. Haz zoom out si es necesario
4. Actualiza el navegador

---

## 🔒 Privacidad y Seguridad

**Whispers of the Wave** funciona 100% en tu navegador.

### ✅ Lo que SÍ hacemos
- Guardamos tus conversaciones en `localStorage` de tu dispositivo
- Enviamos tus mensajes a Google Gemini API para generar respuestas
- Validamos y sanitizamos todas las entradas para tu seguridad

### ❌ Lo que NO hacemos
- No enviamos tus datos a nuestros servidores (no tenemos servidores)
- No usamos cookies de terceros
- No rastreamos tu actividad
- No compartimos tu información con nadie
- No almacenamos tu API key en ningún servidor

### 🔐 Recomendaciones de Seguridad
- **No compartas tu API key** con nadie
- **Usa HTTPS** cuando despliegues en producción
- **Limpia el historial** periódicamente si usas un dispositivo compartido
- **Revisa los límites** de tu API key en Google AI Studio

---

## ❓ FAQ (Preguntas Frecuentes)

### ¿Es gratis?
Sí, la aplicación es completamente gratuita y open source. Solo necesitas una API key de Google Gemini, que también tiene un tier gratuito generoso.

### ¿Necesito instalar algo?
No, solo necesitas un navegador web moderno. No hay instalación ni build process.

### ¿Funciona offline?
No, necesitas conexión a internet para comunicarte con la API de Google Gemini. Sin embargo, la interfaz se carga localmente.

### ¿Puedo usar mi propia API key?
Sí, de hecho es requerido. Cada usuario debe configurar su propia API key de Google Gemini.

### ¿Cuánto cuesta la API de Google Gemini?
Google Gemini tiene un tier gratuito generoso. Consulta los [precios actuales](https://ai.google.dev/pricing) en su sitio oficial.

### ¿Mis conversaciones son privadas?
Sí, tus conversaciones se guardan solo en tu navegador (localStorage). Sin embargo, los mensajes se envían a Google Gemini para generar respuestas, así que revisa la [política de privacidad de Google](https://policies.google.com/privacy).

### ¿Puedo exportar mis conversaciones?
Actualmente no, pero está planeado para futuras versiones. Por ahora, puedes copiar y pegar manualmente.

### ¿Funciona en móvil?
Sí, la aplicación es completamente responsive y funciona en móviles y tablets.

### ¿Puedo cambiar los colores/tema?
Sí, hay dos temas disponibles (oscuro y claro). Para personalización avanzada, consulta la [Guía de Configuración](docs/CONFIGURATION.md).

### ¿Cómo contribuyo al proyecto?
¡Genial! Lee la [Guía de Contribución](docs/CONTRIBUTING.md) para empezar.

### ¿Dónde reporto bugs?
Abre un issue en GitHub o consulta la [Guía de Contribución](docs/CONTRIBUTING.md) para más detalles.

### ¿Hay roadmap del proyecto?
Sí, consulta el [CHANGELOG.md](CHANGELOG.md) para ver las versiones futuras planeadas.

---

## 📚 Recursos Adicionales

### Documentación
- [Quick Start Guide](docs/QUICKSTART.md) - Inicio rápido en 5 minutos
- [Architecture](docs/ARCHITECTURE.md) - Arquitectura del sistema
- [Modules](docs/MODULES.md) - Documentación de módulos
- [API Reference](docs/API_REFERENCE.md) - Referencia de APIs
- [Development Guide](docs/DEVELOPMENT.md) - Guía de desarrollo
- [Deployment Guide](docs/DEPLOYMENT.md) - Cómo desplegar
- [Configuration Guide](docs/CONFIGURATION.md) - Configuración avanzada
- [Contributing Guide](docs/CONTRIBUTING.md) - Cómo contribuir

### Soporte
- **GitHub Issues**: Para reportar bugs o sugerir features
- **Documentación**: Consulta la carpeta `docs/` para guías detalladas
- **Código**: Revisa el código fuente, está bien documentado

---

## 🎯 Próximas Características

### v1.1 (Próximo)
- [ ] Speech-to-Text (reconocimiento de voz)
- [ ] Text-to-Speech (lectura en voz alta)
- [ ] Exportación de conversaciones
- [ ] Búsqueda en historial
- [ ] Más temas visuales

### v1.2 (Futuro)
- [ ] Modo Kiro (respuestas analíticas)
- [ ] Sistema de logros
- [ ] Estadísticas personales
- [ ] Compartir conversaciones
- [ ] PWA (Progressive Web App)

---

## 📞 Contacto

- **GitHub**: [whispers-of-the-wave](https://github.com/usuario/whispers-of-the-wave)
- **Issues**: [Reportar bug o sugerir feature](https://github.com/usuario/whispers-of-the-wave/issues)
- **Documentación**: Carpeta `docs/` en el repositorio

---

**Última actualización**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Producción

*Disfruta de tu viaje por las olas.* 🌊
