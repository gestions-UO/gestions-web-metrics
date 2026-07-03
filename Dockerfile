FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./
COPY turbo.json ./

COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/

RUN npm ci

COPY . .

RUN npx turbo run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/packages ./packages

EXPOSE 3000 3002

CMD ["node", "apps/api/dist/index.js"]
