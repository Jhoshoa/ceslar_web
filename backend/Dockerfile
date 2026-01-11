# Backend Dockerfile
# Node.js LTS version
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Development image
FROM base AS development
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Production image
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R expressjs:nodejs logs

# Switch to non-root user
USER expressjs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "src/index.js"]
