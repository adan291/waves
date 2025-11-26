```javascript
const ReportGenerator = {
    generate(){
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
    generateMetadata(){
const selectedWave = localStorage.getItem('whispers - selected - wave');
const waveData = typeof SplashScreen !== 'undefined' ?
SplashScreen.waveTypes[selectedWave] : null;
        return{
generatedAt: new Date().toISOString(),
appVersion: '1.0.0',
language: localStorage.getItem('whispers - language')|| 'es',
selectedWave:{
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
        expressionHistory.forEach((entry,index) => {
if(index === 0 || index === expressionHistory.length - 1)return;
            const prev = expressionHistory[index - 1].overall;
const curr = entry.overall;
const next = expressionHistory[index + 1].overall;
            if(curr > prev && curr > next){
peaks.push({index: index + 1,score: curr,message: entry.message});
}else if(curr < prev && curr < next){
valleys.push({index: index + 1,score: curr,message: entry.message});
}
});
        const startState = this.classifyEmotionalState(expressionHistory[0].overall);
const endState = this.classifyEmotionalState(expressionHistory[expressionHistory.length - 1].overall);
const progression = expressionHistory[expressionHistory.length - 1].overall - expressionHistory[0].overall;
        return{
timeline,
startState,
endState,
progression: Math.round(progression),
peaks: peaks.slice(0,3), // Top 3 peaks
valleys: valleys.slice(0,3) // Top 3 valleys
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
        return{
currentLevel: level,
trend: trend,
averageScores:{
clarity: Math.round(history.reduce((sum,m) => sum + m.clarity,0) / history.length),
specificity: Math.round(history.reduce((sum,m) => sum + m.specificity,0) / history.length),
emotionalAwareness: Math.round(history.reduce((sum,m) => sum + m.emotionalAwareness,0) / history.length),
overall: report.averageScore
},
maxScores:{
clarity: Math.round(Math.max(...history.map(m => m.clarity))),
specificity: Math.round(Math.max(...history.map(m => m.specificity))),
emotionalAwareness: Math.round(Math.max(...history.map(m => m.emotionalAwareness))),
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
    generateInsights(){
const lang = localStorage.getItem('whispers - language')|| 'es';
const insights = [];
 // Expression insights
if(typeof ExpressionAnalyzer !== 'undefined'){
const trend = ExpressionAnalyzer.getImprovementTrend();
const level = ExpressionAnalyzer.getCurrentLevel();
            if(trend.improvement > 20){
insights.push({
type: 'positive',
category: 'expression',
text: lang === 'es' ?
`Has mejorado significativamente tu expresión en ${trend.improvement}puntos. ¡Excelente progreso ! ` :
`You've significantly improved your expression by ${trend.improvement}points. Excellent progress ! `
});
}
            if(level.level >= 4){
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
if(typeof OceanDynamics !== 'undefined'){
const currentState = OceanDynamics.getCurrentState();
            if(currentState.id === 'resolved'){
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
if(typeof AchievementSystem !== 'undefined'){
const stats = AchievementSystem.getStatistics();
            if(stats.percentage >= 50){
insights.push({
type: 'achievement',
category: 'achievements',
text: lang === 'es' ?
`Has desbloqueado ${stats.percentage}% de los logros. ¡Vas por buen camino ! ` :
`You've unlocked ${stats.percentage}% of achievements. You're on the right track ! `
});
}
}
        return insights;
},
    generateRecommendations(){
const lang = localStorage.getItem('whispers - language')|| 'es';
const recommendations = [];
 // Expression recommendations
if(typeof ExpressionAnalyzer !== 'undefined'){
const report = ExpressionAnalyzer.getProgressReport();
            if(report && report.metrics.clarity.current < 60){
recommendations.push({
category: 'expression',
priority: 'high',
text: lang === 'es' ?
'Intenta ser más específico sobre lo que sientes. Usa frases como "me siento..." en lugar de "creo que..."' :
'Try to be more specific about what you feel. Use phrases like "I feel..." instead of "I think..."'
});
}
            if(report && report.metrics.emotionalAwareness.current < 60){
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
if(typeof OceanDynamics !== 'undefined'){
const currentState = OceanDynamics.getCurrentState();
            if(currentState.id === 'confused' || currentState.id === 'anxious'){
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
    classifyEmotionalState(score){
if(score >= 80)return 'resolved';
if(score >= 60)return 'clarity';
if(score >= 40)return 'processing';
if(score >= 20)return 'anxious';
return 'confused';
},
    formatDuration(ms){
const seconds = Math.floor(ms / 1000);
const minutes = Math.floor(seconds / 60);
const hours = Math.floor(minutes / 60);
const days = Math.floor(hours / 24);
        if(days > 0)return `${days}d ${hours % 24}h`;
if(hours > 0)return `${hours}h ${minutes % 60}m`;
if(minutes > 0)return `${minutes}m ${seconds % 60}s`;
return `${seconds}s`;
},
    exportJSON(report){
return JSON.stringify(report,null,2);
},
    downloadJSON(report){
        // HistoryExport is designed for conversation history, not summary reports.
        // However, if HistoryExport exposes a generic file download utility, we can use it.
        // Assuming HistoryExport.downloadFile exists for generic file downloads.
        const json = this.exportJSON(report);
        const filename = `whispers-journey-${Date.now()}.json`;
        const mimeType = 'application/json';

        if (typeof HistoryExport !== 'undefined' && typeof HistoryExport.downloadFile === 'function') {
            HistoryExport.downloadFile(filename, json, mimeType);
        } else {
            // Fallback to direct Blob download if HistoryExport.downloadFile is not available
            const blob = new Blob([json], {type: mimeType});
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
    exportText(report){
const lang = report.metadata.language;
let text = '';
 // Header
text += '═══════════════════════════════════════════════════════\n';
text += lang === 'es' ?
'  WHISPERS OF THE WAVE - INFORME DE VIAJE\n' :
'  WHISPERS OF THE WAVE - JOURNEY REPORT\n';
text += '═══════════════════════════════════════════════════════\n\n';
 // Metadata
text += lang === 'es' ? 'Generado: ' : 'Generated: ';
text += new Date(report.metadata.generatedAt).toLocaleString() + '\n';
text += lang === 'es' ? 'Ola Seleccionada: ' : 'Selected Wave: ';
text += (lang === 'es' ? report.metadata.selectedWave.name : report.metadata.selectedWave.nameEn) + '\n\n';
 // Summary
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'RESUMEN\n' : 'SUMMARY\n';
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'Mensajes Totales: ' : 'Total Messages: ';
text += report.summary.totalMessages + '\n';
text += lang === 'es' ? 'Duración: ' : 'Duration: ';
text += report.summary.durationFormatted + '\n';
text += lang === 'es' ? 'Logros Desbloqueados: ' : 'Achievements Unlocked: ';\ntext += `${report.summary.achievementsUnlocked} / ${report.summary.achievementsTotal}(${report.summary.completionPercentage}%)\n\n`;
 // Expression Metrics
if(report.expressionMetrics){
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'MÉTRICAS DE EXPRESIÓN\n' : 'EXPRESSION METRICS\n';
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'Nivel Actual: ' : 'Current Level: ';\ntext += (lang === 'es' ? report.expressionMetrics.currentLevel.name : report.expressionMetrics.currentLevel.nameEn) + '\n';
text += lang === 'es' ? 'Mejora Total: ' : 'Total Improvement: ';\ntext += `${report.expressionMetrics.improvement > 0 ? ' + ' : ''}${report.expressionMetrics.improvement}\n\n`;
            text += lang === 'es' ? 'Promedios:\n' : 'Averages:\n';
text += `  ${lang === 'es' ? 'Claridad' : 'Clarity'}: ${report.expressionMetrics.averageScores.clarity}%\n`;
text += `  ${lang === 'es' ? 'Especificidad' : 'Specificity'}: ${report.expressionMetrics.averageScores.specificity}%\n`;
text += `  ${lang === 'es' ? 'Conciencia Emocional' : 'Emotional Awareness'}: ${report.expressionMetrics.averageScores.emotionalAwareness}%\n`;
text += `  ${lang === 'es' ? 'General' : 'Overall'}: ${report.expressionMetrics.averageScores.overall}\n\n`;
}
 // Ocean States
if(report.oceanStates){
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'ESTADOS DEL OCÉANO\n' : 'OCEAN STATES\n';
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'Estado Actual: ' : 'Current State: ';\ntext += (lang === 'es' ? report.oceanStates.currentState.name : report.oceanStates.currentState.nameEn) + '\n';
text += lang === 'es' ? 'Estados Experimentados: ' : 'States Experienced: ';\ntext += report.oceanStates.totalStatesExperienced + '\n';
text += lang === 'es' ? 'Progreso: ' : 'Progress: ';\ntext += report.oceanStates.progressionPercentage + '%\n\n';
}
 // Insights
if(report.insights.length > 0){
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'INSIGHTS\n' : 'INSIGHTS\n';
text += '───────────────────────────────────────────────────────\n';
report.insights.forEach((insight,i) => {
text += `${i + 1}. ${insight.text}\n`;
});
text += '\n';
}
 // Recommendations
if(report.recommendations.length > 0){
text += '───────────────────────────────────────────────────────\n';
text += lang === 'es' ? 'RECOMENDACIONES\n' : 'RECOMMENDATIONS\n';
text += '───────────────────────────────────────────────────────\n';
report.recommendations.forEach((rec,i) => {
text += `${i + 1}. ${rec.text}\n`;
});
text += '\n';
}
 // Footer
text += '═══════════════════════════════════════════════════════\n';
text += lang === 'es' ?
'  Gracias por tu viaje en Whispers of the Wave\n' :
'  Thank you for your journey in Whispers of the Wave\n';
text += '═══════════════════════════════════════════════════════\n';
        return text;
},
    downloadText(report){
        // HistoryExport is designed for conversation history, not summary reports.
        // However, if HistoryExport exposes a generic file download utility, we can use it.
        // Assuming HistoryExport.downloadFile exists for generic file downloads.
        const text = this.exportText(report);
        const filename = `whispers-journey-${Date.now()}.txt`;
        const mimeType = 'text/plain;charset=utf-8';

        if (typeof HistoryExport !== 'undefined' && typeof HistoryExport.downloadFile === 'function') {
            HistoryExport.downloadFile(filename, text, mimeType);
        } else {
            // Fallback to direct Blob download if HistoryExport.downloadFile is not available
            const blob = new Blob([text], {type: mimeType});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
};
 // Expose for use
window.ReportGenerator = ReportGenerator;
```