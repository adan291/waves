# Design Document

## Overview

Whispers of the Wave is a single-page web application built with vanilla HTML, CSS, and JavaScript. The architecture follows a modular approach with separation of concerns: UI rendering, API communication, and application orchestration are handled by distinct modules. The design emphasizes smooth animations, responsive layout, and a peaceful aesthetic through ocean-inspired gradients and typography.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────┐
│         index.html (View)           │
│  ┌───────────────────────────────┐  │
│  │   Animated Background Layer   │  │
│  │   ┌───────────────────────┐   │  │
│  │   │  Message Display Area │   │  │
│  │   │   (Scrollable)        │   │  │
│  │   └───────────────────────┘   │  │
│  │   ┌───────────────────────┐   │  │
│  │   │   Input Box (Fixed)   │   │  │
│  │   └───────────────────────┘   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│       JavaScript Modules            │
│  ┌──────────┐  ┌──────────────┐    │
│  │ main.js  │→ │ ui.js        │    │
│  │(Orchestr)│  │(Rendering)   │    │
│  └────┬─────┘  └──────────────┘    │
│       ↓                             │
│  ┌──────────────────────┐           │
│  │ geminiService.js     │           │
│  │ (API Communication)  │           │
│  └──────────┬───────────┘           │
└─────────────┼───────────────────────┘
              ↓
        Gemini API
```

### Module Responsibilities

- **index.html**: Structure and semantic markup
- **css/style.css**: Visual styling, animations, responsive rules
- **js/main.js**: Application initialization, event coordination, conversation history management
- **js/geminiService.js**: Gemini API integration, request/response handling
- **js/ui.js**: DOM manipulation, animation triggers, message rendering

## Components and Interfaces

### 1. HTML Structure (index.html)

```html
<body>
  <div class="ocean-background"></div>
  <div class="container">
    <div id="messageDisplay" class="message-display"></div>
    <div class="input-container">
      <input type="text" id="userInput" placeholder="Share your thoughts..." />
      <!-- Future: Speech-to-text button placeholder -->
    </div>
  </div>
</body>
```

**Key Elements:**
- `.ocean-background`: Animated gradient layer
- `#messageDisplay`: Scrollable container for conversation
- `#userInput`: Text input for user messages

### 2. CSS Architecture (css/style.css)

**Layout System:**
- Flexbox for vertical centering and positioning
- Fixed positioning for input container
- CSS Grid not required for this simple layout

**Animation Definitions:**
```css
@keyframes waveGradient {
  /* Gradient position shifts */
}

@keyframes fadeInWhisper {
  /* Opacity 0 → 1 over 1.5s */
}

@keyframes fadeInWave {
  /* Opacity 0 → 1 over 1.5s with delay */
}

@keyframes typing {
  /* Cursor blink effect */
}
```

**Color Palette:**
- Deep Blue: `#0a1128`, `#001f54`
- Soft Turquoise: `#40e0d0`, `#7dd3c0`
- Light Blue (Whisper): `#87ceeb`
- Text: `#e0f7fa` (light cyan for readability)

**Typography:**
- Body: Sans-serif (system fonts for performance)
- Whisper: Italic, 0.95em
- Wave of Reflection: Serif (Georgia, Times), 1.1em

**Responsive Breakpoints:**
- Mobile: < 768px (adjusted padding, font sizes)
- Desktop: ≥ 768px (default styles)

### 3. Main Application (js/main.js)

**State Management:**
```javascript
const appState = {
  conversationHistory: [],
  isProcessing: false
};
```

**Core Functions:**

```javascript
// Initialize application
function init() {
  // Set up event listeners
  // Initialize Gemini service
  // Start background animation
}

// Handle user message submission
async function handleUserMessage(message) {
  // 1. Validate input
  // 2. Add to conversation history
  // 3. Clear input field
  // 4. Call Gemini API via geminiService
  // 5. Process response
  // 6. Trigger UI updates
}

// Parse AI response into whisper and wave sections
function parseResponse(responseText) {
  // Split response into two parts
  // Return { whisper: string, wave: string }
}
```

**Event Listeners:**
- Enter key on input field → `handleUserMessage()`
- Input field focus/blur for mobile keyboard handling

### 4. Gemini Service (js/geminiService.js)

**Configuration:**
```javascript
const geminiConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
  model: 'gemini-pro' // Default model
};
```

**API Interface:**

