# OTPKEYS - Zero-Knowledge MFA Protocol for MOLTBOT

**OTPKEYS** is a security protocol designed for **MOLTBOT** instances. It allows AI Agents to perform critical tasks securely without ever knowing the secrets required to authorize them.

## 🛡️ The Problem
Standard "secrets" (like passwords) stored in files are accessible to the AI. If the AI is compromised or hallucinates, it can read the password and authorize itself.

## 🔐 The Solution: "Blind Pipe" Architecture
The AI Agent triggers a process but never sees the sensitive data.
1. **Agent** requests OTP generation via script (`blind_send.sh`).
2. **Server** generates OTP and returns it to the script (NOT the agent's chat context).
3. **Script** pipes the OTP directly to an email sender.
4. **User** receives OTP via email (out-of-band).
5. **User** provides OTP to Agent.
6. **Agent** validates OTP against the server via script (`validate_otp.sh`).
7. **Server** confirms validity. Agent executes task.

The Agent acts only as a **switch operator**, not a data holder.

## 🚀 Usage Guide for AI Agents

To implement OTPKEYS in your own MOLTBOT instance, follow these steps:

### 1. Requirements
- **Docker** (recommended) OR Bun runtime + SQLite.
- **Email Script:** A configured CLI tool to send emails (e.g., `mail.py` or `sendmail`).

### 2. Protocol Guidelines (When to Trigger)
The agent should trigger the **OTPKEYS** protocol for any **Critical Action**, defined as:
- Accessing/Viewing credentials or API keys.
- Deleting files or directories.
- **Modifying Core Identity/Config Files** (e.g., system instructions, security protocols).
- Creating new executable scripts.
- Modifying the security protocol itself.
- Stopping or restarting services.

### 3. Server Setup (Docker)
Ensure the service is running and exposing port `13500`.

```bash
cd otp_sender
docker-compose up -d
```

### 4. Integration Scripts

Create these scripts in your toolchain. Replace `/path/to/mail_script` with your actual mailer.

#### A. Blind Send Script (`blind_send.sh`)
*This script ensures the OTP is generated and sent without the AI printing it to logs.*

```bash
#!/bin/bash
# Configuration
API_URL="http://localhost:13500/api/otp/generate"
MAIL_SCRIPT="/path/to/your/mail_script.py"
TARGET_EMAIL="user@example.com"

# 1. Fetch OTP from API
RESPONSE=$(curl -s -X POST "$API_URL")

# 2. Extract OTP (using Python or jq)
OTP=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('otp', ''))")

# 3. Pipe to Mailer (Zero-Knowledge Step)
# Output is suppressed or strictly controlled. DO NOT ECHO THE OTP.
python3 "$MAIL_SCRIPT" send "$TARGET_EMAIL" "OTPKEYS Security Code" "Your OTP is: $OTP" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ OTP sent securely. Waiting for validation..."
else
    echo "❌ Error sending OTP."
    exit 1
fi
```

#### B. Validation Script (`validate_otp.sh`)
*The Agent calls this with the code provided by the user.*

```bash
#!/bin/bash
INPUT_CODE="$1"
API_URL="http://localhost:13500/api/otp/validate"
MAIL_SCRIPT="/path/to/your/mail_script.py"
TARGET_EMAIL="user@example.com"

# Validate against server
RESPONSE=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d "{\"code\": \"$INPUT_CODE\"}")
SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', 0))")

if [ "$SUCCESS" == "1" ]; then
    echo "ACCESS_GRANTED"
    exit 0
else
    echo "ACCESS_DENIED"
    # Security Alert Trigger
    python3 "$MAIL_SCRIPT" send "$TARGET_EMAIL" "⛔ OTPKEYS ALERT" "Failed validation attempt with code: $INPUT_CODE" > /dev/null 2>&1
    exit 1
fi
```
