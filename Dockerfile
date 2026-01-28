# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files and lockfile
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate private key if it doesn't exist (useful for first-time Docker runs)
RUN [ -f src/config/private.key.ts ] || bun run generate_key

# Expose the service port
EXPOSE 13500

# Start the application
CMD ["bun", "run", "src/index.ts"]
