/**
 * Whispers of the Wave - Spec Adapter
 * 
 * Handles emotional, introspective, and poetic conversations
 * with an ocean-inspired aesthetic.
 */

const SpecInterface = require('../whispers-main/spec_interface.js');

class WhispersOfTheWaveAdapter extends SpecInterface {
  constructor() {
    super('whispers-of-the-wave');
    
    this.capabilities = {
      contract_version: '1.0.0',
      name: 'Whispers of the Wave',
      description: 'Emotional support and introspective guidance with ocean-inspired responses',
      supported_intents: [
        'emotional_support',
        'life_questioning',
        'existential_reflection',
        'seeking_peace',
        'processing_emotions',
        'introspection',
        'poetic_expression',
        'philosophical_inquiry'
      ],
      response_formats: ['markdown', 'text'],
      features: {
        dual_response: true,  // Whispers + Waves
        poetic_style: true,
        emotional_intelligence: true,
        ocean_metaphors: true
      }
    };
  }

  /**
   * Check if this spec can handle the request
   */
  canHandle(request) {
    try {
      this.validateRequest(request);
      
      const context = request.context;
      const text = request.text.toLowerCase();
      
      // High confidence if routed here with good confidence
      if (request.routing.confidence > 0.7) {
        return {
          canHandle: true,
          confidence: request.routing.confidence,
          reason: 'High routing confidence for emotional/introspective content'
        };
      }

      // Check for emotional keywords
      const emotionalKeywords = [
        'siento', 'sentir', 'emoción', 'solo', 'triste', 'perdido',
        'vida', 'existencia', 'sentido', 'propósito', 'vacío',
        'corazón', 'alma', 'dolor', 'miedo', 'ansiedad'
      ];
      
      const hasEmotionalKeywords = emotionalKeywords.some(kw => text.includes(kw));
      
      if (hasEmotionalKeywords) {
        return {
          canHandle: true,
          confidence: 0.75,
          reason: 'Emotional keywords detected'
        };
      }

      // Medium confidence for general introspective content
      if (context.detected_intent === 'introspection' || 
          context.detected_intent === 'philosophical_inquiry') {
        return {
          canHandle: true,
          confidence: 0.6,
          reason: 'Introspective intent detected'
        };
      }

      // Low confidence - can handle as default but not ideal
      return {
        canHandle: true,
        confidence: 0.4,
        reason: 'Can provide general support'
      };
      
    } catch (error) {
      this.log('error', 'Error in canHandle', { error: error.message });
      return {
        canHandle: false,
        confidence: 0,
        reason: `Validation error: ${error.message}`
      };
    }
  }

  /**
   * Process the request and generate response
   */
  async process(request) {
    const startTime = Date.now();
    
    try {
      this.validateRequest(request);
      
      // Check if text is too short
      if (this.isTextTooShort(request.text, 2)) {
        return this.createErrorResponse(
          request,
          'INSUFFICIENT_CONTEXT',
          'Cuéntame un poco más... Las olas necesitan espacio para formarse.',
          {
            details: 'Text too short for meaningful response',
            recoverable: true,
            fallback_spec: null
          }
        );
      }

      // Check if text is too long
      if (this.isTextTooLong(request.text, 2000)) {
        return this.createErrorResponse(
          request,
          'TEXT_TOO_LONG',
          'Tu mensaje es muy extenso. ¿Podrías resumir lo más importante?',
          {
            details: 'Text exceeds maximum length',
            recoverable: true,
            fallback_spec: null
          }
        );
      }

      // Get conversation and user context
      const convContext = this.getConversationContext(request);
      const userContext = this.getUserContext(request);

      // Determine pattern to use
      const pattern = this._selectPattern(request);
      
      // Generate response based on pattern
      const responseData = await this._generateResponse(request, pattern, convContext, userContext);
      
      // Check if we should suggest transition
      const transition = this._checkTransition(request, responseData);
      if (transition) {
        responseData.transition = transition;
      }

      const processingTime = Date.now() - startTime;
      
      return this.createSuccessResponse(
        request,
        responseData,
        {
          processing_time_ms: processingTime,
          pattern_used: pattern,
          confidence: responseData.confidence || 0.8,
          tokens_used: this._estimateTokens(responseData.text)
        }
      );
      
    } catch (error) {
      this.log('error', 'Error processing request', { 
        error: error.message,
        request_id: request.id 
      });
      
      const processingTime = Date.now() - startTime;
      
      return this.createErrorResponse(
        request,
        'PROCESSING_ERROR',
        'Las olas se han agitado... Dame un momento para calmarlas.',
        {
          details: error.message,
          recoverable: true,
          fallback_spec: 'kiro-adaptive-assistance',
          processing_time_ms: processingTime
        }
      );
    }
  }

