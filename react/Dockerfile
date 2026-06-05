# ── Stage 1 : Build Vite ─────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Stage 2 : Serve avec nginx ───────────────────────────────
FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html

# Template nginx avec variables NGINX_RESOLVER et BACKEND_HOST
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
