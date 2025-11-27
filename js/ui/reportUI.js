const ReportUI = {
    currentReport: null,

    async show() {
        // Remove existing modal if present
        const existingModal = document.querySelector('.report-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Lazy load ReportGenerator if not available
        if (typeof ReportGenerator === 'undefined') {
            try {
                // Show loading state if possible (optional)
                document.body.style.cursor = 'wait';

                if (typeof LazyLoadManager !== 'undefined') {
                    await LazyLoadManager.loadModule('js/engine/reportGenerator.js', 'reportGenerator');
                } else {
                    // Fallback manual loading
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'js/engine/reportGenerator.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                document.body.style.cursor = 'default';
            } catch (error) {
                console.error('Failed to load ReportGenerator:', error);
                document.body.style.cursor = 'default';
                return;
            }
        }

        // Generate report
        this.currentReport = ReportGenerator.generate();
        // Create and show modal
        const modal = this.createModal(this.currentReport);
        document.body.appendChild(modal);
    },

    createModal(report) {
        const lang = report.metadata.language;
        const modal = document.createElement('div');
        modal.className = 'report-modal';
        modal.innerHTML = `
            <div class="report-overlay" onclick="this.parentElement.remove()"></div>
            <div class="report-container">
                ${this.renderHeader(report, lang)}
                ${this.renderBody(report, lang)}
                ${this.renderFooter(report, lang)}
            </div>
        `;
        return modal;
    },

    renderHeader(report, lang) {
        const title = typeof i18n !== 'undefined' ? i18n.t('report.title') : 'Informe de Viaje';
        
        // Get wave name by language
        const getWaveName = () => {
            if (lang === 'ro') return report.metadata.selectedWave.nameRo || report.metadata.selectedWave.nameEn || report.metadata.selectedWave.name;
            if (lang === 'en') return report.metadata.selectedWave.nameEn || report.metadata.selectedWave.name;
            return report.metadata.selectedWave.name;
        };
        
        return `
            <div class="report-header">
                <div class="report-title">
                    <h2>🌊 ${title}</h2>
                    <p class="report-subtitle">${getWaveName()}</p>
                </div>
                <button class="report-close" onclick="this.closest('.report-modal').remove()">×</button>
            </div>
        `;
    },

    renderBody(report, lang) {
        return `
            <div class="report-body">
                ${this.renderSummary(report.summary, lang)}
                ${this.renderEmotionalJourney(report.emotionalJourney, lang)}
                ${report.expressionMetrics ? this.renderExpressionMetrics(report.expressionMetrics, lang) : ''}
                ${report.oceanStates ? this.renderOceanStates(report.oceanStates, lang) : ''}
                ${report.achievements ? this.renderAchievements(report.achievements, lang) : ''}
                ${this.renderInsights(report.insights, lang)}
                ${this.renderRecommendations(report.recommendations, lang)}
            </div>
        `;
    },

    renderSummary(summary, lang) {
        const labels = {
            summary: { es: '📊 Resumen', en: '📊 Summary', ro: '📊 Rezumat' },
            messages: { es: 'Mensajes', en: 'Messages', ro: 'Mesaje' },
            duration: { es: 'Duración', en: 'Duration', ro: 'Durată' },
            achievements: { es: 'Logros', en: 'Achievements', ro: 'Realizări' },
            completed: { es: 'Completado', en: 'Completed', ro: 'Completat' }
        };
        return `
            <div class="report-section">
                <h3>${labels.summary[lang] || labels.summary.en}</h3>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-value">${summary.totalMessages}</div>
                        <div class="summary-label">${labels.messages[lang] || labels.messages.en}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${summary.durationFormatted}</div>
                        <div class="summary-label">${labels.duration[lang] || labels.duration.en}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${summary.achievementsUnlocked} / ${summary.achievementsTotal}</div>
                        <div class="summary-label">${labels.achievements[lang] || labels.achievements.en}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${summary.completionPercentage}%</div>
                        <div class="summary-label">${labels.completed[lang] || labels.completed.en}</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderEmotionalJourney(journey, lang) {
        if (journey.timeline.length === 0) {
            return '';
        }
        const labels = {
            title: { es: '💫 Viaje Emocional', en: '💫 Emotional Journey', ro: '💫 Călătorie Emoțională' },
            start: { es: 'Inicio:', en: 'Start:', ro: 'Început:' },
            current: { es: 'Actual:', en: 'Current:', ro: 'Actual:' }
        };
        return `
            <div class="report-section">
                <h3>${labels.title[lang] || labels.title.en}</h3>
                <div class="journey-summary">
                    <div class="journey-state">
                        <span class="state-label">${labels.start[lang] || labels.start.en}</span>
                        <span class="state-value">${this.getStateName(journey.startState, lang)}</span>
                    </div>
                    <div class="journey-arrow">→</div>
                    <div class="journey-state">
                        <span class="state-label">${labels.current[lang] || labels.current.en}</span>
                        <span class="state-value">${this.getStateName(journey.endState, lang)}</span>
                    </div>
                    <div class="journey-progression ${journey.progression >= 0 ? 'positive' : 'negative'}">
                        ${journey.progression >= 0 ? '+' : ''}${journey.progression}
                    </div>
                </div>
                ${this.renderChart(journey.timeline)}
                ${journey.peaks.length > 0 ? this.renderPeaksValleys(journey.peaks, journey.valleys, lang) : ''}
            </div>
        `;
    },

    renderChart(timeline) {
        const maxScore = Math.max(...timeline.map(t => t.overall));
        const minScore = Math.min(...timeline.map(t => t.overall));
        const range = maxScore - minScore || 1;
        return `
            <div class="chart-container">
                <div class="chart">
                    ${timeline.map((point, index) => {
            const height = ((point.overall - minScore) / range) * 100;
            return `
                            <div class="chart-bar" style="height: ${height}%" title="Mensaje ${index + 1}: ${point.overall}">
                                <div class="chart-bar-fill"></div>
                            </div>
                        `;
        }).join('')}
                </div>
                <div class="chart-labels">
                    <span>0</span>
                    <span>${Math.floor(timeline.length / 2)}</span>
                    <span>${timeline.length}</span>
                </div>
            </div>
        `;
    },

    renderPeaksValleys(peaks, valleys, lang) {
        const labels = {
            highPoints: { es: 'Momentos Altos', en: 'High Points', ro: 'Momente Înalte' },
            lowPoints: { es: 'Momentos Bajos', en: 'Low Points', ro: 'Momente Joase' }
        };
        return `
            <div class="peaks-valleys">
                ${peaks.length > 0 ? `
                    <div class="peaks">
                        <h4>📈 ${labels.highPoints[lang] || labels.highPoints.en}</h4>
                        ${peaks.map(peak => `
                            <div class="moment-item">
                                <span class="moment-score">${peak.score}</span>
                                <span class="moment-text">"${peak.message}"</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${valleys.length > 0 ? `
                    <div class="valleys">
                        <h4>📉 ${labels.lowPoints[lang] || labels.lowPoints.en}</h4>
                        ${valleys.map(valley => `
                            <div class="moment-item">
                                <span class="moment-score">${valley.score}</span>
                                <span class="moment-text">"${valley.message}"</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },

    renderExpressionMetrics(metrics, lang) {
        const labels = {
            title: { es: '💎 Métricas de Expresión', en: '💎 Expression Metrics', ro: '💎 Metrici de Expresie' },
            level: { es: 'Nivel:', en: 'Level:', ro: 'Nivel:' },
            points: { es: 'puntos', en: 'points', ro: 'puncte' },
            clarity: { es: 'Claridad', en: 'Clarity', ro: 'Claritate' },
            specificity: { es: 'Especificidad', en: 'Specificity', ro: 'Specificitate' },
            emotionalAwareness: { es: 'Conciencia Emocional', en: 'Emotional Awareness', ro: 'Conștiință Emoțională' }
        };
        
        // Get level name by language
        const getLevelName = () => {
            if (lang === 'ro') return metrics.currentLevel.nameRo || metrics.currentLevel.nameEn || metrics.currentLevel.name;
            if (lang === 'en') return metrics.currentLevel.nameEn || metrics.currentLevel.name;
            return metrics.currentLevel.name;
        };
        
        return `
            <div class="report-section">
                <h3>${labels.title[lang] || labels.title.en}</h3>
                <div class="metrics-summary">
                    <div class="metric-level">
                        <span class="level-label">${labels.level[lang] || labels.level.en}</span>
                        <span class="level-value">${getLevelName()}</span>
                    </div>
                    <div class="metric-improvement ${metrics.improvement >= 0 ? 'positive' : 'negative'}">
                        ${metrics.improvement >= 0 ? '+' : ''}${metrics.improvement} ${labels.points[lang] || labels.points.en}
                    </div>
                </div>
                <div class="metrics-bars">
                    ${this.renderMetricBar(labels.clarity[lang] || labels.clarity.en, metrics.averageScores.clarity, metrics.maxScores.clarity)}
                    ${this.renderMetricBar(labels.specificity[lang] || labels.specificity.en, metrics.averageScores.specificity, metrics.maxScores.specificity)}
                    ${this.renderMetricBar(labels.emotionalAwareness[lang] || labels.emotionalAwareness.en, metrics.averageScores.emotionalAwareness, metrics.maxScores.emotionalAwareness)}
                </div>
            </div>
        `;
    },

    renderMetricBar(label, average, max) {
        return `
            <div class="metric-bar-container">
                <div class="metric-bar-label">${label}</div>
                <div class="metric-bar-wrapper">
                    <div class="metric-bar-bg">
                        <div class="metric-bar-fill" style="width: ${average}%"></div>
                        <div class="metric-bar-max" style="left: ${max}%"></div>
                    </div>
                    <div class="metric-bar-values">
                        <span>${average}%</span>
                        <span class="max-value">Max: ${max}%</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderOceanStates(states, lang) {
        const labels = {
            title: { es: '🌊 Estados del Océano', en: '🌊 Ocean States', ro: '🌊 Stări ale Oceanului' },
            currentState: { es: 'Estado Actual:', en: 'Current State:', ro: 'Stare Actuală:' },
            progress: { es: 'Progreso:', en: 'Progress:', ro: 'Progres:' }
        };
        
        // Get state name by language
        const getStateName = (state) => {
            if (lang === 'ro') return state.nameRo || state.nameEn || state.name;
            if (lang === 'en') return state.nameEn || state.name;
            return state.name;
        };
        
        return `
            <div class="report-section">
                <h3>${labels.title[lang] || labels.title.en}</h3>
                <div class="ocean-summary">
                    <div class="ocean-current">
                        <span class="ocean-label">${labels.currentState[lang] || labels.currentState.en}</span>
                        <span class="ocean-value">${getStateName(states.currentState)}</span>
                    </div>
                    <div class="ocean-progress">
                        <span class="ocean-label">${labels.progress[lang] || labels.progress.en}</span>
                        <span class="ocean-value">${states.progressionPercentage}%</span>
                    </div>
                </div>
                <div class="states-timeline">
                    ${states.statesReached.map((state, index) => `
                        <div class="state-item">
                            <div class="state-number">${index + 1}</div>
                            <div class="state-name">${getStateName(state)}</div>
                        </div>
                    `).join('<div class="state-arrow">→</div>')}
                </div>
            </div>
        `;
    },

    renderAchievements(achievements, lang) {
        const labels = {
            title: { es: '🏆 Logros Desbloqueados', en: '🏆 Unlocked Achievements', ro: '🏆 Realizări Deblocate' },
            unlocked: { es: 'Desbloqueados', en: 'Unlocked', ro: 'Deblocate' },
            completed: { es: 'Completado', en: 'Completed', ro: 'Completat' },
            recent: { es: 'Recientes', en: 'Recent', ro: 'Recente' }
        };
        
        // Get achievement name by language
        const getAchievementName = (a) => {
            if (lang === 'ro') return a.nameRo || a.nameEn || a.name;
            if (lang === 'en') return a.nameEn || a.name;
            return a.name;
        };
        
        return `
            <div class="report-section">
                <h3>${labels.title[lang] || labels.title.en}</h3>
                <div class="achievements-summary">
                    <div class="achievement-stat">
                        <span class="stat-value">${achievements.unlocked} / ${achievements.total}</span>
                        <span class="stat-label">${labels.unlocked[lang] || labels.unlocked.en}</span>
                    </div>
                    <div class="achievement-stat">
                        <span class="stat-value">${achievements.percentage}%</span>
                        <span class="stat-label">${labels.completed[lang] || labels.completed.en}</span>
                    </div>
                </div>
                ${achievements.recentlyUnlocked.length > 0 ? `
                    <div class="recent-achievements">
                        <h4>${labels.recent[lang] || labels.recent.en}</h4>
                        <div class="achievement-list">
                            ${achievements.recentlyUnlocked.map(a => `
                                <div class="achievement-item ${a.rarity}">
                                    <span class="achievement-icon">${a.icon}</span>
                                    <span class="achievement-name">${getAchievementName(a)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    renderInsights(insights, lang) {
        if (insights.length === 0) return '';
        const labels = {
            title: { es: '💡 Insights', en: '💡 Insights', ro: '💡 Perspective' }
        };
        return `
            <div class="report-section">
                <h3>${labels.title[lang] || labels.title.en}</h3>
                <div class="insights-list">
                    ${insights.map(insight => `
                        <div class="insight-item ${insight.type}">
                            <div class="insight-icon">${this.getInsightIcon(insight.type)}</div>
                            <div class="insight-text">${insight.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderRecommendations(recommendations, lang) {
        if (recommendations.length === 0) return '';
        const labels = {
            title: { es: '🎯 Recomendaciones', en: '🎯 Recommendations', ro: '🎯 Recomandări' }
        };
        return `
            <div class="report-section">
                <h3>${labels.title[lang] || labels.title.en}</h3>
                <div class="recommendations-list">
                    ${recommendations.map((rec, index) => `
                        <div class="recommendation-item priority-${rec.priority}">
                            <div class="recommendation-number">${index + 1}</div>
                            <div class="recommendation-text">${rec.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderFooter(report, lang) {
        const labels = {
            downloadJSON: { es: 'Descargar JSON', en: 'Download JSON', ro: 'Descarcă JSON' },
            downloadTXT: { es: 'Descargar TXT', en: 'Download TXT', ro: 'Descarcă TXT' },
            close: { es: 'Cerrar', en: 'Close', ro: 'Închide' }
        };
        return `
            <div class="report-footer">
                <button class="report-btn secondary" onclick="ReportUI.downloadJSON()">
                    📄 ${labels.downloadJSON[lang] || labels.downloadJSON.en}
                </button>
                <button class="report-btn secondary" onclick="ReportUI.downloadText()">
                    📝 ${labels.downloadTXT[lang] || labels.downloadTXT.en}
                </button>
                <button class="report-btn primary" onclick="this.closest('.report-modal').remove()">
                    ${labels.close[lang] || labels.close.en}
                </button>
            </div>
        `;
    },

    downloadJSON() {
        if (this.currentReport) {
            ReportGenerator.downloadJSON(this.currentReport);
        }
    },

    downloadText() {
        if (this.currentReport) {
            ReportGenerator.downloadText(this.currentReport);
        }
    },

    getStateName(stateId, lang) {
        const names = {
            confused: { es: 'Confusión', en: 'Confusion', ro: 'Confuzie' },
            anxious: { es: 'Ansiedad', en: 'Anxiety', ro: 'Anxietate' },
            processing: { es: 'Procesando', en: 'Processing', ro: 'Procesare' },
            clarity: { es: 'Claridad', en: 'Clarity', ro: 'Claritate' },
            resolved: { es: 'Resolución', en: 'Resolution', ro: 'Rezolvare' },
            neutral: { es: 'Neutral', en: 'Neutral', ro: 'Neutru' }
        };
        return names[stateId]?.[lang] || names[stateId]?.en || stateId;
    },

    getInsightIcon(type) {
        const icons = {
            positive: '✨',
            achievement: '🏆',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || '💡';
    }
};

// Expose for use
window.ReportUI = ReportUI;