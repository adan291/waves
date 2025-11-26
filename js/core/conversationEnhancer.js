/**
 * Conversation Enhancer Module
 * Improves conversation quality by analyzing context and providing better responses
 * 
 * @module core/conversationEnhancer
 */

const ConversationEnhancer = {
    /**
     * Analyze conversation context for better responses
     * @param {string} userMessage - Current user message
     * @param {Array} conversationHistory - Previous messages
     * @returns {Object} Enhanced context
     */
    analyzeContext(userMessage, conversationHistory = []) {
        try {
            return {
                messageLength: userMessage.length,
                hasQuestion: userMessage.includes('?'),
                hasEmotionalWords: this.detectEmotionalWords(userMessage),
                emotionalIntensity: this.calculateEmotionalIntensity(userMessage),
                topicContinuity: this.analyzeTopicContinuity(userMessage, conversationHistory),
                isFollowUp: conversationHistory.length > 0,
                conversationDepth: conversationHistory.length,
                previousTopics: this.extractTopics(conversationHistory)
            };
        } catch (error) {
            console.error('Error analyzing context:', error);
            return {
                messageLength: userMessage.length,
                hasQuestion: false,
                hasEmotionalWords: [],
                emotionalIntensity: 0.5,
                topicContinuity: 0,
                isFollowUp: false,
                conversationDepth: 0,
                previousTopics: []
            };
        }
    },

    /**
     * Detect emotional words in message
     * @param {string} message - Message to analyze
     * @returns {Array} Emotional words found
     * @private
     */
    detectEmotionalWords(message) {
        const emotionalWords = {
            positive: ['feliz', 'alegre', 'amor', 'esperanza', 'éxito', 'orgulloso', 'confiado', 'tranquilo'],
            negative: ['triste', 'miedo', 'ansiedad', 'deprimido', 'solo', 'perdido', 'confundido', 'frustrado'],
            intense: ['terrible', 'horrible', 'maravilloso', 'increíble', 'devastador', 'abrumador']
        };

        const lowerMessage = message.toLowerCase();
        const found = {
            positive: [],
            negative: [],
            intense: []
        };

        for (const [category, words] of Object.entries(emotionalWords)) {
            for (const word of words) {
                if (lowerMessage.includes(word)) {
                    found[category].push(word);
                }
            }
        }

        return found;
    },

    /**
     * Calculate emotional intensity (0-1)
     * @param {string} message - Message to analyze
     * @returns {number} Intensity score
     * @private
     */
    calculateEmotionalIntensity(message) {
        let intensity = 0.5; // Default neutral

        // Increase for exclamation marks
        const exclamations = (message.match(/!/g) || []).length;
        intensity += exclamations * 0.1;

        // Increase for question marks (shows engagement)
        const questions = (message.match(/\?/g) || []).length;
        intensity += questions * 0.05;

        // Increase for caps (shows emphasis)
        const caps = (message.match(/[A-Z]/g) || []).length;
        if (caps > message.length * 0.3) {
            intensity += 0.2;
        }

        // Decrease for very short messages
        if (message.length < 20) {
            intensity -= 0.1;
        }

        // Clamp between 0 and 1
        return Math.max(0, Math.min(1, intensity));
    },

    /**
     * Analyze topic continuity with previous messages
     * @param {string} currentMessage - Current message
     * @param {Array} history - Conversation history
     * @returns {number} Continuity score (0-1)
     * @private
     */
    analyzeTopicContinuity(currentMessage, history) {
        if (history.length === 0) return 0;

        try {
            const currentWords = new Set(currentMessage.toLowerCase().split(/\s+/));
            const lastMessage = history[history.length - 1];
            
            if (!lastMessage || !lastMessage.content) return 0;

            const lastWords = new Set(lastMessage.content.toLowerCase().split(/\s+/));

            // Calculate word overlap
            let overlap = 0;
            for (const word of currentWords) {
                if (lastWords.has(word) && word.length > 3) {
                    overlap++;
                }
            }

            const continuity = overlap / Math.max(currentWords.size, lastWords.size);
            return Math.min(1, continuity);
        } catch (error) {
            return 0;
        }
    },

    /**
     * Extract main topics from conversation history
     * @param {Array} history - Conversation history
     * @returns {Array} Topics found
     * @private
     */
    extractTopics(history) {
        const topics = [];
        const topicKeywords = {
            'decisión': ['decidir', 'decisión', 'elegir', 'opción', 'camino'],
            'emocional': ['sentir', 'emoción', 'miedo', 'tristeza', 'alegría', 'ansiedad'],
            'relaciones': ['pareja', 'familia', 'amigos', 'relación', 'amor'],
            'trabajo': ['trabajo', 'carrera', 'empleo', 'profesión', 'laboral'],
            'salud': ['salud', 'enfermedad', 'médico', 'dolor', 'bienestar'],
            'personal': ['yo', 'mi', 'mío', 'personal', 'identidad']
        };

        for (const message of history.slice(-5)) { // Check last 5 messages
            if (!message.content) continue;
            const content = message.content.toLowerCase();

            for (const [topic, keywords] of Object.entries(topicKeywords)) {
                for (const keyword of keywords) {
                    if (content.includes(keyword) && !topics.includes(topic)) {
                        topics.push(topic);
                        break;
                    }
                }
            }
        }

        return topics;
    },

    /**
     * Generate context-aware system prompt enhancement
     * @param {Object} context - Enhanced context from analyzeContext
     * @returns {string} Prompt enhancement
     */
    generateContextEnhancement(context) {
        let enhancement = '';

        // Add emotional awareness
        if (context.hasEmotionalWords.negative.length > 0) {
            enhancement += '\n\nIMPORTANT: The user is expressing negative emotions. Prioritize validation and support.';
        }

        if (context.hasEmotionalWords.intense.length > 0) {
            enhancement += '\n\nIMPORTANT: The user is expressing intense emotions. Be especially empathetic and careful.';
        }

        // Add continuity guidance
        if (context.topicContinuity > 0.5) {
            enhancement += '\n\nThe user is continuing a previous topic. Maintain context and build on previous discussion.';
        }

        // Add depth guidance
        if (context.conversationDepth > 5) {
            enhancement += '\n\nThis is a deep conversation. Provide more nuanced and thoughtful responses.';
        }

        // Add question guidance
        if (context.hasQuestion) {
            enhancement += '\n\nThe user asked a question. Provide a direct, helpful answer.';
        }

        return enhancement;
    },

    /**
     * Improve response based on context
     * @param {Object} response - Original response
     * @param {Object} context - Enhanced context
     * @returns {Object} Improved response
     */
    improveResponse(response, context) {
        try {
            if (!response || typeof response !== 'object') {
                return response;
            }

            let whisper = response.whisper || '';
            let reflection = response.reflection || '';

            // Add emotional validation if needed
            if (context.hasEmotionalWords.negative.length > 0 && !whisper.includes('válid')) {
                whisper = '🔊 Es completamente válido lo que sientes. ' + whisper;
            }

            // Enhance for deep conversations
            if (context.conversationDepth > 5) {
                if (!reflection.includes('?')) {
                    reflection += ' ¿Qué aspecto te gustaría explorar más?';
                }
            }

            // Ensure response ends properly
            if (whisper && !whisper.match(/[.!?]$/)) {
                whisper += '.';
            }

            if (reflection && !reflection.match(/[.!?]$/)) {
                reflection += '.';
            }

            return {
                whisper: whisper.trim(),
                reflection: reflection.trim()
            };
        } catch (error) {
            console.error('Error improving response:', error);
            return response;
        }
    },

    /**
     * Detect if user needs immediate support
     * @param {string} message - User message
     * @returns {Object} Support assessment
     */
    assessSupportNeeds(message) {
        const criticalWords = ['suicida', 'muerte', 'morir', 'daño', 'peligro', 'crisis'];
        const supportWords = ['ayuda', 'no puedo', 'desesperado', 'solo', 'abandonado'];

        const lowerMessage = message.toLowerCase();
        const hasCritical = criticalWords.some(word => lowerMessage.includes(word));
        const hasSupport = supportWords.some(word => lowerMessage.includes(word));

        return {
            needsImmediateSupport: hasCritical,
            needsEmotionalSupport: hasSupport || hasCritical,
            severity: hasCritical ? 'critical' : (hasSupport ? 'high' : 'normal')
        };
    }
};

// Export to window
if (typeof window !== 'undefined') {
    window.ConversationEnhancer = ConversationEnhancer;
}

console.log('✅ Conversation Enhancer module loaded');
