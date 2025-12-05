import base64
import email
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict, Optional
import asyncio
from functools import wraps


def async_wrap(func):
    """Wrapper to run synchronous Google API calls in async context"""
    @wraps(func)
    async def run(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: func(*args, **kwargs))
    return run


class GmailService:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.service = None
    
    def _get_service(self):
        """Initialize Gmail API service"""
        if not self.service:
            from google.oauth2.credentials import Credentials
            from config import settings
            
            # Create credentials with proper configuration
            creds = Credentials(
                token=self.access_token,
                refresh_token=None,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=settings.GOOGLE_CLIENT_ID,
                client_secret=settings.GOOGLE_CLIENT_SECRET,
                scopes=settings.GOOGLE_SCOPES
            )
            self.service = build('gmail', 'v1', credentials=creds)
        return self.service
    
    @async_wrap
    def get_recent_emails(self, max_results: int = 5) -> List[Dict]:
        """Fetch recent emails from inbox"""
        try:
            service = self._get_service()
            
            # Get list of messages
            results = service.users().messages().list(
                userId='me',
                labelIds=['INBOX'],
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            emails = []
            
            for msg in messages:
                # Get full message details
                message = service.users().messages().get(
                    userId='me',
                    id=msg['id'],
                    format='full'
                ).execute()
                
                # Extract headers
                headers = message['payload']['headers']
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                date = next((h['value'] for h in headers if h['name'] == 'Date'), '')
                
                # Extract body
                body = self._get_email_body(message['payload'])
                
                emails.append({
                    'id': message['id'],
                    'thread_id': message['threadId'],
                    'sender': sender,
                    'subject': subject,
                    'date': date,
                    'body': body,
                    'snippet': message.get('snippet', '')
                })
            
            return emails
        except HttpError as error:
            raise Exception(f"Gmail API error: {error}")
    
    def _get_email_body(self, payload) -> str:
        """Extract email body from message payload"""
        body = ""
        
        if 'body' in payload and 'data' in payload['body']:
            body = base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8')
        elif 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    if 'data' in part['body']:
                        body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                        break
                elif part['mimeType'] == 'text/html' and not body:
                    if 'data' in part['body']:
                        body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
        
        return body or "No content available"
    
    @async_wrap
    def send_reply(self, email_id: str, reply_content: str) -> Dict:
        """Send a reply to an email"""
        try:
            service = self._get_service()
            
            # Get original message
            original_message = service.users().messages().get(
                userId='me',
                id=email_id,
                format='full'
            ).execute()
            
            # Extract headers from original
            headers = original_message['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            to = next((h['value'] for h in headers if h['name'] == 'From'), '')
            message_id = next((h['value'] for h in headers if h['name'] == 'Message-ID'), '')
            
            # Add "Re:" if not already present
            if not subject.startswith('Re:'):
                subject = f"Re: {subject}"
            
            # Create reply message
            message = MIMEText(reply_content)
            message['to'] = to
            message['subject'] = subject
            message['In-Reply-To'] = message_id
            message['References'] = message_id
            
            # Encode message
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            # Send message
            sent_message = service.users().messages().send(
                userId='me',
                body={
                    'raw': raw_message,
                    'threadId': original_message['threadId']
                }
            ).execute()
            
            return {'message_id': sent_message['id']}
        except HttpError as error:
            raise Exception(f"Failed to send reply: {error}")
    
    @async_wrap
    def delete_email_by_id(self, email_id: str) -> Dict:
        """Delete email by ID"""
        try:
            service = self._get_service()
            
            service.users().messages().trash(
                userId='me',
                id=email_id
            ).execute()
            
            return {'deleted_id': email_id}
        except HttpError as error:
            raise Exception(f"Failed to delete email: {error}")
    
    @async_wrap
    def delete_email_by_sender(self, sender: str) -> Dict:
        """Delete latest email from specific sender"""
        try:
            service = self._get_service()
            
            # Search for emails from sender
            query = f"from:{sender}"
            results = service.users().messages().list(
                userId='me',
                q=query,
                maxResults=1
            ).execute()
            
            messages = results.get('messages', [])
            if not messages:
                raise Exception(f"No emails found from {sender}")
            
            # Delete the first (most recent) email
            email_id = messages[0]['id']
            service.users().messages().trash(
                userId='me',
                id=email_id
            ).execute()
            
            return {'deleted_id': email_id, 'sender': sender}
        except HttpError as error:
            raise Exception(f"Failed to delete email by sender: {error}")
    
    @async_wrap
    def delete_email_by_subject(self, subject_keyword: str) -> Dict:
        """Delete email by subject keyword"""
        try:
            service = self._get_service()
            
            # Search for emails with subject keyword
            query = f"subject:{subject_keyword}"
            results = service.users().messages().list(
                userId='me',
                q=query,
                maxResults=1
            ).execute()
            
            messages = results.get('messages', [])
            if not messages:
                raise Exception(f"No emails found with subject containing '{subject_keyword}'")
            
            # Delete the first email found
            email_id = messages[0]['id']
            service.users().messages().trash(
                userId='me',
                id=email_id
            ).execute()
            
            return {'deleted_id': email_id, 'subject_keyword': subject_keyword}
        except HttpError as error:
            raise Exception(f"Failed to delete email by subject: {error}")
