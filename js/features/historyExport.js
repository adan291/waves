/**
 * History Export Module
 * Exports conversation history in multiple formats
 * Supports: JSON, CSV, Markdown, Text
 * 
 * Implements Factory Pattern for format handling and proper error management.
 * 
 * @module historyExport
 */

const HistoryExport = (() => {
    'use strict';

    // ============================================
    // CONSTANTS
    // ============================================
    
    const STORAGE_KEY = 'whispers-history';
    
    /**
     * Export format configuration
     * Centralized format definitions to reduce duplication
     * @private
     */
    const EXPORT_FORMATS = Object.freeze({
        json: {
            mimeType: 'application/json',
            extension: 'json',
            converter: null // Set after function definition
        },
        csv: {
            mimeType: 'text/csv',
            extension: 'csv',
            converter: null
        },
        markdown: {
            mimeType: 'text/markdown',
            extension: 'md',
            converter: null
        },
        text: {
            mimeType: 'text/plain',
            extension: 'txt',
            converter: null
        }
    });

    // ============================================
    // PRIVATE UTILITIES
    // ============================================

    /**
     * Get formatted timestamp for filenames
     * @param {string} format - Format type: 'date', 'datetime', 'unix'
     * @returns {string} Formatted timestamp
     * @private
     */
    function getTimestamp(format = 'date') {
        const now = new Date();
        
        switch (format) {
            case 'date':
                return now.toISOString().split('T')[0];
            case 'datetime':
                return now.toISOString().replace(/[:.]/g, '-');
            case 'unix':
                return now.getTime().toString();
            default:
                return now.toISOString();
        }
    }

    /**
     * Validate history array structure
     * @param {*} history - Data to validate
     * @returns {boolean} True if valid
     * @throws {TypeError} If validation fails
     * @private
     */
    function validateHistory(history) {
        if (!Array.isArray(history)) {
            throw new TypeError('History must be an array');
        }
        
        // Validate each item has required structure
        history.forEach((item, index) => {
            if (typeof item !== 'object' || item === null) {
                throw new TypeError(`History item ${index} must be an object`);
            }
        });
        
        return true;
    }

    /**
     * Handle export errors with event emission
     * @param {Error} error - Error object
     * @param {string} operation - Operation name
     * @returns {Object} Error result object
     * @private
     */
    function handleExportError(error, operation) {
        console.error(`Export error (${operation}):`, error);
        
        // Emit event for UI notification if available
        if (typeof UIEventBus !== 'undefined' && UIEventBus.emit) {
            UIEventBus.emit('export:error', {
                operation,
                message: error.message,
                timestamp: Date.now()
            });
        }
        
        return {
            success: false,
            operation,
            error: error.message,
            timestamp: Date.now()
        };
    }

    /**
     * Get conversation history from storage
     * @returns {Array} Conversation history
     * @private
     */
    function getHistory() {
        try {
            // Use StorageOptimizer if available for decompression
            let history;
            if (typeof StorageOptimizer !== 'undefined') {
                history = StorageOptimizer.getItem(STORAGE_KEY);
                return history ? (Array.isArray(history) ? history : []) : [];
            } else {
                history = localStorage.getItem(STORAGE_KEY);
                return history ? JSON.parse(history) : [];
            }
        } catch (e) {
            console.error('Error reading history:', e);
            
            // Emit storage error event
            if (typeof UIEventBus !== 'undefined' && UIEventBus.emit) {
                UIEventBus.emit('storage:error', {
                    operation: 'read',
                    error: e.message
                });
            }
            
            return [];
        }
    }

    /**
     * Export to JSON format
     * @param {Array} history - Conversation history
     * @returns {string} JSON string
     */
    function exportToJSON(history) {
        history = history || getHistory();
        const data = {
            exported: new Date().toISOString(),
            version: '1.0',
            conversations: history
        };
        return JSON.stringify(data, null, 2);
    }

    /**
     * Export to CSV format
     * @param {Array} history - Conversation history
     * @returns {string} CSV string
     */
    function exportToCSV(history) {
        history = history || getHistory();
        
        let csv = 'Timestamp,User Message,AI Response,Theme\n';
        
        history.forEach(item => {
            const timestamp = item.timestamp || '';
            const userMsg = (item.userMessage || '').replace(/"/g, '""');
            const aiResp = (item.aiResponse || '').replace(/"/g, '""');
            const theme = item.theme || '';
            
            csv += `"${timestamp}","${userMsg}","${aiResp}","${theme}"\n`;
        });
        
        return csv;
    }

    /**
     * Export to Markdown format
     * @param {Array} history - Conversation history
     * @returns {string} Markdown string
     */
    function exportToMarkdown(history) {
        history = history || getHistory();
        
        let md = '# Conversation History\n\n';
        md += `Exported: ${new Date().toLocaleString()}\n\n`;
        md += `Total Messages: ${history.length}\n\n`;
        md += '---\n\n';
        
        history.forEach((item, index) => {
            md += `## Message ${index + 1}\n\n`;
            md += `**Date**: ${item.timestamp || 'Unknown'}\n\n`;
            md += `**You**: ${item.userMessage || ''}\n\n`;
            md += `**Response**: ${item.aiResponse || ''}\n\n`;
            if (item.theme) {
                md += `**Theme**: ${item.theme}\n\n`;
            }
            md += '---\n\n';
        });
        
        return md;
    }

    /**
     * Export to plain text format
     * @param {Array} history - Conversation history
     * @returns {string} Text string
     */
    function exportToText(history) {
        history = history || getHistory();
        
        let text = 'CONVERSATION HISTORY\n';
        text += '='.repeat(50) + '\n\n';
        text += `Exported: ${new Date().toLocaleString()}\n`;
        text += `Total Messages: ${history.length}\n\n`;
        text += '='.repeat(50) + '\n\n';
        
        history.forEach((item, index) => {
            text += `Message ${index + 1}\n`;
            text += '-'.repeat(50) + '\n';
            text += `Date: ${item.timestamp || 'Unknown'}\n\n`;
            text += `You:\n${item.userMessage || ''}\n\n`;
            text += `Response:\n${item.aiResponse || ''}\n\n`;
            if (item.theme) {
                text += `Theme: ${item.theme}\n\n`;
            }
        });
        
        return text;
    }

    /**
     * Download file with validation
     * @param {string} content - File content
     * @param {string} filename - Filename
     * @param {string} mimeType - MIME type
     * @returns {Object} Download result
     * @throws {Error} If download fails
     * @private
     */
    function downloadFile(content, filename, mimeType) {
        if (!content || typeof content !== 'string') {
            throw new Error('Content must be a non-empty string');
        }
        
        if (!filename || typeof filename !== 'string') {
            throw new Error('Filename must be a non-empty string');
        }
        
        try {
            const blob = new Blob([content], { type: mimeType });
            
            // Validate blob was created
            if (blob.size === 0) {
                throw new Error('Generated file is empty');
            }
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup with delay to ensure download completes
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            return { success: true, size: blob.size, filename };
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    }

    /**
     * Generic export function using factory pattern
     * Reduces code duplication across format-specific exports
     * @param {string} format - Export format ('json', 'csv', 'markdown', 'text')
     * @param {Array} history - Conversation history (optional, uses stored if not provided)
     * @returns {Object} Export result
     * @private
     */
    function exportAs(format, history) {
        try {
            history = history || getHistory();
            validateHistory(history);
            
            const config = EXPORT_FORMATS[format];
            if (!config) {
                throw new Error(`Unsupported format: ${format}`);
            }
            
            const timestamp = getTimestamp('date');
            const filename = `whispers-history-${timestamp}.${config.extension}`;
            const content = config.converter(history);
            
            const result = downloadFile(content, filename, config.mimeType);
            
            // Emit success event
            if (typeof UIEventBus !== 'undefined' && UIEventBus.emit) {
                UIEventBus.emit('export:success', {
                    format,
                    filename,
                    itemCount: history.length,
                    size: result.size
                });
            }
            
            return { success: true, ...result };
        } catch (error) {
            return handleExportError(error, `export${format.charAt(0).toUpperCase() + format.slice(1)}`);
        }
    }

    /**
     * Export history to JSON file
     * @param {Array} history - Conversation history (optional)
     * @returns {Object} Export result
     */
    function exportJSON(history) {
        return exportAs('json', history);
    }

    /**
     * Export history to CSV file
     * @param {Array} history - Conversation history (optional)
     * @returns {Object} Export result
     */
    function exportCSV(history) {
        return exportAs('csv', history);
    }

    /**
     * Export history to Markdown file
     * @param {Array} history - Conversation history (optional)
     * @returns {Object} Export result
     */
    function exportMarkdown(history) {
        return exportAs('markdown', history);
    }

    /**
     * Export history to text file
     * @param {Array} history - Conversation history (optional)
     * @returns {Object} Export result
     */
    function exportText(history) {
        return exportAs('text', history);
    }

    /**
     * Copy to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise} Promise that resolves when copied
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            return new Promise((resolve, reject) => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (e) {
                    reject(e);
                }
                document.body.removeChild(textarea);
            });
        }
    }

    /**
     * Copy history to clipboard as JSON
     * @param {Array} history - Conversation history
     */
    function copyJSON(history) {
        history = history || getHistory();
        const content = exportToJSON(history);
        return copyToClipboard(content);
    }

    /**
     * Copy history to clipboard as Markdown
     * @param {Array} history - Conversation history
     */
    function copyMarkdown(history) {
        history = history || getHistory();
        const content = exportToMarkdown(history);
        return copyToClipboard(content);
    }

    /**
     * Get export statistics with validation
     * @param {Array} history - Conversation history (optional)
     * @returns {Object} Statistics object
     */
    function getStatistics(history) {
        try {
            history = history || getHistory();
            validateHistory(history);
            
            const stats = {
                totalMessages: history.length,
                validMessages: 0,
                invalidMessages: 0,
                dateRange: null,
                averageMessageLength: 0,
                totalCharacters: 0,
                averageResponseLength: 0,
                success: true
            };

            if (history.length === 0) {
                return stats;
            }

            // Extract and sort valid timestamps
            const timestamps = history
                .map(h => h.timestamp)
                .filter(t => t && typeof t === 'string')
                .sort();

            if (timestamps.length > 0) {
                stats.dateRange = {
                    start: timestamps[0],
                    end: timestamps[timestamps.length - 1],
                    count: timestamps.length
                };
            }

            // Calculate statistics with validation
            let totalUserLength = 0;
            let totalResponseLength = 0;
            
            history.forEach(item => {
                const userMsg = item.userMessage || '';
                const aiResp = item.aiResponse || '';
                
                // Validate message structure
                if (typeof userMsg === 'string' && typeof aiResp === 'string') {
                    stats.validMessages++;
                    totalUserLength += userMsg.length;
                    totalResponseLength += aiResp.length;
                    stats.totalCharacters += userMsg.length + aiResp.length;
                } else {
                    stats.invalidMessages++;
                }
            });

            // Calculate averages safely
            if (stats.validMessages > 0) {
                stats.averageMessageLength = Math.round(totalUserLength / stats.validMessages);
                stats.averageResponseLength = Math.round(totalResponseLength / stats.validMessages);
            }

            return stats;
        } catch (error) {
            return handleExportError(error, 'getStatistics');
        }
    }

    // ============================================
    // INITIALIZE FORMAT CONVERTERS
    // ============================================
    
    // Set converter functions after they're defined
    EXPORT_FORMATS.json.converter = exportToJSON;
    EXPORT_FORMATS.csv.converter = exportToCSV;
    EXPORT_FORMATS.markdown.converter = exportToMarkdown;
    EXPORT_FORMATS.text.converter = exportToText;

    // ============================================
    // PUBLIC API
    // ============================================
    
    return {
        // Format conversion functions (for direct use)
        exportToJSON: exportToJSON,
        exportToCSV: exportToCSV,
        exportToMarkdown: exportToMarkdown,
        exportToText: exportToText,
        
        // File download functions (factory-based)
        exportJSON: exportJSON,
        exportCSV: exportCSV,
        exportMarkdown: exportMarkdown,
        exportText: exportText,
        
        // Clipboard functions
        copyToClipboard: copyToClipboard,
        copyJSON: copyJSON,
        copyMarkdown: copyMarkdown,
        
        // Utility functions
        getHistory: getHistory,
        getStatistics: getStatistics,
        
        // Metadata
        getSupportedFormats: () => Object.keys(EXPORT_FORMATS),
        getFormatInfo: (format) => EXPORT_FORMATS[format] || null
    };
})();

// ============================================
// EXPORT & DEBUGGING
// ============================================

// Expose for debugging and integration
if (typeof window !== 'undefined') {
    window.HistoryExport = HistoryExport;
    console.log('✅ HistoryExport module loaded');
}
