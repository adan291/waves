/**
 * Ocean State UI Component
 * Visual indicator and controls for ocean dynamics
 */

const OceanStateUI = {
    indicatorElement: null,
    showIndicator: true,
    boundLanguageHandler: null,

    /**
     * Get current language code
     * @returns {string} Language code (es, en, ro)
     */
    getLang() {
        return localStorage.getItem('whispers-language') || 'es';
    },

    /**
     * Get translated text for neutral state
     * @returns {string} Translated neutral text
     */
    getNeutralText() {
        const lang = this.getLang();
        const translations = { es: 'Neutral', en: 'Neutral', ro: 'Neutru' };
        return translations[lang] || translations.es;
    },

    /**
     * Initialize ocean state UI
     */
    init() {
        this.showIndicator = localStorage.getItem('whispers-show-ocean-indicator') !== 'false';
        
        if (this.showIndicator) {
            this.createIndicator();
        }

        // Listen for ocean state changes
        document.addEventListener('ocean:stateChanged', (e) => {
            this.updateIndicator(e.detail.state, e.detail.config);
        });

        console.log('🌊 Ocean State UI initialized');
    },

    /**
     * Create state indicator element
     */
    createIndicator() {
        if (this.indicatorElement) {
            return; // Already created
        }

        // Check if indicator already exists in DOM
        let indicator = document.getElementById('oceanStateIndicator');
        
        if (!indicator) {
            // Create new indicator
            indicator = document.createElement('div');
            indicator.id = 'oceanStateIndicator';
            indicator.className = 'ocean-state-indicator';
            indicator.innerHTML = `
                <div class="state-indicator-content">
                    <div class="state-color"></div>
                    <span class="state-name">${this.getNeutralText()}</span>
                    <div class="state-progress" style="width: 40%"></div>
                </div>
            `;
            document.body.appendChild(indicator);
        } else {
            // Update existing indicator with correct language
            const nameEl = indicator.querySelector('.state-name');
            if (nameEl) {
                nameEl.textContent = this.getNeutralText();
            }
        }

        this.indicatorElement = indicator;
        
        // Store bound handler for cleanup
        this.boundLanguageHandler = () => this.refreshIndicatorLanguage();
        document.addEventListener('language:changed', this.boundLanguageHandler);

        // Add click to toggle visibility
        indicator.addEventListener('click', () => {
            this.toggleDetails();
        });
    },

    /**
     * Refresh indicator text when language changes
     */
    refreshIndicatorLanguage() {
        if (!this.indicatorElement) return;
        
        const nameEl = this.indicatorElement.querySelector('.state-name');
        if (!nameEl) return;
        
        const lang = this.getLang();
        
        if (typeof OceanDynamics !== 'undefined') {
            const state = OceanDynamics.getCurrentState();
            if (state && state.name) {
                nameEl.textContent = lang === 'es' ? state.name : (state.nameEn || state.name);
                return;
            }
        }
        
        // Fallback to neutral text
        nameEl.textContent = this.getNeutralText();
    },

    /**
     * Update indicator with new state
     * @param {string} stateId - State ID
     * @param {object} config - State configuration
     */
    updateIndicator(stateId, config) {
        if (!this.indicatorElement) {
            return;
        }

        const colorEl = this.indicatorElement.querySelector('.state-color');
        const nameEl = this.indicatorElement.querySelector('.state-name');
        const progressEl = this.indicatorElement.querySelector('.state-progress');

        if (colorEl && config.colors) {
            const theme = document.body.dataset.theme === 'light' ? 'light' : 'dark';
            const color = config.colors[theme][0];
            colorEl.style.background = color;
            colorEl.style.boxShadow = `0 0 10px ${color}`;
        }

        if (nameEl) {
            const lang = this.getLang();
            nameEl.textContent = lang === 'es' ? config.name : config.nameEn;
        }

        if (progressEl && typeof OceanDynamics !== 'undefined') {
            const percentage = OceanDynamics.getProgressionPercentage(stateId);
            progressEl.style.width = `${percentage}%`;
        }

        // Add animation
        this.indicatorElement.style.animation = 'none';
        setTimeout(() => {
            this.indicatorElement.style.animation = '';
        }, 10);
    },

    /**
     * Toggle detailed state information
     */
    toggleDetails() {
        if (typeof OceanDynamics === 'undefined') {
            return;
        }

        const state = OceanDynamics.getCurrentState();
        const lang = this.getLang();
        
        const message = lang === 'es' 
            ? `Estado del Océano: ${state.name}\n${state.description}\nVelocidad: ${state.speed}s\nIntensidad: ${state.intensity}`
            : `Ocean State: ${state.nameEn}\n${state.description}\nSpeed: ${state.speed}s\nIntensity: ${state.intensity}`;

        console.log('🌊', message);
        
        // Could show a modal or tooltip here
    },

    /**
     * Hide indicator
     */
    hide() {
        if (this.indicatorElement) {
            this.indicatorElement.classList.add('hidden');
        }
        this.showIndicator = false;
        localStorage.setItem('whispers-show-ocean-indicator', 'false');
    },

    /**
     * Show indicator
     */
    show() {
        if (!this.indicatorElement) {
            this.createIndicator();
        }
        this.indicatorElement.classList.remove('hidden');
        this.showIndicator = true;
        localStorage.setItem('whispers-show-ocean-indicator', 'true');
    },

    /**
     * Toggle indicator visibility
     */
    toggle() {
        if (this.showIndicator) {
            this.hide();
        } else {
            this.show();
        }
    },

    /**
     * Cleanup event listeners (call before destroying)
     */
    destroy() {
        if (this.boundLanguageHandler) {
            document.removeEventListener('language:changed', this.boundLanguageHandler);
            this.boundLanguageHandler = null;
        }
        if (this.indicatorElement) {
            this.indicatorElement.remove();
            this.indicatorElement = null;
        }
    }
};

// Auto-initialize when DOM is ready (only on main app page)
function autoInit() {
    // Only initialize if we're on the main app page (has message display)
    const isMainApp = document.getElementById('messageDisplay') !== null;
    
    if (isMainApp) {
        OceanStateUI.init();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
} else {
    autoInit();
}

// Expose for debugging
window.OceanStateUI = OceanStateUI;
