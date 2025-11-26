# Code Examples: Specific Improvements for WaveBackground

This document provides copy-paste ready code examples for improving the WaveBackground module.

---

## Example 1: Add Cleanup Function (Prevents Memory Leaks)

### Problem
```javascript
// ❌ Event listeners never removed
document.addEventListener('wave:selected', (e) => { ... });
document.addEventListener('theme:changed', () => { ... });

// If init() is called twice, listeners duplicate
WaveBackground.init();
WaveBackground.init(); // Now we have 4 listeners instead of 2!
```

### Solution
```javascript
const WaveBackground = (() => {
    'use strict';
    
    // Track listeners for cleanup
    let waveListener = null;
    let themeListener = null;
    let isInitialized = false;
    
    function init() {
        // Prevent duplicate initialization
        if (isInitialized) {
            console.warn('WaveBackground already initialized');
            return;
        }
        
        // Clean up any existing listeners first
        cleanup();
        
        // Apply wave background on load
        applyWaveBackground();
        
        // Create and store listener references
        waveListener = (e) => {
            if (e.detail && e.detail.wave) {
                applyWaveBackground(e.detail.wave.id);
            }
        };
        
        themeListener = () => {
            const currentWave = localStorage.getItem('whispers-selected-wave');
            if (currentWave) {
                document.body.setAttribute('data-wave', currentWave);
            }
        };
        
        // Add listeners
        document.addEventListener('wave:selected', waveListener);
        document.addEventListener('theme:changed', themeListener);
        
        isInitialized = true;
        console.log('🌊 Wave Background Manager initialized');
    }
    
    /**
     * Cleanup function - removes all listeners
     * Call this before re-initializing or when module is no longer needed
     */
    function cleanup() {
        if (waveListener) {
            document.removeEventListener('wave:selected', waveListener);
            waveListener = null;
        }
        if (themeListener) {
            document.removeEventListener('theme:changed', themeListener);
            themeListener = null;
        }
        isInitialized = false;
    }
    
    // ... rest of module ...
    
    return {
        init,
        cleanup, // Export for testing and cleanup
        applyWaveBackground,
        getCurrentWave,
        getWaveInfo
    };
})();
```

### Usage
```javascript
// Initialize
WaveBackground.init();

// Later, if needed to clean up
WaveBackground.cleanup();

// Safe to re-initialize without duplicate listeners
WaveBackground.init();
```

---

## Example 2: Use AnimationController (Prevents Race Conditions)

### Problem
```javascript
// ❌ Multiple systems restart animation independently
// ThemeToggle restarts animation
function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    restartOceanAnimation(); // Restart 1
}

// WaveBackground restarts animation
function applyWaveBackground(waveId) {
    document.body.setAttribute('data-wave', waveId);
    restartWaveAnimation(); // Restart 2
}

// OceanDynamics restarts animation
function applyState(state) {
    // ... update state ...
    restartAnimation(); // Restart 3
}

// Result: Animation restarts 3 times, causing jank!
```

### Solution
```javascript
// Step 1: Create AnimationController (new file)
const AnimationController = (() => {
    'use strict';
    
    let pendingRestart = null;
    const RESTART_DELAY = 50; // ms
    
    function requestRestart(source = 'unknown') {
        console.log(`🎬 Animation restart requested by: ${source}`);
        
        // Cancel previous pending restart
        if (pendingRestart) {
            clearTimeout(pendingRestart);
        }
        
        // Schedule restart with debounce
        // Multiple requests within 50ms are batched into one restart
        pendingRestart = setTimeout(() => {
            performRestart();
            pendingRestart = null;
        }, RESTART_DELAY);
    }
    
    function performRestart() {
        const oceanBg = document.querySelector('.ocean-background');
        if (!oceanBg) return;
        
        try {
            oceanBg.style.animation = 'none';
            void oceanBg.offsetHeight; // Single reflow
            oceanBg.style.animation = '';
            console.log('✅ Ocean animation restarted');
        } catch (error) {
            console.error('❌ Animation restart failed:', error);
        }
    }
    
    function cancel() {
        if (pendingRestart) {
            clearTimeout(pendingRestart);
            pendingRestart = null;
        }
    }
    
    return {
        requestRestart,
        cancel
    };
})();

// Step 2: Update WaveBackground to use it
function restartWaveAnimation() {
    if (typeof AnimationController !== 'undefined') {
        AnimationController.requestRestart('WaveBackground');
    }
}

// Step 3: Update ThemeToggle to use it
function restartOceanAnimation() {
    if (typeof AnimationController !== 'undefined') {
        AnimationController.requestRestart('ThemeToggle');
    }
}

// Step 4: Update OceanDynamics to use it
function applyState(state) {
    // ... update state ...
    if (typeof AnimationController !== 'undefined') {
        AnimationController.requestRestart('OceanDynamics');
    }
}

// Result: All three requests are batched into ONE animation restart!
```

