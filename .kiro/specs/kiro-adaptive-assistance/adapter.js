/**
 * Kiro Adaptive Assistance - Spec Adapter
 * 
 * Provides structured guidance for decision-making, action planning,
 * and problem-solving with analytical clarity.
 */

const SpecInterface = require('../whispers-main/spec_interface.js');

class KiroAdaptiveAssistanceAdapter extends SpecInterface {
  constructor() {
    super('kiro-adaptive-assistance');
    
    this.capabilities = {
      contract_version: '1.0.0',
      name: 'Kiro Adaptive Assistance',
      description: 'Structured guidance for decisions, planning, and problem-solving',
      supported_intents: [
        'decision_support',
        'action_planning',
        'problem_solving',
        'goal_setting',
        'priority_management',
        'strategic_thinking',
        'evaluation_request',
        'clarity_seeking',
        'direction_needed'
      ],
      response_formats: ['markdown', 'text'],
      features: {
        structured_responses: true,
        decision_matrices: true,
        action_roadmaps: true,
        analytical_approach: true,
        step_by_step_guidance: true
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
      
      // Accept if routed here with medium+ confidence
      if (request.routing.confidence >= 0.4) {
        return {
          canHandle: true,
          confidence: request.routing.confidence,
          reason: 'Routing confidence acceptable for decision/planning content'
        };
      }

      // Check for decision-making keywords
      const decisionKeywords = [
        'decidir', 'elegir', 'opción', 'alternativa', 'plan',
        'paso', 'estrategia', 'objetivo', 'meta', 'problema',
        'solución', 'resolver', 'cómo hacer', 'qué hacer',
        'estudiar', 'carrera', 'orientación', 'ayuda', 'debería'
      ];
      
      const hasDecisionKeywords = decisionKeywords.some(kw => text.includes(kw));
      
      if (hasDecisionKeywords) {
        return {
          canHandle: true,
          confidence: 0.75,
          reason: 'Decision-making or planning keywords detected'
        };
      }

      // Medium confidence for clarity-seeking or career guidance
      if (context.detected_intent === 'clarity_seeking' || 
          context.detected_intent === 'direction_needed' ||
          context.detected_intent === 'career_guidance') {
        return {
          canHandle: true,
          confidence: 0.6,
          reason: 'Clarity, direction, or guidance needed'
        };
      }

      // Low confidence - can still handle with clarification
      if (request.routing.confidence >= 0.3) {
        return {
          canHandle: true,
          confidence: 0.5,
          reason: 'Can provide general guidance with clarification'
        };
      }

      // Very low confidence - not suitable
      return {
        canHandle: false,
        confidence: 0.2,
        reason: 'No clear decision-making or planning intent'
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
      if (this.isTextTooShort(request.text, 5)) {
        return this.createErrorResponse(
          request,
          'INSUFFICIENT_CONTEXT',
          'Necesito más información para ayudarte. ¿Podrías contarme más detalles sobre tu situación?',
          {
            details: 'Text too short for structured guidance',
            recoverable: true,
            fallback_spec: 'whispers-of-the-wave'
          }
        );
      }

      // Check if text is too long
      if (this.isTextTooLong(request.text, 3000)) {
        return this.createErrorResponse(
          request,
          'TEXT_TOO_LONG',
          'Tu mensaje es muy extenso. ¿Podrías enfocarte en el aspecto más importante?',
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
          confidence: responseData.confidence || 0.85,
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
        'Hubo un problema al procesar tu solicitud. Intentémoslo de nuevo.',
        {
          details: error.message,
          recoverable: true,
          fallback_spec: 'whispers-of-the-wave',
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
      'decision_support': 'decision_matrix',
      'action_planning': 'action_roadmap',
      'problem_solving': 'problem_solving',
      'goal_setting': 'goal_setting',
      'priority_management': 'priority_matrix',
      'strategic_thinking': 'strategic_analysis',
      'evaluation_request': 'evaluation',
      'clarity_seeking': 'clarification',
      'direction_needed': 'direction_guidance'
    };

    return intentPatternMap[detectedIntent] || 'general_guidance';
  }

  /**
   * Generate response based on pattern
   * @private
   */
  async _generateResponse(request, pattern, convContext, userContext) {
    const text = request.text;
    
    // In a real implementation, this would integrate with the adaptive assistance system
    // For now, we'll create structured responses based on patterns
    
    let responseText = '';
    let sections = [];
    let actions = [];
    let confidence = 0.85;

    switch (pattern) {
      case 'decision_matrix':
        responseText = '## Análisis de Decisión\n\n';
        sections = [
          {
            title: 'Opciones Identificadas',
            content: 'Basándome en lo que compartiste, veo que tienes opciones por evaluar. Analicemos cada una sistemáticamente.',
            type: 'analysis'
          },
          {
            title: 'Criterios de Evaluación',
            content: '¿Qué factores son más importantes para ti en esta decisión? Considera: impacto a largo plazo, alineación con tus valores, recursos necesarios, y riesgos involucrados.',
            type: 'framework'
          },
          {
            title: 'Próximos Pasos',
            content: 'Te sugiero crear una matriz comparativa con tus opciones y criterios. ¿Te gustaría que te ayude a estructurarla?',
            type: 'action'
          }
        ];
        actions = [
          {
            label: 'Listar opciones',
            description: 'Enumera todas las alternativas disponibles',
            priority: 'high'
          },
          {
            label: 'Definir criterios',
            description: 'Identifica qué factores son importantes',
            priority: 'high'
          }
        ];
        confidence = 0.9;
        break;

      case 'action_roadmap':
        responseText = '## Plan de Acción\n\n';
        sections = [
          {
            title: 'Objetivo Claro',
            content: 'Primero, definamos claramente qué quieres lograr. Un objetivo bien definido es específico, medible y tiene un plazo.',
            type: 'framework'
          },
          {
            title: 'Pasos Estructurados',
            content: 'Dividamos tu objetivo en pasos manejables. Cada paso debe ser una acción concreta que te acerque a tu meta.',
            type: 'action'
          },
          {
            title: 'Recursos y Obstáculos',
            content: '¿Qué necesitas para empezar? ¿Qué podría detenerte? Anticipar esto te ayudará a prepararte mejor.',
            type: 'analysis'
          }
        ];
        actions = [
          {
            label: 'Definir objetivo SMART',
            description: 'Específico, Medible, Alcanzable, Relevante, con Tiempo',
            priority: 'high'
          },
          {
            label: 'Primer paso concreto',
            description: 'Identifica la primera acción que puedes tomar hoy',
            priority: 'high'
          }
        ];
        confidence = 0.88;
        break;

      case 'problem_solving':
        responseText = '## Resolución de Problema\n\n';
        sections = [
          {
            title: 'Definición del Problema',
            content: 'Entendamos exactamente cuál es el problema. A veces, definirlo claramente ya nos acerca a la solución.',
            type: 'analysis'
          },
          {
            title: 'Causas Raíz',
            content: '¿Qué está causando este problema? Identificar las causas nos ayuda a encontrar soluciones más efectivas.',
            type: 'analysis'
          },
          {
            title: 'Soluciones Posibles',
            content: 'Exploremos diferentes enfoques. No hay una sola forma de resolver un problema.',
            type: 'action'
          }
        ];
        actions = [
          {
            label: 'Describir el problema',
            description: 'Escribe el problema en una o dos frases claras',
            priority: 'high'
          },
          {
            label: 'Lluvia de ideas',
            description: 'Genera múltiples soluciones sin juzgarlas aún',
            priority: 'medium'
          }
        ];
        confidence = 0.87;
        break;

      case 'clarity_seeking':
        responseText = '## Clarificación\n\n';
        sections = [
          {
            title: 'Entendiendo tu Situación',
            content: 'Para ayudarte mejor, necesito entender algunos detalles. ¿Podrías contarme más sobre el contexto?',
            type: 'clarification'
          },
          {
            title: 'Preguntas Clave',
            content: '- ¿Cuál es tu objetivo principal?\n- ¿Qué has intentado hasta ahora?\n- ¿Qué obstáculos has encontrado?',
            type: 'framework'
          }
        ];
        actions = [
          {
            label: 'Responder preguntas',
            description: 'Proporciona más contexto sobre tu situación',
            priority: 'high'
          }
        ];
        confidence = 0.75;
        break;

      default:
        responseText = '## Guía Estructurada\n\n';
        sections = [
          {
            title: 'Análisis Inicial',
            content: 'Entiendo que buscas orientación. Trabajemos juntos para estructurar tu situación y encontrar el mejor camino.',
            type: 'analysis'
          },
          {
            title: 'Enfoque Recomendado',
            content: 'Te sugiero que empecemos identificando claramente qué necesitas: ¿es una decisión, un plan, o resolver un problema específico?',
            type: 'framework'
          }
        ];
        actions = [
          {
            label: 'Clarificar necesidad',
            description: 'Define qué tipo de ayuda necesitas',
            priority: 'high'
          }
        ];
        confidence = 0.7;
    }

    // Build full response text
    responseText += sections.map(s => `### ${s.title}\n\n${s.content}\n`).join('\n');
    
    if (actions.length > 0) {
      responseText += '\n### Acciones Sugeridas\n\n';
      responseText += actions.map(a => `- **${a.label}**: ${a.description}`).join('\n');
    }

    return {
      text: responseText,
      format: 'markdown',
      structured: {
        sections: sections,
        actions: actions
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
    
    // Check for emotional/introspective keywords
    const emotionalKeywords = [
      'siento', 'sentir', 'emoción', 'solo', 'triste', 'perdido',
      'vacío', 'dolor', 'miedo', 'ansiedad', 'corazón', 'alma'
    ];
    
    const hasEmotionalKeywords = emotionalKeywords.filter(kw => text.includes(kw)).length;
    
    if (hasEmotionalKeywords >= 2) {
      return {
        suggest_spec: 'whispers-of-the-wave',
        reason: 'Detected emotional content that may benefit from empathetic support',
        confidence: 0.7,
        auto_transition: false
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
  module.exports = KiroAdaptiveAssistanceAdapter;
}
