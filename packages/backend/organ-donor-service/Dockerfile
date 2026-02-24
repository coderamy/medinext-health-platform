FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/organ-donor-service/package*.json ./packages/backend/organ-donor-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/organ-donor-service ./packages/backend/organ-donor-service/

WORKDIR /app/packages/backend/organ-donor-service

EXPOSE 3011

CMD ["npm", "run", "start:prod"]
