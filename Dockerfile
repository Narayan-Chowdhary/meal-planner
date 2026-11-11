# syntax=docker/dockerfile:1.7
#
# Multi-stage build:
#   deps  -> install npm dependencies (cached layer)
#   build -> produce the static Vite bundle
#   web   -> serve the bundle with an unprivileged nginx (default target)
#   api   -> json-server mock API serving db.json
#
# Build the web image:   docker build -t meal-planner-web .
# Build the API image:   docker build --target api -t meal-planner-api .
# Or simply:             docker compose up --build

ARG NODE_VERSION=24

# ---------- deps ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ---------- build ----------
FROM deps AS build
# Vite inlines VITE_* variables at build time, so they are build args.
# The API is reached through nginx on the same origin (/api/), which avoids CORS.
ARG VITE_API_BASE_URL=/api/
ARG VITE_GOOGLE_CLIENT_ID=""
ARG VITE_FIREBASE_DATABASE_URL=""
ARG VITE_CLOUDINARY_UPLOAD_URL=""
ARG VITE_RAZORPAY_KEY_ID=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_FIREBASE_DATABASE_URL=$VITE_FIREBASE_DATABASE_URL \
    VITE_CLOUDINARY_UPLOAD_URL=$VITE_CLOUDINARY_UPLOAD_URL \
    VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
COPY . .
RUN npm run build

# ---------- api ----------
FROM node:${NODE_VERSION}-alpine AS api
ENV NODE_ENV=production
WORKDIR /srv
# Install only json-server (version pinned to the one in package.json)
COPY package.json ./
RUN JSON_SERVER_VERSION=$(node -p "require('./package.json').devDependencies['json-server'].replace(/^[^0-9]*/, '')") \
 && npm install -g --no-audit --no-fund "json-server@${JSON_SERVER_VERSION}" \
 && rm package.json \
 && mkdir -p /data && chown node:node /data
# Seed data; mount a volume on /data to persist changes between restarts
COPY --chown=node:node db.json /data/db.json
USER node
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8000/layout >/dev/null || exit 1
CMD ["json-server", "/data/db.json", "--host", "0.0.0.0", "--port", "8000"]

# ---------- web (default) ----------
FROM nginxinc/nginx-unprivileged:1.29-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.inc /etc/nginx/snippets/security-headers.inc
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
