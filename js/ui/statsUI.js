/**
 * Statistics UI Module
 * Displays conversation statistics and analytics
 * Shows metrics like message count, themes, emotions, etc.
 * 
 * @module statsUI
 */

const StatsUI = (() => {
    'use strict';

    /**
     * Get conversation history
     * @returns {Array} Conversation history
     */
    function getHistory() {
        try {
            // Use StorageOptimizer if available for decompression
            if (typeof StorageOptimizer !== 'undefined') {
                const history = StorageOptimizer.getItem('whispers-history');
                return history ? (Array.isArray(history) ? history : []) : [];
            } else {
                const history = localStorage.getItem('whispers-history');
                return history ? JSON.parse(history) : [];
            }
        } catch (e) {
            return [];
        }
    }

    /**
     * Calculate statistics
     * @returns {Object} Statistics object
     */
    function calculateStats() {
        const history = getHistory();
        const stats = {
            totalMessages: history.length,
            totalCharacters: 0,
            averageMessageLength: 0,
            dateRange: null,
            themes: {},
            emotions: {},
            topKeywords: []
        };

        if (history.length === 0) {
            return stats;
        }

        // Calculate character count and date range
        const timestamps = [];
        history.forEach(item => {
            const userLen = (item.userMessage || '').length;
            const aiLen = (item.aiResponse || '').length;
            stats.totalCharacters += userLen + aiLen;

            if (item.timestamp) {
                timestamps.push(item.timestamp);
            }

            // Count themes
            if (item.theme) {
                stats.themes[item.theme] = (stats.themes[item.theme] || 0) + 1;
            }
        });

        stats.averageMessageLength = Math.round(stats.totalCharacters / (history.length * 2));

        if (timestamps.length > 0) {
            timestamps.sort();
            stats.dateRange = {
                start: timestamps[0],
                end: timestamps[timestamps.length - 1]
            };
        }

        return stats;
    }

    /**
     * Create stats modal
     * @returns {Element} Modal element
     */
    function createStatsModal() {
        const stats = calculateStats();
        const modal = document.createElement('div');
        modal.className = 'stats-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';

        const content = document.createElement('div');
        content.style.cssText = 'background: white; border-radius: 8px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';

        // Title
        const title = document.createElement('h2');
        title.textContent = '📊 Conversation Statistics';
        title.style.cssText = 'margin: 0 0 20px 0; color: #333;';
        content.appendChild(title);

        // Stats grid
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;';

        // Total messages
        const msgCard = createStatCard('Total Messages', stats.totalMessages, '💬');
        grid.appendChild(msgCard);

        // Total characters
        const charCard = createStatCard('Total Characters', stats.totalCharacters.toLocaleString(), '📝');
        grid.appendChild(charCard);

        // Average length
        const avgCard = createStatCard('Avg. Message Length', stats.averageMessageLength, '📏');
        grid.appendChild(avgCard);

        // Date range
        const dateCard = document.createElement('div');
        dateCard.style.cssText = 'background: #f5f5f5; padding: 15px; border-radius: 4px;';
        const dateTitle = document.createElement('div');
        dateTitle.textContent = '📅 Date Range';
        dateTitle.style.cssText = 'font-weight: bold; margin-bottom: 5px; color: #666;';
        dateCard.appendChild(dateTitle);
        const dateValue = document.createElement('div');
        if (stats.dateRange) {
            dateValue.textContent = stats.dateRange.start + ' to ' + stats.dateRange.end;
        } else {
            dateValue.textContent = 'No data';
        }
        dateValue.style.cssText = 'font-size: 14px; color: #333;';
        dateCard.appendChild(dateValue);
        grid.appendChild(dateCard);

        content.appendChild(grid);

        // Themes section
        if (Object.keys(stats.themes).length > 0) {
            const themesSection = document.createElement('div');
            themesSection.style.cssText = 'margin-bottom: 20px;';

            const themesTitle = document.createElement('h3');
            themesTitle.textContent = '🌊 Themes';
            themesTitle.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 16px;';
            themesSection.appendChild(themesTitle);

            const themesList = document.createElement('div');
            themesList.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px;';

            for (const theme in stats.themes) {
                const themeBadge = document.createElement('span');
                themeBadge.style.cssText = 'background: #e0e0e0; padding: 5px 10px; border-radius: 20px; font-size: 12px;';
                themeBadge.textContent = theme + ' (' + stats.themes[theme] + ')';
                themesList.appendChild(themeBadge);
            }

            themesSection.appendChild(themesList);
            content.appendChild(themesSection);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = 'background: #0066cc; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 20px;';
        closeBtn.onclick = () => {
            modal.remove();
        };
        content.appendChild(closeBtn);

        modal.appendChild(content);

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };

        return modal;
    }

    /**
     * Create stat card
     * @param {string} label - Card label
     * @param {*} value - Card value
     * @param {string} icon - Card icon
     * @returns {Element} Card element
     */
    function createStatCard(label, value, icon) {
        const card = document.createElement('div');
        card.style.cssText = 'background: #f5f5f5; padding: 15px; border-radius: 4px;';

        const iconEl = document.createElement('span');
        iconEl.textContent = icon;
        iconEl.style.cssText = 'font-size: 20px; margin-right: 10px;';
        card.appendChild(iconEl);

        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = 'font-weight: bold; color: #666; font-size: 12px; margin-bottom: 5px;';
        card.appendChild(labelEl);

        const valueEl = document.createElement('div');
        valueEl.textContent = String(value);
        valueEl.style.cssText = 'font-size: 24px; font-weight: bold; color: #333;';
        card.appendChild(valueEl);

        return card;
    }

    /**
     * Show statistics modal
     */
    function show() {
        const modal = createStatsModal();
        document.body.appendChild(modal);
    }

    /**
     * Get statistics object
     * @returns {Object} Statistics
     */
    function getStats() {
        return calculateStats();
    }

    /**
     * Export statistics as JSON
     * @returns {string} JSON string
     */
    function exportStats() {
        const stats = calculateStats();
        return JSON.stringify(stats, null, 2);
    }

    /**
     * Export statistics as CSV
     * @returns {string} CSV string
     */
    function exportStatsCSV() {
        const stats = calculateStats();
        let csv = 'Metric,Value\n';
        csv += 'Total Messages,' + stats.totalMessages + '\n';
        csv += 'Total Characters,' + stats.totalCharacters + '\n';
        csv += 'Average Message Length,' + stats.averageMessageLength + '\n';
        if (stats.dateRange) {
            csv += 'Date Range Start,' + stats.dateRange.start + '\n';
            csv += 'Date Range End,' + stats.dateRange.end + '\n';
        }
        return csv;
    }

    // Public API
    return {
        show: show,
        getStats: getStats,
        calculateStats: calculateStats,
        exportStats: exportStats,
        exportStatsCSV: exportStatsCSV
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.StatsUI = StatsUI;
}
