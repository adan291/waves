# Design Document: Kiro Adaptive Assistance

## Overview

The Kiro Adaptive Assistance system introduces intelligent user state classification and adaptive response patterns to the Whispers of the Wave application. The system analyzes each user message to determine their emotional and mental state, then generates contextually appropriate responses using specialized patterns. This enhancement transforms Kiro from a reactive conversational AI into an emotionally intelligent assistant that adapts its approach based on user needs.

The system maintains the existing ocean/mystical aesthetic while adding a sophisticated classification layer that operates transparently to the user. All responses continue to use the established JSON format and integrate seamlessly with the existing Narrador/Kiro dual persona system.

## Architecture

### High-Level Architecture

```
User Message
    ↓
State Classifier → Determines User State
    ↓
Pattern Selector → Chooses Response Pattern
    ↓
Response Generator → Creates Structured Response
    ↓
JSON Output → { persona, mode, action, text, next_step }
```

### Integration with Existing System

The adaptive assistance system integrates as a new layer between message reception and response generation:

```
Existing Flow:
handleUserMessage() → GeminiService.sendMessage() → parseResponse() → displayMessage()

Enhanced Flow:
handleUserMessage() → StateClassifier.classify() → AdaptiveAssistance.generatePrompt() 
    → GeminiService.sendMessage() → ResponseParser.parse() → displayMessage()
```

### Module Structure

```
js/
├── core/
│   ├── adaptiveAssistance.js    # Main adaptive system orchestrator
│   ├── stateClassifier.js       # User state classification logic
│   └── responsePatterns.js      # Response pattern implementations
├── prompts/
│   └── adaptivePrompts.js       # Adaptive system prompts
└── services/
    └── geminiService.js         # (existing, no changes needed)
```

## Components and Interfaces

### 1. State Classifier

**Purpose:** Analyzes user messages to determine emotional and mental state.

**Interface:**
```javascript
class StateClassifier {
    /**
     * Classify user message into one of six states
     * @param {string} message - User's message text
     * @param {Object} context - Conversation context (history, emotional analysis)
     * @returns {Object} Classification result
     */
    classify(message, context) {
        return {
            state: 'LOST_DIRECTION',  // One of 6 states
            confidence: 0.85,          // 0-1 confidence score
            indicators: ['no sé qué estudiar'], // Matched patterns
            emotionalTone: 'confused'  // Detected emotion
        };
    }
}
```

**Classification Logic:**

1. **Pattern Matching:** Uses regex patterns to detect keywords and phrases
2. **Emotional Analysis:** Integrates with existing `analyzeEmotionalTone()` function
3. **Context Awareness:** Considers conversation history and previous states
4. **Priority System:** EMOTIONAL_LOW takes precedence when multiple states match

**State Detection Patterns:**

```javascript
const STATE_PATTERNS = {
    LOST_DIRECTION: [
        /no s[eé] qu[eé] estudiar/i,
        /no s[eé] qu[eé] hacer con mi vida/i,
        /estoy perdido/i,
        /no tengo direcci[oó]n/i,
        /qu[eé] camino seguir/i
    ],
    EMOTIONAL_LOW: [
        /me siento (triste|mal|deprimido|ansioso)/i,
        /estoy (agotado|exhausto|desesperado)/i,
        /no puedo m[aá]s/i,
        /todo est[aá] mal/i
    ],
    SEEKING_DECISION: [
        /cu[aá]l es mejor/i,
        /no s[eé] si (.*) o (.*)/i,
        /deber[ií]a elegir/i,
        /qu[eé] opci[oó]n/i,
        /ayuda a decidir/i
    ],
    NEED_ORIENTATION: [
        /qu[eé] puedo hacer/i,
        /qu[eé] pasos sigo/i,
        /c[oó]mo empiezo/i,
        /necesito gu[ií]a/i,
        /qu[eé] hago ahora/i
    ],
    SELF_EXPRESSION: [
        /necesito (hablar|desahogarme|expresar)/i,
        /solo quiero (contar|compartir)/i,
        /escucha esto/i
    ],
    NEUTRAL_CHAT: [] // Default when no other patterns match
};
```

