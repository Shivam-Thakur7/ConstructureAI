import google.generativeai as genai
from config import settings
import asyncio
from functools import wraps
from typing import List, Dict
import json


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
        # Use gemini-pro which is stable and widely available
        self.model = genai.GenerativeModel('gemini-pro')
    
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
            # Return a clean fallback instead of showing the error
            return email_body[:200] + "..." if len(email_body) > 200 else email_body
    
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
    
    @async_wrap
    def categorize_emails(self, emails: List[Dict]) -> Dict:
        """Categorize emails into Work, Personal, Promotions, Urgent"""
        try:
            # Prepare email summaries for categorization
            email_summaries = []
            for i, email in enumerate(emails):
                email_summaries.append({
                    "id": i,
                    "sender": email.get("sender", "Unknown"),
                    "subject": email.get("subject", "No Subject"),
                    "snippet": email.get("snippet", "")[:200]
                })
            
            prompt = f"""
Categorize the following emails into these categories: Work, Personal, Promotions, Urgent.
Each email should be assigned to exactly one category.

Categories:
- Work: Professional emails, meetings, projects, work-related communications
- Personal: Personal messages, family, friends, non-work related
- Promotions: Marketing emails, newsletters, advertisements, sales
- Urgent: Time-sensitive emails requiring immediate attention (any category)

Emails:
{json.dumps(email_summaries, indent=2)}

Return ONLY a valid JSON object with this structure:
{{
  "categories": {{
    "Work": [list of email IDs],
    "Personal": [list of email IDs],
    "Promotions": [list of email IDs],
    "Urgent": [list of email IDs]
  }},
  "summary": {{
    "Work": "brief summary of work emails",
    "Personal": "brief summary of personal emails",
    "Promotions": "brief summary of promotions",
    "Urgent": "brief summary of urgent items"
  }}
}}
"""
            
            response = self.model.generate_content(prompt)
            result = response.text.strip()
            
            # Remove markdown code blocks
            if result.startswith("```json"):
                result = result[7:]
            if result.startswith("```"):
                result = result[3:]
            if result.endswith("```"):
                result = result[:-3]
            
            categorized = json.loads(result.strip())
            return categorized
        except Exception as e:
            print(f"Categorization error: {str(e)}")
            # Fallback categorization
            return {
                "categories": {
                    "Work": list(range(len(emails))),
                    "Personal": [],
                    "Promotions": [],
                    "Urgent": []
                },
                "summary": {
                    "Work": f"Found {len(emails)} emails",
                    "Personal": "No personal emails",
                    "Promotions": "No promotional emails",
                    "Urgent": "No urgent emails"
                }
            }
    
    @async_wrap
    def generate_daily_digest(self, emails: List[Dict]) -> str:
        """Generate a comprehensive daily digest"""
        try:
            email_summaries = []
            for email in emails:
                email_summaries.append({
                    "sender": email.get("sender", "Unknown"),
                    "subject": email.get("subject", "No Subject"),
                    "date": email.get("date", ""),
                    "summary": email.get("summary", email.get("snippet", ""))[:200]
                })
            
            prompt = f"""
Create a comprehensive daily email digest. Analyze the emails and provide:

1. **Key Highlights**: Most important emails (top 3-5)
2. **Action Required**: Emails that need responses or action
3. **FYI**: Informational emails for awareness
4. **Suggested Priorities**: Recommended order to tackle emails

Emails for today:
{json.dumps(email_summaries, indent=2)}

Create a well-structured, actionable digest. Use bullet points and clear sections.
Keep it concise but informative.

Daily Digest:"""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Unable to generate digest: {str(e)}"
