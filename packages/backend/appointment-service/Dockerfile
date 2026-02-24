FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/appointment-service/package*.json ./packages/backend/appointment-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/appointment-service ./packages/backend/appointment-service/

WORKDIR /app/packages/backend/appointment-service

EXPOSE 3003

CMD ["npm", "run", "start:prod"]
