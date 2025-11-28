# Project Structure

```
whispers-of-the-wave/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── favicon.svg             # App icon
├── css/
│   ├── core.css           # Base styles, variables, reset
│   ├── components.css     # UI components (buttons, modals)
│   ├── animations.css     # Keyframe animations
│   ├── responsive.css     # Media queries
│   └── waves.css          # Wave background animations
├── js/
│   ├── main.js            # Application entry point
│   ├── config.local.example.js  # API key config template
│   ├── config.performance.js    # Performance settings
│   ├── core/              # Infrastructure (state, events, logger)
│   ├── services/          # External services (Gemini API, audio)
│   ├── engine/            # Game logic (personas, emotions, achievements)
│   ├── ui/                # UI components (renderer, controls, modals)
│   ├── features/          # Features (splash, waves, i18n, theme)
│   ├── i18n/              # Internationalization
│   ├── prompts/           # AI prompt templates
│   └── utils/             # Utility functions
└── assets/                # Icons (192px, 512px)
```

## Key Files

- **index.html**: Semantic HTML with accessibility attributes
- **js/main.js**: Application state and initialization
- **js/services/geminiService.js**: Gemini API integration
- **js/engine/personas.js**: AI personas (Guardian, Explorer, Healer, Solver)
- **js/features/waveBackground.js**: Dynamic wave backgrounds
- **js/i18n/translations.js**: Multi-language support (ES, EN, RO)
