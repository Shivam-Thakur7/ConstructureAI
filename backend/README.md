# Constructure AI - Backend API

FastAPI backend with Google OAuth authentication for the Constructure AI platform.

## Features

- ✅ Google OAuth2 authentication
- ✅ Gmail API integration (read, send, delete permissions)
- ✅ JWT-based session management
- ✅ User data persistence
- ✅ CORS configuration for frontend
- ✅ Error handling and validation

## Prerequisites

- Python 3.9+
- Google Cloud Project with OAuth credentials
- Gmail API enabled

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth callback URL (e.g., http://localhost:8000/auth/google/callback)
- `FRONTEND_URL`: Your frontend URL (e.g., http://localhost:5173)
- `SECRET_KEY`: Random secret key for JWT signing

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Gmail API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/auth/google/callback` (development)
     - `https://your-backend-url.com/auth/google/callback` (production)
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://your-frontend-url.vercel.app` (production)

5. Add Test User:
   - Go to "OAuth consent screen"
   - Add `test@gmail.com` to test users

### 4. Run the Server

```bash
# Development
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `GET /auth/google/login` - Get Google OAuth authorization URL
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/me` - Get current user info (requires auth)
- `POST /auth/logout` - Logout current user
- `GET /auth/check-permissions` - Check Gmail permissions

### Health

- `GET /` - API info
- `GET /health` - Health check

## Authentication Flow

1. Frontend calls `/auth/google/login` to get authorization URL
2. User is redirected to Google login page
3. After login, Google redirects to `/auth/google/callback`
4. Backend exchanges code for tokens and creates user session
5. Frontend receives JWT token via redirect
6. Frontend stores token and uses it in Authorization header for subsequent requests

## JWT Token Usage

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API handles various error scenarios:

- **Failed logins**: Returns appropriate error messages
- **Revoked permissions**: Detected via permission check endpoint
- **Expired sessions**: JWT expiration handled automatically
- **Invalid tokens**: Returns 401 Unauthorized

## Deployment

### Backend Deployment (e.g., Railway, Render, or Google Cloud Run)

1. Update `.env` with production values
2. Set `GOOGLE_REDIRECT_URI` to your production callback URL
3. Update Google Cloud Console with production redirect URIs
4. Deploy using your preferred platform

### Environment Variables for Production

```
GOOGLE_CLIENT_ID=<production-client-id>
GOOGLE_CLIENT_SECRET=<production-client-secret>
GOOGLE_REDIRECT_URI=https://your-backend.com/auth/google/callback
FRONTEND_URL=https://your-app.vercel.app
SECRET_KEY=<strong-random-secret>
ENVIRONMENT=production
```

## Security Notes

- Never commit `.env` file to version control
- Use strong random strings for `SECRET_KEY`
- In production, use HTTPS only
- Consider using Redis for session storage instead of JSON files
- Implement rate limiting for authentication endpoints

## License

MIT
