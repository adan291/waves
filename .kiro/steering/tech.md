# Technical Stack

## Core Technologies

- **Pure Vanilla JavaScript** - No frameworks or build tools
- **HTML5** - Semantic markup with accessibility attributes
- **CSS3** - Keyframe animations with GPU acceleration
- **Google Gemini API** - AI conversation backend (gemini-pro model)

## Architecture

- **No build process** - Direct browser execution
- **No dependencies** - Zero npm packages or external libraries
- **Module pattern** - Separate JS files for concerns (service, UI, main logic)
- **State management** - Simple object-based state in main.js

## API Integration

- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/`
- Model: `gemini-pro`
- API key configuration in `js/geminiService.js`
- Error handling with user-friendly ocean-themed messages

## Browser Compatibility

- Chrome/Edge (Chromium): Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design with touch-friendly targets

## Common Commands

### Running the Application
```bash
# Simply open index.html in a browser - no build required
# On Windows:
start index.html

# Or use a simple HTTP server if needed:
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Development
No compilation, bundling, or transpilation needed. Edit files and refresh browser.

## Performance Considerations

- CSS animations use GPU acceleration
- Smooth scrolling behavior
- Minimal DOM manipulation
- Efficient message parsing and display
