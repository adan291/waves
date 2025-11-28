/**
 * Renderer Module
 * Handles rendering of messages and UI elements
 * Uses Revealing Module Pattern for encapsulation
 * 
 * @module ui/renderer
 */

const RendererModule = (function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    /**
     * Mode configuration with icons and i18n keys
     * @private
     * @const
     */
    const MODE_CONFIG = {
        'default': { icon: '🌊', i18nKey: 'personas.guardian', fallback: 'The Wave Guardian' },
        'guardian': { icon: '🌊', i18nKey: 'personas.guardian', fallback: 'The Wave Guardian' },
        'companion': { icon: '🌙', i18nKey: 'personas.companion', fallback: 'The Ocean Companion' },
        'deep_explorer': { icon: '🔮', i18nKey: 'personas.deep_explorer', fallback: 'The Deep Explorer' },
        'problem_solver': { icon: '🧭', i18nKey: 'personas.problem_solver', fallback: 'The Problem Solver' },
        'healer': { icon: '💙', i18nKey: 'personas.healer', fallback: 'The Healer' },
        'life_questioning': { icon: '✨', i18nKey: 'personas.life_questioning', fallback: 'The Purpose Guide' },
        // Legacy modes (deprecated - kept for backwards compatibility)
        'modoA': { icon: '🎭', name: 'Escenas Poéticas' },
        'modoB': { icon: '💙', name: 'Exploración Emocional' },
        'modoC': { icon: '🧭', name: 'Guía de Claridad' },
        'narrador': { icon: '📖', i18nKey: 'personas.narrador', fallback: 'The Sea Narrator' },
        'kiro': { icon: '🌙', i18nKey: 'personas.kiro', fallback: 'Kiro - Wave Whisper' }
    };

    // ============================================
    // PRIVATE HELPER FUNCTIONS
    // ============================================

    /**
     * Get the conversation container where messages should be added
     * @private
     * @returns {HTMLElement} The conversation container
     */
    function getConversationContainer() {
        return document.getElementById('messageDisplay');
    }

    /**
     * Safe translation helper with fallback
     * @private
     * @param {string} key - Translation key (dot notation)
     * @param {string} fallback - Fallback text if translation fails
     * @returns {string} Translated or fallback text
     */
    function safeTranslate(key, fallback) {
        if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            try {
                const translated = i18n.t(key);
                // Check if translation returned the key itself (not found)
                return translated !== key ? translated : fallback;
            } catch (e) {
                if (typeof Logger !== 'undefined') {
                    Logger.warn('Renderer', `Translation failed for key: ${key}`, e);
                }
                return fallback;
            }
        }
        return fallback;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     * @private
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Scroll to the last message - DISABLED
     * Auto-scroll is disabled to let user control their view
     * @private
     */
    const scrollToLastMessage = () => {
        // Auto-scroll disabled - user controls scroll position
    };
    
    // Alias for backward compatibility
    const scrollToBottom = scrollToLastMessage;

    // ============================================
    // PUBLIC FUNCTIONS
    // ============================================

    /**
     * Display a user message in the chat
     * @param {string} text - User message text
     * 
     * @example
     * RendererModule.displayUserMessage('Hello ocean');
     */
    function displayUserMessage(text) {
        const endTiming = typeof PerformanceMonitor !== 'undefined'
            ? PerformanceMonitor.time('render_userMessage')
            : () => { };

        if (!text || typeof text !== 'string') {
            if (typeof Logger !== 'undefined') {
                Logger.warn('Renderer', 'Invalid text provided to displayUserMessage');
            }
            endTiming({ success: false });
            return;
        }

        const conversationContainer = getConversationContainer();
        if (!conversationContainer) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Renderer', 'Conversation container not found');
            }
            endTiming({ success: false });
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;

        conversationContainer.appendChild(messageDiv);
        scrollToBottom();

        if (typeof Logger !== 'undefined') {
            Logger.debug('Renderer', 'User message displayed');
        }

        endTiming({ success: true });
    }

    /**
     * Display whisper section
     * @param {string} text - Whisper text
     * @param {string} messageId - Optional message ID
     * @param {Object} options - Display options
     * @param {boolean} [options.autoScroll=true] - Whether to auto-scroll to the message
     * 
     * @example
     * RendererModule.displayWhisper('El océano susurra...', 'msg-123');
     * RendererModule.displayWhisper('El océano susurra...', 'msg-123', { autoScroll: false });
     */
    function displayWhisper(text, messageId = null, options = {}) {
        const { autoScroll = true } = options;
        if (!text || typeof text !== 'string') {
            console.warn('displayWhisper: Invalid text provided');
            return;
        }

        const messageDisplay = document.getElementById('messageDisplay');
        if (!messageDisplay) {
            console.error('displayWhisper: messageDisplay element not found');
            return;
        }

        // Ensure messageId exists for controls
        if (!messageId) {
            messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        // Create new container for whisper
        const container = document.createElement('div');
        container.className = 'message-container';
        container.dataset.messageId = messageId;

        // Create whisper section
        const whisper = document.createElement('div');
        whisper.className = 'whisper';

        // Create text content
        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.textContent = text;

        // Create audio button with unique ID for whisper section
        const audioId = `${messageId}-whisper`;
        let audioBtn;
        if (typeof createAudioButton === 'function') {
            audioBtn = createAudioButton(audioId, text);
        } else {
            // Fallback if controls.js not loaded
            audioBtn = document.createElement('button');
            audioBtn.className = 'audio-btn';
            audioBtn.innerHTML = '🔊';
            audioBtn.onclick = () => console.warn('Audio controls not loaded');
        }

        whisper.appendChild(textSpan);
        whisper.appendChild(audioBtn);

        container.appendChild(whisper);
        getConversationContainer().appendChild(container);

        if (autoScroll) {
            scrollToBottom();
        }

        console.log('🌊 Whisper displayed');
    }

    /**
     * Display wave reflection section
     * @param {string} text - Wave text
     * @param {string} messageId - Optional message ID
     * @param {Object} options - Display options
     * @param {boolean} [options.autoScroll=true] - Whether to auto-scroll to the message
     * 
     * @example
     * RendererModule.displayWave('¿Qué resuena en ti?', 'msg-123');
     * RendererModule.displayWave('¿Qué resuena en ti?', 'msg-123', { autoScroll: false });
     */
    function displayWave(text, messageId = null, options = {}) {
        const { autoScroll = true } = options;
        if (!text || typeof text !== 'string') {
            console.warn('displayWave: Invalid text provided');
            return;
        }

        const conversationContainer = getConversationContainer();
        if (!conversationContainer) {
            console.error('displayWave: conversation container not found');
            return;
        }

        // Get the last message container or create new one
        let container = conversationContainer.querySelector('.message-container:last-child');

        // Ensure messageId exists
        if (!messageId && container && container.dataset.messageId) {
            messageId = container.dataset.messageId;
        } else if (!messageId) {
            messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        if (!container || container.dataset.messageId !== messageId) {
            container = document.createElement('div');
            container.className = 'message-container';
            container.dataset.messageId = messageId;
            conversationContainer.appendChild(container);
        }

        // Create wave section
        const wave = document.createElement('div');
        wave.className = 'wave-reflection';

        // Create text content
        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.textContent = text;

        // Create audio button with unique ID for wave section
        const audioId = `${messageId}-wave`;
        let audioBtn;
        if (typeof createAudioButton === 'function') {
            audioBtn = createAudioButton(audioId, text);
        } else {
            // Fallback
            audioBtn = document.createElement('button');
            audioBtn.className = 'audio-btn';
            audioBtn.innerHTML = '🔊';
            audioBtn.onclick = () => console.warn('Audio controls not loaded');
        }

        wave.appendChild(textSpan);
        wave.appendChild(audioBtn);

        container.appendChild(wave);

        if (autoScroll) {
            scrollToBottom();
        }

        console.log('🌙 Wave displayed');
    }

    /**
     * Display complete AI response (both whisper and wave)
     * @param {Object} response - Response object with whisper and wave properties
     * @param {string} messageId - Optional message ID
     * 
     * @example
     * RendererModule.displayAIResponse({ whisper: '...', wave: '...' }, 'msg-123');
     */
    function displayAIResponse(response, messageId = null) {
        if (!response) {
            console.warn('displayAIResponse: No response provided');
            return;
        }

        // Display whisper first
        if (response.whisper) {
            displayWhisper(response.whisper, messageId);
        }

        // Delay wave section slightly for cascading effect
        if (response.wave) {
            setTimeout(() => {
                displayWave(response.wave, messageId);
            }, 100);
        }

        console.log('✅ AI response displayed completely');
    }

    /**
     * Show typing indicator
     * Uses centralized i18n system for translations
     * 
     * @example
     * RendererModule.showTypingIndicator();
     */
    function showTypingIndicator() {
        const messageDisplay = document.getElementById('messageDisplay');
        if (!messageDisplay) {
            console.error('showTypingIndicator: messageDisplay element not found');
            return;
        }

        // Remove existing indicator if present
        hideTypingIndicator();

        // Get translated message using safe helper
        const message = safeTranslate('ui.typingIndicator', 'The waves are forming a response...');

        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-indicator-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span class="typing-indicator-text">${escapeHtml(message)}</span>
        `;

        getConversationContainer().appendChild(indicator);
        // Don't scroll here - let user control scroll after initial message

        console.log('⏳ Typing indicator shown');
    }

    /**
     * Hide typing indicator
     * 
     * @example
     * RendererModule.hideTypingIndicator();
     */
    function hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
            console.log('✅ Typing indicator hidden');
        }
    }

    /**
     * Clear the input field
     * 
     * @example
     * RendererModule.clearInput();
     */
    function clearInput() {
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = '';
        }
    }

    /**
     * Update mode indicator in UI
     * Uses MODE_CONFIG for centralized configuration
     * 
     * @param {string} mode - Current mode (default, guardian, companion, etc.)
     * @param {string} persona - Optional persona override
     * 
     * @example
     * RendererModule.updateModeIndicator('guardian');
     * RendererModule.updateModeIndicator('default', 'kiro');
     */
    function updateModeIndicator(mode, persona = null) {
        const modeIndicator = document.getElementById('modeIndicator');
        if (!modeIndicator) return;

        const modeText = document.getElementById('modeText');
        const modeIcon = modeIndicator.querySelector('.mode-icon');

        if (!modeText || !modeIcon) return;

        // Determine which mode to display (persona overrides mode)
        const activeMode = persona || mode || 'default';
        const config = MODE_CONFIG[activeMode] || MODE_CONFIG['default'];

        // Get translated name using centralized helper
        let displayName;
        if (config.i18nKey) {
            // Use i18n system with fallback
            displayName = safeTranslate(config.i18nKey, config.fallback);
        } else if (config.name) {
            // Legacy mode with hardcoded name
            displayName = config.name;
        } else {
            displayName = config.fallback || 'The Wave Guardian';
        }

        // Get icon from config
        const displayIcon = config.icon || '🌊';

        // Get selected wave name and append if available
        const selectedWave = localStorage.getItem('whispers-selected-wave');
        if (selectedWave) {
            const waveKey = `waves.${selectedWave}.name`;
            const waveName = safeTranslate(waveKey, '');
            if (waveName) {
                displayName = `${displayName} - ${waveName}`;
            }
        }

        // Update icon and text
        modeIcon.textContent = displayIcon;
        modeText.textContent = displayName;

        // Trigger fade-in animation
        modeIndicator.style.animation = 'none';
        void modeIndicator.offsetWidth; // Force reflow
        modeIndicator.style.animation = 'fadeIn 0.5s ease-in';

        if (typeof Logger !== 'undefined') {
            Logger.debug('Renderer', `Mode indicator updated: ${displayName}`);
        } else {
            console.log(`🎭 Mode indicator updated: ${displayName}`);
        }
    }

    // ============================================
    // PRIVATE HELPER: GET CURRENT PERSONA
    // ============================================

    /**
     * Get current persona from AppFacade or return default
     * @private
     * @returns {string} Current persona identifier
     */
    function getCurrentPersona() {
        if (typeof AppFacade !== 'undefined' && typeof AppFacade.getCurrentPersona === 'function') {
            return AppFacade.getCurrentPersona();
        }
        return 'narrador';
    }

    /**
     * Refresh mode indicator with current state
     * Called when language changes or other events require UI refresh
     * @private
     */
    function refreshModeIndicator() {
        const modeIndicator = document.getElementById('modeIndicator');
        if (!modeIndicator) return;
        
        updateModeIndicator('default', getCurrentPersona());
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    // Update mode indicator when language changes
    document.addEventListener('language:changed', refreshModeIndicator);

    // ============================================
    // PUBLIC API
    // ============================================

    return {
        displayUserMessage,
        displayWhisper,
        displayWave,
        displayAIResponse,
        showTypingIndicator,
        hideTypingIndicator,
        clearInput,
        updateModeIndicator
    };

})();

// Expose to window for AppFacade
window.RendererModule = RendererModule;
