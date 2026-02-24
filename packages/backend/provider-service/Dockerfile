FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/provider-service/package*.json ./packages/backend/provider-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/provider-service ./packages/backend/provider-service/

WORKDIR /app/packages/backend/provider-service

EXPOSE 3005

CMD ["npm", "run", "start:prod"]
