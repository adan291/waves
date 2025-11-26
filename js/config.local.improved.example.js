/**
 * Local Configuration (Improved Version)
 * This file is gitignored - safe for API keys
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to config.local.js
 * 2. Replace 'YOUR_API_KEY_HERE' with your actual Gemini API key
 * 3. Get your key from: https://makersuite.google.com/app/apikey
 * 
 * SECURITY WARNINGS:
 * - Never commit this file with a real API key
 * - Keep this file in .gitignore
 * - Rotate your key immediately if accidentally exposed
 * - Don't share screenshots or logs containing this file
 * 
 * @global
 */

/**
 * Validate Gemini API key format
 * @param {string} key - API key to validate
 * @returns {boolean} True if key appears valid
 */
function validateGeminiApiKey(key) {
    return key && 
           typeof key === 'string' &&
           key.startsWith('AIzaSy') && 
           key.length === 39 &&
           key !== 'YOUR_API_KEY_HERE';
}

/**
 * Local configuration object with validation
 * @type {Object}
 */
const localConfig = Object.freeze({
    /**
     * Gemini API Key
     * @private
     */
    _apiKey: 'YOUR_API_KEY_HERE',
    
    /**
     * Get API key with validation
     * @returns {string} API key
     * @throws {Error} If key is invalid or not configured
     */
    get apiKey() {
        if (this._apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error(
                '⚠️ Gemini API key not configured.\n' +
                'Please edit js/config.local.js and add your API key.\n' +
                'Get one free at: https://makersuite.google.com/app/apikey'
            );
        }
        
        if (!validateGeminiApiKey(this._apiKey)) {
            throw new Error(
                '⚠️ Invalid Gemini API key format.\n' +
                'Expected format: AIzaSy... (39 characters)\n' +
                'Please check your key in js/config.local.js'
            );
        }
        
        return this._apiKey;
    },
    
    /**
     * Check if API key is configured and valid
     * @returns {boolean}
     */
    isConfigured() {
        return this._apiKey !== 'YOUR_API_KEY_HERE' && 
               validateGeminiApiKey(this._apiKey);
    },
    
    /**
     * Get user-friendly setup message
     * @returns {string}
     */
    getSetupMessage() {
        const isDev = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
        
        if (isDev) {
            return 'Configure your API key in js/config.local.js';
        }
        return 'Please configure your Gemini API key. See SECURITY_SETUP.md for instructions.';
    }
});

// Export to window for global access
if (typeof window !== 'undefined') {
    window.localConfig = localConfig;
}

console.log('🔐 Configuration loaded:', localConfig.isConfigured() ? '✅ Valid' : '⚠️ Not configured');
