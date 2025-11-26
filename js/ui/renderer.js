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
    // PRIVATE HELPER FUNCTIONS
    // ============================================

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
     * Scroll message display to bottom
     * @private
     */
    const scrollToBottom = (function () {
        // Use RAF throttling for smooth scrolling
        const scroll = () => {
            const messageDisplay = document.getElementById('messageDisplay');
            if (messageDisplay) {
                messageDisplay.scrollTop = messageDisplay.scrollHeight;
            }
        };

        // Return throttled version if available
        return typeof rafThrottle !== 'undefined' ? rafThrottle(scroll) : scroll;
    })();

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

        const messageDisplay = document.getElementById('messageDisplay');
        if (!messageDisplay) {
            if (typeof Logger !== 'undefined') {
                Logger.error('Renderer', 'messageDisplay element not found');
            }
            endTiming({ success: false });
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;

        messageDisplay.appendChild(messageDiv);
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
     * 
     * @example
     * RendererModule.displayWhisper('El océano susurra...', 'msg-123');
     */
    /**
     * Display whisper section
     * @param {string} text - Whisper text
     * @param {string} messageId - Optional message ID
     * 
     * @example
     * RendererModule.displayWhisper('El océano susurra...', 'msg-123');
     */
    function displayWhisper(text, messageId = null) {
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

        // Create audio button using shared controls
        let audioBtn;
        if (typeof createAudioButton === 'function') {
            audioBtn = createAudioButton(messageId, text);
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
        messageDisplay.appendChild(container);
        scrollToBottom();

        console.log('🌊 Whisper displayed');
    }

    /**
     * Display wave reflection section
     * @param {string} text - Wave text
     * @param {string} messageId - Optional message ID
     * 
     * @example
     * RendererModule.displayWave('¿Qué resuena en ti?', 'msg-123');
     */
    function displayWave(text, messageId = null) {
        if (!text || typeof text !== 'string') {
            console.warn('displayWave: Invalid text provided');
            return;
        }

        const messageDisplay = document.getElementById('messageDisplay');
        if (!messageDisplay) {
            console.error('displayWave: messageDisplay element not found');
            return;
        }

        // Get the last message container or create new one
        let container = messageDisplay.querySelector('.message-container:last-child');

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
            messageDisplay.appendChild(container);
        }

        // Create wave section
        const wave = document.createElement('div');
        wave.className = 'wave-reflection';

        // Create text content
        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.textContent = text;

        // Create audio button using shared controls
        let audioBtn;
        if (typeof createAudioButton === 'function') {
            audioBtn = createAudioButton(messageId, text);
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
        scrollToBottom();

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

        // Get translated message from i18n system
        const message = (typeof i18n !== 'undefined' && i18n.t)
            ? i18n.t('ui.typingIndicator')
            : 'Las olas están formando una respuesta...'; // Fallback

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

        messageDisplay.appendChild(indicator);
        scrollToBottom();

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
     * @param {string} mode - Current mode (default, modoA, modoB, modoC)
     * @param {string} persona - Optional persona (narrador, kiro)
     * 
     * @example
     * RendererModule.updateModeIndicator('modoB');
     * RendererModule.updateModeIndicator('default', 'kiro');
     */
    function updateModeIndicator(mode, persona = null) {
        const modeIndicator = document.getElementById('modeIndicator');
        if (!modeIndicator) return;

        const modeText = document.getElementById('modeText');
        const modeIcon = modeIndicator.querySelector('.mode-icon');

        if (!modeText || !modeIcon) return;

        // Mode names
        const modeNames = {
            'default': 'El Guardián de la Ola',
            'modoA': 'Escenas Poéticas',
            'modoB': 'Exploración Emocional',
            'modoC': 'Guía de Claridad',
            'narrador': 'El Narrador del Mar',
            'kiro': 'Kiro - Susurro de la Ola'
        };

        // Mode icons
        const modeIcons = {
            'default': '🌊',
            'modoA': '🎭',
            'modoB': '💙',
            'modoC': '🧭',
            'narrador': '📖',
            'kiro': '🌙'
        };

        // Determine display based on persona or mode
        let displayName = modeNames[mode] || 'El Guardián de la Ola';
        let displayIcon = modeIcons[mode] || '🌊';

        if (persona) {
            displayName = modeNames[persona] || displayName;
            displayIcon = modeIcons[persona] || displayIcon;
        }

        // Update icon and text
        modeIcon.textContent = displayIcon;
        modeText.textContent = displayName;

        // Trigger fade-in animation
        modeIndicator.style.animation = 'none';
        void modeIndicator.offsetWidth; // Force reflow
        modeIndicator.style.animation = 'fadeIn 0.5s ease-in';

        console.log(`🎭 Mode indicator updated: ${displayName}`);
    }

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


