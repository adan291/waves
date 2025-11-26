# Project Structure

## Directory Layout

```
whispers-of-the-wave/
├── index.html              # Main HTML structure and entry point
├── css/
│   └── style.css          # All styles, animations, and responsive design
├── js/
│   ├── geminiService.js   # Gemini API integration and error handling
│   ├── ui.js              # DOM manipulation and visual updates
│   └── main.js            # Application logic and state management
└── README.md              # Setup instructions and documentation
```

## File Responsibilities

### index.html
- Semantic HTML structure
- Accessibility attributes (ARIA labels, roles)
- Script loading order: geminiService → ui → main
- Contains setup instructions in comments

### css/style.css
- CSS reset and base styles
- Ocean background gradient animation
- Message display styles (whisper, wave-reflection, user-message)
- Typing indicator animation
- Responsive breakpoints (768px, 480px)
- Custom scrollbar styling

### js/geminiService.js
- `geminiConfig` object with API configuration
- `GeminiService` class for API communication
- Message formatting for Gemini API
- Error handling with ocean-themed messages
- API key placeholder: `YOUR_API_KEY_HERE`

### js/ui.js
- Pure DOM manipulation functions
- Message display functions (user, whisper, wave)
- Typing indicator show/hide
- Input field management
- HTML escaping for XSS prevention
- Placeholder functions for future speech features

### js/main.js
- Application state management (`appState` object)
- Initialization and event listeners
- User message handling flow
- Response parsing logic (splits responses into whisper/wave)
- Conversation history tracking

## Code Organization Principles

- **Separation of concerns**: Service layer, UI layer, application logic
- **No global pollution**: Functions scoped appropriately
- **Clear naming**: Descriptive function and variable names
- **Comments**: JSDoc-style documentation for functions
- **Future features**: Commented placeholder code with `@future` tag
- **Error handling**: Try-catch blocks with user-friendly messages
