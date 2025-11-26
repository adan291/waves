# 🚀 Quick Start Guide - Whispers of the Wave

**Tiempo de setup**: 5 minutos  
**Nivel**: Principiante  
**Versión**: 1.0

---

## ⚡ Inicio Rápido en 3 Pasos

### Paso 1: Configurar API Key (2 minutos)

1. Obtén tu API key de Google Gemini:
   - Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Crea una nueva API key
   - Copia la key

2. Abre el archivo `js/geminiService.js`

3. Reemplaza `YOUR_API_KEY_HERE` con tu API key:
```javascript
const geminiConfig = {
    apiKey: 'TU_API_KEY_AQUI',  // ← Pega tu key aquí
    model: 'gemini-pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/'
};
```

---

### Paso 2: Abrir la Aplicación (1 minuto)

**Opción A: Directamente en el navegador**
```bash
# En Windows
start index.html

# En Mac
open index.html

# En Linux
xdg-open index.html
```

**Opción B: Con servidor local**
```bash
# Python 3
python -m http.server 8000

# Node.js (si tienes http-server instalado)
npx http-server

# Luego abre: http://localhost:8000
```

---

### Paso 3: ¡Empieza a Conversar! (2 minutos)

1. Escribe tu primer mensaje en el campo de texto
2. Presiona Enter o haz clic en "Enviar"
3. Observa la respuesta en dos partes:
   - **Whisper** (susurro en azul claro)
   - **Wave of Reflection** (ola de reflexión en serif)

---

## 🎯 Primeros Pasos

### Tu Primera Conversación

Prueba estos mensajes de ejemplo:

```
"Hola, ¿cómo estás?"
"Cuéntame sobre el océano"
"Necesito ayuda para relajarme"
"¿Qué puedes hacer?"
```

### Características Básicas

#### 1. Conversación Natural
- Escribe como hablarías normalmente
- La IA mantiene el contexto de la conversación
- Respuestas en formato dual (whisper + reflection)

#### 2. Tema Oceánico
- Fondo animado con gradiente oceánico
- Respuestas con metáforas del mar
- Ambiente relajante y contemplativo

#### 3. Historial
- Tus conversaciones se guardan automáticamente
- Scroll para ver mensajes anteriores
- Limpia el historial con el botón de reset

---

## 🔧 Solución Rápida de Problemas

### Problema: "API Key no válida"
**Solución**:
1. Verifica que copiaste la key completa
2. Asegúrate de que no hay espacios extra
3. Confirma que la key está activa en Google AI Studio

### Problema: "No aparecen respuestas"
**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica tu conexión a internet
4. Confirma que la API key está configurada

### Problema: "Página en blanco"
**Solución**:
1. Verifica que todos los archivos estén en su lugar:
   - `index.html`
   - `css/style.css`
   - `js/geminiService.js`
   - `js/ui.js`
   - `js/main.js`
2. Abre la consola (F12) para ver errores
3. Intenta con otro navegador

---

## 💡 Tips Rápidos

### Para Mejores Respuestas
- Sé específico en tus preguntas
- Proporciona contexto cuando sea necesario
- Usa un tono conversacional

### Para Mejor Experiencia
- Usa pantalla completa para inmersión total
- Ajusta el brillo de tu pantalla para comodidad
- Tómate tu tiempo para leer las reflexiones

### Atajos de Teclado
- `Enter`: Enviar mensaje
- `Shift + Enter`: Nueva línea en el mensaje
- `Esc`: Cerrar modales (si hay)

---

## 📱 Uso en Móvil

La aplicación es completamente responsive:

1. Abre en tu navegador móvil
2. Agrega a pantalla de inicio para acceso rápido
3. Usa en modo vertical u horizontal
4. Toca el campo de texto para escribir

---

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `css/style.css` y busca:
```css
/* Colores principales */
--ocean-blue: #1a4d6d;
--wave-cyan: #4fb3d4;
--foam-white: #e8f4f8;
```

### Cambiar Velocidad de Animación
En `css/style.css`:
```css
/* Animación del fondo */
animation: oceanFlow 20s ease-in-out infinite;
/* Cambia 20s a tu preferencia */
```

---

## 📚 Próximos Pasos

### Aprende Más
- Lee la [Guía de Usuario Completa](../USER_GUIDE.md)
- Explora las [Características Avanzadas](../FEATURES.md)
- Revisa la [Documentación Técnica](./ARCHITECTURE.md)

### Contribuye
- Lee la [Guía de Contribución](./CONTRIBUTING.md)
- Reporta bugs en GitHub Issues
- Sugiere nuevas características

---

## 🆘 ¿Necesitas Ayuda?

### Recursos
- **FAQ**: Ver [USER_GUIDE.md](../USER_GUIDE.md#faq)
- **Documentación**: Ver carpeta `docs/`
- **Ejemplos**: Ver carpeta `examples/`

### Soporte
- Abre un issue en GitHub
- Revisa issues existentes
- Lee la documentación completa

---

## ✅ Checklist de Inicio

Marca cuando completes cada paso:

- [ ] API key configurada en `geminiService.js`
- [ ] Aplicación abierta en el navegador
- [ ] Primer mensaje enviado
- [ ] Respuesta recibida correctamente
- [ ] Historial funcionando
- [ ] Sin errores en consola

---

## 🎉 ¡Listo!

Si completaste todos los pasos, ¡estás listo para usar Whispers of the Wave!

**Disfruta de conversaciones profundas y reflexivas con IA en un ambiente oceánico relajante.** 🌊

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Tiempo de setup**: 5 minutos

🚀 **¡Empieza a conversar en minutos!**
