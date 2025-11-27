/**
 * Response Validator Module
 * Validates and sanitizes responses from Gemini API
 * Handles incomplete, malformed, or truncated responses
 * 
 * @module core/responseValidator
 */

const ResponseValidator = {
    /**
     * Validate complete response structure
     * @param {*} response - Response to validate
     * @returns {Object} Validation result with valid flag and details
     */
    validate(response) {
        try {
            // Check if response exists
            if (!response) {
                return {
                    valid: false,
                    reason: 'Response is null or undefined',
                    type: 'null_response'
                };
            }

            // Check if response is an object
            if (typeof response !== 'object') {
                return {
                    valid: false,
                    reason: `Response is ${typeof response}, expected object`,
                    type: 'invalid_type'
                };
            }

            // Check required fields
            const hasWhisper = response.whisper !== undefined && response.whisper !== null;
            const hasReflection = response.reflection !== undefined && response.reflection !== null;

            if (!hasWhisper || !hasReflection) {
                return {
                    valid: false,
                    reason: `Missing fields: ${!hasWhisper ? 'whisper' : ''} ${!hasReflection ? 'reflection' : ''}`,
                    type: 'missing_fields',
                    fields: { hasWhisper, hasReflection }
                };
            }

            // Convert to strings and validate
            const whisper = String(response.whisper).trim();
            const reflection = String(response.reflection).trim();

            // Check for empty fields
            if (whisper.length === 0 || reflection.length === 0) {
                return {
                    valid: false,
                    reason: `Empty fields: ${whisper.length === 0 ? 'whisper' : ''} ${reflection.length === 0 ? 'reflection' : ''}`,
                    type: 'empty_fields'
                };
            }

            // Check for suspicious patterns
            const suspiciousPatterns = this.checkSuspiciousPatterns(whisper, reflection);
            if (suspiciousPatterns.length > 0) {
                return {
                    valid: false,
                    reason: `Suspicious patterns detected: ${suspiciousPatterns.join(', ')}`,
                    type: 'suspicious_patterns',
                    patterns: suspiciousPatterns
                };
            }

            // Check for minimum length (at least 10 characters each)
            if (whisper.length < 10 || reflection.length < 10) {
                return {
                    valid: false,
                    reason: `Content too short: whisper=${whisper.length}chars, reflection=${reflection.length}chars`,
                    type: 'too_short'
                };
            }

            // All checks passed
            return {
                valid: true,
                reason: 'Response is valid',
                type: 'valid',
                content: {
                    whisper,
                    reflection,
                    whisperLength: whisper.length,
                    reflectionLength: reflection.length
                }
            };

        } catch (error) {
            return {
                valid: false,
                reason: `Validation error: ${error.message}`,
                type: 'validation_error',
                error: error.message
            };
        }
    },

    /**
     * Check for suspicious patterns that indicate parsing errors
     * @param {string} whisper - Whisper text
     * @param {string} reflection - Reflection text
     * @returns {Array} Array of suspicious patterns found
     * @private
     */
    checkSuspiciousPatterns(whisper, reflection) {
        const patterns = [];
        const combined = whisper + ' ' + reflection;

        // Check for unparsed JSON
        if (combined.includes('{"') || combined.includes('\\n')) {
            patterns.push('unparsed_json');
        }

        // Check for truncation indicators (only explicit truncation markers)
        if (combined.includes('[truncated') || combined.includes('[...]') || combined.includes('…truncated')) {
            patterns.push('truncated_content');
        }

        // Check for error indicators
        if (combined.includes('ERROR:') || combined.includes('error:')) {
            patterns.push('error_indicator');
        }

        // Check for incomplete sentences (ends with incomplete pattern)
        if (reflection.match(/[a-z]\s*$/) && !reflection.match(/[.!?]\s*$/)) {
            patterns.push('incomplete_sentence');
        }

        // Check for excessive special characters
        const specialCharCount = (combined.match(/[{}[\]<>]/g) || []).length;
        if (specialCharCount > 10) {
            patterns.push('excessive_special_chars');
        }

        return patterns;
    },

    /**
     * Sanitize response by removing suspicious content
     * @param {Object} response - Response to sanitize
     * @returns {Object} Sanitized response
     */
    sanitize(response) {
        try {
            if (!response || typeof response !== 'object') {
                return null;
            }

            let whisper = String(response.whisper || '').trim();
            let reflection = String(response.reflection || '').trim();

            // Remove unparsed JSON
            whisper = whisper.replace(/\{[\s\S]*?\}/g, '').trim();
            reflection = reflection.replace(/\{[\s\S]*?\}/g, '').trim();

            // Remove error indicators
            whisper = whisper.replace(/ERROR:.*/gi, '').trim();
            reflection = reflection.replace(/ERROR:.*/gi, '').trim();

            // Fix incomplete sentences
            if (whisper && !whisper.match(/[.!?]$/)) {
                whisper += '.';
            }
            if (reflection && !reflection.match(/[.!?]$/)) {
                reflection += '.';
            }

            return {
                whisper: whisper || '🔊 El océano reflexiona...',
                reflection: reflection || '¿Qué resuena en ti?'
            };

        } catch (error) {
            console.error('Error sanitizing response:', error);
            return {
                whisper: '🔊 El océano reflexiona...',
                reflection: '¿Qué resuena en ti?'
            };
        }
    },

    /**
     * Repair incomplete response
     * @param {Object} response - Incomplete response
     * @returns {Object} Repaired response
     */
    repair(response) {
        try {
            if (!response || typeof response !== 'object') {
                return this.createDefaultResponse();
            }

            const whisper = String(response.whisper || '').trim();
            const reflection = String(response.reflection || '').trim();

            // If whisper is missing or too short, use default
            if (!whisper || whisper.length < 5) {
                return {
                    whisper: '🔊 El océano reflexiona sobre tus palabras...',
                    reflection: reflection || '¿Qué resuena en ti?'
                };
            }

            // If reflection is missing or too short, use default
            if (!reflection || reflection.length < 5) {
                return {
                    whisper: whisper,
                    reflection: '🔊 ¿Qué resuena en ti?'
                };
            }

            return { whisper, reflection };

        } catch (error) {
            console.error('Error repairing response:', error);
            return this.createDefaultResponse();
        }
    },

    /**
     * Create default response
     * @returns {Object} Default response
     */
    createDefaultResponse() {
        return {
            whisper: '🔊 El océano reflexiona sobre tus palabras...',
            reflection: '¿Qué resuena en ti?'
        };
    },

    /**
     * Log validation result for debugging
     * @param {Object} validationResult - Result from validate()
     * @param {string} context - Context information
     */
    logValidation(validationResult, context = '') {
        if (validationResult.valid) {
            console.log('✅ Response validation passed', {
                context,
                type: validationResult.type,
                content: validationResult.content
            });
        } else {
            console.warn('⚠️ Response validation failed', {
                context,
                reason: validationResult.reason,
                type: validationResult.type,
                details: validationResult
            });
        }
    }
};

// Export to window
if (typeof window !== 'undefined') {
    window.ResponseValidator = ResponseValidator;
}

console.log('✅ Response Validator module loaded');
