# Design Document: Whispers of the Wave - Main Orchestrator

## Overview

The Whispers of the Wave Main Orchestrator provides the architectural foundation and coordination layer for all feature specifications within the project. This meta-spec establishes the core patterns, integration points, and quality standards that ensure all features work together cohesively while maintaining the project's ocean-inspired aesthetic and technical excellence.

The orchestrator operates at a higher abstraction level than individual feature specs, focusing on system-wide concerns: module organization, inter-feature communication, shared state management, and architectural consistency. It serves as both a reference guide for developers and an enforcement mechanism for quality standards.

## Architecture

### System-Wide Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Whispers of the Wave                      │
│                     Main Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Core Features   │  │ Adaptive Features │                │
│  │  (Base Spec)     │  │  (Enhancement)    │                │
│  │                  │  │                    │                │
│  │ • UI Layer       │  │ • State Classifier│                │
│  │ • Ocean Engine   │  │ • Response Patterns│               │
│  │ • Gemini Service │  │ • Adaptive Prompts│                │
│  └────────┬─────────┘  └────────┬───────────┘                │
│           │                     │                            │
│           └──────────┬──────────┘                            │
│                      │                                       │
│           ┌──────────▼──────────┐                            │
│           │  Integration Layer  │                            │
│           │  • Event Bus        │                            │
│           │  • Shared State     │                            │
│           │  • API Contracts    │                            │
│           └─────────────────────┘                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Feature Spec Registry

```javascript
const FEATURE_SPECS = {
  'whispers-of-the-wave': {
    name: 'Whispers of the Wave - Core',
    status: 'COMPLETE',
    version: '1.0.0',
    dependencies: [],
    provides: ['ui-layer', 'gemini-service', 'ocean-aesthetic'],
    path: '.kiro/specs/whispers-of-the-wave/'
  },
  'kiro-adaptive-assistance': {
    name: 'Kiro Adaptive Assistance',
    status: 'IMPLEMENTATION',
    version: '0.9.0',
    dependencies: ['whispers-of-the-wave'],
    provides: ['state-classification', 'adaptive-patterns', 'life-questioning'],
    path: '.kiro/specs/kiro-adaptive-assistance/'
  }
  // Future specs will be registered here
};
```

### Dependency Graph

```
whispers-of-the-wave (Core)
    ↓
    ├─→ kiro-adaptive-assistance (Enhances conversation intelligence)
    │
    └─→ [Future: voice-integration] (Adds speech capabilities)
    │
    └─→ [Future: conversation-persistence] (Adds session storage)
```

## Module Organization Standards

### Directory Structure

```
whispers-of-the-wave/
├── index.html                    # Application entry point
├── css/
│   └── style.css                # Global styles and ocean aesthetic
├── js/
│   ├── main.js                  # Application orchestrator
│   ├── config.local.js          # Local configuration (gitignored)
│   ├── core/                    # Core functionality modules
│   │   ├── adaptiveAssistance.js
│   │   ├── stateClassifier.js
│   │   └── responsePatterns.js
│   ├── engine/                  # Processing engines
│   │   └── oceanEngine.js       # (Future: wave generation logic)
│   ├── services/                # External service integrations
│   │   └── geminiService.js
│   ├── ui/                      # UI components
│   │   ├── messageRenderer.js
│   │   └── inputHandler.js
│   └── prompts/                 # AI prompt templates
│       ├── prompts_master.js
│       └── adaptivePrompts.js
├── tests/                       # Test files
│   ├── integration.test.js
│   └── adaptiveAssistance.test.js
└── .kiro/
    ├── specs/                   # Feature specifications
    │   ├── whispers-main/       # This orchestrator spec
    │   ├── whispers-of-the-wave/
    │   └── kiro-adaptive-assistance/
    └── steering/                # Development guidelines
        ├── tech.md
        ├── structure.md
        └── product.md
```

### Module Naming Conventions

**Files:**
- Core modules: `camelCase.js` (e.g., `stateClassifier.js`)
- Service modules: `serviceName.js` (e.g., `geminiService.js`)
- UI components: `componentName.js` (e.g., `messageRenderer.js`)
- Test files: `moduleName.test.js` or `test_feature.html`

**Classes:**
- PascalCase: `StateClassifier`, `GeminiService`, `AdaptiveAssistance`

**Functions:**
- camelCase: `handleUserMessage()`, `classifyState()`, `renderMessage()`

**Constants:**
- UPPER_SNAKE_CASE: `STATE_PATTERNS`, `ADAPTIVE_CONFIG`, `API_ENDPOINTS`

## Integration Patterns

### 1. Event Bus System

**Purpose:** Enable loose coupling between features through event-driven communication.

**Implementation:**
```javascript
// Simple event bus for inter-module communication
const EventBus = {
  events: {},
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  },
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
};
```

