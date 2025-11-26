/**
 * i18n UI Helper
 * Updates UI elements with translations
 */

const I18nUI = {
    /**
     * Update all elements with data-i18n attributes
     */
    updateUI() {
        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = i18n.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = i18n.t(key);
            if (translation !== key) {
                element.placeholder = translation;
            }
        });
        
        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = i18n.t(key);
            if (translation !== key) {
                element.title = translation;
            }
        });
        
        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = i18n.t(key);
            if (translation !== key) {
                element.setAttribute('aria-label', translation);
            }
        });
    },
    
    /**
     * Initialize i18n UI system
     */
    init() {
        // Update UI on load
        this.updateUI();
        
        // Listen for language changes
        document.addEventListener('language:changed', () => {
            this.updateUI();
        });
        
        console.log('🌐 i18n UI helper initialized');
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18nUI.init());
} else {
    I18nUI.init();
}

// Export to window
if (typeof window !== 'undefined') {
    window.I18nUI = I18nUI;
}
