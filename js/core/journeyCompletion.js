/**
 * Journey Completion Module
 * Detects when user is ready for closure and guides toward meaningful endings
 * 
 * @module core/journeyCompletion
 */

// ============================================
// CONFIGURATION
// ============================================

const COMPLETION_CONFIG = Object.freeze({
    SCORES: {
        INDICATOR_WEIGHT: 10,
        MAX_INDICATOR_SCORE: 40,
        MAX_STAGE_SCORE: 30,
        MAX_OCEAN_STATE_SCORE: 20,
        MAX_EXPRESSION_SCORE: 10
    },
    THRESHOLDS: {
        HIGH_COMPLETION: 70,
        MIN_MESSAGES_FOR_CLOSURE: 6
    },
    STAGE_BOUNDARIES: {
        BEGINNING: 2,
        EXPLORING: 5,
        DEEPENING: 10,
        INTEGRATING: 15
    }
});

// ============================================
// COMPLETION INDICATORS
// ============================================

const COMPLETION_INDICATORS = {
    // Positive resolution indicators
    CLARITY_ACHIEVED: [
        /ahora (entiendo|veo|comprendo)/i,
        /tiene sentido/i,
        /más claro/i,
        /ya s[eé] qu[eé]/i,
        /creo que (voy a|har[eé]|puedo)/i,
        /me siento mejor/i,
        /gracias.*ayud/i
    ],
    
    // Action commitment indicators
    ACTION_READY: [
        /voy a (hacer|intentar|probar)/i,
        /empezar[eé] (con|por)/i,
        /mi primer paso/i,
        /lo har[eé]/i,
        /voy a intentarlo/i
    ],
    
    // Emotional resolution indicators
    EMOTIONAL_PEACE: [
        /me siento (tranquilo|en paz|mejor|aliviado)/i,
        /ya no me siento tan/i,
        /puedo respirar/i,
        /gracias por escuchar/i,
        /necesitaba esto/i
    ],
    
    // Natural ending indicators
    NATURAL_CLOSURE: [
        /gracias/i,
        /eso es todo/i,
        /por ahora est[aá] bien/i,
        /suficiente por hoy/i,
        /creo que es todo/i,
        /hasta luego/i,
        /adi[oó]s/i
    ]
};

// ============================================
// JOURNEY STAGES
// ============================================

const JOURNEY_STAGES = {
    BEGINNING: 'beginning',      // 0-2 messages
    EXPLORING: 'exploring',      // 3-5 messages
    DEEPENING: 'deepening',      // 6-10 messages
    INTEGRATING: 'integrating',  // 11-15 messages
    COMPLETING: 'completing'     // 16+ messages or completion detected
};

// ============================================
// JOURNEY COMPLETION CLASS
// ============================================

class JourneyCompletion {
    /**
     * Singleton instance
     * @private
     * @static
     */
    static instance = null;

    /**
     * Create a new JourneyCompletion instance
     */
    constructor() {
        if (JourneyCompletion.instance) {
            return JourneyCompletion.instance;
        }

        this.currentStage = JOURNEY_STAGES.BEGINNING;
        this.messageCount = 0;
        this.completionScore = 0;
        this.completionIndicators = [];
        this.isReadyForClosure = false;
        this.closureOffered = false;

        JourneyCompletion.instance = this;
        console.log('🎯 Journey Completion initialized');
    }

    /**
     * Get singleton instance
     * @returns {JourneyCompletion} Singleton instance
     * @static
     */
    static getInstance() {
        if (!JourneyCompletion.instance) {
            JourneyCompletion.instance = new JourneyCompletion();
        }
        return JourneyCompletion.instance;
    }

    /**
     * Analyze message for completion indicators
     * @param {string} message - User's message
     * @param {Object} context - Conversation context
     * @returns {Object} Completion analysis
     */
    analyzeCompletion(message, context = {}) {
        this.messageCount++;
        
        // Update journey stage based on message count
        this.updateJourneyStage();
        
        // Check for completion indicators
        const indicators = this.detectCompletionIndicators(message);
        
        // Calculate completion score
        this.completionScore = this.calculateCompletionScore(indicators, context);
        
        // Determine if ready for closure
        this.isReadyForClosure = this.shouldOfferClosure();
        
        return {
            stage: this.currentStage,
            messageCount: this.messageCount,
            completionScore: this.completionScore,
            indicators: indicators,
            isReadyForClosure: this.isReadyForClosure,
            closureType: this.determineClosureType(indicators)
        };
    }

