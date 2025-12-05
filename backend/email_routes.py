from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from auth_routes import get_current_user
from gmail_service import GmailService
from ai_service import AIService

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
        
        return {"success": True, "message": "Email deleted successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete email: {str(e)}")
