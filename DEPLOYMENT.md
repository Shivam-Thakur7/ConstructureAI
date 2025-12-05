# 🚀 Deployment Guide - ConstructureAI

Complete guide for deploying ConstructureAI to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account with repository
- Vercel account ([vercel.com](https://vercel.com))
- Render account ([render.com](https://render.com))
- Google Cloud Project with OAuth credentials configured
- Gemini API key

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] Google OAuth credentials created
- [ ] Gmail API enabled in Google Cloud Console
- [ ] Gemini API key obtained
- [ ] Production URLs planned:
  - Frontend: `https://your-app.vercel.app`
  - Backend: `https://your-backend.onrender.com`

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Verify `requirements.txt`** is complete:
```txt
fastapi
uvicorn[standard]
python-dotenv
google-auth
google-auth-oauthlib
google-auth-httplib2
google-api-python-client
pydantic
pydantic-settings
python-multipart
httpx
python-jose[cryptography]
passlib[bcrypt]
email-validator
google-generativeai
pytest
pytest-asyncio
```

2. **Create `render.yaml`** (already exists in `/backend`):
```yaml
services:
  - type: web
    name: constructureai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.13.2
```

3. **Verify `runtime.txt`** (already exists):
```txt
python-3.13.2
```

### Step 2: Deploy to Render

1. **Create New Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**:
   - Select **"Build and deploy from a Git repository"**
   - Click **"Connect GitHub"** and authorize Render
   - Select your `ConstructureAI` repository

3. **Configure Service**:
   - **Name**: `constructureai-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid for better performance)

4. **Add Environment Variables**:
   Click **"Advanced"** → **"Add Environment Variable"** for each:

   ```
   GOOGLE_CLIENT_ID=766056512876-xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
   GOOGLE_REDIRECT_URI=https://constructureai-backend.onrender.com/auth/google/callback
   FRONTEND_URL=https://constructure-ai.vercel.app
   SECRET_KEY=your-production-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ENVIRONMENT=production
   GEMINI_API_KEY=your-gemini-api-key
   ```

   **⚠️ Important:**
   - Use your actual Google OAuth credentials
   - Generate a new `SECRET_KEY` for production:
     ```bash
     python -c "import secrets; print(secrets.token_urlsafe(32))"
     ```
   - Update `GOOGLE_REDIRECT_URI` with your actual Render URL
   - Update `FRONTEND_URL` with your actual Vercel URL (will configure in Part 2)

5. **Deploy**:
   - Click **"Create Web Service"**
   - Wait for build to complete (5-10 minutes)
   - Note your backend URL: `https://constructureai-backend.onrender.com`

6. **Verify Deployment**:
   ```bash
   curl https://constructureai-backend.onrender.com/health
   # Should return: {"status": "healthy"}
   ```

### Step 3: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services" > "Credentials"**
3. Click your OAuth 2.0 Client ID
4. **Add Authorized redirect URIs**:
   ```
   https://constructureai-backend.onrender.com/auth/google/callback
   ```
5. **Add Authorized JavaScript origins** (for CORS):
   ```
   https://constructure-ai.vercel.app
   ```
6. Click **"Save"**

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Create `.env` file** in project root (optional):
```env
VITE_API_URL=https://constructureai-backend.onrender.com
```

2. **Update API URL in code** (if not using env variable):

   In `src/api.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   ```

3. **Verify `package.json` scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Option A: Deploy via Vercel Dashboard** (Recommended)

   a. Go to [Vercel Dashboard](https://vercel.com/dashboard)
   
   b. Click **"Add New..."** → **"Project"**
   
   c. **Import Git Repository**:
      - Click **"Import"** on your GitHub repository
      - Authorize Vercel if needed
   
   d. **Configure Project**:
      - **Project Name**: `constructure-ai` (or your choice)
      - **Framework Preset**: Vite
      - **Root Directory**: `./` (leave as root)
      - **Build Command**: `npm run build`
      - **Output Directory**: `dist`
   
   e. **Environment Variables**:
      - Click **"Add"** and enter:
        ```
        VITE_API_URL = https://constructureai-backend.onrender.com
        ```
   
   f. Click **"Deploy"**
   
   g. Wait for deployment (2-5 minutes)
   
   h. Your site will be live at: `https://constructure-ai.vercel.app`

3. **Option B: Deploy via CLI**:

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? constructure-ai
# - Directory? ./
# - Override build settings? No

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

After deployment, add environment variables:

```bash
# Via CLI
vercel env add VITE_API_URL production
# Enter: https://constructureai-backend.onrender.com

# Via Dashboard
# Go to Project → Settings → Environment Variables
# Add: VITE_API_URL = https://constructureai-backend.onrender.com
# Click "Save"
```

### Step 4: Update Backend CORS

Update `FRONTEND_URL` in Render environment variables:

1. Go to Render Dashboard → Your Service
2. Click **"Environment"**
3. Update `FRONTEND_URL` to: `https://constructure-ai.vercel.app`
4. Click **"Save Changes"**
5. Service will redeploy automatically

---

## Part 3: Post-Deployment Configuration

### Step 1: Update Google OAuth (Final)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services" > "Credentials"**
3. Edit your OAuth 2.0 Client

**Authorized JavaScript origins:**
```
http://localhost:5174
https://constructure-ai.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:8000/auth/google/callback
https://constructureai-backend.onrender.com/auth/google/callback
```

4. Click **"Save"**

### Step 2: Test Production Deployment

1. **Visit your frontend**: `https://constructure-ai.vercel.app`

2. **Test authentication flow**:
   - Click "Sign In"
   - Should redirect to Google OAuth
   - Grant permissions
   - Should redirect back to dashboard

3. **Test email features**:
   - Read emails
   - Generate replies
   - Categorize inbox
   - Create daily digest

4. **Check backend logs** (Render Dashboard → Logs):
```
INFO: Started server process
INFO: Application startup complete
INFO: Uvicorn running on http://0.0.0.0:10000
```

### Step 3: Monitor & Optimize

**Render Dashboard:**
- Monitor resource usage
- Check logs for errors
- Set up health checks

**Vercel Dashboard:**
- Monitor deployment status
- Check analytics
- Review build logs

---

## 🔧 Troubleshooting

### Issue: OAuth Redirect Mismatch
**Error:** `redirect_uri_mismatch`

**Solution:**
1. Check Google Cloud Console authorized redirect URIs match exactly
2. Ensure no trailing slashes
3. Verify HTTPS (not HTTP) in production URLs

### Issue: CORS Errors
**Error:** `Access-Control-Allow-Origin`

**Solution:**
1. Verify `FRONTEND_URL` in backend environment variables
2. Check `main.py` CORS middleware configuration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Backend Not Starting
**Error:** Build or start command fails

**Solution:**
1. Check `requirements.txt` is in `/backend` directory
2. Verify Python version in `runtime.txt`
3. Check Render logs for specific errors
4. Ensure all environment variables are set

### Issue: API Calls Failing
**Error:** 404 or 500 errors

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Check backend health: `curl https://your-backend.onrender.com/health`
3. Review Render logs for errors
4. Verify Google credentials are correct

### Issue: Gemini AI Errors
**Error:** "404 models not found"

**Solution:**
1. Verify `GEMINI_API_KEY` is set in Render environment
2. Check API quota in Google AI Studio
3. System uses fallback keyword-based logic if AI fails

---

## 📊 Production Monitoring

### Health Checks

**Backend Health:**
```bash
curl https://constructureai-backend.onrender.com/health
```

**API Info:**
```bash
curl https://constructureai-backend.onrender.com/
```

### Logs

**Render Logs:**
- Dashboard → Your Service → Logs
- Real-time log streaming
- Filter by severity

**Application Logs:**
- Backend logs to `app.log` (in-memory on Render)
- View via Render logs or add external logging service

### Performance

**Render:**
- Free tier: Limited CPU/memory
- Spins down after 15 minutes inactivity
- Upgrade to paid plan for always-on

**Vercel:**
- Automatic edge caching
- Global CDN distribution
- Instant cache invalidation

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   - Add to `.gitignore`
   - Use environment variables in platforms

2. **Rotate secrets regularly**
   - JWT SECRET_KEY
   - OAuth credentials (if compromised)

3. **Use HTTPS only in production**
   - Enforced by Vercel and Render

4. **Limit OAuth scopes**
   - Only request necessary Gmail permissions

5. **Monitor for suspicious activity**
   - Check logs regularly
   - Set up alerts for errors

6. **Rate limiting** (Future improvement)
   - Add rate limiting middleware
   - Protect against abuse

---

## 💰 Cost Considerations

### Free Tier Limits

**Render Free:**
- 750 hours/month
- 512MB RAM
- Spins down after 15 min inactivity
- Limited build minutes

**Vercel Free:**
- 100GB bandwidth/month
- Unlimited sites
- Automatic HTTPS
- Edge network

**Gmail API:**
- Free tier: 1 billion quota units/day
- Typical usage: ~5 units per email read

**Gemini API:**
- Free tier: 60 requests/minute
- Rate limits may apply

### Upgrading

**Render:** $7+/month for always-on service
**Vercel:** $20+/month for team features
**Google Cloud:** Pay-as-you-go for API overages

---

## 🎯 Production URLs

Update these in your documentation:

```markdown
**Live Demo:**
- Frontend: https://constructure-ai.vercel.app
- Backend: https://constructureai-backend.onrender.com
- API Docs: https://constructureai-backend.onrender.com/docs
```

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] CORS settings configured
- [ ] Health checks passing
- [ ] Authentication flow working
- [ ] Email features tested
- [ ] Logs monitored for errors
- [ ] README updated with live URLs

---

## 📞 Support

If you encounter issues during deployment:

1. Check Render/Vercel logs
2. Review troubleshooting section above
3. Create GitHub issue with error details
4. Contact: shivamthakurpvt@gmail.com

---

**Deployment completed! 🎉**

Your ConstructureAI application is now live and accessible worldwide.