    /**
     * Update journey stage based on message count and context
     * @private
     */
    updateJourneyStage() {
        const { BEGINNING, EXPLORING, DEEPENING, INTEGRATING } = COMPLETION_CONFIG.STAGE_BOUNDARIES;
        
        if (this.messageCount <= BEGINNING) {
            this.currentStage = JOURNEY_STAGES.BEGINNING;
        } else if (this.messageCount <= EXPLORING) {
            this.currentStage = JOURNEY_STAGES.EXPLORING;
        } else if (this.messageCount <= DEEPENING) {
            this.currentStage = JOURNEY_STAGES.DEEPENING;
        } else if (this.messageCount <= INTEGRATING) {
            this.currentStage = JOURNEY_STAGES.INTEGRATING;
        } else {
            this.currentStage = JOURNEY_STAGES.COMPLETING;
        }
    }

    /**
     * Detect completion indicators in message
     * @param {string} message - User's message
     * @returns {Array} Detected indicators
     * @private
     */
    detectCompletionIndicators(message) {
        const detected = [];
        
        for (const [type, patterns] of Object.entries(COMPLETION_INDICATORS)) {
            for (const pattern of patterns) {
                if (pattern.test(message)) {
                    detected.push(type);
                    break; // Only count each type once
                }
            }
        }
        
        // Store for later reference
        this.completionIndicators = detected;
        
        return detected;
    }

    /**
     * Calculate completion score (0-100)
     * @param {Array} indicators - Detected indicators
     * @param {Object} context - Conversation context
     * @returns {number} Completion score
     * @private
     */
    calculateCompletionScore(indicators, context) {
        let score = 0;
        const { INDICATOR_WEIGHT, MAX_INDICATOR_SCORE } = COMPLETION_CONFIG.SCORES;
        
        // Base score from indicators (configurable max)
        score += Math.min(indicators.length * INDICATOR_WEIGHT, MAX_INDICATOR_SCORE);
        
        // Stage progression bonus (30 points max)
        const stageScores = {
            [JOURNEY_STAGES.BEGINNING]: 0,
            [JOURNEY_STAGES.EXPLORING]: 5,
            [JOURNEY_STAGES.DEEPENING]: 15,
            [JOURNEY_STAGES.INTEGRATING]: 25,
            [JOURNEY_STAGES.COMPLETING]: 30
        };
        score += stageScores[this.currentStage] || 0;
        
        // Ocean state progression (20 points max)
        if (context.oceanState) {
            const stateScores = {
                'confused': 0,
                'anxious': 5,
                'processing': 10,
                'clarity': 15,
                'resolved': 20
            };
            score += stateScores[context.oceanState] || 0;
        }
        
        // Expression metrics (10 points max)
        if (context.expressionMetrics) {
            const avgMetric = (
                context.expressionMetrics.clarity +
                context.expressionMetrics.specificity +
                context.expressionMetrics.emotionalAwareness
            ) / 3;
            score += Math.round(avgMetric / 10); // 0-10 points
        }
        
        return Math.min(score, 100);
    }

    /**
     * Determine if should offer closure
     * @returns {boolean} Whether to offer closure
     * @private
     */
    shouldOfferClosure() {
        // Don't offer closure if already offered
        if (this.closureOffered) {
            return false;
        }
        
        // Offer closure if:
        // 1. High completion score (configurable threshold)
        // 2. In integrating or completing stage
        // 3. Has at least one completion indicator
        
        const highScore = this.completionScore >= COMPLETION_CONFIG.THRESHOLDS.HIGH_COMPLETION;
        const appropriateStage = [JOURNEY_STAGES.INTEGRATING, JOURNEY_STAGES.COMPLETING].includes(this.currentStage);
        const hasIndicators = this.completionIndicators.length > 0;
        
        return highScore && appropriateStage && hasIndicators;
    }

    /**
     * Determine type of closure to offer
     * @param {Array} indicators - Detected indicators
     * @returns {string} Closure type
     * @private
     */
    determineClosureType(indicators) {
        if (indicators.includes('CLARITY_ACHIEVED')) {
            return 'clarity_celebration';
        }
        if (indicators.includes('ACTION_READY')) {
            return 'action_sendoff';
        }
        if (indicators.includes('EMOTIONAL_PEACE')) {
            return 'emotional_blessing';
        }
        if (indicators.includes('NATURAL_CLOSURE')) {
            return 'natural_farewell';
        }
        
        // Default based on stage
        if (this.currentStage === JOURNEY_STAGES.COMPLETING) {
            return 'journey_summary';
        }
        
        return 'gentle_continuation';
    }

