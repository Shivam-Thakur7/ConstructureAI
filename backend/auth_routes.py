from fastapi import APIRouter, HTTPException, Request, Depends, Header
from fastapi.responses import RedirectResponse, JSONResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from config import settings
from models import Token, User, AuthResponse
from auth_utils import create_access_token, verify_token, serialize_credentials
from database import db
from datetime import datetime
import secrets
from typing import Optional

router = APIRouter(prefix="/auth", tags=["authentication"])

# Store CSRF tokens temporarily (in production, use Redis or similar)
csrf_tokens = {}

# Dependency to get current user from JWT token
async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Extract user data from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    token_data = verify_token(token)
    
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {
        "user_id": token_data.sub,
        "email": token_data.email,
        "access_token": getattr(token_data, 'access_token', None)
    }

def create_oauth_flow():
    """Create Google OAuth flow"""
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
            }
        },
        scopes=settings.GOOGLE_SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    return flow

@router.get("/google/login")
async def google_login():
    """
    Initiate Google OAuth login
    Returns authorization URL for frontend to redirect to
    """
    try:
        print(f"DEBUG: GOOGLE_REDIRECT_URI = {settings.GOOGLE_REDIRECT_URI}")
        flow = create_oauth_flow()
        
        # Generate CSRF token
        state = secrets.token_urlsafe(32)
        csrf_tokens[state] = datetime.utcnow()
        
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            state=state,
            prompt='consent'  # Force consent screen to get refresh token
        )
        
        print(f"DEBUG: Generated auth URL: {authorization_url}")
        
        return {
            "authorization_url": authorization_url,
            "state": state
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate login: {str(e)}")

@router.get("/google/callback")
async def google_callback(code: str = None, state: str = None, error: str = None):
    """
    Handle Google OAuth callback
    Exchange authorization code for tokens and create user session
    """
    try:
        # Handle OAuth errors
        if error:
            error_messages = {
                "access_denied": "You denied access to your Google account. Please try again and grant the necessary permissions.",
                "invalid_request": "Invalid authentication request. Please try again.",
                "unauthorized_client": "The application is not authorized. Please contact support."
            }
            message = error_messages.get(error, f"Authentication failed: {error}")
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/?error={error}&message={message}"
            )
        
        if not code:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/?error=missing_code&message=No authorization code received"
            )
        
        # Verify CSRF token
        if state not in csrf_tokens:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/?error=invalid_state&message=Invalid or expired session"
            )
        
        # Remove used CSRF token
        del csrf_tokens[state]
        
        # Exchange code for tokens
        flow = create_oauth_flow()
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user info from Google
        service = build('oauth2', 'v2', credentials=credentials)
        user_info = service.userinfo().get().execute()
        
        user_id = user_info['id']
        email = user_info['email']
        name = user_info.get('name', email.split('@')[0])
        picture = user_info.get('picture')
        
        # Serialize Google credentials
        google_creds = serialize_credentials(credentials)
        
        # Create or update user in database
        user_data = db.create_or_update_user(
            user_id=user_id,
            email=email,
            name=name,
            picture=picture,
            google_credentials=google_creds
        )
        
        # Create JWT token with Google access token for Gmail API
        access_token = create_access_token(
            data={
                "sub": user_id,
                "email": email,
                "access_token": credentials.token  # Store Google access token
            }
        )
        
        # Save session
        db.save_session(user_id, {
            "access_token": access_token,
            "created_at": datetime.utcnow().isoformat()
        })
        
        # Redirect to frontend with token
        redirect_url = f"{settings.FRONTEND_URL}/auth/success?token={access_token}"
        print(f"Redirecting to: {redirect_url}")
        return RedirectResponse(
            url=redirect_url,
            status_code=302
        )
    
    except Exception as e:
        print(f"Callback error: {str(e)}")
        error_url = f"{settings.FRONTEND_URL}/?error=auth_failed&message=Authentication failed. Please try again."
        print(f"Redirecting to error: {error_url}")
        return RedirectResponse(
            url=error_url,
            status_code=302
        )

@router.get("/me")
async def get_user_profile(request: Request):
    """
    Get currently authenticated user
    Requires valid JWT token in Authorization header
    """
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        token = auth_header.split(" ")[1]
        
        # Verify token
        token_data = verify_token(token)
        if not token_data:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        # Get user from database
        user_data = db.get_user(token_data.sub)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return User(
            id=user_data["id"],
            email=user_data["email"],
            name=user_data["name"],
            picture=user_data.get("picture"),
            created_at=datetime.fromisoformat(user_data["created_at"]),
            last_login=datetime.fromisoformat(user_data["last_login"])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user: {str(e)}")

@router.post("/logout")
async def logout(request: Request):
    """
    Logout current user
    Invalidates the session
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return AuthResponse(success=True, message="Already logged out")
        
        token = auth_header.split(" ")[1]
        token_data = verify_token(token)
        
        if token_data and token_data.sub:
            db.delete_session(token_data.sub)
        
        return AuthResponse(success=True, message="Logged out successfully")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")

@router.get("/check-permissions")
async def check_permissions(request: Request):
    """
    Check if user has granted all required Gmail permissions
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        token = auth_header.split(" ")[1]
        token_data = verify_token(token)
        
        if not token_data:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user's Google credentials
        google_creds_json = db.get_google_credentials(token_data.sub)
        if not google_creds_json:
            return {"has_permissions": False, "missing_scopes": settings.GOOGLE_SCOPES}
        
        from auth_utils import deserialize_credentials
        credentials = deserialize_credentials(google_creds_json)
        
        # Check if all required scopes are granted
        granted_scopes = set(credentials.scopes)
        required_scopes = set(settings.GOOGLE_SCOPES)
        missing_scopes = required_scopes - granted_scopes
        
        return {
            "has_permissions": len(missing_scopes) == 0,
            "granted_scopes": list(granted_scopes),
            "missing_scopes": list(missing_scopes)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check permissions: {str(e)}")
