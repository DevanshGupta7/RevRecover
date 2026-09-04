# RevRecover

> **AI-powered revenue recovery for failed payments**

RevRecover is an intelligent revenue-recovery platform built for the **Razorpay Buildathon — Track 03: AI Revenue Recovery**.

Instead of treating every failed payment as the same problem, RevRecover analyzes the failure context, evaluates recovery eligibility and potential, selects an appropriate recovery strategy, executes the recovery action through Razorpay, and verifies the final payment outcome through webhook reconciliation.

The goal is simple:

> **Find revenue that is slipping away — and intelligently win it back.**

---

## ✨ What RevRecover Does

A failed payment is not always a lost customer.

RevRecover turns a failed payment into a structured recovery workflow:

```text
Payment Failure
      ↓
Failure Analysis
      ↓
Recovery Eligibility
      ↓
Risk & Recovery Assessment
      ↓
AI Recovery Decision
      ↓
Policy Validation
      ↓
Recovery Action
      ↓
Razorpay Execution
      ↓
Webhook Verification
      ↓
Recovered Revenue
```

For example, if a ₹10,000 payment fails because a customer's card has expired, RevRecover does **not** blindly retry the card.

Instead, it can determine that:

- the customer has paid successfully before,
- the customer has meaningful lifetime value,
- the subscription is still active,
- the payment is worth pursuing,
- an expired card should not be repeatedly retried,

and recommend an appropriate recovery action such as creating a payment link.

---

# 🚀 Key Features

## 1. Failed Payment Intelligence

RevRecover captures and displays:

- Payment amount
- Currency
- Payment status
- Failure reason
- Failure code
- Customer
- Previous attempts
- Payment history
- Recovery status

Known failure categories can be mapped into actionable recovery strategies instead of being treated as generic failures.

---

## 2. Deterministic Failure Analysis

The recovery engine first analyzes the payment failure before involving the AI decision layer.

Examples:

| Failure | Typical interpretation | Recovery approach |
|---|---|---|
| `INSUFFICIENT_FUNDS` | Customer may need time/funds | Retry after delay |
| `TEMPORARY_ERROR` | Temporary payment issue | Retry after short delay |
| `BANK_ERROR` | Bank-side failure | Retry / alternative payment path |
| `NETWORK_ERROR` | Connectivity/gateway issue | Retry |
| `GATEWAY_ERROR` | Gateway-side issue | Retry |
| `EXPIRED_CARD` | Payment method is invalid | Payment link / update method |
| `INVALID_CARD` | Invalid payment method | Update payment method |
| `CARD_NOT_SUPPORTED` | Payment method unsupported | Alternative payment method |
| Unknown | Insufficient information | Stop or escalate |

This deterministic layer provides a reliable baseline before AI reasoning.

---

## 3. Recovery Eligibility

Not every failed payment should be recovered automatically.

RevRecover evaluates factors such as:

- Payment status
- Failure type
- Retryability
- Previous recovery attempts
- Active recovery policy
- Maximum attempts
- Risk amount
- Customer context

This prevents wasteful or inappropriate recovery attempts.

---

## 4. AI Recovery Decision

The AI layer acts as an **advisory decision-maker**, not an unrestricted executor.

It analyzes the recovery case and produces structured information such as:

- Recovery potential
- Confidence
- Recommended action
- Reasoning
- Recovery strategy

The result is then checked against the application's recovery policy before execution.

This separation is intentional:

```text
AI Recommendation
       ↓
Policy Validation
       ↓
Allowed Action
       ↓
Execution
```

AI therefore helps make the decision while deterministic business rules remain in control of execution.

---

## 5. Recovery Strategies

RevRecover supports recovery actions such as:

- Retry payment
- Retry after delay
- Create payment link
- Send payment reminder
- Request payment method update
- Wait
- Human approval
- Stop recovery

The strategy is based on the payment failure context rather than a one-size-fits-all rule.

---

## 6. Automated Razorpay Recovery

For eligible cases, RevRecover can execute recovery actions through Razorpay.

For the hero demo flow:

```text
Expired Card
      ↓
AI identifies high recovery potential
      ↓
Create Payment Link
      ↓
Razorpay Test Mode
      ↓
Customer completes payment
      ↓
Razorpay emits webhook
      ↓
RevRecover verifies webhook
      ↓
Original payment becomes recovered
```

