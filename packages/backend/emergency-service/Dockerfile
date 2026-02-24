FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/emergency-service/package*.json ./packages/backend/emergency-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/emergency-service ./packages/backend/emergency-service/

WORKDIR /app/packages/backend/emergency-service

EXPOSE 3013

CMD ["npm", "run", "start:prod"]
