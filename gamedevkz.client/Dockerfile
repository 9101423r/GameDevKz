# builder stage
FROM node:20.19-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

# Даем права на все исполняемые файлы
RUN chmod -R +x ./node_modules/.bin

COPY . .

RUN npm run build

RUN ls -la /app/.next

# production stage
FROM node:20.19-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --legacy-peer-deps --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]