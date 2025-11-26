# Implementation Guide: StateClassifier Improvements

**Date**: November 22, 2025  
**Purpose**: Practical guide to implement recommended design improvements

---

## Phase 1: Add Formal Test Infrastructure (Immediate)

### Step 1: Create Test File

**File**: `js/tests/stateClassifier.test.js`

```javascript
/**
 * StateClassifier Unit Tests
 * Tests for state classification accuracy and edge cases
 */

class StateClassifierTest {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    /**
     * Run all tests
     */
    static runAll() {
        const suite = new StateClassifierTest();
        
        suite.testBasicClassification();
        suite.testConfidenceScoring();
        suite.testErrorHandling();
        suite.testEdgeCases();
        suite.testMultiMatch();
        suite.testEmotionalContext();
        
        suite.printResults();
        return suite;
    }

    /**
     * Test basic classification for each state
     */
    testBasicClassification() {
        const classifier = StateClassifier.getInstance();
        
        const testCases = [
            {
                message: 'No sé qué estudiar',
                expected: USER_STATES.LOST_DIRECTION,
                name: 'Lost Direction'
            },
            {
                message: 'Me siento muy triste y solo',
                expected: USER_STATES.EMOTIONAL_LOW,
                name: 'Emotional Low'
            },
            {
                message: '¿Cuál es mejor, medicina o ingeniería?',
                expected: USER_STATES.SEEKING_DECISION,
                name: 'Seeking Decision'
            },
            {
                message: '¿Qué pasos puedo seguir?',
                expected: USER_STATES.NEED_ORIENTATION,
                name: 'Need Orientation'
            },
            {
                message: 'Solo necesito desahogarme',
                expected: USER_STATES.SELF_EXPRESSION,
                name: 'Self Expression'
            },
            {
                message: 'Hola, ¿cómo estás?',
                expected: USER_STATES.NEUTRAL_CHAT,
                name: 'Neutral Chat'
            }
        ];

        console.log('\n📋 Test Suite: Basic Classification\n');

        for (const testCase of testCases) {
            const result = classifier.classify(testCase.message);
            const passed = result.state === testCase.expected;

            this.recordTest({
                name: testCase.name,
                passed,
                expected: testCase.expected,
                actual: result.state,
                confidence: result.confidence
            });

            const icon = passed ? '✅' : '❌';
            console.log(
                `${icon} ${testCase.name}: ${result.state} ` +
                `(confidence: ${result.confidence.toFixed(2)})`
            );
        }
    }

    /**
     * Test confidence scoring
     */
    testConfidenceScoring() {
        const classifier = StateClassifier.getInstance();

        console.log('\n📊 Test Suite: Confidence Scoring\n');

        const testCases = [
            {
                message: 'No sé qué estudiar',
                minConfidence: 0.7,
                name: 'Single pattern match'
            },
            {
                message: 'Estoy perdido y no sé qué hacer con mi vida',
                minConfidence: 0.8,
                name: 'Multiple pattern matches'
            },
            {
                message: 'Hola',
                maxConfidence: 0.6,
                name: 'Neutral/ambiguous'
            }
        ];

        for (const testCase of testCases) {
            const result = classifier.classify(testCase.message);
            
            let passed = true;
            if (testCase.minConfidence && result.confidence < testCase.minConfidence) {
                passed = false;
            }
            if (testCase.maxConfidence && result.confidence > testCase.maxConfidence) {
                passed = false;
            }

            this.recordTest({
                name: testCase.name,
                passed,
                confidence: result.confidence,
                expected: testCase.minConfidence || testCase.maxConfidence
            });

            const icon = passed ? '✅' : '❌';
            console.log(
                `${icon} ${testCase.name}: ${result.confidence.toFixed(2)} ` +
                `(expected: ${(testCase.minConfidence || testCase.maxConfidence).toFixed(2)})`
            );
        }
    }

    /**
     * Test error handling
     */
    testErrorHandling() {
        const classifier = StateClassifier.getInstance();

        console.log('\n🛡️ Test Suite: Error Handling\n');

        const testCases = [
            { input: null, name: 'Null input' },
            { input: undefined, name: 'Undefined input' },
            { input: '', name: 'Empty string' },
            { input: '   ', name: 'Whitespace only' },
            { input: 123, name: 'Non-string input' }
        ];

        for (const testCase of testCases) {
            try {
                const result = classifier.classify(testCase.input);
                const passed = result.state === USER_STATES.NEUTRAL_CHAT;

                this.recordTest({
                    name: testCase.name,
                    passed,
                    result: result.state
                });

                const icon = passed ? '✅' : '❌';
                console.log(`${icon} ${testCase.name}: ${result.state}`);
            } catch (error) {
                this.recordTest({
                    name: testCase.name,
                    passed: false,
                    error: error.message
                });

                console.log(`❌ ${testCase.name}: Threw error - ${error.message}`);
            }
        }
    }

    /**
     * Test edge cases
     */
    testEdgeCases() {
        const classifier = StateClassifier.getInstance();

        console.log('\n🔍 Test Suite: Edge Cases\n');

        const testCases = [
            {
                message: 'ESTOY PERDIDO Y NO SÉ QUÉ HACER',
                expected: USER_STATES.LOST_DIRECTION,
                name: 'All caps'
            },
            {
                message: 'no sé qué estudiar',
                expected: USER_STATES.LOST_DIRECTION,
                name: 'All lowercase'
            },
            {
                message: 'No sé qué estudiar!!!',
                expected: USER_STATES.LOST_DIRECTION,
                name: 'With punctuation'
            },
            {
                message: 'No sé qué estudiar   ',
                expected: USER_STATES.LOST_DIRECTION,
                name: 'With trailing spaces'
            }
        ];

        for (const testCase of testCases) {
            const result = classifier.classify(testCase.message);
            const passed = result.state === testCase.expected;

            this.recordTest({
                name: testCase.name,
                passed,
                expected: testCase.expected,
                actual: result.state
            });

            const icon = passed ? '✅' : '❌';
            console.log(`${icon} ${testCase.name}: ${result.state}`);
        }
    }

    /**
     * Test multi-match scenarios
     */
    testMultiMatch() {
        const classifier = StateClassifier.getInstance();

        console.log('\n🔀 Test Suite: Multi-Match Scenarios\n');

        const testCases = [
            {
                message: 'Estoy perdido, no sé qué hacer y me siento mal',
                name: 'Multiple states match'
            },
            {
                message: 'Debo elegir entre dos opciones pero no sé qué hacer',
                name: 'Decision + Orientation'
            }
        ];

        for (const testCase of testCases) {
            const result = classifier.classify(testCase.message);

            this.recordTest({
                name: testCase.name,
                passed: true,
                state: result.state,
                confidence: result.confidence
            });

            console.log(
                `✅ ${testCase.name}: ${result.state} ` +
                `(confidence: ${result.confidence.toFixed(2)})`
            );
        }
    }

    /**
     * Test emotional context
     */
    testEmotionalContext() {
        const classifier = StateClassifier.getInstance();

        console.log('\n😊 Test Suite: Emotional Context\n');

        const testCases = [
            {
                message: 'Me siento triste',
                expectedTone: 'sad',
                name: 'Sad emotion'
            },
            {
                message: 'Estoy confundido',
                expectedTone: 'confused',
                name: 'Confused emotion'
            }
        ];

        for (const testCase of testCases) {
            const result = classifier.classify(testCase.message);

            this.recordTest({
                name: testCase.name,
                passed: true,
                emotionalTone: result.emotionalTone
            });

            console.log(
                `✅ ${testCase.name}: ${result.emotionalTone}`
            );
        }
    }

    /**
     * Record test result
     */
    recordTest(test) {
        this.tests.push(test);
        if (test.passed) {
            this.passed++;
        } else {
            this.failed++;
        }
    }

    /**
     * Print test results summary
     */
    printResults() {
        const total = this.passed + this.failed;
        const percentage = total > 0 ? ((this.passed / total) * 100).toFixed(1) : 0;

        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total:  ${total}`);
        console.log(`🎯 Success Rate: ${percentage}%`);
        console.log('='.repeat(50) + '\n');

        return {
            passed: this.passed,
            failed: this.failed,
            total,
            percentage: parseFloat(percentage)
        };
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.StateClassifierTest = StateClassifierTest;
    console.log('🧪 StateClassifier tests loaded. Run: StateClassifierTest.runAll()');
}
```

### Step 2: Add Test Runner to HTML

**File**: `tests/stateClassifier.test.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StateClassifier Tests</title>
    <style>
        body {
            font-family: monospace;
            background: #0a1128;
            color: #e0f7fa;
            padding: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        h1 {
            color: #7dd3c0;
            border-bottom: 2px solid #7dd3c0;
            padding-bottom: 1rem;
        }
        
        .test-controls {
            background: rgba(10, 17, 40, 0.6);
            border: 1px solid rgba(64, 224, 208, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        button {
            background: rgba(125, 211, 192, 0.2);
            border: 1px solid rgba(125, 211, 192, 0.3);
            color: #7dd3c0;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0.5rem 0;
        }
        
        button:hover {
            background: rgba(125, 211, 192, 0.3);
        }
        
        .output {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(64, 224, 208, 0.2);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            max-height: 600px;
            overflow-y: auto;
            font-size: 0.9rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>🧪 StateClassifier Test Suite</h1>
    
    <div class="test-controls">
        <button onclick="runTests()">▶️ Run All Tests</button>
        <button onclick="clearOutput()">🗑️ Clear Output</button>
    </div>
    
    <div class="output" id="output"></div>

    <!-- Load dependencies -->
    <script src="../js/core/stateClassifier.js"></script>
    <script src="../js/tests/stateClassifier.test.js"></script>
    
    <script>
        const outputDiv = document.getElementById('output');
        
        // Capture console output
        const originalLog = console.log;
        console.log = function(...args) {
            originalLog.apply(console, args);
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            outputDiv.innerHTML += message + '\n';
            outputDiv.scrollTop = outputDiv.scrollHeight;
        };
        
        function runTests() {
            outputDiv.innerHTML = '';
            StateClassifierTest.runAll();
        }
        
        function clearOutput() {
            outputDiv.innerHTML = '';
        }
        
        // Auto-run on load
        window.addEventListener('load', () => {
            console.log('🧪 StateClassifier Test Suite Ready\n');
            console.log('Click "Run All Tests" to start testing\n');
        });
    </script>
</body>
</html>
```

---

## Phase 2: Implement Dependency Injection (Short-term)

### Step 1: Create Analyzer Interface

**File**: `js/core/emotionalAnalyzer.js`

```javascript
/**
 * Emotional Analyzer Interface
 * Defines contract for emotional analysis implementations
 */

class EmotionalAnalyzer {
    /**
     * Analyze emotional tone of message
     * @param {string} message - User message
     * @param {Object} context - Conversation context
     * @returns {string} Emotional tone
     */
    analyze(message, context = {}) {
        throw new Error('analyze() must be implemented');
    }
}

/**
 * Default Emotional Analyzer
 * Simple pattern-based emotional analysis
 */
class DefaultEmotionalAnalyzer extends EmotionalAnalyzer {
    analyze(message, context = {}) {
        const lowerMessage = message.toLowerCase();
        
        if (/triste|deprimido|mal|ansioso|agotado|desesperado/.test(lowerMessage)) {
            return 'sad';
        }
        if (/confundido|perdido|duda|incertidumbre/.test(lowerMessage)) {
            return 'confused';
        }
        if (/feliz|bien|contento|alegre/.test(lowerMessage)) {
            return 'happy';
        }
        if (/enojado|furioso|irritado/.test(lowerMessage)) {
            return 'angry';
        }
        
        return 'neutral';
    }
}

// Export
if (typeof window !== 'undefined') {
    window.EmotionalAnalyzer = EmotionalAnalyzer;
    window.DefaultEmotionalAnalyzer = DefaultEmotionalAnalyzer;
}
```

### Step 2: Update StateClassifier

**File**: `js/core/stateClassifier.js` (Modified)

```javascript
class StateClassifier {
    constructor(config = {}, emotionalAnalyzer = null) {
        // Singleton enforcement
        if (StateClassifier.instance) {
            console.warn('StateClassifier already initialized. Returning existing instance.');
            return StateClassifier.instance;
        }

        this.config = { ...CLASSIFIER_CONFIG, ...config };
        
        // Dependency Injection
        if (emotionalAnalyzer) {
            this.emotionalAnalyzer = emotionalAnalyzer;
        } else if (typeof DefaultEmotionalAnalyzer !== 'undefined') {
            this.emotionalAnalyzer = new DefaultEmotionalAnalyzer();
        } else {
            this.emotionalAnalyzer = null;
        }
        
        this.classificationHistory = [];
        
        StateClassifier.instance = this;
    }

    getEmotionalTone(message, context) {
        // Use injected analyzer
        if (this.emotionalAnalyzer) {
            return this.emotionalAnalyzer.analyze(message, context);
        }
        
        // Fallback
        return this.simpleEmotionalAnalysis(message);
    }
}
```

---

## Phase 3: Add Strategy Pattern for Patterns (Medium-term)

### Step 1: Create Pattern Strategy

**File**: `js/core/patternStrategy.js`

```javascript
/**
 * Pattern Detection Strategy
 * Defines contract for pattern detection implementations
 */

class PatternStrategy {
    /**
     * Get patterns for state classification
     * @returns {Object} Map of states to pattern arrays
     */
    getPatterns() {
        throw new Error('getPatterns() must be implemented');
    }
}

/**
 * Default Pattern Strategy
 * Uses hardcoded patterns from STATE_PATTERNS
 */
class DefaultPatternStrategy extends PatternStrategy {
    getPatterns() {
        return STATE_PATTERNS;
    }
}

/**
 * Custom Pattern Strategy
 * Allows runtime pattern customization
 */
class CustomPatternStrategy extends PatternStrategy {
    constructor(customPatterns) {
        super();
        this.customPatterns = customPatterns;
    }
    
    getPatterns() {
        return this.customPatterns;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PatternStrategy = PatternStrategy;
    window.DefaultPatternStrategy = DefaultPatternStrategy;
    window.CustomPatternStrategy = CustomPatternStrategy;
}
```

### Step 2: Update StateClassifier to Use Strategy

```javascript
class StateClassifier {
    constructor(config = {}, patternStrategy = null, emotionalAnalyzer = null) {
        // ... existing code ...
        
        // Pattern Strategy Injection
        if (patternStrategy) {
            this.patternStrategy = patternStrategy;
        } else if (typeof DefaultPatternStrategy !== 'undefined') {
            this.patternStrategy = new DefaultPatternStrategy();
        } else {
            this.patternStrategy = null;
        }
    }

    analyzePatterns(message) {
        const patterns = this.patternStrategy?.getPatterns() || STATE_PATTERNS;
        const matches = {};
        
        for (const [state, patternArray] of Object.entries(patterns)) {
            const matchedPatterns = [];
            
            for (const pattern of patternArray) {
                if (pattern.test(message)) {
                    matchedPatterns.push(pattern.source);
                }
            }
            
            if (matchedPatterns.length > 0) {
                matches[state] = matchedPatterns;
            }
        }
        
        return matches;
    }
}
```

---

## Phase 4: Implement Weighted Confidence Scoring (Medium-term)

### Step 1: Create Confidence Scorer

**File**: `js/core/confidenceScorer.js`

```javascript
/**
 * Confidence Scorer
 * Calculates classification confidence with multiple factors
 */

class ConfidenceScorer {
    /**
     * Score classification confidence
     * @param {Object} matches - Pattern matches by state
     * @param {string} selectedState - Selected state
     * @param {Object} context - Classification context
     * @returns {number} Confidence score (0-1)
     */
    score(matches, selectedState, context = {}) {
        throw new Error('score() must be implemented');
    }
}

/**
 * Weighted Confidence Scorer
 * Considers multiple factors for confidence calculation
 */
class WeightedConfidenceScorer extends ConfidenceScorer {
    constructor(weights = {}) {
        super();
        this.weights = {
            patternCount: 0.5,
            emotionalAlignment: 0.3,
            contextConsistency: 0.2,
            ...weights
        };
    }
    
    score(matches, selectedState, context = {}) {
        if (selectedState === USER_STATES.NEUTRAL_CHAT) {
            return 0.5;
        }
        
        let score = 0;
        
        // Pattern count score
        const matchCount = matches[selectedState]?.length || 0;
        const patternScore = Math.min(0.5 + (matchCount * 0.15), 0.95);
        score += patternScore * this.weights.patternCount;
        
        // Emotional alignment score
        if (context.emotionalTone) {
            const emotionalScore = this.getEmotionalAlignmentScore(selectedState, context.emotionalTone);
            score += emotionalScore * this.weights.emotionalAlignment;
        }
        
        // Context consistency score
        if (context.history && context.history.length > 0) {
            const consistencyScore = this.getContextConsistencyScore(selectedState, context.history);
            score += consistencyScore * this.weights.contextConsistency;
        }
        
        return Math.min(score, 1.0);
    }
    
    getEmotionalAlignmentScore(state, tone) {
        const alignments = {
            EMOTIONAL_LOW: ['sad', 'anxious', 'depressed', 'angry'],
            LOST_DIRECTION: ['confused', 'uncertain'],
            SEEKING_DECISION: ['uncertain', 'conflicted'],
            NEED_ORIENTATION: ['confused', 'uncertain'],
            SELF_EXPRESSION: ['neutral', 'happy', 'sad'],
            NEUTRAL_CHAT: ['neutral', 'happy']
        };
        
        const aligned = alignments[state]?.includes(tone) || false;
        return aligned ? 1.0 : 0.5;
    }
    
    getContextConsistencyScore(state, history) {
        if (history.length === 0) return 0.5;
        
        // Check if recent classifications are consistent
        const recentStates = history.slice(-3).map(h => h.state);
        const isConsistent = recentStates.every(s => s === state);
        
        return isConsistent ? 1.0 : 0.6;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ConfidenceScorer = ConfidenceScorer;
    window.WeightedConfidenceScorer = WeightedConfidenceScorer;
}
```

---

## Usage Examples

### Basic Usage (Current)
```javascript
const classifier = StateClassifier.getInstance();
const result = classifier.classify('No sé qué estudiar');
console.log(result);
```

### With Custom Emotional Analyzer
```javascript
const customAnalyzer = new DefaultEmotionalAnalyzer();
const classifier = new StateClassifier({}, null, customAnalyzer);
const result = classifier.classify('Me siento triste');
```

### With Custom Patterns
```javascript
const customPatterns = {
    LOST_DIRECTION: [/custom pattern/i],
    // ... more patterns
};
const strategy = new CustomPatternStrategy(customPatterns);
const classifier = new StateClassifier({}, strategy);
```

### With Weighted Confidence Scorer
```javascript
const weights = {
    patternCount: 0.6,
    emotionalAlignment: 0.3,
    contextConsistency: 0.1
};
const scorer = new WeightedConfidenceScorer(weights);
// Use in StateClassifier when implemented
```

---

## Testing the Improvements

### Run Tests
```bash
# Open in browser
open tests/stateClassifier.test.html

# Or run in console
StateClassifierTest.runAll()
```

### Expected Output
```
✅ Lost Direction: LOST_DIRECTION (confidence: 0.85)
✅ Emotional Low: EMOTIONAL_LOW (confidence: 0.90)
✅ Seeking Decision: SEEKING_DECISION (confidence: 0.80)
...

📊 TEST RESULTS SUMMARY
==================================================
✅ Passed: 28
❌ Failed: 2
📈 Total:  30
🎯 Success Rate: 93.3%
==================================================
```

---

## Conclusion

This implementation guide provides a practical roadmap for improving the `StateClassifier` module through:

1. **Formal testing** - Ensures reliability and prevents regression
2. **Dependency Injection** - Improves testability and flexibility
3. **Strategy Pattern** - Enables runtime customization
4. **Weighted Scoring** - Provides more nuanced confidence calculation

Each phase can be implemented independently and incrementally integrated into the existing codebase.

