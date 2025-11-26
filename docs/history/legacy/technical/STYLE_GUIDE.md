# 📝 Style Guide - Whispers of the Wave

Guía de estilo de código para mantener consistencia en el proyecto.

---

## JavaScript

### Nomenclatura

#### Variables y Funciones
- Usar `camelCase` para variables y funciones
- Nombres descriptivos y en inglés
- Evitar abreviaturas excepto en casos comunes (msg, btn, etc.)

```javascript
// ✅ Correcto
const userMessage = 'Hello';
function validateInput(text) { }
const isValid = true;

// ❌ Incorrecto
const usrMsg = 'Hello';
function validate_input(text) { }
const valid = true;
```

#### Constantes
- Usar `UPPER_SNAKE_CASE` para constantes globales
- Usar `const` siempre que sea posible

```javascript
// ✅ Correcto
const MAX_HISTORY = 100;
const API_KEY_PLACEHOLDER = 'YOUR_API_KEY_HERE';

// ❌ Incorrecto
const maxHistory = 100;
const apiKeyPlaceholder = 'YOUR_API_KEY_HERE';
```

#### Clases y Módulos
- Usar `PascalCase` para clases y módulos
- Usar IIFE (Immediately Invoked Function Expression) para módulos

```javascript
// ✅ Correcto
const MyModule = (() => {
    return { /* API */ };
})();

class UserMessage { }

// ❌ Incorrecto
const myModule = (() => {
    return { /* API */ };
})();

class userMessage { }
```

### Estructura de Código

#### Módulos
```javascript
/**
 * Module Description
 * What it does and why
 * 
 * @module moduleName
 */

const ModuleName = (() => {
    'use strict';

    // Private variables
    const privateVar = 'value';

    // Private functions
    function privateFunction() {
        // Implementation
    }

    // Public API
    return {
        publicMethod: publicMethod,
        publicProperty: 'value'
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.ModuleName = ModuleName;
}
```

#### Funciones
```javascript
/**
 * Function description
 * @param {type} paramName - Parameter description
 * @returns {type} Return description
 */
function functionName(paramName) {
    // Implementation
    return result;
}
```

### Convenciones

#### Espaciado
- 4 espacios para indentación (no tabs)
- Línea en blanco entre funciones
- Máximo 80 caracteres por línea (preferible)

```javascript
// ✅ Correcto
function example() {
    const value = 10;
    return value * 2;
}

function another() {
    // Implementation
}

// ❌ Incorrecto
function example(){const value=10;return value*2;}
function another(){// Implementation}
```

#### Comentarios
- Usar `//` para comentarios de una línea
- Usar `/* */` para comentarios de múltiples líneas
- Usar JSDoc para funciones públicas
- Comentarios en inglés

```javascript
// ✅ Correcto
/**
 * Validates user input
 * @param {string} input - User input
 * @returns {boolean} True if valid
 */
function validate(input) {
    // Check if input is not empty
    return input.trim().length > 0;
}

// ❌ Incorrecto
function validate(input) {
    // valida la entrada del usuario
    return input.trim().length > 0;
}
```

#### Strings
- Usar comillas simples `'` para strings
- Usar template literals `` ` `` para strings con variables

```javascript
// ✅ Correcto
const message = 'Hello';
const greeting = `Hello, ${name}!`;

// ❌ Incorrecto
const message = "Hello";
const greeting = 'Hello, ' + name + '!';
```

#### Condicionales
- Usar `===` en lugar de `==`
- Usar ternario solo para asignaciones simples
- Usar early return para simplificar lógica

```javascript
// ✅ Correcto
if (value === 10) {
    // Implementation
}

const result = condition ? 'yes' : 'no';

function process(data) {
    if (!data) {
        return null;
    }
    // Implementation
}

// ❌ Incorrecto
if (value == 10) {
    // Implementation
}

const result = condition ? 'yes' : condition2 ? 'maybe' : 'no';

function process(data) {
    if (data) {
        // Implementation
    }
}
```

#### Errores
- Usar try-catch para operaciones que pueden fallar
- Loguear errores apropiadamente
- Proporcionar mensajes de error útiles

```javascript
// ✅ Correcto
try {
    const data = JSON.parse(jsonString);
    return data;
} catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
}

