/**
 * HTML Sanitizer Module
 * Sanitizes HTML content to prevent XSS attacks
 * Removes dangerous tags, attributes, and event handlers
 * 
 * @module htmlSanitizer
 */

const HTMLSanitizer = (() => {
    'use strict';

    // Allowed HTML tags for different contexts
    const ALLOWED_TAGS = {
        basic: ['p', 'br', 'strong', 'em', 'u', 'i', 'b'],
        extended: ['p', 'br', 'strong', 'em', 'u', 'i', 'b', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
        minimal: ['p', 'br']
    };

    // Allowed attributes for specific tags
    const ALLOWED_ATTRIBUTES = {
        'a': ['href', 'title', 'target'],
        'img': ['src', 'alt', 'title'],
        'code': ['class'],
        'pre': ['class']
    };

    // Dangerous protocols to block
    const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

    /**
     * Check if protocol is dangerous
     * @param {string} url - URL to check
     * @returns {boolean} True if dangerous
     */
    function isDangerousProtocol(url) {
        if (typeof url !== 'string') {
            return true;
        }

        const lowerUrl = url.toLowerCase().trim();
        return DANGEROUS_PROTOCOLS.some(protocol => lowerUrl.startsWith(protocol));
    }

    /**
     * Sanitize a single element
     * @param {Element} element - Element to sanitize
     * @param {Array} allowedTags - List of allowed tags
     * @returns {Element} Sanitized element or null
     */
    function sanitizeElement(element, allowedTags) {
        const tagName = element.tagName.toLowerCase();

        // Remove if tag not allowed
        if (!allowedTags.includes(tagName)) {
            return null;
        }

        // Remove all attributes first
        const attributes = Array.from(element.attributes);
        attributes.forEach(attr => {
            element.removeAttribute(attr.name);
        });

        // Add back only allowed attributes
        if (ALLOWED_ATTRIBUTES[tagName]) {
            const originalElement = element.cloneNode(true);
            ALLOWED_ATTRIBUTES[tagName].forEach(attrName => {
                const value = originalElement.getAttribute(attrName);
                if (value) {
                    // Check for dangerous protocols in href/src
                    if ((attrName === 'href' || attrName === 'src') && isDangerousProtocol(value)) {
                        return;
                    }
                    element.setAttribute(attrName, value);
                }
            });
        }

        return element;
    }

    /**
     * Sanitize HTML content
     * @param {string} html - HTML to sanitize
     * @param {string} context - Context (basic, extended, minimal)
     * @returns {string} Sanitized HTML
     */
    function sanitize(html, context = 'extended') {
        if (typeof html !== 'string') {
            return '';
        }

        const allowedTags = ALLOWED_TAGS[context] || ALLOWED_TAGS.extended;
        const temp = document.createElement('div');

        try {
            temp.innerHTML = html;
        } catch (e) {
            // If HTML parsing fails, return empty
            return '';
        }

        // Remove script tags
        const scripts = temp.querySelectorAll('script, style, iframe, object, embed');
        scripts.forEach(script => script.remove());

        // Sanitize all elements
        const allElements = temp.querySelectorAll('*');
        const elementsToRemove = [];

        allElements.forEach(el => {
            // Remove event handler attributes
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('on')) {
                    el.removeAttribute(attr.name);
                }
            });

            // Sanitize element
            const sanitized = sanitizeElement(el, allowedTags);
            if (sanitized === null) {
                elementsToRemove.push(el);
            }
        });

        // Remove disallowed elements but keep their content
        elementsToRemove.forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                while (el.firstChild) {
                    parent.insertBefore(el.firstChild, el);
                }
                parent.removeChild(el);
            }
        });

        return temp.innerHTML;
    }

    /**
     * Sanitize text content (no HTML)
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    function sanitizeText(text) {
        if (typeof text !== 'string') {
            return '';
        }

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitize AI response
     * @param {string} response - AI response to sanitize
     * @returns {string} Sanitized response
     */
    function sanitizeResponse(response) {
        if (typeof response !== 'string') {
            return '';
        }

        // Allow extended HTML for AI responses
        return sanitize(response, 'extended');
    }

    /**
     * Sanitize user message
     * @param {string} message - User message to sanitize
     * @returns {string} Sanitized message
     */
    function sanitizeMessage(message) {
        if (typeof message !== 'string') {
            return '';
        }

        // Only allow basic formatting for user messages
        return sanitize(message, 'basic');
    }

    /**
     * Sanitize JSON data
     * @param {Object} data - Data to sanitize
     * @returns {Object} Sanitized data
     */
    function sanitizeJSON(data) {
        if (typeof data !== 'object' || data === null) {
            return {};
        }

        const sanitized = {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];

                if (typeof value === 'string') {
                    sanitized[key] = sanitizeText(value);
                } else if (typeof value === 'object' && value !== null) {
                    sanitized[key] = sanitizeJSON(value);
                } else if (typeof value === 'number' || typeof value === 'boolean') {
                    sanitized[key] = value;
                }
            }
        }

        return sanitized;
    }

    /**
     * Create safe HTML element
     * @param {string} tag - Tag name
     * @param {Object} attributes - Attributes object
     * @param {string} content - Text content
     * @returns {Element} Safe element
     */
    function createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        // Set attributes safely
        for (const key in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, key)) {
                const value = attributes[key];

                // Check for dangerous protocols
                if ((key === 'href' || key === 'src') && isDangerousProtocol(value)) {
                    continue;
                }

                element.setAttribute(key, sanitizeText(String(value)));
            }
        }

        // Set text content safely
        if (content) {
            element.textContent = content;
        }

        return element;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHTML(text) {
        if (typeof text !== 'string') {
            return '';
        }

        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Unescape HTML special characters
     * @param {string} text - Text to unescape
     * @returns {string} Unescaped text
     */
    function unescapeHTML(text) {
        if (typeof text !== 'string') {
            return '';
        }

        const map = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'"
        };

        return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, entity => map[entity]);
    }

    // Public API
    return {
        sanitize,
        sanitizeText,
        sanitizeResponse,
        sanitizeMessage,
        sanitizeJSON,
        createElement,
        escapeHTML,
        unescapeHTML,
        isDangerousProtocol
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.HTMLSanitizer = HTMLSanitizer;
}