---

## 7. Webhook-Based Reconciliation

Payment success is not considered final merely because the customer reaches a payment-success page.

RevRecover uses Razorpay webhook events as the authoritative reconciliation mechanism.

The webhook flow includes:

1. Receive Razorpay event
2. Validate webhook signature
3. Read event ID
4. Apply idempotency protection
5. Parse the payment-link event
6. Correlate the event with the existing recovery case
7. Update the original business payment
8. Create/update payment attempt information
9. Update recovery attempt
10. Mark the recovery case as recovered
11. Persist the event

This is particularly important because webhook delivery can be retried.

---

## 8. Recovery Cases

Each recovery workflow is represented as a recovery case.

A case can contain:

- Customer
- Original payment
- Recovery policy
- Risk amount
- Risk type
- Failure information
- Risk score
- Recovery probability
- Maximum attempts
- Current step
- Current status
- Recovery actions
- Recovery attempts
- AI decisions
- Timeline

---

## 9. Analytics

RevRecover provides business-level recovery insights such as:

- Revenue at risk
- Eligible revenue
- Recovered revenue
- Recovery rate
- Recovery performance
- Strategy-level performance
- Recovery trends

The analytics layer turns individual recovery events into measurable business impact.

---

## 10. Audit Logs

Recovery is an automated financial workflow, so transparency matters.

RevRecover provides an audit trail for important system activity, including:

- Payment events
- AI decisions
- Recovery actions
- Recovery state changes
- Webhook-related activity
- Successful recovery events

This makes it possible to understand **what happened, why it happened, and what action the system took**.

---

# 🧠 Architecture

RevRecover follows a layered architecture designed to keep AI, business rules, payment execution, and persistence separated.

```text
┌─────────────────────────────────────────────┐
│                 Next.js UI                  │
│ Dashboard • Payments • Cases • Analytics   │
│ Strategies • Customers • Audit Logs        │
└──────────────────────┬──────────────────────┘
                       │ HTTP / REST
                       ▼
┌─────────────────────────────────────────────┐
│                FastAPI API                  │
│ Auth • Payments • Recovery • Webhooks      │
└──────────────────────┬──────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌───────────────────┐     ┌──────────────────┐
│ Recovery Services │     │ Razorpay Service │
│                   │     │                  │
│ Analysis          │     │ Payment Links    │
│ Eligibility       │     │ Payment Actions  │
│ Strategy          │     │ Webhooks         │
│ AI Decision       │     │ Reconciliation   │
│ Policy Validation │     │                  │
└─────────┬─────────┘     └────────┬─────────┘
          │                        │
          └────────────┬───────────┘
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │                 │
              │ Organisations   │
              │ Users           │
              │ Customers       │
              │ Payments        │
              │ Attempts        │
              │ Recovery Cases  │
              │ Actions         │
              │ AI Decisions    │
              │ Webhook Events  │
              └─────────────────┘

                       ▲
                       │
              ┌────────┴────────┐
              │    OpenAI       │
              │ AI advisory     │
              │ decision layer  │
              └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- REST API integration
- JWT-based authentication

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Pydantic
- JWT authentication
- Ruff
- Pytest

## Integrations

- Razorpay
- Razorpay Payment Links
- Razorpay Webhooks
- OpenAI

## Development / Deployment

- Git + GitHub
- Vercel / Netlify for frontend
- Render / Railway for backend
- PostgreSQL hosting such as Neon, Render, Railway, or another managed PostgreSQL provider
- Cloudflare Tunnel / ngrok for local webhook testing

---

# 📁 Project Structure

The repository is organized into separate frontend and backend applications.

```text
RevRecover/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   ├── payments/
│   │   │   ├── recovery/
│   │   │   └── webhooks/
│   │   │       └── razorpay.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── organisation.py
│   │   │   ├── user.py
│   │   │   ├── membership.py
│   │   │   ├── customer.py
│   │   │   ├── payment.py
│   │   │   ├── payment_attempt.py
│   │   │   ├── recovery_policy.py
│   │   │   ├── recovery_case.py
│   │   │   ├── recovery_action.py
│   │   │   ├── recovery_attempt.py
│   │   │   ├── ai_decision.py
│   │   │   └── webhook_event.py
│   │   │
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── payment_events/
│   │   │   ├── recovery/
│   │   │   ├── razorpay/
│   │   │   └── ...
│   │   │
│   │   └── main.py
│   │
│   ├── alembic/
│   │   │   ├── versions/
│   │   │   ├── env.py
│   │   │   └── README
│   │
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── public/
│   ├── .env.local
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── .gitignore
├── README.md
└── ...
```

> **Note:** The exact filenames can evolve as the application grows. The important architectural boundary is `frontend/` for the UI and `backend/` for the API, business logic, integrations, and persistence.

---

# ⚙️ Prerequisites

Install the following before running RevRecover:

- Git
- Python 3.11+ recommended
- Node.js 20+ recommended
- npm
- PostgreSQL 14+
- Razorpay account with API credentials
- OpenAI API key for AI decision functionality

For webhook testing during local development, install one of:

- Cloudflare Tunnel
- ngrok

---

# 🔐 Environment Variables

**Never commit real credentials to Git.**

Create local environment files from the example files:

```text
backend/.env
frontend/.env.local
```

Both should remain in `.gitignore`.

---

## Backend `.env`

Example:

```env
# Application
APP_NAME=RevRecover
ENVIRONMENT=development
DEBUG=true

