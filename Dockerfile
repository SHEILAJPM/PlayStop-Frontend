# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile

# ---- Stage 2: Build production bundle ----
FROM node:20-alpine AS build
WORKDIR /app
# Build args allow CI/CD to override .env.production values
ARG VITE_API_URL=https://playstop-backend-1.onrender.com
ARG VITE_APP_NAME=PlayStop
ARG VITE_ENV=production
ARG VITE_DEBUG=false
ARG VITE_FIREBASE_VAPID_KEY
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_ENV=$VITE_ENV \
    VITE_DEBUG=$VITE_DEBUG \
    VITE_FIREBASE_VAPID_KEY=$VITE_FIREBASE_VAPID_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage 3: Development with hot reload ----
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---- Stage 4: Production runtime (nginx) ----
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
