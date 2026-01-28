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

### Database Schema
Location: `src/domain/schema.ts`
- `otps` table stores:
  - `id`: PK
  - `code`: Hashed OTP string
  - `expiresAt`: Timestamp
  - `validated`: Boolean flag

### Security
- **Private Key**: Key located in `src/config/private.key.ts` influences OTP generation via HMAC.
- **Encryption**: OTPs are hashed using Argon2id.
- **Validation**: Codes are one-time use. Once validated, the record is marked and cannot be reused.
- **Expiration**: OTPs expire after 5 minutes (enforced by Service query logic).

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
