# OTP Sender

A secure, high-performance OTP generation and validation service built with Bun, Elysia, and SQLite.

## Features
- **High Performance**: Built on Bun runtime.
- **Security**: OTPs are hashed (Argon2id) before storage. Plain text is never stored.
- **Type Safety**: End-to-end strict TypeScript.
- **Architecture**: SOLID principles with Repository and Service layers.

## Tech Stack
- **Runtime**: Bun
- **Framework**: ElysiaJS
- **Database**: SQLite (via `bun:sqlite`)
- **ORM**: Drizzle ORM
- **Styling**: TailwindCSS (configured for future UI usage)

## Quick Start

1. Install dependencies:
   ```bash
   bun install
   ```

2. Setup Database:
   ```bash
   bun drizzle-kit push
   ```

3. Setup Database:
   ```bash
   bun drizzle-kit push
   ```

4. Generate Private Key:
    ```bash
    bun run generate_key
    ```

5. Run Server:
   ```bash
   bun run src/index.ts
   ```

4. Development Mode:
   ```bash
   bun run --watch src/index.ts
   ```

## API Endpoints

### Generate OTP
- **URL**: `POST /api/otp/generate`
- **Response**: `{ "success": true, "otp": "AB12CD" }`

### Validate OTP
- **URL**: `POST /api/otp/validate`
- **Body**: `{ "code": "AB12CD" }`
- **Response**: `{ "success": 1, "message": "..." }`
