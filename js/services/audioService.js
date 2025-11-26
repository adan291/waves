/**
 * Audio Service Module
 * Handles audio playback and TTS integration
 * 
 * @module services/audioService
 */

/**
 * Audio state
 * @private
 */
const audioState = {
    currentSource: null,
    audioContext: null,
    isPlaying: false,
    currentMessageId: null
};

/**
 * Decode base64 string to Uint8Array
 * @param {string} base64 - Base64 encoded string
 * @returns {Uint8Array} Decoded bytes
 * @private
 */
function decode(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
}

/**
 * Decode audio data to AudioBuffer
 * @param {Uint8Array} data - Raw audio data
 * @param {AudioContext} ctx - Audio context
 * @param {number} sampleRate - Sample rate (default: 24000)
 * @param {number} numChannels - Number of channels (default: 1)
 * @returns {Promise<AudioBuffer>} Decoded audio buffer
 * @private
 */
async function decodeAudioData(data, ctx, sampleRate = 24000, numChannels = 1) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    
    return buffer;
}

/**
 * Initialize audio context
 * @returns {AudioContext} Audio context instance
 * @private
 */
function getAudioContext() {
    if (!audioState.audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioState.audioContext = new AudioContextClass({ sampleRate: 24000 });
        console.log('🔊 Audio context initialized');
    }
    return audioState.audioContext;
}

/**
 * Play audio from base64 encoded data
 * @param {string} base64Audio - Base64 encoded audio data
 * @param {string} messageId - Optional message ID for tracking
 * @returns {Promise<boolean>} True if playback started successfully
 * 
 * @example
 * const success = await playAudio(audioBase64, 'msg-123');
 */
async function playAudio(base64Audio, messageId = null) {
    if (!base64Audio || typeof base64Audio !== 'string') {
        console.error('playAudio() requires valid base64 audio string');
        return false;
    }

    // Stop current audio if playing
    if (audioState.isPlaying) {
        console.log('🛑 Stopping current audio before playing new one');
        stopAudio();
    }

    try {
        // Get or create audio context
        const ctx = getAudioContext();
        
        // Decode base64 to bytes
        const audioBytes = decode(base64Audio);
        
        // Decode audio data to buffer
        const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
        
        // Create source
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        // Set up state
        audioState.currentSource = source;
        audioState.isPlaying = true;
        audioState.currentMessageId = messageId;
        
        // Handle playback end
        source.onended = () => {
            console.log('🔇 Audio playback ended');
            audioState.isPlaying = false;
            audioState.currentSource = null;
            audioState.currentMessageId = null;
            
            // Emit event if events module is available
            if (typeof emit !== 'undefined') {
                emit('audio:stopped', { messageId });
            }
        };
        
        // Start playback
        source.start();
        console.log('▶️ Audio playback started', messageId ? `for message: ${messageId}` : '');
        
        // Emit event if events module is available
        if (typeof emit !== 'undefined') {
            emit('audio:played', { messageId });
        }
        
        return true;
        
    } catch (error) {
        console.error('Error playing audio:', error);
        audioState.isPlaying = false;
        audioState.currentSource = null;
        audioState.currentMessageId = null;
        return false;
    }
}

/**
 * Stop current audio playback
 * 
 * @example
 * stopAudio();
 */
function stopAudio() {
    if (audioState.currentSource) {
        try {
            audioState.currentSource.stop();
            audioState.currentSource.disconnect();
        } catch (error) {
            console.warn('Error stopping audio:', error);
        }
        
        audioState.currentSource = null;
    }
    
    audioState.isPlaying = false;
    const messageId = audioState.currentMessageId;
    audioState.currentMessageId = null;
    
    console.log('⏹️ Audio stopped');
    
    // Emit event if events module is available
    if (typeof emit !== 'undefined') {
        emit('audio:stopped', { messageId });
    }
}

/**
 * Check if audio is currently playing
 * @returns {boolean} True if audio is playing
 * 
 * @example
 * if (isPlaying()) {
 *   console.log('Audio is playing');
 * }
 */
function isPlaying() {
    return audioState.isPlaying;
}

/**
 * Get current playing message ID
 * @returns {string|null} Message ID or null
 * 
 * @example
 * const messageId = getCurrentMessageId();
 */
function getCurrentMessageId() {
    return audioState.currentMessageId;
}

