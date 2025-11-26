const CACHE_NAME = 'waves-v1';
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
    './js/core/lazyLoader.js',
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
    './js/core/eventBus.js',

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

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event - Cleanup Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Network First, then Cache (for API) or Cache First (for assets)
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like Gemini API) from caching logic if needed, 
    // or handle them specifically. For now, we focus on local assets.
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache Hit - Return response
                if (response) {
                    return response;
                }

                // Clone the request because it's a stream and can only be consumed once
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
