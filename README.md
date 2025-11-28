# 🌊 Whispers of the Wave

An introspective AI experience where the ocean reflects your emotions. Built for **Game Off 2025** with the theme **WAVES**.

![Whispers of the Wave](https://img.shields.io/badge/Game%20Off-2025-blue?style=for-the-badge)
![Theme](https://img.shields.io/badge/Theme-WAVES-cyan?style=for-the-badge)
![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-green?style=for-the-badge)

## 🎮 Play Now

**No setup required!** The game includes a Demo Mode that works without any configuration.

Simply open `index.html` in your browser:

```bash
# Windows
start index.html

# Or use a local server for full features
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Demo Mode vs Full Mode

| Feature | Demo Mode | Full Mode (with API key) |
|---------|-----------|--------------------------|
| Wave backgrounds | ✅ | ✅ |
| Theme switching | ✅ | ✅ |
| Achievements | ✅ | ✅ |
| AI conversations | Predefined responses | Real Gemini AI |
| Voice (TTS) | ❌ | ✅ |

## ⚙️ Full Setup (Optional)

To enable real AI conversations:

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `js/config.local.example.js` to `js/config.local.js`
3. Add your API key to the config file
4. Refresh the page

## ✨ Features

- **4 Wave Types**: Calm 🌊, Deep 🌀, Energetic ⚡, Healing 💙
- **AI Personas**: Guardian, Explorer, Solver, Healer
- **Dynamic Ocean**: Background responds to emotional tone
- **Dual Responses**: Whispers (poetic) + Waves of Reflection
- **Achievements**: Unlock milestones as you explore
- **i18n**: English, Spanish, Romanian
- **Dark/Light Themes**: Ocean-appropriate color palettes
- **Voice Input**: Speech-to-text support
- **PWA Ready**: Install as an app

## 🎯 Theme Interpretation: WAVES

- **Ocean Waves**: Dynamic animated backgrounds that flow and respond
- **Emotional Waves**: AI responses adapt to your mood
- **Thought Waves**: Conversations as ripples of reflection
- **Sound Waves**: Text-to-speech for immersive experience

## 🖼️ Screenshots

### Wave Selection
Choose your ocean state - each wave creates a unique atmosphere.

### Conversation
Chat with AI personas in a peaceful, reflective environment.

### Achievements
Unlock milestones as you explore the depths of conversation.

## 🛠️ Tech Stack

- Pure Vanilla JavaScript (ES6+)
- HTML5 + CSS3 with GPU-accelerated animations
- Google Gemini API (optional)
- Zero dependencies, no build process

## 📁 Structure

```
├── index.html          # Main entry point
├── css/                # Stylesheets (5 files)
├── js/                 # JavaScript modules (~45 files)
│   ├── core/           # Infrastructure
│   ├── services/       # API & audio
│   ├── engine/         # Game logic
│   ├── ui/             # UI components
│   ├── features/       # Features
│   └── i18n/           # Translations
└── assets/             # Icons
```

## 🎮 Controls

- **Enter**: Send message
- **Ctrl+K**: Clear conversation
- **Ctrl+/**: Show keyboard shortcuts
- **Esc**: Stop audio / Close modals

## 📜 License

MIT License - See [LICENSE](LICENSE)

---

Made with 🌊 for [Game Off 2025](https://itch.io/jam/game-off-2025)