### Before & After
```javascript
// BEFORE: 3 animation restarts
User clicks theme toggle
    ├─ ThemeToggle.restartOceanAnimation() ← Restart 1
    ├─ WaveBackground hears 'theme:changed' → restartWaveAnimation() ← Restart 2
    └─ OceanDynamics hears 'theme:changed' → restartAnimation() ← Restart 3

// AFTER: 1 animation restart
User clicks theme toggle
    ├─ ThemeToggle.requestRestart('ThemeToggle')
    ├─ WaveBackground.requestRestart('WaveBackground')
    └─ OceanDynamics.requestRestart('OceanDynamics')
        ↓
    AnimationController batches all 3 requests
        ↓
    Single animation restart after 50ms
```

---

## Example 3: Implement Wave Registry (Improves Extensibility)

### Problem
```javascript
// ❌ Can't add waves without modifying code
function getWaveInfo(waveId) {
    const waves = {
        calm: { /* ... */ },
        deep: { /* ... */ },
        energetic: { /* ... */ },
        healing: { /* ... */ }
        // To add a new wave, must modify this function!
    };
    return waves[waveId] || null;
}
```

### Solution
```javascript
// Create a wave registry
const WaveRegistry = (() => {
    'use strict';
    
    const waves = new Map();
    
    /**
     * Register a new wave
     * @param {string} id - Wave ID
     * @param {Object} config - Wave configuration
     */
    function register(id, config) {
        if (waves.has(id)) {
            console.warn(`Wave "${id}" already registered, overwriting`);
        }
        waves.set(id, config);
        console.log(`✅ Wave registered: ${id}`);
    }
    
    /**
     * Get wave by ID
     * @param {string} id - Wave ID
     * @returns {Object|null} Wave configuration or null
     */
    function get(id) {
        return waves.get(id) || null;
    }
    
    /**
     * Get all registered waves
     * @returns {Array} Array of wave configurations
     */
    function getAll() {
        return Array.from(waves.values());
    }
    
    /**
     * Check if wave exists
     * @param {string} id - Wave ID
     * @returns {boolean}
     */
    function exists(id) {
        return waves.has(id);
    }
    
    /**
     * Get all wave IDs
     * @returns {Array} Array of wave IDs
     */
    function getAllIds() {
        return Array.from(waves.keys());
    }
    
    return {
        register,
        get,
        getAll,
        exists,
        getAllIds
    };
})();

// Register waves (can be done anywhere, not just in WaveBackground)
WaveRegistry.register('calm', {
    id: 'calm',
    name: 'Ola Tranquila',
    nameEn: 'Calm Wave',
    icon: '🌊',
    description: 'Peaceful self-discovery',
    colors: {
        dark: ['#0a1a2e', '#87ceeb'],
        light: ['#e0f2f7', '#2e5266']
    }
});

WaveRegistry.register('deep', {
    id: 'deep',
    name: 'Ola Profunda',
    nameEn: 'Deep Wave',
    icon: '🌀',
    description: 'Deep emotional exploration',
    colors: {
        dark: ['#0d0221', '#9b88cc'],
        light: ['#e8e0f5', '#3e2a5f']
    }
});

// Now WaveBackground can use the registry
const WaveBackground = (() => {
    function getWaveInfo(waveId) {
        return WaveRegistry.get(waveId);
    }
    
    return { getWaveInfo };
})();

// Usage
const calmWave = WaveRegistry.get('calm');
const allWaves = WaveRegistry.getAll();
const waveIds = WaveRegistry.getAllIds();

// Adding a new wave is now easy - no code modification needed!
WaveRegistry.register('mystical', {
    id: 'mystical',
    name: 'Ola Mística',
    icon: '✨',
    // ... config ...
});
```