# Database
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/revrecover

# JWT / Authentication
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Razorpay Webhook
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# CORS
FRONTEND_URL=http://localhost:3000
```

> **Important:** If your existing backend configuration uses different variable names, use the names defined by `backend/app/core/config.py`. `.env.example` should always mirror the actual configuration class.

---

## Frontend `.env.local`

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If the frontend has additional public configuration variables, document them here as well.

### Never put secrets in `NEXT_PUBLIC_*`

Anything beginning with:

```text
NEXT_PUBLIC_
```

can be exposed to the browser.

Never put:

- Razorpay secret
- OpenAI API key
- JWT signing secret
- Webhook secret
- Database password

inside a `NEXT_PUBLIC_*` variable.

---

# 🗄️ Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE revrecover;
```

Then configure:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/revrecover
```

Verify PostgreSQL is running before starting the backend.

---

# 🐍 Backend Setup

Open a terminal:

```powershell
cd backend
```

## 1. Create a virtual environment

Windows:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can use:

```powershell
.venv\Scripts\activate
```

---

## 2. Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## 3. Configure environment variables

Create:

```text
backend/.env
```

using the example above.

---

## 4. Run database migrations

From:

```text
backend/
```

run:

```powershell
alembic upgrade head
```

This creates/updates the database schema from the Alembic migration history.

---

## 5. Start FastAPI

```powershell
uvicorn app.main:app --reload
```

The backend should now be available at:

```text
http://localhost:8000
```

FastAPI's interactive documentation is normally available at:

```text
http://localhost:8000/docs
```

and the OpenAPI schema at:

```text
http://localhost:8000/openapi.json
```

---

# ⚛️ Frontend Setup

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Create:

```text
frontend/.env.local
```

and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# ▶️ Running the Complete Application

You normally need two terminals.

### Terminal 1 — Backend

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🔑 Authentication Flow

RevRecover uses JWT-based authentication with organisation membership.

Conceptually:

```text
User
  ↓
Login
  ↓
JWT
  ↓
Authenticated API request
  ↓
User / Organisation context
  ↓
Organisation-scoped resources
```

Resources such as payments, customers, recovery cases, and recovery actions are associated with an organisation.

This prevents one organisation's business data from being treated as another organisation's data.

---

# 💳 Payment & Recovery Data Model

The core payment relationship is:

```text
Organisation
     │
     ├── Customers
     │      │
     │      └── Payments
     │             │
     │             ├── Payment Attempts
     │             │
     │             └── Recovery Case
     │                    │
     │                    ├── Recovery Actions
     │                    ├── Recovery Attempts
     │                    └── AI Decisions
     │
     └── Recovery Policies
```

A payment is the original business transaction.

A payment attempt represents an attempt to process that payment.

A recovery case represents the business workflow for trying to recover a failed payment.

A recovery action represents what the recovery system plans or executes.

An AI decision represents the AI advisory output.

A webhook event represents an external provider event that has been received and processed.

---

# 🤖 AI Decision Architecture

RevRecover intentionally avoids giving the AI unrestricted control over payment execution.

The decision pipeline is:

```text
Payment
   ↓
Failure Analysis
   ↓