```javascript
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = geminiConfig.endpoint;
  }

  // Send message with conversation history
  async sendMessage(conversationHistory, mode = 'spark') {
    // 1. Format request payload
    // 2. Make fetch call with async/await
    // 3. Handle response
    // 4. Return parsed text or error
  }

  // Format messages for Gemini API
  formatMessages(history) {
    // Convert internal format to Gemini format
    // Return formatted array
  }

  // Handle API errors
  handleError(error) {
    // Log error
    // Return user-friendly message
  }
}
```

**Supported Modes:**
- `spark`: General conversational intelligence
- `voice_chat`: Context-aware dialogue
- `bolt`: Fast response mode

**Request Format:**
```javascript
{
  contents: [
    { role: "user", parts: [{ text: "message" }] },
    { role: "model", parts: [{ text: "response" }] }
  ]
}
```

### 5. UI Module (js/ui.js)

**Rendering Functions:**

```javascript
// Display response with animations
function displayResponse(type, text) {
  // type: 'whisper' | 'wave'
  // 1. Create message element
  // 2. Apply appropriate CSS classes
  // 3. Append to message display
  // 4. Trigger animation
  // 5. Scroll to bottom
}

// Animate background gradient
function animateBackground() {
  // Use CSS animation or requestAnimationFrame
  // Continuously update gradient position
}

// Show typing indicator
function showTypingIndicator() {
  // Display animated dots
}

// Hide typing indicator
function hideTypingIndicator() {
  // Remove indicator element
}

// Scroll message display to bottom
function scrollToBottom() {
  // Smooth scroll to latest message
}

// Clear input field
function clearInput() {
  // Reset input value
}
```

**Message Structure:**
```html
<div class="message-container">
  <div class="whisper">Italic light-blue text...</div>
  <div class="wave-reflection">Serif larger text...</div>
</div>
```

## Data Models

### Conversation History

```javascript
[
  {
    role: 'user',
    content: 'User message text',
    timestamp: 1234567890
  },
  {
    role: 'assistant',
    content: 'AI response text',
    whisper: 'First part of response',
    wave: 'Second part of response',
    timestamp: 1234567891
  }
]
```

### API Response

```javascript
{
  candidates: [
    {
      content: {
        parts: [
          { text: 'Full response text' }
        ]
      }
    }
  ]
}
```

## Error Handling

### API Errors

**Network Failures:**
- Display gentle error message: "The waves are quiet right now. Please try again."
- Keep conversation history intact
- Allow retry without losing context

**Invalid API Key:**
- Show configuration error on initialization
- Provide clear instructions for setting API key

**Rate Limiting:**
- Detect 429 status codes
- Display message: "The ocean needs a moment to rest. Please wait briefly."
- Implement exponential backoff (optional enhancement)

### User Input Validation

**Empty Messages:**
- Prevent submission of empty or whitespace-only input
- No error message needed (silent validation)

**Long Messages:**
- Accept messages up to 2000 characters
- Truncate with warning if exceeded (optional)

### UI Error States

**Failed Animations:**
- Gracefully degrade to instant display if CSS animations fail
- Ensure content is always readable

**Scroll Issues:**
- Fallback to instant scroll if smooth scroll unsupported

## Testing Strategy

### Manual Testing Checklist

**Visual Testing:**
- [ ] Background gradient animates smoothly
- [ ] Whisper text appears in italic light-blue
- [ ] Wave text appears in serif with delay
- [ ] Layout is centered and responsive
- [ ] Mobile view adapts correctly

**Functional Testing:**
- [ ] Enter key sends message
- [ ] Input clears after sending
- [ ] Conversation history persists during session
- [ ] API calls include full history
- [ ] Error messages display appropriately

**Cross-Browser Testing:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

**Responsive Testing:**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### API Integration Testing

**Mock Responses:**
- Create test responses to verify parsing logic
- Test whisper/wave splitting algorithm
- Verify animation timing

**Error Scenarios:**
- Test with invalid API key
- Test with network disconnected
- Test with malformed responses

### Performance Considerations

**Animation Performance:**
- Use CSS transforms and opacity (GPU-accelerated)
- Avoid layout thrashing
- RequestAnimationFrame for JS animations

**Memory Management:**
- Limit conversation history to last 50 messages
- Clear old DOM elements if needed

**Load Time:**
- Inline critical CSS
- Defer non-critical JavaScript
- Minimize external dependencies (none required)

## Future Enhancements (Placeholders)

### Speech-to-Text
- Button in input container
- Web Speech API integration
- Visual indicator during recording

### Text-to-Speech
- Button on each AI response
- Web Speech Synthesis API
- Ocean-themed voice selection

### Conversation Export
- Download conversation as text file
- Preserve whisper/wave formatting

### Theme Customization
- Alternative color schemes (sunset, storm, calm)
- User preference storage in localStorage
