/**
 * Gemini API Service
 * Handles communication with Google's Gemini API including TTS
 * 
 * @module services/geminiService
 */

// Configuration
// SECURITY: Never commit API keys to version control!
// Use js/config.local.js (gitignored) for local development

/**
 * Default configuration object
 * @private
 */
const DEFAULT_CONFIG = {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
    model: 'gemini-2.5-flash',
    fallbackModel: 'gemini-1.5-flash',
    ttsModel: 'gemini-2.5-flash-preview-tts',
    ttsVoice: 'Kore',
    maxRetries: 2,
    retryDelay: 2000 // 2 seconds
};


/**
 * Get configuration with fallbacks
 * @returns {Object} Configuration object
 * @private
 */
function getGeminiConfig() {
    return {
        ...DEFAULT_CONFIG,
        apiKey: (typeof localConfig !== 'undefined' && localConfig.apiKey)
            ? localConfig.apiKey
            : 'YOUR_API_KEY_HERE'
    };
}

// Constants
const GEMINI_CONSTANTS = {
    TTS_MAX_LENGTH: 5000,
    TTS_SAMPLE_RATE: 24000,
    TTS_CHANNELS: 1,
    RESPONSE_MODALITY: 'AUDIO'
};

const MESSAGE_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    MODEL: 'model'
};

/**
 * GeminiService class for API communication
 * Implements Singleton pattern to ensure single instance
 */
class GeminiService {
    /**
     * Singleton instance
     * @private
     * @static
     */
    static instance = null;

    /**
     * Create a new GeminiService instance (private constructor pattern)
     * @param {Object} config - Configuration object (optional)
     */
    constructor(config = {}) {
        // Singleton enforcement
        if (GeminiService.instance) {
            console.warn('GeminiService already initialized. Returning existing instance.');
            return GeminiService.instance;
        }

        // Merge configurations: defaults < localConfig < passed config
        const defaultConfig = getGeminiConfig();
        const finalConfig = { ...defaultConfig, ...config };

        this.apiKey = finalConfig.apiKey;
        this.baseUrl = finalConfig.endpoint;
        this.model = finalConfig.model;
        this.ttsModel = finalConfig.ttsModel;
        this.ttsVoice = finalConfig.ttsVoice;

        GeminiService.instance = this;
    }

    /**
     * Get singleton instance
     * @param {Object} config - Optional config for first initialization
     * @returns {GeminiService} Singleton instance
     * @static
     */
    static getInstance(config) {
        if (!GeminiService.instance) {
            new GeminiService(config);
        }
        return GeminiService.instance;
    }



    /**
     * Validate that API key is properly configured
     * @returns {boolean} True if API key is set and not placeholder
     */
    isConfigured() {
        return this.apiKey &&
            this.apiKey !== 'YOUR_API_KEY_HERE' &&
            this.apiKey.length > 0;
    }

