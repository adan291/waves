
// Constants
const CONFIG = {
    API_KEY_PLACEHOLDER: 'YOUR_API_KEY_HERE',
    API_KEY_URL: 'https://makersuite.google.com/app/apikey'
};

// Service instance (module-scoped)
let geminiServiceInstance = null;

function getGeminiService() {
    if (!geminiServiceInstance) {
        geminiServiceInstance = GeminiService.getInstance();
        validateApiKey();
    }
    return geminiServiceInstance;
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

        // Lazy load non-critical features
        if (typeof LazyLoader !== 'undefined') {
            LazyLoader.preload('features');
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
    if (typeof loadFromLocalStorage === 'function') {
        loadFromLocalStorage();
    }

    // Log storage stats
    if (typeof StorageOptimizer !== 'undefined' && typeof Logger !== 'undefined') {
        const stats = StorageOptimizer.getStats();
        Logger.debug('Storage', 'Current usage', stats);
    }
}

function initializeServices() {
    getGeminiService();
}

function updateInitialUI() {
    const state = getState();
    if (typeof updateModeIndicator === 'function') {
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

    const state = getState();
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
    localStorage.removeItem('whispers-selected-wave');
    localStorage.removeItem('whispers-conversation-history');
    localStorage.removeItem('whispers-state');

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

    // Try to use DemoApp's TTS state (if main_demo.js is loaded)
    if (typeof DemoApp !== 'undefined' && DemoApp.toggleTTS) {
        DemoApp.toggleTTS();
        return;
    }

    // Fallback to AudioService (if available)
    const audioService = window.AudioService;
    if (!audioService) {
        console.warn('⚠️ TTS not available - neither DemoApp nor AudioService found');
        ttsToggle.disabled = true;
        ttsToggle.title = 'TTS no disponible';
        return;
    }

    // Toggle TTS state
    audioService.ttsEnabled = !audioService.ttsEnabled;

    // Update button visual state and icon
    const ttsIcon = ttsToggle.querySelector('.tts-icon');
    if (audioService.ttsEnabled) {
        ttsToggle.classList.add('active');
        ttsToggle.title = 'Desactivar lectura automática';
        if (ttsIcon) ttsIcon.textContent = '🔊';
    } else {
        ttsToggle.classList.remove('active');
        ttsToggle.title = 'Activar lectura automática';
        if (ttsIcon) ttsIcon.textContent = '🔇';

        // Stop any playing audio
        if (audioService.currentAudio) {
            audioService.currentAudio.pause();
            audioService.currentAudio = null;
        }
    }
}

// Listen for wave selection event
document.addEventListener('wave:selected', (e) => {

    // Small delay to allow splash screen to fade out
    setTimeout(() => {
        // Show main container
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = 'flex';
        }

        // Show fixed controls
        const controlsLeft = document.querySelector('.fixed-controls-left');
        const controlsRight = document.querySelector('.fixed-controls-right');
        if (controlsLeft) controlsLeft.style.display = 'flex';
        if (controlsRight) controlsRight.style.display = 'flex';

        // Clear message display for fresh start
        const messageDisplay = document.getElementById('messageDisplay');
        if (messageDisplay) {
            messageDisplay.innerHTML = `
                <div class="welcome-message">
                    <p class="whisper" data-i18n="ui.welcome">Bienvenido al océano de pensamientos...</p>
                    <p class="wave-reflection">Soy ${e.detail.wave.name || 'El Guardián de la Ola'}. Comparte lo que llevas dentro, y las olas reflejarán tu verdad.</p>
                </div>
                <div id="suggestionsContainer"></div>
            `;
        }

        initializeState();
        initializeServices();
        setupEventListeners();
        updateInitialUI();
        updateAchievementCounter();

        // Initialize suggestions after app is ready
        initializeSuggestions();

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

    const state = getState();
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
            if (typeof UIEventBus !== 'undefined') {
                UIEventBus.emit('message:displayed', {
                    messageId,
                    text: fullText.trim(),
                    scene
                });
            }
        }

        // Display contextual suggestions based on state
        const container = document.getElementById('suggestionsContainer');
        if (container && typeof SuggestionsModule !== 'undefined') {
            if (lifeQuestioningState.active) {
                // Life Questioning mode suggestions
                SuggestionsModule.displayContextual(lifeQuestioningState.currentLevel, container);
            } else if (typeof OceanDynamics !== 'undefined') {
                // Ocean state-based suggestions
                const oceanState = OceanDynamics.getCurrentState();
                if (oceanState && oceanState.id) {
                    SuggestionsModule.displayContextual(oceanState.id, container);
                }
            }
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