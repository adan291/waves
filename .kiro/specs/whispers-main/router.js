#!/usr/bin/env node

/**
 * Feature Router
 * 
 * Intelligent routing system that analyzes user input and determines
 * which spec (feature) should handle the request.
 * 
 * @module FeatureRouter
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

class FeatureRouter {
  constructor(options = {}) {
    this.registryPath = options.registryPath || path.join(__dirname, 'registry.json');
    this.rulesPath = options.rulesPath || path.join(__dirname, 'rules.json');
    
    this.registry = null;
    this.rules = null;
    this.meta = null;
    
    // Scoring weights
    this.weights = {
      keywords: 0.40,
      intents: 0.40,
      context: 0.20
    };
    
    // Cache for compiled patterns
    this.patternCache = new Map();
    
    this._initialize();
  }

  /**
   * Initialize router by loading registry and rules
   * @private
   */
  _initialize() {
    try {
      // Load registry
      if (!fs.existsSync(this.registryPath)) {
        throw new Error(`Registry not found at ${this.registryPath}`);
      }
      this.registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
      
      // Load rules
      if (!fs.existsSync(this.rulesPath)) {
        throw new Error(`Rules not found at ${this.rulesPath}`);
      }
      const rulesData = JSON.parse(fs.readFileSync(this.rulesPath, 'utf8'));
      
      // Extract meta and rules
      this.meta = rulesData._meta || {};
      delete rulesData._meta;
      this.rules = rulesData;
      
      // Override weights if specified in meta
      if (this.meta.scoring_weights) {
        this.weights = { ...this.weights, ...this.meta.scoring_weights };
      }
      
      // Validate that all specs in rules exist in registry
      this._validateRules();
      
    } catch (error) {
      throw new Error(`Failed to initialize FeatureRouter: ${error.message}`);
    }
  }

  /**
   * Validate that rules reference valid specs from registry
   * @private
   */
  _validateRules() {
    const registryIds = this.registry.map(spec => spec.id);
    const ruleIds = Object.keys(this.rules);
    
    for (const ruleId of ruleIds) {
      if (!registryIds.includes(ruleId)) {
        console.warn(`Warning: Rule for spec "${ruleId}" found but spec not in registry`);
      }
    }
  }

  /**
   * Main routing method - analyzes input and returns best spec
   * 
   * @param {string} text - User input text
   * @param {Object} context - Optional context object
   * @param {string} context.previousSpec - Previously used spec ID
   * @param {number} context.conversationLength - Number of messages in conversation
   * @param {string} context.emotionalState - Detected emotional state
   * @returns {Object} Routing result with spec, confidence, reason, and context_blueprint
   */
  route(text, context = {}) {
    if (!text || typeof text !== 'string') {
      throw new Error('Input text must be a non-empty string');
    }
    
    const routingResult = this._performRouting(text, context);
    return routingResult;
  }

  /**
   * Create a SpecRequest object from routing result
   * 
   * @param {string} text - User input text
   * @param {Object} routingResult - Result from route()
   * @param {Object} options - Additional options
   * @returns {Object} SpecRequest object following the contract
   */
  createRequest(text, routingResult, options = {}) {
    const request = {
      // Required fields
      id: options.id || this._generateRequestId(),
      timestamp: Date.now(),
      text: text,
      spec: routingResult.spec,
      
      // Routing context
      routing: {
        confidence: routingResult.confidence,
        reason: routingResult.reason,
        alternatives: routingResult.alternatives || []
      },
      
      // Context blueprint
      context: routingResult.context_blueprint
    };

    // Optional fields
    if (options.conversation) {
      request.conversation = options.conversation;
    }

    if (options.user) {
      request.user = options.user;
    }

    if (options.metadata) {
      request.metadata = options.metadata;
    }

    return request;
  }

  /**
   * Internal routing logic (extracted for reusability)
   * @private
   */
  _performRouting(text, context = {}) {
    if (!text || typeof text !== 'string') {
      throw new Error('Input text must be a non-empty string');
    }

    // Normalize text
    const normalizedText = text.toLowerCase().trim();
    
    // Get active specs from registry
    const activeSpecs = this.registry.filter(spec => spec.status === 'active');
    
    if (activeSpecs.length === 0) {
      throw new Error('No active specs found in registry');
    }

    // Calculate scores for each spec
    const scores = [];
    
    for (const spec of activeSpecs) {
      const specRules = this.rules[spec.id];
      
      if (!specRules) {
        // No rules defined for this spec, skip it
        continue;
      }

      const score = this._calculateScore(normalizedText, specRules, context);
      
      scores.push({
        spec: spec.id,
        specInfo: spec,
        rules: specRules,
        ...score
      });
    }

    // Sort by confidence (descending)
    scores.sort((a, b) => b.confidence - a.confidence);

    // Get best match
    const best = scores[0];
    
    // Apply continuity bonus if previous spec exists
    if (context.previousSpec && best.confidence < 0.7) {
      const previousScore = scores.find(s => s.spec === context.previousSpec);
      if (previousScore && (best.confidence - previousScore.confidence) < 0.3) {
        // Keep previous spec for continuity
        const continuityResult = this._buildResult(previousScore, scores.slice(1, 3), context);
        continuityResult.reason = `Maintaining continuity with previous spec (${continuityResult.reason})`;
        return continuityResult;
      }
    }

    // Check confidence threshold
    const threshold = this.meta.confidence_thresholds?.medium || 0.4;
    
    if (best.confidence < threshold) {
      // Use default spec
      const defaultSpecId = this.meta.default_spec || 'whispers-of-the-wave';
      const defaultScore = scores.find(s => s.spec === defaultSpecId) || best;
      const result = this._buildResult(defaultScore, scores.slice(0, 3), context);
      result.reason = `Low confidence - using default spec (${result.reason})`;
      result.context_blueprint.needs_clarification = true;
      return result;
    }

    return this._buildResult(best, scores.slice(1, 3), context);
  }

  /**
   * Generate unique request ID
   * @private
   */
  _generateRequestId() {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate score for a spec based on text and rules
   * @private
   */
  _calculateScore(text, rules, context) {
    let keywordScore = 0;
    let intentScore = 0;
    let contextScore = 0;
    
    const matchedKeywords = [];
    const matchedPatterns = [];
    let detectedIntent = null;

    // 1. Keyword matching
    if (rules.keywords && rules.keywords.length > 0) {
      for (const keyword of rules.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          matchedKeywords.push(keyword);
        }
      }
      keywordScore = Math.min(matchedKeywords.length / 5, 1.0); // Max at 5 keywords
    }

    // 2. Pattern matching for intent detection
    if (rules.patterns) {
      for (const [intent, patterns] of Object.entries(rules.patterns)) {
        for (const pattern of patterns) {
          if (text.includes(pattern.toLowerCase())) {
            matchedPatterns.push(pattern);
            detectedIntent = intent;
            intentScore = 1.0;
            break;
          }
        }
        if (intentScore > 0) break;
      }
    }

    // Fallback: check if any intent keywords are present
    if (intentScore === 0 && rules.intents) {
      // Simple heuristic: if we have keywords but no pattern match,
      // assign partial intent score
      if (matchedKeywords.length > 0) {
        intentScore = 0.5;
        detectedIntent = rules.intents[0]; // Use first intent as default
      }
    }

    // 3. Context scoring
    if (context.emotionalState) {
      // Boost emotional specs if emotional state detected
      if (rules.tone === 'empathetic') {
        contextScore += 0.5;
      }
    }
    
    if (context.conversationLength > 3) {
      // Slight boost for continuity
      contextScore += 0.2;
    }
    
    contextScore = Math.min(contextScore, 1.0);

    // Calculate weighted confidence
    const confidence = (
      keywordScore * this.weights.keywords +
      intentScore * this.weights.intents +
      contextScore * this.weights.context
    ) * (rules.weight || 1.0);

    // Build reason
    const reasons = [];
    if (matchedKeywords.length > 0) {
      reasons.push(`${matchedKeywords.length} keywords matched`);
    }
    if (matchedPatterns.length > 0) {
      reasons.push(`pattern detected: ${detectedIntent}`);
    }
    if (contextScore > 0) {
      reasons.push('context signals present');
    }
    
    const reason = reasons.length > 0 
      ? reasons.join(', ')
      : 'no strong signals detected';

    return {
      confidence: Math.min(confidence, 1.0),
      reason,
      matchedKeywords,
      matchedPatterns,
      detectedIntent,
      scores: {
        keyword: keywordScore,
        intent: intentScore,
        context: contextScore
      }
    };
  }

  /**
   * Build final result object
   * @private
   */
  _buildResult(best, alternatives, context) {
    const contextBlueprint = {
      detected_intent: best.detectedIntent || 'unclear',
      keywords_matched: best.matchedKeywords || [],
      patterns_matched: best.matchedPatterns || [],
      suggested_pattern: best.detectedIntent || null,
      tone: best.rules.tone || 'neutral',
      response_style: best.rules.response_style || 'conversational',
      spec_title: best.specInfo.title,
      spec_description: best.specInfo.description,
      confidence_breakdown: best.scores
    };

    // Add context from input
    if (context.emotionalState) {
      contextBlueprint.emotional_state = context.emotionalState;
    }
    if (context.conversationLength) {
      contextBlueprint.conversation_length = context.conversationLength;
    }

    return {
      spec: best.spec,
      confidence: Math.round(best.confidence * 100) / 100, // Round to 2 decimals
      reason: best.reason,
      context_blueprint: contextBlueprint,
      alternatives: alternatives.map(alt => ({
        spec: alt.spec,
        confidence: Math.round(alt.confidence * 100) / 100,
        reason: alt.reason
      }))
    };
  }

  /**
   * Add or update rules for a spec
   * 
   * @param {string} specId - Spec ID
   * @param {Object} rules - Rules object
   */
  addRules(specId, rules) {
    // Validate spec exists in registry
    const spec = this.registry.find(s => s.id === specId);
    if (!spec) {
      throw new Error(`Spec "${specId}" not found in registry`);
    }

    // Merge with existing rules
    this.rules[specId] = {
      ...this.rules[specId],
      ...rules
    };

    // Optionally persist to file
    this._saveRules();
  }

  /**
   * Save rules to file
   * @private
   */
  _saveRules() {
    const rulesData = {
      ...this.rules,
      _meta: this.meta
    };
    
    fs.writeFileSync(
      this.rulesPath,
      JSON.stringify(rulesData, null, 2),
      'utf8'
    );
  }

  /**
   * Get all available specs
   * @returns {Array} Array of spec objects
   */
  getSpecs() {
    return this.registry.filter(spec => spec.status === 'active');
  }

  /**
   * Get rules for a specific spec
   * @param {string} specId - Spec ID
   * @returns {Object} Rules object
   */
  getRules(specId) {
    return this.rules[specId] || null;
  }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FeatureRouter;
}

// CLI usage
if (require.main === module) {
  const router = new FeatureRouter();
  
  // Get text from command line args
  const text = process.argv.slice(2).join(' ');
  
  if (!text) {
    console.log('Usage: node router.js <text to route>');
    console.log('\nExample:');
    console.log('  node router.js "Me siento perdido en la vida"');
    process.exit(1);
  }

  try {
    const result = router.route(text);
    console.log('\n📍 Routing Result:\n');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