### 2. Response Patterns

**Purpose:** Implements the five specialized response patterns plus neutral chat handling.

**Interface:**
```javascript
class ResponsePatterns {
    /**
     * Generate pattern-specific system prompt
     * @param {string} patternName - Name of the pattern
     * @param {Object} context - User context and conversation history
     * @returns {string} System prompt for Gemini
     */
    getPrompt(patternName, context) { }
    
    /**
     * Validate response follows pattern requirements
     * @param {Object} response - Parsed response object
     * @param {string} patternName - Expected pattern
     * @returns {boolean} Whether response is valid
     */
    validateResponse(response, patternName) { }
}
```

**Pattern Implementations:**

#### Life Questioning Engine
- **Activation:** LOST_DIRECTION state
- **Approach:** Progressive questioning (3-5 exchanges)
- **Structure:** 
  - Start with exploration (surface feelings)
  - Move to depth (fears and blocks)
  - Touch identity (core values)
  - End with action (practical steps)
- **Integration:** Extends existing Life Questioning mode
- **Output:** JSON with whisper + reflection

#### Emotional Soothing Pattern
- **Activation:** EMOTIONAL_LOW state
- **Approach:** Reflect → Normalize → Comfort → Gentle question
- **Ocean Metaphors:** "olas que vienen y van", "corrientes temporales", "marea baja"
- **Validation:** Must NOT include Life Questioning activation
- **Output:** JSON with whisper + reflection

#### Decision Matrix Pattern
- **Activation:** SEEKING_DECISION state
- **Approach:** 
  1. Ask what options they have
  2. Ask what matters most to them
  3. Present consequences without pressure
  4. Include emotional impact consideration
- **Tone:** Calm, non-directive, exploratory
- **Output:** JSON with whisper + reflection

#### Action Roadmap Generator
- **Activation:** NEED_ORIENTATION state
- **Approach:** Provide 3-5 simple, achievable actions
- **Structure:**
  - Today: One immediate micro-action
  - This week: 1-2 small steps
  - This month: 1-2 larger goals
- **Closing:** Focusing question to help prioritize
- **Output:** JSON with whisper + reflection

#### Reflective Mirror Pattern
- **Activation:** SELF_EXPRESSION state
- **Approach:** 
  1. Repeat essence of what user said
  2. Reflect their emotion
  3. Simple follow-up question
- **Constraint:** NO solutions or guidance
- **Output:** JSON with whisper + reflection

#### Neutral Chat Handler
- **Activation:** NEUTRAL_CHAT state
- **Approach:** Brief, contextually appropriate response
- **Tone:** Maintains Kiro voice without deep patterns
- **Output:** JSON with whisper + reflection

### 3. Adaptive Assistance Orchestrator

**Purpose:** Coordinates state classification, pattern selection, and response generation.

**Interface:**
```javascript
class AdaptiveAssistance {
    constructor(stateClassifier, responsePatterns) {
        this.stateClassifier = stateClassifier;
        this.responsePatterns = responsePatterns;
        this.stateHistory = [];
    }
    
    /**
     * Process user message and generate adaptive response
     * @param {string} message - User's message
     * @param {Object} conversationContext - Full conversation context
     * @returns {Promise<Object>} Structured response
     */
    async process(message, conversationContext) {
        // 1. Classify state
        const classification = this.stateClassifier.classify(message, conversationContext);
        
        // 2. Track state changes
        this.trackStateChange(classification.state);
        
        // 3. Get appropriate prompt
        const systemPrompt = this.responsePatterns.getPrompt(
            classification.state,
            conversationContext
        );
        
        // 4. Generate response via Gemini
        const response = await this.generateResponse(message, systemPrompt, conversationContext);
        
        // 5. Structure output
        return this.structureOutput(response, classification);
    }
    
    /**
     * Structure response into required JSON format
     * @param {string} responseText - Raw response from Gemini
     * @param {Object} classification - State classification result
     * @returns {Object} Structured output
     */
    structureOutput(responseText, classification) {
        const parsed = JSON.parse(responseText);
        
        return {
            persona: 'kiro',
            mode: classification.state,
            action: this.getActionName(classification.state),
            text: {
                whisper: parsed.whisper,
                reflection: parsed.reflection
            },
            next_step: this.determineNextStep(classification.state, parsed)
        };
    }
}
```

