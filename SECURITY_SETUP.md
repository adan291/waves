# 🔐 Security Setup Guide

## ⚠️ IMPORTANT: API Key Configuration

This project requires a Google Gemini API key to function. **Never commit your API key to version control.**

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your key (starts with `AIzaSy...`)

### Step 2: Configure Locally
1. Copy the example config:
   ```bash
   copy js\config.local.example.js js\config.local.js
   ```

2. Open `js/config.local.js` in your editor

3. Replace `YOUR_API_KEY_HERE` with your actual key:
   ```javascript
   const localConfig = {
       apiKey: 'AIzaSy...'  // Your actual key here
   };
   ```

4. Save the file

### Step 3: Verify
1. Open `index.html` in your browser
2. Try sending a message
3. If you see a response, you're all set! 🎉

## 🔒 Security Best Practices

### ✅ DO:
- Keep `js/config.local.js` in `.gitignore` (already configured)
- Use environment-specific config files
- Rotate your key if accidentally exposed
- Use API key restrictions in Google Cloud Console

### ❌ DON'T:
- Commit `config.local.js` with a real key
- Share screenshots showing your key
- Push logs containing your key
- Hardcode keys in source files

## 🚨 If Your Key Was Exposed

1. **Immediately** go to: https://console.cloud.google.com/apis/credentials
2. Delete the exposed key
3. Create a new key
4. Update your `config.local.js`
5. Check your Google Cloud billing for unexpected usage

## 📝 For Deployment

For production deployment, use environment variables or secure secret management:

### GitHub Pages / Static Hosting
- Users must provide their own API key
- Show setup instructions on first visit
- Store key in localStorage (client-side only)

### With Backend
- Store API key server-side
- Use environment variables
- Never expose in client code

## 🎮 For Game Jam Submission

When submitting to Game Off 2025:
- ✅ Include `config.local.example.js` in repo
- ✅ Include this security guide
- ✅ Ensure `.gitignore` is configured
- ❌ Never include `config.local.js` with real key
- ✅ Document setup in README

## 🆘 Need Help?

If you're having issues:
1. Check that `config.local.js` exists
2. Verify your API key is valid
3. Check browser console for errors
4. See [QUICKSTART.md](docs/QUICKSTART.md) for detailed setup

---

**Remember**: Your API key is like a password. Keep it secret, keep it safe! 🔐
