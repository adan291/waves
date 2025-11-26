# Requirements Document

## Introduction

The Kiro Adaptive Assistance system transforms the AI conversation experience by intelligently classifying user emotional and mental states, then responding with contextually appropriate patterns. The system maintains the ocean/mystical aesthetic while guiding users from confusion through clarity to actionable steps. This feature enhances the existing Whispers of the Wave application by adding emotional intelligence and adaptive conversation flows.

## Glossary

- **Kiro System**: The adaptive AI assistant that analyzes user messages and generates contextually appropriate responses
- **User State**: A classification category representing the user's current emotional or mental condition (e.g., LOST_DIRECTION, EMOTIONAL_LOW)
- **Response Pattern**: A structured approach to generating replies based on the identified user state
- **Life Questioning Engine**: A specialized pattern for helping users find clarity through progressive questioning
- **Ocean Aesthetic**: The mystical, wave-inspired visual and linguistic theme maintained throughout interactions
- **State Classifier**: The component that analyzes user input and determines the appropriate user state
- **Response Generator**: The component that creates replies using the selected response pattern
- **Conversation Context**: The historical record of user messages and system responses within a session

## Requirements

### Requirement 1

**User Story:** As a user experiencing confusion about life direction, I want the system to recognize my state and guide me through clarifying questions, so that I can gain clarity without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN a user message contains phrases indicating lack of direction (e.g., "no sé qué estudiar", "estoy perdido", "no sé qué hacer"), THE Kiro System SHALL classify the user state as LOST_DIRECTION
2. WHEN the user state is LOST_DIRECTION, THE Kiro System SHALL activate the Life Questioning Engine pattern
3. THE Life Questioning Engine SHALL generate progressive questions that explore the user's interests, values, and goals
4. THE Kiro System SHALL maintain the ocean aesthetic in all generated responses using metaphors like "olas", "corrientes", "viento"
5. THE Response Generator SHALL output a structured JSON object containing persona, mode, action, text, and next_step fields

### Requirement 2

**User Story:** As a user experiencing emotional distress, I want the system to provide emotional support and validation, so that I feel heard and can regulate my emotions before engaging in deeper exploration.

#### Acceptance Criteria

1. WHEN a user message expresses sadness, anxiety, exhaustion, or hopelessness, THE State Classifier SHALL classify the user state as EMOTIONAL_LOW
2. WHEN the user state is EMOTIONAL_LOW, THE Kiro System SHALL activate the Emotional Soothing Pattern
3. THE Emotional Soothing Pattern SHALL reflect the user's emotion, normalize their experience, and use ocean metaphors
4. THE Response Generator SHALL close emotional soothing responses with a gentle, non-pressuring question
5. THE Kiro System SHALL NOT activate the Life Questioning Engine when the user state is EMOTIONAL_LOW

### Requirement 3

**User Story:** As a user comparing multiple options, I want the system to help me analyze choices rationally while considering emotional impact, so that I can make informed decisions aligned with my values.

#### Acceptance Criteria

1. WHEN a user message requests comparison or choice guidance (e.g., "¿cuál es mejor?", "no sé si A o B"), THE State Classifier SHALL classify the user state as SEEKING_DECISION
2. WHEN the user state is SEEKING_DECISION, THE Kiro System SHALL activate the Decision Matrix Pattern
3. THE Decision Matrix Pattern SHALL ask what options the user has, what matters most to them, and present consequences without pressure
4. THE Response Generator SHALL structure decision guidance to include both rational analysis and emotional impact considerations
5. THE Kiro System SHALL maintain a calm, non-directive tone throughout decision exploration

### Requirement 4

**User Story:** As a user seeking practical guidance, I want the system to provide clear, achievable action steps, so that I can move forward without feeling paralyzed by complexity.

#### Acceptance Criteria

1. WHEN a user message requests practical guidance (e.g., "¿qué puedo hacer?", "¿qué pasos sigo?"), THE State Classifier SHALL classify the user state as NEED_ORIENTATION
2. WHEN the user state is NEED_ORIENTATION, THE Kiro System SHALL activate the Action Roadmap Generator pattern
3. THE Action Roadmap Generator SHALL provide between 3 and 5 simple, achievable actions
4. THE Action Roadmap Generator SHALL structure actions into timeframes: today, this week, and this month
5. THE Response Generator SHALL close action roadmaps with a focusing question to help the user prioritize

