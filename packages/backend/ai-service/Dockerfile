FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/ai-service/package*.json ./packages/backend/ai-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/ai-service ./packages/backend/ai-service/

WORKDIR /app/packages/backend/ai-service

EXPOSE 3014

CMD ["npm", "run", "start:prod"]
