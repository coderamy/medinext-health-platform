FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/blood-bank-service/package*.json ./packages/backend/blood-bank-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/blood-bank-service ./packages/backend/blood-bank-service/

WORKDIR /app/packages/backend/blood-bank-service

EXPOSE 3009

CMD ["npm", "run", "start:prod"]
