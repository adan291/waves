/**
 * Event Bus Module
 * Centralizes event management across the application
 * Provides pub/sub pattern for loose coupling
 * 
 * @module eventBus
 */

const EventBus = (() => {
    'use strict';

    // Store for event listeners
    const listeners = {};

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    function on(eventName, callback) {
        if (typeof eventName !== 'string' || typeof callback !== 'function') {
            return () => {};
        }

        if (!listeners[eventName]) {
            listeners[eventName] = [];
        }

        listeners[eventName].push(callback);

        // Return unsubscribe function
        return () => {
            off(eventName, callback);
        };
    }

    /**
     * Subscribe to event once
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    function once(eventName, callback) {
        if (typeof eventName !== 'string' || typeof callback !== 'function') {
            return () => {};
        }

        const wrapper = (...args) => {
            callback(...args);
            off(eventName, wrapper);
        };

        return on(eventName, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to remove
     */
    function off(eventName, callback) {
        if (!listeners[eventName]) {
            return;
        }

        listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);

        if (listeners[eventName].length === 0) {
            delete listeners[eventName];
        }
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass to listeners
     */
    function emit(eventName, data) {
        if (typeof eventName !== 'string') {
            return;
        }

        if (!listeners[eventName]) {
            return;
        }

        // Call all listeners
        listeners[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error('Error in event listener for ' + eventName + ':', e);
            }
        });
    }

    /**
     * Get listener count for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of listeners
     */
    function getListenerCount(eventName) {
        if (!listeners[eventName]) {
            return 0;
        }
        return listeners[eventName].length;
    }

    /**
     * Get all event names
     * @returns {Array} Array of event names
     */
    function getEventNames() {
        return Object.keys(listeners);
    }

    /**
     * Clear all listeners for an event
     * @param {string} eventName - Name of the event
     */
    function clear(eventName) {
        if (eventName) {
            delete listeners[eventName];
        } else {
            // Clear all
            for (const key in listeners) {
                delete listeners[key];
            }
        }
    }

    /**
     * Get debug info
     * @returns {Object} Debug information
     */
    function getDebugInfo() {
        const info = {};
        for (const eventName in listeners) {
            info[eventName] = listeners[eventName].length;
        }
        return info;
    }

    // Public API
    return {
        on: on,
        once: once,
        off: off,
        emit: emit,
        getListenerCount: getListenerCount,
        getEventNames: getEventNames,
        clear: clear,
        getDebugInfo: getDebugInfo
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.EventBus = EventBus;
}
