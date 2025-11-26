/**
 * State Classifier
 * Classifies user emotional and conversational states
 */

// ================================================
// STATE CONSTANTS
// ================================================
const USER_STATES = {
    LOST_DIRECTION: 'LOST_DIRECTION',
    EMOTIONAL_LOW: 'EMOTIONAL_LOW',
    SEEKING_CLARITY: 'SEEKING_CLARITY',
    PROCESSING: 'PROCESSING',
    BREAKTHROUGH: 'BREAKTHROUGH',
    STABLE: 'STABLE',
    REFLECTIVE: 'REFLECTIVE',
    CONFUSED: 'CONFUSED',
    ANXIOUS: 'ANXIOUS',
    RESOLVED: 'RESOLVED'
};

// ================================================
// STATE CLASSIFIER CLASS
// ================================================
class StateClassifier {
    constructor() {
        this.previousStates = [];
        this.currentState = USER_STATES.STABLE;
    }

    /**
     * Classify user state based on message content and context
     * @param {string} message - User message
     * @param {object} context - Conversation context
     * @returns {string} Classified state
     */
    classify(message, context = {}) {
        const lowerMessage = message.toLowerCase();
        
        // Analyze message patterns
        const patterns = this.analyzePatterns(lowerMessage);
        
        // Analyze emotional tone
        const emotionalTone = this.analyzeEmotionalTone(lowerMessage);
        
        // Analyze conversation history
        const historyAnalysis = this.analyzeHistory(context.history || []);
        
        // Determine state
        const state = this.determineState(patterns, emotionalTone, historyAnalysis);
        
        // Update state history
        this.previousStates.push({
            state,
            timestamp: Date.now(),
            message: message.substring(0, 100)
        });
        
        // Keep only last 10 states
        if (this.previousStates.length > 10) {
            this.previousStates.shift();
        }
        
        this.currentState = state;
        
        return state;
    }

    /**
     * Analyze message patterns
     */
    analyzePatterns(message) {
        return {
            hasQuestions: /\?|qué|cómo|por qué|cuándo|dónde|quién|what|how|why|when|where|who/i.test(message),
            hasNegation: /no sé|no entiendo|confundido|perdido|don't know|confused|lost/i.test(message),
            hasEmotionalWords: /siento|emoción|triste|feliz|ansioso|feel|emotion|sad|happy|anxious/i.test(message),
            hasDecisionWords: /decidir|elegir|opción|decide|choose|option/i.test(message),
            hasProgressWords: /mejor|avance|progreso|entiendo|better|progress|understand/i.test(message),
            hasStuckWords: /atascado|bloqueado|no puedo|stuck|blocked|can't/i.test(message),
            isShort: message.length < 50,
            isLong: message.length > 200
        };
    }

    /**
     * Analyze emotional tone
     */
    analyzeEmotionalTone(message) {
        const positiveWords = ['bien', 'mejor', 'feliz', 'contento', 'gracias', 'good', 'better', 'happy', 'thanks'];
        const negativeWords = ['mal', 'peor', 'triste', 'ansioso', 'preocupado', 'bad', 'worse', 'sad', 'anxious', 'worried'];
        const confusedWords = ['confundido', 'perdido', 'no sé', 'confused', 'lost', 'don\'t know'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        let confusedCount = 0;
        
        positiveWords.forEach(word => {
            if (message.includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
            if (message.includes(word)) negativeCount++;
        });
        
        confusedWords.forEach(word => {
            if (message.includes(word)) confusedCount++;
        });
        
        return {
            positive: positiveCount,
            negative: negativeCount,
            confused: confusedCount,
            overall: positiveCount - negativeCount
        };
    }

    /**
     * Analyze conversation history
     */
    analyzeHistory(history) {
        if (!history || history.length === 0) {
            return { isFirstMessage: true, messageCount: 0 };
        }
        
        const userMessages = history.filter(m => m.role === 'user');
        const recentMessages = userMessages.slice(-3);
        
        return {
            isFirstMessage: false,
            messageCount: userMessages.length,
            hasRecentProgress: recentMessages.some(m => 
                /mejor|entiendo|claro|gracias|better|understand|clear|thanks/i.test(m.content)
            ),
            hasRecentStuck: recentMessages.some(m =>
                /no sé|confundido|atascado|don't know|confused|stuck/i.test(m.content)
            )
        };
    }

    /**
     * Determine final state
     */
    determineState(patterns, emotionalTone, historyAnalysis) {
        // First message - stable/neutral
        if (historyAnalysis.isFirstMessage) {
            return USER_STATES.STABLE;
        }
        
        // Confused state
        if (patterns.hasNegation || emotionalTone.confused > 0 || historyAnalysis.hasRecentStuck) {
            return USER_STATES.CONFUSED;
        }
        
        // Anxious state
        if (emotionalTone.negative > emotionalTone.positive && patterns.hasEmotionalWords) {
            return USER_STATES.ANXIOUS;
        }
        
        // Lost direction
        if (patterns.hasQuestions && patterns.hasStuckWords) {
            return USER_STATES.LOST_DIRECTION;
        }
        
        // Seeking clarity
        if (patterns.hasQuestions && !patterns.hasNegation) {
            return USER_STATES.SEEKING_CLARITY;
        }
        
        // Breakthrough/Progress
        if (patterns.hasProgressWords || historyAnalysis.hasRecentProgress) {
            return USER_STATES.BREAKTHROUGH;
        }
        
        // Processing
        if (patterns.isLong && patterns.hasEmotionalWords) {
            return USER_STATES.PROCESSING;
        }
        
        // Resolved
        if (emotionalTone.positive > 0 && !patterns.hasQuestions) {
            return USER_STATES.RESOLVED;
        }
        
        // Reflective
        if (patterns.isLong && !patterns.hasQuestions) {
            return USER_STATES.REFLECTIVE;
        }
        
        // Default to stable
        return USER_STATES.STABLE;
    }

    /**
     * Get current state
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Get state history
     */
    getStateHistory() {
        return [...this.previousStates];
    }

    /**
     * Reset classifier
     */
    reset() {
        this.previousStates = [];
        this.currentState = USER_STATES.STABLE;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StateClassifier, USER_STATES };
}

console.log('🎯 State Classifier loaded');
