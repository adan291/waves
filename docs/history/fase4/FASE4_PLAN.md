# 🧪 Fase 4: Testing - Plan de Acción

**Fecha de Inicio**: Próxima Sesión  
**Estado**: ⏳ Pendiente  
**Prerequisito**: ✅ Fase 3 Completada

---

## 🎯 Objetivos de la Fase 4

### 1. Organizar Tests Existentes (30 min)
- Auditar tests actuales
- Identificar gaps de cobertura
- Crear índice de tests
- Documentar cómo ejecutar cada test

### 2. Crear Tests Unitarios Nuevos (2 horas)
- Tests para módulos críticos sin cobertura
- Tests para funciones de utilidad
- Tests para validadores
- Tests para sanitizadores

### 3. Crear Tests de Integración (2 horas)
- Flujo completo de conversación
- Sistema de logros end-to-end
- Sistema de traducciones completo
- Exportación de historial

### 4. Validación Cross-Browser (1 hora)
- Chrome/Edge
- Firefox
- Safari (si disponible)
- Documentar incompatibilidades

### 5. Automatización (1 hora)
- Script para ejecutar todos los tests
- Reporte de cobertura
- CI/CD básico (opcional)

**Tiempo Total Estimado**: 6-7 horas

---

## 📊 Estado Actual de Tests

### Tests Existentes

#### Unit Tests (13 archivos)
```
✅ adaptiveAssistance.test.html/js
✅ responsePatterns.test.html/js
✅ stateClassifier.test.html/js
✅ css_selector_test.html
✅ expression_metrics_test.html
✅ modal_test.html
✅ security_test.html
✅ suggestions_fixed_test.html
✅ suggestions_test.html
✅ theme_wave_test.html
```

#### Integration Tests (8 archivos)
```
✅ achievements_test.html
✅ conversation_improvements_test.html
✅ full_app_test.html
✅ i18n_complete_test.html
✅ integration_test_runner.js
✅ integration.test.html/js
✅ performance_test.html
```

#### Demos (7 archivos)
```
✅ index_spec_demo.html
✅ ocean_colors_test.html
✅ ocean_dynamics_test.html
✅ PRODUCTION_MOCKUP.html
✅ theme_light_debug.html
✅ theme_wave_debug.html
✅ waves_preview.html
```

**Total**: 28 archivos de tests existentes

---

## 🔍 Análisis de Cobertura

### Módulos CON Tests ✅
- Adaptive Assistance
- Response Patterns
- State Classifier
- Achievements
- i18n (traducciones)
- Suggestions
- Modal
- Security
- CSS Selectors
- Expression Metrics
- Theme System
- Ocean Dynamics

### Módulos SIN Tests ❌
- **inputValidator.js** - CRÍTICO
- **htmlSanitizer.js** - CRÍTICO
- **eventBus.js** - IMPORTANTE
- **storageOptimizer.js** - IMPORTANTE
- **cache.js** - IMPORTANTE
- **performance.js** - IMPORTANTE
- **logger.js** - MEDIO
- **lazyLoader.js** - MEDIO
- **journeyCompletion.js** - MEDIO
- **audioService.js** - BAJO
- **narrative.js** - BAJO
- **conversationEnhancer.js** - BAJO

---

## 📋 Plan Detallado

### Sesión 1: Organización y Auditoría (1 hora)

#### 1.1 Crear Índice de Tests (15 min)
```
Archivo: tests/TEST_INDEX.md

Contenido:
- Lista de todos los tests
- Qué módulo prueba cada test
- Cómo ejecutar cada test
- Estado de cada test (pasa/falla)
```

#### 1.2 Ejecutar Tests Existentes (30 min)
```
1. Abrir cada test en navegador
2. Verificar que pasa
3. Documentar resultados
4. Identificar tests rotos
```

#### 1.3 Medir Cobertura Actual (15 min)
```
1. Contar módulos totales
2. Contar módulos con tests
3. Calcular porcentaje
4. Identificar gaps críticos
```

---

### Sesión 2: Tests Unitarios Críticos (2 horas)

