# 🤝 Contributing Guide - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025

---

## 👋 Bienvenido

¡Gracias por tu interés en contribuir a Whispers of the Wave! Este documento te guiará a través del proceso de contribución.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)
- [Pull Requests](#pull-requests)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Documentación](#documentación)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de la participación en este proyecto una experiencia libre de acoso para todos, independientemente de:
- Edad
- Tamaño corporal
- Discapacidad
- Etnia
- Identidad y expresión de género
- Nivel de experiencia
- Nacionalidad
- Apariencia personal
- Raza
- Religión
- Identidad y orientación sexual

### Comportamiento Esperado

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- Uso de lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes o despectivos
- Acoso público o privado
- Publicar información privada de otros sin permiso
- Otra conducta que podría considerarse inapropiada

---

## 🚀 Cómo Contribuir

### 1. Fork el Repositorio

```bash
# Haz fork en GitHub, luego clona tu fork
git clone https://github.com/tu-usuario/whispers-of-the-wave.git
cd whispers-of-the-wave
```

### 2. Crea una Rama

```bash
# Crea una rama para tu feature o fix
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 3. Haz tus Cambios

- Sigue los [Estándares de Código](#estándares-de-código)
- Escribe tests si es aplicable
- Actualiza la documentación si es necesario

### 4. Commit tus Cambios

```bash
# Usa commits descriptivos
git add .
git commit -m "feat: agregar nueva característica X"
# o
git commit -m "fix: corregir bug en Y"
```

### 5. Push y Crea Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Luego crea un Pull Request en GitHub.

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Verifica que sea un bug nuevo**
   - Busca en [Issues existentes](https://github.com/usuario/whispers-of-the-wave/issues)
   - Revisa [Issues cerrados](https://github.com/usuario/whispers-of-the-wave/issues?q=is%3Aissue+is%3Aclosed)

2. **Reproduce el bug**
   - Intenta reproducir el bug consistentemente
   - Identifica los pasos exactos para reproducirlo

3. **Recopila información**
   - Navegador y versión
   - Sistema operativo
   - Mensajes de error (consola del navegador)
   - Screenshots si es relevante

### Template de Bug Report

```markdown
**Descripción del Bug**
Una descripción clara y concisa del bug.

**Pasos para Reproducir**
1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que sucediera.

**Comportamiento Actual**
Descripción de lo que realmente sucedió.

**Screenshots**
Si es aplicable, agrega screenshots.

**Entorno**
- Navegador: [ej. Chrome 120]
- OS: [ej. Windows 11]
- Versión: [ej. 1.0.0]

**Información Adicional**
Cualquier otro contexto sobre el problema.

**Logs de Consola**
```javascript
// Pega aquí los logs de la consola
```
```

---

## 💡 Sugerir Features

### Antes de Sugerir

1. **Verifica que no exista**
   - Busca en Issues existentes
   - Revisa el roadmap del proyecto

2. **Considera el alcance**
   - ¿Beneficia a la mayoría de usuarios?
   - ¿Se alinea con la visión del proyecto?
   - ¿Es técnicamente factible?

### Template de Feature Request

```markdown
**¿Tu feature request está relacionado con un problema?**
Una descripción clara del problema. Ej: "Siempre me frustra cuando [...]"

**Describe la solución que te gustaría**
Una descripción clara de lo que quieres que suceda.

**Describe alternativas que has considerado**
Descripción de soluciones o features alternativas.

**Contexto Adicional**
Cualquier otro contexto o screenshots sobre el feature request.

**Beneficios**
- ¿Quién se beneficiaría?
- ¿Cómo mejoraría la experiencia?
- ¿Qué problema resuelve?

**Implementación Propuesta** (opcional)
Si tienes ideas sobre cómo implementarlo.
```

---

## 🔀 Pull Requests

### Proceso de PR

1. **Antes de crear el PR**
   - [ ] Código sigue los estándares
   - [ ] Tests pasan (si aplica)
   - [ ] Documentación actualizada
   - [ ] Commits son descriptivos
   - [ ] Branch está actualizado con main

2. **Crear el PR**
   - Usa un título descriptivo
   - Completa el template de PR
   - Referencia issues relacionados
   - Agrega labels apropiados

3. **Durante la revisión**
   - Responde a comentarios
   - Haz cambios solicitados
   - Mantén la conversación profesional

4. **Después del merge**
   - Elimina tu branch
   - Actualiza tu fork

### Template de Pull Request

```markdown
**Descripción**
Descripción clara de los cambios realizados.

**Tipo de Cambio**
- [ ] Bug fix (cambio que corrige un issue)
- [ ] New feature (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione como antes)
- [ ] Documentation update

**¿Cómo se ha testeado?**
Describe los tests que ejecutaste.

**Checklist**
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi feature funciona
- [ ] Tests unitarios nuevos y existentes pasan localmente

**Screenshots** (si aplica)
Agrega screenshots para mostrar los cambios.

**Issues Relacionados**
Fixes #123
Closes #456
```

---

## 📝 Estándares de Código

### JavaScript

#### Estilo General

```javascript
// ✅ Bueno: Nombres descriptivos
function calculateOceanDepth(pressure, temperature) {
    const depthInMeters = pressure * 10.2;
    return depthInMeters;
}

// ❌ Malo: Nombres no descriptivos
function calc(p, t) {
    const d = p * 10.2;
    return d;
}
```

#### Convenciones de Nombres

```javascript
// Variables y funciones: camelCase
const userName = 'John';
function getUserData() {}

// Clases: PascalCase
class OceanWave {}

// Constantes: UPPER_CASE
const MAX_DEPTH = 1000;
const API_ENDPOINT = 'https://api.example.com';

// Privados: prefijo _
class MyClass {
    _privateMethod() {}
    _privateProperty = 'value';
}
```

#### Comentarios

```javascript
/**
 * Calcula la profundidad del océano basado en presión
 * @param {number} pressure - Presión en bars
 * @param {number} temperature - Temperatura en Celsius
 * @returns {number} Profundidad en metros
 */
function calculateOceanDepth(pressure, temperature) {
    // Fórmula: 1 bar ≈ 10.2 metros de profundidad
    const depthInMeters = pressure * 10.2;
    
    // Ajustar por temperatura (agua más caliente es menos densa)
    const adjustment = temperature * 0.01;
    
    return depthInMeters - adjustment;
}
```

#### Manejo de Errores

```javascript
// ✅ Bueno: Manejo específico de errores
async function fetchData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;  // Re-throw para que el caller pueda manejar
    }
}

