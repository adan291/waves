# Implementation Plan

- [x] 1. Create project structure and HTML foundation


  - Create index.html with semantic structure including ocean-background div, message-display container, and input-container with text input
  - Add meta tags for responsive viewport and character encoding
  - Link CSS and JavaScript files in correct order
  - Include placeholder HTML comments for future speech-to-text and text-to-speech features
  - _Requirements: 7.1, 8.1, 8.2_

- [x] 2. Implement CSS styling and animations


  - [x] 2.1 Create base styles and layout system


    - Write CSS reset and base body styles with flexbox layout
    - Style the ocean-background div as a full-viewport fixed layer
    - Style the container with centered positioning and appropriate z-index
    - Style the message-display area with scrollable overflow and padding
    - Style the input-container with fixed bottom positioning
    - _Requirements: 1.2, 1.3, 6.3_

  - [x] 2.2 Implement ocean gradient animation


    - Define @keyframes waveGradient animation with gradient position shifts between deep blues (#0a1128, #001f54) and soft turquoise (#40e0d0, #7dd3c0)
    - Apply animation to ocean-background with infinite duration and ease-in-out timing
    - _Requirements: 1.1, 1.5_

  - [x] 2.3 Create message styling and fade animations


    - Define @keyframes fadeInWhisper with opacity transition over 1.5 seconds
    - Define @keyframes fadeInWave with opacity transition and 0.8 second delay
    - Style .whisper class with italic font, light-blue color (#87ceeb), and fadeInWhisper animation
    - Style .wave-reflection class with serif font (Georgia), larger size (1.1em), and fadeInWave animation
    - Add typing animation effect with cursor blink
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.4 Implement responsive styles for mobile


    - Create media query for viewport widths below 768px
    - Adjust padding, font sizes, and input box sizing for mobile devices
    - Ensure touch-friendly input targets (minimum 44px height)
    - Prevent horizontal scrolling with overflow-x hidden
    - _Requirements: 1.4, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Build Gemini API service module


  - [x] 3.1 Create GeminiService class structure


    - Write GeminiService class with constructor accepting apiKey parameter
    - Define configuration object with API endpoint URL and default model
    - Store apiKey and baseUrl as instance properties
    - _Requirements: 5.1, 5.3_

  - [x] 3.2 Implement message sending functionality


    - Write async sendMessage method accepting conversationHistory and optional mode parameter
    - Implement formatMessages helper to convert internal history format to Gemini API format
    - Use fetch API with async/await to make POST request to Gemini endpoint
    - Parse response JSON and extract text from candidates array
    - Return response text or call handleError on failure
    - _Requirements: 5.2, 5.3, 5.5_

  - [x] 3.3 Add error handling


    - Write handleError method to process API errors
    - Detect network failures, invalid API key (401), and rate limiting (429)
    - Return user-friendly error messages for each error type
    - Log errors to console for debugging
    - _Requirements: 5.4_

- [x] 4. Create UI manipulation module


  - [x] 4.1 Implement message display functions


    - Write displayResponse function accepting type ('whisper' or 'wave') and text parameters
    - Create DOM elements with appropriate classes based on type
    - Append elements to message-display container
    - Trigger CSS animations by adding animation classes
    - Call scrollToBottom after appending
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 4.2 Add utility UI functions


    - Write scrollToBottom function using smooth scroll behavior
    - Write clearInput function to reset input field value
    - Write showTypingIndicator function to display animated dots during API calls
    - Write hideTypingIndicator function to remove indicator
    - _Requirements: 2.2_

  - [x] 4.3 Add placeholder functions for future features


    - Write commented function stubs for handleSpeechToText
    - Write commented function stubs for handleTextToSpeech
    - Include JSDoc comments explaining future implementation
    - _Requirements: 8.3, 8.4, 8.5_

- [x] 5. Implement main application logic


  - [x] 5.1 Create application state and initialization


    - Define appState object with conversationHistory array and isProcessing boolean
    - Write init function to set up event listeners on DOM load
    - Initialize GeminiService instance with placeholder API key
    - Add Enter key event listener to userInput field
    - _Requirements: 4.1, 4.2_

  - [x] 5.2 Build message handling workflow


    - Write handleUserMessage async function accepting message parameter
    - Validate input is not empty or whitespace-only
    - Add user message to conversationHistory with role 'user'
    - Clear input field using UI module
    - Show typing indicator using UI module
    - Call geminiService.sendMessage with conversationHistory
    - Parse response using parseResponse helper
    - Add AI response to conversationHistory with role 'assistant'
    - Display whisper and wave sections using UI module
    - Hide typing indicator
    - Handle errors gracefully with user-friendly messages
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.3, 4.4_

  - [x] 5.3 Implement response parsing logic


    - Write parseResponse function to split AI response into whisper and wave sections
    - Use simple heuristic (split at first period or midpoint) to divide text
    - Return object with whisper and wave properties
    - Handle edge cases (very short responses, no punctuation)
    - _Requirements: 3.1, 3.3_

  - [x] 5.4 Add conversation history management

    - Ensure conversationHistory persists throughout session
    - Implement array push operations for user and assistant messages
    - Include timestamp with each message entry
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Integration and final touches



  - [x] 6.1 Wire all modules together

    - Import/reference all JavaScript modules in index.html in correct order (geminiService, ui, main)
    - Verify event listeners are properly connected
    - Test end-to-end flow from user input to AI response display
    - _Requirements: 7.3, 7.4, 7.5_

  - [x] 6.2 Add API key configuration instructions


    - Add HTML comment in index.html with instructions for setting Gemini API key
    - Include link to Google AI Studio for obtaining API key
    - Add console.log message on init if API key is still placeholder
    - _Requirements: 5.1_

  - [x] 6.3 Perform cross-browser testing


    - Test in Chrome/Edge to verify all features work
    - Test in Firefox to verify compatibility
    - Test on mobile devices (iOS Safari, Chrome Mobile) for responsive behavior
    - Fix any browser-specific issues discovered
    - _Requirements: 1.4, 6.1, 6.2, 6.4, 6.5_

  - [x] 6.4 Validate accessibility and performance


    - Verify keyboard navigation works correctly
    - Check color contrast ratios meet WCAG standards
    - Test animation performance on lower-end devices
    - Optimize any performance bottlenecks discovered
    - _Requirements: 1.5, 6.4_
