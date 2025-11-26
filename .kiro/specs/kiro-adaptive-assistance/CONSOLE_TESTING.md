# Console Testing Utilities

## Overview

The Kiro Adaptive Assistance system includes comprehensive console testing utilities that allow developers to test and debug the adaptive system directly from the browser console. These utilities provide interactive testing capabilities for state classification, response patterns, and system integration.

## Getting Started

### Loading the Test Environment

1. Open `test_console_utilities.html` in your browser
2. Open the browser's Developer Console (F12 or Ctrl+Shift+I)
3. The testing utilities will be automatically loaded and available

Alternatively, if you're on the main application page (`index.html`), the utilities are also available as long as `adaptiveAssistance.js` is loaded.

## Available Commands

### 🔍 Main Test Suite

#### `testAdaptiveSystem()`
Runs the complete test suite including state classification, response patterns, and integration tests.

```javascript
testAdaptiveSystem()
```

**Output:**
- State classification tests for all 6 user states
- Response pattern tests
- Integration tests
- Test summary with pass/fail statistics

#### `testAdaptiveSystem('classification')`
Runs only state classification tests.

```javascript
testAdaptiveSystem('classification')
```

#### `testAdaptiveSystem('patterns')`
Runs only response pattern tests.

```javascript
testAdaptiveSystem('patterns')
```

#### `testAdaptiveSystem('LOST_DIRECTION')`
Tests a specific user state. Works with any state name:
- `LOST_DIRECTION`
- `EMOTIONAL_LOW`
- `SEEKING_DECISION`
- `NEED_ORIENTATION`
- `SELF_EXPRESSION`
- `NEUTRAL_CHAT`

```javascript
testAdaptiveSystem('EMOTIONAL_LOW')
```

### 💬 Individual Message Testing

#### `testMessage(message)`
Classifies a single message and displays detailed classification results.

```javascript
testMessage('No sé qué estudiar')
```

**Output:**
```
Message: "No sé qué estudiar"

Classification:
  State: LOST_DIRECTION
  Confidence: 95.0%
  Emotional Tone: confused
  Indicators: no sé qué estudiar
  Timestamp: 10:30:45 AM
```

**Example Messages to Test:**

```javascript
// Lost Direction
testMessage('No sé qué estudiar')
testMessage('Estoy perdido con mi vida')

// Emotional Low
testMessage('Me siento muy triste')
testMessage('Estoy agotado y no puedo más')

// Seeking Decision
testMessage('¿Cuál es mejor, medicina o ingeniería?')
testMessage('No sé si estudiar o trabajar')

// Need Orientation
testMessage('¿Qué puedo hacer ahora?')
testMessage('¿Qué pasos debo seguir?')

// Self Expression
testMessage('Solo necesito desahogarme')
testMessage('Déjame contarte lo que pasó')

// Neutral Chat
testMessage('Hola')
testMessage('Gracias')
```

### 🎨 Pattern Testing

#### `testPattern(patternName)`
Views the system prompt for a specific response pattern and checks for ocean metaphors.

```javascript
testPattern('life_questioning')
```

**Available Patterns:**
- `life_questioning` - Life Questioning Engine
- `emotional_soothing` - Emotional Soothing Pattern
- `decision_matrix` - Decision Matrix Pattern
- `action_roadmap` - Action Roadmap Generator
- `reflective_mirror` - Reflective Mirror Pattern
- `neutral_chat` - Neutral Chat Handler

**Output:**
```
Pattern: life_questioning

Prompt Preview (first 500 chars):
Eres Kiro, un guía que ayuda a las personas a encontrar claridad...

Full prompt length: 1234 characters

🌊 Ocean metaphors found: ola, corriente, marea
```

### 📊 State History

#### `viewStateHistory()`
Displays the complete history of state classifications with statistics.

```javascript
viewStateHistory()
```

