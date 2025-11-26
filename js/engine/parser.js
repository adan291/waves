/**
 * Parser Module
 * Handles parsing of JSON responses from Gemini API
 * 
 * @module engine/parser
 */

/**
 * Persona type constants
 * @enum {string}
 */
const PERSONA_TYPES = {
    NARRADOR: 'narrador',
    KIRO: 'kiro',
    LIFE_QUESTIONING: 'life_questioning'
};

/**
 * Clean JSON response by removing markdown code blocks
 * @param {string} text - Raw response text
 * @returns {string} Cleaned text
 */
function cleanJsonResponse(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    return text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
}

/**
 * Parse narrador response (JSON format)
 * @param {string} responseText - Raw response from Gemini
 * @returns {Object|null} Parsed response or null on error
 */
function parseNarradorResponse(responseText) {
    if (!responseText || typeof responseText !== 'string') {
        console.error('parseNarradorResponse: Invalid input');
        return null;
    }
    
    try {
        const cleaned = cleanJsonResponse(responseText);
        const parsed = JSON.parse(cleaned);
        
        if (!validateResponse(parsed, 'narrador')) {
            console.error('parseNarradorResponse: Invalid structure');
            return null;
        }
        
        console.log('✅ Narrador response parsed successfully');
        return parsed;
        
    } catch (error) {
        console.error('parseNarradorResponse: Parse error', error);
        
        return {
            scene: responseText,
            invitation: 'La marea espera tu próximo paso...',
            kiro_instruction: 'Continuar con reflexión emocional'
        };
    }
}

/**
 * Parse kiro response (JSON format)
 * @param {string} responseText - Raw response from Gemini
 * @returns {Object|null} Parsed response or null on error
 */
function parseKiroResponse(responseText) {
    if (!responseText || typeof responseText !== 'string') {
        console.error('parseKiroResponse: Invalid input');
        return null;
    }
    
    try {
        const cleaned = cleanJsonResponse(responseText);
        const parsed = JSON.parse(cleaned);
        
        if (!validateResponse(parsed, 'kiro')) {
            console.error('parseKiroResponse: Invalid structure');
            return null;
        }
        
        console.log('✅ Kiro response parsed successfully');
        return parsed;
        
    } catch (error) {
        console.error('parseKiroResponse: Parse error', error);
        
        return {
            whisper: responseText,
            reflection: '¿Qué resuena en ti con estas palabras?'
        };
    }
}

/**
 * Validate response structure
 * @param {Object} parsed - Parsed JSON object
 * @param {string} persona - 'narrador', 'kiro', or 'life_questioning'
 * @returns {boolean} True if valid
 */
function validateResponse(parsed, persona) {
    if (!parsed || typeof parsed !== 'object') {
        return false;
    }
    
    if (persona === PERSONA_TYPES.NARRADOR) {
        return (
            typeof parsed.scene === 'string' &&
            typeof parsed.invitation === 'string' &&
            typeof parsed.kiro_instruction === 'string'
        );
    }
    
    if (persona === PERSONA_TYPES.KIRO || persona === PERSONA_TYPES.LIFE_QUESTIONING) {
        return (
            typeof parsed.whisper === 'string' &&
            typeof parsed.reflection === 'string'
        );
    }
    
    return false;
}

/**
 * Parse any response (auto-detect persona)
 * @param {string} responseText - Raw response from Gemini
 * @param {string} personaHint - Optional hint for expected persona ('narrador', 'kiro', 'life_questioning')
 * @returns {Object|null} Parsed response with persona info
 */
function parseResponse(responseText, personaHint = null) {
    if (!responseText) {
        return null;
    }
    
    const isKiroHint = personaHint === PERSONA_TYPES.KIRO || 
                       personaHint === PERSONA_TYPES.LIFE_QUESTIONING;
    
    // Try Kiro first if hinted
    if (isKiroHint) {
        const kiroParsed = parseKiroResponse(responseText);
        if (kiroParsed && kiroParsed.whisper) {
            return {
                persona: PERSONA_TYPES.KIRO,
                ...kiroParsed
            };
        }
    }
    
    // Try narrador format
    const narradorParsed = parseNarradorResponse(responseText);
    if (narradorParsed && narradorParsed.scene) {
        return {
            persona: PERSONA_TYPES.NARRADOR,
            ...narradorParsed
        };
    }
    
    // Try kiro format if not already tried
    if (!isKiroHint) {
        const kiroParsed = parseKiroResponse(responseText);
        if (kiroParsed && kiroParsed.whisper) {
            return {
                persona: PERSONA_TYPES.KIRO,
                ...kiroParsed
            };
        }
    }
    
    // Fallback
    return {
        persona: PERSONA_TYPES.KIRO,
        whisper: responseText,
        reflection: '¿Qué resuena en ti?'
    };
}

/**
 * Test function to verify parser module
 * Run in browser console: testParserModule()
 */
