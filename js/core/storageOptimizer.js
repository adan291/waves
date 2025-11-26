/**
 * Storage Optimizer
 * Compresses and manages localStorage efficiently
 * 
 * @module core/storageOptimizer
 */

const StorageOptimizer = (function() {
    'use strict';

    // Configuration
    const config = {
        compressionEnabled: true,
        maxStorageSize: 5 * 1024 * 1024, // 5MB
        warningThreshold: 0.8 // Warn at 80% capacity
    };

    /**
     * Simple LZW compression
     * @private
     */
    function compress(str) {
        if (!config.compressionEnabled) return str;

        const dict = {};
        const data = (str + '').split('');
        const out = [];
        let currChar;
        let phrase = data[0];
        let code = 256;

        for (let i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            } else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));

        return JSON.stringify(out);
    }

    /**
     * Simple LZW decompression
     * @private
     */
    function decompress(compressed) {
        if (!config.compressionEnabled) return compressed;

        try {
            const data = JSON.parse(compressed);
            const dict = {};
            let currChar = String.fromCharCode(data[0]);
            let oldPhrase = currChar;
            const out = [currChar];
            let code = 256;
            let phrase;

            for (let i = 1; i < data.length; i++) {
                const currCode = data[i];
                if (currCode < 256) {
                    phrase = String.fromCharCode(data[i]);
                } else {
                    phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
                }
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code] = oldPhrase + currChar;
                code++;
                oldPhrase = phrase;
            }

            return out.join('');
        } catch (error) {
            // Return original if decompression fails
            return compressed;
        }
    }

    /**
     * Get current storage usage
     * @private
     */
    function getStorageSize() {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    /**
     * Check if storage is near capacity
     * @private
     */
    function checkCapacity() {
        const used = getStorageSize();
        const percentage = used / config.maxStorageSize;

        if (percentage > config.warningThreshold && typeof Logger !== 'undefined') {
            Logger.warn('Storage', 'Storage usage high', {
                used: `${(used / 1024).toFixed(2)}KB`,
                percentage: `${(percentage * 100).toFixed(1)}%`
            });
        }

        return percentage;
    }

    // Public API
    return {
        /**
         * Set item with compression
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @param {boolean} compress - Whether to compress (default: true)
         */
        setItem(key, value, compress = true) {
            try {
                const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                const data = compress ? this.compress(serialized) : serialized;
                
                const metadata = {
                    compressed: compress,
                    timestamp: Date.now()
                };

                localStorage.setItem(key, JSON.stringify({ data, metadata }));
                checkCapacity();
                
                return true;
            } catch (error) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Storage', 'Failed to set item', { key, error: error.message });
                }
                
                // Try to free space
                this.cleanup();
                
                // Retry once
                try {
                    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(key, serialized);
                    return true;
                } catch (retryError) {
                    return false;
                }
            }
        },

        /**
         * Get item with decompression
         * @param {string} key - Storage key
         * @returns {*} Stored value or null
         */
        getItem(key) {
            try {
                const stored = localStorage.getItem(key);
                if (!stored) return null;

                // Try to parse as optimized format
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed.data && parsed.metadata) {
                        const data = parsed.metadata.compressed 
                            ? this.decompress(parsed.data)
                            : parsed.data;
                        
                        // Try to parse as JSON
                        try {
                            return JSON.parse(data);
                        } catch {
                            return data;
                        }
                    }
                } catch {
                    // Fallback to direct parse
                }

                // Fallback: try direct JSON parse
                try {
                    return JSON.parse(stored);
                } catch {
                    return stored;
                }
            } catch (error) {
                if (typeof Logger !== 'undefined') {
                    Logger.error('Storage', 'Failed to get item', { key, error: error.message });
                }
                return null;
            }
        },

        /**
         * Remove item
         * @param {string} key - Storage key
         */
        removeItem(key) {
            localStorage.removeItem(key);
        },

        /**
         * Compress data
         * @param {string} data - Data to compress
         * @returns {string} Compressed data
         */
        compress,

        /**
         * Decompress data
         * @param {string} data - Compressed data
         * @returns {string} Decompressed data
         */
        decompress,

        /**
         * Clean up old or large items
         */
        cleanup() {
            const items = [];
            
            // Collect all items with metadata
            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    try {
                        const value = localStorage[key];
                        const parsed = JSON.parse(value);
                        
                        items.push({
                            key,
                            size: value.length,
                            timestamp: parsed.metadata?.timestamp || 0
                        });
                    } catch {
                        // Skip items that can't be parsed
                    }
                }
            }

            // Sort by timestamp (oldest first)
            items.sort((a, b) => a.timestamp - b.timestamp);

            // Remove oldest items until under threshold
            const threshold = config.maxStorageSize * config.warningThreshold;
            let currentSize = getStorageSize();

            for (const item of items) {
                if (currentSize < threshold) break;
                
                // Don't remove critical keys
                if (item.key.includes('whispers-selected-wave') || 
                    item.key.includes('whispers-language')) {
                    continue;
                }

                localStorage.removeItem(item.key);
                currentSize -= item.size;
                
                if (typeof Logger !== 'undefined') {
                    Logger.info('Storage', `Cleaned up: ${item.key}`);
                }
            }
        },

        /**
         * Get storage statistics
         * @returns {object} Storage stats
         */
        getStats() {
            const used = getStorageSize();
            const percentage = (used / config.maxStorageSize * 100).toFixed(1);

            return {
                used: `${(used / 1024).toFixed(2)}KB`,
                max: `${(config.maxStorageSize / 1024).toFixed(2)}KB`,
                percentage: `${percentage}%`,
                itemCount: Object.keys(localStorage).length
            };
        }
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.StorageOptimizer = StorageOptimizer;
}

console.log('💾 Storage optimizer loaded');
