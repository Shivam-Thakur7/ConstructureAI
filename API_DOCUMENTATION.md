# 📡 API Documentation - ConstructureAI

Complete REST API documentation for the ConstructureAI backend.

**Base URL (Development):** `http://localhost:8000`  
**Base URL (Production):** `https://constructureai-backend.onrender.com`

**Interactive Docs:** Visit `/docs` for Swagger UI or `/redoc` for ReDoc

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

JWT tokens are obtained through the Google OAuth flow and expire after 24 hours (configurable).

---

## 📋 Endpoints Overview

### Health & Info
- `GET /` - API information
- `GET /health` - Health check

### Authentication
- `GET /auth/google/login` - Get OAuth URL
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout
- `GET /auth/check-permissions` - Check Gmail permissions

### Email Operations
- `GET /emails` - Fetch emails
- `POST /emails/generate-replies` - Generate AI replies
- `POST /emails/send-reply` - Send reply
- `DELETE /emails/{email_id}` - Delete email
- `POST /emails/parse-command` - Parse natural language
- `POST /emails/categorize` - Categorize inbox
- `GET /emails/daily-digest` - Daily digest
- `GET /emails/status/{operation}` - Operation status

---

## 🏥 Health & Information

### Get API Information

```http
GET /
```

**Response:** `200 OK`
```json
{
  "name": "Constructure AI API",
  "version": "1.0.0",
  "status": "running"
}
```

### Health Check

