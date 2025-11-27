/**
 * Controls Module
 * Handles UI controls including audio buttons and interactions
 * 
 * @module ui/controls
 */

/**
 * Create audio controls for a message
 * @param {string} messageId - Message ID
 * @param {string} text - Text to convert to speech
 * 
 * @example
 * createAudioControls('msg-123', 'El océano susurra...');
 */
function createAudioControls(messageId, text) {
    if (!messageId || !text) {
        console.error('createAudioControls: Missing messageId or text');
        return;
    }
    
    // Find the message container
    const container = document.querySelector(`[data-message-id="${messageId}"]`);
    if (!container) {
        console.warn('createAudioControls: Container not found for', messageId);
        return;
    }
    
    // Check if controls already exist
    if (container.querySelector('.audio-controls')) {
        return;
    }
    
    // Create controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'audio-controls';
    controlsDiv.style.marginTop = '0.75rem';
    controlsDiv.style.display = 'flex';
    controlsDiv.style.gap = '0.5rem';
    
    // Create play button
    const playBtn = createAudioButton(messageId, text);
    controlsDiv.appendChild(playBtn);
    
    // Append to container
    container.appendChild(controlsDiv);
    
    console.log('🔊 Audio controls created for', messageId);
}

/**
 * Create audio play button
 * @param {string} messageId - Message ID
 * @param {string} text - Text to convert to speech
 * @returns {HTMLElement} Button element
 * 
 * @example
 * const button = createAudioButton('msg-123', 'Hello');
 */
/**
 * Get audio button text by language
 * @param {string} key - Text key (listen, generating, stop, error)
 * @returns {string} Translated text
 */
function getAudioText(key) {
    const lang = localStorage.getItem('whispers-language') || 'es';
    const texts = {
        listen: { es: '🔊 Escuchar', en: '🔊 Listen', ro: '🔊 Ascultă' },
        generating: { es: '⏳ Generando...', en: '⏳ Generating...', ro: '⏳ Se generează...' },
        stop: { es: '⏸️ Detener', en: '⏸️ Stop', ro: '⏸️ Oprește' },
        error: { es: '❌ Error', en: '❌ Error', ro: '❌ Eroare' },
        audioNotAvailable: { es: '❌ Audio no disponible', en: '❌ Audio not available', ro: '❌ Audio indisponibil' },
        serviceNotAvailable: { es: '❌ Servicio no disponible', en: '❌ Service not available', ro: '❌ Serviciu indisponibil' }
    };
    return texts[key]?.[lang] || texts[key]?.en || key;
}

function createAudioButton(messageId, text) {
    const button = document.createElement('button');
    button.className = 'audio-btn';
    button.dataset.messageId = messageId;
    button.dataset.text = text;
    button.textContent = getAudioText('listen');
    
    // Add click handler - use the text from dataset to ensure correct text is read
    button.addEventListener('click', () => {
        const textToRead = button.dataset.text;
        handleAudioClick(messageId, textToRead, button);
    });
    
    return button;
}

/**
 * Handle audio button click
 * @param {string} messageId - Message ID
 * @param {string} text - Text to convert to speech
 * @param {HTMLElement} button - Button element
 * 
 * @example
 * handleAudioClick('msg-123', 'Hello', buttonElement);
 */
async function handleAudioClick(messageId, text, button) {
    // Check if audioService is available
    if (typeof playTextToSpeech === 'undefined') {
        console.error('Audio service not loaded');
        button.textContent = getAudioText('audioNotAvailable');
        button.disabled = true;
        return;
    }
    
    // Check if GeminiService is available
    if (typeof GeminiService === 'undefined') {
        console.error('GeminiService not loaded');
        button.textContent = getAudioText('serviceNotAvailable');
        button.disabled = true;
        return;
    }
    
    // Check if already playing
    if (typeof isPlaying !== 'undefined' && isPlaying()) {
        console.log('Audio already playing, stopping...');
        if (typeof stopAudio !== 'undefined') {
            stopAudio();
        }
        updateAudioButtonState(messageId, 'ready');
        return;
    }
    
    try {
        // Update button state
        updateAudioButtonState(messageId, 'loading');
        
        // Get or create GeminiService instance
        let geminiService;
        if (typeof window.geminiServiceInstance !== 'undefined') {
            geminiService = window.geminiServiceInstance;
        } else {
            geminiService = new GeminiService();
            window.geminiServiceInstance = geminiService;
        }
        
        // Play audio
        const success = await playTextToSpeech(text, geminiService, messageId);
        
        if (success) {
            updateAudioButtonState(messageId, 'playing');
            
            // Listen for audio stop event
            if (typeof on !== 'undefined') {
                const unsubscribe = on('audio:stopped', (data) => {
                    if (data.messageId === messageId) {
                        updateAudioButtonState(messageId, 'ready');
                        unsubscribe();
                    }
                });
            }
        } else {
            updateAudioButtonState(messageId, 'error');
        }
        
    } catch (error) {
        console.error('Error playing audio:', error);
        updateAudioButtonState(messageId, 'error');
    }
}

