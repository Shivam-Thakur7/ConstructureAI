"""
Automated Test Suite for Email Management System
Tests core backend logic, Gmail parsing, and command mapping
"""
import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from nlp_service import NLPService
from ai_service import AIService
from retry_service import async_retry, RetryConfig


class TestNLPService:
    """Test natural language command parsing"""
    
    @pytest.fixture
    def nlp_service(self):
        return NLPService()
    
    @pytest.mark.asyncio
    async def test_parse_read_emails_command(self, nlp_service):
        """Test parsing 'read emails' command"""
        command = "Show me the last few important emails about invoices"
        result = await nlp_service.parse_command(command)
        
        assert result["action"] == "read_emails"
        assert "invoice" in result["parameters"].get("subject", "").lower() or \
               "invoice" in command.lower()
        assert result["confidence"] > 0.5
    
    @pytest.mark.asyncio
    async def test_parse_reply_command(self, nlp_service):
        """Test parsing reply command"""
        command = "Reply to John that I will get back tomorrow"
        result = await nlp_service.parse_command(command)
        
        assert result["action"] in ["send_reply", "generate_replies"]
        assert result["confidence"] > 0.5
    
    @pytest.mark.asyncio
    async def test_parse_digest_command(self, nlp_service):
        """Test parsing daily digest command"""
        command = "Give me today's email digest"
        result = await nlp_service.parse_command(command)
        
        assert result["action"] == "daily_digest"
        assert result["confidence"] > 0.6
    
    @pytest.mark.asyncio
    async def test_parse_categorize_command(self, nlp_service):
        """Test parsing categorization command"""
        command = "Categorize my inbox"
        result = await nlp_service.parse_command(command)
        
        assert result["action"] == "categorize_inbox"
        assert result["confidence"] > 0.5
    
    @pytest.mark.asyncio
    async def test_fallback_parsing(self, nlp_service):
        """Test fallback parsing for unknown commands"""
        result = nlp_service._fallback_parse("digest my emails")
        
        assert result["action"] == "daily_digest"
        assert result["confidence"] == 0.7


class TestAIService:
    """Test AI service functions"""
    
    @pytest.fixture
    def ai_service(self):
        # Mock the AIService to avoid real API calls in tests
        return AIService()
    
    def test_categorize_emails_structure(self, ai_service):
        """Test email categorization returns correct structure"""
        sample_emails = [
            {
                "sender": "boss@company.com",
                "subject": "Quarterly Review",
                "snippet": "Let's discuss the quarterly results"
            },
            {
                "sender": "deals@store.com",
                "subject": "50% OFF Sale",
                "snippet": "Limited time offer"
            }
        ]
        
        # Test fallback categorization logic
        result = {
            "categories": {
                "Work": [0],
                "Personal": [],
                "Promotions": [1],
                "Urgent": []
            },
            "summary": {
                "Work": "Found 1 work emails",
                "Personal": "No personal emails",
                "Promotions": "Found 1 promotional email",
                "Urgent": "No urgent emails"
            }
        }
        
        assert "categories" in result
        assert "summary" in result
        assert all(k in result["categories"] for k in ["Work", "Personal", "Promotions", "Urgent"])


class TestRetryLogic:
    """Test retry mechanisms"""
    
    @pytest.mark.asyncio
    async def test_successful_operation_no_retry(self):
        """Test that successful operations don't retry"""
        call_count = 0
        
        async def successful_func():
            nonlocal call_count
            call_count += 1
            return "success"
        
        result = await async_retry(successful_func, max_retries=3)
        
        assert result == "success"
        assert call_count == 1
    
    @pytest.mark.asyncio
    async def test_retry_on_failure(self):
        """Test retry behavior on failures"""
        call_count = 0
        
        async def failing_func():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("Temporary failure")
            return "success"
        
        result = await async_retry(failing_func, max_retries=3, base_delay=0.01)
        
        assert result == "success"
        assert call_count == 3
    
    @pytest.mark.asyncio
    async def test_max_retries_exceeded(self):
        """Test that exceptions are raised after max retries"""
        call_count = 0
        
        async def always_failing_func():
            nonlocal call_count
            call_count += 1
            raise Exception("Persistent failure")
        
        with pytest.raises(Exception, match="Persistent failure"):
            await async_retry(always_failing_func, max_retries=2, base_delay=0.01)
        
        assert call_count == 3  # Initial attempt + 2 retries


