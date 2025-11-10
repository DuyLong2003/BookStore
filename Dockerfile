# ================================
# 1️⃣ Stage 1 - Builder
# ================================
FROM node:20-alpine AS builder

# Cài đặt dependencies cần thiết
RUN apk add --no-cache python3 make g++

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file cấu hình
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm dev)
RUN npm ci

# Sao chép toàn bộ mã nguồn
COPY . .

# Build dự án (tạo thư mục dist/)
RUN npm run build


# ================================
# 2️⃣ Stage 2 - Production
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy chỉ những file cần thiết để chạy app
COPY package*.json ./
RUN npm ci --omit=dev

# Copy mã đã build từ stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views
#COPY --from=builder /app/.env ./.env

# Mở port app
EXPOSE 8000

# ================================
# 3️⃣ HEALTHCHECK
# ================================
# Kiểm tra endpoint /healthz để đảm bảo app đang sống
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:8000/healthz || exit 1

# ================================
# 4️⃣ Chạy ứng dụng NestJS
# ================================
CMD ["node", "dist/main.js"]
