
// Constants
const CONFIG = {
    API_KEY_PLACEHOLDER: 'YOUR_API_KEY_HERE',
    API_KEY_URL: 'https://makersuite.google.com/app/apikey'
};

const STORAGE_KEYS = {
    SELECTED_WAVE: 'whispers-selected-wave',
    LANGUAGE: 'whispers-language',
    CONVERSATION_HISTORY: 'whispers-conversation-history',
    STATE: 'whispers-state',
    SPLASH_SEEN: 'whispers-splash-seen',
    GOTO_WAVE_SELECTION: 'whispers-goto-wave-selection'
};

// Service instances (module-scoped, Singleton pattern)
let geminiServiceInstance = null;
let adaptiveAssistanceInstance = null;

function getGeminiService() {
    if (!geminiServiceInstance) {
        geminiServiceInstance = GeminiService.getInstance();
        validateApiKey();
    }
    return geminiServiceInstance;
}

function getAdaptiveAssistance() {
    if (!adaptiveAssistanceInstance && typeof AdaptiveAssistance !== 'undefined') {
        const stateClassifier = new StateClassifier();
        const responsePatterns = new ResponsePatterns();
        adaptiveAssistanceInstance = new AdaptiveAssistance(stateClassifier, responsePatterns);
    }
    return adaptiveAssistanceInstance;
}

function getApplicationState() {
    if (typeof AppFacade !== 'undefined' && typeof AppFacade.getState === 'function') {
        return AppFacade.getState();
    }
    if (typeof getState === 'function') {
        return getState();
    }
    return { conversationHistory: [], isProcessing: false };
}

function validateApiKey() {
    if (geminiServiceInstance.apiKey === CONFIG.API_KEY_PLACEHOLDER) {
        console.warn('⚠️ Please configure your Gemini API key in js/services/geminiService.js');
        console.log(`Get your API key from: ${CONFIG.API_KEY_URL}`);
    }
}

function init() {
    const endTiming = typeof PerformanceMonitor !== 'undefined'
        ? PerformanceMonitor.time('app_initialization')
        : () => { };

    try {
        if (typeof Logger !== 'undefined') {
            Logger.info('App', 'Initializing Whispers of the Wave');
        }

        // Check if splash screen should be shown
        const shouldShowSplash = !localStorage.getItem('whispers-selected-wave');

        if (shouldShowSplash) {
            if (typeof Logger !== 'undefined') {
                Logger.info('App', 'Showing splash screen');
            }
            // Splash screen will handle initialization after wave selection
            endTiming({ splashShown: true });
            return;
        }

        initializeState();
        initializeServices();
        setupEventListeners();
        updateInitialUI();
        updateAchievementCounter();

        // Initialize suggestions
        initializeSuggestions();

        // Scroll message display to top at start
        const messageDisplay = document.getElementById('messageDisplay');
        if (messageDisplay) {
            messageDisplay.scrollTop = 0;
        }

        // Lazy load non-critical features
        if (typeof LazyLoadManager !== 'undefined') {
            LazyLoadManager.loadModules([
                { path: 'js/features/conversationTags.js', name: 'conversationTags' },
                { path: 'js/features/historyExport.js', name: 'historyExport' },
                { path: 'js/features/historySearch.js', name: 'historySearch' }
            ]).catch(err => {
                if (typeof Logger !== 'undefined') {
                    Logger.warn('App', 'Failed to lazy load features', { error: err.message });
                }
            });
        }

        if (typeof Logger !== 'undefined') {
            Logger.info('App', 'Application ready');
        }

        endTiming({ success: true });
    } catch (error) {
        if (typeof Logger !== 'undefined') {
            Logger.error('App', 'Initialization failed', { error: error.message });
        }
        displayInitializationError(error);
        endTiming({ success: false, error: error.message });
    }
}

function initializeState() {
    // Load state from localStorage if AppFacade is available
    if (typeof AppFacade !== 'undefined' && typeof AppFacade.loadState === 'function') {
        AppFacade.loadState();
    } else if (typeof loadFromLocalStorage === 'function') {
        loadFromLocalStorage();
    }

    // Log storage stats
    if (typeof StorageOptimizer !== 'undefined' && typeof Logger !== 'undefined') {
        const stats = StorageOptimizer.getStats();
        Logger.debug('Storage', 'Current usage', stats);
    }
}

