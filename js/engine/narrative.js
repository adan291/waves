/**
 * Narrative Engine Module
 * Orchestrates scene generation and narrative flow
 * 
 * @module engine/narrative
 */

/**
 * Generate a complete scene
 * @param {string} userMessage - User's message
 * @param {Array} history - Conversation history
 * @param {Object} geminiService - GeminiService instance
 * @returns {Promise<Object>} Generated scene
 * 
 * @example
 * const scene = await generateScene(message, history, geminiService);
 * console.log(scene.whisper);
 */
async function generateScene(userMessage, history, geminiService) {
    if (!userMessage || !geminiService) {
        console.error('generateScene: Missing required parameters');
        return null;
    }
    
    try {
        // 1. Analyze emotional tone
        const emotionalAnalysis = typeof analyzeEmotionalTone !== 'undefined'
            ? analyzeEmotionalTone(userMessage)
            : { tone: 'neutral', intensity: 0.5, keywords: [], emotions: [] };
        
        // 2. Get current persona
        const persona = typeof getCurrentPersona !== 'undefined'
            ? getCurrentPersona()
            : 'narrador';
        
        console.log(`🎭 Generating scene with ${persona}...`);
        
        // 3. Get appropriate system prompt (will be implemented in prompts_master.js)
        const systemPrompt = `You are ${persona}. Respond in JSON format.`;
        
        // 4. Call Gemini API
        const responseText = await geminiService.sendMessage(history, 'spark', systemPrompt);
        
        // 5. Parse response
        const parsed = typeof parseResponse !== 'undefined'
            ? parseResponse(responseText)
            : { whisper: responseText, reflection: '' };
        
        // 6. Split into components
        const components = splitIntoComponents(parsed, persona);
        
        // 7. Generate seed question
        const seedQuestion = generateSeedQuestion(emotionalAnalysis.tone);
        
        // 8. Add continuity trigger
        const scene = addContinuityTrigger({
            ...components,
            seedQuestion,
            emotionalTone: emotionalAnalysis,
            persona,
            timestamp: Date.now()
        });
        
        console.log('✅ Scene generated successfully');
        
        return scene;
        
    } catch (error) {
        console.error('Error generating scene:', error);
        return {
            whisper: 'Las olas encuentran resistencia...',
            wave: 'El océano necesita un momento para reorganizar sus corrientes.',
            seedQuestion: '¿Intentamos de nuevo?',
            persona: 'kiro',
            error: true
        };
    }
}

/**
 * Split response into whisper and wave components
 * @param {Object} parsed - Parsed response
 * @param {string} persona - Current persona
 * @returns {Object} Components with whisper and wave
 * 
 * @example
 * const components = splitIntoComponents(parsed, 'narrador');
 */
function splitIntoComponents(parsed, persona) {
    if (!parsed) {
        return {
            whisper: '',
            wave: ''
        };
    }
    
    if (persona === 'narrador') {
        // Narrador format: scene + invitation
        return {
            whisper: parsed.scene || '',
            wave: parsed.invitation || '',
            kiroInstruction: parsed.kiro_instruction || ''
        };
    } else {
        // Kiro format: whisper + reflection
        return {
            whisper: parsed.whisper || '',
            wave: parsed.reflection || ''
        };
    }
}

/**
 * Generate seed question based on emotional tone
 * @param {string} emotionalTone - Detected emotional tone
 * @returns {string} Seed question
 * 
 * @example
 * const question = generateSeedQuestion('lonely');
 */
function generateSeedQuestion(emotionalTone) {
    const questions = {
        lonely: [
            '¿Qué voz del océano necesitas escuchar ahora?',
            '¿Qué ola podría acompañarte en este momento?',
            '¿Qué reflejo del agua te habla?'
        ],
        confused: [
            '¿Qué corriente sientes bajo tus pies?',
            '¿Hacia dónde te llama la marea?',
            '¿Qué brújula interior puedes consultar?'
        ],
        anxious: [
            '¿Qué calma el océano puede ofrecerte?',
            '¿Qué ritmo de las olas te tranquiliza?',
            '¿Qué respiración del mar necesitas?'
        ],
        sad: [
            '¿Qué lágrima del océano reconoce la tuya?',
            '¿Qué profundidad te acoge?',
            '¿Qué ola puede sostener tu dolor?'
        ],
        hopeful: [
            '¿Qué horizonte ves desde aquí?',
            '¿Qué luz danza sobre el agua?',
            '¿Qué promesa trae la marea?'
        ],
        calm: [
            '¿Qué silencio del océano resuena contigo?',
            '¿Qué quietud encuentras en las aguas?',
            '¿Qué paz refleja la superficie?'
        ],
        neutral: [
            '¿Qué resuena en ti con estas palabras?',
            '¿Qué te dice el océano ahora?',
            '¿Qué sientes al escuchar esto?'
        ]
    };
    
    const options = questions[emotionalTone] || questions.neutral;
    const randomIndex = Math.floor(Math.random() * options.length);
    
    return options[randomIndex];
}

