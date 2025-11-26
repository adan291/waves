# 🧪 Cómo Probar el Sistema de Specs

## Opción 1: Prueba Rápida desde Línea de Comandos ⚡

### Probar el Router

```bash
# Prueba con un mensaje emocional
node .kiro/specs/whispers-main/router.js "Me siento perdido en la vida"

# Prueba con un mensaje de decisión
node .kiro/specs/whispers-main/router.js "Tengo que elegir entre dos trabajos"

# Prueba con orientación profesional
node .kiro/specs/whispers-main/router.js "No sé qué estudiar"
```

**Qué verás:**
- Spec seleccionada (whispers-of-the-wave o kiro-adaptive-assistance)
- Nivel de confianza (0-1)
- Razón de la selección
- Keywords detectadas
- Intent detectado

---

## Opción 2: Ejecutar Tests Completos 🧪

```bash
# Ejecuta los 10 tests de integración
node tests/integration_test_runner.js
```

**Qué verás:**
- Resultados de 10 tests diferentes
- Success rate (debería ser 100%)
- Confianza promedio
- Distribución de specs
- Reporte guardado en `reports/integration_report.json`

---

## Opción 3: Probar con tus Propios Mensajes 💬

### Crear un archivo de prueba

Crea `mi_prueba.js`:

```javascript
const FeatureRouter = require('./.kiro/specs/whispers-main/router.js');
const { getSpecLoader } = require('./.kiro/specs/whispers-main/spec_loader.js');

async function probarMensaje(texto) {
    console.log('\n' + '='.repeat(60));
    console.log(`Probando: "${texto}"`);
    console.log('='.repeat(60));
    
    // 1. Router
    const router = new FeatureRouter();
    const routing = router.route(texto);
    
    console.log('\n📍 Routing:');
    console.log(`   Spec: ${routing.spec}`);
    console.log(`   Confianza: ${routing.confidence}`);
    console.log(`   Razón: ${routing.reason}`);
    
    // 2. Crear request
    const request = router.createRequest(texto, routing);
    
    // 3. Procesar con adapter
    const loader = getSpecLoader();
    const response = await loader.processRequest(request);
    
    console.log('\n✅ Respuesta:');
    console.log(`   Éxito: ${response.success}`);
    console.log(`   Pattern: ${response.metadata?.pattern_used}`);
    console.log(`   Confianza: ${response.metadata?.confidence}`);
    
    if (response.success) {
        console.log('\n📝 Texto de respuesta:');
        console.log(response.response.text.substring(0, 200) + '...');
    }
}

// Prueba tus mensajes aquí
async function main() {
    await probarMensaje("Me siento muy solo");
    await probarMensaje("¿Qué carrera debería estudiar?");
    await probarMensaje("Necesito ayuda para decidir");
    // Añade más mensajes aquí
}

main();
```

Ejecuta:
```bash
node mi_prueba.js
```

---

## Opción 4: Prueba Interactiva en Node.js 🎮

```bash
node
```

Luego en el REPL de Node:

```javascript
// Cargar módulos
const FeatureRouter = require('./.kiro/specs/whispers-main/router.js');
const { getSpecLoader } = require('./.kiro/specs/whispers-main/spec_loader.js');

// Inicializar
const router = new FeatureRouter();
const loader = getSpecLoader();

// Función helper
async function probar(texto) {
    const routing = router.route(texto);
    console.log('Spec:', routing.spec, '| Confianza:', routing.confidence);
    const request = router.createRequest(texto, routing);
    const response = await loader.processRequest(request);
    console.log('Pattern:', response.metadata?.pattern_used);
    return response;
}

// Prueba mensajes
await probar("Me siento triste");
await probar("Tengo que elegir entre dos opciones");
await probar("No sé qué estudiar");
```

---

## Opción 5: Ver Adapters Cargados 📦

```bash
node .kiro/specs/whispers-main/spec_loader.js
```

**Verás:**
- Lista de adapters cargados
- Nombre de cada spec
- Versión del contrato
- Número de intents soportados

---

## Opción 6: Validar Todo el Sistema ✅

```bash
# Validar que todos los specs tienen sus archivos
node .kiro/specs/whispers-main/scripts/validate_specs.js
```

**Debería mostrar:**
```
✅ All specs are valid!
```

---

## Ejemplos de Mensajes para Probar

