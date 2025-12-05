from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from auth_routes import get_current_user
from gmail_service import GmailService
from ai_service import AIService
from nlp_service import NLPService
from logger_service import EventLogger, StatusTracker
from retry_service import with_retry

router = APIRouter(prefix="/emails", tags=["emails"])

# Request models
class GenerateRepliesRequest(BaseModel):
    emails: List[dict]

class SendReplyRequest(BaseModel):
    email_id: str
    reply_content: str

class DeleteEmailRequest(BaseModel):
    email_id: Optional[str] = None
    sender: Optional[str] = None
    subject_keyword: Optional[str] = None

class NLCommandRequest(BaseModel):
    command: str

class ReadEmailsRequest(BaseModel):
    count: Optional[int] = 5
    subject_filter: Optional[str] = None
    sender_filter: Optional[str] = None


@router.get("/read")
async def read_emails(current_user: dict = Depends(get_current_user)):
    """Fetch the 5 most recent emails with AI-generated summaries"""
    try:
        print(f"DEBUG: Starting read_emails for user: {current_user.get('email')}")
        print(f"DEBUG: Access token present: {bool(current_user.get('access_token'))}")
        
        gmail_service = GmailService(current_user["access_token"])
        print("DEBUG: GmailService initialized")
        
        ai_service = AIService()
        print("DEBUG: AIService initialized")
        
        # Get last 5 emails
        print("DEBUG: Fetching emails...")
        emails = await gmail_service.get_recent_emails(max_results=5)
        print(f"DEBUG: Fetched {len(emails)} emails")
        
        # Generate AI summaries for each email
        for i, email in enumerate(emails):
            print(f"DEBUG: Generating summary for email {i+1}...")
            email["summary"] = await ai_service.generate_summary(email["body"])
        
        print("DEBUG: Successfully completed")
        return {"emails": emails}
    except Exception as e:
        print(f"ERROR in read_emails: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to read emails: {str(e)}")


