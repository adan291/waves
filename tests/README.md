# Whispers of the Wave - Test Suite

Este directorio contiene la suite de pruebas del proyecto, organizada por tipo de prueba.

## Estructura

### 1. `unit/` (Pruebas Unitarias)
Pruebas aisladas para módulos individuales y funciones core.
- `css_selector_test.html`: Valida selectores CSS.
- `modal_test.html`: Valida funcionalidad de modales.
- `suggestions_test.html`: Valida lógica de sugerencias.
- `expression_metrics_test.html`: Valida cálculo de métricas.

### 2. `integration/` (Pruebas de Integración)
Pruebas que verifican la interacción entre múltiples módulos.
- `full_app_test.html`: Prueba del flujo completo de la aplicación.
- `i18n_complete_test.html`: Valida sistema de internacionalización completo.
- `performance_test.html`: Pruebas de rendimiento y carga.
- `achievements_test.html`: Valida sistema de logros integrado.

### 3. `demos/` (Demos Visuales)
Archivos para validación manual y visual de componentes.
- `ocean_dynamics_test.html`: Visualización de estados del océano.
- `waves_preview.html`: Previsualización de olas.
- `theme_light_debug.html`: Debugging del tema claro.

## Cómo Ejecutar las Pruebas

1. **Pruebas Manuales**: Abrir el archivo HTML correspondiente en el navegador.
2. **Verificación**: Revisar la consola del navegador (F12) para ver resultados de aserciones y logs.
3. **Demos**: Interactuar con la página para verificar el comportamiento visual.

## Convenciones

- Los archivos de prueba deben terminar en `_test.html`.
- Usar `console.assert()` para validaciones básicas.
- Reportar éxito/fallo claramente en el DOM o consola.