### Mensajes Emocionales (→ whispers-of-the-wave)
- "Me siento muy triste últimamente"
- "Estoy perdido en la vida"
- "No encuentro sentido a nada"
- "Me siento solo y vacío"
- "Tengo miedo del futuro"

### Mensajes de Decisión (→ kiro-adaptive-assistance)
- "Tengo que elegir entre dos trabajos"
- "¿Qué debería estudiar, diseño o programación?"
- "Ayúdame a decidir entre A y B"
- "No sé qué carrera seguir"
- "Necesito orientación profesional"

### Mensajes Ambiguos (→ default spec)
- "Hola"
- "¿Qué tal?"
- "Cuéntame algo"
- "No sé"

---

## Ver Resultados Detallados 📊

Después de ejecutar tests, revisa:

```bash
# Ver reporte JSON completo
cat reports/integration_report.json

# Ver resumen ejecutivo
cat reports/EXECUTIVE_SUMMARY.md

# Ver reporte final
cat reports/FINAL_REPORT.md
```

---

## Probar con Diferentes Configuraciones 🔧

### Cambiar Threshold de Confianza

Edita `.kiro/specs/whispers-main/rules.json`:

```json
{
  "_meta": {
    "confidence_thresholds": {
      "high": 0.7,
      "medium": 0.3,  // Cambia esto
      "low": 0.3
    }
  }
}
```

Luego ejecuta tests de nuevo:
```bash
node tests/integration_test_runner.js
```

### Añadir Tus Propias Keywords

Edita `.kiro/specs/whispers-main/rules.json`:

```json
{
  "kiro-adaptive-assistance": {
    "keywords": [
      // Añade tus keywords aquí
      "mi_keyword",
      "otra_palabra"
    ]
  }
}
```

Prueba:
```bash
node .kiro/specs/whispers-main/router.js "mensaje con mi_keyword"
```

---

## Debugging 🐛

### Ver Logs Detallados

```bash
# Si hay errores, revisa:
cat logs/errors.log
```

### Probar un Adapter Específico

```javascript
// En Node.js REPL
const Adapter = require('./.kiro/specs/whispers-of-the-wave/adapter.js');
const adapter = new Adapter();

// Ver capabilities
console.log(adapter.getCapabilities());

// Probar canHandle
const testRequest = {
    id: 'test-1',
    timestamp: Date.now(),
    text: 'Me siento triste',
    spec: 'whispers-of-the-wave',
    routing: { confidence: 0.8 },
    context: { detected_intent: 'emotional_support' }
};

const canHandle = adapter.canHandle(testRequest);
console.log('Can handle:', canHandle);
```

---

## Comparar Antes y Después 📈

### Ejecutar con Keywords Originales

1. Guarda backup de `rules.json`
2. Restaura versión anterior
3. Ejecuta tests: `node tests/integration_test_runner.js`
4. Compara resultados

### Ejecutar con Keywords Mejoradas

1. Usa `rules.json` actual
2. Ejecuta tests: `node tests/integration_test_runner.js`
3. Compara confianza y success rate

---

## Tips para Probar 💡

1. **Empieza simple**: Prueba primero el router solo
2. **Usa mensajes claros**: Mensajes muy ambiguos tendrán baja confianza
3. **Revisa los logs**: Mira qué keywords y patterns se detectan
4. **Experimenta**: Añade tus propias keywords y prueba
5. **Compara resultados**: Ejecuta tests antes y después de cambios

---

## Troubleshooting 🔧

### "Cannot find module"
```bash
# Asegúrate de estar en el directorio correcto
cd D:\waves
```

### "No such file or directory"
```bash
# Verifica que los archivos existen
ls .kiro/specs/whispers-main/
```

### Tests fallan
```bash
# Valida primero
node .kiro/specs/whispers-main/scripts/validate_specs.js

# Revisa errores
cat logs/errors.log
```

---

## Próximos Pasos 🚀

Una vez que hayas probado y estés satisfecho:

1. **Ajusta keywords** según tus necesidades
2. **Añade patterns** específicos para tu caso de uso
3. **Prueba con usuarios reales** y recolecta feedback
4. **Itera y mejora** basándote en datos reales

---

## ¿Necesitas Ayuda? 🆘

- Revisa `QUICK_START.md` para comandos rápidos
- Lee `PROJECT_COMPLETION_SUMMARY.md` para overview completo
- Consulta `reports/EXECUTIVE_SUMMARY.md` para análisis detallado

---

**¡Feliz testing! 🎉**
