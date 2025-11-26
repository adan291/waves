/**
 * Application Facade
 * Provides safe access to global functions with fallbacks
 * Simplifies the main message handling logic
 * 
 * @module core/appFacade
 */

const AppFacade = (function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    function getState() {
        return typeof window.getState === 'function' 
            ? window.getState() 
            : { isProcessing: false, conversationHistory: [], currentPersona: 'narrador' };
    }

    function setState(updates) {
        if (typeof window.setState === 'function') {
            window.setState(updates);
        }
    }

    function getCurrentPersona() {
        return typeof window.getCurrentPersona === 'function'
            ? window.getCurrentPersona()
            : 'narrador';
    }

    // ============================================
    // UI OPERATIONS
    // ============================================

    function displayUserMessage(message) {
        if (window.RendererModule && typeof window.RendererModule.displayUserMessage === 'function') {
            window.RendererModule.displayUserMessage(message);
        } else if (typeof window.displayUserMessage === 'function') {
            // Fallback for backward compatibility
            window.displayUserMessage(message);
        }
    }

    function displayMessage(scene, messageId) {
        if (window.RendererModule && typeof window.RendererModule.displayAIResponse === 'function') {
            window.RendererModule.displayAIResponse(scene, messageId);
        } else if (typeof window.displayMessage === 'function') {
            window.displayMessage(scene, messageId);
        } else if (typeof window.displayAIResponse === 'function') {
            window.displayAIResponse(scene, messageId);
        }
    }

    function clearInput() {
        if (window.RendererModule && typeof window.RendererModule.clearInput === 'function') {
            window.RendererModule.clearInput();
        } else if (typeof window.clearInput === 'function') {
            window.clearInput();
        }
    }

    function showTypingIndicator() {
        if (window.RendererModule && typeof window.RendererModule.showTypingIndicator === 'function') {
            window.RendererModule.showTypingIndicator();
        } else if (typeof window.showTypingIndicator === 'function') {
            window.showTypingIndicator();
        }
    }

    function hideTypingIndicator() {
        if (window.RendererModule && typeof window.RendererModule.hideTypingIndicator === 'function') {
            window.RendererModule.hideTypingIndicator();
        } else if (typeof window.hideTypingIndicator === 'function') {
            window.hideTypingIndicator();
        }
    }

    function updateModeIndicator(mode, persona) {
        if (window.RendererModule && typeof window.RendererModule.updateModeIndicator === 'function') {
            window.RendererModule.updateModeIndicator(mode, persona);
        } else if (typeof window.updateModeIndicator === 'function') {
            window.updateModeIndicator(mode, persona);
        }
    }

    // ============================================
    // PERSONA MANAGEMENT
    // ============================================

    function switchPersona() {
        if (typeof window.switchPersona === 'function') {
            window.switchPersona();
        }
    }

    function incrementTurnCount() {
        if (typeof window.incrementTurnCount === 'function') {
            window.incrementTurnCount();
        }
    }

    function getPrompt(persona) {
        return typeof window.getPrompt === 'function'
            ? window.getPrompt(persona)
            : '';
    }

    // ============================================
    // LIFE QUESTIONING MODE
    // ============================================

    function detectLifeQuestioningTrigger(message) {
        return typeof window.detectLifeQuestioningTrigger === 'function'
            ? window.detectLifeQuestioningTrigger(message)
            : false;
    }

    function getLifeQuestioningState() {
        return typeof window.getLifeQuestioningState === 'function'
            ? window.getLifeQuestioningState()
            : { active: false };
    }

    function startLifeQuestioningSession(type) {
        if (typeof window.startLifeQuestioningSession === 'function') {
            window.startLifeQuestioningSession(type);
        }
    }

    function getLifeQuestioningPrompt(level) {
        return typeof window.getLifeQuestioningPrompt === 'function'
            ? window.getLifeQuestioningPrompt(level)
            : '';
    }

    function processLifeQuestioningResponse(message) {
        return typeof window.processLifeQuestioningResponse === 'function'
            ? window.processLifeQuestioningResponse(message)
            : null;
    }

    function resetLifeQuestioningState() {
        if (typeof window.resetLifeQuestioningState === 'function') {
            window.resetLifeQuestioningState();
        }
    }

    function displayContextualSuggestions(level, container) {
        if (typeof window.displayContextualSuggestions === 'function') {
            window.displayContextualSuggestions(level, container);
        } else if (window.SuggestionsModule && typeof window.SuggestionsModule.displayContextual === 'function') {
            window.SuggestionsModule.displayContextual(level, container);
        }
    }

    // ============================================
    // RESPONSE PARSING
    // ============================================

    function parseResponse(text, persona) {
        return typeof window.parseResponse === 'function'
            ? window.parseResponse(text, persona)
            : { whisper: text, reflection: '', persona: persona || 'narrador' };
    }

    function analyzeEmotionalTone(message) {
        return typeof window.analyzeEmotionalTone === 'function'
            ? window.analyzeEmotionalTone(message)
            : { tone: 'neutral', intensity: 0.5, keywords: [], emotions: [] };
    }

    // ============================================
    // PUBLIC API
    // ============================================

    return {
        // State
        getState,
        setState,
        getCurrentPersona,
        
        // UI
        displayUserMessage,
        displayMessage,
        clearInput,
        showTypingIndicator,
        hideTypingIndicator,
        updateModeIndicator,
        
        // Persona
        switchPersona,
        incrementTurnCount,
        getPrompt,
        
        // Life Questioning
        detectLifeQuestioningTrigger,
        getLifeQuestioningState,
        startLifeQuestioningSession,
        getLifeQuestioningPrompt,
        processLifeQuestioningResponse,
        resetLifeQuestioningState,
        displayContextualSuggestions,
        
        // Parsing
        parseResponse,
        analyzeEmotionalTone
    };

})();

console.log('🎭 AppFacade loaded');