  /**
   * Get spec capabilities
   */
  getCapabilities() {
    return this.capabilities;
  }

  /**
   * Select appropriate pattern based on request
   * @private
   */
  _selectPattern(request) {
    const suggestedPattern = request.context.suggested_pattern;
    const detectedIntent = request.context.detected_intent;
    
    // Use suggested pattern if available
    if (suggestedPattern && suggestedPattern !== 'unclear') {
      return suggestedPattern;
    }

    // Map intents to patterns
    const intentPatternMap = {
      'emotional_support': 'emotional_low',
      'life_questioning': 'life_questioning',
      'existential_reflection': 'philosophical_inquiry',
      'seeking_peace': 'seeking_comfort',
      'processing_emotions': 'emotional_low',
      'introspection': 'introspection',
      'philosophical_inquiry': 'philosophical_inquiry'
    };

    return intentPatternMap[detectedIntent] || 'general_support';
  }

  /**
   * Generate response based on pattern
   * @private
   */
  async _generateResponse(request, pattern, convContext, userContext) {
    const text = request.text;
    
    // In a real implementation, this would call the Gemini API
    // For now, we'll create structured responses based on patterns
    
    let whisper = '';
    let wave = '';
    let confidence = 0.8;

    switch (pattern) {
      case 'emotional_low':
        whisper = '_Como olas que buscan la orilla en la tormenta..._';
        wave = 'Entiendo que te sientes así. A veces, perderse es el primer paso para encontrarse. Las olas también se pierden en el océano, pero siempre encuentran su camino de regreso.';
        confidence = 0.85;
        break;

      case 'life_questioning':
        whisper = '_¿Qué sentido tiene todo esto?_';
        wave = 'Las grandes preguntas no siempre tienen respuestas inmediatas. Como el océano, la vida es profunda y misteriosa. Pero en esa profundidad también hay belleza y propósito esperando ser descubiertos.';
        confidence = 0.9;
        break;

      case 'seeking_comfort':
        whisper = '_No estás solo en este océano..._';
        wave = 'Aunque a veces nos sintamos como una gota en el océano, cada gota es parte de algo más grande. Tu presencia importa, y está bien pedir ayuda cuando las olas se vuelven difíciles de navegar.';
        confidence = 0.88;
        break;

      case 'philosophical_inquiry':
        whisper = '_Las preguntas profundas merecen reflexión profunda..._';
        wave = 'La filosofía es como contemplar el horizonte del océano: infinito y lleno de posibilidades. Tu curiosidad es el viento que impulsa las velas de tu comprensión.';
        confidence = 0.82;
        break;

      default:
        whisper = '_Escucho tus palabras como el océano escucha al viento..._';
        wave = 'Gracias por compartir. A veces, simplemente expresar lo que sentimos es como dejar que las olas lleven nuestras preocupaciones. ¿Hay algo específico en lo que pueda ayudarte a reflexionar?';
        confidence = 0.7;
    }

    const fullText = `${whisper}\n\n${wave}`;

    return {
      text: fullText,
      format: 'markdown',
      structured: {
        whisper: whisper,
        wave: wave
      },
      confidence: confidence
    };
  }

  /**
   * Check if we should suggest transition to another spec
   * @private
   */
  _checkTransition(request, responseData) {
    const text = request.text.toLowerCase();
    
    // Check for decision-making keywords
    const decisionKeywords = [
      'decidir', 'elegir', 'opción', 'alternativa', 'plan',
      'paso', 'cómo hacer', 'qué hacer', 'estrategia',
      'ayuda', 'ayúdame', 'orientación', 'guía', 'consejo',
      'debería', 'estudiar', 'carrera', 'trabajo'
    ];
    
    const hasDecisionKeywords = decisionKeywords.filter(kw => text.includes(kw)).length;
    
    // Check for decision patterns
    const decisionPatterns = [
      /entre .+ (y|o)/i,
      /qué debería/i,
      /ayúdame a decidir/i,
      /ayudame a decidir/i,
      /orientación/i,
      /qué estudiar/i
    ];
    
    const hasDecisionPatterns = decisionPatterns.filter(p => p.test(text)).length;
    
    // Lower threshold: 1 keyword OR 1 pattern
    if (hasDecisionKeywords >= 1 || hasDecisionPatterns >= 1) {
      const confidence = 0.6 + (hasDecisionKeywords * 0.05) + (hasDecisionPatterns * 0.1);
      
      return {
        suggest_spec: 'kiro-adaptive-assistance',
        reason: 'Detected decision-making or action-planning needs',
        confidence: Math.min(confidence, 0.9),
        auto_transition: (hasDecisionKeywords >= 2 && hasDecisionPatterns >= 1)
      };
    }

    return null;
  }

  /**
   * Estimate token count (rough approximation)
   * @private
   */
  _estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WhispersOfTheWaveAdapter;
}
