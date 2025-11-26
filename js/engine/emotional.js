/**
 * Emotional Analysis Module
 * Analyzes emotional tone and suggests appropriate responses
 * 
 * @module engine/emotional
 */

/**
 * Emotional keywords dictionary
 * @private
 */
const emotionalKeywords = {
    lonely: ['solo', 'soledad', 'aislado', 'abandonado', 'nadie'],
    confused: ['confundido', 'perdido', 'no sé', 'duda', 'indeciso'],
    anxious: ['miedo', 'ansiedad', 'nervioso', 'preocupado', 'angustia'],
    sad: ['triste', 'tristeza', 'dolor', 'lloro', 'pena', 'melancolía'],
    hopeful: ['esperanza', 'luz', 'futuro', 'sueño', 'posible'],
    calm: ['calma', 'paz', 'tranquilo', 'sereno', 'quieto'],
    angry: ['enojo', 'rabia', 'ira', 'frustrado', 'molesto'],
    grateful: ['gracias', 'agradecido', 'gratitud', 'aprecio'],
    curious: ['pregunto', 'curioso', 'interesante', 'quiero saber'],
    determined: ['voy a', 'haré', 'decidido', 'determinado', 'seguro']
};

/**
 * Analyze emotional tone of message
 * @param {string} message - Message to analyze
 * @returns {Object} Analysis with tone, intensity, and keywords
 * 
 * @example
 * const analysis = analyzeEmotionalTone('Me siento solo y perdido');
 * console.log(analysis.tone); // 'lonely'
 * console.log(analysis.intensity); // 0.7
 */
function analyzeEmotionalTone(message) {
    if (!message || typeof message !== 'string') {
        return {
            tone: 'neutral',
            intensity: 0,
            keywords: [],
            emotions: []
        };
    }
    
    const lower = message.toLowerCase();
    const detectedEmotions = detectEmotions(lower);
    const intensity = calculateIntensity(lower);
    
    // Primary tone is the first detected emotion
    const primaryTone = detectedEmotions.length > 0 ? detectedEmotions[0] : 'neutral';
    
    // Extract matched keywords
    const matchedKeywords = [];
    for (const keywords of Object.values(emotionalKeywords)) {
        for (const keyword of keywords) {
            if (lower.includes(keyword)) {
                matchedKeywords.push(keyword);
            }
        }
    }
    
    const analysis = {
        tone: primaryTone,
        intensity,
        keywords: matchedKeywords,
        emotions: detectedEmotions
    };
    
    console.log('🎭 Emotional analysis:', analysis);
    
    return analysis;
}

/**
 * Detect emotions in text
 * @param {string} text - Text to analyze (lowercase)
 * @returns {Array<string>} List of detected emotions
 * 
 * @example
 * const emotions = detectEmotions('me siento solo y triste');
 * // Returns: ['lonely', 'sad']
 */
function detectEmotions(text) {
    const detected = [];
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                if (!detected.includes(emotion)) {
                    detected.push(emotion);
                }
                break;
            }
        }
    }
    
    return detected;
}

/**
 * Calculate emotional intensity (0-1)
 * @param {string} text - Text to analyze (lowercase)
 * @returns {number} Intensity from 0 to 1
 * 
 * @example
 * const intensity = calculateIntensity('me siento muy solo');
 * // Returns: ~0.7
 */
function calculateIntensity(text) {
    let intensity = 0;
    
    // Base intensity from keyword count
    const emotions = detectEmotions(text);
    intensity += emotions.length * 0.2;
    
    // Intensifiers
    const intensifiers = ['muy', 'mucho', 'demasiado', 'extremadamente', 'totalmente'];
    for (const intensifier of intensifiers) {
        if (text.includes(intensifier)) {
            intensity += 0.2;
        }
    }
    
    // Diminishers
    const diminishers = ['poco', 'algo', 'un poco', 'ligeramente'];
    for (const diminisher of diminishers) {
        if (text.includes(diminisher)) {
            intensity -= 0.1;
        }
    }
    
    // Exclamation marks
    const exclamations = (text.match(/!/g) || []).length;
    intensity += exclamations * 0.1;
    
    // Question marks (indicate uncertainty)
    const questions = (text.match(/\?/g) || []).length;
    intensity += questions * 0.05;
    
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, intensity));
}

/**
 * Suggest Guardian mode based on emotional analysis
 * @param {Object} emotionalAnalysis - Analysis from analyzeEmotionalTone
 * @returns {string} Suggested mode ('modoA', 'modoB', 'modoC', or 'default')
 * 
 * @example
 * const analysis = analyzeEmotionalTone(message);
 * const mode = suggestGuardianMode(analysis);
 * console.log('Suggested mode:', mode);
 */
function suggestGuardianMode(emotionalAnalysis) {
    if (!emotionalAnalysis || !emotionalAnalysis.tone) {
        return 'default';
    }
    
    const { tone, intensity, emotions } = emotionalAnalysis;
    
    // Modo C: Clarity guidance (confused, lost, seeking direction)
    if (tone === 'confused' || emotions.includes('confused')) {
        return 'modoC';
    }
    
    // Modo B: Emotional exploration (strong emotions)
    if (intensity > 0.6 && (
        tone === 'lonely' || 
        tone === 'sad' || 
        tone === 'anxious' ||
        emotions.length >= 2
    )) {
        return 'modoB';
    }
    
    // Modo A: Poetic scenes (calm, curious, or neutral)
    if (tone === 'calm' || tone === 'curious' || tone === 'hopeful') {
        return 'modoA';
    }
    
    // Default mode for everything else
    return 'default';
}


// ============================================
