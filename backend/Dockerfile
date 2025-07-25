# Stage 1: Build Prisma Client and install deps
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate


# Stage 2: Final container
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

# Ensure entrypoint is executable
RUN chmod +x /app/docker-entrypoint.sh

# Set environment
ENV NODE_ENV=production

# Use your script as entrypoint
CMD ["/app/docker-entrypoint.sh"]
