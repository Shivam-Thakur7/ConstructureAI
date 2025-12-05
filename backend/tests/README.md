# Email Management System - Test Suite

## Overview
Automated test suite for the email management chatbot system, covering core backend logic, Gmail API response parsing, command mapping, and critical flows.

## Running Tests

### Install Test Dependencies
```bash
pip install pytest pytest-asyncio
```

### Run All Tests
```bash
cd backend
python -m pytest tests/test_email_system.py -v
```

### Run Specific Test Classes
```bash
# Test NLP service
python -m pytest tests/test_email_system.py::TestNLPService -v

# Test retry logic
python -m pytest tests/test_email_system.py::TestRetryLogic -v

# Test command mapping
python -m pytest tests/test_email_system.py::TestCommandMapping -v
```

### Run with Coverage (Optional)
```bash
pip install pytest-cov
python -m pytest tests/ --cov=. --cov-report=html
```

## Test Coverage

### 1. Natural Language Processing (TestNLPService)
- ✅ Parsing "read emails" variations with filters
- ✅ Parsing "reply to sender" commands
- ✅ Parsing "daily digest" requests
- ✅ Parsing "categorize inbox" commands
- ✅ Fallback parsing for edge cases

### 2. AI Service (TestAIService)
- ✅ Email categorization structure validation
- ✅ Category assignment (Work, Personal, Promotions, Urgent)
- ✅ Summary generation logic

### 3. Retry & Resilience (TestRetryLogic)
- ✅ Successful operations don't retry
- ✅ Retry on transient failures with exponential backoff
- ✅ Max retries enforcement
- ✅ Exception propagation after exhaustion

### 4. Gmail Parsing (TestGmailParsing)
- ✅ Extract sender, subject, date from headers
- ✅ Handle missing email headers gracefully
- ✅ Default values for incomplete data

### 5. Command Mapping (TestCommandMapping)
- ✅ Read command variations (read, show, fetch, display)
- ✅ Delete command variations (delete, remove, trash)
- ✅ Reply command variations (reply, respond, send)

### 6. Email Filtering (TestEmailFiltering)
- ✅ Filter emails by sender
- ✅ Filter emails by subject keyword
- ✅ Case-insensitive filtering

## Test Philosophy
- **Intentional Coverage**: Focus on critical flows rather than 100% coverage
- **Real-World Scenarios**: Tests reflect actual user interactions
- **Fast Feedback**: Unit tests run quickly without external dependencies
- **Mocking**: External API calls (Gmail, Gemini) are mocked for reliability

## Adding New Tests
When adding features, consider:
1. Test the happy path
2. Test edge cases (missing data, errors)
3. Test retry behavior for external APIs
4. Test command parsing variations

## CI/CD Integration
Tests can be integrated into CI/CD pipelines:
```yaml
# GitHub Actions example
- name: Run Tests
  run: |
    cd backend
    pip install -r requirements.txt
    python -m pytest tests/ -v --tb=short
```

## Logs and Observability
Test runs generate logs in `backend/app.log` for debugging failures.
