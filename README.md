# 🤖 ConstructureAI - AI-Powered Email Assistant

An intelligent email management system that uses Google Gmail API and AI to help you read, categorize, reply to, and manage your emails efficiently through a conversational chatbot interface.

## 📋 Overview

ConstructureAI is a full-stack web application that integrates Google OAuth, Gmail API, and Google Gemini AI to provide an intelligent email management experience. The system features natural language understanding, smart inbox categorization, automated reply generation, daily digest creation, and comprehensive logging for enterprise-grade reliability.

### Key Features

- ✅ **Google OAuth 2.0 Authentication** - Secure login with Gmail permissions
- 📧 **Email Management** - Read, reply, send, and delete emails via AI chatbot
- 🤖 **AI-Powered Features**:
  - Generate contextual email replies
  - Categorize inbox (Work, Personal, Promotions, Urgent)
  - Create daily email digests with priorities
  - Natural language command understanding
- 📊 **Observability & Resilience**:
  - Comprehensive event logging
  - Retry logic with exponential backoff
  - Real-time status feedback
- 🧪 **Automated Testing** - 16+ tests covering core backend logic
- 🎨 **Modern UI** - Clean, professional interface built with React + Tailwind CSS

## 🚀 Live Demo

**Frontend (Vercel):** `https://constructure-ai-ecru.vercel.app` *(Deploy to get your URL)*  
**Backend API (Render):** `https://constructure-ai-backend.onrender.com` *(Deploy to get your URL)*

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment instructions.

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **Vite 4.5** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.13** - Programming language
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **python-jose** - JWT authentication
- **httpx** - Async HTTP client

### APIs & Services
- **Google OAuth 2.0** - Authentication
- **Gmail API** - Email operations (read, send, modify, delete)
- **Google Gemini AI** - Natural language processing and reply generation
- **Google Generative AI** - Email summaries and content generation

### Testing & DevOps
- **pytest** - Testing framework
- **pytest-asyncio** - Async test support
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📦 Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- Google Cloud Project with OAuth credentials
- Gmail API enabled
- Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Shivam-Thakur7/ConstructureAI.git
cd ConstructureAI
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5174`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv ../.venv

# Activate virtual environment
# Windows:
..\.venv\Scripts\activate
# macOS/Linux:
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see Environment Variables section below)
# Copy the .env.example or create manually

# Run the server
python main.py
```

The backend will run on `http://localhost:8000`

## 🔑 Google OAuth & Gmail API Configuration

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your **Project ID**

### Step 2: Enable Gmail API

1. Navigate to **"APIs & Services" > "Library"**
2. Search for **"Gmail API"**
3. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Select **"External"** user type (or Internal if using Google Workspace)
3. Fill in application details:
   - **App name**: ConstructureAI
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add **Scopes**:
   - `userinfo.email`
   - `userinfo.profile`
   - `gmail.readonly`
   - `gmail.send`
   - `gmail.modify`
5. Add **Test users** (for development):
   - Add your Gmail addresses that will test the app

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "OAuth client ID"**
3. Select **"Web application"**
4. Configure:
   - **Name**: ConstructureAI OAuth Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5174
     https://constructure-ai.vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:8000/auth/google/callback
     https://constructureai-backend.onrender.com/auth/google/callback
     ```
5. Click **"Create"**
6. Copy your **Client ID** and **Client Secret**

### Step 5: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Select your Google Cloud Project
4. Copy the generated API key

## 🔐 Environment Variables

### Backend (.env file in `/backend` directory)

Create a `.env` file in the `backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5174

# JWT Configuration
SECRET_KEY=your-strong-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Environment
ENVIRONMENT=development

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key-here
```

### Frontend (Optional - for production)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

### Generating SECRET_KEY

Use Python to generate a secure random key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# App runs on http://localhost:5174
```

### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🧪 Running Tests

```bash
cd backend
python -m pytest tests/test_email_system.py -v

# With coverage
python -m pytest tests/test_email_system.py --cov=. --cov-report=html
```

**Test Results:**
- ✅ 16 tests covering NLP, AI service, retry logic, Gmail parsing, command mapping, and email filtering
- ✅ All tests passing

## 📡 API Endpoints

