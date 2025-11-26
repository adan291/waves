// ====================================================================================================
// CONFIGURATION
// ====================================================================================================
const ADAPTIVE_CONFIG = {
    enableStateTracking: true,
    confidenceThreshold: 0.6,
    maxStateHistory: 50,
    enableMultiLanguage: true,
    defaultState: 'NEUTRAL_CHAT',
    emotionalPriority: true,
    enableLogging: false
};

function validateConfig(config) {
    const validated = { ...ADAPTIVE_CONFIG };
    if (!config || typeof config !== 'object') {
        return validated;
    }

    // Validate enableStateTracking
    if (typeof config.enableStateTracking === 'boolean') {
        validated.enableStateTracking = config.enableStateTracking;
    }

    // Validate confidenceThreshold (must be between 0 and 1)
    if (typeof config.confidenceThreshold === 'number') {
        if (config.confidenceThreshold >= 0 && config.confidenceThreshold <= 1) {
            validated.confidenceThreshold = config.confidenceThreshold;
        } else {
            console.warn(`Invalid confidenceThreshold: ${config.confidenceThreshold}. Must be between 0 and 1. Using default: ${ADAPTIVE_CONFIG.confidenceThreshold}`);
        }
    }

    // Validate maxStateHistory (must be positive integer)
    if (typeof config.maxStateHistory === 'number') {
        if (Number.isInteger(config.maxStateHistory) && config.maxStateHistory > 0) {
            validated.maxStateHistory = config.maxStateHistory;
        } else {
            console.warn(`Invalid maxStateHistory: ${config.maxStateHistory}. Must be positive integer. Using default: ${ADAPTIVE_CONFIG.maxStateHistory}`);
        }
    }

    // Validate enableMultiLanguage
    if (typeof config.enableMultiLanguage === 'boolean') {
        validated.enableMultiLanguage = config.enableMultiLanguage;
    }

    // Validate defaultState (must be valid state)
    const validStates = ['LOST_DIRECTION', 'EMOTIONAL_LOW', 'SEEKING_DECISION', 'NEED_ORIENTATION', 'SELF_EXPRESSION', 'NEUTRAL_CHAT'];
    if (typeof config.defaultState === 'string') {
        if (validStates.includes(config.defaultState)) {
            validated.defaultState = config.defaultState;
        } else {
            console.warn(`Invalid defaultState: ${config.defaultState}. Must be one of: ${validStates.join(',')}. Using default: ${ADAPTIVE_CONFIG.defaultState}`);
        }
    }

    // Validate emotionalPriority
    if (typeof config.emotionalPriority === 'boolean') {
        validated.emotionalPriority = config.emotionalPriority;
    }

    // Validate enableLogging
    if (typeof config.enableLogging === 'boolean') {
        validated.enableLogging = config.enableLogging;
    }

    return validated;
}

// ====================================================================================================
// ACTION NAME MAPPING
// ====================================================================================================
const STATE_TO_ACTION = {
    LOST_DIRECTION: 'life_questioning',
    EMOTIONAL_LOW: 'emotional_soothing',
    SEEKING_DECISION: 'decision_matrix',
    NEED_ORIENTATION: 'action_roadmap',
    SELF_EXPRESSION: 'reflective_mirror',
    NEUTRAL_CHAT: 'neutral_chat'
};

// ====================================================================================================
// ADAPTIVE ASSISTANCE CLASS
// ====================================================================================================
class AdaptiveAssistance {
    static instance = null;

    constructor(stateClassifier, responsePatterns, config = {}) {
        // Singleton enforcement
        if (AdaptiveAssistance.instance) {
            console.warn('AdaptiveAssistance already initialized. Returning existing instance.');
            return AdaptiveAssistance.instance;
        }

        // Validate dependencies
        if (!stateClassifier) {
            throw new Error('AdaptiveAssistance requires a StateClassifier instance');
        }
        if (!responsePatterns) {
            throw new Error('AdaptiveAssistance requires a ResponsePatterns instance');
        }

        this.stateClassifier = stateClassifier;
        this.responsePatterns = responsePatterns;
        this.config = validateConfig(config);
        this.stateHistory = [];
        this.geminiService = null; // Will be set during initialization

        AdaptiveAssistance.instance = this;

        if (this.config.enableLogging) {
            console.log('🎯 Adaptive Assistance initialized');
        }
    }

