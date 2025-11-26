/**
 * Centralized Logging System
 * Provides structured logging with levels, filtering, and persistence
 * 
 * @module core/logger
 */

const Logger = (function() {
    'use strict';

    // Log levels
    const LogLevel = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        NONE: 4
    };

    // Configuration
    const config = {
        currentLevel: LogLevel.INFO,
        enableConsole: true,
        enablePersistence: false,
        maxStoredLogs: 100,
        storageKey: 'whispers_logs'
    };

    // Log storage
    const logs = [];

    /**
     * Format log message with timestamp and context
     * @private
     */
    function formatMessage(level, category, message, data) {
        const timestamp = new Date().toISOString();
        const levelName = Object.keys(LogLevel).find(key => LogLevel[key] === level);
        
        return {
            timestamp,
            level: levelName,
            category,
            message,
            data: data || null
        };
    }

    /**
     * Write log to console
     * @private
     */
    function writeToConsole(logEntry) {
        if (!config.enableConsole) return;

        const emoji = {
            DEBUG: '🔍',
            INFO: '✅',
            WARN: '⚠️',
            ERROR: '❌'
        }[logEntry.level] || '📝';

        const style = {
            DEBUG: 'color: #888',
            INFO: 'color: #0066cc',
            WARN: 'color: #ff9900',
            ERROR: 'color: #cc0000; font-weight: bold'
        }[logEntry.level] || '';

        const prefix = `${emoji} [${logEntry.category}]`;
        
        if (logEntry.data) {
            console.log(`%c${prefix} ${logEntry.message}`, style, logEntry.data);
        } else {
            console.log(`%c${prefix} ${logEntry.message}`, style);
        }
    }

    /**
     * Store log in memory
     * @private
     */
    function storeLog(logEntry) {
        logs.push(logEntry);
        
        // Keep only last N logs
        if (logs.length > config.maxStoredLogs) {
            logs.shift();
        }

        // Persist to localStorage if enabled
        if (config.enablePersistence) {
            try {
                const stored = logs.slice(-50); // Store last 50
                localStorage.setItem(config.storageKey, JSON.stringify(stored));
            } catch (error) {
                // Silently fail if localStorage is full
            }
        }
    }

    /**
     * Core logging function
     * @private
     */
    function log(level, category, message, data) {
        if (level < config.currentLevel) return;

        const logEntry = formatMessage(level, category, message, data);
        
        writeToConsole(logEntry);
        storeLog(logEntry);
    }

    // Public API
    return {
        // Log methods
        debug: (category, message, data) => log(LogLevel.DEBUG, category, message, data),
        info: (category, message, data) => log(LogLevel.INFO, category, message, data),
        warn: (category, message, data) => log(LogLevel.WARN, category, message, data),
        error: (category, message, data) => log(LogLevel.ERROR, category, message, data),

        // Configuration
        setLevel: (level) => {
            if (typeof level === 'string') {
                config.currentLevel = LogLevel[level.toUpperCase()] ?? LogLevel.INFO;
            } else {
                config.currentLevel = level;
            }
        },

        enableConsole: (enable) => { config.enableConsole = enable; },
        enablePersistence: (enable) => { config.enablePersistence = enable; },

        // Utilities
        getLogs: () => [...logs],
        clearLogs: () => {
            logs.length = 0;
            localStorage.removeItem(config.storageKey);
        },

        // Export logs
        export: () => {
            return JSON.stringify(logs, null, 2);
        },

        // Constants
        LogLevel
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.Logger = Logger;
}

console.log('📝 Logger module loaded');