    /**
     * Get sanitized key info for logging (shows only first/last 4 chars)
     * @returns {string} Sanitized key string for safe logging
     */
    getSanitizedKey() {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            return '[NOT CONFIGURED]';
        }
        if (this.apiKey.length < 12) {
            return '[INVALID KEY]';
        }
        return `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}`;
    }

    /**
     * Get the full API endpoint URL
     * @returns {string} Full endpoint URL
     */
    getEndpoint() {
        return `${this.baseUrl}${this.model}:generateContent?key=${this.apiKey}`;
    }

    /**
     * Get TTS endpoint URL
     * @returns {string} TTS endpoint URL
     * @private
     */
    getTTSEndpoint() {
        return `${this.baseUrl}${this.ttsModel}:generateContent?key=${this.apiKey}`;
    }

    /**
     * Format conversation history for Gemini API
     * @param {Array} history - Array of message objects
     * @param {string} systemPrompt - Optional system prompt to prepend
     * @returns {Array} Formatted messages for API
     */
    formatMessages(history, systemPrompt = null) {
        const messages = history.map(msg => ({
            role: msg.role === MESSAGE_ROLES.ASSISTANT ? MESSAGE_ROLES.MODEL : MESSAGE_ROLES.USER,
            parts: [{ text: msg.content }]
        }));

        // Prepend system prompt as first user message if provided
        if (systemPrompt && messages.length > 0) {
            messages[0].parts[0].text = systemPrompt + '\n\n' + messages[0].parts[0].text;
        }

        return messages;
    }

    /**
     * Send message to Gemini API
     * @param {Array} conversationHistory - Array of previous messages
     * @param {string} modelVariant - Model variant (ignored, for compatibility)
     * @param {string} systemPrompt - Optional system prompt for AI personality
     * @returns {Promise<string>} AI response text
     */
    async sendMessage(conversationHistory, modelVariant = null, systemPrompt = null) {
        // If only 2 params provided, second is systemPrompt (backward compatibility)
        if (arguments.length === 2 && typeof modelVariant === 'string') {
            systemPrompt = modelVariant;
            modelVariant = null;
        }

        // Validate input
        if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
            throw new Error('conversationHistory must be a non-empty array');
        }

        // Check cache
        const cacheKey = { history: conversationHistory, prompt: systemPrompt };
        if (typeof CacheManager !== 'undefined') {
            const cached = CacheManager.get('api_response', cacheKey);
            if (cached) {
                if (typeof Logger !== 'undefined') {
                    Logger.info('GeminiService', 'Using cached response');
                }
                return cached;
            }
        }

        // Start performance timing
        const endTiming = typeof PerformanceMonitor !== 'undefined'
            ? PerformanceMonitor.time('api_gemini_sendMessage')
            : () => { };

        try {
            // Format messages for Gemini API
            const formattedMessages = this.formatMessages(conversationHistory, systemPrompt);

            // Prepare request payload
            const payload = {
                contents: formattedMessages
            };

            // Try with retries and fallback model
            const config = getGeminiConfig();
            const models = [config.model, config.fallbackModel];
            let lastError = null;

            for (const model of models) {
                for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
                    try {
                        const endpoint = `${config.endpoint}${model}:generateContent?key=${config.apiKey}`;
                        
                        console.log(`🌊 Trying ${model} (attempt ${attempt + 1}/${config.maxRetries + 1})`);

                        const response = await fetch(endpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });

                        // Check for errors
                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            const errorMsg = errorData.error?.message || response.statusText;
                            
                            // If 503 (overloaded), wait and retry
                            if (response.status === 503 && attempt < config.maxRetries) {
                                console.log(`⏳ Model overloaded, waiting ${config.retryDelay}ms before retry...`);
                                await new Promise(resolve => setTimeout(resolve, config.retryDelay));
                                continue;
                            }
                            
                            throw new Error(`API Error: ${response.status} - ${errorMsg}`);
                        }

                        // Parse response
                        const data = await response.json();

                        // Extract text from response
                        if (data.candidates && data.candidates.length > 0) {
                            const candidate = data.candidates[0];
                            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                                const responseText = candidate.content.parts[0].text;

                                // Cache the response
                                if (typeof CacheManager !== 'undefined') {
                                    CacheManager.set('api_response', cacheKey, responseText);
                                }

                                console.log(`✅ Response received from ${model}`);
                                endTiming({ success: true });
                                return responseText;
                            }
                        }

                        throw new Error('No response text found in API response');

                    } catch (attemptError) {
                        lastError = attemptError;
                        console.warn(`⚠️ Attempt failed:`, attemptError.message);
                        
                        // If not a 503 error, don't retry with same model
                        if (!attemptError.message.includes('503')) {
                            break;
                        }
                    }
                }
                
                // Try fallback model
                if (model !== config.fallbackModel) {
                    console.log(`🔄 Switching to fallback model: ${config.fallbackModel}`);
                }
            }

            // All attempts failed
            throw lastError || new Error('All API attempts failed');

        } catch (error) {
            endTiming({ success: false, error: error.message });
            return this.handleError(error);
        }
    }

    /**
     * Generate Text-to-Speech audio from text
     * @param {string} text - Text to convert to speech
     * @param {string} voiceName - Voice name (default: 'Kore')
     * @returns {Promise<string|null>} Base64 encoded audio data or null on error
     * 
     * @example
     * const audioBase64 = await geminiService.getTTS('Hello ocean');
     * if (audioBase64) {
     *   // Use audioService to play the audio
     * }
     */
    async getTTS(text, voiceName = null) {
        if (!text || typeof text !== 'string') {
            console.error('getTTS() requires valid text string');
            return null;
        }

        // Validate text length
        if (text.length > GEMINI_CONSTANTS.TTS_MAX_LENGTH) {
            console.warn(`TTS text too long (${text.length} chars). Truncating to ${GEMINI_CONSTANTS.TTS_MAX_LENGTH}`);
            text = text.substring(0, GEMINI_CONSTANTS.TTS_MAX_LENGTH);
        }

        try {
            const payload = {
                contents: [{
                    parts: [{ text }]
                }],
                generationConfig: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: voiceName || this.ttsVoice
                            }
                        }
                    }
                }
            };

            const response = await fetch(this.getTTSEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`TTS API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();

            // Extract base64 audio from response
            const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (!base64Audio) {
                console.warn('No audio data in TTS response');
                return null;
            }


            return base64Audio;

        } catch (error) {
            console.error('TTS Error:', error);
            return null;
        }
    }

    /**
     * Handle API errors and return user-friendly messages
     * @param {Error} error - Error object
     * @returns {string} User-friendly error message
     */
    handleError(error) {
        // Use centralized error handler if available
        if (typeof handleError !== 'undefined') {
            const errorResponse = handleError(error, 'Gemini API');
            return errorResponse?.message || 'Error connecting to the ocean.';
        }

        // Fallback error handling
        console.error('Gemini API Error:', error);

        const errorMessage = error?.message || String(error) || '';

        if (errorMessage.includes('401') || errorMessage.includes('API key')) {
            return 'ERROR: Invalid API key. Please check your configuration.';
        }

        if (errorMessage.includes('429')) {
            return 'The ocean needs a moment to rest. Please wait briefly and try again.';
        }

        if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
            return 'The ocean is very busy right now. Please try again in a moment.';
        }

        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            return 'The waves are quiet right now. Please check your connection and try again.';
        }

        return 'The tide encountered an unexpected current. Please try again.';
    }
}



