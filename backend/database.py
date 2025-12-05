import json
import os
from typing import Optional, Dict
from datetime import datetime
from models import User

class Database:
    def __init__(self, db_file: str = "users.json"):
        self.db_file = db_file
        self._ensure_db_exists()
    
    def _ensure_db_exists(self):
        """Ensure database file exists"""
        if not os.path.exists(self.db_file):
            with open(self.db_file, 'w') as f:
                json.dump({"users": {}, "sessions": {}}, f)
    
    def _read_db(self) -> dict:
        """Read database"""
        with open(self.db_file, 'r') as f:
            return json.load(f)
    
    def _write_db(self, data: dict):
        """Write to database"""
        with open(self.db_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        db = self._read_db()
        return db["users"].get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email"""
        db = self._read_db()
        for user_id, user_data in db["users"].items():
            if user_data.get("email") == email:
                return user_data
        return None
    
    def create_or_update_user(self, user_id: str, email: str, name: str, picture: str = None, google_credentials: str = None) -> Dict:
        """Create or update user"""
        db = self._read_db()
        
        now = datetime.utcnow().isoformat()
        
        if user_id in db["users"]:
            # Update existing user
            db["users"][user_id]["name"] = name
            db["users"][user_id]["picture"] = picture
            db["users"][user_id]["last_login"] = now
            if google_credentials:
                db["users"][user_id]["google_credentials"] = google_credentials
        else:
            # Create new user
            db["users"][user_id] = {
                "id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "google_credentials": google_credentials,
                "created_at": now,
                "last_login": now
            }
        
        self._write_db(db)
        return db["users"][user_id]
    
    def save_session(self, user_id: str, session_data: dict):
        """Save user session"""
        db = self._read_db()
        db["sessions"][user_id] = session_data
        self._write_db(db)
    
    def get_session(self, user_id: str) -> Optional[Dict]:
        """Get user session"""
        db = self._read_db()
        return db["sessions"].get(user_id)
    
    def delete_session(self, user_id: str):
        """Delete user session"""
        db = self._read_db()
        if user_id in db["sessions"]:
            del db["sessions"][user_id]
            self._write_db(db)
    
    def get_google_credentials(self, user_id: str) -> Optional[str]:
        """Get user's Google credentials"""
        user = self.get_user(user_id)
        if user:
            return user.get("google_credentials")
        return None

# Singleton instance
db = Database()