Eligibility
   ↓
Customer / Payment Context
   ↓
AI Analysis
   ↓
Recommended Action
   ↓
Recovery Policy Validation
   ↓
Recovery Action
   ↓
Execution
```

This provides an important architectural principle:

> **AI recommends; business rules validate; application services execute.**

This makes the system easier to reason about, test, audit, and extend.

---

# 🔄 Recovery Engine

The recovery engine is responsible for creating a recovery case from an eligible failed payment.

At a high level:

```text
Get payment
   ↓
Check organisation ownership
   ↓
Check for existing recovery case
   ↓
Analyze failure
   ↓
Load active policy
   ↓
Evaluate eligibility
   ↓
Calculate risk
   ↓
Create recovery case
```

Duplicate recovery cases are prevented for the same payment.

---

# 🧩 Recovery Service

The recovery service coordinates the larger workflow:

```text
Payment
  ↓
Recovery Engine
  ↓
Recovery Case
  ↓
AI Decision
  ↓
Recovery Action
  ↓
Commit
```

This keeps orchestration separate from individual business rules and provider-specific code.

---

# 💰 Razorpay Integration

RevRecover integrates with Razorpay for payment recovery.

The integration supports:

- Razorpay authentication
- Payment Link creation
- Recovery action execution
- Webhook signature validation
- Webhook event idempotency
- Payment-link correlation
- Successful payment reconciliation

For Payment Links, the recovery case is correlated using a generated reference identifier.

Conceptually:

```text
Recovery Case
     ↓
Reference ID
     ↓
Razorpay Payment Link
     ↓
payment_link.paid
     ↓
Reference ID
     ↓
Original Recovery Case
```

---

# 🔔 Local Razorpay Webhook Testing

A local backend such as:

```text
http://localhost:8000
```

cannot normally receive a webhook directly from Razorpay over the public internet.

You therefore need a public tunnel.

Example with a tunnel provider:

```text
Internet
   ↓
Public HTTPS URL
   ↓
Tunnel
   ↓
localhost:8000
```

The webhook endpoint should be configured to point to the public URL for the Razorpay webhook route.

For example, conceptually:

```text
https://YOUR-TUNNEL-DOMAIN/<razorpay-webhook-route>
```

Use the **exact route exposed by your FastAPI application**.

---

## Webhook Security

Razorpay webhook requests should be validated using the configured webhook secret and signature header.

The webhook flow should reject requests with an invalid signature.

Do not disable signature validation merely to make local testing easier.

---

# 🔁 Webhook Idempotency

Webhook providers may deliver the same event more than once.

RevRecover therefore treats the provider event ID as an idempotency key.

Conceptually:

```text
Webhook received
       ↓
Read event ID
       ↓
Already processed?
    ↙       ↘
   Yes       No
   ↓          ↓
Return     Process
             ↓
          Persist event
```

This prevents duplicate recovery effects.

---

# 🧪 Demo Dataset

The recommended Buildathon demo starts with six payments:

| Customer | Amount | Status | Failure |
|---|---:|---|---|
| Rahul Sharma | ₹4,500 | Failed | Insufficient Funds |
| Test Customer | ₹3,000 | Captured | — |
| Priya Mehta | ₹7,500 | Failed | Bank Error |
| Arjun Verma | ₹6,000 | Captured | — |
| Rahul Sharma | ₹2,500 | Failed | Temporary Error |
| Test Customer | ₹10,000 | Failed | Expired Card |

The ₹10,000 expired-card payment is the **hero recovery** used for the end-to-end demonstration.

The other failed payments exist to demonstrate that RevRecover can make different recovery decisions depending on the failure context.

---

# 🎥 Recommended Demo Flow

The strongest demonstration is:

```text
1. Dashboard
       ↓
2. Failed Payments
       ↓
3. Select ₹10,000 Expired Card Payment
       ↓
4. Payment Details
       ↓
5. AI Recovery Decision
       ↓
6. Start Recovery
       ↓
7. Payment Link Created
       ↓
8. Razorpay Test Payment
       ↓
9. Payment Success
       ↓
10. Return to RevRecover
       ↓
11. Webhook Reconciliation
       ↓
12. Recovery Case = Recovered
       ↓
13. Recovery Timeline
       ↓
14. Analytics
       ↓
15. Audit Logs
       ↓
