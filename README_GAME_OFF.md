# 🌊 Whispers of the Wave

> **Game Off 2025 Entry** - Theme: WAVES

An immersive conversational experience where the ocean reflects your emotions through AI-powered dialogue.

[![Play Now](https://img.shields.io/badge/Play-Now-blue?style=for-the-badge)](https://your-username.github.io/whispers-of-the-wave)
[![Game Off 2025](https://img.shields.io/badge/Game%20Off-2025-orange?style=for-the-badge)](https://itch.io/jam/game-off-2025)

---

## 🎮 About

**Whispers of the Wave** is an experimental interactive experience that explores the theme "WAVES" through multiple lenses:

- 🌊 **Emotional Waves**: Your feelings flow like ocean currents
- 💭 **Conversational Waves**: Dialogue ebbs and flows naturally
- 🎨 **Visual Waves**: The ocean background responds to your emotional state
- 🔄 **Reflective Waves**: AI mirrors your thoughts back to you

Share your thoughts with the AI, and watch as the ocean transforms—colors shift, waves intensify, and the entire environment becomes a reflection of your inner world.

---

## ✨ Features

- 🤖 **Dual AI Personalities**: Converse with *Whispers* (poetic, introspective) or *Kiro* (analytical, supportive)
- 🌊 **Reactive Ocean Environment**: Dynamic background that changes based on emotional tone
- 🎨 **Beautiful Animations**: Smooth, GPU-accelerated CSS animations
- 🌍 **Multi-language Support**: English, Spanish, French, German
- 🏆 **Achievement System**: Unlock achievements as you explore different emotional states
- 🔊 **Text-to-Speech**: AI responses can be read aloud (powered by Gemini)
- 🌓 **Light/Dark Themes**: Choose your preferred visual style
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile

---

## 🎯 Theme Interpretation: WAVES

This project interprets the Game Off 2025 theme "WAVES" in several creative ways:

### 1. Emotional Waves
Conversations create ripples of emotion that flow through the experience. The AI detects emotional tones (joy, sadness, anxiety, calm) and the ocean responds accordingly.

### 2. Visual Waves
The animated ocean background features:
- Dynamic gradient shifts based on mood
- Wave intensity that matches emotional energy
- Smooth transitions between states

### 3. Conversational Waves
Dialogue flows naturally like waves:
- Questions and answers create a rhythm
- Thoughts build upon each other
- Reflections come in waves of insight

### 4. Sound Waves
Text-to-Speech integration brings the AI's voice to life, creating auditory waves of communication.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Free Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/whispers-of-the-wave.git
   cd whispers-of-the-wave
   ```

2. **Get a Gemini API key** (free)
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy your key

3. **Configure your API key**
   ```bash
   # Copy the example config
   copy js\config.local.example.js js\config.local.js
   
   # Edit js/config.local.js and replace YOUR_API_KEY_HERE with your actual key
   ```

4. **Run the application**
   ```bash
   # Simply open index.html in your browser
   start index.html
   
   # Or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

5. **Start conversing!**
   - Type a message and press Enter
   - Watch the ocean respond to your emotions
   - Explore different conversational paths

---

## 🛠️ Tech Stack

- **Pure Vanilla JavaScript** - No frameworks, no build process
- **HTML5** - Semantic markup with accessibility
- **CSS3** - Keyframe animations with GPU acceleration
- **Google Gemini API** - AI conversation backend (gemini-2.5-flash)
- **Web Speech API** - Text-to-Speech integration

### Why Vanilla JS?

This project intentionally uses no frameworks or build tools to demonstrate:
- Clean, readable code
- Fast load times (< 700 KB total)
- No dependency hell
- Easy to understand and modify
- Works anywhere, anytime

---

## 🎨 Screenshots

> Add screenshots here after deployment

---

## 🏗️ Architecture

```
whispers-of-the-wave/
├── index.html              # Main entry point
├── css/
│   ├── core.css           # Base styles
│   ├── components.css     # UI components
│   ├── animations.css     # Keyframe animations
│   ├── responsive.css     # Mobile-first responsive
│   └── waves.css          # Ocean background effects
├── js/
│   ├── core/              # Core infrastructure (16 modules)
│   ├── services/          # API services (2 modules)
│   ├── engine/            # Game logic (8 modules)
│   ├── ui/                # UI components (10 modules)
│   ├── features/          # Features (6 modules)
│   └── main.js            # Application entry
└── assets/                # Icons and images
```

**Total**: 40 modular JavaScript files, organized in 4 layers

---

## 🎮 How to Play

1. **Start a Conversation**: Type anything that's on your mind
2. **Watch the Ocean**: Notice how colors and waves change
3. **Explore Emotions**: Try different emotional tones
4. **Unlock Achievements**: Discover hidden achievements
5. **Switch Languages**: Try the experience in different languages
6. **Change Themes**: Toggle between light and dark modes

### Tips
- Be honest and introspective for the best experience
- Try asking deep questions about life
- Experiment with different emotional states
- Use voice input (microphone button) for hands-free interaction

---

## 🏆 Achievements

Unlock achievements by:
- Having your first conversation
- Exploring different emotional states
- Reaching conversation milestones
- Discovering hidden features

---

## 🔐 Security & Privacy

- ✅ **No data collection**: Everything runs in your browser
- ✅ **Local storage only**: Conversations saved locally
- ✅ **API key security**: Your key never leaves your device
- ✅ **No tracking**: Zero analytics or tracking scripts
- ✅ **Open source**: Inspect the code yourself

---

## 📖 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 5 minutes
- **[User Guide](USER_GUIDE.md)** - Complete feature guide
- **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture
- **[API Reference](docs/API_REFERENCE.md)** - Developer API docs
- **[Security Setup](SECURITY_SETUP.md)** - API key configuration

---

## 🧪 Testing

This project includes:
- 111 unit tests (100% passing)
- 50% code coverage
- Automated test runner
- Performance monitoring
- Diagnostic tools

Run tests by opening `tests/run-all-tests.html` in your browser.

---

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select `main` branch
4. Visit `https://your-username.github.io/whispers-of-the-wave`

### Other Options
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect GitHub repo
- **Cloudflare Pages**: Deploy from Git

**Note**: Users will need to provide their own Gemini API key.

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
# Clone the repo
git clone https://github.com/your-username/whispers-of-the-wave.git

# No build process needed!
# Just edit files and refresh browser

# Run tests
# Open tests/run-all-tests.html in browser
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Game Off 2025** - For the inspiring theme and community
- **Google Gemini** - For the powerful AI API
- **GitHub** - For hosting and version control
- **itch.io** - For the game jam platform

---

## 📞 Links

- **Play Online**: [GitHub Pages](https://your-username.github.io/whispers-of-the-wave)
- **Source Code**: [GitHub Repository](https://github.com/your-username/whispers-of-the-wave)
- **itch.io Page**: [Game Off 2025 Entry](https://your-username.itch.io/whispers-of-the-wave)
- **Game Off 2025**: [Official Jam Page](https://itch.io/jam/game-off-2025)

---

## 🌊 Made with Waves

Created with 🌊 for **Game Off 2025**

*"In every wave, there's a story. In every conversation, there's an ocean."*

---

## 🐛 Known Issues

- TTS may not work in all browsers (Chrome/Edge recommended)
- API key must be configured manually (no backend)
- Requires internet connection for AI responses

---

## 🔮 Future Plans

- [ ] Offline mode with cached responses
- [ ] More AI personalities
- [ ] Conversation export/import
- [ ] Multiplayer conversations
- [ ] Mobile apps (iOS/Android)

---

**Enjoy your journey through the waves!** 🌊✨