// ❌ Malo: Silenciar errores
async function fetchData() {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        // No hacer nada
    }
}
```

### CSS

#### Organización

```css
/* 1. Variables */
:root {
    --primary-color: #1a4d6d;
}

/* 2. Reset/Base */
* {
    margin: 0;
    padding: 0;
}

/* 3. Layout */
.container {
    max-width: 1200px;
}

/* 4. Componentes */
.button {
    padding: 10px 20px;
}

/* 5. Utilidades */
.text-center {
    text-align: center;
}

/* 6. Media Queries */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}
```

#### Nomenclatura BEM (Opcional)

```css
/* Block */
.message {}

/* Element */
.message__content {}
.message__timestamp {}

/* Modifier */
.message--whisper {}
.message--reflection {}
```

### HTML

#### Estructura Semántica

```html
<!-- ✅ Bueno: Semántico y accesible -->
<main>
    <section aria-label="Conversation">
        <article class="message" role="article">
            <p>Contenido del mensaje</p>
        </article>
    </section>
</main>

<!-- ❌ Malo: No semántico -->
<div>
    <div>
        <div class="message">
            <p>Contenido del mensaje</p>
        </div>
    </div>
</div>
```

#### Accesibilidad

```html
<!-- Siempre incluir atributos de accesibilidad -->
<button 
    aria-label="Enviar mensaje"
    aria-describedby="send-help"
    type="submit">
    Enviar
