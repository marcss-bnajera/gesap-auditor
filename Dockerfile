FROM node:20-alpine AS builder

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["sh", "-c", "node_modules/.bin/prisma db push --accept-data-loss --skip-generate && node dist/main"]
