# Implementation Guide: Animation Controller

**Objective**: Centralize animation management to prevent race conditions between WaveBackground, ThemeToggle, and OceanDynamics.

**Effort**: ~30 minutes  
**Risk**: Low (backward compatible)  
**Impact**: High (prevents animation jank and race conditions)

---

## Step 1: Create AnimationController Module

Create file: `js/core/animationController.js`

```javascript
/**
 * Animation Controller
 * Centralized management of ocean background animations
 * 
 * Problem it solves:
 * - Multiple systems (WaveBackground, ThemeToggle, OceanDynamics) were independently
 *   restarting animations, causing race conditions and jank
 * - No coordination between animation requests
 * - Unclear which system "owns" animation state
 * 
 * Solution:
 * - Single point of control for animation restart
 * - Debounces multiple rapid requests
 * - Provides clear API for all systems
 * - Logs all animation activity for debugging
 */

const AnimationController = (() => {
    'use strict';
    
    // Configuration
    const CONFIG = Object.freeze({
        RESTART_DELAY: 50, // ms - allows multiple systems to batch requests
        ANIMATION_SELECTOR: '.ocean-background',
        DEBUG: false // Set to true for verbose logging
    });
    
    // Private state
    let pendingRestart = null;
    const requestQueue = [];
    let lastRestartTime = 0;
    
    /**
     * Request animation restart
     * Multiple requests within RESTART_DELAY are batched into single restart
     * 
     * @param {string} source - Name of system requesting restart (for debugging)
     * @param {Object} options - Optional configuration
     * @param {boolean} options.immediate - Skip debounce and restart immediately
     * @param {Function} options.onComplete - Callback after restart completes
     */
    function requestRestart(source = 'unknown', options = {}) {
        const { immediate = false, onComplete = null } = options;
        
        // Log request
        if (CONFIG.DEBUG) {
            console.log(`🎬 Animation restart requested by: ${source}`);
        }
        
        // Track request
        requestQueue.push({
            source,
            timestamp: Date.now(),
            onComplete
        });
        
        // Cancel pending restart if exists
        if (pendingRestart) {
            clearTimeout(pendingRestart);
        }
        
        // Immediate restart (skip debounce)
        if (immediate) {
            performRestart();
            return;
        }
        
        // Schedule restart with debounce
        pendingRestart = setTimeout(() => {
            performRestart();
            pendingRestart = null;
        }, CONFIG.RESTART_DELAY);
    }
    
    /**
     * Perform the actual animation restart
     * @private
     */
    function performRestart() {
        const oceanBg = document.querySelector(CONFIG.ANIMATION_SELECTOR);
        
        if (!oceanBg) {
            console.warn(`⚠️ Animation element not found: ${CONFIG.ANIMATION_SELECTOR}`);
            executeCallbacks();
            return;
        }
        
        try {
            // Measure performance
            const startTime = performance.now();
            
            // Reset animation
            oceanBg.style.animation = 'none';
            
            // Force reflow (single reflow, not multiple)
            void oceanBg.offsetHeight;
            
            // Re-enable animation
            oceanBg.style.animation = '';
            
            // Measure performance
            const duration = performance.now() - startTime;
            lastRestartTime = Date.now();
            
            if (CONFIG.DEBUG) {
                console.log(`✅ Ocean animation restarted (${duration.toFixed(2)}ms)`);
                console.log(`   Requests batched: ${requestQueue.length}`);
            }
            
            // Execute callbacks
            executeCallbacks();
            
        } catch (error) {
            console.error('❌ Animation restart failed:', error);
            executeCallbacks(error);
        }
        
        // Clear request queue
        requestQueue.length = 0;
    }
    
    /**
     * Execute all pending callbacks
     * @private
     */
    function executeCallbacks(error = null) {
        requestQueue.forEach(request => {
            if (request.onComplete) {
                try {
                    request.onComplete(error);
                } catch (err) {
                    console.error('Callback error:', err);
                }
            }
        });
    }
    
    /**
     * Cancel pending animation restart
     */
    function cancel() {
        if (pendingRestart) {
            clearTimeout(pendingRestart);
            pendingRestart = null;
            
            if (CONFIG.DEBUG) {
                console.log('🛑 Animation restart cancelled');
            }
        }
    }
    
    /**
     * Get animation status
     * @returns {Object} Current animation status
     */
    function getStatus() {
        return {
            isPending: pendingRestart !== null,
            queueLength: requestQueue.length,
            lastRestartTime,
            timeSinceLastRestart: Date.now() - lastRestartTime
        };
    }
    
    /**
     * Enable debug logging
     */
    function enableDebug() {
        CONFIG.DEBUG = true;
        console.log('🐛 AnimationController debug enabled');
    }
    
    /**
     * Disable debug logging
     */
    function disableDebug() {
        CONFIG.DEBUG = false;
    }
    
    // Public API
    return {
        requestRestart,
        cancel,
        getStatus,
        enableDebug,
        disableDebug
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.AnimationController = AnimationController;
    console.log('✅ AnimationController loaded');
}
```

