/**
 * Suggestions Module
 * Provides contextual suggestions to guide user responses
 * Uses Revealing Module Pattern for encapsulation
 * 
 * @module ui/suggestions
 */

const SuggestionsModule = (function() {
    'use strict';

    // ============================================
    // PRIVATE CONSTANTS
    // ============================================

    // Initial suggestions by wave type
    const WAVE_SUGGESTIONS = {
        calm: [
            "Quiero tomarme tiempo para conocerme mejor",
            "¿Qué es lo que realmente me hace feliz?",
            "Necesito entender mis valores antes de decidir",
            "Quiero explorar sin presión qué me llama"
        ],
        deep: [
            "Siento que hay algo más profundo detrás de mi confusión",
            "Tengo miedos que no logro identificar",
            "¿Por qué me cuesta tanto decidir?",
            "Quiero entender qué me está bloqueando"
        ],
        energetic: [
            "Necesito decidir pronto entre estas opciones",
            "Quiero un plan de acción concreto",
            "¿Cuál es el primer paso que debo dar?",
            "Necesito momentum para empezar"
        ],
        healing: [
            "Estoy agotado de tanta presión",
            "Necesito procesar mis emociones primero",
            "Me siento abrumado por todas las expectativas",
            "Quiero encontrar paz antes de decidir"
        ],
        default: [
            "No sé qué estudiar",
            "Estoy perdido con mi vida",
            "No tengo claro mi propósito",
            "¿Qué carrera debería elegir?",
            "Me siento confundido",
            "Necesito orientación"
        ]
    };

    const CONTEXTUAL_SUGGESTIONS = {
        // Estado inicial - Confusión/Exploración
        confused: [
            "Me da miedo equivocarme de carrera",
            "Siento presión por elegir algo pronto",
            "No sé qué me apasiona realmente",
            "Tengo varias opciones pero no sé cuál elegir"
        ],
        
        // Profundizando - Ansiedad/Preocupación
        anxious: [
            "Tengo miedo de invertir años en algo equivocado",
            "Me preocupa decepcionar a mi familia",
            "Siento que todos esperan algo de mí",
            "Tengo miedo de no ser lo suficientemente bueno"
        ],
        anxiety: [ // Alias para compatibilidad
            "Tengo miedo de invertir años en algo equivocado",
            "Me preocupa decepcionar a mi familia",
            "Siento que todos esperan algo de mí",
            "Tengo miedo de no ser lo suficientemente bueno"
        ],
        
        // Procesando - Reflexión
        processing: [
            "Me gusta ayudar a las personas",
            "Disfruto crear cosas nuevas",
            "Me interesa entender cómo funcionan las cosas",
            "Quiero hacer algo que tenga impacto"
        ],
        
        // Claridad emergente
        clarity: [
            "Creo que me inclino más por esta opción",
            "Ahora veo más claro lo que quiero",
            "Siento que esta área me llama más",
            "Empiezo a ver un camino posible"
        ],
        
        // Resolución - Acción
        resolved: [
            "Voy a investigar más sobre esta carrera",
            "Quiero hablar con alguien que trabaje en esto",
            "Voy a probar un curso online para ver si me gusta",
            "Necesito hacer una lista de pros y contras"
        ],
        resolution: [ // Alias para compatibilidad
            "Voy a investigar más sobre esta carrera",
            "Quiero hablar con alguien que trabaje en esto",
            "Voy a probar un curso online para ver si me gusta",
            "Necesito hacer una lista de pros y contras"
        ],
        
        // Estado neutral - Obtiene traducciones dinámicamente
        get neutral() {
            const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
            const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : translations.en;
            return t.suggestions.examples.neutral;
        },
        
        // Life Questioning específico - Obtiene traducciones dinámicamente
        get exploration() {
            const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
            const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : translations.en;
            return t.suggestions.examples.exploration;
        },
        get depth() {
            const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
            const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : translations.en;
            return t.suggestions.examples.depth;
        },
        get identity() {
            const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
            const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : translations.en;
            return t.suggestions.examples.identity;
        },
        get action() {
            const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
            const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : translations.en;
            return t.suggestions.examples.action;
        }
    };

    // ============================================
    // PRIVATE STATE
    // ============================================

    let currentContainer = null;

    // ============================================
    // PRIVATE HELPER FUNCTIONS
    // ============================================

    /**
     * Escape HTML to prevent XSS
     * @private
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Create suggestion button HTML
     * @private
     */
    function createSuggestionButton(suggestion) {
        return `
            <button class="suggestion-btn" data-suggestion="${escapeHtml(suggestion)}">
                ${escapeHtml(suggestion)}
            </button>
        `;
    }

    /**
     * Render suggestions container
     * @private
     */
    function renderSuggestions(title, suggestions, container) {
        const suggestionsHTML = `
            <div class="suggestions-container">
                <p class="suggestions-title">${title}</p>
                <div class="suggestions-buttons">
                    ${suggestions.map(createSuggestionButton).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = suggestionsHTML;
        attachListeners(container);
    }

    /**
     * Attach click listeners to suggestion buttons
     * @private
     */
    function attachListeners(container) {
        const buttons = container.querySelectorAll('.suggestion-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', handleSuggestionClick);
        });
    }

    /**
     * Handle suggestion button click
     * @private
     */
    function handleSuggestionClick(event) {
        const suggestion = event.currentTarget.getAttribute('data-suggestion');
        if (suggestion) {
            // Dispatch custom event instead of direct DOM manipulation
            const suggestionEvent = new CustomEvent('suggestionSelected', {
                detail: { text: suggestion },
                bubbles: true
            });
            document.dispatchEvent(suggestionEvent);
        }
    }

    // ============================================
    // PUBLIC API
    // ============================================

    /**
     * Display initial suggestions based on selected wave
     * @param {HTMLElement} container - Container element
     */
    function displayInitial(container) {
        if (!container) {
            console.error('SuggestionsModule: No container provided');
            return;
        }
        
        // Get selected wave from localStorage
        const selectedWave = localStorage.getItem('whispers-selected-wave');
        const suggestions = WAVE_SUGGESTIONS[selectedWave] || WAVE_SUGGESTIONS.default;
        
        // Get wave icon for title
        const waveIcons = {
            calm: '🌊',
            deep: '🌀',
            energetic: '⚡',
            healing: '💙'
        };
        const icon = waveIcons[selectedWave] || '💭';
        
        // Use i18n for title if available
        let titleText = 'Puedes empezar con:';
        if (typeof i18n !== 'undefined') {
            titleText = i18n.t('suggestions.startWith');
        }
        
        currentContainer = container;
        renderSuggestions(`${icon} ${titleText}`, suggestions, container);
        
        // Emit event for analytics/tracking
        document.dispatchEvent(new CustomEvent('suggestions:updated', {
            detail: { type: 'initial', waveType: selectedWave, count: suggestions.length }
        }));
    }

    /**
     * Resolve suggestion array from level (handles aliases)
     * @param {string} level - Level or alias
     * @returns {Array<string>} Suggestion array
     * @private
     */
    function resolveSuggestions(level) {
        // Alias mapping for backward compatibility
        const aliases = {
            confusion: 'confused',
            anxiety: 'anxious',
            resolution: 'resolved'
        };
        
        const resolvedLevel = aliases[level] || level;
        return CONTEXTUAL_SUGGESTIONS[resolvedLevel] || CONTEXTUAL_SUGGESTIONS.confused;
    }
    
    /**
     * Display contextual suggestions based on level or ocean state
     * @param {string} level - Current level/state (confusion, anxiety, processing, clarity, resolution, etc.)
     * @param {HTMLElement} container - Container element
     */
    function displayContextual(level, container) {
        if (!container) {
            console.error('SuggestionsModule: No container provided');
            return;
        }
        
        const suggestions = resolveSuggestions(level);
        
        // Use i18n for titles if available
        let title = '💭 Puedes compartir:';
        if (typeof i18n !== 'undefined') {
            const titleKeys = {
                confused: 'suggestions.shareThoughts',
                confusion: 'suggestions.shareThoughts',
                anxious: 'suggestions.exploreWorries',
                anxiety: 'suggestions.exploreWorries',
                processing: 'suggestions.reflect',
                clarity: 'suggestions.deepen',
                resolved: 'suggestions.nextSteps',
                resolution: 'suggestions.nextSteps',
                neutral: 'suggestions.shareThoughts',
                exploration: 'suggestions.startWith',
                depth: 'suggestions.deepen',
                identity: 'suggestions.deepen',
                action: 'suggestions.nextSteps'
            };
            
            const titleKey = titleKeys[level] || 'suggestions.shareThoughts';
            title = i18n.t(titleKey);
            
            // Add emoji based on state
            const emojis = {
                confused: '😕 ',
                confusion: '😕 ',
                anxious: '😰 ',
                anxiety: '😰 ',
                processing: '🤔 ',
                clarity: '💡 ',
                resolved: '✨ ',
                resolution: '✨ ',
                neutral: '💭 ',
                exploration: '💡 ',
                depth: '💡 ',
                identity: '💡 ',
                action: '💡 '
            };
            
            title = (emojis[level] || '💭 ') + title;
        }
        
        currentContainer = container;
        renderSuggestions(title, suggestions, container);
        
        // Emit event for analytics/tracking
        document.dispatchEvent(new CustomEvent('suggestions:updated', {
            detail: { level, count: suggestions.length }
        }));
    }

    /**
     * Clear suggestions from container
     * @param {HTMLElement} container - Container element (optional, uses current if not provided)
     */
    function clear(container) {
        const targetContainer = container || currentContainer;
        if (targetContainer) {
            targetContainer.innerHTML = '';
        }
    }

    /**
     * Initialize suggestions module
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of suggestions container
     * @param {Function} options.getState - Function to get application state
     */
    function init(options = {}) {
        const containerId = options.containerId || 'suggestionsContainer';
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn('SuggestionsModule: Container not found:', containerId);
            return;
        }

        // Check if there's conversation history
        const getStateFn = options.getState || (() => ({}));
        const state = getStateFn();
        const hasHistory = state.conversationHistory && state.conversationHistory.length > 0;
        
        if (!hasHistory) {
            displayInitial(container);
        }

        console.log('💭 Suggestions module initialized');
    }

    // Reveal public API
    return {
        init,
        displayInitial,
        displayContextual,
        clear
    };

})();

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SuggestionsModule.init());
} else {
    SuggestionsModule.init();
}

// Listen for suggestion selections and fill input
document.addEventListener('suggestionSelected', (event) => {
    const userInput = document.getElementById('userInput');
    if (userInput && event.detail.text) {
        userInput.value = event.detail.text;
        userInput.focus();
        userInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
});

// Listen for ocean state changes to update suggestions automatically
document.addEventListener('ocean:stateChanged', (event) => {
    const container = document.getElementById('suggestionsContainer');
    if (container && event.detail && event.detail.state) {
        // Update suggestions based on new ocean state
        SuggestionsModule.displayContextual(event.detail.state, container);
        console.log('💭 Suggestions updated for ocean state:', event.detail.state);
    }
});

// Listen for conversation updates to refresh suggestions
document.addEventListener('message:sent', () => {
    // Small delay to allow ocean state to update first
    setTimeout(() => {
        const container = document.getElementById('suggestionsContainer');
        if (container && typeof OceanDynamics !== 'undefined') {
            const currentState = OceanDynamics.getCurrentState();
            if (currentState && currentState.id) {
                SuggestionsModule.displayContextual(currentState.id, container);
            }
        }
    }, 500);
});

console.log('💭 Suggestions module loaded');


// Export functions to window for AppFacade
if (typeof window !== 'undefined') {
    window.displayInitialSuggestions = SuggestionsModule.displayInitial;
    window.displayContextualSuggestions = SuggestionsModule.displayContextual;
    window.clearSuggestions = SuggestionsModule.clear;
}

// Export for testing
if (typeof window !== 'undefined') {
    window.SuggestionSystem = SuggestionsModule;
}
