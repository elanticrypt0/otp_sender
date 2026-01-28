# OTPKEYS - Zero-Knowledge MFA Protocol

A secure, high-performance Zero-Knowledge MFA server for **MOLTBOT** instances. Designed to allow AI Agents to perform critical tasks securely without ever seeing the sensitive OTP codes.

## 🔐 The "Blind Pipe" Architecture

The core of **OTPKEYS** is the **Blind Pipe** architecture, which ensures that secrets never touch the AI Agent's chat context or logs:

1.  **Request**: AI Agent triggers `blind_send.sh`.
2.  **Generate**: Server creates an OTP and returns it only to the script.
3.  **Transmission**: The script pipes the OTP directly to a private email mailer.
4.  **Isolation**: The OTP is never printed to stdout/stderr in the agent's context.
5.  **Validation**: User provides the OTP from their email to the agent, who validates it via `validate_otp.sh`.

## 🚀 Quick Start (Docker)

The fastest way to deploy the OTPKEYS server:

```bash
# 1. Start the service
docker compose up -d --build

# 2. Key generation is handled automatically inside the container
# The service runs on http://localhost:13500
```

## 🛠️ Shell Script Integration

We provide two reference scripts for zero-knowledge integration:

### [blind_send.sh](file:///home/screamsh0ck/__projects/eva_tools/otp_sender/blind_send.sh)
Triggers the "Blind Pipe" to generate and send an OTP to the user's email without the agent seeing the code.

### [validate_otp.sh](file:///home/screamsh0ck/__projects/eva_tools/otp_sender/validate_otp.sh)
Used by the agent to verify the code provided by the user. If validation fails, it triggers a security alert email.

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/otp/generate` | `POST` | Generates a new OTP and returns it. |
| `/api/otp/validate` | `POST` | Validates a code: `{"code": "..."}`. Returns `{"success": 1}` if valid. |

---
*For detailed architecture and security implementation, see [DEVELOPMENT.md](file:///home/screamsh0ck/__projects/eva_tools/otp_sender/DEVELOPMENT.md).*