function handleError(context, error, options = {}) {
    // Log error
    if (typeof Logger !== 'undefined') {
        Logger.error(context, error.message, { stack: error.stack });
    } else {
        console.error(`[${context}]`, error);
    }
    
    // Show UI message if requested
    if (options.showUI && typeof AppFacade !== 'undefined') {
        AppFacade.displayMessage({
            whisper: '🌊 Las olas encuentran resistencia...',
            wave: options.userMessage || 'Por favor, intenta de nuevo.',
            persona: 'kiro'
        });
    }
}

function initializeServices() {
    const service = getGeminiService();
    
    // Show demo mode indicator if no API key
    if (service && service.isDemoMode && service.isDemoMode()) {
        const demoIndicator = document.getElementById('demoModeIndicator');
        if (demoIndicator) {
            demoIndicator.classList.remove('hidden');
        }
        console.log('🎮 Running in DEMO MODE - Configure API key for full experience');
    }
}

function updateInitialUI() {
    // Get state safely using helper function
    const state = getApplicationState();
    
    // Update mode indicator if available
    if (typeof AppFacade !== 'undefined' && typeof AppFacade.updateModeIndicator === 'function') {
        AppFacade.updateModeIndicator(state.currentMode, state.currentPersona);
    } else if (typeof updateModeIndicator === 'function') {
        updateModeIndicator(state.currentMode, state.currentPersona);
    }
}

