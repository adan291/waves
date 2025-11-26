/**
 * Language Selector Module
 * Handles language switching for Speech-to-Text and Text-to-Speech
 * 
 * @module features/languageSelector
 * @example
 * // Change language
 * LanguageSelector.changeLanguage('en');
 * 
 * // Get current language
 * const lang = LanguageSelector.getCurrentLanguage(); // 'en'
 */

const LanguageSelector = (() => {
    const STORAGE_KEY = 'whispers-language';
    
    /**
     * Supported languages configuration
     * @constant
     * @type {Object.<string, {code: string, name: string, flag: string, ttsVoice: string}>}
     */
    const LANGUAGES = Object.freeze({
        es: Object.freeze({
            code: 'es-ES',
            name: 'Español',
            flag: '🇪🇸',
            ttsVoice: 'es-ES-Standard-A'
        }),
        en: Object.freeze({
            code: 'en-US',
            name: 'English',
            flag: '🇬🇧',
            ttsVoice: 'en-US-Standard-C'
        }),
        ro: Object.freeze({
            code: 'ro-RO',
            name: 'Română',
            flag: '🇷🇴',
            ttsVoice: 'ro-RO-Standard-A'
        })
    });
    
    let currentLanguage = 'es';
    
    /**
     * Validate if language code is supported
     * @param {string} langCode - Language code to validate
     * @returns {boolean} True if language is supported
     */
    function isValidLanguage(langCode) {
        return langCode && LANGUAGES.hasOwnProperty(langCode);
    }
    
    /**
     * Initialize language selector
     */
    function init() {
        // Load saved language
        try {
            const savedLanguage = localStorage.getItem(STORAGE_KEY);
            if (isValidLanguage(savedLanguage)) {
                currentLanguage = savedLanguage;
            } else if (savedLanguage) {
                console.warn(`⚠️ Invalid saved language "${savedLanguage}", using default`);
            }
        } catch (error) {
            console.error('❌ Failed to load language preference:', error);
            // Continue with default language
        }
        
        // Check if selector exists before proceeding
        const selector = document.getElementById('languageSelector');
        if (!selector) {
            console.warn('⚠️ Language selector element not found in DOM');
            console.log('💡 Add <select id="languageSelector"> to HTML to enable language switching');
            // Still apply language for STT even without UI selector
            applyLanguage(currentLanguage);
            return;
        }
        
        // Setup selector
        setupSelector();
        
        // Apply language
        applyLanguage(currentLanguage);
        
        console.log('🌍 Language selector initialized:', currentLanguage);
    }
    
    /**
     * Setup language selector element
     */
    function setupSelector() {
        const selector = document.getElementById('languageSelector');
        if (!selector) {
            console.warn('Language selector not found');
            return;
        }
        
        // Set current value
        selector.value = currentLanguage;
        
        // Add change listener
        selector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
    
    /**
     * Change language
     * @param {string} langCode - Language code (es, en, ro)
     * @returns {boolean} True if language was changed successfully
     */
    function changeLanguage(langCode) {
        if (!isValidLanguage(langCode)) {
            console.warn('⚠️ Invalid language code:', langCode);
            return false;
        }
        
        currentLanguage = langCode;
        applyLanguage(langCode);
        saveLanguage(langCode);
        
        console.log('🌍 Language changed to:', LANGUAGES[langCode].name);
    }
    
    /**
     * Apply language to STT and TTS
     * @param {string} langCode - Language code
     */
    function applyLanguage(langCode) {
        const lang = LANGUAGES[langCode];
        
        // Update i18n system
        if (typeof i18n !== 'undefined') {
            i18n.setLanguage(langCode);
        }
        
        // Update Speech-to-Text language
        if (typeof SpeechToText !== 'undefined' && SpeechToText.setLanguage) {
            SpeechToText.setLanguage(lang.code);
        }
        
        // Update placeholder text
        updatePlaceholder(langCode);
        
        // Emit event for other modules (using UIEventBus pattern)
        if (typeof UIEventBus !== 'undefined') {
            UIEventBus.emit('language:changed', { 
                code: langCode, 
                config: lang 
            });
        }
    }
    
    /**
     * Update input placeholder based on language
     * Uses i18n system if available, falls back to hardcoded values
     * @param {string} langCode - Language code
     */
    function updatePlaceholder(langCode) {
        const userInput = document.getElementById('userInput');
        if (!userInput) return;
        
        // Use i18n system if available
        if (typeof i18n !== 'undefined') {
            userInput.placeholder = i18n.t('ui.placeholder');
            return;
        }
        
        // Fallback to hardcoded placeholders if i18n not loaded
        const placeholders = {
            es: 'Comparte tus pensamientos...',
            en: 'Share your thoughts...',
            ro: 'Împărtășește gândurile tale...'
        };
        
        userInput.placeholder = placeholders[langCode] || placeholders.es;
    }
    
    /**
     * Save language to localStorage
     * @param {string} langCode - Language code
     */
    function saveLanguage(langCode) {
        try {
            localStorage.setItem(STORAGE_KEY, langCode);
        } catch (error) {
            console.error('❌ Failed to save language preference:', error);
            // Continue gracefully - not critical
        }
    }
    
    /**
     * Get current language
     * @returns {string} Current language code
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }
    
    /**
     * Get current language config
     * @returns {Object} Language configuration
     */
    function getCurrentLanguageConfig() {
        return LANGUAGES[currentLanguage];
    }
    
    return {
        init,
        changeLanguage,
        getCurrentLanguage,
        getCurrentLanguageConfig,
        LANGUAGES
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LanguageSelector.init());
} else {
    LanguageSelector.init();
}

// Export to window
if (typeof window !== 'undefined') {
    window.LanguageSelector = LanguageSelector;
}