---

## Example 4: Add Dependency Injection (Improves Testability)

### Problem
```javascript
// ❌ Tight coupling to DOM - hard to test
const WaveBackground = (() => {
    function init() {
        document.addEventListener('wave:selected', handler);
        document.body.setAttribute('data-wave', wave);
    }
});

// Can't test without real DOM
// Can't reuse with different event systems
```

### Solution
```javascript
// Create WaveBackground with dependency injection
const WaveBackground = (deps = {}) => {
    'use strict';
    
    // Inject dependencies with sensible defaults
    const {
        eventBus = document,
        domAdapter = {
            setAttribute: (el, attr, value) => el.setAttribute(attr, value),
            getAttribute: (el, attr) => el.getAttribute(attr),
            removeAttribute: (el, attr) => el.removeAttribute(attr),
            querySelector: (selector) => document.querySelector(selector)
        },
        storage = localStorage,
        logger = console
    } = deps;
    
    let waveListener = null;
    let themeListener = null;
    
    function init() {
        // Use injected event bus
        waveListener = (e) => {
            if (e.detail?.wave?.id) {
                applyWaveBackground(e.detail.wave.id);
            }
        };
        
        eventBus.addEventListener('wave:selected', waveListener);
        logger.log('🌊 Wave Background initialized');
    }
    
    function applyWaveBackground(waveId = null) {
        // Use injected storage
        const wave = waveId || storage.getItem('whispers-selected-wave') || '';
        
        // Use injected DOM adapter
        const body = domAdapter.querySelector('body');
        if (wave) {
            domAdapter.setAttribute(body, 'data-wave', wave);
        } else {
            domAdapter.removeAttribute(body, 'data-wave');
        }
    }
    
    function cleanup() {
        if (waveListener) {
            eventBus.removeEventListener('wave:selected', waveListener);
        }
    }
    
    return {
        init,
        cleanup,
        applyWaveBackground
    };
};

// Usage in production (uses real DOM)
const waveBackground = WaveBackground();
waveBackground.init();

// Usage in tests (uses mock objects)
const mockEventBus = {
    listeners: {},
    addEventListener(event, handler) {
        this.listeners[event] = handler;
    },
    removeEventListener(event) {
        delete this.listeners[event];
    }
};

const mockDomAdapter = {
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    querySelector: jest.fn()
};

const mockStorage = {
    getItem: jest.fn(() => 'calm'),
    setItem: jest.fn()
};

const testWaveBackground = WaveBackground({
    eventBus: mockEventBus,
    domAdapter: mockDomAdapter,
    storage: mockStorage,
    logger: { log: jest.fn() }
});

// Now we can test without real DOM!
testWaveBackground.init();
expect(mockEventBus.listeners['wave:selected']).toBeDefined();
```

---

## Example 5: Batch DOM Operations (Improves Performance)

### Problem
```javascript
// ❌ Multiple reflows
function restartWaveAnimation() {
    const oceanBg = document.querySelector('.ocean-background');
    
    oceanBg.style.animation = 'none';
    void oceanBg.offsetHeight; // Reflow 1
    
    oceanBg.style.animation = '';
    void oceanBg.offsetHeight; // Reflow 2
}

// Result: 2 reflows = slower performance
```

### Solution
```javascript
// ✅ Single reflow
function restartWaveAnimation() {
    const oceanBg = document.querySelector('.ocean-background');
    
    // Batch all style changes
    oceanBg.style.animation = 'none';
    
    // Single reflow to force layout recalculation
    void oceanBg.offsetHeight;
    
    // Re-enable animation
    oceanBg.style.animation = '';
    
    // No second reflow needed!
}

// Or use requestAnimationFrame for even better performance
function restartWaveAnimation() {
    const oceanBg = document.querySelector('.ocean-background');
    
    // Disable animation
    oceanBg.style.animation = 'none';
    
    // Force reflow in next frame
    requestAnimationFrame(() => {
        void oceanBg.offsetHeight;
        
        // Re-enable animation in next frame
        requestAnimationFrame(() => {
            oceanBg.style.animation = '';
        });
    });
}
```

