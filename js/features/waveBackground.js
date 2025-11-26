/**
 * Wave Background Manager
 * Applies wave-specific backgrounds based on user selection
 */

const WaveBackground = (() => {
    'use strict';
    
    let isInitialized = false;

    /**
     * Initialize wave background system
     */
    function init() {
        // Prevent double initialization
        if (isInitialized) return;
        isInitialized = true;
        
        // Wait for DOM to be fully ready and ocean-background element to exist
        if (!document.querySelector('.ocean-background')) {
            // If element doesn't exist yet, wait for it
            const checkElement = setInterval(() => {
                if (document.querySelector('.ocean-background')) {
                    clearInterval(checkElement);
                    applyWaveBackground();
                    setupEventListeners();
                }
            }, 50);
            
            // Timeout after 2 seconds
            setTimeout(() => clearInterval(checkElement), 2000);
        } else {
            // Element exists, apply immediately
            applyWaveBackground();
            setupEventListeners();
        }
        
        console.log('🌊 Wave Background Manager initialized');
    }
    
    /**
     * Setup event listeners
     * @private
     */
    function setupEventListeners() {
        // Listen for wave selection changes
        document.addEventListener('wave:selected', (e) => {
            if (e.detail && e.detail.wave) {
                applyWaveBackground(e.detail.wave.id);
            }
        });
        
        // Listen for theme changes to ensure proper contrast
        // BUT: Don't restart animation here - let ThemeToggle handle that
        document.addEventListener('theme:changed', () => {
            // Only update the data-wave attribute, don't restart animation
            const currentWave = localStorage.getItem('whispers-selected-wave');
            if (currentWave) {
                document.body.setAttribute('data-wave', currentWave);
            }
        });
    }

    /**
     * Apply wave-specific background
     * @param {string} waveId - Wave ID (calm, deep, energetic, healing)
     * @param {boolean} restartAnimation - Whether to restart animation (default: true for new wave selection)
     */
    function applyWaveBackground(waveId = null, restartAnimation = true) {
        // Ensure ocean-background element exists
        const oceanBg = document.querySelector('.ocean-background');
        if (!oceanBg) {
            console.warn('⚠️ Ocean background element not found');
            return;
        }
        
        // Get wave from parameter or localStorage
        const wave = waveId || localStorage.getItem('whispers-selected-wave') || '';
        
        // Apply data-wave attribute to body
        if (wave) {
            document.body.setAttribute('data-wave', wave);
            console.log(`🌊 Wave background applied: ${wave}`);
        } else {
            document.body.removeAttribute('data-wave');
            console.log('🌊 Using default ocean background');
        }
        
        // Force reflow to ensure attribute is applied immediately
        void document.body.offsetHeight;
        
        // Only restart animation if explicitly requested (e.g., when user selects a new wave)
        if (restartAnimation) {
            restartWaveAnimation();
        }
    }
    
    /**
     * Restart wave animation
     * @private
     */
    function restartWaveAnimation() {
        const oceanBg = document.querySelector('.ocean-background');
        
        if (!oceanBg) {
            console.warn('⚠️ Ocean background element not found for animation restart');
            return;
        }
        
        try {
            // Reset animation
            oceanBg.style.animation = 'none';
            void oceanBg.offsetHeight;
            oceanBg.style.animation = '';
            
            console.log('🌊 Wave animation restarted');
        } catch (error) {
            console.error('❌ Failed to restart wave animation:', error);
        }
    }

    /**
     * Get current wave
     * @returns {string} Current wave ID
     */
    function getCurrentWave() {
        return document.body.getAttribute('data-wave') || '';
    }

    /**
     * Get wave info
     * @param {string} waveId - Wave ID
     * @returns {object} Wave information
     */
    function getWaveInfo(waveId) {
        const waves = {
            calm: {
                id: 'calm',
                name: 'Ola Tranquila',
                nameEn: 'Calm Wave',
                icon: '🌊',
                description: 'Peaceful self-discovery',
                colors: {
                    dark: ['#0a1a2e', '#87ceeb'],
                    light: ['#e0f2f7', '#2e5266']
                }
            },
            deep: {
                id: 'deep',
                name: 'Ola Profunda',
                nameEn: 'Deep Wave',
                icon: '🌀',
                description: 'Deep emotional exploration',
                colors: {
                    dark: ['#0d0221', '#9b88cc'],
                    light: ['#e8e0f5', '#3e2a5f']
                }
            },
            energetic: {
                id: 'energetic',
                name: 'Ola Energética',
                nameEn: 'Energetic Wave',
                icon: '⚡',
                description: 'Action and momentum',
                colors: {
                    dark: ['#1a0f0a', '#f0c674'],
                    light: ['#fff8e7', '#7d4a24']
                }
            },
            healing: {
                id: 'healing',
                name: 'Ola Sanadora',
                nameEn: 'Healing Wave',
                icon: '💙',
                description: 'Emotional healing',
                colors: {
                    dark: ['#0a1f1a', '#8de4c8'],
                    light: ['#e8f8f3', '#2a5f4d']
                }
            }
        };
        
        return waves[waveId] || null;
    }

    // Public API
    return {
        init,
        applyWaveBackground,
        getCurrentWave,
        getWaveInfo
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WaveBackground.init());
} else {
    WaveBackground.init();
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.WaveBackground = WaveBackground;
}