### 4. Adaptive Prompts Module

**Purpose:** Stores all system prompts for the adaptive patterns.

**Structure:**
```javascript
const ADAPTIVE_PROMPTS = {
    LOST_DIRECTION: `[Life Questioning Engine prompt]`,
    EMOTIONAL_LOW: `[Emotional Soothing Pattern prompt]`,
    SEEKING_DECISION: `[Decision Matrix Pattern prompt]`,
    NEED_ORIENTATION: `[Action Roadmap Generator prompt]`,
    SELF_EXPRESSION: `[Reflective Mirror Pattern prompt]`,
    NEUTRAL_CHAT: `[Neutral Chat Handler prompt]`
};
```

Each prompt includes:
- Role definition
- Pattern-specific instructions
- Ocean aesthetic requirements
- JSON output format specification
- Example responses

## Data Models

### Classification Result
```javascript
{
    state: 'LOST_DIRECTION',        // User state enum
    confidence: 0.85,                // Confidence score (0-1)
    indicators: ['no sé qué'],       // Matched patterns
    emotionalTone: 'confused',       // Detected emotion
    timestamp: 1699999999999         // Classification time
}
```

### Adaptive Response Output
```javascript
{
    persona: 'kiro',                 // Always 'kiro'
    mode: 'LOST_DIRECTION',          // Current user state
    action: 'life_questioning',      // Pattern used
    text: {
        whisper: 'Las olas...',      // Poetic reflection (2-4 lines)
        reflection: '¿Qué...'        // Question/insight (1-2 lines)
    },
    next_step: 'Continue exploring fears' // Internal guidance
}
```

### State History Entry
```javascript
{
    state: 'EMOTIONAL_LOW',
    timestamp: 1699999999999,
    message: 'Me siento muy triste',
    transitionFrom: 'NEUTRAL_CHAT'
}
```

### Conversation Context
```javascript
{
    history: [                       // Message history
        { role: 'user', content: '...', timestamp: ... },
        { role: 'assistant', content: '...', timestamp: ... }
    ],
    emotionalContext: {              // From existing analyzeEmotionalTone()
        tone: 'sad',
        intensity: 0.7,
        keywords: ['triste', 'solo'],
        emotions: ['sadness', 'loneliness']
    },
    currentPersona: 'kiro',          // Current persona
    stateHistory: [],                // Previous states
    lifeQuestioningState: {          // Existing LQ state
        active: false,
        currentLevel: null
    }
}
```

## Error Handling

### Classification Errors

**Scenario:** Unable to determine user state
- **Fallback:** Default to NEUTRAL_CHAT
- **Logging:** Log ambiguous message for pattern improvement
- **User Experience:** No disruption, conversation continues naturally

**Scenario:** Multiple states match with equal confidence
- **Resolution:** Apply priority system (EMOTIONAL_LOW > others)
- **Logging:** Log multi-match for analysis
- **User Experience:** Prioritize emotional support

### Response Generation Errors

**Scenario:** Gemini API returns invalid JSON
- **Fallback:** Use existing error handling from GeminiService
- **Retry:** Attempt to parse with lenient parser
- **User Experience:** Display ocean-themed error message

**Scenario:** Response doesn't match pattern requirements
- **Validation:** Check response structure before display
- **Fallback:** Reformat response to match pattern
- **Logging:** Log validation failure for prompt improvement

### State Transition Errors

**Scenario:** Rapid state changes (user switches topics quickly)
- **Handling:** Allow immediate state transitions
- **Validation:** Ensure emotional validation occurs before questioning
- **User Experience:** Smooth adaptation to new state

## Testing Strategy

### Unit Tests

**State Classifier Tests:**
- Test each state pattern with positive examples
- Test negative examples (should not match)
- Test multi-language support (Spanish primary, English fallback)
- Test edge cases (empty messages, very long messages)
- Test confidence scoring accuracy

