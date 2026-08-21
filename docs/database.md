# RevRecover — Database Design

## 1. Database

PostgreSQL

## 2. Entity Relationship Diagram

Merchant
 ↓
Customers
 ↓
Payments
 ↓
Payment Failures
 ↓
Recovery Attempts
 ↓
Recovery Events

## 3. Tables

### merchants

- id
- name
- email
- razorpay_account_id
- created_at

### users

- id
- merchant_id
- email
- password_hash
- role
- created_at

### customers

- id
- merchant_id
- name
- email
- phone
- created_at

### payments

- id
- merchant_id
- customer_id
- razorpay_payment_id
- amount
- currency
- status
- created_at

### payment_failures

- id
- payment_id
- failure_code
- failure_reason
- failure_category
- detected_at

### recovery_attempts

- id
- payment_id
- strategy
- channel
- message
- status
- attempted_at

### recovery_events

- id
- recovery_attempt_id
- event_type
- amount_recovered
- occurred_at

### ai_decisions

- id
- payment_failure_id
- classification
- confidence
- recommended_action
- reasoning
- created_at

## 4. Relationships

Explain foreign keys and relationships.

## 5. Indexes

- merchant_id
- customer_id
- payment_id
- razorpay_payment_id
- status
- created_at

## 6. Data Retention

Explain how long payment/recovery information is stored.

## 7. Database Security

- Encryption
- Credentials
- Least privilege
- No sensitive payment credentials