    log(message, level = 'log') {
        if (this.config.enableLogging) {
            console[level](message);
        }
    }

    static getInstance(stateClassifier, responsePatterns, config) {
        if (!AdaptiveAssistance.instance) {
            new AdaptiveAssistance(stateClassifier, responsePatterns, config);
        }
        return AdaptiveAssistance.instance;
    }

    async process(message, conversationContext = {}) {
        try {
            this.log('🌊 Processing message with adaptive assistance...');

            // 1. Classify state
            const classification = this.classifyState(message, conversationContext);

            // 2. Track state changes
            this.trackStateChange(classification, message);

            // 3. Get appropriate prompt
            const systemPrompt = this.getPromptForState(classification.state, conversationContext);

            // 4. Generate response via Gemini
            const responseText = await this.generateResponse(message, systemPrompt, conversationContext);

            // 5. Structure output
            const structuredOutput = this.structureOutput(responseText, classification);

            this.log('✅ Adaptive response generated: ' + JSON.stringify({
                state: classification.state,
                action: structuredOutput.action,
                confidence: classification.confidence
            }));

            return structuredOutput;
        } catch (error) {
            console.error('❌ Error in adaptive assistance process:', error);
            throw error;
        }
    }

    classifyState(message, context) {
        return this.stateClassifier.classify(message, context);
    }

    trackStateChange(classification, message) {
        if (!this.config.enableStateTracking) {
            return;
        }

        // Get previous state if exists
        const previousState = this.stateHistory.length > 0
            ? this.stateHistory[this.stateHistory.length - 1].state
            : null;

        // Detect state change
        const stateChanged = previousState && previousState !== classification.state;

        // Validate state transition
        if (stateChanged) {
            const transitionValidation = this.validateStateTransition(
                previousState,
                classification.state,
                classification
            );

            if (!transitionValidation.valid) {
                this.log('⚠️ State transition validation: ' + transitionValidation.warning, 'warn');
            }

            // Log state transition pattern
            this.logStateTransition(previousState, classification.state, transitionValidation);
        }

        // Create history entry
        const historyEntry = {
            state: classification.state,
            confidence: classification.confidence,
            emotionalTone: classification.emotionalTone,
            timestamp: classification.timestamp || Date.now(),
            message: message.substring(0, 100),
            transitionFrom: previousState,
            isTransition: stateChanged
        };

        // Add to history
        this.stateHistory.push(historyEntry);

        // Maintain max history size
        if (this.stateHistory.length > this.config.maxStateHistory) {
            this.stateHistory.shift();
        }

        // Log state changes
        if (stateChanged) {
            this.log(`🔄 State transition: ${previousState} -> ${classification.state}`);
        }
    }

    getPromptForState(state, context) {
        // Check if journey completion suggests closure
        if (context.journeyAnalysis && context.journeyAnalysis.isReadyForClosure) {
            const closureType = context.journeyAnalysis.closureType;
            if (typeof CLOSURE_PROMPTS !== 'undefined' && CLOSURE_PROMPTS[closureType.toUpperCase()]) {
                if (this.config.enableLogging) {
                    console.log(`🎯 Using closure prompt: ${closureType}`);
                }
                // Mark closure as offered
                if (typeof JourneyCompletion !== 'undefined') {
                    const journeyCompletion = JourneyCompletion.getInstance();
                    journeyCompletion.markClosureOffered();
                }
                return CLOSURE_PROMPTS[closureType.toUpperCase()];
            }
        }

        // Get pattern name for state
        const patternName = this.responsePatterns.getPatternForState(state);

        // Get prompt from response patterns
        let prompt = this.responsePatterns.getPrompt(patternName, context);

        // Add wave context if available
        if (context.selectedWave) {
            const waveNames = {
                calm: 'Calm Wave (Ola Tranquila) - peaceful self-discovery',
                deep: 'Deep Wave (Ola Profunda) - deep emotional exploration',
                energetic: 'Energetic Wave (Ola Energética) - action and momentum',
                healing: 'Healing Wave (Ola Sanadora) - emotional healing'
            };
            const waveName = waveNames[context.selectedWave] || context.selectedWave;
            prompt += `
    ** USER'S CHOSEN WAVE: ** ${waveName}
    Adapt your response to match this wave's energy and focus.`;
        }

        this.log(`📝 Using pattern: ${patternName} for state: ${state}`);
        if (context.selectedWave) {
            this.log(`🌊 Wave context: ${context.selectedWave}`);
        }

        return prompt;
    }

