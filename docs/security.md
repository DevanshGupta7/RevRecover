# RevRecover — Security

## 1. Security Principles

- Least privilege
- Defense in depth
- Secure by default
- Data minimization

## 2. Authentication

- JWT
- Password hashing
- Token expiration
- Refresh tokens

## 3. Authorization

Roles:

- Merchant owner
- Admin
- Analyst

Explain RBAC.

## 4. Razorpay Security

- API keys stored only on backend
- Never expose secret key to frontend
- Webhook signature verification
- Environment variables

## 5. Sensitive Data

Never store:

- Razorpay secret keys in database
- Card numbers
- CVV
- UPI PIN
- Customer passwords in plaintext

## 6. Secrets Management

Environment variables:

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
DATABASE_URL
JWT_SECRET
LLM_API_KEY

## 7. API Security

- HTTPS
- CORS
- Rate limiting
- Input validation
- SQL injection protection
- Request size limits

## 8. Webhook Security

1. Receive webhook
2. Read raw payload
3. Verify signature
4. Check event ID
5. Check idempotency
6. Process event

## 9. Database Security

- Encrypted connections
- Restricted database access
- Parameterized queries
- Backups

## 10. AI Security

- Prompt injection protection
- Data minimization
- Output validation
- Tool/action restrictions

## 11. Logging

Never log:

- API secrets
- passwords
- payment credentials
- sensitive customer information

## 12. Incident Response

What happens if:

- API key leaks
- webhook is attacked
- database is compromised
- AI provider is unavailable