### Requirement 5

**User Story:** As a user who needs to express myself, I want the system to listen and validate my feelings without directing the conversation, so that I feel supported in my self-expression.

#### Acceptance Criteria

1. WHEN a user message indicates a need for self-expression without seeking guidance, THE State Classifier SHALL classify the user state as SELF_EXPRESSION
2. WHEN the user state is SELF_EXPRESSION, THE Kiro System SHALL activate the Reflective Mirror Pattern
3. THE Reflective Mirror Pattern SHALL repeat the essence of what the user said and reflect their emotion
4. THE Response Generator SHALL include a simple follow-up question that invites continued expression
5. THE Kiro System SHALL NOT provide solutions or guidance when the user state is SELF_EXPRESSION

### Requirement 6

**User Story:** As a user engaging in casual conversation, I want the system to respond naturally without unnecessary depth, so that simple interactions remain light and appropriate.

#### Acceptance Criteria

1. WHEN a user message is casual or neutral without emotional or directional needs, THE State Classifier SHALL classify the user state as NEUTRAL_CHAT
2. WHEN the user state is NEUTRAL_CHAT, THE Kiro System SHALL maintain the Kiro tone without applying deep patterns
3. THE Response Generator SHALL provide brief, contextually appropriate responses for neutral chat
4. THE Kiro System SHALL remain ready to detect state changes in subsequent messages
5. THE Response Generator SHALL output the standard JSON structure even for neutral chat interactions

### Requirement 7

**User Story:** As a user whose emotional state changes during conversation, I want the system to adapt its approach dynamically, so that I receive appropriate support as my needs evolve.

#### Acceptance Criteria

1. WHEN the State Classifier detects a change in user state between messages, THE Kiro System SHALL switch to the appropriate response pattern
2. THE Kiro System SHALL analyze each new user message independently to determine the current state
3. WHEN transitioning between states, THE Kiro System SHALL maintain conversation context and continuity
4. THE State Classifier SHALL prioritize emotional states (EMOTIONAL_LOW) over directional states when both indicators are present
5. THE Kiro System SHALL validate emotions before asking exploratory questions when transitioning from EMOTIONAL_LOW to other states

### Requirement 8

**User Story:** As a developer integrating this system, I want consistent structured output from all responses, so that I can reliably parse and display the system's guidance.

#### Acceptance Criteria

1. THE Response Generator SHALL output a JSON object for every response
2. THE JSON object SHALL contain exactly five fields: persona, mode, action, text, and next_step
3. THE persona field SHALL always contain the value "kiro"
4. THE mode field SHALL contain one of the six defined user states
5. THE action field SHALL specify which response pattern was used to generate the response

### Requirement 9

**User Story:** As a user of the system, I want all interactions to maintain the ocean/mystical aesthetic, so that the experience remains immersive and cohesive with the Whispers of the Wave interface.

#### Acceptance Criteria

1. THE Response Generator SHALL incorporate ocean metaphors (olas, corrientes, viento, marea) in all response patterns
2. THE Kiro System SHALL maintain a calm, mystical tone across all user states
3. THE Response Generator SHALL ensure clarity while preserving the aesthetic voice
4. WHEN using ocean metaphors, THE Response Generator SHALL ensure they enhance rather than obscure the message
5. THE Kiro System SHALL balance mystical language with practical guidance to maintain both atmosphere and usefulness

### Requirement 10

**User Story:** As a user seeking guidance, I want the system to explore my situation before providing solutions, so that recommendations are tailored to my specific context rather than generic advice.

#### Acceptance Criteria

1. THE Kiro System SHALL NOT provide direct solutions without first exploring the user's context
2. WHEN a user requests guidance, THE Response Generator SHALL ask clarifying questions before suggesting actions
3. THE State Classifier SHALL choose the appropriate response mode before generating any reply
4. THE Kiro System SHALL prioritize understanding over quick answers in all non-neutral interactions
5. THE Response Generator SHALL ensure that action-oriented responses (NEED_ORIENTATION) are preceded by sufficient context gathering in the conversation history
