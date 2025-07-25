#!/bin/sh

# Exit on any error
set -e

# Run database migrations (safe for prod, does not require user interaction)
npx prisma migrate deploy

# Start your server (adjust if using a different command)
npm run start
