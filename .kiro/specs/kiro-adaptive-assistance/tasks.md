# Implementation Plan: Kiro Adaptive Assistance

- [x] 1. Create State Classifier Module



  - Implement StateClassifier class with pattern matching logic for all 6 user states
  - Create STATE_PATTERNS constant with regex patterns for LOST_DIRECTION, EMOTIONAL_LOW, SEEKING_DECISION, NEED_ORIENTATION, SELF_EXPRESSION, and NEUTRAL_CHAT
  - Implement classify() method that analyzes message text and returns classification object with state, confidence, indicators, and emotionalTone
  - Integrate with existing analyzeEmotionalTone() function for emotional context
  - Implement priority system where EMOTIONAL_LOW takes precedence over other states
  - Create file: js/core/stateClassifier.js
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 7.4_

- [x] 2. Create Response Patterns Module





  - [x] 2.1 Implement ResponsePatterns class structure


    - Create ResponsePatterns class with getPrompt() and validateResponse() methods
    - Implement pattern name constants for all 6 patterns
    - Create helper methods for pattern-specific validation
    - Create file: js/core/responsePatterns.js
    - _Requirements: 1.2, 2.2, 3.2, 4.2, 5.2, 6.2_

  - [x] 2.2 Implement Life Questioning Engine pattern


    - Extend existing Life Questioning mode to work with adaptive system
    - Create prompt that includes progressive questioning approach (exploration → depth → identity → action)
    - Implement validation for Life Questioning responses
    - Ensure integration with existing getLifeQuestioningPrompt() function
    - _Requirements: 1.2, 1.3, 1.4, 10.1, 10.2_

  - [x] 2.3 Implement Emotional Soothing Pattern


    - Create prompt with reflect → normalize → comfort → gentle question structure
    - Include ocean metaphors (olas, corrientes, marea) in prompt instructions
    - Implement validation ensuring NO Life Questioning activation
    - Add emotional validation requirement before any questioning
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 7.5_

  - [x] 2.4 Implement Decision Matrix Pattern


    - Create prompt that asks about options, values, and consequences
    - Include instructions for non-directive, exploratory tone
    - Add emotional impact consideration to decision analysis
    - Implement validation for calm, non-pressuring responses
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 2.5 Implement Action Roadmap Generator pattern


    - Create prompt that generates 3-5 simple, achievable actions
    - Structure actions into timeframes: today, this week, this month
    - Include focusing question at the end
    - Implement validation for action count (3-5) and timeframe structure
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x] 2.6 Implement Reflective Mirror Pattern


    - Create prompt that reflects user's essence and emotion
    - Include instruction to repeat what user said without adding solutions
    - Add simple follow-up question requirement
    - Implement validation ensuring NO guidance or solutions are provided
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [x] 2.7 Implement Neutral Chat Handler


    - Create prompt for brief, contextually appropriate responses
    - Maintain Kiro tone without deep patterns
    - Implement validation for response brevity
    - Ensure standard JSON output structure
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [x] 3. Create Adaptive Prompts Module





  - Create ADAPTIVE_PROMPTS constant object with prompts for all 6 states
  - Write Life Questioning Engine prompt with progressive questioning instructions and ocean metaphors
  - Write Emotional Soothing Pattern prompt with reflect-normalize-comfort-question structure
  - Write Decision Matrix Pattern prompt with options-values-consequences exploration
  - Write Action Roadmap Generator prompt with 3-5 actions and timeframe structure
  - Write Reflective Mirror Pattern prompt with essence reflection and no-solutions constraint
  - Write Neutral Chat Handler prompt with brief response instructions
  - Include JSON output format specification in all prompts
  - Create file: js/prompts/adaptivePrompts.js
  - _Requirements: 1.4, 1.5, 2.3, 2.4, 3.3, 4.3, 4.4, 5.3, 6.3, 9.1, 9.2, 9.3, 9.4, 9.5_