16. Final Dashboard
```

The narrative should communicate:

> **Problem → Intelligence → Action → Payment → Verification → Business Impact**

---

# 🖥️ Frontend Pages

The main dashboard experience includes:

### Dashboard

High-level payment and recovery health.

### Failed Payments

Failed transactions requiring attention.

### Payment Details

Detailed payment context and recovery decision.

### Recovery Cases

Active and completed recovery workflows.

### Customers

Customer-level payment and recovery information.

### Recovery Strategies

Configured/available recovery strategy information.

### Analytics

Recovery performance and revenue insights.

### Audit Logs

Traceable system and recovery events.

### Settings

Application configuration and account-related settings.

---

# 📊 Important Product Metrics

Metric definitions should be consistent across Dashboard and Analytics.

Examples:

### Revenue at Risk

The amount represented by currently relevant failed/at-risk payments according to the application's business definition.

### Eligible Revenue

The portion of at-risk revenue that satisfies the configured recovery eligibility rules.

### Recovered Revenue

Revenue from failed payments that has subsequently been confirmed as successfully recovered.

### Recovery Rate

A clearly defined ratio based on the application's chosen revenue or case denominator.

> The same definitions should be used everywhere in the UI. Avoid calculating one metric differently on Dashboard and Analytics.

---

# 🧾 Auditability

A recovery system should be able to answer:

- What payment failed?
- Why did it fail?
- Was it eligible?
- Why was it considered worth recovering?
- What did the AI recommend?
- What policy allowed or rejected the action?
- What recovery action was created?
- What happened at Razorpay?
- Was the payment actually successful?
- When was the recovery case marked recovered?

RevRecover's case history, recovery actions, AI decisions, attempts, webhook events, and audit logs are designed to provide this traceability.

---

# 🧪 Testing

## Backend tests

Run:

```powershell
cd backend
python -m pytest
```

---

## Ruff

Check Python code:

```powershell
ruff check .
```

Automatically fix supported issues:

```powershell
ruff check --fix .
```

Check formatting:

```powershell
ruff format --check .
```

Format automatically:

```powershell
ruff format .
```

Recommended final verification:

```powershell
ruff check .
ruff format --check .
python -m pytest
```

---

## Frontend lint

From `frontend/`:

```powershell
npm run lint
```

If the project defines a production build script, also run:

```powershell
npm run build
```

before deployment.

---

# 🗃️ Alembic Migrations

Database schema changes should be tracked through Alembic.

Typical workflow:

```powershell
alembic revision --autogenerate -m "describe change"
```

Review the generated migration carefully.

Then:

```powershell
alembic upgrade head
```

To inspect current migration state:

```powershell
alembic current
```

To view migration history:

```powershell
alembic history
```

### Important

Do not blindly trust autogenerated migrations.

Always review:

- Added columns
- Removed columns
- Foreign keys
- Constraints
- Indexes
- Nullability
- Default values

---

# 🌱 Git Branching Strategy

RevRecover was developed feature-by-feature using feature branches.

A clean strategy for future work is:

```text
main
 │
 ├── feature/auth
 ├── feature/recovery-engine
 ├── feature/ai-recovery
 ├── feature/razorpay
 ├── feature/webhooks
 ├── feature/dashboard
 ├── feature/intelligence-audit
 └── feature/<future-feature>