    async generateResponse(message, systemPrompt, context) {
        try {
            // Get or initialize Gemini service
            if (!this.geminiService) {
                if (typeof GeminiService !== 'undefined') {
                    this.geminiService = GeminiService.getInstance();
                } else {
                    throw new Error('GeminiService not available');
                }
            }

            // Build conversation history
            const conversationHistory = this.buildConversationHistory(message, context);

            // Call Gemini service with adaptive prompt
            const response = await this.geminiService.sendMessage(
                conversationHistory,
                systemPrompt
            );

            if (!response || typeof response !== 'string') {
                throw new Error('Invalid response from Gemini service');
            }

            return response;
        } catch (error) {
            console.error('❌ Error generating response:', error);
            // Log validation failure for prompt improvement
            this.logGenerationFailure(error, message, context);
            // Return ocean-themed error message
            return this.createErrorResponse(error);
        }
    }

    buildConversationHistory(currentMessage, context) {
        const history = [];

        // Add previous messages from context if available
        if (context.history && Array.isArray(context.history)) {
            history.push(...context.history);
        }

        // Add current message
        history.push({
            role: 'user',
            content: currentMessage
        });

        return history;
    }

    structureOutput(responseText, classification) {
        try {
            // Parse Gemini response
            const parsedResponse = this.parseResponse(responseText);

            // Use ResponseValidator if available, otherwise use internal validation
            let validationResult;
            if (typeof ResponseValidator !== 'undefined') {
                validationResult = ResponseValidator.validate(parsedResponse);
                ResponseValidator.logValidation(validationResult, 'structureOutput');
            } else {
                validationResult = this.validateResponseStructure(parsedResponse);
            }

            if (!validationResult.valid) {
                console.warn('⚠️ Response validation failed:', validationResult.reason);
                this.logValidationFailure(responseText, validationResult.reason, classification);

                // Try to repair response if validator is available
                let repairedResponse = parsedResponse;
                if (typeof ResponseValidator !== 'undefined') {
                    repairedResponse = ResponseValidator.repair(parsedResponse);
                    this.log('🔧 Response repaired: ' + JSON.stringify(repairedResponse));
                }
                return this.createStructuredOutput(repairedResponse, classification);
            }

            // Build output object
            return this.createStructuredOutput(parsedResponse, classification);
        } catch (error) {
            console.error('❌ Error structuring output:', error);
            this.logValidationFailure(responseText, error.message, classification);
            return this.createFallbackOutput(classification);
        }
    }

    createStructuredOutput(response, classification) {
        try {
            let finalResponse = response;

            // Use ConversationEnhancer if available to improve response
            if (typeof ConversationEnhancer !== 'undefined' && classification.context) {
                finalResponse = ConversationEnhancer.improveResponse(response, classification.context);
                this.log('✨ Response enhanced by ConversationEnhancer');
            }

            const output = {
                persona: 'kiro',
                mode: classification.state,
                action: this.getActionName(classification.state),
                text: {
                    whisper: finalResponse.whisper || '🔊 El océano reflexiona...',
                    reflection: finalResponse.reflection || '¿Qué resuena en ti?'
                },
                next_step: this.determineNextStep(classification.state, finalResponse)
            };

            return output;
        } catch (error) {
            console.error('❌ Error creating structured output:', error);
            return this.createFallbackOutput(classification);
        }
    }

