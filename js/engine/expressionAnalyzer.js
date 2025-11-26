/**
 * Expression Analyzer
 * Analyzes user message clarity, specificity, and emotional awareness
 * Tracks improvement over time
 */

const ExpressionAnalyzer = {
    // Metrics history
    history: [],
    maxHistorySize: 100,

    // Word dictionaries for analysis
    dictionaries: {
        // Confusion indicators (negative for clarity)
        confusion: {
            es: ['no sé', 'quizás', 'tal vez', 'creo que', 'puede ser', 'supongo', 'a lo mejor', 'no estoy seguro'],
            en: ["don't know", 'maybe', 'perhaps', 'i think', 'might be', 'i guess', 'not sure', 'possibly']
        },
        
        // Clarity indicators (positive)
        clarity: {
            es: ['siento', 'necesito', 'quiero', 'me pasa', 'experimento', 'sé que', 'estoy seguro', 'claramente'],
            en: ['i feel', 'i need', 'i want', 'i experience', 'i know', "i'm sure", 'clearly', 'definitely']
        },
        
        // Emotional awareness (positive)
        emotionalAwareness: {
            es: ['me siento', 'siento que', 'emocionalmente', 'mi emoción', 'esto me hace sentir', 'reconozco que'],
            en: ['i feel', 'i sense', 'emotionally', 'my emotion', 'this makes me feel', 'i recognize']
        },
        
        // Specificity indicators (positive)
        specificity: {
            es: ['porque', 'cuando', 'específicamente', 'en particular', 'por ejemplo', 'concretamente'],
            en: ['because', 'when', 'specifically', 'in particular', 'for example', 'concretely']
        },
        
        // Vague language (negative for specificity)
        vague: {
            es: ['algo', 'cosas', 'todo', 'nada', 'siempre', 'nunca', 'alguien', 'algún'],
            en: ['something', 'things', 'everything', 'nothing', 'always', 'never', 'someone', 'some']
        }
    },

    /**
     * Initialize expression analyzer
     */
    init() {
        this.loadHistory();
        console.log('📊 Expression Analyzer initialized');
    },

    /**
     * Analyze a message and return metrics
     * @param {string} message - User message
     * @param {string} language - Language code (es/en)
     * @returns {object} Metrics object
     */
    analyze(message, language = 'es') {
        const text = message.toLowerCase();
        const wordCount = message.split(/\s+/).length;
        
        // Calculate individual metrics
        const clarity = this.calculateClarity(text, language, wordCount);
        const specificity = this.calculateSpecificity(text, language, wordCount);
        const emotionalAwareness = this.calculateEmotionalAwareness(text, language);
        const length = this.calculateLengthScore(wordCount);
        
        // Calculate overall score (weighted average)
        const overall = Math.round(
            (clarity * 0.35) + 
            (specificity * 0.25) + 
            (emotionalAwareness * 0.25) + 
            (length * 0.15)
        );
        
        const metrics = {
            timestamp: Date.now(),
            message: message.substring(0, 100), // Store preview
            wordCount,
            clarity,
            specificity,
            emotionalAwareness,
            length,
            overall,
            language
        };
        
        // Add to history
        this.addToHistory(metrics);
        
        return metrics;
    },

    /**
     * Calculate clarity score (0-100)
     * @param {string} text - Lowercase message
     * @param {string} language - Language code
     * @param {number} wordCount - Word count
     * @returns {number} Clarity score
     */
    calculateClarity(text, language, wordCount) {
        const confusionWords = this.dictionaries.confusion[language] || this.dictionaries.confusion.es;
        const clarityWords = this.dictionaries.clarity[language] || this.dictionaries.clarity.es;
        
        const confusionCount = this.countMatches(text, confusionWords);
        const clarityCount = this.countMatches(text, clarityWords);
        
        // Base score
        let score = 50;
        
        // Add points for clarity indicators
        score += clarityCount * 15;
        
        // Subtract points for confusion indicators
        score -= confusionCount * 12;
        
        // Bonus for longer, more detailed messages
        if (wordCount > 20) {
            score += 10;
        }
        
        // Clamp between 0-100
        return Math.max(0, Math.min(100, score));
    },

    /**
     * Calculate specificity score (0-100)
     * @param {string} text - Lowercase message
     * @param {string} language - Language code
     * @param {number} wordCount - Word count
     * @returns {number} Specificity score
     */
    calculateSpecificity(text, language, wordCount) {
        const specificWords = this.dictionaries.specificity[language] || this.dictionaries.specificity.es;
        const vagueWords = this.dictionaries.vague[language] || this.dictionaries.vague.es;
        
        const specificCount = this.countMatches(text, specificWords);
        const vagueCount = this.countMatches(text, vagueWords);
        
        // Base score depends on length
        let score = Math.min(50, wordCount * 2);
        
        // Add points for specific language
        score += specificCount * 12;
        
        // Subtract points for vague language
        score -= vagueCount * 8;
        
        // Bonus for detailed messages
        if (wordCount > 30) {
            score += 15;
        }
        
        return Math.max(0, Math.min(100, score));
    },

    /**
     * Calculate emotional awareness score (0-100)
     * @param {string} text - Lowercase message
     * @param {string} language - Language code
     * @returns {number} Emotional awareness score
     */
    calculateEmotionalAwareness(text, language) {
        const awarenessWords = this.dictionaries.emotionalAwareness[language] || this.dictionaries.emotionalAwareness.es;
        
        const awarenessCount = this.countMatches(text, awarenessWords);
        
        // Base score
        let score = 30;
        
        // Add points for emotional awareness indicators
        score += awarenessCount * 20;
        
        // Check for emotion words
        const emotionWords = ['triste', 'feliz', 'enojado', 'ansioso', 'tranquilo', 'frustrado', 
                             'sad', 'happy', 'angry', 'anxious', 'calm', 'frustrated'];
        const emotionCount = this.countMatches(text, emotionWords);
        score += emotionCount * 15;
        
        return Math.max(0, Math.min(100, score));
    },

    /**
     * Calculate length score (0-100)
     * @param {number} wordCount - Word count
     * @returns {number} Length score
     */
    calculateLengthScore(wordCount) {
        // Optimal range: 15-50 words
        if (wordCount < 5) return 20;
        if (wordCount < 10) return 40;
        if (wordCount < 15) return 60;
        if (wordCount < 50) return 100;
        if (wordCount < 100) return 80;
        return 60; // Too long might be rambling
    },

    /**
     * Count matches of phrases in text
     * @param {string} text - Text to search
     * @param {array} phrases - Phrases to find
     * @returns {number} Match count
     */
    countMatches(text, phrases) {
        return phrases.filter(phrase => text.includes(phrase)).length;
    },

    /**
     * Add metrics to history
     * @param {object} metrics - Metrics object
     */
    addToHistory(metrics) {
        this.history.push(metrics);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
        
        this.saveHistory();
    },

    /**
     * Get improvement trend
     * @param {number} recentCount - Number of recent messages to compare
     * @returns {object} Trend analysis
     */
    getImprovementTrend(recentCount = 5) {
        if (this.history.length < 2) {
            return {
                trend: 'insufficient_data',
                improvement: 0,
                message: 'Necesitas más mensajes para ver tu progreso'
            };
        }
        
        const first = this.history[0];
        const recent = this.history.slice(-recentCount);
        
        // Calculate averages
        const firstAvg = first.overall;
        const recentAvg = recent.reduce((sum, m) => sum + m.overall, 0) / recent.length;
        
        const improvement = recentAvg - firstAvg;
        
        let trend = 'stable';
        let message = 'Tu expresión se mantiene estable';
        
        if (improvement > 15) {
            trend = 'improving_significantly';
            message = '¡Excelente! Tu claridad ha mejorado notablemente';
        } else if (improvement > 5) {
            trend = 'improving';
            message = 'Bien, estás expresándote con más claridad';
        } else if (improvement < -15) {
            trend = 'declining_significantly';
            message = 'Parece que estás más confundido. Tomemos un momento';
        } else if (improvement < -5) {
            trend = 'declining';
            message = 'Tu expresión es menos clara. ¿Necesitas ayuda?';
        }
        
        return {
            trend,
            improvement: Math.round(improvement),
            firstScore: Math.round(firstAvg),
            recentScore: Math.round(recentAvg),
            message,
            messageCount: this.history.length
        };
    },

    /**
     * Get detailed progress report
     * @returns {object} Progress report
     */
    getProgressReport() {
        if (this.history.length === 0) {
            return null;
        }
        
        const trend = this.getImprovementTrend();
        
        // Calculate metric-specific trends
        const clarityTrend = this.getMetricTrend('clarity');
        const specificityTrend = this.getMetricTrend('specificity');
        const emotionalTrend = this.getMetricTrend('emotionalAwareness');
        
        // Find best and worst messages
        const sorted = [...this.history].sort((a, b) => b.overall - a.overall);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];
        
        return {
            overall: trend,
            metrics: {
                clarity: clarityTrend,
                specificity: specificityTrend,
                emotionalAwareness: emotionalTrend
            },
            best: {
                score: best.overall,
                message: best.message,
                timestamp: best.timestamp
            },
            worst: {
                score: worst.overall,
                message: worst.message,
                timestamp: worst.timestamp
            },
            totalMessages: this.history.length,
            averageScore: Math.round(
                this.history.reduce((sum, m) => sum + m.overall, 0) / this.history.length
            )
        };
    },

    /**
     * Get trend for specific metric
     * @param {string} metric - Metric name
     * @returns {object} Metric trend
     */
    getMetricTrend(metric) {
        if (this.history.length < 2) {
            return { trend: 'insufficient_data', improvement: 0 };
        }
        
        const first = this.history[0][metric];
        const recent = this.history.slice(-5);
        const recentAvg = recent.reduce((sum, m) => sum + m[metric], 0) / recent.length;
        
        const improvement = recentAvg - first;
        
        return {
            trend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
            improvement: Math.round(improvement),
            current: Math.round(recentAvg)
        };
    },

    /**
     * Get current level based on average score
     * @returns {object} Level info
     */
    getCurrentLevel() {
        if (this.history.length === 0) {
            return { level: 0, name: 'Comenzando', next: 'Explorador' };
        }
        
        const avgScore = this.history.reduce((sum, m) => sum + m.overall, 0) / this.history.length;
        
        const levels = [
            { min: 0, max: 20, level: 1, name: 'Explorador', nameEn: 'Explorer', next: 'Aprendiz' },
            { min: 20, max: 40, level: 2, name: 'Aprendiz', nameEn: 'Learner', next: 'Comunicador' },
            { min: 40, max: 60, level: 3, name: 'Comunicador', nameEn: 'Communicator', next: 'Articulado' },
            { min: 60, max: 80, level: 4, name: 'Articulado', nameEn: 'Articulate', next: 'Maestro' },
            { min: 80, max: 100, level: 5, name: 'Maestro', nameEn: 'Master', next: null }
        ];
        
        const currentLevel = levels.find(l => avgScore >= l.min && avgScore < l.max) || levels[levels.length - 1];
        
        return {
            ...currentLevel,
            score: Math.round(avgScore),
            progress: Math.round(((avgScore - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100)
        };
    },

    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('whispers-expression-history', JSON.stringify(this.history));
        } catch (e) {
            console.warn('Failed to save expression history:', e);
        }
    },

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('whispers-expression-history');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load expression history:', e);
            this.history = [];
        }
    },

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.saveHistory();
    },

    /**
     * Get history
     * @returns {array} History array
     */
    getHistory() {
        return [...this.history];
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ExpressionAnalyzer.init();
    });
} else {
    ExpressionAnalyzer.init();
}

// Expose for debugging
window.ExpressionAnalyzer = ExpressionAnalyzer;
