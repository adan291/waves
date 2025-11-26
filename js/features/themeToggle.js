/**
 * Theme Toggle Module
 * Handles dark/light mode switching with persistence
 * 
 * Design Patterns:
 * - Revealing Module Pattern: Encapsulation and private state
 * - Strategy Pattern: Theme configurations as strategies
 * - Observer Pattern: Notify subscribers of theme changes
 */

const ThemeToggle = (() => {
    const STORAGE_KEY = 'whispers-theme';
    
    // Strategy Pattern: Theme configurations
    const THEME_CONFIGS = Object.freeze({
        dark: {
            name: 'dark',
            icon: '☀️',
            label: 'Cambiar a modo día',
            cssVars: Object.freeze({
                '--bg-gradient-start': '#0a1128',
                '--bg-gradient-mid': '#001f54',
                '--bg-gradient-end': '#40e0d0',
                '--text-primary': '#e0f7fa',
                '--text-secondary': '#b3e5fc',
                '--whisper-bg': 'rgba(10, 75, 94, 0.45)',
                '--wave-bg': 'rgba(10, 75, 94, 0.55)',
                '--input-bg': 'rgba(10, 75, 94, 0.8)',
                '--border-color': 'rgba(128, 222, 234, 0.5)'
            })
        },
        light: {
            name: 'light',
            icon: '🌙',
            label: 'Cambiar a modo noche',
            cssVars: Object.freeze({
                '--bg-gradient-start': '#e0f7fa',
                '--bg-gradient-mid': '#b2ebf2',
                '--bg-gradient-end': '#80deea',
                '--text-primary': '#01579b',
                '--text-secondary': '#0277bd',
                '--whisper-bg': 'rgba(255, 255, 255, 0.7)',
                '--wave-bg': 'rgba(255, 255, 255, 0.8)',
                '--input-bg': 'rgba(255, 255, 255, 0.9)',
                '--border-color': 'rgba(1, 87, 155, 0.3)'
            })
        }
    });
    
    // Private state
    let currentTheme = 'dark'; // Tema oscuro por defecto
    let isInitialized = false;
    let isApplyingTheme = false;
    const observers = [];
    
    // Observer Pattern: Subscribe to theme changes
    function subscribe(callback) {
        if (typeof callback !== 'function') {
            console.error('Theme observer must be a function');
            return () => {};
        }
        
        observers.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = observers.indexOf(callback);
            if (index > -1) observers.splice(index, 1);
        };
    }
    
    // Notify observers of theme change
    function notifyObservers(themeName) {
        const theme = THEME_CONFIGS[themeName];
        observers.forEach(callback => {
            try {
                callback(themeName, theme);
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }
    
    // Initialize theme system
    function init() {
        // Prevent double initialization
        if (isInitialized) return;
        isInitialized = true;
        
        // Load current theme from DOM (already set by inline script in HTML)
        const currentDataTheme = document.body.getAttribute('data-theme');
        if (currentDataTheme && THEME_CONFIGS[currentDataTheme]) {
            currentTheme = currentDataTheme;
        }
        
        // Wait for ocean-background element to exist before applying theme
        if (!document.querySelector('.ocean-background')) {
            const checkElement = setInterval(() => {
                if (document.querySelector('.ocean-background')) {
                    clearInterval(checkElement);
                    completeInit();
                }
            }, 50);
            
            // Timeout after 2 seconds
            setTimeout(() => clearInterval(checkElement), 2000);
        } else {
            completeInit();
        }
    }
    
    /**
     * Complete initialization after ocean-background is ready
     * @private
     */
    function completeInit() {
        // Ensure data-theme is set on body (html was set by inline script)
        document.body.setAttribute('data-theme', currentTheme);
        
        // Apply CSS variables and ensure data-theme is set
        applyTheme(currentTheme);
        
        // Setup UI
        setupToggleButton();
        
        console.log('🎨 Theme system initialized:', currentTheme);
    }
    
    // Setup existing toggle button in UI
    function setupToggleButton() {
        const toggleBtn = document.getElementById('themeToggle');
        
        if (!toggleBtn) {
            console.warn('⚠️ Theme toggle button not found - will retry');
            // Retry after a short delay in case DOM isn't fully ready
            setTimeout(() => {
                const retryBtn = document.getElementById('themeToggle');
                if (retryBtn) {
                    retryBtn.onclick = toggle;
                    updateUI(currentTheme);
                    console.log('✅ Theme toggle button found on retry');
                }
            }, 100);
            return;
        }
        
        // Update UI for current theme
        updateUI(currentTheme);
        
        // Add click handler
        toggleBtn.onclick = toggle;
        
        console.log('✅ Theme toggle button initialized');
    }
    
    // Update UI elements for theme
    function updateUI(themeName) {
        const theme = THEME_CONFIGS[themeName];
        if (!theme) return;
        
        const themeIcon = document.getElementById('themeIcon');
        const toggleBtn = document.getElementById('themeToggle');
        
        if (themeIcon) {
            themeIcon.textContent = theme.icon;
        }
        
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', theme.label);
            toggleBtn.setAttribute('title', theme.label);
        }
    }
    
    // Toggle between themes
    function toggle() {
        console.log('🎨 Toggle called, current theme:', currentTheme, 'isApplying:', isApplyingTheme);
        
        // Prevent rapid toggling
        if (isApplyingTheme) {
            console.warn('⚠️ Theme toggle blocked - already applying');
            return;
        }
        
        const oldTheme = currentTheme;
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(currentTheme);
        saveTheme(currentTheme);
        updateUI(currentTheme);
        
        // Notify observers
        notifyObservers(currentTheme);
        
        console.log(`🎨 Theme changed: ${oldTheme} → ${currentTheme}`);
    }
    
    // Apply theme to document (Strategy Pattern)
    function applyTheme(themeName) {
        // Prevent concurrent theme applications
        if (isApplyingTheme) {
            console.warn('⚠️ Theme application already in progress');
            return;
        }
        
        isApplyingTheme = true;
        
        const theme = THEME_CONFIGS[themeName];
        
        if (!theme) {
            console.error(`❌ Unknown theme: ${themeName}`);
            isApplyingTheme = false;
            return;
        }
        
        // Set data attribute for CSS on both html and body
        document.documentElement.setAttribute('data-theme', themeName);
        document.body.setAttribute('data-theme', themeName);
        
        // Force immediate reflow to ensure attribute is applied
        void document.body.offsetHeight;
        
        // Apply CSS variables from strategy
        const root = document.documentElement;
        Object.entries(theme.cssVars).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Emit theme change event for OceanDynamics and other systems FIRST
        // This allows them to update their internal state before animation restart
        document.dispatchEvent(new CustomEvent('theme:changed', {
            detail: { theme: themeName }
        }));
        
        // Update splash screen icon if it exists
        if (typeof window.SplashScreen !== 'undefined' && window.SplashScreen.updateSplashThemeIcon) {
            window.SplashScreen.updateSplashThemeIcon();
        }
        
        // Small delay to let other systems update, then restart animation
        // This prevents race conditions where multiple systems try to restart animation
        setTimeout(() => {
            const oceanBg = document.querySelector('.ocean-background');
            if (oceanBg) {
                restartOceanAnimation();
            }
            isApplyingTheme = false;
        }, 50);
        
        console.log(`🎨 Theme applied: ${themeName}`);
    }
    
    /**
     * Restart ocean background animation
     * Uses the most reliable cross-browser method: animation reset with reflow
     * @private
     */
    function restartOceanAnimation() {
        const oceanBg = document.querySelector('.ocean-background');
        
        if (!oceanBg) {
            console.warn('⚠️ Ocean background element not found for animation restart');
            return;
        }
        
        try {
            // Add transition class for smooth theme change
            oceanBg.classList.add('theme-transitioning');
            
            // Reset animation by temporarily disabling it
            oceanBg.style.animation = 'none';
            
            // Force multiple reflows to ensure changes are applied
            void oceanBg.offsetHeight;
            void oceanBg.offsetWidth;
            
            // Re-enable animation - browser will restart from beginning
            oceanBg.style.animation = '';
            
            // Remove transition class after animation restarts
            setTimeout(() => {
                oceanBg.classList.remove('theme-transitioning');
            }, 300);
            
            console.log('🌊 Ocean background animation restarted');
        } catch (error) {
            console.error('❌ Failed to restart ocean animation:', error);
        }
    }
    
    // Save theme to localStorage with error handling
    function saveTheme(themeName) {
        try {
            localStorage.setItem(STORAGE_KEY, themeName);
        } catch (error) {
            console.error('❌ Failed to save theme:', error);
        }
    }
    
    // Load theme from localStorage with error handling
    function loadTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.warn('⚠️ Failed to load theme:', error);
            return null;
        }
    }
    
    // Get current theme name
    function getCurrentTheme() {
        return currentTheme;
    }
    
    // Get theme configuration
    function getThemeConfig(themeName) {
        return THEME_CONFIGS[themeName] || null;
    }
    
    // Public API
    return {
        init,
        toggle,
        getCurrentTheme,
        getThemeConfig,
        subscribe,
        THEMES: Object.keys(THEME_CONFIGS) // ['dark', 'light']
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeToggle.init());
} else {
    ThemeToggle.init();
}
