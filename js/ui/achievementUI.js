/**
 * Achievement UI
 * Visual notifications and achievement gallery
 */

const AchievementUI = {
    notificationQueue: [],
    isShowingNotification: false,
    notificationTimeout: null,

    /**
     * Initialize achievement UI
     */
    init() {
        this.setupEventListeners();
        console.log('🏆 Achievement UI initialized');
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for achievement unlocks
        document.addEventListener('achievement:unlocked', (e) => {
            this.showNotification(e.detail.achievement);
        });
    },

    /**
     * Show achievement notification
     * @param {object} achievement - Achievement object
     */
    showNotification(achievement) {
        // Add to queue
        this.notificationQueue.push(achievement);

        // Process queue if not already showing
        if (!this.isShowingNotification) {
            this.processNotificationQueue();
        }
    },

    /**
     * Process notification queue
     */
    async processNotificationQueue() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }

        this.isShowingNotification = true;
        const achievement = this.notificationQueue.shift();

        // Create notification element
        const notification = this.createNotificationElement(achievement);
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Play sound (if available)
        this.playUnlockSound(achievement.rarity);

        // Auto-hide after 5 seconds
        await new Promise(resolve => {
            this.notificationTimeout = setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                    resolve();
                }, 500);
            }, 5000);
        });

        // Process next in queue
        this.processNotificationQueue();
    },

    /**
     * Create notification element
     * @param {object} achievement - Achievement object
     * @returns {HTMLElement} Notification element
     */
    createNotificationElement(achievement) {
        const lang = localStorage.getItem('whispers-language') || 'es';
        const notification = document.createElement('div');
        notification.className = `achievement-notification ${achievement.rarity}`;
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-unlocked">${lang === 'es' ? '¡Logro Desbloqueado!' : 'Achievement Unlocked!'}</div>
                    <div class="achievement-name">${lang === 'es' ? achievement.name : achievement.nameEn}</div>
                    <div class="achievement-description">${lang === 'es' ? achievement.description : achievement.descriptionEn}</div>
                    <div class="achievement-rarity">${AchievementSystem.getRarityLabel(achievement.rarity, lang)}</div>
                </div>
            </div>
            <div class="achievement-close" onclick="this.parentElement.remove()">×</div>
        `;

        // Click to dismiss
        notification.addEventListener('click', (e) => {
            if (!e.target.classList.contains('achievement-close')) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 500);
            }
        });

        return notification;
    },

    /**
     * Play unlock sound
     * @param {string} rarity - Achievement rarity
     */
    playUnlockSound(rarity) {
        // Could integrate with AudioService here
        // For now, just log
        console.log(`🔊 Playing ${rarity} achievement sound`);
    },

    /**
     * Show achievement gallery modal
     */
    showGallery() {
        const modal = this.createGalleryModal();
        document.body.appendChild(modal);
        
        // Setup controls
        this.setupGalleryControls();
    },
    
    /**
     * Setup gallery controls (theme and language)
     */
    setupGalleryControls() {
        // Theme toggle
        const themeToggle = document.getElementById('galleryThemeToggle');
        if (themeToggle) {
            const currentTheme = document.body.getAttribute('data-theme') || 'dark';
            const icon = document.getElementById('galleryThemeIcon');
            if (icon) {
                icon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
            }
            
            themeToggle.addEventListener('click', () => {
                if (typeof toggleTheme === 'function') {
                    toggleTheme();
                } else {
                    const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                    document.body.setAttribute('data-theme', newTheme);
                    localStorage.setItem('whispers-theme', newTheme);
                    if (icon) {
                        icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
                    }
                }
            });
        }
        
        // Language selector
        const langSelector = document.getElementById('galleryLanguageSelector');
        if (langSelector) {
            const currentLang = localStorage.getItem('whispers-language') || 'es';
            langSelector.value = currentLang;
            
            langSelector.addEventListener('change', (e) => {
                const newLang = e.target.value;
                localStorage.setItem('whispers-language', newLang);
                
                // Close and reopen gallery with new language
                document.querySelector('.achievement-gallery-modal')?.remove();
                this.showGallery();
            });
        }
    },

    /**
     * Create gallery modal
     * @returns {HTMLElement} Modal element
     */
    createGalleryModal() {
        const stats = AchievementSystem.getStatistics();
        const allAchievements = AchievementSystem.getAllAchievements();

        // Group by category
        const categories = {};
        allAchievements.forEach(achievement => {
            if (!categories[achievement.category]) {
                categories[achievement.category] = [];
            }
            categories[achievement.category].push(achievement);
        });

        const modal = document.createElement('div');
        modal.className = 'achievement-gallery-modal';
        modal.innerHTML = `
            <div class="gallery-overlay" onclick="this.parentElement.remove()"></div>
            <div class="gallery-content">
                <!-- Controls - Top Right -->
                <div class="gallery-controls">
                    <button class="gallery-control-btn gallery-theme-toggle" id="galleryThemeToggle" aria-label="Toggle theme" title="Cambiar tema">
                        <span id="galleryThemeIcon">☀️</span>
                    </button>
                    <select class="gallery-control-btn gallery-language-selector" id="galleryLanguageSelector" aria-label="Seleccionar idioma" title="Cambiar idioma">
                        <option value="es">ES</option>
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="de">DE</option>
                    </select>
                </div>
                
                <div class="gallery-header">
                    <h2>${typeof i18n !== 'undefined' ? i18n.t('achievements.title') : '🏆 Galería de Logros'}</h2>
                    <button class="gallery-close" onclick="this.closest('.achievement-gallery-modal').remove()">×</button>
                </div>
                
                <div class="gallery-stats">
                    <div class="gallery-stat">
                        <div class="stat-value">${stats.unlocked}/${stats.total}</div>
                        <div class="stat-label">${typeof i18n !== 'undefined' ? i18n.t('achievements.unlocked') : 'Desbloqueados'}</div>
                    </div>
                    <div class="gallery-stat">
                        <div class="stat-value">${stats.percentage}%</div>
                        <div class="stat-label">${typeof i18n !== 'undefined' ? i18n.t('report.summary') : 'Completado'}</div>
                    </div>
                </div>

                <div class="gallery-progress-bar">
                    <div class="gallery-progress-fill" style="width: ${stats.percentage}%"></div>
                </div>

                <div class="gallery-body">
                    ${this.renderCategories(categories)}
                </div>
            </div>
        `;

        return modal;
    },

    /**
     * Render achievement categories
     * @param {object} categories - Grouped achievements
     * @returns {string} HTML
     */
    renderCategories(categories) {
        // Category names will use achievement names directly
        // which are already in the correct language

        return Object.entries(categories).map(([category, achievements]) => `
            <div class="gallery-category">
                <h3 class="category-title">${categoryNames[category]?.[lang] || category}</h3>
                <div class="achievement-grid">
                    ${achievements.map(achievement => this.renderAchievementCard(achievement, lang)).join('')}
                </div>
            </div>
        `).join('');
    },

    /**
     * Render achievement card
     * @param {object} achievement - Achievement object
     * @param {string} lang - Language code
     * @returns {string} HTML
     */
    renderAchievementCard(achievement, lang) {
        const isUnlocked = AchievementSystem.isUnlocked(achievement.id);
        const unlockedData = isUnlocked ? 
            AchievementSystem.unlocked.find(u => u.id === achievement.id) : null;

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}">
                <div class="achievement-card-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-card-name">${isUnlocked ? (lang === 'es' ? achievement.name : achievement.nameEn) : '???'}</div>
                <div class="achievement-card-description">
                    ${isUnlocked ? (lang === 'es' ? achievement.description : achievement.descriptionEn) : (lang === 'es' ? 'Logro bloqueado' : 'Locked achievement')}
                </div>
                <div class="achievement-card-rarity" style="color: ${AchievementSystem.getRarityColor(achievement.rarity)}">
                    ${AchievementSystem.getRarityLabel(achievement.rarity, lang)}
                </div>
                ${unlockedData ? `
                    <div class="achievement-card-date">
                        ${new Date(unlockedData.timestamp).toLocaleDateString()}
                    </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Show quick stats in mode indicator
     */
    updateModeIndicatorStats() {
        const stats = AchievementSystem.getStatistics();
        const modeIndicator = document.getElementById('modeIndicator');
        
        if (!modeIndicator) return;

        // Check if stats element exists
        let statsEl = modeIndicator.querySelector('.achievement-stats');
        
        if (!statsEl) {
            statsEl = document.createElement('div');
            statsEl.className = 'achievement-stats';
            statsEl.onclick = () => this.showGallery();
            modeIndicator.appendChild(statsEl);
        }

        statsEl.innerHTML = `
            <span class="achievement-icon">🏆</span>
            <span class="achievement-count">${stats.unlocked}/${stats.total}</span>
        `;
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AchievementUI.init();
    });
} else {
    AchievementUI.init();
}

// Expose for debugging
window.AchievementUI = AchievementUI;
