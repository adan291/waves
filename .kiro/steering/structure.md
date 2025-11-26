# Project Structure

## Directory Layout

```
whispers-of-the-wave/
├── index.html              # Main HTML structure and entry point
├── css/
│   ├── core.css           # Base styles, variables, reset
│   ├── components.css     # UI components (buttons, modals, indicators)
│   ├── animations.css     # Keyframe animations and transitions
│   ├── responsive.css     # Media queries and responsive design
│   └── waves.css          # Wave background animations
├── js/
│   ├── core/              # Core infrastructure (state, events, logger)
│   ├── services/          # External services (Gemini API, audio)
│   ├── engine/            # Game logic (personas, emotions, achievements)
│   ├── ui/                # UI components (renderer, controls, modals)
│   ├── features/          # Features (splash, waves, i18n, theme)
│   ├── i18n/              # Internationalization (translations)
│   └── main.js            # Application entry point
├── assets/                # Icons and images
├── tests/                 # Test files
└── docs/                  # Documentation
```

## File Responsibilities

### index.html
- Semantic HTML structure
- Accessibility attributes (ARIA labels, roles)
- Script loading order: geminiService → ui → main
- Contains setup instructions in comments

### CSS Files
- **css/core.css**: CSS variables, reset, base styles, typography
- **css/components.css**: Buttons, modals, indicators, splash screen
- **css/animations.css**: Keyframe animations, transitions, effects
- **css/responsive.css**: Media queries for mobile/tablet
- **css/waves.css**: Wave background animations and themes

### JS Core
- **js/core/state.js**: Application state management
- **js/core/events.js**: Event bus for component communication
- **js/core/logger.js**: Logging system with levels
- **js/core/errorHandler.js**: Global error handling

### JS Services
- **js/services/geminiService.js**: Gemini API integration
- **js/services/audioService.js**: Text-to-speech functionality

### JS Engine
- **js/engine/personas.js**: AI personas (Guardian, Explorer, Healer, etc.)
- **js/engine/emotional.js**: Emotional analysis
- **js/engine/achievementSystem.js**: Achievement tracking
- **js/engine/oceanDynamics.js**: Ocean state management

### JS UI
- **js/ui/renderer.js**: Message rendering
- **js/ui/controls.js**: UI controls and interactions
- **js/ui/modal.js**: Modal dialogs
- **js/ui/achievementUI.js**: Achievement notifications

### JS Features
- **js/features/splashScreen.js**: Initial wave selection screen
- **js/features/waveBackground.js**: Wave background management
- **js/features/themeToggle.js**: Dark/light theme switching
- **js/features/languageSelector.js**: i18n language switching

### js/main.js
- Application state management (`appState` object)
- Initialization and event listeners
- User message handling flow
- Response parsing logic (splits responses into whisper/wave)
- Conversation history tracking

## Key Features Implemented

### Internationalization (i18n)
- **Languages**: Spanish (es), English (en), Romanian (ro)
- **Location**: `js/i18n/translations.js`
- **UI Component**: Language selector in top-right corner
- **Storage**: Language preference saved in localStorage

### Wave Backgrounds
- **4 Wave Types**: Calm (🌊), Deep (🌀), Energetic (⚡), Healing (💙)
- **Dynamic Animations**: CSS-based wave animations with GPU acceleration
- **Theme Support**: Each wave adapts to dark/light theme
- **Persistence**: Selected wave saved in localStorage
- **Applied To**: Main app (index.html) and all test pages

### AI Personas
- **Guardian**: Gentle guide for self-discovery
- **Deep Explorer**: Deep philosophical conversations
- **Problem Solver**: Practical solutions and clarity
- **Healer**: Emotional support and healing

### Achievement System
- Tracks user milestones and conversation depth
- Visual notifications with ocean-themed rewards
- Gallery view to see all achievements

### Ocean Dynamics
- Real-time emotional state tracking
- Visual indicators (colors, animations)
- Adapts conversation tone based on user state

## Code Organization Principles

- **Separation of concerns**: Service layer, UI layer, application logic
- **No global pollution**: Functions scoped appropriately
- **Clear naming**: Descriptive function and variable names
- **Comments**: JSDoc-style documentation for functions
- **Modular architecture**: Each feature in separate file
- **Error handling**: Try-catch blocks with user-friendly messages
- **Performance**: Lazy loading for non-critical features
