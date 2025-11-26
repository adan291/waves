/**
 * Response Patterns
 * Defines response patterns for different user states
 */

// ================================================
// PATTERN NAME CONSTANTS
// ================================================
const PATTERN_NAMES = {
    LIFE_QUESTIONING: 'life_questioning',
    EMOTIONAL_SOOTHING: 'emotional_soothing',
    CLARITY_SEEKING: 'clarity_seeking',
    DECISION_SUPPORT: 'decision_support',
    REFLECTION_DEEPENING: 'reflection_deepening',
    BREAKTHROUGH_CELEBRATION: 'breakthrough_celebration',
    GENTLE_EXPLORATION: 'gentle_exploration',
    ACTIVE_LISTENING: 'active_listening'
};

// ================================================
// RESPONSE PATTERNS CLASS
// ================================================
class ResponsePatterns {
    constructor() {
        this.patterns = this.initializePatterns();
    }

    /**
     * Initialize all response patterns
     */
    initializePatterns() {
        return {
            [PATTERN_NAMES.LIFE_QUESTIONING]: {
                name: PATTERN_NAMES.LIFE_QUESTIONING,
                description: 'Deep existential questions about life purpose',
                triggers: ['propósito', 'sentido', 'vida', 'existencia', 'purpose', 'meaning', 'life', 'existence'],
                approach: 'philosophical',
                tone: 'contemplative',
                structure: {
                    whisper: 'Acknowledge the depth of the question',
                    reflection: 'Explore perspectives and invite self-discovery'
                }
            },

            [PATTERN_NAMES.EMOTIONAL_SOOTHING]: {
                name: PATTERN_NAMES.EMOTIONAL_SOOTHING,
                description: 'Comfort and validation for emotional distress',
                triggers: ['triste', 'dolor', 'sufro', 'mal', 'sad', 'pain', 'hurt', 'bad'],
                approach: 'empathetic',
                tone: 'warm',
                structure: {
                    whisper: 'Validate emotions without judgment',
                    reflection: 'Offer gentle perspective and hope'
                }
            },

            [PATTERN_NAMES.CLARITY_SEEKING]: {
                name: PATTERN_NAMES.CLARITY_SEEKING,
                description: 'Help organize thoughts and find clarity',
                triggers: ['confundido', 'no entiendo', 'claro', 'confused', 'understand', 'clear'],
                approach: 'analytical',
                tone: 'clear',
                structure: {
                    whisper: 'Acknowledge the confusion',
                    reflection: 'Break down complexity into manageable parts'
                }
            },

            [PATTERN_NAMES.DECISION_SUPPORT]: {
                name: PATTERN_NAMES.DECISION_SUPPORT,
                description: 'Support decision-making process',
                triggers: ['decidir', 'elegir', 'opción', 'decide', 'choose', 'option'],
                approach: 'structured',
                tone: 'supportive',
                structure: {
                    whisper: 'Acknowledge the weight of the decision',
                    reflection: 'Explore options and values'
                }
            },

            [PATTERN_NAMES.REFLECTION_DEEPENING]: {
                name: PATTERN_NAMES.REFLECTION_DEEPENING,
                description: 'Deepen existing reflections',
                triggers: ['pienso', 'reflexiono', 'considero', 'think', 'reflect', 'consider'],
                approach: 'exploratory',
                tone: 'curious',
                structure: {
                    whisper: 'Mirror the reflection',
                    reflection: 'Ask deeper questions'
                }
            },

            [PATTERN_NAMES.BREAKTHROUGH_CELEBRATION]: {
                name: PATTERN_NAMES.BREAKTHROUGH_CELEBRATION,
                description: 'Celebrate insights and progress',
                triggers: ['entiendo', 'ahora veo', 'me doy cuenta', 'understand', 'see now', 'realize'],
                approach: 'celebratory',
                tone: 'encouraging',
                structure: {
                    whisper: 'Celebrate the insight',
                    reflection: 'Reinforce and build upon it'
                }
            },

            [PATTERN_NAMES.GENTLE_EXPLORATION]: {
                name: PATTERN_NAMES.GENTLE_EXPLORATION,
                description: 'Gentle exploration of sensitive topics',
                triggers: ['difícil', 'complicado', 'sensible', 'difficult', 'complicated', 'sensitive'],
                approach: 'gentle',
                tone: 'careful',
                structure: {
                    whisper: 'Create safe space',
                    reflection: 'Invite exploration at their pace'
                }
            },

            [PATTERN_NAMES.ACTIVE_LISTENING]: {
                name: PATTERN_NAMES.ACTIVE_LISTENING,
                description: 'Active listening and presence',
                triggers: ['necesito hablar', 'escuchar', 'need to talk', 'listen'],
                approach: 'receptive',
                tone: 'present',
                structure: {
                    whisper: 'Show presence and attention',
                    reflection: 'Reflect back what was heard'
                }
            }
        };
    }

