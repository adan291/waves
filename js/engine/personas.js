/**
 * Personas Module
 * Manages alternation between narrador and kiro personas
 * 
 * @module engine/personas
 */

/**
 * Persona state
 * @private
 */
const personaState = {
    current: 'narrador',  // Start with narrador
    turnCount: 0,
    lastSwitch: Date.now()
};

/**
 * Get current persona
 * @returns {string} 'narrador' or 'kiro'
 * 
 * @example
 * const persona = getCurrentPersona();
 * console.log(persona); // 'narrador' or 'kiro'
 */
function getCurrentPersona() {
    return personaState.current;
}

/**
 * Switch to the other persona
 * @returns {string} New active persona
 * 
 * @example
 * const newPersona = switchPersona();
 * console.log('Switched to:', newPersona);
 */
function switchPersona() {
    const previous = personaState.current;
    personaState.current = personaState.current === 'narrador' ? 'kiro' : 'narrador';
    personaState.lastSwitch = Date.now();
    
    console.log(`🔄 Persona switched: ${previous} → ${personaState.current}`);
    
    // Emit event if events module is available
    if (typeof emit !== 'undefined') {
        emit('persona:switched', {
            from: previous,
            to: personaState.current,
            turnCount: personaState.turnCount
        });
    }
    
    // Update state if state module is available
    if (typeof setState !== 'undefined') {
        setState({ currentPersona: personaState.current });
    }
    
    return personaState.current;
}

/**
 * Set persona explicitly
 * @param {string} persona - 'narrador' or 'kiro'
 * @returns {boolean} True if set successfully
 * 
 * @example
 * setPersona('kiro');
 */
function setPersona(persona) {
    if (persona !== 'narrador' && persona !== 'kiro') {
        console.error('setPersona: Invalid persona', persona);
        return false;
    }
    
    if (personaState.current !== persona) {
        const previous = personaState.current;
        personaState.current = persona;
        personaState.lastSwitch = Date.now();
        
        console.log(`🎭 Persona set: ${previous} → ${persona}`);
        
        // Emit event
        if (typeof emit !== 'undefined') {
            emit('persona:switched', {
                from: previous,
                to: persona,
                turnCount: personaState.turnCount
            });
        }
        
        // Update state
        if (typeof setState !== 'undefined') {
            setState({ currentPersona: persona });
        }
    }
    
    return true;
}

/**
 * Determine if should alternate based on context
 * @returns {boolean} True if should alternate
 * 
 * @example
 * if (shouldAlternate()) {
 *   switchPersona();
 * }
 */
function shouldAlternate() {
    // Always alternate after each response
    // Narrador creates scene → Kiro reflects → Narrador continues → etc.
    return true;
}

/**
 * Increment turn count
 * @returns {number} New turn count
 */
function incrementTurnCount() {
    personaState.turnCount++;
    
    // Update state if available
    if (typeof setState !== 'undefined') {
        setState({ turnCount: personaState.turnCount });
    }
    
    return personaState.turnCount;
}

/**
 * Get turn count
 * @returns {number} Current turn count
 */
function getTurnCount() {
    return personaState.turnCount;
}

/**
 * Reset persona state
 * 
 * @example
 * resetPersonaState();
 */
function resetPersonaState() {
    personaState.current = 'narrador';
    personaState.turnCount = 0;
    personaState.lastSwitch = Date.now();
    
    console.log('🔄 Persona state reset');
    
    // Update state if available
    if (typeof setState !== 'undefined') {
        setState({ 
            currentPersona: 'narrador',
            turnCount: 0
        });
    }
}

/**
 * Parse kiro instruction from narrador response
 * @param {string} kiroInstruction - Instruction text
 * @returns {Object} Parsed instruction with tone and guidance
 * 
 * @example
 * const instruction = parseKiroInstruction('Ofrecer consuelo sobre soledad');
 * console.log(instruction.emotionalTone); // 'lonely'
 */
function parseKiroInstruction(kiroInstruction) {
    if (!kiroInstruction || typeof kiroInstruction !== 'string') {
        return {
            emotionalTone: 'neutral',
            guidance: 'Continuar con reflexión'
        };
    }
    
    const lower = kiroInstruction.toLowerCase();
    
    // Detect emotional tone from instruction
    let emotionalTone = 'neutral';
    
    if (lower.includes('soledad') || lower.includes('solo')) {
        emotionalTone = 'lonely';
    } else if (lower.includes('confus') || lower.includes('perdido')) {
        emotionalTone = 'confused';
    } else if (lower.includes('miedo') || lower.includes('ansiedad')) {
        emotionalTone = 'anxious';
    } else if (lower.includes('tristeza') || lower.includes('dolor')) {
        emotionalTone = 'sad';
    } else if (lower.includes('esperanza') || lower.includes('luz')) {
        emotionalTone = 'hopeful';
    } else if (lower.includes('calma') || lower.includes('paz')) {
        emotionalTone = 'calm';
    }
    
    return {
        emotionalTone,
        guidance: kiroInstruction
    };
}


// ============================================
