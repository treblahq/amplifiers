# Integrations Pattern

## Purpose

Integrations adapt external APIs, queues, storage providers, and third-party SDKs to the application's internal contracts.

## Rules

DO:
- wrap external clients in focused adapters
- apply timeouts, retries, and authentication at the edge
- normalize external payloads before they reach the application layer
- hide vendor-specific models behind internal traits or service interfaces

DO NOT:
- spread raw SDK calls through handlers and services
- log secrets or sensitive payloads
- retry non-idempotent operations blindly

## Structure

```rust
use std::{sync::Arc, time::Duration};

#[derive(Clone)]
pub struct BillingClient {
    http: reqwest::Client,
    base_url: String,
    api_key: String,
}

impl BillingClient {
    pub fn new(base_url: String, api_key: String) -> Result<Self, reqwest::Error> {
        let http = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .build()?;

        Ok(Self { http, base_url, api_key })
    }

    pub async fn create_invoice(&self, input: InvoicePayload) -> Result<InvoiceId, AppError> {
        let response = self
            .http
            .post(format!("{}/invoices", self.base_url))
            .bearer_auth(&self.api_key)
            .json(&input)
            .send()
            .await?;

        let body = response.error_for_status()?.json::<InvoiceResponse>().await?;
        Ok(body.id)
    }
}

pub struct BillingGateway {
    client: Arc<BillingClient>,
}
```

## Practical Guidance

- Keep retry and backoff policies close to the integration, not scattered through callers.
- Use idempotency keys when the provider supports them.
- Prefer one adapter per external capability instead of one giant client with unrelated responsibilities.
