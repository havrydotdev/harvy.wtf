FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun i
COPY . .
RUN bun run build

FROM busybox:1.37 AS runner
WORKDIR /app
COPY --from=builder /app/prod .
CMD ["busybox", "httpd", "-f", "-v", "-p", "3001"]