FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

# Copy source and assets required to compile the API
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Install all dependencies (including dev) for build
COPY package.json package-lock.json ./
ENV HUSKY=0
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD npx prisma db push --accept-data-loss && npm start
