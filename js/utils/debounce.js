/**
 * Utility Functions
 * Debouncing, throttling, and other performance utilities
 * 
 * @module utils/debounce
 */

/**
 * Debounce function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - limits execution to once per wait time
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, wait = 300) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}

/**
 * Request animation frame wrapper for smooth animations
 * @param {Function} callback - Function to execute
 */
function rafThrottle(callback) {
    let requestId = null;
    
    return function(...args) {
        if (requestId === null) {
            requestId = requestAnimationFrame(() => {
                requestId = null;
                callback(...args);
            });
        }
    };
}

/**
 * Batch multiple calls into single execution
 * @param {Function} func - Function to batch
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Batched function
 */
function batch(func, wait = 50) {
    let timeout;
    let calls = [];
    
    return function(...args) {
        calls.push(args);
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(calls);
            calls = [];
        }, wait);
    };
}

// Export to window
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.throttle = throttle;
    window.rafThrottle = rafThrottle;
    window.batch = batch;
    
    // Log after a small delay to ensure console is ready
    setTimeout(() => {
        console.log('⚡ Utility functions loaded');
    }, 0);
}
