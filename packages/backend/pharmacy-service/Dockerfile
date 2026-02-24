FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/pharmacy-service/package*.json ./packages/backend/pharmacy-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/pharmacy-service ./packages/backend/pharmacy-service/

WORKDIR /app/packages/backend/pharmacy-service

EXPOSE 3007

CMD ["npm", "run", "start:prod"]