**Output:**
```
State History

Total entries: 5

1. NEUTRAL_CHAT
   Time: 10:30:15 AM
   Confidence: 80.0%
   Emotional Tone: neutral
   Message: "Hola"

2. LOST_DIRECTION
   Time: 10:30:45 AM
   Confidence: 95.0%
   Emotional Tone: confused
   Transition: NEUTRAL_CHAT → LOST_DIRECTION
   Message: "No sé qué estudiar"

📊 State Distribution:
   NEUTRAL_CHAT: 1 (20.0%)
   LOST_DIRECTION: 4 (80.0%)
```

#### `clearStateHistory()`
Clears the state history.

```javascript
clearStateHistory()
```

## Test Coverage

The console testing utilities provide comprehensive coverage of:

### State Classification Tests
- ✅ Pattern matching for all 6 user states
- ✅ Confidence scoring accuracy
- ✅ Emotional tone detection
- ✅ Multiple test messages per state
- ✅ Edge cases (empty messages, ambiguous messages)

### Response Pattern Tests
- ✅ Pattern selection for each state
- ✅ Prompt generation validation
- ✅ Ocean metaphor inclusion (except neutral chat)
- ✅ Prompt structure and length
- ✅ JSON output format

### Integration Tests
- ✅ State history tracking
- ✅ State transition validation
- ✅ Action name mapping
- ✅ Output structure validation
- ✅ Complete flow testing

## Sample Test Messages

The test suite includes 5 sample messages for each state:

### LOST_DIRECTION
1. "No sé qué estudiar"
2. "Estoy perdido con mi vida"
3. "¿Qué camino debo seguir?"
4. "No tengo dirección en mi vida"
5. "Me siento confundido con mi futuro"

### EMOTIONAL_LOW
1. "Me siento muy triste"
2. "Estoy agotado y no puedo más"
3. "Todo está mal en mi vida"
4. "Me siento deprimido"
5. "Estoy abrumado por todo"

### SEEKING_DECISION
1. "¿Cuál es mejor, medicina o ingeniería?"
2. "No sé si estudiar o trabajar"
3. "Ayúdame a decidir entre estas opciones"
4. "¿Qué opción me conviene más?"
5. "Necesito comparar estas dos carreras"

### NEED_ORIENTATION
1. "¿Qué puedo hacer ahora?"
2. "¿Qué pasos debo seguir?"
3. "¿Cómo empiezo?"
4. "Necesito guía práctica"
5. "¿Por dónde empiezo?"

### SELF_EXPRESSION
1. "Solo necesito desahogarme"
2. "Déjame contarte lo que pasó"
3. "Necesito hablar de esto"
4. "Quiero expresar lo que siento"
5. "Solo necesito que escuches"

### NEUTRAL_CHAT
1. "Hola"
2. "¿Cómo estás?"
3. "Gracias"
4. "Está bien"
5. "Entiendo"

## Advanced Usage

### Storing Test Results

All test functions return their results, allowing for programmatic analysis:

```javascript
// Store full test results
const results = testAdaptiveSystem();
console.log(`Pass rate: ${(results.passed / (results.passed + results.failed) * 100).toFixed(1)}%`);

// Store classification result
const classification = testMessage('No sé qué estudiar');
console.log(`Confidence: ${classification.confidence}`);

// Store pattern prompt
const prompt = testPattern('life_questioning');
console.log(`Prompt length: ${prompt.length}`);

// Store state history
const history = viewStateHistory();
console.log(`Total states tracked: ${history.length}`);
```

### Running Specific Test Types

```javascript
// Test only classification
testAdaptiveSystem('classification')

// Test only patterns
testAdaptiveSystem('patterns')

// Test only integration
testAdaptiveSystem('integration')

// View sample outputs
testAdaptiveSystem('samples')
```

### Testing Custom Messages

```javascript
// Test your own messages
testMessage('Tu mensaje personalizado aquí')

// Test edge cases
testMessage('')  // Empty message
testMessage('a'.repeat(1000))  // Very long message
testMessage('Hello, how are you?')  // English message
```

