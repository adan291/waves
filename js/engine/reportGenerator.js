/**
 * ReportGenerator Module
 * Generates comprehensive journey reports with metrics, insights, and recommendations
 * 
 * @module ReportGenerator
 */

// Configuration constants
const REPORT_CONFIG = {
    IMPROVEMENT_THRESHOLD: 20,
    EXPERT_LEVEL_THRESHOLD: 4,
    ACHIEVEMENT_MILESTONE: 50,
    MAX_PEAKS_VALLEYS: 3,
    DEFAULT_LANGUAGE: 'es'
};

const ReportGenerator = {
    /**
     * Generate complete journey report
     * @returns {Object} Complete report with all sections
     */
    generate() {
        const report = {
            metadata: this.generateMetadata(),
            summary: this.generateSummary(),
            emotionalJourney: this.generateEmotionalJourney(),
            expressionMetrics: this.generateExpressionMetrics(),
            oceanStates: this.generateOceanStates(),
            achievements: this.generateAchievements(),
            insights: this.generateInsights(),
            recommendations: this.generateRecommendations()
        };
        return report;
    },
    /**
     * Get current language from storage
     * @private
     * @returns {string} Language code
     */
    _getLanguage() {
        return localStorage.getItem('whispers-language') || REPORT_CONFIG.DEFAULT_LANGUAGE;
    },

    /**
     * Generate report metadata
     * @returns {Object} Metadata object
     */
    generateMetadata() {
        const selectedWave = localStorage.getItem('whispers-selected-wave');
        const waveData = typeof SplashScreen !== 'undefined' ?
            SplashScreen.waveTypes[selectedWave] : null;
        
        return {
            generatedAt: new Date().toISOString(),
            appVersion: '1.0.0',
            language: this._getLanguage(),
            selectedWave: {
                id: selectedWave,
                name: waveData?.name || 'Unknown',
                nameEn: waveData?.nameEn || 'Unknown'
            }
        };
    },
    generateSummary(){
const expressionHistory = typeof ExpressionAnalyzer !== 'undefined' ?
ExpressionAnalyzer.getHistory(): [];
        const achievementStats = typeof AchievementSystem !== 'undefined' ?
AchievementSystem.getStatistics():{unlocked: 0,total: 0,percentage: 0};
        const duration = expressionHistory.length > 0 ?
expressionHistory[expressionHistory.length - 1].timestamp - expressionHistory[0].timestamp : 0;
        return{
totalMessages: expressionHistory.length,
duration: duration,
durationFormatted: this.formatDuration(duration),
achievementsUnlocked: achievementStats.unlocked,
achievementsTotal: achievementStats.total,
completionPercentage: achievementStats.percentage,
startDate: expressionHistory[0]?.timestamp || Date.now(),
endDate: expressionHistory[expressionHistory.length - 1]?.timestamp || Date.now()
};
},
    generateEmotionalJourney(){
const expressionHistory = typeof ExpressionAnalyzer !== 'undefined' ?
ExpressionAnalyzer.getHistory(): [];
        if(expressionHistory.length === 0){
return{
timeline: [],
startState: null,
endState: null,
progression: 0,
peaks: [],
valleys: []
};
}
 // Create timeline
const timeline = expressionHistory.map((entry,index) => ({
index: index + 1,
timestamp: entry.timestamp,
overall: entry.overall,
clarity: entry.clarity,
emotionalAwareness: entry.emotionalAwareness,
message: entry.message
}));
        // Find peaks and valleys
        const peaks = [];
        const valleys = [];
        expressionHistory.forEach((entry, index) => {
            if (index === 0 || index === expressionHistory.length - 1) return;
            
            const prev = expressionHistory[index - 1].overall;
            const curr = entry.overall;
            const next = expressionHistory[index + 1].overall;
            
            if (curr > prev && curr > next) {
                peaks.push({ index: index + 1, score: curr, message: entry.message });
            } else if (curr < prev && curr < next) {
                valleys.push({ index: index + 1, score: curr, message: entry.message });
            }
        });

        const startState = this.classifyEmotionalState(expressionHistory[0].overall);
        const endState = this.classifyEmotionalState(expressionHistory[expressionHistory.length - 1].overall);
        const progression = expressionHistory[expressionHistory.length - 1].overall - expressionHistory[0].overall;

        return {
            timeline,
            startState,
            endState,
            progression: Math.round(progression),
            peaks: peaks.slice(0, REPORT_CONFIG.MAX_PEAKS_VALLEYS),
            valleys: valleys.slice(0, REPORT_CONFIG.MAX_PEAKS_VALLEYS)
        };
},
    generateExpressionMetrics(){
if(typeof ExpressionAnalyzer === 'undefined'){
return null;
}
        const history = ExpressionAnalyzer.getHistory();
const trend = ExpressionAnalyzer.getImprovementTrend();
const level = ExpressionAnalyzer.getCurrentLevel();
const report = ExpressionAnalyzer.getProgressReport();
        if( ! report)return null;
        // Calculate averages and maxes in a single pass
        const stats = history.reduce((acc, m) => {
            acc.clarity.sum += m.clarity;
            acc.clarity.max = Math.max(acc.clarity.max, m.clarity);
            acc.specificity.sum += m.specificity;
            acc.specificity.max = Math.max(acc.specificity.max, m.specificity);
            acc.emotionalAwareness.sum += m.emotionalAwareness;
            acc.emotionalAwareness.max = Math.max(acc.emotionalAwareness.max, m.emotionalAwareness);
            return acc;
        }, {
            clarity: { sum: 0, max: 0 },
            specificity: { sum: 0, max: 0 },
            emotionalAwareness: { sum: 0, max: 0 }
        });

        const count = history.length;

        return {
            currentLevel: level,
            trend: trend,
            averageScores: {
                clarity: Math.round(stats.clarity.sum / count),
                specificity: Math.round(stats.specificity.sum / count),
                emotionalAwareness: Math.round(stats.emotionalAwareness.sum / count),
                overall: report.averageScore
            },
            maxScores: {
                clarity: Math.round(stats.clarity.max),
                specificity: Math.round(stats.specificity.max),
                emotionalAwareness: Math.round(stats.emotionalAwareness.max),
                overall: report.best.score
            },
            bestMessage: report.best,
            improvement: trend.improvement
        };
},
    generateOceanStates(){
if(typeof OceanDynamics === 'undefined'){
return null;
}
        const currentState = OceanDynamics.getCurrentState();
const statesReached = typeof AppFacade !== 'undefined' ?
(AppFacade.getState().statesReached || []): [];
        const stateProgression = statesReached.map(stateId => ({
id: stateId,
name: OceanDynamics.states[stateId]?.name || stateId,
nameEn: OceanDynamics.states[stateId]?.nameEn || stateId,
description: OceanDynamics.states[stateId]?.description || ''
}));
        return{
currentState:{
id: currentState.id,
name: currentState.name,
nameEn: currentState.nameEn,
description: currentState.description
},
statesReached: stateProgression,
totalStatesExperienced: statesReached.length,
progressionPercentage: OceanDynamics.getProgressionPercentage(currentState.id)
};
},
    generateAchievements(){
if(typeof AchievementSystem === 'undefined'){
return null;
}
        const stats = AchievementSystem.getStatistics();
const unlocked = AchievementSystem.getUnlockedAchievements();
const recent = AchievementSystem.getRecentlyUnlocked(5);
 // Group by rarity
const byRarity = {};
unlocked.forEach(achievement => {
if( ! byRarity[achievement.rarity]){
byRarity[achievement.rarity] = [];
}
byRarity[achievement.rarity].push({
id: achievement.id,
name: achievement.name,
nameEn: achievement.nameEn,
description: achievement.description,
descriptionEn: achievement.descriptionEn,
icon: achievement.icon,
unlockedAt: achievement.unlockedAt
});
});
        return{
total: stats.total,
unlocked: stats.unlocked,
percentage: stats.percentage,
byCategory: stats.byCategory,
byRarity: byRarity,
recentlyUnlocked: recent.map(a => ({
id: a.id,
name: a.name,
nameEn: a.nameEn,
icon: a.icon,
rarity: a.rarity,
unlockedAt: a.unlockedAt
}))
};
},
    /**
     * Generate insights based on user progress
     * @returns {Array<Object>} Array of insight objects
     */
    generateInsights() {
        const lang = this._getLanguage();
        const insights = [];

        // Expression insights
        if (typeof ExpressionAnalyzer !== 'undefined') {
            const trend = ExpressionAnalyzer.getImprovementTrend();
            const level = ExpressionAnalyzer.getCurrentLevel();
            
            if (trend.improvement > REPORT_CONFIG.IMPROVEMENT_THRESHOLD) {
                insights.push({
                    type: 'positive',
                    category: 'expression',
                    text: lang === 'es' ?
                        `Has mejorado significativamente tu expresión en ${trend.improvement} puntos. ¡Excelente progreso!` :
                        `You've significantly improved your expression by ${trend.improvement} points. Excellent progress!`
                });
            }
            
            if (level.level >= REPORT_CONFIG.EXPERT_LEVEL_THRESHOLD) {
                insights.push({
                    type: 'achievement',
                    category: 'expression',
                    text: lang === 'es' ?
                        `Alcanzaste el nivel "${level.name}". Tu capacidad de expresión es excepcional.` :
                        `You reached "${level.nameEn}" level. Your expression ability is exceptional.`
                });
            }
        }

        // Ocean insights
        if (typeof OceanDynamics !== 'undefined') {
            const currentState = OceanDynamics.getCurrentState();
            if (currentState.id === 'resolved') {
                insights.push({
                    type: 'positive',
                    category: 'ocean',
                    text: lang === 'es' ?
                        'Alcanzaste un estado de resolución y paz interior. Has completado un viaje significativo.' :
                        'You reached a state of resolution and inner peace. You\'ve completed a significant journey.'
                });
            }
        }

        // Achievement insights
        if (typeof AchievementSystem !== 'undefined') {
            const stats = AchievementSystem.getStatistics();
            if (stats.percentage >= REPORT_CONFIG.ACHIEVEMENT_MILESTONE) {
                insights.push({
                    type: 'achievement',
                    category: 'achievements',
                    text: lang === 'es' ?
                        `Has desbloqueado ${stats.percentage}% de los logros. ¡Vas por buen camino!` :
                        `You've unlocked ${stats.percentage}% of achievements. You're on the right track!`
                });
            }
        }

        return insights;
    },
    /**
     * Generate personalized recommendations
     * @returns {Array<Object>} Array of recommendation objects
     */
    generateRecommendations() {
        const lang = this._getLanguage();
        const recommendations = [];

        // Expression recommendations
        if (typeof ExpressionAnalyzer !== 'undefined') {
            const report = ExpressionAnalyzer.getProgressReport();
            
            if (report && report.metrics.clarity.current < 60) {
                recommendations.push({
                    category: 'expression',
                    priority: 'high',
                    text: lang === 'es' ?
                        'Intenta ser más específico sobre lo que sientes. Usa frases como "me siento..." en lugar de "creo que..."' :
                        'Try to be more specific about what you feel. Use phrases like "I feel..." instead of "I think..."'
                });
            }
            
            if (report && report.metrics.emotionalAwareness.current < 60) {
                recommendations.push({
                    category: 'expression',
                    priority: 'medium',
                    text: lang === 'es' ?
                        'Practica identificar y nombrar tus emociones. Esto te ayudará a procesarlas mejor.' :
                        'Practice identifying and naming your emotions. This will help you process them better.'
                });
            }
        }

        // Ocean recommendations
        if (typeof OceanDynamics !== 'undefined') {
            const currentState = OceanDynamics.getCurrentState();
            if (currentState.id === 'confused' || currentState.id === 'anxious') {
                recommendations.push({
                    category: 'ocean',
                    priority: 'high',
                    text: lang === 'es' ?
                        'Tómate un momento para respirar profundamente. La claridad vendrá con calma.' :
                        'Take a moment to breathe deeply. Clarity will come with calmness.'
                });
            }
        }

        // General recommendations
        recommendations.push({
            category: 'general',
            priority: 'low',
            text: lang === 'es' ?
                'Continúa tu viaje. Cada conversación es una oportunidad de crecimiento.' :
                'Continue your journey. Every conversation is an opportunity for growth.'
        });

        return recommendations;
    },
    /**
     * Classify emotional state based on score
     * @param {number} score - Emotional score (0-100)
     * @returns {string} State classification
     */
    classifyEmotionalState(score) {
        if (score >= 80) return 'resolved';
        if (score >= 60) return 'clarity';
        if (score >= 40) return 'processing';
        if (score >= 20) return 'anxious';
        return 'confused';
    },

    /**
     * Format duration in human-readable format
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted duration string
     */
    formatDuration(ms) {
        // Input validation
        if (typeof ms !== 'number' || ms < 0 || !isFinite(ms)) {
            return '0s';
        }

        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    },
    /**
     * Export report as JSON string
     * @param {Object} report - Report object
     * @returns {string} JSON string
     */
    exportJSON(report) {
        return JSON.stringify(report, null, 2);
    },

    /**
     * Download file using available method
     * @private
     * @param {string} filename - File name
     * @param {string} content - File content
     * @param {string} mimeType - MIME type
     */
    _downloadFile(filename, content, mimeType) {
        if (typeof HistoryExport !== 'undefined' && typeof HistoryExport.downloadFile === 'function') {
            HistoryExport.downloadFile(filename, content, mimeType);
        } else {
            // Fallback to direct Blob download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    },

    /**
     * Download report as JSON file
     * @param {Object} report - Report object
     */
    downloadJSON(report) {
        const json = this.exportJSON(report);
        const filename = `whispers-journey-${Date.now()}.json`;
        const mimeType = 'application/json';
        this._downloadFile(filename, json, mimeType);
    },
    /**
     * Get text translation helper
     * @param {string} lang - Language code
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    _getText(lang, key) {
        const texts = {
            journeyReport: { es: 'INFORME DE VIAJE', en: 'JOURNEY REPORT', ro: 'RAPORT DE CĂLĂTORIE' },
            generated: { es: 'Generado: ', en: 'Generated: ', ro: 'Generat: ' },
            selectedWave: { es: 'Ola Seleccionada: ', en: 'Selected Wave: ', ro: 'Val Selectat: ' },
            summary: { es: 'RESUMEN', en: 'SUMMARY', ro: 'REZUMAT' },
            totalMessages: { es: 'Mensajes Totales: ', en: 'Total Messages: ', ro: 'Mesaje Totale: ' },
            duration: { es: 'Duración: ', en: 'Duration: ', ro: 'Durată: ' },
            achievementsUnlocked: { es: 'Logros Desbloqueados: ', en: 'Achievements Unlocked: ', ro: 'Realizări Deblocate: ' },
            expressionMetrics: { es: 'MÉTRICAS DE EXPRESIÓN', en: 'EXPRESSION METRICS', ro: 'METRICI DE EXPRESIE' },
            currentLevel: { es: 'Nivel Actual: ', en: 'Current Level: ', ro: 'Nivel Actual: ' },
            totalImprovement: { es: 'Mejora Total: ', en: 'Total Improvement: ', ro: 'Îmbunătățire Totală: ' },
            averages: { es: 'Promedios:', en: 'Averages:', ro: 'Medii:' },
            clarity: { es: 'Claridad', en: 'Clarity', ro: 'Claritate' },
            specificity: { es: 'Especificidad', en: 'Specificity', ro: 'Specificitate' },
            emotionalAwareness: { es: 'Conciencia Emocional', en: 'Emotional Awareness', ro: 'Conștiință Emoțională' },
            overall: { es: 'General', en: 'Overall', ro: 'General' },
            oceanStates: { es: 'ESTADOS DEL OCÉANO', en: 'OCEAN STATES', ro: 'STĂRI ALE OCEANULUI' },
            currentState: { es: 'Estado Actual: ', en: 'Current State: ', ro: 'Stare Actuală: ' },
            statesExperienced: { es: 'Estados Experimentados: ', en: 'States Experienced: ', ro: 'Stări Experimentate: ' },
            progress: { es: 'Progreso: ', en: 'Progress: ', ro: 'Progres: ' },
            insights: { es: 'INSIGHTS', en: 'INSIGHTS', ro: 'PERSPECTIVE' },
            recommendations: { es: 'RECOMENDACIONES', en: 'RECOMMENDATIONS', ro: 'RECOMANDĂRI' },
            thankYou: { es: 'Gracias por tu viaje en Whispers of the Wave', en: 'Thank you for your journey in Whispers of the Wave', ro: 'Mulțumim pentru călătoria ta în Whispers of the Wave' }
        };
        return texts[key]?.[lang] || texts[key]?.en || key;
    },

    /**
     * Get localized name from object
     * @param {object} obj - Object with name, nameEn, nameRo
     * @param {string} lang - Language code
     * @returns {string} Localized name
     */
    _getLocalizedName(obj, lang) {
        if (lang === 'ro') return obj.nameRo || obj.nameEn || obj.name;
        if (lang === 'en') return obj.nameEn || obj.name;
        return obj.name;
    },

    exportText(report){
        const lang = report.metadata.language;
        let text = '';
        
        // Header
        text += '═══════════════════════════════════════════════════════\n';
        text += `  WHISPERS OF THE WAVE - ${this._getText(lang, 'journeyReport')}\n`;
        text += '═══════════════════════════════════════════════════════\n\n';
        
        // Metadata
        text += this._getText(lang, 'generated');
        text += new Date(report.metadata.generatedAt).toLocaleString() + '\n';
        text += this._getText(lang, 'selectedWave');
        text += this._getLocalizedName(report.metadata.selectedWave, lang) + '\n\n';
        
        // Summary
        text += '───────────────────────────────────────────────────────\n';
        text += this._getText(lang, 'summary') + '\n';
        text += '───────────────────────────────────────────────────────\n';
        text += this._getText(lang, 'totalMessages');
        text += report.summary.totalMessages + '\n';
        text += this._getText(lang, 'duration');
        text += report.summary.durationFormatted + '\n';
        text += this._getText(lang, 'achievementsUnlocked');
        text += `${report.summary.achievementsUnlocked} / ${report.summary.achievementsTotal} (${report.summary.completionPercentage}%)\n\n`;

        // Expression Metrics
        if (report.expressionMetrics) {
            text += '───────────────────────────────────────────────────────\n';
            text += this._getText(lang, 'expressionMetrics') + '\n';
            text += '───────────────────────────────────────────────────────\n';
            text += this._getText(lang, 'currentLevel');
            text += this._getLocalizedName(report.expressionMetrics.currentLevel, lang) + '\n';
            text += this._getText(lang, 'totalImprovement');
            text += `${report.expressionMetrics.improvement > 0 ? '+' : ''}${report.expressionMetrics.improvement}\n\n`;
            text += this._getText(lang, 'averages') + '\n';
            text += `  ${this._getText(lang, 'clarity')}: ${report.expressionMetrics.averageScores.clarity}%\n`;
            text += `  ${this._getText(lang, 'specificity')}: ${report.expressionMetrics.averageScores.specificity}%\n`;
            text += `  ${this._getText(lang, 'emotionalAwareness')}: ${report.expressionMetrics.averageScores.emotionalAwareness}%\n`;
            text += `  ${this._getText(lang, 'overall')}: ${report.expressionMetrics.averageScores.overall}\n\n`;
        }

        // Ocean States
        if (report.oceanStates) {
            text += '───────────────────────────────────────────────────────\n';
            text += this._getText(lang, 'oceanStates') + '\n';
            text += '───────────────────────────────────────────────────────\n';
            text += this._getText(lang, 'currentState');
            text += this._getLocalizedName(report.oceanStates.currentState, lang) + '\n';
            text += this._getText(lang, 'statesExperienced');
            text += report.oceanStates.totalStatesExperienced + '\n';
            text += this._getText(lang, 'progress');
            text += report.oceanStates.progressionPercentage + '%\n\n';
        }
        
        // Insights
        if (report.insights.length > 0) {
            text += '───────────────────────────────────────────────────────\n';
            text += this._getText(lang, 'insights') + '\n';
            text += '───────────────────────────────────────────────────────\n';
            report.insights.forEach((insight, i) => {
                text += `${i + 1}. ${insight.text}\n`;
            });
            text += '\n';
        }

        // Recommendations
        if (report.recommendations.length > 0) {
            text += '───────────────────────────────────────────────────────\n';
            text += this._getText(lang, 'recommendations') + '\n';
            text += '───────────────────────────────────────────────────────\n';
            report.recommendations.forEach((rec, i) => {
                text += `${i + 1}. ${rec.text}\n`;
            });
            text += '\n';
        }

        // Footer
        text += '═══════════════════════════════════════════════════════\n';
        text += `  ${this._getText(lang, 'thankYou')}\n`;
        text += '═══════════════════════════════════════════════════════\n';

        return text;
    },
    /**
     * Download report as text file
     * @param {Object} report - Report object
     */
    downloadText(report) {
        const text = this.exportText(report);
        const filename = `whispers-journey-${Date.now()}.txt`;
        const mimeType = 'text/plain;charset=utf-8';
        this._downloadFile(filename, text, mimeType);
    }
};
// Expose for use
window.ReportGenerator = ReportGenerator;