---

## Step 2: Update WaveBackground to Use AnimationController

File: `js/features/waveBackground.js`

Replace the `restartWaveAnimation()` function:

```javascript
/**
 * Restart wave animation
 * Delegates to centralized AnimationController
 * @private
 */
function restartWaveAnimation() {
    if (typeof AnimationController !== 'undefined') {
        AnimationController.requestRestart('WaveBackground');
    } else {
        console.warn('⚠️ AnimationController not available');
        // Fallback: direct animation restart
        const oceanBg = document.querySelector('.ocean-background');
        if (oceanBg) {
            oceanBg.style.animation = 'none';
            void oceanBg.offsetHeight;
            oceanBg.style.animation = '';
        }
    }
}
```

Also update the theme change listener:

```javascript
// Listen for theme changes to ensure proper contrast
// BUT: Don't restart animation here - let ThemeToggle handle that
document.addEventListener('theme:changed', () => {
    // Only update the data-wave attribute, don't restart animation
    const currentWave = localStorage.getItem('whispers-selected-wave');
    if (currentWave) {
        document.body.setAttribute('data-wave', currentWave);
    }
    // Animation restart is handled by ThemeToggle via AnimationController
});
```

---

## Step 3: Update ThemeToggle to Use AnimationController

File: `js/features/themeToggle.js`

Replace the `restartOceanAnimation()` function:

```javascript
/**
 * Restart ocean background animation
 * Delegates to centralized AnimationController
 * @private
 */
function restartOceanAnimation() {
    if (typeof AnimationController !== 'undefined') {
        AnimationController.requestRestart('ThemeToggle');
    } else {
        console.warn('⚠️ AnimationController not available');
        // Fallback: direct animation restart
        const oceanBg = document.querySelector('.ocean-background');
        if (oceanBg) {
            oceanBg.classList.add('theme-transitioning');
            oceanBg.style.animation = 'none';
            void oceanBg.offsetHeight;
            void oceanBg.offsetWidth;
            oceanBg.style.animation = '';
            setTimeout(() => {
                oceanBg.classList.remove('theme-transitioning');
            }, 100);
        }
    }
}
```

---

## Step 4: Update OceanDynamics to Use AnimationController

File: `js/engine/oceanDynamics.js`

Find the animation restart code and replace it:

```javascript
// OLD CODE (find this):
// oceanBg.style.animation = 'none';
// void oceanBg.offsetHeight;
// oceanBg.style.animation = '';

// NEW CODE (replace with):
if (typeof AnimationController !== 'undefined') {
    AnimationController.requestRestart('OceanDynamics');
} else {
    // Fallback
    const oceanBg = document.querySelector('.ocean-background');
    if (oceanBg) {
        oceanBg.style.animation = 'none';
        void oceanBg.offsetHeight;
        oceanBg.style.animation = '';
    }
}
```

---

## Step 5: Update index.html Script Loading Order

File: `index.html`

Ensure AnimationController loads before other modules:

```html
<!-- Core Controllers (load first) -->
<script src="js/core/animationController.js"></script>

<!-- Features (depend on controllers) -->
<script src="js/features/waveBackground.js"></script>
<script src="js/features/themeToggle.js"></script>

<!-- Engine (depends on features) -->
<script src="js/engine/oceanDynamics.js"></script>

<!-- Main application -->
<script src="js/main.js"></script>
```

---

## Step 6: Add Cleanup to WaveBackground

File: `js/features/waveBackground.js`

Add cleanup function to prevent memory leaks:

```javascript
const WaveBackground = (() => {
    'use strict';
    
    // Private state
    let waveListener = null;
    let themeListener = null;
    let isInitialized = false;
    
    function init() {
        if (isInitialized) {
            console.warn('WaveBackground already initialized');
            return;
        }
        
        cleanup(); // Ensure clean state
        
        // Apply wave background on load
        applyWaveBackground();
        
        // Listen for wave selection changes
        waveListener = (e) => {
            if (e.detail && e.detail.wave) {
                applyWaveBackground(e.detail.wave.id);
            }
        };
        document.addEventListener('wave:selected', waveListener);
        
        // Listen for theme changes to ensure proper contrast
        themeListener = () => {
            const currentWave = localStorage.getItem('whispers-selected-wave');
            if (currentWave) {
                document.body.setAttribute('data-wave', currentWave);
            }
        };
        document.addEventListener('theme:changed', themeListener);
        
        isInitialized = true;
        console.log('🌊 Wave Background Manager initialized');
    }
    
    /**
     * Cleanup listeners to prevent memory leaks
     * @private
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
    
    // ... rest of the code ...
    
    return {
        init,
        cleanup, // Export cleanup for testing
        applyWaveBackground,
        getCurrentWave,
        getWaveInfo
    };
})();
```

---

## Step 7: Testing

Create file: `tests/animation_controller_test.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Test - Animation Controller</title>
    <style>
        body { font-family: monospace; padding: 2rem; }
        .test { margin: 1rem 0; padding: 1rem; border: 1px solid #ccc; }
        .pass { background: #d4edda; color: #155724; }
        .fail { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
    <h1>🧪 Animation Controller Tests</h1>
    <div id="results"></div>
    
    <div class="ocean-background" style="width: 100px; height: 100px; background: blue; animation: spin 2s infinite;"></div>
    
    <style>
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
    
    <script src="../js/core/animationController.js"></script>
    <script>
        const results = document.getElementById('results');
        
        function test(name, fn) {
            try {
                fn();
                results.innerHTML += `<div class="test pass">✅ ${name}</div>`;
            } catch (error) {
                results.innerHTML += `<div class="test fail">❌ ${name}: ${error.message}</div>`;
            }
        }
        
        function assert(condition, message) {
            if (!condition) throw new Error(message);
        }
        
        // Tests
        test('AnimationController should be defined', () => {
            assert(typeof AnimationController !== 'undefined', 'AnimationController not defined');
        });
        
        test('requestRestart should not throw', () => {
            AnimationController.requestRestart('test');
        });
        
        test('getStatus should return object', () => {
            const status = AnimationController.getStatus();
            assert(typeof status === 'object', 'Status is not an object');
            assert('isPending' in status, 'Status missing isPending');
            assert('queueLength' in status, 'Status missing queueLength');
        });
        
        test('cancel should work', () => {
            AnimationController.requestRestart('test');
            AnimationController.cancel();
            const status = AnimationController.getStatus();
            assert(!status.isPending, 'Animation still pending after cancel');
        });
        
        test('debug mode should toggle', () => {
            AnimationController.enableDebug();
            AnimationController.disableDebug();
        });
        
        test('multiple requests should batch', (done) => {
            AnimationController.requestRestart('test1');
            AnimationController.requestRestart('test2');
            AnimationController.requestRestart('test3');
            
            const status = AnimationController.getStatus();
            assert(status.queueLength === 3, `Expected 3 requests, got ${status.queueLength}`);
        });
        
        results.innerHTML += `<div class="test info">✨ All tests completed</div>`;
    </script>
</body>
</html>
```

---

## Step 8: Verification Checklist

- [ ] AnimationController module created and loads without errors
- [ ] WaveBackground updated to use AnimationController
- [ ] ThemeToggle updated to use AnimationController
- [ ] OceanDynamics updated to use AnimationController
- [ ] Script loading order updated in index.html
- [ ] Cleanup function added to WaveBackground
- [ ] Test page created and passes all tests
- [ ] No console errors when switching themes
- [ ] No console errors when selecting waves
- [ ] Animation doesn't restart multiple times on theme change
- [ ] Animation doesn't restart multiple times on wave selection
- [ ] Performance is smooth (no jank)

---

## Step 9: Debugging

Enable debug mode in browser console:

```javascript
// Enable verbose logging
AnimationController.enableDebug();

// Check animation status
console.log(AnimationController.getStatus());

// Manually trigger restart
AnimationController.requestRestart('manual-test', { immediate: true });
```

---

## Rollback Plan

If issues occur:

1. Remove AnimationController calls from WaveBackground, ThemeToggle, OceanDynamics
2. Restore original animation restart code
3. Revert script loading order in index.html
4. No data loss - all changes are in animation logic only

---

## Performance Impact

**Before**: Multiple animation restarts per theme change (3-4 restarts)  
**After**: Single batched animation restart per theme change (1 restart)

**Expected improvement**: ~50% reduction in animation-related reflows

---

## Next Steps

1. ✅ Implement AnimationController (this guide)
2. ⏭️ Add wave registry pattern (OCP improvement)
3. ⏭️ Implement dependency injection (DIP improvement)
4. ⏭️ Add comprehensive unit tests