## Interpreting Results

### Test Output Format

```
✅ LOST_DIRECTION - Message 1: "No sé qué estudiar..."
   Expected: LOST_DIRECTION
   Got: LOST_DIRECTION
   Confidence: 0.95
   Emotional Tone: confused

❌ NEUTRAL_CHAT - Message 3: "Gracias"
   Expected: NEUTRAL_CHAT
   Got: SELF_EXPRESSION
```

### Success Indicators

- ✅ Green checkmark = Test passed
- ❌ Red X = Test failed
- ⚠️ Warning triangle = Validation issue
- 🌊 Ocean wave = Ocean metaphor detected

### Test Summary

```
🌊 TEST SUMMARY
✅ Passed: 45
❌ Failed: 2
📊 Total: 47
📈 Success Rate: 95.7%
```

## Troubleshooting

### "StateClassifier not loaded" Error

**Solution:** Ensure `stateClassifier.js` is loaded before `adaptiveAssistance.js`:

```html
<script src="js/core/stateClassifier.js"></script>
<script src="js/prompts/adaptivePrompts.js"></script>
<script src="js/core/responsePatterns.js"></script>
<script src="js/core/adaptiveAssistance.js"></script>
```

### "ADAPTIVE_PROMPTS not loaded" Warning

**Solution:** Ensure `adaptivePrompts.js` is loaded before `responsePatterns.js`.

### Tests Failing Unexpectedly

1. Check browser console for error messages
2. Verify all modules are loaded correctly
3. Clear state history: `clearStateHistory()`
4. Refresh the page and try again

### Low Confidence Scores

If classification confidence is consistently low:
1. Check if the message matches expected patterns
2. Review `STATE_PATTERNS` in `stateClassifier.js`
3. Consider adding more pattern variations

## Best Practices

### During Development

1. Run full test suite after making changes:
   ```javascript
   testAdaptiveSystem()
   ```

2. Test specific states when modifying patterns:
   ```javascript
   testAdaptiveSystem('EMOTIONAL_LOW')
   ```

3. Verify ocean metaphors in prompts:
   ```javascript
   testPattern('emotional_soothing')
   ```

### During Debugging

1. Test individual messages to isolate issues:
   ```javascript
   testMessage('Problematic message here')
   ```

2. View state history to track transitions:
   ```javascript
   viewStateHistory()
   ```

3. Clear history between test runs:
   ```javascript
   clearStateHistory()
   ```

### Before Deployment

1. Run complete test suite: `testAdaptiveSystem()`
2. Verify all tests pass (100% success rate)
3. Test edge cases with custom messages
4. Review state history for unexpected transitions

## Requirements Coverage

The console testing utilities fulfill the following requirements:

- ✅ **Requirement 1.1:** Tests LOST_DIRECTION state classification
- ✅ **Requirement 2.1:** Tests EMOTIONAL_LOW state classification
- ✅ **Requirement 3.1:** Tests SEEKING_DECISION state classification
- ✅ **Requirement 4.1:** Tests NEED_ORIENTATION state classification
- ✅ **Requirement 5.1:** Tests SELF_EXPRESSION state classification
- ✅ **Requirement 6.1:** Tests NEUTRAL_CHAT state classification

## Additional Resources

- **Design Document:** `.kiro/specs/kiro-adaptive-assistance/design.md`
- **Requirements:** `.kiro/specs/kiro-adaptive-assistance/requirements.md`
- **Manual Testing Guide:** `.kiro/specs/kiro-adaptive-assistance/TESTING.md`
- **Test Files:** `tests/` directory

## Support

For issues or questions about the console testing utilities:

1. Check the browser console for error messages
2. Review the test output for specific failures
3. Consult the design and requirements documents
4. Run `testAdaptiveSystem()` to verify system health
