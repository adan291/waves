/**
 * AdaptiveAssistance Integration Tests
 * Tests state tracking, history management, state transitions, and output structuring
 * 
 * Run in browser by opening tests/adaptiveAssistance.test.html
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
        console.log('\n🧪 === RUNNING ADAPTIVE ASSISTANCE TESTS ===\n');
        
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

// ============================================
// TEST SUITE
// ============================================

const runner = new TestRunner();

// ============================================
// INITIALIZATION
// ============================================

runner.test('INIT: Can create AdaptiveAssistance instance', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    assert(adaptive, 'Should create instance');
    assert(Array.isArray(adaptive.stateHistory), 'Should have stateHistory array');
});

runner.test('INIT: Requires StateClassifier', () => {
    const patterns = ResponsePatterns.getInstance();
    
    try {
        new AdaptiveAssistance(null, patterns);
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('StateClassifier'), 'Should require StateClassifier');
    }
});

runner.test('INIT: Requires ResponsePatterns', () => {
    const classifier = StateClassifier.getInstance();
    
    try {
        new AdaptiveAssistance(classifier, null);
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('ResponsePatterns'), 'Should require ResponsePatterns');
    }
});

runner.test('INIT: Singleton pattern works', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    
    const adaptive1 = AdaptiveAssistance.getInstance(classifier, patterns);
    const adaptive2 = AdaptiveAssistance.getInstance(classifier, patterns);
    
    assert(adaptive1 === adaptive2, 'Should return same instance');
});

// ============================================
// STATE TRACKING
// ============================================

runner.test('TRACKING: State history is tracked', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    const classification = classifier.classify('No sé qué estudiar');
    adaptive.trackStateChange(classification, 'No sé qué estudiar');
    
    const history = adaptive.getStateHistory();
    assertEquals(history.length, 1, 'Should have 1 entry in history');
});

runner.test('TRACKING: History includes state and timestamp', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    const classification = classifier.classify('Me siento triste');
    adaptive.trackStateChange(classification, 'Me siento triste');
    
    const history = adaptive.getStateHistory();
    const entry = history[0];
    
    assert(entry.state, 'Should have state');
    assert(entry.timestamp, 'Should have timestamp');
    assert(entry.confidence, 'Should have confidence');
    assert(entry.emotionalTone, 'Should have emotionalTone');
});

runner.test('TRACKING: History includes message preview', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    const message = 'Test message for history';
    const classification = classifier.classify(message);
    adaptive.trackStateChange(classification, message);
    
    const history = adaptive.getStateHistory();
    assert(history[0].message, 'Should have message preview');
    assert(history[0].message.includes('Test'), 'Should contain message text');
});

runner.test('TRACKING: History respects maxStateHistory limit', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns, { maxStateHistory: 5 });
    
    adaptive.clearStateHistory();
    
    // Add 10 entries
    for (let i = 0; i < 10; i++) {
        const classification = classifier.classify('Test message ' + i);
        adaptive.trackStateChange(classification, 'Test message ' + i);
    }
    
    const history = adaptive.getStateHistory();
    assertEquals(history.length, 5, 'Should respect maxStateHistory limit');
});

// ============================================
// STATE TRANSITIONS
// ============================================

runner.test('TRANSITION: Detects state changes', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    // First state
    const classification1 = classifier.classify('Hola');
    adaptive.trackStateChange(classification1, 'Hola');
    
    // Second state (different)
    const classification2 = classifier.classify('No sé qué estudiar');
    adaptive.trackStateChange(classification2, 'No sé qué estudiar');
    
    const history = adaptive.getStateHistory();
    assert(history[1].isTransition, 'Should mark as transition');
    assertEquals(history[1].transitionFrom, 'NEUTRAL_CHAT', 'Should track previous state');
});

runner.test('TRANSITION: Validates EMOTIONAL_LOW transitions', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    // Start with EMOTIONAL_LOW
    const classification1 = classifier.classify('Me siento muy triste');
    adaptive.trackStateChange(classification1, 'Me siento muy triste');
    
    // Immediately transition to LOST_DIRECTION
    const classification2 = classifier.classify('No sé qué estudiar');
    adaptive.trackStateChange(classification2, 'No sé qué estudiar');
    
    const transitions = adaptive.getTransitionPatterns();
    assert(transitions.length > 0, 'Should log transition');
});

runner.test('TRANSITION: Detects rapid state changes', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    // Quick succession of state changes
    const classification1 = classifier.classify('No sé qué estudiar');
    adaptive.trackStateChange(classification1, 'No sé qué estudiar');
    
    const classification2 = classifier.classify('Me siento triste');
    adaptive.trackStateChange(classification2, 'Me siento triste');
    
    const transitions = adaptive.getTransitionPatterns();
    // Should have logged the transition
    assert(transitions.length > 0, 'Should log transitions');
});

// ============================================
// OUTPUT STRUCTURING
// ============================================

runner.test('OUTPUT: structureOutput creates correct format', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const responseText = JSON.stringify({
        whisper: 'Las olas susurran.',
        reflection: '¿Qué resuena en ti?'
    });
    
    const classification = {
        state: 'NEUTRAL_CHAT',
        confidence: 0.7,
        emotionalTone: 'neutral'
    };
    
    const output = adaptive.structureOutput(responseText, classification);
    
    assertEquals(output.persona, 'kiro', 'Should have persona: kiro');
    assertEquals(output.mode, 'NEUTRAL_CHAT', 'Should have correct mode');
    assertEquals(output.action, 'neutral_chat', 'Should have correct action');
    assert(output.text, 'Should have text object');
    assert(output.text.whisper, 'Should have whisper');
    assert(output.text.reflection, 'Should have reflection');
    assert(output.next_step, 'Should have next_step');
});

runner.test('OUTPUT: getActionName maps states correctly', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    assertEquals(adaptive.getActionName('LOST_DIRECTION'), 'life_questioning');
    assertEquals(adaptive.getActionName('EMOTIONAL_LOW'), 'emotional_soothing');
    assertEquals(adaptive.getActionName('SEEKING_DECISION'), 'decision_matrix');
    assertEquals(adaptive.getActionName('NEED_ORIENTATION'), 'action_roadmap');
    assertEquals(adaptive.getActionName('SELF_EXPRESSION'), 'reflective_mirror');
    assertEquals(adaptive.getActionName('NEUTRAL_CHAT'), 'neutral_chat');
});

runner.test('OUTPUT: determineNextStep provides guidance', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const nextStep = adaptive.determineNextStep('LOST_DIRECTION', {});
    assert(nextStep && nextStep.length > 0, 'Should provide next step guidance');
    assert(nextStep.includes('Life Questioning'), 'Should mention Life Questioning for LOST_DIRECTION');
});

// ============================================
// RESPONSE PARSING
// ============================================

runner.test('PARSING: parseResponse handles valid JSON', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const responseText = JSON.stringify({
        whisper: 'Test whisper',
        reflection: 'Test reflection?'
    });
    
    const parsed = adaptive.parseResponse(responseText);
    assertEquals(parsed.whisper, 'Test whisper');
    assertEquals(parsed.reflection, 'Test reflection?');
});

runner.test('PARSING: lenientParse handles markdown JSON', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const responseText = '```json\n{"whisper": "Test", "reflection": "Test?"}\n```';
    
    const parsed = adaptive.parseResponse(responseText);
    assertEquals(parsed.whisper, 'Test');
    assertEquals(parsed.reflection, 'Test?');
});

runner.test('PARSING: lenientParse handles plain text fallback', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const responseText = 'Line 1\nLine 2\nLine 3';
    
    const parsed = adaptive.parseResponse(responseText);
    assert(parsed.whisper, 'Should have whisper');
    assert(parsed.reflection, 'Should have reflection');
});

// ============================================
// RESPONSE VALIDATION
// ============================================

runner.test('VALIDATION: validateResponseStructure accepts valid response', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const response = {
        whisper: 'Test whisper',
        reflection: 'Test reflection?'
    };
    
    const validation = adaptive.validateResponseStructure(response);
    assert(validation.valid, 'Should validate valid response');
});

runner.test('VALIDATION: validateResponseStructure rejects missing whisper', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const response = {
        reflection: 'Test reflection?'
    };
    
    const validation = adaptive.validateResponseStructure(response);
    assert(!validation.valid, 'Should reject missing whisper');
    assert(validation.reason, 'Should provide reason');
});

runner.test('VALIDATION: validateResponseStructure rejects empty whisper', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const response = {
        whisper: '   ',
        reflection: 'Test reflection?'
    };
    
    const validation = adaptive.validateResponseStructure(response);
    assert(!validation.valid, 'Should reject empty whisper');
});

// ============================================
// ERROR HANDLING
// ============================================

runner.test('ERROR: createFallbackOutput provides valid output', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const classification = {
        state: 'NEUTRAL_CHAT',
        confidence: 0.5
    };
    
    const fallback = adaptive.createFallbackOutput(classification);
    
    assertEquals(fallback.persona, 'kiro');
    assert(fallback.text.whisper, 'Should have whisper');
    assert(fallback.text.reflection, 'Should have reflection');
});

runner.test('ERROR: createErrorResponse provides ocean-themed message', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const error = new Error('Test error');
    const errorResponse = adaptive.createErrorResponse(error);
    
    assert(errorResponse, 'Should create error response');
    assert(typeof errorResponse === 'string', 'Should be string');
    
    // Should be valid JSON
    const parsed = JSON.parse(errorResponse);
    assert(parsed.whisper, 'Should have whisper');
    assert(parsed.reflection, 'Should have reflection');
});

// ============================================
// STATISTICS
// ============================================

runner.test('STATISTICS: getStatistics counts states', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    const classification1 = classifier.classify('No sé qué estudiar');
    adaptive.trackStateChange(classification1, 'No sé qué estudiar');
    
    const classification2 = classifier.classify('Me siento triste');
    adaptive.trackStateChange(classification2, 'Me siento triste');
    
    const stats = adaptive.getStatistics();
    assert(stats.LOST_DIRECTION >= 1, 'Should count LOST_DIRECTION');
    assert(stats.EMOTIONAL_LOW >= 1, 'Should count EMOTIONAL_LOW');
});

// ============================================
// CONFIGURATION
// ============================================

runner.test('CONFIG: Accepts custom configuration', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns, {
        enableStateTracking: false,
        maxStateHistory: 10
    });
    
    assert(adaptive.config, 'Should have config');
    assertEquals(adaptive.config.enableStateTracking, false);
    assertEquals(adaptive.config.maxStateHistory, 10);
});

runner.test('CONFIG: Validates configuration values', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    
    // Invalid confidenceThreshold should use default
    const adaptive = new AdaptiveAssistance(classifier, patterns, {
        confidenceThreshold: 1.5 // Invalid (> 1)
    });
    
    assert(adaptive.config.confidenceThreshold <= 1, 'Should use valid threshold');
});

// ============================================
// LOGGING
// ============================================

runner.test('LOGGING: Validation failures are logged', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    const classification = { state: 'NEUTRAL_CHAT' };
    adaptive.logValidationFailure('Invalid response', 'Test reason', classification);
    
    const failures = adaptive.getValidationFailures();
    assert(failures.length > 0, 'Should log validation failures');
});

runner.test('LOGGING: Transition patterns are logged', () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.clearStateHistory();
    
    // Create a transition
    const classification1 = classifier.classify('Hola');
    adaptive.trackStateChange(classification1, 'Hola');
    
    const classification2 = classifier.classify('No sé qué estudiar');
    adaptive.trackStateChange(classification2, 'No sé qué estudiar');
    
    const transitions = adaptive.getTransitionPatterns();
    assert(transitions.length > 0, 'Should log transitions');
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
    window.runAdaptiveAssistanceTests = runTests;
}