```

Recommended workflow:

```powershell
git checkout main
git pull
git checkout -b feature/my-feature
```

Make changes, test them, then commit manually.

Keep commits focused:

```text
feat: add recovery eligibility evaluation
feat: add Razorpay payment link execution
fix: reconcile payment link against original payment
feat: add recovery analytics
```

---

# 🔒 Security

Never commit:

```text
.env
.env.local
.env.production
```

or any file containing secrets.

Never expose:

- Database credentials
- JWT secret
- OpenAI API key
- Razorpay API secret
- Razorpay webhook secret

If a secret is accidentally committed:

1. Rotate the secret immediately.
2. Remove it from the repository history if necessary.
3. Update the deployed environment.
4. Never assume deleting the file from the latest commit is sufficient.

---

# 🐛 Troubleshooting

## Backend cannot connect to PostgreSQL

Check:

- PostgreSQL service is running
- Database exists
- Username/password are correct
- Host and port are correct
- `DATABASE_URL` is correct
- SQLAlchemy driver is installed

---

## Alembic cannot find the database

Verify:

```powershell
alembic current
```

and check the backend `.env`.

Also make sure you are running Alembic from:

```text
backend/
```

---

## Frontend cannot reach backend

Check:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then verify the backend is running.

Also check:

- CORS configuration
- Browser Network tab
- API route
- Backend logs

---

## JWT/authentication errors

Check:

- Login succeeded
- Access token exists
- Token is being sent in the Authorization header
- JWT secret is the same between requests/restarts where required
- Organisation membership exists
- The requested resource belongs to the authenticated organisation

---

## AI decision fails

Check:

- `OPENAI_API_KEY` exists
- The key is valid
- The backend can reach the OpenAI API
- The model configured by the project is available
- Backend logs for the exact failure

---

## Razorpay Payment Link fails

Check:

- Razorpay credentials
- Test/live mode consistency
- Razorpay client configuration
- Amount/currency
- Payment-link payload
- Recovery action state
- Backend logs

---

## Invalid Razorpay webhook signature

Check:

1. The webhook secret in Razorpay matches `RAZORPAY_WEBHOOK_SECRET`.
2. The request body is verified exactly as received.
3. The signature header is being read correctly.
4. The public tunnel URL points to the correct local backend.
5. Razorpay is sending the request to the expected route.

Do not solve this by disabling signature verification.

---

## Payment succeeded but RevRecover still shows Failed

The expected reconciliation path is:

```text
Razorpay Payment
      ↓
payment_link.paid
      ↓
Webhook reaches backend
      ↓
Signature verified
      ↓
Event processed
      ↓
Recovery case correlated
      ↓
Original Payment updated
      ↓
Recovery Case updated
```

Check:

- Razorpay webhook delivery status
- Backend logs
- Webhook event ID
- Payment Link `reference_id`
- RecoveryAction result data
- RecoveryCase ID
- Original Payment ID
- PaymentAttempts

### Important

A successful recovery should update the **original business Payment**.

It should not create an unrelated second business payment simply because Razorpay generated a new provider payment ID.

The new Razorpay payment identifier can be represented as the provider attempt/payment-attempt information associated with the original payment.

---

# ☁️ Deployment

A practical deployment architecture is:

```text
                 Internet
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
   Vercel                    Render/Railway
   Frontend                    Backend
       │                         │
       └────────────┬────────────┘
                    ▼
               PostgreSQL
                    │
             External Services
              ├── Razorpay
              └── OpenAI
```

---

## Frontend deployment

Vercel is a natural choice for the Next.js frontend.

Configure:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-DOMAIN
```

Then build:

```powershell
npm run build
```

---

## Backend deployment

Render or Railway can host the FastAPI application.

The production environment should contain the backend secrets:

```text
DATABASE_URL
JWT_SECRET_KEY
OPENAI_API_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
FRONTEND_URL
```

Use the exact variable names expected by the backend configuration.

Run migrations during deployment:

```powershell
alembic upgrade head
```

Start the API with a production ASGI server command appropriate for the deployment environment.

---

# 🌐 Production Webhooks

Do not use a temporary local tunnel for production.

Configure Razorpay with the deployed backend's HTTPS webhook endpoint.

```text
Razorpay
   ↓
Production HTTPS Webhook
   ↓
FastAPI
   ↓
Signature Verification
   ↓
Idempotent Event Processing
   ↓
Recovery Reconciliation
```

---

# 🧭 Development Workflow

A recommended development loop:

```text
1. Create feature branch
        ↓
2. Implement feature
        ↓
3. Run backend tests
        ↓
4. Run Ruff
        ↓
5. Run frontend lint
        ↓
6. Run frontend build
        ↓
7. Test API flow
        ↓
8. Test UI flow
        ↓
9. Test failure/error cases
        ↓
10. Review diff
        ↓
11. Commit
        ↓
12. Push / open PR
```

---

# 🧱 Design Principles

RevRecover follows several principles.

## AI should not replace deterministic business logic

Use deterministic logic for:

- Eligibility
- Safety
- Policy limits
- Maximum attempts
- Provider authentication
- Webhook verification
- Idempotency
- Persistence

Use AI for:

- Contextual analysis
- Recovery prioritization
- Strategy recommendation
- Human-readable reasoning

---

## Payment providers are external systems

Never assume an API call alone proves final payment success.

