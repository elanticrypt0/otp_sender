#!/bin/bash
INPUT_CODE="$1"
API_URL="http://localhost:13500/api/otp/validate"
MAIL_SCRIPT="/home/USER/moltbot/mail.py"
USER_EMAIL="YOUR-EMAIL@YOUR-DOMAIN.X"

if [ -z "$INPUT_CODE" ]; then
    echo "Usage: ./validate_otp.sh <CODE>"
    exit 1
fi

# Validate
RESPONSE=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d "{\"code\": \"$INPUT_CODE\"}")
SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', 0))")

if [ "$SUCCESS" == "1" ] || [ "$SUCCESS" == "True" ] || [ "$SUCCESS" == "true" ]; then
    echo "ACCESS_GRANTED"
    exit 0
else
    echo "ACCESS_DENIED"
    # Security Alert
    python3 "$MAIL_SCRIPT" send "$USER_EMAIL" "⛔ SECURITY ALERT" "Failed OTP validation attempt with code: $INPUT_CODE. Possible unauthorized access attempt." > /dev/null 2>&1
    exit 1
fi
