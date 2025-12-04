/**
 * API Key Setup Module
 * Allows users to configure their own Gemini API key
 * 
 * @module features/apiKeySetup
 */

const ApiKeySetup = (function() {
    'use strict';

    const STORAGE_KEY = 'whispers-gemini-api-key';
    const API_KEY_URL = 'https://aistudio.google.com/app/apikey';
    
    let modalElement = null;

    /**
     * Get stored API key from localStorage
     * @returns {string|null} Stored API key or null
     */
    function getStoredApiKey() {
        try {
            if (typeof localStorage !== 'undefined' && localStorage) {
                return localStorage.getItem(STORAGE_KEY);
            }
        } catch (e) {
            console.warn('localStorage not available:', e.message);
        }
        return null;
    }

    /**
     * Save API key to localStorage
     * @param {string} apiKey - API key to save
     */
    function saveApiKey(apiKey) {
        try {
            if (typeof localStorage !== 'undefined' && localStorage) {
                localStorage.setItem(STORAGE_KEY, apiKey);
            }
        } catch (e) {
            console.warn('localStorage not available:', e.message);
        }
    }

    /**
     * Remove API key from localStorage
     */
    function removeApiKey() {
        try {
            if (typeof localStorage !== 'undefined' && localStorage) {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) {
            console.warn('localStorage not available:', e.message);
        }
    }

    /**
     * Check if API key is configured
     * @returns {boolean} True if API key exists
     */
    function isConfigured() {
        const key = getStoredApiKey();
        return key && key.length > 0 && key !== 'YOUR_API_KEY_HERE';
    }

    /**
     * Get translations for current language
     * Uses i18n system if available, otherwise falls back to built-in translations
     * @returns {Object} Translation strings
     */
    function getTranslations() {
        const lang = (typeof i18n !== 'undefined') ? i18n.getLanguage() : 'es';
        
        // Try to use i18n system first
        if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            const apiKeyTranslations = i18n.t('apiKey');
            if (apiKeyTranslations && typeof apiKeyTranslations === 'object') {
                return apiKeyTranslations;
            }
        }
        
        // Fallback translations
        const translations = {
            es: {
                title: '🔑 Configurar API Key',
                subtitle: 'Para usar Whispers of the Wave necesitas una API key gratuita de Google Gemini.',
                step1: '1. Visita Google AI Studio',
                step2: '2. Inicia sesión con tu cuenta de Google',
                step3: '3. Crea una nueva API key (es gratis)',
                step4: '4. Copia y pega la key aquí abajo',
                placeholder: 'Pega tu API key aquí...',
                getKey: 'Obtener API Key Gratis',
                save: 'Guardar y Comenzar',
                cancel: 'Cancelar',
                validating: 'Validando...',
                success: '✓ API key válida',
                error: '✗ API key inválida',
                errorEmpty: 'Por favor, introduce una API key',
                note: '💡 Tu API key se guarda solo en tu navegador y nunca se comparte.',
                changeKey: 'Cambiar API Key'
            },
            en: {
                title: '🔑 Configure API Key',
                subtitle: 'To use Whispers of the Wave you need a free Google Gemini API key.',
                step1: '1. Visit Google AI Studio',
                step2: '2. Sign in with your Google account',
                step3: '3. Create a new API key (it\'s free)',
                step4: '4. Copy and paste the key below',
                placeholder: 'Paste your API key here...',
                getKey: 'Get Free API Key',
                save: 'Save and Start',
                cancel: 'Cancel',
                validating: 'Validating...',
                success: '✓ Valid API key',
                error: '✗ Invalid API key',
                errorEmpty: 'Please enter an API key',
                note: '💡 Your API key is stored only in your browser and never shared.',
                changeKey: 'Change API Key'
            },
            ro: {
                title: '🔑 Configurează API Key',
                subtitle: 'Pentru a folosi Whispers of the Wave ai nevoie de o cheie API gratuită Google Gemini.',
                step1: '1. Vizitează Google AI Studio',
                step2: '2. Conectează-te cu contul tău Google',
                step3: '3. Creează o nouă cheie API (este gratuită)',
                step4: '4. Copiază și lipește cheia mai jos',
                placeholder: 'Lipește cheia API aici...',
                getKey: 'Obține API Key Gratuit',
                save: 'Salvează și Începe',
                cancel: 'Anulează',
                validating: 'Se validează...',
                success: '✓ Cheie API validă',
                error: '✗ Cheie API invalidă',
                errorEmpty: 'Te rog introdu o cheie API',
                note: '💡 Cheia ta API este stocată doar în browserul tău și nu este partajată niciodată.',
                changeKey: 'Schimbă API Key'
            }
        };

        return translations[lang] || translations.es;
    }

    /**
     * Create and show the API key setup modal
     * @param {Object} options - Modal options
     * @param {Function} options.onSuccess - Callback when key is saved successfully
     * @param {Function} options.onCancel - Callback when modal is cancelled
     * @param {boolean} options.allowCancel - Whether to show cancel button
     */
    function showModal(options = {}) {
        const t = getTranslations();
        const { onSuccess, onCancel, allowCancel = false } = options;

        // Remove existing modal if any
        hideModal();

        // Create modal HTML
        const modalHTML = `
            <div class="api-key-modal-overlay" id="apiKeyModalOverlay">
                <div class="api-key-modal">
                    <div class="api-key-modal-header">
                        <h2 class="api-key-modal-title">${t.title}</h2>
                    </div>
                    <div class="api-key-modal-body">
                        <p class="api-key-subtitle">${t.subtitle}</p>
                        
                        <div class="api-key-steps">
                            <p>${t.step1}</p>
                            <p>${t.step2}</p>
                            <p>${t.step3}</p>
                            <p>${t.step4}</p>
                        </div>

                        <a href="${API_KEY_URL}" target="_blank" rel="noopener noreferrer" class="api-key-link">
                            ${t.getKey} →
                        </a>

                        <div class="api-key-input-container">
                            <input type="password" 
                                   id="apiKeyInput" 
                                   class="api-key-input" 
                                   placeholder="${t.placeholder}"
                                   autocomplete="off"
                                   spellcheck="false">
                            <button type="button" class="api-key-toggle-visibility" id="toggleVisibility">
                                👁️
                            </button>
                        </div>

                        <div class="api-key-status" id="apiKeyStatus"></div>

                        <p class="api-key-note">${t.note}</p>
                    </div>
                    <div class="api-key-modal-footer">
                        ${allowCancel ? `<button class="api-key-btn api-key-btn-cancel" id="apiKeyCancelBtn">${t.cancel}</button>` : ''}
                        <button class="api-key-btn api-key-btn-save" id="apiKeySaveBtn">${t.save}</button>
                    </div>
                </div>
            </div>
        `;

        // Insert modal into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modalElement = document.getElementById('apiKeyModalOverlay');

        // Setup event listeners
        const input = document.getElementById('apiKeyInput');
        const saveBtn = document.getElementById('apiKeySaveBtn');
        const cancelBtn = document.getElementById('apiKeyCancelBtn');
        const toggleBtn = document.getElementById('toggleVisibility');
        const statusEl = document.getElementById('apiKeyStatus');

        // Toggle password visibility
        toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                input.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        });

        // Save button click
        saveBtn.addEventListener('click', async () => {
            const apiKey = input.value.trim();
            
            if (!apiKey) {
                statusEl.textContent = t.errorEmpty;
                statusEl.className = 'api-key-status error';
                return;
            }

            // Show validating state
            statusEl.textContent = t.validating;
            statusEl.className = 'api-key-status validating';
            saveBtn.disabled = true;

            // Validate the API key
            const isValid = await validateApiKey(apiKey);

            if (isValid) {
                statusEl.textContent = t.success;
                statusEl.className = 'api-key-status success';
                
                // Save the key
                saveApiKey(apiKey);

                // Update GeminiService instance
                if (typeof GeminiService !== 'undefined') {
                    const service = GeminiService.getInstance();
                    service.apiKey = apiKey;
                }

                // Hide demo mode indicator
                const demoIndicator = document.getElementById('demoModeIndicator');
                if (demoIndicator) {
                    demoIndicator.classList.add('hidden');
                }

                // Close modal after short delay
                setTimeout(() => {
                    hideModal();
                    if (onSuccess) onSuccess(apiKey);
                }, 800);
            } else {
                statusEl.textContent = t.error;
                statusEl.className = 'api-key-status error';
                saveBtn.disabled = false;
            }
        });

        // Cancel button click
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                hideModal();
                if (onCancel) onCancel();
            });
        }

        // Enter key to save
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });

        // Animate in
        requestAnimationFrame(() => {
            modalElement.classList.add('active');
        });

        // Focus input
        setTimeout(() => input.focus(), 100);
    }

    /**
     * Hide and remove the modal
     */
    function hideModal() {
        if (modalElement) {
            modalElement.classList.remove('active');
            setTimeout(() => {
                if (modalElement && modalElement.parentNode) {
                    modalElement.parentNode.removeChild(modalElement);
                }
                modalElement = null;
            }, 300);
        }
    }

    /**
     * Validate API key by making a test request
     * @param {string} apiKey - API key to validate
     * @returns {Promise<boolean>} True if valid
     */
    async function validateApiKey(apiKey) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Hi' }]
                    }]
                })
            });

            // 200 = valid, 400 = valid but bad request (still means key works)
            // 401/403 = invalid key
            return response.ok || response.status === 400;
        } catch (error) {
            console.error('API key validation error:', error);
            return false;
        }
    }

    /**
     * Initialize - check if API key is needed
     * @param {Object} options - Init options
     * @returns {boolean} True if API key is configured
     */
    function init(options = {}) {
        // Load stored key into GeminiService if available
        const storedKey = getStoredApiKey();
        if (storedKey && typeof GeminiService !== 'undefined') {
            const service = GeminiService.getInstance();
            service.apiKey = storedKey;
        }

        return isConfigured();
    }

    /**
     * Add change API key button to UI
     */
    function addChangeKeyButton() {
        // Check if button already exists
        if (document.getElementById('changeApiKeyBtn')) return;

        const t = getTranslations();
        const controlsRight = document.querySelector('.fixed-controls-right');
        
        if (controlsRight) {
            const btn = document.createElement('button');
            btn.id = 'changeApiKeyBtn';
            btn.className = 'control-btn-inline';
            btn.setAttribute('aria-label', t.changeKey);
            btn.setAttribute('title', t.changeKey);
            btn.innerHTML = '<span>🔑</span>';
            btn.addEventListener('click', () => {
                showModal({ allowCancel: true });
            });
            
            // Insert at the beginning
            controlsRight.insertBefore(btn, controlsRight.firstChild);
        }
    }

    // Public API
    return {
        init,
        isConfigured,
        showModal,
        hideModal,
        getStoredApiKey,
        saveApiKey,
        removeApiKey,
        addChangeKeyButton
    };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.ApiKeySetup = ApiKeySetup;
}

console.log('🔑 API Key Setup module loaded');
