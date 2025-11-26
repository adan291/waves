/**
 * SpecInterface - Base class for all spec adapters
 * 
 * All specs must extend this class and implement its abstract methods
 * to integrate with the Feature Router.
 * 
 * @abstract
 * @version 1.0.0
 */

class SpecInterface {
  /**
   * Constructor
   * @param {string} id - Unique spec identifier
   */
  constructor(id) {
    if (!id) {
      throw new Error('Spec ID is required');
    }
    
    this.id = id;
    this.contractVersion = '1.0.0';
    
    // Ensure abstract methods are implemented
    if (this.constructor === SpecInterface) {
      throw new Error('SpecInterface is abstract and cannot be instantiated directly');
    }
    
    const abstractMethods = ['canHandle', 'process', 'getCapabilities'];
    for (const method of abstractMethods) {
      if (this[method] === SpecInterface.prototype[method]) {
        throw new Error(`Abstract method '${method}' must be implemented`);
      }
    }
  }

  /**
   * Check if this spec can handle the given request
   * 
   * @abstract
   * @param {Object} request - SpecRequest object
   * @returns {Object} { canHandle: boolean, confidence: number, reason: string }
   */
  canHandle(request) {
    throw new Error('Method canHandle() must be implemented');
  }

  /**
   * Process the request and return a response
   * 
   * @abstract
   * @param {Object} request - SpecRequest object
   * @returns {Promise<Object>} SpecResponse object
   */
  async process(request) {
    throw new Error('Method process() must be implemented');
  }

  /**
   * Get spec capabilities and metadata
   * 
   * @abstract
   * @returns {Object} Capabilities object
   */
  getCapabilities() {
    throw new Error('Method getCapabilities() must be implemented');
  }

  /**
   * Validate request format
   * @protected
   * @param {Object} request - Request to validate
   * @throws {Error} If request is invalid
   */
  validateRequest(request) {
    const required = ['id', 'timestamp', 'text', 'spec', 'routing', 'context'];
    
    for (const field of required) {
      if (!request[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    if (typeof request.text !== 'string' || request.text.trim().length === 0) {
      throw new Error('Text must be a non-empty string');
    }
    
    if (request.routing.confidence < 0 || request.routing.confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
    
    return true;
  }

  /**
   * Validate response format
   * @protected
   * @param {Object} response - Response to validate
   * @throws {Error} If response is invalid
   */
  validateResponse(response) {
    const required = ['success', 'spec', 'request_id', 'timestamp', 'metadata'];
    
    for (const field of required) {
      if (response[field] === undefined) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    if (response.success && !response.response) {
      throw new Error('Response data required when success=true');
    }
    
    if (!response.success && !response.error) {
      throw new Error('Error data required when success=false');
    }
    
    return true;
  }

  /**
   * Create a success response
   * @protected
   * @param {Object} request - Original request
   * @param {Object} responseData - Response data
   * @param {Object} metadata - Response metadata
   * @returns {Object} SpecResponse object
   */
  createSuccessResponse(request, responseData, metadata = {}) {
    const response = {
      success: true,
      spec: this.id,
      request_id: request.id,
      timestamp: Date.now(),
      response: {
        text: responseData.text || '',
        format: responseData.format || 'markdown',
        structured: responseData.structured || {}
      },
      metadata: {
        processing_time_ms: metadata.processing_time_ms || 0,
        pattern_used: metadata.pattern_used || null,
        confidence: metadata.confidence || 0.5,
        tokens_used: metadata.tokens_used || 0,
        ...metadata
      }
    };

    // Add optional fields if present
    if (responseData.transition) {
      response.transition = responseData.transition;
    }

    if (responseData.context_update) {
      response.context_update = responseData.context_update;
    }

    this.validateResponse(response);
    return response;
  }

  /**
   * Create an error response
   * @protected
   * @param {Object} request - Original request
   * @param {string} code - Error code
   * @param {string} message - User-friendly error message
   * @param {Object} options - Additional error options
   * @returns {Object} SpecResponse object with error
   */
  createErrorResponse(request, code, message, options = {}) {
    const response = {
      success: false,
      spec: this.id,
      request_id: request.id,
      timestamp: Date.now(),
      error: {
        code: code,
        message: message,
        details: options.details || '',
        recoverable: options.recoverable !== undefined ? options.recoverable : true,
        fallback_spec: options.fallback_spec || null
      },
      metadata: {
        processing_time_ms: options.processing_time_ms || 0,
        pattern_used: null,
        confidence: 0.0
      }
    };

    this.validateResponse(response);
    return response;
  }

  /**
   * Get spec ID
   * @returns {string} Spec ID
   */
  getId() {
    return this.id;
  }

  /**
   * Get contract version
   * @returns {string} Contract version
   */
  getContractVersion() {
    return this.contractVersion;
  }

  /**
   * Log processing information
   * @protected
   * @param {string} level - Log level (info, warn, error)
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      spec: this.id,
      level,
      message,
      ...data
    };

    // In production, this would go to a proper logging system
    if (level === 'error') {
      console.error(`[${timestamp}] [${this.id}] ERROR:`, message, data);
    } else if (level === 'warn') {
      console.warn(`[${timestamp}] [${this.id}] WARN:`, message, data);
    } else {
      console.log(`[${timestamp}] [${this.id}] INFO:`, message, data);
    }
  }

  /**
   * Extract conversation context from request
   * @protected
   * @param {Object} request - Request object
   * @returns {Object} Conversation context
   */
  getConversationContext(request) {
    return {
      hasHistory: !!(request.conversation && request.conversation.history),
      messageCount: request.conversation?.message_count || 0,
      previousSpec: request.conversation?.previous_spec || null,
      history: request.conversation?.history || []
    };
  }

  /**
   * Extract user context from request
   * @protected
   * @param {Object} request - Request object
   * @returns {Object} User context
   */
  getUserContext(request) {
    return {
      emotionalState: request.user?.emotional_state || null,
      engagementLevel: request.user?.engagement_level || 'medium',
      preferences: request.user?.preferences || {},
      language: request.user?.preferences?.language || 'es'
    };
  }

  /**
   * Check if request text is too short
   * @protected
   * @param {string} text - Text to check
   * @param {number} minLength - Minimum length (default: 3)
   * @returns {boolean} True if too short
   */
  isTextTooShort(text, minLength = 3) {
    return text.trim().length < minLength;
  }

  /**
   * Check if request text is too long
   * @protected
   * @param {string} text - Text to check
   * @param {number} maxLength - Maximum length (default: 5000)
   * @returns {boolean} True if too long
   */
  isTextTooLong(text, maxLength = 5000) {
    return text.trim().length > maxLength;
  }

  /**
   * Sanitize text input
   * @protected
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  sanitizeText(text) {
    return text
      .trim()
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/[^\w\s\.,;:¿?¡!áéíóúñÁÉÍÓÚÑüÜ()-]/g, '');  // Remove special chars
  }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpecInterface;
}
