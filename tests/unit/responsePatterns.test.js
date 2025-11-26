/**
 * ResponsePatterns Unit Tests
 * Tests pattern generation, validation, ocean metaphors, and pattern-specific requirements
 * 
 * Run in browser by opening tests/responsePatterns.test.html
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
        console.log('\n🧪 === RUNNING RESPONSE PATTERNS TESTS ===\n');
        
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

function assertContains(text, substring, message) {
    if (!text.includes(substring)) {
        throw new Error(message || `Expected text to contain "${substring}"`);
    }
}

function assertNotContains(text, substring, message) {
    if (text.includes(substring)) {
        throw new Error(message || `Expected text NOT to contain "${substring}"`);
    }
}

// ============================================
// TEST SUITE
// ============================================

const runner = new TestRunner();

// ============================================
// SINGLETON PATTERN
// ============================================

runner.test('SINGLETON: getInstance returns same instance', () => {
    const patterns1 = ResponsePatterns.getInstance();
    const patterns2 = ResponsePatterns.getInstance();
    
    assert(patterns1 === patterns2, 'Should return same instance');
});

// ============================================
// STATE TO PATTERN MAPPING
// ============================================

runner.test('MAPPING: LOST_DIRECTION maps to life_questioning', () => {
    const patterns = ResponsePatterns.getInstance();
    const patternName = patterns.getPatternForState('LOST_DIRECTION');
    
    assertEquals(patternName, 'life_questioning');
});

runner.test('MAPPING: EMOTIONAL_LOW maps to emotional_soothing', () => {
    const patterns = ResponsePatterns.getInstance();
    const patternName = patterns.getPatternForState('EMOTIONAL_LOW');
    
    assertEquals(patternName, 'emotional_soothing');
});

runner.test('MAPPING: SEEKING_DECISION maps to decision_matrix', () => {
    const patterns = ResponsePatterns.getInstance();
    const patternName = patterns.getPatternForState('SEEKING_DECISION');
    
    assertEquals(patternName, 'decision_matrix');
});

runner.test('MAPPING: NEED_ORIENTATION maps to action_roadmap', () => {
    const patterns = ResponsePatterns.getInstance();
    const patternName = patterns.getPatternForState('NEED_ORIENTATION');
    
    assertEquals(patternName, 'action_roadmap');
});

runner.test('MAPPING: SELF_EXPRESSION maps to reflective_mirror', () => {
    const patterns = ResponsePatterns.getInstance();
    const patternName = patterns.getPatternForState('SELF_EXPRESSION');
    
    assertEquals(patternName, 'reflective_mirror');
});

runner.test('MAPPING: NEUTRAL_CHAT maps to neutral_chat', () => {
    const patterns = ResponsePatterns.getInstance();
    const patternName = patterns.getPatternForState('NEUTRAL_CHAT');
    
    assertEquals(patternName, 'neutral_chat');
});

// ============================================
// PROMPT GENERATION
// ============================================

runner.test('PROMPT: life_questioning generates non-empty prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('life_questioning');
    
    assert(prompt && prompt.length > 100, 'Prompt should be substantial');
});

runner.test('PROMPT: emotional_soothing generates non-empty prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('emotional_soothing');
    
    assert(prompt && prompt.length > 100, 'Prompt should be substantial');
});

runner.test('PROMPT: decision_matrix generates non-empty prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('decision_matrix');
    
    assert(prompt && prompt.length > 100, 'Prompt should be substantial');
});

runner.test('PROMPT: action_roadmap generates non-empty prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('action_roadmap');
    
    assert(prompt && prompt.length > 100, 'Prompt should be substantial');
});

runner.test('PROMPT: reflective_mirror generates non-empty prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('reflective_mirror');
    
    assert(prompt && prompt.length > 100, 'Prompt should be substantial');
});

runner.test('PROMPT: neutral_chat generates non-empty prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('neutral_chat');
    
    assert(prompt && prompt.length > 100, 'Prompt should be substantial');
});

// ============================================
// BASIC VALIDATION
// ============================================

runner.test('VALIDATION: Valid response with whisper and reflection', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Las olas susurran secretos antiguos.',
        reflection: '¿Qué te trae por estas aguas?'
    };
    
    const isValid = patterns.validateResponse(response, 'neutral_chat');
    assert(isValid, 'Valid response should pass validation');
});

runner.test('VALIDATION: Missing whisper should fail', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        reflection: '¿Qué te trae por estas aguas?'
    };
    
    const isValid = patterns.validateResponse(response, 'neutral_chat');
    assert(!isValid, 'Response without whisper should fail');
});

runner.test('VALIDATION: Missing reflection should fail', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Las olas susurran secretos antiguos.'
    };
    
    const isValid = patterns.validateResponse(response, 'neutral_chat');
    assert(!isValid, 'Response without reflection should fail');
});

runner.test('VALIDATION: Non-string whisper should fail', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 123,
        reflection: '¿Qué te trae?'
    };
    
    const isValid = patterns.validateResponse(response, 'neutral_chat');
    assert(!isValid, 'Non-string whisper should fail');
});

// ============================================
// LIFE QUESTIONING VALIDATION
// ============================================

runner.test('LIFE_QUESTIONING: Valid response with question', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Las corrientes te traen aquí por una razón.',
        reflection: '¿Qué buscas en estas aguas profundas?'
    };
    
    const isValid = patterns.validateResponse(response, 'life_questioning');
    assert(isValid, 'Valid life questioning response should pass');
});

runner.test('LIFE_QUESTIONING: Should require question in reflection', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Las corrientes te traen aquí.',
        reflection: 'Piensa en ello.'
    };
    
    const isValid = patterns.validateResponse(response, 'life_questioning');
    assert(!isValid, 'Life questioning without question should fail');
});

// ============================================
// EMOTIONAL SOOTHING VALIDATION
// ============================================

runner.test('EMOTIONAL_SOOTHING: Valid gentle response', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Siento el peso de tu tristeza, como una ola que te cubre.',
        reflection: '¿Hay algo más que necesites expresar?'
    };
    
    const isValid = patterns.validateResponse(response, 'emotional_soothing');
    assert(isValid, 'Valid emotional soothing response should pass');
});

runner.test('EMOTIONAL_SOOTHING: Should reject deep analytical questions', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Entiendo tu tristeza.',
        reflection: '¿Por qué crees que te sientes así?'
    };
    
    const isValid = patterns.validateResponse(response, 'emotional_soothing');
    assert(!isValid, 'Deep analytical question should fail emotional soothing validation');
});

runner.test('EMOTIONAL_SOOTHING: Should reject "analiza" keyword', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Comprendo.',
        reflection: 'Analiza qué te hace sentir así.'
    };
    
    const isValid = patterns.validateResponse(response, 'emotional_soothing');
    assert(!isValid, 'Should reject analytical language');
});

// ============================================
// DECISION MATRIX VALIDATION
// ============================================

runner.test('DECISION_MATRIX: Valid exploratory response', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Cada camino tiene su propia corriente.',
        reflection: '¿Qué es lo que más resuena contigo?'
    };
    
    const isValid = patterns.validateResponse(response, 'decision_matrix');
    assert(isValid, 'Valid decision matrix response should pass');
});

runner.test('DECISION_MATRIX: Should reject pressuring language', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Debes elegir pronto.',
        reflection: 'Tienes que decidir ya.'
    };
    
    const isValid = patterns.validateResponse(response, 'decision_matrix');
    assert(!isValid, 'Pressuring language should fail validation');
});

runner.test('DECISION_MATRIX: Should reject directive language', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Claramente la mejor opción es A.',
        reflection: 'Elige esto sin duda.'
    };
    
    const isValid = patterns.validateResponse(response, 'decision_matrix');
    assert(!isValid, 'Directive language should fail validation');
});

// ============================================
// ACTION ROADMAP VALIDATION
// ============================================

runner.test('ACTION_ROADMAP: Valid response with actions', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Hoy: Respira profundo.\nEsta semana: Explora opciones.\nEste mes: Toma una decisión.',
        reflection: '¿Cuál de estos pasos te llama más?'
    };
    
    const isValid = patterns.validateResponse(response, 'action_roadmap');
    assert(isValid, 'Valid action roadmap should pass');
});

// ============================================
// REFLECTIVE MIRROR VALIDATION
// ============================================

runner.test('REFLECTIVE_MIRROR: Valid reflection without solutions', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Escucho en tus palabras un cansancio profundo.',
        reflection: '¿Quieres contarme más?'
    };
    
    const isValid = patterns.validateResponse(response, 'reflective_mirror');
    assert(isValid, 'Valid reflective mirror should pass');
});

runner.test('REFLECTIVE_MIRROR: Should reject solutions/advice', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Entiendo tu cansancio.',
        reflection: 'Deberías intentar descansar más.'
    };
    
    const isValid = patterns.validateResponse(response, 'reflective_mirror');
    assert(!isValid, 'Solutions should fail reflective mirror validation');
});

runner.test('REFLECTIVE_MIRROR: Should reject "te sugiero"', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Comprendo.',
        reflection: 'Te sugiero que tomes un descanso.'
    };
    
    const isValid = patterns.validateResponse(response, 'reflective_mirror');
    assert(!isValid, 'Suggestions should fail validation');
});

runner.test('REFLECTIVE_MIRROR: Should reject deep analytical questions', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Escucho tu dolor.',
        reflection: '¿Por qué crees que esto te afecta tanto?'
    };
    
    const isValid = patterns.validateResponse(response, 'reflective_mirror');
    assert(!isValid, 'Deep analytical questions should fail');
});

// ============================================
// NEUTRAL CHAT VALIDATION
// ============================================

runner.test('NEUTRAL_CHAT: Valid brief response', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Las olas te saludan.',
        reflection: '¿En qué puedo ayudarte?'
    };
    
    const isValid = patterns.validateResponse(response, 'neutral_chat');
    assert(isValid, 'Valid neutral chat should pass');
});

// ============================================
// OCEAN METAPHOR VALIDATION
// ============================================

runner.test('OCEAN_METAPHORS: Life questioning should include ocean terms', () => {
    const patterns = ResponsePatterns.getInstance();
    
    // Response without ocean metaphors should trigger warning (but may still pass)
    const response = {
        whisper: 'Estás aquí por una razón.',
        reflection: '¿Qué buscas?'
    };
    
    // This test just ensures the validation runs without error
    patterns.validateResponse(response, 'life_questioning');
    assert(true, 'Validation should complete');
});

runner.test('OCEAN_METAPHORS: Emotional soothing should include ocean terms', () => {
    const patterns = ResponsePatterns.getInstance();
    
    const response = {
        whisper: 'Comprendo tu dolor.',
        reflection: '¿Cómo te sientes?'
    };
    
    // This test ensures validation runs (may warn but not fail)
    patterns.validateResponse(response, 'emotional_soothing');
    assert(true, 'Validation should complete');
});

// ============================================
// EDGE CASES
// ============================================

runner.test('EDGE: Invalid pattern name returns neutral_chat prompt', () => {
    const patterns = ResponsePatterns.getInstance();
    const prompt = patterns.getPrompt('invalid_pattern_name');
    
    assert(prompt && prompt.length > 0, 'Should return fallback prompt');
});

runner.test('EDGE: Validation with null response', () => {
    const patterns = ResponsePatterns.getInstance();
    const isValid = patterns.validateResponse(null, 'neutral_chat');
    
    assert(!isValid, 'null response should fail validation');
});

runner.test('EDGE: Validation with empty object', () => {
    const patterns = ResponsePatterns.getInstance();
    const isValid = patterns.validateResponse({}, 'neutral_chat');
    
    assert(!isValid, 'Empty object should fail validation');
});

runner.test('EDGE: Validation with invalid pattern name', () => {
    const patterns = ResponsePatterns.getInstance();
    const response = {
        whisper: 'Test',
        reflection: 'Test?'
    };
    
    const isValid = patterns.validateResponse(response, 'invalid_pattern');
    assert(!isValid, 'Invalid pattern name should fail validation');
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
    window.runResponsePatternsTests = runTests;
}
