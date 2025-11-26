/**
 * Quick Reactions Module
 * Add 👍👎 feedback buttons to AI responses
 */

if (typeof QuickReactions !== 'undefined') {
    console.warn('QuickReactions already loaded, skipping...');
} else {
    var QuickReactions;
}

QuickReactions = QuickReactions || (() => {
    const STORAGE_KEY = 'whispers-feedback';
    let feedbackData = [];
    
    // Initialize reactions
    function init() {
        loadFeedback();
        console.log('👍 Quick reactions initialized');
    }
    
    // Load feedback from localStorage
    function loadFeedback() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                feedbackData = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading feedback:', error);
            feedbackData = [];
        }
    }
    
    // Save feedback to localStorage
    function saveFeedback() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackData));
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    }
    
    // Add reaction buttons to a message
    function addReactionButtons(messageElement, messageId) {
        if (!messageElement) return;
        
        // Check if buttons already exist
        if (messageElement.querySelector('.reaction-buttons')) return;
        
        const buttonsHTML = `
            <div class="reaction-buttons">
                <button class="reaction-btn" data-reaction="positive" data-message-id="${messageId}" aria-label="Me gusta">
                    👍
                </button>
                <button class="reaction-btn" data-reaction="negative" data-message-id="${messageId}" aria-label="No me gusta">
                    👎
                </button>
            </div>
        `;
        
        messageElement.insertAdjacentHTML('beforeend', buttonsHTML);
        
        // Add event listeners
        const buttons = messageElement.querySelectorAll('.reaction-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', handleReaction);
        });
    }
    
    // Handle reaction click
    function handleReaction(event) {
        const btn = event.currentTarget;
        const reaction = btn.dataset.reaction;
        const messageId = btn.dataset.messageId;
        
        // Toggle active state
        const wasActive = btn.classList.contains('active');
        
        // Remove active from all buttons in this group
        const group = btn.closest('.reaction-buttons');
        group.querySelectorAll('.reaction-btn').forEach(b => b.classList.remove('active'));
        
        if (!wasActive) {
            btn.classList.add('active');
            recordFeedback(messageId, reaction);
        } else {
            removeFeedback(messageId);
        }
    }
    
    // Record feedback
    function recordFeedback(messageId, reaction) {
        // Remove existing feedback for this message
        feedbackData = feedbackData.filter(f => f.messageId !== messageId);
        
        // Add new feedback
        feedbackData.push({
            messageId,
            reaction,
            timestamp: Date.now()
        });
        
        saveFeedback();
        
        console.log(`👍 Feedback recorded: ${reaction} for message ${messageId}`);
        
        // Optional: Send to analytics or backend
        if (typeof sendFeedbackToAnalytics === 'function') {
            sendFeedbackToAnalytics(messageId, reaction);
        }
    }
    
    // Remove feedback
    function removeFeedback(messageId) {
        feedbackData = feedbackData.filter(f => f.messageId !== messageId);
        saveFeedback();
        console.log(`🗑️ Feedback removed for message ${messageId}`);
    }
    
    // Get feedback for a message
    function getFeedback(messageId) {
        return feedbackData.find(f => f.messageId === messageId);
    }
    
    // Get feedback statistics
    function getStatistics() {
        const positive = feedbackData.filter(f => f.reaction === 'positive').length;
        const negative = feedbackData.filter(f => f.reaction === 'negative').length;
        const total = feedbackData.length;
        
        return {
            positive,
            negative,
            total,
            positiveRate: total > 0 ? (positive / total * 100).toFixed(1) : 0
        };
    }
    
    return {
        init,
        addReactionButtons,
        getFeedback,
        getStatistics
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuickReactions.init());
} else {
    QuickReactions.init();
}