#### 2.1 Tests para inputValidator.js (30 min)
```javascript
// tests/unit/inputValidator.test.js

describe('InputValidator', () => {
    test('valida texto vacío', () => {
        expect(InputValidator.isEmpty('')).toBe(true);
    });
    
    test('valida longitud máxima', () => {
        const longText = 'a'.repeat(5001);
        expect(InputValidator.isValidLength(longText)).toBe(false);
    });
    
    test('detecta caracteres peligrosos', () => {
        expect(InputValidator.hasDangerousChars('<script>')).toBe(true);
    });
    
    test('sanitiza input correctamente', () => {
        const dirty = '<script>alert("xss")</script>';
        const clean = InputValidator.sanitize(dirty);
        expect(clean).not.toContain('<script>');
    });
});
```

#### 2.2 Tests para htmlSanitizer.js (30 min)
```javascript
// tests/unit/htmlSanitizer.test.js

describe('HtmlSanitizer', () => {
    test('elimina tags script', () => {
        const dirty = '<p>Hello <script>alert("xss")</script></p>';
        const clean = HtmlSanitizer.sanitize(dirty);
        expect(clean).not.toContain('<script>');
    });
    
    test('preserva tags seguros', () => {
        const safe = '<p>Hello <strong>world</strong></p>';
        const clean = HtmlSanitizer.sanitize(safe);
        expect(clean).toContain('<strong>');
    });
    
    test('elimina atributos peligrosos', () => {
        const dirty = '<a href="javascript:alert()">Click</a>';
        const clean = HtmlSanitizer.sanitize(dirty);
        expect(clean).not.toContain('javascript:');
    });
});
```

#### 2.3 Tests para eventBus.js (30 min)
```javascript
// tests/unit/eventBus.test.js

describe('EventBus', () => {
    test('emite y recibe eventos', () => {
        let received = false;
        EventBus.on('test', () => { received = true; });
        EventBus.emit('test');
        expect(received).toBe(true);
    });
    
    test('pasa datos con eventos', () => {
        let data = null;
        EventBus.on('test', (d) => { data = d; });
        EventBus.emit('test', { value: 42 });
        expect(data.value).toBe(42);
    });
    
    test('desuscribe correctamente', () => {
        let count = 0;
        const handler = () => { count++; };
        EventBus.on('test', handler);
        EventBus.emit('test');
        EventBus.off('test', handler);
        EventBus.emit('test');
        expect(count).toBe(1);
    });
});
```

#### 2.4 Tests para storageOptimizer.js (30 min)
```javascript
// tests/unit/storageOptimizer.test.js

describe('StorageOptimizer', () => {
    test('comprime datos correctamente', () => {
        const data = { large: 'data'.repeat(100) };
        const compressed = StorageOptimizer.compress(data);
        expect(compressed.length).toBeLessThan(JSON.stringify(data).length);
    });
    
    test('descomprime datos correctamente', () => {
        const original = { test: 'data' };
        const compressed = StorageOptimizer.compress(original);
        const decompressed = StorageOptimizer.decompress(compressed);
        expect(decompressed).toEqual(original);
    });
    
    test('limpia datos antiguos', () => {
        StorageOptimizer.cleanup(7); // 7 días
        // Verificar que datos antiguos fueron eliminados
    });
});
```

---

### Sesión 3: Tests de Integración (2 horas)

#### 3.1 Test: Flujo Completo de Conversación (30 min)
```javascript
// tests/integration/conversation_flow.test.js

describe('Conversation Flow', () => {
    test('envía mensaje y recibe respuesta', async () => {
        // 1. Usuario escribe mensaje
        const input = document.getElementById('user-input');
        input.value = 'Hola';
        
        // 2. Envía mensaje
        const sendButton = document.getElementById('send-button');
        sendButton.click();
        
        // 3. Espera respuesta
        await waitFor(() => {
            const messages = document.querySelectorAll('.message');
            return messages.length > 0;
        });
        
        // 4. Verifica que mensaje aparece
        const messages = document.querySelectorAll('.message');
        expect(messages.length).toBeGreaterThan(0);
    });
});
```

#### 3.2 Test: Sistema de Logros End-to-End (30 min)
```javascript
// tests/integration/achievements_e2e.test.js

describe('Achievements E2E', () => {
    test('desbloquea logro al enviar primer mensaje', async () => {
        // 1. Limpiar estado
        localStorage.clear();
        
        // 2. Enviar primer mensaje
        await sendMessage('Hola');
        
        // 3. Verificar logro desbloqueado
        const unlocked = AchievementSystem.getUnlockedAchievements();
        expect(unlocked).toContainEqual(
            expect.objectContaining({ id: 'first_message' })
        );
        
        // 4. Verificar notificación
        const notification = document.querySelector('.achievement-notification');
        expect(notification).toBeTruthy();
    });
});
```

