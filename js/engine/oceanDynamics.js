/**
 * Ocean Dynamics Engine
 * Controls ocean background based on emotional state and conversation progress
 */

const OceanDynamics = {
    // Ocean states configuration
    states: {
        confused: {
            id: 'confused',
            name: 'Confusión',
            nameEn: 'Confusion',
            speed: 8, // seconds per animation cycle
            colors: {
                dark: ['#ff6b6b', '#ee5a6f', '#c44569', '#8b2635'],
                light: ['#ffb3ba', '#ff8fa3', '#ff6b9d', '#ff5e78']
            },
            intensity: 'high',
            description: 'Pensamientos dispersos, necesita claridad'
        },
        anxious: {
            id: 'anxious',
            name: 'Ansiedad',
            nameEn: 'Anxiety',
            speed: 6,
            colors: {
                dark: ['#ffa502', '#ff7f50', '#ff6348', '#e84118'],
                light: ['#ffd89b', '#ffb347', '#ff9a3c', '#ff8c42']
            },
            intensity: 'high',
            description: 'Preocupación, necesita calma'
        },
        processing: {
            id: 'processing',
            name: 'Procesando',
            nameEn: 'Processing',
            speed: 12,
            colors: {
                dark: ['#4fc3f7', '#29b6f6', '#039be5', '#0277bd'],
                light: ['#a8e6ff', '#7dd3fc', '#4fc3f7', '#29b6f6']
            },
            intensity: 'medium',
            description: 'Explorando ideas, en progreso'
        },
        clarity: {
            id: 'clarity',
            name: 'Claridad',
            nameEn: 'Clarity',
            speed: 18,
            colors: {
                dark: ['#80deea', '#b3e5fc', '#e1f5fe', '#b2ebf2'],
                light: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1']
            },
            intensity: 'low',
            description: 'Entendimiento emergente'
        },
        resolved: {
            id: 'resolved',
            name: 'Resolución',
            nameEn: 'Resolution',
            speed: 25,
            colors: {
                dark: ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5'],
                light: ['#c8f7dc', '#e8f5e9', '#fff9c4', '#ffe0b2']
            },
            intensity: 'very_low',
            description: 'Paz y comprensión alcanzadas'
        },
        neutral: {
            id: 'neutral',
            name: 'Neutral',
            nameEn: 'Neutral',
            speed: 15,
            colors: {
                dark: ['#0a1128', '#001f54', '#1a4d6d', '#40e0d0'],
                light: ['#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7']
            },
            intensity: 'medium',
            description: 'Estado inicial, exploratorio'
        }
    },

    currentState: 'neutral',
    currentTheme: 'dark',
    transitionDuration: 2000, // ms
    isTransitioning: false,

    /**
     * Initialize ocean dynamics
     */
    init() {
        this.currentTheme = document.body.dataset.theme === 'light' ? 'light' : 'dark';
        this.applyState(this.currentState, false);
        
        // Listen for theme changes
        document.addEventListener('theme:changed', (e) => {
            this.currentTheme = e.detail.theme;
            // Don't animate when only theme changes - just update colors
            // ThemeToggle will handle the animation restart
            this.applyState(this.currentState, false);
        });

        console.log('🌊 Ocean Dynamics initialized');
    },

    /**
     * Analyze message and determine emotional state
     * @param {string} message - User message
     * @returns {string} State ID
     */
    analyzeEmotionalState(message) {
        const text = message.toLowerCase();
        
        // Confusion indicators
        const confusionWords = ['no sé', 'confundido', 'perdido', 'no entiendo', 'qué hago', 'confused', 'lost', "don't know"];
        const confusionScore = confusionWords.filter(w => text.includes(w)).length;
        
        // Anxiety indicators
        const anxietyWords = ['preocupado', 'miedo', 'ansiedad', 'nervioso', 'estresado', 'worried', 'anxious', 'scared', 'stress'];
        const anxietyScore = anxietyWords.filter(w => text.includes(w)).length;
        
        // Clarity indicators
        const clarityWords = ['entiendo', 'claro', 'comprendo', 'veo', 'ahora sí', 'understand', 'clear', 'see', 'got it'];
        const clarityScore = clarityWords.filter(w => text.includes(w)).length;
        
        // Resolution indicators
        const resolutionWords = ['gracias', 'mejor', 'ayudó', 'paz', 'tranquilo', 'resuelto', 'thanks', 'better', 'helped', 'peace', 'resolved'];
        const resolutionScore = resolutionWords.filter(w => text.includes(w)).length;
        
        // Processing indicators (questions, exploration)
        const processingWords = ['por qué', 'cómo', 'cuándo', 'quizás', 'tal vez', 'podría', 'why', 'how', 'when', 'maybe', 'perhaps'];
        const processingScore = processingWords.filter(w => text.includes(w)).length;
        
        // Determine state based on scores
        const scores = {
            confused: confusionScore * 2,
            anxious: anxietyScore * 2,
            clarity: clarityScore * 1.5,
            resolved: resolutionScore * 2,
            processing: processingScore
        };
        
        // Get highest score
        const maxScore = Math.max(...Object.values(scores));
        
        if (maxScore === 0) {
            return 'neutral';
        }
        
        const state = Object.keys(scores).find(key => scores[key] === maxScore);
        return state || 'neutral';
    },

    /**
     * Update ocean state based on conversation
     * @param {string} userMessage - User's message
     * @param {object} aiResponse - AI's response
     * @param {object} conversationContext - Full conversation context
     */
    updateFromConversation(userMessage, aiResponse, conversationContext) {
        // Analyze user message
        const detectedState = this.analyzeEmotionalState(userMessage);
        
        // Check conversation history for patterns
        const history = conversationContext?.history || [];
        const recentMessages = history.slice(-5);
        
        // Detect progression towards resolution
        let progressionScore = 0;
        recentMessages.forEach((msg, index) => {
            if (msg.role === 'user') {
                const state = this.analyzeEmotionalState(msg.content);
                if (state === 'clarity' || state === 'resolved') {
                    progressionScore += (index + 1); // More weight to recent messages
                }
            }
        });
        
        // If showing clear progression, upgrade to clarity/resolved
        let finalState = detectedState;
        if (progressionScore > 8 && detectedState !== 'anxious' && detectedState !== 'confused') {
            finalState = 'clarity';
        }
        if (progressionScore > 15) {
            finalState = 'resolved';
        }
        
        // Apply the state
        this.setState(finalState);
        
        // Log for debugging
        console.log('🌊 Ocean state updated:', {
            detected: detectedState,
            final: finalState,
            progression: progressionScore,
            message: userMessage.substring(0, 50) + '...'
        });
        
        return finalState;
    },

    /**
     * Set ocean state
     * @param {string} stateId - State ID
     * @param {boolean} animate - Whether to animate transition
     */
    setState(stateId, animate = true) {
        if (!this.states[stateId]) {
            console.warn('Unknown ocean state:', stateId);
            return;
        }
        
        if (this.currentState === stateId && !animate) {
            return; // Already in this state
        }
        
        this.currentState = stateId;
        this.applyState(stateId, animate);
        
        // Emit event
        document.dispatchEvent(new CustomEvent('ocean:stateChanged', {
            detail: {
                state: stateId,
                config: this.states[stateId]
            }
        }));
    },

    /**
     * Apply state to ocean background
     * @param {string} stateId - State ID
     * @param {boolean} animate - Whether to animate transition (false when only theme changes)
     */
    applyState(stateId, animate = true) {
        const state = this.states[stateId];
        if (!state) return;
        
        const ocean = document.querySelector('.ocean-background');
        if (!ocean) {
            console.warn('Ocean background element not found');
            return;
        }
        
        // Prevent multiple simultaneous transitions
        if (this.isTransitioning && animate) {
            return;
        }
        
        const colors = state.colors[this.currentTheme];
        const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;
        
        if (animate) {
            this.isTransitioning = true;
            
            // Smooth transition
            ocean.style.transition = `background ${this.transitionDuration}ms ease-in-out, animation-duration ${this.transitionDuration}ms ease-in-out`;
            
            setTimeout(() => {
                this.isTransitioning = false;
                ocean.style.transition = '';
            }, this.transitionDuration);
        } else {
            // When theme changes, just update colors without animation
            ocean.style.transition = 'none';
        }
        
        // Apply styles
        ocean.style.background = gradient;
        ocean.style.backgroundSize = '400% 400%';
        ocean.style.animationDuration = `${state.speed}s`;
        
        // Store current state in data attribute
        ocean.dataset.oceanState = stateId;
    },

    /**
     * Get current state info
     * @returns {object} Current state configuration
     */
    getCurrentState() {
        return {
            id: this.currentState,
            ...this.states[this.currentState]
        };
    },

    /**
     * Get state by ID
     * @param {string} stateId - State ID
     * @returns {object} State configuration
     */
    getState(stateId) {
        return this.states[stateId];
    },

    /**
     * Force a specific state (for testing or manual control)
     * @param {string} stateId - State ID
     */
    forceState(stateId) {
        console.log('🌊 Forcing ocean state:', stateId);
        this.setState(stateId, true);
    },

    /**
     * Get progression percentage (neutral -> resolved)
     * @param {string} stateId - Current state
     * @returns {number} Percentage (0-100)
     */
    getProgressionPercentage(stateId) {
        const progression = {
            confused: 10,
            anxious: 20,
            neutral: 40,
            processing: 60,
            clarity: 80,
            resolved: 100
        };
        
        return progression[stateId] || 0;
    },

    /**
     * Create visual indicator of current state
     * @returns {HTMLElement} State indicator element
     */
    createStateIndicator() {
        const state = this.getCurrentState();
        const indicator = document.createElement('div');
        indicator.className = 'ocean-state-indicator';
        indicator.innerHTML = `
            <div class="state-indicator-content">
                <div class="state-color" style="background: ${state.colors[this.currentTheme][0]}"></div>
                <span class="state-name">${state.name}</span>
                <div class="state-progress" style="width: ${this.getProgressionPercentage(state.id)}%"></div>
            </div>
        `;
        return indicator;
    },

    /**
     * Reset to neutral state
     */
    reset() {
        this.setState('neutral', true);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        OceanDynamics.init();
    });
} else {
    OceanDynamics.init();
}

// Expose for debugging
window.OceanDynamics = OceanDynamics;