    /**
     * Get pattern by name
     */
    getPattern(patternName) {
        return this.patterns[patternName];
    }

    /**
     * Get all patterns
     */
    getAllPatterns() {
        return { ...this.patterns };
    }

    /**
     * Match message to best pattern
     */
    matchPattern(message, userState) {
        const lowerMessage = message.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;

        Object.values(this.patterns).forEach(pattern => {
            let score = 0;

            // Check trigger words
            pattern.triggers.forEach(trigger => {
                if (lowerMessage.includes(trigger)) {
                    score += 2;
                }
            });

            // Bonus for state alignment
            if (this.stateAlignsWith(userState, pattern.name)) {
                score += 3;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = pattern;
            }
        });

        // Default to active listening if no strong match
        return bestMatch || this.patterns[PATTERN_NAMES.ACTIVE_LISTENING];
    }

    /**
     * Check if state aligns with pattern
     */
    stateAlignsWith(state, patternName) {
        const alignments = {
            'LOST_DIRECTION': [PATTERN_NAMES.CLARITY_SEEKING, PATTERN_NAMES.LIFE_QUESTIONING],
            'EMOTIONAL_LOW': [PATTERN_NAMES.EMOTIONAL_SOOTHING, PATTERN_NAMES.GENTLE_EXPLORATION],
            'SEEKING_CLARITY': [PATTERN_NAMES.CLARITY_SEEKING, PATTERN_NAMES.DECISION_SUPPORT],
            'PROCESSING': [PATTERN_NAMES.ACTIVE_LISTENING, PATTERN_NAMES.REFLECTION_DEEPENING],
            'BREAKTHROUGH': [PATTERN_NAMES.BREAKTHROUGH_CELEBRATION, PATTERN_NAMES.REFLECTION_DEEPENING],
            'CONFUSED': [PATTERN_NAMES.CLARITY_SEEKING, PATTERN_NAMES.GENTLE_EXPLORATION],
            'ANXIOUS': [PATTERN_NAMES.EMOTIONAL_SOOTHING, PATTERN_NAMES.GENTLE_EXPLORATION],
            'RESOLVED': [PATTERN_NAMES.BREAKTHROUGH_CELEBRATION, PATTERN_NAMES.REFLECTION_DEEPENING]
        };

        return alignments[state]?.includes(patternName) || false;
    }

    /**
     * Get pattern suggestions for state
     */
    getSuggestionsForState(state) {
        const suggestions = {
            'LOST_DIRECTION': [
                '¿Qué es lo que más te importa en este momento?',
                '¿Qué dirección te gustaría explorar?',
                '¿Qué te ayudaría a sentirte más orientado?'
            ],
            'EMOTIONAL_LOW': [
                'Está bien sentirse así',
                '¿Qué necesitas en este momento?',
                'Tómate el tiempo que necesites'
            ],
            'SEEKING_CLARITY': [
                '¿Qué parte te gustaría entender mejor?',
                '¿Qué información te falta?',
                'Vamos a desglosarlo paso a paso'
            ],
            'CONFUSED': [
                '¿Qué es lo que más te confunde?',
                'Empecemos por lo básico',
                '¿Qué sería útil aclarar primero?'
            ],
            'BREAKTHROUGH': [
                '¡Qué insight tan valioso!',
                '¿Cómo puedes aplicar esto?',
                '¿Qué más descubres?'
            ]
        };

        return suggestions[state] || [
            '¿Qué te gustaría explorar?',
            'Cuéntame más',
            '¿Cómo te sientes al respecto?'
        ];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsePatterns, PATTERN_NAMES };
}

console.log('🎭 Response Patterns loaded');