**Response Pattern Tests:**
- Test each pattern generates valid JSON
- Test ocean metaphor inclusion
- Test response length constraints
- Test pattern-specific requirements (e.g., no solutions in SELF_EXPRESSION)

**Adaptive Assistance Tests:**
- Test state tracking and history
- Test state transition logic
- Test output structuring
- Test integration with existing system

### Integration Tests

**End-to-End Flow:**
1. User sends message → State classified → Pattern selected → Response generated → Output structured
2. Test with each of the 6 user states
3. Test state transitions (EMOTIONAL_LOW → LOST_DIRECTION)
4. Test conversation continuity across states

**Existing System Integration:**
- Test compatibility with Narrador/Kiro dual system
- Test Life Questioning mode integration
- Test emotional analysis integration
- Test conversation history preservation

### Manual Testing Scenarios

**Scenario 1: Lost Direction**
- User: "No sé qué estudiar"
- Expected: LOST_DIRECTION → Life Questioning Engine
- Validation: Progressive questions, ocean metaphors, JSON output

**Scenario 2: Emotional Support**
- User: "Me siento muy triste y solo"
- Expected: EMOTIONAL_LOW → Emotional Soothing
- Validation: No questioning, comfort focus, gentle closing

**Scenario 3: Decision Help**
- User: "No sé si estudiar medicina o ingeniería"
- Expected: SEEKING_DECISION → Decision Matrix
- Validation: Explores options, values, consequences

**Scenario 4: Practical Guidance**
- User: "¿Qué pasos puedo seguir?"
- Expected: NEED_ORIENTATION → Action Roadmap
- Validation: 3-5 actions, timeframes, focusing question

**Scenario 5: Self-Expression**
- User: "Solo necesito desahogarme..."
- Expected: SELF_EXPRESSION → Reflective Mirror
- Validation: Reflection only, no solutions

**Scenario 6: State Transition**
- User starts with EMOTIONAL_LOW, then shifts to LOST_DIRECTION
- Expected: Smooth transition with emotional validation
- Validation: System adapts without jarring changes

### Performance Testing

**Classification Speed:**
- Target: < 50ms for state classification
- Method: Benchmark with 100 sample messages

**Response Generation:**
- Target: Maintain existing response times
- Method: Compare before/after adaptive system integration

**Memory Usage:**
- Target: < 5MB additional memory for state history
- Method: Monitor state history array growth

## Implementation Notes

### Phase 1: Core Infrastructure
1. Create StateClassifier with pattern matching
2. Create ResponsePatterns with all 6 patterns
3. Create AdaptiveAssistance orchestrator
4. Create adaptivePrompts module

### Phase 2: Integration
1. Integrate StateClassifier into handleUserMessage()
2. Connect AdaptiveAssistance to GeminiService
3. Update response parsing to handle new output format
4. Preserve existing Life Questioning mode compatibility

### Phase 3: Enhancement
1. Add state history tracking
2. Implement state transition validation
3. Add confidence scoring refinement
4. Implement pattern validation

### Phase 4: Testing & Refinement
1. Run unit tests for all components
2. Conduct integration testing
3. Perform manual testing scenarios
4. Refine patterns based on results

### Backward Compatibility

The system maintains full backward compatibility:
- Existing Narrador/Kiro system continues to work
- Life Questioning mode integrates seamlessly
- Conversation history format unchanged
- UI components require no modifications
- GeminiService interface unchanged

### Configuration

Optional configuration for fine-tuning:
```javascript
const ADAPTIVE_CONFIG = {
    enableStateTracking: true,
    confidenceThreshold: 0.6,
    maxStateHistory: 50,
    enableMultiLanguage: true,
    defaultState: 'NEUTRAL_CHAT',
    emotionalPriority: true
};
```

## Future Enhancements

1. **Machine Learning Classification:** Replace regex patterns with ML model for improved accuracy
2. **Multi-Language Support:** Extend patterns to English, Portuguese, French
3. **Personalization:** Learn user preferences over time
4. **Analytics Dashboard:** Track state distributions and pattern effectiveness
5. **Voice Integration:** Adapt patterns for speech-to-text input
6. **Context Persistence:** Save state history across sessions