    parseResponse(responseText) {
        try {
            // Validate input
            if (!responseText || typeof responseText !== 'string') {
                console.warn('⚠️ Invalid response text:', typeof responseText);
                return this.createDefaultResponse();
            }

            // Clean response text
            const cleanedText = responseText.trim();
            if (!cleanedText) {
                console.warn('⚠️ Empty response text');
                return this.createDefaultResponse();
            }

            // Try to parse as JSON first
            try {
                const parsed = JSON.parse(cleanedText);
                if (parsed && typeof parsed === 'object') {
                    // Validate required fields
                    if (parsed.whisper && parsed.reflection) {
                        return {
                            whisper: String(parsed.whisper).trim(),
                            reflection: String(parsed.reflection).trim()
                        };
                    }
                    // Try to extract from nested structure
                    if (parsed.text && parsed.text.whisper && parsed.text.reflection) {
                        return {
                            whisper: String(parsed.text.whisper).trim(),
                            reflection: String(parsed.text.reflection).trim()
                        };
                    }
                }
            } catch (jsonError) {
                // Continue to lenient parsing
            }

            // If JSON doesn't have expected fields, try lenient parsing
            this.log('ℹ️ JSON parsing failed or missing fields, using lenient parser');
            return this.lenientParse(cleanedText);
        } catch (error) {
            console.error('❌ Error in parseResponse:', error);
            return this.createDefaultResponse();
        }
    }

    createDefaultResponse() {
        return {
            whisper: '🔊 El océano reflexiona sobre tus palabras...',
            reflection: '¿Qué resuena en ti?'
        };
    }

