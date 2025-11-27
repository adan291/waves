/**
 * Achievement System
 * Tracks and unlocks achievements based on user progress
 */

const AchievementSystem = {
    // Achievement definitions
    achievements: {
        // First Steps
        first_message: {
            id: 'first_message',
            name: 'Primer Paso',
            nameEn: 'First Step',
            nameRo: 'Primul Pas',
            description: 'Enviaste tu primer mensaje',
            descriptionEn: 'Sent your first message',
            descriptionRo: 'Ai trimis primul tău mesaj',
            icon: '👣',
            category: 'journey',
            rarity: 'common',
            condition: (stats) => stats.totalMessages >= 1
        },
        first_wave: {
            id: 'first_wave',
            name: 'Navegante Novato',
            nameEn: 'Novice Navigator',
            nameRo: 'Navigator Începător',
            description: 'Completaste tu primera conversación',
            descriptionEn: 'Completed your first conversation',
            descriptionRo: 'Ai completat prima ta conversație',
            icon: '🌊',
            category: 'journey',
            rarity: 'common',
            condition: (stats) => stats.totalMessages >= 5
        },

        // Expression Quality
        clear_expression: {
            id: 'clear_expression',
            name: 'Expresión Clara',
            nameEn: 'Clear Expression',
            nameRo: 'Expresie Clară',
            description: 'Alcanzaste 80% de claridad en un mensaje',
            descriptionEn: 'Reached 80% clarity in a message',
            descriptionRo: 'Ai atins 80% claritate într-un mesaj',
            icon: '💎',
            category: 'expression',
            rarity: 'uncommon',
            condition: (stats) => stats.maxClarity >= 80
        },
        emotional_awareness: {
            id: 'emotional_awareness',
            name: 'Conciencia Emocional',
            nameEn: 'Emotional Awareness',
            nameRo: 'Conștiință Emoțională',
            description: 'Identificaste tus emociones con 85% de precisión',
            descriptionEn: 'Identified your emotions with 85% accuracy',
            descriptionRo: 'Ți-ai identificat emoțiile cu 85% precizie',
            icon: '🧠',
            category: 'expression',
            rarity: 'uncommon',
            condition: (stats) => stats.maxEmotionalAwareness >= 85
        },
        master_communicator: {
            id: 'master_communicator',
            name: 'Maestro Comunicador',
            nameEn: 'Master Communicator',
            nameRo: 'Maestru Comunicator',
            description: 'Alcanzaste puntuación general de 90+',
            descriptionEn: 'Reached overall score of 90+',
            descriptionRo: 'Ai atins scorul general de 90+',
            icon: '🎓',
            category: 'expression',
            rarity: 'rare',
            condition: (stats) => stats.maxOverall >= 90
        },

        // Ocean States
        found_clarity: {
            id: 'found_clarity',
            name: 'Aguas Claras',
            nameEn: 'Clear Waters',
            nameRo: 'Ape Limpezi',
            description: 'Alcanzaste el estado de Claridad',
            descriptionEn: 'Reached Clarity state',
            descriptionRo: 'Ai atins starea de Claritate',
            icon: '💡',
            category: 'ocean',
            rarity: 'common',
            condition: (stats) => stats.statesReached?.includes('clarity')
        },
        found_resolution: {
            id: 'found_resolution',
            name: 'Paz Interior',
            nameEn: 'Inner Peace',
            nameRo: 'Pace Interioară',
            description: 'Alcanzaste el estado de Resolución',
            descriptionEn: 'Reached Resolution state',
            descriptionRo: 'Ai atins starea de Rezolvare',
            icon: '✨',
            category: 'ocean',
            rarity: 'uncommon',
            condition: (stats) => stats.statesReached?.includes('resolved')
        },
        ocean_master: {
            id: 'ocean_master',
            name: 'Maestro del Océano',
            nameEn: 'Ocean Master',
            nameRo: 'Maestru al Oceanului',
            description: 'Experimentaste todos los estados del océano',
            descriptionEn: 'Experienced all ocean states',
            descriptionRo: 'Ai experimentat toate stările oceanului',
            icon: '🌊',
            category: 'ocean',
            rarity: 'rare',
            condition: (stats) => {
                const required = ['confused', 'anxious', 'processing', 'clarity', 'resolved'];
                return required.every(state => stats.statesReached?.includes(state));
            }
        },

        // Progress & Improvement
        steady_progress: {
            id: 'steady_progress',
            name: 'Progreso Constante',
            nameEn: 'Steady Progress',
            nameRo: 'Progres Constant',
            description: 'Mejoraste tu expresión en 20 puntos',
            descriptionEn: 'Improved your expression by 20 points',
            descriptionRo: 'Ți-ai îmbunătățit expresia cu 20 de puncte',
            icon: '📈',
            category: 'progress',
            rarity: 'uncommon',
            condition: (stats) => stats.improvement >= 20
        },
        breakthrough: {
            id: 'breakthrough',
            name: 'Momento Eureka',
            nameEn: 'Breakthrough Moment',
            nameRo: 'Moment de Revelație',
            description: 'Mejoraste tu expresión en 40 puntos',
            descriptionEn: 'Improved your expression by 40 points',
            descriptionRo: 'Ți-ai îmbunătățit expresia cu 40 de puncte',
            icon: '🚀',
            category: 'progress',
            rarity: 'rare',
            condition: (stats) => stats.improvement >= 40
        },

        // Consistency
        dedicated: {
            id: 'dedicated',
            name: 'Dedicación',
            nameEn: 'Dedication',
            nameRo: 'Dedicare',
            description: 'Mantuviste 10 conversaciones',
            descriptionEn: 'Maintained 10 conversations',
            descriptionRo: 'Ai menținut 10 conversații',
            icon: '🎯',
            category: 'consistency',
            rarity: 'uncommon',
            condition: (stats) => stats.totalMessages >= 10
        },
        persistent: {
            id: 'persistent',
            name: 'Persistencia',
            nameEn: 'Persistence',
            nameRo: 'Persistență',
            description: 'Mantuviste 25 conversaciones',
            descriptionEn: 'Maintained 25 conversations',
            descriptionRo: 'Ai menținut 25 de conversații',
            icon: '💪',
            category: 'consistency',
            rarity: 'rare',
            condition: (stats) => stats.totalMessages >= 25
        },
        marathon: {
            id: 'marathon',
            name: 'Maratonista',
            nameEn: 'Marathon Runner',
            nameRo: 'Maratonist',
            description: 'Mantuviste 50 conversaciones',
            descriptionEn: 'Maintained 50 conversations',
            descriptionRo: 'Ai menținut 50 de conversații',
            icon: '🏃',
            category: 'consistency',
            rarity: 'epic',
            condition: (stats) => stats.totalMessages >= 50
        },

        // Special
        deep_dive: {
            id: 'deep_dive',
            name: 'Inmersión Profunda',
            nameEn: 'Deep Dive',
            nameRo: 'Scufundare Profundă',
            description: 'Exploraste emociones complejas con la Ola Profunda',
            descriptionEn: 'Explored complex emotions with Deep Wave',
            descriptionRo: 'Ai explorat emoții complexe cu Valul Profund',
            icon: '🌀',
            category: 'special',
            rarity: 'uncommon',
            condition: (stats) => stats.selectedWave === 'deep' && stats.totalMessages >= 5
        },
        healer: {
            id: 'healer',
            name: 'Sanador',
            nameEn: 'Healer',
            nameRo: 'Vindecător',
            description: 'Procesaste dolor emocional con la Ola Sanadora',
            descriptionEn: 'Processed emotional pain with Healing Wave',
            descriptionRo: 'Ai procesat durerea emoțională cu Valul Vindecător',
            icon: '💙',
            category: 'special',
            rarity: 'uncommon',
            condition: (stats) => stats.selectedWave === 'healing' && stats.statesReached?.includes('resolved')
        },
        problem_solver: {
            id: 'problem_solver',
            name: 'Solucionador',
            nameEn: 'Problem Solver',
            nameRo: 'Rezolvator',
            description: 'Resolviste conflictos con la Ola Energética',
            descriptionEn: 'Resolved conflicts with Energetic Wave',
            descriptionRo: 'Ai rezolvat conflicte cu Valul Energetic',
            icon: '⚡',
            category: 'special',
            rarity: 'uncommon',
            condition: (stats) => stats.selectedWave === 'energetic' && stats.statesReached?.includes('resolved')
        },
        zen_master: {
            id: 'zen_master',
            name: 'Maestro Zen',
            nameEn: 'Zen Master',
            nameRo: 'Maestru Zen',
            description: 'Mantuviste calma perfecta con la Ola Tranquila',
            descriptionEn: 'Maintained perfect calm with Calm Wave',
            descriptionRo: 'Ai menținut calmul perfect cu Valul Calm',
            icon: '🧘',
            category: 'special',
            rarity: 'rare',
            condition: (stats) => stats.selectedWave === 'calm' && stats.averageOverall >= 70
        },

        // Legendary
        enlightened: {
            id: 'enlightened',
            name: 'Iluminado',
            nameEn: 'Enlightened',
            nameRo: 'Iluminat',
            description: 'Alcanzaste nivel Maestro en expresión',
            descriptionEn: 'Reached Master level in expression',
            descriptionRo: 'Ai atins nivelul Maestru în expresie',
            icon: '🌟',
            category: 'legendary',
            rarity: 'legendary',
            condition: (stats) => stats.currentLevel >= 5
        },
        wave_whisperer: {
            id: 'wave_whisperer',
            name: 'Susurrador de Olas',
            nameEn: 'Wave Whisperer',
            nameRo: 'Șoptitorul Valurilor',
            description: 'Completaste el viaje perfecto: confusión → resolución',
            descriptionEn: 'Completed perfect journey: confusion → resolution',
            descriptionRo: 'Ai completat călătoria perfectă: confuzie → rezolvare',
            icon: '🎭',
            category: 'legendary',
            rarity: 'legendary',
            condition: (stats) => {
                return stats.statesReached?.includes('confused') &&
                    stats.statesReached?.includes('resolved') &&
                    stats.improvement >= 30;
            }
        }
    },

    // Unlocked achievements
    unlocked: [],

    // Pending notifications
    pendingNotifications: [],

    init() {
        // Limpiar logros antiguos de localStorage (migración a sessionStorage)
        try {
            localStorage.removeItem('whispers-achievements');
        } catch (e) {
            // Ignorar errores de limpieza
        }
        
        this.loadUnlocked();
        console.log('🏆 Achievement System initialized');
        console.log(`📊 ${this.unlocked.length}/${Object.keys(this.achievements).length} achievements unlocked`);
    },

    check(stats) {
        const newlyUnlocked = [];

        Object.values(this.achievements).forEach(achievement => {
            // Skip if already unlocked
            if (this.isUnlocked(achievement.id)) {
                return;
            }

            // Check condition
            try {
                if (achievement.condition(stats)) {
                    this.unlock(achievement.id);
                    newlyUnlocked.push(achievement);
                }
            } catch (error) {
                console.warn(`Error checking achievement ${achievement.id}:`, error);
            }
        });

        return newlyUnlocked;
    },

    unlock(achievementId) {
        if (this.isUnlocked(achievementId)) {
            return;
        }

        const achievement = this.achievements[achievementId];
        if (!achievement) {
            console.warn('Unknown achievement:', achievementId);
            return;
        }

        const unlockedData = {
            id: achievementId,
            timestamp: Date.now()
        };

        this.unlocked.push(unlockedData);
        this.pendingNotifications.push(achievement);
        this.saveUnlocked();

        console.log('🏆 Achievement unlocked:', achievement.name);

        // Emit event
        document.dispatchEvent(new CustomEvent('achievement:unlocked', {
            detail: { achievement, unlockedData }
        }));
    },

    isUnlocked(achievementId) {
        return this.unlocked.some(u => u.id === achievementId);
    },

    getAchievement(achievementId) {
        return this.achievements[achievementId];
    },

    getAllAchievements() {
        return Object.values(this.achievements);
    },

    getUnlockedAchievements() {
        return this.unlocked.map(u => ({
            ...this.achievements[u.id],
            unlockedAt: u.timestamp
        }));
    },

    getLockedAchievements() {
        return Object.values(this.achievements).filter(a => !this.isUnlocked(a.id));
    },

    getByCategory(category) {
        return Object.values(this.achievements).filter(a => a.category === category);
    },

    getByRarity(rarity) {
        return Object.values(this.achievements).filter(a => a.rarity === rarity);
    },

    getCompletionPercentage() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlocked.length;
        return Math.round((unlocked / total) * 100);
    },

    getStatistics() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlocked.length;
        const locked = total - unlocked;

        const byCategory = {};
        const byRarity = {};

        Object.values(this.achievements).forEach(achievement => {
            // By category
            if (!byCategory[achievement.category]) {
                byCategory[achievement.category] = { total: 0, unlocked: 0 };
            }
            byCategory[achievement.category].total++;
            if (this.isUnlocked(achievement.id)) {
                byCategory[achievement.category].unlocked++;
            }

            // By rarity
            if (!byRarity[achievement.rarity]) {
                byRarity[achievement.rarity] = { total: 0, unlocked: 0 };
            }
            byRarity[achievement.rarity].total++;
            if (this.isUnlocked(achievement.id)) {
                byRarity[achievement.rarity].unlocked++;
            }
        });

        return {
            total,
            unlocked,
            locked,
            percentage: this.getCompletionPercentage(),
            byCategory,
            byRarity,
            recentlyUnlocked: this.getRecentlyUnlocked(5)
        };
    },

    getRecentlyUnlocked(count = 5) {
        return [...this.unlocked]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, count)
            .map(u => ({
                ...this.achievements[u.id],
                unlockedAt: u.timestamp
            }));
    },

    getPendingNotifications() {
        return [...this.pendingNotifications];
    },

    clearPendingNotifications() {
        this.pendingNotifications = [];
    },

    saveUnlocked() {
        try {
            // Usar sessionStorage para que los logros se limpien al cerrar la sesión
            sessionStorage.setItem('whispers-achievements', JSON.stringify(this.unlocked));
        } catch (e) {
            console.warn('Failed to save achievements:', e);
        }
    },

    loadUnlocked() {
        try {
            // Usar sessionStorage - los logros se reinician en cada nueva sesión
            const saved = sessionStorage.getItem('whispers-achievements');
            if (saved) {
                this.unlocked = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load achievements:', e);
            this.unlocked = [];
        }
    },

    reset() {
        this.unlocked = [];
        this.pendingNotifications = [];
        this.saveUnlocked();
        console.log('🔄 Achievements reset');
    },

    getRarityColor(rarity) {
        const colors = {
            common: '#b3e5fc',
            uncommon: '#7dd3c0',
            rare: '#4fc3f7',
            epic: '#a8e6cf',
            legendary: '#ffd700'
        };
        return colors[rarity] || colors.common;
    },

    getRarityLabel(rarity, language = 'es') {
        const labels = {
            common: { es: 'Común', en: 'Common', ro: 'Comun' },
            uncommon: { es: 'Poco Común', en: 'Uncommon', ro: 'Neobișnuit' },
            rare: { es: 'Raro', en: 'Rare', ro: 'Rar' },
            epic: { es: 'Épico', en: 'Epic', ro: 'Epic' },
            legendary: { es: 'Legendario', en: 'Legendary', ro: 'Legendar' }
        };
        return labels[rarity]?.[language] || labels[rarity]?.en || rarity;
    },

    /**
     * Get achievement name by language
     * @param {object} achievement - Achievement object
     * @param {string} lang - Language code
     * @returns {string} Achievement name
     */
    getAchievementName(achievement, lang = 'es') {
        if (lang === 'ro') return achievement.nameRo || achievement.nameEn || achievement.name;
        if (lang === 'en') return achievement.nameEn || achievement.name;
        return achievement.name;
    },

    /**
     * Get achievement description by language
     * @param {object} achievement - Achievement object
     * @param {string} lang - Language code
     * @returns {string} Achievement description
     */
    getAchievementDescription(achievement, lang = 'es') {
        if (lang === 'ro') return achievement.descriptionRo || achievement.descriptionEn || achievement.description;
        if (lang === 'en') return achievement.descriptionEn || achievement.description;
        return achievement.description;
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AchievementSystem.init();
    });
} else {
    AchievementSystem.init();
}

// Expose for debugging
window.AchievementSystem = AchievementSystem;
