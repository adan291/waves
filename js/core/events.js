/**
 * Event System Module
 * Provides pub-sub event system for decoupling components
 * 
 * @module core/events
 */

/**
 * Event types used throughout the application
 * @enum {string}
 */
const EventTypes = {
    MESSAGE_SENT: 'message:sent',
    RESPONSE_RECEIVED: 'response:received',
    PERSONA_SWITCHED: 'persona:switched',
    MODE_CHANGED: 'mode:changed',
    AUDIO_PLAYED: 'audio:played',
    AUDIO_STOPPED: 'audio:stopped',
    ERROR_OCCURRED: 'error:occurred',
    STATE_UPDATED: 'state:updated',
    TYPING_STARTED: 'typing:started',
    TYPING_STOPPED: 'typing:stopped'
};

/**
 * Event handlers registry
 * @type {Object<string, Array<Function>>}
 * @private
 */
const eventHandlers = {};

/**
 * Register an event handler
 * @param {string} eventType - Type of event to listen for
 * @param {Function} handler - Function to call when event is emitted
 * @returns {Function} Unsubscribe function
 * 
 * @example
 * const unsubscribe = on(EventTypes.MESSAGE_SENT, (data) => {
 *   console.log('Message sent:', data);
 * });
 */
function on(eventType, handler) {
    if (!eventType || typeof eventType !== 'string') {
        console.error('on() requires a valid event type string');
        return () => {};
    }
    
    if (typeof handler !== 'function') {
        console.error('on() requires a function handler');
        return () => {};
    }
    
    // Initialize array for this event type if it doesn't exist
    if (!eventHandlers[eventType]) {
        eventHandlers[eventType] = [];
    }
    
    eventHandlers[eventType].push(handler);
    
    console.log(`🎧 Handler registered for "${eventType}". Total: ${eventHandlers[eventType].length}`);
    
    // Return unsubscribe function
    return () => off(eventType, handler);
}

/**
 * Unregister an event handler
 * @param {string} eventType - Type of event
 * @param {Function} handler - Handler function to remove
 * 
 * @example
 * off(EventTypes.MESSAGE_SENT, myHandler);
 */
function off(eventType, handler) {
    if (!eventHandlers[eventType]) {
        console.warn(`No handlers registered for event type: ${eventType}`);
        return;
    }
    
    const index = eventHandlers[eventType].indexOf(handler);
    
    if (index > -1) {
        eventHandlers[eventType].splice(index, 1);
        console.log(`🔇 Handler removed from "${eventType}". Remaining: ${eventHandlers[eventType].length}`);
        
        // Clean up empty arrays
        if (eventHandlers[eventType].length === 0) {
            delete eventHandlers[eventType];
        }
    } else {
        console.warn(`Handler not found for event type: ${eventType}`);
    }
}

/**
 * Emit an event to all registered handlers
 * @param {string} eventType - Type of event to emit
 * @param {*} data - Data to pass to handlers
 * 
 * @example
 * emit(EventTypes.MESSAGE_SENT, { text: 'Hello', timestamp: Date.now() });
 */
function emit(eventType, data) {
    if (!eventType || typeof eventType !== 'string') {
        console.error('emit() requires a valid event type string');
        return;
    }
    
    const handlers = eventHandlers[eventType];
    
    if (!handlers || handlers.length === 0) {
        console.log(`📭 No handlers for event "${eventType}"`);
        return;
    }
    
    console.log(`📣 Emitting "${eventType}" to ${handlers.length} handler(s)`, data);
    
    // Call all handlers with the data
    handlers.forEach(handler => {
        try {
            handler(data);
        } catch (error) {
            console.error(`Error in event handler for "${eventType}":`, error);
        }
    });
}

/**
 * Remove all handlers for a specific event type
 * @param {string} eventType - Type of event to clear
 * 
 * @example
 * clearHandlers(EventTypes.MESSAGE_SENT);
 */
function clearHandlers(eventType) {
    if (eventHandlers[eventType]) {
        const count = eventHandlers[eventType].length;
        delete eventHandlers[eventType];
        console.log(`🗑️ Cleared ${count} handler(s) for "${eventType}"`);
    }
}

/**
 * Remove all event handlers
 * 
 * @example
 * clearAllHandlers();
 */
function clearAllHandlers() {
    const eventTypes = Object.keys(eventHandlers);
    const totalHandlers = eventTypes.reduce((sum, type) => sum + eventHandlers[type].length, 0);
    
    for (const eventType in eventHandlers) {
        delete eventHandlers[eventType];
    }
    
    console.log(`🗑️ Cleared all handlers (${totalHandlers} total from ${eventTypes.length} event types)`);
}

/**
 * Get count of handlers for an event type
 * @param {string} eventType - Type of event
 * @returns {number} Number of handlers
 * 
 * @example
 * const count = getHandlerCount(EventTypes.MESSAGE_SENT);
 */
function getHandlerCount(eventType) {
    return eventHandlers[eventType] ? eventHandlers[eventType].length : 0;
}

/**
 * Get all registered event types
 * @returns {Array<string>} Array of event type names
 * 
 * @example
 * const types = getRegisteredEventTypes();
 */
function getRegisteredEventTypes() {
    return Object.keys(eventHandlers);
}

// ============================================