    lenientParse(responseText) {
        try {
            if (!responseText || typeof responseText !== 'string') {
                return this.createDefaultResponse();
            }
            const text = responseText.trim();
            if (!text) return this.createDefaultResponse();

            // 1. Try extracting JSON from code blocks
            const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[1]);
                    if (this.isValidResponse(parsed)) return parsed;
                } catch (e) { /* Ignore */ }
            }

            // 2. Try finding raw JSON object
            const objectMatch = text.match(/\{[^{}]*"whisper"[^{}]*"reflection"[^{}]*\}/);
            if (objectMatch) {
                try {
                    const parsed = JSON.parse(objectMatch[0]);
                    if (this.isValidResponse(parsed)) return parsed;
                } catch (e) { /* Ignore */ }
            }

            // 3. Fallback: Heuristic split
            // Split by double newline first (paragraphs)
            let parts = text.split(/\n\s*\n/).filter(p => p.trim());

            if (parts.length >= 2) {
                return {
                    whisper: parts[0].trim(),
                    reflection: parts.slice(1).join('\n\n').trim()
                };
            }

            // Split by single newline if double failed
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length >= 2) {
                // Try to find a logical split point (question mark or emoji)
                let splitIndex = lines.findIndex(line => line.includes('?') || line.includes('🔊'));
                if (splitIndex === -1) splitIndex = Math.floor(lines.length / 2);

                // Ensure we don't split at 0
                splitIndex = Math.max(1, splitIndex);

                return {
                    whisper: lines.slice(0, splitIndex).join('\n').trim(),
                    reflection: lines.slice(splitIndex).join('\n').trim()
                };
            }

            // 4. Last resort
            return {
                whisper: text,
                reflection: '🔊 ¿Qué resuena en ti?'
            };

        } catch (error) {
            console.error('❌ Error in lenientParse:', error);
            return this.createDefaultResponse();
        }
    }

    isValidResponse(parsed) {
        return parsed &&
            typeof parsed.whisper === 'string' &&
            typeof parsed.reflection === 'string';
    }

    createFallbackOutput(classification) {
        return {
            persona: 'kiro',
            mode: classification.state,
            action: this.getActionName(classification.state),
            text: {
                whisper: 'Las olas traen un mensaje que aún se está formando.\nEl mar necesita un momento para encontrar las palabras.',
                reflection: '¿Puedes compartir un poco más?'
            },
            next_step: 'Request clarification'
        };
    }

    getActionName(state) {
        return STATE_TO_ACTION[state] || 'neutral_chat';
    }

    determineNextStep(state, parsedResponse) {
        // Provide internal guidance based on state
        switch (state) {
            case 'LOST_DIRECTION':
                return 'Continue Life Questioning progression';
            case 'EMOTIONAL_LOW':
                return 'Maintain emotional support, validate before exploring';
            case 'SEEKING_DECISION':
                return 'Explore values and consequences without directing';
            case 'NEED_ORIENTATION':
                return 'Provide concrete, achievable actions';
            case 'SELF_EXPRESSION':
                return 'Listen and reflect, avoid solutions';
            case 'NEUTRAL_CHAT':
                return 'Maintain light conversation, watch for state changes';
            default:
                return 'Continue conversation naturally';
        }
    }

    validateStateTransition(fromState, toState, classification) {
        const now = Date.now();

        // Check for rapid state changes (within 5 seconds)
        if (this.stateHistory.length > 0) {
            const lastEntry = this.stateHistory[this.stateHistory.length - 1];
            const timeSinceLastChange = now - lastEntry.timestamp;
            if (timeSinceLastChange < 5000 && lastEntry.isTransition) {
                return {
                    valid: true,
                    warning: `Rapid state change detected (${timeSinceLastChange}ms since last transition)`,
                    isRapid: true
                };
            }
        }

        // Ensure emotional validation occurs before questioning when transitioning from EMOTIONAL_LOW
        if (fromState === 'EMOTIONAL_LOW' && toState !== 'EMOTIONAL_LOW') {
            // Check if enough time has passed for emotional validation
            const emotionalLowEntries = this.stateHistory.filter(entry => entry.state === 'EMOTIONAL_LOW');
            if (emotionalLowEntries.length > 0) {
                const lastEmotionalLow = emotionalLowEntries[emotionalLowEntries.length - 1];
                const timeSinceEmotionalLow = now - lastEmotionalLow.timestamp;

                // Require at least 30 seconds in emotional support before transitioning
                if (timeSinceEmotionalLow < 30000) {
                    return {
                        valid: true,
                        warning: `Transitioning from EMOTIONAL_LOW after only ${Math.round(timeSinceEmotionalLow / 1000)}s. Ensure emotional validation occurred.`,
                        requiresEmotionalValidation: true
                    };
                }
            }
        }

        // Smooth state transition logic - certain transitions are expected
        const expectedTransitions = {
            'EMOTIONAL_LOW': ['NEUTRAL_CHAT', 'SELF_EXPRESSION', 'LOST_DIRECTION'],
            'LOST_DIRECTION': ['NEED_ORIENTATION', 'SEEKING_DECISION', 'NEUTRAL_CHAT'],
            'SEEKING_DECISION': ['NEED_ORIENTATION', 'NEUTRAL_CHAT', 'LOST_DIRECTION'],
            'NEED_ORIENTATION': ['NEUTRAL_CHAT', 'LOST_DIRECTION'],
            'SELF_EXPRESSION': ['EMOTIONAL_LOW', 'NEUTRAL_CHAT', 'LOST_DIRECTION'],
            'NEUTRAL_CHAT': ['LOST_DIRECTION', 'EMOTIONAL_LOW', 'SEEKING_DECISION', 'NEED_ORIENTATION', 'SELF_EXPRESSION']
        };

        const expected = expectedTransitions[fromState] || [];
        const isExpectedTransition = expected.includes(toState);

        if (!isExpectedTransition) {
            return {
                valid: true,
                warning: `Unexpected transition: ${fromState} -> ${toState}`,
                isUnexpected: true
            };
        }

        return {
            valid: true,
            isSmooth: true
        };
    }

    logStateTransition(fromState, toState, validation) {
        if (!this.config.enableLogging) {
            return;
        }

        const transitionInfo = {
            from: fromState,
            to: toState,
            timestamp: Date.now(),
            ...validation
        };

        // Store transition patterns for analysis
        if (!this.transitionPatterns) {
            this.transitionPatterns = [];
        }
        this.transitionPatterns.push(transitionInfo);

        // Keep only last 50 transitions
        if (this.transitionPatterns.length > 50) {
            this.transitionPatterns.shift();
        }

        // Log specific warnings
        if (validation.isRapid) {
            console.warn('⚡ Rapid state transition detected');
        }
        if (validation.requiresEmotionalValidation) {
            console.warn('💙 Ensure emotional validation before deeper exploration');
        }
        if (validation.isUnexpected) {
            console.log('🔀 Unexpected state transition pattern');
        }
        if (validation.isSmooth) {
            console.log('✅ Smooth state transition');
        }
    }

    validateResponseStructure(response) {
        try {
            // Validate response is an object
            if (!response || typeof response !== 'object') {
                return { valid: false, reason: 'Response is not an object' };
            }

            // Validate whisper field
            if (!response.whisper) {
                return { valid: false, reason: 'Missing whisper field' };
            }
            const whisper = String(response.whisper).trim();
            if (whisper.length === 0) {
                return { valid: false, reason: 'Whisper is empty' };
            }

            // Validate reflection field
            if (!response.reflection) {
                return { valid: false, reason: 'Missing reflection field' };
            }
            const reflection = String(response.reflection).trim();
            if (reflection.length === 0) {
                return { valid: false, reason: 'Reflection is empty' };
            }

            // Check for suspicious patterns that indicate parsing errors
            if (whisper.includes('{"') || reflection.includes('{"')) {
                return { valid: false, reason: 'Response contains unparsed JSON' };
            }
            if (whisper.includes('[truncated') || reflection.includes('[truncated')) {
                return { valid: false, reason: 'Response appears truncated' };
            }

            return { valid: true };
        } catch (error) {
            console.error('❌ Error validating response structure:', error);
            return { valid: false, reason: 'Validation error: ' + error.message };
        }
    }

    logValidationFailure(responseText, reason, classification) {
        if (!this.config.enableLogging) {
            return;
        }

        console.warn('⚠️ Response validation failed:', {
            reason,
            state: classification.state,
            responsePreview: responseText.substring(0, 100),
            timestamp: Date.now()
        });

        // Store for prompt improvement
        if (!this.validationFailures) {
            this.validationFailures = [];
        }
        this.validationFailures.push({
            reason,
            state: classification.state,
            response: responseText.substring(0, 500),
            timestamp: Date.now()
        });

        // Keep only last 20 failures
        if (this.validationFailures.length > 20) {
            this.validationFailures.shift();
        }
    }

    logGenerationFailure(error, message, context) {
        if (!this.config.enableLogging) {
            return;
        }

        console.error('❌ Response generation failed:', {
            error: error.message,
            messagePreview: message.substring(0, 100),
            timestamp: Date.now()
        });

        // Store for debugging
        if (!this.generationFailures) {
            this.generationFailures = [];
        }
        this.generationFailures.push({
            error: error.message,
            message: message.substring(0, 200),
            timestamp: Date.now()
        });

        // Keep only last 20 failures
        if (this.generationFailures.length > 20) {
            this.generationFailures.shift();
        }
    }

    createErrorResponse(error) {
        try {
            const errorMessages = [
                {
                    whisper: '🌊 Las olas se han vuelto turbulentas por un momento.\nEl mar necesita un instante para calmarse y encontrar su ritmo.',
                    reflection: '¿Podrías intentar de nuevo?'
                },
                {
                    whisper: '🌊 Una corriente inesperada ha interrumpido el flujo.\nLas aguas buscan su cauce nuevamente.',
                    reflection: '¿Me compartes tu mensaje otra vez?'
                },
                {
                    whisper: '🌊 La bruma se ha espesado momentáneamente.\nEl horizonte se aclarará pronto.',
                    reflection: '¿Intentamos continuar?'
                },
                {
                    whisper: '🌊 El océano reflexiona sobre lo que compartiste.\nUn momento de pausa antes de responder.',
                    reflection: '¿Hay algo más que quieras explorar?'
                }
            ];

            // Select random error message for variety
            const selectedMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];

            // Ensure the response is properly formatted
            return JSON.stringify(selectedMessage);
        } catch (err) {
            console.error('❌ Error creating error response:', err);
            // Fallback response
            return JSON.stringify({
                whisper: '🌊 El océano necesita un momento.',
                reflection: '¿Intentamos de nuevo?'
            });
        }
    }

    getStateHistory() {
        return [...this.stateHistory];
    }

    clearStateHistory() {
        this.stateHistory = [];
        this.log('🧹 State history cleared');
    }

    getStatistics() {
        const stats = {};
        for (const entry of this.stateHistory) {
            const state = entry.state;
            stats[state] = (stats[state] || 0) + 1;
        }
        return stats;
    }

    getValidationFailures() {
        return this.validationFailures || [];
    }

    getGenerationFailures() {
        return this.generationFailures || [];
    }

    getTransitionPatterns() {
        return this.transitionPatterns || [];
    }
}

// ====================================================================================================
// MODULE EXPORTS
// ====================================================================================================
// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AdaptiveAssistance = AdaptiveAssistance;
    // Auto-log in development mode
    if (window.location.hostname === 'localhost') {
        console.log('🎯 Adaptive Assistance loaded.');
    }
}