- [x] 4. Create Adaptive Assistance Orchestrator



  - [x] 4.1 Implement AdaptiveAssistance class structure


    - Create AdaptiveAssistance class with constructor accepting stateClassifier and responsePatterns
    - Initialize stateHistory array for tracking state changes
    - Implement process() method as main entry point
    - Create helper methods for state tracking and output structuring
    - Create file: js/core/adaptiveAssistance.js
    - _Requirements: 7.1, 7.2, 7.3, 8.1_

  - [x] 4.2 Implement state classification and tracking


    - Call stateClassifier.classify() in process() method
    - Implement trackStateChange() method to record state transitions
    - Add state history management with timestamp and transition tracking
    - Implement state change detection logic
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 4.3 Implement response generation flow


    - Get appropriate prompt from responsePatterns based on classified state
    - Build conversation context including history and emotional analysis
    - Call GeminiService.sendMessage() with adaptive prompt
    - Handle response parsing and validation
    - _Requirements: 8.2, 8.3, 10.3_

  - [x] 4.4 Implement output structuring


    - Create structureOutput() method that formats response into required JSON structure
    - Parse Gemini response and extract whisper and reflection
    - Build output object with persona, mode, action, text, and next_step fields
    - Implement getActionName() helper to map states to action names
    - Implement determineNextStep() helper for internal guidance
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 5. Integrate with Main Application




  - [x] 5.1 Update handleUserMessage() function


    - Import AdaptiveAssistance, StateClassifier, and ResponsePatterns modules
    - Initialize adaptive assistance system before message processing
    - Call adaptiveAssistance.process() instead of direct GeminiService call
    - Pass full conversation context including history and emotional analysis
    - Update file: js/main.js
    - _Requirements: 7.1, 7.2, 7.3, 10.1, 10.2, 10.3_

  - [x] 5.2 Update response handling


    - Modify response parsing to handle new structured output format
    - Extract whisper and reflection from text object
    - Preserve existing scene creation logic
    - Ensure backward compatibility with existing response format
    - Update file: js/main.js
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 5.3 Integrate state tracking with conversation history


    - Add state information to conversation history entries
    - Store classification results alongside messages
    - Update setState() calls to include state history
    - Ensure state persistence across message exchanges
    - Update file: js/main.js
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 5.4 Preserve Life Questioning mode compatibility


    - Ensure existing Life Questioning detection still works
    - Integrate Life Questioning state with adaptive system
    - Handle transition between Life Questioning and other states
    - Maintain existing Life Questioning session end logic
    - Update file: js/main.js
    - _Requirements: 1.2, 1.3, 7.5_

- [x] 6. Update HTML to load new modules
  - Add script tag for js/core/stateClassifier.js
  - Add script tag for js/core/responsePatterns.js
  - Add script tag for js/prompts/adaptivePrompts.js
  - Add script tag for js/core/adaptiveAssistance.js
  - Ensure correct loading order (dependencies before dependents)
  - Update file: index.html
  - _Requirements: 8.1_

- [x] 7. Add configuration and error handling




  - [x] 7.1 Create configuration object


    - Create ADAPTIVE_CONFIG constant with enableStateTracking, confidenceThreshold, maxStateHistory, enableMultiLanguage, defaultState, and emotionalPriority settings
    - Add configuration to adaptiveAssistance.js
    - Implement configuration validation
    - _Requirements: 6.1, 7.4_

  - [x] 7.2 Implement classification error handling


    - Add fallback to NEUTRAL_CHAT when state cannot be determined
    - Implement logging for ambiguous messages
    - Handle multi-match scenarios with priority system
    - Ensure no disruption to user experience on classification errors
    - Update file: js/core/stateClassifier.js
    - _Requirements: 7.4_

  - [x] 7.3 Implement response generation error handling


    - Add JSON parsing error handling with lenient parser fallback
    - Implement response validation before display
    - Add ocean-themed error messages for generation failures
    - Log validation failures for prompt improvement
    - Update file: js/core/adaptiveAssistance.js
    - _Requirements: 8.1_

  - [x] 7.4 Implement state transition validation


    - Add validation for rapid state changes
    - Ensure emotional validation occurs before questioning when transitioning from EMOTIONAL_LOW
    - Implement smooth state transition logic
    - Add logging for state transition patterns
    - Update file: js/core/adaptiveAssistance.js
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 8. Create test suite




  - [x] 8.1 Write StateClassifier unit tests


    - Test each state pattern with positive examples (messages that should match)
    - Test negative examples (messages that should not match)
    - Test confidence scoring accuracy
    - Test priority system (EMOTIONAL_LOW precedence)
    - Test edge cases (empty messages, very long messages)
    - Create file: tests/stateClassifier.test.js
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.4_

  - [x] 8.2 Write ResponsePatterns unit tests


    - Test each pattern generates valid JSON
    - Test ocean metaphor inclusion in prompts
    - Test pattern-specific requirements (e.g., no solutions in SELF_EXPRESSION)
    - Test prompt validation logic
    - Create file: tests/responsePatterns.test.js
    - _Requirements: 1.2, 2.2, 3.2, 4.2, 5.2, 6.2, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 8.3 Write AdaptiveAssistance integration tests


    - Test state tracking and history management
    - Test state transition logic
    - Test output structuring
    - Test integration with GeminiService
    - Create file: tests/adaptiveAssistance.test.js
    - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 8.4 Write end-to-end integration tests


    - Test complete flow: message → classification → pattern → response → output
    - Test each of the 6 user states end-to-end
    - Test state transitions (EMOTIONAL_LOW → LOST_DIRECTION)
    - Test conversation continuity across states
    - Test backward compatibility with existing system
    - Create file: tests/integration.test.js
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 9. Create manual testing documentation





  - Document 6 manual testing scenarios (one for each state)
  - Include expected behavior and validation criteria for each scenario
  - Add state transition testing scenario
  - Create testing checklist for ocean aesthetic and JSON output validation
  - Create file: .kiro/specs/kiro-adaptive-assistance/TESTING.md
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Add console testing utilities





  - Create testAdaptiveSystem() function for browser console testing
  - Add test cases for each state classification
  - Add test cases for each response pattern
  - Include sample messages and expected outputs
  - Add utility to js/core/adaptiveAssistance.js
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_
