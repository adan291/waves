/**
 * Error Handler Module
 * Centralized error handling with ocean-themed messages
 * 
 * @module core/errorHandler
 */

/**
 * Error types enumeration
 * @enum {string}
 */
const ErrorTypes = {
    API_ERROR: 'api_error',
    NETWORK_ERROR: 'network_error',
    VALIDATION_ERROR: 'validation_error',
    PARSING_ERROR: 'parsing_error',
    AUDIO_ERROR: 'audio_error',
    UNKNOWN_ERROR: 'unknown_error'
};

/**
 * Error severity levels
 * @enum {string}
 */
const ErrorSeverity = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

/**
 * Ocean-themed error messages
 * @private
 */
const ERROR_MESSAGES = {
    [ErrorTypes.API_ERROR]: {
        401: 'Las corrientes no reconocen tu llamado. Verifica tu clave API.',
        429: 'El océano necesita un momento para descansar. Intenta de nuevo pronto.',
        500: 'Las profundidades encuentran turbulencia. El servicio está temporalmente indisponible.',
        default: 'Las olas encuentran resistencia inesperada.'
    },
    [ErrorTypes.NETWORK_ERROR]: 'Las olas están en silencio. Verifica tu conexión.',
    [ErrorTypes.VALIDATION_ERROR]: 'El mensaje no puede fluir. Verifica tu entrada.',
    [ErrorTypes.PARSING_ERROR]: 'Las palabras del océano son difíciles de interpretar.',
    [ErrorTypes.AUDIO_ERROR]: 'El susurro del mar no puede ser escuchado en este momento.',
    [ErrorTypes.UNKNOWN_ERROR]: 'Una corriente desconocida interrumpe el flujo.'
};

/**
 * Custom error class for application errors
 */
class OceanError extends Error {
    /**
     * Create an OceanError
     * @param {string} message - Error message
     * @param {string} type - Error type from ErrorTypes
     * @param {string} severity - Error severity from ErrorSeverity
     * @param {Error} originalError - Original error object
     */
    constructor(message, type = ErrorTypes.UNKNOWN_ERROR, severity = ErrorSeverity.MEDIUM, originalError = null) {
        super(message);
        this.name = 'OceanError';
        this.type = type;
        this.severity = severity;
        this.originalError = originalError;
        this.timestamp = Date.now();
    }
}

/**
 * Handle error and return user-friendly message
 * @param {Error|OceanError} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Error response object
 * 
 * @example
 * const errorResponse = handleError(error, 'API call');
 */
function handleError(error, context = 'Unknown') {
    // Log error for debugging
    console.error(`🌊 Error in ${context}:`, error);

    // Emit error event if events module available
    if (typeof emit !== 'undefined') {
        emit('error:occurred', {
            error,
            context,
            timestamp: Date.now()
        });
    }

    // Determine error type and message
    let errorType = ErrorTypes.UNKNOWN_ERROR;
    let userMessage = ERROR_MESSAGES[ErrorTypes.UNKNOWN_ERROR];
    let severity = ErrorSeverity.MEDIUM;

    if (error instanceof OceanError) {
        errorType = error.type;
        userMessage = error.message;
        severity = error.severity;
    } else if (error.message) {
        // Parse common error patterns
        if (error.message.includes('401') || error.message.includes('API key')) {
            errorType = ErrorTypes.API_ERROR;
            userMessage = ERROR_MESSAGES[ErrorTypes.API_ERROR][401];
            severity = ErrorSeverity.HIGH;
        } else if (error.message.includes('429')) {
            errorType = ErrorTypes.API_ERROR;
            userMessage = ERROR_MESSAGES[ErrorTypes.API_ERROR][429];
            severity = ErrorSeverity.MEDIUM;
        } else if (error.message.includes('500') || error.message.includes('503')) {
            errorType = ErrorTypes.API_ERROR;
            userMessage = ERROR_MESSAGES[ErrorTypes.API_ERROR][500];
            severity = ErrorSeverity.HIGH;
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorType = ErrorTypes.NETWORK_ERROR;
            userMessage = ERROR_MESSAGES[ErrorTypes.NETWORK_ERROR];
            severity = ErrorSeverity.HIGH;
        }
    }

    return {
        type: errorType,
        message: userMessage,
        severity,
        timestamp: Date.now(),
        originalError: error
    };
}

/**
 * Create API error
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {OceanError} API error
 */
function createApiError(statusCode, message) {
    const errorMessage = ERROR_MESSAGES[ErrorTypes.API_ERROR][statusCode] 
        || ERROR_MESSAGES[ErrorTypes.API_ERROR].default;
    
    return new OceanError(
        errorMessage,
        ErrorTypes.API_ERROR,
        statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
        new Error(message)
    );
}

/**
 * Create network error
 * @param {Error} originalError - Original error
 * @returns {OceanError} Network error
 */
function createNetworkError(originalError) {
    return new OceanError(
        ERROR_MESSAGES[ErrorTypes.NETWORK_ERROR],
        ErrorTypes.NETWORK_ERROR,
        ErrorSeverity.HIGH,
        originalError
    );
}

/**
 * Create validation error
 * @param {string} message - Validation error message
 * @returns {OceanError} Validation error
 */
function createValidationError(message) {
    return new OceanError(
        message || ERROR_MESSAGES[ErrorTypes.VALIDATION_ERROR],
        ErrorTypes.VALIDATION_ERROR,
        ErrorSeverity.LOW
    );
}

// ============================================
