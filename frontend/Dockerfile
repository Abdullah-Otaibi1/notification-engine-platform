# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# The Angular production build uses apiUrl:'' (relative URLs).
# Nginx proxies /api/ → backend:3000, so no API_URL build-arg is needed.

COPY .npmrc package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production Stage (Nginx) ----
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist/nep-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
