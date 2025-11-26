/**
 * End-to-End Integration Tests
 * Tests complete flow from message to output, all 6 states, state transitions, and backward compatibility
 * 
 * Run in browser by opening tests/integration.test.html
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
        console.log('\n🧪 === RUNNING END-TO-END INTEGRATION TESTS ===\n');
        
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

// ============================================
// MOCK GEMINI SERVICE
// ============================================

class MockGeminiService {
    static instance = null;

    static getInstance() {
        if (!MockGeminiService.instance) {
            MockGeminiService.instance = new MockGeminiService();
        }
        return MockGeminiService.instance;
    }

    async sendMessage(history, systemPrompt) {
        // Return mock response based on system prompt content
        if (systemPrompt.includes('Life Questioning')) {
            return JSON.stringify({
                whisper: 'Las corrientes te traen aquí por una razón profunda.',
                reflection: '¿Qué es lo que realmente buscas en estas aguas?'
            });
        } else if (systemPrompt.includes('Emotional Soothing')) {
            return JSON.stringify({
                whisper: 'Siento el peso de tus emociones, como olas que vienen y van.',
                reflection: '¿Hay algo más que necesites expresar?'
            });
        } else if (systemPrompt.includes('Decision Matrix')) {
            return JSON.stringify({
                whisper: 'Cada camino tiene su propia corriente y destino.',
                reflection: '¿Qué es lo que más resuena con tu corazón?'
            });
        } else if (systemPrompt.includes('Action Roadmap')) {
            return JSON.stringify({
                whisper: 'Hoy: Respira profundo.\nEsta semana: Explora opciones.\nEste mes: Toma acción.',
                reflection: '¿Cuál de estos pasos te llama primero?'
            });
        } else if (systemPrompt.includes('Reflective Mirror')) {
            return JSON.stringify({
                whisper: 'Escucho en tus palabras una necesidad de ser oído.',
                reflection: '¿Quieres contarme más sobre eso?'
            });
        } else {
            return JSON.stringify({
                whisper: 'Las olas te saludan con calma.',
                reflection: '¿En qué puedo acompañarte hoy?'
            });
        }
    }
}

// ============================================
// TEST SUITE
// ============================================

const runner = new TestRunner();

// ============================================
// COMPLETE FLOW TESTS
// ============================================

runner.test('E2E: Complete flow from message to output', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    // Mock GeminiService
    adaptive.geminiService = MockGeminiService.getInstance();
    
    const message = 'No sé qué estudiar';
    const context = { history: [] };
    
    const output = await adaptive.process(message, context);
    
    // Verify output structure
    assertEquals(output.persona, 'kiro', 'Should have persona: kiro');
    assert(output.mode, 'Should have mode');
    assert(output.action, 'Should have action');
    assert(output.text, 'Should have text object');
    assert(output.text.whisper, 'Should have whisper');
    assert(output.text.reflection, 'Should have reflection');
    assert(output.next_step, 'Should have next_step');
});

// ============================================
// STATE-SPECIFIC E2E TESTS
// ============================================

runner.test('E2E: LOST_DIRECTION state end-to-end', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const message = 'No sé qué estudiar, estoy perdido';
    const output = await adaptive.process(message, {});
    
    assertEquals(output.mode, 'LOST_DIRECTION', 'Should classify as LOST_DIRECTION');
    assertEquals(output.action, 'life_questioning', 'Should use life_questioning pattern');
    assert(output.text.reflection.includes('?'), 'Should include question');
});

runner.test('E2E: EMOTIONAL_LOW state end-to-end', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const message = 'Me siento muy triste y solo';
    const output = await adaptive.process(message, {});
    
    assertEquals(output.mode, 'EMOTIONAL_LOW', 'Should classify as EMOTIONAL_LOW');
    assertEquals(output.action, 'emotional_soothing', 'Should use emotional_soothing pattern');
});

runner.test('E2E: SEEKING_DECISION state end-to-end', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const message = '¿Cuál es mejor, medicina o ingeniería?';
    const output = await adaptive.process(message, {});
    
    assertEquals(output.mode, 'SEEKING_DECISION', 'Should classify as SEEKING_DECISION');
    assertEquals(output.action, 'decision_matrix', 'Should use decision_matrix pattern');
});

runner.test('E2E: NEED_ORIENTATION state end-to-end', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const message = '¿Qué pasos puedo seguir?';
    const output = await adaptive.process(message, {});
    
    assertEquals(output.mode, 'NEED_ORIENTATION', 'Should classify as NEED_ORIENTATION');
    assertEquals(output.action, 'action_roadmap', 'Should use action_roadmap pattern');
});

runner.test('E2E: SELF_EXPRESSION state end-to-end', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const message = 'Solo necesito desahogarme';
    const output = await adaptive.process(message, {});
    
    assertEquals(output.mode, 'SELF_EXPRESSION', 'Should classify as SELF_EXPRESSION');
    assertEquals(output.action, 'reflective_mirror', 'Should use reflective_mirror pattern');
});

runner.test('E2E: NEUTRAL_CHAT state end-to-end', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const message = 'Hola, ¿cómo estás?';
    const output = await adaptive.process(message, {});
    
    assertEquals(output.mode, 'NEUTRAL_CHAT', 'Should classify as NEUTRAL_CHAT');
    assertEquals(output.action, 'neutral_chat', 'Should use neutral_chat pattern');
});

// ============================================
// STATE TRANSITION E2E TESTS
// ============================================

runner.test('E2E: EMOTIONAL_LOW → LOST_DIRECTION transition', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    // First message: EMOTIONAL_LOW
    const output1 = await adaptive.process('Me siento muy triste', {});
    assertEquals(output1.mode, 'EMOTIONAL_LOW', 'First message should be EMOTIONAL_LOW');
    
    // Second message: LOST_DIRECTION
    const output2 = await adaptive.process('No sé qué estudiar', {});
    assertEquals(output2.mode, 'LOST_DIRECTION', 'Second message should be LOST_DIRECTION');
    
    // Verify transition was logged
    const history = adaptive.getStateHistory();
    assert(history.length >= 2, 'Should have at least 2 history entries');
    assert(history[1].isTransition, 'Should mark as transition');
});

runner.test('E2E: NEUTRAL_CHAT → EMOTIONAL_LOW transition', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    // First message: NEUTRAL_CHAT
    const output1 = await adaptive.process('Hola', {});
    assertEquals(output1.mode, 'NEUTRAL_CHAT');
    
    // Second message: EMOTIONAL_LOW
    const output2 = await adaptive.process('Estoy muy mal', {});
    assertEquals(output2.mode, 'EMOTIONAL_LOW');
    
    const history = adaptive.getStateHistory();
    assert(history[1].isTransition, 'Should detect transition');
});

runner.test('E2E: LOST_DIRECTION → NEED_ORIENTATION transition', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    // First: LOST_DIRECTION
    await adaptive.process('No sé qué hacer con mi vida', {});
    
    // Then: NEED_ORIENTATION
    const output = await adaptive.process('¿Qué pasos sigo?', {});
    assertEquals(output.mode, 'NEED_ORIENTATION');
    
    const history = adaptive.getStateHistory();
    assert(history.length >= 2, 'Should track both states');
});

// ============================================
// CONVERSATION CONTINUITY
// ============================================

runner.test('E2E: Conversation continuity across states', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const context = { history: [] };
    
    // Message 1
    const output1 = await adaptive.process('Hola', context);
    context.history.push({ role: 'user', content: 'Hola' });
    context.history.push({ role: 'assistant', content: output1.text.whisper });
    
    // Message 2
    const output2 = await adaptive.process('No sé qué estudiar', context);
    context.history.push({ role: 'user', content: 'No sé qué estudiar' });
    context.history.push({ role: 'assistant', content: output2.text.whisper });
    
    // Message 3
    const output3 = await adaptive.process('Me siento perdido', context);
    
    // Verify history is maintained
    assert(context.history.length >= 4, 'Should maintain conversation history');
    
    // Verify state history
    const stateHistory = adaptive.getStateHistory();
    assert(stateHistory.length >= 3, 'Should track all state changes');
});

runner.test('E2E: Context is passed through pipeline', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    
    const context = {
        history: [
            { role: 'user', content: 'Previous message' },
            { role: 'assistant', content: 'Previous response' }
        ],
        emotionalContext: {
            tone: 'confused',
            intensity: 0.7
        }
    };
    
    const output = await adaptive.process('No sé qué hacer', context);
    
    // Should successfully process with context
    assert(output, 'Should generate output with context');
    assert(output.text, 'Should have text');
});

// ============================================
// BACKWARD COMPATIBILITY
// ============================================

runner.test('COMPAT: Output format matches expected structure', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    
    const output = await adaptive.process('Test message', {});
    
    // Verify all required fields exist
    assert(output.persona, 'Should have persona field');
    assert(output.mode, 'Should have mode field');
    assert(output.action, 'Should have action field');
    assert(output.text, 'Should have text field');
    assert(output.text.whisper, 'Should have text.whisper field');
    assert(output.text.reflection, 'Should have text.reflection field');
    assert(output.next_step, 'Should have next_step field');
});

runner.test('COMPAT: Persona is always "kiro"', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    
    // Test multiple states
    const messages = [
        'Hola',
        'No sé qué estudiar',
        'Me siento triste',
        '¿Qué puedo hacer?'
    ];
    
    for (const message of messages) {
        const output = await adaptive.process(message, {});
        assertEquals(output.persona, 'kiro', `Persona should always be "kiro" for: ${message}`);
    }
});

runner.test('COMPAT: Text structure is consistent', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    
    const output = await adaptive.process('Test', {});
    
    // Text should be an object with whisper and reflection
    assert(typeof output.text === 'object', 'text should be an object');
    assert(typeof output.text.whisper === 'string', 'whisper should be a string');
    assert(typeof output.text.reflection === 'string', 'reflection should be a string');
});

// ============================================
// ERROR SCENARIOS
// ============================================

runner.test('E2E: Handles invalid message gracefully', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    
    // Empty message should still produce output
    const output = await adaptive.process('', {});
    
    assert(output, 'Should handle empty message');
    assertEquals(output.persona, 'kiro');
    assert(output.text.whisper, 'Should have whisper');
});

runner.test('E2E: Handles missing context gracefully', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    
    // No context provided
    const output = await adaptive.process('Test message');
    
    assert(output, 'Should handle missing context');
    assert(output.text, 'Should generate response');
});

// ============================================
// MULTI-MESSAGE SCENARIOS
// ============================================

runner.test('E2E: Multiple messages in sequence', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    const messages = [
        'Hola',
        'No sé qué estudiar',
        'Me siento confundido',
        '¿Qué pasos puedo seguir?',
        'Gracias'
    ];
    
    for (const message of messages) {
        const output = await adaptive.process(message, {});
        assert(output, `Should process: ${message}`);
        assert(output.text.whisper, 'Should have whisper');
    }
    
    const history = adaptive.getStateHistory();
    assertEquals(history.length, messages.length, 'Should track all messages');
});

runner.test('E2E: State changes are reflected in history', async () => {
    const classifier = StateClassifier.getInstance();
    const patterns = ResponsePatterns.getInstance();
    const adaptive = new AdaptiveAssistance(classifier, patterns);
    
    adaptive.geminiService = MockGeminiService.getInstance();
    adaptive.clearStateHistory();
    
    await adaptive.process('Hola', {});
    await adaptive.process('No sé qué estudiar', {});
    await adaptive.process('Me siento triste', {});
    
    const history = adaptive.getStateHistory();
    
    // Should have different states
    const states = history.map(entry => entry.state);
    const uniqueStates = [...new Set(states)];
    
    assert(uniqueStates.length > 1, 'Should have multiple different states');
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
    window.runIntegrationTests = runTests;
    window.MockGeminiService = MockGeminiService;
}
