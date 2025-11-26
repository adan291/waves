/**
 * Life Questioning Engine
 * Deep introspective questioning system for life clarity
 * 
 * @module engine/life_questions
 */

// ============================================
// CONFIGURATION (Open/Closed Principle)
// ============================================

const LIFE_QUESTIONING_CONFIG = {
    questionsPerLevel: 2,
    maxTotalQuestions: 7,
    levels: ['exploration', 'depth', 'identity', 'action'],
    defaultTheme: 'purpose'
};

// ============================================
// QUESTION BANK - 4 LEVELS
// ============================================

const LIFE_QUESTIONS = {
    // Level 1: Exploration (Surface)
    exploration: [
        "¿Qué es lo que más te inquieta cuando piensas en tu futuro?",
        "Si pudieras describir tu confusión actual como una sensación física, ¿cómo se sentiría?",
        "¿Qué te gustaría que fuera diferente en tu vida dentro de un año?",
        "¿Hay algo que solías amar hacer y que has dejado de lado?",
        "¿Qué te hace sentir más vivo cuando lo haces?"
    ],
    
    // Level 2: Depth (Emotional)
    depth: [
        "¿Qué miedo se esconde detrás de esa duda?",
        "Si ese miedo no existiera, ¿qué elegirías hacer?",
        "¿Qué parte de ti sabe la respuesta pero no quiere escucharla?",
        "¿Estás buscando el camino correcto, o permiso para tomar el que ya conoces?",
        "¿Qué te dirías a ti mismo si fueras tu mejor amigo?"
    ],
    
    // Level 3: Identity (Core)
    identity: [
        "¿Quién serías si nadie te estuviera mirando?",
        "¿Qué valores son innegociables para ti, incluso si nadie más los entiende?",
        "¿Qué versión de ti mismo extrañas o anhelas convertirte?",
        "Si tu vida fuera una historia, ¿qué tipo de protagonista quieres ser?",
        "¿Qué legado emocional quieres dejar en las personas que te rodean?"
    ],
    
    // Level 4: Action (Practical)
    action: [
        "Si tuvieras que dar un pequeño paso hoy, ¿cuál sería?",
        "¿Qué recurso, habilidad o conocimiento necesitas para avanzar?",
        "¿Quién en tu vida podría ayudarte con esto, si se lo pidieras?",
        "¿Qué experimento podrías hacer esta semana para probar una dirección?",
        "¿Qué señal estás esperando para empezar?"
    ]
};

// ============================================
// TRIGGER DETECTION
// ============================================

const LIFE_QUESTION_TRIGGERS = [
    /no s[eé] qu[eé] hacer/i,
    /qu[eé] estudiar/i,
    /qu[eé] carrera/i,
    /duda personal/i,
    /no tengo claro/i,
    /estoy perdido/i,
    /confundido con mi vida/i,
    /qu[eé] camino/i,
    /direcci[oó]n/i,
    /prop[oó]sito/i,
    /sentido de vida/i,
    /qu[eé] hacer con mi vida/i,
    /no s[eé] qu[eé] quiero/i,
    /ayuda.*decidir/i
];

/**
 * Detect if message triggers life questioning mode
 * @param {string} message - User's message
 * @returns {boolean} True if life questioning should activate
 * 
 * @example
 * const shouldActivate = detectLifeQuestioningTrigger('No sé qué estudiar');
 */
function detectLifeQuestioningTrigger(message) {
    if (!message || typeof message !== 'string') {
        return false;
    }
    
    return LIFE_QUESTION_TRIGGERS.some(pattern => pattern.test(message));
}

// ============================================
// SESSION STATE (Singleton Pattern)
// ============================================

/**
 * Life Questioning Session State
 * Implements Singleton pattern for session management
 * @private
 */
const lifeQuestioningState = {
    active: false,
    currentLevel: 'exploration',
    questionCount: 0,
    userResponses: [],
    startedAt: null,
    theme: null, // 'career', 'purpose', 'identity', 'decision'
    usedQuestions: new Set() // Track used questions to avoid repetition
};

/**
 * Start life questioning session
 * Integrates with global state management if available
 * @param {string} theme - Session theme
 * @returns {Object} Initial question
 * 
 * @example
 * const question = startLifeQuestioningSession('career');
 */
function startLifeQuestioningSession(theme = 'purpose') {
    lifeQuestioningState.active = true;
    lifeQuestioningState.currentLevel = 'exploration';
    lifeQuestioningState.questionCount = 0;
    lifeQuestioningState.userResponses = [];
    lifeQuestioningState.startedAt = Date.now();
    lifeQuestioningState.theme = theme;
    lifeQuestioningState.usedQuestions.clear();
    
    console.log('🧭 Life Questioning Session started:', theme);
    
    // Integrate with global state if available
    if (typeof setState !== 'undefined') {
        setState({ 
            currentMode: 'life_questioning',
            lifeQuestioningActive: true 
        });
    }
    
    // Emit event if events module available
    if (typeof emit !== 'undefined') {
        emit('life_questioning:started', { theme, timestamp: Date.now() });
    }
    
    return getNextQuestion();
}

