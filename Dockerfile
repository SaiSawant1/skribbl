# Stage 1: Build Go backend
FROM golang:1.21 AS backend-builder

WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend ./
RUN go build -o /app/skribbl-server ./cmd/main.go

# Stage 2: Build Next.js frontend
FROM node:18 AS frontend-builder

WORKDIR /app/frontend
COPY frontend-next/package*.json ./
RUN npm install

COPY frontend-next ./
RUN npm run build

# Stage 3: Final image
FROM debian:bullseye-slim

# Install dependencies to run Go + Node app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy Go server binary
COPY --from=backend-builder /app/skribbl-server /app/skribbl-server

# Copy frontend output
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/package.json
COPY --from=frontend-builder /app/frontend/node_modules /app/frontend/node_modules

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

WORKDIR /app
EXPOSE 3000
EXPOSE 8080

CMD ["./start.sh"]

