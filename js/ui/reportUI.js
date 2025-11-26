const ReportUI = {
    currentReport: null,

    async show() {
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
        // Setup controls
        this.setupReportControls();
    },

    setupReportControls() {
        // Theme toggle
        const themeToggle = document.getElementById('reportThemeToggle');
        if (themeToggle) {
            const icon = document.getElementById('reportThemeIcon');

            // Use ThemeToggle module if available
            if (typeof ThemeToggle !== 'undefined') {
                const currentTheme = ThemeToggle.getCurrentTheme();
                if (icon) icon.textContent = currentTheme === 'light' ? '🌙' : '☀️';

                themeToggle.addEventListener('click', () => {
                    ThemeToggle.toggle();
                    // Update local icon immediately for responsiveness
                    const newTheme = ThemeToggle.getCurrentTheme();
                    if (icon) icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
                });
            } else {
                // Fallback logic
                const currentTheme = document.body.getAttribute('data-theme') || 'dark';
                if (icon) icon.textContent = currentTheme === 'light' ? '🌙' : '☀️';

                themeToggle.addEventListener('click', () => {
                    if (typeof toggleTheme === 'function') {
                        toggleTheme();
                    } else {
                        const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                        document.body.setAttribute('data-theme', newTheme);
                        localStorage.setItem('whispers-theme', newTheme);
                        if (icon) icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
                    }
                });
            }
        }

        // Language selector
        const langSelector = document.getElementById('reportLanguageSelector');
        if (langSelector) {
            // Use LanguageSelector module if available
            if (typeof LanguageSelector !== 'undefined') {
                langSelector.value = LanguageSelector.getCurrentLanguage();

                langSelector.addEventListener('change', (e) => {
                    LanguageSelector.changeLanguage(e.target.value);
                    // Close and reopen report with new language
                    document.querySelector('.report-modal')?.remove();
                    this.show();
                });
            } else {
                // Fallback logic
                const currentLang = localStorage.getItem('whispers-language') || 'es';
                langSelector.value = currentLang;

                langSelector.addEventListener('change', (e) => {
                    const newLang = e.target.value;
                    localStorage.setItem('whispers-language', newLang);
                    // Close and reopen report with new language
                    document.querySelector('.report-modal')?.remove();
                    this.show();
                });
            }
        }
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
        const waveName = lang === 'es' ? report.metadata.selectedWave.name : report.metadata.selectedWave.nameEn;
        return `
            <div class="report-header">
                <!-- Controls - Top Right -->
                <div class="report-controls">
                    <button class="report-control-btn report-theme-toggle" id="reportThemeToggle" aria-label="Toggle theme" title="Cambiar tema">
                        <span id="reportThemeIcon">☀️</span>
                    </button>
                    <select class="report-control-btn report-language-selector" id="reportLanguageSelector" aria-label="Seleccionar idioma" title="Cambiar idioma">
                        <option value="es">ES</option>
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="de">DE</option>
                    </select>
                </div>
                <div class="report-title">
                    <h2>🌊 ${title}</h2>
                    <p class="report-subtitle">${waveName}</p>
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
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '📊 Resumen' : '📊 Summary'}</h3>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-value">${summary.totalMessages}</div>
                        <div class="summary-label">${lang === 'es' ? 'Mensajes' : 'Messages'}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${summary.durationFormatted}</div>
                        <div class="summary-label">${lang === 'es' ? 'Duración' : 'Duration'}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${summary.achievementsUnlocked} / ${summary.achievementsTotal}</div>
                        <div class="summary-label">${lang === 'es' ? 'Logros' : 'Achievements'}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${summary.completionPercentage}%</div>
                        <div class="summary-label">${lang === 'es' ? 'Completado' : 'Completed'}</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderEmotionalJourney(journey, lang) {
        if (journey.timeline.length === 0) {
            return '';
        }
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '💫 Viaje Emocional' : '💫 Emotional Journey'}</h3>
                <div class="journey-summary">
                    <div class="journey-state">
                        <span class="state-label">${lang === 'es' ? 'Inicio:' : 'Start:'}</span>
                        <span class="state-value">${this.getStateName(journey.startState, lang)}</span>
                    </div>
                    <div class="journey-arrow">→</div>
                    <div class="journey-state">
                        <span class="state-label">${lang === 'es' ? 'Actual:' : 'Current:'}</span>
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
        return `
            <div class="peaks-valleys">
                ${peaks.length > 0 ? `
                    <div class="peaks">
                        <h4>📈 ${lang === 'es' ? 'Momentos Altos' : 'High Points'}</h4>
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
                        <h4>📉 ${lang === 'es' ? 'Momentos Bajos' : 'Low Points'}</h4>
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
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '💎 Métricas de Expresión' : '💎 Expression Metrics'}</h3>
                <div class="metrics-summary">
                    <div class="metric-level">
                        <span class="level-label">${lang === 'es' ? 'Nivel:' : 'Level:'}</span>
                        <span class="level-value">${lang === 'es' ? metrics.currentLevel.name : metrics.currentLevel.nameEn}</span>
                    </div>
                    <div class="metric-improvement ${metrics.improvement >= 0 ? 'positive' : 'negative'}">
                        ${metrics.improvement >= 0 ? '+' : ''}${metrics.improvement}${lang === 'es' ? 'puntos' : 'points'}
                    </div>
                </div>
                <div class="metrics-bars">
                    ${this.renderMetricBar(lang === 'es' ? 'Claridad' : 'Clarity', metrics.averageScores.clarity, metrics.maxScores.clarity)}
                    ${this.renderMetricBar(lang === 'es' ? 'Especificidad' : 'Specificity', metrics.averageScores.specificity, metrics.maxScores.specificity)}
                    ${this.renderMetricBar(lang === 'es' ? 'Conciencia Emocional' : 'Emotional Awareness', metrics.averageScores.emotionalAwareness, metrics.maxScores.emotionalAwareness)}
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
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '🌊 Estados del Océano' : '🌊 Ocean States'}</h3>
                <div class="ocean-summary">
                    <div class="ocean-current">
                        <span class="ocean-label">${lang === 'es' ? 'Estado Actual:' : 'Current State:'}</span>
                        <span class="ocean-value">${lang === 'es' ? states.currentState.name : states.currentState.nameEn}</span>
                    </div>
                    <div class="ocean-progress">
                        <span class="ocean-label">${lang === 'es' ? 'Progreso:' : 'Progress:'}</span>
                        <span class="ocean-value">${states.progressionPercentage}%</span>
                    </div>
                </div>
                <div class="states-timeline">
                    ${states.statesReached.map((state, index) => `
                        <div class="state-item">
                            <div class="state-number">${index + 1}</div>
                            <div class="state-name">${lang === 'es' ? state.name : state.nameEn}</div>
                        </div>
                    `).join('<div class="state-arrow">→</div>')}
                </div>
            </div>
        `;
    },

    renderAchievements(achievements, lang) {
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '🏆 Logros Desbloqueados' : '🏆 Unlocked Achievements'}</h3>
                <div class="achievements-summary">
                    <div class="achievement-stat">
                        <span class="stat-value">${achievements.unlocked} / ${achievements.total}</span>
                        <span class="stat-label">${lang === 'es' ? 'Desbloqueados' : 'Unlocked'}</span>
                    </div>
                    <div class="achievement-stat">
                        <span class="stat-value">${achievements.percentage}%</span>
                        <span class="stat-label">${lang === 'es' ? 'Completado' : 'Completed'}</span>
                    </div>
                </div>
                ${achievements.recentlyUnlocked.length > 0 ? `
                    <div class="recent-achievements">
                        <h4>${lang === 'es' ? 'Recientes' : 'Recent'}</h4>
                        <div class="achievement-list">
                            ${achievements.recentlyUnlocked.map(a => `
                                <div class="achievement-item ${a.rarity}">
                                    <span class="achievement-icon">${a.icon}</span>
                                    <span class="achievement-name">${lang === 'es' ? a.name : a.nameEn}</span>
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
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '💡 Insights' : '💡 Insights'}</h3>
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
        return `
            <div class="report-section">
                <h3>${lang === 'es' ? '🎯 Recomendaciones' : '🎯 Recommendations'}</h3>
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
        return `
            <div class="report-footer">
                <button class="report-btn secondary" onclick="ReportUI.downloadJSON()">
                    📄 ${lang === 'es' ? 'Descargar JSON' : 'Download JSON'}
                </button>
                <button class="report-btn secondary" onclick="ReportUI.downloadText()">
                    📝 ${lang === 'es' ? 'Descargar TXT' : 'Download TXT'}
                </button>
                <button class="report-btn primary" onclick="this.closest('.report-modal').remove()">
                    ${lang === 'es' ? 'Cerrar' : 'Close'}
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
            confused: { es: 'Confusión', en: 'Confusion' },
            anxious: { es: 'Ansiedad', en: 'Anxiety' },
            processing: { es: 'Procesando', en: 'Processing' },
            clarity: { es: 'Claridad', en: 'Clarity' },
            resolved: { es: 'Resolución', en: 'Resolution' }
        };
        return names[stateId]?.[lang] || stateId;
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