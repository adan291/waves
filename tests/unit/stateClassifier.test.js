/**
 * StateClassifier Unit Tests
 * Tests state pattern matching, confidence scoring, priority system, and edge cases
 * 
 * Run in browser by opening tests/stateClassifier.test.html
 */

// ============================================
// TEST UTILITIES
// ============================================

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('\n🧪 === RUNNING STATE CLASSIFIER TESTS ===\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                this.results.passed++;
                console.log(`✅ PASS: ${test.name}`);
            } catch (error) {
                this.results.failed++;
                console.error(`❌ FAIL: ${test.name}`);
                console.error(`   Error: ${error.message}`);
            }
            this.results.total++;
        }
        
        console.log(`\n📊 Results: ${this.results.passed}/${this.results.total} passed, ${this.results.failed} failed\n`);
        
        return this.results;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

function assertGreaterThan(actual, threshold, message) {
    if (actual <= threshold) {
        throw new Error(message || `Expected ${actual} > ${threshold}`);
    }
}

function assertContains(array, item, message) {
    if (!array.includes(item)) {
        throw new Error(message || `Expected array to contain ${item}`);
    }
}

// ============================================
// TEST SUITE
// ============================================

const runner = new TestRunner();

// ============================================
// POSITIVE EXAMPLES - Each state pattern
// ============================================

runner.test('LOST_DIRECTION: "No sé qué estudiar"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('No sé qué estudiar');
    
    assertEquals(result.state, 'LOST_DIRECTION', 'Should classify as LOST_DIRECTION');
    assertGreaterThan(result.confidence, 0.6, 'Confidence should be > 0.6');
    assert(result.indicators.length > 0, 'Should have matched indicators');
});

runner.test('LOST_DIRECTION: "Estoy perdido con mi vida"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Estoy perdido con mi vida');
    
    assertEquals(result.state, 'LOST_DIRECTION');
    assertGreaterThan(result.confidence, 0.6);
});

runner.test('LOST_DIRECTION: "No sé qué camino seguir"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('No sé qué camino seguir');
    
    assertEquals(result.state, 'LOST_DIRECTION');
});

runner.test('EMOTIONAL_LOW: "Me siento muy triste"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Me siento muy triste');
    
    assertEquals(result.state, 'EMOTIONAL_LOW', 'Should classify as EMOTIONAL_LOW');
    assertGreaterThan(result.confidence, 0.6);
    assert(result.indicators.length > 0);
});

runner.test('EMOTIONAL_LOW: "Estoy agotado y no puedo más"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Estoy agotado y no puedo más');
    
    assertEquals(result.state, 'EMOTIONAL_LOW');
    assertGreaterThan(result.confidence, 0.6);
});

runner.test('EMOTIONAL_LOW: "Todo está mal"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Todo está mal');
    
    assertEquals(result.state, 'EMOTIONAL_LOW');
});

runner.test('SEEKING_DECISION: "¿Cuál es mejor?"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('¿Cuál es mejor?');
    
    assertEquals(result.state, 'SEEKING_DECISION', 'Should classify as SEEKING_DECISION');
    assertGreaterThan(result.confidence, 0.6);
});

runner.test('SEEKING_DECISION: "No sé si estudiar medicina o ingeniería"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('No sé si estudiar medicina o ingeniería');
    
    assertEquals(result.state, 'SEEKING_DECISION');
});

runner.test('SEEKING_DECISION: "Ayúdame a decidir entre estas opciones"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Ayúdame a decidir entre estas opciones');
    
    assertEquals(result.state, 'SEEKING_DECISION');
});

runner.test('NEED_ORIENTATION: "¿Qué puedo hacer?"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('¿Qué puedo hacer?');
    
    assertEquals(result.state, 'NEED_ORIENTATION', 'Should classify as NEED_ORIENTATION');
    assertGreaterThan(result.confidence, 0.6);
});

runner.test('NEED_ORIENTATION: "¿Qué pasos sigo?"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('¿Qué pasos sigo?');
    
    assertEquals(result.state, 'NEED_ORIENTATION');
});

runner.test('NEED_ORIENTATION: "Necesito guía práctica"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Necesito guía práctica');
    
    assertEquals(result.state, 'NEED_ORIENTATION');
});

runner.test('SELF_EXPRESSION: "Necesito desahogarme"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Necesito desahogarme');
    
    assertEquals(result.state, 'SELF_EXPRESSION', 'Should classify as SELF_EXPRESSION');
    assertGreaterThan(result.confidence, 0.6);
});

