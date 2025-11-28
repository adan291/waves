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

    // Initial suggestions by wave type - now using i18n
    function getWaveSuggestions() {
        const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
        const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : translations.en;
        
        return {
            calm: t.suggestions.waves?.calm || [],
            deep: t.suggestions.waves?.deep || [],
            energetic: t.suggestions.waves?.energetic || [],
            healing: t.suggestions.waves?.healing || [],
            default: t.suggestions.waves?.calm || []
        };
    }

    // Helper function to get translations
    function getTranslations() {
        const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'es';
        const t = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : (translations?.es || {});
        return t;
    }

    /**
     * Get wave-specific examples based on selected wave
     * @returns {Array} Examples for the current wave
     */
    function getWaveExamples() {
        const t = getTranslations();
        const selectedWave = localStorage.getItem('whispers-selected-wave') || 'calm';
        return t.suggestions?.waveExamples?.[selectedWave] || t.suggestions?.waveExamples?.calm || [];
    }

    const CONTEXTUAL_SUGGESTIONS = {
        // All states now use wave-specific examples
        get confused() {
            return getWaveExamples();
        },
        
        get anxious() {
            return getWaveExamples();
        },
        get anxiety() {
            return getWaveExamples();
        },
        
        get processing() {
            return getWaveExamples();
        },
        
        get clarity() {
            return getWaveExamples();
        },
        
        get resolved() {
            return getWaveExamples();
        },
        get resolution() {
            return getWaveExamples();
        },
        
        get neutral() {
            return getWaveExamples();
        },
        
        // Life Questioning - also use wave examples
        get exploration() {
            return getWaveExamples();
        },
        get depth() {
            return getWaveExamples();
        },
        get identity() {
            return getWaveExamples();
        },
        get action() {
            return getWaveExamples();
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
    // AI-GENERATED CONTEXTUAL SUGGESTIONS
    // ============================================

    let isGeneratingSuggestions = false;
    let lastSuggestionsCacheKey = null;
    let lastSuggestionsCache = null;

    // Prompt template for suggestion generation
    const SUGGESTION_PROMPT_TEMPLATE = `Based on this conversation, generate exactly 3 short follow-up suggestions the user might want to say next. Each suggestion should be 3-8 words, natural and conversational.

User said: "{userMessage}"
AI responded: "{aiResponse}"

Rules:
- Write in {language}
- Return ONLY a JSON array of 3 strings, nothing else
- Each suggestion should explore a different direction
- Keep them short and natural
- No quotes or special formatting

Example output: ["Cuéntame más sobre eso", "¿Cómo puedo empezar?", "Me siento identificado"]`;

    /**
     * Get language display name
     * @param {string} langCode - Language code (es, en, ro)
     * @returns {string} Language name
     * @private
     */
    function getLanguageName(langCode) {
        const langNames = { es: 'español', en: 'English', ro: 'română' };
        return langNames[langCode] || 'español';
    }

    /**
     * Sanitize user input for prompt inclusion
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     * @private
     */
    function sanitizeForPrompt(text) {
        if (!text || typeof text !== 'string') return '';
        // Remove potential prompt injection patterns and limit length
        return text
            .replace(/["\n\r]/g, ' ')
            .substring(0, 500)
            .trim();
    }

    /**
     * Generate contextual suggestions based on conversation
     * @param {string} aiResponse - Last AI response (whisper + reflection)
     * @param {string} userMessage - Last user message
     * @returns {Promise<Array<string>|null>} Generated suggestions or null
     */
    async function generateContextualSuggestions(aiResponse, userMessage) {
        // Guard: prevent concurrent generation
        if (isGeneratingSuggestions) return null;
        
        // Guard: validate inputs
        if (!aiResponse || !userMessage || typeof GeminiService === 'undefined') return null;

        // Check cache to avoid duplicate API calls
        const cacheKey = `${userMessage.substring(0, 50)}|${aiResponse.substring(0, 50)}`;
        if (cacheKey === lastSuggestionsCacheKey && lastSuggestionsCache) {
            return lastSuggestionsCache;
        }

        isGeneratingSuggestions = true;

        try {
            const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'es';
            
            // Build prompt with sanitized inputs
            const prompt = SUGGESTION_PROMPT_TEMPLATE
                .replace('{userMessage}', sanitizeForPrompt(userMessage))
                .replace('{aiResponse}', sanitizeForPrompt(aiResponse))
                .replace('{language}', getLanguageName(lang));

            // Use singleton pattern for GeminiService
            const geminiService = GeminiService.getInstance();

            // Build conversation history format expected by sendMessage
            const conversationHistory = [{ role: 'user', content: prompt }];
            const response = await geminiService.sendMessage(conversationHistory);
            
            // Parse JSON array from response
            const jsonMatch = response.match(/\[[\s\S]*?\]/);
            if (jsonMatch) {
                const suggestions = JSON.parse(jsonMatch[0]);
                if (Array.isArray(suggestions) && suggestions.length > 0) {
                    const result = suggestions.slice(0, 3).map(s => String(s).trim());
                    // Cache successful result
                    lastSuggestionsCacheKey = cacheKey;
                    lastSuggestionsCache = result;
                    return result;
                }
            }
            return null;
        } catch (error) {
            console.warn('⚠️ Failed to generate contextual suggestions:', error);
            return null;
        } finally {
            isGeneratingSuggestions = false;
        }
    }

    /**
     * Get localized title for contextual suggestions
     * @returns {string} Localized title with emoji
     * @private
     */
    function getContextualTitle() {
        const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'es';
        const titles = {
            es: 'Continúa explorando:',
            en: 'Continue exploring:',
            ro: 'Continuă să explorezi:'
        };
        return '💭 ' + (titles[lang] || titles.es);
    }

    /**
     * Update suggestions with AI-generated contextual ones
     * @param {string} aiResponse - Last AI response
     * @param {string} userMessage - Last user message
     * @param {HTMLElement} container - Container element
     */
    async function updateWithContextual(aiResponse, userMessage, container) {
        if (!container || !aiResponse || !userMessage) return;
        
        // Generate contextual suggestions
        const contextualSuggestions = await generateContextualSuggestions(aiResponse, userMessage);
        
        if (contextualSuggestions && contextualSuggestions.length > 0) {
            renderSuggestions(getContextualTitle(), contextualSuggestions, container);
            console.log('💭 AI-generated suggestions displayed');
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
        const waveSuggestions = getWaveSuggestions();
        const suggestions = waveSuggestions[selectedWave] || waveSuggestions.default;
        
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
        updateWithContextual,
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

// Listen for AI response to generate contextual suggestions
document.addEventListener('ai:responseDisplayed', (event) => {
    const container = document.getElementById('suggestionsContainer');
    if (container && event.detail) {
        const { whisper, reflection, userMessage } = event.detail;
        const aiResponse = `${whisper || ''} ${reflection || ''}`.trim();
        if (aiResponse && userMessage) {
            SuggestionsModule.updateWithContextual(aiResponse, userMessage, container);
        }
    }
});

// Listen for language changes to update suggestions
document.addEventListener('language:changed', () => {
    const container = document.getElementById('suggestionsContainer');
    if (container) {
        // Re-render suggestions with new language
        if (typeof OceanDynamics !== 'undefined') {
            const currentState = OceanDynamics.getCurrentState();
            if (currentState && currentState.id) {
                SuggestionsModule.displayContextual(currentState.id, container);
            } else {
                SuggestionsModule.displayInitial(container);
            }
        } else {
            SuggestionsModule.displayInitial(container);
        }
        console.log('💭 Suggestions updated for language change');
    }
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