**Standard Events:**
- `message:sent` - User sends a message
- `message:received` - AI response received
- `state:changed` - User state classification changes
- `error:occurred` - Error needs to be displayed
- `animation:complete` - UI animation finished

### 2. Shared State Management

**Purpose:** Provide consistent state access across features without tight coupling.

**Implementation:**
```javascript
// Centralized state management
const AppState = {
  conversation: {
    history: [],
    currentPersona: 'kiro',
    emotionalContext: null
  },
  
  adaptive: {
    currentState: 'NEUTRAL_CHAT',
    stateHistory: [],
    lifeQuestioningActive: false
  },
  
  ui: {
    isProcessing: false,
    animationsEnabled: true
  },
  
  // State update with event emission
  update(path, value) {
    // Update nested state
    // Emit change event
    EventBus.emit('state:updated', { path, value });
  },
  
  // State getter
  get(path) {
    // Return nested state value
  }
};
```

### 3. API Contract Standards

**Service Layer Interface:**
```javascript
// All service modules must implement this interface
class ServiceInterface {
  /**
   * Initialize the service
   * @param {Object} config - Service configuration
   */
  async initialize(config) {}
  
  /**
   * Check if service is ready
   * @returns {boolean}
   */
  isReady() {}
  
  /**
   * Handle errors consistently
   * @param {Error} error
   * @returns {Object} Formatted error
   */
  handleError(error) {}
}
```

**UI Component Interface:**
```javascript
// All UI components must implement this interface
class UIComponent {
  /**
   * Render the component
   * @param {Object} data - Data to render
   */
  render(data) {}
  
  /**
   * Update the component
   * @param {Object} changes - Changes to apply
   */
  update(changes) {}
  
  /**
   * Clean up component resources
   */
  destroy() {}
}
```

### 4. Data Format Standards

**Message Format:**
```javascript
{
  role: 'user' | 'assistant',
  content: string,
  timestamp: number,
  metadata: {
    state?: string,           // For adaptive features
    emotionalTone?: string,   // For emotional analysis
    persona?: string          // For multi-persona features
  }
}
```

**Response Format:**
```javascript
{
  persona: 'kiro' | 'narrador',
  mode: string,               // Current state/mode
  action: string,             // Action taken
  text: {
    whisper: string,          // Poetic reflection
    reflection: string        // Deeper insight
  },
  next_step: string,          // Internal guidance
  metadata: {
    confidence?: number,      // Classification confidence
    pattern?: string          // Pattern used
  }
}
```

**Error Format:**
```javascript
{
  type: 'network' | 'api' | 'validation' | 'internal',
  message: string,            // User-friendly message
  details: string,            // Technical details
  recoverable: boolean,       // Can user retry?
  timestamp: number
}
```

## Quality Standards

### Testing Requirements

**Unit Tests:**
- All core logic functions must have unit tests
- Minimum 80% code coverage for critical paths
- Test files located in `tests/` directory
- Use descriptive test names: `test_feature_scenario.html`

**Integration Tests:**
- Test inter-feature communication
- Validate API contracts between modules
- Test state transitions and event flows

**Manual Testing:**
- Browser compatibility testing (Chrome, Firefox, Safari)
- Responsive design testing (desktop, tablet, mobile)
- Accessibility testing with screen readers
- Performance testing with Chrome DevTools

### Documentation Standards

**Code Documentation:**
```javascript
/**
 * Brief description of function purpose
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * @throws {ErrorType} When error occurs
 * 
 * @example
 * const result = functionName(param);
 */
function functionName(paramName) {
  // Implementation
}
```

**Spec Documentation:**
- Requirements: User stories with acceptance criteria
- Design: Architecture, components, data models
- Tasks: Implementation checklist with status tracking
- Testing: Test scenarios and validation steps

### Performance Benchmarks

**Response Times:**
- UI interactions: < 100ms
- State classification: < 50ms
- API calls: < 3s (network dependent)
- Animation frame rate: 60fps minimum

**Resource Limits:**
- JavaScript bundle: < 200KB (uncompressed)
- CSS bundle: < 50KB
- Conversation history: Max 50 messages in memory
- State history: Max 100 entries

**Optimization Requirements:**
- Use CSS transforms for animations (GPU acceleration)
- Debounce rapid user inputs
- Lazy load non-critical features
- Minimize DOM manipulation

### Accessibility Standards

**WCAG 2.1 AA Compliance:**
- All interactive elements must be keyboard accessible
- Color contrast ratio minimum 4.5:1
- ARIA labels for screen readers
- Focus indicators visible and clear
- No flashing content (seizure prevention)

**Semantic HTML:**
- Use appropriate HTML5 elements
- Maintain logical heading hierarchy
- Provide alt text for images
- Use form labels correctly