function displayInitializationError(error) {
    const messageDisplay = document.getElementById('messageDisplay');
    if (messageDisplay) {
        messageDisplay.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">🌊</p>
                <p style="margin-bottom: 0.5rem;">The ocean is temporarily unavailable.</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Error: ${error.message}</p>
                <p style="margin-top: 1rem;">Please refresh the page to try again.</p>
            </div>
        `;
    }
}

function handleInputKeyPress(e) {
    if (e.key !== 'Enter') return;

    const state = getApplicationState();
    if (state.isProcessing) return;

    const message = e.target.value.trim();
    if (message) {
        handleUserMessage(message);
    }
}

function setupEventListeners() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const ttsToggle = document.getElementById('ttsToggle');
    const backToStartBtn = document.getElementById('backToStartBtn');

    if (!userInput) {
        throw new Error('User input element not found');
    }

    // Input events
    userInput.addEventListener('keypress', handleInputKeyPress);

    // Send button
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const message = userInput.value.trim();
            if (message) {
                handleUserMessage(message);
                userInput.value = ''; // Clear input after sending
                userInput.focus(); // Keep focus on input
            }
        });
    } else {
        console.warn('Send button not found - users can still press Enter');
    }

    // TTS Toggle
    if (ttsToggle) {
        ttsToggle.addEventListener('click', toggleTTS);
    }

    // Back to Start button
    if (backToStartBtn) {
        backToStartBtn.addEventListener('click', handleBackToStart);
    }

    userInput.focus();
}

function handleBackToStart() {
    // Use custom modal instead of browser confirm
    if (typeof ModalUI !== 'undefined' && typeof i18n !== 'undefined') {
        ModalUI.showConfirm({
            title: i18n.t('modals.changeWaveTitle'),
            message: i18n.t('modals.changeWaveMessage'),
            confirmText: i18n.t('modals.changeWaveConfirm'),
            cancelText: i18n.t('modals.changeWaveCancel'),
            onConfirm: () => {
                performWaveChange();
            }
        });
    } else {
        // Fallback to browser confirm
        const confirmed = confirm('¿Quieres cambiar de ola? Se perderá la conversación actual.');
        if (confirmed) {
            performWaveChange();
        }
    }
}

function performWaveChange() {
    // Clear conversation state but keep splash seen flag
    localStorage.removeItem(STORAGE_KEYS.SELECTED_WAVE);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STATE);

    // Clear expression analyzer history
    if (typeof ExpressionAnalyzer !== 'undefined') {
        ExpressionAnalyzer.clearHistory();
    }

    // Clear achievement system
    if (typeof AchievementSystem !== 'undefined') {
        AchievementSystem.reset();
    }

    // Clear ocean dynamics
    if (typeof OceanDynamics !== 'undefined') {
        OceanDynamics.reset();
    }

    // Hide main container
    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'none';
    }

    // Hide fixed controls
    const controlsLeft = document.querySelector('.fixed-controls-left');
    const controlsRight = document.querySelector('.fixed-controls-right');
    if (controlsLeft) controlsLeft.style.display = 'none';
    if (controlsRight) controlsRight.style.display = 'none';

    // Show splash screen with wave selection
    if (typeof SplashScreen !== 'undefined') {
        // Check if splash already exists
        let splashContainer = document.getElementById('splashScreen');
        if (!splashContainer) {
            // Create new splash
            SplashScreen.init();
        }

        // Show splash and go to wave selection
        splashContainer = document.getElementById('splashScreen');
        if (splashContainer) {
            splashContainer.classList.add('active');
            splashContainer.style.display = 'flex';
        }

        // Go directly to wave selection
        setTimeout(() => {
            SplashScreen.showWaveSelection();
        }, 100);
    } else {
        // Fallback: reload page
        localStorage.setItem('whispers-goto-wave-selection', 'true');
        window.location.reload();
    }
}

function toggleTTS() {
    const ttsToggle = document.getElementById('ttsToggle');
    if (!ttsToggle) {
        console.warn('TTS toggle button not found');
        return;
    }

    // Check if audio functions are available
    const hasAudioService = typeof playTextToSpeech !== 'undefined';
    if (!hasAudioService) {
        console.warn('⚠️ TTS not available - AudioService not loaded');
        ttsToggle.disabled = true;
        ttsToggle.title = 'TTS no disponible';
        return;
    }

    // Toggle TTS state using global audioState
    if (typeof window.audioState === 'undefined') {
        window.audioState = { ttsEnabled: false };
    }
    window.audioState.ttsEnabled = !window.audioState.ttsEnabled;

    // Update button visual state and icon
    const ttsIcon = ttsToggle.querySelector('.tts-icon');
    if (window.audioState.ttsEnabled) {
        ttsToggle.classList.add('active');
        ttsToggle.title = 'Desactivar lectura automática';
        if (ttsIcon) ttsIcon.textContent = '🔊';
    } else {
        ttsToggle.classList.remove('active');
        ttsToggle.title = 'Activar lectura automática';
        if (ttsIcon) ttsIcon.textContent = '🔇';

        // Stop any playing audio
        if (typeof stopAudio !== 'undefined') {
            stopAudio();
        }
    }
}

/**
 * Update the existing welcome message with wave-specific text
 * @param {Object} wave - Wave object with name property
 * @returns {void}
 */
function updateWelcomeMessage(wave) {
    const existingWelcome = document.querySelector('.welcome-message');
    if (!existingWelcome) return;
    
    // Update whisper text
    const whisperEl = existingWelcome.querySelector('.whisper');
    if (whisperEl && typeof i18n !== 'undefined') {
        whisperEl.textContent = i18n.t('ui.welcome');
    }
    
    // Update wave reflection with persona name
    const waveReflection = existingWelcome.querySelector('.wave-reflection');
    if (waveReflection) {
        const waveName = wave?.name || (typeof i18n !== 'undefined' 
            ? i18n.t('personas.guardian') 
            : 'El Guardián de la Ola');
        
        const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'es';
        const welcomeText = typeof i18n !== 'undefined' 
            ? i18n.t('ui.welcomeMessage')
            : { es: 'Comparte lo que llevas dentro, y las olas reflejarán tu verdad.',
                en: 'Share what you carry within, and the waves will reflect your truth.',
                ro: 'Împărtășește ce porți înăuntru, și valurile vor reflecta adevărul tău.'
              }[lang] || 'Comparte lo que llevas dentro, y las olas reflejarán tu verdad.';
        
        waveReflection.textContent = `${waveName}. ${welcomeText}`;
    }
}

/**
 * Show main application UI after wave selection
 */
function showMainUI() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'flex';
    }

    const controlsLeft = document.querySelector('.fixed-controls-left');
    const controlsRight = document.querySelector('.fixed-controls-right');
    if (controlsLeft) controlsLeft.style.display = 'flex';
    if (controlsRight) controlsRight.style.display = 'flex';
}

// Listen for wave selection event
document.addEventListener('wave:selected', (e) => {
    // Small delay to allow splash screen to fade out
    setTimeout(() => {
        showMainUI();

        // Update existing welcome message with wave-specific persona (don't create new one)
        if (e.detail?.wave) {
            updateWelcomeMessage(e.detail.wave);
        }
        
        // Clear message display for fresh conversation
        const messageDisplay = document.getElementById('messageDisplay');
        if (messageDisplay) {
            messageDisplay.innerHTML = '';
        }

        initializeState();
        initializeServices();
        setupEventListeners();
        updateInitialUI();
        updateAchievementCounter();

        // Initialize suggestions after app is ready
        initializeSuggestions();

        // Scroll message display to top at start
        if (messageDisplay) {
            messageDisplay.scrollTop = 0;
        }

    }, 100);
});

// Listen for achievement unlocks to update counter
document.addEventListener('achievement:unlocked', () => {
    updateAchievementCounter();
});

function updateAchievementCounter() {
    const counterEl = document.getElementById('achievementCount');
    if (counterEl && typeof AchievementSystem !== 'undefined') {
        const stats = AchievementSystem.getStatistics();
        counterEl.textContent = `${stats.unlocked}/${stats.total}`;
    }
}

function initializeSuggestions() {
    const container = document.getElementById('suggestionsContainer');
    if (!container) {
        console.warn('Suggestions container not found');
        return;
    }

    // Get state safely
    const state = typeof AppFacade !== 'undefined' && typeof AppFacade.getState === 'function'
        ? AppFacade.getState()
        : (typeof getState === 'function' ? getState() : {});
    
    const hasHistory = state.conversationHistory && state.conversationHistory.length > 0;

    if (!hasHistory && typeof SuggestionsModule !== 'undefined') {
        // Show initial suggestions
        SuggestionsModule.displayInitial(container);
    } else if (hasHistory && typeof OceanDynamics !== 'undefined') {
        // Show contextual suggestions based on ocean state
        const oceanState = OceanDynamics.getCurrentState();
        if (oceanState && typeof SuggestionsModule !== 'undefined') {
            SuggestionsModule.displayContextual(oceanState.id, container);
        }
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

async function handleUserMessage(message) {
    if (!message || message.trim().length === 0) {
        return;
    }

    const state = AppFacade.getState();

    if (state.isProcessing) {
        return;
    }

    AppFacade.setState({ isProcessing: true });

    try {
        // Display user message and prepare UI
        AppFacade.displayUserMessage(message);
        AppFacade.clearInput();
        AppFacade.showTypingIndicator();

        // Initialize adaptive assistance system
        const stateClassifier = new StateClassifier();
        const responsePatterns = new ResponsePatterns();
        const adaptiveAssistance = new AdaptiveAssistance(stateClassifier, responsePatterns);

        // Check for Life Questioning mode activation
        const shouldActivateLifeQuestioning = AppFacade.detectLifeQuestioningTrigger(message);
        let lifeQuestioningState = AppFacade.getLifeQuestioningState();

        if (shouldActivateLifeQuestioning && !lifeQuestioningState.active) {
            AppFacade.startLifeQuestioningSession('purpose');
            lifeQuestioningState = AppFacade.getLifeQuestioningState();
        }

        // Analyze emotional context
        const emotionalAnalysis = AppFacade.analyzeEmotionalTone(message);

        // Analyze journey completion
        let journeyAnalysis = null;
        if (typeof JourneyCompletion !== 'undefined') {
            const journeyCompletion = JourneyCompletion.getInstance();
            const oceanState = typeof OceanDynamics !== 'undefined' ? OceanDynamics.getCurrentState()?.id : null;

            // Get latest expression metrics from history
            let expressionMetrics = null;
            if (typeof ExpressionAnalyzer !== 'undefined' && ExpressionAnalyzer.history && ExpressionAnalyzer.history.length > 0) {
                const latestMetrics = ExpressionAnalyzer.history[ExpressionAnalyzer.history.length - 1];
                expressionMetrics = {
                    clarity: latestMetrics.clarity,
                    specificity: latestMetrics.specificity,
                    emotionalAwareness: latestMetrics.emotionalAwareness
                };
            }

            journeyAnalysis = journeyCompletion.analyzeCompletion(message, {
                oceanState,
                expressionMetrics
            });
        }

        // Get selected wave
        const selectedWave = localStorage.getItem('whispers-selected-wave') || 'calm';

        // Enhance conversation context with detailed analysis
        let enhancedContext = {};
        if (typeof ConversationEnhancer !== 'undefined') {
            enhancedContext = ConversationEnhancer.analyzeContext(message, state.conversationHistory || []);
        }

        // Build conversation context
        const conversationContext = {
            history: state.conversationHistory || [],
            emotionalContext: emotionalAnalysis,
            currentPersona: AppFacade.getCurrentPersona(),
            stateHistory: state.stateHistory || [],
            lifeQuestioningState: lifeQuestioningState,
            journeyAnalysis: journeyAnalysis,
            selectedWave: selectedWave,
            enhancedContext: enhancedContext
        };

        // Use adaptive assistance system to process message
        const adaptiveResponse = await adaptiveAssistance.process(message, conversationContext);

        AppFacade.hideTypingIndicator();

        // Validate adaptive response structure
        if (!adaptiveResponse || typeof adaptiveResponse !== 'object') {
            console.error('❌ Invalid adaptive response structure:', adaptiveResponse);
            AppFacade.displayMessage({
                whisper: '🌊 El océano necesita un momento para reflexionar.',
                wave: 'Por favor, intenta de nuevo.',
                persona: 'kiro'
            });
            return;
        }

        // Handle error responses
        if (adaptiveResponse.text &&
            (adaptiveResponse.text.whisper?.startsWith('ERROR:') ||
                adaptiveResponse.text.whisper?.includes('ocean needs a moment'))) {
            AppFacade.displayMessage({
                whisper: adaptiveResponse.text.whisper || '🌊 El océano reflexiona...',
                wave: 'Por favor, intenta de nuevo.',
                persona: 'kiro'
            });
            return;
        }

        // Handle Life Questioning session progression
        if (lifeQuestioningState.active) {
            const nextStep = AppFacade.processLifeQuestioningResponse(message);

            if (nextStep && nextStep.type === 'session_end') {
                const summaryScene = {
                    whisper: nextStep.summary.emotional_summary,
                    wave: nextStep.summary.suggested_action + '\n\n' + nextStep.summary.continuation_question,
                    persona: 'life_questioning',
                    timestamp: Date.now()
                };

                AppFacade.displayMessage(summaryScene, 'msg-' + Date.now());
                AppFacade.resetLifeQuestioningState();
                AppFacade.setState({ isProcessing: false });
                return;
            }
        }

        // Create and display scene from adaptive response
        const scene = {
            whisper: adaptiveResponse.text.whisper || '',
            wave: adaptiveResponse.text.reflection || '',
            persona: adaptiveResponse.persona,
            timestamp: Date.now()
        };

        const messageId = 'msg-' + Date.now();
        AppFacade.displayMessage(scene, messageId);

        // Auto-play TTS if enabled (via event bus for loose coupling)
        const fullText = (scene.whisper || '') + ' ' + (scene.wave || '');
        if (fullText.trim()) {
            // Emit event for TTS system to handle
            if (typeof emit !== 'undefined') {
                emit('message:displayed', {
                    messageId,
                    text: fullText.trim(),
                    scene
                });
            }
        }

        // Generate AI-powered contextual suggestions based on conversation
        const container = document.getElementById('suggestionsContainer');
        if (container && typeof SuggestionsModule !== 'undefined') {
            const aiResponse = `${scene.whisper} ${scene.wave}`.trim();
            SuggestionsModule.updateWithContextual(aiResponse, message, container);
        }

        // Update conversation history with state information
        const history = [...conversationContext.history];
        history.push({
            role: 'user',
            content: message,
            timestamp: Date.now(),
            state: adaptiveResponse.mode,
            classification: {
                state: adaptiveResponse.mode,
                action: adaptiveResponse.action
            }
        });

        history.push({
            role: 'assistant',
            content: JSON.stringify(adaptiveResponse.text),
            scene: scene,
            timestamp: Date.now(),
            state: adaptiveResponse.mode,
            action: adaptiveResponse.action
        });

        AppFacade.setState({
            conversationHistory: history,
            emotionalContext: emotionalAnalysis,
            stateHistory: adaptiveAssistance.stateHistory || []
        });

        // Progress conversation (persona switching, turn counting)
        if (!lifeQuestioningState.active) {
            AppFacade.switchPersona();
            AppFacade.incrementTurnCount();
        }

        // Analyze expression metrics
        if (typeof ExpressionAnalyzer !== 'undefined') {
            const lang = localStorage.getItem('whispers-language') || 'es';
            const metrics = ExpressionAnalyzer.analyze(message, lang);

            // Update UI
            if (typeof ExpressionMetricsUI !== 'undefined') {
                ExpressionMetricsUI.update(metrics);
            }

            // Check for achievements
            if (typeof AchievementSystem !== 'undefined') {
                const achievementStats = {
                    totalMessages: history.length / 2, // Divide by 2 (user + AI)
                    maxClarity: Math.max(...ExpressionAnalyzer.getHistory().map(m => m.clarity)),
                    maxSpecificity: Math.max(...ExpressionAnalyzer.getHistory().map(m => m.specificity)),
                    maxEmotionalAwareness: Math.max(...ExpressionAnalyzer.getHistory().map(m => m.emotionalAwareness)),
                    maxOverall: Math.max(...ExpressionAnalyzer.getHistory().map(m => m.overall)),
                    averageOverall: ExpressionAnalyzer.getHistory().reduce((sum, m) => sum + m.overall, 0) / ExpressionAnalyzer.getHistory().length,
                    improvement: ExpressionAnalyzer.getImprovementTrend().improvement,
                    currentLevel: ExpressionAnalyzer.getCurrentLevel().level,
                    statesReached: state.statesReached || [],
                    selectedWave: state.selectedWave?.id || localStorage.getItem('whispers-selected-wave')
                };

                const newAchievements = AchievementSystem.check(achievementStats);
            }
        }

        // Update ocean dynamics based on conversation
        if (typeof OceanDynamics !== 'undefined') {
            const oceanState = OceanDynamics.updateFromConversation(message, adaptiveResponse, conversationContext);

            // Track states reached for achievements
            const currentState = AppFacade.getState();
            const statesReached = currentState.statesReached || [];
            if (!statesReached.includes(oceanState)) {
                statesReached.push(oceanState);
                AppFacade.setState({ statesReached });
            }
        }

        // Update UI indicators
        const newPersona = AppFacade.getCurrentPersona();
        AppFacade.updateModeIndicator(adaptiveResponse.mode || state.currentMode || 'default', newPersona);

    } catch (error) {
        console.error('❌ Error handling message:', error);
        console.error('Stack trace:', error.stack);

        AppFacade.hideTypingIndicator();

        // Provide more specific error messages
        let errorMessage = 'El océano necesita un momento. ¿Intentamos de nuevo?';

        if (error.message && error.message.includes('API')) {
            errorMessage = 'La conexión con el océano se ha interrumpido. Verifica tu conexión.';
        } else if (error.message && error.message.includes('timeout')) {
            errorMessage = 'El océano tardó demasiado en responder. Intenta de nuevo.';
        }

        AppFacade.displayMessage({
            whisper: '🌊 Las olas encuentran resistencia...',
            wave: errorMessage,
            persona: 'kiro'
        });
    } finally {
        AppFacade.setState({ isProcessing: false });
    }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}