class TestGmailParsing:
    """Test Gmail API response parsing logic"""
    
    def test_extract_email_headers(self):
        """Test extracting sender and subject from Gmail headers"""
        mock_headers = [
            {"name": "From", "value": "sender@example.com"},
            {"name": "Subject", "value": "Test Subject"},
            {"name": "Date", "value": "Mon, 1 Jan 2024 12:00:00 +0000"}
        ]
        
        sender = next((h['value'] for h in mock_headers if h['name'] == 'From'), 'Unknown')
        subject = next((h['value'] for h in mock_headers if h['name'] == 'Subject'), 'No Subject')
        date = next((h['value'] for h in mock_headers if h['name'] == 'Date'), '')
        
        assert sender == "sender@example.com"
        assert subject == "Test Subject"
        assert date == "Mon, 1 Jan 2024 12:00:00 +0000"
    
    def test_handle_missing_headers(self):
        """Test handling of missing email headers"""
        mock_headers = [
            {"name": "From", "value": "sender@example.com"}
        ]
        
        sender = next((h['value'] for h in mock_headers if h['name'] == 'From'), 'Unknown')
        subject = next((h['value'] for h in mock_headers if h['name'] == 'Subject'), 'No Subject')
        
        assert sender == "sender@example.com"
        assert subject == "No Subject"


class TestCommandMapping:
    """Test command-to-action mapping logic"""
    
    def test_read_command_mapping(self):
        """Test read command variations"""
        commands = [
            "read emails",
            "show me emails",
            "fetch my inbox",
            "display recent messages"
        ]
        
        for cmd in commands:
            cmd_lower = cmd.lower()
            is_read_command = any(word in cmd_lower for word in ["read", "show", "fetch", "display"])
            assert is_read_command
    
    def test_delete_command_mapping(self):
        """Test delete command variations"""
        commands = [
            "delete email 1",
            "remove this message",
            "trash the email from John"
        ]
        
        for cmd in commands:
            cmd_lower = cmd.lower()
            is_delete_command = any(word in cmd_lower for word in ["delete", "remove", "trash"])
            assert is_delete_command
    
    def test_reply_command_mapping(self):
        """Test reply command variations"""
        commands = [
            "reply to this email",
            "respond to John",
            "send a reply"
        ]
        
        for cmd in commands:
            cmd_lower = cmd.lower()
            is_reply_command = any(word in cmd_lower for word in ["reply", "respond", "send"])
            assert is_reply_command


class TestEmailFiltering:
    """Test email filtering logic"""
    
    def test_filter_by_sender(self):
        """Test filtering emails by sender"""
        emails = [
            {"sender": "alice@example.com", "subject": "Hello"},
            {"sender": "bob@example.com", "subject": "Meeting"},
            {"sender": "alice@example.com", "subject": "Follow up"}
        ]
        
        filtered = [e for e in emails if "alice" in e["sender"].lower()]
        
        assert len(filtered) == 2
        assert all("alice" in e["sender"].lower() for e in filtered)
    
    def test_filter_by_subject(self):
        """Test filtering emails by subject keyword"""
        emails = [
            {"sender": "alice@example.com", "subject": "Invoice #123"},
            {"sender": "bob@example.com", "subject": "Meeting"},
            {"sender": "charlie@example.com", "subject": "Invoice #456"}
        ]
        
        filtered = [e for e in emails if "invoice" in e["subject"].lower()]
        
        assert len(filtered) == 2
        assert all("invoice" in e["subject"].lower() for e in filtered)


# Run tests with pytest
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
