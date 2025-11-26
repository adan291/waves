/**
 * Speech-to-Text Module
 * Voice input using Web Speech API
 */

const SpeechToText = (() => {
    let recognition = null;
    let isListening = false;
    let micButton = null;
    
    // Check if browser supports Speech Recognition
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    // Initialize speech recognition
    function init() {
        if (!isSupported) {
            console.warn('⚠️ Speech recognition not supported in this browser');
            return;
        }
        
        // Create recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.lang = 'es-ES'; // Spanish
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        // Setup event handlers
        recognition.onstart = handleStart;
        recognition.onresult = handleResult;
        recognition.onerror = handleError;
        recognition.onend = handleEnd;
        
        // Setup existing mic button
        setupMicButton();
        
        console.log('🎤 Speech-to-text initialized');
    }
    
    // Setup existing microphone button
    function setupMicButton() {
        micButton = document.getElementById('speechToTextBtn');
        
        if (!micButton) {
            console.warn('⚠️ Speech-to-text button not found');
            return;
        }
        
        // Add click handler
        micButton.onclick = toggleListening;
    }
    
    // Toggle listening state
    function toggleListening() {
        if (isListening) {
            stop();
        } else {
            start();
        }
    }
    
    // Start listening
    function start() {
        if (!recognition || isListening) return;
        
        try {
            recognition.start();
            console.log('🎤 Listening started');
        } catch (error) {
            console.error('Error starting recognition:', error);
        }
    }
    
    // Stop listening
    function stop() {
        if (!recognition || !isListening) return;
        
        try {
            recognition.stop();
            console.log('🎤 Listening stopped');
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
    
    // Handle recognition start
    function handleStart() {
        isListening = true;
        
        if (micButton) {
            micButton.classList.add('recording');
        }
        
        // Show visual feedback
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.placeholder = 'Escuchando...';
        }
    }
    
    // Handle recognition result
    function handleResult(event) {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        
        const userInput = document.getElementById('userInput');
        if (!userInput) return;
        
        if (isFinal) {
            // Final result - set input value
            userInput.value = transcript;
            console.log('🎤 Final transcript:', transcript);
        } else {
            // Interim result - show as placeholder
            userInput.placeholder = transcript + '...';
        }
    }
    
    // Handle recognition error
    function handleError(event) {
        console.error('🎤 Recognition error:', event.error);
        
        let errorMessage = 'Error de reconocimiento de voz';
        
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No se detectó voz';
                break;
            case 'audio-capture':
                errorMessage = 'No se pudo acceder al micrófono';
                break;
            case 'not-allowed':
                errorMessage = 'Permiso de micrófono denegado';
                break;
            case 'network':
                errorMessage = 'Error de red';
                break;
        }
        
        // Show error to user
        showError(errorMessage);
    }
    
    // Handle recognition end
    function handleEnd() {
        isListening = false;
        
        if (micButton) {
            micButton.classList.remove('recording');
        }
        
        const userInput = document.getElementById('userInput');
        if (userInput && userInput.placeholder === 'Escuchando...') {
            userInput.placeholder = 'Share your thoughts...';
        }
    }
    
    // Show error message
    function showError(message) {
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.placeholder = message;
            setTimeout(() => {
                userInput.placeholder = 'Share your thoughts...';
            }, 3000);
        }
    }
    
    // Check if supported
    function checkSupport() {
        return isSupported;
    }
    
    /**
     * Set recognition language
     * @param {string} langCode - Language code (e.g., 'es-ES', 'en-US')
     */
    function setLanguage(langCode) {
        if (recognition) {
            recognition.lang = langCode;
            console.log('🎤 Speech recognition language set to:', langCode);
        }
    }
    
    return {
        init,
        start,
        stop,
        setLanguage,
        isSupported: checkSupport
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpeechToText.init());
} else {
    SpeechToText.init();
}