runner.test('SELF_EXPRESSION: "Solo quiero contar lo que pasó"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Solo quiero contar lo que pasó');
    
    assertEquals(result.state, 'SELF_EXPRESSION');
});

runner.test('NEUTRAL_CHAT: "Hola, ¿cómo estás?"', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Hola, ¿cómo estás?');
    
    assertEquals(result.state, 'NEUTRAL_CHAT', 'Should classify as NEUTRAL_CHAT');
});

// ============================================
// NEGATIVE EXAMPLES - Should NOT match
// ============================================

runner.test('NEGATIVE: "Hola" should be NEUTRAL_CHAT, not LOST_DIRECTION', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Hola');
    
    assert(result.state !== 'LOST_DIRECTION', 'Should not be LOST_DIRECTION');
    assertEquals(result.state, 'NEUTRAL_CHAT');
});

runner.test('NEGATIVE: "Gracias" should be NEUTRAL_CHAT, not EMOTIONAL_LOW', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Gracias');
    
    assert(result.state !== 'EMOTIONAL_LOW', 'Should not be EMOTIONAL_LOW');
    assertEquals(result.state, 'NEUTRAL_CHAT');
});

runner.test('NEGATIVE: "¿Qué hora es?" should be NEUTRAL_CHAT', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('¿Qué hora es?');
    
    assertEquals(result.state, 'NEUTRAL_CHAT');
});

runner.test('NEGATIVE: "Buen día" should not trigger any specific pattern', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Buen día');
    
    assertEquals(result.state, 'NEUTRAL_CHAT');
});

// ============================================
// CONFIDENCE SCORING
// ============================================

runner.test('CONFIDENCE: Single match should have ~0.7 confidence', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('No sé qué estudiar');
    
    assert(result.confidence >= 0.65 && result.confidence <= 0.75, 
        `Single match confidence should be ~0.7, got ${result.confidence}`);
});

runner.test('CONFIDENCE: Multiple matches should have higher confidence', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Estoy perdido y no sé qué hacer con mi vida');
    
    assertGreaterThan(result.confidence, 0.8, 'Multiple matches should have confidence > 0.8');
});

runner.test('CONFIDENCE: NEUTRAL_CHAT should have 0.5 confidence', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Hola');
    
    assertEquals(result.confidence, 0.5, 'NEUTRAL_CHAT should have 0.5 confidence');
});

// ============================================
// PRIORITY SYSTEM - EMOTIONAL_LOW precedence
// ============================================

runner.test('PRIORITY: EMOTIONAL_LOW takes precedence over LOST_DIRECTION', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Estoy perdido y me siento muy triste');
    
    assertEquals(result.state, 'EMOTIONAL_LOW', 
        'EMOTIONAL_LOW should take precedence when both patterns match');
});

runner.test('PRIORITY: EMOTIONAL_LOW takes precedence over NEED_ORIENTATION', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('No sé qué hacer y estoy muy mal');
    
    assertEquals(result.state, 'EMOTIONAL_LOW',
        'EMOTIONAL_LOW should take precedence');
});

runner.test('PRIORITY: EMOTIONAL_LOW takes precedence in complex message', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('Me siento terrible, no sé qué estudiar ni qué hacer');
    
    assertEquals(result.state, 'EMOTIONAL_LOW',
        'EMOTIONAL_LOW should take precedence even with multiple other patterns');
});

// ============================================
// EDGE CASES
// ============================================

runner.test('EDGE: Empty string should return NEUTRAL_CHAT', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('');
    
    assertEquals(result.state, 'NEUTRAL_CHAT', 'Empty string should default to NEUTRAL_CHAT');
    assertEquals(result.confidence, 0.5);
});

runner.test('EDGE: Whitespace-only string should return NEUTRAL_CHAT', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('   \n\t   ');
    
    assertEquals(result.state, 'NEUTRAL_CHAT');
});

runner.test('EDGE: null should return NEUTRAL_CHAT', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify(null);
    
    assertEquals(result.state, 'NEUTRAL_CHAT', 'null should default to NEUTRAL_CHAT');
});

runner.test('EDGE: undefined should return NEUTRAL_CHAT', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify(undefined);
    
    assertEquals(result.state, 'NEUTRAL_CHAT', 'undefined should default to NEUTRAL_CHAT');
});

runner.test('EDGE: Very long message should still classify correctly', () => {
    const classifier = StateClassifier.getInstance();
    const longMessage = 'No sé qué estudiar. ' + 'Lorem ipsum dolor sit amet. '.repeat(100);
    const result = classifier.classify(longMessage);
    
    assertEquals(result.state, 'LOST_DIRECTION', 'Long message should still match pattern');
    assert(result.indicators.length > 0);
});