</button>
<span id="send-help" class="sr-only">
    Presiona Enter para enviar tu mensaje
</span>

<!-- Imágenes con alt text -->
<img src="wave.png" alt="Ola del océano" />

<!-- Formularios con labels -->
<label for="message-input">Tu mensaje:</label>
<input id="message-input" type="text" />
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Abrir en navegador
open tests/run-all-tests.html

# O usar servidor local
python -m http.server 8000
# Luego: http://localhost:8000/tests/run-all-tests.html
```

### Escribir Tests

```javascript
// tests/unit/myModule.test.html
describe('MyModule', () => {
    describe('myFunction', () => {
        it('should return expected value', () => {
            const result = MyModule.myFunction(input);
            assert.strictEqual(result, expected);
        });
        
        it('should handle edge cases', () => {
            const result = MyModule.myFunction(null);
            assert.strictEqual(result, null);
        });
        
        it('should throw error for invalid input', () => {
            assert.throws(() => {
                MyModule.myFunction(invalidInput);
            }, Error);
        });
    });
});
```

### Coverage

Objetivo: Mantener cobertura > 50%

```bash
# Ver reporte de cobertura
open tests/coverage-report.html
```

---

## 📚 Documentación

### Documentar Código

```javascript
/**
 * Clase para manejar conversaciones con IA
 * @class ConversationManager
 */
class ConversationManager {
    /**
     * Crea una nueva instancia de ConversationManager
     * @param {Object} config - Configuración
     * @param {string} config.apiKey - API key de Gemini
     * @param {number} config.maxHistory - Máximo de mensajes en historial
     */
    constructor(config) {
        this.config = config;
    }
    
    /**
     * Envía un mensaje y obtiene respuesta
     * @param {string} message - Mensaje del usuario
     * @returns {Promise<Object>} Respuesta de la IA
     * @throws {Error} Si el mensaje es inválido
     */
    async sendMessage(message) {
        // Implementación
    }
}
```

### Actualizar Documentación

Cuando hagas cambios, actualiza:

- [ ] README.md (si cambia funcionalidad principal)
- [ ] USER_GUIDE.md (si afecta al usuario)
- [ ] API_REFERENCE.md (si cambias APIs)
- [ ] CHANGELOG.md (siempre)
- [ ] Comentarios en código

---

## 🏷️ Convenciones de Commits

### Formato

```
<tipo>(<alcance>): <descripción corta>

<descripción larga opcional>

<footer opcional>
```

### Tipos

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
# Feature
git commit -m "feat(ui): agregar botón de reset de conversación"

# Bug fix
git commit -m "fix(api): corregir timeout en llamadas a Gemini"

# Documentación
git commit -m "docs(readme): actualizar instrucciones de instalación"

# Refactor
git commit -m "refactor(core): simplificar lógica de validación"

# Test
git commit -m "test(ui): agregar tests para modal component"
```

---

## 🎯 Áreas de Contribución

### Código

- Nuevas características
- Corrección de bugs
- Optimización de performance
- Refactorización

### Documentación

- Mejorar guías existentes
- Crear tutoriales
- Traducir documentación
- Corregir typos

### Testing

- Escribir nuevos tests
- Mejorar cobertura
- Tests de integración
- Tests de performance

### Diseño

- Mejorar UI/UX
- Crear nuevos temas
- Optimizar animaciones
- Mejorar accesibilidad

---

## 📞 Contacto

### Preguntas

- Abre un [Discussion](https://github.com/usuario/whispers-of-the-wave/discussions)
- Pregunta en Issues con label `question`

### Reportar Problemas

- Abre un [Issue](https://github.com/usuario/whispers-of-the-wave/issues)
- Usa los templates proporcionados

---

## 🙏 Reconocimientos

Todos los contribuidores serán reconocidos en:
- README.md
- CONTRIBUTORS.md
- Release notes

---

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto (MIT).

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

🤝 **¡Gracias por contribuir a Whispers of the Wave!**
