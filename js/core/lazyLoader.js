/**
 * Lazy Module Loader
 * Loads non-critical modules on demand to improve initial load time
 * 
 * @module core/lazyLoader
 */

const LazyLoader = (function() {
    'use strict';

    // Track loaded modules
    const loadedModules = new Set();
    const loadingPromises = new Map();

    /**
     * Load a script dynamically
     * @param {string} src - Script source URL
     * @returns {Promise} Resolves when script is loaded
     * @private
     */
    function loadScript(src) {
        // Return existing promise if already loading
        if (loadingPromises.has(src)) {
            return loadingPromises.get(src);
        }

        // Return immediately if already loaded
        if (loadedModules.has(src)) {
            return Promise.resolve();
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;

            script.onload = () => {
                loadedModules.add(src);
                loadingPromises.delete(src);
                
                if (typeof Logger !== 'undefined') {
                    Logger.info('LazyLoader', `Loaded: ${src}`);
                }
                
                resolve();
            };

            script.onerror = () => {
                loadingPromises.delete(src);
                
                if (typeof Logger !== 'undefined') {
                    Logger.error('LazyLoader', `Failed to load: ${src}`);
                }
                
                reject(new Error(`Failed to load script: ${src}`));
            };

            document.head.appendChild(script);
        });

        loadingPromises.set(src, promise);
        return promise;
    }

    /**
     * Load multiple scripts in parallel
     * @param {Array<string>} scripts - Array of script URLs
     * @returns {Promise} Resolves when all scripts are loaded
     * @private
     */
    function loadScripts(scripts) {
        return Promise.all(scripts.map(src => loadScript(src)));
    }

    // Module groups for lazy loading
    const moduleGroups = {
        // Features that can be loaded on demand
        features: [
            'js/features/quickReactions.js',
            'js/features/historySearch.js',
            'js/features/keyboardShortcuts.js'
        ],
        
        // Achievement system (load when first needed)
        achievements: [
            'js/engine/achievementSystem.js',
            'js/ui/achievementUI.js'
        ],
        
        // Report system (load when first needed)
        reports: [
            'js/engine/reportGenerator.js',
            'js/ui/reportUI.js'
        ],
        
        // Speech features (load when user clicks mic button)
        speech: [
            'js/features/speechToText.js'
        ]
    };

    // Public API
    return {
        /**
         * Load a module group
         * @param {string} groupName - Name of module group
         * @returns {Promise} Resolves when group is loaded
         */
        async loadGroup(groupName) {
            const scripts = moduleGroups[groupName];
            
            if (!scripts) {
                throw new Error(`Unknown module group: ${groupName}`);
            }

            if (typeof Logger !== 'undefined') {
                Logger.info('LazyLoader', `Loading group: ${groupName}`);
            }

            return loadScripts(scripts);
        },

        /**
         * Load a single module
         * @param {string} src - Script source URL
         * @returns {Promise} Resolves when module is loaded
         */
        async load(src) {
            return loadScript(src);
        },

        /**
         * Check if module is loaded
         * @param {string} src - Script source URL
         * @returns {boolean}
         */
        isLoaded(src) {
            return loadedModules.has(src);
        },

        /**
         * Preload a module group (load in background)
         * @param {string} groupName - Name of module group
         */
        preload(groupName) {
            // Use requestIdleCallback if available
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    this.loadGroup(groupName).catch(() => {
                        // Silently fail preloading
                    });
                });
            } else {
                // Fallback to setTimeout
                setTimeout(() => {
                    this.loadGroup(groupName).catch(() => {
                        // Silently fail preloading
                    });
                }, 1000);
            }
        },

        /**
         * Get loaded modules
         * @returns {Array<string>}
         */
        getLoadedModules() {
            return Array.from(loadedModules);
        }
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.LazyLoader = LazyLoader;
}

console.log('⚡ Lazy loader ready');