#### 3.3 Test: Sistema de Traducciones Completo (30 min)
```javascript
// tests/integration/i18n_full.test.js

describe('i18n System Full', () => {
    test('cambia todos los textos al cambiar idioma', () => {
        // 1. Cambiar a inglés
        I18n.setLanguage('en');
        
        // 2. Verificar textos en inglés
        const placeholder = document.getElementById('user-input').placeholder;
        expect(placeholder).toContain('Share');
        
        // 3. Cambiar a español
        I18n.setLanguage('es');
        
        // 4. Verificar textos en español
        const placeholderEs = document.getElementById('user-input').placeholder;
        expect(placeholderEs).toContain('Comparte');
    });
});
```

#### 3.4 Test: Exportación de Historial (30 min)
```javascript
// tests/integration/history_export.test.js

describe('History Export', () => {
    test('exporta historial correctamente', async () => {
        // 1. Crear conversación
        await sendMessage('Mensaje 1');
        await sendMessage('Mensaje 2');
        
        // 2. Exportar
        const exported = await HistoryExport.exportAsJSON();
        
        // 3. Verificar contenido
        expect(exported.messages.length).toBe(2);
        expect(exported.messages[0].content).toBe('Mensaje 1');
    });
});
```

---

### Sesión 4: Validación Cross-Browser (1 hora)

#### 4.1 Chrome/Edge (15 min)
```
1. Abrir tests/index.html en Chrome
2. Ejecutar todos los tests
3. Documentar resultados
4. Anotar problemas específicos
```

#### 4.2 Firefox (15 min)
```
1. Abrir tests/index.html en Firefox
2. Ejecutar todos los tests
3. Documentar resultados
4. Anotar problemas específicos
```

#### 4.3 Safari (15 min - opcional)
```
1. Abrir tests/index.html en Safari
2. Ejecutar todos los tests
3. Documentar resultados
4. Anotar problemas específicos
```

#### 4.4 Documentar Incompatibilidades (15 min)
```
Crear: tests/BROWSER_COMPATIBILITY.md

Contenido:
- Tabla de compatibilidad
- Problemas encontrados
- Soluciones aplicadas
- Features no soportadas
```

---

### Sesión 5: Automatización (1 hora)

#### 5.1 Script de Ejecución (30 min)
```javascript
// tests/run-all-tests.js

const tests = [
    'unit/inputValidator.test.js',
    'unit/htmlSanitizer.test.js',
    'unit/eventBus.test.js',
    'integration/conversation_flow.test.js',
    // ... más tests
];

async function runAllTests() {
    console.log('🧪 Ejecutando todos los tests...\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            await runTest(test);
            passed++;
            console.log(`✅ ${test}`);
        } catch (error) {
            failed++;
            console.log(`❌ ${test}: ${error.message}`);
        }
    }
    
    console.log(`\n📊 Resultados: ${passed} pasaron, ${failed} fallaron`);
    console.log(`📈 Cobertura: ${(passed / tests.length * 100).toFixed(1)}%`);
}

runAllTests();
```

#### 5.2 Reporte de Cobertura (30 min)
```javascript
// tests/coverage-report.js

function generateCoverageReport() {
    const modules = getAllModules();
    const tested = getTestedModules();
    
    const report = {
        total: modules.length,
        tested: tested.length,
        coverage: (tested.length / modules.length * 100).toFixed(1),
        untested: modules.filter(m => !tested.includes(m))
    };
    
    console.log('📊 Reporte de Cobertura\n');
    console.log(`Total de módulos: ${report.total}`);
    console.log(`Módulos con tests: ${report.tested}`);
    console.log(`Cobertura: ${report.coverage}%\n`);
    console.log('❌ Módulos sin tests:');
    report.untested.forEach(m => console.log(`   - ${m}`));
    
    return report;
}
```

---

## 📊 Métricas de Éxito

### Cobertura de Tests
```
Actual:   ~30%
Objetivo: 80%+
Meta:     Aumentar +50%
```

