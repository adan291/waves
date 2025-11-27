/**
 * Features Integration Module
 * Connects all new features with the main application
 */

// Global functions for keyboard shortcuts
function clearConversation() {
    if (confirm('¿Estás seguro de que quieres limpiar la conversación?')) {
        const messageDisplay = document.getElementById('messageDisplay');
        if (messageDisplay) {
            // Keep welcome message
            const welcomeMsg = messageDisplay.querySelector('.welcome-message');
            messageDisplay.innerHTML = '';
            if (welcomeMsg) {
                messageDisplay.appendChild(welcomeMsg);
            }
        }
        
        console.log('🧹 Conversation cleared');
    }
}

function stopAudio() {
    // Delegate to AudioService if available (preferred)
    if (typeof window.AudioService !== 'undefined' && typeof window.AudioService.stopAudio === 'function') {
        window.AudioService.stopAudio();
        return;
    }
    
    console.log('🔇 Audio stop requested (AudioService not available)');
}

// Integration with message rendering
function integrateQuickReactions() {
    // Hook into message display to add reaction buttons
    const originalDisplayMessage = window.displayMessage;
    
    if (typeof originalDisplayMessage === 'function') {
        window.displayMessage = function(type, content) {
            const result = originalDisplayMessage.apply(this, arguments);
            
            // Add reactions to AI messages
            if (type === 'ai' || type === 'aiWhisperWave' || type === 'aiContent') {
                setTimeout(() => {
                    const lastMessage = document.querySelector('.message-container:last-child');
                    if (lastMessage && typeof QuickReactions !== 'undefined') {
                        const messageId = Date.now();
                        QuickReactions.addReactionButtons(lastMessage, messageId);
                    }
                }, 100);
            }
            
            return result;
        };
    }
}

// Integration with conversation history
function integrateHistoryTracking() {
    // Hook into message sending to track history
    const originalHandleUserMessage = window.handleUserMessage;
    
    if (typeof originalHandleUserMessage === 'function') {
        window.handleUserMessage = function(userMessage) {
            const result = originalHandleUserMessage.apply(this, arguments);
            
            // Track in history after AI responds
            // This will be called by the response handler
            
            return result;
        };
    }
}

// Save conversation to history after AI response
function saveToHistory(userMessage, aiResponse) {
    if (typeof HistorySearch !== 'undefined') {
        HistorySearch.addMessage(userMessage, aiResponse);
    }
}

// Initialize all integrations
function initializeFeatureIntegrations() {
    console.log('🔌 Initializing feature integrations...');
    
    // Integrate quick reactions
    integrateQuickReactions();
    
    // Integrate history tracking
    integrateHistoryTracking();
    
    console.log('✅ Feature integrations complete');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatureIntegrations);
} else {
    initializeFeatureIntegrations();
}

// Export for use in other modules
window.clearConversation = clearConversation;
window.stopAudio = stopAudio;
window.saveToHistory = saveToHistory;