@router.post("/generate-replies")
async def generate_replies(
    request: GenerateRepliesRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate AI-powered replies for emails"""
    try:
        ai_service = AIService()
        replies = []
        
        for email in request.emails:
            reply = await ai_service.generate_reply(
                sender=email["sender"],
                subject=email["subject"],
                body=email.get("body", ""),
                summary=email.get("summary", "")
            )
            replies.append(reply)
        
        return {"replies": replies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate replies: {str(e)}")


@router.post("/send-reply")
async def send_reply(
    request: SendReplyRequest,
    current_user: dict = Depends(get_current_user)
):
    """Send an email reply"""
    try:
        gmail_service = GmailService(current_user["access_token"])
        
        result = await gmail_service.send_reply(
            email_id=request.email_id,
            reply_content=request.reply_content
        )
        
        return {"success": True, "message": "Reply sent successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send reply: {str(e)}")


@router.delete("/delete")
async def delete_email(
    request: DeleteEmailRequest,
    current_user: dict = Depends(get_current_user)
):
    """Delete an email based on ID, sender, or subject keyword"""
    try:
        EventLogger.log_email_action("delete", current_user["email"])
        gmail_service = GmailService(current_user["access_token"])
        
        if request.email_id:
            # Delete by email ID
            result = await gmail_service.delete_email_by_id(request.email_id)
        elif request.sender:
            # Delete latest email from sender
            result = await gmail_service.delete_email_by_sender(request.sender)
        elif request.subject_keyword:
            # Delete email by subject keyword
            result = await gmail_service.delete_email_by_subject(request.subject_keyword)
        else:
            raise HTTPException(status_code=400, detail="Must provide email_id, sender, or subject_keyword")
        
        EventLogger.log_email_action("delete", current_user["email"], success=True)
        return {"success": True, "message": "Email deleted successfully", "result": result}
    except Exception as e:
        EventLogger.log_email_action("delete", current_user["email"], success=False, error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to delete email: {str(e)}")


@router.post("/parse-command")
async def parse_natural_language_command(
    request: NLCommandRequest,
    current_user: dict = Depends(get_current_user)
):
    """Parse natural language command and return structured action"""
    try:
        EventLogger.log_command(request.command, current_user["email"], success=True)
        nlp_service = NLPService()
        parsed = await nlp_service.parse_command(request.command)
        return {"parsed": parsed, "original": request.command}
    except Exception as e:
        EventLogger.log_command(request.command, current_user["email"], success=False, error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to parse command: {str(e)}")


@router.post("/categorize")
@with_retry(max_retries=2)
async def categorize_inbox(
    request: ReadEmailsRequest,
    current_user: dict = Depends(get_current_user)
):
    """Fetch emails and categorize them into Work, Personal, Promotions, Urgent"""
    try:
        EventLogger.log_gmail_call("categorize", current_user["email"], success=False)
        
        gmail_service = GmailService(current_user["access_token"])
        ai_service = AIService()
        
        # Fetch more emails for categorization
        count = request.count or 20
        emails = await gmail_service.get_recent_emails(max_results=count)
        
        # Generate summaries for each (this works!)
        for email in emails:
            email["summary"] = await ai_service.generate_summary(email["body"])
        
        EventLogger.log_gmail_call("categorize", current_user["email"], success=True, 
                                   details={"count": len(emails)})
        
        # Use keyword-based categorization instead of AI
        EventLogger.log_ai_call("categorize_emails", success=False)
        categorized = _categorize_emails_by_keywords(emails)
        EventLogger.log_ai_call("categorize_emails", success=True)
        
        # Organize results
        result = {
            "total_emails": len(emails),
            "categories": categorized
        }
        
        return result
    except Exception as e:
        EventLogger.log_gmail_call("categorize", current_user["email"], success=False, error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to categorize inbox: {str(e)}")


def _categorize_emails_by_keywords(emails: List[dict]) -> dict:
    """Categorize emails using keyword matching"""
    
    # Define keyword patterns
    work_keywords = ['meeting', 'project', 'deadline', 'team', 'client', 'report', 'proposal', 'contract', 'business']
    promo_keywords = ['sale', 'offer', 'discount', 'deal', 'promo', 'subscribe', 'unsubscribe', 'newsletter', 'marketing']
    urgent_keywords = ['urgent', 'asap', 'important', 'critical', 'deadline', 'immediately', 'action required']
    
    categories = {
        "Work": {"count": 0, "summary": "Professional emails, meetings, and projects", "emails": []},
        "Personal": {"count": 0, "summary": "Personal communications and non-work messages", "emails": []},
        "Promotions": {"count": 0, "summary": "Marketing emails, newsletters, and special offers", "emails": []},
        "Urgent": {"count": 0, "summary": "Time-sensitive emails requiring immediate attention", "emails": []}
    }
    
    for email in emails:
        email_text = f"{email.get('subject', '')} {email.get('sender', '')} {email.get('snippet', '')}".lower()
        categorized = False
        
        # Check urgent first
        if any(keyword in email_text for keyword in urgent_keywords):
            categories["Urgent"]["emails"].append(email)
            categories["Urgent"]["count"] += 1
            categorized = True
        
        # Check promotions
        if not categorized and any(keyword in email_text for keyword in promo_keywords):
            categories["Promotions"]["emails"].append(email)
            categories["Promotions"]["count"] += 1
            categorized = True
        
        # Check work
        if not categorized and any(keyword in email_text for keyword in work_keywords):
            categories["Work"]["emails"].append(email)
            categories["Work"]["count"] += 1
            categorized = True
        
        # Default to personal
        if not categorized:
            categories["Personal"]["emails"].append(email)
            categories["Personal"]["count"] += 1
    
    return categories


@router.get("/daily-digest")
@with_retry(max_retries=2)
async def daily_digest(current_user: dict = Depends(get_current_user)):
    """Generate a comprehensive daily email digest"""
    try:
        EventLogger.log_command("daily_digest", current_user["email"], success=False)
        
        gmail_service = GmailService(current_user["access_token"])
        ai_service = AIService()
        
        # Fetch today's emails
        emails = await gmail_service.get_recent_emails(max_results=20)
        
        # Generate summaries for each (this works!)
        for email in emails:
            email["summary"] = await ai_service.generate_summary(email["body"])
        
        # Create digest manually from summaries instead of using AI
        EventLogger.log_ai_call("daily_digest", success=False)
        
        digest = _create_digest_from_emails(emails)
        
        EventLogger.log_ai_call("daily_digest", success=True)
        EventLogger.log_command("daily_digest", current_user["email"], success=True)
        
        return {
            "digest": digest,
            "email_count": len(emails),
            "generated_at": "today"
        }
    except Exception as e:
        EventLogger.log_command("daily_digest", current_user["email"], success=False, error=str(e))
        raise HTTPException(status_code=500, detail=f"Failed to generate digest: {str(e)}")


def _create_digest_from_emails(emails: List[dict]) -> str:
    """Create a structured digest from emails without using AI generation"""
    
    # Categorize emails by keywords
    urgent_keywords = ['urgent', 'asap', 'important', 'critical', 'deadline', 'immediately']
    action_keywords = ['reply', 'respond', 'approve', 'review', 'action required', 'please', 'need']
    
    urgent_emails = []
    action_required = []
    informational = []
    
    for idx, email in enumerate(emails, 1):
        email_text = f"{email.get('subject', '')} {email.get('summary', '')}".lower()
        
        # Check if urgent
        if any(keyword in email_text for keyword in urgent_keywords):
            urgent_emails.append({
                'num': idx,
                'sender': email.get('sender', 'Unknown'),
                'subject': email.get('subject', 'No Subject'),
                'summary': email.get('summary', 'No summary available')
            })
        # Check if action required
        elif any(keyword in email_text for keyword in action_keywords):
            action_required.append({
                'num': idx,
                'sender': email.get('sender', 'Unknown'),
                'subject': email.get('subject', 'No Subject'),
                'summary': email.get('summary', 'No summary available')
            })
        else:
            informational.append({
                'num': idx,
                'sender': email.get('sender', 'Unknown'),
                'subject': email.get('subject', 'No Subject'),
                'summary': email.get('summary', 'No summary available')
            })
    
    # Build digest text
    digest = "## 📋 Daily Email Digest\n\n"
    
    # Urgent section
    if urgent_emails:
        digest += "### 🚨 URGENT - Immediate Attention Required\n\n"
        for email in urgent_emails[:5]:  # Top 5 urgent
            digest += f"**{email['num']}. {email['subject']}**\n"
            digest += f"   From: {email['sender']}\n"
            digest += f"   Summary: {email['summary']}\n\n"
    
    # Action required section
    if action_required:
        digest += "### ⚡ Action Required\n\n"
        for email in action_required[:5]:  # Top 5 action items
            digest += f"**{email['num']}. {email['subject']}**\n"
            digest += f"   From: {email['sender']}\n"
            digest += f"   Summary: {email['summary']}\n\n"
    
    # Informational section
    if informational:
        digest += "### 📖 For Your Information\n\n"
        for email in informational[:5]:  # Top 5 FYI
            digest += f"**{email['num']}. {email['subject']}**\n"
            digest += f"   From: {email['sender']}\n"
            digest += f"   Summary: {email['summary']}\n\n"
    
    # Recommended actions
    digest += "### 💡 Recommended Actions\n\n"
    
    if urgent_emails:
        digest += f"1. **Priority 1**: Handle {len(urgent_emails)} urgent email(s) immediately\n"
    if action_required:
        digest += f"2. **Priority 2**: Respond to {len(action_required)} email(s) requiring action\n"
    if informational:
        digest += f"3. **Priority 3**: Review {len(informational)} informational email(s) when time permits\n"
    
    if not urgent_emails and not action_required:
        digest += "✅ Great news! No urgent items. All emails are informational.\n"
    
    digest += f"\n📊 **Total Emails Analyzed**: {len(emails)}\n"
    
    return digest


@router.get("/status/{operation}")
async def get_operation_status(operation: str):
    """Get status message for an operation"""
    return StatusTracker.status(operation)