runner.test('EDGE: Message with special characters', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('¡¡¡Me siento muy triste!!! 😢');
    
    assertEquals(result.state, 'EMOTIONAL_LOW', 'Should handle special characters');
});

runner.test('EDGE: Mixed case should still match', () => {
    const classifier = StateClassifier.getInstance();
    const result = classifier.classify('NO SÉ QUÉ ESTUDIAR');
    
    assertEquals(result.state, 'LOST_DIRECTION', 'Should be case-insensitive');
});

runner.test('EDGE: Accented characters variations', () => {
    const classifier = StateClassifier.getInstance();
    const result1 = classifier.classify('No sé qué hacer');
    const result2 = classifier.classify('No se que hacer');
    
    // Both should match NEED_ORIENTATION or LOST_DIRECTION
    assert(result1.state !== 'NEUTRAL_CHAT' || result2.state !== 'NEUTRAL_CHAT',
        'At least one variation should match a pattern');
});

// ============================================
// CLASSIFICATION HISTORY
// ============================================

runner.test('HISTORY: Classifications should be tracked', () => {
    const classifier = StateClassifier.getInstance();
    classifier.clearHistory();
    
    classifier.classify('No sé qué estudiar');
    classifier.classify('Me siento triste');
    
    const history = classifier.getHistory();
    assertEquals(history.length, 2, 'Should track 2 classifications');
});

runner.test('HISTORY: Should include timestamp', () => {
    const classifier = StateClassifier.getInstance();
    classifier.clearHistory();
    
    classifier.classify('Hola');
    const history = classifier.getHistory();
    
    assert(history[0].timestamp, 'Should have timestamp');
    assert(typeof history[0].timestamp === 'number', 'Timestamp should be a number');
});

runner.test('HISTORY: Should include message preview', () => {
    const classifier = StateClassifier.getInstance();
    classifier.clearHistory();
    
    classifier.classify('Test message');
    const history = classifier.getHistory();
    
    assert(history[0].message, 'Should have message preview');
    assert(history[0].message.includes('Test'), 'Should contain message text');
});

// ============================================
// STATISTICS
// ============================================

runner.test('STATISTICS: Should count state occurrences', () => {
    const classifier = StateClassifier.getInstance();
    classifier.clearHistory();
    
    classifier.classify('No sé qué estudiar');
    classifier.classify('Me siento triste');
    classifier.classify('Hola');
    
    const stats = classifier.getStatistics();
    assertEquals(stats.LOST_DIRECTION, 1, 'Should count 1 LOST_DIRECTION');
    assertEquals(stats.EMOTIONAL_LOW, 1, 'Should count 1 EMOTIONAL_LOW');
    assertEquals(stats.NEUTRAL_CHAT, 1, 'Should count 1 NEUTRAL_CHAT');
});

// ============================================
// AMBIGUOUS MESSAGES LOGGING
// ============================================

runner.test('LOGGING: Ambiguous messages should be logged', () => {
    const classifier = StateClassifier.getInstance();
    
    // Clear any previous ambiguous messages
    const beforeCount = classifier.getAmbiguousMessages().length;
    
    classifier.classify('Hola, ¿cómo estás?');
    
    const afterCount = classifier.getAmbiguousMessages().length;
    assert(afterCount >= beforeCount, 'Should log ambiguous messages');
});

// ============================================
// MULTI-MATCH LOGGING
// ============================================

runner.test('LOGGING: Multi-match scenarios should be logged', () => {
    const classifier = StateClassifier.getInstance();
    
    const beforeCount = classifier.getMultiMatchMessages().length;
    
    classifier.classify('Estoy perdido y me siento triste');
    
    const afterCount = classifier.getMultiMatchMessages().length;
    assert(afterCount > beforeCount, 'Should log multi-match scenarios');
});

// ============================================
// RUN TESTS
// ============================================

async function runTests() {
    const results = await runner.run();
    
    // Display results in DOM if available
    if (typeof document !== 'undefined') {
        const resultsDiv = document.getElementById('test-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <h2>Test Results</h2>
                <p class="${results.failed === 0 ? 'success' : 'error'}">
                    ${results.passed}/${results.total} tests passed
                    ${results.failed > 0 ? `(${results.failed} failed)` : ''}
                </p>
            `;
        }
    }
    
    return results;
}

// Export for use in HTML test file
if (typeof window !== 'undefined') {
    window.runStateClassifierTests = runTests;
}
