# 🌊 Guía Completa de Funcionalidades

## Índice
1. [Atajos de Teclado](#atajos-de-teclado)
2. [Modo Oscuro/Claro](#modo-oscuroclaro)
3. [Búsqueda en Historial](#búsqueda-en-historial)
4. [Reacciones Rápidas](#reacciones-rápidas)
5. [Speech-to-Text](#speech-to-text)
6. [Text-to-Speech](#text-to-speech)
7. [Personalización](#personalización)

---

## ⌨️ Atajos de Teclado

### Atajos Disponibles

| Windows/Linux | Mac | Acción |
|--------------|-----|--------|
| `Ctrl + K` | `⌘ + K` | Limpiar conversación |
| `Ctrl + H` | `⌘ + H` | Buscar en historial |
| `Ctrl + /` | `⌘ + /` | Mostrar ayuda de atajos |
| `Esc` | `Esc` | Detener audio (TTS) |

### Características
- No interfiere con la escritura en el campo de texto
- Modal de ayuda visual con todos los atajos
- Fácil de extender con nuevos atajos

### Uso
Presiona `Ctrl+/` en cualquier momento para ver la lista completa de atajos disponibles.

### Personalización
```javascript
// Agregar nuevo atajo
KeyboardShortcuts.registerShortcut('n', { ctrl: true }, () => {
    console.log('Nuevo atajo ejecutado');
}, 'Descripción del atajo');
```

---

## 🎨 Modo Oscuro/Claro

### Temas Disponibles

**🌊 Modo Océano (Oscuro)**
- Gradiente azul profundo (#0a1128 → #1e3a5f)
- Ideal para uso nocturno
- Tema por defecto

**☀️ Modo Playa (Claro)**
- Gradiente celeste brillante (#87ceeb → #e0f6ff)
- Ideal para uso diurno
- Fácil de leer con luz natural

### Características
- Botón toggle en la barra superior derecha
- Transiciones suaves entre temas
- Preferencia guardada automáticamente
- Afecta todos los elementos de la UI

### Uso
Click en el botón ☀️/🌙 en la esquina superior derecha para alternar entre temas.

### Personalización
```css
/* En css/style.css */
body[data-theme="dark"] {
    --bg-gradient-start: #tu-color-inicio;
    --bg-gradient-end: #tu-color-fin;
    --text-color: #tu-color-texto;
}
```

---

## 🔍 Búsqueda en Historial

### Funcionalidades

- Guarda automáticamente las últimas 100 conversaciones
- Búsqueda en tiempo real mientras escribes
- Resalta términos de búsqueda en los resultados
- Muestra fecha y hora de cada mensaje
- Click en resultado para cargar el mensaje

### Características
- Busca en mensajes de usuario y respuestas de IA
- Interfaz de pantalla completa con overlay
- Persistencia automática en localStorage
- Límite configurable de mensajes guardados

### Uso
1. Presiona `Ctrl+H` o `⌘+H`
2. Escribe en el campo de búsqueda
3. Los resultados aparecen en tiempo real
4. Click en un resultado para verlo
5. Presiona `Esc` o click fuera para cerrar

### Almacenamiento
```javascript
// Estructura en localStorage
{
  "timestamp": "2025-11-16T10:30:00.000Z",
  "userMessage": "Tu mensaje",
  "aiResponse": "Respuesta de la IA"
}
```

### Personalización
```javascript
// Cambiar límite de mensajes guardados
// En js/features/historySearch.js
const MAX_HISTORY = 200; // Default: 100
```

---

## 👍 Reacciones Rápidas

### Funcionalidades

- Botón "Me gusta" (👍)
- Botón "No me gusta" (👎)
- Estadísticas de feedback
- Persistencia de reacciones

### Características
- Aparece automáticamente en cada respuesta de IA
- Click para dar feedback
- Click nuevamente para quitar la reacción
- Animaciones visuales al interactuar
- Contador de reacciones positivas/negativas

### Uso
1. Envía un mensaje y recibe una respuesta
2. Verás los botones 👍👎 al final de la respuesta
3. Click en el botón que refleje tu opinión
4. El botón se resalta para confirmar tu elección

### Estadísticas
```javascript
// Ver estadísticas en consola
QuickReactions.getStatistics();
// Retorna: { positive: 10, negative: 2, total: 12, positiveRate: 0.83 }
```

### Personalización
```javascript
// Agregar nueva reacción
QuickReactions.addReactionType('love', '❤️', 'Me encanta');
```

---

## 🎤 Speech-to-Text

### Funcionalidades

- Reconocimiento de voz en tiempo real
- Indicador visual cuando está escuchando
- Transcripción automática al campo de texto
- Soporte para múltiples idiomas

### Compatibilidad

| Navegador | Soporte | Notas |
|-----------|---------|-------|
| Chrome/Edge | ✅ Completo | Recomendado |
| Safari | ✅ Completo | iOS 14.5+ |
| Firefox | ⚠️ Limitado | Experimental |

### Características
- Botón de micrófono junto al campo de entrada
- Indicador rojo cuando está grabando
- Sin instalación adicional requerida
- Funciona en dispositivos móviles
- Detección automática de fin de frase

### Uso
1. Click en el botón 🎤
2. Permite acceso al micrófono si es la primera vez
3. Habla claramente
4. El texto aparece automáticamente
5. Click nuevamente para detener

### Requisitos
- Conexión a internet (API del navegador)
- Permisos de micrófono
- HTTPS (requerido por seguridad del navegador)

### Personalización
```javascript
// Cambiar idioma
// En js/features/speechToText.js
recognition.lang = 'en-US'; // Inglés
recognition.lang = 'es-ES'; // Español (default)
recognition.lang = 'fr-FR'; // Francés
recognition.lang = 'de-DE'; // Alemán
```

---

## 🔊 Text-to-Speech

### Funcionalidades

- 4 voces naturales con Google Gemini
- Control de reproducción (play/pause/stop)
- Indicador visual de reproducción
- Lectura automática de respuestas (opcional)

### Voces Disponibles

1. **Puck** - Voz masculina, tono medio
2. **Charon** - Voz masculina, tono grave
3. **Kore** - Voz femenina, tono medio
4. **Fenrir** - Voz masculina, tono profundo

### Características
- Botón de audio en cada respuesta
- Control con atajo de teclado (Esc para detener)
- Calidad de audio premium
- Sin límites de uso

### Uso
1. Recibe una respuesta de la IA
2. Click en el botón 🔊 para escuchar
3. Click nuevamente para pausar
4. Presiona `Esc` para detener completamente

### Personalización
```javascript
// Cambiar voz predeterminada
// En js/services/audioService.js
const DEFAULT_VOICE = 'Kore'; // Opciones: Puck, Charon, Kore, Fenrir
```

---

## 🎨 Personalización

### Cambiar Colores

```css
/* En css/style.css */
:root {
    --primary-color: #tu-color;
    --secondary-color: #tu-color;
    --accent-color: #tu-color;
}
```

### Agregar Nuevo Tema

```javascript
// En js/features/themeToggle.js
const themes = {
    ocean: { /* ... */ },
    beach: { /* ... */ },
    sunset: { // Nuevo tema
        bgGradientStart: '#ff6b6b',
        bgGradientEnd: '#ffd93d',
        textColor: '#2d3436'
    }
};
```

### Modificar Límites

```javascript
// Historial
const MAX_HISTORY = 200; // Default: 100

// Reacciones
const MAX_REACTIONS = 500; // Default: ilimitado

// Mensajes en pantalla
const MAX_VISIBLE_MESSAGES = 50; // Default: ilimitado
```

### Extender Funcionalidades

```javascript
// Agregar evento personalizado
document.addEventListener('whispers:messageSent', (e) => {
    console.log('Mensaje enviado:', e.detail);
    // Tu lógica aquí
});

// Agregar comando personalizado
KeyboardShortcuts.registerShortcut('m', { ctrl: true, shift: true }, () => {
    // Tu comando aquí
}, 'Mi comando personalizado');
```

---

## 📱 Responsive Design

Todas las funcionalidades están optimizadas para:

- 💻 **Desktop** (1920px+) - Experiencia completa
- 💻 **Laptop** (1366px-1920px) - Experiencia completa
- 📱 **Tablet** (768px-1366px) - Adaptado
- 📱 **Mobile** (320px-768px) - Optimizado para táctil

### Breakpoints

```css
/* Desktop */
@media (min-width: 1366px) { /* ... */ }

/* Tablet */
@media (max-width: 1366px) { /* ... */ }

/* Mobile */
@media (max-width: 768px) { /* ... */ }

/* Small Mobile */
@media (max-width: 480px) { /* ... */ }
```

---

## 🔒 Privacidad y Almacenamiento

### Datos Almacenados Localmente

| Dato | Tamaño Aprox. | Ubicación |
|------|---------------|-----------|
| Tema actual | ~10 bytes | localStorage |
| Historial (100 msgs) | ~100 KB | localStorage |
| Reacciones | ~10 KB | localStorage |
| Preferencias | ~1 KB | localStorage |

**Total:** ~111 KB (muy ligero)

### Limpiar Datos

```javascript
// En consola del navegador (F12)

// Limpiar todo
localStorage.clear();

// Limpiar solo historial
localStorage.removeItem('whispers-history');

// Limpiar solo reacciones
localStorage.removeItem('whispers-feedback');

// Limpiar solo tema
localStorage.removeItem('whispers-theme');
```

---

## 🐛 Solución de Problemas

### Speech-to-Text no funciona

**Problema:** El micrófono no se activa
**Solución:**
1. Verifica permisos de micrófono en el navegador
2. Asegúrate de usar HTTPS (requerido)
3. Prueba en Chrome/Edge para mejor compatibilidad
4. Revisa la consola (F12) para errores específicos

### Atajos de teclado no responden

**Problema:** Los atajos no funcionan
**Solución:**
1. Asegúrate de no estar escribiendo en el campo de texto
2. Presiona `Ctrl+/` para ver si el modal de ayuda aparece
3. Recarga la página (Ctrl+R)
4. Revisa la consola para errores de JavaScript

### Historial no se guarda

**Problema:** Las conversaciones no aparecen en el historial
**Solución:**
1. Verifica que localStorage esté habilitado
2. Revisa límites de almacenamiento del navegador
3. Limpia datos antiguos: `localStorage.clear()`
4. Verifica que no estés en modo incógnito

### Tema no cambia

**Problema:** El botón de tema no funciona
**Solución:**
1. Verifica que el botón esté visible
2. Revisa la consola para errores
3. Limpia localStorage: `localStorage.removeItem('whispers-theme')`
4. Recarga la página

---

## 📊 Estadísticas y Analytics

### Ver Estadísticas de Uso

```javascript
// En consola del navegador

// Reacciones
QuickReactions.getStatistics();
// { positive: 15, negative: 3, total: 18, positiveRate: 0.83 }

// Historial
const history = JSON.parse(localStorage.getItem('whispers-history') || '[]');
console.log(`Total mensajes: ${history.length}`);

// Tema actual
console.log(`Tema: ${localStorage.getItem('whispers-theme') || 'dark'}`);
```

---

## 🎯 Mejores Prácticas

### Para Usuarios

1. **Usa atajos de teclado** para mayor eficiencia
2. **Da feedback** con 👍👎 para mejorar respuestas
3. **Busca en historial** antes de repetir preguntas
4. **Cambia el tema** según la hora del día
5. **Usa voz** cuando sea más cómodo que escribir

### Para Desarrolladores

1. **Mantén módulos separados** para cada funcionalidad
2. **Usa eventos personalizados** para comunicación entre módulos
3. **Documenta cambios** en CHANGELOG.md
4. **Prueba en múltiples navegadores** antes de desplegar
5. **Mantén el código vanilla** sin dependencias externas

---

## 🚀 Próximas Mejoras

### En Desarrollo
- [ ] Exportar historial a JSON/CSV
- [ ] Etiquetas para categorizar conversaciones
- [ ] Dashboard de estadísticas visuales

### Planeadas
- [ ] Más idiomas para STT/TTS
- [ ] Temas personalizables por usuario
- [ ] Sincronización opcional en la nube
- [ ] Modo offline con service workers

### Sugerencias
¿Tienes ideas? Usa los botones 👍👎 para dar feedback o abre un issue.

---

## 📚 Recursos Adicionales

- **[README.md](README.md)** - Inicio rápido
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios
- **[docs/](docs/)** - Documentación técnica
- **[tests/demos/](tests/demos/)** - Demos interactivos

---

**Hecho con 🌊 para Whispers of the Wave**

*Cada funcionalidad diseñada para fluir como las olas del mar*