## Feature Lifecycle

### Lifecycle Stages

```
PLANNING → DESIGN → IMPLEMENTATION → TESTING → COMPLETE
```

**PLANNING:**
- Define user stories and requirements
- Identify dependencies on existing features
- Estimate complexity and timeline
- Get approval from project maintainers

**DESIGN:**
- Create architecture and component designs
- Define data models and interfaces
- Document integration points
- Review design with team

**IMPLEMENTATION:**
- Follow coding standards and patterns
- Write code with inline documentation
- Create unit tests alongside code
- Track progress in tasks.md

**TESTING:**
- Run unit and integration tests
- Perform manual testing scenarios
- Validate accessibility compliance
- Check performance benchmarks

**COMPLETE:**
- All acceptance criteria met
- Documentation complete
- Tests passing
- Code reviewed and merged

### Quality Gates

**Planning → Design:**
- [ ] Requirements document complete
- [ ] Dependencies identified
- [ ] No conflicts with existing features

**Design → Implementation:**
- [ ] Design document complete
- [ ] Integration points defined
- [ ] Data models documented

**Implementation → Testing:**
- [ ] All code written
- [ ] Unit tests created
- [ ] Inline documentation complete

**Testing → Complete:**
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] Performance benchmarks met
- [ ] Accessibility validated

## Security Guidelines

### Input Validation

**User Input:**
```javascript
// Always sanitize user input
function sanitizeInput(input) {
  // Remove HTML tags
  // Escape special characters
  // Limit length
  return sanitized;
}
```

**XSS Prevention:**
- Use `textContent` instead of `innerHTML` for user data
- Escape HTML entities in all user-generated content
- Validate and sanitize before rendering

### API Security

**API Key Management:**
```javascript
// NEVER commit API keys to repository
// Use config.local.js (gitignored)
const config = {
  apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
};
```

**Request Validation:**
- Validate all API responses before processing
- Handle malformed responses gracefully
- Implement rate limiting on client side

### Data Privacy

**Conversation Storage:**
- Store conversation history in memory only (session-based)
- Do not persist sensitive data to localStorage without encryption
- Clear conversation history on page unload

**User Tracking:**
- No analytics or tracking without explicit user consent
- No third-party scripts except essential APIs
- Privacy-by-design in all features

## Extension Framework

### Adding New Feature Specs

**Step 1: Create Feature Spec Directory**
```bash
mkdir .kiro/specs/new-feature-name
```

**Step 2: Create Required Documents**
- `requirements.md` - User stories and acceptance criteria
- `design.md` - Architecture and implementation details
- `tasks.md` - Implementation checklist

**Step 3: Register Feature**
Update `FEATURE_SPECS` registry in this document with:
- Feature name and description
- Current status
- Dependencies
- Provided capabilities

**Step 4: Define Integration Points**
Document how the feature integrates with existing features:
- Events it emits/listens to
- State it reads/writes
- APIs it consumes/provides

### Plugin Architecture Pattern

**Optional Feature Pattern:**
```javascript
// Feature can be loaded conditionally
class OptionalFeature {
  static isEnabled() {
    return AppState.get('features.featureName.enabled');
  }
  
  static async load() {
    if (!this.isEnabled()) return;
    // Load feature code
  }
}
```

**Feature Toggle Configuration:**
```javascript
const FEATURE_FLAGS = {
  adaptiveAssistance: true,
  voiceIntegration: false,
  conversationPersistence: false
};
```

## Roadmap

### Current Features (Complete)
- ✅ Core UI and ocean aesthetic
- ✅ Gemini API integration
- ✅ Basic conversation flow

### Active Development
- 🔄 Kiro Adaptive Assistance (90% complete)
  - State classification
  - Response patterns
  - Life questioning engine

### Planned Features
- 📋 Voice Integration
  - Speech-to-text input
  - Text-to-speech output
  - Voice-optimized prompts

- 📋 Conversation Persistence
  - Session storage
  - Conversation export
  - History search

- 📋 Multi-Language Support
  - Spanish (primary)
  - English
  - Portuguese

- 📋 Theme Customization
  - Alternative color schemes
  - User preferences
  - Accessibility themes

### Future Considerations
- Advanced analytics dashboard
- Collaborative conversations
- Mobile native app
- Offline mode

## Maintenance Guidelines

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Includes JSDoc documentation
- [ ] Has unit tests
- [ ] Passes linting
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Performance optimized

### Deprecation Policy
1. Mark feature as deprecated in documentation
2. Provide migration guide
3. Maintain for at least 2 versions
4. Remove in major version update

### Version Management
- Major: Breaking changes (1.0.0 → 2.0.0)
- Minor: New features (1.0.0 → 1.1.0)
- Patch: Bug fixes (1.0.0 → 1.0.1)
