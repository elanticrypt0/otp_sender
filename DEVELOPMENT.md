# Development Guide

## Architecture Overview

The project follows a localized version of Clean Architecture:
- **Presentation**: `src/controllers` (Elysia handlers)
- **Domain**: `src/services`, `src/domain` (Business logic, Interfaces)
- **Data**: `src/repositories` (Drizzle/SQLite implementation)

## Key Components

### OTP Service
Location: `src/services/otp.service.ts`
- Generates 6-character alphanumeric cryptographically secure codes.
- Hashes the OTP using `Bun.password` (Argon2id) before persisting.
- Validates by retrieving the latest valid OTP from the repository and verifying the hash.

### Integration Scripts
Location: `blind_send.sh`, `validate_otp.sh`
- **blind_send.sh**: Fetches OTP from the API and pipes it directly to the email mailer.
- **validate_otp.sh**: Validates the user-provided code and triggers a security alert on failure.

### Database Schema
Location: `src/domain/schema.ts`
- `otps` table stores:
  - `id`: PK
  - `code`: Hashed OTP string (Argon2id)
  - `expiresAt`: Timestamp
  - `validated`: Boolean flag

## Security Principles

### Zero-Knowledge "Blind Pipe"
The system is designed so that the **AI Agent never sees the OTP**. The shell script acting as an intermediary ensures:
1.  The API response containing the plain-text OTP is captured by the script variable.
2.  The script pipes this variable directly to the `mail.py` stdin or arguments.
3.  No output is printed to the console that the agent can read.

### Secure Storage
- **HMAC Influence**: The `private.key.ts` is used as an HMAC secret to influence the randomness of the generated alphanumeric code.
- **Argon2id**: OTPs are hashed using Argon2id before database insertion. Even with database access, the codes cannot be reversed.
- **One-Time Use**: Records are marked as `validated` and cannot be reused.
- **Expiration**: Strict 5-minute window for validation.

## MOLTBOT Integration Protocol

The AI Agent should trigger the **OTPKEYS** protocol for any **Critical Action**:
- Accessing or viewing stored credentials/API keys.
- Deleting system-critical files or directories.
- Modifying security-related source code or system instructions.
- Modifying the `OTPKEYS` service itself.
- Stopping, restarting, or reconfiguring core services.

## Database Management
We use Drizzle Kit for schema management.

**Push Schema Changes:**
```bash
bun drizzle-kit push
```

**View Studio:**
```bash
bun drizzle-kit studio
```

## Running with Docker

You can run the service using Docker and Docker Compose. This will automatically handle dependencies and environment setup.

### Prerequisites
- Docker
- Docker Compose

### Commands

**Build and Start:**
```bash
docker compose up -d --build
```

**Check Logs:**
```bash
docker compose logs -f
```

**Stop Service:**
```bash
docker compose down
```

The service will be available at `http://localhost:13500`. The `sqlite.db` file and `src/config/private.key.ts` are persisted via volumes.