/**
 * Get next question based on current level
 * Uses Strategy pattern to avoid question repetition
 * @returns {Object} Question object with text and metadata
 * 
 * @example
 * const question = getNextQuestion();
 */
function getNextQuestion() {
    const level = lifeQuestioningState.currentLevel;
    const questions = LIFE_QUESTIONS[level];
    
    if (!questions || questions.length === 0) {
        return null;
    }
    
    // Filter out already used questions
    const availableQuestions = questions.filter(q => 
        !lifeQuestioningState.usedQuestions.has(q)
    );
    
    // If all questions used, reset for this level
    const questionPool = availableQuestions.length > 0 
        ? availableQuestions 
        : questions;
    
    // Get random question from available pool
    const randomIndex = Math.floor(Math.random() * questionPool.length);
    const questionText = questionPool[randomIndex];
    
    // Mark as used
    lifeQuestioningState.usedQuestions.add(questionText);
    lifeQuestioningState.questionCount++;
    
    return {
        text: questionText,
        level: level,
        number: lifeQuestioningState.questionCount,
        timestamp: Date.now()
    };
}

/**
 * Process user response and advance session
 * Implements defensive programming with validation
 * @param {string} response - User's response
 * @returns {Object|null} Next question, session summary, or null if invalid
 * 
 * @example
 * const next = processLifeQuestioningResponse('Me da miedo equivocarme');
 */
function processLifeQuestioningResponse(response) {
    // Validation
    if (!lifeQuestioningState.active) {
        console.warn('Life questioning session not active');
        return null;
    }
    
    if (!response || typeof response !== 'string' || response.trim().length === 0) {
        console.warn('Invalid response provided');
        return getNextQuestion(); // Skip invalid response, continue session
    }
    
    // Store response
    lifeQuestioningState.userResponses.push({
        text: response.trim(),
        level: lifeQuestioningState.currentLevel,
        timestamp: Date.now()
    });
    
    // Determine if we should advance level or end session
    const shouldAdvance = shouldAdvanceLevel();
    const shouldEnd = shouldEndSession();
    
    if (shouldEnd) {
        return endLifeQuestioningSession();
    }
    
    if (shouldAdvance) {
        advanceLevel();
    }
    
    return getNextQuestion();
}

/**
 * Check if should advance to next level
 * Uses configuration for flexibility
 * @returns {boolean} True if should advance
 */
function shouldAdvanceLevel() {
    const responsesInLevel = lifeQuestioningState.userResponses.filter(
        r => r.level === lifeQuestioningState.currentLevel
    ).length;
    
    return responsesInLevel >= LIFE_QUESTIONING_CONFIG.questionsPerLevel;
}

/**
 * Check if should end session
 * Uses configuration for flexibility
 * @returns {boolean} True if should end
 */
function shouldEndSession() {
    return lifeQuestioningState.questionCount >= LIFE_QUESTIONING_CONFIG.maxTotalQuestions;
}

/**
 * Advance to next level
 * Uses configuration for level progression
 */
function advanceLevel() {
    const levels = LIFE_QUESTIONING_CONFIG.levels;
    const currentIndex = levels.indexOf(lifeQuestioningState.currentLevel);
    
    if (currentIndex < levels.length - 1) {
        lifeQuestioningState.currentLevel = levels[currentIndex + 1];
        console.log('🧭 Advanced to level:', lifeQuestioningState.currentLevel);
        
        // Emit event if available
        if (typeof emit !== 'undefined') {
            emit('life_questioning:level_advanced', { 
                level: lifeQuestioningState.currentLevel,
                questionCount: lifeQuestioningState.questionCount
            });
        }
    }
}

/**
 * End life questioning session and generate summary
 * Integrates with global state management if available
 * @returns {Object} Session summary
 * 
 * @example
 * const summary = endLifeQuestioningSession();
 */
function endLifeQuestioningSession() {
    lifeQuestioningState.active = false;
    
    const duration = Date.now() - lifeQuestioningState.startedAt;
    const durationMinutes = Math.round(duration / 60000);
    
    console.log('🧭 Life Questioning Session ended');
    console.log(`   Duration: ${durationMinutes} minutes`);
    console.log(`   Questions: ${lifeQuestioningState.questionCount}`);
    
    // Integrate with global state if available
    if (typeof setState !== 'undefined') {
        setState({ 
            currentMode: 'default',
            lifeQuestioningActive: false 
        });
    }
    
    // Emit event if events module available
    if (typeof emit !== 'undefined') {
        emit('life_questioning:ended', { 
            duration: durationMinutes,
            questionCount: lifeQuestioningState.questionCount,
            timestamp: Date.now()
        });
    }
    
    return {
        type: 'session_end',
        summary: generateSessionSummary(),
        duration: durationMinutes,
        questionCount: lifeQuestioningState.questionCount,
        trigger: { google_action: 'continue_scene' }
    };
}

