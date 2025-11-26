/**
 * State Management Module
 * Manages global application state with Observer pattern and localStorage persistence
 * 
 * @module core/state
 */

/**
 * Global application state
 * @type {Object}
 */
const appState = {
    conversationHistory: [],
    currentPersona: 'narrador',        // 'narrador' or 'kiro'
    currentMode: 'default',            // 'default', 'modoA', 'modoB', 'modoC'
    currentSpec: null,                 // Current active spec ID
    isProcessing: false,
    audioEnabled: true,
    emotionalContext: null,
    turnCount: 0,
    specHistory: [],                   // History of spec transitions
    lastUpdate: Date.now()
};

/**
 * Observer callbacks subscribed to state changes
 * @type {Array<Function>}
 */
const observers = [];

/**
 * Subscribe to state changes
 * @param {Function} callback - Function to call when state changes
 * @returns {Function} Unsubscribe function
 * 
 * @example
 * const unsubscribe = subscribe((state, changes) => {
 *   console.log('State changed:', changes);
 * });
 */
function subscribe(callback) {
    if (typeof callback !== 'function') {
        console.error('subscribe() requires a function callback');
        return () => {};
    }
    
    observers.push(callback);
    console.log(`🔔 Observer subscribed. Total observers: ${observers.length}`);
    
    // Return unsubscribe function
    return () => {
        const index = observers.indexOf(callback);
        if (index > -1) {
            observers.splice(index, 1);
            console.log(`🔕 Observer unsubscribed. Total observers: ${observers.length}`);
        }
    };
}

/**
 * Notify all observers of state changes
 * @param {Object} changes - Object containing changed properties
 * 
 * @example
 * notify({ currentPersona: 'kiro', turnCount: 5 });
 */
function notify(changes) {
    if (!changes || typeof changes !== 'object') {
        console.warn('notify() called without valid changes object');
        return;
    }
    
    console.log(`📢 Notifying ${observers.length} observers of changes:`, changes);
    
    observers.forEach(callback => {
        try {
            callback(appState, changes);
        } catch (error) {
            console.error('Error in observer callback:', error);
        }
    });
}

/**
 * Get current state (read-only copy)
 * @returns {Object} Copy of current state
 * 
 * @example
 * const state = getState();
 * console.log(state.currentPersona);
 */
function getState() {
    return { ...appState };
}

/**
 * Update state with new values
 * @param {Object} updates - Object with properties to update
 * @returns {Object} Updated state
 * 
 * @example
 * setState({ currentPersona: 'kiro', turnCount: 5 });
 */
function setState(updates) {
    if (!updates || typeof updates !== 'object') {
        console.error('setState() requires an object with updates');
        return appState;
    }
    
    const changes = {};
    
    // Track what actually changed
    for (const key in updates) {
        if (appState.hasOwnProperty(key) && appState[key] !== updates[key]) {
            changes[key] = updates[key];
            appState[key] = updates[key];
        }
    }
    
    // Update timestamp
    appState.lastUpdate = Date.now();
    
    // Notify observers if there were changes
    if (Object.keys(changes).length > 0) {
        notify(changes);
        
        // Persist to localStorage
        saveToLocalStorage();
    }
    
    return { ...appState };
}

/**
 * Save state to localStorage
 * @private
 */
function saveToLocalStorage() {
    try {
        const stateToSave = {
            conversationHistory: appState.conversationHistory,
            currentPersona: appState.currentPersona,
            currentMode: appState.currentMode,
            currentSpec: appState.currentSpec,
            audioEnabled: appState.audioEnabled,
            emotionalContext: appState.emotionalContext,
            turnCount: appState.turnCount,
            specHistory: appState.specHistory,
            lastUpdate: appState.lastUpdate
        };
        
        localStorage.setItem('whispersOfTheWave_state', JSON.stringify(stateToSave));
        console.log('💾 State saved to localStorage');
    } catch (error) {
        console.error('Failed to save state to localStorage:', error);
    }
}

/**
 * Load state from localStorage
 * @returns {boolean} True if state was loaded successfully
 * 
 * @example
 * if (loadFromLocalStorage()) {
 *   console.log('Previous session restored');
 * }
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('whispersOfTheWave_state');
        
        if (!saved) {
            console.log('📭 No saved state found in localStorage');
            return false;
        }
        
        const parsed = JSON.parse(saved);
        
        // Restore state (except isProcessing which should always start false)
        Object.assign(appState, parsed, { isProcessing: false });
        
        console.log('📬 State loaded from localStorage:', {
            conversationCount: appState.conversationHistory.length,
            currentPersona: appState.currentPersona,
            currentMode: appState.currentMode,
            turnCount: appState.turnCount
        });
        
        return true;
    } catch (error) {
        console.error('Failed to load state from localStorage:', error);
        return false;
    }
}

/**
 * Clear saved state from localStorage
 * 
 * @example
 * clearLocalStorage();
 */
function clearLocalStorage() {
    try {
        localStorage.removeItem('whispersOfTheWave_state');
        console.log('🗑️ State cleared from localStorage');
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
}

/**
 * Reset state to initial values
 * 
 * @example
 * resetState();
 */
function resetState() {
    const initialState = {
        conversationHistory: [],
        currentPersona: 'narrador',
        currentMode: 'default',
        currentSpec: null,
        isProcessing: false,
        audioEnabled: true,
        emotionalContext: null,
        turnCount: 0,
        specHistory: [],
        lastUpdate: Date.now()
    };
    
    Object.assign(appState, initialState);
    clearLocalStorage();
    
    console.log('🔄 State reset to initial values');
    notify({ reset: true });
}

// ============================================
// MANUAL TEST - Run in browser console
// ============================================


