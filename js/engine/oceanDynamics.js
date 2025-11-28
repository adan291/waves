/**
 * Ocean Dynamics Engine
 * Controls ocean background intensity based on emotional state
 * RESPECTS the selected wave - only adjusts intensity/speed, not colors
 */

const OceanDynamics = {
    // Emotional intensity levels (affects animation speed and opacity)
    intensityLevels: {
        calm: { speed: 25, opacity: 0.8, name: 'Calma', nameEn: 'Calm', nameRo: 'Calm' },
        neutral: { speed: 20, opacity: 0.9, name: 'Neutral', nameEn: 'Neutral', nameRo: 'Neutru' },
        processing: { speed: 15, opacity: 1.0, name: 'Procesando', nameEn: 'Processing', nameRo: 'Procesare' },
        intense: { speed: 10, opacity: 1.0, name: 'Intenso', nameEn: 'Intense', nameRo: 'Intens' },
        turbulent: { speed: 6, opacity: 1.0, name: 'Turbulento', nameEn: 'Turbulent', nameRo: 'Turbulent' }
    },

    currentIntensity: 'neutral',
    currentTheme: 'dark',
    transitionDuration: 2000,
    isTransitioning: false,

    /**
     * Initialize ocean dynamics
     */
    init() {
        this.currentTheme = document.body.dataset.theme === 'light' ? 'light' : 'dark';
        this.applyIntensity(this.currentIntensity, false);
        
        // Listen for theme changes
        document.addEventListener('theme:changed', (e) => {
            this.currentTheme = e.detail.theme;
            this.applyIntensity(this.currentIntensity, false);
        });

        console.log('🌊 Ocean Dynamics initialized (wave-respecting mode)');
    },

    /**
     * Analyze message and determine emotional intensity
     * @param {string} message - User message
     * @returns {string} Intensity level
     */
    analyzeEmotionalState(message) {
        const text = message.toLowerCase();
        
        // High intensity indicators (turbulent)
        const turbulentWords = ['furioso', 'odio', 'desesperado', 'no puedo más', 'angry', 'hate', 'desperate', 'cant take'];
        const turbulentScore = turbulentWords.filter(w => text.includes(w)).length;
        
        // Medium-high intensity (intense)
        const intenseWords = ['preocupado', 'miedo', 'ansiedad', 'nervioso', 'confundido', 'perdido', 'worried', 'anxious', 'scared', 'confused', 'lost'];
        const intenseScore = intenseWords.filter(w => text.includes(w)).length;
        
        // Medium intensity (processing)
        const processingWords = ['por qué', 'cómo', 'no sé', 'quizás', 'tal vez', 'pienso', 'why', 'how', "don't know", 'maybe', 'think'];
        const processingScore = processingWords.filter(w => text.includes(w)).length;
        
        // Low intensity (calm)
        const calmWords = ['gracias', 'paz', 'tranquilo', 'mejor', 'entiendo', 'claro', 'thanks', 'peace', 'calm', 'better', 'understand', 'clear'];
        const calmScore = calmWords.filter(w => text.includes(w)).length;
        
        // Determine intensity
        if (turbulentScore > 0) return 'turbulent';
        if (intenseScore >= 2) return 'intense';
        if (intenseScore > 0 || processingScore >= 2) return 'processing';
        if (calmScore >= 2) return 'calm';
        
        return 'neutral';
    },

    /**
     * Update ocean intensity based on conversation
     * @param {string} userMessage - User's message
     */
    updateFromConversation(userMessage) {
        const detectedIntensity = this.analyzeEmotionalState(userMessage);
        this.setIntensity(detectedIntensity);
        
        console.log('🌊 Ocean intensity updated:', {
            intensity: detectedIntensity,
            message: userMessage.substring(0, 50) + '...'
        });
        
        return detectedIntensity;
    },

    /**
     * Set ocean intensity
     * @param {string} intensityId - Intensity level
     * @param {boolean} animate - Whether to animate
     */
    setIntensity(intensityId, animate = true) {
        if (!this.intensityLevels[intensityId]) {
            console.warn('Unknown intensity level:', intensityId);
            return;
        }
        
        if (this.currentIntensity === intensityId && !animate) {
            return;
        }
        
        this.currentIntensity = intensityId;
        this.applyIntensity(intensityId, animate);
        
        // Emit event for UI updates
        document.dispatchEvent(new CustomEvent('ocean:stateChanged', {
            detail: {
                state: intensityId,
                config: this.getCurrentState()
            }
        }));
    },

    // Alias for compatibility
    setState(stateId, animate = true) {
        this.setIntensity(stateId, animate);
    },

    /**
     * Apply intensity to ocean background
     * Only changes speed and subtle effects, NOT the wave colors
     * @param {string} intensityId - Intensity level
     * @param {boolean} animate - Whether to animate
     */
    applyIntensity(intensityId, animate = true) {
        const intensity = this.intensityLevels[intensityId];
        if (!intensity) return;
        
        const ocean = document.querySelector('.ocean-background');
        if (!ocean) return;
        
        if (this.isTransitioning && animate) return;
        
        if (animate) {
            this.isTransitioning = true;
            ocean.style.transition = `animation-duration ${this.transitionDuration}ms ease-in-out, opacity ${this.transitionDuration}ms ease-in-out`;
            
            setTimeout(() => {
                this.isTransitioning = false;
                ocean.style.transition = '';
            }, this.transitionDuration);
        }
        
        // Only adjust animation speed and opacity - keep wave colors!
        ocean.style.animationDuration = `${intensity.speed}s`;
        ocean.style.opacity = intensity.opacity;
        
        // Store current intensity
        ocean.dataset.oceanIntensity = intensityId;
    },

    /**
     * Get current state info (for compatibility with OceanStateUI)
     * @returns {object} Current state configuration
     */
    getCurrentState() {
        const intensity = this.intensityLevels[this.currentIntensity];
        const selectedWave = localStorage.getItem('whispers-selected-wave') || 'calm';
        
        // Get wave colors from WaveBackground if available
        let colors = {
            dark: ['#0a1128', '#40e0d0'],
            light: ['#e1f5fe', '#4fc3f7']
        };
        
        if (typeof WaveBackground !== 'undefined') {
            const waveInfo = WaveBackground.getWaveInfo(selectedWave);
            if (waveInfo && waveInfo.colors) {
                colors = waveInfo.colors;
            }
        }
        
        // Get localized name based on current language
        const lang = localStorage.getItem('whispers-language') || 'es';
        const localizedName = lang === 'ro' ? intensity.nameRo :
                              lang === 'en' ? intensity.nameEn : intensity.name;
        
        return {
            id: this.currentIntensity,
            name: intensity.name,
            nameEn: intensity.nameEn,
            nameRo: intensity.nameRo,
            speed: intensity.speed,
            intensity: this.currentIntensity,
            colors: colors,
            description: localizedName
        };
    },

    /**
     * Get state by ID (compatibility)
     * @param {string} _stateId - Unused, kept for API compatibility
     */
    getState(_stateId) {
        return this.getCurrentState();
    },

    /**
     * Get progression percentage
     */
    getProgressionPercentage(stateId) {
        const progression = {
            turbulent: 10,
            intense: 30,
            processing: 50,
            neutral: 70,
            calm: 100
        };
        return progression[stateId] || 50;
    },

    /**
     * Force a specific intensity
     */
    forceState(stateId) {
        console.log('🌊 Forcing ocean intensity:', stateId);
        this.setIntensity(stateId, true);
    },

    /**
     * Reset to neutral
     */
    reset() {
        this.setIntensity('neutral', true);
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OceanDynamics.init());
} else {
    OceanDynamics.init();
}

window.OceanDynamics = OceanDynamics;
