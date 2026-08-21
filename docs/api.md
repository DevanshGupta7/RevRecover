# RevRecover — API Documentation

## 1. Base URL

Development:
http://localhost:8000/api/v1

Production:
<production-url>

## 2. Authentication

Bearer JWT

Authorization:
Bearer <token>

## 3. Authentication APIs

POST /auth/register
POST /auth/login
POST /auth/refresh
GET /auth/me

## 4. Merchant APIs

GET /merchant
PATCH /merchant

## 5. Customer APIs

GET /customers
GET /customers/{id}
POST /customers

## 6. Payment APIs

GET /payments
GET /payments/{id}

## 7. Revenue APIs

GET /revenue/overview
GET /revenue/recovered
GET /revenue/lost

## 8. Recovery APIs

GET /recovery
GET /recovery/{id}
POST /recovery/{id}/retry

## 9. AI APIs

POST /ai/analyze-payment
POST /ai/generate-recovery-strategy
POST /ai/generate-message

## 10. Razorpay Webhooks

POST /webhooks/razorpay

Supported events:

- payment.failed
- payment.captured
- payment.authorized
- refund.created
- subscription.charged
- subscription.cancelled

## 11. Response Format

{
    "success": true,
    "data": {},
    "error": null
}

## 12. Error Handling

400
401
403
404
409
422
429
500

## 13. Rate Limiting

Explain limits.

## 14. Webhook Security

Explain signature verification and idempotency.
