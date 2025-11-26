/**
 * Conversation Tags Module
 * Allows tagging and categorizing conversations
 * Supports filtering and searching by tags
 * 
 * @module conversationTags
 */

const ConversationTags = (() => {
    'use strict';

    const STORAGE_KEY = 'whispers-tags';
    const TAGS_STORAGE_KEY = 'whispers-tag-definitions';

    // Default tags
    const DEFAULT_TAGS = [
        { id: 'personal', name: 'Personal', color: '#FF6B6B', icon: '💭' },
        { id: 'work', name: 'Work', color: '#4ECDC4', icon: '💼' },
        { id: 'relationships', name: 'Relationships', color: '#FFE66D', icon: '💕' },
        { id: 'health', name: 'Health', color: '#95E1D3', icon: '🏥' },
        { id: 'learning', name: 'Learning', color: '#A8E6CF', icon: '📚' },
        { id: 'decision', name: 'Decision', color: '#FFD3B6', icon: '🤔' },
        { id: 'creative', name: 'Creative', color: '#FFAAA5', icon: '🎨' },
        { id: 'important', name: 'Important', color: '#FF8B94', icon: '⭐' }
    ];

    /**
     * Initialize tags from storage
     */
    function initializeTags() {
        try {
            const stored = localStorage.getItem(TAGS_STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(DEFAULT_TAGS));
            }
        } catch (e) {
            console.error('Error initializing tags:', e);
        }
    }

    /**
     * Get all tags
     * @returns {Array} Array of tags
     */
    function getTags() {
        try {
            const stored = localStorage.getItem(TAGS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : DEFAULT_TAGS;
        } catch (e) {
            console.error('Error getting tags:', e);
            return DEFAULT_TAGS;
        }
    }

    /**
     * Create new tag
     * @param {string} name - Tag name
     * @param {string} color - Tag color (hex)
     * @param {string} icon - Tag icon (emoji)
     * @returns {Object} Created tag
     */
    function createTag(name, color, icon) {
        if (typeof name !== 'string' || !name.trim()) {
            return null;
        }

        const tags = getTags();
        const id = name.toLowerCase().replace(/\s+/g, '-');

        // Check if tag already exists
        if (tags.some(t => t.id === id)) {
            return null;
        }

        const newTag = {
            id: id,
            name: name.trim(),
            color: color || '#999999',
            icon: icon || '🏷️'
        };

        tags.push(newTag);
        try {
            localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
        } catch (e) {
            console.error('Error saving tag:', e);
            return null;
        }

        return newTag;
    }

    /**
     * Delete tag
     * @param {string} tagId - Tag ID to delete
     * @returns {boolean} True if deleted
     */
    function deleteTag(tagId) {
        const tags = getTags();
        const filtered = tags.filter(t => t.id !== tagId);

        if (filtered.length === tags.length) {
            return false; // Tag not found
        }

        try {
            localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(filtered));
            // Remove tag from all conversations
            removeTagFromAll(tagId);
            return true;
        } catch (e) {
            console.error('Error deleting tag:', e);
            return false;
        }
    }

    /**
     * Get conversation tags
     * @param {string} conversationId - Conversation ID
     * @returns {Array} Array of tag IDs
     */
    function getConversationTags(conversationId) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const tagMap = stored ? JSON.parse(stored) : {};
            return tagMap[conversationId] || [];
        } catch (e) {
            console.error('Error getting conversation tags:', e);
            return [];
        }
    }

    /**
     * Add tag to conversation
     * @param {string} conversationId - Conversation ID
     * @param {string} tagId - Tag ID to add
     * @returns {boolean} True if added
     */
    function addTag(conversationId, tagId) {
        if (!conversationId || !tagId) {
            return false;
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const tagMap = stored ? JSON.parse(stored) : {};

            if (!tagMap[conversationId]) {
                tagMap[conversationId] = [];
            }

            if (!tagMap[conversationId].includes(tagId)) {
                tagMap[conversationId].push(tagId);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(tagMap));
            return true;
        } catch (e) {
            console.error('Error adding tag:', e);
            return false;
        }
    }

    /**
     * Remove tag from conversation
     * @param {string} conversationId - Conversation ID
     * @param {string} tagId - Tag ID to remove
     * @returns {boolean} True if removed
     */
    function removeTag(conversationId, tagId) {
        if (!conversationId || !tagId) {
            return false;
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const tagMap = stored ? JSON.parse(stored) : {};

            if (tagMap[conversationId]) {
                tagMap[conversationId] = tagMap[conversationId].filter(t => t !== tagId);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(tagMap));
            return true;
        } catch (e) {
            console.error('Error removing tag:', e);
            return false;
        }
    }

    /**
     * Remove tag from all conversations
     * @param {string} tagId - Tag ID to remove
     */
    function removeTagFromAll(tagId) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const tagMap = stored ? JSON.parse(stored) : {};

            for (const conversationId in tagMap) {
                tagMap[conversationId] = tagMap[conversationId].filter(t => t !== tagId);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(tagMap));
        } catch (e) {
            console.error('Error removing tag from all:', e);
        }
    }

    /**
     * Get conversations by tag
     * @param {string} tagId - Tag ID to filter by
     * @returns {Array} Array of conversation IDs
     */
    function getConversationsByTag(tagId) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const tagMap = stored ? JSON.parse(stored) : {};
            const conversations = [];

            for (const conversationId in tagMap) {
                if (tagMap[conversationId].includes(tagId)) {
                    conversations.push(conversationId);
                }
            }

            return conversations;
        } catch (e) {
            console.error('Error getting conversations by tag:', e);
            return [];
        }
    }

    /**
     * Get tag by ID
     * @param {string} tagId - Tag ID
     * @returns {Object} Tag object or null
     */
    function getTag(tagId) {
        const tags = getTags();
        return tags.find(t => t.id === tagId) || null;
    }

    /**
     * Get statistics for tag
     * @param {string} tagId - Tag ID
     * @returns {Object} Statistics
     */
    function getTagStatistics(tagId) {
        const conversations = getConversationsByTag(tagId);
        const tag = getTag(tagId);

        return {
            tagId: tagId,
            tagName: tag ? tag.name : 'Unknown',
            conversationCount: conversations.length,
            conversations: conversations
        };
    }

    /**
     * Get all statistics
     * @returns {Array} Array of tag statistics
     */
    function getAllStatistics() {
        const tags = getTags();
        return tags.map(tag => getTagStatistics(tag.id));
    }

    /**
     * Clear all tags
     */
    function clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TAGS_STORAGE_KEY);
            initializeTags();
        } catch (e) {
            console.error('Error clearing tags:', e);
        }
    }

    // Initialize on load
    initializeTags();

    // Public API
    return {
        getTags: getTags,
        createTag: createTag,
        deleteTag: deleteTag,
        getTag: getTag,
        getConversationTags: getConversationTags,
        addTag: addTag,
        removeTag: removeTag,
        getConversationsByTag: getConversationsByTag,
        getTagStatistics: getTagStatistics,
        getAllStatistics: getAllStatistics,
        clearAll: clearAll
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.ConversationTags = ConversationTags;
}