    /**
     * Generate closure prompt based on type
     * @param {string} closureType - Type of closure
     * @param {Object} context - Conversation context
     * @returns {string} Closure prompt
     */
    getClosurePrompt(closureType, context = {}) {
        const prompts = {
            clarity_celebration: `
**JOURNEY COMPLETION - Clarity Achieved**

The user has reached clarity. Celebrate this moment and offer a beautiful closing.

Your response should:
1. Acknowledge the clarity they've found
2. Reflect on the journey they've taken
3. Offer a poetic blessing for their path forward
4. Provide a gentle invitation to return if needed

Use ocean metaphors to create a sense of completion:
- "El horizonte se ha despejado"
- "Las aguas han encontrado su calma"
- "La bruma se ha disipado"
- "Tu brújula interior ahora señala con claridad"

End with a warm farewell that feels complete but not final.`,

            action_sendoff: `
**JOURNEY COMPLETION - Ready for Action**

The user is ready to take action. Send them off with confidence and support.

Your response should:
1. Celebrate their readiness to act
2. Affirm their chosen direction
3. Remind them of their inner strength
4. Offer encouragement for the journey ahead

Use ocean metaphors of movement and journey:
- "Las velas están listas"
- "El viento sopla a tu favor"
- "La corriente te lleva hacia adelante"
- "Cada ola te acerca a tu destino"

End with an empowering sendoff.`,

            emotional_blessing: `
**JOURNEY COMPLETION - Emotional Peace**

The user has found emotional peace. Offer a gentle blessing.

Your response should:
1. Honor the emotional journey they've taken
2. Acknowledge the peace they've found
3. Remind them that emotions ebb and flow like tides
4. Offer a comforting presence for future storms

Use ocean metaphors of calm and peace:
- "Las aguas han encontrado su calma"
- "La tormenta ha pasado"
- "El mar te sostiene en su abrazo"
- "La paz es como la marea, siempre regresa"

End with a warm, peaceful farewell.`,

            natural_farewell: `
**JOURNEY COMPLETION - Natural Ending**

The user is naturally concluding the conversation. Honor this with grace.

Your response should:
1. Thank them for sharing their journey
2. Acknowledge what was explored together
3. Offer a brief reflection on their path
4. Leave the door open for future conversations

Use ocean metaphors of tides and cycles:
- "Como la marea, siempre puedes regresar"
- "El océano estará aquí cuando lo necesites"
- "Cada ola tiene su momento"
- "El mar nunca olvida a sus navegantes"

End with a simple, warm farewell.`,

            journey_summary: `
**JOURNEY COMPLETION - Long Conversation**

The conversation has been extensive. Offer a summary and gentle closure.

Your response should:
1. Summarize the key insights from the journey
2. Highlight the progress made
3. Offer 1-2 key takeaways
4. Suggest a natural pause point

Use ocean metaphors of journey and distance:
- "Hemos navegado aguas profundas juntos"
- "El viaje ha sido largo y revelador"
- "Has recorrido muchas olas"
- "Es momento de anclar y descansar"

End with an invitation to continue another time.`,

            gentle_continuation: `
**GENTLE CONTINUATION**

The user isn't quite ready for closure. Continue gently.

Your response should:
1. Acknowledge where they are
2. Offer gentle support
3. Ask if they want to continue or pause
4. Give them control over the pace

Use ocean metaphors of flow and choice:
- "Las olas siguen su propio ritmo"
- "Podemos continuar o descansar"
- "El mar no tiene prisa"
- "Tú eliges el rumbo"

End with an open question that gives them choice.`
        };

        return prompts[closureType] || prompts.gentle_continuation;
    }

    /**
     * Mark closure as offered
     */
    markClosureOffered() {
        this.closureOffered = true;
    }

    /**
     * Reset journey tracking
     */
    reset() {
        this.currentStage = JOURNEY_STAGES.BEGINNING;
        this.messageCount = 0;
        this.completionScore = 0;
        this.completionIndicators = [];
        this.isReadyForClosure = false;
        this.closureOffered = false;
        console.log('🔄 Journey completion reset');
    }

    /**
     * Get current journey status
     * @returns {Object} Journey status
     */
    getStatus() {
        return {
            stage: this.currentStage,
            messageCount: this.messageCount,
            completionScore: this.completionScore,
            isReadyForClosure: this.isReadyForClosure,
            closureOffered: this.closureOffered
        };
    }
}

// ============================================
// MODULE EXPORTS
// ============================================

if (typeof window !== 'undefined') {
    window.JourneyCompletion = JourneyCompletion;
    window.JOURNEY_STAGES = JOURNEY_STAGES;
    window.COMPLETION_CONFIG = COMPLETION_CONFIG;
    console.log('🎯 Journey Completion module loaded');
}

