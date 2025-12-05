# ⚡ Quick Start Guide - ConstructureAI

Get up and running with ConstructureAI in under 10 minutes!

## 🚀 For the Impatient

```bash
# 1. Clone
git clone https://github.com/Shivam-Thakur7/ConstructureAI.git
cd ConstructureAI

# 2. Frontend
npm install
npm run dev  # Runs on http://localhost:5174

# 3. Backend (new terminal)
cd backend
python -m venv ../.venv
..\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Create .env file with your credentials (see below)
python main.py  # Runs on http://localhost:8000

# 4. Visit http://localhost:5174 and sign in!
```

## 🔑 Minimum Required Setup

### 1. Get Google OAuth Credentials (5 minutes)

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Create Project** → Enter name → Create
3. **Enable Gmail API**:
   - Left menu → "APIs & Services" → "Library"
   - Search "Gmail API" → Enable
4. **Create OAuth Client**:
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "OAuth client ID"
   - Configure consent screen (add your email)
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:8000/auth/google/callback`
   - Authorized JavaScript origins: `http://localhost:5174`
   - Copy **Client ID** and **Client Secret**

### 2. Get Gemini API Key (2 minutes)

1. **Go to**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Get API Key** → Select project → Create
3. Copy the API key

### 3. Create Backend .env File (1 minute)

Create `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://localhost:5174
SECRET_KEY=any-random-string-here-make-it-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=development
GEMINI_API_KEY=your-gemini-api-key-here
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Add Test User in Google OAuth (1 minute)

1. **Go to**: [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Click **"ADD USERS"** under "Test users"
3. Add your Gmail address
4. Click **"Save"**

## ✅ Verify Installation

### Backend Health Check
```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

### Frontend Access
Open browser → `http://localhost:5174` → Should see ConstructureAI homepage

### Test Authentication
1. Click "Sign In"
2. Select your Google account
3. Grant permissions (Gmail read, send, modify)
4. Should redirect to dashboard

## 🎮 Try These Commands

Once signed in, try in the chatbot:

```
"Read my emails"
"Generate replies"
"Categorize my inbox"
"Give me today's digest"
"Delete email #2"
```

## 🐛 Quick Troubleshooting

### "redirect_uri_mismatch" Error
- Check Google Console authorized redirect URI matches exactly: `http://localhost:8000/auth/google/callback`
- No trailing slash!

### "CORS Error"
- Verify `FRONTEND_URL=http://localhost:5174` in backend `.env`
- Restart backend server

### "Module not found"
- Frontend: `npm install`
- Backend: `pip install -r requirements.txt`

### Backend won't start
- Check `.env` file exists in `/backend` directory
- Verify all required environment variables are set
- Check port 8000 is not in use: `netstat -ano | findstr :8000`

### No emails showing
- Check Gmail account has emails
- Verify Gmail API is enabled in Google Cloud Console
- Check test user is added in OAuth consent screen

## 📖 Next Steps

- **Full Documentation**: See main [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Feature Details**: See [backend/FEATURES_VERIFICATION.md](backend/FEATURES_VERIFICATION.md)
- **API Documentation**: Visit `http://localhost:8000/docs` when backend is running

## 💡 Pro Tips

1. **Keep backend running**: Open two terminals, one for backend, one for frontend
2. **Watch logs**: Backend logs show in terminal and `backend/app.log`
3. **Test mode**: Google OAuth works in test mode with added test users
4. **Auto-reload**: Both servers auto-reload on code changes

## ❓ Still Stuck?

1. Check terminal for error messages
2. View browser console (F12)
3. Review [README.md](README.md) troubleshooting section
4. Create GitHub issue with error details

---

**Happy coding! 🎉**

Need help? Contact: shivamthakurpvt@gmail.com
