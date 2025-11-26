/**
 * Splash Screen Module
 * Handles the initial splash screen and wave selection
 */

const SplashScreen = {
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

    init() {
        // Check if splash should be shown
        const hasSeenSplash = localStorage.getItem('whispers-splash-seen');
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
        const lang = localStorage.getItem('whispers-language') || 'es';
        const i18nInstance = window.i18n || { t: (key) => key };

        return `
            <!-- Splash Controls -->
            <div class="splash-controls">
                <button class="splash-control-btn splash-theme-toggle" id="splashThemeToggle" aria-label="Toggle theme">
                    <span id="splashThemeIcon">☀️</span>
                </button>
                <select class="splash-control-btn splash-language-selector" id="splashLanguageSelector" aria-label="Select language">
                    <option value="es" ${lang === 'es' ? 'selected' : ''}>ES</option>
                    <option value="en" ${lang === 'en' ? 'selected' : ''}>EN</option>
                </select>
            </div>

            <!-- Main Splash View -->
            <div class="splash-main active">
                <div class="splash-content">
                    <div class="splash-logo">
                        <div class="logo-wave">🌊</div>
                        <h1 class="logo-title">${i18nInstance.t('splash.title')}</h1>
                        <p class="splash-subtitle">${i18nInstance.t('appName')}</p>
                    </div>
                    <p class="splash-tagline">${i18nInstance.t('splash.subtitle')}</p>
                    <div class="splash-buttons">
                        <button class="splash-btn primary" id="startJourneyBtn">
                            <span class="btn-icon">🚀</span>
                            <span>${i18nInstance.t('splash.startJourney')}</span>
                        </button>
                        <button class="splash-btn secondary" id="howItWorksBtn">
                            <span class="btn-icon">❓</span>
                            <span>${i18nInstance.t('splash.howItWorks')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- How It Works View -->
            <div class="how-it-works">
                <div class="how-content">
                    <h2>${i18nInstance.t('splash.howItWorks')}</h2>
                    <div class="how-steps">
                        <div class="how-step">
                            <div class="step-icon">🌊</div>
                            <h3>1. ${i18nInstance.t('splash.selectWave')}</h3>
                            <p>${i18nInstance.t('splash.tutorial.step1')}</p>
                        </div>
                        <div class="how-step">
                            <div class="step-icon">💭</div>
                            <h3>2. ${i18nInstance.t('ui.placeholder')}</h3>
                            <p>${i18nInstance.t('splash.tutorial.step2')}</p>
                        </div>
                        <div class="how-step">
                            <div class="step-icon">✨</div>
                            <h3>3. ${i18nInstance.t('ui.welcomeMessage')}</h3>
                            <p>${i18nInstance.t('splash.tutorial.step3')}</p>
                        </div>
                    </div>
                    <button class="splash-btn primary" id="continueFromHowBtn">
                        <span class="btn-icon">➤</span>
                        <span>${i18nInstance.t('ui.continue')}</span>
                    </button>
                </div>
            </div>

            <!-- Wave Selection View -->
            <div class="wave-selection">
                <div class="wave-selection-content">
                    <h2 class="wave-selection-title">${i18nInstance.t('splash.selectWave')}</h2>
                    <p class="wave-selection-subtitle">${i18nInstance.t('splash.subtitle')}</p>
                    <div class="wave-cards" id="waveCards"></div>
                    <button class="reset-btn-splash" id="resetAppBtn" title="${i18nInstance.t('controls.reset')}">
                        <span>🔄</span>
                        <span>${i18nInstance.t('controls.reset')}</span>
                    </button>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('splashThemeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (typeof ThemeToggle !== 'undefined') {
                    ThemeToggle.toggle();
                }
            });
        }

        // Language selector
        const langSelector = document.getElementById('splashLanguageSelector');
        if (langSelector) {
            langSelector.addEventListener('change', (e) => {
                if (window.i18n) {
                    window.i18n.setLanguage(e.target.value);
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

        // Reset button
        const resetBtn = document.getElementById('resetAppBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
                const confirmMsg = lang === 'es' 
                    ? '¿Reiniciar la aplicación? Esto borrará todos los datos.'
                    : lang === 'ro'
                    ? 'Resetează aplicația? Aceasta va șterge toate datele.'
                    : 'Reset app? This will clear all data.';
                
                if (confirm(confirmMsg)) {
                    localStorage.clear();
                    location.reload();
                }
            });
        }
    },

    show() {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('active');
            splash.style.display = 'flex';
        }
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
    },

    showHowItWorks() {
        this.switchView('how-it-works');
    },

    showWaveSelection() {
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

    renderWaveCards() {
        const container = document.getElementById('waveCards');
        if (!container) return;

        const i18nInstance = window.i18n || { t: (key) => key };
        const lang = i18nInstance.getLanguage ? i18nInstance.getLanguage() : 'es';

        container.innerHTML = '';

        Object.values(this.waveTypes).forEach(wave => {
            const card = document.createElement('div');
            card.className = 'wave-card';
            card.style.setProperty('--wave-color', wave.color);

            const waveName = i18nInstance.t(`waves.${wave.id}.name`);
            const waveDesc = i18nInstance.t(`waves.${wave.id}.description`);

            card.innerHTML = `
                <div class="wave-card-icon">${wave.icon}</div>
                <h3 class="wave-card-name">${waveName}</h3>
                <p class="wave-card-description">${waveDesc}</p>
                <button class="wave-card-btn" data-wave="${wave.id}">
                    <span>${i18nInstance.t('splash.selectWave')}</span>
                    <span>➤</span>
                </button>
            `;

            card.querySelector('.wave-card-btn').addEventListener('click', () => {
                this.selectWave(wave);
            });

            container.appendChild(card);
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
