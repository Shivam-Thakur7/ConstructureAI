"""
Logging and Observability Service
Tracks key events, errors, and metrics
"""
import logging
from datetime import datetime
from typing import Dict, Optional
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class EventLogger:
    """Centralized event logging for observability"""
    
    @staticmethod
    def log_auth_attempt(user_email: str, success: bool, error: Optional[str] = None):
        """Log authentication attempts"""
        event = {
            "event": "auth_attempt",
            "user": user_email,
            "success": success,
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        }
        if success:
            logger.info(f"Auth Success: {user_email}")
        else:
            logger.error(f"Auth Failed: {user_email} - {error}")
        return event
    
    @staticmethod
    def log_gmail_call(operation: str, user_email: str, success: bool, 
                      details: Optional[Dict] = None, error: Optional[str] = None):
        """Log Gmail API calls"""
        event = {
            "event": "gmail_api_call",
            "operation": operation,
            "user": user_email,
            "success": success,
            "details": details or {},
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        }
        if success:
            logger.info(f"Gmail API - {operation}: Success for {user_email}")
        else:
            logger.error(f"Gmail API - {operation}: Failed for {user_email} - {error}")
        return event
    
    @staticmethod
    def log_ai_call(operation: str, success: bool, details: Optional[Dict] = None, 
                   error: Optional[str] = None):
        """Log AI service calls"""
        event = {
            "event": "ai_call",
            "operation": operation,
            "success": success,
            "details": details or {},
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        }
        if success:
            logger.info(f"AI Service - {operation}: Success")
        else:
            logger.error(f"AI Service - {operation}: Failed - {error}")
        return event
    
    @staticmethod
    def log_command(command: str, user_email: str, success: bool, 
                   details: Optional[Dict] = None, error: Optional[str] = None):
        """Log user commands"""
        event = {
            "event": "user_command",
            "command": command,
            "user": user_email,
            "success": success,
            "details": details or {},
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        }
        if success:
            logger.info(f"Command - {command}: Success for {user_email}")
        else:
            logger.error(f"Command - {command}: Failed for {user_email} - {error}")
        return event
    
    @staticmethod
    def log_email_action(action: str, user_email: str, email_id: Optional[str] = None,
                        success: bool = True, error: Optional[str] = None):
        """Log email actions (send, delete, etc.)"""
        event = {
            "event": "email_action",
            "action": action,
            "user": user_email,
            "email_id": email_id,
            "success": success,
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        }
        if success:
            logger.info(f"Email Action - {action}: Success for {user_email}")
        else:
            logger.error(f"Email Action - {action}: Failed for {user_email} - {error}")
        return event


class StatusTracker:
    """Track operation status for user feedback"""
    
    @staticmethod
    def status(operation: str) -> Dict:
        """Return status message for operation"""
        statuses = {
            "fetching_emails": "🔍 Contacting Gmail...",
            "generating_summary": "🤖 AI is analyzing your emails...",
            "generating_replies": "✍️ AI is crafting replies...",
            "sending_reply": "📤 Sending your reply...",
            "deleting_email": "🗑️ Deleting email...",
            "categorizing": "📊 Categorizing your inbox...",
            "creating_digest": "📋 Generating your daily digest...",
            "retrying": "🔄 Retrying operation..."
        }
        return {
            "status": operation,
            "message": statuses.get(operation, "Processing...")
        }
