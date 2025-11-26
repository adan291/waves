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
            description: 'Enviaste tu primer mensaje',
            descriptionEn: 'Sent your first message',
            icon: '👣',
            category: 'journey',
            rarity: 'common',
            condition: (stats) => stats.totalMessages >= 1
        },
        first_wave: {
            id: 'first_wave',
            name: 'Navegante Novato',
            nameEn: 'Novice Navigator',
            description: 'Completaste tu primera conversación',
            descriptionEn: 'Completed your first conversation',
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
            description: 'Alcanzaste 80% de claridad en un mensaje',
            descriptionEn: 'Reached 80% clarity in a message',
            icon: '💎',
            category: 'expression',
            rarity: 'uncommon',
            condition: (stats) => stats.maxClarity >= 80
        },
        emotional_awareness: {
            id: 'emotional_awareness',
            name: 'Conciencia Emocional',
            nameEn: 'Emotional Awareness',
            description: 'Identificaste tus emociones con 85% de precisión',
            descriptionEn: 'Identified your emotions with 85% accuracy',
            icon: '🧠',
            category: 'expression',
            rarity: 'uncommon',
            condition: (stats) => stats.maxEmotionalAwareness >= 85
        },
        master_communicator: {
            id: 'master_communicator',
            name: 'Maestro Comunicador',
            nameEn: 'Master Communicator',
            description: 'Alcanzaste puntuación general de 90+',
            descriptionEn: 'Reached overall score of 90+',
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
            description: 'Alcanzaste el estado de Claridad',
            descriptionEn: 'Reached Clarity state',
            icon: '💡',
            category: 'ocean',
            rarity: 'common',
            condition: (stats) => stats.statesReached?.includes('clarity')
        },
        found_resolution: {
            id: 'found_resolution',
            name: 'Paz Interior',
            nameEn: 'Inner Peace',
            description: 'Alcanzaste el estado de Resolución',
            descriptionEn: 'Reached Resolution state',
            icon: '✨',
            category: 'ocean',
            rarity: 'uncommon',
            condition: (stats) => stats.statesReached?.includes('resolved')
        },
        ocean_master: {
            id: 'ocean_master',
            name: 'Maestro del Océano',
            nameEn: 'Ocean Master',
            description: 'Experimentaste todos los estados del océano',
            descriptionEn: 'Experienced all ocean states',
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
            description: 'Mejoraste tu expresión en 20 puntos',
            descriptionEn: 'Improved your expression by 20 points',
            icon: '📈',
            category: 'progress',
            rarity: 'uncommon',
            condition: (stats) => stats.improvement >= 20
        },
        breakthrough: {
            id: 'breakthrough',
            name: 'Momento Eureka',
            nameEn: 'Breakthrough Moment',
            description: 'Mejoraste tu expresión en 40 puntos',
            descriptionEn: 'Improved your expression by 40 points',
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
            description: 'Mantuviste 10 conversaciones',
            descriptionEn: 'Maintained 10 conversations',
            icon: '🎯',
            category: 'consistency',
            rarity: 'uncommon',
            condition: (stats) => stats.totalMessages >= 10
        },
        persistent: {
            id: 'persistent',
            name: 'Persistencia',
            nameEn: 'Persistence',
            description: 'Mantuviste 25 conversaciones',
            descriptionEn: 'Maintained 25 conversations',
            icon: '💪',
            category: 'consistency',
            rarity: 'rare',
            condition: (stats) => stats.totalMessages >= 25
        },
        marathon: {
            id: 'marathon',
            name: 'Maratonista',
            nameEn: 'Marathon Runner',
            description: 'Mantuviste 50 conversaciones',
            descriptionEn: 'Maintained 50 conversations',
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
            description: 'Exploraste emociones complejas con la Ola Profunda',
            descriptionEn: 'Explored complex emotions with Deep Wave',
            icon: '🌀',
            category: 'special',
            rarity: 'uncommon',
            condition: (stats) => stats.selectedWave === 'deep' && stats.totalMessages >= 5
        },
        healer: {
            id: 'healer',
            name: 'Sanador',
            nameEn: 'Healer',
            description: 'Procesaste dolor emocional con la Ola Sanadora',
            descriptionEn: 'Processed emotional pain with Healing Wave',
            icon: '💙',
            category: 'special',
            rarity: 'uncommon',
            condition: (stats) => stats.selectedWave === 'healing' && stats.statesReached?.includes('resolved')
        },
        problem_solver: {
            id: 'problem_solver',
            name: 'Solucionador',
            nameEn: 'Problem Solver',
            description: 'Resolviste conflictos con la Ola Energética',
            descriptionEn: 'Resolved conflicts with Energetic Wave',
            icon: '⚡',
            category: 'special',
            rarity: 'uncommon',
            condition: (stats) => stats.selectedWave === 'energetic' && stats.statesReached?.includes('resolved')
        },
        zen_master: {
            id: 'zen_master',
            name: 'Maestro Zen',
            nameEn: 'Zen Master',
            description: 'Mantuviste calma perfecta con la Ola Tranquila',
            descriptionEn: 'Maintained perfect calm with Calm Wave',
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
            description: 'Alcanzaste nivel Maestro en expresión',
            descriptionEn: 'Reached Master level in expression',
            icon: '🌟',
            category: 'legendary',
            rarity: 'legendary',
            condition: (stats) => stats.currentLevel >= 5
        },
        wave_whisperer: {
            id: 'wave_whisperer',
            name: 'Susurrador de Olas',
            nameEn: 'Wave Whisperer',
            description: 'Completaste el viaje perfecto: confusión → resolución',
            descriptionEn: 'Completed perfect journey: confusion → resolution',
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
            localStorage.setItem('whispers-achievements', JSON.stringify(this.unlocked));
        } catch (e) {
            console.warn('Failed to save achievements:', e);
        }
    },

    loadUnlocked() {
        try {
            const saved = localStorage.getItem('whispers-achievements');
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
            common: { es: 'Común', en: 'Common' },
            uncommon: { es: 'Poco Común', en: 'Uncommon' },
            rare: { es: 'Raro', en: 'Rare' },
            epic: { es: 'Épico', en: 'Epic' },
            legendary: { es: 'Legendario', en: 'Legendary' }
        };
        return labels[rarity]?.[language] || rarity;
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
