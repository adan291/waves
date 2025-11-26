/**
 * Lazy Load Manager
 * Manages dynamic loading of non-critical modules
 * 
 * @module core/lazyLoadManager
 */

const LazyLoadManager = (() => {
    const loadedModules = new Set();
    const loadingPromises = new Map();

    /**
     * Load a module dynamically
     * @param {string} modulePath - Path to the module
     * @param {string} moduleName - Name of the module
     * @returns {Promise} Promise that resolves when module is loaded
     */
    function loadModule(modulePath, moduleName) {
        // Return existing promise if already loading
        if (loadingPromises.has(moduleName)) {
            return loadingPromises.get(moduleName);
        }

        // Return immediately if already loaded
        if (loadedModules.has(moduleName)) {
            return Promise.resolve();
        }

        // Create loading promise
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = modulePath;
            script.async = true;

            script.onload = () => {
                loadedModules.add(moduleName);
                loadingPromises.delete(moduleName);
                resolve();
            };

            script.onerror = () => {
                loadingPromises.delete(moduleName);
                reject(new Error(`Failed to load module: ${moduleName}`));
            };

            document.head.appendChild(script);
        });

        loadingPromises.set(moduleName, promise);
        return promise;
    }

    /**
     * Load multiple modules
     * @param {Array} modules - Array of {path, name} objects
     * @returns {Promise} Promise that resolves when all modules are loaded
     */
    function loadModules(modules) {
        return Promise.all(modules.map(m => loadModule(m.path, m.name)));
    }

    /**
     * Check if module is loaded
     * @param {string} moduleName - Name of the module
     * @returns {boolean} True if module is loaded
     */
    function isLoaded(moduleName) {
        return loadedModules.has(moduleName);
    }

    /**
     * Get loaded modules
     * @returns {Array} Array of loaded module names
     */
    function getLoadedModules() {
        return Array.from(loadedModules);
    }

    /**
     * Clear loaded modules (for testing)
     */
    function clear() {
        loadedModules.clear();
        loadingPromises.clear();
    }

    return {
        loadModule,
        loadModules,
        isLoaded,
        getLoadedModules,
        clear
    };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.LazyLoadManager = LazyLoadManager;
}
