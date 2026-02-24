FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/hospital-service/package*.json ./packages/backend/hospital-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/hospital-service ./packages/backend/hospital-service/

WORKDIR /app/packages/backend/hospital-service

EXPOSE 3006

CMD ["npm", "run", "start:prod"]
