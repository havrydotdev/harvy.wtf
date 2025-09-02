FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun i
COPY . .
RUN bun run build

FROM ghcr.io/havrydotdev/slimserve 
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["slimserve", "-p", "3001", "-e", "brotli"]