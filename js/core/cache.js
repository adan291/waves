/**
 * Cache System
 * In-memory and localStorage caching for API responses
 * 
 * @module core/cache
 */

const CacheManager = (function() {
    'use strict';

    // In-memory cache
    const memoryCache = new Map();

    // Configuration
    const config = {
        enableMemoryCache: true,
        enablePersistentCache: true,
        defaultTTL: 5 * 60 * 1000, // 5 minutes
        maxMemorySize: 50, // Max items in memory
        storagePrefix: 'whispers_cache_'
    };

    /**
     * Generate cache key from input
     * @private
     */
    function generateKey(namespace, identifier) {
        const str = typeof identifier === 'object' 
            ? JSON.stringify(identifier) 
            : String(identifier);
        
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return `${namespace}_${Math.abs(hash)}`;
    }

    /**
     * Check if cache entry is expired
     * @private
     */
    function isExpired(entry) {
        if (!entry.expiresAt) return false;
        return Date.now() > entry.expiresAt;
    }

    /**
     * Clean expired entries from memory
     * @private
     */
    function cleanExpired() {
        for (const [key, entry] of memoryCache.entries()) {
            if (isExpired(entry)) {
                memoryCache.delete(key);
            }
        }
    }

    /**
     * Enforce memory cache size limit
     * @private
     */
    function enforceLimit() {
        if (memoryCache.size <= config.maxMemorySize) return;

        // Remove oldest entries
        const entries = Array.from(memoryCache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        const toRemove = entries.slice(0, memoryCache.size - config.maxMemorySize);
        toRemove.forEach(([key]) => memoryCache.delete(key));
    }

    // Public API
    return {
        /**
         * Set cache entry
         * @param {string} namespace - Cache namespace
         * @param {string|object} identifier - Unique identifier
         * @param {*} data - Data to cache
         * @param {number} ttl - Time to live in milliseconds (optional)
         */
        set(namespace, identifier, data, ttl = config.defaultTTL) {
            const key = generateKey(namespace, identifier);
            const entry = {
                data,
                timestamp: Date.now(),
                expiresAt: ttl ? Date.now() + ttl : null
            };

            // Memory cache
            if (config.enableMemoryCache) {
                memoryCache.set(key, entry);
                enforceLimit();
            }

            // Persistent cache
            if (config.enablePersistentCache) {
                try {
                    localStorage.setItem(
                        config.storagePrefix + key,
                        JSON.stringify(entry)
                    );
                } catch (error) {
                    // Silently fail if localStorage is full
                    if (typeof Logger !== 'undefined') {
                        Logger.warn('Cache', 'Failed to persist cache entry', { key, error: error.message });
                    }
                }
            }
        },

        /**
         * Get cache entry
         * @param {string} namespace - Cache namespace
         * @param {string|object} identifier - Unique identifier
         * @returns {*} Cached data or null
         */
        get(namespace, identifier) {
            const key = generateKey(namespace, identifier);

            // Try memory cache first
            if (config.enableMemoryCache && memoryCache.has(key)) {
                const entry = memoryCache.get(key);
                
                if (!isExpired(entry)) {
                    return entry.data;
                }
                
                memoryCache.delete(key);
            }

            // Try persistent cache
            if (config.enablePersistentCache) {
                try {
                    const stored = localStorage.getItem(config.storagePrefix + key);
                    if (stored) {
                        const entry = JSON.parse(stored);
                        
                        if (!isExpired(entry)) {
                            // Restore to memory cache
                            if (config.enableMemoryCache) {
                                memoryCache.set(key, entry);
                            }
                            return entry.data;
                        }
                        
                        // Remove expired entry
                        localStorage.removeItem(config.storagePrefix + key);
                    }
                } catch (error) {
                    // Silently fail
                }
            }

            return null;
        },

        /**
         * Check if cache has entry
         * @param {string} namespace - Cache namespace
         * @param {string|object} identifier - Unique identifier
         * @returns {boolean}
         */
        has(namespace, identifier) {
            return this.get(namespace, identifier) !== null;
        },

        /**
         * Delete cache entry
         * @param {string} namespace - Cache namespace
         * @param {string|object} identifier - Unique identifier
         */
        delete(namespace, identifier) {
            const key = generateKey(namespace, identifier);
            
            memoryCache.delete(key);
            
            try {
                localStorage.removeItem(config.storagePrefix + key);
            } catch (error) {
                // Silently fail
            }
        },

        /**
         * Clear all cache
         * @param {string} namespace - Optional namespace to clear
         */
        clear(namespace = null) {
            if (namespace) {
                // Clear specific namespace
                const prefix = namespace + '_';
                
                for (const key of memoryCache.keys()) {
                    if (key.startsWith(prefix)) {
                        memoryCache.delete(key);
                    }
                }
                
                // Clear from localStorage
                try {
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key.startsWith(config.storagePrefix + prefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                } catch (error) {
                    // Silently fail
                }
            } else {
                // Clear all
                memoryCache.clear();
                
                try {
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key.startsWith(config.storagePrefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                } catch (error) {
                    // Silently fail
                }
            }
        },

        /**
         * Get cache statistics
         * @returns {object} Cache stats
         */
        getStats() {
            cleanExpired();
            
            return {
                memorySize: memoryCache.size,
                maxMemorySize: config.maxMemorySize,
                memoryUsage: (memoryCache.size / config.maxMemorySize * 100).toFixed(1) + '%'
            };
        },

        // Configuration
        configure(options) {
            Object.assign(config, options);
        }
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.CacheManager = CacheManager;
}

console.log('💾 Cache manager loaded');
