/**
 * Performance Monitor
 * Tracks performance metrics and identifies bottlenecks
 * 
 * @module core/performance
 */

const PerformanceMonitor = (function() {
    'use strict';

    // Metrics storage
    const metrics = {
        apiCalls: [],
        renders: [],
        interactions: []
    };

    // Configuration
    const config = {
        enabled: true,
        maxMetrics: 100,
        reportThreshold: 1000 // Report operations > 1s
    };

    /**
     * Start timing an operation
     * @param {string} name - Operation name
     * @returns {Function} End function
     */
    function startTiming(name) {
        if (!config.enabled) return () => {};

        const startTime = performance.now();
        const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

        return (metadata = {}) => {
            const duration = performance.now() - startTime;
            const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const memoryDelta = endMemory - startMemory;

            const metric = {
                name,
                duration: Math.round(duration),
                memory: memoryDelta,
                timestamp: Date.now(),
                ...metadata
            };

            // Store metric
            storeMetric(name, metric);

            // Report slow operations
            if (duration > config.reportThreshold && typeof Logger !== 'undefined') {
                Logger.warn('Performance', `Slow operation: ${name}`, {
                    duration: `${metric.duration}ms`,
                    memory: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`
                });
            }

            return metric;
        };
    }

    /**
     * Store metric in appropriate category
     * @private
     */
    function storeMetric(name, metric) {
        let category = 'interactions';
        
        if (name.includes('api') || name.includes('fetch')) {
            category = 'apiCalls';
        } else if (name.includes('render') || name.includes('display')) {
            category = 'renders';
        }

        metrics[category].push(metric);

        // Keep only last N metrics
        if (metrics[category].length > config.maxMetrics) {
            metrics[category].shift();
        }
    }

    /**
     * Calculate statistics for a metric category
     * @private
     */
    function calculateStats(category) {
        const data = metrics[category];
        if (data.length === 0) return null;

        const durations = data.map(m => m.duration);
        const sum = durations.reduce((a, b) => a + b, 0);
        const avg = sum / durations.length;
        const sorted = [...durations].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];

        return {
            count: data.length,
            avg: Math.round(avg),
            median: Math.round(median),
            p95: Math.round(p95),
            min: Math.min(...durations),
            max: Math.max(...durations)
        };
    }

    // Public API
    return {
        /**
         * Time an operation
         * @param {string} name - Operation name
         * @returns {Function} End timing function
         */
        time: startTiming,

        /**
         * Time an async operation
         * @param {string} name - Operation name
         * @param {Function} fn - Async function to time
         * @returns {Promise} Result of the function
         */
        async timeAsync(name, fn) {
            const end = startTiming(name);
            try {
                const result = await fn();
                end({ success: true });
                return result;
            } catch (error) {
                end({ success: false, error: error.message });
                throw error;
            }
        },

        /**
         * Get performance report
         * @returns {object} Performance statistics
         */
        getReport() {
            return {
                apiCalls: calculateStats('apiCalls'),
                renders: calculateStats('renders'),
                interactions: calculateStats('interactions'),
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                } : null
            };
        },

        /**
         * Print performance report to console
         */
        printReport() {
            const report = this.getReport();
            
            console.group('📊 Performance Report');
            
            if (report.apiCalls) {
                console.log('API Calls:', report.apiCalls);
            }
            if (report.renders) {
                console.log('Renders:', report.renders);
            }
            if (report.interactions) {
                console.log('Interactions:', report.interactions);
            }
            if (report.memory) {
                console.log('Memory:', `${report.memory.used}MB / ${report.memory.limit}MB`);
            }
            
            console.groupEnd();
        },

        /**
         * Clear all metrics
         */
        clear() {
            metrics.apiCalls = [];
            metrics.renders = [];
            metrics.interactions = [];
        },

        /**
         * Enable/disable monitoring
         */
        enable: () => { config.enabled = true; },
        disable: () => { config.enabled = false; }
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.PerformanceMonitor = PerformanceMonitor;
}

console.log('📊 Performance monitor loaded');
