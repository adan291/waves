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

        // Auto-hide after 4 seconds
        await new Promise(resolve => {
            this.notificationTimeout = setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                    resolve();
                }, 400);
            }, 4000);
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
            <div class="achievement-close" onclick="AchievementUI.dismissCurrent(this.parentElement)">×</div>
        `;

        // Click to dismiss (clear timeout to prevent race condition)
        notification.addEventListener('click', (e) => {
            if (!e.target.classList.contains('achievement-close')) {
                if (this.notificationTimeout) {
                    clearTimeout(this.notificationTimeout);
                }
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                    this.processNotificationQueue();
                }, 400);
            }
        });

        return notification;
    },

    /**
     * Dismiss current notification and process queue
     * @param {HTMLElement} notification - Notification element to dismiss
     */
    dismissCurrent(notification) {
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            this.processNotificationQueue();
        }, 400);
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
        // Remove existing modal if present
        const existingModal = document.querySelector('.achievement-gallery-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = this.createGalleryModal();
        document.body.appendChild(modal);
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
        const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
        
        // Category names translations
        const categoryNames = {
            milestone: { es: 'Hitos', en: 'Milestones', ro: 'Repere' },
            expression: { es: 'Expresión', en: 'Expression', ro: 'Expresie' },
            special: { es: 'Especiales', en: 'Special', ro: 'Speciale' }
        };

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
