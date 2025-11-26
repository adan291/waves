/**
 * Splash Screen Module
 * Handles the initial splash screen and wave selection
 */

const SplashScreen = {
    // Available languages (synced with i18n)
    availableLanguages: ['es', 'en', 'ro'],

    // Wave types configuration
    waveTypes: {
        calm: {
            id: 'calm',
            icon: '🌊',
            persona: 'guardian',
            color: '#4fc3f7',
            gradientStart: '#0a1128',
            gradientEnd: '#4fc3f7',
            speed: 20
        },
        deep: {
            id: 'deep',
            icon: '🌀',
            persona: 'deep_explorer',
            color: '#1e3a5f',
            gradientStart: '#001f54',
            gradientEnd: '#1e3a5f',
            speed: 18
        },
        energetic: {
            id: 'energetic',
            icon: '⚡',
            persona: 'problem_solver',
            color: '#ff9800',
            gradientStart: '#1a0f0a',
            gradientEnd: '#ff9800',
            speed: 15
        },
        healing: {
            id: 'healing',
            icon: '💙',
            persona: 'healer',
            color: '#4caf50',
            gradientStart: '#0a1f1a',
            gradientEnd: '#4caf50',
            speed: 22
        }
    },

    currentView: 'main',

    /**
     * Get i18n instance with safe fallback
     * @private
     * @returns {Object} i18n instance or null object
     */
    _getI18n() {
        if (window.i18n && typeof window.i18n.t === 'function') {
            return window.i18n;
        }
        // Null Object Pattern - safe fallback
        return {
            t: (key) => {
                console.warn(`i18n not loaded, returning key: ${key}`);
                return key;
            },
            getLanguage: () => 'es'
        };
    },

    /**
     * Validate language code
     * @private
     * @param {string} lang - Language code to validate
     * @returns {boolean} True if valid
     */
    _validateLanguage(lang) {
        return this.availableLanguages.includes(lang);
    },

    /**
     * Generate language options HTML
     * @private
     * @returns {string} HTML string for language options
     */
    _getLanguageOptions() {
        const lang = localStorage.getItem('whispers-language') || 'es';
        return this.availableLanguages
            .map(code => `<option value="${code}" ${lang === code ? 'selected' : ''}>${code.toUpperCase()}</option>`)
            .join('');
    },

    init() {
        // Sync available languages with i18n module
        if (window.i18n && typeof window.i18n.getAvailableLanguages === 'function') {
            this.availableLanguages = window.i18n.getAvailableLanguages();
        }

        // Check if splash should be shown
        const selectedWave = localStorage.getItem('whispers-selected-wave');

        // Check if we should go directly to wave selection
        const gotoWaveSelection = localStorage.getItem('whispers-goto-wave-selection');
        if (gotoWaveSelection) {
            localStorage.removeItem('whispers-goto-wave-selection');
            this.create();
            this.showWaveSelection();
            return;
        }

        // If no wave selected, show splash
        if (!selectedWave) {
            this.create();
            this.show();
        }
    },

    create() {
        // Check if splash already exists
        if (document.getElementById('splashScreen')) {
            return;
        }

        const splash = document.createElement('div');
        splash.id = 'splashScreen';
        splash.className = 'splash-screen';
        splash.innerHTML = this.getHTML();
        document.body.appendChild(splash);

        this.attachEventListeners();
    },

    getHTML() {
        const i18n = this._getI18n();

        return `
            <!-- Splash Controls -->
            <div class="splash-controls">
                <button class="splash-control-btn splash-theme-toggle" id="splashThemeToggle" aria-label="Toggle theme">
                    <span id="splashThemeIcon">☀️</span>
                </button>
                <select class="splash-control-btn splash-language-selector" id="splashLanguageSelector" aria-label="Select language">
                    ${this._getLanguageOptions()}
                </select>
            </div>

            <!-- Main Splash View -->
            <div class="splash-main active">
                <div class="splash-content">
                    <div class="splash-logo">
                        <div class="logo-wave">🌊</div>
                        <h1 class="logo-title">${i18n.t('splash.title')}</h1>
                        <p class="splash-subtitle">${i18n.t('appName')}</p>
                    </div>
                    <p class="splash-tagline">${i18n.t('splash.subtitle')}</p>
                    <div class="splash-buttons">
                        <button class="splash-btn primary" id="startJourneyBtn">
                            <span class="btn-icon">🚀</span>
                            <span>${i18n.t('splash.startJourney')}</span>
                        </button>
                        <button class="splash-btn secondary" id="howItWorksBtn">
                            <span class="btn-icon">❓</span>
                            <span>${i18n.t('splash.howItWorks')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- How It Works View -->
            <div class="how-it-works">
                <div class="how-content">
                    <h2>${i18n.t('splash.howItWorks')}</h2>
                    <div class="how-steps">
                        <div class="how-step">
                            <div class="step-icon">🌊</div>
                            <h3>1. ${i18n.t('splash.selectWave')}</h3>
                            <p>${i18n.t('splash.tutorial.step1')}</p>
                        </div>
                        <div class="how-step">
                            <div class="step-icon">💭</div>
                            <h3>2. ${i18n.t('ui.placeholder')}</h3>
                            <p>${i18n.t('splash.tutorial.step2')}</p>
                        </div>
                        <div class="how-step">
                            <div class="step-icon">✨</div>
                            <h3>3. ${i18n.t('ui.welcomeMessage')}</h3>
                            <p>${i18n.t('splash.tutorial.step3')}</p>
                        </div>
                    </div>
                    <button class="splash-btn primary" id="continueFromHowBtn">
                        <span class="btn-icon">➤</span>
                        <span>${i18n.t('ui.continue')}</span>
                    </button>
                </div>
            </div>

            <!-- Wave Selection View -->
            <div class="wave-selection">
                <div class="wave-selection-content">
                    <h2 class="wave-selection-title">${i18n.t('splash.selectWave')}</h2>
                    <p class="wave-selection-subtitle">${i18n.t('splash.subtitle')}</p>
                    <div class="wave-cards" id="waveCards"></div>
                    <button class="splash-btn secondary small" id="backToIntroBtn" title="${i18n.t('ui.back')}">
                        <span class="btn-icon">←</span>
                        <span>${i18n.t('ui.back')}</span>
                    </button>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('splashThemeToggle');
        if (themeToggle) {
            // Update splash theme icon on load
            this.updateSplashThemeIcon();
            
            themeToggle.addEventListener('click', () => {
                if (typeof window.ThemeToggle !== 'undefined' && window.ThemeToggle.toggle) {
                    window.ThemeToggle.toggle();
                    // Update splash icon after toggle
                    setTimeout(() => this.updateSplashThemeIcon(), 100);
                } else {
                    // Fallback: manual theme toggle
                    this.toggleThemeManual();
                }
            });
        }

        // Language selector
        const langSelector = document.getElementById('splashLanguageSelector');
        if (langSelector) {
            langSelector.addEventListener('change', (e) => {
                const newLang = e.target.value;
                
                // Validate language
                if (!this._validateLanguage(newLang)) {
                    console.error(`Invalid language: ${newLang}`);
                    return;
                }
                
                // Set language and refresh
                if (window.i18n && typeof window.i18n.setLanguage === 'function') {
                    window.i18n.setLanguage(newLang);
                    this.refresh();
                }
            });
        }

        // Start journey button
        const startBtn = document.getElementById('startJourneyBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.showWaveSelection());
        }

        // How it works button
        const howBtn = document.getElementById('howItWorksBtn');
        if (howBtn) {
            howBtn.addEventListener('click', () => this.showHowItWorks());
        }

        // Continue from how it works
        const continueBtn = document.getElementById('continueFromHowBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.showWaveSelection());
        }

        // Back to intro button
        const backToIntroBtn = document.getElementById('backToIntroBtn');
        if (backToIntroBtn) {
            backToIntroBtn.addEventListener('click', () => {
                this.switchView('splash-main');
            });
        }
    },

    /**
     * Toggle visibility of main app elements
     * @private
     * @param {boolean} visible - Whether elements should be visible
     */
    _toggleMainAppElements(visible) {
        const displayValue = visible ? 'flex' : 'none';
        
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = displayValue;
        }
        
        const controlsLeft = document.querySelector('.fixed-controls-left');
        const controlsRight = document.querySelector('.fixed-controls-right');
        if (controlsLeft) controlsLeft.style.display = displayValue;
        if (controlsRight) controlsRight.style.display = displayValue;
    },

    show() {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('active');
            splash.style.display = 'flex';
        }
        
        // Change title using i18n
        const i18n = this._getI18n();
        document.title = i18n.t('splash.titleMain');
        
        // Hide main app elements
        this._toggleMainAppElements(false);
    },

    hide() {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
                splash.classList.remove('active', 'fade-out');
            }, 800);
        }
        
        // Change title back using i18n
        const i18n = this._getI18n();
        document.title = i18n.t('splash.titleConversation');
        
        // Show main app elements
        this._toggleMainAppElements(true);
    },

    showHowItWorks() {
        this.switchView('how-it-works');
    },

    showWaveSelection() {
        // Change title using i18n
        const i18n = this._getI18n();
        document.title = i18n.t('splash.titleSelection');
        
        this.switchView('wave-selection');
        this.renderWaveCards();
    },

    switchView(viewClass) {
        const splash = document.getElementById('splashScreen');
        if (!splash) return;

        const views = splash.querySelectorAll('.splash-main, .how-it-works, .wave-selection');
        views.forEach(view => view.classList.remove('active'));

        const targetView = splash.querySelector(`.${viewClass}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = viewClass;
    },

    /**
     * Create a single wave card element
     * @private
     * @param {Object} wave - Wave configuration object
     * @returns {HTMLElement} Wave card element
     */
    _createWaveCard(wave) {
        const card = document.createElement('div');
        card.className = 'wave-card';
        card.style.setProperty('--wave-color', wave.color);

        card.innerHTML = this._getWaveCardHTML(wave);
        
        const btn = card.querySelector('.wave-card-btn');
        btn.addEventListener('click', () => this.selectWave(wave));
        
        return card;
    },

    /**
     * Generate wave card HTML
     * @private
     * @param {Object} wave - Wave configuration object
     * @returns {string} HTML string for wave card
     */
    _getWaveCardHTML(wave) {
        const i18n = this._getI18n();
        const waveName = i18n.t(`waves.${wave.id}.name`);
        const waveDesc = i18n.t(`waves.${wave.id}.description`);
        
        return `
            <div class="wave-card-icon">${wave.icon}</div>
            <h3 class="wave-card-name">${waveName}</h3>
            <p class="wave-card-description">${waveDesc}</p>
            <button class="wave-card-btn" data-wave="${wave.id}">
                <span>${i18n.t('splash.selectWave')}</span>
                <span>➤</span>
            </button>
        `;
    },

    /**
     * Render all wave cards
     */
    renderWaveCards() {
        const container = document.getElementById('waveCards');
        if (!container) return;

        container.innerHTML = '';
        Object.values(this.waveTypes).forEach(wave => {
            container.appendChild(this._createWaveCard(wave));
        });
    },

    selectWave(wave) {
        // Save selection
        localStorage.setItem('whispers-selected-wave', wave.id);
        localStorage.setItem('whispers-splash-seen', 'true');

        // Apply wave background
        if (typeof WaveBackground !== 'undefined' && WaveBackground.applyWaveBackground) {
            WaveBackground.applyWaveBackground(wave.id);
        }

        // Emit event
        document.dispatchEvent(new CustomEvent('wave:selected', {
            detail: { wave }
        }));

        // Hide splash
        this.hide();

        console.log('🌊 Wave selected:', wave.id);
    },

    refresh() {
        const splash = document.getElementById('splashScreen');
        if (!splash) return;

        const currentView = this.currentView;
        splash.innerHTML = this.getHTML();
        this.attachEventListeners();
        this.switchView(currentView);

        if (currentView === 'wave-selection') {
            this.renderWaveCards();
        }
    },

    /**
     * Update splash theme icon based on current theme
     */
    updateSplashThemeIcon() {
        const icon = document.getElementById('splashThemeIcon');
        if (!icon) return;

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    },

    /**
     * Manual theme toggle (fallback if ThemeToggle not loaded)
     */
    toggleThemeManual() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        
        // Save to localStorage
        try {
            localStorage.setItem('whispers-theme', newTheme);
        } catch (e) {
            console.warn('Could not save theme');
        }
        
        // Update icon
        this.updateSplashThemeIcon();
        
        console.log('🎨 Theme toggled manually:', newTheme);
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SplashScreen.init();
    });
} else {
    SplashScreen.init();
}

// Expose globally
window.SplashScreen = SplashScreen;

console.log('🌊 Splash Screen module loaded');
