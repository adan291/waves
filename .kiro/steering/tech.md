# Technical Stack

## Core Technologies

- **Pure Vanilla JavaScript** - No frameworks or build tools
- **HTML5** - Semantic markup with accessibility
- **CSS3** - Keyframe animations with GPU acceleration
- **Google Gemini API** - AI conversation backend

## Architecture

- **No build process** - Direct browser execution
- **No dependencies** - Zero npm packages
- **Module pattern** - Separate JS files for concerns
- **Lazy loading** - Non-critical features load on demand

## API Integration

- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/`
- Model: `gemini-pro`
- Config: `js/config.local.js` (gitignored)

## Running the Application

```bash
# Simply open in browser - no build required
start index.html

# Or use HTTP server
python -m http.server 8000
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Responsive with touch targets

## Performance

- CSS animations use GPU acceleration
- Lazy loading for non-critical modules
- Efficient DOM manipulation
- LocalStorage for persistence
