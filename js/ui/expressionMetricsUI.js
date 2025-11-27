/**
 * Expression Metrics UI
 * Visual display of expression analysis and progress
 */

const ExpressionMetricsUI = {
    container: null,
    showMetrics: true,
    updateInterval: null,

    /**
     * Get current language code
     * @returns {string} Language code (es, en, ro)
     */
    getLang() {
        return localStorage.getItem('whispers-language') || 'es';
    },

    /**
     * Initialize metrics UI
     */
    init() {
        this.showMetrics = localStorage.getItem('whispers-show-expression-metrics') !== 'false';
        
        if (this.showMetrics) {
            this.createContainer();
        }

        console.log('📊 Expression Metrics UI initialized');
    },

    /**
     * Create metrics container
     */
    createContainer() {
        if (this.container) return;

        const lang = this.getLang();
        const container = document.createElement('div');
        container.id = 'expressionMetrics';
        container.className = 'expression-metrics hidden';
        container.innerHTML = `
            <div class="metrics-toggle" onclick="ExpressionMetricsUI.toggleMinimize()" title="${lang === 'es' ? 'Minimizar/Expandir' : 'Minimize/Expand'}">
                <span class="toggle-arrow">▶</span>
            </div>
            <div class="metrics-header">
                <span class="metrics-title">${lang === 'es' ? 'Tu Expresión' : 'Your Expression'}</span>
            </div>
            <div class="metrics-content">
                <div class="metric-item">
                    <div class="metric-label">${lang === 'es' ? 'Claridad' : 'Clarity'}</div>
                    <div class="metric-bar">
                        <div class="metric-fill clarity-fill" style="width: 0%"></div>
                    </div>
                    <div class="metric-value clarity-value">0%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">${lang === 'es' ? 'Especificidad' : 'Specificity'}</div>
                    <div class="metric-bar">
                        <div class="metric-fill specificity-fill" style="width: 0%"></div>
                    </div>
                    <div class="metric-value specificity-value">0%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">${lang === 'es' ? 'Conciencia Emocional' : 'Emotional Awareness'}</div>
                    <div class="metric-bar">
                        <div class="metric-fill emotional-fill" style="width: 0%"></div>
                    </div>
                    <div class="metric-value emotional-value">0%</div>
                </div>
                <div class="metric-overall">
                    <div class="overall-label">${lang === 'es' ? 'Puntuación General' : 'Overall Score'}</div>
                    <div class="overall-score">0</div>
                    <div class="overall-level">${lang === 'es' ? 'Explorador' : 'Explorer'}</div>
                </div>
                <div class="metric-trend">
                    <div class="trend-icon">📈</div>
                    <div class="trend-text">${lang === 'es' ? 'Comenzando tu viaje...' : 'Starting your journey...'}</div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.container = container;
    },

    /**
     * Update metrics display
     * @param {object} metrics - Metrics from ExpressionAnalyzer
     */
    update(metrics) {
        if (!this.container) {
            this.createContainer();
        }

        // Update individual metrics
        this.updateMetric('clarity', metrics.clarity);
        this.updateMetric('specificity', metrics.specificity);
        this.updateMetric('emotional', metrics.emotionalAwareness);

        // Update overall score
        const overallScore = this.container.querySelector('.overall-score');
        if (overallScore) {
            overallScore.textContent = metrics.overall;
            overallScore.style.color = this.getScoreColor(metrics.overall);
        }

        // Update level
        const level = ExpressionAnalyzer.getCurrentLevel();
        const levelEl = this.container.querySelector('.overall-level');
        if (levelEl) {
            levelEl.textContent = this.getLang() === 'es' ? level.name : level.nameEn;
        }

        // Update trend
        this.updateTrend();

        // Show container if hidden
        this.show();

        // Auto-hide after 5 seconds
        this.scheduleAutoHide();
    },

    /**
     * Update individual metric
     * @param {string} name - Metric name
     * @param {number} value - Metric value (0-100)
     */
    updateMetric(name, value) {
        const fill = this.container.querySelector(`.${name}-fill`);
        const valueEl = this.container.querySelector(`.${name}-value`);

        if (fill) {
            fill.style.width = `${value}%`;
            fill.style.background = this.getGradient(value);
        }

        if (valueEl) {
            valueEl.textContent = `${Math.round(value)}%`;
        }
    },

    /**
     * Update trend display
     */
    updateTrend() {
        const trend = ExpressionAnalyzer.getImprovementTrend();
        const trendIcon = this.container.querySelector('.trend-icon');
        const trendText = this.container.querySelector('.trend-text');

        if (!trendIcon || !trendText) return;

        const icons = {
            improving_significantly: '🚀',
            improving: '📈',
            stable: '➡️',
            declining: '📉',
            declining_significantly: '⚠️',
            insufficient_data: '🌱'
        };

        trendIcon.textContent = icons[trend.trend] || '📊';
        trendText.textContent = trend.message;
    },

    /**
     * Get color for score
     * @param {number} score - Score (0-100)
     * @returns {string} Color
     */
    getScoreColor(score) {
        if (score >= 80) return '#a8e6cf';
        if (score >= 60) return '#7dd3c0';
        if (score >= 40) return '#4fc3f7';
        if (score >= 20) return '#ffa502';
        return '#ff6b6b';
    },

    /**
     * Get gradient for metric bar
     * @param {number} value - Value (0-100)
     * @returns {string} Gradient CSS
     */
    getGradient(value) {
        if (value >= 80) {
            return 'linear-gradient(90deg, #7dd3c0, #a8e6cf)';
        } else if (value >= 60) {
            return 'linear-gradient(90deg, #4fc3f7, #7dd3c0)';
        } else if (value >= 40) {
            return 'linear-gradient(90deg, #29b6f6, #4fc3f7)';
        } else if (value >= 20) {
            return 'linear-gradient(90deg, #ffa502, #ff7f50)';
        } else {
            return 'linear-gradient(90deg, #ff6b6b, #ee5a6f)';
        }
    },

    /**
     * Schedule auto-minimize (not hide)
     */
    scheduleAutoHide() {
        if (this.updateInterval) {
            clearTimeout(this.updateInterval);
        }

        this.updateInterval = setTimeout(() => {
            this.minimize();
        }, 5000);
    },

    /**
     * Minimize to arrow only
     */
    minimize() {
        if (this.container) {
            this.container.classList.add('minimized');
        }
    },

    /**
     * Expand from minimized state
     */
    expand() {
        if (this.container) {
            this.container.classList.remove('minimized');
            // Reset auto-minimize timer
            this.scheduleAutoHide();
        }
    },

    /**
     * Toggle between minimized and expanded
     */
    toggleMinimize() {
        if (!this.container) return;
        
        if (this.container.classList.contains('minimized')) {
            this.expand();
        } else {
            this.minimize();
            // Clear auto-hide timer when manually minimized
            if (this.updateInterval) {
                clearTimeout(this.updateInterval);
            }
        }
    },

    /**
     * Show metrics
     */
    show() {
        if (!this.container) {
            this.createContainer();
        }
        this.container.classList.remove('hidden');
        this.container.classList.remove('minimized');
        this.showMetrics = true;
        localStorage.setItem('whispers-show-expression-metrics', 'true');
    },

    /**
     * Hide metrics completely
     */
    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
        this.showMetrics = false;
        localStorage.setItem('whispers-show-expression-metrics', 'false');
    },

    /**
     * Toggle metrics visibility
     */
    toggle() {
        if (this.showMetrics) {
            this.hide();
        } else {
            this.show();
        }
    },

    /**
     * Show detailed report modal
     */
    showReport() {
        const report = ExpressionAnalyzer.getProgressReport();
        if (!report) {
            console.log('No hay suficientes datos para generar un reporte');
            return;
        }

        const lang = this.getLang();
        
        const modal = document.createElement('div');
        modal.className = 'expression-report-modal';
        modal.innerHTML = `
            <div class="report-overlay" onclick="this.parentElement.remove()"></div>
            <div class="report-content">
                <div class="report-header">
                    <h2>${lang === 'es' ? 'Reporte de Progreso' : 'Progress Report'}</h2>
                    <button class="report-close" onclick="this.closest('.expression-report-modal').remove()">×</button>
                </div>
                <div class="report-body">
                    <div class="report-section">
                        <h3>${lang === 'es' ? 'Resumen General' : 'Overall Summary'}</h3>
                        <div class="report-stats">
                            <div class="stat-item">
                                <div class="stat-label">${lang === 'es' ? 'Mensajes Totales' : 'Total Messages'}</div>
                                <div class="stat-value">${report.totalMessages}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">${lang === 'es' ? 'Puntuación Promedio' : 'Average Score'}</div>
                                <div class="stat-value">${report.averageScore}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">${lang === 'es' ? 'Mejora' : 'Improvement'}</div>
                                <div class="stat-value ${report.overall.improvement > 0 ? 'positive' : 'negative'}">
                                    ${report.overall.improvement > 0 ? '+' : ''}${report.overall.improvement}
                                </div>
                            </div>
                        </div>
                        <div class="report-message">${report.overall.message}</div>
                    </div>
                    
                    <div class="report-section">
                        <h3>${lang === 'es' ? 'Métricas Detalladas' : 'Detailed Metrics'}</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-card-title">${lang === 'es' ? 'Claridad' : 'Clarity'}</div>
                                <div class="metric-card-value">${report.metrics.clarity.current}%</div>
                                <div class="metric-card-trend ${report.metrics.clarity.trend}">
                                    ${this.getTrendIcon(report.metrics.clarity.trend)} 
                                    ${report.metrics.clarity.improvement > 0 ? '+' : ''}${report.metrics.clarity.improvement}
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-card-title">${lang === 'es' ? 'Especificidad' : 'Specificity'}</div>
                                <div class="metric-card-value">${report.metrics.specificity.current}%</div>
                                <div class="metric-card-trend ${report.metrics.specificity.trend}">
                                    ${this.getTrendIcon(report.metrics.specificity.trend)} 
                                    ${report.metrics.specificity.improvement > 0 ? '+' : ''}${report.metrics.specificity.improvement}
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-card-title">${lang === 'es' ? 'Conciencia Emocional' : 'Emotional Awareness'}</div>
                                <div class="metric-card-value">${report.metrics.emotionalAwareness.current}%</div>
                                <div class="metric-card-trend ${report.metrics.emotionalAwareness.trend}">
                                    ${this.getTrendIcon(report.metrics.emotionalAwareness.trend)} 
                                    ${report.metrics.emotionalAwareness.improvement > 0 ? '+' : ''}${report.metrics.emotionalAwareness.improvement}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h3>${lang === 'es' ? 'Mejor Mensaje' : 'Best Message'}</h3>
                        <div class="message-highlight best">
                            <div class="message-score">${report.best.score}</div>
                            <div class="message-text">"${report.best.message}"</div>
                        </div>
                    </div>
                </div>
                <div class="report-footer">
                    <button class="report-btn" onclick="this.closest('.expression-report-modal').remove()">
                        ${lang === 'es' ? 'Cerrar' : 'Close'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * Get trend icon
     * @param {string} trend - Trend type
     * @returns {string} Icon
     */
    getTrendIcon(trend) {
        const icons = {
            improving: '📈',
            stable: '➡️',
            declining: '📉',
            insufficient_data: '📊'
        };
        return icons[trend] || '📊';
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ExpressionMetricsUI.init();
    });
} else {
    ExpressionMetricsUI.init();
}

// Expose for debugging
window.ExpressionMetricsUI = ExpressionMetricsUI;
