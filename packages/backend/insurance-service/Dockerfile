FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/insurance-service/package*.json ./packages/backend/insurance-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/insurance-service ./packages/backend/insurance-service/

WORKDIR /app/packages/backend/insurance-service

EXPOSE 3012

CMD ["npm", "run", "start:prod"]