The provider's verified event should drive reconciliation.

---

## Recovery should be auditable

Every meaningful action should leave enough information to reconstruct what happened.

---

## Avoid duplicate business transactions

A recovery attempt is not automatically a new business payment.

The original failed payment remains the business transaction being recovered.

---

## Organisation isolation matters

Every organisation-scoped resource should be queried with organisation context.

Never trust a client-supplied resource ID without verifying ownership.

---

# 📈 Future Improvements

RevRecover's architecture can be extended with:

- Automatic payment synchronization
- Scheduled retry workers
- Background job processing
- Customer communication via email/SMS/WhatsApp
- More recovery strategies
- Strategy experimentation / A-B testing
- Recovery probability calibration
- ML-based recovery scoring
- More payment providers
- Multi-currency support
- Subscription-aware recovery
- Automated customer segmentation
- Human approval queues
- Advanced recovery analytics
- Notification center
- Role-based permissions
- Production-grade observability
- Distributed event processing
- Rate limiting
- Stronger fraud/risk signals

These should be added without bypassing the existing policy, audit, and reconciliation boundaries.

---

# 🎯 Buildathon Demo Scenario

The recommended hero scenario is a **₹10,000 expired-card payment**.

The story:

```text
A customer has an active subscription.
        ↓
Their ₹10,000 payment fails.
        ↓
RevRecover detects the failure.
        ↓
It identifies an expired card.
        ↓
The customer has successfully paid before.
        ↓
Their lifetime value is meaningful.
        ↓
The payment has high recovery potential.
        ↓
AI recommends a recovery strategy.
        ↓
Policy validation allows the action.
        ↓
RevRecover creates a Razorpay Payment Link.
        ↓
The customer completes the payment.
        ↓
Razorpay sends payment_link.paid.
        ↓
RevRecover verifies and reconciles the event.
        ↓
The original payment becomes recovered.
        ↓
Analytics and audit logs reflect the outcome.
```

This demonstrates the complete product loop:

> **Detect → Understand → Decide → Act → Verify → Recover**

---

# 🏆 Why RevRecover?

Traditional payment dashboards mostly answer:

> **"Which payments failed?"**

RevRecover aims to answer the more valuable questions:

> **"Which failed payments are worth recovering?"**

> **"Why are they worth recovering?"**

> **"What should we do next?"**

> **"Can we execute that action automatically?"**

> **"Did the recovery actually succeed?"**

That turns payment failure monitoring into an **intelligent revenue-recovery workflow**.

---

# 📜 Project Status

RevRecover currently includes:

- [x] Next.js frontend
- [x] FastAPI backend
- [x] PostgreSQL persistence
- [x] SQLAlchemy models
- [x] Alembic migrations
- [x] JWT authentication
- [x] Organisation membership
- [x] Customer management
- [x] Payment tracking
- [x] Payment attempt tracking
- [x] Failure analysis
- [x] Recovery eligibility
- [x] Recovery cases
- [x] Recovery strategies
- [x] AI recovery decisions
- [x] Recovery actions
- [x] Razorpay integration
- [x] Razorpay Payment Links
- [x] Razorpay webhook handling
- [x] Webhook signature verification
- [x] Webhook idempotency
- [x] Payment reconciliation
- [x] Recovery timeline
- [x] Analytics
- [x] Audit logs
- [x] Buildathon demo workflow

---

# 🤝 Contributing

For contributions:

1. Fork/clone the repository.
2. Create a feature branch.
3. Make focused changes.
4. Add/update tests.
5. Run linting and formatting.
6. Verify the frontend build.
7. Review the Git diff.
8. Open a pull request with a clear description.

Suggested branch naming:

```text
feature/<feature-name>
fix/<bug-name>
refactor/<area>
docs/<documentation-change>
```

---

# 📄 License

Add the project's chosen license here.

If this repository is intended only for a Buildathon submission, you can instead state:

> This project was created as a Razorpay Buildathon submission. Contact the project owner for usage and licensing information.

---

# 👨‍💻 RevRecover

**AI Revenue Recovery**

> **Find revenue that's slipping away and win it back.**

Built for the **Razorpay Buildathon — Track 03: AI Revenue Recovery**.

**Detect failures. Understand context. Choose the right strategy. Execute recovery. Verify the outcome. Recover revenue.**
