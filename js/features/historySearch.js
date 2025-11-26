/**
 * History Search Module
 * Search and filter conversation history with optional compression
 * 
 * @module features/historySearch
 * @description
 * Provides conversation history search and filtering capabilities.
 * Automatically uses StorageOptimizer for compression if available,
 * otherwise falls back to standard localStorage.
 * 
 * @requires core/storageOptimizer (optional - for compression)
 * @requires features/keyboardShortcuts (optional - for Ctrl+H shortcut)
 */

if (typeof HistorySearch !== 'undefined') {
    console.warn('HistorySearch already loaded, skipping...');
} else {
    var HistorySearch;
}

HistorySearch = HistorySearch || (() => {
    const STORAGE_KEY = 'whispers-history';
    let conversationHistory = [];
    let searchUI = null;
    
    /**
     * Validate history item structure
     * @private
     * @param {*} item - Item to validate
     * @returns {boolean} True if valid history item
     */
    function isValidHistoryItem(item) {
        return item &&
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.user === 'string' &&
            typeof item.timestamp === 'number' &&
            (item.ai === null || typeof item.ai === 'object');
    }
    
    /**
     * Validate history structure
     * @private
     * @param {*} data - Data to validate
     * @returns {Array} Validated history array
     */
    function validateHistoryStructure(data) {
        if (!Array.isArray(data)) return [];
        return data.filter(isValidHistoryItem);
    }
    
    /**
     * Initialize history search
     */
    function init() {
        loadHistory();
        createSearchUI();
        console.log('🔍 History search initialized');
    }
    
    /**
     * Load history from localStorage with optional decompression
     * @private
     */
    function loadHistory() {
        try {
            // Use StorageOptimizer if available for decompression
            if (typeof StorageOptimizer !== 'undefined') {
                const saved = StorageOptimizer.getItem(STORAGE_KEY);
                conversationHistory = validateHistoryStructure(saved);
            } else {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    conversationHistory = validateHistoryStructure(parsed);
                }
            }
        } catch (error) {
            console.error('Error loading history:', error);
            conversationHistory = [];
        }
    }
    
    /**
     * Save history to localStorage with optional compression
     * @private
     */
    function saveHistory() {
        try {
            // Use StorageOptimizer if available for compression
            if (typeof StorageOptimizer !== 'undefined') {
                try {
                    StorageOptimizer.setItem(STORAGE_KEY, conversationHistory, true);
                } catch (optimizerError) {
                    // Fallback if StorageOptimizer fails
                    console.warn('StorageOptimizer failed, using standard localStorage:', optimizerError);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
                }
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
            }
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    /**
     * Add message to history
     * @param {string} userMessage - User's message
     * @param {Object} aiResponse - AI response object
     * @param {number} timestamp - Message timestamp (default: now)
     */
    function addMessage(userMessage, aiResponse, timestamp = Date.now()) {
        conversationHistory.push({
            id: timestamp,
            user: userMessage,
            ai: aiResponse,
            timestamp
        });
        
        // Keep last 100 messages
        if (conversationHistory.length > 100) {
            conversationHistory = conversationHistory.slice(-100);
        }
        
        saveHistory();
    }
    
    /**
     * Create search UI elements
     * @private
     */
    function createSearchUI() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        const searchHTML = `
            <div class="history-search-container hidden">
                <div class="history-search-header">
                    <input 
                        type="text" 
                        class="history-search-input" 
                        placeholder="Buscar en historial..."
                        aria-label="Buscar conversaciones"
                    />
                    <button class="history-close-btn" aria-label="Cerrar búsqueda">✕</button>
                </div>
                <div class="history-results"></div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', searchHTML);
        
        searchUI = {
            container: container.querySelector('.history-search-container'),
            input: container.querySelector('.history-search-input'),
            results: container.querySelector('.history-results'),
            closeBtn: container.querySelector('.history-close-btn')
        };
        
        // Setup event listeners
        searchUI.input.addEventListener('input', handleSearch);
        searchUI.closeBtn.addEventListener('click', hide);
        
        // Add keyboard shortcut (Ctrl+H)
        if (typeof KeyboardShortcuts !== 'undefined') {
            KeyboardShortcuts.registerShortcut('h', { ctrl: true }, show, 'Buscar en historial');
        }
    }
    
    /**
     * Show search UI
     */
    function show() {
        if (!searchUI) return;
        searchUI.container.classList.remove('hidden');
        searchUI.input.focus();
        displayAllHistory();
    }
    
    /**
     * Hide search UI
     */
    function hide() {
        if (!searchUI) return;
        searchUI.container.classList.add('hidden');
        searchUI.input.value = '';
        searchUI.results.innerHTML = '';
    }
    
    /**
     * Handle search input event
     * @private
     * @param {Event} event - Input event
     */
    function handleSearch(event) {
        const query = event.target.value.trim().toLowerCase();
        
        if (!query) {
            displayAllHistory();
            return;
        }
        
        const results = conversationHistory.filter(item => 
            item.user.toLowerCase().includes(query) ||
            (item.ai.whisper && item.ai.whisper.toLowerCase().includes(query)) ||
            (item.ai.wave && item.ai.wave.toLowerCase().includes(query)) ||
            (item.ai.content && item.ai.content.toLowerCase().includes(query))
        );
        
        displayResults(results, query);
    }
    
    /**
     * Display all history (last 20 items)
     * @private
     */
    function displayAllHistory() {
        const recent = conversationHistory.slice(-20).reverse();
        displayResults(recent);
    }
    
    /**
     * Display search results
     * @private
     * @param {Array} results - Results to display
     * @param {string} query - Search query for highlighting
     */
    function displayResults(results, query = '') {
        if (!searchUI) return;
        
        if (results.length === 0) {
            searchUI.results.innerHTML = `
                <div class="history-no-results">
                    <p>No se encontraron resultados</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(item => {
            const date = new Date(item.timestamp).toLocaleString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const aiText = item.ai.wave || item.ai.content || item.ai.whisper || '';
            
            return `
                <div class="history-item" data-id="${item.id}">
                    <div class="history-item-date">${date}</div>
                    <div class="history-item-user">${highlightText(item.user, query)}</div>
                    <div class="history-item-ai">${highlightText(aiText.substring(0, 150), query)}...</div>
                </div>
            `;
        }).join('');
        
        searchUI.results.innerHTML = resultsHTML;
        
        // Add click handlers
        searchUI.results.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                loadConversation(id);
            });
        });
    }
    
    /**
     * Highlight search query in text with HTML markup
     * @private
     * @param {string} text - Text to highlight
     * @param {string} query - Query string to highlight
     * @returns {string} HTML with highlighted matches
     */
    function highlightText(text, query) {
        if (!query) return escapeHtml(text);
        
        const escaped = escapeHtml(text);
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return escaped.replace(regex, '<mark>$1</mark>');
    }
    
    /**
     * Escape regex special characters
     * @private
     * @param {string} str - String to escape
     * @returns {string} Escaped string safe for regex
     */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Escape HTML special characters
     * @private
     * @param {string} text - Text to escape
     * @returns {string} HTML-escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Load a conversation from history
     * @private
     * @param {number} id - Conversation ID
     */
    function loadConversation(id) {
        const item = conversationHistory.find(i => i.id === id);
        if (!item) return;
        
        // Fill input with user message
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = item.user;
            userInput.focus();
        }
        
        hide();
    }
    
    /**
     * Clear all history
     */
    function clearHistory() {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
            conversationHistory = [];
            saveHistory();
            displayAllHistory();
            console.log('🗑️ History cleared');
        }
    }
    
    // Public API
    return {
        init,
        addMessage,
        show,
        hide,
        clearHistory
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HistorySearch.init());
} else {
    HistorySearch.init();
}

console.log('🔍 History Search module loaded');
