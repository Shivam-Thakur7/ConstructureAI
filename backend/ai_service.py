import google.generativeai as genai
from config import settings
import asyncio
from functools import wraps


def async_wrap(func):
    """Wrapper to run synchronous Gemini API calls in async context"""
    @wraps(func)
    async def run(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: func(*args, **kwargs))
    return run


class AIService:
    def __init__(self):
        # Configure Gemini AI
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    @async_wrap
    def generate_summary(self, email_body: str) -> str:
        """Generate AI summary of email content"""
        try:
            prompt = f"""
Summarize the following email in 2-3 concise sentences. Focus on the main point and any action items.

Email content:
{email_body[:1000]}  

Summary:"""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Unable to generate summary: {str(e)}"
    
    @async_wrap
    def generate_reply(self, sender: str, subject: str, body: str, summary: str) -> str:
        """Generate AI-powered email reply"""
        try:
            prompt = f"""
Generate a professional and context-aware email reply based on the following email.

From: {sender}
Subject: {subject}
Summary: {summary}

Original email:
{body[:800]}

Write a clear, professional, and helpful reply. Keep it concise (2-4 short paragraphs).
Do not include greetings like "Dear" or sign-offs - just the body of the reply.

Reply:"""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Unable to generate reply: {str(e)}"