```http
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

---

## 🔑 Authentication Endpoints

### 1. Get Google OAuth Login URL

```http
GET /auth/google/login
```

**Description:** Returns the Google OAuth authorization URL for user authentication.

**Response:** `200 OK`
```json
{
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Usage:**
```javascript
// Frontend redirect
const response = await fetch('http://localhost:8000/auth/google/login');
const { auth_url } = await response.json();
window.location.href = auth_url;
```

---

### 2. OAuth Callback

```http
GET /auth/google/callback?code={auth_code}&state={state}
```

**Description:** Handles the OAuth callback from Google, exchanges code for tokens, creates user session.

**Query Parameters:**
- `code` (string, required) - Authorization code from Google
- `state` (string, required) - CSRF protection state token

**Response:** Redirects to frontend with JWT token
```
302 Redirect → {FRONTEND_URL}/?token={jwt_token}
```

**Error Response:** `400 Bad Request`
```json
{
  "detail": "Invalid authorization code"
}
```

---

### 3. Get Current User

```http
GET /auth/me
Authorization: Bearer {token}
```

**Description:** Returns the currently authenticated user's information.

**Response:** `200 OK`
```json
{
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "permissions": {
    "gmail_read": true,
    "gmail_send": true,
    "gmail_modify": true
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "detail": "Not authenticated"
}
```

---

### 4. Logout

```http
POST /auth/logout
Authorization: Bearer {token}
```

**Description:** Invalidates the current user's session.

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Check Gmail Permissions

```http
GET /auth/check-permissions
Authorization: Bearer {token}
```

**Description:** Verifies if the user still has required Gmail permissions.

**Response:** `200 OK`
```json
{
  "has_permissions": true,
  "scopes": [
    "openid",
    "email",
    "profile",
    "gmail.readonly",
    "gmail.send",
    "gmail.modify"
  ]
}
```

**Error Response:** `403 Forbidden`
```json
{
  "detail": "Missing Gmail permissions. Please re-authenticate."
}
```

---

## 📧 Email Operations

### 1. Fetch Recent Emails

```http
GET /emails?max_results={count}
Authorization: Bearer {token}
```

**Description:** Fetches recent emails from the user's Gmail inbox with AI-generated summaries.

**Query Parameters:**
- `max_results` (integer, optional, default: 5) - Number of emails to fetch (1-50)

**Response:** `200 OK`
```json
{
  "emails": [
    {
      "id": "18c2f3a8b9d1e234",
      "subject": "Project Update Meeting",
      "sender": "boss@company.com",
      "sender_name": "Sarah Boss",
      "date": "2025-12-05T10:30:00Z",
      "snippet": "Hi team, let's discuss the project progress...",
      "summary": "Meeting request to discuss Q4 project progress. Agenda includes timeline review and resource allocation."
    }
  ],
  "count": 5
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "detail": "Failed to fetch emails: Gmail API error"
}
```

**Example Request:**
```javascript
const response = await fetch('http://localhost:8000/emails?max_results=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

### 2. Generate AI Replies

```http
POST /emails/generate-replies
Authorization: Bearer {token}
Content-Type: application/json
```

**Description:** Generates AI-powered contextual replies for a list of emails.

**Request Body:**
```json
{
  "emails": [
    {
      "id": "18c2f3a8b9d1e234",
      "subject": "Project Update Meeting",
      "sender": "boss@company.com",
      "snippet": "Can we meet tomorrow at 2pm?"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "replies": [
    {
      "email_id": "18c2f3a8b9d1e234",
      "to": "boss@company.com",
      "subject": "Re: Project Update Meeting",
      "body": "Thank you for reaching out. I'm available for the meeting tomorrow at 2pm. Looking forward to discussing the project progress.\n\nBest regards"
    }
  ]
}
```

**Error Response:** `400 Bad Request`
```json
{
  "detail": "No emails provided"
}
```

---

### 3. Send Email Reply

```http
POST /emails/send-reply
Authorization: Bearer {token}
Content-Type: application/json
```

**Description:** Sends an email reply via Gmail API.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Re: Project Update",
  "body": "Thank you for your email. I'll review the documents and get back to you by end of day.",
  "thread_id": "18c2f3a8b9d1e234"
}
```

**Fields:**
- `to` (string, required) - Recipient email address
- `subject` (string, required) - Email subject
- `body` (string, required) - Email body content
- `thread_id` (string, optional) - Gmail thread ID to reply in thread

**Response:** `200 OK`
```json
{
  "message": "Reply sent successfully",
  "email_id": "18c2f3b1c4d5e678"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "detail": "Failed to send email: SMTP error"
}
```

---

### 4. Delete Email

```http
DELETE /emails/{email_id}
Authorization: Bearer {token}
```

**Description:** Permanently deletes an email from Gmail.

**Path Parameters:**
- `email_id` (string, required) - Gmail message ID

**Response:** `200 OK`
```json
{
  "message": "Email deleted successfully",
  "email_id": "18c2f3a8b9d1e234"
}
```

**Error Response:** `404 Not Found`
```json
{
  "detail": "Email not found"
}
```

**Warning:** This is a permanent delete operation with no undo.

---

### 5. Parse Natural Language Command

```http
POST /emails/parse-command
Authorization: Bearer {token}
Content-Type: application/json
```

**Description:** Parses natural language commands into structured actions using AI.

**Request Body:**
```json
{
  "command": "Show me urgent emails from last week about the project"
}
```

**Response:** `200 OK`
```json
{
  "action": "read_emails",
  "parameters": {
    "filter": "urgent",
    "timeframe": "last week",
    "subject": "project"
  },
  "confidence": 0.95,
  "original_command": "Show me urgent emails from last week about the project"
}
```

**Supported Actions:**
- `read_emails` - Fetch and display emails
- `generate_replies` - Generate AI replies
- `send_reply` - Send an email
- `delete_email` - Delete an email
- `categorize_inbox` - Categorize emails
- `daily_digest` - Generate daily summary

**Fallback:** If AI parsing fails, uses keyword-based fallback parsing.

---

### 6. Categorize Inbox

```http
POST /emails/categorize
Authorization: Bearer {token}
```

**Description:** Categorizes the 20 most recent emails into Work, Personal, Promotions, and Urgent categories.

**Response:** `200 OK`
```json
{
  "categories": {
    "Work": [
      {
        "id": "18c2f3a8b9d1e234",
        "subject": "Q4 Budget Review",
        "sender": "finance@company.com",
        "date": "2025-12-05T09:00:00Z",
        "summary": "Finance team requesting budget review for Q4 planning."
      }
    ],
    "Personal": [
      {
        "id": "18c2f3a8b9d1e567",
        "subject": "Dinner plans this weekend?",
        "sender": "friend@gmail.com",
        "date": "2025-12-05T14:30:00Z",
        "summary": "Friend asking about weekend dinner plans."
      }
    ],
    "Promotions": [
      {
        "id": "18c2f3a8b9d1e890",
        "subject": "50% OFF Black Friday Sale",
        "sender": "marketing@store.com",
        "date": "2025-12-05T08:00:00Z",
        "summary": "Promotional email advertising Black Friday sale."
      }
    ],
    "Urgent": [
      {
        "id": "18c2f3a8b9d1e123",
        "subject": "URGENT: Server downtime",
        "sender": "ops@company.com",
        "date": "2025-12-05T16:00:00Z",
        "summary": "Production server experiencing downtime, immediate attention needed."
      }
    ]
  },
  "total": 20,
  "timestamp": "2025-12-05T16:30:00Z"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "detail": "Failed to categorize emails"
}
```

**Notes:**
- Uses keyword-based categorization for reliability
- AI summaries are generated for each email
- Automatically retries on transient errors

---

### 7. Generate Daily Digest

```http
GET /emails/daily-digest
Authorization: Bearer {token}
```

**Description:** Creates a daily summary of recent emails, prioritized into Urgent, Action Required, and FYI categories.

**Response:** `200 OK`
```json
{
  "digest": {
    "date": "2025-12-05",
    "total_emails": 15,
    "categories": {
      "Urgent": [
        {
          "subject": "Server downtime alert",
          "sender": "ops@company.com",
          "priority": "HIGH",
          "summary": "Production server issues require immediate attention."
        }
      ],
      "Action Required": [
        {
          "subject": "Please review contract",
          "sender": "legal@company.com",
          "priority": "MEDIUM",
          "summary": "Contract review needed before Friday deadline."
        }
      ],
      "FYI": [
        {
          "subject": "Weekly newsletter",
          "sender": "news@company.com",
          "priority": "LOW",
          "summary": "Company newsletter with updates and announcements."
        }
      ]
    }
  },
  "summary": "You have 2 urgent items, 3 requiring action, and 10 FYI emails.",
  "timestamp": "2025-12-05T17:00:00Z"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "detail": "Failed to generate digest"
}
```

**Notes:**
- Analyzes emails from the last 24 hours
- Prioritizes based on keywords and context
- Includes actionable insights

---

### 8. Get Operation Status

```http
GET /emails/status/{operation}
Authorization: Bearer {token}
```

**Description:** Returns user-friendly status message for an operation.

**Path Parameters:**
- `operation` (string, required) - Operation name

**Supported Operations:**
- `fetching_emails`
- `generating_summary`
- `generating_replies`
- `sending_reply`
- `deleting_email`
- `categorizing`
- `creating_digest`
- `retrying`

**Response:** `200 OK`
```json
{
  "status": "categorizing",
  "message": "📊 Categorizing your inbox..."
}
```

**Usage:** Display status messages to users during long operations.

---

## 🔄 Error Handling

### Standard Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error - Server issue |

### Retry Behavior

The backend automatically retries failed operations with exponential backoff:
- Max retries: 3
- Delays: 1s → 2s → 4s
- Applied to: Email categorization, digest generation, Gmail API calls

---

## 📊 Rate Limits

### Gmail API Limits
- **Per user quota**: 1 billion quota units/day
- **Read operations**: ~5 units per email
- **Send operations**: ~100 units per email

### Gemini AI Limits
- **Free tier**: 60 requests/minute
- **Quota**: Subject to Google AI limits

**Note:** Production apps should implement additional rate limiting.

---

## 🔒 Security

### JWT Tokens
- **Algorithm**: HS256
- **Expiration**: 24 hours (configurable)
- **Refresh**: Not implemented (re-authenticate on expiry)

### CORS
- **Allowed Origins**: Configured in `FRONTEND_URL` environment variable
- **Credentials**: Allowed
- **Methods**: All
- **Headers**: All

### OAuth Scopes
Required Gmail API scopes:
- `openid` - OpenID Connect
- `email` - User email address
- `profile` - User profile info
- `gmail.readonly` - Read emails
- `gmail.send` - Send emails
- `gmail.modify` - Modify/delete emails

---

## 🧪 Testing with Postman/cURL

### Example: Fetch Emails

```bash
# Get auth token first via OAuth flow, then:
curl -X GET "http://localhost:8000/emails?max_results=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Example: Generate Replies

```bash
curl -X POST "http://localhost:8000/emails/generate-replies" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "emails": [
      {
        "id": "123",
        "subject": "Meeting request",
        "sender": "boss@company.com",
        "snippet": "Can we meet tomorrow?"
      }
    ]
  }'
```

### Example: Send Reply

```bash
curl -X POST "http://localhost:8000/emails/send-reply" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Re: Meeting",
    "body": "Yes, I am available tomorrow at 2pm."
  }'
```

---

## 📚 Additional Resources

- **Interactive API Docs**: Visit `/docs` when server is running
- **ReDoc Documentation**: Visit `/redoc` for alternative view
- **Source Code**: [GitHub Repository](https://github.com/Shivam-Thakur7/ConstructureAI)
- **Issues**: [GitHub Issues](https://github.com/Shivam-Thakur7/ConstructureAI/issues)

---

**API Version:** 1.0.0  
**Last Updated:** December 5, 2025
