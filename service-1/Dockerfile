FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm ci
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

EXPOSE ${APP_PORT}

CMD ["node", "dist/main"]