/**
 * Update audio button state
 * @param {string} messageId - Message ID
 * @param {string} state - State (ready, loading, playing, error)
 * 
 * @example
 * updateAudioButtonState('msg-123', 'playing');
 */
function updateAudioButtonState(messageId, state) {
    const button = document.querySelector(`.audio-btn[data-message-id="${messageId}"]`);
    if (!button) return;
    
    const states = {
        ready: { text: getAudioText('listen'), disabled: false },
        loading: { text: getAudioText('generating'), disabled: true },
        playing: { text: getAudioText('stop'), disabled: false },
        error: { text: getAudioText('error'), disabled: true }
    };
    
    const stateConfig = states[state] || states.ready;
    button.textContent = stateConfig.text;
    button.disabled = stateConfig.disabled;
    
    // Re-enable error button after 2 seconds
    if (state === 'error') {
        setTimeout(() => {
            updateAudioButtonState(messageId, 'ready');
        }, 2000);
    }
}

/**
 * Create mode selector buttons (for future use)
 * @returns {HTMLElement} Mode selector container
 * 
 * @example
 * const selector = createModeSelector();
 * document.body.appendChild(selector);
 */
function createModeSelector() {
    const container = document.createElement('div');
    container.id = 'mode-selector';
    container.style.display = 'flex';
    container.style.gap = '0.5rem';
    container.style.marginBottom = '1rem';
    container.style.justifyContent = 'center';
    
    const modes = [
        { id: 'default', label: 'Libre', icon: '🌊' },
        { id: 'modoA', label: 'Escenas', icon: '🎭' },
        { id: 'modoB', label: 'Emocional', icon: '💙' },
        { id: 'modoC', label: 'Claridad', icon: '🧭' }
    ];
    
    modes.forEach(mode => {
        const button = document.createElement('button');
        button.className = 'mode-btn';
        button.dataset.mode = mode.id;
        button.textContent = `${mode.icon} ${mode.label}`;
        
        button.addEventListener('click', () => {
            // Update active state
            container.querySelectorAll('.mode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update mode indicator
            if (typeof updateModeIndicator !== 'undefined') {
                updateModeIndicator(mode.id);
            }
            
            // Emit event if available
            if (typeof emit !== 'undefined') {
                emit('mode:changed', { mode: mode.id });
            }
            
            // Update state if available
            if (typeof setState !== 'undefined') {
                setState({ currentMode: mode.id });
            }
            
            console.log('🎭 Mode changed to:', mode.id);
        });
        
        container.appendChild(button);
    });
    
    // Set default as active
    container.querySelector('[data-mode="default"]')?.classList.add('active');
    
    return container;
}

// ============================================
// MANUAL TEST - Run in browser console
// ============================================

/**
 * Test function to verify controls module
 * Run in browser console: testControlsModule()
 */
async function testControlsModule() {
    console.log('\n🧪 === TESTING CONTROLS MODULE ===\n');
    
    // Test 1: Create audio button
    console.log('Test 1: Create audio button');
    const button = createAudioButton('test-msg', 'Hello ocean');
    console.log('✅ Audio button created:', button);
    
    // Test 2: Update button state
    console.log('\nTest 2: Update button states');
    document.body.appendChild(button);
    
    updateAudioButtonState('test-msg', 'loading');
    console.log('✅ State: loading');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateAudioButtonState('test-msg', 'playing');
    console.log('✅ State: playing');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateAudioButtonState('test-msg', 'ready');
    console.log('✅ State: ready');
    
    button.remove();
    
    // Test 3: Create audio controls
    console.log('\nTest 3: Create audio controls');
    
    // Create a test message container
    const testContainer = document.createElement('div');
    testContainer.dataset.messageId = 'test-controls';
    testContainer.innerHTML = '<div class="whisper">Test message</div>';
    document.getElementById('messageDisplay')?.appendChild(testContainer);
    
    createAudioControls('test-controls', 'Test audio text');
    console.log('✅ Audio controls created');
    
    // Test 4: Create mode selector
    console.log('\nTest 4: Create mode selector');
    const selector = createModeSelector();
    console.log('✅ Mode selector created:', selector);
    
    // Test 5: Test audio click (requires services)
    console.log('\nTest 5: Test audio click');
    if (typeof GeminiService !== 'undefined' && typeof playTextToSpeech !== 'undefined') {
        console.log('⚠️ Services available but skipping actual audio playback in test');
        console.log('To test audio, click the audio button in the UI');
    } else {
        console.log('⚠️ Audio services not loaded');
    }
    
    console.log('\n🎉 === CONTROLS MODULE TEST COMPLETE ===\n');
}

// ============================================
// LANGUAGE CHANGE LISTENER
// ============================================

// Update all audio buttons when language changes
document.addEventListener('language:changed', () => {
    const audioButtons = document.querySelectorAll('.audio-btn');
    audioButtons.forEach(button => {
        // Only update if button is in ready state (not loading/playing)
        if (!button.disabled && !button.textContent.includes('⏳') && !button.textContent.includes('⏸️')) {
            button.textContent = getAudioText('listen');
        }
    });
});

// Auto-run test if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🌊 Controls module loaded. Run testControlsModule() to test.');
}
