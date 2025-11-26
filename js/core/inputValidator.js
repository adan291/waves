/**
 * Input Validator Module
 * Centralizes input validation and sanitization
 * Prevents XSS, injection attacks, and invalid data
 * 
 * @module inputValidator
 */

const InputValidator = (() => {
    'use strict';

    /**
     * Sanitize text to prevent XSS attacks
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
     * Sanitize HTML to prevent XSS attacks
     * Removes dangerous tags and attributes
     * @param {string} html - HTML to sanitize
     * @returns {string} Sanitized HTML
     */
    function sanitizeHTML(html) {
        if (typeof html !== 'string') {
            return '';
        }

        const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'i', 'b', 'a', 'ul', 'ol', 'li', 'code', 'pre'];
        const allowedAttributes = ['href', 'title', 'target'];

        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove script tags and event handlers
        const scripts = temp.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        // Remove event handlers
        const allElements = temp.querySelectorAll('*');
        allElements.forEach(el => {
            // Remove all event handler attributes
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('on')) {
                    el.removeAttribute(attr.name);
                }
            });

            // Remove if not in allowed tags
            if (!allowedTags.includes(el.tagName.toLowerCase())) {
                const parent = el.parentNode;
                while (el.firstChild) {
                    parent.insertBefore(el.firstChild, el);
                }
                parent.removeChild(el);
            }
        });

        return temp.innerHTML;
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    function validateEmail(email) {
        if (typeof email !== 'string') {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid URL
     */
    function validateURL(url) {
        if (typeof url !== 'string') {
            return false;
        }

        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Validate JSON string
     * @param {string} jsonString - JSON string to validate
     * @returns {boolean} True if valid JSON
     */
    function validateJSON(jsonString) {
        if (typeof jsonString !== 'string') {
            return false;
        }

        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Validate message text
     * @param {string} message - Message to validate
     * @returns {Object} Validation result {valid, error, sanitized}
     */
    function validateMessage(message) {
        const result = {
            valid: false,
            error: null,
            sanitized: ''
        };

        if (typeof message !== 'string') {
            result.error = 'Message must be a string';
            return result;
        }

        const trimmed = message.trim();

        if (trimmed.length === 0) {
            result.error = 'Message cannot be empty';
            return result;
        }

        if (trimmed.length > 5000) {
            result.error = 'Message is too long (max 5000 characters)';
            return result;
        }

        result.valid = true;
        result.sanitized = sanitizeText(trimmed);
        return result;
    }

    /**
     * Validate API key format
     * @param {string} apiKey - API key to validate
     * @returns {boolean} True if valid API key format
     */
    function validateAPIKey(apiKey) {
        if (typeof apiKey !== 'string') {
            return false;
        }

        // Basic validation: should be non-empty and reasonable length
        return apiKey.length > 10 && apiKey.length < 500;
    }

    /**
     * Validate language code
     * @param {string} lang - Language code to validate
     * @returns {boolean} True if valid language code
     */
    function validateLanguage(lang) {
        if (typeof lang !== 'string') {
            return false;
        }

        const validLanguages = ['es', 'en', 'fr', 'de', 'pt', 'it', 'ja', 'zh', 'ko', 'ru'];
        return validLanguages.includes(lang.toLowerCase());
    }

    /**
     * Validate theme name
     * @param {string} theme - Theme name to validate
     * @returns {boolean} True if valid theme
     */
    function validateTheme(theme) {
        if (typeof theme !== 'string') {
            return false;
        }

        const validThemes = ['dark', 'light', 'ocean', 'beach'];
        return validThemes.includes(theme.toLowerCase());
    }

    /**
     * Validate number range
     * @param {number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} True if value is in range
     */
    function validateRange(value, min, max) {
        if (typeof value !== 'number') {
            return false;
        }

        return value >= min && value <= max;
    }

    /**
     * Validate object structure
     * @param {Object} obj - Object to validate
     * @param {Object} schema - Schema to validate against
     * @returns {boolean} True if object matches schema
     */
    function validateObject(obj, schema) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }

        for (const key in schema) {
            if (!(key in obj)) {
                return false;
            }

            const expectedType = schema[key];
            if (typeof obj[key] !== expectedType) {
                return false;
            }
        }

        return true;
    }

    /**
     * Escape special characters for regex
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    function escapeRegex(str) {
        if (typeof str !== 'string') {
            return '';
        }

        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Validate and sanitize user input
     * @param {string} input - User input
     * @param {string} type - Type of input (text, email, url, etc.)
     * @returns {Object} Validation result
     */
    function validate(input, type = 'text') {
        const result = {
            valid: false,
            error: null,
            sanitized: null
        };

        switch (type) {
            case 'text':
                return validateMessage(input);

            case 'email':
                result.valid = validateEmail(input);
                result.sanitized = sanitizeText(input);
                if (!result.valid) {
                    result.error = 'Invalid email format';
                }
                return result;

            case 'url':
                result.valid = validateURL(input);
                result.sanitized = sanitizeText(input);
                if (!result.valid) {
                    result.error = 'Invalid URL format';
                }
                return result;

            case 'json':
                result.valid = validateJSON(input);
                if (!result.valid) {
                    result.error = 'Invalid JSON format';
                }
                return result;

            case 'apikey':
                result.valid = validateAPIKey(input);
                if (!result.valid) {
                    result.error = 'Invalid API key format';
                }
                return result;

            case 'language':
                result.valid = validateLanguage(input);
                if (!result.valid) {
                    result.error = 'Invalid language code';
                }
                return result;

            case 'theme':
                result.valid = validateTheme(input);
                if (!result.valid) {
                    result.error = 'Invalid theme name';
                }
                return result;

            default:
                return validateMessage(input);
        }
    }

    // Public API
    return {
        sanitizeText,
        sanitizeHTML,
        validateEmail,
        validateURL,
        validateJSON,
        validateMessage,
        validateAPIKey,
        validateLanguage,
        validateTheme,
        validateRange,
        validateObject,
        escapeRegex,
        validate
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.InputValidator = InputValidator;
}
