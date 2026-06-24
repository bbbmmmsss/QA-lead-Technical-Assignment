# QA-lead-Technical-Assignment
#Risk based test plan and Delivary Pipeline

| Risk                           | Likelihood | Impact   | Test                    |
| ------------------------------ | ---------- | -------- | ----------------------- |
| Duplicate delivery             | High       | Critical | Idempotency test        |
| Retry storm                    | Medium     | Critical | Backoff validation      |
| Poison message                 | Medium     | High     | DLQ test                |
| OAuth token expiry             | High       | High     | Token refresh test      |
| Out-of-order processing        | Medium     | High     | Sequence validation     |
| Partial transformation failure | Medium     | High     | Transformation rollback |
| SQS enqueue failure            | Medium     | Critical | Retry & alerting        |
| Xero API outage                | High       | Critical | Retry mechanism         |

**Delivary Pipeline**

HubSpot Deal
    ↓
CEL Filter
    ↓
Payload Transformation
    ↓
SQS Queue
    ↓
Lambda Delivery
    ↓
Xero Invoice Creation
    ↓
Retry Logic
