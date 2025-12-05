"""
Natural Language Processing Service
Parses user commands and maps them to actions
"""
import google.generativeai as genai
from config import settings
import json
from typing import Dict, Optional
import asyncio
from functools import wraps

def async_wrap(func):
    """Wrapper to run synchronous calls in async context"""
    @wraps(func)
    async def run(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: func(*args, **kwargs))
    return run


class NLPService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    @async_wrap
    def parse_command(self, user_input: str) -> Dict:
        """
        Parse natural language command and extract intent and parameters
        """
        prompt = f"""
You are a command parser for an email management chatbot. Parse the user's natural language input and return a JSON object.

Available actions:
- read_emails: Fetch emails (can filter by sender, subject, importance)
- generate_replies: Generate AI replies for emails
- send_reply: Send a reply to a specific email
- delete_email: Delete an email by ID, sender, or subject
- categorize_inbox: Group emails into categories
- daily_digest: Generate a daily summary

User input: "{user_input}"

Return ONLY a valid JSON object with this structure:
{{
  "action": "action_name",
  "parameters": {{
    "filter": "optional filter text",
    "sender": "optional sender",
    "subject": "optional subject keyword",
    "email_id": "optional email ID or number",
    "reply_content": "optional reply content",
    "count": optional number (default 5)
  }},
  "confidence": 0.0-1.0
}}

Examples:
Input: "Show me the last few important emails about invoices"
Output: {{"action": "read_emails", "parameters": {{"subject": "invoices", "count": 5}}, "confidence": 0.9}}

Input: "Reply to John that I will get back tomorrow"
Output: {{"action": "send_reply", "parameters": {{"sender": "John", "reply_content": "I will get back tomorrow"}}, "confidence": 0.85}}

Input: "Delete all promotional emails"
Output: {{"action": "delete_email", "parameters": {{"subject": "promotional"}}, "confidence": 0.8}}

Input: "Give me today's email digest"
Output: {{"action": "daily_digest", "parameters": {{}}, "confidence": 0.95}}

Input: "Categorize my inbox"
Output: {{"action": "categorize_inbox", "parameters": {{"count": 20}}, "confidence": 0.9}}

Now parse: "{user_input}"
"""
        
        try:
            response = self.model.generate_content(prompt)
            result = response.text.strip()
            
            # Remove markdown code blocks if present
            if result.startswith("```json"):
                result = result[7:]
            if result.startswith("```"):
                result = result[3:]
            if result.endswith("```"):
                result = result[:-3]
            
            parsed = json.loads(result.strip())
            return parsed
        except Exception as e:
            print(f"Error parsing command: {str(e)}")
            # Fallback to basic keyword matching
            return self._fallback_parse(user_input)
    
    def _fallback_parse(self, user_input: str) -> Dict:
        """Fallback parser using simple keyword matching"""
        input_lower = user_input.lower()
        
        if "digest" in input_lower:
            return {"action": "daily_digest", "parameters": {}, "confidence": 0.7}
        elif "categorize" in input_lower or "group" in input_lower:
            return {"action": "categorize_inbox", "parameters": {"count": 20}, "confidence": 0.7}
        elif "read" in input_lower or "show" in input_lower or "fetch" in input_lower:
            params = {"count": 5}
            if "invoice" in input_lower:
                params["subject"] = "invoice"
            return {"action": "read_emails", "parameters": params, "confidence": 0.6}
        elif "reply" in input_lower or "respond" in input_lower:
            return {"action": "generate_replies", "parameters": {}, "confidence": 0.6}
        elif "delete" in input_lower:
            return {"action": "delete_email", "parameters": {}, "confidence": 0.6}
        else:
            return {"action": "unknown", "parameters": {}, "confidence": 0.0}
