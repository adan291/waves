# Security Guide

## 🔒 API Key Management

### CRITICAL: Never Commit API Keys

API keys should **NEVER** be committed to version control. This project uses a local configuration file pattern to keep keys secure.

### Setup Instructions

1. **Copy the example config:**
   ```bash
   copy js\config.local.example.js js\config.local.js
   ```

2. **Add your API key to `js/config.local.js`:**
   ```javascript
   const localConfig = {
       apiKey: 'YOUR_ACTUAL_GEMINI_API_KEY'
   };
   ```

3. **Get your API key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Create a new API key
   - Copy and paste into `config.local.js`

4. **Verify `.gitignore` includes:**
   ```
   js/config.local.js
   ```

### How It Works

- `js/config.local.example.js` - Template file (committed to git)
- `js/config.local.js` - Your actual config (gitignored, never committed)
- `js/services/geminiService.js` - Loads config if available, falls back to placeholder

### If You Accidentally Committed an API Key

1. **Revoke the key immediately** at https://makersuite.google.com/app/apikey
2. **Generate a new key**
3. **Remove the key from git history:**
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Or simply delete the repository and start fresh
   ```
4. **Update your local `config.local.js` with the new key**

## 🛡️ Additional Security Measures

### For Production Deployment

**Option 1: Backend Proxy (Recommended)**
- Create a backend server that proxies Gemini API requests
- Store API key in server environment variables
- Frontend calls your backend, not Gemini directly

**Option 2: Environment Variables**
- Use build-time environment variable injection
- Configure in your hosting platform (Vercel, Netlify, etc.)

### API Key Restrictions

Configure your Gemini API key with restrictions:
1. Go to Google Cloud Console
2. Find your API key
3. Add restrictions:
   - **Application restrictions:** HTTP referrers (websites)
   - **API restrictions:** Only allow Gemini API
   - **Quota limits:** Set daily usage limits

## 📋 Security Checklist

- [ ] `js/config.local.js` is in `.gitignore`
- [ ] No API keys in any committed files
- [ ] API key has usage restrictions configured
- [ ] API key has quota limits set
- [ ] Regular monitoring of API usage
- [ ] Team members know not to commit keys

## 🚨 If You Suspect Key Compromise

1. Revoke the key immediately
2. Generate a new key with restrictions
3. Review API usage logs for unauthorized access
4. Update all local configurations

## 📞 Support

For security concerns, contact the project maintainer immediately.