### Authentication
- `GET /auth/google/login` - Get Google OAuth URL
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/me` - Get current user (requires JWT)
- `POST /auth/logout` - Logout user
- `GET /auth/check-permissions` - Check Gmail permissions

### Email Operations
- `GET /emails` - Fetch recent emails
- `POST /emails/generate-replies` - Generate AI replies
- `POST /emails/send-reply` - Send email reply
- `DELETE /emails/{email_id}` - Delete email
- `POST /emails/parse-command` - Parse natural language command
- `POST /emails/categorize` - Categorize inbox (20 emails)
- `GET /emails/daily-digest` - Generate daily email digest
- `GET /emails/status/{operation}` - Get operation status

### Health
- `GET /` - API information
- `GET /health` - Health check

## 🎯 Usage Flow

1. **Sign In**: Click "Sign In" and authenticate with your Google account
2. **Grant Permissions**: Allow Gmail read, send, and modify permissions
3. **Chat Interface**: Use the chatbot dashboard to manage emails:
   - "Read my recent emails"
   - "Generate replies"
   - "Categorize my inbox"
   - "Give me today's digest"
   - "Delete email #2"
   - Or use natural language: "Show me urgent emails from last week"

## 📊 Features in Detail

### 1. Email Reading & AI Summaries
- Fetches recent emails from Gmail
- Generates concise AI summaries for each email
- Displays sender, subject, date, and content preview

### 2. AI Reply Generation
- Analyzes email context and tone
- Generates contextual, professional replies
- Edit before sending or send directly

### 3. Smart Categorization
- Analyzes 20 most recent emails
- Categories: Work, Personal, Promotions, Urgent
- Keyword-based classification with AI summaries

### 4. Daily Digest
- Prioritizes emails into: Urgent, Action Required, FYI
- Shows sender, subject, and priority level
- Helps focus on what matters most

### 5. Natural Language Commands
- Parse commands like "Show me important emails"
- Fallback to keyword matching for reliability
- Supports: read, reply, delete, categorize, digest

### 6. Observability & Resilience
- **Logging**: All auth, Gmail, and AI calls logged to `app.log`
- **Status Feedback**: Real-time status messages ("Contacting Gmail...")
- **Retry Logic**: Exponential backoff (1s → 2s → 4s) for transient errors
- **Error Handling**: Graceful degradation with user-friendly messages

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://constructureai-backend.onrender.com
     ```
4. Deploy

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: (Add all from `.env`)
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback`
     - `FRONTEND_URL=https://your-frontend.vercel.app`
     - `SECRET_KEY`
     - `GEMINI_API_KEY`
     - `ENVIRONMENT=production`
4. Update Google Cloud Console OAuth redirect URIs with production URLs
5. Deploy

## 🔒 Security Considerations

- ✅ Never commit `.env` files to version control
- ✅ Use strong random strings for `SECRET_KEY`
- ✅ HTTPS only in production
- ✅ JWT tokens expire after 24 hours
- ✅ OAuth scopes limited to necessary permissions
- ✅ CORS configured to allow only trusted origins
- ✅ Input validation with Pydantic models
- ⚠️ Current implementation uses JSON file for user storage (consider PostgreSQL/MongoDB for production)

## 📝 Assumptions & Limitations

### Assumptions
- Users have Gmail accounts with IMAP enabled
- Users grant all requested Gmail permissions
- Internet connection is stable for API calls
- Gemini API has sufficient quota for AI operations

### Known Limitations
1. **User Storage**: Uses JSON file instead of database (not suitable for high traffic)
2. **Email Scope**: Processes most recent 20-50 emails (configurable)
3. **AI Model**: Some Gemini models (gemini-1.5-flash) may have API version compatibility issues
4. **Test Users**: Google OAuth requires adding test users during development
5. **Rate Limits**: Subject to Gmail API and Gemini API rate limits
6. **Real-time Updates**: No WebSocket support; manual refresh required
7. **Attachment Support**: Currently doesn't handle email attachments
8. **Multi-language**: English-only interface and AI responses
9. **Session Management**: In-memory session storage (resets on server restart)
10. **Email Deletion**: Permanent delete (no trash/undo functionality)

## 📄 Project Structure

```
ConstructureAI/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ChatbotDashboard.jsx # Main chatbot interface
│   │   ├── Profile.jsx
│   │   └── ...
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── backend/                      # FastAPI backend
│   ├── main.py                   # FastAPI app entry
│   ├── auth_routes.py            # OAuth endpoints
│   ├── email_routes.py           # Email management endpoints
│   ├── gmail_service.py          # Gmail API integration
│   ├── ai_service.py             # Gemini AI integration
│   ├── nlp_service.py            # Natural language parsing
│   ├── logger_service.py         # Logging & observability
│   ├── retry_service.py          # Retry logic
│   ├── database.py               # User data storage
│   ├── tests/                    # Test suite
│   │   └── test_email_system.py
│   └── requirements.txt          # Python dependencies
├── public/                       # Static assets
├── package.json                  # Node dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
└── README.md                     # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/Shivam-Thakur7/ConstructureAI/issues)
- Email: shivamthakurpvt@gmail.com

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gmail API for email access
- Google Gemini AI for natural language processing
- FastAPI community for excellent documentation
- React and Vite teams for modern development tools

---

**Built with ❤️ by Shivam Thakur**

*Last Updated: December 5, 2025*