### Tests Nuevos
```
Objetivo: 15+ tests nuevos
- 4 tests unitarios críticos
- 4 tests de integración
- 7+ tests adicionales
```

### Cross-Browser
```
Objetivo: Funciona en 3 navegadores
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅ (opcional)
```

### Automatización
```
Objetivo: Script de ejecución automática
- run-all-tests.js ✅
- coverage-report.js ✅
- Documentación ✅
```

---

## 🛠️ Herramientas Necesarias

### Framework de Testing
**Opción Recomendada**: Vanilla JS (sin framework)
- ✅ Sin dependencias
- ✅ Consistente con el proyecto
- ✅ Fácil de ejecutar en navegador

**Alternativa**: Jest (si se quiere Node.js)
- Requiere instalación
- Mejor para CI/CD
- Más features

### Assertion Library
**Opción Recomendada**: Custom assertions
```javascript
const assert = {
    toBe: (actual, expected) => {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, got ${actual}`);
        }
    },
    toContain: (array, item) => {
        if (!array.includes(item)) {
            throw new Error(`Array does not contain ${item}`);
        }
    }
};
```

---

## 📁 Estructura de Archivos Nueva

```
tests/
├── unit/
│   ├── inputValidator.test.js       ← NUEVO
│   ├── htmlSanitizer.test.js        ← NUEVO
│   ├── eventBus.test.js             ← NUEVO
│   ├── storageOptimizer.test.js     ← NUEVO
│   └── [tests existentes]
├── integration/
│   ├── conversation_flow.test.js    ← NUEVO
│   ├── achievements_e2e.test.js     ← NUEVO
│   ├── i18n_full.test.js            ← NUEVO
│   ├── history_export.test.js       ← NUEVO
│   └── [tests existentes]
├── demos/
│   └── [demos existentes]
├── TEST_INDEX.md                     ← NUEVO
├── BROWSER_COMPATIBILITY.md          ← NUEVO
├── run-all-tests.js                  ← NUEVO
├── coverage-report.js                ← NUEVO
├── index.html                        (actualizar)
└── README.md                         (actualizar)
```

---

## 🎯 Checklist de Fase 4

### Organización
- [ ] Crear TEST_INDEX.md
- [ ] Ejecutar tests existentes
- [ ] Medir cobertura actual
- [ ] Identificar gaps críticos

### Tests Unitarios
- [ ] inputValidator.test.js
- [ ] htmlSanitizer.test.js
- [ ] eventBus.test.js
- [ ] storageOptimizer.test.js

### Tests de Integración
- [ ] conversation_flow.test.js
- [ ] achievements_e2e.test.js
- [ ] i18n_full.test.js
- [ ] history_export.test.js

### Cross-Browser
- [ ] Validar en Chrome/Edge
- [ ] Validar en Firefox
- [ ] Validar en Safari (opcional)
- [ ] Crear BROWSER_COMPATIBILITY.md

### Automatización
- [ ] Crear run-all-tests.js
- [ ] Crear coverage-report.js
- [ ] Actualizar tests/README.md
- [ ] Documentar cómo ejecutar tests

---

## 🚀 Inicio Rápido (Próxima Sesión)

### Paso 1: Auditoría (15 min)
```
1. Abrir tests/index.html
2. Ejecutar tests existentes
3. Anotar cuáles pasan/fallan
```

### Paso 2: Crear Primer Test (30 min)
```
1. Crear tests/unit/inputValidator.test.js
2. Escribir 4-5 tests básicos
3. Ejecutar y verificar
```

### Paso 3: Documentar (15 min)
```
1. Crear TEST_INDEX.md
2. Listar todos los tests
3. Documentar cómo ejecutar
```

**Total**: 1 hora para empezar

---

## 📞 Referencias

- [tests/README.md](tests/README.md) - Guía de tests existente
- [TODO.md](TODO.md) - Lista de tareas general
- [FASE3_COMPLETADA.md](FASE3_COMPLETADA.md) - Fase anterior

---

**Creado**: Noviembre 25, 2025  
**Estado**: ⏳ Pendiente  
**Prerequisito**: ✅ Fase 3 Completada  
**Próxima Acción**: Auditoría de tests existentes

---

🧪 **¡Listo para comenzar la Fase 4 en la próxima sesión!**