/**
 * Generate session summary
 * @returns {Object} Summary with insights and action
 * 
 * @example
 * const summary = generateSessionSummary();
 */
function generateSessionSummary() {
    const responses = lifeQuestioningState.userResponses;
    
    // Extract key themes from responses
    const themes = extractThemes(responses);
    
    return {
        emotional_summary: generateEmotionalSummary(themes),
        suggested_action: generateSuggestedAction(themes),
        continuation_question: generateContinuationQuestion(themes),
        insights: themes
    };
}

/**
 * Extract themes from user responses
 * @param {Array} responses - User responses
 * @returns {Array} Extracted themes
 */
function extractThemes(responses) {
    const themes = [];
    
    // Simple keyword-based theme extraction
    const keywords = {
        fear: /miedo|temor|asusta|preocupa/i,
        confusion: /confus|duda|claro|perdido/i,
        passion: /amo|gusta|disfruto|apasiona/i,
        pressure: /deber|tengo que|obligado|espera/i,
        identity: /soy|ser|quien|yo mismo/i
    };
    
    for (const response of responses) {
        for (const [theme, pattern] of Object.entries(keywords)) {
            if (pattern.test(response.text)) {
                if (!themes.includes(theme)) {
                    themes.push(theme);
                }
            }
        }
    }
    
    return themes;
}

/**
 * Generate emotional summary
 * @param {Array} themes - Extracted themes
 * @returns {string} Emotional summary
 */
function generateEmotionalSummary(themes) {
    const summaries = {
        fear: 'Hay una corriente de miedo que atraviesa tus palabras, como olas que dudan antes de romper en la orilla.',
        confusion: 'La niebla cubre tu horizonte, y las corrientes te llevan en direcciones que aún no reconoces.',
        passion: 'Hay destellos de luz en el agua cuando hablas de lo que amas, como si el sol tocara la superficie.',
        pressure: 'Sientes el peso de expectativas ajenas, como si el océano entero descansara sobre tus hombros.',
        identity: 'Estás buscando tu reflejo en el agua, preguntándote quién eres más allá de lo que otros ven.'
    };
    
    if (themes.length === 0) {
        return 'El océano escucha tu búsqueda con paciencia infinita.';
    }
    
    return summaries[themes[0]] || 'Las mareas de tu interior están en movimiento.';
}

/**
 * Generate suggested action
 * @param {Array} themes - Extracted themes
 * @returns {string} Suggested action
 */
function generateSuggestedAction(themes) {
    const actions = {
        fear: 'Quizás el primer paso no es eliminar el miedo, sino caminar con él. ¿Qué pequeña acción podrías tomar hoy, incluso con miedo?',
        confusion: 'La claridad no llega de golpe, sino gota a gota. ¿Qué experimento pequeño podrías hacer esta semana para probar una dirección?',
        passion: 'Esa chispa que sientes es una brújula. ¿Cómo podrías darle más espacio en tu vida, aunque sea 10 minutos al día?',
        pressure: 'Las expectativas de otros son olas que pasan. ¿Qué elegirías si solo tu voz importara?',
        identity: 'Conocerte lleva tiempo, como el mar tallando una piedra. ¿Qué práctica diaria te ayudaría a escucharte mejor?'
    };
    
    if (themes.length === 0) {
        return 'Respira. Observa. Da un paso pequeño hacia donde tu corazón te llama.';
    }
    
    return actions[themes[0]] || 'Confía en el proceso. El océano siempre encuentra su camino.';
}

/**
 * Generate continuation question
 * @param {Array} themes - Extracted themes
 * @returns {string} Continuation question
 */
function generateContinuationQuestion(themes) {
    return '¿Quieres explorar más profundo, o prefieres que el océano te acompañe en silencio por un momento?';
}

/**
 * Get life questioning state
 * @returns {Object} Current state
 * 
 * @example
 * const state = getLifeQuestioningState();
 */
function getLifeQuestioningState() {
    return { ...lifeQuestioningState };
}

/**
 * Reset life questioning state
 * 
 * @example
 * resetLifeQuestioningState();
 */
function resetLifeQuestioningState() {
    lifeQuestioningState.active = false;
    lifeQuestioningState.currentLevel = 'exploration';
    lifeQuestioningState.questionCount = 0;
    lifeQuestioningState.userResponses = [];
    lifeQuestioningState.startedAt = null;
    lifeQuestioningState.theme = null;
    lifeQuestioningState.usedQuestions.clear();
    
    console.log('🧭 Life Questioning State reset');
}

// ============================================
