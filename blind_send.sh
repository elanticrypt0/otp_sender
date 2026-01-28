#!/bin/bash
# URL of the local OTP service
API_URL="http://localhost:13500/api/otp/generate"
MAIL_SCRIPT="/home/USER/moltbot/mail.py"
USER_EMAIL="YOUR-EMAIL@YOUR-DOMAIN.X"

# 1. Call API
# 2. Parse JSON with Python (Zero dependencies)
# 3. Send via Mail
# The OTP never touches a log file or stdout of the agent context.

RESPONSE=$(curl -s -X POST "$API_URL")

# Check if curl failed
if [ -z "$RESPONSE" ]; then
    echo "Error: Failed to connect to OTP Server (Check port 13500)."
    exit 1
fi

OTP=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('otp', ''))")

if [ -z "$OTP" ]; then
    echo "Error: Failed to retrieve OTP from response."
    exit 1
fi

# Send Email
echo "Generating secure code..."
python3 "$MAIL_SCRIPT" send "$USER_EMAIL" "🔐 Security Code (OTP)" "Temporary validation code: $OTP" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Code sent to secure email. Waiting for validation..."
else
    echo "❌ Error sending email."
    exit 1
fi