---

## Example 6: Add Error Handling & Fallbacks

### Problem
```javascript
// ❌ Silent failures
function restartWaveAnimation() {
    try {
        oceanBg.style.animation = 'none';
        void oceanBg.offsetHeight;
        oceanBg.style.animation = '';
        console.log('🌊 Wave animation restarted');
    } catch (error) {
        console.error('❌ Failed to restart wave animation:', error);
        // User sees nothing - animation might be broken!
    }
}
```

### Solution
```javascript
// ✅ Proper error handling with fallback
function restartWaveAnimation() {
    const oceanBg = document.querySelector('.ocean-background');
    
    if (!oceanBg) {
        console.warn('⚠️ Ocean background element not found');
        return false;
    }
    
    try {
        // Primary method: Direct animation reset
        oceanBg.style.animation = 'none';
        void oceanBg.offsetHeight;
        oceanBg.style.animation = '';
        
        console.log('✅ Ocean animation restarted (primary method)');
        return true;
        
    } catch (error) {
        console.error('❌ Primary animation restart failed:', error);
        
        // Fallback method 1: CSS class toggle
        try {
            oceanBg.classList.remove('wave-animating');
            void oceanBg.offsetHeight;
            oceanBg.classList.add('wave-animating');
            
            console.log('✅ Ocean animation restarted (fallback method 1)');
            return true;
            
        } catch (fallbackError) {
            console.error('❌ Fallback method 1 failed:', fallbackError);
            
            // Fallback method 2: Force repaint
            try {
                oceanBg.style.display = 'none';
                void oceanBg.offsetHeight;
                oceanBg.style.display = '';
                
                console.log('✅ Ocean animation restarted (fallback method 2)');
                return true;
                
            } catch (finalError) {
                console.error('❌ All animation restart methods failed:', finalError);
                return false;
            }
        }
    }
}

// Usage with error handling
if (!restartWaveAnimation()) {
    console.warn('⚠️ Animation restart failed - user may see frozen animation');
    // Could notify user or try alternative approach
}
```

---

## Example 7: Add Debug Mode

### Problem
```javascript
// ❌ Hard to debug animation issues
// No visibility into what's happening
```

### Solution
```javascript
// ✅ Add debug mode
const WaveBackground = (() => {
    'use strict';
    
    const DEBUG = localStorage.getItem('wave-background-debug') === 'true';
    
    function log(...args) {
        if (DEBUG) {
            console.log('[WaveBackground]', ...args);
        }
    }
    
    function init() {
        log('Initializing...');
        applyWaveBackground();
        
        document.addEventListener('wave:selected', (e) => {
            log('Wave selected:', e.detail.wave.id);
            applyWaveBackground(e.detail.wave.id);
        });
        
        log('Initialized');
    }
    
    function applyWaveBackground(waveId = null) {
        const wave = waveId || localStorage.getItem('whispers-selected-wave') || '';
        log('Applying wave:', wave);
        
        if (wave) {
            document.body.setAttribute('data-wave', wave);
            log('Wave attribute set:', wave);
        }
    }
    
    return { init, applyWaveBackground };
})();

// Enable debug mode in browser console
localStorage.setItem('wave-background-debug', 'true');
location.reload();

// Disable debug mode
localStorage.removeItem('wave-background-debug');
location.reload();
```

---

## Summary of Improvements

| Improvement | Benefit | Effort | Priority |
|-------------|---------|--------|----------|
| Add cleanup function | Prevents memory leaks | 5 min | 🔴 High |
| Use AnimationController | Prevents race conditions | 15 min | 🔴 High |
| Wave registry | Improves extensibility | 10 min | 🟡 Medium |
| Dependency injection | Improves testability | 20 min | 🟡 Medium |
| Batch DOM operations | Improves performance | 5 min | 🟡 Medium |
| Error handling | Improves reliability | 10 min | 🟡 Medium |
| Debug mode | Improves debuggability | 5 min | 🟢 Low |

**Total Time**: ~70 minutes  
**Total Benefit**: Significant improvements in reliability, performance, and maintainability

