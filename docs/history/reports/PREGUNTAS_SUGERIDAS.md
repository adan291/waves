# 💭 Preguntas Sugeridas - Olas de Inspiración

## ✨ Nueva Funcionalidad Implementada

Se han agregado **preguntas sugeridas** en formato de "olas" para ayudar al usuario a saber qué decir en cada momento.

## 🎯 Características

### 1. **Diseño Visual "Olas"**
- Botones con forma de olas (border-radius redondeado)
- Gradiente azul oceánico con efecto de transparencia
- Animación hover con elevación y brillo
- Backdrop blur para efecto de profundidad

### 2. **Categorías de Preguntas**

#### 🌊 Emocionales (Whispers of the Wave)
- "Me siento perdido en la vida"
- "Estoy pasando por un momento difícil"
- "No encuentro sentido a lo que hago"
- "Me siento solo y confundido"
- "Necesito expresar lo que siento"

#### 🧭 Decisiones (Kiro Adaptive)
- "Tengo que elegir entre dos opciones"
- "No sé qué estudiar"
- "Debo decidir entre diseño o programación"
- "Necesito ayuda para tomar una decisión"
- "Estoy en una encrucijada profesional"

#### 📍 Orientación (Kiro Adaptive)
- "¿Cómo empiezo a cambiar mi situación?"
- "Necesito un plan de acción"
- "¿Qué pasos debo seguir?"
- "Quiero orientación sobre mi carrera"
- "Ayúdame a organizar mis ideas"

### 3. **Comportamiento Inteligente**

#### Al Inicio
- Muestra 6 preguntas aleatorias mezcladas de todas las categorías
- Proporciona variedad para explorar diferentes tipos de conversación

#### Durante la Conversación
- **Después de cada respuesta**, muestra nuevas preguntas contextuales
- Si el spec actual es `whispers-of-the-wave` → muestra más preguntas emocionales
- Si el spec actual es `kiro-adaptive-assistance` → muestra más preguntas de decisión/orientación
- Las preguntas se actualizan dinámicamente según el contexto

#### Interacción
- **Click en una ola** → envía automáticamente el mensaje
- El input se limpia después de enviar
- Las preguntas se ocultan después del primer uso (opcional)

## 🎨 Estilos CSS

```css
.question-wave {
    display: inline-block;
    margin: 0.4rem 0.3rem;
    padding: 0.6rem 1rem;
    background: linear-gradient(135deg, rgba(100, 200, 255, 0.15), rgba(150, 220, 255, 0.1));
    border: 1px solid rgba(150, 220, 255, 0.3);
    border-radius: 2rem;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.question-wave:hover {
    background: linear-gradient(135deg, rgba(100, 200, 255, 0.25), rgba(150, 220, 255, 0.2));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 200, 255, 0.2);
}
```

## 🔧 Implementación Técnica

### Funciones Principales

1. **`setupSuggestedQuestions()`**
   - Inicializa las preguntas al cargar la página
   - Mezcla y selecciona 6 preguntas aleatorias

2. **`handleSuggestedQuestion(question)`**
   - Maneja el click en una pregunta
   - Envía automáticamente el mensaje
   - Oculta las preguntas después del primer uso

3. **`showContextualQuestions(currentSpec)`**
   - Muestra preguntas contextuales después de cada respuesta
   - Adapta las preguntas según el spec actual
   - Mezcla y selecciona 5 preguntas relevantes

4. **`shuffleArray(array)`**
   - Utilidad para mezclar arrays aleatoriamente
   - Asegura variedad en las preguntas mostradas

### Configuración

Las preguntas están definidas en `DemoConfig.suggestedQuestions`:

```javascript
suggestedQuestions: Object.freeze({
    emotional: [...],
    decision: [...],
    orientation: [...],
    casual: [...]
})
```

## 📱 Responsive

- Las olas se adaptan al ancho de la pantalla
- Se envuelven automáticamente en múltiples líneas
- Mantienen el espaciado y la legibilidad en móviles

## 🎯 Beneficios

1. **Reduce la fricción inicial** - El usuario no tiene que pensar qué escribir
2. **Guía la exploración** - Muestra ejemplos de lo que puede preguntar
3. **Contexto adaptativo** - Las sugerencias cambian según la conversación
4. **Estética coherente** - Mantiene el tema oceánico del proyecto
5. **Interacción fluida** - Un click y el mensaje se envía automáticamente

## 🚀 Uso

1. Abre `index_spec_demo.html`
2. Verás las "Olas de inspiración" debajo del mensaje de bienvenida
3. Haz click en cualquier ola para enviar ese mensaje
4. Después de cada respuesta, aparecerán nuevas olas contextuales

## 🔮 Mejoras Futuras Posibles

- [ ] Agregar animación de entrada para las olas
- [ ] Permitir al usuario "refrescar" las sugerencias
- [ ] Agregar más categorías de preguntas
- [ ] Personalizar sugerencias basadas en historial
- [ ] Agregar tooltips con más contexto
- [ ] Animación de "ola" al hacer hover (efecto de agua)
