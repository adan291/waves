/**
 * Wave Initialization Utility
 * Reusable script to apply wave backgrounds to any HTML page
 * 
 * @module WaveInit
 * @description Initializes wave backgrounds and theme from localStorage
 * 
 * Features:
 * - Applies saved wave background
 * - Applies saved theme (dark/light)
 * - Handles DOM ready state
 * - Graceful degradation if localStorage unavailable
 * 
 * Usage: Include this script in any HTML page
 * <script src="js/utils/waveInit.js"></script>
 */

(function() {
    'use strict';
    
    const WAVE_KEY = 'whispers-selected-wave';
    const THEME_KEY = 'whispers-theme';
    const VALID_THEMES = ['dark', 'light'];
    
    /**
     * Validate theme value
     * @private
     * @param {string} theme - Theme to validate
     * @returns {boolean} True if valid theme
     */
    function isValidTheme(theme) {
        return VALID_THEMES.includes(theme);
    }
    
    /**
     * Execute callback when DOM is ready
     * @private
     * @param {Function} callback - Function to execute
     */
    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }
    
    /**
     * Initialize wave background and theme
     * @param {Object} storage - Storage implementation (default: localStorage)
     */
    function initWaveBackground(storage = localStorage) {
        let wave = null;
        let theme = 'dark';
        
        try {
            wave = storage.getItem(WAVE_KEY);
            const savedTheme = storage.getItem(THEME_KEY);
            if (savedTheme && isValidTheme(savedTheme)) {
                theme = savedTheme;
            }
        } catch (e) {
            console.warn('localStorage not available');
        }
        
        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', theme);
        
        // Apply wave if selected
        if (wave) {
            document.documentElement.setAttribute('data-wave', wave);
            
            onDOMReady(function() {
                document.body.setAttribute('data-wave', wave);
                document.body.classList.add('ready');
            });
        } else {
            onDOMReady(function() {
                document.body.classList.add('ready');
            });
        }
    }
    
    // Initialize immediately
    initWaveBackground();
    
    console.log('🌊 Wave initialization utility loaded');
})();