/**
 * Play text using TTS (requires GeminiService)
 * @param {string} text - Text to convert to speech
 * @param {GeminiService} geminiService - Instance of GeminiService
 * @param {string} messageId - Optional message ID
 * @returns {Promise<boolean>} True if playback started successfully
 * 
 * @example
 * const success = await playTextToSpeech('Hello ocean', geminiService, 'msg-123');
 */
async function playTextToSpeech(text, geminiService, messageId = null) {
    if (!text || typeof text !== 'string') {
        console.error('playTextToSpeech() requires valid text string');
        return false;
    }

    if (!geminiService || typeof geminiService.getTTS !== 'function') {
        console.error('playTextToSpeech() requires valid GeminiService instance');
        return false;
    }

    try {
        console.log('🎤 Generating TTS audio...');
        
        // Show TTS status indicator
        showTTSStatus('Generando audio');
        
        // Generate TTS audio
        const base64Audio = await geminiService.getTTS(text);
        
        if (!base64Audio) {
            console.error('Failed to generate TTS audio');
            hideTTSStatus();
            return false;
        }
        
        // Update status
        showTTSStatus('Reproduciendo');
        
        // Play the audio
        const success = await playAudio(base64Audio, messageId);
        
        // Hide status after a short delay
        setTimeout(() => hideTTSStatus(), 1000);
        
        return success;
        
    } catch (error) {
        console.error('Error in playTextToSpeech:', error);
        hideTTSStatus();
        return false;
    }
}

/**
 * Show TTS status indicator
 * @param {string} message - Status message to display
 * @private
 */
function showTTSStatus(message = 'Generando audio') {
    const statusEl = document.getElementById('ttsStatus');
    if (statusEl) {
        const textEl = statusEl.querySelector('.tts-status-text');
        if (textEl) {
            // Set text without dots (dots are animated via CSS)
            const baseText = message.replace(/\.+$/, '');
            textEl.innerHTML = baseText + '<span class="loading-dots"></span>';
        }
        statusEl.classList.remove('hidden');
    }
}

/**
 * Hide TTS status indicator
 * @private
 */
function hideTTSStatus() {
    const statusEl = document.getElementById('ttsStatus');
    if (statusEl) {
        statusEl.classList.add('hidden');
    }
}


// ============================================
// MANUAL TEST - Run in browser console
// ============================================

/**
 * Test function to verify audio service
 * Run in browser console: testAudioService()
 */
async function testAudioService() {
    console.log('\n🧪 === TESTING AUDIO SERVICE ===\n');
    
    // Test 1: Check audio context
    console.log('Test 1: Initialize audio context');
    const ctx = getAudioContext();
    console.log('✅ Audio context created:', ctx.state);
    
    // Test 2: Check playing state
    console.log('\nTest 2: Check initial playing state');
    console.log('✅ Is playing:', isPlaying());
    console.log('✅ Current message ID:', getCurrentMessageId());
    
    // Test 3: Test with sample audio (requires actual base64 audio)
    console.log('\nTest 3: Audio playback');
    console.log('⚠️ Skipping playback test (requires actual audio data)');
    console.log('To test playback, use:');
    console.log('  const service = new GeminiService();');
    console.log('  const audio = await service.getTTS("Hello");');
    console.log('  await playAudio(audio, "test-msg");');
    
    // Test 4: Test TTS integration
    console.log('\nTest 4: TTS integration');
    if (typeof GeminiService !== 'undefined') {
        console.log('✅ GeminiService available');
        console.log('To test TTS, use:');
        console.log('  const service = new GeminiService();');
        console.log('  await playTextToSpeech("Hello ocean", service, "test-msg");');
    } else {
        console.log('⚠️ GeminiService not loaded yet');
    }
    
    console.log('\n🎉 === AUDIO SERVICE TEST COMPLETE ===\n');
}

// Auto-run test if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🌊 Audio service loaded. Run testAudioService() to test.');
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Audio Service Public API
 * @namespace AudioService
 */
window.AudioService = {
    // State
    ttsEnabled: false,
    currentAudio: null,
    
    // Methods
    playAudio,
    stopAudio,
    isPlaying,
    getCurrentMessageId,
    playTextToSpeech,
    
    // Test
    testAudioService
};

console.log('🔊 AudioService initialized and available globally');