/**
 * Add continuity trigger to scene
 * @param {Object} scene - Scene object
 * @returns {Object} Scene with trigger
 * 
 * @example
 * const sceneWithTrigger = addContinuityTrigger(scene);
 */
function addContinuityTrigger(scene) {
    if (!scene) {
        return scene;
    }
    
    // Add trigger based on persona
    if (scene.persona === 'narrador') {
        scene.trigger = '[KIRO: activa acompañamiento emocional]';
    } else {
        scene.trigger = '[GOOGLE: continuar narrativa]';
    }
    
    return scene;
}

/**
 * Parse narrative response (wrapper for parser module)
 * @param {string} responseText - Raw response text
 * @returns {Object} Parsed response
 * 
 * @example
 * const parsed = parseNarrativeResponse(responseText);
 */
function parseNarrativeResponse(responseText) {
    if (typeof parseResponse !== 'undefined') {
        return parseResponse(responseText);
    }
    
    // Fallback if parser not loaded
    return {
        whisper: responseText,
        reflection: '',
        persona: 'kiro'
    };
}

/**
 * Generate whisper text
 * @param {string} content - Content to transform
 * @returns {string} Whisper text
 * 
 * @example
 * const whisper = generateWhisper(content);
 */
function generateWhisper(content) {
    // This is a simple wrapper - actual generation happens via Gemini
    return content;
}

/**
 * Generate wave reflection text
 * @param {string} content - Content to transform
 * @returns {string} Wave reflection text
 * 
 * @example
 * const wave = generateWaveReflection(content);
 */
function generateWaveReflection(content) {
    // This is a simple wrapper - actual generation happens via Gemini
    return content;
}

// ============================================
// MANUAL TEST - Run in browser console
// ============================================

/**
 * Test function to verify narrative module
 * Run in browser console: testNarrativeModule()
 */
async function testNarrativeModule() {
    console.log('\n🧪 === TESTING NARRATIVE MODULE ===\n');
    
    // Test 1: Split components (narrador)
    console.log('Test 1: Split components (narrador)');
    const narradorParsed = {
        scene: 'La niebla se espesa...',
        invitation: 'La marea espera...',
        kiro_instruction: 'Ofrecer consuelo'
    };
    const comp1 = splitIntoComponents(narradorParsed, 'narrador');
    console.log('✅ Narrador components:', comp1);
    
    // Test 2: Split components (kiro)
    console.log('\nTest 2: Split components (kiro)');
    const kiroParsed = {
        whisper: 'El océano no olvida...',
        reflection: '¿Qué corriente sientes?'
    };
    const comp2 = splitIntoComponents(kiroParsed, 'kiro');
    console.log('✅ Kiro components:', comp2);
    
    // Test 3: Generate seed questions
    console.log('\nTest 3: Generate seed questions');
    const q1 = generateSeedQuestion('lonely', 'content');
    const q2 = generateSeedQuestion('confused', 'content');
    const q3 = generateSeedQuestion('calm', 'content');
    console.log('✅ Lonely question:', q1);
    console.log('✅ Confused question:', q2);
    console.log('✅ Calm question:', q3);
    
    // Test 4: Add continuity trigger
    console.log('\nTest 4: Add continuity trigger');
    const scene1 = addContinuityTrigger({ persona: 'narrador', whisper: 'test' });
    const scene2 = addContinuityTrigger({ persona: 'kiro', whisper: 'test' });
    console.log('✅ Narrador trigger:', scene1.trigger);
    console.log('✅ Kiro trigger:', scene2.trigger);
    
    // Test 5: Parse narrative response
    console.log('\nTest 5: Parse narrative response');
    const testJson = JSON.stringify({
        whisper: 'Test whisper',
        reflection: 'Test reflection'
    });
    const parsed = parseNarrativeResponse(testJson);
    console.log('✅ Parsed:', parsed);
    
    // Test 6: Generate scene (requires GeminiService)
    console.log('\nTest 6: Generate scene');
    if (typeof GeminiService !== 'undefined') {
        console.log('⚠️ GeminiService available but skipping API call in test');
        console.log('To test full scene generation, use:');
        console.log('  const service = new GeminiService();');
        console.log('  const scene = await generateScene("Hello", [], service);');
    } else {
        console.log('⚠️ GeminiService not loaded');
    }
    
    console.log('\n🎉 === NARRATIVE MODULE TEST COMPLETE ===\n');
}

// Auto-run test if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🌊 Narrative module loaded. Run testNarrativeModule() to test.');
}
