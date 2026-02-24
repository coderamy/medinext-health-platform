FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/notification-service/package*.json ./packages/backend/notification-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/notification-service ./packages/backend/notification-service/

WORKDIR /app/packages/backend/notification-service

EXPOSE 3015

CMD ["npm", "run", "start:prod"]