// ❌ Incorrecto
const data = JSON.parse(jsonString);
return data;
```

---

## CSS

### Nomenclatura

#### Clases
- Usar `kebab-case` para nombres de clases
- Nombres descriptivos y en inglés
- Usar BEM (Block Element Modifier) cuando sea apropiado

```css
/* ✅ Correcto */
.message-container { }
.message-container__text { }
.message-container--active { }

/* ❌ Incorrecto */
.messageContainer { }
.message_container { }
.active-message { }
```

#### Variables CSS
- Usar `--kebab-case` para variables CSS
- Agrupar variables relacionadas

```css
/* ✅ Correcto */
:root {
    --color-primary: #0066cc;
    --color-secondary: #00cc00;
    --spacing-small: 8px;
    --spacing-medium: 16px;
}

/* ❌ Incorrecto */
:root {
    --colorPrimary: #0066cc;
    --primary_color: #0066cc;
}
```

### Estructura

#### Organización
- Agrupar estilos relacionados
- Usar comentarios para separar secciones
- Mantener especificidad baja

```css
/* ✅ Correcto */
/* Base styles */
body {
    font-family: sans-serif;
}

/* Components */
.button {
    padding: 10px 20px;
}

.button:hover {
    background-color: #f0f0f0;
}

/* Responsive */
@media (max-width: 768px) {
    .button {
        padding: 8px 16px;
    }
}

/* ❌ Incorrecto */
body { font-family: sans-serif; }
.button { padding: 10px 20px; }
.button:hover { background-color: #f0f0f0; }
@media (max-width: 768px) { .button { padding: 8px 16px; } }
```

#### Propiedades
- Ordenar propiedades alfabéticamente o por tipo
- Usar shorthand cuando sea apropiado
- Incluir prefijos de navegador si es necesario

```css
/* ✅ Correcto */
.element {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #333;
    padding: 10px;
}

/* ❌ Incorrecto */
.element {
    padding: 10px;
    color: #333;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ccc;
}
```

---

## HTML

### Nomenclatura

#### IDs y Clases
- Usar `kebab-case` para IDs y clases
- IDs para elementos únicos
- Clases para estilos reutilizables

```html
<!-- ✅ Correcto -->
<div id="main-container" class="container">
    <button id="submit-btn" class="button button--primary">Submit</button>
</div>

<!-- ❌ Incorrecto -->
<div id="mainContainer" class="container">
    <button id="submitBtn" class="button primary">Submit</button>
</div>
```

### Estructura

#### Semántica
- Usar elementos semánticos apropiados
- Usar ARIA labels para accesibilidad
- Mantener estructura lógica

```html
<!-- ✅ Correcto -->
<header>
    <nav aria-label="Main navigation">
        <ul>
            <li><a href="/">Home</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h1>Title</h1>
        <p>Content</p>
    </article>
</main>

<!-- ❌ Incorrecto -->
<div id="header">
    <div id="nav">
        <div>
            <a href="/">Home</a>
        </div>
    </div>
</div>

<div id="main">
    <div>
        <div>Title</div>
        <div>Content</div>
    </div>
</div>
```

---

## Archivos

### Estructura
- Un módulo por archivo
- Nombres descriptivos
- Organizar en carpetas por tipo

```
js/
├── core/           # Core functionality
├── engine/         # Processing engine
├── features/       # Features
├── services/       # External services
├── ui/             # UI components
└── utils/          # Utilities
```

### Tamaño
- Mantener archivos menores a 500 líneas
- Dividir archivos grandes en módulos más pequeños
- Máximo 3 niveles de anidación

---

## Commits

### Mensajes
- Usar presente: "Add feature" no "Added feature"
- Ser descriptivo pero conciso
- Usar prefijos: feat:, fix:, docs:, style:, refactor:, test:, chore:

```
✅ Correcto:
feat: add input validation module
fix: prevent XSS in message display
docs: update API documentation
refactor: consolidate CSS files

❌ Incorrecto:
Added validation
Fixed bug
Updated docs
Refactored code
```

---

## Checklist de Revisión

- [ ] Nombres consistentes (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] Comentarios claros y en inglés
- [ ] Funciones documentadas con JSDoc
- [ ] Sin código muerto o comentado
- [ ] Manejo de errores apropiado
- [ ] Especificidad CSS baja
- [ ] HTML semántico
- [ ] Accesibilidad considerada
- [ ] Responsive design
- [ ] Tests incluidos

---

**Última actualización**: Noviembre 21, 2025  
**Versión**: 1.0

*Guía de estilo para mantener Whispers of the Wave consistente y mantenible*
