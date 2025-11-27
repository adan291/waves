/**
 * Service Worker for Whispers of the Wave
 * Implements PWA caching strategy for offline capability
 * 
 * Strategy:
 * - Install: Cache all critical assets
 * - Activate: Clean up old caches
 * - Fetch: Cache-first for local assets, network-only for API calls
 * 
 * @version 1.0.0
 */

// Configuration
const CACHE_VERSION = 3;
const CACHE_NAME = `waves-v${CACHE_VERSION}`;

// Critical assets to cache on install
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',

    // CSS
    './css/core.css',
    './css/components.css',
    './css/animations.css',
    './css/responsive.css',
    './css/waves.css',

    // Core Infrastructure
    './js/utils/debounce.js',
    './js/core/logger.js',
    './js/core/cache.js',
    './js/core/performance.js',
    './js/core/storageOptimizer.js',
    './js/core/lazyLoadManager.js',
    './js/config.performance.js',

    // i18n
    './js/i18n/translations.js',
    './js/i18n/i18n-ui.js',

    // Core Modules
    './js/core/state.js',
    './js/core/events.js',
    './js/core/errorHandler.js',
    './js/core/journeyCompletion.js',
    './js/core/appFacade.js',
    './js/core/inputValidator.js',
    './js/core/htmlSanitizer.js',

    // Services
    './js/services/geminiService.js',
    './js/services/audioService.js',

    // Engine
    './js/engine/parser.js',
    './js/engine/personas.js',
    './js/engine/emotional.js',
    './js/engine/narrative.js',
    './js/engine/life_questions.js',
    './js/engine/oceanDynamics.js',
    './js/engine/expressionAnalyzer.js',
    './js/engine/achievementSystem.js',

    // Prompts
    './js/prompts/adaptivePrompts.js',

    // Adaptive Assistance
    './js/core/stateClassifier.js',
    './js/core/responsePatterns.js',
    './js/core/responseValidator.js',
    './js/core/conversationEnhancer.js',
    './js/core/adaptiveAssistance.js',

    // UI
    './js/ui/modal.js',
    './js/ui/renderer.js',
    './js/ui/controls.js',
    './js/ui/suggestions.js',
    './js/ui/oceanStateUI.js',
    './js/ui/expressionMetricsUI.js',
    './js/ui/achievementUI.js',
    './js/ui/reportUI.js',
    './js/ui/toastNotifications.js',
    './js/ui/statsUI.js',

    // Features
    './js/features/splashScreen.js',
    './js/features/waveBackground.js',
    './js/features/languageSelector.js',
    './js/features/themeToggle.js',
    './js/features/integration.js',

    // Main
    './js/main.js'
];

/**
 * Install Event Handler
 * Caches all critical assets for offline use
 * Uses skipWaiting() to activate immediately
 * 
 * @param {ExtendableEvent} event - Install event
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
                throw error;
            })
    );
});

/**
 * Activate Event Handler
 * Cleans up old caches and takes control of all clients
 * 
 * @param {ExtendableEvent} event - Activate event
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Delete all caches except current version
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('[Service Worker] Activation failed:', error);
                throw error;
            })
    );
});

/**
 * Fetch Event Handler
 * Implements Cache-First strategy for local assets
 * Skips cross-origin requests (e.g., Gemini API)
 * 
 * Strategy:
 * 1. Check cache first
 * 2. If not in cache, fetch from network
 * 3. Cache valid responses for future use
 * 
 * @param {FetchEvent} event - Fetch event
 */
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like Gemini API)
    // These should always go to network
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Cache hit - return cached response
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Cache miss - fetch from network
                return fetchAndCache(event.request);
            })
            .catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);
                // Could return a fallback page here
                throw error;
            })
    );
});

/**
 * Fetch from network and cache the response
 * Follows best practices for request/response cloning
 * 
 * @param {Request} request - Original request
 * @returns {Promise<Response>} Network response
 */
function fetchAndCache(request) {
    // Clone request (can only be consumed once)
    const fetchRequest = request.clone();

    return fetch(fetchRequest)
        .then((response) => {
            // Validate response before caching
            if (!isValidResponse(response)) {
                return response;
            }

            // Clone response (can only be consumed once)
            const responseToCache = response.clone();

            // Cache asynchronously (don't block response)
            caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseToCache))
                .catch((error) => {
                    console.warn('[Service Worker] Failed to cache:', error);
                });

            return response;
        });
}

/**
 * Validate if response should be cached
 * 
 * @param {Response} response - Response to validate
 * @returns {boolean} True if response is valid for caching
 */
function isValidResponse(response) {
    return response 
        && response.status === 200 
        && response.type === 'basic';
}
